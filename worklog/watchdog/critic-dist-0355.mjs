import { chromium } from 'playwright-core'
import fs from 'node:fs'
import path from 'node:path'

const OUT = '/root/clients/salsaflow-w1/worklog/shots/CRITIC-0824-0355'
const DIST = 'http://127.0.0.1:8080'
const DIST_PAGE = process.env.DIST_PAGE || `${DIST}/kontakt.html`

const browser = await chromium.launch({
  executablePath: '/usr/bin/google-chrome', headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none']
})
const log = []
function rec(m) { log.push(m); console.log(m) }

const wizardState = () => {
  const radios = [...document.querySelectorAll('main input[type=radio]')].map(r => {
    const lab = r.closest('label') || (r.id ? document.querySelector(`label[for="${CSS.escape(r.id)}"]`) : null)
    const box = lab || r.parentElement
    const cs = box ? getComputedStyle(box) : null
    return { value: r.value, checked: r.checked, bg: cs?.backgroundColor, color: cs?.color }
  })
  return {
    hash: location.hash.slice(1), scrollY: Math.round(window.scrollY),
    radioCount: radios.length,
    checked: radios.filter(r => r.checked).map(r => ({ v: r.value, bg: r.bg, color: r.color })),
    reds: radios.filter(r => /rgb\(173, 24, 39\)/.test(r.bg || '')).map(r => r.v)
  }
}

try {
  for (const hash of ['events', 'raumvermietung', 'geschenkgutschein', 'animationen']) {
    for (const [w, h, tag] of [[1440, 900, '1440'], [390, 844, '390']]) {
      const context = await browser.newContext({ viewport: { width: w, height: h }, locale: 'de-CH', deviceScaleFactor: 1 })
      const page = await context.newPage()
      await page.addInitScript(`window.__wiz = ${wizardState.toString()}`)
      const cdp = await page.context().newCDPSession(page)
      const resp = await page.goto(`${DIST_PAGE}#${hash}`, { waitUntil: 'domcontentloaded', timeout: 20000 }).catch(() => null)
      if (!resp) { rec(`DIST_${tag} #${hash} NO_RESPONSE`); await context.close(); continue }
      await page.waitForTimeout(2500)
      rec(`DIST_${tag} #${hash} status=${resp.status()} ` + JSON.stringify(await page.evaluate(() => window.__wiz())))
      const { data } = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false })
      fs.writeFileSync(path.join(OUT, `dist-${tag}-${hash}.png`), Buffer.from(data, 'base64'))
      await context.close()
    }
  }
  fs.writeFileSync(path.join(OUT, '_log-dist.json'), JSON.stringify(log, null, 2))
  rec('DONE')
} catch (e) {
  console.error('FAIL', e.stack || e); process.exitCode = 1
} finally { await browser.close() }
