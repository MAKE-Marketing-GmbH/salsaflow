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

// what the user actually sees: alert wording + per-field border (px + colour)
const seen = () => {
  const alert = document.getElementById('inquiry-error')
    || document.querySelector('main [role=alert]')
  const fields = [...document.querySelectorAll('main input:not([type=hidden])')]
    .filter(x => { const r = x.getBoundingClientRect(); return r.width > 4 && r.height > 4 && r.left > -100 })
    .map(x => {
      const cs = getComputedStyle(x)
      return {
        label: (x.labels?.[0]?.textContent || x.type).trim().slice(0, 22),
        val: (x.type === 'checkbox' ? String(x.checked) : x.value).slice(0, 18),
        border: cs.borderColor, bw: cs.borderWidth,
        shadow: cs.boxShadow === 'none' ? 'none' : cs.boxShadow.slice(0, 40),
        ariaInvalid: x.getAttribute('aria-invalid')
      }
    })
  const isRed = c => /173,\s*24,\s*39|220,\s*38|239,\s*68/.test(c)
  return {
    alert: alert ? alert.innerText.trim().replace(/\s+/g, ' ') : null,
    marked: fields.filter(f => isRed(f.border) && parseFloat(f.bw) >= 1.5).map(f => f.label),
    markedAria: fields.filter(f => f.ariaInvalid === 'true').map(f => f.label),
    fields,
    danke: /danke|erhalten|melden uns|gesendet/i.test(document.body.innerText)
  }
}

async function toStep3(page) {
  await page.goto(`${BASE}/kontakt#events`, { waitUntil: 'domcontentloaded', timeout: 20000 })
  await page.waitForTimeout(2500)
  for (let i = 0; i < 2; i++) {
    const b = page.locator('main button', { hasText: 'Weiter' }).first()
    await b.scrollIntoViewIfNeeded().catch(() => {})
    await page.waitForTimeout(450)
    await b.click({ timeout: 8000 }).catch(() => {})
    await page.waitForTimeout(1700)
  }
}
const consent = page => page.locator('main input[type=checkbox]').first()
const vorname = page => page.locator('main input').first()
const mail = page => page.locator('main input[type=email]').first()

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

    const shot = async name => {
      const { data } = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false })
      fs.writeFileSync(path.join(OUT, `${name}-${tag}.png`), Buffer.from(data, 'base64'))
    }
    const send = () => page.locator('main button', { hasText: 'Anfrage senden' }).first()
    const fire = async () => {
      const b = send()
      await b.scrollIntoViewIfNeeded().catch(() => {})
      await page.waitForTimeout(450)
      await b.click({ timeout: 8000 }).catch(() => {})
      await page.waitForTimeout(2400)
    }

    // A: name missing, contact present -> claim: "Bitte gib deinen Vornamen an." + Vorname marked
    await toStep3(page)
    await mail(page).fill('critic@example.invalid').catch(() => {})
    await consent(page).check({ timeout: 6000 }).catch(() => {})
    await page.waitForTimeout(700)
    await fire()
    rec(`A_NAME_MISSING_${tag} ` + JSON.stringify(await page.evaluate(() => window.__seen())))
    await shot('a-name-missing')

    // B: name present, no contact way -> claim: mail-or-phone text, BOTH marked
    await context.clearCookies().catch(() => {})
    await toStep3(page)
    await vorname(page).fill('Testperson Critic').catch(() => {})
    await consent(page).check({ timeout: 6000 }).catch(() => {})
    await page.waitForTimeout(700)
    await fire()
    rec(`B_NOCONTACT_${tag} ` + JSON.stringify(await page.evaluate(() => window.__seen())))
    await shot('b-nocontact')

    // C: malformed mail -> claim: "unvollstaendig" text, ONLY mail marked
    await toStep3(page)
    await vorname(page).fill('Testperson Critic').catch(() => {})
    await mail(page).fill('keine-mail-adresse').catch(() => {})
    await consent(page).check({ timeout: 6000 }).catch(() => {})
    await page.waitForTimeout(700)
    await fire()
    rec(`C_BADMAIL_${tag} ` + JSON.stringify(await page.evaluate(() => window.__seen())))
    await shot('c-badmail')

    // D: control - consent missing, everything else valid
    await toStep3(page)
    await vorname(page).fill('Testperson Critic').catch(() => {})
    await mail(page).fill('critic@example.invalid').catch(() => {})
    await page.waitForTimeout(700)
    await fire()
    rec(`D_CONSENT_${tag} ` + JSON.stringify(await page.evaluate(() => window.__seen())))
    await shot('d-consent')

    rec(`NET_${tag} ` + JSON.stringify(net.slice(0, 6)))
    await context.close()
  }
  fs.writeFileSync(path.join(OUT, '_log-formerr.json'), JSON.stringify(log, null, 2))
  rec('DONE')
} catch (e) {
  console.error('FAIL', e.stack || e); process.exitCode = 1
} finally { await browser.close() }
