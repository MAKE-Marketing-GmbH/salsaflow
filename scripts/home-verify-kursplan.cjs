// Verify Home-Kursplan-Teaser (Runde 1, 2026-08-07). Prueft die zwei Auftragspunkte
// "Samstag MIT Datum" und "echte published Daten" am gerenderten DOM, nicht an der Absicht.
// Aufruf: node scripts/home-verify-kursplan.cjs
const { chromium } = require('/usr/lib/node_modules/playwright');

const BASE = 'http://localhost:5173';
let fails = 0;
const check = (name, ok, detail) => {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ' — ' + detail : ''}`);
  if (!ok) fails++;
};

(async () => {
  // Wahrheit aus der API holen, gegen die das DOM geprueft wird.
  const api = await fetch(`${BASE}/api/public/schedule`).then((r) => r.json());
  const running = api.courses.filter((c) => c.phase === 'running');
  const satRunning = running.filter((c) => c.weekday === 'sat');
  const fullSlots = running.filter((c) => c.status === 'full');

  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.waitForSelector('#kurse [role="tablist"]', { timeout: 15000 });
  // Ein stehengebliebenes Vite-HMR-Overlay aus einem frueheren Fehlerzustand faengt alle
  // Klicks ab. Wenn es da ist, ist die Messung ohnehin ungueltig -> hart abbrechen statt
  // es wegzuraeumen und einen alten Stand zu pruefen.
  if (await page.$('vite-error-overlay')) {
    console.log('FAIL  Vite-Error-Overlay aktiv — Seite ist im Fehlerzustand, Messung abgebrochen');
    await b.close();
    process.exit(1);
  }

  // 1) Wochen-Schiene: Mo bis Sa, Samstag vorhanden und mit Kalender-Zahl.
  //    Achtung: uppercase kommt aus CSS, textContent liefert "Sa" / "Sat".
  const tabs = await page.$$eval('#kurse [role="tab"]', (els) =>
    els.map((e) => e.textContent.replace(/\s+/g, ' ').trim()),
  );
  console.log('tabs:', JSON.stringify(tabs));
  check('Wochen-Schiene hat 6 Tage (Mo-Sa)', tabs.length === 6, `${tabs.length} Tabs`);
  const sat = tabs.find((t) => /^sa/i.test(t));
  check('Samstag ist eine eigene Spalte', !!sat, sat);

  // 2) Samstag anklicken -> volles Datum + der echte SFIT-Kurs.
  await page.click('#kurse [role="tab"]:last-child');
  await page.waitForTimeout(400);
  const dayLabel = await page.textContent('#kurse-tagesliste-label');
  console.log('Tages-Label:', dayLabel.replace(/\s+/g, ' ').trim());
  check(
    'Samstag zeigt volles Datum (Tag + Zahl + Monat)',
    /Samstag,\s*\d{1,2}\.\s*\p{L}+/u.test(dayLabel),
    dayLabel.replace(/\s+/g, ' ').trim(),
  );

  const rows = await page.$$eval('#kurse-tagesliste li', (els) =>
    els.map((e) => e.textContent.replace(/\s+/g, ' ').trim()),
  );
  console.log('Samstag-Zeilen:', JSON.stringify(rows));
  check('Samstag zeigt genau die echten Samstagskurse', rows.length === satRunning.length,
    `DOM ${rows.length} vs API ${satRunning.length}`);
  check(
    'Samstagskurs ist der echte SFIT-Kurs',
    rows.length > 0 && rows[0].includes(satRunning[0].startTime) && rows[0].includes('SFIT'),
    rows[0],
  );

  // 3) Status-Wahrheit. `buildScheduleSlots` setzt `full` erst, wenn ALLE Staffeln des Slots
  //    voll sind — Montag 18:30 Intermediate 11 ist in der laufenden Staffel voll, in der
  //    Sommerstaffel offen. "Plätze frei" ist dort also korrekt, aber ALLEIN mehrdeutig:
  //    es meint den Termin ab September, nicht heute. Der Vertrag lautet deshalb: eine Zeile,
  //    deren laufende Staffel voll ist, MUSS das ausdruecklich sagen und den naechsten Start
  //    nennen (dieselbe Regel wie /kursplan, CourseEngine.tsx:596-601).
  await page.click('#kurse [role="tab"]:first-child');
  await page.waitForTimeout(400);
  const monRows = await page.$$eval('#kurse-tagesliste li', (els) =>
    els.map((e) => e.textContent.replace(/\s+/g, ' ').trim()),
  );
  console.log('Montag-Zeilen:', JSON.stringify(monRows));
  const fullLevels = [...new Set(fullSlots.filter((c) => c.weekday === 'mon').map((c) => c.levelDe))];
  console.log('API: Montag ausgebucht laut laufender Staffel:', fullLevels.join(' | '));
  const isFullNow = (r) => fullLevels.some((l) => r.includes(l));
  const bare = monRows.filter((r) => isFullNow(r) && !/Ausgebucht, wieder frei ab \d/.test(r));
  check('Slot mit voller laufender Staffel sagt "ausgebucht, wieder frei ab <Datum>"',
    bare.length === 0, bare.join(' // '));
  const contradicting = monRows.filter((r) => isFullNow(r) && r.includes('Plätze frei'));
  check('derselbe Slot behauptet nicht gleichzeitig "Plätze frei"',
    contradicting.length === 0, contradicting.join(' // '));
  const reallyFree = monRows.filter((r) => !isFullNow(r));
  check('offener Slot zeigt weiterhin schlicht "Plätze frei"',
    reallyFree.length > 0 && reallyFree.every((r) => r.includes('Plätze frei')),
    reallyFree.join(' // '));

  await b.close();
  console.log(fails === 0 ? '\nALLE CHECKS GRUEN' : `\n${fails} CHECK(S) ROT`);
  process.exit(fails === 0 ? 0 : 1);
})();
