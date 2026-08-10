import { defineConfig } from 'drizzle-kit';

// Generiert versionierte SQL-Migrationen aus db/schema.ts (echtes Postgres-DDL).
// Braucht keine Live-DB-Verbindung fuer `generate`. Angewandt wird ueber scripts/migrate.ts
// gegen PGlite (lokal) ODER eine echte Postgres-URL (Supabase/Neon) per DATABASE_URL.
export default defineConfig({
  dialect: 'postgresql',
  schema: './db/schema.ts',
  out: './drizzle',
  strict: true,
  verbose: true,
});
