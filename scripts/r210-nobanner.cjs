// Gegenprobe: Wie steht der Fold OHNE Cookie-Hinweis (Wiederkehrer, localStorage gesetzt)?
// Trennt "Banner verdeckt" von "passt ohnehin nicht in den Fold".
const { chromium } = require('playwright-core');
(async () => {
  const b = await chromium.launch();
  for (const vp of [{t:'m390',width:390,height:844},{t:'d730',width:1440,height:730},{t:'d800',width:1440,height:800}]) {
    const ctx = await b.newContext({ viewport:{width:vp.width,height:vp.height}, deviceScaleFactor:1 });
    await ctx.addInitScript(() => { try { localStorage.setItem('salsaflow-cookie-ok','1'); } catch {} });
    const p = await ctx.newPage();
    await p.goto('http://127.0.0.1:4600/', { waitUntil:'networkidle' });
    await p.waitForTimeout(900);
    const r = await p.evaluate(() => {
      const fold = document.querySelector('[data-hero-fold]');
      const g = (t) => { const e = [...fold.querySelectorAll('a,dl')].find(x => x.textContent.includes(t)); return e ? Math.round(e.getBoundingClientRect().bottom) : null; };
      return { banner: !!document.querySelector('[data-cookie-banner]'),
               ctaSecBottom: g('Schnupperstunde buchen'), trustBottom: g('Google-Bewertungen'), vh: window.innerHeight };
    });
    const okC = r.ctaSecBottom !== null && r.ctaSecBottom <= r.vh;
    const okT = r.trustBottom !== null && r.trustBottom <= r.vh;
    console.log(`${vp.t} vh=${r.vh} banner=${r.banner}  cta-sec endet ${r.ctaSecBottom} ${okC?'IM Fold':'AUSSERHALB'}  trust endet ${r.trustBottom} ${okT?'IM Fold':'AUSSERHALB'}`);
    await ctx.close();
  }
  await b.close();
})();
