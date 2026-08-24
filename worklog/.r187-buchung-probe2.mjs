// R187: dritte Nachschau. Wartet auf den Fetch statt auf eine feste Zeit.
import playwright from '/usr/lib/node_modules/playwright/index.js';
const { chromium } = playwright;
const IDS = {
  salsa: '892b16c9-802d-4f4b-8778-94edb5ffce71',
  bachata: '58bf8f19-a769-4b18-a84d-8562ed624b3b',
  heels: 'b2659cf3-19ad-4ae8-ac0b-2b96af2f8b3b',
};
for (const [name, id] of Object.entries(IDS)) {
  const browser = await chromium.launch();
  const p = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const antwort = p.waitForResponse((r) => r.url().includes('/api/public/schedule'), { timeout: 30000 }).catch(() => null);
  await p.goto(`http://127.0.0.1:5175/buchung?kurs=${id}`, { waitUntil: 'domcontentloaded', timeout: 45000 });
  const r = await antwort;
  console.log(`${name.padEnd(8)} fetch=${r ? r.status() : 'KEINER'}`);
  await p.waitForTimeout(3000);
  const text = (await p.locator('main').innerText()).replace(/\s+/g, ' ');
  const kurs = /dein kurs/i.test(text);
  const fehlt = /nicht mehr|nicht gefunden|leider/i.test(text);
  console.log(`         Kurs sichtbar=${kurs} Fehlermeldung=${fehlt} · "${text.slice(0, 80)}"`);
  await browser.close();
}
