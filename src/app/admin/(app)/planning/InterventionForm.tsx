"use client";

import { useActionState } from "react";

import {
  creerIntervention,
  modifierIntervention,
  type InterventionState,
} from "@/lib/admin/interventions-actions";
import {
  INTERVENTION_STATUTS,
  INTERVENTION_STATUT_LABELS,
} from "@/lib/admin/intervention-statuts";
import { dateVersHeureParis } from "@/lib/domain/dates";
import type { interventions } from "@/lib/db/schema";

type Intervention = typeof interventions.$inferSelect;
type ClientOption = { id: string; nom: string };

type Defaults = {
  titre?: string;
  clientId?: string | null;
  devisId?: string | null;
  debut?: string;
  fin?: string;
  adresse?: string | null;
};

const inputCls =
  "w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

export function InterventionForm({
  clients,
  intervention,
  defaults,
}: {
  clients: ClientOption[];
  intervention?: Intervention;
  defaults?: Defaults;
}) {
  const action = intervention ? modifierIntervention : creerIntervention;
  const [state, formAction, pending] = useActionState<InterventionState, FormData>(action, undefined);
  const i = intervention;

  const debut = i ? dateVersHeureParis(i.debut) : (defaults?.debut ?? "");
  const fin = i ? dateVersHeureParis(i.fin) : (defaults?.fin ?? "");
  const clientId = i?.clientId ?? defaults?.clientId ?? "";
  const devisId = i?.devisId ?? defaults?.devisId ?? "";

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {i ? <input type="hidden" name="id" value={i.id} /> : null}
      {devisId ? <input type="hidden" name="devisId" value={devisId} /> : null}

      <div className="flex flex-col gap-1">
        <label htmlFor="titre" className="text-sm font-medium">
          Titre <span className="text-red-600">*</span>
        </label>
        <input
          id="titre"
          name="titre"
          required
          defaultValue={i?.titre ?? defaults?.titre ?? ""}
          className={inputCls}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="debut" className="text-sm font-medium">
            Début <span className="text-red-600">*</span>
          </label>
          <input
            id="debut"
            name="debut"
            type="datetime-local"
            required
            defaultValue={debut}
            className={inputCls}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="fin" className="text-sm font-medium">
            Fin <span className="text-red-600">*</span>
          </label>
          <input
            id="fin"
            name="fin"
            type="datetime-local"
            required
            defaultValue={fin}
            className={inputCls}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="clientId" className="text-sm font-medium">
          Client
        </label>
        <select id="clientId" name="clientId" defaultValue={clientId} className={inputCls}>
          <option value="">— Aucun —</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nom}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="adresse" className="text-sm font-medium">
          Adresse d’intervention
        </label>
        <input
          id="adresse"
          name="adresse"
          defaultValue={i?.adresse ?? defaults?.adresse ?? ""}
          className={inputCls}
        />
      </div>

      {i ? (
        <div className="flex flex-col gap-1">
          <label htmlFor="statut" className="text-sm font-medium">
            Statut
          </label>
          <select id="statut" name="statut" defaultValue={i.statut} className={inputCls}>
            {INTERVENTION_STATUTS.map((s) => (
              <option key={s} value={s}>
                {INTERVENTION_STATUT_LABELS[s]}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <input type="hidden" name="statut" value="planifie" />
      )}

      <div className="flex flex-col gap-1">
        <label htmlFor="notes" className="text-sm font-medium">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          defaultValue={i?.notes ?? ""}
          className={inputCls}
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="cursor-pointer rounded-md bg-accent px-4 py-2 text-sm font-medium text-on-accent hover:opacity-90 disabled:opacity-60"
        >
          {pending ? "Enregistrement…" : i ? "Enregistrer" : "Créer l’intervention"}
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
