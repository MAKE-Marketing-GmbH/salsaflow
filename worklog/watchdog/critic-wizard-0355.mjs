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

// what did the hash actually do to the wizard?
const wizardState = () => {
  const hash = location.hash.slice(1)
  const radios = [...document.querySelectorAll('main input[type=radio]')].map(r => {
    // the visible card is the label wrapping (or pointing at) the radio
    let lab = r.closest('label') || (r.id ? document.querySelector(`label[for="${CSS.escape(r.id)}"]`) : null)
    const box = lab || r.parentElement
    const cs = box ? getComputedStyle(box) : null
    const rect = box ? box.getBoundingClientRect() : null
    return {
      value: r.value, checked: r.checked, name: r.name,
      text: (box?.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 34),
      bg: cs?.backgroundColor, color: cs?.color, border: cs?.borderColor,
      cls: (box?.className || '').toString().slice(0, 70),
      y: rect ? Math.round(rect.top + window.scrollY) : null,
      inView: rect ? rect.top > -10 && rect.top < window.innerHeight : false
    }
  })
  let best = null
  for (const h of document.querySelectorAll('main h1,main h2,main h3')) {
    const r = h.getBoundingClientRect()
    if (r.bottom < 20) continue
    if (!best || r.top < best.top) best = { top: Math.round(r.top), t: (h.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 46) }
  }
  return {
    hash,
    idExists: !!(hash && document.getElementById(hash)),
    scrollY: Math.round(window.scrollY),
    checked: radios.filter(r => r.checked).map(r => ({ value: r.value, text: r.text, bg: r.bg, color: r.color, cls: r.cls, y: r.y, inView: r.inView })),
    firstHeadingInView: best,
    radioCount: radios.length,
    allBg: radios.map(r => ({ v: r.value, checked: r.checked, bg: r.bg }))
  }
}

const HASHES = ['events', 'raumvermietung', 'geschenkgutschein', 'animationen', 'schnupperstunde', 'kontaktformular']

try {
  for (const [w, h, tag] of [[1440, 900, '1440'], [390, 844, '390']]) {
    for (const hash of HASHES) {
      const context = await browser.newContext({ viewport: { width: w, height: h }, locale: 'de-CH', deviceScaleFactor: 1 })
      const page = await context.newPage()
      await page.addInitScript(`window.__wiz = ${wizardState.toString()}`)
      const cdp = await page.context().newCDPSession(page)
      await page.goto(`${BASE}/kontakt#${hash}`, { waitUntil: 'domcontentloaded', timeout: 20000 })
      await page.waitForTimeout(2500)
      const st = await page.evaluate(() => window.__wiz())
      rec(`HASH_${tag} #${hash} ` + JSON.stringify(st))
      const { data } = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false })
      fs.writeFileSync(path.join(OUT, `hash-${tag}-${hash}.png`), Buffer.from(data, 'base64'))
      await context.close()
    }
  }
  fs.writeFileSync(path.join(OUT, '_log-wizard.json'), JSON.stringify(log, null, 2))
  rec('DONE')
} catch (e) {
  console.error('FAIL', e.stack || e); process.exitCode = 1
} finally { await browser.close() }
