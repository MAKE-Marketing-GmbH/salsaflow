#!/usr/bin/env node
/* Verifikation Paket A (WhatsApp-FAB Overlap, Kontakt-Chips, Weiter-Button, Submit-Flow).
   Vorbild: scripts/r205-sweep.cjs. Laeuft headless mit channel:'chrome'.
   Aufruf: node scripts/fixA-verify.cjs [outDir]
   - Screenshots je Viewport von /kontakt und /preise nach /tmp/fixA (oder outDir).
   - Overlap-Messung: liegt der FAB-Kasten ueber Text oder Bedienelement?
   - Flow-Test: klickt /kontakt bis zum echten Submit durch und meldet jeden Schritt. */

const { chromium } = require('playwright-core');
const fs = require('node:fs');
const path = require('node:path');

const BASE = process.env.BASE_URL || 'http://127.0.0.1:5173';
const OUT = process.argv[2] || '/tmp/fixA';
const VIEWPORTS = [
  { id: 'm390', width: 390, height: 844, mobile: true },
  { id: 'm360', width: 360, height: 780, mobile: true },
  { id: 'd1440', width: 1440, height: 900, mobile: false },
];
const ROUTES = [
  { id: 'kontakt', path: '/kontakt' },
  { id: 'preise', path: '/preise' },
];

/** Misst im Browser, ob der FAB Text oder Bedienelemente ueberdeckt. */
const OVERLAP_PROBE = () => {
  const fab = document.querySelector('a.whatsapp-float');
  if (!fab) return { fab: false, hits: [] };
  const box = fab.getBoundingClientRect();
  if (box.width < 1 || box.height < 1) return { fab: false, hits: [] };
  const hits = [];
  const overlaps = (rect) =>
    rect.width > 1 &&
    rect.height > 1 &&
    rect.right > box.left &&
    rect.left < box.right &&
    rect.bottom > box.top &&
    rect.top < box.bottom;

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    const text = node.textContent && node.textContent.trim();
    const parent = node.parentElement;
    if (!text || text.length < 2 || !parent || fab.contains(parent)) continue;
    if (parent.closest('.sr-only')) continue;
    if (!parent.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })) continue;
    const range = document.createRange();
    range.selectNodeContents(node);
    for (const rect of range.getClientRects()) {
      if (overlaps(rect)) {
        hits.push({ kind: 'text', text: text.slice(0, 60) });
        break;
      }
    }
  }
  for (const el of document.querySelectorAll('a, button, input, select, textarea, label')) {
    if (fab.contains(el) || el === fab) continue;
    if (!el.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })) continue;
    if (overlaps(el.getBoundingClientRect())) {
      hits.push({ kind: el.tagName.toLowerCase(), text: (el.textContent || '').trim().slice(0, 40) });
    }
  }
  return { fab: true, box: { top: box.top, left: box.left, right: box.right, bottom: box.bottom }, hits };
};

/** Findet Woerter, die mitten im Wort umgebrochen wurden (Silbentrennung im Chip). */
const HYPHEN_PROBE = () => {
  const out = [];
  for (const el of document.querySelectorAll('#kontaktformular ~ * span, form span, form label')) {
    if (el.children.length > 0) continue;
    const text = (el.textContent || '').trim();
    if (!text || text.length < 6) continue;
    const range = document.createRange();
    range.selectNodeContents(el);
    const rects = [...range.getClientRects()].filter((r) => r.width > 1 && r.height > 1);
    if (rects.length < 2) continue;
    const style = window.getComputedStyle(el);
    out.push({ text: text.slice(0, 40), lines: rects.length, hyphens: style.hyphens, wordBreak: style.overflowWrap });
  }
  return out;
};

async function shoot(page, dir, name) {
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `${name}.png`);
  await page.screenshot({ path: file, animations: 'disabled', caret: 'hide' });
  return file;
}

async function main() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const report = { overlap: [], hyphen: [], flow: [], shots: [] };

  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
      isMobile: vp.mobile,
      hasTouch: vp.mobile,
    });
    const page = await context.newPage();

    for (const route of ROUTES) {
      await page.goto(BASE + route.path, { waitUntil: 'networkidle' });
      // Cookie-Banner wegklicken, sonst misst jeder Shot einen anderen Zustand.
      const accept = page.locator('[data-testid="cookie-accept"]');
      if (await accept.count()) {
        await accept.first().click().catch(() => {});
        await page.waitForTimeout(400);
      }
      await page.waitForTimeout(900);
      await page.waitForLoadState('networkidle').catch(() => {});
      report.shots.push(await shoot(page, path.join(OUT, route.id), `${vp.id}-fold`));

      // Zweiter Blick: bis zum Formular bzw. Seitenmitte scrollen.
      await page.waitForLoadState('domcontentloaded').catch(() => {});
      await page.evaluate(() => {
        const form = document.querySelector('#kontaktformular, form');
        if (form) form.scrollIntoView({ block: 'start' });
        else window.scrollBy(0, 900);
      });
      await page.waitForTimeout(1000);
      report.shots.push(await shoot(page, path.join(OUT, route.id), `${vp.id}-form`));
      report.overlap.push({ vp: vp.id, route: route.id, ...(await page.evaluate(OVERLAP_PROBE)) });
      if (route.id === 'kontakt') {
        report.hyphen.push({ vp: vp.id, rows: await page.evaluate(HYPHEN_PROBE) });
      }

      // Seitenende: verdeckt der FAB den letzten Inhalt oder den Footer-Anfang?
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(900);
      report.shots.push(await shoot(page, path.join(OUT, route.id), `${vp.id}-end`));
      report.overlap.push({ vp: vp.id, route: `${route.id}#end`, ...(await page.evaluate(OVERLAP_PROBE)) });
    }

    // ---- Flow-Test /kontakt: bis zum echten Submit durchklicken ----
    const flow = { vp: vp.id, steps: [] };
    await page.goto(`${BASE}/kontakt`, { waitUntil: 'networkidle' });
    const accept = page.locator('[data-testid="cookie-accept"]');
    if (await accept.count()) await accept.first().click().catch(() => {});
    await page.waitForTimeout(600);
    await page.locator('#kontaktformular').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    flow.steps.push({ at: 'step1', next: await page.locator('[data-testid="inquiry-next"]').count(), submit: await page.locator('[data-testid="contact-submit"]').count() });
    // Anliegen waehlen (erste Karte).
    await page.locator('input[name="topic"]').first().check({ force: true });
    await page.waitForTimeout(400);
    flow.steps.push({ at: 'step1-gewaehlt', nextEnabled: await page.locator('[data-testid="inquiry-next"]').getAttribute('aria-disabled') === null });
    await page.locator('[data-testid="inquiry-next"]').click();
    await page.waitForTimeout(700);
    flow.steps.push({ at: 'step2', next: await page.locator('[data-testid="inquiry-next"]').count(), submit: await page.locator('[data-testid="contact-submit"]').count() });
    if (await page.locator('[data-testid="inquiry-next"]').count()) {
      await page.locator('[data-testid="inquiry-next"]').click();
      await page.waitForTimeout(700);
    }
    flow.steps.push({ at: 'step3', next: await page.locator('[data-testid="inquiry-next"]').count(), submit: await page.locator('[data-testid="contact-submit"]').count() });
    const submitCount = await page.locator('[data-testid="contact-submit"]').count();
    flow.submitErreichbar = submitCount > 0;
    if (submitCount > 0) {
      flow.submitSichtbar = await page.locator('[data-testid="contact-submit"]').isVisible();
      await page.locator('[data-testid="contact-submit"]').scrollIntoViewIfNeeded();
      await page.waitForTimeout(400);
      report.shots.push(await shoot(page, path.join(OUT, 'kontakt'), `${vp.id}-submit`));
      flow.overlapAmSubmit = await page.evaluate(OVERLAP_PROBE);
    }
    report.flow.push(flow);

    await context.close();
  }

  await browser.close();
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
