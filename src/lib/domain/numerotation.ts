import "server-only";

import { sql } from "drizzle-orm";

import { db } from "@/lib/db";
import { parametresEntreprise } from "@/lib/db/schema";
import { PARAMS_ID } from "./parametres";

type TypeDocument = "devis" | "facture" | "avoir";

const PREFIXES: Record<TypeDocument, string> = {
  devis: "D",
  facture: "F",
  avoir: "AV",
};

const COLONNES: Record<TypeDocument, "compteurDevis" | "compteurFacture" | "compteurAvoir"> = {
  devis: "compteurDevis",
  facture: "compteurFacture",
  avoir: "compteurAvoir",
};

/**
 * Réserve le prochain numéro pour un type de document, de façon **atomique**.
 *
 * - Verrouille la ligne de paramètres le temps de la transaction.
 * - Remet les trois compteurs à zéro au passage à une nouvelle année civile
 *   (numérotation continue par année : `D-2026-001`, `D-2026-002`, …).
 * - Les factures exigent une séquence sans rupture : ne réserver un numéro
 *   qu'au moment de l'émission définitive.
 */
export async function reserverNumero(type: TypeDocument): Promise<string> {
  const annee = new Date().getFullYear();
  const colonne = COLONNES[type];

  return db.transaction(async (tx) => {
    const [params] = await tx
      .select()
      .from(parametresEntreprise)
      .where(sql`${parametresEntreprise.id} = ${PARAMS_ID}`)
      .for("update");

    // La ligne de paramètres n'existe pas encore : on la crée.
    if (!params) {
      await tx.insert(parametresEntreprise).values({ id: PARAMS_ID, anneeCompteurs: annee });
    }

    const anneeCourante = params?.anneeCompteurs ?? annee;
    const changementAnnee = anneeCourante !== annee;

    const compteurActuel = changementAnnee ? 0 : (params?.[colonne] ?? 0);
    const prochain = compteurActuel + 1;

    const maj: Record<string, number> = { [colonne]: prochain };
    if (changementAnnee) {
      maj.anneeCompteurs = annee;
      maj.compteurDevis = type === "devis" ? prochain : 0;
      maj.compteurFacture = type === "facture" ? prochain : 0;
      maj.compteurAvoir = type === "avoir" ? prochain : 0;
    }

    await tx
      .update(parametresEntreprise)
      .set({ ...maj, majLe: new Date() })
      .where(sql`${parametresEntreprise.id} = ${PARAMS_ID}`);

    return `${PREFIXES[type]}-${annee}-${String(prochain).padStart(3, "0")}`;
  });
}
