import Link from "next/link";

import {
  ajouterJours,
  aujourdhuiParis,
  dateVersJourParis,
  jourParisVersDate,
  lundiDeLaSemaine,
} from "@/lib/domain/dates";
import { interventionsDansPeriode } from "@/lib/admin/interventions-data";
import {
  INTERVENTION_STATUT_COULEURS,
  INTERVENTION_STATUT_LABELS,
  type InterventionStatut,
} from "@/lib/admin/intervention-statuts";
import { SemaineNav } from "./SemaineNav";

export const metadata = { title: "Planning" };

const jourFmt = new Intl.DateTimeFormat("fr-FR", {
  weekday: "long",
  day: "numeric",
  timeZone: "Europe/Paris",
});
const heureFmt = new Intl.DateTimeFormat("fr-FR", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Paris",
});

const JOUR_MS = /^\d{4}-\d{2}-\d{2}$/;

export default async function PlanningPage({ searchParams }: PageProps<"/admin/planning">) {
  const sp = await searchParams;
  const param = typeof sp.semaine === "string" && JOUR_MS.test(sp.semaine) ? sp.semaine : aujourdhuiParis();
  const lundi = lundiDeLaSemaine(param);

  const debutSemaine = jourParisVersDate(lundi);
  const finSemaine = jourParisVersDate(ajouterJours(lundi, 7));
  const items = await interventionsDansPeriode(debutSemaine, finSemaine);

  const jours = Array.from({ length: 7 }, (_, k) => ajouterJours(lundi, k));
  const aujourdhui = aujourdhuiParis();
  const parJour = new Map<string, typeof items>();
  for (const it of items) {
    const j = dateVersJourParis(it.debut);
    const liste = parJour.get(j);
    if (liste) liste.push(it);
    else parJour.set(j, [it]);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-[family-name:var(--font-playfair)] text-2xl font-semibold">Planning</h1>
        <div className="flex items-center gap-2">
          <a
            href={`/admin/planning/ics?semaine=${lundi}`}
            className="rounded-md border border-border px-3 py-2 text-sm hover:border-accent"
          >
            Exporter la semaine (.ics)
          </a>
          <Link
            href="/admin/planning/nouveau"
            className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-on-accent hover:opacity-90"
          >
            + Nouvelle intervention
          </Link>
        </div>
      </div>

      <div className="mt-4">
        <SemaineNav lundi={lundi} />
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
        {jours.map((jour) => {
          const liste = parJour.get(jour) ?? [];
          return (
            <div
              key={jour}
              className={`rounded-lg border p-2 ${
                jour === aujourdhui ? "border-accent" : "border-border"
              }`}
            >
              <p className="mb-2 text-xs font-medium text-text-muted capitalize">
                {jourFmt.format(new Date(`${jour}T12:00:00Z`))}
              </p>
              {liste.length === 0 ? (
                <p className="py-2 text-xs text-text-muted">—</p>
              ) : (
                <ul className="flex flex-col gap-2">
                  {liste.map((it) => (
                    <li key={it.id}>
                      <Link
                        href={`/admin/planning/${it.id}`}
                        className="block rounded-md bg-surface p-2 text-xs hover:bg-surface-muted"
                      >
                        <span className="font-medium tabular-nums">
                          {heureFmt.format(it.debut)}–{heureFmt.format(it.fin)}
                        </span>
                        <span className="mt-0.5 block font-medium">{it.titre}</span>
                        {it.clientNom ? (
                          <span className="block text-text-muted">{it.clientNom}</span>
                        ) : null}
                        <span
                          className={`mt-1 inline-block rounded px-1 py-0.5 ${
                            INTERVENTION_STATUT_COULEURS[it.statut as InterventionStatut]
                          }`}
                        >
                          {INTERVENTION_STATUT_LABELS[it.statut as InterventionStatut]}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
