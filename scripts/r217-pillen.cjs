/* R217: misst die Level-Pillen der "Startet bald"-Karten auf /tanzkurse.
   Fuer jede Karte: Index, Stil, Level-Text und die gerechnete Hintergrundfarbe
   der Pille. Der Befund war "Farbe kodiert nichts" — also muss die Messung
   Farbe GEGEN Level und GEGEN Stil zeigen, nicht nur die Farbe zaehlen. */
const { chromium } = require('playwright-core');

const BASE = process.env.R217_BASE ?? 'http://127.0.0.1:4753';

(async () => {
  const browser = await chromium.launch({ executablePath: '/root/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome' });
  for (const vp of [{ w: 1440, h: 730 }, { w: 390, h: 844 }]) {
    const page = await browser.newPage({ viewport: { width: vp.w, height: vp.h } });
    await page.addInitScript(() => {
      localStorage.setItem('salsaflow-cookie-ok', '1');
    });
    await page.goto(`${BASE}/tanzkurse`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);

    const rows = await page.evaluate(() => {
      const cards = [...document.querySelectorAll('a[href*="/kursplan"]')].filter((a) =>
        a.querySelector('img') && a.querySelector('.type-h3'),
      );
      return cards.map((card, i) => {
        const pills = [...card.querySelectorAll('span')].filter((s) => {
          if (s.children.length || !s.textContent.trim()) return false;
          const cs = getComputedStyle(s);
          const r = parseFloat(cs.borderTopLeftRadius) || 0;
          const bg = cs.backgroundColor;
          // Pille = runde Ecken UND eine eigene Fuellung (nicht transparent).
          return r >= 9 && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent';
        });
        const style = card.querySelector('.type-h3')?.textContent?.trim() ?? '';
        return {
          i: i + 1,
          style,
          pills: pills.map((p) => ({
            text: p.textContent.trim(),
            bg: getComputedStyle(p).backgroundColor,
            fg: getComputedStyle(p).color,
          })),
        };
      });
    });

    console.log(`\n=== ${vp.w}x${vp.h} — ${rows.length} Karten ===`);
    for (const r of rows) {
      console.log(`Karte ${String(r.i).padStart(2, '0')}  Stil: ${r.style}`);
      for (const p of r.pills) console.log(`    "${p.text}"  bg=${p.bg}  fg=${p.fg}`);
    }
    const levelBgs = new Set(
      rows.flatMap((r) => r.pills.filter((p) => /stufe|level|flow|open/i.test(p.text)).map((p) => p.bg)),
    );
    console.log(`Level-Pillen: ${levelBgs.size} verschiedene Hintergruende -> ${[...levelBgs].join(' | ')}`);
    await page.close();
  }
  await browser.close();
})();
