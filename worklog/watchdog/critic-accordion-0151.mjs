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

// closed answers stacked on top of each other = collapsed-but-present, or a real overlap?
const accProbe = () => {
  const answers = [...document.querySelectorAll('main p, main div')].filter(e => {
    const t = (e.textContent || '').trim()
    return t.startsWith('Ja. Die Staffel kostet') || t.startsWith('Nein. Für Shows') ||
           t.startsWith('Die Schnupperstunde ist gratis') || t.startsWith('Ja, besonders wenn du Basics')
  }).slice(0, 4).map(e => {
    const r = e.getBoundingClientRect()
    const cs = getComputedStyle(e)
    let node = e, chain = []
    for (let i = 0; i < 4 && node; i++) {
      const ncs = getComputedStyle(node)
      const nr = node.getBoundingClientRect()
      chain.push({ tag: node.tagName, h: Math.round(nr.height), overflow: ncs.overflow, opacity: ncs.opacity, visibility: ncs.visibility, maxH: ncs.maxHeight, display: ncs.display })
      node = node.parentElement
    }
    return {
      t: (e.textContent || '').trim().slice(0, 34),
      y: Math.round(r.y + window.scrollY), h: Math.round(r.height),
      opacity: cs.opacity, visibility: cs.visibility, chain
    }
  })
  return answers
}

try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'de-CH', deviceScaleFactor: 1 })
  const page = await context.newPage()
  const cdp = await page.context().newCDPSession(page)
  await page.goto(BASE + '/preise', { waitUntil: 'domcontentloaded', timeout: 20000 })
  await page.waitForTimeout(2300)
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await page.waitForTimeout(1600)
  rec('ACC_CLOSED ' + JSON.stringify(await page.evaluate(accProbe), null, 1))

  // find the FAQ block and shoot it closed, then open the first two
  const y = await page.evaluate(() => {
    const h = [...document.querySelectorAll('main h2')].find(e => /Fragen/i.test(e.textContent || ''))
    return h ? Math.round(h.getBoundingClientRect().top + window.scrollY) - 80 : null
  })
  if (y !== null) {
    await page.evaluate(yy => window.scrollTo(0, yy), y)
    await page.waitForTimeout(1200)
    let { data } = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false })
    fs.writeFileSync(path.join(OUT, 'preise-faq-closed.png'), Buffer.from(data, 'base64'))
    console.log('SHOT preise-faq-closed.png')

    // open two neighbours, then look for real overlap
    const opened = await page.evaluate(() => {
      const btns = [...document.querySelectorAll('main button, main summary')].filter(e => {
        const r = e.getBoundingClientRect()
        return r.height > 20 && (e.textContent || '').trim().length > 8
      })
      return btns.slice(0, 3).map(b => (b.textContent || '').trim().slice(0, 40))
    })
    rec('ACC_BUTTONS ' + JSON.stringify(opened))
    for (const label of opened.slice(0, 2)) {
      await page.click(`text=${label.slice(0, 24)}`, { timeout: 4000 }).catch(e => rec('OPEN_ERR ' + label.slice(0, 20) + ' ' + e.message.slice(0, 60)))
      await page.waitForTimeout(900)
    }
    await page.waitForTimeout(800)
    ;({ data } = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false }))
    fs.writeFileSync(path.join(OUT, 'preise-faq-open.png'), Buffer.from(data, 'base64'))
    console.log('SHOT preise-faq-open.png')
    rec('ACC_OPEN ' + JSON.stringify(await page.evaluate(accProbe), null, 1))
  }
  await context.close()

  fs.writeFileSync(path.join(OUT, '_log-acc.json'), JSON.stringify(log, null, 2))
  rec('DONE')
} catch (e) {
  console.error('FAIL', e.stack || e); process.exitCode = 1
} finally { await browser.close() }
