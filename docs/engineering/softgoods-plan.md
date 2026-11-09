# Complete support and harness design

The requested scope is to include mesh and harness parts in the actual designs, not only the frame. Textile revision 1 covers XS, S, M, L and XL r0, plus the XL r1 rigid and XL r2 spring frames. These are bench cut/sew candidates with no animal-use release or 140 lb rating. Buddy still needs measured anatomy and a professional fit.

## Delivered interfaces

The shared native TypeScript kernel defines a woven rear saddle, two rounded leg openings, rear hygiene channel, removable mesh and foam, a front bib, chest and shoulder bands, reinforced support tails, six metal-adjuster envelopes, six frame wraps with chafe sleeves, frame-perimeter keepers and ten removable-cover closures. Load webbing and the woven shell are distinct from comfort layers. Exact hardware, cloth grade, seams and anchors remain qualification items.

Six configurable dimensions control rear width/length, leg-opening width/length, frame-to-saddle drop and chest circumference. Validation couples chest clearance to the selected frame and protects opening ligaments. Family changes retain valid edits. Color preferences apply to the modeled textile layers and matching downloads.

Every configured kit contains assembled OpenSCAD, six non-printable textile reference STLs, physical-mm SVG/DXF panel profiles, separate closure-tab and rail/bridge sleeve patterns, Letter/A4 paper tiles, cut lengths, sewing instructions, source profile exporter and archive checksums. The textile-only archive works independently of frame downloads. Printed frame parts stay separate from textile references.

## Reproduction and verification

```sh
./buddy design:softgoods --openscad /absolute/path/to/OpenSCAD
./buddy test
./buddy lint
./buddy typecheck
bun run typecheck:views
bun scripts/qa-softgoods.ts
```

The native generator verifies 42 closed, consistently oriented, connected positive-volume reference meshes. Independent OpenSCAD exports of the six XL r2 layers must agree with the native volume within 1%. Seven assembled preview images are content-hashed. Unit coverage exercises invalid dimensions, frame clearance, pattern provenance, strap orientation, wrap schedules, download identity and hashes. Browser QA checks all sizes, configuration, scope controls, paper patterns, recoloring and responsive layout.

Stacks browser 0.75.529 adds validated inline indexed mesh geometry to the native ModelViewer. It retains origin restrictions for fetched STL files. The spring view uses two closed helix meshes to keep the combined assembly below the existing viewer part limit.

## Manufacturing and cost gate

Read the generated `softgoods/cost-notes.md` in each kit. Mesh purchase estimates charge full supplier increments and material nesting; they do not assume a bulk discount. The old $24 T01 complete-support budget is superseded by the [complete itemized cost study](../business/xl-complete-unit-costs.md). Listed material purchases, rejects, explicit sewing labor and additional textile freight now total $88.01 per XL set at 100 units. Subparts expand one complete harness rather than adding a second one. The $299 spring-chair scenario now estimates $281.45 COGS and misses the unchanged 30% gross-margin gate by $72.15. Obtain actual manufacturing quotes before promising that retail price.

Physical work remains: actual anatomy, material and hardware selection, sewing coupons, anchor/slip/creep/abrasion tests, salt and wash exposure, guarded cyclic loading, loaded sag and pressure mapping, stability and professional fitting. Digital geometry establishes reproducibility, not physical or clinical performance.
