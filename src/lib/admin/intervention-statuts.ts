export const INTERVENTION_STATUTS = ["planifie", "en_cours", "termine", "annule"] as const;

export type InterventionStatut = (typeof INTERVENTION_STATUTS)[number];

export const INTERVENTION_STATUT_LABELS: Record<InterventionStatut, string> = {
  planifie: "Planifiée",
  en_cours: "En cours",
  termine: "Terminée",
  annule: "Annulée",
};

export const INTERVENTION_STATUT_COULEURS: Record<InterventionStatut, string> = {
  planifie: "bg-blue-100 text-blue-800",
  en_cours: "bg-amber-100 text-amber-800",
  termine: "bg-green-100 text-green-800",
  annule: "bg-neutral-200 text-neutral-600 line-through",
};
