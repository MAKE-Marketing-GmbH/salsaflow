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

// two-column FAQ block: how far does the left rail fall short of the right list?
const colProbe = () => {
  const h2 = [...document.querySelectorAll('main h2')].find(e => /Fragen/i.test(e.textContent || ''))
  if (!h2) return { none: true }
  const sec = h2.closest('section')
  const sr = sec.getBoundingClientRect()
  const mid = sr.left + sr.width * 0.45
  const leaves = [...sec.querySelectorAll('*')].filter(e => {
    if (e.children.length) return false
    const r = e.getBoundingClientRect()
    return r.width > 4 && r.height > 4
  }).map(e => {
    const r = e.getBoundingClientRect()
    return { t: (e.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 30) || e.tagName, x: r.x, y: r.y + window.scrollY, bottom: r.bottom + window.scrollY }
  })
  const left = leaves.filter(l => l.x < mid)
  const right = leaves.filter(l => l.x >= mid)
  if (!left.length || !right.length) return { singleColumn: true, secH: Math.round(sr.height) }
  const lTop = Math.min(...left.map(l => l.y)), lBottom = Math.max(...left.map(l => l.bottom))
  const rTop = Math.min(...right.map(l => l.y)), rBottom = Math.max(...right.map(l => l.bottom))
  return {
    secH: Math.round(sr.height),
    leftH: Math.round(lBottom - lTop), rightH: Math.round(rBottom - rTop),
    leftBottom: Math.round(lBottom), rightBottom: Math.round(rBottom),
    shortfall: Math.round(rBottom - lBottom),
    ratio: +((lBottom - lTop) / (rBottom - rTop)).toFixed(2),
    leftLast: left.sort((a, b) => b.bottom - a.bottom)[0]?.t,
    rightLast: right.sort((a, b) => b.bottom - a.bottom)[0]?.t
  }
}

const ROUTES = ['/preise', '/faq', '/mehr/partys', '/mehr/tanzschuhe', '/kontakt/standort-raumvermietung', '/tanzkurse', '/events', '/schnupperstunde']

try {
  for (const route of ROUTES) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'de-CH', deviceScaleFactor: 1 })
    const page = await context.newPage()
    const cdp = await page.context().newCDPSession(page)
    const resp = await page.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 20000 }).catch(() => null)
    if (!resp || resp.status() >= 400) { await context.close(); continue }
    await page.waitForTimeout(2300)
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(1600)
    const c = await page.evaluate(colProbe)
    rec(`FAQCOL ${route} ` + JSON.stringify(c))
    if (c.shortfall !== undefined && c.shortfall > 120) {
      const y = await page.evaluate(() => {
        const h2 = [...document.querySelectorAll('main h2')].find(e => /Fragen/i.test(e.textContent || ''))
        return Math.max(0, Math.round(h2.getBoundingClientRect().top + window.scrollY) - 90)
      })
      await page.evaluate(yy => window.scrollTo(0, yy), y)
      await page.waitForTimeout(1200)
      const slug = route.replace(/\//g, '_').replace(/^_/, '')
      const { data } = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false })
      fs.writeFileSync(path.join(OUT, `faqcol-${slug}.png`), Buffer.from(data, 'base64'))
      console.log(`SHOT faqcol-${slug}.png`)
    }
    await context.close()
  }
  fs.writeFileSync(path.join(OUT, '_log-faqcol.json'), JSON.stringify(log, null, 2))
  rec('DONE')
} catch (e) {
  console.error('FAIL', e.stack || e); process.exitCode = 1
} finally { await browser.close() }
