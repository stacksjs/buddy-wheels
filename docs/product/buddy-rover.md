# Buddy Rover product and launch brief

November 8, 2026, updated November 11. Second product family: a repairable large-dog adventure carrier. This is a design specification and commercial hypothesis, not a qualified physical product, load rating or use guide. The software catalog and basket work; orders remain gated.

## r0 bench design, November 11, 2026

The first Rover design package now exists: [assembly and cut list](../engineering/rover-r0-assembly.md), [materials and weather system](rover-materials.md), [cost study](../business/rover-r0-costs.md), [scope and verification](../engineering/rover-r0-plan.md), the [design files](../../designs/rover/r0/README.md) and an interactive [Rover studio](https://buddywheels.org/design-studio-rover). It is a bench design. Nothing has been built, loaded, sewn or tested.

What changed from the brief:

- **Steering.** The base rails run about 330 mm past the cabin and carry four short posts and two cross beams. A 10 inch pneumatic swivel caster bolts under the beams. It uses only the existing corner gusset profile.
- **Entry.** Buddy can no longer step up, so the tailgate is the ramp. At the starting size it is 900 mm long and rises 140 mm to a 152 mm deck, about 9 degrees, with curb rails, a grip surface and printed threshold toes so there is no lip at the ground. The ramp stands on its own two feet under the threshold, so a dog's weight there goes to the ground instead of tipping the carrier. Ramp length is configurable and the design refuses anything steeper than 12 degrees.
- **Size.** The starting cabin is 1200 x 700 x 950 mm clear (47.2 x 27.6 x 37.4 in), about twice the stated interior volume of the reference trailer, and it is cut-to-fit from 1000 to 1400 mm long.
- **Weather.** A one-piece pitched roof in solution-dyed fabric, taped roof seams, roll-down clear storm panels, shaded mesh windows, a high rear vent and a floor tub liner, each with a named, priced candidate material and the tests it still owes.
- **Running gear.** Two rear wheels on a repeated stainless hanger profile and a swivel caster at the front. The rear pick is a 15 inch pneumatic wheel (4.00-8) at an observed $32.89 whose supplier states ball bearings, a 5/8 inch bore, a 4 inch hub and a 435 lb load, so its axle can be drawn from stated numbers. The 13 x 4 inch wheel from the XL wheelchair is the budget option at $14.99, and a 20 inch run wheel remains an option with no verified candidate. Each has its own hanger profile on the same deck height. The brake is an open selection.
- **Printing.** Eleven printable service and fixture types plus five fit-check copies of the metal profiles, generated natively and checked as closed single-body meshes.

Two findings need a decision before more design work:

1. **Cost.** The counted bill of materials is about $1,384 per carrier at 100 units and $2,664 for one, against the provisional $399 Run price. The first count was $2,038 and $3,255. Tube, wheels, caster, bolts, plywood and fabric are priced from supplier pages; plates, small hardware and labor are still allowances. Materials alone for one build come to about $1,750, of which $1,294 has a supplier page behind it; see the [buy list](../../designs/rover/r0/buy-list.md). If the tube is bought by weight from a mill at an assumed $4 per pound, the 100-unit figure is about $1,188; that rate has no quote behind it. This architecture does not reach the reference trailer's $729.95 retail price in either case. The catalog price is unchanged until the owner decides between a higher price, a different architecture, or both.
2. **Mass, steering and parking.** The estimate is about 49 kg (108 lb) empty, three times the reference trailer. Steering is now a 10 inch swivel caster on a raised nose, so the carrier turns by pushing the handle sideways instead of lifting a fixed front wheel under a 140 lb dog. A swivel caster can shimmy at a run and the priced one has no swivel lock, so this front end is for walking pace; the fixed fork remains a studio option for running. There is still no wheel brake. Parking relies on wheel chocks, and a dog standing at the tailgate still shifts the balance behind the axle, with tip-stop feet drawn but unproven.

The [build guide](../engineering/rover-r0-build-guide.md) walks one builder through ordering, cutting, drilling and assembly in order, with a base frame plan, a drilling schedule for every tube and a stock nesting plan.

The cost-down pass kept the cabin size, the ramp and the printed parts. It changed the wall fabric, closures, hardware finish, plywood grade, the tube source and cabin alloy, some tube walls and the default wheel, and each change has a stated trade-off in the [cost study](../business/rover-r0-costs.md). The Run configuration is now specified for fresh-water weather. Stainless fasteners and marine plywood come back as the salt-use upgrade for Coast.

## Customer and product job

Help an active caregiver bring a dog along when walking the whole route is unsuitable. Prioritize long-distance running and beach walks, with a dedicated winter conversion. Rover carries the dog; the wheelchair supports an eligible dog's own movement. Do not treat a carrier as a rehabilitation trainer.

Buddy's size makes cabin space and caregiver handling central. Interview runners with older or mobility-limited large dogs, beach walkers, rehabilitation professionals and winter-route users. Learn actual route conditions, dog dimensions, loading methods, storage constraints, repair experience and willingness to pay. Do not recruit dogs into unqualified equipment.

## Reference research

The founder identified the [Burley Bark Ranger XL Ski Bundle](https://burley.com/products/bark-ranger-xl-ski-bundle) as a reference. Its page displayed $900.91 on November 8, 2026, a 100 lb XL pet-and-cargo capacity and 20-inch wheels. Burley's [Ski Kit](https://burley.com/products/ski-kit) describes cross-country skiing and snowshoeing conversion and lists Bark Ranger XL compatibility. On November 11, 2026 the same Burley page listed an interior of 36.2 x 22.4 x 29.9 inches, a 33 lb trailer weight, a 33 inch maximum pet length, a 9 inch step-up at the tailgate, a 6.5 inch trailer drop and overall dimensions of 36.5 x 32.8 x 37.3 inches. Tree Fort Bikes listed the XL trailer alone at $729.95. Burley's standard-size figures could not be read that day and are not quoted. These facts describe Burley's products only. Do not transfer their ratings, compatibility, instructions, reviews or certifications to Rover.

Differentiate through large-dog cabin discovery, long-run handling, beach-serviceable running gear, repair architecture and total delivered cost. Independently engineer the chassis, conversion mounts and restraint system. Bicycle towing is a possible later module requiring separate hitch and dynamic validation; it is not included in the current Rover offer.

## Catalog architecture

| Configuration | Provisional USD price | Design contents |
| --- | ---: | --- |
| Run | $399 | Cabin, floor/liner, chassis, three running wheels, handle, brake and wrist tether |
| Coast | $449 | Run plus wider-wheel beach conversion and easy-clean floor/liner specification |
| Snow | $499 | Run plus skis, dedicated metal mounts, tow shafts and waist harness |
| All-season | $599 | Run plus both Coast and Snow conversion assemblies |

Each is a complete configuration, not an accessory-only purchase. Coast and Snow inherit the Run base; bundle calculations must not count its chassis or cabin twice. Final contents, assembly, price and delivered costs need qualification and quotes. These prices are not a public half-price or performance comparison with Burley.

The storefront deliberately publishes no untested payload, cabin dimensions, speed, distance, gradient, mass or folding-size rating. The planning brief should investigate a large-dog envelope beyond the reference's 100 lb class, followed by a separately qualified giant family. Select actual geometry from measured dogs and caregiver handling trials. Do not simply scale a 100 lb frame or assume Buddy fits.

## Mechanical architecture

Use a metal load-bearing chassis and floor with a defined load path through rated mechanical joints, axles and wheel or ski mounts. Keep the supported floor close enough to the ground to help loading without compromising required clearance. Assess a loading ramp or supported entry method independently. No unsupported jump-in requirement for a compromised dog.

A stable three-wheel running layout needs a positively retained, straight-tracking front assembly, appropriate wheelbase and track, handle ergonomics, controllable braking, a parking function and a secondary caregiver tether. Establish how it behaves if a brake cable, wheel retainer or primary connection fails. Do not rely on friction-only adjustments.

The cabin needs ventilation, adequate settled and seated space, secure closures, escape prevention and a restraint arrangement appropriate to the dog and the intended use. A shifted or standing dog changes the center of mass. Include paws, tail, leash, fur and clothing in the entrapment review. No vehicle-restraint, unattended-use, swimming or medical-treatment claim.

## Printable and serviceable parts

Use printed covers, guides, organizers and replaceable non-primary service parts first. Axles, forks, brake anchors, ski/tow connections and primary loaded joints require independently reviewed mechanical designs; a home print is not an acceptable substitution by default. Any printed safety-critical component needs qualified material, geometry, process, orientation, batch testing and traceability before release.

Design replaceable liners, fabric panels, wheels, bearings, brake components and conversion parts. Use captive hardware where practical, clear revision marking and service instructions. Evaluate corrosion isolation, drainage, cleaning, cold brittleness, UV, sand ingress and parts availability. A proprietary consumable should need a real functional reason.

## Route-specific qualification

| Track | Questions to resolve before release |
| --- | --- |
| Long-distance Run | Tracking and front-wheel shimmy, emergency stopping, braking temperature, dynamic dog movement, repeated impacts, tire/axle retention, handle fatigue, cadence clearance, rolling resistance and caregiver effort |
| Coast | Firm wet shoreline versus loose dry sand, wheel sinkage, steering and braking effort, side slope stability, salt/sand ingress, corrosion, drainage and cleaning; start with firm routes rather than assuming every beach is passable |
| Snow | Ski flotation and tracking, mount retention, articulation, tow-shaft loading, stopping and downhill push, icing, cold material behavior, harness release, thermal comfort and rescue handling |
| Common chassis | Static proof and fatigue, asymmetric loads, curb/threshold events within intended limits, tip stability, restraint/escape, floor support, thermal/ventilation conditions and setup mistakes |

An independent engineer defines fixtures, worst cases, acceptance limits, factors, sample counts and applicable standards before testing. Use ballast for proof, overload and failure exploration. A smooth-looking render or a component vendor's rating does not qualify the assembled carrier.

After bench approval, use an appropriate consented, professionally advised fit and handling study with defined stop rules. Evaluate the dog and the caregiver. Release each configuration's own payload, geometry, speed, distance, surface, slope, temperature and inspection limits. A passed Run chassis does not automatically qualify Coast, Snow or giant variants.

## Commercial and operational gate

Use [the reproducible economics](../business/rover-unit-economics.md) as a hypothesis. Obtain supplier, assembly and dimensional-freight quotes, including separate conversion packaging, before placing a production order. Include reject allocation, warranty/returns, support, seasonal inventory and replacement-part availability. The previous wheelchair startup budget does not include Rover engineering or tooling.

Qualify Run first, then Coast and Snow independently. Keep the software order gate until engineering, fit, manufacturing, instructions, support, inventory, shipping/tax/payment and incident response are ready. No paid preorder or reservation substitutes for that gate. Record the evidence with the change that enables orders.

## Software acceptance

Nine native product rows now cover five wheelchair sizes and four Rover configurations. Existing native Product/Cart/CartItem tables, signed cookies and server-side price lookup remain the commerce boundary. Wheelchair sizing continues to use only the five wheelchair records. Rover links, prices, contents, imagery, mobile purchase and mixed-basket totals are verified in the retained browser journey.

The Run image also illustrates Coast and All-season with an explicit shown-configuration caption. Snow has a separate visualization. Images are original generated design renders, not product photography or manufacturing evidence.
