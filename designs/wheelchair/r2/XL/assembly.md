# Buddy XL r2: standard die-spring bench cartridge

Configuration xl-r2-h620-w400-l680-hub82.55-p1-t0. All dimensions mm. This is an undamped, unqualified empty-rig prototype. No dog-use, 140 lb capacity, terrain or rehabilitation rating exists. Confirm Buddy's anatomy and clinical suitability before a fitted design. Metal and qualified textile supports carry the loads. Never use a printed metal-profile fit check as structural material.

## What changes

Two captive telescoping carriages replace r1's rigid posts. Each uses one standard MISUMI SWH20-75 spring, four-sided UHMW guidance, steel seats and two positively retained smooth pins. Fixed spring rate 65.3 N/mm. Preload 1 mm uses 2 matched 1 mm steel shims, 1 per wheel. Preload changes the initial force, not spring stiffness. This is not a hydraulic shock or an adjustable damper. An alternative rate requires a separately verified spring and new cost/clearance checks; none is approved here.

## Exact configured cut and stack schedule

Rail center height at full droop 620, width 400, rail length 680; hub assumption 82.55. Preview bump 0, displayed loaded rail height 620. Travel is a manual geometric pose, not predicted sag or a clinical setting. Manufacture from full-droop datums regardless of preview pose.

- 1 inch square tube: 2 x 680 (Side rail); 1 x 374.6 (Rear bridge); 2 x 220 (Wheel carriage).
- 1.25 inch housing: 2 x 387.2. Same .065 inch wall. Nominal bore 28.448.
- Carriage bottom Z120.1, top 340.1. Lower seat bottom 340.1, top 343.275. At droop upper seat bottom 418.275, top 421.45; upper retaining pin center 425.45. Housing bottom 220.1. Each end of lower travel slot center is 147/155 above carriage bottom. Housing lower pin 55 above housing bottom; upper pin 205.35 above housing bottom.
- Spring shims sit BELOW the upper seat, above the spring, not above the retaining pin. Installed spring length 74; nominal compression 1. 8 mm between slot-end centers gives 8 mm stroke for an 8 mm pin. Slot width 8.2 adds up to 0.2 mm end play; do not interpret nominal travel as a precision hard stop. Machine and measure actual stops.
- Lower seat carries a 55 mm steel guide sleeve with M5 x 70 bolt: upper washer 1 plus sleeve 55 plus seat 3.175 plus lower washer 1 leaves 9.825 mm under-seat thread for a nominal 5 mm locknut and 4.825 mm protrusion. Nominal 5 mm bolt-head height gives 4 mm upper-seat clearance at maximum preload and travel; actual hardware/tolerances must be verified.

## Bench assembly sequence

1. Read BOM and drilling.csv, measure both actual wheel hubs/bearings/washer stacks, then adjust hub field. Obtain reviewed drawings for steel pins, axle shafts, slots, bearing/liner fits, finishes and the complete textile support. Provisional dimensions are not procurement specifications.
2. Cut both square-tube SKUs with 3 mm saw kerf; finish faces and deburr. Drill only reviewed datums using proper metal tooling. Machine matching capsule slots, never freehand loaded bearing surfaces. Inspect remaining ligaments, parallelism and crack-free edges.
3. Cut eight T gussets, four axle patches, four rail shims and four spring seats from 3.175 mm steel. Deburr, finish and inspect. The r1 service caps and layout fixture remain nonstructural.
4. Fit two bands of four UHMW pads per carriage, at local heights 120-155 and 180-215. Slots run on Y faces at 147-155, so trim those two pads around slots with no adhesive in the pin path. Nominal per-face running clearance is 0.254 before adhesive/corner/tube tolerances. Verify loaded side-play and sliding friction; nominal clearance alone cannot establish fit.
5. Put lower steel seat on carriage end. Secure the guide sleeve to this seat with the reviewed M5 guide fastener stack, nut below seat. The guide end and bolt head must clear the upper seat/shims at full compression; guide fastener must not protrude into the spring wire. Install selected matched spring pair and equal preload shims.
6. Slide housing over carriage and capture lower stop pin through both housing bores and both carriage slots. Insert upper seat, retain it under the upper smooth pin, add correct washers and fresh cotters to all four pins. No preload adjustment while loaded. A compressed spring stores energy; use a guarded unloading fixture and verify zero stored load before removing a pin.
7. Assemble T joints with rail shims at the four narrower-rail faces, long bolts on rail/housing junctions, short bolts at rear and axle patches, and matching flush crush sleeves. Do not clamp a carriage slot with a bolt. Apply only an approved torque/locking procedure.
8. Reuse r1 stock-shaft axle sleeves, spacers, washers and positive cotters. Wheel hub length remains provisional. Verify shaft fit, end float, patch contact and tire/frame clearance across full travel. Fit caps only after inspecting retention. Complete fur/pinch/spring guards are required before any animal and are not qualified in these files.
9. On the guarded empty rig, measure force versus travel for both sides, friction/hysteresis, rebound, asymmetric bump, stop impact, spring/seat/pin wear, bending, permanent set, contamination, corrosion, pin migration, tip resistance and fatigue. This mechanism has NO damper. Stop if there is binding, uncontrolled rebound or contact. A catalog spring cycle figure does not qualify the assembly.
10. Obtain engineering approval of the complete load paths, guards and stable support layout, plus professional fitting. Do not place Buddy in this bench rig. Time actual manufacture, obtain itemized quotes and replace cost allowances before any retail release.

## Downloads and reproducibility

The kit includes configured model.scad, source/suspension.scad and a frozen r1 geometry dependency source/rigid.scad, eight actual STL types, four metal DXFs, matching setup/BOM/drilling, cost files and checksums. assembly.png is only the default pose reference. Open the configured CAD for the selected pose and dimensions. Run official OpenSCAD to manufacture geometry; the studio's tube/pin primitives are inspection geometry, not machining drawings. No printer or one-time development cost is hidden in recurring COGS.
