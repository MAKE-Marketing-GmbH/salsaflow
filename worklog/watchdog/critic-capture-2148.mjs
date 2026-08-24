import { chromium } from 'playwright-core'
import fs from 'node:fs'
import path from 'node:path'

const OUT = '/root/clients/salsaflow-w1/worklog/shots/CRITIC-0823-2148'
const BASE = 'http://127.0.0.1:5173'
fs.mkdirSync(OUT, { recursive: true })

const browser = await chromium.launch({
  executablePath: '/usr/bin/google-chrome',
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none']
})

const log = []
function rec(msg) { log.push(msg); console.log(msg) }

async function newPage(w, h) {
  const context = await browser.newContext({
    deviceScaleFactor: 1,
    locale: 'de-CH',
    viewport: { width: w, height: h }
  })
  const page = await context.newPage()
  const cdp = await page.context().newCDPSession(page)
  async function shot(name) {
    const { data } = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false })
    const fp = path.join(OUT, name)
    fs.writeFileSync(fp, Buffer.from(data, 'base64'))
    console.log(`SHOT ${name} ${fs.statSync(fp).size}`)
    return fp
  }
  return { context, page, shot }
}

function ov(a, b) {
  if (!a || !b) return false
  return !(a.x + a.w < b.x || b.x + b.w < a.x || a.y + a.h < b.y || b.y + b.h < a.y)
}

async function measureCookie(page) {
  return page.evaluate(() => {
    const cookieBtn = [...document.querySelectorAll('button')].find(b => /Akzeptieren/.test(b.textContent || ''))
    let barR = null
    let el = cookieBtn
    while (el) {
      const r = el.getBoundingClientRect()
      if (r.width > 200 && r.height > 36 && r.height < 220 && r.y > 80) {
        barR = { y: Math.round(r.y), h: Math.round(r.height), x: Math.round(r.x), w: Math.round(r.width), bottom: Math.round(r.bottom) }
        break
      }
      el = el.parentElement
    }
    const r = (n) => {
      if (!n) return null
      const b = n.getBoundingClientRect()
      if (b.width < 4 || b.height < 4) return null
      return { y: Math.round(b.y), h: Math.round(b.height), x: Math.round(b.x), w: Math.round(b.width), bottom: Math.round(b.bottom) }
    }
    const schn = [...document.querySelectorAll('a')].find(a => /Schnupperstunde buchen/.test(a.textContent || ''))
    const heroCta = [...document.querySelectorAll('a')].find(a => /Kursplan ansehen/.test(a.textContent || '') && a.getBoundingClientRect().y > 80 && a.getBoundingClientRect().height > 20)
    const trust = [...document.querySelectorAll('span,p,div,li')].find(n => {
      const t = (n.textContent || '').replace(/\s+/g, ' ')
      return /4,9/.test(t) && t.length < 160 && n.getBoundingClientRect().height < 80 && n.getBoundingClientRect().width > 40
    })
    const waFab = [...document.querySelectorAll('a')].find(a => /wa\.me/.test(a.href || '') && a.getBoundingClientRect().width > 40 && a.getBoundingClientRect().y > 100 && a.getBoundingClientRect().y < innerHeight)
    const ov = (a, b) => a && b && !(a.x + a.w < b.x || b.x + b.w < a.x || a.y + a.h < b.y || b.y + b.h < a.y)
    const S = r(schn), C = r(heroCta), T = r(trust), W = r(waFab)
    return {
      vh: innerHeight,
      vw: innerWidth,
      cookie: barR,
      schnupper: S,
      heroCta: C,
      trust: T,
      wa: W,
      cookieOverSchnupper: ov(barR, S),
      cookieOverHeroCta: ov(barR, C),
      cookieOverTrust: ov(barR, T),
      waOverCookie: ov(W, barR),
      trustText: trust && (trust.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 90)
    }
  })
}

try {
  // Warm
  {
    const { context, page } = await newPage(1440, 900)
    await page.goto(BASE + '/', { waitUntil: 'networkidle', timeout: 25000 })
    await page.waitForTimeout(300)
    await context.close()
  }

  async function cookieShot(w, h, name) {
    const { context, page, shot } = await newPage(w, h)
    await page.goto(BASE + '/', { waitUntil: 'domcontentloaded', timeout: 20000 })
    await page.waitForTimeout(1100)
    const m = await measureCookie(page)
    rec(`${name} ` + JSON.stringify(m))
    await shot(name)
    await context.close()
    return m
  }

  await cookieShot(390, 844, 'home-390-cookie.png')
  await cookieShot(360, 800, 'home-360-cookie.png')
  await cookieShot(1440, 730, 'home-1440x730-cookie.png')
  await cookieShot(1440, 800, 'home-1440x800-cookie.png')
  await cookieShot(1440, 900, 'home-1440x900-cookie.png')
  await cookieShot(1024, 700, 'home-1024x700-cookie.png')

  // Events hero + bar after hero
  {
    const { context, page, shot } = await newPage(1440, 900)
    await page.goto(BASE + '/events', { waitUntil: 'domcontentloaded', timeout: 20000 })
    await page.waitForTimeout(900)
    await shot('events-1440-top.png')
    const ev = await page.evaluate(() => {
      const hs = [...document.querySelectorAll('h1,h2,h3')].map(h => (h.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 90))
      const bar = [...document.querySelectorAll('section,div,ul,p')].filter(el => {
        const t = (el.textContent || '').replace(/\s+/g, ' ')
        return /1\.3\.5|DJs|Basel SBB/.test(t) && t.length < 220
      }).slice(0, 6).map(el => ({ t: (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 120), tag: el.tagName, y: Math.round(el.getBoundingClientRect().y) }))
      const btns = [...document.querySelectorAll('a,button')].filter(el => {
        const r = el.getBoundingClientRect()
        return r.y > 80 && r.y < 700 && r.width > 40 && /Workshop|Event|Kurs|Ticket|Ansehen|Mehr/i.test(el.textContent || '')
      }).slice(0, 8).map(el => {
        const r = el.getBoundingClientRect()
        return { t: (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40), y: Math.round(r.y), h: Math.round(r.height), bottom: Math.round(r.bottom) }
      })
      return { hs, bar, btns }
    })
    rec('EVENTS_DOM ' + JSON.stringify(ev))
    await page.evaluate(() => window.scrollTo(0, 520))
    await page.waitForTimeout(280)
    await shot('events-1440-below-hero.png')
    await page.evaluate(() => window.scrollTo(0, 1100))
    await page.waitForTimeout(280)
    await shot('events-1440-mid.png')
    await context.close()
  }
  {
    const { context, page, shot } = await newPage(390, 844)
    await page.goto(BASE + '/events', { waitUntil: 'domcontentloaded', timeout: 20000 })
    await page.waitForTimeout(800)
    await shot('events-390-top.png')
    await context.close()
  }

  // Mobile menu Spec 4
  {
    const { context, page, shot } = await newPage(390, 844)
    await page.goto(BASE + '/', { waitUntil: 'domcontentloaded', timeout: 20000 })
    await page.waitForTimeout(600)
    await shot('00-menu-closed-390.png')
    const menuBtn = page.locator('button[aria-controls="mobile-navigation"]').first()
    await menuBtn.click({ force: true, timeout: 8000 })
    await page.waitForTimeout(450)
    const openState = await page.evaluate(() => {
      const b = document.querySelector('button[aria-controls="mobile-navigation"]')
      const acc = document.querySelector('.t-acc')
      const accCs = acc && getComputedStyle(acc)
      const close = b && getComputedStyle(b)
      return {
        label: b?.getAttribute('aria-label'),
        expanded: b?.getAttribute('aria-expanded'),
        btn: b && { bg: close.backgroundColor, radius: close.borderRadius, border: close.border },
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
    await shot('02-menu-tanzkurse-sub-390.png')
    await context.close()
  }

  // FAQ hero
  {
    const { context, page, shot } = await newPage(1440, 900)
    await page.goto(BASE + '/faq', { waitUntil: 'domcontentloaded', timeout: 20000 })
    await page.waitForTimeout(800)
    await shot('faq-1440-fold0.png')
    const faq = await page.evaluate(() => {
      const h1 = document.querySelector('h1')?.textContent?.trim()
      const imgs = [...document.querySelectorAll('main img')].map(i => {
        const r = i.getBoundingClientRect()
        return { alt: i.alt, w: Math.round(r.width), h: Math.round(r.height), y: Math.round(r.y), src: (i.currentSrc || i.src || '').slice(-80) }
      })
      const h2 = [...document.querySelectorAll('main h2')].map(h => h.textContent.trim().slice(0, 70))
      return { h1, h2, imgs }
    })
    rec('FAQ_DOM ' + JSON.stringify(faq))
    await page.evaluate(() => window.scrollTo(0, 700))
    await page.waitForTimeout(280)
    await shot('faq-1440-fold1.png')
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
