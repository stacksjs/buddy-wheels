import { expect, test } from 'bun:test'
import { cp, mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { transformModelPoint } from '@stacksjs/browser/model-viewer'
import { designRoot } from '../../app/Designs/Wheelchair'
import { packStandardStock, parseStandardSetup, standardStart, standardQuery, standardDimensions, standardParts, standardPartFile, standardParameters, standardDrilling } from '../../app/Designs/XLStandard'
import { standardEconomics, standardCostLines } from '../../app/Designs/XLStandardCost'
import { standardScene } from '../../app/Designs/XLStandardScene'
import { standardDownload } from '../../app/Designs/XLStandardDownloads'
import { sha256, standardPublicPath, standardSourcePath } from '../../app/Designs/XLStandardBuild'

test('r1 accepts cut-to-fit dimensions, rejects old suspension/invalid fields, and keeps every range corner clear', () => {
  expect(parseStandardSetup({})).toEqual(standardStart)
  expect(parseStandardSetup(Object.fromEntries(new URLSearchParams(standardQuery(standardStart))))).toEqual(standardStart)
  for (const invalid of [{ height: '' }, { height: 499 }, { rail: 681 }, { width: [400] }, { hub: 59 }, { hub: 82.551 }, { height: Infinity }, { height: '0x26c' }, { setting: 1 }, { suspension: 'soft' }, { __proto__: null, fitApproved: true }]) expect(() => parseStandardSetup(invalid)).toThrow()
  for (const height of [500, 760]) for (const width of [320, 520]) for (const rail of [540, 820]) for (const hub of [60, 100]) {
    const setup = parseStandardSetup({ height, width, rail, hub }); const d = standardDimensions(setup)
    expect(d.tireClearance).toBeGreaterThan(4)
    expect(d.post - 47.3).toBeGreaterThan(70)
    expect(d.bridge - 2 * 47.3).toBeGreaterThan(190)
    expect(d.shaft - d.stack).toBeCloseTo(19.7, 8)
  }
  expect(standardDrilling(standardStart)).toContain('"570 / 630"')
  expect(standardDrilling(standardStart)).toContain('"450 / 510"')
  expect(standardParameters(standardStart)).toContain('wall=1.651;')
})

test('r1 stock and cost charge complete bars, paid labor and every BOM item without pretending RFQs are quotes', () => {
  const pack = packStandardStock(standardStart, 100)
  expect(pack.bars).toBe(80)
  expect(pack.netMm).toBe(270900)
  expect(pack.stockMm).toBeCloseTo(pack.netMm + pack.kerfMm + pack.remaining.reduce((a, b) => a + b, 0), 5)
  expect(pack.remaining.every(n => n >= 0 && n < 3657.6)).toBe(true)
  for (const q of [0, 0.5, Infinity, 1001]) expect(() => packStandardStock(standardStart, q)).toThrow()
  const base = standardEconomics()
  expect(base.stockPurchase).toBe(480240)
  expect(base.frame).toBe(4803)
  expect(base.cogs).toBe(18001)
  expect(base.gross).toBe(8449)
  expect(base.fee).toBe(797)
  expect(base.warranty).toBe(1323)
  expect(base.contribution).toBe(2829)
  expect(base.freeShippingContribution).toBe(429)
  expect(base.meetsCostGate).toBe(true)
  expect(standardEconomics(standardStart, 1).cogs).toBe(33601)
  expect(standardEconomics(standardStart, 1).meetsCostGate).toBe(false)
  expect(standardEconomics(parseStandardSetup({ height: 760, width: 520, rail: 820 })).meetsCostGate).toBe(false)
  expect(() => standardEconomics(standardStart, 2)).toThrow()
  const coverage = standardCostLines.flatMap(line => [...line.coverage])
  expect(coverage.length).toBe(new Set(coverage).size)
  for (const id of ['M04', 'M05', 'W01', 'W02', 'W03', 'W04', 'W05', 'W06', 'H01', 'H02', 'H03', 'H04', 'T01', ...standardParts.filter(p => p.kind !== 'metal').map(p => 'P-' + p.id)]) expect(coverage).toContain(id)
  expect(standardCostLines.find(l => l.id === 'labor')!.batch).toBe(2000)
})

test('r1 scene shares CAD datums and actual print meshes, with no fictitious spring mechanism', () => {
  const s = parseStandardSetup({ height: 660, width: 440, rail: 720, hub: 80 })
  const scene = standardScene(s)
  expect(transformModelPoint([0, 0, 0], scene.nodes.find(n => n.id === 'rail-1')!.transform!)).toEqual([-520, 220, 660])
  expect(scene.nodes.filter(n => /^axle-patch-bolt-|^rail-bolt-|^post-top-bolt-|^rear-rail-bolt-|^bridge-bolt-/.test(n.id) && !/-sleeve$|-head$/.test(n.id)).length).toBe(20)
  expect(scene.nodes.some(n => /spring|shock|trailing/.test(n.id))).toBe(false)
  expect(scene.nodes.filter(n => n.id.startsWith('retainer-')).length).toBe(4)
  expect(standardScene(s, 'joint_plate').nodes[0]!.geometry).toMatchObject({ kind: 'stl', src: expect.stringContaining('FIT_CHECK_ONLY_joint_plate.stl') })
})

test('r1 configured kit carries matching dimensions, costs, all real exports and archived hashes; rejects tampering/staleness', async () => {
  const s = parseStandardSetup({ height: 660, width: 440, rail: 720, hub: 80 })
  const response = await standardDownload(designRoot, 'kit', s)
  const files = await new Bun.Archive(await response.arrayBuffer()).files()
  expect(response.headers.get('Content-Disposition')).toContain('xl-r1-h660-w440-l720-hub80')
  expect([...files.keys()].filter(f => f.endsWith('.stl')).length).toBe(6)
  expect([...files.keys()].filter(f => f.endsWith('.dxf')).length).toBe(2)
  expect(JSON.parse(await files.get('setup.json')!.text())).toMatchObject({ height: 660, hub: 80, suspension: 'rigid', fitted: false })
  expect(JSON.parse(await files.get('cost-model.json')!.text()).base.cogs).toBe(standardEconomics(s).cogs)
  expect(await files.get('cost-notes.md')!.text()).toContain('rail height 660')
  expect(await files.get('model.scad')!.text()).toContain('hub=80;')
  expect(await files.get('assembly.md')!.text()).toContain('| Upright cut, qty 2 | 527.2 |')
  for (const part of standardParts) expect(sha256(await files.get('parts/' + standardPartFile(part.id))!.arrayBuffer())).toBe(sha256(await Bun.file(join(designRoot, standardPublicPath, 'parts', standardPartFile(part.id))).arrayBuffer()))
  const hashes = JSON.parse(await files.get('checksums.json')!.text())
  for (const f of hashes.files) expect(sha256(await files.get(f.file)!.arrayBuffer())).toBe(f.sha256)
  const temp = await mkdtemp(join(tmpdir(), 'buddy-r1-'))
  try {
    await cp(join(designRoot, standardPublicPath), join(temp, standardPublicPath), { recursive: true })
    await cp(join(designRoot, standardSourcePath), join(temp, standardSourcePath), { recursive: true })
    const path = join(temp, standardPublicPath, 'manifest.json'); const manifest = await Bun.file(path).json()
    await Bun.write(path, JSON.stringify({ ...manifest, assets: manifest.assets.filter((a: { path: string }) => a.path !== 'parts/end_cap.stl') }))
    await expect(standardDownload(temp, 'kit', s)).rejects.toThrow('Incomplete')
    await Bun.write(path, JSON.stringify({ ...manifest, costHash: 'stale' }))
    await expect(standardDownload(temp, 'kit', s)).rejects.toThrow('cost model')
    await Bun.write(path, JSON.stringify(manifest))
    await Bun.write(join(temp, standardPublicPath, 'parts/end_cap.stl'), 'tampered')
    await expect(standardDownload(temp, 'kit', s)).rejects.toThrow('checksum')
    await Bun.write(join(temp, standardSourcePath, 'source/standard.scad'), 'changed')
    await expect(standardDownload(temp, 'kit', s)).rejects.toThrow('Stale r1 CAD')
  }
  finally { await rm(temp, { recursive: true, force: true }) }
})
