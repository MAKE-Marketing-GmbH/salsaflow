const { chromium } = require('playwright-core');
const BASE = process.env.BASE || 'http://127.0.0.1:4602';
const OUT = process.env.OUT || '/tmp/r210';
require('node:fs').mkdirSync(OUT, { recursive: true });
(async () => {
  const b = await chromium.launch();
  for (const vp of [{t:'m390',width:390,height:844},{t:'d730',width:1440,height:730},{t:'d800',width:1440,height:800}]) {
    // Erstbesuch: Hinweis sichtbar.
    let ctx = await b.newContext({ viewport:{width:vp.width,height:vp.height}, deviceScaleFactor:1 });
    let p = await ctx.newPage();
    await p.goto(BASE + '/', { waitUntil:'networkidle' });
    await p.waitForTimeout(1000);
    await p.screenshot({ path: `${OUT}/${vp.t}-cookie.png`, caret:'hide' });
    await ctx.close();
    // Wiederkehrer: kein Hinweis. Zeigt, dass der Fold ohne die Regel unveraendert bleibt.
    ctx = await b.newContext({ viewport:{width:vp.width,height:vp.height}, deviceScaleFactor:1 });
    await ctx.addInitScript(() => { try { localStorage.setItem('salsaflow-cookie-ok','1'); } catch {} });
    p = await ctx.newPage();
    await p.goto(BASE + '/', { waitUntil:'networkidle' });
    await p.waitForTimeout(1000);
    await p.screenshot({ path: `${OUT}/${vp.t}-accepted.png`, caret:'hide' });
    await ctx.close();
  }
  await b.close();
})();
