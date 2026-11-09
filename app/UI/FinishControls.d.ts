/** Parent context required by resources/views/partials/finish-controls.stx.
 * Pages provide these real STX signals and server values. This checker-only
 * contract supplies the include's inherited scope; it injects no runtime API.
 * Browser tests verify every parent, form association and signal update.
 */
declare const accent: {():string,set(value:string):void}
declare const trim: {():string,set(value:string):void}
declare const initialFinish: {accent:string,trim:string}
declare const finishForm: string
/** Inherited context for the textile include, provided by all three studio pages. */
declare const initialGoods: import('../Designs/SoftGoods').SoftSetup
declare const textileForm: string
declare const goodsBounds: ()=>ReturnType<typeof import('../Designs/SoftGoods').softLimits>
declare const goodsState: ()=>{setup:import('../Designs/SoftGoods').SoftSetup,error:string}
declare const slingWidth: {():number,set(value:number):void}
declare const slingLength: {():number,set(value:number):void}
declare const legWidth: {():number,set(value:number):void}
declare const legLength: {():number,set(value:number):void}
declare const supportDrop: {():number,set(value:number):void}
declare const chestGirth: {():number,set(value:number):void}
declare function resetTextiles():void
declare function rearPattern():string
declare function frontPattern():string
declare function textileUrl():string
