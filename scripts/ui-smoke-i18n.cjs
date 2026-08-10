// Headless UI-Smoke (Etappe 15): Zweisprachigkeit sitewide + SEO-Basics + Recht.
// Prueft pro oeffentlicher Route: globaler DE/EN-Schalter vorhanden + schaltet (html lang +
// Inhalt/Meta), route-spezifischer <title>, meta description, canonical, og:title; dazu
// Sprach-Persistenz ueber echten Seitenwechsel, JSON-LD LocalBusiness, robots.txt + sitemap.xml,
// und dass die Rechtsseiten Impressum + Datenschutz in DE und EN echten Inhalt zeigen.
// Headless-Pflicht (Memory): laeuft headless ueber System-Chrome. Braucht laufenden `npm run dev`
// (playwright-core ist projektweite Konvention der ui-smoke-*.cjs).
const { chromium } = require('playwright-core');

const BASE = 'http://localhost:5173';
const CANON = 'https://www.salsaflow-dc.com';
const results = [];
function ok(name, cond, detail = '') {
  results.push({ name, cond: !!cond, detail });
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}${detail ? '  (' + detail + ')' : ''}`);
}

// Erwartete DE-Titel-Stichworte + ob der Titel beim Sprachwechsel anders wird.
const ROUTES = [
  { path: '/', key: 'home', deTitleKw: 'Salsaflow', titleChanges: false },
  { path: '/tanzkurse', key: 'courses', deTitleKw: 'Tanzkurse', titleChanges: true },
  { path: '/events', key: 'events', deTitleKw: 'Events', titleChanges: true },
  { path: '/team', key: 'team', deTitleKw: 'Team', titleChanges: false },
  { path: '/fotos', key: 'photos', deTitleKw: 'Fotos', titleChanges: true },
  { path: '/kontakt', key: 'contact', deTitleKw: 'Kontakt', titleChanges: true },
  { path: '/kursplan', key: 'schedule', deTitleKw: 'Kursplan', titleChanges: true },
  { path: '/impressum', key: 'impressum', deTitleKw: 'Impressum', titleChanges: true, deText: 'Betreiberin', enText: 'Operator' },
  { path: '/datenschutz', key: 'datenschutz', deTitleKw: 'Datenschutz', titleChanges: true, deText: 'Verantwortliche Stelle', enText: 'Controller' },
];

const head = (page) =>
  page.evaluate(() => ({
    title: document.title,
    desc: document.querySelector('meta[name="description"]')?.getAttribute('content') || '',
    canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href') || '',
    ogTitle: document.querySelector('meta[property="og:title"]')?.getAttribute('content') || '',
    ogLocale: document.querySelector('meta[property="og:locale"]')?.getAttribute('content') || '',
    lang: document.documentElement.lang,
  }));

(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 1600 }, reducedMotion: 'reduce' });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));

  for (const r of ROUTES) {
    try {
      await page.goto(`${BASE}${r.path}`, { waitUntil: 'load' });
      await page.waitForSelector('[data-testid="lang-en"]', { timeout: 8000 });

      // Immer in DE starten (localStorage kann aus der Vorroute auf en stehen).
      await page.locator('[data-testid="lang-de"]').first().click();
      await page.waitForTimeout(300);
      const de = await head(page);

      ok(`${r.path} hat globalen DE/EN-Schalter`, true);
      ok(`${r.path} DE-Titel route-spezifisch (${r.deTitleKw})`, de.title.includes(r.deTitleKw), de.title);
      ok(`${r.path} meta description gesetzt`, de.desc.length > 30);
      ok(`${r.path} canonical korrekt`, de.canonical === `${CANON}${r.path}`, de.canonical);
      ok(`${r.path} og:title gesetzt`, de.ogTitle.length > 5);
      ok(`${r.path} og:locale de_CH in DE`, de.ogLocale === 'de_CH', de.ogLocale);
      ok(`${r.path} html lang=de(-CH) in DE`, de.lang === 'de' || de.lang === 'de-CH', de.lang);

      // Auf EN schalten und Reaktion pruefen.
      await page.locator('[data-testid="lang-en"]').first().click();
      await page.waitForTimeout(350);
      const en = await head(page);

      ok(`${r.path} html lang=en nach Wechsel`, en.lang === 'en', en.lang);
      ok(`${r.path} description wechselt DE->EN`, en.desc !== de.desc && en.desc.length > 30);
      ok(`${r.path} og:locale en_GB in EN`, en.ogLocale === 'en_GB', en.ogLocale);
      if (r.titleChanges) ok(`${r.path} Titel wechselt DE->EN`, en.title !== de.title, `${de.title} -> ${en.title}`);

      // Rechtsseiten: echter Inhalt in beiden Sprachen.
      if (r.deText) {
        await page.locator('[data-testid="lang-de"]').first().click();
        await page.waitForTimeout(250);
        const txtDe = await page.locator('main').innerText();
        ok(`${r.path} DE-Inhalt (${r.deText})`, txtDe.includes(r.deText));
        // echte Umlaute (Regel 069): mind. ein Umlaut, keine ASCII-ae/oe/ue-Reste im Rechtstext
        ok(`${r.path} echte Umlaute im Rechtstext`, /[äöü]/.test(txtDe) && !/(Datenschutzerklaerung|Loeschung|verlaesst)/.test(txtDe));
        await page.locator('[data-testid="lang-en"]').first().click();
        await page.waitForTimeout(250);
        const txtEn = await page.locator('main').innerText();
        ok(`${r.path} EN-Inhalt (${r.enText})`, txtEn.includes(r.enText));
      }
    } catch (e) {
      ok(`${r.path} laedt`, false, e.message);
    }
  }

  // Sprach-Persistenz ueber echten Seitenwechsel: EN auf /team -> /kontakt laedt EN.
  try {
    await page.goto(`${BASE}/team`, { waitUntil: 'load' });
    await page.waitForSelector('[data-testid="lang-en"]', { timeout: 8000 });
    await page.locator('[data-testid="lang-en"]').first().click();
    await page.waitForTimeout(250);
    await page.goto(`${BASE}/kontakt`, { waitUntil: 'load' });
    await page.waitForSelector('[data-testid="lang-en"]', { timeout: 8000 });
    await page.waitForTimeout(300);
    const lang = await page.evaluate(() => document.documentElement.lang);
    ok('Sprache persistiert ueber Seitenwechsel (EN bleibt EN)', lang === 'en', lang);
    await page.locator('[data-testid="lang-de"]').first().click();
  } catch (e) {
    ok('Sprach-Persistenz pruefbar', false, e.message);
  }

  // Strukturierte Daten (JSON-LD DanceSchool) im Quelltext.
  try {
    await page.goto(`${BASE}/`, { waitUntil: 'load' });
    const ld = await page.evaluate(() => {
      const el = document.querySelector('script[type="application/ld+json"]');
      return el ? el.textContent || '' : '';
    });
    ok('JSON-LD vorhanden', ld.length > 0);
    // schema.org kennt kein "DanceSchool" — korrekt ist LocalBusiness (siehe src/lib/schema.ts).
    ok('JSON-LD Typ LocalBusiness', ld.includes('LocalBusiness'));
    ok('JSON-LD valides JSON', (() => { try { JSON.parse(ld); return true; } catch { return false; } })());
  } catch (e) {
    ok('JSON-LD pruefbar', false, e.message);
  }

  // robots.txt + sitemap.xml ausgeliefert.
  try {
    const robots = await page.request.get(`${BASE}/robots.txt`);
    const robotsBody = await robots.text();
    ok('robots.txt 200', robots.status() === 200);
    ok('robots.txt referenziert Sitemap', /Sitemap:\s*https?:\/\//.test(robotsBody));
    const sm = await page.request.get(`${BASE}/sitemap.xml`);
    const smBody = await sm.text();
    ok('sitemap.xml 200', sm.status() === 200);
    ok('sitemap.xml listet /impressum + /datenschutz',
      smBody.includes('/impressum') && smBody.includes('/datenschutz'));
    ok('sitemap.xml korrekter Namespace', smBody.includes('sitemaps.org/schemas/sitemap'));
  } catch (e) {
    ok('robots/sitemap pruefbar', false, e.message);
  }

  ok('Keine Konsolen-/Page-Fehler', errors.length === 0, errors.slice(0, 4).join(' | '));

  await browser.close();

  const failed = results.filter((r) => !r.cond);
  console.log(`\nVERDICT: ${failed.length ? 'FAIL' : 'PASS'} (${results.length - failed.length}/${results.length})`);
  if (failed.length) {
    console.log('FAILED:');
    failed.forEach((f) => console.log(` - ${f.name}${f.detail ? '  (' + f.detail + ')' : ''}`));
    process.exit(1);
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
