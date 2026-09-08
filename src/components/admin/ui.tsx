import Link from "next/link";
import type { ReactNode } from "react";

/* ---------- Boutons ---------- */

export const boutonPrimaire =
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-sm bg-accent-warm px-4 py-2 text-sm font-medium text-on-accent-warm transition-colors hover:bg-accent-warm-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-60";

export const boutonGhost =
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-sm border border-border px-3 py-2 text-sm font-medium text-text transition-colors hover:border-accent hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

export function Bouton({
  href,
  children,
  variant = "primary",
  className = "",
  target,
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
  target?: string;
}) {
  const cls = `${variant === "primary" ? boutonPrimaire : boutonGhost} ${className}`;
  // Routes de fichier (PDF, .ics, export CSV) : liens bruts, pas de navigation client.
  const estFichier =
    href.includes("/pdf") || href.includes("/ics") || href.includes("/export");
  if (href.startsWith("/") && !estFichier) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={cls} target={target} rel={target === "_blank" ? "noopener" : undefined}>
      {children}
    </a>
  );
}

/* ---------- Pastille de statut ---------- */

export type Tone = "neutre" | "info" | "attention" | "positif" | "negatif";

const TONE_CLASS: Record<Tone, string> = {
  neutre: "bg-[var(--tone-neutre-bg)] text-[var(--tone-neutre-fg)]",
  info: "bg-[var(--tone-info-bg)] text-[var(--tone-info-fg)]",
  attention: "bg-[var(--tone-attention-bg)] text-[var(--tone-attention-fg)]",
  positif: "bg-[var(--tone-positif-bg)] text-[var(--tone-positif-fg)]",
  negatif: "bg-[var(--tone-negatif-bg)] text-[var(--tone-negatif-fg)]",
};

export function Statut({ tone, children }: { tone: Tone; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center rounded-sm px-1.5 py-0.5 text-xs font-medium whitespace-nowrap ${TONE_CLASS[tone]}`}
    >
      {children}
    </span>
  );
}

/* ---------- En-tête de page ---------- */

export function PageTitre({
  titre,
  description,
  action,
}: {
  titre: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="font-heading text-2xl font-semibold">{titre}</h1>
        {description ? <p className="mt-1 max-w-prose text-sm text-text-muted">{description}</p> : null}
      </div>
      {action ? <div className="flex flex-wrap gap-2">{action}</div> : null}
    </div>
  );
}
