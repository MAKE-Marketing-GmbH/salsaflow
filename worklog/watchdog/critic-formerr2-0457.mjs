import { chromium } from 'playwright-core'
import fs from 'node:fs'
import path from 'node:path'

const OUT = '/root/clients/salsaflow-w1/worklog/shots/CRITIC-0824-0457'
const BASE = 'http://127.0.0.1:5173'

// ONE case per browser context. The previous run reused a context and captured
// the same wizard state three times (identical md5) - that beleg is worthless.
const CASES = [
  { id: 'a-name-missing', name: '', mail: 'critic@example.invalid', consent: true },
  { id: 'b-nocontact', name: 'Testperson Critic', mail: '', consent: true },
  { id: 'c-badmail', name: 'Testperson Critic', mail: 'keine-mail-adresse', consent: true },
  { id: 'd-consent', name: 'Testperson Critic', mail: 'critic@example.invalid', consent: false }
]

const browser = await chromium.launch({
  executablePath: '/usr/bin/google-chrome', headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none']
})
const log = []
function rec(m) { log.push(m); console.log(m) }

const seen = () => {
  const alert = document.getElementById('inquiry-error') || document.querySelector('main [role=alert]')
  const fields = [...document.querySelectorAll('main input:not([type=hidden])')]
    .filter(x => { const r = x.getBoundingClientRect(); return r.width > 4 && r.height > 4 && r.left > -100 })
    .map(x => {
      const cs = getComputedStyle(x)
      return {
        label: (x.labels?.[0]?.textContent || x.type).trim().slice(0, 22),
        val: (x.type === 'checkbox' ? String(x.checked) : x.value).slice(0, 18),
        border: cs.borderColor, bw: cs.borderWidth,
        shadow: cs.boxShadow === 'none' ? 'none' : cs.boxShadow.slice(0, 34),
        ariaInvalid: x.getAttribute('aria-invalid')
      }
    })
  const isRed = c => /173,\s*24,\s*39|220,\s*38|239,\s*68/.test(c)
  return {
    alert: alert ? alert.innerText.trim().replace(/\s+/g, ' ') : null,
    markedBorder: fields.filter(f => isRed(f.border) && parseFloat(f.bw) >= 1.5).map(f => f.label),
    markedAria: fields.filter(f => f.ariaInvalid === 'true').map(f => f.label),
    fields,
    danke: /danke|erhalten|melden uns|gesendet/i.test(document.body.innerText)
  }
}

try {
  for (const [w, h, tag] of [[1440, 900, '1440'], [390, 844, '390']]) {
    for (const c of CASES) {
      const context = await browser.newContext({ viewport: { width: w, height: h }, locale: 'de-CH', deviceScaleFactor: 2 })
      const page = await context.newPage()
      await page.addInitScript(`window.__seen = ${seen.toString()}`)
      const cdp = await page.context().newCDPSession(page)
      const net = []
      await page.route('**/*', r => {
        const rq = r.request()
        if (rq.method() !== 'GET' && !rq.url().startsWith(BASE)) { net.push(`BLOCKED ${rq.method()} ${rq.url().slice(0, 50)}`); return r.abort() }
        if (rq.method() !== 'GET') net.push(`${rq.method()} ${rq.url().slice(0, 50)}`)
        return r.continue()
      })

      await page.goto(`${BASE}/kontakt#events`, { waitUntil: 'domcontentloaded', timeout: 20000 })
      await page.waitForTimeout(2500)
      for (let i = 0; i < 2; i++) {
        const b = page.locator('main button', { hasText: 'Weiter' }).first()
        await b.scrollIntoViewIfNeeded().catch(() => {})
        await page.waitForTimeout(420)
        await b.click({ timeout: 8000 }).catch(() => {})
        await page.waitForTimeout(1600)
      }
      if (c.name) await page.locator('main input').first().fill(c.name).catch(() => {})
      if (c.mail) await page.locator('main input[type=email]').first().fill(c.mail).catch(() => {})
      if (c.consent) await page.locator('main input[type=checkbox]').first().check({ timeout: 6000 }).catch(() => {})
      await page.waitForTimeout(700)

      const send = page.locator('main button', { hasText: 'Anfrage senden' }).first()
      await send.scrollIntoViewIfNeeded().catch(() => {})
      await page.waitForTimeout(420)
      await send.click({ timeout: 8000 }).catch(() => {})
      await page.waitForTimeout(2400)

      rec(`${c.id}_${tag} ` + JSON.stringify(await page.evaluate(() => window.__seen())))
      rec(`${c.id}_${tag}_NET ` + JSON.stringify(net.slice(0, 4)))
      const { data } = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false })
      fs.writeFileSync(path.join(OUT, `${c.id}-${tag}.png`), Buffer.from(data, 'base64'))
      await context.close()
    }
  }
  fs.writeFileSync(path.join(OUT, '_log-formerr2.json'), JSON.stringify(log, null, 2))
  rec('DONE')
} catch (e) {
  console.error('FAIL', e.stack || e); process.exitCode = 1
} finally { await browser.close() }
