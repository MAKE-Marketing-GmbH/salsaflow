/* R190, zweiter Schritt zu Grok Runde 4, Befund 3.
   Erster Schritt (`r190-probe-wa-erstbild.cjs`) misst bei y=0 null Texttreffer,
   der Screenshot desselben Laufs zeigt den Knopf aber direkt an der Sa-Spalte.
   Beides stimmt: der Knopf ueberlappt keinen Text-Kasten, er steht daneben.

   Also ist die richtige Frage nicht "beruehrt er Text", sondern "wie nah". Diese
   Sonde listet alles im Umkreis des Knopfes mit Abstand, sortiert nach Naehe.
   Zusaetzlich wird gemessen, ob der Knopf ueber einem Element mit eigenem
   Hintergrund oder ueber einer aktiven Zelle liegt — das erklaert den optischen
   Eindruck "deckt ab", den eine reine Kasten-Ueberlappung nicht faengt. */
const { chromium } = require('playwright-core');

const BASE = 'http://127.0.0.1:5175';
const FAELLE = [
  ['/', 'home'],
  ['/kursplan', 'kursplan'],
];
const VIEWPORT = { width: 390, height: 844 };
const UMKREIS = 24; // px, ab hier gilt "der Knopf draengt sich an den Inhalt"

const MESSUNG = (umkreis) => {
  const float = document.querySelector('a.whatsapp-float');
  if (!float) return { sichtbar: false };
  const k = float.getBoundingClientRect();
  const nah = [];

  const abstand = (r) => {
    const dx = Math.max(k.left - r.right, r.left - k.right, 0);
    const dy = Math.max(k.top - r.bottom, r.top - k.bottom, 0);
    return Math.round(Math.hypot(dx, dy));
  };

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    const text = node.textContent?.trim();
    const parent = node.parentElement;
    if (!text || text.length < 2 || !parent || float.contains(parent)) continue;
    if (parent.closest('.sr-only')) continue;
    if (!parent.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })) continue;
    const range = document.createRange();
    range.selectNodeContents(node);
    for (const r of range.getClientRects()) {
      if (r.bottom < 0 || r.top > innerHeight) continue;
      const d = abstand(r);
      if (d <= umkreis) {
        nah.push({ art: 'Text', text: text.slice(0, 36), abstand: d, rechts: Math.round(r.right) });
        break;
      }
    }
  }

  // Was liegt UNTER dem Knopfmittelpunkt? Das faengt "deckt eine Zelle ab",
  // auch wenn deren Text daneben sitzt.
  const mitte = document.elementsFromPoint(k.left + k.width / 2, k.top + k.height / 2)
    .filter((el) => !float.contains(el) && el !== float)
    .slice(0, 4)
    .map((el) => {
      const cs = getComputedStyle(el);
      return {
        tag: el.tagName.toLowerCase(),
        klasse: (el.className?.toString?.() || '').slice(0, 48),
        text: (el.textContent || '').trim().slice(0, 36),
        hintergrund: cs.backgroundColor,
        rand: cs.borderBottomWidth,
      };
    });

  return {
    sichtbar: true,
    knopf: { links: Math.round(k.left), oben: Math.round(k.top), breite: Math.round(k.width) },
    nah: nah.sort((a, b) => a.abstand - b.abstand),
    unterMitte: mitte,
  };
};

(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });

  for (const [route, name] of FAELLE) {
    const context = await browser.newContext({ viewport: VIEWPORT, reducedMotion: 'no-preference' });
    const page = await context.newPage();
    await page.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.locator('button:has-text("Akzeptieren")').first().click({ timeout: 3000 }).catch(() => {});
    await page.waitForTimeout(2600);
    const r = await page.evaluate(MESSUNG, UMKREIS);
    console.log(`\n${route} (${name}), Viewport 390x844, y=0, nach 2,6 s`);
    if (!r.sichtbar) {
      console.log('  kein Knopf');
    } else {
      console.log(`  Knopf x${r.knopf.links} y${r.knopf.oben}, Breite ${r.knopf.breite}`);
      console.log(`  Inhalt naeher als ${UMKREIS} px: ${r.nah.length}`);
      for (const n of r.nah) console.log(`    ${String(n.abstand).padStart(3)} px  "${n.text}"`);
      console.log('  unter der Knopfmitte:');
      for (const u of r.unterMitte) {
        console.log(`    <${u.tag}> bg ${u.hintergrund}, Rand-unten ${u.rand}, Text "${u.text}"`);
      }
    }
    await context.close();
  }

  await browser.close();
})();
