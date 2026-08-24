import { chromium } from 'playwright-core'
import fs from 'node:fs'
import path from 'node:path'

const OUT = '/root/clients/salsaflow-w1/worklog/shots/CRITIC-0824-0457'
const BASE = 'http://127.0.0.1:5173'

// Counter-test: /fotos uses the SAME component without compact (aspect-[9/16],
// grid-cols-2 lg:grid-cols-3 over the full shell). If the header reads fine
// there, the defect is the narrow 1.28fr column on home - not the embed itself.
// No route guard: the embeds must load for real.
const browser = await chromium.launch({
  executablePath: '/usr/bin/google-chrome', headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none']
})
const log = []
function rec(m) { log.push(m); console.log(m) }

try {
  for (const route of ['/fotos', '/']) {
    for (const [w, h, tag] of [[1440, 900, '1440'], [390, 844, '390']]) {
      const context = await browser.newContext({ viewport: { width: w, height: h }, locale: 'de-CH', deviceScaleFactor: 2 })
      const page = await context.newPage()
      const cdp = await page.context().newCDPSession(page)
      await page.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 25000 })
      await page.waitForTimeout(2500)
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight) {
          window.scrollTo(0, y); await new Promise(r => setTimeout(r, 300))
        }
      })
      await page.waitForTimeout(3500)

      const sizes = await page.evaluate(() => [...document.querySelectorAll('iframe')]
        .filter(f => /instagram/i.test(f.src || ''))
        .map(f => { const r = f.getBoundingClientRect(); return { w: Math.round(r.width), h: Math.round(r.height) } }))
      rec(`SIZE ${route} ${tag} ` + JSON.stringify(sizes))

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
            out.texts.push({ t: t.slice(0, 26), top: Math.round(r.top), bottom: Math.round(r.bottom), left: Math.round(r.left), right: Math.round(r.right) })
          }
          for (let i = 0; i < out.texts.length; i++) for (let j = i + 1; j < out.texts.length; j++) {
            const a = out.texts[i], b = out.texts[j]
            const oy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top)
            const ox = Math.min(a.right, b.right) - Math.max(a.left, b.left)
            if (oy > 2 && ox > 2) out.overlaps.push({ a: a.t, b: b.t, oy: Math.round(oy), ox: Math.round(ox) })
          }
          out.bodyW = document.documentElement.scrollWidth
          out.viewW = window.innerWidth
          return out
        }).catch(e => ({ err: String(e).slice(0, 50) }))
        inner.push({ bodyW: got.bodyW, viewW: got.viewW, overlaps: got.overlaps, texts: (got.texts || []).map(t => t.t) })
      }
      rec(`INNER ${route} ${tag} ` + JSON.stringify(inner))

      const y = await page.evaluate(() => {
        const f = [...document.querySelectorAll('iframe')].find(x => /instagram/i.test(x.src || ''))
        return f ? Math.round(f.getBoundingClientRect().top + window.scrollY) : null
      })
      if (y != null) {
        await page.evaluate(yy => window.scrollTo(0, Math.max(0, yy - 130)), y)
        await page.waitForTimeout(1600)
        const { data } = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false })
        fs.writeFileSync(path.join(OUT, `igwide-${route.replace(/\W/g, '') || 'home'}-${tag}.png`), Buffer.from(data, 'base64'))
      }
      await context.close()
    }
  }
  fs.writeFileSync(path.join(OUT, '_log-igwide.json'), JSON.stringify(log, null, 2))
  rec('DONE')
} catch (e) {
  console.error('FAIL', e.stack || e); process.exitCode = 1
} finally { await browser.close() }
