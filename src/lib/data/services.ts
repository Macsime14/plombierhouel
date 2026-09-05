import { Wrench, Droplet, Flame, ShowerHead, Waves, Hammer } from "lucide-react";
import type { Service } from "@/types/service";

// TODO: adapter la liste des services aux prestations réelles du client.
export const services: Service[] = [
  {
    slug: "depannage-urgence",
    title: "Dépannage",
    shortDescription: "Fuites, canalisations bouchées, pannes du quotidien.",
    description:
      "Intervention rapide pour tout type de panne de plomberie : fuite d'eau, canalisation bouchée, robinetterie défectueuse.",
    icon: Wrench,
  },
  {
    slug: "chauffage",
    title: "Chauffage",
    shortDescription: "Installation et entretien de chaudières.",
    description:
      "Installation, entretien et réparation de chaudières et systèmes de chauffage pour votre confort au quotidien.",
    icon: Flame,
  },
  {
    slug: "sanitaires",
    title: "Sanitaires",
    shortDescription: "Installation de salle de bain et WC.",
    description:
      "Pose et rénovation de sanitaires : douche, baignoire, WC, lavabo, avec des conseils adaptés à votre espace.",
    icon: ShowerHead,
  },
  {
    slug: "recherche-de-fuite",
    title: "Recherche de fuite",
    shortDescription: "Détection précise sans dégâts inutiles.",
    description:
      "Détection non destructive de l'origine d'une fuite d'eau, pour limiter les travaux et réparer efficacement.",
    icon: Droplet,
  },
  {
    slug: "canalisations",
    title: "Canalisations",
    shortDescription: "Débouchage et rénovation de tuyauterie.",
    description:
      "Débouchage, remplacement et rénovation de canalisations, y compris pour des installations anciennes.",
    icon: Waves,
  },
  {
    slug: "renovation",
    title: "Rénovation plomberie",
    shortDescription: "Mise aux normes et rénovation complète.",
    description:
      "Accompagnement complet pour vos projets de rénovation de plomberie, de la conception à la mise en service.",
    icon: Hammer,
  },
];
