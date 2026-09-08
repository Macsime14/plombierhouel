import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";

import { optionsClients } from "@/lib/admin/devis-data";
import { chargerIntervention } from "@/lib/admin/interventions-data";
import { supprimerIntervention } from "@/lib/admin/interventions-actions";
import { InterventionForm } from "../InterventionForm";

export const metadata = { title: "Intervention" };

export default async function InterventionPage({ params }: PageProps<"/admin/planning/[id]">) {
  const { id } = await params;
  if (!z.string().uuid().safeParse(id).success) notFound();

  const [data, clients] = await Promise.all([chargerIntervention(id), optionsClients()]);
  if (!data) notFound();

  return (
    <div className="max-w-2xl">
      <Link href="/admin/planning" className="text-sm text-text-muted hover:underline">
        ← Planning
      </Link>

      <div className="mt-2 mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-[family-name:var(--font-playfair)] text-2xl font-semibold">
          {data.intervention.titre}
        </h1>
        <a
          href={`/admin/planning/${data.intervention.id}/ics`}
          className="rounded-md border border-border px-3 py-1.5 text-sm hover:border-accent"
        >
          Ajouter à mon agenda (.ics)
        </a>
      </div>

      {data.intervention.devisId ? (
        <p className="mb-4 text-sm">
          <Link
            href={`/admin/devis/${data.intervention.devisId}`}
            className="text-accent hover:underline"
          >
            Devis lié
          </Link>
        </p>
      ) : null}

      <InterventionForm clients={clients} intervention={data.intervention} />

      <form action={supprimerIntervention} className="mt-10 border-t border-border pt-6">
        <input type="hidden" name="id" value={data.intervention.id} />
        <button type="submit" className="cursor-pointer text-sm text-red-600 hover:underline">
          Supprimer cette intervention
        </button>
      </form>
    </div>
  );
}
