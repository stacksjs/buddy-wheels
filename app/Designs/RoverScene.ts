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
  const gusset = (id: string, part: 'corner_gusset' | 'tee_gusset' | 'axle_hanger' | 'axle_hanger_mid' | 'axle_hanger_low', datum: V, out: V, a: V, b: V) => {
    if (d.welded && !part.startsWith('axle_hanger')) return
    const n = crossV(a, b); const face = add3(datum, scale(out, t / 2))
    add(id, stl(part), part.startsWith('axle_hanger') ? steel : frame, place(a, b, dot(n, out) > 0 ? face : add3(face, scale(out, h.plate))))
  }
  /** A plate cut to this setup's angle, drawn as its two legs on the tube face that looks toward `out`. Bolted build only. */
  const anglePlate = (id: string, datum: V, out: V, a: V, b: V) => {
    if (d.welded) return
    for (const [leg, dir] of [['a', a], ['b', b]] as const) slab(`angle-${id}-${leg}`, [115, 40, h.plate], add3(add3(datum, scale(out, t / 2 + h.plate / 2)), scale(dir, 37.5)), dir, crossV(out, dir), frame)
  }
  const cap = (id: string, heavy: boolean, end: V, out: V) => { const n = scale(out, -1); const [u, v] = basis(n); add(id, stl(heavy ? 'cap_heavy' : 'cap_light'), accent, place(u, v, add3(end, scale(out, 3)))) }
  const wheel = (id: string, center: V) => {
    const rim = d.wheel.rim
    rod(id + '-tire', d.R, d.tire, center, [0, 1, 0], '#29322d', rim)
    rod(id + '-rim', rim, 6, center, [0, 1, 0], '#8b958e', 20)
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
      cap(`ramp-leg-cap-${side}`, true, add3(rib, scale(up, -t / 2 - d.legCut)), scale(up, -1))
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
  // Welded build: the top rail centerline drops by the taper over its run. Bolted: taper is zero and this is flat.
  const zTop = (x: number) => d.topZ - s.taper * (x - railStart) / d.topRail
  const roofDir: V = [d.topRail / d.topRailCut, 0, -s.taper / d.topRailCut]
  for (const side of [-1, 1]) {
    const y = side * y0
    tube(`base-rail-${side}`, true, d.rail, [railStart, y, d.railZ], [1, 0, 0])
    tube(`top-rail-${side}`, false, d.topRailCut, [railStart, y, d.topZ], roofDir)
    for (const end of [-1, 1] as const) {
      cap(`base-cap-${side}-${end}`, true, [end < 0 ? railStart : railStart + d.rail, y, d.railZ], [end, 0, 0]); cap(`top-cap-${side}-${end}`, false, end < 0 ? [railStart, y, d.topZ] : [railStart + d.topRail, y, d.topZ - s.taper], scale(roofDir, end))
    }
    tube(`axle-post-${side}`, true, d.axlePost, [0, y, d.railZ + t / 2], [0, 0, 1])
    const pillarDir: V = d.pillarDir; const rearPostX = d.rearX - t / 2; const frontCornerX = d.frontX + t / 2
    // Rear post, square at the foot. Front pillar from the base front corner, leaning back by the rake.
    tube(`corner-post-rear-${side}`, false, d.post, [rearPostX, y, d.railZ + t / 2], [0, 0, 1])
    tube(`front-pillar-${side}`, false, d.pillar, [frontCornerX, y, d.railZ + t / 2], pillarDir)
    // These uprights carry the cover, not the dog: one plate on the outside face only. Plates at the sloped roof and the pillar are cut to angle.
    gusset(`base-corner-rear-${side}`, 'corner_gusset', [rearPostX, y, d.railZ], [0, side, 0], [0, 0, 1], [1, 0, 0])
    anglePlate(`roof-rear-${side}`, [rearPostX, y, zTop(rearPostX)], [0, side, 0], [0, 0, -1], roofDir)
    anglePlate(`foot-${side}`, [d.pillarFoot[0], y, d.pillarFoot[1]], [0, side, 0], pillarDir, [-1, 0, 0])
    anglePlate(`top-${side}`, [d.pillarTop[0], y, d.pillarTop[1]], [0, side, 0], scale(pillarDir, -1), scale(roofDir, -1))
    gusset(`base-under-rear-${side}`, 'corner_gusset', [rearPostX, y, d.railZ], [0, 0, -1], [1, 0, 0], [0, -side, 0])
    gusset(`base-under-front-${side}`, 'corner_gusset', [frontCornerX, y, d.railZ], [0, 0, -1], [-1, 0, 0], [0, -side, 0])
    gusset(`top-over-rear-${side}`, 'corner_gusset', [rearPostX, y, zTop(rearPostX)], [0, 0, 1], [1, 0, 0], [0, -side, 0])
    gusset(`top-over-front-${side}`, 'corner_gusset', [d.frontPostX, y, zTop(d.frontPostX)], [0, 0, 1], [-1, 0, 0], [0, -side, 0])
    for (const face of [-1, 1]) {
      anglePlate(`roof-axle-${side}-${face}`, [0, y, zTop(0)], [0, face, 0], roofDir, [0, 0, -1])
      if (!d.sprung) gusset(`rear-hanger-${side}-${face}`, d.wheel.hanger, [0, y, d.railZ], [0, face, 0], [1, 0, 0], [0, 0, 1])
      else gusset(`axle-foot-tee-${side}-${face}`, 'tee_gusset', [0, y, d.railZ], [0, face, 0], [1, 0, 0], [0, 0, -1])
      if (!d.swivel) gusset(`front-hanger-${side}-${face}`, d.wheel.hanger, [d.wheelbase, side * d.forkY, d.railZ], [0, face, 0], [1, 0, 0], [0, 0, 1])
    }
    gusset(`roof-bow-tee-${side}`, 'tee_gusset', [0, y, zTop(0)], [0, 0, 1], [1, 0, 0], [0, side, 0])
    d.stations.slice(1, -1).forEach((x, i) => gusset(`base-tee-${i}-${side}`, 'tee_gusset', [x, y, d.railZ], [0, 0, -1], [1, 0, 0], [0, side, 0]))
    // Rear wheel on a stub axle: cotter, washer, hanger, post, hanger, spacer, hub, washer, cotter.
    const start = side * (d.axleY - d.inboard)
    if (d.sprung) {
      // Swing arm outside the rail, pivot bolt through the rail, shock from a pair of plates on the arm up to a pair hung from the axle post.
      const ay = side * d.armY; const [lowX, lowZ] = d.shockLow; const run = Math.hypot(lowX, d.shockUpZ - lowZ)
      tube(`swing-arm-${side}`, true, d.swingArm, [h.swingRun - d.swingDir[0] * h.swingEnd, ay, d.railZ - d.swingDir[2] * h.swingEnd], d.swingDir)
      rod(`swing-pivot-${side}`, 6.35, 2 * t + h.swingGap + 24, [h.swingRun, side * (y0 + d.armY) / 2, d.railZ], across, '#d5dbd6')
      rod(`swing-spacer-${side}`, h.axleSleeve / 2, h.swingGap, [h.swingRun, side * (outer + h.swingGap / 2), d.railZ], across, steel, 6.35)
      tube(`shock-spacer-${side}`, true, h.shockSpacer, [0, ay, d.shockSpacerZ], [0, 0, 1])
      const axis: V = [-lowX / run, 0, (d.shockUpZ - lowZ) / run]; const mid: V = [lowX / 2, ay, (lowZ + d.shockUpZ) / 2]
      rod(`shock-body-${side}`, 9, run - 16, mid, axis, '#29322d')
      rod(`shock-spring-${side}`, h.shockRadius, run * 0.6, mid, axis, accent, h.shockRadius - 5)
      const up: V = [-d.swingDir[2], 0, d.swingDir[0] * -1]
      for (const face of [-1, 1]) {
        // Plates sit on the two side faces of the arm and of the spacer tube, so the shock eye is held on both sides.
        const ty = ay + face * t / 2 - (face < 0 ? h.plate : 0)
        add(`shock-plate-${side}-${face}`, stl('shock_plate'), frame, place(d.swingDir, up, [lowX, ty, lowZ]))
        add(`shock-hanger-${side}-${face}`, stl('shock_hanger'), frame, place([-1, 0, 0], [0, 0, 1], [0, ty, d.shockUpZ]))
      }
    }
    rod(`rear-axle-${side}`, h.axle / 2, d.rearShaft, [0, start + side * d.rearShaft / 2, d.R], across, '#d5dbd6')
    rod(`rear-spacer-${side}`, h.axleSleeve / 2, d.spacer, [0, side * (d.axleY + t / 2 + (d.sprung ? 0 : h.plate) + d.spacer / 2), d.R], across, steel, h.axle / 2)
    if (d.forkSpacer && !d.swivel) rod(`front-spacer-${side}`, h.axleSleeve / 2, d.forkSpacer, [d.wheelbase, side * (s.hub / 2 + h.washer + d.forkSpacer / 2), d.R], across, steel, h.axle / 2)
    if (d.ski) {
      // Snow kit: the post swings on the axle where the wheel was, a tube foot bolts to the ski, tee gussets tie foot to post.
      const sy = side * d.wheelY; const footZ = h.skiThick + t / 2
      tube(`ski-post-${side}`, true, d.skiPost, [0, sy, h.skiThick + t], [0, 0, 1])
      tube(`ski-foot-${side}`, true, h.skiFoot, [-h.skiFoot / 2, sy, footZ], [1, 0, 0])
      for (const face of [-1, 1]) gusset(`ski-tee-${side}-${face}`, 'tee_gusset', [0, sy, footZ], [0, face, 0], [1, 0, 0], [0, 0, -1])
      slab(`ski-${side}`, [h.skiLength, h.skiWidth, h.skiThick], [60, sy, h.skiThick / 2], [1, 0, 0], across, '#1f2622')
      const pin: V = [d.towPinX, d.swivel ? side * (outer + t / 2) : side * (d.forkY + t), d.railZ]
      const rise = (h.hipHeight - d.railZ) / h.towShaft; const run = Math.sqrt(1 - rise * rise - 0.01)
      tube(`tow-shaft-${side}`, false, h.towShaft, pin, [run, -side * 0.1, rise])
    }
    else wheel(`rear-wheel-${side}`, [0, side * d.wheelY, d.R])
    add(`rear-axle-cover-${side}`, stl('axle_cover'), accent, place(basis([0, side, 0])[0], basis([0, side, 0])[1], [0, start + side * (d.rearShaft - 6), d.R]))
    // Parking brake: arm over the tire, a gusset on the front and rear faces of the axle post, and the clamp with its pad.
    tube(`brake-arm-${side}`, true, h.brakeArm, [0, side * outer, d.brakeZ], [0, side, 0])
    cap(`brake-arm-cap-${side}`, true, [0, side * (outer + h.brakeArm), d.brakeZ], [0, side, 0])
    for (const face of [-1, 1]) gusset(`brake-gusset-${side}-${face}`, 'corner_gusset', [0, y, d.brakeZ], [face, 0, 0], [0, side, 0], [0, 0, 1])
    // The clamp plate stacks on the front gusset and shares its two arm bolts; the clamp hangs below the arm over the tread.
    add(`brake-plate-${side}`, stl('brake_plate'), frame, place([0, side, 0], [0, 0, 1], [t / 2 + (d.welded ? 0 : h.plate) + (side > 0 ? 0 : h.plate), y + side * 80, d.brakeZ]))
    const padY = side * d.wheelY; const front = t / 2 + (d.welded ? 1 : 2) * h.plate
    slab(`brake-clamp-${side}`, [22, 56, 89], [front + 11, padY, d.brakeZ - 75], [1, 0, 0], across, steel)
    rod(`brake-plunger-${side}`, 4, 46, [front + 11, padY, d.brakeZ - 142], [0, 0, 1], '#d5dbd6')
    rod(`brake-pad-${side}`, 14, 16, [front + 11, padY, 2 * d.R + 10], [0, 0, 1], '#29322d')
    rod(`tip-stop-${side}`, 4.7, 100, [d.rearX + 117.3, y, d.railZ - 40], [0, 0, 1], steel)
    rod(`tip-stop-foot-${side}`, 20, 10, [d.rearX + 117.3, y, d.railZ - 90], [0, 0, 1], '#29322d')
    // Front end: either a fork for a fixed third wheel, or a raised nose for a swivel caster.
    if (d.swivel) {
      for (const end of [-1, 1]) {
        const px = d.casterX + end * h.casterAlong / 2; const beamZ = s.caster + t / 2
        tube(`nose-post-${side}-${end}`, true, d.nosePost, [px, y, d.railZ + t / 2], [0, 0, 1])
        for (const face of [-1, 1]) gusset(`nose-base-${side}-${end}-${face}`, 'corner_gusset', [px, y, d.railZ], [0, face, 0], [0, 0, 1], [end, 0, 0])
        gusset(`nose-top-${side}-${end}`, 'corner_gusset', [px, y, beamZ], [end, 0, 0], [0, -side, 0], [0, 0, -1])
      }
    }
    else {
      const fy = side * d.forkY
      tube(`fork-arm-${side}`, true, d.forkArm, [d.frontX + t, fy, d.railZ], [1, 0, 0])
      cap(`fork-cap-${side}`, true, [d.frontX + t + d.forkArm, fy, d.railZ], [1, 0, 0])
      tube(`fork-stub-${side}`, true, d.stub, [d.wheelbase, fy, d.railZ + t / 2], [0, 0, 1])
      for (const face of [-1, 1]) gusset(`fork-tee-${side}-${face}`, 'tee_gusset', [d.frontX + t / 2, fy, d.railZ], [0, 0, face], [0, 1, 0], [-1, 0, 0])
    }
    const armY = side * (outer + t / 2)
    tube(`handle-arm-${side}`, false, d.handleArm, [d.gripX, armY, s.handle], [1, 0, 0])
    cap(`handle-cap-${side}`, false, [d.gripX + d.handleArm, armY, s.handle], [1, 0, 0])
    for (const face of [-1, 1]) gusset(`grip-gusset-${side}-${face}`, 'corner_gusset', [d.gripX + t / 2, armY, s.handle], [0, 0, face], [1, 0, 0], [0, -side, 0])
  }
  d.stations.forEach((x, i) => tube(`base-cross-${i}`, i === 0 || i === d.stations.length - 1, s.width, [x, -s.width / 2, d.railZ], across))
  for (const [i, x] of [d.rearX - t / 2, 0, d.frontPostX].entries()) {
    tube(`top-cross-${i}`, false, s.width, [x, -s.width / 2, zTop(x)], across)
    add(`ridge-saddle-${i}`, stl('ridge_saddle'), accent, place([1, 0, 0], [0, 1, 0], [x, 0, zTop(x) + t / 2 - 26]))
  }
  const topMid = d.rearX - t + d.topRail / 2
  rod('ridge-pole', h.pole / 2, d.topRailCut, [topMid, 0, zTop(topMid) + t / 2 + h.ridge + h.pole / 2], roofDir, '#d5dbd6')
  if (d.seats) {
    // Two-seat bench concept: a seat board on two cross tubes, the front one on two legs, and a back bar between the axle posts.
    tube('seat-cross-rear', true, s.width, [0, -s.width / 2, d.seatTubeZ], across)
    tube('seat-cross-front', true, s.width, [h.seatDepth, -s.width / 2, d.seatTubeZ], across)
    tube('seat-back-bar', true, s.width, [0, -s.width / 2, d.seatBackZ], across)
    for (const side of [-1, 1]) tube(`seat-leg-${side}`, true, d.seatLeg, [h.seatDepth, side * y0, d.railZ + t / 2], [0, 0, 1])
    slab('seat-board', [h.seatDepth + t, s.width, h.panel], [h.seatDepth / 2, 0, d.seatTubeZ + t / 2 + h.panel / 2], [1, 0, 0], across, wood)
    slab('seat-back-sling', [2, s.width - 40, h.seatBack - 40], [t / 2 + 1, 0, d.seatBackZ - h.seatBack / 2 + 10], [1, 0, 0], across, trim)
    slab('seat-divider', [h.seatDepth - 40, 2, 180], [h.seatDepth / 2 + t / 2, 0, d.seatTubeZ + t / 2 + h.panel + 90], [1, 0, 0], across, trim)
  }
  tube('handle-grip', false, d.grip, [d.gripX + t / 2, -outer, s.handle], across)
  rod('handle-foam', 17, s.width - 60, [d.gripX + t / 2, 0, s.handle], across, '#29322d', 12.9)
  slab('floor-panel', [d.floorLen, s.width + 2 * t, h.panel], [(d.rearX + d.frontX) / 2, 0, d.deck - h.panel / 2], [1, 0, 0], across, wood)
  if (d.swivel) {
    const beamZ = s.caster + t / 2; const r = h.casterWheel / 2; const hubX = d.casterX - h.casterTrail; const rolling = !d.ski
    for (const end of [-1, 1]) {
      const bx = d.casterX + end * h.casterAlong / 2
      tube(`caster-beam-${end}`, true, d.casterBeam, [bx, -outer, beamZ], across)
      for (const side of [-1, 1]) cap(`caster-beam-cap-${end}-${side}`, true, [bx, side * outer, beamZ], [0, side, 0])
    }
    if (rolling) slab('caster-plate', [115, 100, 6], [d.casterX, 0, s.caster - 3], [1, 0, 0], across, steel)
    if (rolling) rod('caster-swivel', 30, 22, [d.casterX, 0, s.caster - 17], [0, 0, 1], steel)
    if (rolling) for (const side of [-1, 1]) slab(`caster-fork-${side}`, [h.casterTrail + 50, 5, s.caster - 28 - r + 30], [d.casterX - h.casterTrail / 2, side * (h.casterTire / 2 + 8), (s.caster - 28 + r - 30) / 2], [1, 0, 0], across, steel)
    if (rolling) rod('caster-tire', r, h.casterTire, [hubX, 0, r], across, '#29322d', 58)
    if (rolling) rod('caster-rim', 58, 8, [hubX, 0, r], across, '#8b958e', 14)
    if (rolling) rod('caster-axle', 6, h.casterTire + 26, [hubX, 0, r], across, steel)
  }
  else {
    rod('front-axle', h.axle / 2, d.frontShaft, [d.wheelbase, 0, d.R], across, '#d5dbd6')
    if (!d.ski) wheel('front-wheel', [d.wheelbase, 0, d.R])
  }
  ramp()
  if (cover) {
    const coverTop = d.topZ + t / 2; const bottom = d.railZ - t / 2; const sill = bottom + 350; const rise = h.ridge + h.pole + 2
    const frontEdge = d.frontX + t; const topFront = frontEdge - s.rake; const frontTop = coverTop - s.taper
    // Roof line and front wall line in the side view. Bolted: a flat roof. Welded: it falls by the taper toward the front.
    const roofZ = (x: number) => coverTop - s.taper * (x - railStart) / (topFront - railStart)
    const at = (z: number) => frontEdge - s.rake * (z - bottom) / (frontTop - bottom)
    // Where the front wall meets a line that runs `drop` below the roof.
    const meet = (drop: number) => { const k = s.taper / (topFront - railStart); const g = s.rake / (frontTop - bottom); const x = (frontEdge - g * (coverTop - drop + k * railStart - bottom)) / (1 - g * k); return [x, roofZ(x) - drop] as [number, number] }
    const mesh = (id: string, vertices: V[], triangles: [number, number, number][], color: string) => add(id, { kind: 'mesh', vertices, triangles }, color, place([1, 0, 0], [0, 1, 0], [0, 0, 0]))
    // Thin panel in the XZ plane from a list of corners, used for the raked side walls.
    const sheet = (id: string, y: number, corners: [number, number][], color: string) => mesh(id, [...corners.map(([x, z]) => [x, y - 1, z] as V), ...corners.map(([x, z]) => [x, y + 1, z] as V)], corners.slice(1, -1).flatMap((_, i) => [[0, i + 1, i + 2], [corners.length, corners.length + i + 2, corners.length + i + 1]] as [number, number, number][]), color)
    // A quad drawn on both faces.
    const quad = (id: string, p: [V, V, V, V], color: string) => mesh(id, p, [[0, 1, 2], [0, 2, 3], [0, 2, 1], [0, 3, 2]], color)
    const [topX, topBandZ] = meet(110)
    for (const side of [-1, 1]) {
      const eave = side * (outer + 30); const wallY = side * (outer + 2)
      quad(`cover-roof-${side}`, [[railStart - 40, 0, roofZ(railStart - 40) + rise], [topFront + 40, 0, roofZ(topFront + 40) + rise], [topFront + 40, eave, roofZ(topFront + 40) - 8], [railStart - 40, eave, roofZ(railStart - 40) - 8]], trim)
      sheet(`cover-side-band-${side}`, wallY, [[railStart, bottom], [frontEdge, bottom], [at(sill), sill], [railStart, sill]], trim)
      sheet(`cover-side-mesh-${side}`, wallY, [[railStart + 80, sill], [at(sill) - 80, sill], [topX - 80, roofZ(topX - 80) - 110], [railStart + 80, roofZ(railStart + 80) - 110]], '#e9e6da')
      sheet(`cover-side-top-${side}`, wallY, [[railStart, coverTop - 110], [topX, topBandZ], [topFront, frontTop], [railStart, coverTop]], trim)
      sheet(`cover-side-rear-${side}`, wallY, [[railStart, sill], [railStart + 80, sill], [railStart + 80, roofZ(railStart + 80) - 110], [railStart, coverTop - 110]], trim)
      sheet(`cover-side-front-${side}`, wallY, [[at(sill) - 80, sill], [at(sill), sill], [topX, topBandZ], [topX - 80, roofZ(topX - 80) - 110]], trim)
    }
    // Front wall: three bands along the slope from the base front corner to the top front cross tube.
    const slopeLen = Math.hypot(s.rake, frontTop - bottom); const frontDir: V = [-s.rake / slopeLen, 0, (frontTop - bottom) / slopeLen]
    const band = (id: string, from: number, to: number, w: number, color: string) => slab(id, [2, w, to - from], add3([frontEdge + 2, 0, bottom], scale(frontDir, (from + to) / 2)), crossV(across, frontDir), across, color)
    band('cover-front-band', 0, 350, s.width + 2 * t, trim)
    band('cover-front-mesh', 350, slopeLen - 110, s.width - 60, '#e9e6da')
    band('cover-front-top', slopeLen - 110, slopeLen, s.width + 2 * t, trim)
    const header = Math.max(150, coverTop - d.deck - s.ramp)
    slab('cover-rear-header', [2, s.width + 2 * t, header], [d.rearX - t - 2, 0, coverTop - header / 2], [1, 0, 0], across, trim)
  }
  return { nodes }
}
