// R187: Fold-Belege nach den zwei freigegebenen Zuschnitt-Korrekturen.
// /team auf `center 38%`, /events-workshops/eventkalender auf `center 22%`.
// Ein Browser je Route (ein Browser ueber viele Seiten stirbt).
import playwright from '/usr/lib/node_modules/playwright/index.js';
import { mkdirSync } from 'node:fs';

const { chromium } = playwright;

const BASIS = 'http://127.0.0.1:5175';
const ZIEL = '/root/clients/salsaflow-w1/worklog/shots/R187-crop-fix';
const ROUTEN = [
  { pfad: '/team', name: 'team' },
  { pfad: '/events-workshops/eventkalender', name: 'eventkalender' },
];
const VIEWPORTS = [
  { w: 1440, h: 730 },
  { w: 390, h: 844 },
];

mkdirSync(ZIEL, { recursive: true });

for (const route of ROUTEN) {
  for (const vp of VIEWPORTS) {
    const browser = await chromium.launch();
    const page = await browser.newPage({
      viewport: { width: vp.w, height: vp.h },
      deviceScaleFactor: 2,
    });
    await page.goto(`${BASIS}${route.pfad}`, { waitUntil: 'networkidle', timeout: 45000 });
    const titel = await page.title();
    if (!titel.includes('Salsaflow')) throw new Error(`Falscher Port: ${titel}`);
    await page.waitForTimeout(1200);
    const datei = `${ZIEL}/${route.name}-${vp.w}.png`;
    await page.screenshot({ path: datei });
    console.log(`${datei} — ${titel.slice(0, 40)}`);
    await browser.close();
  }
}
