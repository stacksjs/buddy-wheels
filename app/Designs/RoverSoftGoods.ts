import type { RoverSetup } from './Rover'
import { roverDimensions, roverHardware as h } from './Rover'
import { rectanglePurchase } from './TextilePurchases'

export const roverTextileDate = '2026-11-11'
/**
 * Weather system candidates. Prices and quoted performance words were read on each supplier page on the date above
 * (the wall fabric on 2026-11-12), except the three rows marked 2026-11-08, which reuse the wheelchair textile research. None is a quote or an approval.
 */
export const roverMaterials = [
  { id: 'roof', layer: 'Roof shell', name: 'Rockywoods solution-dyed 600 denier polyester, polyurethane coated, 58-SD600PC-Black', url: 'https://www.rockywoods.com/products/solution-dyed-600-denier-polyester-with-urethane-water-repellant-coating_2', cents: 1528, unit: '59-inch-wide linear yard', guards: 'Rain, sun', facts: 'Supplier words: solution dyed, polyurethane coating, 8 oz per square yard, "excellent UV resistance". Solution dyeing holds color in sun.', caveat: 'The page gives no hydrostatic head or UPF number. Both must be measured on the sewn, seam-taped roof. Black only, which runs hotter in sun than a light roof.' },
  { id: 'wall', layer: 'Wall shell', name: 'OWF polyester 600 denier charcoal, POLY6CHAR', url: 'https://www.owfinc.com/p/productinfo/POLY6CHAR/', cents: 650, unit: '58-inch-wide linear yard; $5.07 at 20 yards, $4.42 at 50', guards: 'Wind, splash, sun', facts: 'Supplier words: 12 oz 600x300 denier polyester, import, PVC coated, "holds up better if subjected to direct sunlight or constant water" than nylon.', caveat: 'Not solution dyed, so expect fading. No waterproof, UV or cold rating on the page. Walls sit under the roof overhang; the roof keeps the better fabric.' },
  { id: 'mesh', layer: 'Window mesh', name: 'Sailrite Phifertex Standard White 54 inch, 393111', url: 'https://www.sailrite.com/Phifertex-Mesh-White-000-54', cents: 1795, unit: '54-inch-wide linear yard', guards: 'Sun, airflow, claws', facts: 'Supplier words: vinyl-coated polyester mesh, "Shade Factor 70%", 11.3 oz per square yard.', caveat: 'Claw, chew and push-out resistance are not stated for a 140 lb dog. Mesh is not a restraint.' },
  { id: 'clear', layer: 'Roll-down storm panels', name: 'Sailrite Plastipane 20 gauge clear vinyl 54 inch, 283201', url: 'https://www.sailrite.com/Plastipane-20-Gauge-Vinyl-Window-Material-54', cents: 8935, unit: '10-yard roll, 54 inch wide', guards: 'Rain, wind', facts: 'Supplier words: 0.020 inch, "Cold Crack Rating -20 F". One-yard rolls are $9.25 but too short for a side panel. A 60-yard roll is $444.00.', caveat: 'Closed storm panels stop airflow. Heat build-up limits must be set by test before any enclosed use.' },
  { id: 'liner', layer: 'Floor tub liner', name: 'OWF 18 oz vinyl coated polyester black, VIN18BLK', url: 'https://www.owfinc.com/p/productinfo/VIN18BLK/', cents: 996, unit: '61-inch-wide linear yard', guards: 'Wet paws, sand, accidents', facts: 'Supplier words: 18 oz (20 mil), 61 inch, heat sealable. $7.77 per yard at 20 yards or more.', caveat: 'Import, black only by the yard. Slip, chew and cleaning-chemical behavior are untested.' },
  { id: 'pad', layer: 'Floor comfort pad', name: 'Avetco E600 5 mm EVA, SP60A.5MM.BLACK.39X51', url: 'https://www.avetcoinc.com/product/e600-high-density-eva-foam-sheets-60-65-shore-c-39-x-51-5mm-10mm/?attribute_thickness=5+mm', cents: 3150, unit: '39 x 51 inch sheet, 5 mm', guards: 'Comfort, insulation from a cold floor', facts: 'Checked 2026-11-08: firm 60-65 Shore C closed-cell EVA, in stock, minimum one sheet.', caveat: 'Pressure relief for a recumbent senior dog is unqualified. An orthopedic pad may be needed on top.' },
  { id: 'traction', layer: 'Ramp traction surface', name: 'Sailrite Nonslip Foam Flooring Gray 27 x 94 inch adhesive-backed, 123492', url: 'https://www.sailrite.com/Marine-Foam-Flooring-Gray-27-x-94-Adhesive-Backed', cents: 9095, unit: '27 x 94 inch sheet, 5 mm', guards: 'Wet paws on the incline', facts: 'Supplier words: 100% EVA foam, 5 mm, diamond pattern, adhesive backed.', caveat: 'No wet-grip or claw-wear data. Grip on a wet 9 degree incline has to be tested with the intended dog size.' },
  { id: 'seam', layer: 'Roof seam tape', name: 'Rockywoods MELCO seam tape for 2-layer fabrics, 31-MELCO-FU700-Clear', url: 'https://www.rockywoods.com/products/melco-seam-sealing-tape-for-2-layer-fabrics', cents: 289, unit: 'meter, 20 mm wide', guards: 'Rain at needle holes', facts: 'Supplier words: for polyurethane coated fabric seams, flow temperature 110 C.', caveat: 'Adhesion to this roof fabric and to the PVC-coated wall fabric must be proven on an offcut, or the tape replaced with a compatible sealer.' },
  { id: 'reflective', layer: 'Reflective trim', name: 'Sailrite sew-on reflective tape 1 inch yellow, 123218', url: 'https://www.sailrite.com/Sew-On-Reflective-Tape-1-Yellow-2.2-Yds', cents: 295, unit: '2.2-yard pack', guards: 'Low light', facts: 'Sew-on, 1 inch.', caveat: 'No reflectivity rating on the page. Not a substitute for lights.' },
  { id: 'hook', layer: 'Hook tape, 2 inch', name: 'Quest Outfitters hook and loop 2 inch, hook 2106', url: 'https://questoutfitters.com/products/hook-and-loop', cents: 158, unit: 'yard', guards: 'Storm panel edges, cover tabs', facts: 'Sold by the yard. Loop 2107 is the same price and bought separately.', caveat: 'The page does not state the material. Hook and loop clogs with sand and fur and is never a restraint.' },
  { id: 'loop', layer: 'Loop tape, 2 inch', name: 'Quest Outfitters hook and loop 2 inch, loop 2107', url: 'https://questoutfitters.com/products/hook-and-loop', cents: 158, unit: 'yard', guards: 'Storm panel edges, cover tabs', facts: 'Sold by the yard.', caveat: 'Confirm hook and loop are matched widths at checkout.' },
  { id: 'cord', layer: 'Roof hem shock cord', name: 'Quest Outfitters shock cord 3/16 inch, 2403', url: 'https://questoutfitters.com/products/shock-cord', cents: 104, unit: 'yard', guards: 'Keeps the roof taut so water runs off', facts: '3/16 inch.', caveat: 'UV life of the cord is not stated.' },
  { id: 'dring', layer: 'Tether rings', name: 'Sailrite D-ring 1 inch stainless 316, 122757', url: 'https://www.sailrite.com/D-Ring-Without-Bar-0-1-Stainless-Steel', cents: 155, unit: 'each', guards: 'Salt', facts: 'Supplier states a 270 lb working load limit for the ring alone.', caveat: 'A ring rating does not rate the sewn tether, its anchor or the frame. No restraint claim.' },
  { id: 'webbing', layer: 'Tether, grab and tie webbing', name: 'Strapworks 1 inch polyester webbing, WSR-POL-PUT-001-BLK', url: 'https://www.strapworks.com/1-inch-utility-polyester-webbing-black', cents: 74, unit: 'foot; $77.41 per 120-foot roll', guards: 'Low stretch when wet', facts: 'Checked 2026-11-08, listed in stock.', caveat: 'Sewn strength is unqualified.' },
  { id: 'thread', layer: 'Thread', name: 'Sailrite PremoBond Tex 90 UV bonded polyester, 123338', url: 'https://www.sailrite.com/PremoBond-V-92-Black-UV-Bonded-Polyester-Thread-4-Oz-1-350-Yds', cents: 1595, unit: '4 oz cone, 987.552 m', guards: 'Sun', facts: 'Checked 2026-11-08. Supplier describes UV protection and a non-wicking finish.', caveat: '160 m per cover is an unmeasured allowance.' },
] as const
export const roverMaterialAlternates = [
  'Premium shell for every panel: Sailrite Top Gun Charcoal 62 inch, 120396, $23.95 per yard, acrylic-coated 600 denier polyester, supplier words "Highly UV Resistant" and "Highly Water Resistant". The first cost count used it everywhere; it added about $85 per carrier at 100 units.',
  'Optional sun layer: eQuilter Insul-Bright 45 inch, WABATISB, $9.25 per yard, quilted under the roof. Left out of the base cover; about $13 per carrier. The supplier says it is not heat-proof or fire-resistant.',
  'Optional zippers on the storm panels: Sailrite YKK #10 molded-tooth chain 100030 at $6.00 per 5 feet and sliders 100033 at $11.25 per 5. The base cover uses hook and loop instead; zippers added about $32 per carrier.',
  'Mesh alternate for more shade: Sailrite Phifertex Plus White 54 inch, 235811, $25.95 per yard, "Shade Factor 92.50%". It leaves about 7.5% open area, so airflow drops sharply.',
  'Liner alternate: Sailrite Shelter-Rite 18 oz grey 61 inch, 112015, $23.95 per yard, supplier word "Waterproof".',
  'Clear panel alternate for colder routes: Sailrite Regalite 30 gauge 54 x 110 inch, 103762, supplier words "Cold Crack Rating -30 F". Its price was not captured.',
  'Not found: a hydrostatic head or UPF figure on any shell page, a by-the-yard clear TPU film price, and Seattle Fabrics pages (blocked).',
] as const

export interface CoverPiece { id: string, name: string, material: 'roof' | 'wall' | 'mesh' | 'clear' | 'liner' | 'pad', qty: number, width: number, length: number, note: string }
/** Rectangular cut blanks, 15 mm seam allowance on every sewn edge already included. */
export function roverCover(s: RoverSetup) {
  const d = roverDimensions(s); const t = h.tube
  const coverH = s.height + h.panel + h.bedding + 2 * t; const sill = 350; const windowH = coverH - sill - 110; const frontWindow = d.windshield - sill - 110; const headerH = Math.max(150, coverH - s.ramp)
  const r = Math.ceil
  const pieces: CoverPiece[] = [
    { id: 'P01', name: 'Roof, one piece over the ridge', material: 'roof', qty: 1, width: r(2 * d.roofSlope + 120), length: r(d.topRail + 80), note: 'No seam on top. 40 mm drip overhang front and rear, 60 mm side skirts with a shock-cord hem.' },
    { id: 'P02', name: 'Side wall', material: 'wall', qty: 2, width: r(coverH + 30), length: r(d.floorLen + 30), note: `${s.rake > 0 ? `Cut the front edge on the slope from the base front corner to ${s.rake} back at the top. ` : ''}Window opening ${r(d.topRail - 160)} x ${r(windowH)} starts ${sill} mm above the base rail.` },
    { id: 'P03', name: s.rake > 0 ? 'Raked front wall' : 'Front wall', material: 'wall', qty: 1, width: r(d.windshield + 30), length: r(s.width + 2 * t + 30), note: `Window opening ${r(s.width - 60)} x ${r(frontWindow)}.${s.rake > 0 ? ' A stay sleeve runs down each side edge.' : ''}` },
    { id: 'P04', name: 'Rear header above the tailgate', material: 'wall', qty: 1, width: r(headerH + 60), length: r(s.width + 2 * t + 30), note: 'Overlaps the raised ramp by 30 mm so rain runs outside it.' },
    { id: 'P05', name: 'Tailgate wind gusset', material: 'wall', qty: 2, width: 200, length: r(s.ramp + 30), note: 'Closes the gap between the raised ramp edge and each rear post.' },
    { id: 'M01', name: 'Side window mesh', material: 'mesh', qty: 2, width: r(windowH + 30), length: r(d.topRail - 130), note: 'Sewn inside the wall opening.' },
    { id: 'M02', name: 'Front window mesh', material: 'mesh', qty: 1, width: r(frontWindow + 30), length: r(s.width - 30), note: 'Sewn inside the wall opening.' },
    { id: 'M03', name: 'Rear header mesh', material: 'mesh', qty: 1, width: r(headerH - 30), length: r(s.width - 30), note: 'High vent that stays open under the roof overhang.' },
    { id: 'V01', name: 'Side storm panel', material: 'clear', qty: 2, width: r(windowH + 60), length: r(d.topRail - 100), note: 'Rolls up and ties under the roof skirt. Hook and loop down both sides and along the sill.' },
    { id: 'V02', name: 'Front storm panel', material: 'clear', qty: 1, width: r(frontWindow + 60), length: r(s.width), note: 'Wind block for running and winter.' },
    { id: 'L01', name: 'Floor tub liner', material: 'liner', qty: 1, width: r(s.width + 160), length: r(s.length + 160), note: '80 mm upturned walls, corners folded not cut, so liquid stays in the tub.' },
    { id: 'L02', name: 'Threshold flap', material: 'liner', qty: 1, width: 200, length: r(d.rampWidth), note: 'Covers the hinge gap between floor and ramp.' },
    { id: 'F01', name: 'Floor pad half', material: 'pad', qty: 2, width: s.width, length: r(s.length / 2), note: 'Two halves butt at mid length, under the liner.' },
  ]
  const lengths = {
    hookLoop: r(6 * (windowH + 60) + 2 * (d.topRail - 100) + s.width + 24 * 120),
    seamTape: r(2 * d.topRail + 2 * (s.width + 2 * t)),
    reflective: r(2 * d.topRail + 2 * (s.width + 2 * t)),
    cord: r(2 * (d.topRail + 80) + 2 * (2 * d.roofSlope + 120)),
    webbing: 2 * 900 + 400 + 8 * 300 + 1200,
  }
  return { coverH: r(coverH), sill, windowH: r(windowH), headerH: r(headerH), pieces, lengths, dRings: 4, tractionWalk: { width: d.rampWidth - 2 * t, length: s.ramp } }
}

const price = (id: typeof roverMaterials[number]['id']) => roverMaterials.find(m => m.id === id)!.cents
/** Cheapest listed price tier the purchase actually reaches. Tiers are [minimum units, cents per unit]. */
const tiered = (units: number, tiers: [number, number][]) => units * tiers.filter(([min]) => units >= min).at(-1)![1]
/** Whole purchasing units, nested blanks, listed quantity tiers only where reached, 10% reject reserve, paid sewing and freight. Unquoted. */
export function roverTextileCost(s: RoverSetup, quantity = 100, minutes = quantity === 1 ? 540 : 200, hourlyCents = 3000) {
  if (quantity !== 1 && quantity !== 100) throw new Error('Cost scenarios are one carrier or a 100-carrier batch.')
  const cover = roverCover(s)
  const blanks = (material: CoverPiece['material']) => Array.from({ length: quantity }, () => cover.pieces.filter(p => p.material === material).flatMap(p => Array.from({ length: p.qty }, () => ({ width: p.width, length: p.length })))).flat()
  const yard = 914.4; const yards = (mmLength: number) => Math.ceil(quantity * mmLength / yard)
  const roof = rectanglePurchase(blanks('roof'), 1498.6, yard, price('roof'))
  const wall = rectanglePurchase(blanks('wall'), 1473.2, yard, price('wall'))
  const mesh = rectanglePurchase(blanks('mesh'), 1371.6, yard, price('mesh'))
  const clearYards = rectanglePurchase(blanks('clear'), 1371.6, yard, 0).units
  const clearSixty = Math.floor(clearYards / 60); const clearTen = Math.ceil((clearYards - clearSixty * 60) / 10)
  const liner = rectanglePurchase(blanks('liner'), 1549.4, yard, price('liner'))
  const pad = rectanglePurchase(blanks('pad'), 990.6, 1295.4, price('pad'), 1295.4)
  const strips = Math.ceil(cover.tractionWalk.width / 685.8)
  const tractionSheets = Math.ceil(quantity * strips / Math.floor(2387.6 / cover.tractionWalk.length))
  const hookYards = yards(cover.lengths.hookLoop); const meters = Math.ceil(quantity * cover.lengths.seamTape / 1000)
  const reflectivePacks = Math.ceil(quantity * cover.lengths.reflective / 2011.68); const cordYards = yards(cover.lengths.cord)
  const webFeet = Math.ceil(quantity * cover.lengths.webbing / 304.8); const webRolls = Math.ceil(webFeet / 120)
  const cones = Math.ceil(quantity * 140000 / 987552)
  const rows = [
    { id: 'roof', name: 'Roof shell, one piece', purchase: roof.cents, units: roof.units, unit: 'whole linear yards' },
    { id: 'wall', name: 'Wall shell: sides, front, header and gussets', purchase: tiered(wall.units, [[0, 650], [20, 507], [50, 442]]), units: wall.units, unit: 'whole linear yards' },
    { id: 'mesh', name: 'Mesh: three windows and the rear vent', purchase: mesh.cents, units: mesh.units, unit: 'whole linear yards' },
    { id: 'clear', name: 'Clear storm panels', purchase: clearSixty * 44400 + clearTen * price('clear'), units: clearSixty * 60 + clearTen * 10, unit: 'yards, bought as 60-yard and 10-yard rolls' },
    { id: 'liner', name: 'Floor tub liner and threshold flap', purchase: tiered(liner.units, [[0, 996], [20, 777]]), units: liner.units, unit: 'whole linear yards' },
    { id: 'pad', name: 'Two floor pad halves', purchase: pad.cents, units: pad.units, unit: '39 x 51 inch sheets' },
    { id: 'traction', name: 'Ramp traction surface', purchase: tractionSheets * price('traction'), units: tractionSheets, unit: '27 x 94 inch sheets' },
    { id: 'hook', name: 'Hook tape', purchase: hookYards * price('hook'), units: hookYards, unit: 'yards' },
    { id: 'loop', name: 'Loop tape', purchase: hookYards * price('loop'), units: hookYards, unit: 'yards' },
    { id: 'seam', name: 'Roof seam tape', purchase: meters * price('seam'), units: meters, unit: 'meters' },
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
  const fill = { roof: '#cfd8d2', wall: '#dfe6e1', mesh: '#f3f0e4', clear: '#e3eef5', liner: '#d9d9d9', pad: '#e8e2ec' }
  for (const p of cover.pieces) {
    const w = p.length * scale; const hgt = p.width * scale
    if (x + w > 400) { x = 10; y += row + 22; row = 0 }
    body.push(`<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${hgt.toFixed(1)}" fill="${fill[p.material]}" stroke="#111" stroke-width=".4"/><text x="${(x + 2).toFixed(1)}" y="${(y + 6).toFixed(1)}" font-size="4.2" font-weight="600">${p.id} x${p.qty}</text><text x="${(x + 2).toFixed(1)}" y="${(y + 11.5).toFixed(1)}" font-size="3.6">${p.length} x ${p.width}</text><text x="${x.toFixed(1)}" y="${(y + hgt + 5).toFixed(1)}" font-size="3.6">${p.name}</text>`)
    x += w + 8; row = Math.max(row, hgt)
  }
  const height = y + row + 24
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 410 ${height.toFixed(0)}" width="820" height="${(height * 2).toFixed(0)}" font-family="Arial, sans-serif"><rect width="100%" height="100%" fill="#fff"/><text x="10" y="9" font-size="5.5" font-weight="700">Buddy Rover r0 cover blanks, 1:10 overview, mm</text><text x="10" y="15" font-size="3.6">15 mm seam allowance included. Bench pattern, not an animal-use release. Cut from the schedule dimensions.</text>${body.join('')}<path d="M10 ${(height - 8).toFixed(1)}h50m-50 -2v4m50 -4v4" stroke="#111" stroke-width=".4" fill="none"/><text x="64" y="${(height - 6.5).toFixed(1)}" font-size="3.6">500 mm at this scale</text></svg>\n`
}
