# Rover r0 scope, native geometry and verification

November 11, 2026. This records what the first Rover design package is, how its files are made and what was actually checked. It is a bench design. No part has been printed, cut, sewn, assembled, loaded or used with an animal.

## Request and scope

The owner asked for printable Rover designs, a cabin much larger than the Burley Bark Ranger, an entrance with a minimal incline because Buddy can no longer step high, complete materials including the cloth for rain, wind and sun, updated documents and a working deployment.

Delivered in this revision:

- A parametric frame, ramp, running-gear layout and cover, in `app/Designs/Rover*.ts`.
- Eleven printable service and fixture types and six fit-check copies of the metal profiles, as STL. Six metal profiles as DXF.
- A dimensioned side and top drawing, cut list, parts list, joint pattern table and build order.
- A weather system with a named, priced candidate for every layer and a cover cut schedule.
- A cost study from the counted parts list.
- An interactive studio at `/design-studio-rover` and a configured download at `/api/designs/rover/{artifact}`.

Not in this revision: a selected wheel, a brake design, a swivel front wheel, a folding mechanism, beach or ski conversions, sewing patterns beyond rectangular blanks, any structural calculation and any physical test.

## Design decisions

| Decision | Reason | Open risk |
| --- | --- | --- |
| Tailgate is the ramp, top-hinged leaves, 6 mm gap | One part does two jobs, and the dog walks on a continuous surface from ground to deck | Hinge pinch point, latch and strap retention |
| Ramp stands on its own two feet | A 140 lb dog on the threshold would otherwise tip the carrier backward about its rear axle | Leg and gusset strength, foot setting on uneven ground |
| Deck fixed at 151.9 mm for every wheel choice | The base rail stays 124 mm up; each wheel has a hanger profile with the axle at its own fixed rise, 41, 69 or 130 mm | Only 108 mm ground clearance. Coast and Snow may need more |
| Incline limit 12 degrees, start about 9 | The owner asked for a minimal incline. Published ramp guidance for dogs varies, so a strict limit was chosen rather than a cited one | Not validated with any dog. Wet grip unproven |
| Three matching wheels, 15 inch 4.00-8 trail wheel by default | One wheel, one hanger, one spare. The supplier states bearings, bore, hub length and load, so nothing about the axle is guessed | A utility wheel, not a running wheel. Its weight is not stated. The 13 inch option is cheaper and the 20 inch option has no verified candidate |
| Bolted gusset frame, no welding | Matches the XL r1 standard-parts approach and can be built with a drill | About 150 sleeved joints. Heavy, slow and expensive. See the cost study |
| Swivel front caster with a swivel lock on a raised nose, fixed fork kept as an option | A 140 lb dog makes a lift-to-steer front wheel impractical at walking pace; the lock holds it straight for running | The priced caster states its height but not its plate or bolt pattern, so the beams are drilled from the delivered plate |
| Parking brake from a push-pull toggle clamp over each rear tire | Standard parts, positive over-center lock, no new mechanism to machine | Untested. Holding force on a pneumatic tire depends on adjustment and pressure. No brake for slowing |
| Zinc-plated grade 5 fasteners in Run, aluminum gussets | Lower cost and higher strength than 18-8 stainless | Corrosion in salt. Stainless is the Coast upgrade, with galling to manage |

## Cost-down pass, November 12, 2026

The owner asked for the price to come down. The same r0 design was revised before anything was built: no part geometry changed, so every STL and DXF is byte-identical, while quantities, tube walls, hardware, panel grade and the cover specification changed. Earlier downloads of the documents are superseded.

- Intermediate base cross members and both ramp ribs are thin-wall tube. A 700 mm cross member carrying a 450 N share at mid span works out near 68 MPa by hand arithmetic. End cross members, rails, axle posts, fork and ramp curbs stay 1/8 inch wall.
- The eight corner-post joints use one outside gusset instead of a pair. Axle posts, which take the handle and the wheels, keep pairs.
- Run hardware is zinc-plated grade 5. Panels are sealed exterior BC plywood.
- The cover keeps the solution-dyed fabric on the roof and uses a cheaper PVC-coated 600 denier polyester on the walls, drops the zippers for hook and loop, tapes only the roof seams and makes the reflective liner optional.
- Listed supplier quantity tiers are used where the 100-carrier purchase reaches them.

Result: $1,668.26 per carrier at 100 units and $2,809.28 for one, from $2,037.93 and $3,254.89. Tube and wheel prices could not be verified lower; supplier pages refused automated reads on both days. The study therefore also reports a second total with tube bought by weight at an assumed $4.00 per pound, $1,296.72, and labels it as an assumption.

A second pass the same day made the 13 x 4 inch pneumatic wheel from the XL wheelchair the default, with a low axle hanger profile and spacers so its wide tire clears the fork. Its $14.99 price was observed on November 8; the supplier page refused a recheck on November 12. That took the totals to $1,527.23 and $2,674.25, and $1,159.53 with tube by weight. The 20 inch wheel remains a studio option at its $60 allowance. This pass added one metal profile; the other fourteen meshes and three profiles are unchanged.

A third pass read prices in a real browser on supplier pages that refuse automated reads. It moved the tube to 21 ft and 24 ft stock bars from Metals Depot, with the cabin and secondary members in 1/16 inch 6063-T52 and the chassis in 1/8 inch 6061-T6; made a 15 inch pneumatic wheel with stated bearings, hub length and load the default; and replaced the bolt, nut, washer and plywood allowances with observed prices. Totals are $1,365.53 at 100 units, $2,589.59 for one and $1,186.31 with tube by weight. The thin wall changed from .065 to 1/16 inch, so the cabin tube cap mesh changed; one more hanger profile was added. A one-carrier buy list is generated with the kit.

Looked at and not adopted: a 10 inch swivel caster for the front wheel, which would cut steering effort but stands above the deck and needs a raised front frame; two wheelchair wheel-lock sets for the brake, both made for specific chairs; tent-style hoops instead of the box cabin, which would narrow the headroom that makes the cabin larger than the reference.

A fourth pass designed the swivel front. A 10 inch caster stands about 311 mm tall, above the 152 mm deck, so it cannot go under the floor. The base rails are extended about 330 mm and carry four nose posts and two caster beams, all joined with the existing corner gusset profile; the caster bolts up under the beams with its wheel sweep clear of the cabin front. The caster mounting height is a setup input because the priced caster's supplier does not state it. This replaces the fork, front axle, third wheel and four hangers, for a net of about $19 per carrier.

The same pass added what a builder needs to make one: a build guide in order of work, a plan of the base frame from above, a drilling schedule for every tube measured from a named end, a nesting plan into 8 ft parcel bars, and a buy list. One-carrier costs now assume 8 ft bars, the longest the tube supplier ships by parcel.

Parking is not solved. Cart floor locks were read at $42 to $100; the one that would fit under the floor hangs about 11 mm above the ground when retracted. Wheelchair wheel locks are made for specific chairs. The design specifies wheel chocks for bench trials and leaves a wheel brake open.

A fifth pass closed the open items that could be closed on paper. The front caster is now a Service Caster model with a bolt-on swivel lock and a stated 12-3/16 inch mounting height, read at $64.69. The parking brake is a POWERTEC 302F push-pull toggle clamp, read at $10.70 with a stated 300 lb holding capacity, hung on a new brake clamp plate from a short arm bolted to each axle post with the existing corner gusset; a rubber bumper on its plunger presses the tread. Hinge, latches, leveling mounts, sleeve tube, axle tube, bolts, washers, cotters and chocks are priced from supplier pages, and the buy list for one build is now about 84% verified by value. Totals are $1,507.81 at 100 units, $2,777.43 for one and $1,309.43 with tube by weight.

A sixth pass closed three fits. The maker's shop page for the caster series lists a 4 x 4-1/2 inch plate with holes at 2-5/8 x 3-5/8 inch slotted to 3 x 3 inch, so the caster beam holes are now drawn 85.7 by 70 mm inside those slots instead of being left to match-drilling. The brake pad is a DE-STA-CO neoprene-tipped spindle whose 5/16-18 thread is stated and matches the clamp plunger, read at $4.15. No threaded insert for 1 inch square tube with a 1/8 inch wall could be found, so the ramp stand legs are now a fixed cut length ending in a printed chassis cap, with no foot and no insert. Totals are $1,481.08 at 100 units, $2,749.54 for one and $1,281.97 with tube by weight.

On the same day the owner set the Run price to $999 and asked for a slightly larger cabin. The starting size is now 1300 x 700 x 1000 mm clear with a 1000 mm ramp at about 8 degrees; the width stays 700 because the carrier is already about 1008 mm wide over its axle ends. Totals at that size are $1,538.35 at 100 units, $2,792.64 for one and $1,334.08 with tube by weight, all above the $999 price. The cost study now carries a section on how comparable products reach their prices and what each lever would do here.

The owner also asked for the smoothest ride available and for a conversion to carry two children. Neither is in this revision. Ride comfort needs a suspension design and testing before any comparison can be claimed. Carrying children makes it a children's product, with mandatory standards and third-party testing in the United States, and is a separate design decision.

Not closed: no plate quote was run. OSH Cut prices uploaded DXF files without an account, but uploading files to an outside service was not permitted in this session, so it is left to the owner. The caster's swivel radius and the spindle's tip diameter are unconfirmed. Nothing has been built or loaded.

What these passes could not do is make the design competitive with the reference trailer's price. That needs a different architecture, most likely a fabric cabin on bent hoops over a welded or riveted base, and quotes rather than listings.

## Native geometry

OpenSCAD is not installed on the design workstation any more, and running a freshly downloaded copy was not approved in this session. Rover geometry is therefore generated by a small native kit, `app/Designs/Solid.ts`: stacked extrusions of 2D outlines with holes, ear-clipping triangulation, and one rigid rotation into print orientation. It needs no external program and runs in the test suite.

The kit refuses outlines that touch or cross between neighbouring layers, which is the condition that makes its output a closed single body. Each exported mesh is then read back as a binary STL by the same inspector the wheelchair exports use and must be closed, consistently wound, one connected body, positive in volume, on the bed, and inside 220 x 220 x 100 mm. The flat metal fit-check copies must match their profile area times plate thickness.

There is no SCAD or STEP file for Rover. The TypeScript generator is the editable source. Wheelchair designs still use their existing OpenSCAD sources.

## What was verified

- Seven native tests cover the solid kit, setup validation across the range corners, all fourteen meshes, scene and cut-list agreement, gusset counts, the cost arithmetic, document content and the configured kit with stale and tampered asset rejection.
- The studio page was loaded in a browser: the 3D model reached its ready state with no console errors, the ramp, side view and weather cover were inspected, and the configured downloads resolved.
- Supplier prices for the cover materials were read from supplier pages on November 11, 2026. Most hardware prices could not be read from a supplier page that day and are labeled as allowances.

## What was not verified

Everything physical. Strength, stiffness, fatigue, tip stability, braking, ramp grip, hinge and latch retention, wheel fit, cover fit, water resistance, sun protection, cabin temperature, print fit and print strength. The mass and handle-force figures are arithmetic from nominal densities and statics.

## Next revision

1. Measure Buddy. Lying length and standing height decide the cabin.
2. Choose the wheel and brake, then correct the hub length, axle and hanger bore.
3. Replace bolted joints with welded or riveted sub-frames, and the plywood deck with something lighter. Recount cost and mass.
4. Design a lockable swivel front wheel and decide on anti-tip geometry.
5. Sew one roof and one wall panel and run the spray, seam and temperature tests.
