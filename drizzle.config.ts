import { defineConfig } from "drizzle-kit";

// Next.js charge .env.local tout seul, mais pas drizzle-kit ni les scripts `tsx`.
try {
  process.loadEnvFile(".env.local");
} catch {
  // .env.local absent : on se rabat sur les variables déjà présentes dans l'environnement.
}

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL manquant. Copier .env.example vers .env.local et lancer `docker compose up -d`.");
}

export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  out: "./src/lib/db/migrations",
  dialect: "postgresql",
  dbCredentials: { url: databaseUrl },
  casing: "snake_case",
});
