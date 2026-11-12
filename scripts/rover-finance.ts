import { roverConfigurations } from '../app/Storefront/Catalog'

const inputs = [
  { code: 'run', cogs: 21000, shipping: 3500, support: 1500 },
  { code: 'coast', cogs: 24500, shipping: 4000, support: 1700 },
  { code: 'snow', cogs: 28500, shipping: 4500, support: 2000 },
  { code: 'all-season', cogs: 34500, shipping: 5500, support: 2300 },
]
const dollars = (cents: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100)

export function roverUnitEconomics(code: string, costMultiplier = 1) {
  const product = roverConfigurations.find(item => item.code === code)
  const input = inputs.find(item => item.code === code)
  if (!product || !input || !Number.isFinite(costMultiplier) || costMultiplier <= 0)
    throw new Error('Choose a known Rover configuration and positive cost multiplier.')
  const cogs = Math.round(input.cogs * costMultiplier)
  const fee = Math.round(product.price * 0.029 + 30)
  const reserve = Math.round(product.price * 0.05)
  const acquisition = 3500
  return { code, price: product.price, cogs, shipping: input.shipping, support: input.support, fee, reserve, acquisition, contribution: product.price - cogs - input.shipping - input.support - fee - reserve - acquisition }
}

export async function writeRoverEconomics() {
  const rows = roverConfigurations.map(item => {
    const row = roverUnitEconomics(item.code)
    return `| ${item.label} | ${[row.price, row.cogs, row.shipping, row.fee, row.reserve, row.acquisition, row.support, row.contribution, roverUnitEconomics(item.code, 1.2).contribution].map(dollars).join(' | ')} |`
  }).join('\n')
  await Bun.write(new URL('../docs/business/rover-unit-economics.md', import.meta.url), `# Buddy Rover unit economics\n\nGenerated with bun run finance. All inputs are management assumptions, not supplier, freight or processor quotations. No physical Rover has been manufactured or qualified. Prices are provisional commercial inputs.\n\n| Setup | Price | COGS | Freight | Fees | Reserve | Acquisition | Support | Contribution | COGS +20% contribution |\n| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |\n${rows}\n\nFees assume 2.9% plus $0.30; reserve assumes 5% of product revenue. Tax collected is not revenue. COGS must cover the chassis, cabin, running gear, all included conversion parts, qualified printing, rejects, assembly, QA and packaging. Freight is a cost assumption, not a customer delivery quote. Acquisition is $35 per first order. Returns, dimensional freight and multi-box handling require actual quotes before purchasing inventory.\n\nThese contribution figures exclude fixed overhead and development costs. They do not change the wheelchair-only demand scenarios or prove profitability. Shared overhead must be allocated once across the actual portfolio, not charged twice or omitted. No conversion-kit repeat revenue is assumed. Quote and validate the Run chassis first, then quote each incremental kit separately. If the tested design cannot meet these envelopes, revise the offer and price before opening orders.\n\nThe [r0 cost study](rover-r0-costs.md) counts an actual bill of materials for the first bench design and does not fit the Run row above. The COGS column here is a target, not a finding. Treat every contribution figure in this table as unsupported until the architecture or the price changes.\n`)
}

if (import.meta.main)
  await writeRoverEconomics()
