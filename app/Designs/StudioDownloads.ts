import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import type { StudioSetup, StudioSize } from './StudioSetup'
import { studioAssetRoot, studioPartFile, studioPartNames, studioSetupCode, studioSetupFamily } from './StudioSetup'
import { cadParts, wheelchairFamilies } from './WheelchairParameters'
import { wheelchairDocuments } from './Wheelchair'

export function studioAssemblyInstructions(setup: StudioSetup): string {
  const f = studioSetupFamily(setup)
  const R = f.wheel / 2
  const lower = f.height - R - (2 * f.pitch + 20) - 25
  const uprightTop = f.height - (2 * f.pitch + 20)
  const armSpan = f.eyeWidth + 2 * f.armPlate
  const pinSpan = f.gap + 2 * f.plate
  const axleSpacer = f.wheelOffset - f.hubWidth / 2 - armSpan / 2
  const axleSpan = armSpan + axleSpacer + f.hubWidth
  const crossHole = f.size === 'XS' ? 1 : 2
  const n = (value: number) => Math.round(value * 1000) / 1000
  const overlap = f.innerLength + f.tube / 2 - (2 * f.pitch + 20)
  const bridge = (f.width - f.tube) * 0.7
  return `# Your ${f.size} bench assembly\n\nConfiguration ${studioSetupCode(setup)}, revision r0. All dimensions mm.\n\nBENCH PROTOTYPE. NOT FOR ANIMAL USE. ${f.size === 'XL' ? 'Buddy is owner-reported 140 lb. ' : ''}Frame dimensions are configurable bench estimates, not an individually measured fit or a safe load rating. Exact shock/wheel/harness selections, finish tolerances, fastener procedures and engineering tests remain outstanding.\n\nUse the [parts list](bom.csv), [drilling coordinates](tube-drilling.csv) and [print guide](print-guide.md) alongside these steps.\n\n![Assembly layout reference](assembly.png)\n\nLayout reference only. Use your configuration table below for dimensions.\n\n## Your dimensions\n\n| Item | Value |\n| --- | ---: |\n| Rail center height | ${f.height} |\n| Rail center spacing | ${f.width} |\n| Inner rail clearance | ${f.width - f.tube} |\n| Side rail cut length, quantity 2 | ${f.rail} |\n| Lower upright cut length, quantity 2 | ${lower} |\n| Upper upright cut length, quantity 2 | ${f.innerLength} |\n| Each bridge tube cut length | ${bridge} |\n| Nominal upright overlap | ${overlap} |\n| Nominal bridge overlap | ${(f.width - f.tube) * 0.4} |\n| Wheel outside diameter | ${f.wheel} |\n| Overall tire envelope | ${f.width + 2 * f.wheelOffset + f.tireWidth} |\n\n## Print and prepare\n\n1. Print the calibration coupon first at 1:1 mm scale. Check bores against the print guide. All ten part types fit a 220 x 220 x 100 mm box; the ${f.size} arm copy is ${f.arm + 24} mm long. Do not scale the meshes.\n2. Printable service/fixture parts: four tube caps, one inner cap, two setup markers, four sample pivot shields, one layout jig, one coupon and two rigid shock eye gauges. The marker and guards carry no support load. Caps may be spares; do not cap telescoping entries.\n3. The four fixed-cheek, four arm-cheek and eight corner-cheek copies prefixed FIT_CHECK_ONLY are unloaded plastic layout aids. Fabricate their metal counterparts from the matching DXFs only after drawing review. No printed spring, primary shock mount, axle or harness anchor is approved.\n4. Cut the metal tubes using your table above and bom.csv. Use tube-drilling.csv for hole datums. ${f.size} tube holes are nominal ${n(f.frameBolt + 2.2)} for OD${f.frameBolt + 2}/ID${n(f.frameBolt + 0.2)} metal crush sleeves; cheek bolt holes are ${n(f.frameBolt + 0.4)}. Review fits and bearing strength before fabrication. The printed jig is a spacing/layout aid, not a final drill bushing.\n\n## Assemble the empty frame\n\n5. Orient X rearward, Y across the frame and Z upward. Place rail centers ${f.width} apart at Z=${f.height}. Each side rail runs from X=${-(f.rail - 80)} to X=80. Rear bridge centerline is X=60.\n6. At X=0 join each upper upright to its rail with paired metal corner cheeks. Upper tube ends touch the rail underside at Z=${f.height - f.tube / 2}. Rail cheek holes lie at X=${-2 * f.pitch} and ${-f.pitch}; upright holes at Z=${f.height - 2 * f.pitch} and ${f.height - f.pitch}. Use eight total corner-joint through-bolt sets, metal crush sleeves and ${(f.tube - f.inner) / 2} mm spacers at both faces of the smaller tubes.\n7. Place the bridge between the side-rail inner faces, with clear span ${f.width - f.tube}. The ${f.tube}x${f.wall} outer tube starts at the left rail and ${f.inner}x${f.innerWall} inner tube ends at the right rail. Their overlap is ${(f.width - f.tube) * 0.4}. Add paired corner cheeks above/below each end, pointing forward/inward, with eight joint bolts and the smaller-tube spacers at the right end.\n8. Match-drill the separate bridge index pair at Y=${-f.pitch / 2} and +${f.pitch / 2} using the schedule. Fit its two removable metal sleeves and retained through-bolts. Width retention is not friction-only.\n9. Slide lower uprights over upper sections. Lower outer ends sit at Z=${R + 25}, upper ends at Z=${uprightTop}; nominal overlap is ${overlap}. Install two sleeved index bolts per side at Z=${uprightTop - 20 - f.pitch} and ${uprightTop - 20}. No extra adjustment rows are approved.\n\n## Assemble the wheel modules\n\n10. Place two fixed suspension cheeks per side with ${f.gap} clear gap around the ${f.tube} mm upright. Fit ${(f.gap - f.tube) / 2} mm metal spacers on each face at the two mount bolts. Pivot axes are X=0,Z=${R}; attachment holes are Z=${R + 35} and ${R + 65}.\n11. Fit a ${f.pivot} ID/${f.pivotBore} OD/${f.armPlate} long bronze pivot bush in each ${f.armPlate} mm arm cheek after finish-fit review. Keep arm cheeks ${f.eyeWidth} apart internally, with a ${f.eyeWidth} mm center pivot spacer and ${(f.gap - armSpan) / 2} mm outer spacers. Install the headed pivot pin with positive end washer/cotter retention across the ${pinSpan} mm stack.\n12. With the rig independently supported, align arms horizontally. Insert the separate neutral lock pin at radius ${f.lockR} with its center spacer and positive retainer. Add the retained stop pin at radius ${f.stopR} through both slots and arms. Do not squeeze the moving slot faces together.\n13. Your selected leverage is ${['A', 'B', 'C'][setup.setting]} at radius ${f.radii[setup.setting]}. Both upper and lower shock eyes must use this same radius on both sides. Upper eye is Z=${R + f.shockNeutral}, lower eye Z=${R} at neutral. Requested shock interface: ${f.shockFull} extended eyes, ${f.shockStroke} stroke, ${f.shockNeutral} installed eyes, ${f.eyeBolt} pin, ${f.eyeWidth} eye width and maximum ${f.shockOd} body. These are RFQ dimensions, not an approved compatible SKU. Use the rigid printed gauge for unloaded fit checks only.\n14. Use ${(f.gap - f.eyeWidth) / 2} mm upper-eye metal spacers and correctly retained eye pins; verify actual eye running clearance. Spring rate/air pressure, preload and damping depend on the selected supplier and separate engineering calibration. No animal-use setting is provided.\n15. Fit each axle through a ${f.armPlate} mm inner arm, ${f.eyeWidth} center spacer, ${f.armPlate} outer arm, ${axleSpacer} outboard spacer and ${f.hubWidth} hub stack. The total is ${axleSpan} before end washer/float. Use a headed ${f.axle} mm metal shaft with positive retention and verified hub inner-bearing spacer/endplay. Never run a thread as the bearing journal.\n16. The nominal pin drawing rule uses one 1.5 mm end washer,0.5 axial float and ${crossHole} cross-hole: hole center is stack+${2 + crossHole / 2} from underhead. Main/stop/lock/upper-shock stacks are ${pinSpan}, lower shock ${armSpan} and axle ${axleSpan}. Material, finish fits, head geometry and retainer end ligaments still need an approved finish drawing.\n\n## Inspect before loading\n\n17. Account for every pin, washer, cotter, bolt, locknut and sleeve. Record actual dimensions, fastener grades and supplier batches. Follow a qualified torque procedure after it is established; r0 supplies no guessed torque.\n18. On the independently supported empty rig, unlock and sweep nominal -3 to +6 degrees without forcing a pressurized shock. Check both stop slots, pin heads, tires, body, rails and guards. Preview motion and exploded spacing are inspection views, not cutting dimensions. Manufacturing datums remain neutral.\n19. Your screen preview was ${setup.travel} degrees with the neutral lock ${setup.locked ? 'shown installed' : 'shown removed'}. It does not approve use at that angle or predict ride behavior.\n20. Do not place ballast or an animal in this assembly until engineering review closes the structure, clearances, hardware, failure behavior, guarding and a written test protocol. Harness anchors and padded supports require their own engineering and veterinary fitting work. Suspension softness is not a prescription for hind-leg training or support force.\n\nThe included geometry and instructions are for this setup. Reference dimensions in print notes refer to the unchanged ${f.size} part interfaces. No operating capacity, all-terrain test result or animal-use approval follows from a successful digital export.\n`
}

export async function publishStudioFamilyAssets(root: string, size: StudioSize): Promise<void> {
  const family = wheelchairFamilies.find(f => f.size === size)!
  const original = join(root, 'designs/wheelchair/r0')
  const target = join(root, 'public', studioAssetRoot(size))
  const manifest = await Bun.file(join(original, `${size}/exports.json`)).json()
  if (await Bun.file(join(original, `${size}/model.scad`)).text() !== wheelchairDocuments(family)['model.scad'])
    throw new Error(`${size} parameters have changed. Regenerate its CAD before publishing assets.`)
  const sourceHash = new Bun.CryptoHasher('sha256').update(await Bun.file(join(original, 'source/wheelchair.scad')).text()).update(await Bun.file(join(original, `${size}/model.scad`)).text()).digest('hex')
  if (sourceHash !== manifest.sourceHash)
    throw new Error(`${size} CAD source has changed. Regenerate its exports before publishing assets.`)
  const required = [...cadParts.map(p => `stl/${studioPartFile(p.id)}`), ...cadParts.filter(p => p.category === 'metal').map(p => `dxf/${p.id}.dxf`), 'assembly.png']
  if (required.some(file => !manifest.files.some((entry: { file: string }) => entry.file === file)))
    throw new Error(`The ${size} CAD export set is incomplete.`)
  for (const entry of manifest.files as { file: string, sha256: string }[]) {
    if (!/^(?:stl\/(?:FIT_CHECK_ONLY_)?[a-z_]+\.stl|dxf\/[a-z_]+\.dxf|[a-z-]+\.png)$/.test(entry.file))
      throw new Error('Invalid CAD export manifest.')
    const hash = new Bun.CryptoHasher('sha256').update(await Bun.file(join(original, size, entry.file)).arrayBuffer()).digest('hex')
    if (hash !== entry.sha256) throw new Error(`A ${size} CAD export was modified. Regenerate before publishing assets.`)
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
    await copy(join(original, `${size}/stl`, studioPartFile(part.id)), `parts/${studioPartFile(part.id)}`)
    if (part.category === 'metal') await copy(join(original, `${size}/dxf`, `${part.id}.dxf`), `metal/${part.id}.dxf`)
  }
  await copy(join(original, `${size}/assembly.png`), 'assembly.png')
  await copy(join(original, 'source/wheelchair.scad'), 'wheelchair.scad')
  await copy(join(root, 'docs/engineering/wheelchair-printing-r0.md'), 'print-guide.md')
  const printGuide = (await Bun.file(join(target, 'print-guide.md')).text()).replaceAll('designs/wheelchair/r0/README.md', 'README.md').replaceAll('../product/validation.md', 'validation.md').replaceAll('For XL: 6.1, 6.2, 6.3, 6.4 mm.', `For ${size}: ${[0.1, 0.2, 0.3, 0.4].map(clearance => (family.frameBolt + clearance).toFixed(1)).join(', ')} mm.`).replaceAll('For XL: 20.6 mm insertion square, 29 mm flange.', `For ${size}: ${(family.tube - 2 * family.wall - 0.4).toFixed(1)} mm insertion square, ${family.tube + 4} mm flange.`).replaceAll('BW XL r0 BENCH', `BW ${size} r0 BENCH`).replaceAll('`exports.json`', '`checksums.json`').replaceAll('https://buddywheels.org/guides/industrial-design-refinement.md', 'industrial-design.md')
  await Bun.write(join(target, 'print-guide.md'), printGuide)
  const printRecord = assets.find(asset => asset.path === 'print-guide.md')!
  printRecord.sha256 = new Bun.CryptoHasher('sha256').update(printGuide).digest('hex')
  printRecord.bytes = new TextEncoder().encode(printGuide).byteLength
  await copy(join(root, 'docs/engineering/industrial-design-refinement.md'), 'industrial-design.md')
  await copy(join(root, 'docs/engineering/printer-options-la.md'), 'printer-options-la.md')
  await copy(join(root, 'docs/product/validation.md'), 'validation.md')
  await Bun.write(join(target, 'manifest.json'), `${JSON.stringify({ size, status: 'BENCH_ONLY_NOT_ANIMAL_USE', revision: 'r0', sourceHash: manifest.sourceHash, parts: cadParts.map(p => ({ ...p, name: studioPartNames[p.id], file: studioPartFile(p.id) })), assets }, null, 2)}\n`)
}

export async function studioDownload(root: string, artifact: string, setup: StudioSetup): Promise<Response> {
  const f = studioSetupFamily(setup)
  const id = studioSetupCode(setup)
  const docs = wheelchairDocuments(f)
  const profile = { id, basis: setup.size, context: { ...(setup.size === 'XL' ? { ownerReportedWeightLb: 140 } : {}), dimensionsAreEstimates: true, fitApproved: false }, overrides: { height: setup.height, width: setup.width, rail: setup.rail }, preview: { leverageSetting: setup.setting, angleDegrees: setup.travel, neutralLock: setup.locked }, status: 'BENCH_ONLY_NOT_ANIMAL_USE' }
  const profileJson = `${JSON.stringify(profile, null, 2)}\n`
  const assembly = studioAssemblyInstructions(setup)
  const headers: Record<string, string> = { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' }
  function attachment(body: BodyInit, type: string, suffix: string): Response {
    return new Response(body, { headers: { ...headers, 'Content-Type': type, 'Content-Disposition': `attachment; filename="buddy-${id}-r0${suffix}"` } })
  }
  if (artifact === 'assembly') return attachment(assembly, 'text/markdown; charset=utf-8', '-assembly.md')
  if (artifact === 'bom') return attachment(docs['bom.csv']!, 'text/csv; charset=utf-8', '-parts.csv')
  if (artifact === 'profile') return attachment(profileJson, 'application/json', '-profile.json')
  if (artifact !== 'kit') return new Response('File not found.', { status: 404 })
  const assetDir = join(root, 'public', studioAssetRoot(setup.size))
  const manifest = await Bun.file(join(assetDir, 'manifest.json')).json()
  const files: Record<string, string | Uint8Array> = {
    'README.md': `# Buddy ${setup.size} bench kit\n\nStart with assembly.md. This kit matches height ${setup.height}, rail spacing ${setup.width}, rail length ${setup.rail} and leverage ${['A', 'B', 'C'][setup.setting]}. All dimensions mm. Frame changes do not change the printable part geometry. Structural plate STLs are fit-check copies only; their metal DXFs are included. Use the neutral CAD datums for fabrication. No load rating or animal-use approval exists.\n`,
    ...docs,
    'assembly.md': assembly,
    'profile.json': profileJson,
    'model.scad': docs['model.scad']!.replace('../source/wheelchair.scad', 'source/wheelchair.scad'),
    'parameters.json': `${JSON.stringify({ ...f, units: 'mm', status: 'BENCH_ONLY_NOT_ANIMAL_USE' }, null, 2)}\n`,
  }
  const hashes: { file: string, sha256: string, bytes: number }[] = []
  for (const asset of manifest.assets as { path: string, sha256: string }[]) {
    // The manifest is an application artifact, with a second path allowlist at delivery.
    if (!/^(?:parts\/(?:FIT_CHECK_ONLY_)?[a-z_]+\.stl|metal\/[a-z_]+\.dxf|wheelchair\.scad|assembly\.png|print-guide\.md|industrial-design\.md|printer-options-la\.md|validation\.md)$/.test(asset.path))
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

export async function publishStudioAssets(root: string): Promise<void> {
  for (const family of wheelchairFamilies) await publishStudioFamilyAssets(root, family.size as StudioSize)
}
