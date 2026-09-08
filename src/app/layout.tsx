import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { siteConfig } from "@/lib/data/site-config";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.companyName} — Plombier chauffagiste à ${siteConfig.areaDescription}`,
    template: `%s | ${siteConfig.companyName}`,
  },
  description: `${siteConfig.companyName}, plombier chauffagiste à ${siteConfig.areaDescription} : dépannage, chauffage, pompe à chaleur, climatisation, sanitaires et rénovation. Devis gratuit.`,
  metadataBase: new URL(siteConfig.url),
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full">
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        {children}
      </body>
    </html>
  );
}
