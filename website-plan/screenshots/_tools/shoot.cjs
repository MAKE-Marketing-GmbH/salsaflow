const { chromium } = require('/root/clients/salsaflow-dc/node_modules/playwright-core');
const fs = require('fs');
const path = require('path');

const OUT = '/root/clients/salsaflow-dc/website-plan/screenshots/2026-08-12';
fs.mkdirSync(OUT, { recursive: true });

const sleep = ms => new Promise(r => setTimeout(r, ms));
async function dismissCookies(page) {
  for (const text of ['Okay', 'Akzeptieren', 'Alle akzeptieren']) {
    try {
      const btn = page.getByRole('button', { name: text, exact: true }).first();
      if (await btn.count()) { await btn.click({ timeout: 1500 }); await sleep(300); return text; }
    } catch (_) {}
  }
  return null;
}
async function settle(page) {
  await page.evaluate(async () => {
    const max = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    for (let y = 0; y < max; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 150)); }
    window.scrollTo(0, max); await new Promise(r => setTimeout(r, 150));
    window.scrollTo(0, 0);
  });
  try {
    await page.waitForFunction(() => [...document.images].every(i => i.complete && i.naturalWidth > 0), { timeout: 8000 });
  } catch (_) {}
  await sleep(800);
}
async function shoot(page, url, slug, viewport, mode) {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize(viewport);
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await dismissCookies(page);
  await settle(page);
  const suffix = mode === 'full' ? '-full' : '';
  const file = path.join(OUT, `${slug}-${viewport.width === 390 ? 'mobile' : 'desktop'}${suffix}.png`);
  await page.screenshot({ path: file, fullPage: mode === 'full' });
  return file;
}
async function links(page, base) {
  return await page.locator('a[href]').evaluateAll((as, base) => as.map(a => ({ text: (a.textContent||'').trim(), href: new URL(a.getAttribute('href'), base).href })).filter(x => x.href.startsWith(base)), base);
}
(async () => {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const page = await browser.newPage();
  const made = [];
  const desktop = { width: 1440, height: 900 }, mobile = { width: 390, height: 844 };
  const vercel = 'https://salsaflow-dc.vercel.app';
  const routes = [
    ['home', '/'], ['tanzkurse', '/tanzkurse'], ['kursplan', '/kursplan'], ['events', '/events'],
    ['team', '/team'], ['fotos', '/fotos'], ['kontakt', '/kontakt'], ['mehr', '/mehr']
  ];
  for (const [slug, route] of routes) {
    made.push(await shoot(page, vercel + route, `vercel-${slug}`, desktop, 'above'));
    made.push(await shoot(page, vercel + route, `vercel-${slug}`, desktop, 'full'));
    if (['home', 'tanzkurse', 'kursplan', 'kontakt'].includes(slug)) made.push(await shoot(page, vercel + route, `vercel-${slug}`, mobile, 'above'));
  }
  const live = 'https://www.salsaflow-dc.com';
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize(desktop);
  await page.goto(live, { waitUntil: 'networkidle', timeout: 60000 });
  await dismissCookies(page); await settle(page);
  const ls = await links(page, live);
  const unique = [...new Map(ls.map(x => [x.href, x])).values()];
  const privat = unique.find(x => /privat/i.test(x.text + x.href));
  const kurs = unique.find(x => /kurs/i.test(x.text) && !/kursplan/i.test(x.href));
  const liveTargets = [
    ['home', live + '/'], ['fotos', live + '/fotos-1/'],
    ['privatstunden', privat ? privat.href : live + '/privatstunden'],
    ['kurse', kurs ? kurs.href : live + '/tanzkurse']
  ];
  for (const [slug, url] of liveTargets) made.push(await shoot(page, url, `live-${slug}`, desktop, 'full'));
  console.log(JSON.stringify({ made, discovered: { privat, kurs }, links: unique }, null, 2));
  await page.close();
})().catch(err => { console.error(err.stack || err); process.exitCode = 1; });
