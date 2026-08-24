/* R190: Traegt Opus' Weg a — symmetrische Shell plus Reserve NUR im unteren Band?

   Anlass: opus-critic Runde 4, Befund 1. Sein Kern stimmt: der Knopf ist
   `fixed` (WhatsAppFloat.tsx:593) und belegt ein 56 px hohes Band am unteren
   Viewportrand. Die Shell reserviert dafuer aber 88 px auf der GANZEN
   Seitenhoehe (mobil 13367 px). Das ist der Grund fuer Raphaels Punkt 4.

   Der bereits gefahrene Gegenversuch (`px-5 sm:px-8` nackt, 14/16 rot) zeigt
   nur, dass Symmetrie OHNE Ersatz nicht traegt. Diese Sonde testet, ob
   Symmetrie MIT einer gezielten Ersatzmassnahme traegt.

   Gemessen werden drei Zustaende auf allen acht Kernrouten, beide Viewports,
   ohne eine Datei zu aendern — die Shell-Klasse wird zur Laufzeit im Browser
   umgeschrieben:

     A  jetzt          pl-5 pr-[var(--wa-corner)] sm:pl-8   (asymmetrisch)
     B  symmetrisch    px-5 sm:px-8                          (Opus' Ziel, nackt)
     C  symmetrisch + Reserve im unteren Band der Seite

   Fuer C bekommt das LETZTE Kind jeder Shell zusaetzlichen Platz rechts, aber
   nur wenn es im unteren Bereich des Dokuments liegt. Das ist die kleinste
   Fassung von "Padding nur wo der Knopf ist".

   Ausgabe je Zustand: Anzahl Kollisionen zwischen Knopf und Text/Bedienelement,
   gemessen an allen Scrollpositionen wie im Gate. */
const { chromium } = require('playwright-core');

const BASE = 'http://127.0.0.1:5175';
const ROUTES = ['/', '/kursplan', '/preise', '/tanzkurse', '/tanzkurse/salsa', '/events', '/team', '/faq'];
const VIEWPORTS = [
  ['desktop', { width: 1440, height: 900 }],
  ['mobil', { width: 390, height: 844 }],
];

const ZUSTAENDE = ['A jetzt', 'B symmetrisch', 'C symmetrisch+Bandreserve'];

const UMBAU = (zustand) => {
  const shells = [...document.querySelectorAll('.mx-auto.w-full')].filter((el) =>
    el.className.includes('max-w-[1400px]'),
  );
  for (const el of shells) {
    el.style.paddingRight = '';
    el.style.paddingLeft = '';
    if (zustand === 'A jetzt') continue;
    const links = getComputedStyle(el).paddingLeft;
    el.style.paddingRight = links;
    if (zustand === 'C symmetrisch+Bandreserve') {
      // Reserve nur im unteren Bandbereich: das letzte sichtbare Kind bekommt
      // rechts so viel Platz, wie der Knopf breit ist.
      const kinder = [...el.children];
      const letztes = kinder[kinder.length - 1];
      if (letztes instanceof HTMLElement) {
        const ecke = getComputedStyle(document.documentElement).getPropertyValue('--wa-corner').trim();
        letztes.style.paddingRight = ecke || '5.5rem';
      }
    }
  }
  return shells.length;
};

const MESSUNG = () => {
  const sichtbar = (el) =>
    !el.closest('[hidden], [aria-hidden="true"], [inert]') &&
    el.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true });
  const float = document.querySelector('a.whatsapp-float');
  if (!float || !sichtbar(float)) return 0;
  const k = float.getBoundingClientRect();
  const ueberlappt = (r) =>
    Math.min(k.right, r.right) - Math.max(k.left, r.left) > 1 &&
    Math.min(k.bottom, r.bottom) - Math.max(k.top, r.top) > 1;

  let treffer = 0;
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    const text = node.textContent?.trim();
    const parent = node.parentElement;
    if (!text || text.length < 2 || !parent || float.contains(parent)) continue;
    if (parent.closest('.sr-only') || !sichtbar(parent)) continue;
    const range = document.createRange();
    range.selectNodeContents(node);
    for (const r of range.getClientRects()) {
      if (ueberlappt(r)) {
        treffer += 1;
        break;
      }
    }
  }
  for (const el of document.querySelectorAll('a, button, input, select, summary, [role="button"], [role="tab"]')) {
    if (float === el || float.contains(el) || el.contains(float)) continue;
    if (!sichtbar(el)) continue;
    if (ueberlappt(el.getBoundingClientRect())) treffer += 1;
  }
  return treffer;
};

(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const summe = new Map(ZUSTAENDE.map((z) => [z, 0]));
  const details = [];

  for (const route of ROUTES) {
    for (const [vName, viewport] of VIEWPORTS) {
      for (const zustand of ZUSTAENDE) {
        const context = await browser.newContext({ viewport, reducedMotion: 'no-preference' });
        const page = await context.newPage();
        await page.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await page.locator('button:has-text("Akzeptieren")').first().click({ timeout: 3000 }).catch(() => {});
        await page.waitForTimeout(700);
        await page.evaluate(UMBAU, zustand);
        await page.waitForTimeout(400);

        const maxScroll = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
        const step = Math.max(320, Math.round(viewport.height * 0.72));
        let treffer = 0;
        for (let y = 0; y <= maxScroll; y += step) {
          await page.evaluate((top) => scrollTo(0, top), y).catch(() => {});
          await page.waitForTimeout(220);
          treffer += await page.evaluate(MESSUNG).catch(() => 0);
        }
        summe.set(zustand, summe.get(zustand) + treffer);
        if (treffer > 0) details.push(`${route} ${vName} ${zustand}: ${treffer}`);
        await context.close();
      }
    }
    console.log(
      `${route.padEnd(20)} ` +
        ZUSTAENDE.map((z) => `${z.split(' ')[0]}=${summe.get(z)}`).join('  '),
    );
  }

  console.log('\nSumme Kollisionen ueber alle Routen und Viewports:');
  for (const z of ZUSTAENDE) console.log(`  ${z.padEnd(28)} ${summe.get(z)}`);
  if (details.length) {
    console.log('\nWo:');
    for (const d of details) console.log(`  ${d}`);
  }
  await browser.close();
})();
