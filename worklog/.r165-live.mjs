import { mkdir } from 'node:fs/promises';
import { chromium } from '/usr/lib/node_modules/playwright/index.mjs';

const ROOT = '/root/clients/salsaflow-w1/worklog/shots/S7-ux165';
const BASE = 'http://127.0.0.1:5175';
await mkdir(ROOT, { recursive: true });
const browser = await chromium.launch({
  handleSIGINT: false,
  handleSIGTERM: false,
  handleSIGHUP: false,
});

async function shot(path, name, wait) {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  await page.addInitScript(() => {
    try {
      localStorage.setItem('salsaflow-cookie-ok', '1');
    } catch {
      /* ignore */
    }
  });
  await page.goto(`${BASE}${path}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(wait);
  const imgs = await page.locator('main img').evaluateAll((nodes) =>
    nodes.slice(0, 6).map((n) => {
      const s = getComputedStyle(n);
      const r = n.getBoundingClientRect();
      return {
        src: n.getAttribute('src'),
        op: s.opacity,
        vis: s.visibility,
        w: Math.round(r.width),
        h: Math.round(r.height),
        y: Math.round(r.top),
      };
    }),
  );
  await page.screenshot({ path: `${ROOT}/${name}.png`, timeout: 15000 });
  console.log(JSON.stringify({ name, wait, imgs }, null, 2));
  await page.close();
}

await shot('/tanzkurse/salsa', 'salsa-700', 700);
await shot('/tanzkurse/salsa', 'salsa-2000', 2000);
await shot('/tanzkurse/bachata', 'bachata-700', 700);
await shot('/tanzkurse/bachata', 'bachata-2000', 2000);
await shot('/mehr/partys', 'partys-700', 700);
await shot('/mehr/partys', 'partys-2000', 2000);
await browser.close();
