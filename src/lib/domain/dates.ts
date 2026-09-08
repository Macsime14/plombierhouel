/**
 * Conversions d'horaires entre l'heure « murale » de Paris (ce que saisit et voit Antoine)
 * et l'instant UTC stocké en base. Gère le passage heure d'été / heure d'hiver.
 * Pur, testé dans dates.test.ts.
 */

const TZ = "Europe/Paris";

/** Minutes dont l'heure de Paris est en avance sur UTC à cet instant précis. */
function offsetMinutes(instant: Date): number {
  const murale = instant.toLocaleString("sv-SE", { timeZone: TZ, hour12: false });
  const commeUtc = new Date(murale.replace(" ", "T") + "Z");
  return Math.round((commeUtc.getTime() - instant.getTime()) / 60000);
}

/** "2026-09-10T14:00" (heure de Paris) -> Date (instant UTC correct). */
export function heureParisVersDate(local: string): Date {
  const [datePart, timePart] = local.split("T");
  const [y, mo, d] = datePart.split("-").map(Number);
  const [h, mi] = (timePart ?? "0:0").split(":").map(Number);
  // Première estimation en traitant la saisie comme de l'UTC, puis correction par l'offset.
  const estimation = new Date(Date.UTC(y, mo - 1, d, h, mi));
  const off = offsetMinutes(estimation);
  return new Date(estimation.getTime() - off * 60000);
}

/** Date -> "2026-09-10T14:00" (heure de Paris, pour un <input type="datetime-local">). */
export function dateVersHeureParis(date: Date): string {
  return date.toLocaleString("sv-SE", { timeZone: TZ, hour12: false }).slice(0, 16).replace(" ", "T");
}

/** "2026-09-10" (jour à Paris) -> Date à minuit ce jour-là, heure de Paris. */
export function jourParisVersDate(jour: string): Date {
  return heureParisVersDate(`${jour}T00:00`);
}

/** Date -> "2026-09-10" (jour selon l'heure de Paris). */
export function dateVersJourParis(date: Date): string {
  return date.toLocaleString("sv-SE", { timeZone: TZ }).slice(0, 10);
}

/** Jour courant "YYYY-MM-DD" selon l'heure de Paris. */
export function aujourdhuiParis(): string {
  return dateVersJourParis(new Date());
}

/** Lundi 00:00 (heure de Paris) de la semaine contenant `jour` ("YYYY-MM-DD"). */
export function lundiDeLaSemaine(jour: string): string {
  const midi = new Date(`${jour}T12:00:00Z`);
  const jourSemaine = midi.getUTCDay(); // 0 = dimanche
  const decalage = (jourSemaine + 6) % 7; // jours depuis lundi
  midi.setUTCDate(midi.getUTCDate() - decalage);
  return midi.toISOString().slice(0, 10);
}

/** Ajoute `n` jours à un "YYYY-MM-DD". */
export function ajouterJours(jour: string, n: number): string {
  const d = new Date(`${jour}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}
