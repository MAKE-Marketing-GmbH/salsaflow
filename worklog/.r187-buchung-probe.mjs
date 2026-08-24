// R187: Nachschau zum R186-FAIL `buchung-bachata`. Nur lesen.
// Frage: findet /buchung?kurs=<bachata> den Kurs, oder faellt es auf die Tagesauswahl?
import playwright from '/usr/lib/node_modules/playwright/index.js';
const { chromium } = playwright;
const IDS = {
  salsa: '892b16c9-802d-4f4b-8778-94edb5ffce71',
  bachata: '58bf8f19-a769-4b18-a84d-8562ed624b3b',
  heels: 'b2659cf3-19ad-4ae8-ac0b-2b96af2f8b3b',
};
for (const [name, id] of Object.entries(IDS)) {
  for (const runde of [1, 2]) {
    const browser = await chromium.launch();
    const p = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await p.goto(`http://127.0.0.1:5175/buchung?kurs=${id}`, { waitUntil: 'networkidle', timeout: 45000 });
    await p.waitForTimeout(2500);
    const text = (await p.locator('main').innerText()).replace(/\s+/g, ' ');
    const hatKurs = text.includes('Dein Kurs');
    console.log(`${name.padEnd(8)} runde${runde}: Kurstermin=${hatKurs} · "${text.slice(0, 70)}"`);
    await browser.close();
  }
}
