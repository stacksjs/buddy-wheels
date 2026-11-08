# XL r1 standard-parts cost and retail feasibility

Checked 2026-11-08, USD. Native Bun calculation, integer cents. r1 is a rigid, cut-to-fit bench design. This is a manufacturing scenario, not a verified production price, capacity rating or animal-use release.

Configuration: rail height 620, rail spacing 400, rail length 680, provisional hub 82.55, all mm. Hub and anatomy still require physical measurement.

## Result and conditions

At 100 chairs, estimated landed manufacturing COGS is **$180.01 per chair**, against **$264.50 retail**. Product gross margin is 31.9%. The minimum 30% gross-margin gate allows COGS up to $185.15; modeled headroom is $5.14. The scenario meets the numerical gate. Most operations and softgoods are still unquoted. Cost feasibility is CONDITIONAL until itemized quotes and measured production times replace those allowances.

A single chair at retail-stock purchase quantities is estimated at $336.01 before any applicable purchase tax and outbound freight. It does not support a $264.50 selling price. This redesign depends on a 100-chair batch, standardization and repeatable fixtures. Nothing has been bought and no batch is authorized.

The previous r0 estimate was $1,455 in hardware/consumables before assembly. Its separate [capital-inclusive first-rig budget](https://buddywheels.org/prototype-budget) remains a historical r0 study. r1 is a different architecture; removing a printer charge alone did not create these savings.

## Complete per-chair manufacturing model

| Recurring line | One chair |100-chair allocation | Evidence |
| --- | ---: | ---: | --- |
| 6061-T6 tube stock, complete bars with 3 mm kerf | $60.03 | $48.03 | Observed price + computed whole-stock nesting |
| Two complete pneumatic wheels | $29.98 | $29.98 | observed |
| 12 steel profiles, cutting, deburring and corrosion finish | $40.00 | $14.00 | RFQ |
| Two stock-shaft axles, washers and cotters | $20.00 | $10.00 | RFQ |
| Cut standard steel sleeve/spacer stock | $15.00 | $5.00 | RFQ |
| 20 grade-5 bolts, 40 washers and 20 locknuts | $20.00 | $9.00 | RFQ |
| Padded rear support, front restraint and webbing loops | $50.00 | $24.00 | RFQ |
| Nonstructural prints, rejects and power | $4.00 | $3.00 | RFQ |
| Cutting, drilling, cleanup and assembly labor | $60.00 | $20.00 | RFQ |
| Per-chair inspection | $8.00 | $4.00 | RFQ |
| Packaging | $6.00 | $5.00 | RFQ |
| Inbound freight allocation | $20.00 | $6.00 | RFQ |
| Machine wear, shop consumables and tooling allocation | $3.00 | $2.00 | RFQ |
| **Landed manufacturing COGS** | **$336.01** | **$180.01** | Mostly unquoted |

- **6061-T6 tube stock, complete bars with 3 mm kerf:** 80 full 144 inch bars /100 chairs. One-off buys 1 full bar. Offcuts are charged, not free material.
- **Two complete pneumatic wheels:** 2 x $14.99, no bulk discount assumed.
- **12 steel profiles, cutting, deburring and corrosion finish:** Eight identical T gussets plus four axle patches, only two profile types. Includes material and steel finish. No cosmetic tube coating.
- **Two stock-shaft axles, washers and cotters:** Unkeyed precision C1018 5/8 stock cut and cross-drilled. No approved supplier SKU/fit yet. No custom turned heads or threaded bearing journals.
- **Cut standard steel sleeve/spacer stock:** 20 small crush sleeves, two axle sleeves and two wheel spacers, all 25.4 mm cut lengths. Price and finish tolerance require quote.
- **20 grade-5 bolts, 40 washers and 20 locknuts:** Standard 1/4-20 hardware. Quantity 100 manufacturing allowance, not a scraped supplier quote.
- **Padded rear support, front restraint and webbing loops:** Complete textile set manufacturing allowance. No qualified supplier, support pattern, rated anchors or fit exists. This line cannot be omitted or replaced with printed supports.
- **Nonstructural prints, rejects and power:** Allocated consumed material, not a full spool or printer purchase. Slicer grams/hours are unmeasured. Fixture allowance allocated, not charged as a new tool per chair.
- **Cutting, drilling, cleanup and assembly labor:** Batch: 48 min at $25/h; one-off: 2.4 h at $25/h. Timing assumptions, not observed cycle times. Includes stock sleeve/shaft finishing operations.
- **Per-chair inspection:** Recurring check allowance; does not replace engineering qualification or ongoing quality program.
- **Packaging:** Box, protection and instructions. Outbound freight separate.
- **Inbound freight allocation:** Unquoted pooled freight; long stock shipping can exceed this. Actual supplier checkout required.
- **Machine wear, shop consumables and tooling allocation:** Recurring allocation. Printer/tools/jigs and one-time development capital are budgeted separately.

Assembly labor is charged. Printing includes consumed material, failed-print allowance and power, not a fresh printer or full spool per chair. Inbound freight, packaging, inspection and machine/tool wear are included. Manufacturing is modeled under a valid resale purchase arrangement; seller purchase-tax treatment must be confirmed. Customer sales tax is not revenue. Actual nonrecoverable taxes, if any, must be added. Reusable capital, design qualification and startup overhead remain separate; no claim that they disappear economically.

## Actual whole-bar purchasing

The 100-chair setup uses 80 bars x $60.03 = $4,802.40. Net tube is 270900 mm, kerf 1500 mm, purchased stock 292608 mm. First-fit decreasing nests two rails, two posts and one bridge per chair. The model charges every leftover and rounds per-chair stock cost UP to cents. It assumes no wholesale discount. Check long-stock freight before committing; the inbound allowance is unquoted. Different frame dimensions update nesting and can fail the margin gate.

## Selling-cost reconciliation

| Item | Per chair |
| --- | ---: |
| Retail, excluding sales tax | $264.50 |
| Landed manufacturing | $180.01 |
| Product gross profit | $84.49 |
| Payment fee assumption, 2.9% + $0.30 | $7.97 |
| Warranty/returns reserve, 5% | $13.23 |
| Customer support allowance | $10.00 |
| Acquisition allowance | $25.00 |
| **Contribution before fixed overhead** | **$28.29** |
| Contribution if we also subsidize $24 delivery | $4.29 |

Outbound shipping is charged separately at actual cost in the base scenario. It is not hidden in the chair price. The current storefront accepts no orders. These numbers are not take-home profit: insurance, clinical/engineering qualification, salaries, facility costs and ongoing compliance/quality systems still need a funded business model. Free delivery or higher acquisition costs can consume the remaining contribution. A20% manufacturing overrun reduces contribution by $36.00.

## Online supplier evidence, checked 2026-11-08

- [6061-T6 square tube 20737, 1 x .065 inch](https://www.onlinemetals.com/en/buy/aluminum/1-x-0-065-aluminum-square-tube-6061-t6-extruded/pid/20737): **$60.03**, one 144 inch bar. Observed 144 inch selection, $60.03. Full bars and saw kerf charged. No wholesale discount assumed.
- [HAUL-MASTER 67467 pneumatic wheel](https://www.harborfreight.com/13-inch-x-4-inch-pneumatic-tire-67467.html): **$14.99**, one complete wheel. Observed regular price. Nominal 13 x 4 inch, 5/8 bore, 4.7 lb each. Supplier 300 lb wheel rating does not rate the chair. Hub length and intended use remain unapproved.
- [Bolt Depot 436, 5/8-11 x 7 inch grade 5 bolt](https://boltdepot.com/Product-Details?product=436): **$3.72**, one bolt, REJECTED axle substitution. Observed $3.72 each, $66.49/25. Not selected: listing gives minimum thread length, not guaranteed smooth bearing-journal length. Never run a wheel bearing on threads.
- [Bolt Depot 13684, 1 inch steel spacer](https://boltdepot.com/Spacers_Chrome_plated_steel_1_4): **$2.77**, one spacer, cost comparison only. Observed $2.77 each/$232 per 100 for 1/4 ID, 1/2 OD. Not our 3/8 OD sleeve. Rejected as a cost/geometry substitution. r1 uses cut standard tube; its price is unquoted.
- [Integy T7038PURPLE.1 RC shock](https://www.integy.com/st_prod.html?p_catid=59&p_prodid=4354): **$19.99**, listed set, REJECTED suspension. Observed $19.99 and out-of-stock. RC product, no established Buddy load/tune/interface suitability. Not in the r1 BOM and not a purchasable chair suspension option.

Only the specified tube and wheel listings are selected price evidence. Hardware, precision plain shaft stock, sleeve stock, steel cutting/finish, textiles, labor and freight require RFQs. The rejected bolt/spacer/RC examples are price comparisons, not purchased or included substitutions. Listings are not checkout quotes or guaranteed local stock. No unverified wholesale reduction is represented as a supplier price.

## Adjustable suspension decision

There is no independent adjustable suspension in the r1 base. Current modeled cost headroom is $5.14 at the 30% gross-margin gate. The previously designed r0 matched shock pair alone carried a $220 allowance, before arms, pivots and mounts. Even the rejected$19.99 RC listing exceeds this headroom and supplies no evidence of safe dog-support tuning. Pneumatic tires provide compliance, not independently adjustable suspension or prescribed rehabilitation support.

The [r0 suspension studio](https://buddywheels.org/design-studio?size=XL) remains available as a separate research design. Reintroduce a suspension option only after a supplier-approved load/tune/interface drawing, complete installed BOM, fatigue/stability tests and a sustainable option price. Do not show its controls or include its parts in the r1 rigid kit.

## Manufacturing and fit gates

1. Confirm Buddy's measurements and clinical suitability. Frame height is not supported groin height. No 140 lb working rating exists.
2. Approve drawings for the frame joints, tube sleeves, stock-shaft bearing fits and positive cotter retention. Review aluminum/steel corrosion interfaces and finish procedures. Verify actual wheel hub length, offset, runout and tire clearance.
3. Obtain 12-profile steel, axle/sleeve finishing, standard hardware, complete support/anchor, labor and freight RFQs at 100 units. The $24 textile allowance is not an approved or purchasable harness. Review the actual continuous-webbing load path and anti-slide design.
4. Build one guarded empty rig; qualify structure, joint slip, bearing wear, retention, stability, fatigue and intended terrain using an approved protocol before any animal. Garden-wheel ratings do not qualify a wheelchair. Two candidate wheels alone weigh 9.4 lb, so rolling resistance, total mass and handling require comparison with lighter wheels.
5. Time actual cuts, drilling, assembly, prints and inspection. Replace every allowance. Release only when both physical qualification and the margin gate pass. Digital exports and a low spreadsheet total are insufficient.

Build/research commands: `./buddy design:xl-standard --export --openscad /absolute/path/to/OpenSCAD`, `./buddy test`, `bun run test:standard`. See the [r1 studio](https://buddywheels.org/design-studio-xl) for exact configured CAD, BOM and instructions. Other sizes remain r0.
