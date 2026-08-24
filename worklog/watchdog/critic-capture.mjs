import { chromium } from 'playwright-core'
import fs from 'node:fs'
import path from 'node:path'

const OUT = '/root/clients/salsaflow-w1/worklog/shots/CRITIC-0823'
const BASE = 'http://127.0.0.1:5173'
fs.mkdirSync(OUT, { recursive: true })

const browser = await chromium.launch({
  executablePath: '/usr/bin/google-chrome',
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none']
})
const context = await browser.newContext({ deviceScaleFactor: 1, locale: 'de-CH' })
const page = await context.newPage()
let cdp = await page.context().newCDPSession(page)

async function shot(name) {
  const { data } = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false })
  const fp = path.join(OUT, name)
  fs.writeFileSync(fp, Buffer.from(data, 'base64'))
  const st = fs.statSync(fp)
  console.log(`SHOT ${name} ${st.size}`)
  return fp
}

async function goto(url, w, h) {
  await page.setViewportSize({ width: w, height: h })
  await page.goto(BASE + url, { waitUntil: 'domcontentloaded', timeout: 20000 })
  await page.waitForTimeout(700)
}

async function scrollY(y) {
  await page.evaluate((yy) => window.scrollTo(0, yy), y)
  await page.waitForTimeout(350)
}

const log = []
function rec(msg) { log.push(msg); console.log(msg) }

try {
  // --- MENU 390 ---
  await goto('/', 390, 844)
  await shot('00-menu-closed-390.png')

  const menuBtn = page.locator('button[aria-controls="mobile-navigation"]').first()
  await menuBtn.click({ force: true, timeout: 8000 })
  await page.waitForTimeout(400)
  const openState = await page.evaluate(() => {
    const b = document.querySelector('button[aria-controls="mobile-navigation"]')
    const acc = document.querySelector('.t-acc')
    const accCs = acc && getComputedStyle(acc)
    const wa = [...document.querySelectorAll('a')].filter(a => /wa\.me/.test(a.href)).map(a => {
      const r = a.getBoundingClientRect(); const s = getComputedStyle(a)
      return { y: Math.round(r.y), z: s.zIndex, pos: s.position, w: Math.round(r.width) }
    })
    return {
      label: b?.getAttribute('aria-label'),
      expanded: b?.getAttribute('aria-expanded'),
      acc: acc && {
        cls: acc.className.slice(0, 160),
        bg: accCs.backgroundColor,
        radius: accCs.borderRadius,
        h: Math.round(acc.getBoundingClientRect().height),
        w: Math.round(acc.getBoundingClientRect().width)
      },
      wa
    }
  })
  rec('MENU_OPEN ' + JSON.stringify(openState))
  await shot('01-menu-open-390.png')

  const tanz = page.locator('#mobile-navigation button', { hasText: 'Tanzkurse' }).first()
  await tanz.click({ force: true, timeout: 8000 })
  await page.waitForTimeout(450)
  const subState = await page.evaluate(() => {
    const items = [...document.querySelectorAll('a, button')].map(el => {
      const r = el.getBoundingClientRect()
      if (r.width < 8 || r.height < 8 || r.y > innerHeight || r.y + r.height < 0) return null
      const t = (el.getAttribute('aria-label') || el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40)
      return t ? { t, x: Math.round(r.x), y: Math.round(r.y) } : null
    }).filter(Boolean)
    const b = document.querySelector('button[aria-controls="mobile-navigation"]')
    return { header: b?.getAttribute('aria-label'), expanded: b?.getAttribute('aria-expanded'), items }
  })
  rec('SUB_TANZ ' + JSON.stringify(subState))
  await shot('02-menu-tanzkurse-sub-390.png')

  // back then Events sub
  await page.keyboard.press('Escape')
  await page.waitForTimeout(250)
  await menuBtn.click({ force: true }).catch(() => {})
  await page.waitForTimeout(300)
  const events = page.locator('#mobile-navigation button', { hasText: /^Events$/ }).first()
  if (await events.count()) {
    await events.click({ force: true })
    await page.waitForTimeout(400)
    await shot('02b-menu-events-sub-390.png')
  }

  // --- HOME desktop folds + hover ---
  await goto('/', 1440, 900)
  await shot('home-1440-fold0.png')
  await scrollY(720)
  await shot('home-1440-fold1-offers.png')
  await scrollY(1500)
  await shot('home-1440-fold2-kursplan.png')
  await scrollY(2400)
  await shot('home-1440-fold3.png')

  // hover primary CTA
  await scrollY(0)
  const cta = page.locator('a[href="/kursplan"]').filter({ hasText: /Kursplan/ }).first()
  await cta.hover({ force: true }).catch(() => {})
  await page.waitForTimeout(250)
  await shot('home-1440-hover-cta.png')

  // hover course row
  await scrollY(1500)
  const row = page.locator('a[href*="/kursplan"]').filter({ hasText: /Salsa|Bachata|Heels|Platz/ }).first()
  await row.hover({ force: true }).catch(() => {})
  await page.waitForTimeout(250)
  await shot('home-1440-hover-courserow.png')
  const rowHover = await page.evaluate(() => {
    const el = document.querySelector('a[href*="/kursplan?"]') || document.querySelector('main a[href*="kursplan"]')
    if (!el) return null
    const s = getComputedStyle(el)
    return { bg: s.backgroundColor, color: s.color, href: el.getAttribute('href'), text: el.textContent.trim().slice(0, 80) }
  })
  rec('ROW_HOVER ' + JSON.stringify(rowHover))

  // hover WA
  const wa = page.locator('a[href*="wa.me"]').last()
  await wa.hover({ force: true }).catch(() => {})
  await page.waitForTimeout(200)
  await shot('home-1440-hover-wa.png')

  // hover nav
  await scrollY(0)
  const navK = page.locator('header a[href="/kursplan"]').first()
  await navK.hover({ force: true }).catch(() => {})
  await page.waitForTimeout(200)
  await shot('home-1440-hover-nav.png')

  // animation: scroll into offers with motion ON
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(200)
  await page.evaluate(() => window.scrollTo({ top: 780, behavior: 'instant' }))
  await shot('home-1440-motion-t0.png')
  await page.waitForTimeout(650)
  await shot('home-1440-motion-t650.png')

  // --- FAQ desktop ---
  await goto('/faq', 1440, 900)
  await shot('faq-1440-fold0.png')
  await scrollY(700)
  await shot('faq-1440-fold1.png')
  await scrollY(1400)
  await shot('faq-1440-fold2.png')
  const faqDom = await page.evaluate(() => {
    const h1 = document.querySelector('h1')?.textContent?.trim()
    const sections = [...document.querySelectorAll('main h2, main h3')].slice(0, 20).map(h => h.textContent.trim().slice(0, 60))
    const imgs = [...document.querySelectorAll('main img')].map(i => ({ alt: i.alt, w: i.naturalWidth, h: i.naturalHeight }))
    const cream = [...document.querySelectorAll('main *')].filter(el => {
      const bg = getComputedStyle(el).backgroundColor
      return /251,\s*250,\s*248|250,\s*247|paper-warm/.test(bg) && el.getBoundingClientRect().width > 280
    }).slice(0, 8).map(el => ({ cls: el.className?.toString?.().slice(0,80), bg: getComputedStyle(el).backgroundColor, w: Math.round(el.getBoundingClientRect().width) }))
    return { h1, sections, imgs: imgs.slice(0, 12), cream }
  })
  rec('FAQ_DOM ' + JSON.stringify(faqDom))

  const routes = ['/', '/kursplan', '/events', '/tanzkurse', '/tanzkurse/salsa', '/faq', '/team', '/preise', '/fotos', '/kontakt', '/buchung']

  for (const r of routes) {
    const slug = r === '/' ? 'home' : r.replace(/^\//, '').replace(/\//g, '-')
    await goto(r, 1440, 900)
    await shot(`${slug}-1440-top.png`)
    const max = await page.evaluate(() => Math.max(0, document.documentElement.scrollHeight - innerHeight))
    if (max > 500) {
      await scrollY(Math.min(900, max))
      await shot(`${slug}-1440-mid.png`)
    }
    if (max > 1600) {
      await scrollY(Math.min(1800, max))
      await shot(`${slug}-1440-low.png`)
    }
  }

  for (const r of routes) {
    const slug = r === '/' ? 'home' : r.replace(/^\//, '').replace(/\//g, '-')
    await goto(r, 390, 844)
    await shot(`${slug}-390-top.png`)
    const max = await page.evaluate(() => Math.max(0, document.documentElement.scrollHeight - innerHeight))
    if (max > 600) {
      await scrollY(Math.min(800, max))
      await shot(`${slug}-390-mid.png`)
    }
  }

  for (const r of ['/', '/kursplan', '/faq', '/events', '/preise']) {
    const slug = r === '/' ? 'home' : r.replace(/^\//, '')
    await goto(r, 360, 800)
    await shot(`${slug}-360-top.png`)
  }

  // kursplan vs home course row 1440
  await goto('/kursplan', 1440, 900)
  await scrollY(400)
  await shot('kursplan-1440-rows.png')
  const kRow = page.locator('a[href*="kursplan"], main a').filter({ hasText: /Platz|Salsa|Bachata/ }).first()
  await kRow.hover({ force: true }).catch(() => {})
  await page.waitForTimeout(250)
  await shot('kursplan-1440-hover-row.png')

  // mobile hover/tap CTA
  await goto('/', 390, 844)
  const mCta = page.locator('a[href="/kursplan"]').filter({ hasText: /Kursplan/ }).first()
  await mCta.hover({ force: true }).catch(() => {})
  await page.waitForTimeout(200)
  await shot('home-390-hover-cta.png')
  const mWa = page.locator('a[href*="wa.me"]').last()
  await mWa.hover({ force: true }).catch(() => {})
  await page.waitForTimeout(150)
  await shot('home-390-hover-wa.png')

  fs.writeFileSync(path.join(OUT, '_log.json'), JSON.stringify(log, null, 2))
  rec('DONE')
} catch (e) {
  console.error('FAIL', e.stack || e)
  try { await shot('error-state.png') } catch {}
  process.exitCode = 1
} finally {
  await browser.close()
}
