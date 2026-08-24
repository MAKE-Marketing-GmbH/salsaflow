import { chromium } from 'playwright-core'
import fs from 'node:fs'
import path from 'node:path'

const OUT = '/root/clients/salsaflow-w1/worklog/shots/CRITIC-0823-2221'
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

try {
  {
    const { context, page } = await newPage(1440, 900)
    await page.goto(BASE + '/events', { waitUntil: 'networkidle', timeout: 25000 })
    await page.waitForTimeout(250)
    await context.close()
  }

  // --- EVENTS 1440 ---
  {
    const { context, page, shot } = await newPage(1440, 900)
    await page.goto(BASE + '/events', { waitUntil: 'domcontentloaded', timeout: 20000 })
    await page.waitForTimeout(900)
    await shot('events-1440-top.png')

    const ev = await page.evaluate(() => {
      const hs = [...document.querySelectorAll('h1,h2,h3')].map(h => (h.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 90))
      const stripHits = [...document.querySelectorAll('dl,ul,section,div,p')].filter(el => {
        const t = (el.textContent || '').replace(/\s+/g, ' ')
        return /1\.\s*3\.\s*5|WANN|MusikDJs|Basel SBB/.test(t) && t.length < 280
      }).slice(0, 12).map(el => ({
        tag: el.tagName,
        cls: (el.className || '').toString().slice(0, 80),
        t: (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 140),
        y: Math.round(el.getBoundingClientRect().y),
        h: Math.round(el.getBoundingClientRect().height)
      }))
      const hasDl = !!document.querySelector('main dl')
      const btns = [...document.querySelectorAll('a,button')].filter(el => {
        const r = el.getBoundingClientRect()
        const t = (el.textContent || '').trim()
        return r.y > 80 && r.y < 700 && r.height > 20 && /Events ansehen|Danceflow|Workshop/i.test(t)
      }).map(el => {
        const r = el.getBoundingClientRect()
        return { t: (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 48), y: Math.round(r.y), bottom: Math.round(r.bottom), h: Math.round(r.height) }
      })
      const imgs = [...document.querySelectorAll('main img')].slice(0, 4).map(i => {
        const r = i.getBoundingClientRect()
        return { alt: (i.alt || '').slice(0, 60), y: Math.round(r.y), h: Math.round(r.height), w: Math.round(r.width) }
      })
      return { hs, stripHits, hasDl, btns, imgs, scrollH: document.documentElement.scrollHeight }
    })
    rec('EVENTS_1440 ' + JSON.stringify(ev))

    const photo = ev.imgs[0]
    const belowY = photo ? Math.max(0, photo.y + photo.h - 80) : 520
    await page.evaluate((y) => window.scrollTo(0, y), belowY)
    await page.waitForTimeout(300)
    await shot('events-1440-below-hero.png')

    const belowDom = await page.evaluate(() => {
      const visible = [...document.querySelectorAll('h1,h2,h3,dt,dd,p,li')].filter(el => {
        const r = el.getBoundingClientRect()
        return r.y < innerHeight && r.bottom > 0 && r.height > 8
      }).map(el => ({
        tag: el.tagName,
        t: (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 80),
        y: Math.round(el.getBoundingClientRect().y)
      }))
      return visible.slice(0, 25)
    })
    rec('EVENTS_1440_BELOW ' + JSON.stringify(belowDom))

    await page.evaluate(() => window.scrollTo(0, 1100))
    await page.waitForTimeout(280)
    await shot('events-1440-mid.png')
    await context.close()
  }

  // --- EVENTS 390 ---
  {
    const { context, page, shot } = await newPage(390, 844)
    await page.goto(BASE + '/events', { waitUntil: 'domcontentloaded', timeout: 20000 })
    await page.waitForTimeout(800)
    await shot('events-390-top.png')
    const ev = await page.evaluate(() => {
      const hs = [...document.querySelectorAll('h1,h2')].map(h => (h.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 80))
      const stripHits = [...document.querySelectorAll('dl,div,p')].filter(el => {
        const t = (el.textContent || '').replace(/\s+/g, ' ')
        return /1\.\s*3\.\s*5|DJs|Basel SBB/.test(t) && t.length < 280
      }).slice(0, 8).map(el => ({
        tag: el.tagName,
        t: (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 120),
        y: Math.round(el.getBoundingClientRect().y)
      }))
      const btns = [...document.querySelectorAll('a,button')].filter(el => {
        const r = el.getBoundingClientRect()
        return r.y > 80 && r.y < 700 && /Events ansehen|Danceflow/i.test(el.textContent || '')
      }).map(el => {
        const r = el.getBoundingClientRect()
        return { t: (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40), bottom: Math.round(r.bottom) }
      })
      const img = document.querySelector('main img')
      const ir = img?.getBoundingClientRect()
      return { hs, stripHits, btns, imgY: ir && Math.round(ir.y), hasDl: !!document.querySelector('main dl') }
    })
    rec('EVENTS_390 ' + JSON.stringify(ev))
    await page.evaluate(() => window.scrollTo(0, Math.min(700, document.documentElement.scrollHeight)))
    await page.waitForTimeout(280)
    await shot('events-390-below-hero.png')
    await context.close()
  }

  // --- FAQ hero ---
  {
    const { context, page, shot } = await newPage(1440, 900)
    await page.goto(BASE + '/faq', { waitUntil: 'domcontentloaded', timeout: 20000 })
    await page.waitForTimeout(800)
    await shot('faq-1440-fold0.png')
    const faq = await page.evaluate(() => ({
      h1: document.querySelector('h1')?.textContent?.trim(),
      imgs: [...document.querySelectorAll('main img')].map(i => {
        const r = i.getBoundingClientRect()
        return { alt: i.alt, w: Math.round(r.width), h: Math.round(r.height), y: Math.round(r.y), src: (i.currentSrc || i.src || '').split('/').pop() }
      }),
      h2: [...document.querySelectorAll('main h2')].map(h => h.textContent.trim().slice(0, 70))
    }))
    rec('FAQ_DOM ' + JSON.stringify(faq))
    await page.evaluate(() => window.scrollTo(0, 700))
    await page.waitForTimeout(250)
    await shot('faq-1440-fold1.png')
    await context.close()
  }

  // --- MENU 390 ---
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
      const items = [...document.querySelectorAll('#mobile-navigation a, #mobile-navigation button')].map(el => (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40)).filter(Boolean)
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
        },
        items: items.slice(0, 20)
      }
    })
    rec('MENU_OPEN ' + JSON.stringify(openState))
    await shot('01-menu-open-390.png')
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
