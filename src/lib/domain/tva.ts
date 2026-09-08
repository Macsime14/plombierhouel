/**
 * Moteur de calcul des montants HT / TVA / TTC.
 *
 * Fonctions **pures** (aucun accès base), testées dans tva.test.ts.
 *
 * Règles :
 * - Montants en centimes entiers.
 * - Le total HT d'une ligne est arrondi au centime.
 * - La TVA est calculée et arrondie **par taux, sur la base HT cumulée** de ce taux
 *   (pratique française : on n'arrondit pas la TVA ligne à ligne).
 * - En franchise en base de TVA (art. 293 B du CGI), toute la TVA vaut 0.
 */

export type RegimeTva = "franchise_base" | "reel";

export type LigneCalcul = {
  quantite: number;
  puCents: number;
  tauxTva: number; // pourcentage : 20, 10, 5.5…
  remisePct?: number; // 0–100
};

export type VentilationTaux = {
  taux: number;
  baseHtCents: number;
  tvaCents: number;
};

export type Totaux = {
  totalHtCents: number;
  totalTvaCents: number;
  totalTtcCents: number;
  parTaux: VentilationTaux[];
};

/** Total HT d'une ligne, arrondi au centime. */
export function totalHtLigneCents(ligne: LigneCalcul): number {
  const remise = clampRemise(ligne.remisePct ?? 0);
  const brut = ligne.quantite * ligne.puCents * (1 - remise / 100);
  return Math.round(brut);
}

/** Totaux d'un ensemble de lignes selon le régime de TVA. */
export function calculerTotaux(lignes: LigneCalcul[], regime: RegimeTva): Totaux {
  const bases = new Map<number, number>();

  for (const ligne of lignes) {
    const taux = regime === "franchise_base" ? 0 : normaliserTaux(ligne.tauxTva);
    const htCents = totalHtLigneCents(ligne);
    bases.set(taux, (bases.get(taux) ?? 0) + htCents);
  }

  const parTaux: VentilationTaux[] = [...bases.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([taux, baseHtCents]) => ({
      taux,
      baseHtCents,
      tvaCents: regime === "franchise_base" ? 0 : Math.round((baseHtCents * taux) / 100),
    }));

  const totalHtCents = parTaux.reduce((s, t) => s + t.baseHtCents, 0);
  const totalTvaCents = parTaux.reduce((s, t) => s + t.tvaCents, 0);

  return {
    totalHtCents,
    totalTvaCents,
    totalTtcCents: totalHtCents + totalTvaCents,
    parTaux,
  };
}

/** Sérialise la ventilation par taux pour la colonne jsonb `tva_par_taux`. */
export function ventilationVersJson(parTaux: VentilationTaux[]): Record<string, { htCents: number; tvaCents: number }> {
  const out: Record<string, { htCents: number; tvaCents: number }> = {};
  for (const t of parTaux) {
    out[t.taux.toFixed(2)] = { htCents: t.baseHtCents, tvaCents: t.tvaCents };
  }
  return out;
}

function clampRemise(pct: number): number {
  if (!Number.isFinite(pct) || pct <= 0) return 0;
  return pct >= 100 ? 100 : pct;
}

function normaliserTaux(taux: number): number {
  if (!Number.isFinite(taux) || taux < 0) return 0;
  return Math.round(taux * 100) / 100;
}
