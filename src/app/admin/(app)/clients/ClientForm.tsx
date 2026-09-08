"use client";

import { useActionState } from "react";

import { Field, FormSection, SelectField, SubmitButton, TextAreaField } from "@/components/admin/form";
import {
  creerClient,
  modifierClient,
  type ClientState,
} from "@/lib/admin/clients-actions";
import type { clients } from "@/lib/db/schema";

type Client = typeof clients.$inferSelect;

export function ClientForm({ client }: { client?: Client }) {
  const action = client ? modifierClient : creerClient;
  const [state, formAction, pending] = useActionState<ClientState, FormData>(action, undefined);
  const c = client;

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {c ? <input type="hidden" name="id" value={c.id} /> : null}

      <FormSection titre="Client">
        <SelectField
          label="Type"
          name="type"
          defaultValue={c?.type ?? "particulier"}
          options={[
            { value: "particulier", label: "Particulier" },
            { value: "pro", label: "Professionnel" },
          ]}
        />
        <Field label="Nom" name="nom" required defaultValue={c?.nom} />
        <Field label="Email" name="email" type="email" defaultValue={c?.email} />
        <Field label="Téléphone" name="telephone" defaultValue={c?.telephone} />
        <Field label="SIRET (si pro)" name="siret" defaultValue={c?.siret} />
        <Field label="N° TVA intracom (si pro)" name="tvaIntracom" defaultValue={c?.tvaIntracom} />
      </FormSection>

      <FormSection titre="Adresse de facturation">
        <div className="sm:col-span-2">
          <Field label="Adresse" name="adresseFacturation" defaultValue={c?.adresseFacturation} />
        </div>
        <Field label="Code postal" name="codePostalFacturation" defaultValue={c?.codePostalFacturation} />
        <Field label="Ville" name="villeFacturation" defaultValue={c?.villeFacturation} />
      </FormSection>

      <FormSection titre="Adresse du chantier (si différente)">
        <div className="sm:col-span-2">
          <Field label="Adresse" name="adresseChantier" defaultValue={c?.adresseChantier} />
        </div>
        <Field label="Code postal" name="codePostalChantier" defaultValue={c?.codePostalChantier} />
        <Field label="Ville" name="villeChantier" defaultValue={c?.villeChantier} />
      </FormSection>

      <FormSection titre="Notes internes">
        <div className="sm:col-span-2">
          <TextAreaField label="Notes" name="notes" defaultValue={c?.notes} rows={3} />
        </div>
      </FormSection>

      <div className="flex items-center gap-3">
        <SubmitButton>
          {pending ? "Enregistrement…" : c ? "Enregistrer les modifications" : "Créer le client"}
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
