import type { ProductFinish } from '../Storefront/Finish'
import type { SoftFrame, SoftSetup } from './SoftGoods'
import { join } from 'node:path'
import { softMainBom, softFiles, softInstructions } from './SoftGoodsDocuments'
import { sha256 } from './XLStandardBuild'

export async function softDownload(root:string, response:Response, artifact:string, f:SoftFrame, s:SoftSetup, finish:ProductFinish):Promise<Response>{
  if(!response.ok&&artifact!=='textiles')return response
  const docs = softFiles(f, s, finish)
  const headers = new Headers(response.headers); headers.set('Cache-Control', 'no-store'); headers.set('X-Content-Type-Options', 'nosniff')
  if(artifact==='profile')return new Response(JSON.stringify({...await response.json(), textiles:{frame:f, setup:s, status:'BENCH_ONLY_NOT_ANIMAL_USE'}}, null, 2)+'\n', {headers})
  if(artifact==='assembly')return new Response(await response.text()+'\n\n'+softInstructions(f, s, finish), {headers})
  if(artifact==='bom')return new Response(await response.text()+'\n'+softMainBom(f,s), {headers})
  if(artifact!=='kit'&&artifact!=='textiles')return response
  const files:Record<string, string|Uint8Array>={...docs}
  let previous:Record<string, unknown>={}
  if(artifact==='kit') {
    const base = await new Bun.Archive(await response.arrayBuffer()).files()
    for(const [name, file]of base)files[name] = new Uint8Array(await file.arrayBuffer())
    previous = JSON.parse(new TextDecoder().decode(files['checksums.json'] as Uint8Array))
    const profileName = Object.hasOwn(files, 'setup.json')?'setup.json':'profile.json'; const profile = JSON.parse(new TextDecoder().decode(files[profileName] as Uint8Array)); files[profileName] = JSON.stringify({...profile, textiles:{frame:f, setup:s, status:'BENCH_ONLY_NOT_ANIMAL_USE'}}, null, 2)+'\n'
    files['assembly.md'] = new TextDecoder().decode(files['assembly.md'] as Uint8Array)+'\n\n'+softInstructions(f, s, finish)
    files['bom.csv'] = new TextDecoder().decode(files['bom.csv'] as Uint8Array)+'\n'+softMainBom(f,s)
  }
  else {delete files['assembly-with-softgoods.scad']; files['README.md'] = '# Textile bench kit\n\nRead softgoods/assembly.md. Cut SVG/DXF patterns and inspect the non-printable reference meshes. Open softgoods/parts.scad for this configured textile assembly. The complete frame is in the full design kit. NOT FOR ANIMAL USE.\n'; headers.set('Content-Type', 'application/gzip'); headers.set('Content-Disposition', `attachment; filename="buddy-${f.size.toLowerCase()}-${f.revision}-textiles.tar.gz"`)}
  files['softgoods/kernel.ts'] = await Bun.file(join(root, 'app/Designs/SoftGoods.ts')).text()
  files['softgoods/export.ts'] = `import {textileMesh,textileStl,textileSvg,textileDxf,parseSoft} from './kernel'\nconst profile=await Bun.file(new URL('setup.json',import.meta.url)).json()\nconst setup=parseSoft(profile.setup,profile.frame)\nfor(const [name,bib]of [['saddle-shell',false],['front-bib',true]] as const){const mesh=textileMesh(setup,bib);for(const [extension,data]of [['svg',textileSvg(setup,bib)],['dxf',textileDxf(mesh)],['stl',textileStl(mesh)]] as const)await Bun.write(new URL('regenerated-'+name+'.'+extension,import.meta.url),data)}\nconsole.log('Regenerated cloth profiles only. Use the studio for a matching changed frame/anchor assembly. Not for animal use.')\n`
  files['softgoods/finish.json'] = JSON.stringify(finish, null, 2)+'\n'
  const records = Object.entries(files).filter(([file])=>file!=='checksums.json').map(([file, data])=>({file, sha256:sha256(data), bytes:typeof data==='string'?new TextEncoder().encode(data).length:data.length}))
  files['checksums.json'] = JSON.stringify({...previous, textiles:{frame:f, setup:s}, files:records}, null, 2)+'\n'
  return new Response(await new Bun.Archive(files, {compress:'gzip'}).blob(), {headers})
}
