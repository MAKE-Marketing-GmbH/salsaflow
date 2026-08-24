import { chromium } from 'playwright-core'
import fs from 'node:fs'
import path from 'node:path'

const OUT = '/root/clients/salsaflow-w1/worklog/shots/CRITIC-0824-0251'
const BASE = 'http://127.0.0.1:5173'

const browser = await chromium.launch({
  executablePath: '/usr/bin/google-chrome', headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none']
})
const log = []
function rec(m) { log.push(m); console.log(m) }

// every level pill on the page, in visual order, with the full paint state
const census = () => {
  const rows = []
  for (const e of document.querySelectorAll('main *')) {
    if (e.children.length) continue
    const t = (e.textContent || '').trim()
    if (!/^(Beginner|Intermediate|Advanced)\s+Stufe\s+\d+$/i.test(t)) continue
    const cs = getComputedStyle(e)
    const r = e.getBoundingClientRect()
    if (r.width < 4) continue
    rows.push({
      t, fs: +parseFloat(cs.fontSize).toFixed(1), weight: cs.fontWeight,
      color: cs.color, bg: cs.backgroundColor,
      border: cs.border, borderColor: cs.borderColor, borderWidth: cs.borderWidth,
      radius: cs.borderRadius, pad: cs.padding,
      box: { w: Math.round(r.width), h: Math.round(r.height) },
      y: Math.round(r.top + window.scrollY), x: Math.round(r.left)
    })
  }
  return rows.sort((a, b) => a.y - b.y || a.x - b.x)
}

// the ladder further up the page — red there is meaningful, keep it separate
const ladder = () => [...document.querySelectorAll('main *')]
  .filter(e => !e.children.length && /^(Beginner|Intermediate|Advanced)\b/.test((e.textContent || '').trim()) && !/Stufe\s+\d+$/.test((e.textContent || '').trim()))
  .map(e => { const cs = getComputedStyle(e), r = e.getBoundingClientRect(); return { t: (e.textContent || '').trim().slice(0, 30), color: cs.color, fs: +parseFloat(cs.fontSize).toFixed(1), y: Math.round(r.top + window.scrollY) } })
  .sort((a, b) => a.y - b.y)

try {
  for (const [w, h, tag] of [[1440, 900, '1440'], [390, 844, '390']]) {
    const context = await browser.newContext({ viewport: { width: w, height: h }, locale: 'de-CH', deviceScaleFactor: 2 })
    const page = await context.newPage()
    const cdp = await page.context().newCDPSession(page)
    await page.goto(BASE + '/tanzkurse', { waitUntil: 'domcontentloaded', timeout: 20000 })
    await page.waitForTimeout(2400)
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(1800)
    rec(`PILLS_${tag} ` + JSON.stringify(await page.evaluate(census)))
    rec(`LADDER_${tag} ` + JSON.stringify(await page.evaluate(ladder)))

    // park the first pill so all four cards sit in the viewport
    const y = await page.evaluate(() => {
      const el = [...document.querySelectorAll('main *')].find(e =>
        !e.children.length && /^(Beginner|Intermediate|Advanced)\s+Stufe\s+\d+$/i.test((e.textContent || '').trim()))
      if (!el) return null
      const r = el.getBoundingClientRect()
      window.scrollTo(0, Math.max(0, r.top + window.scrollY - 300))
      return Math.round(r.top + window.scrollY)
    })
    rec(`PILL_Y_${tag} ${y}`)
    await page.waitForTimeout(1500)
    const { data } = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false })
    fs.writeFileSync(path.join(OUT, `pills-${tag}.png`), Buffer.from(data, 'base64'))
    console.log(`SHOT pills-${tag}.png`)
    await context.close()
  }
  fs.writeFileSync(path.join(OUT, '_log-pills.json'), JSON.stringify(log, null, 2))
  rec('DONE')
} catch (e) {
  console.error('FAIL', e.stack || e); process.exitCode = 1
} finally { await browser.close() }
