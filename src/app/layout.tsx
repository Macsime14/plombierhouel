import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { siteConfig } from "@/lib/data/site-config";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.companyName} — Plombier à ${siteConfig.areaDescription}`,
    template: `%s | ${siteConfig.companyName}`,
  },
  description: `${siteConfig.companyName}, plombier à ${siteConfig.areaDescription} : dépannage, chauffage, sanitaires et rénovation. Devis gratuit.`,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    title: siteConfig.companyName,
    description: siteConfig.tagline,
    locale: "fr_FR",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Plumber",
    name: siteConfig.companyName,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    address: siteConfig.address,
    areaServed: siteConfig.areaDescription,
    url: siteConfig.url,
  };

  return (
    <html lang="fr" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
