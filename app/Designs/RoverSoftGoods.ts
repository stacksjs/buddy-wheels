import type { RoverSetup } from './Rover'
import { roverDimensions, roverHardware as h } from './Rover'
import { linearPurchase, rectanglePurchase } from './TextilePurchases'

export const roverTextileDate = '2026-11-11'
/**
 * Weather system candidates. Prices and quoted performance words were read on each supplier page on the date above,
 * except the three rows marked 2026-11-08, which reuse the wheelchair textile research. None is a quote or an approval.
 */
export const roverMaterials = [
  { id: 'shell', layer: 'Roof and wall shell', name: 'Sailrite Top Gun Charcoal 62 inch, 120396', url: 'https://www.sailrite.com/Top-Gun-Charcoal-62-Fabric', cents: 2395, unit: '62-inch-wide linear yard', guards: 'Rain, sun, wind', facts: 'Supplier words: acrylic-coated, 100% polyester, 600 denier, 11.5 oz per square yard, "Highly UV Resistant", "Highly Water Resistant", 5-year warranty.', caveat: 'The page does not say waterproof and gives no hydrostatic head or UPF number. Both must be measured on the sewn, seam-taped roof.' },
  { id: 'mesh', layer: 'Window mesh', name: 'Sailrite Phifertex Standard White 54 inch, 393111', url: 'https://www.sailrite.com/Phifertex-Mesh-White-000-54', cents: 1795, unit: '54-inch-wide linear yard', guards: 'Sun, airflow, claws', facts: 'Supplier words: vinyl-coated polyester mesh, "Shade Factor 70%", 11.3 oz per square yard.', caveat: 'Claw, chew and push-out resistance are not stated for a 140 lb dog. Mesh is not a restraint.' },
  { id: 'clear', layer: 'Roll-down storm panels', name: 'Sailrite Plastipane 20 gauge clear vinyl 54 inch, 283201', url: 'https://www.sailrite.com/Plastipane-20-Gauge-Vinyl-Window-Material-54', cents: 8935, unit: '10-yard roll, 54 inch wide', guards: 'Rain, wind', facts: 'Supplier words: 0.020 inch, "Cold Crack Rating -20 F". One-yard rolls are $9.25 but too short for a side panel.', caveat: 'Closed storm panels stop airflow. Heat build-up limits must be set by test before any enclosed use.' },
  { id: 'liner', layer: 'Floor tub liner', name: 'OWF 18 oz vinyl coated polyester black, VIN18BLK', url: 'https://www.owfinc.com/p/productinfo/VIN18BLK/', cents: 996, unit: '61-inch-wide linear yard', guards: 'Wet paws, sand, accidents', facts: 'Supplier words: 18 oz (20 mil), 61 inch, heat sealable. $7.77 per yard at 20 yards or more is not assumed.', caveat: 'Import, black only by the yard. Slip, chew and cleaning-chemical behavior are untested.' },
  { id: 'roofLiner', layer: 'Reflective roof liner', name: 'eQuilter Insul-Bright 45 inch, WABATISB', url: 'https://www.equilter.com/product/45350/insul-bright-polyester-insulating-material-45-wide', cents: 925, unit: '45-inch-wide linear yard', guards: 'Sun', facts: 'Supplier words: polyester insulating material with mylar. Sold from half a yard.', caveat: 'Supplier says it is not heat-proof or fire-resistant and gives no R-value. Optional layer; its benefit under a dark roof is unmeasured.' },
  { id: 'pad', layer: 'Floor comfort pad', name: 'Avetco E600 5 mm EVA, SP60A.5MM.BLACK.39X51', url: 'https://www.avetcoinc.com/product/e600-high-density-eva-foam-sheets-60-65-shore-c-39-x-51-5mm-10mm/?attribute_thickness=5+mm', cents: 3150, unit: '39 x 51 inch sheet, 5 mm', guards: 'Comfort, insulation from a cold floor', facts: 'Checked 2026-11-08: firm 60-65 Shore C closed-cell EVA, in stock, minimum one sheet.', caveat: 'Pressure relief for a recumbent senior dog is unqualified. An orthopedic pad may be needed on top.' },
  { id: 'traction', layer: 'Ramp traction surface', name: 'Sailrite Nonslip Foam Flooring Gray 27 x 94 inch adhesive-backed, 123492', url: 'https://www.sailrite.com/Marine-Foam-Flooring-Gray-27-x-94-Adhesive-Backed', cents: 9095, unit: '27 x 94 inch sheet, 5 mm', guards: 'Wet paws on the incline', facts: 'Supplier words: 100% EVA foam, 5 mm, diamond pattern, adhesive backed.', caveat: 'No wet-grip or claw-wear data. Grip on a wet 9 degree incline has to be tested with the intended dog size.' },
  { id: 'zipper', layer: 'Storm panel zippers', name: 'Sailrite YKK #10 continuous molded-tooth chain black, 100030', url: 'https://www.sailrite.com/YKK-Continuous-Vislon-Zipper-Chain-Black-10', cents: 600, unit: '5-foot piece', guards: 'Rain, wind, salt', facts: 'Molded plastic tooth. $57.00 per 50 feet is not assumed.', caveat: 'Each zipper must be cut from one piece. Sand jamming and cold stiffness are untested.' },
  { id: 'slider', layer: 'Zipper sliders', name: 'Sailrite YKK #10 single-pull locking slider, 100033', url: 'https://www.sailrite.com/YKK-Slider-Single-Pull-Black-Vislon-10', cents: 1125, unit: 'pack of 5', guards: 'Closure', facts: 'Locking single pull.', caveat: 'A zipper is a closure, not escape prevention.' },
  { id: 'seam', layer: 'Roof and corner seam tape', name: 'Rockywoods MELCO seam tape for 2-layer fabrics, 31-MELCO-FU700-Clear', url: 'https://www.rockywoods.com/products/melco-seam-sealing-tape-for-2-layer-fabrics', cents: 289, unit: 'meter, 20 mm wide', guards: 'Rain at needle holes', facts: 'Supplier words: for polyurethane coated fabric seams, flow temperature 110 C.', caveat: 'Top Gun is acrylic coated, not polyurethane. Adhesion must be proven on a sample or replaced with a compatible sealer.' },
  { id: 'reflective', layer: 'Reflective trim', name: 'Sailrite sew-on reflective tape 1 inch yellow, 123218', url: 'https://www.sailrite.com/Sew-On-Reflective-Tape-1-Yellow-2.2-Yds', cents: 295, unit: '2.2-yard pack', guards: 'Low light', facts: 'Sew-on, 1 inch.', caveat: 'No reflectivity rating on the page. Not a substitute for lights.' },
  { id: 'hook', layer: 'Hook tape, 2 inch', name: 'Sailrite polyester black hook 2 inch, 105032', url: 'https://www.sailrite.com/Velcro-Polyester-Black-Hook-2', cents: 700, unit: '10-foot piece', guards: 'Flap hold-downs, cover tabs', facts: 'Polyester. Loop 105036 is the same price and is bought separately.', caveat: 'Hook and loop clogs with sand and fur. Hold-downs are not restraint.' },
  { id: 'loop', layer: 'Loop tape, 2 inch', name: 'Sailrite polyester black loop 2 inch, 105036', url: 'https://www.sailrite.com/Velcro-Polyester-Black-Hook-2', cents: 700, unit: '10-foot piece', guards: 'Flap hold-downs, cover tabs', facts: 'Polyester.', caveat: 'Same listing family as the hook side; confirm the loop item at checkout.' },
  { id: 'cord', layer: 'Roof hem shock cord', name: 'Quest Outfitters shock cord 3/16 inch, 2403', url: 'https://questoutfitters.com/products/shock-cord', cents: 104, unit: 'yard', guards: 'Keeps the roof taut so water runs off', facts: '3/16 inch.', caveat: 'UV life of the cord is not stated.' },
  { id: 'dring', layer: 'Tether rings', name: 'Sailrite D-ring 1 inch stainless 316, 122757', url: 'https://www.sailrite.com/D-Ring-Without-Bar-0-1-Stainless-Steel', cents: 155, unit: 'each', guards: 'Salt', facts: 'Supplier states a 270 lb working load limit for the ring alone.', caveat: 'A ring rating does not rate the sewn tether, its anchor or the frame. No restraint claim.' },
  { id: 'webbing', layer: 'Tether, grab and tie webbing', name: 'Strapworks 1 inch polyester webbing, WSR-POL-PUT-001-BLK', url: 'https://www.strapworks.com/1-inch-utility-polyester-webbing-black', cents: 74, unit: 'foot; $77.41 per 120-foot roll', guards: 'Low stretch when wet', facts: 'Checked 2026-11-08, listed in stock.', caveat: 'Sewn strength is unqualified.' },
  { id: 'thread', layer: 'Thread', name: 'Sailrite PremoBond Tex 90 UV bonded polyester, 123338', url: 'https://www.sailrite.com/PremoBond-V-92-Black-UV-Bonded-Polyester-Thread-4-Oz-1-350-Yds', cents: 1595, unit: '4 oz cone, 987.552 m', guards: 'Sun', facts: 'Checked 2026-11-08. Supplier describes UV protection and a non-wicking finish.', caveat: '160 m per cover is an unmeasured allowance.' },
] as const
export const roverMaterialAlternates = [
  'Shell alternate: Rockywoods solution-dyed 600 denier polyester, polyurethane coated, black, 58-SD600PC-Black, $15.28 per yard, 59-60 inch, supplier words "excellent UV resistance". Solution dyeing helps color hold in sun; no hydrostatic head stated.',
  'Mesh alternate for more shade: Sailrite Phifertex Plus White 54 inch, 235811, $25.95 per yard, "Shade Factor 92.50%". It leaves about 7.5% open area, so airflow drops sharply.',
  'Liner alternate: Sailrite Shelter-Rite 18 oz grey 61 inch, 112015, $23.95 per yard, supplier word "Waterproof".',
  'Clear panel alternate for colder routes: Sailrite Regalite 30 gauge 54 x 110 inch, 103762, supplier words "Cold Crack Rating -30 F". Its price was not captured.',
  'Not found: a hydrostatic head or UPF figure on any shell page, a by-the-yard clear TPU film price, and Seattle Fabrics pages (blocked).',
] as const

export interface CoverPiece { id: string, name: string, material: 'shell' | 'mesh' | 'clear' | 'liner' | 'roofLiner' | 'pad', qty: number, width: number, length: number, note: string }
/** Rectangular cut blanks, 15 mm seam allowance on every sewn edge already included. */
export function roverCover(s: RoverSetup) {
  const d = roverDimensions(s); const t = h.tube
  const coverH = s.height + h.panel + h.bedding + 2 * t; const sill = 350; const windowH = coverH - sill - 110; const headerH = Math.max(150, coverH - s.ramp)
  const r = Math.ceil
  const pieces: CoverPiece[] = [
    { id: 'P01', name: 'Roof, one piece over the ridge', material: 'shell', qty: 1, width: r(2 * d.roofSlope + 120), length: r(d.rail + 80), note: 'No seam on top. 40 mm drip overhang front and rear, 60 mm side skirts with a shock-cord hem.' },
    { id: 'P02', name: 'Side wall', material: 'shell', qty: 2, width: r(coverH + 30), length: r(d.rail + 30), note: `Window opening ${r(d.rail - 160)} x ${r(windowH)} starts ${sill} mm above the base rail.` },
    { id: 'P03', name: 'Front wall', material: 'shell', qty: 1, width: r(coverH + 30), length: r(s.width + 2 * t + 30), note: `Window opening ${r(s.width - 60)} x ${r(windowH)}.` },
    { id: 'P04', name: 'Rear header above the tailgate', material: 'shell', qty: 1, width: r(headerH + 60), length: r(s.width + 2 * t + 30), note: 'Overlaps the raised ramp by 30 mm so rain runs outside it.' },
    { id: 'P05', name: 'Tailgate wind gusset', material: 'shell', qty: 2, width: 200, length: r(s.ramp + 30), note: 'Closes the gap between the raised ramp edge and each rear post.' },
    { id: 'M01', name: 'Side window mesh', material: 'mesh', qty: 2, width: r(windowH + 30), length: r(d.rail - 130), note: 'Sewn inside the wall opening.' },
    { id: 'M02', name: 'Front window mesh', material: 'mesh', qty: 1, width: r(windowH + 30), length: r(s.width - 30), note: 'Sewn inside the wall opening.' },
    { id: 'M03', name: 'Rear header mesh', material: 'mesh', qty: 1, width: r(headerH - 30), length: r(s.width - 30), note: 'High vent that stays open under the roof overhang.' },
    { id: 'V01', name: 'Side storm panel', material: 'clear', qty: 2, width: r(windowH + 60), length: r(d.rail - 100), note: 'Rolls up and ties under the roof skirt. Two side zippers, hook and loop along the sill.' },
    { id: 'V02', name: 'Front storm panel', material: 'clear', qty: 1, width: r(windowH + 60), length: r(s.width), note: 'Wind block for running and winter.' },
    { id: 'L01', name: 'Floor tub liner', material: 'liner', qty: 1, width: r(s.width + 160), length: r(s.length + 160), note: '80 mm upturned walls, corners folded not cut, so liquid stays in the tub.' },
    { id: 'L02', name: 'Threshold flap', material: 'liner', qty: 1, width: 200, length: r(d.rampWidth), note: 'Covers the hinge gap between floor and ramp.' },
    { id: 'I01', name: 'Reflective roof liner', material: 'roofLiner', qty: 1, width: r(2 * d.roofSlope), length: r(d.rail), note: 'Quilted under the roof only. Optional.' },
    { id: 'F01', name: 'Floor pad half', material: 'pad', qty: 2, width: s.width, length: r(s.length / 2), note: 'Two halves butt at mid length, under the liner.' },
  ]
  const zipper = r(windowH + 60)
  const lengths = {
    zipperCuts: Array.from({ length: 6 }, () => zipper),
    hookLoop: r(2 * (d.rail - 100) + 2 * s.width + 24 * 120),
    seamTape: r(2 * d.rail + 2 * (s.width + 2 * t) + 4 * coverH),
    reflective: r(2 * d.rail + 2 * (s.width + 2 * t)),
    cord: r(2 * (d.rail + 80) + 2 * (2 * d.roofSlope + 120)),
    webbing: 2 * 900 + 400 + 8 * 300 + 1200,
  }
  return { coverH: r(coverH), sill, windowH: r(windowH), headerH: r(headerH), pieces, lengths, sliders: 6, dRings: 4, tractionWalk: { width: d.rampWidth - 2 * t, length: s.ramp } }
}

const price = (id: typeof roverMaterials[number]['id']) => roverMaterials.find(m => m.id === id)!.cents
/** Whole purchasing units, nested blanks, 10% reject reserve, paid sewing and freight. Unquoted. */
export function roverTextileCost(s: RoverSetup, quantity = 100, minutes = quantity === 1 ? 600 : 240, hourlyCents = 3000) {
  if (quantity !== 1 && quantity !== 100) throw new Error('Cost scenarios are one carrier or a 100-carrier batch.')
  const cover = roverCover(s)
  const blanks = (material: CoverPiece['material']) => Array.from({ length: quantity }, () => cover.pieces.filter(p => p.material === material).flatMap(p => Array.from({ length: p.qty }, () => ({ width: p.width, length: p.length })))).flat()
  const yard = 914.4
  const shell = rectanglePurchase(blanks('shell'), 1574.8, yard, price('shell'))
  const mesh = rectanglePurchase(blanks('mesh'), 1371.6, yard, price('mesh'))
  const clear = rectanglePurchase(blanks('clear'), 1371.6, 9144, price('clear'))
  const liner = rectanglePurchase(blanks('liner'), 1549.4, yard, price('liner'))
  const roofLiner = rectanglePurchase(blanks('roofLiner'), 1143, yard, price('roofLiner'))
  const pad = rectanglePurchase(blanks('pad'), 990.6, 1295.4, price('pad'), 1295.4)
  const strips = Math.ceil(cover.tractionWalk.width / 685.8)
  const tractionSheets = Math.ceil(quantity * strips / Math.floor(2387.6 / cover.tractionWalk.length))
  const zipper = linearPurchase(Array.from({ length: quantity }, () => cover.lengths.zipperCuts).flat(), 1524, price('zipper'))
  const hookPieces = Math.ceil(quantity * cover.lengths.hookLoop / 3048)
  const meters = Math.ceil(quantity * cover.lengths.seamTape / 1000)
  const reflectivePacks = Math.ceil(quantity * cover.lengths.reflective / 2011.68)
  const cordYards = Math.ceil(quantity * cover.lengths.cord / yard)
  const webFeet = Math.ceil(quantity * cover.lengths.webbing / 304.8); const webRolls = Math.ceil(webFeet / 120)
  const cones = Math.ceil(quantity * 160000 / 987552); const sliderPacks = Math.ceil(quantity * cover.sliders / 5)
  const rows = [
    { id: 'shell', name: 'Shell: roof, walls, header and gussets', purchase: shell.cents, units: shell.units, unit: 'whole linear yards' },
    { id: 'mesh', name: 'Mesh: three windows and the rear vent', purchase: mesh.cents, units: mesh.units, unit: 'whole linear yards' },
    { id: 'clear', name: 'Clear storm panels', purchase: clear.cents, units: clear.units, unit: '10-yard rolls' },
    { id: 'liner', name: 'Floor tub liner and threshold flap', purchase: liner.cents, units: liner.units, unit: 'whole linear yards' },
    { id: 'roofLiner', name: 'Reflective roof liner', purchase: roofLiner.cents, units: roofLiner.units, unit: 'whole linear yards' },
    { id: 'pad', name: 'Two floor pad halves', purchase: pad.cents, units: pad.units, unit: '39 x 51 inch sheets' },
    { id: 'traction', name: 'Ramp traction surface', purchase: tractionSheets * price('traction'), units: tractionSheets, unit: '27 x 94 inch sheets' },
    { id: 'zipper', name: 'Six storm-panel zippers', purchase: zipper.cents, units: zipper.units, unit: '5-foot chain pieces' },
    { id: 'slider', name: 'Six locking sliders', purchase: sliderPacks * price('slider'), units: sliderPacks, unit: 'packs of 5' },
    { id: 'hook', name: 'Hook tape', purchase: hookPieces * price('hook'), units: hookPieces, unit: '10-foot pieces' },
    { id: 'loop', name: 'Loop tape', purchase: hookPieces * price('loop'), units: hookPieces, unit: '10-foot pieces' },
    { id: 'seam', name: 'Seam tape', purchase: meters * price('seam'), units: meters, unit: 'meters' },
    { id: 'reflective', name: 'Reflective trim', purchase: reflectivePacks * price('reflective'), units: reflectivePacks, unit: '2.2-yard packs' },
    { id: 'cord', name: 'Roof hem shock cord', purchase: cordYards * price('cord'), units: cordYards, unit: 'yards' },
    { id: 'dring', name: 'Four stainless D-rings', purchase: quantity * cover.dRings * price('dring'), units: quantity * cover.dRings, unit: 'each' },
    { id: 'webbing', name: 'Tether, grab loop, ties and wrist strap', purchase: quantity === 1 ? webFeet * price('webbing') : webRolls * 7741, units: quantity === 1 ? webFeet : webRolls, unit: quantity === 1 ? 'feet' : '120-foot rolls' },
    { id: 'thread', name: 'Thread allowance', purchase: cones * price('thread'), units: cones, unit: 'cones' },
  ].map(row => ({ ...row, allocation: Math.ceil(row.purchase / quantity) }))
  const materials = rows.reduce((n, row) => n + row.allocation, 0); const rejects = Math.ceil(materials * 0.1); const labor = Math.ceil(minutes * hourlyCents / 60); const freight = quantity === 1 ? 6500 : 900
  return { quantity, minutes, hourlyCents, rows, materials, rejects, labor, freight, total: materials + rejects + labor + freight, status: 'LISTED_CANDIDATES_WITH_UNQUOTED_PRODUCTION_ASSUMPTIONS' }
}

/** One overview sheet of every blank at 1:10. Cut from the schedule dimensions, not by scaling this sheet. */
export function roverCoverSvg(s: RoverSetup): string {
  const cover = roverCover(s); const scale = 0.1; let x = 10; let y = 22; let row = 0; const body: string[] = []
  const fill = { shell: '#dfe6e1', mesh: '#f3f0e4', clear: '#e3eef5', liner: '#d9d9d9', roofLiner: '#f1e9d2', pad: '#e8e2ec' }
  for (const p of cover.pieces) {
    const w = p.length * scale; const hgt = p.width * scale
    if (x + w > 400) { x = 10; y += row + 22; row = 0 }
    body.push(`<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${hgt.toFixed(1)}" fill="${fill[p.material]}" stroke="#111" stroke-width=".4"/><text x="${(x + 2).toFixed(1)}" y="${(y + 6).toFixed(1)}" font-size="4.2" font-weight="600">${p.id} x${p.qty}</text><text x="${(x + 2).toFixed(1)}" y="${(y + 11.5).toFixed(1)}" font-size="3.6">${p.length} x ${p.width}</text><text x="${x.toFixed(1)}" y="${(y + hgt + 5).toFixed(1)}" font-size="3.6">${p.name}</text>`)
    x += w + 8; row = Math.max(row, hgt)
  }
  const height = y + row + 24
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 410 ${height.toFixed(0)}" width="820" height="${(height * 2).toFixed(0)}" font-family="Arial, sans-serif"><rect width="100%" height="100%" fill="#fff"/><text x="10" y="9" font-size="5.5" font-weight="700">Buddy Rover r0 cover blanks, 1:10 overview, mm</text><text x="10" y="15" font-size="3.6">15 mm seam allowance included. Bench pattern, not an animal-use release. Cut from the schedule dimensions.</text>${body.join('')}<path d="M10 ${(height - 8).toFixed(1)}h50m-50 -2v4m50 -4v4" stroke="#111" stroke-width=".4" fill="none"/><text x="64" y="${(height - 6.5).toFixed(1)}" font-size="3.6">500 mm at this scale</text></svg>\n`
}
