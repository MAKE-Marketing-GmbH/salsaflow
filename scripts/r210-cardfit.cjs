// Sitzt die Hinweiskarte selbst vollstaendig im Viewport? Kritiker-Befund d730.
const { chromium } = require('playwright-core');
const BASE = process.env.BASE || 'http://127.0.0.1:4602';
(async () => {
  const b = await chromium.launch();
  for (const h of [640, 700, 730, 760, 800, 900]) {
    const ctx = await b.newContext({ viewport:{width:1440,height:h}, deviceScaleFactor:1 });
    const p = await ctx.newPage();
    await p.goto(BASE + '/', { waitUntil:'networkidle' });
    await p.waitForTimeout(800);
    const r = await p.evaluate(() => {
      const card = document.querySelector('[data-cookie-banner]')?.firstElementChild;
      const btn = document.querySelector('[data-testid="cookie-accept"]');
      if (!card) return null;
      const c = card.getBoundingClientRect(), bt = btn.getBoundingClientRect();
      return { cardBottom: Math.round(c.bottom), btnBottom: Math.round(bt.bottom), vh: window.innerHeight };
    });
    const over = r.cardBottom - r.vh;
    console.log(`1440x${h}: Kartenunterkante ${r.cardBottom} vs vh ${r.vh} -> ${over > 0 ? `${over}px ABGESCHNITTEN` : 'vollstaendig'}   Knopf endet ${r.btnBottom} ${r.btnBottom <= r.vh ? 'ok' : 'AUSSERHALB'}`);
    await ctx.close();
  }
  await b.close();
})();
