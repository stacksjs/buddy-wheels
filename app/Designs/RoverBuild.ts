import type { RoverSetup } from './Rover'
import { mkdir, readdir, rm } from 'node:fs/promises'
import { join, relative } from 'node:path'
import { inspectBinaryStl } from './Mesh'
import { roverDimensions, roverPartFile, roverParts, roverStart } from './Rover'
import { roverCostModel } from './RoverCost'
import { roverDocuments, roverPrintQuantities } from './RoverDocuments'
import { roverMetalDxf, roverPartStl } from './RoverParts'

export const roverSourcePath = 'designs/rover/r0'
export const roverPublicPath = 'public/designs/rover/r0'
export const roverMetalIds = ['tee_gusset', 'corner_gusset', 'brake_plate', 'shock_plate', 'shock_hanger', 'axle_hanger_mid', 'axle_hanger_low', 'axle_hanger'] as const
export const roverEnvelope = [220, 220, 100] as const
export const sha256 = (bytes: string | ArrayBuffer | Uint8Array) => new Bun.CryptoHasher('sha256').update(bytes).digest('hex')

/** Every exported geometry file, generated natively. Deterministic, so a stored hash can be re-proven at any time. */
export function roverGeometry(): Record<string, Uint8Array | string> {
  const files: Record<string, Uint8Array | string> = {}
  for (const part of roverParts) files['parts/' + roverPartFile(part.id)] = roverPartStl(part.id)
  for (const id of roverMetalIds) files[`metal/${id}.dxf`] = roverMetalDxf(id)
  return files
}
export function inspectRoverGeometry(files = roverGeometry()) {
  return Object.entries(files).filter(([path]) => path.endsWith('.stl')).map(([file, data]) => {
    const bytes = data as Uint8Array; const inspection = inspectBinaryStl(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer)
    if (!inspection.closed || !inspection.consistentlyOriented || inspection.components !== 1 || inspection.signedVolumeMm3 <= 0 || inspection.boundsMm.size.some((n, i) => n > roverEnvelope[i]! + 0.001) || inspection.boundsMm.min[2] < -0.001) throw new Error(`Rover mesh check failed: ${file}`)
    return { file, inspection }
  })
}
/** Solid volume of one carrier's printed set, in cubic centimeters. Fixtures count once. */
export function roverPrintVolumeCm3(s: RoverSetup = roverStart): number {
  const quantities = roverPrintQuantities(s); const meshes = inspectRoverGeometry()
  return roverParts.filter(p => p.kind !== 'metal').reduce((sum, part) => sum + quantities[part.id]! * meshes.find(m => m.file === 'parts/' + roverPartFile(part.id))!.inspection.signedVolumeMm3, 0) / 1000
}
const README = `# Buddy Rover r0 bench design

**BENCH DESIGN. NOT FOR USE WITH AN ANIMAL.** A large low-entry carrier: a welded aluminum frame whose cabin sides, handle and nose are each bent from one tube, a raked nose, a roof that falls toward the front, sprung rear wheels, a tailgate that folds down into a walk-in ramp, a weather cover, and printed service parts. No load rating, structural analysis, physical test, fit approval or sewn sample exists.

Start with build-guide.md: it walks through ordering, the shop work and assembly in order. The frame goes to a fabrication shop, which cuts, bends and welds it from cut-list.csv, bend-schedule.csv and weld-schedule.csv. The wheels, suspension, floor, ramp and cover bolt on at home. No shop has quoted, bent or welded it. The studio also offers the same carrier as a bolted home build: every tube straight, a flat plate at every joint cut by a mail-order laser service, and 3D tube files for a tube laser. base-plan.svg shows the base frame from above, drawing.svg the whole carrier, drilling.csv every hole, buy-list.md what to order for one build. assembly.md and bom.csv are the specification. materials.md covers the rain, wind and sun system and its unproven points. cost-notes.md prices the design honestly, including the finding that it costs more to build than its catalog price.

| Folder | Contents |
| --- | --- |
| parts/ | Eleven printable types at 1:1 mm in print orientation, plus eight FIT_CHECK_ONLY plastic copies of the metal profiles |
| bend-schedule.csv, weld-schedule.csv | Every bent tube as straight runs and bend angles at one centerline radius, and every welded joint. For the shop |
| metal/ | Eight flat DXF profiles: corner gusset, tee gusset, brake clamp plate, the two shock mount plates and one axle hanger for each wheel choice. The welded frame uses the brake and shock plates only; the gussets belong to the bolted build. A configured bolted kit adds three gussets cut to that setup's roof and pillar angles |
| tubes/, tube-order.csv | In a configured bolted kit only: 3D STEP files of the straight frame tubes, packed end to end into sticks with their holes and angled ends, for a tube laser service, and the quantity and material for each. Generated natively and checked as closed solids. The set for the starting size passed one service's design check on 2026-11-12 |
| cover-cut-schedule.csv, cover-panels.svg | Every fabric blank with seam allowance |

Geometry is generated natively by the Stacks app in app/Designs/Rover*.ts and app/Designs/Solid.ts. There is no SCAD file for this design, and no OpenSCAD run was involved. The STEP files in a bolted kit are written by app/Designs/Step.ts. Every mesh is checked for a closed, consistently wound, single body of positive volume inside a 220 x 220 x 100 mm print envelope. Those are digital checks only.

Rebuild from the application root with \`./buddy design:rover\`, then run \`./buddy test\`.
`
export async function buildRover(root: string): Promise<{ assets: number, printVolumeCm3: number }> {
  const dir = join(root, roverSourcePath); const pub = join(root, roverPublicPath)
  await mkdir(join(dir, 'parts'), { recursive: true }); await mkdir(join(dir, 'metal'), { recursive: true })
  const geometry = roverGeometry(); const meshes = inspectRoverGeometry(geometry)
  const files: Record<string, Uint8Array | string> = { ...geometry, ...roverDocuments(roverStart), 'README.md': README }
  const assets: { path: string, sha256: string, bytes: number }[] = []
  for (const [path, data] of Object.entries(files)) {
    await Bun.write(join(dir, path), data); await Bun.write(join(pub, path), data)
    assets.push({ path, sha256: sha256(data), bytes: typeof data === 'string' ? new TextEncoder().encode(data).length : data.length })
  }
  // Files left over from an earlier default (the bolted tube set, for one) are not in the manifest, so they go.
  for (const [folder, keep] of [[dir, ['exports.json', 'mesh-inspection.json']], [pub, ['manifest.json']]] as const) {
    for (const entry of await readdir(folder, { recursive: true, withFileTypes: true })) {
      const path = relative(folder, join(entry.parentPath, entry.name))
      if (entry.isFile() && !Object.hasOwn(files, path) && !(keep as readonly string[]).includes(path)) await rm(join(folder, path))
    }
  }
  const docs = roverDocuments(roverStart)
  await Bun.write(join(root, 'docs/business/rover-r0-costs.md'), docs['cost-notes.md']!)
  await Bun.write(join(root, 'docs/product/rover-materials.md'), docs['materials.md']!)
  await Bun.write(join(root, 'docs/engineering/rover-r0-assembly.md'), docs['assembly.md']!)
  await Bun.write(join(root, 'docs/engineering/rover-r0-build-guide.md'), docs['build-guide.md']!)
  const geometryHash = sha256(Object.entries(geometry).map(([path, data]) => path + ':' + sha256(data)).join('\n'))
  const manifest = { revision: 'r0', product: 'Buddy Rover', status: 'BENCH_ONLY_NOT_ANIMAL_USE', generator: 'native Stacks solid kit, no external CAD executable', geometryHash, costHash: sha256(JSON.stringify(roverCostModel())), setup: roverStart, dimensions: { ...roverDimensions(roverStart), rampAngleRad: undefined }, printVolumeCm3: Math.round(roverPrintVolumeCm3()), assets, parts: roverParts }
  await Bun.write(join(pub, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n')
  await Bun.write(join(dir, 'exports.json'), JSON.stringify(manifest, null, 2) + '\n')
  await Bun.write(join(dir, 'mesh-inspection.json'), JSON.stringify({ geometryHash, status: 'DIGITAL_GEOMETRY_ONLY', envelopeMm: roverEnvelope, meshes }, null, 2) + '\n')
  return { assets: assets.length, printVolumeCm3: manifest.printVolumeCm3 }
}
