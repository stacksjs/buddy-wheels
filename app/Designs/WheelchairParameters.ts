export interface WheelchairFamily {
  size: string
  tube: number
  wall: number
  inner: number
  innerWall: number
  rail: number
  width: number
  height: number
  wheel: number
  tireWidth: number
  hubWidth: number
  wheelOffset: number
  arm: number
  shockFull: number
  shockStroke: number
  shockNeutral: number
  shockOd: number
  radii: [number, number, number]
  plate: number
  armPlate: number
  gap: number
  eyeWidth: number
  eyeBolt: number
  pivot: number
  pivotBore: number
  axle: number
  frameBolt: number
  stopBolt: number
  lockBolt: number
  stopR: number
  lockR: number
  pitch: number
  innerLength: number
}

// Independent nominal assembly rigs, not scaled meshes or dog-fit prescriptions.
// No weight capacities are assigned. Buddy's individual measurements are pending.
export const wheelchairFamilies: WheelchairFamily[] = [
  { size: 'XL', tube: 25, wall: 2, inner: 20, innerWall: 2, rail: 680, width: 400, height: 620, wheel: 400, tireWidth: 50, hubWidth: 40, wheelOffset: 70, arm: 180, shockFull: 165, shockStroke: 38, shockNeutral: 155, shockOd: 40, radii: [70, 90, 110], plate: 6, armPlate: 6, gap: 48, eyeWidth: 20, eyeBolt: 8, pivot: 10, pivotBore: 14, axle: 12, frameBolt: 6, stopBolt: 6, lockBolt: 6, stopR: 30, lockR: 50, pitch: 30, innerLength: 180 },
  { size: 'L', tube: 25, wall: 2, inner: 20, innerWall: 2, rail: 600, width: 340, height: 500, wheel: 350, tireWidth: 45, hubWidth: 40, wheelOffset: 70, arm: 165, shockFull: 165, shockStroke: 38, shockNeutral: 155, shockOd: 40, radii: [65, 85, 105], plate: 6, armPlate: 6, gap: 48, eyeWidth: 20, eyeBolt: 8, pivot: 10, pivotBore: 14, axle: 12, frameBolt: 6, stopBolt: 6, lockBolt: 6, stopR: 30, lockR: 50, pitch: 30, innerLength: 180 },
  { size: 'M', tube: 22, wall: 1.5, inner: 18, innerWall: 1.5, rail: 460, width: 280, height: 380, wheel: 300, tireWidth: 40, hubWidth: 35, wheelOffset: 60, arm: 140, shockFull: 140, shockStroke: 28, shockNeutral: 130, shockOd: 32, radii: [55, 70, 85], plate: 5, armPlate: 5, gap: 40, eyeWidth: 16, eyeBolt: 8, pivot: 8, pivotBore: 12, axle: 10, frameBolt: 5, stopBolt: 4, lockBolt: 4, stopR: 23, lockR: 38, pitch: 30, innerLength: 150 },
  { size: 'S', tube: 20, wall: 1.5, inner: 16, innerWall: 1.5, rail: 340, width: 210, height: 260, wheel: 200, tireWidth: 35, hubWidth: 30, wheelOffset: 50, arm: 100, shockFull: 100, shockStroke: 20, shockNeutral: 92, shockOd: 24, radii: [38, 50, 62], plate: 4, armPlate: 4, gap: 30, eyeWidth: 12, eyeBolt: 6, pivot: 8, pivotBore: 12, axle: 8, frameBolt: 4, stopBolt: 4, lockBolt: 4, stopR: 20, lockR: 80, pitch: 20, innerLength: 120 },
  { size: 'XS', tube: 16, wall: 1.5, inner: 12, innerWall: 1.5, rail: 260, width: 160, height: 220, wheel: 120, tireWidth: 25, hubWidth: 25, wheelOffset: 40, arm: 70, shockFull: 75, shockStroke: 12, shockNeutral: 70, shockOd: 16, radii: [25, 32, 40], plate: 3, armPlate: 3, gap: 20, eyeWidth: 10, eyeBolt: 4, pivot: 6, pivotBore: 8, axle: 6, frameBolt: 3, stopBolt: 3, lockBolt: 4, stopR: 14, lockR: 55, pitch: 20, innerLength: 120 },
]

export const cadParts = [
  { id: 'tube_cap', qty: 4, category: 'print', purpose: 'Outer-tube end protection, optional' },
  { id: 'inner_cap', qty: 1, category: 'print', purpose: 'Inner bridge end protection, optional' },
  { id: 'index_collar', qty: 2, category: 'print', purpose: 'Loose setup witness marker, no retention function' },
  { id: 'pivot_guard', qty: 4, category: 'print', purpose: 'Removable shield for non-animal rig only' },
  { id: 'drill_jig', qty: 1, category: 'fixture', purpose: 'Pilot layout aid only; metal bush tooling required for final holes' },
  { id: 'coupon', qty: 1, category: 'fixture', purpose: 'Hole-clearance calibration coupon' },
  { id: 'shock_dummy', qty: 2, category: 'fixture', purpose: 'Rigid nominal eye-distance gauge, no spring/damping or load function' },
  { id: 'fixed_plate', qty: 4, category: 'metal', purpose: 'Suspension fixed cheek, STL is a fit-check copy only' },
  { id: 'arm_plate', qty: 4, category: 'metal', purpose: 'Trailing arm cheek, STL is a fit-check copy only' },
  { id: 'corner_plate', qty: 8, category: 'metal', purpose: 'Paired rail/upright and rear-bridge joints, STL is a fit-check copy only' },
] as const

const rad = (n: number) => n * Math.PI / 180

export function suspensionLength(f: WheelchairFamily, radius: number, degrees: number): number {
  return Math.hypot(radius - radius * Math.cos(rad(degrees)), f.shockNeutral - radius * Math.sin(rad(degrees)))
}

export function validateFamily(f: WheelchairFamily): void {
  for (const [key, value] of Object.entries(f)) {
    if (typeof value === 'number' && (!Number.isFinite(value) || value <= 0))
      throw new Error(`${f.size}: ${key} must be positive and finite`)
  }
  if (f.radii.length !== 3 || !f.radii.every((r, i) => Number.isFinite(r) && r > 0 && r < f.arm && (i === 0 || r > f.radii[i - 1]!)))
    throw new Error(`${f.size}: three increasing shock radii must lie inside the arm`)
  if (f.wall * 2 >= f.tube || f.innerWall * 2 >= f.inner || f.tube > 28)
    throw new Error(`${f.size}: tubes need positive bores within the authored corner envelope`)
  if (f.pitch < 20 || f.pitch > 30 || f.rail < 80 + 2 * f.pitch + 15)
    throw new Error(`${f.size}: corner holes fall outside the authored plate or rail envelope`)
  if (f.pivotBore < f.pivot + 1 || f.pivotBore > 20 || f.axle + 0.2 > 20 || f.eyeBolt + 0.2 > 20)
    throw new Error(`${f.size}: incompatible bushing or arm-hole interface`)
  if (f.frameBolt + 2.2 > f.inner - 4 || f.stopR >= f.lockR || f.lockR >= f.arm || f.gap <= f.tube + 2)
    throw new Error(`${f.size}: incompatible tube sleeve, stop/lock or cheek spacing`)
  if (f.wheel < 80 || f.wheelOffset - f.hubWidth / 2 - (f.eyeWidth + 2 * f.armPlate) / 2 < 2)
    throw new Error(`${f.size}: incompatible wheel or outer axle spacer envelope`)
  if (f.inner >= f.tube - 2 * f.wall || f.eyeWidth + 2 * f.armPlate >= f.gap || f.shockOd > f.gap - 4)
    throw new Error(`${f.size}: telescoping or suspension envelope interference`)
  if (f.wheelOffset - f.tireWidth / 2 <= f.gap / 2 + f.plate + 3)
    throw new Error(`${f.size}: insufficient static tire-to-plate envelope`)
  if (f.innerLength - (2 * f.pitch + 20) < 20 + f.pitch + 5 || f.innerLength - (2 * f.pitch + 20) < 3 * f.inner)
    throw new Error(`${f.size}: insufficient nominal upright overlap`)
  if (f.height - f.wheel / 2 - (2 * f.pitch + 20) < 75)
    throw new Error(`${f.size}: lower upright does not cover its attachment holes`)
  if ((f.width - f.tube) * 0.4 < 3 * f.tube)
    throw new Error(`${f.size}: insufficient nominal bridge overlap`)
  for (const radius of f.radii) {
    if (suspensionLength(f, radius, -3) >= f.shockFull - 1.5 || suspensionLength(f, radius, 6) <= f.shockFull - f.shockStroke + 1.5)
      throw new Error(`${f.size}: shock reaches stroke end before external stops`)
  }
  // Hole-to-hole clearances matter independently of mesh manifoldness.
  const holes = [
    { x: 0, d: f.pivotBore }, { x: f.stopR, d: f.stopBolt + 0.2 },
    { x: f.lockR, d: f.lockBolt + 0.2 }, { x: f.arm, d: f.axle + 0.2 },
    ...f.radii.map(x => ({ x, d: f.eyeBolt + 0.2 })),
  ].sort((a, b) => a.x - b.x)
  for (let i = 1; i < holes.length; i++) {
    const a = holes[i - 1]!
    const b = holes[i]!
    if (b.x - a.x - (a.d + b.d) / 2 < 1.5)
      throw new Error(`${f.size}: overlapping arm holes or inadequate nominal ligament`)
  }
}
