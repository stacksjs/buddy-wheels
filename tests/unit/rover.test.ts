import { expect, test } from 'bun:test'
import { cp, mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { transformModelPoint } from '@stacksjs/browser/model-viewer'
import { packRoverStock, parseRoverSetup, referenceCarrier, roverDimensions, roverParts, roverPartFile, roverQuery, roverStart } from '../../app/Designs/Rover'
import { inspectRoverGeometry, roverGeometry, roverPrintVolumeCm3, roverPublicPath, sha256 } from '../../app/Designs/RoverBuild'
import { roverCostLines, roverEconomics } from '../../app/Designs/RoverCost'
import { roverBom, roverDocuments, roverPrintQuantities } from '../../app/Designs/RoverDocuments'
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
  for (const invalid of [{ length: 999 }, { width: 705 }, { height: '' }, { ramp: [900] }, { hub: 75.01 }, { length: Infinity }, { capacity: 160 }, { __proto__: null, loadRated: true }, { ramp: 1000, height: 900 }, { axle: 650, length: 1000 }, { handle: 1100, height: 800 }]) expect(() => parseRoverSetup(invalid)).toThrow()
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
  expect(d.rampAngle).toBeCloseTo(8.94, 2)
  expect(d.deck).toBeLessThan(referenceCarrier.stepUpMm)
  expect(d.volumeRatio).toBeGreaterThan(1.9)
  for (const [i, n] of [roverStart.length, roverStart.width, roverStart.height].entries()) expect(n).toBeGreaterThan(referenceCarrier.interior[i]! * 1.2)
  expect(d.rearShaft - d.rearStack).toBeCloseTo(19.7, 8)
  expect(d.frontShaft - d.frontStack).toBeCloseTo(19.7, 8)
})

test('every exported Rover mesh is a closed single printable body and metal copies match their profiles', () => {
  const meshes = inspectRoverGeometry()
  expect(meshes.length).toBe(14)
  expect(meshes.map(m => m.file).sort()).toEqual(roverParts.map(p => 'parts/' + roverPartFile(p.id)).sort())
  for (const id of ['tee_gusset', 'corner_gusset', 'axle_hanger'] as const) {
    const profile = metalProfile(id); const area = Math.abs(signedArea(profile.outer)) - profile.holes!.reduce((sum, hole) => sum + Math.abs(signedArea(hole)), 0)
    expect(meshes.find(m => m.file.endsWith(id + '.stl'))!.inspection.signedVolumeMm3).toBeCloseTo(area * 3.175, 0)
    expect(roverGeometry()[`metal/${id}.dxf`]).toContain('POLYLINE')
  }
  expect(metalProfile('corner_gusset').holes!.length).toBe(4)
  expect(metalProfile('axle_hanger').holes!.length).toBe(6)
  expect(roverPrintVolumeCm3()).toBeGreaterThan(1200)
})

test('Rover scene shares cut-list datums, counts every gusset in the parts list and moves the ramp', () => {
  const s = parseRoverSetup({ length: 1300, width: 760, height: 1000, ramp: 1000, axle: 560 }); const d = roverDimensions(s)
  const scene = roverScene(s); const node = (id: string) => scene.nodes.find(n => n.id === id)!
  expect(transformModelPoint([0, 0, 0], node('base-rail-1').transform!)).toEqual([-585.4, 392.7, 124])
  const count = (file: string) => scene.nodes.filter(n => n.geometry.kind === 'stl' && n.geometry.src.includes(file)).length
  expect(count('corner_gusset')).toBe(d.counts.corner)
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
})

test('Rover cost study charges whole stock, every parts-list line and paid labor, and reports the price gap honestly', () => {
  expect(packRoverStock(roverStart, 'heavy', 1).bars).toBe(3)
  expect(packRoverStock(roverStart, 'light', 1).bars).toBe(5)
  for (const q of [0, 0.5, Infinity, 1001]) expect(() => packRoverStock(roverStart, 'light', q)).toThrow()
  const base = roverEconomics(); const one = roverEconomics(roverStart, 1)
  expect(base.cogs).toBe(166826)
  expect(one.cogs).toBe(280928)
  expect(base.cogsMill).toBe(129672)
  expect(base.cogsMill).toBe(base.cogs - base.tube + base.tubeMill)
  expect(base.stainlessUpgrade).toBe(5016)
  expect(base.retail).toBe(39900)
  expect(base.meetsCostGate).toBe(false)
  expect(base.retailForGate).toBe(238400)
  expect(base.retailForGateMill).toBe(185300)
  expect(base.contribution).toBeLessThan(0)
  expect(() => roverEconomics(roverStart, 2)).toThrow()
  const coverage = roverCostLines().flatMap(line => line.coverage)
  expect(coverage.length).toBe(new Set(coverage).size)
  const ids = roverBom(roverStart).trim().split('\n').slice(1).map(row => row.split('","')[0]!.replace('"', ''))
  for (const id of ids.filter(id => !/^[CT]\d/.test(id))) expect(coverage).toContain(id)
  expect(ids.filter(id => /^C\d/.test(id)).length).toBe(14)
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

test('Rover documents carry no em-dashes, no capacity claim and the configured numbers', () => {
  const s = parseRoverSetup({ length: 1300, ramp: 800, height: 900, handle: 900 }); const docs = roverDocuments(s)
  for (const [name, text] of Object.entries(docs)) expect(/[–—]/.test(text), name).toBe(false)
  expect(docs['assembly.md']).toContain('| Ramp length and width | 800 x 688 |')
  expect(docs['assembly.md']).toContain('NOT FOR ANIMAL USE')
  expect(docs['assembly.md']).toContain('none. Untested bench design')
  expect(JSON.parse(docs['setup.json']!)).toMatchObject({ length: 1300, fitted: false, loadRated: false })
  expect(docs['drawing.svg']).toContain('ramp 800')
  expect(docs['materials.md']).toContain('no hydrostatic head or UPF number')
  expect(Object.values(roverPrintQuantities(s)).every(n => Number.isInteger(n) && n > 0)).toBe(true)
})

test('Rover configured kit matches published geometry and rejects stale or tampered assets', async () => {
  const s = parseRoverSetup({ length: 1300, width: 760, ramp: 900 })
  const response = await roverDownload(designRoot, 'kit', s)
  const files = await new Bun.Archive(await response.arrayBuffer()).files()
  expect(response.headers.get('Content-Disposition')).toContain('rover-r0-l1300-w760')
  expect([...files.keys()].filter(f => f.endsWith('.stl')).length).toBe(14)
  expect([...files.keys()].filter(f => f.endsWith('.dxf')).length).toBe(3)
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
