import { catalog, money } from '../app/Storefront/Catalog'
import { writeRoverEconomics } from './rover-finance'

export interface UnitAssumption {
  code: string
  cogs: number
  shipping: number
  acquisition: number
  support: number
  mix: number
}
export const assumptions: UnitAssumption[] = [
  { code: 'XS', cogs: 5800, shipping: 1200, acquisition: 1800, support: 800, mix: 0.1 },
  { code: 'S', cogs: 7200, shipping: 1400, acquisition: 2000, support: 800, mix: 0.2 },
  { code: 'M', cogs: 9900, shipping: 1600, acquisition: 2500, support: 800, mix: 0.35 },
  { code: 'L', cogs: 12500, shipping: 1800, acquisition: 2500, support: 800, mix: 0.25 },
  { code: 'XL', cogs: 15500, shipping: 2400, acquisition: 2500, support: 1000, mix: 0.1 },
]

/** Management assumptions, not a quoted provider fee or observed claim rate. */
export function unitEconomics(input: UnitAssumption, cogsMultiplier = 1, cacMultiplier = 1) {
  const product = catalog.find(size => size.code === input.code)
  if (!product)
    throw new Error('Unknown product family')
  const cogs = Math.round(input.cogs * cogsMultiplier)
  const fee = Math.round(product.price * 0.029) + 30
  const reserve = Math.round(product.price * 0.05)
  const acquisition = Math.round(input.acquisition * cacMultiplier)
  return { code: input.code, revenue: product.price, cogs, gross: product.price - cogs, fee, reserve, shipping: input.shipping, acquisition, support: input.support, contribution: product.price - cogs - fee - reserve - input.shipping - acquisition - input.support }
}

export function scenario(units: number, cogsMultiplier = 1, cacMultiplier = 1) {
  if (!Number.isSafeInteger(units) || units < 0)
    throw new Error('Units must be a nonnegative integer')
  let assigned = 0
  const rows = assumptions.map((item, index) => {
    const count = index === assumptions.length - 1 ? units - assigned : Math.floor(units * item.mix)
    assigned += count
    return { ...unitEconomics(item, cogsMultiplier, cacMultiplier), count }
  })
  const revenue = rows.reduce((sum, row) => sum + row.revenue * row.count, 0)
  const contribution = rows.reduce((sum, row) => sum + row.contribution * row.count, 0)
  const annualFixed = 150000 * 12
  return { units, revenue, contribution, annualFixed, operating: contribution - annualFixed }
}

if (import.meta.main) {
  await writeRoverEconomics()
  const units = assumptions.map(item => unitEconomics(item))
  const weightedContribution = assumptions.reduce((sum, item) => sum + unitEconomics(item).contribution * item.mix, 0)
  const rows = units.map(row => `| ${row.code} | ${money(row.revenue)} | ${money(row.cogs)} | ${money(row.gross)} | ${money(row.shipping)} | ${money(row.fee)} | ${money(row.reserve)} | ${money(row.acquisition)} | ${money(row.support)} | ${money(row.contribution)} |`).join('\n')
  const scenarios = [scenario(60), scenario(200), scenario(600), scenario(200, 1.2, 1.5)].map((row, index) => `| ${index === 3 ? 'Downside costs, 200 kits' : `${row.units} kits`} | ${money(row.revenue)} | ${money(row.contribution)} | ${money(row.annualFixed)} | ${row.operating < 0 ? '-' : ''}${money(Math.abs(row.operating))} |`).join('\n')
  const markdown = `# Unit economics and scenarios\n\nGenerated from scripts/finance.ts with native Bun. All figures are planning assumptions, not measured costs or forecasts. USD, integer cents. No spending is authorized.\n\n| Size | Target | COGS | Gross profit | Delivery subsidy | Fee assumption | Reserve | Acquisition | Support | Contribution |\n| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |\n${rows}\n\nMix: XS 10%, S 20%, M 35%, L 25%, XL 10%. Approximate weighted contribution: ${money(Math.round(weightedContribution))} per kit. At an assumed $1,500 monthly fixed operating cost, break-even is ${Math.ceil(150000 / weightedContribution)} kits per month. Fixed cost excludes founder salary, tax, financing and startup validation.\n\n| Illustrative annual case | Revenue | Contribution | Fixed overhead | Operating result |\n| --- | ---: | ---: | ---: | ---: |\n${scenarios}\n\nThe downside case raises COGS 20% and acquisition cost 50%. It does not change price or include all possible risks. Unit counts use exact integer allocations, with the remainder assigned to XL. Startup validation of $32,000 is separate from operating results. No digital-file or repeat-purchase revenue is assumed.\n\nThe [one-off XL suspension prototype budget](xl-prototype-build-budget.md) prices a separate r0 custom bench rig, including equipment and development allowances. The production targets below do not price that rig and remain unquoted.\n\nCOGS must include purchased parts, printed material, failed-print allocation, machine capacity, assembly, inspection and packaging. Delivery and support are separate. The 2.9% + $0.30 fee and 5% warranty/return reserve are management inputs, not a processor quote or observed failure rate. Replace each with evidence before committing a production batch.\n\nFor the L family the $125 COGS allocation is: printed material $12, rails $18, wheels/axles $38, soft supports $22, fasteners $8, machine/reject allowance $6, assembly $11, QA $5 and packaging $5. These allocations sum to $125 and remain unquoted. XS/S/M/XL are top-down COGS envelopes until their BOMs are priced.\n\nCapacity example: two printers × 16 available hours/day × 22 days × 70% productive utilization = 492.8 productive printer hours/month. At an assumed eight hours per kit that is at most 61 complete print sets/month before assembly or demand constraints. These are assumptions; time an actual qualified build before purchasing capacity.\n`
  await Bun.write(new URL('../docs/business/unit-economics.md', import.meta.url), markdown)
  console.log(markdown)
}
