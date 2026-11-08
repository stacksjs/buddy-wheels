import type { ModelGeometry, ModelMatrix, ModelNode, ModelScene, ModelVector } from '@stacksjs/browser/model-viewer'
import { modelTransform, multiplyModelMatrices } from '@stacksjs/browser/model-viewer'
import type { StudioSetup } from './StudioSetup'
import { studioAssetRoot, studioPartFile, studioSetupFamily } from './StudioSetup'
import { cadParts } from './WheelchairParameters'

/** Same dimensions, local axes and neutral datums as the editable r0 CAD. */
export function createStudioScene(setup: StudioSetup, focus = 'assembly', exploded = false, revision = 'r0'): ModelScene {
  const family = studioSetupFamily(setup)
  const nodes: ModelNode[] = []
  const metal = '#9aa9a1'; const green = '#315e47'; const pin = '#c0c9c3'; const tire = '#303b34'
  const gap = exploded ? 28 : 0
  const R = family.wheel / 2
  const theta = (setup.locked ? 0 : setup.travel) * Math.PI / 180
  function add(id: string, geometry: ModelGeometry, color: string, transform: ModelMatrix): void { nodes.push({ id, geometry, color, transform }) }
  function stl(id: string, part: string, color: string, transform: ModelMatrix): void { add(id, { kind: 'stl', src: `${studioAssetRoot(setup.size)}/parts/${studioPartFile(part)}?v=${encodeURIComponent(revision)}` }, color, transform) }
  function tube(id: string, od: number, wall: number, length: number, position: ModelVector, rotation: ModelVector = [0, 0, 0]): void {
    add(id, { kind: 'tube', outer: od, inner: od - 2 * wall, length }, metal, modelTransform(position, rotation))
  }
  function cylinder(id: string, radius: number, length: number, position: ModelVector, rotation: ModelVector = [90, 0, 0], color = pin, innerRadius = 0): void {
    add(id, { kind: 'cylinder', radius, innerRadius, length }, color, modelTransform(position, rotation))
  }
  function cheek(id: string, part: string, y: number, z: number, thickness: number, color: string, parent = modelTransform()): void {
    stl(id, part, color, multiplyModelMatrices(parent, modelTransform([0, y + thickness / 2, z], [90, 0, 0])))
  }
  if (cadParts.some(part => part.id === focus)) {
    stl('inspected-part', focus, cadParts.find(p => p.id === focus)!.category === 'metal' ? metal : green, modelTransform())
    return { nodes }
  }
  function suspension(y: number, prefix: string, includeWheel: boolean, side: number): void {
    const pivot = modelTransform([0, y, R])
    const arm = multiplyModelMatrices(pivot, modelTransform([0, 0, 0], [0, -(setup.locked ? 0 : setup.travel), 0]))
    for (const sign of [-1, 1]) {
      cheek(`${prefix}-fixed-${sign}`, 'fixed_plate', sign * (family.gap / 2 + family.plate / 2 + gap), 0, family.plate, metal, pivot)
      cheek(`${prefix}-arm-${sign}`, 'arm_plate', sign * (family.eyeWidth / 2 + family.armPlate / 2 + gap), 0, family.armPlate, green, arm)
    }
    cylinder(`${prefix}-pivot`, family.pivot / 2, family.gap + 2 * family.plate + 8 + gap * 2, [0, y, R])
    cylinder(`${prefix}-stop`, family.stopBolt / 2, family.gap + 2 * family.plate + 8 + gap * 2, [family.stopR * Math.cos(theta), y, R + family.stopR * Math.sin(theta)])
    if (setup.locked) cylinder(`${prefix}-lock`, family.lockBolt / 2, family.gap + 2 * family.plate + 12 + gap * 2, [family.lockR, y, R], [90, 0, 0], green)
    const r = family.radii[setup.setting]!
    const lower: ModelVector = [r * Math.cos(theta), y, R + r * Math.sin(theta)]
    const upper: ModelVector = [r, y, R + family.shockNeutral]
    const delta = [upper[0] - lower[0], 0, upper[2] - lower[2]] as ModelVector
    const length = Math.hypot(...delta)
    const rotation: ModelVector = [0, Math.atan2(delta[0], delta[2]) * 180 / Math.PI, 0]
    cylinder(`${prefix}-shock-rod`, (family.eyeBolt + 8) / 2, length, [lower[0] + delta[0] / 2, y, lower[2] + delta[2] / 2], rotation)
    cylinder(`${prefix}-shock-body`, family.shockOd / 2, length * 0.46, [lower[0] + delta[0] * 0.51, y, lower[2] + delta[2] * 0.51], rotation, green)
    cylinder(`${prefix}-upper-eye`, family.eyeBolt / 2, family.gap + 2 * family.plate + 8 + gap * 2, upper)
    cylinder(`${prefix}-lower-eye`, family.eyeBolt / 2, family.eyeWidth + 2 * family.armPlate + 8 + gap * 2, lower)
    const wheelX = family.arm * Math.cos(theta); const wheelZ = R + family.arm * Math.sin(theta)
    cylinder(`${prefix}-axle`, family.axle / 2, family.eyeWidth + 2 * family.armPlate + 100, [wheelX, y + side * 20, wheelZ])
    if (!includeWheel) return
    const wheelY = y + side * (family.wheelOffset + gap * 2)
    cylinder(`${prefix}-tire`, R, family.tireWidth, [wheelX, wheelY, wheelZ], [90, 0, 0], tire, R - 15)
    cylinder(`${prefix}-rim`, R - 14, 6, [wheelX, wheelY, wheelZ], [90, 0, 0], metal, R - 22.5)
    cylinder(`${prefix}-hub`, 15, family.hubWidth, [wheelX, wheelY, wheelZ])
    for (let angle = 0; angle < 360; angle += 30) {
      const a = angle * Math.PI / 180; const length = R - 32
      add(`${prefix}-spoke-${angle}`, { kind: 'box', size: [length, 2, 2] }, pin, modelTransform([wheelX + Math.cos(a) * (length / 2 + 12), wheelY, wheelZ + Math.sin(a) * (length / 2 + 12)], [0, -angle, 0]))
    }
  }
  if (focus === 'suspension') { suspension(0, 'detail', false, 1); return { nodes } }
  for (const side of [-1, 1]) {
    const y = side * family.width / 2
    tube(`rail-${side}`, family.tube, family.wall, family.rail, [-(family.rail - 80), y, family.height], [0, 90, 0])
    tube(`lower-upright-${side}`, family.tube, family.wall, family.height - R - (2 * family.pitch + 20) - 25, [0, y, R + 25])
    tube(`upper-upright-${side}`, family.inner, family.innerWall, family.innerLength, [0, y, family.height - family.tube / 2 - family.innerLength])
    for (const sign of [-1, 1]) {
      cheek(`side-corner-${side}-${sign}`, 'corner_plate', y + sign * (family.tube / 2 + family.plate / 2), family.height, family.plate, metal)
      const mirror = [1, 0, 0, 0, 0, side, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
      stl(`bridge-corner-${side}-${sign}`, 'corner_plate', metal, multiplyModelMatrices(modelTransform([60, y, family.height + sign * (family.tube / 2 + family.plate / 2) - family.plate / 2]), mirror))
    }
    stl(`front-cap-${side}`, 'tube_cap', green, modelTransform([-(family.rail - 80), y, family.height], [0, 90, 0]))
    suspension(y, `wheel-${side}`, true, side)
  }
  tube('bridge-outer', family.tube, family.wall, (family.width - family.tube) * 0.7, [60, -family.width / 2 + family.tube / 2, family.height], [-90, 0, 0])
  tube('bridge-inner', family.inner, family.innerWall, (family.width - family.tube) * 0.7, [60, family.width / 2 - family.tube / 2, family.height], [90, 0, 0])
  return { nodes }
}
