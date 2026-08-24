import { chromium } from 'playwright-core'
import fs from 'node:fs'
import path from 'node:path'

const OUT = '/root/clients/salsaflow-w1/worklog/shots/CRITIC-0824-0151'
const BASE = 'http://127.0.0.1:5173'

const browser = await chromium.launch({
  executablePath: '/usr/bin/google-chrome', headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none']
})
const log = []
function rec(m) { log.push(m); console.log(m) }

// scroll the footer edge into view, then clip on the LIVE viewport coords
async function shootEdge(page, cdp, name, w, dsf) {
  await page.evaluate(() => {
    const f = document.querySelector('footer')
    f.scrollIntoView({ block: 'start', behavior: 'instant' })
    window.scrollBy(0, -170)
  })
  await page.waitForTimeout(1400)
  const box = await page.evaluate(() => {
    const f = document.querySelector('footer').getBoundingClientRect()
    const main = document.querySelector('main')
    const cands = [...main.querySelectorAll('p,span,a,h2,h3')].filter(e => {
      if (e.querySelector('p,span,a,h2,h3')) return false
      const r = e.getBoundingClientRect()
      return r.width > 8 && r.height > 6 && (e.textContent || '').trim()
    })
    let best = null
    for (const e of cands) {
      const r = e.getBoundingClientRect()
      let ink = r.bottom
      const tn = [...e.childNodes].find(n => n.nodeType === 3 && n.textContent.trim())
      if (tn) { const rg = document.createRange(); rg.selectNodeContents(tn); const rr = rg.getBoundingClientRect(); if (rr.height > 0) ink = rr.bottom }
      if (!best || ink > best.ink) best = { ink, t: (e.textContent || '').trim().slice(0, 40), x: r.x }
    }
    return { footerTopVp: Math.round(f.top), lastInkVp: best ? Math.round(best.ink) : null, t: best?.t, gap: best ? Math.round(f.top - best.ink) : null }
  })
  rec(`EDGE ${name} footerTopVp=${box.footerTopVp} lastInkVp=${box.lastInkVp} gap=${box.gap} last="${box.t}"`)
  const y = Math.max(0, box.footerTopVp - 150)
  const { data } = await cdp.send('Page.captureScreenshot', {
    format: 'png', captureBeyondViewport: false, clip: { x: 0, y, width: w, height: 260, scale: 1 }
  })
  fs.writeFileSync(path.join(OUT, name), Buffer.from(data, 'base64'))
  console.log('SHOT ' + name)
  return box
}

try {
  const jobs = [
    ['/kontakt/standort-raumvermietung', 360, 800, 'edge-raum-360.png', 2],
    ['/kontakt/standort-raumvermietung', 390, 844, 'edge-raum-390.png', 2],
    ['/preise', 360, 800, 'edge-preise-360.png', 2],
    ['/preise', 390, 844, 'edge-preise-390.png', 2],
    ['/tanzkurse', 360, 800, 'edge-tanzkurse-360.png', 2]
  ]
  for (const [route, w, h, name, dsf] of jobs) {
    const context = await browser.newContext({ viewport: { width: w, height: h }, locale: 'de-CH', deviceScaleFactor: dsf })
    const page = await context.newPage()
    const cdp = await page.context().newCDPSession(page)
    await page.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 20000 })
    await page.waitForTimeout(2400)
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(1700)
    await shootEdge(page, cdp, name, w, dsf)
    await context.close()
  }
  fs.writeFileSync(path.join(OUT, '_log-edge.json'), JSON.stringify(log, null, 2))
  rec('DONE')
} catch (e) {
  console.error('FAIL', e.stack || e); process.exitCode = 1
} finally { await browser.close() }
