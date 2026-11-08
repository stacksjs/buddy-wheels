/** Parent context required by resources/views/partials/finish-controls.stx.
 * Pages provide these real STX signals and server values. This checker-only
 * contract supplies the include's inherited scope; it injects no runtime API.
 * Browser tests verify every parent, form association and signal update.
 */
declare const accent: {():string,set(value:string):void}
declare const trim: {():string,set(value:string):void}
declare const initialFinish: {accent:string,trim:string}
declare const finishForm: string
