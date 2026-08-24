/* R219-Belegbilder: drei Fehlerfaelle plus Gegentest, je 1440 und 390.
   Aufgenommen wird der Kontakt-Schritt nach dem Absendeversuch, damit Meldung
   und markiertes Feld in einem Bild stehen.

   Server: scripts/r217-serve.cjs (dist + /api-Proxy auf 8787). */
const { chromium } = require('playwright-core');

const BASE = process.env.R219_BASE ?? 'http://127.0.0.1:4753';
const OUT = process.env.R219_OUT ?? '/root/clients/salsaflow-w1/worklog/shots/R219';
const EXE = '/root/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome';

const FAELLE = [
  { id: 'a-name-fehlt', name: '', phone: '', email: '' },
  { id: 'b-kontaktweg-fehlt', name: 'Testperson Critic', phone: '', email: '' },
  { id: 'c-mail-kaputt', name: 'Testperson Critic', phone: '', email: 'keine-mail-adresse' },
  { id: 'd-gegentest-consent', name: 'Testperson Critic', phone: '079 123 45 67', email: '' },
];

(async () => {
  const browser = await chromium.launch({ executablePath: EXE });
  for (const w of [1440, 390]) {
    for (const f of FAELLE) {
      const page = await browser.newPage({ viewport: { width: w, height: w === 390 ? 844 : 900 } });
      await page.addInitScript(() => localStorage.setItem('salsaflow-cookie-ok', '1'));
      await page.goto(`${BASE}/kontakt`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1200);
      await page.locator('input[name="topic"]').first().check({ force: true });
      await page.waitForTimeout(400);
      for (let i = 0; i < 2; i++) {
        await page.getByTestId('inquiry-next').click();
        await page.waitForTimeout(600);
      }
      if (f.name) await page.getByTestId('contact-name').fill(f.name);
      if (f.phone) await page.locator('input[type="tel"]').first().fill(f.phone);
      if (f.email) await page.getByTestId('contact-email').fill(f.email);
      await page.getByTestId('contact-submit').click();
      await page.waitForTimeout(900);
      // Auf die Felder scrollen: die Meldezeile steht unter dem Formular.
      await page.getByTestId('contact-name').scrollIntoViewIfNeeded();
      await page.waitForTimeout(400);
      const pfad = `${OUT}/${f.id}-${w}.png`;
      await page.screenshot({ path: pfad, animations: 'disabled', caret: 'hide' });
      console.log(pfad);
      await page.close();
    }
  }
  await browser.close();
})();
