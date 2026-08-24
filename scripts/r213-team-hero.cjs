// R213: Misst den Team-Hero oben UND unten, bevor irgendetwas geaendert wird.
//
// Zwei getrennte Fragen, die der Kritiker in einem Befund zusammenfasst:
//   1) OBEN — wo endet die Navigations-PILLE wirklich (nicht --nav-h, sondern die
//      gerenderte Unterkante inkl. Rundung/Schatten), und wo beginnt die H1?
//      Ueberlappt beides?
//   2) UNTEN — wie viel Papier liegt zwischen dem TIEFSTEN Element der CTA-Reihe
//      und der Bandoberkante? Der Textlink reicht weiter nach unten als die Pill,
//      also wird ab ihm gemessen (Lehre aus R208).
//
// Zum Vergleich laufen die Schwesterseiten mit, damit "zu wenig Luft" eine Zahl
// gegen andere Zahlen ist und keine Meinung.
const { chromium } = require('playwright-core');

const BASE = process.env.BASE || 'http://127.0.0.1:4712';
const ROUTES = (process.env.ROUTES || '/team,/events,/tanzkurse,/preise').split(',');

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
      // Key/Wert am Code nachgeschlagen (CookieBanner.tsx:18/46).
      await page.addInitScript(() => localStorage.setItem('salsaflow-cookie-ok', '1'));
      await page.goto(BASE + route, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1100);

      const r = await page.evaluate(() => {
        const vis = (el) => {
          const s = getComputedStyle(el);
          return s.display !== 'none' && s.visibility !== 'hidden' && Number(s.opacity) > 0.05;
        };
        // Die Navigation ist eine gerundete Pille (`.t-acc`) im Header — gesucht ist
        // ihre gerenderte Unterkante, nicht die CSS-Variable --nav-h.
        //
        // ERSTER SELEKTOR WAR FALSCH: "tiefstes grosses Element im Header" lieferte
        // 911px Unterkante bei 900px Viewport, auf JEDER Route identisch. Das war das
        // zugeklappte Mobilmenue (`h-[calc(100dvh-3rem)]`, 844px hoch), das im DOM
        // steht und weder display:none noch opacity:0 traegt. Die daraus errechnete
        // "Ueberlappung" von -835px war mein Messfehler, kein Befund. Jetzt wird die
        // Pille direkt adressiert und zusaetzlich auf Hoehe < 120px geprueft.
        const pille = [...document.querySelectorAll('header .t-acc')]
          .filter((el) => vis(el) && el.getBoundingClientRect().height < 120)
          .map((el) => el.getBoundingClientRect())
          .sort((a, b) => a.top - b.top)[0];
        const navBottom = pille ? Math.round(pille.bottom) : null;

        const h1 = document.querySelector('h1');
        const h1r = h1 ? h1.getBoundingClientRect() : null;

        // Das full-bleed Band ist das erste breite Bild unter dem Text.
        const band = [...document.querySelectorAll('main img, section img')]
          .filter((el) => vis(el) && el.getBoundingClientRect().width > window.innerWidth * 0.9)
          .map((el) => el.getBoundingClientRect())
          .sort((a, b) => a.top - b.top)[0];

        // Tiefstes Element der CTA-Reihe: Pill ODER Textlink daneben.
        let ctaBottom = null;
        let ctaWhat = null;
        const heroSection = document.querySelector('main section') || document.querySelector('section');
        if (heroSection) {
          heroSection.querySelectorAll('a, button').forEach((el) => {
            if (!vis(el)) return;
            const b = el.getBoundingClientRect();
            if (b.width < 40 || b.height < 16) return;
            if (band && b.top >= band.top) return; // nichts unterhalb des Bands
            if (ctaBottom === null || b.bottom > ctaBottom) {
              ctaBottom = b.bottom;
              ctaWhat = (el.textContent || '').trim().slice(0, 28);
            }
          });
        }

        return {
          navBottom,
          navVar: getComputedStyle(document.documentElement).getPropertyValue('--nav-h').trim(),
          h1Top: h1r ? Math.round(h1r.top) : null,
          h1Text: h1 ? h1.textContent.trim().slice(0, 34) : null,
          ctaBottom: ctaBottom === null ? null : Math.round(ctaBottom),
          ctaWhat,
          bandTop: band ? Math.round(band.top) : null,
        };
      });

      const luftOben = r.navBottom !== null && r.h1Top !== null ? r.h1Top - r.navBottom : null;
      const luftUnten = r.ctaBottom !== null && r.bandTop !== null ? r.bandTop - r.ctaBottom : null;

      console.log(
        `  ${route.padEnd(12)} navUnterkante=${String(r.navBottom).padStart(4)} (var ${r.navVar})` +
          `  h1Top=${String(r.h1Top).padStart(4)}` +
          `  LUFT-OBEN=${luftOben === null ? '  ?' : String(luftOben).padStart(4)}` +
          `${luftOben !== null && luftOben < 0 ? '  <<< UEBERLAPPUNG' : ''}`,
      );
      console.log(
        `  ${''.padEnd(12)} ctaUnterkante=${String(r.ctaBottom).padStart(4)} ("${r.ctaWhat}")` +
          `  bandTop=${String(r.bandTop).padStart(4)}` +
          `  LUFT-UNTEN=${luftUnten === null ? '  ?' : String(luftUnten).padStart(4)}`,
      );

      await ctx.close();
    }
  }
  await browser.close();
})();
