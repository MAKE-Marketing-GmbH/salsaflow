import { chromium } from '/root/clients/salsaflow/node_modules/playwright-core/index.mjs';
import { mkdirSync, statSync, writeFileSync } from 'node:fs';

const OUT = '/tmp/sf-brief17';
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });

async function dismiss(page) {
  try {
    const btn = page.locator('button:has-text("Akzeptieren"), button:has-text("Okay"), button:has-text("Accept")').first();
    if (await btn.count()) await btn.click({ timeout: 800 });
  } catch { /* ok */ }
}

async function shot(page, name) {
  const path = `${OUT}/${name}.png`;
  await page.screenshot({ path, animations: 'disabled', caret: 'hide' });
  return { name, bytes: statSync(path).size, path };
}

const notes = [];

{
  const page = await browser.newPage({ viewport: { width: 1440, height: 730 } });

  await page.goto('http://127.0.0.1:5175/faq', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1200);
  await dismiss(page);
  await page.evaluate(() => window.scrollTo(0, 0));
  notes.push({ page: 'faq-fold', shot: await shot(page, 'faq-desktop-fold') });
  const faqH3 = await page.locator('h3').allTextContents();
  notes.push({ page: 'faq-h3', h3: faqH3.slice(0, 10) });
  await page.evaluate(() => window.scrollTo(0, 900));
  await page.waitForTimeout(400);
  notes.push({ page: 'faq-y900', shot: await shot(page, 'faq-desktop-y900') });

  await page.goto('http://127.0.0.1:5175/kursplan', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1100);
  await dismiss(page);
  const mehr = page.locator('nav[aria-label="Hauptnavigation"] a').filter({ hasText: /^Mehr$/ }).first();
  await mehr.hover();
  await page.waitForTimeout(400);
  const visibleMenu = await page.evaluate(() => {
    const menus = [...document.querySelectorAll('[id^="nav-menu"]')];
    return menus.map((el) => ({
      id: el.id,
      vis: getComputedStyle(el).visibility,
      op: getComputedStyle(el).opacity,
      text: el.innerText,
    }));
  });
  notes.push({ page: 'mehr-hover', menus: visibleMenu });
  notes.push({ page: 'mehr-hover-shot', shot: await shot(page, 'header-mehr-hover') });
  notes.push({
    page: 'lang-toggle',
    de: (await page.locator('[data-testid="lang-de"]').first().textContent())?.trim(),
    en: (await page.locator('[data-testid="lang-en"]').first().textContent())?.trim(),
    dePressed: await page.locator('[data-testid="lang-de"]').first().getAttribute('aria-pressed'),
  });
  notes.push({ page: 'kursplan-fold', shot: await shot(page, 'kursplan-desktop-fold') });
  const wa = page.locator('a[href*="wa.me"]').last();
  notes.push({
    page: 'whatsapp',
    box: await wa.boundingBox(),
    css: await wa.evaluate((el) => {
      const s = getComputedStyle(el);
      return { color: s.color, bg: s.backgroundColor, bottom: s.bottom, right: s.right };
    }),
  });

  await page.goto('http://127.0.0.1:5175/schnupperstunde', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1100);
  await dismiss(page);
  notes.push({ page: 'schnupper-fold', shot: await shot(page, 'schnupper-desktop-fold'), url: page.url() });
  const topicCards = await page.locator('button:has-text("Kursanmeldung"), button:has-text("Events"), button:has-text("Shows")').count();
  notes.push({ page: 'schnupper-topics-visible', topicCards });
  await page.evaluate(() => window.scrollTo(0, 900));
  await page.waitForTimeout(400);
  notes.push({ page: 'schnupper-y900', shot: await shot(page, 'schnupper-desktop-y900') });

  await page.goto('http://127.0.0.1:5175/buchung', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1400);
  await dismiss(page);
  notes.push({ page: 'buchung-list', shot: await shot(page, 'buchung-desktop-list') });
  const firstCourse = page.locator('[data-testid^="pick-course-"]').first();
  await firstCourse.click();
  await page.waitForTimeout(800);
  const detailText = await page.locator('[data-testid="course-detail"]').innerText().catch(() => 'MISSING');
  notes.push({
    page: 'buchung-detail',
    shot: await shot(page, 'buchung-desktop-detail'),
    detailText: detailText.slice(0, 900),
    listStill: await page.locator('[data-testid="course-list"]').count(),
    hasStatus: /Ausgebucht|Plätze frei|Warteliste/.test(detailText),
    hasMaps: await page.locator('iframe[src*="google.com/maps"]').count(),
  });
  await page.evaluate(() => window.scrollTo(0, 520));
  await page.waitForTimeout(300);
  notes.push({ page: 'buchung-detail-maps', shot: await shot(page, 'buchung-desktop-detail-maps') });
  const reserve = page.locator('[data-testid="reserve-spot"]');
  if (await reserve.count()) {
    await reserve.click();
    await page.waitForTimeout(700);
    const dlgText = (await page.locator('[data-testid="booking-dialog"], [aria-modal="true"]').innerText().catch(() => '')).slice(0, 900);
    notes.push({
      page: 'buchung-modal',
      shot: await shot(page, 'buchung-desktop-modal'),
      dlgText,
      privacy: await page.locator('[data-testid="booking-privacy"]').count(),
      hasLongCourseCopy: /Staffel|Quereinstieg|Google Maps/.test(dlgText),
    });
  }

  await page.goto('http://127.0.0.1:5175/kontakt/standort-raumvermietung', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1200);
  await dismiss(page);
  notes.push({ page: 'standort-fold', shot: await shot(page, 'standort-desktop-fold') });
  await page.evaluate(() => window.scrollTo(0, 900));
  await page.waitForTimeout(400);
  notes.push({ page: 'standort-y900', shot: await shot(page, 'standort-desktop-y900') });
  await page.evaluate(() => window.scrollTo(0, 1600));
  await page.waitForTimeout(400);
  notes.push({ page: 'standort-y1600', shot: await shot(page, 'standort-desktop-y1600') });
  await page.close();
}

{
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto('http://127.0.0.1:5175/schnupperstunde', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1100);
  await dismiss(page);
  notes.push({ page: 'schnupper-mobile', shot: await shot(page, 'schnupper-mobile-fold') });
  const wa = page.locator('a[href*="wa.me"]').last();
  notes.push({
    page: 'whatsapp-mobile',
    box: await wa.boundingBox().catch(() => null),
    css: await wa.evaluate((el) => {
      const s = getComputedStyle(el);
      return { color: s.color, bg: s.backgroundColor, display: s.display };
    }).catch(() => null),
  });
  await page.goto('http://127.0.0.1:5175/faq', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);
  await dismiss(page);
  notes.push({ page: 'faq-mobile', shot: await shot(page, 'faq-mobile-fold') });
  await page.goto('http://127.0.0.1:5175/buchung', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1200);
  await dismiss(page);
  notes.push({ page: 'buchung-mobile', shot: await shot(page, 'buchung-mobile-list') });
  const first = page.locator('[data-testid^="pick-course-"]').first();
  if (await first.count()) {
    await first.click();
    await page.waitForTimeout(700);
    notes.push({ page: 'buchung-mobile-detail', shot: await shot(page, 'buchung-mobile-detail') });
  }
  await page.close();
}

writeFileSync(`${OUT}/notes.json`, JSON.stringify(notes, null, 2));
console.log(JSON.stringify(notes, null, 2));
await browser.close();
