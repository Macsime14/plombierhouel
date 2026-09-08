import Link from "next/link";
import { PrestationForm } from "../PrestationForm";

export const metadata = { title: "Nouvelle prestation" };

export default function NouvellePrestationPage() {
  return (
    <div className="max-w-2xl">
      <Link href="/admin/prestations" className="text-sm text-text-muted hover:underline">
        ← Catalogue
      </Link>
      <h1 className="mt-2 mb-6 font-[family-name:var(--font-playfair)] text-2xl font-semibold">
        Nouvelle prestation
      </h1>
      <PrestationForm />
    </div>
  );
}
