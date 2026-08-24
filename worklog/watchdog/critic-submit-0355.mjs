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

const after = () => {
  const errs = [...document.querySelectorAll('main [role=alert],main [aria-live],main [data-error]')]
    .map(e => (e.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 80)).filter(Boolean)
  const invalid = [...document.querySelectorAll('main :invalid')].map(e => e.tagName + '/' + (e.labels?.[0]?.textContent || '').trim().slice(0, 24))
  const red = [...document.querySelectorAll('main input,main textarea')].filter(e => {
    const c = getComputedStyle(e).borderColor
    return /173, 24, 39|220, 38|239, 68/.test(c)
  }).map(e => (e.labels?.[0]?.textContent || e.type).trim().slice(0, 24))
  let heading = null
  for (const h of document.querySelectorAll('main h1,main h2,main h3')) {
    const r = h.getBoundingClientRect()
    if (r.bottom < 20) continue
    if (!heading || r.top < heading.top) heading = { top: Math.round(r.top), t: (h.textContent || '').trim().slice(0, 46) }
  }
  return { errs, invalid, redBorders: red, heading, bodyHasDanke: /danke|erhalten|gesendet|melden uns/i.test(document.body.innerText) }
}

try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'de-CH', deviceScaleFactor: 1 })
  const page = await context.newPage()
  await page.addInitScript(`window.__after = ${after.toString()}`)
  const cdp = await page.context().newCDPSession(page)

  // observe outbound calls; block anything leaving the local dev server
  const calls = []
  await page.route('**/*', route => {
    const r = route.request()
    const u = r.url()
    if (r.method() !== 'GET' && !u.startsWith(BASE)) { calls.push(`BLOCKED ${r.method()} ${u.slice(0, 90)}`); return route.abort() }
    if (r.method() !== 'GET') calls.push(`${r.method()} ${u.slice(0, 90)}`)
    return route.continue()
  })

  await page.goto(`${BASE}/kontakt#events`, { waitUntil: 'domcontentloaded', timeout: 20000 })
  await page.waitForTimeout(2500)
  for (const step of [1, 2]) {
    const b = page.locator('main button', { hasText: 'Weiter' }).first()
    await b.scrollIntoViewIfNeeded().catch(() => {})
    await page.waitForTimeout(500)
    await b.click({ timeout: 8000 }).catch(e => rec(`W${step}_ERR ${String(e).slice(0, 50)}`))
    await page.waitForTimeout(1800)
  }
  rec('BEFORE_SUBMIT ' + JSON.stringify(await page.evaluate(() => window.__after())))
  const send = page.locator('main button', { hasText: 'Anfrage senden' }).first()
  await send.scrollIntoViewIfNeeded().catch(() => {})
  await page.waitForTimeout(500)
  await send.click({ timeout: 8000 }).catch(e => rec(`SEND_ERR ${String(e).slice(0, 50)}`))
  await page.waitForTimeout(2600)
  rec('AFTER_SUBMIT ' + JSON.stringify(await page.evaluate(() => window.__after())))
  rec('NETWORK ' + JSON.stringify(calls.slice(0, 8)))
  const { data } = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false })
  fs.writeFileSync(path.join(OUT, 'submit-empty-1440.png'), Buffer.from(data, 'base64'))
  await context.close()

  fs.writeFileSync(path.join(OUT, '_log-submit.json'), JSON.stringify(log, null, 2))
  rec('DONE')
} catch (e) {
  console.error('FAIL', e.stack || e); process.exitCode = 1
} finally { await browser.close() }
