// R187: Nachschau zum R183-FAIL `kontakt-tippen`. Nur lesen, nichts aendern.
// Frage: gibt es auf /kontakt mobil ueberhaupt noch Radios, Weiter-Knopf und Textfelder?
import playwright from '/usr/lib/node_modules/playwright/index.js';

const { chromium } = playwright;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto('http://127.0.0.1:5175/kontakt', { waitUntil: 'networkidle', timeout: 45000 });
const titel = await page.title();
if (!titel.includes('Salsaflow')) throw new Error(`Falscher Port: ${titel}`);
await page.waitForTimeout(1500);

const zaehle = async (wahl) => page.locator(wahl).count();
console.log('titel          ', titel);
console.log('radios         ', await zaehle('main input[type="radio"]'));
console.log('textfelder     ', await zaehle('main input[type="text"], main input[type="email"], main input:not([type])'));
console.log('textarea       ', await zaehle('main textarea'));
console.log('buttons        ', await zaehle('main button'));
const knopfTexte = await page.locator('main button').allInnerTexts();
console.log('knopf-texte    ', JSON.stringify(knopfTexte.slice(0, 12)));
const fehler = await page.evaluate(() => window.__fehler ?? null);
console.log('seiten-fehler  ', fehler);
await browser.close();
