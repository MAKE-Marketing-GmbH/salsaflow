import pw from '/usr/lib/node_modules/playwright/index.js';
const { chromium } = pw;
const label = process.argv[2] || 'run';
const b = await chromium.launch();
const out = {};
for (const [name, w, h] of [['desktop',1440,900],['mobile',390,844]]) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  await p.goto('http://127.0.0.1:5175/', { waitUntil: 'networkidle' });
  await p.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); }
    window.scrollTo(0, 0); await new Promise(r => setTimeout(r, 400));
  });
  const m = await p.evaluate(() => {
    const sec = document.querySelector('#team');
    const fig = sec?.querySelector('figure');
    const img = fig?.querySelector('img');
    const hero = document.querySelector('#team')?.previousElementSibling;
    // previous sibling of TeamBlock in DOM order
    const prev = sec?.previousElementSibling;
    const r = (e) => { if(!e) return null; const b = e.getBoundingClientRect(); return { left: Math.round(b.left), right: Math.round(b.right), top: Math.round(b.top + window.scrollY), bottom: Math.round(b.bottom + window.scrollY), w: Math.round(b.width), h: Math.round(b.height) }; };
    const secR = r(sec), figR = r(fig), prevR = r(prev);
    // Hero section bottom
    const heroEl = document.querySelector('section');
    return {
      viewport: window.innerWidth,
      section: secR,
      figure: figR,
      img: r(img),
      figRadius: fig ? getComputedStyle(fig).borderRadius : null,
      imgRadius: img ? getComputedStyle(img).borderRadius : null,
      figMarginTop: fig ? getComputedStyle(fig).marginTop : null,
      secPadTop: sec ? getComputedStyle(sec).paddingTop : null,
      leftInset: figR ? figR.left : null,
      rightInset: figR ? window.innerWidth - figR.right : null,
      prevTag: prev ? (prev.id || prev.tagName) : null,
      gapPrevToSection: (prevR && secR) ? secR.top - prevR.bottom : null,
      // luft: prev section bottom -> first visible content (Eyebrow) top
      firstContentTop: (() => { const e = sec?.querySelector('p,h2,div'); return e ? Math.round(e.getBoundingClientRect().top + window.scrollY) : null; })(),
      prevBottom: prevR ? prevR.bottom : null,
      heroBottom: heroEl ? Math.round(heroEl.getBoundingClientRect().bottom + window.scrollY) : null,
    };
  });
  // deadgap: prev section bottom -> first real ink in team section
  m.deadgapPrevToFirstContent = (m.firstContentTop != null && m.prevBottom != null) ? m.firstContentTop - m.prevBottom : null;
  out[name] = m;
  await p.close();
}
console.log(JSON.stringify(out, null, 2));
await b.close();
