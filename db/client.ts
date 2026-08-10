import 'dotenv/config';
import { drizzle as pgliteDrizzle } from 'drizzle-orm/pglite';
import { PGlite } from '@electric-sql/pglite';
import { migrate as pgliteMigrate } from 'drizzle-orm/pglite/migrator';
import { drizzle as nodePgDrizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import { migrate as nodePgMigrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { mkdirSync } from 'node:fs';
import * as schema from './schema.js';

const here = dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_FOLDER = resolve(here, '../drizzle');
const DEFAULT_DATA_DIR = process.env.VERCEL && !process.env.DATABASE_URL
  ? '/tmp/salsaflow-pglite'
  : resolve(here, '../.data/pglite');
export const DATA_DIR = process.env.PGLITE_DATA_DIR?.trim() || DEFAULT_DATA_DIR;

// Einheitlicher DB-Typ. PGlite und node-postgres teilen dieselbe Drizzle-Query-API,
// deshalb wird die PGlite-Instanz auf denselben Typ normalisiert (Laufzeit identisch).
export type Db = NodePgDatabase<typeof schema>;

export interface DbHandle {
  db: Db;
  driver: 'pglite' | 'postgres';
  migrate: () => Promise<void>;
  close: () => Promise<void>;
}

// DATABASE_URL gesetzt -> echte Postgres-Verbindung (Supabase/Neon, gleiches Schema).
// sonst -> lokale eingebettete Postgres-DB (PGlite) unter ./.data/pglite, kein Docker noetig.
export async function openDb(): Promise<DbHandle> {
  const url = process.env.DATABASE_URL?.trim();
  if (url) {
    const pool = new Pool({ connectionString: url });
    const db = nodePgDrizzle(pool, { schema });
    return {
      db,
      driver: 'postgres',
      migrate: () => nodePgMigrate(db, { migrationsFolder: MIGRATIONS_FOLDER }),
      close: () => pool.end(),
    };
  }
  mkdirSync(dirname(DATA_DIR), { recursive: true }); // PGlite legt nur das Blatt an
  const client = new PGlite(DATA_DIR);
  const db = pgliteDrizzle(client, { schema }) as unknown as Db;
  return {
    db,
    driver: 'pglite',
    migrate: () => pgliteMigrate(db as never, { migrationsFolder: MIGRATIONS_FOLDER }),
    close: () => client.close(),
  };
}
