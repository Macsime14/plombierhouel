import assert from "node:assert/strict";
import { test } from "node:test";

import { slugify } from "./slug";

test("slugify : accents, espaces, ponctuation", () => {
  assert.equal(slugify("Dépannage"), "depannage");
  assert.equal(slugify("Pompe à chaleur"), "pompe-a-chaleur");
  assert.equal(slugify("Rénovation / plomberie !!"), "renovation-plomberie");
  assert.equal(slugify("  Espaces   multiples  "), "espaces-multiples");
});

test("slugify : chaîne vide ou sans caractère utile -> 'element'", () => {
  assert.equal(slugify(""), "element");
  assert.equal(slugify("!!! ??? "), "element");
});
