// Headless UI-Smoke: oeffentlicher RESERVIERUNGS-Flow (Stand 13.08.2026).
// Der alte Smoke prüfte den Kauf-Flow (book-open, Admin-Balance) — den gibt es nicht mehr:
// Buchung = Reservierung per Mail, ohne Datenbank (DECISIONS.md). Geprueft wird der echte
// Klickweg: /kursplan-Zeile -> /buchung?kurs=<id> -> Rolle -> Daten -> "Reservierung ist da",
// dazu die Paar-Reservierung und mobile Sauberkeit des Dialogs.
//
// Aufruf: SMOKE_ORIGIN=http://127.0.0.1:5174 node scripts/ui-smoke-booking.cjs
// (Default 5173; die lokale API muss laufen, sonst laedt der Kursplan nicht.)
const { chromium } = require('playwright-core');
const fs = require('node:fs');

const ORIGIN = process.env.SMOKE_ORIGIN || 'http://localhost:5173';
const SHOTS = '.marathon/reservation-shots';
const STAMP = Date.now();
const results = [];
function ok(name, cond, detail = '') {
  results.push({ name, cond: !!cond, detail });
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}${detail ? '  (' + detail + ')' : ''}`);
}

/* Nach dem Absenden gibt es zwei richtige Ausgaenge: eine freie Reservierung verlaesst
   den Dialog Richtung /vorbereiten, ein voller Kurs bleibt als Warteliste im Modal.
   Beide Warteroutinen lehnen nach ihrem Timeout ab — haengte man sie roh in ein
   Promise.race, gewaenne die erste Ablehnung und meldete einen korrekten Ablauf als
   Fehlschlag. Jeder Zweig schluckt seine Ablehnung darum in ein nie erfuelltes Promise;
   nur ein echtes Eintreten gewinnt. Erst der eigene Gesamt-Timeout liefert null. */
async function firstOutcome(page, timeoutMs = 15000) {
  const never = () => new Promise(() => {});
  return Promise.race([
    page.waitForURL(/\/vorbereiten/, { timeout: timeoutMs }).then(() => 'prepare', never),
    page.locator('[data-testid="booking-success"]').waitFor({ timeout: timeoutMs }).then(() => 'waitlist', never),
    new Promise((resolve) => setTimeout(() => resolve(null), timeoutMs + 1000)),
  ]);
}

/* Kurse mit Rollenwahl starten auf Schritt 1 (Rolle, Allein/Paar); nur offene Klassen
   wie Heels springen direkt auf Schritt 2. `booking-submit` und `mode-couple` liegen in
   verschiedenen Schritten, ebenso der Marker `lane-full-note`: er steht auf Schritt 1 und
   auf Schritt 2 nur bei offenen Klassen. Die Auslastung muss deshalb gelesen werden,
   solange Schritt 1 sichtbar ist — danach ist sie aus dem DOM verschwunden und jede
   Ableitung faende faelschlich «nicht voll». Der Dialog startet ausserdem im
   Ladezustand (`loading` = true), und die Fusszeile mit beiden Knoepfen haengt hinter
   diesem Gate: vor dem Ende des Verfuegbarkeits-Abrufs ist keiner der beiden im DOM.
   Erst danach unterscheidet die Zaehlung Schritt 1 von einer offenen Klasse. */
async function auslastungBereit(page, timeout = 15000) {
  await page.locator('[data-testid="booking-next"], [data-testid="booking-submit"]').first().waitFor({ timeout });
}

async function schrittEinsDurchlaufen(page, { rolle, paar = false }) {
  await auslastungBereit(page);
  const weiter = page.locator('[data-testid="booking-next"]');
  const aufSchrittEins = (await weiter.count()) > 0;
  if (!aufSchrittEins) {
    // Offene Klasse: kein Schritt 1, der Marker steht hier im selben Schritt.
    await page.locator('[data-testid="booking-submit"]').waitFor({ timeout: 10000 });
    return (await page.locator('[data-testid="lane-full-note"]').count()) ? 'waitlist' : 'prepare';
  }
  const rolleTile = page.locator(`[data-testid="${rolle}"]`);
  if (await rolleTile.count()) await rolleTile.click();
  if (paar) await page.locator('[data-testid="mode-couple"]').click();
  const erwartet = (await page.locator('[data-testid="lane-full-note"]').count()) ? 'waitlist' : 'prepare';
  await weiter.click();
  await page.locator('[data-testid="booking-submit"]').waitFor({ timeout: 10000 });
  return erwartet;
}

async function fillPerson(page, prefix, first) {
  await page.locator(`input[name="${prefix}-firstName"]`).fill(first);
  await page.locator(`input[name="${prefix}-lastName"]`).fill('Smoke');
  await page.locator(`input[name="${prefix}-email"]`).fill(`${first.toLowerCase()}.${STAMP}@uismoke.local`);
}

(async () => {
  fs.mkdirSync(SHOTS, { recursive: true });
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 1600 },
    // Eigener Rate-Limit-Eimer pro Lauf: der Server keyed auf x-forwarded-for; ohne das
    // laeuft der zweite Smoke innerhalb von 10 Minuten in die 429 (5 Mails/10min).
    extraHTTPHeaders: { 'x-forwarded-for': `10.77.${Math.floor(STAMP / 1000) % 250}.${STAMP % 250}` },
  });
  const page = await context.newPage();
  await page.addInitScript(() => localStorage.setItem('salsaflow-cookie-ok', '1'));
  page.on('pageerror', (e) => console.log('PAGEERROR:', e.message));

  try {
    // --- 1) /kursplan: Zeilen sind Links auf /buchung?kurs=<id> ------------
    await page.goto(`${ORIGIN}/kursplan`, { waitUntil: 'networkidle' });
    const firstCard = page.locator('[data-testid="course-card"]').first();
    await firstCard.waitFor({ timeout: 15000 });
    const href = await firstCard.getAttribute('href');
    ok('Kursplan-Zeile verlinkt auf /buchung?kurs=', /^\/buchung\?kurs=/.test(href || ''), href || 'kein href');

    // --- 2) Vorauswahl: Link folgen, Dialog steht auf dem Kurs -------------
    await page.goto(`${ORIGIN}${href}`, { waitUntil: 'networkidle' });
    await page.locator('[data-testid="booking-dialog"]').waitFor({ timeout: 10000 });
    ok('Dialog oeffnet vorausgewaehlt', true);

    // --- 3) Solo-Reservierung bis zum Erfolg -------------------------------
    const soloKurs = (await page.locator('[data-testid="booking-dialog"] h2').first().innerText()).trim();
    const soloErwartet = await schrittEinsDurchlaufen(page, { rolle: 'role-follower' });
    await fillPerson(page, 'bk', 'Solo');
    await page.locator('[data-testid="booking-submit"]').click();
    const soloOutcome = await firstOutcome(page);
    ok(
      `Solo-Reservierung nimmt den erwarteten Ausgang (${soloErwartet})`,
      soloOutcome === soloErwartet,
      `erwartet ${soloErwartet}, war ${soloOutcome}`,
    );
    if (soloOutcome === 'prepare') {
      await page.locator('[data-testid="prepare-booking"]').waitFor({ timeout: 10000 });
      const kurs = (await page.locator('[data-testid="prepare-booking"] h2').innerText()).trim();
      ok('Vorbereiten-Seite nennt den reservierten Kurs', kurs === soloKurs, `${kurs} vs ${soloKurs}`);
      await page.screenshot({ path: `${SHOTS}/01-solo.png`, fullPage: false });
    } else {
      await page.screenshot({ path: `${SHOTS}/01-solo.png`, fullPage: false });
      await page.locator('[data-testid="booking-close"]').click();
      await page.locator('[data-testid="booking-dialog"]').waitFor({ state: 'detached', timeout: 5000 });
      ok('Warteliste: Dialog schliesst nach der Exit-Animation', true);
    }

    // --- 4) Paar-Reservierung ----------------------------------------------
    await page.goto(`${ORIGIN}/buchung`, { waitUntil: 'networkidle' });
    await page.locator('[data-testid="course-list"] button').first().waitFor({ timeout: 10000 });
    await page.locator('[data-testid="course-list"] button').first().click();
    await page.locator('[data-testid="reserve-spot"]').click();
    await page.locator('[data-testid="booking-dialog"]').waitFor({ timeout: 10000 });
    const coupleErwartet = await schrittEinsDurchlaufen(page, { rolle: 'role-leader', paar: true });
    await fillPerson(page, 'bk', 'PaarA');
    if (await page.locator('input[name="bk-p-firstName"]').count()) await fillPerson(page, 'bk-p', 'PaarB');
    await page.locator('[data-testid="booking-submit"]').click();
    const coupleOutcome = await firstOutcome(page);
    ok(
      `Paar-Reservierung nimmt den erwarteten Ausgang (${coupleErwartet})`,
      coupleOutcome === coupleErwartet,
      `erwartet ${coupleErwartet}, war ${coupleOutcome}`,
    );
    await page.screenshot({ path: `${SHOTS}/02-couple.png`, fullPage: false });

    // --- 5) Mobil: Formularschritt ohne Ueberlauf, Absenden erreichbar -----
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${ORIGIN}${href}`, { waitUntil: 'networkidle' });
    await page.locator('[data-testid="booking-dialog"]').waitFor({ timeout: 10000 });
    await schrittEinsDurchlaufen(page, { rolle: 'role-follower' });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    ok('Mobil: kein horizontaler Ueberlauf', overflow <= 1, `${overflow}px`);
    const submitVisible = await page.locator('[data-testid="booking-submit"]').isVisible();
    ok('Mobil: Absende-Knopf sichtbar', submitVisible);
    await page.screenshot({ path: `${SHOTS}/03-mobile.png`, fullPage: false });

    const failed = results.filter((r) => !r.cond).length;
    console.log(`\nUI-SMOKE (RESERVIERUNG) VERDICT: ${failed === 0 ? 'PASS' : 'FAIL'} (${results.length - failed}/${results.length})`);
    await browser.close();
    process.exit(failed === 0 ? 0 : 1);
  } catch (e) {
    console.log('UI-SMOKE FEHLER:', e.message);
    await page.screenshot({ path: `${SHOTS}/99-fehler.png`, fullPage: true }).catch(() => {});
    await browser.close();
    process.exit(1);
  }
})();
