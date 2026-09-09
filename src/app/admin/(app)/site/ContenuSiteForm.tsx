"use client";

import { useActionState, useState } from "react";

import { Field, FormSection, SubmitButton, TextAreaField } from "@/components/admin/form";
import {
  enregistrerContenuSite,
  type ContenuSiteState,
} from "@/lib/admin/contenu-site-actions";
import type { ContenuSiteRow } from "@/lib/domain/site-data";

const inputCls =
  "w-full rounded-sm border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

export function ContenuSiteForm({ contenu }: { contenu: ContenuSiteRow }) {
  const [state, action, pending] = useActionState<ContenuSiteState, FormData>(
    enregistrerContenuSite,
    undefined,
  );

  const [paragraphes, setParagraphes] = useState<string[]>(() => {
    const p = contenu.aboutParagraphes;
    return Array.isArray(p) && p.length > 0 ? (p as string[]) : [""];
  });

  return (
    <form action={action} className="flex flex-col gap-6">
      <input type="hidden" name="aboutParagraphesJson" value={JSON.stringify(paragraphes)} />

      <FormSection titre="Identité">
        <Field label="Nom affiché sur le site" name="nomAffiche" defaultValue={contenu.nomAffiche} />
        <Field label="Slogan" name="slogan" defaultValue={contenu.slogan} />
      </FormSection>

      <FormSection titre="Zone et horaires">
        <div className="sm:col-span-2">
          <Field
            label="Zone d’intervention (texte)"
            name="zoneTexte"
            defaultValue={contenu.zoneTexte}
            hint="Ex : Noyers-Bocage, Villers-Bocage, Aunay-sur-Odon et Caen"
          />
        </div>
        <Field label="Horaires" name="horaires" defaultValue={contenu.horaires} />
        <Field
          label="Adresse publique du site"
          name="urlPublique"
          defaultValue={contenu.urlPublique}
          hint="Sert aux liens SEO (sitemap, robots). Ex : https://www.houel-plombier.fr"
        />
      </FormSection>

      <FormSection titre="À propos">
        <div className="sm:col-span-2">
          <TextAreaField
            label="Phrase d’introduction"
            name="aboutIntro"
            defaultValue={contenu.aboutIntro}
            rows={2}
          />
        </div>

        <div className="sm:col-span-2 flex flex-col gap-2">
          <p className="text-sm font-medium">Paragraphes</p>
          {paragraphes.map((p, i) => (
            <div key={i} className="flex gap-2">
              <textarea
                value={p}
                rows={3}
                onChange={(e) =>
                  setParagraphes((ps) => ps.map((x, j) => (j === i ? e.target.value : x)))
                }
                className={inputCls}
              />
              <button
                type="button"
                onClick={() => setParagraphes((ps) => ps.filter((_, j) => j !== i))}
                className="cursor-pointer self-start px-2 py-2 text-text-muted hover:text-danger"
                aria-label="Supprimer ce paragraphe"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setParagraphes((ps) => [...ps, ""])}
            className="cursor-pointer self-start rounded-sm border border-border px-3 py-1.5 text-sm hover:border-accent"
          >
            + Paragraphe
          </button>
        </div>

        <div className="sm:col-span-2">
          <Field
            label="Étiquettes"
            name="aboutTags"
            defaultValue={
              Array.isArray(contenu.aboutTags) ? (contenu.aboutTags as string[]).join(", ") : ""
            }
            hint="Séparées par des virgules. Affichées sous le texte."
          />
        </div>
      </FormSection>

      <FormSection titre="Photos">
        <p className="sm:col-span-2 text-xs text-text-muted">
          Coller l’adresse (URL) d’une image. L’envoi de fichiers depuis l’admin viendra avec
          l’hébergement définitif.
        </p>
        <Field label="Photo d’en-tête — URL" name="heroPhotoUrl" defaultValue={contenu.heroPhotoUrl} />
        <Field
          label="Photo d’en-tête — description"
          name="heroPhotoAlt"
          defaultValue={contenu.heroPhotoAlt}
          hint="Décrit l’image (accessibilité)"
        />
        <Field label="Photo « à propos » — URL" name="aboutPhotoUrl" defaultValue={contenu.aboutPhotoUrl} />
        <Field
          label="Photo « à propos » — description"
          name="aboutPhotoAlt"
          defaultValue={contenu.aboutPhotoAlt}
        />
      </FormSection>

      <div className="flex items-center gap-3">
        <SubmitButton>{pending ? "Enregistrement…" : "Enregistrer"}</SubmitButton>
        {state?.ok ? <span className="text-sm text-success">Enregistré.</span> : null}
        {state?.error ? (
          <span className="text-sm text-danger" role="alert">
            {state.error}
          </span>
        ) : null}
      </div>
    </form>
  );
}
