import { expect, test } from 'bun:test'
import { join } from 'node:path'
import { transformModelPoint } from '@stacksjs/browser/model-viewer'
import { designRoot, readWheelchairProfile } from '../../app/Designs/Wheelchair'
import { studioAssemblyInstructions, studioDownload } from '../../app/Designs/StudioDownloads'
import { createStudioScene } from '../../app/Designs/StudioScene'
import { parseStudioSetup, parseStudioSize, studioDimensionLimits, studioSetupFamily, studioSetupQuery, studioSizes, studioStartingSetup } from '../../app/Designs/StudioSetup'

const expected = {
  XS: { wheel: 120, tube: 16, arm: 70, radii: [25, 32, 40], upper: 130, pinStack: 26, armStack: 16, axleStack: 60.5, bore: '5.2', crossHole: 1, innerLength: 120 },
  S: { wheel: 200, tube: 20, arm: 100, radii: [38, 50, 62], upper: 192, pinStack: 38, armStack: 20, axleStack: 75, bore: '6.2', crossHole: 2, innerLength: 120 },
  M: { wheel: 300, tube: 22, arm: 140, radii: [55, 70, 85], upper: 280, pinStack: 50, armStack: 26, axleStack: 90.5, bore: '7.2', crossHole: 2, innerLength: 150 },
  L: { wheel: 350, tube: 25, arm: 165, radii: [65, 85, 105], upper: 330, pinStack: 60, armStack: 32, axleStack: 106, bore: '8.2', crossHole: 2, innerLength: 180 },
  XL: { wheel: 400, tube: 25, arm: 180, radii: [70, 90, 110], upper: 355, pinStack: 60, armStack: 32, axleStack: 106, bore: '8.2', crossHole: 2, innerLength: 180 },
} as const

for (const size of studioSizes) {
  test(`${size} setup bounds and actual suspension geometry belong to the selected family`, () => {
    const limits = studioDimensionLimits[size]
    for (const height of limits.height) for (const width of limits.width) for (const rail of limits.rail)
      {
        const setup = parseStudioSetup({ height, width, rail }, size)
        expect(setup.size).toBe(size)
        const f = studioSetupFamily(setup)
        expect(f.height - f.tube / 2 - f.innerLength).toBeGreaterThan(f.wheel / 2 + 65 + (f.frameBolt + 2.2) / 2 + 0.2)
        expect(f.width - 2 * 78).toBeGreaterThanOrEqual(2)
      }
    const defaults = studioStartingSetup(size)
    expect(parseStudioSetup(Object.fromEntries(new URLSearchParams(studioSetupQuery(defaults))), size)).toEqual(defaults)
    for (const key of ['height', 'width', 'rail'] as const) {
      expect(() => parseStudioSetup({ [key]: limits[key][0] - 5 }, size)).toThrow()
      expect(() => parseStudioSetup({ [key]: limits[key][1] + 5 }, size)).toThrow()
    }
    for (const setting of [0, 1, 2]) {
      const scene = createStudioScene(parseStudioSetup({ setting, travel: 6 }, size))
      expect(transformModelPoint([0, 0, 0], scene.nodes.find(node => node.id === 'wheel-1-upper-eye')!.transform!)).toEqual([expected[size].radii[setting], defaults.width / 2, expected[size].upper])
      const rail = scene.nodes.find(node => node.id === 'rail-1')!.geometry
      expect(rail.kind === 'tube' && rail.outer).toBe(expected[size].tube)
      for (const node of scene.nodes) if (node.geometry.kind === 'stl') expect(node.geometry.src).toStartWith(`/designs/${size.toLowerCase()}/r0/`)
    }
    expect(createStudioScene(parseStudioSetup({ locked: true }, size)).nodes.filter(node => node.id.endsWith('-lock')).length).toBe(2)
    expect(() => parseStudioSetup({ locked: true, travel: 1 }, size)).toThrow()
  })

  test(`${size} configured kit, every printable mesh and hardware instruction match its own CAD`, async () => {
    const defaults = studioStartingSetup(size)
    const setup = parseStudioSetup({ height: defaults.height + 5, width: defaults.width + 5, rail: defaults.rail + 5, setting: 2, travel: -3 }, size)
    const response = await studioDownload(designRoot, 'kit', setup)
    expect(response.headers.get('Content-Disposition')).toContain(`buddy-${size.toLowerCase()}-h${setup.height}`)
    const files = await new Bun.Archive(await response.arrayBuffer()).files()
    const parameters = JSON.parse(await files.get('parameters.json')!.text())
    expect(parameters.size).toBe(size)
    expect(parameters.height).toBe(setup.height)
    expect(parameters.wheel).toBe(expected[size].wheel)
    const instructions = await files.get('assembly.md')!.text()
    expect(instructions).toStartWith(`# Your ${size} bench assembly`)
    expect(instructions).toContain(`| Upper upright cut length, quantity 2 | ${expected[size].innerLength} |`)
    expect(instructions).toContain(`| Wheel outside diameter | ${expected[size].wheel} |`)
    expect(instructions).toContain(`tube holes are nominal ${expected[size].bore}`)
    expect(instructions).toContain(`Main/stop/lock/upper-shock stacks are ${expected[size].pinStack}, lower shock ${expected[size].armStack} and axle ${expected[size].axleStack}.`)
    expect(instructions).toContain(`0.5 axial float and ${expected[size].crossHole} cross-hole`)
    expect(await files.get('source/wheelchair.scad')!.text()).toContain('angle = -3;')
    expect([...files.keys()].filter(file => file.endsWith('.stl')).length).toBe(10)
    expect([...files.keys()].filter(file => file.endsWith('.dxf')).length).toBe(3)
    for (const [name, file] of files) {
      if (!name.endsWith('.stl') && !name.endsWith('.dxf')) continue
      const original = join(designRoot, 'designs/wheelchair/r0', size, name.replace('parts/', 'stl/').replace('metal/', 'dxf/'))
      expect(new Bun.CryptoHasher('sha256').update(await file.arrayBuffer()).digest('hex')).toBe(new Bun.CryptoHasher('sha256').update(await Bun.file(original).arrayBuffer()).digest('hex'))
    }
    const checksums = JSON.parse(await files.get('checksums.json')!.text())
    expect(checksums.setup.size).toBe(size)
    for (const record of checksums.files) expect(new Bun.CryptoHasher('sha256').update(await files.get(record.file)!.arrayBuffer()).digest('hex')).toBe(record.sha256)
    expect(checksums.baselineSourceHash).toBe((await Bun.file(join(designRoot, 'designs/wheelchair/r0', size, 'exports.json')).json()).sourceHash)
    const profile = JSON.parse(await files.get('profile.json')!.text())
    expect(profile.basis).toBe(size)
    expect(profile.context.ownerReportedWeightLb).toBe(size === 'XL' ? 140 : undefined)
    const temp = join(designRoot, 'storage/framework/runtime', `test-studio-profile-${size.toLowerCase()}.json`)
    await Bun.write(temp, JSON.stringify(profile))
    expect((await readWheelchairProfile(temp)).family).toEqual(expect.objectContaining({ size, height: setup.height, width: setup.width, rail: setup.rail }))
    const assembly = await studioDownload(designRoot, 'assembly', setup)
    expect(await assembly.text()).toBe(studioAssemblyInstructions(setup))
  })
}

test('unknown sizes, traversal and cross-family dimensions are refused', () => {
  for (const invalid of ['XXL', '../XL', 'xl/r0', '', ['XL'], null]) expect(() => parseStudioSize(invalid)).toThrow()
  expect(parseStudioSize('xs')).toBe('XS')
  expect(() => parseStudioSetup({ height: 620 }, 'XS')).toThrow()
  expect(() => parseStudioSetup({ width: 160 }, 'XL')).toThrow()
  for (const [size, height] of [['XS', 220], ['S', 260], ['M', 310], ['L', 400]] as const)
    expect(() => parseStudioSetup({ height }, size)).toThrow()
  expect(() => studioSetupFamily({ ...studioStartingSetup('M'), height: 310 })).toThrow('mount pins')
  expect(() => studioSetupFamily({ ...studioStartingSetup('XS'), width: 140 })).toThrow('corner plates')
})
