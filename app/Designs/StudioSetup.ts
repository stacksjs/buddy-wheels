import type { WheelchairFamily } from './WheelchairParameters'
import { cadParts, validateFamily, wheelchairFamilies } from './WheelchairParameters'

export interface StudioSetup {
  size: StudioSize
  height: number
  width: number
  rail: number
  setting: number
  travel: number
  locked: boolean
}

export const studioSizes = ['XS', 'S', 'M', 'L', 'XL'] as const
export type StudioSize = typeof studioSizes[number]
export const studioSizeNames: Record<StudioSize, string> = { XS: 'Extra small', S: 'Small', M: 'Medium', L: 'Large', XL: 'Extra large' }
// Bench configuration envelopes, not dog-fit ranges or load capacities.
export const studioDimensionLimits = {
  XS: { height: [260, 320], width: [160, 210], rail: [200, 340] },
  S: { height: [300, 380], width: [175, 280], rail: [260, 440] },
  M: { height: [385, 480], width: [220, 360], rail: [360, 600] },
  L: { height: [440, 620], width: [270, 440], rail: [480, 740] },
  XL: { height: [500, 760], width: [320, 520], rail: [540, 820] },
} as const
export function parseStudioSize(value: unknown): StudioSize {
  if (typeof value !== 'string' || !studioSizes.includes(value.toUpperCase() as StudioSize)) throw new Error('Choose XS, S, M, L or XL.')
  return value.toUpperCase() as StudioSize
}
export function studioStartingSetup(size: StudioSize = 'XL'): StudioSetup {
  const family = wheelchairFamilies.find(f => f.size === size)!
  return { size, height: Math.max(family.height, studioDimensionLimits[size].height[0]), width: family.width, rail: family.rail, setting: 1, travel: 0, locked: false }
}
export const studioPartNames: Record<string, string> = { tube_cap: 'Tube end cap', inner_cap: 'Inner tube cap', index_collar: 'Setup marker', pivot_guard: 'Pivot shield', drill_jig: 'Drilling layout jig', coupon: 'Fit calibration coupon', shock_dummy: 'Shock eye-distance gauge', fixed_plate: 'Fixed suspension cheek', arm_plate: 'Trailing arm cheek', corner_plate: 'Frame corner cheek' }
export function studioAssetRoot(size: StudioSize): string { return `/designs/${size.toLowerCase()}/r0` }
export function studioPartFile(id: string): string {
  const part = cadParts.find(item => item.id === id)
  if (!part) throw new Error('Unknown wheelchair part.')
  return `${part.category === 'metal' ? 'FIT_CHECK_ONLY_' : ''}${id}.stl`
}

export function parseStudioSetup(input: Record<string, unknown>, selectedSize: unknown = 'XL'): StudioSetup {
  const size = parseStudioSize(selectedSize)
  const starting = studioStartingSetup(size)
  const allowed = new Set(['height', 'width', 'rail', 'setting', 'travel', 'locked'])
  for (const key of Object.keys(input)) {
    if (!allowed.has(key)) throw new Error(`Unknown setup field: ${key}`)
  }
  function number(key: keyof Omit<StudioSetup, 'locked' | 'size'>): number {
    const value = input[key] ?? starting[key]
    if ((typeof value !== 'number' && (typeof value !== 'string' || !/^-?\d+(?:\.\d+)?$/.test(value))) || !Number.isFinite(Number(value)))
      throw new Error(`Enter a number for ${key}.`)
    return Number(value)
  }
  const setup = { size, height: number('height'), width: number('width'), rail: number('rail'), setting: number('setting'), travel: number('travel'), locked: false }
  for (const key of ['height', 'width', 'rail'] as const) {
    const [min, max] = studioDimensionLimits[size][key]
    if (setup[key] < min || setup[key] > max || !Number.isInteger(setup[key]) || setup[key] % 5)
      throw new Error(`${{ height: 'Frame height', width: 'Rail spacing', rail: 'Rail length' }[key]} must be ${min}-${max} mm, in 5 mm steps.`)
  }
  if (!Number.isInteger(setup.setting) || setup.setting < 0 || setup.setting > 2)
    throw new Error('Choose suspension leverage A, B or C.')
  if (setup.travel < -3 || setup.travel > 6 || !Number.isInteger(setup.travel * 2))
    throw new Error('Travel preview must be -3 to 6 degrees, in 0.5 degree steps.')
  const locked = input.locked ?? false
  if (![true, false, 'true', 'false', '1', '0'].includes(locked as boolean | string))
    throw new Error('Lock position must be true or false.')
  setup.locked = locked === true || locked === 'true' || locked === '1'
  if (setup.locked && setup.travel !== 0)
    throw new Error('The neutral lock requires zero travel.')
  studioSetupFamily(setup)
  return setup
}

export function studioSetupFamily(setup: StudioSetup): WheelchairFamily {
  const size = parseStudioSize(setup.size)
  const family = { ...wheelchairFamilies.find(f => f.size === size)!, height: setup.height, width: setup.width, rail: setup.rail }
  validateFamily(family)
  // Keep the undrilled inner tube entirely above both fixed-cheek mounting pins.
  const innerBottom = family.height - family.tube / 2 - family.innerLength
  if (innerBottom <= family.wheel / 2 + 65 + (family.frameBolt + 2.2) / 2 + 0.2)
    throw new Error('Raise the frame to keep the inner uprights clear of suspension mount pins.')
  // Authored rear corner profiles extend 78 mm inward from each rail center.
  if (family.width < 158)
    throw new Error('Rail spacing must leave clearance between the rear corner plates.')
  return family
}

export function studioSetupQuery(setup: StudioSetup): string {
  return new URLSearchParams(Object.fromEntries(Object.entries(setup).filter(([key]) => key !== 'size').map(([key, value]) => [key, String(value)]))).toString()
}

export function studioSetupCode(setup: StudioSetup): string {
  return `${setup.size.toLowerCase()}-h${setup.height}-w${setup.width}-l${setup.rail}-${['a', 'b', 'c'][setup.setting]}`
}
