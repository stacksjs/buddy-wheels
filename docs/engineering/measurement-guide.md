# Illustrated customer measurement guide

November 8, 2026. The native STX fit page combines six original anatomical schematics, step-specific instructions, a local worksheet and a separate size helper. It collects a clear first measurement record; it does not establish clinical suitability, prescribe posture or approve a chair.

## Landmarks and codes

Our codes are specific to Buddy Wheels. They do not reproduce another manufacturer’s ordering form.

| Code | What to record | Exact landmarks | Method to preserve |
| --- | --- | --- | --- |
| A | Supported groin height | Level floor to underside at the front of the hind-leg attachment/groin crease | Vertical measure in the comfortable supported posture approved by the treating professional |
| B1 | Full-body hip width | One outside body edge to the opposite edge at the hips | Straight across, perpendicular to the spine, no squeezing or added clearance |
| B2 | Widest body width | Check shoulders, rib cage and hips; record the largest straight cross-section | Note which location was widest, coat and asymmetry |
| C | Body length | Back edge of the front-leg armpit to the back of the rump before the tail | Straight horizontal distance; exclude head, neck and tail |
| D | Chest girth | Around the widest rib-cage area just behind the front legs | Circumference with a soft tape, flat against the coat without tightening |
| E | Optional lying rear-leg measurement | Groin crease/top inside of the hind leg to underside of hind paw pad | Dog rests on their side, natural bend, no pulling; keep this method attached to the number |

**A and E are different measurements.** If supported standing is uncomfortable or unapproved, leave A pending and record E separately if it can be measured comfortably. Never copy E into A. Never map A directly into CAD rail-center height: harness offsets, padding, sag, suspension position, tire deflection and body clearance need separate engineering and fitting review.

Use two helpers when appropriate and directed by the care professional. One supports the dog; the other reads the measuring tool. Use a rigid ruler/yardstick for straight distances, a soft tape for girth, and parallel boards for a wide body. Do not clamp the dog with a metal caliper. The 150 mm caliper in the build budget is a part-inspection tool, not a dog-width tool. Do not force limbs or delay care to complete a sheet.

Repeat each measurement using the same landmarks and approved posture. Record date, units, helper, thick coat, asymmetry and any posture change. Leave missing values pending rather than guessing. Follow the actual selected harness supplier’s method for final sizing and fit. New or sudden loss of hind-leg use requires urgent veterinary assessment independently of this prototype.

## Customer workflow

1. Select A, B1, B2, C, D or E. The image, start/end points, method, tool and common mistakes update together. Radio controls support keyboard navigation and use large touch targets.
2. Enter measurements in inches/lb or centimeters/kg. Switching units converts entered values, including weight, instead of relabeling them. Conversion rounds to two decimal places and does not increase measurement precision. Retain original tape/scale units in the notes if needed.
3. Use “Reset worksheet for Buddy” only when starting a fresh record for Buddy. It clears previous breed, anatomy, posture, notes and size-helper values, then fills his name and owner-reported 140 lb (about 63.5 kg). Other customers start blank.
4. Review the copyable text. Empty fields show PENDING, and A/E method labels remain explicit. Invalid nonpositive or malformed numbers disable copying until corrected. Editing a field clears an old clipboard confirmation.
5. Copy the record into the fitting conversation. If clipboard permission is unavailable, select/copy the read-only text manually. The clipboard changes only after a user action; there is no automatic send to Buddy Wheels.
6. The existing size helper uses weight and **E only**, never A. “Use weight and E from the worksheet” copies only those fields and the matching units. Proposed catalog ranges are not tested load ratings or fit approvals. They do not map automatically to the studio’s bench geometry.

## Privacy and persistence

Worksheet values live in STX page state. No form POST, API call, analytics event, localStorage or server-side record saves them. The public PDF is a blank static worksheet, not a personalized file. Leaving/reloading the page can lose entries; copy them first. Ordinary website access and static assets still generate normal server requests. Do not describe this as an encrypted medical-record service.

## Art, handbooks and source evidence

The six SVG files in `public/guides/measure-*.svg` are original code-authored anatomical diagrams. They are functional annotations, not decorative icons or copied supplier artwork. The body is a schematic dog, not a photograph or measured likeness of Buddy. Width examples do not predict which body station is widest. The lying illustration is a separate resting-side view with a natural bend and no floor datum.

- [Walkin’ Pets SureFit guide](https://walkinpets.com/pages/wheelchair-sizer/) supports the lying, natural-bend rear-leg method and armpit-to-rump landmark.
- [Eddie’s Wheels visual measuring guide](https://eddieswheels.com/files/A_Visual_Guide_to_Measuring_Your_Pet_-_Eddies_Wheels_for_Pets_-_The_Pet_Mobility_Experts.pdf) supports distinguishing supported groin height and straight widths. Their codes, clearances and cart-ordering dimensions differ; do not use our worksheet to fill their form without following their instructions.
- [Ruffwear girth-measuring explanation](https://ruffwear.com/blogs/explored/the-size-is-right-how-to-measure-for-your-dogs-gear) supports the rib-cage circumference landmark. It does not establish that a Ruffwear harness is a compatible rear support or anchor for this CAD.

Buyer downloads: [measuring handbook](https://buddywheels.org/measurement-handbook), [two-page PDF](https://buddywheels.org/guides/buddy-wheels-measuring-guide.pdf), [XL budget handbook](https://buddywheels.org/prototype-budget), [budget PDF](https://buddywheels.org/guides/buddy-wheels-xl-build-budget.pdf) and [cost CSV](https://buddywheels.org/guides/xl-prototype-budget.csv).

## Native authoring and verification

- Content/record logic: `app/Fitting/Measurements.ts`.
- Interactive page: `resources/views/fit-guide.stx`, native signals, radio inputs, Button and STX clipboard helper.
- Original SVG generation: `scripts/measurement-art.ts`.
- Handbooks: native STX views with `public/assets/handbooks.css`, explicit print page boundaries and selectable text.
- PDFs: `scripts/export-guides.ts` uses `@stacksjs/testing/browser` and Chromium `Page.printToPDF`; no PDF application/runtime library is added. Tagged PDFs have no embedded JavaScript or submitted personal information. Static paper blanks are not claimed to be fillable PDF forms.
- Cost data/docs: `app/Designs/PrototypeBudget.ts`, `scripts/prototype-cost.ts`, integer cents and explicit scenario reserve bases.

```sh
bun run guides:art
bun run finance:prototype
./buddy dev
# In a second terminal with Chrome available:
bun run guides:pdf
./buddy lint
./buddy typecheck
bun run typecheck:views
./buddy test
bun run test:fit
```

Render generated PDFs to images for visual QA; verify page counts and readable text as well as the online layout. The budget is deliberately split into four pages, and the measurement guide into two. Test the public site again after native `buddy deploy`. The retained browser journey covers all six illustrations, clipboard output, unit conversion, pending/invalid entries, height-method separation, size-helper handoff, four viewport widths and published PDF/CSV/JSON downloads. The existing commerce and 3D studio journeys protect the adjacent flows.
