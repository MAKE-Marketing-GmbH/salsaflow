const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const BASE = 'https://salsaflow-dc.vercel.app';
const ROOT = __dirname;
const OUT = path.join(ROOT, 'generated', 'A', 'preview');
const MANIFEST = path.join(ROOT, 'mockup-manifest.tsv');

const routes = [
  {
    route: '/',
    slug: 'home',
    copySource: '06-seiten/01-home.md',
    prefix: 'H',
  },
  {
    route: '/kursplan',
    slug: 'kursplan',
    copySource: '06-seiten/06-kursplan.md',
    prefix: 'KP',
  },
];

const viewports = [
  ['desktop', 1440, 900, false],
  ['mobile', 390, 844, true],
];

function sha(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

async function prepare(page) {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addStyleTag({ content: `
    *, *::before, *::after { animation: none !important; transition-delay: 0s !important; }
    [data-reveal] { opacity: 1 !important; transform: none !important; }
  ` });
  const cookieButtons = page.getByRole('button', { name: /akzeptieren|ablehnen|schliessen/i });
  if (await cookieButtons.count()) await cookieButtons.first().click().catch(() => {});
  await page.evaluate(async () => {
    document.querySelectorAll('img').forEach((img) => { img.loading = 'eager'; img.decoding = 'sync'; });
    for (let y = 0; y <= document.documentElement.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
    window.scrollTo(0, 0);
  });
  await page.evaluate(() => document.fonts.ready).catch(() => {});
  await page.waitForFunction(() => [...document.images].every((img) => img.complete), null, { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(500);
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
  const rows = [];
  try {
    for (const route of routes) {
      for (const [viewportName, width, height, isMobile] of viewports) {
        const context = await browser.newContext({
          viewport: { width, height }, deviceScaleFactor: isMobile ? 2 : 1,
          isMobile, reducedMotion: 'reduce', locale: 'de-CH',
        });
        const page = await context.newPage();
        const response = await page.goto(BASE + route.route, { waitUntil: 'networkidle', timeout: 30000 });
        if (!response || response.status() >= 400) throw new Error(`${route.route}: HTTP ${response && response.status()}`);
        await prepare(page);
        const sections = page.locator('main > section');
        const count = await sections.count();
        for (let index = 0; index < count; index += 1) {
          const locator = sections.nth(index);
          const dom = await locator.evaluate((node) => {
            const heading = node.querySelector('h1, h2');
            return {
              domId: node.id || '',
              heading: heading ? heading.textContent.replace(/\s+/g, ' ').trim() : '',
            };
          });
          const id = `${route.prefix}${String(index).padStart(2, '0')}`;
          const name = dom.heading || dom.domId || `Section ${index + 1}`;
          await locator.scrollIntoViewIfNeeded();
          await page.waitForTimeout(100);
          const filename = `${route.slug}-${id}-${viewportName}.png`;
          const absolute = path.join(OUT, filename);
          await locator.screenshot({ path: absolute, animations: 'disabled' });
          rows.push([
            route.route, id, name, `${width}x${height}`, `generated/A/preview/${filename}`,
            route.copySource, sha(path.join(ROOT, '..', route.copySource)), 'reduce', 'dismissed', 'preview-live-data',
            'FAIL_COPY_SYNC',
          ]);
        }
        await context.close();
      }
    }
  } finally {
    await browser.close();
  }
  const referenced = new Set(rows.map((row) => path.basename(row[4])));
  for (const filename of fs.readdirSync(OUT)) {
    if (filename.endsWith('.png') && !referenced.has(filename)) {
      fs.unlinkSync(path.join(OUT, filename));
    }
  }
  const header = ['route','section_id','section_name','viewport','file','copy_source','copy_sha256','reduced_motion','cookie_state','data_state','review'];
  fs.writeFileSync(MANIFEST, [header, ...rows].map((row) => row.join('\t')).join('\n') + '\n');
  process.stdout.write(`${rows.length} section captures\n${MANIFEST}\n`);
})().catch((error) => { console.error(error.stack || error.message); process.exit(1); });
