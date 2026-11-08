import { mkdir } from 'node:fs/promises'

// Original anatomical schematics, not icons, photos or copies of supplier artwork.
const ink = '#234b38'; const soft = '#cbd4c5'; const coat = '#e3e7da'; const accent = '#936142'
function svg(title: string, desc: string, body: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400" width="640" height="400" role="img" aria-labelledby="title desc"><title id="title">${title}</title><desc id="desc">${desc}</desc><defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto-start-reverse" markerUnits="userSpaceOnUse"><path d="M0 0 8 4 0 8Z" fill="${ink}"/></marker></defs><rect width="640" height="400" fill="#eef0e7"/><g stroke-linecap="round" stroke-linejoin="round">${body}</g></svg>\n`
}
function side(): string {
 return `<path d="M221 210 237 282 237 331 245 346H215L209 331 205 242M472 205 506 266 492 325 502 346H471L463 326 476 273 445 241" fill="${soft}" stroke="${ink}" stroke-width="3"/>
 <path d="M470 165C506 134 537 161 563 128 558 157 529 180 491 184" fill="${coat}" stroke="${ink}" stroke-width="3"/>
 <path d="M153 154C175 132 184 124 216 136 282 146 360 132 430 143 474 147 495 169 491 207 489 233 470 246 443 249 375 257 299 258 237 237 208 228 190 215 176 198L148 181Z" fill="${coat}" stroke="${ink}" stroke-width="3"/>
 <path d="M190 205 204 235 199 285 194 329 199 346H165L170 327 174 273 173 211M454 206C471 215 474 231 462 249L478 286 491 331 488 346H456L458 329 447 291 424 253" fill="${coat}" stroke="${ink}" stroke-width="3"/>
 <path d="M168 154 151 124C141 107 114 101 98 113L84 136 48 146C40 150 46 164 57 169L92 175 114 194 151 181" fill="${coat}" stroke="${ink}" stroke-width="3"/>
 <path d="M139 116C150 143 138 160 119 167L111 127" fill="${soft}" stroke="${ink}" stroke-width="3"/><circle cx="94" cy="138" r="3.5" fill="${ink}"/><path d="M48 148 46 156 55 156" fill="${ink}"/><path d="M64 166 87 166" fill="none" stroke="${ink}" stroke-width="2"/>
 <path d="M50 351H591" stroke="#aab7a3" stroke-width="2"/>
 <path d="M285 242C325 259 380 257 413 247" fill="none" stroke="#8a9b80" stroke-width="2"/>`
}
function badge(code: string, x: number, y: number): string { return `<rect x="${x - 29}" y="${y - 22}" width="58" height="44" rx="10" fill="${ink}"/><text x="${x}" y="${y + 10}" text-anchor="middle" font-family="Arial,sans-serif" font-size="28" font-weight="bold" fill="white">${code}</text>` }
function point(x: number, y: number): string { return `<circle cx="${x}" cy="${y}" r="7" fill="${accent}" stroke="#fff" stroke-width="2"/>` }
function line(x1: number, y1: number, x2: number, y2: number): string { return `<path d="M${x1} ${y1}L${x2} ${y2}" fill="none" stroke="${ink}" stroke-width="4" marker-start="url(#arrow)" marker-end="url(#arrow)"/>` }
function dash(x1: number, y1: number, x2: number, y2: number): string { return `<path d="M${x1} ${y1}L${x2} ${y2}" stroke="${accent}" stroke-width="2" stroke-dasharray="6 6"/>` }
function top(): string { return `<path d="M279 146C263 125 282 109 291 99L280 62C294 38 345 37 361 63L349 99C368 112 378 130 360 147" fill="${coat}" stroke="${ink}" stroke-width="3"/><path d="M290 113C266 143 250 165 257 200 245 237 261 282 278 310 298 335 343 335 363 310 381 281 395 237 383 200 391 166 374 143 349 113Z" fill="${coat}" stroke="${ink}" stroke-width="3"/><path d="M320 327C341 350 323 365 348 378" fill="none" stroke="${ink}" stroke-width="9"/><path d="M319 135V310" stroke="#a8b59d" stroke-width="2" stroke-dasharray="5 7"/><text x="320" y="26" text-anchor="middle" font-family="Arial,sans-serif" font-size="19" fill="${ink}">Head</text><text x="500" y="320" font-family="Arial,sans-serif" font-size="20" fill="${ink}">Hips</text>` }
export async function writeMeasurementArt(): Promise<void> {
 await mkdir('public/guides', { recursive: true })
 const drawings = {
 'a-groin-height': svg('A. Supported floor-to-groin height', 'Side-view schematic. The upper endpoint is the underside at the front of the hind-leg attachment. A vertical arrow runs from that level to the level floor. It does not reach the top of the hip.', side() + dash(437, 245, 551, 245) + dash(510, 351, 551, 351) + line(540, 250, 540, 346) + point(437, 245) + badge('A', 574, 291)),
 'b1-hip-width': svg('B1. Straight hip width', 'Top-view schematic. A horizontal arrow crosses the full body at the hips from one outside body edge to the other. It does not wrap around the rump or measure one thigh.', top() + dash(278, 290, 221, 290) + dash(366, 290, 416, 290) + line(281, 290, 362, 290) + point(278, 290) + point(366, 290) + badge('B1', 190, 290)),
 'b2-body-width': svg('B2. Widest straight body width', 'Top-view schematic. Cross-body guide lines mark shoulders, ribs and hips. The rib line is highlighted as one example; measure all three locations and record the widest on your own dog.', top() + dash(266, 159, 377, 159) + dash(278, 290, 366, 290) + line(258, 211, 382, 211) + point(255, 211) + point(385, 211) + badge('B2', 190, 211) + '<text x="435" y="166" font-family="Arial,sans-serif" font-size="20" fill="#234b38">Shoulders</text><text x="435" y="218" font-family="Arial,sans-serif" font-size="20" fill="#234b38">Ribs</text>'),
 'c-body-length': svg('C. Armpit-to-rump length', 'Side-view schematic. Vertical guides locate the back of the front-leg armpit and the back of the rump before the tail. A straight horizontal arrow joins their levels, excluding the head, neck and tail.', side() + dash(205, 226, 205, 76) + dash(491, 205, 491, 76) + line(211, 86, 485, 86) + point(205, 226) + point(491, 205) + badge('C', 347, 57)),
 'd-chest-girth': svg('D. Chest circumference behind the front legs', 'Side-view schematic. A tape loop goes all the way around the rib cage just behind the front legs. The hidden half is dashed. This is a circumference, unlike the straight width measurements.', side() + '<path d="M250 141C224 153 219 218 244 239" fill="none" stroke="#936142" stroke-width="5" stroke-dasharray="7 6"/><path d="M250 141C274 157 275 224 244 239" fill="none" stroke="#234b38" stroke-width="5"/>' + point(250, 141) + badge('D', 305, 198)),
 'e-lying-leg': svg('E. Lying rear-leg measurement with a natural bend', 'View from above of a dog resting on their side on a padded surface. Both front and hind legs are relaxed and bent. The straight arrow beside the hind leg joins the groin crease and the underside of the paw pad; no floor datum is used.',
 '<rect x="35" y="85" width="570" height="280" rx="60" fill="#dce4d2"/>' +
 '<path d="M210 202C226 229 258 235 264 253L284 270C292 285 280 294 267 285L243 269 218 248 195 216M456 193C485 204 501 229 483 254L465 274 482 299C491 311 481 325 466 317L443 297 446 274 461 245 432 225" fill="#cbd4c5" stroke="#234b38" stroke-width="3"/>' +
 '<path d="M153 151C179 122 198 117 230 127 291 137 362 119 428 133 469 141 486 160 482 194 480 219 463 235 433 239 369 249 291 246 233 226 208 219 190 204 175 192L149 175Z" fill="#e3e7da" stroke="#234b38" stroke-width="3"/>' +
 '<path d="M167 148 151 119C138 100 113 96 96 109L81 132 47 143C37 149 43 163 55 166L91 172 113 191 150 177" fill="#e3e7da" stroke="#234b38" stroke-width="3"/>' +
 '<path d="M137 111C149 137 137 156 119 160L109 122" fill="#cbd4c5" stroke="#234b38" stroke-width="3"/><circle cx="92" cy="133" r="3.5" fill="#234b38"/>' +
 '<path d="M463 151C505 133 536 159 555 133 551 160 523 179 477 172" fill="#e3e7da" stroke="#234b38" stroke-width="3"/>' +
 '<path d="M203 201C222 214 233 230 229 248L259 261 281 279C289 290 276 301 264 291L243 280 211 266 199 242 186 219M440 190C460 202 465 220 449 240L475 265 454 291 472 306C479 317 466 327 455 317L434 300 435 280 448 264 422 239" fill="#e3e7da" stroke="#234b38" stroke-width="3"/>' +
 dash(429, 231, 529, 231) + dash(465, 313, 565, 313) + line(531, 235, 563, 309) + point(429, 231) + point(465, 313) + badge('E', 596, 271) +
 '<text x="52" y="57" font-family="Arial,sans-serif" font-size="22" fill="#234b38">Resting on the side, viewed from above</text>'),
 }
 for (const [name, content] of Object.entries(drawings)) await Bun.write(`public/guides/measure-${name}.svg`, content)
}
if (import.meta.main) await writeMeasurementArt()
