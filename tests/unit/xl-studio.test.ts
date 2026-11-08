import { expect, test } from 'bun:test'
import { cp, mkdir, mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { transformModelPoint } from '@stacksjs/browser/model-viewer'
import { designRoot } from '../../app/Designs/Wheelchair'
import { createXLScene } from '../../app/Designs/XLScene'
import { parseXLSetup, xlSetupQuery, xlStartingSetup } from '../../app/Designs/XLSetup'
import { publishXLAssets, xlDownload } from '../../app/Designs/XLDownloads'

test('XL studio accepts bounded geometry and rejects malformed or incompatible setup inputs', () => {
  for (const height of [500, 760]) {
    for (const width of [320, 520]) {
      for (const rail of [540, 820])
        expect(parseXLSetup({ height, width, rail }).height).toBe(height)
    }
  }
  expect(parseXLSetup(Object.fromEntries(new URLSearchParams(xlSetupQuery(xlStartingSetup))))).toEqual(xlStartingSetup)
  for (const invalid of [{ height: '' }, { width: 300 }, { rail: 681 }, { height: [620] }, { height: '0x26c' }, { height: Infinity }, { setting: 3 }, { travel: 6.5 }, { travel: 0.1 }, { locked: 'yes' }, { locked: true, travel: 1 }, { capacityLb: 140 }])
    expect(() => parseXLSetup(invalid)).toThrow()
})

test('3D geometry uses the same rail and suspension datums and shows only neutral locked motion', () => {
  const setup = parseXLSetup({ height: 660, width: 440, rail: 720, setting: 2, travel: 6 })
  const scene = createXLScene(setup)
  const rail = scene.nodes.find(node => node.id === 'rail-1')!
  expect(rail.geometry).toEqual({ kind: 'tube', outer: 25, inner: 21, length: 720 })
  expect(transformModelPoint([0, 0, 0], rail.transform!)).toEqual([-640, 220, 660])
  const upper = scene.nodes.find(node => node.id === 'wheel-1-upper-eye')!
  expect(transformModelPoint([0, 0, 0], upper.transform!)).toEqual([110, 220, 355])
  expect(scene.nodes.some(node => node.id.endsWith('-lock'))).toBe(false)
  expect(createXLScene(parseXLSetup({ locked: true })).nodes.filter(node => node.id.endsWith('-lock')).length).toBe(2)
  const part = createXLScene(setup, 'arm_plate')
  expect(part.nodes.length).toBe(1)
  expect(part.nodes[0]!.geometry.kind).toBe('stl')
})

test('configured kit includes matching CAD, cut list, assembly guide and exact printable binaries', async () => {
  const setup = parseXLSetup({ height: 660, width: 440, rail: 720, setting: 2, travel: 6 })
  const response = await xlDownload(designRoot, 'kit', setup)
  expect(response.headers.get('Content-Disposition')).toContain('xl-h660-w440-l720-c')
  expect(response.headers.get('Cache-Control')).toBe('no-store')
  const files = await new Bun.Archive(await response.arrayBuffer()).files()
  const parameters = JSON.parse(await files.get('parameters.json')!.text())
  expect([parameters.height, parameters.width, parameters.rail]).toEqual([660, 440, 720])
  expect(await files.get('model.scad')!.text()).toContain('include <source/wheelchair.scad>')
  const source = await files.get('source/wheelchair.scad')!.text()
  expect(source).toContain('setting = 2;')
  expect(source).toContain('angle = 6;')
  const instructions = await files.get('assembly.md')!.text()
  expect(instructions).toContain('| Lower upright cut length, quantity 2 | 355 |')
  expect(instructions).toContain('| Each bridge tube cut length | 290.5 |')
  expect(await files.get('bom.csv')!.text()).toContain('wall x 355 long')
  expect([...files.keys()].filter(name => name.endsWith('.stl')).length).toBe(10)
  expect([...files.keys()].filter(name => name.endsWith('.dxf')).length).toBe(3)
  const checksums = JSON.parse(await files.get('checksums.json')!.text())
  expect(checksums.baselineSourceHash).toBe((await Bun.file(join(designRoot, 'designs/wheelchair/r0/XL/exports.json')).json()).sourceHash)
  expect(checksums.configuredSourceHash).toBe(new Bun.CryptoHasher('sha256').update(source).update(await files.get('model.scad')!.text()).digest('hex'))
  for (const item of checksums.files as { file: string, sha256: string }[])
    expect(new Bun.CryptoHasher('sha256').update(await files.get(item.file)!.arrayBuffer()).digest('hex')).toBe(item.sha256)
  const coupon = await files.get('parts/coupon.stl')!.arrayBuffer()
  expect(new Bun.CryptoHasher('sha256').update(coupon).digest('hex')).toBe(new Bun.CryptoHasher('sha256').update(await Bun.file(join(designRoot, 'designs/wheelchair/r0/XL/stl/coupon.stl')).arrayBuffer()).digest('hex'))
  const locked = await xlDownload(designRoot, 'kit', parseXLSetup({ locked: true, setting: 0 }))
  const lockedFiles = await new Bun.Archive(await locked.arrayBuffer()).files()
  expect(await lockedFiles.get('source/wheelchair.scad')!.text()).toContain('locked = true;')
  expect(JSON.parse(await lockedFiles.get('profile.json')!.text()).context.fitApproved).toBe(false)
})

test('asset publishing refuses stale source, modified exports and incomplete provenance', async () => {
  const root = await mkdtemp(join(tmpdir(), 'buddy-xl-publish-'))
  try {
    const base = join(root, 'designs/wheelchair/r0')
    await mkdir(base, { recursive: true })
    await cp(join(designRoot, 'designs/wheelchair/r0/XL'), join(base, 'XL'), { recursive: true })
    await cp(join(designRoot, 'designs/wheelchair/r0/source'), join(base, 'source'), { recursive: true })
    await Bun.write(join(root, 'docs/engineering/wheelchair-printing-r0.md'), 'Print guide')
    await Bun.write(join(root, 'docs/engineering/printer-options-la.md'), 'Printer options')
    await Bun.write(join(root, 'docs/product/validation.md'), 'Bench only')
    await publishXLAssets(root)
    const sourcePath = join(base, 'source/wheelchair.scad')
    const original = await Bun.file(sourcePath).text()
    await Bun.write(sourcePath, `${original}\n// changed geometry source\n`)
    await expect(publishXLAssets(root)).rejects.toThrow('source has changed')
    await Bun.write(sourcePath, original)
    const manifestPath = join(base, 'XL/exports.json')
    const manifest = await Bun.file(manifestPath).json()
    await Bun.write(manifestPath, JSON.stringify({ ...manifest, files: [] }))
    await expect(publishXLAssets(root)).rejects.toThrow('incomplete')
    await Bun.write(manifestPath, JSON.stringify(manifest))
    await Bun.write(join(base, 'XL/stl/coupon.stl'), 'tampered')
    await expect(publishXLAssets(root)).rejects.toThrow('export was modified')
  }
  finally { await rm(root, { recursive: true, force: true }) }
})
