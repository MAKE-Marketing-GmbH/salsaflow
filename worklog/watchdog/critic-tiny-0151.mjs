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

// small type: size, colour, contrast against its own background
const tinyProbe = () => {
  const parseRGB = s => { const m = s.match(/[\d.]+/g); return m ? m.slice(0, 3).map(Number) : null }
  const lum = c => { const s = c.map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4) }); return 0.2126 * s[0] + 0.7152 * s[1] + 0.0722 * s[2] }
  const bgOf = el => {
    let n = el
    while (n) {
      const b = getComputedStyle(n).backgroundColor
      const rgb = parseRGB(b)
      if (rgb && !/rgba\(0, 0, 0, 0\)|transparent/.test(b)) return rgb
      n = n.parentElement
    }
    return [255, 255, 255]
  }
  const out = []
  for (const e of document.querySelectorAll('main *')) {
    if (e.children.length) continue
    const t = (e.textContent || '').trim()
    if (!t) continue
    const r = e.getBoundingClientRect()
    if (r.width < 4 || r.height < 4) continue
    const cs = getComputedStyle(e)
    const fs = parseFloat(cs.fontSize)
    if (!(fs > 0 && fs < 12)) continue
    const fg = parseRGB(cs.color), bg = bgOf(e)
    const l1 = lum(fg), l2 = lum(bg)
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
    out.push({
      t: t.slice(0, 26), fs: +fs.toFixed(1), weight: cs.fontWeight,
      letterSpacing: cs.letterSpacing, transform: cs.textTransform,
      color: cs.color, contrast: +ratio.toFixed(2),
      y: Math.round(r.y + window.scrollY)
    })
  }
  // WCAG AA for normal text is 4.5:1; under 12px there is no "large text" exemption
  const fails = out.filter(o => o.contrast < 4.5)
  return { total: out.length, minSize: out.length ? Math.min(...out.map(o => o.fs)) : null, failing: fails.length, sample: out.slice(0, 8), worst: fails.sort((a, b) => a.contrast - b.contrast).slice(0, 5) }
}

try {
  for (const route of ['/tanzkurse', '/kursplan', '/', '/preise', '/kontakt', '/schnupperstunde']) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'de-CH', deviceScaleFactor: 1 })
    const page = await context.newPage()
    await page.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 20000 })
    await page.waitForTimeout(2300)
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(1600)
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForTimeout(700)
    rec(`TINY ${route} ` + JSON.stringify(await page.evaluate(tinyProbe)))
    await context.close()
  }

  // zoom the 10px badges on /tanzkurse at dsf 3, no clip games: crop via full shot then note coords
  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'de-CH', deviceScaleFactor: 3 })
    const page = await context.newPage()
    const cdp = await page.context().newCDPSession(page)
    await page.goto(BASE + '/tanzkurse', { waitUntil: 'domcontentloaded', timeout: 20000 })
    await page.waitForTimeout(2400)
    const y = await page.evaluate(() => {
      const el = [...document.querySelectorAll('main span')].find(e => (e.textContent || '').trim() === 'Startet bald')
      if (!el) return null
      const r = el.getBoundingClientRect()
      window.scrollTo(0, Math.max(0, r.top + window.scrollY - 240))
      return Math.round(r.top + window.scrollY)
    })
    rec('TINY_ZOOM_Y ' + y)
    await page.waitForTimeout(1400)
    const { data } = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false })
    fs.writeFileSync(path.join(OUT, 'tanzkurse-badges-dsf3.png'), Buffer.from(data, 'base64'))
    console.log('SHOT tanzkurse-badges-dsf3.png')
    await context.close()
  }

  fs.writeFileSync(path.join(OUT, '_log-tiny.json'), JSON.stringify(log, null, 2))
  rec('DONE')
} catch (e) {
  console.error('FAIL', e.stack || e); process.exitCode = 1
} finally { await browser.close() }
