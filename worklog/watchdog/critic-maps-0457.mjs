import { chromium } from 'playwright-core'
import fs from 'node:fs'
import path from 'node:path'

const OUT = '/root/clients/salsaflow-w1/worklog/shots/CRITIC-0824-0457'
const BASE = 'http://127.0.0.1:5173'

// NO route guard here: the previous run blocked third-party requests itself,
// so a "map is broken" verdict would have measured my own blocker.
// Read-only GET traffic to google/instagram is fine; nothing is submitted.
const browser = await chromium.launch({
  executablePath: '/usr/bin/google-chrome', headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none']
})
const log = []
function rec(m) { log.push(m); console.log(m) }

// does the map/embed area actually paint something, or is it an empty hole?
const embedState = () => {
  const out = []
  const sel = 'gmp-place-details-compact, gmp-map, iframe, blockquote.instagram-media, [class*=map i], [id*=map i]'
  for (const el of document.querySelectorAll(sel)) {
    const r = el.getBoundingClientRect()
    if (r.width < 30 || r.height < 30) continue
    const cs = getComputedStyle(el)
    out.push({
      tag: el.tagName.toLowerCase(),
      cls: (el.className || '').toString().slice(0, 36),
      w: Math.round(r.width), h: Math.round(r.height),
      absTop: Math.round(r.top + window.scrollY),
      bg: cs.backgroundColor,
      kids: el.children.length,
      shadowKids: el.shadowRoot ? el.shadowRoot.children.length : null,
      txt: (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40),
      src: (el.getAttribute('src') || '').slice(0, 56)
    })
  }
  return out
}

try {
  for (const [w, h, tag] of [[1440, 900, '1440'], [390, 844, '390']]) {
    const context = await browser.newContext({ viewport: { width: w, height: h }, locale: 'de-CH', deviceScaleFactor: 1 })
    const page = await context.newPage()
    await page.addInitScript(`window.__emb = ${embedState.toString()}`)
    const cdp = await page.context().newCDPSession(page)
    const errs = [], failed = []
    page.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 100)) })
    page.on('requestfailed', r => failed.push(`${r.failure()?.errorText || '?'} ${r.url().slice(0, 62)}`))

    await page.goto(BASE + '/', { waitUntil: 'domcontentloaded', timeout: 25000 })
    await page.waitForTimeout(2500)
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight) {
        window.scrollTo(0, y); await new Promise(r => setTimeout(r, 300))
      }
    })
    await page.waitForTimeout(3000)
    const emb = await page.evaluate(() => window.__emb())
    rec(`EMB_${tag} ` + JSON.stringify(emb))
    rec(`ERRS_${tag} ` + JSON.stringify(errs.slice(0, 5)))
    rec(`FAILED_${tag} ` + JSON.stringify(failed.slice(0, 8)))

    // shoot each embed region where it sits
    for (const e of emb) {
      if (!/gmp|instagram|iframe/.test(e.tag + e.cls + e.src)) continue
      await page.evaluate(y => window.scrollTo(0, Math.max(0, y - 120)), e.absTop)
      await page.waitForTimeout(1500)
      const { data } = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false })
      fs.writeFileSync(path.join(OUT, `embed-${tag}-${e.tag.replace(/[^a-z]/g, '')}-${e.absTop}.png`), Buffer.from(data, 'base64'))
    }
    await context.close()
  }
  fs.writeFileSync(path.join(OUT, '_log-maps.json'), JSON.stringify(log, null, 2))
  rec('DONE')
} catch (e) {
  console.error('FAIL', e.stack || e); process.exitCode = 1
} finally { await browser.close() }
