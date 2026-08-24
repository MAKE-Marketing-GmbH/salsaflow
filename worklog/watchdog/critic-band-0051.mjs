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

// how flat is the hero photo band, and how much of the source image survives?
const bandProbe = () => {
  const img = document.querySelector('main img')
  if (!img) return { none: true }
  const r = img.getBoundingClientRect()
  const cs = getComputedStyle(img)
  const nw = img.naturalWidth, nh = img.naturalHeight
  // object-fit: cover => scale = max(w/nw, h/nh); visible source fraction vertically
  const scale = Math.max(r.width / nw, r.height / nh)
  const shownH = r.height / scale
  return {
    boxW: Math.round(r.width), boxH: Math.round(r.height),
    ratio: +(r.width / r.height).toFixed(2),
    natural: `${nw}x${nh}`, naturalRatio: +(nw / nh).toFixed(2),
    objectFit: cs.objectFit, objectPosition: cs.objectPosition,
    visibleSourceFraction: +(shownH / nh).toFixed(2),
    croppedAwayPct: Math.round((1 - shownH / nh) * 100)
  }
}

try {
  const routes = ['/mehr/partys', '/events', '/team', '/preise', '/tanzkurse']
  for (const [w, h, tag] of [[1440, 900, '1440'], [390, 844, '390']]) {
    for (const route of routes) {
      const context = await browser.newContext({ viewport: { width: w, height: h }, locale: 'de-CH', deviceScaleFactor: 1 })
      const page = await context.newPage()
      const resp = await page.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 20000 }).catch(() => null)
      if (!resp || resp.status() >= 400) { await context.close(); continue }
      await page.waitForTimeout(2200)
      rec(`BAND_${tag} ${route} ` + JSON.stringify(await page.evaluate(bandProbe)))
      await context.close()
    }
  }

  // FAQ hero: measure the dead zone right and below
  for (const [w, h, tag] of [[1440, 900, '1440'], [1280, 900, '1280']]) {
    const context = await browser.newContext({ viewport: { width: w, height: h }, locale: 'de-CH', deviceScaleFactor: 1 })
    const page = await context.newPage()
    const cdp = await page.context().newCDPSession(page)
    await page.goto(BASE + '/faq', { waitUntil: 'domcontentloaded', timeout: 20000 })
    await page.waitForTimeout(2400)
    const f = await page.evaluate(() => {
      const h1 = document.querySelector('main h1')
      const sec = h1.closest('section')
      const sr = sec.getBoundingClientRect()
      const leaves = [...sec.querySelectorAll('*')].filter(e => {
        if (e.children.length) return false
        const r = e.getBoundingClientRect()
        return r.width > 4 && r.height > 4 && (e.textContent || '').trim()
      }).map(e => { const r = e.getBoundingClientRect(); return { t: (e.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 34), x: Math.round(r.x), right: Math.round(r.right), y: Math.round(r.y), bottom: Math.round(r.bottom) } })
      const maxRight = Math.max(...leaves.map(l => l.right))
      const maxBottom = Math.max(...leaves.map(l => l.bottom))
      return {
        secW: Math.round(sr.width), secH: Math.round(sr.height), secBottom: Math.round(sr.bottom),
        contentMaxRight: maxRight, deadRight: Math.round(sr.width - maxRight),
        contentMaxBottom: maxBottom, deadBottom: Math.round(sr.bottom - maxBottom),
        lastLine: leaves.sort((a, b) => b.bottom - a.bottom)[0]
      }
    })
    rec(`FAQDEAD_${tag} ` + JSON.stringify(f))
    // comparison: do other heroes fill the right half?
    await context.close()
  }

  for (const route of ['/events', '/team', '/preise', '/kontakt', '/tanzkurse', '/mehr/partys']) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'de-CH', deviceScaleFactor: 1 })
    const page = await context.newPage()
    const resp = await page.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 20000 }).catch(() => null)
    if (!resp || resp.status() >= 400) { await context.close(); continue }
    await page.waitForTimeout(2200)
    const d = await page.evaluate(() => {
      const h1 = document.querySelector('main h1')
      const sec = h1.closest('section')
      const sr = sec.getBoundingClientRect()
      const leaves = [...sec.querySelectorAll('*')].filter(e => {
        if (e.children.length) return false
        const r = e.getBoundingClientRect()
        return r.width > 4 && r.height > 4 && ((e.textContent || '').trim() || e.tagName === 'IMG')
      }).map(e => e.getBoundingClientRect())
      const imgs = [...sec.querySelectorAll('img')].map(e => e.getBoundingClientRect()).filter(r => r.height > 40)
      const maxRight = Math.max(...leaves.map(r => r.right), ...imgs.map(r => r.right))
      return { secW: Math.round(sr.width), maxRight: Math.round(maxRight), deadRight: Math.round(sr.width - maxRight), hasHeroImg: imgs.length }
    })
    rec(`HERORIGHT ${route} ` + JSON.stringify(d))
    await context.close()
  }

  fs.writeFileSync(path.join(OUT, '_log-band.json'), JSON.stringify(log, null, 2))
  rec('DONE')
} catch (e) {
  console.error('FAIL', e.stack || e); process.exitCode = 1
} finally { await browser.close() }
