// Viewport-Sicht (1440x900) an definierten Scrollpositionen — so, wie ein Besucher die Seite
// sieht (inkl. sticky-Spalten). Aufruf: node scripts/aaa-r12-view.cjs [tag] [sel...]
const { chromium } = require('playwright-core');
const fs = require('fs');
const TAG = process.argv[2] || 'now';
const SELS = process.argv.slice(3);
const OUT = '/tmp/aaa-r12';
fs.mkdirSync(OUT, { recursive: true });

(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
  const p = await (await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 })).newPage();
  await p.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await p.addStyleTag({ content: '*{animation:none!important;transition:none!important}' });
  await p.evaluate(async () => {
    document.querySelectorAll('img').forEach((i) => { i.loading = 'eager'; });
    const H = document.body.scrollHeight;
    for (let y = 0; y <= H; y += 400) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
    window.scrollTo(0, 0);
  });
  await p.waitForTimeout(900);
  for (const spec of SELS) {
    const [sel, offRaw] = spec.split('@');
    const off = Number(offRaw || 0);
    const y = await p.evaluate(([s, o]) => {
      const el = document.querySelector(s);
      const top = el.getBoundingClientRect().top + scrollY + o;
      window.scrollTo(0, top);
      return Math.round(window.scrollY);
    }, [sel, off]);
    await p.waitForTimeout(350);
    const name = sel.replace(/[^a-z0-9]/gi, '') + (off ? '_' + off : '');
    await p.screenshot({ path: `${OUT}/${TAG}-view-${name}.png` });
    console.log('ok', name, 'scrollY=' + y);
  }
  await b.close();
})();
