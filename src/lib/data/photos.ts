// TODO: remplacer toutes ces photos Unsplash (libres de droits, provisoires) par de vraies photos
// des chantiers d'Antoine dès qu'il pourra les fournir.
function unsplash(id: string, width: number) {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=80`;
}

export const heroPhoto = {
  src: unsplash("photo-1676210134188-4c05dd172f89", 1600),
  alt: "Plombier au travail sur une installation",
};

export const servicePhotos: Record<string, string> = {
  "depannage-urgence": unsplash("photo-1671040726131-746880d06bb5", 800),
  chauffage: unsplash("photo-1517581177682-a085bb7ffb15", 800),
  sanitaires: unsplash("photo-1584622650111-993a426fbf0a", 800),
  "recherche-de-fuite": unsplash("photo-1503789146722-cf137a3c0fea", 800),
  canalisations: unsplash("photo-1530124566582-a618bc2615dc", 800),
  renovation: unsplash("photo-1629079447777-1e605162dc8d", 800),
};

export const galleryPhotos = [
  { src: unsplash("photo-1620626011761-996317b8d101", 800), alt: "Rénovation de salle de bain" },
  { src: unsplash("photo-1454988501794-2992f706932e", 800), alt: "Outillage de plomberie" },
  { src: unsplash("photo-1617048530929-0edab8608369", 800), alt: "Installation de tuyauterie" },
  { src: unsplash("photo-1668874184010-87aa286683dd", 800), alt: "Réparation de canalisation" },
  { src: unsplash("photo-1676210133055-eab6ef033ce3", 800), alt: "Intervention de plomberie" },
  { src: unsplash("photo-1676210134050-6f12c6898395", 800), alt: "Plombier sur un chantier" },
];
