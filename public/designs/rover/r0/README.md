# Buddy Rover r0 bench design

**BENCH DESIGN. NOT FOR USE WITH AN ANIMAL.** A large low-entry carrier you can build at home: a cut-to-fit aluminum frame bolted together with flat plates, a raked nose, a roof that falls toward the front, sprung rear wheels, a tailgate that folds down into a walk-in ramp, a weather cover, and printed service parts. No load rating, structural analysis, physical test, fit approval or sewn sample exists.

Start with build-guide.md: it walks through ordering, cutting, drilling and assembly in order. Nothing is welded. Every joint is a flat plate cut by a mail-order laser service from the DXF files in metal/, three of them cut to this setup's roof and pillar angles. The studio also offers the same frame welded by a fabrication shop, with a weld schedule in place of the plates. base-plan.svg shows the base frame from above, drawing.svg the whole carrier, drilling.csv every hole, buy-list.md what to order for one build. assembly.md and bom.csv are the specification. materials.md covers the rain, wind and sun system and its unproven points. cost-notes.md prices the design honestly, including the finding that it costs more to build than its catalog price.

| Folder | Contents |
| --- | --- |
| parts/ | Eleven printable types at 1:1 mm in print orientation, plus eight FIT_CHECK_ONLY plastic copies of the metal profiles |
| metal/ | Eight flat DXF profiles: corner gusset, tee gusset, brake clamp plate, the two shock mount plates and one axle hanger for each wheel choice. A configured bolted kit adds three gussets cut to that setup's roof and pillar angles |
| cover-cut-schedule.csv, cover-panels.svg | Every fabric blank with seam allowance |

Geometry is generated natively by the Stacks app in app/Designs/Rover*.ts and app/Designs/Solid.ts. There is no SCAD or STEP file for this design, and no OpenSCAD run was involved. Every mesh is checked for a closed, consistently wound, single body of positive volume inside a 220 x 220 x 100 mm print envelope. Those are digital checks only.

Rebuild from the application root with `./buddy design:rover`, then run `./buddy test`.
