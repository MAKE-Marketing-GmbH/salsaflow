import { chromium } from 'playwright-core'
import fs from 'node:fs'
import path from 'node:path'

const OUT = '/root/clients/salsaflow-w1/worklog/shots/CRITIC-0824-0151'
const BASE = 'http://127.0.0.1:5173'

const browser = await chromium.launch({
  executablePath: '/usr/bin/google-chrome', headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none']
})
const log = []
function rec(m) { log.push(m); console.log(m) }

// are the seven rows interactive at all? anchor, role, cursor, handler
const rowProbe = () => {
  const h1 = document.querySelector('main h1')
  const sec = h1.closest('section')
  const labels = ['Einstieg & Schnupperstunde', 'Tanzpartner & Level', 'Anmeldung & Kursablauf', 'Preise', 'Schuhe & Vorbereitung', 'Events', 'Kontakt & Standort']
  const out = []
  for (const label of labels) {
    const el = [...sec.querySelectorAll('span,p,div,a,button,li')].find(e =>
      !e.querySelector('span,p,div,a,button,li') && (e.textContent || '').trim() === label)
    if (!el) { out.push({ label, found: false }); continue }
    // walk up to find any interactive ancestor inside the section
    let node = el, anchor = null, depth = 0
    while (node && node !== sec && depth < 8) {
      const tag = node.tagName
      if (tag === 'A' || tag === 'BUTTON' || node.getAttribute('role') === 'link' ||
          node.getAttribute('role') === 'button' || node.hasAttribute('onclick') || node.tabIndex >= 0) {
        anchor = { tag, href: node.getAttribute('href'), role: node.getAttribute('role'), tabIndex: node.tabIndex }
        break
      }
      node = node.parentElement; depth++
    }
    const r = el.getBoundingClientRect()
    out.push({
      label, found: true, x: Math.round(r.x), y: Math.round(r.y),
      cursor: getComputedStyle(el).cursor,
      rowCursor: el.parentElement ? getComputedStyle(el.parentElement).cursor : null,
      interactiveAncestor: anchor
    })
  }
  return {
    anchorsInSection: sec.querySelectorAll('a').length,
    anchorTexts: [...sec.querySelectorAll('a')].map(a => `${(a.textContent || '').trim().slice(0, 24)} -> ${a.getAttribute('href')}`),
    rows: out
  }
}

try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'de-CH', deviceScaleFactor: 1 })
  const page = await context.newPage()
  const cdp = await page.context().newCDPSession(page)
  await page.goto(BASE + '/faq', { waitUntil: 'domcontentloaded', timeout: 20000 })
  await page.waitForTimeout(2600)
  rec('ROWS ' + JSON.stringify(await page.evaluate(rowProbe), null, 1))

  // hover the first row: does anything react?
  const before = await page.evaluate(() => {
    const el = [...document.querySelectorAll('span')].find(e => (e.textContent || '').trim() === 'Einstieg & Schnupperstunde')
    const cs = getComputedStyle(el)
    return { color: cs.color, textDecoration: cs.textDecorationLine, bg: getComputedStyle(el.parentElement).backgroundColor }
  })
  await page.hover('text=Einstieg & Schnupperstunde').catch(() => {})
  await page.waitForTimeout(700)
  const after = await page.evaluate(() => {
    const el = [...document.querySelectorAll('span')].find(e => (e.textContent || '').trim() === 'Einstieg & Schnupperstunde')
    const cs = getComputedStyle(el)
    return { color: cs.color, textDecoration: cs.textDecorationLine, bg: getComputedStyle(el.parentElement).backgroundColor }
  })
  rec('HOVER_ROW1 before=' + JSON.stringify(before) + ' after=' + JSON.stringify(after) +
      ' changed=' + (JSON.stringify(before) !== JSON.stringify(after)))
  const { data } = await cdp.send('Page.captureScreenshot', {
    format: 'png', captureBeyondViewport: false, clip: { x: 700, y: 180, width: 740, height: 200, scale: 1 }
  })
  fs.writeFileSync(path.join(OUT, 'faq-row-hover.png'), Buffer.from(data, 'base64'))
  console.log('SHOT faq-row-hover.png')

  // click it: does the URL or scroll position move?
  const urlBefore = page.url()
  const scrollBefore = await page.evaluate(() => window.scrollY)
  await page.click('text=Einstieg & Schnupperstunde', { timeout: 4000 }).catch(e => rec('CLICK_ERR ' + e.message.slice(0, 80)))
  await page.waitForTimeout(1200)
  rec(`CLICK urlBefore=${urlBefore} urlAfter=${page.url()} scrollBefore=${scrollBefore} scrollAfter=${await page.evaluate(() => window.scrollY)}`)
  await context.close()

  fs.writeFileSync(path.join(OUT, '_log-links.json'), JSON.stringify(log, null, 2))
  rec('DONE')
} catch (e) {
  console.error('FAIL', e.stack || e); process.exitCode = 1
} finally { await browser.close() }
