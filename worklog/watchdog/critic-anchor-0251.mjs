import { chromium } from 'playwright-core'
import fs from 'node:fs'
import path from 'node:path'

const OUT = '/root/clients/salsaflow-w1/worklog/shots/CRITIC-0824-0251'
const BASE = 'http://127.0.0.1:5173'

const browser = await chromium.launch({
  executablePath: '/usr/bin/google-chrome', headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none']
})
const log = []
function rec(m) { log.push(m); console.log(m) }

// every in-page anchor on the route: does the target id exist, and where does it land?
const anchorAudit = () => {
  const out = []
  for (const a of document.querySelectorAll('main a[href^="#"], main a[href*="#"]')) {
    const href = a.getAttribute('href') || ''
    const hash = href.includes('#') ? href.slice(href.indexOf('#') + 1) : ''
    if (!hash) continue
    const sameRoute = href.startsWith('#') || href.split('#')[0] === '' || href.split('#')[0] === location.pathname
    const target = document.getElementById(hash) || document.querySelector(`[name="${CSS.escape(hash)}"]`)
    const r = a.getBoundingClientRect()
    out.push({
      label: (a.innerText || a.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40),
      href, hash, sameRoute,
      targetExists: !!target,
      targetTag: target?.tagName || null,
      targetText: target ? (target.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 46) : null,
      targetY: target ? Math.round(target.getBoundingClientRect().top + window.scrollY) : null,
      linkY: Math.round(r.top + window.scrollY)
    })
  }
  return out
}

const ROUTES = ['/', '/tanzkurse', '/kursplan', '/preise', '/events', '/team', '/fotos', '/faq', '/schnupperstunde', '/kontakt', '/mehr/partys', '/mehr/tanzschuhe', '/kontakt/standort-raumvermietung']

try {
  for (const route of ROUTES) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'de-CH', deviceScaleFactor: 1 })
    const page = await context.newPage()
    await page.addInitScript(`window.__anchors = ${anchorAudit.toString()}`)
    const resp = await page.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 20000 }).catch(() => null)
    if (!resp || resp.status() >= 400) { await context.close(); continue }
    await page.waitForTimeout(2300)
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(1700)
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForTimeout(600)
    const list = await page.evaluate(() => window.__anchors())
    const dead = list.filter(a => a.sameRoute && !a.targetExists)
    rec(`ANCHOR ${route} n=${list.length} dead=${dead.length} ` + JSON.stringify(dead.length ? dead : list.slice(0, 4)))
    await context.close()
  }

  // /team: click both "Gesichter ansehen" buttons and record where each actually lands
  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'de-CH', deviceScaleFactor: 1 })
    const page = await context.newPage()
    const cdp = await page.context().newCDPSession(page)
    await page.goto(BASE + '/team', { waitUntil: 'domcontentloaded', timeout: 20000 })
    await page.waitForTimeout(2400)
    const links = await page.evaluate(() => [...document.querySelectorAll('main a')]
      .filter(a => /Gesichter ansehen/i.test((a.innerText || a.textContent || '')))
      .map(a => ({ href: a.getAttribute('href'), y: Math.round(a.getBoundingClientRect().top + window.scrollY) })))
    rec('TEAM_LINKS ' + JSON.stringify(links))
    for (let i = 0; i < links.length; i++) {
      await page.evaluate(() => window.scrollTo(0, 0))
      await page.waitForTimeout(1200)
      const el = page.locator('main a', { hasText: 'Gesichter ansehen' }).nth(i)
      await el.click({ timeout: 6000 }).catch(e => rec(`CLICK_ERR ${i} ${String(e).slice(0, 60)}`))
      await page.waitForTimeout(1800)
      const after = await page.evaluate(() => {
        const y = Math.round(window.scrollY)
        // what heading is nearest the top of the viewport now?
        let best = null
        for (const h of document.querySelectorAll('main h1,main h2,main h3')) {
          const r = h.getBoundingClientRect()
          if (r.bottom < 0) continue
          if (!best || Math.abs(r.top) < Math.abs(best.top)) best = { top: Math.round(r.top), t: (h.textContent || '').trim().slice(0, 44) }
        }
        return { scrollY: y, hash: location.hash, nearestHeading: best }
      })
      rec(`TEAM_CLICK_${i} href=${links[i]?.href} ` + JSON.stringify(after))
      const { data } = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false })
      fs.writeFileSync(path.join(OUT, `team-gesichter-${i}.png`), Buffer.from(data, 'base64'))
      console.log(`SHOT team-gesichter-${i}.png`)
    }
    await context.close()
  }

  fs.writeFileSync(path.join(OUT, '_log-anchor.json'), JSON.stringify(log, null, 2))
  rec('DONE')
} catch (e) {
  console.error('FAIL', e.stack || e); process.exitCode = 1
} finally { await browser.close() }
