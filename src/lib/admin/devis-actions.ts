"use server";

import { randomBytes } from "node:crypto";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { verifierSession } from "@/lib/auth/dal";
import { db } from "@/lib/db";
import { devis, devisLignes } from "@/lib/db/schema";
import { getParametres } from "@/lib/domain/parametres";
import { reserverNumero } from "@/lib/domain/numerotation";
import { saisieVersCents } from "@/lib/domain/montants";
import {
  calculerTotaux,
  totalHtLigneCents,
  ventilationVersJson,
  type LigneCalcul,
} from "@/lib/domain/tva";

const ligneSchema = z.object({
  prestationId: z.string().uuid().nullable().optional(),
  designation: z.string().trim().min(1, "Chaque ligne doit avoir une désignation."),
  quantite: z
    .string()
    .transform((v) => Number(v.replace(",", ".")))
    .refine((n) => Number.isFinite(n) && n > 0, "Quantité invalide."),
  unite: z.string().trim().min(1).default("u"),
  puEuros: z
    .string()
    .transform((v) => saisieVersCents(v))
    .refine((v) => v !== null, "Prix unitaire invalide."),
  tauxTva: z
    .string()
    .transform((v) => Number(v.replace(",", ".")))
    .refine((n) => Number.isFinite(n) && n >= 0 && n <= 100, "Taux de TVA invalide."),
  remisePct: z
    .string()
    .optional()
    .transform((v) => (v && v.trim() !== "" ? Number(v.replace(",", ".")) : 0))
    .refine((n) => Number.isFinite(n) && n >= 0 && n <= 100, "Remise invalide."),
});

const devisSchema = z.object({
  clientId: z.string().uuid("Sélectionner un client."),
  demandeId: z.string().uuid().nullable().optional(),
  validiteJours: z
    .string()
    .optional()
    .transform((v) => (v && v.trim() !== "" ? parseInt(v, 10) : 30))
    .refine((n) => Number.isInteger(n) && n > 0 && n <= 365, "Validité invalide."),
  conditions: z
    .string()
    .trim()
    .transform((v) => (v.length === 0 ? null : v))
    .nullable(),
  notesInternes: z
    .string()
    .trim()
    .transform((v) => (v.length === 0 ? null : v))
    .nullable(),
  lignes: z.array(ligneSchema).min(1, "Ajouter au moins une ligne."),
});

export type DevisState = { error?: string } | undefined;

function parseDevis(formData: FormData) {
  let lignesBrutes: unknown = [];
  try {
    lignesBrutes = JSON.parse(String(formData.get("lignesJson") ?? "[]"));
  } catch {
    lignesBrutes = [];
  }
  return devisSchema.safeParse({
    clientId: formData.get("clientId"),
    demandeId: formData.get("demandeId") || null,
    validiteJours: formData.get("validiteJours") ?? "",
    conditions: formData.get("conditions") ?? "",
    notesInternes: formData.get("notesInternes") ?? "",
    lignes: lignesBrutes,
  });
}

type LigneParsee = z.infer<typeof ligneSchema>;

function calculer(lignes: LigneParsee[], regime: "franchise_base" | "reel") {
  const pourCalcul: LigneCalcul[] = lignes.map((l) => ({
    quantite: l.quantite,
    puCents: l.puEuros!,
    tauxTva: l.tauxTva,
    remisePct: l.remisePct,
  }));
  return calculerTotaux(pourCalcul, regime);
}

async function ecrireLignes(devisId: string, lignes: LigneParsee[], regime: "franchise_base" | "reel") {
  await db.delete(devisLignes).where(eq(devisLignes.devisId, devisId));
  await db.insert(devisLignes).values(
    lignes.map((l, i) => ({
      devisId,
      ordre: i,
      prestationId: l.prestationId ?? null,
      designation: l.designation,
      quantite: String(l.quantite),
      unite: l.unite,
      puCents: l.puEuros!,
      tauxTva: (regime === "franchise_base" ? 0 : l.tauxTva).toFixed(2),
      remisePct: (l.remisePct ?? 0).toFixed(2),
      totalHtCents: totalHtLigneCents({
        quantite: l.quantite,
        puCents: l.puEuros!,
        tauxTva: l.tauxTva,
        remisePct: l.remisePct,
      }),
    })),
  );
}

export async function creerDevis(_state: DevisState, formData: FormData): Promise<DevisState> {
  await verifierSession();
  const parsed = parseDevis(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Champs invalides." };

  const params = await getParametres();
  const totaux = calculer(parsed.data.lignes, params.regimeTva);
  const numero = await reserverNumero("devis");

  const [row] = await db
    .insert(devis)
    .values({
      numero,
      clientId: parsed.data.clientId,
      demandeId: parsed.data.demandeId ?? null,
      validiteJours: parsed.data.validiteJours,
      conditions: parsed.data.conditions,
      notesInternes: parsed.data.notesInternes,
      statut: "brouillon",
      totalHtCents: totaux.totalHtCents,
      totalTvaCents: totaux.totalTvaCents,
      totalTtcCents: totaux.totalTtcCents,
      tvaParTaux: ventilationVersJson(totaux.parTaux),
      tokenPublic: randomBytes(24).toString("base64url"),
    })
    .returning({ id: devis.id });

  await ecrireLignes(row.id, parsed.data.lignes, params.regimeTva);

  revalidatePath("/admin/devis");
  redirect(`/admin/devis/${row.id}`);
}

export async function modifierDevis(_state: DevisState, formData: FormData): Promise<DevisState> {
  await verifierSession();

  const id = z.string().uuid().safeParse(formData.get("id"));
  if (!id.success) return { error: "Devis introuvable." };

  const [existant] = await db
    .select({ statut: devis.statut })
    .from(devis)
    .where(eq(devis.id, id.data))
    .limit(1);
  if (!existant) return { error: "Devis introuvable." };
  if (existant.statut === "accepte") {
    return { error: "Un devis accepté ne peut plus être modifié." };
  }

  const parsed = parseDevis(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Champs invalides." };

  const params = await getParametres();
  const totaux = calculer(parsed.data.lignes, params.regimeTva);

  await db
    .update(devis)
    .set({
      clientId: parsed.data.clientId,
      validiteJours: parsed.data.validiteJours,
      conditions: parsed.data.conditions,
      notesInternes: parsed.data.notesInternes,
      totalHtCents: totaux.totalHtCents,
      totalTvaCents: totaux.totalTvaCents,
      totalTtcCents: totaux.totalTtcCents,
      tvaParTaux: ventilationVersJson(totaux.parTaux),
      majLe: new Date(),
    })
    .where(eq(devis.id, id.data));

  await ecrireLignes(id.data, parsed.data.lignes, params.regimeTva);

  revalidatePath("/admin/devis");
  revalidatePath(`/admin/devis/${id.data}`);
  redirect(`/admin/devis/${id.data}`);
}

const STATUTS_MANUELS = ["brouillon", "envoye", "accepte", "refuse", "expire"] as const;

export async function changerStatutDevis(formData: FormData): Promise<void> {
  await verifierSession();
  const id = z.string().uuid().safeParse(formData.get("id"));
  const statut = z.enum(STATUTS_MANUELS).safeParse(formData.get("statut"));
  if (!id.success || !statut.success) return;

  const patch: Record<string, unknown> = { statut: statut.data, majLe: new Date() };
  if (statut.data === "envoye") patch.envoyeLe = new Date();
  if (statut.data === "accepte") patch.accepteLe = new Date();
  if (statut.data === "refuse") patch.refuseLe = new Date();

  await db.update(devis).set(patch).where(eq(devis.id, id.data));
  revalidatePath("/admin/devis");
  revalidatePath(`/admin/devis/${id.data}`);
}

export async function supprimerDevis(formData: FormData): Promise<void> {
  await verifierSession();
  const id = z.string().uuid().safeParse(formData.get("id"));
  if (!id.success) return;

  await db.delete(devis).where(eq(devis.id, id.data));
  revalidatePath("/admin/devis");
  redirect("/admin/devis");
}
