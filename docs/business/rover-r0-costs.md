# Buddy Rover r0 cost study

Checked 2026-11-11, USD, integer cents, native Bun arithmetic. Configuration rover-r0-l1200-w700-h950-r900-a520-g980-hub75. This prices the r0 bench architecture. It is not a supplier quote, a production cost or a selling price, and nothing has been bought.

## Result

At 100 carriers the modeled landed manufacturing cost is **$2,037.93 each**. A single build at retail quantities is **$3,254.89**. The catalog's provisional Run price is $399.00, so the 30% gross-margin gate allows $279.30 and this design misses it by $1,758.63. To pass the same gate at this cost the price would have to be about $2,912.00.

The earlier Rover unit economics assumed $210 of cost for Run. That figure was a target with no bill of materials behind it. This study replaces it with a counted one, and the counted one does not fit. Either the price moves, or the architecture changes, or both. The catalog price is unchanged pending that decision.

For scale, the reference trailer sold for $729.95 at one retailer on the check date, with a 100 lb stated capacity and a 36.2 x 22.4 x 29.9 inch interior. Rover's cabin is about twice that volume.

## Where the money goes

| Line | One carrier | 100-carrier allocation | Evidence |
| --- | ---: | ---: | --- |
| Aluminum tube, whole 12-foot bars with kerf | $640.12 | $532.50 | .065 wall observed, .125 wall allowance |
| 36 corner and 12 tee gussets, laser cut 1/8 inch 6061 | $216.00 | $76.80 | RFQ |
| 8 stainless axle hangers | $72.00 | $32.00 | RFQ |
| Three matching 20 inch pneumatic wheels | $180.00 | $180.00 | Allowance |
| Three stock-shaft axles, sleeves, spacers, washers and cotters | $40.00 | $18.00 | RFQ |
| 152 sleeved stainless joints | $190.00 | $150.48 | Allowance |
| Floor and ramp panels, sealed 12 mm marine plywood | $150.00 | $137.00 | Allowance |
| Hinge, two latches, safety strap hardware and stand feet | $65.00 | $46.00 | Allowance |
| Brake set, grip, tip-stop feet and floor fasteners | $85.00 | $62.00 | Allowance |
| Printed service parts and fixtures | $27.00 | $23.00 | Computed volume + allowance |
| Cutting, drilling, deburring and assembly labor | $400.00 | $150.00 | RFQ |
| Per-carrier inspection | $25.00 | $12.00 | RFQ |
| Packaging | $35.00 | $25.00 | RFQ |
| Inbound freight allocation | $90.00 | $30.00 | RFQ |
| Machine wear and shop consumables | $10.00 | $6.00 | RFQ |
| Weather cover, floor set and ramp surface | $1,029.77 | $557.15 | Listed materials + assumed sewing |
| **Landed manufacturing** | **$3,254.89** | **$2,037.93** | Mostly unquoted |

- **36 corner and 12 tee gussets, laser cut 1/8 inch 6061:** Two repeated aluminum profiles. Includes material, cutting and deburring.
- **8 stainless axle hangers:** One 304 stainless profile for all three wheels. Bore finishing after drawing review.
- **Three matching 20 inch pneumatic wheels:** No verified wheel candidate yet. See the allowance notes.
- **Three stock-shaft axles, sleeves, spacers, washers and cotters:** Plain 5/8 inch shaft cut and cross-drilled. No threaded journals.
- **152 sleeved stainless joints:** The largest hardware line. It follows directly from a bolted frame with no welding.
- **Floor and ramp panels, sealed 12 mm marine plywood:** 1 sheet per carrier plus edge sealing. Offcuts are charged.
- **Hinge, two latches, safety strap hardware and stand feet:** Stainless continuous hinge, two draw latches, two leveling feet with tube inserts, carriage bolts.
- **Brake set, grip, tip-stop feet and floor fasteners:** Lever, cable and two wheel brakes are unselected. The allowance is not a brake design.
- **Printed service parts and fixtures:** About 1.3 liters of solid part volume, most of it the three ramp toes. Priced as consumed filament with a reject reserve, not a printer.
- **Cutting, drilling, deburring and assembly labor:** Batch: 6 h at $25/h. One-off: 16 h. Roughly 300 tube-wall holes per carrier. Timing assumptions, not observed.
- **Per-carrier inspection:** Does not replace engineering qualification.
- **Packaging:** Large flat-pack carton set. Outbound freight is separate.
- **Inbound freight allocation:** Long stock and sheet goods. Unquoted.
- **Machine wear and shop consumables:** Drill bits, blades, jig wear.

Tube packing at 100 carriers: 319 bars of .065 wall and 341 bars of .125 wall. One carrier needs 4 and 4 whole bars.

## Cover and soft goods detail

| Material line | One carrier | 100-carrier allocation | Purchased for 100 |
| --- | ---: | ---: | --- |
| Shell: roof, walls, header and gussets | $143.70 | $123.11 | 514 whole linear yards |
| Mesh: three windows and the rear vent | $53.85 | $28.90 | 161 whole linear yards |
| Clear storm panels | $89.35 | $15.19 | 17 10-yard rolls |
| Floor tub liner and threshold flap | $19.92 | $14.94 | 150 whole linear yards |
| Reflective roof liner | $18.50 | $12.77 | 138 whole linear yards |
| Two floor pad halves | $31.50 | $31.50 | 100 39 x 51 inch sheets |
| Ramp traction surface | $90.95 | $45.48 | 50 27 x 94 inch sheets |
| Six storm-panel zippers | $18.00 | $18.00 | 300 5-foot chain pieces |
| Six locking sliders | $22.50 | $13.50 | 120 packs of 5 |
| Hook tape | $21.00 | $15.12 | 216 10-foot pieces |
| Loop tape | $21.00 | $15.12 | 216 10-foot pieces |
| Seam tape | $26.01 | $23.33 | 807 meters |
| Reflective trim | $5.90 | $5.90 | 200 2.2-yard packs |
| Roof hem shock cord | $5.20 | $5.05 | 485 yards |
| Four stainless D-rings | $6.20 | $6.20 | 400 each |
| Tether, grab loop, ties and wrist strap | $14.80 | $12.39 | 16 120-foot rolls |
| Thread allowance | $15.95 | $2.72 | 17 cones |
| Reject reserve, 10% | $60.44 | $38.93 | |
| Sewing labor at $30/h | $300.00 | $120.00 | 600 min one-off, 240 min batch, assumed |
| Textile freight | $65.00 | $9.00 | Unquoted |
| **Total** | **$1,029.77** | **$557.15** | |

Material prices are the listed single-unit prices in [the materials sheet](../product/rover-materials.md). No quantity break is assumed even where a supplier lists one.

## What was and was not observed

- [6061-T6 square tube 20737, 1 x .065 inch](https://www.onlinemetals.com/en/buy/aluminum/1-x-0-065-aluminum-square-tube-6061-t6-extruded/pid/20737): **$60.03**, one 144 inch bar. Observed 2026-11-08 at $60.03. The page blocked a recheck on 2026-11-11. Cabin tubes only.
- [Burley Bark Ranger XL at Tree Fort Bikes](https://www.treefortbikes.com/Burley-Bark-Ranger-XL-Pet-Bike-Trailer): **$729.95**, one complete trailer, reference only. Observed $729.95. A bike trailer with a stroller kit, 100 lb stated capacity. A market reference, never a Rover cost input.
- [Burley Bark Ranger XL Ski Bundle](https://burley.com/products/bark-ranger-xl-ski-bundle): **$900.91**, one bundle, reference only. Observed $900.91 sale price. Source of the stated 36.2 x 22.4 x 29.9 inch interior, 33 lb weight and 9 inch step-up.

- Chassis tube, 1 x 1 x .125 inch 6061-T6: $100 per 144 inch bar is an allowance scaled from the observed .065 wall bar by metal mass. No fetched price.
- Wheels: $60 each is an allowance. Search results showed 20 inch spoked cart wheels at $54.95 to $62.99 with 3/4 inch bores and an 88 lb tire rating. No 5/8 inch bore 20 inch pneumatic wheel with a suitable rating was found, so the wheel is an open selection, not a candidate.
- Marine plywood, 12 mm, 4 x 8 ft: $125 per sheet is an allowance from an unverified search result. BS1088 okoume results ran $209 to $278.
- Stainless hardware: $0.99 per sleeved joint in a batch covers an 18-8 bolt, locknut, two washers and a cut steel sleeve. Search results showed about $0.36 per bolt and $0.26 per nut; neither page was fetched.
- Hinge, latches, brake set, leveling feet, grip, rivet nuts, ridge pole and bedding tape are allowances with no supplier page behind them.

## What would bring the cost down

1. Joints. 152 sleeved stainless joints and the labor to drill for them are the largest controllable lines. Welded or riveted sub-frames, or purpose-made corner fittings, remove most of both and several kilograms.
2. Panels. Plywood is cheap per sheet but heavy. A ribbed aluminum or composite deck changes mass more than cost.
3. Cover. One shell fabric everywhere is simple and expensive. Mesh already replaces much of the wall area; a lighter wall fabric below the windows would cut more.
4. Wheels and brake. Both are open selections and the allowances may be low for parts with a real rating.

Selling-cost lines for the provisional price, per carrier at 100: payment fee $11.87, returns reserve $19.95, support $15.00, acquisition $35.00. Contribution before fixed overhead: -$1,720.75.

Rebuild with `./buddy design:rover`. Inspect at https://buddywheels.org/design-studio-rover.
