import {springStart} from './XLSpring'
import {springEconomics,springCostCsv,springMoney} from './XLSpringCost'
import {standardEconomics} from './XLStandardCost'
import {xlSoftFrame} from './SoftGoodsFrame'
import {softStart} from './SoftGoods'
import {completeTextileCost} from './TextilePurchases'
import {textileCostNotes} from './SoftGoodsCost'
const money=springMoney
export function xlCompleteCostReport():string {
 const current=springEconomics(),one=springEconomics(springStart,1),rigid=standardEconomics(),frame=xlSoftFrame(springStart),goods=softStart(frame)
 const nonTextile=current.cogs-current.textiles.total
 const atPrice=(retail:number,cogs=current.cogs)=>{const gross=retail-cogs,fee=Math.round(retail*.029)+30,warranty=Math.round(retail*.05);return {gross,margin:gross/retail*100,fee,warranty,contribution:gross-fee-warranty-3500}}
 const breakEven=Math.ceil((current.cogs+3530)/.921),marginPrice=Math.ceil(current.cogs/.7)
 return `# Buddy XL: complete per-unit cost and $299 decision

Checked November 8, 2026. USD. This is the current bottom-up r2 spring-chair planning estimate at the default Buddy XL geometry, not a finished-product quote or an animal-use release. The prior $217.44 total contained an unquoted $24 textile placeholder. It is superseded by the complete support/harness costing below.

## Decision

The current design does not support $299 retail under the existing business assumptions. The 100-chair estimate is ${money(current.cogs)} per chair, including ${money(current.textiles.total)} for the complete support/harness. At $299 that leaves ${money(current.gross)} gross profit (${current.grossPercent.toFixed(1)}%), then ${money(current.contribution)} contribution after fees, reserve, support and acquisition. The unchanged 30% gross-margin gate requires COGS no higher than ${money(current.maxCogs)}, a ${money(-current.headroom)} reduction from this estimate. Prices in the storefront are not changed by this study.

Even with FREE sewing, current materials, rejects and textile freight would cost ${money(current.textiles.total-current.textiles.labor)} for T01. With the ${money(nonTextile)} non-textile base, the 30% gate allows only **${money(current.maxCogs-nonTextile)} for the complete T01 set**. Listed material purchasing alone is ${money(current.textiles.materials)}. A modest buckle discount cannot close that gap.

## Full recurring cost summary

| Category | 100-chair allocation per chair |
| --- | ---: |
| Whole frame/carriage tube stock | ${money(current.frame)} |
| Whole cartridge housing stock | ${money(current.housing)} |
| Springs | $9.24 |
| Wheels | $29.98 |
| Metal profiles, shafts, sleeves, bolts, pins, guidance, shims and guards | ${money(nonTextile-current.frame-current.housing-924-2998-2500-600-500-700-200)} |
| Complete textile materials, full purchasing units | ${money(current.textiles.materials)} |
| Textile manufacturing reject reserve | ${money(current.textiles.rejects)} |
| Textile cutting, sewing and textile inspection | ${money(current.textiles.labor)} |
| Frame cutting, drilling and assembly labor | $25.00 |
| Final chair inspection | $6.00 |
| Packaging | $5.00 |
| Frame/hardware inbound freight | $7.00 |
| Additional textile inbound freight | ${money(current.textiles.freight)} |
| Machine wear and shop consumables | $2.00 |
| **Complete landed manufacturing** | **${money(current.cogs)}** |

The [r2 line-item CSV](xl-spring-r2-costs.csv) expands every mechanical category. All material quantities follow the current CAD/cut schedule. This excludes buying a new printer, sewing machine, reusable tools, design software, fixtures or engineering setup for every chair. Production labor, power/rejects, wear and freight remain recurring. Design qualification, insurance, fixed overhead and salaries beyond the modeled production labor require separate funding.

## $299 selling costs and one-build comparison

| Metric | Per chair |
| --- | ---: |
| Retail revenue excluding customer tax | $299.00 |
| Manufacturing COGS | ${money(current.cogs)} |
| Gross profit | ${money(current.gross)} |
| Card fee, 2.9% + $0.30 | ${money(current.fee)} |
| Return/warranty reserve, 5% | ${money(current.warranty)} |
| Customer support assumption | $10.00 |
| Customer acquisition assumption | $25.00 |
| **Contribution before fixed overhead** | **${money(current.contribution)}** |
| Contribution with $24 seller-paid delivery | ${money(current.freeShippingContribution)} |
| Contribution with zero acquisition spend | ${money(current.contribution+2500)} |

Outbound delivery is customer-paid in the base case. Customer sales tax is not revenue. Input purchases assume valid resale treatment; add any nonrecoverable tax. The extra textile freight allowance is in addition to frame/hardware freight, since these are separate supply sources. Actual checkout freight is not verified.

One-off stock purchasing, paid production labor and modeled freight total **${money(one.cogs)}**, including **${money(one.textiles.total)}** for textiles. That is cash needed under whole-pack purchasing assumptions and includes leftover inventory. It is not the net material physically consumed by one chair. A 100-chair run is a costing scenario, not a purchase authorization.

## Labor and sourcing sensitivity

These scenarios retain the complete BOM and stock purchasing; they vary only explicit labor assumptions.

| Textile sewing scenario | Complete T01 | Full r2 COGS | Gross margin at $299 | Contribution |
| --- | ---: | ---: | ---: | ---: |
${[[45,2500],[60,3000],[75,3000],[120,4000]].map(([minutes,rate])=>{const textile=completeTextileCost(frame,goods,100,minutes!,rate!),cogs=nonTextile+textile.total,scenario=atPrice(29900,cogs);return `| ${minutes} min at ${money(rate!)}/hour | ${money(textile.total)} | ${money(cogs)} | ${scenario.margin.toFixed(1)}% | ${money(scenario.contribution)} |`}).join('\n')}

[US Cargo Control NS-WEB14500BLK](https://www.uscargocontrol.com/products/Black-Polyester-Web-1-x-300-3-5K-Cargo-Webbing) lists a 300-foot polyester roll at $69.99, with $87.00 crossed out; the current page says Call to Order. Buying ten 300-foot rolls at the listed price would be $699.90, or $7.00 per chair before rejected/uncuttable sections, versus the selected Strapworks webbing allocation of ${money(current.textiles.rows.find(row=>row.id==='webbing')!.allocation)}. Even that approximately $11.89 saving after the material reject reserve cannot close the ${money(-current.headroom)} gross-gate gap. It is a comparison, not an approved substitute: cargo-web stiffness, width/thickness tolerance, skin/abrasion behavior and adjuster grip must be qualified, and availability/price require confirmation. Do not use promotional or unquoted wholesale prices as guaranteed production savings.

The selected mesh is already the lower-priced OWF reference, not the unavailable $33/yard Seattle mesh. The 100-chair nest needs ten yards, so the published 20/30-yard discount tiers do not apply. The selected adjusters already use the conservative $0.75 listing text. Further optimization must address the complete support architecture, assembly time and the non-textile frame base, with a new reviewed BOM and quote. Do not remove chafe protection, reinforcement or guarding to make a spreadsheet pass.

The rigid r1 alternative is **${money(rigid.cogs)}** with this same textile model. At $299 its gross margin would be ${atPrice(29900,rigid.cogs).margin.toFixed(1)}% and contribution ${money(atPrice(29900,rigid.cogs).contribution)}. It still fails 30%; removing suspension alone does not solve the complete product economics.

## Price boundary, without changing the product price

At this COGS, contribution break-even is approximately **${money(breakEven)}**, before fixed overhead. A 30% product gross margin needs at least **${money(marginPrice)}** before any cost overrun. These are arithmetic boundaries, not recommended launch prices or evidence that customers will pay them.

| Illustrative retail | Gross margin | Contribution before fixed overhead |
| --- | ---: | ---: |
${[29900,34900,39900,40900].map(retail=>{const result=atPrice(retail);return `| ${money(retail)} | ${result.margin.toFixed(1)}% | ${money(result.contribution)} |`}).join('\n')}

## Evidence and release conditions

Labor times and the loaded $30/hour rate are planning inputs, not a measured factory cycle or wage quote. The 10% material reject reserve and incremental $4 textile freight are assumptions. Mechanical fabrication, guards, exact hardware and shipping also retain RFQ allowances. Listed shell stock is ambiguous, black binding is unavailable, the priced red satin binding needs construction approval, firm EVA comfort is unqualified and purchased hardware must match the actual interfaces. None of the costing candidates is approved for Buddy's body support. Obtain available, compatible production SKUs, sewing coupons, loaded fixture tests and professional fit review before any animal use or sales release.

${textileCostNotes(frame,goods).trimEnd()}
`
}

export async function writeXLCompleteCosts(root:string){
 await Bun.write(root+'/docs/business/xl-complete-unit-costs.md',xlCompleteCostReport())
 await Bun.write(root+'/public/designs/xl/r2/complete-unit-costs.md',xlCompleteCostReport())
 await Bun.write(root+'/docs/business/xl-complete-unit-costs.csv',springCostCsv())
}
