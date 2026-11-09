import type { ModelScene, ModelVector } from '@stacksjs/browser/model-viewer'
import type { ProductFinish } from '../Storefront/Finish'
import type { SoftFrame, SoftSetup } from './SoftGoods'
import { modelTransform, multiplyModelMatrices } from '@stacksjs/browser/model-viewer'
import { softDimensions, textileMesh, chestEllipsePerimeter, wrapSchedule } from './SoftGoods'

export interface StrapSegment {id:string, a:ModelVector, b:ModelVector, width:number}
export function softLayout(f:SoftFrame, s:SoftSetup) { const d = softDimensions(s), z = f.height - s.drop, bibX = f.frontX + Math.min(90, f.rail*.2), bibZ = f.height - s.chest*.06, frontAnchor = f.revision==='r0'?-100:-70, rearY = Math.max(d.webbing / 2 + 3,f.width/2-95); const straps:StrapSegment[] = []; const radius=s.chest/chestEllipsePerimeter
for(const side of [-1, 1]) {
  for(const end of [-1, 1])straps.push({id:`rear-tail-${side}-${end}`, a:[end*(s.slingLength / 2 - (d.webbing/2+3)), side*(s.slingWidth / 2 - (d.webbing/2+3)), z], b:end < 0?[frontAnchor, side * f.width / 2, f.height]:[f.bridgeX, side * rearY, f.height], width:d.webbing})
  straps.push({id:'front-tether-'+side, a:[bibX, side * d.bibWidth / 2, bibZ + d.bibLength*.3], b:[f.frontX + 35, side * f.width / 2, f.height], width:d.webbing})
  straps.push({id:'corner-keeper-long-'+side,a:[frontAnchor,side*f.width/2,f.height+f.tube/2+3],b:[f.bridgeX,side*f.width/2,f.height+f.tube/2+3],width:d.webbing});straps.push({id:'corner-keeper-cross-'+side,a:[f.bridgeX,side*f.width/2,f.height+f.tube/2+3],b:[f.bridgeX,side*rearY,f.height+f.tube/2+3],width:d.webbing})
  const shoulderAngle=side>0?Math.PI/3:2*Math.PI/3
  straps.push({id:'shoulder-'+side, a:[bibX, side * d.bibWidth*.35, bibZ + d.bibLength / 2], b:[bibX + 20, Math.cos(shoulderAngle)*radius, f.height + Math.sin(shoulderAngle)*radius*.85], width:d.webbing})
}
  for(let i = 0; i < 48; i++) { const a = i / 48 * 2*Math.PI, b = (i + 1)/48 * 2*Math.PI; straps.push({id:'girth-'+i, a:[bibX + 20, Math.cos(a)*radius, f.height + Math.sin(a)*radius*.85], b:[bibX + 20, Math.cos(b)*radius, f.height + Math.sin(b)*radius*.85], width:d.webbing})}
const endX=s.slingLength/2-(d.webbing/2+3),outerY=s.slingWidth/2-(d.webbing/2+3)
for(const side of [-1,1]) {
 straps.push({id:'rear-web-long-'+side,a:[-endX,side*outerY,z-1],b:[endX,side*outerY,z-1],width:d.webbing})
 straps.push({id:'rear-web-cross-rear-'+side,a:[endX,side*(d.notch/2+3),z-1],b:[endX,side*outerY,z-1],width:d.webbing})
}
straps.push({id:'rear-web-cross-front',a:[-endX,-outerY,z-1],b:[-endX,outerY,z-1],width:d.webbing})
return {straps, z, bibX, bibZ, frontAnchor, rearY, radius}
}
export function softScene(f:SoftFrame, s:SoftSetup, finish:ProductFinish, layers = true):ModelScene {
  const nodes:ModelScene['nodes'] = [], d = softDimensions(s), layout = softLayout(f, s)
  const add = (id:string, geometry:ModelScene['nodes'][number]['geometry'], color:string, p:ModelVector, r:ModelVector = [0, 0, 0])=>nodes.push({id, geometry, color, transform:modelTransform(p, r)})
  if(layers)for(const [id, bib, t, z, color]of [['rear-woven', false, .8, layout.z-.8, '#344039'], ['rear-foam', false, 5, layout.z, finish.trim], ['rear-mesh', false, 1.5, layout.z + 5, finish.trim], ['front-woven', true, .8, 0, '#344039'], ['front-foam', true, 5, 0, finish.trim], ['front-mesh', true, 1.5, 0, finish.trim]] as const) { const pos:ModelVector = bib?[layout.bibX+(id==='front-woven'?.8:id==='front-foam'?0:-5), 0, layout.bibZ]:[0, 0, z]; const mesh = textileMesh(s, bib, t); add('soft-'+id, {kind:'mesh', vertices:mesh.vertices, triangles:mesh.triangles}, color, pos, bib?[0, -90, 0]:[0, 0, 0])}
   function strapMatrix(strap:StrapSegment,fraction=.5) {
    const delta=strap.b.map((v,i)=>v-strap.a[i]!) as ModelVector,length=Math.hypot(...delta),t=delta.map(v=>v/length) as ModelVector
    let w:ModelVector
    if(strap.id.startsWith('girth-')) w=[1,0,0]
    else {const normal:ModelVector=strap.id.startsWith('shoulder-')?[1,0,0]:[0,0,1];w=[normal[1]*t[2]-normal[2]*t[1],normal[2]*t[0]-normal[0]*t[2],normal[0]*t[1]-normal[1]*t[0]];const size=Math.hypot(...w);w=size<.000001?[1,0,0]:w.map(v=>v/size) as ModelVector}
    const n:ModelVector=[t[1]*w[2]-t[2]*w[1],t[2]*w[0]-t[0]*w[2],t[0]*w[1]-t[1]*w[0]],center=strap.a.map((v,i)=>v+delta[i]!*fraction)
    return {length,matrix:[...w,0,...n,0,...t,0,...center,1]}
  }
  for(const strap of layout.straps) {
    const {length,matrix}=strapMatrix(strap)
    nodes.push({id:'soft-'+strap.id,geometry:{kind:'box',size:[strap.width,1.6,length]},color:'#303b35',transform:matrix})
  }
  function wrap(id:string,pos:ModelVector,axis:'X'|'Y') {
    const shape=wrapSchedule(f)[axis==='X'?'rail':'bridge'],half=shape.half,height=shape.height
    const points:ModelVector[]=axis==='X'?[[0,-half,-height],[0,half,-height],[0,half,height],[0,-half,height]]:[[-half,0,-height],[half,0,-height],[half,0,height],[-half,0,height]]
    for(let i=0;i<4;i++) {
      const a=points[i]!,b=points[(i+1)%4]!,mid=a.map((v,j)=>pos[j]!+(v+b[j]!)/2) as ModelVector
      add('soft-wrap-'+id+'-'+i,{kind:'box',size:axis==='X'?[d.webbing,i%2?1.6:half*2,i%2?height*2:1.6]:[i%2?1.6:half*2,d.webbing,i%2?height*2:1.6]},'#303b35',mid)
    }
  }
  for(const side of [-1, 1]) {wrap('front-'+side, [layout.frontAnchor, side * f.width / 2, f.height], 'X'); wrap('rear-'+side, [f.bridgeX, side * layout.rearY, f.height], 'Y'); wrap('harness-'+side, [f.frontX + 35, side * f.width / 2, f.height], 'X')}
  for(const strap of layout.straps.filter(p=>p.id.startsWith('rear-tail')||p.id.startsWith('front-tether'))) {
    const {matrix}=strapMatrix(strap,.78),w=d.webbing+8
    for(const [part,size,offset]of [['left',[3,3,24],[-w/2+1.5,-2.3,0]],['right',[3,3,24],[w/2-1.5,-2.3,0]],['top',[w-6,3,3],[0,-2.3,10.5]],['bottom',[w-6,3,3],[0,-2.3,-10.5]],['bar',[w-6,3,3],[0,-2.3,0]]] as const)nodes.push({id:'soft-adjuster-'+strap.id+'-'+part,geometry:{kind:'box',size:[...size]},color:'#88958d',transform:multiplyModelMatrices(matrix,modelTransform([...offset]))})
  }
  for(const side of [-1, 1]) { for(const fraction of [-.35, 0, .35])add('soft-rear-cover-tab-'+side+'-'+fraction, {kind:'box', size:[20, 12, 1.6]}, '#596d5d', [fraction * s.slingLength, side * s.slingWidth / 2, layout.z + 2.5]); for(const fraction of [-.3, .3])add('soft-front-cover-tab-'+side+'-'+fraction, {kind:'box', size:[1.6, 12, 20]}, '#596d5d', [layout.bibX - 2.5, side * d.bibWidth / 2, layout.bibZ + fraction * d.bibLength])}
  add('soft-front-buckle', {kind:'box', size:[12, d.webbing + 8, 40]}, '#253129', [layout.bibX + 20, -layout.radius, f.height])
  // Sparse crossing lines communicate bought spacer mesh, not laser-cut ventilation holes.
  for(let i = -3; i<=3; i++)add('soft-mesh-mark-'+i, {kind:'box', size:[.4, d.bibWidth*.8, .6]}, '#65796b', [layout.bibX - 6.8, 0, layout.bibZ + i * d.bibLength / 9])
  return {nodes}
}
