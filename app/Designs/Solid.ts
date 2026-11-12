/**
 * Native exact solid kit for printable parts. No CAD kernel and no external executable.
 *
 * A part is a stack of extruded 2D regions along Z, optionally followed by one rigid
 * rotation into its print orientation. Boundary loops of neighbouring layers must never
 * touch or cross, which is what makes every interface face a plain nesting problem and
 * the result a closed, consistently wound, single-body mesh. Millimeters throughout.
 */
export type P2 = [number, number]
export type P3 = [number, number, number]
export interface Region { outer: P2[], holes?: P2[][] }
export interface Layer { height: number, regions: Region[] }
export type Triangle = [P3, P3, P3]

const EPS = 1e-9
export const signedArea = (p: P2[]) => p.reduce((sum, a, i) => { const b = p[(i + 1) % p.length]!; return sum + a[0] * b[1] - b[0] * a[1] }, 0) / 2
const ccw = (p: P2[]) => signedArea(p) < 0 ? [...p].reverse() : p
const cw = (p: P2[]) => signedArea(p) > 0 ? [...p].reverse() : p
const cross = (a: P2, b: P2, c: P2) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
const same = (a: P2, b: P2) => Math.abs(a[0] - b[0]) < EPS && Math.abs(a[1] - b[1]) < EPS

export function circle(d: number, cx = 0, cy = 0, segments = 48): P2[] {
  return Array.from({ length: segments }, (_, i) => { const a = i / segments * 2 * Math.PI; return [cx + d / 2 * Math.cos(a), cy + d / 2 * Math.sin(a)] as P2 })
}
export function rect(w: number, h: number, cx = 0, cy = 0): P2[] {
  return [[cx - w / 2, cy - h / 2], [cx + w / 2, cy - h / 2], [cx + w / 2, cy + h / 2], [cx - w / 2, cy + h / 2]]
}
export function roundedRect(w: number, h: number, r: number, cx = 0, cy = 0, segments = 6): P2[] {
  const points: P2[] = []
  for (const [sx, sy, start] of [[1, -1, -90], [1, 1, 0], [-1, 1, 90], [-1, -1, 180]] as const) {
    for (let i = 0; i <= segments; i++) { const a = (start + i / segments * 90) * Math.PI / 180; points.push([cx + sx * (w / 2 - r) + r * Math.cos(a), cy + sy * (h / 2 - r) + r * Math.sin(a)]) }
  }
  return points
}
/** Round every convex or concave corner of a simple polygon. Radius is clamped per corner. */
export function roundCorners(points: P2[], r: number, segments = 5): P2[] {
  const p = ccw(points); const out: P2[] = []
  for (let i = 0; i < p.length; i++) {
    const a = p[(i + p.length - 1) % p.length]!; const b = p[i]!; const c = p[(i + 1) % p.length]!
    const u: P2 = [a[0] - b[0], a[1] - b[1]]; const v: P2 = [c[0] - b[0], c[1] - b[1]]
    const lu = Math.hypot(...u); const lv = Math.hypot(...v)
    const angle = Math.acos(Math.max(-1, Math.min(1, (u[0] * v[0] + u[1] * v[1]) / lu / lv)))
    const cut = Math.min(r / Math.tan(angle / 2), lu / 2.01, lv / 2.01)
    if (!(cut > 0.05) || Math.abs(angle - Math.PI) < 1e-6) { out.push(b); continue }
    const start: P2 = [b[0] + u[0] / lu * cut, b[1] + u[1] / lu * cut]; const end: P2 = [b[0] + v[0] / lv * cut, b[1] + v[1] / lv * cut]
    for (let s = 0; s <= segments; s++) { const t = s / segments; const k = (1 - t) * (1 - t); const m = 2 * (1 - t) * t; const n = t * t; out.push([k * start[0] + m * b[0] + n * end[0], k * start[1] + m * b[1] + n * end[1]]) }
  }
  return out
}

function inside(point: P2, poly: P2[]): boolean {
  let hit = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[i]!; const b = poly[j]!
    if ((a[1] > point[1]) !== (b[1] > point[1]) && point[0] < (b[0] - a[0]) * (point[1] - a[1]) / (b[1] - a[1]) + a[0]) hit = !hit
  }
  return hit
}
function inTriangle(p: P2, a: P2, b: P2, c: P2, strict: boolean): boolean {
  const d1 = cross(a, b, p); const d2 = cross(b, c, p); const d3 = cross(c, a, p); const limit = strict ? EPS : -EPS
  return d1 > limit && d2 > limit && d3 > limit
}

/** Bridge one clockwise hole into a counter-clockwise outer loop through a mutually visible vertex. */
function bridge(outer: P2[], hole: P2[]): P2[] {
  let m = 0
  for (let i = 1; i < hole.length; i++) if (hole[i]![0] > hole[m]![0]) m = i
  const M = hole[m]!; let bestX = Infinity; let candidate = -1
  for (let i = 0; i < outer.length; i++) {
    const a = outer[i]!; const b = outer[(i + 1) % outer.length]!
    if ((a[1] > M[1]) === (b[1] > M[1])) continue
    const x = a[0] + (M[1] - a[1]) / (b[1] - a[1]) * (b[0] - a[0])
    if (x >= M[0] - EPS && x < bestX) { bestX = x; candidate = a[0] > b[0] ? i : (i + 1) % outer.length }
  }
  if (candidate < 0) throw new Error('Hole is not inside its outer loop.')
  const I: P2 = [bestX, M[1]]; let P = outer[candidate]!; let best = Infinity; let nearest = Infinity
  // A ray that lands on a vertex already sees it; the blocker search needs a real triangle.
  for (let i = 0; i < outer.length && Math.abs(cross(M, I, P)) > 1e-7; i++) {
    const q = outer[i]!
    if (same(q, P) || !inTriangle(q, M[1] < P[1] ? M : I, M[1] < P[1] ? I : M, P, false)) continue
    const angle = Math.abs(Math.atan2(q[1] - M[1], q[0] - M[0])); const reach = Math.hypot(q[0] - M[0], q[1] - M[1])
    if (angle < best - 1e-9 || (Math.abs(angle - best) <= 1e-9 && reach < nearest)) { best = angle; nearest = reach; candidate = i }
  }
  P = outer[candidate]!
  // An earlier bridge may have duplicated this vertex. Use the copy whose interior wedge faces the hole.
  const wedge = outer.findIndex((q, i) => {
    if (!same(q, P)) return false
    const a = outer[(i + outer.length - 1) % outer.length]!; const c = outer[(i + 1) % outer.length]!
    return cross(a, q, c) > 0 ? cross(a, q, M) > 0 && cross(q, c, M) > 0 : cross(a, q, M) > 0 || cross(q, c, M) > 0
  })
  if (wedge >= 0) candidate = wedge
  const ring = [...hole.slice(m), ...hole.slice(0, m)]
  return [...outer.slice(0, candidate + 1), ...ring, ring[0]!, P, ...outer.slice(candidate + 1)]
}

/** Ear clipping for one loop with holes. Returns counter-clockwise triangles. */
export function triangulate(outer: P2[], holes: P2[][] = []): [P2, P2, P2][] {
  let loop = ccw(outer)
  for (const hole of holes.map(cw).sort((a, b) => Math.max(...b.map(p => p[0])) - Math.max(...a.map(p => p[0])))) loop = bridge(loop, hole)
  const target = Math.abs(signedArea(outer)) - holes.reduce((sum, hole) => sum + Math.abs(signedArea(hole)), 0)
  const index = loop.map((_, i) => i); const triangles: [P2, P2, P2][] = []
  let guard = loop.length * loop.length + 100
  while (index.length > 3 && guard-- > 0) {
    let clipped = false
    for (const strict of [false, true]) {
      for (let i = 0; i < index.length && !clipped; i++) {
        const a = loop[index[(i + index.length - 1) % index.length]!]!; const b = loop[index[i]!]!; const c = loop[index[(i + 1) % index.length]!]!
        if (cross(a, b, c) <= 1e-10) continue
        if (index.some(k => { const q = loop[k]!; return !same(q, a) && !same(q, b) && !same(q, c) && inTriangle(q, a, b, c, strict) })) continue
        triangles.push([a, b, c]); index.splice(i, 1); clipped = true
      }
      if (clipped) break
    }
    if (!clipped) throw new Error('Could not triangulate profile.')
  }
  if (index.length === 3) triangles.push([loop[index[0]!]!, loop[index[1]!]!, loop[index[2]!]!])
  const area = triangles.reduce((sum, t) => sum + cross(t[0], t[1], t[2]) / 2, 0)
  if (Math.abs(area - target) > Math.max(1e-6, target * 1e-9)) throw new Error('Profile triangulation lost area.')
  return triangles.filter(t => cross(t[0], t[1], t[2]) > 1e-10)
}

/** True when any edge of one loop meets any edge of the other, including a shared point. */
function loopsTouch(a: P2[], b: P2[]): boolean {
  const side = (p: P2, q: P2, r: P2) => { const c = cross(p, q, r); return Math.abs(c) < 1e-9 ? 0 : Math.sign(c) }
  return a.some((p, i) => { const q = a[(i + 1) % a.length]!; return b.some((r, k) => { const t = b[(k + 1) % b.length]!; return side(p, q, r) !== side(p, q, t) && side(r, t, p) !== side(r, t, q) }) })
}
interface Loop { points: P2[], owner: 0 | 1 }
/** Faces of the plane between layer A below and layer B above: A only faces up, B only faces down. */
function interfaceFaces(a: Region[], b: Region[], z: number, out: Triangle[]): void {
  const loops: Loop[] = []
  a.forEach(region => { loops.push({ points: region.outer, owner: 0 }); region.holes?.forEach(h => loops.push({ points: h, owner: 0 })) })
  b.forEach(region => { loops.push({ points: region.outer, owner: 1 }); region.holes?.forEach(h => loops.push({ points: h, owner: 1 })) })
  const contains = loops.map((outer, i) => loops.map((inner, j) => {
    if (i === j) return false
    if (i < j && loopsTouch(inner.points, outer.points)) throw new Error('Layer outlines cross. Neighbouring outlines must be nested with a real gap.')
    return inside(inner.points[0]!, outer.points)
  }))
  loops.forEach((loop, i) => {
    const ancestors = loops.map((_, j) => j).filter(j => contains[j]![i])
    const children = loops.map((_, j) => j).filter(j => contains[i]![j] && !loops.some((_, k) => k !== i && k !== j && contains[i]![k] && contains[k]![j]))
    const count = (owner: 0 | 1) => ancestors.filter(j => loops[j]!.owner === owner).length + (loop.owner === owner ? 1 : 0)
    const inA = count(0) % 2 === 1; const inB = count(1) % 2 === 1
    if (inA === inB) return
    for (const t of triangulate(loop.points, children.map(j => loops[j]!.points))) {
      const lifted = t.map(p => [p[0], p[1], z] as P3) as Triangle
      out.push(inA ? lifted : [lifted[0], lifted[2], lifted[1]])
    }
  })
}

/** Build a closed mesh from stacked extrusions starting at z = 0. */
export function stack(layers: Layer[]): Triangle[] {
  const out: Triangle[] = []; let z = 0
  const clean = layers.map(layer => ({ height: layer.height, regions: layer.regions.map(r => ({ outer: ccw(r.outer), holes: (r.holes || []).map(cw) })) }))
  clean.forEach((layer, i) => {
    interfaceFaces(i ? clean[i - 1]!.regions : [], layer.regions, z, out)
    const top = z + layer.height
    for (const region of layer.regions) {
      for (const loop of [region.outer, ...region.holes]) {
        loop.forEach((p, k) => { const q = loop[(k + 1) % loop.length]!; out.push([[p[0], p[1], z], [q[0], q[1], z], [q[0], q[1], top]], [[p[0], p[1], z], [q[0], q[1], top], [p[0], p[1], top]]) })
      }
    }
    z = top
  })
  interfaceFaces(clean.at(-1)!.regions, [], z, out)
  return out
}

/** Proper rotations only, so triangle winding is preserved. */
export const turn = {
  /** Lay a part extruded along Z onto its Y = 0 side: new Z is the old Y. */
  layFlat: (t: Triangle[]): Triangle[] => t.map(tri => tri.map(([x, y, z]) => [x, -z, y] as P3) as Triangle),
  move: (t: Triangle[], dx: number, dy: number, dz: number): Triangle[] => t.map(tri => tri.map(([x, y, z]) => [x + dx, y + dy, z + dz] as P3) as Triangle),
}
/** Translate so the print sits on the bed with its minimum corner at the origin. */
export function seat(t: Triangle[]): Triangle[] {
  const min = [Infinity, Infinity, Infinity]
  for (const tri of t) for (const p of tri) for (let i = 0; i < 3; i++) min[i] = Math.min(min[i]!, p[i]!)
  return turn.move(t, -min[0]!, -min[1]!, -min[2]!)
}

export function binaryStl(triangles: Triangle[], header: string): Uint8Array {
  const bytes = new Uint8Array(84 + triangles.length * 50); const view = new DataView(bytes.buffer)
  bytes.set(new TextEncoder().encode(header.slice(0, 79)))
  view.setUint32(80, triangles.length, true)
  triangles.forEach(([p, q, r], i) => {
    const n = [(q[1] - p[1]) * (r[2] - p[2]) - (q[2] - p[2]) * (r[1] - p[1]), (q[2] - p[2]) * (r[0] - p[0]) - (q[0] - p[0]) * (r[2] - p[2]), (q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0])]
    const length = Math.hypot(...n) || 1
    ;[...n.map(v => v / length), ...p, ...q, ...r].forEach((v, j) => view.setFloat32(84 + i * 50 + j * 4, v, true))
  })
  return bytes
}

/** Flat fabrication profile, DXF R12 ASCII, millimeters. Closed polylines only. */
export function profileDxf(regions: Region[]): string {
  const f = (n: number) => (Math.round(n * 10000) / 10000).toString()
  const loop = (points: P2[], layer: string) => `0\nPOLYLINE\n8\n${layer}\n66\n1\n70\n1\n${points.map(p => `0\nVERTEX\n8\n${layer}\n10\n${f(p[0])}\n20\n${f(p[1])}\n`).join('')}0\nSEQEND\n`
  return `0\nSECTION\n2\nHEADER\n9\n$INSUNITS\n70\n4\n0\nENDSEC\n0\nSECTION\n2\nENTITIES\n${regions.map(r => loop(r.outer, 'OUTLINE') + (r.holes || []).map(h => loop(h, 'HOLES')).join('')).join('')}0\nENDSEC\n0\nEOF\n`
}
