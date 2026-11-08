import {mkdir} from 'node:fs/promises'
import {join} from 'node:path'
import {inspectBinaryStl} from './Mesh'
import {sha256} from './XLStandardBuild'
import {springDocuments,springDimensions,springParts,springPartFile,springStart} from './XLSpring'
import {springCostModel,springCostMarkdown,springCostCsv} from './XLSpringCost'
export const springSourcePath='designs/wheelchair/r2/XL'
export const springPublicPath='public/designs/xl/r2'
export const springRequired=[...springParts.map(p=>'parts/'+springPartFile(p.id)),...springParts.filter(p=>p.kind==='metal').map(p=>'metal/'+p.id+'.dxf'),'source/suspension.scad','source/rigid.scad','model.scad','assembly.md','bom.csv','drilling.csv','setup.json','assembly.png','cost-notes.md','cost-model.json','costs.csv']
export async function springSourceHash(root:string) {return sha256(await Bun.file(join(root,springSourcePath,'source/rigid.scad')).text()+await Bun.file(join(root,springSourcePath,'source/suspension.scad')).text()+springDocuments(springStart)['model.scad'])}
export async function buildSpringCad(root:string,executable?:string) {
  const dir=join(root,springSourcePath);const pub=join(root,springPublicPath)
  for(const path of ['parts','metal','source']){await mkdir(join(dir,path),{recursive:true});await mkdir(join(pub,path),{recursive:true})}
  for(const [name,content] of Object.entries(springDocuments(springStart)))await Bun.write(join(dir,name),content)
  for(const [name,content] of Object.entries({'cost-notes.md':springCostMarkdown(),'cost-model.json':JSON.stringify(springCostModel(),null,2)+'\n','costs.csv':springCostCsv()}))await Bun.write(join(pub,name),content)
  await Bun.write(join(root,'docs/business/xl-spring-r2-costs.md'),springCostMarkdown());await Bun.write(join(root,'docs/business/xl-spring-r2-costs.csv'),springCostCsv())
  if(!executable)return
  const meshes:unknown[]=[]
  async function run(path:string,args:string[]){const proc=Bun.spawn([executable!,...args,'-o',join(dir,path),join(dir,'model.scad')],{env:{...process.env,QT_QPA_PLATFORM:'offscreen'},stdout:'pipe',stderr:'pipe'});const [code,out,err]=await Promise.all([proc.exited,new Response(proc.stdout).text(),new Response(proc.stderr).text()]);if(code||/ERROR:|WARNING:/.test(err))throw new Error(`r2 export ${path}: ${out}\n${err}`);if(path.endsWith('.stl')){const check=inspectBinaryStl(await Bun.file(join(dir,path)).arrayBuffer());if(!check.closed||!check.consistentlyOriented||check.components!==1||check.signedVolumeMm3<=0||check.boundsMm.size.some((n,i)=>n>(i===2?100:220)))throw new Error('Invalid r2 mesh: '+path);meshes.push({file:path,inspection:check})}}
  for(const part of springParts){await run('parts/'+springPartFile(part.id),['-D',`part="${part.id}"`,'--export-format','binstl']);if(part.kind==='metal')await run('metal/'+part.id+'.dxf',['-D',`part="${part.id}"`,'-D','projection_mode=true'])}
  await run('assembly.png',['-D','part="assembly"','--imgsize=1400,1000','--viewall','--autocenter','--colorscheme=Tomorrow','--camera=0,0,300,65,0,35,1800'])
  const assets=[]
  for(const path of springRequired){if(!path.startsWith('cost'))await Bun.write(join(pub,path),Bun.file(join(dir,path)));const bytes=new Uint8Array(await Bun.file(join(pub,path)).arrayBuffer());assets.push({path,sha256:sha256(bytes),bytes:bytes.length})}
  const sourceHash=await springSourceHash(root)
  const manifest={revision:'r2',size:'XL',status:'BENCH_ONLY_NOT_ANIMAL_USE',suspension:'UNDAMPED_PRELOAD_ADJUSTABLE',sourceHash,costHash:sha256(JSON.stringify(springCostModel())),setup:springStart,dimensions:springDimensions(springStart),assets,parts:springParts}
  await Bun.write(join(pub,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');await Bun.write(join(dir,'exports.json'),JSON.stringify(manifest,null,2)+'\n');await Bun.write(join(dir,'mesh-inspection.json'),JSON.stringify({sourceHash,status:'DIGITAL_GEOMETRY_ONLY',meshes},null,2)+'\n')
}
