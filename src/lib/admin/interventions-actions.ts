"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { verifierSession } from "@/lib/auth/dal";
import { db } from "@/lib/db";
import { interventions } from "@/lib/db/schema";
import { heureParisVersDate } from "@/lib/domain/dates";
import { INTERVENTION_STATUTS } from "./intervention-statuts";

const texteOptionnel = z
  .string()
  .trim()
  .transform((v) => (v.length === 0 ? null : v))
  .nullable();

const uuidOptionnel = z
  .string()
  .trim()
  .transform((v) => (v.length === 0 ? null : v))
  .nullable()
  .refine((v) => v === null || z.string().uuid().safeParse(v).success, "Référence invalide.");

const base = z
  .object({
    titre: z.string().trim().min(2, "Le titre est requis."),
    clientId: uuidOptionnel,
    devisId: uuidOptionnel,
    debut: z.string().min(10, "Date de début requise."),
    fin: z.string().min(10, "Date de fin requise."),
    adresse: texteOptionnel,
    notes: texteOptionnel,
    statut: z.enum(INTERVENTION_STATUTS).default("planifie"),
  })
  .transform((v, ctx) => {
    const debut = heureParisVersDate(v.debut);
    const fin = heureParisVersDate(v.fin);
    if (Number.isNaN(debut.getTime()) || Number.isNaN(fin.getTime())) {
      ctx.addIssue({ code: "custom", message: "Dates invalides." });
      return z.NEVER;
    }
    if (fin <= debut) {
      ctx.addIssue({ code: "custom", message: "La fin doit être après le début." });
      return z.NEVER;
    }
    return { ...v, debut, fin };
  });

export type InterventionState = { error?: string } | undefined;

function lire(formData: FormData) {
  return base.safeParse({
    titre: formData.get("titre") ?? "",
    clientId: formData.get("clientId") ?? "",
    devisId: formData.get("devisId") ?? "",
    debut: formData.get("debut") ?? "",
    fin: formData.get("fin") ?? "",
    adresse: formData.get("adresse") ?? "",
    notes: formData.get("notes") ?? "",
    statut: formData.get("statut") || "planifie",
  });
}

export async function creerIntervention(
  _state: InterventionState,
  formData: FormData,
): Promise<InterventionState> {
  await verifierSession();
  const parsed = lire(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Champs invalides." };

  const [row] = await db
    .insert(interventions)
    .values({
      titre: parsed.data.titre,
      clientId: parsed.data.clientId,
      devisId: parsed.data.devisId,
      debut: parsed.data.debut,
      fin: parsed.data.fin,
      adresse: parsed.data.adresse,
      notes: parsed.data.notes,
      statut: parsed.data.statut,
    })
    .returning({ id: interventions.id });

  revalidatePath("/admin/planning");
  redirect(`/admin/planning/${row.id}`);
}

export async function modifierIntervention(
  _state: InterventionState,
  formData: FormData,
): Promise<InterventionState> {
  await verifierSession();
  const id = z.string().uuid().safeParse(formData.get("id"));
  if (!id.success) return { error: "Intervention introuvable." };

  const parsed = lire(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Champs invalides." };

  await db
    .update(interventions)
    .set({
      titre: parsed.data.titre,
      clientId: parsed.data.clientId,
      devisId: parsed.data.devisId,
      debut: parsed.data.debut,
      fin: parsed.data.fin,
      adresse: parsed.data.adresse,
      notes: parsed.data.notes,
      statut: parsed.data.statut,
      majLe: new Date(),
    })
    .where(eq(interventions.id, id.data));

  revalidatePath("/admin/planning");
  revalidatePath(`/admin/planning/${id.data}`);
  redirect(`/admin/planning/${id.data}`);
}

export async function changerStatutIntervention(formData: FormData): Promise<void> {
  await verifierSession();
  const id = z.string().uuid().safeParse(formData.get("id"));
  const statut = z.enum(INTERVENTION_STATUTS).safeParse(formData.get("statut"));
  if (!id.success || !statut.success) return;

  await db
    .update(interventions)
    .set({ statut: statut.data, majLe: new Date() })
    .where(eq(interventions.id, id.data));

  revalidatePath("/admin/planning");
  revalidatePath(`/admin/planning/${id.data}`);
}

export async function supprimerIntervention(formData: FormData): Promise<void> {
  await verifierSession();
  const id = z.string().uuid().safeParse(formData.get("id"));
  if (!id.success) return;

  await db.delete(interventions).where(eq(interventions.id, id.data));
  revalidatePath("/admin/planning");
  redirect("/admin/planning");
}
