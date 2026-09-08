import Link from "next/link";
import { asc } from "drizzle-orm";

import { db } from "@/lib/db";
import { prestations } from "@/lib/db/schema";
import { formaterEuros } from "@/lib/domain/montants";

export const metadata = { title: "Catalogue de prestations" };

export default async function PrestationsPage() {
  const liste = await db.select().from(prestations).orderBy(asc(prestations.libelle));

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-[family-name:var(--font-playfair)] text-2xl font-semibold">
          Catalogue de prestations
        </h1>
        <Link
          href="/admin/prestations/nouveau"
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-on-accent hover:opacity-90"
        >
          + Nouvelle prestation
        </Link>
      </div>
      <p className="mt-1 mb-6 text-sm text-text-muted">
        Lignes réutilisables pour composer les devis plus vite.
      </p>

      {liste.length === 0 ? (
        <p className="mt-8 text-sm text-text-muted">Aucune prestation pour l’instant.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-surface text-left text-text-muted">
              <tr>
                <th className="px-4 py-2 font-medium">Libellé</th>
                <th className="px-4 py-2 font-medium">Unité</th>
                <th className="px-4 py-2 text-right font-medium">PU HT</th>
                <th className="px-4 py-2 text-right font-medium">TVA</th>
                <th className="px-4 py-2 font-medium">État</th>
              </tr>
            </thead>
            <tbody>
              {liste.map((p) => (
                <tr key={p.id} className="border-t border-border hover:bg-surface">
                  <td className="px-4 py-2">
                    <Link href={`/admin/prestations/${p.id}`} className="font-medium hover:underline">
                      {p.libelle}
                    </Link>
                  </td>
                  <td className="px-4 py-2 text-text-muted">{p.unite}</td>
                  <td className="px-4 py-2 text-right tabular-nums">{formaterEuros(p.puCents)}</td>
                  <td className="px-4 py-2 text-right tabular-nums text-text-muted">
                    {Number(p.tauxTva)} %
                  </td>
                  <td className="px-4 py-2 text-text-muted">{p.actif ? "Active" : "Inactive"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
