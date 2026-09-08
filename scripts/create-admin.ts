/**
 * Crée (ou met à jour le mot de passe de) l'unique compte administrateur.
 *
 * Usage :
 *   ADMIN_EMAIL=antoine@exemple.fr ADMIN_PASSWORD='motdepassefort' npm run admin:create
 *
 * Sous PowerShell :
 *   $env:ADMIN_EMAIL="antoine@exemple.fr"; $env:ADMIN_PASSWORD="motdepassefort"; npm run admin:create
 */
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

import { utilisateurs } from "../src/lib/db/schema";

try {
  process.loadEnvFile(".env.local");
} catch {
  // ignoré
}

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const motDePasse = process.env.ADMIN_PASSWORD;

  if (!databaseUrl) throw new Error("DATABASE_URL manquant.");
  if (!email || !motDePasse) {
    throw new Error("ADMIN_EMAIL et ADMIN_PASSWORD requis (variables d'environnement).");
  }
  if (motDePasse.length < 10) {
    throw new Error("ADMIN_PASSWORD : au moins 10 caractères.");
  }

  const client = postgres(databaseUrl, { max: 1 });
  const db = drizzle(client);

  const hash = await bcrypt.hash(motDePasse, 12);

  const [existant] = await db
    .select({ id: utilisateurs.id })
    .from(utilisateurs)
    .where(eq(utilisateurs.email, email))
    .limit(1);

  if (existant) {
    await db
      .update(utilisateurs)
      .set({ motDePasseHash: hash })
      .where(eq(utilisateurs.id, existant.id));
    console.log(`Mot de passe mis à jour pour ${email}.`);
  } else {
    await db.insert(utilisateurs).values({ email, motDePasseHash: hash });
    console.log(`Compte administrateur créé : ${email}.`);
  }

  await client.end();
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
