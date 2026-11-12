/**
 * Buddy Rover r0: a large low-entry carrier bench design. No load rating, fit approval or animal-use release exists.
 * X forward, Y across, Z up. Origin is on the ground under the rear axle, on the centerline. Millimeters.
 */
export type RoverWheel = 'trail' | 'path' | 'run'
export interface RoverSetup { length: number, width: number, height: number, ramp: number, axle: number, handle: number, hub: number, wheel: RoverWheel }
export const roverStart: RoverSetup = { length: 1200, width: 700, height: 950, ramp: 900, axle: 520, handle: 980, hub: 101.6, wheel: 'trail' }
/**
 * Two wheel choices on the same 124 mm base-rail height, so the deck and ramp do not change.
 * rise is the axle height above the base-rail centerline; posts are the hanger bolt heights on the post.
 */
export const roverWheels = {
  trail: { label: '15 inch trail wheel, 4.00-8', od: 385.8, tire: 79.4, rim: 102, rise: 68.9, posts: [105, 135], hanger: 'axle_hanger_mid', spacer: 12.7, forkSpacer: 0, kg: 3.2, hub: 101.6 },
  path: { label: '13 x 4 inch path wheel', od: 330.2, tire: 101.6, rim: 76, rise: 41.1, posts: [75, 105], hanger: 'axle_hanger_low', spacer: 25.4, forkSpacer: 25.4, kg: 2.13, hub: 82.55 },
  run: { label: '20 inch run wheel', od: 508, tire: 54, rim: 212, rise: 130, posts: [60, 105, 155], hanger: 'axle_hanger', spacer: 12.7, forkSpacer: 0, kg: 2.3, hub: 75 },
} as const
/** Stock bars as sold by the priced supplier. Thin wall is 1/16 inch 6063-T52, chassis wall is 1/8 inch 6061-T6. */
export const roverTubeStock = { heavy: { mm: 7315.2, label: '24 ft', alloy: '6061-T6', wall: '1/8 inch' }, light: { mm: 6400.8, label: '21 ft', alloy: '6063-T52', wall: '1/16 inch' } } as const
export const roverLimits = { length: [1000, 1400], width: [600, 800], height: [800, 1100], ramp: [700, 1100], axle: [300, 650], handle: [800, 1100], hub: [50, 110] } as const
export const roverHardware = {
  tube: 25.4, heavy: 3.175, light: 1.5875, plate: 3.175, panel: 12, bedding: 3.2, mat: 5,
  axle: 15.875, sleeve: 9.525, sleeveWall: 1.2446, axleSleeve: 19.05, axleSleeveWall: 1.4732,
  washer: 1.5, cotter: 3.2, reach: 380, hingeGap: 6, foot: 35, ridge: 60, pole: 12.7, forkGap: 30, forkTail: 60,
} as const
/** Planning payload used for arithmetic only. It is not a rating. Buddy is owner-reported 140 lb. */
export const roverPlanningDogKg = 72.6
/** Reference facts about another maker's product, used only to compare stated geometry. */
export const referenceCarrier = { name: 'Burley Bark Ranger XL', checked: '2026-11-11', url: 'https://burley.com/products/bark-ranger-xl-ski-bundle', interior: [919.5, 569, 759.5], interiorIn: [36.2, 22.4, 29.9], capacityLb: 100, weightLb: 33, stepUpMm: 228.6, stepUpIn: 9, dropIn: 6.5, maxPetLengthIn: 33, maxPetHeightIn: 34, overallIn: [36.5, 32.8, 37.3] } as const

export const roverParts = [
  { id: 'cap_heavy', name: 'Chassis tube cap', kind: 'print', note: 'Closes 1/8 inch wall tube ends. End protection only.' },
  { id: 'cap_light', name: 'Cabin tube cap', kind: 'print', note: 'Closes .065 inch wall tube ends. End protection only.' },
  { id: 'ramp_toe', name: 'Ramp threshold toe', kind: 'print', note: 'Ground-supported bevel that removes the step at the ramp edge. It is not the ramp structure.' },
  { id: 'ridge_saddle', name: 'Roof ridge saddle', kind: 'print', note: 'Holds the ridge pole above the frame so the roof sheds water. Carries fabric tension only.' },
  { id: 'fabric_clip', name: 'Cover rail clip', kind: 'print', note: 'Snaps a cover hem onto a frame tube. No restraint or structural function.' },
  { id: 'cable_clip', name: 'Brake cable clip', kind: 'print', note: 'Routes one brake cable housing along a tube. Not a brake anchor.' },
  { id: 'axle_cover', name: 'Axle end cover', kind: 'print', note: 'Covers a shaft end and cotter. Never a shaft retainer or a complete fur guard.' },
  { id: 'guide_butt', name: 'Drill guide, butt ends', kind: 'fixture', note: 'Pilot centers 22.3, 37.3, 52.3 and 67.3 mm from a cut end. Layout aid only.' },
  { id: 'guide_run', name: 'Drill guide, corner runs', kind: 'fixture', note: 'Pilot centers 47.7, 62.7, 77.7 and 92.7 mm from a rail end. Layout aid only.' },
  { id: 'guide_tee', name: 'Drill guide, tee pattern', kind: 'fixture', note: 'Pilot centers 30 mm each side of a scribed joint line. Layout aid only.' },
  { id: 'coupon', name: 'Clearance coupon', kind: 'fixture', note: 'Calibrates the actual printer before any fit is trusted. Not part of the carrier.' },
  { id: 'tee_gusset', name: 'Tee gusset', kind: 'metal', note: '1/8 inch 6061-T6 aluminum. STL is an unloaded fit-check copy.' },
  { id: 'corner_gusset', name: 'Corner gusset', kind: 'metal', note: '1/8 inch 6061-T6 aluminum, one profile used in both hands. STL is an unloaded fit-check copy.' },
  { id: 'axle_hanger_mid', name: 'Axle hanger, trail wheel', kind: 'metal', note: '1/8 inch 304 stainless steel. Carries a 15 inch wheel axle 69 mm above the base rail. STL is an unloaded fit-check copy.' },
  { id: 'axle_hanger_low', name: 'Axle hanger, path wheel', kind: 'metal', note: '1/8 inch 304 stainless steel. Carries a 13 inch wheel axle 41 mm above the base rail. STL is an unloaded fit-check copy.' },
  { id: 'axle_hanger', name: 'Axle hanger, run wheel', kind: 'metal', note: '1/8 inch 304 stainless steel. Carries a 20 inch wheel axle 130 mm above the base rail. STL is an unloaded fit-check copy.' },
] as const
export type RoverPartId = typeof roverParts[number]['id']
export function roverPartFile(id: string): string {
  const part = roverParts.find(p => p.id === id)
  if (!part) throw new Error('Unknown Rover part.')
  return `${part.kind === 'metal' ? 'FIT_CHECK_ONLY_' : ''}${id}.stl`
}

export const mm = (n: number) => Math.round(n * 10000) / 10000
const degrees = (radians: number) => radians * 180 / Math.PI

export function parseRoverSetup(input: Record<string, unknown>): RoverSetup {
  for (const key of Object.keys(input)) if (!Object.hasOwn(roverStart, key)) throw new Error(`Unknown Rover setup field: ${key}`)
  const setup = { ...roverStart }
  const wheel = input.wheel ?? roverStart.wheel
  if (typeof wheel !== 'string' || !Object.hasOwn(roverWheels, wheel)) throw new Error('Choose the trail, path or run wheel.')
  setup.wheel = wheel as RoverWheel
  for (const key of (Object.keys(setup) as (keyof RoverSetup)[]).filter((k): k is Exclude<keyof RoverSetup, 'wheel'> => k !== 'wheel')) {
    const value = input[key] ?? setup[key]
    if ((typeof value !== 'number' && (typeof value !== 'string' || !/^\d+(?:\.\d+)?$/.test(value))) || !Number.isFinite(Number(value))) throw new Error(`Enter a positive number for ${key}.`)
    const n = Number(value); const [min, max] = roverLimits[key]; const step = key === 'hub' ? 0.05 : 10
    if (n < min || n > max || Math.abs(n / step - Math.round(n / step)) > 0.000001) throw new Error(`${key} must be ${min}-${max} mm in ${step} mm steps.`)
    setup[key] = n
  }
  const d = roverDimensions(setup)
  if (d.tireGap < 5) throw new Error('That hub is too short for this tire. The tire would rub the axle hanger.')
  if (setup.ramp > setup.height) throw new Error('The ramp stows upright as the tailgate, so it cannot be longer than the cabin height.')
  if (d.rampAngle > 12) throw new Error('Ramp incline is over 12 degrees. Choose a longer ramp.')
  if (d.centerAhead < 40) throw new Error('Move the axle back toward the tailgate. A centered dog must sit at least 40 mm ahead of the rear axle.')
  if (setup.handle > d.handleMax) throw new Error(`Handle height must be ${d.handleMax} mm or lower for this cabin height.`)
  return setup
}
export const roverQuery = (s: RoverSetup) => new URLSearchParams(Object.fromEntries(Object.entries(s).map(([k, v]) => [k, String(v)]))).toString()
export const roverCode = (s: RoverSetup) => `rover-r0-l${s.length}-w${s.width}-h${s.height}-r${s.ramp}-a${s.axle}-g${s.handle}-hub${s.hub}-${s.wheel}`

/** Base cross members: rear sill, front, and intermediates no more than 400 mm apart, kept clear of the axle hangers. */
export function crossStations(s: RoverSetup): number[] {
  const t = roverHardware.tube; const rear = -s.axle - t / 2; const front = s.length - s.axle + t / 2
  const count = Math.ceil((front - rear) / 400) - 1
  const between = Array.from({ length: count }, (_, i) => rear + (i + 1) * (front - rear) / (count + 1)).map(x => Math.abs(x) < 95 ? (x < 0 ? -95 : 95) : x)
  return [rear, ...between, front].map(mm)
}

export function roverDimensions(s: RoverSetup) {
  const h = roverHardware; const t = h.tube; const w = roverWheels[s.wheel]; const R = w.od / 2
  const railZ = R - w.rise; const deck = railZ + t / 2 + h.bedding + h.panel; const topZ = deck + s.height + t / 2
  const rearX = -s.axle; const frontX = s.length - s.axle
  const rail = s.length + 2 * t; const post = s.height + h.panel + h.bedding
  const stations = crossStations(s); const intermediates = stations.length - 2
  const end = 8 + h.cotter / 2
  const rearStack = t + 2 * h.plate + w.spacer + s.hub + 2 * h.washer; const rearShaft = rearStack + 0.5 + 2 * end
  const postY = s.width / 2 + t / 2; const inboard = t / 2 + h.plate + h.washer + end + 0.25
  const wheelY = s.width / 2 + t + h.plate + w.spacer + s.hub / 2
  const forkY = s.hub / 2 + h.washer + w.forkSpacer + h.plate + t / 2
  const frontStack = s.hub + 4 * h.washer + 4 * h.plate + 2 * t + 2 * w.forkSpacer; const frontShaft = frontStack + 0.5 + 2 * end
  const forkArm = h.forkGap + R + h.forkTail; const wheelbase = frontX + t + h.forkGap + R
  const stub = w.posts.at(-1)! + 18 - t / 2
  const rampAngleRad = Math.asin((deck - h.panel) / s.ramp); const rampWidth = s.width - 12
  const legCut = (deck - 40 * Math.sin(rampAngleRad)) / Math.cos(rampAngleRad) - h.panel - t - h.foot
  const hingeX = rearX - t - h.hingeGap; const gripX = rearX - t - h.reach
  const handleArm = 40 + s.axle + t + h.reach; const grip = s.width + 2 * t
  const handleMax = Math.floor((deck + s.height - 110) / 10) * 10
  const centerAhead = s.length / 2 - s.axle
  const roofSlope = Math.hypot(s.width / 2 + t, h.ridge + h.pole)
  const cuts = [
    { id: 'C01', name: 'Base side rail', wall: 'heavy', qty: 2, length: rail },
    { id: 'C02', name: 'Base end cross member', wall: 'heavy', qty: 2, length: s.width },
    { id: 'C03', name: 'Axle post', wall: 'heavy', qty: 2, length: post },
    { id: 'C04', name: 'Fork arm', wall: 'heavy', qty: 2, length: forkArm },
    { id: 'C05', name: 'Fork stub post', wall: 'heavy', qty: 2, length: stub },
    { id: 'C06', name: 'Ramp side curb rail', wall: 'heavy', qty: 2, length: s.ramp },
    { id: 'C07', name: 'Ramp under rib', wall: 'light', qty: 2, length: rampWidth },
    { id: 'C08', name: 'Ramp stand leg', wall: 'heavy', qty: 2, length: legCut },
    { id: 'C09', name: 'Corner post', wall: 'light', qty: 4, length: post },
    { id: 'C10', name: 'Top side rail', wall: 'light', qty: 2, length: rail },
    { id: 'C11', name: 'Top cross tube', wall: 'light', qty: 3, length: s.width },
    { id: 'C12', name: 'Handle arm', wall: 'light', qty: 2, length: handleArm },
    { id: 'C13', name: 'Handle grip tube', wall: 'light', qty: 1, length: grip },
    { id: 'C14', name: 'Base intermediate cross member', wall: 'light', qty: intermediates, length: s.width },
  ].map(c => ({ ...c, length: mm(c.length) }))
  const counts = {
    corner: 28, tee: 2 * intermediates + 6, hanger: 8,
    bolts: 124 + 8 * intermediates, handleBolts: 4, sleeves: 124 + 8 * intermediates + 8,
    rampBolts: 2 * (Math.floor(s.ramp / 200) + 1) + 6, floorScrews: 2 * Math.ceil(rail / 250) + stations.length * 3,
    capHeavy: 12, capLight: 12, toe: Math.floor(rampWidth / 200), saddle: 3, fabricClip: 28, cableClip: 6, axleCover: 6,
  }
  const heavyM = cuts.filter(c => c.wall === 'heavy').reduce((n, c) => n + c.qty * c.length, 0) / 1000
  const lightM = cuts.filter(c => c.wall === 'light').reduce((n, c) => n + c.qty * c.length, 0) / 1000
  const floorArea = rail * (s.width + 2 * t) / 1e6; const rampArea = s.ramp * rampWidth / 1e6
  // Planning arithmetic from nominal densities. Nothing has been weighed.
  const mass = {
    tube: heavyM * 0.762 + lightM * 0.408,
    plates: (counts.corner * 6900 + counts.tee * 8000) * h.plate * 2.7e-6 + counts.hanger * 10950 * h.plate * 7.9e-6,
    // 15/32 inch exterior pine plywood, nominal.
    panels: (floorArea + rampArea) * 6.5,
    wheels: 3 * w.kg,
    hardware: (counts.bolts + counts.handleBolts) * 0.027 + 2.2,
    softgoods: 4.2,
  }
  const carrierKg = Object.values(mass).reduce((a, b) => a + b, 0)
  const lever = (s.axle + t + h.reach) / 1000
  const tiltForceN = (roverPlanningDogKg + carrierKg) * 9.81 * (centerAhead / 1000) / lever
  return {
    R, wheel: w, tire: w.tire, spacer: w.spacer, forkSpacer: w.forkSpacer, tireGap: mm(w.spacer + s.hub / 2 - w.tire / 2), railZ: mm(railZ), deck: mm(deck), topZ: mm(topZ), clearance: mm(railZ - t / 2 - h.plate), rearX, frontX, rail: mm(rail), post: mm(post), stations, intermediates,
    rearStack: mm(rearStack), rearShaft: mm(rearShaft), postY: mm(postY), inboard: mm(inboard), wheelY: mm(wheelY), cabinIntrusion: mm(inboard - t / 2),
    forkY: mm(forkY), frontStack: mm(frontStack), frontShaft: mm(frontShaft), forkArm: mm(forkArm), stub: mm(stub), wheelbase: mm(wheelbase),
    rampAngle: mm(degrees(rampAngleRad)), rampAngleRad, rampWidth: mm(rampWidth), rampRise: mm(deck - h.panel), legCut: mm(legCut), hingeX: mm(hingeX), gripX: mm(gripX),
    handleArm: mm(handleArm), grip: mm(grip), handleMax, centerAhead: mm(centerAhead), roofSlope: mm(roofSlope),
    overallWidth: mm(2 * (postY - inboard + rearShaft)), tireWidth: mm(2 * wheelY + w.tire), overallLength: mm(wheelbase + R - gripX), overallHeight: mm(topZ + t / 2 + h.ridge + h.pole + 4),
    cuts, counts, heavyM: mm(heavyM), lightM: mm(lightM), tubeLb: Math.round((heavyM * 0.762 + lightM * 0.408) * 2.2046 * 10) / 10, floorArea: mm(floorArea), rampArea: mm(rampArea),
    mass: Object.fromEntries(Object.entries(mass).map(([k, v]) => [k, Math.round(v * 10) / 10])) as Record<keyof typeof mass, number>, carrierKg: Math.round(carrierKg * 10) / 10,
    frontShare: mm(centerAhead / wheelbase * 100), tiltForceN: Math.round(tiltForceN), tiltForceLbf: Math.round(tiltForceN / 4.448),
    volumeRatio: mm(s.length * s.width * s.height / (referenceCarrier.interior[0] * referenceCarrier.interior[1] * referenceCarrier.interior[2])),
  }
}
export type RoverDimensions = ReturnType<typeof roverDimensions>

/** Whole-stock first-fit packing for one wall thickness in the supplier's bar length, one saw kerf per cut. */
export function packRoverStock(s: RoverSetup, wall: 'heavy' | 'light', quantity: number, stock: number = roverTubeStock[wall].mm, kerf = 3) {
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 1000 || !(stock > 0) || !(kerf >= 0)) throw new Error('Invalid stock packing inputs.')
  const pieces = roverDimensions(s).cuts.filter(c => c.wall === wall).flatMap(c => Array.from({ length: c.qty * quantity }, () => c.length)).sort((a, b) => b - a)
  const remaining: number[] = []
  for (const length of pieces) {
    const used = length + kerf
    if (used > stock) throw new Error('Cut exceeds stock length.')
    const index = remaining.findIndex(left => left + 0.000001 >= used)
    if (index < 0) remaining.push(stock - used)
    else remaining[index] = remaining[index]! - used
  }
  return { bars: remaining.length, netMm: mm(pieces.reduce((a, b) => a + b, 0)), kerfMm: pieces.length * kerf, stockMm: mm(remaining.length * stock) }
}
