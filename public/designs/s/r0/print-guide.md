# Wheelchair r0 print and inspection instructions

**Bench parts only. No printed part in r0 is approved to support a dog.**

## Print order and file identity

1. Read `README.md` and the family `parameters.json`. Confirm revision r0 and units mm.
2. Print `coupon.stl` first. Its four bores, left to right in exported +X direction, are frame-bolt diameter plus 0.1, 0.2, 0.3 and 0.4 mm. For S: 4.1, 4.2, 4.3, 4.4 mm. Measure them; use results to plan a separate geometry revision rather than scaling a finished STL.
3. Print one `tube_cap.stl` and test on a spare tube cut-off with edges deburred. The insertion square is tube internal width minus 0.4 mm, with a 12 mm insertion and 3 mm flange. For S: 16.6 mm insertion square, 24 mm flange. `inner_cap.stl` uses the inner tube's dimensions.
4. Print the empty-rig fixtures and the remaining nonstructural parts in the BOM quantities. Label the bag and each practical part `BW S r0 BENCH` using a marker. Mark metal-part fit-check copies `NOT STRUCTURAL` visibly.
5. Only print `FIT_CHECK_ONLY_*.stl` when needed to check layout and handling. The corresponding DXFs are the metal-source profiles. Never leave a printed copy in a rig that is about to be loaded.

## Starting profiles, not qualification

| Part | Candidate material for bench work | Orientation | Starting slicer values |
| --- | --- | --- | --- |
| Caps, collar, removable pivot shield | PETG | As exported, broad flat bottom on bed | 0.4 mm nozzle, 0.2 mm layers, 4 walls, 6 top/bottom layers, 30% infill |
| Coupon and drill layout jig | PETG | As exported, jig long axis vertical | Same starting profile; verify dimensions before tooling |
| Rigid shock dummy | PLA or PETG | Flat as exported, both eye bores vertical | Empty-rig gauge only; no springs, damping or load function |
| Flat plate fit-check copies | PLA or PETG | Flat as exported, plate thickness in Z | 0.2 mm layers, 3 walls, 20% infill, 5 top/bottom layers; unloaded geometry checks only |

Use the exact filament supplier's temperature/drying/bed recommendations, not invented universal temperatures. Add a removable brim if needed. Nozzle/filament/printer/profile changes need a new dimensional check. Do not treat perimeter count, infill or a generic filament tensile value as a system load rating. No machine-specific G-code or purportedly universal 3MF process preset is supplied.

All ten types fit within a nominal 220 x 220 x 100 mm box in their exported orientation. The XL arm copy is 204 mm long, so a 200 mm bed does not accept it in the authored orientation. Verify slicer placement before starting. Do not shrink it. Production printer size remains a user input. See [printer options near LA](printer-options-la.md).

`drill_jig.stl` is an open-sided tube sleeve, 85 mm tall. Its two cross bores are 30 mm apart on XL/L/M and 20 mm apart on S/XS. It is a **layout aid**, not a rated drill bushing. Use a clamped drill-press/metal-jig process with qualified bush tooling for actual metal holes. Do not hand-hold a loose printed guide around a spinning drill.

## Inspection and record

Record printer/firmware/slicer version, nozzle, profile file/hash, filament supplier/grade/lot, drying history, part revision, date and operator. Compare STL checksum with `checksums.json`. Record actual print mass, dimensions and defects; no estimated print time or mass is represented as measured data.

Reject missing layers, cracks, warping that changes interfaces, incomplete bore walls, embedded debris, poorly fused layers or sharp accessible edges. Check cap fit, collar clearance, guard access and tool removal on the empty rig. The collar is a loose witness marker and provides no adjustment retention. A cap or guard must never hide inspection of a critical fastener or act as a pin retainer. r0 does not provide complete fur/toe/pinch guarding; removable pivot shields are rig samples only.

Prints can creep, change with moisture/heat and fail between layers. The material/process and environmental qualification in [the validation plan](validation.md) is still outstanding. Retain the first print and any failed specimens with their records.

## November 8 appearance refinement

The current r0 nonstructural prints have rounded cap flanges, rounded loose marker corners and tapered sample-shield rims. Nominal interfaces and counts remain unchanged; compare source/output hashes before mixing files from earlier downloads. See [the industrial-design notes](industrial-design.md). None of these changes establishes a load rating, installed guard or approved animal-contact part. The candidate forest finish is an exterior-metal process requiring masking, qualification and a separate shop quote.
