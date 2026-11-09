import type {SoftSetup} from './SoftGoods'
import {softStart} from './SoftGoods'
import {xlSoftFrame} from './SoftGoodsFrame'
import {completeTextileCost} from './TextilePurchases'
import { packStandardStock, standardStart } from './XLStandard'
import type { StandardSetup } from './XLStandard'
export const standardPriceDate = '2026-11-08'
export const standardRetail = 26450
export const standardPriceEvidence = [
  { name: '6061-T6 square tube 20737, 1 x .065 inch', price: 6003, unit: 'one 144 inch bar', url: 'https://www.onlinemetals.com/en/buy/aluminum/1-x-0-065-aluminum-square-tube-6061-t6-extruded/pid/20737', note: 'Observed 144 inch selection, $60.03. Full bars and saw kerf charged. No wholesale discount assumed.' },
  { name: 'HAUL-MASTER 67467 pneumatic wheel', price: 1499, unit: 'one complete wheel', url: 'https://www.harborfreight.com/13-inch-x-4-inch-pneumatic-tire-67467.html', note: 'Observed regular price. Nominal 13 x 4 inch, 5/8 bore, 4.7 lb each. Supplier 300 lb wheel rating does not rate the chair. Hub length and intended use remain unapproved.' },
  { name: 'Bolt Depot 436, 5/8-11 x 7 inch grade 5 bolt', price: 372, unit: 'one bolt, REJECTED axle substitution', url: 'https://boltdepot.com/Product-Details?product=436', note: 'Observed $3.72 each, $66.49/25. Not selected: listing gives minimum thread length, not guaranteed smooth bearing-journal length. Never run a wheel bearing on threads.' },
  { name: 'Bolt Depot 13684, 1 inch steel spacer', price: 277, unit: 'one spacer, cost comparison only', url: 'https://boltdepot.com/Spacers_Chrome_plated_steel_1_4', note: 'Observed $2.77 each/$232 per 100 for 1/4 ID, 1/2 OD. Not our 3/8 OD sleeve. Rejected as a cost/geometry substitution. r1 uses cut standard tube; its price is unquoted.' },
  { name: 'Integy T7038PURPLE.1 RC shock', price: 1999, unit: 'listed set, REJECTED suspension', url: 'https://www.integy.com/st_prod.html?p_catid=59&p_prodid=4354', note: 'Observed $19.99 and out-of-stock. RC product, no established Buddy load/tune/interface suitability. Not in the r1 BOM and not a purchasable chair suspension option.' },
] as const
const textileFrame=xlSoftFrame(standardStart,'r1')
const textileDefault=softStart(textileFrame)
export const standardCostLines = [
  { id: 'wheels', name: 'Two complete pneumatic wheels', batch: 2998, one: 2998, coverage: ['W01'], evidence: 'observed', note: '2 x $14.99, no bulk discount assumed.' },
  { id: 'plates', name: '12 steel profiles, cutting, deburring and corrosion finish', batch: 1400, one: 4000, coverage: ['M04', 'M05'], evidence: 'RFQ', note: 'Eight identical T gussets plus four axle patches, only two profile types. Includes material and steel finish. No cosmetic tube coating.' },
  { id: 'axles', name: 'Two stock-shaft axles, washers and cotters', batch: 1000, one: 2000, coverage: ['W02', 'W05', 'W06'], evidence: 'RFQ', note: 'Unkeyed precision C1018 5/8 stock cut and cross-drilled. No approved supplier SKU/fit yet. No custom turned heads or threaded bearing journals.' },
  { id: 'sleeves', name: 'Cut standard steel sleeve/spacer stock', batch: 500, one: 1500, coverage: ['H02', 'W03', 'W04'], evidence: 'RFQ', note: '20 small crush sleeves, two axle sleeves and two wheel spacers, all 25.4 mm cut lengths. Price and finish tolerance require quote.' },
  { id: 'bolts', name: '20 grade-5 bolts, 40 washers and 20 locknuts', batch: 900, one: 2000, coverage: ['H01', 'H03', 'H04'], evidence: 'RFQ', note: 'Standard 1/4-20 hardware. Quantity 100 manufacturing allowance, not a scraped supplier quote.' },
  { id: 'supports', name: 'Padded rear support, front restraint and webbing loops', batch: completeTextileCost(textileFrame,textileDefault,100).total, one: completeTextileCost(textileFrame,textileDefault,1).total, coverage: ['T01'], evidence: 'Listed materials + assumed labor/freight', note: 'Itemized shell, mesh, 5 mm foam, all straps/wraps, six adjusters, front buckle, binding, thread and closures. Includes 10% material reject reserve, 75 min at $30/h batch or 180 min one-off, and incremental textile freight. No supplier-approved completed harness quote or load/fit qualification.' },
  { id: 'prints', name: 'Nonstructural prints, rejects and power', batch: 300, one: 400, coverage: ['P-end_cap', 'P-axle_cover', 'P-drill_guide', 'P-coupon'], evidence: 'RFQ', note: 'Allocated consumed material, not a full spool or printer purchase. Slicer grams/hours are unmeasured. Fixture allowance allocated, not charged as a new tool per chair.' },
  { id: 'labor', name: 'Cutting, drilling, cleanup and assembly labor', batch: 2000, one: 6000, coverage: [], evidence: 'RFQ', note: 'Batch: 48 min at $25/h; one-off: 2.4 h at $25/h. Timing assumptions, not observed cycle times. Includes stock sleeve/shaft finishing operations.' },
  { id: 'qa', name: 'Per-chair inspection', batch: 400, one: 800, coverage: [], evidence: 'RFQ', note: 'Recurring check allowance; does not replace engineering qualification or ongoing quality program.' },
  { id: 'pack', name: 'Packaging', batch: 500, one: 600, coverage: [], evidence: 'RFQ', note: 'Box, protection and instructions. Outbound freight separate.' },
  { id: 'freight', name: 'Inbound freight allocation', batch: 600, one: 2000, coverage: [], evidence: 'RFQ', note: 'Unquoted pooled freight; long stock shipping can exceed this. Actual supplier checkout required.' },
  { id: 'machine', name: 'Machine wear, shop consumables and tooling allocation', batch: 200, one: 300, coverage: [], evidence: 'RFQ', note: 'Recurring allocation. Printer/tools/jigs and one-time development capital are budgeted separately.' },
] as const
export function standardEconomics(setup: StandardSetup = standardStart, quantity = 100, goods?:SoftSetup) {
  if (quantity !== 1 && quantity !== 100) throw new Error('Cost scenarios are one chair or a 100-chair batch.')
  const packing = packStandardStock(setup, quantity)
  const stockPurchase = packing.bars * 6003
  const frame = Math.ceil(stockPurchase / quantity)
  const textileFrame=xlSoftFrame(setup,'r1')
  const textiles=completeTextileCost(textileFrame,goods??softStart(textileFrame),quantity)
  const other = standardCostLines.filter(row=>row.id!=='supports').reduce((total, row) => total + row[quantity === 1 ? 'one' : 'batch'], 0)
  const cogs = frame + other + textiles.total
  const fee = Math.round(standardRetail * 0.029) + 30
  const warranty = Math.round(standardRetail * 0.05)
  const support = 1000; const acquisition = 2500
  const gross = standardRetail - cogs
  const contribution = gross - fee - warranty - support - acquisition
  const maxCogs = Math.floor(standardRetail * 0.7)
  return { textiles, quantity, packing, stockPurchase, frame, cogs, retail: standardRetail, fee, warranty, support, acquisition, gross, grossPercent: gross / standardRetail * 100, maxCogs, headroom: maxCogs - cogs, meetsCostGate: cogs <= maxCogs, contribution, freeShippingContribution: contribution - 2400, status: 'UNQUOTED_MANUFACTURING_SCENARIO_NOT_VERIFIED_COST' }
}

export function pricedStandardLines(setup:StandardSetup=standardStart,goods?:SoftSetup){const f=xlSoftFrame(setup,'r1'),s=goods??softStart(f);return standardCostLines.map(line=>line.id==='supports'?{...line,batch:completeTextileCost(f,s,100).total,one:completeTextileCost(f,s,1).total}:line)}
