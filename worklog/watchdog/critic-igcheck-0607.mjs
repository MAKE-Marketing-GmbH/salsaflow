import { chromium } from 'playwright-core'
import fs from 'node:fs'
import path from 'node:path'

const OUT = '/root/clients/salsaflow-w1/worklog/shots/CRITIC-0824-0607'
const BASE = 'http://127.0.0.1:5173'

// R220 claims: every width from 375 up is at or above the 360px iframe threshold,
// on home AND /fotos. auto-fill can flip between breakpoints, so sweep many widths
// instead of only 1440/390. 320 is explicitly out of scope per the claim, but I
// measure it anyway to see HOW it fails.
// NO route guard: the embeds must load for real (a guard would measure my own blocker).
const WIDTHS = [320, 360, 375, 390, 414, 640, 768, 900, 1024, 1180, 1280, 1440, 1600]

const browser = await chromium.launch({
  executablePath: '/usr/bin/google-chrome', headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none']
})
const log = []
function rec(m) { log.push(m); console.log(m) }

try {
  for (const route of ['/', '/fotos']) {
    for (const w of WIDTHS) {
      const context = await browser.newContext({ viewport: { width: w, height: 900 }, locale: 'de-CH', deviceScaleFactor: 1 })
      const page = await context.newPage()
      await page.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 25000 })
      await page.waitForTimeout(2500)
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight) {
          window.scrollTo(0, y); await new Promise(r => setTimeout(r, 260))
        }
      })
      await page.waitForTimeout(3500)

      // outer geometry: iframe width, and is the card clipped by its scroll box?
      const geo = await page.evaluate(() => {
        const out = { frames: [], docOverflowX: Math.round(document.documentElement.scrollWidth - window.innerWidth), slider: null }
        for (const f of document.querySelectorAll('iframe')) {
          if (!/instagram/i.test(f.src || '')) continue
          const r = f.getBoundingClientRect()
          // walk up to the nearest scroll container / clipping ancestor
          let el = f.parentElement, clipW = null, clipper = null
          while (el && el !== document.body) {
            const cs = getComputedStyle(el)
            if (cs.overflowX !== 'visible') { const cr = el.getBoundingClientRect(); clipW = Math.round(cr.width); clipper = (el.className || '').toString().slice(0, 30); break }
            el = el.parentElement
          }
          out.frames.push({ w: Math.round(r.width), h: Math.round(r.height), left: Math.round(r.left), right: Math.round(r.right), clipW, clipper })
        }
        const sl = document.querySelector('[data-design-unit="home.instagram-showcase"] .snap-x, [data-design-unit="photos.instagram-showcase"] .snap-x')
        if (sl) out.slider = { scrollLeft: Math.round(sl.scrollLeft), clientW: Math.round(sl.clientWidth), scrollW: Math.round(sl.scrollWidth) }
        return out
      })

      // inner truth: does the embed header still collide / overflow?
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
          // header running out of the iframe = the 390 symptom from pass 04:57
          out.bodyW = document.documentElement.scrollWidth
          out.viewW = window.innerWidth
          out.headerCutRight = Math.max(0, ...out.texts.map(t => t.right - window.innerWidth))
          return out
        }).catch(e => ({ err: String(e).slice(0, 50) }))
        inner.push({
          bodyW: got.bodyW, viewW: got.viewW,
          overflow: got.bodyW > got.viewW ? got.bodyW - got.viewW : 0,
          cutRight: got.headerCutRight, nOverlap: (got.overlaps || []).length,
          worstOx: Math.max(0, ...(got.overlaps || []).map(o => o.ox)), err: got.err
        })
      }
      const worst = Math.max(0, ...inner.map(i => i.worstOx || 0))
      const cut = Math.max(0, ...inner.map(i => i.overflow || 0))
      rec(`${route} ${w} iframe=${JSON.stringify(geo.frames.map(f => f.w))} clipW=${JSON.stringify(geo.frames.map(f => f.clipW))} docOverflowX=${geo.docOverflowX} slider=${JSON.stringify(geo.slider)} worstOverlap=${worst} headerOverflow=${cut} inner=${JSON.stringify(inner)}`)

      // shoot the widths that matter for the verdict
      if ([320, 375, 390, 768, 1024, 1440].includes(w)) {
        const y = await page.evaluate(() => {
          const f = [...document.querySelectorAll('iframe')].find(x => /instagram/i.test(x.src || ''))
          return f ? Math.round(f.getBoundingClientRect().top + window.scrollY) : null
        })
        if (y != null) {
          await page.evaluate(yy => window.scrollTo(0, Math.max(0, yy - 120)), y)
          await page.waitForTimeout(1500)
          const cdp = await page.context().newCDPSession(page)
          const { data } = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false })
          fs.writeFileSync(path.join(OUT, `ig-${route.replace(/\W/g, '') || 'home'}-${w}.png`), Buffer.from(data, 'base64'))
        }
      }
      await context.close()
    }
  }
  fs.writeFileSync(path.join(OUT, '_log-igcheck.json'), JSON.stringify(log, null, 2))
  rec('DONE')
} catch (e) {
  console.error('FAIL', e.stack || e); process.exitCode = 1
} finally { await browser.close() }
