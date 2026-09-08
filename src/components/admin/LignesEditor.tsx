"use client";

import { useMemo, useState } from "react";

import { formaterEuros, saisieVersCents } from "@/lib/domain/montants";
import { calculerTotaux, type LigneCalcul } from "@/lib/domain/tva";
import { UNITES_COURANTES } from "@/lib/domain/unites";

export type LigneInitiale = {
  prestationId: string | null;
  designation: string;
  quantite: string;
  unite: string;
  puEuros: string;
  tauxTva: string;
  remisePct: string;
};

export type PrestationOption = {
  id: string;
  libelle: string;
  unite: string;
  puCents: number;
  tauxTva: string;
};

type Row = LigneInitiale & { key: string };

let compteur = 0;
const nouvelleCle = () => `r${++compteur}`;

const ligneVide = (): Row => ({
  key: nouvelleCle(),
  prestationId: null,
  designation: "",
  quantite: "1",
  unite: "u",
  puEuros: "",
  tauxTva: "20",
  remisePct: "",
});

const inputCls =
  "w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

export function LignesEditor({
  prestations,
  regimeTva,
  defaultLignes,
  name = "lignesJson",
}: {
  prestations: PrestationOption[];
  regimeTva: "franchise_base" | "reel";
  defaultLignes: LigneInitiale[];
  name?: string;
}) {
  const [rows, setRows] = useState<Row[]>(
    defaultLignes.length
      ? defaultLignes.map((l) => ({ ...l, key: nouvelleCle() }))
      : [ligneVide()],
  );

  const franchise = regimeTva === "franchise_base";

  const totaux = useMemo(() => {
    const pourCalcul: LigneCalcul[] = rows.map((r) => ({
      quantite: Number(r.quantite.replace(",", ".")) || 0,
      puCents: saisieVersCents(r.puEuros) ?? 0,
      tauxTva: Number(r.tauxTva.replace(",", ".")) || 0,
      remisePct: Number(r.remisePct.replace(",", ".")) || 0,
    }));
    return calculerTotaux(pourCalcul, regimeTva);
  }, [rows, regimeTva]);

  function maj(key: string, champ: keyof LigneInitiale, valeur: string) {
    setRows((rs) => rs.map((r) => (r.key === key ? { ...r, [champ]: valeur } : r)));
  }

  function ajouterDepuisPrestation(id: string) {
    const p = prestations.find((x) => x.id === id);
    if (!p) return;
    setRows((rs) => [
      ...rs,
      {
        key: nouvelleCle(),
        prestationId: p.id,
        designation: p.libelle,
        quantite: "1",
        unite: p.unite,
        puEuros: (p.puCents / 100).toFixed(2),
        tauxTva: String(Number(p.tauxTva)),
        remisePct: "",
      },
    ]);
  }

  const json = JSON.stringify(
    rows.map((r) => ({
      prestationId: r.prestationId,
      designation: r.designation,
      quantite: r.quantite,
      unite: r.unite,
      puEuros: r.puEuros,
      tauxTva: r.tauxTva,
      remisePct: r.remisePct,
    })),
  );

  return (
    <div className="flex flex-col gap-4">
      <input type="hidden" name={name} value={json} />
      <datalist id="unites-courantes">
        {UNITES_COURANTES.map((u) => (
          <option key={u.value} value={u.value} label={u.label} />
        ))}
      </datalist>

      <div className="rounded-lg border border-border">
        <div className="border-b border-border bg-surface px-3 py-2 text-sm font-medium text-text-muted">
          Lignes
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-text-muted">
              <tr>
                <th className="px-3 py-2 font-medium">Désignation</th>
                <th className="px-3 py-2 font-medium">Qté</th>
                <th className="px-3 py-2 font-medium">Unité</th>
                <th className="px-3 py-2 font-medium">PU HT (€)</th>
                {!franchise && <th className="px-3 py-2 font-medium">TVA %</th>}
                <th className="px-3 py-2 font-medium">Remise %</th>
                <th className="px-3 py-2 text-right font-medium">Total HT</th>
                <th className="px-3 py-2" />
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const total =
                  (Number(r.quantite.replace(",", ".")) || 0) *
                  (saisieVersCents(r.puEuros) ?? 0) *
                  (1 - (Number(r.remisePct.replace(",", ".")) || 0) / 100);
                return (
                  <tr key={r.key} className="border-t border-border align-top">
                    <td className="px-3 py-2">
                      <input
                        value={r.designation}
                        onChange={(e) => maj(r.key, "designation", e.target.value)}
                        className={inputCls}
                        placeholder="Description"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        value={r.quantite}
                        onChange={(e) => maj(r.key, "quantite", e.target.value)}
                        className={`${inputCls} w-16`}
                        inputMode="decimal"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        value={r.unite}
                        onChange={(e) => maj(r.key, "unite", e.target.value)}
                        list="unites-courantes"
                        className={`${inputCls} w-16`}
                        aria-label="Unité"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        value={r.puEuros}
                        onChange={(e) => maj(r.key, "puEuros", e.target.value)}
                        className={`${inputCls} w-24`}
                        inputMode="decimal"
                      />
                    </td>
                    {!franchise && (
                      <td className="px-3 py-2">
                        <input
                          value={r.tauxTva}
                          onChange={(e) => maj(r.key, "tauxTva", e.target.value)}
                          className={`${inputCls} w-16`}
                          inputMode="decimal"
                        />
                      </td>
                    )}
                    <td className="px-3 py-2">
                      <input
                        value={r.remisePct}
                        onChange={(e) => maj(r.key, "remisePct", e.target.value)}
                        className={`${inputCls} w-16`}
                        inputMode="decimal"
                        placeholder="0"
                      />
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums whitespace-nowrap">
                      {formaterEuros(Math.round(total))}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <button
                        type="button"
                        onClick={() => setRows((rs) => rs.filter((x) => x.key !== r.key))}
                        className="cursor-pointer text-text-muted hover:text-red-600"
                        aria-label="Supprimer la ligne"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="flex flex-wrap items-center gap-3 border-t border-border px-3 py-2">
          <button
            type="button"
            onClick={() => setRows((rs) => [...rs, ligneVide()])}
            className="cursor-pointer rounded-md border border-border px-3 py-1.5 text-sm hover:border-accent"
          >
            + Ligne libre
          </button>
          {prestations.length > 0 && (
            <select
              value=""
              onChange={(e) => {
                if (e.target.value) ajouterDepuisPrestation(e.target.value);
                e.target.value = "";
              }}
              className="rounded-md border border-border bg-background px-2 py-1.5 text-sm"
            >
              <option value="">+ Depuis le catalogue…</option>
              {prestations.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.libelle} — {formaterEuros(p.puCents)}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      <div className="ml-auto w-full max-w-xs text-sm">
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
    </div>
  );
}
