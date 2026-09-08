import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/lib/db";
import { clients } from "@/lib/db/schema";
import { supprimerClient } from "@/lib/admin/clients-actions";
import { ClientForm } from "../ClientForm";

export const metadata = { title: "Fiche client" };

export default async function ClientPage({ params }: PageProps<"/admin/clients/[id]">) {
  const { id } = await params;
  if (!z.string().uuid().safeParse(id).success) notFound();

  const [client] = await db.select().from(clients).where(eq(clients.id, id)).limit(1);
  if (!client) notFound();

  return (
    <div className="max-w-3xl">
      <Link href="/admin/clients" className="text-sm text-text-muted hover:underline">
        ← Clients
      </Link>
      <h1 className="mt-2 mb-6 font-[family-name:var(--font-playfair)] text-2xl font-semibold">
        {client.nom}
      </h1>

      <ClientForm client={client} />

      <form
        action={supprimerClient}
        className="mt-10 border-t border-border pt-6"
      >
        <input type="hidden" name="id" value={client.id} />
        <button
          type="submit"
          className="cursor-pointer text-sm text-red-600 hover:underline"
        >
          Supprimer ce client
        </button>
        <p className="mt-1 text-xs text-text-muted">
          Impossible si le client a déjà des devis ou des factures.
        </p>
      </form>
    </div>
  );
}
