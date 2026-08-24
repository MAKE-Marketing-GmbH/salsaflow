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

// after a failed submit: is the offending field marked, focused, announced?
const state = () => {
  const alert = document.querySelector('main [role=alert]')
  const fields = [...document.querySelectorAll('main input:not([type=hidden]),main textarea')]
    .filter(f => { const r = f.getBoundingClientRect(); return r.width > 4 && r.height > 4 })
    .map(f => {
      const cs = getComputedStyle(f)
      return {
        label: (f.labels?.[0]?.textContent || f.type).trim().slice(0, 26),
        type: f.type, value: f.value.slice(0, 16),
        border: cs.borderColor, outline: cs.outlineColor,
        ariaInvalid: f.getAttribute('aria-invalid'),
        ariaDescribedby: f.getAttribute('aria-describedby'),
        required: f.required,
        focused: document.activeElement === f
      }
    })
  return {
    alertText: alert ? (alert.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 80) : null,
    alertId: alert?.id || null,
    alertLive: alert?.getAttribute('aria-live'),
    activeEl: document.activeElement?.tagName + '/' + ((document.activeElement?.labels?.[0]?.textContent || '').trim().slice(0, 20) || document.activeElement?.className?.toString().slice(0, 20)),
    fields,
    marked: fields.filter(f => f.ariaInvalid === 'true' || /173, 24, 39|220, 38/.test(f.border)).map(f => f.label)
  }
}

// fill only what the alert asked for, then submit again
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'de-CH', deviceScaleFactor: 1 })
  const page = await context.newPage()
  await page.addInitScript(`window.__st = ${state.toString()}`)
  const net = []
  await page.route('**/*', r => {
    const rq = r.request()
    if (rq.method() !== 'GET' && !rq.url().startsWith(BASE)) { net.push(`BLOCKED ${rq.method()} ${rq.url().slice(0, 70)}`); return r.abort() }
    if (rq.method() !== 'GET') net.push(`${rq.method()} ${rq.url().slice(0, 70)}`)
    return r.continue()
  })
  await page.goto(`${BASE}/kontakt#events`, { waitUntil: 'domcontentloaded', timeout: 20000 })
  await page.waitForTimeout(2500)
  for (let i = 0; i < 2; i++) {
    const b = page.locator('main button', { hasText: 'Weiter' }).first()
    await b.scrollIntoViewIfNeeded().catch(() => {})
    await page.waitForTimeout(450)
    await b.click({ timeout: 8000 }).catch(() => {})
    await page.waitForTimeout(1700)
  }
  const send = page.locator('main button', { hasText: 'Anfrage senden' }).first()
  await send.scrollIntoViewIfNeeded().catch(() => {})
  await page.waitForTimeout(450)
  await send.click({ timeout: 8000 }).catch(() => {})
  await page.waitForTimeout(2400)
  rec('FAIL_EMPTY ' + JSON.stringify(await page.evaluate(() => window.__st())))

  // give it a name only -> alert asked for "Vorname und E-Mail oder Handy"
  const vor = page.locator('main input').first()
  await vor.fill('Testperson Critic').catch(() => {})
  await page.waitForTimeout(900)
  await send.click({ timeout: 8000 }).catch(() => {})
  await page.waitForTimeout(2400)
  rec('FAIL_NAMEONLY ' + JSON.stringify(await page.evaluate(() => window.__st())))

  // now a malformed e-mail: does it complain?
  const mail = page.locator('main input[type=email]').first()
  await mail.fill('keine-mail-adresse').catch(() => {})
  await page.waitForTimeout(800)
  await send.click({ timeout: 8000 }).catch(() => {})
  await page.waitForTimeout(2400)
  rec('BAD_EMAIL ' + JSON.stringify(await page.evaluate(() => window.__st())))
  rec('NET ' + JSON.stringify(net.slice(0, 6)))
  await context.close()

  fs.writeFileSync(path.join(OUT, '_log-valid.json'), JSON.stringify(log, null, 2))
  rec('DONE')
} catch (e) {
  console.error('FAIL', e.stack || e); process.exitCode = 1
} finally { await browser.close() }
