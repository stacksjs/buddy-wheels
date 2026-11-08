import type { StandardSetup } from './XLStandard'
import { mm, parseStandardSetup, standardBom, standardCode, standardDimensions, standardDrilling, standardHardware as h, standardParameters, standardParts, standardPartFile, standardStart } from './XLStandard'
export interface SpringSetup extends StandardSetup { preload: number, travel: number }
export const springStart: SpringSetup = { ...standardStart, preload: 1, travel: 0 }
export const springHardware = { housing: 31.75, liner: 1.27, carriage: 220, stroke: 8, springOd: 20, springId: 10, free: 75, rate: 65.3, seat: 27.8, pin: 8, guide: 55 } as const
export const springParts = [...standardParts, { id: 'rail_shim', name: 'Rail width shim', qty: 4, kind: 'metal', note: '3.175 mm steel. Makes the 25.4 mm rail flush with the 31.75 mm housing. Not a printed load path.' }, { id: 'spring_seat', name: 'Captured spring seat', qty: 4, kind: 'metal', note: '3.175 mm steel, 27.8 mm square, M5 clearance. Plate bending and pin contact need qualification.' }] as const
export function springPartFile(id: string) { return id === 'rail_shim' || id === 'spring_seat' ? `FIT_CHECK_ONLY_${id}.stl` : standardPartFile(id) }
export function parseSpringSetup(input: Record<string, unknown>): SpringSetup {
  const frame: Record<string, unknown> = Object.create(null)
  for (const [k, v] of Object.entries(input)) { if (k !== 'preload' && k !== 'travel') frame[k] = v }
  const setup = { ...parseStandardSetup(frame), preload: springStart.preload, travel: springStart.travel }
  for (const key of ['preload', 'travel'] as const) {
    const v = input[key] ?? setup[key]
    if ((typeof v !== 'number' && (typeof v !== 'string' || !/^\d+$/.test(v))) || !Number.isInteger(Number(v)) || Number(v) < 0 || Number(v) > (key === 'preload' ? 2 : 8)) throw new Error(`${key} must be a whole millimeter from 0 to ${key === 'preload' ? 2 : 8}.`)
    setup[key] = Number(v)
  }
  return setup
}
export const springQuery = (s: SpringSetup) => new URLSearchParams(Object.entries(parseSpringSetup({ ...s })).map(([k,v]) => [k, String(v)])).toString()
export const springCode = (s: SpringSetup) => standardCode(s).replace('r1','r2') + `-p${s.preload}-t${s.travel}`
export function springDimensions(s: SpringSetup) {
  const R = h.wheel / 2; const d = standardDimensions(s)
  return { bridge:d.bridge,shaft:d.shaft,stack:d.stack,offset:d.offset,axleStart:d.axleStart,innerAxleClearance:d.innerAxleClearance,tireWidth:d.tireWidth,tireClearance:d.tireClearance,frameTubeTotal:mm(2*s.rail+d.bridge+440),housingTubeTotal:mm(2*(s.height-h.tube/2-R-55)), housingLength: mm(s.height - h.tube / 2 - R - 55), housingBottom: mm(R + 55 - s.travel), carriageBottom: mm(R - 45), carriageTop: mm(R + 175), lowerSeatTop: mm(R + 175 + h.plate), upperSeatBottom: mm(R + 175 + h.plate + 75 - s.travel), lowerPin: mm(R + 110 - s.travel), upperPin: mm(R + 175 + 2*h.plate + 75 + 4 - s.travel), springLength: 75 - s.preload - s.travel, compression: s.preload + s.travel, forceN: mm(65.3 * (s.preload + s.travel)), loadedHeight: s.height - s.travel, overlap: 120 + s.travel, nominalLinerGap: mm((31.75 - 2*h.wall - h.tube)/2 - 1.27), guideTop: mm(R + 175 + h.plate + 55), slotLow: 147, slotHigh: 155 }
}
export function springCuts(s: SpringSetup) { const d = springDimensions(s); return [{ name: 'Side rail', qty: 2, length: s.rail }, { name: 'Rear bridge', qty: 1, length: d.bridge }, { name: 'Wheel carriage', qty: 2, length: 220 }] }
export function packSpringCuts(cuts: { qty: number, length: number }[], quantity: number, stock: number) {
  if (![1,100].includes(quantity) || !Number.isFinite(stock) || stock <= 0) throw new Error('Invalid r2 stock purchase scenario.')
  const pieces = cuts.flatMap(c => Array.from({length:c.qty*quantity},()=>c.length)).sort((a,b)=>b-a); const remaining: number[] = []
  for (const len of pieces) { if (!Number.isFinite(len) || len <= 0 || len+3 > stock) throw new Error('Invalid r2 cut.'); const i = remaining.findIndex(r=>r >= len+3); if(i<0) remaining.push(stock-len-3); else remaining[i]! -= len+3 }
  return { bars: remaining.length, stockLength: stock, stockMm: mm(stock*remaining.length), netMm: mm(pieces.reduce((a,b)=>a+b,0)), kerfMm: pieces.length*3, remaining: remaining.map(mm) }
}
export function springBom(s: SpringSetup) {
  const d = springDimensions(s)
  const original = standardBom(s).split('\n').filter(row => !/^"(?:M02|H01|H02)"/.test(row)).join('\n').trimEnd()
  const rows: (string|number)[][] = [
    ['M02',2,'Wheel carriage','6061-T6 25.4 x 25.4 x 1.651 mm; cut 220 mm','See r2 drilling and slot datums'],
    ['S01',2,'Outer housing',`6061-T6 31.75 x 31.75 x 1.651 mm; cut ${d.housingLength} mm`,'Wicks SQ1-1/4X065-T6; inspect actual corners, bore, finish and straightness'],
    ['S02',2,'Compression spring','MISUMI SWH20-75; OD 20 ID 10 nominal, L 75 mm, k 65.3 N/mm','Undamped industrial spring; no dog-support approval'],
    ['S03',4,'Spring seat','3.175 mm A36 steel; spring_seat.dxf','Lower bridges carriage bore; upper retained by smooth steel pin. Do not print for loaded use'],
    ['S04',4,'Housing retaining pin','8 mm smooth steel clevis pin, nominal 45 mm under-head length; matching washers/cotters','Two per side. Required clear grip >=34.75 mm. Head/cross-hole specification and supplier SKU require drawing approval; no threads in slots'],
    ['S05',16,'Wear liner','PSA UHMW .050 inch; 18 x 35 mm patches','Two bands of four faces, carriage z=120-155 and 180-215. Keep 8.2 mm slots clear. Actual tolerance, adhesive and wear unqualified'],
    ['S06',2,'Spring guide tube','4130 .375 OD x .049 wall inch; cut 55 mm','9.525 OD guide through nominal 10 mm spring ID; verify minimum spring ID, bow and installation clearance'],
    ['S07',2,'Guide fastener set','M5 x 70 mm ISO4762 socket screw (8.5 OD, 5 high head); DIN433 upper washer 5.3 ID/9 OD/1 mm; underside washer 1 mm and 5 mm locknut','Retains guide to lower seat only, does not tie upper seat to carriage. Bolt/head height and 4 mm nominal bump clearance require verification'],
    ['S08',2*s.preload,'Preload shim','DIN 988 steel washer 10 ID x 20 OD x 1 mm','Stack below upper seat, identical both sides. Preload shifts initial force; spring rate stays 65.3 N/mm'],
    ['S10',1,'Complete cartridge/axle/pinch guard set','Two flexible cartridge bellows plus axle-end and joint pinch guards, retained to metal','RFQ allowance only; pattern and attachment unqualified. No animal use without completed tested guards'],
    ['S09',4,'Rail width shim','3.175 mm A36 steel, rail_shim.dxf','One between each vertical T plate and narrower rail, not between plate and housing'],
    ['H01',12,'Joint bolt','1/4-20 x 2 inch SAE J429 grade 5','Rear frame and axle patches'],
    ['H01L',8,'Long joint bolt','1/4-20 x 2.25 inch SAE J429 grade 5','Four rail and four housing-top bolts; check thread engagement'],
    ['H02',16,'Short crush sleeve','4130 .375 OD x .049 wall inch, cut 25.4 mm','Four rail, eight rear bridge/rail, four axle-patch sleeves'],
    ['H02L',4,'Housing crush sleeve','Same steel stock, cut 31.75 mm','Housing-top bolts only. Retaining pins stay free, no sleeve through moving carriage'],
  ]
  return original+'\n'+rows.map(row=>row.map(v=>`"${String(v).replaceAll('"','""')}"`).join(',')).join('\n')+'\n'
}
export function springDrilling(s: SpringSetup) {
  const d = springDimensions(s)
  return standardDrilling(s).split('\n').filter(row=>!row.startsWith('"Upright"')).join('\n').trimEnd() + `\n"Wheel carriage","2","Y","20 / 70","9.725","Axle-patch sleeves, bottom datum"\n"Wheel carriage","2","Y","45","19.25","Axle sleeve, bottom datum"\n"Wheel carriage","2","Y","147 to 155","8.2","Capsule slot through both walls: 8 mm between end centers, total length 16.2 mm; finish tool, no 3D printed slot"\n"Housing","2","Y","55 / 205.35","8.2","Lower travel pin and upper spring-seat pin, bottom datum. Do not put crush sleeves through slots"\n"Housing","2","Y","${mm(d.housingLength-22.3)} / ${mm(d.housingLength-47.3)}","9.725","Top T-gusset crush sleeves"\n`
}
export function springParameters(s: SpringSetup) { return standardParameters({ height:s.height,width:s.width,rail:s.rail,hub:s.hub }).replace('r1 RIGID','r2 UNDAMPED SPRING').replace('include <source/standard.scad>',`preload=${s.preload};\ntravel=${s.travel};\ninclude <source/suspension.scad>`) }
export function springDocuments(s: SpringSetup): Record<string,string> {
  const d = springDimensions(s)
  return { 'model.scad':springParameters(s),'setup.json':JSON.stringify({revision:'r2',status:'BENCH_ONLY_NOT_ANIMAL_USE',setup:s,dimensions:d,spring:springHardware},null,2)+'\n','bom.csv':springBom(s),'drilling.csv':springDrilling(s),'assembly.md':`# Buddy XL r2: standard die-spring bench cartridge

Configuration ${springCode(s)}. All dimensions mm. This is an undamped, unqualified empty-rig prototype. No dog-use, 140 lb capacity, terrain or rehabilitation rating exists. Confirm Buddy's anatomy and clinical suitability before a fitted design. Metal and qualified textile supports carry the loads. Never use a printed metal-profile fit check as structural material.

## What changes

Two captive telescoping carriages replace r1's rigid posts. Each uses one standard MISUMI SWH20-75 spring, four-sided UHMW guidance, steel seats and two positively retained smooth pins. Fixed spring rate 65.3 N/mm. Preload ${s.preload} mm uses ${2*s.preload} matched 1 mm steel shims, ${s.preload} per wheel. Preload changes the initial force, not spring stiffness. This is not a hydraulic shock or an adjustable damper. An alternative rate requires a separately verified spring and new cost/clearance checks; none is approved here.

## Exact configured cut and stack schedule

Rail center height at full droop ${s.height}, width ${s.width}, rail length ${s.rail}; hub assumption ${s.hub}. Preview bump ${s.travel}, displayed loaded rail height ${d.loadedHeight}. Travel is a manual geometric pose, not predicted sag or a clinical setting. Manufacture from full-droop datums regardless of preview pose.

- 1 inch square tube: ${springCuts(s).map(c=>`${c.qty} x ${c.length} (${c.name})`).join('; ')}.
- 1.25 inch housing: 2 x ${d.housingLength}. Same .065 inch wall. Nominal bore 28.448.
- Carriage bottom Z120.1, top 340.1. Lower seat bottom 340.1, top 343.275. At droop upper seat bottom 418.275, top 421.45; upper retaining pin center 425.45. Housing bottom 220.1. Each end of lower travel slot center is 147/155 above carriage bottom. Housing lower pin 55 above housing bottom; upper pin 205.35 above housing bottom.
- Spring shims sit BELOW the upper seat, above the spring, not above the retaining pin. Installed spring length ${d.springLength}; nominal compression ${d.compression}. 8 mm between slot-end centers gives 8 mm stroke for an 8 mm pin. Slot width 8.2 adds up to 0.2 mm end play; do not interpret nominal travel as a precision hard stop. Machine and measure actual stops.
- Lower seat carries a 55 mm steel guide sleeve with M5 x 70 bolt: upper washer 1 plus sleeve 55 plus seat 3.175 plus lower washer 1 leaves 9.825 mm under-seat thread for a nominal 5 mm locknut and 4.825 mm protrusion. Nominal 5 mm bolt-head height gives 4 mm upper-seat clearance at maximum preload and travel; actual hardware/tolerances must be verified.

## Bench assembly sequence

1. Read BOM and drilling.csv, measure both actual wheel hubs/bearings/washer stacks, then adjust hub field. Obtain reviewed drawings for steel pins, axle shafts, slots, bearing/liner fits, finishes and the complete textile support. Provisional dimensions are not procurement specifications.
2. Cut both square-tube SKUs with 3 mm saw kerf; finish faces and deburr. Drill only reviewed datums using proper metal tooling. Machine matching capsule slots, never freehand loaded bearing surfaces. Inspect remaining ligaments, parallelism and crack-free edges.
3. Cut eight T gussets, four axle patches, four rail shims and four spring seats from 3.175 mm steel. Deburr, finish and inspect. The r1 service caps and layout fixture remain nonstructural.
4. Fit two bands of four UHMW pads per carriage, at local heights 120-155 and 180-215. Slots run on Y faces at 147-155, so trim those two pads around slots with no adhesive in the pin path. Nominal per-face running clearance is ${d.nominalLinerGap} before adhesive/corner/tube tolerances. Verify loaded side-play and sliding friction; nominal clearance alone cannot establish fit.
5. Put lower steel seat on carriage end. Secure the guide sleeve to this seat with the reviewed M5 guide fastener stack, nut below seat. The guide end and bolt head must clear the upper seat/shims at full compression; guide fastener must not protrude into the spring wire. Install selected matched spring pair and equal preload shims.
6. Slide housing over carriage and capture lower stop pin through both housing bores and both carriage slots. Insert upper seat, retain it under the upper smooth pin, add correct washers and fresh cotters to all four pins. No preload adjustment while loaded. A compressed spring stores energy; use a guarded unloading fixture and verify zero stored load before removing a pin.
7. Assemble T joints with rail shims at the four narrower-rail faces, long bolts on rail/housing junctions, short bolts at rear and axle patches, and matching flush crush sleeves. Do not clamp a carriage slot with a bolt. Apply only an approved torque/locking procedure.
8. Reuse r1 stock-shaft axle sleeves, spacers, washers and positive cotters. Wheel hub length remains provisional. Verify shaft fit, end float, patch contact and tire/frame clearance across full travel. Fit caps only after inspecting retention. Complete fur/pinch/spring guards are required before any animal and are not qualified in these files.
9. On the guarded empty rig, measure force versus travel for both sides, friction/hysteresis, rebound, asymmetric bump, stop impact, spring/seat/pin wear, bending, permanent set, contamination, corrosion, pin migration, tip resistance and fatigue. This mechanism has NO damper. Stop if there is binding, uncontrolled rebound or contact. A catalog spring cycle figure does not qualify the assembly.
10. Obtain engineering approval of the complete load paths, guards and stable support layout, plus professional fitting. Do not place Buddy in this bench rig. Time actual manufacture, obtain itemized quotes and replace cost allowances before any retail release.

## Downloads and reproducibility

The kit includes configured model.scad, source/suspension.scad and a frozen r1 geometry dependency source/rigid.scad, eight actual STL types, four metal DXFs, matching setup/BOM/drilling, cost files and checksums. assembly.png is only the default pose reference. Open the configured CAD for the selected pose and dimensions. Run official OpenSCAD to manufacture geometry; the studio's tube/pin primitives are inspection geometry, not machining drawings. No printer or one-time development cost is hidden in recurring COGS.
` }
}
