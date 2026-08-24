import { chromium } from 'playwright-core'
import fs from 'node:fs'
import path from 'node:path'

const OUT = '/root/clients/salsaflow-w1/worklog/shots/CRITIC-0824-0151'
const BASE = 'http://127.0.0.1:5173'

const browser = await chromium.launch({
  executablePath: '/usr/bin/google-chrome', headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none']
})
const log = []
function rec(m) { log.push(m); console.log(m) }

// the red level pill: ink height, padding, and whether the glyphs fit the pill
const badgeProbe = () => {
  const out = []
  for (const e of document.querySelectorAll('main *')) {
    if (e.children.length) continue
    const t = (e.textContent || '').trim()
    if (!/^(Beginner|Intermediate|Advanced)\s+Stufe\s+\d+$/i.test(t)) continue
    const cs = getComputedStyle(e)
    const r = e.getBoundingClientRect()
    // real glyph box via Range, not the padded tap area
    const tn = [...e.childNodes].find(n => n.nodeType === 3 && n.textContent.trim())
    let ink = null
    if (tn) { const rg = document.createRange(); rg.selectNodeContents(tn); const rr = rg.getBoundingClientRect(); ink = { w: Math.round(rr.width), h: Math.round(rr.height), top: Math.round(rr.top), bottom: Math.round(rr.bottom) } }
    const p = e.parentElement, pcs = getComputedStyle(p), pr = p.getBoundingClientRect()
    out.push({
      t, fs: +parseFloat(cs.fontSize).toFixed(1), lineHeight: cs.lineHeight, weight: cs.weight || cs.fontWeight,
      color: cs.color, bg: cs.backgroundColor,
      box: { w: Math.round(r.width), h: Math.round(r.height) }, ink,
      padTop: ink ? Math.round(ink.top - r.top) : null,
      padBottom: ink ? Math.round(r.bottom - ink.bottom) : null,
      parent: { tag: p.tagName, bg: pcs.backgroundColor, radius: pcs.borderRadius, pad: pcs.padding, w: Math.round(pr.width), h: Math.round(pr.height) }
    })
  }
  // compare against the H3 course title next to it
  const h3 = [...document.querySelectorAll('main h3')].map(e => {
    const cs = getComputedStyle(e)
    return { t: (e.textContent || '').trim().slice(0, 20), fs: +parseFloat(cs.fontSize).toFixed(1) }
  }).slice(0, 6)
  return { badges: out.slice(0, 6), count: out.length, h3 }
}

try {
  for (const [w, h, tag] of [[1440, 900, '1440'], [390, 844, '390']]) {
    const context = await browser.newContext({ viewport: { width: w, height: h }, locale: 'de-CH', deviceScaleFactor: w === 1440 ? 3 : 3 })
    const page = await context.newPage()
    const cdp = await page.context().newCDPSession(page)
    await page.goto(BASE + '/tanzkurse', { waitUntil: 'domcontentloaded', timeout: 20000 })
    await page.waitForTimeout(2400)
    const y = await page.evaluate(() => {
      const el = [...document.querySelectorAll('main *')].find(e => !e.children.length && /Stufe\s+\d+$/.test((e.textContent || '').trim()))
      if (!el) return null
      const r = el.getBoundingClientRect()
      window.scrollTo(0, Math.max(0, r.top + window.scrollY - 300))
      return Math.round(r.top + window.scrollY)
    })
    await page.waitForTimeout(1600)
    rec(`BADGE_${tag} y=${y} ` + JSON.stringify(await page.evaluate(badgeProbe)))
    const { data } = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false })
    fs.writeFileSync(path.join(OUT, `tanzkurse-badge-${tag}.png`), Buffer.from(data, 'base64'))
    console.log(`SHOT tanzkurse-badge-${tag}.png`)
    await context.close()
  }
  fs.writeFileSync(path.join(OUT, '_log-badge.json'), JSON.stringify(log, null, 2))
  rec('DONE')
} catch (e) {
  console.error('FAIL', e.stack || e); process.exitCode = 1
} finally { await browser.close() }
