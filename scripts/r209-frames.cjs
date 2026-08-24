// R209: Erstframe-Messung gegen den PRODUKTIONS-Build (dist), nicht den Dev-Server.
// Der Dev-Server kompiliert beim ersten Request und verschiebt damit den ersten Paint
// um mehrere hundert Millisekunden — genau in das Fenster, das hier gemessen wird.
// Raphaels Belege stammen von der gebauten Seite, also muss die Messung dorthin.
const { chromium } = require('playwright-core');
const fs = require('node:fs');

const BASE = process.env.BASE || 'http://127.0.0.1:4599';
const OUT = process.env.OUT || '/tmp/r209';
const RUNS = Number(process.env.RUNS || 3);
// Enges Raster im kritischen Fenster: der alte Fade lag zwischen 160 und 700 ms.
const TIMES = [0, 60, 120, 180, 240, 320, 420, 600, 900, 1400];

const VIEWPORTS = [
  { tag: 'd', width: 1440, height: 730 },
  { tag: 'm', width: 390, height: 844 },
];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ args: ['--force-color-profile=srgb'] });

  for (const vp of VIEWPORTS) {
    for (let run = 1; run <= RUNS; run++) {
      // Frischer Kontext pro Durchlauf: kein warmer HTTP- oder Bildcache, der den
      // zweiten Lauf schneller aussehen liesse als den ersten Besuch eines Gastes.
      const ctx = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: 1,
        reducedMotion: 'no-preference',
      });
      const page = await ctx.newPage();
      const shots = [];
      const t0 = Date.now();
      // Nicht auf `load` warten — es geht genau um die Frames DAVOR.
      page.goto(BASE + '/', { waitUntil: 'commit' }).catch(() => {});
      for (const t of TIMES) {
        const wait = t - (Date.now() - t0);
        if (wait > 0) await new Promise((r) => setTimeout(r, wait));
        const file = `${OUT}/${vp.tag}${run}-${String(t).padStart(4, '0')}.png`;
        try {
          await page.screenshot({ path: file, caret: 'hide' });
          shots.push({ t, bytes: fs.statSync(file).size });
        } catch {
          shots.push({ t, bytes: -1 });
        }
      }
      console.log(`${vp.tag}${run}: ` + shots.map((s) => `${s.t}=${s.bytes}`).join(' '));
      await ctx.close();
    }
  }
  await browser.close();
})();
