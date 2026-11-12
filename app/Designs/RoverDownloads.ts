import type { RoverSetup } from './Rover'
import { join } from 'node:path'
import { roverCode } from './Rover'
import { roverGeometry, roverPublicPath, sha256 } from './RoverBuild'
import { roverDocuments } from './RoverDocuments'

const single: Record<string, [string, string, string]> = {
  assembly: ['assembly.md', 'text/markdown; charset=utf-8', '-assembly.md'],
  bom: ['bom.csv', 'text/csv; charset=utf-8', '-bom.csv'],
  profile: ['setup.json', 'application/json', '-setup.json'],
  materials: ['materials.md', 'text/markdown; charset=utf-8', '-materials.md'],
  cover: ['cover-cut-schedule.csv', 'text/csv; charset=utf-8', '-cover-cut-schedule.csv'],
  cuts: ['cut-list.csv', 'text/csv; charset=utf-8', '-cut-list.csv'],
  drawing: ['drawing.svg', 'image/svg+xml', '-drawing.svg'],
  costs: ['cost-notes.md', 'text/markdown; charset=utf-8', '-cost-notes.md'],
  buylist: ['buy-list.md', 'text/markdown; charset=utf-8', '-buy-list.md'],
  guide: ['build-guide.md', 'text/markdown; charset=utf-8', '-build-guide.md'],
  drilling: ['drilling.csv', 'text/csv; charset=utf-8', '-drilling.csv'],
  baseplan: ['base-plan.svg', 'image/svg+xml', '-base-plan.svg'],
}
/** Configured documents plus the published geometry, re-proven against freshly generated meshes before delivery. */
export async function roverDownload(root: string, artifact: string, setup: RoverSetup): Promise<Response> {
  const docs = roverDocuments(setup)
  const headers = { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' }
  const attachment = (body: BodyInit, type: string, suffix: string) => new Response(body, { headers: { ...headers, 'Content-Type': type, 'Content-Disposition': `attachment; filename="buddy-${roverCode(setup)}${suffix}"` } })
  if (Object.hasOwn(single, artifact)) { const [file, type, suffix] = single[artifact]!; return attachment(docs[file]!, type, suffix) }
  if (artifact !== 'kit') return new Response('File not found.', { status: 404 })
  const pub = join(root, roverPublicPath)
  const manifest = await Bun.file(join(pub, 'manifest.json')).json() as { geometryHash: string, assets: { path: string, sha256: string }[] }
  const files: Record<string, string | Uint8Array> = { ...docs, 'README.md': '# Buddy Rover r0 configured bench kit\n\nStart with assembly.md, drawing.svg and bom.csv. NOT FOR ANIMAL USE. Documents match the dimensions in setup.json. Printable parts and metal profiles do not change with the frame dimensions; only quantities and cut lengths do. Cost figures are an unquoted study.\n' }
  for (const [path, data] of Object.entries(roverGeometry())) {
    const published = manifest.assets.find(asset => asset.path === path)
    if (!published) throw new Error('Incomplete Rover manifest.')
    if (published.sha256 !== sha256(data)) throw new Error('Stale Rover geometry. Rebuild before delivery.')
    const bytes = new Uint8Array(await Bun.file(join(pub, path)).arrayBuffer())
    if (sha256(bytes) !== published.sha256) throw new Error('Rover asset checksum mismatch.')
    files[path] = bytes
  }
  const hashes = Object.entries(files).map(([file, data]) => ({ file, sha256: sha256(data), bytes: typeof data === 'string' ? new TextEncoder().encode(data).length : data.length }))
  files['checksums.json'] = JSON.stringify({ revision: 'r0', geometryHash: manifest.geometryHash, files: hashes }, null, 2) + '\n'
  return attachment(await new Bun.Archive(files, { compress: 'gzip' }).blob(), 'application/gzip', '.tar.gz')
}
