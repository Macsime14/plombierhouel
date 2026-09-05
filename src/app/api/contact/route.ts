import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validation/contactSchema";
import { sendContactEmail } from "@/lib/email/sendContactEmail";

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

  try {
    const { website, ...data } = parsed.data;
    void website;
    await sendContactEmail(data);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Erreur envoi email de contact:", error);
    return NextResponse.json({ error: "Une erreur est survenue, merci de réessayer." }, { status: 500 });
  }
}
