// Runde 1 Beweis-Lauf Nav+Footer (Muster: scripts/e17-capture.cjs).
// Prueft Hover-Intent, Tastatur, Click/Touch, aria-expanded, Aktiv-Zustaende, Footer-NAP.
// Start: NODE_PATH=/usr/lib/node_modules/playwright/node_modules node scripts/nav-footer-verify.cjs
const { chromium } = require('playwright-core');
const BASE = 'http://localhost:5173';

const results = [];
const ok = (n, c, d = '') => results.push({ n, pass: !!c, d });

async function nav(p, path = '/') {
  await p.goto(BASE + path, { waitUntil: 'networkidle' });
  await p.waitForSelector('header nav[aria-label="Hauptnavigation"]', { timeout: 15000 });
  await p.waitForTimeout(300);
}
const trigger = (p) => p.locator('header nav[aria-label="Hauptnavigation"] a').filter({ hasText: /^Tanzkurse/ }).first();
// Sichtbarkeit ECHT messen: liegt der Kindlink im Viewport und ist er der oberste Treffer
// an seinem Mittelpunkt? Genau das war beim Clip-Bug falsch, waehrend CSS "visible" sagte.
const childHit = (p, label) =>
  p.evaluate((lbl) => {
    const a = Array.from(document.querySelectorAll('header nav a')).find((x) => x.textContent.trim() === lbl);
    if (!a) return { found: false };
    const r = a.getBoundingClientRect();
    const top = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
    return { found: true, rect: { y: r.y, h: r.height }, selfIsTop: !!top && (top === a || a.contains(top)) };
  }, label);

(async () => {
  const b = await chromium.launch({ headless: true, channel: 'chrome' });
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  const consoleErrors = [];
  p.on('console', (m) => m.type() === 'error' && consoleErrors.push(m.text()));

  // ---------- 1. HOVER ----------
  await nav(p);
  const t = trigger(p);
  ok('hover: aria-expanded=false im Ruhezustand', (await t.getAttribute('aria-expanded')) === 'false');
  await t.hover();
  await p.waitForTimeout(400);
  ok('hover: aria-expanded=true nach Hover', (await t.getAttribute('aria-expanded')) === 'true');
  const hit = await childHit(p, 'Salsa');
  ok('hover: Kindlink "Salsa" SICHTBAR (nicht mehr geclippt)', hit.found && hit.selfIsTop,
    `y=${hit.rect && Math.round(hit.rect.y)} selfIsTop=${hit.selfIsTop}`);

  // Hover-Intent: diagonaler Weg Trigger -> unterster Kindlink DIESER Gruppe.
  // Selektor bewusst auf das Tanzkurse-Panel begrenzt: `a[data-nav-child]` matcht sonst
  // alle 18 Kindlinks aller drei Dropdowns, und `.last()` lieferte einen Eintrag der
  // Mehr-Gruppe — der Zeiger haette die Tanzkurse-Gruppe voellig zu Recht verlassen.
  const panel = p.locator('#nav-menu--tanzkurse');
  const box = await panel.locator('a[data-nav-child]').last().boundingBox();
  const tbox = await t.boundingBox();
  // Realistischer Fall: schraeg vom Trigger nach unten aussen, kurz NEBEN die Panel-Spalte
  // (dort liegt kein Menu-Element), dann auf den untersten Eintrag. Genau hier flackerte es.
  await p.mouse.move(tbox.x + tbox.width / 2, tbox.y + tbox.height / 2);
  await p.waitForTimeout(60);
  await p.mouse.move(box.x - 40, box.y + 8, { steps: 8 });
  await p.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 8 });
  await p.waitForTimeout(300);
  ok('hover-intent: Diagonal-Move zum letzten Kindlink haelt offen',
    (await t.getAttribute('aria-expanded')) === 'true');
  ok('hover-intent: unterster Kindlink dabei anklickbar',
    (await childHit(p, 'Preise')).selfIsTop);

  // Wegbewegen schliesst wieder (kein Haengenbleiben).
  await p.mouse.move(700, 700);
  await p.waitForTimeout(500);
  ok('hover: schliesst nach Verlassen', (await t.getAttribute('aria-expanded')) === 'false');

  // ---------- 2. CLICK auf Kindlink ----------
  await t.hover();
  await p.waitForTimeout(300);
  await p.locator('header nav a[data-nav-child]').filter({ hasText: /^Bachata$/ }).first().click();
  await p.waitForTimeout(900);
  ok('click: Kindlink navigiert', p.url().endsWith('/tanzkurse/bachata'), p.url());

  // ---------- 3. AKTIV-ZUSTAND ----------
  await p.waitForSelector('header nav[aria-label="Hauptnavigation"]');
  await p.waitForTimeout(300);
  ok('aktiv: Gruppe "Tanzkurse" ist rot markiert',
    await p.evaluate(() => {
      const a = Array.from(document.querySelectorAll('header nav a')).find((x) => x.textContent.trim().startsWith('Tanzkurse'));
      return !!a && getComputedStyle(a).color === 'rgb(173, 24, 39)';
    }));
  await trigger(p).hover();
  await p.waitForTimeout(350);
  ok('aktiv: Kindlink "Bachata" traegt aria-current=page',
    (await p.locator('header nav a[data-nav-child]').filter({ hasText: /^Bachata$/ }).first().getAttribute('aria-current')) === 'page');

  // ---------- 4. TASTATUR ----------
  await nav(p);
  await trigger(p).focus();
  await p.keyboard.press('Enter');
  await p.waitForTimeout(250);
  ok('kbd: Enter oeffnet + fokussiert ersten Eintrag',
    (await trigger(p).getAttribute('aria-expanded')) === 'true' &&
      (await p.evaluate(() => document.activeElement?.textContent?.trim())) === 'Übersicht');
  await p.keyboard.press('ArrowDown');
  ok('kbd: ArrowDown -> zweiter Eintrag (Salsa)',
    (await p.evaluate(() => document.activeElement?.textContent?.trim())) === 'Salsa');
  await p.keyboard.press('ArrowUp');
  ok('kbd: ArrowUp -> zurueck auf Übersicht',
    (await p.evaluate(() => document.activeElement?.textContent?.trim())) === 'Übersicht');
  await p.keyboard.press('End');
  ok('kbd: End -> letzter Eintrag (Preise)',
    (await p.evaluate(() => document.activeElement?.textContent?.trim())) === 'Preise');
  // Fokus-Ring muss sichtbar sein (a11y, index.css :focus-visible)
  ok('kbd: Fokus-Ring sichtbar (outline gesetzt)',
    await p.evaluate(() => {
      const cs = getComputedStyle(document.activeElement);
      return cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0;
    }));
  await p.keyboard.press('Escape');
  await p.waitForTimeout(200);
  ok('kbd: Escape schliesst UND gibt Fokus an Trigger zurueck',
    (await trigger(p).getAttribute('aria-expanded')) === 'false' &&
      (await p.evaluate(() => document.activeElement?.textContent?.trim().startsWith('Tanzkurse'))));
  await p.keyboard.press('Space');
  await p.waitForTimeout(250);
  ok('kbd: Space oeffnet ebenfalls', (await trigger(p).getAttribute('aria-expanded')) === 'true');
  await p.keyboard.press('Escape');
  await p.waitForTimeout(150);
  // Geschlossenes Menu darf nicht im Tab-Pfad liegen (inert)
  ok('kbd: geschlossenes Menu ist inert (Kindlinks nicht fokussierbar)',
    await p.evaluate(() => {
      const el = Array.from(document.querySelectorAll('header nav a[data-nav-child]'))[0];
      if (!el) return false;
      el.focus();
      return document.activeElement !== el;
    }));

  // ---------- 5. FOOTER ----------
  await nav(p);
  const footer = await p.evaluate(() => {
    const f = document.querySelector('footer');
    const links = Array.from(f.querySelectorAll('a')).map((a) => a.getAttribute('href'));
    return {
      text: f.innerText,
      links,
      hasAddressEl: !!f.querySelector('address'),
    };
  });
  ok('footer: NAP-Adresse sichtbar', /Elisabethenanlage 7/.test(footer.text) && /4051 Basel/.test(footer.text));
  ok('footer: <address>-Element vorhanden', footer.hasAddressEl);
  ok('footer: Telefon + Mail verlinkt',
    footer.links.includes('tel:+41764788411') && footer.links.includes('mailto:info@salsaflow-dc.com'));
  ok('footer: Raumvermietung-Link bleibt', footer.links.includes('/kontakt/standort-raumvermietung'));
  for (const href of ['/tanzkurse/salsa', '/tanzkurse/bachata', '/tanzkurse/heels', '/privatstunden', '/kursaufbau', '/preise', '/kursplan', '/faq'])
    ok(`footer: interner Link ${href}`, footer.links.includes(href));
  ok('footer: keine React-Duplicate-Key-Fehler mehr',
    !consoleErrors.some((e) => /same key/.test(e)), consoleErrors.filter((e) => /same key/.test(e)).length + ' Treffer');

  // ---------- 6. REDUCED MOTION ----------
  const rctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const rp = await rctx.newPage();
  await nav(rp);
  await trigger(rp).hover();
  await rp.waitForTimeout(350);
  const rhit = await childHit(rp, 'Salsa');
  ok('reduced-motion: Menu oeffnet trotzdem voll sichtbar', rhit.found && rhit.selfIsTop);
  await rp.screenshot({ path: '/tmp/navshots/soll-hover.png', clip: { x: 0, y: 0, width: 1440, height: 340 } });

  // ---------- 7. MOBILE ----------
  const mctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const mp = await mctx.newPage();
  await mp.goto(BASE + '/tanzkurse/salsa', { waitUntil: 'networkidle' });
  await mp.waitForTimeout(500);
  const burger = mp.locator('header button[aria-controls="mobile-navigation"]');
  ok('mobile: Burger aria-expanded=false', (await burger.getAttribute('aria-expanded')) === 'false');
  await burger.tap();
  await mp.waitForTimeout(400);
  ok('mobile: Menu offen', (await burger.getAttribute('aria-expanded')) === 'true');
  const macc = mp.locator('#mobile-navigation button', { hasText: /^Tanzkurse/ }).first();
  await macc.tap();
  await mp.waitForTimeout(400);
  ok('mobile: Gruppe klappt auf', (await macc.getAttribute('aria-expanded')) === 'true');
  ok('mobile: aktive Unterseite markiert (aria-current)',
    (await mp.locator('#mobile-navigation a').filter({ hasText: /^Salsa$/ }).first().getAttribute('aria-current')) === 'page');
  const msalsa = await mp.locator('#mobile-navigation a').filter({ hasText: /^Salsa$/ }).first().boundingBox();
  ok('mobile: Touch-Target >= 44px', msalsa && msalsa.height >= 44, `h=${msalsa && Math.round(msalsa.height)}`);
  await mp.screenshot({ path: '/tmp/navshots/soll-mobile.png' });

  await b.close();

  const fail = results.filter((r) => !r.pass);
  for (const r of results) console.log(`${r.pass ? 'PASS' : 'FAIL'}  ${r.n}${r.d ? '  [' + r.d + ']' : ''}`);
  console.log(`\n${results.length - fail.length}/${results.length} bestanden`);
  process.exit(fail.length ? 1 : 0);
})();
