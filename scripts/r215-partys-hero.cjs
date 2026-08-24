// R215: Misst den /mehr/partys-Hero oben UND unten gegen alle Foto-Band-Geschwister.
//
// Zwei Fragen aus dem Urteil (Critic 23.08. 23:52):
//   1) OBEN — Breadcrumb-Unterkante vs. H1-Oberkante. Kritiker: 1440 -7px,
//      also Ueberlappung.
//   2) UNTEN — tiefstes Element der CTA-Reihe (bzw. Microcopy, wo sie sichtbar
//      ist) vs. Bandoberkante. Kritiker: 0px auf 1440, 12px auf 390.
//
// Die Vergleichsseiten laufen mit, weil das Urteil einen Korridor nennt
// (/events 64, /preise 127, /team 64, /fotos 89, /kontakt 89, /tanzkurse 279,
// Home 252). Wer den Ausreisser fixt, muss den Korridor treffen, nicht raten.
//
// WICHTIG: Auf Desktop ist die Microcopy von /mehr/partys per CSS ausgeblendet
// (Kommentar in PartysPage.tsx, R151: "Desktop-CSS blendet Microcopy aus, damit
// das Band im 730-Fold endet"). Deshalb wird die Sichtbarkeit der Microcopy
// mitgemessen statt angenommen — das `pb-8` aus R77 greift dort ins Leere.
const { chromium } = require('playwright-core');

const BASE = process.env.BASE || 'http://127.0.0.1:4724';
const ROUTES = (
  process.env.ROUTES ||
  '/mehr/partys,/events,/preise,/team,/fotos,/kontakt,/tanzkurse,/tanzkurse/salsa,/tanzkurse/bachata,/tanzkurse/heels'
).split(',');

const VIEWPORTS = [
  { tag: '1440x900', width: 1440, height: 900 },
  { tag: '1440x730', width: 1440, height: 730 },
  { tag: '390', width: 390, height: 844 },
];

(async () => {
  const browser = await chromium.launch();

  for (const vp of VIEWPORTS) {
    console.log(`\n########## ${vp.tag} (${vp.width}x${vp.height})`);
    for (const route of ROUTES) {
      const ctx = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: 1,
      });
      const page = await ctx.newPage();
      // Key am Code nachgeschlagen (CookieBanner.tsx:18/46).
      await page.addInitScript(() => localStorage.setItem('salsaflow-cookie-ok', '1'));
      await page.goto(BASE + route, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1100);

      const r = await page.evaluate(() => {
        const vis = (el) => {
          const s = getComputedStyle(el);
          if (s.display === 'none' || s.visibility === 'hidden') return false;
          if (Number(s.opacity) < 0.05) return false;
          const b = el.getBoundingClientRect();
          return b.width > 1 && b.height > 1;
        };

        // Nav-Pille: NICHT --nav-h, sondern die gerenderte Unterkante. Der
        // Hoehenfilter haelt das zugeklappte Mobilmenue draussen (R213-Fehler:
        // "tiefstes Element im Header" lieferte 911px auf jeder Route).
        const pille = [...document.querySelectorAll('header .t-acc')]
          .filter((el) => vis(el) && el.getBoundingClientRect().height < 120)
          .map((el) => el.getBoundingClientRect())
          .sort((a, b) => a.top - b.top)[0];
        const navBottom = pille ? Math.round(pille.bottom) : null;

        const crumbNav = document.querySelector('nav[aria-label="Brotkrümelnavigation"], nav[aria-label="Breadcrumb"]');
        const crumbBottom = crumbNav && vis(crumbNav) ? Math.round(crumbNav.getBoundingClientRect().bottom) : null;

        const h1 = document.querySelector('h1');
        const h1r = h1 ? h1.getBoundingClientRect() : null;

        // Full-bleed Band = erstes Bild ueber fast die ganze Breite.
        const band = [...document.querySelectorAll('main img, section img')]
          .filter((el) => vis(el) && el.getBoundingClientRect().width > window.innerWidth * 0.9)
          .map((el) => el.getBoundingClientRect())
          .sort((a, b) => a.top - b.top)[0];
        const bandTop = band ? Math.round(band.top) : null;

        // Tiefstes sichtbares Ink-Element des Heros OBERHALB des Bandes. Damit
        // faellt automatisch die richtige Kante heraus: Microcopy, wo sie
        // sichtbar ist, sonst die CTA-Reihe.
        let lastBottom = null;
        let lastWhat = null;
        const heroSection = document.querySelector('main section') || document.querySelector('section');
        if (heroSection && band) {
          heroSection.querySelectorAll('a, button, p, span, h1, h2, li, dt, dd').forEach((el) => {
            if (!vis(el)) return;
            const b = el.getBoundingClientRect();
            if (b.top >= band.top) return;
            const hasText = [...el.childNodes].some(
              (n) => n.nodeType === 3 && n.textContent.trim().length > 0,
            );
            if (!hasText) return;
            if (lastBottom === null || b.bottom > lastBottom) {
              lastBottom = b.bottom;
              lastWhat = (el.textContent || '').trim().slice(0, 32);
            }
          });
        }

        // Ist die Microcopy sichtbar? Auf /mehr/partys blendet Desktop-CSS sie aus.
        const micro = [...document.querySelectorAll('section p, section span')].find((el) =>
          /Du musst nicht perfekt sein|You don't have to be perfect/.test(el.textContent || ''),
        );

        return {
          navBottom,
          crumbBottom,
          h1Top: h1r ? Math.round(h1r.top) : null,
          bandTop,
          lastBottom: lastBottom === null ? null : Math.round(lastBottom),
          lastWhat,
          microExists: Boolean(micro),
          microVisible: micro ? vis(micro) : null,
        };
      });

      const obenCrumb = r.crumbBottom !== null && r.h1Top !== null ? r.h1Top - r.crumbBottom : null;
      const obenNav = r.navBottom !== null && r.h1Top !== null ? r.h1Top - r.navBottom : null;
      const unten = r.bandTop !== null && r.lastBottom !== null ? r.bandTop - r.lastBottom : null;

      console.log(
        `  ${route.padEnd(22)} navUK=${String(r.navBottom).padStart(4)}` +
          ` crumbUK=${String(r.crumbBottom).padStart(4)}` +
          ` h1Top=${String(r.h1Top).padStart(4)}` +
          `  OBEN(crumb)=${obenCrumb === null ? '   -' : String(obenCrumb).padStart(4)}` +
          `${obenCrumb !== null && obenCrumb < 0 ? ' <<< UEBERLAPPUNG' : ''}` +
          `  OBEN(nav)=${obenNav === null ? '   -' : String(obenNav).padStart(4)}`,
      );
      console.log(
        `  ${''.padEnd(22)} letzteInk=${String(r.lastBottom).padStart(4)} ("${r.lastWhat}")` +
          ` bandTop=${String(r.bandTop).padStart(4)}` +
          `  UNTEN=${unten === null ? '   -' : String(unten).padStart(4)}` +
          `${unten !== null && unten <= 12 ? ' <<< KLEBT' : ''}` +
          (r.microExists ? `  micro sichtbar=${r.microVisible}` : ''),
      );

      await ctx.close();
    }
  }
  await browser.close();
})();
