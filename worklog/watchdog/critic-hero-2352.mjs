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

// air below the last hero CTA, on every route with a hero
const measure = () => {
  const ctas = [...document.querySelectorAll('main a,main button')].filter(e => {
    const r = e.getBoundingClientRect()
    return r.y > 60 && r.y < 1100 && r.height > 24 && r.width > 60 && (e.textContent || '').trim().length > 3
  })
  const last = ctas.length ? ctas.map(e => ({ e, r: e.getBoundingClientRect() })).sort((a, b) => b.r.bottom - a.r.bottom)[0] : null
  if (!last) return { noCta: true }
  const c = [...document.querySelectorAll('main img, main section, main h2, main div[class*="rounded"]')]
    .map(e => ({ e, r: e.getBoundingClientRect() }))
    .filter(o => o.r.top >= last.r.bottom - 1 && o.r.height > 40)
    .sort((a, b) => a.r.top - b.r.top)[0]
  return {
    cta: (last.e.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 26),
    ctaBottom: Math.round(last.r.bottom),
    next: c && c.e.tagName,
    nextTop: c && Math.round(c.r.top),
    airBelow: c ? Math.round(c.r.top - last.r.bottom) : null
  }
}

try {
  const routes = ['/mehr/partys', '/', '/tanzkurse', '/events', '/preise', '/team', '/faq', '/fotos', '/kontakt', '/kursplan']
  for (const [w, h, tag] of [[1440, 900, '1440'], [390, 844, '390']]) {
    for (const route of routes) {
      const context = await browser.newContext({ viewport: { width: w, height: h }, locale: 'de-CH', deviceScaleFactor: 1 })
      const page = await context.newPage()
      const resp = await page.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 20000 }).catch(() => null)
      if (!resp || resp.status() >= 400) { await context.close(); continue }
      await page.waitForTimeout(1400)
      rec(`AIR_${tag} ${route} ` + JSON.stringify(await page.evaluate(measure)))
      await context.close()
    }
  }

  // partys: is the image really clipping the CTA? measure overlap + zoom crop
  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'de-CH', deviceScaleFactor: 2 })
    const page = await context.newPage()
    const cdp = await page.context().newCDPSession(page)
    await page.goto(BASE + '/mehr/partys', { waitUntil: 'domcontentloaded', timeout: 20000 })
    await page.waitForTimeout(1600)
    const d = await page.evaluate(() => {
      const btn = [...document.querySelectorAll('main a')].find(a => /Danceflow Night ansehen/.test(a.textContent || ''))
      const img = document.querySelector('main img')
      const br = btn.getBoundingClientRect(), ir = img.getBoundingClientRect()
      const sec = btn.closest('section')
      const sr = sec.getBoundingClientRect()
      return {
        btnBottom: Math.round(br.bottom), btnRadius: getComputedStyle(btn).borderRadius,
        imgTop: Math.round(ir.top), imgH: Math.round(ir.height), imgW: Math.round(ir.width),
        overlap: Math.round(br.bottom - ir.top),
        heroSectionBottom: Math.round(sr.bottom),
        heroPadBottom: getComputedStyle(sec).paddingBottom
      }
    })
    rec('PARTYS_CLIP ' + JSON.stringify(d))
    const { data } = await cdp.send('Page.captureScreenshot', {
      format: 'png', captureBeyondViewport: false,
      clip: { x: 30, y: 350, width: 700, height: 160, scale: 1 }
    })
    fs.writeFileSync(path.join(OUT, 'partys-cta-clip-zoom.png'), Buffer.from(data, 'base64'))
    console.log('SHOT partys-cta-clip-zoom.png')
    await context.close()
  }

  // reference: same crop shape on /events hero for comparison
  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'de-CH', deviceScaleFactor: 1 })
    const page = await context.newPage()
    const cdp = await page.context().newCDPSession(page)
    await page.goto(BASE + '/events', { waitUntil: 'domcontentloaded', timeout: 20000 })
    await page.waitForTimeout(1500)
    const { data } = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false })
    fs.writeFileSync(path.join(OUT, 'events-1440-fold0.png'), Buffer.from(data, 'base64'))
    console.log('SHOT events-1440-fold0.png')
    await context.close()
  }

  // mobile menu open on 390 (Menu-Creme Spec 4 second-row candidate)
  {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: 'de-CH', deviceScaleFactor: 1 })
    const page = await context.newPage()
    const cdp = await page.context().newCDPSession(page)
    await page.goto(BASE + '/', { waitUntil: 'domcontentloaded', timeout: 20000 })
    await page.waitForTimeout(1500)
    const btn = await page.$('header button, nav button')
    if (btn) {
      await btn.click({ force: true }).catch(() => {})
      await page.waitForTimeout(900)
      const m = await page.evaluate(() => {
        const cream = [...document.querySelectorAll('div,section,nav')].filter(e => {
          const cs = getComputedStyle(e), r = e.getBoundingClientRect()
          return /251, 250, 248|250, 249, 246/.test(cs.backgroundColor) && r.height > 200 && r.width > 200
        }).map(e => {
          const r = e.getBoundingClientRect()
          return { cls: (e.className || '').toString().slice(0, 40), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height), bg: getComputedStyle(e).backgroundColor }
        })
        const dupes = [...document.querySelectorAll('a')].filter(a => /Kursplan ansehen|Gratis Schnupper/.test(a.textContent || ''))
          .map(a => { const r = a.getBoundingClientRect(); return { t: (a.textContent || '').trim().slice(0, 26), y: Math.round(r.y), vis: r.height > 0 } })
        return { cream, dupes }
      })
      rec('MENU_390 ' + JSON.stringify(m))
      const { data } = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false })
      fs.writeFileSync(path.join(OUT, 'menu-open-390.png'), Buffer.from(data, 'base64'))
      console.log('SHOT menu-open-390.png')
    }
    await context.close()
  }

  fs.writeFileSync(path.join(OUT, '_log-hero.json'), JSON.stringify(log, null, 2))
  rec('DONE')
} catch (e) {
  console.error('FAIL', e.stack || e); process.exitCode = 1
} finally { await browser.close() }
