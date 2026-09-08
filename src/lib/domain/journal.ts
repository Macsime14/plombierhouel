import { createHash } from "node:crypto";

/**
 * Chaînage par hash du journal des factures (inaltérabilité — loi anti-fraude TVA).
 * Chaque entrée dépend du hash de la précédente : toute modification a posteriori
 * casse la chaîne et devient détectable.
 * Pur, testé dans journal.test.ts.
 */

/**
 * Sérialisation JSON stable (clés triées récursivement). Indispensable ici : PostgreSQL
 * réordonne les clés d'une colonne `jsonb`, donc `JSON.stringify` du payload relu ne
 * correspondrait pas à celui écrit.
 */
export function stableStringify(valeur: unknown): string {
  if (valeur === null || typeof valeur !== "object") {
    return JSON.stringify(valeur) ?? "null";
  }
  if (Array.isArray(valeur)) {
    return `[${valeur.map(stableStringify).join(",")}]`;
  }
  const obj = valeur as Record<string, unknown>;
  const paires = Object.keys(obj)
    .sort()
    .map((k) => `${JSON.stringify(k)}:${stableStringify(obj[k])}`);
  return `{${paires.join(",")}}`;
}

export function hashEntreeJournal(
  hashPrecedent: string | null,
  evenement: string,
  payload: unknown,
  horodatage: Date,
): string {
  return createHash("sha256")
    .update(hashPrecedent ?? "GENESIS")
    .update(" ")
    .update(evenement)
    .update(" ")
    .update(stableStringify(payload ?? null))
    .update(" ")
    .update(new Date(horodatage).toISOString())
    .digest("hex");
}

/** Recalcule toute la chaîne et renvoie l'index de la première entrée altérée, ou -1. */
export function verifierChaineJournal(
  entrees: { evenement: string; payload: unknown; horodatage: Date; hash: string }[],
): number {
  let precedent: string | null = null;
  for (let i = 0; i < entrees.length; i++) {
    const e = entrees[i];
    const attendu = hashEntreeJournal(precedent, e.evenement, e.payload, e.horodatage);
    if (attendu !== e.hash) return i;
    precedent = e.hash;
  }
  return -1;
}
