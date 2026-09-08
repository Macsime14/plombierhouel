"use client";

import { useActionState } from "react";

import {
  CheckboxField,
  Field,
  FormSection,
  SelectField,
  SubmitButton,
  TextAreaField,
} from "@/components/admin/form";
import { optionsUnites } from "@/lib/domain/unites";
import {
  creerPrestation,
  modifierPrestation,
  type PrestationState,
} from "@/lib/admin/prestations-actions";
import { centsVersSaisie } from "@/lib/domain/montants";
import type { prestations } from "@/lib/db/schema";

type Prestation = typeof prestations.$inferSelect;

export function PrestationForm({ prestation }: { prestation?: Prestation }) {
  const action = prestation ? modifierPrestation : creerPrestation;
  const [state, formAction, pending] = useActionState<PrestationState, FormData>(action, undefined);
  const p = prestation;

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {p ? <input type="hidden" name="id" value={p.id} /> : null}

      <FormSection titre="Prestation">
        <div className="sm:col-span-2">
          <Field label="Libellé" name="libelle" required defaultValue={p?.libelle} />
        </div>
        <div className="sm:col-span-2">
          <TextAreaField label="Description" name="description" defaultValue={p?.description} rows={2} />
        </div>
        <SelectField
          label="Unité"
          name="unite"
          defaultValue={p?.unite ?? "u"}
          options={optionsUnites(p?.unite)}
          hint="Ce que compte la quantité (h = heure, m² = surface, forfait = prix fixe…)"
        />
        <Field
          label="Prix unitaire HT (€)"
          name="puCents"
          defaultValue={centsVersSaisie(p?.puCents)}
          hint="Hors taxes, en euros"
          required
        />
        <Field
          label="Taux de TVA (%)"
          name="tauxTva"
          defaultValue={p?.tauxTva ?? "20"}
          hint="20 (normal) · 10 (rénovation logement > 2 ans) · 5,5 (rénovation énergétique)"
        />
        <CheckboxField
          label="Prestation active"
          name="actif"
          defaultChecked={p ? p.actif : true}
          hint="Décocher pour la retirer du catalogue sans la supprimer"
        />
      </FormSection>

      <div className="flex items-center gap-3">
        <SubmitButton>
          {pending ? "Enregistrement…" : p ? "Enregistrer" : "Ajouter au catalogue"}
        </SubmitButton>
        {state?.error ? (
          <span className="text-sm text-red-600" role="alert">
            {state.error}
          </span>
        ) : null}
      </div>
    </form>
  );
}
