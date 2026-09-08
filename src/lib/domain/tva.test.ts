import assert from "node:assert/strict";
import { test } from "node:test";

import { calculerTotaux, totalHtLigneCents, ventilationVersJson } from "./tva";

test("total HT d'une ligne : arrondi au centime", () => {
  assert.equal(totalHtLigneCents({ quantite: 3, puCents: 1000, tauxTva: 20 }), 3000);
  assert.equal(totalHtLigneCents({ quantite: 2.5, puCents: 999, tauxTva: 20 }), 2498);
  assert.equal(
    totalHtLigneCents({ quantite: 1, puCents: 10000, tauxTva: 20, remisePct: 10 }),
    9000,
  );
});

test("remise hors bornes : ignorée si <= 0, plafonnée à 100", () => {
  assert.equal(totalHtLigneCents({ quantite: 1, puCents: 5000, tauxTva: 20, remisePct: -5 }), 5000);
  assert.equal(totalHtLigneCents({ quantite: 1, puCents: 5000, tauxTva: 20, remisePct: 150 }), 0);
});

test("régime réel : TVA par taux sur base cumulée", () => {
  const r = calculerTotaux(
    [
      { quantite: 1, puCents: 10000, tauxTva: 20 },
      { quantite: 1, puCents: 5000, tauxTva: 20 },
      { quantite: 1, puCents: 30000, tauxTva: 10 },
    ],
    "reel",
  );
  assert.equal(r.totalHtCents, 45000);
  // 15000 * 20% = 3000 ; 30000 * 10% = 3000
  assert.equal(r.totalTvaCents, 6000);
  assert.equal(r.totalTtcCents, 51000);
  assert.equal(r.parTaux.length, 2);
  assert.deepEqual(
    r.parTaux.map((t) => t.taux),
    [10, 20],
  );
});

test("franchise en base : aucune TVA quel que soit le taux saisi", () => {
  const r = calculerTotaux(
    [
      { quantite: 1, puCents: 10000, tauxTva: 20 },
      { quantite: 1, puCents: 30000, tauxTva: 10 },
    ],
    "franchise_base",
  );
  assert.equal(r.totalHtCents, 40000);
  assert.equal(r.totalTvaCents, 0);
  assert.equal(r.totalTtcCents, 40000);
  assert.equal(r.parTaux.length, 1);
  assert.equal(r.parTaux[0].taux, 0);
});

test("taux 5,5 % : arrondi correct de la TVA", () => {
  const r = calculerTotaux([{ quantite: 1, puCents: 12345, tauxTva: 5.5 }], "reel");
  // 12345 * 5.5% = 678.975 -> 679
  assert.equal(r.totalTvaCents, 679);
});

test("ventilationVersJson : clés = taux à 2 décimales", () => {
  const r = calculerTotaux(
    [
      { quantite: 1, puCents: 10000, tauxTva: 20 },
      { quantite: 1, puCents: 10000, tauxTva: 5.5 },
    ],
    "reel",
  );
  const json = ventilationVersJson(r.parTaux);
  assert.deepEqual(Object.keys(json).sort(), ["20.00", "5.50"]);
  assert.equal(json["20.00"].tvaCents, 2000);
});
