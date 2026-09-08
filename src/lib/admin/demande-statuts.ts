export const DEMANDE_STATUTS = [
  "nouveau",
  "a_rappeler",
  "devis_envoye",
  "gagne",
  "perdu",
] as const;

export type DemandeStatut = (typeof DEMANDE_STATUTS)[number];

export const DEMANDE_STATUT_LABELS: Record<DemandeStatut, string> = {
  nouveau: "Nouveau",
  a_rappeler: "À rappeler",
  devis_envoye: "Devis envoyé",
  gagne: "Gagné",
  perdu: "Perdu",
};

export const DEMANDE_STATUT_COULEURS: Record<DemandeStatut, string> = {
  nouveau: "bg-blue-100 text-blue-800",
  a_rappeler: "bg-amber-100 text-amber-800",
  devis_envoye: "bg-violet-100 text-violet-800",
  gagne: "bg-green-100 text-green-800",
  perdu: "bg-neutral-200 text-neutral-700",
};
