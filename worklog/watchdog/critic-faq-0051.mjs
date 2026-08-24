import { chromium } from 'playwright-core'
import fs from 'node:fs'
import path from 'node:path'

const OUT = '/root/clients/salsaflow-w1/worklog/shots/CRITIC-0824-0051'
const BASE = 'http://127.0.0.1:5173'

const browser = await chromium.launch({
  executablePath: '/usr/bin/google-chrome', headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none']
})
const log = []
function rec(m) { log.push(m); console.log(m) }

// does the hero section carry a photo at all, and how tall is the empty right half?
const heroMedia = () => {
  const h1 = document.querySelector('main h1')
  const sec = h1.closest('section')
  const sr = sec.getBoundingClientRect()
  const media = [...sec.querySelectorAll('img, video, iframe')].map(e => {
    const r = e.getBoundingClientRect()
    return { tag: e.tagName, x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) }
  }).filter(m => m.w > 40 && m.h > 40)
  // ink strictly right of the text column
  const textRight = Math.max(...[...sec.querySelectorAll('h1,p,a,span')].filter(e => (e.textContent || '').trim()).map(e => e.getBoundingClientRect().right))
  const rightHalf = [...sec.querySelectorAll('*')].filter(e => {
    if (e.children.length) return false
    const r = e.getBoundingClientRect()
    return r.width > 4 && r.height > 4 && r.x >= 760
  }).map(e => { const r = e.getBoundingClientRect(); return { tag: e.tagName, t: (e.textContent || '').trim().slice(0, 20), x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) } })
  return {
    secW: Math.round(sr.width), secH: Math.round(sr.height),
    mediaCount: media.length, media,
    textColumnRight: Math.round(textRight),
    emptyRightWidth: Math.round(sr.width - 52 - textRight),
    rightHalfInk: rightHalf.length, rightHalfSample: rightHalf.slice(0, 4)
  }
}

try {
  for (const route of ['/faq', '/events', '/team', '/preise', '/tanzkurse', '/kontakt', '/fotos', '/mehr/partys', '/']) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'de-CH', deviceScaleFactor: 1 })
    const page = await context.newPage()
    const resp = await page.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 20000 }).catch(() => null)
    if (!resp || resp.status() >= 400) { await context.close(); continue }
    await page.waitForTimeout(2200)
    rec(`HEROMEDIA ${route} ` + JSON.stringify(await page.evaluate(heroMedia)))
    await context.close()
  }

  // partys band: tight crop at deviceScaleFactor 2 to judge the 208px strip
  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'de-CH', deviceScaleFactor: 2 })
    const page = await context.newPage()
    const cdp = await page.context().newCDPSession(page)
    await page.goto(BASE + '/mehr/partys', { waitUntil: 'domcontentloaded', timeout: 20000 })
    await page.waitForTimeout(2400)
    const { data } = await cdp.send('Page.captureScreenshot', {
      format: 'png', captureBeyondViewport: false, clip: { x: 0, y: 505, width: 1440, height: 240, scale: 1 }
    })
    fs.writeFileSync(path.join(OUT, 'partys-band-zoom.png'), Buffer.from(data, 'base64'))
    console.log('SHOT partys-band-zoom.png')
    await context.close()
  }
  // events band for comparison, same crop height
  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'de-CH', deviceScaleFactor: 2 })
    const page = await context.newPage()
    const cdp = await page.context().newCDPSession(page)
    await page.goto(BASE + '/events', { waitUntil: 'domcontentloaded', timeout: 20000 })
    await page.waitForTimeout(2400)
    const { data } = await cdp.send('Page.captureScreenshot', {
      format: 'png', captureBeyondViewport: false, clip: { x: 0, y: 565, width: 1440, height: 240, scale: 1 }
    })
    fs.writeFileSync(path.join(OUT, 'events-band-zoom.png'), Buffer.from(data, 'base64'))
    console.log('SHOT events-band-zoom.png')
    await context.close()
  }

  fs.writeFileSync(path.join(OUT, '_log-faq.json'), JSON.stringify(log, null, 2))
  rec('DONE')
} catch (e) {
  console.error('FAIL', e.stack || e); process.exitCode = 1
} finally { await browser.close() }
