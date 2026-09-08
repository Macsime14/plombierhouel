import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/lib/db";
import { clients, demandes } from "@/lib/db/schema";
import { creerClientDepuisDemande } from "@/lib/admin/demandes-actions";
import { DEMANDE_STATUT_LABELS, type DemandeStatut } from "@/lib/admin/demande-statuts";
import { StatutSelect } from "../StatutSelect";
import { NotesForm } from "../NotesForm";

export const metadata = { title: "Demande" };

const dateFmt = new Intl.DateTimeFormat("fr-FR", { dateStyle: "long", timeStyle: "short" });

export default async function DemandePage({ params }: PageProps<"/admin/demandes/[id]">) {
  const { id } = await params;
  if (!z.string().uuid().safeParse(id).success) notFound();

  const [demande] = await db.select().from(demandes).where(eq(demandes.id, id)).limit(1);
  if (!demande) notFound();

  const client = demande.clientId
    ? (await db.select().from(clients).where(eq(clients.id, demande.clientId)).limit(1))[0]
    : null;

  return (
    <div className="max-w-2xl">
      <Link href="/admin/demandes" className="text-sm text-text-muted hover:underline">
        ← Demandes
      </Link>
      <h1 className="mt-2 font-heading text-2xl font-semibold">
        {demande.nom}
      </h1>
      <p className="mt-1 text-sm text-text-muted">Reçue le {dateFmt.format(demande.creeLe)}</p>

      <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
        <dt className="text-text-muted">Téléphone</dt>
        <dd>
          <a href={`tel:${demande.telephone}`} className="hover:underline">
            {demande.telephone}
          </a>
        </dd>
        <dt className="text-text-muted">Email</dt>
        <dd>
          <a href={`mailto:${demande.email}`} className="hover:underline">
            {demande.email}
          </a>
        </dd>
        <dt className="text-text-muted">Besoin</dt>
        <dd>{demande.typeBesoin}</dd>
        <dt className="text-text-muted">Statut</dt>
        <dd className="flex items-center gap-2">
          <StatutSelect id={demande.id} statut={demande.statut} />
          <span className="text-text-muted">
            ({DEMANDE_STATUT_LABELS[demande.statut as DemandeStatut]})
          </span>
        </dd>
      </dl>

      <div className="mt-6">
        <p className="text-sm font-medium">Message</p>
        <p className="mt-1 rounded-md border border-border bg-surface p-3 text-sm whitespace-pre-wrap">
          {demande.message}
        </p>
      </div>

      <div className="mt-6">
        {client ? (
          <p className="text-sm">
            Client lié :{" "}
            <Link href={`/admin/clients/${client.id}`} className="font-medium hover:underline">
              {client.nom}
            </Link>
          </p>
        ) : (
          <form action={creerClientDepuisDemande}>
            <input type="hidden" name="id" value={demande.id} />
            <button
              type="submit"
              className="cursor-pointer rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-on-accent hover:opacity-90"
            >
              Créer un client à partir de cette demande
            </button>
          </form>
        )}
      </div>

      <div className="mt-8 border-t border-border pt-6">
        <NotesForm id={demande.id} notes={demande.notes} />
      </div>
    </div>
  );
}
