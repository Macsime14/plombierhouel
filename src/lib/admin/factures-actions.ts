"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { verifierSession } from "@/lib/auth/dal";
import { db } from "@/lib/db";
import { devis, devisLignes, factureJournal, factureLignes, factures } from "@/lib/db/schema";
import { getParametres } from "@/lib/domain/parametres";
import { reserverNumeroDansTx } from "@/lib/domain/numerotation";
import { hashEntreeJournal } from "@/lib/domain/journal";
import { saisieVersCents } from "@/lib/domain/montants";
import {
  calculerTotaux,
  totalHtLigneCents,
  ventilationVersJson,
  type LigneCalcul,
} from "@/lib/domain/tva";
import { chargerFacture } from "@/lib/admin/factures-data";

/* ---------- Validation des lignes (même format que les devis) ---------- */

const ligneSchema = z.object({
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

const factureSchema = z.object({
  clientId: z.string().uuid("Sélectionner un client."),
  dateEcheanceJours: z
    .string()
    .optional()
    .transform((v) => (v && v.trim() !== "" ? parseInt(v, 10) : 30))
    .refine((n) => Number.isInteger(n) && n >= 0 && n <= 180, "Échéance invalide."),
  lignes: z.array(ligneSchema).min(1, "Ajouter au moins une ligne."),
});

type LigneParsee = z.infer<typeof ligneSchema>;

export type FactureState = { error?: string } | undefined;

function parseFacture(formData: FormData) {
  let lignesBrutes: unknown = [];
  try {
    lignesBrutes = JSON.parse(String(formData.get("lignesJson") ?? "[]"));
  } catch {
    lignesBrutes = [];
  }
  return factureSchema.safeParse({
    clientId: formData.get("clientId"),
    dateEcheanceJours: formData.get("dateEcheanceJours") ?? "",
    lignes: lignesBrutes,
  });
}

function calculer(lignes: LigneParsee[], regime: "franchise_base" | "reel") {
  const pourCalcul: LigneCalcul[] = lignes.map((l) => ({
    quantite: l.quantite,
    puCents: l.puEuros!,
    tauxTva: l.tauxTva,
    remisePct: l.remisePct,
  }));
  return calculerTotaux(pourCalcul, regime);
}

async function ecrireLignes(
  factureId: string,
  lignes: LigneParsee[],
  regime: "franchise_base" | "reel",
) {
  await db.delete(factureLignes).where(eq(factureLignes.factureId, factureId));
  await db.insert(factureLignes).values(
    lignes.map((l, i) => ({
      factureId,
      ordre: i,
      designation: l.designation,
      quantite: String(l.quantite),
      unite: l.unite,
      puCents: l.puEuros!,
      tauxTva: (regime === "franchise_base" ? 0 : l.tauxTva).toFixed(2),
      totalHtCents: totalHtLigneCents({
        quantite: l.quantite,
        puCents: l.puEuros!,
        tauxTva: l.tauxTva,
        remisePct: l.remisePct,
      }),
    })),
  );
}

/* ---------- Création ---------- */

export async function creerFactureDepuisDevis(formData: FormData): Promise<void> {
  await verifierSession();
  const devisId = z.string().uuid().safeParse(formData.get("devisId"));
  if (!devisId.success) return;

  const [d] = await db.select().from(devis).where(eq(devis.id, devisId.data)).limit(1);
  if (!d) return;

  const lignes = await db
    .select()
    .from(devisLignes)
    .where(eq(devisLignes.devisId, devisId.data));

  const [row] = await db
    .insert(factures)
    .values({
      devisId: d.id,
      clientId: d.clientId,
      statut: "brouillon",
      totalHtCents: d.totalHtCents,
      totalTvaCents: d.totalTvaCents,
      totalTtcCents: d.totalTtcCents,
      tvaParTaux: d.tvaParTaux,
    })
    .returning({ id: factures.id });

  if (lignes.length > 0) {
    await db.insert(factureLignes).values(
      lignes.map((l) => ({
        factureId: row.id,
        ordre: l.ordre,
        designation: l.designation,
        quantite: l.quantite,
        unite: l.unite,
        puCents: l.puCents,
        tauxTva: l.tauxTva,
        totalHtCents: l.totalHtCents,
      })),
    );
  }

  revalidatePath("/admin/factures");
  redirect(`/admin/factures/${row.id}`);
}

export async function creerFacture(_state: FactureState, formData: FormData): Promise<FactureState> {
  await verifierSession();
  const parsed = parseFacture(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Champs invalides." };

  const params = await getParametres();
  const totaux = calculer(parsed.data.lignes, params.regimeTva);

  const [row] = await db
    .insert(factures)
    .values({
      clientId: parsed.data.clientId,
      statut: "brouillon",
      totalHtCents: totaux.totalHtCents,
      totalTvaCents: totaux.totalTvaCents,
      totalTtcCents: totaux.totalTtcCents,
      tvaParTaux: ventilationVersJson(totaux.parTaux),
    })
    .returning({ id: factures.id });

  await ecrireLignes(row.id, parsed.data.lignes, params.regimeTva);

  revalidatePath("/admin/factures");
  redirect(`/admin/factures/${row.id}`);
}

export async function modifierFacture(
  _state: FactureState,
  formData: FormData,
): Promise<FactureState> {
  await verifierSession();
  const id = z.string().uuid().safeParse(formData.get("id"));
  if (!id.success) return { error: "Facture introuvable." };

  const [f] = await db
    .select({ statut: factures.statut })
    .from(factures)
    .where(eq(factures.id, id.data))
    .limit(1);
  if (!f) return { error: "Facture introuvable." };
  if (f.statut !== "brouillon") return { error: "Une facture émise ne peut plus être modifiée." };

  const parsed = parseFacture(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Champs invalides." };

  const params = await getParametres();
  const totaux = calculer(parsed.data.lignes, params.regimeTva);

  await db
    .update(factures)
    .set({
      clientId: parsed.data.clientId,
      totalHtCents: totaux.totalHtCents,
      totalTvaCents: totaux.totalTvaCents,
      totalTtcCents: totaux.totalTtcCents,
      tvaParTaux: ventilationVersJson(totaux.parTaux),
      majLe: new Date(),
    })
    .where(eq(factures.id, id.data));

  await ecrireLignes(id.data, parsed.data.lignes, params.regimeTva);

  revalidatePath("/admin/factures");
  revalidatePath(`/admin/factures/${id.data}`);
  redirect(`/admin/factures/${id.data}`);
}

export async function supprimerFacture(formData: FormData): Promise<void> {
  await verifierSession();
  const id = z.string().uuid().safeParse(formData.get("id"));
  if (!id.success) return;

  const [f] = await db
    .select({ statut: factures.statut })
    .from(factures)
    .where(eq(factures.id, id.data))
    .limit(1);
  // Une facture émise ne se supprime jamais (seul un avoir l'annule).
  if (!f || f.statut !== "brouillon") return;

  await db.delete(factures).where(eq(factures.id, id.data));
  revalidatePath("/admin/factures");
  redirect("/admin/factures");
}

/* ---------- Émission (transition critique) ---------- */

export type EmissionState = { error?: string } | undefined;

export async function emettreFacture(
  _state: EmissionState,
  formData: FormData,
): Promise<EmissionState> {
  await verifierSession();
  const id = z.string().uuid().safeParse(formData.get("id"));
  if (!id.success) return { error: "Facture introuvable." };

  const data = await chargerFacture(id.data);
  if (!data) return { error: "Facture introuvable." };
  if (data.facture.statut !== "brouillon") return { error: "Cette facture est déjà émise." };
  if (data.lignes.length === 0) return { error: "Ajoutez au moins une ligne avant d'émettre." };
  if (!data.client) return { error: "Client introuvable." };

  const params = await getParametres();
  const dateEmission = new Date();
  const echeanceJours = Number(formData.get("dateEcheanceJours") ?? "30") || 30;
  const dateEcheance = new Date(dateEmission);
  dateEcheance.setDate(dateEcheance.getDate() + echeanceJours);

  // Copie figée : plus rien ne pourra changer après l'émission.
  const lignesFigees = data.lignes.map((l) => ({
    designation: l.designation,
    quantite: Number(l.quantite),
    unite: l.unite,
    puCents: l.puCents,
    tauxTva: Number(l.tauxTva),
    totalHtCents: l.totalHtCents,
  }));
  const mentionsFigees = {
    entreprise: {
      raisonSociale: params.raisonSociale,
      formeJuridique: params.formeJuridique,
      siret: params.siret,
      tvaIntracom: params.tvaIntracom,
      adresse: params.adresse,
      codePostal: params.codePostal,
      ville: params.ville,
      iban: params.iban,
      bic: params.bic,
      regimeTva: params.regimeTva,
      assuranceDecennale: {
        assureur: params.assuranceDecennaleAssureur,
        contrat: params.assuranceDecennaleContrat,
        zone: params.assuranceDecennaleZone,
      },
      mentionsFacture: params.mentionsFacture,
      penalitesRetardTaux: params.penalitesRetardTaux,
    },
    client: {
      nom: data.client.nom,
      adresse: data.client.adresseFacturation,
      codePostal: data.client.codePostalFacturation,
      ville: data.client.villeFacturation,
      siret: data.client.siret,
    },
  };

  try {
    await db.transaction(async (tx) => {
      const numero = await reserverNumeroDansTx(tx, "facture");

      const horodatage = new Date();
      const payloadJournal = {
        numero,
        totalTtcCents: data.facture.totalTtcCents,
        lignes: lignesFigees,
      };
      const hash = hashEntreeJournal(null, "emission", payloadJournal, horodatage);

      await tx
        .update(factures)
        .set({
          numero,
          statut: "emise",
          dateEmission,
          dateEcheance,
          lignesFigees,
          mentionsFigees,
          emiseLe: horodatage,
          majLe: horodatage,
        })
        .where(eq(factures.id, id.data));

      await tx.insert(factureJournal).values({
        factureId: id.data,
        evenement: "emission",
        payload: payloadJournal,
        horodatage,
        hashPrecedent: null,
        hash,
      });
    });
  } catch (error) {
    console.error("Erreur émission facture:", error);
    return { error: "L'émission a échoué. Réessayez." };
  }

  revalidatePath("/admin/factures");
  revalidatePath(`/admin/factures/${id.data}`);
  return undefined;
}
