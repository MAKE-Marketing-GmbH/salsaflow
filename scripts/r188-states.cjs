// R188: belegt die Zustaende, die statische Seiten-Screenshots nicht zeigen —
// Kurskarten-Hover (KP3), Modal-Kopf (KP4/KP5) und Buchung Schritt 2 (KP6).
const { chromium } = require('playwright-core');
const fs = require('fs');

const BASE = 'http://127.0.0.1:5175';
const OUT = process.argv[2] || 'worklog/shots/R188/after-final/states';

function check(condition, message) {
  if (!condition) throw new Error(message);
}

async function run(browser) {
  const findings = [];

  for (const [prefix, viewport] of [['d', { width: 1440, height: 900 }], ['m', { width: 390, height: 844 }]]) {
    const context = await browser.newContext({ viewport, reducedMotion: 'reduce' });
    const page = await context.newPage();
    const errors = [];
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', (e) => errors.push(String(e)));

    await page.goto(`${BASE}/kursplan`, { waitUntil: 'domcontentloaded' });
    await page.locator('button:has-text("Akzeptieren")').first().click({ timeout: 3000 }).catch(() => {});

    const card = page.locator('[data-testid="course-card"]').first();
    await card.waitFor({ timeout: 20000 });
    const plain = await card.evaluate((node) => getComputedStyle(node).backgroundColor);
    await card.hover();
    await page.waitForTimeout(400);
    const hovered = await card.evaluate((node) => getComputedStyle(node).backgroundColor);
    await card.screenshot({ path: `${OUT}/${prefix}-kp3-hover-karte.png` });
    findings.push({ id: 'KP3', viewport: prefix, plain, hovered });
    check(hovered !== plain, `KP3 (${prefix}): Hover ändert die Kartenfarbe nicht`);
    check(hovered === 'rgb(173, 24, 39)', `KP3 (${prefix}): Hover ist nicht das Marken-Rot, sondern ${hovered}`);

    await page.goto(`${BASE}/buchung`, { waitUntil: 'domcontentloaded' });
    await page.locator('button:has-text("Akzeptieren")').first().click({ timeout: 3000 }).catch(() => {});
    const pick = page.locator('[data-testid^="pick-course-"]').first();
    await pick.waitFor({ timeout: 20000 });
    await pick.click();

    // Der Dialog oeffnet erst ueber das Kursdetail und "Platz reservieren".
    const reserve = page.locator('[data-testid="reserve-spot"]');
    if (await reserve.count()) await reserve.first().click();

    const dialog = page.locator('[data-testid="booking-dialog"]');
    await dialog.waitFor({ timeout: 20000 });
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${OUT}/${prefix}-kp4-modal-kopf.png` });

    const header = await dialog.evaluate((node) => {
      const head = node.querySelector('[data-testid="booking-when"]')?.closest('div');
      return head ? getComputedStyle(head).backgroundColor : null;
    });
    const when = await page.locator('[data-testid="booking-when"]').first().innerText();
    findings.push({ id: 'KP4/KP5', viewport: prefix, header, when });
    check(Boolean(when && when.trim()), `KP5 (${prefix}): Modal zeigt kein Datum`);

    // Rolle und Modus sind ChoiceTile-Buttons (keine Radios) — beide Pflicht in Schritt 1.
    await dialog.locator('[data-testid="role-follower"]').click();
    const solo = dialog.locator('[data-testid="mode-solo"]');
    if (await solo.count()) await solo.click();
    await page.waitForTimeout(200);
    await page.locator('[data-testid="booking-next"]').first().click();
    await page.locator('[data-testid="booking-submit"]').first().waitFor({ timeout: 20000 });
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${OUT}/${prefix}-kp6-buchung-schritt2.png` });
    findings.push({ id: 'KP6', viewport: prefix, reached: true });

    // K2: gewaehlte Anliegen-Karte, Auswahl per Maus darf keine Outline zeigen.
    await page.goto(`${BASE}/kontakt`, { waitUntil: 'domcontentloaded' });
    const topic = page.locator('input[name="topic"]').first();
    await topic.waitFor({ state: 'attached', timeout: 20000 });
    const topicCard = topic.locator('..');
    await topicCard.click();
    await page.waitForTimeout(300);
    check(await page.locator('input[name="topic"]:checked').count() === 1, `K2 (${prefix}): Anliegen nicht gewählt`);
    const outline = await topicCard.evaluate((node) => getComputedStyle(node).outlineStyle);
    check(outline === 'none', `K2 (${prefix}): Mauswahl zeigt Outline (${outline})`);
    await topicCard.screenshot({ path: `${OUT}/${prefix}-k2-kontakt-auswahl.png` });
    findings.push({ id: 'K2', viewport: prefix, checked: true, outline });

    // F4: geoeffnete FAQ-Antwort mit Link als eigener Zeile.
    await page.goto(`${BASE}/faq`, { waitUntil: 'domcontentloaded' });
    const faq = page.locator('details:not([open]) summary').first();
    await faq.waitFor({ timeout: 20000 });
    await faq.click();
    await page.waitForTimeout(600);
    const openDetails = page.locator('details[open]').first();
    check(await openDetails.locator('a[href]').count() > 0, `F4 (${prefix}): offene Antwort hat keinen Link`);
    await openDetails.screenshot({ path: `${OUT}/${prefix}-f4-faq-offen.png` });
    findings.push({ id: 'F4', viewport: prefix, openWithLink: true });

    check(errors.length === 0, `Konsolenfehler (${prefix}): ${errors.join(' | ')}`);
    await context.close();
  }

  fs.writeFileSync(`${OUT}/findings.json`, JSON.stringify(findings, null, 1));
  console.log('PASS Zustands-Belege:', JSON.stringify(findings));
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  try {
    await run(browser);
  } catch (error) {
    console.error(String(error));
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
})();
