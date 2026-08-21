const { chromium } = require('playwright-core');

const BASE = 'http://127.0.0.1:5175';
const ROUTES = [
  '/', '/kontakt', '/faq', '/fotos', '/team', '/events',
  '/events-workshops/eventkalender', '/events-workshops/danceflow-night',
  '/events-workshops/anniversary-weekend', '/events-workshops/floweekend',
  '/shows-animationen', '/preise', '/privatstunden', '/kursplan', '/buchung',
  '/schnupperstunde', '/tanzkurse', '/tanzkurse/salsa',
  '/tanzkurse/bachata', '/tanzkurse/heels', '/kursaufbau',
];

function check(condition, message) {
  if (!condition) throw new Error(message);
}

(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  const errors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(String(error)));

  for (const route of ROUTES) {
    const response = await page.goto(BASE + route, { waitUntil: 'domcontentloaded' });
    check(response && response.status() < 400, `${route}: Seite lädt nicht`);
    await page.locator('h1').waitFor();
    check(await page.locator('h1').count() === 1, `${route}: braucht genau ein H1`);
  }

  await page.goto(BASE + '/kontakt', { waitUntil: 'networkidle' });
  const topicInputs = page.locator('input[name="topic"]');
  check(await topicInputs.count() === 8, '/kontakt: acht Anliegen fehlen');
  check(await page.locator('input[name="topic"]:checked').count() === 0, '/kontakt: Anliegen ist vorausgewählt');
  const selectedCard = topicInputs.first().locator('..');
  await selectedCard.click();
  check(await page.locator('input[name="topic"]:checked').count() === 1, '/kontakt: Anliegen lässt sich nicht wählen');
  check(!(await selectedCard.evaluate((node) => getComputedStyle(node).outlineStyle !== 'none')), '/kontakt: Mauswahl hat Outline');

  await page.goto(BASE + '/faq', { waitUntil: 'networkidle' });
  const closedFaq = page.locator('details:not([open]) summary').first();
  await closedFaq.click();
  // React setzt das open-Attribut erst im naechsten Render — auf den Zustand warten,
  // nicht sofort das Attribut lesen.
  await page.locator('details[open]').first().waitFor({ timeout: 5000 });
  check(await page.locator('details[open] a[href]').count() > 0, '/faq: geöffnete Antwort hat keinen Link');

  await page.goto(BASE + '/kursplan', { waitUntil: 'networkidle' });
  const course = page.locator('[data-testid="course-card"]').first();
  await course.waitFor();
  const href = await course.getAttribute('href');
  check(Boolean(href && href.startsWith('/buchung?kurs=')), '/kursplan: Kurs ist nicht auf Buchung verlinkt');
  check(Boolean(await course.getAttribute('data-date')), '/kursplan: Kursdatum fehlt');
  await course.click();
  await page.waitForURL(/\/buchung\?kurs=/);
  check(await page.locator('h1').count() === 1, '/buchung: Zielseite fehlt');

  await page.goto(BASE + '/tanzkurse/bachata', { waitUntil: 'networkidle' });
  const styleCourse = page.locator('[data-testid="course-card"]').first();
  await styleCourse.waitFor();
  check(Boolean(await styleCourse.getAttribute('data-date')), '/tanzkurse/bachata: Kursdatum fehlt');
  check((await styleCourse.getAttribute('href'))?.startsWith('/buchung?kurs=') === true, '/tanzkurse/bachata: Kurslink fehlt');

  check(errors.length === 0, `Konsolenfehler: ${errors.join(' | ')}`);
  await browser.close();
  console.log(`PASS: ${ROUTES.length} Routen, Kontakt, FAQ, Kursplan, Buchung und Stilseite`);
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
