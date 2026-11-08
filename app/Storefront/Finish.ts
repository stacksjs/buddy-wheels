import type {ModelScene} from '@stacksjs/browser/model-viewer'
export interface ProductFinish {accent:string,trim:string}
export const defaultFinish:ProductFinish={accent:'#254b38',trim:'#344c43'}
export function parseFinish(input:Record<string,unknown>):ProductFinish {
 const result={...defaultFinish}
 for(const key of Object.keys(input))if(!Object.hasOwn(result,key))throw new Error('Unknown finish option.')
 for(const key of ['accent','trim'] as const){const value=input[key]??result[key];if(typeof value!=='string'||!/^#[0-9a-f]{6}$/i.test(value))throw new Error('Choose a six-digit hex color.');result[key]=value.toLowerCase()}
 return result
}
export function splitFinish(input:Record<string,unknown>){const {accent,trim,...configuration}=input;return {configuration,finish:parseFinish({accent,trim})}}
export const finishQuery=(f:ProductFinish)=>new URLSearchParams({...parseFinish({...f})}).toString()
export const finishNote=(f:ProductFinish)=>'buddy-finish-v1:'+JSON.stringify(parseFinish({...f}))
export function savedFinish(note:unknown):ProductFinish{try {if(typeof note==='string'&&note.startsWith('buddy-finish-v1:'))return parseFinish(JSON.parse(note.slice(16)))}catch{}return {...defaultFinish}}
export function finishScene(scene:ModelScene,finish:ProductFinish):ModelScene {
 const color=parseFinish({...finish}).accent
 return {...scene,nodes:scene.nodes.map(n=>n.geometry.kind==='stl'&&/\/(?:end_cap|axle_cover|tube_cap|inner_cap|index_collar|pivot_guard)\.stl(?:\?|$)/.test(n.geometry.src)?{...n,color}:n)}
}
export function finishDescription(f:ProductFinish){return `Printable service parts ${f.accent}; textile trim ${f.trim}. Color preferences only. Source material, print process, fit and engineering limits remain unchanged. Textile trim is a swatch request, not a validated fabric specification. Custom pigment/filament and fabric availability, durability and final pricing require confirmation. Product photos and baseline CAD renders retain their reference colors.`}
