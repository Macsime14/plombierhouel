import { getParametres } from "@/lib/domain/parametres";
import { ParametresForm } from "./ParametresForm";

export const metadata = { title: "Paramètres" };

export default async function ParametresPage() {
  const parametres = await getParametres();

  return (
    <div className="max-w-3xl">
      <h1 className="font-heading text-2xl font-semibold">
        Paramètres de l’entreprise
      </h1>
      <p className="mt-1 mb-6 text-sm text-text-muted">
        Ces informations apparaîtront sur les devis et les factures. À compléter avec les
        données définitives d’Antoine (et à faire valider par le comptable pour la partie TVA).
      </p>
      <ParametresForm parametres={parametres} />
    </div>
  );
}
