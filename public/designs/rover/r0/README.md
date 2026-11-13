# Buddy Rover r0 bench design

**BENCH DESIGN. NOT FOR USE WITH AN ANIMAL.** A large low-entry carrier: a welded aluminum frame whose cabin sides, handle and nose are each bent from one tube, a raked nose, a roof that falls toward the front, sprung rear wheels, a tailgate that folds down into a walk-in ramp, a weather cover, and printed service parts. No load rating, structural analysis, physical test, fit approval or sewn sample exists.

Start with build-guide.md: it walks through ordering, the shop work and assembly in order. The frame goes to a fabrication shop, which cuts, bends and welds it from cut-list.csv, bend-schedule.csv and weld-schedule.csv. The wheels, suspension, floor, ramp and cover bolt on at home. No shop has quoted, bent or welded it. The studio also offers the same carrier as a bolted home build: every tube straight, a flat plate at every joint cut by a mail-order laser service, and 3D tube files for a tube laser. base-plan.svg shows the base frame from above, drawing.svg the whole carrier, drilling.csv every hole, buy-list.md what to order for one build. assembly.md and bom.csv are the specification. materials.md covers the rain, wind and sun system and its unproven points. cost-notes.md prices the design honestly, including the finding that it costs more to build than its catalog price.

| Folder | Contents |
| --- | --- |
| parts/ | Eleven printable types at 1:1 mm in print orientation, plus eight FIT_CHECK_ONLY plastic copies of the metal profiles |
| bend-schedule.csv, weld-schedule.csv | Every bent tube as straight runs and bend angles at one centerline radius, and every welded joint. For the shop |
| metal/ | Eight flat DXF profiles: corner gusset, tee gusset, brake clamp plate, the two shock mount plates and one axle hanger for each wheel choice. The welded frame uses the brake and shock plates only; the gussets belong to the bolted build. A configured bolted kit adds three gussets cut to that setup's roof and pillar angles |
| tubes/, tube-order.csv | In a configured bolted kit only: 3D STEP files of the straight frame tubes, packed end to end into sticks with their holes and angled ends, for a tube laser service, and the quantity and material for each. Generated natively and checked as closed solids. The set for the starting size passed one service's design check on 2026-11-12 |
| cover-cut-schedule.csv, cover-panels.svg | Every fabric blank with seam allowance |

Geometry is generated natively by the Stacks app in app/Designs/Rover*.ts and app/Designs/Solid.ts. There is no SCAD file for this design, and no OpenSCAD run was involved. The STEP files in a bolted kit are written by app/Designs/Step.ts. Every mesh is checked for a closed, consistently wound, single body of positive volume inside a 220 x 220 x 100 mm print envelope. Those are digital checks only.

Rebuild from the application root with `./buddy design:rover`, then run `./buddy test`.
