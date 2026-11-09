import assert from 'node:assert/strict'
import {mkdir} from 'node:fs/promises'
import {launch,navigate,click,settle,waitFor} from '@stacksjs/testing/browser'
const origin=(process.env.BUDDY_QA_URL||'http://localhost:3460').replace(/\/$/,'')
const out='storage/framework/runtime/qa-complete-costs'
await mkdir(out,{recursive:true})
const browser=await launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--disk-cache-size=1048576','--media-cache-size=1048576']})
const {cdp}=browser
const ready=()=>waitFor(()=>cdp.evaluate("document.querySelector('[data-stx-model-viewer]')?.dataset.modelStatus==='ready'"),30000)
async function input(name:string,value:string){await cdp.evaluate(`(()=>{const el=document.querySelector('input[name=${name}]');el.value=${JSON.stringify(value)};el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));})()`);await settle(cdp)}
try{
 for(const [page,baseline,one]of [['/design-studio-xl-suspension','$281.45','$684.47'],['/design-studio-xl','$244.02','$553.39']]){
  await navigate(cdp,origin+page);await ready();await settle(cdp)
  assert.match(await cdp.evaluate<string>('document.querySelector("[data-standard-cogs]").textContent'),new RegExp(baseline!.replace(/[.$]/g,'\\$&')))
  await click(cdp,'.standard-cost-toggle:first-of-type label:nth-of-type(2)');await settle(cdp)
  assert.match(await cdp.evaluate<string>('document.querySelector("[data-standard-cogs]").textContent'),new RegExp(one!.replace(/[.$]/g,'\\$&')))
  await click(cdp,'.standard-cost-toggle:first-of-type label:first-of-type')
  await input('slingLength','300');await input('slingWidth','355');await ready()
  const expected=await cdp.evaluate<number>('Number(document.querySelector("[data-standard-cogs]").textContent.match(/[0-9]+[.][0-9]{2}/)[0])*100')
  const url=await cdp.evaluate<string>('(()=>{const f=document.getElementById("standard-download");return f.action+"?"+new URLSearchParams(new FormData(f))})()')
  const response=await fetch(url);assert.equal(response.status,200)
  const files=await new Bun.Archive(await response.arrayBuffer()).files(),model=JSON.parse(await files.get('cost-model.json')!.text())
  const cost=model.retails?model.retails[1]:model.base
  assert.equal(cost.cogs,Math.round(expected));assert.equal(cost.textiles.demand.binding,JSON.parse(await files.get('softgoods/cost-model.json')!.text()).demand.binding)
  assert.match(await files.get('cost-notes.md')!.text(),/current itemized|Complete XL support/)
  for(const record of JSON.parse(await files.get('checksums.json')!.text()).files)assert.equal(new Bun.CryptoHasher('sha256').update(await files.get(record.file)!.arrayBuffer()).digest('hex'),record.sha256)
  await input('chest','700');await ready()
  assert.match(await cdp.evaluate<string>('document.querySelector(".standard-cost-panel").textContent'),/narrower straps/)
  await click(cdp,'.textile-controls .studio-reset');await ready()
  for(const width of [320,768,1440]){
   await cdp.send('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:width<768})
   await cdp.evaluate('document.querySelector(".standard-economics").scrollIntoView({behavior:"instant",block:"start"})');await settle(cdp)
   assert.equal(await cdp.evaluate('Math.max(0,document.documentElement.scrollWidth-innerWidth)'),0)
   const shot=await cdp.send('Page.captureScreenshot',{format:'png'}) as {data:string}
   await Bun.write(out+'/'+page.slice(1)+'-'+width+'.png',Buffer.from(shot.data,'base64'))
  }
 }
 const doc=await fetch(origin+'/designs/xl/r2/complete-unit-costs.md');assert.equal(doc.status,200);assert.match(await doc.text(),/\$281\.45/)
 assert.deepEqual(cdp.errors,[])
 console.log(JSON.stringify({origin,defaultCosts:'passed',oneBuildCash:'passed',configuredArchiveCosts:'passed',checksums:'passed',narrowHardwareDisclosure:'passed',fullReport:'passed',widths:[320,768,1440],consoleErrors:[]}))
}finally{await browser.close()}
