/* R219: misst Fehlertext UND Feldrahmen im Kontakt-Schritt des Wizards.
   Fuenf Faelle, die sich fuer die Person unterschiedlich anfuehlen und heute
   trotzdem denselben Satz bekommen. Gemessen wird je Fall:
   - der sichtbare Text der Meldezeile
   - Rahmenfarbe und aria-invalid je Feld (Vorname, Handy, E-Mail)

   Server: scripts/r217-serve.cjs (dist + /api-Proxy auf 8787). */
const { chromium } = require('playwright-core');

const BASE = process.env.R219_BASE ?? 'http://127.0.0.1:4753';
const EXE = '/root/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome';

const FAELLE = [
  { id: 'a-leer', name: '', phone: '', email: '', privacy: false },
  { id: 'b-nameonly', name: 'Testperson Critic', phone: '', email: '', privacy: false },
  { id: 'c-badmail', name: 'Testperson Critic', phone: '', email: 'keine-mail-adresse', privacy: false },
  { id: 'd-nurkontakt', name: '', phone: '079 123 45 67', email: '', privacy: false },
  { id: 'e-consent', name: 'Testperson Critic', phone: '079 123 45 67', email: '', privacy: false },
];

async function zumKontaktschritt(page) {
  await page.goto(`${BASE}/kontakt`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  // Anliegen per Klick waehlen. Der Weiter-Knopf traegt sonst aria-disabled und
  // Playwright verweigert den Klick.
  await page.locator('input[name="topic"]').first().check({ force: true });
  await page.waitForTimeout(400);
  // Schritt 1 -> 2 -> 3.
  for (let i = 0; i < 2; i++) {
    await page.getByTestId('inquiry-next').click();
    await page.waitForTimeout(600);
  }
}

async function feldzustand(page) {
  return page.evaluate(() => {
    const felder = [...document.querySelectorAll('input[type="text"], input[type="tel"], input[type="email"]')]
      .filter((i) => i.offsetParent !== null);
    return felder.map((i) => {
      const cs = getComputedStyle(i);
      const label = i.closest('label')?.querySelector('span')?.textContent?.trim() ?? '?';
      return {
        feld: label,
        wert: i.value ? 'gefuellt' : 'leer',
        rahmen: cs.borderColor,
        breite: cs.borderWidth,
        ariaInvalid: i.getAttribute('aria-invalid'),
      };
    });
  });
}

(async () => {
  const browser = await chromium.launch({ executablePath: EXE });
  // Beide Viewports: index.css:348-352 loescht unter 640px jeden box-shadow in
  // `main`. Was auf 1440 wirkt, kann auf 390 still weg sein (R217-Falle).
  const breite = Number(process.env.R219_W ?? 1440);
  for (const f of FAELLE) {
    const page = await browser.newPage({ viewport: { width: breite, height: breite === 390 ? 844 : 900 } });
    await page.addInitScript(() => localStorage.setItem('salsaflow-cookie-ok', '1'));
    await zumKontaktschritt(page);

    if (f.name) await page.getByTestId('contact-name').fill(f.name);
    if (f.phone) await page.locator('input[type="tel"]').first().fill(f.phone);
    if (f.email) await page.getByTestId('contact-email').fill(f.email);
    if (f.privacy) await page.locator('input[type="checkbox"]').first().check();

    await page.getByTestId('contact-submit').click();
    await page.waitForTimeout(900);

    const text = await page.locator('#inquiry-error').first().textContent().catch(() => null);
    console.log(`\n=== ${f.id} (name=${f.name ? 'ja' : 'nein'} handy=${f.phone ? 'ja' : 'nein'} mail=${f.email || 'leer'}) ===`);
    console.log(`  MELDUNG: ${text ? text.trim() : '(keine)'}`);
    for (const z of await feldzustand(page)) {
      console.log(`  ${z.feld.padEnd(10)} ${z.wert.padEnd(9)} rahmen=${z.rahmen} ${z.breite.padEnd(4)} aria-invalid=${z.ariaInvalid}`);
    }
    await page.close();
  }
  await browser.close();
})();
