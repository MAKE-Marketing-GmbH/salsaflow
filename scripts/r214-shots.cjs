// R214: Screenshots der Levels-Sektion und ihres Nachbarn zum Vergleich.
// Kein fullPage — der Ausschnitt wird ueber scrollTo an die Ueberschrift gelegt,
// damit der Reveal-Zustand echt ist und die Section-Zuordnung lesbar bleibt.
const { chromium } = require('playwright-core');
const fs = require('fs');

const BASE = process.env.BASE || 'http://127.0.0.1:4724';
const OUT = process.env.OUT || '/root/clients/salsaflow-w1/worklog/shots/R214';

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();

  for (const vp of [
    { tag: '1440', width: 1440, height: 900 },
    { tag: '390', width: 390, height: 844 },
  ]) {
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
    });
    const page = await ctx.newPage();
    await page.addInitScript(() => localStorage.setItem('salsaflow-cookie-ok', '1'));
    await page.goto(BASE + '/', { waitUntil: 'networkidle' });
    await page.evaluate(async () => {
      const step = window.innerHeight * 0.8;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 90));
      }
    });

    for (const [name, needle] of [
      ['levels', 'Vom ersten Grundschritt'],
      ['nachbar', 'Finde deinen n'],
    ]) {
      const y = await page.evaluate((needle) => {
        const h = [...document.querySelectorAll('h2,h3')].find((el) =>
          (el.textContent || '').trim().startsWith(needle),
        );
        if (!h) return null;
        // 60px Luft ueber der Ueberschrift, damit der Kopf ganz im Bild ist.
        return h.getBoundingClientRect().top + window.scrollY - 60;
      }, needle);
      if (y === null) {
        console.log(`  ${vp.tag} ${name}: Ueberschrift nicht gefunden`);
        continue;
      }
      await page.evaluate((y) => window.scrollTo(0, y), y);
      await page.waitForTimeout(700);
      const file = `${OUT}/home-${vp.tag}-${name}.png`;
      await page.screenshot({ path: file, animations: 'disabled', caret: 'hide' });
      console.log(`  ${file}  (scrollY=${Math.round(y)})`);
    }
    await ctx.close();
  }
  await browser.close();
})();
