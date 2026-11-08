import {expect,test} from 'bun:test'
import {parseFinish,finishNote,savedFinish,finishQuery,finishScene,defaultFinish,splitFinish} from '../../app/Storefront/Finish'
import {finishDownload} from '../../app/Designs/FinishDownloads'
import {springDownload} from '../../app/Designs/XLSpringDownloads'
import {studioDownload} from '../../app/Designs/StudioDownloads'
import {standardDownload} from '../../app/Designs/XLStandardDownloads'
import {springStart} from '../../app/Designs/XLSpring'
import {studioStartingSetup} from '../../app/Designs/StudioSetup'
import {standardStart} from '../../app/Designs/XLStandard'
import {standardScene} from '../../app/Designs/XLStandardScene'
import {designRoot} from '../../app/Designs/Wheelchair'
import {sha256} from '../../app/Designs/XLStandardBuild'
const custom={accent:'#286881',trim:'#8b3852'}
test('finish accepts only canonical colors, roundtrips saved basket data and isolates geometry',()=>{
 expect(parseFinish({})).toEqual(defaultFinish)
 expect(parseFinish({accent:'#AABBCC'}).accent).toBe('#aabbcc')
 for(const bad of [{accent:'red'},{trim:'url(javascript:x)'},{accent:'#fff'},{accent:['#ffffff']},{material:'PLA'},Object.fromEntries([['__proto__','bad']])])expect(()=>parseFinish(bad)).toThrow()
 expect(savedFinish(finishNote(custom))).toEqual(custom);expect(savedFinish('legacy notes')).toEqual(defaultFinish)
 expect(parseFinish(Object.fromEntries(new URLSearchParams(finishQuery(custom))))).toEqual(custom)
 expect(splitFinish({...custom,height:'620'})).toEqual({finish:custom,configuration:{height:'620'}})
 const scene=standardScene(standardStart);const next=finishScene(scene,custom)
 expect(next.nodes.find(n=>n.id==='front-cap-1')?.color).toBe(custom.accent)
 expect(next.nodes.find(n=>n.id==='axle-patch-1-1')?.color).toBe(scene.nodes.find(n=>n.id==='axle-patch-1-1')?.color)
 expect(next.nodes.map(n=>n.geometry)).toEqual(scene.nodes.map(n=>n.geometry))
 expect(scene.nodes.find(n=>n.id==='front-cap-1')?.color).not.toBe(custom.accent)
})
test('all studio revisions carry matching finish files and hashes without altering baseline CAD or printable binaries',async()=>{
 for(const original of [await springDownload(designRoot,'kit',springStart),await standardDownload(designRoot,'kit',standardStart),await studioDownload(designRoot,'kit',studioStartingSetup('XS'))]){
  const baseline=await new Bun.Archive(await original.clone().arrayBuffer()).files()
  const response=await finishDownload(original,'kit',custom);const files=await new Bun.Archive(await response.arrayBuffer()).files()
  expect(JSON.parse(await files.get('finish.json')!.text()).finish).toEqual(custom)
  expect(await files.get('assembly.md')!.text()).toContain('#286881')
  expect(await files.get('bom.csv')!.text()).toContain('#8b3852')
  for(const [name,file] of baseline)if(/\.(?:scad|stl|dxf)$/.test(name))expect(sha256(await files.get(name)!.arrayBuffer())).toBe(sha256(await file.arrayBuffer()))
  const checks=JSON.parse(await files.get('checksums.json')!.text());for(const row of checks.files)expect(sha256(await files.get(row.file)!.arrayBuffer())).toBe(row.sha256)
 }
})
