const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  await p.emulateMedia({ reducedMotion: 'reduce' });
  await p.goto('http://127.0.0.1:5175/faq', { waitUntil: 'networkidle' });
  await p.waitForTimeout(900);
  const r = await p.evaluate(() => {
    const out = [];
    document.querySelectorAll('#faq figure img').forEach((img, i) => {
      const fb = img.getBoundingClientRect();
      out.push({ kind: 'img', i, top: Math.round(fb.top + scrollY), bottom: Math.round(fb.bottom + scrollY), left: Math.round(fb.left), right: Math.round(fb.right) });
    });
    document.querySelectorAll('#faq h3').forEach((h, i) => {
      const pr = h.parentElement.getBoundingClientRect();
      out.push({ kind: 'textcol', i, top: Math.round(pr.top + scrollY), bottom: Math.round(pr.bottom + scrollY), left: Math.round(pr.left), right: Math.round(pr.right), h: Math.round(pr.height) });
    });
    document.querySelectorAll('#faq [class*="divide-y"]').forEach((d, i) => {
      const rr = d.getBoundingClientRect();
      out.push({ kind: 'accordion', i, top: Math.round(rr.top + scrollY), bottom: Math.round(rr.bottom + scrollY), left: Math.round(rr.left), right: Math.round(rr.right) });
    });
    return { out, docH: document.documentElement.scrollHeight };
  });
  console.log(JSON.stringify(r, null, 1));
  await b.close();
})();
