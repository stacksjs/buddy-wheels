import type { SoftFrame, SoftSetup } from './SoftGoods'
import {completeTextileCost,textileSources} from './TextilePurchases'
import { softDimensions } from './SoftGoods'

export function meshPurchases(s:SoftSetup, quantity:number) { if(!Number.isInteger(quantity)||quantity < 1||quantity > 1000)throw new Error('Invalid textile batch.'); const d = softDimensions(s); const pieces = Array.from({length:quantity}, ()=>[{width:s.slingWidth, length:s.slingLength}, {width:d.bibWidth, length:d.bibLength}]).flat().sort((a, b)=>b.length - a.length); const usable = 1422.4 - 20, shelves:{height:number, remaining:number}[] = []; for(const piece of pieces) { if(piece.width + 5>usable)throw new Error('Pattern exceeds mesh roll width.'); const shelf = shelves.find(row=>row.height>=piece.length + 5&&row.remaining>=piece.width + 5); if(shelf)shelf.remaining-=piece.width + 5; else shelves.push({height:piece.length + 5, remaining:usable - piece.width - 5})}const needed = shelves.reduce((n, row)=>n + row.height, 40); const quarterYards = Math.max(2, Math.ceil(needed / 228.6)); const purchaseCents = quarterYards * 825; return {quantity, shelves:shelves.length, neededMm:needed, purchasedYards:quarterYards / 4, purchaseCents, allocationCents:Math.ceil(purchaseCents / quantity), usableWidthMm:usable}}
const money=(c:number)=>(c<0?'-':'')+'$'+(Math.abs(c)/100).toFixed(2)
export function textileCostNotes(frame:SoftFrame,setup:SoftSetup):string {
 if(frame.size!=='XL')return `# Textile costing scope

${frame.size} ${frame.revision} is a separate cut/sew study. The checked complete price model covers XL with 1-inch webbing and hardware. Do not apply those SKUs or prices to this smaller family. Obtain its correctly sized material, hardware, sewing and freight quotes. No animal-use qualification exists.
`
 const one=completeTextileCost(frame,setup,1),batch=completeTextileCost(frame,setup,100)
 return `# Complete XL support and harness cost

Checked November 8, 2026. ${frame.size} ${frame.revision}, rear ${setup.slingLength} x ${setup.slingWidth} mm, chest ${setup.chest} mm. Price candidates, not a qualified harness or production quote. ${batch.referenceOnly?'REFERENCE ONLY: this configuration uses narrower webbing/hardware; the checked 1-inch SKUs are not compatible purchasing instructions. Obtain exact-width prices.':''} This replaces the old $24 T01 target and $50 one-off allowance. All SG items expand one complete T01 bundle, rather than adding a second harness. For r0 the study remains an unqualified alternative to T01/T02 supplier-selected supports.

## Complete textile purchasing and labor

| Textile line | One-build stock cash | Per chair at 100 | Purchase for 100 |
| --- | ---: | ---: | --- |
${batch.rows.map(row=>`| ${row.name} | ${money(one.rows.find(r=>r.id===row.id)!.allocation)} | ${money(row.allocation)} | ${row.units} ${row.unit}, ${money(row.purchase)} |`).join('\n')}
| Materials, full purchasing units and nesting | ${money(one.materials)} | ${money(batch.materials)} | All offcuts and leftover stock charged |
| Manufacturing rejects reserve, 10% of materials | ${money(one.rejects)} | ${money(batch.rejects)} | Planning reserve, separate from geometric offcuts |
| Cut, sew and textile inspection labor | ${money(one.labor)} | ${money(batch.labor)} | 180 / 75 minutes at $30/hour loaded labor assumption |
| Additional textile inbound freight | ${money(one.freight)} | ${money(batch.freight)} | Unquoted, separate from frame/hardware freight |
| **Complete T01 support/harness** | **${money(one.total)}** | **${money(batch.total)}** | No completed-set supplier quote |

One-build cash buys full supplier packs and leaves reusable material inventory. It is not net consumed fabric cost and it excludes a new printer/sewing machine. The 100-chair column allocates all batch purchasing cash and rounds each line up to a cent. No batch is authorized. Customer tax and delivery are separate. Nonrecoverable purchase tax must be added if resale treatment is unavailable.

## Exact consumption and purchasing method

All ${batch.demand.coveredIds.length} SG rows are covered: ${batch.demand.coveredIds.join(', ')}. Webbing cuts total **${(batch.demand.webbing.reduce((n,v)=>n+v,0)/1000).toFixed(3)} m per set**, including actual returns, 60 mm laps, adjustable tails, perimeter keepers and all six frame wraps. Binding totals **${(batch.demand.binding/1000).toFixed(3)} m**, including the ten cover-tab perimeters missing from the earlier binding allowance. Thread allowance is 80 m per set, top and bobbin combined, unmeasured.

Woven nesting includes the two body panels, twelve chafe-sleeve panels and ten tabs. Mesh and foam each include both body panels. Shelf nesting keeps grain orientation, 5 mm cutting gaps, 20 mm stock-width trim and 40 mm stock-end trim. This is a reproducible feasible purchasing plan, not an optimal nest. Foam uses ${batch.purchases.foam.units} whole sheets for 100 sets. Mesh buys ${batch.purchases.mesh.units} whole yards, ${batch.purchases.mesh.units<20?'below the 20-yard discount threshold, so no discount applies.':'with the applicable published 20-yard or full-30-yard tier; extra full-roll stock is charged when cheaper.'} Binding and webbing use first-fit cuts with 2 mm separation; every panel edge remains continuous. Hook and loop are purchased separately, trimmed from 25.4 to 20 mm, with 1 mm between patches and 25-foot supplier section boundaries. Thread buys ${batch.purchases.threadCones} full cones. No net-area-only pricing or assumed wholesale discount is used.

The $37.50 batch sewing allowance assumes 75 minutes at a loaded $30/hour. It covers textile cutting, binding, reinforcement/box stitches, threading, closures and in-process textile checks. Frame assembly and final chair QA are still charged separately. A factory's completed-set quote must replace these inputs without double-counting its included sewing/freight. Qualification tests and fixed business overhead remain separate. The 10% reject reserve does not fund design qualification or prove any yield.

## Current listed material candidates

${textileSources.map(source=>`- [${source.name}](${source.url}): ${money(source.priceCents)} per ${source.unit}. ${source.note}`).join('\n')}

The black shell's stock status is not confirmed, black binding is unavailable, and the priced red satin binding needs construction/fold-width approval. The foam is firm and needs pressure/comfort testing. Mesh and webbing thicknesses differ from nominal inspection envelopes. Adjuster radii, dimensions, corrosion behavior, strap slip and actual threading remain unapproved. These prices do not authorize material substitutions, provide a dog-support rating or establish an orderable production BOM. Custom colors can add minimums and costs. Hold retail release until a compatible, available bill is quoted and physically qualified.
`
}

export function textileCostCsv(frame:SoftFrame,setup:SoftSetup):string {
 const one=completeTextileCost(frame,setup,1),batch=completeTextileCost(frame,setup,100)
 const rows:(string|number)[][]=[['Line','One-build stock cash USD','100-chair allocation USD','100-chair purchase USD','Purchased units at 100','Source'],...batch.rows.map(row=>[row.name,(one.rows.find(r=>r.id===row.id)!.allocation/100).toFixed(2),(row.allocation/100).toFixed(2),(row.purchase/100).toFixed(2),row.units,textileSources.find(s=>s.id===row.id)!.url]),['Manufacturing rejects',(one.rejects/100).toFixed(2),(batch.rejects/100).toFixed(2),'','','10% assumption'],['Textile cutting/sewing/inspection',(one.labor/100).toFixed(2),(batch.labor/100).toFixed(2),'','','180/75 minutes at $30/hour assumption'],['Additional textile freight',(one.freight/100).toFixed(2),(batch.freight/100).toFixed(2),'','','Unquoted allowance'],['COMPLETE T01',(one.total/100).toFixed(2),(batch.total/100).toFixed(2),'','','Candidate materials and unquoted production assumptions']]
 return rows.map(row=>row.map(value=>`"${String(value).replaceAll('"','""')}"`).join(',')).join('\n')+'\n'
}
