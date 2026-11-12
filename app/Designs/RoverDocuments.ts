import type { RoverSetup } from './Rover'
import { referenceCarrier as ref, roverCode, roverDimensions, roverHardware as h, roverPartFile, roverParts, roverPlanningDogKg } from './Rover'
import { roverAllowanceNotes, roverCostLines, roverCostModel, roverEconomics, roverPriceDate, roverPriceEvidence } from './RoverCost'
import { roverCover, roverCoverSvg, roverMaterialAlternates, roverMaterials, roverTextileCost, roverTextileDate } from './RoverSoftGoods'
import { signedMoney as money } from '../Storefront/Catalog'

const csv = (rows: (string | number)[][]) => rows.map(row => row.map(v => `"${String(v).replaceAll('"', '""')}"`).join(',')).join('\n') + '\n'
const inch = (n: number) => (n / 25.4).toFixed(1)
const WALL = { heavy: '6061-T6 1 x 1 x .125 inch square tube', light: '6061-T6 1 x 1 x .065 inch square tube' } as const

export function roverPrintQuantities(s: RoverSetup): Record<string, number> {
  const c = roverDimensions(s).counts
  return { cap_heavy: c.capHeavy, cap_light: c.capLight, ramp_toe: c.toe, ridge_saddle: c.saddle, fabric_clip: c.fabricClip, cable_clip: c.cableClip, axle_cover: c.axleCover, guide_butt: 1, guide_run: 1, guide_tee: 1, coupon: 1, tee_gusset: c.tee, corner_gusset: c.corner, axle_hanger: s.wheel === 'run' ? c.hanger : 0, axle_hanger_low: s.wheel === 'path' ? c.hanger : 0 }
}
export function roverBom(s: RoverSetup): string {
  const d = roverDimensions(s); const c = d.counts; const q = roverPrintQuantities(s); const w = d.wheel
  return csv([
    ['ID', 'Quantity', 'Part', 'Specification', 'Status'],
    ...d.cuts.map(cut => [cut.id, cut.qty, cut.name, `${WALL[cut.wall as 'heavy' | 'light']}; cut ${cut.length} mm`, 'Cut to fit. Not telescoping']),
    ['M01', c.corner, 'Corner gusset', '6061-T6 3.175 mm, metal/corner_gusset.dxf', 'One profile, flipped for the opposite hand. Single outside plate at the eight corner-post joints. Fatigue and bearing review pending'],
    ['M02', c.tee, 'Tee gusset', '6061-T6 3.175 mm, metal/tee_gusset.dxf', 'Single-sided at base cross members and roof bow; paired at the fork'],
    ['M03', c.hanger, 'Axle hanger', `304 stainless 3.175 mm, metal/${w.hanger}.dxf`, 'Paired on every axle post and fork stub. Finish the 19.25 mm bore after drawing review'],
    s.wheel === 'path'
      ? ['W01', 3, 'Pneumatic wheel candidate, 13 x 4 inch', `HAUL-MASTER 67467; 330.2 OD, 101.6 wide, 15.875 bore; hub through-length assumed ${s.hub} mm`, 'Same candidate as the XL wheelchair. Hub length is not confirmed by the supplier. A garden-cart wheel for walking pace; its supplier rating is not a carrier rating']
      : ['W01', 3, 'Pneumatic wheel, 20 inch', `508 OD, about ${w.tire} wide, 15.875 bore; hub through-length assumed ${s.hub} mm`, 'OPEN SELECTION. No verified wheel with this bore and a suitable rating has been found'],
    ['W02', 2, 'Rear stub axle', `Plain 15.875 steel shaft; cut ${d.rearShaft} mm; two 3.2 cross-holes 8 mm from each end`, 'Unkeyed precision shaft. Never a threaded journal'],
    ['W03', 1, 'Front through axle', `Plain 15.875 steel shaft; cut ${d.frontShaft} mm; two 3.2 cross-holes 8 mm from each end`, 'Carried in both fork stubs'],
    ['W04', 4, 'Axle sleeve', '4130 tube 19.05 OD x 1.4732 wall; cut 25.4 mm', 'Through each axle post and fork stub. Steel, not printed'],
    ['W05', w.forkSpacer ? 4 : 2, 'Wheel spacer', `4130 tube 19.05 OD x 1.4732 wall; cut ${w.spacer} mm`, w.forkSpacer ? 'Two at the rear wheels, two beside the front hub so the wide tire clears the fork. Check actual hub and bearing face contact' : 'Rear wheels only. Check actual hub and bearing face contact'],
    ['W06', 8, 'Thrust washer and split cotter set', '5/8 inch bore washer 1.5 mm; 3.2 mm stainless cotter', 'Rear: 2 washers and 2 cotters per side. Front: 4 washers and 2 cotters'],
    ['H01', c.bolts, 'Joint bolt', '1/4-20 x 2 inch SAE J429 grade 5 zinc hex bolt', 'Partially threaded shank required at sleeves. Torque procedure pending. 18-8 stainless is the salt-use upgrade'],
    ['H02', c.handleBolts, 'Handle lap bolt', '1/4-20 x 3 inch grade 5 zinc hex bolt', 'Through one handle arm and one post'],
    ['H03', c.sleeves, 'Crush sleeve', '4130 .375 OD x .049 wall; cut 25.4 mm', 'One per tube crossing. Corrosion finish between steel and aluminum pending'],
    ['H04', 2 * (c.bolts + c.handleBolts), 'Bolt washer', '1/4 inch zinc steel flat washer', 'Two per bolt'],
    ['H05', c.bolts + c.handleBolts, 'Prevailing-torque nut', '1/4-20 zinc nylon-insert locknut', 'New nuts at every assembly'],
    ['F01', 1, 'Floor panel', `15/32 inch (12 mm) BC exterior plywood ${d.rail} x ${s.width + 2 * h.tube} mm, six post notches 44 x 30, sealed all faces and edges; marine plywood for salt use`, 'Sits on gussets and bedding tape. Deflection under a standing dog not yet calculated'],
    ['F02', 1, 'Bedding tape', '3.2 mm closed-cell tape, 25 mm wide, about 9 m', 'Fills the gusset thickness under both panels'],
    ['F03', c.floorScrews, 'Floor fastener set', '1/4-20 stainless countersunk screw with rivet nut in the tube top wall', 'Rivet nut pull-out in .125 wall to be tested'],
    ['R01', 1, 'Ramp panel', `15/32 inch (12 mm) BC exterior plywood ${s.ramp} x ${d.rampWidth} mm, sealed all faces and edges, toe edge fitted with printed threshold toes`, 'Curb rails on top, two ribs underneath'],
    ['R02', 1, 'Continuous hinge', `Stainless, ${Math.floor(d.rampWidth / 25.4 / 6) * 6} inch nominal, leaves on the top faces`, 'Knuckle sits in the 6 mm gap. Pinch review pending'],
    ['R03', 2, 'Draw latch with keeper', 'Stainless, with a secondary catch', 'Holds the raised ramp to both rear posts'],
    ['R04', 1, 'Tailgate safety strap', '1 inch webbing with a metal hook, independent of both latches', 'Second retention path if a latch opens'],
    ['R05', c.rampBolts, 'Ramp carriage bolt', '1/4-20 x 2 inch stainless carriage bolt, washer and locknut', 'Smooth heads on the walking side'],
    ['R06', 2, 'Ramp stand foot', '3/8-16 swivel leveling foot in a 1 inch square tube threaded insert', `Leg cut ${d.legCut} mm assumes a ${h.foot} mm foot. Adjust on level ground`],
    ['B01', 1, 'Brake set', 'Hand lever, cables and one brake per rear wheel, with a parking lock', 'OPEN SELECTION. No brake has been designed or tested'],
    ['B02', 1, 'Handle grip and wrist tether', `Foam grip for 25.4 tube over ${d.grip} mm; 1.2 m wrist tether`, 'Tether is a secondary link to the caregiver'],
    ['S01', 2, 'Tip-stop foot', '3/8-16 leveling foot with 100 mm stem through each base rail behind the axle, jam nuts and fender washers', 'Catches a rearward tip. Height setting and strength are untested'],
    ['X01', 1, 'Roof ridge pole', `12.7 mm aluminum tube, cut ${d.rail} mm`, 'Rests in three printed saddles'],
    ['T01', 1, 'Weather cover set', 'Roof and wall shell, mesh windows, clear storm panels, hook and loop, seam tape, reflective trim', 'See cover-cut-schedule.csv and materials.md. No sewn sample exists'],
    ['T02', 1, 'Floor set', 'Two EVA pad halves under a vinyl tub liner with a threshold flap', 'Removable for washing'],
    ['T03', 1, 'Ramp traction surface', `5 mm adhesive EVA, ${d.rampWidth - 2 * h.tube} x ${s.ramp} mm between the curbs`, 'Wet grip unproven'],
    ['T04', 2, 'Interior tether loop', '1 inch webbing loop around a base rail with a 316 D-ring', 'Positioning aid only. Not a restraint rating'],
    ...roverParts.filter(p => p.kind !== 'metal').map(p => [`P-${p.id}`, q[p.id]!, p.name, roverPartFile(p.id), p.note]),
  ])
}
export function roverCoverCsv(s: RoverSetup): string {
  const cover = roverCover(s)
  return csv([['ID', 'Quantity', 'Piece', 'Material', 'Width mm', 'Length mm', 'Notes'], ...cover.pieces.map(p => [p.id, p.qty, p.name, roverMaterials.find(m => m.id === p.material)!.name, p.width, p.length, p.note]),
    ['Z02', 1, 'Hook tape and loop tape', '2 inch', '', cover.lengths.hookLoop, 'Same length of each side: storm panel sides and sills plus 24 cover tabs'],
    ['Z03', 1, 'Seam tape', '20 mm', '', cover.lengths.seamTape, 'Roof-to-wall seams'],
    ['Z04', 1, 'Reflective trim', '1 inch sew-on', '', cover.lengths.reflective, 'Full perimeter at wheel-top height'],
    ['Z05', 1, 'Roof hem shock cord', '3/16 inch', '', cover.lengths.cord, 'Drawn snug under the top rails'],
    ['Z06', 1, 'Webbing', '1 inch polyester', '', cover.lengths.webbing, 'Two tether loops, grab loop, eight roll-up ties, wrist tether']])
}

export function roverMaterialsMarkdown(s: RoverSetup): string {
  const cover = roverCover(s); const d = roverDimensions(s)
  return `# Buddy Rover r0 materials and weather system

Configuration ${roverCode(s)}. Supplier pages read ${roverTextileDate} unless a row says otherwise. These are costing candidates and a design intent. No fabric has been bought, sewn, soaked, sun-aged or tested, and nothing here is a waterproof, UPF or temperature claim.

## How the cabin handles weather

| Exposure | Design answer | What still has to be proven |
| --- | --- | --- |
| Rain | One-piece roof in the better, solution-dyed fabric, with no seam on top, pitched over a ridge pole ${h.ridge} mm above the frame so water runs to both sides. 40 mm drip overhangs. Roof-to-wall seams taped; wall corner seams lapped and left untaped under the overhang. Rear header overlaps the raised ramp. Floor tub liner with 80 mm upturned walls. | Spray and pooling test on the sewn roof. Hydrostatic head of fabric and taped seams. Target to verify: 1,500 mm or better at the roof. |
| Wind | Clear roll-down storm panels on both sides and the front, held by hook and loop down the sides and along the sill. Solid ramp panel as the tailgate, with fabric gussets to the rear posts. | Flap noise and billow at running speed. Whether a nervous dog tolerates it. |
| Sun | Solution-dyed roof fabric the supplier credits with excellent UV resistance, mesh with a stated 70% shade factor, and an optional reflective liner under the roof that is not in the base cost. | UPF of the roof assembly and interior temperature rise in direct sun, panels open and closed. The priced roof is black and the walls charcoal, which run hot; a light roof must be sourced and re-priced. The wall fabric is not solution dyed and will fade. |
| Heat | Three large mesh windows plus a high rear vent that stays open under the roof overhang even with storm panels down. | Airflow and temperature limits. A closed cabin is not safe in heat until measured. |
| Cold and snow | Clear panel with a stated -20 F cold-crack rating, EVA floor pad under the liner. | Panel handling with gloves, hook and loop packed with snow, icing, condensation. |
| Sand and salt | Aluminum frame and gussets, stainless hangers and rings, rinse-out liner. The Run hardware is zinc-plated steel and the panels exterior plywood; salt use needs the stainless fastener and marine plywood upgrades. | Fastener, sleeve and axle corrosion, sand in bearings and hook tape. |
| Wet paws on the ramp | 5 mm diamond EVA surface between two 25 mm curb rails, printed threshold toes at the ground edge. | Grip when wet at ${d.rampAngle.toFixed(1)} degrees, claw wear. |

## Layers and candidates

| Layer | Candidate | Observed price | Guards against | Supplier facts | Caveat |
| --- | --- | ---: | --- | --- | --- |
${roverMaterials.map(m => `| ${m.layer} | [${m.name}](${m.url}) | ${money(m.cents)} per ${m.unit} | ${m.guards} | ${m.facts} | ${m.caveat} |`).join('\n')}

${roverMaterialAlternates.map(a => `- ${a}`).join('\n')}

## Cut schedule for this configuration

Cover height ${cover.coverH} mm, window sill ${cover.sill} mm above the base rail, window height ${cover.windowH} mm, rear header ${cover.headerH} mm. All blanks are rectangles with 15 mm seam allowance included. See cover-cut-schedule.csv and cover-panels.svg.

| ID | Qty | Piece | Material | Width | Length |
| --- | ---: | --- | --- | ---: | ---: |
${cover.pieces.map(p => `| ${p.id} | ${p.qty} | ${p.name} | ${p.material} | ${p.width} | ${p.length} |`).join('\n')}

## Sewing and sealing notes

1. Sew with Tex 90 bonded polyester and a size 18 to 20 needle. Use lapped or flat-felled seams on the shell so water runs over, not into, each seam.
2. Tape the roof-to-wall seams from the inside and prove adhesion on offcuts of both fabrics first. Lap the wall corner seams so they shed outward.
3. Bind every mesh edge inside a shell frame. Never leave a raw mesh edge where a nose or claw can reach it.
4. Hem the roof skirt around the shock cord. Add reflective trim on both sides and the rear at wheel-top height.
5. Bind the four cutouts where the handle arms cross the rear and axle posts so metal clamps metal.
6. The cover hangs on the frame with printed rail clips and hook-and-loop tabs. Neither is a restraint. Escape prevention, tether anchors and chew resistance need their own design review.

## Tests before any dog rides

Spray and pooling, hydrostatic head, UPF, interior temperature rise, airflow with panels down, cold handling, wet ramp grip, mesh push-out and chew, hook and loop cycling with sand, colorfastness, and a flame behavior check of every layer.
`
}

export function roverAssembly(s: RoverSetup): string {
  const d = roverDimensions(s); const c = d.counts; const q = roverPrintQuantities(s)
  return `# Buddy Rover r0 bench assembly

Configuration ${roverCode(s)}. All dimensions mm. BENCH DESIGN. NOT FOR ANIMAL USE. No payload, speed, distance, slope or surface rating exists. Buddy is owner-reported 140 lb; his measurements and suitability for a carrier are not established.

## What this revision is

A large cut-to-fit carrier built from two wall thicknesses of 1 inch 6061-T6 square tube, three repeated flat metal profiles, plywood panels and printed service parts. The tailgate is the ramp: it folds down to a ${d.rampAngle.toFixed(1)} degree walk-in with no step, and stands on its own two feet so the dog's weight on the threshold goes to the ground instead of tipping the carrier. Three matching wheels, here the ${d.wheel.label}. Push handle with a fixed front wheel.

Coordinates: X forward, Y across, Z up. Origin on the ground under the rear axle.

## Your configuration

| Item | Value |
| --- | ---: |
| Clear cabin length between end posts | ${s.length} (${inch(s.length)} in) |
| Clear cabin width between side rails | ${s.width} (${inch(s.width)} in) |
| Clear cabin height, deck to top rail | ${s.height} (${inch(s.height)} in) |
| Deck height above ground | ${d.deck} (${inch(d.deck)} in) |
| Ramp length and width | ${s.ramp} x ${d.rampWidth} |
| Ramp rise and incline | ${d.rampRise} rise, ${d.rampAngle.toFixed(1)} degrees |
| Rear axle ahead of the tailgate plane | ${s.axle} |
| Wheelbase | ${d.wheelbase} |
| Handle height | ${s.handle} (${inch(s.handle)} in) |
| Overall length, width over axle ends, height | ${d.overallLength} x ${d.overallWidth} x ${d.overallHeight} |
| Ground clearance under the base gussets | ${d.clearance} |
| Wheel | ${d.wheel.label} |
| Assumed wheel hub through-length | ${s.hub} |
| Estimated empty mass, arithmetic only | ${d.carrierKg} kg (${(d.carrierKg * 2.2046).toFixed(0)} lb) |

## Stated geometry beside the reference trailer

${ref.name} figures are the maker's published numbers, read ${ref.checked} at ${ref.url}. They describe that product only. Nothing about its capacity, testing or use transfers to Rover.

| Stated figure | ${ref.name} | Rover r0, this configuration |
| --- | ---: | ---: |
| Interior length | ${ref.interiorIn[0]} in | ${inch(s.length)} in |
| Interior width | ${ref.interiorIn[1]} in | ${inch(s.width)} in |
| Interior height | ${ref.interiorIn[2]} in | ${inch(s.height)} in |
| Interior volume ratio | 1.0 | ${d.volumeRatio.toFixed(2)} |
| Entry | ${ref.stepUpIn} in step-up at a tailgate | ${d.rampAngle.toFixed(1)} degree ramp, no step |
| Weight | ${ref.weightLb} lb | about ${(d.carrierKg * 2.2046).toFixed(0)} lb estimated |
| Capacity | ${ref.capacityLb} lb stated by its maker | none. Untested bench design |

Rover is much larger and much heavier. The mass is the price of a bolted frame and plywood panels and is the first thing a second revision should reduce.

## Planning statics, not test results

With a ${roverPlanningDogKg} kg (160 lb) planning mass centered in the cabin, its center sits ${d.centerAhead} mm ahead of the rear axle. The front wheel then carries about ${d.frontShare.toFixed(0)}% of that mass, and lifting the front wheel to steer takes roughly ${d.tiltForceN} N (${d.tiltForceLbf} lbf) down on the handle. A dog that stands at the tailgate moves the center behind the axle. The two tip-stop feet exist for that case and their setting and strength are unproven. A swiveling, lockable front wheel may be the right answer for walking pace and is not designed here.

## Cut list

| ID | Qty | Member | Stock | Cut |
| --- | ---: | --- | --- | ---: |
${d.cuts.map(cut => `| ${cut.id} | ${cut.qty} | ${cut.name} | ${cut.wall === 'heavy' ? '.125 wall' : '.065 wall'} | ${cut.length} |`).join('\n')}

Total ${d.heavyM.toFixed(2)} m of .125 wall and ${d.lightM.toFixed(2)} m of .065 wall. Base cross members sit at X = ${d.stations.join(', ')}.

## Joint patterns

Every joint is a flat gusset with 1/4 inch bolts through steel crush sleeves. Hole centers are measured from the joint centerline, where two tube centerlines cross.

| Profile | Qty | Holes from the joint centerline | Where |
| --- | ---: | --- | --- |
| Corner gusset | ${c.corner} | Leg A 50 and 80. Leg B 35 and 65 | Corner posts on the outside face only, axle-post tops both faces, rail to cross member, roof corners, handle grip, ramp legs |
| Tee gusset | ${c.tee} | Bar 30 each side. Stem 35 and 60 | Intermediate base cross members, mid roof bow, fork arms top and bottom |
| Axle hanger, ${d.wheel.label} | ${c.hanger} | Bar 30 each side. Stem ${d.wheel.posts.join(', ')}. Axle bore at ${d.wheel.rise} | Both faces of each axle post and each fork stub |

Legs A and B alternate where two gussets meet on one tube, so bolts cross 15 mm apart and never share a station. Tube bores are 9.725 for the sleeves, plate holes 6.75, axle sleeve bores 19.25. All are nominal. Use the three printed drill guides for pilot centers and finish with metal tooling.

## Build order

1. Print the clearance coupon and measure it. Print one cap and one clip before batching.
2. Cut and deburr every tube. Mark each with its ID.
3. Base frame: two side rails, ${d.stations.length} cross members. Corner gussets under each corner, tee gussets under each intermediate member.
4. Axle posts at X = 0 with paired hangers. The hanger bar bolts to the rail, the stem to the post. Fit the 19.05 axle sleeve through post and both hangers.
5. Corner posts with one corner gusset on the outside face, leg A up the post, and washers on the inside.
6. Top rails, three top cross tubes, corner gussets on top, tee gussets at the mid bow.
7. Fork: two arms butt against the front cross member at Y = ${d.forkY} each side, tee gussets above and below. Stub posts with paired hangers at the front axle, ${d.wheelbase} ahead of the rear axle.
8. Floor panel on bedding tape, fastened to the frame.
9. Ramp: panel, two curb rails on top, two ribs underneath at 40 mm and mid length, stand legs on the hinge-end rib ${60} mm in from each edge. Hinge leaves on the top faces of floor and ramp.
10. Handle arms on the outside of the rear and axle posts at Z = ${s.handle}, one 3 inch bolt per post. Grip tube between the arm ends.
11. Wheels, washers and cotters. Rear stack between outer washer faces ${d.rearStack}, front ${d.frontStack}, each with 0.5 total end float.
12. Tip-stop feet, brake, latches, safety strap. Then the cover.

## The ramp

Lowered, the panel runs from the deck at ${d.deck} down to the ground over ${s.ramp}. The two stand feet under the hinge end touch the ground directly below the threshold. Set them on level ground so the hinge carries no bending. The walking width between the curb rails is ${d.rampWidth - 2 * h.tube}. Three printed toes slide onto the ground edge and take the last 20 mm down to nothing.

Raised, the ramp is the tailgate. Two draw latches hold it to the rear posts and the safety strap is a second, independent hold. The stand legs then point backward about ${Math.round(d.legCut + h.foot)} mm at shin height. The handle reaches ${h.reach} mm behind the tailgate. Stride clearance has to be checked by a runner before this layout is accepted.

Each rear axle end stands ${d.cabinIntrusion} mm into the cabin, about ${Math.round(d.R - d.deck)} mm above the deck. Cover it and review it for fur, paws and hips.

## Printing

${roverParts.filter(p => p.kind !== 'metal').map(p => `- ${p.name}, ${roverPartFile(p.id)}, quantity ${q[p.id]}. ${p.note}`).join('\n')}

Meshes are exported in print orientation at 1:1 in millimeters and fit a 220 x 220 x 100 mm envelope. Never scale one to fit. Use PETG for indoor fit trials and ASA for parts that will live in sun. Starting point only: 0.4 mm nozzle, 0.2 mm layers, four walls, 30% infill; five walls and 50% for the ramp toes, which carry paw load against the ground. Print clips on end so the snap flexes along the layers. The ramp toe slot is an 18 mm overhang and needs support or a slower bridge. Record filament, settings, measured fit, grams and failures.

Files prefixed FIT_CHECK_ONLY are plastic copies of metal parts for checking hole patterns. Cut the real ones from metal/*.dxf. No printed part here carries the dog, a wheel, the ramp hinge, a latch, a brake or a tether.

## Release gates

1. Buddy's measurements, lying length and standing height first, and a veterinary view on whether riding suits him.
2. Engineering review of the frame, the axle hangers, the ramp and its stand, the handle and the tip-stops, including steel-to-aluminum corrosion.
3. A measured wheel: actual hub length, bearing fit and a rating that suits the carrier, then the brake. The 13 inch candidate is a garden-cart wheel for walking pace; a running wheel is still an open selection. Until wheel and brake are proven the running gear is a placeholder.
4. Ballast tests to an approved plan: static proof, ramp load at mid span and at the threshold, tip in every direction, curb and brake events, fatigue.
5. Cover tests listed in materials.md.
6. Only then a supervised, consented fit and handling study with stop rules.

Digital mesh checks and a tidy drawing prove none of this.
`
}

/** Dimensioned side and top views generated from the same numbers as the cut list. */
export function roverDrawing(s: RoverSetup): string {
  const d = roverDimensions(s); const t = h.tube; const k = 0.2; const pad = 60
  const minX = d.hingeX - s.ramp - 60; const maxX = d.wheelbase + d.R + 40; const top = d.overallHeight + 40
  const X = (x: number) => ((x - minX) * k + pad).toFixed(1); const Z = (z: number) => ((top - z) * k + pad).toFixed(1)
  const W = ((maxX - minX) * k + 2 * pad); const sideH = top * k + pad; const y0 = sideH + pad + (d.overallWidth / 2 + 40) * k
  const Y = (y: number) => (y0 - y * k).toFixed(1); const H = y0 + (d.overallWidth / 2 + 40) * k + pad
  const box = (x: number, z: number, w: number, hgt: number, fill = '#b4bfb8') => `<rect x="${X(x)}" y="${Z(z + hgt)}" width="${(w * k).toFixed(1)}" height="${(hgt * k).toFixed(1)}" fill="${fill}" stroke="#26332c" stroke-width=".5"/>`
  const plan = (x: number, y: number, w: number, hgt: number, fill = '#b4bfb8') => `<rect x="${X(x)}" y="${Y(y + hgt)}" width="${(w * k).toFixed(1)}" height="${(hgt * k).toFixed(1)}" fill="${fill}" stroke="#26332c" stroke-width=".5"/>`
  const label = (x: number, y: string, text: string, anchor = 'middle') => `<text x="${X(x)}" y="${y}" font-size="9" text-anchor="${anchor}" fill="#14201a">${text}</text>`
  const dim = (x1: number, x2: number, z: number, text: string) => `<path d="M${X(x1)} ${Z(z)}H${X(x2)}M${X(x1)} ${(Number(Z(z)) - 4).toFixed(1)}v8M${X(x2)} ${(Number(Z(z)) - 4).toFixed(1)}v8" stroke="#8b3852" stroke-width=".6" fill="none"/><text x="${((Number(X(x1)) + Number(X(x2))) / 2).toFixed(1)}" y="${(Number(Z(z)) - 3).toFixed(1)}" font-size="9" text-anchor="middle" fill="#8b3852">${text}</text>`
  const toeX = d.hingeX - s.ramp * Math.cos(d.rampAngleRad)
  const wheel = (x: number) => `<circle cx="${X(x)}" cy="${Z(d.R)}" r="${(d.R * k).toFixed(1)}" fill="none" stroke="#29322d" stroke-width="${(18 * k).toFixed(1)}"/><circle cx="${X(x)}" cy="${Z(d.R)}" r="3" fill="#536358"/>`
  const side = [
    `<path d="M${X(minX)} ${Z(0)}H${X(maxX)}" stroke="#14201a" stroke-width="1"/>`,
    wheel(0), wheel(d.wheelbase),
    box(d.rearX - t, d.railZ - t / 2, d.rail, t), box(d.rearX - t, d.topZ - t / 2, d.rail, t),
    ...[d.rearX - t, -t / 2, d.frontX].map(x => box(x, d.railZ + t / 2, t, d.post)),
    box(d.frontX + t, d.railZ - t / 2, d.forkArm, t), box(d.wheelbase - t / 2, d.railZ + t / 2, t, d.stub),
    box(d.rearX - t, d.deck - h.panel, d.rail, h.panel, '#c9a36a'),
    box(d.gripX, s.handle - t / 2, d.handleArm, t, '#dfe6e1'),
    `<path d="M${X(d.rearX - t)} ${Z(d.topZ + t / 2 + h.ridge + h.pole / 2)}H${X(d.frontX + t)}" stroke="#254b38" stroke-width="2"/>`,
    `<path d="M${X(d.hingeX)} ${Z(d.deck)}L${X(toeX)} ${Z(h.panel)}" stroke="#c9a36a" stroke-width="${(h.panel * k + 1).toFixed(1)}"/>`,
    `<path d="M${X(d.hingeX)} ${Z(d.deck)}V${Z(d.deck + s.ramp)}" stroke="#c9a36a" stroke-width="1.2" stroke-dasharray="5 4"/>`,
    `<path d="M${X(d.hingeX - 40)} ${Z(d.deck - 30)}L${X(d.hingeX - 40 - 20)} ${Z(0)}" stroke="#536358" stroke-width="3"/>`,
    dim(d.rearX, d.frontX, d.deck + s.height / 2, `clear length ${s.length}`),
    dim(toeX, d.hingeX, -45, `ramp ${s.ramp}, ${d.rampAngle.toFixed(1)} degrees`), dim(0, d.wheelbase, -45, `wheelbase ${d.wheelbase}`),
    dim(d.gripX, d.wheelbase + d.R, top - 12, `overall ${d.overallLength}`),
    label(d.frontX + t + 12, Z(d.deck + s.height / 2), `clear height ${s.height}`, 'start'), label(d.frontX + t + 12, Z(d.deck + 6), `deck ${d.deck}`, 'start'),
    label(d.gripX, (Number(Z(s.handle)) - 8).toFixed(1), `handle ${s.handle}`, 'start'), label(d.hingeX + 6, (Number(Z(d.deck + s.ramp)) - 4).toFixed(1), 'raised as tailgate', 'end'),
  ]
  const outer = s.width / 2 + t; const rampY = d.rampWidth / 2
  const topView = [
    plan(d.rearX - t, -outer, d.rail, 2 * outer, '#c9a36a'),
    plan(d.rearX - t, s.width / 2, d.rail, t), plan(d.rearX - t, -outer, d.rail, t),
    ...d.stations.map(x => plan(x - t / 2, -s.width / 2, t, s.width, '#dfe6e1')),
    plan(toeX, -rampY, d.hingeX - toeX, 2 * rampY, '#d8b98a'), plan(toeX, rampY - t, d.hingeX - toeX, t), plan(toeX, -rampY, d.hingeX - toeX, t),
    ...[1, -1].map(side => plan(-d.R, side * d.wheelY - d.tire / 2, 2 * d.R, d.tire, '#29322d')), plan(d.wheelbase - d.R, -d.tire / 2, 2 * d.R, d.tire, '#29322d'),
    ...[1, -1].map(side => plan(d.frontX + t, side * d.forkY - t / 2, d.forkArm, t)),
    ...[1, -1].map(side => plan(d.gripX, side * (outer + t / 2) - t / 2, d.handleArm, t, '#dfe6e1')), plan(d.gripX, -outer, t, 2 * outer, '#dfe6e1'),
    `<text x="${X((d.rearX + d.frontX) / 2)}" y="${Y(0)}" font-size="9" text-anchor="middle" fill="#14201a">clear width ${s.width}</text>`,
    `<text x="${X(0)}" y="${(Number(Y(-d.overallWidth / 2)) + 14).toFixed(1)}" font-size="9" text-anchor="middle" fill="#8b3852">over axle ends ${d.overallWidth}</text>`,
    `<text x="${X((toeX + d.hingeX) / 2)}" y="${Y(0)}" font-size="9" text-anchor="middle" fill="#14201a">ramp width ${d.rampWidth}</text>`,
  ]
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W.toFixed(0)} ${H.toFixed(0)}" width="${(W * 2).toFixed(0)}" height="${(H * 2).toFixed(0)}" font-family="Arial, sans-serif"><rect width="100%" height="100%" fill="#fff"/><text x="${pad}" y="26" font-size="14" font-weight="700" fill="#14201a">Buddy Rover r0, ${roverCode(s)}</text><text x="${pad}" y="42" font-size="9" fill="#14201a">Side and top views, mm. Bench design, not for animal use. Ramp shown lowered; dashed line is the raised tailgate.</text>${side.join('')}${topView.join('')}</svg>\n`
}

export function roverCostMarkdown(s: RoverSetup): string {
  const batch = roverEconomics(s, 100); const one = roverEconomics(s, 1); const lines = roverCostLines(s); const textiles = roverTextileCost(s, 100); const oneTextiles = roverTextileCost(s, 1); const dims = roverDimensions(s)
  return `# Buddy Rover r0 cost study

Checked ${roverPriceDate}, USD, integer cents, native Bun arithmetic. Configuration ${roverCode(s)}. This prices the r0 bench architecture. It is not a supplier quote, a production cost or a selling price, and nothing has been bought.

## Result

At 100 carriers the modeled landed manufacturing cost is **${money(batch.cogs)} each** at listed prices. A single build at retail quantities is **${money(one.cogs)}**. The first count of this design, on November 11, was $2,037.93 and $3,254.89, with 20 inch wheels and the original cover.

The catalog's provisional Run price is ${money(batch.retail)}, so the 30% gross-margin gate allows ${money(batch.maxCogs)} and this design ${batch.meetsCostGate ? 'meets it' : `still misses it by ${money(-batch.headroom)}`}. To pass the same gate at this cost the price would have to be about ${money(batch.retailForGate)}. The catalog price is unchanged pending the owner's decision.

If the tube is bought by weight, the picture changes. ${money(batch.tube)} of the total is ${dims.tubeLb} lb of aluminum tube priced as cut-to-order retail bars, close to five dollars a foot. A 100-carrier batch is about ${Math.round(dims.tubeLb * 100 / 100) * 100 >= 1000 ? (dims.tubeLb * 100 / 2000).toFixed(1) + ' tons' : Math.round(dims.tubeLb * 100) + ' lb'} of one extrusion and would be bought from a mill or distributor. At an assumed $4.00 per pound with 8% scrap the tube line falls to ${money(batch.tubeMill)} and the total to **${money(batch.cogsMill)}**, which a price near ${money(batch.retailForGateMill)} would carry. That rate is an assumption with no quote behind it. Getting that quote is the single most valuable next step on cost.

For scale, the reference trailer sold for ${money(roverPriceEvidence[2].price)} at one retailer on the check date, with a 100 lb stated capacity and a 36.2 x 22.4 x 29.9 inch interior. Rover's cabin is about twice that volume. Rover does not reach that price in either scenario.

## What changed since the first count

| Change | Effect at 100 carriers | Trade-off |
| --- | ---: | --- |
| Wall fabric: a $6.50 PVC-coated 600 denier polyester under the roof overhang, with the solution-dyed fabric kept for the roof | about -$85 | Walls will fade and carry no stated UV rating |
| Hook and loop instead of six zippers; roof liner made optional; corner seams lapped, not taped | about -$55 | Storm panels are slower to close; less sun insulation unless the liner is added |
| Listed quantity tiers used where the batch reaches them: wall fabric, liner, clear panel rolls | about -$20 | None. They are published prices |
| Sewing time 240 to 200 minutes | -$20.00 | An assumption either way |
| Zinc-plated grade 5 hardware for Run; stainless becomes the salt-use upgrade | about -$50 | Add ${money(batch.stainlessUpgrade)} for stainless before beach use |
| Exterior BC plywood instead of marine | -$80.00 | Marine plywood returns for salt use. Price is from an unverified search result |
| Intermediate cross members and ramp ribs in thin-wall tube | about -$40 | Members checked by hand arithmetic only |
| One gusset instead of two at the eight corner-post joints | -$12.80 | Corner posts carry the cover, not the dog |
| Assembly time 6 to 5.5 hours | -$12.50 | An assumption either way |
| 13 x 4 inch path wheels at an observed $14.99 instead of a $60 allowance for 20 inch wheels | -$135.03 | A garden-cart wheel for walking pace, heavier to push at a run. The 20 inch wheel stays as an option |

## Where the money goes

| Line | One carrier | 100-carrier allocation | Evidence |
| --- | ---: | ---: | --- |
| Aluminum tube, whole 12-foot bars with kerf | ${money(one.tube)} | ${money(batch.tube)} | .065 wall observed, .125 wall allowance |
${lines.map(l => `| ${l.name} | ${money(l.one)} | ${money(l.batch)} | ${l.evidence} |`).join('\n')}
| Weather cover, floor set and ramp surface | ${money(one.textiles.total)} | ${money(batch.textiles.total)} | Listed materials + assumed sewing |
| **Landed manufacturing** | **${money(one.cogs)}** | **${money(batch.cogs)}** | Mostly unquoted |

${lines.map(l => `- **${l.name}:** ${l.note}`).join('\n')}

Tube packing at 100 carriers: ${batch.light.bars} bars of .065 wall and ${batch.heavy.bars} bars of .125 wall. One carrier needs ${one.light.bars} and ${one.heavy.bars} whole bars.

## Cover and soft goods detail

| Material line | One carrier | 100-carrier allocation | Purchased for 100 |
| --- | ---: | ---: | --- |
${textiles.rows.map((row, i) => `| ${row.name} | ${money(oneTextiles.rows[i]!.allocation)} | ${money(row.allocation)} | ${row.units} ${row.unit} |`).join('\n')}
| Reject reserve, 10% | ${money(oneTextiles.rejects)} | ${money(textiles.rejects)} | |
| Sewing labor at $30/h | ${money(oneTextiles.labor)} | ${money(textiles.labor)} | ${oneTextiles.minutes} min one-off, ${textiles.minutes} min batch, assumed |
| Textile freight | ${money(oneTextiles.freight)} | ${money(textiles.freight)} | Unquoted |
| **Total** | **${money(oneTextiles.total)}** | **${money(textiles.total)}** | |

Material prices are the listed prices in [the materials sheet](../product/rover-materials.md). A listed quantity tier is used only where the 100-carrier purchase actually reaches it; no unlisted discount is assumed.

## What was and was not observed

${roverPriceEvidence.map(e => `- [${e.name}](${e.url}): **${money(e.price)}**, ${e.unit}. ${e.note}`).join('\n')}

${roverAllowanceNotes.map(n => `- ${n}`).join('\n')}

## What would bring it down further

1. A tube quote. See the mill-quantity paragraph above. Nothing else moves the total as much.
2. Joints. ${roverCostLines(s).find(l => l.id === 'fasteners')!.name} and the labor to drill for them come to about ${money(roverCostLines(s).find(l => l.id === 'fasteners')!.batch + roverCostLines(s).find(l => l.id === 'labor')!.batch)}. Welded or riveted sub-frames, or purpose-made corner fittings, remove most of both and several kilograms. That needs a fabricator's quote.
3. Wheels and brake. The path wheel is an observed $14.99 each. The 20 inch run wheel remains an unverified $60 allowance and adds ${money(roverCostLines({ ...s, wheel: 'run' }).find(l => l.id === 'wheels')!.batch - roverCostLines({ ...s, wheel: 'path' }).find(l => l.id === 'wheels')!.batch)}. No brake is selected.
4. The cover is now ${money(batch.textiles.total)}. The ramp surface, floor pad and mesh are the largest material lines left; sewing is ${money(batch.textiles.labor)}.

Selling-cost lines for the provisional price, per carrier at 100: payment fee ${money(batch.fee)}, returns reserve ${money(batch.reserve)}, support ${money(batch.support)}, acquisition ${money(batch.acquisition)}. Contribution before fixed overhead: ${money(batch.contribution)}.

Rebuild with \`./buddy design:rover\`. Inspect at https://buddywheels.org/design-studio-rover.
`
}

export function roverDocuments(s: RoverSetup): Record<string, string> {
  const d = roverDimensions(s)
  return {
    'assembly.md': roverAssembly(s), 'bom.csv': roverBom(s), 'materials.md': roverMaterialsMarkdown(s), 'cover-cut-schedule.csv': roverCoverCsv(s), 'cover-panels.svg': roverCoverSvg(s), 'drawing.svg': roverDrawing(s),
    'cut-list.csv': csv([['ID', 'Quantity', 'Member', 'Stock', 'Cut mm'], ...d.cuts.map(c => [c.id, c.qty, c.name, WALL[c.wall as 'heavy' | 'light'], c.length])]),
    'cost-notes.md': roverCostMarkdown(s), 'cost-model.json': JSON.stringify(roverCostModel(s), null, 2) + '\n',
    'setup.json': JSON.stringify({ revision: 'r0', product: 'Buddy Rover', ...s, dimensions: { ...d, rampAngleRad: undefined }, status: 'BENCH_ONLY_NOT_ANIMAL_USE', ownerReportedWeightLb: 140, fitted: false, loadRated: false }, null, 2) + '\n',
  }
}
