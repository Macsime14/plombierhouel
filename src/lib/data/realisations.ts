// TODO: remplacer par de vrais chantiers (photo, ville precise, description) des qu'ils seront
// disponibles. En attendant, ces exemples illustrent le type d'intervention sans pretendre a un
// chantier reel precis.
function unsplash(id: string, width: number) {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=80`;
}

export const realisations = [
  {
    type: "Rénovation",
    location: "Secteur de Noyers-Bocage",
    description:
      "Exemple de rénovation de salle de bains : dépose, reprise de la plomberie et des évacuations, pose des équipements.",
    photo: unsplash("photo-1620626011761-996317b8d101", 1000),
  },
  {
    type: "Chauffage",
    location: "Secteur de Noyers-Bocage",
    description: "Exemple d'installation et de mise aux normes d'un réseau de chauffage.",
    photo: unsplash("photo-1669725341213-7379ff6c90d5", 1000),
  },
  {
    type: "Dépannage",
    location: "Secteur de Noyers-Bocage",
    description: "Exemple de recherche de fuite et de réparation de canalisation.",
    photo: unsplash("photo-1668874184010-87aa286683dd", 1000),
  },
];
