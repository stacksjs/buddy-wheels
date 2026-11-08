import type { WheelchairFamily } from './WheelchairParameters'
import { cadParts, validateFamily, wheelchairFamilies } from './WheelchairParameters'

export interface XLSetup {
  height: number
  width: number
  rail: number
  setting: number
  travel: number
  locked: boolean
}

export const xlStartingSetup: XLSetup = { height: 620, width: 400, rail: 680, setting: 1, travel: 0, locked: false }
export const xlDimensionLimits = { height: [500, 760], width: [320, 520], rail: [540, 820] } as const
export const xlPartNames: Record<string, string> = { tube_cap: 'Tube end cap', inner_cap: 'Inner tube cap', index_collar: 'Setup marker', pivot_guard: 'Pivot shield', drill_jig: 'Drilling layout jig', coupon: 'Fit calibration coupon', shock_dummy: 'Shock eye-distance gauge', fixed_plate: 'Fixed suspension cheek', arm_plate: 'Trailing arm cheek', corner_plate: 'Frame corner cheek' }
export const xlAssetRoot = '/designs/xl/r0'
export function xlPartFile(id: string): string {
  const part = cadParts.find(item => item.id === id)
  if (!part) throw new Error('Unknown XL part.')
  return `${part.category === 'metal' ? 'FIT_CHECK_ONLY_' : ''}${id}.stl`
}

export function parseXLSetup(input: Record<string, unknown>): XLSetup {
  const allowed = new Set(['height', 'width', 'rail', 'setting', 'travel', 'locked'])
  for (const key of Object.keys(input)) {
    if (!allowed.has(key)) throw new Error(`Unknown setup field: ${key}`)
  }
  function number(key: keyof Omit<XLSetup, 'locked'>): number {
    const value = input[key] ?? xlStartingSetup[key]
    if ((typeof value !== 'number' && (typeof value !== 'string' || !/^-?\d+(?:\.\d+)?$/.test(value))) || !Number.isFinite(Number(value)))
      throw new Error(`Enter a number for ${key}.`)
    return Number(value)
  }
  const setup = { height: number('height'), width: number('width'), rail: number('rail'), setting: number('setting'), travel: number('travel'), locked: false }
  for (const key of ['height', 'width', 'rail'] as const) {
    const [min, max] = xlDimensionLimits[key]
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
  xlSetupFamily(setup)
  return setup
}

export function xlSetupFamily(setup: XLSetup): WheelchairFamily {
  const family = { ...wheelchairFamilies[0]!, height: setup.height, width: setup.width, rail: setup.rail }
  validateFamily(family)
  return family
}

export function xlSetupQuery(setup: XLSetup): string {
  return new URLSearchParams(Object.fromEntries(Object.entries(setup).map(([key, value]) => [key, String(value)]))).toString()
}

export function xlSetupCode(setup: XLSetup): string {
  return `xl-h${setup.height}-w${setup.width}-l${setup.rail}-${['a', 'b', 'c'][setup.setting]}`
}
