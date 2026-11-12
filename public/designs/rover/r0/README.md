# Buddy Rover r0 bench design

**BENCH DESIGN. NOT FOR USE WITH AN ANIMAL.** A large low-entry carrier: a cut-to-fit welded aluminum frame with a raked nose and a roof that falls toward the front, a tailgate that folds down into a walk-in ramp, a weather cover, and printed service parts. No load rating, structural analysis, physical test, fit approval or sewn sample exists.

Start with build-guide.md: it walks through finding a fabrication shop, ordering, cutting, welding and assembly in order. The starting design is the welded frame; weld-schedule.csv lists every joint. The studio also offers a bolted frame that needs no welding. base-plan.svg shows the base frame from above, drawing.svg the whole carrier, drilling.csv every hole, buy-list.md what to order for one build. assembly.md and bom.csv are the specification. materials.md covers the rain, wind and sun system and its unproven points. cost-notes.md prices the design honestly, including the finding that it does not fit the provisional catalog price.

| Folder | Contents |
| --- | --- |
| parts/ | Eleven printable types at 1:1 mm in print orientation, plus six FIT_CHECK_ONLY plastic copies of the metal profiles |
| metal/ | Six flat DXF profiles: corner gusset, tee gusset, brake clamp plate and one axle hanger for each wheel choice |
| cover-cut-schedule.csv, cover-panels.svg | Every fabric blank with seam allowance |

Geometry is generated natively by the Stacks app in app/Designs/Rover*.ts and app/Designs/Solid.ts. There is no SCAD or STEP file for this design, and no OpenSCAD run was involved. Every mesh is checked for a closed, consistently wound, single body of positive volume inside a 220 x 220 x 100 mm print envelope. Those are digital checks only.

Rebuild from the application root with `./buddy design:rover`, then run `./buddy test`.
