import type {SoftSetup} from './SoftGoods'
import {softStart} from './SoftGoods'
import {xlSoftFrame} from './SoftGoodsFrame'
import {textileCostNotes} from './SoftGoodsCost'
import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { inspectBinaryStl } from './Mesh'
import { standardDocuments } from './XLStandardDocuments'
import type { StandardSetup } from './XLStandard'
import { standardDimensions, standardParts, standardPartFile, standardStart } from './XLStandard'
import { pricedStandardLines, standardEconomics, standardPriceDate, standardPriceEvidence } from './XLStandardCost'
import { signedMoney as money } from '../Storefront/Catalog'
export const standardSourcePath = 'designs/wheelchair/r1/XL'
export const standardPublicPath = 'public/designs/xl/r1'
export const sha256 = (bytes: string | ArrayBuffer | Uint8Array) => new Bun.CryptoHasher('sha256').update(bytes).digest('hex')
export function standardCostMarkdown(setup: StandardSetup = standardStart,goods?:SoftSetup): string {
  const batch = standardEconomics(setup,100,goods); const one = standardEconomics(setup, 1,goods)
  const lines = [{ name: '6061-T6 tube stock, complete bars with 3 mm kerf', batch: batch.frame, one: one.frame, evidence: 'Observed price + computed whole-stock nesting', note: `${batch.packing.bars} full 144 inch bars /100 chairs. One-off buys ${one.packing.bars} full bar. Offcuts are charged, not free material.` }, ...pricedStandardLines(setup,goods)]
  return `# XL r1 standard-parts cost and retail feasibility

Checked ${standardPriceDate}, USD. Native Bun calculation, integer cents. r1 is a rigid, cut-to-fit bench design. This is a manufacturing scenario, not a verified production price, capacity rating or animal-use release.

Configuration: rail height ${setup.height}, rail spacing ${setup.width}, rail length ${setup.rail}, provisional hub ${setup.hub}, all mm. Hub and anatomy still require physical measurement.

## Result and conditions

At 100 chairs, estimated landed manufacturing COGS is **${money(batch.cogs)} per chair**, against **${money(batch.retail)} retail**. Product gross margin is ${batch.grossPercent.toFixed(1)}%. The minimum 30% gross-margin gate allows COGS up to ${money(batch.maxCogs)}; modeled headroom is ${money(batch.headroom)}. ${batch.meetsCostGate ? 'The scenario meets the numerical gate.' : 'The scenario FAILS the numerical gate.'} Production times, compatibility and freight are still unquoted. Cost feasibility is CONDITIONAL until itemized quotes and measured production times replace those allowances.

A single chair at retail-stock purchase quantities is estimated at ${money(one.cogs)} before any applicable purchase tax and outbound freight. It does not support a ${money(batch.retail)} selling price. This redesign depends on a 100-chair batch, standardization and repeatable fixtures. Nothing has been bought and no batch is authorized.

The previous r0 estimate was $1,455 in hardware/consumables before assembly. Its separate [capital-inclusive first-rig budget](https://buddywheels.org/prototype-budget) remains a historical r0 study. r1 is a different architecture; removing a printer charge alone did not create these savings.

## Complete per-chair manufacturing model

| Recurring line | One chair |100-chair allocation | Evidence |
| --- | ---: | ---: | --- |
${lines.map(l => `| ${l.name} | ${money(l.one)} | ${money(l.batch)} | ${l.evidence} |`).join('\n')}
| **Landed manufacturing COGS** | **${money(one.cogs)}** | **${money(batch.cogs)}** | Mostly unquoted |

${lines.map(l => `- **${l.name}:** ${l.note}`).join('\n')}

Assembly labor is charged. Printing includes consumed material, failed-print allowance and power, not a fresh printer or full spool per chair. Inbound freight, packaging, inspection and machine/tool wear are included. Manufacturing is modeled under a valid resale purchase arrangement; seller purchase-tax treatment must be confirmed. Customer sales tax is not revenue. Actual nonrecoverable taxes, if any, must be added. Reusable capital, design qualification and startup overhead remain separate; no claim that they disappear economically.

## Actual whole-bar purchasing

The 100-chair setup uses ${batch.packing.bars} bars x $60.03 = ${money(batch.stockPurchase)}. Net tube is ${batch.packing.netMm} mm, kerf ${batch.packing.kerfMm} mm, purchased stock ${batch.packing.stockMm} mm. First-fit decreasing nests two rails, two posts and one bridge per chair. The model charges every leftover and rounds per-chair stock cost UP to cents. It assumes no wholesale discount. Check long-stock freight before committing; the inbound allowance is unquoted. Different frame dimensions update nesting and can fail the margin gate.

## Selling-cost reconciliation

| Item | Per chair |
| --- | ---: |
| Retail, excluding sales tax | ${money(batch.retail)} |
| Landed manufacturing | ${money(batch.cogs)} |
| Product gross profit | ${money(batch.gross)} |
| Payment fee assumption, 2.9% + $0.30 | ${money(batch.fee)} |
| Warranty/returns reserve, 5% | ${money(batch.warranty)} |
| Customer support allowance | ${money(batch.support)} |
| Acquisition allowance | ${money(batch.acquisition)} |
| **Contribution before fixed overhead** | **${money(batch.contribution)}** |
| Contribution if we also subsidize $24 delivery | ${money(batch.freeShippingContribution)} |

Outbound shipping is charged separately at actual cost in the base scenario. It is not hidden in the chair price. The current storefront accepts no orders. These numbers are not take-home profit: insurance, clinical/engineering qualification, salaries, facility costs and ongoing compliance/quality systems still need a funded business model. Free delivery or higher acquisition costs can consume the remaining contribution. A20% manufacturing overrun reduces contribution by ${money(Math.round(batch.cogs * 0.2))}.

## Online supplier evidence, checked ${standardPriceDate}

${standardPriceEvidence.map(e => `- [${e.name}](${e.url}): **${money(e.price)}**, ${e.unit}. ${e.note}`).join('\n')}

The tube/wheel evidence is listed above; the textile price candidates are itemized below. Hardware, precision plain shaft stock, sleeve stock, steel cutting/finish, completed textile production, labor and freight require RFQs. The rejected bolt/spacer/RC examples are price comparisons, not purchased or included substitutions. Listings are not checkout quotes or guaranteed local stock. No unverified wholesale reduction is represented as a supplier price.

## Adjustable suspension decision

There is no independent adjustable suspension in the r1 base. Current modeled cost headroom is ${money(batch.headroom)} at the 30% gross-margin gate. The previously designed r0 matched shock pair alone carried a $220 allowance, before arms, pivots and mounts. Even the rejected$19.99 RC listing exceeds this headroom and supplies no evidence of safe dog-support tuning. Pneumatic tires provide compliance, not independently adjustable suspension or prescribed rehabilitation support.

The [r0 suspension studio](https://buddywheels.org/design-studio?size=XL) remains available as a separate research design. Reintroduce a suspension option only after a supplier-approved load/tune/interface drawing, complete installed BOM, fatigue/stability tests and a sustainable option price. Do not show its controls or include its parts in the r1 rigid kit.

## Manufacturing and fit gates

1. Confirm Buddy's measurements and clinical suitability. Frame height is not supported groin height. No 140 lb working rating exists.
2. Approve drawings for the frame joints, tube sleeves, stock-shaft bearing fits and positive cotter retention. Review aluminum/steel corrosion interfaces and finish procedures. Verify actual wheel hub length, offset, runout and tire clearance.
3. Obtain 12-profile steel, axle/sleeve finishing, standard hardware, complete support/anchor, labor and freight RFQs at 100 units. The old $24 textile allowance is replaced by the itemized candidate-material and assumed sewing model below. This is not an approved or purchasable completed harness. Review the actual continuous-webbing load path and anti-slide design.
4. Build one guarded empty rig; qualify structure, joint slip, bearing wear, retention, stability, fatigue and intended terrain using an approved protocol before any animal. Garden-wheel ratings do not qualify a wheelchair. Two candidate wheels alone weigh 9.4 lb, so rolling resistance, total mass and handling require comparison with lighter wheels.
5. Time actual cuts, drilling, assembly, prints and inspection. Replace every allowance. Release only when both physical qualification and the margin gate pass. Digital exports and a low spreadsheet total are insufficient.

${textileCostNotes(xlSoftFrame(setup,'r1'),goods??softStart(xlSoftFrame(setup,'r1')))}

Build/research commands: \`./buddy design:xl-standard --export --openscad /absolute/path/to/OpenSCAD\`, \`./buddy test\`, \`bun run test:standard\`. See the [r1 studio](https://buddywheels.org/design-studio-xl) for exact configured CAD, BOM and instructions. Other sizes remain r0.
`
}
export function standardCostModel(setup: StandardSetup = standardStart,goods?:SoftSetup) { return { checked: standardPriceDate, setup, base: standardEconomics(setup,100,goods), one: standardEconomics(setup, 1,goods), lines: pricedStandardLines(setup,goods), evidence: standardPriceEvidence } }
export function standardCostCsv(setup: StandardSetup = standardStart,goods?:SoftSetup): string {
  const model = standardCostModel(setup,goods)
  return [['Line', 'One-chair dollars', '100-chair dollars', 'Evidence'], ['Tube stock', String(model.one.frame / 100), String(model.base.frame / 100), 'Observed full-bar price + computed nesting'], ...pricedStandardLines(setup,goods).map(l => [l.name, (l.one / 100).toFixed(2), (l.batch / 100).toFixed(2), l.evidence]), ['TOTAL', (model.one.cogs / 100).toFixed(2), (model.base.cogs / 100).toFixed(2), 'Unquoted manufacturing scenario']].map(row => row.map(v => `"${v.replaceAll('"', '""')}"`).join(',')).join('\n') + '\n'
}
export async function writeStandardCosts(root: string): Promise<void> {
  const markdown = standardCostMarkdown()
  await Bun.write(join(root, 'docs/business/xl-standard-r1-costs.md'), markdown)
  await Bun.write(join(root, standardPublicPath, 'cost-notes.md'), markdown)
  const model = standardCostModel()
  await Bun.write(join(root, standardPublicPath, 'cost-model.json'), JSON.stringify(model, null, 2) + '\n')
  const csv = standardCostCsv()
  await Bun.write(join(root, 'docs/business/xl-standard-r1-costs.csv'), csv)
  await Bun.write(join(root, standardPublicPath, 'costs.csv'), csv)
}
export async function buildStandardCad(root: string, executable?: string): Promise<void> {
  const dir = join(root, standardSourcePath); const pub = join(root, standardPublicPath)
  await mkdir(join(dir, 'parts'), { recursive: true }); await mkdir(join(dir, 'metal'), { recursive: true })
  for (const [name, content] of Object.entries(standardDocuments(standardStart))) await Bun.write(join(dir, name), content)
  await writeStandardCosts(root)
  if (!executable) return
  const version = Bun.spawnSync([executable, '--version'])
  if (version.exitCode !== 0) throw new Error('OpenSCAD executable did not start.')
  const assets: { path: string, sha256: string, bytes: number }[] = []
  const meshes: { file: string, inspection: ReturnType<typeof inspectBinaryStl> }[] = []
  async function exportFile(path: string, args: string[]) {
    const proc = Bun.spawn([executable!, ...args, '-o', join(dir, path), join(dir, 'model.scad')], { env: { ...process.env, QT_QPA_PLATFORM: 'offscreen' }, stdout: 'pipe', stderr: 'pipe' })
    const [code, out, err] = await Promise.all([proc.exited, new Response(proc.stdout).text(), new Response(proc.stderr).text()])
    if (code || /ERROR:|WARNING:/.test(err)) throw new Error(`r1 export ${path} failed: ${out}\n${err}`)
    const bytes = new Uint8Array(await Bun.file(join(dir, path)).arrayBuffer())
    if (bytes.length < 100) throw new Error('Empty CAD export.')
    if (path.endsWith('.stl')) {
      const inspection = inspectBinaryStl(bytes.buffer)
      if (!inspection.closed || !inspection.consistentlyOriented || inspection.components !== 1 || inspection.signedVolumeMm3 <= 0 || inspection.boundsMm.size.some((n, i) => n > (i === 2 ? 100 : 220))) throw new Error(`r1 mesh check failed: ${path}`)
      meshes.push({ file: path, inspection })
    }
    await Bun.write(join(pub, path), bytes)
    assets.push({ path, sha256: sha256(bytes), bytes: bytes.length })
  }
  for (const p of standardParts) {
    await exportFile('parts/' + standardPartFile(p.id), ['-D', `part="${p.id}"`, '--export-format', 'binstl'])
    if (p.kind === 'metal') await exportFile(`metal/${p.id}.dxf`, ['-D', `part="${p.id}"`, '-D', 'projection_mode=true'])
  }
  await exportFile('assembly.png', ['-D', 'part="assembly"', '--imgsize=1400,1000', '--viewall', '--autocenter', '--colorscheme=Tomorrow', '--camera=0,0,300,65,0,35,1800'])
  for (const path of ['source/standard.scad', 'model.scad', 'assembly.md', 'bom.csv', 'drilling.csv', 'setup.json']) {
    const bytes = new Uint8Array(await Bun.file(join(dir, path)).arrayBuffer())
    await Bun.write(join(pub, path), bytes)
    assets.push({ path, sha256: sha256(bytes), bytes: bytes.length })
  }
  for (const path of ['cost-notes.md', 'cost-model.json', 'costs.csv']) {
    const bytes = new Uint8Array(await Bun.file(join(pub, path)).arrayBuffer())
    assets.push({ path, sha256: sha256(bytes), bytes: bytes.length })
  }
  const sourceHash = sha256(await Bun.file(join(dir, 'source/standard.scad')).text() + standardDocuments(standardStart)['model.scad'])
  const manifest = { revision: 'r1', size: 'XL', status: 'BENCH_ONLY_NOT_ANIMAL_USE', suspension: 'rigid', sourceHash, costHash: sha256(JSON.stringify(standardCostModel())), setup: standardStart, dimensions: standardDimensions(standardStart), assets, parts: standardParts }
  await Bun.write(join(pub, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n')
  await Bun.write(join(dir, 'exports.json'), JSON.stringify(manifest, null, 2) + '\n')
  await Bun.write(join(dir, 'mesh-inspection.json'), JSON.stringify({ sourceHash, status: 'DIGITAL_GEOMETRY_ONLY', meshes }, null, 2) + '\n')
}
