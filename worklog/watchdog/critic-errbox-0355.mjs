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

// the alert box: how many text nodes live in it, and do they overlap?
const errBox = () => {
  const box = document.querySelector('main [role=alert]') || [...document.querySelectorAll('main *')]
    .find(e => /Bitte gib deinen Vornamen/.test(e.textContent || '') && e.children.length < 4)
  if (!box) return { noBox: true }
  const cs = getComputedStyle(box)
  const br = box.getBoundingClientRect()
  const lines = []
  const walk = document.createTreeWalker(box, NodeFilter.SHOW_TEXT)
  let n
  while ((n = walk.nextNode())) {
    const t = n.textContent.trim()
    if (!t) continue
    const rg = document.createRange(); rg.selectNodeContents(n)
    const r = rg.getBoundingClientRect()
    const pcs = getComputedStyle(n.parentElement)
    lines.push({
      t: t.slice(0, 62),
      top: Math.round(r.top), bottom: Math.round(r.bottom), left: Math.round(r.left),
      h: Math.round(r.height), fs: pcs.fontSize, color: pcs.color, opacity: pcs.opacity,
      parentCls: (n.parentElement.className || '').toString().slice(0, 46)
    })
  }
  // do any two ink boxes share vertical space?
  const overlaps = []
  for (let i = 0; i < lines.length; i++) for (let j = i + 1; j < lines.length; j++) {
    const a = lines[i], b = lines[j]
    const ov = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top)
    if (ov > 2) overlaps.push({ a: a.t.slice(0, 34), b: b.t.slice(0, 34), overlapPx: Math.round(ov) })
  }
  return {
    boxH: Math.round(br.height), boxTop: Math.round(br.top),
    boxCls: (box.className || '').toString().slice(0, 60),
    bg: cs.backgroundColor, overflow: cs.overflow, maxH: cs.maxHeight, pos: cs.position,
    lineCount: lines.length, lines, overlaps
  }
}

try {
  for (const [w, h, tag] of [[1440, 900, '1440'], [390, 844, '390']]) {
    const context = await browser.newContext({ viewport: { width: w, height: h }, locale: 'de-CH', deviceScaleFactor: 1 })
    const page = await context.newPage()
    await page.addInitScript(`window.__err = ${errBox.toString()}`)
    const cdp = await page.context().newCDPSession(page)
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
    await page.waitForTimeout(2500)
    rec(`ERRBOX_${tag} ` + JSON.stringify(await page.evaluate(() => window.__err())))

    // zoom the alert region
    const clip = await page.evaluate(() => {
      const box = document.querySelector('main [role=alert]') || [...document.querySelectorAll('main *')]
        .find(e => /Bitte gib deinen Vornamen/.test(e.textContent || '') && e.children.length < 4)
      if (!box) return null
      const r = box.getBoundingClientRect()
      return { x: Math.max(0, r.left - 14), y: Math.max(0, r.top - 14), width: Math.min(r.width + 28, window.innerWidth), height: r.height + 28 }
    })
    if (clip) {
      const { data } = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false, clip: { ...clip, scale: 3 } })
      fs.writeFileSync(path.join(OUT, `errbox-${tag}-zoom.png`), Buffer.from(data, 'base64'))
      rec(`ZOOM_${tag} ` + JSON.stringify(clip))
    }
    const { data } = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false })
    fs.writeFileSync(path.join(OUT, `errbox-${tag}.png`), Buffer.from(data, 'base64'))
    await context.close()
  }
  fs.writeFileSync(path.join(OUT, '_log-errbox.json'), JSON.stringify(log, null, 2))
  rec('DONE')
} catch (e) {
  console.error('FAIL', e.stack || e); process.exitCode = 1
} finally { await browser.close() }
