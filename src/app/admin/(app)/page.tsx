import type { ReactNode } from "react";
import Link from "next/link";

import { chargerDashboard } from "@/lib/admin/dashboard-data";
import { formaterEuros } from "@/lib/domain/montants";
import { Bouton, PageTitre, Statut } from "@/components/admin/ui";
import { DEVIS_STATUT_LABELS, DEVIS_STATUT_TONE, type DevisStatut } from "@/lib/admin/devis-statuts";
import {
  FACTURE_STATUT_LABELS,
  FACTURE_STATUT_TONE,
  type FactureStatut,
} from "@/lib/admin/facture-statuts";
import {
  INTERVENTION_STATUT_LABELS,
  INTERVENTION_STATUT_TONE,
  type InterventionStatut,
} from "@/lib/admin/intervention-statuts";

export const metadata = { title: "Tableau de bord" };

const jourHeure = new Intl.DateTimeFormat("fr-FR", {
  weekday: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Paris",
});
const heure = new Intl.DateTimeFormat("fr-FR", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Paris",
});

const STRIPE: Record<"negatif" | "attention" | "info", string> = {
  negatif: "border-[var(--tone-negatif-fg)]",
  attention: "border-[var(--tone-attention-fg)]",
  info: "border-[var(--tone-info-fg)]",
};

function Section({ titre, children }: { titre: string; children: ReactNode }) {
  return (
    <section className="mt-8 first:mt-0">
      <h2 className="mb-3 border-b border-border pb-2 text-sm font-medium text-text-muted">
        {titre}
      </h2>
      {children}
    </section>
  );
}

export default async function DashboardPage() {
  const d = await chargerDashboard();

  const aTraiter = [
    d.facturesEchues > 0 && {
      ton: "negatif" as const,
      href: "/admin/factures",
      n: d.facturesEchues,
      texte:
        d.facturesEchues > 1
          ? "factures échues impayées"
          : "facture échue impayée",
      apres: ` — ${formaterEuros(d.facturesEchuesMontantCents)}`,
    },
    d.devisARelancer > 0 && {
      ton: "attention" as const,
      href: "/admin/devis",
      n: d.devisARelancer,
      texte:
        d.devisARelancer > 1
          ? "devis sans réponse depuis plus d’une semaine"
          : "devis sans réponse depuis plus d’une semaine",
      apres: "",
    },
    d.demandesAQualifier > 0 && {
      ton: "info" as const,
      href: "/admin/demandes",
      n: d.demandesAQualifier,
      texte:
        d.demandesAQualifier > 1 ? "demandes à qualifier" : "demande à qualifier",
      apres: "",
    },
  ].filter(Boolean) as {
    ton: "negatif" | "attention" | "info";
    href: string;
    n: number;
    texte: string;
    apres: string;
  }[];

  return (
    <div className="max-w-3xl">
      <PageTitre titre="Tableau de bord" />

      <Section titre="À traiter">
        {aTraiter.length === 0 ? (
          <p className="py-3 text-sm text-text-muted">Rien en attente pour le moment.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {aTraiter.map((row) => (
              <li key={row.href + row.texte}>
                <Link
                  href={row.href}
                  className={`flex items-baseline gap-3 border-l-2 py-2 pl-3 text-sm transition-colors hover:bg-surface ${STRIPE[row.ton]}`}
                >
                  <span className="font-heading text-lg leading-none font-semibold tabular-nums">
                    {row.n}
                  </span>
                  <span className="text-text-muted">
                    {row.texte}
                    {row.apres}
                  </span>
                  <span className="ml-auto text-text-muted">→</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section titre="Aujourd’hui et demain">
        {d.interventionsProches.length === 0 ? (
          <p className="py-3 text-sm text-text-muted">
            Aucune intervention prévue aujourd’hui ni demain.
          </p>
        ) : (
          <ul className="flex flex-col divide-y divide-border">
            {d.interventionsProches.map((it) => (
              <li key={it.id}>
                <Link
                  href={`/admin/planning/${it.id}`}
                  className="flex flex-wrap items-baseline gap-x-3 gap-y-1 py-2.5 text-sm transition-colors hover:bg-surface"
                >
                  <span className="tabular-nums text-text-muted">
                    {jourHeure.format(it.debut)}–{heure.format(it.fin)}
                  </span>
                  <span className="font-medium">{it.titre}</span>
                  {it.clientNom ? <span className="text-text-muted">{it.clientNom}</span> : null}
                  <span className="ml-auto">
                    <Statut tone={INTERVENTION_STATUT_TONE[it.statut as InterventionStatut]}>
                      {INTERVENTION_STATUT_LABELS[it.statut as InterventionStatut]}
                    </Statut>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section titre="Ce mois">
        <div className="flex items-baseline gap-3 py-1">
          <span className="text-sm text-text-muted">Encaissé</span>
          <span className="font-heading text-2xl font-semibold tabular-nums text-accent-warm">
            {formaterEuros(d.encaisseMoisCents)}
          </span>
        </div>
      </Section>

      <Section titre="Activité récente">
        <div className="grid gap-8 sm:grid-cols-2">
          <RecentList
            titre="Devis"
            lien="/admin/devis"
            vide="Aucun devis."
            rows={d.devisRecents.map((x) => ({
              id: x.id,
              href: `/admin/devis/${x.id}`,
              numero: x.numero,
              clientNom: x.clientNom,
              montant: x.totalTtcCents,
              tone: DEVIS_STATUT_TONE[x.statut as DevisStatut],
              label: DEVIS_STATUT_LABELS[x.statut as DevisStatut],
            }))}
          />
          <RecentList
            titre="Factures"
            lien="/admin/factures"
            vide="Aucune facture."
            rows={d.facturesRecentes.map((x) => ({
              id: x.id,
              href: `/admin/factures/${x.id}`,
              numero: x.numero ?? "Brouillon",
              clientNom: x.clientNom,
              montant: x.totalTtcCents,
              tone: FACTURE_STATUT_TONE[x.statut as FactureStatut],
              label: FACTURE_STATUT_LABELS[x.statut as FactureStatut],
            }))}
          />
        </div>
      </Section>

      <Section titre="Raccourcis">
        <div className="flex flex-wrap gap-2">
          <Bouton href="/admin/devis/nouveau">+ Nouveau devis</Bouton>
          <Bouton href="/admin/clients/nouveau" variant="ghost">
            + Nouveau client
          </Bouton>
          <Bouton href="/admin/planning/nouveau" variant="ghost">
            + Nouvelle intervention
          </Bouton>
        </div>
      </Section>
    </div>
  );
}

type RecentRow = {
  id: string;
  href: string;
  numero: string | null;
  clientNom: string | null;
  montant: number;
  tone: "neutre" | "info" | "attention" | "positif" | "negatif";
  label: string;
};

function RecentList({
  titre,
  lien,
  vide,
  rows,
}: {
  titre: string;
  lien: string;
  vide: string;
  rows: RecentRow[];
}) {
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between">
        <p className="text-xs font-medium text-text-muted">{titre}</p>
        <Link href={lien} className="text-xs text-accent hover:underline">
          tout voir
        </Link>
      </div>
      {rows.length === 0 ? (
        <p className="py-2 text-sm text-text-muted">{vide}</p>
      ) : (
        <ul className="divide-y divide-border">
          {rows.map((r) => (
            <li key={r.id}>
              <Link
                href={r.href}
                className="flex items-baseline gap-2 py-2 text-sm transition-colors hover:bg-surface"
              >
                <span className="font-medium tabular-nums">{r.numero}</span>
                <span className="truncate text-text-muted">{r.clientNom ?? "—"}</span>
                <span className="ml-auto shrink-0 tabular-nums">{formaterEuros(r.montant)}</span>
                <Statut tone={r.tone}>{r.label}</Statut>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
