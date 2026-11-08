# Buddy XL measurement worksheet

Revision r0, November 8, 2026. Status: **pending input, not fitted**.

Have the treating veterinarian or rehabilitation professional establish whether rear-only support is appropriate and how Buddy can be supported comfortably for measurement. Do not force standing or manipulate painful limbs to fill this sheet. Continue his care independently of this prototype.

| Input | Value | Who measured / method |
| --- | --- | --- |
| Current body weight, kg or lb | Owner reports 140 lb, converted 63.503 kg | Owner report November 8, 2026; confirm with actual scale |
| Clinician-approved supported posture / restrictions | Pending | Named clinician and date |
| A supported floor-to-groin height, mm | Pending | Approved supported posture; record the groin crease landmark and helper |
| E lying rear-leg measurement, mm, separate optional input | Pending | Groin to paw pad with natural bend; never substitute for A |
| B1 hip width, straight across, mm | Pending | Raw full-body width at hips; no added frame clearance |
| B2 widest body width, mm | Pending | Check shoulders, ribs and hips; record widest location without compression |
| C armpit-to-rump length, mm | Pending | Back edge of front-leg armpit to back of rump, excluding tail |
| Chest girth and front harness size | Pending | Follow selected harness supplier method |
| Hind-leg posture and toe/stirrup clearance | Pending | Professional determination, not suspension setting |
| Left/right asymmetry or skin/contact concerns | Pending | Clinician review |
| Available doorway and path width, mm | Pending | Narrowest relevant passage |
| Caregiver lifting/handling and transport limits | Pending | Describe actual use |
| Printer, build volume, nozzle, filament grade | Pending | Do not infer from a slicer preset |

The owner also reports roughly 5 ft 11 in standing reach with paws on his shoulders. This is not a supported rear-height or body-length measurement and is not used to derive fit. The owner authorized a configurable estimated first design.

The current XL rig assumes 620 mm rail-center height, 375 mm between inner rail faces, 680 mm rails, 400 mm wheels and 590 mm overall tire envelope. These are **not Buddy's measurements**. Softgoods offsets, sag, tire deflection and suspension motion must be included when converting anatomy to CAD. Do not simply replace `height` with a groin measurement.

The editable estimate is `designs/wheelchair/profiles/buddy-xl-estimate.json`. The native command exports it separately into `designs/wheelchair/iterations/buddy-xl-estimate/` so the five baseline families stay intact. Change its `id` for a new iteration, change only known geometry keys in `overrides`, and keep anatomical inputs in `context` until reviewed. Use:

```sh
./buddy design:wheelchair --profile designs/wheelchair/profiles/buddy-xl-estimate.json
./buddy design:wheelchair --profile designs/wheelchair/profiles/buddy-xl-estimate.json --export --openscad /absolute/path/to/OpenSCAD
```

The generator rejects unsafe digital combinations such as insufficient tube overlap or shocks reaching their hard ends. Passing those checks does not validate a load case, fit or clinical use. A profile has no safe weight capacity field and cannot mark itself animal-approved.

Next individual revision: retain this baseline, record measured inputs separately, generate a new revision with explicit geometry and collision review, obtain structural/fit review, then follow the bench and supervised evaluation gates. No user-entered measurement should silently overwrite a released part.

Use the [illustrated fit page](https://buddywheels.org/fit-guide), [printable handbook](https://buddywheels.org/measurement-handbook) and [two-page PDF](https://buddywheels.org/guides/buddy-wheels-measuring-guide.pdf). These are raw anatomy fields. Required frame/harness clearance is determined separately; do not add it to the recorded body widths. Our A-E codes differ from supplier order forms.
