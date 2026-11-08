import { mkdir } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { inspectBinaryStl } from './Mesh'

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

export interface WheelchairProfile {
  id: string
  family: WheelchairFamily
  context: Record<string, unknown>
}

export async function readWheelchairProfile(path: string): Promise<WheelchairProfile> {
  const input = await Bun.file(path).json()
  if (!input || typeof input !== 'object' || typeof input.id !== 'string' || !/^[a-z0-9][a-z0-9-]{0,39}$/.test(input.id))
    throw new Error('Profile id must use 1-40 lowercase letters, numbers or hyphens')
  const basis = wheelchairFamilies.find(f => f.size === input.basis)
  if (!basis || !input.overrides || typeof input.overrides !== 'object' || Array.isArray(input.overrides))
    throw new Error('Profile needs a known basis and an overrides object')
  for (const [key, value] of Object.entries(input.overrides)) {
    if (key === 'size' || !Object.hasOwn(basis, key))
      throw new Error(`Unknown geometry override: ${key}`)
    if (key === 'radii') {
      if (!Array.isArray(value) || value.length !== 3 || !value.every(v => typeof v === 'number' && Number.isFinite(v) && v > 0))
        throw new Error('radii must have three positive finite numbers')
    }
    else if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
      throw new Error(`Invalid numeric override: ${key}`)
    }
  }
  const family = { ...basis, ...input.overrides } as WheelchairFamily
  validateFamily(family)
  return { id: input.id, family, context: input.context || {} }
}

const rounded = (n: number) => Math.round(n * 1000) / 1000
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

function parameters(f: WheelchairFamily): string {
  const names: Record<string, string> = { innerWall: 'inner_wall', tireWidth: 'tire_width', hubWidth: 'hub_width', wheelOffset: 'wheel_offset', shockFull: 'shock_full', shockStroke: 'shock_stroke', shockNeutral: 'shock_neutral', shockOd: 'shock_od', armPlate: 'arm_plate', eyeWidth: 'eye_width', eyeBolt: 'eye_bolt', pivotBore: 'pivot_bore', frameBolt: 'frame_bolt', stopBolt: 'stop_bolt', lockBolt: 'lock_bolt', stopR: 'stop_r', lockR: 'lock_r', innerLength: 'inner_length' }
  return Object.entries(f).filter(([key]) => key !== 'size').map(([key, value]) => `${names[key] || key}=${JSON.stringify(value)};`).join('\n')
}

export function familyBom(f: WheelchairFamily): string {
  const leg = f.height - f.wheel / 2
  const outLeg = leg - (2 * f.pitch + 20) - 25
  const pinSpan = f.gap + 2 * f.plate
  const armSpan = f.eyeWidth + 2 * f.armPlate
  const crossHole = f.size === 'XS' ? 1 : 2
  const rows: (string | number)[][] = [
    ['ID', 'Quantity', 'Description', 'Nominal specification mm', 'Status'],
    ['M01', 2, 'Side rail', `${f.tube} square x ${f.wall} wall x ${f.rail} long; 6061-T6 candidate`, 'Cut/drill after drawing review'],
    ['M02', 2, 'Lower upright', `${f.tube} square x ${f.wall} wall x ${outLeg} long; 6061-T6 candidate`, 'Cut/drill after drawing review'],
    ['M03', 2, 'Upper upright', `${f.inner} square x ${f.innerWall} wall x ${f.innerLength} long`, 'Indexed telescoping joint'],
    ['M04', 1, 'Bridge outer', `${f.tube} square x ${f.wall} wall x ${(f.width - f.tube) * 0.7} long`, 'Indexed telescoping joint'],
    ['M05', 1, 'Bridge inner', `${f.inner} square x ${f.innerWall} wall x ${(f.width - f.tube) * 0.7} long`, 'Indexed telescoping joint'],
    ['M06', 4, 'Fixed suspension cheek', `${f.plate} plate; fixed_plate.dxf`, 'Metal only for loaded bench testing'],
    ['M07', 4, 'Trailing arm cheek', `${f.armPlate} plate; arm_plate.dxf`, 'Metal only for loaded bench testing'],
    ['M08', 8, 'Frame corner cheek', `${f.plate} plate; corner_plate.dxf`, 'Metal only for loaded bench testing'],
    ['S01', 2, 'Adjustable spring/damper assembly', `Extended eyes ${f.shockFull}; stroke ${f.shockStroke}; nominal installed ${f.shockNeutral}; max OD ${f.shockOd}; eye bore ${f.eyeBolt}; eye width ${f.eyeWidth}`, 'RFQ interface only; supplier approval/tune pending'],
    ['S02', 2, 'Main pivot pin with head and cross-hole', `Ground diameter ${f.pivot}; underhead to retaining washer inner face ${pinSpan + 0.5}; end cross-hole ${crossHole}; washer stack detailed in guide`, 'Custom turned steel candidate; drawing review required'],
    ['S03', 4, 'Pivot bronze bush', `ID ${f.pivot}; nominal OD ${f.pivotBore}; length ${f.armPlate}; fit per supplier, not raw DXF`, 'Supplier running/press fits pending'],
    ['S04', 2, 'Inner pivot spacer', `ID ${f.pivot + 0.2}; OD ${f.pivotBore}; length ${f.eyeWidth}`, 'Turned metal'],
    ['S05', 4, 'Outer pivot spacer', `ID ${f.pivot + 0.2}; OD ${f.pivotBore}; length ${(f.gap - armSpan) / 2}`, 'Turned metal'],
    ['S06', 2, 'Travel-stop pin, head and cross-hole', `Ground diameter ${f.stopBolt}; retention span ${pinSpan + 0.5}; end cross-hole ${crossHole}`, 'Must slide freely in both slots; no preload'],
    ['S07', 2, 'Lock pin, head and cross-hole', `Ground diameter ${f.lockBolt}; retention span ${pinSpan + 0.5}; end cross-hole ${crossHole}`, 'Installed only in neutral hole, never a friction lock'],
    ['S08', 2, 'Stop pin arm spacer', `ID ${f.stopBolt + 0.2}; length ${f.eyeWidth}; OD ${f.stopBolt + 4}`, 'Metal; between arm cheeks'],
    ['S09', 2, 'Lock pin arm spacer', `ID ${f.lockBolt + 0.2}; length ${f.eyeWidth}; OD ${f.lockBolt + 4}`, 'Metal; between arm cheeks'],
    ['S10', 4, 'Upper shock eye spacer', `ID ${f.eyeBolt + 0.2}; length ${(f.gap - f.eyeWidth) / 2}; OD ${f.eyeBolt + 4}`, 'Confirm does not contact shock body/eye rotation'],
    ['S11', 2, 'Upper shock pivot pin', `Diameter ${f.eyeBolt}; retention span ${pinSpan + 0.5}; end cross-hole ${crossHole}`, 'Supplier eye-bushing fit pending'],
    ['S12', 2, 'Lower shock pivot pin', `Diameter ${f.eyeBolt}; retention span ${armSpan + 0.5}; end cross-hole ${crossHole}`, 'Connects paired arm cheeks through eye'],
    ['W01', 2, 'Wheel and pneumatic tire assembly', `OD ${f.wheel}; tire width <=${f.tireWidth}; hub bearing stack ${f.hubWidth}; bore ${f.axle}`, 'Exact wheel SKU, tire pressure and capacity pending'],
    ['W02', 2, 'Headed axle shaft', `Diameter ${f.axle}; retention span ${armSpan + f.wheelOffset - f.hubWidth / 2 - armSpan / 2 + f.hubWidth + 0.5}; end cross-hole ${crossHole}`, 'Custom turned steel; no thread running in bearing'],
    ['W03', 2, 'Inner axle spacer', `ID ${f.axle + 0.2}; length ${f.eyeWidth}; OD ${f.axle + 4}`, 'Between arm cheeks'],
    ['W04', 2, 'Outer axle spacer', `ID ${f.axle + 0.2}; length ${f.wheelOffset - f.hubWidth / 2 - armSpan / 2}; OD ${f.axle + 4}`, 'Between outer arm and wheel inner bearing'],
    ['H01', 16, 'Frame joint through-bolt set', `M${f.frameBolt}; grip ${f.tube + 2 * f.plate}; length >= grip + 2 washers + full locknut engagement`, '8 rail/upright + 8 bridge bolts; verify selected actual lengths'],
    ['H02', 4, 'Suspension-to-upright through-bolt set', `M${f.frameBolt}; grip ${pinSpan}`, 'Choose length from actual washers and locknut'],
    ['H03', 4, 'Upright index through-bolt set', `M${f.frameBolt}; grip ${f.tube}`, 'Two per upright; no friction-only height retention'],
    ['H04', 2, 'Bridge index through-bolt set', `M${f.frameBolt}; grip ${f.tube}`, 'Two at nominal center +/- pitch/2'],
    ['H05', 8, 'Fixed cheek-to-upright spacer', `ID ${f.frameBolt + 0.4}; length ${(f.gap - f.tube) / 2}; OD ${f.frameBolt + 6}`, 'Four per side, no printed compression stack'],
    ['H06', 12, 'Small tube-to-corner cheek spacers', `ID ${f.frameBolt + 0.4}; length ${(f.tube - f.inner) / 2}; OD ${f.frameBolt + 6}`, '8 at upper uprights + 4 at right bridge'],
    ['H07a', 20, 'Outer tube crush sleeves', `OD ${f.frameBolt + 2}; ID ${f.frameBolt + 0.2}; length ${f.tube}; tube bore ${f.frameBolt + 2.2}`, 'Ends flush with outer faces; 6 index sleeves removable'],
    ['H07b', 6, 'Inner tube crush sleeves', `OD ${f.frameBolt + 2}; ID ${f.frameBolt + 0.2}; length ${f.inner}; tube bore ${f.frameBolt + 2.2}`, '4 upper upright corner bolts + 2 right bridge corner bolts'],
    ['H08', 52, 'Frame bolt washers', `Fits M${f.frameBolt}`, 'Two per through-bolt'],
    ['H09', 26, 'Frame bolt prevailing-torque locknuts', `M${f.frameBolt}`, 'No torque specified until joint procedure validated'],
    ['H10', 12, 'Clevis pin retention cotters', `${crossHole} cross-hole interface; actual cotter and pin end ligament require review`, 'One per headed pin, including axles'],
    ['H11', 12, 'Clevis pin end washers', `Bore matches each pin; nominal thickness 1.5; cross-hole diameter 1 for XS or 2 for other families`, 'One per pin at cotter end; retain 0.5 axial float, see shaft drawing notes'],
    ['T01', 1, 'Padded rear support harness', 'Professionally selected, measured and supplier-rated', 'Not a printed or self-designed textile sling'],
    ['T02', 1, 'Front harness and paired side tethers', 'Professionally selected, independent of suspension', 'Hardware and routing approved at fit gate'],
    ['T03', 1, 'Bench ballast cradle, scales and safety catch', 'Keep ballast out of pinch paths; supported load measured on rig', 'Fixture specified by test engineer, not supplied as wearable part'],
    ...cadParts.filter(p => p.category !== 'metal').map(p => [`P-${p.id}`, p.qty, p.purpose, `${p.id}.stl`, p.category === 'fixture' ? 'Bench tooling only' : 'Nonstructural print, not a released wearable part']),
  ]
  return `${rows.map(row => row.map(value => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\n')}\n`
}

function familyDirectory(root: string, f: WheelchairFamily, profile?: WheelchairProfile): string {
  return profile ? join(root, 'designs/wheelchair/iterations', profile.id) : join(root, 'designs/wheelchair/r0', f.size)
}

export async function generateWheelchairSources(root: string, profile?: WheelchairProfile): Promise<void> {
  for (const f of profile ? [profile.family] : wheelchairFamilies) {
    validateFamily(f)
    const dir = familyDirectory(root, f, profile)
    await mkdir(dir, { recursive: true })
    await Bun.write(join(dir, 'model.scad'), `// GENERATED by buddy design:wheelchair. BENCH ONLY, NOT FITTED TO A DOG.\n${parameters(f)}\ninclude <${profile ? '../../r0/source' : '../source'}/wheelchair.scad>\n`)
    await Bun.write(join(dir, 'parameters.json'), `${JSON.stringify({ revision: 'r0', status: 'BENCH_ONLY_NOT_ANIMAL_USE', fittedToBuddy: false, units: 'mm', ...f }, null, 2)}\n`)
    if (profile)
      await Bun.write(join(dir, 'profile.json'), `${JSON.stringify({ id: profile.id, basis: f.size, context: profile.context, geometryIsEstimated: true, status: 'BENCH_ONLY_NOT_ANIMAL_USE' }, null, 2)}\n`)
    await Bun.write(join(dir, 'bom.csv'), familyBom(f))
    const curves = f.radii.map((radius, index) => ({ setting: index, radius, nominalWheelRatePerShockRate: rounded((radius / f.arm) ** 2), wheelBumpMm: rounded(f.arm * Math.sin(rad(6))), wheelDroopMm: rounded(f.arm * Math.sin(rad(3))), shockAtDroopMm: rounded(suspensionLength(f, radius, -3)), shockAtNeutralMm: f.shockNeutral, shockAtBumpMm: rounded(suspensionLength(f, radius, 6)) }))
    await Bun.write(join(dir, 'kinematics.json'), `${JSON.stringify({ status: 'IDEAL_RIGID_KINEMATICS_NOT_LOAD_VALIDATION', angleRangeDegrees: [-3, 6], clearanceAllowanceMm: 0.2, curves }, null, 2)}\n`)
    const tubeBore = f.frameBolt + 2.2
    const lowerLength = f.height - f.wheel / 2 - (2 * f.pitch + 20) - 25
    const uprightTop = f.height - f.wheel / 2 - (2 * f.pitch + 20)
    const upperBottom = f.height - f.tube / 2 - f.innerLength
    const tubeRows = [
      ['Part', 'Quantity', 'Axis / datum', 'Hole centers mm', 'Tube hole diameter mm', 'Notes'],
      ['Side rail', 2, 'X from front cut end; drill along Y', [f.rail - 80 - 2 * f.pitch, f.rail - 80 - f.pitch].join(' / '), tubeBore, 'Side corner pair'],
      ['Side rail', 2, 'X from front cut end; drill along Z', [f.rail - 20 - 2 * f.pitch, f.rail - 20 - f.pitch].join(' / '), tubeBore, 'Rear bridge corner pair'],
      ['Lower upright', 2, 'Z from lower cut end; drill along Y', '10 / 40', tubeBore, 'Fixed suspension cheek attachment'],
      ['Lower upright', 2, 'Z from lower cut end; drill along Y', [lowerLength - 20 - f.pitch, lowerLength - 20].join(' / '), tubeBore, 'Height index pair, outer wall'],
      ['Upper upright', 2, 'Z from lower cut end; drill along Y', [f.innerLength + f.tube / 2 - 2 * f.pitch, f.innerLength + f.tube / 2 - f.pitch].join(' / '), tubeBore, 'Upper frame corner pair, with cheek spacers'],
      ['Upper upright', 2, 'Z from lower cut end; drill along Y', [f.wheel / 2 + uprightTop - 20 - f.pitch - upperBottom, f.wheel / 2 + uprightTop - 20 - upperBottom].join(' / '), tubeBore, 'Match-drill nominal telescoping pair after centering, no extra adjustment rows in r0'],
      ['Bridge outer and inner', 1, 'Y from each bridge outboard cut end toward center; drill along Z', [f.pitch - f.tube / 2, 2 * f.pitch - f.tube / 2].join(' / '), tubeBore, 'End corner attachment pair, both ends'],
      ['Bridge outer and inner', 1, 'Y from each outboard end toward center; drill along Z', [((f.width - f.tube) - f.pitch) / 2, ((f.width - f.tube) + f.pitch) / 2].join(' / '), tubeBore, 'Match-drill both nested tubes at nominal width'],
    ]
    await Bun.write(join(dir, 'tube-drilling.csv'), `${tubeRows.map(row => row.map(value => `"${String(value)}"`).join(',')).join('\n')}\n`)
  }
}

export async function exportWheelchairCad(root: string, selected: string, executable: string, profile?: WheelchairProfile): Promise<void> {
  const families = profile ? [profile.family] : selected === 'all' ? wheelchairFamilies : wheelchairFamilies.filter(f => f.size === selected.toUpperCase())
  if (!families.length)
    throw new Error('Choose XL, L, M, S, XS or all')
  const version = Bun.spawnSync([executable, '--version'])
  if (version.exitCode !== 0)
    throw new Error('OpenSCAD executable did not start. Pass --openscad /absolute/path/to/OpenSCAD')
  await generateWheelchairSources(root, profile)
  for (const f of families) {
    const dir = familyDirectory(root, f, profile)
    await mkdir(join(dir, 'stl'), { recursive: true })
    await mkdir(join(dir, 'dxf'), { recursive: true })
    const records: { file: string, bytes: number, sha256: string, purpose: string }[] = []
    const meshes: { file: string, inspection: ReturnType<typeof inspectBinaryStl> }[] = []
    async function run(args: string[], output: string, purpose: string): Promise<void> {
      const proc = Bun.spawn([executable, ...args, join(dir, 'model.scad')], { env: { ...process.env, QT_QPA_PLATFORM: 'offscreen' }, stdout: 'pipe', stderr: 'pipe' })
      const [code, stdout, stderr] = await Promise.all([proc.exited, new Response(proc.stdout).text(), new Response(proc.stderr).text()])
      if (code !== 0 || /ERROR:|WARNING:/.test(stderr))
        throw new Error(`CAD export failed: ${f.size}/${output}\n${stdout}\n${stderr}`)
      const asset = Bun.file(join(dir, output))
      if (!await asset.exists() || asset.size < 100)
        throw new Error(`Missing or empty export: ${output}`)
      records.push({ file: output, bytes: asset.size, sha256: new Bun.CryptoHasher('sha256').update(await asset.arrayBuffer()).digest('hex'), purpose })
      if (output.endsWith('.stl')) {
        const inspection = inspectBinaryStl(await asset.arrayBuffer())
        if (!inspection.closed || !inspection.consistentlyOriented || inspection.components !== 1 || inspection.signedVolumeMm3 <= 0 || inspection.boundsMm.size.some((dimension, i) => dimension > (i === 2 ? 100 : 220)))
          throw new Error(`STL geometry inspection failed: ${f.size}/${output}`)
        meshes.push({ file: output, inspection })
      }
    }
    for (const p of cadParts) {
      const prefix = p.category === 'metal' ? 'FIT_CHECK_ONLY_' : ''
      const output = `stl/${prefix}${p.id}.stl`
      await run(['-D', `part="${p.id}"`, '--export-format', 'binstl', '-o', join(dir, output)], output, p.purpose)
      if (p.category === 'metal') {
        const dxf = `dxf/${p.id}.dxf`
        await run(['-D', `part="${p.id}"`, '-D', 'projection_mode=true', '-o', join(dir, dxf)], dxf, 'Metal fabrication profile, finish holes per drawing')
      }
    }
    const views = f.size === 'XL' ? [
      { name: 'assembly', camera: '0,0,300,65,0,35,1800', defines: ['part="assembly"'] },
      { name: 'suspension', camera: '75,0,75,65,0,40,550', defines: ['part="suspension"'] },
      { name: 'exploded-suspension', camera: '75,0,75,65,0,40,650', defines: ['part="suspension"', 'explode=24'] },
    ] : [{ name: 'assembly', camera: `0,0,${f.height / 2},65,0,35,${f.height * 3.5}`, defines: ['part="assembly"'] }]
    for (const view of views) {
      const output = `${view.name}.png`
      await run([...view.defines.flatMap(d => ['-D', d]), '--imgsize=1400,1000', '--viewall', '--autocenter', '--colorscheme=Tomorrow', `--camera=${view.camera}`, '-o', join(dir, output)], output, 'CAD-derived bench visualization, not a product photo')
    }
    const sourceHash = new Bun.CryptoHasher('sha256').update(await Bun.file(join(root, 'designs/wheelchair/r0/source/wheelchair.scad')).text()).update(await Bun.file(join(dir, 'model.scad')).text()).digest('hex')
    await Bun.write(join(dir, 'mesh-inspection.json'), `${JSON.stringify({ status: 'DIGITAL_GEOMETRY_ONLY_NOT_PHYSICAL_VALIDATION', sourceHash, meshes }, null, 2)}\n`)
    await Bun.write(join(dir, 'exports.json'), `${JSON.stringify({ revision: 'r0', status: 'BENCH_ONLY_NOT_ANIMAL_USE', sourceHash, tool: `${new TextDecoder().decode(version.stdout)}${new TextDecoder().decode(version.stderr)}`.trim(), files: records }, null, 2)}\n`)
  }
}

export const designRoot = resolve(import.meta.dir, '../..')

export async function bundleWheelchairDesign(root: string): Promise<string> {
  const output = join(root, 'storage/framework/runtime/buddy-wheels-bench-r0.tar.gz')
  await mkdir(join(root, 'storage/framework/runtime'), { recursive: true })
  const files: Record<string, Uint8Array | string> = {
    'Buddy-Wheels-bench-r0/README.md': '# Buddy Wheels bench CAD r0\n\nNot for animal use. Start with designs/wheelchair/r0/README.md and docs/engineering/xl-assembly-r0.md. Buddy is owner-reported 140 lb; fit dimensions are estimates. This archive includes all five baseline families, a separately configurable Buddy XL iteration, BOMs, drawings and instructions. Full application and native rebuild commands: https://github.com/stacksjs/buddy-wheels\n',
  }
  // Explicit source/document allowlist: no environment, credentials or runtime files.
  for (const pattern of ['designs/wheelchair/**/*', 'docs/**/*', 'app/Designs/*.ts', 'app/Commands/DesignWheelchair.ts', 'tests/unit/wheelchair-cad.test.ts']) {
    for await (const name of new Bun.Glob(pattern).scan({ cwd: root, onlyFiles: true }))
      files[`Buddy-Wheels-bench-r0/${name}`] = new Uint8Array(await Bun.file(join(root, name)).arrayBuffer())
  }
  await Bun.Archive.write(output, files, { compress: 'gzip', level: 6 })
  return output
}
