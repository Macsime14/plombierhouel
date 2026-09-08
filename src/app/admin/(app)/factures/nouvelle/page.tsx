import Link from "next/link";

import { getParametres } from "@/lib/domain/parametres";
import { optionsClients, optionsPrestations } from "@/lib/admin/devis-data";
import { FactureEditor } from "../FactureEditor";

export const metadata = { title: "Nouvelle facture" };

export default async function NouvelleFacturePage({
  searchParams,
}: PageProps<"/admin/factures/nouvelle">) {
  const [clients, prestations, params, sp] = await Promise.all([
    optionsClients(),
    optionsPrestations(),
    getParametres(),
    searchParams,
  ]);
  const clientId = typeof sp.client === "string" ? sp.client : undefined;

  return (
    <div className="max-w-4xl">
      <Link href="/admin/factures" className="text-sm text-text-muted hover:underline">
        ← Factures
      </Link>
      <h1 className="mt-2 mb-2 font-[family-name:var(--font-playfair)] text-2xl font-semibold">
        Nouvelle facture
      </h1>
      <p className="mb-6 text-sm text-text-muted">
        Vous créez un <strong>brouillon</strong>. Le numéro et la date définitifs seront attribués
        au moment de l’émission.
      </p>

      {clients.length === 0 ? (
        <p className="text-sm text-text-muted">
          Il faut d’abord{" "}
          <Link href="/admin/clients/nouveau" className="text-accent hover:underline">
            créer un client
          </Link>
          .
        </p>
      ) : (
        <FactureEditor
          clients={clients}
          prestations={prestations}
          regimeTva={params.regimeTva}
          defaults={{ clientId, lignes: [] }}
        />
      )}
    </div>
  );
}
