import { chromium } from 'playwright-core'
import fs from 'node:fs'
import path from 'node:path'

const OUT = '/root/clients/salsaflow-w1/worklog/shots/CRITIC-0824-0607'
const BASE = 'http://127.0.0.1:5173'

// The header is fixed, but at 1440 the grid now shows 2 cards on top and one
// orphan below, with dead space to the right. Measure the row structure:
// how many cards per row, how much empty grid track is left, and do the cards
// in one row share a height? The code comment at InstagramShowcase.tsx:216
// calls exactly this an earlier defect ("Waisen-Karte" / empty column).
const WIDTHS = [768, 900, 1024, 1180, 1280, 1440, 1600, 1920]

const browser = await chromium.launch({
  executablePath: '/usr/bin/google-chrome', headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none']
})
const log = []
function rec(m) { log.push(m); console.log(m) }

try {
  for (const route of ['/', '/fotos']) {
    for (const w of WIDTHS) {
      const context = await browser.newContext({ viewport: { width: w, height: 1000 }, locale: 'de-CH', deviceScaleFactor: 1 })
      const page = await context.newPage()
      await page.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 25000 })
      await page.waitForTimeout(2500)
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight) {
          window.scrollTo(0, y); await new Promise(r => setTimeout(r, 260))
        }
      })
      await page.waitForTimeout(3000)

      const res = await page.evaluate(() => {
        const unit = document.querySelector('[data-design-unit="home.instagram-showcase"], [data-design-unit="photos.instagram-showcase"]')
        if (!unit) return { err: 'no unit' }
        const grid = unit.querySelector('.snap-x')
        if (!grid) return { err: 'no grid' }
        const gcs = getComputedStyle(grid)
        const cards = [...grid.children].map(c => {
          const r = c.getBoundingClientRect()
          return { top: Math.round(r.top), bottom: Math.round(r.bottom), left: Math.round(r.left), right: Math.round(r.right), w: Math.round(r.width), h: Math.round(r.height) }
        })
        // group by row (same top within 4px)
        const rows = []
        for (const c of cards) {
          const row = rows.find(r => Math.abs(r.top - c.top) < 4)
          if (row) row.cards.push(c); else rows.push({ top: c.top, cards: [c] })
        }
        const gr = grid.getBoundingClientRect()
        const tracks = gcs.gridTemplateColumns.split(' ').filter(Boolean)
        // in a row: do all cards share a height? and how far is the row's right
        // edge from the grid's right edge = visible dead space
        const rowInfo = rows.map(r => {
          const hs = r.cards.map(c => c.h)
          const rightMost = Math.max(...r.cards.map(c => c.right))
          return {
            n: r.cards.length,
            heights: hs,
            heightSpread: Math.max(...hs) - Math.min(...hs),
            deadRightPx: Math.round(gr.right - rightMost)
          }
        })
        return {
          display: gcs.display,
          tracks: tracks.length, trackList: gcs.gridTemplateColumns.slice(0, 80),
          gridW: Math.round(gr.width),
          nCards: cards.length,
          rows: rowInfo,
          // an empty grid track = a column reserved but unused in the last row
          emptyTrackInLastRow: tracks.length > 0 ? tracks.length - (rowInfo.at(-1)?.n || 0) : null
        }
      })
      rec(`${route} ${w} ` + JSON.stringify(res))
      await context.close()
    }
  }
  fs.writeFileSync(path.join(OUT, '_log-igrow.json'), JSON.stringify(log, null, 2))
  rec('DONE')
} catch (e) {
  console.error('FAIL', e.stack || e); process.exitCode = 1
} finally { await browser.close() }
