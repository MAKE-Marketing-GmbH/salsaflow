import { chromium } from 'playwright-core'
import fs from 'node:fs'
import path from 'node:path'

const OUT = '/root/clients/salsaflow-w1/worklog/shots/CRITIC-0824-0051'
const BASE = 'http://127.0.0.1:5173'
fs.mkdirSync(OUT, { recursive: true })

const browser = await chromium.launch({
  executablePath: '/usr/bin/google-chrome', headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none']
})
const log = []
function rec(m) { log.push(m); console.log(m) }

async function newPage(w, h, scale = 1) {
  const context = await browser.newContext({ viewport: { width: w, height: h }, locale: 'de-CH', deviceScaleFactor: scale })
  const page = await context.newPage()
  const cdp = await page.context().newCDPSession(page)
  async function shot(name, clip) {
    const { data } = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false, ...(clip ? { clip } : {}) })
    fs.writeFileSync(path.join(OUT, name), Buffer.from(data, 'base64'))
    console.log('SHOT ' + name)
  }
  return { context, page, shot }
}

// air below last hero CTA + air above H1, in one probe
const heroProbe = () => {
  const nav = document.querySelector('header') || document.querySelector('nav')
  const nr = nav?.getBoundingClientRect()
  const h1 = document.querySelector('main h1')
  const hr = h1?.getBoundingClientRect()

  // breadcrumb: the visible text line above the H1, measured on its INK not its tap box
  let crumb = null
  const cand = [...document.querySelectorAll('main nav a, main ol li, main [class*="readcrumb"] a')]
  for (const e of cand) {
    const r = e.getBoundingClientRect()
    if (r.height < 4 || r.top >= (hr?.top ?? 1e9)) continue
    // ink box via Range over the text node
    let inkBottom = r.bottom
    const tn = [...e.childNodes].find(n => n.nodeType === 3 && n.textContent.trim())
    if (tn) {
      const rg = document.createRange(); rg.selectNodeContents(tn)
      const rr = rg.getBoundingClientRect()
      if (rr.height > 0) inkBottom = rr.bottom
    }
    if (!crumb || inkBottom > crumb.inkBottom) {
      crumb = { t: (e.textContent || '').trim().slice(0, 20), boxBottom: Math.round(r.bottom), inkBottom: Math.round(inkBottom), boxH: Math.round(r.height) }
    }
  }

  const ctas = [...document.querySelectorAll('main a,main button')].filter(e => {
    const r = e.getBoundingClientRect()
    return r.y > 60 && r.y < 1400 && r.height > 24 && r.width > 60 && (e.textContent || '').trim().length > 3
  })
  const last = ctas.length ? ctas.map(e => ({ e, r: e.getBoundingClientRect() })).sort((a, b) => b.r.bottom - a.r.bottom)[0] : null
  let next = null
  if (last) {
    const c = [...document.querySelectorAll('main img, main section, main h2, main div[class*="rounded"]')]
      .map(e => ({ e, r: e.getBoundingClientRect() }))
      .filter(o => o.r.top >= last.r.bottom - 1 && o.r.height > 40)
      .sort((a, b) => a.r.top - b.r.top)[0]
    if (c) next = { tag: c.e.tagName, top: Math.round(c.r.top), h: Math.round(c.r.height) }
  }

  const img = document.querySelector('main img')
  const ir = img?.getBoundingClientRect()

  // any text line straddling the photo top edge?
  const cut = ir ? [...document.querySelectorAll('main p, main span, main h1, main h2')].filter(e => {
    if (e.querySelector('p,span,h1,h2')) return false
    const r = e.getBoundingClientRect()
    return r.width > 20 && r.height > 8 && (e.textContent || '').trim() && r.top < ir.top && r.bottom > ir.top + 2
  }).map(e => {
    const r = e.getBoundingClientRect()
    return { t: (e.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40), bottom: Math.round(r.bottom) }
  }) : []

  // nearest text line above the photo, and its clearance
  let nearest = null
  if (ir) {
    const above = [...document.querySelectorAll('main p, main span, main a, main h1, main h2')].filter(e => {
      if (e.querySelector('p,span,a,h1,h2')) return false
      const r = e.getBoundingClientRect()
      return r.width > 20 && r.height > 8 && (e.textContent || '').trim() && r.bottom <= ir.top + 1 && r.bottom > ir.top - 400
    }).map(e => { const r = e.getBoundingClientRect(); return { t: (e.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40), bottom: Math.round(r.bottom) } })
      .sort((a, b) => b.bottom - a.bottom)[0]
    if (above) nearest = { ...above, clearance: Math.round(ir.top - above.bottom) }
  }

  return {
    navBottom: nr && Math.round(nr.bottom),
    h1Top: hr && Math.round(hr.top),
    airNavToH1: nr && hr && Math.round(hr.top - nr.bottom),
    crumb,
    airCrumbInkToH1: crumb && hr && Math.round(hr.top - crumb.inkBottom),
    airCrumbBoxToH1: crumb && hr && Math.round(hr.top - crumb.boxBottom),
    lastCta: last && { t: (last.e.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 26), bottom: Math.round(last.r.bottom) },
    next,
    airBelowCta: last && next ? Math.round(next.top - last.r.bottom) : null,
    img: ir && { top: Math.round(ir.top), h: Math.round(ir.height), objPos: getComputedStyle(img).objectPosition },
    cutLines: cut,
    nearestAbovePhoto: nearest
  }
}

try {
  { const { context, page } = await newPage(1440, 900); await page.goto(BASE + '/', { waitUntil: 'networkidle', timeout: 25000 }); await context.close() }

  // --- 1) /mehr/partys after builder R215 ---
  for (const [w, h, tag] of [[1440, 900, '1440'], [1440, 730, '1440x730'], [768, 1024, '768'], [390, 844, '390']]) {
    const { context, page, shot } = await newPage(w, h)
    await page.goto(BASE + '/mehr/partys', { waitUntil: 'domcontentloaded', timeout: 20000 })
    await page.waitForTimeout(2600)   // past the reveal, so opacity is settled
    rec(`PARTYS_${tag} ` + JSON.stringify(await page.evaluate(heroProbe)))
    await shot(`partys-${tag}-hero.png`)
    await context.close()
  }

  // crumb/H1 zoom to settle the -7 vs +4 dispute visually
  {
    const { context, page, shot } = await newPage(1440, 900, 2)
    await page.goto(BASE + '/mehr/partys', { waitUntil: 'domcontentloaded', timeout: 20000 })
    await page.waitForTimeout(2600)
    await shot('partys-crumb-zoom.png', { x: 40, y: 70, width: 620, height: 130, scale: 1 })
    const y = await page.evaluate(() => {
      const img = document.querySelector('main img')
      return Math.max(0, Math.round(img.getBoundingClientRect().top) - 120)
    })
    await shot('partys-ctaband-zoom.png', { x: 40, y, width: 700, height: 200, scale: 1 })
    await context.close()
  }

  // --- 2) sibling heroes, same probe, for the rhythm comparison ---
  for (const route of ['/events', '/team', '/preise', '/tanzkurse', '/fotos', '/kontakt', '/']) {
    const { context, page } = await newPage(1440, 900)
    const resp = await page.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 20000 }).catch(() => null)
    if (!resp || resp.status() >= 400) { await context.close(); continue }
    await page.waitForTimeout(2400)
    const p = await page.evaluate(heroProbe)
    rec(`SIB_1440 ${route} ` + JSON.stringify({ airNavToH1: p.airNavToH1, airBelowCta: p.airBelowCta, imgTop: p.img?.top, imgH: p.img?.h }))
    await context.close()
  }
  for (const route of ['/events', '/team', '/tanzkurse']) {
    const { context, page } = await newPage(390, 844)
    await page.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 20000 })
    await page.waitForTimeout(2400)
    const p = await page.evaluate(heroProbe)
    rec(`SIB_390 ${route} ` + JSON.stringify({ airNavToH1: p.airNavToH1, airBelowCta: p.airBelowCta, nearest: p.nearestAbovePhoto }))
    await context.close()
  }

  // --- 3) FAQ hero: the second-row candidate ---
  for (const [w, h, tag] of [[1440, 900, '1440'], [390, 844, '390']]) {
    const { context, page, shot } = await newPage(w, h)
    await page.goto(BASE + '/faq', { waitUntil: 'domcontentloaded', timeout: 20000 })
    await page.waitForTimeout(2500)
    const f = await page.evaluate(() => {
      const h1 = document.querySelector('main h1')
      const hr = h1.getBoundingClientRect()
      const sec = h1.closest('section')
      const sr = sec.getBoundingClientRect()
      // ink in the right half within the hero section
      const right = [...sec.querySelectorAll('*')].filter(e => {
        if (e.children.length) return false
        const r = e.getBoundingClientRect()
        return r.width > 4 && r.height > 4 && r.x >= 750 && r.top < sr.bottom && r.bottom > hr.top
      }).map(e => { const r = e.getBoundingClientRect(); return { tag: e.tagName, t: (e.textContent || '').trim().slice(0, 24), x: Math.round(r.x), y: Math.round(r.y) } }).sort((a, b) => a.y - b.y)
      return {
        h1: (h1.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 46),
        h1Top: Math.round(hr.top), h1Width: Math.round(hr.width),
        secTop: Math.round(sr.top), secH: Math.round(sr.height),
        rightInkCount: right.length, rightInk: right.slice(0, 5)
      }
    })
    rec(`FAQ_${tag} ` + JSON.stringify(f))
    await shot(`faq-${tag}-hero.png`)
    await context.close()
  }

  fs.writeFileSync(path.join(OUT, '_log.json'), JSON.stringify(log, null, 2))
  rec('DONE')
} catch (e) {
  console.error('FAIL', e.stack || e); process.exitCode = 1
} finally { await browser.close() }
