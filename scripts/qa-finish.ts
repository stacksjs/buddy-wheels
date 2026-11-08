import assert from 'node:assert/strict'
import {mkdir} from 'node:fs/promises'
import {launch,navigate,click,settle,waitFor} from '@stacksjs/testing/browser'
const origin=(process.env.BUDDY_QA_URL||'http://localhost:3460').replace(/\/$/,'')
const out='storage/framework/runtime/qa-finish';await mkdir(out,{recursive:true})
const browser=await launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--disk-cache-size=1048576','--media-cache-size=1048576']});const {cdp}=browser
async function color(name:string,value:string){await cdp.evaluate(`(()=>{const el=document.querySelector('input[name=${name}]');el.value=${JSON.stringify(value)};el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));})()`);await settle(cdp)}
async function shot(name:string){const s=await cdp.send('Page.captureScreenshot',{format:'png'}) as {data:string};await Bun.write(out+'/'+name+'.png',Buffer.from(s.data,'base64'));return s.data}
async function post(path:string,data:Record<string,string>){return cdp.evaluate<{status:number,body:string}>(`(async()=>{const r=await fetch(${JSON.stringify(path)},{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded','Accept':'application/json'},body:new URLSearchParams(${JSON.stringify(data)})});return{status:r.status,body:await r.text()}})()`)}
try{
 await navigate(cdp,origin+'/shop?size=XL&accent=%238b3852&trim=%23dfb437');await settle(cdp)
 assert.equal(await cdp.evaluate('document.querySelector("input[name=accent]").value'),'#8b3852')
 await click(cdp,'.finish-presets button:nth-child(2)');assert.equal(await cdp.evaluate('document.querySelector("input[name=accent]").value'),'#286881')
 await color('accent','#c75880');await color('trim','#286881')
 const submitted=await cdp.evaluate<string>('new URLSearchParams(new FormData(document.getElementById("chair-purchase"))).toString()')
 assert.match(submitted,/accent=%23c75880/);assert.match(submitted,/trim=%23286881/)
 const studioLink=await cdp.evaluate<string>('document.querySelector("a[href*=design-studio-xl-suspension]").href');assert.match(studioLink,/accent=%23c75880/);assert.match(studioLink,/trim=%23286881/)
 await click(cdp,'a[href*="design-studio-xl-suspension"]');await waitFor(()=>cdp.evaluate('location.pathname==="/design-studio-xl-suspension"'));await settle(cdp);assert.equal(await cdp.evaluate('document.querySelector("input[name=accent]").value'),'#c75880');assert.match(await cdp.evaluate<string>('document.querySelector(".standard-revisions a[href*=design-studio-xl] ").href'),/accent=%23c75880/)
 await navigate(cdp,origin+'/shop?size=XL&accent=%23c75880&trim=%23286881');await settle(cdp)
 await click(cdp,'#chair-purchase button[type=submit]');await waitFor(()=>cdp.evaluate('location.pathname==="/cart"'));await settle(cdp)
 assert.match(await cdp.evaluate<string>('document.querySelector(".basket-row").textContent'),/#c75880/)
 assert.equal((await post('/api/cart/add',{slug:'big-buddy',quantity:'1',accent:'#C75880',trim:'#286881'})).status,200)
 await navigate(cdp,origin+'/cart');await settle(cdp);assert.equal(await cdp.evaluate('document.querySelectorAll(".basket-row").length'),1);assert.equal(await cdp.evaluate('document.querySelector(".basket-row input[name=quantity]").value'),'2')
 const first=await cdp.evaluate<string>('document.querySelector(".basket-row input[name=item_id]").value')
 assert.equal((await post('/api/cart/add',{slug:'big-buddy',quantity:'1',accent:'#dfb437',trim:'#286881'})).status,200)
 assert.equal((await post('/api/cart/update',{item_id:first,quantity:'5'})).status,422)
 assert.equal((await post('/api/cart/update',{item_id:first,quantity:'4'})).status,200)
 assert.equal((await post('/api/cart/add',{slug:'big-buddy',quantity:'1',accent:'#8b3852'})).status,422)
 await navigate(cdp,origin+'/cart');await settle(cdp);assert.equal(await cdp.evaluate('document.querySelectorAll(".basket-row").length'),2)
 const restore=await cdp.evaluate<string>('document.querySelector(".basket-row a").href');await navigate(cdp,restore);await settle(cdp)
 assert.equal(await cdp.evaluate('document.querySelector("input[name=accent]").value'),'#c75880')
 await navigate(cdp,origin+'/rover?mode=coast');await settle(cdp);await color('accent','#dfb437');await color('trim','#8b3852');await click(cdp,'#rover-purchase button[type=submit]');await waitFor(()=>cdp.evaluate('location.pathname==="/cart"'));await settle(cdp)
 assert.match(await cdp.evaluate<string>('document.querySelector("[data-basket-line=buddy-rover-coast]").textContent'),/#dfb437/)
 const contention=await cdp.evaluate<number[]>(`(async()=>Promise.all([1,2].map(async()=>{const r=await fetch('/api/cart/add',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded','Accept':'application/json'},body:new URLSearchParams({slug:'buddy-small',quantity:'3',accent:'#286881'})});return r.status})))()`);assert.deepEqual(contention.sort(),[200,422])
 for(const [page,part,form] of [['/design-studio?size=XS','tube_cap','studio-download'],['/design-studio-xl','end_cap','standard-download'],['/design-studio-xl-suspension','end_cap','standard-download']]){
  await navigate(cdp,origin+page);await waitFor(()=>cdp.evaluate("document.querySelector('[data-stx-model-viewer]')?.dataset.modelStatus==='ready'"),20000);await settle(cdp)
  await click(cdp,'.studio-part:has(a[href*="'+part+'"]) button');await waitFor(()=>cdp.evaluate("document.querySelector('[data-stx-model-viewer]')?.dataset.modelStatus==='ready'"),20000);await settle(cdp)
  const before=await shot(form+'-before');await color('accent','#dfb437');await color('trim','#8b3852');assert.notEqual(await shot(form+'-after'),before)
  const url=await cdp.evaluate<string>(`(()=>{const f=document.getElementById(${JSON.stringify(form)});return f.action+'?'+new URLSearchParams(new FormData(f))})()`)
  const r=await fetch(url);assert.equal(r.status,200);const files=await new Bun.Archive(await r.arrayBuffer()).files()
  assert.deepEqual(JSON.parse(await files.get('finish.json')!.text()).finish,{accent:'#dfb437',trim:'#8b3852'})
  const hashes=JSON.parse(await files.get('checksums.json')!.text());for(const row of hashes.files)assert.equal(new Bun.CryptoHasher('sha256').update(await files.get(row.file)!.arrayBuffer()).digest('hex'),row.sha256)
 }
 for(const width of [320,428,768,1440]){
  await cdp.send('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:width<768})
  for(const page of ['/shop?size=XL','/rover','/design-studio?size=XS','/design-studio-xl','/design-studio-xl-suspension']){
   await navigate(cdp,origin+page);await settle(cdp);assert.equal(await cdp.evaluate('Math.max(0,document.documentElement.scrollWidth-innerWidth)'),0,page+' '+width)
   if(width===320||width===1440){await cdp.evaluate('document.querySelector(".finish-picker").scrollIntoView({behavior:"instant",block:"center"})');await shot(page.replace(/[^a-z]/g,'')+'-'+width)}
  }
 }
 await cdp.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-color-scheme',value:'dark'}]});await navigate(cdp,origin+'/shop?size=XL');await settle(cdp);await cdp.evaluate('document.querySelector(".finish-picker").scrollIntoView({behavior:"instant",block:"center"})');await shot('picker-dark')
 const contrast=await cdp.evaluate<number>(`(()=>{const lin=v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4};const lum=s=>{const c=s.match(/[0-9.]+/g).slice(0,3).map(Number).map(lin);return .2126*c[0]+.7152*c[1]+.0722*c[2]};const a=lum(getComputedStyle(document.querySelector('.finish-picker legend')).color),b=lum(getComputedStyle(document.body).backgroundColor);return (Math.max(a,b)+.05)/(Math.min(a,b)+.05)})()`);assert.ok(contrast>=4.5)
 for(const endpoint of ['/api/designs/xs/kit','/api/designs/xl-r1/kit','/api/designs/xl-r2/kit'])for(const query of ['accent=%23fff','trim=red','accent=%23ffffff&accent=%23000000'])assert.equal((await fetch(origin+endpoint+'?'+query)).status,422)
 const expectedRejection='Failed to load resource: the server responded with a status of 422 (Unprocessable Entity)'
 assert.equal(cdp.errors.filter(e=>e===expectedRejection).length,3);assert.deepEqual(cdp.errors.filter(e=>e!==expectedRejection),[]);console.log(JSON.stringify({origin,presets:'passed',customColors:'passed',basketPersistence:'passed',colorVariants:'passed',quantityLimitAcrossColors:'passed',modelRecolor:'passed',matchingKits:'passed',responsiveWidths:[320,428,768,1440],darkContrast:contrast,expected422Rejections:3,unexpectedConsoleErrors:[]}))
}finally{await browser.close()}
