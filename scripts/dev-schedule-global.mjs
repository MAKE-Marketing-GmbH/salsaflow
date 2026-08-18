// Dev-Startwert fuer den Kursplan (Watchdog R63).
//
// Problem: `embeddedSchedule()` kennt zwei Quellen — globalThis.__SCHEDULE__ (Prerender)
// und den <script id="schedule-data">-Tag (gebautes HTML). Der Dev-Server hat keine von
// beiden: /buchung, /kursplan und die Home-Vorschau starteten im Dev mit «wird geladen»,
// obwohl die Live-API nebenan denselben Plan liefert. Jeder Watchdog-Shot traf genau
// diesen leeren ersten Frame.
//
// Dieses Skript holt den aktuellen Stand aus der lokalen API und schreibt ihn nach
// src/generated/schedule-embedded.ts. src/main.tsx importiert die Datei und setzt sie
// als globalThis.__EMBEDDED_SCHEDULE__, bevor React rendert. Derselbe Vertrag wie im
// Build: eingebetteter Plan = Startwert, der Netz-Fetch aktualisiert nur.
//
// Lauf: `node scripts/dev-schedule-global.mjs` — nach Kursplan-Aenderungen neu laufen
// lassen. Ohne laufende API (8788) bleibt die alte Datei stehen und es gibt eine Warnung.

import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const out = path.join(root, 'src/generated/schedule-embedded.ts');
const API = process.env.SCHEDULE_API ?? 'http://127.0.0.1:8788/api/public/schedule';

const res = await fetch(API);
if (!res.ok) throw new Error(`API ${res.status}`);
const schedule = await res.json();

fs.mkdirSync(path.dirname(out), { recursive: true });
const body = JSON.stringify(schedule);
fs.writeFileSync(
  out,
  '// GENERIERT von scripts/dev-schedule-global.mjs — nicht von Hand editieren.\n' +
    '// Stand der lokalen API beim letzten Lauf des Skripts. Wird in main.tsx als\n' +
    '// globalThis.__EMBEDDED_SCHEDULE__ gesetzt (Dev-Startwert, Fetch aktualisiert).\n' +
    "import type { ScheduleResponse } from '@/lib/schedule';\n\n" +
    `export const embeddedScheduleData = ${body} as unknown as ScheduleResponse;\n`,
);
console.log(
  `schedule-embedded.ts geschrieben: ${schedule.courses?.length ?? 0} Kurse, ${schedule.terms?.length ?? 0} Staffeln, ${body.length} B`,
);
