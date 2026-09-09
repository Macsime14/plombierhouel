import "server-only";

import { cache } from "react";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { contenuSite } from "@/lib/db/schema";
import { getParametres } from "./parametres";

/**
 * Contenu par défaut de la vitrine = le contenu figé avant que ce soit éditable.
 * Tant que la ligne `contenu_site` n'a pas été enregistrée, le site affiche ceci.
 */
const DEFAUTS = {
  nomAffiche: "Houel Plombier",
  slogan: "Votre plombier chauffagiste à Noyers-Bocage et ses environs",
  zoneTexte: "Noyers-Bocage, Villers-Bocage, Aunay-sur-Odon et Caen",
  horaires: "Du lundi au samedi, 8h - 19h",
  urlPublique: "https://www.houel-plombier-exemple.fr",
  aboutIntro:
    "Je reprends aujourd'hui l'entreprise familiale fondée par mon père, Olivier Houel, avec la volonté de perpétuer le sérieux et la qualité de son travail.",
  aboutParagraphes: [
    "Avant de reprendre l'entreprise, j'ai travaillé pendant plus de 8 ans sur les chantiers, d'abord comme chef de chantier, puis comme conducteur de travaux. Cette expérience de terrain, ainsi que tout ce que j'ai appris aux côtés de mon père, m'ont permis de construire une solide connaissance du métier et de ses exigences.",
    "Aujourd'hui, je mets cette expérience au service de mes clients, avec une attention particulière portée à la qualité du travail, au respect des délais et à la confiance qui doit s'installer tout au long d'un projet.",
    "Je suis également passionné de course à pied et d'ultra-trail. Dans le sport comme dans mon métier, j'aime aller au bout des choses.",
  ],
  aboutTags: [
    "Entreprise familiale",
    "Chef de chantier puis conducteur de travaux",
    "Passionné d'ultra-trail",
  ],
  heroPhotoUrl:
    "https://images.unsplash.com/photo-1676210134188-4c05dd172f89?auto=format&fit=crop&w=1600&q=80",
  heroPhotoAlt: "Plombier au travail sur une installation",
  aboutPhotoUrl:
    "https://images.unsplash.com/photo-1646227655685-a530813759b3?auto=format&fit=crop&w=900&q=80",
  aboutPhotoAlt: "Artisan sur un chantier",
};

function texte(valeur: string | null | undefined, defaut: string): string {
  const v = valeur?.trim();
  return v && v.length > 0 ? v : defaut;
}

function liste(valeur: unknown, defaut: string[]): string[] {
  return Array.isArray(valeur) && valeur.length > 0 ? (valeur as string[]) : defaut;
}

export type SiteData = {
  companyName: string;
  tagline: string;
  phone: string;
  phoneHref: string;
  email: string;
  address: string;
  siret: string;
  areaDescription: string;
  hours: string;
  url: string;
  about: { intro: string; paragraphes: string[]; tags: string[] };
  heroPhoto: { src: string; alt: string };
  aboutPhoto: { src: string; alt: string };
};

/** Assemble le contenu de la vitrine à partir de `contenu_site` + `parametres_entreprise`. */
export const getSiteData = cache(async (): Promise<SiteData> => {
  const [row] = await db.select().from(contenuSite).where(eq(contenuSite.id, 1)).limit(1);
  const p = await getParametres();

  const adressePostale = [p.adresse, [p.codePostal, p.ville].filter(Boolean).join(" ")]
    .filter((s) => s && s.trim().length > 0)
    .join(", ");

  const phone = texte(p.telephone, "À renseigner");

  return {
    companyName: texte(row?.nomAffiche, DEFAUTS.nomAffiche),
    tagline: texte(row?.slogan, DEFAUTS.slogan),
    phone,
    phoneHref: phone === "À renseigner" ? "tel:" : `tel:${phone.replace(/[\s.]/g, "")}`,
    email: texte(p.email, "À renseigner"),
    address: texte(adressePostale || null, "14210 Noyers-Bocage"),
    siret: texte(p.siret, "À renseigner"),
    areaDescription: texte(row?.zoneTexte, DEFAUTS.zoneTexte),
    hours: texte(row?.horaires, DEFAUTS.horaires),
    url: texte(row?.urlPublique, DEFAUTS.urlPublique),
    about: {
      intro: texte(row?.aboutIntro, DEFAUTS.aboutIntro),
      paragraphes: liste(row?.aboutParagraphes, DEFAUTS.aboutParagraphes),
      tags: liste(row?.aboutTags, DEFAUTS.aboutTags),
    },
    heroPhoto: {
      src: texte(row?.heroPhotoUrl, DEFAUTS.heroPhotoUrl),
      alt: texte(row?.heroPhotoAlt, DEFAUTS.heroPhotoAlt),
    },
    aboutPhoto: {
      src: texte(row?.aboutPhotoUrl, DEFAUTS.aboutPhotoUrl),
      alt: texte(row?.aboutPhotoAlt, DEFAUTS.aboutPhotoAlt),
    },
  };
});

export { DEFAUTS as CONTENU_SITE_DEFAUTS };
