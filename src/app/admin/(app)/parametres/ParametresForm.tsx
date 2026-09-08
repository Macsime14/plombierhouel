"use client";

import { useActionState } from "react";

import {
  Field,
  FormSection,
  SelectField,
  SubmitButton,
  TextAreaField,
} from "@/components/admin/form";
import {
  enregistrerParametres,
  type ParametresState,
} from "@/lib/admin/parametres-actions";
import type { Parametres } from "@/lib/domain/parametres";

export function ParametresForm({ parametres }: { parametres: Parametres }) {
  const [state, action, pending] = useActionState<ParametresState, FormData>(
    enregistrerParametres,
    undefined,
  );
  const p = parametres;

  return (
    <form action={action} className="flex flex-col gap-6">
      <FormSection titre="Identité">
        <Field label="Raison sociale" name="raisonSociale" defaultValue={p.raisonSociale} />
        <Field label="Forme juridique" name="formeJuridique" defaultValue={p.formeJuridique} hint="Ex : EI, EURL, SASU" />
        <Field label="SIRET" name="siret" defaultValue={p.siret} />
        <Field label="N° TVA intracommunautaire" name="tvaIntracom" defaultValue={p.tvaIntracom} />
      </FormSection>

      <FormSection titre="Coordonnées">
        <Field label="Adresse" name="adresse" defaultValue={p.adresse} />
        <Field label="Code postal" name="codePostal" defaultValue={p.codePostal} />
        <Field label="Ville" name="ville" defaultValue={p.ville} />
        <Field label="Téléphone" name="telephone" defaultValue={p.telephone} />
        <Field label="Email" name="email" type="email" defaultValue={p.email} />
      </FormSection>

      <FormSection titre="TVA et coordonnées bancaires">
        <SelectField
          label="Régime de TVA"
          name="regimeTva"
          defaultValue={p.regimeTva}
          options={[
            { value: "reel", label: "Assujetti à la TVA (régime réel)" },
            { value: "franchise_base", label: "Franchise en base (art. 293 B du CGI)" },
          ]}
        />
        <Field
          label="Taux de pénalités de retard (%)"
          name="penalitesRetardTaux"
          defaultValue={p.penalitesRetardTaux}
          hint="Laisser vide pour le taux légal (3× le taux d'intérêt légal)"
        />
        <Field label="IBAN" name="iban" defaultValue={p.iban} />
        <Field label="BIC" name="bic" defaultValue={p.bic} />
      </FormSection>

      <FormSection titre="Assurance décennale">
        <Field label="Assureur" name="assuranceDecennaleAssureur" defaultValue={p.assuranceDecennaleAssureur} />
        <Field label="N° de contrat" name="assuranceDecennaleContrat" defaultValue={p.assuranceDecennaleContrat} />
        <Field label="Zone géographique couverte" name="assuranceDecennaleZone" defaultValue={p.assuranceDecennaleZone} hint="Ex : France métropolitaine" />
      </FormSection>

      <FormSection titre="Mentions">
        <div className="sm:col-span-2">
          <TextAreaField
            label="Mentions par défaut sur les devis"
            name="mentionsDevis"
            defaultValue={p.mentionsDevis}
            rows={3}
          />
        </div>
        <div className="sm:col-span-2">
          <TextAreaField
            label="Mentions par défaut sur les factures"
            name="mentionsFacture"
            defaultValue={p.mentionsFacture}
            rows={3}
          />
        </div>
      </FormSection>

      <div className="flex items-center gap-3">
        <SubmitButton>{pending ? "Enregistrement…" : "Enregistrer"}</SubmitButton>
        {state?.ok ? <span className="text-sm text-green-700">Enregistré.</span> : null}
        {state?.error ? (
          <span className="text-sm text-red-600" role="alert">
            {state.error}
          </span>
        ) : null}
      </div>
    </form>
  );
}
