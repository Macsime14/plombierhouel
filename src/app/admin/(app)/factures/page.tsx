import Link from "next/link";

import { listeFactures } from "@/lib/admin/factures-data";
import { formaterEuros } from "@/lib/domain/montants";
import {
  FACTURE_STATUT_LABELS,
  FACTURE_STATUT_TONE,
  type FactureStatut,
} from "@/lib/admin/facture-statuts";
import { Bouton, PageTitre, Statut } from "@/components/admin/ui";

export const metadata = { title: "Factures" };

const dateFmt = new Intl.DateTimeFormat("fr-FR", { dateStyle: "short", timeZone: "Europe/Paris" });

export default async function FacturesPage() {
  const liste = await listeFactures();

  return (
    <div>
      <PageTitre
        titre="Factures"
        action={
          <>
            <Bouton href="/admin/factures/export" variant="ghost">
              Export comptable (.csv)
            </Bouton>
            <Bouton href="/admin/factures/nouvelle">+ Nouvelle facture</Bouton>
          </>
        }
      />

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
                    <Statut tone={FACTURE_STATUT_TONE[f.statut as FactureStatut]}>
                      {FACTURE_STATUT_LABELS[f.statut as FactureStatut]}
                    </Statut>
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
