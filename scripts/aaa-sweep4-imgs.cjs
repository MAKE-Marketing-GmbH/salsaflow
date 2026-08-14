// Element-Screenshots aller grossen Bilder auf den 4 Sweep-Seiten (Kopf-Check).
// Rein lesend. Aufruf: node scripts/aaa-sweep4-imgs.cjs [breite]
const { chromium } = require('playwright-core');
const PAGES = ['/privatstunden', '/events', '/mehr/partys', '/mehr/collabs'];
const W = Number(process.argv[2] || 390);

(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
  const ctx = await b.newContext({ viewport: { width: W, height: 900 }, deviceScaleFactor: 1 });
  for (const path of PAGES) {
    const p = await ctx.newPage();
    await p.goto('http://localhost:5173' + path, { waitUntil: 'networkidle' });
    await p.addStyleTag({ content: '*{animation:none!important;transition:none!important}[data-reveal]{opacity:1!important;transform:none!important}' });
    await p.evaluate(async () => {
      document.querySelectorAll('img').forEach((i) => { i.loading = 'eager'; });
      const H = document.body.scrollHeight;
      for (let y = 0; y <= H; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
      window.scrollTo(0, 0);
    });
    await p.waitForTimeout(500);
    const imgs = await p.locator('img').all();
    let n = 0;
    for (const img of imgs) {
      const box = await img.boundingBox();
      if (!box || box.width < 100 || box.height < 80) continue;
      const src = await img.getAttribute('src');
      const name = (src || 'x').split('/').pop().replace(/\.\w+$/, '').slice(0, 30);
      await img.scrollIntoViewIfNeeded();
      await p.waitForTimeout(150);
      await img.screenshot({ path: `/tmp/sweep4img-${path.replace(/\//g, '_')}-${n}-${name}-${W}.png` });
      n++;
    }
    console.log(`${path}: ${n} Bilder`);
    await p.close();
  }
  await b.close();
})();
