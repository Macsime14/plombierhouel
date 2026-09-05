import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Merci d'indiquer votre nom."),
  phone: z.string().trim().min(6, "Merci d'indiquer un numéro de téléphone valide."),
  email: z.string().trim().email("Merci d'indiquer une adresse email valide."),
  serviceType: z.string().trim().min(1, "Merci de préciser le type de besoin."),
  message: z.string().trim().min(10, "Merci de décrire votre besoin en quelques mots."),
  // Honeypot anti-spam : ce champ est caché aux vrais visiteurs, seul un bot le remplit.
  // La détection se fait dans la route API (réponse "ok" silencieuse) plutôt qu'ici,
  // pour ne pas révéler au bot que son envoi a été bloqué.
  website: z.string().optional(),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
