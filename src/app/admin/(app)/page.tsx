import Link from "next/link";
import { count, inArray } from "drizzle-orm";

import { db } from "@/lib/db";
import { clients, demandes } from "@/lib/db/schema";

export const metadata = { title: "Tableau de bord" };

async function compter() {
  const [demandesATraiter] = await db
    .select({ n: count() })
    .from(demandes)
    .where(inArray(demandes.statut, ["nouveau", "a_rappeler"]));
  const [nbClients] = await db.select({ n: count() }).from(clients);
  return { demandesATraiter: demandesATraiter.n, nbClients: nbClients.n };
}

export default async function DashboardPage() {
  const stats = await compter();

  const cartes = [
    { label: "Demandes à traiter", valeur: stats.demandesATraiter, href: "/admin/demandes" },
    { label: "Clients", valeur: stats.nbClients, href: "/admin/clients" },
    { label: "Devis en attente", valeur: "—", href: "/admin/devis", indispo: true },
    { label: "Factures impayées", valeur: "—", href: "/admin/factures", indispo: true },
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
            <p className="mt-1 text-sm text-text-muted">
              {carte.label}
              {carte.indispo ? " (bientôt)" : ""}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-sm font-medium text-text-muted">Raccourcis</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          <Link
            href="/admin/clients/nouveau"
            className="rounded-md border border-border px-3 py-1.5 text-sm hover:border-accent"
          >
            + Nouveau client
          </Link>
          <Link
            href="/admin/parametres"
            className="rounded-md border border-border px-3 py-1.5 text-sm hover:border-accent"
          >
            Paramètres de l’entreprise
          </Link>
        </div>
      </div>
    </div>
  );
}
