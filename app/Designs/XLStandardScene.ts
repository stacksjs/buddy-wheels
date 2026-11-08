import type { ModelGeometry, ModelMatrix, ModelScene, ModelVector } from '@stacksjs/browser/model-viewer'
import { modelTransform, multiplyModelMatrices } from '@stacksjs/browser/model-viewer'
import type { StandardSetup } from './XLStandard'
import { standardDimensions, standardHardware as h, standardParts, standardPartFile } from './XLStandard'
/** Rigid r1 geometry only. No spring, compliance or load-response simulation. */
export function standardScene(s: StandardSetup, focus = 'assembly', exploded = false, revision = 'r1'): ModelScene {
  const nodes: ModelScene['nodes'] = []; const d = standardDimensions(s); const R = h.wheel / 2
  const frame = '#b4bfb8'; const metal = '#536358'; const green = '#254b38'
  const root = '/designs/xl/r1'
  function add(id: string, geometry: ModelGeometry, color: string, transform: ModelMatrix) { nodes.push({ id, geometry, color, transform }) }
  function stl(id: string, part: string, pos: ModelVector, rot: ModelVector = [0, 0, 0], scale: ModelVector = [1, 1, 1]) {
    add(id, { kind: 'stl', src: `${root}/parts/${standardPartFile(part)}?v=${revision}` }, standardParts.find(p => p.id === part)!.kind === 'metal' ? metal : green, multiplyModelMatrices(modelTransform(pos, rot), [scale[0], 0, 0, 0, 0, scale[1], 0, 0, 0, 0, scale[2], 0, 0, 0, 0, 1]))
  }
  function cyl(id: string, diameter: number, length: number, pos: ModelVector, color = frame, inner = 0) { add(id, { kind: 'cylinder', radius: diameter / 2, innerRadius: inner / 2, length }, color, modelTransform(pos, [90, 0, 0])) }
  function tube(id: string, length: number, pos: ModelVector, rot: ModelVector = [0, 0, 0]) { add(id, { kind: 'tube', outer: h.tube, inner: h.tube - 2 * h.wall, length }, frame, modelTransform(pos, rot)) }
  function bolt(id: string, x: number, y: number, z: number, vertical = false) {
    const rot: ModelVector = vertical ? [0, 0, 0] : [90, 0, 0]
    add(id + '-sleeve', { kind: 'cylinder', radius: h.sleeve / 2, innerRadius: (h.sleeve - 2 * h.sleeveWall) / 2, length: h.tube }, metal, modelTransform([x, y, z], rot))
    add(id, { kind: 'cylinder', radius: 3.175, length: 50.8 }, '#cbd2cc', modelTransform([x, y, z], rot))
    add(id + '-head', { kind: 'cylinder', radius: 5.5, length: 4 }, '#cbd2cc', modelTransform([x, y + (vertical ? 0 : 20), z + (vertical ? 20 : 0)], rot))
  }
  if (standardParts.some(p => p.id === focus)) { stl('inspected-part', focus, [0, 0, 0]); return { nodes } }
  const gap = exploded ? 16 : 0
  for (const side of [-1, 1]) {
    const y = side * s.width / 2
    if (focus !== 'axle') {
      tube(`rail-${side}`, s.rail, [-(s.rail - 200), y, s.height], [0, 90, 0])
      for (const sign of [-1, 1]) {
        stl(`joint-${side}-${sign}`, 'joint_plate', [0, y + sign * (h.tube / 2 + h.plate / 2 + gap) + h.plate / 2, s.height], [90, 0, 0])
        stl(`bridge-joint-${side}-${sign}`, 'joint_plate', [120, y, s.height + sign * (h.tube / 2 + h.plate / 2 + gap) - h.plate / 2], [0, 0, 0], [1, side, 1])
      }
      for (const x of [-30, 30]) bolt(`rail-bolt-${side}-${x}`, x, y, s.height)
      for (const z of [-35, -60]) bolt(`post-top-bolt-${side}-${z}`, 0, y, s.height + z)
      for (const x of [90, 150]) bolt(`rear-rail-bolt-${side}-${x}`, x, y, s.height, true)
      for (const step of [35, 60]) bolt(`bridge-bolt-${side}-${step}`, 120, y - side * step, s.height, true)
      stl(`front-cap-${side}`, 'end_cap', [-(s.rail - 200) - 3, y, s.height], [0, 90, 0])
      stl(`rear-cap-${side}`, 'end_cap', [203, y, s.height], [0, -90, 0])
    }
    tube(`post-${side}`, focus === 'axle' ? 160 : d.post, [0, y, R - 45])
    stl(`bottom-cap-${side}`, 'end_cap', [0, y, R - 48])
    for (const sign of [-1, 1]) stl(`axle-patch-${side}-${sign}`, 'axle_plate', [0, y + sign * (h.tube / 2 + h.plate / 2 + gap) + h.plate / 2, R], [90, 0, 0])
    for (const z of [-25, 25]) bolt(`axle-patch-bolt-${side}-${z}`, 0, y, R + z)
    cyl(`axle-bush-${side}`, h.axleSleeve, h.tube, [0, y, R], metal, h.axleSleeve - 2 * h.axleSleeveWall)
    const start = d.axleStart
    cyl(`axle-${side}`, h.axle, d.shaft, [0, y + side * (start + d.shaft / 2), R])
    cyl(`wheel-spacer-${side}`, h.axleSleeve, h.spacer, [0, y + side * (h.tube / 2 + h.plate + h.spacer / 2), R], metal, h.axleSleeve - 2 * h.axleSleeveWall)
    for (const end of [start + 8, start + d.shaft - 8]) add(`retainer-${side}-${end}`, { kind: 'cylinder', radius: h.cotter / 2, length: 24 }, metal, modelTransform([0, y + side * end, R]))
    const wy = y + side * d.offset
    cyl(`tire-${side}`, h.wheel, h.tire, [0, wy, R], '#29322d', 180)
    cyl(`rim-${side}`, 180, 10, [0, wy, R], metal)
    cyl(`hub-${side}`, 36, s.hub, [0, wy, R], frame, h.axle)
  }
  if (focus !== 'axle') tube('bridge', d.bridge, [120, -s.width / 2 + h.tube / 2, s.height], [-90, 0, 0])
  return { nodes }
}
