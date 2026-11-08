# Wheelchair CAD evidence and open interfaces

Research checked November 8, 2026. Scope: an XL-first, parametric rear-wheelchair bench prototype with metal structural load paths and printed service parts, followed by all five catalog families. This supplements [the suspension investigation](../product/suspension-research.md) and [Buddy's pending measurements](../product/buddy-first.md). Sample CAD dimensions are neutral modeling inputs, not Buddy's measurements, approved capacities or use settings. No component below is a procurement release.

## Fit inputs and support geometry

Walkin' Pets measures rear-leg height with the dog lying on its side, preserving natural bend rather than extending the limb. Its own sizing system additionally uses armpit-to-rump length for small dogs. These are manufacturer-specific instructions, not a complete measurement specification for this custom design. [Walkin' Pets measurement guide](https://help.walkinpets.com/en-US/how-to-measure-for-a-walkin-wheels-dog-wheelchair-842123)

Its fit guidance aligns the rear knuckle with the hip, places front harness clips behind the shoulder blade, keeps side rails approximately level through the body, and sizes width to the widest body region. It distinguishes ground contact from supported feet. Its quoted leg-ring drop belongs to that product; do not transfer it as a universal saddle dimension. [Walkin' Pets adjustment guide](https://help.walkinpets.com/en-US/how-to-adjust-your-walkin-wheels-842180)

**CAD implication, inferred:** independently parameterize hip datum, rail height/length, inside width, harness attachment location, sling envelope, limb clearance and wheel track. Retain separate ground-clearance and support-position checks across suspension travel. The owner now reports Buddy weighs 140 lb. His measured dimensions, suitable posture and support configuration remain pending; no source establishes them.

## Spring rate, preload and damping

Lee Spring defines rate as force change per deflection and gives the compression-spring relationship `F = k * deflection`. Its tables identify OD, maximum guide-rod diameter, minimum enclosing-hole diameter, wire diameter, free length and solid height. The cited catalog is an older dimensional reference and requires current supplier confirmation. [Lee Spring catalog, printed p. 51](https://www.leespring.de/download/LeeSpring_25Series_EU_Eng.pdf)

**Mechanical inference for a linear spring:** installed preload `p` gives `F = k * (p + x)` within its valid range. Changing `p` changes starting force/position, not `dF/dx = k`. It also consumes compression clearance. This relationship does not determine a dog's hind-limb loading. Progressive springs and linkage geometry require their actual curves.

FOX treats preload, spring replacement, compression damping and rebound damping separately. Its coil-shock manual requires a full-travel clearance check and warns that excess preload can cause coil bind. Rebound damping controls extension speed. Bicycle sag targets and adjustment limits in that manual are specific to FOX bicycle equipment and are not wheelchair settings. [FOX coil-shock manual](https://tech.ridefox.com/bike/owners-manuals/2928/shock--2024-all-coil-shocks-(dhx2-and-dhx-models))

**CAD implication, inferred:** use separately named spring-rate selection, captured preload seat and damper adjustment. Record linkage motion ratio versus travel. Provide positive metal travel stops, a positively retained fixed configuration and replaceable guides. A printed dial must not be the sole spring retainer, load stop or structural lock.

## Commercial damper envelope, not selected hardware

The current ACE HB-12 page lists a 12 mm body, 4 mm rod and 10-80 mm stroke family. Its HB-12-30 table entry has 30 mm nominal stroke and 95 mm nominal extended `L`. The page reports approximately 21% free travel, increased breakaway after rest, adjustment before installation that can add 5 mm to `L`, and customer-provided stops 1-1.5 mm before end of stroke. End fittings require positive security against unscrewing. These constraints make it a candidate for evaluation, not proof it suits repeated small wheel inputs. [ACE HB-12 current data](https://www.ace-ace.com/com/products/motion-control/hydraulic-dampers/hb-12-to-hb-70/hb-12.html)

**Open interface:** do not interpret `L` as eye-center length until the selected fitting drawing confirms its datums. Obtain the current configured drawing, exact stroke and end-fitting codes, pin/bushing diameters and widths, articulated clearance, adjustment access and retention procedure. Confirm damping direction, force versus velocity, breakaway, free travel, operating cycle/heat limits, corrosion/contamination suitability and supplier acceptance of the intended motion. Preserve the CAD damper envelope as a placeholder until then. Nominal industrial force data does not establish wheelchair capacity.

## XL air/coil shock shortlist and RFQ boundary

The CAD request calls for a 165 mm eye-to-eye shock, 35 or 38 mm travel, adjustable rebound, nominal 8 mm pin by 20 mm mounting hardware and a maximum 40 mm body envelope. These are requested interfaces, not a verified purchasable combination.

| Primary-source candidate | Verified | Unresolved or incompatible |
| --- | --- | --- |
| [DNM AO-38AR](https://www.dnmshock.com/products.php?func=p_detail&p_id=20&pc_parent=13) | Product page lists 165 x 38 mm eye-to-eye/travel and adjustable rebound/air pressure | Page says out of stock/contact supplier. No confirmed 8 x 20 hardware, maximum can/adjuster envelope, force curve or low-load tune. Linked manual identifies AO-42AR instead, so supplier must reconcile model naming. |
| [DNM AO-38RC](https://www.dnmshock.com/products.php?func=p_detail&p_id=18&pc_parent=13) | Product page lists 165 x 35 mm and rebound/lockout/air adjustment | Page says out of stock/contact supplier. Pin/width/envelope and usable wheelchair tune remain unverified. |
| [EXA Form 291R](https://exa-form.com/p/291R.html) | First-party description identifies preload-adjustable coil and rebound adjustment | Its official drawing's spring/ring envelope exceeds 40 mm. It is not compatible with that requested envelope. |

The [DNM AO English manual](https://www.dnmshock.com/upload_files/products/18/AO-English.pdf), PDF page 8, printed pp. 31-32, confirms AO-38RC dimensions of 165 +/- 2 mm and 35 +/- 2 mm. Its diameter 28 callout applies to the sliding body, not the largest air can or adjuster. It does not establish a 40 mm overall envelope or 8 x 20 mounting. The [manual linked by AO-38AR](https://www.dnmshock.com/upload_files/products/20/ao-42ar.pdf), PDF page 7, is labeled AO-42AR and shows 165 +/- 2 mm and 38 +/- 2 mm. Both pages were rendered and visually inspected; the naming mismatch remains open.

The [EXA 291R official dimensional drawing](https://exa-form.com/img/products/SUSPENSION/291R/291R_Dimensions.PDF), model 291R-C02 dated 20241011, shows 165 mm C/C with 38 mm travel and C/C tolerance +/- 2 mm. Reference dimensions include 45.5 mm across the coil and 46 mm across the preload ring. Mount width is an unspecified `W`, with tolerance 0/-0.2 mm, so it does not confirm 20 mm hardware or 8 mm pin fit. The drawing was rendered and inspected. The product page's first-party [data file](https://exa-form.com/static/data.js) supplies the drawing URL. Website HTML is partly dynamic; some web parsers omit the specification fields.

**CAD implication, inferred:** a neutral modeled eye distance of 155 mm below nominal 165 mm represents a geometric 10 mm extension allowance only. Supplier length tolerance, actual mounted configuration, suspension endpoints and clearance can reduce that allowance. Verify shock length at both metal stop positions for every radius setting, including tolerance and articulation. A bicycle hydraulic lockout is not the prototype's positive structural lockout. XS/S 75/100 mm shock envelopes remain RFQs; no exact compact adjustable-rebound part was verified. Air pressure is a spring adjustment, not a coil preload adjustment, so labels and documentation must match the actual selected architecture.

## FDM materials and process

Stratasys describes thermoplastic creep under sustained load, weaker interlayer strength, and the value of metallic mounting/wear inserts. These process observations support separating service geometry from primary structure; they do not qualify a hobby printer or filament. [Stratasys FDM tooling guide, printed pp. 5-6](https://go.stratasys.com/rs/533-LAV-099/images/DG_FDMTooling.pdf)

Prusa identifies PETG as a printable technical material with useful toughness and layer adhesion. ASA offers outdoor UV resistance but needs control of warping, enclosure conditions and ventilation. Neither page supplies a fatigue, creep or load rating for a wheelchair part. [Prusa PETG guide](https://help.prusa3d.com/article/petg_2059), [Prusa ASA guide](https://help.prusa3d.com/article/asa_1809)

**CAD implication, inferred:** reserve prints initially for guards, knobs, tube end caps, unloaded locating jigs and replaceable guides around metal-backed joints. Route harness, axle, pivot, spring-seat and stop loads through specified metal hardware. Do not rely on a heat-set insert alone for a primary support joint. Document part orientation and layer interfaces, material/lot, drying, nozzle/layer/perimeter settings, postprocessing, fit inspection and replacement criteria. Test actual printed coupons and assemblies, including sustained clamp compression, weather/cleaning exposure and cyclic wear; do not substitute filament tensile strength for assembly evidence.

## Axle retention and service interfaces

Ruland explains that round-bore clamp collars rely on friction and can move under shock. A threaded interface or an appropriate shaft undercut can provide a positive axial stop. Two-piece collars can be removed without sliding them over the shaft end. [Ruland collar selection](https://www.ruland.com/technical-resources/technical-articles/technical-article-selecting-a-shaft-collar)

Ruland's installation instructions require clean bores, the prescribed shaft preparation, maintained gaps between two-piece halves and the specific recommended screw seating torque. Use the selected product instructions rather than a generic torque guess. [Ruland installation instructions](https://www.ruland.com/technical-resources/installation-instructions)

**CAD implication, inferred:** use metal axles, bearings/spacers and a positively captured outer retention arrangement. A friction collar can locate a component but should not be represented as fail-safe wheel retention by itself. Printed axle caps are covers. Confirm bearing inner-ring clamping, wheel endplay, shaft grooves/threads and fastener locking together so tightening retention does not bind rotation.

## Procurement and verification frontier

| Interface to close | Required before replacing sample geometry |
| --- | --- |
| Dog and harness | Professionally directed dimensions, support/posture requirements, harness supplier geometry, clearances and adjustment ranges |
| Metal tube and crossmembers | Alloy/temper, section/wall, tolerances, telescoping overlap, drilling/joint details, finish and verified structural load cases |
| Spring | Exact stock number/material/end form, OD/ID guide clearances, free and solid lengths/tolerances, rate/load curves, allowable working deflection/cycles and captured seats |
| Damper | Configured drawing and fittings, force-speed/direction evidence, travel including free travel, adjustment envelope and external stops |
| Wheel, axle and pivot | Supplier wheel/bearing drawing, shaft diameter/material, shoulder and spacer stack, bushings, retention and torque/locking instructions |
| Printed service parts | Specific printer/material process, orientation, dimensional coupons, creep/wear checks, inspection and service replacement criteria |
| Assembly | Engineering-approved ballast tests for strength, asymmetric wheel inputs, lockout/stop retention, spring/damper failure, stability, pinch clearance and cleaning/environment exposure |

No exact spring, damper, collar, wheel, bearing, axle or alloy section has been selected by this research. Start with the fixed bench reference and verify actual purchased interfaces before fabricating a load-bearing assembly. Animal fitting and comparative use remain downstream of the existing engineering and professional-review gates.
