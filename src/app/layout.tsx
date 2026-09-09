import type { Metadata } from "next";
import { Bricolage_Grotesque, Public_Sans } from "next/font/google";
import "./globals.css";

// Direction visuelle v2 : Public Sans (texte + données) / Bricolage Grotesque (titres).
const bodyFont = Public_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const displayFont = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Houel Plombier",
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
      className={`${bodyFont.variable} ${displayFont.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full">
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        {children}
      </body>
    </html>
  );
}
