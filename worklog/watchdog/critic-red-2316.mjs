import { chromium } from 'playwright-core'
import fs from 'node:fs'
import path from 'node:path'

const OUT = '/root/clients/salsaflow-w1/worklog/shots/CRITIC-0823-2316'
const BASE = 'http://127.0.0.1:5173'

const browser = await chromium.launch({
  executablePath: '/usr/bin/google-chrome', headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none']
})
const log = []
function rec(m) { log.push(m); console.log(m) }

// collect every filled-red-ish primary button and its computed background
async function reds(page) {
  return page.evaluate(() => {
    const out = []
    for (const el of document.querySelectorAll('a,button')) {
      const cs = getComputedStyle(el)
      const bg = cs.backgroundColor
      const m = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/)
      if (!m) continue
      const [r, g, b, a] = [+m[1], +m[2], +m[3], m[4] === undefined ? 1 : +m[4]]
      if (a < 0.05) continue
      if (!(r > 120 && r > g + 40 && r > b + 40)) continue
      const rect = el.getBoundingClientRect()
      if (rect.width < 40 || rect.height < 20) continue
      out.push({
        t: (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 32),
        bg, color: cs.color, opacity: cs.opacity,
        y: Math.round(rect.y + scrollY), x: Math.round(rect.x)
      })
    }
    return out
  })
}

try {
  for (const [route, tag] of [['/', 'home'], ['/fotos', 'fotos'], ['/kursplan', 'kursplan'], ['/tanzkurse', 'tanzkurse'], ['/events', 'events'], ['/preise', 'preise'], ['/team', 'team'], ['/faq', 'faq'], ['/kontakt', 'kontakt']]) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'de-CH', deviceScaleFactor: 1 })
    const page = await context.newPage()
    await page.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 20000 })
    await page.waitForTimeout(900)
    const r = await reds(page)
    const uniq = {}
    for (const x of r) uniq[x.bg + '|' + x.opacity] = (uniq[x.bg + '|' + x.opacity] || []).concat(x.t)
    rec(`RED_${tag} ` + JSON.stringify(uniq))
    await context.close()
  }

  // zoom on the fotos hero CTA vs navbar CTA
  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'de-CH', deviceScaleFactor: 2 })
    const page = await context.newPage()
    const cdp = await page.context().newCDPSession(page)
    await page.goto(BASE + '/fotos', { waitUntil: 'domcontentloaded', timeout: 20000 })
    await page.waitForTimeout(900)
    const { data } = await cdp.send('Page.captureScreenshot', {
      format: 'png', captureBeyondViewport: false,
      clip: { x: 20, y: 10, width: 700, height: 620, scale: 1 }
    })
    fs.writeFileSync(path.join(OUT, 'fotos-cta-zoom.png'), Buffer.from(data, 'base64'))
    console.log('SHOT fotos-cta-zoom.png')
    await context.close()
  }

  fs.writeFileSync(path.join(OUT, '_log-red.json'), JSON.stringify(log, null, 2))
  rec('DONE')
} catch (e) {
  console.error('FAIL', e.stack || e); process.exitCode = 1
} finally { await browser.close() }
