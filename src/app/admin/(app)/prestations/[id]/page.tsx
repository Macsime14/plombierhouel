import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/lib/db";
import { prestations } from "@/lib/db/schema";
import { supprimerPrestation } from "@/lib/admin/prestations-actions";
import { PrestationForm } from "../PrestationForm";

export const metadata = { title: "Prestation" };

export default async function PrestationPage({ params }: PageProps<"/admin/prestations/[id]">) {
  const { id } = await params;
  if (!z.string().uuid().safeParse(id).success) notFound();

  const [prestation] = await db
    .select()
    .from(prestations)
    .where(eq(prestations.id, id))
    .limit(1);
  if (!prestation) notFound();

  return (
    <div className="max-w-2xl">
      <Link href="/admin/prestations" className="text-sm text-text-muted hover:underline">
        ← Catalogue
      </Link>
      <h1 className="mt-2 mb-6 font-heading text-2xl font-semibold">
        {prestation.libelle}
      </h1>

      <PrestationForm prestation={prestation} />

      <form action={supprimerPrestation} className="mt-10 border-t border-border pt-6">
        <input type="hidden" name="id" value={prestation.id} />
        <button type="submit" className="cursor-pointer text-sm text-red-600 hover:underline">
          Supprimer cette prestation
        </button>
        <p className="mt-1 text-xs text-text-muted">
          Les devis déjà créés ne sont pas affectés (les lignes y sont copiées).
        </p>
      </form>
    </div>
  );
}
