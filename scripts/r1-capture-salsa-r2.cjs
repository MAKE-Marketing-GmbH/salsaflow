const { chromium } = require('/usr/lib/node_modules/playwright');
const fs = require('fs');
const OUT = '/root/clients/salsaflow-dc/.claude/worktrees/ultracode-aaa-2026-08-06/_screenshots-runde1/stil-salsa/r2';
async function prep(page) {
  await page.evaluate(async () => {
    document.querySelectorAll('img').forEach(i => { i.loading='eager'; i.decoding='sync'; });
    const h=document.body.scrollHeight;
    for(let y=0;y<=h;y+=600){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,60));}
    window.scrollTo(0,0);
  });
  await page.waitForFunction(() => Array.from(document.images).every(i => i.complete && i.naturalWidth > 0), {timeout:15000}).catch(()=>{});
  await page.waitForTimeout(500);
}
async function capture(browser, width, height, prefix, mobile=false) {
  const ctx=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,isMobile:mobile,reducedMotion:'reduce'});
  const page=await ctx.newPage();
  const response=await page.goto('http://localhost:5173/tanzkurse/salsa',{waitUntil:'networkidle',timeout:25000});
  if(!response || response.status()>=400) throw new Error(`HTTP ${response ? response.status() : 'no response'}`);
  await prep(page);
  const total=await page.evaluate(()=>document.documentElement.scrollHeight);
  const step=Math.floor(height*0.9);
  let n=0;
  for(let y=0;y<total;y+=step){
    n++;
    await page.evaluate(y=>window.scrollTo(0,Math.min(y,document.documentElement.scrollHeight-innerHeight)),y);
    await page.waitForTimeout(200);
    await page.screenshot({path:`${OUT}/${prefix}-${String(n).padStart(2,'0')}.png`});
  }
  await ctx.close();
}
(async()=>{fs.mkdirSync(OUT,{recursive:true});const browser=await chromium.launch({headless:true,channel:'chrome'});try{await capture(browser,1440,900,'d');await capture(browser,390,844,'m',true);}finally{await browser.close();}})().catch(e=>{console.error(e.message);process.exit(1)});
