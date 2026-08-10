// Home-Builder Verify-Shot (Runde 1, 2026-08-07). Nutzt das global installierte Playwright
// (/usr/lib/node_modules/playwright) — im Repo liegt kein playwright-core.
// Aufruf: node scripts/home-shot.cjs <tag>
const { chromium } = require('/usr/lib/node_modules/playwright');
const fs = require('fs');

const BASE = 'http://localhost:5173';
const tag = process.argv[2] || 'base';
const OUT = `/tmp/sf-home/${tag}`;

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch();
  for (const [name, w, h] of [
    ['dsk', 1440, 900],
    ['mob', 390, 844],
  ]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    const errs = [];
    page.on('console', (m) => m.type() === 'error' && errs.push(m.text().slice(0, 200)));
    page.on('pageerror', (e) => errs.push('PAGEERROR ' + String(e).slice(0, 200)));
    await page.goto(BASE + '/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(900);
    await page.screenshot({ path: `${OUT}/${name}-00-fold.png` });
    await page.evaluate(async () => {
      document.querySelectorAll('img').forEach((i) => {
        i.loading = 'eager';
        i.decoding = 'sync';
      });
      const H = document.body.scrollHeight;
      for (let y = 0; y <= H; y += 500) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 90));
      }
      window.scrollTo(0, 0);
    });
    await page
      .waitForFunction(() => Array.from(document.images).every((i) => i.complete), { timeout: 20000 })
      .catch(() => {});
    await page.waitForTimeout(700);
    const H = await page.evaluate(() => document.body.scrollHeight);
    console.log(name, 'page-height', H);
    let i = 1;
    for (let y = h; y < H; y += h) {
      await page.evaluate((yy) => window.scrollTo(0, yy), y);
      await page.waitForTimeout(320);
      await page.screenshot({ path: `${OUT}/${name}-${String(i).padStart(2, '0')}-y${y}.png` });
      i++;
    }
    const map = await page.evaluate(() =>
      Array.from(document.querySelectorAll('main > section')).map((s) => {
        const r = s.getBoundingClientRect();
        const head = s.querySelector('h1,h2');
        return {
          id: s.id || '(no-id)',
          top: Math.round(r.top + window.scrollY),
          h: Math.round(r.height),
          bg: getComputedStyle(s).backgroundColor,
          head: head ? head.textContent.trim().slice(0, 60) : null,
        };
      }),
    );
    console.log(name, JSON.stringify(map));
    const broken = await page.evaluate(() =>
      Array.from(document.images)
        .filter((i) => !i.complete || i.naturalWidth === 0)
        .map((i) => i.currentSrc || i.src),
    );
    console.log(name, 'broken-images', JSON.stringify(broken));
    if (errs.length) console.log(name, 'console-errors', JSON.stringify(errs.slice(0, 8)));
    await ctx.close();
  }
  await b.close();
})();
