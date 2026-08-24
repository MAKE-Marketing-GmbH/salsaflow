import { chromium } from 'playwright-core'
import fs from 'node:fs'
import path from 'node:path'

const OUT = '/root/clients/salsaflow-w1/worklog/shots/CRITIC-0824-0457'

// At which iframe width does the Instagram header stop colliding? Load the SAME
// embed url standalone at several widths. Without this number my finding is a
// claim without a threshold - and I could not say whether the site is merely
// close or far off.
// First run used DM3vXKvsvGH - a reel that is NOT in the feed. It showed no
// overlap at any width, which contradicted the on-site measurement. Use the
// three real shortcodes from src/public/social/instagram-feed.ts instead.
const SRCS = ['DX-Cz9MNkG_', 'DahpxEVtWvm', 'DYhKD7ONhfK']
const WIDTHS = [206, 248, 280, 320, 360, 400]

const browser = await chromium.launch({
  executablePath: '/usr/bin/google-chrome', headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none']
})
const log = []
function rec(m) { log.push(m); console.log(m) }

try {
  for (const code of SRCS) {
   for (const w of WIDTHS) {
    const SRC = `https://www.instagram.com/reel/${code}/embed/captioned/`
    const context = await browser.newContext({ viewport: { width: Math.max(w, 400), height: 800 }, locale: 'de-CH', deviceScaleFactor: 2 })
    const page = await context.newPage()
    await page.setContent(`<body style="margin:0;background:#111"><iframe src="${SRC}" style="width:${w}px;height:${Math.round(w * 1.6)}px;border:0" allow="encrypted-media"></iframe></body>`)
    await page.waitForTimeout(4500)
    let res = { w, err: 'no frame' }
    for (const fr of page.frames()) {
      if (!/instagram/i.test(fr.url())) continue
      res = await fr.evaluate(() => {
        const out = { texts: [], overlaps: [] }
        const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
        let n
        while ((n = walk.nextNode())) {
          const t = n.textContent.trim(); if (!t) continue
          const rg = document.createRange(); rg.selectNodeContents(n)
          const r = rg.getBoundingClientRect()
          if (r.height === 0 || r.top > 90) continue
          out.texts.push({ t: t.slice(0, 24), top: Math.round(r.top), bottom: Math.round(r.bottom), left: Math.round(r.left), right: Math.round(r.right) })
        }
        for (let i = 0; i < out.texts.length; i++) for (let j = i + 1; j < out.texts.length; j++) {
          const a = out.texts[i], b = out.texts[j]
          const oy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top)
          const ox = Math.min(a.right, b.right) - Math.max(a.left, b.left)
          if (oy > 2 && ox > 2) out.overlaps.push({ a: a.t, b: b.t, ox: Math.round(ox) })
        }
        out.bodyW = document.documentElement.scrollWidth
        out.viewW = window.innerWidth
        return out
      }).catch(e => ({ err: String(e).slice(0, 50) }))
      res.w = w
      break
    }
    rec(`${code} W${w} ` + JSON.stringify({ bodyW: res.bodyW, viewW: res.viewW, texts: (res.texts || []).map(t => t.t), nOverlap: (res.overlaps || []).length, worstOx: Math.max(0, ...(res.overlaps || []).map(o => o.ox)), err: res.err }))
    await context.close()
   }
  }
  fs.writeFileSync(path.join(OUT, '_log-igthresh.json'), JSON.stringify(log, null, 2))
  rec('DONE')
} catch (e) {
  console.error('FAIL', e.stack || e); process.exitCode = 1
} finally { await browser.close() }
