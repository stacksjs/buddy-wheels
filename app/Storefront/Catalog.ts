export interface MobilitySize {
  code: string
  name: string
  slug: string
  weight: string
  maxWeightLb: number
  minHeightIn: number
  maxHeightIn: number
  price: number
  referencePrice: number | null
  referenceUrl: string | null
  description: string
}

const reference = 'https://walkinpets.com/products/'

/** Proposed development envelopes, never tested load ratings or fit approvals. */
export const catalog: MobilitySize[] = [
  { code: 'XS', name: 'Little Buddy', slug: 'little-buddy', weight: '2-10 lb', maxWeightLb: 10, minHeightIn: 3, maxHeightIn: 9, price: 12900, referencePrice: null, referenceUrl: null, description: 'A lighter starting point for the smallest companions.' },
  { code: 'S', name: 'Buddy Small', slug: 'buddy-small', weight: 'Over 10-25 lb', maxWeightLb: 25, minHeightIn: 3, maxHeightIn: 15, price: 15950, referencePrice: 31900, referenceUrl: `${reference}dog-wheelchair-small-adjustable-wheelchairs-for-dogs-with-disabilities`, description: 'Compact proportions, with room to adjust.' },
  { code: 'M', name: 'Buddy Everyday', slug: 'buddy-everyday', weight: 'Over 25-69 lb', maxWeightLb: 69, minHeightIn: 10, maxHeightIn: 18, price: 22450, referencePrice: 44900, referenceUrl: `${reference}dog-wheelchair-medium-adjustable-wheelchairs-for-dogs-with-disabilities`, description: 'For everyday walks and the occasional detour.' },
  { code: 'L', name: 'Buddy Large', slug: 'buddy-large', weight: 'Over 69-120 lb', maxWeightLb: 120, minHeightIn: 14, maxHeightIn: 25, price: 26450, referencePrice: 52900, referenceUrl: `${reference}dog-wheelchair-large-adjustable-wheelchairs-for-dogs-with-disabilities`, description: 'More room for big dogs and their everyday routines.' },
  { code: 'XL', name: 'Big Buddy', slug: 'big-buddy', weight: 'Over 120-180 lb', maxWeightLb: 180, minHeightIn: 14, maxHeightIn: 28, price: 26450, referencePrice: 52900, referenceUrl: `${reference}dog-wheelchair-large-adjustable-wheelchairs-for-dogs-with-disabilities`, description: 'Big-dog proportions. The same love of a good walk.' },
]

/** Product configuration briefs. Prices are provisional until the physical release gate passes. */
export const roverConfigurations = [
  { code: 'run', name: 'Buddy Rover / Run', slug: 'buddy-rover-run', price: 39900, label: 'Run', description: 'For long-distance running and everyday paths.', included: ['Roomy weather cabin with a walk-in ramp', 'Three-wheel running setup', 'Push handle, brake and wrist tether'], use: 'A steady running line, with room for your dog to ride when the miles get longer.' },
  { code: 'coast', name: 'Buddy Rover / Coast', slug: 'buddy-rover-coast', price: 44900, label: 'Coast', description: 'For beach walks and sandy detours.', included: ['Everything in the Run configuration', 'Wide-wheel beach conversion', 'Rinse-clean floor and removable liner'], use: 'A wider footprint for beach walks. Firm shoreline routes are the starting point for surface testing.' },
  { code: 'snow', name: 'Buddy Rover / Snow', slug: 'buddy-rover-snow', price: 49900, label: 'Snow', description: 'For winter walks and groomed snow routes.', included: ['Everything in the Run configuration', 'Ski conversion and tow harness', 'Captured mounts and parking support'], use: 'A winter configuration for groomed routes, with a dedicated ski and tow setup.' },
  { code: 'all-season', name: 'Buddy Rover / All-season', slug: 'buddy-rover-all-season', price: 59900, label: 'All-season', description: 'One cabin. Running wheels, beach wheels and skis.', included: ['Complete Run configuration', 'Wide-wheel beach conversion', 'Ski conversion and tow harness'], use: 'Keep the cabin they know. Change the running gear when the season changes.' },
]

export const storeProducts = [
  ...catalog.map(item => ({ ...item, name: `${item.name} / ${item.code}`, family: 'wheelchair', image: '/images/chair-concept-640.webp', href: `/shop?size=${item.code}` })),
  ...roverConfigurations.map(item => ({ ...item, family: 'rover', image: item.code === 'snow' ? '/images/buddy-rover-snow-640.webp' : '/images/buddy-rover-640.webp', href: `/rover?mode=${item.code}` })),
]

export function money(cents: number): string {
  if (!Number.isSafeInteger(cents) || cents < 0)
    throw new Error('Money must be nonnegative integer cents.')
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100)
}

export function signedMoney(cents:number):string {
  const sign=cents<0?'-':''
  return sign+money(Math.abs(cents))
}

export function planningSize(weightLb: number, heightIn: number): { code: string | null, message: string } {
  if (!Number.isFinite(weightLb) || !Number.isFinite(heightIn) || weightLb < 2 || weightLb > 180 || heightIn <= 0)
    return { code: null, message: 'Please enter a weight from 2 to 180 lb and a positive rear-leg height. Dogs outside this range need a custom review.' }
  const candidate = catalog.find(size => weightLb <= size.maxWeightLb)
  if (!candidate || heightIn < candidate.minHeightIn || heightIn > candidate.maxHeightIn)
    return { code: null, message: 'These measurements need an individual review. Please ask your vet or rehabilitation professional about an appropriate cart.' }
  return { code: candidate.code, message: `Start with ${candidate.name} (${candidate.code}). Check body length, width and posture with your care professional before choosing a chair. This is not a fit approval.` }
}

export function validQuantity(value: unknown, allowZero = false): number | null {
  if (typeof value !== 'string' && typeof value !== 'number')
    return null
  if (typeof value === 'string' && !/^\d+$/.test(value))
    return null
  const quantity = Number(value)
  return Number.isSafeInteger(quantity) && quantity >= (allowZero ? 0 : 1) && quantity <= 5 ? quantity : null
}
