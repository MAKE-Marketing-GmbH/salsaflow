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

// wizard step state: which step is active, what is required, is Weiter usable?
const stepState = () => {
  const steps = [...document.querySelectorAll('main *')]
    .filter(e => !e.children.length && /^(ANLIEGEN|DETAILS|KONTAKT)$/i.test((e.textContent || '').trim()))
    .map(e => { const cs = getComputedStyle(e); return { t: e.textContent.trim(), color: cs.color, weight: cs.fontWeight } })
  const btns = [...document.querySelectorAll('main button')].map(b => {
    const cs = getComputedStyle(b)
    const r = b.getBoundingClientRect()
    return {
      t: (b.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 26),
      disabled: b.disabled, aria: b.getAttribute('aria-disabled'),
      bg: cs.backgroundColor, color: cs.color, opacity: cs.opacity,
      y: Math.round(r.top + window.scrollY), h: Math.round(r.height)
    }
  }).filter(b => b.t)
  const fields = [...document.querySelectorAll('main input:not([type=radio]),main textarea,main select')].map(f => ({
    name: f.name || f.id, type: f.type, required: f.required,
    aria: f.getAttribute('aria-required'), label: (f.labels?.[0]?.textContent || '').trim().slice(0, 30),
    value: (f.value || '').slice(0, 20)
  }))
  const errs = [...document.querySelectorAll('main [role=alert],main [aria-live]')]
    .map(e => (e.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 60)).filter(Boolean)
  return { steps, btns, fields, errs, scrollY: Math.round(window.scrollY) }
}

try {
  for (const [w, h, tag] of [[1440, 900, '1440'], [390, 844, '390']]) {
    const context = await browser.newContext({ viewport: { width: w, height: h }, locale: 'de-CH', deviceScaleFactor: 1 })
    const page = await context.newPage()
    await page.addInitScript(`window.__step = ${stepState.toString()}`)
    const cdp = await page.context().newCDPSession(page)
    await page.goto(`${BASE}/kontakt#events`, { waitUntil: 'domcontentloaded', timeout: 20000 })
    await page.waitForTimeout(2500)
    rec(`STEP1_${tag} ` + JSON.stringify(await page.evaluate(() => window.__step())))

    // preselected by hash -> press Weiter without touching anything
    const weiter = page.locator('main button', { hasText: 'Weiter' }).first()
    await weiter.scrollIntoViewIfNeeded().catch(() => {})
    await page.waitForTimeout(600)
    await weiter.click({ timeout: 8000 }).catch(e => rec(`CLICK_ERR ${tag} ${String(e).slice(0, 60)}`))
    await page.waitForTimeout(2000)
    rec(`STEP2_${tag} ` + JSON.stringify(await page.evaluate(() => window.__step())))
    let { data } = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false })
    fs.writeFileSync(path.join(OUT, `flow-${tag}-step2.png`), Buffer.from(data, 'base64'))

    // try to advance again with nothing filled in
    const w2 = page.locator('main button', { hasText: 'Weiter' }).first()
    if (await w2.count()) {
      await w2.click({ timeout: 6000 }).catch(() => {})
      await page.waitForTimeout(1800)
      rec(`STEP2_EMPTY_${tag} ` + JSON.stringify(await page.evaluate(() => window.__step())))
      ;({ data } = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false }))
      fs.writeFileSync(path.join(OUT, `flow-${tag}-step2-empty.png`), Buffer.from(data, 'base64'))
    }
    await context.close()
  }
  fs.writeFileSync(path.join(OUT, '_log-flow.json'), JSON.stringify(log, null, 2))
  rec('DONE')
} catch (e) {
  console.error('FAIL', e.stack || e); process.exitCode = 1
} finally { await browser.close() }
