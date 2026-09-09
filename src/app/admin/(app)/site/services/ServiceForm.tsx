"use client";

import { useActionState } from "react";

import {
  CheckboxField,
  Field,
  FormSection,
  SubmitButton,
  TextAreaField,
} from "@/components/admin/form";
import {
  creerService,
  modifierService,
  type ServiceState,
} from "@/lib/admin/services-site-actions";
import type { servicesSite } from "@/lib/db/schema";

type ServiceRow = typeof servicesSite.$inferSelect;

export function ServiceForm({ service }: { service?: ServiceRow }) {
  const action = service ? modifierService : creerService;
  const [state, formAction, pending] = useActionState<ServiceState, FormData>(action, undefined);
  const s = service;

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {s ? <input type="hidden" name="id" value={s.id} /> : null}

      <FormSection titre="Service">
        <div className="sm:col-span-2">
          <Field label="Titre" name="titre" required defaultValue={s?.titre} />
        </div>
        <div className="sm:col-span-2">
          <TextAreaField
            label="Description"
            name="description"
            defaultValue={s?.description}
            rows={3}
            required
          />
        </div>
        <Field
          label="Photo — URL"
          name="photoUrl"
          defaultValue={s?.photoUrl}
          hint="Coller l’adresse d’une image (facultatif)"
        />
        <Field label="Photo — description" name="photoAlt" defaultValue={s?.photoAlt} />
        <CheckboxField
          label="Affiché sur le site"
          name="actif"
          defaultChecked={s ? s.actif : true}
        />
      </FormSection>

      <div className="flex items-center gap-3">
        <SubmitButton>
          {pending ? "Enregistrement…" : s ? "Enregistrer" : "Ajouter le service"}
        </SubmitButton>
        {state?.error ? (
          <span className="text-sm text-danger" role="alert">
            {state.error}
          </span>
        ) : null}
      </div>
    </form>
  );
}
