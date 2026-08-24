import { chromium } from 'playwright-core'
import fs from 'node:fs'
import path from 'node:path'

const OUT = '/root/clients/salsaflow-w1/worklog/shots/CRITIC-0823-2010'
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
  console.log(`SHOT ${name} ${fs.statSync(fp).size}`)
  return fp
}

async function goto(url, w, h, wait = 250) {
  await page.setViewportSize({ width: w, height: h })
  await page.goto(BASE + url, { waitUntil: 'domcontentloaded', timeout: 20000 })
  if (wait) await page.waitForTimeout(wait)
}

async function scrollY(y) {
  await page.evaluate((yy) => window.scrollTo(0, yy), y)
  await page.waitForTimeout(280)
}

const log = []
function rec(msg) { log.push(msg); console.log(msg) }

try {
  // --- MENU 390 ---
  await goto('/', 390, 844, 500)
  await shot('00-menu-closed-390.png')

  const menuBtn = page.locator('button[aria-controls="mobile-navigation"]').first()
  await menuBtn.click({ force: true, timeout: 8000 })
  await page.waitForTimeout(450)
  const openState = await page.evaluate(() => {
    const b = document.querySelector('button[aria-controls="mobile-navigation"]')
    const acc = document.querySelector('.t-acc')
    const accCs = acc && getComputedStyle(acc)
    const close = b && getComputedStyle(b)
    const br = b?.getBoundingClientRect()
    return {
      label: b?.getAttribute('aria-label'),
      expanded: b?.getAttribute('aria-expanded'),
      btn: b && { bg: close.backgroundColor, radius: close.borderRadius, border: close.border, w: Math.round(br.width), h: Math.round(br.height) },
      acc: acc && {
        cls: acc.className.slice(0, 180),
        bg: accCs.backgroundColor,
        radius: accCs.borderRadius,
        h: Math.round(acc.getBoundingClientRect().height),
        w: Math.round(acc.getBoundingClientRect().width)
      }
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
      const t = (el.getAttribute('aria-label') || el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 48)
      return t ? { t, x: Math.round(r.x), y: Math.round(r.y) } : null
    }).filter(Boolean)
    const b = document.querySelector('button[aria-controls="mobile-navigation"]')
    return { header: b?.getAttribute('aria-label'), expanded: b?.getAttribute('aria-expanded'), items }
  })
  rec('SUB_TANZ ' + JSON.stringify(subState))
  await shot('02-menu-tanzkurse-sub-390.png')

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

  // --- HOME first-paint vs settled ---
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded', timeout: 20000 })
  await page.waitForTimeout(80)
  await shot('home-1440-fold0.png')
  await page.waitForTimeout(1400)
  await shot('home-1440-top.png')

  const homeH = await page.evaluate(() => {
    const h2s = [...document.querySelectorAll('h1,h2,h3')].map(h => h.textContent.trim().replace(/\s+/g, ' ').slice(0, 80))
    return { h2s, scrollH: document.documentElement.scrollHeight }
  })
  rec('HOME_HEADINGS ' + JSON.stringify(homeH))

  await scrollY(700)
  await shot('home-1440-offers.png')
  await scrollY(1400)
  await shot('home-1440-kursplan.png')
  await scrollY(2100)
  await shot('home-1440-path.png')
  await scrollY(2800)
  await shot('home-1440-community.png')
  await scrollY(3600)
  await shot('home-1440-team.png')
  await scrollY(4400)
  await shot('home-1440-events.png')
  await scrollY(5200)
  await shot('home-1440-preise.png')
  await scrollY(6000)
  await shot('home-1440-faq.png')
  await scrollY(6800)
  await shot('home-1440-studios.png')
  await scrollY(7600)
  await shot('home-1440-instagram.png')
  const maxHome = await page.evaluate(() => Math.max(0, document.documentElement.scrollHeight - innerHeight))
  await scrollY(maxHome)
  await shot('home-1440-end.png')

  await scrollY(0)
  const cta = page.locator('a[href="/kursplan"]').filter({ hasText: /Kursplan/ }).first()
  await cta.hover({ force: true }).catch(() => {})
  await page.waitForTimeout(200)
  await shot('home-1440-hover-cta.png')

  await scrollY(1400)
  const row = page.locator('main a').filter({ hasText: /Salsa|Platz sichern|Bachata/ }).first()
  await row.hover({ force: true }).catch(() => {})
  await page.waitForTimeout(250)
  await shot('home-1440-hover-courserow.png')

  // --- EVENTS ---
  await goto('/events', 1440, 900, 900)
  await shot('events-1440-top.png')
  const evH = await page.evaluate(() => [...document.querySelectorAll('h1,h2,h3')].map(h => h.textContent.trim().replace(/\s+/g, ' ').slice(0, 90)))
  rec('EVENTS_HEADINGS ' + JSON.stringify(evH))
  await scrollY(500)
  await shot('events-1440-below-hero.png')
  await scrollY(1100)
  await shot('events-1440-mid.png')
  await scrollY(1800)
  await shot('events-1440-low.png')

  // --- FAQ ---
  await goto('/faq', 1440, 900, 800)
  await shot('faq-1440-fold0.png')
  await scrollY(700)
  await shot('faq-1440-fold1.png')
  await scrollY(1400)
  await shot('faq-1440-fold2.png')
  const maxFaq = await page.evaluate(() => Math.max(0, document.documentElement.scrollHeight - innerHeight))
  await scrollY(maxFaq)
  await shot('faq-1440-end.png')
  const faqDom = await page.evaluate(() => ({
    h1: document.querySelector('h1')?.textContent?.trim(),
    h2: [...document.querySelectorAll('main h2')].map(h => h.textContent.trim().slice(0, 60)),
    imgs: [...document.querySelectorAll('main img')].map(i => ({ alt: i.alt, w: Math.round(i.getBoundingClientRect().width), h: Math.round(i.getBoundingClientRect().height) }))
  }))
  rec('FAQ_DOM ' + JSON.stringify(faqDom))

  // --- PAGES2 ---
  for (const r of ['/tanzkurse', '/team', '/preise']) {
    const slug = r.slice(1)
    await goto(r, 1440, 900, 800)
    await shot(`${slug}-1440-top.png`)
    const hs = await page.evaluate(() => [...document.querySelectorAll('h1,h2,h3')].slice(0, 16).map(h => h.textContent.trim().replace(/\s+/g, ' ').slice(0, 80)))
    rec(`${slug.toUpperCase()}_HEADINGS ` + JSON.stringify(hs))
    await scrollY(700)
    await shot(`${slug}-1440-mid.png`)
    await scrollY(1400)
    await shot(`${slug}-1440-low.png`)
  }

  await goto('/kursplan', 1440, 900, 700)
  await shot('kursplan-1440-top.png')
  await scrollY(400)
  await shot('kursplan-1440-rows.png')

  // --- mobile ---
  for (const r of ['/', '/events', '/faq', '/tanzkurse', '/team', '/preise']) {
    const slug = r === '/' ? 'home' : r.slice(1)
    await goto(r, 390, 844, 600)
    await shot(`${slug}-390-top.png`)
    await scrollY(700)
    await shot(`${slug}-390-mid.png`)
  }
  await goto('/', 360, 800, 500)
  await shot('home-360-top.png')
  await goto('/events', 360, 800, 500)
  await shot('events-360-top.png')

  fs.writeFileSync(path.join(OUT, '_log.json'), JSON.stringify(log, null, 2))
  rec('DONE')
} catch (e) {
  console.error('FAIL', e.stack || e)
  try { await shot('error-state.png') } catch {}
  process.exitCode = 1
} finally {
  await browser.close()
}
