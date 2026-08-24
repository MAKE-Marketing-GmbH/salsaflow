import { chromium } from 'playwright-core'
import fs from 'node:fs'
import path from 'node:path'

const OUT = '/root/clients/salsaflow-w1/worklog/shots/CRITIC-0823-2352'
const BASE = 'http://127.0.0.1:5173'
fs.mkdirSync(OUT, { recursive: true })

const browser = await chromium.launch({
  executablePath: '/usr/bin/google-chrome', headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none']
})
const log = []
function rec(m) { log.push(m); console.log(m) }

async function newPage(w, h) {
  const context = await browser.newContext({ viewport: { width: w, height: h }, locale: 'de-CH', deviceScaleFactor: 1 })
  const page = await context.newPage()
  const cdp = await page.context().newCDPSession(page)
  async function shot(name) {
    const { data } = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false })
    fs.writeFileSync(path.join(OUT, name), Buffer.from(data, 'base64'))
    console.log('SHOT ' + name)
  }
  return { context, page, shot }
}

// ink present in the right half within the heading band of a section
async function rightHalfInk(page, needle) {
  return page.evaluate((nd) => {
    const sec = [...document.querySelectorAll('main section')].find(s => new RegExp(nd).test(s.textContent || ''))
    if (!sec) return { missing: true }
    const h2 = sec.querySelector('h2')
    const h2r = h2.getBoundingClientRect()
    // heading band = from h2 top down to the first big media/list block
    const img = sec.querySelector('img')
    const ir = img?.getBoundingClientRect()
    const bandTop = h2r.top, bandBottom = ir ? ir.top : h2r.bottom + 300
    const leaves = [...sec.querySelectorAll('*')].filter(e => {
      if (e.children.length) return false
      const r = e.getBoundingClientRect()
      if (r.width < 4 || r.height < 4) return false
      if (r.x < 700) return false
      return r.top < bandBottom && r.bottom > bandTop
    }).map(e => {
      const r = e.getBoundingClientRect()
      return { tag: e.tagName, t: (e.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 30), x: Math.round(r.x), y: Math.round(r.y + scrollY), w: Math.round(r.width), h: Math.round(r.height) }
    }).sort((a, b) => a.y - b.y)
    return {
      h2: (h2.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 50),
      h2Top: Math.round(h2r.y + scrollY), h2Bottom: Math.round(h2r.bottom + scrollY),
      imgTop: ir && Math.round(ir.y + scrollY), imgX: ir && Math.round(ir.x),
      bandHeight: Math.round(bandBottom - bandTop),
      rightInkCount: leaves.length,
      rightInk: leaves.slice(0, 6)
    }
  }, needle)
}

try {
  { const { context, page } = await newPage(1440, 900); await page.goto(BASE + '/', { waitUntil: 'networkidle', timeout: 25000 }); await page.waitForTimeout(300); await context.close() }

  // --- 1) Home-Levels claim ---
  for (const [w, h, tag] of [[1440, 900, '1440'], [1280, 900, '1280'], [390, 844, '390']]) {
    const { context, page, shot } = await newPage(w, h)
    await page.goto(BASE + '/', { waitUntil: 'domcontentloaded', timeout: 20000 })
    await page.waitForTimeout(1600)
    const lv = await rightHalfInk(page, 'Vom ersten Grundschritt')
    rec(`LEVELS_${tag} ` + JSON.stringify(lv))
    // comparison: the ScheduleTeaser section right above
    const st = await rightHalfInk(page, 'Finde deinen n')
    rec(`TEASER_${tag} ` + JSON.stringify(st))
    if (lv.h2Top) {
      await page.evaluate(y => window.scrollTo(0, y - 120), lv.h2Top)
      await page.waitForTimeout(700)
      await shot(`home-${tag}-levels.png`)
    }
    await context.close()
  }

  // --- 2) /mehr/partys CTA-to-band ---
  for (const route of ['/mehr/partys', '/partys']) {
    const { context, page, shot } = await newPage(1440, 900)
    const resp = await page.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 20000 }).catch(() => null)
    if (!resp || resp.status() >= 400) { rec(`PARTYS_STATUS ${route} ${resp?.status()}`); await context.close(); continue }
    await page.waitForTimeout(1200)
    const p = await page.evaluate(() => {
      const ctas = [...document.querySelectorAll('main a,main button')].filter(e => {
        const r = e.getBoundingClientRect()
        return r.y > 60 && r.y < 1100 && r.height > 24 && r.width > 60 && (e.textContent || '').trim().length > 3
      })
      const last = ctas.length ? ctas.map(e => ({ e, r: e.getBoundingClientRect() })).sort((a, b) => b.r.bottom - a.r.bottom)[0] : null
      let next = null
      if (last) {
        const c = [...document.querySelectorAll('main img, main section, main h2, main div[class*="rounded"]')]
          .map(e => ({ e, r: e.getBoundingClientRect() }))
          .filter(o => o.r.top >= last.r.bottom - 1 && o.r.height > 40)
          .sort((a, b) => a.r.top - b.r.top)[0]
        if (c) next = { tag: c.e.tagName, cls: (c.e.className || '').toString().slice(0, 50), top: Math.round(c.r.top), bg: getComputedStyle(c.e).backgroundColor }
      }
      return {
        h1: document.querySelector('main h1')?.textContent?.trim().slice(0, 50),
        lastCta: last && { t: (last.e.textContent || '').trim().slice(0, 30), bottom: Math.round(last.r.bottom) },
        next,
        gap: last && next ? Math.round(next.top - last.r.bottom) : null,
        hs: [...document.querySelectorAll('main h1,main h2')].map(h => (h.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 50))
      }
    })
    rec(`PARTYS_1440 ${route} ` + JSON.stringify(p))
    await shot('partys-1440-fold0.png')
    await page.evaluate(() => window.scrollTo(0, 800)); await page.waitForTimeout(400)
    await shot('partys-1440-y800.png')
    await context.close()

    const { context: c2, page: p2, shot: s2 } = await newPage(390, 844)
    await p2.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 20000 })
    await p2.waitForTimeout(1000)
    await s2('partys-390-fold0.png')
    await c2.close()
    break
  }

  // --- 3) same right-half-void probe across every section of every page ---
  const routes = ['/', '/tanzkurse', '/events', '/preise', '/team', '/faq', '/kontakt', '/fotos', '/kursplan']
  for (const route of routes) {
    const tag = route === '/' ? 'home' : route.replace(/\//g, '')
    const { context, page } = await newPage(1440, 900)
    const resp = await page.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 20000 }).catch(() => null)
    if (!resp || resp.status() >= 400) { await context.close(); continue }
    await page.waitForTimeout(1400)
    const voids = await page.evaluate(() => {
      const out = []
      for (const sec of document.querySelectorAll('main section')) {
        const h2 = sec.querySelector('h2')
        if (!h2) continue
        const hr = h2.getBoundingClientRect()
        if (hr.x > 700) continue           // heading already right-side
        if (hr.width > 900) continue        // centered/full-width heading: not a 2-col layout
        const media = [...sec.querySelectorAll('img, div[class*="rounded"]')].map(e => e.getBoundingClientRect()).filter(r => r.height > 60)[0]
        const bandBottom = media ? media.top : hr.bottom + 260
        if (bandBottom - hr.top < 80) continue
        const ink = [...sec.querySelectorAll('*')].filter(e => {
          if (e.children.length) return false
          const r = e.getBoundingClientRect()
          return r.width > 4 && r.height > 4 && r.x >= 700 && r.top < bandBottom && r.bottom > hr.top
        }).length
        out.push({
          h2: (h2.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 44),
          band: Math.round(bandBottom - hr.top),
          rightInk: ink
        })
      }
      return out.filter(o => o.rightInk === 0 && o.band >= 120)
    })
    rec(`VOIDS_${tag} ` + JSON.stringify(voids))
    await context.close()
  }

  fs.writeFileSync(path.join(OUT, '_log.json'), JSON.stringify(log, null, 2))
  rec('DONE')
} catch (e) {
  console.error('FAIL', e.stack || e); process.exitCode = 1
} finally { await browser.close() }
