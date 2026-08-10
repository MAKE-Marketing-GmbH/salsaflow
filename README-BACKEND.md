# Salsaflow DC - Backend-Fundament (Marathon Etappe 5)

Lauffaehiges Backend mit Datenbank, Admin-Login und Seed der Staffel Januar 2026.
Scope dieser Etappe: nur das Fundament. **Noch kein Admin-UI (Etappe 6), keine oeffentlichen Seiten (ab Etappe 7).**

## Stack

- **Frontend:** React 19 + Vite 6 + TypeScript + Tailwind CSS v4 + shadcn-Fundament (Regel 031).
- **DB/ORM:** PostgreSQL-Schema via **Drizzle ORM** (echtes Postgres-DDL, 1:1 aus `ARCHITEKTUR.md`).
- **Lokale DB:** **PGlite** (eingebettetes Postgres, kein Docker noetig) unter `./.data/pglite`.
- **Echte DB (spaeter):** `DATABASE_URL` setzen -> derselbe Code/dasselbe Schema laufen gegen
  Supabase/Neon (siehe Architektur-Entscheid, `DECISIONS.md` Etappe 5).
- **API/Auth:** Hono-Server (`server/`) mit self-contained Credential-Login (scrypt-Hash, signierte
  HMAC-Session). Das ist der in `ARCHITEKTUR.md` 1.2 vorgesehene Fallback und lokal verifizierbar.

## Schnellstart

```bash
npm install
cp .env.example .env          # optional; ohne .env laeuft alles mit sicheren Dev-Defaults
npm run setup                 # = db:migrate + db:seed (legt lokale PGlite-DB an + Seed)
npm run verify                # 18 Checks: Migration + Seed + Login (VERDICT PASS/FAIL)
npm run dev                   # Frontend (5173) + API (8787) parallel
```

`npm run build` ist das Etappen-Gate (Typecheck Frontend + Backend + Vite-Build, Exit 0).

## Scripts

| Script | Zweck |
|---|---|
| `npm run db:generate` | SQL-Migration aus `db/schema.ts` erzeugen (`drizzle/`) |
| `npm run db:migrate` | Migration anwenden (PGlite lokal oder `DATABASE_URL`) |
| `npm run db:seed` | Stammdaten + Staffel Januar 2026 seeden (idempotent) |
| `npm run db:reset` | lokale PGlite-DB loeschen + neu migrieren + seeden |
| `npm run setup` | migrate + seed |
| `npm run verify` | Fertig-Kriterium maschinell pruefen |
| `npm run build` | **Gate**: Typecheck + Build |
| `npm run dev` / `npm run start` | App lokal starten |
| `npm run verify:admin` / `:public` / `:booking` | Gates Etappe 6 / 7 / 8 |
| `npm run verify:payment` | **Gate Etappe 9**: Online-Zahlung (Sandbox, PAYMENT_ENABLED=1) |
| `npm run dev:pay` | App lokal MIT scharfer Zahlung (PAYMENT_ENABLED=1) |

## Online-Zahlung (Etappe 9)

TWINT/Karte ueber Stripe Checkout (ARCHITEKTUR.md 7). Ohne `STRIPE_SECRET_KEY` laeuft ein lokaler
Sandbox-Treiber mit gehosteter Test-Bezahlseite (`/api/sandbox/checkout/:id`) und lokal signierten
Webhook-Events - so ist der ganze Flow ohne Kunden-Credentials pruefbar (`npm run verify:payment`,
plus Klickweg `node scripts/ui-smoke-payment.cjs` gegen `npm run dev:pay`). Fuer echtes Stripe nur
`STRIPE_SECRET_KEY` + `STRIPE_WEBHOOK_SECRET` (+ ggf. `PUBLIC_BASE_URL`) setzen, derselbe Code laeuft.
Eine Buchung wird erst `confirmed`, wenn der verifizierte Webhook die Zahlung als `succeeded` meldet.

## Admin-Login (Dev)

- E-Mail: `admin@salsaflow-dc.com`
- Passwort: `SEED_ADMIN_PASSWORD` aus `.env`, Default `salsaflow-admin-2026`
- Endpoints: `POST /api/auth/login`, `GET /api/auth/me`, `POST /api/auth/logout`, `GET /api/health`

## Wie das Fertig-Kriterium erfuellt ist

| Kriterium | Nachweis |
|---|---|
| App startet lokal | `npm run dev` / `npm run start` (API auf :8787, Health-Endpoint, Login-Screen) |
| DB-Migration laeuft | `npm run db:migrate` legt alle 16 Tabellen an (`verify`: "16/16 da") |
| Admin-Login funktioniert | `verify` testet scrypt + Session + echten HTTP-Login (200/401) ueber die Hono-Route |
| Beispiel-Staffel aus Excel-Header | Seed der Staffel Januar 2026 = 37 Kurse (nur Header, **keine** Schuelerdaten) |

## Datenschutz

Der Seed nutzt ausschliesslich die Kurs-Header (Stil/Level/Tag/Zeit/Ort/Lehrer/Preis) aus
`.marathon/seed-source/januar-2026.json`. Lehrer-Namen sind oeffentliches Team. Teilnehmer-/
Master-Data-Zeilen der Excel wurden nie gelesen und sind nicht in der DB.

## Datenmodell-Kurznotiz fuer Etappe 6+

- `terms` (Staffel) 1-n `courses` n-1 `styles` -> `ladder_key` -> `level_rungs` (Auto-Aufstieg via `ordinal+1`).
- `level_rungs` ist die Quelle fuer DE/EN-Labels UND die Aufstiegs-Regel (ARCHITEKTUR.md Abschnitt 3).
- `admin_profiles` ist hier self-contained (email + password_hash). Bewusste, dokumentierte Abweichung
  vom Supabase-Auth-Entscheid (Etappe 2), siehe `DECISIONS.md` Etappe 5.
