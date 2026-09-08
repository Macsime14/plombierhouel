import Link from "next/link";
import { desc, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { clients, devis } from "@/lib/db/schema";
import { formaterEuros } from "@/lib/domain/montants";
import {
  DEVIS_STATUT_COULEURS,
  DEVIS_STATUT_LABELS,
  type DevisStatut,
} from "@/lib/admin/devis-statuts";

export const metadata = { title: "Devis" };

const dateFmt = new Intl.DateTimeFormat("fr-FR", { dateStyle: "short" });

export default async function DevisPage() {
  const liste = await db
    .select({
      id: devis.id,
      numero: devis.numero,
      statut: devis.statut,
      dateEmission: devis.dateEmission,
      totalTtcCents: devis.totalTtcCents,
      clientNom: clients.nom,
    })
    .from(devis)
    .leftJoin(clients, eq(devis.clientId, clients.id))
    .orderBy(desc(devis.creeLe));

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-[family-name:var(--font-playfair)] text-2xl font-semibold">Devis</h1>
        <Link
          href="/admin/devis/nouveau"
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-on-accent hover:opacity-90"
        >
          + Nouveau devis
        </Link>
      </div>

      {liste.length === 0 ? (
        <p className="mt-8 text-sm text-text-muted">Aucun devis pour l’instant.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-surface text-left text-text-muted">
              <tr>
                <th className="px-4 py-2 font-medium">Numéro</th>
                <th className="px-4 py-2 font-medium">Client</th>
                <th className="px-4 py-2 font-medium">Date</th>
                <th className="px-4 py-2 text-right font-medium">Total TTC</th>
                <th className="px-4 py-2 font-medium">Statut</th>
              </tr>
            </thead>
            <tbody>
              {liste.map((d) => (
                <tr key={d.id} className="border-t border-border hover:bg-surface">
                  <td className="px-4 py-2">
                    <Link href={`/admin/devis/${d.id}`} className="font-medium hover:underline">
                      {d.numero}
                    </Link>
                  </td>
                  <td className="px-4 py-2 text-text-muted">{d.clientNom ?? "—"}</td>
                  <td className="px-4 py-2 text-text-muted">{dateFmt.format(d.dateEmission)}</td>
                  <td className="px-4 py-2 text-right tabular-nums">
                    {formaterEuros(d.totalTtcCents)}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`inline-block rounded px-1.5 py-0.5 text-xs ${
                        DEVIS_STATUT_COULEURS[d.statut as DevisStatut]
                      }`}
                    >
                      {DEVIS_STATUT_LABELS[d.statut as DevisStatut]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
