// Etappe 17: Live-Screenshot-Capture (headless System-Chrome).
// Fix Lazy-Load: alle <img> auf eager + komplett durchscrollen + auf
// images.complete warten, sonst zeigen Lazy-Bilder unter dem Fold leere Boxen.
// Mobile als lesbare Viewport-Slices (390x844), Desktop als Full-Page.
const { chromium } = require('playwright-core');
const fs = require('fs');

const BASE = 'http://localhost:5173';
const ROUTES = [
  ['home', '/'], ['tanzkurse', '/tanzkurse'], ['events', '/events'],
  ['team', '/team'], ['fotos', '/fotos'], ['kontakt', '/kontakt'],
  ['kursplan', '/kursplan'], ['impressum', '/impressum'],
  ['datenschutz', '/datenschutz'], ['admin-login', '/admin'],
];
const OUT = '.marathon/e17-shots';

async function prep(page) {
  // Lazy-Bilder zwingen + durchscrollen, damit alles geladen ist.
  await page.evaluate(async () => {
    document.querySelectorAll('img').forEach((i) => { i.loading = 'eager'; i.decoding = 'sync'; });
    const h = document.body.scrollHeight;
    for (let y = 0; y <= h; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
    window.scrollTo(0, 0);
  });
  await page.waitForFunction(() => Array.from(document.images).every((i) => i.complete && i.naturalWidth > 0), { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(500);
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const res = [];

  // Desktop full-page
  const dctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  const dp = await dctx.newPage();
  for (const [name, route] of ROUTES) {
    try {
      await dp.goto(BASE + route, { waitUntil: 'networkidle', timeout: 25000 });
      await prep(dp);
      await dp.screenshot({ path: `${OUT}/desktop-${name}.png`, fullPage: true });
      res.push(`OK desktop-${name}`);
    } catch (e) { res.push(`ERR desktop-${name} ${e.message.split('\n')[0]}`); }
  }
  await dctx.close();

  // Mobile slices (390x844), max 8 Slices/Route
  const mctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, reducedMotion: 'reduce' });
  const mp = await mctx.newPage();
  for (const [name, route] of ROUTES) {
    try {
      await mp.goto(BASE + route, { waitUntil: 'networkidle', timeout: 25000 });
      await prep(mp);
      const H = await mp.evaluate(() => document.body.scrollHeight);
      const slices = Math.min(8, Math.ceil(H / 844));
      for (let s = 0; s < slices; s++) {
        await mp.evaluate((y) => window.scrollTo(0, y), s * 844);
        await mp.waitForTimeout(200);
        await mp.screenshot({ path: `${OUT}/mobile-${name}-s${String(s + 1).padStart(2, '0')}.png` });
      }
      res.push(`OK mobile-${name} (${slices} slices, ${H}px)`);
    } catch (e) { res.push(`ERR mobile-${name} ${e.message.split('\n')[0]}`); }
  }
  await mctx.close();
  await browser.close();
  console.log(res.join('\n'));
})();
