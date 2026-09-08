import Link from "next/link";

import { aujourdhuiParis, ajouterJours, lundiDeLaSemaine } from "@/lib/domain/dates";

const moisFmt = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", timeZone: "Europe/Paris" });

export function SemaineNav({ lundi }: { lundi: string }) {
  const dimanche = ajouterJours(lundi, 6);
  const precedente = ajouterJours(lundi, -7);
  const suivante = ajouterJours(lundi, 7);
  const semaineCourante = lundiDeLaSemaine(aujourdhuiParis());

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <Link
        href={`/admin/planning?semaine=${precedente}`}
        className="rounded-md border border-border px-2 py-1 hover:border-accent"
        aria-label="Semaine précédente"
      >
        ‹
      </Link>
      <Link
        href={`/admin/planning?semaine=${suivante}`}
        className="rounded-md border border-border px-2 py-1 hover:border-accent"
        aria-label="Semaine suivante"
      >
        ›
      </Link>
      {lundi !== semaineCourante ? (
        <Link
          href="/admin/planning"
          className="rounded-md border border-border px-2 py-1 hover:border-accent"
        >
          Cette semaine
        </Link>
      ) : null}
      <span className="text-text-muted">
        {moisFmt.format(new Date(`${lundi}T12:00:00Z`))} – {moisFmt.format(new Date(`${dimanche}T12:00:00Z`))}
      </span>
    </div>
  );
}
