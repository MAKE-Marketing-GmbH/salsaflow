// Runde r13: Home-Sektionen mobil (390px) einzeln. Rein lesend.
const { chromium } = require('playwright-core');
const fs = require('fs');
const TAG = process.argv[2] || 'now';
const OUT = process.argv[3] || '/tmp/r13m';
fs.mkdirSync(OUT, { recursive: true });

(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
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
    const main = document.querySelector('main');
    return [...main.children].map((el, i) => {
      const r = el.getBoundingClientRect();
      return { i, id: el.id || '', top: Math.round(r.top + scrollY), h: Math.round(r.height) };
    });
  });
  for (const s of secs) {
    if (s.h < 20) continue;
    await p.screenshot({
      path: `${OUT}/${TAG}-${String(s.i).padStart(2, '0')}-${s.id || 'sec'}.png`,
      fullPage: true, clip: { x: 0, y: s.top, width: 390, height: Math.min(s.h, 4000) },
    });
  }
  console.log(JSON.stringify(secs));
  await b.close();
})();
