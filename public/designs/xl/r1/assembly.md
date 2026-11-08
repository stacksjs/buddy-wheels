# XL r1 standard-parts bench assembly

Configuration xl-r1-h620-w400-l680-hub82.55. All dimensions mm. RIGID BASE. NOT FOR ANIMAL USE. Buddy is owner-reported 140 lb; his measurements, support suitability and safe working load are not established. Do not mix r0 files with r1.

## What changed

Five cut-to-fit 1 x 1 x .065 inch 6061-T6 tube segments, eight identical steel T gussets and four axle patches replace the telescoping/shock platform. No trailing arms, coilover mounts, turned pins or threaded bearing journals. Height, width and rail length change the manufacturing cuts; this r1 frame is NOT field-telescoping. The rear bridge is moved to X=120 to keep its horizontal gussets clear of the upright joint plates. There is no independent suspension. Tire compliance is not a suspension setting.

## Your configuration

| Item | Value |
| --- | ---: |
| Rail center height | 620 |
| Rail center spacing | 400 |
| Side rail cut, qty 2 | 680 |
| Upright cut, qty 2 | 487.2 |
| Rear bridge cut, qty 1 | 374.6 |
| Provisional wheel hub through-length | 82.55 |
| Axle cut, qty 2 | 162.4 |
| Retained stack between outer washer faces | 142.7 |
| Cotter cross-hole centers from each axle end | 8 |
| Axial end float, total | 0.5 |
| Tire outer envelope | 666.7 |
| Inboard shaft-end clearance, before full guards | 345.55 |
| Static nominal tire-to-patch gap | 15.875 |

Hub through-length is NOT confirmed by the supplier page. Measure both actual wheel hubs, bearing contact faces and washers. Reconfigure and review the stack before cutting/drilling shafts. The 0.5 mm float and 3.2 mm cotter holes are nominal drawing proposals, not approved fits. No budget price or supplier wheel rating qualifies the assembly.

The included assembly.png is a baseline layout reference, not a dimensioned drawing of this configured kit. Use the configured CAD, table, BOM and drilling schedule for geometry.

## Parts and printing

Use bom.csv and drilling.csv. Main structure is metal. Print six rounded end caps, two optional empty-rig axle covers, one layout guide and one clearance coupon. Caps and covers do not retain bolts, shafts or load. Structural STL files prefixed FIT_CHECK_ONLY are plastic layout copies; fabricate their steel equivalents from metal/*.dxf after drawing review. No printed axle, primary joint, spring or weight-bearing sling is supplied.

Use PETG for unloaded service/fixture trials. Start with a 0.4 mm nozzle, 0.2 mm layers, four walls and 30% infill as an unqualified coupon starting profile, then measure the actual print. Record filament, orientation, measured fit, grams, hours and failures. Print caps flange-down; guides/coupons flat. STL metal copies lie flat and carry no load. All meshes fit 220 x 220 x 100 mm. Do not scale interfaces to fit a printer. Inspect a single coupon/cap before batching. Full guarding against fur, toes and snagging is still outstanding.

## Stock and preparation

1. Confirm 6061-T6 grade, .065 inch wall and square corner geometry. No EMT, PVC or unverified alloy substitution. Native stock nesting uses full 144 inch bars, 3 mm kerf per cut, and all five cuts. Purchase to the actual configuration, not a guessed fractional bar.
2. Deburr all tube cuts. Review the two metal DXF profiles: eight T gussets and four axle patches, all 3.175 mm A36 steel. Apply a reviewed steel corrosion finish with all joint contact and bearing surfaces protected as required. The aluminum is uncoated mill finish in both model and cost plan. Green is used for nonstructural prints; no aluminum coating is charged.
3. Use drilling.csv for cut-end datums and CAD for hole axes. Small tube bores are nominal 9.725 for .375 OD steel sleeves. Plate bolt holes are 6.75 for 1/4 inch bolts. Axle sleeve bores are nominal 19.25. Final fits/tolerances, edge strength and torque procedures require approval; no guessed torque is provided.
4. Cut 20 small sleeves from .375 OD x .049 wall 4130 stock and four large sleeves/spacers from .75 OD x .058 wall stock, each 25.4 long. Two large sleeves go through uprights; two are wheel spacers. Sleeve ends must be square and flush to the actual tube faces before clamping; supplier length/material/finish tolerances remain open. No printed compression stack.

## Empty-frame assembly

5. Coordinates: X rearward, Y across, Z upward. Rail centers at Y=+/-200, Z=620; rail ends X=-480 and X=200. Uprights centered X=0, bottom Z=120.1 and top Z=607.3. Axle center Z=165.1. These are bench datums, not Buddy's groin height. Shaft ends project inward below the rails; their nominal gap is 345.55 before guards. This is narrower than the rail clearance and needs a separate leg/fur/pinch assessment.
6. Pair two T gussets around each upright/rail joint. Rail holes X=-30/+30 at Z=620; upright holes at Z=585/560. Install four sleeved bolt sets per side, eight total. Use 1/4-20 x2 inch grade 5 bolts, two washers and one new locknut each. Verify actual grip, sleeve length and full engagement before an approved tightening sequence.
7. Place bridge between rail inner faces at X=120, Z=620. Pair T gussets above/below both bridge ends, stems pointing inward. Rail holes X=90/150; bridge holes 22.3/47.3 from each bridge cut end. Install eight more sleeved bolt sets. Keep these plates separate from the upright gussets; do not shift the bridge back to the r0 datum.
8. Pair axle patches on both faces of each upright, centered X=0,Z=165.1. Install one large steel axle sleeve through the center and two small sleeved retention bolts per upright at Z=140.1/190.1. This uses the final four joint bolt sets. All 20 bolts need their metal sleeves.

## Wheel and positive retention stack

9. Review straightness, actual diameter, material and bearing fits of unkeyed precision steel shaft stock. Cut two axles to 162.4. Never substitute fully threaded rod or a partially threaded bolt without a verified continuous smooth journal and reviewed retention drawing.
10. From the inboard end: cotter, 1.5 mm thrust washer, inner axle patch, sleeved upright, outer patch,25.4 mm steel wheel spacer, actual 82.55 mm hub,1.5 mm washer, outer cotter. Cross-hole centers 8 mm from each shaft end. Use the full stock stack formula, total 0.5 end float and physical measurements; do not clamp unsupported bearing races together.
11. Measure actual tire width, hub offset, runout and contact surfaces. Nominal clearance 15.875 is not a tolerance or loaded-deflection approval. Check both sides. Supplier 67467 is a candidate garden wheel, 4.7 lb each; a pair is 9.4 lb before any frame. Evaluate rolling resistance, weight and handling rather than assuming all-terrain suitability.
12. Cotters provide positive end retention. Optional printed covers do not retain the shaft and are not installed complete fur guards. Inspect retainer end ligaments, snag/pinch paths, thrust contact and shaft/bush wear. Establish the replacement inspection interval during testing.

## Support and release gates

13. T01 is the complete rear support/front restraint set in the BOM and cost model. It requires an OEM pattern, rated webbing/hardware, sewing and anchor design, correct anatomy and professional fitting. The intended load path is textile loops directly around metal rails, with an engineered anti-slide arrangement. There is no approved sewing pattern or anchor implementation in this kit. Do not improvise a printed saddle or hang Buddy in an empty frame.
14. Before any ballast or animal: approve the joint/axle/sleeve/retainer drawings, fatigue and corrosion review, loaded wheel clearances, complete fur/toe guards, support anchors and a written test protocol. Then perform qualified strength, stability, tip, fatigue, terrain, harness-slip and failure tests with retained results. Digital mesh checks are not physical validation.
15. Adjustable independent suspension remains in the separate r0 research studio. It is not supplied, priced or approved as part of this r1 base, and tire pressure is not a prescribed rehabilitation setting.

See cost-model.json and cost-notes.md for explicit observed prices versus unquoted production allowances. A successful export does not establish a safe operating capacity or a verified manufacturing price.
