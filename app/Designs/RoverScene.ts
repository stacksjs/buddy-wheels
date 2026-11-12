import type { ModelGeometry, ModelMatrix, ModelScene, ModelVector } from '@stacksjs/browser/model-viewer'
import type { RoverSetup } from './Rover'
import { roverDimensions, roverHardware as h, roverPartFile, roverParts } from './Rover'

type V = ModelVector
const add3 = (a: V, b: V): V => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const scale = (a: V, k: number): V => [a[0] * k, a[1] * k, a[2] * k]
const crossV = (a: V, b: V): V => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const dot = (a: V, b: V) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
/** Column-major placement from two local axes. The third is their cross product, so it is always a proper rotation. */
const place = (u: V, v: V, origin: V): ModelMatrix => { const n = crossV(u, v); return [...u, 0, ...v, 0, ...n, 0, ...origin, 1] }
/** Two axes perpendicular to n with u x v = n, axis-aligned whenever n is. */
function basis(n: V): [V, V] {
  const v: V = Math.abs(n[1]) > 0.9 ? [1, 0, 0] : [0, 1, 0]
  const u = crossV(v, n)
  return [u, v]
}
export interface RoverView { focus?: string, rampDown?: boolean, cover?: boolean, accent?: string, trim?: string, revision?: string }

/** Native geometry sharing the cut-list numbers. No load, cloth or motion simulation. */
export function roverScene(s: RoverSetup, view: RoverView = {}): ModelScene {
  const { focus = 'assembly', rampDown = true, cover = false, accent = '#254b38', trim = '#344c43', revision = 'r0' } = view
  const nodes: ModelScene['nodes'] = []; const d = roverDimensions(s); const t = h.tube
  const frame = '#b4bfb8'; const cabin = '#cfd7d1'; const steel = '#6d7a72'; const wood = '#c9a36a'
  const add = (id: string, geometry: ModelGeometry, color: string, transform: ModelMatrix) => { nodes.push({ id, geometry, color, transform }) }
  const stl = (part: string): ModelGeometry => ({ kind: 'stl', src: `/designs/rover/r0/parts/${roverPartFile(part)}?v=${revision}` })
  if (roverParts.some(p => p.id === focus)) {
    add('inspected-part', stl(focus), roverParts.find(p => p.id === focus)!.kind === 'metal' ? steel : accent, place([1, 0, 0], [0, 1, 0], [0, 0, 0]))
    return { nodes }
  }
  const tube = (id: string, heavy: boolean, length: number, start: V, dir: V) => { const [u, v] = basis(dir); add(id, { kind: 'tube', outer: t, inner: t - 2 * (heavy ? h.heavy : h.light), length }, heavy ? frame : cabin, place(u, v, start)) }
  const rod = (id: string, radius: number, length: number, center: V, dir: V, color: string, innerRadius = 0) => { const [u, v] = basis(dir); add(id, { kind: 'cylinder', radius, innerRadius, length }, color, place(u, v, center)) }
  const slab = (id: string, size: V, center: V, u: V, v: V, color: string) => add(id, { kind: 'box', size }, color, place(u, v, center))
  /** A flat profile on the tube face that looks toward `out`. Local +x goes to a, local +y to b. */
  const gusset = (id: string, part: 'corner_gusset' | 'tee_gusset' | 'axle_hanger', datum: V, out: V, a: V, b: V) => {
    const n = crossV(a, b); const face = add3(datum, scale(out, t / 2))
    add(id, stl(part), part === 'axle_hanger' ? steel : frame, place(a, b, dot(n, out) > 0 ? face : add3(face, scale(out, h.plate))))
  }
  const cap = (id: string, heavy: boolean, end: V, out: V) => { const n = scale(out, -1); const [u, v] = basis(n); add(id, stl(heavy ? 'cap_heavy' : 'cap_light'), accent, place(u, v, add3(end, scale(out, 3)))) }
  const wheel = (id: string, center: V) => {
    rod(id + '-tire', d.R, h.tire, center, [0, 1, 0], '#29322d', d.R - 42)
    rod(id + '-rim', d.R - 42, 6, center, [0, 1, 0], '#8b958e', 20)
    rod(id + '-hub', 20, s.hub, center, [0, 1, 0], steel, h.axle / 2)
  }

  // Ramp frame of reference: r runs from the hinge toward the toe, up is the walking-surface normal.
  const angle = d.rampAngleRad; const hinge: V = [d.hingeX, 0, d.deck]
  const r: V = rampDown ? [-Math.cos(angle), 0, -Math.sin(angle)] : [0, 0, 1]
  const up: V = rampDown ? [-Math.sin(angle), 0, Math.cos(angle)] : [1, 0, 0]
  const across: V = [0, 1, 0]; const half = d.rampWidth / 2
  const at = (along: number, lift: number, y = 0): V => add3(add3(hinge, add3(scale(r, along), scale(up, lift))), [0, y, 0])
  function ramp() {
    slab('ramp-panel', [s.ramp, d.rampWidth, h.panel], at(s.ramp / 2, -h.panel / 2), r, across, wood)
    slab('ramp-traction', [s.ramp - 18, d.rampWidth - 2 * t - 2, h.mat], at(s.ramp / 2 - 9, h.mat / 2), r, across, '#59635d')
    for (const side of [-1, 1]) {
      tube(`ramp-curb-${side}`, true, s.ramp, at(0, t / 2, side * (half - t / 2)), r)
      cap(`ramp-curb-cap-${side}`, true, at(s.ramp, t / 2, side * (half - t / 2)), r)
      const legY = side * (half - 60); const rib = at(40, -h.panel - t / 2, legY)
      tube(`ramp-leg-${side}`, true, d.legCut, add3(rib, scale(up, -t / 2)), scale(up, -1))
      rod(`ramp-foot-${side}`, 22, 10, add3(rib, scale(up, -t / 2 - d.legCut - h.foot + 5)), up, '#29322d')
      rod(`ramp-foot-stem-${side}`, 4.7, h.foot - 10, add3(rib, scale(up, -t / 2 - d.legCut - (h.foot - 10) / 2)), up, steel)
      for (const sign of [-1, 1]) gusset(`ramp-leg-gusset-${side}-${sign}`, 'corner_gusset', rib, scale(r, sign), [0, -side, 0], scale(up, -1))
    }
    for (const [i, along] of [40, s.ramp / 2].entries()) tube(`ramp-rib-${i}`, false, d.rampWidth, at(along, -h.panel - t / 2, -half), across)
    const toes = d.counts.toe
    for (let i = 0; i < toes; i++) add(`ramp-toe-${i}`, stl('ramp_toe'), accent, place(r, crossV(up, r), at(s.ramp, -h.panel - 2.4, 200 * i - toes * 100)))
    rod('ramp-hinge', 3.5, d.rampWidth, at(-h.hingeGap / 2, 1.5), across, steel)
  }
  if (focus === 'ramp') {
    ramp()
    tube('sill', true, s.width, [d.rearX - t / 2, -s.width / 2, d.railZ], across)
    slab('floor-edge', [260, s.width + 2 * t, h.panel], [d.rearX - t + 130, 0, d.deck - h.panel / 2], [1, 0, 0], across, wood)
    return { nodes }
  }

  const y0 = d.postY; const outer = s.width / 2 + t; const railStart = d.rearX - t
  for (const side of [-1, 1]) {
    const y = side * y0
    tube(`base-rail-${side}`, true, d.rail, [railStart, y, d.railZ], [1, 0, 0])
    tube(`top-rail-${side}`, false, d.rail, [railStart, y, d.topZ], [1, 0, 0])
    for (const [end, x] of [[-1, railStart], [1, railStart + d.rail]] as const) {
      cap(`base-cap-${side}-${end}`, true, [x, y, d.railZ], [end, 0, 0]); cap(`top-cap-${side}-${end}`, false, [x, y, d.topZ], [end, 0, 0])
    }
    tube(`axle-post-${side}`, true, d.post, [0, y, d.railZ + t / 2], [0, 0, 1])
    for (const [name, cx, inward] of [['rear', d.rearX - t / 2, 1], ['front', d.frontX + t / 2, -1]] as const) {
      tube(`corner-post-${name}-${side}`, false, d.post, [cx, y, d.railZ + t / 2], [0, 0, 1])
      // Corner posts carry the cover, not the dog: one gusset on the outside face only.
      gusset(`base-corner-${name}-${side}`, 'corner_gusset', [cx, y, d.railZ], [0, side, 0], [0, 0, 1], [inward, 0, 0])
      gusset(`top-corner-${name}-${side}`, 'corner_gusset', [cx, y, d.topZ], [0, side, 0], [0, 0, -1], [inward, 0, 0])
      gusset(`base-under-${name}-${side}`, 'corner_gusset', [cx, y, d.railZ], [0, 0, -1], [inward, 0, 0], [0, -side, 0])
      gusset(`top-over-${name}-${side}`, 'corner_gusset', [cx, y, d.topZ], [0, 0, 1], [inward, 0, 0], [0, -side, 0])
    }
    for (const face of [-1, 1]) {
      gusset(`axle-top-${side}-${face}`, 'corner_gusset', [0, y, d.topZ], [0, face, 0], [1, 0, 0], [0, 0, -1])
      gusset(`rear-hanger-${side}-${face}`, 'axle_hanger', [0, y, d.railZ], [0, face, 0], [1, 0, 0], [0, 0, 1])
      gusset(`front-hanger-${side}-${face}`, 'axle_hanger', [d.wheelbase, side * d.forkY, d.railZ], [0, face, 0], [1, 0, 0], [0, 0, 1])
    }
    gusset(`roof-bow-tee-${side}`, 'tee_gusset', [0, y, d.topZ], [0, 0, 1], [1, 0, 0], [0, side, 0])
    d.stations.slice(1, -1).forEach((x, i) => gusset(`base-tee-${i}-${side}`, 'tee_gusset', [x, y, d.railZ], [0, 0, -1], [1, 0, 0], [0, side, 0]))
    // Rear wheel on a stub axle: cotter, washer, hanger, post, hanger, spacer, hub, washer, cotter.
    const start = y - side * d.inboard
    rod(`rear-axle-${side}`, h.axle / 2, d.rearShaft, [0, start + side * d.rearShaft / 2, d.R], across, '#d5dbd6')
    rod(`rear-spacer-${side}`, h.axleSleeve / 2, h.spacer, [0, side * (outer + h.plate + h.spacer / 2), d.R], across, steel, h.axle / 2)
    wheel(`rear-wheel-${side}`, [0, side * d.wheelY, d.R])
    add(`rear-axle-cover-${side}`, stl('axle_cover'), accent, place(basis([0, side, 0])[0], basis([0, side, 0])[1], [0, start + side * (d.rearShaft - 6), d.R]))
    rod(`tip-stop-${side}`, 4.7, 100, [d.rearX + 117.3, y, d.railZ - 40], [0, 0, 1], steel)
    rod(`tip-stop-foot-${side}`, 20, 10, [d.rearX + 117.3, y, d.railZ - 90], [0, 0, 1], '#29322d')
    // Fork arm, stub post and handle arm.
    const fy = side * d.forkY
    tube(`fork-arm-${side}`, true, d.forkArm, [d.frontX + t, fy, d.railZ], [1, 0, 0])
    cap(`fork-cap-${side}`, true, [d.frontX + t + d.forkArm, fy, d.railZ], [1, 0, 0])
    tube(`fork-stub-${side}`, true, d.stub, [d.wheelbase, fy, d.railZ + t / 2], [0, 0, 1])
    for (const face of [-1, 1]) gusset(`fork-tee-${side}-${face}`, 'tee_gusset', [d.frontX + t / 2, fy, d.railZ], [0, 0, face], [0, 1, 0], [-1, 0, 0])
    const armY = side * (outer + t / 2)
    tube(`handle-arm-${side}`, false, d.handleArm, [d.gripX, armY, s.handle], [1, 0, 0])
    cap(`handle-cap-${side}`, false, [d.gripX + d.handleArm, armY, s.handle], [1, 0, 0])
    for (const face of [-1, 1]) gusset(`grip-gusset-${side}-${face}`, 'corner_gusset', [d.gripX + t / 2, armY, s.handle], [0, 0, face], [1, 0, 0], [0, -side, 0])
  }
  d.stations.forEach((x, i) => tube(`base-cross-${i}`, i === 0 || i === d.stations.length - 1, s.width, [x, -s.width / 2, d.railZ], across))
  for (const [i, x] of [d.rearX - t / 2, 0, d.frontX + t / 2].entries()) {
    tube(`top-cross-${i}`, false, s.width, [x, -s.width / 2, d.topZ], across)
    add(`ridge-saddle-${i}`, stl('ridge_saddle'), accent, place([1, 0, 0], [0, 1, 0], [x, 0, d.topZ + t / 2 - 26]))
  }
  rod('ridge-pole', h.pole / 2, d.rail, [(d.rearX + d.frontX) / 2, 0, d.topZ + t / 2 + h.ridge + h.pole / 2], [1, 0, 0], '#d5dbd6')
  tube('handle-grip', false, d.grip, [d.gripX + t / 2, -outer, s.handle], across)
  rod('handle-foam', 17, s.width - 60, [d.gripX + t / 2, 0, s.handle], across, '#29322d', 12.9)
  slab('floor-panel', [d.rail, s.width + 2 * t, h.panel], [(d.rearX + d.frontX) / 2, 0, d.deck - h.panel / 2], [1, 0, 0], across, wood)
  rod('front-axle', h.axle / 2, d.frontShaft, [d.wheelbase, 0, d.R], across, '#d5dbd6')
  wheel('front-wheel', [d.wheelbase, 0, d.R])
  ramp()
  if (cover) {
    const coverTop = d.topZ + t / 2; const bottom = d.railZ - t / 2; const sill = bottom + 350; const cx = (d.rearX + d.frontX) / 2; const peak = coverTop + h.ridge + h.pole + 2
    for (const side of [-1, 1]) {
      const run = outer + 30; const slope = Math.hypot(run, peak - coverTop + 8); const dir: V = [0, side * run / slope, -(peak - coverTop + 8) / slope]
      slab(`cover-roof-${side}`, [d.rail + 80, slope, 2], [cx, side * run / 2, (peak + coverTop - 8) / 2], [1, 0, 0], dir, trim)
      slab(`cover-side-band-${side}`, [d.rail, 2, 350], [cx, side * (outer + 2), (bottom + sill) / 2], [1, 0, 0], across, trim)
      slab(`cover-side-mesh-${side}`, [d.rail - 160, 1, coverTop - sill - 110], [cx, side * (outer + 2), (sill + coverTop - 110) / 2], [1, 0, 0], across, '#e9e6da')
      slab(`cover-side-top-${side}`, [d.rail, 2, 110], [cx, side * (outer + 2), coverTop - 55], [1, 0, 0], across, trim)
    }
    slab('cover-front-band', [2, s.width + 2 * t, 350], [d.frontX + t + 2, 0, (bottom + sill) / 2], [1, 0, 0], across, trim)
    slab('cover-front-mesh', [1, s.width - 60, coverTop - sill - 110], [d.frontX + t + 2, 0, (sill + coverTop - 110) / 2], [1, 0, 0], across, '#e9e6da')
    slab('cover-front-top', [2, s.width + 2 * t, 110], [d.frontX + t + 2, 0, coverTop - 55], [1, 0, 0], across, trim)
    const header = Math.max(150, coverTop - d.deck - s.ramp)
    slab('cover-rear-header', [2, s.width + 2 * t, header], [d.rearX - t - 2, 0, coverTop - header / 2], [1, 0, 0], across, trim)
  }
  return { nodes }
}
