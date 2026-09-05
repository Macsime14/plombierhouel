import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { siteConfig } from "@/lib/data/site-config";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.companyName} — Plombier chauffagiste à ${siteConfig.areaDescription}`,
    template: `%s | ${siteConfig.companyName}`,
  },
  description: `${siteConfig.companyName}, plombier chauffagiste à ${siteConfig.areaDescription} : dépannage, chauffage, pompe à chaleur, climatisation, sanitaires et rénovation. Devis gratuit.`,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    title: siteConfig.companyName,
    description: siteConfig.tagline,
    images: ["/images/logo.png"],
    locale: "fr_FR",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
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

  const themeInitScript = `
    (function () {
      try {
        var stored = localStorage.getItem("theme");
        var isDark = stored ? stored === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (isDark) document.documentElement.classList.add("dark");
      } catch (e) {}
    })();
  `;

  return (
    <html lang="fr" className={`${inter.variable} ${jakarta.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
