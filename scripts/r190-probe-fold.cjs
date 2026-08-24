/* R190: Traegt der Fold die groesseren Abstaende im Hero?

   Anlass: Raphaels Punkt 5 ("unter der Subline mehr Platz"). Der Abstand unter der
   Subline steht jetzt auf mt-10 / mobil mt-8, vorher mt-8 / mt-6.

   Der Kommentar in Hero.tsx warnt ausdruecklich: auf 360x780 blieben vorher 23 px
   Reserve, bis der zweite CTA unter den Fold faellt. Mobil sind 8 px dazugekommen.
   Diese Sonde misst, wieviel davon uebrig ist — auf der engsten realistischen
   Breite und auf dem Referenzgeraet. */
const { chromium } = require('playwright-core');

const BASE = 'http://127.0.0.1:5175';
const GERAETE = [
  ['360x780 (engstes)', { width: 360, height: 780 }],
  ['390x844 (Referenz)', { width: 390, height: 844 }],
  ['1440x900 (Desktop)', { width: 1440, height: 900 }],
];

const MESSUNG = () => {
  const subline = [...document.querySelectorAll('h1 ~ p, h1 + * p')].find((p) =>
    /Studios direkt am Bahnhof|studios right by/i.test(p.textContent || ''),
  );
  /* Nur Links IM Hero. Ein nacktes querySelectorAll('a') findet zuerst die
     Kopfzeile — daher stand hier ein negativer Abstand. */
  const hero = subline ? subline.closest('section') || document.body : document.body;
  const kursplan = [...hero.querySelectorAll('a')].find((a) =>
    /Kursplan ansehen|See the schedule/i.test(a.textContent || ''),
  );
  const schnupper = [...hero.querySelectorAll('a')].find((a) =>
    /Schnupperstunde buchen|Book a trial/i.test(a.textContent || ''),
  );
  const box = (el) => (el ? el.getBoundingClientRect() : null);
  const s = box(subline);
  const k = box(kursplan);
  const t = box(schnupper);
  return {
    sublineUnten: s ? Math.round(s.bottom) : null,
    abstandZumCta: s && k ? Math.round(k.top - s.bottom) : null,
    zweiterCtaUnten: t ? Math.round(t.bottom) : null,
    fold: innerHeight,
    reserve: t ? Math.round(innerHeight - t.bottom) : null,
  };
};

(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  let engster = Infinity;

  for (const [name, viewport] of GERAETE) {
    const context = await browser.newContext({ viewport, reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto(BASE + '/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.locator('button:has-text("Akzeptieren")').first().click({ timeout: 3000 }).catch(() => {});
    await page.waitForTimeout(900);
    const r = await page.evaluate(MESSUNG);
    console.log(
      `${name.padEnd(22)} Subline endet ${r.sublineUnten}, Abstand zum CTA ${r.abstandZumCta} px, ` +
        `zweiter CTA endet ${r.zweiterCtaUnten} von ${r.fold} — Reserve ${r.reserve} px`,
    );
    if (r.reserve !== null && r.reserve < engster) engster = r.reserve;
    await context.close();
  }

  console.log(`\nKnappste Reserve: ${engster} px`);
  if (engster < 0) {
    console.log('FAIL: der zweite CTA faellt unter den Fold.');
    process.exitCode = 1;
  } else {
    console.log('PASS: der zweite CTA bleibt ueber dem Fold.');
  }
  await browser.close();
})();
