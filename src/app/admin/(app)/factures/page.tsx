import Link from "next/link";

import { listeFactures } from "@/lib/admin/factures-data";
import { formaterEuros } from "@/lib/domain/montants";
import {
  FACTURE_STATUT_COULEURS,
  FACTURE_STATUT_LABELS,
  type FactureStatut,
} from "@/lib/admin/facture-statuts";

export const metadata = { title: "Factures" };

const dateFmt = new Intl.DateTimeFormat("fr-FR", { dateStyle: "short", timeZone: "Europe/Paris" });

export default async function FacturesPage() {
  const liste = await listeFactures();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-semibold">Factures</h1>
        <div className="flex gap-2">
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- route de téléchargement, pas une page */}
          <a
            href="/admin/factures/export"
            className="rounded-md border border-border px-3 py-2 text-sm hover:border-accent"
          >
            Export comptable (.csv)
          </a>
          <Link
            href="/admin/factures/nouvelle"
            className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-on-accent hover:opacity-90"
          >
            + Nouvelle facture
          </Link>
        </div>
      </div>

      {liste.length === 0 ? (
        <p className="mt-8 text-sm text-text-muted">Aucune facture pour l’instant.</p>
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
              {liste.map((f) => (
                <tr key={f.id} className="border-t border-border hover:bg-surface">
                  <td className="px-4 py-2">
                    <Link href={`/admin/factures/${f.id}`} className="font-medium hover:underline">
                      {f.numero ?? "Brouillon"}
                    </Link>
                  </td>
                  <td className="px-4 py-2 text-text-muted">{f.clientNom ?? "—"}</td>
                  <td className="px-4 py-2 text-text-muted">
                    {f.numero ? dateFmt.format(f.dateEmission) : "—"}
                  </td>
                  <td className="px-4 py-2 text-right tabular-nums">
                    {formaterEuros(f.totalTtcCents)}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`inline-block rounded px-1.5 py-0.5 text-xs ${
                        FACTURE_STATUT_COULEURS[f.statut as FactureStatut]
                      }`}
                    >
                      {FACTURE_STATUT_LABELS[f.statut as FactureStatut]}
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
