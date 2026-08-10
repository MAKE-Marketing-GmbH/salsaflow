// Runde r14: greift die lg:sticky-Rails ab. Sticky wirkt nur, wenn der scrollende Nachbar
// hoeher ist als die Rail — sonst ist es eine normale Spalte mit einer wirkungslosen Regel.
// Rein lesend. Aufruf: node scripts/aaa-r14-sticky.cjs
const { chromium } = require('playwright-core');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
  const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await p.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await p.addStyleTag({ content: '*{animation:none!important;transition:none!important}[data-reveal]{opacity:1!important;transform:none!important}' });
  await p.evaluate(async () => {
    const H = document.body.scrollHeight;
    for (let y = 0; y <= H; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 50)); }
    window.scrollTo(0, 0);
  });
  await p.waitForTimeout(800);
  const out = await p.evaluate(() => {
    const res = [];
    for (const el of document.querySelectorAll('*')) {
      if (getComputedStyle(el).position !== 'sticky') continue;
      const sec = el.closest('section');
      const r = el.getBoundingClientRect();
      const sib = [...el.parentElement.children]
        .filter((c) => c !== el)
        .reduce((m, c) => Math.max(m, c.getBoundingClientRect().height), 0);
      res.push({
        sektion: sec ? sec.id || 'section' : '?',
        rail: Math.round(r.height),
        nachbar: Math.round(sib),
        klebt: Math.round(sib) > Math.round(r.height) + 40 ? 'JA' : 'NEIN (Nachbar zu kurz)',
      });
    }
    return res;
  });
  for (const r of out) {
    console.log(r.sektion.padEnd(12), 'rail=' + String(r.rail).padStart(4), 'nachbar=' + String(r.nachbar).padStart(4), '->', r.klebt);
  }
  await b.close();
})();
