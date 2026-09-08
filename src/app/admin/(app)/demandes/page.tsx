import Link from "next/link";
import { desc } from "drizzle-orm";

import { db } from "@/lib/db";
import { demandes } from "@/lib/db/schema";
import {
  DEMANDE_STATUT_COULEURS,
  DEMANDE_STATUT_LABELS,
  type DemandeStatut,
} from "@/lib/admin/demande-statuts";
import { StatutSelect } from "./StatutSelect";

export const metadata = { title: "Demandes" };

const dateFmt = new Intl.DateTimeFormat("fr-FR", { dateStyle: "short", timeStyle: "short" });

export default async function DemandesPage() {
  const liste = await db.select().from(demandes).orderBy(desc(demandes.creeLe));

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold">Demandes</h1>
      <p className="mt-1 mb-6 text-sm text-text-muted">
        Demandes reçues via le formulaire de contact du site.
      </p>

      {liste.length === 0 ? (
        <p className="mt-8 text-sm text-text-muted">Aucune demande pour l’instant.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-surface text-left text-text-muted">
              <tr>
                <th className="px-4 py-2 font-medium">Reçue le</th>
                <th className="px-4 py-2 font-medium">Nom</th>
                <th className="px-4 py-2 font-medium">Besoin</th>
                <th className="px-4 py-2 font-medium">Statut</th>
              </tr>
            </thead>
            <tbody>
              {liste.map((d) => (
                <tr key={d.id} className="border-t border-border align-top hover:bg-surface">
                  <td className="px-4 py-2 whitespace-nowrap text-text-muted">
                    {dateFmt.format(d.creeLe)}
                  </td>
                  <td className="px-4 py-2">
                    <Link href={`/admin/demandes/${d.id}`} className="font-medium hover:underline">
                      {d.nom}
                    </Link>
                    <div className="text-xs text-text-muted">{d.telephone}</div>
                  </td>
                  <td className="px-4 py-2 text-text-muted">{d.typeBesoin}</td>
                  <td className="px-4 py-2">
                    <StatutSelect id={d.id} statut={d.statut} />
                    <span
                      className={`mt-1 inline-block rounded px-1.5 py-0.5 text-xs ${
                        DEMANDE_STATUT_COULEURS[d.statut as DemandeStatut]
                      }`}
                    >
                      {DEMANDE_STATUT_LABELS[d.statut as DemandeStatut]}
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
