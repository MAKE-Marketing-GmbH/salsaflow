// Headless UI-Smoke (Etappe 12): Events-&-Workshops-Seite unter /events.
// Prueft: alle drei Event-Typen (Danceflow Nights, Anniversary Weekend, Floweekend) + Workshops,
// die Eventfrog-Anbindung (CTA fuehrt wirklich zum Eventfrog-Ticketing, neuer Tab), die dunkle
// Danceflow-Sektion-Sprache, DE/EN-Umschaltung, echte Umlaute (Regel 069), Erreichbarkeit ueber die
// Header-Nav und mobile Sauberkeit. Headless-Pflicht (Memory): System-Chrome, kein sichtbares Fenster.
const { chromium } = require('playwright-core');
const fs = require('node:fs');

const ORIGIN = 'http://localhost:5173';
const BASE = `${ORIGIN}/events`;
const SHOTS = '.marathon/e12-shots';
const results = [];
function ok(name, cond, detail = '') {
  results.push({ name, cond: !!cond, detail });
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}${detail ? '  (' + detail + ')' : ''}`);
}

(async () => {
  fs.mkdirSync(SHOTS, { recursive: true });
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 2400 } });
  const badAssets = [];
  page.on('pageerror', (e) => console.log('PAGEERROR:', e.message));
  page.on('console', (m) => {
    if (m.type() === 'error') console.log('CONSOLE.ERROR:', m.text());
  });
  page.on('response', (r) => {
    if (r.status() >= 400 && /\.(jpg|jpeg|png|webp|svg|css|js)(\?|$)/i.test(r.url())) {
      badAssets.push(`${r.status()} ${r.url()}`);
    }
  });

  try {
    await page.goto(BASE, { waitUntil: 'networkidle' });
    await page.locator('#danceflow').waitFor({ timeout: 15000 });

    const bodyDe = await page.locator('body').innerText();
    const deCI = bodyDe.toLowerCase();
    await page.screenshot({ path: `${SHOTS}/01-desktop-de.png`, fullPage: true });

    ok('Seite laedt ohne fehlgeschlagene Assets', badAssets.length === 0, badAssets.join(' | ') || 'keine 4xx/5xx');

    // --- Alle drei Event-Typen + Workshops dargestellt --------------------
    ok('Danceflow Nights dargestellt', deCI.includes('danceflow nights'));
    ok('Anniversary Weekend dargestellt', deCI.includes('anniversary weekend'));
    ok('Floweekend dargestellt', deCI.includes('floweekend'));
    ok('Workshops dargestellt (vor der Danceflow Night)',
      deCI.includes('workshop') && (deCI.includes('vor der danceflow night') || deCI.includes('vor der night')));

    // --- Danceflow-Fakten (Wann/Wo/Musik/Fuer wen) ------------------------
    ok('Danceflow-Fakten sichtbar (1., 3. und 5. Freitag)',
      bodyDe.includes('1., 3. und 5. Freitag'));

    // --- Eventfrog-Anbindung fuehrt korrekt zum Ticketing -----------------
    const cta = page.locator('[data-testid="eventfrog-cta"]');
    const ctaCount = await cta.count();
    ok('Eventfrog-Ticket-CTA vorhanden', ctaCount >= 1, `${ctaCount} CTA(s)`);
    const ctaInfo = await cta.evaluateAll((els) =>
      els.map((e) => ({ href: e.getAttribute('href'), target: e.getAttribute('target'), rel: e.getAttribute('rel') })));
    ok('Jeder Ticket-CTA fuehrt zu Eventfrog (href -> eventfrog)',
      ctaInfo.length > 0 && ctaInfo.every((c) => (c.href || '').toLowerCase().includes('eventfrog')),
      ctaInfo.map((c) => c.href).join(' | '));
    ok('Ticket-CTA oeffnet im neuen Tab + rel=noreferrer',
      ctaInfo.every((c) => c.target === '_blank' && (c.rel || '').includes('noreferrer')));

    // --- Danceflow-Sektion ist jetzt HELL (Geil-Pass v2 2026-07-07, Raphael: Duoton/Dunkel raus) ---
    const dfBg = await page.locator('#danceflow').evaluate((el) => getComputedStyle(el).backgroundColor);
    // Frueher --surface-dark rgb(17,17,17); neue Richtung ist hell (paper/white/bg-soft).
    ok('Danceflow-Sektion ist hell (nicht mehr --surface-dark)', dfBg !== 'rgb(17, 17, 17)', dfBg);
    const duotoneCount = await page.locator('img[src*="duotone"]').count();
    ok('Keine Duoton-Bilder mehr auf der Events-Seite', duotoneCount === 0, `${duotoneCount} duotone img(s)`);

    // --- Echte Umlaute im DE (Regel 069) ----------------------------------
    ok('Echte Umlaute im DE (keine ASCII-Umlaute)',
      bodyDe.includes('schönsten') && bodyDe.includes('über') &&
      !bodyDe.includes('schoensten') && !bodyDe.includes('ueber Eventfrog') && !/\bGaeste\b/.test(bodyDe));

    // --- DE/EN-Umschaltung (Header-Toggle) --------------------------------
    await page.locator('header [data-testid="lang-en"]').click();
    await page.waitForTimeout(400);
    const bodyEn = await page.locator('body').innerText();
    const enCI = bodyEn.toLowerCase();
    await page.screenshot({ path: `${SHOTS}/02-desktop-en.png`, fullPage: true });
    ok('DE->EN schaltet die Seite um (Sektionen)',
      deCI.includes('freitags wird getanzt') && enCI.includes('fridays are for dancing') &&
      enCI.includes('a weekend in the flow') && enCI.includes('how to secure your spot'),
      'Danceflow/Floweekend/Tickets uebersetzt');
    ok('Event-Typen auch in EN dargestellt',
      enCI.includes('danceflow nights') && enCI.includes('anniversary weekend') && enCI.includes('floweekend'));
    ok('Eventfrog-CTA bleibt nach Sprachwechsel zum Ticketing',
      (await cta.evaluateAll((els) => els.every((e) => (e.getAttribute('href') || '').toLowerCase().includes('eventfrog')))));

    await page.locator('header [data-testid="lang-de"]').click();
    await page.waitForTimeout(300);

    // --- Erreichbarkeit ueber die Header-Nav von der Startseite ------------
    await page.goto(`${ORIGIN}/`, { waitUntil: 'networkidle' });
    const eventsNav = page.locator('header nav a[href="/events"]').first();
    ok('Header-Nav verlinkt die Events-Seite', (await eventsNav.count()) >= 1);
    await eventsNav.click();
    await page.waitForLoadState('networkidle');
    ok('Nav-Klick landet auf /events', page.url().endsWith('/events'), page.url());
    await page.locator('#danceflow').waitFor({ timeout: 10000 });

    // --- Mobil sauber (iPhone-Breite) -------------------------------------
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(300);
    await page.locator('#danceflow').waitFor({ timeout: 8000 });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    ok('Mobil ohne horizontalen Ueberlauf', overflow <= 1, `scrollWidth-innerWidth=${overflow}px`);
    await page.screenshot({ path: `${SHOTS}/03-mobile-de.png`, fullPage: true });

    const failed = results.filter((r) => !r.cond).length;
    console.log(`\nUI-SMOKE (EVENTS) VERDICT: ${failed === 0 ? 'PASS' : 'FAIL'} (${results.length - failed}/${results.length})`);
    await browser.close();
    process.exit(failed === 0 ? 0 : 1);
  } catch (e) {
    console.log('UI-SMOKE FEHLER:', e.message);
    await page.screenshot({ path: `${SHOTS}/99-fehler.png`, fullPage: true }).catch(() => {});
    await browser.close();
    process.exit(1);
  }
})();
