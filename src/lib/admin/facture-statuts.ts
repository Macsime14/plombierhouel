import type { Tone } from "@/components/admin/ui";

export const FACTURE_STATUTS = [
  "brouillon",
  "emise",
  "payee_partiel",
  "payee",
  "annulee",
] as const;

export type FactureStatut = (typeof FACTURE_STATUTS)[number];

export const FACTURE_STATUT_LABELS: Record<FactureStatut, string> = {
  brouillon: "Brouillon",
  emise: "Émise",
  payee_partiel: "Payée en partie",
  payee: "Payée",
  annulee: "Annulée",
};

export const FACTURE_STATUT_TONE: Record<FactureStatut, Tone> = {
  brouillon: "neutre",
  emise: "info",
  payee_partiel: "attention",
  payee: "positif",
  annulee: "negatif",
};

/** Une facture émise est immuable : seuls un paiement ou un avoir peuvent la faire évoluer. */
export function factureModifiable(statut: string): boolean {
  return statut === "brouillon";
}
