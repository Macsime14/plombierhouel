/** Transforme un libellé en identifiant d'URL. Pur, testé dans slug.test.ts. */
export function slugify(valeur: string): string {
  const base = valeur
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
    .replace(/-+$/g, "");
  return base.length > 0 ? base : "element";
}
