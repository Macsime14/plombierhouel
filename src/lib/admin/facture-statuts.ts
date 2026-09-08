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

export const FACTURE_STATUT_COULEURS: Record<FactureStatut, string> = {
  brouillon: "bg-neutral-200 text-neutral-700",
  emise: "bg-blue-100 text-blue-800",
  payee_partiel: "bg-amber-100 text-amber-800",
  payee: "bg-green-100 text-green-800",
  annulee: "bg-red-100 text-red-800 line-through",
};

/** Une facture émise est immuable : seuls un paiement ou un avoir peuvent la faire évoluer. */
export function factureModifiable(statut: string): boolean {
  return statut === "brouillon";
}
