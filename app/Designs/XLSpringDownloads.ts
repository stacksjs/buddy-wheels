import {join} from 'node:path'
import type {SpringSetup} from './XLSpring'
import {springCode,springDocuments} from './XLSpring'
import {springCostModel,springCostMarkdown,springCostCsv} from './XLSpringCost'
import {springSourceHash,springPublicPath,springRequired} from './XLSpringBuild'
import {sha256} from './XLStandardBuild'
export async function springDownload(root:string,artifact:string,setup:SpringSetup):Promise<Response>{
  const docs=springDocuments(setup)
  const attachment=(body:BodyInit,type:string,suffix:string)=>new Response(body,{headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Content-Type':type,'Content-Disposition':`attachment; filename="buddy-${springCode(setup)}${suffix}"`}})
  if(artifact==='assembly')return attachment(docs['assembly.md']!,'text/markdown; charset=utf-8','-assembly.md')
  if(artifact==='bom')return attachment(docs['bom.csv']!,'text/csv; charset=utf-8','-bom.csv')
  if(artifact==='profile')return attachment(docs['setup.json']!,'application/json','-setup.json')
  if(artifact!=='kit')return new Response('File not found.',{status:404})
  const pub=join(root,springPublicPath)
  const manifest=await Bun.file(join(pub,'manifest.json')).json() as {sourceHash:string,costHash:string,assets:{path:string,sha256:string}[]}
  if(manifest.assets.length!==springRequired.length||springRequired.some(p=>!manifest.assets.some(a=>a.path===p))||new Set(manifest.assets.map(a=>a.path)).size!==springRequired.length)throw new Error('Incomplete r2 manifest.')
  if(manifest.sourceHash!==await springSourceHash(root)||manifest.costHash!==sha256(JSON.stringify(springCostModel())))throw new Error('Stale r2 CAD or costs. Rebuild before delivery.')
  const files:Record<string,string|Uint8Array>={...docs,'README.md':'# Buddy XL r2 bench kit\n\nRead assembly.md first. No animal-use rating. Industrial metal spring, not a printed spring. Undamped, preload adjustable. Preview travel is not sag prediction. assembly.png is the default reference only. Costs are mostly unquoted.\n','cost-notes.md':springCostMarkdown(setup),'cost-model.json':JSON.stringify(springCostModel(setup),null,2)+'\n','costs.csv':springCostCsv(setup)}
  for(const asset of manifest.assets){if(!springRequired.includes(asset.path))throw new Error('Invalid r2 path.');const bytes=new Uint8Array(await Bun.file(join(pub,asset.path)).arrayBuffer());if(sha256(bytes)!==asset.sha256)throw new Error('r2 checksum mismatch.');if(asset.path.startsWith('source/')&&sha256(bytes)!==sha256(await Bun.file(join(root,'designs/wheelchair/r2/XL',asset.path)).arrayBuffer()))throw new Error('r2 public source mismatch.');if(!Object.hasOwn(files,asset.path))files[asset.path]=bytes}
  files['checksums.json']=JSON.stringify({revision:'r2',baselineSourceHash:manifest.sourceHash,configuredSourceHash:sha256(String(files['model.scad'])+sha256(files['source/suspension.scad']!)+sha256(files['source/rigid.scad']!)),files:Object.entries(files).map(([file,data])=>({file,sha256:sha256(data)}))},null,2)+'\n'
  return attachment(await new Bun.Archive(files,{compress:'gzip'}).blob(),'application/gzip','.tar.gz')
}
