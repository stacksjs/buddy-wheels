import { expect, test } from 'bun:test'
import { cp, mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { transformModelPoint } from '@stacksjs/browser/model-viewer'
import { nestRoverStock, packRoverStock, parseRoverSetup, referenceCarrier, roverActivities, roverDimensions, roverParcelStock, roverParts, roverPartFile, roverQuery, roverStart, roverWheels } from '../../app/Designs/Rover'
import { inspectRoverGeometry, roverGeometry, roverPrintVolumeCm3, roverPublicPath, sha256 } from '../../app/Designs/RoverBuild'
import { roverCostLines, roverEconomics } from '../../app/Designs/RoverCost'
import { roverBom, roverDocuments, roverDrilling, roverPrintQuantities } from '../../app/Designs/RoverDocuments'
import { roverDownload } from '../../app/Designs/RoverDownloads'
import { metalProfile } from '../../app/Designs/RoverParts'
import { roverScene } from '../../app/Designs/RoverScene'
import { roverCover, roverMaterials, roverTextileCost } from '../../app/Designs/RoverSoftGoods'
import { circle, rect, signedArea, stack, triangulate } from '../../app/Designs/Solid'
import { designRoot } from '../../app/Designs/Wheelchair'

test('native solid kit keeps area, rejects crossing outlines and bridges aligned holes', () => {
  const ring = triangulate(circle(40), [circle(28)])
  expect(ring.reduce((sum, t) => sum + signedArea(t), 0)).toBeCloseTo(signedArea(circle(40)) - signedArea(circle(28)), 6)
  expect(triangulate(rect(110, 36), [rect(100, 4, 0, -15), rect(4, 20, -52, 3), circle(3.3, 30), circle(3.3, 0), circle(3.3, -30)]).length).toBeGreaterThan(60)
  expect(() => stack([{ height: 4, regions: [{ outer: rect(20, 20) }] }, { height: 4, regions: [{ outer: rect(30, 10) }] }])).toThrow('cross')
})

test('Rover setup accepts cut-to-fit sizes, rejects unknown or unsafe combinations, and always gives a walk-in incline', () => {
  expect(parseRoverSetup({})).toEqual(roverStart)
  expect(parseRoverSetup(Object.fromEntries(new URLSearchParams(roverQuery(roverStart))))).toEqual(roverStart)
  for (const invalid of [{ length: 999 }, { width: 705 }, { height: '' }, { ramp: [900] }, { hub: 75.01 }, { length: Infinity }, { capacity: 160 }, { wheel: 'big' }, { hub: 50 }, { front: 'tank' }, { caster: 249 }, { caster: 311.5 }, { rake: 50 }, { rake: 510 }, { kit: 'sled' }, { rake: 500, length: 1000, axle: 400 }, { __proto__: null, loadRated: true }, { ramp: 1000, height: 900 }, { axle: 650, length: 1000 }, { handle: 1100, height: 800 }]) expect(() => parseRoverSetup(invalid)).toThrow()
  for (const length of [1000, 1400]) for (const width of [600, 800]) for (const height of [800, 1100]) for (const ramp of [700, 800]) {
    const d = roverDimensions(parseRoverSetup({ length, width, height, ramp, axle: 400, handle: 800 }))
    expect(d.rampAngle).toBeLessThan(12)
    expect(d.rampAngle).toBeGreaterThan(5)
    expect(d.legCut).toBeGreaterThan(65)
    expect(d.clearance).toBeGreaterThan(100)
    expect(d.centerAhead).toBeGreaterThanOrEqual(40)
    expect(Math.max(...d.stations.slice(1).map((x, i) => x - d.stations[i]!))).toBeLessThanOrEqual(400.001)
    expect(d.stations.every(x => Math.abs(x) >= 95)).toBe(true)
  }
  const d = roverDimensions(roverStart)
  expect(d.deck).toBe(151.9)
  expect(d.rampAngle).toBeCloseTo(8.04, 2)
  expect(d.deck).toBeLessThan(referenceCarrier.stepUpMm)
  expect(d.volumeRatio).toBeGreaterThan(2.2)
  for (const [i, n] of [roverStart.length, roverStart.width, roverStart.height].entries()) expect(n).toBeGreaterThan(referenceCarrier.interior[i]! * 1.2)
  expect(d.rearShaft - d.rearStack).toBeCloseTo(19.7, 8)
  expect(d.frontShaft - d.frontStack).toBeCloseTo(19.7, 8)
  expect(d.tireGap).toBeGreaterThan(10)
  for (const [wheel, hub, hanger] of [['run', 75, 'axle_hanger'], ['path', 82.55, 'axle_hanger_low']] as const) {
    const other = roverDimensions(parseRoverSetup({ wheel, hub }))
    expect(other.deck).toBe(d.deck)
    expect(other.rampAngle).toBe(d.rampAngle)
    expect(other.wheel.hanger).toBe(hanger)
    expect(other.tireGap).toBeGreaterThan(10)
  }
  expect(d.wheel.hanger).toBe('axle_hanger_mid')
  expect(d.swivel).toBe(true)
  expect(roverStart.caster).toBe(310)
  expect(d.nosePost).toBeCloseTo(roverStart.caster - 124 - 12.7, 6)
  expect(d.casterX - 185).toBeGreaterThan(d.frontX + 25.4 + 15)
  const fixed = roverDimensions(parseRoverSetup({ front: 'fixed' }))
  expect(fixed.rail).toBe(d.floorLen)
  expect(d.topRail).toBe(d.floorLen - roverStart.rake)
  expect(d.windshield).toBeCloseTo(Math.hypot(roverStart.rake, d.post + 25.4), 3)
  const box = roverDimensions(parseRoverSetup({ rake: 0 }))
  expect(box.topRail).toBe(box.floorLen)
  expect(box.frontPostX).toBe(box.frontX + 12.7)
  expect(fixed.counts).toMatchObject({ corner: 32, hanger: 8, wheels: 3 })
  expect(d.counts).toMatchObject({ corner: 44, hanger: 4, wheels: 2, casterBolts: 4, brakeClamps: 2 })
  expect(d.brakeZ).toBeGreaterThan(2 * d.R + 150)
  expect(d.brakeZ + 90).toBeLessThan(roverStart.handle)
})

test('every exported Rover mesh is a closed single printable body and metal copies match their profiles', () => {
  const meshes = inspectRoverGeometry()
  expect(meshes.length).toBe(17)
  expect(meshes.map(m => m.file).sort()).toEqual(roverParts.map(p => 'parts/' + roverPartFile(p.id)).sort())
  for (const id of ['tee_gusset', 'corner_gusset', 'brake_plate', 'axle_hanger', 'axle_hanger_mid', 'axle_hanger_low'] as const) {
    const profile = metalProfile(id); const area = Math.abs(signedArea(profile.outer)) - profile.holes!.reduce((sum, hole) => sum + Math.abs(signedArea(hole)), 0)
    expect(meshes.find(m => m.file.endsWith(id + '.stl'))!.inspection.signedVolumeMm3).toBeCloseTo(area * 3.175, 0)
    expect(roverGeometry()[`metal/${id}.dxf`]).toContain('POLYLINE')
  }
  expect(metalProfile('corner_gusset').holes!.length).toBe(4)
  expect(metalProfile('axle_hanger').holes!.length).toBe(6)
  expect(metalProfile('axle_hanger_low').holes!.length).toBe(5)
  expect(roverPrintVolumeCm3()).toBeGreaterThan(1200)
})

test('Rover scene shares cut-list datums, counts every gusset in the parts list and moves the ramp', () => {
  const s = parseRoverSetup({ length: 1300, width: 760, height: 1000, ramp: 1000, axle: 560 }); const d = roverDimensions(s)
  const scene = roverScene(s); const node = (id: string) => scene.nodes.find(n => n.id === id)!
  expect(transformModelPoint([0, 0, 0], node('base-rail-1').transform!).map(n => Math.round(n * 1000) / 1000)).toEqual([-585.4, 392.7, 124])
  const count = (file: string) => scene.nodes.filter(n => n.geometry.kind === 'stl' && n.geometry.src.includes(file)).length
  expect(count('corner_gusset')).toBe(d.counts.corner)
  expect(count('brake_plate')).toBe(2)
  expect(scene.nodes.filter(n => n.id.startsWith('brake-arm-') && n.geometry.kind === 'tube').length).toBe(2)
  expect(count('tee_gusset')).toBe(d.counts.tee)
  expect(count('axle_hanger')).toBe(d.counts.hanger)
  expect(count('ramp_toe')).toBe(d.counts.toe)
  const tubes = scene.nodes.filter(n => n.geometry.kind === 'tube').reduce((sum, n) => sum + (n.geometry as { length: number }).length, 0)
  expect(tubes).toBeCloseTo(d.cuts.reduce((sum, c) => sum + c.qty * c.length, 0), 3)
  const toe = (down: boolean) => transformModelPoint([s.ramp / 2, 0, 0], roverScene(s, { rampDown: down }).nodes.find(n => n.id === 'ramp-panel')!.transform!)
  expect(toe(true)[2]).toBeLessThan(10)
  expect(toe(false)[2]).toBeCloseTo(d.deck + s.ramp, 3)
  expect(roverScene(s, { cover: true }).nodes.some(n => n.id === 'cover-roof-1')).toBe(true)
  expect(roverScene(s, { focus: 'ramp_toe' }).nodes[0]!.geometry).toMatchObject({ kind: 'stl', src: expect.stringContaining('ramp_toe.stl') })
  expect(scene.nodes.some(n => /spring|shock|motor/.test(n.id))).toBe(false)
  expect(scene.nodes.filter(n => n.id.startsWith('windshield-stay-')).length).toBe(2)
  expect(roverScene(parseRoverSetup({ rake: 0 })).nodes.some(n => n.id.startsWith('windshield-stay-'))).toBe(false)
  const snowSetup = parseRoverSetup({ kit: 'ski' }); const snow = roverScene(snowSetup); const snowDims = roverDimensions(snowSetup)
  expect(snow.nodes.filter(n => /^ski-(post|foot)-/.test(n.id)).length).toBe(4)
  expect(snow.nodes.some(n => /rear-wheel-|caster-tire/.test(n.id))).toBe(false)
  expect(snow.nodes.filter(n => n.geometry.kind === 'stl' && n.geometry.src.includes('tee_gusset')).length).toBe(snowDims.counts.tee)
  expect(snow.nodes.filter(n => n.geometry.kind === 'tube').reduce((sum, n) => sum + (n.geometry as { length: number }).length, 0)).toBeCloseTo(snowDims.cuts.reduce((sum, c) => sum + c.qty * c.length, 0), 3)
  for (const key of Object.keys(roverActivities) as (keyof typeof roverActivities)[]) expect(() => parseRoverSetup({ wheel: roverActivities[key].wheel, front: roverActivities[key].front, kit: roverActivities[key].kit, hub: roverWheels[roverActivities[key].wheel].hub })).not.toThrow()
})

test('Rover cost study charges whole stock, every parts-list line and paid labor, and reports the price gap honestly', () => {
  expect(packRoverStock(roverStart, 'heavy', 1).bars).toBe(2)
  expect(packRoverStock(roverStart, 'light', 1).bars).toBe(3)
  for (const q of [0, 0.5, Infinity, 1001]) expect(() => packRoverStock(roverStart, 'light', q)).toThrow()
  const base = roverEconomics(); const one = roverEconomics(roverStart, 1)
  expect(base.cogs).toBe(151819)
  expect(one.cogs).toBe(276985)
  expect(base.cogsMill).toBe(131814)
  expect(roverEconomics(parseRoverSetup({ wheel: 'run', hub: 75 })).cogs).toBe(157122)
  expect(roverEconomics(parseRoverSetup({ wheel: 'path', hub: 82.55 })).cogs).toBe(148211)
  expect(roverEconomics(parseRoverSetup({ front: 'fixed' })).cogs).toBe(145386)
  expect(roverEconomics(parseRoverSetup({ kit: 'ski' })).cogs).toBe(173103)
  expect(roverEconomics(parseRoverSetup({ rake: 0 })).cogs).toBe(154635)
  expect(one.heavy.bars).toBe(5)
  expect(one.light.bars).toBe(7)
  expect(base.cogsMill).toBe(base.cogs - base.tube + base.tubeMill)
  expect(base.stainlessUpgrade).toBe(4002)
  expect(base.retail).toBe(99900)
  expect(base.maxCogs).toBe(69930)
  expect(base.gross).toBeLessThan(0)
  expect(base.meetsCostGate).toBe(false)
  expect(base.retailForGate).toBe(216900)
  expect(base.retailForGateMill).toBe(188400)
  expect(base.contribution).toBeLessThan(0)
  expect(() => roverEconomics(roverStart, 2)).toThrow()
  const coverage = roverCostLines().flatMap(line => line.coverage)
  expect(coverage.length).toBe(new Set(coverage).size)
  const ids = roverBom(roverStart).trim().split('\n').slice(1).map(row => row.split('","')[0]!.replace('"', ''))
  for (const id of ids.filter(id => !/^[CT]\d/.test(id))) expect(coverage).toContain(id)
  expect(ids.filter(id => /^C\d/.test(id)).length).toBe(15)
  for (const id of ['W07', 'M04', 'B03', 'B04']) expect(ids).toContain(id)
  expect(ids).not.toContain('W03')
  const textiles = roverTextileCost(roverStart, 100)
  expect(textiles.rows.map(r => r.id).sort()).toEqual(roverMaterials.map(m => m.id).sort())
  expect(textiles.labor).toBe(10000)
  expect(textiles.rows.find(r => r.id === 'wall')!.purchase).toBe(textiles.rows.find(r => r.id === 'wall')!.units * 442)
  expect(roverTextileCost(roverStart, 1).rows.find(r => r.id === 'wall')!.purchase % 650).toBe(0)
  expect(roverTextileCost(roverStart, 1).total).toBeGreaterThan(textiles.total)
  const cover = roverCover(roverStart)
  expect(cover.pieces.find(p => p.id === 'P01')!.qty).toBe(1)
  expect(cover.windowH).toBeGreaterThan(400)
  expect(roverPrintVolumeCm3() * 0.5 * 1.27 / 1000 * 2500).toBeLessThan(roverCostLines().find(l => l.id === 'prints')!.batch)
})

test('Rover drilling schedule and stock nesting stay inside every cut piece and account for every tube', () => {
  for (const setup of [roverStart, parseRoverSetup({ front: 'fixed' }), parseRoverSetup({ kit: 'ski' }), parseRoverSetup({ kit: 'ski', front: 'fixed', rake: 0 }), parseRoverSetup({ rake: 100, length: 1000, axle: 300 }), parseRoverSetup({ length: 1400, width: 800, height: 1100, ramp: 1100, axle: 600, handle: 1000, wheel: 'path', hub: 82.55, caster: 330 })]) {
    const d = roverDimensions(setup); const rows = roverDrilling(setup)
    for (const row of rows) {
      const cut = d.cuts.find(c => c.id === row.id)!
      expect(cut, row.id).toBeDefined()
      if (row.from !== 'the middle') for (const center of row.centers) { expect(center, row.member).toBeGreaterThan(8); expect(center, row.member).toBeLessThan(cut.length - 8) }
    }
    const rail = rows.filter(r => r.id === 'C01'); const side = rail.filter(r => r.axis === 'side').flatMap(r => r.centers); const vertical = rail.filter(r => r.axis === 'vertical').flatMap(r => r.centers)
    for (const a of side) for (const b of vertical) expect(Math.abs(a - b), `rail holes ${a} and ${b}`).toBeGreaterThanOrEqual(14.9)
    for (const wall of ['heavy', 'light'] as const) {
      const bars = nestRoverStock(setup, wall, 1, roverParcelStock.mm); const pieces = bars.flatMap(b => b.pieces)
      expect(pieces.length).toBe(d.cuts.filter(c => c.wall === wall).reduce((n, c) => n + c.qty, 0))
      for (const bar of bars) expect(bar.pieces.reduce((n, p) => n + p.length + 3, 0) + bar.offcut).toBeCloseTo(roverParcelStock.mm, 3)
    }
  }
})

test('Rover documents carry no em-dashes, no capacity claim and the configured numbers', () => {
  const s = parseRoverSetup({ length: 1300, ramp: 800, height: 900, handle: 900 }); const docs = roverDocuments(s)
  for (const [name, text] of Object.entries(docs)) expect(/[–—]/.test(text), name).toBe(false)
  expect(docs['assembly.md']).toContain('| Ramp length and width | 800 x 688 |')
  expect(docs['assembly.md']).toContain('NOT FOR ANIMAL USE')
  expect(docs['assembly.md']).toContain('none. Untested bench design')
  expect(JSON.parse(docs['setup.json']!)).toMatchObject({ length: 1300, fitted: false, loadRated: false })
  expect(docs['drawing.svg']).toContain('ramp 800')
  expect(docs['materials.md']).toContain('no hydrostatic head or UPF number')
  expect(Object.values(roverPrintQuantities(s)).every(n => Number.isInteger(n) && n >= 0)).toBe(true)
  expect(roverPrintQuantities(s)).toMatchObject({ axle_hanger_mid: 4, axle_hanger_low: 0, axle_hanger: 0, brake_plate: 2 })
  expect(docs['buy-list.md']).toContain('Materials to buy')
  expect(docs['buy-list.md']).toContain('zoro.com')
  expect(docs['build-guide.md']).toContain('How the aluminum base gets its shape')
  expect(docs['build-guide.md']).toContain('sendcutsend.com')
  expect(docs['build-guide.md']).toContain('Parking brake')
  expect(docs['build-guide.md']).toContain('SCC-100S3504-PNB-BSL')
  expect(docs['build-guide.md']).toContain('app.oshcut.com')
  expect(docs['build-guide.md']).not.toContain('threaded insert')
  expect(docs['bom.csv']).toContain('DE-STA-CO 507208')
  expect(docs['bom.csv']).toContain('Windshield stay')
  const snowDocs = roverDocuments(parseRoverSetup({ kit: 'ski' }))
  expect(snowDocs['bom.csv']).toContain('"K01","2","Ski"')
  expect(snowDocs['build-guide.md']).toContain('## Snow conversion')
  expect(docs['build-guide.md']).not.toContain('## Snow conversion')
  expect(docs['base-plan.svg']).toContain('C01 base side rail')
  expect(roverDocuments(parseRoverSetup({ wheel: 'run', hub: 75 }))['bom.csv']).toContain('metal/axle_hanger.dxf')
})

test('Rover configured kit matches published geometry and rejects stale or tampered assets', async () => {
  const s = parseRoverSetup({ length: 1300, width: 760, ramp: 900 })
  const response = await roverDownload(designRoot, 'kit', s)
  const files = await new Bun.Archive(await response.arrayBuffer()).files()
  expect(response.headers.get('Content-Disposition')).toContain('rover-r0-l1300-w760')
  expect([...files.keys()].filter(f => f.endsWith('.stl')).length).toBe(17)
  expect([...files.keys()].filter(f => f.endsWith('.dxf')).length).toBe(6)
  expect(JSON.parse(await files.get('setup.json')!.text()).wheel).toBe('trail')
  expect(files.has('buy-list.md')).toBe(true)
  expect(JSON.parse(await files.get('cost-model.json')!.text()).base.cogs).toBe(roverEconomics(s).cogs)
  const hashes = JSON.parse(await files.get('checksums.json')!.text())
  for (const f of hashes.files) expect(sha256(await files.get(f.file)!.arrayBuffer())).toBe(f.sha256)
  for (const [path, data] of Object.entries(roverGeometry())) expect(sha256(await files.get(path)!.arrayBuffer())).toBe(sha256(data))
  expect((await roverDownload(designRoot, 'unknown', s)).status).toBe(404)
  expect(await (await roverDownload(designRoot, 'cuts', s)).text()).toContain('"C01","2","Base side rail"')
  const temp = await mkdtemp(join(tmpdir(), 'buddy-rover-'))
  try {
    await cp(join(designRoot, roverPublicPath), join(temp, roverPublicPath), { recursive: true })
    const path = join(temp, roverPublicPath, 'manifest.json'); const manifest = await Bun.file(path).json()
    await Bun.write(path, JSON.stringify({ ...manifest, assets: manifest.assets.filter((a: { path: string }) => a.path !== 'parts/ramp_toe.stl') }))
    await expect(roverDownload(temp, 'kit', s)).rejects.toThrow('Incomplete')
    await Bun.write(path, JSON.stringify({ ...manifest, assets: manifest.assets.map((a: { path: string, sha256: string }) => a.path === 'parts/ramp_toe.stl' ? { ...a, sha256: 'old' } : a) }))
    await expect(roverDownload(temp, 'kit', s)).rejects.toThrow('Stale')
    await Bun.write(path, JSON.stringify(manifest))
    await Bun.write(join(temp, roverPublicPath, 'parts/cap_heavy.stl'), 'tampered')
    await expect(roverDownload(temp, 'kit', s)).rejects.toThrow('checksum')
  }
  finally { await rm(temp, { recursive: true, force: true }) }
})
