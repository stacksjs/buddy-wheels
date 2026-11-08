import {expect,test} from 'bun:test'
import {cp,mkdtemp,rm} from 'node:fs/promises'
import {tmpdir} from 'node:os'
import {join} from 'node:path'
import {transformModelPoint} from '@stacksjs/browser/model-viewer'
import {designRoot} from '../../app/Designs/Wheelchair'
import {parseSpringSetup,springStart,springQuery,springDimensions,springBom,springParameters,springDrilling,springParts} from '../../app/Designs/XLSpring'
import {springEconomics,springCostLines,springMoney} from '../../app/Designs/XLSpringCost'
import {springScene} from '../../app/Designs/XLSpringScene'
import {springDownload} from '../../app/Designs/XLSpringDownloads'
import {springPublicPath,springSourcePath} from '../../app/Designs/XLSpringBuild'
import {sha256} from '../../app/Designs/XLStandardBuild'

test('r2 strict configuration roundtrips and rejects unsafe or ambiguous controls',()=>{
 expect(parseSpringSetup({})).toEqual(springStart)
 expect(parseSpringSetup(Object.fromEntries(new URLSearchParams(springQuery(springStart))))).toEqual(springStart)
 for(const bad of [Object.fromEntries([['__proto__','bad']]),{preload:3},{preload:0.5},{travel:9},{travel:-1},{travel:''},{preload:Infinity},{spring:'RC'},{height:499},{hub:82.551},{__proto__:null,rate:32.7}])expect(()=>parseSpringSetup(bad)).toThrow()
 const wrapper=springParameters(springStart)
 expect(wrapper.match(/preload=/g)?.length).toBe(1);expect(wrapper.match(/travel=/g)?.length).toBe(1)
 expect(springDrilling(springStart)).toContain('55 / 205.35')
 expect(springBom(springStart)).toContain('M5 x 70')
 expect(springBom(springStart)).toContain('"S05","16"')
 expect(10.1-Math.max(9.525,9,8.5)).toBeGreaterThan(.5)
})

test('r2 nominal travel, captured-seat, liner and guide geometry retain clearance at all configuration corners',()=>{
 for(const height of [500,760])for(const width of [320,520])for(const rail of [540,820])for(const hub of [60,100])for(const preload of [0,2])for(const travel of [0,8]){
  const s=parseSpringSetup({height,width,rail,hub,preload,travel});const d=springDimensions(s)
  expect(d.lowerPin-d.carriageBottom).toBeCloseTo(155-travel)
  expect(d.upperPin-4).toBeCloseTo(d.upperSeatBottom+3.175)
  expect(d.upperSeatBottom-preload-d.lowerSeatTop).toBeCloseTo(d.springLength)
  // Longest free spring + 0.2 slot end play still below maker's conservative deflection.
  expect(preload+travel+0.75+0.2).toBeLessThan(14.4)
  expect(d.upperSeatBottom-preload-(d.guideTop+6)).toBeGreaterThanOrEqual(3.9999)
  expect(d.housingBottom+d.housingLength).toBeCloseTo(d.loadedHeight-12.7)
  expect(d.nominalLinerGap).toBeCloseTo(.254)
  expect(d.tireClearance).toBeGreaterThan(4)
  expect(d.loadedHeight-60-d.upperPin).toBeGreaterThan(14)
  expect(d.overlap).toBeGreaterThanOrEqual(120)
 }
 const s={...springStart,preload:2,travel:8}
 const scene=springScene(s,'suspension');expect(scene.nodes.some(n=>n.id.startsWith('housing-'))).toBe(false)
 expect(transformModelPoint([0,0,0],scene.nodes.find(n=>n.id==='upper-seat-1')!.transform!)).toEqual([0,200,410.275])
 for(const n of scene.nodes.filter(n=>/^guide-(?:washer|head)-/.test(n.id))) {expect(n.geometry.kind).toBe('cylinder');if(n.geometry.kind==='cylinder')expect(n.geometry.radius*2).toBeLessThan(10.1)}
 expect(springScene(s).nodes.some(n=>n.id==='housing-1')).toBe(true)
 for(const part of springParts)expect(springScene(s,part.id).nodes[0]?.geometry.kind).toBe('stl')
})

test('r2 prices real quantity tier, whole stock, every BOM item and fails the unchanged margin gate honestly',()=>{
 expect(springDimensions(springStart).frameTubeTotal).toBe(2174.6);expect(springDimensions(springStart).housingTubeTotal).toBe(774.4)
 expect(springDimensions(springStart)).not.toHaveProperty('post')
 const b=springEconomics();expect(b.packing.bars).toBe(61);expect(b.housings.bars).toBe(50)
 expect(b.cogs).toBe(21744);expect(b.grossPercent).toBeCloseTo(27.2776,3);expect(b.headroom).toBe(-814)
 expect(b.contribution).toBe(2264);expect(b.freeShippingContribution).toBe(-136)
 expect(springEconomics(springStart,100,26500).meetsCostGate).toBe(false)
 expect(springCostLines.find(l=>l.id==='springs')?.batch).toBe(924)
 expect(springMoney(-814)).toBe('-$8.14')
 expect(springEconomics({...springStart,travel:8}).cogs).toBe(b.cogs)
 expect(springEconomics({...springStart,preload:2}).cogs-b.cogs).toBe(50)
 for(const q of [0,2,Infinity])expect(()=>springEconomics(springStart,q)).toThrow()
 expect(()=>springEconomics(springStart,100,25000)).toThrow()
 const coverage=springCostLines.flatMap(l=>[...l.coverage]);expect(new Set(coverage).size).toBe(coverage.length)
 for(const id of ['M04','M05','W01','W02','W03','W04','W05','W06','H01','H01L','H02','H02L','H03','H04','T01','S02','S03','S04','S05','S06','S07','S09','S10'])expect(coverage).toContain(id)
 // M01/M02/M03/S01 are whole-stock allocations; S08 is exact selected shim count.
 expect(springBom({...springStart,preload:2})).toContain('"S08","4"')
})

test('r2 configured downloads contain the actual exported files and reject incomplete, stale or tampered publication',async()=>{
 const s={...springStart,height:660,hub:80,preload:2,travel:8}
 const response=await springDownload(designRoot,'kit',s);expect(response.status).toBe(200)
 const files=await new Bun.Archive(await response.arrayBuffer()).files()
 expect([...files.keys()].filter(f=>f.endsWith('.stl')).length).toBe(8);expect([...files.keys()].filter(f=>f.endsWith('.dxf')).length).toBe(4)
 expect(JSON.parse(await files.get('setup.json')!.text()).setup).toEqual(s)
 expect(JSON.parse(await files.get('cost-model.json')!.text()).retails[1].cogs).toBe(springEconomics(s).cogs)
 expect(await files.get('model.scad')!.text()).toContain('travel=8;')
 expect(await files.get('assembly.md')!.text()).toContain('loaded rail height 652')
 const hashes=JSON.parse(await files.get('checksums.json')!.text());for(const item of hashes.files)expect(sha256(await files.get(item.file)!.arrayBuffer())).toBe(item.sha256)
 expect((await springDownload(designRoot,'unknown',s)).status).toBe(404)
 const temp=await mkdtemp(join(tmpdir(),'buddy-r2-'))
 try{
  await cp(join(designRoot,springPublicPath),join(temp,springPublicPath),{recursive:true});await cp(join(designRoot,springSourcePath),join(temp,springSourcePath),{recursive:true})
  const path=join(temp,springPublicPath,'manifest.json');const manifest=await Bun.file(path).json()
  await Bun.write(path,JSON.stringify({...manifest,assets:manifest.assets.slice(1)}));await expect(springDownload(temp,'kit',s)).rejects.toThrow('Incomplete')
  await Bun.write(path,JSON.stringify({...manifest,costHash:'old'}));await expect(springDownload(temp,'kit',s)).rejects.toThrow('Stale')
  await Bun.write(path,JSON.stringify(manifest));await Bun.write(join(temp,springPublicPath,'parts/end_cap.stl'),'bad');await expect(springDownload(temp,'kit',s)).rejects.toThrow('checksum')
  await Bun.write(join(temp,springSourcePath,'source/suspension.scad'),'changed');await expect(springDownload(temp,'kit',s)).rejects.toThrow('Stale')
 }finally{await rm(temp,{recursive:true,force:true})}
})
