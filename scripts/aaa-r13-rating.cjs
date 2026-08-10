// Runde r13: Rating-Cluster in #community mobil vermessen + Ausschnitt. Rein lesend.
const { chromium } = require('playwright-core');
const fs = require('fs');
const TAG = process.argv[2] || 'now';
const OUT = process.argv[3] || '/tmp/r13m';
const W = Number(process.argv[4] || 390);
fs.mkdirSync(OUT, { recursive: true });

(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
  const ctx = await b.newContext({ viewport: { width: W, height: 844 }, deviceScaleFactor: 2, isMobile: W < 700, hasTouch: W < 700 });
  const p = await ctx.newPage();
  await p.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await p.addStyleTag({ content: '*{animation:none!important;transition:none!important}[data-reveal]{opacity:1!important;transform:none!important}' });
  await p.evaluate(async () => {
    document.querySelectorAll('img').forEach((i) => { i.loading = 'eager'; });
    const H = document.body.scrollHeight;
    for (let y = 0; y <= H; y += 400) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 70)); }
    window.scrollTo(0, 0);
  });
  await p.waitForTimeout(1200);

  const box = await p.evaluate(() => {
    const c = document.querySelector('#community');
    const r = c.getBoundingClientRect();
    return { y: Math.round(r.top + scrollY), h: 420 };
  });
  await p.screenshot({ path: `${OUT}/${TAG}-rating-${W}.png`, fullPage: true, clip: { x: 0, y: box.y, width: W, height: box.h } });

  const parts = await p.evaluate(() => {
    const c = document.querySelector('#community');
    const out = [];
    c.querySelectorAll('*').forEach((el) => {
      const t = el.textContent.trim();
      if (!/^(4,9|4,9 von 5|· 104 Google-Bewertungen|Alle 104 Bewertungen auf Google)/.test(t)) return;
      if (t.length > 40) return;
      const r = el.getBoundingClientRect();
      out.push({ tag: el.tagName, cls: (el.className || '').toString().slice(0, 70), t: t.slice(0, 40),
        x: Math.round(r.left), y: Math.round(r.top + scrollY), w: Math.round(r.width), h: Math.round(r.height) });
    });
    return out;
  });
  console.log(JSON.stringify(parts, null, 1));
  await b.close();
})();
