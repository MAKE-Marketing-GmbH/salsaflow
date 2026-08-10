import 'dotenv/config';
import { serve } from '@hono/node-server';
import { openDb } from '../db/client.js';
import { createApp } from './app.js';

const port = Number(process.env.API_PORT ?? 8787);
const handle = await openDb();
const app = createApp(handle.db);

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`[salsaflow-api] laeuft auf http://localhost:${info.port} (DB-Treiber: ${handle.driver})`);
});
