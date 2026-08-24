import { chromium } from 'playwright-core'
import fs from 'node:fs'
import path from 'node:path'

const OUT = '/root/clients/salsaflow-w1/worklog/shots/CRITIC-0824-0251'
const BASE = 'http://127.0.0.1:5173'

const browser = await chromium.launch({
  executablePath: '/usr/bin/google-chrome', headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none']
})
const log = []
function rec(m) { log.push(m); console.log(m) }

const landing = () => {
  let best = null
  for (const h of document.querySelectorAll('main h1,main h2,main h3')) {
    const r = h.getBoundingClientRect()
    if (r.bottom < 20) continue
    if (!best || r.top < best.top) best = { top: Math.round(r.top), t: (h.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 48) }
  }
  const hash = location.hash.slice(1)
  return {
    hash, exists: !!(hash && (document.getElementById(hash) || document.querySelector(`[name="${CSS.escape(hash)}"]`))),
    scrollY: Math.round(window.scrollY),
    firstHeadingInView: best,
    idsOnPage: [...document.querySelectorAll('main [id]')].map(e => e.id)
  }
}

try {
  // click the real buttons, do not fake the navigation
  const jobs = [
    ['/events', 'Nächste Events ansehen', 'dead-events-1.png'],
    ['/events', 'Workshops ansehen', 'dead-events-2.png'],
    ['/kontakt/standort-raumvermietung', 'Raumvermietung anfragen', 'dead-raum-1.png']
  ]
  for (const [route, label, shot] of jobs) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'de-CH', deviceScaleFactor: 1 })
    const page = await context.newPage()
    await page.addInitScript(`window.__landing = ${landing.toString()}`)
    const cdp = await page.context().newCDPSession(page)
    await page.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 20000 })
    await page.waitForTimeout(2400)
    const el = page.locator('main a', { hasText: label }).first()
    await el.scrollIntoViewIfNeeded().catch(() => {})
    await page.waitForTimeout(700)
    await el.click({ timeout: 8000 }).catch(e => rec(`CLICK_ERR ${label} ${String(e).slice(0, 70)}`))
    await page.waitForTimeout(2400)
    const st = await page.evaluate(() => window.__landing())
    rec(`DEAD "${label}" from ${route} -> ${page.url ? '' : ''}` + JSON.stringify(st))
    rec(`URL "${label}" ${page.url()}`)
    const { data } = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false })
    fs.writeFileSync(path.join(OUT, shot), Buffer.from(data, 'base64'))
    console.log('SHOT ' + shot)
    await context.close()
  }

  // control: a working same-page anchor, for comparison
  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'de-CH', deviceScaleFactor: 1 })
    const page = await context.newPage()
    await page.addInitScript(`window.__landing = ${landing.toString()}`)
    const cdp = await page.context().newCDPSession(page)
    await page.goto(BASE + '/kontakt/standort-raumvermietung', { waitUntil: 'domcontentloaded', timeout: 20000 })
    await page.waitForTimeout(2400)
    await page.locator('main a', { hasText: 'Raum anfragen' }).first().click({ timeout: 8000 }).catch(() => {})
    await page.waitForTimeout(2200)
    rec('CONTROL_raum-anfragen ' + JSON.stringify(await page.evaluate(() => window.__landing())))
    const { data } = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false })
    fs.writeFileSync(path.join(OUT, 'control-raum-mieten.png'), Buffer.from(data, 'base64'))
    console.log('SHOT control-raum-mieten.png')
    await context.close()
  }

  fs.writeFileSync(path.join(OUT, '_log-deadanchor.json'), JSON.stringify(log, null, 2))
  rec('DONE')
} catch (e) {
  console.error('FAIL', e.stack || e); process.exitCode = 1
} finally { await browser.close() }
