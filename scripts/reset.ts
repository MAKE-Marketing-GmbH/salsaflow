import 'dotenv/config';
import { rm } from 'node:fs/promises';
import { DATA_DIR } from '../db/client.js';

// Loescht nur die lokale PGlite-DB. Eine echte DATABASE_URL wird NIE angetastet.
if (process.env.DATABASE_URL?.trim()) {
  console.log('[reset] DATABASE_URL gesetzt - lokales Reset uebersprungen (echte DB nicht angetastet).');
} else {
  await rm(DATA_DIR, { recursive: true, force: true });
  console.log('[reset] lokale PGlite-DB geloescht:', DATA_DIR);
}
