import type { Tone } from "@/components/admin/ui";

export const INTERVENTION_STATUTS = ["planifie", "en_cours", "termine", "annule"] as const;

export type InterventionStatut = (typeof INTERVENTION_STATUTS)[number];

export const INTERVENTION_STATUT_LABELS: Record<InterventionStatut, string> = {
  planifie: "Planifiée",
  en_cours: "En cours",
  termine: "Terminée",
  annule: "Annulée",
};

export const INTERVENTION_STATUT_TONE: Record<InterventionStatut, Tone> = {
  planifie: "info",
  en_cours: "attention",
  termine: "positif",
  annule: "neutre",
};
