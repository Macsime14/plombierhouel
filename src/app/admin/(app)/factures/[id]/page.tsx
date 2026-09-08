import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";

import { getParametres } from "@/lib/domain/parametres";
import { optionsClients, optionsPrestations } from "@/lib/admin/devis-data";
import { chargerFacture } from "@/lib/admin/factures-data";
import { supprimerFacture } from "@/lib/admin/factures-actions";
import { supprimerPaiement } from "@/lib/admin/paiements-actions";
import { verifierChaineJournal } from "@/lib/domain/journal";
import { formaterEuros } from "@/lib/domain/montants";
import {
  FACTURE_STATUT_LABELS,
  FACTURE_STATUT_TONE,
  factureModifiable,
  type FactureStatut,
} from "@/lib/admin/facture-statuts";
import { Statut } from "@/components/admin/ui";
import { FactureEditor } from "../FactureEditor";
import { AvoirForm, EmettreForm, PaiementForm } from "./FactureForms";
import type { LigneInitiale } from "@/components/admin/LignesEditor";

export const metadata = { title: "Facture" };

const dateFmt = new Intl.DateTimeFormat("fr-FR", { dateStyle: "long", timeZone: "Europe/Paris" });
const dateHeureFmt = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: "Europe/Paris",
});

const MOYEN_LABELS: Record<string, string> = {
  virement: "Virement",
  cheque: "Chèque",
  especes: "Espèces",
  cb: "Carte bancaire",
  autre: "Autre",
};

export default async function FacturePage({ params }: PageProps<"/admin/factures/[id]">) {
  const { id } = await params;
  if (!z.string().uuid().safeParse(id).success) notFound();

  const [data, clients, prestations, parametres] = await Promise.all([
    chargerFacture(id),
    optionsClients(),
    optionsPrestations(),
    getParametres(),
  ]);
  if (!data) notFound();

  const { facture: f, client, lignes, paiements, avoirs, journal, totalPayeCents } = data;
  const brouillon = factureModifiable(f.statut);
  const resteCents = Math.max(0, f.totalTtcCents - totalPayeCents);
  const totalAvoirsCents = avoirs.reduce((s, a) => s + a.montantTtcCents, 0);
  const chaineAlteree = verifierChaineJournal(journal);

  const lignesInit: LigneInitiale[] = lignes.map((l) => ({
    prestationId: null,
    designation: l.designation,
    quantite: String(Number(l.quantite)),
    unite: l.unite,
    puEuros: (l.puCents / 100).toFixed(2),
    tauxTva: String(Number(l.tauxTva)),
    remisePct: "",
  }));

  return (
    <div className="max-w-4xl">
      <Link href="/admin/factures" className="text-sm text-text-muted hover:underline">
        ← Factures
      </Link>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-2xl font-semibold">
          {f.numero ?? "Brouillon"}
        </h1>
        <Statut tone={FACTURE_STATUT_TONE[f.statut as FactureStatut]}>
          {FACTURE_STATUT_LABELS[f.statut as FactureStatut]}
        </Statut>
      </div>

      {brouillon ? (
        <div className="mt-4 grid gap-6 md:grid-cols-[1fr_260px]">
          <FactureEditor
            clients={clients}
            prestations={prestations}
            regimeTva={parametres.regimeTva}
            factureId={f.id}
            defaults={{ clientId: f.clientId, lignes: lignesInit }}
          />
          <aside className="flex flex-col gap-4">
            <EmettreForm id={f.id} />
            <form action={supprimerFacture}>
              <input type="hidden" name="id" value={f.id} />
              <button type="submit" className="cursor-pointer text-xs text-red-600 hover:underline">
                Supprimer ce brouillon
              </button>
            </form>
          </aside>
        </div>
      ) : (
        <div className="mt-4 space-y-6">
          {chaineAlteree !== -1 ? (
            <p className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-800">
              ⚠️ Le journal d’inaltérabilité de cette facture présente une incohérence
              (entrée {chaineAlteree + 1}).
            </p>
          ) : null}

          <div className="grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <p className="text-text-muted">Client</p>
              <p>{client?.nom ?? "—"}</p>
            </div>
            <div>
              <p className="text-text-muted">Émise le / échéance</p>
              <p>
                {dateFmt.format(f.dateEmission)}
                {f.dateEcheance ? ` · à régler avant le ${dateFmt.format(f.dateEcheance)}` : ""}
              </p>
            </div>
            <div>
              <a
                href={`/admin/factures/${f.id}/pdf`}
                target="_blank"
                rel="noopener"
                className="text-accent hover:underline"
              >
                Voir le PDF
              </a>
              {f.devisId ? (
                <>
                  {" · "}
                  <Link href={`/admin/devis/${f.devisId}`} className="text-accent hover:underline">
                    Devis d’origine
                  </Link>
                </>
              ) : null}
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="bg-surface text-left text-text-muted">
                <tr>
                  <th className="px-3 py-2 font-medium">Désignation</th>
                  <th className="px-3 py-2 text-right font-medium">Qté</th>
                  <th className="px-3 py-2 text-right font-medium">PU HT</th>
                  <th className="px-3 py-2 text-right font-medium">Total HT</th>
                </tr>
              </thead>
              <tbody>
                {lignes.map((l) => (
                  <tr key={l.id} className="border-t border-border">
                    <td className="px-3 py-2">{l.designation}</td>
                    <td className="px-3 py-2 text-right text-text-muted">
                      {Number(l.quantite)} {l.unite}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums">{formaterEuros(l.puCents)}</td>
                    <td className="px-3 py-2 text-right tabular-nums">
                      {formaterEuros(l.totalHtCents)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="ml-auto w-full max-w-xs text-sm">
            <div className="flex justify-between py-1">
              <span className="text-text-muted">Total HT</span>
              <span className="tabular-nums">{formaterEuros(f.totalHtCents)}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-text-muted">TVA</span>
              <span className="tabular-nums">{formaterEuros(f.totalTvaCents)}</span>
            </div>
            <div className="mt-1 flex justify-between border-t border-border py-1 font-semibold">
              <span>Total TTC</span>
              <span className="tabular-nums">{formaterEuros(f.totalTtcCents)}</span>
            </div>
            <div className="flex justify-between py-1 text-text-muted">
              <span>Encaissé</span>
              <span className="tabular-nums">{formaterEuros(totalPayeCents)}</span>
            </div>
            {totalAvoirsCents > 0 ? (
              <div className="flex justify-between py-1 text-text-muted">
                <span>Avoirs</span>
                <span className="tabular-nums">− {formaterEuros(totalAvoirsCents)}</span>
              </div>
            ) : null}
            <div className="flex justify-between py-1 font-medium">
              <span>Reste à payer</span>
              <span className="tabular-nums">{formaterEuros(resteCents)}</span>
            </div>
          </div>

          {/* Paiements */}
          <section>
            <h2 className="text-sm font-medium">Paiements</h2>
            {paiements.length > 0 ? (
              <ul className="mt-2 divide-y divide-border rounded-lg border border-border text-sm">
                {paiements.map((p) => (
                  <li key={p.id} className="flex items-center justify-between px-3 py-2">
                    <span>
                      {dateFmt.format(p.date)} · {MOYEN_LABELS[p.moyen] ?? p.moyen}
                      {p.reference ? ` · ${p.reference}` : ""}
                    </span>
                    <span className="flex items-center gap-3">
                      <span className="tabular-nums">{formaterEuros(p.montantCents)}</span>
                      <form action={supprimerPaiement}>
                        <input type="hidden" name="id" value={p.id} />
                        <input type="hidden" name="factureId" value={f.id} />
                        <button
                          type="submit"
                          className="cursor-pointer text-xs text-text-muted hover:text-red-600"
                          aria-label="Supprimer ce paiement"
                        >
                          ✕
                        </button>
                      </form>
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-text-muted">Aucun paiement enregistré.</p>
            )}
            {f.statut !== "annulee" && f.statut !== "payee" ? (
              <div className="mt-3">
                <PaiementForm id={f.id} resteCents={resteCents} />
              </div>
            ) : null}
          </section>

          {/* Avoirs */}
          <section>
            <h2 className="text-sm font-medium">Avoirs</h2>
            {avoirs.length > 0 ? (
              <ul className="mt-2 divide-y divide-border rounded-lg border border-border text-sm">
                {avoirs.map((a) => (
                  <li key={a.id} className="flex items-center justify-between px-3 py-2">
                    <span>
                      {a.numero} · {dateFmt.format(a.dateEmission)}
                      {a.motif ? ` · ${a.motif}` : ""}
                    </span>
                    <span className="tabular-nums">{formaterEuros(a.montantTtcCents)}</span>
                  </li>
                ))}
              </ul>
            ) : null}
            {f.statut !== "annulee" ? (
              <div className="mt-3">
                <AvoirForm id={f.id} totalCents={f.totalTtcCents} />
              </div>
            ) : null}
          </section>

          {/* Journal */}
          <details className="rounded-lg border border-border p-4">
            <summary className="cursor-pointer text-sm font-medium">
              Journal d’inaltérabilité ({journal.length} entrées ·{" "}
              {chaineAlteree === -1 ? "chaîne intègre" : "chaîne altérée"})
            </summary>
            <ul className="mt-3 space-y-1 text-xs text-text-muted">
              {journal.map((j) => (
                <li key={j.id}>
                  {dateHeureFmt.format(j.horodatage)} — {j.evenement} —{" "}
                  <code className="break-all">{j.hash.slice(0, 16)}…</code>
                </li>
              ))}
            </ul>
          </details>
        </div>
      )}
    </div>
  );
}
