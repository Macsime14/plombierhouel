import type { Tone } from "@/components/admin/ui";

export const DEVIS_STATUTS = ["brouillon", "envoye", "vu", "accepte", "refuse", "expire"] as const;

export type DevisStatut = (typeof DEVIS_STATUTS)[number];

export const DEVIS_STATUT_LABELS: Record<DevisStatut, string> = {
  brouillon: "Brouillon",
  envoye: "Envoyé",
  vu: "Vu",
  accepte: "Accepté",
  refuse: "Refusé",
  expire: "Expiré",
};

export const DEVIS_STATUT_TONE: Record<DevisStatut, Tone> = {
  brouillon: "neutre",
  envoye: "info",
  vu: "info",
  accepte: "positif",
  refuse: "negatif",
  expire: "attention",
};
