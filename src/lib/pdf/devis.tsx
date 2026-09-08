import "server-only";

import { renderToBuffer } from "@react-pdf/renderer";

import { chargerDevis } from "@/lib/admin/devis-data";
import { getParametres } from "@/lib/domain/parametres";
import { calculerTotaux, type LigneCalcul } from "@/lib/domain/tva";
import { DevisDocument, type DevisPdfData } from "./DevisDocument";

export async function genererDevisPdf(
  devisId: string,
): Promise<{ buffer: Buffer; numero: string } | null> {
  const data = await chargerDevis(devisId);
  if (!data) return null;

  const params = await getParametres();
  const franchise = params.regimeTva === "franchise_base";

  const lignesCalcul: LigneCalcul[] = data.lignes.map((l) => ({
    quantite: Number(l.quantite),
    puCents: l.puCents,
    tauxTva: Number(l.tauxTva),
    remisePct: Number(l.remisePct),
  }));
  const totaux = calculerTotaux(lignesCalcul, params.regimeTva);

  const dateEmission = data.devis.dateEmission;
  const dateValidite = new Date(dateEmission);
  dateValidite.setDate(dateValidite.getDate() + data.devis.validiteJours);

  const pdfData: DevisPdfData = {
    numero: data.devis.numero,
    dateEmission,
    dateValidite,
    entreprise: params,
    client: {
      nom: data.client?.nom ?? "—",
      adresse: data.client?.adresseFacturation ?? null,
      codePostal: data.client?.codePostalFacturation ?? null,
      ville: data.client?.villeFacturation ?? null,
      siret: data.client?.siret ?? null,
    },
    lignes: data.lignes.map((l) => ({
      designation: l.designation,
      quantite: Number(l.quantite),
      unite: l.unite,
      puCents: l.puCents,
      tauxTva: Number(l.tauxTva),
      remisePct: Number(l.remisePct),
      totalHtCents: l.totalHtCents,
    })),
    totaux: {
      totalHtCents: totaux.totalHtCents,
      totalTvaCents: totaux.totalTvaCents,
      totalTtcCents: totaux.totalTtcCents,
      parTaux: totaux.parTaux.map((t) => ({
        taux: t.taux,
        tvaCents: t.tvaCents,
        baseHtCents: t.baseHtCents,
      })),
    },
    conditions: data.devis.conditions,
    franchise,
  };

  const buffer = await renderToBuffer(<DevisDocument data={pdfData} />);
  return { buffer, numero: data.devis.numero };
}
