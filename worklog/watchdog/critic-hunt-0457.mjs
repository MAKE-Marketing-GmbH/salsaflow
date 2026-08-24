import { chromium } from 'playwright-core'
import fs from 'node:fs'
import path from 'node:path'

const OUT = '/root/clients/salsaflow-w1/worklog/shots/CRITIC-0824-0457'
const BASE = 'http://127.0.0.1:5173'

const ROUTES = ['/', '/tanzkurse', '/events', '/ueber-uns', '/preise', '/faq', '/kontakt', '/mehr/partys']

const browser = await chromium.launch({
  executablePath: '/usr/bin/google-chrome', headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none']
})
const log = []
function rec(m) { log.push(m); console.log(m) }

// structural defects that survive a reveal: overflow, clipped text, tiny tap
// targets, images with no intrinsic size, elements poking out of the viewport
const scan = () => {
  const vw = window.innerWidth
  const out = { overflowX: Math.round(document.documentElement.scrollWidth - vw), wide: [], clipped: [], tinyTap: [], brokenImg: [], lowContrast: [] }
  for (const el of document.querySelectorAll('main *')) {
    const cs = getComputedStyle(el)
    if (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0') continue
    const r = el.getBoundingClientRect()
    if (r.width < 1 || r.height < 1) continue
    // sticking out horizontally
    if (r.right > vw + 2 || r.left < -2) {
      if (el.children.length <= 2) out.wide.push({ tag: el.tagName, cls: (el.className || '').toString().slice(0, 40), left: Math.round(r.left), right: Math.round(r.right), txt: (el.textContent || '').trim().slice(0, 26) })
    }
    // text cut off by a fixed height
    if (el.children.length === 0 && (el.textContent || '').trim()) {
      if (el.scrollHeight > el.clientHeight + 3 && cs.overflow !== 'visible') {
        out.clipped.push({ tag: el.tagName, cls: (el.className || '').toString().slice(0, 34), h: el.clientHeight, need: el.scrollHeight, txt: (el.textContent || '').trim().slice(0, 34) })
      }
    }
    // interactive but smaller than a fingertip
    if (/^(A|BUTTON)$/.test(el.tagName) && (el.textContent || '').trim()) {
      if ((r.height < 30 || r.width < 30) && r.height > 2) {
        out.tinyTap.push({ tag: el.tagName, w: Math.round(r.width), h: Math.round(r.height), txt: (el.textContent || '').trim().slice(0, 26) })
      }
    }
  }
  for (const img of document.querySelectorAll('main img')) {
    const r = img.getBoundingClientRect()
    if (r.width < 1) continue
    if (!img.complete || img.naturalWidth === 0) out.brokenImg.push({ src: (img.currentSrc || img.src || '').slice(-52), alt: (img.alt || '').slice(0, 22) })
    else if (!img.getAttribute('alt')) out.lowContrast.push({ noAlt: (img.currentSrc || img.src || '').slice(-46) })
  }
  out.wide = out.wide.slice(0, 6); out.clipped = out.clipped.slice(0, 6)
  out.tinyTap = out.tinyTap.slice(0, 6); out.brokenImg = out.brokenImg.slice(0, 6); out.lowContrast = out.lowContrast.slice(0, 5)
  return out
}

try {
  for (const [w, h, tag] of [[390, 844, '390'], [1440, 900, '1440']]) {
    const context = await browser.newContext({ viewport: { width: w, height: h }, locale: 'de-CH', deviceScaleFactor: 1 })
    const page = await context.newPage()
    await page.addInitScript(`window.__scan = ${scan.toString()}`)
    await page.route('**/*', r => (r.request().method() !== 'GET' && !r.request().url().startsWith(BASE)) ? r.abort() : r.continue())
    for (const route of ROUTES) {
      const errs = []
      page.removeAllListeners('console')
      page.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 90)) })
      await page.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 20000 }).catch(() => {})
      await page.waitForTimeout(2400)
      // let the reveal finish, then walk the page so lazy sections mount
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight) {
          window.scrollTo(0, y); await new Promise(r => setTimeout(r, 260))
        }
        window.scrollTo(0, 0)
      })
      await page.waitForTimeout(1400)
      const res = await page.evaluate(() => window.__scan())
      rec(`${tag} ${route} ` + JSON.stringify({ ...res, consoleErrors: errs.slice(0, 3) }))
    }
    await context.close()
  }
  fs.writeFileSync(path.join(OUT, '_log-hunt.json'), JSON.stringify(log, null, 2))
  rec('DONE')
} catch (e) {
  console.error('FAIL', e.stack || e); process.exitCode = 1
} finally { await browser.close() }
