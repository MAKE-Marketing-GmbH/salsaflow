import { chromium } from 'playwright-core'
import fs from 'node:fs'
import path from 'node:path'

const OUT = '/root/clients/salsaflow-w1/worklog/shots/CRITIC-0824-0151'
const BASE = 'http://127.0.0.1:5173'

const browser = await chromium.launch({
  executablePath: '/usr/bin/google-chrome', headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none']
})
const log = []
function rec(m) { log.push(m); console.log(m) }

// a collapsed answer: clipped by height, or just painted over?
const collapseProbe = () => {
  const needle = 'Datum, Uhrzeit, Dauer'
  const el = [...document.querySelectorAll('main p,main div,main span')].find(e =>
    !e.querySelector('p,div,span') && (e.textContent || '').trim().startsWith(needle))
  if (!el) return { found: false }
  const r = el.getBoundingClientRect()
  const chain = []
  let node = el
  for (let i = 0; i < 6 && node && node.tagName !== 'MAIN'; i++) {
    const cs = getComputedStyle(node)
    const nr = node.getBoundingClientRect()
    chain.push({
      tag: node.tagName, cls: (node.className || '').toString().slice(0, 46),
      h: Math.round(nr.height), clientH: node.clientHeight, scrollH: node.scrollHeight,
      overflow: cs.overflow, maxH: cs.maxHeight, opacity: cs.opacity,
      visibility: cs.visibility, display: cs.display,
      hidden: node.hasAttribute('hidden'), ariaHidden: node.getAttribute('aria-hidden'),
      inert: node.hasAttribute('inert')
    })
    node = node.parentElement
  }
  // is a screen reader able to reach it? is it focusable while invisible?
  const links = [...el.querySelectorAll('a,button')].map(a => ({ t: (a.textContent || '').trim().slice(0, 20), tabIndex: a.tabIndex }))
  return {
    found: true,
    inkRect: { y: Math.round(r.y), h: Math.round(r.height), w: Math.round(r.width) },
    visible: r.height > 0 && r.width > 0,
    chain, focusableInside: links
  }
}

try {
  // 1) collapsed state in the DOM
  {
    const context = await browser.newContext({ viewport: { width: 360, height: 700 }, locale: 'de-CH', deviceScaleFactor: 1 })
    const page = await context.newPage()
    await page.goto(BASE + '/kontakt/standort-raumvermietung', { waitUntil: 'domcontentloaded', timeout: 20000 })
    await page.waitForTimeout(2400)
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(1500)
    rec('COLLAPSE ' + JSON.stringify(await page.evaluate(collapseProbe), null, 1))
    await context.close()
  }

  // 2) same page with JavaScript disabled — is the answer readable at all?
  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'de-CH', deviceScaleFactor: 1, javaScriptEnabled: false })
    const page = await context.newPage()
    const cdp = await page.context().newCDPSession(page)
    await page.goto(BASE + '/kontakt/standort-raumvermietung', { waitUntil: 'domcontentloaded', timeout: 20000 })
    await page.waitForTimeout(2000)
    const nojs = await page.evaluate(() => ({
      bodyText: (document.body.innerText || '').trim().length,
      mainExists: !!document.querySelector('main'),
      h1: (document.querySelector('h1')?.textContent || '').trim().slice(0, 40)
    })).catch(() => ({ evalBlocked: true }))
    rec('NOJS ' + JSON.stringify(nojs))
    const { data } = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false })
    fs.writeFileSync(path.join(OUT, 'raum-nojs-1440.png'), Buffer.from(data, 'base64'))
    console.log('SHOT raum-nojs-1440.png')
    await context.close()
  }

  fs.writeFileSync(path.join(OUT, '_log-a11y.json'), JSON.stringify(log, null, 2))
  rec('DONE')
} catch (e) {
  console.error('FAIL', e.stack || e); process.exitCode = 1
} finally { await browser.close() }
