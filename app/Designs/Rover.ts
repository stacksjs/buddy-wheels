/**
 * Buddy Rover r0: a large low-entry carrier bench design. No load rating, fit approval or animal-use release exists.
 * X forward, Y across, Z up. Origin is on the ground under the rear axle, on the centerline. Millimeters.
 */
export type RoverWheel = 'trail' | 'path' | 'run'
export type RoverFront = 'swivel' | 'fixed'
/** ski adds the snow conversion: the wheels and the front wheel come off, skis go on the rear axles and two tow shafts pin to the front. */
export type RoverKit = 'wheels' | 'ski'
/**
 * The same carrier made two ways. welded goes to a fabrication shop: the cabin sides, the handle and the nose hoops are each bent from one tube,
 * and the frame arrives welded in one piece. bolted is built at home with a saw and a drill: every tube is straight and every joint is a flat plate,
 * cut by a mail-order laser service, bolted through steel sleeves.
 */
export type RoverBuild = 'welded' | 'bolted'
/** sprung hangs each rear wheel on a trailing swing arm with a coil-over shock. rigid bolts the axle to the frame on hangers. */
export type RoverRide = 'sprung' | 'rigid'
/** seats adds a removable two-seat bench ahead of the axle. A layout concept only. It is not a child restraint and has no certification. */
export type RoverCabin = 'dog' | 'seats'
/** caster is the mounting height of the front swivel caster, floor to the top of its plate. It is ignored with a fixed front wheel. */
/** rake is how far the top of the front wall leans back from the bottom. taper is how far the roof drops from rear to front. Zero for both gives a square box. */
export interface RoverSetup { length: number, width: number, height: number, ramp: number, axle: number, handle: number, hub: number, caster: number, rake: number, taper: number, wheel: RoverWheel, front: RoverFront, kit: RoverKit, build: RoverBuild, ride: RoverRide, cabin: RoverCabin }
export const roverStart: RoverSetup = { length: 1300, width: 700, height: 1000, ramp: 1000, axle: 560, handle: 1000, hub: 101.6, caster: 310, rake: 350, taper: 180, wheel: 'trail', front: 'swivel', kit: 'wheels', build: 'welded', ride: 'sprung', cabin: 'dog' }
export const roverBuilds = { welded: 'Bent and welded frame, made by a fabrication shop and delivered in one piece', bolted: 'Bolted frame, built at home with a saw and a drill' } as const
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
/**
 * One carrier is built from the same full-length bars, each cut in half by the supplier so it can be carried home.
 * A half is half the bar less the supplier's saw cut. Halves are what the cut list is nested into.
 */
export const roverHalfStock = { heavy: { mm: 3656, label: '12 ft' }, light: { mm: 3198.5, label: '10 ft 6 in' } } as const
/** Full bars to buy for one carrier, and the halves the pieces are cut from. */
export function homeRoverStock(s: RoverSetup, wall: 'heavy' | 'light') {
  const halves = nestRoverStock(s, wall, 1, roverHalfStock[wall].mm); const pieces = halves.flatMap(b => b.pieces); const bars = Math.ceil(halves.length / 2)
  return { bars, halves, netMm: mm(pieces.reduce((a, b) => a + b.length, 0)), kerfMm: pieces.length * 3, stockMm: mm(bars * roverTubeStock[wall].mm) }
}
/** Parcel bars, the dearer alternative for a single build: 8 ft is the longest length the priced supplier ships without a truck. */
export const roverParcelStock = { mm: 2438.4, label: '8 ft' } as const
export const roverLimits = { length: [1000, 1400], width: [600, 800], height: [800, 1100], ramp: [700, 1100], axle: [300, 650], handle: [700, 1100], hub: [50, 110], caster: [250, 340], rake: [0, 500], taper: [0, 300] } as const
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
  // shockAt is the lower shock eye along the arm from the pivot. tabUp is that eye above the arm centerline. Both mounts bolt on:
  // a pair of plates on the arm, and a pair hung from the axle post around a short spacer tube, bolt holes hangerUp and hangerUp + plateStep above the upper eye.
  // shockLength and shockStroke are a seller's stated figures for the priced candidate. shockRate is that seller's nominal spring label, not a measured rate.
  swingRun: 300, swingGap: 13, swingEnd: 25, shockAt: 240, tabUp: 30.7, shockSpacer: 60, hangerUp: 30, plateStep: 30, shockLength: 150, shockStroke: 30, shockRate: 450, shockRadius: 22, shockKg: 0.45,
  // Two-seat bench concept: seat top above the deck, seat depth ahead of the axle posts, back bar above the seat.
  seatHeight: 200, seatDepth: 260, seatBack: 400,
  // Bent tubes of the welded build: one centerline radius for every bend. 4.5 inch is the tightest radius found with a published clean result
  // for 1 inch square aluminum tube with a 1/8 inch wall. Tighter is reported as risky in 6061-T6. The shop may ask for another.
  bendRadius: 114.3,
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
  { id: 'shock_plate', name: 'Shock plate, swing arm', kind: 'metal', note: '1/8 inch 6061-T6 aluminum. A pair bolts to the two side faces of each swing arm and holds the lower shock eye above it. STL is an unloaded fit-check copy.' },
  { id: 'shock_hanger', name: 'Shock hanger, axle post', kind: 'metal', note: '1/8 inch 6061-T6 aluminum. A pair bolts to the axle post around a short spacer tube and holds the upper shock eye below it. STL is an unloaded fit-check copy.' },
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

export type BendRun = { straight: number } | { angle: number }
/**
 * A tube bent along a flat polyline with one centerline radius at every inner corner. Returns its developed length, the straight and bend
 * runs in order as a shop reads them, and where each bend starts and ends, for drawing.
 */
export function bendPath(points: [number, number][], radius: number) {
  const runs: BendRun[] = []; const arcs: { from: [number, number], to: [number, number], angle: number }[] = []; let developed = 0; let before = 0
  for (let i = 0; i + 1 < points.length; i++) {
    const a = points[i]!; const b = points[i + 1]!; const length = Math.hypot(b[0] - a[0], b[1] - a[1]); const d1 = [(b[0] - a[0]) / length, (b[1] - a[1]) / length]
    let after = 0; let angle = 0
    if (i + 2 < points.length) {
      const c = points[i + 2]!; const next = Math.hypot(c[0] - b[0], c[1] - b[1]); const d2 = [(c[0] - b[0]) / next, (c[1] - b[1]) / next]
      angle = Math.acos(Math.max(-1, Math.min(1, d1[0]! * d2[0]! + d1[1]! * d2[1]!))); after = radius * Math.tan(angle / 2)
      arcs.push({ from: [b[0] - d1[0]! * after, b[1] - d1[1]! * after], to: [b[0] + d2[0]! * after, b[1] + d2[1]! * after], angle })
    }
    const straight = length - before - after; runs.push({ straight: mm(straight) }); developed += straight
    if (angle > 0) { runs.push({ angle: mm(degrees(angle)) }); developed += radius * angle }
    before = after
  }
  return { points, radius, developed: mm(developed), runs, arcs, shortest: Math.min(...runs.flatMap(run => 'straight' in run ? [run.straight] : [])) }
}

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
  // The sprung rear is not drawn for the 20 inch wheel, so that wheel falls back to rigid unless stated.
  const ride = input.ride ?? (setup.wheel === 'run' ? 'rigid' : roverStart.ride)
  if (typeof ride !== 'string' || !Object.hasOwn(roverRides, ride)) throw new Error('Choose the sprung or the rigid rear wheels.')
  setup.ride = ride as RoverRide
  const cabin = input.cabin ?? roverStart.cabin
  if (typeof cabin !== 'string' || !Object.hasOwn(roverCabins, cabin)) throw new Error('Choose the open dog cabin or the two-seat concept.')
  setup.cabin = cabin as RoverCabin
  for (const key of (Object.keys(setup) as (keyof RoverSetup)[]).filter((k): k is Exclude<keyof RoverSetup, 'wheel' | 'front' | 'kit' | 'build' | 'ride' | 'cabin'> => !['wheel', 'front', 'kit', 'build', 'ride', 'cabin'].includes(k))) {
    const value = input[key] ?? setup[key]
    if ((typeof value !== 'number' && (typeof value !== 'string' || !/^\d+(?:\.\d+)?$/.test(value))) || !Number.isFinite(Number(value))) throw new Error(`Enter a positive number for ${key}.`)
    const n = Number(value); const [min, max] = roverLimits[key]; const step = key === 'hub' ? 0.05 : key === 'caster' ? 1 : 10
    if (n < min || n > max || Math.abs(n / step - Math.round(n / step)) > 0.000001) throw new Error(`${key} must be ${min}-${max} mm in ${step} mm steps.`)
    setup[key] = n
  }
  // An unstated handle height comes down to what this frame allows: the bolted roof gussets sit lower on the axle post than a weld does.
  if (input.handle === undefined) setup.handle = Math.min(setup.handle, roverDimensions(setup).handleMax)
  const d = roverDimensions(setup)
  if (d.bent.some(part => part.path.shortest < 15)) throw new Error('A bent tube has no straight left between its bends at this size. Raise the caster height or lengthen the cabin.')
  if (d.sprung && d.motionRatio < 0.4) throw new Error('The sprung rear is not drawn for this wheel: the swing arm would be too steep for the shock. Choose rigid wheels or a smaller wheel.')
  if (d.seats && setup.length - setup.axle - roverHardware.seatDepth < 300) throw new Error('Not enough room ahead of the seat. Move the axle back or lengthen the cabin.')
  if (d.seats && d.sittingMax < 500) throw new Error('The cabin is too low over the seat. Raise the cabin or reduce the roof taper.')
  if (setup.rake !== 0 && setup.rake < 100) throw new Error('Front rake is either 0 for a square front or at least 100 mm.')
  if (setup.length - setup.axle - setup.rake < 200) throw new Error('Too much front rake for this axle position. The front posts must stand at least 200 mm ahead of the axle.')
  if (d.tireGap < 5) throw new Error('That hub is too short for this tire. The tire would rub the axle hanger.')
  if (setup.ramp > setup.height) throw new Error('The ramp stows upright as the tailgate, so it cannot be longer than the cabin height.')
  if (d.rampAngle > 12) throw new Error('Ramp incline is over 12 degrees. Choose a longer ramp.')
  if (d.centerAhead < 40) throw new Error('Move the axle back toward the tailgate. A centered dog must sit at least 40 mm ahead of the rear axle.')
  if (d.brakeZ + 90 > d.armZ - 13) throw new Error('Raise the handle or choose a smaller wheel. The parking brake arm sits too close under the handle arm.')
  if (setup.handle > d.handleMax) throw new Error(`Handle height must be ${d.handleMax} mm or lower for this cabin height and roof taper.${setup.build === 'bolted' ? ' The bolted roof plates sit below the roof on the axle post. A taller cabin, less taper or the welded frame allows a higher handle.' : ''}`)
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
  // Joint datums for the pillar: where its centerline crosses the base rail centerline and the sloped top rail centerline.
  const pdx = -s.rake / pillar; const pdz = (post - s.taper) / pillar; const roofK = s.taper / topRail
  const pillarFootBack = t / 2 / pdz; const pillarFootX = frontX + t / 2 - pdx * pillarFootBack
  const pillarTopBack = t / 2 * (1 + roofK) / (pdz + roofK * pdx); const pillarTopX = frontPostX + pdx * pillarTopBack
  const pillarTopZ = railZ + t / 2 + post - s.taper + pdz * pillarTopBack
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
  const shockUpZ = shockLowZ + Math.sqrt(h.shockLength ** 2 - shockLowX ** 2); const shockSpacerZ = shockUpZ + h.hangerUp - (h.shockSpacer - h.plateStep) / 2
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
  // The grip tube lies across the tops of the two arm ends, one bolt down through each crossing, so the joint needs no plates.
  // Handle height is the grip. The arms run one tube lower.
  const handleArm = 40 + s.axle + t + h.reach; const grip = s.width + 4 * t
  // Welded: the handle is one bent bar in a single plane. Bolted: the arms run one tube below the grip.
  const armZ = welded ? s.handle : s.handle - t
  const handleMax = Math.floor((deck + s.height - taperAtAxle - (welded ? 30 : 110 - t)) / 10) * 10
  // Bent tubes of the welded build. Each replaces two or three straight tubes and the joints between them.
  const bendR = h.bendRadius
  const hoopPoints: [number, number][] = [[rearX - t / 2, railZ + t / 2], [rearX - t / 2, topZ - s.taper * (t / 2) / topRail], [pillarTopX, pillarTopZ], [frontX + t / 2, railZ + t / 2]]
  const barY = s.width / 2 + t + t / 2; const noseBeamZ = s.caster + t / 2
  const sideHoop = bendPath(hoopPoints, bendR)
  const handleBar = bendPath([[gripX + handleArm, barY], [gripX + t / 2, barY], [gripX + t / 2, -barY], [gripX + handleArm, -barY]], bendR)
  const noseHoop = bendPath([[s.width / 2 + t / 2, railZ + t / 2], [s.width / 2 + t / 2, noseBeamZ], [-s.width / 2 - t / 2, noseBeamZ], [-s.width / 2 - t / 2, railZ + t / 2]], bendR)
  const bent = !welded ? [] : [
    { id: 'C26', name: 'Side hoop', wall: 'light' as const, qty: 2, path: sideHoop, shape: 'Rear post, roof run and front pillar in one. Both bends turn the same way' },
    { id: 'C27', name: 'Handle bar', wall: 'light' as const, qty: 1, path: handleBar, shape: 'A flat U: two arms and the grip between them' },
    ...(swivel ? [{ id: 'C28', name: 'Nose hoop', wall: 'heavy' as const, qty: 2, path: noseHoop, shape: 'An upside-down U across the carrier that carries the caster' }] : []),
  ]
  // Top cross tubes: on the bent hoop they move in from the corners to the straight roof run.
  const topCross = welded ? [mm(sideHoop.arcs[0]!.to[0] + t), 0, mm(sideHoop.arcs[1]!.from[0] - t)] : [rearX - t / 2, 0, frontPostX]
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
    { id: 'C09', name: 'Rear corner post', wall: 'light', qty: welded ? 0 : 2, length: post },
    { id: 'C10', name: 'Top side rail', wall: 'light', qty: welded ? 0 : 2, length: topRailCut },
    { id: 'C11', name: 'Top cross tube', wall: 'light', qty: 3, length: s.width },
    { id: 'C12', name: 'Handle arm', wall: 'light', qty: welded ? 0 : 2, length: handleArm },
    { id: 'C13', name: 'Handle grip tube', wall: 'light', qty: welded ? 0 : 1, length: grip },
    { id: 'C14', name: 'Base intermediate cross member', wall: 'light', qty: intermediates, length: s.width },
    { id: 'C15', name: 'Nose post', wall: 'heavy', qty: swivel && !welded ? 4 : 0, length: nosePost },
    { id: 'C16', name: 'Caster beam', wall: 'heavy', qty: swivel && !welded ? 2 : 0, length: casterBeam },
    { id: 'C17', name: 'Brake arm', wall: 'heavy', qty: 2, length: h.brakeArm },
    { id: 'C18', name: 'Ski post', wall: 'heavy', qty: ski ? 2 : 0, length: skiPost },
    { id: 'C19', name: 'Ski foot', wall: 'heavy', qty: ski ? 2 : 0, length: h.skiFoot },
    { id: 'C20', name: 'Tow shaft', wall: 'light', qty: ski ? 2 : 0, length: h.towShaft },
    { id: 'C21', name: 'Front pillar', wall: 'light', qty: welded ? 0 : 2, length: pillar },
    // Bent tubes: the length is the developed length, the straight tube before bending.
    ...bent.map(part => ({ id: part.id, name: part.name, wall: part.wall as string, qty: part.qty, length: part.path.developed })),
    { id: 'C22', name: 'Swing arm', wall: 'heavy', qty: sprung ? 2 : 0, length: swingArm },
    { id: 'C23', name: 'Shock spacer tube', wall: 'heavy', qty: sprung ? 2 : 0, length: h.shockSpacer },
    { id: 'C24', name: 'Seat cross tube', wall: 'heavy', qty: seats ? 3 : 0, length: s.width },
    { id: 'C25', name: 'Seat leg', wall: 'heavy', qty: seats ? 2 : 0, length: seatLeg },
  ].filter(c => c.qty > 0).map(c => ({ ...c, length: mm(c.length) }))
  // Welded build: no gussets. Only the axle hangers and the two brake plates still bolt on.
  const roofAngle = degrees(Math.atan2(s.taper, topRail)); const pillarAngle = degrees(Math.atan2(s.rake, post - s.taper))
  const square = 'Square tee, fillet all round'; const lap = 'Lap, fillet both long edges'
  const welds = (!welded ? [] : [
    { id: 'W01', joint: 'Base cross member to base side rail', qty: 2 * stations.length, type: square },
    { id: 'W02', joint: 'Side hoop rear foot to base side rail', qty: 2, type: square },
    { id: 'W04', joint: 'Side hoop front foot to base side rail', qty: 2, type: `Tee, foot cut ${pillarAngle.toFixed(1)} degrees off square so the pillar leans back, fillet all round` },
    { id: 'W06', joint: 'Axle post to base side rail', qty: 2, type: square },
    { id: 'W07', joint: 'Axle post to the roof run of the side hoop', qty: 2, type: `Tee, post top cut ${roofAngle.toFixed(1)} degrees off square, fillet all round` },
    { id: 'W08', joint: 'Top cross tube to the roof run of the side hoop', qty: 6, type: square },
    ...(swivel
      ? [{ id: 'W09', joint: 'Nose hoop foot to base side rail', qty: 4, type: square }]
      : [{ id: 'W09', joint: 'Fork arm to front cross member', qty: 2, type: square }, { id: 'W10', joint: 'Fork stub to fork arm', qty: 2, type: square }]),
    { id: 'W11', joint: 'Brake arm to axle post', qty: 2, type: square },
    { id: 'W12', joint: 'Handle bar to rear post and to axle post', qty: 4, type: lap },
    { id: 'W14', joint: 'Ramp leg to ramp rib', qty: 2, type: square },
    ...(ski ? [{ id: 'W15', joint: 'Ski foot to ski post', qty: 2, type: square }] : []),
  ])
  const weldJoints = welds.reduce((n, row) => n + row.qty, 0)
  // Bolted build: three joints are not square, so their plates are cut to the angle of this setup. Angles are between the two legs.
  // The pillar joints sit a few millimeters off the corner stations, so their rail holes are shifted back onto the 35 and 65 pattern measured from the tube end. That keeps them 15 mm from the crossing bolts of the gusset on the next face.
  const footShift = pillarFootX - (frontX + t / 2); const topShift = t / 2 - (rearX - t + topRail - pillarTopX) / Math.cos(Math.atan2(s.taper, topRail))
  const angles = welded ? [] : [
    { id: 'roof', file: 'roof-gusset', name: 'Roof gusset', angle: mm(90 - roofAngle), shift: 0, qty: 6, where: 'Rear post tops on the outside face, axle post tops on both faces' },
    { id: 'foot', file: 'pillar-foot-gusset', name: 'Pillar foot gusset', angle: mm(90 - pillarAngle), shift: mm(footShift), qty: 2, where: 'Pillar foot to base rail, outside face' },
    { id: 'top', file: 'pillar-top-gusset', name: 'Pillar top gusset', angle: mm(90 + pillarAngle + roofAngle), shift: mm(topShift), qty: 2, where: 'Pillar top to top rail, outside face' },
  ]
  const angled = angles.reduce((n, row) => n + row.qty, 0)
  // Bolts through one axle post for a pair of hangers: two in the bar and one for each stem hole.
  const hangerBolts = 2 + w.posts.length
  // Sprung: the rear hangers go, and each swing arm gains two bolts for its pair of shock plates.
  // Bolted and sprung: a pair of tee gussets takes the place of each pair of rear hangers at the axle post foot, on the same number of bolts.
  const frameBolts = (welded ? (swivel ? 0 : 2) * hangerBolts + (sprung ? 0 : 2 * hangerBolts) + 4 : 124 + 8 * intermediates + (swivel ? 14 : 0) + (ski ? 8 : 0)) + (sprung ? 4 : 0)
  const counts = {
    // The handle needs no gussets: six lap bolts, two tubes each. Bolted, swivel front: twelve more corner gussets and 32 bolts for the nose, less the fork's four tees, four hangers and 18 bolts.
    // Each brake arm adds a pair of corner gussets and four bolts. The ski kit adds a pair of tee gussets and four bolts at each ski.
    corner: welded ? 0 : (swivel ? 36 : 24) + 4 - angled, angle: angled, tee: welded ? 0 : 2 * intermediates + (swivel ? 2 : 6) + (ski ? 4 : 0) + (sprung ? 4 : 0), hanger: (swivel ? 4 : 8) - (sprung ? 4 : 0), wheels: swivel ? 2 : 3, weldJoints,
    bends: bent.reduce((n, part) => n + part.qty * part.path.arcs.length, 0), shocks: sprung ? 2 : 0, shockPlates: sprung ? 4 : 0, shockHangers: sprung ? 4 : 0, shockBolts: sprung ? 4 : 0,
    bolts: frameBolts, handleBolts: welded ? 0 : 6, sleeves: frameBolts + (welded ? 0 : 12) + (sprung ? 8 : 0), casterBolts: swivel ? 4 : 0, brakeClamps: 2,
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
    plates: ((counts.corner + counts.angle) * 6900 + counts.tee * 8000 + 2 * 18000 + (counts.shockPlates + counts.shockHangers) * 4200) * h.plate * 2.7e-6 + counts.hanger * 10950 * h.plate * 7.9e-6,
    // 15/32 inch exterior pine plywood, nominal.
    panels: (floorArea + rampArea) * 6.5,
    wheels: counts.wheels * w.kg + (swivel ? h.casterKg : 0),
    hardware: (counts.bolts + counts.handleBolts + counts.shockBolts) * 0.027 + 2.2 + counts.shocks * (h.shockKg + 0.2) + (seats ? 2.5 : 0),
    softgoods: 4.2,
  }
  const carrierKg = Object.values(mass).reduce((a, b) => a + b, 0)
  // Planning load on one rear wheel: the dog's share behind the front wheel plus an assumed 60% of the empty carrier. Arithmetic only.
  const rearWheelKg = ((1 - centerAhead / wheelbase) * roverPlanningDogKg + 0.6 * carrierKg) / 2
  const sag = sprung ? rearWheelKg * 9.81 / wheelRate : 0; const sagEmpty = sprung ? 0.3 * carrierKg * 9.81 / wheelRate : 0
  const lever = (s.axle + t + h.reach) / 1000
  const tiltForceN = (roverPlanningDogKg + carrierKg) * 9.81 * (centerAhead / 1000) / lever
  return {
    R, wheel: w, tire: w.tire, spacer: w.spacer, forkSpacer: w.forkSpacer, tireGap: mm(w.spacer + s.hub / 2 - w.tire / 2), railZ: mm(railZ), deck: mm(deck), topZ: mm(topZ), clearance: mm(railZ - t / 2 - h.plate), rearX, frontX, welded, welds, angles, pillarDir: [pdx, 0, pdz] as [number, number, number], pillarFoot: [mm(pillarFootX), mm(railZ)] as [number, number], pillarTop: [mm(pillarTopX), mm(pillarTopZ)] as [number, number], pillarFootBack: mm(pillarFootBack), pillarTopBack: mm(pillarTopBack), roofAngle: mm(roofAngle), pillarAngle: mm(pillarAngle), topRailCut: mm(topRailCut), axlePost: mm(axlePost), pillar: mm(pillar), taperAtAxle: mm(taperAtAxle),
    rail: mm(rail), topRail: mm(topRail), floorLen: mm(floorLen), frontPostX: mm(frontPostX), windshield: mm(windshield), stay: mm(windshield + 30), post: mm(post), stations, intermediates,
    swivel, casterX: mm(casterX), nose: mm(nose), nosePost: mm(nosePost), casterBeam: mm(casterBeam),
    rearStack: mm(rearStack), rearShaft: mm(rearShaft), postY: mm(postY), inboard: mm(inboard), wheelY: mm(wheelY), cabinIntrusion: sprung ? 0 : mm(inboard - t / 2), axleY: mm(axleY),
    sprung, armY: mm(armY), swingLen: mm(swingLen), swingArm: mm(swingArm), swingDir: [ux, 0, uz] as [number, number, number], shockLow: [mm(shockLowX), mm(shockLowZ)] as [number, number], shockUpZ: mm(shockUpZ), shockSpacerZ: mm(shockSpacerZ),
    motionRatio: mm(motionRatio), wheelRate: mm(wheelRate), wheelTravel: sprung ? Math.round(h.shockStroke / motionRatio) : 0, sag: Math.round(sag), sagEmpty: Math.round(sagEmpty), rearWheelKg: Math.round(rearWheelKg * 10) / 10,
    seats, seatTubeZ: mm(seatTubeZ), seatLeg: mm(seatLeg), seatBackZ: mm(seatBackZ), sittingMax,
    ski, skiPost: mm(skiPost), towPinX: mm(towPinX), brakeZ: mm(brakeZ), forkY: mm(forkY), frontStack: mm(frontStack), frontShaft: mm(frontShaft), forkArm: mm(forkArm), stub: mm(stub), wheelbase: mm(wheelbase),
    rampAngle: mm(degrees(rampAngleRad)), rampAngleRad, rampWidth: mm(rampWidth), rampRise: mm(deck - h.panel), legCut: mm(legCut), hingeX: mm(hingeX), gripX: mm(gripX),
    handleArm: mm(handleArm), grip: mm(grip), armZ: mm(armZ), bent, topCross, noseBeamZ: mm(noseBeamZ), barY: mm(barY), handleMax, centerAhead: mm(centerAhead), roofSlope: mm(roofSlope),
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
