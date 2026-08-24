// R211: Belegt die Entfernung der Events-Leiste. Schiesst /events in denselben
// Schnitten wie Raphaels Vorher-Beleg (CRITIC-0823-2148) und misst zusaetzlich im
// DOM, ob die Leiste wirklich weg ist — ein Screenshot allein zeigt nur, dass ich
// an der richtigen Stelle hingesehen habe, nicht dass nichts uebrig blieb.
const { chromium } = require('playwright-core');
const fs = require('node:fs');

const BASE = process.env.BASE || 'http://127.0.0.1:4712';
const OUT = process.env.OUT || '/root/clients/salsaflow-w1/worklog/shots/R211-nachher';

const VIEWPORTS = [
  { tag: '1440', width: 1440, height: 900 },
  { tag: '390', width: 390, height: 844 },
];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();

  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
    });
    const page = await ctx.newPage();
    // Cookie-Hinweis vorab wegnehmen: er gehoert zu R210 und wuerde den Blick auf
    // die Stelle unter dem Band verdecken.
    await page.addInitScript(() => {
      // Key und Wert am Code nachgeschlagen (CookieBanner.tsx:18/46), nicht geraten.
      localStorage.setItem('salsaflow-cookie-ok', '1');
    });
    await page.goto(BASE + '/events', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);

    await page.screenshot({ path: `${OUT}/events-${vp.tag}-top.png`, caret: 'hide' });

    // Der Bereich direkt unter dem Foto-Band — genau Raphaels Ausschnitt.
    const band = await page.evaluate(() => {
      const img = document.querySelector('main img[src*="events-hero"]');
      if (!img) return null;
      const r = img.getBoundingClientRect();
      return { bottom: Math.round(r.bottom + window.scrollY) };
    });
    if (band) {
      await page.evaluate((y) => window.scrollTo(0, Math.max(0, y - 260)), band.bottom);
      await page.waitForTimeout(600);
      await page.screenshot({ path: `${OUT}/events-${vp.tag}-below-hero.png`, caret: 'hide' });
    }

    // Messung statt Augenmass: Steht irgendwo auf der Seite noch die Leisten-Form
    // (ein dl/Grid mit genau den drei Werten)? Und existieren die Werte weiter
    // unten im Fliesstext noch, wie vor dem Loeschen geprueft?
    const check = await page.evaluate(() => {
      const norm = (s) => (s || '').replace(/\s+/g, ' ').trim();
      const leiste = [...document.querySelectorAll('dl, ul')].filter((el) => {
        const t = norm(el.textContent);
        return /1\.\s*3\.\s*5\./.test(t) && /DJs/.test(t) && /Basel SBB/.test(t) && t.length < 120;
      });
      const body = norm(document.body.textContent);
      return {
        leistenTreffer: leiste.map((el) => ({
          tag: el.tagName,
          txt: norm(el.textContent).slice(0, 90),
          y: Math.round(el.getBoundingClientRect().top + window.scrollY),
        })),
        nackteZahlen: (body.match(/1\.\s*3\.\s*5\./g) || []).length,
        ausgeschrieben: /Jeden 1\., 3\. und 5\. Freitag/.test(body),
        basel: (body.match(/Basel SBB/g) || []).length,
      };
    });

    console.log(`\n=== ${vp.tag} (${vp.width}x${vp.height}) ===`);
    console.log('  Band-Unterkante y:', band ? band.bottom : 'Bild nicht gefunden');
    console.log('  Leisten-Form gefunden:', check.leistenTreffer.length);
    for (const h of check.leistenTreffer) console.log(`    <${h.tag}> y${h.y} "${h.txt}"`);
    console.log('  nackte "1. 3. 5."-Vorkommen:', check.nackteZahlen);
    console.log('  ausgeschriebener Termin vorhanden:', check.ausgeschrieben);
    console.log('  "Basel SBB"-Vorkommen:', check.basel);

    await ctx.close();
  }
  await browser.close();
})();
