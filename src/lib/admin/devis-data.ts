import "server-only";

import { asc, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { clients, devis, devisLignes, prestations } from "@/lib/db/schema";

export async function optionsClients() {
  return db
    .select({ id: clients.id, nom: clients.nom })
    .from(clients)
    .orderBy(asc(clients.nom));
}

export async function optionsPrestations() {
  return db
    .select({
      id: prestations.id,
      libelle: prestations.libelle,
      unite: prestations.unite,
      puCents: prestations.puCents,
      tauxTva: prestations.tauxTva,
    })
    .from(prestations)
    .where(eq(prestations.actif, true))
    .orderBy(asc(prestations.libelle));
}

export async function chargerDevis(id: string) {
  const [d] = await db.select().from(devis).where(eq(devis.id, id)).limit(1);
  if (!d) return null;

  const [client] = await db.select().from(clients).where(eq(clients.id, d.clientId)).limit(1);

  const lignes = await db
    .select()
    .from(devisLignes)
    .where(eq(devisLignes.devisId, id))
    .orderBy(asc(devisLignes.ordre));

  return { devis: d, client, lignes };
}
