import type { RoverSetup } from './Rover'
import { packRoverStock, roverDimensions, roverStart } from './Rover'
import { roverTextileCost } from './RoverSoftGoods'
import { roverConfigurations } from '../Storefront/Catalog'

export const roverPriceDate = '2026-11-12'
/** Provisional Run price from the catalog. The r0 cost study does not support it. */
export const roverRetail = roverConfigurations.find(item => item.code === 'run')!.price
export const roverPriceEvidence = [
  { name: 'Metals Depot T3118-6061, 1 x 1 x 1/8 inch 6061-T6 square tube', price: 11616, unit: 'one 24 ft bar', url: 'https://www.metalsdepot.com/aluminum-products/aluminum-square-tube', note: 'Read in a browser 2026-11-12: $116.16, in stock, about $4.84 per foot. Chassis members. No quantity break shown. A 24 ft bar ships by truck.' },
  { name: 'Metals Depot T31116, 1 x 1 x 1/16 inch 6063-T52 square tube', price: 6573, unit: 'one 21 ft bar', url: 'https://www.metalsdepot.com/aluminum-products/aluminum-square-tube', note: 'Read in a browser 2026-11-12: $65.73, in stock, about $3.13 per foot. Cabin and secondary members. 6063-T52 is softer than 6061-T6; Online Metals 6061 in .065 wall was $60.03 per 12 ft, about $5.00 per foot.' },
  { name: 'Zoro Select 1NWV4 pneumatic wheel, 4.00-8', price: 3289, unit: 'one complete wheel', url: 'https://www.zoro.com/zoro-select-pneumatic-wheel-15-316dia-435lb-400-8-1nwv4/i/G1932594/', note: 'Read in a browser 2026-11-12: $32.89. Supplier states 15 3/16 inch diameter, 3 1/8 inch width, ball bearings, 5/8 inch bore, 4 inch hub length and a 435 lb load. Weight not stated. The rating does not rate the carrier.' },
  { name: 'HAUL-MASTER 67467 pneumatic wheel, 13 x 4 inch', price: 1499, unit: 'one complete wheel', url: 'https://www.harborfreight.com/13-inch-x-4-inch-pneumatic-tire-67467.html', note: 'Read in a browser 2026-11-12: $14.99. 5/8 inch bore, 4.7 lb, supplier working load 300 lb. The page states no bearing type or hub length.' },
  { name: 'Bolt Depot 328, 1/4-20 x 2 inch grade 5 zinc hex bolt', price: 1625, unit: 'per 100; $143.00 per 1,000', url: 'https://boltdepot.com/Product-Details?product=328', note: 'Read in a browser 2026-11-12. Lock nut 2624 is $5.19 per 100 and $45.70 per 1,000. SAE washer 2976 is $3.10 per 100 and $24.80 per 1,000. The 18-8 stainless bolt 133 is $30.75 per 100.' },
  { name: 'Home Depot 15/32 inch x 4 x 8 ft ACX radiata pine sanded plywood, model 80496', price: 5200, unit: 'one sheet', url: 'https://www.homedepot.com/b/Lumber-Composites-Plywood/15-32/N-5yc1vZbqm7Z1z0mcqq', note: 'Read on a store category listing 2026-11-12: $52.00, in stock at one Los Angeles area store. Store prices vary.' },
  { name: 'Burley Bark Ranger XL at Tree Fort Bikes', price: 72995, unit: 'one complete trailer, reference only', url: 'https://www.treefortbikes.com/Burley-Bark-Ranger-XL-Pet-Bike-Trailer', note: 'Observed $729.95. A bike trailer with a stroller kit, 100 lb stated capacity. A market reference, never a Rover cost input.' },
  { name: 'Burley Bark Ranger XL Ski Bundle', price: 90091, unit: 'one bundle, reference only', url: 'https://burley.com/products/bark-ranger-xl-ski-bundle', note: 'Observed $900.91 sale price. Source of the stated 36.2 x 22.4 x 29.9 inch interior, 33 lb weight and 9 inch step-up.' },
] as const
/** Everything not observed on a fetched supplier page. Search-result prices were seen for some lines and are treated as unverified. */
export const roverAllowanceNotes = [
  'Tube freight: 21 ft and 24 ft bars ship by truck. The one-carrier scenario carries a $150 inbound freight allowance for that; a builder without a truck dock can buy shorter lengths at a higher price per foot.',
  'Crush sleeves: $0.21 each in a batch and $0.30 for one build is an allowance, the same as the XL r1 study. Bolts, nuts and washers are observed prices.',
  'Run wheels: $60 each is an allowance. No 20 inch pneumatic wheel with a 5/8 inch bore and a suitable rating was found, so the 20 inch wheel remains an open selection.',
  'Gussets, hangers, axle stock, hinge, latches, brake, leveling feet, grip, rivet nuts, ridge pole and bedding tape are allowances. Search results suggested a heavy 36 inch stainless hinge can cost far more than the allowance; none of those pages was read.',
  'Brake: two wheelchair wheel-lock sets were read in a browser, Quickie push-to-lock at $110.00 a pair and a Medline pediatric set at $31.85 a pair. Both are made for specific wheelchair frames and neither is selected.',
  'Front wheel: a 10 inch pneumatic swivel caster, Harbor Freight 63799, was read at $19.99 with a 300 lb working load and no swivel lock. A similar caster stands about 12 inches tall, above the deck, so it needs a raised front frame that this revision does not have.',
  'Stainless option: the stainless bolt is an observed $30.75 per 100. Stainless nuts and washers were not priced; the $0.23 per joint upgrade includes a $0.10 allowance for them.',
  'Mill-quantity tube: the second total prices tube by weight at $4.00 per pound plus 8% scrap. That rate is an assumption with no quote behind it. The listed-price total stays the headline until a mill or distributor quote exists.',
] as const

/** Price per stock bar in roverTubeStock lengths. The basis says whether a supplier page was read. */
export const roverTubePrices = {
  light: { cents: 6573, basis: 'Observed 2026-11-12', url: 'https://www.metalsdepot.com/aluminum-products/aluminum-square-tube' as string | undefined },
  heavy: { cents: 11616, basis: 'Observed 2026-11-12', url: 'https://www.metalsdepot.com/aluminum-products/aluminum-square-tube' as string | undefined },
}
const TUBE_LIGHT = roverTubePrices.light.cents; const TUBE_HEAVY = roverTubePrices.heavy.cents; const MILL_CENTS_PER_LB = 400; const STAINLESS_CENTS_PER_JOINT = 23
export function roverCostLines(s: RoverSetup = roverStart) {
  const d = roverDimensions(s); const c = d.counts
  const hundreds = (n: number) => Math.ceil(n / 100); const fasteners = c.bolts + c.handleBolts; const sheets = d.rail + s.ramp + 10 <= 2438.4 && s.width + 50.8 <= 1219.2 ? 1 : 2
  return [
    { id: 'gussets', name: `${c.corner} corner and ${c.tee} tee gussets, laser cut 1/8 inch 6061`, batch: (c.corner + c.tee) * 160, one: (c.corner + c.tee) * 450, coverage: ['M01', 'M02'], evidence: 'RFQ', note: 'Two repeated aluminum profiles. Includes material, cutting and deburring.' },
    { id: 'hangers', name: `${c.hanger} stainless axle hangers`, batch: c.hanger * 400, one: c.hanger * 900, coverage: ['M03'], evidence: 'RFQ', note: 'One 304 stainless profile for all three wheels. Bore finishing after drawing review.' },
    s.wheel === 'trail'
      ? { id: 'wheels', name: 'Three 15 inch pneumatic trail wheels, 4.00-8', batch: 9867, one: 9867, coverage: ['W01'], evidence: 'Observed 2026-11-12', url: 'https://www.zoro.com/zoro-select-pneumatic-wheel-15-316dia-435lb-400-8-1nwv4/i/G1932594/', note: '3 x $32.89, no bulk discount assumed. Ball bearings, 5/8 inch bore and a 4 inch hub are stated by the supplier.' }
      : s.wheel === 'path'
      ? { id: 'wheels', name: 'Three 13 x 4 inch pneumatic path wheels', batch: 4497, one: 4497, coverage: ['W01'], evidence: 'Observed 2026-11-12', url: 'https://www.harborfreight.com/13-inch-x-4-inch-pneumatic-tire-67467.html', note: '3 x $14.99, no bulk discount assumed. Hub length and bearing type are not stated by the supplier.' }
      : { id: 'wheels', name: 'Three matching 20 inch pneumatic wheels', batch: 18000, one: 18000, coverage: ['W01'], evidence: 'Allowance', note: 'No verified wheel candidate yet. See the allowance notes.' },
    { id: 'axles', name: 'Three stock-shaft axles, sleeves, spacers, washers and cotters', batch: 1800, one: 4000, coverage: ['W02', 'W03', 'W04', 'W05', 'W06'], evidence: 'RFQ', note: 'Plain 5/8 inch shaft cut and cross-drilled. No threaded journals.' },
    { id: 'fasteners', name: `${fasteners} sleeved bolted joints`, batch: Math.ceil(fasteners * (14.3 + 4.57 + 2 * 2.48)) + c.sleeves * 21, one: hundreds(fasteners) * (1625 + 519) + hundreds(2 * fasteners) * 310 + c.sleeves * 30, coverage: ['H01', 'H02', 'H03', 'H04', 'H05'], evidence: 'Observed 2026-11-12 + sleeve allowance', url: 'https://boltdepot.com/Product-Details?product=328', note: 'Zinc-plated grade 5 bolts, lock nuts and washers at Bolt Depot prices: per 1,000 for the batch, whole boxes of 100 for one build. Cut steel sleeves are an allowance.' },
    { id: 'panels', name: 'Floor and ramp panels, sealed 15/32 inch ACX plywood', batch: sheets * 5200 + 1200, one: sheets * 5200 + 2500, coverage: ['F01', 'R01'], evidence: 'Observed 2026-11-12 + sealing allowance', url: 'https://www.homedepot.com/b/Lumber-Composites-Plywood/15-32/N-5yc1vZbqm7Z1z0mcqq', note: `${sheets} sheet${sheets === 1 ? '' : 's'} at $52.00 plus edge and face sealing. Offcuts are charged.` },
    { id: 'ramp', name: 'Hinge, two latches, safety strap hardware and stand feet', batch: 4600, one: 6500, coverage: ['R02', 'R03', 'R04', 'R05', 'R06'], evidence: 'Allowance', note: 'Stainless continuous hinge, two draw latches, two leveling feet with tube inserts, carriage bolts.' },
    { id: 'controls', name: 'Brake set, grip, tip-stop feet and floor fasteners', batch: 6200, one: 8500, coverage: ['B01', 'B02', 'S01', 'F02', 'F03', 'X01'], evidence: 'Allowance', note: 'Lever, cable and two wheel brakes are unselected. The allowance is not a brake design.' },
    { id: 'prints', name: 'Printed service parts and fixtures', batch: 2300, one: 2700, coverage: ['P-cap_heavy', 'P-cap_light', 'P-ramp_toe', 'P-ridge_saddle', 'P-fabric_clip', 'P-cable_clip', 'P-axle_cover', 'P-guide_butt', 'P-guide_run', 'P-guide_tee', 'P-coupon'], evidence: 'Computed volume + allowance', note: 'About 1.3 liters of solid part volume, most of it the three ramp toes. Priced as consumed filament with a reject reserve, not a printer.' },
    { id: 'labor', name: 'Cutting, drilling, deburring and assembly labor', batch: 13750, one: 37500, coverage: [], evidence: 'RFQ', note: 'Batch: 5.5 h at $25/h. One-off: 15 h. Roughly 300 tube-wall holes per carrier. Timing assumptions, not observed.' },
    { id: 'qa', name: 'Per-carrier inspection', batch: 1200, one: 2500, coverage: [], evidence: 'RFQ', note: 'Does not replace engineering qualification.' },
    { id: 'pack', name: 'Packaging', batch: 2500, one: 3500, coverage: [], evidence: 'RFQ', note: 'Large flat-pack carton set. Outbound freight is separate.' },
    { id: 'freight', name: 'Inbound freight allocation', batch: 3000, one: 15000, coverage: [], evidence: 'RFQ', note: 'Truck freight for 21 ft and 24 ft bars and sheet goods. Unquoted.' },
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
