// Zustands-Shots, die der Standard-Sweep nicht abdeckt: die Cookie-Leiste ist beim
// Erstbesuch OFFEN, und genau in diesem Zustand lag der Fehler der letzten Runde.
// Viewport-Vertrag wie im Sweep: Fold 1440x730 / mobil 390x844, animations disabled.
import { chromium } from '/usr/lib/node_modules/playwright/index.mjs';
import { mkdirSync } from 'node:fs';

const BASE = process.argv[2] ?? 'http://127.0.0.1:5175';
const OUT = '/tmp/r183d-shots';
mkdirSync(OUT, { recursive: true });
const b = await chromium.launch();

for (const [name, vw, vh] of [['desktop-cookie-offen', 1440, 730], ['mobile-cookie-offen', 390, 844]]) {
  const ctx = await b.newContext({ viewport: { width: vw, height: vh } });
  const p = await ctx.newPage();
  await p.goto(`${BASE}/kursplan`, { waitUntil: 'domcontentloaded' });
  await p.waitForSelector('[data-schedule-hero-photo-img]', { timeout: 15000 });
  await p.waitForLoadState('networkidle').catch(() => {});
  await p.waitForTimeout(700);
  const file = `${OUT}/${name}-fold.png`;
  await p.screenshot({ path: file, animations: 'disabled', caret: 'hide' });
  console.log('shot', file);
  await ctx.close();
}
await b.close();
