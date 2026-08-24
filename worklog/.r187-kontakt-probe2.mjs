// R187: zweite Nachschau — laeuft der Assistent per Klick weiter?
import playwright from '/usr/lib/node_modules/playwright/index.js';
const { chromium } = playwright;
const browser = await chromium.launch();
const p = await browser.newPage({ viewport: { width: 390, height: 844 } });
await p.goto('http://127.0.0.1:5175/kontakt', { waitUntil: 'networkidle', timeout: 45000 });
await p.waitForTimeout(1500);
const felder = () => p.locator('main input[type="text"], main input[type="email"], main input:not([type])');
for (let s = 0; s < 3; s += 1) {
  const radio = p.locator('main input[type="radio"]').first();
  const rc = await radio.count();
  if (rc) await radio.check({ force: true }).catch((e) => console.log('  check-fehler', e.message.slice(0, 60)));
  const next = p.locator('main button').filter({ hasText: /^(weiter|anfrage starten|nächster)/i }).first();
  const nc = await next.count();
  console.log(`stufe ${s}: radios=${rc} weiter=${nc} felder=${await felder().count()}`);
  if (!nc) break;
  const aktiv = await next.isEnabled();
  console.log(`  weiter aktiv: ${aktiv}`);
  await next.click().catch((e) => console.log('  klick-fehler', e.message.slice(0, 80)));
  await p.waitForTimeout(1200);
}
console.log('ende: felder =', await felder().count(), 'textarea =', await p.locator('main textarea').count());
await browser.close();
