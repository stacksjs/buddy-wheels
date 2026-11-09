import {writeXLCompleteCosts} from './XLCompleteCosts'
import {mkdir} from 'node:fs/promises'
import {join} from 'node:path'
import {studioStartingSetup,studioSizes} from './StudioSetup'
import {standardStart} from './XLStandard'
import {studioSoftFrame,xlSoftFrame} from './SoftGoodsFrame'
import {softStart} from './SoftGoods'
import {softFiles,softInstructions} from './SoftGoodsDocuments'
import {softDownload} from './SoftGoodsDownloads'
import {studioDownload} from './StudioDownloads'
import {standardDownload} from './XLStandardDownloads'
import {springDownload} from './XLSpringDownloads'
import {springStart} from './XLSpring'
import {defaultFinish} from '../Storefront/Finish'
import {inspectBinaryStl} from './Mesh'
import {sha256} from './XLStandardBuild'
export const softSourceFiles=['SoftGoods.ts','SoftGoodsFrame.ts','SoftGoodsScene.ts','SoftGoodsDocuments.ts','SoftGoodsCost.ts','SoftGoodsBill.ts','TextilePurchases.ts']
export async function softCodeHash(root:string){return sha256((await Promise.all(softSourceFiles.map(name=>Bun.file(join(root,'app/Designs',name)).text()))).join('\n'))}
export async function buildSoftGoods(root:string,openscad?:string){
 const frames=[...studioSizes.map(size=>studioSoftFrame(studioStartingSetup(size))),xlSoftFrame(standardStart,'r1'),xlSoftFrame({...standardStart,travel:0},'r2')]
 const records=[]
 for(const f of frames){
  const setup=softStart(f),files=softFiles(f,setup,defaultFinish),folder=f.size+'-'+f.revision,dir=join(root,'designs/softgoods/r1',folder);await mkdir(dir,{recursive:true});const assets=[]
  for(const [name,data]of Object.entries(files)){
   await Bun.write(join(dir,name),data)
   if(name.endsWith('.stl')){const inspection=inspectBinaryStl(new Uint8Array(data as Uint8Array).buffer);if(!inspection.closed||!inspection.consistentlyOriented||inspection.components!==1||inspection.signedVolumeMm3<=0)throw new Error('Invalid textile reference mesh: '+name)}
   assets.push({file:name,sha256:sha256(data)})
  }
  if(f.size==='XL'&&f.revision==='r2')await Bun.write(join(root,'docs/engineering/softgoods-xl-r1.md'),softInstructions(f,setup,defaultFinish))
  let previewHash=''
  if(openscad){
   const baseline=f.revision==='r0'?await studioDownload(root,'kit',studioStartingSetup(f.size as typeof studioSizes[number])):f.revision==='r1'?await standardDownload(root,'kit',standardStart):await springDownload(root,'kit',springStart)
   const kit=await new Bun.Archive(await (await softDownload(root,baseline,'kit',f,setup,defaultFinish)).arrayBuffer()).files()
   const scratch=join(root,'storage/framework/runtime/softgoods-preview',folder);await mkdir(scratch,{recursive:true})
   for(const [name,file]of kit){if(name.startsWith('/')||name.split('/').includes('..'))throw new Error('Invalid preview path.');await Bun.write(join(scratch,name),file)}
   async function run(input:string,output:string,args:string[]){const process=Bun.spawn([openscad!,...args,'-o',output,input],{env:{...Bun.env,QT_QPA_PLATFORM:'offscreen'},stdout:'pipe',stderr:'pipe'});const [code,err]=await Promise.all([process.exited,new Response(process.stderr).text()]);if(code||/ERROR:|WARNING:/.test(err))throw new Error(err)}
   const preview=join(root,'public/designs/softgoods/r1',folder,'assembly.png');await mkdir(join(root,'public/designs/softgoods/r1',folder),{recursive:true})
   await run(join(scratch,'assembly-with-softgoods.scad'),preview,['--imgsize=1400,1000','--viewall','--autocenter','--colorscheme=Tomorrow','--camera=0,0,300,65,0,35,1800'])
   previewHash=sha256(await Bun.file(preview).arrayBuffer())
   if(f.size==='XL'&&f.revision==='r2')for(const part of ['rear_shell','rear_pad','rear_mesh','front_shell','front_pad','front_mesh']){
    const output=join(root,'storage/framework/runtime',part+'-openscad.stl');await run(join(dir,'softgoods/parts.scad'),output,['-D',`sg_part="${part}"`,'--export-format','binstl'])
    const inspection=inspectBinaryStl(await Bun.file(output).arrayBuffer()),reference=inspectBinaryStl(new Uint8Array(files['softgoods/TEXTILE_REFERENCE_ONLY_'+part+'.stl'] as Uint8Array).buffer)
    if(!inspection.closed||!inspection.consistentlyOriented||inspection.components!==1||inspection.signedVolumeMm3<=0||Math.abs(inspection.signedVolumeMm3/reference.signedVolumeMm3-1)>.01)throw new Error('Native/OpenSCAD textile profile mismatch: '+part)
   }
  }
  records.push({frame:f,setup,assets,previewHash,preview:'/designs/softgoods/r1/'+folder+'/assembly.png'})
 }
 const manifest={revision:'textile-r1',status:'BENCH_ONLY_NOT_ANIMAL_USE',sourceHash:await softCodeHash(root),records}
 await Bun.write(join(root,'designs/softgoods/r1/manifest.json'),JSON.stringify(manifest,null,2)+'\n')
 if(openscad)await Bun.write(join(root,'public/designs/softgoods/r1/manifest.json'),JSON.stringify(manifest,null,2)+'\n')
 await writeXLCompleteCosts(root)
 return manifest
}
