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

// exact text match, so we land on the course-card pills and not on the ladder
const findPill = () => {
  const el = [...document.querySelectorAll('main *')].find(e =>
    !e.children.length && (e.textContent || '').trim() === 'Intermediate Stufe 8')
  if (!el) return null
  const r = el.getBoundingClientRect()
  window.scrollTo(0, Math.max(0, r.top + window.scrollY - 260))
  return Math.round(r.top + window.scrollY)
}

// full colour census of every level pill on the page, in DOM order
const census = () => {
  const rows = []
  for (const e of document.querySelectorAll('main *')) {
    if (e.children.length) continue
    const t = (e.textContent || '').trim()
    if (!/Stufe\s+\d+/.test(t) && !/^(Beginner|Intermediate|Advanced)\b/.test(t)) continue
    const cs = getComputedStyle(e)
    const r = e.getBoundingClientRect()
    if (r.width < 4) continue
    rows.push({ t: t.slice(0, 30), fs: +parseFloat(cs.fontSize).toFixed(1), color: cs.color, bg: cs.backgroundColor, y: Math.round(r.top + window.scrollY), x: Math.round(r.left) })
  }
  return rows.sort((a, b) => a.y - b.y || a.x - b.x)
}

try {
  for (const [w, h, tag] of [[1440, 900, '1440'], [390, 844, '390']]) {
    const context = await browser.newContext({ viewport: { width: w, height: h }, locale: 'de-CH', deviceScaleFactor: 2 })
    const page = await context.newPage()
    const cdp = await page.context().newCDPSession(page)
    await page.goto(BASE + '/tanzkurse', { waitUntil: 'domcontentloaded', timeout: 20000 })
    await page.waitForTimeout(2400)
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(1800)
    rec(`CENSUS_${tag} ` + JSON.stringify(await page.evaluate(census)))
    const y = await page.evaluate(findPill)
    rec(`PILL_Y_${tag} ${y}`)
    await page.waitForTimeout(1500)
    const { data } = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false })
    fs.writeFileSync(path.join(OUT, `pills-${tag}.png`), Buffer.from(data, 'base64'))
    console.log(`SHOT pills-${tag}.png`)
    await context.close()
  }
  fs.writeFileSync(path.join(OUT, '_log-badge2.json'), JSON.stringify(log, null, 2))
  rec('DONE')
} catch (e) {
  console.error('FAIL', e.stack || e); process.exitCode = 1
} finally { await browser.close() }
