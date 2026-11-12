/**
 * Buddy Rover r0: a large low-entry carrier bench design. No load rating, fit approval or animal-use release exists.
 * X forward, Y across, Z up. Origin is on the ground under the rear axle, on the centerline. Millimeters.
 */
export type RoverWheel = 'trail' | 'path' | 'run'
export type RoverFront = 'swivel' | 'fixed'
/** ski adds the snow conversion: the wheels and the front wheel come off, skis go on the rear axles and two tow shafts pin to the front. */
export type RoverKit = 'wheels' | 'ski'
/** welded is a frame for a fabrication shop: mitred, welded joints, a real raked front pillar and a roof that tapers toward the front. bolted is the drill-and-gusset version one person can build. */
export type RoverBuild = 'welded' | 'bolted'
/** sprung hangs each rear wheel on a trailing swing arm with a coil-over shock. rigid bolts the axle to the frame on hangers. */
export type RoverRide = 'sprung' | 'rigid'
/** seats adds a removable two-seat bench ahead of the axle. A layout concept only. It is not a child restraint and has no certification. */
export type RoverCabin = 'dog' | 'seats'
/** caster is the mounting height of the front swivel caster, floor to the top of its plate. It is ignored with a fixed front wheel. */
/** rake is how far the top of the front wall leans back from the bottom. taper is how far the roof drops from rear to front, welded build only. Zero for both gives a square box. */
export interface RoverSetup { length: number, width: number, height: number, ramp: number, axle: number, handle: number, hub: number, caster: number, rake: number, taper: number, wheel: RoverWheel, front: RoverFront, kit: RoverKit, build: RoverBuild, ride: RoverRide, cabin: RoverCabin }
export const roverStart: RoverSetup = { length: 1300, width: 700, height: 1000, ramp: 1000, axle: 560, handle: 1000, hub: 101.6, caster: 310, rake: 350, taper: 180, wheel: 'trail', front: 'swivel', kit: 'wheels', build: 'welded', ride: 'sprung', cabin: 'dog' }
export const roverBuilds = { welded: 'Welded frame, made by a fabrication shop', bolted: 'Bolted frame, built with a drill' } as const
export const roverRides = { sprung: 'Sprung rear wheels on swing arms', rigid: 'Rigid rear axle on hangers' } as const
export const roverCabins = { dog: 'Open floor for a dog', seats: 'Two-seat bench, concept only' } as const
export const roverKits = { wheels: 'On wheels', ski: 'Snow conversion on skis' } as const
/** One-tap combinations for the studio and the product page. Each is only a choice of wheel, front end and kit. */
export const roverActivities = {
  walk: { label: 'Walk', note: 'Swivel front, 15 inch wheels', wheel: 'trail', front: 'swivel', kit: 'wheels' },
  run: { label: 'Run', note: 'Fixed front wheel that tracks straight', wheel: 'trail', front: 'fixed', kit: 'wheels' },
  coast: { label: 'Coast', note: 'Wide 4 inch tires for sand', wheel: 'path', front: 'swivel', kit: 'wheels' },
  snow: { label: 'Snow', note: 'Skis and tow shafts', wheel: 'trail', front: 'swivel', kit: 'ski' },
} as const
export const roverFronts = { swivel: '10 inch swivel caster on a raised nose', fixed: 'Fixed third wheel on a fork' } as const
/**
 * Two wheel choices on the same 124 mm base-rail height, so the deck and ramp do not change.
 * rise is the axle height above the base-rail centerline; posts are the hanger bolt heights on the post.
 */
export const roverWheels = {
  trail: { label: '15 inch trail (4.00-8)', od: 385.8, tire: 79.4, rim: 102, rise: 68.9, posts: [105, 135], hanger: 'axle_hanger_mid', spacer: 12.7, forkSpacer: 0, kg: 3.2, hub: 101.6 },
  path: { label: '13 x 4 inch path', od: 330.2, tire: 101.6, rim: 76, rise: 41.1, posts: [75, 105], hanger: 'axle_hanger_low', spacer: 25.4, forkSpacer: 25.4, kg: 2.13, hub: 82.55 },
  run: { label: '20 inch run', od: 508, tire: 54, rim: 212, rise: 130, posts: [60, 105, 155], hanger: 'axle_hanger', spacer: 12.7, forkSpacer: 0, kg: 2.3, hub: 75 },
} as const
/** Stock bars as sold by the priced supplier. Thin wall is 1/16 inch 6063-T52, chassis wall is 1/8 inch 6061-T6. */
export const roverTubeStock = { heavy: { mm: 7315.2, label: '24 ft', alloy: '6061-T6', wall: '1/8 inch' }, light: { mm: 6400.8, label: '21 ft', alloy: '6063-T52', wall: '1/16 inch' } } as const
/** Parcel bars for a single build: 8 ft is the longest length the priced supplier ships without a truck. */
export const roverParcelStock = { mm: 2438.4, label: '8 ft' } as const
export const roverLimits = { length: [1000, 1400], width: [600, 800], height: [800, 1100], ramp: [700, 1100], axle: [300, 650], handle: [800, 1100], hub: [50, 110], caster: [250, 340], rake: [0, 500], taper: [0, 300] } as const
export const roverHardware = {
  tube: 25.4, heavy: 3.175, light: 1.5875, plate: 3.175, panel: 12, bedding: 3.2, mat: 5,
  axle: 15.875, sleeve: 9.525, sleeveWall: 1.2446, axleSleeve: 19.05, axleSleeveWall: 1.4732,
  washer: 1.5, cotter: 3.2, reach: 380, hingeGap: 6, foot: 3, ridge: 60, pole: 12.7, forkGap: 30, forkTail: 60,
  // Front swivel caster: wheel sweep radius, wheel size, trail behind the swivel axis and plate bolt pattern along and across the carrier.
  casterSweep: 185, casterWheel: 254, casterTire: 89, casterTrail: 57, casterAlong: 85.7, casterAcross: 70, casterKg: 3.6,
  // Parking brake: a short arm over each rear tire carries a push-pull toggle clamp. brakeDrop is arm centerline above the tire top.
  brakeArm: 140, brakeDrop: 170,
  // Snow kit: a purchased ski under a short tube foot, a post on the rear axle, and two tow shafts to a hip belt.
  // Rear suspension: a trailing swing arm outside each base rail, pivoting on a bolt through the rail, with a coil-over shock up to a stub on the axle post.
  // shockAt is the lower shock eye along the arm from the pivot. tabUp is an eye center above the centerline of the tube its tabs are welded to.
  // shockLength and shockStroke are a seller's stated figures for the priced candidate. shockRate is that seller's nominal spring label, not a measured rate.
  swingRun: 300, swingGap: 13, swingEnd: 25, shockAt: 240, tabUp: 30.7, shockArm: 46, shockLength: 150, shockStroke: 30, shockRate: 450, shockRadius: 22, shockKg: 0.45,
  // Two-seat bench concept: seat top above the deck, seat depth ahead of the axle posts, back bar above the seat.
  seatHeight: 200, seatDepth: 260, seatBack: 400,
  skiLength: 1100, skiWidth: 60, skiThick: 25, skiFoot: 400, skiAbove: 30, towShaft: 2400, hipHeight: 900,
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
  { id: 'brake_plate', name: 'Brake clamp plate', kind: 'metal', note: '1/8 inch 6061-T6 aluminum. Hangs from the brake arm on the two gusset bolts and carries the toggle clamp. STL is an unloaded fit-check copy.' },
  { id: 'shock_tab', name: 'Shock tab', kind: 'metal', note: '1/8 inch 6061-T6 aluminum. Welded in pairs to the swing arm and the shock arm to hold each shock eye. STL is an unloaded fit-check copy.' },
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
  const front = input.front ?? roverStart.front
  if (typeof front !== 'string' || !Object.hasOwn(roverFronts, front)) throw new Error('Choose the swivel or the fixed front wheel.')
  setup.front = front as RoverFront
  const kit = input.kit ?? roverStart.kit
  if (typeof kit !== 'string' || !Object.hasOwn(roverKits, kit)) throw new Error('Choose wheels or the ski kit.')
  setup.kit = kit as RoverKit
  const build = input.build ?? roverStart.build
  if (typeof build !== 'string' || !Object.hasOwn(roverBuilds, build)) throw new Error('Choose the welded or the bolted build.')
  setup.build = build as RoverBuild
  // The sprung rear is drawn for the welded frame and the 13 and 15 inch wheels. Anything else falls back to rigid unless stated.
  const ride = input.ride ?? (setup.build === 'bolted' || setup.wheel === 'run' ? 'rigid' : roverStart.ride)
  if (typeof ride !== 'string' || !Object.hasOwn(roverRides, ride)) throw new Error('Choose the sprung or the rigid rear wheels.')
  setup.ride = ride as RoverRide
  if (setup.build === 'bolted' && setup.ride === 'sprung') throw new Error('The sprung rear wheels need the welded frame. Choose rigid wheels for the bolted frame.')
  const cabin = input.cabin ?? roverStart.cabin
  if (typeof cabin !== 'string' || !Object.hasOwn(roverCabins, cabin)) throw new Error('Choose the open dog cabin or the two-seat concept.')
  setup.cabin = cabin as RoverCabin
  // A bolted frame has only square joints, so its roof cannot taper. An unstated taper falls back to zero there.
  if (setup.build === 'bolted' && input.taper === undefined) setup.taper = 0
  for (const key of (Object.keys(setup) as (keyof RoverSetup)[]).filter((k): k is Exclude<keyof RoverSetup, 'wheel' | 'front' | 'kit' | 'build' | 'ride' | 'cabin'> => !['wheel', 'front', 'kit', 'build', 'ride', 'cabin'].includes(k))) {
    const value = input[key] ?? setup[key]
    if ((typeof value !== 'number' && (typeof value !== 'string' || !/^\d+(?:\.\d+)?$/.test(value))) || !Number.isFinite(Number(value))) throw new Error(`Enter a positive number for ${key}.`)
    const n = Number(value); const [min, max] = roverLimits[key]; const step = key === 'hub' ? 0.05 : key === 'caster' ? 1 : 10
    if (n < min || n > max || Math.abs(n / step - Math.round(n / step)) > 0.000001) throw new Error(`${key} must be ${min}-${max} mm in ${step} mm steps.`)
    setup[key] = n
  }
  const d = roverDimensions(setup)
  if (setup.build === 'bolted' && setup.taper !== 0) throw new Error('The roof can only taper on the welded build. Set taper to 0 for the bolted frame.')
  if (d.sprung && d.motionRatio < 0.4) throw new Error('The sprung rear is not drawn for this wheel: the swing arm would be too steep for the shock. Choose rigid wheels or a smaller wheel.')
  if (d.seats && setup.length - setup.axle - roverHardware.seatDepth < 300) throw new Error('Not enough room ahead of the seat. Move the axle back or lengthen the cabin.')
  if (d.seats && d.sittingMax < 500) throw new Error('The cabin is too low over the seat. Raise the cabin or reduce the roof taper.')
  if (setup.rake !== 0 && setup.rake < 100) throw new Error('Front rake is either 0 for a square front or at least 100 mm.')
  if (setup.length - setup.axle - setup.rake < 200) throw new Error('Too much front rake for this axle position. The front posts must stand at least 200 mm ahead of the axle.')
  if (d.tireGap < 5) throw new Error('That hub is too short for this tire. The tire would rub the axle hanger.')
  if (setup.ramp > setup.height) throw new Error('The ramp stows upright as the tailgate, so it cannot be longer than the cabin height.')
  if (d.rampAngle > 12) throw new Error('Ramp incline is over 12 degrees. Choose a longer ramp.')
  if (d.centerAhead < 40) throw new Error('Move the axle back toward the tailgate. A centered dog must sit at least 40 mm ahead of the rear axle.')
  if (d.brakeZ + 90 > setup.handle - 13) throw new Error('Raise the handle or choose a smaller wheel. The parking brake arm sits too close under the handle arm.')
  if (setup.handle > d.handleMax) throw new Error(`Handle height must be ${d.handleMax} mm or lower for this cabin height.`)
  return setup
}
export const roverQuery = (s: RoverSetup) => new URLSearchParams(Object.fromEntries(Object.entries(s).map(([k, v]) => [k, String(v)]))).toString()
export const roverCode = (s: RoverSetup) => `rover-r0-l${s.length}-w${s.width}-h${s.height}-r${s.ramp}-a${s.axle}-g${s.handle}-hub${s.hub}-${s.wheel}-${s.front === 'swivel' ? 'swivel' + s.caster : 'fixed'}-k${s.rake}-t${s.taper}-${s.build}-${s.ride}${s.cabin === 'seats' ? '-seats' : ''}${s.kit === 'ski' ? '-ski' : ''}`

/** Base cross members: rear sill, front, and intermediates no more than 400 mm apart, kept clear of the axle hangers. */
export function crossStations(s: RoverSetup): number[] {
  const t = roverHardware.tube; const rear = -s.axle - t / 2; const front = s.length - s.axle + t / 2
  // Tee gusset bolts must stay clear of the axle hangers and of the raked front posts' base gussets.
  const clash = front - s.rake - 50
  const pivot = roverHardware.swingRun
  const nudge = (x: number) => {
    const a = Math.abs(x) < 95 ? (x < 0 ? -95 : 95) : x
    // The swing arm pivot bolt passes through the rail; keep cross member joints 45 mm clear of it.
    const b = s.ride === 'sprung' && Math.abs(a - pivot) < 45 ? (a < pivot ? pivot - 45 : pivot + 45) : a
    return s.rake > 0 && Math.abs(b - clash) < 65 ? (b < clash ? clash - 65 : clash + 65) : b
  }
  // Add intermediates until no gap is over 400 mm once they have been nudged.
  for (let count = Math.ceil((front - rear) / 400) - 1; ; count++) {
    const all = [rear, ...Array.from({ length: count }, (_, i) => nudge(rear + (i + 1) * (front - rear) / (count + 1))), front]
    if (count > 8 || all.slice(1).every((x, i) => x - all[i]! <= 400.001 && x - all[i]! > 60)) return all.map(mm)
  }
}

export function roverDimensions(s: RoverSetup) {
  const h = roverHardware; const t = h.tube; const w = roverWheels[s.wheel]; const R = w.od / 2
  const railZ = R - w.rise; const deck = railZ + t / 2 + h.bedding + h.panel; const topZ = deck + s.height + t / 2
  const rearX = -s.axle; const frontX = s.length - s.axle
  const swivel = s.front === 'swivel'
  // Swivel front: the base rails run on past the cabin and carry four short posts and two cross beams. The caster bolts under the beams.
  const casterX = frontX + t + h.casterSweep + 20; const nose = swivel ? h.casterSweep + 20 + h.casterAlong / 2 + 80 : 0
  const nosePost = s.caster - railZ - t / 2; const casterBeam = s.width + 2 * t
  const floorLen = s.length + 2 * t; const rail = floorLen + nose; const topRail = floorLen - s.rake; const post = s.height + h.panel + h.bedding
  // Raked front: the front posts and the top frame stand back by the rake, and the front wall is fabric on two stays.
  const welded = s.build === 'welded'
  // Welded build: the top rails slope down to the front by the taper and a raked pillar replaces each front post and stay.
  const frontPostX = frontX + t / 2 - s.rake; const windshield = Math.hypot(s.rake, post + t - s.taper)
  const topRailCut = Math.hypot(topRail, s.taper); const taperAtAxle = s.taper * (s.axle + t) / topRail
  const axlePost = post - taperAtAxle; const pillar = Math.hypot(s.rake, post - s.taper)
  const stations = crossStations(s); const intermediates = stations.length - 2
  const end = 8 + h.cotter / 2
  // Sprung: the axle runs through the swing arm, outboard of the rail by swingGap, with no hanger plates.
  const sprung = s.ride === 'sprung'; const seats = s.cabin === 'seats'
  const postY = s.width / 2 + t / 2; const armY = s.width / 2 + t + h.swingGap + t / 2; const axleY = sprung ? armY : postY
  const rearStack = t + (sprung ? 0 : 2 * h.plate) + w.spacer + s.hub + 2 * h.washer; const rearShaft = rearStack + 0.5 + 2 * end
  const inboard = t / 2 + (sprung ? 0 : h.plate) + h.washer + end + 0.25
  const wheelY = axleY + t / 2 + (sprung ? 0 : h.plate) + w.spacer + s.hub / 2
  // Swing arm from the pivot at (swingRun, railZ) back and up to the axle at (0, R). u runs along the arm, n is its upward normal.
  const swingLen = Math.hypot(h.swingRun, w.rise); const swingArm = swingLen + 2 * h.swingEnd
  const ux = -h.swingRun / swingLen; const uz = w.rise / swingLen; const nx = w.rise / swingLen; const nz = h.swingRun / swingLen
  const shockLowX = h.swingRun + ux * h.shockAt + nx * h.tabUp; const shockLowZ = railZ + uz * h.shockAt + nz * h.tabUp
  const shockUpZ = shockLowZ + Math.sqrt(h.shockLength ** 2 - shockLowX ** 2); const shockArmZ = shockUpZ + h.tabUp
  // Shock compression per unit of wheel travel, from the arm geometry.
  const motionRatio = ((shockLowZ - railZ) * (-shockLowX / h.shockLength) + (h.swingRun - shockLowX) * ((shockUpZ - shockLowZ) / h.shockLength)) / swingLen
  const wheelRate = h.shockRate * 0.17513 * motionRatio ** 2
  // Two-seat bench concept.
  const seatTubeZ = deck + h.seatHeight - h.panel - t / 2; const seatLeg = seatTubeZ - t / 2 - (railZ + t / 2); const seatBackZ = deck + h.seatHeight + h.seatBack
  const sittingMax = Math.floor((s.height - s.taper * (s.axle + t + h.seatDepth / 2) / topRail - h.seatHeight - 50) / 10) * 10
  const forkY = s.hub / 2 + h.washer + w.forkSpacer + h.plate + t / 2
  const frontStack = s.hub + 4 * h.washer + 4 * h.plate + 2 * t + 2 * w.forkSpacer; const frontShaft = frontStack + 0.5 + 2 * end
  const forkArm = h.forkGap + R + h.forkTail; const wheelbase = swivel ? casterX - h.casterTrail : frontX + t + h.forkGap + R
  const stub = w.posts.at(-1)! + 18 - t / 2
  const brakeZ = w.od + h.brakeDrop
  const ski = s.kit === 'ski'; const skiPost = R + h.skiAbove - h.skiThick - t; const towPinX = swivel ? frontX + t + 55 : frontX + t + 85
  const rampAngleRad = Math.asin((deck - h.panel) / s.ramp); const rampWidth = s.width - 12
  const legCut = (deck - 40 * Math.sin(rampAngleRad)) / Math.cos(rampAngleRad) - h.panel - t - h.foot
  const hingeX = rearX - t - h.hingeGap; const gripX = rearX - t - h.reach
  const handleArm = 40 + s.axle + t + h.reach; const grip = s.width + 2 * t
  const handleMax = Math.floor((deck + s.height - taperAtAxle - (welded ? 30 : 110)) / 10) * 10
  const centerAhead = s.length / 2 - s.axle
  const roofSlope = Math.hypot(s.width / 2 + t, h.ridge + h.pole)
  const cuts = [
    { id: 'C01', name: 'Base side rail', wall: 'heavy', qty: 2, length: rail },
    { id: 'C02', name: 'Base end cross member', wall: 'heavy', qty: 2, length: s.width },
    { id: 'C03', name: 'Axle post', wall: 'heavy', qty: 2, length: axlePost },
    { id: 'C04', name: 'Fork arm', wall: 'heavy', qty: swivel ? 0 : 2, length: forkArm },
    { id: 'C05', name: 'Fork stub post', wall: 'heavy', qty: swivel ? 0 : 2, length: stub },
    { id: 'C06', name: 'Ramp side curb rail', wall: 'heavy', qty: 2, length: s.ramp },
    { id: 'C07', name: 'Ramp under rib', wall: 'light', qty: 2, length: rampWidth },
    { id: 'C08', name: 'Ramp stand leg', wall: 'heavy', qty: 2, length: legCut },
    { id: 'C09', name: welded ? 'Rear corner post' : 'Corner post', wall: 'light', qty: welded ? 2 : 4, length: post },
    { id: 'C10', name: 'Top side rail', wall: 'light', qty: 2, length: topRailCut },
    { id: 'C11', name: 'Top cross tube', wall: 'light', qty: 3, length: s.width },
    { id: 'C12', name: 'Handle arm', wall: 'light', qty: 2, length: handleArm },
    { id: 'C13', name: 'Handle grip tube', wall: 'light', qty: 1, length: grip },
    { id: 'C14', name: 'Base intermediate cross member', wall: 'light', qty: intermediates, length: s.width },
    { id: 'C15', name: 'Nose post', wall: 'heavy', qty: swivel ? 4 : 0, length: nosePost },
    { id: 'C16', name: 'Caster beam', wall: 'heavy', qty: swivel ? 2 : 0, length: casterBeam },
    { id: 'C17', name: 'Brake arm', wall: 'heavy', qty: 2, length: h.brakeArm },
    { id: 'C18', name: 'Ski post', wall: 'heavy', qty: ski ? 2 : 0, length: skiPost },
    { id: 'C19', name: 'Ski foot', wall: 'heavy', qty: ski ? 2 : 0, length: h.skiFoot },
    { id: 'C20', name: 'Tow shaft', wall: 'light', qty: ski ? 2 : 0, length: h.towShaft },
    { id: 'C21', name: 'Front pillar', wall: 'light', qty: welded ? 2 : 0, length: pillar },
    { id: 'C22', name: 'Swing arm', wall: 'heavy', qty: sprung ? 2 : 0, length: swingArm },
    { id: 'C23', name: 'Shock arm', wall: 'heavy', qty: sprung ? 2 : 0, length: h.shockArm },
    { id: 'C24', name: 'Seat cross tube', wall: 'heavy', qty: seats ? 3 : 0, length: s.width },
    { id: 'C25', name: 'Seat leg', wall: 'heavy', qty: seats ? 2 : 0, length: seatLeg },
  ].filter(c => c.qty > 0).map(c => ({ ...c, length: mm(c.length) }))
  // Welded build: no gussets. Only the axle hangers and the two brake plates still bolt on.
  const roofAngle = degrees(Math.atan2(s.taper, topRail)); const pillarAngle = degrees(Math.atan2(s.rake, post - s.taper))
  const square = 'Square tee, fillet all round'; const lap = 'Lap, fillet both long edges'
  const welds = (!welded ? [] : [
    { id: 'W01', joint: 'Base cross member to base side rail', qty: 2 * stations.length, type: square },
    { id: 'W02', joint: 'Rear corner post to base side rail', qty: 2, type: square },
    { id: 'W03', joint: 'Rear corner post to top side rail', qty: 2, type: `Tee, post top cut ${roofAngle.toFixed(1)} degrees off square, fillet all round` },
    { id: 'W04', joint: 'Front pillar to base side rail', qty: 2, type: `Tee, foot cut ${pillarAngle.toFixed(1)} degrees off square so the pillar leans back, fillet all round` },
    { id: 'W05', joint: 'Front pillar to top side rail', qty: 2, type: `Pillar under the front end of the rail, top cut ${(pillarAngle + roofAngle).toFixed(1)} degrees off square, fillet all round` },
    { id: 'W06', joint: 'Axle post to base side rail', qty: 2, type: square },
    { id: 'W07', joint: 'Axle post to top side rail', qty: 2, type: `Tee, post top cut ${roofAngle.toFixed(1)} degrees off square, fillet all round` },
    { id: 'W08', joint: 'Top cross tube to top side rail', qty: 6, type: square },
    ...(swivel
      ? [{ id: 'W09', joint: 'Nose post to base side rail', qty: 4, type: square }, { id: 'W10', joint: 'Caster beam to nose post', qty: 4, type: 'Beam across the post top, fillet all round' }]
      : [{ id: 'W09', joint: 'Fork arm to front cross member', qty: 2, type: square }, { id: 'W10', joint: 'Fork stub to fork arm', qty: 2, type: square }]),
    { id: 'W11', joint: 'Brake arm to axle post', qty: 2, type: square },
    { id: 'W12', joint: 'Handle arm to rear corner post and to axle post', qty: 4, type: lap },
    { id: 'W13', joint: 'Handle grip tube to handle arm', qty: 2, type: square },
    { id: 'W14', joint: 'Ramp leg to ramp rib', qty: 2, type: square },
    ...(ski ? [{ id: 'W15', joint: 'Ski foot to ski post', qty: 2, type: square }] : []),
    ...(sprung ? [
      { id: 'W16', joint: 'Shock arm to axle post', qty: 2, type: square },
      { id: 'W17', joint: 'Shock tab to swing arm', qty: 4, type: 'Tab on edge on the top face, fillet both sides. Two tabs 25.4 apart, holes in line' },
      { id: 'W18', joint: 'Shock tab to shock arm', qty: 4, type: 'Tab on edge on the under face, fillet both sides. Two tabs 25.4 apart, holes in line' },
    ] : []),
  ])
  const weldJoints = welds.reduce((n, row) => n + row.qty, 0)
  const frameBolts = welded ? (swivel ? 10 : 20) - (sprung ? 10 : 0) + 4 : 132 + 8 * intermediates + (swivel ? 14 : 0) + (ski ? 8 : 0)
  const counts = {
    // Bolted, swivel front: twelve more corner gussets and 32 bolts for the nose, less the fork's four tees, four hangers and 18 bolts.
    // Each brake arm adds a pair of corner gussets and four bolts. The ski kit adds a pair of tee gussets and four bolts at each ski.
    corner: welded ? 0 : (swivel ? 40 : 28) + 4, tee: welded ? 0 : 2 * intermediates + (swivel ? 2 : 6) + (ski ? 4 : 0), hanger: (swivel ? 4 : 8) - (sprung ? 4 : 0), wheels: swivel ? 2 : 3, weldJoints, shocks: sprung ? 2 : 0, shockTabs: sprung ? 8 : 0,
    bolts: frameBolts, handleBolts: welded ? 0 : 4, sleeves: frameBolts + (welded ? 0 : 8), casterBolts: swivel ? 4 : 0, brakeClamps: 2,
    rampBolts: 2 * (Math.floor(s.ramp / 200) + 1) + 6, floorScrews: 2 * Math.ceil(floorLen / 250) + stations.length * 3,
    // Two of the chassis caps are the ramp leg feet.
    capHeavy: 16 + (ski ? 6 : 0), capLight: 12 + (ski ? 4 : 0), toe: Math.floor(rampWidth / 200), saddle: 3, fabricClip: 28, cableClip: 6, axleCover: swivel ? 4 : 6,
  }
  const heavyM = cuts.filter(c => c.wall === 'heavy').reduce((n, c) => n + c.qty * c.length, 0) / 1000
  const lightM = cuts.filter(c => c.wall === 'light').reduce((n, c) => n + c.qty * c.length, 0) / 1000
  const floorArea = floorLen * (s.width + 2 * t) / 1e6; const rampArea = s.ramp * rampWidth / 1e6
  // Planning arithmetic from nominal densities. Nothing has been weighed.
  const mass = {
    tube: heavyM * 0.762 + lightM * 0.408,
    plates: (counts.corner * 6900 + counts.tee * 8000 + 2 * 18000 + counts.shockTabs * 1100) * h.plate * 2.7e-6 + counts.hanger * 10950 * h.plate * 7.9e-6,
    // 15/32 inch exterior pine plywood, nominal.
    panels: (floorArea + rampArea) * 6.5,
    wheels: counts.wheels * w.kg + (swivel ? h.casterKg : 0),
    hardware: (counts.bolts + counts.handleBolts) * 0.027 + 2.2 + counts.shocks * (h.shockKg + 0.2) + (seats ? 2.5 : 0),
    softgoods: 4.2,
  }
  const carrierKg = Object.values(mass).reduce((a, b) => a + b, 0)
  // Planning load on one rear wheel: the dog's share behind the front wheel plus an assumed 60% of the empty carrier. Arithmetic only.
  const rearWheelKg = ((1 - centerAhead / wheelbase) * roverPlanningDogKg + 0.6 * carrierKg) / 2
  const sag = sprung ? rearWheelKg * 9.81 / wheelRate : 0; const sagEmpty = sprung ? 0.3 * carrierKg * 9.81 / wheelRate : 0
  const lever = (s.axle + t + h.reach) / 1000
  const tiltForceN = (roverPlanningDogKg + carrierKg) * 9.81 * (centerAhead / 1000) / lever
  return {
    R, wheel: w, tire: w.tire, spacer: w.spacer, forkSpacer: w.forkSpacer, tireGap: mm(w.spacer + s.hub / 2 - w.tire / 2), railZ: mm(railZ), deck: mm(deck), topZ: mm(topZ), clearance: mm(railZ - t / 2 - h.plate), rearX, frontX, welded, welds, roofAngle: mm(roofAngle), pillarAngle: mm(pillarAngle), topRailCut: mm(topRailCut), axlePost: mm(axlePost), pillar: mm(pillar), taperAtAxle: mm(taperAtAxle),
    rail: mm(rail), topRail: mm(topRail), floorLen: mm(floorLen), frontPostX: mm(frontPostX), windshield: mm(windshield), stay: mm(windshield + 30), post: mm(post), stations, intermediates,
    swivel, casterX: mm(casterX), nose: mm(nose), nosePost: mm(nosePost), casterBeam: mm(casterBeam),
    rearStack: mm(rearStack), rearShaft: mm(rearShaft), postY: mm(postY), inboard: mm(inboard), wheelY: mm(wheelY), cabinIntrusion: sprung ? 0 : mm(inboard - t / 2), axleY: mm(axleY),
    sprung, armY: mm(armY), swingLen: mm(swingLen), swingArm: mm(swingArm), swingDir: [ux, 0, uz] as [number, number, number], shockLow: [mm(shockLowX), mm(shockLowZ)] as [number, number], shockUpZ: mm(shockUpZ), shockArmZ: mm(shockArmZ),
    motionRatio: mm(motionRatio), wheelRate: mm(wheelRate), wheelTravel: sprung ? Math.round(h.shockStroke / motionRatio) : 0, sag: Math.round(sag), sagEmpty: Math.round(sagEmpty), rearWheelKg: Math.round(rearWheelKg * 10) / 10,
    seats, seatTubeZ: mm(seatTubeZ), seatLeg: mm(seatLeg), seatBackZ: mm(seatBackZ), sittingMax,
    ski, skiPost: mm(skiPost), towPinX: mm(towPinX), brakeZ: mm(brakeZ), forkY: mm(forkY), frontStack: mm(frontStack), frontShaft: mm(frontShaft), forkArm: mm(forkArm), stub: mm(stub), wheelbase: mm(wheelbase),
    rampAngle: mm(degrees(rampAngleRad)), rampAngleRad, rampWidth: mm(rampWidth), rampRise: mm(deck - h.panel), legCut: mm(legCut), hingeX: mm(hingeX), gripX: mm(gripX),
    handleArm: mm(handleArm), grip: mm(grip), handleMax, centerAhead: mm(centerAhead), roofSlope: mm(roofSlope),
    overallWidth: mm(2 * (axleY - inboard + rearShaft)), tireWidth: mm(2 * wheelY + w.tire), overallLength: mm((swivel ? Math.max(casterX + h.casterSweep, frontX + t + nose) : wheelbase + R) - gripX), overallHeight: mm(topZ + t / 2 + h.ridge + h.pole + 4),
    cuts, counts, heavyM: mm(heavyM), lightM: mm(lightM), tubeLb: Math.round((heavyM * 0.762 + lightM * 0.408) * 2.2046 * 10) / 10, floorArea: mm(floorArea), rampArea: mm(rampArea),
    mass: Object.fromEntries(Object.entries(mass).map(([k, v]) => [k, Math.round(v * 10) / 10])) as Record<keyof typeof mass, number>, carrierKg: Math.round(carrierKg * 10) / 10,
    frontShare: mm(centerAhead / wheelbase * 100), tiltForceN: Math.round(tiltForceN), tiltForceLbf: Math.round(tiltForceN / 4.448),
    volumeRatio: mm(s.length * s.width * s.height / (referenceCarrier.interior[0] * referenceCarrier.interior[1] * referenceCarrier.interior[2])),
  }
}
export type RoverDimensions = ReturnType<typeof roverDimensions>

/** First-fit decreasing nesting of one wall thickness into stock bars, one saw kerf per cut. Returns the pieces in each bar. */
export function nestRoverStock(s: RoverSetup, wall: 'heavy' | 'light', quantity: number, stock: number = roverTubeStock[wall].mm, kerf = 3) {
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 1000 || !(stock > 0) || !(kerf >= 0)) throw new Error('Invalid stock packing inputs.')
  const pieces = roverDimensions(s).cuts.filter(c => c.wall === wall).flatMap(c => Array.from({ length: c.qty * quantity }, () => ({ id: c.id, length: c.length }))).sort((a, b) => b.length - a.length)
  const bars: { left: number, pieces: { id: string, length: number }[] }[] = []
  for (const piece of pieces) {
    const used = piece.length + kerf
    if (used > stock) throw new Error('Cut exceeds stock length.')
    const bar = bars.find(b => b.left + 0.000001 >= used)
    if (bar) { bar.left -= used; bar.pieces.push(piece) }
    else bars.push({ left: stock - used, pieces: [piece] })
  }
  return bars.map(b => ({ pieces: b.pieces, offcut: mm(b.left) }))
}
/** Whole-stock packing totals for one wall thickness in the supplier's bar length. */
export function packRoverStock(s: RoverSetup, wall: 'heavy' | 'light', quantity: number, stock: number = roverTubeStock[wall].mm, kerf = 3) {
  const bars = nestRoverStock(s, wall, quantity, stock, kerf); const pieces = bars.flatMap(b => b.pieces)
  return { bars: bars.length, netMm: mm(pieces.reduce((a, b) => a + b.length, 0)), kerfMm: pieces.length * kerf, stockMm: mm(bars.length * stock) }
}
