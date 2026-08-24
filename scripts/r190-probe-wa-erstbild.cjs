/* R190: Widerlegt oder bestaetigt Grok Runde 4, Befund 3.
   Grok sagt: der WhatsApp-Knopf deckt auf `home-mobil-settled.png` die Zeile
   "aus 104 Google-Bewertungen" und auf `kursplan-mobil-settled.png` die Spalte
   "Sa 22.08." ab. Das Kollisionsgate (`r189-whatsapp-collisions.cjs`) meldete
   dagegen null Treffer auf 16 Kombinationen.

   Beide koennen nicht stimmen. Diese Sonde stellt GENAU die Lage her, die der
   Screenshot zeigt, statt die des Gates:

     Gate    scrollt zu y, wartet 240 ms, misst. Der Knopf ist dann ein Kreis
             (Scrollen erzwingt `compact`), und der Ausweich-Loeser hat bereits
             reagiert.
     Bild    frische Seite, KEIN Scroll, ~2,4 s Ruhe. Der Knopf ist die Pille
             beziehungsweise sitzt auf seiner Startposition.

   Gemessen wird bei y=0 zu vier Zeitpunkten, damit sichtbar wird, WANN die
   Kollision entsteht und ob sie sich von selbst aufloest. */
const { chromium } = require('playwright-core');

const BASE = 'http://127.0.0.1:5175';
const FAELLE = [
  ['/', 'Bewertungen'],
  ['/kursplan', '22.08.'],
];
const ZEITPUNKTE = [400, 1200, 2600, 4000];
const VIEWPORT = { width: 390, height: 844 };

const MESSUNG = () => {
  const sichtbar = (el) =>
    !el.closest('[hidden], [aria-hidden="true"], [inert]') &&
    el.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true });
  const float = document.querySelector('a.whatsapp-float');
  if (!float || !sichtbar(float)) return { sichtbar: false };
  const knopf = float.getBoundingClientRect();
  const ueberlappt = (r) =>
    Math.min(knopf.right, r.right) - Math.max(knopf.left, r.left) > 1 &&
    Math.min(knopf.bottom, r.bottom) - Math.max(knopf.top, r.top) > 1;

  const treffer = [];
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
        treffer.push({
          text: text.slice(0, 40),
          ueberdeckt: Math.round(Math.min(knopf.right, r.right) - Math.max(knopf.left, r.left)),
        });
        break;
      }
    }
  }
  return {
    sichtbar: true,
    knopf: {
      links: Math.round(knopf.left),
      oben: Math.round(knopf.top),
      breite: Math.round(knopf.width),
      hoehe: Math.round(knopf.height),
    },
    treffer,
  };
};

(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  let gesamtTreffer = 0;

  for (const [route, gesucht] of FAELLE) {
    const context = await browser.newContext({ viewport: VIEWPORT, reducedMotion: 'no-preference' });
    const page = await context.newPage();
    await page.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.locator('button:has-text("Akzeptieren")').first().click({ timeout: 3000 }).catch(() => {});
    console.log(`\n${route}  (Grok nennt: "${gesucht}")  — kein Scroll, y=0`);

    let vergangen = 0;
    for (const ms of ZEITPUNKTE) {
      await page.waitForTimeout(ms - vergangen);
      vergangen = ms;
      const r = await page.evaluate(MESSUNG);
      if (!r.sichtbar) {
        console.log(`  ${String(ms).padStart(4)} ms: Knopf nicht sichtbar`);
        continue;
      }
      const k = r.knopf;
      const liste = r.treffer.length
        ? r.treffer.map((t) => `"${t.text}" (${t.ueberdeckt} px)`).join(', ')
        : 'keine';
      console.log(
        `  ${String(ms).padStart(4)} ms: Knopf x${k.links} y${k.oben} ${k.breite}x${k.hoehe} — Treffer: ${liste}`,
      );
      gesamtTreffer += r.treffer.length;
    }
    await page.screenshot({ path: `/tmp/r190-wa-${route === '/' ? 'home' : 'kursplan'}-y0.png` });
    await context.close();
  }

  console.log(`\nSumme Texttreffer bei y=0: ${gesamtTreffer}`);
  await browser.close();
})();
