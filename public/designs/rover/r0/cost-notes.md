# Buddy Rover r0 cost study

Checked 2026-11-11, USD, integer cents, native Bun arithmetic. Configuration rover-r0-l1200-w700-h950-r900-a520-g980-hub82.55-path. This prices the r0 bench architecture. It is not a supplier quote, a production cost or a selling price, and nothing has been bought.

## Result

At 100 carriers the modeled landed manufacturing cost is **$1,527.23 each** at listed prices. A single build at retail quantities is **$2,674.25**. The first count of this design, on November 11, was $2,037.93 and $3,254.89, with 20 inch wheels and the original cover.

The catalog's provisional Run price is $399.00, so the 30% gross-margin gate allows $279.30 and this design still misses it by $1,247.93. To pass the same gate at this cost the price would have to be about $2,182.00. The catalog price is unchanged pending the owner's decision.

If the tube is bought by weight, the picture changes. $489.53 of the total is 28.2 lb of aluminum tube priced as cut-to-order retail bars, close to five dollars a foot. A 100-carrier batch is about 1.4 tons of one extrusion and would be bought from a mill or distributor. At an assumed $4.00 per pound with 8% scrap the tube line falls to $121.83 and the total to **$1,159.53**, which a price near $1,657.00 would carry. That rate is an assumption with no quote behind it. Getting that quote is the single most valuable next step on cost.

For scale, the reference trailer sold for $729.95 at one retailer on the check date, with a 100 lb stated capacity and a 36.2 x 22.4 x 29.9 inch interior. Rover's cabin is about twice that volume. Rover does not reach that price in either scenario.

## What changed since the first count

| Change | Effect at 100 carriers | Trade-off |
| --- | ---: | --- |
| Wall fabric: a $6.50 PVC-coated 600 denier polyester under the roof overhang, with the solution-dyed fabric kept for the roof | about -$85 | Walls will fade and carry no stated UV rating |
| Hook and loop instead of six zippers; roof liner made optional; corner seams lapped, not taped | about -$55 | Storm panels are slower to close; less sun insulation unless the liner is added |
| Listed quantity tiers used where the batch reaches them: wall fabric, liner, clear panel rolls | about -$20 | None. They are published prices |
| Sewing time 240 to 200 minutes | -$20.00 | An assumption either way |
| Zinc-plated grade 5 hardware for Run; stainless becomes the salt-use upgrade | about -$50 | Add $50.16 for stainless before beach use |
| Exterior BC plywood instead of marine | -$80.00 | Marine plywood returns for salt use. Price is from an unverified search result |
| Intermediate cross members and ramp ribs in thin-wall tube | about -$40 | Members checked by hand arithmetic only |
| One gusset instead of two at the eight corner-post joints | -$12.80 | Corner posts carry the cover, not the dog |
| Assembly time 6 to 5.5 hours | -$12.50 | An assumption either way |
| 13 x 4 inch path wheels at an observed $14.99 instead of a $60 allowance for 20 inch wheels | -$135.03 | A garden-cart wheel for walking pace, heavier to push at a run. The 20 inch wheel stays as an option |

## Where the money goes

| Line | One carrier | 100-carrier allocation | Evidence |
| --- | ---: | ---: | --- |
| Aluminum tube, whole 12-foot bars with kerf | $600.15 | $489.53 | .065 wall observed, .125 wall allowance |
| 28 corner and 12 tee gussets, laser cut 1/8 inch 6061 | $180.00 | $64.00 | RFQ |
| 8 stainless axle hangers | $72.00 | $32.00 | RFQ |
| Three 13 x 4 inch pneumatic path wheels | $44.97 | $44.97 | Observed 2026-11-08 |
| Three stock-shaft axles, sleeves, spacers, washers and cotters | $40.00 | $18.00 | RFQ |
| 152 sleeved bolted joints | $136.80 | $100.32 | Allowance |
| Floor and ramp panels, sealed 15/32 inch exterior plywood | $70.00 | $57.00 | Allowance |
| Hinge, two latches, safety strap hardware and stand feet | $65.00 | $46.00 | Allowance |
| Brake set, grip, tip-stop feet and floor fasteners | $85.00 | $62.00 | Allowance |
| Printed service parts and fixtures | $27.00 | $23.00 | Computed volume + allowance |
| Cutting, drilling, deburring and assembly labor | $375.00 | $137.50 | RFQ |
| Per-carrier inspection | $25.00 | $12.00 | RFQ |
| Packaging | $35.00 | $25.00 | RFQ |
| Inbound freight allocation | $90.00 | $30.00 | RFQ |
| Machine wear and shop consumables | $10.00 | $6.00 | RFQ |
| Weather cover, floor set and ramp surface | $818.33 | $379.91 | Listed materials + assumed sewing |
| **Landed manufacturing** | **$2,674.25** | **$1,527.23** | Mostly unquoted |

- **28 corner and 12 tee gussets, laser cut 1/8 inch 6061:** Two repeated aluminum profiles. Includes material, cutting and deburring.
- **8 stainless axle hangers:** One 304 stainless profile for all three wheels. Bore finishing after drawing review.
- **Three 13 x 4 inch pneumatic path wheels:** 3 x $14.99, no bulk discount assumed. Hub length, bearing fit and suitability are unverified.
- **Three stock-shaft axles, sleeves, spacers, washers and cotters:** Plain 5/8 inch shaft cut and cross-drilled. No threaded journals.
- **152 sleeved bolted joints:** Zinc-plated grade 5 for the Run configuration. It follows directly from a bolted frame with no welding.
- **Floor and ramp panels, sealed 15/32 inch exterior plywood:** 1 sheet per carrier plus edge sealing. Offcuts are charged.
- **Hinge, two latches, safety strap hardware and stand feet:** Stainless continuous hinge, two draw latches, two leveling feet with tube inserts, carriage bolts.
- **Brake set, grip, tip-stop feet and floor fasteners:** Lever, cable and two wheel brakes are unselected. The allowance is not a brake design.
- **Printed service parts and fixtures:** About 1.3 liters of solid part volume, most of it the three ramp toes. Priced as consumed filament with a reject reserve, not a printer.
- **Cutting, drilling, deburring and assembly labor:** Batch: 5.5 h at $25/h. One-off: 15 h. Roughly 300 tube-wall holes per carrier. Timing assumptions, not observed.
- **Per-carrier inspection:** Does not replace engineering qualification.
- **Packaging:** Large flat-pack carton set. Outbound freight is separate.
- **Inbound freight allocation:** Long stock and sheet goods. Unquoted.
- **Machine wear and shop consumables:** Drill bits, blades, jig wear.

Tube packing at 100 carriers: 419 bars of .065 wall and 238 bars of .125 wall. One carrier needs 5 and 3 whole bars.

## Cover and soft goods detail

| Material line | One carrier | 100-carrier allocation | Purchased for 100 |
| --- | ---: | ---: | --- |
| Roof shell, one piece | $30.56 | $22.47 | 147 whole linear yards |
| Wall shell: sides, front, header and gussets | $26.00 | $16.27 | 368 whole linear yards |
| Mesh: three windows and the rear vent | $53.85 | $28.90 | 161 whole linear yards |
| Clear storm panels | $89.35 | $13.35 | 170 yards, bought as 60-yard and 10-yard rolls |
| Floor tub liner and threshold flap | $19.92 | $11.66 | 150 whole linear yards |
| Two floor pad halves | $31.50 | $31.50 | 100 39 x 51 inch sheets |
| Ramp traction surface | $90.95 | $45.48 | 50 27 x 94 inch sheets |
| Hook tape | $17.38 | $16.56 | 1048 yards |
| Loop tape | $17.38 | $16.56 | 1048 yards |
| Roof seam tape | $14.45 | $11.59 | 401 meters |
| Reflective trim | $5.90 | $5.90 | 200 2.2-yard packs |
| Roof hem shock cord | $5.20 | $5.05 | 485 yards |
| Four stainless D-rings | $6.20 | $6.20 | 400 each |
| Tether, grab loop, ties and wrist strap | $14.80 | $12.39 | 16 120-foot rolls |
| Thread allowance | $15.95 | $2.40 | 15 cones |
| Reject reserve, 10% | $43.94 | $24.63 | |
| Sewing labor at $30/h | $270.00 | $100.00 | 540 min one-off, 200 min batch, assumed |
| Textile freight | $65.00 | $9.00 | Unquoted |
| **Total** | **$818.33** | **$379.91** | |

Material prices are the listed prices in [the materials sheet](../product/rover-materials.md). A listed quantity tier is used only where the 100-carrier purchase actually reaches it; no unlisted discount is assumed.

## What was and was not observed

- [6061-T6 square tube 20737, 1 x .065 inch](https://www.onlinemetals.com/en/buy/aluminum/1-x-0-065-aluminum-square-tube-6061-t6-extruded/pid/20737): **$60.03**, one 144 inch bar. Observed 2026-11-08 at $60.03. The page blocked a recheck on 2026-11-11. Cabin tubes only.
- [HAUL-MASTER 67467 pneumatic wheel, 13 x 4 inch](https://www.harborfreight.com/13-inch-x-4-inch-pneumatic-tire-67467.html): **$14.99**, one complete wheel. Observed 2026-11-08 at $14.99; the page refused a recheck on 2026-11-12. 5/8 inch bore, 4.7 lb each, supplier wheel rating 300 lb. That rating does not rate the carrier, and the hub length is unconfirmed.
- [Burley Bark Ranger XL at Tree Fort Bikes](https://www.treefortbikes.com/Burley-Bark-Ranger-XL-Pet-Bike-Trailer): **$729.95**, one complete trailer, reference only. Observed $729.95. A bike trailer with a stroller kit, 100 lb stated capacity. A market reference, never a Rover cost input.
- [Burley Bark Ranger XL Ski Bundle](https://burley.com/products/bark-ranger-xl-ski-bundle): **$900.91**, one bundle, reference only. Observed $900.91 sale price. Source of the stated 36.2 x 22.4 x 29.9 inch interior, 33 lb weight and 9 inch step-up.

- Chassis tube, 1 x 1 x .125 inch 6061-T6: $100 per 144 inch bar is an allowance scaled from the observed .065 wall bar by metal mass. No fetched price.
- Run wheels: $60 each is an allowance. Search results showed 20 inch spoked cart wheels at $54.95 to $62.99 with 3/4 inch bores and an 88 lb tire rating. No 5/8 inch bore 20 inch pneumatic wheel with a suitable rating was found, so the 20 inch wheel is an open selection. The 13 x 4 inch path wheel is the priced default.
- Plywood: $45 per 4 x 8 ft sheet of 15/32 inch BC sanded exterior pine is an allowance from an unverified search result near $40.35. Marine plywood results ran $125 to $278 and are the Coast upgrade.
- Hardware: $0.66 per sleeved joint in a batch covers a zinc-plated grade 5 bolt, locknut, two washers and a cut steel sleeve, the same allowance the XL r1 study uses. 18-8 stainless for salt use adds about $0.33 per joint from unverified search results.
- Mill-quantity tube: the second total prices tube by weight at $4.00 per pound plus 8% scrap. That rate is an assumption with no quote behind it. The listed-price total stays the headline until a mill or distributor quote exists.
- Hinge, latches, brake set, leveling feet, grip, rivet nuts, ridge pole and bedding tape are allowances with no supplier page behind them.

## What would bring it down further

1. A tube quote. See the mill-quantity paragraph above. Nothing else moves the total as much.
2. Joints. 152 sleeved bolted joints and the labor to drill for them come to about $237.82. Welded or riveted sub-frames, or purpose-made corner fittings, remove most of both and several kilograms. That needs a fabricator's quote.
3. Wheels and brake. The path wheel is an observed $14.99 each. The 20 inch run wheel remains an unverified $60 allowance and adds $135.03. No brake is selected.
4. The cover is now $379.91. The ramp surface, floor pad and mesh are the largest material lines left; sewing is $100.00.

Selling-cost lines for the provisional price, per carrier at 100: payment fee $11.87, returns reserve $19.95, support $15.00, acquisition $35.00. Contribution before fixed overhead: -$1,210.05.

Rebuild with `./buddy design:rover`. Inspect at https://buddywheels.org/design-studio-rover.
