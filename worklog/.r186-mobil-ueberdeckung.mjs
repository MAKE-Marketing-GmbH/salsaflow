// R186: Prüft jede Angebotskarte in einem eigenen Browser.
import pkg from '/usr/lib/node_modules/playwright/index.js';

const namen = ['Salsa', 'Bachata', 'Heels', 'Privatstunden'];
let fehler = 0;

for (let index = 0; index < namen.length; index++) {
  const browser = await pkg.chromium.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
    await page.addInitScript(() => window.localStorage.setItem('salsaflow-cookie-ok', '1'));
    await page.goto('http://127.0.0.1:5175/', { waitUntil: 'networkidle' });
    await page.waitForSelector('#angebot a img');
    const ergebnis = await page.evaluate(async (kartenIndex) => {
      const sektion = document.querySelector('#angebot');
      if (!sektion) return { kollisionen: [{ text: 'Angebot fehlt', ueberdeckt: 'Seite' }] };
      const karte = [...sektion.querySelectorAll('a')].filter((anker) => anker.querySelector('img'))[kartenIndex];
      if (!karte) return { kollisionen: [{ text: `Karte ${kartenIndex} fehlt`, ueberdeckt: 'Seite' }] };
      karte.scrollIntoView({ block: 'center' });
      await new Promise((resolve) => setTimeout(resolve, 800));
      const texte = [karte.querySelector('h3'), karte.querySelector('p'), karte.querySelector('span:last-of-type'), karte.querySelector('span')];
      const festeElemente = [...document.querySelectorAll('body *')].filter((element) => {
        const stil = getComputedStyle(element);
        return (stil.position === 'fixed' || stil.position === 'sticky') && stil.visibility !== 'hidden' && element.offsetHeight > 20;
      });
      const kollisionen = [];
      for (const text of texte) {
        if (!text) continue;
        const textBox = text.getBoundingClientRect();
        if (textBox.bottom < 0 || textBox.top > innerHeight) continue;
        for (const fest of festeElemente) {
          const festBox = fest.getBoundingClientRect();
          if (festBox.bottom <= 0 || festBox.top >= innerHeight) continue;
          const ueberlappt = !(textBox.right < festBox.left || textBox.left > festBox.right || textBox.bottom < festBox.top || textBox.top > festBox.bottom);
          if (ueberlappt) kollisionen.push({ text: (text.textContent ?? '').trim().slice(0, 30), ueberdeckt: String(fest.className ?? '').slice(0, 32) });
        }
      }
      return { kollisionen };
    }, index);
    const bestanden = ergebnis.kollisionen.length === 0;
    if (!bestanden) fehler++;
    console.log(`${bestanden ? 'PASS' : 'FAIL'} karte-${namen[index]}: ${JSON.stringify(ergebnis.kollisionen)}`);
    await page.screenshot({ path: `worklog/shots/R186-dom-home/mobil-karte-${namen[index].toLowerCase()}.png` });
  } finally {
    await browser.close();
  }
}

console.log(fehler ? `R186 MOBIL FAIL: ${fehler}/4` : 'R186 MOBIL PASS: 4/4');
process.exit(fehler ? 1 : 0);
