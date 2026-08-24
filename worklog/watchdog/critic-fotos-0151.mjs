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

// which H3 run past the viewport, and can the user scroll sideways?
const overflowProbe = () => {
  const docW = document.documentElement.clientWidth
  const heads = [...document.querySelectorAll('main h3')].map(e => {
    const r = e.getBoundingClientRect()
    const cs = getComputedStyle(e)
    return {
      t: (e.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 42),
      x: Math.round(r.x + window.scrollX), right: Math.round(r.right + window.scrollX),
      y: Math.round(r.y + window.scrollY), w: Math.round(r.width),
      over: Math.round(r.right - docW),
      whiteSpace: cs.whiteSpace, overflow: cs.overflow, textOverflow: cs.textOverflow
    }
  })
  // is the parent a horizontal scroller, or is it real page overflow?
  const cut = heads.filter(h => h.over > 0)
  const parents = cut.map(h => {
    const el = [...document.querySelectorAll('main h3')].find(e => (e.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 42) === h.t)
    let node = el.parentElement, chain = []
    for (let i = 0; i < 5 && node; i++) {
      const cs = getComputedStyle(node)
      const r = node.getBoundingClientRect()
      chain.push({
        tag: node.tagName, cls: (node.className || '').toString().slice(0, 40),
        overflowX: cs.overflowX, w: Math.round(r.width), scrollW: node.scrollWidth,
        scrollable: node.scrollWidth > node.clientWidth + 2
      })
      node = node.parentElement
    }
    return { t: h.t, chain }
  })
  return {
    docW, bodyScrollW: document.body.scrollWidth,
    docScrollW: document.documentElement.scrollWidth,
    pageScrollsSideways: document.documentElement.scrollWidth > docW + 2,
    heads, cut, parents
  }
}

try {
  for (const [w, h, tag] of [[390, 844, '390'], [360, 800, '360'], [768, 1024, '768'], [1440, 900, '1440']]) {
    const context = await browser.newContext({ viewport: { width: w, height: h }, locale: 'de-CH', deviceScaleFactor: 1 })
    const page = await context.newPage()
    const cdp = await page.context().newCDPSession(page)
    await page.goto(BASE + '/fotos', { waitUntil: 'domcontentloaded', timeout: 20000 })
    await page.waitForTimeout(2300)
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(1500)
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForTimeout(800)
    const p = await page.evaluate(overflowProbe)
    rec(`FOTOS_${tag} docW=${p.docW} docScrollW=${p.docScrollW} sideways=${p.pageScrollsSideways} cut=${p.cut.length} ` + JSON.stringify(p.cut))
    if (p.parents.length) rec(`FOTOS_PARENTS_${tag} ` + JSON.stringify(p.parents, null, 1))

    // scroll to the first cut heading and shoot it
    if (p.cut.length) {
      const y = Math.max(0, p.cut[0].y - 160)
      await page.evaluate(yy => window.scrollTo(0, yy), y)
      await page.waitForTimeout(1200)
      const { data } = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false })
      fs.writeFileSync(path.join(OUT, `fotos-${tag}-cut.png`), Buffer.from(data, 'base64'))
      console.log(`SHOT fotos-${tag}-cut.png`)
    } else {
      const { data } = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false })
      fs.writeFileSync(path.join(OUT, `fotos-${tag}-top.png`), Buffer.from(data, 'base64'))
      console.log(`SHOT fotos-${tag}-top.png`)
    }
    await context.close()
  }
  fs.writeFileSync(path.join(OUT, '_log-fotos.json'), JSON.stringify(log, null, 2))
  rec('DONE')
} catch (e) {
  console.error('FAIL', e.stack || e); process.exitCode = 1
} finally { await browser.close() }
