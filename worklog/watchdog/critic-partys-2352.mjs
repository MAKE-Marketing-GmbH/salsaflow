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

// which text lines are overlapped by the hero photo band?
const clipProbe = () => {
  const img = document.querySelector('main img')
  const ir = img.getBoundingClientRect()
  const covered = [...document.querySelectorAll('main p, main span, main h1, main h2, main a')].filter(e => {
    if (e.querySelector('p,span,h1,h2,a')) return false
    const r = e.getBoundingClientRect()
    if (r.width < 20 || r.height < 8) return false
    if (!(e.textContent || '').trim()) return false
    // element straddles the image top edge => visually cut
    return r.top < ir.top && r.bottom > ir.top + 2
  }).map(e => {
    const r = e.getBoundingClientRect()
    return { tag: e.tagName, t: (e.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 48), top: Math.round(r.top), bottom: Math.round(r.bottom), cutBy: Math.round(r.bottom - ir.top) }
  })
  return { imgTop: Math.round(ir.top), imgH: Math.round(ir.height), covered }
}

// hero air above: breadcrumb / nav to h1
const airAbove = () => {
  const nav = document.querySelector('header') || document.querySelector('nav')
  const nr = nav?.getBoundingClientRect()
  const h1 = document.querySelector('main h1')
  const hr = h1.getBoundingClientRect()
  const bc = [...document.querySelectorAll('main nav, main ol, main [class*="breadcrumb"]')].map(e => e.getBoundingClientRect()).filter(r => r.height > 5 && r.top < hr.top).sort((a, b) => b.bottom - a.bottom)[0]
  return {
    navBottom: nr && Math.round(nr.bottom),
    breadcrumbBottom: bc && Math.round(bc.bottom),
    h1Top: Math.round(hr.top),
    airFromNav: nr && Math.round(hr.top - nr.bottom),
    airFromBreadcrumb: bc && Math.round(hr.top - bc.bottom)
  }
}

try {
  for (const [w, h, tag] of [[1440, 900, '1440'], [390, 844, '390'], [768, 1024, '768']]) {
    const context = await browser.newContext({ viewport: { width: w, height: h }, locale: 'de-CH', deviceScaleFactor: 1 })
    const page = await context.newPage()
    const cdp = await page.context().newCDPSession(page)
    await page.goto(BASE + '/mehr/partys', { waitUntil: 'domcontentloaded', timeout: 20000 })
    await page.waitForTimeout(1600)
    rec(`PARTYS_CLIP_${tag} ` + JSON.stringify(await page.evaluate(clipProbe)))
    rec(`PARTYS_AIR_${tag} ` + JSON.stringify(await page.evaluate(airAbove)))
    const { data } = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false })
    fs.writeFileSync(path.join(OUT, `partys-${tag}-hero.png`), Buffer.from(data, 'base64'))
    console.log(`SHOT partys-${tag}-hero.png`)
    await context.close()
  }

  // same probe on the sibling heroes that use the same photo-band pattern
  for (const route of ['/events', '/team', '/preise', '/tanzkurse']) {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: 'de-CH', deviceScaleFactor: 1 })
    const page = await context.newPage()
    await page.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 20000 })
    await page.waitForTimeout(1400)
    rec(`SIBLING_390 ${route} ` + JSON.stringify(await page.evaluate(clipProbe)))
    await context.close()
  }

  fs.writeFileSync(path.join(OUT, '_log-partys.json'), JSON.stringify(log, null, 2))
  rec('DONE')
} catch (e) {
  console.error('FAIL', e.stack || e); process.exitCode = 1
} finally { await browser.close() }
