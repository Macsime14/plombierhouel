import { SignJWT, jwtVerify } from "jose";

/**
 * Chiffrement/déchiffrement du jeton de session (JWT signé HS256).
 * Volontairement sans `server-only` ni import de la base : ce module est aussi utilisé
 * par `proxy.ts` pour un contrôle optimiste sans requête base.
 */

export const COOKIE_SESSION = "houel_session";

const secret = process.env.SESSION_SECRET;
if (!secret) {
  throw new Error(
    "SESSION_SECRET manquant. Générer une clé : `openssl rand -base64 32` et l'ajouter à .env.local.",
  );
}
const encodedKey = new TextEncoder().encode(secret);

export type SessionPayload = {
  sessionId: string;
  utilisateurId: string;
};

export async function chiffrerToken(payload: SessionPayload, expiration: Date): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiration)
    .sign(encodedKey);
}

export async function dechiffrerToken(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, encodedKey, { algorithms: ["HS256"] });
    if (typeof payload.sessionId === "string" && typeof payload.utilisateurId === "string") {
      return { sessionId: payload.sessionId, utilisateurId: payload.utilisateurId };
    }
    return null;
  } catch {
    return null;
  }
}
