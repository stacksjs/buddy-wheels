import type { RoverSetup } from './Rover'
import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { inspectBinaryStl } from './Mesh'
import { roverDimensions, roverPartFile, roverParts, roverStart } from './Rover'
import { roverCostModel } from './RoverCost'
import { roverDocuments, roverPrintQuantities } from './RoverDocuments'
import { roverMetalDxf, roverPartStl } from './RoverParts'

export const roverSourcePath = 'designs/rover/r0'
export const roverPublicPath = 'public/designs/rover/r0'
export const roverMetalIds = ['tee_gusset', 'corner_gusset', 'axle_hanger_low', 'axle_hanger'] as const
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

**BENCH DESIGN. NOT FOR USE WITH AN ANIMAL.** A large low-entry carrier: a cut-to-fit aluminum frame, a tailgate that folds down into a walk-in ramp, a weather cover, and printed service parts. No load rating, structural analysis, physical test, fit approval or sewn sample exists.

Start with assembly.md, drawing.svg and bom.csv. materials.md covers the rain, wind and sun system and its unproven points. cost-notes.md prices the design honestly, including the finding that it does not fit the provisional catalog price.

| Folder | Contents |
| --- | --- |
| parts/ | Eleven printable types at 1:1 mm in print orientation, plus four FIT_CHECK_ONLY plastic copies of the metal profiles |
| metal/ | Four flat DXF profiles: corner gusset, tee gusset and one axle hanger for each wheel choice |
| cover-cut-schedule.csv, cover-panels.svg | Every fabric blank with seam allowance |

Geometry is generated natively by the Stacks app in app/Designs/Rover*.ts and app/Designs/Solid.ts. There is no SCAD or STEP file for this design, and no OpenSCAD run was involved. Every mesh is checked for a closed, consistently wound, single body of positive volume inside a 220 x 220 x 100 mm print envelope. Those are digital checks only.

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
  const docs = roverDocuments(roverStart)
  await Bun.write(join(root, 'docs/business/rover-r0-costs.md'), docs['cost-notes.md']!)
  await Bun.write(join(root, 'docs/product/rover-materials.md'), docs['materials.md']!)
  await Bun.write(join(root, 'docs/engineering/rover-r0-assembly.md'), docs['assembly.md']!)
  const geometryHash = sha256(Object.entries(geometry).map(([path, data]) => path + ':' + sha256(data)).join('\n'))
  const manifest = { revision: 'r0', product: 'Buddy Rover', status: 'BENCH_ONLY_NOT_ANIMAL_USE', generator: 'native Stacks solid kit, no external CAD executable', geometryHash, costHash: sha256(JSON.stringify(roverCostModel())), setup: roverStart, dimensions: { ...roverDimensions(roverStart), rampAngleRad: undefined }, printVolumeCm3: Math.round(roverPrintVolumeCm3()), assets, parts: roverParts }
  await Bun.write(join(pub, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n')
  await Bun.write(join(dir, 'exports.json'), JSON.stringify(manifest, null, 2) + '\n')
  await Bun.write(join(dir, 'mesh-inspection.json'), JSON.stringify({ geometryHash, status: 'DIGITAL_GEOMETRY_ONLY', envelopeMm: roverEnvelope, meshes }, null, 2) + '\n')
  return { assets: assets.length, printVolumeCm3: manifest.printVolumeCm3 }
}
