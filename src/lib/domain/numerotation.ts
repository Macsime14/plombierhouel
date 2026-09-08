import "server-only";

import { sql } from "drizzle-orm";

import { db } from "@/lib/db";
import { parametresEntreprise } from "@/lib/db/schema";
import { PARAMS_ID } from "./parametres";

type TypeDocument = "devis" | "facture" | "avoir";
type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];

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
 * Réserve le prochain numéro, sur une transaction existante.
 *
 * - Verrouille la ligne de paramètres (`FOR UPDATE`).
 * - Remet les trois compteurs à zéro au passage à une nouvelle année civile
 *   (numérotation continue par année : `F-2026-001`, `F-2026-002`, …).
 * - Les factures exigent une séquence sans rupture : appeler dans la même
 *   transaction que l'émission, jamais avant.
 */
export async function reserverNumeroDansTx(tx: Tx, type: TypeDocument): Promise<string> {
  const annee = new Date().getFullYear();
  const colonne = COLONNES[type];

  const [params] = await tx
    .select()
    .from(parametresEntreprise)
    .where(sql`${parametresEntreprise.id} = ${PARAMS_ID}`)
    .for("update");

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
}

/** Réserve un numéro dans sa propre transaction (usage : devis). */
export async function reserverNumero(type: TypeDocument): Promise<string> {
  return db.transaction((tx) => reserverNumeroDansTx(tx, type));
}
