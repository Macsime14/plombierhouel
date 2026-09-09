import Link from "next/link";
import { ServiceForm } from "../ServiceForm";

export const metadata = { title: "Nouveau service" };

export default function NouveauServicePage() {
  return (
    <div className="max-w-2xl">
      <Link href="/admin/site/services" className="text-sm text-text-muted hover:underline">
        ← Services du site
      </Link>
      <h1 className="mt-2 mb-6 font-heading text-2xl font-semibold">Nouveau service</h1>
      <ServiceForm />
    </div>
  );
}
