/** Date de fin de validité d'un devis. */
export function dateValiditeDevis(dateEmission: Date, validiteJours: number): Date {
  const d = new Date(dateEmission);
  d.setDate(d.getDate() + validiteJours);
  return d;
}

/** Un devis encore en attente de réponse et dont la date de validité est passée. */
export function devisExpire(dateEmission: Date, validiteJours: number, statut: string): boolean {
  if (statut !== "envoye" && statut !== "vu") return false;
  return dateValiditeDevis(dateEmission, validiteJours).getTime() < Date.now();
}
