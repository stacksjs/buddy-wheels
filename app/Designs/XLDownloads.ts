import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import type { XLSetup } from './XLSetup'
import { xlAssetRoot, xlPartFile, xlPartNames, xlSetupCode, xlSetupFamily } from './XLSetup'
import { cadParts, wheelchairFamilies } from './WheelchairParameters'
import { wheelchairDocuments } from './Wheelchair'

export function xlAssemblyInstructions(setup: XLSetup): string {
  const f = xlSetupFamily(setup)
  const R = f.wheel / 2
  const lower = f.height - R - 105
  const overlap = f.innerLength + f.tube / 2 - 80
  const bridge = (f.width - f.tube) * 0.7
  return `# Your XL bench assembly\n\nConfiguration ${xlSetupCode(setup)}, revision r0. All dimensions mm.\n\nBENCH PROTOTYPE. NOT FOR ANIMAL USE. Buddy is owner-reported 140 lb. Frame dimensions are configurable estimates, not his measured fit or a safe load rating. Exact shock/wheel/harness selections, finish tolerances, fastener procedures and engineering tests remain outstanding.\n\nUse the [parts list](bom.csv), [drilling coordinates](tube-drilling.csv) and [print guide](print-guide.md) alongside these steps.\n\n![Assembly layout reference](assembly.png)\n\nLayout reference only. Use your configuration table below for dimensions.\n\n## Your dimensions\n\n| Item | Value |\n| --- | ---: |\n| Rail center height | ${f.height} |\n| Rail center spacing | ${f.width} |\n| Inner rail clearance | ${f.width - f.tube} |\n| Side rail cut length, quantity 2 | ${f.rail} |\n| Lower upright cut length, quantity 2 | ${lower} |\n| Upper upright cut length, quantity 2 | 180 |\n| Each bridge tube cut length | ${bridge} |\n| Nominal upright overlap | ${overlap} |\n| Nominal bridge overlap | ${(f.width - f.tube) * 0.4} |\n| Wheel outside diameter | 400 |\n| Overall tire envelope | ${f.width + 190} |\n\n## Print and prepare\n\n1. Print the calibration coupon first at 1:1 mm scale. Check bores against the print guide. All ten part types fit a 220 x 220 x 100 mm box; the arm copy is 204 mm long. Do not scale the meshes.\n2. Printable service/fixture parts: four tube caps, one inner cap, two setup markers, four sample pivot shields, one layout jig, one coupon and two rigid shock eye gauges. The marker and guards carry no support load. Caps may be spares; do not cap telescoping entries.\n3. The four fixed-cheek, four arm-cheek and eight corner-cheek copies prefixed FIT_CHECK_ONLY are unloaded plastic layout aids. Fabricate their metal counterparts from the matching DXFs only after drawing review. No printed spring, primary shock mount, axle or harness anchor is approved.\n4. Cut the metal tubes using your table above and bom.csv. Use tube-drilling.csv for hole datums. XL tube holes are nominal 8.2 for OD8/ID6.2 metal crush sleeves; cheek bolt holes are 6.4. Review fits and bearing strength before fabrication. The printed jig is a spacing/layout aid, not a final drill bushing.\n\n## Assemble the empty frame\n\n5. Orient X rearward, Y across the frame and Z upward. Place rail centers ${f.width} apart at Z=${f.height}. Each side rail runs from X=${-(f.rail - 80)} to X=80. Rear bridge centerline is X=60.\n6. At X=0 join each upper upright to its rail with paired metal corner cheeks. Upper tube ends touch the rail underside at Z=${f.height - 12.5}. Rail cheek holes lie at X=-60 and -30; upright holes at Z=${f.height - 60} and ${f.height - 30}. Use eight total corner-joint through-bolt sets, metal crush sleeves and 2.5 mm spacers at both faces of the smaller tubes.\n7. Place the bridge between the side-rail inner faces, with clear span ${f.width - 25}. The 25x2 outer tube starts at the left rail and 20x2 inner tube ends at the right rail. Their overlap is ${(f.width - 25) * 0.4}. Add paired corner cheeks above/below each end, pointing forward/inward, with eight joint bolts and the smaller-tube spacers at the right end.\n8. Match-drill the separate bridge index pair at Y=-15 and +15 using the schedule. Fit its two removable metal sleeves and retained through-bolts. Width retention is not friction-only.\n9. Slide lower uprights over upper sections. Lower outer ends sit at Z=${R + 25}, upper ends at Z=${f.height - 80}; nominal overlap is ${overlap}. Install two sleeved index bolts per side at Z=${f.height - 130} and ${f.height - 100}. No extra adjustment rows are approved.\n\n## Assemble the wheel modules\n\n10. Place two fixed suspension cheeks per side with 48 clear gap around the 25 mm upright. Fit 11.5 mm metal spacers on each face at the two mount bolts. Pivot axes are X=0,Z=200; attachment holes are Z=235 and 265.\n11. Fit a 10 ID/14 OD/6 long bronze pivot bush in each 6 mm arm cheek after finish-fit review. Keep arm cheeks 20 apart internally, with a 20 mm center pivot spacer and 8 mm outer spacers. Install the headed pivot pin with positive end washer/cotter retention across the 60 mm stack.\n12. With the rig independently supported, align arms horizontally. Insert the separate neutral lock pin at radius 50 with its center spacer and positive retainer. Add the retained stop pin at radius 30 through both slots and arms. Do not squeeze the moving slot faces together.\n13. Your selected leverage is ${['A', 'B', 'C'][setup.setting]} at radius ${f.radii[setup.setting]}. Both upper and lower shock eyes must use this same radius on both sides. Upper eye is Z=355, lower eye Z=200 at neutral. Requested shock interface:165 extended eyes,38 stroke,155 installed eyes,8 pin,20 eye width and maximum 40 body. These are RFQ dimensions, not an approved compatible SKU. Use the rigid printed gauge for unloaded fit checks only.\n14. Use 14 mm upper-eye metal spacers and correctly retained eye pins; verify actual eye running clearance. Spring rate/air pressure, preload and damping depend on the selected supplier and separate engineering calibration. No animal-use setting is provided.\n15. Fit each axle through a 6 mm inner arm,20 center spacer,6 outer arm,34 outboard spacer and 40 hub stack. The total is 106 before end washer/float. Use a headed 12 mm metal shaft with positive retention and verified hub inner-bearing spacer/endplay. Never run a thread as the bearing journal.\n16. The nominal pin drawing rule uses one 1.5 mm end washer,0.5 axial float and 2 cross-hole: hole center is stack+3 from underhead. Main/stop/lock/upper-shock stacks are 60, lower shock 32 and axle 106. Material, finish fits, head geometry and retainer end ligaments still need an approved finish drawing.\n\n## Inspect before loading\n\n17. Account for every pin, washer, cotter, bolt, locknut and sleeve. Record actual dimensions, fastener grades and supplier batches. Follow a qualified torque procedure after it is established; r0 supplies no guessed torque.\n18. On the independently supported empty rig, unlock and sweep nominal -3 to +6 degrees without forcing a pressurized shock. Check both stop slots, pin heads, tires, body, rails and guards. Preview motion and exploded spacing are inspection views, not cutting dimensions. Manufacturing datums remain neutral.\n19. Your screen preview was ${setup.travel} degrees with the neutral lock ${setup.locked ? 'shown installed' : 'shown removed'}. It does not approve use at that angle or predict ride behavior.\n20. Do not place ballast or an animal in this assembly until engineering review closes the structure, clearances, hardware, failure behavior, guarding and a written test protocol. Harness anchors and padded supports require their own engineering and veterinary fitting work. Suspension softness is not a prescription for hind-leg training or support force.\n\nThe included geometry and instructions are for this setup. Reference dimensions in print notes refer to the unchanged XL part interfaces. No operating capacity, all-terrain test result or animal-use approval follows from a successful digital export.\n`
}

export async function publishXLAssets(root: string): Promise<void> {
  const original = join(root, 'designs/wheelchair/r0')
  const target = join(root, 'public', xlAssetRoot)
  const manifest = await Bun.file(join(original, 'XL/exports.json')).json()
  if (await Bun.file(join(original, 'XL/model.scad')).text() !== wheelchairDocuments(wheelchairFamilies[0]!)['model.scad'])
    throw new Error('XL parameters have changed. Regenerate its CAD before publishing assets.')
  const sourceHash = new Bun.CryptoHasher('sha256').update(await Bun.file(join(original, 'source/wheelchair.scad')).text()).update(await Bun.file(join(original, 'XL/model.scad')).text()).digest('hex')
  if (sourceHash !== manifest.sourceHash)
    throw new Error('XL CAD source has changed. Regenerate its exports before publishing assets.')
  const required = [...cadParts.map(p => `stl/${xlPartFile(p.id)}`), ...cadParts.filter(p => p.category === 'metal').map(p => `dxf/${p.id}.dxf`), 'assembly.png']
  if (required.some(file => !manifest.files.some((entry: { file: string }) => entry.file === file)))
    throw new Error('The XL CAD export set is incomplete.')
  for (const entry of manifest.files as { file: string, sha256: string }[]) {
    if (!/^(?:stl\/(?:FIT_CHECK_ONLY_)?[a-z_]+\.stl|dxf\/[a-z_]+\.dxf|[a-z-]+\.png)$/.test(entry.file))
      throw new Error('Invalid CAD export manifest.')
    const hash = new Bun.CryptoHasher('sha256').update(await Bun.file(join(original, 'XL', entry.file)).arrayBuffer()).digest('hex')
    if (hash !== entry.sha256) throw new Error('An XL CAD export was modified. Regenerate before publishing assets.')
  }
  const assets: { path: string, sha256: string, bytes: number }[] = []
  await mkdir(join(target, 'parts'), { recursive: true })
  await mkdir(join(target, 'metal'), { recursive: true })
  async function copy(from: string, to: string): Promise<void> {
    const bytes = new Uint8Array(await Bun.file(from).arrayBuffer())
    await Bun.write(join(target, to), bytes)
    assets.push({ path: to, sha256: new Bun.CryptoHasher('sha256').update(bytes).digest('hex'), bytes: bytes.length })
  }
  for (const part of cadParts) {
    await copy(join(original, 'XL/stl', xlPartFile(part.id)), `parts/${xlPartFile(part.id)}`)
    if (part.category === 'metal') await copy(join(original, 'XL/dxf', `${part.id}.dxf`), `metal/${part.id}.dxf`)
  }
  await copy(join(original, 'XL/assembly.png'), 'assembly.png')
  await copy(join(original, 'source/wheelchair.scad'), 'wheelchair.scad')
  await copy(join(root, 'docs/engineering/wheelchair-printing-r0.md'), 'print-guide.md')
  const printGuide = (await Bun.file(join(target, 'print-guide.md')).text()).replaceAll('designs/wheelchair/r0/README.md', 'README.md').replaceAll('../product/validation.md', 'validation.md')
  await Bun.write(join(target, 'print-guide.md'), printGuide)
  const printRecord = assets.find(asset => asset.path === 'print-guide.md')!
  printRecord.sha256 = new Bun.CryptoHasher('sha256').update(printGuide).digest('hex')
  printRecord.bytes = new TextEncoder().encode(printGuide).byteLength
  await copy(join(root, 'docs/engineering/printer-options-la.md'), 'printer-options-la.md')
  await copy(join(root, 'docs/product/validation.md'), 'validation.md')
  await Bun.write(join(target, 'manifest.json'), `${JSON.stringify({ status: 'BENCH_ONLY_NOT_ANIMAL_USE', revision: 'r0', sourceHash: manifest.sourceHash, parts: cadParts.map(p => ({ ...p, name: xlPartNames[p.id], file: xlPartFile(p.id) })), assets }, null, 2)}\n`)
}

export async function xlDownload(root: string, artifact: string, setup: XLSetup): Promise<Response> {
  const f = xlSetupFamily(setup)
  const id = xlSetupCode(setup)
  const docs = wheelchairDocuments(f)
  const profile = { id, basis: 'XL', context: { ownerReportedWeightLb: 140, dimensionsAreEstimates: true, fitApproved: false }, overrides: { height: setup.height, width: setup.width, rail: setup.rail }, preview: { leverageSetting: setup.setting, angleDegrees: setup.travel, neutralLock: setup.locked }, status: 'BENCH_ONLY_NOT_ANIMAL_USE' }
  const profileJson = `${JSON.stringify(profile, null, 2)}\n`
  const assembly = xlAssemblyInstructions(setup)
  const headers: Record<string, string> = { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' }
  function attachment(body: BodyInit, type: string, suffix: string): Response {
    return new Response(body, { headers: { ...headers, 'Content-Type': type, 'Content-Disposition': `attachment; filename="buddy-${id}-r0${suffix}"` } })
  }
  if (artifact === 'assembly') return attachment(assembly, 'text/markdown; charset=utf-8', '-assembly.md')
  if (artifact === 'bom') return attachment(docs['bom.csv']!, 'text/csv; charset=utf-8', '-parts.csv')
  if (artifact === 'profile') return attachment(profileJson, 'application/json', '-profile.json')
  if (artifact !== 'kit') return new Response('File not found.', { status: 404 })
  const assetDir = join(root, 'public', xlAssetRoot)
  const manifest = await Bun.file(join(assetDir, 'manifest.json')).json()
  const files: Record<string, string | Uint8Array> = {
    'README.md': `# Buddy XL bench kit\n\nStart with assembly.md. This kit matches height ${setup.height}, rail spacing ${setup.width}, rail length ${setup.rail} and leverage${['A', 'B', 'C'][setup.setting]}. All dimensions mm. Frame changes do not change the printable part geometry. Structural plate STLs are fit-check copies only; their metal DXFs are included. Use the neutral CAD datums for fabrication. No load rating or animal-use approval exists.\n`,
    ...docs,
    'assembly.md': assembly,
    'profile.json': profileJson,
    'model.scad': docs['model.scad']!.replace('../source/wheelchair.scad', 'source/wheelchair.scad'),
    'parameters.json': `${JSON.stringify({ ...f, units: 'mm', status: 'BENCH_ONLY_NOT_ANIMAL_USE' }, null, 2)}\n`,
  }
  const hashes: { file: string, sha256: string, bytes: number }[] = []
  for (const asset of manifest.assets as { path: string, sha256: string }[]) {
    // The manifest is an application artifact, with a second path allowlist at delivery.
    if (!/^(?:parts\/(?:FIT_CHECK_ONLY_)?[a-z_]+\.stl|metal\/[a-z_]+\.dxf|wheelchair\.scad|assembly\.png|print-guide\.md|printer-options-la\.md|validation\.md)$/.test(asset.path))
      throw new Error('Invalid design asset manifest.')
    const bytes = new Uint8Array(await Bun.file(join(assetDir, asset.path)).arrayBuffer())
    if (new Bun.CryptoHasher('sha256').update(bytes).digest('hex') !== asset.sha256)
      throw new Error('Design asset integrity check failed.')
    const name = asset.path === 'wheelchair.scad' ? 'source/wheelchair.scad' : asset.path
    // Set only inspection pose defaults; part geometry and neutral fabrication datums are unchanged.
    files[name] = asset.path === 'wheelchair.scad' ? new TextDecoder().decode(bytes).replace('setting = 1;', `setting = ${setup.setting};`).replace('angle = 0;', `angle = ${setup.travel};`).replace('locked = false;', `locked = ${setup.locked};`) : bytes
  }
  for (const [name, content] of Object.entries(files)) {
    const bytes = typeof content === 'string' ? new TextEncoder().encode(content) : content
    hashes.push({ file: name, sha256: new Bun.CryptoHasher('sha256').update(bytes).digest('hex'), bytes: bytes.length })
  }
  const configuredSourceHash = new Bun.CryptoHasher('sha256').update(files['source/wheelchair.scad'] as string).update(files['model.scad'] as string).digest('hex')
  files['checksums.json'] = `${JSON.stringify({ baselineSourceHash: manifest.sourceHash, configuredSourceHash, setup, status: 'DIGITAL_EXPORT_NOT_PHYSICAL_VALIDATION', files: hashes }, null, 2)}\n`
  return attachment(await new Bun.Archive(files, { compress: 'gzip' }).blob(), 'application/gzip', '.tar.gz')
}
