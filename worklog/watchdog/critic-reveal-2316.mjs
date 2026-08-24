import { chromium } from 'playwright-core'
import fs from 'node:fs'
import path from 'node:path'

const OUT = '/root/clients/salsaflow-w1/worklog/shots/CRITIC-0823-2316'
const BASE = 'http://127.0.0.1:5173'

const browser = await chromium.launch({
  executablePath: '/usr/bin/google-chrome', headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none']
})
const log = []
function rec(m) { log.push(m); console.log(m) }

// opacity of the hero H1 + first hero CTA over time after load
async function track(page, ms) {
  return page.evaluate(() => {
    const h1 = document.querySelector('main h1')
    const cta = [...document.querySelectorAll('main a,main button')].find(e => {
      const r = e.getBoundingClientRect()
      return r.y > 60 && r.y < 900 && r.height > 30 && r.width > 80
    })
    const eff = (el) => {
      let o = 1, n = el
      while (n && n !== document.body) { o *= parseFloat(getComputedStyle(n).opacity || '1'); n = n.parentElement }
      return Math.round(o * 100) / 100
    }
    return {
      h1: h1 && eff(h1),
      h1t: h1 && getComputedStyle(h1).transform.slice(0, 40),
      cta: cta && eff(cta),
      ctaT: cta && (cta.textContent || '').trim().slice(0, 24)
    }
  })
}

try {
  for (const [route, tag] of [['/fotos', 'fotos'], ['/', 'home'], ['/kursplan', 'kursplan'], ['/preise', 'preise']]) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'de-CH', deviceScaleFactor: 1 })
    const page = await context.newPage()
    const cdp = await page.context().newCDPSession(page)
    await page.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 20000 })
    const series = []
    for (const t of [300, 600, 900, 1500, 2500, 4000, 6000]) {
      await page.waitForTimeout(t - (series.length ? [300, 600, 900, 1500, 2500, 4000, 6000][series.length - 1] : 0))
      series.push({ t, ...(await track(page)) })
    }
    rec(`REVEAL_${tag} ` + JSON.stringify(series))
    const { data } = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false })
    fs.writeFileSync(path.join(OUT, `${tag}-1440-settled6s.png`), Buffer.from(data, 'base64'))
    console.log(`SHOT ${tag}-1440-settled6s.png`)
    await context.close()
  }

  // does scrolling away and back re-trigger / leave it stuck?
  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'de-CH', deviceScaleFactor: 1 })
    const page = await context.newPage()
    await page.goto(BASE + '/fotos', { waitUntil: 'domcontentloaded', timeout: 20000 })
    await page.waitForTimeout(6000)
    rec('FOTOS_settled ' + JSON.stringify(await track(page)))
    await page.evaluate(() => window.scrollTo(0, 3000)); await page.waitForTimeout(700)
    await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(1200)
    rec('FOTOS_backtotop ' + JSON.stringify(await track(page)))
    await context.close()
  }

  // SSR / no-JS visibility
  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'de-CH', javaScriptEnabled: false })
    const page = await context.newPage()
    const cdp = await page.context().newCDPSession(page)
    await page.goto(BASE + '/fotos', { waitUntil: 'domcontentloaded', timeout: 20000 })
    await page.waitForTimeout(1200)
    const { data } = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false })
    fs.writeFileSync(path.join(OUT, 'fotos-1440-nojs.png'), Buffer.from(data, 'base64'))
    console.log('SHOT fotos-1440-nojs.png')
    await context.close()
  }

  fs.writeFileSync(path.join(OUT, '_log-reveal.json'), JSON.stringify(log, null, 2))
  rec('DONE')
} catch (e) {
  console.error('FAIL', e.stack || e); process.exitCode = 1
} finally { await browser.close() }
