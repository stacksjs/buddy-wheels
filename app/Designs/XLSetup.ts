// Compatibility for existing XL links and tooling; all geometry lives in the shared studio.
import type { StudioSetup } from './StudioSetup'
import { parseStudioSetup, studioAssetRoot, studioDimensionLimits, studioStartingSetup } from './StudioSetup'
export type XLSetup = StudioSetup
export const xlStartingSetup = studioStartingSetup('XL')
export const xlDimensionLimits = studioDimensionLimits.XL
export const xlAssetRoot = studioAssetRoot('XL')
export { studioPartFile as xlPartFile, studioPartNames as xlPartNames, studioSetupCode as xlSetupCode, studioSetupFamily as xlSetupFamily, studioSetupQuery as xlSetupQuery } from './StudioSetup'
export function parseXLSetup(input: Record<string, unknown>): XLSetup { return parseStudioSetup(input, 'XL') }
