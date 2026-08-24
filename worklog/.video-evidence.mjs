import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from '/usr/lib/node_modules/playwright/index.mjs';

const ROOT = '/root/clients/salsaflow-w1/worklog/shots/S7-video-evidence';
const BASE = 'http://127.0.0.1:5175';
await mkdir(ROOT, { recursive: true });

const report = [];
function add(id, ok, note) {
  report.push({ id, ok, note });
  console.log(`${ok ? 'PASS' : 'FAIL'} ${id} ${note}`);
}

const browser = await chromium.launch({
  handleSIGINT: false,
  handleSIGTERM: false,
  handleSIGHUP: false,
});

async function pageAt(path, width = 1440, height = 900, cookieOk = true) {
  const page = await browser.newPage({
    viewport: { width, height },
    deviceScaleFactor: 2,
  });
  await page.addInitScript((ok) => {
    try {
      if (ok) localStorage.setItem('salsaflow-cookie-ok', '1');
      else localStorage.removeItem('salsaflow-cookie-ok');
    } catch {
      /* ignore */
    }
  }, cookieOk);
  const res = await page.goto(`${BASE}${path}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(500);
  const img = page.locator('main img').first();
  if (await img.count()) {
    await img.waitFor({ state: 'visible', timeout: 12000 }).catch(() => {});
  }
  return { page, status: res?.status() ?? 0 };
}

{
  const { page, status } = await pageAt('/');
  const body = await page.locator('body').innerText();
  add('v1-home-200', status === 200, `HTTP ${status}`);
  add('v6-coaching-weg', !/1:1 Coaching/i.test(body), 'kein 1:1-Coaching');
  const heroRound = await page.evaluate(() => {
    const imgs = [...document.querySelectorAll('main img')].filter((el) => el.getBoundingClientRect().width > 200);
    const img = imgs[0];
    if (!img) return { ok: false, note: 'no-hero' };
    let el = img;
    for (let i = 0; i < 8 && el; i++) {
      const cs = getComputedStyle(el);
      const r = cs.borderRadius;
      if (r && r !== '0px' && cs.overflow !== 'visible') return { ok: true, note: `r=${r} ov=${cs.overflow}` };
      if (r && !/^0px/.test(r.split(' ')[0])) return { ok: true, note: `r=${r}` };
      el = el.parentElement;
    }
    return { ok: false, note: 'no-radius' };
  });
  add('v4-hero-rund', heroRound.ok, heroRound.note);
  const kurs = page.getByRole('link', { name: /^Tanzkurse$/i }).first();
  add('v2-nav-kurse', await kurs.isVisible(), 'Nav Tanzkurse');
  await page.evaluate(async () => {
    const imgs = [...document.querySelectorAll('main img')].filter((el) => el.getBoundingClientRect().width > 280);
    for (const el of imgs) {
      el.loading = 'eager';
      if (el.naturalWidth > 0) continue;
      try {
        await Promise.race([el.decode(), new Promise((_, rej) => setTimeout(() => rej(new Error('t')), 2500))]);
      } catch {
        /* next */
      }
    }
  });
  const reso = await page.evaluate(() => {
    const imgs = [...document.querySelectorAll('main img')].filter((el) => el.getBoundingClientRect().width > 280);
    const rows = imgs.map((el) => {
      const r = el.getBoundingClientRect();
      return { src: el.getAttribute('src'), nw: el.naturalWidth, dw: Math.round(r.width) };
    });
    const unread = rows.filter((row) => row.nw === 0);
    const small = rows.filter((row) => row.nw > 0 && row.nw < 900);
    return { n: rows.length, unread: unread.length, small: small.length, sample: rows.slice(0, 4) };
  });
  add('v3-reso', reso.n > 0 && reso.unread === 0 && reso.small === 0, JSON.stringify(reso));
  const lead = await page.evaluate(() => {
    const ps = [...document.querySelectorAll('main p')].map((p) => (p.textContent || '').trim());
    return ps.find((t) => t.length > 40) || '';
  });
  add('v5-text', lead.length > 40 && lead.length < 280 && !/Seele|Poesie|magisch/i.test(lead), `leadLen=${lead.length} t=${lead.slice(0, 70)}`);
  await page.screenshot({ path: `${ROOT}/home-1440.png`, timeout: 15000 });
  await page.close();
}

{
  const { page } = await pageAt('/', 390, 844, false);
  const cookie = page.getByTestId('cookie-accept');
  const vis = await cookie.isVisible().catch(() => false);
  const gutter = await page.evaluate(() => {
    const btn = document.querySelector('[data-testid="cookie-accept"]');
    let el = btn;
    for (let i = 0; i < 8 && el; i++) {
      if ((el.className || '').toString().includes('pr-[5.5rem]')) {
        return getComputedStyle(el).paddingRight;
      }
      el = el.parentElement;
    }
    return '';
  });
  add('v9-cookie', vis && gutter === '88px', `visible=${vis} pr=${gutter}`);
  await page.close();
}

{
  const { page } = await pageAt('/tanzkurse/salsa');
  const slots = await page.locator('[data-testid="style-slot"]').count();
  const img = page.locator('main img').first();
  const box = await img.boundingBox();
  add('v7-salsa-split', Boolean(box && box.x > 400 && box.width > 400), `img x=${box?.x} w=${box?.width}`);
  add('v7-salsa-slots', slots > 0, `slots=${slots}`);
  await page.close();
}

{
  const { page } = await pageAt('/tanzkurse/bachata');
  const img = page.locator('main img').first();
  const box = await img.boundingBox();
  const src = (await img.getAttribute('src')) || '';
  add('v7-bachata-foto', Boolean(box && box.width > 300), `w=${box?.width}`);
  add(
    'v7-bachata-src',
    src.includes('party-33') && !src.includes('offer-bachata') && !src.includes('studiowand'),
    `src=${src}`,
  );
  await page.close();
}

{
  const { page } = await pageAt('/tanzkurse/heels');
  add('v10-heels', /Heels/i.test(await page.locator('h1').innerText()), 'H1');
  add('v10-heels-slots', (await page.locator('[data-testid="style-slot"]').count()) > 0, 'slots');
  await page.close();
}

{
  const { page } = await pageAt('/faq');
  const q = page.getByText('Brauche ich Tanzschuhe für den Start?').first();
  await q.scrollIntoViewIfNeeded();
  await q.click();
  await page.waitForTimeout(350);
  const link = page.getByRole('link', { name: 'Zur Seite Tanzschuhe' });
  add('v8-faq-open', (await page.locator('details[open]').count()) >= 1, 'open');
  add('v18-faq-schuhe-link', (await link.getAttribute('href')) === '/mehr/tanzschuhe', 'link');
  await page.close();
}

{
  const { page } = await pageAt('/mehr/tanzschuhe');
  const img = page.locator('[data-tanzschuhe-page] img').first();
  add('v18-schuhe-img', await img.isVisible().catch(() => false), 'hero');
  await page.close();
}

{
  const { page } = await pageAt('/mehr/collabs');
  const before = await page.locator('img').count();
  await page.evaluate(() => window.scrollTo(0, 2400));
  await page.waitForTimeout(600);
  const after = await page.locator('img').count();
  add('v17-collabs-scroll', after >= 4 && after >= before, `before=${before} after=${after}`);
  await page.screenshot({ path: `${ROOT}/collabs-y2400.png`, timeout: 15000 });
  await page.close();
}

{
  const { page } = await pageAt('/mehr/partys');
  const wa = await page.evaluate(() => {
    const el = document.querySelector('a.whatsapp-float');
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    const span = el.querySelector('span');
    return {
      w: Math.round(r.width),
      h: Math.round(r.height),
      radius: cs.borderRadius,
      anim: cs.animationName,
      label: span ? getComputedStyle(span).display : 'none',
    };
  });
  add(
    'v19-wa-kreis',
    Boolean(wa && Math.abs(wa.w - wa.h) <= 4 && wa.label === 'none'),
    JSON.stringify(wa),
  );
  add('v9-wa-anim', Boolean(wa && wa.anim && wa.anim !== 'none'), `anim=${wa?.anim}`);
  const blob = await page.evaluate(() => {
    const el = document.querySelector(
      '[data-partys-page] section.relative.isolate.overflow-hidden > div.pointer-events-none[aria-hidden]',
    );
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { w: Math.round(r.width), h: Math.round(r.height) };
  });
  add('v19-blob-rund', Boolean(blob && Math.abs(blob.w - blob.h) <= 8 && blob.w >= 80), JSON.stringify(blob));
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(200);
  const reveal0 = await page.evaluate(() => {
    const reveals = [...document.querySelectorAll('[data-partys-page] [data-reveal]')];
    const box = reveals.find((el) => el.getBoundingClientRect().top > 1100);
    const child = box?.children[0];
    if (!child) return { found: false };
    return {
      found: true,
      text: (child.textContent || '').trim().slice(0, 40),
      op: getComputedStyle(child).opacity,
      y: Math.round(child.getBoundingClientRect().top),
    };
  });
  await page.evaluate(() => {
    const reveals = [...document.querySelectorAll('[data-partys-page] [data-reveal]')];
    const box = reveals.find((el) => el.getBoundingClientRect().top > 1100);
    box?.scrollIntoView({ block: 'center' });
  });
  await page.waitForTimeout(900);
  const reveal1 = await page.evaluate((marker) => {
    const reveals = [...document.querySelectorAll('[data-partys-page] [data-reveal]')];
    const box = reveals.find((el) => (el.textContent || '').includes(marker));
    const child = box?.children[0];
    if (!child) return { op: 'missing' };
    return {
      op: getComputedStyle(child).opacity,
      y: Math.round(child.getBoundingClientRect().top),
      text: (child.textContent || '').trim().slice(0, 40),
    };
  }, reveal0.text || '___');
  add(
    'v19-reveal',
    Boolean(reveal0.found) && Number(reveal0.op) < 0.4 && Number(reveal1.op) >= 0.95,
    `start=${JSON.stringify(reveal0)} after=${JSON.stringify(reveal1)}`,
  );
  await page.screenshot({ path: `${ROOT}/partys-reveal.png`, timeout: 15000 });
  await page.close();
}

{
  const { page } = await pageAt('/events');
  const mini = await page.locator('[data-events-page] .sm\\:grid-cols-2').count();
  add('v13-events-mini', mini === 0, `mini-grids=${mini}`);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(200);
  const evReveal0 = await page.evaluate(() => {
    const reveals = [...document.querySelectorAll('[data-reveal]')];
    const box = reveals.find((el) => {
      const child = el.children[0];
      if (!child) return false;
      const y = child.getBoundingClientRect().top;
      return y > 900 && Number(getComputedStyle(child).opacity) < 0.4;
    });
    const child = box?.children[0];
    if (!box || !child) return { found: false };
    box.setAttribute('data-ev-probe', '1');
    return {
      found: true,
      text: (child.textContent || '').trim().slice(0, 40),
      op: getComputedStyle(child).opacity,
      y: Math.round(child.getBoundingClientRect().top),
    };
  });
  await page.evaluate(() => {
    document.querySelector('[data-ev-probe="1"]')?.scrollIntoView({ block: 'center' });
  });
  await page.waitForTimeout(900);
  const evReveal1 = await page.evaluate(() => {
    const box = document.querySelector('[data-ev-probe="1"]');
    const child = box?.children[0];
    if (!child) return { op: 'missing' };
    return {
      op: getComputedStyle(child).opacity,
      y: Math.round(child.getBoundingClientRect().top),
      text: (child.textContent || '').trim().slice(0, 40),
    };
  });
  add(
    'v13-events-reveal',
    Boolean(evReveal0.found) && Number(evReveal0.op) < 0.4 && Number(evReveal1.op) >= 0.95,
    `start=${JSON.stringify(evReveal0)} after=${JSON.stringify(evReveal1)}`,
  );
  await page.screenshot({ path: `${ROOT}/events-1440.png`, timeout: 15000 });
  await page.close();
}

{
  const { page } = await pageAt('/fotos');
  const teamChip = await page.getByTestId('gallery-filter-team').count();
  add('v16-fotos-kein-team-filter', teamChip === 0, `teamChip=${teamChip}`);
  const teamBadge = await page.locator('[data-testid="gallery-photo"]').filter({ hasText: /^Team$/ }).count();
  add('v16-fotos-kein-team-badge', teamBadge === 0, `teamBadge=${teamBadge}`);
  // Video-Punkt 16 verlangte Kontext-Bildtexte unter den Kacheln. Raphael hat das
  // am 20.08. widerrufen: "Fotos ohne Bildtext, mehr Fotos". Die juengere Ansage
  // gilt, also prueft dieser Punkt jetzt das Gegenteil: keine Bildtexte, dafuer
  // mehr Kacheln. Gegenstueck ist G32 in GATES.md.
  const caps = await page.locator('[data-testid="gallery-caption"]');
  const capN = await caps.count();
  const kacheln = await page.locator('[data-testid="gallery-photo"]').count();
  add('v16-fotos-ohne-bildtext', capN === 0 && kacheln >= 24, `Bildtexte=${capN} Kacheln=${kacheln}`);
  const heroDup = await page.evaluate(() => {
    const hero = new Set(
      [...document.querySelectorAll('section img')].slice(0, 3).map((el) => el.getAttribute('src')),
    );
    const grid = [...document.querySelectorAll('[data-testid="gallery-photo"] img')].map((el) => el.getAttribute('src'));
    const hit = grid.filter((s) => hero.has(s));
    return { hit };
  });
  add('v16-fotos-kein-hero-dup', heroDup.hit.length === 0, JSON.stringify(heroDup));
  await page.screenshot({ path: `${ROOT}/fotos-1440.png`, timeout: 15000 });
  // Die Bildtexte sind weg, also gibt es nichts mehr, wohin gescrollt werden koennte.
  // Stattdessen zeigt der Shot die Kacheln selbst.
  await page.locator('[data-testid="gallery-photo"]').first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${ROOT}/fotos-grid-kacheln.png`, timeout: 15000 });
  const hole = await page.evaluate(() => {
    const grid = document.querySelector('#galerie ul')?.parentElement;
    if (!grid) return { ok: false, note: 'no-grid' };
    const cols = [...grid.children].map((ul) => {
      const r = ul.getBoundingClientRect();
      return Math.round(r.top);
    });
    const min = Math.min(...cols);
    const gap = Math.max(...cols.map((t) => t - min));
    return { ok: gap < 80, gap, cols };
  });
  add('v16-fotos-kein-loch', hole.ok, JSON.stringify(hole));
  await page.close();
}

{
  const { page } = await pageAt('/privatstunden');
  const privat = await page.evaluate(() => {
    const h1 = document.querySelector('h1');
    const imgs = [...document.querySelectorAll('main img')].filter((el) => el.getBoundingClientRect().width > 200);
    const img = imgs[0];
    const r = img?.getBoundingClientRect();
    return {
      h1: (h1?.textContent || '').trim(),
      w: r ? Math.round(r.width) : 0,
      src: img?.getAttribute('src') || '',
    };
  });
  add(
    'v11-privat',
    /Unterricht|Privat/i.test(privat.h1) &&
      privat.w > 300 &&
      /photos\//.test(privat.src) &&
      !privat.src.includes('studiowand') &&
      !privat.src.includes('offer-bachata'),
    JSON.stringify(privat),
  );
  await page.screenshot({ path: `${ROOT}/privat-1440.png`, timeout: 15000 });
  await page.close();
}

{
  const { page } = await pageAt('/preise');
  await page.waitForTimeout(700);
  const srcs = await page.evaluate(() =>
    [...document.querySelectorAll('main img')].map((el) => el.getAttribute('src')).filter(Boolean),
  );
  const unique = new Set(srcs);
  const stems = srcs.map((s) => (s || '').split('/').pop());
  const uniqueStems = new Set(stems);
  add(
    'v12-preise-imgs',
    unique.size === srcs.length && uniqueStems.size === stems.length && srcs.length >= 4,
    `n=${srcs.length} unique=${unique.size} stems=${[...uniqueStems].join(',')}`,
  );
  const foldPrice = await page.evaluate(() => {
    const dts = [...document.querySelectorAll('main dt')].filter((el) => el.getBoundingClientRect().top < 850);
    const text = dts.map((el) => (el.textContent || '').trim());
    const ghost = [...document.querySelectorAll('a')].find((a) => /Frage stellen/i.test(a.textContent || ''));
    const color = ghost ? getComputedStyle(ghost).color : '';
    return { text, color, y: dts[0] ? Math.round(dts[0].getBoundingClientRect().top) : null };
  });
  add(
    'v12-preise-fold',
    foldPrice.text.some((t) => /CHF\s*190/.test(t)) && /173,\s*24,\s*39/.test(foldPrice.color),
    JSON.stringify(foldPrice),
  );
  await page.screenshot({ path: `${ROOT}/preise-1440.png`, timeout: 15000 });
  await page.close();
}

{
  const { page } = await pageAt('/team');
  add('v15-team', /Team|willkommen/i.test(await page.locator('h1').innerText()), 'H1');
  await page.close();
}

{
  const { page } = await pageAt('/events');
  const desc = await page.locator('meta[name="description"]').getAttribute('content');
  add(
    'v14-meta',
    Boolean(desc && desc.length > 40 && !/^Salsaflow Dance Company\.?$/i.test(desc.trim())),
    `desc=${desc?.slice(0, 80)}`,
  );
  await page.close();
}

{
  const { page } = await pageAt('/schnupperstunde');
  const info = await page.evaluate(() => {
    const h1 = document.querySelector('h1');
    const r = h1?.getBoundingClientRect();
    return { scrollY: Math.round(window.scrollY), h1y: r ? Math.round(r.top) : null };
  });
  add('v-schnupper-fold', info.scrollY === 0 && (info.h1y ?? 0) > 0, JSON.stringify(info));
  await page.close();
}

await browser.close();
const fail = report.filter((r) => !r.ok);
await writeFile(`${ROOT}/report.json`, JSON.stringify({ fail: fail.length, report }, null, 2));
console.log(`DONE fail=${fail.length} total=${report.length}`);
if (fail.length) process.exit(1);
