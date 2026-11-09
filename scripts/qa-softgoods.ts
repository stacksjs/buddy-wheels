import assert from 'node:assert/strict'
import {mkdir} from 'node:fs/promises'
import {launch,navigate,click,settle,waitFor} from '@stacksjs/testing/browser'
import {inspectBinaryStl} from '../app/Designs/Mesh'

const origin=(process.env.BUDDY_QA_URL||'http://localhost:3460').replace(/\/$/,'')
const out='storage/framework/runtime/qa-softgoods'
await mkdir(out,{recursive:true})
const browser=await launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--disk-cache-size=1048576','--media-cache-size=1048576']})
const {cdp}=browser
const ready=()=>waitFor(()=>cdp.evaluate("document.querySelector('[data-stx-model-viewer]')?.dataset.modelStatus==='ready'"),30000)
async function input(name:string,value:string){
 await cdp.evaluate(`(()=>{const el=document.querySelector('input[name=${name}]');el.value=${JSON.stringify(value)};el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));})()`)
 await settle(cdp)
}
async function shot(name:string,model=false){
 const clip=model?await cdp.evaluate('(()=>{const r=document.querySelector(".stx-model-viewer-stage").getBoundingClientRect();return{x:r.x+scrollX,y:r.y+scrollY,width:r.width,height:r.height,scale:1}})()'):undefined
 const result=await cdp.send('Page.captureScreenshot',{format:'png',...(clip?{clip}:{})}) as {data:string}
 await Bun.write(out+'/'+name+'.png',Buffer.from(result.data,'base64'))
 return result.data
}
async function archive(url:string){
 const response=await fetch(url);assert.equal(response.status,200,url)
 const files=await new Bun.Archive(await response.arrayBuffer()).files()
 const hashes=JSON.parse(await files.get('checksums.json')!.text())
 for(const row of hashes.files)assert.equal(new Bun.CryptoHasher('sha256').update(await files.get(row.file)!.arrayBuffer()).digest('hex'),row.sha256,row.file)
 const meshes=[...files.keys()].filter(name=>name.includes('TEXTILE_REFERENCE_ONLY_')&&name.endsWith('.stl'))
 assert.equal(meshes.length,6)
 for(const mesh of meshes){const result=inspectBinaryStl(await files.get(mesh)!.arrayBuffer());assert.ok(result.closed&&result.consistentlyOriented&&result.components===1&&result.signedVolumeMm3>0)}
 for(const name of ['assembly.md','parts.scad','textile-bom.csv','saddle-shell.svg','front-bib.svg','saddle-shell.dxf','front-bib.dxf','closure-tabs.svg','chafe-rail.svg','chafe-bridge.svg','pattern-tiles.html','cost-notes.md'])assert.ok(files.has('softgoods/'+name),name)
 return files
}
try{
 await navigate(cdp,origin+'/design-studio-xl-suspension');await ready();await settle(cdp)
 const complete=await shot('xl-complete',true)
 await click(cdp,'label.studio-check:has(+ .studio-view-options) input');await ready();await settle(cdp)
 assert.notEqual(await shot('xl-frame-only',true),complete)
 await click(cdp,'label.studio-check:has(+ .studio-view-options) input');await ready()
 await click(cdp,'.studio-view-options button:last-child');await ready();await settle(cdp)
 const original=await shot('xl-supports',true)
 await input('trim','#c75880');await ready();assert.notEqual(await shot('xl-supports-color',true),original)
 const configured={slingWidth:340,slingLength:240,legWidth:80,legLength:140,drop:100,chest:1050}
 for(const [name,value]of Object.entries(configured))await input(name,String(value))
 await ready();assert.equal(await cdp.evaluate('document.querySelector("#standard-download button").disabled'),false)
 await click(cdp,'.textile-patterns summary');await settle(cdp)
 assert.ok(await cdp.evaluate('[...document.querySelectorAll(".textile-patterns img")].every(img=>img.complete&&img.naturalWidth>0)'))
 const textileUrl=await cdp.evaluate<string>('document.querySelector(".textile-patterns a").href')
 const files=await archive(textileUrl)
 assert.deepEqual(JSON.parse(await files.get('softgoods/setup.json')!.text()).setup,configured)
 assert.match(await files.get('softgoods/parts.scad')!.text(),/sg_width=340;sg_length=240;/)
 assert.equal(files.has('assembly-with-softgoods.scad'),false)
 const fullUrl=await cdp.evaluate<string>('(()=>{const f=document.getElementById("standard-download");return f.action+"?"+new URLSearchParams(new FormData(f))})()')
 const full=await archive(fullUrl);assert.ok(full.has('assembly-with-softgoods.scad'))
 assert.deepEqual(JSON.parse(await full.get('setup.json')!.text()).textiles.setup,configured)
 assert.equal(JSON.parse(await full.get('finish.json')!.text()).finish.trim,'#c75880')
 const html=await files.get('softgoods/pattern-tiles.html')!.text()
 const server=Bun.serve({port:0,fetch:()=>new Response(html,{headers:{'Content-Type':'text/html'}})})
 try{
  await navigate(cdp,server.url.toString());await cdp.send('Emulation.setEmulatedMedia',{media:'print'})
  const dimensions=await cdp.evaluate<number[]>('(()=>{const r=document.querySelector("section svg").getBoundingClientRect();return[r.width,r.height]})()')
  assert.ok(Math.abs(dimensions[0]!-190*96/25.4)<.1&&Math.abs(dimensions[1]!-240*96/25.4)<.1)
  await shot('paper-pattern');await cdp.send('Emulation.setEmulatedMedia',{media:''})
 }finally{server.stop(true)}
 await navigate(cdp,origin+'/design-studio-xl-suspension');await ready();await input('chest','1100')
 assert.equal(await cdp.evaluate('document.querySelector("#standard-download button").disabled'),true)
 await input('width','440');await ready();assert.equal(await cdp.evaluate('document.querySelector("#standard-download button").disabled'),false)
 await input('legWidth','130');await input('legLength','60');assert.equal(await cdp.evaluate('document.querySelector("#standard-download button").disabled'),true)
 for(const size of ['XS','S','M','L','XL']){
  await navigate(cdp,origin+'/design-studio?size='+size);await ready();await click(cdp,'.studio-view-options button:last-child');await ready()
  const url=await cdp.evaluate<string>('document.querySelector(".textile-patterns a").href')
  const kit=await archive(url);assert.equal(JSON.parse(await kit.get('softgoods/setup.json')!.text()).frame.size,size)
 }
 await navigate(cdp,origin+'/design-studio?size=XL');await ready();await input('slingLength','240')
 await click(cdp,'input[name="studio-size"][value="M"]');await ready();await click(cdp,'input[name="studio-size"][value="XL"]');await ready()
 assert.equal(await cdp.evaluate('document.querySelector("input[name=slingLength]").value'),'240')
 await navigate(cdp,origin+'/design-studio-xl');await ready();await archive(await cdp.evaluate<string>('document.querySelector(".textile-patterns a").href'))
 for(const width of [320,428,768,1440]){
  await cdp.send('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:width<768})
  for(const page of ['/design-studio?size=XS','/design-studio-xl','/design-studio-xl-suspension']){
   await navigate(cdp,origin+page);await ready();await click(cdp,'.textile-patterns summary');await settle(cdp)
   assert.equal(await cdp.evaluate('Math.max(0,document.documentElement.scrollWidth-innerWidth)'),0,page+' '+width)
   await cdp.evaluate('document.querySelector(".textile-controls").scrollIntoView({behavior:"instant",block:"start"})')
   await shot(page.replace(/[^a-z]/g,'')+'-'+width)
  }
 }
 await cdp.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-color-scheme',value:'dark'}]})
 await navigate(cdp,origin+'/design-studio-xl-suspension');await ready();await cdp.evaluate('document.querySelector(".textile-controls").scrollIntoView({behavior:"instant",block:"start"})');await shot('controls-dark')
 assert.deepEqual(cdp.errors,[])
 console.log(JSON.stringify({origin,allSevenKits:'passed',meshClosure:'passed',hashes:'passed',configuration:'passed',invalidDimensions:'passed',scopesAndColor:'passed',patterns:'passed',paperMillimeters:'passed',sizeMemory:'passed',widths:[320,428,768,1440],consoleErrors:[]}))
}finally{await browser.close()}

const fallback=await launch({args:['--disable-webgl','--disk-cache-size=1048576']})
try{
 await navigate(fallback.cdp,origin+'/design-studio-xl-suspension')
 await waitFor(()=>fallback.cdp.evaluate("document.querySelector('[data-stx-model-viewer]')?.dataset.modelStatus==='error'"),20000)
 assert.ok(await fallback.cdp.evaluate('(()=>{const img=document.querySelector(".stx-model-viewer-fallback img");return img.complete&&img.naturalWidth===1400&&img.src.includes("/softgoods/")})()'))
 assert.ok(await fallback.cdp.evaluate('!document.querySelector("#standard-download button").disabled'))
 console.log('WebGL fallback: complete textile poster and downloads available')
}finally{await fallback.close()}
