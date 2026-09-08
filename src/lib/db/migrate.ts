/**
 * Applique les migrations SQL en attente (dossier ./migrations).
 * Usage : `npm run db:migrate`
 */
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

try {
  process.loadEnvFile(".env.local");
} catch {
  // ignoré : variables déjà présentes dans l'environnement
}

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL manquant.");
  }

  const client = postgres(databaseUrl, { max: 1 });
  const db = drizzle(client);

  await migrate(db, { migrationsFolder: "src/lib/db/migrations" });
  await client.end();

  console.log("Migrations appliquées.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
