import { chromium } from 'playwright-core'
const B='http://127.0.0.1:5173'
const br=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']})
for (const [route,tag] of [['/team','ueberuns'],['/tanzkurse','tanzkurse'],['/preise','preise'],['/events','events'],['/faq','faq']]) {
  for (const [w,h] of [[1440,900],[390,844]]) {
    const c=await br.newContext({viewport:{width:w,height:h},locale:'de-CH'})
    const p=await c.newPage()
    await p.goto(B+route,{waitUntil:'domcontentloaded',timeout:20000}); await p.waitForTimeout(900)
    const r=await p.evaluate(()=>{
      const h1=document.querySelector('main h1'); const h1r=h1?.getBoundingClientRect()
      const ctas=[...document.querySelectorAll('main a,main button')].filter(e=>{const b=e.getBoundingClientRect();return b.y>60&&b.y<1000&&b.height>24&&b.width>60&&(e.textContent||'').trim().length>3})
      const last=ctas.length?ctas.map(e=>e.getBoundingClientRect()).sort((a,b)=>b.bottom-a.bottom)[0]:null
      // first block-level thing that starts below the last CTA
      let next=null
      if(last){
        const cands=[...document.querySelectorAll('main img, main section, main h2, main div[class*="rounded"]')].map(e=>({e,r:e.getBoundingClientRect()}))
          .filter(o=>o.r.top>=last.bottom-1 && o.r.height>40).sort((a,b)=>a.r.top-b.r.top)
        if(cands.length) next={tag:cands[0].e.tagName, cls:(cands[0].e.className||'').toString().slice(0,50), top:Math.round(cands[0].r.top)}
      }
      return {h1:h1&&{t:h1.textContent.trim().slice(0,40),top:Math.round(h1r.top),bottom:Math.round(h1r.bottom)},
        lastCta:last&&Math.round(last.bottom), next, gap: last&&next? Math.round(next.top-last.bottom):null}
    })
    console.log(`${tag} ${w}x${h} ` + JSON.stringify(r))
    await c.close()
  }
}
await br.close()
