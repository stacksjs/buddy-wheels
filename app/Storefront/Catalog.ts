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
  { code: 'M', name: 'Buddy Everyday', slug: 'buddy-everyday', weight: 'Over 25-69 lb', maxWeightLb: 69, minHeightIn: 10, maxHeightIn: 18, price: 22450, referencePrice: 44900, referenceUrl: `${reference}dog-wheelchair-medium-adjustable-wheelchairs-for-dogs-with-disabilities`, description: 'An everyday-size option in the proposed range.' },
  { code: 'L', name: 'Buddy Large', slug: 'buddy-large', weight: 'Over 69-120 lb', maxWeightLb: 120, minHeightIn: 14, maxHeightIn: 25, price: 26450, referencePrice: 52900, referenceUrl: `${reference}dog-wheelchair-large-adjustable-wheelchairs-for-dogs-with-disabilities`, description: 'More room for big dogs and their everyday routines.' },
  { code: 'XL', name: 'Big Buddy', slug: 'big-buddy', weight: 'Over 120-180 lb', maxWeightLb: 180, minHeightIn: 14, maxHeightIn: 28, price: 26450, referencePrice: 52900, referenceUrl: `${reference}dog-wheelchair-large-adjustable-wheelchairs-for-dogs-with-disabilities`, description: 'A dedicated giant-dog design, with additional testing.' },
]

export function money(cents: number): string {
  if (!Number.isSafeInteger(cents) || cents < 0)
    throw new Error('Money must be nonnegative integer cents.')
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100)
}

export function planningSize(weightLb: number, heightIn: number): { code: string | null, message: string } {
  if (!Number.isFinite(weightLb) || !Number.isFinite(heightIn) || weightLb < 2 || weightLb > 180 || heightIn <= 0)
    return { code: null, message: 'Please enter a weight from 2 to 180 lb and a positive rear-leg height. Dogs outside this range need a custom review.' }
  const candidate = catalog.find(size => weightLb <= size.maxWeightLb)
  if (!candidate || heightIn < candidate.minHeightIn || heightIn > candidate.maxHeightIn)
    return { code: null, message: 'These measurements need an individual review. Please ask your vet or rehabilitation professional about an appropriate cart.' }
  return { code: candidate.code, message: `${candidate.name} (${candidate.code}) is a planning starting point. Body length, width, posture and front-leg strength still need professional review. This is not a fit approval.` }
}

export function validQuantity(value: unknown, allowZero = false): number | null {
  if (typeof value !== 'string' && typeof value !== 'number')
    return null
  if (typeof value === 'string' && !/^\d+$/.test(value))
    return null
  const quantity = Number(value)
  return Number.isSafeInteger(quantity) && quantity >= (allowZero ? 0 : 1) && quantity <= 5 ? quantity : null
}
