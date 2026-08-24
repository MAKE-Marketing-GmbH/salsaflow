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

const seen = () => {
  const alert = document.getElementById('inquiry-error')
  const cb = [...document.querySelectorAll('main input[type=checkbox]')][0]
  const lab = cb?.closest('label') || (cb?.id ? document.querySelector(`label[for="${CSS.escape(cb.id)}"]`) : null)
  const box = cb ? (cb.nextElementSibling || cb.previousElementSibling || cb.parentElement) : null
  return {
    alert: alert ? alert.innerText.trim().replace(/\s+/g, ' ') : null,
    alertVisible: !!alert,
    checkbox: cb ? {
      checked: cb.checked, ariaInvalid: cb.getAttribute('aria-invalid'),
      boxBorder: box ? getComputedStyle(box).borderColor : null,
      labColor: lab ? getComputedStyle(lab).color : null
    } : null,
    danke: /danke|erhalten|melden uns|gesendet/i.test(document.body.innerText)
  }
}

try {
  for (const [w, h, tag] of [[1440, 900, '1440'], [390, 844, '390']]) {
    const context = await browser.newContext({ viewport: { width: w, height: h }, locale: 'de-CH', deviceScaleFactor: 2 })
    const page = await context.newPage()
    await page.addInitScript(`window.__seen = ${seen.toString()}`)
    const cdp = await page.context().newCDPSession(page)
    const net = []
    await page.route('**/*', r => {
      const rq = r.request()
      if (rq.method() !== 'GET' && !rq.url().startsWith(BASE)) { net.push(`BLOCKED ${rq.method()} ${rq.url().slice(0, 60)}`); return r.abort() }
      if (rq.method() !== 'GET') net.push(`${rq.method()} ${rq.url().slice(0, 60)}`)
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
    // valid name + valid mail, consent deliberately left unchecked
    await page.locator('main input').first().fill('Testperson Critic').catch(() => {})
    await page.locator('main input[type=email]').first().fill('critic@example.invalid').catch(() => {})
    await page.waitForTimeout(800)
    const send = page.locator('main button', { hasText: 'Anfrage senden' }).first()
    await send.scrollIntoViewIfNeeded().catch(() => {})
    await page.waitForTimeout(450)
    await send.click({ timeout: 8000 }).catch(() => {})
    await page.waitForTimeout(2600)
    rec(`NOCONSENT_${tag} ` + JSON.stringify(await page.evaluate(() => window.__seen())))
    rec(`NET_${tag} ` + JSON.stringify(net.slice(0, 5)))
    const { data } = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false })
    fs.writeFileSync(path.join(OUT, `consent-${tag}.png`), Buffer.from(data, 'base64'))
    await context.close()
  }
  fs.writeFileSync(path.join(OUT, '_log-consent.json'), JSON.stringify(log, null, 2))
  rec('DONE')
} catch (e) {
  console.error('FAIL', e.stack || e); process.exitCode = 1
} finally { await browser.close() }
