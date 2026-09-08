import type { ReactNode } from "react";

/**
 * Neutralisé (brief §5 : « pas de fade-slide-up systématique sur chaque section »).
 * Le contenu est rendu au repos, immédiatement lisible. Les appels résiduels
 * seront retirés en même temps que la refonte de chaque section.
 */
export function Reveal({ children, className = "" }: { children: ReactNode; className?: string; delay?: number }) {
  return <div className={className}>{children}</div>;
}
