import { chromium } from 'playwright-core'
import fs from 'node:fs'
import path from 'node:path'

const OUT = '/root/clients/salsaflow-w1/worklog/shots/CRITIC-0823-2316'
const BASE = 'http://127.0.0.1:5173'
fs.mkdirSync(OUT, { recursive: true })

const browser = await chromium.launch({
  executablePath: '/usr/bin/google-chrome',
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none']
})

const log = []
function rec(m) { log.push(m); console.log(m) }

async function newPage(w, h) {
  const context = await browser.newContext({ deviceScaleFactor: 1, locale: 'de-CH', viewport: { width: w, height: h } })
  const page = await context.newPage()
  const cdp = await page.context().newCDPSession(page)
  async function shot(name) {
    const { data } = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false })
    fs.writeFileSync(path.join(OUT, name), Buffer.from(data, 'base64'))
    console.log('SHOT ' + name)
  }
  return { context, page, shot }
}

// air above H1 = H1 top minus navbar bottom; air below = last hero CTA bottom to next block
async function heroAir(page) {
  return page.evaluate(() => {
    const nav = document.querySelector('header') || document.querySelector('nav')
    const navR = nav?.getBoundingClientRect()
    const h1 = document.querySelector('main h1')
    const h1R = h1?.getBoundingClientRect()
    const ctas = [...document.querySelectorAll('main a,main button')].filter(e => {
      const b = e.getBoundingClientRect()
      return b.y > 60 && b.y < 1100 && b.height > 24 && b.width > 60 && (e.textContent || '').trim().length > 3
    })
    const last = ctas.length ? ctas.map(e => e.getBoundingClientRect()).sort((a, b) => b.bottom - a.bottom)[0] : null
    let next = null
    if (last) {
      const c = [...document.querySelectorAll('main img, main section, main h2, main div[class*="rounded"]')]
        .map(e => ({ e, r: e.getBoundingClientRect() }))
        .filter(o => o.r.top >= last.bottom - 1 && o.r.height > 40)
        .sort((a, b) => a.r.top - b.r.top)[0]
      if (c) next = { tag: c.e.tagName, top: Math.round(c.r.top) }
    }
    return {
      nav: navR && { bottom: Math.round(navR.bottom), h: Math.round(navR.height) },
      h1: h1R && { t: h1.textContent.trim().slice(0, 40), top: Math.round(h1R.top), bottom: Math.round(h1R.bottom) },
      airAbove: navR && h1R ? Math.round(h1R.top - navR.bottom) : null,
      navOverlapsH1: navR && h1R ? h1R.top < navR.bottom : null,
      lastCtaBottom: last && Math.round(last.bottom),
      next,
      airBelow: last && next ? Math.round(next.top - last.bottom) : null
    }
  })
}

try {
  { const { context, page } = await newPage(1440, 900); await page.goto(BASE + '/team', { waitUntil: 'networkidle', timeout: 25000 }); await page.waitForTimeout(250); await context.close() }

  // --- 1) Ueber-uns claim: air above/below, all viewports ---
  for (const [w, h, tag] of [[1440, 900, '1440'], [1440, 730, '1440x730'], [390, 844, '390']]) {
    const { context, page, shot } = await newPage(w, h)
    await page.goto(BASE + '/team', { waitUntil: 'domcontentloaded', timeout: 20000 })
    await page.waitForTimeout(900)
    await shot(`ueberuns-${tag}-fold0.png`)
    rec(`UEBERUNS_${tag} ` + JSON.stringify(await heroAir(page)))
    await context.close()
  }

  // --- 2) Cross-check: same air metric on every primary route (find worst offender) ---
  const routes = ['/', '/kursplan', '/tanzkurse', '/events', '/preise', '/faq', '/fotos', '/kontakt']
  for (const route of routes) {
    const tag = route === '/' ? 'home' : route.replace(/\//g, '')
    const { context, page, shot } = await newPage(1440, 900)
    const resp = await page.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 20000 }).catch(() => null)
    if (!resp || resp.status() >= 400) { rec(`${tag.toUpperCase()}_STATUS ${resp?.status()}`); await context.close(); continue }
    await page.waitForTimeout(850)
    rec(`AIR_${tag}_1440 ` + JSON.stringify(await heroAir(page)))
    await shot(`${tag}-1440-fold0.png`)
    await context.close()
  }

  // --- 3) Routes never captured by any critic pass: /fotos /kontakt /kursplan deep ---
  for (const [route, tag] of [['/fotos', 'fotos'], ['/kontakt', 'kontakt'], ['/kursplan', 'kursplan']]) {
    const { context, page, shot } = await newPage(1440, 900)
    const resp = await page.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 20000 }).catch(() => null)
    if (!resp || resp.status() >= 400) { await context.close(); continue }
    await page.waitForTimeout(900)
    const p = await page.evaluate(() => ({
      hs: [...document.querySelectorAll('main h1,main h2,main h3')].slice(0, 16).map(h => ({ tag: h.tagName, t: (h.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 60), y: Math.round(h.getBoundingClientRect().y) })),
      imgCount: document.querySelectorAll('main img').length,
      iframes: [...document.querySelectorAll('iframe')].map(f => (f.src || '').slice(0, 70)),
      hrs: document.querySelectorAll('main hr').length,
      scrollH: document.documentElement.scrollHeight
    }))
    rec(`${tag.toUpperCase()}_DOM ` + JSON.stringify(p))
    for (const y of [900, 1900]) {
      await page.evaluate(yy => window.scrollTo(0, yy), y)
      await page.waitForTimeout(300)
      await shot(`${tag}-1440-y${y}.png`)
    }
    await context.close()

    const { context: c2, page: p2, shot: s2 } = await newPage(390, 844)
    await p2.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 20000 })
    await p2.waitForTimeout(800)
    await s2(`${tag}-390-fold0.png`)
    await c2.close()
  }

  // --- 4) Home: Maps + Instagram embed claim (Raphael walkthrough) ---
  {
    const { context, page, shot } = await newPage(1440, 900)
    await page.goto(BASE + '/', { waitUntil: 'domcontentloaded', timeout: 20000 })
    await page.waitForTimeout(1200)
    const emb = await page.evaluate(() => {
      const iframes = [...document.querySelectorAll('iframe')].map(f => ({ src: (f.src || '').slice(0, 80), y: Math.round(f.getBoundingClientRect().y), h: Math.round(f.getBoundingClientRect().height) }))
      const igSec = [...document.querySelectorAll('section')].find(s => /Instagram/i.test(s.textContent || ''))
      const mapSec = [...document.querySelectorAll('section')].find(s => /Studio/i.test(s.textContent || '') && /Basel/i.test(s.textContent || ''))
      return {
        iframes,
        igY: igSec && Math.round(igSec.getBoundingClientRect().y + scrollY),
        igHasIframe: igSec ? !!igSec.querySelector('iframe, blockquote.instagram-media') : null,
        mapY: mapSec && Math.round(mapSec.getBoundingClientRect().y + scrollY),
        mapHasIframe: mapSec ? !!mapSec.querySelector('iframe') : null
      }
    })
    rec('HOME_EMBEDS ' + JSON.stringify(emb))
    if (emb.mapY) { await page.evaluate(y => window.scrollTo(0, y - 100), emb.mapY); await page.waitForTimeout(500); await shot('home-1440-studios.png') }
    if (emb.igY) { await page.evaluate(y => window.scrollTo(0, y - 100), emb.igY); await page.waitForTimeout(500); await shot('home-1440-instagram.png') }
    await context.close()
  }

  fs.writeFileSync(path.join(OUT, '_log.json'), JSON.stringify(log, null, 2))
  rec('DONE')
} catch (e) {
  console.error('FAIL', e.stack || e)
  process.exitCode = 1
} finally {
  await browser.close()
}
