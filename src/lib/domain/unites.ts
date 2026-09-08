/**
 * Unités de mesure proposées pour les lignes de devis / factures.
 * Le champ reste libre : cette liste n'est qu'une aide à la saisie (datalist).
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
