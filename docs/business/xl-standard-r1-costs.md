# XL r1 standard-parts cost and retail feasibility

Checked 2026-11-08, USD. Native Bun calculation, integer cents. r1 is a rigid, cut-to-fit bench design. This is a manufacturing scenario, not a verified production price, capacity rating or animal-use release.

Configuration: rail height 620, rail spacing 400, rail length 680, provisional hub 82.55, all mm. Hub and anatomy still require physical measurement.

## Result and conditions

At 100 chairs, estimated landed manufacturing COGS is **$244.02 per chair**, against **$264.50 retail**. Product gross margin is 7.7%. The minimum 30% gross-margin gate allows COGS up to $185.15; modeled headroom is -$58.87. The scenario FAILS the numerical gate. Production times, compatibility and freight are still unquoted. Cost feasibility is CONDITIONAL until itemized quotes and measured production times replace those allowances.

A single chair at retail-stock purchase quantities is estimated at $553.39 before any applicable purchase tax and outbound freight. It does not support a $264.50 selling price. This redesign depends on a 100-chair batch, standardization and repeatable fixtures. Nothing has been bought and no batch is authorized.

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
| Padded rear support, front restraint and webbing loops | $267.38 | $88.01 | Listed materials + assumed labor/freight |
| Nonstructural prints, rejects and power | $4.00 | $3.00 | RFQ |
| Cutting, drilling, cleanup and assembly labor | $60.00 | $20.00 | RFQ |
| Per-chair inspection | $8.00 | $4.00 | RFQ |
| Packaging | $6.00 | $5.00 | RFQ |
| Inbound freight allocation | $20.00 | $6.00 | RFQ |
| Machine wear, shop consumables and tooling allocation | $3.00 | $2.00 | RFQ |
| **Landed manufacturing COGS** | **$553.39** | **$244.02** | Mostly unquoted |

- **6061-T6 tube stock, complete bars with 3 mm kerf:** 80 full 144 inch bars /100 chairs. One-off buys 1 full bar. Offcuts are charged, not free material.
- **Two complete pneumatic wheels:** 2 x $14.99, no bulk discount assumed.
- **12 steel profiles, cutting, deburring and corrosion finish:** Eight identical T gussets plus four axle patches, only two profile types. Includes material and steel finish. No cosmetic tube coating.
- **Two stock-shaft axles, washers and cotters:** Unkeyed precision C1018 5/8 stock cut and cross-drilled. No approved supplier SKU/fit yet. No custom turned heads or threaded bearing journals.
- **Cut standard steel sleeve/spacer stock:** 20 small crush sleeves, two axle sleeves and two wheel spacers, all 25.4 mm cut lengths. Price and finish tolerance require quote.
- **20 grade-5 bolts, 40 washers and 20 locknuts:** Standard 1/4-20 hardware. Quantity 100 manufacturing allowance, not a scraped supplier quote.
- **Padded rear support, front restraint and webbing loops:** Itemized shell, mesh, 5 mm foam, all straps/wraps, six adjusters, front buckle, binding, thread and closures. Includes 10% material reject reserve, 75 min at $30/h batch or 180 min one-off, and incremental textile freight. No supplier-approved completed harness quote or load/fit qualification.
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
| Landed manufacturing | $244.02 |
| Product gross profit | $20.48 |
| Payment fee assumption, 2.9% + $0.30 | $7.97 |
| Warranty/returns reserve, 5% | $13.23 |
| Customer support allowance | $10.00 |
| Acquisition allowance | $25.00 |
| **Contribution before fixed overhead** | **-$35.72** |
| Contribution if we also subsidize $24 delivery | -$59.72 |

Outbound shipping is charged separately at actual cost in the base scenario. It is not hidden in the chair price. The current storefront accepts no orders. These numbers are not take-home profit: insurance, clinical/engineering qualification, salaries, facility costs and ongoing compliance/quality systems still need a funded business model. Free delivery or higher acquisition costs can consume the remaining contribution. A20% manufacturing overrun reduces contribution by $48.80.

## Online supplier evidence, checked 2026-11-08

- [6061-T6 square tube 20737, 1 x .065 inch](https://www.onlinemetals.com/en/buy/aluminum/1-x-0-065-aluminum-square-tube-6061-t6-extruded/pid/20737): **$60.03**, one 144 inch bar. Observed 144 inch selection, $60.03. Full bars and saw kerf charged. No wholesale discount assumed.
- [HAUL-MASTER 67467 pneumatic wheel](https://www.harborfreight.com/13-inch-x-4-inch-pneumatic-tire-67467.html): **$14.99**, one complete wheel. Observed regular price. Nominal 13 x 4 inch, 5/8 bore, 4.7 lb each. Supplier 300 lb wheel rating does not rate the chair. Hub length and intended use remain unapproved.
- [Bolt Depot 436, 5/8-11 x 7 inch grade 5 bolt](https://boltdepot.com/Product-Details?product=436): **$3.72**, one bolt, REJECTED axle substitution. Observed $3.72 each, $66.49/25. Not selected: listing gives minimum thread length, not guaranteed smooth bearing-journal length. Never run a wheel bearing on threads.
- [Bolt Depot 13684, 1 inch steel spacer](https://boltdepot.com/Spacers_Chrome_plated_steel_1_4): **$2.77**, one spacer, cost comparison only. Observed $2.77 each/$232 per 100 for 1/4 ID, 1/2 OD. Not our 3/8 OD sleeve. Rejected as a cost/geometry substitution. r1 uses cut standard tube; its price is unquoted.
- [Integy T7038PURPLE.1 RC shock](https://www.integy.com/st_prod.html?p_catid=59&p_prodid=4354): **$19.99**, listed set, REJECTED suspension. Observed $19.99 and out-of-stock. RC product, no established Buddy load/tune/interface suitability. Not in the r1 BOM and not a purchasable chair suspension option.

The tube/wheel evidence is listed above; the textile price candidates are itemized below. Hardware, precision plain shaft stock, sleeve stock, steel cutting/finish, completed textile production, labor and freight require RFQs. The rejected bolt/spacer/RC examples are price comparisons, not purchased or included substitutions. Listings are not checkout quotes or guaranteed local stock. No unverified wholesale reduction is represented as a supplier price.

## Adjustable suspension decision

There is no independent adjustable suspension in the r1 base. Current modeled cost headroom is -$58.87 at the 30% gross-margin gate. The previously designed r0 matched shock pair alone carried a $220 allowance, before arms, pivots and mounts. Even the rejected$19.99 RC listing exceeds this headroom and supplies no evidence of safe dog-support tuning. Pneumatic tires provide compliance, not independently adjustable suspension or prescribed rehabilitation support.

The [r0 suspension studio](https://buddywheels.org/design-studio?size=XL) remains available as a separate research design. Reintroduce a suspension option only after a supplier-approved load/tune/interface drawing, complete installed BOM, fatigue/stability tests and a sustainable option price. Do not show its controls or include its parts in the r1 rigid kit.

## Manufacturing and fit gates

1. Confirm Buddy's measurements and clinical suitability. Frame height is not supported groin height. No 140 lb working rating exists.
2. Approve drawings for the frame joints, tube sleeves, stock-shaft bearing fits and positive cotter retention. Review aluminum/steel corrosion interfaces and finish procedures. Verify actual wheel hub length, offset, runout and tire clearance.
3. Obtain 12-profile steel, axle/sleeve finishing, standard hardware, complete support/anchor, labor and freight RFQs at 100 units. The old $24 textile allowance is replaced by the itemized candidate-material and assumed sewing model below. This is not an approved or purchasable completed harness. Review the actual continuous-webbing load path and anti-slide design.
4. Build one guarded empty rig; qualify structure, joint slip, bearing wear, retention, stability, fatigue and intended terrain using an approved protocol before any animal. Garden-wheel ratings do not qualify a wheelchair. Two candidate wheels alone weigh 9.4 lb, so rolling resistance, total mass and handling require comparison with lighter wheels.
5. Time actual cuts, drilling, assembly, prints and inspection. Replace every allowance. Release only when both physical qualification and the margin gate pass. Digital exports and a low spreadsheet total are insufficient.

# Complete XL support and harness cost

Checked November 8, 2026. XL r1, rear 220 x 350 mm, chest 1065 mm. Price candidates, not a qualified harness or production quote.  This replaces the old $24 T01 target and $50 one-off allowance. All SG items expand one complete T01 bundle, rather than adding a second harness. For r0 the study remains an unqualified alternative to T01/T02 supplier-selected supports.

## Complete textile purchasing and labor

| Textile line | One-build stock cash | Per chair at 100 | Purchase for 100 |
| --- | ---: | ---: | --- |
| Woven shells, 12 chafe panels and 10 closure tabs | $18.71 | $3.56 | 19 whole linear yards, $355.49 |
| Rear and front spacer mesh | $12.68 | $1.27 | 10 whole linear yards, $126.80 |
| Rear and front 5 mm EVA pads | $31.50 | $3.78 | 12 39 x 51 inch sheets, $378.00 |
| Every webbing cut including returns, laps and tails | $20.57 | $17.81 | 23 120-foot rolls, $1780.43 |
| Six metal double-bar adjusters | $4.50 | $4.50 | 600 each, higher conflicting listing price, $450.00 |
| One 1-inch acetal front closure | $1.10 | $1.10 | 100 each, $110.00 |
| 20 mm binding including cover-tab edges | $8.99 | $7.56 | 84 10-meter packs; each panel/tab edge stays continuous, $755.16 |
| Tex 90 top/bobbin thread allowance | $15.95 | $1.44 | 9 987.552-meter cones, $143.55 |
| Ten 20 x 20 mm hook patches | $0.90 | $0.63 | 70 linear feet of 1-inch hook, $63.00 |
| Ten 20 x 20 mm loop patches | $0.90 | $0.63 | 70 linear feet of 1-inch loop, $63.00 |
| Materials, full purchasing units and nesting | $115.80 | $42.28 | All offcuts and leftover stock charged |
| Manufacturing rejects reserve, 10% of materials | $11.58 | $4.23 | Planning reserve, separate from geometric offcuts |
| Cut, sew and textile inspection labor | $90.00 | $37.50 | 180 / 75 minutes at $30/hour loaded labor assumption |
| Additional textile inbound freight | $50.00 | $4.00 | Unquoted, separate from frame/hardware freight |
| **Complete T01 support/harness** | **$267.38** | **$88.01** | No completed-set supplier quote |

One-build cash buys full supplier packs and leaves reusable material inventory. It is not net consumed fabric cost and it excludes a new printer/sewing machine. The 100-chair column allocates all batch purchasing cash and rounds each line up to a cent. No batch is authorized. Customer tax and delivery are separate. Nonrecoverable purchase tax must be added if resale treatment is unavailable.

## Exact consumption and purchasing method

All 33 SG rows are covered: SG01, SG02, SG03, SG04, SG05, SG06, SG07, SG08-1, SG08-2, SG08-3, SG08-4, SG08-5, SG08-6, SG08-7, SG08-8, SG08-9, SG08-10, SG08-11, SG08-12, SG08-13, SG08-14, SG08-15, SG08-16, SG08-17, SG09-R, SG09-B, SG10-R, SG10-B, SG11, SG12, SG13, SG14, SG15. Webbing cuts total **8.228 m per set**, including actual returns, 60 mm laps, adjustable tails, perimeter keepers and all six frame wraps. Binding totals **8.292 m**, including the ten cover-tab perimeters missing from the earlier binding allowance. Thread allowance is 80 m per set, top and bobbin combined, unmeasured.

Woven nesting includes the two body panels, twelve chafe-sleeve panels and ten tabs. Mesh and foam each include both body panels. Shelf nesting keeps grain orientation, 5 mm cutting gaps, 20 mm stock-width trim and 40 mm stock-end trim. This is a reproducible feasible purchasing plan, not an optimal nest. Foam uses 12 whole sheets for 100 sets. Mesh buys 10 whole yards, below the 20-yard discount threshold, so no discount applies. Binding and webbing use first-fit cuts with 2 mm separation; every panel edge remains continuous. Hook and loop are purchased separately, trimmed from 25.4 to 20 mm, with 1 mm between patches and 25-foot supplier section boundaries. Thread buys 9 full cones. No net-area-only pricing or assumed wholesale discount is used.

The $37.50 batch sewing allowance assumes 75 minutes at a loaded $30/hour. It covers textile cutting, binding, reinforcement/box stitches, threading, closures and in-process textile checks. Frame assembly and final chair QA are still charged separately. A factory's completed-set quote must replace these inputs without double-counting its included sewing/freight. Qualification tests and fixed business overhead remain separate. The 10% reject reserve does not fund design qualification or prove any yield.

## Current listed material candidates

- [Rockywoods 58-CORDURAPOLY-Black](https://rockywoods.com/products/1000-denier-coated-cordura-hp-polyester-fabric): $18.71 per 60-inch-wide linear yard. 1000D-class coated polyester, listed $18.71/yard. Model buys whole yards without an unverified roll discount. Exact black-variant availability is unconfirmed; page exposes both Sold Out and Add to Cart. Nominal .025-inch thickness is not the CAD .8 mm envelope.
- [OWF SPACER3MM](https://www.owfinc.com/Spacer-3mm-Mesh/productinfo/SPACER3MM/): $12.68 per 58-inch-wide linear yard. Listed in stock. $12.68/yard, $9.89 at 20 yards, $8.62 for a full 30-yard roll. Use $12.68 until the actual purchase reaches a tier. Listed 3 mm / approximately 3/32 inch; this is a costing candidate for the 1.5 mm CAD reference layer, not an approved thickness substitution.
- [Avetco E600 5 mm EVA SP60A.5MM.BLACK.39X51](https://www.avetcoinc.com/product/e600-high-density-eva-foam-sheets-60-65-shore-c-39-x-51-5mm-10mm/?attribute_thickness=5+mm): $31.50 per 39 x 51 inch sheet, 5 mm. Exact 5 mm variation $31.50, in stock, MOQ one. Firm 60-65 Shore C. Comfort/compression remains unqualified. Sheet nesting, not net area pricing.
- [Strapworks WSR-POL-PUT-001-BLK](https://www.strapworks.com/1-inch-utility-polyester-webbing-black): $77.41 per 120-foot roll, 1 inch polyester. Listed in stock. $77.41/120 ft; singles $0.74/ft, 30 ft $20.57, 60 ft $39.51. Batch uses actual 120-foot rolls; one-off compares those options without assuming a continuous splice-free roll. Nominal .065-.07 inch thickness; compatibility and sewn strength unqualified.
- [Seattle Fabrics H-MLL](https://www.seattlefabrics.com/1-Metal-Double-Bar-Ladder-Lock-in-Nickel-Plated-Steel_p_490.html): $0.75 per one 1-inch nickel-plated steel double-bar ladder lock. Page header $0.65, description $0.75. Model conservatively uses $0.75, not the lower conflicting price. Page states In Stock but also contains a generic wait-list block. Checkout and actual dimensions/radii/slip resistance need verification.
- [RBTR SR-1-B, variant 12231494785](https://ripstopbytheroll.com/products/standard-side-release-buckle?variant=12231494785): $1.10 per one 1-inch acetal single-adjust buckle. Exact 1-inch variant $1.10, available=true. Default $0.90 is the smaller 3/4-inch option. Front restraint only in this study.
- [HobbyTrendy BSB12 red polyester satin binding](https://hobby-trendy.com/products/polyester-satin-bias-binding-tape-single-fold-20mm-13-16inch-10meters-10-93yds?variant=35564962873505): $8.99 per 10-meter pack, nominal 20 mm single fold. Red available, black BSB24 unavailable. Satin construction, supplied/folded width and durability must be approved against the 20 mm cut/sew specification. Cost reference only; a qualified black industrial equivalent still needs a quote.
- [Sailrite 123338 PremoBond Tex 90 black bonded polyester](https://www.sailrite.com/PremoBond-V-92-Black-UV-Bonded-Polyester-Thread-4-Oz-1-350-Yds): $15.95 per 4 oz cone, current title 1,080 yards / 987.552 m. Current title says 1,080 yards although URL says 1,350. Use the shorter current yield. Listed available. 80 m per set covers top/bobbin/rework only as an unmeasured allowance.
- [RBTR 1-VELCRO-HOOK-B](https://ripstopbytheroll.com/products/velcro-industrial-hook-and-loop?variant=47238308692138): $0.90 per one foot, 1-inch sew-on nylon hook. Available=true. Trim width to 20 mm, charge full bought width. Cuts include 1 mm separation; account for 25-foot supplier section boundaries.
- [RBTR 1-VELCRO-LOOP-B](https://ripstopbytheroll.com/products/velcro-industrial-sew-on-tape-loop?variant=47238312591530): $0.90 per one foot, 1-inch sew-on nylon loop. Purchased separately from hook at the same price. Ten mated patches require ten pieces of each side.

The black shell's stock status is not confirmed, black binding is unavailable, and the priced red satin binding needs construction/fold-width approval. The foam is firm and needs pressure/comfort testing. Mesh and webbing thicknesses differ from nominal inspection envelopes. Adjuster radii, dimensions, corrosion behavior, strap slip and actual threading remain unapproved. These prices do not authorize material substitutions, provide a dog-support rating or establish an orderable production BOM. Custom colors can add minimums and costs. Hold retail release until a compatible, available bill is quoted and physically qualified.


Build/research commands: `./buddy design:xl-standard --export --openscad /absolute/path/to/OpenSCAD`, `./buddy test`, `bun run test:standard`. See the [r1 studio](https://buddywheels.org/design-studio-xl) for exact configured CAD, BOM and instructions. Other sizes remain r0.
