import { chromium } from '/usr/lib/node_modules/playwright/index.mjs';

const BASE = 'http://127.0.0.1:5175';
const urls = [
  '/events-workshops/anniversary-weekend',
  '/fotos',
  '/events-workshops',
  '/events-workshops/floweekend',
];

const browser = await chromium.launch({
  executablePath: '/root/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome',
});
const page = await browser.newPage();

for (const u of urls) {
  try {
    await page.goto(BASE + u, { waitUntil: 'networkidle', timeout: 30000 });
    const data = await page.evaluate(() => ({
      title: document.title,
      desc: document.querySelector('meta[name="description"]')?.content ?? null,
      og: document.querySelector('meta[property="og:description"]')?.content ?? null,
      canon: document.querySelector('link[rel="canonical"]')?.href ?? null,
    }));
    console.log(`URL ${u}`);
    console.log(`  title: ${data.title}`);
    console.log(`  desc : ${data.desc}   [${data.desc ? data.desc.length : 0} Zeichen]`);
    console.log(`  og== desc: ${data.og === data.desc}   [${data.og ? data.og.length : 0} Zeichen]`);
    console.log(`  canon: ${data.canon}`);
  } catch (e) {
    console.log(`URL ${u}  FEHLER: ${e.message}`);
  }
}

await browser.close();
