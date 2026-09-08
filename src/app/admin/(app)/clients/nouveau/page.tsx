import Link from "next/link";
import { ClientForm } from "../ClientForm";

export const metadata = { title: "Nouveau client" };

export default function NouveauClientPage() {
  return (
    <div className="max-w-3xl">
      <Link href="/admin/clients" className="text-sm text-text-muted hover:underline">
        ← Clients
      </Link>
      <h1 className="mt-2 mb-6 font-heading text-2xl font-semibold">
        Nouveau client
      </h1>
      <ClientForm />
    </div>
  );
}
