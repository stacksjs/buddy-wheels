import { join } from 'node:path'
import type { StandardSetup } from './XLStandard'
import { standardCode, standardStart, standardParts, standardPartFile } from './XLStandard'
import { standardDocuments } from './XLStandardDocuments'
import { sha256, standardPublicPath, standardSourcePath, standardCostModel, standardCostMarkdown, standardCostCsv } from './XLStandardBuild'
export async function standardDownload(root: string, artifact: string, setup: StandardSetup): Promise<Response> {
  const docs = standardDocuments(setup)
  const headers = { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' }
  const attachment = (body: BodyInit, type: string, suffix: string) => new Response(body, { headers: { ...headers, 'Content-Type': type, 'Content-Disposition': `attachment; filename="buddy-${standardCode(setup)}${suffix}"` } })
  if (artifact === 'assembly') return attachment(docs['assembly.md']!, 'text/markdown; charset=utf-8', '-assembly.md')
  if (artifact === 'bom') return attachment(docs['bom.csv']!, 'text/csv; charset=utf-8', '-bom.csv')
  if (artifact === 'profile') return attachment(docs['setup.json']!, 'application/json', '-setup.json')
  if (artifact !== 'kit') return new Response('File not found.', { status: 404 })
  const pub = join(root, standardPublicPath)
  const manifest = await Bun.file(join(pub, 'manifest.json')).json() as { sourceHash: string, costHash: string, assets: { path: string, sha256: string }[] }
  const required = [...standardParts.map(p => 'parts/' + standardPartFile(p.id)), 'metal/joint_plate.dxf', 'metal/axle_plate.dxf', 'source/standard.scad', 'assembly.png', 'cost-notes.md', 'cost-model.json', 'costs.csv']
  if (required.some(file => !manifest.assets.some(a => a.path === file)) || new Set(manifest.assets.map(a => a.path)).size !== manifest.assets.length) throw new Error('Incomplete r1 manifest.')
  if (manifest.costHash !== sha256(JSON.stringify(standardCostModel()))) throw new Error('Stale r1 cost model. Rebuild before delivery.')
  const source = await Bun.file(join(root, standardSourcePath, 'source/standard.scad')).text()
  if (sha256(source + standardDocuments(standardStart)['model.scad']) !== manifest.sourceHash) throw new Error('Stale r1 CAD. Rebuild and export before delivery.')
  const files: Record<string, string | Uint8Array> = { ...docs, 'README.md': '# XL r1 rigid bench kit\n\nStart with assembly.md, bom.csv and drilling.csv. assembly.png is a baseline layout reference; your configured CAD and tables supply the dimensions. NOT FOR ANIMAL USE. No r0 meshes or independent suspension belong in this kit. Cost figures are unquoted manufacturing scenarios, not supplier quotes or fit/load approval.\n', 'cost-notes.md': standardCostMarkdown(setup), 'cost-model.json': JSON.stringify(standardCostModel(setup), null, 2) + '\n', 'costs.csv': standardCostCsv(setup) }
  for (const asset of manifest.assets) {
    if (!/^(?:parts\/(?:FIT_CHECK_ONLY_)?[a-z_]+\.stl|metal\/[a-z_]+\.dxf|source\/standard\.scad|model\.scad|assembly\.(?:png|md)|bom\.csv|drilling\.csv|setup\.json|cost-notes\.md|cost-model\.json|costs\.csv)$/.test(asset.path)) throw new Error('Invalid r1 manifest path.')
    const bytes = new Uint8Array(await Bun.file(join(pub, asset.path)).arrayBuffer())
    if (sha256(bytes) !== asset.sha256) throw new Error('r1 asset checksum mismatch.')
    if (!Object.hasOwn(files, asset.path)) files[asset.path] = bytes
  }
  if (sha256(files['source/standard.scad'] as Uint8Array) !== sha256(source)) throw new Error('Public r1 source mismatch.')
  const hashes = Object.entries(files).map(([file, data]) => ({ file, sha256: sha256(data), bytes: typeof data === 'string' ? new TextEncoder().encode(data).length : data.length }))
  files['checksums.json'] = JSON.stringify({ revision: 'r1', baselineSourceHash: manifest.sourceHash, configuredSourceHash: sha256(source + docs['model.scad']), files: hashes }, null, 2) + '\n'
  return attachment(await new Bun.Archive(files, { compress: 'gzip' }).blob(), 'application/gzip', '.tar.gz')
}
