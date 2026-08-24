const { chromium } = await import('/usr/lib/node_modules/playwright/index.mjs');
const OUT = '/root/clients/salsaflow-w1/worklog/shots/S7-ux141';
const URL = 'http://127.0.0.1:5175/kursaufbau';
const b = await chromium.launch();

async function accept(page){
  for (const t of ['Alle akzeptieren','Akzeptieren','Accept all','Alles akzeptieren','Zustimmen']) {
    const el = page.getByRole('button', { name: t });
    if (await el.count()) { try { await el.first().click({ timeout: 1500 }); await page.waitForTimeout(500); return t; } catch {} }
  }
  return null;
}

// Desktop 1440x730 fold (R80-Beweis)
{
  const p = await b.newPage({ viewport: { width:1440, height:730 }, deviceScaleFactor:2 });
  await p.goto(URL, { waitUntil:'networkidle' });
  console.log('desktop cookie:', await accept(p));
  await p.waitForTimeout(1200);
  await p.screenshot({ path: `${OUT}/kursaufbau-desktop-1440.png` });
  // CTA im Fold messen
  const cta = await p.getByRole('link', { name: 'Level klären' }).first().boundingBox();
  console.log('CTA box:', JSON.stringify(cta), 'fold=730');
  await p.close();
}
// Mobil 390x844
{
  const p = await b.newPage({ viewport: { width:390, height:844 }, deviceScaleFactor:2, isMobile:true, hasTouch:true });
  await p.goto(URL, { waitUntil:'networkidle' });
  console.log('mobile cookie:', await accept(p));
  await p.waitForTimeout(1200);
  await p.screenshot({ path: `${OUT}/kursaufbau-mobil-390.png` });
  const lad = await p.locator('#levels').boundingBox();
  if (lad) { await p.evaluate(y=>scrollTo(0,y), lad.y - 20); await p.waitForTimeout(700);
    await p.screenshot({ path: `${OUT}/levels-mobil-390-nachher.png` }); }
  await p.close();
}
// Desktop Scroll-Shots: Levels + Miss (voll)
{
  const p = await b.newPage({ viewport: { width:1440, height:900 }, deviceScaleFactor:2 });
  await p.goto(URL, { waitUntil:'networkidle' });
  await accept(p); await p.waitForTimeout(1000);
  await p.evaluate(()=>scrollTo(0,document.body.scrollHeight)); await p.waitForTimeout(1200);
  await p.evaluate(()=>scrollTo(0,0)); await p.waitForTimeout(800);

  const lev = p.locator('#levels');
  await lev.scrollIntoViewIfNeeded(); await p.waitForTimeout(800);
  await lev.screenshot({ path: `${OUT}/levels-desktop-1440-nachher.png` });
  const lb = await lev.boundingBox(); console.log('levels box:', JSON.stringify(lb));

  // Miss-Sektion = die mit dem kurs-05 Bild
  const miss = p.locator('section').filter({ has: p.locator('img[src*="kurs-05"]') }).first();
  await miss.scrollIntoViewIfNeeded(); await p.waitForTimeout(800);
  await miss.screenshot({ path: `${OUT}/miss-desktop-1440-nachher.png` });
  const mb = await miss.boundingBox(); console.log('miss box:', JSON.stringify(mb));
  await p.close();
}
await b.close();
