// Screenshots vom geoeffneten Buchungs-Dialog.
//
// Warum ein eigenes Skript: shot-sweep.mjs klickt zwar Elemente an, scrollt danach aber die
// SEITE. Der Dialog hat seinen eigenen Scroll-Container — die Seite steht still, waehrend im
// Dialog noch drei Bildschirmhoehen Formular liegen. Genau der Teil blieb darum ungesehen.
//
// Das Skript oeffnet den Dialog, misst seinen inneren Container und schiesst ihn in
// Bildschirm-Schritten ab. Zusaetzlich prueft es hart, ob der Absende-Knopf erreichbar ist.
//
// Aufruf:
//   node scripts/dialog-shot.mjs --base http://127.0.0.1:5174 --out /tmp/sf-dialog

// Playwright liegt global, nicht im Projekt — derselbe Pfad, den shot-sweep.mjs nutzt.
const { chromium, devices } = await import('/usr/lib/node_modules/playwright/index.mjs');
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, cur, i, arr) => {
    if (cur.startsWith('--')) acc.push([cur.slice(2), arr[i + 1]?.startsWith('--') ? true : arr[i + 1]]);
    return acc;
  }, []),
);

const BASE = args.base || 'http://127.0.0.1:5174';
const OUT = args.out || '/tmp/sf-dialog';
mkdirSync(OUT, { recursive: true });

// Zwei echte Geraete-Groessen plus ein kleines Fenster. Das kleine ist der harte Fall:
// dort passt der Dialog garantiert nicht auf einen Bildschirm.
const VIEWPORTS = [
  { name: 'iphone-se', width: 375, height: 667, mobile: true },
  { name: 'iphone-14', width: 390, height: 844, mobile: true },
  { name: 'desktop', width: 1440, height: 900, mobile: false },
];

const shots = [];
const problems = [];

const browser = await chromium.launch();

for (const vp of VIEWPORTS) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 2,
    isMobile: vp.mobile,
    hasTouch: vp.mobile,
    ...(vp.mobile ? devices['iPhone 13'].userAgent ? { userAgent: devices['iPhone 13'].userAgent } : {} : {}),
  });
  const page = await context.newPage();

  await page.goto(`${BASE}/buchung`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);

  // Ersten buchbaren Kurs anklicken. `pick-course-*` ist die echte Test-ID aus
  // BookingPanel.tsx — Text-Selektoren trafen mobil den Tages-Knopf statt den Kurs.
  await page.waitForSelector('[data-testid^="pick-course-"]', { timeout: 15000 }).catch(() => {});
  const picks = page.locator('[data-testid^="pick-course-"]');
  const count = await picks.count();

  let opened = false;
  for (let i = 0; i < Math.min(count, 4); i += 1) {
    try {
      await picks.nth(i).click({ timeout: 4000 });
      await page.waitForSelector('[data-testid="booking-dialog"]', { timeout: 4000 });
      opened = true;
      break;
    } catch {
      /* naechsten Kurs versuchen — der erste kann ausgebucht sein */
    }
  }

  if (!opened) {
    problems.push(`${vp.name}: Dialog liess sich nicht oeffnen (${count} Kurse gefunden)`);
    await context.close();
    continue;
  }

  // Auf das Ende der Verfuegbarkeits-Abfrage warten: vorher fehlt die Fusszeile
  // mit dem Absende-Knopf noch ganz im DOM.
  await page.waitForSelector('[data-testid="booking-submit"]', { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(600);

  const dialog = page.locator('[data-testid="booking-dialog"]');
  const scroller = dialog.locator('div.overflow-y-auto').first();

  // Messung 1: Passt der Dialog ueberhaupt in den sichtbaren Bereich?
  const box = await dialog.boundingBox();
  if (box && box.y + box.height > vp.height + 1) {
    problems.push(
      `${vp.name}: Dialog ragt ${Math.round(box.y + box.height - vp.height)}px unter den Bildschirm`,
    );
  }

  // Messung 2: Ist der Absende-Knopf sichtbar, ohne zu scrollen?
  const submit = page.locator('[data-testid="booking-submit"]');
  if (await submit.count()) {
    const sBox = await submit.boundingBox();
    if (!sBox || sBox.y + sBox.height > vp.height + 1) {
      problems.push(`${vp.name}: Absende-Knopf liegt ausserhalb des Bildschirms`);
    }
  } else {
    problems.push(`${vp.name}: Absende-Knopf nicht im DOM`);
  }

  // Messung 3: Laesst sich der Dialog-Inhalt wirklich scrollen?
  const metrics = await scroller.evaluate((el) => ({
    scrollHeight: el.scrollHeight,
    clientHeight: el.clientHeight,
  }));
  const scrollable = metrics.scrollHeight - metrics.clientHeight;

  let reached = 0;
  if (scrollable > 4) {
    await scroller.evaluate((el) => el.scrollTo(0, el.scrollHeight));
    await page.waitForTimeout(400);
    reached = await scroller.evaluate((el) => el.scrollTop);
    if (reached < scrollable - 4) {
      problems.push(
        `${vp.name}: Dialog-Inhalt scrollt nicht bis ans Ende (${reached}/${scrollable}px)`,
      );
    }
    await scroller.evaluate((el) => el.scrollTo(0, 0));
    await page.waitForTimeout(300);
  }

  // Messung 4: Bleibt der Hintergrund wirklich stehen?
  const beforeScroll = await page.evaluate(() => window.scrollY);
  await page.mouse.wheel(0, 600);
  await page.waitForTimeout(300);
  const afterScroll = await page.evaluate(() => window.scrollY);
  if (Math.abs(afterScroll - beforeScroll) > 2) {
    problems.push(`${vp.name}: Hintergrund scrollt mit (${beforeScroll} -> ${afterScroll})`);
  }

  // Bilder: den Dialog in Bildschirm-Schritten durchfahren.
  const steps = Math.max(1, Math.ceil(metrics.scrollHeight / Math.max(1, metrics.clientHeight)));
  for (let i = 0; i < steps; i += 1) {
    await scroller.evaluate((el, idx) => el.scrollTo(0, idx * el.clientHeight), i);
    await page.waitForTimeout(350);
    const file = resolve(OUT, `${vp.name}-dialog-${String(i).padStart(2, '0')}.png`);
    await page.screenshot({ path: file });
    shots.push(file);
  }

  await context.close();
}

await browser.close();

console.log(`\nBilder: ${shots.length} in ${OUT}`);
if (problems.length) {
  console.log(`\nPROBLEME (${problems.length}):`);
  for (const p of problems) console.log(`  - ${p}`);
  process.exitCode = 1;
} else {
  console.log('\nKeine Scroll- oder Erreichbarkeitsprobleme gemessen.');
}
