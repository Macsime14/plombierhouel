"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { verifierSession } from "@/lib/auth/dal";
import { db } from "@/lib/db";
import { clients, demandes } from "@/lib/db/schema";

const STATUTS = ["nouveau", "a_rappeler", "devis_envoye", "gagne", "perdu"] as const;

export async function changerStatutDemande(formData: FormData): Promise<void> {
  await verifierSession();

  const id = z.string().uuid().safeParse(formData.get("id"));
  const statut = z.enum(STATUTS).safeParse(formData.get("statut"));
  if (!id.success || !statut.success) return;

  const traitee = statut.data !== "nouveau";
  await db
    .update(demandes)
    .set({ statut: statut.data, traiteeLe: traitee ? new Date() : null })
    .where(eq(demandes.id, id.data));

  revalidatePath("/admin/demandes");
  revalidatePath(`/admin/demandes/${id.data}`);
}

export type NotesState = { ok?: boolean; error?: string } | undefined;

export async function enregistrerNotesDemande(
  _state: NotesState,
  formData: FormData,
): Promise<NotesState> {
  await verifierSession();

  const id = z.string().uuid().safeParse(formData.get("id"));
  if (!id.success) return { error: "Demande introuvable." };

  const notes = z
    .string()
    .trim()
    .transform((v) => (v.length === 0 ? null : v))
    .parse(formData.get("notes") ?? "");

  await db.update(demandes).set({ notes }).where(eq(demandes.id, id.data));

  revalidatePath(`/admin/demandes/${id.data}`);
  return { ok: true };
}

export async function creerClientDepuisDemande(formData: FormData): Promise<void> {
  await verifierSession();

  const id = z.string().uuid().safeParse(formData.get("id"));
  if (!id.success) return;

  const [demande] = await db.select().from(demandes).where(eq(demandes.id, id.data)).limit(1);
  if (!demande) return;

  let clientId = demande.clientId;
  if (!clientId) {
    const [row] = await db
      .insert(clients)
      .values({
        type: "particulier",
        nom: demande.nom,
        email: demande.email,
        telephone: demande.telephone,
      })
      .returning({ id: clients.id });
    clientId = row.id;
    await db.update(demandes).set({ clientId }).where(eq(demandes.id, id.data));
  }

  revalidatePath("/admin/clients");
  redirect(`/admin/clients/${clientId}`);
}
