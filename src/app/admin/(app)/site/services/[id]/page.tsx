import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";

import { getServiceSite } from "@/lib/domain/services-site";
import { ServiceForm } from "../ServiceForm";

export const metadata = { title: "Service" };

export default async function ServiceSitePage({
  params,
}: PageProps<"/admin/site/services/[id]">) {
  const { id } = await params;
  if (!z.string().uuid().safeParse(id).success) notFound();

  const service = await getServiceSite(id);
  if (!service) notFound();

  return (
    <div className="max-w-2xl">
      <Link href="/admin/site/services" className="text-sm text-text-muted hover:underline">
        ← Services du site
      </Link>
      <h1 className="mt-2 mb-6 font-heading text-2xl font-semibold">{service.titre}</h1>
      <ServiceForm service={service} />
    </div>
  );
}
