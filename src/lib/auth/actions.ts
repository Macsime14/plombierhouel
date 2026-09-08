"use server";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { db } from "@/lib/db";
import { utilisateurs } from "@/lib/db/schema";
import { creerSession, detruireSession } from "./session";

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Adresse email invalide."),
  motDePasse: z.string().min(1, "Mot de passe requis."),
});

export type LoginState = { error?: string } | undefined;

export async function connexion(_state: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    motDePasse: formData.get("motDePasse"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Champs invalides." };
  }

  const [user] = await db
    .select({ id: utilisateurs.id, hash: utilisateurs.motDePasseHash })
    .from(utilisateurs)
    .where(eq(utilisateurs.email, parsed.data.email))
    .limit(1);

  // Comparaison systématique (même sans utilisateur) pour ne pas révéler l'existence du compte
  // via le temps de réponse.
  const hashComparaison =
    user?.hash ?? "$2b$10$abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQR";
  const ok = await bcrypt.compare(parsed.data.motDePasse, hashComparaison);

  if (!user || !ok) {
    return { error: "Email ou mot de passe incorrect." };
  }

  await creerSession(user.id);
  redirect("/admin");
}

export async function deconnexion() {
  await detruireSession();
  redirect("/admin/login");
}
