# Product and manufacturing development plan

November 7, 2026. All geometry, bands, costs and test targets in this document are proposals. No CAD release, printable production files or safe load ratings exist yet. Original renders are visual concepts, not mechanical drawings.

## Product requirements

Design a rear-support mobility system with adjustable fit, replaceable modules and a complete support/inspection workflow. The objective is to reduce the complete-kit price while preserving the evidence needed for a safe, useful product. The product must be independently designed rather than a reproduction of proprietary reference geometry.

“Best” is a development objective to define and measure, not a product claim. Evaluate fit acceptance, skin/contact outcomes, tip resistance, retention, assembly time, repair time, field durability, support burden, total delivered price and verified service life. Compare like-for-like use conditions with independently obtained alternatives only after the basic design is qualified.

The first release supports the rear only. Full-support, front attachments, sit-down/collapsing mechanisms, powered assistance, water use, stairs, vehicle transport restraint and unattended use are outside the first design. Do not infer these capabilities from an attractive render.

## Five families, with body shape treated separately

| Family | Proposed weight band | Proposed rear-height screening band | Price target | Main design issue |
| --- | --- | --- | ---: | --- |
| XS Little Buddy | 2-10 lb | 3-9 in | $129.00 | Total mass, low height and friction matter disproportionately |
| S Buddy Small | Over 10-25 lb | 3-15 in | $159.50 | Short-legged and long-bodied variants cannot share one proportion |
| M Buddy Everyday | Over 25-69 lb | 10-18 in | $224.50 | Everyday-size family in the proposed range |
| L Buddy Large | Over 69-120 lb | 14-25 in | $264.50 | Rail bending, connector retention and caregiver handling |
| XL Big Buddy | Over 120-180 lb | 14-28 in | $264.50 | Independent structural architecture, tipping and freight |

These are deliberately labeled screening hypotheses. They combine broad price-reference families with a new five-family proposal; they are not validated adjustments of the competitor's fit system. Weight boundaries are continuous, so a 10.5 lb dog falls in S, a 25.5 lb dog in M, and a 69.5 lb dog in L. No breed automatically maps to a size. Dogs below 2 lb, above 180 lb, or outside geometry/suitability limits need another assessment.

Collect supported rear height, body length, maximum body width, harness routing/clearances, front support and professional posture assessment. A dog that meets a weight band may still be unsuitable. Record usable minimum/maximum dimensions and permissible adjustment combinations in a controlled configuration matrix after tests. Do not scale a CAD model uniformly to produce the other families: bolt sizes, bearing engagement, wheel clearance, wall thickness and adjustment travel do not scale safely together.

## Outdoor and active-use requirements

All-terrain readiness and support for active lifestyles are explicit development goals requested by the founder. Define that phrase through tested operating limits rather than an unlimited promise. Initial candidate surfaces are pavement, grass, firm trails and light gravel. For each family and permitted configuration, test rolling resistance, obstacle clearance, lateral/longitudinal stability, wheel retention, debris interaction and fatigue after repeated outdoor use. Set allowable gradients, obstacle dimensions, surface conditions and activity limitations before a release claim.

All-terrain does not mean every terrain or every dog. Stairs, swimming, deep sand, unstable ground and extreme slopes remain outside the initial design scope. Any future support needs its own evidence. Public copy describes the ambition as planned until verification is complete. Activity remains subject to the treating professional's plan.

## Proposed architecture

Use a hybrid design. Metal rails and axle hardware provide a primary structural path. Printable parts make customization, module replacement and small-batch iteration practical. A final design may need metal reinforcement or fully metal connections in heavily loaded locations. The 3D-printable ambition must accommodate that finding.

| Module | Candidate approach | Design evidence needed |
| --- | --- | --- |
| Left/right rails | Standard aluminum tube or extrusion | Section properties, joints, buckling/bending and corrosion behavior |
| Width bridge | Indexed telescoping standard sections | Adjustment retention and torsional stiffness |
| Wheel struts and axles | Metal load path, mechanical positive retention | Fatigue, impact, locking and wheel pull-off |
| Printable junctions | Split connections with generous fillets and inspectable fasteners | Layer-direction failure, clamp creep, torque and environmental sensitivity |
| Soft rear support | Washable padded textile harness, separable from frame | Skin pressure, positioning, toileting clearance and cleaning |
| Front attachment | Qualified adjustable harness | Load distribution, secure fit, emergency release and entanglement |
| Protective parts | Printed covers, caps and non-load-bearing routing guides | Sharp edges, loss, chewing and small-part hazards |
| Consumables | Standard fasteners and replaceable wear parts | Service interval, locking method and compatibility |

Use modular product identifiers: family, geometry revision, hardware revision and print-process revision. A fit part is compatible only with the interfaces named in its release. Keep left/right components and handed assembly clear. Prefer keyed or asymmetric interfaces when they prevent an unsafe assembly.

## Material and print process

Material selection is an experiment, not a recommendation to print a load-bearing chair today. PETG is a candidate for fixtures and noncritical prototypes. ASA or qualified polyamide may be candidates where environment and load call for them. Reinforced filaments do not automatically improve interlayer reliability or skin-contact suitability. TPU may help in a removable noncritical bumper, but printed padding is not a substitute for a professionally evaluated support harness.

Use the [Prusa material guide](https://help.prusa3d.com/filament-material-guide) for initial processing constraints, then collect exact supplier technical data. Distinguish bulk-material tensile values from a printed assembly's allowable design stress. Control filament moisture, print orientation, temperature, perimeter structure, infill, layer height, cooling, seam, support interface and postprocessing. Do not specify “six walls and 50% infill” as if that alone establishes capacity.

Qualification steps: select candidate grades; print orientation-specific coupons; measure dimensions and mass; test conditioned and dry samples; age under heat/UV/moisture/cleaning exposure; test representative joints; then test assemblies. Retain failed specimens and actual failure locations. Bench-only prototypes use ballast, never an animal. Do not use hobby resin prints or brittle PLA parts as an unreviewed shortcut for structural service.

The production specification must identify printer/firmware/slicer versions, profile hash, build placement, filament lot and drying condition, as well as rejection criteria. Any change to material supplier, grade, reinforcement, process or geometry triggers a documented impact assessment and proportionate requalification.

## Parametric CAD release plan

The application contains catalog planning parameters, not production CAD. The next mechanical work should create native parametric source in the design tool chosen by the engineer and retain editable geometry, not only triangulated exports. Export STEP for review and size/revision-specific STL/3MF for the approved manufacturing process when ready. Do not publish G-code as universally safe across machines.

Parameter groups should include tube outer/inner diameter, engagement length, fastener/washer envelope, junction fillet radii, minimum section, axle diameter, wheel offset/diameter, adjustable height, bridge width, side-rail length and harness clearances. Define valid ranges and incompatibilities. The generator must reject invalid combinations rather than emit geometry that looks plausible.

For every printable part publish intended purpose, family compatibility, revision, print orientation, material/process specification, estimated qualified mass, inspection dimensions, assembly torque/locking procedure, inspection interval and withdrawal status. Final numbers come from drawings and tests. Retain revision history and superseded-file notices so a downloaded file cannot silently become a different part.

Begin with a non-animal fit/assembly rig, tube/fastener gauges and test coupons. Then produce a complete bench assembly. Release production print files only after the exact parts pass the associated test matrix. A maker must pass the same relevant process checks; “print at your own risk” is not a manufacturing control.

## Assembly and inspection

Create one illustrated traveler per kit. Verify part identity, dimensions, print condition, rail engagement, fastener installation, wheel rotation/endplay, retention, edge finishing, harness routing and all adjustment locks. Use calibrated inspection tools appropriate to the selected design. Exact torque values require hardware supplier data and joint tests; none is specified by this plan.

Every kit gets a serial record tied to its printable-part lots and purchased hardware batches. Mark load/adjustment information only after qualification. Record the assembler, inspector, measured results and release date. Reject incomplete travelers, visible print defects, mixed incompatible revisions and substituted critical components.

The proposed complete-kit BOM is priced in the financial model only as an envelope. Obtain real line-item quotes and measured build times for the selected family. Separate prototype spend from sustainable production COGS. If an external print partner is used, agree on process ownership, inspection, traceability, rejects and change notifications before any animal-use release.

## Family sequence

Choose the first family after interviews and professional review of Buddy's actual needs. Buddy is very large and his size limited the founder's available options. Prioritize large- and giant-dog fit in first-family discovery. Select the initial family using his actual measurements and professional assessment, then qualify that architecture and its interfaces. Develop S/XS as low-mass geometries with short-leg/long-body cases; they require new stability and contact work. Develop L/XL with separate structural and handling evidence. A pass for any one family grants no automatic rating for another.

A family exits development only when its drawings, process, BOM, tests, fitting procedure, instructions, support capacity and claims are reviewed together. Review the final physical unit against the ecommerce configuration so that the name, measurements, accessories and warnings describe the item actually shipped.

## Repair, circularity and end of life

Design a practical repair hierarchy: routine inspection; caregiver-replaceable noncritical parts; authorized mechanical service; complete withdrawal when structural history or condition is unknown. Keep replacement part prices and lead times visible. Define retirement criteria for rails, axles, harnesses and printed structural interfaces from test/field evidence.

A refurbishing program needs inspection, sanitation, compatibility, residual-life and record-transfer procedures. Printable repairs are valuable only when the replacement process preserves the qualified interface. Do not claim recyclability, a carbon reduction or environmental superiority without material/region-specific evidence and an appropriate assessment.

## Custom giant-dog pathway

Dogs beyond the proposed 180 lb catalog envelope need a separately engineered custom-giant program, not an XL override in the size calculator. Buddy's weight has not been supplied, so the present range cannot be represented as a confirmed fit for him. Collect measurements and professional requirements, reassess rails, wheel/axle architecture, stability, harness support and caregiver handling, and qualify the resulting envelope independently. No price or load rating is assigned to this pathway. The verified reference large chair also stops at 180 lb, so there is no established half-price comparison above that range.
