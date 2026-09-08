import "server-only";

import { cookies } from "next/headers";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { sessions } from "@/lib/db/schema";
import { COOKIE_SESSION, chiffrerToken, dechiffrerToken } from "./token";

const DUREE_MS = 7 * 24 * 60 * 60 * 1000; // 7 jours

/** Crée une session en base + pose le cookie signé. */
export async function creerSession(utilisateurId: string) {
  const expireLe = new Date(Date.now() + DUREE_MS);

  const [row] = await db
    .insert(sessions)
    .values({ utilisateurId, expireLe })
    .returning({ id: sessions.id });

  const token = await chiffrerToken({ sessionId: row.id, utilisateurId }, expireLe);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_SESSION, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expireLe,
    path: "/",
  });
}

/** Supprime la session en base + le cookie. */
export async function detruireSession() {
  const cookieStore = await cookies();
  const payload = await dechiffrerToken(cookieStore.get(COOKIE_SESSION)?.value);

  if (payload) {
    await db.delete(sessions).where(eq(sessions.id, payload.sessionId));
  }
  cookieStore.delete(COOKIE_SESSION);
}

/** Lit le cookie de session (sans vérifier la base). */
export async function lireCookieSession() {
  const cookieStore = await cookies();
  return dechiffrerToken(cookieStore.get(COOKIE_SESSION)?.value);
}
