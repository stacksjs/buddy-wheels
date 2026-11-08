# Wheelchair r0 industrial design refinement

November 8, 2026. Scope: the existing five-family bench platform. This is an appearance and nonstructural-print refinement, not an animal-use release, a structural improvement claim or a new load rating.

## Direct assessment

The original r0 assembly exposed its construction clearly but looked like an engineering fixture: one flat metal color, square-ended protection parts and little visual distinction between adjustment surfaces and the fixed frame. It is not established as the nicest wheelchair, the best-performing design or a clinically appropriate chair for Buddy. Real fit, support, weight distribution, fatigue, pinch protection, stability and terrain behavior remain unverified. A modern image cannot establish those results.

## Implemented changes

- One candidate finish palette is shared by the native CAD parameter wrappers and interactive scene: forest outer frame, natural silver inner adjustment sections and structural cheeks, darker trailing arms, green nonstructural parts and charcoal tires. The source is `wheelchairPalette` in `app/Designs/WheelchairParameters.ts`.
- Outer and inner end-cap flanges now have 1.5 mm rounded plan-view corners. Overall flange width, insertion square, insertion length, bore and sleeve interfaces stay nominally unchanged. This rounds a nonstructural print, not the metal tube or a load-bearing joint.
- The loose setup-marker collar has 2 mm outer plan-view corner radii. Its tube clearance and open marker slot remain unchanged. It is still a witness marker, not a height lock or compression clamp.
- Empty-rig sample pivot shields have 1 mm tapered outside rim bands instead of square rim edges. Their 40 mm maximum diameter, 7 mm height and pivot clearance remain nominally unchanged. They are not a complete installed fur/toe guard or pin retainer.
- The main frame uses the forest finish while sliding upper uprights and the inner bridge remain visually metallic. Pins and inspection points remain exposed. No cosmetic housing conceals an unresolved fastener, shock or harness interface.
- Original metal profiles, shock interfaces, wheel interfaces, hole locations, tube sections, support geometry and suspension leverage/travel limits remain unchanged. The chair is not represented as having a fitted harness or approved spring tune.

The geometry remains within the r0 interface family. Git history, regenerated source hashes and per-file export checksums identify this refinement. Earlier downloaded r0 meshes must not be mixed without checking their hashes. Rebuild sources, all family exports, the separate Buddy iteration and public studio assets together.

## Finish is a proposed fabrication operation

The model color is not evidence of a delivered coating. Obtain a shop-approved process for the chosen metal and intended environment. Coat only the appropriate exterior outer-frame surfaces. Mask sliding sections, tube interiors, bores, bearing interfaces and clamped joint contact faces. Preserve the reviewed fits, sleeve seating and fastener procedures; do not use paint as a spacer, bushing or friction lock. Verify coating thickness, adhesion, wear, corrosion behavior, cleaning and any relevant biocompatibility/contact requirements after process selection.

The [one-off build budget](https://buddywheels.org/prototype-budget) now includes a separate **$35 / $70 / $140 unquoted finish allowance**. It is additional to cutting, deburring and finish-hole work. The base first-rig cash budget increases from $2,921.30 to $3,012.12 after the finish, illustrative tax reserve and contingency. No printer upgrade or extra manufactured part type is required for the rounded nonstructural prints.

## What still determines whether it works well

| Open question | Required evidence |
| --- | --- |
| Is rear-only support suitable for Buddy? | Treating veterinary/rehabilitation assessment and measured anatomy |
| Does the support fit without pressure injury? | Exact rated harness, engineered anchors, posture/contact review and supervised fitting |
| Are shocks, shafts and wheels compatible? | Approved supplier drawings, finish fits, positive retention, tune and axle/endplay verification |
| Are the suspension and frame stable in use? | Instrumented load distribution, articulation, braking/handling, roll/stability and failure-mode work |
| Does it tolerate outdoor use? | Written structural, fatigue, wear, environmental and terrain protocols with retained results |
| Are accessible moving joints guarded? | Complete fur/toe/pinch analysis and tested guards that preserve inspection and articulation |

These are prerequisites, not results. Suspension geometry does not prescribe hind-leg training or body-support force. A printable guard or an attractive forest finish does not close a clinical or engineering gate.

## Native rebuild

```sh
./buddy design:wheelchair --size all --export --openscad /absolute/path/to/OpenSCAD
./buddy design:wheelchair --profile designs/wheelchair/profiles/buddy-xl-estimate.json --export --openscad /absolute/path/to/OpenSCAD
./buddy design:publish
./buddy test
bun run test:studio
```

OpenSCAD remains the official workstation geometry exporter; it is not a web-server dependency. Public kits use the same refreshed binary meshes as the viewer. The fit guide and body worksheet remain separate from CAD configuration and do not turn anatomical inputs into unreviewed frame settings.
