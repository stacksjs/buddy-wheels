import type { RoverSetup } from './Rover'
import { packRoverStock, roverDimensions, roverStart } from './Rover'
import { roverTextileCost } from './RoverSoftGoods'
import { roverConfigurations } from '../Storefront/Catalog'

export const roverPriceDate = '2026-11-11'
/** Provisional Run price from the catalog. The r0 cost study does not support it. */
export const roverRetail = roverConfigurations.find(item => item.code === 'run')!.price
export const roverPriceEvidence = [
  { name: '6061-T6 square tube 20737, 1 x .065 inch', price: 6003, unit: 'one 144 inch bar', url: 'https://www.onlinemetals.com/en/buy/aluminum/1-x-0-065-aluminum-square-tube-6061-t6-extruded/pid/20737', note: 'Observed 2026-11-08 at $60.03. The page blocked a recheck on 2026-11-11. Cabin tubes only.' },
  { name: 'Burley Bark Ranger XL at Tree Fort Bikes', price: 72995, unit: 'one complete trailer, reference only', url: 'https://www.treefortbikes.com/Burley-Bark-Ranger-XL-Pet-Bike-Trailer', note: 'Observed $729.95. A bike trailer with a stroller kit, 100 lb stated capacity. A market reference, never a Rover cost input.' },
  { name: 'Burley Bark Ranger XL Ski Bundle', price: 90091, unit: 'one bundle, reference only', url: 'https://burley.com/products/bark-ranger-xl-ski-bundle', note: 'Observed $900.91 sale price. Source of the stated 36.2 x 22.4 x 29.9 inch interior, 33 lb weight and 9 inch step-up.' },
] as const
/** Everything not observed on a fetched supplier page. Search-result prices were seen for some lines and are treated as unverified. */
export const roverAllowanceNotes = [
  'Chassis tube, 1 x 1 x .125 inch 6061-T6: $100 per 144 inch bar is an allowance scaled from the observed .065 wall bar by metal mass. No fetched price.',
  'Wheels: $60 each is an allowance. Search results showed 20 inch spoked cart wheels at $54.95 to $62.99 with 3/4 inch bores and an 88 lb tire rating. No 5/8 inch bore 20 inch pneumatic wheel with a suitable rating was found, so the wheel is an open selection, not a candidate.',
  'Plywood: $45 per 4 x 8 ft sheet of 15/32 inch BC sanded exterior pine is an allowance from an unverified search result near $40.35. Marine plywood results ran $125 to $278 and are the Coast upgrade.',
  'Hardware: $0.66 per sleeved joint in a batch covers a zinc-plated grade 5 bolt, locknut, two washers and a cut steel sleeve, the same allowance the XL r1 study uses. 18-8 stainless for salt use adds about $0.33 per joint from unverified search results.',
  'Mill-quantity tube: the second total prices tube by weight at $4.00 per pound plus 8% scrap. That rate is an assumption with no quote behind it. The listed-price total stays the headline until a mill or distributor quote exists.',
  'Hinge, latches, brake set, leveling feet, grip, rivet nuts, ridge pole and bedding tape are allowances with no supplier page behind them.',
] as const

const TUBE_LIGHT = 6003; const TUBE_HEAVY = 10000; const MILL_CENTS_PER_LB = 400; const STAINLESS_CENTS_PER_JOINT = 33
export function roverCostLines(s: RoverSetup = roverStart) {
  const d = roverDimensions(s); const c = d.counts
  const fasteners = c.bolts + c.handleBolts; const sheets = d.rail + s.ramp + 10 <= 2438.4 && s.width + 50.8 <= 1219.2 ? 1 : 2
  return [
    { id: 'gussets', name: `${c.corner} corner and ${c.tee} tee gussets, laser cut 1/8 inch 6061`, batch: (c.corner + c.tee) * 160, one: (c.corner + c.tee) * 450, coverage: ['M01', 'M02'], evidence: 'RFQ', note: 'Two repeated aluminum profiles. Includes material, cutting and deburring.' },
    { id: 'hangers', name: `${c.hanger} stainless axle hangers`, batch: c.hanger * 400, one: c.hanger * 900, coverage: ['M03'], evidence: 'RFQ', note: 'One 304 stainless profile for all three wheels. Bore finishing after drawing review.' },
    { id: 'wheels', name: 'Three matching 20 inch pneumatic wheels', batch: 18000, one: 18000, coverage: ['W01'], evidence: 'Allowance', note: 'No verified wheel candidate yet. See the allowance notes.' },
    { id: 'axles', name: 'Three stock-shaft axles, sleeves, spacers, washers and cotters', batch: 1800, one: 4000, coverage: ['W02', 'W03', 'W04', 'W05', 'W06'], evidence: 'RFQ', note: 'Plain 5/8 inch shaft cut and cross-drilled. No threaded journals.' },
    { id: 'fasteners', name: `${fasteners} sleeved bolted joints`, batch: fasteners * 66, one: fasteners * 90, coverage: ['H01', 'H02', 'H03', 'H04', 'H05'], evidence: 'Allowance', note: 'Zinc-plated grade 5 for the Run configuration. It follows directly from a bolted frame with no welding.' },
    { id: 'panels', name: 'Floor and ramp panels, sealed 15/32 inch exterior plywood', batch: sheets * 4500 + 1200, one: sheets * 4500 + 2500, coverage: ['F01', 'R01'], evidence: 'Allowance', note: `${sheets} sheet${sheets === 1 ? '' : 's'} per carrier plus edge sealing. Offcuts are charged.` },
    { id: 'ramp', name: 'Hinge, two latches, safety strap hardware and stand feet', batch: 4600, one: 6500, coverage: ['R02', 'R03', 'R04', 'R05', 'R06'], evidence: 'Allowance', note: 'Stainless continuous hinge, two draw latches, two leveling feet with tube inserts, carriage bolts.' },
    { id: 'controls', name: 'Brake set, grip, tip-stop feet and floor fasteners', batch: 6200, one: 8500, coverage: ['B01', 'B02', 'S01', 'F02', 'F03', 'X01'], evidence: 'Allowance', note: 'Lever, cable and two wheel brakes are unselected. The allowance is not a brake design.' },
    { id: 'prints', name: 'Printed service parts and fixtures', batch: 2300, one: 2700, coverage: ['P-cap_heavy', 'P-cap_light', 'P-ramp_toe', 'P-ridge_saddle', 'P-fabric_clip', 'P-cable_clip', 'P-axle_cover', 'P-guide_butt', 'P-guide_run', 'P-guide_tee', 'P-coupon'], evidence: 'Computed volume + allowance', note: 'About 1.3 liters of solid part volume, most of it the three ramp toes. Priced as consumed filament with a reject reserve, not a printer.' },
    { id: 'labor', name: 'Cutting, drilling, deburring and assembly labor', batch: 13750, one: 37500, coverage: [], evidence: 'RFQ', note: 'Batch: 5.5 h at $25/h. One-off: 15 h. Roughly 300 tube-wall holes per carrier. Timing assumptions, not observed.' },
    { id: 'qa', name: 'Per-carrier inspection', batch: 1200, one: 2500, coverage: [], evidence: 'RFQ', note: 'Does not replace engineering qualification.' },
    { id: 'pack', name: 'Packaging', batch: 2500, one: 3500, coverage: [], evidence: 'RFQ', note: 'Large flat-pack carton set. Outbound freight is separate.' },
    { id: 'freight', name: 'Inbound freight allocation', batch: 3000, one: 9000, coverage: [], evidence: 'RFQ', note: 'Long stock and sheet goods. Unquoted.' },
    { id: 'machine', name: 'Machine wear and shop consumables', batch: 600, one: 1000, coverage: [], evidence: 'RFQ', note: 'Drill bits, blades, jig wear.' },
  ]
}
export function roverEconomics(s: RoverSetup = roverStart, quantity = 100) {
  if (quantity !== 1 && quantity !== 100) throw new Error('Cost scenarios are one carrier or a 100-carrier batch.')
  const light = packRoverStock(s, 'light', quantity); const heavy = packRoverStock(s, 'heavy', quantity)
  const tube = Math.ceil((light.bars * TUBE_LIGHT + heavy.bars * TUBE_HEAVY) / quantity)
  const textiles = roverTextileCost(s, quantity)
  const other = roverCostLines(s).reduce((total, row) => total + row[quantity === 1 ? 'one' : 'batch'], 0)
  const cogs = tube + other + textiles.total
  // Same design with tube bought by weight. An assumption until quoted, so it never replaces the listed-price total.
  const tubeMill = Math.ceil(roverDimensions(s).tubeLb * 1.08 * MILL_CENTS_PER_LB); const cogsMill = cogs - tube + tubeMill
  const stainlessUpgrade = (roverDimensions(s).counts.bolts + roverDimensions(s).counts.handleBolts) * STAINLESS_CENTS_PER_JOINT
  const fee = Math.round(roverRetail * 0.029) + 30; const reserve = Math.round(roverRetail * 0.05); const support = 1500; const acquisition = 3500
  const gross = roverRetail - cogs; const maxCogs = Math.floor(roverRetail * 0.7)
  return { quantity, light, heavy, tube, textiles, other, cogs, retail: roverRetail, gross, grossPercent: gross / roverRetail * 100, maxCogs, headroom: maxCogs - cogs, meetsCostGate: cogs <= maxCogs, fee, reserve, support, acquisition, contribution: gross - fee - reserve - support - acquisition, retailForGate: Math.ceil(cogs / 0.7 / 100) * 100, tubeMill, cogsMill, retailForGateMill: Math.ceil(cogsMill / 0.7 / 100) * 100, stainlessUpgrade, status: 'UNQUOTED_BENCH_COST_STUDY_NOT_A_PRICE' }
}
export const roverCostModel = (s: RoverSetup = roverStart) => ({ checked: roverPriceDate, setup: s, base: roverEconomics(s, 100), one: roverEconomics(s, 1), lines: roverCostLines(s), evidence: roverPriceEvidence, allowances: roverAllowanceNotes })
