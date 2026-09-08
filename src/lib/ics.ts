/**
 * Génération de fichiers iCalendar (.ics) — pur, testé dans ics.test.ts.
 * Les horaires sont écrits en UTC (suffixe Z) : les agendas les reconvertissent
 * dans le fuseau du lecteur.
 */

export type IcsEvent = {
  uid: string;
  debut: Date;
  fin: Date;
  titre: string;
  description?: string | null;
  lieu?: string | null;
};

function fmtUtc(d: Date): string {
  return d.toISOString().replace(/\.\d{3}Z$/, "Z").replace(/[-:]/g, "");
}

function echapper(s: string): string {
  return s
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

export function genererIcs(
  events: IcsEvent[],
  options: { nomCalendrier?: string; horodatage?: Date } = {},
): string {
  const nom = options.nomCalendrier ?? "Houel Plombier";
  const dtstamp = fmtUtc(options.horodatage ?? new Date());

  const lignes = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Houel Plombier//Planning//FR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${echapper(nom)}`,
  ];

  for (const e of events) {
    lignes.push(
      "BEGIN:VEVENT",
      `UID:${e.uid}`,
      `DTSTAMP:${dtstamp}`,
      `DTSTART:${fmtUtc(e.debut)}`,
      `DTEND:${fmtUtc(e.fin)}`,
      `SUMMARY:${echapper(e.titre)}`,
    );
    if (e.lieu) lignes.push(`LOCATION:${echapper(e.lieu)}`);
    if (e.description) lignes.push(`DESCRIPTION:${echapper(e.description)}`);
    lignes.push("END:VEVENT");
  }

  lignes.push("END:VCALENDAR");
  return lignes.join("\r\n") + "\r\n";
}
