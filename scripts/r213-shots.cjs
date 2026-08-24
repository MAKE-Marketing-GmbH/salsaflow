const { chromium } = require('playwright-core');
const fs = require('node:fs');
const BASE = process.env.BASE || 'http://127.0.0.1:4718';
const OUT = process.env.OUT || '/root/clients/salsaflow-w1/worklog/shots/R213-nachher';
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch();
  // Team im Fokus; die tight-Schwestern als Gegenprobe, dass der Opt-in-Schalter
  // sie nicht mitbewegt hat.
  const jobs = [
    { route: '/team', tag: 'team-1440', w: 1440, h: 900 },
    { route: '/team', tag: 'team-1440x730', w: 1440, h: 730 },
    { route: '/team', tag: 'team-390', w: 390, h: 844 },
    { route: '/tanzkurse/salsa', tag: 'salsa-1440', w: 1440, h: 900 },
    { route: '/events', tag: 'events-1440', w: 1440, h: 900 },
  ];
  for (const j of jobs) {
    const ctx = await b.newContext({ viewport: { width: j.w, height: j.h }, deviceScaleFactor: 1 });
    const p = await ctx.newPage();
    await p.addInitScript(() => localStorage.setItem('salsaflow-cookie-ok', '1'));
    await p.goto(BASE + j.route, { waitUntil: 'networkidle' });
    await p.waitForTimeout(1300);
    await p.screenshot({ path: `${OUT}/${j.tag}-fold0.png`, caret: 'hide' });
    console.log('shot', j.tag);
    await ctx.close();
  }
  await b.close();
})();
