/**
 * Unités de mesure proposées pour les lignes de devis / factures (liste déroulante).
 */
export const UNITES_COURANTES: { value: string; label: string }[] = [
  { value: "u", label: "u — à l’unité (pièce, acte)" },
  { value: "forfait", label: "forfait — prix global fixe" },
  { value: "h", label: "h — heure de main-d’œuvre" },
  { value: "j", label: "j — journée" },
  { value: "m", label: "m — mètre (tuyau, câble)" },
  { value: "ml", label: "ml — mètre linéaire" },
  { value: "m²", label: "m² — mètre carré (surface)" },
  { value: "m³", label: "m³ — mètre cube" },
  { value: "ens", label: "ens — ensemble / lot" },
  { value: "kg", label: "kg — kilogramme" },
];

/**
 * Options pour un <select>, en garantissant que la valeur actuelle figure dans la liste
 * (utile pour une prestation enregistrée avec une unité personnalisée).
 */
export function optionsUnites(valeurActuelle?: string | null): { value: string; label: string }[] {
  if (valeurActuelle && !UNITES_COURANTES.some((u) => u.value === valeurActuelle)) {
    return [{ value: valeurActuelle, label: valeurActuelle }, ...UNITES_COURANTES];
  }
  return UNITES_COURANTES;
}
