import "server-only";

import { and, count, desc, eq, gte, inArray, lt, sum } from "drizzle-orm";

import { db } from "@/lib/db";
import { clients, demandes, devis, factures, interventions, paiements } from "@/lib/db/schema";
import { aujourdhuiParis, ajouterJours, jourParisVersDate } from "@/lib/domain/dates";

export async function chargerDashboard() {
  const maintenant = new Date();
  const debutMois = new Date(maintenant.getFullYear(), maintenant.getMonth(), 1);
  const relanceAvant = new Date(maintenant.getTime() - 7 * 24 * 60 * 60 * 1000);

  const jourDebut = jourParisVersDate(aujourdhuiParis());
  const jourFin = jourParisVersDate(ajouterJours(aujourdhuiParis(), 2));

  const [
    demandesAQualifier,
    devisEnAttente,
    devisARelancer,
    facturesEchues,
    encaisseMois,
    interventionsProches,
    devisRecents,
    facturesRecentes,
  ] = await Promise.all([
    db
      .select({ n: count() })
      .from(demandes)
      .where(inArray(demandes.statut, ["nouveau", "a_rappeler"])),

    db
      .select({ n: count() })
      .from(devis)
      .where(inArray(devis.statut, ["envoye", "vu"])),

    db
      .select({ n: count() })
      .from(devis)
      .where(and(inArray(devis.statut, ["envoye", "vu"]), lt(devis.envoyeLe, relanceAvant))),

    db
      .select({ n: count(), montant: sum(factures.totalTtcCents) })
      .from(factures)
      .where(
        and(
          inArray(factures.statut, ["emise", "payee_partiel"]),
          lt(factures.dateEcheance, maintenant),
        ),
      ),

    db
      .select({ total: sum(paiements.montantCents) })
      .from(paiements)
      .where(gte(paiements.date, debutMois)),

    db
      .select({
        id: interventions.id,
        titre: interventions.titre,
        debut: interventions.debut,
        fin: interventions.fin,
        statut: interventions.statut,
        clientNom: clients.nom,
      })
      .from(interventions)
      .leftJoin(clients, eq(interventions.clientId, clients.id))
      .where(
        and(
          gte(interventions.debut, jourDebut),
          lt(interventions.debut, jourFin),
          inArray(interventions.statut, ["planifie", "en_cours"]),
        ),
      )
      .orderBy(interventions.debut),

    db
      .select({
        id: devis.id,
        numero: devis.numero,
        statut: devis.statut,
        totalTtcCents: devis.totalTtcCents,
        clientNom: clients.nom,
        creeLe: devis.creeLe,
      })
      .from(devis)
      .leftJoin(clients, eq(devis.clientId, clients.id))
      .orderBy(desc(devis.creeLe))
      .limit(5),

    db
      .select({
        id: factures.id,
        numero: factures.numero,
        statut: factures.statut,
        totalTtcCents: factures.totalTtcCents,
        clientNom: clients.nom,
        creeLe: factures.creeLe,
      })
      .from(factures)
      .leftJoin(clients, eq(factures.clientId, clients.id))
      .orderBy(desc(factures.creeLe))
      .limit(5),
  ]);

  return {
    demandesAQualifier: demandesAQualifier[0].n,
    devisEnAttente: devisEnAttente[0].n,
    devisARelancer: devisARelancer[0].n,
    facturesEchues: facturesEchues[0].n,
    facturesEchuesMontantCents: Number(facturesEchues[0].montant ?? 0),
    encaisseMoisCents: Number(encaisseMois[0].total ?? 0),
    interventionsProches,
    devisRecents,
    facturesRecentes,
  };
}
