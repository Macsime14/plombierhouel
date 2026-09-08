import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";

import { getParametres } from "@/lib/domain/parametres";
import { chargerDevis, optionsClients, optionsPrestations } from "@/lib/admin/devis-data";
import { supprimerDevis } from "@/lib/admin/devis-actions";
import {
  DEVIS_STATUT_COULEURS,
  DEVIS_STATUT_LABELS,
  type DevisStatut,
} from "@/lib/admin/devis-statuts";
import { formaterEuros } from "@/lib/domain/montants";
import { DevisEditor, type LigneInitiale } from "../DevisEditor";
import { StatutDevisSelect } from "../StatutDevisSelect";
import { DevisActions } from "./DevisActions";
import { creerFactureDepuisDevis } from "@/lib/admin/factures-actions";

export const metadata = { title: "Devis" };

const dateFmt = new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" });

export default async function DevisDetailPage({ params }: PageProps<"/admin/devis/[id]">) {
  const { id } = await params;
  if (!z.string().uuid().safeParse(id).success) notFound();

  const [data, clients, prestations, parametres] = await Promise.all([
    chargerDevis(id),
    optionsClients(),
    optionsPrestations(),
    getParametres(),
  ]);
  if (!data) notFound();

  const { devis: d, client, lignes } = data;

  const lignesInit: LigneInitiale[] = lignes.map((l) => ({
    prestationId: l.prestationId,
    designation: l.designation,
    quantite: String(Number(l.quantite)),
    unite: l.unite,
    puEuros: (l.puCents / 100).toFixed(2),
    tauxTva: String(Number(l.tauxTva)),
    remisePct: Number(l.remisePct) ? String(Number(l.remisePct)) : "",
  }));

  const accepte = d.statut === "accepte";

  return (
    <div className="max-w-4xl">
      <Link href="/admin/devis" className="text-sm text-text-muted hover:underline">
        ← Devis
      </Link>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-2xl font-semibold">
          {d.numero}
        </h1>
        <span
          className={`inline-block rounded px-2 py-0.5 text-xs ${
            DEVIS_STATUT_COULEURS[d.statut as DevisStatut]
          }`}
        >
          {DEVIS_STATUT_LABELS[d.statut as DevisStatut]}
        </span>
      </div>

      <div className="mt-4 grid gap-6 md:grid-cols-[1fr_220px]">
        <div>
          {accepte ? (
            <div className="rounded-lg border border-border bg-surface p-4 text-sm">
              <p className="text-text-muted">
                Ce devis est accepté : il n’est plus modifiable. Repasse-le en brouillon pour le
                corriger.
              </p>
              <table className="mt-3 w-full">
                <tbody>
                  {lignes.map((l) => (
                    <tr key={l.id} className="border-t border-border">
                      <td className="py-1.5">{l.designation}</td>
                      <td className="py-1.5 text-right text-text-muted">
                        {Number(l.quantite)} {l.unite}
                      </td>
                      <td className="py-1.5 text-right tabular-nums">
                        {formaterEuros(l.totalHtCents)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-3 flex justify-between border-t border-border pt-2 font-semibold">
                <span>Total TTC</span>
                <span className="tabular-nums">{formaterEuros(d.totalTtcCents)}</span>
              </div>
            </div>
          ) : (
            <DevisEditor
              clients={clients}
              prestations={prestations}
              regimeTva={parametres.regimeTva}
              devisId={d.id}
              defaults={{
                clientId: d.clientId,
                validiteJours: d.validiteJours,
                conditions: d.conditions,
                notesInternes: d.notesInternes,
                lignes: lignesInit,
              }}
            />
          )}
        </div>

        <aside className="flex flex-col gap-4 text-sm">
          <DevisActions id={d.id} clientEmail={client?.email ?? null} />

          <div>
            <p className="mb-1 font-medium">Statut</p>
            <StatutDevisSelect id={d.id} statut={d.statut} />
          </div>

          <div>
            <p className="mb-1 font-medium">Client</p>
            {client ? (
              <Link href={`/admin/clients/${client.id}`} className="text-accent hover:underline">
                {client.nom}
              </Link>
            ) : (
              <span className="text-text-muted">—</span>
            )}
          </div>

          <Link
            href={`/admin/planning/nouveau?devis=${d.id}&client=${d.clientId}&titre=${encodeURIComponent(
              `Intervention — ${d.numero}`,
            )}`}
            className="rounded-md border border-border px-3 py-1.5 text-center text-sm hover:border-accent"
          >
            Planifier une intervention
          </Link>

          {d.statut === "accepte" ? (
            <form action={creerFactureDepuisDevis}>
              <input type="hidden" name="devisId" value={d.id} />
              <button
                type="submit"
                className="w-full cursor-pointer rounded-md border border-border px-3 py-1.5 text-sm hover:border-accent"
              >
                Créer la facture
              </button>
            </form>
          ) : null}

          <div>
            <p className="mb-1 font-medium">Lien client</p>
            <code className="block rounded bg-surface px-2 py-1 text-xs break-all">
              /devis/{d.tokenPublic}
            </code>
            <p className="mt-1 text-xs text-text-muted">
              Page publique de consultation et d’acceptation (envoi par email : bientôt).
            </p>
          </div>

          <dl className="text-xs text-text-muted">
            <div className="flex justify-between py-0.5">
              <dt>Créé le</dt>
              <dd>{dateFmt.format(d.creeLe)}</dd>
            </div>
            {d.envoyeLe && (
              <div className="flex justify-between py-0.5">
                <dt>Envoyé le</dt>
                <dd>{dateFmt.format(d.envoyeLe)}</dd>
              </div>
            )}
            {d.accepteLe && (
              <div className="flex justify-between py-0.5">
                <dt>Accepté le</dt>
                <dd>{dateFmt.format(d.accepteLe)}</dd>
              </div>
            )}
          </dl>

          <form action={supprimerDevis} className="border-t border-border pt-3">
            <input type="hidden" name="id" value={d.id} />
            <button type="submit" className="cursor-pointer text-xs text-red-600 hover:underline">
              Supprimer ce devis
            </button>
          </form>
        </aside>
      </div>
    </div>
  );
}
