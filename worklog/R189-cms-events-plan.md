# R189 — CMS-Events (Folgelauf nach R188)

Quelle: FEEDBACK-R188.md E9 — Studio legt Events im CMS an (Login über
Vercel-Preview), sie erscheinen im Eventkalender und auf den Unterseiten
(Video 04:40, 05:45).

Start erst NACH Abschluss der visuellen Welle R188 (Pfad-Kollisionen mit
Item events-unterseiten vermeiden).

## Ist-Zustand (gescopet 21.08.)

- db/schema.ts: KEINE events-Tabelle. Muster: pgTable + drizzle, terms/courses.
- server/admin.ts: Hono + Zod-Schemas + audit(); Auth via SESSION_COOKIE.
- server/public.ts: createPublicRoutes(db), /api/public/schedule ohne Auth.
- src/admin/: nur Staffel-/Kurs-Verwaltung (AdminApp, TermsList, TermEditor,
  DuplicateView, BalanceView, ui.tsx).
- Event-Inhalte statisch: src/public/events/*-content.ts
  (eventkalender-content.ts = Kalenderliste).

## Bau-Schnitt (2 Items, disjunkt)

1. **backend-admin** — db/schema.ts: `events` (id, slug?, title, type
   [danceflow|floweekend|anniversary|workshop|other], date, startTime,
   endTime?, locationText, description, ctaUrl?, status draft|published,
   timestamps). Drizzle-Migration. server: Admin-CRUD (Zod, audit) +
   `/api/public/events` (nur published, date >= heute, sortiert).
   src/admin: EventsList + EventEditor + Routing in AdminApp.tsx, Stil wie
   TermsList/TermEditor (ui.tsx-Bausteine).
2. **frontend-wiring** — EventkalenderPage liest `/api/public/events`
   (Fallback: statische Liste, wenn API leer/down). Event-Unterseiten
   (danceflow, floweekend, anniversary) zeigen ihre nächsten Termine aus
   der API. Loading-/Empty-Zustand ohne Layout-Sprung.

Gate: `cd /root/clients/salsaflow-w1 && npm run typecheck && npx oxlint`
Kritik: Code-Doppelung sol-critic + opus-critic + grok-worker;
Look der Admin-/Kalender-Ansichten zusätzlich visuell belegen (PNGs 5175).

Offen: Vercel-Preview-Login für das Studio (bestehende Admin-Auth nutzen;
nur Wunsch notiert, kein neues Auth-System bauen).
