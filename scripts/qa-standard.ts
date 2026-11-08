import assert from 'node:assert/strict'
import { mkdir } from 'node:fs/promises'
import { launch, navigate, settle, click, waitFor } from '@stacksjs/testing/browser'
const origin = (process.env.BUDDY_QA_URL || 'http://localhost:3460').replace(/\/$/, '')
const out = 'storage/framework/runtime/qa-standard'
await mkdir(out, { recursive: true })
const browser = await launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] })
const { cdp } = browser
const ready = () => waitFor(() => cdp.evaluate("document.querySelector('[data-stx-model-viewer]')?.dataset.modelStatus === 'ready'"), 20000)
async function input(id: string, value: string) {
  await cdp.evaluate(`(() => {const el=document.getElementById(${JSON.stringify(id)});el.value=${JSON.stringify(value)};el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));})()`)
}
async function screenshot(name: string) {
  await settle(cdp)
  const shot = await cdp.send('Page.captureScreenshot', { format: 'png' }) as { data: string }
  await Bun.write(out + '/' + name + '.png', Buffer.from(shot.data, 'base64'))
  return shot.data
}
try {
  await navigate(cdp, origin + '/design-studio?size=XL'); await settle(cdp)
  await click(cdp, '.standard-r1-notice a')
  await waitFor(() => cdp.evaluate("location.pathname === '/design-studio-xl'"))
  await ready(); await settle(cdp)
  assert.match(await cdp.evaluate<string>('document.querySelector("[data-standard-cogs]").textContent'), /180\.01/)
  const before = await screenshot('start')
  const rect = await cdp.evaluate<{ x: number, y: number }>('(() => {const r=document.querySelector(".stx-model-viewer-canvas").getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2}})()')
  await cdp.send('Input.dispatchMouseEvent', { type: 'mousePressed', ...rect, button: 'left', buttons: 1, clickCount: 1 })
  await cdp.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: rect.x + 80, y: rect.y + 30, buttons: 1 })
  await cdp.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: rect.x + 80, y: rect.y + 30, button: 'left', buttons: 0, clickCount: 1 })
  assert.notEqual(await screenshot('orbit'), before)
  for (const [id, value] of [['standard-height', '660'], ['standard-width', '440'], ['standard-rail', '720'], ['standard-hub', '80']]) await input(id!, value!)
  await ready(); await settle(cdp)
  const links = await cdp.evaluate<string[]>('[...document.querySelectorAll(".studio-file-links a")].map(a => a.href)')
  for (const link of links) assert.equal((await fetch(link)).status, 200, 'Configured link must resolve: ' + link)
  const kitUrl = await cdp.evaluate<string>('(() => {const form=document.getElementById("standard-download");return form.action + "?" + new URLSearchParams(new FormData(form))})()')
  const response = await fetch(kitUrl); assert.equal(response.status, 200)
  const files = await new Bun.Archive(await response.arrayBuffer()).files()
  const setup = JSON.parse(await files.get('setup.json')!.text()); assert.equal(setup.height, 660); assert.equal(setup.hub, 80); assert.equal(setup.suspension, 'rigid')
  assert.match(await files.get('model.scad')!.text(), /hub=80;/)
  const hashes = JSON.parse(await files.get('checksums.json')!.text())
  for (const record of hashes.files) assert.equal(new Bun.CryptoHasher('sha256').update(await files.get(record.file)!.arrayBuffer()).digest('hex'), record.sha256)
  assert.equal([...files.keys()].filter(f => f.endsWith('.stl')).length, 6)
  assert.equal([...files.keys()].filter(f => f.endsWith('.dxf')).length, 2)
  await input('standard-height', '499')
  assert.ok(await cdp.evaluate('document.querySelector("#standard-download button").disabled'))
  await click(cdp, '.studio-reset'); await ready()
  await click(cdp, '.standard-cost-toggle label:nth-of-type(2)')
  assert.match(await cdp.evaluate<string>('document.querySelector("[data-standard-cogs]").textContent'), /336\.01/)
  assert.match(await cdp.evaluate<string>('document.querySelector("[data-standard-gate]").textContent'), /Does not meet/)
  await click(cdp, '.standard-cost-toggle label:nth-of-type(1)')
  for (const [id, value] of [['standard-height', '760'], ['standard-width', '520'], ['standard-rail', '820']]) await input(id!, value!)
  assert.match(await cdp.evaluate<string>('document.querySelector("[data-standard-gate]").textContent'), /Does not meet/)
  await click(cdp, '.studio-reset')
  for (const part of ['end_cap', 'axle_cover', 'drill_guide', 'coupon', 'joint_plate', 'axle_plate']) {
    if (part === 'joint_plate') await click(cdp, '.studio-metal summary')
    await click(cdp, '.studio-part:has(a[href*="' + part + '.stl"]) button')
    await ready(); await settle(cdp)
    assert.ok(await cdp.evaluate<number>('Number(document.querySelector(".stx-model-viewer-canvas").dataset.modelVertices)') > 30)
  }
  await click(cdp, '.studio-view-options button:first-child'); await ready()
  for (const width of [320, 428, 768, 1440]) {
    await cdp.send('Emulation.setDeviceMetricsOverride', { width, height: 1000, deviceScaleFactor: 1, mobile: width < 768 })
    await navigate(cdp, origin + '/design-studio-xl'); await ready(); await settle(cdp)
    assert.equal(await cdp.evaluate<number>('Math.max(0,document.documentElement.scrollWidth-' + width + ')'), 0, 'r1 overflow ' + width)
    await cdp.evaluate('scrollTo(0,0)'); await screenshot('r1-' + width)
    await cdp.evaluate('document.querySelector(".standard-economics").scrollIntoView()'); await screenshot('cost-' + width)
  }
  await cdp.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: 'dark' }] }); await screenshot('dark')
  const contrast = await cdp.evaluate<number>(`(() => {const linear=v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4};const luminance=s=>{const c=s.match(/[0-9.]+/g).slice(0,3).map(Number).map(linear);return .2126*c[0]+.7152*c[1]+.0722*c[2]};const panel=document.querySelector('.standard-cost-panel');const a=luminance(getComputedStyle(panel.querySelector('dd')).color),b=luminance(getComputedStyle(panel).backgroundColor);return (Math.max(a,b)+.05)/(Math.min(a,b)+.05)})()`); assert.ok(contrast >= 4.5, 'Dark cost panel contrast ' + contrast)
  for (const query of ['height=499', 'height=620&height=660', 'setting=1', 'hub=59', 'hub=82.551', 'height=%3Cscript%3E']) assert.equal((await fetch(origin + '/api/designs/xl-r1/kit?' + query)).status, 422)
  assert.equal((await fetch(origin + '/api/designs/xl-r1/unknown')).status, 404)
  assert.deepEqual(cdp.errors, [])
  console.log(JSON.stringify({ origin, webGL: 'passed', configuration: 'passed', allParts: 'passed', archiveHashes: 'passed', oneVsBatchCosts: 'passed', marginGate: 'passed', responsiveWidths: [320, 428, 768, 1440], dark: 'passed', consoleErrors: [] }))
}
finally { await browser.close() }
const fallback = await launch({ args: ['--disable-webgl', '--disable-webgl2'] })
try {
  await navigate(fallback.cdp, origin + '/design-studio-xl')
  await waitFor(() => fallback.cdp.evaluate("document.querySelector('[data-stx-model-viewer]')?.dataset.modelStatus === 'error'"))
  assert.equal(await fallback.cdp.evaluate('document.querySelector(".stx-model-viewer-fallback img").complete'), true)
  assert.equal((await fetch(origin + '/api/designs/xl-r1/kit')).status, 200)
  assert.deepEqual(fallback.cdp.errors, [])
  console.log(JSON.stringify({ fallbackDrawingAndDownload: 'passed' }))
}
finally { await fallback.close() }
