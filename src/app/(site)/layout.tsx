import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getSiteData } from "@/lib/domain/site-data";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteData();
  return {
    metadataBase: new URL(site.url),
    title: {
      default: `${site.companyName} — Plombier chauffagiste à ${site.areaDescription}`,
      template: `%s | ${site.companyName}`,
    },
    description: `${site.companyName}, plombier chauffagiste à ${site.areaDescription} : dépannage, chauffage, pompe à chaleur, climatisation, sanitaires et rénovation. Devis gratuit.`,
    openGraph: {
      title: site.companyName,
      description: site.tagline,
      images: ["/images/logo.png"],
      locale: "fr_FR",
      type: "website",
    },
  };
}

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const site = await getSiteData();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["Plumber", "HVACBusiness"],
    name: site.companyName,
    telephone: site.phone,
    email: site.email,
    address: site.address,
    areaServed: site.areaDescription,
    url: site.url,
  };

  return (
    <div className="flex min-h-full flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header
        companyName={site.companyName}
        phone={site.phone}
        phoneHref={site.phoneHref}
      />
      <main className="flex-1">{children}</main>
      <Footer site={site} />
    </div>
  );
}
