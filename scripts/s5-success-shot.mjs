// Screenshots der beiden Erfolgsausgaenge (S5).
//
// Warum ein eigenes Skript: ui-smoke-booking.cjs prueft den Klickweg, schiesst aber nur
// ein Bild pro Fall. Hier geht es um die Sicht: die Vorbereitungsseite nach einer freien
// Reservierung und der Wartelisten-Dialog, jeweils Desktop und Mobil.
//
// Eine freie Reservierung verlaesst den Dialog per Redirect auf /vorbereiten und traegt
// Kurs, Termin, Studio und Zahlung ueber sessionStorage mit; der Wartelisten-Fall bleibt
// im Modal. Er wird erzwungen, indem die Antwort der Reservierungs-API im Browser auf
// `waitlisted` umgeschrieben wird. Der Server bleibt unangetastet.
//
// Aufruf: node scripts/s5-success-shot.mjs --base http://127.0.0.1:5175 --out /tmp/s5-shots

const { chromium } = await import('/usr/lib/node_modules/playwright/index.mjs');
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, cur, i, arr) => {
    if (cur.startsWith('--')) acc.push([cur.slice(2), arr[i + 1]?.startsWith('--') ? true : arr[i + 1]]);
    return acc;
  }, []),
);

const BASE = args.base || 'http://127.0.0.1:5175';
const OUT = args.out || '/tmp/s5-shots';
mkdirSync(OUT, { recursive: true });

const STAMP = Date.now();
const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900, mobile: false },
  { name: 'mobile', width: 390, height: 844, mobile: true },
];

/* Kurse mit Rollenwahl starten auf Schritt 1: dort steht nur `booking-next`,
   `booking-submit` existiert erst auf Schritt 2. Offene Klassen (styleKey 'heels')
   ueberspringen Schritt 1 und zeigen den Absende-Knopf sofort. Beide Knoepfe stehen
   hinter dem Verfuegbarkeits-Ladezustand des Dialogs, deshalb erst darauf warten:
   im Ladezustand ist keiner im DOM und die Zaehlung saehe faelschlich eine offene Klasse. */
async function schrittEinsDurchlaufen(page) {
  await page.locator('[data-testid="booking-next"], [data-testid="booking-submit"]').first().waitFor({ timeout: 15000 });
  const weiter = page.locator('[data-testid="booking-next"]');
  if (!(await weiter.count())) {
    await page.waitForSelector('[data-testid="booking-submit"]', { timeout: 15000 });
    return;
  }
  const rolle = page.locator('[data-testid="role-follower"]');
  if (await rolle.count()) await rolle.click();
  await weiter.click();
  await page.waitForSelector('[data-testid="booking-submit"]', { timeout: 15000 });
}

const browser = await chromium.launch();
const shots = [];

for (const vp of VIEWPORTS) {
  for (const mode of ['prepare', 'waitlisted']) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 2,
      isMobile: vp.mobile,
      hasTouch: vp.mobile,
      extraHTTPHeaders: { 'x-forwarded-for': `10.78.${Math.floor(Math.random() * 250)}.${Math.floor(Math.random() * 250)}` },
    });
    const page = await context.newPage();
    await page.addInitScript(() => localStorage.setItem('salsaflow-cookie-ok', '1'));

    if (mode === 'waitlisted') {
      // Nur die Antwort umschreiben, nicht die Anfrage: der Server bekommt die echte
      // Reservierung, die Ansicht sieht den vollen Kurs.
      await page.route('**/api/public/reservations', async (route) => {
        const response = await route.fetch();
        const body = await response.json().catch(() => ({}));
        await route.fulfill({ response, json: { ...body, status: 'waitlisted' } });
      });
    }

    await page.goto(`${BASE}/buchung`, { waitUntil: 'networkidle' });
    await page.waitForSelector('[data-testid^="pick-course-"]', { timeout: 15000 });
    await page.locator('[data-testid^="pick-course-"]').first().click();
    await page.waitForSelector('[data-testid="booking-dialog"]', { timeout: 15000 });
    await schrittEinsDurchlaufen(page);

    await page.locator('input[name="bk-firstName"]').fill('Shot');
    await page.locator('input[name="bk-lastName"]').fill('Test');
    await page.locator('input[name="bk-email"]').fill(`shot.${STAMP}.${mode}.${vp.name}@uishot.local`);
    await page.locator('[data-testid="booking-submit"]').click();

    let status;
    if (mode === 'waitlisted') {
      await page.waitForSelector('[data-testid="booking-success"]', { timeout: 15000 });
      status = await page.locator('[data-testid="booking-success"]').getAttribute('data-status');
    } else {
      await page.waitForURL(/\/vorbereiten/, { timeout: 15000 });
      await page.waitForSelector('[data-testid="prepare-booking"]', { timeout: 15000 });
      status = 'prepare';
    }
    await page.waitForTimeout(900);

    const file = resolve(OUT, `${vp.name}-${mode}.png`);
    await page.screenshot({ path: file, fullPage: mode === 'prepare' });
    shots.push(`${file} (status=${status})`);
    await context.close();
  }
}

await browser.close();
console.log(shots.join('\n'));
