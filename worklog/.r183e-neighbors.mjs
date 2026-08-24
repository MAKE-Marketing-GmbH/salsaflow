const { chromium } = await import('/usr/lib/node_modules/playwright/index.mjs');
const BASE = 'http://127.0.0.1:5175';
const ROUTES = ['/preise', '/kursplan', '/tanzkurse/salsa', '/tanzkurse/bachata', '/tanzkurse/heels', '/tanzkurse'];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 730 } });
for (const r of ROUTES) {
  const resp = await page.goto(BASE + r, { waitUntil: 'networkidle' });
  await page.waitForTimeout(300);
  const band = await page.evaluate(() => {
    // echtes Medienband = grosses Foto (>=600px breit, >=150px hoch) in main
    const cands = [...document.querySelectorAll('main img')]
      .filter((i) => (i.currentSrc || i.src || '').includes('/photos/'))
      .map((i) => ({ i, r: i.getBoundingClientRect() }))
      .filter((o) => o.r.width >= 600 && o.r.height >= 150);
    if (!cands.length) return null;
    cands.sort((a, b) => a.r.top - b.r.top);
    const { i, r: rc } = cands[0];
    let n = i, hops = 0, radius = 0, at = 'none', wrect = rc;
    while (n && hops < 5) {
      const cs = getComputedStyle(n);
      const br = parseFloat(cs.borderTopLeftRadius) || 0;
      const clips = cs.overflow !== 'visible' || n === i;
      if (br > 0 && clips) { radius = br; at = n === i ? 'img' : n.tagName.toLowerCase(); wrect = n.getBoundingClientRect(); break; }
      n = n.parentElement; hops++;
    }
    return {
      src: new URL(i.currentSrc || i.src, location.origin).pathname.split('/').pop(),
      radius: radius + 'px', at,
      x: Math.round(wrect.x), w: Math.round(wrect.width),
    };
  });
  console.log(r.padEnd(22), resp.status(), JSON.stringify(band));
}
await browser.close();
