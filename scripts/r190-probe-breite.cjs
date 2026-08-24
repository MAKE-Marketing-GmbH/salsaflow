/* R190: Was heisst "die Breite der Seite ist uebelst kaputt nach dem Hero" (Raphael, Punkt 4)?
   Bisher wurde das als Links-Rechts-Asymmetrie gedeutet. Das ist eine Deutung, keine Messung.
   Asymmetrie sind 32 gegen 88 px AUSSENRAND — das faellt kaum auf. "Uebelst kaputt" klingt
   nach etwas Sichtbarerem.

   Diese Sonde misst deshalb, wie BREIT der Inhalt Abschnitt fuer Abschnitt wirklich ist,
   von oben nach unten. Springt die Breite zwischen Nachbarn, sieht man genau das, was
   Raphael beschreibt: die Seite "wackelt" in der Breite.

   Gemessen wird die Kante des sichtbaren Inhalts, nicht die Container-Box: ein Container
   kann 1400 px breit sein und trotzdem nur 700 px Text tragen. */
const { chromium } = require('playwright-core');

const BASE = 'http://127.0.0.1:5175';
const VIEWPORTS = [
  ['desktop', { width: 1440, height: 900 }],
  ['mobile', { width: 390, height: 844 }],
];

(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });

  for (const [viewportName, viewport] of VIEWPORTS) {
    const context = await browser.newContext({ viewport, reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto(BASE + '/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.locator('button:has-text("Akzeptieren")').first().click({ timeout: 3000 }).catch(() => {});
    await page.waitForTimeout(1200);
    // Alles einblenden: sonst misst die Sonde Abschnitte, die der Reveal noch versteckt.
    await page.evaluate(async () => {
      const h = document.documentElement.scrollHeight;
      for (let y = 0; y <= h; y += 400) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 400));
    });

    const abschnitte = await page.evaluate(() => {
      const main = document.querySelector('main');
      if (!main) return [];
      const sichtbar = (el) =>
        el.checkVisibility({ checkOpacity: false, checkVisibilityCSS: true }) &&
        !el.closest('[aria-hidden="true"], [hidden]');

      /* Fuer jeden Abschnitt: die aeusserste linke und rechte Kante seiner echten
         Inhalts-Elemente. Text, Bilder, Knoepfe — alles was der Nutzer sieht. */
      const kanten = (wurzel) => {
        let links = Infinity;
        let rechts = -Infinity;
        const walker = document.createTreeWalker(wurzel, NodeFilter.SHOW_ELEMENT);
        let el = wurzel;
        do {
          if (!sichtbar(el)) continue;
          const tag = el.tagName;
          const traegtInhalt =
            /^(P|H1|H2|H3|H4|LI|A|BUTTON|IMG|SPAN|STRONG|EM|TD|TH|LABEL|INPUT)$/.test(tag);
          if (!traegtInhalt) continue;
          const r = el.getBoundingClientRect();
          if (r.width <= 1 || r.height <= 1) continue;
          // Sticky/fixed Elemente gehoeren nicht zum Fluss der Seite.
          const pos = getComputedStyle(el).position;
          if (pos === 'fixed' || pos === 'sticky') continue;
          links = Math.min(links, r.left);
          rechts = Math.max(rechts, r.right);
        } while ((el = walker.nextNode()));
        return links === Infinity ? null : { links: Math.round(links), rechts: Math.round(rechts) };
      };

      const kinder = [...main.children].filter(sichtbar);
      return kinder
        .map((el, i) => {
          const k = kanten(el);
          if (!k) return null;
          const box = el.getBoundingClientRect();
          const marke =
            el.querySelector('h1, h2')?.textContent?.trim().slice(0, 38) ||
            el.id ||
            el.className.split(' ').slice(0, 2).join('.') ||
            el.tagName;
          return {
            nr: i,
            marke,
            links: k.links,
            rechts: k.rechts,
            breite: k.rechts - k.links,
            hoehe: Math.round(box.height),
          };
        })
        .filter(Boolean);
    });

    console.log(`\n=== ${viewportName} (${viewport.width}px) ===`);
    let vorher = null;
    for (const a of abschnitte) {
      // Nur Abschnitte, die echte Hoehe haben — leere Wrapper sagen nichts ueber Breite.
      if (a.hoehe < 40) continue;
      const sprungL = vorher ? a.links - vorher.links : 0;
      const sprungR = vorher ? a.rechts - vorher.rechts : 0;
      const auffaellig = Math.abs(sprungL) > 8 || Math.abs(sprungR) > 8;
      console.log(
        `${String(a.nr).padStart(2)} ${a.marke.padEnd(40)} L${String(a.links).padStart(4)} ` +
          `R${String(a.rechts).padStart(4)} Breite ${String(a.breite).padStart(4)}` +
          (vorher ? `  Sprung L${sprungL >= 0 ? '+' : ''}${sprungL} R${sprungR >= 0 ? '+' : ''}${sprungR}` : '') +
          (auffaellig ? '   <== SPRUNG' : ''),
      );
      vorher = a;
    }
    await context.close();
  }

  await browser.close();
})();
