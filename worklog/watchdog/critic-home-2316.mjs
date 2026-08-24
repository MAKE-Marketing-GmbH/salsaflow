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

try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'de-CH', deviceScaleFactor: 1 })
  const page = await context.newPage()
  const cdp = await page.context().newCDPSession(page)
  async function shot(n) {
    const { data } = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false })
    fs.writeFileSync(path.join(OUT, n), Buffer.from(data, 'base64')); console.log('SHOT ' + n)
  }
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded', timeout: 20000 })
  await page.waitForTimeout(1500)

  const map = await page.evaluate(() => {
    const secs = [...document.querySelectorAll('main section')].map((s, i) => {
      const r = s.getBoundingClientRect()
      const h = s.querySelector('h2,h3')
      const cs = getComputedStyle(s)
      return {
        i, y: Math.round(r.y + scrollY), h: Math.round(r.height),
        bg: cs.backgroundColor,
        title: h ? (h.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 60) : '',
        imgs: s.querySelectorAll('img').length
      }
    })
    return secs
  })
  rec('HOME_SECTIONS ' + JSON.stringify(map))

  // section gaps: bottom of section i to top of i+1
  const gaps = map.slice(0, -1).map((s, i) => ({ from: s.title || `#${s.i}`, gap: map[i + 1].y - (s.y + s.h) }))
  rec('HOME_GAPS ' + JSON.stringify(gaps))

  // community section ("Dein Kurs endet nicht nach der Stunde")
  const comm = map.find(s => /endet nicht nach der Stunde|Community/i.test(s.title))
  if (comm) {
    await page.evaluate(y => window.scrollTo(0, y - 60), comm.y)
    await page.waitForTimeout(700)
    await shot('home-1440-community.png')
    rec('HOME_COMMUNITY ' + JSON.stringify(comm))
  }

  // the four offers right after hero
  await page.evaluate(() => window.scrollTo(0, 850)); await page.waitForTimeout(600)
  await shot('home-1440-y850.png')
  await page.evaluate(() => window.scrollTo(0, 1750)); await page.waitForTimeout(600)
  await shot('home-1440-y1750.png')
  await page.evaluate(() => window.scrollTo(0, 2700)); await page.waitForTimeout(600)
  await shot('home-1440-y2700.png')
  await page.evaluate(() => window.scrollTo(0, 3700)); await page.waitForTimeout(600)
  await shot('home-1440-y3700.png')
  await page.evaluate(() => window.scrollTo(0, 4800)); await page.waitForTimeout(600)
  await shot('home-1440-y4800.png')
  await page.evaluate(() => window.scrollTo(0, 6000)); await page.waitForTimeout(600)
  await shot('home-1440-y6000.png')
  await page.evaluate(() => window.scrollTo(0, 7200)); await page.waitForTimeout(600)
  await shot('home-1440-y7200.png')
  await page.evaluate(() => window.scrollTo(0, 8400)); await page.waitForTimeout(600)
  await shot('home-1440-y8400.png')
  await context.close()

  fs.writeFileSync(path.join(OUT, '_log-home.json'), JSON.stringify(log, null, 2))
  rec('DONE')
} catch (e) {
  console.error('FAIL', e.stack || e); process.exitCode = 1
} finally { await browser.close() }
