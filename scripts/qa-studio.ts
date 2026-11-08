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
  const families = [
    { size: 'XS', height: 260, width: 160, rail: 260, minHeight: 260, maxHeight: 320, radius: 40, arm: 70, wheel: 120 },
    { size: 'S', height: 300, width: 210, rail: 340, minHeight: 300, maxHeight: 380, radius: 62, arm: 100, wheel: 200 },
    { size: 'M', height: 385, width: 280, rail: 460, minHeight: 385, maxHeight: 480, radius: 85, arm: 140, wheel: 300 },
    { size: 'L', height: 500, width: 340, rail: 600, minHeight: 440, maxHeight: 620, radius: 105, arm: 165, wheel: 350 },
    { size: 'XL', height: 620, width: 400, rail: 680, minHeight: 500, maxHeight: 760, radius: 110, arm: 180, wheel: 400 },
  ]
  for (const family of families) {
    await click(cdp, '.studio-size-options label:has(input[value="' + family.size + '"])')
    await ready(); await settle(cdp)
    assert.equal(await cdp.evaluate('document.querySelector("#studio-height").min'), String(family.minHeight))
    assert.equal(await cdp.evaluate('document.querySelector("#studio-height").max'), String(family.maxHeight))
    assert.match(await cdp.evaluate<string>('document.querySelector("canvas").getAttribute("aria-label")'), new RegExp('Buddy ' + family.size + ' '))
    for (const field of ['height', 'width', 'rail'] as const) await input('#studio-' + field, String(family[field] + 5))
    await click(cdp, '.studio-leverage label:nth-child(3)')
    await input('#studio-travel', '6')
    await click(cdp, '.studio-view-options button:first-child')
    await ready(); await settle(cdp)
    assert.match(await cdp.evaluate<string>('document.querySelector(".studio-rate").textContent'), new RegExp(((family.radius / family.arm) ** 2).toFixed(3)))
    const request = await cdp.evaluate<{ action: string, fields: Record<string, string> }>('(() => {const form=document.querySelector("#studio-download");return{action:form.action,fields:Object.fromEntries(new FormData(form))}})()')
    assert.match(request.action, new RegExp('/api/designs/' + family.size.toLowerCase() + '/kit'))
    const kit = await fetch(request.action + '?' + new URLSearchParams(request.fields))
    assert.equal(kit.status, 200)
    const files = await new Bun.Archive(await kit.arrayBuffer()).files()
    const parameters = JSON.parse(await files.get('parameters.json')!.text())
    assert.equal(parameters.size, family.size)
    assert.equal(parameters.height, family.height + 5)
    assert.equal(parameters.wheel, family.wheel)
    assert.match(await files.get('assembly.md')!.text(), new RegExp('# Your ' + family.size + ' bench assembly'))
    assert.equal(JSON.parse(await files.get('profile.json')!.text()).basis, family.size)
    const records = JSON.parse(await files.get('checksums.json')!.text())
    for (const record of records.files) assert.equal(new Bun.CryptoHasher('sha256').update(await files.get(record.file)!.arrayBuffer()).digest('hex'), record.sha256)
    const manifest = await (await fetch(origin + '/designs/' + family.size.toLowerCase() + '/r0/manifest.json')).json() as { assets: { path: string, sha256: string }[] }
    for (const asset of manifest.assets.filter(asset => asset.path.endsWith('.stl'))) assert.equal(new Bun.CryptoHasher('sha256').update(await files.get(asset.path)!.arrayBuffer()).digest('hex'), asset.sha256)
    const partUrl = await cdp.evaluate<string>('document.querySelector(".studio-part-actions a").href')
    assert.match(partUrl, new RegExp('/api/designs/' + family.size.toLowerCase() + '/part/tube_cap'))
    const part = await fetch(partUrl)
    assert.match(part.headers.get('Content-Disposition') || '', new RegExp('buddy-' + family.size.toLowerCase() + '-r0-tube_cap'))
    assert.equal(new Bun.CryptoHasher('sha256').update(await part.arrayBuffer()).digest('hex'), manifest.assets.find(asset => asset.path === 'parts/tube_cap.stl')!.sha256)
    await click(cdp, '.studio-lock input'); await ready()
    assert.equal(await cdp.evaluate('document.querySelector("#studio-travel").value'), '0')
    await click(cdp, '.studio-lock input'); await input('#studio-travel', '6'); await ready()
    const shot = await cdp.send('Page.captureScreenshot', { format: 'png' }) as { data: string }
    await Bun.write(out + '/family-' + family.size.toLowerCase() + '.png', Buffer.from(shot.data, 'base64'))
  }
  await click(cdp, '.studio-size-options label:has(input[value="XS"])'); await ready()
  assert.equal(await cdp.evaluate('document.querySelector("#studio-height").value'), '265', 'Switching back restores XS custom dimensions')
  assert.equal(await cdp.evaluate('document.querySelector("#studio-travel").value'), '6')
  await click(cdp, '.studio-reset'); await ready()
  assert.equal(await cdp.evaluate('document.querySelector("#studio-height").value'), '260', 'Reset applies to the selected size')
  await click(cdp, '.studio-size-options label:has(input[value="L"])'); await ready()
  assert.equal(await cdp.evaluate('document.querySelector("#studio-height").value'), '505', 'Resetting XS preserves L edits')
  for (const invalid of ['/api/designs/xxl/kit', '/api/designs/xs/kit?height=620', '/api/designs/m/kit?size=XL']) assert.equal((await fetch(origin + invalid)).status, 422)
  assert.equal((await fetch(origin + '/api/designs/xxl/part/tube_cap')).status, 404)
  await navigate(cdp, `${origin}/shop?size=S`)
  await click(cdp, '[data-studio-size-link]')
  await ready()
  assert.equal(await cdp.evaluate('document.querySelector(".studio-size-options input:checked").value'), 'S')
  assert.equal(await cdp.evaluate('document.querySelector("#studio-height").value'), '300')
  await cdp.evaluate('document.querySelector(".studio-size-options input:checked").focus()')
  await cdp.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'ArrowRight', code: 'ArrowRight', windowsVirtualKeyCode: 39 })
  await cdp.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'ArrowRight', code: 'ArrowRight', windowsVirtualKeyCode: 39 })
  await waitFor(() => cdp.evaluate('document.querySelector(".studio-size-options input:checked").value === "M"'))
  await ready()
  assert.equal(await cdp.evaluate('document.querySelector("#studio-height").value'), '385')
  for (const family of families) {
    await navigate(cdp, origin + '/design-studio?size=' + family.size + '&height=' + (family.height + 5) + '&setting=2')
    await ready()
    assert.equal(await cdp.evaluate('document.querySelector(".studio-size-options input:checked").value'), family.size)
    assert.equal(await cdp.evaluate('document.querySelector("#studio-height").value'), String(family.height + 5))
  }
  for (const width of [320, 428, 768, 1440]) {
    await cdp.send('Emulation.setDeviceMetricsOverride', { width, height: 1000, deviceScaleFactor: width === 1440 ? 2 : 1, mobile: width < 768 })
    await navigate(cdp, `${origin}/design-studio?height=660&width=440&rail=720&setting=2`)
    await ready(); await settle(cdp)
    assert.equal(await cdp.evaluate<number>(`Math.max(0,document.documentElement.scrollWidth-${width})`), 0, `Studio overflow at ${width}`)
    assert.equal(await cdp.evaluate("document.querySelector('#studio-height').value"), '660')
    const sizeBoxes = await cdp.evaluate<number[]>('[...document.querySelectorAll(".studio-size-options label>span")].map(element=>element.getBoundingClientRect().height)')
    assert.ok(Math.max(...sizeBoxes) - Math.min(...sizeBoxes) <= 1, 'Size selector boxes align at ' + width)
    assert.ok(Math.min(...sizeBoxes) >= 44, 'Size choices retain a touch target at ' + width)
    if (width === 1440) assert.equal(await cdp.evaluate('Math.round(document.querySelector("canvas").clientWidth*2) === document.querySelector("canvas").width'), true)
    for (const family of families) {
      await click(cdp, '.studio-size-options label:has(input[value="' + family.size + '"])')
      await ready(); await settle(cdp)
      assert.equal(await cdp.evaluate<number>('Math.max(0,document.documentElement.scrollWidth-' + width + ')'), 0, family.size + ' overflow at ' + width)
    }
    const shot = await cdp.send('Page.captureScreenshot', { format: 'png' }) as { data: string }
    await Bun.write(out + '/studio-' + width + '.png', Buffer.from(shot.data, 'base64'))
  }
  await cdp.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: 'dark' }] })
  await navigate(cdp, `${origin}/design-studio`)
  await ready(); await settle(cdp)
  assert.equal(await cdp.evaluate('getComputedStyle(document.body).backgroundColor'), 'rgb(29, 43, 34)')
  assert.equal(await cdp.evaluate('getComputedStyle(document.querySelector("#studio-height")).backgroundColor'), 'rgb(39, 59, 44)')
  const darkShot = await cdp.send('Page.captureScreenshot', { format: 'png' }) as { data: string }
  await Bun.write(`${out}/studio-dark.png`, Buffer.from(darkShot.data, 'base64'))
  assert.deepEqual(cdp.errors, [])
  console.log(JSON.stringify({ origin, realWebGLOrbit: 'passed', configuration: 'passed', allSizes: families.map(family => family.size), rememberedEdits: 'passed', familyKits: 'passed', matchedDownload: 'passed', checksumVerification: 'passed', lockAndValidation: 'passed', partInspection: 'passed', responsiveWidths: [320, 428, 768, 1440], retinaBacking: 'passed', darkTheme: 'passed', consoleErrors: [] }))
}
finally { await browser.close() }

const fallback = await launch({ args: ['--disable-webgl'] })
try {
  await navigate(fallback.cdp, `${origin}/design-studio`)
  await waitFor(() => fallback.cdp.evaluate("document.querySelector('[data-stx-model-viewer]')?.dataset.modelStatus === 'error'"))
  assert.equal(await fallback.cdp.evaluate("document.querySelector('.stx-model-viewer-fallback img').complete"), true)
  assert.equal(await fallback.cdp.evaluate("document.querySelector('#studio-download button').disabled"), false)
  for (const size of ['XS', 'S', 'M', 'L', 'XL']) {
    await click(fallback.cdp, '.studio-size-options label:has(input[value="' + size + '"])')
    await waitFor(() => fallback.cdp.evaluate('Boolean(document.querySelector(".stx-model-viewer-fallback img")?.src.includes("/designs/' + size.toLowerCase() + '/r0/") && document.querySelector(".stx-model-viewer-fallback img").naturalWidth > 0)'))
    assert.match(await fallback.cdp.evaluate<string>('document.querySelector("canvas").getAttribute("aria-label")'), new RegExp('Buddy ' + size + ' '))
    assert.equal(await fallback.cdp.evaluate('document.querySelector("#studio-download button").disabled'), false)
  }
  assert.deepEqual(fallback.cdp.errors, [])
  console.log(JSON.stringify({ nonWebGLDrawingAndDownloads: 'passed' }))
}
finally { await fallback.close() }
