/* R218: prueft die vier gemeldeten CTAs als ECHTEN Klick von der Ursprungsseite aus,
   nicht als Direktaufruf der URL. Der Unterschied ist hier entscheidend: bei einem
   Direktaufruf laeuft der useEffect beim Mount, bei einer SPA-Navigation innerhalb
   derselben Seite unter Umstaenden nicht.

   Gemessen wird je Fall: End-URL, scrollY, ob #kontaktformular im Viewport steht,
   und welches Anliegen im Wizard vorbelegt ist. */
const { chromium } = require('playwright-core');

const BASE = process.env.R218_BASE ?? 'http://127.0.0.1:4753';
const EXE = '/root/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome';

const FAELLE = [
  { von: '/events', text: /Nächste Events ansehen/i },
  { von: '/events', text: /Workshops ansehen/i },
  { von: '/kontakt/standort-raumvermietung', text: /Raumvermietung anfragen/i },
  { von: '/kontakt/standort-raumvermietung', text: /Raum anfragen/i },
];

async function zustand(page) {
  return page.evaluate(() => {
    const form = document.getElementById('kontaktformular');
    const box = form?.getBoundingClientRect();
    const gewaehlt = [...document.querySelectorAll('button, [role="button"]')]
      .filter((b) => {
        const bg = getComputedStyle(b).backgroundColor;
        return bg === 'rgb(173, 24, 39)' && /Events|Raum|Schnupper|Privat|Gutschein|Shows|Allgemeine/.test(b.textContent);
      })
      .map((b) => b.textContent.trim().split('\n')[0]);
    return {
      url: location.pathname + location.hash,
      scrollY: Math.round(scrollY),
      formImViewport: box ? box.top < innerHeight && box.bottom > 0 : false,
      formTop: box ? Math.round(box.top) : null,
      vorbelegt: gewaehlt,
    };
  });
}

(async () => {
  const browser = await chromium.launch({ executablePath: EXE });

  for (const f of FAELLE) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.addInitScript(() => localStorage.setItem('salsaflow-cookie-ok', '1'));
    await page.goto(`${BASE}${f.von}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);

    const link = page.locator('a', { hasText: f.text }).first();
    const n = await link.count();
    if (!n) {
      console.log(`KLICK  ${f.von} "${f.text.source}" -> LINK NICHT GEFUNDEN`);
      await page.close();
      continue;
    }
    const href = await link.getAttribute('href');
    await link.scrollIntoViewIfNeeded();
    await link.click();
    await page.waitForTimeout(1500);
    const z = await zustand(page);
    console.log(`KLICK  ${f.von} "${f.text.source}" (href=${href})`);
    console.log(`       -> ${JSON.stringify(z)}`);
    await page.close();
  }

  // Direktaufruf zum Vergleich: laeuft der useEffect beim Mount sauber?
  for (const hash of ['#events', '#raumvermietung', '#mieten', '#geschenkgutschein']) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.addInitScript(() => localStorage.setItem('salsaflow-cookie-ok', '1'));
    await page.goto(`${BASE}/kontakt${hash}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);
    console.log(`DIREKT /kontakt${hash} -> ${JSON.stringify(await zustand(page))}`);
    await page.close();
  }

  await browser.close();
})();
