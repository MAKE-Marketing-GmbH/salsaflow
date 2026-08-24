import { chromium } from 'playwright-core'
import fs from 'node:fs'
import path from 'node:path'

const OUT = '/root/clients/salsaflow-w1/worklog/shots/CRITIC-0823-2051'
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

async function measure(page) {
  return page.evaluate(() => {
    const photo = document.querySelector('section img, [data-hero] img, picture img')
    const imgs = [...document.querySelectorAll('main img, section img')].slice(0, 4).map(i => {
      const r = i.getBoundingClientRect()
      const s = getComputedStyle(i)
      return {
        alt: (i.alt || '').slice(0, 60),
        w: Math.round(r.width),
        h: Math.round(r.height),
        op: s.opacity,
        vis: s.visibility,
        complete: i.complete,
        nw: i.naturalWidth
      }
    })
    const cta = [...document.querySelectorAll('a')].find(a => /Kursplan ansehen/.test(a.textContent || ''))
    const ctaS = cta && getComputedStyle(cta)
    const ctaR = cta?.getBoundingClientRect()
    const schnupper = [...document.querySelectorAll('a')].find(a => /Schnupper/.test(a.textContent || ''))
    const schnR = schnupper?.getBoundingClientRect()
    const cookie = [...document.querySelectorAll('button, a, div')].find(el => /Akzeptieren/.test(el.textContent || ''))
    const cookieBar = cookie && (cookie.closest('[class*="cookie"]') || cookie.parentElement?.parentElement || cookie.parentElement)
    const cookieR = cookieBar?.getBoundingClientRect()
    const cookieBtnR = cookie?.getBoundingClientRect()
    const trust = [...document.querySelectorAll('p, div, span')].find(el => /Google/.test(el.textContent || '') && /4,9|4.9/.test(el.textContent || ''))
    const trustR = trust?.getBoundingClientRect()
    const h1 = document.querySelector('h1')
    const h1s = h1 && getComputedStyle(h1)
    const bailar = [...document.querySelectorAll('*')].find(el => /Bailar/.test(el.textContent || '') && (el.textContent || '').trim().length < 40)
    const bailarS = bailar && getComputedStyle(bailar)
    const overlaps = (a, b) => {
      if (!a || !b || a.width < 2 || b.width < 2) return false
      return !(a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom)
    }
    return {
      h1: h1?.textContent?.trim()?.slice(0, 80),
      h1Color: h1s?.color,
      h1Op: h1s?.opacity,
      bailarColor: bailarS?.color,
      bailarOp: bailarS?.opacity,
      cta: cta && {
        bg: ctaS.backgroundColor,
        color: ctaS.color,
        op: ctaS.opacity,
        y: Math.round(ctaR.y),
        h: Math.round(ctaR.height),
        x: Math.round(ctaR.x)
      },
      schnupper: schnR && { y: Math.round(schnR.y), h: Math.round(schnR.height), x: Math.round(schnR.x), w: Math.round(schnR.width) },
      cookie: cookieR && { y: Math.round(cookieR.y), h: Math.round(cookieR.height), x: Math.round(cookieR.x), w: Math.round(cookieR.width) },
      cookieBtn: cookieBtnR && { y: Math.round(cookieBtnR.y), h: Math.round(cookieBtnR.height) },
      trust: trustR && { y: Math.round(trustR.y), h: Math.round(trustR.height), x: Math.round(trustR.x), w: Math.round(trustR.width), t: (trust.textContent || '').trim().slice(0, 80) },
      cookieOverTrust: overlaps(cookieR, trustR),
      cookieOverSchnupper: overlaps(cookieR, schnR),
      cookieOverCta: overlaps(cookieR, ctaR),
      imgs
    }
  })
}

try {
  // Warm Vite + image cache so first-frame tests fade, not network.
  {
    const { context, page } = await newPage(1440, 900)
    await page.goto(BASE + '/', { waitUntil: 'networkidle', timeout: 25000 })
    await page.waitForTimeout(400)
    await context.close()
  }

  async function firstFrames(w, h, prefix) {
    const { context, page, shot } = await newPage(w, h)
    const t0 = Date.now()
    await page.goto(BASE + '/', { waitUntil: 'domcontentloaded', timeout: 20000 })
    const afterGoto = Date.now() - t0
    await shot(`${prefix}-t0.png`)
    rec(`${prefix}_GOTO_MS ${afterGoto}`)
    rec(`${prefix}_T0 ` + JSON.stringify(await measure(page)))
    await page.waitForTimeout(80)
    await shot(`${prefix}-t80.png`)
    rec(`${prefix}_T80 ` + JSON.stringify(await measure(page)))
    await page.waitForTimeout(40)
    await shot(`${prefix}-t120.png`)
    rec(`${prefix}_T120 ` + JSON.stringify(await measure(page)))
    await page.waitForTimeout(280)
    await shot(`${prefix}-t400.png`)
    rec(`${prefix}_T400 ` + JSON.stringify(await measure(page)))
    await page.waitForTimeout(1000)
    await shot(`${prefix}-settled.png`)
    rec(`${prefix}_SETTLED ` + JSON.stringify(await measure(page)))
    await context.close()
  }

  await firstFrames(1440, 900, 'home-1440')
  await firstFrames(390, 844, 'home-390')

  // Cookie collision isolation: settled, no dismiss, crop via viewport shot
  {
    const { context, page, shot } = await newPage(1440, 900)
    await page.goto(BASE + '/', { waitUntil: 'domcontentloaded', timeout: 20000 })
    await page.waitForTimeout(900)
    await shot('home-1440-cookie-trust.png')
    rec('COOKIE_1440 ' + JSON.stringify(await measure(page)))
    await context.close()
  }
  {
    const { context, page, shot } = await newPage(390, 844)
    await page.goto(BASE + '/', { waitUntil: 'domcontentloaded', timeout: 20000 })
    await page.waitForTimeout(900)
    await shot('home-390-cookie-schnupper.png')
    rec('COOKIE_390 ' + JSON.stringify(await measure(page)))
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
