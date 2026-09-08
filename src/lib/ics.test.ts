import assert from "node:assert/strict";
import { test } from "node:test";

import { genererIcs } from "./ics";

const horodatage = new Date("2026-09-01T10:00:00Z");

test("structure de base et VEVENT", () => {
  const ics = genererIcs(
    [
      {
        uid: "abc-123",
        debut: new Date("2026-09-10T12:00:00Z"),
        fin: new Date("2026-09-10T14:30:00Z"),
        titre: "Remplacement chauffe-eau",
        lieu: "12 rue de l'Église, Caen",
      },
    ],
    { horodatage },
  );

  assert.match(ics, /^BEGIN:VCALENDAR\r\n/);
  assert.match(ics, /VERSION:2\.0/);
  assert.match(ics, /UID:abc-123/);
  assert.match(ics, /DTSTART:20260910T120000Z/);
  assert.match(ics, /DTEND:20260910T143000Z/);
  assert.match(ics, /SUMMARY:Remplacement chauffe-eau/);
  assert.match(ics, /LOCATION:12 rue de l'Église\\, Caen/);
  assert.match(ics, /END:VCALENDAR\r\n$/);
  assert.ok(ics.includes("\r\n"));
});

test("échappement des caractères spéciaux", () => {
  const ics = genererIcs(
    [
      {
        uid: "x",
        debut: new Date("2026-09-10T12:00:00Z"),
        fin: new Date("2026-09-10T13:00:00Z"),
        titre: "Devis ; travaux, salle de bain",
        description: "Ligne 1\nLigne 2",
      },
    ],
    { horodatage },
  );
  assert.match(ics, /SUMMARY:Devis \\; travaux\\, salle de bain/);
  assert.match(ics, /DESCRIPTION:Ligne 1\\nLigne 2/);
});

test("plusieurs événements", () => {
  const e = {
    debut: new Date("2026-09-10T12:00:00Z"),
    fin: new Date("2026-09-10T13:00:00Z"),
    titre: "T",
  };
  const ics = genererIcs([{ ...e, uid: "1" }, { ...e, uid: "2" }], { horodatage });
  assert.equal(ics.match(/BEGIN:VEVENT/g)?.length, 2);
});
