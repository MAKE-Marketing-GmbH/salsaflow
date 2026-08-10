import { Hono } from 'hono';
import { getCookie, setCookie, deleteCookie } from 'hono/cookie';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import type { Db } from '../db/client.js';
import { adminProfiles } from '../db/schema.js';
import { SESSION_COOKIE, issueSession, verifyPassword, verifySession } from './auth.js';
import { createAdminRoutes } from './admin.js';
import { createPublicRoutes } from './public.js';
import { createBookingRoutes } from './booking-routes.js';
import { createContactRoutes } from './contact-routes.js';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

function publicUser(a: typeof adminProfiles.$inferSelect) {
  return { id: a.id, email: a.email, displayName: a.displayName, role: a.role };
}

// Hono-App als Factory, damit sie mit derselben DB-Instanz sowohl vom Server (server/index.ts)
// als auch vom Verify-Script (scripts/verify.ts via app.request) getestet werden kann.
export function createApp(db: Db) {
  const app = new Hono();

  app.get('/api/health', (c) => c.json({ ok: true, service: 'salsaflow-dc-api' }));

  app.post('/api/auth/login', async (c) => {
    const body = await c.req.json().catch(() => null);
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) return c.json({ error: 'Ungültige Eingabe' }, 400);

    const email = parsed.data.email.toLowerCase().trim();
    const rows = await db
      .select()
      .from(adminProfiles)
      .where(eq(adminProfiles.email, email))
      .limit(1);
    const admin = rows[0];

    // Einheitliche Fehlermeldung, egal ob die Mail existiert (keine User-Enumeration).
    if (!admin || !verifyPassword(parsed.data.password, admin.passwordHash)) {
      return c.json({ error: 'E-Mail oder Passwort falsch' }, 401);
    }

    const token = issueSession(admin.id);
    setCookie(c, SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: 'Lax',
      path: '/',
      maxAge: 60 * 60 * 8,
    });
    return c.json({ ok: true, user: publicUser(admin) });
  });

  app.get('/api/auth/me', async (c) => {
    const session = verifySession(getCookie(c, SESSION_COOKIE));
    if (!session) return c.json({ error: 'Nicht eingeloggt' }, 401);
    const rows = await db
      .select()
      .from(adminProfiles)
      .where(eq(adminProfiles.id, session.sub))
      .limit(1);
    const admin = rows[0];
    if (!admin) return c.json({ error: 'Nicht eingeloggt' }, 401);
    return c.json({ user: publicUser(admin) });
  });

  app.post('/api/auth/logout', (c) => {
    deleteCookie(c, SESSION_COOKIE, { path: '/' });
    return c.json({ ok: true });
  });

  // Oeffentlicher Kursplan (Etappe 7): Read-only, kein Auth, keine Preise.
  app.route('/', createPublicRoutes(db));

  // Oeffentliche Buchung (Etappe 8): Verfuegbarkeit + Buchung anstossen, kein Auth.
  app.route('/', createBookingRoutes(db));

  // Oeffentliches Kontaktformular (Etappe 14): nimmt eine Anfrage an + mailt sie an info@. Kein Auth.
  app.route('/', createContactRoutes());

  // Admin-Verwaltung (Etappe 6): Staffeln + Kurse + Duplizieren. Eigenes Auth-Gate in den Routen.
  app.route('/', createAdminRoutes(db));

  return app;
}
