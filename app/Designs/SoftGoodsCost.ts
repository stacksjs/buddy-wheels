import type { SoftFrame, SoftSetup } from './SoftGoods'
import { softDimensions } from './SoftGoods'

export function meshPurchases(s:SoftSetup, quantity:number) { if(!Number.isInteger(quantity)||quantity < 1||quantity > 1000)throw new Error('Invalid textile batch.'); const d = softDimensions(s); const pieces = Array.from({length:quantity}, ()=>[{width:s.slingWidth, length:s.slingLength}, {width:d.bibWidth, length:d.bibLength}]).flat().sort((a, b)=>b.length - a.length); const usable = 1422.4 - 20, shelves:{height:number, remaining:number}[] = []; for(const piece of pieces) { if(piece.width + 5>usable)throw new Error('Pattern exceeds mesh roll width.'); const shelf = shelves.find(row=>row.height>=piece.length + 5&&row.remaining>=piece.width + 5); if(shelf)shelf.remaining-=piece.width + 5; else shelves.push({height:piece.length + 5, remaining:usable - piece.width - 5})}const needed = shelves.reduce((n, row)=>n + row.height, 40); const quarterYards = Math.max(2, Math.ceil(needed / 228.6)); const purchaseCents = quarterYards * 825; return {quantity, shelves:shelves.length, neededMm:needed, purchasedYards:quarterYards / 4, purchaseCents, allocationCents:Math.ceil(purchaseCents / quantity), usableWidthMm:usable}}
// Template interpolation references are checked by TypeScript and covered by generated-file tests.
// eslint-disable-next-line pickier/no-unused-vars
export function textileCostNotes(f:SoftFrame, s:SoftSetup):string { const one = meshPurchases(s, 1), batch = meshPurchases(s, 100), money = (c:number)=>(c < 0?'-':'')+'$'+(Math.abs(c)/100).toFixed(2); return `# Textile material and T01 cost reconciliation

${f.size} ${f.revision}, selected rear saddle ${s.slingLength} x ${s.slingWidth} mm; chest ${s.chest} mm. Checked November 8, 2026. This is a candidate pattern, not a qualified harness or a production quote.

In XL r1/r2, T01 is the complete support bundle; SG01-SG15 are its detailed subparts. In r0, the original T01 rear-support and T02 front-harness requirements remain supplier-selected requirements, and these patterns are an alternative unqualified bench study. Do not add a complete bundle and its subparts twice. The XL r1/r2 batch allowance is $24 for the complete sewn support/restraint set. This is still an unquoted target and is not verified by adding CAD geometry.

## A checked mesh reference, charged as whole purchases

[Seattle Fabrics Disco 3D spacer mesh](https://www.seattlefabrics.com/56-Disco-3D-Spacer-Mesh-3300-linear-yard_p_96.html) lists $33 per linear yard, 56 inch width, a half-yard minimum and quarter-yard increments. It displays a waiting-list/out-of-stock notice; it is not an available purchase quote or animal-support approval. Other colors can require full rolls. We model reference black material only.

| Mesh purchase scenario | One set |100 sets |
| --- | ---: | ---: |
| Whole purchased linear yards | ${one.purchasedYards} | ${batch.purchasedYards} |
| Full material purchase | ${money(one.purchaseCents)} | ${money(batch.purchaseCents)} |
| Allocated mesh per chair | ${money(one.allocationCents)} | ${money(batch.allocationCents)} |
| Unquoted balance of a $24 complete-set target | ${money(2400-one.allocationCents)} | ${money(2400-batch.allocationCents)} |

This is grain-aligned first-fit shelf nesting of two full rectangular pattern blanks per set, with 5 mm handling gaps, 20 mm roll-width allowance and 40 mm total roll-end allowance. We round the purchased roll length up to quarter yards and charge all offcuts. No wholesale discount is invented. It is not net fabric area multiplied by price. The one-set balance is shown only to reconcile the $24 target; the actual one-off chair model has a separate, larger textile allowance.

The remaining balance must fund the woven support shells, foam, every listed webbing cut and sewing lap, six metal adjusters, front-only closure, chafe sleeves, binding, thread and sewing labor. Their exact prices, supplier SKUs, yields, scrap and production times remain unquoted. A sewing machine, development fixtures and qualification are one-time capital/development costs; production machine wear and paid sewing remain recurring. Generic chair assembly labor must not double-count sewing if the T01 supplier quote already includes it.

## XL r2 price sensitivity

The current reference XL r2 default scenario is $217.44 COGS including its $24 T01 target. At $299 retail, each extra dollar in the complete textile quote reduces contribution by one dollar. For the default chair only:

| Actual complete T01 quote | Revised landed COGS | Gross margin at $299 | Contribution before fixed overhead |
| --- | ---: | ---: | ---: |
${[2400,3000,4000,5000].map(t=>{const c=21744+t-2400;return `| ${money(t)} | ${money(c)} | ${((29900-c)/29900*100).toFixed(1)}% | ${money(2264-(t-2400))} |`}).join('\n')}

These retain the prior fee/reserve/support/acquisition assumptions and customer-paid delivery. They are sensitivity calculations, not quotes. Even the $24 target leaves an $8.14 shortfall to the unchanged 30% gross-margin gate. Different frame dimensions change the frame-stock COGS separately; use the main configured cost file for that value. Quote, time and qualify the actual complete support before selecting a retail release price.
`}
