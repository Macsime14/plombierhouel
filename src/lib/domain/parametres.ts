import "server-only";

import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { parametresEntreprise } from "@/lib/db/schema";

export type Parametres = typeof parametresEntreprise.$inferSelect;

const PARAMS_ID = 1;

const defauts: Parametres = {
  id: PARAMS_ID,
  raisonSociale: null,
  formeJuridique: null,
  siret: null,
  tvaIntracom: null,
  adresse: null,
  codePostal: null,
  ville: null,
  telephone: null,
  email: null,
  iban: null,
  bic: null,
  regimeTva: "reel",
  assuranceDecennaleAssureur: null,
  assuranceDecennaleContrat: null,
  assuranceDecennaleZone: null,
  mentionsDevis: null,
  mentionsFacture: null,
  penalitesRetardTaux: null,
  anneeCompteurs: 0,
  compteurDevis: 0,
  compteurFacture: 0,
  compteurAvoir: 0,
  majLe: new Date(0),
};

/** Renvoie la ligne unique de paramètres, ou des valeurs par défaut si elle n'existe pas encore. */
export async function getParametres(): Promise<Parametres> {
  const [row] = await db
    .select()
    .from(parametresEntreprise)
    .where(eq(parametresEntreprise.id, PARAMS_ID))
    .limit(1);
  return row ?? defauts;
}

type ParametresModifiables = Partial<
  Omit<
    Parametres,
    "id" | "anneeCompteurs" | "compteurDevis" | "compteurFacture" | "compteurAvoir" | "majLe"
  >
>;

/** Insère ou met à jour la ligne unique de paramètres. */
export async function upsertParametres(valeurs: ParametresModifiables): Promise<void> {
  await db
    .insert(parametresEntreprise)
    .values({ id: PARAMS_ID, ...valeurs, majLe: new Date() })
    .onConflictDoUpdate({
      target: parametresEntreprise.id,
      set: { ...valeurs, majLe: new Date() },
    });
}

export { PARAMS_ID };
