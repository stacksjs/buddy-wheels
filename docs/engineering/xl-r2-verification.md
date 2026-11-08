# XL r2 digital verification

November 8, 2026. This record concerns software, exported geometry and file consistency. It is not a load test, clinical review, certification or permission to put an animal in the prototype.

## Implemented

- Standard MISUMI SWH20-75 pair with 8 mm nominal cartridge travel and equal 0/1/2 mm steel preload shims. Fixed 65.3 N/mm spring rate, no damper.
- Separate r2 CAD, eight actual STL types and four metal DXFs. Reuses frozen r1 service-part/profile geometry, leaving published r0/r1 kits intact.
- Native STX/Stacks ModelViewer studio with frame, hub, preload and manual travel controls, cartridge cutaway, actual mesh inspection and matching native GET downloads.
- Complete BOM, manufacturing cuts/slots/drilling datums, assembly sequence and integer-cent one-unit/100-chair cost scenarios at both $265 and $299.
- Checked online spring and housing prices, separately marked supplier/manufacturing allowances. Starting batch COGS $217.44. The unchanged 30% gate fails at both retail prices; $299 needs $8.14 lower landed COGS. No capital purchase is charged as a new purchase per chair.

## Checks

Native `./buddy lint`, `./buddy typecheck`, `bun run typecheck:views` and `./buddy test` passed. The full unit run had 38 tests and no failures. Focused coverage includes strict input parsing, the prototype-key regression, configuration corners, spring/seat/pin/guide datums, radial hardware-to-spring clearance, whole-stock purchasing, BOM cost coverage, negative selling contribution, matched downloads and stale/tampered artifact rejection.

The native Buddy CAD export command ran official OpenSCAD. All eight STL types passed closedness, orientation, positive signed volume, single-body and build-envelope checks. Metal-profile STLs are explicitly unloaded fit checks; production profiles use the separate metal DXFs. Industrial springs are purchased, never printed. The assembly PNG is a baseline reference; configured CAD/tables are authoritative.

Local native browser suites passed for r2, rigid r1, all five r0 sizes and commerce. r2 checks include actual WebGL model/orbit, cartridge cutaway, all eight meshes, configured dimension/preload/travel downloads and archive hashes, both retail prices, one-unit versus batch scenarios, invalid/duplicate query rejection, 320/428/768/1440 widths, dark contrast, non-WebGL drawing/download fallback and no console exceptions. Screenshots were inspected. STX checked 21 script blocks and 502 template expressions with no errors or warnings.

Independent Spec and Standards reviews found and resolved four substantive issues: guide washer/head interference, a rail-shim/housing overlap, the 16-pad BOM quantity and prototype-key parsing. The guide now uses M5 ISO4762/DIN433 hardware within the nominal spring bore; the rendered spring envelope matches the nominal 20/10 mm diameters. Review rechecks found no unresolved high-confidence issues. Nominal digital clearances still require tolerance, friction, strength, wear and physical validation.

The native deployment preview resolves to the existing `stacks` Hetzner server, with the configured API and buddywheels.org web services, Porkbun DNS and TLS. No new server, purchase, supplier contact or message is part of this task.

## Remaining physical and commercial work

Obtain Buddy's measurements, actual wheel interfaces and professional fit guidance. Approve the complete metal/textile/guard drawings and supplier SKUs. Qualify structure, seats/pins, guide alignment, tolerance stacks, corrosion, contamination, binding, rebound, stop impact, retention, stability and fatigue on a guarded empty rig before any animal. Quote and validate the complete guard and support set, measure production time and replace every allowance. Positive contribution alone is insufficient for retail release.
