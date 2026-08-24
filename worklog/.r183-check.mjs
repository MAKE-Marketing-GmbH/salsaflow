// R183-Gate-Pruefer. Misst live gegen Vite 5175 statt zu raten.
// Aufruf: node worklog/.r183-check.mjs g22   (oder "all")
// Exit 0 = PASS, Exit 1 = FAIL. Jede Zeile nennt den Messwert.
import pkg from '/usr/lib/node_modules/playwright/index.js';

const { chromium } = pkg;
const BASE = process.env.SF_BASE ?? 'http://127.0.0.1:5175';
const COOKIE_KEY = 'salsaflow-cookie-ok';

const DESKTOP = { width: 1440, height: 900, dpr: 2 };
const MOBILE = { width: 390, height: 844, dpr: 3 };

async function openPage(browser, route, vp) {
  const page = await browser.newPage({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: vp.dpr,
  });
  await page.addInitScript((key) => window.localStorage.setItem(key, '1'), COOKIE_KEY);
  await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(900);
  return page;
}

// Schutz gegen die falsche Seite. Am 20.08. lief ein Lauf gegen 127.0.0.1:5173
// und vermass AlpenEnergie statt Salsaflow — die Seite antwortete brav mit 200.
// "Antwortet 200" ist deshalb kein Beleg. Der Titel entscheidet.
async function guardBase(browser) {
  const page = await browser.newPage();
  const res = await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
  const title = await page.title();
  await page.close();
  if (res?.status() !== 200 || !/Salsaflow/i.test(title)) {
    console.error(`ABBRUCH: ${BASE} ist nicht Salsaflow. HTTP ${res?.status()}, Titel "${title}"`);
    await browser.close();
    process.exit(2);
  }
  console.log(`GUARD ${BASE} = "${title}"`);
}

const results = [];
function record(gate, ok, detail) {
  results.push({ gate, ok, detail });
  console.log(`${ok ? 'PASS' : 'FAIL'} ${gate}: ${detail}`);
}

// G22 — DE/EN je Sprache ein Kreis, keine breite Oval-Pille.
async function g22(browser) {
  const page = await openPage(browser, '/', DESKTOP);
  const m = await page.evaluate(() => {
    const btns = [...document.querySelectorAll('button, a')].filter((el) => {
      const t = (el.textContent ?? '').trim().toUpperCase();
      return t === 'DE' || t === 'EN';
    });
    return btns.map((el) => {
      const r = el.getBoundingClientRect();
      return { label: el.textContent.trim(), w: r.width, h: r.height };
    });
  });
  await page.close();
  if (m.length < 2) return record('G22', false, `nur ${m.length} DE/EN-Knopf gefunden`);
  // Kreis: Breite und Hoehe fast gleich (Ratio <= 1.25) und Touch >= 32px.
  const bad = m.filter((b) => b.w / b.h > 1.25 || b.h < 32);
  const desc = m.map((b) => `${b.label} ${b.w.toFixed(0)}x${b.h.toFixed(0)}`).join(', ');
  record('G22', bad.length === 0, desc);
}

// G23 — Mobil-Header: genau EIN Menue-Schalter, offen zeigt er Schliessen.
async function g23(browser) {
  const page = await openPage(browser, '/', MOBILE);
  const m = await page.evaluate(async () => {
    const header = document.querySelector('header');
    if (!header) return { missing: true };
    const visible = (el) => {
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== 'hidden';
    };
    const toggles = [...header.querySelectorAll('button')].filter(visible);
    const trigger =
      toggles.find((b) => /men|schliess|close/i.test(`${b.textContent} ${b.getAttribute('aria-label') ?? ''}`)) ??
      toggles[toggles.length - 1];
    if (!trigger) return { missing: true };
    trigger.click();
    await new Promise((r) => setTimeout(r, 500));
    const openHeader = document.querySelector('header');
    const afterToggles = [...openHeader.querySelectorAll('button')].filter(visible);
    const closers = afterToggles.filter((b) =>
      /schliess|close|×|✕/i.test(`${b.textContent} ${b.getAttribute('aria-label') ?? ''}`),
    );
    const inHeader = closers.filter((b) => b.getBoundingClientRect().top < 120);
    return {
      missing: false,
      before: toggles.length,
      closers: closers.length,
      closerInHeader: inHeader.length,
      closerTop: inHeader[0]?.getBoundingClientRect().top ?? null,
    };
  });
  await page.close();
  if (m.missing) return record('G23', false, 'kein Header-Button gefunden');
  const ok = m.closerInHeader >= 1 && m.closers <= 2;
  record('G23', ok, `Schalter zu ${m.before}, Schliessen ${m.closers}, davon im Header ${m.closerInHeader} (top ${m.closerTop})`);
}

// G24 — Desktop-Dropdown oeffnet nach rechts, nicht mittig nach unten.
async function g24(browser) {
  const page = await openPage(browser, '/', DESKTOP);
  // Echter Hover statt click(): der Trigger ist ein Link, click() navigiert weg
  // und zerstoert den Ausfuehrungskontext.
  const trigger = page.locator('header a, header button', { hasText: /^Tanzkurse$/ }).first();
  if ((await trigger.count()) === 0) {
    await page.close();
    return record('G24', false, 'kein Tanzkurse-Trigger im Header');
  }
  await trigger.hover();
  await page.waitForTimeout(700);
  const m = await page.evaluate(() => {
    const trigger = [...document.querySelectorAll('header button, header a')].find(
      (el) => (el.textContent ?? '').trim() === 'Tanzkurse',
    );
    if (!trigger) return { missing: true };
    const tRect = trigger.getBoundingClientRect();
    const panels = [...document.querySelectorAll('header div, header ul, header nav')].filter((el) => {
      const r = el.getBoundingClientRect();
      return r.top > tRect.bottom - 4 && r.height > 40 && r.width > 100 && r.width < 520;
    });
    const panel = panels.sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top)[0];
    if (!panel) return { missing: true, noPanel: true };
    const pRect = panel.getBoundingClientRect();
    return {
      missing: false,
      triggerLeft: tRect.left,
      triggerCenter: tRect.left + tRect.width / 2,
      panelLeft: pRect.left,
      panelCenter: pRect.left + pRect.width / 2,
      panelWidth: pRect.width,
    };
  });
  await page.close();
  if (m.missing) return record('G24', false, m.noPanel ? 'kein Dropdown-Panel sichtbar' : 'kein Tanzkurse-Trigger');
  // Nach rechts: linke Panelkante liegt an der linken Triggerkante, nicht mittig zentriert.
  const leftAligned = Math.abs(m.panelLeft - m.triggerLeft) <= 24;
  const centered = Math.abs(m.panelCenter - m.triggerCenter) <= 12;
  record('G24', leftAligned && !centered, `triggerLeft ${m.triggerLeft.toFixed(0)}, panelLeft ${m.panelLeft.toFixed(0)}, zentriert ${centered}`);
}

// Hilfsfunktion: groesstes Bild einer Route messen (Hero-Band).
async function heroMetrics(browser, route, vp) {
  const page = await openPage(browser, route, vp);
  const m = await page.evaluate(() => {
    const imgs = [...document.querySelectorAll('img')].filter((i) => {
      const r = i.getBoundingClientRect();
      return r.top < 1200 && r.width > 300 && r.height > 100;
    });
    const img = imgs.sort((a, b) => {
      const ra = a.getBoundingClientRect();
      const rb = b.getBoundingClientRect();
      return rb.width * rb.height - ra.width * ra.height;
    })[0];
    if (!img) return { missing: true };
    const r = img.getBoundingClientRect();
    const cs = getComputedStyle(img);
    const wrap = img.parentElement ? getComputedStyle(img.parentElement) : null;
    return {
      missing: false,
      src: img.currentSrc || img.src,
      natW: img.naturalWidth,
      natH: img.naturalHeight,
      left: r.left,
      right: r.right,
      top: r.top,
      height: r.height,
      width: r.width,
      viewportWidth: window.innerWidth,
      radiusImg: parseFloat(cs.borderTopLeftRadius) || 0,
      radiusWrap: wrap ? parseFloat(wrap.borderTopLeftRadius) || 0 : 0,
      objectPosition: cs.objectPosition,
    };
  });
  await page.close();
  return m;
}

// G25 — Tanzkurse-Hero-Band hat sichtbaren Radius.
async function g25(browser) {
  const m = await heroMetrics(browser, '/tanzkurse', DESKTOP);
  if (m.missing) return record('G25', false, 'kein Hero-Bild gefunden');
  const radius = Math.max(m.radiusImg, m.radiusWrap);
  record('G25', radius >= 12, `radius ${radius}px (img ${m.radiusImg}, wrap ${m.radiusWrap}), src ${m.src.split('/').pop()}`);
}

// G26 — Tanzkurse: keine Foto-Doublette, genug verschiedene Motive.
async function g26(browser) {
  const page = await openPage(browser, '/tanzkurse', DESKTOP);
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(600);
  const srcs = await page.evaluate(() =>
    [...document.querySelectorAll('img')]
      .map((i) => (i.currentSrc || i.src).split('/').pop().replace(/-\d{3,4}\.webp$/, '.webp'))
      .filter((s) => s.endsWith('.webp')),
  );
  await page.close();
  const counts = srcs.reduce((acc, s) => ({ ...acc, [s]: (acc[s] ?? 0) + 1 }), {});
  const dupes = Object.entries(counts).filter(([, n]) => n > 1);
  const unique = Object.keys(counts).length;
  record('G26', dupes.length === 0 && unique >= 5, `unique ${unique}, Doubletten ${dupes.map(([s, n]) => `${s}x${n}`).join(' ') || 'keine'}`);
}

// G27 — Level/Aufbau-Block: Wortzahl unter der Schwelle.
async function g27(browser) {
  const page = await openPage(browser, '/tanzkurse', DESKTOP);
  const words = await page.evaluate(() => {
    const heads = [...document.querySelectorAll('h2, h3')].filter((h) =>
      /level|aufbau|kennen/i.test(h.textContent ?? ''),
    );
    if (heads.length === 0) return null;
    const section = heads[0].closest('section') ?? heads[0].parentElement;
    return (section.textContent ?? '').trim().split(/\s+/).length;
  });
  await page.close();
  if (words === null) return record('G27', false, 'kein Level/Aufbau-Block gefunden');
  record('G27', words <= 120, `Level-Block ${words} Woerter (Schwelle 120)`);
}

// G28 — Kursplan-Hero nicht ultrabreit gestreckt, Koepfe ganz.
async function g28(browser) {
  const m = await heroMetrics(browser, '/kursplan', DESKTOP);
  if (m.missing) return record('G28', false, 'kein Hero-Bild gefunden');
  const ratio = m.width / m.height;
  const tanz = await heroMetrics(browser, '/tanzkurse', DESKTOP);
  const sameMotiv = !tanz.missing && tanz.src.split('/').pop() === m.src.split('/').pop();
  // Gestreckt = Band deutlich breiter als das Quellverhaeltnis erlaubt.
  const srcRatio = m.natW / m.natH;
  const stretchFactor = ratio / srcRatio;
  // Radius zaehlt mit: auf Mobil lief das Band eckig full-bleed, waehrend der
  // Rest der Seite rund ist. Raphael hat genau das bei Tanzkurse beanstandet.
  const radius = Math.max(m.radiusImg, m.radiusWrap);
  const mob = await heroMetrics(browser, '/kursplan', MOBILE);
  const mobRadius = mob.missing ? 0 : Math.max(mob.radiusImg, mob.radiusWrap);
  const ok = stretchFactor <= 2.2 && !sameMotiv && radius >= 12 && mobRadius >= 12;
  record('G28', ok, `band ${ratio.toFixed(2)}:1, quelle ${srcRatio.toFixed(2)}:1, faktor ${stretchFactor.toFixed(2)}, radius desktop ${radius}px / mobil ${mobRadius}px, gleichesMotivWieTanzkurse ${sameMotiv}, src ${m.src.split('/').pop()}`);
}

// G30 — Home-Teamfoto: entweder echte Karte mit Rand oder ehrliches Full-bleed ohne Radius.
async function g30(browser) {
  const page = await openPage(browser, '/', DESKTOP);
  const m = await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 700) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 130));
    }
    const img = [...document.querySelectorAll('img')].find((i) => (i.currentSrc || i.src).includes('hp-29'));
    if (!img) return { missing: true };
    const r = img.getBoundingClientRect();
    const cs = getComputedStyle(img);
    const wrap = img.parentElement ? getComputedStyle(img.parentElement) : null;
    return {
      missing: false,
      left: r.left,
      right: r.right,
      vw: window.innerWidth,
      radius: Math.max(parseFloat(cs.borderTopLeftRadius) || 0, wrap ? parseFloat(wrap.borderTopLeftRadius) || 0 : 0),
    };
  });
  await page.close();
  if (m.missing) return record('G30', false, 'hp-29 nicht auf der Home-Seite gefunden');
  const inset = Math.min(m.left, m.vw - m.right);
  const fullBleed = inset <= 2;
  const card = inset >= 16;
  // Kaputt ist genau die Mischung: Radius UND an der Kante klebend.
  const ok = (fullBleed && m.radius < 4) || (card && m.radius >= 12);
  record('G30', ok, `inset ${inset.toFixed(0)}px, radius ${m.radius}px, fullBleed ${fullBleed}, karte ${card}`);
}

// G31 — Unter dem Home-Hero echte Luft.
async function g31(browser) {
  const page = await openPage(browser, '/', DESKTOP);
  const m = await page.evaluate(() => {
    // Hero = das grosse Medium ganz oben. Luft = Weiss zwischen seiner Unterkante
    // und dem ersten echten Inhalt darunter (Text oder Bild, keine Wrapper).
    const hero = [...document.querySelectorAll('img, video')]
      .filter((el) => {
        const r = el.getBoundingClientRect();
        return r.top < 400 && r.width > 400 && r.height > 200;
      })
      .sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top)[0];
    if (!hero) return null;
    const heroBottom = hero.getBoundingClientRect().bottom;
    // Schwebende Elemente (WhatsApp-Blob, Cookie) sind kein Seiteninhalt und
    // duerfen die Luft unter dem Hero nicht kleinrechnen.
    const floating = (el) => {
      for (let n = el; n && n !== document.body; n = n.parentElement) {
        const pos = getComputedStyle(n).position;
        if (pos === 'fixed' || pos === 'sticky') return true;
      }
      return false;
    };
    const next = [...document.querySelectorAll('h1, h2, h3, p, img, a, button')]
      .map((el) => ({ el, r: el.getBoundingClientRect() }))
      .filter(({ el, r }) => r.top >= heroBottom - 1 && r.height > 8 && !el.contains(hero) && !floating(el))
      .sort((a, b) => a.r.top - b.r.top)[0];
    if (!next) return null;
    return { gap: next.r.top - heroBottom, heroBottom, nextTag: next.el.tagName };
  });
  await page.close();
  if (m === null) return record('G31', false, 'Hero oder Folgeinhalt nicht gefunden');
  record('G31', m.gap >= 48, `Luft unter Hero ${m.gap.toFixed(0)}px bis <${m.nextTag}> (Schwelle 48)`);
}

// G32 — Fotos-Raster ohne sichtbaren Bildtext, mehr Kacheln, keine Team-Portraets.
async function g32(browser) {
  const page = await openPage(browser, '/fotos', DESKTOP);
  // Lazy-Bilder wecken, dann warten bis die Route wirklich steht.
  for (let y = 0; y < 8000; y += 700) {
    await page.evaluate((py) => window.scrollTo(0, py), y);
    await page.waitForTimeout(140);
  }
  await page.waitForTimeout(600);
  const m = await page.evaluate(() => {
    const imgs = [...document.querySelectorAll('img')].filter((i) => i.getBoundingClientRect().width > 120);
    const captions = imgs.filter((i) => {
      const fig = i.closest('figure') ?? i.parentElement;
      if (!fig) return false;
      const cap = fig.querySelector('figcaption, p, span');
      if (!cap) return false;
      const r = cap.getBoundingClientRect();
      return r.height > 4 && (cap.textContent ?? '').trim().length > 3;
    });
    const team = imgs.filter((i) => /founders|team-01|teacher-/.test(i.currentSrc || i.src));
    // Leeres alt ist richtig, wenn das Bild in einem beschrifteten Steuerelement
    // sitzt (Button/Link mit aria-label). Screenreader lesen sonst doppelt vor.
    // Gemeldet wird nur ein Bild, das gar keinen zugaenglichen Namen hat.
    const missingAlt = imgs.filter((i) => {
      if ((i.getAttribute('alt') ?? '').trim()) return false;
      const labelled = i.closest('[aria-label], [aria-labelledby]');
      return !labelled;
    });
    return { total: imgs.length, captions: captions.length, team: team.length, missingAlt: missingAlt.length };
  });
  await page.close();
  const ok = m.captions === 0 && m.team === 0 && m.missingAlt === 0 && m.total >= 24;
  record('G32', ok, `Kacheln ${m.total}, sichtbare Bildtexte ${m.captions}, Team-Portraets ${m.team}, ohne alt ${m.missingAlt}`);
}

// G33 — Kontakt-Formular auf Mobil: keine Ueberlaeufe, Touch-Ziele gross genug.
async function g33(browser) {
  const page = await openPage(browser, '/kontakt', MOBILE);
  const m = await page.evaluate(() => {
    const fields = [...document.querySelectorAll('input, select, textarea, button')].filter(
      (el) => el.getBoundingClientRect().width > 0,
    );
    const overflow = fields.filter((el) => {
      const r = el.getBoundingClientRect();
      return r.right > window.innerWidth + 1 || r.left < -1;
    });
    // Visuell versteckte Radios/Checkboxen sind 1x1 gross; geklickt wird ihr Label.
    // Deshalb zaehlt die Flaeche des Labels, nicht die des Inputs.
    const hitTarget = (el) => {
      const own = el.getBoundingClientRect();
      if (own.height >= 40) return own;
      const label = el.closest('label') ?? (el.id ? document.querySelector(`label[for="${el.id}"]`) : null);
      return label ? label.getBoundingClientRect() : own;
    };
    const small = fields.filter((el) => hitTarget(el).height < 40);
    return { fields: fields.length, overflow: overflow.length, small: small.length, docW: document.documentElement.scrollWidth, vw: window.innerWidth };
  });
  await page.close();
  const ok = m.overflow === 0 && m.small === 0 && m.docW <= m.vw + 1;
  record('G33', ok, `Felder ${m.fields}, ueberlaufend ${m.overflow}, unter 40px ${m.small}, scrollWidth ${m.docW}/${m.vw}`);
}

// G34 — Motion: Tokens da, reduced-motion respektiert.
async function g34(browser) {
  const page = await browser.newPage({
    viewport: { width: DESKTOP.width, height: DESKTOP.height },
    deviceScaleFactor: DESKTOP.dpr,
    reducedMotion: 'reduce',
  });
  await page.addInitScript((key) => window.localStorage.setItem(key, '1'), COOKIE_KEY);
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(900);
  const m = await page.evaluate(() => {
    const root = getComputedStyle(document.documentElement);
    const tokens = ['--dur-fast', '--dur-base', '--ease-sf'].map((t) => [t, root.getPropertyValue(t).trim()]);
    const animated = [...document.querySelectorAll('*')].filter((el) => {
      const cs = getComputedStyle(el);
      const dur = parseFloat(cs.transitionDuration) + parseFloat(cs.animationDuration);
      return dur > 0.15;
    });
    return { tokens, animatedUnderReduce: animated.length };
  });
  await page.close();
  const tokenOk = m.tokens.filter(([, v]) => v.length > 0).length >= 2;
  const ok = tokenOk && m.animatedUnderReduce <= 3;
  record('G34', ok, `Tokens ${m.tokens.map(([t, v]) => `${t}=${v || 'leer'}`).join(' ')}, unter reduce noch animiert ${m.animatedUnderReduce}`);
}

const GATES = { g22, g23, g24, g25, g26, g27, g28, g30, g31, g32, g33, g34 };

const arg = (process.argv[2] ?? 'all').toLowerCase();
const wanted = arg === 'all' ? Object.keys(GATES) : [arg];
const unknown = wanted.filter((g) => !GATES[g]);
if (unknown.length > 0) {
  console.error(`unbekanntes Gate: ${unknown.join(', ')}. Bekannt: ${Object.keys(GATES).join(', ')}`);
  process.exit(2);
}

// Ein Browser fuer alle Gates war zu sproede: stirbt er beim vierten Gate, fallen
// alle folgenden mit "Target page, context or browser has been closed" — und das
// liest sich wie ein Seitenfehler, obwohl nur der Browser weg war. Auf dieser Maschine
// laufen zeitweise 30+ fremde Chrome-Prozesse aus Nachbar-Laeufen; der Start scheitert
// dann unter Speicherdruck. Darum: eigener Browser je Gate, plus ein Neuversuch.
// Fremde Browser abschiessen waere falsch, die gehoeren anderen Aufgaben.
const START_FLAGS = ['--disable-dev-shm-usage', '--no-sandbox'];

{
  const b = await chromium.launch({ args: START_FLAGS });
  try {
    await guardBase(b);
  } finally {
    await b.close();
  }
}

for (const g of wanted) {
  let gemacht = false;
  for (let versuch = 1; versuch <= 2 && !gemacht; versuch += 1) {
    const vorher = results.length;
    let b = null;
    try {
      b = await chromium.launch({ args: START_FLAGS });
      await GATES[g](b);
      gemacht = true;
    } catch (err) {
      // Ergebnis des misslungenen Versuchs verwerfen, sonst steht es doppelt da.
      results.length = vorher;
      if (versuch === 2) {
        record(g.toUpperCase(), false, `Fehler ${err.message}`);
      } else {
        await new Promise((r) => setTimeout(r, 3000));
      }
    } finally {
      if (b) await b.close().catch(() => {});
    }
  }
}

const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} PASS`);
process.exit(failed.length > 0 ? 1 : 0);
