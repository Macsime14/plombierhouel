"use client";

import { useActionState, useMemo, useState } from "react";

import { creerDevis, modifierDevis, type DevisState } from "@/lib/admin/devis-actions";
import { formaterEuros, saisieVersCents } from "@/lib/domain/montants";
import { calculerTotaux, type LigneCalcul } from "@/lib/domain/tva";

type ClientOption = { id: string; nom: string };
type PrestationOption = {
  id: string;
  libelle: string;
  unite: string;
  puCents: number;
  tauxTva: string;
};

export type LigneInitiale = {
  prestationId: string | null;
  designation: string;
  quantite: string;
  unite: string;
  puEuros: string;
  tauxTva: string;
  remisePct: string;
};

type Row = LigneInitiale & { key: string };

type Props = {
  clients: ClientOption[];
  prestations: PrestationOption[];
  regimeTva: "franchise_base" | "reel";
  devisId?: string;
  demandeId?: string | null;
  defaults?: {
    clientId?: string;
    validiteJours?: number;
    conditions?: string | null;
    notesInternes?: string | null;
    lignes: LigneInitiale[];
  };
};

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

export function DevisEditor({ clients, prestations, regimeTva, devisId, demandeId, defaults }: Props) {
  const action = devisId ? modifierDevis : creerDevis;
  const [state, formAction, pending] = useActionState<DevisState, FormData>(action, undefined);

  const [rows, setRows] = useState<Row[]>(
    defaults?.lignes.length
      ? defaults.lignes.map((l) => ({ ...l, key: nouvelleCle() }))
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

  const lignesJson = JSON.stringify(
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

  const inputCls =
    "w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {devisId ? <input type="hidden" name="id" value={devisId} /> : null}
      {demandeId ? <input type="hidden" name="demandeId" value={demandeId} /> : null}
      <input type="hidden" name="lignesJson" value={lignesJson} />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="clientId" className="text-sm font-medium">
            Client <span className="text-red-600">*</span>
          </label>
          <select
            id="clientId"
            name="clientId"
            required
            defaultValue={defaults?.clientId ?? ""}
            className={inputCls}
          >
            <option value="" disabled>
              Choisir un client…
            </option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nom}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="validiteJours" className="text-sm font-medium">
            Validité (jours)
          </label>
          <input
            id="validiteJours"
            name="validiteJours"
            type="number"
            min={1}
            max={365}
            defaultValue={defaults?.validiteJours ?? 30}
            className={inputCls}
          />
        </div>
      </div>

      {/* Lignes */}
      <div className="rounded-lg border border-border">
        <div className="border-b border-border bg-surface px-3 py-2 text-sm font-medium text-text-muted">
          Lignes du devis
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
                const totalLigne =
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
                        placeholder="Description de la prestation"
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
                        className={`${inputCls} w-16`}
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
                      {formaterEuros(Math.round(totalLigne))}
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

      {/* Totaux */}
      <div className="ml-auto w-full max-w-xs text-sm">
        <div className="flex justify-between py-1">
          <span className="text-text-muted">Total HT</span>
          <span className="tabular-nums">{formaterEuros(totaux.totalHtCents)}</span>
        </div>
        {!franchise &&
          totaux.parTaux.map((t) => (
            <div key={t.taux} className="flex justify-between py-1">
              <span className="text-text-muted">TVA {t.taux} %</span>
              <span className="tabular-nums">{formaterEuros(t.tvaCents)}</span>
            </div>
          ))}
        {franchise && (
          <p className="py-1 text-xs text-text-muted">TVA non applicable, art. 293 B du CGI.</p>
        )}
        <div className="mt-1 flex justify-between border-t border-border py-1 font-semibold">
          <span>Total TTC</span>
          <span className="tabular-nums">{formaterEuros(totaux.totalTtcCents)}</span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="conditions" className="text-sm font-medium">
            Conditions (affichées sur le devis)
          </label>
          <textarea
            id="conditions"
            name="conditions"
            rows={3}
            defaultValue={defaults?.conditions ?? ""}
            className={inputCls}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="notesInternes" className="text-sm font-medium">
            Notes internes (non affichées)
          </label>
          <textarea
            id="notesInternes"
            name="notesInternes"
            rows={3}
            defaultValue={defaults?.notesInternes ?? ""}
            className={inputCls}
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="cursor-pointer rounded-md bg-accent px-4 py-2 text-sm font-medium text-on-accent hover:opacity-90 disabled:opacity-60"
        >
          {pending ? "Enregistrement…" : devisId ? "Enregistrer le devis" : "Créer le devis"}
        </button>
        {state?.error ? (
          <span className="text-sm text-red-600" role="alert">
            {state.error}
          </span>
        ) : null}
      </div>
    </form>
  );
}
