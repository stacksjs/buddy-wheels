import type { RoverSetup } from './Rover'
import { mm, nestRoverStock, referenceCarrier as ref, roverCode, roverDimensions, roverHardware as h, roverParcelStock, roverPartFile, roverParts, roverPlanningDogKg } from './Rover'
import { roverAllowanceNotes, roverCostLines, roverCostModel, roverEconomics, roverParcelPrices, roverPriceDate, roverPriceEvidence, roverTubePrices } from './RoverCost'
import { roverCover, roverCoverSvg, roverMaterialAlternates, roverMaterials, roverTextileCost, roverTextileDate } from './RoverSoftGoods'
import { signedMoney as money } from '../Storefront/Catalog'

const csv = (rows: (string | number)[][]) => rows.map(row => row.map(v => `"${String(v).replaceAll('"', '""')}"`).join(',')).join('\n') + '\n'
const inch = (n: number) => (n / 25.4).toFixed(1)
const WALL = { heavy: '6061-T6 1 x 1 x 1/8 inch square tube', light: '6063-T52 1 x 1 x 1/16 inch square tube' } as const

export function roverPrintQuantities(s: RoverSetup): Record<string, number> {
  const c = roverDimensions(s).counts
  return { cap_heavy: c.capHeavy, cap_light: c.capLight, ramp_toe: c.toe, ridge_saddle: c.saddle, fabric_clip: c.fabricClip, cable_clip: c.cableClip, axle_cover: c.axleCover, guide_butt: 1, guide_run: 1, guide_tee: 1, coupon: 1, tee_gusset: c.tee, corner_gusset: c.corner, brake_plate: 2, axle_hanger: s.wheel === 'run' ? c.hanger : 0, axle_hanger_mid: s.wheel === 'trail' ? c.hanger : 0, axle_hanger_low: s.wheel === 'path' ? c.hanger : 0 }
}
export function roverBom(s: RoverSetup): string {
  const d = roverDimensions(s); const c = d.counts; const q = roverPrintQuantities(s); const w = d.wheel
  return csv([
    ['ID', 'Quantity', 'Part', 'Specification', 'Status'],
    ...d.cuts.map(cut => [cut.id, cut.qty, cut.name, `${WALL[cut.wall as 'heavy' | 'light']}; cut ${cut.length} mm`, 'Cut to fit. Not telescoping']),
    ['M01', c.corner, 'Corner gusset', '6061-T6 3.175 mm, metal/corner_gusset.dxf', 'One profile, flipped for the opposite hand. Single outside plate at the eight corner-post joints. Fatigue and bearing review pending'],
    ['M02', c.tee, 'Tee gusset', '6061-T6 3.175 mm, metal/tee_gusset.dxf', 'Single-sided at base cross members and roof bow; paired at the fork'],
    ['M03', c.hanger, 'Axle hanger', `304 stainless 3.175 mm, metal/${w.hanger}.dxf`, 'Paired on every axle post and fork stub. Finish the 19.25 mm bore after drawing review'],
    ['M04', 2, 'Brake clamp plate', '6061-T6 3.175 mm, metal/brake_plate.dxf', 'Hangs on the two brake-arm gusset bolts. Drill its clamp holes from the delivered clamp'],
    s.wheel === 'trail'
      ? ['W01', c.wheels, 'Pneumatic wheel candidate, 15 inch 4.00-8', `Zoro Select 1NWV4; 15 3/16 inch OD, 3 1/8 inch wide, 5/8 inch bore, ball bearings, hub length stated 4 inch; configured ${s.hub} mm`, 'Supplier states a 435 lb wheel load. That does not rate the carrier. Measure the delivered hub before cutting an axle']
      : s.wheel === 'path'
      ? ['W01', c.wheels, 'Pneumatic wheel candidate, 13 x 4 inch', `HAUL-MASTER 67467; 330.2 OD, 101.6 wide, 15.875 bore; hub through-length assumed ${s.hub} mm`, 'Same candidate as the XL wheelchair. Hub length is not confirmed by the supplier. A garden-cart wheel for walking pace; its supplier rating is not a carrier rating']
      : ['W01', c.wheels, 'Pneumatic wheel, 20 inch', `508 OD, about ${w.tire} wide, 15.875 bore; hub through-length assumed ${s.hub} mm`, 'OPEN SELECTION. No verified wheel with this bore and a suitable rating has been found'],
    ['W02', 2, 'Rear stub axle', `Plain 15.875 steel shaft; cut ${d.rearShaft} mm; two 3.2 cross-holes 8 mm from each end`, 'Unkeyed precision shaft. Never a threaded journal'],
    ...(d.swivel ? [['W07', 1, 'Front swivel caster with swivel lock, 10 inch pneumatic', `Service Caster SCC-100S3504-PNB-BSL; 10 x 3-1/2 inch wheel, top plate, stated mounting height 12-3/16 inch; configured ${s.caster} mm`, 'Supplier states 350 lb and a bolt-on swivel lock. Plate size and bolt pattern are not stated: drill the caster beams from the delivered plate. Lock the swivel for running'], ['H06', c.casterBolts, 'Caster bolt set', '5/16-18 x 2-1/2 inch grade 5 bolt, two washers, lock nut and a steel crush sleeve', 'Vertical through both caster beams. Drill the beams from the delivered plate']] : [['W03', 1, 'Front through axle', `Plain 15.875 steel shaft; cut ${d.frontShaft} mm; two 3.2 cross-holes 8 mm from each end`, 'Carried in both fork stubs']]),
    ['W04', d.swivel ? 2 : 4, 'Axle sleeve', '4130 tube 19.05 OD x 1.4732 wall; cut 25.4 mm', d.swivel ? 'Through each axle post. Steel, not printed' : 'Through each axle post and fork stub. Steel, not printed'],
    ['W05', w.forkSpacer && !d.swivel ? 4 : 2, 'Wheel spacer', `4130 tube 19.05 OD x 1.4732 wall; cut ${w.spacer} mm`, w.forkSpacer && !d.swivel ? 'Two at the rear wheels, two beside the front hub so the wide tire clears the fork. Check actual hub and bearing face contact' : 'Rear wheels only. Check actual hub and bearing face contact'],
    ['W06', d.swivel ? 4 : 8, 'Thrust washer and split cotter set', '5/8 inch bore washer 1.5 mm; 3.2 mm stainless cotter', d.swivel ? 'Two washers and two cotters per rear wheel' : 'Rear: 2 washers and 2 cotters per side. Front: 4 washers and 2 cotters'],
    ['H01', c.bolts, 'Joint bolt', '1/4-20 x 2 inch SAE J429 grade 5 zinc hex bolt', 'Partially threaded shank required at sleeves. Torque procedure pending. 18-8 stainless is the salt-use upgrade'],
    ['H02', c.handleBolts, 'Handle lap bolt', '1/4-20 x 3 inch grade 5 zinc hex bolt', 'Through one handle arm and one post'],
    ['H03', c.sleeves, 'Crush sleeve', 'A513 DOM steel tube .375 OD x .049 wall; cut 25.4 mm', 'One per tube crossing. Corrosion finish between steel and aluminum pending'],
    ['H04', 2 * (c.bolts + c.handleBolts), 'Bolt washer', '1/4 inch zinc steel flat washer', 'Two per bolt'],
    ['H05', c.bolts + c.handleBolts, 'Prevailing-torque nut', '1/4-20 zinc nylon-insert locknut', 'New nuts at every assembly'],
    ['F01', 1, 'Floor panel', `15/32 inch (12 mm) ACX exterior plywood ${d.topRail} x ${s.width + 2 * h.tube} mm, six post notches 44 x 30, sealed all faces and edges; marine plywood for salt use`, 'Sits on gussets and bedding tape. Deflection under a standing dog not yet calculated'],
    ['F02', 1, 'Bedding tape', '3.2 mm closed-cell tape, 25 mm wide, about 9 m', 'Fills the gusset thickness under both panels'],
    ['F03', c.floorScrews, 'Floor fastener set', '1/4-20 stainless countersunk screw with rivet nut in the tube top wall', 'Rivet nut pull-out in .125 wall to be tested'],
    ['R01', 1, 'Ramp panel', `15/32 inch (12 mm) ACX exterior plywood ${s.ramp} x ${d.rampWidth} mm, sealed all faces and edges, toe edge fitted with printed threshold toes`, 'Curb rails on top, two ribs underneath'],
    ['R02', 1, 'Continuous hinge', `Stainless piano hinge, 1 inch leaf, 36 inch, cut to ${Math.floor(d.rampWidth / 10) * 10} mm; Zoro Select 2ZFK4 candidate, unpunched`, 'Leaves on the top faces, knuckle in the 6 mm gap. Drill and countersink for flat-head screws. Pinch review pending'],
    ['R03', 2, 'Draw latch with keeper', 'Stainless toggle-style draw latch; Southco TL-20-202-52 candidate', 'Holds the raised ramp to both rear posts. The supplier page does not say a keeper is included'],
    ['R04', 1, 'Tailgate safety strap', '1 inch webbing with a metal hook, independent of both latches', 'Second retention path if a latch opens'],
    ['R05', c.rampBolts, 'Ramp carriage bolt', '1/4-20 x 2 inch stainless carriage bolt, washer and locknut', 'Smooth heads on the walking side'],
    ['R06', 2, 'Ramp stand foot', '3/8-16 swivel leveling mount with a 2 inch stud, S&W BSW-1Z candidate, in a threaded insert for 1 inch square tube', `Leg cut ${d.legCut} mm assumes a ${h.foot} mm foot. No threaded insert was found at the suppliers checked. Adjust on level ground`],
    ['B01', 2, 'Wheel chock', 'Solid rubber wheel chock, Harbor Freight 96479 candidate', 'Backup on slopes and whenever the ramp is down'],
    ['B03', 2, 'Parking brake clamp', 'Push-pull toggle clamp, 300 lb holding capacity, about 1-5/16 inch plunger travel; POWERTEC 302F candidate, with four #10 screws and lock nuts each', 'Bolts to a brake clamp plate over each rear tire. Untested as a brake'],
    ['B04', 2, 'Brake pad', 'Rubber bumper with a 5/16 inch male stud, on the clamp plunger', 'Thread pitch not confirmed against the clamp. Adjust so the pad presses about 10 mm into the tire when locked'],
    ['B02', 1, 'Handle grip and wrist tether', `Foam grip for 25.4 tube over ${d.grip} mm; 1.2 m wrist tether`, 'Tether is a secondary link to the caregiver'],
    ['S01', 2, 'Tip-stop foot', '3/8-16 swivel leveling mount, tall version of S&W BSW-1Z, through each base rail behind the axle, nut and washer above and below', 'Catches a rearward tip. Height setting and strength are untested'],
    ['X01', 1, 'Roof ridge pole', `12.7 mm aluminum tube, cut ${d.topRail} mm`, 'Rests in three printed saddles'],
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
5. Bind the four cutouts where the handle arms cross the rear and axle posts, and a slit at each axle post for the brake arm, so metal clamps metal.
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

A large cut-to-fit carrier built from 1 inch square aluminum tube, 1/8 inch wall 6061-T6 for the chassis and 1/16 inch wall 6063-T52 for the cabin, three repeated flat metal profiles, plywood panels and printed service parts. The tailgate is the ramp: it folds down to a ${d.rampAngle.toFixed(1)} degree walk-in with no step, and stands on its own two feet so the dog's weight on the threshold goes to the ground instead of tipping the carrier. ${d.swivel ? `Two ${d.wheel.label} wheels at the rear and a 10 inch swivel caster on a raised nose at the front, so it steers by pushing the handle sideways.` : `Three matching wheels, here the ${d.wheel.label} wheel. Push handle with a fixed front wheel.`}

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
| Front wheel | ${d.swivel ? `swivel caster, mounting height ${s.caster}` : 'fixed, on a fork'} |
| Wheelbase | ${d.wheelbase} |
| Handle height | ${s.handle} (${inch(s.handle)} in) |
| Overall length, width over axle ends, height | ${d.overallLength} x ${d.overallWidth} x ${d.overallHeight} |
| Ground clearance under the base gussets | ${d.clearance} |
| Rear wheel | ${d.wheel.label} |
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

With a ${roverPlanningDogKg} kg (160 lb) planning mass centered in the cabin, its center sits ${d.centerAhead} mm ahead of the rear axle and the front wheel carries about ${d.frontShare.toFixed(0)}% of that mass. ${d.swivel ? `The swivel caster steers without lifting anything. Lifting the front to climb a curb takes roughly ${d.tiltForceN} N (${d.tiltForceLbf} lbf) down on the handle. A swivel caster can shimmy at a run, so lock the swivel with its bolt-on lock before running and steer by lifting the front as with a fixed wheel.` : `Lifting the front wheel to steer takes roughly ${d.tiltForceN} N (${d.tiltForceLbf} lbf) down on the handle. A swivel front caster removes that effort and is the other front option.`} A dog that stands at the tailgate moves the center behind the axle. The two tip-stop feet exist for that case and their setting and strength are unproven.

## Cut list

| ID | Qty | Member | Stock | Cut |
| --- | ---: | --- | --- | ---: |
${d.cuts.map(cut => `| ${cut.id} | ${cut.qty} | ${cut.name} | ${cut.wall === 'heavy' ? '1/8 wall 6061-T6' : '1/16 wall 6063-T52'} | ${cut.length} |`).join('\n')}

Total ${d.heavyM.toFixed(2)} m of 1/8 inch wall 6061-T6 and ${d.lightM.toFixed(2)} m of 1/16 inch wall 6063-T52. Base cross members sit at X = ${d.stations.join(', ')}.

## Joint patterns

Every joint is a flat gusset with 1/4 inch bolts through steel crush sleeves. Hole centers are measured from the joint centerline, where two tube centerlines cross.

| Profile | Qty | Holes from the joint centerline | Where |
| --- | ---: | --- | --- |
| Corner gusset | ${c.corner} | Leg A 50 and 80. Leg B 35 and 65 | Corner posts on the outside face only, axle-post tops both faces, rail to cross member, roof corners, handle grip, ramp legs |
| Tee gusset | ${c.tee} | Bar 30 each side. Stem 35 and 60 | Intermediate base cross members, mid roof bow, fork arms top and bottom |
| Axle hanger, ${d.wheel.label} wheel | ${c.hanger} | Bar 30 each side. Stem ${d.wheel.posts.join(', ')}. Axle bore at ${d.wheel.rise} | Both faces of each axle post and each fork stub |

Legs A and B alternate where two gussets meet on one tube, so bolts cross 15 mm apart and never share a station. Tube bores are 9.725 for the sleeves, plate holes 6.75, axle sleeve bores 19.25. All are nominal. Use the three printed drill guides for pilot centers and finish with metal tooling.

## Build order

1. Print the clearance coupon and measure it. Print one cap and one clip before batching.
2. Cut and deburr every tube. Mark each with its ID.
3. Base frame: two side rails, ${d.stations.length} cross members. Corner gussets under each corner, tee gussets under each intermediate member.
4. Axle posts at X = 0 with paired hangers. The hanger bar bolts to the rail, the stem to the post. Fit the 19.05 axle sleeve through post and both hangers.
5. Corner posts with one corner gusset on the outside face, leg A up the post, and washers on the inside.
6. Top rails, three top cross tubes, corner gussets on top, tee gussets at the mid bow.
${d.swivel ? `7. Nose: the base rails run ${d.nose} past the front cross member. Stand four nose posts on them at X = ${mm(d.casterX - h.casterAlong / 2)} and ${mm(d.casterX + h.casterAlong / 2)}, each with a pair of corner gussets, the rail leg pointing away from the other post. Lay the two caster beams across the post tops and tie each to its posts with one corner gusset on the outside face. Hold the caster plate up under the beams at the centerline, mark its four holes, drill, and bolt it with sleeves.` : `7. Fork: two arms butt against the front cross member at Y = ${d.forkY} each side, tee gussets above and below. Stub posts with paired hangers at the front axle, ${d.wheelbase} ahead of the rear axle.`}
8. Floor panel on bedding tape, fastened to the frame.
9. Ramp: panel, two curb rails on top, two ribs underneath at 40 mm and mid length, stand legs on the hinge-end rib ${60} mm in from each edge. Hinge leaves on the top faces of floor and ramp.
10. Handle arms on the outside of the rear and axle posts at Z = ${s.handle}, one 3 inch bolt per post. Grip tube between the arm ends.
11. Wheels, washers and cotters. Rear stack between outer washer faces ${d.rearStack}${d.swivel ? '' : `, front ${d.frontStack}`}, with 0.5 total end float.
12. Tip-stop feet, the two brake arms with their plates and clamps, latches, safety strap. Then the cover.

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
3. A measured wheel: actual hub length, bearing fit and a rating that suits the carrier, then the parking brake proven on a slope with ballast. The 13 inch candidate is a garden-cart wheel for walking pace; a running wheel is still an open selection. Until wheel and brake are proven the running gear is a placeholder. There is no brake for slowing while moving.
4. Ballast tests to an approved plan: static proof, ramp load at mid span and at the threshold, tip in every direction, curb and brake events, fatigue.
5. Cover tests listed in materials.md.
6. Only then a supervised, consented fit and handling study with stop rules.

Digital mesh checks and a tidy drawing prove none of this.
`
}

/** Dimensioned side and top views generated from the same numbers as the cut list. */
export function roverDrawing(s: RoverSetup): string {
  const d = roverDimensions(s); const t = h.tube; const k = 0.2; const pad = 60
  const minX = d.hingeX - s.ramp - 60; const maxX = d.gripX + d.overallLength + 40; const top = d.overallHeight + 40
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
    wheel(0), ...(d.swivel ? [`<circle cx="${X(d.casterX - h.casterTrail)}" cy="${Z(h.casterWheel / 2)}" r="${(h.casterWheel / 2 * k).toFixed(1)}" fill="none" stroke="#29322d" stroke-width="${(22 * k).toFixed(1)}"/>`, `<path d="M${X(d.casterX)} ${Z(s.caster)}L${X(d.casterX - h.casterTrail)} ${Z(h.casterWheel / 2)}" stroke="#536358" stroke-width="3"/>`] : [wheel(d.wheelbase)]),
    box(d.rearX - t, d.railZ - t / 2, d.rail, t), box(d.rearX - t, d.topZ - t / 2, d.topRail, t),
    ...[d.rearX - t, -t / 2, d.frontX].map(x => box(x, d.railZ + t / 2, t, d.post)),
    ...(d.swivel ? [-1, 1].flatMap(end => [box(d.casterX + end * h.casterAlong / 2 - t / 2, d.railZ + t / 2, t, d.nosePost), box(d.casterX + end * h.casterAlong / 2 - t / 2, s.caster, t, t, '#8f9a93')]) : [box(d.frontX + t, d.railZ - t / 2, d.forkArm, t), box(d.wheelbase - t / 2, d.railZ + t / 2, t, d.stub)]),
    box(d.rearX - t, d.deck - h.panel, d.topRail, h.panel, '#c9a36a'),
    box(d.gripX, s.handle - t / 2, d.handleArm, t, '#dfe6e1'),
    `<path d="M${X(d.rearX - t)} ${Z(d.topZ + t / 2 + h.ridge + h.pole / 2)}H${X(d.frontX + t)}" stroke="#254b38" stroke-width="2"/>`,
    `<path d="M${X(d.hingeX)} ${Z(d.deck)}L${X(toeX)} ${Z(h.panel)}" stroke="#c9a36a" stroke-width="${(h.panel * k + 1).toFixed(1)}"/>`,
    `<path d="M${X(d.hingeX)} ${Z(d.deck)}V${Z(d.deck + s.ramp)}" stroke="#c9a36a" stroke-width="1.2" stroke-dasharray="5 4"/>`,
    `<path d="M${X(d.hingeX - 40)} ${Z(d.deck - 30)}L${X(d.hingeX - 40 - 20)} ${Z(0)}" stroke="#536358" stroke-width="3"/>`,
    dim(d.rearX, d.frontX, d.deck + s.height / 2, `clear length ${s.length}`),
    dim(toeX, d.hingeX, -45, `ramp ${s.ramp}, ${d.rampAngle.toFixed(1)} degrees`), dim(0, d.wheelbase, -45, `wheelbase ${d.wheelbase}`),
    dim(d.gripX, d.gripX + d.overallLength, top - 12, `overall ${d.overallLength}`),
    label(d.frontX + t + 12, Z(d.deck + s.height / 2), `clear height ${s.height}`, 'start'), label(d.frontX + t + 12, Z(d.deck + 6), `deck ${d.deck}`, 'start'),
    label(d.gripX, (Number(Z(s.handle)) - 8).toFixed(1), `handle ${s.handle}`, 'start'), label(d.hingeX + 6, (Number(Z(d.deck + s.ramp)) - 4).toFixed(1), 'raised as tailgate', 'end'),
  ]
  const outer = s.width / 2 + t; const rampY = d.rampWidth / 2
  const topView = [
    plan(d.rearX - t, -outer, d.topRail, 2 * outer, '#c9a36a'),
    plan(d.rearX - t, s.width / 2, d.rail, t), plan(d.rearX - t, -outer, d.rail, t),
    ...d.stations.map(x => plan(x - t / 2, -s.width / 2, t, s.width, '#dfe6e1')),
    plan(toeX, -rampY, d.hingeX - toeX, 2 * rampY, '#d8b98a'), plan(toeX, rampY - t, d.hingeX - toeX, t), plan(toeX, -rampY, d.hingeX - toeX, t),
    ...[1, -1].map(side => plan(-d.R, side * d.wheelY - d.tire / 2, 2 * d.R, d.tire, '#29322d')), ...(d.swivel ? [...[-1, 1].map(end => plan(d.casterX + end * h.casterAlong / 2 - t / 2, -outer, t, 2 * outer)), plan(d.casterX - h.casterTrail - h.casterWheel / 2, -h.casterTire / 2, h.casterWheel, h.casterTire, '#29322d')] : [plan(d.wheelbase - d.R, -d.tire / 2, 2 * d.R, d.tire, '#29322d'), ...[1, -1].map(side => plan(d.frontX + t, side * d.forkY - t / 2, d.forkArm, t))]),
    ...[1, -1].map(side => plan(d.gripX, side * (outer + t / 2) - t / 2, d.handleArm, t, '#dfe6e1')), plan(d.gripX, -outer, t, 2 * outer, '#dfe6e1'),
    `<text x="${X((d.rearX + d.frontX) / 2)}" y="${Y(0)}" font-size="9" text-anchor="middle" fill="#14201a">clear width ${s.width}</text>`,
    `<text x="${X(0)}" y="${(Number(Y(-d.overallWidth / 2)) + 14).toFixed(1)}" font-size="9" text-anchor="middle" fill="#8b3852">over axle ends ${d.overallWidth}</text>`,
    `<text x="${X((toeX + d.hingeX) / 2)}" y="${Y(0)}" font-size="9" text-anchor="middle" fill="#14201a">ramp width ${d.rampWidth}</text>`,
  ]
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W.toFixed(0)} ${H.toFixed(0)}" width="${(W * 2).toFixed(0)}" height="${(H * 2).toFixed(0)}" font-family="Arial, sans-serif"><rect width="100%" height="100%" fill="#fff"/><text x="${pad}" y="26" font-size="14" font-weight="700" fill="#14201a">Buddy Rover r0, ${roverCode(s)}</text><text x="${pad}" y="42" font-size="9" fill="#14201a">Side and top views, mm. Bench design, not for animal use. Ramp shown lowered; dashed line is the raised tailgate.</text>${side.join('')}${topView.join('')}</svg>\n`
}

/** Top view of the bolted base frame alone, with member IDs, cut lengths and every station measured from the rear end of a rail. */
export function roverBasePlan(s: RoverSetup): string {
  const d = roverDimensions(s); const t = h.tube; const k = 0.42; const pad = 70; const outer = s.width / 2 + t; const rear = d.rearX - t
  const W = d.rail * k + 2 * pad + 60; const H = 2 * outer * k + 2 * pad + 150
  const X = (x: number) => ((x - rear) * k + pad); const Y = (y: number) => (pad + 40 + (outer - y) * k)
  const rect = (x: number, y: number, w: number, hgt: number, fill: string, dash = '') => `<rect x="${X(x).toFixed(1)}" y="${Y(y + hgt).toFixed(1)}" width="${(w * k).toFixed(1)}" height="${(hgt * k).toFixed(1)}" fill="${fill}" stroke="#26332c" stroke-width=".6"${dash}/>`
  const text = (x: number, y: number, label: string, size = 10, anchor = 'middle', fill = '#14201a') => `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" font-size="${size}" text-anchor="${anchor}" fill="${fill}">${label}</text>`
  const from = (x: number) => mm(x - rear); const body: string[] = []
  // Rails and cross members.
  for (const side of [1, -1]) body.push(rect(rear, side * d.postY - t / 2, d.rail, t, '#b4bfb8'))
  d.stations.forEach((x, i) => { const end = i === 0 || i === d.stations.length - 1; body.push(rect(x - t / 2, -s.width / 2, t, s.width, end ? '#b4bfb8' : '#dfe6e1'), text(X(x), Y(0) + (i % 2 ? -14 : 14), `${end ? 'C02' : 'C14'} at ${from(x)}`, 9)) })
  // Posts standing on the rails, drawn as filled squares.
  const post = (x: number, label: string, fill: string) => { for (const side of [1, -1]) body.push(rect(x - t / 2, side * d.postY - t / 2, t, t, fill)); if (label) body.push(text(X(x), Y(outer - t) + 13, `${label} ${from(x)}`, 9)) }
  post(d.rearX - t / 2, 'C09', '#6d7a72'); post(0, 'C03 axle', '#254b38'); post(d.frontX + t / 2, 'C09', '#6d7a72')
  if (d.swivel) {
    for (const end of [-1, 1]) { const x = d.casterX + end * h.casterAlong / 2; post(x, end < 0 ? 'C15' : '', '#6d7a72'); body.push(rect(x - t / 2, -outer, t, 2 * outer, 'none', ' stroke-dasharray="5 4"')) }
    body.push(`<circle cx="${X(d.casterX).toFixed(1)}" cy="${Y(0).toFixed(1)}" r="${(h.casterSweep * k).toFixed(1)}" fill="none" stroke="#8b3852" stroke-width=".7" stroke-dasharray="3 4"/>`, text(X(d.casterX), Y(0) + 4, 'caster', 9, 'middle', '#8b3852'), text(X(d.casterX), Y(-outer) + 16, `C16 beams above, at ${from(d.casterX - h.casterAlong / 2)} and ${from(d.casterX + h.casterAlong / 2)}`, 9))
  }
  else {
    for (const side of [1, -1]) body.push(rect(d.frontX + t, side * d.forkY - t / 2, d.forkArm, t, '#b4bfb8'))
    body.push(text(X(d.frontX + t + d.forkArm / 2), Y(0) + 4, 'C04 fork', 9))
  }
  // Wheels, for orientation only.
  for (const side of [1, -1]) body.push(rect(-d.R, side * d.wheelY - d.tire / 2, 2 * d.R, d.tire, 'none', ' stroke-dasharray="2 3"'))
  const dimY = Y(-outer) + 46
  body.push(`<path d="M${X(rear).toFixed(1)} ${dimY}H${X(rear + d.rail).toFixed(1)}M${X(rear).toFixed(1)} ${dimY - 5}v10M${X(rear + d.rail).toFixed(1)} ${dimY - 5}v10" stroke="#8b3852" stroke-width=".7" fill="none"/>`, text((X(rear) + X(rear + d.rail)) / 2, dimY - 5, `C01 base side rail, cut ${d.rail}, two of them`, 10, 'middle', '#8b3852'))
  body.push(text(X(rear) - 8, Y(0), 'REAR', 10, 'end', '#8b3852'), text(X(rear + d.rail) + 8, Y(0), 'FRONT', 10, 'start', '#8b3852'))
  body.push(text(pad, H - 46, `Cross members are cut ${s.width}. Outside width over the rails is ${mm(2 * outer)}. Rail centerlines are ${mm(2 * d.postY)} apart.`, 10, 'start'))
  body.push(text(pad, H - 30, 'Every number after "at" is the centerline of that member, measured along the rail from its REAR end.', 10, 'start'))
  body.push(text(pad, H - 14, 'Corner gussets go under each corner, tee gussets under each C14, axle hangers on both side faces at the axle post. Hole centers are in drilling.csv.', 10, 'start'))
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W.toFixed(0)} ${H.toFixed(0)}" width="${(W * 1.6).toFixed(0)}" height="${(H * 1.6).toFixed(0)}" font-family="Arial, sans-serif"><rect width="100%" height="100%" fill="#fff"/>${text(pad, 26, `Buddy Rover r0 base frame plan, seen from above, mm`, 14, 'start')}${text(pad, 42, 'Bench design, not for animal use. Solid squares are posts standing on the rails. Dashed outlines are parts above or beside the base.', 9, 'start')}${body.join('')}</svg>\n`
}

export function roverCostMarkdown(s: RoverSetup): string {
  const batch = roverEconomics(s, 100); const one = roverEconomics(s, 1); const lines = roverCostLines(s); const textiles = roverTextileCost(s, 100); const oneTextiles = roverTextileCost(s, 1); const dims = roverDimensions(s)
  return `# Buddy Rover r0 cost study

Checked ${roverPriceDate}, USD, integer cents, native Bun arithmetic. Configuration ${roverCode(s)}. This prices the r0 bench architecture. It is not a supplier quote, a production cost or a selling price, and nothing has been bought.

## Result

At 100 carriers the modeled landed manufacturing cost is **${money(batch.cogs)} each** at listed prices. A single build at retail quantities is **${money(one.cogs)}**. The first count of this design, on November 11, was $2,037.93 and $3,254.89, with 20 inch wheels, the original cover and most prices as allowances.

The catalog's provisional Run price is ${money(batch.retail)}, so the 30% gross-margin gate allows ${money(batch.maxCogs)} and this design ${batch.meetsCostGate ? 'meets it' : `still misses it by ${money(-batch.headroom)}`}. To pass the same gate at this cost the price would have to be about ${money(batch.retailForGate)}. The catalog price is unchanged pending the owner's decision.

If the tube is bought by weight, it drops again. ${money(batch.tube)} of the total is ${dims.tubeLb} lb of aluminum tube priced as 21 ft and 24 ft stock bars at $3.13 and $4.84 per foot. A 100-carrier batch is about ${(dims.tubeLb * 100 / 2000).toFixed(1)} tons of two extrusions and would be bought from a mill or distributor. At an assumed $4.00 per pound with 8% scrap the tube line falls to ${money(batch.tubeMill)} and the total to **${money(batch.cogsMill)}**, which a price near ${money(batch.retailForGateMill)} would carry. That rate is an assumption with no quote behind it.

For scale, the reference trailer sold for ${money(roverPriceEvidence[9].price)} at one retailer on the check date, with a 100 lb stated capacity and a 36.2 x 22.4 x 29.9 inch interior. Rover's cabin is about twice that volume. Rover does not reach that price in either scenario.

## What changed since the first count

| Change | Effect at 100 carriers | Trade-off |
| --- | ---: | --- |
| Wall fabric: a $6.50 PVC-coated 600 denier polyester under the roof overhang, with the solution-dyed fabric kept for the roof | about -$85 | Walls will fade and carry no stated UV rating |
| Hook and loop instead of six zippers; roof liner made optional; corner seams lapped, not taped | about -$55 | Storm panels are slower to close; less sun insulation unless the liner is added |
| Listed quantity tiers used where the batch reaches them: wall fabric, liner, clear panel rolls | about -$20 | None. They are published prices |
| Sewing time 240 to 200 minutes | -$20.00 | An assumption either way |
| Zinc-plated grade 5 hardware for Run, at prices read on the supplier page; stainless becomes the salt-use upgrade | about -$81 | Add ${money(batch.stainlessUpgrade)} for stainless before beach use. Cut sleeves are still an allowance |
| Exterior ACX plywood at an observed $52.00 a sheet instead of marine | -$73.00 | Marine plywood returns for salt use |
| Intermediate cross members and ramp ribs in thin-wall tube | about -$40 | Members checked by hand arithmetic only |
| One gusset instead of two at the eight corner-post joints | -$12.80 | Corner posts carry the cover, not the dog |
| Assembly time 6 to 5.5 hours | -$12.50 | An assumption either way |
| A 15 inch pneumatic wheel at an observed $32.89, with ball bearings, a stated hub length and a 435 lb supplier load figure, instead of a $60 allowance for a 20 inch wheel nobody has found | -$81.33 | Smaller than a running wheel. The 13 inch path wheel at $14.99 saves a further $53.70; the 20 inch wheel stays as an option |
| Tube bought as 21 ft and 24 ft stock bars at prices read on the supplier page, with the cabin and secondary members in 1/16 inch 6063-T52 | about -$136 | 6063-T52 is softer than 6061-T6, so it is kept out of the chassis. Long bars ship by truck |
| A swivel front caster with a swivel lock on a raised nose, in place of the fixed fork and third wheel | about +$63 | Steers without lifting. Adds about 2 kg and twelve gussets |
| A parking brake: a toggle clamp on an arm over each rear tire | about +$60 | Untested as a brake. Nothing slows the carrier while it moves |
| Hinge, latches, leveling mounts, sleeve tube, axle parts and chocks priced from supplier pages instead of allowances | about +$20 | The allowances were low |

## Where the money goes

| Line | One carrier | 100-carrier allocation | Evidence |
| --- | ---: | ---: | --- |
| Aluminum tube, whole stock bars with kerf | ${money(one.tube)} | ${money(batch.tube)} | Observed 2026-11-12 |
${lines.map(l => `| ${l.name} | ${money(l.one)} | ${money(l.batch)} | ${l.evidence} |`).join('\n')}
| Weather cover, floor set and ramp surface | ${money(one.textiles.total)} | ${money(batch.textiles.total)} | Listed materials + assumed sewing |
| **Landed manufacturing** | **${money(one.cogs)}** | **${money(batch.cogs)}** | Mostly unquoted |

${lines.map(l => `- **${l.name}:** ${l.note}`).join('\n')}

Tube packing at 100 carriers: ${batch.light.bars} bars of 1/16 inch wall, 21 ft each, and ${batch.heavy.bars} bars of 1/8 inch wall, 24 ft each. One carrier needs ${one.light.bars} and ${one.heavy.bars} whole bars.

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

1. A tube quote. See the mill-quantity paragraph above.
2. Joints. ${roverCostLines(s).find(l => l.id === 'fasteners')!.name} and the labor to drill for them come to about ${money(roverCostLines(s).find(l => l.id === 'fasteners')!.batch + roverCostLines(s).find(l => l.id === 'labor')!.batch)}. Welded or riveted sub-frames, or purpose-made corner fittings, remove most of both and several kilograms. That needs a fabricator's quote.
3. Plates. ${roverCostLines(s).find(l => l.id === 'gussets')!.name} and the hangers are the largest allowance left, about ${money(roverCostLines(s).find(l => l.id === 'gussets')!.batch + roverCostLines(s).find(l => l.id === 'hangers')!.batch)}. Uploading the DXF files to a cutting service turns that into a real number in minutes.
4. The cover is now ${money(batch.textiles.total)}. The ramp surface, floor pad and mesh are the largest material lines left; sewing is ${money(batch.textiles.labor)}.

Selling-cost lines for the provisional price, per carrier at 100: payment fee ${money(batch.fee)}, returns reserve ${money(batch.reserve)}, support ${money(batch.support)}, acquisition ${money(batch.acquisition)}. Contribution before fixed overhead: ${money(batch.contribution)}.

Rebuild with \`./buddy design:rover\`. Inspect at https://buddywheels.org/design-studio-rover.
`
}

export interface DrillRow { id: string, member: string, qty: number, axis: string, from: string, centers: number[], bore: string, purpose: string }
/**
 * Every hole in every tube, measured from a named end. Derived from the same joint rules as the gusset profiles:
 * corner gusset leg A at 50 and 80, leg B at 35 and 65, tee bar at 30 each side, tee stem at 35 and 60, all from the joint centerline.
 */
export function roverDrilling(s: RoverSetup): DrillRow[] {
  const d = roverDimensions(s); const t = h.tube; const half = t / 2; const w = d.wheel
  const SLEEVE = '9.8 (letter W), for a 9.525 sleeve'; const rows: DrillRow[] = []
  const add = (id: string, member: string, qty: number, axis: string, from: string, centers: number[], purpose: string, bore = SLEEVE) => rows.push({ id, member, qty, axis, from, centers: centers.map(mm), bore, purpose })
  const fromRear = (x: number) => x - (d.rearX - t); const stations = d.stations.map(fromRear); const axlePost = fromRear(0); const frontCorner = fromRear(d.frontX + half)
  // Base side rails. "Side" holes go through the two vertical faces, "vertical" holes through top and bottom.
  add('C01', 'Base side rail', 2, 'side', 'rear end', [half + 35, half + 65], 'Rear corner post gusset')
  add('C01', 'Base side rail', 2, 'vertical', 'rear end', [half + 50, half + 80], 'Rear cross member gusset, underneath')
  add('C01', 'Base side rail', 2, 'vertical', 'rear end', [fromRear(d.rearX + 117.3)], 'Tip-stop foot stem', '10.0, for a 3/8 inch stem')
  add('C01', 'Base side rail', 2, 'vertical', 'rear end', stations.slice(1, -1).flatMap(x => [x - 30, x + 30]), 'Intermediate cross member tee gussets, underneath')
  add('C01', 'Base side rail', 2, 'side', 'rear end', [axlePost - 30, axlePost + 30], 'Axle hanger bar')
  add('C01', 'Base side rail', 2, 'side', 'rear end', [frontCorner - 65, frontCorner - 35], 'Front corner post gusset')
  add('C01', 'Base side rail', 2, 'vertical', 'rear end', [frontCorner - 80, frontCorner - 50], 'Front cross member gusset, underneath')
  if (d.swivel) {
    const rearPost = fromRear(d.casterX - h.casterAlong / 2); const frontPost = fromRear(d.casterX + h.casterAlong / 2)
    add('C01', 'Base side rail', 2, 'side', 'rear end', [rearPost - 65, rearPost - 35, frontPost + 35, frontPost + 65], `Nose post gussets. Posts stand at ${mm(rearPost)} and ${mm(frontPost)}`)
  }
  add('C02', 'Base end cross member', 2, 'vertical', 'each end', [35 - half, 65 - half], 'Corner gusset, underneath')
  if (!d.swivel) add('C02', 'Base end cross member, front one only', 1, 'vertical', 'the middle', [-d.forkY - 30, -d.forkY + 30, d.forkY - 30, d.forkY + 30], 'Fork arm tee gussets, top and bottom')
  add('C14', 'Base intermediate cross member', d.intermediates, 'vertical', 'each end', [35 - half, 60 - half], 'Tee gusset stem, underneath')
  // Posts. The bottom of every post sits on a rail, 12.7 above the rail centerline.
  add('C03', 'Axle post', 2, 'side', 'bottom', w.posts.map(p => p - half), 'Axle hanger stem')
  add('C03', 'Axle post', 2, 'side', 'bottom', [w.rise - half], 'Axle sleeve', '19.25, for the 19.05 axle sleeve')
  add('C03', 'Axle post', 2, 'side', 'bottom', [s.handle - d.railZ - half], 'Handle arm lap bolt')
  add('C03', 'Axle post', 2, 'fore-aft', 'bottom', [d.brakeZ - d.railZ - half + 35, d.brakeZ - d.railZ - half + 65], `Brake arm gussets. The arm centerline is ${mm(d.brakeZ - d.railZ - half)} up the post`)
  add('C03', 'Axle post', 2, 'side', 'top', [35 - half, 65 - half], 'Top rail gussets')
  add('C17', 'Brake arm', 2, 'fore-aft', 'the end at the post', [50 - half, 80 - half], 'Axle post gussets, front and rear faces')
  add('C09', 'Corner post', 4, 'side', 'bottom', [50 - half, 80 - half], 'Base rail gusset, outside face')
  add('C09', 'Corner post', 4, 'side', 'top', [50 - half, 80 - half], 'Top rail gusset, outside face')
  add('C09', 'Corner post, the two rear ones only', 2, 'side', 'bottom', [s.handle - d.railZ - half], 'Handle arm lap bolt')
  // Top frame.
  const topAxle = fromRear(0)
  add('C10', 'Top side rail', 2, 'side', 'each end', [half + 35, half + 65], 'Corner post gusset')
  add('C10', 'Top side rail', 2, 'vertical', 'each end', [half + 50, half + 80], 'Top cross tube gusset, on top')
  add('C10', 'Top side rail', 2, 'side', 'rear end', [topAxle + 50, topAxle + 80], 'Axle post top gussets')
  add('C10', 'Top side rail', 2, 'vertical', 'rear end', [topAxle - 30, topAxle + 30], 'Roof bow tee gusset, on top')
  add('C11', 'Top cross tube, front and rear', 2, 'vertical', 'each end', [35 - half, 65 - half], 'Corner gusset, on top')
  add('C11', 'Top cross tube, middle bow', 1, 'vertical', 'each end', [35 - half, 60 - half], 'Tee gusset stem, on top')
  // Handle.
  add('C12', 'Handle arm', 2, 'side', 'front end', [40, 40 + s.axle + half], 'Lap bolts into the axle post and the rear corner post')
  add('C12', 'Handle arm', 2, 'vertical', 'rear end', [half + 50, half + 80], 'Grip tube gussets, top and bottom')
  add('C13', 'Handle grip tube', 1, 'vertical', 'each end', [35 - half, 65 - half], 'Grip gussets, top and bottom')
  // Front end.
  if (d.swivel) {
    add('C15', 'Nose post', 4, 'side', 'bottom', [50 - half, 80 - half], 'Base rail gussets, both faces')
    add('C15', 'Nose post', 4, 'fore-aft', 'top', [35 - half, 65 - half], 'Caster beam gusset, outside face')
    add('C16', 'Caster beam', 2, 'fore-aft', 'each end', [half + 50, half + 80], 'Nose post gusset, outside face')
    add('C16', 'Caster beam', 2, 'vertical', 'the middle', [-h.casterAcross / 2, h.casterAcross / 2], 'Caster plate bolts. Mark from the delivered plate before drilling', '11.2 (7/16 inch), for a 7/16 inch sleeve')
  }
  else {
    add('C04', 'Fork arm', 2, 'vertical', 'the end at the cabin', [35 - half, 60 - half], 'Tee gusset stems, top and bottom')
    add('C04', 'Fork arm', 2, 'side', 'the end at the cabin', [d.wheelbase - d.frontX - t - 30, d.wheelbase - d.frontX - t + 30], 'Front axle hanger bar')
    add('C05', 'Fork stub post', 2, 'side', 'bottom', w.posts.map(p => p - half), 'Front axle hanger stem')
    add('C05', 'Fork stub post', 2, 'side', 'bottom', [w.rise - half], 'Axle sleeve', '19.25, for the 19.05 axle sleeve')
  }
  // Ramp.
  const curbStep = s.ramp / (Math.floor(s.ramp / 200) + 1)
  add('C06', 'Ramp side curb rail', 2, 'vertical', 'hinge end', Array.from({ length: Math.floor(s.ramp / 200) + 1 }, (_, i) => curbStep * (i + 0.5)), 'Carriage bolts down through the curb and the ramp panel', '6.75, no sleeve')
  add('C07', 'Ramp under rib', 2, 'vertical', 'each end', [80], 'Carriage bolt up through the panel; add one at the middle', '6.75, no sleeve')
  add('C07', 'Ramp under rib, hinge-end one only', 1, 'along the ramp', 'each end', [60 + 50, 60 + 80], 'Stand leg gussets, both faces. Legs stand 60 from each end')
  add('C08', 'Ramp stand leg', 2, 'along the ramp', 'top', [35 - half, 65 - half], 'Rib gussets, both faces')
  return rows
}
export function roverDrillingCsv(s: RoverSetup): string {
  return csv([['Member ID', 'Member', 'Quantity', 'Hole direction', 'Measure from', 'Hole centers mm', 'Drill mm', 'What it is for'], ...roverDrilling(s).map(r => [r.id, r.member, r.qty, r.axis, r.from, r.centers.join(' / '), r.bore, r.purpose])])
}

/** The whole job in order, for one builder making one bench carrier: what to order, how the frame gets its shape, and how it goes together. */
export function roverBuildGuide(s: RoverSetup): string {
  const d = roverDimensions(s); const c = d.counts; const t = h.tube; const q = roverPrintQuantities(s); const cover = roverCover(s)
  const heavyBars = nestRoverStock(s, 'heavy', 1, roverParcelStock.mm); const lightBars = nestRoverStock(s, 'light', 1, roverParcelStock.mm)
  const drilling = roverDrilling(s); const fasteners = c.bolts + c.handleBolts; const boxes = Math.ceil(fasteners / 100)
  const axleSleeves = d.swivel ? 2 : 4
  const rodMm = Math.ceil(2 * d.rearShaft + (d.swivel ? 0 : d.frontShaft) + 12)
  const bars = (list: typeof heavyBars) => list.map((b, i) => `| ${i + 1} | ${b.pieces.map(p => `${p.id} ${p.length}`).join(', ')} | ${b.offcut} |`).join('\n')
  return `# Buddy Rover r0 build guide

Configuration ${roverCode(s)}. All dimensions mm unless marked. Read this once to the end before ordering anything.

**What this builds.** A bench carrier for checking fit, handling and the ramp with sandbags. It has no load rating, an untested parking brake, no brake for slowing while moving, and no test behind it. Do not put a dog in it until the release gates at the end are met.

## 1. How the aluminum base gets its shape

Nothing is bent, cast or welded. The base is a flat ladder: two long side rails with ${d.stations.length} cross members between them. Every piece is a straight length of 1 inch square tube cut square at both ends. The pieces are held together by flat plates called gussets that lie across each joint and are bolted through the tubes. A steel sleeve inside the tube at every bolt stops the bolt from crushing it. See base-plan.svg for the view from above and drawing.svg for the side.

So there are only three things to obtain: straight tube cut to length, flat plates cut to a drawn outline, and bolts. You have three ways to get the tube cut:

1. **Cut it yourself.** Buy stock bars and cut them with a miter saw fitted with a blade for non-ferrous metal, or with a hacksaw and a miter box. This is the cheapest route and the one priced here.
2. **Have the supplier cut it.** Online Metals says every order is cut to size, and Metals Depot offers a cut to size option. Order each line of cut-list.csv as its own cut length. You pay more per foot and receive a box of finished pieces. Their cut tolerance is looser than yours can be, so check every piece against the list when it arrives.
3. **Hand the package to a local shop.** A metal supplier with a saw, a fabrication shop or a makerspace can cut and drill the whole frame. Give them cut-list.csv, drilling.csv, base-plan.svg, drawing.svg and the DXF files. If they offer to weld it instead, that is a different frame from this one and needs its own review.

The plates are cut by a laser-cutting service from the DXF files in the kit. You do not make those by hand.

## 2. Set the size first

1. Measure the dog lying stretched out, sitting, and across the shoulders. Add room to shift position.
2. Open https://buddywheels.org/design-studio-rover, set clear length, width and height, and download the kit. Every cut length, hole position and fabric blank below changes with those three numbers.
3. This guide is for ${s.length} x ${s.width} x ${s.height} clear, a ${s.ramp} ramp at ${d.rampAngle.toFixed(1)} degrees, ${d.wheel.label} wheels${d.swivel ? ' and a swivel front caster' : ''}.

## 3. Order in this sequence

Order the wheel and caster first, because two dimensions in the design come from them.

| Step | What | Where | Quantity | Notes |
| --- | --- | --- | --- | --- |
| A | Rear wheel | ${s.wheel === 'trail' ? '[Zoro Select 1NWV4](https://www.zoro.com/zoro-select-pneumatic-wheel-15-316dia-435lb-400-8-1nwv4/i/G1932594/), $32.89 each' : s.wheel === 'path' ? '[Harbor Freight 67467](https://www.harborfreight.com/13-inch-x-4-inch-pneumatic-tire-67467.html), $14.99 each' : 'Not selected. No suitable 20 inch wheel has been found'} | ${c.wheels} | When they arrive, measure the hub from bearing face to bearing face. If it is not ${s.hub}, enter the real number in the studio and download the kit again before cutting axles |
${d.swivel ? `| A | Front caster | [Service Caster SCC-100S3504-PNB-BSL](https://www.zoro.com/service-caster-10-inch-black-pneumatic-wheel-swivel-caster-with-bolt-swivel-lock-scc-100s3504-pnb-bsl/i/G705434817/), $64.69: 10 inch pneumatic, swivel lock, 350 lb and a 12-3/16 inch mounting height stated | 1 | Measure from the floor to the top of the mounting plate. This guide assumes ${s.caster}. If yours differs, enter it in the studio: it sets the nose post length. A [Harbor Freight 63799](https://www.harborfreight.com/10-in-pneumatic-swivel-caster-63799.html) at $19.99 also fits, with no swivel lock and no stated height |\n` : ''}| A | Parking brake | [POWERTEC 302F push-pull toggle clamp](https://www.zoro.com/powertec-toggle-clamp-300lbs-cap-302f-quick-release-pushpull-clamp-20304n/i/G714915420/), $10.70 each, and a [rubber bumper pair with a 5/16 inch stud](https://www.zoro.com/midwest-fastener-516-x-1-18-x-58-male-cylinder-bumper-mount-2pk-930876/i/G802529522/), $17.89 | 2 clamps, 1 bumper pair | Check the bumper stud threads into the clamp plunger before anything else. Eight #10 screws and lock nuts hold the clamps to their plates |
| B | Gussets and hangers | A laser-cutting service. [SendCutSend](https://sendcutsend.com) lists both materials, accepts DXF, has no minimum quantity and ships laser parts in 1 to 3 days | ${c.corner} x corner_gusset.dxf, ${c.tee} x tee_gusset.dxf and 2 x brake_plate.dxf in 0.125 inch 6061-T6 aluminum. ${c.hanger} x ${d.wheel.hanger}.dxf in 0.125 inch 304 stainless | Upload the four DXF files from the metal folder, pick material and thickness, enter quantities. Add their deburring service or file the edges yourself |
| C | Chassis tube, 1 x 1 x 1/8 inch 6061-T6 | [Metals Depot T3118-6061](https://www.metalsdepot.com/aluminum-products/aluminum-square-tube), 8 ft at $58.08 | ${heavyBars.length} bars | 8 ft is the longest that ships by parcel. Longer bars are cheaper per foot but come by truck |
| C | Cabin tube, 1 x 1 x 1/16 inch 6063-T52 | [Metals Depot T31116](https://www.metalsdepot.com/aluminum-products/aluminum-square-tube), 8 ft at $41.60 | ${lightBars.length} bars | Do not swap this softer tube into the chassis positions |
| D | Bolts, nuts, washers | [Bolt Depot](https://boltdepot.com/Product-Details?product=328): 1/4-20 x 2 inch grade 5 zinc hex bolt 328, lock nut 2624, SAE washer 2976 | ${boxes} boxes of 100 bolts, ${boxes} of nuts, ${Math.ceil(2 * fasteners / 100)} of washers | You need ${c.bolts} bolts, plus ${c.handleBolts} at 3 inch long for the handle${d.swivel ? ` and ${c.casterBolts} at 5/16-18 x 2-1/2 inch for the caster` : ''} |
| D | Sleeve tube | [Online Metals DOM steel tube, 3/8 inch OD x .049 wall](https://www.onlinemetals.com/en/buy/carbon-steel/0-375-od-x-0-049-wall-x-0-28-id-carbon-steel-round-tube-a513-type-5-dom/pid/7754), $11.66 per 6 ft | ${Math.ceil(c.sleeves * 26.9 / 1828.8)} lengths of 6 ft | Cut into ${c.sleeves} sleeves, each ${t} long |
| D | Axle parts | [Online Metals DOM tube, 3/4 inch OD x .065 wall](https://www.onlinemetals.com/en/buy/carbon-steel/0-75-od-x-0-065-wall-x-0-62-id-carbon-steel-round-tube-a513-type-5-dom/pid/7765), $4.99 per foot. A 5/8 inch x 3 ft plain steel rod from a hardware store, about $20.57. [Bolt Depot](https://boltdepot.com) 5/8 inch SAE washers at $0.15 and 1/8 x 1-1/2 inch cotter pins at $0.07 | 1 ft of tube, 1 rod, ${d.swivel ? 4 : 8} washers, ${d.swivel ? 4 : 6} cotters | You need ${rodMm} of rod. Never use threaded rod as an axle |
| E | Plywood | [Home Depot 15/32 inch ACX sanded pine](https://www.homedepot.com/b/Lumber-Composites-Plywood/15-32/N-5yc1vZbqm7Z1z0mcqq), $52.00 a sheet | ${d.topRail + s.ramp + 10 <= 2438.4 && s.width + 2 * t <= 1219.2 ? 1 : 2} | Floor ${d.topRail} x ${mm(s.width + 2 * t)} and ramp ${s.ramp} x ${d.rampWidth}. Plus exterior sealer |
| F | Ramp hardware | [Zoro Select 2ZFK4 stainless piano hinge, 36 inch](https://www.zoro.com/zoro-select-piano-hinge-stainless-steel-full-surface-mounting-1-in-leaf-w-x-36-in-leaf-h-stainless-steel-2zfk4/i/G1671966/), $18.19. [Southco TL-20-202-52 stainless draw latch](https://www.zoro.com/southco-toggle-style-draw-latch-small-size-concealed-mount-stainless-steel-passivated-tl-20-202-52/i/G115615363/), $11.89. [S&W BSW-1Z 3/8-16 swivel leveling mount](https://www.zoro.com/s-w-manufacturing-level-mount-swivel-stud-38-16-1-14-in-bsw-1z/i/G1257593/), $6.15 | 1 hinge, 2 latches, 2 short leveling mounts, ${c.rampBolts} carriage bolts 1/4-20 x 2 inch (Bolt Depot 2754, $0.16), 2 threaded inserts for 1 inch square tube with a 3/8-16 thread | The hinge is unpunched: cut it to ${Math.floor(d.rampWidth / 10) * 10} and drill it. Check the latch comes with its keeper. No threaded insert was found at these suppliers; a furniture-hardware supplier is the place to look |
| F | Handle, floor and parking | The same leveling mount in its tall version, $11.59. [Harbor Freight 96479 rubber wheel chock](https://www.harborfreight.com/solid-rubber-wheel-chock-96479.html), $7.49, in store. Hardware store: 1/4-20 rivet nuts, foam grip tube for a 1 inch bar, 1/8 inch foam strip | 2 tall leveling mounts, 2 chocks, ${c.floorScrews} rivet nuts and flat-head screws 1/4-20, about ${Math.ceil((s.width - 60) / 152.4)} foam grips of 6 inch, about 9 m of foam strip, one 12.7 mm aluminum tube ${d.topRail} long | A 4 ft store tube is too short for a ${d.topRail} ridge. Rivet nut, grip and foam strip prices were seen on listings only |
| G | Cover materials | See buy-list.md for every line with its link | | Cut list in cover-cut-schedule.csv |
| H | Filament | Any PETG for fit trials, ASA for parts left in the sun | About 1 kg | ${Object.entries(q).filter(([id]) => roverParts.find(p => p.id === id)!.kind !== 'metal').reduce((n, [, v]) => n + v, 0)} printed pieces in all |

Materials for one build come to about ${money(roverBuyTotal(s))} before tax and shipping. buy-list.md splits that into prices read on a supplier page and allowances.

## 4. Tools

- Miter saw with a non-ferrous metal blade, or a hacksaw with a miter box. Two clamps. A file or deburring tool.
- Drill press if you can get one; a hand drill with a drill guide block works. Center punch and hammer.
- Drill bits: 1/8 inch for pilots, 3/16 inch for the brake clamp screws, letter W (0.386 inch, 9.8 mm) for sleeve holes, 17/64 inch for plain bolt holes, 3/8 inch for the tip-stop stems, a 3/4 inch step bit or hole saw for the axle sleeve${d.swivel ? ', 7/16 inch for the caster bolts' : ''}.
- Tape measure, steel rule, combination square, calipers, a fine marker and a scriber.
- Two 7/16 inch wrenches or a wrench and socket. Rivet nut setter. Jigsaw for the plywood.
- A 3D printer with a bed of at least 220 x 220 mm.
- Safety glasses and hearing protection. Aluminum chips are sharp and hot.

## 5. Print first

Print in this order, because the first pieces are tools for the rest.

1. coupon.stl. Measure its holes with calipers. If the 6.75 hole is off by more than 0.2, adjust your slicer before printing anything else.
2. guide_butt.stl, guide_run.stl and guide_tee.stl. These are the drill guides.
3. One cap_heavy.stl and one cap_light.stl. Try them in an offcut of each tube.
4. The rest: ${roverParts.filter(p => p.kind === 'print').map(p => `${q[p.id]} x ${roverPartFile(p.id)}`).join(', ')}.

Files named FIT_CHECK_ONLY are plastic copies of the metal plates. Print one of each to rehearse a joint. They never go in the carrier.

## 6. Cut the tube

Cut the long pieces first. Clamp the bar, cut square, and leave the saw 3 mm per cut. Deburr both ends inside and out. Write the ID on each piece as it comes off the saw. Cut pairs to the same stop so they match each other exactly; matching matters more than the absolute length.

Chassis tube, 1/8 inch wall, from ${heavyBars.length} bars of 8 ft:

| Bar | Pieces, ID and length | Offcut |
| --- | --- | ---: |
${bars(heavyBars)}

Cabin tube, 1/16 inch wall, from ${lightBars.length} bars of 8 ft:

| Bar | Pieces, ID and length | Offcut |
| --- | --- | ---: |
${bars(lightBars)}

| ID | Member | Qty | Cut |
| --- | --- | ---: | ---: |
${d.cuts.map(x => `| ${x.id} | ${x.name} | ${x.qty} | ${x.length} |`).join('\n')}

Then cut ${c.sleeves} sleeves ${t} long from the 3/8 inch steel tube, ${axleSleeves} axle sleeves ${t} long and 2 wheel spacers ${d.spacer} long from the 3/4 inch tube, and the axles: 2 at ${d.rearShaft}${d.swivel ? '' : ` and 1 at ${d.frontShaft}`}. Square and deburr every one. A sleeve that is short lets the tube crush; one that is long keeps the plate from seating.

## 7. Mark and drill

Every hole is in drilling.csv, measured from a named end of a named piece. "Side" means through the two vertical faces of the tube as it sits in the carrier. "Vertical" means through top and bottom. "Fore-aft" means front to back.

1. Lay the tube down with the face to be drilled upward. Scribe a centerline along that face, 12.7 from either edge.
2. Use the printed guides for the repeated patterns. guide_butt hooks over a cut end and gives 22.3, 37.3, 52.3 and 67.3. guide_run gives 47.7, 62.7, 77.7 and 92.7 from a rail end. guide_tee centers on a scribed joint line and gives 30 each side. For anything else, measure and center punch.
3. Drill a 1/8 inch pilot through both walls in one pass, keeping the drill square. Then open to the size in the table. Deburr inside and out.
4. Push a sleeve into each sleeve hole. It should enter with thumb pressure and sit flush with both faces.
5. Drill pairs together where you can: clamp the two base rails side by side and drill both.

The base rails carry the most holes. For this configuration, from the rear end of each C01:

| Direction | Centers from the rear end | For |
| --- | --- | --- |
${drilling.filter(r => r.id === 'C01').map(r => `| ${r.axis} | ${r.centers.join(', ')} | ${r.purpose} |`).join('\n')}

Wait to drill the axle sleeve holes in the axle posts until a hanger plate is in your hand: clamp the hanger to the post, mark through its large hole, and drill to that mark.

## 8. Assemble the base flat

Work on a flat floor or table.

1. Lay the two C01 rails parallel, ${mm(2 * d.postY)} apart center to center, rear ends level.
2. Set the two C02 end cross members between them, one at the rear end and one with its center ${mm(d.stations.at(-1)! - d.rearX + t)} from the rear end. Slide a corner gusset under each of the four corners, long-hole leg along the rail. Drop bolts down through tube, sleeve and plate with a washer under the head; add washer and lock nut underneath. Leave them finger tight.
3. Set the ${d.intermediates} C14 cross members at ${d.stations.slice(1, -1).map(x => mm(x - d.rearX + t)).join(', ')} from the rear end, each with a tee gusset under each end, the stem along the cross member.
4. Measure both diagonals of the rectangle. Tap the frame until they match within 2 mm. Then tighten every bolt until the lock nut is fully engaged and the plate is clamped. Do not crush the tube; the sleeves set the limit. No torque figure is given because none has been validated.
5. Stand each C03 axle post on a rail at ${mm(t + s.axle)} from the rear end, a hanger on each side face, bar along the rail, stem up the post. Bolt the bar to the rail and the stem to the post. Fit the 3/4 inch axle sleeve through hanger, post and hanger.

The base now stands on its own and has the shape in base-plan.svg.

## 9. Wheels${d.swivel ? ' and nose' : ' and fork'}

1. Slide each rear axle through its sleeve from inside. From the inside out the order is cotter, washer, inner hanger, post, outer hanger, spacer, wheel, washer, cotter. The stack between washer faces should be ${d.rearStack} with about 0.5 of end float. Spin the wheel. It must not rub the hanger.
${d.swivel ? `2. Stand the four C15 nose posts on the rail extensions at ${mm(d.casterX - h.casterAlong / 2 - d.rearX + t)} and ${mm(d.casterX + h.casterAlong / 2 - d.rearX + t)} from the rear end. Each gets a corner gusset on both side faces, the rail leg pointing away from the other post.
3. Lay the two C16 caster beams across the post tops, ends flush with the outside of the rails. Tie each beam to its two posts with one corner gusset on the outside face.
4. Hold the caster up under the beams on the centerline with its plate spanning both. Its bolt pattern is not published, so mark its four holes from the plate itself, drill 7/16 inch through each beam with a sleeve, and bolt it on. If the holes do not land on both beams, slide the front beam along the post tops before drilling its gusset holes.
5. Roll the frame. It should steer by pushing the handle end sideways and the caster should swing a full circle without touching the cabin front or the posts. Fit the bolt-on swivel lock as its maker shows and check it holds the wheel straight.` : `2. Butt the two C04 fork arms against the front cross member at ${d.forkY} each side of center, a tee gusset above and below each.
3. Stand a C05 stub post on each arm at the front axle with a hanger on both faces, fit the axle sleeves, and mount the front wheel on its through axle.`}

## 10. Cabin frame

1. Stand the four C09 corner posts on the rail ends, one corner gusset on the outside face of each, long-hole leg up the post.
2. Lay the two C10 top rails on the posts. Corner gussets on the outside face at each corner post, a pair at each axle post.
3. Fit the three C11 top cross tubes: front and rear with a corner gusset on top at each end, the middle one over the axle posts with a tee gusset on top.
4. Check the frame for square in both directions before the final tightening.
5. Clip the three ridge saddles over the top cross tubes at the centerline and lay the 12.7 mm ridge tube in them.

## 11. Floor

1. Cut the floor panel ${d.topRail} x ${mm(s.width + 2 * t)}. Notch 44 x 30 at each of the six posts.
2. Seal every face and edge, including the notches, and let it cure.
3. Stick bedding tape along the rails and cross members between the plates.
4. Set rivet nuts in the tube tops about every 250 and fasten the floor down with flat-head screws.

## 12. Ramp and tailgate

1. Cut the ramp panel ${s.ramp} x ${d.rampWidth} and seal it.
2. Bolt the two C06 curb rails on top along the long edges with carriage bolts, smooth heads underneath.
3. Bolt the two C07 ribs underneath, one 40 from the hinge edge and one at mid length.
4. Fit the two C08 stand legs under the hinge-end rib, 60 in from each end, a corner gusset on both faces of the rib. Press a threaded insert into each leg and screw in a leveling foot. The leg bolts leave about ${Math.round(d.legCut - 52.3)} of clear bore, so cut the foot stem short if it bottoms out.
5. Screw the hinge to the top face of the floor edge and the top face of the ramp, with a 6 gap between the panels.
6. Lower the ramp on level ground and turn the stand feet until both touch and the hinge is not being levered.
7. Stick the traction sheet between the curbs, stopping 18 short of the ground edge, and slide the three printed toes onto that edge with a bead of sealant.
8. Raise the ramp. Fit the two draw latches to the rear posts and the safety strap as a separate, second hold.

## 13. Handle, tip-stops and parking brake

1. Bolt each C12 handle arm to the outside of a rear corner post and an axle post with one 3 inch bolt per post, ${s.handle} above the ground.
2. Fit the C13 grip tube between the arm ends with a corner gusset above and below each end. Slide on the foam grip.
3. Screw a tall leveling mount up through each base rail at ${mm(117.3 + t)} from the rear end, a nut and washer above and below. Set the pads about 40 above the ground.
4. Brake arms. Butt a C17 arm against the outside face of each axle post, ${mm(d.brakeZ - d.railZ - t / 2)} up the post, pointing outward over the tire. Put a corner gusset on the front and rear faces, long-hole leg along the arm, and bolt through. On the front, hang a brake clamp plate on the same two arm bolts, outside the gusset.
5. Hold a toggle clamp against the plate with its plunger pointing straight down at the middle of the tread. With the handle open the pad should clear the tire by about 10; closed, it should press about 10 into it. Mark the four base holes, drill 3/16 inch through the plate, and bolt the clamp on.
6. Thread the rubber bumper onto the plunger and set its height with the plunger lock nut. Close both clamps and try to roll the carrier. It should not move on level ground.
7. Chock both rear wheels as well on any slope and whenever the ramp is down. The clamps are a parking brake only. Nothing slows the carrier while it is moving.

## 14. Cover

Cut the ${cover.pieces.reduce((n, p) => n + p.qty, 0)} blanks in cover-cut-schedule.csv. Sew and seal as described in materials.md. Hang the cover with the printed rail clips and the hook-and-loop tabs.

## 15. Before any load

1. Check every bolt has a sleeve, two washers and a lock nut with thread showing.
2. Push, pull and rack the empty frame by hand. Nothing should shift or click.
3. Load sandbags in four steps up to the weight of the dog, in the middle of the floor. Look at the floor, the axle posts and the hangers at each step. Then move the bags to the tailgate end and watch for the front lifting. Stop at the first thing that bends, slips or creaks.
4. Walk the loaded ramp with sandbags at mid span and at the hinge.
5. Roll it loaded over the surfaces you intend to use, at walking pace.

Passing these does not make it safe for a dog. It tells you the bench carrier is worth showing to an engineer and to the dog's vet, which is the next step in assembly.md.
`
}

/** Material cost of one build, the figure the buy list reports. */
export function roverBuyTotal(s: RoverSetup): number {
  const one = roverEconomics(s, 1); const skip = new Set(['labor', 'qa', 'pack', 'freight', 'machine'])
  return one.tube + roverCostLines(s).filter(l => !skip.has(l.id)).reduce((n, l) => n + l.one, 0) + roverTextileCost(s, 1).rows.reduce((n, r) => n + r.purchase, 0)
}

/** What one builder would actually buy for one carrier: whole purchasing units, where from, and how sure the price is. */
export function roverBuyList(s: RoverSetup): string {
  const one = roverEconomics(s, 1); const d = roverDimensions(s); const textiles = roverTextileCost(s, 1)
  const skip = new Set(['labor', 'qa', 'pack', 'freight', 'machine'])
  const lines = roverCostLines(s).filter(l => !skip.has(l.id))
  const tubeRows = [
    { name: `${one.light.bars} bars of 1 x 1 x 1/16 inch 6063-T52 square tube, ${roverParcelStock.label} each`, cents: one.light.bars * roverParcelPrices.light, basis: roverTubePrices.light.basis, url: roverTubePrices.light.url },
    { name: `${one.heavy.bars} bars of 1 x 1 x 1/8 inch 6061-T6 square tube, ${roverParcelStock.label} each`, cents: one.heavy.bars * roverParcelPrices.heavy, basis: roverTubePrices.heavy.basis, url: roverTubePrices.heavy.url },
  ]
  const parts = [...tubeRows, ...lines.map(l => ({ name: l.name, cents: l.one, basis: l.evidence, url: (l as { url?: string }).url }))]
  const cover = textiles.rows.map(r => ({ name: `${r.name}: ${r.units} ${r.unit}`, cents: r.purchase, basis: 'Listed price', url: roverMaterials.find(m => m.id === r.id)!.url }))
  const sum = (rows: { cents: number }[]) => rows.reduce((n, r) => n + r.cents, 0)
  const firm = sum([...parts, ...cover].filter(r => r.url)); const total = sum(parts) + sum(cover)
  const row = (r: { name: string, cents: number, basis: string, url?: string }) => `| ${r.url ? `[${r.name}](${r.url})` : r.name} | ${money(r.cents)} | ${r.basis} |`
  return `# Buddy Rover r0 buy list for one carrier

Configuration ${roverCode(s)}. Checked ${roverPriceDate}, USD, before tax and shipping. This is what one builder buys for one bench carrier, in whole bars, sheets, yards and packs, so it is more than the material the carrier consumes. It is a bench build. Nothing here is rated or approved for carrying an animal.

**Materials to buy: about ${money(total)}.** ${money(firm)} of that has a supplier page behind it. The remaining ${money(total - firm)} is allowance and needs a quote or a shop visit. Your own time is extra: the study assumes about 15 hours of cutting, drilling and assembly and ${Math.round(textiles.minutes / 60)} hours of sewing.

## Frame, running gear and hardware

| Item | Cost | Basis |
| --- | ---: | --- |
${parts.map(row).join('\n')}
| **Subtotal** | **${money(sum(parts))}** | |

Cut from the bars with cut-list.csv. Send metal/*.dxf to a laser or waterjet shop for the ${d.counts.corner} corner gussets, ${d.counts.tee} tee gussets and ${d.counts.hanger} axle hangers. The parts list in bom.csv has every specification.

## Cover, floor and ramp surface

| Item | Cost | Basis |
| --- | ---: | --- |
${cover.map(row).join('\n')}
| **Subtotal** | **${money(sum(cover))}** | |

Cut from cover-cut-schedule.csv. A 10% allowance for sewing mistakes is not in this subtotal.

## Before you order

1. Measure the dog and set the cabin size first. Every tube cut and fabric blank follows from it.
2. Buy one wheel and measure its hub before cutting an axle or ordering hangers.
3. Print the clearance coupon and one cap, then the rest.
4. Read the release gates in assembly.md. This list builds a bench carrier for fit and handling trials with ballast, not a finished product.
`
}

export function roverDocuments(s: RoverSetup): Record<string, string> {
  const d = roverDimensions(s)
  return {
    'assembly.md': roverAssembly(s), 'bom.csv': roverBom(s), 'materials.md': roverMaterialsMarkdown(s), 'cover-cut-schedule.csv': roverCoverCsv(s), 'cover-panels.svg': roverCoverSvg(s), 'drawing.svg': roverDrawing(s),
    'cut-list.csv': csv([['ID', 'Quantity', 'Member', 'Stock', 'Cut mm'], ...d.cuts.map(c => [c.id, c.qty, c.name, WALL[c.wall as 'heavy' | 'light'], c.length])]),
    'cost-notes.md': roverCostMarkdown(s), 'buy-list.md': roverBuyList(s), 'build-guide.md': roverBuildGuide(s), 'drilling.csv': roverDrillingCsv(s), 'base-plan.svg': roverBasePlan(s), 'cost-model.json': JSON.stringify(roverCostModel(s), null, 2) + '\n',
    'setup.json': JSON.stringify({ revision: 'r0', product: 'Buddy Rover', ...s, dimensions: { ...d, rampAngleRad: undefined }, status: 'BENCH_ONLY_NOT_ANIMAL_USE', ownerReportedWeightLb: 140, fitted: false, loadRated: false }, null, 2) + '\n',
  }
}
