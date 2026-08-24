// R163 Motion-Shots: Collabs + Partys, Fold Desktop 1440 und Mobil 390.
// Cookie-Init vor dem ersten Frame, damit kein Banner den Fold frisst.
import { mkdir } from 'node:fs/promises';
import { chromium } from '/usr/lib/node_modules/playwright/index.mjs';

const ROOT = '/root/clients/salsaflow-w1/worklog/shots/S7-ux163-motion';
const mode = process.argv[2] === 'vorher' ? 'vorher' : 'nachher';
const OUT = mode === 'vorher' ? `${ROOT}/vorher` : ROOT;

const browser = await chromium.launch({
  handleSIGINT: false,
  handleSIGTERM: false,
  handleSIGHUP: false,
});

await mkdir(OUT, { recursive: true });

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
  await page.getByRole('heading', { level: 1 }).first().waitFor({ state: 'visible', timeout: 20000 });
  // Hero-Reveal laeuft ueber animate="show" beim Mount. Bilder erst dekodieren lassen,
  // sonst zeigt der Fold ein leeres Band.
  await page.evaluate(async () => {
    const imgs = Array.from(document.images);
    await Promise.all(
      imgs.map((i) => (i.complete ? Promise.resolve() : i.decode().catch(() => {}))),
    );
  });
  await page.waitForTimeout(1100);
}

async function desk(path, name) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  await openPage(page, path);
  await page.screenshot({ path: `${OUT}/${name}`, timeout: 15000 });
  await page.close();
}

async function mob(path, name) {
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  await openPage(page, path);
  await page.screenshot({ path: `${OUT}/${name}`, timeout: 15000 });
  await page.close();
}

await desk('/mehr/collabs', 'collabs-desktop-1440.png');
await mob('/mehr/collabs', 'collabs-mobil-390.png');
await desk('/mehr/partys', 'partys-desktop-1440.png');
await mob('/mehr/partys', 'partys-mobil-390.png');

await browser.close();
console.log(mode === 'vorher' ? 'SHOTS_VORHER_OK' : 'SHOTS_OK');
