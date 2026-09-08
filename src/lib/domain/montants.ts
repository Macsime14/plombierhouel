/**
 * Conversion et formatage des montants (stockés en centimes entiers).
 * Pur, testé dans montants.test.ts.
 */

const eurosFmt = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
});

/** 1234 -> "12,34 €" */
export function formaterEuros(cents: number): string {
  return eurosFmt.format(cents / 100);
}

/** 1234 -> "12.34" (pour pré-remplir un champ de saisie) */
export function centsVersSaisie(cents: number | null | undefined): string {
  if (cents == null) return "";
  return (cents / 100).toFixed(2);
}

/**
 * Saisie utilisateur ("12,34", " 12.3 ", "12") -> 1234 centimes.
 * Renvoie null si la saisie n'est pas un nombre positif valide.
 */
export function saisieVersCents(valeur: string): number | null {
  const nettoye = valeur.trim().replace(/\s/g, "").replace(",", ".");
  if (nettoye === "") return null;
  const nombre = Number(nettoye);
  if (!Number.isFinite(nombre) || nombre < 0) return null;
  return Math.round(nombre * 100);
}
