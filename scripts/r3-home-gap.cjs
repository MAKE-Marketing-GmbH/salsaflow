// Misst die Leerstrecke zwischen dem letzten sichtbaren Inhalt im dunklen Events-Block
// und dem ersten Inhalt der Folge-Sektion (Befund d-07 "tote weisse Totzone").
const { chromium } = require('playwright-core');

(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
  for (const vp of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    const ctx = await b.newContext({ viewport: vp, reducedMotion: 'reduce' });
    const p = await ctx.newPage();
    await p.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
    await p.waitForSelector('#events', { state: 'attached', timeout: 15000 });
    await p.evaluate(async () => {
      const h = document.body.scrollHeight;
      for (let y = 0; y <= h; y += 600) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 40));
      }
      const ev = document.querySelector('#events');
      ev.scrollIntoView({ block: 'end' });
    });
    await p.waitForTimeout(700);
    const r = await p.evaluate(() => {
      const box = (el) => {
        const rect = el.getBoundingClientRect();
        return { top: rect.top + window.scrollY, bottom: rect.bottom + window.scrollY };
      };
      const deepest = (root, pick) => {
        let best = null;
        root.querySelectorAll('h1,h2,h3,p,li,a,button,dt,dd,img,figure,span').forEach((el) => {
          const r = el.getBoundingClientRect();
          if (r.width === 0 || r.height === 0) return;
          const b = box(el);
          if (!best || pick(b, best)) best = b;
        });
        return best;
      };
      const ev = document.querySelector('#events');
      const team = document.querySelector('#team');
      const evLast = deepest(ev, (a, b) => a.bottom > b.bottom);
      const teamFirst = deepest(team, (a, b) => a.top < b.top);
      return {
        eventsBottom: Math.round(box(ev).bottom),
        eventsLastContent: Math.round(evLast.bottom),
        darkTail: Math.round(box(ev).bottom - evLast.bottom),
        teamFirstContent: Math.round(teamFirst.top),
        whiteGap: Math.round(teamFirst.top - box(ev).bottom),
        totalGap: Math.round(teamFirst.top - evLast.bottom),
      };
    });
    console.log(vp.width, JSON.stringify(r));
    await ctx.close();
  }
  await b.close();
})();
