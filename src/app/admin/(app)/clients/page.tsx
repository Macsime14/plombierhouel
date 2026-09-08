import Link from "next/link";
import { desc } from "drizzle-orm";

import { db } from "@/lib/db";
import { clients } from "@/lib/db/schema";

export const metadata = { title: "Clients" };

export default async function ClientsPage() {
  const liste = await db
    .select({
      id: clients.id,
      nom: clients.nom,
      type: clients.type,
      villeFacturation: clients.villeFacturation,
      telephone: clients.telephone,
      creeLe: clients.creeLe,
    })
    .from(clients)
    .orderBy(desc(clients.creeLe));

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-[family-name:var(--font-playfair)] text-2xl font-semibold">Clients</h1>
        <Link
          href="/admin/clients/nouveau"
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-on-accent hover:opacity-90"
        >
          + Nouveau client
        </Link>
      </div>

      {liste.length === 0 ? (
        <p className="mt-8 text-sm text-text-muted">Aucun client pour l’instant.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-surface text-left text-text-muted">
              <tr>
                <th className="px-4 py-2 font-medium">Nom</th>
                <th className="px-4 py-2 font-medium">Type</th>
                <th className="px-4 py-2 font-medium">Ville</th>
                <th className="px-4 py-2 font-medium">Téléphone</th>
              </tr>
            </thead>
            <tbody>
              {liste.map((c) => (
                <tr key={c.id} className="border-t border-border hover:bg-surface">
                  <td className="px-4 py-2">
                    <Link href={`/admin/clients/${c.id}`} className="font-medium hover:underline">
                      {c.nom}
                    </Link>
                  </td>
                  <td className="px-4 py-2 text-text-muted">
                    {c.type === "pro" ? "Professionnel" : "Particulier"}
                  </td>
                  <td className="px-4 py-2 text-text-muted">{c.villeFacturation ?? "—"}</td>
                  <td className="px-4 py-2 text-text-muted">{c.telephone ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
