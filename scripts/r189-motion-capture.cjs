// R189: Motion-Beweis-Capture. Anders als r188-capture.cjs laeuft dieses Skript MIT
// Bewegung (reducedMotion 'no-preference') und schiesst waehrend eines echten,
// schrittweisen Scrolls. Nur so wird sichtbar, ob ein Reveal zuendet oder ob die Seite
// beim Scrollen einfach still steht.
//
// Aufruf: node scripts/r189-motion-capture.cjs <outdir> [route ...]
const { chromium } = require('playwright-core');
const fs = require('fs');

const BASE = process.env.SF_BASE || 'http://127.0.0.1:5175';
const OUT = process.argv[2] || 'worklog/shots/R189/before';
const ROUTES = process.argv.slice(3).length ? process.argv.slice(3) : ['/', '/kursplan'];

/* Schrittweise scrollen und dabei schiessen. Der Schritt ist kleiner als ein Viewport,
   damit ein Reveal, der bei -8% zuendet, garantiert in mindestens einem Bild halb
   fertig ist. Zwischen Sprung und Bild liegt bewusst nur wenig Zeit: bei 450ms
   Reveal-Dauer faengt 220ms die Bewegung mitten drin ab, nicht erst im Endzustand. */
const STEP_FACTOR = 0.6;
const SETTLE_MS = 220;

(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const manifest = [];
  const failures = [];
  for (const route of ROUTES) {
    const slug = route === '/' ? 'home' : route.replace(/^\//, '').replace(/\//g, '_');
    for (const [prefix, viewport] of [['d', { width: 1440, height: 900 }], ['m', { width: 390, height: 844 }]]) {
      const ctx = await browser.newContext({
        viewport,
        deviceScaleFactor: 1,
        reducedMotion: 'no-preference',
      });
      const page = await ctx.newPage();
      const errors = [];
      page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 160)); });
      page.on('pageerror', (e) => errors.push(String(e).slice(0, 160)));

      const res = await page.goto(BASE + route, { waitUntil: 'networkidle', timeout: 30000 }).catch(() => null);
      if (!res || res.status() >= 400) {
        const failure = `ERROR ${route} ${prefix} status ${res ? res.status() : 'nav-failed'}`;
        failures.push(failure);
        console.log(failure);
        await ctx.close();
        continue;
      }
      await page.locator('button:has-text("Akzeptieren")').first().click({ timeout: 2500 }).catch(() => {});
      // Bilder eager laden, ABER nicht vorscrollen: ein Vorscroll wuerde jeden
      // `once: true`-Reveal ausloesen und die Seite waere schon fertig animiert.
      await page.evaluate(() => {
        document.querySelectorAll('img').forEach((i) => { i.loading = 'eager'; i.decoding = 'sync'; });
      });
      await page.waitForTimeout(600);

      const dir = `${OUT}/${slug}`;
      fs.mkdirSync(dir, { recursive: true });

      const pageHeight = await page.evaluate(() => document.body.scrollHeight);
      const step = Math.round(viewport.height * STEP_FACTOR);
      const maxScroll = Math.max(0, pageHeight - viewport.height);
      const positions = [];
      for (let y = 0; y < maxScroll; y += step) positions.push(y);
      // Letztes Bild immer exakt am Seitenende. Kein stiller 18-Shot-Deckel mehr: Der alte
      // Deckel beendete die mobile Startseite beim Preis und liess FAQ, Studio und Footer
      // unbelegt. Ein Scroll-Beweis muss die ganze Route zeigen.
      if (positions.at(-1) !== maxScroll) positions.push(maxScroll);

      for (const [index, y] of positions.entries()) {
        await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), y);
        await page.waitForTimeout(SETTLE_MS);
        const file = `${dir}/${prefix}-${String(index).padStart(2, '0')}.png`;
        await page.screenshot({ path: file });
        manifest.push({ route, viewport: prefix, y, file });
      }

      if (errors.length) {
        const failure = `CONSOLE ${route} ${prefix}: ${errors.slice(0, 3).join(' | ')}`;
        failures.push(failure);
        console.log(failure);
      }
      await ctx.close();
    }
    console.log(`OK ${route}`);
  }
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(`${OUT}/manifest.json`, JSON.stringify(manifest, null, 2));
  console.log(`DONE ${manifest.length} shots -> ${OUT}`);
  await browser.close();

  if (!manifest.length || failures.length) {
    throw new Error(`Motion-Capture fehlgeschlagen: ${JSON.stringify(failures)}`);
  }
})();
