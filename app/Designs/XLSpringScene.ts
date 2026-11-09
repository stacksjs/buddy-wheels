import {coilMesh} from './CoilMesh'
import type {ModelGeometry,ModelScene,ModelVector} from '@stacksjs/browser/model-viewer'
import {modelTransform} from '@stacksjs/browser/model-viewer'
import type {SpringSetup} from './XLSpring'
import {springDimensions,springParts,springPartFile} from './XLSpring'
import {standardScene} from './XLStandardScene'
/** Nominal inspection geometry, not force equilibrium or machining surfaces. */
export function springScene(s:SpringSetup,focus='assembly',exploded=false,revision='r2'):ModelScene {
  const d=springDimensions(s);const frame='#b4bfb8';const steel='#536358';const nodes:ModelScene['nodes']=[]
  const add=(id:string,geometry:ModelGeometry,color:string,pos:ModelVector,rot:ModelVector=[0,0,0])=>nodes.push({id,geometry,color,transform:modelTransform(pos,rot)})
  const part=(id:string,name:string,pos:ModelVector,rot:ModelVector=[0,0,0])=>add(id,{kind:'stl',src:'/designs/xl/r2/parts/'+springPartFile(name)+'?v='+revision},steel,pos,rot)
  if(springParts.some(p=>p.id===focus)){part('inspected-part',focus,[0,0,0]);return {nodes}}
  const base=standardScene({...s,height:d.loadedHeight},'assembly',exploded,revision)
  nodes.push(...base.nodes.filter(n=>!n.id.startsWith('post-')&&!n.id.startsWith('joint-')&&!n.id.startsWith('rail-bolt-')))
  if(focus==='suspension')nodes.splice(0,nodes.length,...nodes.filter(n=>!n.id.includes('rail')&&!n.id.includes('bridge')&&!n.id.includes('cap')))
  const cylinder=(id:string,diameter:number,length:number,pos:ModelVector,rot:ModelVector=[0,0,0],inner=0)=>add(id,{kind:'cylinder',radius:diameter/2,innerRadius:inner/2,length},steel,pos,rot)
  for(const side of [-1,1]){
    const y=side*s.width/2
    add('carriage-'+side,{kind:'tube',outer:25.4,inner:22.098,length:220},frame,[0,y,d.carriageBottom])
    if(focus!=='suspension')add('housing-'+side,{kind:'tube',outer:31.75,inner:28.448,length:d.housingLength},'#71897a',[0,y,d.housingBottom])
    for(const sign of [-1,1]){
      if(focus!=='suspension'){
        part(`joint-${side}-${sign}`,'joint_plate',[0,y+sign*(31.75/2+3.175/2+(exploded?16:0))+3.175/2,d.loadedHeight],[90,0,0])
        part(`rail-shim-${side}-${sign}`,'rail_shim',[0,y+sign*(25.4/2+3.175/2)+3.175/2,d.loadedHeight],[90,0,0])
      }
    }
    for(const [x,z,len] of [[-30,d.loadedHeight,25.4],[30,d.loadedHeight,25.4],[0,d.loadedHeight-35,31.75],[0,d.loadedHeight-60,31.75]]){
      if(focus==='suspension')continue
      cylinder(`joint-sleeve-${side}-${x}-${z}`,9.525,len!,[x!,y,z!],[90,0,0],7.0358)
      cylinder(`joint-bolt-${side}-${x}-${z}`,6.35,57.15,[x!,y,z!],[90,0,0])
    }
    for(const z of [d.lowerPin,d.upperPin]){
      cylinder(`pin-${side}-${z}`,8,45,[0,y,z],[90,0,0]);cylinder(`pin-head-${side}-${z}`,14,4,[0,y+24.5,z],[90,0,0]);cylinder(`pin-cotter-${side}-${z}`,2,18,[0,y-20,z])
      for(const sign of [-1,1])cylinder(`pin-washer-${side}-${z}-${sign}`,16,1.5,[0,y+sign*16.625,z],[90,0,0],8.4)
    }
    part('lower-seat-'+side,'spring_seat',[0,y,d.carriageTop]);part('upper-seat-'+side,'spring_seat',[0,y,d.upperSeatBottom])
    if(s.preload)cylinder('shim-'+side,20,s.preload,[0,y,d.upperSeatBottom-s.preload/2],[0,0,0],10)
    cylinder('guide-'+side,9.525,55,[0,y,d.lowerSeatTop+27.5],[0,0,0],7.0358)
    cylinder('guide-bolt-'+side,5,70,[0,y,d.carriageTop-10.825+35])
    cylinder('guide-washer-'+side,9,1,[0,y,d.lowerSeatTop+55.5],[0,0,0],5.3)
    cylinder('guide-head-'+side,8.5,5,[0,y,d.lowerSeatTop+58.5]);cylinder('guide-lower-washer-'+side,10,1,[0,y,d.carriageTop-.5],[0,0,0],5.3);cylinder('guide-nut-'+side,9.24,5,[0,y,d.carriageTop-3.5],[0,0,0],5)
    add('spring-'+side,coilMesh(d.springLength),'#bd983e',[0,y,d.lowerSeatTop])
    // Unslotted liner envelopes; final trimmed pattern must keep both slots clear.
    for(const z of [120,180])for(const face of [0,1,2,3]){
      const pos:ModelVector=face%2?[face===1?13.335:-13.335,y,d.carriageBottom+z+17.5]:[0,y+(face===0?13.335:-13.335),d.carriageBottom+z+17.5]
      add(`liner-${side}-${z}-${face}`,{kind:'box',size:face%2?[1.27,18,35]:[18,1.27,35]},'#e5e6d9',pos)
    }
  }
  return {nodes}
}
