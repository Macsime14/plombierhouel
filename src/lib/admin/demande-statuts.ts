import type { Tone } from "@/components/admin/ui";

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

export const DEMANDE_STATUT_TONE: Record<DemandeStatut, Tone> = {
  nouveau: "info",
  a_rappeler: "attention",
  devis_envoye: "info",
  gagne: "positif",
  perdu: "negatif",
};
