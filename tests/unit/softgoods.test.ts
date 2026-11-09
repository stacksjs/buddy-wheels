import {expect,test}from 'bun:test'
import {softStart,softLimits,parseSoft,splitSoft,softQuery,textileMesh,textileStl,textileSvg}from '../../app/Designs/SoftGoods'
import {studioSoftFrame,xlSoftFrame}from '../../app/Designs/SoftGoodsFrame'
import {studioStartingSetup,studioSizes}from '../../app/Designs/StudioSetup'
import {standardStart}from '../../app/Designs/XLStandard'
import {softScene,softLayout}from '../../app/Designs/SoftGoodsScene'
import {softFiles}from '../../app/Designs/SoftGoodsDocuments'
import {softDownload}from '../../app/Designs/SoftGoodsDownloads'
import {springDownload}from '../../app/Designs/XLSpringDownloads'
import {springEconomics} from '../../app/Designs/XLSpringCost'
import {springStart}from '../../app/Designs/XLSpring'
import {finishDownload}from '../../app/Designs/FinishDownloads'
import {designRoot}from '../../app/Designs/Wheelchair'
import {defaultFinish}from '../../app/Storefront/Finish'
import {inspectBinaryStl}from '../../app/Designs/Mesh'
import {sha256}from '../../app/Designs/XLStandardBuild'
import {mkdtemp,rm} from 'node:fs/promises'
import {tmpdir} from 'node:os'
import {join} from 'node:path'
const frames=[...studioSizes.map(size=>studioSoftFrame(studioStartingSetup(size))),xlSoftFrame(standardStart,'r1'),xlSoftFrame(springStart,'r2')]
test('textile settings preserve mechanical boundaries and reject impossible openings or unsupported fields',()=>{
 for(const f of frames){const s=softStart(f);expect(parseSoft({},f)).toEqual(s);expect(parseSoft(Object.fromEntries(new URLSearchParams(softQuery(s))),f)).toEqual(s);expect(s.slingWidth).toBeLessThan(f.width-f.tube-16);expect(softLimits(f).drop[1]).toBeGreaterThanOrEqual(s.drop)}
 const f=frames.at(-1)!;for(const bad of [{drop:-1},{drop:NaN},{slingWidth:999},{legWidth:125,legLength:60},{slingLength:145,legLength:200},{legLength:200},{chest:'x'},{loadRating:140},Object.fromEntries([['__proto__','x']])])expect(()=>parseSoft(bad,f)).toThrow()
 expect(()=>parseSoft({chest:1100},xlSoftFrame(standardStart))).toThrow()
  expect(parseSoft({chest:1100},xlSoftFrame({...standardStart,width:440})).chest).toBe(1100)
  expect(splitSoft({height:620,drop:90,accent:'#254b38'})).toEqual({frame:{height:620,accent:'#254b38'},soft:{drop:90}})
})
test('all textile meshes are closed single bodies, have exact selected dimensions and are explicitly non-printable references',()=>{
 for(const f of frames){const s=softStart(f);for(const bib of [false,true])for(const t of [.8,1.5,5]){const bytes=textileStl(textileMesh(s,bib,t)),mesh=inspectBinaryStl(new Uint8Array(bytes).buffer);expect(mesh.closed).toBe(true);expect(mesh.consistentlyOriented).toBe(true);expect(mesh.components).toBe(1);expect(mesh.signedVolumeMm3).toBeGreaterThan(0);expect(mesh.boundsMm.size[2]).toBeCloseTo(t,5);if(!bib){expect(mesh.boundsMm.size[0]).toBeCloseTo(s.slingLength,4);expect(mesh.boundsMm.size[1]).toBeCloseTo(s.slingWidth,4)}expect(new TextDecoder().decode(bytes.slice(0,80))).toContain('Do not print')}
 const files=softFiles(f,s,defaultFinish);expect(Object.keys(files).filter(k=>k.endsWith('.stl')).length).toBe(6);expect(textileSvg(s)).toContain('mm"');expect(files['softgoods/pattern-tiles.html']).toContain('100% / Actual Size')
 const scene=softScene(f,s,defaultFinish);expect(scene.nodes.filter(n=>n.id.startsWith('soft-wrap-')).length).toBe(24);expect(scene.nodes.some(n=>n.id==='soft-front-buckle')).toBe(true);expect(scene.nodes.filter(n=>n.id.startsWith('soft-adjuster-')).length).toBe(30);expect(scene.nodes.filter(n=>n.id.includes('-cover-tab-')).length).toBe(10);expect(softLayout(f,s).straps.filter(p=>p.id.startsWith('rear-tail')).length).toBe(4)
 }
})
test('a configured full kit and textile-only kit include matching patterns, sewing plans, source and rewritten checksums',async()=>{
 const f=xlSoftFrame(springStart,'r2'),s=parseSoft({slingWidth:340,slingLength:240,legWidth:80,legLength:140,drop:100,chest:1050},f)
 const original=await springDownload(designRoot,'kit',springStart);const base=await new Bun.Archive(await original.clone().arrayBuffer()).files()
 const response=await finishDownload(await softDownload(designRoot,original,'kit',f,s,defaultFinish),'kit',defaultFinish)
 const files=await new Bun.Archive(await response.arrayBuffer()).files();expect(files.has('assembly-with-softgoods.scad')).toBe(true);expect(files.has('softgoods/kernel.ts')).toBe(true);expect(files.has('softgoods/export.ts')).toBe(true)
 expect(JSON.parse(await files.get('setup.json')!.text()).textiles.setup).toEqual(s);expect(JSON.parse(await files.get('cost-model.json')!.text()).retails[1].cogs).toBe(springEconomics(springStart,100,29900,s).cogs);expect(JSON.parse(await files.get('softgoods/cost-model.json')!.text()).demand.panels[0]).toEqual({width:340,length:240});expect(await files.get('softgoods/parts.scad')!.text()).toContain('sg_width=340;');expect(await files.get('softgoods/textile-bom.csv')!.text()).toContain('SG13')
 for(const [name,file]of base)if(name.endsWith('.scad')||name.startsWith('parts/'))expect(sha256(await files.get(name)!.arrayBuffer())).toBe(sha256(await file.arrayBuffer()))
 const checks=JSON.parse(await files.get('checksums.json')!.text());for(const row of checks.files)expect(sha256(await files.get(row.file)!.arrayBuffer())).toBe(row.sha256)
 const only=await softDownload(designRoot,new Response('Not found',{status:404}),'textiles',f,s,defaultFinish);expect(only.status).toBe(200);expect(only.headers.get('Content-Type')).toBe('application/gzip');const cloth=await new Bun.Archive(await only.arrayBuffer()).files();expect(cloth.has('assembly-with-softgoods.scad')).toBe(false);expect(cloth.has('softgoods/parts.scad')).toBe(true)
})

test('ribbons, hardware and chest dimensions stay consistent with the actual frame geometry',()=>{
 for(const frame of frames){
  const setup=softStart(frame),layout=softLayout(frame,setup),scene=softScene(frame,setup,defaultFinish)
  expect(layout.straps.filter(p=>p.id.startsWith('girth-')).reduce((n,p)=>n+Math.hypot(...p.a.map((v,i)=>v-p.b[i]!)),0)).toBeCloseTo(setup.chest,7)
  for(const tape of layout.straps.filter(p=>p.id.startsWith('rear-web-cross-')))expect(Math.abs(tape.a[0])-tape.width/2-setup.legLength/2).toBeGreaterThanOrEqual(3)
  for(const tape of layout.straps.filter(p=>p.id.startsWith('rear-web-long-')))expect(Math.abs(tape.a[1])-tape.width/2-(setup.slingWidth*.245+setup.legWidth/2)).toBeGreaterThanOrEqual(3)
  for(const tape of layout.straps.filter(p=>p.id.startsWith('rear-web-cross-rear-')))expect(tape.a[1]*tape.b[1]).toBeGreaterThan(0)
  for(const shoulder of layout.straps.filter(p=>p.id.startsWith('shoulder-')))expect(layout.straps.some(p=>p.id.startsWith('girth-')&&Math.hypot(...p.a.map((v,i)=>v-shoulder.b[i]!))<0.000001)).toBe(true)
  expect(layout.radius+.8).toBeLessThan((frame.width-frame.tube)/2)
  expect(scene.nodes.filter(n=>n.id.startsWith('soft-adjuster-')).length).toBe(30)
  expect(scene.nodes.filter(n=>n.id.includes('-cover-tab-')).length).toBe(10)
  for(const node of scene.nodes.filter(n=>n.id.startsWith('soft-rear-web-'))){expect(node.transform![2]).toBeCloseTo(0,8);expect(node.transform![10]).toBeCloseTo(0,8)}
  for(const keeper of layout.straps.filter(p=>p.id.startsWith('corner-keeper-'))){expect(keeper.a[0]===keeper.b[0]||keeper.a[1]===keeper.b[1]).toBe(true)}
 }
 const frame=xlSoftFrame(standardStart)
 expect(()=>parseSoft({chest:1100},frame)).toThrow()
 expect(parseSoft({chest:1100},xlSoftFrame({...standardStart,width:440})).chest).toBe(1100)
})

test('accepted textile range combinations keep load tapes outside openings',()=>{
 let accepted=0
 for(const frame of frames){
  const limits=softLimits(frame),start=softStart(frame)
  for(const slingWidth of [limits.slingWidth[0]!,start.slingWidth,limits.slingWidth[1]!])
   for(const slingLength of [limits.slingLength[0]!,start.slingLength,limits.slingLength[1]!])
    for(const legWidth of [limits.legWidth[0]!,start.legWidth,limits.legWidth[1]!])
     for(const legLength of [limits.legLength[0]!,start.legLength,limits.legLength[1]!]){
      let setup
      try{setup=parseSoft({...start,slingWidth,slingLength,legWidth,legLength},frame)}catch{continue}
      accepted++
      const layout=softLayout(frame,setup)
      for(const tape of layout.straps.filter(p=>p.id.startsWith('rear-web-cross-')))expect(Math.abs(tape.a[0])-tape.width/2-setup.legLength/2).toBeGreaterThanOrEqual(3)
      for(const tape of layout.straps.filter(p=>p.id.startsWith('rear-web-long-')))expect(Math.abs(tape.a[1])-tape.width/2-(setup.slingWidth*.245+setup.legWidth/2)).toBeGreaterThanOrEqual(3)
     }
 }
 expect(accepted).toBeGreaterThan(7)
})

test('the downloaded Bun source exporter reproduces matching reference meshes and rejects invalid changed profiles',async()=>{
 const frame=frames.at(-1)!,setup=softStart(frame),dir=await mkdtemp(join(tmpdir(),'buddy-textile-export-'))
 try{
  const response=await softDownload(designRoot,new Response('',{status:404}),'textiles',frame,setup,defaultFinish)
  const files=await new Bun.Archive(await response.arrayBuffer()).files()
  for(const name of ['kernel.ts','export.ts','setup.json'])await Bun.write(join(dir,name),files.get('softgoods/'+name)!)
  const process=Bun.spawn([Bun.env.BUN_EXEC_PATH||'bun',join(dir,'export.ts')],{stdout:'pipe',stderr:'pipe'})
  const error=await new Response(process.stderr).text()
  expect(await process.exited,error).toBe(0)
  expect(sha256(await Bun.file(join(dir,'regenerated-saddle-shell.stl')).arrayBuffer())).toBe(sha256(await files.get('softgoods/TEXTILE_REFERENCE_ONLY_rear_shell.stl')!.arrayBuffer()))
  await Bun.write(join(dir,'setup.json'),JSON.stringify({frame,setup:{...setup,legLength:200}}))
  const invalid=Bun.spawn(['bun',join(dir,'export.ts')],{stdout:'pipe',stderr:'pipe'})
  await new Response(invalid.stderr).text()
  expect(await invalid.exited).not.toBe(0)
 }finally{await rm(dir,{recursive:true,force:true})}
})
