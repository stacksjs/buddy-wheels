import type {ProductFinish} from '../Storefront/Finish'
import {finishDescription} from '../Storefront/Finish'
import {sha256} from './XLStandardBuild'
/** Add nongeometric finish instructions without rewriting reviewed CAD or baseline hashes. */
export async function finishDownload(response:Response,artifact:string,finish:ProductFinish):Promise<Response>{
 if(!response.ok)return response
 const headers=new Headers(response.headers)
 if(artifact==='profile'){const profile=await response.json();return new Response(JSON.stringify({...profile,finish},null,2)+'\n',{headers})}
 if(artifact==='assembly')return new Response(await response.text()+'\n\n## Selected finish\n\n'+finishDescription(finish)+'\n',{headers})
 if(artifact==='bom')return new Response(await response.text()+`"FINISH","1","Color preference","${finish.accent} service parts / ${finish.trim} textile trim","Availability and final pricing pending; no material substitution authorized"\n`,{headers})
 if(artifact!=='kit')return response
 const archive=await new Bun.Archive(await response.arrayBuffer()).files();const files:Record<string,string|Uint8Array>={}
 for(const [name,file] of archive)files[name]=new Uint8Array(await file.arrayBuffer())
 const previous=JSON.parse(new TextDecoder().decode(files['checksums.json'] as Uint8Array))
 files['finish.json']=JSON.stringify({finish,status:'COLOR_PREFERENCE_NOT_MATERIAL_APPROVAL',instructions:finishDescription(finish)},null,2)+'\n'
 const profileName=Object.hasOwn(files,'setup.json')?'setup.json':'profile.json'
 const profile=JSON.parse(new TextDecoder().decode(files[profileName] as Uint8Array))
 files[profileName]=JSON.stringify({...profile,finish},null,2)+'\n'
 files['assembly.md']=new TextDecoder().decode(files['assembly.md'] as Uint8Array)+'\n\n## Selected finish\n\n'+finishDescription(finish)+'\n'
 files['bom.csv']=new TextDecoder().decode(files['bom.csv'] as Uint8Array)+`"FINISH","1","Color preference","${finish.accent} service parts / ${finish.trim} trim","Availability and final price pending"\n`
 const records=Object.entries(files).filter(([file])=>file!=='checksums.json').map(([file,data])=>({file,sha256:sha256(data),bytes:typeof data==='string'?new TextEncoder().encode(data).length:data.length}))
 files['checksums.json']=JSON.stringify({...previous,finish,files:records},null,2)+'\n'
 return new Response(await new Bun.Archive(files,{compress:'gzip'}).blob(),{headers})
}
