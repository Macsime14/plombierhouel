import assert from "node:assert/strict";
import { test } from "node:test";

import { hashEntreeJournal, stableStringify, verifierChaineJournal } from "./journal";

const t0 = new Date("2026-09-01T10:00:00Z");
const t1 = new Date("2026-09-01T10:05:00Z");

test("hash déterministe", () => {
  const a = hashEntreeJournal(null, "emission", { numero: "F-2026-001" }, t0);
  const b = hashEntreeJournal(null, "emission", { numero: "F-2026-001" }, t0);
  assert.equal(a, b);
  assert.match(a, /^[0-9a-f]{64}$/);
});

test("le hash dépend du précédent", () => {
  const a = hashEntreeJournal(null, "e", { x: 1 }, t0);
  const b = hashEntreeJournal("autrechose", "e", { x: 1 }, t0);
  assert.notEqual(a, b);
});

test("chaîne valide -> -1", () => {
  const h0 = hashEntreeJournal(null, "emission", { n: 1 }, t0);
  const h1 = hashEntreeJournal(h0, "paiement", { montant: 5000 }, t1);
  const idx = verifierChaineJournal([
    { evenement: "emission", payload: { n: 1 }, horodatage: t0, hash: h0 },
    { evenement: "paiement", payload: { montant: 5000 }, horodatage: t1, hash: h1 },
  ]);
  assert.equal(idx, -1);
});

test("hash indépendant de l'ordre des clés (jsonb réordonne)", () => {
  const a = hashEntreeJournal(null, "e", { a: 1, b: { x: 1, y: 2 } }, t0);
  const b = hashEntreeJournal(null, "e", { b: { y: 2, x: 1 }, a: 1 }, t0);
  assert.equal(a, b);
  assert.equal(stableStringify({ b: 2, a: 1 }), '{"a":1,"b":2}');
});

test("hash stable si l'horodatage revient sous forme de chaîne", () => {
  const a = hashEntreeJournal(null, "e", { x: 1 }, t0);
  const b = hashEntreeJournal(null, "e", { x: 1 }, new Date(t0.toISOString()));
  assert.equal(a, b);
});

test("entrée altérée -> son index", () => {
  const h0 = hashEntreeJournal(null, "emission", { n: 1 }, t0);
  const h1 = hashEntreeJournal(h0, "paiement", { montant: 5000 }, t1);
  const idx = verifierChaineJournal([
    { evenement: "emission", payload: { n: 1 }, horodatage: t0, hash: h0 },
    { evenement: "paiement", payload: { montant: 9999 }, horodatage: t1, hash: h1 },
  ]);
  assert.equal(idx, 1);
});
