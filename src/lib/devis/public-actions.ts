"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/lib/db";
import { devis } from "@/lib/db/schema";

export type ReponseDevisState = { ok?: "accepte" | "refuse"; error?: string } | undefined;

const STATUTS_REPONDABLES = ["envoye", "vu"] as const;

async function ipDemandeur() {
  const h = await headers();
  const xff = h.get("x-forwarded-for");
  return xff ? xff.split(",")[0].trim() : (h.get("x-real-ip") ?? null);
}

/** Marque le devis comme "vu" à la première consultation (sans effet si déjà répondu). */
export async function marquerDevisVu(token: string) {
  await db
    .update(devis)
    .set({ statut: "vu", vuLe: new Date() })
    .where(and(eq(devis.tokenPublic, token), eq(devis.statut, "envoye")));
}

export async function accepterDevis(
  _state: ReponseDevisState,
  formData: FormData,
): Promise<ReponseDevisState> {
  const token = z.string().min(10).safeParse(formData.get("token"));
  const nom = z.string().trim().min(2, "Merci d'indiquer votre nom.").safeParse(formData.get("nom"));
  if (!token.success) return { error: "Lien invalide." };
  if (!nom.success) return { error: nom.error.issues[0]?.message ?? "Nom requis." };

  const [d] = await db
    .select({ statut: devis.statut })
    .from(devis)
    .where(eq(devis.tokenPublic, token.data))
    .limit(1);

  if (!d) return { error: "Devis introuvable." };
  if (d.statut === "accepte") return { ok: "accepte" };
  if (!STATUTS_REPONDABLES.includes(d.statut as (typeof STATUTS_REPONDABLES)[number])) {
    return { error: "Ce devis ne peut plus être accepté. Contactez-nous." };
  }

  await db
    .update(devis)
    .set({
      statut: "accepte",
      accepteLe: new Date(),
      accepteParNom: nom.data,
      accepteParIp: await ipDemandeur(),
      majLe: new Date(),
    })
    .where(eq(devis.tokenPublic, token.data));

  revalidatePath(`/devis/${token.data}`);
  return { ok: "accepte" };
}

export async function refuserDevis(
  _state: ReponseDevisState,
  formData: FormData,
): Promise<ReponseDevisState> {
  const token = z.string().min(10).safeParse(formData.get("token"));
  if (!token.success) return { error: "Lien invalide." };

  const [d] = await db
    .select({ statut: devis.statut })
    .from(devis)
    .where(eq(devis.tokenPublic, token.data))
    .limit(1);

  if (!d) return { error: "Devis introuvable." };
  if (d.statut === "refuse") return { ok: "refuse" };
  if (!STATUTS_REPONDABLES.includes(d.statut as (typeof STATUTS_REPONDABLES)[number])) {
    return { error: "Ce devis ne peut plus être modifié." };
  }

  await db
    .update(devis)
    .set({ statut: "refuse", refuseLe: new Date(), majLe: new Date() })
    .where(eq(devis.tokenPublic, token.data));

  revalidatePath(`/devis/${token.data}`);
  return { ok: "refuse" };
}
