import assert from "node:assert/strict";
import { test } from "node:test";

import { centsVersSaisie, formaterEuros, saisieVersCents } from "./montants";

test("saisieVersCents : formats acceptés", () => {
  assert.equal(saisieVersCents("12,34"), 1234);
  assert.equal(saisieVersCents("12.34"), 1234);
  assert.equal(saisieVersCents(" 12 "), 1200);
  assert.equal(saisieVersCents("0"), 0);
  assert.equal(saisieVersCents("1 234,50"), 123450);
});

test("saisieVersCents : invalides -> null", () => {
  assert.equal(saisieVersCents(""), null);
  assert.equal(saisieVersCents("abc"), null);
  assert.equal(saisieVersCents("-5"), null);
});

test("centsVersSaisie : toujours 2 décimales, vide si null", () => {
  assert.equal(centsVersSaisie(1234), "12.34");
  assert.equal(centsVersSaisie(1200), "12.00");
  assert.equal(centsVersSaisie(null), "");
});

test("formaterEuros : format français", () => {
  assert.match(formaterEuros(123456), /1\s?234,56\s?€/);
});
