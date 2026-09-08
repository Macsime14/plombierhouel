import Link from "next/link";

import { getParametres } from "@/lib/domain/parametres";
import { optionsClients, optionsPrestations } from "@/lib/admin/devis-data";
import { DevisEditor } from "../DevisEditor";

export const metadata = { title: "Nouveau devis" };

export default async function NouveauDevisPage({
  searchParams,
}: PageProps<"/admin/devis/nouveau">) {
  const [clients, prestations, params, sp] = await Promise.all([
    optionsClients(),
    optionsPrestations(),
    getParametres(),
    searchParams,
  ]);

  const clientPreselectionne = typeof sp.client === "string" ? sp.client : undefined;
  const demandeLiee = typeof sp.demande === "string" ? sp.demande : null;

  return (
    <div className="max-w-4xl">
      <Link href="/admin/devis" className="text-sm text-text-muted hover:underline">
        ← Devis
      </Link>
      <h1 className="mt-2 mb-6 font-heading text-2xl font-semibold">
        Nouveau devis
      </h1>

      {clients.length === 0 ? (
        <p className="text-sm text-text-muted">
          Il faut d’abord{" "}
          <Link href="/admin/clients/nouveau" className="text-accent hover:underline">
            créer un client
          </Link>
          .
        </p>
      ) : (
        <DevisEditor
          clients={clients}
          prestations={prestations}
          regimeTva={params.regimeTva}
          demandeId={demandeLiee}
          defaults={{
            clientId: clientPreselectionne,
            validiteJours: 30,
            lignes: [],
          }}
        />
      )}
    </div>
  );
}
