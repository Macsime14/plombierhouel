import Link from "next/link";

import { getContenuSiteRow } from "@/lib/domain/site-data";
import { PageTitre } from "@/components/admin/ui";
import { ContenuSiteForm } from "./ContenuSiteForm";

export const metadata = { title: "Contenu du site" };

export default async function SitePage() {
  const contenu = await getContenuSiteRow();

  return (
    <div className="max-w-3xl">
      <PageTitre
        titre="Contenu du site"
        description="Ce qui s’affiche sur le site public : identité, zone, présentation, photos."
      />
      <p className="mb-4 text-sm text-text-muted">
        Le téléphone, l’email, l’adresse et le SIRET affichés sur le site viennent des{" "}
        <Link href="/admin/parametres" className="text-accent hover:underline">
          Paramètres de l’entreprise
        </Link>
        .
      </p>
      <p className="mb-6 text-sm">
        <Link href="/admin/site/services" className="text-accent hover:underline">
          Gérer les services affichés →
        </Link>
      </p>
      <ContenuSiteForm contenu={contenu} />
    </div>
  );
}
