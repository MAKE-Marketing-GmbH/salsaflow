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

// exact ink-to-footer clearance, measured on the text node not the tap box
const gapProbe = () => {
  const footer = document.querySelector('footer')
  const fr = footer.getBoundingClientRect()
  const footTop = fr.top + window.scrollY
  const main = document.querySelector('main')
  const cands = [...main.querySelectorAll('p, span, h2, h3, a, li')].filter(e => {
    if (e.querySelector('p,span,h2,h3,a,li')) return false
    const r = e.getBoundingClientRect()
    return r.width > 8 && r.height > 6 && (e.textContent || '').trim()
  }).map(e => {
    const r = e.getBoundingClientRect()
    let inkBottom = r.bottom
    const tn = [...e.childNodes].find(n => n.nodeType === 3 && n.textContent.trim())
    if (tn) {
      const rg = document.createRange(); rg.selectNodeContents(tn)
      const rr = rg.getBoundingClientRect()
      if (rr.height > 0) inkBottom = rr.bottom
    }
    return {
      t: (e.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 44),
      tag: e.tagName,
      boxBottom: Math.round(r.bottom + window.scrollY),
      inkBottom: Math.round(inkBottom + window.scrollY),
      x: Math.round(r.x)
    }
  }).sort((a, b) => b.inkBottom - a.inkBottom)
  const last = cands[0]
  return {
    footerTop: Math.round(footTop),
    footerBg: getComputedStyle(footer).backgroundColor,
    lastLine: last,
    inkToFooter: last ? Math.round(footTop - last.inkBottom) : null,
    boxToFooter: last ? Math.round(footTop - last.boxBottom) : null,
    runnersUp: cands.slice(1, 4).map(c => ({ t: c.t, gap: Math.round(footTop - c.inkBottom) }))
  }
}

try {
  for (const route of ['/preise', '/kontakt/standort-raumvermietung', '/tanzkurse', '/team']) {
    for (const [w, h, tag] of [[390, 844, '390'], [360, 800, '360'], [1440, 900, '1440']]) {
      const context = await browser.newContext({ viewport: { width: w, height: h }, locale: 'de-CH', deviceScaleFactor: 1 })
      const page = await context.newPage()
      const cdp = await page.context().newCDPSession(page)
      await page.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 20000 })
      await page.waitForTimeout(2300)
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
      await page.waitForTimeout(1800)
      const g = await page.evaluate(gapProbe)
      rec(`GAP_${tag} ${route} ` + JSON.stringify(g))

      // frame the footer edge: 150px above it, 90 below
      const y = await page.evaluate(() => {
        const f = document.querySelector('footer').getBoundingClientRect().top + window.scrollY
        return Math.max(0, Math.round(f) - 150)
      })
      await page.evaluate(yy => window.scrollTo(0, yy), y)
      await page.waitForTimeout(1100)
      const slug = route.replace(/\//g, '_').replace(/^_/, '') || 'home'
      const { data } = await cdp.send('Page.captureScreenshot', {
        format: 'png', captureBeyondViewport: false, clip: { x: 0, y: 0, width: w, height: 260, scale: 1 }
      })
      fs.writeFileSync(path.join(OUT, `footeredge-${slug}-${tag}.png`), Buffer.from(data, 'base64'))
      console.log(`SHOT footeredge-${slug}-${tag}.png`)
      await context.close()
    }
  }
  fs.writeFileSync(path.join(OUT, '_log-gap.json'), JSON.stringify(log, null, 2))
  rec('DONE')
} catch (e) {
  console.error('FAIL', e.stack || e); process.exitCode = 1
} finally { await browser.close() }
