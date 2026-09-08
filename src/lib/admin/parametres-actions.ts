"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { verifierSession } from "@/lib/auth/dal";
import { upsertParametres } from "@/lib/domain/parametres";

/** "" ou espaces → null ; sinon la chaîne nettoyée. */
const texteOptionnel = z
  .string()
  .trim()
  .transform((v) => (v.length === 0 ? null : v))
  .nullable();

const schema = z.object({
  raisonSociale: texteOptionnel,
  formeJuridique: texteOptionnel,
  siret: texteOptionnel,
  tvaIntracom: texteOptionnel,
  adresse: texteOptionnel,
  codePostal: texteOptionnel,
  ville: texteOptionnel,
  telephone: texteOptionnel,
  email: texteOptionnel,
  iban: texteOptionnel,
  bic: texteOptionnel,
  regimeTva: z.enum(["franchise_base", "reel"]),
  assuranceDecennaleAssureur: texteOptionnel,
  assuranceDecennaleContrat: texteOptionnel,
  assuranceDecennaleZone: texteOptionnel,
  mentionsDevis: texteOptionnel,
  mentionsFacture: texteOptionnel,
  penalitesRetardTaux: z
    .string()
    .trim()
    .transform((v) => (v.length === 0 ? null : v.replace(",", ".")))
    .nullable()
    .refine((v) => v === null || (!Number.isNaN(Number(v)) && Number(v) >= 0), {
      message: "Taux de pénalités invalide.",
    }),
});

export type ParametresState = { ok?: boolean; error?: string } | undefined;

export async function enregistrerParametres(
  _state: ParametresState,
  formData: FormData,
): Promise<ParametresState> {
  await verifierSession();

  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Champs invalides." };
  }

  try {
    await upsertParametres(parsed.data);
  } catch (error) {
    console.error("Erreur enregistrement paramètres:", error);
    return { error: "Une erreur est survenue à l'enregistrement." };
  }

  revalidatePath("/admin/parametres");
  return { ok: true };
}
