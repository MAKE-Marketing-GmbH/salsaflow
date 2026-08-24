import { chromium } from 'playwright-core'
import fs from 'node:fs'
import path from 'node:path'

const OUT = '/root/clients/salsaflow-w1/worklog/shots/CRITIC-0824-0251'
const BASE = 'http://127.0.0.1:5173'

const browser = await chromium.launch({
  executablePath: '/usr/bin/google-chrome', headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none']
})
const log = []
function rec(m) { log.push(m); console.log(m) }

// what actually paints at the top of the viewport while scrolled?
const navState = () => {
  const out = []
  for (const e of document.querySelectorAll('*')) {
    const cs = getComputedStyle(e)
    if (cs.position !== 'fixed' && cs.position !== 'sticky') continue
    const r = e.getBoundingClientRect()
    if (r.height < 16 || r.width < 200) continue
    if (r.top > 160 || r.bottom < 0) continue
    out.push({
      tag: e.tagName, cls: (e.className || '').toString().slice(0, 40), pos: cs.position,
      top: Math.round(r.top), bottom: Math.round(r.bottom), h: Math.round(r.height),
      w: Math.round(r.width), z: cs.zIndex, bg: cs.backgroundColor, opacity: cs.opacity,
      transform: cs.transform.slice(0, 40)
    })
  }
  return out.sort((a, b) => b.bottom - a.bottom)
}

// hit-test the point just under the bar: what is painted there, nav or content?
const hitUnderBar = () => {
  const bars = []
  for (const e of document.querySelectorAll('*')) {
    const cs = getComputedStyle(e)
    if (cs.position !== 'fixed' && cs.position !== 'sticky') continue
    const r = e.getBoundingClientRect()
    if (r.height >= 16 && r.width >= 200 && r.top <= 160 && r.bottom > 0) bars.push(r.bottom)
  }
  if (!bars.length) return { noBar: true }
  const barBottom = Math.max(...bars)
  const hits = []
  for (const e of document.querySelectorAll('main h1,main h2,main h3')) {
    const r = e.getBoundingClientRect()
    if (r.height < 4) continue
    let top = r.top
    const tn = [...e.childNodes].find(n => n.nodeType === 3 && n.textContent.trim())
    if (tn) { const rg = document.createRange(); rg.selectNodeContents(tn); const rr = rg.getBoundingClientRect(); if (rr.height > 0) top = rr.top }
    // heading ink starts inside the viewport but above the bar's lower edge
    if (top >= 0 && top < barBottom) {
      const cx = Math.round(r.left + Math.min(r.width, 200) / 2)
      const el = document.elementFromPoint(cx, Math.round(top + 4))
      const coveredBy = el && !e.contains(el) && el !== e ? { tag: el.tagName, cls: (el.className || '').toString().slice(0, 34) } : null
      hits.push({ t: (e.textContent || '').trim().slice(0, 40), inkTop: Math.round(top), barBottom: Math.round(barBottom), overlap: Math.round(barBottom - top), coveredBy })
    }
  }
  return { barBottom: Math.round(barBottom), hits }
}

const ROUTES = ['/', '/tanzkurse', '/kursplan', '/preise', '/events', '/team', '/fotos', '/faq', '/schnupperstunde', '/kontakt', '/mehr/partys', '/mehr/tanzschuhe', '/kontakt/standort-raumvermietung']

try {
  for (const [w, h, tag] of [[1440, 900, '1440'], [390, 844, '390']]) {
    for (const route of ROUTES) {
      const context = await browser.newContext({ viewport: { width: w, height: h }, locale: 'de-CH', deviceScaleFactor: 1 })
      const page = await context.newPage()
      await page.addInitScript(`window.__nav = ${navState.toString()}; window.__hit = ${hitUnderBar.toString()}`)
      const resp = await page.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 20000 }).catch(() => null)
      if (!resp || resp.status() >= 400) { await context.close(); continue }
      await page.waitForTimeout(2300)
      await page.evaluate(() => window.scrollTo(0, 900))
      await page.waitForTimeout(900)
      if (route === '/tanzkurse') rec(`NAVSTATE_${tag} ` + JSON.stringify(await page.evaluate(() => window.__nav())))
      const worst = await page.evaluate(async () => {
        const sleep = ms => new Promise(r => setTimeout(r, ms))
        let worst = null
        const H = document.body.scrollHeight
        for (let y = 300; y < H; y += Math.round(window.innerHeight * 0.55)) {
          window.scrollTo(0, y)
          await sleep(300)
          const c = window.__hit()
          if (c.hits) for (const x of c.hits) if (!worst || x.overlap > worst.overlap) worst = { ...x, scrollY: y }
        }
        window.scrollTo(0, 0)
        return worst
      }).catch(e => ({ err: String(e).slice(0, 90) }))
      rec(`BAR_${tag} ${route} ` + JSON.stringify(worst))
      await context.close()
    }
  }
  fs.writeFileSync(path.join(OUT, '_log-sticky2.json'), JSON.stringify(log, null, 2))
  rec('DONE')
} catch (e) {
  console.error('FAIL', e.stack || e); process.exitCode = 1
} finally { await browser.close() }
