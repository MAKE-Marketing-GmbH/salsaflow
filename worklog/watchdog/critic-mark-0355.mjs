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

// what does the user SEE: field border + the alert wording, per scenario
const seen = () => {
  const alert = document.getElementById('inquiry-error')
  const f = [...document.querySelectorAll('main input:not([type=hidden])')]
    .filter(x => { const r = x.getBoundingClientRect(); return r.width > 4 && r.height > 4 && r.left > -100 })
    .map(x => {
      const cs = getComputedStyle(x)
      return {
        label: (x.labels?.[0]?.textContent || x.type).trim().slice(0, 22),
        empty: !x.value || x.value === 'on' && !x.checked,
        border: cs.borderColor, bw: cs.borderWidth,
        ariaInvalid: x.getAttribute('aria-invalid')
      }
    })
  return { alert: alert ? alert.innerText.trim().replace(/\s+/g, ' ') : null, fields: f }
}

// walk to step 3 with the topic preselected by hash
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

try {
  for (const [w, h, tag] of [[1440, 900, '1440'], [390, 844, '390']]) {
    const context = await browser.newContext({ viewport: { width: w, height: h }, locale: 'de-CH', deviceScaleFactor: 2 })
    const page = await context.newPage()
    await page.addInitScript(`window.__seen = ${seen.toString()}`)
    const cdp = await page.context().newCDPSession(page)
    await page.route('**/*', r => (r.request().method() !== 'GET' && !r.request().url().startsWith(BASE)) ? r.abort() : r.continue())
    await toStep3(page)

    const send = page.locator('main button', { hasText: 'Anfrage senden' }).first()
    // A: everything empty
    await send.scrollIntoViewIfNeeded().catch(() => {})
    await page.waitForTimeout(450)
    await send.click({ timeout: 8000 }).catch(() => {})
    await page.waitForTimeout(2400)
    rec(`A_EMPTY_${tag} ` + JSON.stringify(await page.evaluate(() => window.__seen())))
    let { data } = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false })
    fs.writeFileSync(path.join(OUT, `mark-${tag}-a-empty.png`), Buffer.from(data, 'base64'))

    // B: name filled, contact still missing -> message still demands the name
    await page.locator('main input').first().fill('Testperson Critic').catch(() => {})
    await page.waitForTimeout(800)
    await send.click({ timeout: 8000 }).catch(() => {})
    await page.waitForTimeout(2400)
    rec(`B_NAMEONLY_${tag} ` + JSON.stringify(await page.evaluate(() => window.__seen())))
    ;({ data } = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false }))
    fs.writeFileSync(path.join(OUT, `mark-${tag}-b-nameonly.png`), Buffer.from(data, 'base64'))

    // C: malformed mail -> here the app DOES mark the field
    await page.locator('main input[type=email]').first().fill('keine-mail-adresse').catch(() => {})
    await page.waitForTimeout(800)
    await send.click({ timeout: 8000 }).catch(() => {})
    await page.waitForTimeout(2400)
    rec(`C_BADMAIL_${tag} ` + JSON.stringify(await page.evaluate(() => window.__seen())))
    ;({ data } = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false }))
    fs.writeFileSync(path.join(OUT, `mark-${tag}-c-badmail.png`), Buffer.from(data, 'base64'))
    await context.close()
  }
  fs.writeFileSync(path.join(OUT, '_log-mark.json'), JSON.stringify(log, null, 2))
  rec('DONE')
} catch (e) {
  console.error('FAIL', e.stack || e); process.exitCode = 1
} finally { await browser.close() }
