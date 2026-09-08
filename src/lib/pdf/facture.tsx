import "server-only";

import { renderToBuffer } from "@react-pdf/renderer";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { factures } from "@/lib/db/schema";
import { calculerTotaux, type LigneCalcul } from "@/lib/domain/tva";
import {
  FactureDocument,
  type FacturePdfData,
  type LigneFigee,
  type MentionsFigees,
} from "./FactureDocument";

export async function genererFacturePdf(
  factureId: string,
): Promise<{ buffer: Buffer; numero: string } | null> {
  const [f] = await db.select().from(factures).where(eq(factures.id, factureId)).limit(1);
  if (!f || f.statut === "brouillon" || !f.numero || !f.lignesFigees || !f.mentionsFigees) {
    return null;
  }

  const mentions = f.mentionsFigees as MentionsFigees;
  const lignes = f.lignesFigees as LigneFigee[];
  const franchise = mentions.entreprise.regimeTva === "franchise_base";

  const pourCalcul: LigneCalcul[] = lignes.map((l) => ({
    quantite: l.quantite,
    puCents: l.puCents,
    tauxTva: l.tauxTva,
    remisePct: 0,
  }));
  const totaux = calculerTotaux(pourCalcul, franchise ? "franchise_base" : "reel");

  const data: FacturePdfData = {
    numero: f.numero,
    dateEmission: f.dateEmission,
    dateEcheance: f.dateEcheance,
    mentions,
    lignes,
    totalHtCents: f.totalHtCents,
    totalTvaCents: f.totalTvaCents,
    totalTtcCents: f.totalTtcCents,
    parTaux: totaux.parTaux.map((t) => ({
      taux: t.taux,
      tvaCents: t.tvaCents,
      baseHtCents: t.baseHtCents,
    })),
  };

  const buffer = await renderToBuffer(<FactureDocument data={data} />);
  return { buffer, numero: f.numero };
}
