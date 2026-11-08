# Wheelchair r0 fabrication drawing notes

Units mm, revision r0, November 8, 2026. **Engineering review drawings for an unloaded bench rig. No capacity or manufacturing release.** Use the family parameters, `bom.csv`, `tube-drilling.csv`, DXFs and source together. A DXF alone is not a complete manufacturing instruction.

## Datums and geometry

Global X points rearward. Global Z points up from the ground. Y is transverse. At neutral, each suspension pivot is X=0, Z=wheel OD/2. Uprights are centered at Y=+/- rail-center width/2. Rails run from X=-(rail length-80) to X=80. Rear bridge centerline is X=60, at rail-center height. Tires are generic width/diameter envelopes, not supplier wheel solids.

Plate DXF coordinates use local X rearward and local Y up, mapped to X/Z in the assembly. The pivot center is `(0,0)`. Do not add kerf compensation to the source; the fabricator sets it in their controlled cutting process. Finish-critical holes must be drilled/reamed using selected hardware tolerances. Generic +0.2 mm or +0.4 mm modeled clearances are layout allowances, not approved fit specifications.

| XL plate | Qty | Thickness | Locators in local XY |
| --- | ---: | ---: | --- |
| Fixed cheek M06 | 4 | 6 | Pivot `(0,0)` diameter 10.2; upright bolts `(0,35)` and `(0,65)` diameter 6.4; shock upper eyes `(70,155)`, `(90,155)`, `(110,155)` diameter 8.2; neutral lock `(50,0)` diameter 6.2; stop slot radius 30, centerline angles -3 to +6 degrees, width 6.4 |
| Arm cheek M07 | 4 | 6 | Pivot `(0,0)` nominal diameter 14 for bronze bush; axle `(180,0)` diameter 12.2; shock lower eyes `(70,0)`, `(90,0)`, `(110,0)` diameter 8.2; stop `(30,0)` diameter 6.2; lock `(50,0)` diameter 6.2 |
| Corner cheek M08 | 8 | 6 | Four diameter 6.4 holes: `(-60,0)`, `(-30,0)`, `(0,-30)`, `(0,-60)` |

Corners use four external planar cheeks per upper upright pair and four at the rear bridge ends. They are not right-angle bent brackets. In the side-rail/upright joint they lie in X/Z planes; at the rear bridge ends they lie in X/Y planes. Do not mirror a source profile in a slicer; orient identical fabricated pieces in the assembly as shown.

The stop slot is made from overlapping circles, sampled every 0.5 degree. Slot-end clearance means the physical stop angles differ from the nominal -3/+6 centerline values. Do not use it as a precise travel calibration. A final design needs tolerance, wear, end-radius, impact and bearing-stress review; a narrow slot ligament passing a digital check is not proof of strength.

## XL cut list

Candidate tube/plate material is 6061-T6 aluminum, subject to the engineer's load, fatigue, corrosion, hole-bearing and finish review. Material certificates and actual section tolerances are needed before fabrication for loaded tests. No welding process is specified.

| ID | Qty | Section | Cut length |
| --- | ---: | --- | ---: |
| M01 | 2 | 25 square x2 wall | 680 |
| M02 | 2 | 25 square x2 wall | 315 |
| M03 | 2 | 20 square x2 wall | 180 |
| M04 | 1 | 25 square x2 wall | 262.5 |
| M05 | 1 | 20 square x2 wall | 262.5 |

The lower upright begins 25 mm above the pivot so the moving arm does not collide with its lower end. Its top is 80 mm below rail center. The upper upright terminates at the rail's underside, 12.5 mm below center; it must not intersect the side rail. Nominal upper-tube overlap is 112.5 mm. The bridge terminates at the inner side-rail faces, with 150 mm nominal overlap between its two tubes. Shoulder and height datums in these notes take priority over a visual guess from a PNG.

Tube hole coordinates for all five families are generated in each `tube-drilling.csv`. Drill all tube walls at the specified larger sleeve-bore diameter, not the smaller cheek-plate bolt bore. For XL, tube holes are 8.2 mm for OD8/ID6.2 sleeves; cheek bolt holes are 6.4 mm. Sleeves are nominally flush to the tube outer faces and take bolt compression. The index sleeves pass through both nested sections and must be removed before any adjustment. Actual fits, local bearing strength, sleeve-wall capacity and end condition require review.

There are 20 XL sleeves 25 mm long and 6 sleeves 20 mm long. Twelve 2.5 mm small-tube cheek spacers fill the gaps at upper upright and right-bridge corner bolts. Eight 11.5 mm cheek-to-upright spacers fill the gap at the fixed suspension cheeks. Do not substitute printed compression spacers.

The r0 tubes have only the nominal index-hole pair. Extra closely spaced adjustment holes have **not** been authorized. To change height or width, create a new configured iteration and regenerate/review its cut/hole pattern. In an assembled rig, telescoping alone is not a lock. Two retained through-bolts and their removable metal sleeves secure each indexed joint. Adjustment ranges are not approved merely because the tubes can slide.

## Pins, spacers and finish drawing completion

Paired XL fixed cheeks have 48 mm clear internal distance and 60 mm outside-to-outside. Arm cheeks have 20 mm internal distance and 32 mm outside-to-outside. Nominal pivot bushes have 10 mm ID,14 mm OD and 6 mm length, one per arm cheek. The center pivot spacer is 20 mm long; the two outer pivot spacers are 8 mm each. Upper shock eye spacers are 14 mm each for a nominal 20 mm eye. Supplier bushing width, running clearance and face relief still require a finish drawing; do not force a tight or misaligned eye between plates.

All pins are headed metal shafts with a positive cross-hole/cotter retainer at the opposite end. They are not threaded rods through bearings. Source diameter, grip stack and quantity are in the BOM. The nominal stack lengths are:

| XL pin | Qty | Diameter | Metal/bearing stack between head and end washer |
| --- | ---: | ---: | ---: |
| Main pivot S02 | 2 | 10 | 60 |
| Travel stop S06 | 2 | 6 | 60 |
| Neutral lock S07 | 2 | 6 | 60 |
| Upper shock S11 | 2 | 8 | 60 |
| Lower shock S12 | 2 | 8 | 32 |
| Wheel axle W02 | 2 | 12 | 106 |

XL wheel axle stack:6 mm inner arm +20 mm center spacer +6 mm outer arm +34 mm outboard spacer +40 mm wheel hub =106 mm. The wheel center is 70 mm outward from the upright centerline. The bearing inner spacer inside the purchased hub must prevent retention from pinching the bearings. Supplier wheel dimensions may change the entire axle stack.

Nominal shaft retention drawing rule: direct head bearing against the stack, one 1.5 mm end washer,0.5 mm axial float, and a2 mm cross-hole. Locate the cross-hole center at `stack + 1.5 + 0.5 + 2/2`, or `stack+3`. For XL main/stop/lock/upper pins this is 63 mm from underhead; lower shock 35 mm; wheel 109 mm. Leave at least 3 mm shaft beyond cross-hole center in this layout. XS uses a proposed 1 mm cross-hole instead, requiring separate pin-end and cotter review. The BOM's retention-span values refer to the washer's inner face, not the cross-hole center.

Head diameter/thickness, material/heat treatment, surface finish, bushing running/press fits, shaft diameter tolerances, cotter form, washer grade and actual float are **not approved by r0**. The machine shop/engineer must close these finish-drawing details before machining for a load test. No general tolerance block, torque schedule or load-bearing approval is implied. Plain CAD pins in PNGs are visual axes; they do not depict these retention details.

Critical unresolved checks include stop-pin bending/slot contact, cantilevered axle strength, upper cheek flexibility, telescope slip/bearing, frame racking, paired-arm alignment, pin fatigue, one-wheel failure and asymmetric roll. L/M/S/XS repeat the same checks using their own parts and hardware, rather than inheriting XL approval.
