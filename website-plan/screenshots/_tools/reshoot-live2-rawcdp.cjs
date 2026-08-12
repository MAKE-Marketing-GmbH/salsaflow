// Roh-CDP-Screenshot (ohne Playwright): eigener Tab, reduced-motion, scroll, fullpage.
const fs = require('fs');

function cdp(ws) {
  let id = 0; const pend = new Map();
  ws.onmessage = (e) => {
    const m = JSON.parse(e.data);
    if (m.id && pend.has(m.id)) { const { res, rej } = pend.get(m.id); pend.delete(m.id); m.error ? rej(new Error(m.error.message)) : res(m.result); }
  };
  return (method, params = {}) => new Promise((res, rej) => {
    const mid = ++id; pend.set(mid, { res, rej });
    ws.send(JSON.stringify({ id: mid, method, params }));
    setTimeout(() => { if (pend.has(mid)) { pend.delete(mid); rej(new Error('timeout ' + method)); } }, 60000);
  });
}
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function shoot(url, out) {
  const t = await (await fetch('http://127.0.0.1:9222/json/new?url=about:blank', { method: 'PUT' })).json();
  const ws = new WebSocket(t.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
  const send = cdp(ws);
  try {
    await send('Page.enable');
    await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
    await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
    await send('Page.navigate', { url });
    await sleep(6000);
    // Cookie-Banner wegklicken (best effort)
    await send('Runtime.evaluate', { expression: `
      for (const b of document.querySelectorAll('button, a')) {
        const t = (b.textContent || '').trim();
        if (['Okay','Akzeptieren','Alle akzeptieren','Zustimmen','Verstanden'].includes(t)) { b.click(); break; }
      }`, returnByValue: true });
    await send('Runtime.evaluate', { expression: `(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 150)); }
      window.scrollTo(0, 0);
    })()`, awaitPromise: true });
    for (let i = 0; i < 16; i++) {
      const r = await send('Runtime.evaluate', { expression: `[...document.images].every(im => im.complete)`, returnByValue: true });
      if (r.result.value) break; await sleep(500);
    }
    await sleep(800);
    const lm = await send('Page.getLayoutMetrics');
    const h = Math.min(Math.ceil(lm.cssContentSize.height), 20000);
    await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: h, deviceScaleFactor: 1, mobile: false });
    await sleep(1200);
    const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true });
    fs.writeFileSync(out, Buffer.from(shot.data, 'base64'));
    const title = await send('Runtime.evaluate', { expression: 'document.title', returnByValue: true });
    console.log('SHOT', out, 'h=' + h, 'title=' + title.result.value);
  } finally {
    ws.close();
    await fetch('http://127.0.0.1:9222/json/close/' + t.id).catch(() => {});
  }
}

(async () => {
  await shoot('https://www.salsaflow-dc.com/kurse/privatstunden/', 'website-plan/screenshots/2026-08-12/live-privatstunden-desktop-full.png');
  await shoot('https://www.salsaflow-dc.com/kurse/', 'website-plan/screenshots/2026-08-12/live-kurse-desktop-full.png');
  console.log('DONE');
})();
