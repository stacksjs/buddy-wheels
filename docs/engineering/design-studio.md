# Wheelchair design studio

The `/design-studio` page adds an interactive inspection workbench for all five wheelchair families, XS through XL. It uses native STX signals and the reusable Stacks `<ModelViewer>` component, backed by `@stacksjs/browser/model-viewer`. The renderer uses browser WebGL directly, with no Three.js, external model service or client framework.

## Inspection and configuration

The complete frame combines actual binary STL plate/cap meshes with parametric tube, wheel, pin and shock envelopes. Its axes, dimensions and transforms follow the editable OpenSCAD source. The viewer supports pointer orbit, pinch/wheel zoom, camera presets, keyboard controls, a suspension detail, separated plates and individual part inspection. It renders on demand instead of running an autoplay animation. It owns and disposes its GPU resources, observers, request work and event listeners.

The native size selector updates the scene, controls, suspension radii, accessible model label, fallback drawing and every file link together. Valid edits are remembered separately per size for the current page visit; reset affects only the selected family. The shop links its selected size into the studio. A query such as `/design-studio?size=M&height=400&width=300&rail=500&setting=2` opens a configured family. Existing XL URLs continue to work.

Editable frame values are rail-center height, rail-center spacing and rail length, in 5 mm steps:

| Family | Starting height / spacing / rail, mm | Height range | Spacing range | Rail range |
| --- | --- | --- | --- | --- |
| XS | 260 / 160 / 260 | 260-320 | 160-210 | 200-340 |
| S | 300 / 210 / 340 | 300-380 | 175-280 | 260-440 |
| M | 385 / 280 / 460 | 385-480 | 220-360 | 360-600 |
| L | 500 / 340 / 600 | 440-620 | 270-440 | 480-740 |
| XL | 620 / 400 / 680 | 500-760 | 320-520 | 540-820 |

These are bench software envelopes, not dog-fit ranges. The studio's compact starting heights are taller than the original r0 nominal rigs because the undrilled upper inner tube must end above the fixed suspension mount pins. XS spacing also clears the opposed 78 mm rear corner profiles. Boundary tests enforce both clearances. The original compact r0 reference drawings remain baseline illustrations, not fabrication instructions for these configured setups. Smaller frame heights require a revised tube/mount interface and new reviewed drawings. These edit tube lengths/positions, the cut list and drilling datums. They do not alter any printable part's geometry. The source values, validator, scene and document generator are shared by the browser, server downloads and native CAD command.

Suspension controls select matched family-specific shock eye radii (XS 25/32/40, S 38/50/62, M 55/70/85, L 65/85/105, XL 70/90/110 mm) and preview -3 to +6 degrees of arm rotation. A separate neutral-lock control requires zero travel. The ideal neutral wheel-rate factor is `(radius / family.arm)^2`; it is not a measured suspension response or a rehabilitation prescription. Spring/air tuning, damping and actual support forces remain separate unresolved engineering inputs.

Invalid editing keeps the last valid preview and disables the kit button. Download endpoints independently reject unknown, repeated, malformed and out-of-range fields. A supported query string initializes a bookmarked setup. Page copy retains the owner-reported 140 lb weight and identifies the dimensions as estimates, with no animal-use approval or load rating.

## Native delivery and provenance

```sh
./buddy design:wheelchair --size XL --export --openscad /absolute/path/to/OpenSCAD
./buddy design:publish
./buddy test
bun run test:studio
```

`design:publish` verifies the canonical parameter wrapper, combined CAD source hash, complete export manifest and each recorded output hash before copying assets into `public/designs/{size}/r0` for all five families. It refuses stale or modified exports. The public asset manifest supplies the browser mesh revision. The cap insertion direction and optional neutral-lock depiction were corrected at the CAD source, followed by complete regenerated exports.

The public endpoints are native Actions registered in `routes/api.ts`:

| Endpoint under `/api` | Result |
| --- | --- |
| `/designs/{size}/kit` | Configured gzip tar: ten STLs, three metal DXFs, editable CAD, setup JSON, BOM, drilling schedule, kinematics, matching Markdown assembly guide, print/validation/printer notes and checksums |
| `/designs/{size}/assembly` | Matching Markdown assembly instructions |
| `/designs/{size}/bom` | Matching CSV parts/cut list |
| `/designs/{size}/profile` | JSON dimensions and inspection settings |
| `/designs/{size}/part/{part}` | One allowlisted binary STL, with fit-check-only names retained for metal parts |

The route size is validated against the five-family allowlist. Each family supplies ten independently exported STL types, three metal profiles and its own baseline source hash. Generated assembly instructions use that family’s tube sections, hole pitch, wheel size, shock interface, bushings, spacers, axle stack and pin retention dimensions; the XS cotter interface is 1 mm, the others 2 mm. Print notes identify the selected family and its calibration bores. No other family inherits Buddy’s owner-reported weight.

The kit includes both the baseline CAD provenance hash and a configured CAD hash, plus per-file hashes. Its copied source opens in the selected leverage/travel/lock inspection pose. Neutral datums still govern fabrication. The profile's `overrides` work with the native CAD command; its `preview` metadata records the viewing settings separately.

Archives are generated in memory with Bun's native archive API. No OpenSCAD process, CAD Boolean operation, writable design directory, model upload, queue worker or GPU runs on the web server. OpenSCAD remains a workstation export prerequisite. Public downloads are rate limited; configured responses use `no-store`; part names and asset paths use explicit allowlists. Private environment/runtime files are outside the package source set.

## UI and verification

Stacks 0.75.527 updates the native viewer so bound labels and fallback posters react to model switches alongside scene geometry.

The studio keeps the site's forest/cream visual language, with a system dark theme for the surrounding workbench and a neutral model canvas. Layout collapses to one column on phones. Number fields and sliders share STX state. Input labels, unit hints, native form constraints, camera controls and file links remain keyboard accessible. Without WebGL the CAD drawing and downloads remain usable. Mesh and stylesheet revisions prevent stale browser assets after normal refreshes.

Retained checks cover actual orbit-pixel changes, live dimensions, suspension/lock behavior, an exact configured download, every packaged checksum, individual mesh inspection, all five configured family kits and hashes, remembered edits, per-size reset, server refusals, size deep links, four screen widths, Retina backing resolution, dark theme and drawing fallback. The existing shopping/cart journey runs separately to protect shared navigation and commerce behavior.

These digital checks do not replace the physical validation and individual fit gates. The public kit remains a bench design with metal primary structure, unapproved fit-check print copies, unresolved purchased hardware/harness interfaces and no qualified operating envelope.
