import type { SoftFrame } from './SoftGoods'
import type { StudioSetup } from './StudioSetup'
import type { StandardSetup } from './XLStandard'
import { studioSetupFamily } from './StudioSetup'

export function studioSoftFrame(s:StudioSetup):SoftFrame { const f = studioSetupFamily(s); return {size:f.size, revision:'r0', height:f.height, width:f.width, rail:f.rail, tube:f.tube, plate:f.plate, bridgeX:60, frontX:-(f.rail - 80), travel:0}}
export function xlSoftFrame(s:StandardSetup&{travel?:number}, revision = 'r2'):SoftFrame { return {size:'XL', revision, height:s.height-(s.travel??0), width:s.width, rail:s.rail, tube:25.4, plate:3.175, bridgeX:120, frontX:-(s.rail - 200), travel:s.travel??0}}
