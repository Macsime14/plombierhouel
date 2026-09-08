import "server-only";

import { asc, desc, eq, sum } from "drizzle-orm";

import { db } from "@/lib/db";
import {
  avoirs,
  clients,
  factureJournal,
  factureLignes,
  factures,
  paiements,
} from "@/lib/db/schema";

export async function listeFactures() {
  return db
    .select({
      id: factures.id,
      numero: factures.numero,
      statut: factures.statut,
      dateEmission: factures.dateEmission,
      totalTtcCents: factures.totalTtcCents,
      clientNom: clients.nom,
    })
    .from(factures)
    .leftJoin(clients, eq(factures.clientId, clients.id))
    .orderBy(desc(factures.creeLe));
}

export async function chargerFacture(id: string) {
  const [f] = await db.select().from(factures).where(eq(factures.id, id)).limit(1);
  if (!f) return null;

  const [client] = await db.select().from(clients).where(eq(clients.id, f.clientId)).limit(1);

  const lignes = await db
    .select()
    .from(factureLignes)
    .where(eq(factureLignes.factureId, id))
    .orderBy(asc(factureLignes.ordre));

  const paiementsListe = await db
    .select()
    .from(paiements)
    .where(eq(paiements.factureId, id))
    .orderBy(asc(paiements.date));

  const avoirsListe = await db
    .select()
    .from(avoirs)
    .where(eq(avoirs.factureId, id))
    .orderBy(asc(avoirs.dateEmission));

  const journal = await db
    .select()
    .from(factureJournal)
    .where(eq(factureJournal.factureId, id))
    .orderBy(asc(factureJournal.horodatage));

  const [{ total } = { total: null }] = await db
    .select({ total: sum(paiements.montantCents) })
    .from(paiements)
    .where(eq(paiements.factureId, id));

  return {
    facture: f,
    client,
    lignes,
    paiements: paiementsListe,
    avoirs: avoirsListe,
    journal,
    totalPayeCents: Number(total ?? 0),
  };
}

/** Dernier hash du journal d'une facture (pour chaîner la prochaine entrée). */
export async function dernierHashJournal(factureId: string): Promise<string | null> {
  const [row] = await db
    .select({ hash: factureJournal.hash })
    .from(factureJournal)
    .where(eq(factureJournal.factureId, factureId))
    .orderBy(desc(factureJournal.horodatage))
    .limit(1);
  return row?.hash ?? null;
}
