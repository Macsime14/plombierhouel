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

export const DEVIS_STATUT_COULEURS: Record<DevisStatut, string> = {
  brouillon: "bg-surface-muted text-text",
  envoye: "bg-blue-100 text-blue-800",
  vu: "bg-violet-100 text-violet-800",
  accepte: "bg-green-100 text-green-800",
  refuse: "bg-red-100 text-red-800",
  expire: "bg-amber-100 text-amber-800",
};
