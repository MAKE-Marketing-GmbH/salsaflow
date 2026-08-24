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

// full viewport, dsf 1, footer edge parked mid-screen — no clip, no scale games
try {
  const jobs = [
    ['/kontakt/standort-raumvermietung', 360, 700, 'edge2-raum-360.png'],
    ['/kontakt/standort-raumvermietung', 390, 700, 'edge2-raum-390.png'],
    ['/preise', 360, 700, 'edge2-preise-360.png'],
    ['/tanzkurse', 360, 700, 'edge2-tanzkurse-360.png']
  ]
  for (const [route, w, h, name] of jobs) {
    const context = await browser.newContext({ viewport: { width: w, height: h }, locale: 'de-CH', deviceScaleFactor: 1 })
    const page = await context.newPage()
    const cdp = await page.context().newCDPSession(page)
    await page.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 20000 })
    await page.waitForTimeout(2400)
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(1700)
    // park the footer edge 300px down the viewport
    await page.evaluate(() => {
      const f = document.querySelector('footer').getBoundingClientRect().top + window.scrollY
      window.scrollTo(0, Math.max(0, f - 300))
    })
    await page.waitForTimeout(1400)
    const box = await page.evaluate(() => {
      const f = document.querySelector('footer').getBoundingClientRect()
      const main = document.querySelector('main')
      let best = null
      for (const e of main.querySelectorAll('p,span,a,h2,h3')) {
        if (e.querySelector('p,span,a,h2,h3')) continue
        const r = e.getBoundingClientRect()
        if (!(r.width > 8 && r.height > 6 && (e.textContent || '').trim())) continue
        let ink = r.bottom
        const tn = [...e.childNodes].find(n => n.nodeType === 3 && n.textContent.trim())
        if (tn) { const rg = document.createRange(); rg.selectNodeContents(tn); const rr = rg.getBoundingClientRect(); if (rr.height > 0) ink = rr.bottom }
        if (!best || ink > best.ink) best = { ink: Math.round(ink), t: (e.textContent || '').trim().slice(0, 44) }
      }
      return { footerTopVp: Math.round(f.top), lastInkVp: best?.ink, gap: best ? Math.round(f.top - best.ink) : null, t: best?.t, scrollY: Math.round(window.scrollY) }
    })
    rec(`EDGE2 ${name} ` + JSON.stringify(box))
    const { data } = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false })
    fs.writeFileSync(path.join(OUT, name), Buffer.from(data, 'base64'))
    console.log('SHOT ' + name)
    await context.close()
  }
  fs.writeFileSync(path.join(OUT, '_log-edge2.json'), JSON.stringify(log, null, 2))
  rec('DONE')
} catch (e) {
  console.error('FAIL', e.stack || e); process.exitCode = 1
} finally { await browser.close() }
