export interface SoftFrame {size:string, revision:string, height:number, width:number, rail:number, tube:number, plate:number, bridgeX:number, frontX:number, travel:number}
export interface SoftSetup {slingWidth:number, slingLength:number, drop:number, chest:number, legWidth:number, legLength:number}
export const softKeys = ['slingWidth', 'slingLength', 'drop', 'chest', 'legWidth', 'legLength'] as const
export const chestEllipsePerimeter = Array.from({length:48},(_,i)=>{const a=i/48*2*Math.PI,b=(i+1)/48*2*Math.PI;return Math.hypot(Math.cos(b)-Math.cos(a),.85*(Math.sin(b)-Math.sin(a)))}).reduce((a,b)=>a+b,0)
export const maxChestForFrame = (f:SoftFrame) => Math.floor(((f.width-f.tube-8)/2*chestEllipsePerimeter)/5)*5
export function softStart(f:SoftFrame):SoftSetup {
 const ratio={XS:.32,S:.44,M:.62,L:.8,XL:1}[f.size]??1
 const slingWidth=Math.floor((f.width-f.tube-24)/5)*5
 const baseLength=Math.round(220*ratio/5)*5
 const chest=Math.min(Math.round(1100*ratio/5)*5,maxChestForFrame(f))
  const legLength=Math.max(20,Math.floor(baseLength*.56/5)*5)
 const webbing=chest<500?15:chest<800?20:25.4
 const legWidth=Math.max(10,Math.floor(Math.min(slingWidth*.22,2*(slingWidth*.255-webbing-6))/5)*5)
 const slingLength=Math.ceil(Math.max(baseLength,legLength+2*webbing+12)/5)*5
 return {legWidth,legLength,slingWidth,slingLength,drop:Math.round(90*ratio/5)*5,chest}
}
export function splitSoft(input:Record<string, unknown>) { const frame:Record<string, unknown>=Object.create(null); const soft:Record<string, unknown>=Object.create(null); for(const [key, value]of Object.entries(input))(softKeys.includes(key as typeof softKeys[number])?soft:frame)[key] = value; return {frame, soft}}
export function softLimits(f:SoftFrame) { const ratio = {XS:.32, S:.44, M:.62, L:.8, XL:1}[f.size]??1; return {slingWidth:[Math.max(80, Math.floor(140 * ratio / 5)*5), Math.floor((f.width - f.tube - 16)/5)*5], slingLength:[Math.ceil(140 * ratio / 5)*5, Math.floor(Math.min(340 * ratio, f.rail*.65)/5)*5], drop:[Math.ceil(30 * ratio / 5)*5, Math.floor(Math.min(180 * ratio, f.height*.4)/5)*5], chest:[Math.ceil(600 * ratio / 5)*5, Math.min(Math.floor(1600 * ratio / 5)*5,maxChestForFrame(f))], legWidth:[Math.max(10, Math.floor(25 * ratio / 5)*5), Math.floor(130 * ratio / 5)*5], legLength:[Math.max(20, Math.floor(60 * ratio / 5)*5), Math.floor(220 * ratio / 5)*5]}}
export function parseSoft(input:Record<string, unknown>, f:SoftFrame):SoftSetup { const s = softStart(f); const limits = softLimits(f); for(const key of Object.keys(input))if(!softKeys.includes(key as typeof softKeys[number]))throw new Error('Unknown textile dimension.'); for(const key of softKeys) { const v = input[key]??s[key]; if((typeof v!=='number'&&(typeof v!=='string'||!/^\d+$/.test(v)))||!Number.isInteger(Number(v))||Number(v)%5||Number(v)<limits[key][0]!||Number(v)>limits[key][1]!)throw new Error(`${key} must be ${limits[key][0]}-${limits[key][1]} mm in 5 mm steps.`); s[key] = Number(v)}const d = softDimensions(s); if(s.legWidth/2+d.webbing+6>s.slingWidth*.255||s.legWidth>s.legLength||s.legWidth / 2 + d.notch / 2 + Math.max(8, s.slingWidth*.035)>d.legCenter||s.legLength + 2*d.webbing + 12>s.slingLength)throw new Error('Leg openings must fit inside the saddle with clear end reinforcing tapes and leave at least 8 mm material around openings and the rear hygiene channel. Enlarge the saddle or reduce the openings.'); return s}
export const softQuery = (s:SoftSetup)=>new URLSearchParams(Object.entries(s).map(([k, v])=>[k, String(v)])).toString()
export function softDimensions(setup:SoftSetup) {
  const legWidth = setup.legWidth
  const legLength = setup.legLength
  const legCenter = setup.slingWidth * .245
  const notch = Math.min(30, setup.slingWidth * .1)
  const corner = Math.min(20, setup.slingLength * .1)
  const bibWidth = setup.chest * .15
  const bibLength = setup.chest * .2
  const webbing = setup.chest < 500 ? 15 : setup.chest < 800 ? 20 : 25.4
  return { legWidth, legLength, legCenter, notch, corner, bibWidth, bibLength, webbing }
}
export function wrapSchedule(frame:SoftFrame) {
 const railHalf = frame.tube / 2 + 3
 const bridgeHalf = Math.max(frame.tube, 28) / 2 + 3
 const bridgeHeight = (frame.tube + 2 * frame.plate) / 2 + 3
 return {rail:{half:railHalf,height:railHalf,perimeter:8*railHalf},bridge:{half:bridgeHalf,height:bridgeHeight,perimeter:4*(bridgeHalf+bridgeHeight)}}
}
export type Point = [number, number]
export interface TextileMesh {vertices:[number, number, number][], triangles:[number, number, number][], boundary:[Point, Point][]}
/** A strip triangulation shares every boundary vertex. No canvas/image or third-party CAD engine. */
export function textileMesh(s:SoftSetup, bib = false, thickness = .8):TextileMesh {
  const d = softDimensions(s); const length = bib?d.bibLength:s.slingLength, width = bib?d.bibWidth:s.slingWidth, r = Math.min(d.corner, length / 4, width / 4)
  const xs = new Set<number>(Array.from({length:97}, (_, i)=>-length / 2 + length * i / 96)); for(const x of [-length / 2 + r, length / 2 - r])xs.add(x)
  if(!bib)for(const x of [-d.legLength / 2, -(d.legLength - d.legWidth)/2, (d.legLength - d.legWidth)/2, d.legLength / 2, -d.notch / 2, 0])xs.add(x)
  const sorted = [...xs].sort((a, b)=>a - b); const vertices:TextileMesh['vertices'] = [], triangles:TextileMesh['triangles'] = []; const ids = new Map<string, number>(); const topEdges = new Map<string, {a:number, b:number, count:number}>()
  function vertex(x:number, y:number, z:number) { const key = [x, y, z].map(n=>n.toFixed(6)).join(','); let id = ids.get(key); if(id===undefined) {id = vertices.length; ids.set(key, id); vertices.push([x, y, z])}return id}
  function triangle(first: number, second: number, third: number, trackBoundary = false) {
    const a = vertices[first]!
    const b = vertices[second]!
    const c = vertices[third]!
    const nx = (b[1] - a[1]) * (c[2] - a[2]) - (b[2] - a[2]) * (c[1] - a[1])
    const ny = (b[2] - a[2]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[2] - a[2])
    const nz = (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
    if (Math.hypot(nx, ny, nz) < 0.00000001) return
    triangles.push([first, second, third])
    if (trackBoundary) {
      for (const [from, to] of [[first, second], [second, third], [third, first]]) {
        const key = [Math.min(from!, to!), Math.max(from!, to!)].join(':')
        const edge = topEdges.get(key)
        if (edge) edge.count++
        else topEdges.set(key, { a: from!, b: to!, count: 1 })
      }
    }
  }
  function outer(x:number) { const dx = Math.max(0, Math.abs(x)-(length / 2 - r)); return width / 2 - r + Math.sqrt(Math.max(0, r * r - dx * dx))}
  function intervals(x:number):[number, number][]{ const w = outer(x); if(bib)return [[-w, w]]; const radius = d.legWidth / 2, dx = Math.max(0, Math.abs(x)-(d.legLength - d.legWidth)/2); const hole = Math.abs(x)>d.legLength / 2?0:Math.sqrt(Math.max(0, radius * radius - dx * dx)); const nr = d.notch / 2; const notch = x< -nr?0:x < 0?Math.sqrt(Math.max(0, nr * nr - x * x)):nr; return [[-w, -d.legCenter - hole], [-d.legCenter + hole, -notch], [notch, d.legCenter - hole], [d.legCenter + hole, w]]}
  for(let i = 0; i<sorted.length - 1; i++) { const x = sorted[i]!, next = sorted[i + 1]!; const a = intervals(x), b = intervals(next); for(let j = 0; j<a.length; j++) { const low = a[j]!, high = b[j]!; const q = [vertex(x, low[0], thickness), vertex(next, high[0], thickness), vertex(next, high[1], thickness), vertex(x, low[1], thickness)]; triangle(q[0]!, q[1]!, q[2]!, true); triangle(q[0]!, q[2]!, q[3]!, true)}}
  const top = [...triangles]; for(const [a, b, c]of top) { const p = vertices[a]!, q = vertices[b]!, r = vertices[c]!; triangle(vertex(p[0], p[1], 0), vertex(r[0], r[1], 0), vertex(q[0], q[1], 0))}
  const boundary:TextileMesh['boundary'] = []; for(const edge of topEdges.values())if(edge.count===1) { const a = vertices[edge.a]!, b = vertices[edge.b]!; const aa = vertex(a[0], a[1], 0), bb = vertex(b[0], b[1], 0); triangle(edge.b, edge.a, aa); triangle(edge.b, aa, bb); boundary.push([[a[0], a[1]], [b[0], b[1]]])}
  return {vertices, triangles, boundary}
}
export function textileStl(mesh:TextileMesh):Uint8Array { const bytes = new Uint8Array(84 + mesh.triangles.length * 50), view = new DataView(bytes.buffer); bytes.set(new TextEncoder().encode('TEXTILE REFERENCE ONLY, millimeters. Do not print as animal support.')); view.setUint32(80, mesh.triangles.length, true); mesh.triangles.forEach((t, i)=>{ const p = mesh.vertices[t[0]]!, q = mesh.vertices[t[1]]!, r = mesh.vertices[t[2]]!; const n = [(q[1]-p[1])*(r[2]-p[2])-(q[2]-p[2])*(r[1]-p[1]), (q[2]-p[2])*(r[0]-p[0])-(q[0]-p[0])*(r[2]-p[2]), (q[0]-p[0])*(r[1]-p[1])-(q[1]-p[1])*(r[0]-p[0])]; const length = Math.hypot(...n); [...n.map(v=>v / length), ...p, ...q, ...r].forEach((v, j)=>view.setFloat32(84 + i * 50 + j * 4, v, true))}); return bytes}
export function textileDataUrl(bytes:Uint8Array):string { let str = ''; for(const byte of bytes)str+=String.fromCharCode(byte); return 'data:application/octet-stream;base64,'+btoa(str)}
export function textileSvg(s:SoftSetup, bib = false):string { const m = textileMesh(s, bib); const d = softDimensions(s); const length = bib?d.bibLength:s.slingLength, width = bib?d.bibWidth:s.slingWidth; const lines = m.boundary.map(([a, b])=>`M${(a[0]+length/2+20).toFixed(4)},${(a[1]+width/2+20).toFixed(4)}L${(b[0]+length/2+20).toFixed(4)},${(b[1]+width/2+20).toFixed(4)}`).join(' '); return `<svg xmlns="http://www.w3.org/2000/svg" width="${length+40}mm" height="${width+65}mm" viewBox="0 0 ${length+40} ${width+65}"><rect width="100%" height="100%" fill="white"/><path d="${lines}" fill="none" stroke="#111" stroke-width=".3"/><path d="M20 ${width+35}h50m-50 -2v4m50 -4v4" stroke="#111" stroke-width=".3"/><text x="20" y="${width+45}" font-size="4">50 mm check. Print at 100%. Bound cut edge, no fold allowance.</text><text x="20" y="${width+53}" font-size="4">${bib?'Front bib':'Rear support'} BENCH PATTERN. Not an animal-use release.</text></svg>`}
export function textileDxf(mesh:TextileMesh):string { return '0\nSECTION\n2\nHEADER\n9\n$INSUNITS\n70\n4\n0\nENDSEC\n0\nSECTION\n2\nENTITIES\n'+mesh.boundary.map(([a, b])=>`0\nLINE\n8\nCUT_MM\n10\n${a[0]}\n20\n${a[1]}\n30\n0\n11\n${b[0]}\n21\n${b[1]}\n31\n0\n`).join('')+'0\nENDSEC\n0\nEOF\n'}

export function textilePreviewSvg(setup:SoftSetup,bib=false):string {return textileSvg(setup,bib).replaceAll('stroke-width=".3"','stroke-width="1" vector-effect="non-scaling-stroke"')}
