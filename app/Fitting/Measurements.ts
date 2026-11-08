export type MeasurementUnits = 'imperial' | 'metric'
export const measurementDefinitions = [
  { id: 'groin', code: 'A', title: 'Supported groin height', view: 'Side view', image: 'a-groin-height', start: 'Level floor', end: 'Underside where the hind leg joins the body', method: 'Measure vertically beside the dog, from the floor to the groin crease. Use only the comfortable supported posture your care professional approves.', avoid: 'Do not measure to the top of the hip or back. Do not lift, press into the pelvis or force the hind legs straight.', tool: 'Rigid ruler or yardstick, held beside the body.', note: 'If supported standing is not comfortable, leave A pending and record E separately. E is not a replacement value for A.' },
  { id: 'hips', code: 'B1', title: 'Hip width', view: 'View from above', image: 'b1-hip-width', start: 'Outside of one hip', end: 'Outside of the other hip, at the same level', method: 'Measure straight across the full body at the hips. Two parallel upright boards held lightly beside the body can help locate the edges; measure the gap without squeezing.', avoid: 'Do not wrap the tape around the rump or measure only one thigh. Do not add frame clearance to this body measurement.', tool: 'Two flat boards and a ruler, with a helper.', note: 'Record the body width and any thick coat or asymmetry in your notes. The illustration is a schematic, not Buddy’s actual proportions.' },
  { id: 'body', code: 'B2', title: 'Widest body width', view: 'View from above', image: 'b2-body-width', start: 'One outside body edge', end: 'Opposite edge at the same cross-section', method: 'Check straight across at the shoulders, ribs and hips. Record the largest width, and note which location was widest. Keep the ruler perpendicular to the spine.', avoid: 'Do not follow the curve of the back or use chest circumference as width. Do not compress the coat or body.', tool: 'Parallel boards and a ruler; no pressure on the dog.', note: 'Check all three locations. The rib line highlighted in the drawing is an example, not a prediction of your dog’s widest point.' },
  { id: 'length', code: 'C', title: 'Armpit-to-rump length', view: 'Side view', image: 'c-body-length', start: 'Back edge of the front leg at its armpit', end: 'Back of the rump, before the tail begins', method: 'Measure a straight horizontal line along the side between the two marked vertical landmarks. Keep the ruler parallel to the floor in the approved posture.', avoid: 'Exclude the head, neck and tail. This is not shoulder-to-hip-center length or the distance to the front of the rear thigh.', tool: 'Rigid ruler or a tape held straight beside the dog.', note: 'Use the same landmarks when repeating a measurement. Manufacturer forms can use different definitions; our C code applies to this worksheet only.' },
  { id: 'girth', code: 'D', title: 'Chest girth', view: 'Side view with tape loop', image: 'd-chest-girth', start: 'Chest just behind the front legs', end: 'A complete loop around the rib cage', method: 'Use a soft tape around the chest just behind the front legs at the widest rib-cage area. Keep it flat and comfortably touching the coat without tightening.', avoid: 'Do not measure the neck or squeeze the chest. Do not add strap allowance; follow the selected harness maker’s sizing rules separately.', tool: 'Soft measuring tape.', note: 'This is circumference, unlike B1 and B2. Harness size and attachment compatibility still need their own review.' },
  { id: 'rear', code: 'E', title: 'Lying rear-leg measurement', view: 'Lying comfortably on the side', image: 'e-lying-leg', start: 'Groin crease at the top inside of the hind leg', end: 'Underside of the hind paw pad', method: 'With the dog resting comfortably on their side, measure the straight distance between the marked endpoints. Leave a natural bend in the leg.', avoid: 'Do not stretch or pull the leg. Do not trace the leg’s bent contour, and do not relabel this as supported standing height.', tool: 'Ruler or a straight tape beside the resting leg.', note: 'Optional for our complete body worksheet; required if you use the rear-leg size helper below. Keep the lying-down method attached to the number.' },
] as const

export interface MeasurementInputs {
  name: string
  breed: string
  units: MeasurementUnits
  weight: string
  groin: string
  hips: string
  body: string
  length: string
  girth: string
  rear: string
  posture: string
  notes: string
}
export const blankMeasurements: MeasurementInputs = { name: '', breed: '', units: 'imperial', weight: '', groin: '', hips: '', body: '', length: '', girth: '', rear: '', posture: '', notes: '' }
const numericFields = ['groin', 'hips', 'body', 'length', 'girth', 'rear', 'weight'] as const
export function measurementErrors(input: MeasurementInputs): string[] {
  const errors: string[] = []
  for (const key of numericFields) {
    const text = input[key].trim()
    if (text && (!/^\d+(?:\.\d+)?$/.test(text) || !Number.isFinite(Number(text)) || Number(text) <= 0)) errors.push(`${key === 'weight' ? 'Weight' : measurementDefinitions.find(m => m.id === key)!.title}: enter a positive number or leave it pending.`)
  }
  if (!['imperial', 'metric'].includes(input.units)) errors.push('Choose inches/lb or centimeters/kg.')
  return errors
}
export function convertMeasurementValue(value: string, from: MeasurementUnits, to: MeasurementUnits, weight = false): string {
  if (!value.trim() || from === to || !/^\d+(?:\.\d+)?$/.test(value) || !Number.isFinite(Number(value))) return value
  const factor = weight ? 0.45359237 : 2.54
  return String(Math.round(Number(value) * (to === 'metric' ? factor : 1 / factor) * 100) / 100)
}
export function measurementSummary(input: MeasurementInputs): string {
  const unit = input.units === 'metric' ? 'cm' : 'in'
  const weightUnit = input.units === 'metric' ? 'kg' : 'lb'
  const errors = measurementErrors(input)
  const value = (text: string, suffix: string) => text.trim() ? `${text.trim()} ${suffix}` : 'PENDING'
  const clean = (text: string) => text.trim().replace(/[\r\n]+/g, ' ').slice(0, 1000)
  return [
    'BUDDY WHEELS | BODY MEASUREMENT WORKSHEET',
    'Raw anatomy, not frame settings or fit approval.',
    `Dog: ${clean(input.name) || 'PENDING'}`,
    `Breed: ${clean(input.breed) || 'PENDING'}`,
    `Weight: ${value(input.weight, weightUnit)}`,
    `A - Supported floor-to-groin height: ${value(input.groin, unit)}`,
    `B1 - Hip width, straight across: ${value(input.hips, unit)}`,
    `B2 - Widest body width, straight across: ${value(input.body, unit)}`,
    `C - Armpit-to-rump length: ${value(input.length, unit)}`,
    `D - Chest girth behind front legs: ${value(input.girth, unit)}`,
    `E - Lying rear-leg measurement, natural bend: ${value(input.rear, unit)}`,
    'A and E use different methods. Do not substitute one for the other.',
    `Supported posture / helper / date: ${clean(input.posture) || 'PENDING'}`,
    `Widest location / asymmetry / notes: ${clean(input.notes) || 'PENDING'}`,
    ...(errors.length ? ['CHECK BEFORE SHARING:', ...errors] : []),
    'No extra frame or harness clearance has been added to these body measurements.',
    'Measurements need professional review before selecting support or changing CAD.',
  ].join('\n')
}
