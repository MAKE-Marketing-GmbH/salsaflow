const { chromium } = require('playwright-core');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
  const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await p.goto('http://localhost:5173/privatstunden', { waitUntil: 'networkidle' });
  const info = await p.evaluate(() => {
    const out = [];
    for (const el of document.querySelectorAll('button')) {
      if ((el.textContent || '').trim().toLowerCase() === 'de') {
        const r = el.getBoundingClientRect();
        const path = [];
        for (let a = el; a && a !== document.body; a = a.parentElement) path.push(a.tagName + '.' + String(a.className).slice(0, 40));
        out.push({ y: Math.round(r.top + scrollY), x: Math.round(r.left), vis: r.width > 0, path: path.slice(0, 6) });
      }
    }
    return out;
  });
  console.log(JSON.stringify(info, null, 1));
  await b.close();
})();
