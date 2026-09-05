import { Award, Leaf, ShieldCheck, FileCheck } from "lucide-react";

// TODO: confirmer avec Antoine les qualifications reellement detenues (intitules exacts,
// numeros de certification si besoin) avant mise en ligne. Ces exemples sont generiques
// et courants pour un plombier chauffagiste, mais doivent etre verifies/remplaces.
export const qualifications = [
  {
    title: "CAP Installateur sanitaire",
    description: "Formation de base en plomberie et installations sanitaires.",
    icon: Award,
  },
  {
    title: "Attestation fluides frigorigènes",
    description:
      "Habilitation obligatoire pour l'installation et l'entretien des pompes à chaleur et climatisations.",
    icon: Leaf,
  },
  {
    title: "RGE",
    description:
      "Label Reconnu Garant de l'Environnement, qui peut rendre vos travaux de chauffage éligibles aux aides de l'État.",
    icon: ShieldCheck,
  },
  {
    title: "Assurance décennale",
    description: "Garantie professionnelle sur la qualité et la conformité des travaux réalisés.",
    icon: FileCheck,
  },
];
