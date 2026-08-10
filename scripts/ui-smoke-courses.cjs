// Headless UI-Smoke: gestaltete Tanzkurse-Seite unter /tanzkurse.
// Aktuelle Architektur: /tanzkurse zeigt den Kursplan-Teaser, Levels, Preise,
// Privatstunden und Sommerkurse. Die volle CourseEngine lebt nur auf /kursplan.
const { chromium } = require('playwright-core');
const fs = require('node:fs');

const BASE = 'http://localhost:5173/tanzkurse';
const SHOTS = '.marathon/e11-shots';
const results = [];
function ok(name, cond, detail = '') {
  results.push({ name, cond: !!cond, detail });
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}${detail ? '  (' + detail + ')' : ''}`);
}

(async () => {
  fs.mkdirSync(SHOTS, { recursive: true });
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 2200 } });
  await page.addInitScript(() => localStorage.setItem('salsaflow-cookie-ok', '1'));
  page.on('pageerror', (e) => console.log('PAGEERROR:', e.message));
  page.on('console', (m) => {
    if (m.type() === 'error') console.log('CONSOLE.ERROR:', m.text());
  });

  try {
    await page.goto(BASE, { waitUntil: 'networkidle' });
    await page.getByRole('heading', { name: /Such dir deinen Tanz/i }).waitFor({ timeout: 10000 });
    const bodyDe = await page.locator('body').innerText();
    await page.screenshot({ path: `${SHOTS}/01-desktop-de.png`, fullPage: true });

    ok('Tanzkurse-Seite sichtbar', bodyDe.includes('Such dir deinen Tanz'));
    ok('Drei Stile sichtbar', ['Salsa', 'Bachata', 'Heels'].every((x) => bodyDe.includes(x)));
    ok('Levels-Erklaerung vorhanden', bodyDe.includes('Beginner') && bodyDe.includes('Intermediate') && bodyDe.includes('Advanced'));
    ok('Beginner Flow + Intermediate Flow erklaert', bodyDe.includes('Beginner Flow') && bodyDe.includes('Intermediate Flow'));
    ok('Schnupperstunde-Sektion vorhanden', bodyDe.includes('Schnupperstunde') && bodyDe.toLowerCase().includes('gratis'));
    ok('Sommerkurse-Sektion vorhanden', bodyDe.includes('Sommerkurse'));
    ok('Preise sichtbar (Kundenwunsch)', bodyDe.includes('190 CHF') && bodyDe.includes('100 CHF') && bodyDe.includes('600 CHF'));
    ok('Kursplan-Teaser statt voller Engine', (await page.locator('[data-testid="course-card"]').count()) === 0);
    ok('CTA zum vollen Kursplan vorhanden', (await page.locator('a[href="/kursplan"]').count()) >= 1);
    ok('Echte Umlaute im DE', bodyDe.includes('Blöcken') && bodyDe.includes('möglich') && !bodyDe.includes('Bloecken'));

    await page.locator('header [data-testid="lang-en"]').click();
    await page.waitForTimeout(400);
    const bodyEn = await page.locator('body').innerText();
    await page.screenshot({ path: `${SHOTS}/02-desktop-en.png`, fullPage: true });
    const enCI = bodyEn.toLowerCase();
    ok('DE->EN schaltet die Seite', enCI.includes('trial class') && enCI.includes('summer courses') && enCI.includes('prices'));

    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(300);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    ok('Mobil ohne horizontalen Ueberlauf', overflow <= 1, `scrollWidth-innerWidth=${overflow}px`);
    await page.screenshot({ path: `${SHOTS}/03-mobile-de.png`, fullPage: true });

    const failed = results.filter((r) => !r.cond).length;
    console.log(`\nUI-SMOKE (COURSES) VERDICT: ${failed === 0 ? 'PASS' : 'FAIL'} (${results.length - failed}/${results.length})`);
    await browser.close();
    process.exit(failed === 0 ? 0 : 1);
  } catch (e) {
    console.log('UI-SMOKE FEHLER:', e.message);
    await page.screenshot({ path: `${SHOTS}/99-fehler.png`, fullPage: true }).catch(() => {});
    await browser.close();
    process.exit(1);
  }
})();
