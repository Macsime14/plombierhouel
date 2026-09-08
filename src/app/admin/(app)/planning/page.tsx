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
  INTERVENTION_STATUT_LABELS,
  INTERVENTION_STATUT_TONE,
  type InterventionStatut,
} from "@/lib/admin/intervention-statuts";
import { Bouton, PageTitre, Statut } from "@/components/admin/ui";
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
      <PageTitre
        titre="Planning"
        action={
          <>
            <Bouton href={`/admin/planning/ics?semaine=${lundi}`} variant="ghost">
              Exporter la semaine (.ics)
            </Bouton>
            <Bouton href="/admin/planning/nouveau">+ Nouvelle intervention</Bouton>
          </>
        }
      />

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
                        <span className="mt-1 block">
                          <Statut tone={INTERVENTION_STATUT_TONE[it.statut as InterventionStatut]}>
                            {INTERVENTION_STATUT_LABELS[it.statut as InterventionStatut]}
                          </Statut>
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
