/* R190: Wie viel seitlichen Spielraum gaebe eine symmetrische Shell dem WhatsApp-Knopf?
   Die Frage vor dem Bau, nicht danach. Gemessen wird gegen den ECHTEN Ist-Zustand
   (Shell asymmetrisch), damit die Zahl nicht von der Aenderung abhaengt, die sie
   rechtfertigen soll.

   Drei Werte je Route/Viewport:
     rand      = innerWidth - Rechtskante der Inhaltsspalte. Der Aussenrand, den es
                 heute schon gibt.
     knopf     = Breite des Knopfes.
     frei      = Wieviel vom Knopf im Aussenrand Platz haette, wenn er ganz nach
                 rechts rueckt. Negativ heisst: er ragt zwingend in die Spalte.

   Ausserdem: an wievielen Scrollpositionen kollidiert der Knopf HEUTE. Das ist die
   Vergleichszahl fuer jede spaetere Aenderung. */
const { chromium } = require('playwright-core');

const BASE = 'http://127.0.0.1:5175';
const ROUTES = ['/', '/kursplan', '/preise', '/tanzkurse', '/tanzkurse/salsa', '/events', '/team', '/faq'];
const VIEWPORTS = [
  ['desktop', { width: 1440, height: 900 }],
  ['mobile', { width: 390, height: 844 }],
];

(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const zeilen = [];

  for (const route of ROUTES) {
    for (const [viewportName, viewport] of VIEWPORTS) {
      const context = await browser.newContext({ viewport, reducedMotion: 'no-preference' });
      const page = await context.newPage();
      await page.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.locator('button:has-text("Akzeptieren")').first().click({ timeout: 3000 }).catch(() => {});
      await page.waitForTimeout(900);

      const geo = await page.evaluate(() => {
        const shell = document.querySelector('main [class*="max-w-[1400px]"]');
        const float = document.querySelector('a.whatsapp-float');
        if (!shell || !float) return null;
        const s = shell.getBoundingClientRect();
        const cs = getComputedStyle(shell);
        const f = float.getBoundingClientRect();
        // Rechtskante der INHALTSSPALTE, nicht der Shell-Box: Padding gehoert zum Rand.
        const spalteRechts = s.right - parseFloat(cs.paddingRight);
        const spalteLinks = s.left + parseFloat(cs.paddingLeft);
        return {
          rand: Math.round(innerWidth - spalteRechts),
          randLinks: Math.round(spalteLinks),
          knopf: Math.round(f.width),
          knopfRechts: Math.round(innerWidth - f.right),
        };
      });

      if (!geo) {
        zeilen.push(`${route} ${viewportName}: KEINE SHELL/KEIN KNOPF`);
        await context.close();
        continue;
      }

      /* Symmetrisch hiesse: rechter Rand = linker Rand. Der Knopf muesste dann in
         `randLinks` Pixel passen, abzueglich seines heutigen Abstands zur Kante. */
      const randSymmetrisch = geo.randLinks;
      const frei = randSymmetrisch - geo.knopf - geo.knopfRechts;

      // Heutige Kollisionen zaehlen, als Vergleichsbasis.
      const maxScroll = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
      const step = Math.max(320, Math.round(viewport.height * 0.72));
      let treffer = 0;
      let positionen = 0;
      for (let y = 0; y <= maxScroll; y += step) {
        await page.evaluate((v) => window.scrollTo(0, v), y);
        await page.waitForTimeout(420);
        const kollidiert = await page.evaluate(() => {
          const float = document.querySelector('a.whatsapp-float');
          if (!float || !float.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })) return null;
          const b = float.getBoundingClientRect();
          const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
          let node;
          while ((node = walker.nextNode())) {
            if (!node.nodeValue.trim()) continue;
            const parent = node.parentElement;
            if (!parent || float.contains(parent)) continue;
            if (parent.closest('[aria-hidden="true"], [hidden], .sr-only')) continue;
            const range = document.createRange();
            range.selectNodeContents(node);
            for (const r of range.getClientRects()) {
              if (r.width <= 1 || r.height <= 1) continue;
              const w = Math.min(b.right, r.right) - Math.max(b.left, r.left);
              const h = Math.min(b.bottom, r.bottom) - Math.max(b.top, r.top);
              if (w > 1 && h > 1) return true;
            }
          }
          return false;
        });
        if (kollidiert === null) continue;
        positionen += 1;
        if (kollidiert) treffer += 1;
      }

      zeilen.push(
        `${route} ${viewportName}: Rand rechts ${geo.rand} px, Rand links ${geo.randLinks} px, ` +
          `Knopf ${geo.knopf} px (Abstand ${geo.knopfRechts}), ` +
          `frei bei Symmetrie ${frei >= 0 ? '+' : ''}${frei} px, ` +
          `Kollisionen heute ${treffer}/${positionen}`,
      );
      await context.close();
    }
  }

  await browser.close();
  for (const z of zeilen) console.log(z);
})();
