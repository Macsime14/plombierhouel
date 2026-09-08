import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validation/contactSchema";
import { sendContactEmail } from "@/lib/email/sendContactEmail";
import { db } from "@/lib/db";
import { demandes } from "@/lib/db/schema";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Champs invalides." }, { status: 400 });
  }

  // Honeypot : un vrai visiteur ne remplit jamais ce champ.
  if (parsed.data.website) {
    return NextResponse.json({ ok: true });
  }

  const { website, ...data } = parsed.data;
  void website;

  // 1. Enregistrement en base (prioritaire : on ne veut jamais perdre une demande).
  try {
    await db.insert(demandes).values({
      nom: data.name,
      email: data.email,
      telephone: data.phone,
      typeBesoin: data.serviceType,
      message: data.message,
      source: "formulaire_site",
    });
  } catch (error) {
    console.error("Erreur enregistrement demande de contact:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue, merci de réessayer." },
      { status: 500 },
    );
  }

  // 2. Notification par email (best-effort : la demande est déjà sauvegardée).
  try {
    await sendContactEmail(data);
  } catch (error) {
    console.error("Erreur envoi email de contact (demande tout de même enregistrée):", error);
  }

  return NextResponse.json({ ok: true });
}
