import { describe, expect, test } from 'bun:test'
import { catalog, money, planningSize, roverConfigurations, storeProducts, validQuantity } from '../../app/Storefront/Catalog'
import { assumptions, scenario, unitEconomics } from '../../scripts/finance'
import { roverUnitEconomics } from '../../scripts/rover-finance'

describe('planning catalog boundaries', () => {
  test('offers distinct Rover configurations without putting carrier options into wheelchair sizing', () => {
    expect(roverConfigurations.map(item => item.price)).toEqual([99900, 104900, 109900, 119900])
    expect(new Set(storeProducts.map(item => item.slug)).size).toBe(9)
    expect(storeProducts.find(item => item.slug === 'buddy-rover-coast')?.href).toBe('/rover?mode=coast')
    expect(storeProducts.filter(item => item.family === 'wheelchair').length).toBe(5)
    expect(planningSize(150, 22).code).toBe('XL')
  })
  test('ties verified targets to half their dated references without inventing an XS comparison', () => {
    expect(catalog.map(item => item.price)).toEqual([12900, 15950, 22450, 26450, 26450])
    expect(catalog[0]?.referencePrice).toBeNull()
    for (const item of catalog.filter(item => item.referencePrice !== null))
      expect(item.price * 2).toBe(item.referencePrice!)
  })
  test('uses continuous weight boundaries and refuses unsupported geometry', () => {
    expect(planningSize(10, 6).code).toBe('XS')
    expect(planningSize(10.5, 6).code).toBe('S')
    expect(planningSize(25.5, 12).code).toBe('M')
    expect(planningSize(69.5, 20).code).toBe('L')
    expect(planningSize(120.5, 22).code).toBe('XL')
    expect(planningSize(181, 20).code).toBeNull()
    expect(planningSize(60, 5).code).toBeNull()
    expect(planningSize(Number.NaN, 12).code).toBeNull()
    expect(planningSize(50, 12).message).toContain('not a fit approval')
  })
  test('refuses malformed, fractional and out-of-range quantities and money', () => {
    for (const value of ['', '1.5', 1.5, -1, 6, Number.NaN, Number.POSITIVE_INFINITY, {}, '2junk'])
      expect(validQuantity(value)).toBeNull()
    expect(validQuantity('5')).toBe(5)
    expect(validQuantity(0)).toBeNull()
    expect(validQuantity('0', true)).toBe(0)
    expect(money(26450)).toBe('$264.50')
    expect(() => money(1.5)).toThrow()
  })
})

describe('financial planning model', () => {
  test('accounts for Rover shipping and support separately from COGS', () => {
    expect(roverUnitEconomics('run').contribution).toBe(-76527)
    expect(roverUnitEconomics('run', 1.2).contribution).toBe(-108528)
    expect(() => roverUnitEconomics('unknown')).toThrow()
  })
  test('keeps a worked large-kit contribution and exact scenario allocation', () => {
    expect(unitEconomics(assumptions[3]!).contribution).toBe(6730)
    expect(scenario(200).revenue).toBe(4319000)
    expect(scenario(200).contribution).toBe(849660)
    expect(scenario(200).operating).toBe(-950340)
    expect(scenario(200, 1.2, 1.5).contribution).toBeLessThan(scenario(200).contribution)
  })
})
