import { chromium } from 'playwright-core'
import fs from 'node:fs'
import path from 'node:path'

const OUT = '/root/clients/salsaflow-w1/worklog/shots/CRITIC-0824-0848'
const BASE = 'http://127.0.0.1:5173'

// R222 claims: word-spacing:0.2em on FooterHeading closes the FOLG UNS word gap.
// .type-h4 and content.ts untouched. Builder shots are his evidence, not mine.
// I measure the ACTUAL gap between FOLG and UNS in pixels and compare it to the
// letter-tracking (0.16em): the word space must read clearly WIDER than a letter
// gap, or the eye still merges it. Plus spot-check: raster 18/18 at two widths,
// ig header overlap at one width - did the footer edit break anything?
// Footer is DOM text here (not an iframe) so a route guard is safe - but embeds
// are not needed below the fold for these assertions; still NO guard, keep parity.
const CHECKS = [
  { route: '/', w: 1024, h: 1000, tag: 'home-1024' },
  { route: '/', w: 1440, h: 1000, tag: 'home-1440' },
  { route: '/fotos', w: 1440, h: 1000, tag: 'fotos-1440' },
  { route: '/fotos', w: 1024, h: 1000, tag: 'fotos-1024' },
]

fs.mkdirSync(OUT, { recursive: true })

const browser = await chromium.launch({
  executablePath: '/usr/bin/google-chrome', headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none']
})
const log = []
function rec(m) { log.push(m); console.log(m) }

try {
  for (const c of CHECKS) {
    const context = await browser.newContext({ viewport: { width: c.w, height: c.h }, locale: 'de-CH', deviceScaleFactor: 1 })
    const page = await context.newPage()
    await page.goto(BASE + c.route, { waitUntil: 'domcontentloaded', timeout: 25000 })
    await page.waitForTimeout(2500)
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight) {
        window.scrollTo(0, y); await new Promise(r => setTimeout(r, 240))
      }
    })
    await page.waitForTimeout(2000)

    // 1) FOLG UNS: measure the real gap. Range around each word inside the heading.
    const folg = await page.evaluate(() => {
      const hs = [...document.querySelectorAll('footer h3')]
      const h = hs.find(x => /FOLG/i.test(x.textContent || ''))
      if (!h) return { err: 'no heading' }
      const cs = getComputedStyle(h)
      const text = h.firstChild && h.firstChild.nodeType === 3 ? h.firstChild : null
      if (!text) return { err: 'no text node', txt: h.textContent }
      const full = h.textContent || ''
      const r1 = document.createRange(); r1.setStart(text, 0); r1.setEnd(text, 4)          // FOLG
      const r2 = document.createRange(); r2.setStart(text, 5); r2.setEnd(text, 8)          // UNS
      const a = r1.getBoundingClientRect(), b = r2.getBoundingClientRect()
      const hRect = h.getBoundingClientRect()
      return {
        txt: full,
        wordSpacing: cs.wordSpacing, letterSpacing: cs.letterSpacing, textTransform: cs.textTransform,
        fontSize: cs.fontSize,
        folgR: Math.round(a.right), unsL: Math.round(b.left),
        gapPx: Math.round(b.left - a.right),
        // letter gap for scale: measure 'F'..'O' inside FOLG
        letterGapPx: (() => {
          const r3 = document.createRange(); r3.setStart(text, 0); r3.setEnd(text, 1)
          const r4 = document.createRange(); r4.setStart(text, 1); r4.setEnd(text, 2)
          return Math.round(r4.getBoundingClientRect().left - r3.getBoundingClientRect().right)
        })(),
        headingW: Math.round(hRect.width),
        err: null
      }
    })
    rec(`${c.route} ${c.w} FOLG ` + JSON.stringify(folg))

    // 2) raster spot-check (07:09 must not regress): mode/tracks/rows at this width
    const raster = await page.evaluate(() => {
      const unit = document.querySelector('[data-design-unit="home.instagram-showcase"], [data-design-unit="photos.instagram-showcase"]')
      if (!unit) return { err: 'no unit' }
      const grid = unit.querySelector('.snap-x') || unit.querySelector('[class*="grid"]')
      if (!grid) return { err: 'no grid' }
      const gcs = getComputedStyle(grid)
      const isGrid = gcs.display.includes('grid')
      const cards = [...grid.children].filter(x => x.querySelector('iframe')).map(x => {
        const r = x.getBoundingClientRect(); return { top: Math.round(r.top), right: Math.round(r.right), w: Math.round(r.width) }
      })
      const rows = []
      for (const card of cards) {
        const row = rows.find(r => Math.abs(r.top - card.top) < 4)
        if (row) row.cards.push(card); else rows.push({ top: card.top, cards: [card] })
      }
      const gr = grid.getBoundingClientRect()
      const tracks = isGrid ? gcs.gridTemplateColumns.split(' ').filter(Boolean).length : 0
      const lastN = rows.at(-1)?.cards.length || 0
      const deadRight = rows.length ? Math.round(gr.right - Math.max(...rows.at(-1).cards.map(x => x.right))) : null
      const iframeW = [...document.querySelectorAll('iframe')].filter(f => /instagram/i.test(f.src || '')).map(f => Math.round(f.getBoundingClientRect().width))
      return { mode: isGrid ? 'grid' : 'slider', tracks, rows: rows.map(r => r.cards.length), emptyTrack: isGrid ? tracks - lastN : null, deadRight, iframeW }
    })
    rec(`${c.route} ${c.w} RASTER ` + JSON.stringify(raster))

    // 3) ig header overlap spot-check (06:07 must not regress) - first iframe only
    let overlap = null
    for (const fr of page.frames()) {
      if (!/instagram/i.test(fr.url())) continue
      const got = await fr.evaluate(() => {
        const out = { texts: [], overlaps: [] }
        const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
        let n
        while ((n = walk.nextNode())) {
          const t = n.textContent.trim(); if (!t) continue
          const rg = document.createRange(); rg.selectNodeContents(n)
          const r = rg.getBoundingClientRect()
          if (r.height === 0 || r.top > 90) continue
          out.texts.push({ t: t.slice(0, 20), top: Math.round(r.top), bottom: Math.round(r.bottom), left: Math.round(r.left), right: Math.round(r.right) })
        }
        for (let i = 0; i < out.texts.length; i++) for (let j = i + 1; j < out.texts.length; j++) {
          const a = out.texts[i], b = out.texts[j]
          const oy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top)
          const ox = Math.min(a.right, b.right) - Math.max(a.left, b.left)
          if (oy > 2 && ox > 2) out.overlaps.push(Math.round(ox))
        }
        return out
      }).catch(e => ({ err: String(e).slice(0, 40) }))
      overlap = Math.max(0, ...(got.overlaps || [0]))
      break
    }
    rec(`${c.route} ${c.w} IG-OVERLAP ${overlap}`)

    // 4) footer shot: scroll footer into view, capture viewport
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(1600)
    const cdp = await page.context().newCDPSession(page)
    const { data } = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false })
    fs.writeFileSync(path.join(OUT, `footer-${c.tag}.png`), Buffer.from(data, 'base64'))

    await context.close()
  }
  fs.writeFileSync(path.join(OUT, '_log-footer.json'), JSON.stringify(log, null, 2))
  rec('DONE')
} catch (e) {
  console.error('FAIL', e.stack || e); process.exitCode = 1
} finally { await browser.close() }
