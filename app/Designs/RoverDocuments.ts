import type { RoverSetup } from './Rover'
import { mm, nestRoverStock, referenceCarrier as ref, roverCode, roverDimensions, roverHardware as h, roverParcelStock, roverPartFile, roverParts, roverPlanningDogKg } from './Rover'
import { roverAllowanceNotes, roverCostLines, roverShock, roverCostModel, roverEconomics, roverParcelPrices, roverPriceDate, roverPriceEvidence, roverTubePrices } from './RoverCost'
import type { TubeHole, TubeSpec } from './Step'
import { angleGussetDxf } from './RoverParts'
import { stepFile, tubeBrep } from './Step'
import { roverCover, roverCoverSvg, roverMaterialAlternates, roverMaterials, roverTextileCost, roverTextileDate } from './RoverSoftGoods'
import { signedMoney as money } from '../Storefront/Catalog'

const csv = (rows: (string | number)[][]) => rows.map(row => row.map(v => `"${String(v).replaceAll('"', '""')}"`).join(',')).join('\n') + '\n'
const inch = (n: number) => (n / 25.4).toFixed(1)
const WALL = { heavy: '6061-T6 1 x 1 x 1/8 inch square tube', light: '6063-T52 1 x 1 x 1/16 inch square tube' } as const

export function roverPrintQuantities(s: RoverSetup): Record<string, number> {
  const c = roverDimensions(s).counts
  return { cap_heavy: c.capHeavy, cap_light: c.capLight, ramp_toe: c.toe, ridge_saddle: c.saddle, fabric_clip: c.fabricClip, cable_clip: c.cableClip, axle_cover: c.axleCover, guide_butt: 1, guide_run: 1, guide_tee: 1, coupon: 1, tee_gusset: c.tee, corner_gusset: c.corner, brake_plate: 2, shock_plate: c.shockPlates, shock_hanger: c.shockHangers, axle_hanger: s.wheel === 'run' ? c.hanger : 0, axle_hanger_mid: s.wheel === 'trail' ? c.hanger : 0, axle_hanger_low: s.wheel === 'path' ? c.hanger : 0 }
}
export function roverBom(s: RoverSetup): string {
  const d = roverDimensions(s); const c = d.counts; const q = roverPrintQuantities(s); const w = d.wheel
  return csv([
    ['ID', 'Quantity', 'Part', 'Specification', 'Status'],
    ...d.cuts.map(cut => [cut.id, cut.qty, cut.name, `${WALL[cut.wall as 'heavy' | 'light']}; cut ${cut.length} mm`, 'Cut to fit. Not telescoping']),
    ...(d.welded ? [['J01', c.weldJoints, 'Welded joint', 'TIG, 4043 or 5356 filler at the shop\'s choice, fillet all round unless weld-schedule.csv says otherwise', 'No weld procedure, sample or strength figure exists. The metal beside every weld is softer than the tube it joins']] : [
      ['M01', c.corner, 'Corner gusset', '6061-T6 3.175 mm, metal/corner_gusset.dxf', 'One profile, flipped for the opposite hand. Single outside plate at the eight corner-post joints. Fatigue and bearing review pending'],
      ['M02', c.tee, 'Tee gusset', '6061-T6 3.175 mm, metal/tee_gusset.dxf', 'Single-sided at base cross members and roof bow; paired at the fork'],
      ...d.angles.map((a, i) => [`M0${6 + i}`, a.qty, a.name, `6061-T6 3.175 mm, metal/${a.file}.dxf, legs at ${a.angle.toFixed(1)} degrees`, `${a.where}. Cut for this setup only: a different rake, taper or height needs new files`]),
    ]),
    ...(c.hanger ? [['M03', c.hanger, 'Axle hanger', `304 stainless 3.175 mm, metal/${w.hanger}.dxf`, 'Paired on every axle post and fork stub. Finish the 19.25 mm bore after drawing review']] : []),
    ['M04', 2, 'Brake clamp plate', '6061-T6 3.175 mm, metal/brake_plate.dxf', d.welded ? 'Bolts to the front face of the brake arm with two bolts. Drill its clamp holes from the delivered clamp' : 'Hangs on the two brake-arm gusset bolts. Drill its clamp holes from the delivered clamp'],
    ...(d.sprung ? [
      ['M05', c.shockPlates, 'Shock plate, swing arm', '6061-T6 3.175 mm, metal/shock_plate.dxf', 'A pair on the two side faces of each swing arm. Check the 8.2 eye hole and the 25.4 gap against the delivered shock'],
      ['M09', c.shockHangers, 'Shock hanger, axle post', '6061-T6 3.175 mm, metal/shock_hanger.dxf', 'A pair on each axle post, either side of a C23 spacer tube'],
      ['U01', c.shocks, 'Coil-over shock', `${h.shockLength} mm eye to eye, ${h.shockStroke} mm travel, spring labeled ${h.shockRate} lbs, 24 mm wide eyes with an 8 mm bore; LvTu 150 mm candidate`, 'Candidate only. Travel and sag figures assume the seller\'s numbers and treat the spring label as lb/in. Damping, life and corrosion unknown'],
      ['U02', 2, 'Swing arm pivot bolt', `1/2-13 x 4 inch grade 5 hex bolt, lock nut, two washers, a 5/8 inch OD crush sleeve in the rail and a ${h.swingGap} mm spacer`, 'Single bolt through the base rail. Side play here becomes wheel wobble; untested'],
      ['U03', 4, 'Pivot bushing', 'Oil-impregnated bronze flanged sleeve bearing, 1/2 ID x 5/8 OD x 1/2 inch long', 'One pressed into each wall of each swing arm, flange outside'],
      ['U04', 4, 'Shock eye bolt', 'M8 x 50 hex bolt and nylon-insert lock nut', 'One through each pair of plates'],
      ['U05', c.shockBolts, 'Shock hanger bolt', `1/4-20 x 3-1/2 inch grade 5 hex bolt, lock nut, two washers and a ${(h.swingGap - h.plate).toFixed(1)} mm spacer cut from the sleeve tube`, 'Through outer hanger, spacer tube, inner hanger, spacer and axle post. Two per side'],
    ] : []),
    ...(d.seats ? [
      ['S01', 1, 'Seat board', `15/32 inch plywood ${mm(h.seatDepth + h.tube)} x ${s.width} mm, sealed, with a pad`, 'CONCEPT. Not a child seat'],
      ['S02', 1, 'Back sling and divider', `Fabric sling ${s.width - 40} x ${h.seatBack - 40} mm between the back bar and the rear seat tube, and a center divider`, 'CONCEPT. Not designed'],
      ['S03', 2, 'Five-point harness', 'One per seat', 'OPEN. No anchor is designed and no restraint is certified. NOT FOR USE WITH A CHILD'],
    ] : []),
    s.wheel === 'trail'
      ? ['W01', c.wheels, 'Pneumatic wheel candidate, 15 inch 4.00-8', `Zoro Select 1NWV4; 15 3/16 inch OD, 3 1/8 inch wide, 5/8 inch bore, ball bearings, hub length stated 4 inch; configured ${s.hub} mm`, 'Supplier states a 435 lb wheel load. That does not rate the carrier. Measure the delivered hub before cutting an axle']
      : s.wheel === 'path'
      ? ['W01', c.wheels, 'Pneumatic wheel candidate, 13 x 4 inch', `HAUL-MASTER 67467; 330.2 OD, 101.6 wide, 15.875 bore; hub through-length assumed ${s.hub} mm`, 'Same candidate as the XL wheelchair. Hub length is not confirmed by the supplier. A garden-cart wheel for walking pace; its supplier rating is not a carrier rating']
      : ['W01', c.wheels, 'Pneumatic wheel, 20 inch', `508 OD, about ${w.tire} wide, 15.875 bore; hub through-length assumed ${s.hub} mm`, 'OPEN SELECTION. No verified wheel with this bore and a suitable rating has been found'],
    ['W02', 2, 'Rear stub axle', `Plain 15.875 steel shaft; cut ${d.rearShaft} mm; two 3.2 cross-holes 8 mm from each end`, 'Unkeyed precision shaft. Never a threaded journal'],
    ...(d.swivel ? [['W07', 1, 'Front swivel caster with swivel lock, 10 inch pneumatic', `Service Caster SCC-100S3504-PNB-BSL; 10 x 3-1/2 inch wheel, top plate, stated mounting height 12-3/16 inch; configured ${s.caster} mm`, 'Supplier states 350 lb and a bolt-on swivel lock. The maker lists a 4 x 4-1/2 inch plate with holes at 2-5/8 x 3-5/8 inch slotted to 3 x 3 inch for this series. Lock the swivel for running'], ['H06', c.casterBolts, 'Caster bolt set', '5/16-18 x 2-1/2 inch grade 5 bolt, two washers, lock nut and a steel crush sleeve', 'Vertical through both caster beams, with a washer over each plate slot. Check the delivered plate against the drilling schedule first']] : [['W03', 1, 'Front through axle', `Plain 15.875 steel shaft; cut ${d.frontShaft} mm; two 3.2 cross-holes 8 mm from each end`, 'Carried in both fork stubs']]),
    ['W04', d.swivel ? 2 : 4, 'Axle sleeve', '4130 tube 19.05 OD x 1.4732 wall; cut 25.4 mm', d.swivel ? 'Through each axle post. Steel, not printed' : 'Through each axle post and fork stub. Steel, not printed'],
    ['W05', w.forkSpacer && !d.swivel ? 4 : 2, 'Wheel spacer', `4130 tube 19.05 OD x 1.4732 wall; cut ${w.spacer} mm`, w.forkSpacer && !d.swivel ? 'Two at the rear wheels, two beside the front hub so the wide tire clears the fork. Check actual hub and bearing face contact' : 'Rear wheels only. Check actual hub and bearing face contact'],
    ['W06', d.swivel ? 4 : 8, 'Thrust washer and split cotter set', '5/8 inch bore washer 1.5 mm; 3.2 mm stainless cotter', d.swivel ? 'Two washers and two cotters per rear wheel' : 'Rear: 2 washers and 2 cotters per side. Front: 4 washers and 2 cotters'],
    ['H01', c.bolts, 'Joint bolt', '1/4-20 x 2 inch SAE J429 grade 5 zinc hex bolt', 'Partially threaded shank required at sleeves. Torque procedure pending. 18-8 stainless is the salt-use upgrade'],
    ...(c.handleBolts ? [['H02', c.handleBolts, 'Handle lap bolt', '1/4-20 x 3 inch grade 5 zinc hex bolt', 'Through one handle arm and one post']] : []),
    ['H03', c.sleeves, 'Crush sleeve', 'A513 DOM steel tube .375 OD x .049 wall; cut 25.4 mm', 'One per tube crossing. Corrosion finish between steel and aluminum pending'],
    ['H04', 2 * (c.bolts + c.handleBolts), 'Bolt washer', '1/4 inch zinc steel flat washer', 'Two per bolt'],
    ['H05', c.bolts + c.handleBolts, 'Prevailing-torque nut', '1/4-20 zinc nylon-insert locknut', 'New nuts at every assembly'],
    ['F01', 1, 'Floor panel', `15/32 inch (12 mm) ACX exterior plywood ${d.floorLen} x ${s.width + 2 * h.tube} mm, six post notches 44 x 30, sealed all faces and edges; marine plywood for salt use`, 'Sits on gussets and bedding tape. Deflection under a standing dog not yet calculated'],
    ['F02', 1, 'Bedding tape', '3.2 mm closed-cell tape, 25 mm wide, about 9 m', 'Fills the gusset thickness under both panels'],
    ['F03', c.floorScrews, 'Floor fastener set', '1/4-20 stainless countersunk screw with rivet nut in the tube top wall', 'Rivet nut pull-out in .125 wall to be tested'],
    ['R01', 1, 'Ramp panel', `15/32 inch (12 mm) ACX exterior plywood ${s.ramp} x ${d.rampWidth} mm, sealed all faces and edges, toe edge fitted with printed threshold toes`, 'Curb rails on top, two ribs underneath'],
    ['R02', 1, 'Continuous hinge', `Stainless piano hinge, 1 inch leaf, 36 inch, cut to ${Math.floor(d.rampWidth / 10) * 10} mm; Zoro Select 2ZFK4 candidate, unpunched`, 'Leaves on the top faces, knuckle in the 6 mm gap. Drill and countersink for flat-head screws. Pinch review pending'],
    ['R03', 2, 'Draw latch with keeper', 'Stainless toggle-style draw latch; Southco TL-20-202-52 candidate', 'Holds the raised ramp to both rear posts. The supplier page does not say a keeper is included'],
    ['R04', 1, 'Tailgate safety strap', '1 inch webbing with a metal hook, independent of both latches', 'Second retention path if a latch opens'],
    ['R05', c.rampBolts, 'Ramp carriage bolt', '1/4-20 x 2 inch stainless carriage bolt, washer and locknut', 'Smooth heads on the walking side'],
    ['R06', 2, 'Ramp stand leg cap', 'Printed cap_heavy.stl pressed into the bottom of each stand leg', `Leg cut ${d.legCut} mm puts the capped end on level ground with the ramp lowered. Fixed length: shim on uneven ground`],
    ['B01', 2, 'Wheel chock', 'Solid rubber wheel chock, Harbor Freight 96479 candidate', 'Backup on slopes and whenever the ramp is down'],
    ['B03', 2, 'Parking brake clamp', 'Push-pull toggle clamp, 300 lb holding capacity, about 1-5/16 inch plunger travel; POWERTEC 302F candidate, with four #10 screws and lock nuts each', 'Bolts to a brake clamp plate over each rear tire. Untested as a brake'],
    ['B04', 2, 'Brake pad spindle', 'Toggle clamp spindle, 5/16-18, neoprene flat tip, with jam nuts; DE-STA-CO 507208 candidate', 'Replaces the plain bolt in the clamp plunger. Cut to length if it bottoms out. Adjust so the tip presses about 10 mm into the tire when locked'],
    ['B02', 1, 'Handle grip and wrist tether', `Foam grip for 25.4 tube over ${d.grip} mm; 1.2 m wrist tether`, 'Tether is a secondary link to the caregiver'],
    ['S01', 2, 'Tip-stop foot', '3/8-16 swivel leveling mount, tall version of S&W BSW-1Z, through each base rail behind the axle, nut and washer above and below', 'Catches a rearward tip. Height setting and strength are untested'],
    ['X01', 1, 'Roof ridge pole', `12.7 mm aluminum tube, cut ${d.topRailCut} mm`, 'Rests in three printed saddles'],
    ...(d.ski ? [
      ['K01', 2, 'Ski', `Junior cross-country or pulk ski, about ${h.skiLength} x ${h.skiWidth} mm, flat mounting zone at least ${h.skiFoot} long`, 'OPEN SELECTION. No ski has been chosen or priced from a supplier page'],
      ['K02', 4, 'Ski bolt', '1/4-20 flat-head bolt up through the ski and the ski foot, washer and lock nut', 'Countersink from the sole and seal. Two per ski, 150 mm each side of the post'],
      ['K03', 4, 'Ski post spacer', `4130 tube 19.05 OD x 1.4732 wall; cut ${mm((s.hub - h.tube) / 2)} mm`, 'One each side of the post on the axle, filling the space the wheel hub took'],
      ['K04', 2, 'Tow shaft pin', '3/8 inch quick-release pin with lanyard', `Through the tow shaft and the ${d.swivel ? 'base rail' : 'fork arm'}, so the shaft can pitch`],
      ['K05', 1, 'Hip belt and links', 'Padded hip belt with two short rope or strap links to the shaft ends', 'OPEN SELECTION. Release under load and downhill run-on are untested'],
    ] : []),
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
  const suspensionText = !d.sprung ? '' : `

## Rear suspension

Each rear wheel hangs on a trailing swing arm outside the base rail. The arm pivots on one 1/2 inch bolt through the rail, ${h.swingRun} mm ahead of the axle, and a coil-over shock runs from a pair of plates bolted to the arm up to a pair hung from the axle post around a short spacer tube. Nothing in it is welded, so it fits either frame.

| | |
| --- | --- |
| Arm, pivot to axle | ${d.swingLen} mm |
| Shock, as its seller states | ${h.shockLength} mm eye to eye, ${h.shockStroke} mm travel, spring labeled ${h.shockRate} lbs |
| Shock movement per unit of wheel movement | ${d.motionRatio.toFixed(2)} |
| Rate at the wheel | ${d.wheelRate.toFixed(1)} N/mm (${(d.wheelRate / 0.17513).toFixed(0)} lb/in) |
| Wheel travel | about ${d.wheelTravel} mm |
| Settles under its own weight | about ${d.sagEmpty} mm |
| Settles with the ${roverPlanningDogKg} kg planning mass | about ${d.sag} mm, on ${d.rearWheelKg} kg per rear wheel |

These are arithmetic from the drawn geometry and one candidate shock, taking the seller's spring label as pounds per inch, which nobody has checked. No shock has been fitted or measured, and the tires add their own give on top. The same shock is sold with softer and stiffer springs, so the settle can be tuned once a real one is on the frame. There is no ride measurement and no comparison with any other carrier. Open points: side play at a single-bolt pivot, the parking brake pad on a tire that now moves with the load, and the unsprung front caster.`
  const seatText = !d.seats ? '' : `

## Two-seat concept

**NOT FOR USE WITH A CHILD.** This is a layout study and nothing more. A seat board ${mm(h.seatDepth + h.tube)} deep sits ${h.seatHeight} mm above the deck on two C24 cross tubes, the front one on two C25 legs, with a third C24 as a back bar ${h.seatBack} mm above the seat. Seated height under the roof is about ${d.sittingMax} mm and each place is ${Math.round(s.width / 2)} mm wide.

No joint, harness anchor, restraint, roll-over protection, pinch guard or head support is designed. A carrier for children is a children's product. In the United States a pushed one falls under 16 CFR part 1227, the Safety Standard for Carriages and Strollers, which requires ASTM F833-21, and it needs testing by a CPSC-accepted laboratory and a Children's Product Certificate before sale. A towed one has its own standard, ASTM F1975. None of that work has started. For scale, the reference maker's child trailer lists 40 lb per child and 100 lb in total for two, on a 26 inch shoulder width; its pet trailer page says nothing about children.`
  const boltedText = `## Joint patterns

Every joint is a flat gusset with 1/4 inch bolts through steel crush sleeves. Hole centers are measured from the joint centerline, where two tube centerlines cross. The top rails fall ${s.taper} from rear to front, ${d.roofAngle.toFixed(1)} degrees, and each front pillar leans back ${d.pillarAngle.toFixed(1)} degrees from upright, so three plates are cut to those angles.

| Profile | Qty | Holes from the joint centerline | Where |
| --- | ---: | --- | --- |
| Corner gusset | ${c.corner} | Leg A 50 and 80. Leg B 35 and 65 | Rear post feet on the outside face, rail to cross member, roof corners on top, handle grip, brake arms, ramp legs${d.swivel ? ', nose posts' : ''} |
${d.angles.map(a => `| ${a.name}, ${a.angle.toFixed(1)} degrees between legs | ${a.qty} | Leg A 50 and 80. Leg B 35 and 65 | ${a.where} |`).join('\n')}
| Tee gusset | ${c.tee} | Bar 30 each side. Stem 35 and 60 | Intermediate base cross members, mid roof bow${d.sprung ? ', axle post feet on both faces' : ''}${d.swivel ? '' : ', fork arms top and bottom'} |
${c.hanger ? `| Axle hanger, ${d.wheel.label} wheel | ${c.hanger} | Bar 30 each side. Stem ${d.wheel.posts.join(', ')}. Axle bore at ${d.wheel.rise} | Both faces of each ${d.sprung ? '' : 'axle post and each '}fork stub |\n` : ''}
Legs A and B alternate where two gussets meet on one tube, so bolts cross 15 mm apart and never share a station. Tube bores are 9.725 for the sleeves, plate holes 6.75, axle sleeve bores 19.25. All are nominal. Use the three printed drill guides for pilot centers and finish with metal tooling.

## Build order

1. Print the clearance coupon and measure it. Print one cap and one clip before batching.
2. Cut and deburr every tube. Mark each with its ID. The axle posts, rear posts and pillars have angled ends; see build-guide.md.
3. Base frame: two side rails, ${d.stations.length} cross members. Corner gussets under each corner, tee gussets under each intermediate member.
4. Axle posts at X = 0${d.sprung ? ' with a tee gusset on each side face, bar along the rail, stem up the post.' : ' with paired hangers. The hanger bar bolts to the rail, the stem to the post. Fit the 19.05 axle sleeve through post and both hangers.'}
5. Rear posts with a corner gusset at the foot. Front pillars with a pillar foot gusset. One plate each, on the outside face, with washers on the inside.
6. Top rails on a roof gusset at each rear post, a pair at each axle post and a pillar top gusset at each pillar. Three top cross tubes, corner gussets on top, tee gussets at the mid bow.
${d.swivel ? `7. Nose: the base rails run ${d.nose} past the front cross member. Stand four nose posts on them at X = ${mm(d.casterX - h.casterAlong / 2)} and ${mm(d.casterX + h.casterAlong / 2)}, each with a pair of corner gussets, the rail leg pointing away from the other post. Lay the two caster beams across the post tops and tie each to its posts with one corner gusset on the outside face. Hold the caster plate up under the beams at the centerline, mark its four holes, drill, and bolt it with sleeves.` : `7. Fork: two arms butt against the front cross member at ${d.forkY} each side of center, a tee gusset above and below each. A stub post stands on each arm with a hanger on both faces.`}
8. Floor panel on bedding tape, fastened to the frame.
9. Ramp: panel, two curb rails on top, two ribs underneath at 40 mm and mid length, stand legs on the hinge-end rib 60 mm in from each edge. Hinge leaves on the top faces of floor and ramp.
10. Handle arms on the outside of the rear and axle posts at Z = ${s.handle}, one 3 inch bolt per post. Grip tube between the arm ends.
11. ${d.sprung ? 'Swing arms on their pivot bolts, shock plates and hangers, shocks, then wheels, washers and cotters.' : 'Wheels, washers and cotters.'} Rear stack between outer washer faces ${d.rearStack}${d.swivel ? '' : `, front ${d.frontStack}`}, with 0.5 total end float.
12. Tip-stop feet, the two brake arms with their plates and clamps, latches, safety strap. Then the cover.`
  const weldedText = `## Joints

The frame is welded. There are ${c.weldJoints} joints, listed in weld-schedule.csv, and no gussets. The top rails fall ${s.taper} from rear to front, ${d.roofAngle.toFixed(1)} degrees, and each front pillar leans back ${d.pillarAngle.toFixed(1)} degrees from upright.

| Weld | Qty | Joint | How |
| --- | ---: | --- | --- |
${d.welds.map(x => `| ${x.id} | ${x.qty} | ${x.joint} | ${x.type} |`).join('\n')}

${d.sprung ? `What still bolts on: the two swing arms on their pivot bolts, the two shocks, the two brake clamp plates${d.swivel ? ' and the caster' : ' and the front axle hangers'}. Tube bores are 9.725 for the 1/4 inch sleeves, plate holes 6.75, axle sleeve bores 19.25. All are nominal.` : `Three things still bolt on, with 1/4 inch bolts through steel crush sleeves: the ${c.hanger} axle hangers (bar 30 each side of the post, stem ${d.wheel.posts.join(', ')}, axle bore at ${d.wheel.rise}), the two brake clamp plates, and the ${d.swivel ? 'caster' : 'front axle hangers'}. That is ${c.bolts} bolts in all. Tube bores are 9.725 for the sleeves, plate holes 6.75, axle sleeve bores 19.25. All are nominal.`}

Welding softens the aluminum beside each weld. No strength figure exists for this frame in either build, and nothing here allows for that loss. A welded sample joint, a weld procedure and an engineer's review come before any load.

## Build order

1. Print the clearance coupon and measure it. Print one cap and one clip before batching.
2. Cut and deburr every tube. Mark each with its ID. The axle posts, rear posts and pillars have angled ends; see build-guide.md.
3. The shop tacks the base ladder flat: two side rails, ${d.stations.length} cross members. Check the diagonals, then weld.
4. Axle posts at X = 0, rear posts, front pillars${d.swivel ? ', nose posts and caster beams' : ', fork arms and stubs'}. Tack, check both axle posts are square and in line, then weld.
5. Top rails and three top cross tubes. Handle arms on the outside of the rear and axle posts at Z = ${s.handle}, grip tube between the arm ends. Brake arms on the axle posts.
6. Drill for the hangers, the brake plates${d.swivel ? ', the caster' : ''} and the tip-stops after welding, from drilling.csv.
${d.sprung ? `7. Swing arms on their pivot bolts outside the base rails, shocks between the tabs, axle sleeves through the arms.${d.swivel ? ` Bolt the caster under the beams; its swivel axis sits ${mm(d.casterX - d.frontX - h.tube)} ahead of the cabin front.` : ' Paired hangers on each fork stub.'}` : `7. Paired hangers on each axle post${d.swivel ? '' : ' and fork stub'}. Fit the 19.05 axle sleeve through post and both hangers.${d.swivel ? ` Bolt the caster under the beams; its swivel axis sits ${mm(d.casterX - d.frontX - h.tube)} ahead of the cabin front.` : ''}`}
8. Floor panel on bedding tape, fastened to the frame.
9. Ramp: panel, two curb rails on top, two ribs underneath at 40 mm and mid length, stand legs welded to the hinge-end rib 60 mm in from each edge. Hinge leaves on the top faces of floor and ramp.
10. Wheels, washers and cotters. Rear stack between outer washer faces ${d.rearStack}${d.swivel ? '' : `, front ${d.frontStack}`}, with 0.5 total end float.
11. Tip-stop feet, the brake plates and clamps, latches, safety strap. Then the cover.`
  return `# Buddy Rover r0 bench assembly

Configuration ${roverCode(s)}. All dimensions mm. BENCH DESIGN. NOT FOR ANIMAL USE. No payload, speed, distance, slope or surface rating exists. Buddy is owner-reported 140 lb; his measurements and suitability for a carrier are not established.

## What this revision is

A large cut-to-fit carrier built from 1 inch square aluminum tube, 1/8 inch wall 6061-T6 for the chassis and 1/16 inch wall 6063-T52 for the cabin, three repeated flat metal profiles, plywood panels and printed service parts. The tailgate is the ramp: it folds down to a ${d.rampAngle.toFixed(1)} degree walk-in with no step, and stands on its own two feet so the dog's weight on the threshold goes to the ground instead of tipping the carrier. ${d.swivel ? `Two ${d.wheel.label} wheels at the rear and a 10 inch swivel caster on a raised nose at the front, so it steers by pushing the handle sideways.` : `Three matching wheels, here the ${d.wheel.label} wheel. Push handle with a fixed front wheel.`}

Coordinates: X forward, Y across, Z up. Origin on the ground under the rear axle.

## Your configuration

| Item | Value |
| --- | ---: |
| Clear cabin length at the floor | ${s.length} (${inch(s.length)} in) |
| Front rake, top set back from bottom | ${s.rake} |
| Clear cabin width between side rails | ${s.width} (${inch(s.width)} in) |
| Clear cabin height, deck to top rail | ${s.height} (${inch(s.height)} in) |
| Deck height above ground | ${d.deck} (${inch(d.deck)} in) |
| Ramp length and width | ${s.ramp} x ${d.rampWidth} |
| Ramp rise and incline | ${d.rampRise} rise, ${d.rampAngle.toFixed(1)} degrees |
| Rear axle ahead of the tailgate plane | ${s.axle} |
| Front wheel | ${d.swivel ? `swivel caster, mounting height ${s.caster}` : 'fixed, on a fork'} |
| Kit | ${d.ski ? 'snow conversion: skis on the rear axles and two tow shafts' : 'on wheels'} |
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

${d.welded ? weldedText : boltedText}

## The ramp

Lowered, the panel runs from the deck at ${d.deck} down to the ground over ${s.ramp}. The two capped stand legs under the hinge end touch the ground directly below the threshold, so the hinge carries no bending on level ground. The walking width between the curb rails is ${d.rampWidth - 2 * h.tube}. Three printed toes slide onto the ground edge and take the last 20 mm down to nothing.

Raised, the ramp is the tailgate. Two draw latches hold it to the rear posts and the safety strap is a second, independent hold. The stand legs then point backward about ${Math.round(d.legCut + h.foot)} mm at shin height. The handle reaches ${h.reach} mm behind the tailgate. Stride clearance has to be checked by a runner before this layout is accepted.

${d.sprung ? `The rear axles sit in the swing arms outside the frame, so nothing stands into the cabin at the axle. The carrier is ${d.overallWidth} wide over the axle ends.` : `Each rear axle end stands ${d.cabinIntrusion} mm into the cabin, about ${Math.round(d.R - d.deck)} mm above the deck. Cover it and review it for fur, paws and hips.`}${suspensionText}${seatText}

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
    box(d.rearX - t, d.railZ - t / 2, d.rail, t), s.taper > 0 ? `<path d="M${X(d.rearX - t)} ${Z(d.topZ)}L${X(d.rearX - t + d.topRail)} ${Z(d.topZ - s.taper)}" stroke="#6d7a72" stroke-width="${(t * k).toFixed(1)}"/>` : box(d.rearX - t, d.topZ - t / 2, d.topRail, t),
    ...(d.welded ? [box(d.rearX - t, d.railZ + t / 2, t, d.post), box(-t / 2, d.railZ + t / 2, t, d.axlePost)] : [d.rearX - t, -t / 2, d.frontPostX - t / 2].map(x => box(x, d.railZ + t / 2, t, d.post))),
    ...(s.rake > 0 ? [`<path d="M${X(d.frontX + t / 2)} ${Z(d.railZ)}L${X(d.frontPostX)} ${Z(d.topZ - s.taper)}" stroke="${d.welded ? '#6d7a72' : '#254b38'}" stroke-width="${d.welded ? (t * k).toFixed(1) : 2}"/>`] : []),
    ...(d.swivel ? [-1, 1].flatMap(end => [box(d.casterX + end * h.casterAlong / 2 - t / 2, d.railZ + t / 2, t, d.nosePost), box(d.casterX + end * h.casterAlong / 2 - t / 2, s.caster, t, t, '#8f9a93')]) : [box(d.frontX + t, d.railZ - t / 2, d.forkArm, t), box(d.wheelbase - t / 2, d.railZ + t / 2, t, d.stub)]),
    box(d.rearX - t, d.deck - h.panel, d.floorLen, h.panel, '#c9a36a'),
    box(d.gripX, s.handle - t / 2, d.handleArm, t, '#dfe6e1'),
    `<path d="M${X(d.rearX - t)} ${Z(d.topZ + t / 2 + h.ridge + h.pole / 2)}L${X(d.rearX - t + d.topRail)} ${Z(d.topZ - s.taper + t / 2 + h.ridge + h.pole / 2)}" stroke="#254b38" stroke-width="2"/>`,
    `<path d="M${X(d.hingeX)} ${Z(d.deck)}L${X(toeX)} ${Z(h.panel)}" stroke="#c9a36a" stroke-width="${(h.panel * k + 1).toFixed(1)}"/>`,
    `<path d="M${X(d.hingeX)} ${Z(d.deck)}V${Z(d.deck + s.ramp)}" stroke="#c9a36a" stroke-width="1.2" stroke-dasharray="5 4"/>`,
    `<path d="M${X(d.hingeX - 40)} ${Z(d.deck - 30)}L${X(d.hingeX - 40 - 20)} ${Z(0)}" stroke="#536358" stroke-width="3"/>`,
    dim(d.rearX, d.frontX, d.deck + s.height / 2, `clear length ${s.length}`),
    dim(toeX, d.hingeX, -45, `ramp ${s.ramp}, ${d.rampAngle.toFixed(1)} degrees`), dim(0, d.wheelbase, -45, `wheelbase ${d.wheelbase}`),
    dim(d.gripX, d.gripX + d.overallLength, top - 12, `overall ${d.overallLength}`),
    label(d.frontX + t + 12, Z(d.deck + s.height / 2), `clear height ${s.height}${s.rake > 0 ? `, front raked ${s.rake}` : ''}${s.taper > 0 ? `, roof falls ${s.taper}` : ''}`, 'start'), label(d.frontX + t + 12, Z(d.deck + 6), `deck ${d.deck}`, 'start'),
    label(d.gripX, (Number(Z(s.handle)) - 8).toFixed(1), `handle ${s.handle}`, 'start'), label(d.hingeX + 6, (Number(Z(d.deck + s.ramp)) - 4).toFixed(1), 'raised as tailgate', 'end'),
  ]
  const outer = s.width / 2 + t; const rampY = d.rampWidth / 2
  const topView = [
    plan(d.rearX - t, -outer, d.floorLen, 2 * outer, '#c9a36a'),
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

/** Top view of the base frame alone, with member IDs, cut lengths and every station measured from the rear end of a rail. */
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
  post(d.rearX - t / 2, 'C09', '#6d7a72'); post(0, 'C03 axle', '#254b38'); post(d.frontX + t / 2, d.welded ? 'C21 foot' : 'C09', '#6d7a72')
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
  body.push(text(pad, H - 14, d.welded ? 'Every joint here is welded all round. Axle hangers bolt to both side faces at the axle post. Welds are in weld-schedule.csv, holes in drilling.csv.' : 'Corner gussets go under each corner, tee gussets under each C14, axle hangers on both side faces at the axle post. Hole centers are in drilling.csv.', 10, 'start'))
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W.toFixed(0)} ${H.toFixed(0)}" width="${(W * 1.6).toFixed(0)}" height="${(H * 1.6).toFixed(0)}" font-family="Arial, sans-serif"><rect width="100%" height="100%" fill="#fff"/>${text(pad, 26, `Buddy Rover r0 base frame plan, seen from above, mm`, 14, 'start')}${text(pad, 42, 'Bench design, not for animal use. Solid squares are posts standing on the rails. Dashed outlines are parts above or beside the base.', 9, 'start')}${body.join('')}</svg>\n`
}

export function roverCostMarkdown(s: RoverSetup): string {
  const batch = roverEconomics(s, 100); const one = roverEconomics(s, 1); const lines = roverCostLines(s); const textiles = roverTextileCost(s, 100); const oneTextiles = roverTextileCost(s, 1); const dims = roverDimensions(s)
  const welded = s.build === 'welded'
  // Like for like: the same carrier with only the joints changed.
  const weldedSetup: RoverSetup = { ...s, build: 'welded' }; const boltedSetup: RoverSetup = { ...s, build: 'bolted' }
  const weldedBatch = roverEconomics(weldedSetup, 100); const boltedBatch = roverEconomics(boltedSetup, 100); const weldedOne = roverEconomics(weldedSetup, 1); const boltedOne = roverEconomics(boltedSetup, 1)
  const weldedDims = roverDimensions(weldedSetup); const boltedDims = roverDimensions(boltedSetup)
  const lineBatch = (setup: RoverSetup, id: string) => roverCostLines(setup).find(l => l.id === id)?.batch ?? 0
  return `# Buddy Rover r0 cost study

Checked ${roverPriceDate}, USD, integer cents, native Bun arithmetic. Configuration ${roverCode(s)}. This prices the r0 bench architecture. It is not a supplier quote, a production cost or a selling price, and nothing has been bought.

## Result

At 100 carriers the modeled landed manufacturing cost is **${money(batch.cogs)} each** at listed prices. A single build at retail quantities is **${money(one.cogs)}**. The first count of this design, on November 11, was $2,037.93 and $3,254.89, with 20 inch wheels, the original cover and most prices as allowances.

The owner set the Run price to ${money(batch.retail)} on November 12, 2026. ${batch.gross < 0 ? `At the counted cost that is ${money(-batch.gross)} below cost on every carrier, before card fees, returns, support or freight.` : `That leaves ${money(batch.gross)} of gross profit per carrier.`} A 30% gross margin at that price needs the cost at ${money(batch.maxCogs)} or less, so ${batch.meetsCostGate ? 'the design meets it' : `${money(-batch.headroom)} has to come out`}. At today's cost the price that would carry a 30% margin is about ${money(batch.retailForGate)}.

If the tube is bought by weight, it drops again. ${money(batch.tube)} of the total is ${dims.tubeLb} lb of aluminum tube priced as 21 ft and 24 ft stock bars at $3.13 and $4.84 per foot. A 100-carrier batch is about ${(dims.tubeLb * 100 / 2000).toFixed(1)} tons of two extrusions and would be bought from a mill or distributor. At an assumed $4.00 per pound with 8% scrap the tube line falls to ${money(batch.tubeMill)} and the total to **${money(batch.cogsMill)}**, which a price near ${money(batch.retailForGateMill)} would carry. That rate is an assumption with no quote behind it.

For scale, the reference trailer sold for ${money(roverPriceEvidence[9].price)} at one retailer on the check date, with a 100 lb stated capacity and a 36.2 x 22.4 x 29.9 inch interior. Rover's cabin is about twice that volume. Rover does not reach that price in either scenario.

## Welded against bolted

The same carrier can be built two ways: the same tubes, the same shape and the same running gear, with only the joints changed. Both are counted with the same rules.

| | Welded | Bolted |
| --- | ---: | ---: |
| Counted cost each, at 100 | ${money(weldedBatch.cogs)} | ${money(boltedBatch.cogs)} |
| Counted cost of one | ${money(weldedOne.cogs)} | ${money(boltedOne.cogs)} |
| Welded joints | ${weldedDims.counts.weldJoints} | 0 |
| Bolted joints | ${weldedDims.counts.bolts} | ${boltedDims.counts.bolts + boltedDims.counts.handleBolts} |
| Plates to cut | ${weldedDims.counts.hanger + 2 + weldedDims.counts.shockPlates + weldedDims.counts.shockHangers} | ${boltedDims.counts.corner + boltedDims.counts.angle + boltedDims.counts.tee + boltedDims.counts.hanger + 2 + boltedDims.counts.shockPlates + boltedDims.counts.shockHangers} |
| Planning mass, kg | ${weldedDims.carrierKg} | ${boltedDims.carrierKg} |
| Ships | Assembled, by truck | Flat, in cartons |
| Who can build it | A shop with a TIG welder | One person at home with a saw and a drill, plates by mail order |

Welding in a United States shop does not make the carrier cheaper. It trades about ${money(['gussets', 'fasteners', 'labor'].reduce((n, id) => n + lineBatch(boltedSetup, id) - lineBatch(weldedSetup, id), 0))} of plates, bolts, sleeves and drilling time for ${money(lineBatch(weldedSetup, 'welding'))} of welding and ${money(lineBatch(weldedSetup, 'pack') - lineBatch(boltedSetup, 'pack'))} more packaging, and for one carrier the shop's time costs more than the drilling it replaces. What welding buys is about ${(boltedDims.carrierKg - weldedDims.carrierKg).toFixed(1)} kg less mass, a cleaner look with no plates, and joints with no bolt clearance to work loose. What bolting buys is that nothing leaves the house except the plate order. The welding figure is arithmetic on an assumed shop rate; no fabricator has quoted it. Outbound freight for an assembled frame is not in either column.

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

## How others sell near $800, and what it would take here

This section is reasoning from general practice in consumer goods. None of its numbers is a quote or something read on a supplier page, and each is marked as an estimate.

A trailer that retails near $730 is typically built for a small fraction of that. The retailer and the brand each take a margin, so a common rule of thumb puts factory cost at a quarter to a third of the shelf price. Makers reach that with:

- **Volume and a contract factory.** Thousands of units a run, made where assembly labor costs a few dollars an hour, shipped flat in containers.
- **A frame that is bent and welded on jigs.** A handful of tubes, bent once and welded, with almost no fasteners. ${welded ? `This frame is welded too, but by hand from ${dims.cuts.reduce((n, x) => n + x.qty, 0)} straight pieces, one joint at a time: ${dims.counts.weldJoints} joints, no bends and no tooling.` : `This design has about ${dims.counts.bolts + dims.counts.handleBolts} bolted joints and ${dims.counts.corner + dims.counts.tee + 2} plates.`}
- **Fabric as the body.** The cabin walls and often the floor are sewn fabric hung on that frame, sewn at the same low labor rate from fabric bought by the roll.
- **Tooling spread over many units.** Molded hubs, joints and wheels cost cents each once the mold is paid for.
- **Material bought by the ton.** Aluminum extrusion at mill prices by weight, not cut bars at $3 to $5 a foot.

Rover r0 is the opposite on every point: one-off architecture, retail material prices, United States labor rates and a rigid box cabin twice the size.

What each lever would do to the ${money(batch.cogs)} counted cost, as estimates:

| Lever | Estimated effect | What it needs |
| --- | ---: | --- |
| Tube bought by weight from a mill or distributor | about -${money(batch.tube - batch.tubeMill)} | A quote. The study assumes $4.00 per pound |
| Have the cover cut and sewn by a contract shop from roll goods | about -$135 | A sewing quote on a sample |
| Front caster without a swivel lock, from its maker at $41.38 | -$23.31 | Accepting walking pace only |
| 13 inch wheels at $14.99 | -$35.80 | Accepting a rougher roll |
| **All of the above** | **about ${money(batch.cogs - (batch.tube - batch.tubeMill) - 13500 - 2331 - 3580)}** | |

That is about the ${money(batch.retail)} price with no margin left. Getting to ${money(batch.maxCogs)}, a 30% margin, takes about another ${money(batch.cogs - (batch.tube - batch.tubeMill) - 13500 - 2331 - 3580 - batch.maxCogs)} out. On this architecture there is no obvious place to find it. The realistic route is the one the cheaper products take: a bent and welded folding frame with fabric sides, made by a contract factory, keeping the two things that make Rover different, the size and the walk-in ramp. That is a new design and needs factory quotes, not a revision of this one.

## What would bring it down further

1. A tube quote. See the mill-quantity paragraph above.
${welded ? `2. Welding. ${roverCostLines(s).find(l => l.id === 'welding')!.name}, modeled at ${money(roverCostLines(s).find(l => l.id === 'welding')!.batch)} on an assumed shop rate. A fabricator's quote on the drawings replaces that guess, in either direction.` : `2. Joints. ${roverCostLines(s).find(l => l.id === 'fasteners')!.name} and the labor to drill for them come to about ${money(roverCostLines(s).find(l => l.id === 'fasteners')!.batch + roverCostLines(s).find(l => l.id === 'labor')!.batch)}. Welded or riveted sub-frames, or purpose-made corner fittings, remove most of both and several kilograms. That needs a fabricator's quote.`}
3. Plates. ${roverCostLines(s).find(l => l.id === 'gussets')!.name}${dims.counts.hanger ? ' and the hangers' : ''} are an allowance, about ${money(roverCostLines(s).find(l => l.id === 'gussets')!.batch + (roverCostLines(s).find(l => l.id === 'hangers')?.batch ?? 0))}. Uploading the DXF files to a cutting service turns that into a real number in minutes.
4. The cover is now ${money(batch.textiles.total)}. The ramp surface, floor pad and mesh are the largest material lines left; sewing is ${money(batch.textiles.labor)}.

Selling-cost lines at the current price, per carrier at 100: payment fee ${money(batch.fee)}, returns reserve ${money(batch.reserve)}, support ${money(batch.support)}, acquisition ${money(batch.acquisition)}. Contribution before fixed overhead: ${money(batch.contribution)}.

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
  add('C01', 'Base side rail', 2, 'side', 'rear end', [axlePost - 30, axlePost + 30], d.sprung ? 'Axle post tee gussets, both faces' : 'Axle hanger bar')
  const foot = fromRear(d.pillarFoot[0]); const cosRoof = Math.cos(d.roofAngle * Math.PI / 180)
  add('C01', 'Base side rail', 2, 'side', 'rear end', [frontCorner - 65, frontCorner - 35], `Pillar foot gusset. The pillar centerline meets the rail at ${Math.round(foot)}`)
  add('C01', 'Base side rail', 2, 'vertical', 'rear end', [frontCorner - 80, frontCorner - 50], 'Front cross member gusset, underneath')
  if (d.swivel) {
    const rearPost = fromRear(d.casterX - h.casterAlong / 2); const frontPost = fromRear(d.casterX + h.casterAlong / 2)
    add('C01', 'Base side rail', 2, 'side', 'rear end', [rearPost - 65, rearPost - 35, frontPost + 35, frontPost + 65], `Nose post gussets. Posts stand at ${mm(rearPost)} and ${mm(frontPost)}`)
  }
  add('C02', 'Base end cross member', 2, 'vertical', 'each end', [35 - half, 65 - half], 'Corner gusset, underneath')
  if (!d.swivel) add('C02', 'Base end cross member, front one only', 1, 'vertical', 'the middle', [-d.forkY - 30, -d.forkY + 30, d.forkY - 30, d.forkY + 30], 'Fork arm tee gussets, top and bottom')
  add('C14', 'Base intermediate cross member', d.intermediates, 'vertical', 'each end', [35 - half, 60 - half], 'Tee gusset stem, underneath')
  // Posts. The bottom of every post sits on a rail, 12.7 above the rail centerline.
  add('C03', 'Axle post', 2, 'side', 'bottom', d.sprung ? [35 - half, 60 - half] : w.posts.map(p => p - half), d.sprung ? 'Tee gusset stems, both faces' : 'Axle hanger stem')
  add('C03', 'Axle post', 2, 'side', 'bottom', [w.rise - half], 'Axle sleeve', '19.25, for the 19.05 axle sleeve')
  add('C03', 'Axle post', 2, 'side', 'bottom', [s.handle - d.railZ - half], 'Handle arm lap bolt')
  add('C03', 'Axle post', 2, 'fore-aft', 'bottom', [d.brakeZ - d.railZ - half + 35, d.brakeZ - d.railZ - half + 65], `Brake arm gussets. The arm centerline is ${mm(d.brakeZ - d.railZ - half)} up the post`)
  add('C03', 'Axle post', 2, 'side', 'top', [35 - half, 65 - half], 'Roof gussets, both faces. Measure down the middle of the face from the angled end')
  add('C17', 'Brake arm', 2, 'fore-aft', 'the end at the post', [50 - half, 80 - half], 'Axle post gussets, front and rear faces')
  add('C09', 'Rear corner post', 2, 'side', 'bottom', [50 - half, 80 - half], 'Base rail gusset, outside face')
  add('C09', 'Rear corner post', 2, 'side', 'top', [50 - half, 80 - half], 'Roof gusset, outside face. Measure down the middle of the face from the angled end')
  add('C21', 'Front pillar', 2, 'side', 'foot', [50 - d.pillarFootBack, 80 - d.pillarFootBack], 'Pillar foot gusset, outside face. Measure up the middle of the face')
  add('C21', 'Front pillar', 2, 'side', 'top', [50 - d.pillarTopBack, 80 - d.pillarTopBack], 'Pillar top gusset, outside face. Measure down the middle of the face')
  add('C09', 'Rear corner post', 2, 'side', 'bottom', [s.handle - d.railZ - half], 'Handle arm lap bolt')
  // Top frame.
  const topAxle = fromRear(0)
  add('C10', 'Top side rail', 2, 'side', 'rear end', [half + 35, half + 65], 'Roof gusset at the rear post')
  add('C10', 'Top side rail', 2, 'side', 'front end', [half + 35, half + 65], 'Pillar top gusset')
  add('C10', 'Top side rail', 2, 'vertical', 'each end', [half + 50, half + 80], 'Top cross tube gusset, on top')
  add('C10', 'Top side rail', 2, 'side', 'rear end', [topAxle / cosRoof + 50, topAxle / cosRoof + 80], 'Roof gussets at the axle post, both faces')
  add('C10', 'Top side rail', 2, 'vertical', 'rear end', [topAxle / cosRoof - 30, topAxle / cosRoof + 30], 'Roof bow tee gusset, on top')
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
  if (d.ski) {
    add('C18', 'Ski post', 2, 'side', 'bottom', [35 - half, 60 - half], 'Tee gusset stem, both faces')
    add('C18', 'Ski post', 2, 'side', 'bottom', [d.skiPost - h.skiAbove], 'Axle sleeve. The post swings on the rear axle', '19.25, for the 19.05 axle sleeve')
    add('C19', 'Ski foot', 2, 'side', 'the middle', [-30, 30], 'Tee gusset bar, both faces')
    add('C19', 'Ski foot', 2, 'vertical', 'the middle', [-150, 150], 'Ski bolts', '6.75, no sleeve')
    add('C20', 'Tow shaft', 2, 'side', 'the end at the carrier', [30], 'Tow pin', '10.0, for a 3/8 inch pin')
    add(d.swivel ? 'C01' : 'C04', d.swivel ? 'Base side rail' : 'Fork arm', 2, 'side', d.swivel ? 'rear end' : 'the end at the cabin', [d.swivel ? fromRear(d.towPinX) : d.towPinX - d.frontX - t], 'Tow pin', '10.0, for a 3/8 inch pin')
  }
  // Ramp.
  const curbStep = s.ramp / (Math.floor(s.ramp / 200) + 1)
  add('C06', 'Ramp side curb rail', 2, 'vertical', 'hinge end', Array.from({ length: Math.floor(s.ramp / 200) + 1 }, (_, i) => curbStep * (i + 0.5)), 'Carriage bolts down through the curb and the ramp panel', '6.75, no sleeve')
  add('C07', 'Ramp under rib', 2, 'vertical', 'each end', [80], 'Carriage bolt up through the panel; add one at the middle', '6.75, no sleeve')
  add('C07', 'Ramp under rib, hinge-end one only', 1, 'along the ramp', 'each end', [60 + 50, 60 + 80], 'Stand leg gussets, both faces. Legs stand 60 from each end')
  add('C08', 'Ramp stand leg', 2, 'along the ramp', 'top', [35 - half, 65 - half], 'Rib gussets, both faces')
  if (d.sprung) {
    add('C01', 'Base side rail', 2, 'side', 'rear end', [fromRear(h.swingRun)], 'Swing arm pivot bolt', '16.1, for a 5/8 inch OD crush sleeve on the 1/2 inch bolt')
    add('C22', 'Swing arm', 2, 'side', 'pivot end', [h.swingEnd], 'Pivot bushings, one pressed into each wall', '15.9 (5/8 inch)')
    add('C22', 'Swing arm', 2, 'side', 'pivot end', [mm(h.swingEnd + d.swingLen)], 'Axle sleeve', '19.25, for the 19.05 axle sleeve')
    add('C22', 'Swing arm', 2, 'side', 'pivot end', [h.swingEnd + h.shockAt - h.plateStep / 2, h.swingEnd + h.shockAt + h.plateStep / 2], 'Shock plate bolts, a plate on each side face')
    const hangerUp = d.shockUpZ + h.hangerUp - d.railZ - half
    add('C03', 'Axle post', 2, 'side', 'bottom', [hangerUp, hangerUp + h.plateStep], 'Shock hanger bolts')
    add('C23', 'Shock spacer tube', 2, 'side', 'either end', [(h.shockSpacer - h.plateStep) / 2, (h.shockSpacer + h.plateStep) / 2], 'Shock hanger bolts')
  }
  // Sprung: the rear axle is in the swing arm, so the rail and post lose their hanger and axle holes.
  const kept = d.sprung ? rows.filter(r => !(r.id === 'C03' && r.purpose === 'Axle sleeve')) : rows
  if (!d.welded) return kept
  // Welded build: every gusset and lap-bolt hole goes. The brake arm keeps its two holes for the clamp plate.
  return kept.filter(r => r.id === 'C17' || !/gusset|lap bolt/i.test(r.purpose)).map(r => r.id === 'C17' ? { ...r, purpose: 'Brake clamp plate bolts, plate on the front face' } : r)
}
/** Every welded joint with its count. Empty for the bolted build. */
export function roverWeldCsv(s: RoverSetup): string {
  return csv([['Weld ID', 'Quantity', 'Joint', 'How'], ...roverDimensions(s).welds.map(w => [w.id, w.qty, w.joint, w.type])])
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
  const tubes = roverTubes(s)
  const stepList = (steps: string[]) => steps.map((step, i) => `${i + 1}. ${step}`).join('\n')
  const rodMm = Math.ceil(2 * d.rearShaft + (d.swivel ? 0 : d.frontShaft) + 12)
  const bars = (list: typeof heavyBars) => list.map((b, i) => `| ${i + 1} | ${b.pieces.map(p => `${p.id} ${p.length}`).join(', ')} | ${b.offcut} |`).join('\n')
  const boltedShape = `## 1. How the aluminum base gets its shape

Nothing is bent, cast or welded. The base is a flat ladder: two long side rails with ${d.stations.length} cross members between them. Every piece is a straight length of 1 inch square tube. The pieces are held together by flat plates called gussets that lie across each joint and are bolted through the tubes. A steel sleeve inside the tube at every bolt stops the bolt from crushing it. The cabin stands on that base: two rear posts, two axle posts and two front pillars that lean back ${s.rake}, under a roof frame that falls ${s.taper} from rear to front. Three of the plates are cut to those angles for this setup, and six tubes have an angled end. See base-plan.svg for the view from above and drawing.svg for the side.

So there are only three things to obtain: straight tube cut to length, flat plates cut to a drawn outline, and bolts. You have four ways to get the tube cut:

1. **Cut it yourself.** Buy stock bars and cut them with a miter saw fitted with a blade for non-ferrous metal, or with a hacksaw and a miter box. This is the cheapest route and the one priced here.
2. **Have the supplier cut it.** Online Metals says every order is cut to size, and Metals Depot offers a cut to size option. Order each line of cut-list.csv as its own cut length. You pay more per foot and receive a box of finished pieces. Their cut tolerance is looser than yours can be, so check every piece against the list when it arrives.
3. **Hand the package to a local shop.** A metal supplier with a saw, a fabrication shop or a makerspace can cut and drill the whole frame. Give them cut-list.csv, drilling.csv, base-plan.svg, drawing.svg and the DXF files. If they offer to weld it instead, choose the welded frame in the studio and download that kit: it is the same frame with a weld schedule in place of the plates.
4. **Have a tube laser cut and drill every tube.** The kit has a tubes folder with one 3D file for each different tube: ${tubes.length} files for ${tubes.reduce((n, x) => n + x.qty, 0)} pieces, with ${tubes.reduce((n, x) => n + x.qty * x.holes, 0)} holes already in them. tube-order.csv lists the quantity and the material to choose for each file. Upload them at [${roverTubeService.name}](${roverTubeService.url}), which lists both of these tubes, cuts angled ends and shows a price as you upload. The tubes then arrive cut to length and drilled, and sections 6 and 7 shrink to a few holes. Two cautions. No price is known, because nothing was uploaded for this study. And the files are generated by this app: they pass its own solid checks, but they have not been opened in a CAD program or accepted by any service. Upload one file first. If it is refused, cut and drill by hand from cut-list.csv and drilling.csv, which describe the same tubes.

The plates are cut by a laser-cutting service from the DXF files in the kit. You do not make those by hand.

`
  const weldedShape = d.welded ? `## 1. How the aluminum frame gets its shape

The frame is welded by a fabrication shop into one rigid piece. The base is a flat ladder: two long side rails with ${d.stations.length} cross members between them. Two rear posts, two axle posts and two front pillars stand on it and carry a roof frame that falls ${s.taper} from rear to front. Each pillar leans back ${s.rake}, which gives the raked nose. No plates hold it together. See base-plan.svg for the view from above and drawing.svg for the side.

Every piece is still a straight length of 1 inch square tube. Nothing is bent. Six pieces have an angled end, listed in section 6, and the rest are cut square.

Welding thin aluminum tube is TIG work and not a first welding project. Unless you already weld aluminum, a shop does it. There are two ways to use one:

1. **The shop does everything.** Send them cut-list.csv, weld-schedule.csv, drilling.csv, base-plan.svg and drawing.svg, and ask for a price to supply the tube, cut it, weld it and drill it. Search for "aluminum TIG welding" or "custom metal fabrication" near you, or ask at the counter of a metal supplier who they send people to. A bicycle frame builder, a marine or race-car fabricator, a community college welding program or a makerspace with a TIG welder are all worth a call for a single frame. Ask three.
2. **You cut, the shop welds.** Buy the bars, cut and label every piece as in section 6, and bring the shop a box of labelled tube with the same drawings. That saves their saw time and lets you check every length first. Ask before you cut whether they would rather cut the angled ends themselves.

The cost study puts the welding of one frame at about ${money(roverCostLines(s).find(l => l.id === 'welding')!.one)}. That is arithmetic on an assumed shop rate, and no shop has seen the drawings.

What to tell the shop:

- Material. Chassis pieces are 1 x 1 x 1/8 inch 6061-T6. Cabin pieces are 1 x 1 x 1/16 inch 6063-T52. The cut list says which is which. The 1/16 wall is thin to weld; if they ask for 1/8 wall throughout, that works and adds about ${(d.lightM * 0.354).toFixed(1)} kg.
- Filler is their choice, normally 4043 or 5356. If the frame will be anodized, say so first, because the filler decides whether the welds show dark afterwards.
- Tolerances that matter: base diagonals equal within 2 mm, the frame flat on a flat table, and the two axle posts square to the base and directly opposite each other. The wheels hang from those posts.
- Tack the whole frame, check it, then weld in short runs on alternating sides so the heat does not pull it out of square.
- A tube that ends up closed at both ends needs a small vent hole before the last weld. Ask them to put vents on the underside.
- Do not grind the welds flush.

Welding softens the aluminum beside each weld. Nothing in this design has been calculated or tested, welded or bolted, so nothing here allows for that loss. That is one reason the release gates at the end ask for an engineer before any load.

` : ''
  const axleStep = `Slide each rear axle through its sleeve from inside. From the inside out the order is cotter, washer, ${d.sprung ? 'swing arm' : 'inner hanger, post, outer hanger'}, spacer, wheel, washer, cotter. The stack between washer faces should be ${d.rearStack} with about 0.5 of end float. Spin the wheel. It must not rub the ${d.sprung ? 'arm' : 'hanger'}.`
  // The suspension bolts on, so these steps are the same for the welded and the bolted frame.
  const sprungSteps = [
    `Drill the swing arms, the pivot holes in the base rails and the hanger holes in the axle posts from drilling.csv. Press a flanged bronze bushing into each wall of each arm at the pivot end, flanges outside, and fit a 3/4 inch axle sleeve through the other end.`,
    `Bolt a shock plate to each side face of each arm with two bolts through the arm, a sleeve in each hole. The ears with the large hole stand above the arm.`,
    `Hang each arm outside its base rail with the plates on top and the axle end to the rear. From inside: 1/2 inch bolt, washer, the rail with its crush sleeve, the ${h.swingGap} spacer, the arm, washer, lock nut. Tighten until the arm swings freely with no side play, and no tighter.`,
    `Hang two shock hangers from each axle post, ears down. From outside, each 3-1/2 inch bolt passes through the outer hanger, the C23 spacer tube, the inner hanger, a ${(h.swingGap - h.plate).toFixed(1)} spacer, then the post, with a washer and lock nut inside the cabin. The spacer tube stands upright between the two hangers.`,
    `Bolt a shock between the plates on the arm and the hangers on the post with M8 bolts and lock nuts. If an eye is narrower than the gap, pack it with washers equally on both sides.`,
    axleStep,
    `Stand the frame on its wheels. Empty, it should settle about ${d.sagEmpty}. With the dog's weight in sandbags it should settle about ${d.sag}, out of about ${d.wheelTravel} of wheel travel. Those numbers take the seller's ${h.shockRate} lbs spring label at face value. If it sits much lower, or tops out with no settle at all, the spring is wrong for this load. The same shock is sold with softer and stiffer springs: change the spring, not the geometry.`,
    `Push down on each rear corner and let go. It should rise once and stop. Rock the top of each wheel in and out by hand: any movement you can see is play at the pivot, and that needs fixing before a load goes in.`,
  ]
  const casterSteps = [
    `The maker lists the caster plate as 4 x 4-1/2 inch with slotted holes, and the drilling schedule puts two holes in each beam, ${h.casterAcross} apart, to land in those slots. Hold the delivered caster up under the beams on the centerline to confirm before drilling 7/16 inch through each beam with a sleeve. Bolt it on with a washer over each slot.`,
    `Roll the frame. It should steer by pushing the handle end sideways and the caster should swing a full circle without touching the cabin front or the posts. Fit the bolt-on swivel lock as its maker shows and check it holds the wheel straight.`,
  ]
  const boltedBase = [
    `Lay the two C01 rails parallel, ${mm(2 * d.postY)} apart center to center, rear ends level.`,
    `Set the two C02 end cross members between them, one at the rear end and one with its center ${mm(d.stations.at(-1)! - d.rearX + t)} from the rear end. Slide a corner gusset under each of the four corners, long-hole leg along the rail. Drop bolts down through tube, sleeve and plate with a washer under the head; add washer and lock nut underneath. Leave them finger tight.`,
    `Set the ${d.intermediates} C14 cross members at ${d.stations.slice(1, -1).map(x => mm(x - d.rearX + t)).join(', ')} from the rear end, each with a tee gusset under each end, the stem along the cross member.`,
    `Measure both diagonals of the rectangle. Tap the frame until they match within 2 mm. Then tighten every bolt until the lock nut is fully engaged and the plate is clamped. Do not crush the tube; the sleeves set the limit. No torque figure is given because none has been validated.`,
    d.sprung
      ? `Stand each C03 axle post on a rail at ${mm(t + s.axle)} from the rear end, angled end up with its long side to the rear. Put a tee gusset on each side face, bar along the rail, stem up the post, and bolt through.`
      : `Stand each C03 axle post on a rail at ${mm(t + s.axle)} from the rear end, angled end up with its long side to the rear, a hanger on each side face, bar along the rail, stem up the post. Bolt the bar to the rail and the stem to the post. Fit the 3/4 inch axle sleeve through hanger, post and hanger.`,
  ]
  const boltedWheels = [
    ...(d.sprung ? sprungSteps : [axleStep]),
    ...(d.swivel ? [
      `Stand the four C15 nose posts on the rail extensions at ${mm(d.casterX - h.casterAlong / 2 - d.rearX + t)} and ${mm(d.casterX + h.casterAlong / 2 - d.rearX + t)} from the rear end. Each gets a corner gusset on both side faces, the rail leg pointing away from the other post.`,
      `Lay the two C16 caster beams across the post tops, ends flush with the outside of the rails. Tie each beam to its two posts with one corner gusset on the outside face.`,
      ...casterSteps,
    ] : [
      `Butt the two C04 fork arms against the front cross member at ${d.forkY} each side of center, a tee gusset above and below each.`,
      `Stand a C05 stub post on each arm at the front axle with a hanger on both faces, fit the axle sleeves, and mount the front wheel on its through axle.`,
    ]),
  ]
  const boltedCabin = [
    `Stand a C09 rear post on the rear end of each rail, angled end up with its long side to the rear, and bolt a corner gusset to the outside face, long-hole leg up the post.`,
    `Stand each C21 front pillar with its foot on the rail so that the front of its foot is level with the front of the front cross member, ${mm(d.frontX + t - d.rearX + t)} from the rear end, leaning back. Bolt a pillar foot gusset to the outside face, long-hole leg up the pillar. It will not stand on its own yet; prop it or have someone hold it.`,
    `Lay each C10 top rail on the rear post, the axle post and the pillar top, rear end level with the back of the rear post. It falls ${s.taper} from rear to front. Bolt a roof gusset to the outside face at the rear post, one to each side face at the axle post, and a pillar top gusset to the outside face at the pillar. Leave everything finger tight.`,
    `Fit the three C11 top cross tubes: over the rear posts and at the pillar tops with a corner gusset on top at each end, and over the axle posts with a tee gusset on top. Turn each tube so its top face lies flat with the top of the sloping rail.`,
    `Check that both sides lean the same: measure from the rear top corner to the front bottom corner on each side and match them within 3 mm. Then tighten every bolt.`,
    `Clip the three ridge saddles over the top cross tubes at the centerline and lay the 12.7 mm ridge tube in them. It follows the roof down toward the front.`,
  ]
  const boltedFrame = `## 8. Assemble the base flat

Work on a flat floor or table.

${stepList(boltedBase)}

The base now stands on its own and has the shape in base-plan.svg.

## 9. ${d.sprung ? 'Suspension, wheels' : 'Wheels'}${d.swivel ? ' and nose' : ' and fork'}

${stepList(boltedWheels)}

## 10. Cabin frame

${stepList(boltedCabin)}

`
  const weldSteps = [
    `Base ladder, flat on the welding table. Two C01 rails parallel, ${mm(2 * d.postY)} apart center to center, rear ends level. A C02 end cross member between them at the rear end and one with its center ${mm(d.stations.at(-1)! - d.rearX + t)} from the rear end. The ${d.intermediates} C14 cross members with their centers at ${d.stations.slice(1, -1).map(x => mm(x - d.rearX + t)).join(', ')} from the rear end. Tack every joint, measure both diagonals, and correct until they match within 2 mm. Then weld all round. W01.`,
    `Posts. Each C03 axle post stands on a rail with its center ${mm(t + s.axle)} from the rear end. Each C09 rear post stands on the rear end of a rail. Both have the angled end up, long side to the rear. Tack, then check the two axle posts are square to the base and directly opposite each other before welding. W02 and W06.`,
    `Front pillars. The foot of each C21 pillar sits on a rail with its center ${mm(d.frontX + t / 2 - d.rearX + t)} from the rear end. The pillar leans back so its top is ${s.rake} behind its foot. W04.`,
    `Roof. Lay each C10 top rail on the rear post, the axle post and the pillar top, rear end level with the back of the rear post. It falls ${s.taper} from rear to front. Fit the three C11 cross tubes between the rails: over the rear posts, over the axle posts and at the pillar tops. W03, W05, W07 and W08.`,
    d.swivel ? `Nose. Stand the four C15 nose posts on the rail extensions with their centers ${mm(d.casterX - h.casterAlong / 2 - d.rearX + t)} and ${mm(d.casterX + h.casterAlong / 2 - d.rearX + t)} from the rear end. Lay the two C16 caster beams across the post tops, ends flush with the outside of the rails. W09 and W10.` : `Fork. Butt the two C04 fork arms against the front cross member, ${d.forkY} each side of center. Stand a C05 stub post on each arm, centered ${mm(d.wheelbase - d.frontX - t)} from the cabin end of the arm. W09 and W10.`,
    `Handle. Lay each C12 handle arm against the outside faces of a rear post and an axle post, its centerline ${mm(s.handle - d.railZ + t / 2)} above the underside of the base rail, its front end 40 past the axle post. Fit the C13 grip tube between the rear ends of the arms. W12 and W13.`,
    `Brake arms. Butt a C17 arm against the outside face of each axle post, its centerline ${mm(d.brakeZ - d.railZ - t / 2)} up the post from the post's foot, pointing outward over the tire. W11.`,
    `Ramp legs. Weld the two C08 stand legs square to the hinge-end C07 rib, 60 in from each end of the rib. This is a separate small piece. W14.`,
  ]
  const wheelSteps = [
    ...(d.sprung ? sprungSteps : [
      `Drill the bolt-on holes now, from drilling.csv. Clamp a hanger to each axle post with its bar along the rail and mark through it, so the holes match the plate you actually have.`,
      `Bolt a hanger to each side face of each axle post, bar to the rail, stem to the post, a sleeve in every hole. Fit the 3/4 inch axle sleeve through hanger, post and hanger.`,
      axleStep,
    ]),
    ...(d.swivel ? casterSteps : [`Bolt a hanger to both faces of each C05 stub post, fit the axle sleeves, and mount the front wheel on its through axle.`]),
  ]
  const weldedFrame = `## 8. Weld the frame

This is the shop's work. The order below is what to ask for and what to check. Weld numbers refer to weld-schedule.csv.

${stepList(weldSteps)}

When you collect the frame, check it before you pay:

1. It sits flat on a flat floor without rocking, and the base diagonals match within 2 mm.
2. A square held against each axle post shows it upright both ways. Sighting across the frame, one axle post hides the other.
3. Every joint in weld-schedule.csv is welded all the way round, with no gaps, cracks or pinholes, and none ground flush.
4. The clear width between the base rails is ${s.width} and the handle is where you want it.

These are checks an owner can make. They say the frame is the right shape. They do not say how strong the welds are.

## 9. ${d.sprung ? 'Suspension, wheels' : 'Wheels'}${d.swivel ? ' and caster' : ' and front wheel'}

${stepList(wheelSteps)}

## 10. Ridge and finish

1. Clip the three ridge saddles over the top cross tubes at the centerline and lay the 12.7 mm ridge tube in them. It follows the roof down toward the front.
2. Bare aluminum is fine for a bench build. For a finished carrier, have the frame powder coated or anodized before anything is bolted to it.

`
  return `# Buddy Rover r0 build guide

Configuration ${roverCode(s)}. All dimensions mm unless marked. Read this once to the end before ordering anything.

**What this builds.** A bench carrier for checking fit, handling and the ramp with sandbags. It has no load rating, an untested parking brake, no brake for slowing while moving, and no test behind it. Do not put a dog in it until the release gates at the end are met.

${d.welded ? weldedShape : boltedShape}## 2. Set the size first

1. Measure the dog lying stretched out, sitting, and across the shoulders. Add room to shift position.
2. Open https://buddywheels.org/design-studio-rover, set clear length, width and height, and download the kit. Every cut length, hole position and fabric blank below changes with those three numbers.
3. This guide is for ${s.length} x ${s.width} x ${s.height} clear, a ${s.ramp} ramp at ${d.rampAngle.toFixed(1)} degrees, ${d.wheel.label} wheels${d.swivel ? ' and a swivel front caster' : ''}.

## 3. Order in this sequence

Order the wheel and caster first, because two dimensions in the design come from them.

| Step | What | Where | Quantity | Notes |
| --- | --- | --- | --- | --- |
| A | Rear wheel | ${s.wheel === 'trail' ? '[Zoro Select 1NWV4](https://www.zoro.com/zoro-select-pneumatic-wheel-15-316dia-435lb-400-8-1nwv4/i/G1932594/), $32.89 each' : s.wheel === 'path' ? '[Harbor Freight 67467](https://www.harborfreight.com/13-inch-x-4-inch-pneumatic-tire-67467.html), $14.99 each' : 'Not selected. No suitable 20 inch wheel has been found'} | ${c.wheels} | When they arrive, measure the hub from bearing face to bearing face. If it is not ${s.hub}, enter the real number in the studio and download the kit again before cutting axles |
${d.swivel ? `| A | Front caster | [Service Caster SCC-100S3504-PNB-BSL](https://www.zoro.com/service-caster-10-inch-black-pneumatic-wheel-swivel-caster-with-bolt-swivel-lock-scc-100s3504-pnb-bsl/i/G705434817/), $64.69: 10 inch pneumatic, swivel lock, 350 lb and a 12-3/16 inch mounting height stated | 1 | Measure from the floor to the top of the mounting plate. This guide assumes ${s.caster}. If yours differs, enter it in the studio: it sets the nose post length. A [Harbor Freight 63799](https://www.harborfreight.com/10-in-pneumatic-swivel-caster-63799.html) at $19.99 also fits, with no swivel lock and no stated height |\n` : ''}| A | Parking brake | [POWERTEC 302F push-pull toggle clamp](https://www.zoro.com/powertec-toggle-clamp-300lbs-cap-302f-quick-release-pushpull-clamp-20304n/i/G714915420/), $10.70 each, and a [DE-STA-CO 507208 neoprene-tipped spindle, 5/16-18](https://www.zoro.com/de-sta-co-flat-tip-spindle-516-18-083-3-507208/i/G0295985/), $4.15 each | 2 clamps, 2 spindles | The spindle replaces the plain bolt that comes in the clamp plunger. Eight #10 screws and lock nuts hold the clamps to their plates |
| B | ${d.welded ? 'Hangers and brake plates' : 'Gussets and hangers'} | A laser-cutting service. [OSH Cut](https://app.oshcut.com/cart) shows a price as soon as you drop the files in, with no account. [SendCutSend](https://sendcutsend.com) lists both materials, has no minimum quantity and ships laser parts in 1 to 3 days, and asks you to sign up first | ${d.welded ? '2 x brake_plate.dxf' : `${c.corner} x corner_gusset.dxf, ${d.angles.map(a => `${a.qty} x ${a.file}.dxf`).join(', ')}, ${c.tee} x tee_gusset.dxf, 2 x brake_plate.dxf`}${d.sprung ? `, ${c.shockPlates} x shock_plate.dxf, ${c.shockHangers} x shock_hanger.dxf` : ''}, all in 0.125 inch 6061-T6 aluminum.${d.welded ? '' : ' The roof and pillar gusset files are cut for this setup only.'}${c.hanger ? '' : ' No hangers are needed with the sprung rear and the swivel caster.'} ${c.hanger ? `${c.hanger} x ${d.wheel.hanger}.dxf in 0.125 inch 304 stainless` : ''} | Upload each of those DXF files from the metal folder, pick material and thickness, enter quantities. Add their deburring service or file the edges yourself |
| C | Chassis tube, 1 x 1 x 1/8 inch 6061-T6 | [Metals Depot T3118-6061](https://www.metalsdepot.com/aluminum-products/aluminum-square-tube), 8 ft at $58.08 | ${heavyBars.length} bars | 8 ft is the longest that ships by parcel. Longer bars are cheaper per foot but come by truck |
| C | Cabin tube, 1 x 1 x 1/16 inch 6063-T52 | [Metals Depot T31116](https://www.metalsdepot.com/aluminum-products/aluminum-square-tube), 8 ft at $41.60 | ${lightBars.length} bars | Do not swap this softer tube into the chassis positions |${tubes.length ? `
| C | Or: every tube cut and drilled | [${roverTubeService.name}](${roverTubeService.url}) tube laser, from the files in the tubes folder | ${tubes.length} files, quantities in tube-order.csv | Replaces both tube rows above and most of sections 6 and 7. Unpriced and untried: upload one file first |` : ''}
| D | Bolts, nuts, washers | [Bolt Depot](https://boltdepot.com/Product-Details?product=328): 1/4-20 x 2 inch grade 5 zinc hex bolt 328, lock nut 2624, SAE washer 2976 | ${boxes} box${boxes === 1 ? '' : 'es'} of 100 bolts, ${boxes} of nuts, ${Math.ceil(2 * fasteners / 100)} of washers | You need ${c.bolts} bolts${c.handleBolts ? `, plus ${c.handleBolts} at 3 inch long for the handle` : ''}${d.swivel ? ` and ${c.casterBolts} at 5/16-18 x 2-1/2 inch for the caster` : ''} |
| D | Sleeve tube | [Online Metals DOM steel tube, 3/8 inch OD x .049 wall](https://www.onlinemetals.com/en/buy/carbon-steel/0-375-od-x-0-049-wall-x-0-28-id-carbon-steel-round-tube-a513-type-5-dom/pid/7754), $11.66 per 6 ft | ${Math.ceil(c.sleeves * 26.9 / 1828.8)} lengths of 6 ft | Cut into ${c.sleeves} sleeves, each ${t} long |
| D | Axle parts | [Online Metals DOM tube, 3/4 inch OD x .065 wall](https://www.onlinemetals.com/en/buy/carbon-steel/0-75-od-x-0-065-wall-x-0-62-id-carbon-steel-round-tube-a513-type-5-dom/pid/7765), $4.99 per foot. A 5/8 inch x 3 ft plain steel rod from a hardware store, about $20.57. [Bolt Depot](https://boltdepot.com) 5/8 inch SAE washers at $0.15 and 1/8 x 1-1/2 inch cotter pins at $0.07 | 1 ft of tube, 1 rod, ${d.swivel ? 4 : 8} washers, ${d.swivel ? 4 : 6} cotters | You need ${rodMm} of rod. Never use threaded rod as an axle |
| E | Plywood | [Home Depot 15/32 inch ACX sanded pine](https://www.homedepot.com/b/Lumber-Composites-Plywood/15-32/N-5yc1vZbqm7Z1z0mcqq), $52.00 a sheet | ${d.floorLen + s.ramp + 10 <= 2438.4 && s.width + 2 * t <= 1219.2 ? 1 : 2} | Floor ${d.floorLen} x ${mm(s.width + 2 * t)} and ramp ${s.ramp} x ${d.rampWidth}. Plus exterior sealer |
| F | Ramp hardware | [Zoro Select 2ZFK4 stainless piano hinge, 36 inch](https://www.zoro.com/zoro-select-piano-hinge-stainless-steel-full-surface-mounting-1-in-leaf-w-x-36-in-leaf-h-stainless-steel-2zfk4/i/G1671966/), $18.19. [Southco TL-20-202-52 stainless draw latch](https://www.zoro.com/southco-toggle-style-draw-latch-small-size-concealed-mount-stainless-steel-passivated-tl-20-202-52/i/G115615363/), $11.89 | 1 hinge, 2 latches, ${c.rampBolts} carriage bolts 1/4-20 x 2 inch (Bolt Depot 2754, $0.16) | The hinge is unpunched: cut it to ${Math.floor(d.rampWidth / 10) * 10} and drill it. Check the latch comes with its keeper |
| F | Handle, floor and parking | [S&W BSW-1Z 3/8-16 swivel leveling mount](https://www.zoro.com/s-w-manufacturing-level-mount-swivel-stud-38-16-1-14-in-bsw-1z/i/G1257593/) in its tall version, $11.59. [Harbor Freight 96479 rubber wheel chock](https://www.harborfreight.com/solid-rubber-wheel-chock-96479.html), $7.49, in store. Hardware store: 1/4-20 rivet nuts, foam grip tube for a 1 inch bar, 1/8 inch foam strip | 2 tall leveling mounts, 2 chocks, ${c.floorScrews} rivet nuts and flat-head screws 1/4-20, about ${Math.ceil((s.width - 60) / 152.4)} foam grips of 6 inch, about 9 m of foam strip, one 12.7 mm aluminum tube ${d.topRailCut} long | A 4 ft store tube is too short for a ${d.topRailCut} ridge. Rivet nut, grip and foam strip prices were seen on listings only |
${d.sprung ? `| D | Rear suspension | [LvTu 150 mm coil-over shock](${roverShock.url}), $31.05, in the ${h.shockRate} lbs spring. [Bunting EF081008 bronze flanged bearing](https://www.zoro.com/search?q=oil+impregnated+bronze+flanged+sleeve+bearing+1%2F2+x+5%2F8+x+1%2F2), $5.29 per pack of three. [Bolt Depot 399](https://boltdepot.com/Product-Details?product=399) 1/2-13 x 4 inch bolt, $1.64, and lock nut 21807, $0.41. M8 x 50 bolts with lock nuts | 2 shocks, 2 packs of bearings, 2 pivot bolts and nuts, 4 eye bolts, ${c.shockBolts} hanger bolts 1/4-20 x 3-1/2 inch | Buy the shocks before ordering the plates. The plate files assume eyes 24 wide with an 8 bore; if yours differ, say so before cutting |
` : ''}| G | Cover materials | See buy-list.md for every line with its link | | Cut list in cover-cut-schedule.csv |
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

${tubes.length ? 'If your tubes came from a tube laser, check each one against the list below and skip to the sleeves at the end of this section.\n\n' : ''}Cut the long pieces first. Clamp the bar, cut square, and leave the saw 3 mm per cut. Deburr both ends inside and out. Write the ID on each piece as it comes off the saw. Cut pairs to the same stop so they match each other exactly; matching matters more than the absolute length.

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
${s.taper > 0 || s.rake > 0 ? `
Angled ends. Lengths are along the middle of the tube, so mark the middle of each face and cut through that mark.

| Piece | End | Cut |
| --- | --- | --- |
| C03 axle post, C09 rear post | Top | ${d.roofAngle.toFixed(1)} degrees off square, high side to the rear, so the sloping top rail sits flat on it |
| C21 front pillar | Foot | ${d.pillarAngle.toFixed(1)} degrees off square, so the pillar leans back |
| C21 front pillar | Top | ${(d.pillarAngle + d.roofAngle).toFixed(1)} degrees off square, so it sits flat under the top rail |

${d.welded ? 'Cut these a little long and trim to fit against the tacked frame, or leave them to the shop.' : 'Set the miter saw to each angle and cut a test piece from an offcut first. A degree either way is taken up by the plate; a gap you can see daylight through is not.'}
` : ''}
Then cut ${c.sleeves} sleeves ${t} long from the 3/8 inch steel tube, ${axleSleeves} axle sleeves ${t} long and 2 wheel spacers ${d.spacer} long from the 3/4 inch tube, and the axles: 2 at ${d.rearShaft}${d.swivel ? '' : ` and 1 at ${d.frontShaft}`}. Square and deburr every one. The linked 3/4 inch x .065 wall tube is 0.620 inch inside, a hair under the 5/8 inch axle: ream it to 5/8 or buy .058 wall instead. A sleeve that is short lets the tube crush; one that is long keeps the plate from seating.

## 7. Mark and drill

${tubes.length ? `If your tubes came from a tube laser, only this is left to drill: ${[...new Set(tubes.flatMap(x => x.hand.map(text => `${x.id}: ${text.charAt(0).toLowerCase()}${text.slice(1)}`)))].join('; ') || 'nothing in the frame tubes'}. The floor fasteners in section 11 are drilled on assembly either way.\n\n` : ''}${d.welded ? 'The welded frame has few holes: the axle hangers, the brake plates, the tip-stops, the ramp and the front wheel. Drill them after welding, or have the shop do it. ' : ''}Every hole is in drilling.csv, measured from a named end of a named piece. "Side" means through the two vertical faces of the tube as it sits in the carrier. "Vertical" means through top and bottom. "Fore-aft" means front to back.

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

${d.welded ? weldedFrame : boltedFrame}## 11. Floor

1. Cut the floor panel ${d.floorLen} x ${mm(s.width + 2 * t)}. Notch 44 x 30 at each of the six posts.
2. Seal every face and edge, including the notches, and let it cure.
3. Stick bedding tape along the rails and cross members${d.welded ? '' : ' between the plates'}.
4. Set rivet nuts in the tube tops about every 250 and fasten the floor down with flat-head screws.

## 12. Ramp and tailgate

1. Cut the ramp panel ${s.ramp} x ${d.rampWidth} and seal it.
2. Bolt the two C06 curb rails on top along the long edges with carriage bolts, smooth heads underneath.
3. Bolt the two C07 ribs underneath, one 40 from the hinge edge and one at mid length.
4. ${d.welded ? 'The two C08 stand legs come welded to the hinge-end rib, 60 in from each end.' : 'Fit the two C08 stand legs under the hinge-end rib, 60 in from each end, a corner gusset on both faces of the rib.'} Press a printed chassis cap into the bottom of each leg. The cap is the foot.
5. Screw the hinge to the top face of the floor edge and the top face of the ramp, with a 6 gap between the panels.
6. Lower the ramp on level ground. Both capped legs should touch at the same time as the toe edge. If a leg floats or lifts the toe, trim or shim that leg; the cut length is ${d.legCut}.
7. Stick the traction sheet between the curbs, stopping 18 short of the ground edge, and slide the three printed toes onto that edge with a bead of sealant.
8. Raise the ramp. Fit the two draw latches to the rear posts and the safety strap as a separate, second hold.

## 13. Handle, tip-stops and parking brake

${d.welded ? `1. The handle arms and grip tube are part of the welded frame, ${s.handle} above the ground.
2. Slide the foam grip onto the grip tube. If it will not pass the arm ends, slit it lengthwise and tape it.` : `1. Bolt each C12 handle arm to the outside of a rear corner post and an axle post with one 3 inch bolt per post, ${s.handle} above the ground.
2. Fit the C13 grip tube between the arm ends with a corner gusset above and below each end. Slide on the foam grip.`}
3. Screw a tall leveling mount up through each base rail at ${mm(117.3 + t)} from the rear end, a nut and washer above and below. Set the pads about 40 above the ground.
${d.welded ? `4. Brake arms. The C17 arms are welded to the axle posts. Bolt a brake clamp plate to the front face of each arm with two bolts through the arm, a sleeve in each hole.` : `4. Brake arms. Butt a C17 arm against the outside face of each axle post, ${mm(d.brakeZ - d.railZ - t / 2)} up the post, pointing outward over the tire. Put a corner gusset on the front and rear faces, long-hole leg along the arm, and bolt through. On the front, hang a brake clamp plate on the same two arm bolts, outside the gusset.`}
5. Hold a toggle clamp against the plate with its plunger pointing straight down at the middle of the tread. With the handle open the pad should clear the tire by about 10; closed, it should press about 10 into it. Mark the four base holes, drill 3/16 inch through the plate, and bolt the clamp on.
6. Swap the clamp's plain plunger bolt for the neoprene-tipped spindle and set its height with the jam nuts. Close both clamps and try to roll the carrier. It should not move on level ground.
7. Chock both rear wheels as well on any slope and whenever the ramp is down. The clamps are a parking brake only. Nothing slows the carrier while it is moving.${d.sprung ? '\n8. With sprung wheels the tire rises and falls under the pad as the load changes. Set the pad with the dog\'s weight aboard and expect it to grip less when the carrier is empty. This is not solved; rely on the chocks.' : ''}

${d.seats ? `## Two-seat concept

**NOT FOR USE WITH A CHILD.** The cut list includes three C24 seat cross tubes and two C25 seat legs so the layout can be mocked up: a seat ${h.seatHeight} above the deck just ahead of the axle posts, with a back bar ${h.seatBack} above it. No joint, harness anchor or restraint is designed, on purpose, and no build steps are given. A carrier for children is a regulated children's product; see assembly.md.

` : ''}## 14. Cover

Cut the ${cover.pieces.reduce((n, p) => n + p.qty, 0)} blanks in cover-cut-schedule.csv. Sew and seal as described in materials.md. Hang the cover with the printed rail clips and the hook-and-loop tabs.

${d.ski ? `## Snow conversion

This kit is a concept drawn from the same tube. No ski has been chosen and nothing about it has been tried on snow.

1. Bolt each C19 ski foot along the middle of a ski with two flat-head bolts up through the sole, 150 each side of center.
2. ${d.welded ? 'Each C18 ski post comes welded to the middle of its foot.' : 'Stand a C18 ski post on the middle of each foot with a tee gusset on both faces, bar along the foot, stem up the post.'} Fit an axle sleeve through the post ${mm(d.skiPost - h.skiAbove)} up from its bottom.
3. Take off both rear wheels and the front ${d.swivel ? 'caster' : 'wheel'}. Slide a ski post onto each rear axle in place of the wheel, a spacer each side, then washer and cotter. The ski should rock freely on the axle.
4. Pin a C20 tow shaft to the outside of each ${d.swivel ? 'base rail' : 'fork arm'} with a quick-release pin so it can pitch. Link the two shaft ends to the hip belt.
5. The skier now carries the front of the carrier on the belt. Try it empty, on the flat, before anything else. It has no brake and will push from behind on a descent.

` : ''}## 15. Before any load

1. Check every bolt has a sleeve, two washers and a lock nut with thread showing.${d.welded ? ' Look over every weld for cracks, now and after each step below.' : ''}
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

**Materials to buy: about ${money(total)}.** ${money(firm)} of that has a supplier page behind it. The remaining ${money(total - firm)} is allowance and needs a quote or a shop visit. Your own time is extra: the study assumes about ${d.welded ? '6 hours of cutting and assembly, with the welding done by a shop,' : '15 hours of cutting, drilling and assembly'} and ${Math.round(textiles.minutes / 60)} hours of sewing.

## Frame, running gear and hardware

| Item | Cost | Basis |
| --- | ---: | --- |
${parts.map(row).join('\n')}
| **Subtotal** | **${money(sum(parts))}** | |

Cut from the bars with cut-list.csv. Send metal/*.dxf to a laser or waterjet shop for the ${d.welded ? '2 brake clamp plates' : `${d.counts.corner} corner gussets, ${d.counts.tee} tee gussets`} and ${d.counts.hanger} axle hangers.${d.welded ? ' The frame is welded by a fabrication shop from weld-schedule.csv; build-guide.md says how to find one and what to ask.' : ''} The parts list in bom.csv has every specification.

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

/** Tube stock as the tube laser service lists it. The thin wall is modeled at the listed 0.062 inch so the file matches the catalog profile. */
export const roverTubeService = {
  name: 'OSH Cut', url: 'https://app.oshcut.com', checked: '2026-11-12',
  heavy: { material: '6061-T6 aluminum square tube, 1 x 1 inch, 0.125 inch wall', wall: 3.175 },
  light: { material: '6063-T52 aluminum square tube, 1 x 1 inch, 0.062 inch wall', wall: 1.5748 },
  maxTilt: 44,
} as const
export interface RoverTube { file: string, id: string, name: string, qty: number, wall: 'heavy' | 'light', length: number, holes: number, hand: string[], spec: TubeSpec }
/**
 * Every frame tube of the bolted build as a solid with its holes, for a tube laser service that cuts from one 3D file per part.
 * Hole positions come from the drilling schedule, so the two cannot disagree. Holes the laser cannot or should not cut are listed for hand work.
 */
export function roverTubes(s: RoverSetup): RoverTube[] {
  const d = roverDimensions(s); if (d.welded) return []
  const drilling = roverDrilling(s); const rad = Math.PI / 180; const half = h.tube / 2
  const tilt = (id: string): [number, number] => id === 'C03' || id === 'C09' ? [0, d.roofAngle] : id === 'C21' ? [d.pillarAngle, d.pillarAngle + d.roofAngle] : [0, 0]
  const qualifier = (member: string) => member.includes(',') ? member.slice(member.indexOf(',') + 2) : ''
  const slug = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  return d.cuts.flatMap((cut) => {
    const rows = drilling.filter(r => r.id === cut.id); const labels = [...new Set(rows.map(r => qualifier(r.member)).filter(Boolean))]
    const variants = labels.map(label => ({ label, qty: rows.find(r => qualifier(r.member) === label)!.qty, rows: rows.filter(r => !qualifier(r.member) || qualifier(r.member) === label) }))
    const rest = cut.qty - variants.reduce((n, v) => n + v.qty, 0)
    if (rest > 0) variants.push({ label: '', qty: rest, rows: rows.filter(r => !qualifier(r.member)) })
    // Holes marked "side" run along X, so an angled end always tilts about that axis. A tube's other hole direction runs along Y.
    const axes = [...new Set(rows.map(r => r.axis))]; const xAxis = axes.includes('side') ? 'side' : axes[0]
    const wall = cut.wall as 'heavy' | 'light'; const inner = half - roverTubeService[wall].wall; const angles = tilt(cut.id)
    return variants.map((variant) => {
      const hand: string[] = []; const L = cut.length
      // An end steeper than the laser head can tilt is left square, to be sawn by hand.
      const tans = angles.map((angle, end) => { if (angle > roverTubeService.maxTilt) { hand.push(`Saw the ${end ? 'top' : 'foot'} end to ${angle.toFixed(1)} degrees off square`); return 0 } return Math.tan(angle * rad) })
      const low = Math.abs(tans[0]!) * half; const high = L - Math.abs(tans[1]!) * half
      const holes: TubeHole[] = []
      for (const row of variant.rows) {
        const diameter = Number.parseFloat(row.bore); const axis = row.axis === xAxis ? 'x' : 'y'
        if (row.purpose.includes('Mark from the delivered')) { hand.push(`Drill ${row.centers.length} holes for: ${row.purpose}`); continue }
        // A bore nearly as wide as the tube would break into the side walls, which a tube laser cannot cut cleanly.
        if (diameter / 2 > inner - 0.5) { hand.push(`Drill ${row.centers.length} hole of ${row.bore.split(',')[0]} mm for: ${row.purpose}`); continue }
        const from = row.from; const at = row.centers.flatMap(c => from === 'each end' ? [c, L - c] : from === 'the middle' ? [L / 2 + c] : from === 'top' || from === 'front end' ? [L - c] : [c])
        for (const z of at) {
          const clear = z - diameter / 2 > low + 2 && z + diameter / 2 < high - 2 && !holes.some(o => o.axis === axis && Math.abs(o.z - z) < (o.diameter + diameter) / 2 + 1.5)
          if (holes.some(o => o.axis === axis && Math.abs(o.z - z) < 0.01)) continue
          if (clear) holes.push({ axis, z: mm(z), diameter })
          else hand.push(`Drill one ${diameter} mm hole ${mm(z)} from the start end for: ${row.purpose}`)
        }
      }
      const name = variant.label ? `${cut.name}, ${variant.label}` : cut.name
      return { file: `tubes/${cut.id}-${slug(name)}.step`, id: cut.id, name, qty: variant.qty, wall, length: L, holes: holes.length, hand, spec: { outer: h.tube, wall: roverTubeService[wall].wall, length: L, tan0: tans[0], tan1: tans[1], holes } }
    })
  })
}
export function roverTubeOrderCsv(s: RoverSetup): string {
  return csv([['File', 'Tube ID', 'Member', 'Quantity', 'Material to choose', 'Length mm', 'Holes cut, each through both walls', 'Left for hand work'], ...roverTubes(s).map(t => [t.file, t.id, t.name, t.qty, roverTubeService[t.wall].material, t.length, t.holes, t.hand.join('; ') || 'Nothing'])])
}

export function roverDocuments(s: RoverSetup): Record<string, string> {
  const d = roverDimensions(s)
  return {
    'assembly.md': roverAssembly(s), 'bom.csv': roverBom(s), 'materials.md': roverMaterialsMarkdown(s), 'cover-cut-schedule.csv': roverCoverCsv(s), 'cover-panels.svg': roverCoverSvg(s), 'drawing.svg': roverDrawing(s),
    'cut-list.csv': csv([['ID', 'Quantity', 'Member', 'Stock', 'Cut mm'], ...d.cuts.map(c => [c.id, c.qty, c.name, WALL[c.wall as 'heavy' | 'light'], c.length])]),
    'cost-notes.md': roverCostMarkdown(s), 'buy-list.md': roverBuyList(s), 'build-guide.md': roverBuildGuide(s), 'drilling.csv': roverDrillingCsv(s), ...(d.welded ? { 'weld-schedule.csv': roverWeldCsv(s) } : { ...Object.fromEntries(d.angles.map(a => [`metal/${a.file}.dxf`, angleGussetDxf(a.angle, a.shift)])), 'tube-order.csv': roverTubeOrderCsv(s), ...Object.fromEntries(roverTubes(s).map(t => [t.file, stepFile(`${t.id} ${t.name}`, tubeBrep(t.spec))])) }), 'base-plan.svg': roverBasePlan(s), 'cost-model.json': JSON.stringify(roverCostModel(s), null, 2) + '\n',
    'setup.json': JSON.stringify({ revision: 'r0', product: 'Buddy Rover', ...s, dimensions: { ...d, rampAngleRad: undefined }, status: 'BENCH_ONLY_NOT_ANIMAL_USE', ownerReportedWeightLb: 140, fitted: false, loadRated: false }, null, 2) + '\n',
  }
}
