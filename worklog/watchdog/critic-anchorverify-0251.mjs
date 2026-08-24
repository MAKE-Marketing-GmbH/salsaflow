import { chromium } from 'playwright-core'
const B='http://127.0.0.1:5173'
const br=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']})
for (const url of ['/kontakt#events','/kontakt#raumvermietung']) {
  const c=await br.newContext({viewport:{width:1440,height:900},locale:'de-CH'})
  const p=await c.newPage()
  await p.goto(B+url,{waitUntil:'domcontentloaded'}); await p.waitForTimeout(2600)
  const r=await p.evaluate(()=>{
    const h=location.hash.slice(1)
    const t=document.getElementById(h)||document.querySelector('[name="'+h+'"]')
    const ids=[...document.querySelectorAll('[id]')].map(e=>e.id).filter(Boolean)
    return {hash:h,exists:!!t,scrollY:Math.round(window.scrollY),idsOnPage:ids.slice(0,20)}
  })
  console.log(url, JSON.stringify(r))
  await c.close()
}
await br.close()
