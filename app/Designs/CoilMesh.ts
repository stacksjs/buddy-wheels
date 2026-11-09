import type {ModelGeometry,ModelVector} from '@stacksjs/browser/model-viewer'
/** Purchased-spring visualization envelope, not a spring manufacturing model. */
export function coilMesh(length:number):Extract<ModelGeometry,{kind:'mesh'}>{
 const steps=112,sides=8,turns=7,radius=7.5,wire=2.5,rise=(length-2*wire)/(turns*2*Math.PI)
 if(!Number.isFinite(length)||length<60||length>75)throw new Error('Invalid spring envelope length.')
 const vertices:ModelVector[]=[],triangles:[number,number,number][]=[]
 for(let i=0;i<=steps;i++){const t=i/steps*turns*2*Math.PI,cos=Math.cos(t),sin=Math.sin(t),norm=Math.hypot(radius,rise);const u:ModelVector=[cos,sin,0],v:ModelVector=[-rise*sin/norm,rise*cos/norm,-radius/norm]
  for(let j=0;j<sides;j++){const angle=j/sides*2*Math.PI;vertices.push([radius*cos+wire*(u[0]*Math.cos(angle)+v[0]*Math.sin(angle)),radius*sin+wire*(u[1]*Math.cos(angle)+v[1]*Math.sin(angle)),wire+rise*t+wire*v[2]*Math.sin(angle)])}
 }
 for(let i=0;i<steps;i++)for(let j=0;j<sides;j++){const a=i*sides+j,b=(i+1)*sides+j,c=(i+1)*sides+(j+1)%sides,d=i*sides+(j+1)%sides;triangles.push([a,c,b],[a,d,c])}
 for(const [row,reverse]of [[0,true],[steps,false]] as const){const center=vertices.length;const t=row/steps*turns*2*Math.PI;vertices.push([radius*Math.cos(t),radius*Math.sin(t),wire+rise*t]);for(let j=0;j<sides;j++){const a=row*sides+j,b=row*sides+(j+1)%sides;triangles.push(reverse?[center,b,a]:[center,a,b])}}
 return {kind:'mesh',vertices,triangles}
}
