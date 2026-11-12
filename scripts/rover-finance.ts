import { roverStart } from '../app/Designs/Rover'
import { roverEconomics } from '../app/Designs/RoverCost'
import { roverConfigurations } from '../app/Storefront/Catalog'

// Run uses the counted r0 bench cost at 100 units. The conversion kits are not designed, so their steps above Run are still targets.
const runCogs = roverEconomics(roverStart, 100).cogs
const inputs = [
  { code: 'run', cogs: runCogs, shipping: 3500, support: 1500 },
  { code: 'coast', cogs: runCogs + 3500, shipping: 4000, support: 1700 },
  { code: 'snow', cogs: runCogs + 7500, shipping: 4500, support: 2000 },
  { code: 'all-season', cogs: runCogs + 13500, shipping: 5500, support: 2300 },
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
  await Bun.write(new URL('../docs/business/rover-unit-economics.md', import.meta.url), `# Buddy Rover unit economics\n\nGenerated with bun run finance. No physical Rover has been manufactured or qualified. The owner set the Run price to $999 on November 12, 2026; Coast, Snow and All-season keep their earlier steps above it.\n\n| Setup | Price | COGS | Freight | Fees | Reserve | Acquisition | Support | Contribution | COGS +20% contribution |\n| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |\n${rows}\n\n**Every row loses money.** The Run COGS is the counted cost of the r0 bench design at 100 units from the [r0 cost study](rover-r0-costs.md), which is higher than the price. Coast, Snow and All-season add the earlier target steps of $35, $75 and $135 for conversion kits that have not been designed. A 30% gross margin at $999 needs the cost at $699.30 or less; the cost study lists what it would take to get there.\n\nFees assume 2.9% plus $0.30; reserve assumes 5% of product revenue. Tax collected is not revenue. Freight, acquisition and support are management assumptions, not quotes, and the freight figures predate the mass estimate: they are low for a carrier of about 110 lb. Returns, dimensional freight and multi-box handling require actual quotes before purchasing inventory.\n\nThese contribution figures exclude fixed overhead and development costs. They do not change the wheelchair-only demand scenarios. Do not open orders at these prices until the counted cost is below them.\n`)
}

if (import.meta.main)
  await writeRoverEconomics()
