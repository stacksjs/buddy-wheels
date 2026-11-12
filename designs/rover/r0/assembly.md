# Buddy Rover r0 bench assembly

Configuration rover-r0-l1200-w700-h950-r900-a520-g980-hub75. All dimensions mm. BENCH DESIGN. NOT FOR ANIMAL USE. No payload, speed, distance, slope or surface rating exists. Buddy is owner-reported 140 lb; his measurements and suitability for a carrier are not established.

## What this revision is

A large cut-to-fit carrier built from two wall thicknesses of 1 inch 6061-T6 square tube, three repeated flat metal profiles, plywood panels and printed service parts. The tailgate is the ramp: it folds down to a 8.9 degree walk-in with no step, and stands on its own two feet so the dog's weight on the threshold goes to the ground instead of tipping the carrier. Three matching 20 inch wheels. Push handle with a fixed front wheel.

Coordinates: X forward, Y across, Z up. Origin on the ground under the rear axle.

## Your configuration

| Item | Value |
| --- | ---: |
| Clear cabin length between end posts | 1200 (47.2 in) |
| Clear cabin width between side rails | 700 (27.6 in) |
| Clear cabin height, deck to top rail | 950 (37.4 in) |
| Deck height above ground | 151.9 (6.0 in) |
| Ramp length and width | 900 x 688 |
| Ramp rise and incline | 139.9 rise, 8.9 degrees |
| Rear axle ahead of the tailgate plane | 520 |
| Wheelbase | 989.4 |
| Handle height | 980 (38.6 in) |
| Overall length, width over axle ends, height | 2168.8 x 955.25 x 1204 |
| Ground clearance under the base gussets | 108.125 |
| Assumed wheel hub through-length | 75 |
| Estimated empty mass, arithmetic only | 47.1 kg (104 lb) |

## Stated geometry beside the reference trailer

Burley Bark Ranger XL figures are the maker's published numbers, read 2026-11-11 at https://burley.com/products/bark-ranger-xl-ski-bundle. They describe that product only. Nothing about its capacity, testing or use transfers to Rover.

| Stated figure | Burley Bark Ranger XL | Rover r0, this configuration |
| --- | ---: | ---: |
| Interior length | 36.2 in | 47.2 in |
| Interior width | 22.4 in | 27.6 in |
| Interior height | 29.9 in | 37.4 in |
| Interior volume ratio | 1.0 | 2.01 |
| Entry | 9 in step-up at a tailgate | 8.9 degree ramp, no step |
| Weight | 33 lb | about 104 lb estimated |
| Capacity | 100 lb stated by its maker | none. Untested bench design |

Rover is much larger and much heavier. The mass is the price of a bolted frame and plywood panels and is the first thing a second revision should reduce.

## Planning statics, not test results

With a 72.6 kg (160 lb) planning mass centered in the cabin, its center sits 80 mm ahead of the rear axle. The front wheel then carries about 8% of that mass, and lifting the front wheel to steer takes roughly 101 N (23 lbf) down on the handle. A dog that stands at the tailgate moves the center behind the axle. The two tip-stop feet exist for that case and their setting and strength are unproven. A swiveling, lockable front wheel may be the right answer for walking pace and is not designed here.

## Cut list

| ID | Qty | Member | Stock | Cut |
| --- | ---: | --- | --- | ---: |
| C01 | 2 | Base side rail | .125 wall | 1250.8 |
| C02 | 5 | Base cross member | .125 wall | 700 |
| C03 | 2 | Axle post | .125 wall | 965.2 |
| C04 | 2 | Fork arm | .125 wall | 344 |
| C05 | 2 | Fork stub post | .125 wall | 167.3 |
| C06 | 2 | Ramp side curb rail | .125 wall | 900 |
| C07 | 2 | Ramp under rib | .125 wall | 688 |
| C08 | 2 | Ramp stand leg | .125 wall | 75.0748 |
| C09 | 4 | Corner post | .065 wall | 965.2 |
| C10 | 2 | Top side rail | .065 wall | 1250.8 |
| C11 | 3 | Top cross tube | .065 wall | 700 |
| C12 | 2 | Handle arm | .065 wall | 965.4 |
| C13 | 1 | Handle grip tube | .065 wall | 750.8 |

Total 12.28 m of .125 wall and 11.14 m of .065 wall. Base cross members sit at X = -532.7, -226.35, 95, 386.35, 692.7.

## Joint patterns

Every joint is a flat gusset with 1/4 inch bolts through steel crush sleeves. Hole centers are measured from the joint centerline, where two tube centerlines cross.

| Profile | Qty | Holes from the joint centerline | Where |
| --- | ---: | --- | --- |
| Corner gusset | 36 | Leg A 50 and 80. Leg B 35 and 65 | Post to rail both faces, rail to cross member, roof corners, handle grip, ramp legs |
| Tee gusset | 12 | Bar 30 each side. Stem 35 and 60 | Intermediate base cross members, mid roof bow, fork arms top and bottom |
| Axle hanger | 8 | Bar 30 each side. Stem 60, 105, 155. Axle bore at 130 | Both faces of each axle post and each fork stub |

Legs A and B alternate where two gussets meet on one tube, so bolts cross 15 mm apart and never share a station. Tube bores are 9.725 for the sleeves, plate holes 6.75, axle sleeve bores 19.25. All are nominal. Use the three printed drill guides for pilot centers and finish with metal tooling.

## Build order

1. Print the clearance coupon and measure it. Print one cap and one clip before batching.
2. Cut and deburr every tube. Mark each with its ID.
3. Base frame: two side rails, 5 cross members. Corner gussets under each corner, tee gussets under each intermediate member.
4. Axle posts at X = 0 with paired hangers. The hanger bar bolts to the rail, the stem to the post. Fit the 19.05 axle sleeve through post and both hangers.
5. Corner posts with paired corner gussets, leg A up the post.
6. Top rails, three top cross tubes, corner gussets on top, tee gussets at the mid bow.
7. Fork: two arms butt against the front cross member at Y = 54.875 each side, tee gussets above and below. Stub posts with paired hangers at the front axle, 989.4 ahead of the rear axle.
8. Floor panel on bedding tape, fastened to the frame.
9. Ramp: panel, two curb rails on top, two ribs underneath at 40 mm and mid length, stand legs on the hinge-end rib 60 mm in from each edge. Hinge leaves on the top faces of floor and ramp.
10. Handle arms on the outside of the rear and axle posts at Z = 980, one 3 inch bolt per post. Grip tube between the arm ends.
11. Wheels, washers and cotters. Rear stack between outer washer faces 122.45, front 144.5, each with 0.5 total end float.
12. Tip-stop feet, brake, latches, safety strap. Then the cover.

## The ramp

Lowered, the panel runs from the deck at 151.9 down to the ground over 900. The two stand feet under the hinge end touch the ground directly below the threshold. Set them on level ground so the hinge carries no bending. The walking width between the curb rails is 637.2. Three printed toes slide onto the ground edge and take the last 20 mm down to nothing.

Raised, the ramp is the tailgate. Two draw latches hold it to the rear posts and the safety strap is a second, independent hold. The stand legs then point backward about 110 mm at shin height. The handle reaches 380 mm behind the tailgate. Stride clearance has to be checked by a runner before this layout is accepted.

Each rear axle end stands 14.525 mm into the cabin, about 102 mm above the deck. Cover it and review it for fur, paws and hips.

## Printing

- Chassis tube cap, cap_heavy.stl, quantity 16. Closes 1/8 inch wall tube ends. End protection only.
- Cabin tube cap, cap_light.stl, quantity 8. Closes .065 inch wall tube ends. End protection only.
- Ramp threshold toe, ramp_toe.stl, quantity 3. Ground-supported bevel that removes the step at the ramp edge. It is not the ramp structure.
- Roof ridge saddle, ridge_saddle.stl, quantity 3. Holds the ridge pole above the frame so the roof sheds water. Carries fabric tension only.
- Cover rail clip, fabric_clip.stl, quantity 28. Snaps a cover hem onto a frame tube. No restraint or structural function.
- Brake cable clip, cable_clip.stl, quantity 6. Routes one brake cable housing along a tube. Not a brake anchor.
- Axle end cover, axle_cover.stl, quantity 6. Covers a shaft end and cotter. Never a shaft retainer or a complete fur guard.
- Drill guide, butt ends, guide_butt.stl, quantity 1. Pilot centers 22.3, 37.3, 52.3 and 67.3 mm from a cut end. Layout aid only.
- Drill guide, corner runs, guide_run.stl, quantity 1. Pilot centers 47.7, 62.7, 77.7 and 92.7 mm from a rail end. Layout aid only.
- Drill guide, tee pattern, guide_tee.stl, quantity 1. Pilot centers 30 mm each side of a scribed joint line. Layout aid only.
- Clearance coupon, coupon.stl, quantity 1. Calibrates the actual printer before any fit is trusted. Not part of the carrier.

Meshes are exported in print orientation at 1:1 in millimeters and fit a 220 x 220 x 100 mm envelope. Never scale one to fit. Use PETG for indoor fit trials and ASA for parts that will live in sun. Starting point only: 0.4 mm nozzle, 0.2 mm layers, four walls, 30% infill; five walls and 50% for the ramp toes, which carry paw load against the ground. Print clips on end so the snap flexes along the layers. The ramp toe slot is an 18 mm overhang and needs support or a slower bridge. Record filament, settings, measured fit, grams and failures.

Files prefixed FIT_CHECK_ONLY are plastic copies of metal parts for checking hole patterns. Cut the real ones from metal/*.dxf. No printed part here carries the dog, a wheel, the ramp hinge, a latch, a brake or a tether.

## Release gates

1. Buddy's measurements, lying length and standing height first, and a veterinary view on whether riding suits him.
2. Engineering review of the frame, the axle hangers, the ramp and its stand, the handle and the tip-stops, including steel-to-aluminum corrosion and stainless galling.
3. A real wheel with a known bore, hub length and rating, then the brake. Until both exist the running gear is a placeholder.
4. Ballast tests to an approved plan: static proof, ramp load at mid span and at the threshold, tip in every direction, curb and brake events, fatigue.
5. Cover tests listed in materials.md.
6. Only then a supervised, consented fit and handling study with stop rules.

Digital mesh checks and a tidy drawing prove none of this.
