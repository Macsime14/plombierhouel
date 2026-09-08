import assert from "node:assert/strict";
import { test } from "node:test";

import {
  ajouterJours,
  dateVersHeureParis,
  dateVersJourParis,
  heureParisVersDate,
  lundiDeLaSemaine,
} from "./dates";

test("heure d'été : Paris = UTC+2 en septembre", () => {
  const d = heureParisVersDate("2026-09-10T14:00");
  assert.equal(d.toISOString(), "2026-09-10T12:00:00.000Z");
});

test("heure d'hiver : Paris = UTC+1 en janvier", () => {
  const d = heureParisVersDate("2026-01-15T09:30");
  assert.equal(d.toISOString(), "2026-01-15T08:30:00.000Z");
});

test("aller-retour Date <-> heure de Paris", () => {
  const local = "2026-09-10T14:00";
  assert.equal(dateVersHeureParis(heureParisVersDate(local)), local);
});

test("jour de Paris tient compte du décalage", () => {
  // 2026-09-10 23:30 UTC = 2026-09-11 01:30 à Paris
  assert.equal(dateVersJourParis(new Date("2026-09-10T23:30:00Z")), "2026-09-11");
});

test("lundi de la semaine", () => {
  assert.equal(lundiDeLaSemaine("2026-09-10"), "2026-09-07"); // jeudi -> lundi
  assert.equal(lundiDeLaSemaine("2026-09-07"), "2026-09-07"); // lundi -> lui-même
  assert.equal(lundiDeLaSemaine("2026-09-13"), "2026-09-07"); // dimanche -> lundi
});

test("ajouterJours franchit les mois", () => {
  assert.equal(ajouterJours("2026-09-30", 1), "2026-10-01");
  assert.equal(ajouterJours("2026-09-07", 7), "2026-09-14");
});
