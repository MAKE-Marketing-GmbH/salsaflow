const { chromium } = require('playwright-core');
const fs = require('fs');
const BASE = 'http://localhost:5173';
const ROUTES = [['home','/'],['tanzkurse','/tanzkurse'],['events','/events'],['team','/team'],['fotos','/fotos'],['kontakt','/kontakt'],['kursplan','/kursplan'],['impressum','/impressum'],['datenschutz','/datenschutz'],['admin-login','/admin']];
const OUT = '.marathon/e17-shots';
(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  const p = await ctx.newPage();
  const res = [];
  for (const [name, route] of ROUTES) {
    try {
      await p.goto(BASE + route, { waitUntil: 'networkidle', timeout: 25000 });
      await p.evaluate(async () => { document.querySelectorAll('img').forEach((i)=>{i.loading='eager';i.decoding='sync';}); const h=document.body.scrollHeight; for(let y=0;y<=h;y+=700){window.scrollTo(0,y); await new Promise(r=>setTimeout(r,60));} window.scrollTo(0,0); });
      await p.waitForFunction(() => Array.from(document.images).every((i)=>i.complete&&i.naturalWidth>0), { timeout: 15000 }).catch(()=>{});
      await p.waitForTimeout(400);
      const H = await p.evaluate(() => document.body.scrollHeight);
      const slices = Math.min(8, Math.ceil(H/1000));
      for (let s=0; s<slices; s++) { await p.evaluate((y)=>window.scrollTo(0,y), s*1000); await p.waitForTimeout(180); await p.screenshot({ path: `${OUT}/dsk-${name}-s${String(s+1).padStart(2,'0')}.png` }); }
      res.push(`OK dsk-${name} (${slices})`);
    } catch (e) { res.push(`ERR dsk-${name} ${e.message.split('\n')[0]}`); }
  }
  await ctx.close(); await browser.close();
  console.log(res.join('\n'));
})();
