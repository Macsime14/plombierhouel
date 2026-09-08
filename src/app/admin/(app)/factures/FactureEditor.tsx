"use client";

import { useActionState } from "react";

import { creerFacture, modifierFacture, type FactureState } from "@/lib/admin/factures-actions";
import {
  LignesEditor,
  type LigneInitiale,
  type PrestationOption,
} from "@/components/admin/LignesEditor";

type ClientOption = { id: string; nom: string };

const inputCls =
  "w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

export function FactureEditor({
  clients,
  prestations,
  regimeTva,
  factureId,
  defaults,
}: {
  clients: ClientOption[];
  prestations: PrestationOption[];
  regimeTva: "franchise_base" | "reel";
  factureId?: string;
  defaults?: { clientId?: string; lignes: LigneInitiale[] };
}) {
  const action = factureId ? modifierFacture : creerFacture;
  const [state, formAction, pending] = useActionState<FactureState, FormData>(action, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {factureId ? <input type="hidden" name="id" value={factureId} /> : null}

      <div className="max-w-sm">
        <label htmlFor="clientId" className="text-sm font-medium">
          Client <span className="text-red-600">*</span>
        </label>
        <select
          id="clientId"
          name="clientId"
          required
          defaultValue={defaults?.clientId ?? ""}
          className={`mt-1 ${inputCls}`}
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

      <LignesEditor
        prestations={prestations}
        regimeTva={regimeTva}
        defaultLignes={defaults?.lignes ?? []}
      />

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="cursor-pointer rounded-md bg-accent px-4 py-2 text-sm font-medium text-on-accent hover:opacity-90 disabled:opacity-60"
        >
          {pending ? "Enregistrement…" : factureId ? "Enregistrer le brouillon" : "Créer le brouillon"}
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
