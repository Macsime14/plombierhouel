"use client";

import { useActionState } from "react";

import { emettreFacture, type EmissionState } from "@/lib/admin/factures-actions";
import {
  creerAvoir,
  enregistrerPaiement,
  type AvoirState,
  type PaiementState,
} from "@/lib/admin/paiements-actions";

const inputCls =
  "w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

export function EmettreForm({ id }: { id: string }) {
  const [state, action, pending] = useActionState<EmissionState, FormData>(emettreFacture, undefined);

  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm("Émettre définitivement cette facture ? Elle ne sera plus modifiable.")) {
          e.preventDefault();
        }
      }}
      className="rounded-lg border border-border p-4"
    >
      <input type="hidden" name="id" value={id} />
      <p className="text-sm font-medium">Émettre la facture</p>
      <p className="mt-1 text-xs text-text-muted">
        Numéro définitif attribué, lignes et mentions figées, plus aucune modification possible.
      </p>
      <label htmlFor="dateEcheanceJours" className="mt-3 block text-xs text-text-muted">
        Délai de règlement (jours)
      </label>
      <input
        id="dateEcheanceJours"
        name="dateEcheanceJours"
        type="number"
        min={0}
        max={180}
        defaultValue={30}
        className={`mt-1 max-w-[8rem] ${inputCls}`}
      />
      <div className="mt-3">
        <button
          type="submit"
          disabled={pending}
          className="cursor-pointer rounded-md bg-accent px-4 py-2 text-sm font-medium text-on-accent hover:opacity-90 disabled:opacity-60"
        >
          {pending ? "Émission…" : "Émettre définitivement"}
        </button>
      </div>
      {state?.error ? (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}

export function PaiementForm({ id, resteCents }: { id: string; resteCents: number }) {
  const [state, action, pending] = useActionState<PaiementState, FormData>(
    enregistrerPaiement,
    undefined,
  );

  return (
    <form action={action} className="rounded-lg border border-border p-4">
      <input type="hidden" name="factureId" value={id} />
      <p className="text-sm font-medium">Enregistrer un paiement</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="montant" className="block text-xs text-text-muted">
            Montant (€)
          </label>
          <input
            id="montant"
            name="montant"
            inputMode="decimal"
            defaultValue={resteCents > 0 ? (resteCents / 100).toFixed(2) : ""}
            className={`mt-1 ${inputCls}`}
          />
        </div>
        <div>
          <label htmlFor="date" className="block text-xs text-text-muted">
            Date
          </label>
          <input id="date" name="date" type="date" className={`mt-1 ${inputCls}`} />
        </div>
        <div>
          <label htmlFor="moyen" className="block text-xs text-text-muted">
            Moyen
          </label>
          <select id="moyen" name="moyen" defaultValue="virement" className={`mt-1 ${inputCls}`}>
            <option value="virement">Virement</option>
            <option value="cheque">Chèque</option>
            <option value="especes">Espèces</option>
            <option value="cb">Carte bancaire</option>
            <option value="autre">Autre</option>
          </select>
        </div>
        <div>
          <label htmlFor="reference" className="block text-xs text-text-muted">
            Référence (facultatif)
          </label>
          <input id="reference" name="reference" className={`mt-1 ${inputCls}`} />
        </div>
      </div>
      <div className="mt-3">
        <button
          type="submit"
          disabled={pending}
          className="cursor-pointer rounded-md border border-border px-3 py-1.5 text-sm hover:border-accent disabled:opacity-60"
        >
          {pending ? "…" : "Ajouter le paiement"}
        </button>
      </div>
      {state?.error ? <p className="mt-2 text-sm text-red-600">{state.error}</p> : null}
    </form>
  );
}

export function AvoirForm({ id, totalCents }: { id: string; totalCents: number }) {
  const [state, action, pending] = useActionState<AvoirState, FormData>(creerAvoir, undefined);

  return (
    <details className="rounded-lg border border-border p-4">
      <summary className="cursor-pointer text-sm font-medium">Émettre un avoir</summary>
      <form action={action} className="mt-3">
        <input type="hidden" name="factureId" value={id} />
        <p className="text-xs text-text-muted">
          Un avoir annule tout ou partie de la facture. Laisser le montant vide pour un avoir total
          ({(totalCents / 100).toFixed(2)} €).
        </p>
        <label htmlFor="montant-avoir" className="mt-3 block text-xs text-text-muted">
          Montant TTC (€) — facultatif
        </label>
        <input
          id="montant-avoir"
          name="montant"
          inputMode="decimal"
          className={`mt-1 max-w-[10rem] ${inputCls}`}
        />
        <label htmlFor="motif" className="mt-3 block text-xs text-text-muted">
          Motif
        </label>
        <input id="motif" name="motif" className={`mt-1 ${inputCls}`} />
        <div className="mt-3">
          <button
            type="submit"
            disabled={pending}
            className="cursor-pointer rounded-md border border-red-300 px-3 py-1.5 text-sm text-red-700 hover:bg-red-50 disabled:opacity-60"
          >
            {pending ? "…" : "Créer l’avoir"}
          </button>
        </div>
        {state?.error ? <p className="mt-2 text-sm text-red-600">{state.error}</p> : null}
      </form>
    </details>
  );
}
