# XL design studio

The `/design-studio` page adds an interactive inspection workbench for Buddy's XL bench design. It uses native STX signals and the reusable Stacks `<ModelViewer>` component, backed by `@stacksjs/browser/model-viewer`. The renderer uses browser WebGL directly, with no Three.js, external model service or client framework.

## Inspection and configuration

The complete frame combines actual binary STL plate/cap meshes with parametric tube, wheel, pin and shock envelopes. Its axes, dimensions and transforms follow the editable OpenSCAD source. The viewer supports pointer orbit, pinch/wheel zoom, camera presets, keyboard controls, a suspension detail, separated plates and individual part inspection. It renders on demand instead of running an autoplay animation. It owns and disposes its GPU resources, observers, request work and event listeners.

Editable frame values are deliberately limited to rail-center height (500-760 mm), rail-center spacing (320-520 mm) and rail length (540-820 mm), in 5 mm steps. These edit tube lengths/positions, the cut list and drilling datums. They do not alter any printable part's geometry. The source values, validator, scene and document generator are shared by the browser, server downloads and native CAD command.

Suspension controls select matched 70/90/110 mm shock eye radii and preview -3 to +6 degrees of arm rotation. A separate neutral-lock control requires zero travel. The ideal neutral wheel-rate factor is `(radius / 180)^2`; it is not a measured suspension response or a rehabilitation prescription. Spring/air tuning, damping and actual support forces remain separate unresolved engineering inputs.

Invalid editing keeps the last valid preview and disables the kit button. Download endpoints independently reject unknown, repeated, malformed and out-of-range fields. A supported query string initializes a bookmarked setup. Page copy retains the owner-reported 140 lb weight and identifies the dimensions as estimates, with no animal-use approval or load rating.

## Native delivery and provenance

```sh
./buddy design:wheelchair --size XL --export --openscad /absolute/path/to/OpenSCAD
./buddy design:publish
./buddy test
bun run test:studio
```

`design:publish` verifies the canonical parameter wrapper, combined CAD source hash, complete export manifest and each recorded output hash before copying assets into `public/designs/xl/r0`. It refuses stale or modified exports. The public asset manifest supplies the browser mesh revision. The cap insertion direction and optional neutral-lock depiction were corrected at the CAD source, followed by complete regenerated exports.

The public endpoints are native Actions registered in `routes/api.ts`:

| Endpoint under `/api` | Result |
| --- | --- |
| `/designs/xl/kit` | Configured gzip tar: ten STLs, three metal DXFs, editable CAD, setup JSON, BOM, drilling schedule, kinematics, matching Markdown assembly guide, print/validation/printer notes and checksums |
| `/designs/xl/assembly` | Matching Markdown assembly instructions |
| `/designs/xl/bom` | Matching CSV parts/cut list |
| `/designs/xl/profile` | JSON dimensions and inspection settings |
| `/designs/xl/part/{part}` | One allowlisted binary STL, with fit-check-only names retained for metal parts |

The kit includes both the baseline CAD provenance hash and a configured CAD hash, plus per-file hashes. Its copied source opens in the selected leverage/travel/lock inspection pose. Neutral datums still govern fabrication. The profile's `overrides` work with the native CAD command; its `preview` metadata records the viewing settings separately.

Archives are generated in memory with Bun's native archive API. No OpenSCAD process, CAD Boolean operation, writable design directory, model upload, queue worker or GPU runs on the web server. OpenSCAD remains a workstation export prerequisite. Public downloads are rate limited; configured responses use `no-store`; part names and asset paths use explicit allowlists. Private environment/runtime files are outside the package source set.

## UI and verification

The studio keeps the site's forest/cream visual language, with a system dark theme for the surrounding workbench and a neutral model canvas. Layout collapses to one column on phones. Number fields and sliders share STX state. Input labels, unit hints, native form constraints, camera controls and file links remain keyboard accessible. Without WebGL the CAD drawing and downloads remain usable. Mesh and stylesheet revisions prevent stale browser assets after normal refreshes.

Retained checks cover actual orbit-pixel changes, live dimensions, suspension/lock behavior, an exact configured download, every packaged checksum, individual mesh inspection, server refusals, deep links, four screen widths, Retina backing resolution, dark theme and drawing fallback. The existing shopping/cart journey runs separately to protect shared navigation and commerce behavior.

These digital checks do not replace the physical validation and individual fit gates. The public kit remains a bench design with metal primary structure, unapproved fit-check print copies, unresolved purchased hardware/harness interfaces and no qualified operating envelope.
