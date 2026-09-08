import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { and, eq, gt } from "drizzle-orm";

import { db } from "@/lib/db";
import { sessions, utilisateurs } from "@/lib/db/schema";
import { lireCookieSession } from "./session";

/**
 * Vérifie la session contre la base (contrôle sécurisé, pas seulement le cookie).
 * Mémoïsé sur la durée d'un rendu React.
 * Redirige vers /admin/login si non authentifié.
 */
export const verifierSession = cache(async () => {
  const payload = await lireCookieSession();
  if (!payload) redirect("/admin/login");

  const [row] = await db
    .select({ utilisateurId: sessions.utilisateurId })
    .from(sessions)
    .where(and(eq(sessions.id, payload.sessionId), gt(sessions.expireLe, new Date())))
    .limit(1);

  if (!row) redirect("/admin/login");

  return { utilisateurId: row.utilisateurId };
});

/** Renvoie l'utilisateur connecté (id, email, nom) ou redirige. */
export const getUtilisateur = cache(async () => {
  const session = await verifierSession();

  const [user] = await db
    .select({ id: utilisateurs.id, email: utilisateurs.email, nom: utilisateurs.nom })
    .from(utilisateurs)
    .where(eq(utilisateurs.id, session.utilisateurId))
    .limit(1);

  if (!user) redirect("/admin/login");
  return user;
});
