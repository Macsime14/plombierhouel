// TODO: remplacer toutes ces photos Unsplash (libres de droits, provisoires) par de vraies
// photos des chantiers et d'Antoine dès qu'il pourra les fournir (Antoine, chantiers,
// véhicule, outils). Priorité pour crédibiliser le site.
function unsplash(id: string, width: number) {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=80`;
}

export const heroPhoto = {
  src: unsplash("photo-1676210134188-4c05dd172f89", 1600),
  alt: "Plombier au travail sur une installation",
};

export const servicePhotos: Record<string, string> = {
  "depannage-urgence": unsplash("photo-1671040726131-746880d06bb5", 800),
  chauffage: unsplash("photo-1669725341213-7379ff6c90d5", 800),
  "pompe-a-chaleur": unsplash("photo-1776860150305-108ed577d7d4", 800),
  climatisation: unsplash("photo-1700124113583-81aa99ea2aa2", 800),
  sanitaires: unsplash("photo-1584622650111-993a426fbf0a", 800),
  "recherche-de-fuite": unsplash("photo-1503789146722-cf137a3c0fea", 800),
  canalisations: unsplash("photo-1530124566582-a618bc2615dc", 800),
  renovation: unsplash("photo-1629079447777-1e605162dc8d", 800),
};

// TODO: remplacer par une vraie photo d'Antoine (chantier, véhicule) dès que possible.
export const aboutPhoto = {
  src: unsplash("photo-1646227655685-a530813759b3", 900),
  alt: "Artisan sur un chantier",
};
