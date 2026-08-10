// Runde r13: Home-Sektionen einzeln + Gesamtbild. Rein lesend.
// Aufruf: node scripts/aaa-r13-shot.cjs <tag> <outdir>
const { chromium } = require('playwright-core');
const fs = require('fs');
const TAG = process.argv[2] || 'now';
const OUT = process.argv[3] || '/tmp/aaa-r13';
fs.mkdirSync(OUT, { recursive: true });

(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  await p.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await p.addStyleTag({ content: '*{animation:none!important;transition:none!important}[data-reveal]{opacity:1!important;transform:none!important}' });
  await p.evaluate(async () => {
    document.querySelectorAll('img').forEach((i) => { i.loading = 'eager'; });
    const H = document.body.scrollHeight;
    for (let y = 0; y <= H; y += 400) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 70)); }
    window.scrollTo(0, 0);
  });
  await p.waitForTimeout(1500);

  const secs = await p.evaluate(() => {
    const main = document.querySelector('main') || document.body;
    return [...main.children].map((el, i) => {
      const r = el.getBoundingClientRect();
      return {
        i, tag: el.tagName, id: el.id || '',
        cls: (el.className || '').toString().slice(0, 90),
        top: Math.round(r.top + scrollY), bot: Math.round(r.bottom + scrollY), h: Math.round(r.height),
      };
    });
  });
  console.log(JSON.stringify(secs, null, 1));

  for (const s of secs) {
    if (s.h < 20) continue;
    const name = `${String(s.i).padStart(2, '0')}-${s.id || s.tag.toLowerCase()}`;
    await p.screenshot({
      path: `${OUT}/${TAG}-${name}.png`, fullPage: true,
      clip: { x: 0, y: s.top, width: 1440, height: Math.min(s.h, 4000) },
    });
  }
  await b.close();
})();
