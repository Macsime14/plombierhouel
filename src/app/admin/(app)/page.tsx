import Link from "next/link";
import { and, count, gte, inArray } from "drizzle-orm";

import { db } from "@/lib/db";
import { demandes, devis, factures, interventions } from "@/lib/db/schema";
import { aujourdhuiParis, jourParisVersDate } from "@/lib/domain/dates";

export const metadata = { title: "Tableau de bord" };

async function compter() {
  const debutJour = jourParisVersDate(aujourdhuiParis());

  const [demandesATraiter, devisEnAttente, interventionsAVenir, facturesImpayees] =
    await Promise.all([
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
        .from(interventions)
        .where(
          and(
            gte(interventions.debut, debutJour),
            inArray(interventions.statut, ["planifie", "en_cours"]),
          ),
        ),
      db
        .select({ n: count() })
        .from(factures)
        .where(inArray(factures.statut, ["emise", "payee_partiel"])),
    ]);

  return {
    demandesATraiter: demandesATraiter[0].n,
    devisEnAttente: devisEnAttente[0].n,
    interventionsAVenir: interventionsAVenir[0].n,
    facturesImpayees: facturesImpayees[0].n,
  };
}

export default async function DashboardPage() {
  const stats = await compter();

  const cartes = [
    { label: "Demandes à traiter", valeur: stats.demandesATraiter, href: "/admin/demandes" },
    { label: "Devis en attente", valeur: stats.devisEnAttente, href: "/admin/devis" },
    { label: "Interventions à venir", valeur: stats.interventionsAVenir, href: "/admin/planning" },
    { label: "Factures impayées", valeur: stats.facturesImpayees, href: "/admin/factures" },
  ];

  return (
    <div>
      <h1 className="font-[family-name:var(--font-playfair)] text-2xl font-semibold">
        Tableau de bord
      </h1>
      <p className="mt-1 text-sm text-text-muted">Vue d’ensemble de l’activité.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cartes.map((carte) => (
          <Link
            key={carte.label}
            href={carte.href}
            className="rounded-lg border border-border bg-surface p-4 transition-colors hover:border-accent"
          >
            <p className="text-3xl font-semibold tabular-nums">{carte.valeur}</p>
            <p className="mt-1 text-sm text-text-muted">{carte.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-sm font-medium text-text-muted">Raccourcis</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          <Link
            href="/admin/devis/nouveau"
            className="rounded-md border border-border px-3 py-1.5 text-sm hover:border-accent"
          >
            + Nouveau devis
          </Link>
          <Link
            href="/admin/clients/nouveau"
            className="rounded-md border border-border px-3 py-1.5 text-sm hover:border-accent"
          >
            + Nouveau client
          </Link>
          <Link
            href="/admin/planning/nouveau"
            className="rounded-md border border-border px-3 py-1.5 text-sm hover:border-accent"
          >
            + Nouvelle intervention
          </Link>
        </div>
      </div>
    </div>
  );
}
