import { chromium } from 'playwright-core'
import fs from 'node:fs'
import path from 'node:path'

const OUT = '/root/clients/salsaflow-w1/worklog/shots/CRITIC-0824-0457'
const BASE = 'http://127.0.0.1:5173'

const browser = await chromium.launch({
  executablePath: '/usr/bin/google-chrome', headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none']
})
const log = []
function rec(m) { log.push(m); console.log(m) }

// after the click: is the alert (and the marked field) actually on screen,
// and does the floating WhatsApp button cover any of it?
const vis = () => {
  const alert = document.getElementById('inquiry-error') || document.querySelector('main [role=alert]')
  const vh = window.innerHeight, vw = window.innerWidth
  const box = alert?.getBoundingClientRect()
  const marked = [...document.querySelectorAll('main input:not([type=hidden])')]
    .filter(x => /173,\s*24,\s*39/.test(getComputedStyle(x).borderColor) && parseFloat(getComputedStyle(x).borderWidth) >= 1.5)
    .map(x => {
      const r = x.getBoundingClientRect()
      return { label: (x.labels?.[0]?.textContent || x.type).trim().slice(0, 18), top: Math.round(r.top), bottom: Math.round(r.bottom), inView: r.top >= 0 && r.bottom <= vh }
    })
  // any fixed/sticky overlay sitting on top of the alert?
  let covering = []
  if (box) {
    for (const el of document.querySelectorAll('body *')) {
      const cs = getComputedStyle(el)
      if (cs.position !== 'fixed' && cs.position !== 'sticky') continue
      if (cs.visibility === 'hidden' || cs.opacity === '0' || cs.display === 'none') continue
      const r = el.getBoundingClientRect()
      if (r.width < 8 || r.height < 8) continue
      const ox = Math.min(r.right, box.right) - Math.max(r.left, box.left)
      const oy = Math.min(r.bottom, box.bottom) - Math.max(r.top, box.top)
      if (ox > 2 && oy > 2) covering.push({
        tag: el.tagName, cls: (el.className || '').toString().slice(0, 40),
        overlapPx: Math.round(ox) + 'x' + Math.round(oy), z: cs.zIndex,
        txt: (el.textContent || '').trim().slice(0, 24)
      })
    }
    // what is painted at the alert's centre / right edge?
    var hit = [
      { at: 'centre', el: document.elementFromPoint(Math.round(box.left + box.width / 2), Math.round(box.top + box.height / 2)) },
      { at: 'rightEdge', el: document.elementFromPoint(Math.round(box.right - 6), Math.round(box.bottom - 6)) }
    ].map(o => ({ at: o.at, tag: o.el?.tagName, cls: (o.el?.className || '').toString().slice(0, 34) }))
  }
  return {
    vw, vh,
    alertTop: box ? Math.round(box.top) : null,
    alertBottom: box ? Math.round(box.bottom) : null,
    alertFullyInView: box ? (box.top >= 0 && box.bottom <= vh) : null,
    alertPartlyBelowFold: box ? box.bottom > vh : null,
    marked, covering, hit: typeof hit === 'undefined' ? null : hit,
    scrollY: Math.round(window.scrollY)
  }
}

try {
  for (const [w, h, tag] of [[1440, 900, '1440'], [390, 844, '390']]) {
    const context = await browser.newContext({ viewport: { width: w, height: h }, locale: 'de-CH', deviceScaleFactor: 2 })
    const page = await context.newPage()
    await page.addInitScript(`window.__vis = ${vis.toString()}`)
    const cdp = await page.context().newCDPSession(page)
    await page.route('**/*', r => (r.request().method() !== 'GET' && !r.request().url().startsWith(BASE)) ? r.abort() : r.continue())
    await page.goto(`${BASE}/kontakt#events`, { waitUntil: 'domcontentloaded', timeout: 20000 })
    await page.waitForTimeout(2500)
    for (let i = 0; i < 2; i++) {
      const b = page.locator('main button', { hasText: 'Weiter' }).first()
      await b.scrollIntoViewIfNeeded().catch(() => {})
      await page.waitForTimeout(420)
      await b.click({ timeout: 8000 }).catch(() => {})
      await page.waitForTimeout(1600)
    }
    // realistic: user fills name + consent, forgets the contact way
    await page.locator('main input').first().fill('Testperson Critic').catch(() => {})
    await page.locator('main input[type=checkbox]').first().check({ timeout: 6000 }).catch(() => {})
    await page.waitForTimeout(700)
    const send = page.locator('main button', { hasText: 'Anfrage senden' }).first()
    await send.scrollIntoViewIfNeeded().catch(() => {})
    await page.waitForTimeout(420)
    await send.click({ timeout: 8000 }).catch(() => {})
    await page.waitForTimeout(2500)
    rec(`VIS_${tag} ` + JSON.stringify(await page.evaluate(() => window.__vis())))
    const { data } = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false })
    fs.writeFileSync(path.join(OUT, `errvis-${tag}.png`), Buffer.from(data, 'base64'))
    await context.close()
  }
  fs.writeFileSync(path.join(OUT, '_log-errvis.json'), JSON.stringify(log, null, 2))
  rec('DONE')
} catch (e) {
  console.error('FAIL', e.stack || e); process.exitCode = 1
} finally { await browser.close() }
