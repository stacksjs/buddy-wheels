# XL r1 standard-parts redesign

Scope: a configurable, cut-to-fit XL rigid frame with standard inch tubing, pneumatic wheels, stock shafts, simple repeated metal profiles and nonstructural prints. The $264.50 storefront target is evaluated against a minimum 30% product gross margin, with outbound shipping charged separately. It is a cost feasibility study and bench design, not a production or animal-use release.

The previous r0 platform remains available for all sizes and suspension research. Add an explicitly versioned r1 studio alongside it; do not silently mix r0 STL files or drilling coordinates with r1. r1 frame dimensions change cut lengths, not telescoping interfaces. Buddy's 140 lb is owner reported and his anatomy is still pending.

## Scope review

Core: priced evidence, configured CAD, two repeated metal profile types, printable service/fixture meshes, complete BOM and instructions, native 3D inspection and exact configured downloads, manufacturing economics with paid labor and overhead allowances. No new payment flow, new infrastructure or load-bearing printed parts. Other sizes are unchanged.

## Flow and interfaces

Validated setup -> XLStandard geometry/cut schedule -> OpenSCAD wrapper + native scene + assembly/BOM -> versioned exports/manifest -> allowlisted download. Independent XLStandardCost data -> batch stock nesting + current supplier evidence + unquoted operations -> generated cost docs/CSV/JSON and studio readout. Native Action and Buddy command use these same modules. The existing r0 interfaces are additive and unchanged.

## Test matrix

P0: dimensions, unknown/duplicate inputs, stock packing including kerf, independent bill reconciliation, gross/contribution arithmetic, all STL bodies closed/oriented/in envelope, CAD/source hash integrity, archives and configured dimensions, true part inspection and actual download checksums.

P1: model orbit/zoom, responsive 320/428/768/1440, dark/fallback rendering, clear rigid versus suspension status, shop handoff and all existing r0/commerce/fit journeys.

## Sequence

1. Establish supplier evidence and cost/margin model, including unquoted lines and unresolved supplier interfaces.
2. Generate r1 CAD, BOM, holes, printing and assembly documents. Export actual meshes and verify provenance.
3. Add a native STX r1 studio and download action. Link from XL in the existing studio/shop without replacing other sizes.
4. Run native tests/types/lint and browser QA. Independent Standards/Spec review, push main and native Buddy deployment, then public checks.

Rollback: remove the r1 links/action/view and leave the unchanged r0 studio available. No database migration or order/payment change is involved.

## Suspension decision

Do not include independent adjustable suspension in the $265 base. Its current cost headroom at 30% gross margin is only a few dollars and no compatible, tuned, rated low-cost supplier assembly has been established. Pneumatic tires are compliance, not adjustable independent suspension. Retain r0 as clearly separate research; do not show fake spring controls on r1 or call an RC shock approved for Buddy.

## Design preflight and local verification

Design read: an engineering studio for dog owners, preserving the existing forest/cream product language. Variance 3, motion 1 and density 5: no automatic motion, a large native inspection surface and readable cost/part records. The existing page foundation is native STX, ts-css, Iconify, ModelViewer and Button. No new runtime dependency or design system was added.

Local checks passed: 34 native tests with 1,666 assertions; app lint/type checks; STX 19 scripts and 421 expressions. The new native Chromium journey covers real 3D interaction, actual part meshes, configured form values and document links, all archived checksums, one-versus-100 cost scenarios, failing size/quantity margin gates, four responsive widths, dark-theme contrast and non-WebGL drawing/download fallback. All prior r0 all-size, commerce and fitting browser journeys also passed.

Independent review corrected setup query serialization and dark-panel contrast. Physical qualification, actual hub interfaces and manufacturing RFQs remain open. The manufacturing estimate is not treated as a quote. Existing native capabilities were sufficient, so no generic framework patch or no-op release was introduced.
