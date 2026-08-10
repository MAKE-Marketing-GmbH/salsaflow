// Headless UI-Smoke (Etappe 14): Kontakt-Seite /kontakt.
// Prueft End-to-End im echten Browser: Formular absenden -> Erfolg + NACHWEISBAR eine neue .eml
// in der Outbox (Browser -> Vite-Proxy -> Hono -> mail.ts). Plus alle Pflicht-Sektionen
// (Location/Raumvermietung/FAQ/Collabs/WhatsApp/Google/Instagram), FAQ-Akkordeon, DE/EN, mobil.
// Headless-Pflicht (Memory): laeuft headless ueber System-Chrome (playwright-core + System-Chrome,
// wie alle ui-smoke-*.cjs). Braucht einen laufenden `npm run dev` (Vite-Proxy /api -> Hono).
const { chromium } = require('playwright-core');
const fs = require('node:fs');
const path = require('node:path');

const BASE = 'http://localhost:5173';
const SHOTS = '.marathon/e14-shots';
const OUTBOX = path.resolve('.data/outbox');
const results = [];
function ok(name, cond, detail = '') {
  results.push({ name, cond: !!cond, detail });
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}${detail ? '  (' + detail + ')' : ''}`);
}
function emlSet() {
  if (!fs.existsSync(OUTBOX)) return new Set();
  return new Set(fs.readdirSync(OUTBOX).filter((f) => f.endsWith('.eml')));
}
function emlWith(token, since) {
  if (!fs.existsSync(OUTBOX)) return [];
  return fs
    .readdirSync(OUTBOX)
    .filter((f) => f.endsWith('.eml') && !since.has(f))
    .filter((f) => fs.readFileSync(path.resolve(OUTBOX, f), 'utf8').includes(token));
}
async function noHOverflow(page) {
  return page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
}

(async () => {
  fs.mkdirSync(SHOTS, { recursive: true });
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const errors = [];
  const page = await browser.newPage({ viewport: { width: 1280, height: 2400 }, reducedMotion: 'reduce' });
  await page.addInitScript(() => localStorage.setItem('salsaflow-cookie-ok', '1'));
  page.on('pageerror', (e) => errors.push('KONTAKT ' + e.message));
  page.on('console', (m) => m.type() === 'error' && errors.push('KONTAKT ' + m.text()));

  try {
    await page.goto(`${BASE}/kontakt`, { waitUntil: 'networkidle' });
    const body = await page.locator('main').innerText();
    // innerText rendert CSS text-transform (Eyebrows sind uppercase) -> case-insensitiv pruefen.
    const bodyL = body.toLowerCase();

    // Pflicht-Sektionen auf /kontakt (DE)
    ok('Sektion Standort (Bahnhof SBB)', bodyL.includes('basel sbb'));
    ok('Sektion Raumvermietung', bodyL.includes('raumvermietung'));
    ok('Kontakt bleibt schlank: FAQ liegt nicht auf /kontakt', !bodyL.includes('häufige fragen'));
    ok('Kontakt bleibt schlank: Collabs liegt nicht auf /kontakt', !body.includes('2332dancewear'));
    ok('Kanal WhatsApp vorhanden', (await page.locator('[data-testid="channel-whatsapp"]').count()) >= 1);
    ok('Kanal Google-Bewertung vorhanden', (await page.locator('[data-testid="channel-google"]').count()) >= 1);
    ok('Kanal Instagram vorhanden', (await page.locator('[data-testid="channel-instagram"]').count()) >= 1);

    // Direkt-Kontakt-Links + Maps + Collab-Link korrekt
    const mailto = await page.locator('a[href^="mailto:info@salsaflow-dc.com"]').count();
    ok('Direkter E-Mail-Link (mailto info@)', mailto >= 1, `${mailto} mailto`);
    const wa = await page.locator('[data-testid="channel-whatsapp"]').getAttribute('href');
    ok('WhatsApp-Link zeigt auf wa.me', !!wa && wa.includes('wa.me'), wa || '');
    const maps = await page.locator('[data-testid="contact-maps"]').getAttribute('href');
    ok('Maps-Link zeigt auf Google Maps', !!maps && maps.includes('google.com/maps'), maps || '');

    // /mehr traegt FAQ + Collabs in der aktuellen Route-Map.
    await page.goto(`${BASE}/mehr`, { waitUntil: 'networkidle' });
    const moreBody = await page.locator('main').innerText();
    const moreBodyL = moreBody.toLowerCase();
    ok('/mehr: FAQ-Sektion vorhanden', moreBodyL.includes('häufige fragen') && moreBodyL.includes('gut zu wissen'));
    ok('/mehr: Collabs (2332dancewear) vorhanden', moreBody.includes('2332dancewear'));
    const collab = await page.locator('a[href*="2332dancewear.com/collections/salsaflow"]').first().getAttribute('href');
    ok('/mehr: Collab-Link -> 2332dancewear/collections/salsaflow', !!collab && collab.includes('2332dancewear.com/collections/salsaflow'), collab || '');
    await page.locator('button[aria-controls^="faq-panel-"]').first().click();
    await page.waitForTimeout(200);
    const isOpen = await page.locator('button[aria-controls^="faq-panel-"]').first().getAttribute('aria-expanded');
    ok('/mehr: FAQ-Akkordeon oeffnet auf Klick', isOpen === 'true');

    await page.goto(`${BASE}/kontakt`, { waitUntil: 'networkidle' });

    await page.screenshot({ path: `${SHOTS}/kontakt-desktop-de.png`, fullPage: true });

    // KERN: Formular absenden -> Erfolg + neue .eml in der Outbox (End-to-End-Nachweis)
    const token = `SMOKE-CONTACT-${Date.now()}`;
    const before = emlSet();
    await page.locator('[data-testid="contact-name"]').fill('Smoke Tester');
    await page.locator('[data-testid="contact-email"]').fill('smoke@example.com');
    await page.locator('[data-testid="contact-message"]').fill(`Automatischer Smoke-Test. Marker ${token}`);
    await page.locator('[data-testid="contact-submit"]').click();
    await page.locator('[data-testid="contact-success"]').waitFor({ timeout: 12000 });
    ok('Formular zeigt Erfolg nach Absenden', true);
    await page.waitForTimeout(400); // Mailversand abschliessen lassen
    const newEml = emlWith(token, before);
    ok('Absenden erzeugt NACHWEISBAR eine neue .eml (info@)', newEml.length === 1, `${newEml.length} neue Mail`);
    if (newEml.length === 1) {
      const content = fs.readFileSync(path.resolve(OUTBOX, newEml[0]), 'utf8');
      ok('Neue Mail geht an info@salsaflow-dc.com', content.includes('To: info@salsaflow-dc.com'));
    } else {
      ok('Neue Mail geht an info@salsaflow-dc.com', false, 'keine eindeutige Mail');
    }

    // Copy-Standard (Regel 069): echte Umlaute, keine ASCII-ae/oe/ue in sichtbaren DE-Texten
    ok('Echte Umlaute (kein ae/oe/ue) in DE-Texten',
      /[äöü]/.test(body) && !/(Haeufige|fuelle|moeglich|Raeume|naechsten|fuer dich)/.test(body));

    // DE/EN-Umschalter
    await page.locator('[data-testid="lang-en"]').first().click();
    await page.waitForTimeout(350);
    const htmlLang = await page.evaluate(() => document.documentElement.lang);
    const bodyEnL = (await page.locator('main').innerText()).toLowerCase();
    ok('DE/EN schaltet (html lang=en)', htmlLang === 'en');
    ok('DE/EN schaltet Inhalt (Room rental)',
      bodyEnL.includes('room rental') || bodyEnL.includes('rent our dance studios'));
    await page.locator('[data-testid="lang-de"]').first().click();
    await page.waitForTimeout(200);

    // Mobil
    await page.setViewportSize({ width: 390, height: 2600 });
    await page.waitForTimeout(300);
    ok('Kontakt mobil: kein horizontaler Ueberlauf (390px)', await noHOverflow(page));
    await page.screenshot({ path: `${SHOTS}/kontakt-mobile-de.png`, fullPage: true });
  } catch (e) {
    ok('Kontakt-Seite laeuft ohne Fehler', false, e.message);
  }
  await page.close();

  ok('Keine Konsolen-/Page-Fehler', errors.length === 0, errors.slice(0, 4).join(' | '));

  await browser.close();
  const passed = results.filter((r) => r.cond).length;
  console.log(`\nVERDICT: ${passed === results.length ? 'PASS' : 'FAIL'} (${passed}/${results.length})`);
  process.exit(passed === results.length ? 0 : 1);
})();
