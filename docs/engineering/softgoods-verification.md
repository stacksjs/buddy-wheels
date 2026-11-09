# Textile revision 1 verification

Checked November 8, 2026. Scope: XS/S/M/L/XL r0 and XL r1/r2. This is digital bench verification, not animal-use qualification.

| Check | Executed result |
| --- | --- |
| Native generation | Seven complete cut/sew studies and seven assembled previews |
| Reference meshes | 42 closed, connected, consistently oriented, positive-volume bodies |
| Independent CAD | Six XL r2 OpenSCAD layer exports agreed with native volumes within 1% |
| Provenance | Generated source hash, every artifact hash and all seven poster hashes matched |
| Automated tests | 47 tests passed, 3,848 assertions |
| Native lint | No errors or warnings |
| Type checks | App and 21 STX script blocks / 586 template expressions passed |
| Textile browser suite | All seven kits, matching dimensions, checksums, source profiles, color changes and inspection scopes passed |
| Paper scale | Browser print layout measured 190 x 240 mm SVG tiles; 50 mm calibration bars remain mandatory before cutting |
| Responsive layout | No horizontal overflow at 320, 428, 768 and 1,440 px; light and dark views inspected |
| WebGL fallback | Complete textile assembly poster and downloads remained available |
| Independent reviews | Standards and Spec findings resolved: opening/webbing clearance, open hygiene channel and connected shoulder straps |

Native scripts live in `scripts/qa-softgoods.ts`, `qa-studio.ts`, `qa-standard.ts`, `qa-spring.ts` and `qa-finish.ts`. Runtime screenshots and logs are machine-local under `storage/framework/runtime/` and are excluded from deployment.

The downloaded source exporter was executed from an isolated temporary directory. It reproduced the rear-shell reference STL byte-for-byte and rejected an invalid changed opening. Accepted dimension combinations were checked against the actual reinforcing-tape positions, in addition to ordinary input bounds.

The source-level viewer change shipped in [Stacks v0.75.529](https://github.com/stacksjs/stacks/releases/tag/v0.75.529). The application consumes the published package, with no local source link. The [release workflow](https://github.com/stacksjs/stacks/actions/runs/42540154707) completed successfully.

Outstanding physical work is listed in [the design scope](softgoods-plan.md) and [the sewing guide](softgoods-xl-r1.md). Materials, hardware, seam strength, anchors, loaded sag, body pressure and fit remain unqualified. The $24 complete textile allowance is still an unquoted target.

Design preflight: retain the established forest/silver consumer brand in a practical inspection tool. Variance 3/10, motion 1/10 and density 6/10 favor consistent controls and readable dimensions. Native components, shared theme/shape tokens, image dimensions, focus/validation states, mobile alignment and light/dark contrast were checked. Pattern previews use a stronger screen-only line; fabrication SVG cut lines keep their physical stroke. No new animation, icon package or design system is introduced. Marketing-only hero, logo-wall and marquee checks do not apply to these engineering controls.
