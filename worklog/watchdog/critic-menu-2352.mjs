import { chromium } from 'playwright-core'
import fs from 'node:fs'
import path from 'node:path'

const OUT = '/root/clients/salsaflow-w1/worklog/shots/CRITIC-0823-2352'
const BASE = 'http://127.0.0.1:5173'

const browser = await chromium.launch({
  executablePath: '/usr/bin/google-chrome', headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none']
})
const log = []
function rec(m) { log.push(m); console.log(m) }

try {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: 'de-CH', deviceScaleFactor: 1 })
  const page = await context.newPage()
  const cdp = await page.context().newCDPSession(page)
  async function shot(n) {
    const { data } = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false })
    fs.writeFileSync(path.join(OUT, n), Buffer.from(data, 'base64')); console.log('SHOT ' + n)
  }
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded', timeout: 20000 })
  await page.waitForTimeout(1800)

  // dismiss cookie banner so it does not sit over the panel
  const acc = await page.$('text=Akzeptieren')
  if (acc) { await acc.click({ force: true }).catch(() => {}); await page.waitForTimeout(500) }

  const menuBtn = await page.$('header button:has-text("Menü"), button:has-text("Menü")')
  rec('MENU_BTN ' + !!menuBtn)
  if (menuBtn) { await menuBtn.click({ force: true }); await page.waitForTimeout(1100) }
  await shot('menu-open-390.png')

  const m = await page.evaluate(() => {
    // the open panel: fixed/absolute overlay covering most of the viewport
    const panels = [...document.querySelectorAll('div,nav,aside')].filter(e => {
      const cs = getComputedStyle(e), r = e.getBoundingClientRect()
      return (cs.position === 'fixed' || cs.position === 'absolute') && r.height > 300 && r.width > 300 && cs.visibility !== 'hidden' && parseFloat(cs.opacity) > 0.5
    }).map(e => {
      const r = e.getBoundingClientRect(), cs = getComputedStyle(e)
      return { cls: (e.className || '').toString().slice(0, 55), pos: cs.position, bg: cs.backgroundColor, y: Math.round(r.y), h: Math.round(r.height), w: Math.round(r.width) }
    })
    const links = [...document.querySelectorAll('a,button')].filter(e => {
      const r = e.getBoundingClientRect()
      return r.height > 10 && r.width > 40 && r.y >= 0 && r.y < 900
    }).map(e => {
      const r = e.getBoundingClientRect()
      return { t: (e.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 30), y: Math.round(r.y), h: Math.round(r.height) }
    }).sort((a, b) => a.y - b.y)
    // is the hero still visible behind / below the panel?
    const h1 = document.querySelector('main h1')
    const h1r = h1?.getBoundingClientRect()
    return { panels, links, h1: h1 && { y: Math.round(h1r.y), vis: h1r.bottom > 0 && h1r.top < innerHeight } }
  })
  rec('MENU_OPEN ' + JSON.stringify(m))

  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(300)
  await shot('menu-open-390-b.png')
  await context.close()

  fs.writeFileSync(path.join(OUT, '_log-menu.json'), JSON.stringify(log, null, 2))
  rec('DONE')
} catch (e) {
  console.error('FAIL', e.stack || e); process.exitCode = 1
} finally { await browser.close() }
