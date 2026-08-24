import { chromium } from 'playwright-core'
import fs from 'node:fs'
import path from 'node:path'

const OUT = '/root/clients/salsaflow-w1/worklog/shots/CRITIC-0824-0848'
const BASE = 'http://127.0.0.1:5173'

// NEW GAP HUNT - own territory, not the done list. FOLG UNS holds, raster holds,
// ig header holds. Now I look at what I have NOT judged in 14 passes: the home
// page as a whole composition on desktop. Full scroll, viewport shots per
// section, 1440. Then the same at 390 to see the mobile pairing. I am looking
// for the single biggest visual break - the thing a first-time visitor sees
// before they read a word. NOT in the done list: hero composition, section
// rhythm, empty bands, image load, contrast of type on image.
const RUNS = [
  { w: 1440, h: 1000, tag: 'd1440' },
  { w: 390, h: 844, tag: 'm390' },
]

fs.mkdirSync(OUT, { recursive: true })

const browser = await chromium.launch({
  executablePath: '/usr/bin/google-chrome', headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none']
})
const log = []
function rec(m) { log.push(m); console.log(m) }

try {
  for (const run of RUNS) {
    const context = await browser.newContext({ viewport: { width: run.w, height: run.h }, locale: 'de-CH', deviceScaleFactor: 1 })
    const page = await context.newPage()
    const cdp = await page.context().newCDPSession(page)
    await page.goto(BASE + '/', { waitUntil: 'domcontentloaded', timeout: 25000 })
    await page.waitForTimeout(2800)

    // scroll sweep to trigger lazy load + reveals
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight) {
        window.scrollTo(0, y); await new Promise(r => setTimeout(r, 240))
      }
    })
    await page.waitForTimeout(2000)

    // structural read: every top-level section with its height and fill ratio
    const sections = await page.evaluate(() => {
      const mains = document.querySelectorAll('main section, [data-design-unit]')
      const out = []
      const seen = new Set()
      for (const s of mains) {
        const r = s.getBoundingClientRect()
        if (r.height < 40) continue
        const key = Math.round(r.top) + ':' + Math.round(r.height)
        if (seen.has(key)) continue
        seen.add(key)
        // how much of this section is actually painted (non-empty area)?
        const kids = [...s.querySelectorAll('*')].filter(el => {
          const kr = el.getBoundingClientRect()
          return kr.width > 4 && kr.height > 4
        })
        // empty band detection: big vertical gaps between consecutive children
        out.push({
          unit: s.getAttribute('data-design-unit') || (s.className || '').toString().slice(0, 40),
          top: Math.round(r.top + window.scrollY),
          h: Math.round(r.height),
          w: Math.round(r.width),
        })
      }
      return { docH: document.body.scrollHeight, viewH: window.innerHeight, sections: out }
    })
    rec(`${run.tag} STRUCT ` + JSON.stringify(sections))

    // viewport shots: capture the hero + every ~viewport down the page
    const total = sections.docH
    const step = run.h
    const shots = Math.min(Math.ceil(total / step), 9)
    for (let i = 0; i < shots; i++) {
      const y = i * step
      await page.evaluate(yy => window.scrollTo(0, yy), y)
      await page.waitForTimeout(1400)
      const { data } = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false })
      fs.writeFileSync(path.join(OUT, `home-${run.tag}-s${i}.png`), Buffer.from(data, 'base64'))
    }
    rec(`${run.tag} SHOTS ${shots} of docH ${total}`)
    await context.close()
  }
  fs.writeFileSync(path.join(OUT, '_log-home.json'), JSON.stringify(log, null, 2))
  rec('DONE')
} catch (e) {
  console.error('FAIL', e.stack || e); process.exitCode = 1
} finally { await browser.close() }
