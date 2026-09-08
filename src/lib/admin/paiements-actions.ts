"use server";

import { revalidatePath } from "next/cache";
import { eq, sum } from "drizzle-orm";
import { z } from "zod";

import { verifierSession } from "@/lib/auth/dal";
import { db } from "@/lib/db";
import { avoirs, factureJournal, factures, paiements } from "@/lib/db/schema";
import { reserverNumeroDansTx } from "@/lib/domain/numerotation";
import { hashEntreeJournal } from "@/lib/domain/journal";
import { saisieVersCents } from "@/lib/domain/montants";
import { dernierHashJournal } from "@/lib/admin/factures-data";
import { heureParisVersDate } from "@/lib/domain/dates";

export type PaiementState = { error?: string; ok?: boolean } | undefined;

const MOYENS = ["virement", "cheque", "especes", "cb", "autre"] as const;

async function totalPayeCents(factureId: string): Promise<number> {
  const [{ total } = { total: null }] = await db
    .select({ total: sum(paiements.montantCents) })
    .from(paiements)
    .where(eq(paiements.factureId, factureId));
  return Number(total ?? 0);
}

async function ajouterEntreeJournal(factureId: string, evenement: string, payload: unknown) {
  const horodatage = new Date();
  const precedent = await dernierHashJournal(factureId);
  const hash = hashEntreeJournal(precedent, evenement, payload, horodatage);
  await db.insert(factureJournal).values({
    factureId,
    evenement,
    payload,
    horodatage,
    hashPrecedent: precedent,
    hash,
  });
}

export async function enregistrerPaiement(
  _state: PaiementState,
  formData: FormData,
): Promise<PaiementState> {
  await verifierSession();

  const id = z.string().uuid().safeParse(formData.get("factureId"));
  if (!id.success) return { error: "Facture introuvable." };

  const montant = saisieVersCents(String(formData.get("montant") ?? ""));
  if (montant === null || montant <= 0) return { error: "Montant invalide." };

  const moyen = z.enum(MOYENS).safeParse(formData.get("moyen"));
  if (!moyen.success) return { error: "Moyen de paiement invalide." };

  const dateStr = String(formData.get("date") ?? "");
  const date = dateStr ? heureParisVersDate(`${dateStr}T12:00`) : new Date();
  const reference = String(formData.get("reference") ?? "").trim() || null;

  const [f] = await db
    .select({ statut: factures.statut, totalTtcCents: factures.totalTtcCents })
    .from(factures)
    .where(eq(factures.id, id.data))
    .limit(1);
  if (!f) return { error: "Facture introuvable." };
  if (f.statut === "brouillon") return { error: "Émettez la facture avant d'enregistrer un paiement." };
  if (f.statut === "annulee") return { error: "Cette facture est annulée." };

  await db.insert(paiements).values({
    factureId: id.data,
    montantCents: montant,
    moyen: moyen.data,
    date,
    reference,
  });

  const paye = await totalPayeCents(id.data);
  const nouveauStatut = paye >= f.totalTtcCents ? "payee" : "payee_partiel";
  await db.update(factures).set({ statut: nouveauStatut, majLe: new Date() }).where(eq(factures.id, id.data));

  await ajouterEntreeJournal(id.data, "paiement", { montantCents: montant, moyen: moyen.data, reference });

  revalidatePath(`/admin/factures/${id.data}`);
  revalidatePath("/admin/factures");
  return { ok: true };
}

export async function supprimerPaiement(formData: FormData): Promise<void> {
  await verifierSession();
  const id = z.string().uuid().safeParse(formData.get("id"));
  const factureId = z.string().uuid().safeParse(formData.get("factureId"));
  if (!id.success || !factureId.success) return;

  const [p] = await db
    .select({ montantCents: paiements.montantCents })
    .from(paiements)
    .where(eq(paiements.id, id.data))
    .limit(1);
  if (!p) return;

  await db.delete(paiements).where(eq(paiements.id, id.data));

  const [f] = await db
    .select({ totalTtcCents: factures.totalTtcCents, statut: factures.statut })
    .from(factures)
    .where(eq(factures.id, factureId.data))
    .limit(1);
  if (f && f.statut !== "annulee") {
    const paye = await totalPayeCents(factureId.data);
    const statut = paye <= 0 ? "emise" : paye >= f.totalTtcCents ? "payee" : "payee_partiel";
    await db.update(factures).set({ statut, majLe: new Date() }).where(eq(factures.id, factureId.data));
  }

  await ajouterEntreeJournal(factureId.data, "paiement_annule", { montantCents: p.montantCents });
  revalidatePath(`/admin/factures/${factureId.data}`);
}

export type AvoirState = { error?: string; ok?: boolean } | undefined;

export async function creerAvoir(_state: AvoirState, formData: FormData): Promise<AvoirState> {
  await verifierSession();

  const id = z.string().uuid().safeParse(formData.get("factureId"));
  if (!id.success) return { error: "Facture introuvable." };

  const motif = String(formData.get("motif") ?? "").trim() || null;

  const [f] = await db
    .select({
      statut: factures.statut,
      totalHtCents: factures.totalHtCents,
      totalTtcCents: factures.totalTtcCents,
    })
    .from(factures)
    .where(eq(factures.id, id.data))
    .limit(1);
  if (!f) return { error: "Facture introuvable." };
  if (f.statut === "brouillon") return { error: "Une facture doit être émise avant d'être avoirée." };
  if (f.statut === "annulee") return { error: "Cette facture est déjà annulée." };

  // Montant : par défaut le total de la facture (avoir total). Sinon montant saisi.
  const saisi = saisieVersCents(String(formData.get("montant") ?? ""));
  const montantTtc = saisi && saisi > 0 ? Math.min(saisi, f.totalTtcCents) : f.totalTtcCents;
  const ratio = f.totalTtcCents > 0 ? montantTtc / f.totalTtcCents : 1;
  const montantHt = Math.round(f.totalHtCents * ratio);

  try {
    await db.transaction(async (tx) => {
      const numero = await reserverNumeroDansTx(tx, "avoir");
      await tx.insert(avoirs).values({
        numero,
        factureId: id.data,
        montantHtCents: montantHt,
        montantTtcCents: montantTtc,
        motif,
      });

      const [{ total } = { total: null }] = await tx
        .select({ total: sum(avoirs.montantTtcCents) })
        .from(avoirs)
        .where(eq(avoirs.factureId, id.data));
      const totalAvoirs = Number(total ?? 0);

      if (totalAvoirs >= f.totalTtcCents) {
        await tx.update(factures).set({ statut: "annulee", majLe: new Date() }).where(eq(factures.id, id.data));
      }

      const horodatage = new Date();
      const precedent = await dernierHashJournal(id.data);
      const payload = { numero, montantTtcCents: montantTtc, motif };
      const hash = hashEntreeJournal(precedent, "avoir", payload, horodatage);
      await tx.insert(factureJournal).values({
        factureId: id.data,
        evenement: "avoir",
        payload,
        horodatage,
        hashPrecedent: precedent,
        hash,
      });
    });
  } catch (error) {
    console.error("Erreur création avoir:", error);
    return { error: "La création de l'avoir a échoué." };
  }

  revalidatePath(`/admin/factures/${id.data}`);
  revalidatePath("/admin/factures");
  return { ok: true };
}
