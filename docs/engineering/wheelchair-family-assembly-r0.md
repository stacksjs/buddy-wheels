# L, M, S and XS bench assembly r0

**Not for an animal.** These are separately parameterized unloaded rigs. They do not inherit a capacity, fit range, supplier shock selection or test result from XL. Use the same sequence illustrated in [the XL traveler](xl-assembly-r0.md), substituting your family's parts, hardware and dimensions throughout. Do not transfer XL hole sizes, spacers or tube cut lengths by eye.

Each family directory under `designs/wheelchair/r0/` contains its `bom.csv`, `tube-drilling.csv`, `parameters.json`, `kinematics.json`, `model.scad`, `stl/`, `dxf/` and assembly image. Print quantities are in its BOM. The three `FIT_CHECK_ONLY_` types are metal structural parts in the actual architecture. `shock_dummy.stl` is an unloaded rigid eye-distance gauge, not a suspension.

| Dimension, mm | L | M | S | XS |
| --- | ---: | ---: | ---: | ---: |
| Side rail length | 600 | 460 | 340 | 260 |
| Outer lower upright cut length | 220 | 125 | 75 | 75 |
| Inner upper upright cut length | 180 | 150 | 120 | 120 |
| Each rear bridge tube cut length | 220.5 | 180.6 | 133 | 100.8 |
| Rail center height | 500 | 380 | 260 | 220 |
| Rail center spacing | 340 | 280 | 210 | 160 |
| Fixed cheek clear gap | 48 | 40 | 30 | 20 |
| Arm cheek clear gap | 20 | 16 | 12 | 10 |
| Frame bolt diameter | 6 | 5 | 4 | 3 |
| Tube sleeve-bore diameter | 8.2 | 7.2 | 6.2 | 5.2 |
| Primary pivot diameter | 10 | 8 | 8 | 6 |
| Wheel axle diameter | 12 | 10 | 8 | 6 |
| Neutral shock eyes | 155 | 130 | 92 | 70 |
| Matched shock radii A/B/C | 65/85/105 | 55/70/85 | 38/50/62 | 25/32/40 |

1. Inspect and label the empty-rig parts. Follow the printing guide for coupons and 1:1 scale. Use family-specific metal DXFs for fabrication review. Select and verify the supplier interfaces before any loaded test.
2. Join side rails and upper uprights using paired metal corner cheeks. The upright stops at the underside of the rail. Use crush sleeves at tube bolts and the BOM's small-tube cheek spacers. Corner hole pitch is 30 mm for L/M and 20 mm for S/XS.
3. Place the telescoping rear bridge at X=60 between the rail inner faces. Join its ends with paired corner cheeks pointing inward/forward. Install its separate two index bolts/sleeves at the nominal width. Verify squareness.
4. Install the lower uprights with their lower end 25 mm above the wheel pivot. Install the two height index bolts and sleeves per side using the tube schedule. Do not drill extra rows to claim an untested adjustment range.
5. Mount paired fixed suspension cheeks with metal spacers at the lower upright. Fit bushings and paired arm cheeks around the retained main pivot. Install separate retained stop and neutral-lock pins with their spacers. Confirm the arms sit horizontally in the locked datum.
6. Fit the family-specific rigid shock dummy to check neutral geometry, or an independently approved purchased shock. Both eyes must use the same A/B/C radius. The compact XS/S envelopes are unresolved procurement requirements; no specific low-force shock was verified. Do not substitute a larger stiff shock and assume a smaller dog can move it.
7. Install the exact axle, spacer and wheel stack, with positive retention. Check wheel rotation and static tire clearance. Add nonstructural protection only where it does not impede inspection or motion.
8. On the independently supported empty rig, account for all hardware and sweep the nominal -3/+6 degree range. Check actual shock limits, arm/tube/guard/tire clearance and stop engagement for each setting. Record measurements and problems. Stop before ballast pending approved drawings, fastener procedures and a written test protocol.

The bench frame intentionally has no qualified harness anchors or complete accessible-motion guarding. The missing softgoods/anchor and pinch-protection work must be closed before any supervised fitting. Low-slung dogs and very small dogs may need a different architecture to meet mass, height, toe-clearance and suspension-friction requirements. These four rigs are starting geometries, not a universal answer for every dog in each catalog band.
