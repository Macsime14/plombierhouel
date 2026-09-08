"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { verifierSession } from "@/lib/auth/dal";
import { db } from "@/lib/db";
import { prestations } from "@/lib/db/schema";
import { saisieVersCents } from "@/lib/domain/montants";

const schema = z.object({
  libelle: z.string().trim().min(2, "Le libellé est requis."),
  description: z
    .string()
    .trim()
    .transform((v) => (v.length === 0 ? null : v))
    .nullable(),
  unite: z.string().trim().min(1).default("u"),
  puCents: z
    .string()
    .transform((v) => saisieVersCents(v))
    .refine((v) => v !== null, { message: "Prix unitaire invalide." }),
  tauxTva: z
    .string()
    .trim()
    .transform((v) => v.replace(",", "."))
    .refine((v) => !Number.isNaN(Number(v)) && Number(v) >= 0 && Number(v) <= 100, {
      message: "Taux de TVA invalide.",
    }),
  actif: z.union([z.literal("on"), z.null(), z.undefined()]).transform((v) => v === "on"),
});

export type PrestationState = { error?: string } | undefined;

function lire(formData: FormData) {
  return schema.safeParse({
    libelle: formData.get("libelle"),
    description: formData.get("description") ?? "",
    unite: formData.get("unite") || "u",
    puCents: formData.get("puCents") ?? "",
    tauxTva: formData.get("tauxTva") ?? "20",
    actif: formData.get("actif"),
  });
}

export async function creerPrestation(
  _state: PrestationState,
  formData: FormData,
): Promise<PrestationState> {
  await verifierSession();
  const parsed = lire(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Champs invalides." };

  await db.insert(prestations).values({
    libelle: parsed.data.libelle,
    description: parsed.data.description,
    unite: parsed.data.unite,
    puCents: parsed.data.puCents!,
    tauxTva: parsed.data.tauxTva,
    actif: parsed.data.actif,
  });

  revalidatePath("/admin/prestations");
  redirect("/admin/prestations");
}

export async function modifierPrestation(
  _state: PrestationState,
  formData: FormData,
): Promise<PrestationState> {
  await verifierSession();
  const id = z.string().uuid().safeParse(formData.get("id"));
  if (!id.success) return { error: "Prestation introuvable." };

  const parsed = lire(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Champs invalides." };

  await db
    .update(prestations)
    .set({
      libelle: parsed.data.libelle,
      description: parsed.data.description,
      unite: parsed.data.unite,
      puCents: parsed.data.puCents!,
      tauxTva: parsed.data.tauxTva,
      actif: parsed.data.actif,
    })
    .where(eq(prestations.id, id.data));

  revalidatePath("/admin/prestations");
  redirect("/admin/prestations");
}

export async function supprimerPrestation(formData: FormData): Promise<void> {
  await verifierSession();
  const id = z.string().uuid().safeParse(formData.get("id"));
  if (!id.success) return;

  await db.delete(prestations).where(eq(prestations.id, id.data));
  revalidatePath("/admin/prestations");
  redirect("/admin/prestations");
}
