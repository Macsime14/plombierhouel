import { Resend } from "resend";

type Options = {
  destinataire: string;
  entrepriseNom: string;
  numero: string;
  lienPublic: string;
  pdf: Buffer;
};

export async function envoyerDevisParEmail(opts: Options) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_EMAIL_FROM ?? "onboarding@resend.dev";

  if (!apiKey) {
    throw new Error("RESEND_API_KEY manquant dans les variables d'environnement.");
  }

  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from: `${opts.entrepriseNom} <${from}>`,
    to: opts.destinataire,
    subject: `Votre devis ${opts.numero}`,
    text: [
      "Bonjour,",
      "",
      `Vous trouverez votre devis ${opts.numero} en pièce jointe.`,
      "",
      "Vous pouvez également le consulter et l'accepter en ligne à cette adresse :",
      opts.lienPublic,
      "",
      "Bien cordialement,",
      opts.entrepriseNom,
    ].join("\n"),
    attachments: [{ filename: `Devis-${opts.numero}.pdf`, content: opts.pdf }],
  });

  if (error) {
    throw new Error(typeof error === "string" ? error : (error.message ?? "Échec de l'envoi."));
  }
}
