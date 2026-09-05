import { Resend } from "resend";
import { siteConfig } from "@/lib/data/site-config";
import type { ContactFormValues } from "@/lib/validation/contactSchema";

// Isolé ici pour pouvoir être remplacé/complété (ex: écriture en base) sans toucher au formulaire ou à l'API route.
export async function sendContactEmail(data: Omit<ContactFormValues, "website">) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_EMAIL_TO;
  const from = process.env.CONTACT_EMAIL_FROM ?? "onboarding@resend.dev";

  if (!apiKey || !to) {
    throw new Error("RESEND_API_KEY ou CONTACT_EMAIL_TO manquant dans les variables d'environnement.");
  }

  const resend = new Resend(apiKey);

  await resend.emails.send({
    from: `${siteConfig.companyName} <${from}>`,
    to,
    replyTo: data.email,
    subject: `Nouvelle demande de contact - ${data.serviceType}`,
    text: [
      `Nom : ${data.name}`,
      `Téléphone : ${data.phone}`,
      `Email : ${data.email}`,
      `Type de besoin : ${data.serviceType}`,
      "",
      "Message :",
      data.message,
    ].join("\n"),
  });
}
