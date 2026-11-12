/**
 * A small boundary-representation kit and STEP AP214 writer for one kind of solid:
 * a square tube with flat ends that may be tilted, and round holes cut through single walls.
 * It exists so a tube laser service can cut and drill frame tubes from a file. No CAD program is involved.
 */
export type V3 = [number, number, number]
type Curve = { kind: 'line' } | { kind: 'circle', center: V3, axis: V3, radius: number }
/** An edge runs from vertex a to vertex b. A circular edge runs counter-clockwise about its axis. */
interface Edge { a: number, b: number, curve: Curve }
interface Use { edge: number, forward: boolean }
type Surface = { kind: 'plane', origin: V3, normal: V3 } | { kind: 'cylinder', origin: V3, axis: V3, radius: number }
/** The first loop is the outer boundary. sameSense is false where the solid's outward normal opposes the surface normal. */
interface Face { surface: Surface, sameSense: boolean, loops: Use[][] }
export interface Brep { vertices: V3[], edges: Edge[], faces: Face[] }

/** A hole along the X or Y axis of the section, centered on the face, z from end 0 along the tube. It goes through both walls unless wall names the one wall, on the positive or negative side of the axis, that it stops at. */
export interface TubeHole { axis: 'x' | 'y', z: number, diameter: number, wall?: 1 | -1 }
/**
 * The tube runs along Z from 0 to length, measured down its centerline. The section is square about the origin.
 * End planes tilt about X only: end 0 is z = -tan0 * y and end 1 is z = length - tan1 * y.
 */
export interface TubeSpec { outer: number, wall: number, length: number, tan0?: number, tan1?: number, holes: TubeHole[] }

const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const unit = (a: V3): V3 => { const n = Math.hypot(a[0], a[1], a[2]); return [a[0] / n, a[1] / n, a[2] / n] }
const neg = (a: V3): V3 => [-a[0], -a[1], -a[2]]

export function tubeBrep(spec: TubeSpec): Brep {
  const H = spec.outer / 2; const Hi = H - spec.wall; const t0 = spec.tan0 ?? 0; const t1 = spec.tan1 ?? 0; const L = spec.length
  const vertices: V3[] = []; const edges: Edge[] = []; const faces: Face[] = []; const lines = new Map<string, number>()
  const vertex = (p: V3) => vertices.push(p) - 1
  /** The straight edge between two vertices, created once and then used in the direction asked for. */
  const line = (a: number, b: number): Use => {
    const key = a < b ? `${a}-${b}` : `${b}-${a}`
    let edge = lines.get(key)
    if (edge === undefined) { edge = edges.push({ a: Math.min(a, b), b: Math.max(a, b), curve: { kind: 'line' } }) - 1; lines.set(key, edge) }
    return { edge, forward: edges[edge]!.a === a }
  }
  /** A closed polygon of straight edges, counter-clockwise when seen from the side the normal points to. */
  const ring = (ids: number[], normal: V3): Use[] => {
    const sum: V3 = [0, 0, 0]
    ids.forEach((id, i) => { const p = vertices[id]!; const q = vertices[ids[(i + 1) % ids.length]!]!; sum[0] += (p[1] - q[1]) * (p[2] + q[2]); sum[1] += (p[2] - q[2]) * (p[0] + q[0]); sum[2] += (p[0] - q[0]) * (p[1] + q[1]) })
    const order = dot(sum, normal) >= 0 ? ids : [...ids].reverse()
    return order.map((id, i) => line(id, order[(i + 1) % order.length]!))
  }
  const corners: [number, number][] = [[1, 1], [-1, 1], [-1, -1], [1, -1]]
  // corner[end][layer][k]: layer 0 is the outside of the tube, layer 1 the bore.
  const corner = [0, 1].map(end => [H, Hi].map(h => corners.map(([sx, sy]) => vertex([sx * h, sy * h, end ? L - t1 * sy * h : -t0 * sy * h]))))
  // Side faces, four outside and four in the bore, keyed by the direction the outside face looks.
  const side = new Map<string, Face>()
  for (const layer of [0, 1]) corners.forEach(([sx, sy], k) => {
    const [nx, ny] = corners[(k + 1) % 4]!; const out: V3 = [(sx + nx) / 2, (sy + ny) / 2, 0]; const normal = layer ? neg(out) : out; const h = layer ? Hi : H
    const face: Face = { surface: { kind: 'plane', origin: [out[0] * h, out[1] * h, 0], normal }, sameSense: true, loops: [ring([corner[0]![layer]![k]!, corner[0]![layer]![(k + 1) % 4]!, corner[1]![layer]![(k + 1) % 4]!, corner[1]![layer]![k]!], normal)] }
    faces.push(face); side.set(`${layer}:${out[0]},${out[1]}`, face)
  })
  // End faces: a square ring on each end plane.
  for (const end of [0, 1]) {
    const normal = unit(end ? [0, t1, 1] : [0, -t0, -1])
    faces.push({ surface: { kind: 'plane', origin: [0, 0, end ? L : 0], normal }, sameSense: true, loops: [ring(corner[end]![0]!, normal), ring(corner[end]![1]!, neg(normal))] })
  }
  // Holes: one round cut through each wall the hole passes through.
  for (const hole of spec.holes) for (const s of hole.wall ? [hole.wall] : [1, -1]) {
    const out: V3 = hole.axis === 'x' ? [s, 0, 0] : [0, s, 0]; const r = hole.diameter / 2
    const at = (h: number, dz: number): V3 => [out[0] * h, out[1] * h, hole.z + dz]
    const op = vertex(at(H, r)); const om = vertex(at(H, -r)); const ip = vertex(at(Hi, r)); const im = vertex(at(Hi, -r))
    const arc = (a: number, b: number, h: number) => edges.push({ a, b, curve: { kind: 'circle', center: at(h, 0), axis: out, radius: r } }) - 1
    // Each circle is two half turns about the outward axis: top to bottom, then bottom to top.
    const a1 = arc(op, om, H); const a2 = arc(om, op, H); const b1 = arc(ip, im, Hi); const b2 = arc(im, ip, Hi)
    side.get(`0:${out[0]},${out[1]}`)!.loops.push([{ edge: a2, forward: false }, { edge: a1, forward: false }])
    side.get(`1:${out[0]},${out[1]}`)!.loops.push([{ edge: b1, forward: true }, { edge: b2, forward: true }])
    const wall: Surface = { kind: 'cylinder', origin: at(H, 0), axis: out, radius: r }
    faces.push({ surface: wall, sameSense: false, loops: [[{ edge: a1, forward: true }, line(om, im), { edge: b1, forward: false }, line(ip, op)]] })
    faces.push({ surface: wall, sameSense: false, loops: [[{ edge: a2, forward: true }, line(op, ip), { edge: b2, forward: false }, line(im, om)]] })
  }
  return { vertices, edges, faces }
}

/** Topology and geometry checks that need no CAD kernel: a closed, consistently oriented shell, and vertices that lie on their faces. */
export function inspectBrep(brep: Brep) {
  const problems: string[] = []; const forward = brep.edges.map(() => 0); const backward = brep.edges.map(() => 0); let loops = 0
  for (const [f, face] of brep.faces.entries()) for (const loop of face.loops) {
    loops++
    loop.forEach((use, i) => {
      const edge = brep.edges[use.edge]!; const next = loop[(i + 1) % loop.length]!; const nextEdge = brep.edges[next.edge]!
      if (use.forward) forward[use.edge]!++; else backward[use.edge]!++
      if ((use.forward ? edge.b : edge.a) !== (next.forward ? nextEdge.a : nextEdge.b)) problems.push(`face ${f}: loop is not closed`)
      for (const id of [edge.a, edge.b]) {
        const p = brep.vertices[id]!; const s = face.surface
        const off = s.kind === 'plane' ? dot(sub(p, s.origin), s.normal) : Math.hypot(...sub(sub(p, s.origin), [s.axis[0] * dot(sub(p, s.origin), s.axis), s.axis[1] * dot(sub(p, s.origin), s.axis), s.axis[2] * dot(sub(p, s.origin), s.axis)] as V3)) - s.radius
        if (Math.abs(off) > 1e-6) problems.push(`face ${f}: vertex ${id} is ${off.toFixed(6)} off its surface`)
      }
    })
  }
  brep.edges.forEach((_, e) => { if (forward[e] !== 1 || backward[e] !== 1) problems.push(`edge ${e} is used ${forward[e]} forward and ${backward[e]} backward`) })
  // Euler-Poincare for one shell: V - E + F - (L - F) = 2 - 2 * genus.
  const euler = brep.vertices.length - brep.edges.length + brep.faces.length - (loops - brep.faces.length)
  return { vertices: brep.vertices.length, edges: brep.edges.length, faces: brep.faces.length, loops, genus: (2 - euler) / 2, closed: problems.length === 0, problems }
}

/**
 * Volume enclosed by the faces, by summing signed tetrahedra to the origin. Flat faces are fanned from a point on their plane along
 * each loop as it is traversed, and each hole wall is stripped between its two arcs. A face or loop that runs the wrong way round
 * shows up as a wrong volume, which the edge-pairing check alone would not catch.
 */
export function brepVolume(brep: Brep, steps = 64): number {
  const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
  /** Points along one edge use, in the direction of travel, both ends included. */
  const trace = (use: Use): V3[] => {
    const edge = brep.edges[use.edge]!; const a = brep.vertices[edge.a]!; const b = brep.vertices[edge.b]!
    if (edge.curve.kind === 'line') return use.forward ? [a, b] : [b, a]
    const { center, axis, radius } = edge.curve; const u = unit(sub(a, center)); const v = cross(axis, u)
    const points = Array.from({ length: steps + 1 }, (_, i): V3 => { const t = Math.PI * i / steps; return [center[0] + radius * (Math.cos(t) * u[0] + Math.sin(t) * v[0]), center[1] + radius * (Math.cos(t) * u[1] + Math.sin(t) * v[1]), center[2] + radius * (Math.cos(t) * u[2] + Math.sin(t) * v[2])] })
    return use.forward ? points : points.reverse()
  }
  let six = 0
  const tetra = (a: V3, b: V3, c: V3) => { six += dot(a, cross(b, c)) }
  for (const face of brep.faces) {
    if (face.surface.kind === 'plane') {
      for (const loop of face.loops) for (const use of loop) { const points = trace(use); for (let i = 0; i + 1 < points.length; i++) tetra(face.surface.origin, points[i]!, points[i + 1]!) }
      continue
    }
    // A hole wall is one loop: arc, seam, arc, seam. The second arc runs back against the first.
    const arcs = face.loops[0]!.filter(use => brep.edges[use.edge]!.curve.kind === 'circle').map(trace); const p = arcs[0]!; const q = arcs[1]!
    for (let i = 0; i < steps; i++) { tetra(p[i]!, p[i + 1]!, q[steps - i - 1]!); tetra(p[i]!, q[steps - i - 1]!, q[steps - i]!) }
  }
  return six / 6
}

const real = (n: number) => { const text = (Math.abs(n) < 5e-7 ? 0 : n).toFixed(6).replace(/0+$/, ''); return text }
const triple = (v: V3) => `(${v.map(real).join(',')})`
/** Any unit direction square to n. */
const square = (n: V3): V3 => { const seed: V3 = Math.abs(n[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0]; const k = dot(seed, n); return unit([seed[0] - k * n[0], seed[1] - k * n[1], seed[2] - k * n[2]]) }

/** One solid as a STEP AP214 file, millimeters. */
export function stepFile(name: string, brep: Brep, stamp = '2026-11-12T00:00:00'): string {
  const out: string[] = []
  const add = (entity: string) => { out.push(`#${out.length + 1} = ${entity};`); return `#${out.length}` }
  const label = name.replaceAll('\'', '')
  const context = add('APPLICATION_CONTEXT(\'core data for automotive mechanical design processes\')')
  add(`APPLICATION_PROTOCOL_DEFINITION('international standard','automotive_design',2000,${context})`)
  const product = add(`PRODUCT('${label}','${label}','',(${add(`PRODUCT_CONTEXT('',${context},'mechanical')`)}))`)
  add(`PRODUCT_RELATED_PRODUCT_CATEGORY('part',$,(${product}))`)
  const definition = add(`PRODUCT_DEFINITION('design','',${add(`PRODUCT_DEFINITION_FORMATION('','',${product})`)},${add(`PRODUCT_DEFINITION_CONTEXT('part definition',${context},'design')`)})`)
  const shape = add(`PRODUCT_DEFINITION_SHAPE('','',${definition})`)
  const mm = add('( LENGTH_UNIT() NAMED_UNIT(*) SI_UNIT(.MILLI.,.METRE.) )')
  const rad = add('( NAMED_UNIT(*) PLANE_ANGLE_UNIT() SI_UNIT($,.RADIAN.) )')
  const sr = add('( NAMED_UNIT(*) SI_UNIT($,.STERADIAN.) SOLID_ANGLE_UNIT() )')
  const tolerance = add(`UNCERTAINTY_MEASURE_WITH_UNIT(LENGTH_MEASURE(1.E-06),${mm},'distance_accuracy_value','confusion accuracy')`)
  const units = add(`( GEOMETRIC_REPRESENTATION_CONTEXT(3) GLOBAL_UNCERTAINTY_ASSIGNED_CONTEXT((${tolerance})) GLOBAL_UNIT_ASSIGNED_CONTEXT((${mm},${rad},${sr})) REPRESENTATION_CONTEXT('Context #1','3D Context with UNIT and UNCERTAINTY') )`)
  const point = (p: V3) => add(`CARTESIAN_POINT('',${triple(p)})`)
  const direction = (d: V3) => add(`DIRECTION('',${triple(d)})`)
  const placement = (origin: V3, axis: V3, ref: V3) => add(`AXIS2_PLACEMENT_3D('',${point(origin)},${direction(axis)},${direction(ref)})`)
  const vertices = brep.vertices.map(p => add(`VERTEX_POINT('',${point(p)})`))
  const edges = brep.edges.map((edge) => {
    const a = brep.vertices[edge.a]!
    const curve = edge.curve.kind === 'line'
      ? add(`LINE('',${point(a)},${add(`VECTOR('',${direction(unit(sub(brep.vertices[edge.b]!, a)))},1.)`)})`)
      // The reference direction is +Z, so the half turn from the top of the circle runs with the parameter.
      : add(`CIRCLE('',${placement(edge.curve.center, edge.curve.axis, [0, 0, 1])},${real(edge.curve.radius)})`)
    return add(`EDGE_CURVE('',${vertices[edge.a]},${vertices[edge.b]},${curve},.T.)`)
  })
  const faces = brep.faces.map((face) => {
    const bounds = face.loops.map((loop, i) => add(`${i ? 'FACE_BOUND' : 'FACE_OUTER_BOUND'}('',${add(`EDGE_LOOP('',(${loop.map(use => add(`ORIENTED_EDGE('',*,*,${edges[use.edge]},${use.forward ? '.T.' : '.F.'})`)).join(',')}))`)},.T.)`))
    const surface = face.surface.kind === 'plane'
      ? add(`PLANE('',${placement(face.surface.origin, face.surface.normal, square(face.surface.normal))})`)
      : add(`CYLINDRICAL_SURFACE('',${placement(face.surface.origin, face.surface.axis, square(face.surface.axis))},${real(face.surface.radius)})`)
    return add(`ADVANCED_FACE('',(${bounds.join(',')}),${surface},${face.sameSense ? '.T.' : '.F.'})`)
  })
  const solid = add(`MANIFOLD_SOLID_BREP('${label}',${add(`CLOSED_SHELL('',(${faces.join(',')}))`)})`)
  const representation = add(`ADVANCED_BREP_SHAPE_REPRESENTATION('${label}',(${placement([0, 0, 0], [0, 0, 1], [1, 0, 0])},${solid}),${units})`)
  add(`SHAPE_DEFINITION_REPRESENTATION(${shape},${representation})`)
  return `ISO-10303-21;\nHEADER;\nFILE_DESCRIPTION(('${label}. Square tube with holes, millimeters'),'2;1');\nFILE_NAME('${label}.step','${stamp}',('Buddy Wheels'),(''),'Stacks native STEP writer','Stacks native STEP writer','');\nFILE_SCHEMA(('AUTOMOTIVE_DESIGN { 1 0 10303 214 1 1 1 1 }'));\nENDSEC;\nDATA;\n${out.join('\n')}\nENDSEC;\nEND-ISO-10303-21;\n`
}
