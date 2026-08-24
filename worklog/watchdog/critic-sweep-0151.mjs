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

const ROUTES = ['/', '/tanzkurse', '/kursplan', '/preise', '/events', '/team', '/fotos', '/faq', '/kontakt',
  '/schnupperstunde', '/mehr/partys', '/mehr/tanzschuhe', '/kontakt/standort-raumvermietung']

// overlaps, off-canvas ink, tiny text, dead bottoms — the whole page, not just the hero
const pageProbe = () => {
  const docW = document.documentElement.clientWidth
  const all = [...document.querySelectorAll('main *')].filter(e => {
    if (e.children.length) return false
    const r = e.getBoundingClientRect()
    return r.width > 3 && r.height > 3 && (e.textContent || '').trim()
  })
  const boxes = all.map(e => {
    const r = e.getBoundingClientRect()
    const cs = getComputedStyle(e)
    return {
      e, t: (e.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40),
      x: r.x, right: r.right, y: r.y + window.scrollY, bottom: r.bottom + window.scrollY,
      w: r.width, h: r.height, fs: parseFloat(cs.fontSize), tag: e.tagName
    }
  })

  // ink beyond the right viewport edge => horizontal overflow
  const overflow = boxes.filter(b => b.right > docW + 1)
    .map(b => ({ t: b.t, right: Math.round(b.right), over: Math.round(b.right - docW), tag: b.tag }))

  // text smaller than 12px
  const tiny = boxes.filter(b => b.fs > 0 && b.fs < 12)
    .map(b => ({ t: b.t, fs: b.fs, tag: b.tag }))

  // two text boxes that overlap by more than 3px in both axes
  const collide = []
  for (let i = 0; i < boxes.length; i++) {
    for (let j = i + 1; j < boxes.length; j++) {
      const a = boxes[i], b = boxes[j]
      if (a.e.contains(b.e) || b.e.contains(a.e)) continue
      const ox = Math.min(a.right, b.right) - Math.max(a.x, b.x)
      const oy = Math.min(a.bottom, b.bottom) - Math.max(a.y, b.y)
      if (ox > 3 && oy > 3) collide.push({ a: a.t, b: b.t, ox: Math.round(ox), oy: Math.round(oy), y: Math.round(a.y) })
      if (collide.length > 6) return { docW, overflow, tiny, collide, truncated: true }
    }
  }
  return { docW, overflow, tiny, collide }
}

// section rhythm: gap between consecutive top-level sections
const rhythmProbe = () => {
  const secs = [...document.querySelectorAll('main > section, main > div > section')]
  const out = []
  let prev = null
  for (const s of secs) {
    const r = s.getBoundingClientRect()
    const top = Math.round(r.top + window.scrollY), bottom = Math.round(r.bottom + window.scrollY)
    const label = (s.querySelector('h2, h1')?.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 28)
    out.push({ label, top, h: Math.round(r.height), gapFromPrev: prev === null ? null : top - prev })
    prev = bottom
  }
  return out
}

try {
  for (const [w, h, tag] of [[1440, 900, '1440'], [390, 844, '390']]) {
    for (const route of ROUTES) {
      const context = await browser.newContext({ viewport: { width: w, height: h }, locale: 'de-CH', deviceScaleFactor: 1 })
      const page = await context.newPage()
      const resp = await page.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 20000 }).catch(() => null)
      if (!resp || resp.status() >= 400) { rec(`MISS ${tag} ${route} status=${resp ? resp.status() : 'null'}`); await context.close(); continue }
      await page.waitForTimeout(2300)
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
      await page.waitForTimeout(1600)
      await page.evaluate(() => window.scrollTo(0, 0))
      await page.waitForTimeout(700)
      const p = await page.evaluate(pageProbe)
      const flags = []
      if (p.overflow.length) flags.push(`OVERFLOW ${p.overflow.length} ${JSON.stringify(p.overflow.slice(0, 3))}`)
      if (p.tiny.length) flags.push(`TINY ${p.tiny.length} ${JSON.stringify(p.tiny.slice(0, 3))}`)
      if (p.collide.length) flags.push(`COLLIDE ${p.collide.length} ${JSON.stringify(p.collide.slice(0, 3))}`)
      rec(`SWEEP_${tag} ${route} ` + (flags.length ? flags.join(' | ') : 'clean'))
      if (tag === '1440') rec(`RHYTHM ${route} ` + JSON.stringify(await page.evaluate(rhythmProbe)))
      await context.close()
    }
  }
  fs.writeFileSync(path.join(OUT, '_log-sweep.json'), JSON.stringify(log, null, 2))
  rec('DONE')
} catch (e) {
  console.error('FAIL', e.stack || e); process.exitCode = 1
} finally { await browser.close() }
