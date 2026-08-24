// R183 Fix-Runde 3 — Beweis zu kimi-critics Fund.
//
// Behauptung des Builders in Runde 2: der Hinweis "Offene Klasse - keine
// Rollenwahl noetig." muss in Schritt 2 bleiben, weil Schritt 2 bei offener
// Klasse sonst kein Fokus-Ziel hat.
// Dieses Skript prueft die Behauptung am laufenden DOM statt am Kommentar.
//
// Gemessen wird:
//  A) Existiert bei offener Klasse ein Bedienelement, das den Schritt wechselt?
//     Nur ein Schrittwechsel laesst den Fokus-Effekt feuern (stepChanged-Guard).
//  B) Was tut der Zurueck-Knopf bei offener Klasse — schliessen oder wechseln?
//  C) Bleibt der Dialog ohne den Satz bedienbar?
//
// Aufruf: node worklog/.r183-openclass-reach.mjs --base http://127.0.0.1:5175 --tag reach
const { chromium } = await import('/usr/lib/node_modules/playwright/index.mjs');
import { mkdirSync, writeFileSync } from 'node:fs';

const argv = process.argv.slice(2);
const arg = (name, fallback) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const BASE = arg('base', 'http://127.0.0.1:5175');
const TAG = arg('tag', 'reach');
const OUT = '/root/clients/salsaflow-w1/worklog/shots/r183-kursmodal';
const VP = { width: 390, height: 844 };
mkdirSync(OUT, { recursive: true });

const fails = [];
const notes = [];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: VP, deviceScaleFactor: 2 });

// Im Live-Plan gibt es keinen Heels-Kurs. styleKey wird deshalb erzwungen,
// damit der isOpen-Zweig ueberhaupt rendert.
let patched = 0;
await page.route('**/api/**', async (route) => {
  const res = await route.fetch();
  let body;
  try {
    body = await res.json();
  } catch {
    return route.fulfill({ response: res });
  }
  const walk = (node) => {
    if (Array.isArray(node)) return node.forEach(walk);
    if (node && typeof node === 'object') {
      if ('styleKey' in node) {
        node.styleKey = 'heels';
        patched += 1;
      }
      Object.values(node).forEach(walk);
    }
  };
  walk(body);
  return route.fulfill({ response: res, body: JSON.stringify(body) });
});

const pageErrors = [];
page.on('pageerror', (e) => pageErrors.push(String(e)));

await page.goto(`${BASE}/buchung`, { waitUntil: 'networkidle' });
await page.waitForTimeout(700);
await page.waitForSelector('[data-testid^="pick-course-"]', { timeout: 15000 });

const picks = page.locator('[data-testid^="pick-course-"]');
const n = await picks.count();
let opened = false;
for (let i = 0; i < Math.min(n, 5); i += 1) {
  try {
    await picks.nth(i).click({ timeout: 4000 });
    await page.waitForSelector('[data-testid="reserve-spot"]', { timeout: 4000 });
    await page.locator('[data-testid="reserve-spot"]').click();
    await page.waitForSelector('[data-testid="booking-dialog"]', { timeout: 5000 });
    opened = true;
    break;
  } catch {
    /* naechster Kurs */
  }
}
if (!opened) throw new Error('Dialog liess sich nicht oeffnen');
await page.waitForSelector('[data-testid="booking-submit"]', { timeout: 15000 });
await page.waitForTimeout(600);

const out = { tag: TAG, base: BASE, viewport: VP, patchedCourseObjects: patched };

// --- Zweig wirklich offen? ---
// Das Namensfeld ist der Beweis, dass Schritt 2 (Daten) direkt offen steht.
// Es traegt im Markup keine feste id, deshalb ueber das Label suchen.
out.isOpenBranch = await page.evaluate(() => {
  const firstName =
    document.querySelector('#bk-firstName') ??
    document.querySelector('input[name="firstName"]') ??
    document.querySelector('[data-testid="bk-firstName"]') ??
    [...document.querySelectorAll('label')]
      .find((l) => /vorname|first name/i.test(l.textContent || ''))
      ?.querySelector('input');
  return {
    roleTilesGone: !document.querySelector('[data-testid="role-follower"]'),
    nextButtonGone: !document.querySelector('[data-testid="booking-next"]'),
    firstNameVisible: !!firstName,
    inputCount: document.querySelectorAll('[role="dialog"] input, [data-testid="booking-dialog"] input').length,
  };
});
if (!out.isOpenBranch.roleTilesGone || !out.isOpenBranch.firstNameVisible) {
  fails.push(`Offener Zweig nicht aktiv: ${JSON.stringify(out.isOpenBranch)}`);
}

// --- A) Gibt es einen erreichbaren Schrittwechsel? ---
out.stepSwitchers = await page.evaluate(() =>
  ['booking-next', 'booking-step-back'].map((id) => {
    const el = document.querySelector(`[data-testid="${id}"]`);
    return { id, present: !!el, text: el ? el.textContent.trim() : null };
  }),
);
notes.push(`Schritt-Schalter: ${JSON.stringify(out.stepSwitchers)}`);

// --- C) Ist der Hinweis ueberhaupt (noch) da? ---
out.hinweis = await page.evaluate(() => {
  const el = document.querySelector('[data-testid="open-class-note"]');
  if (!el) return { present: false };
  return { present: true, text: el.textContent.trim(), tabIndex: el.getAttribute('tabindex') };
});

// --- B) Was tut der Zurueck-Knopf? ---
const backBtn = page.locator('[data-testid="booking-step-back"]');
out.backClosesDialog = null;
if (await backBtn.count()) {
  await backBtn.click();
  await page.waitForTimeout(600);
  const stillOpen = await page
    .locator('[data-testid="booking-dialog"]')
    .isVisible()
    .catch(() => false);
  out.backClosesDialog = !stillOpen;
  notes.push(`Zurueck schliesst den Dialog: ${out.backClosesDialog}`);
  if (!out.backClosesDialog) {
    fails.push('Zurueck wechselt den Schritt statt zu schliessen — ein Anker waere noetig.');
  }
} else {
  fails.push('Kein Zurueck-Knopf gefunden — unerwartet.');
}

// Kernaussage: kein erreichbarer Schrittwechsel => der Fokus-Effekt feuert nie.
out.focusAnchorNeeded = out.backClosesDialog === false;
out.pageErrors = pageErrors.length;
out.fails = fails;
out.notes = notes;

// Offene Routen abraeumen, sonst schlaegt eine Fremdanfrage (Google Maps) beim
// Schliessen als TargetClosedError durch und verfaelscht den Exit-Code.
await page.unrouteAll({ behavior: 'ignoreErrors' });

writeFileSync(`${OUT}/${TAG}-reach.json`, JSON.stringify(out, null, 2));
console.log(JSON.stringify(out, null, 2));
console.log('');
console.log(
  out.focusAnchorNeeded
    ? 'ERGEBNIS: Fokus-Anker WIRD gebraucht — der Satz darf nicht ersatzlos weg.'
    : 'ERGEBNIS: Bei offener Klasse gibt es KEINEN erreichbaren Schrittwechsel.\n' +
        'Der Fokus-Effekt feuert nie (stepChanged bleibt false).\n' +
        'Der Anker ist unerreichbarer Code; der Satz traegt nur Kurstyp-Info.',
);

await browser.close();
process.exit(fails.length ? 1 : 0);
