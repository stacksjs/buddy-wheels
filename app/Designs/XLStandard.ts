/** XL r1 is a cost-reduced rigid bench design. No animal-use/load rating exists. */
export interface StandardSetup { height: number, width: number, rail: number, hub: number }
export const standardStart: StandardSetup = { height: 620, width: 400, rail: 680, hub: 82.55 }
export const standardLimits = { height: [500, 760], width: [320, 520], rail: [540, 820], hub: [60, 100] } as const
export const standardHardware = { tube: 25.4, wall: 1.651, plate: 3.175, wheel: 330.2, tire: 101.6, axle: 15.875, sleeve: 9.525, sleeveWall: 1.2446, axleSleeve: 19.05, axleSleeveWall: 1.4732, spacer: 25.4, washer: 1.5, cotter: 3.2 } as const
export const standardParts = [
  { id: 'end_cap', name: 'Rounded tube cap', qty: 6, kind: 'print', note: 'Optional end protection. No structural retention.' },
  { id: 'axle_cover', name: 'Axle end sample cover', qty: 2, kind: 'print', note: 'Empty-rig cover only. Never a shaft retainer or complete fur guard.' },
  { id: 'drill_guide', name: 'Tube layout guide', qty: 1, kind: 'fixture', note: 'Bench layout aid. Finish holes require proper metal tooling.' },
  { id: 'coupon', name: 'Clearance coupon', qty: 1, kind: 'fixture', note: 'Calibrate the actual printer. Not part of the chair.' },
  { id: 'joint_plate', name: 'Repeated T gusset', qty: 8, kind: 'metal', note: '1/8 inch A36 steel. STL is an unloaded fit-check copy.' },
  { id: 'axle_plate', name: 'Axle reinforcement patch', qty: 4, kind: 'metal', note: '1/8 inch A36 steel. STL is an unloaded fit-check copy.' },
] as const
export function standardPartFile(id: string): string {
  const part = standardParts.find(p => p.id === id)
  if (!part) throw new Error('Unknown r1 part.')
  return `${part.kind === 'metal' ? 'FIT_CHECK_ONLY_' : ''}${id}.stl`
}
export function parseStandardSetup(input: Record<string, unknown>): StandardSetup {
  for (const key of Object.keys(input)) if (!Object.hasOwn(standardStart, key)) throw new Error(`Unknown r1 setup field: ${key}`)
  const setup = { ...standardStart }
  for (const key of Object.keys(setup) as (keyof StandardSetup)[]) {
    const value = input[key] ?? setup[key]
    if ((typeof value !== 'number' && (typeof value !== 'string' || !/^\d+(?:\.\d+)?$/.test(value))) || !Number.isFinite(Number(value))) throw new Error(`Enter a positive number for ${key}.`)
    const n = Number(value); const [min, max] = standardLimits[key]
    const step = key === 'hub' ? 0.05 : 5
    if (n < min || n > max || Math.abs(n / step - Math.round(n / step)) > 0.000001) throw new Error(`${key} must be ${min}-${max} mm in ${step} mm steps.`)
    setup[key] = n
  }
  return setup
}
export const standardQuery = (s: StandardSetup) => new URLSearchParams(Object.fromEntries(Object.entries(s).map(([k, v]) => [k, String(v)]))).toString()
export const standardCode = (s: StandardSetup) => `xl-r1-h${s.height}-w${s.width}-l${s.rail}-hub${s.hub}`
export const mm = (n: number) => Math.round(n * 10000) / 10000
export function standardDimensions(s: StandardSetup) {
  const h = standardHardware
  const post = mm(s.height - h.tube / 2 - h.wheel / 2 + 45)
  const bridge = mm(s.width - h.tube)
  const stack = mm(h.tube + 2 * h.plate + h.spacer + s.hub + 2 * h.washer)
  const shaft = mm(stack + 0.5 + 2 * (8 + h.cotter / 2))
  const offset = mm(h.tube / 2 + h.plate + h.spacer + s.hub / 2)
  const axleStart = mm(-(h.tube / 2 + h.plate + h.washer + 8 + h.cotter / 2 + 0.25))
  return { post, bridge, shaft, stack, offset, axleStart, innerAxleClearance: mm(s.width + 2 * axleStart), tireWidth: mm(s.width + 2 * offset + h.tire), tireClearance: mm(offset - h.tire / 2 - h.tube / 2 - h.plate), tubeTotal: mm(s.rail * 2 + post * 2 + bridge) }
}
export function standardCuts(s: StandardSetup) {
  const d = standardDimensions(s)
  return [{ id: 'M01', name: 'Side rail', qty: 2, length: s.rail }, { id: 'M02', name: 'Upright', qty: 2, length: d.post }, { id: 'M03', name: 'Rear bridge', qty: 1, length: d.bridge }]
}
/** Actual whole-stock packing, including one saw kerf per cut. No fractional-stock discount. */
export function packStandardStock(s: StandardSetup, quantity: number, stock = 3657.6, kerf = 3) {
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 1000 || !Number.isFinite(stock) || !Number.isFinite(kerf) || stock <= 0 || kerf < 0) throw new Error('Invalid stock packing inputs.')
  const pieces = standardCuts(s).flatMap(c => Array.from({ length: c.qty * quantity }, () => c.length)).sort((a, b) => b - a)
  const remaining: number[] = []
  for (const length of pieces) {
    const used = length + kerf
    if (used > stock) throw new Error('Cut exceeds stock length.')
    const index = remaining.findIndex(left => left + 0.000001 >= used)
    if (index < 0) remaining.push(stock - used)
    else remaining[index] = remaining[index]! - used
  }
  return { bars: remaining.length, remaining: remaining.map(mm), netMm: mm(pieces.reduce((a, b) => a + b, 0)), kerfMm: pieces.length * kerf, stockMm: mm(remaining.length * stock) }
}
const csv = (rows: (string | number)[][]) => rows.map(row => row.map(v => `"${String(v).replaceAll('"', '""')}"`).join(',')).join('\n') + '\n'
export function standardBom(s: StandardSetup): string {
  const d = standardDimensions(s)
  return csv([
    ['ID', 'Quantity', 'Part', 'Specification', 'Status'],
    ...standardCuts(s).map(c => [c.id, c.qty, c.name, `6061-T6 1 x 1 x .065 inch tube; cut ${c.length} mm`, 'Cut to fit, not telescoping']),
    ['M04', 8, 'Repeated T gusset', 'A36 steel 3.175 mm, joint_plate.dxf', 'Cut/drill one repeated profile; finish and corrosion process pending'],
    ['M05', 4, 'Axle patch', 'A36 steel 3.175 mm, axle_plate.dxf', 'Finish bearing holes after drawing review'],
    ['W01', 2, 'Pneumatic wheel candidate', 'HAUL-MASTER 67467; 330.2 OD, 101.6 width, 15.875 bore mm', `Supplier hub length not verified; configuration assumes ${s.hub} mm. Supplier wheel rating is not a chair rating`],
    ['W02', 2, 'Plain round steel axle stock', `15.875 diameter; cut ${d.shaft} mm; two 3.2 cross-holes`, 'Unkeyed C1018 precision shaft, finish fits/material/retention still need review. No thread as bearing journal'],
    ['W03', 2, 'Upright axle sleeve', '4130 tube 19.05 OD x 1.4732 wall; cut 25.4 mm', 'Steel, not a printed load path'],
    ['W04', 2, 'Outboard wheel spacer', '4130 tube 19.05 OD x 1.4732 wall; cut 25.4 mm', 'Check actual hub/bearing face contact'],
    ['W05', 4, 'Axle thrust washer', '5/8 inch bore; nominal 1.5 mm thick', 'Bearing contact/stack must be verified'],
    ['W06', 4, 'Split cotter', '3.2 mm shaft cross-hole', 'Positive end retention, not a friction cap; verify pin end ligaments'],
    ['H01', 20, 'Joint bolt', '1/4-20 x 2 inch SAE J429 grade 5 zinc steel', '16 frame plus 4 axle-patch bolts; actual engagement and torque procedure pending'],
    ['H02', 20, 'Crush sleeve', '4130 .375 OD x .049 wall inch stock; cut 25.4 mm', 'Cut stock, not machined shoulders; verify flush end faces and length tolerance'],
    ['H03', 40, 'Bolt washer', '1/4 inch steel flat washer', 'Two per bolt'],
    ['H04', 20, 'Prevailing-torque nut', '1/4-20 steel locknut', 'New retained fasteners, procedure pending'],
    ['T01', 1, 'Rear support and front restraint set', 'Padded textile support with continuous webbing loops around metal rails', 'OEM RFQ only; no approved pattern, rating, size, sewing schedule or anchors. Requires engineering and professional fitting'],
    ...standardParts.filter(p => p.kind !== 'metal').map(p => [`P-${p.id}`, p.qty, p.name, standardPartFile(p.id), p.note]),
  ])
}
export function standardDrilling(s: StandardSetup): string {
  const d = standardDimensions(s)
  return csv([
    ['Tube', 'Quantity', 'Axis', 'Centers from cut end mm', 'Nominal hole mm', 'Notes'],
    ['Side rail', 2, 'Y', `${s.rail - 230} / ${s.rail - 170}`, 9.725, 'T gusset x=-30/+30 at upright datum X=0'],
    ['Side rail', 2, 'Z', `${s.rail - 110} / ${s.rail - 50}`, 9.725, 'Rear T gusset X=120, rail holes X=90/150; separated from upright gussets'],
    ['Upright', 2, 'Y', `${d.post - 22.3} / ${d.post - 47.3}`, 9.725, 'T gusset lower holes at Z=height-35/-60'],
    ['Upright', 2, 'Y', '20 / 70', 9.725, 'Axle patch retention at axle datum +/-25; axle datum 45 from bottom'],
    ['Upright', 2, 'Y', '45', 19.25, 'Axle sleeve, nominal bore. Supplier finish-fit tolerance still pending'],
    ['Rear bridge', 1, 'Z', `22.3 / 47.3 / ${d.bridge - 47.3} / ${d.bridge - 22.3}`, 9.725, 'Gusset holes on each side; mirror about bridge center'],
    ['Axle', 2, 'radial', `8 / ${mm(d.shaft - 8)}`, 3.2, `Do not drill until measured ${s.hub} mm hub, washer thickness and 0.5 mm end float verified`],
  ])
}
export function standardParameters(s: StandardSetup): string {
  return '// GENERATED XL r1 RIGID BENCH DESIGN. NOT FOR ANIMAL USE.\n' + Object.entries({ ...s, ...standardHardware }).map(([k, v]) => `${k}=${v};`).join('\n') + '\ninclude <source/standard.scad>\n'
}
