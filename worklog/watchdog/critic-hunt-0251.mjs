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

// A) images: broken, missing alt, or wrong aspect (squashed/stretched)
const imgProbe = () => {
  const out = []
  for (const img of document.querySelectorAll('main img')) {
    const r = img.getBoundingClientRect()
    if (r.width < 20 || r.height < 20) continue
    const nw = img.naturalWidth, nh = img.naturalHeight
    const cs = getComputedStyle(img)
    const boxAR = r.width / r.height
    const natAR = nw && nh ? nw / nh : null
    const skew = natAR && cs.objectFit === 'fill' ? Math.abs(boxAR / natAR - 1) : 0
    out.push({
      src: (img.currentSrc || img.src || '').split('/').pop().slice(0, 40),
      broken: img.complete && nw === 0,
      alt: img.alt ? img.alt.slice(0, 30) : '(leer)', hasAlt: img.hasAttribute('alt'),
      nat: nw && nh ? `${nw}x${nh}` : null, box: `${Math.round(r.width)}x${Math.round(r.height)}`,
      fit: cs.objectFit, skew: +skew.toFixed(2),
      upscale: nw ? +(r.width * (window.devicePixelRatio || 1) / nw).toFixed(2) : null,
      loading: img.loading
    })
  }
  return out
}

// B) buttons/links: same label pointing at different targets, or empty accessible name
const ctaProbe = () => {
  const rows = []
  for (const a of document.querySelectorAll('main a,main button')) {
    const r = a.getBoundingClientRect()
    if (r.width < 8 || r.height < 8) continue
    const label = (a.innerText || a.textContent || '').trim().replace(/\s+/g, ' ')
    const aria = a.getAttribute('aria-label')
    rows.push({
      label: label.slice(0, 44), aria, href: a.getAttribute('href'),
      empty: !label && !aria && !a.querySelector('img,svg[aria-label],title'),
      h: Math.round(r.height), w: Math.round(r.width),
      tiny: r.height < 32 && (a.tagName === 'BUTTON' || /^\/|^https?:/.test(a.getAttribute('href') || ''))
    })
  }
  const byLabel = {}
  for (const r of rows) if (r.label && r.href) (byLabel[r.label] ||= new Set()).add(r.href)
  const conflicting = Object.entries(byLabel).filter(([, s]) => s.size > 1).map(([k, s]) => ({ label: k, targets: [...s] }))
  return { total: rows.length, empty: rows.filter(r => r.empty).length, emptyList: rows.filter(r => r.empty).slice(0, 5), tinyTargets: rows.filter(r => r.tiny).slice(0, 6), conflicting }
}

// C) headings: level skips and duplicate H1
const headProbe = () => {
  const hs = [...document.querySelectorAll('main h1,main h2,main h3,main h4')].map(e => ({ lvl: +e.tagName[1], t: (e.textContent || '').trim().slice(0, 34) }))
  const skips = []
  for (let i = 1; i < hs.length; i++) if (hs[i].lvl - hs[i - 1].lvl > 1) skips.push({ from: hs[i - 1].lvl, to: hs[i].lvl, t: hs[i].t })
  return { h1: hs.filter(h => h.lvl === 1).length, h1text: hs.filter(h => h.lvl === 1).map(h => h.t), skips }
}

// D) document title + meta description per route
const metaProbe = () => ({
  title: document.title, titleLen: document.title.length,
  desc: (document.querySelector('meta[name="description"]')?.content || '').slice(0, 90),
  descLen: (document.querySelector('meta[name="description"]')?.content || '').length,
  lang: document.documentElement.lang,
  canonical: document.querySelector('link[rel=canonical]')?.href || null
})

const ROUTES = ['/', '/tanzkurse', '/kursplan', '/preise', '/events', '/team', '/fotos', '/faq', '/schnupperstunde', '/kontakt', '/mehr/partys', '/mehr/tanzschuhe', '/kontakt/standort-raumvermietung']

try {
  for (const route of ROUTES) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'de-CH', deviceScaleFactor: 1 })
    const page = await context.newPage()
    const resp = await page.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 20000 }).catch(() => null)
    if (!resp || resp.status() >= 400) { await context.close(); continue }
    await page.waitForTimeout(2300)
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(1800)
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForTimeout(600)

    const imgs = await page.evaluate(imgProbe)
    const bad = imgs.filter(i => i.broken || !i.hasAlt || i.skew > 0.08 || (i.upscale && i.upscale > 1.6))
    rec(`IMG ${route} n=${imgs.length} bad=${bad.length} ` + JSON.stringify(bad.slice(0, 5)))
    rec(`CTA ${route} ` + JSON.stringify(await page.evaluate(ctaProbe)))
    rec(`HEAD ${route} ` + JSON.stringify(await page.evaluate(headProbe)))
    rec(`META ${route} ` + JSON.stringify(await page.evaluate(metaProbe)))
    await context.close()
  }
  fs.writeFileSync(path.join(OUT, '_log-hunt.json'), JSON.stringify(log, null, 2))
  rec('DONE')
} catch (e) {
  console.error('FAIL', e.stack || e); process.exitCode = 1
} finally { await browser.close() }
