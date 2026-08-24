import { chromium } from 'playwright-core'
import fs from 'node:fs'
import path from 'node:path'

const OUT = '/root/clients/salsaflow-w1/worklog/shots/CRITIC-0824-0151'
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

// dead zone below the last hero line + ink strictly right of the section midline
const faqProbe = () => {
  const h1 = document.querySelector('main h1')
  const sec = h1.closest('section')
  const sr = sec.getBoundingClientRect()
  const mid = sr.left + sr.width / 2

  const leaves = [...sec.querySelectorAll('*')].filter(e => {
    if (e.children.length) return false
    const r = e.getBoundingClientRect()
    return r.width > 4 && r.height > 4
  }).map(e => {
    const r = e.getBoundingClientRect()
    return {
      tag: e.tagName, t: (e.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 30),
      x: Math.round(r.x), right: Math.round(r.right), y: Math.round(r.y), bottom: Math.round(r.bottom)
    }
  })
  const withText = leaves.filter(l => l.t)
  const maxBottom = Math.max(...withText.map(l => l.bottom))
  const rightOfMid = leaves.filter(l => l.x >= mid).sort((a, b) => a.y - b.y)

  // the right column as a block: how tall is it, and does it sit level with the H1?
  const rTop = rightOfMid.length ? Math.min(...rightOfMid.map(l => l.y)) : null
  const rBottom = rightOfMid.length ? Math.max(...rightOfMid.map(l => l.bottom)) : null

  return {
    secW: Math.round(sr.width), secH: Math.round(sr.height), secBottom: Math.round(sr.bottom),
    midX: Math.round(mid),
    h1Top: Math.round(h1.getBoundingClientRect().top),
    contentMaxBottom: maxBottom, deadBottom: Math.round(sr.bottom - maxBottom),
    inkRightOfMid: rightOfMid.length,
    rightBlockTop: rTop, rightBlockBottom: rBottom,
    rightBlockH: rTop !== null ? Math.round(rBottom - rTop) : null,
    rightSample: rightOfMid.slice(0, 10).map(l => `${l.tag} "${l.t}" @${l.x},${l.y}`),
    mediaCount: [...sec.querySelectorAll('img,video,iframe')].filter(e => {
      const r = e.getBoundingClientRect(); return r.width > 40 && r.height > 40
    }).length
  }
}

// do the seven jump targets actually land on an anchor?
const jumpProbe = () => {
  const h1 = document.querySelector('main h1')
  const sec = h1.closest('section')
  const links = [...sec.querySelectorAll('a[href*="#"]')].map(a => {
    const r = a.getBoundingClientRect()
    const href = a.getAttribute('href') || ''
    const id = href.split('#')[1] || ''
    const target = id ? document.getElementById(id) : null
    return {
      t: (a.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 28),
      href, x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height),
      targetExists: !!target,
      targetY: target ? Math.round(target.getBoundingClientRect().top + window.scrollY) : null
    }
  })
  return { count: links.length, links }
}

try {
  { const { context, page } = await newPage(1440, 900); await page.goto(BASE + '/', { waitUntil: 'networkidle', timeout: 25000 }); await context.close() }

  for (const [w, h, tag] of [[1440, 900, '1440'], [1280, 900, '1280'], [1024, 900, '1024'], [768, 1024, '768'], [390, 844, '390']]) {
    const { context, page, shot } = await newPage(w, h)
    await page.goto(BASE + '/faq', { waitUntil: 'domcontentloaded', timeout: 20000 })
    await page.waitForTimeout(2600)
    rec(`FAQ_${tag} ` + JSON.stringify(await page.evaluate(faqProbe)))
    if (tag === '1440' || tag === '390') rec(`JUMP_${tag} ` + JSON.stringify(await page.evaluate(jumpProbe)))
    await shot(`faq-${tag}-hero.png`)
    await context.close()
  }

  // zoom on the right grid, dsf 2
  {
    const { context, page, shot } = await newPage(1440, 900, 2)
    await page.goto(BASE + '/faq', { waitUntil: 'domcontentloaded', timeout: 20000 })
    await page.waitForTimeout(2600)
    const box = await page.evaluate(() => {
      const h1 = document.querySelector('main h1')
      const sec = h1.closest('section')
      const sr = sec.getBoundingClientRect()
      return { y: Math.max(0, Math.round(sr.top)), h: Math.min(560, Math.round(sr.height)) }
    })
    await shot('faq-right-zoom.png', { x: 700, y: box.y, width: 740, height: box.h, scale: 1 })
    await context.close()
  }

  fs.writeFileSync(path.join(OUT, '_log-faq.json'), JSON.stringify(log, null, 2))
  rec('DONE')
} catch (e) {
  console.error('FAIL', e.stack || e); process.exitCode = 1
} finally { await browser.close() }
