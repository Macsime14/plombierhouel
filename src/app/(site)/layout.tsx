import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { siteConfig } from "@/lib/data/site-config";

export const metadata: Metadata = {
  openGraph: {
    title: siteConfig.companyName,
    description: siteConfig.tagline,
    images: ["/images/logo.png"],
    locale: "fr_FR",
    type: "website",
  },
};

export default function SiteLayout({ children }: LayoutProps<"/">) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["Plumber", "HVACBusiness"],
    name: siteConfig.companyName,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    address: siteConfig.address,
    areaServed: siteConfig.areaDescription,
    url: siteConfig.url,
  };

  return (
    <div className="flex min-h-full flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
