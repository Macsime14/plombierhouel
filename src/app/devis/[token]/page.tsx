import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { chargerDevisParToken } from "@/lib/admin/devis-data";
import { marquerDevisVu } from "@/lib/devis/public-actions";
import { dateValiditeDevis, devisExpire } from "@/lib/devis/public";
import { getParametres } from "@/lib/domain/parametres";
import { formaterEuros } from "@/lib/domain/montants";
import { calculerTotaux, type LigneCalcul } from "@/lib/domain/tva";
import { DevisPublicActions } from "./DevisPublicActions";

export const metadata: Metadata = {
  title: "Votre devis",
  robots: { index: false, follow: false },
};

const dateFmt = new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" });

export default async function DevisPublicPage({ params }: PageProps<"/devis/[token]">) {
  const { token } = await params;

  const data = await chargerDevisParToken(token);
  if (!data || data.devis.statut === "brouillon") notFound();

  await marquerDevisVu(token);

  const params_ = await getParametres();
  const franchise = params_.regimeTva === "franchise_base";
  const d = data.devis;

  const lignesCalcul: LigneCalcul[] = data.lignes.map((l) => ({
    quantite: Number(l.quantite),
    puCents: l.puCents,
    tauxTva: Number(l.tauxTva),
    remisePct: Number(l.remisePct),
  }));
  const totaux = calculerTotaux(lignesCalcul, params_.regimeTva);

  const dateValidite = dateValiditeDevis(d.dateEmission, d.validiteJours);
  const expire = devisExpire(d.dateEmission, d.validiteJours, d.statut);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 text-text">
      <header className="mb-8">
        <p className="font-heading text-lg font-semibold">
          {params_.raisonSociale ?? "Houel Plombier"}
        </p>
        <p className="text-sm text-text-muted">
          {[params_.adresse, params_.codePostal, params_.ville].filter(Boolean).join(" · ")}
        </p>
        {params_.telephone ? (
          <p className="text-sm text-text-muted">Tél. {params_.telephone}</p>
        ) : null}
      </header>

      <div className="flex items-baseline justify-between">
        <h1 className="font-heading text-2xl font-semibold">
          Devis {d.numero}
        </h1>
        <a href={`/devis/${token}/pdf`} className="text-sm text-accent hover:underline">
          Télécharger le PDF
        </a>
      </div>
      <p className="mt-1 text-sm text-text-muted">
        Émis le {dateFmt.format(d.dateEmission)} · valable jusqu’au {dateFmt.format(dateValidite)}
      </p>

      {data.client ? (
        <p className="mt-4 text-sm">
          <span className="text-text-muted">Client : </span>
          {data.client.nom}
        </p>
      ) : null}

      <div className="mt-6 overflow-x-auto rounded-lg border border-border">
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
            {data.lignes.map((l) => (
              <tr key={l.id} className="border-t border-border">
                <td className="px-3 py-2">{l.designation}</td>
                <td className="px-3 py-2 text-right text-text-muted">
                  {Number(l.quantite)} {l.unite}
                </td>
                <td className="px-3 py-2 text-right tabular-nums">{formaterEuros(l.puCents)}</td>
                <td className="px-3 py-2 text-right tabular-nums">{formaterEuros(l.totalHtCents)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 ml-auto w-full max-w-xs text-sm">
        <div className="flex justify-between py-1">
          <span className="text-text-muted">Total HT</span>
          <span className="tabular-nums">{formaterEuros(totaux.totalHtCents)}</span>
        </div>
        {franchise ? (
          <p className="py-1 text-xs text-text-muted">TVA non applicable, art. 293 B du CGI.</p>
        ) : (
          totaux.parTaux.map((t) => (
            <div key={t.taux} className="flex justify-between py-1">
              <span className="text-text-muted">TVA {t.taux} %</span>
              <span className="tabular-nums">{formaterEuros(t.tvaCents)}</span>
            </div>
          ))
        )}
        <div className="mt-1 flex justify-between border-t border-border py-1 font-semibold">
          <span>Total TTC</span>
          <span className="tabular-nums">{formaterEuros(totaux.totalTtcCents)}</span>
        </div>
      </div>

      {d.conditions ? (
        <div className="mt-6 text-sm">
          <p className="font-medium">Conditions</p>
          <p className="mt-1 whitespace-pre-wrap text-text-muted">{d.conditions}</p>
        </div>
      ) : null}

      <div className="mt-8">
        <DevisPublicActions
          token={token}
          statut={d.statut}
          expire={expire}
          accepteParNom={d.accepteParNom}
        />
      </div>
    </div>
  );
}
