import Link from "next/link";

import { optionsClients } from "@/lib/admin/devis-data";
import { InterventionForm } from "../InterventionForm";

export const metadata = { title: "Nouvelle intervention" };

export default async function NouvelleInterventionPage({
  searchParams,
}: PageProps<"/admin/planning/nouveau">) {
  const [clients, sp] = await Promise.all([optionsClients(), searchParams]);

  const str = (v: unknown) => (typeof v === "string" ? v : undefined);

  return (
    <div className="max-w-2xl">
      <Link href="/admin/planning" className="text-sm text-text-muted hover:underline">
        ← Planning
      </Link>
      <h1 className="mt-2 mb-6 font-[family-name:var(--font-playfair)] text-2xl font-semibold">
        Nouvelle intervention
      </h1>
      <InterventionForm
        clients={clients}
        defaults={{
          titre: str(sp.titre),
          clientId: str(sp.client) ?? null,
          devisId: str(sp.devis) ?? null,
          adresse: str(sp.adresse) ?? null,
        }}
      />
    </div>
  );
}
