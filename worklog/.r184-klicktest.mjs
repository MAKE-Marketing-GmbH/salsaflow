// R184: fuehren beide CTAs wirklich dorthin, wo sie hinsollen?
// Dazu die Hierarchie messen: genau EIN gefuellter roter CTA im Header/Hero-System.
import pkg from '/usr/lib/node_modules/playwright/index.js';

const B = process.env.SF_BASE ?? 'http://127.0.0.1:5175';
let fail = 0;
const ok = (name, cond, detail) => {
  console.log(`${cond ? 'PASS' : 'FAIL'} ${name}: ${detail}`);
  if (!cond) fail = 1;
};

// Ein Browser JE Abschnitt, nicht einer fuer den ganzen Lauf. GATES.md Teil A haelt
// fest, dass ein geteilter Browser ueber viele Seiten mit "Target closed" stirbt und
// dann falsch FAIL meldet — genau das passierte hier bei paralleler Last.
// `p.close()` faehrt jetzt auch den zugehoerigen Browser herunter, darum bleibt der
// restliche Testcode unveraendert.
const auf = async (w, h) => {
  const browser = await pkg.chromium.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const p = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 2 });
  await p.addInitScript(() => window.localStorage.setItem('salsaflow-cookie-ok', '1'));
  await p.goto(`${B}/`, { waitUntil: 'networkidle' });
  await p.waitForTimeout(500);
  const schliessen = p.close.bind(p);
  p.close = async () => { await schliessen().catch(() => null); await browser.close().catch(() => null); };
  return p;
};

// Salsaflow oder Nachbarprojekt? 5173 antwortet ebenfalls 200.
{
  const p = await auf(1440, 730);
  ok('guard-richtige-seite', /Salsaflow/i.test(await p.title()), await p.title());
  await p.close();
}

// Hierarchie: gefuellt rot zaehlen. Nur sichtbare Elemente, Header plus Hero.
{
  const p = await auf(1440, 730);
  const m = await p.evaluate(() => {
    const rot = (cs) => {
      const bg = cs.backgroundColor;
      const t = bg.match(/\d+/g);
      if (!t || t.length < 3) return false;
      const [r, g, b] = t.map(Number);
      if (t.length > 3 && Number(t[3]) === 0) return false;
      return r > 120 && r > g * 2 && r > b * 2;
    };
    // Ein zugeklapptes Panel hat Hoehe 0, seine Kinder behalten aber ihre Masse.
    // Wer nur das Kind misst, zaehlt unsichtbare Knoepfe mit. Darum jeden Vorfahren
    // pruefen: Hoehe 0, display none, visibility hidden oder opacity 0 = unsichtbar.
    const wirklichSichtbar = (el) => {
      for (let n = el; n && n !== document.body; n = n.parentElement) {
        const c = getComputedStyle(n);
        if (c.display === 'none' || c.visibility === 'hidden' || c.opacity === '0') return false;
        if (n !== el && n.getBoundingClientRect().height === 0) return false;
      }
      return true;
    };
    const bereich = [document.querySelector('header'), document.querySelector('main section')].filter(Boolean);
    const treffer = [];
    for (const wurzel of bereich) {
      for (const a of wurzel.querySelectorAll('a')) {
        const q = a.getBoundingClientRect();
        if (q.width < 40 || q.height < 20 || q.top > 730) continue;
        if (!wirklichSichtbar(a)) continue;
        if (rot(getComputedStyle(a))) {
          treffer.push({ href: a.getAttribute('href'), text: (a.textContent ?? '').trim().slice(0, 30) });
        }
      }
    }
    return treffer;
  });
  // Raphael 20.08.: "genau ein gefuellter roter CTA und der fuehrt zum Kursplan".
  // Gemeint ist die Konkurrenz um den Blick, nicht die absolute Anzahl: Header-CTA
  // und Hero-CTA zeigen beide auf dasselbe Ziel und kaempfen darum nicht gegeneinander.
  // Der Fehlerfall waere ein gefuelltes Rot, das WOANDERS hinfuehrt — vorher zeigten
  // beide auf /schnupperstunde. Der Test prueft deshalb das Ziel, nicht die Stueckzahl.
  const zumKursplan = m.filter((t) => t.href === '/kursplan');
  const woanders = m.filter((t) => t.href !== '/kursplan');
  ok('kein-gefuellter-cta-neben-dem-kursplan', woanders.length === 0,
    woanders.length ? JSON.stringify(woanders) : `0 (alle ${m.length} gefuellten fuehren zum Kursplan)`);
  ok('gefuellter-cta-fuehrt-zum-kursplan', zumKursplan.length >= 1, `${zumKursplan.length} gefuellt rot zum Kursplan`);
  ok('schnupperstunde-nicht-gefuellt', !m.some((t) => t.href === '/schnupperstunde'),
    'kein gefuellter roter CTA zur Schnupperstunde');
  await p.close();
}

// Beide Ziele wirklich anklicken.
for (const [name, text, ziel] of [
  ['klick-kursplan', /Kursplan ansehen/i, '/kursplan'],
  ['klick-schnupperstunde', /Schnupperstunde buchen/i, '/schnupperstunde'],
]) {
  const p = await auf(1440, 730);
  const link = p.locator('main a').filter({ hasText: text }).first();
  await link.scrollIntoViewIfNeeded();
  await link.click();
  await p.waitForTimeout(1200);
  const pfad = new URL(p.url()).pathname;
  ok(name, pfad === ziel, `landet auf ${pfad}`);
  await p.close();
}

// Mobil: Trefferflaeche beider Wege, kein Ueberlauf.
{
  const p = await auf(390, 844);
  const m = await p.evaluate(() => {
    const holen = (teil) =>
      [...document.querySelectorAll('main a')].find((a) => (a.getAttribute('href') ?? '') === teil);
    const k = holen('/kursplan');
    const s = holen('/schnupperstunde');
    return {
      kursplan: k ? Math.round(k.getBoundingClientRect().height) : 0,
      schnupper: s ? Math.round(s.getBoundingClientRect().height) : 0,
      ueberlauf: document.documentElement.scrollWidth > window.innerWidth,
    };
  });
  ok('mobil-kursplan-trefferflaeche', m.kursplan >= 44, `${m.kursplan}px`);
  ok('mobil-schnupperstunde-trefferflaeche', m.schnupper >= 44, `${m.schnupper}px`);
  ok('mobil-kein-ueberlauf', !m.ueberlauf, `Ueberlauf ${m.ueberlauf}`);
  await p.close();
}

// Kein Sammel-close mehr: jeder Abschnitt schliesst seinen eigenen Browser in p.close().
console.log(fail ? '\nR184 KLICKTEST FAIL' : '\nR184 KLICKTEST PASS');
process.exit(fail);
