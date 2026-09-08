"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { verifierSession } from "@/lib/auth/dal";
import { db } from "@/lib/db";
import { clients } from "@/lib/db/schema";

const texteOptionnel = z
  .string()
  .trim()
  .transform((v) => (v.length === 0 ? null : v))
  .nullable();

const clientSchema = z.object({
  type: z.enum(["particulier", "pro"]),
  nom: z.string().trim().min(2, "Le nom est requis."),
  email: z
    .string()
    .trim()
    .transform((v) => (v.length === 0 ? null : v))
    .nullable()
    .refine((v) => v === null || z.string().email().safeParse(v).success, {
      message: "Adresse email invalide.",
    }),
  telephone: texteOptionnel,
  adresseFacturation: texteOptionnel,
  codePostalFacturation: texteOptionnel,
  villeFacturation: texteOptionnel,
  adresseChantier: texteOptionnel,
  codePostalChantier: texteOptionnel,
  villeChantier: texteOptionnel,
  siret: texteOptionnel,
  tvaIntracom: texteOptionnel,
  notes: texteOptionnel,
});

export type ClientState = { error?: string } | undefined;

export async function creerClient(_state: ClientState, formData: FormData): Promise<ClientState> {
  await verifierSession();

  const parsed = clientSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Champs invalides." };
  }

  const [row] = await db
    .insert(clients)
    .values(parsed.data)
    .returning({ id: clients.id });

  revalidatePath("/admin/clients");
  redirect(`/admin/clients/${row.id}`);
}

export async function modifierClient(_state: ClientState, formData: FormData): Promise<ClientState> {
  await verifierSession();

  const id = z.string().uuid().safeParse(formData.get("id"));
  if (!id.success) return { error: "Client introuvable." };

  const parsed = clientSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Champs invalides." };
  }

  await db
    .update(clients)
    .set({ ...parsed.data, majLe: new Date() })
    .where(eq(clients.id, id.data));

  revalidatePath("/admin/clients");
  revalidatePath(`/admin/clients/${id.data}`);
  redirect(`/admin/clients/${id.data}`);
}

export async function supprimerClient(formData: FormData): Promise<void> {
  await verifierSession();

  const id = z.string().uuid().safeParse(formData.get("id"));
  if (!id.success) return;

  await db.delete(clients).where(eq(clients.id, id.data));

  revalidatePath("/admin/clients");
  redirect("/admin/clients");
}
