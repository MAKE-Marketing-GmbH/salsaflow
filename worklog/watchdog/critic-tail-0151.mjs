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

// gap between the last ink of the last main section and the footer top
const tailProbe = () => {
  const footer = document.querySelector('footer')
  const fr = footer?.getBoundingClientRect()
  const footTop = fr ? Math.round(fr.top + window.scrollY) : null

  const main = document.querySelector('main')
  const leaves = [...main.querySelectorAll('*')].filter(e => {
    if (e.children.length) return false
    const r = e.getBoundingClientRect()
    return r.width > 4 && r.height > 4 && ((e.textContent || '').trim() || e.tagName === 'IMG' || e.tagName === 'svg' || e.tagName === 'path')
  }).map(e => {
    const r = e.getBoundingClientRect()
    return { t: (e.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 36) || e.tagName, bottom: Math.round(r.bottom + window.scrollY), x: Math.round(r.x) }
  })
  const last = leaves.sort((a, b) => b.bottom - a.bottom)[0]

  // the last section: how tall, and where does its own content stop?
  const secs = [...main.querySelectorAll('section')]
  const lastSec = secs[secs.length - 1]
  const lr = lastSec?.getBoundingClientRect()
  const secLeaves = lastSec ? [...lastSec.querySelectorAll('*')].filter(e => {
    if (e.children.length) return false
    const r = e.getBoundingClientRect()
    return r.width > 4 && r.height > 4 && (e.textContent || '').trim()
  }).map(e => Math.round(e.getBoundingClientRect().bottom + window.scrollY)) : []
  const secContentBottom = secLeaves.length ? Math.max(...secLeaves) : null
  const secBottom = lr ? Math.round(lr.bottom + window.scrollY) : null

  return {
    footerTop: footTop,
    lastInk: last && { t: last.t, bottom: last.bottom },
    gapInkToFooter: last && footTop !== null ? footTop - last.bottom : null,
    lastSectionLabel: (lastSec?.querySelector('h2')?.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 30),
    lastSectionH: lr ? Math.round(lr.height) : null,
    lastSectionBottom: secBottom,
    lastSectionContentBottom: secContentBottom,
    deadInsideLastSection: secBottom !== null && secContentBottom !== null ? secBottom - secContentBottom : null
  }
}

const ROUTES = ['/preise', '/', '/tanzkurse', '/kursplan', '/events', '/team', '/fotos', '/faq', '/kontakt',
  '/schnupperstunde', '/mehr/partys', '/mehr/tanzschuhe', '/kontakt/standort-raumvermietung']

try {
  for (const [w, h, tag] of [[1440, 900, '1440'], [390, 844, '390']]) {
    for (const route of ROUTES) {
      const context = await browser.newContext({ viewport: { width: w, height: h }, locale: 'de-CH', deviceScaleFactor: 1 })
      const page = await context.newPage()
      const resp = await page.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 20000 }).catch(() => null)
      if (!resp || resp.status() >= 400) { await context.close(); continue }
      await page.waitForTimeout(2300)
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
      await page.waitForTimeout(1700)
      rec(`TAIL_${tag} ${route} ` + JSON.stringify(await page.evaluate(tailProbe)))
      await context.close()
    }
  }
  fs.writeFileSync(path.join(OUT, '_log-tail.json'), JSON.stringify(log, null, 2))
  rec('DONE')
} catch (e) {
  console.error('FAIL', e.stack || e); process.exitCode = 1
} finally { await browser.close() }
