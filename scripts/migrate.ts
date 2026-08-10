import 'dotenv/config';
import { openDb } from '../db/client.js';

const handle = await openDb();
console.log(`[migrate] Treiber=${handle.driver} - wende Migrationen an...`);
await handle.migrate();
console.log('[migrate] OK - Schema ist aktuell.');
await handle.close();
