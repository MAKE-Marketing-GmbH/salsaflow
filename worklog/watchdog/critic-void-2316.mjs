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
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded', timeout: 20000 })
  await page.waitForTimeout(1600)

  // In the "Vom ersten Grundschritt" section: what occupies the right half at the heading band?
  const v = await page.evaluate(() => {
    const sec = [...document.querySelectorAll('main section')].find(s => /Vom ersten Grundschritt/.test(s.textContent || ''))
    if (!sec) return null
    const sr = sec.getBoundingClientRect()
    const h2 = sec.querySelector('h2')
    const h2r = h2.getBoundingClientRect()
    const img = sec.querySelector('img')
    const ir = img?.getBoundingClientRect()
    // leaf elements with real ink, x >= 700
    const right = [...sec.querySelectorAll('*')].filter(e => {
      if (e.children.length) return false
      const r = e.getBoundingClientRect()
      return r.width > 4 && r.height > 4 && r.x >= 700
    }).map(e => ({ tag: e.tagName, t: (e.textContent || '').trim().slice(0, 24), y: Math.round(e.getBoundingClientRect().y + scrollY) }))
      .sort((a, b) => a.y - b.y)
    return {
      secTop: Math.round(sr.y + scrollY), secH: Math.round(sr.height),
      h2Top: Math.round(h2r.y + scrollY),
      imgTop: ir && Math.round(ir.y + scrollY), imgH: ir && Math.round(ir.height), imgX: ir && Math.round(ir.x),
      firstRightInk: right[0] || null,
      rightCount: right.length
    }
  })
  rec('LEVELS_VOID ' + JSON.stringify(v))
  if (v) rec('LEVELS_VOID_HEIGHT ' + (v.imgTop - v.h2Top) + 'px leer rechts ab Ueberschrift bis Bildoberkante')

  // same probe on the Kurse-Finder section above it (comparison)
  const c = await page.evaluate(() => {
    const sec = [...document.querySelectorAll('main section')].find(s => /Finde deinen n/.test(s.textContent || ''))
    if (!sec) return null
    const h2 = sec.querySelector('h2').getBoundingClientRect()
    const img = sec.querySelector('img')?.getBoundingClientRect()
    return { h2Top: Math.round(h2.y + scrollY), imgTop: img && Math.round(img.y + scrollY), imgX: img && Math.round(img.x) }
  })
  rec('FINDER_CMP ' + JSON.stringify(c))

  // 390 check for same section
  await context.close()
  const c2 = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: 'de-CH', deviceScaleFactor: 1 })
  const p2 = await c2.newPage()
  const cdp2 = await p2.context().newCDPSession(p2)
  await p2.goto(BASE + '/', { waitUntil: 'domcontentloaded', timeout: 20000 })
  await p2.waitForTimeout(1400)
  const m = await p2.evaluate(() => {
    const sec = [...document.querySelectorAll('main section')].find(s => /Vom ersten Grundschritt/.test(s.textContent || ''))
    const h2 = sec.querySelector('h2').getBoundingClientRect()
    const img = sec.querySelector('img')?.getBoundingClientRect()
    return { h2Top: Math.round(h2.y + scrollY), imgTop: img && Math.round(img.y + scrollY), gap: img && Math.round(img.y - h2.bottom) }
  })
  rec('LEVELS_390 ' + JSON.stringify(m))
  await p2.evaluate(y => window.scrollTo(0, y - 80), m.h2Top)
  await p2.waitForTimeout(600)
  const { data } = await cdp2.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false })
  fs.writeFileSync(path.join(OUT, 'home-390-levels.png'), Buffer.from(data, 'base64'))
  console.log('SHOT home-390-levels.png')
  await c2.close()

  // 1440 tight crop of the void
  const c3 = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'de-CH', deviceScaleFactor: 1 })
  const p3 = await c3.newPage()
  const cdp3 = await p3.context().newCDPSession(p3)
  await p3.goto(BASE + '/', { waitUntil: 'domcontentloaded', timeout: 20000 })
  await p3.waitForTimeout(1600)
  await p3.evaluate(y => window.scrollTo(0, y - 120), v.h2Top)
  await p3.waitForTimeout(700)
  const s3 = await cdp3.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false })
  fs.writeFileSync(path.join(OUT, 'home-1440-levels-void.png'), Buffer.from(s3.data, 'base64'))
  console.log('SHOT home-1440-levels-void.png')
  await c3.close()

  fs.writeFileSync(path.join(OUT, '_log-void.json'), JSON.stringify(log, null, 2))
  rec('DONE')
} catch (e) {
  console.error('FAIL', e.stack || e); process.exitCode = 1
} finally { await browser.close() }
