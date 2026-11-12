import type { Layer, P2, Region, Triangle } from './Solid'
import type { RoverPartId } from './Rover'
import { binaryStl, circle, profileDxf, rect, roundCorners, roundedRect, stack, turn } from './Solid'
import { roverHardware as h, roverWheels } from './Rover'

/** Bolt clearance in plates, pilot size in guides, and the axle sleeve bore. */
const BOLT = 6.75; const PILOT = 3.3; const BORE = 19.25
export type RoverMetalId = 'tee_gusset' | 'corner_gusset' | 'axle_hanger' | 'axle_hanger_low'

/** Flat fabrication profiles. The datum (0, 0) is the joint centerline intersection. */
export function metalProfile(id: RoverMetalId): Region {
  if (id === 'tee_gusset') return { outer: roundCorners([[-50, 20], [50, 20], [50, -20], [20, -20], [20, -75], [-20, -75], [-20, -20], [-50, -20]], 2), holes: [circle(BOLT, -30, 0), circle(BOLT, 30, 0), circle(BOLT, 0, -35), circle(BOLT, 0, -60)] }
  if (id === 'corner_gusset') return { outer: roundCorners([[-20, -20], [95, -20], [95, 20], [20, 20], [20, 95], [-20, 95]], 2), holes: [circle(BOLT, 50, 0), circle(BOLT, 80, 0), circle(BOLT, 0, 35), circle(BOLT, 0, 65)] }
  // Bar along the rail, stem up the post. The stem ends 18 mm above the top post bolt.
  const wheel = id === 'axle_hanger' ? roverWheels.run : roverWheels.path; const top = wheel.posts.at(-1)! + 23
  return { outer: roundCorners([[-50, -20], [50, -20], [50, 20], [22, 20], [22, top], [-22, top], [-22, 20], [-50, 20]], 3), holes: [circle(BOLT, -30, 0), circle(BOLT, 30, 0), ...wheel.posts.map(y => circle(BOLT, 0, y)), circle(BORE, 0, wheel.rise)] }
}

function cap(wall: number): Layer[] {
  const plug = h.tube - 2 * wall - 0.5
  return [{ height: 3, regions: [{ outer: roundedRect(h.tube + 4, h.tube + 4, 2) }] }, { height: 12, regions: [{ outer: roundedRect(plug, plug, 1), holes: [rect(plug - 4, plug - 4)] }] }]
}
/** C section that snaps over a 25.4 mm square tube plus one cover hem. Opening faces -Y. */
function clipSection(back: number): P2[] {
  const inner = h.tube + 1.8; const wall = 2.6; const half = inner / 2; const mouth = 10.5
  return roundCorners([[-half - wall, -half - wall], [-mouth, -half - wall], [-mouth, -half], [-half, -half], [-half, half], [half, half], [half, -half], [mouth, -half], [mouth, -half - wall], [half + wall, -half - wall], [half + wall, half + back], [-half - wall, half + back]], 0.8, 3)
}
function guide(length: number, holes: number[], stop: boolean): Layer[] {
  const plate: P2[] = stop ? rect(length + 3, 28.4, (length - 3) / 2, -1.5) : roundCorners([[-48, -15.7], [48, -15.7], [48, 12.7], [3, 12.7], [0, 9.2], [-3, 12.7], [-48, 12.7]], 1)
  const fence: P2[] = stop ? [[-2.6, -15.3], [length - 0.4, -15.3], [length - 0.4, -12.75], [0, -12.75], [0, 12.3], [-2.6, 12.3]] : rect(95.2, 2.55, 0, -14.025)
  return [{ height: 4, regions: [{ outer: plate, holes: holes.map(x => circle(PILOT, x, 0, 24)) }] }, { height: 10, regions: [{ outer: fence }] }]
}

/** Every exported solid in its print orientation, Z up from the bed. */
export function roverPartMesh(id: RoverPartId): Triangle[] {
  switch (id) {
    case 'cap_heavy': return stack(cap(h.heavy))
    case 'cap_light': return stack(cap(h.light))
    case 'ramp_toe': {
      // Side profile: a slot grips the 12 mm panel edge, the top lip sits flush with the 5 mm traction mat.
      const slot = h.panel + 0.3; const lip = 2.4; const top = lip + slot + h.mat
      return turn.layFlat(stack([{ height: 200, regions: [{ outer: [[-18, 0], [110, 0], [110, 1.2], [0, top], [-18, top], [-18, lip + slot], [0, lip + slot], [0, lip], [-18, lip]] }] }]))
    }
    case 'ridge_saddle': return stack([
      // The two jaws and the two prongs differ slightly in length so no outline vertices line up across the gap.
      { height: 26, regions: [{ outer: rect(3.5, 24, -14.65, 0) }, { outer: rect(3.5, 23, 14.65, 0) }] },
      { height: 4, regions: [{ outer: roundedRect(34, 26, 2) }] },
      { height: h.ridge - 4, regions: [{ outer: roundedRect(22, 20, 2) }] },
      { height: 11, regions: [{ outer: rect(3, 18, -8.1, 0) }, { outer: rect(3, 17, 8.1, 0) }] },
    ])
    case 'fabric_clip': return stack([{ height: 30, regions: [{ outer: clipSection(2.6) }] }])
    case 'cable_clip': return stack([{ height: 12, regions: [{ outer: clipSection(9.5), holes: [circle(5.6, 0, (h.tube + 1.8) / 2 + 4.6, 24)] }] }])
    case 'axle_cover': return stack([{ height: 8, regions: [{ outer: circle(40), holes: [circle(28)] }] }, { height: 4, regions: [{ outer: circle(34) }] }])
    case 'guide_butt': return stack(guide(82, [22.3, 37.3, 52.3, 67.3], true))
    case 'guide_run': return stack(guide(107, [47.7, 62.7, 77.7, 92.7], true))
    case 'guide_tee': return stack(guide(96, [-30, 30], false))
    case 'coupon': return stack([{ height: 6, regions: [{ outer: roundedRect(130, 36, 3), holes: [...[6.45, 6.6, 6.75, 6.9].map((d, i) => circle(d, -50 + i * 18, 0, 32)), circle(12.9, 26, 0), circle(13.2, 48, 0)] }] }])
    default: return stack([{ height: h.plate, regions: [metalProfile(id)] }])
  }
}
export const roverPartStl = (id: RoverPartId) => binaryStl(roverPartMesh(id), `Buddy Rover r0 ${id}. BENCH ONLY, mm. Not for animal use.`)
export const roverMetalDxf = (id: RoverMetalId) => profileDxf([metalProfile(id)])
