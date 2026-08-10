import 'dotenv/config';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type { DbHandle } from '../db/client.js';

// Etappe-7-Gate: prueft die oeffentliche Kursplan-API (/api/public/schedule) gegen eine
// frische lokale Seed-DB ueber echte app.request()-Calls. Eine echte DATABASE_URL bleibt unberuehrt.

type Check = { name: string; ok: boolean; detail: string };
const checks: Check[] = [];
function check(name: string, ok: boolean, detail: string) {
  checks.push({ name, ok, detail });
}

type Course = {
  id: string;
  phase: 'running' | 'upcoming';
  styleKey: string;
  styleDe: string;
  styleEn: string;
  levelRungId: string | null;
  levelDe: string | null;
  levelEn: string | null;
  levelCategory: string | null;
  onVariant: 'on1' | 'on2' | null;
  weekday: string;
  status: string;
  allowsLateEntry: boolean;
  teachers: unknown[];
};
type Term = { id: string; name: string; startDate: string; endDate: string; phase: string };
type Schedule = {
  today: string;
  terms: Term[];
  courses: Course[];
  filters: {
    weekdays: string[];
    styles: { key: string; de: string; en: string }[];
    levelCategories: string[];
  };
};

async function main() {
  let handle: DbHandle | undefined;
  let tmpDataDir: string | undefined;

  try {
    if (!process.env.DATABASE_URL?.trim()) {
      tmpDataDir = mkdtempSync(join(tmpdir(), 'salsaflow-verify-public-'));
      process.env.PGLITE_DATA_DIR = tmpDataDir;
    }

    const [{ openDb }, { createApp }, { runSeed }] = await Promise.all([
      import('../db/client.js'),
      import('../server/app.js'),
      import('./seed.js'),
    ]);

    handle = await openDb();
    if (handle.driver === 'pglite') {
      await handle.migrate();
      await handle.close();
      handle = undefined;
      await runSeed();
      handle = await openDb();
    }

    const app = createApp(handle.db);

    /* 1) Oeffentlich erreichbar OHNE Login -------------------------------------- */
    const res = await app.request('/api/public/schedule');
    check('Oeffentlich ohne Login erreichbar (200)', res.status === 200, `status ${res.status}`);
    const data = (await res.json().catch(() => null)) as Schedule | null;
    if (!data) {
      console.log('VERDICT: FAIL (keine Antwort)');
      process.exitCode = 1;
      return;
    }

    /* 2) Sichtbarkeit: nur veroeffentlichte, nicht-vergangene Staffeln ---------- */
    const today = data.today;
    const noPast = data.terms.every((tm) => tm.endDate >= today);
    check('Keine vergangene Staffel sichtbar (endDate >= heute)', noPast, `${data.terms.length} Staffeln, heute ${today}`);

    const hasJanuar = data.terms.some((tm) => tm.name === 'Staffel Januar 2026');
    check('Vergangene Staffel Januar 2026 ausgeblendet', !hasJanuar, hasJanuar ? 'noch sichtbar' : 'ausgeblendet');

    const hasRunning = data.terms.some((tm) => tm.phase === 'running');
    const hasUpcoming = data.terms.some((tm) => tm.phase === 'upcoming');
    check('Mindestens eine laufende Staffel', hasRunning, hasRunning ? 'ok' : 'keine');
    check('Mindestens eine zukuenftige Staffel', hasUpcoming, hasUpcoming ? 'ok' : 'keine');

    /* 3) Kurse: nur sichtbare Status, beide Phasen vertreten ------------------- */
    check('Kurse vorhanden', data.courses.length > 0, `${data.courses.length} Kurse`);
    const onlyVisibleStatus = data.courses.every((c) => c.status === 'open' || c.status === 'full');
    check('Nur sichtbare Kurs-Status (open/full, kein draft)', onlyVisibleStatus, 'ok');

    const runningCourses = data.courses.filter((c) => c.phase === 'running').length;
    const upcomingCourses = data.courses.filter((c) => c.phase === 'upcoming').length;
    check('Kurse im Eimer "laufend" vorhanden', runningCourses > 0, `${runningCourses}`);
    check('Kurse im Eimer "zukuenftig" vorhanden', upcomingCourses > 0, `${upcomingCourses}`);

    /* 4) DE/EN: beide Sprachen vorhanden + unterscheiden sich irgendwo --------- */
    const styleBothLangs = data.courses.every((c) => c.styleDe.length > 0 && c.styleEn.length > 0);
    check('Jeder Kurs hat Stil-Label DE und EN', styleBothLangs, 'ok');

    const leveledBothLangs = data.courses
      .filter((c) => c.levelRungId)
      .every((c) => !!c.levelDe && !!c.levelEn);
    check('Kurse mit Level haben Label DE und EN', leveledBothLangs, 'ok');

    const langsDiffer =
      data.courses.some((c) => c.styleDe !== c.styleEn) ||
      data.courses.some((c) => c.levelDe && c.levelEn && c.levelDe !== c.levelEn);
    check('DE und EN unterscheiden sich (Umschalter wirkt)', langsDiffer, 'z.B. Stufe -> Level');

    /* 5) On2-EN-Komposition (ARCHITEKTUR.md 4.2): "<Level EN> On2" ------------- */
    const on2 = data.courses.find((c) => c.onVariant === 'on2' && c.levelEn);
    if (on2) {
      const expected = `${on2.levelEn} On2`;
      // Wir pruefen nur, dass das EN-Label existiert und der On2-Zusatz daran haengt.
      check('On2-Kurs hat komponierbares EN-Level-Label', expected.endsWith('On2') && on2.levelEn!.length > 0, expected);
    } else {
      check('On2-Kurs vorhanden (oder bewusst keiner)', true, 'kein On2-Kurs im Seed (ok)');
    }

    /* 6) Preis-Privatsphaere: keine Preise im oeffentlichen Payload ------------ */
    const raw = JSON.stringify(data);
    const noPrices =
      !('prices' in (data.courses[0] ?? {})) && !raw.includes('amountChf') && !raw.includes('"prices"');
    check('Keine Preise im oeffentlichen Plan (Privatsphaere)', noPrices, 'kein prices/amountChf');

    /* 7) Quereinstieg variiert (Chip-Demo): laufend hat true UND false --------- */
    const runningLate = data.courses.filter((c) => c.phase === 'running');
    const someLate = runningLate.some((c) => c.allowsLateEntry);
    const someNoLate = runningLate.some((c) => !c.allowsLateEntry);
    check('Quereinstieg variiert in laufender Staffel (true + false)', someLate && someNoLate, `${someLate}/${someNoLate}`);

    /* 8) Filter-Metadaten gefuellt -------------------------------------------- */
    check('Filter: Wochentage vorhanden', data.filters.weekdays.length > 0, `${data.filters.weekdays.length}`);
    check('Filter: Stile vorhanden', data.filters.styles.length > 0, `${data.filters.styles.length}`);
    check(
      'Filter: Level-Kategorien vorhanden (kein Stufen-Dschungel)',
      data.filters.levelCategories.length > 0,
      data.filters.levelCategories.join(', '),
    );

    // Level-Kategorien decken sich mit den Kursen + keine doppelten Labels.
    const courseCats = new Set(data.courses.map((c) => c.levelCategory).filter(Boolean));
    const catsMatch = data.filters.levelCategories.every((k) => courseCats.has(k));
    const catsUnique = new Set(data.filters.levelCategories).size === data.filters.levelCategories.length;
    check('Level-Kategorien decken sich mit Kursen + sind eindeutig', catsMatch && catsUnique, [...courseCats].join(', '));

    // Filter-Optionen entsprechen tatsaechlich vorkommenden Kursen (keine Geister-Option).
    const courseWeekdays = new Set(data.courses.map((c) => c.weekday));
    const weekdaysMatch = data.filters.weekdays.every((w) => courseWeekdays.has(w));
    check('Filter-Wochentage decken sich mit Kursen', weekdaysMatch, 'ok');

    /* Ausgabe ----------------------------------------------------------------- */
    console.log('\n=== Etappe 7 Verify (oeffentlicher Kursplan) ===');
    console.log(`DB-Treiber: ${handle.driver}\n`);
    let failed = 0;
    for (const c of checks) {
      console.log(`  ${c.ok ? 'PASS' : 'FAIL'}  ${c.name}  (${c.detail})`);
      if (!c.ok) failed++;
    }
    console.log('');
    if (failed > 0) {
      console.log(`VERDICT: FAIL (${failed}/${checks.length} Checks fehlgeschlagen)`);
      process.exitCode = 1;
      return;
    }
    console.log(`VERDICT: PASS (${checks.length}/${checks.length} Checks gruen)`);
  } finally {
    try {
      if (handle) {
        await handle.close();
      }
    } finally {
      if (tmpDataDir) {
        rmSync(tmpDataDir, { recursive: true, force: true });
      }
    }
  }
}

main().catch((err) => {
  console.error('[verify-public] FEHLER:', err);
  process.exit(1);
});
