import { chromium } from 'playwright-core'
import fs from 'node:fs'
import path from 'node:path'

const OUT = '/root/clients/salsaflow-w1/worklog/shots/CRITIC-0824-0457'
const BASE = 'http://127.0.0.1:5173'

// no route guard - the embeds must load for real
const browser = await chromium.launch({
  executablePath: '/usr/bin/google-chrome', headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none']
})
const log = []
function rec(m) { log.push(m); console.log(m) }

// the embed is a cross-origin iframe: measure the CARD it sits in, from our side
const cardState = () => {
  const frames = [...document.querySelectorAll('iframe')]
    .map(f => ({ f, r: f.getBoundingClientRect() }))
    .filter(o => o.r.width > 100 && o.r.height > 100 && /instagram/i.test(o.f.src || ''))
  return frames.map(o => {
    const cs = getComputedStyle(o.f)
    // the visual card = nearest ancestor with its own background/rounding
    let card = o.f.parentElement, depth = 0
    while (card && depth < 4 && getComputedStyle(card).backgroundColor === 'rgba(0, 0, 0, 0)') { card = card.parentElement; depth++ }
    const cr = card ? card.getBoundingClientRect() : null
    return {
      src: (o.f.src || '').slice(0, 70),
      iframe: { w: Math.round(o.r.width), h: Math.round(o.r.height) },
      declaredW: o.f.getAttribute('width'), declaredH: o.f.getAttribute('height'),
      scrolling: o.f.getAttribute('scrolling'), overflow: cs.overflow,
      card: cr ? { w: Math.round(cr.width), h: Math.round(cr.height), cls: (card.className || '').toString().slice(0, 40) } : null,
      // is the iframe TALLER than the box that shows it? then content is cut
      cutBottomPx: cr ? Math.round(o.r.bottom - cr.bottom) : null,
      cutRightPx: cr ? Math.round(o.r.right - cr.right) : null
    }
  })
}

try {
  for (const [w, h, tag] of [[1440, 900, '1440'], [390, 844, '390']]) {
    const context = await browser.newContext({ viewport: { width: w, height: h }, locale: 'de-CH', deviceScaleFactor: 2 })
    const page = await context.newPage()
    await page.addInitScript(`window.__cards = ${cardState.toString()}`)
    const cdp = await page.context().newCDPSession(page)
    await page.goto(BASE + '/', { waitUntil: 'domcontentloaded', timeout: 25000 })
    await page.waitForTimeout(2500)
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight) {
        window.scrollTo(0, y); await new Promise(r => setTimeout(r, 300))
      }
    })
    await page.waitForTimeout(3500)
    rec(`CARDS_${tag} ` + JSON.stringify(await page.evaluate(() => window.__cards())))

    // read the header line INSIDE the embed (same-origin is denied, so use the frame API)
    const inner = []
    for (const fr of page.frames()) {
      if (!/instagram/i.test(fr.url())) continue
      const got = await fr.evaluate(() => {
        const pick = s => { const e = document.querySelector(s); return e ? (e.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 40) : null }
        const out = { url: location.pathname.slice(0, 30), texts: [] }
        // every visible text node in the top 90px of the embed = the header strip
        const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
        let n
        while ((n = walk.nextNode())) {
          const t = n.textContent.trim(); if (!t) continue
          const rg = document.createRange(); rg.selectNodeContents(n)
          const r = rg.getBoundingClientRect()
          if (r.height === 0 || r.top > 90) continue
          out.texts.push({ t: t.slice(0, 30), top: Math.round(r.top), bottom: Math.round(r.bottom), left: Math.round(r.left), right: Math.round(r.right) })
        }
        // do any two header lines overlap vertically?
        out.overlaps = []
        for (let i = 0; i < out.texts.length; i++) for (let j = i + 1; j < out.texts.length; j++) {
          const a = out.texts[i], b = out.texts[j]
          const oy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top)
          const ox = Math.min(a.right, b.right) - Math.max(a.left, b.left)
          if (oy > 2 && ox > 2) out.overlaps.push({ a: a.t, b: b.t, oy: Math.round(oy), ox: Math.round(ox) })
        }
        out.bodyW = document.documentElement.scrollWidth
        out.viewW = window.innerWidth
        return out
      }).catch(e => ({ err: String(e).slice(0, 60) }))
      inner.push(got)
    }
    rec(`INNER_${tag} ` + JSON.stringify(inner))

    // zoomed shot of the embed strip
    const y = await page.evaluate(() => {
      const f = [...document.querySelectorAll('iframe')].find(x => /instagram/i.test(x.src || ''))
      return f ? Math.round(f.getBoundingClientRect().top + window.scrollY) : null
    })
    if (y != null) {
      await page.evaluate(yy => window.scrollTo(0, Math.max(0, yy - 150)), y)
      await page.waitForTimeout(1600)
      const { data } = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false })
      fs.writeFileSync(path.join(OUT, `ig-${tag}.png`), Buffer.from(data, 'base64'))
    }
    await context.close()
  }
  fs.writeFileSync(path.join(OUT, '_log-ig.json'), JSON.stringify(log, null, 2))
  rec('DONE')
} catch (e) {
  console.error('FAIL', e.stack || e); process.exitCode = 1
} finally { await browser.close() }
