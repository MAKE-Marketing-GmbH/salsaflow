import 'dotenv/config';
import { serve } from '@hono/node-server';
import { openDb } from '../db/client.js';
import { createDatabaseRuntime } from '../api/index.js';

const port = Number(process.env.API_PORT ?? 8787);
const handle = await openDb();
// Dev serviert dieselbe Runtime wie Vercel (createDatabaseRuntime in api/index.ts), nicht mehr
// roh createApp. Grund: createApp mountet booking-routes vor reservation-routes — lokal gewann
// dadurch die DB-Availability (leakt Preise/Tarife auf der oeffentlichen Route) und der alte
// Kauf-Funnel POST /api/public/bookings war lokal noch live, obwohl er auf Vercel seit dem
// Beschluss vom 13.08.2026 mit 410 stillgelegt ist. Die Runtime legt Reservierung + 410 VOR
// createApp; die Verify-Gates testen die Buchungsmechanik weiterhin direkt gegen createApp.
const app = createDatabaseRuntime(handle.db);

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`[salsaflow-api] laeuft auf http://localhost:${info.port} (DB-Treiber: ${handle.driver})`);
});
