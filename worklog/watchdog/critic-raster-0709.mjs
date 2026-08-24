import { chromium } from 'playwright-core'
import fs from 'node:fs'
import path from 'node:path'

const OUT = '/root/clients/salsaflow-w1/worklog/shots/CRITIC-0824-0709'
const BASE = 'http://127.0.0.1:5173'

// R221 claims: no orphan card and no single-column stack on 1024-1920, the 360px
// iframe from R220 is kept, slider below 1150 / grid from 1150 up, zero dead
// space at 1150. Builder shots (ig-fotos-{1024,1140,1150,1440}.png) are his
// evidence, not mine. I sweep every claimed breakpoint on BOTH routes and check
// the iframe header (overlap must stay 0) at the same time - a grid fix that
// shrinks cards below 360px would reopen the R220 defect.
// NO route guard: embeds must load for real.
const WIDTHS = [900, 1024, 1140, 1150, 1180, 1280, 1440, 1600, 1920]

fs.mkdirSync(OUT, { recursive: true })

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
      await page.waitForTimeout(3500)

      // outer geometry: mode (grid vs slider), tracks, rows, dead space, iframe sizes
      const geo = await page.evaluate(() => {
        const unit = document.querySelector('[data-design-unit="home.instagram-showcase"], [data-design-unit="photos.instagram-showcase"]')
        if (!unit) return { err: 'no unit' }
        const grid = unit.querySelector('.snap-x') || unit.querySelector('[class*="grid"]')
        if (!grid) return { err: 'no grid' }
        const gcs = getComputedStyle(grid)
        const isGrid = gcs.display.includes('grid')
        const cards = [...grid.children].filter(c => c.querySelector('iframe') || c.tagName !== 'STYLE').map(c => {
          const r = c.getBoundingClientRect()
          return { top: Math.round(r.top), left: Math.round(r.left), right: Math.round(r.right), w: Math.round(r.width), h: Math.round(r.height) }
        })
        const rows = []
        for (const c of cards) {
          const row = rows.find(r => Math.abs(r.top - c.top) < 4)
          if (row) row.cards.push(c); else rows.push({ top: c.top, cards: [c] })
        }
        const gr = grid.getBoundingClientRect()
        const tracks = isGrid ? gcs.gridTemplateColumns.split(' ').filter(Boolean) : []
        const rowInfo = rows.map(r => {
          const hs = r.cards.map(c => c.h)
          const rightMost = Math.max(...r.cards.map(c => c.right))
          return { n: r.cards.length, h: hs, hSpread: Math.max(...hs) - Math.min(...hs), deadRight: Math.round(gr.right - rightMost) }
        })
        const iframes = [...document.querySelectorAll('iframe')].filter(f => /instagram/i.test(f.src || '')).map(f => {
          const r = f.getBoundingClientRect(); return { w: Math.round(r.width), h: Math.round(r.height) }
        })
        return {
          mode: isGrid ? 'grid' : 'slider',
          display: gcs.display, overflowX: gcs.overflowX,
          tracks: tracks.length, trackList: gcs.gridTemplateColumns.slice(0, 90),
          nCards: cards.length, rows: rowInfo,
          emptyTrack: isGrid && tracks.length > 0 ? tracks.length - (rowInfo.at(-1)?.n || 0) : null,
          iframeW: iframes.map(i => i.w),
          slider: { scrollLeft: Math.round(grid.scrollLeft), clientW: Math.round(grid.clientWidth), scrollW: Math.round(grid.scrollWidth) },
          docOverflowX: Math.round(document.documentElement.scrollWidth - window.innerWidth)
        }
      })

      // inner truth: instagram header must not collide (R220 defect reopened?)
      const inner = []
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
            out.texts.push({ t: t.slice(0, 24), top: Math.round(r.top), bottom: Math.round(r.bottom), left: Math.round(r.left), right: Math.round(r.right) })
          }
          for (let i = 0; i < out.texts.length; i++) for (let j = i + 1; j < out.texts.length; j++) {
            const a = out.texts[i], b = out.texts[j]
            const oy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top)
            const ox = Math.min(a.right, b.right) - Math.max(a.left, b.left)
            if (oy > 2 && ox > 2) out.overlaps.push({ a: a.t, b: b.t, ox: Math.round(ox) })
          }
          out.bodyW = document.documentElement.scrollWidth
          out.viewW = window.innerWidth
          return out
        }).catch(e => ({ err: String(e).slice(0, 50) }))
        inner.push({ worstOx: Math.max(0, ...(got.overlaps || []).map(o => o.ox)), overflow: got.bodyW > got.viewW ? got.bodyW - got.viewW : 0, err: got.err })
      }
      const worst = Math.max(0, ...inner.map(i => i.worstOx || 0))
      const hcut = Math.max(0, ...inner.map(i => i.overflow || 0))

      rec(`${route} ${w} mode=${geo.mode} tracks=${geo.tracks} rows=${JSON.stringify((geo.rows || []).map(r => r.n + '@h' + r.h + '/dR' + r.deadRight))} emptyTrack=${geo.emptyTrack} iframeW=${JSON.stringify(geo.iframeW)} docOverflowX=${geo.docOverflowX} slider=${JSON.stringify(geo.slider)} overlap=${worst} headerCut=${hcut}${geo.err ? ' ERR=' + geo.err : ''}`)

      if ([1024, 1150, 1440].includes(w)) {
        const y = await page.evaluate(() => {
          const f = [...document.querySelectorAll('iframe')].find(x => /instagram/i.test(x.src || ''))
          return f ? Math.round(f.getBoundingClientRect().top + window.scrollY) : null
        })
        if (y != null) {
          await page.evaluate(yy => window.scrollTo(0, Math.max(0, yy - 120)), y)
          await page.waitForTimeout(1500)
          const cdp = await page.context().newCDPSession(page)
          const { data } = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false })
          fs.writeFileSync(path.join(OUT, `raster-${route.replace(/\W/g, '') || 'home'}-${w}.png`), Buffer.from(data, 'base64'))
        }
      }
      await context.close()
    }
  }
  fs.writeFileSync(path.join(OUT, '_log-raster.json'), JSON.stringify(log, null, 2))
  rec('DONE')
} catch (e) {
  console.error('FAIL', e.stack || e); process.exitCode = 1
} finally { await browser.close() }
