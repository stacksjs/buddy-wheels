import { describe, expect, test } from 'bun:test'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { inspectBinaryStl } from '../../app/Designs/Mesh'
import { bundleWheelchairDesign, cadParts, designRoot, generateWheelchairSources, readWheelchairProfile, suspensionLength, validateFamily, wheelchairFamilies } from '../../app/Designs/Wheelchair'

describe('wheelchair bench CAD', () => {
  test('all families preserve rigid linkage stroke margins and reject invalid interfaces', () => {
    for (const family of wheelchairFamilies) {
      expect(() => validateFamily(family)).not.toThrow()
      expect(() => validateFamily({ ...family, inner: family.tube })).toThrow()
      expect(() => validateFamily({ ...family, width: 60 })).toThrow()
      expect(() => validateFamily({ ...family, shockNeutral: family.shockFull })).toThrow()
      expect(() => validateFamily({ ...family, lockR: family.stopR })).toThrow()
      expect(() => validateFamily({ ...family, height: Number.NaN })).toThrow()
      expect(() => validateFamily({ ...family, pivot: family.pivotBore + 1 })).toThrow()
      expect(() => validateFamily({ ...family, innerWall: family.inner })).toThrow()
      expect(() => validateFamily({ ...family, pitch: 38 })).toThrow()
      expect(() => validateFamily({ ...family, rail: 30 })).toThrow()
      expect(() => validateFamily({ ...family, frameBolt: 50 })).toThrow()
    }
    const xl = wheelchairFamilies[0]!
    expect(suspensionLength(xl, 90, 0)).toBe(155)
    expect(suspensionLength(xl, 90, 6)).toBeCloseTo(145.593, 3)
    expect(suspensionLength(xl, 110, -3)).toBeCloseTo(160.757, 3)
    expect((90 / xl.arm) ** 2).toBe(0.25)
  })

  test('actual STL exports are closed, oriented single bodies in millimeters', async () => {
    for (const f of wheelchairFamilies) {
      const dir = join(designRoot, 'designs/wheelchair/r0', f.size)
      const manifest = await Bun.file(join(dir, 'exports.json')).json()
      const model = await Bun.file(join(dir, 'model.scad')).text()
      const source = await Bun.file(join(designRoot, 'designs/wheelchair/r0/source/wheelchair.scad')).text()
      expect(manifest.sourceHash).toBe(new Bun.CryptoHasher('sha256').update(source).update(model).digest('hex'))
      for (const p of cadParts) {
        const file = `stl/${p.category === 'metal' ? 'FIT_CHECK_ONLY_' : ''}${p.id}.stl`
        const bytes = await Bun.file(join(dir, file)).arrayBuffer()
        expect(manifest.files.find((asset: { file: string }) => asset.file === file)?.sha256).toBe(new Bun.CryptoHasher('sha256').update(bytes).digest('hex'))
        const mesh = inspectBinaryStl(bytes)
        expect(mesh.closed, `${f.size}/${file} closed`).toBe(true)
        expect(mesh.consistentlyOriented, `${f.size}/${file} winding`).toBe(true)
        expect(mesh.components, `${f.size}/${file} bodies`).toBe(1)
        expect(mesh.signedVolumeMm3).toBeGreaterThan(0)
        expect(mesh.boundsMm.size[0]).toBeLessThanOrEqual(220)
        expect(mesh.boundsMm.size[1]).toBeLessThanOrEqual(220)
        expect(mesh.boundsMm.size[2]).toBeLessThanOrEqual(100)
        if (p.id === 'arm_plate') {
          expect(mesh.boundsMm.size[0]).toBeCloseTo(f.arm + 24, 3)
          expect(mesh.boundsMm.size[2]).toBe(f.armPlate)
        }
      }
    }
  })

  test('mesh inspection rejects a damaged STL instead of silently accepting it', () => {
    expect(() => inspectBinaryStl(new ArrayBuffer(20))).toThrow('Truncated')
    expect(() => inspectBinaryStl(new ArrayBuffer(84))).toThrow('Invalid')
  })

  test('Buddy profiles are configurable, reject unknown fields and preserve baseline paths', async () => {
    const temp = await mkdtemp(join(tmpdir(), 'buddy-cad-'))
    try {
      const config = join(temp, 'profile.json')
      await Bun.write(config, JSON.stringify({ id: 'buddy-test', basis: 'XL', context: { ownerReportedWeightLb: 140 }, overrides: { width: 420 } }))
      const profile = await readWheelchairProfile(config)
      expect(profile.family.width).toBe(420)
      expect(profile.family.height).toBe(620)
      await generateWheelchairSources(temp, profile)
      expect(await Bun.file(join(temp, 'designs/wheelchair/r0/XL/model.scad')).exists()).toBe(false)
      const params = await Bun.file(join(temp, 'designs/wheelchair/iterations/buddy-test/parameters.json')).json()
      expect(params.width).toBe(420)
      expect(params.fittedToBuddy).toBe(false)
      expect(params.status).toBe('BENCH_ONLY_NOT_ANIMAL_USE')
      for (const invalid of [
        { id: '../XL', basis: 'XL', overrides: {} },
        { id: 'safe', basis: 'XXL', overrides: {} },
        { id: 'safe', basis: 'XL', overrides: { size: 'XL' } },
        { id: 'safe', basis: 'XL', overrides: { capacityLb: 140 } },
        { id: 'safe', basis: 'XL', overrides: { width: '400' } },
        { id: 'safe', basis: 'XL', overrides: { radii: [90, 70, 110] } },
      ]) {
        await Bun.write(config, JSON.stringify(invalid))
        await expect(readWheelchairProfile(config)).rejects.toThrow()
      }
    }
    finally {
      await rm(temp, { recursive: true, force: true })
    }
  })

  test('the download contains real binary part bytes and excludes private runtime files', async () => {
    const temp = await mkdtemp(join(tmpdir(), 'buddy-bundle-'))
    try {
      const sample = new Uint8Array([0, 15, 255, 39, 128])
      await Bun.write(join(temp, 'designs/wheelchair/r0/XL/stl/part.stl'), sample)
      await Bun.write(join(temp, 'docs/engineering/assembly.md'), '# Bench assembly')
      await Bun.write(join(temp, '.env'), 'DO_NOT_PACKAGE=true')
      await Bun.write(join(temp, 'storage/framework/runtime/private.txt'), 'PRIVATE')
      const output = await bundleWheelchairDesign(temp)
      const contents = await new Bun.Archive(await Bun.file(output).arrayBuffer()).files()
      expect(new Uint8Array(await contents.get('Buddy-Wheels-bench-r0/designs/wheelchair/r0/XL/stl/part.stl')!.arrayBuffer())).toEqual(sample)
      expect(await contents.get('Buddy-Wheels-bench-r0/docs/engineering/assembly.md')!.text()).toBe('# Bench assembly')
      expect([...contents.keys()].some(name => name.includes('.env') || name.includes('private.txt'))).toBe(false)
    }
    finally {
      await rm(temp, { recursive: true, force: true })
    }
  })
})
