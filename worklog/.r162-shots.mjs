import { mkdir } from 'node:fs/promises';
import { chromium } from '/usr/lib/node_modules/playwright/index.mjs';

const ROOT = '/root/clients/salsaflow-w1/worklog/shots/S7-ux162';
const mode = process.argv[2] === 'vorher' ? 'vorher' : 'nachher';
const OUT = mode === 'vorher' ? `${ROOT}/vorher` : ROOT;

const browser = await chromium.launch({
  handleSIGINT: false,
  handleSIGTERM: false,
  handleSIGHUP: false,
});

await mkdir(OUT, { recursive: true });
await mkdir(`${ROOT}/vorher`, { recursive: true });

async function openPage(page, path) {
  await page.addInitScript(() => {
    try {
      localStorage.setItem('salsaflow-cookie-ok', '1');
    } catch {
      /* ignore */
    }
  });
  await page.goto(`http://127.0.0.1:5175${path}`, {
    waitUntil: 'domcontentloaded',
    timeout: 30000,
  });
}

/* Warte, bis die Seite wirklich steht — nicht eine geratene Zahl von Millisekunden.
   Der Pflicht-Shot salsa-mobil-390.png hatte genau diesen Fehler: nach 800 ms war
   der Reveal des Heros noch mitten in der Bewegung (Lead halb transparent, CTAs und
   Foto noch nicht gezeichnet). Das sah aus wie ein kaputter Hero, war aber ein zu
   frueh gedrueckter Ausloeser. Darum jetzt vier echte Bedingungen:
   Netz ruhig, Schriften geladen, alle Bilder im Blick fertig dekodiert, und
   zuletzt mehrere Frames ohne Bewegung in opacity/transform. */
async function settle(page) {
  /* load zuerst: nach domcontentloaded taucht die SPA den Ausfuehrungs-Kontext
     noch einmal weg («Execution context was destroyed»), und evaluate stirbt. */
  await page.waitForLoadState('load', { timeout: 20000 }).catch(() => {});
  await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
  await page.evaluate(async () => {
    await document.fonts.ready;
    const imgs = [...document.images].filter((img) => {
      const r = img.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    });
    await Promise.all(
      imgs.map((img) =>
        img.complete && img.naturalWidth > 0
          ? img.decode().catch(() => {})
          : new Promise((res) => {
              img.addEventListener('load', res, { once: true });
              img.addEventListener('error', res, { once: true });
              setTimeout(res, 8000);
            }),
      ),
    );
    /* Framer-Motion schreibt bis zum Ende des Reveals in transform/opacity. Mehrere
       ruhige Frames in Folge heissen: die Bewegung ist vorbei. */
    const frame = () => new Promise((res) => requestAnimationFrame(() => res()));
    const stamp = () =>
      [...document.querySelectorAll('main *')]
        .slice(0, 400)
        .map((el) => {
          const s = getComputedStyle(el);
          return `${s.opacity}|${s.transform}`;
        })
        .join(',');
    let last = stamp();
    let quiet = 0;
    /* 8 ruhige Frames statt 2. Der Reveal laeuft nach dem Scrollen erst an: mit nur
       zwei Frames traf der Ausloeser die Stille VOR dem Start und der Desktop-Shot
       zeigte die Termine halb transparent. Acht Frames ueberbruecken den Anlauf. */
    for (let i = 0; i < 240 && quiet < 8; i += 1) {
      await frame();
      const now = stamp();
      quiet = now === last ? quiet + 1 : 0;
      last = now;
    }
  });
}

{
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  await openPage(page, '/tanzkurse/salsa');
  await page.getByRole('heading', { level: 1 }).first().waitFor({ state: 'visible', timeout: 20000 });
  await settle(page);
  await page.screenshot({ path: `${OUT}/salsa-desktop-1440.png`, timeout: 15000 });
  await page.evaluate(() => window.scrollTo(0, 1800));
  await settle(page);
  await page.screenshot({ path: `${OUT}/salsa-y1800.png`, timeout: 15000 });
  if (mode !== 'vorher') {
    const termineDesk = page.getByRole('heading', { name: /tanzen kannst/i }).first();
    await termineDesk.scrollIntoViewIfNeeded();
    await page.waitForTimeout(900);
    await page.locator('[data-testid="style-slot"]').first().waitFor({ state: 'visible', timeout: 12000 });
    await settle(page);
    await page.screenshot({ path: `${OUT}/salsa-termine-desktop-1440.png`, timeout: 15000 });
  }
  await page.close();
}

{
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  await openPage(page, '/tanzkurse/salsa');
  await page.getByRole('heading', { level: 1 }).first().waitFor({ state: 'visible', timeout: 20000 });
  await settle(page);
  await page.screenshot({ path: `${OUT}/salsa-mobil-390.png`, timeout: 15000 });
  if (mode !== 'vorher') {
    const termineMob = page.getByRole('heading', { name: /tanzen kannst/i }).first();
    await termineMob.scrollIntoViewIfNeeded();
    await page.waitForTimeout(900);
    await page.locator('[data-testid="style-slot"]').first().waitFor({ state: 'visible', timeout: 12000 });
    await settle(page);
    await page.screenshot({ path: `${OUT}/salsa-termine-mobil-390.png`, timeout: 15000 });
  }
  await page.close();
}

/* Beleg-Shot fuer die dritte Route. Die Aufgabe nennt salsa|bachata|heels, aber
   /tanzkurse/heels rendert HeelsView.tsx, nicht StylePage.tsx (pages.tsx Z. 14).
   Dieser Shot haelt fest, was dort heute wirklich steht — mit oder ohne Termine. */
if (mode !== 'vorher') {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  await openPage(page, '/tanzkurse/heels');
  await page.getByRole('heading', { level: 1 }).first().waitFor({ state: 'visible', timeout: 20000 });
  await settle(page);
  const heelsSlots = await page.locator('[data-testid="style-slot"]').count();
  const heelsHead = page.getByRole('heading', { name: /tanzen kannst|can dance/i }).first();
  if (await heelsHead.count()) {
    await heelsHead.scrollIntoViewIfNeeded();
    await page.waitForTimeout(900);
    await settle(page);
  }
  await page.screenshot({ path: `${OUT}/heels-termine-1440.png`, timeout: 15000 });
  console.log(`HEELS_SLOT_ROWS=${heelsSlots}`);
  await page.close();
}

await browser.close();
console.log(mode === 'vorher' ? 'SHOTS_VORHER_OK' : 'SHOTS_OK');
