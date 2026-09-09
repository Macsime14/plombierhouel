import "server-only";

import { cache } from "react";
import { asc, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { servicesSite } from "@/lib/db/schema";

export type ServiceSite = typeof servicesSite.$inferSelect;

/** Vue publique d'un service (indépendante de la ligne en base). */
export type ServicePublic = {
  slug: string;
  titre: string;
  description: string;
  photoUrl: string | null;
  photoAlt: string | null;
};

function photo(id: string) {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=80`;
}

/** Liste par défaut = le contenu figé avant que ce soit éditable. */
export const SERVICES_SITE_DEFAUT: ServicePublic[] = [
  {
    slug: "depannage",
    titre: "Dépannage",
    description:
      "Intervention rapide pour tout type de panne de plomberie : fuite d'eau, canalisation bouchée, robinetterie défectueuse.",
    photoUrl: photo("photo-1671040726131-746880d06bb5"),
    photoAlt: "Dépannage de plomberie",
  },
  {
    slug: "chauffage",
    titre: "Chauffage",
    description:
      "Installation, entretien et réparation de chaudières et systèmes de chauffage pour votre confort au quotidien.",
    photoUrl: photo("photo-1669725341213-7379ff6c90d5"),
    photoAlt: "Installation de chauffage",
  },
  {
    slug: "pompe-a-chaleur",
    titre: "Pompe à chaleur",
    description:
      "Étude, installation et entretien de pompes à chaleur air/eau ou air/air pour un chauffage économique et performant.",
    photoUrl: photo("photo-1776860150305-108ed577d7d4"),
    photoAlt: "Pompe à chaleur",
  },
  {
    slug: "climatisation",
    titre: "Climatisation",
    description:
      "Installation et entretien de systèmes de climatisation réversibles, adaptés à votre logement et à vos besoins.",
    photoUrl: photo("photo-1700124113583-81aa99ea2aa2"),
    photoAlt: "Climatisation réversible",
  },
  {
    slug: "sanitaires",
    titre: "Sanitaires",
    description:
      "Pose et rénovation de sanitaires : douche, baignoire, WC, lavabo, avec des conseils adaptés à votre espace.",
    photoUrl: photo("photo-1584622650111-993a426fbf0a"),
    photoAlt: "Salle de bain",
  },
  {
    slug: "recherche-de-fuite",
    titre: "Recherche de fuite",
    description:
      "Détection non destructive de l'origine d'une fuite d'eau, pour limiter les travaux et réparer efficacement.",
    photoUrl: photo("photo-1503789146722-cf137a3c0fea"),
    photoAlt: "Recherche de fuite",
  },
  {
    slug: "canalisations",
    titre: "Canalisations",
    description:
      "Débouchage, remplacement et rénovation de canalisations, y compris pour des installations anciennes.",
    photoUrl: photo("photo-1530124566582-a618bc2615dc"),
    photoAlt: "Canalisations",
  },
  {
    slug: "renovation",
    titre: "Rénovation plomberie",
    description:
      "Accompagnement complet pour vos projets de rénovation de plomberie, de la conception à la mise en service.",
    photoUrl: photo("photo-1629079447777-1e605162dc8d"),
    photoAlt: "Rénovation de plomberie",
  },
];

function versPublic(row: ServiceSite): ServicePublic {
  return {
    slug: row.slug,
    titre: row.titre,
    description: row.description,
    photoUrl: row.photoUrl,
    photoAlt: row.photoAlt,
  };
}

/**
 * Services affichés sur le site : les lignes actives de `services_site`, ou la
 * liste par défaut tant qu'aucune n'a été enregistrée (le site n'est jamais vide).
 */
export const getServicesSitePublies = cache(async (): Promise<ServicePublic[]> => {
  const rows = await db
    .select()
    .from(servicesSite)
    .where(eq(servicesSite.actif, true))
    .orderBy(asc(servicesSite.ordre), asc(servicesSite.titre));
  return rows.length > 0 ? rows.map(versPublic) : SERVICES_SITE_DEFAUT;
});

/** Toutes les lignes (admin), y compris inactives. */
export async function getServicesSiteTous(): Promise<ServiceSite[]> {
  return db
    .select()
    .from(servicesSite)
    .orderBy(asc(servicesSite.ordre), asc(servicesSite.titre));
}

export async function getServiceSite(id: string): Promise<ServiceSite | null> {
  const [row] = await db.select().from(servicesSite).where(eq(servicesSite.id, id)).limit(1);
  return row ?? null;
}
