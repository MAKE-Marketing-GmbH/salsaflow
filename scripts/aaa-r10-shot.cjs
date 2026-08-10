// Verify-Shot Runde 2026-08-09. playwright-core-Bindings ueber das global installierte
// Playwright, Chrome per executablePath /usr/bin/google-chrome (Auftragsvorgabe).
// Aufruf: node scripts/aaa-r10-shot.cjs <tag> [pfad]
const { chromium } = require('/usr/lib/node_modules/playwright');
const fs = require('fs');

const tag = process.argv[2] || 'base';
const route = process.argv[3] || '/';
const OUT = `/tmp/aaa-r10/${tag}`;

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
  for (const [name, w, h] of [
    ['dsk', 1440, 900],
    ['mob', 390, 844],
  ]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    const errs = [];
    page.on('console', (m) => m.type() === 'error' && errs.push(m.text().slice(0, 200)));
    page.on('pageerror', (e) => errs.push('PAGEERROR ' + String(e).slice(0, 200)));
    await page.goto('http://localhost:5173' + route, { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);
    await page.screenshot({ path: `${OUT}/${name}-00-fold.png` });
    await page.evaluate(async () => {
      document.querySelectorAll('img').forEach((i) => { i.loading = 'eager'; i.decoding = 'sync'; });
      const H = document.body.scrollHeight;
      for (let y = 0; y <= H; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 90)); }
      window.scrollTo(0, 0);
    });
    await page.waitForFunction(() => Array.from(document.images).every((i) => i.complete), { timeout: 20000 }).catch(() => {});
    await page.waitForTimeout(700);
    const H = await page.evaluate(() => document.body.scrollHeight);
    console.log(name, 'page-height', H);
    let i = 1;
    for (let y = h; y < H; y += h) {
      await page.evaluate((yy) => window.scrollTo(0, yy), y);
      await page.waitForTimeout(300);
      await page.screenshot({ path: `${OUT}/${name}-${String(i).padStart(2, '0')}-y${y}.png` });
      i++;
    }
    // Ganzseiten-Uebersicht (fuer den Rhythmus-Blick aus der Distanz)
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);
    await page.screenshot({ path: `${OUT}/${name}-full.png`, fullPage: true });
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
    if (errs.length) console.log(name, 'CONSOLE', JSON.stringify(errs.slice(0, 6)));
    await ctx.close();
  }
  await b.close();
})();
