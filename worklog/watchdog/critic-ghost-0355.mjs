import { chromium } from 'playwright-core'
import fs from 'node:fs'
import path from 'node:path'

const OUT = '/root/clients/salsaflow-w1/worklog/shots/CRITIC-0824-0355'
const BASE = 'http://127.0.0.1:5173'

const browser = await chromium.launch({
  executablePath: '/usr/bin/google-chrome', headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none']
})
const log = []
function rec(m) { log.push(m); console.log(m) }

// scan EVERY text node in the wizard card for ink sitting in the alert band
const ghostScan = (bandTop, bandBottom) => {
  const hits = []
  const walk = document.createTreeWalker(document.querySelector('main'), NodeFilter.SHOW_TEXT)
  let n
  while ((n = walk.nextNode())) {
    const t = n.textContent.trim()
    if (!t) continue
    const rg = document.createRange(); rg.selectNodeContents(n)
    const r = rg.getBoundingClientRect()
    if (r.height === 0 && r.width === 0) continue
    // ink overlapping the alert band vertically
    const ov = Math.min(r.bottom, bandBottom) - Math.max(r.top, bandTop)
    if (ov > 1) {
      const p = n.parentElement
      const cs = getComputedStyle(p)
      hits.push({
        t: t.slice(0, 64),
        top: Math.round(r.top), bottom: Math.round(r.bottom), left: Math.round(r.left),
        fs: cs.fontSize, color: cs.color, opacity: cs.opacity, visibility: cs.visibility,
        pos: cs.position, z: cs.zIndex, transform: cs.transform.slice(0, 34),
        tag: p.tagName, cls: (p.className || '').toString().slice(0, 58),
        parentTag: p.parentElement?.tagName,
        parentCls: (p.parentElement?.className || '').toString().slice(0, 58)
      })
    }
  }
  return hits
}

try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'de-CH', deviceScaleFactor: 1 })
  const page = await context.newPage()
  await page.addInitScript(`window.__ghost = ${ghostScan.toString()}`)
  await page.route('**/*', r => (r.request().method() !== 'GET' && !r.request().url().startsWith(BASE)) ? r.abort() : r.continue())
  await page.goto(`${BASE}/kontakt#events`, { waitUntil: 'domcontentloaded', timeout: 20000 })
  await page.waitForTimeout(2500)
  for (let i = 0; i < 2; i++) {
    const b = page.locator('main button', { hasText: 'Weiter' }).first()
    await b.scrollIntoViewIfNeeded().catch(() => {})
    await page.waitForTimeout(500)
    await b.click({ timeout: 8000 }).catch(() => {})
    await page.waitForTimeout(1700)
  }
  const send = page.locator('main button', { hasText: 'Anfrage senden' }).first()
  await send.scrollIntoViewIfNeeded().catch(() => {})
  await page.waitForTimeout(500)
  await send.click({ timeout: 8000 }).catch(() => {})
  await page.waitForTimeout(2600)

  // alert band in viewport coords, then widen downward to catch the second line
  const band = await page.evaluate(() => {
    const box = document.querySelector('main [role=alert]') || [...document.querySelectorAll('main *')]
      .find(e => /Bitte gib deinen Vornamen/.test(e.textContent || '') && e.children.length < 4)
    const r = box.getBoundingClientRect()
    return { top: r.top, bottom: r.bottom }
  })
  rec('BAND ' + JSON.stringify(band))
  rec('GHOST ' + JSON.stringify(await page.evaluate(b => window.__ghost(b.top, b.bottom), band)))

  // and what does elementFromPoint say at the second line's y?
  rec('HITPOINTS ' + JSON.stringify(await page.evaluate(b => {
    const out = []
    for (const dy of [8, 18, 26, 34, 40]) {
      const y = Math.round(b.top + dy)
      const el = document.elementFromPoint(700, y)
      out.push({ dy, y, tag: el?.tagName, cls: (el?.className || '').toString().slice(0, 46), txt: (el?.textContent || '').trim().slice(0, 40) })
    }
    return out
  }, band)))
  await context.close()

  fs.writeFileSync(path.join(OUT, '_log-ghost.json'), JSON.stringify(log, null, 2))
  rec('DONE')
} catch (e) {
  console.error('FAIL', e.stack || e); process.exitCode = 1
} finally { await browser.close() }
