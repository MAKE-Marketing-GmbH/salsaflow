import { chromium } from 'playwright-core'
import fs from 'node:fs'
import path from 'node:path'

const OUT = '/root/clients/salsaflow-w1/worklog/shots/CRITIC-0823-2252'
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
  }
  return { context, page, shot }
}

// Generic hero/section probe: images, headings, buttons, gap under last CTA, hr count
async function probe(page) {
  return page.evaluate(() => {
    const R = (el) => { const r = el.getBoundingClientRect(); return { y: Math.round(r.y), h: Math.round(r.height), w: Math.round(r.width), bottom: Math.round(r.bottom), x: Math.round(r.x) } }
    const imgs = [...document.querySelectorAll('main img')].slice(0, 10).map(i => ({
      src: (i.currentSrc || i.src || '').split('/').pop().slice(0, 50),
      alt: (i.alt || '').slice(0, 50),
      ...R(i)
    }))
    const hs = [...document.querySelectorAll('main h1,main h2,main h3')].slice(0, 24).map(h => ({
      tag: h.tagName,
      t: (h.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 70),
      y: Math.round(h.getBoundingClientRect().y),
      fs: getComputedStyle(h).fontSize
    }))
    const heroCtas = [...document.querySelectorAll('main a, main button')].filter(el => {
      const r = el.getBoundingClientRect()
      return r.y > 60 && r.y < 900 && r.height > 24 && r.width > 60 && (el.textContent || '').trim().length > 3
    }).slice(0, 8).map(el => ({ t: (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 36), ...R(el) }))
    const hrs = [...document.querySelectorAll('main hr')].length
    return { imgs, hs, heroCtas, hrs, scrollH: document.documentElement.scrollHeight }
  })
}

try {
  { const { context, page } = await newPage(1440, 900); await page.goto(BASE + '/faq', { waitUntil: 'networkidle', timeout: 25000 }); await page.waitForTimeout(250); await context.close() }

  // --- FAQ: hero without home pair? 1440 / 390 / 730 ---
  for (const [w, h, tag] of [[1440, 900, '1440'], [1440, 730, '1440x730'], [390, 844, '390']]) {
    const { context, page, shot } = await newPage(w, h)
    await page.goto(BASE + '/faq', { waitUntil: 'domcontentloaded', timeout: 20000 })
    await page.waitForTimeout(900)
    await shot(`faq-${tag}-fold0.png`)
    const p = await probe(page)
    const extra = await page.evaluate(() => {
      const pair = [...document.querySelectorAll('main img')].filter(i => /hero-paar-dreh-01/.test(i.currentSrc || i.src || ''))
      const heroSec = document.querySelector('main section')
      const hr = heroSec?.getBoundingClientRect()
      return {
        homePairCount: pair.length,
        heroImgCount: [...document.querySelectorAll('main section:first-of-type img')].length,
        heroSection: hr && { y: Math.round(hr.y), h: Math.round(hr.height) },
        h1: document.querySelector('h1')?.textContent?.trim().slice(0, 60)
      }
    })
    rec(`FAQ_${tag} ` + JSON.stringify({ ...extra, imgs: p.imgs, ctas: p.heroCtas }))
    await page.evaluate(() => window.scrollTo(0, 700))
    await page.waitForTimeout(280)
    await shot(`faq-${tag}-fold1.png`)
    await context.close()
  }

  // --- Walkthrough pages never captured: /tanzkurse, /team (Ueber uns), /preise ---
  const pages = [
    ['/tanzkurse', 'tanzkurse'],
    ['/ueber-uns', 'ueberuns'],
    ['/team', 'team'],
    ['/preise', 'preise']
  ]
  for (const [route, tag] of pages) {
    const { context, page, shot } = await newPage(1440, 900)
    const resp = await page.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 20000 }).catch(() => null)
    await page.waitForTimeout(900)
    const status = resp?.status()
    if (!status || status >= 400) { rec(`${tag.toUpperCase()}_STATUS ${status}`); await context.close(); continue }
    await shot(`${tag}-1440-fold0.png`)
    const p = await probe(page)
    rec(`${tag.toUpperCase()}_1440 ` + JSON.stringify(p))
    for (const y of [800, 1700, 2600]) {
      await page.evaluate((yy) => window.scrollTo(0, yy), y)
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

  // --- Menu Spec 4 recheck 390 ---
  {
    const { context, page, shot } = await newPage(390, 844)
    await page.goto(BASE + '/', { waitUntil: 'domcontentloaded', timeout: 20000 })
    await page.waitForTimeout(600)
    await page.locator('button[aria-controls="mobile-navigation"]').first().click({ force: true, timeout: 8000 })
    await page.waitForTimeout(450)
    const st = await page.evaluate(() => {
      const acc = document.querySelector('.t-acc')
      const cs = acc && getComputedStyle(acc)
      return acc && { bg: cs.backgroundColor, border: cs.borderTopWidth + ' ' + cs.borderTopColor, shadow: cs.boxShadow.slice(0, 60), h: Math.round(acc.getBoundingClientRect().height) }
    })
    rec('MENU_ACC ' + JSON.stringify(st))
    await shot('menu-open-390.png')
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
