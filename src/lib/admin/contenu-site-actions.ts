"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { verifierSession } from "@/lib/auth/dal";
import { upsertContenuSite } from "@/lib/domain/site-data";

const texteOptionnel = z
  .string()
  .trim()
  .transform((v) => (v.length === 0 ? null : v))
  .nullable();

const schema = z.object({
  nomAffiche: texteOptionnel,
  slogan: texteOptionnel,
  zoneTexte: texteOptionnel,
  horaires: texteOptionnel,
  urlPublique: texteOptionnel.refine(
    (v) => v === null || /^https?:\/\/.+/.test(v),
    "L'URL doit commencer par http:// ou https://",
  ),
  aboutIntro: texteOptionnel,
  aboutTags: texteOptionnel,
  heroPhotoUrl: texteOptionnel,
  heroPhotoAlt: texteOptionnel,
  aboutPhotoUrl: texteOptionnel,
  aboutPhotoAlt: texteOptionnel,
});

export type ContenuSiteState = { ok?: boolean; error?: string } | undefined;

export async function enregistrerContenuSite(
  _state: ContenuSiteState,
  formData: FormData,
): Promise<ContenuSiteState> {
  await verifierSession();

  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Champs invalides." };
  }

  // Paragraphes : un champ multi-lignes par paragraphe, sérialisés en JSON par le formulaire.
  let paragraphes: string[] = [];
  try {
    const brut: unknown = JSON.parse(String(formData.get("aboutParagraphesJson") ?? "[]"));
    if (Array.isArray(brut)) {
      paragraphes = brut.map((p) => String(p).trim()).filter((p) => p.length > 0);
    }
  } catch {
    paragraphes = [];
  }

  const tags = (parsed.data.aboutTags ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter((t) => t.length > 0);

  try {
    await upsertContenuSite({
      nomAffiche: parsed.data.nomAffiche,
      slogan: parsed.data.slogan,
      zoneTexte: parsed.data.zoneTexte,
      horaires: parsed.data.horaires,
      urlPublique: parsed.data.urlPublique,
      aboutIntro: parsed.data.aboutIntro,
      aboutParagraphes: paragraphes,
      aboutTags: tags,
      heroPhotoUrl: parsed.data.heroPhotoUrl,
      heroPhotoAlt: parsed.data.heroPhotoAlt,
      aboutPhotoUrl: parsed.data.aboutPhotoUrl,
      aboutPhotoAlt: parsed.data.aboutPhotoAlt,
    });
  } catch (error) {
    console.error("Erreur enregistrement contenu du site:", error);
    return { error: "Une erreur est survenue à l'enregistrement." };
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin/site");
  return { ok: true };
}
