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

const navBox = () => {
  const cands = [...document.querySelectorAll('header,nav,body > div > div')]
    .filter(e => { const cs = getComputedStyle(e); return cs.position === 'fixed' || cs.position === 'sticky' })
    .map(e => { const r = e.getBoundingClientRect(); return { tag: e.tagName, pos: getComputedStyle(e).position, top: Math.round(r.top), bottom: Math.round(r.bottom), h: Math.round(r.height), z: getComputedStyle(e).zIndex } })
    .filter(b => b.h > 20 && b.top < 200)
  return cands.sort((a, b) => b.h - a.h)[0] || null
}

// does the sticky bar cover any heading after a deep scroll?
const coverProbe = () => {
  const nav = (() => {
    const c = [...document.querySelectorAll('header,nav,body > div > div')]
      .filter(e => { const cs = getComputedStyle(e); return cs.position === 'fixed' || cs.position === 'sticky' })
      .map(e => { const r = e.getBoundingClientRect(); return { bottom: r.bottom, h: r.height } })
      .filter(b => b.h > 20 && b.bottom < 240)
    return c.sort((a, b) => b.h - a.h)[0]
  })()
  if (!nav) return { noNav: true }
  const hit = []
  for (const e of document.querySelectorAll('main h1,main h2,main h3')) {
    const r = e.getBoundingClientRect()
    if (r.height < 4 || r.bottom < 0 || r.top > window.innerHeight) continue
    // ink top via Range, not the padded block box
    let top = r.top
    const tn = [...e.childNodes].find(n => n.nodeType === 3 && n.textContent.trim())
    if (tn) { const rg = document.createRange(); rg.selectNodeContents(tn); const rr = rg.getBoundingClientRect(); if (rr.height > 0) top = rr.top }
    if (top < nav.bottom && r.bottom > 0) {
      hit.push({ t: (e.textContent || '').trim().slice(0, 40), tag: e.tagName, inkTop: Math.round(top), navBottom: Math.round(nav.bottom), overlap: Math.round(nav.bottom - top) })
    }
  }
  return { navBottom: Math.round(nav.bottom), hit }
}

const ROUTES = ['/', '/tanzkurse', '/kursplan', '/preise', '/events', '/team', '/fotos', '/faq', '/schnupperstunde', '/kontakt', '/mehr/partys', '/mehr/tanzschuhe', '/kontakt/standort-raumvermietung']

try {
  for (const [w, h, tag] of [[1440, 900, '1440'], [390, 844, '390']]) {
    for (const route of ROUTES) {
      const context = await browser.newContext({ viewport: { width: w, height: h }, locale: 'de-CH', deviceScaleFactor: 1 })
      const page = await context.newPage()
      await page.addInitScript(`window.__cover = ${coverProbe.toString()}`)
      const resp = await page.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 20000 }).catch(() => null)
      if (!resp || resp.status() >= 400) { await context.close(); continue }
      await page.waitForTimeout(2300)
      // walk the page in viewport steps and look for a heading under the bar
      const worst = await page.evaluate(async () => {
        const sleep = ms => new Promise(r => setTimeout(r, ms))
        const probe = window.__cover
        let worst = null
        const H = document.body.scrollHeight
        for (let y = 0; y < H; y += Math.round(window.innerHeight * 0.7)) {
          window.scrollTo(0, y)
          await sleep(260)
          const c = probe()
          if (c.hit) for (const x of c.hit) if (!worst || x.overlap > worst.overlap) worst = { ...x, scrollY: y }
        }
        window.scrollTo(0, 0)
        return worst
      }).catch(e => ({ err: String(e).slice(0, 80) }))
      rec(`COVER_${tag} ${route} ` + JSON.stringify(worst))
      await context.close()
    }
  }
  fs.writeFileSync(path.join(OUT, '_log-sticky.json'), JSON.stringify(log, null, 2))
  rec('DONE')
} catch (e) {
  console.error('FAIL', e.stack || e); process.exitCode = 1
} finally { await browser.close() }
