import type { SpringSetup } from './XLSpring'
import { packSpringCuts, springCuts, springDimensions, springStart } from './XLSpring'
import { standardCostLines, standardPriceEvidence } from './XLStandardCost'
import { money as unsignedMoney } from '../Storefront/Catalog'
export const springMoney = (n: number) => (n < 0 ? '-' : '') + unsignedMoney(Math.abs(n))
const money = springMoney
export const springEvidence = [
  {name:'Wurth ISO4762 M5 head dimensions',price:0,unit:'specification reference, price RFQ',url:'https://eshop.wuerth.de/Hexagon-Socket-Head-Cap-Screw-full-thread-ISO-4762-DIN-912-steel-88-plain-with-full-thread-SCR-CYL-ISO4762-88-HS4-M5X50-50/008295%2050.sku/en/US/EUR/',note:'M5 socket head diameter 8.5 mm, height 5 mm. The linked 50 mm listing verifies the head family only; our 70 mm length and actual thread engagement require supplier confirmation.'},
  {name:'DIN433 M5 reduced-OD washer',price:0,unit:'specification reference, price RFQ',url:'https://www.dbroberts.com/din433-a2-m5.html',note:'M5 reduced washer 9 mm OD and 5.3 mm ID, unlike the rejected oversized guide washer. Confirm 1 mm thickness and selected steel finish with supplier. In-spring head/washer/guide max OD 9.525 mm versus catalog minimum spring ID 10.1 mm, before working deflection and misalignment.'},
  ...standardPriceEvidence.slice(0,2),
  {name:'MISUMI SWH20-75',price:544,unit:'one spring, quantities 1-19',url:'https://us.misumi-ec.com/vona2/detail/110100185850/?HissuCode=SWH20-75',note:'Observed $5.44 each; $4.62 each at 200+. Two springs per chair: $10.88 one-off or $9.24 at 100 chairs. Batch stock/checkout/freight unconfirmed. Not a chair rating.'},
  {name:'Wicks SQ1-1/4X065-T6 housing tube',price:420,unit:'one foot',url:'https://www.wicksaircraft.com/shop/6061-t6-aluminum-square-tubing/',note:'Observed 1.25 inch square-corner 6061-T6, .065 wall, $4.20/ft. Model buys full 6-foot lengths at $25.20 each; confirm orderable stock lengths, cut tolerance and shipping. No quantity discount assumed.'},
  {name:'MISUMI SWH manufacturer table',price:0,unit:'specification reference, not a price',url:'https://in.misumi-ec.com/pdf/press/09_pr1081.pdf',note:'SWH20-75 rate 65.3 N/mm; nominal 20 mm OD/10 mm ID, 75 mm free length; table solid height 54 mm. Load tolerance +/-10%, length +/-1%. Conservative catalog deflection 14.4 mm; this is not system fatigue qualification.'},
  {name:'Power Plastics .050 inch UHMW PSA wear tape',price:0,unit:'specification reference, price RFQ',url:'https://powerplasticscorp.com/products/uhmw-pe-tape/',note:'PSA050 family confirms .050 inch material exists. No exact-width price verified. Liner allowance is unquoted; actual adhesive thickness and corner fit must be measured.'},
] as const
const overrides: Record<string, {batch:number,one:number,note:string}> = {
  plates:{batch:1800,one:5500,note:'20 steel pieces: eight T gussets, four axle patches, four rectangular rail shims, four spring seats. Four profile types. $4 batch increment over r1; laser/drill/finish RFQ required.'},
  sleeves:{batch:600,one:1800,note:'16x25.4 and 4x31.75 small sleeves, two 55 mm guide tubes, two axle sleeves and two wheel spacers. Cut lengths and finish included; RFQ.'},
  bolts:{batch:950,one:2200,note:'12 short and 8 long grade 5 joint bolts plus 40 washers/20 nuts. $0.50 batch increment; RFQ.'},
  labor:{batch:2500,one:8500,note:'60 min at $25/h batch;3.4 h one-off. Includes slots, liner trimming, seats/pins and cartridge assembly. These times are assumptions, not a time study.'},
  qa:{batch:600,one:1200,note:'Additional force/travel/friction/retention inspection allowance. Does not fund qualification tests. RFQ.'},
  freight:{batch:700,one:2500,note:'Two tube SKUs plus springs and hardware. Long-stock checkout freight unverified; RFQ.'},
} as const
export const springCostLines = [
  {id:'guards',name:'Two cartridge bellows and axle/pinch guard set',batch:400,one:1500,coverage:['S10'],evidence:'RFQ',note:'Complete guard material/fastener allowance only. No qualified pattern, supplier, pinch envelope or tested attachment exists. Must replace with a quoted validated design before release.'},
  ...standardCostLines.map(line=>({...line,...overrides[line.id],coverage:line.id==='plates'?[...line.coverage,'S03','S09']:line.id==='sleeves'?[...line.coverage,'H02L','S06']:line.id==='bolts'?[...line.coverage,'H01L']:line.coverage})),
  {id:'springs',name:'Two MISUMI SWH20-75 springs',batch:924,one:1088,coverage:['S02'],evidence:'observed',note:'Two at $4.62 for 200 springs, or $5.44 for 2. Actual selected online tier, not an invented discount.'},
  {id:'retention',name:'Four smooth clevis pins with washers/cotters',batch:500,one:1200,coverage:['S04'],evidence:'RFQ',note:'$1.25 per complete pin set batch allowance. Supplier SKU, clear grip and retention drawing not yet verified.'},
  {id:'guidance',name:'16 liner pads and two M5 guide fastener sets',batch:400,one:1200,coverage:['S05','S07'],evidence:'RFQ',note:'Consumed .050 inch UHMW tape, 16 pads, two M5 x 70 ISO4762 screws, DIN433 upper washers, lower washers and locknuts. No full roll charged per unit; no verified price or wear test.'},
] as const
export function springEconomics(setup: SpringSetup = springStart, quantity=100, retail=29900) {
  if (![1,100].includes(quantity) || ![26500,29900].includes(retail)) throw new Error('Use one/100 chairs and $265/$299 retail.')
  const packing=packSpringCuts(springCuts(setup),quantity,3657.6)
  const housings=packSpringCuts([{qty:2,length:springDimensions(setup).housingLength}],quantity,1828.8)
  const frame=Math.ceil(packing.bars*6003/quantity);const housing=Math.ceil(housings.bars*2520/quantity)
  const shimCost=setup.preload*2*(quantity===100?25:100)
  const cogs=frame+housing+shimCost+springCostLines.reduce((t,l)=>t+l[quantity===100?'batch':'one'],0)
  const gross=retail-cogs; const fee=Math.round(retail*.029)+30;const warranty=Math.round(retail*.05);const support=1000;const acquisition=2500
  const contribution=gross-fee-warranty-support-acquisition;const maxCogs=Math.floor(retail*.7)
  return {quantity,retail,packing,housings,frame,housing,shimCost,cogs,gross,grossPercent:gross/retail*100,fee,warranty,support,acquisition,contribution,freeShippingContribution:contribution-2400,maxCogs,headroom:maxCogs-cogs,meetsCostGate:cogs<=maxCogs,status:'UNQUOTED_MANUFACTURING_SCENARIO_NOT_VERIFIED_COST'}
}
export function springCostModel(s: SpringSetup=springStart) {return {checked:'2026-11-08',setup:s,retails:[26500,29900].map(p=>springEconomics(s,100,p)),one:springEconomics(s,1),lines:springCostLines,evidence:springEvidence}}
export function springCostCsv(s: SpringSetup=springStart) {
  const one=springEconomics(s,1);const batch=springEconomics(s)
  return [['Line','One-chair USD','100-chair allocation USD','Evidence'],['1 inch whole tube stock',one.frame/100,batch.frame/100,'Observed price + computed nesting'],['1.25 inch whole housing stock',one.housing/100,batch.housing/100,'Observed per-foot price;6 ft purchasing length assumption'],['Preload shims S08',one.shimCost/100,batch.shimCost/100,'RFQ'],...springCostLines.map(l=>[l.name,l.one/100,l.batch/100,l.evidence]),['LANDED COGS',one.cogs/100,batch.cogs/100,'Mostly unquoted']].map(row=>row.map(v=>`"${String(v).replaceAll('"','""')}"`).join(',')).join('\n')+'\n'
}
export function springCostMarkdown(s: SpringSetup=springStart) {
  const a=springEconomics(s,100,26500);const b=springEconomics(s);const one=springEconomics(s,1)
  return `# Buddy XL r2: lower-cost adjustable spring cartridge

Checked November 8, 2026. USD, integer-cent native Bun model. This is a costed bench candidate, not a production quote, retail release or animal-use rating. Anatomy, actual hub length and spring suitability remain unverified. Other sizes remain r0; XL r1 rigid files remain unchanged.

## Decision

Replace the r0 $220 shock-pair allowance with **two standard MISUMI SWH20-75 die springs**, listed at $5.44 each or $4.62 each for 200+. A 100-chair batch buys 200 springs for $924, **$9.24 per chair**, before included pooled inbound freight. A single pair is $10.88 before freight/tax. The springs alone cost 95.8% less than the old unquoted $220 allowance; this is not a 95.8% installed-system saving. No cheap RC shocks or threaded wheel journals are substituted.

The new mechanism has independent 8 mm nominal vertical travel, steel end stops, four-sided replaceable UHMW guidance and 0/1/2 mm matched steel preload shims. **Preload is adjustable; spring stiffness and damping are not.** Fixed rate 65.3 N/mm, no hydraulic damper. Changing rate would require a separately verified spring. No riding/terrain/rehab suitability is established.

## Complete cost and price scenarios

Configuration: height ${s.height}, width ${s.width}, rail ${s.rail}, provisional hub ${s.hub}, preload ${s.preload}, manual preview travel ${s.travel}, all mm. Preview travel changes pose, not manufacturing cost. Includes one spring pair, not spare alternative rates.

| Metric | $265 retail | $299 retail |
| --- | ---: | ---: |
| Landed manufacturing, 100-chair batch | ${money(a.cogs)} | ${money(b.cogs)} |
| Product gross profit | ${money(a.gross)} | ${money(b.gross)} |
| Gross margin | ${a.grossPercent.toFixed(1)}% | ${b.grossPercent.toFixed(1)}% |
| Maximum COGS at 30% gross gate | ${money(a.maxCogs)} | ${money(b.maxCogs)} |
| Headroom / shortfall | ${money(a.headroom)} | ${money(b.headroom)} |
| Payment fee, 2.9%+$0.30 | ${money(a.fee)} | ${money(b.fee)} |
| Warranty/return reserve, 5% | ${money(a.warranty)} | ${money(b.warranty)} |
| Support + acquisition | $35.00 | $35.00 |
| Contribution before fixed overhead | ${money(a.contribution)} | ${money(b.contribution)} |
| Contribution with $24 free delivery subsidy | ${money(a.freeShippingContribution)} | ${money(b.freeShippingContribution)} |

At$299 the numerical 30% gate ${b.meetsCostGate?'passes':'FAILS'}; at $265 it ${a.meetsCostGate?'passes':'FAILS'}. Do not lower the gate to make the design appear viable. ${b.meetsCostGate?'$299 is the conditional price candidate, pending all quotes and qualification.':`$299 needs at least ${money(-b.headroom)} less landed COGS to pass 30%, plus enough contingency. Get quotes before accepting this architecture for retail.`} Single-unit retail-stock manufacturing is ${money(one.cogs)} and cannot sustain either retail price. No printer, software setup, reusable jig or development/engineering capital is charged as a new purchase per chair. Machine wear and consumables are recurring and included. A 100-chair batch is a scenario, not an authorized purchase.

| Recurring line | One unit |100-chair allocation | Evidence |
| --- | ---: | ---: | --- |
|1 inch frame/carriage tube, whole 12-foot bars | ${money(one.frame)} | ${money(b.frame)} | Checked bar price, computed nesting |
|1.25 inch housings, whole 6-foot lengths | ${money(one.housing)} | ${money(b.housing)} | Checked price/foot, length assumption |
| Preload shims, ${2*s.preload} total | ${money(one.shimCost)} | ${money(b.shimCost)} | RFQ |
${springCostLines.map(l=>`| ${l.name} | ${money(l.one)} | ${money(l.batch)} | ${l.evidence} |`).join('\n')}
| **Landed COGS** | **${money(one.cogs)}** | **${money(b.cogs)}** | Mostly unquoted |

${springCostLines.map(l=>`- **${l.name}:** ${l.note}`).join('\n')}

## Whole-stock purchasing

1 inch: ${b.packing.bars} x144 inch bars at $60.03 =${money(b.packing.bars*6003)} per 100. Housing: ${b.housings.bars} x6-foot stock at $25.20 =${money(b.housings.bars*2520)}. Every cut charges 3 mm kerf; all offcuts are charged. Per-chair allocations round UP to a cent. Six-foot housing lengths are a purchasing assumption, not a confirmed supplier SKU; verify fulfillment lengths/cut tolerances and re-nest before ordering. Wider/taller/longer configurations change stock waste and margin. No imaginary wholesale discount on tube or wheels.

## Online evidence

${springEvidence.map(e=>`- [${e.name}](${e.url}): ${e.price?money(e.price):'Unpriced'}, ${e.unit}. ${e.note}`).join('\n')}

Prices are observed listings, not checkout quotes or guaranteed availability. Spring rate/free-length/manufacturer deflection references come from the linked maker table. Never convert its spring load/cycle numbers into wheelchair capacity/life. Upper-seat and smooth pin strength, bending, slot wear, side loads, corrosion, stiction and undamped rebound are unqualified. Spring body rendering is an envelope helix, not a print/manufacturing model for the industrial spring. Liner adhesive and tube tolerances can consume the nominal 0.254 mm running gap.

## Conditions and exclusions

Outbound delivery is charged separately at actual cost. Customer sales tax is not revenue; manufacturing assumes valid resale treatment. Add any nonrecoverable purchase tax. Every unquoted operation, steel profile finish, pin/axle supplier fit, complete padded support/front restraint, guard system, freight and production time needs an itemized quote. The textile $24 allowance does not establish a qualified support or anchoring design. Guard development, clinical/structural qualification, insurance, salaries and startup overhead need separate funding. Full fur/pinch/spring guards remain a release gate; the included $4 manufacturing allowance is provisional, with assembly time included in labor. A quoted validated guard design must replace it before a sale-ready COGS claim. A 20% COGS overrun costs ${money(Math.round(b.cogs*.2))} per chair and can eliminate contribution. The rigid r1 baseline remains the lower-complexity fallback.

## Manufacturing release gates

Measure Buddy using the fit guide; obtain clinical guidance. Review the complete metal/textile load paths and dimensions. Verify actual spring tolerances, stock corners, wear-liner fits, seats, guide clearances, slot and pin ligaments, positive retainers and wheel journals. Build only a guarded empty rig, measure force/travel and rebound, then qualify fatigue/stability/terrain and all guarding to an approved protocol before any animal. No hind-leg training or support-force prescription follows from the ideal spring-force preview. Time actual manufacturing and replace all allowances; both qualification and 30% margin gates must pass.

Native commands: \`./buddy design:xl-spring --export --openscad /absolute/path/to/OpenSCAD\`, \`./buddy test\`, \`bun run test:spring\`. Inspect and download matching files at[the r2 studio](https://buddywheels.org/design-studio-xl-suspension).
`
}
