import "server-only";

import { and, asc, eq, gte, lt } from "drizzle-orm";

import { db } from "@/lib/db";
import { clients, interventions } from "@/lib/db/schema";

export type InterventionListe = {
  id: string;
  titre: string;
  debut: Date;
  fin: Date;
  statut: string;
  adresse: string | null;
  clientNom: string | null;
};

/** Interventions dont le début est dans [du, au). */
export async function interventionsDansPeriode(du: Date, au: Date): Promise<InterventionListe[]> {
  return db
    .select({
      id: interventions.id,
      titre: interventions.titre,
      debut: interventions.debut,
      fin: interventions.fin,
      statut: interventions.statut,
      adresse: interventions.adresse,
      clientNom: clients.nom,
    })
    .from(interventions)
    .leftJoin(clients, eq(interventions.clientId, clients.id))
    .where(and(gte(interventions.debut, du), lt(interventions.debut, au)))
    .orderBy(asc(interventions.debut));
}

export async function chargerIntervention(id: string) {
  const [i] = await db.select().from(interventions).where(eq(interventions.id, id)).limit(1);
  if (!i) return null;
  const client = i.clientId
    ? (await db.select().from(clients).where(eq(clients.id, i.clientId)).limit(1))[0]
    : null;
  return { intervention: i, client };
}
