"use client";

import { useActionState } from "react";

import { creerDevis, modifierDevis, type DevisState } from "@/lib/admin/devis-actions";
import {
  LignesEditor,
  type LigneInitiale,
  type PrestationOption,
} from "@/components/admin/LignesEditor";

export type { LigneInitiale };

type ClientOption = { id: string; nom: string };

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

const inputCls =
  "w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

export function DevisEditor({ clients, prestations, regimeTva, devisId, demandeId, defaults }: Props) {
  const action = devisId ? modifierDevis : creerDevis;
  const [state, formAction, pending] = useActionState<DevisState, FormData>(action, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {devisId ? <input type="hidden" name="id" value={devisId} /> : null}
      {demandeId ? <input type="hidden" name="demandeId" value={demandeId} /> : null}

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

      <LignesEditor
        prestations={prestations}
        regimeTva={regimeTva}
        defaultLignes={defaults?.lignes ?? []}
      />

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
