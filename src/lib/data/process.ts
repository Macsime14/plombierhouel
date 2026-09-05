import { PhoneCall, Home, ClipboardList, Wrench } from "lucide-react";

export const process = {
  intro:
    "Notre objectif, pour chaque client, est d'apporter une intervention claire, précise et fidèle à vos attentes. La satisfaction de nos clients guide chacune de nos interventions.",
  steps: [
    {
      title: "Prise de contact",
      description: "Vous nous contactez par téléphone ou via notre formulaire, en nous décrivant votre besoin.",
      icon: PhoneCall,
    },
    {
      title: "Déplacement",
      description: "Nous nous déplaçons chez vous, le jour même en cas d'urgence ou à la date qui vous convient.",
      icon: Home,
    },
    {
      title: "Diagnostic",
      description: "Nous établissons un diagnostic précis et vous proposons la solution la plus adaptée.",
      icon: ClipboardList,
    },
    {
      title: "Intervention",
      description: "Une fois le devis validé, nous réalisons la réparation, le remplacement ou l'installation.",
      icon: Wrench,
    },
  ],
};
