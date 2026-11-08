import { expect, test } from 'bun:test'
import { blankMeasurements, convertMeasurementValue, measurementDefinitions, measurementErrors, measurementSummary } from '../../app/Fitting/Measurements'
import { prototypeBudget, prototypeBudgetLines, developmentAllowances } from '../../app/Designs/PrototypeBudget'
import { familyBom, wheelchairFamilies } from '../../app/Designs/Wheelchair'

test('body measurement records retain exact landmarks and separate the two height methods', () => {
  const input = { ...blankMeasurements, name: 'Buddy', weight: '140', groin: '25', hips: '13', body: '15', length: '27', girth: '40', rear: '26' }
  expect(measurementErrors(input)).toEqual([])
  const report = measurementSummary(input)
  expect(report).toContain('A - Supported floor-to-groin height: 25 in')
  expect(report).toContain('E - Lying rear-leg measurement, natural bend: 26 in')
  expect(report).toContain('B1 - Hip width, straight across: 13 in')
  expect(report).toContain('D - Chest girth behind front legs: 40 in')
  expect(report).toContain('Do not substitute one for the other.')
  expect(measurementSummary(blankMeasurements)).toContain('A - Supported floor-to-groin height: PENDING')
  expect(measurementSummary({ ...input, groin: '' })).toContain('A - Supported floor-to-groin height: PENDING')
  expect(measurementSummary({ ...input, groin: '' })).toContain('E - Lying rear-leg measurement, natural bend: 26 in')
  expect(report).not.toContain('rail-center height: 25')
  expect(measurementDefinitions.map(m => m.code)).toEqual(['A', 'B1', 'B2', 'C', 'D', 'E'])
  for (const invalid of ['-1', '0', 'NaN', 'Infinity', '0x10', '12 cm']) expect(measurementErrors({ ...input, hips: invalid }).length).toBe(1)
  expect(measurementErrors({ ...input, notes: 'Different posture; do not force standing.' })).toEqual([])
})

test('unit conversion changes the numbers as well as the labels and keeps pending/invalid values explicit', () => {
  expect(convertMeasurementValue('10', 'imperial', 'metric')).toBe('25.4')
  expect(convertMeasurementValue('63.5', 'metric', 'imperial')).toBe('25')
  expect(convertMeasurementValue('140', 'imperial', 'metric', true)).toBe('63.5')
  expect(Math.abs(Number(convertMeasurementValue('63.5', 'metric', 'imperial', true)) - 140)).toBeLessThan(.02)
  expect(convertMeasurementValue('', 'imperial', 'metric')).toBe('')
  expect(convertMeasurementValue('-5', 'imperial', 'metric')).toBe('-5')
  const metric = measurementSummary({ ...blankMeasurements, units: 'metric', groin: '63.5', weight: '63.5' })
  expect(metric).toContain('Weight: 63.5 kg')
  expect(metric).toContain('height: 63.5 cm')
})

test('the first-device budget reconciles every XL BOM ID without double-counting equipment or filament', () => {
  const lines = prototypeBudgetLines
  const bomIds = familyBom(wheelchairFamilies[0]!).split('\n').slice(1).filter(Boolean).map(row => row.split(',')[0]!.replaceAll('"', ''))
  const covered = lines.flatMap(line => line.bom)
  expect([...covered].sort()).toEqual([...bomIds].sort())
  expect(new Set(covered).size).toBe(covered.length)
  expect(lines.filter(line => line.id === 'filament').length).toBe(1)
  expect(lines.filter(line => line.id === 'printer').length).toBe(1)
  for (const line of lines) {
    expect([line.low, line.base, line.high].every(value => Number.isSafeInteger(value) && value >= 0)).toBe(true)
    expect(line.low).toBeLessThanOrEqual(line.base)
    expect(line.base).toBeLessThanOrEqual(line.high)
    if (line.evidence === 'observed-price') expect(line.source?.startsWith('https://')).toBe(true)
  }
  const base = prototypeBudget()
  expect(base.device).toBe(142700)
  expect(base.equipment).toBe(89399)
  expect(base.taxablePlanningBase).toBe(234599)
  expect(base.taxReserve).toBe(22873)
  expect(base.contingency).toBe(31440)
  expect(base.diyCash).toBe(301212)
  expect(base.withPaidAssembly).toBe(336212)
  expect(base.developmentBudget).toBe(531212)
  expect(base.developmentBudget - base.diyCash).toBe(developmentAllowances.reduce((sum, line) => sum + line.base, 0))
  const owned = prototypeBudget('base', { equipment: false })
  expect(owned.equipment).toBe(0)
  expect(owned.device).toBe(base.device)
  expect(owned.consumables).toBe(base.consumables)
  expect(owned.diyCash).toBeLessThan(base.diyCash)
  expect(prototypeBudget('low').diyCash).toBe(197254)
  expect(prototypeBudget('high').diyCash).toBe(493292)
  expect(prototypeBudget('base', { taxBps: 0, contingencyBps: 0 }).diyCash).toBe(246899)
  expect(() => prototypeBudget('base', { taxBps: -1 })).toThrow()
  expect(() => prototypeBudget('base', { contingencyBps: 10001 })).toThrow()
})
