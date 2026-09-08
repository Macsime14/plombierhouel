import "server-only";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL manquant. En dev : `docker compose up -d` puis vérifier .env.local.",
  );
}

/**
 * En développement, Next.js recharge les modules à chaque modification : on met en cache
 * la connexion sur `globalThis` pour ne pas rouvrir un pool à chaque hot-reload.
 */
const globalForDb = globalThis as unknown as {
  __client?: ReturnType<typeof postgres>;
};

const client = globalForDb.__client ?? postgres(databaseUrl, { max: 10 });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__client = client;
}

export const db = drizzle(client, { schema, casing: "snake_case" });
export { schema };
