import assert from 'node:assert/strict'
import { mkdir } from 'node:fs/promises'
import { click, launch, navigate, settle, waitFor } from '@stacksjs/testing/browser'

const origin = (process.env.BUDDY_QA_URL || 'http://localhost:3460').replace(/\/$/, '')
const out = 'storage/framework/runtime/qa-studio'
await mkdir(out, { recursive: true })
const browser = await launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] })
const { cdp } = browser
const ready = () => waitFor(() => cdp.evaluate("document.querySelector('[data-stx-model-viewer]')?.dataset.modelStatus === 'ready'"), 15000)
async function input(selector: string, value: string): Promise<void> {
  await cdp.evaluate(`(() => {const input=document.querySelector(${JSON.stringify(selector)});input.value=${JSON.stringify(value)};input.dispatchEvent(new Event('input',{bubbles:true}));input.dispatchEvent(new Event('change',{bubbles:true}));})()`)
}
async function raster(): Promise<string> {
  const rect = await cdp.evaluate<{ x: number, y: number, width: number, height: number }>("(() => {const r=document.querySelector('.stx-model-viewer-canvas').getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height}})()")
  const shot = await cdp.send('Page.captureScreenshot', { format: 'png', clip: { ...rect, scale: 1 }, captureBeyondViewport: true }) as { data: string }
  return shot.data
}
try {
  await navigate(cdp, `${origin}/`)
  await click(cdp, 'nav[aria-label="Main navigation"] a[href="/design-studio"]')
  await waitFor(() => cdp.evaluate("location.pathname === '/design-studio'"))
  await ready(); await settle(cdp)
  assert.ok(await cdp.evaluate<number>("Number(document.querySelector('.stx-model-viewer-canvas').dataset.modelVertices)") > 1000)
  await cdp.evaluate("document.querySelector('.stx-model-viewer-canvas').focus()")
  const before = await raster()
  const point = await cdp.evaluate<{ x: number, y: number }>("(() => {const r=document.querySelector('.stx-model-viewer-canvas').getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2}})()")
  await cdp.send('Input.dispatchMouseEvent', { type: 'mousePressed', x: point.x, y: point.y, button: 'left', buttons: 1, clickCount: 1 })
  await cdp.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: point.x + 90, y: point.y + 35, buttons: 1 })
  await cdp.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: point.x + 90, y: point.y + 35, button: 'left', buttons: 0, clickCount: 1 })
  await settle(cdp)
  assert.notEqual(await raster(), before, 'Real pointer orbit changes the rendered model pixels')
  await click(cdp, '.stx-model-viewer-zoom button[aria-label="Zoom in"]')
  await settle(cdp)
  const afterZoom = await raster()
  assert.notEqual(afterZoom, before)
  await click(cdp, '.stx-model-viewer-toolbar button[aria-label="Reset 3D view"]')
  for (const [selector, value] of [['#studio-height', '660'], ['#studio-width', '440'], ['#studio-rail', '720']]) await input(selector!, value!)
  await click(cdp, '.studio-leverage label:nth-child(3)')
  await input('#studio-travel', '6')
  await ready(); await settle(cdp)
  assert.match(await cdp.evaluate<string>("document.querySelector('.studio-readout').textContent"), /415/)
  assert.match(await cdp.evaluate<string>("document.querySelector('.studio-rate').textContent"), /0\.373/)
  const form = await cdp.evaluate<Record<string, string>>("Object.fromEntries(new FormData(document.querySelector('#studio-download')))")
  assert.equal(form.height, '660'); assert.equal(form.width, '440'); assert.equal(form.rail, '720'); assert.equal(form.setting, '2'); assert.equal(form.travel, '6')
  const response = await fetch(`${origin}/api/designs/xl/kit?${new URLSearchParams(form)}`)
  assert.equal(response.status, 200)
  assert.match(response.headers.get('Content-Disposition') || '', /xl-h660-w440-l720-c/)
  const downloadedBytes = await response.arrayBuffer()
  const archive = await new Bun.Archive(downloadedBytes).files()
  assert.equal(JSON.parse(await archive.get('parameters.json')!.text()).height, 660)
  assert.match(await archive.get('assembly.md')!.text(), /quantity 2 \| 355/)
  assert.match(await archive.get('source/wheelchair.scad')!.text(), /setting = 2;/)
  assert.equal([...archive.keys()].filter(name => name.endsWith('.stl')).length, 10)
  const hashes = JSON.parse(await archive.get('checksums.json')!.text())
  for (const record of hashes.files) assert.equal(new Bun.CryptoHasher('sha256').update(await archive.get(record.file)!.arrayBuffer()).digest('hex'), record.sha256)
  await Bun.write(`${out}/configured-kit.tar.gz`, new Uint8Array(downloadedBytes))
  await click(cdp, '.studio-lock input')
  await ready(); await settle(cdp)
  assert.equal(await cdp.evaluate("document.querySelector('#studio-travel').disabled"), true)
  assert.equal(await cdp.evaluate("document.querySelector('#studio-travel').value"), '0')
  await click(cdp, '.studio-reset')
  await ready()
  await input('#studio-height', '499')
  await waitFor(() => cdp.evaluate("Boolean(document.querySelector('.studio-validation'))"))
  assert.equal(await cdp.evaluate("document.querySelector('#studio-download button').disabled"), true)
  await input('#studio-height', '620')
  await ready()
  await click(cdp, '.studio-view-options button:nth-child(2)')
  await ready()
  const detailNodes = await cdp.evaluate<number>("Number(document.querySelector('.stx-model-viewer-canvas').dataset.modelNodes)")
  assert.ok(detailNodes < 20)
  await click(cdp, '.studio-check input')
  await ready(); await settle(cdp)
  const detail = await cdp.send('Page.captureScreenshot', { format: 'png' }) as { data: string }
  await Bun.write(`${out}/suspension.png`, Buffer.from(detail.data, 'base64'))
  await click(cdp, '.studio-parts > .studio-parts-grid .studio-part:first-child button')
  await ready()
  assert.equal(await cdp.evaluate("document.querySelector('.stx-model-viewer-canvas').dataset.modelNodes"), '1')
  assert.match(await cdp.evaluate<string>("document.querySelector('.studio-view-heading h2').textContent"), /Tube end cap/)
  const part = await fetch(`${origin}/api/designs/xl/part/tube_cap`)
  assert.equal(part.status, 200)
  assert.match(part.headers.get('Content-Disposition') || '', /tube_cap\.stl/)
  assert.ok((await part.arrayBuffer()).byteLength > 100)
  for (const bad of ['height=499', 'height=620&height=660', 'locked=true&travel=1', 'rail=681', 'height=%3Cscript%3E']) assert.equal((await fetch(`${origin}/api/designs/xl/kit?${bad}`)).status, 422)
  assert.equal((await fetch(`${origin}/api/designs/xl/part/unknown`)).status, 404)
  assert.equal((await fetch(`${origin}/api/designs/xl/secrets`)).status, 404)
  for (const width of [320, 428, 768, 1440]) {
    await cdp.send('Emulation.setDeviceMetricsOverride', { width, height: 1000, deviceScaleFactor: width === 1440 ? 2 : 1, mobile: width < 768 })
    await navigate(cdp, `${origin}/design-studio?height=660&width=440&rail=720&setting=2`)
    await ready(); await settle(cdp)
    assert.equal(await cdp.evaluate<number>(`Math.max(0,document.documentElement.scrollWidth-${width})`), 0, `Studio overflow at ${width}`)
    assert.equal(await cdp.evaluate("document.querySelector('#studio-height').value"), '660')
    if (width === 1440) assert.equal(await cdp.evaluate('Math.round(document.querySelector("canvas").clientWidth*2) === document.querySelector("canvas").width'), true)
    const shot = await cdp.send('Page.captureScreenshot', { format: 'png' }) as { data: string }
    await Bun.write(`${out}/studio-${width}.png`, Buffer.from(shot.data, 'base64'))
  }
  await cdp.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: 'dark' }] })
  await navigate(cdp, `${origin}/design-studio`)
  await ready(); await settle(cdp)
  assert.equal(await cdp.evaluate('getComputedStyle(document.body).backgroundColor'), 'rgb(29, 43, 34)')
  assert.equal(await cdp.evaluate('getComputedStyle(document.querySelector("#studio-height")).backgroundColor'), 'rgb(39, 59, 44)')
  const darkShot = await cdp.send('Page.captureScreenshot', { format: 'png' }) as { data: string }
  await Bun.write(`${out}/studio-dark.png`, Buffer.from(darkShot.data, 'base64'))
  assert.deepEqual(cdp.errors, [])
  console.log(JSON.stringify({ origin, realWebGLOrbit: 'passed', configuration: 'passed', matchedDownload: 'passed', checksumVerification: 'passed', lockAndValidation: 'passed', partInspection: 'passed', responsiveWidths: [320, 428, 768, 1440], retinaBacking: 'passed', darkTheme: 'passed', consoleErrors: [] }))
}
finally { await browser.close() }

const fallback = await launch({ args: ['--disable-webgl'] })
try {
  await navigate(fallback.cdp, `${origin}/design-studio`)
  await waitFor(() => fallback.cdp.evaluate("document.querySelector('[data-stx-model-viewer]')?.dataset.modelStatus === 'error'"))
  assert.equal(await fallback.cdp.evaluate("document.querySelector('.stx-model-viewer-fallback img').complete"), true)
  assert.equal(await fallback.cdp.evaluate("document.querySelector('#studio-download button').disabled"), false)
  assert.deepEqual(fallback.cdp.errors, [])
  console.log(JSON.stringify({ nonWebGLDrawingAndDownloads: 'passed' }))
}
finally { await fallback.close() }
