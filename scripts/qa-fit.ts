import assert from 'node:assert/strict'
import { mkdir } from 'node:fs/promises'
import { launch, navigate, click, settle, waitFor } from '@stacksjs/testing/browser'

const origin = (process.env.BUDDY_QA_URL || 'http://localhost:3460').replace(/\/$/, '')
const out = 'storage/framework/runtime/qa-fit'
await mkdir(out, { recursive: true })
const browser = await launch()
const { cdp } = browser
async function input(id: string, value: string): Promise<void> {
  await cdp.evaluate(`(() => {const el=document.getElementById(${JSON.stringify(id)});el.value=${JSON.stringify(value)};el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));})()`)
}
try {
  await navigate(cdp, origin + '/fit-guide')
  await settle(cdp)
  for (const id of ['groin', 'hips', 'body', 'length', 'girth', 'rear']) {
    await click(cdp, '.fit-step-options label:has(input[value="' + id + '"])')
    await settle(cdp)
    assert.equal(await cdp.evaluate('document.querySelector(".fit-step-options input:checked").value'), id)
    assert.equal(await cdp.evaluate('document.querySelector(".fit-diagram img").complete && document.querySelector(".fit-diagram img").naturalWidth > 0'), true)
    assert.match(await cdp.evaluate<string>('document.querySelector(".fit-instructions h3").textContent'), new RegExp({ groin: 'groin', hips: 'Hip', body: 'Widest', length: 'rump', girth: 'girth', rear: 'Lying' }[id]))
  }
  await click(cdp, '.fit-step-options label:has(input[value="groin"])')
  await cdp.evaluate('document.querySelector(".fit-step-options input:checked").focus()')
  await cdp.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'ArrowRight', code: 'ArrowRight', windowsVirtualKeyCode: 39 })
  await cdp.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'ArrowRight', code: 'ArrowRight', windowsVirtualKeyCode: 39 })
  await waitFor(() => cdp.evaluate('document.querySelector(".fit-step-options input:checked").value === "hips"'))
  await input('fit-name', 'Other dog')
  await input('fit-breed', 'Other breed')
  for (const id of ['fit-groin', 'fit-hips', 'fit-body', 'fit-length', 'fit-girth', 'fit-rear']) await input(id, '12')
  await input('fit-posture', 'Previous posture')
  await input('fit-notes', 'Previous notes')
  await input('weight', '25'); await input('height', '10')
  await click(cdp, '[data-start-buddy]')
  for (const id of ['fit-breed', 'fit-groin', 'fit-hips', 'fit-body', 'fit-length', 'fit-girth', 'fit-rear', 'fit-posture', 'fit-notes', 'weight', 'height']) assert.equal(await cdp.evaluate('document.getElementById(' + JSON.stringify(id) + ').value'), '', id + ' must reset for Buddy')
  assert.equal(await cdp.evaluate('document.getElementById("fit-name").value'), 'Buddy')
  assert.equal(await cdp.evaluate('document.getElementById("fit-weight").value'), '140')
  assert.equal(await cdp.evaluate('document.getElementById("fit-groin").value'), '')
  for (const [id, value] of [['fit-groin', '25'], ['fit-hips', '13'], ['fit-body', '15'], ['fit-length', '27'], ['fit-girth', '40'], ['fit-rear', '26']]) await input(id!, value!)
  let report = await cdp.evaluate<string>('document.getElementById("fit-summary").value')
  assert.match(report, /Supported floor-to-groin height: 25 in/)
  assert.match(report, /Lying rear-leg measurement, natural bend: 26 in/)
  await click(cdp, '.fit-unit-options label:has(input[value="metric"])')
  assert.equal(await cdp.evaluate('document.getElementById("fit-groin").value'), '63.5')
  assert.equal(await cdp.evaluate('document.getElementById("fit-weight").value'), '63.5')
  report = await cdp.evaluate<string>('document.getElementById("fit-summary").value')
  assert.match(report, /height: 63.5 cm/)
  await click(cdp, '.fit-unit-options label:has(input[value="imperial"])')
  await input('fit-hips', '-1')
  await waitFor(() => cdp.evaluate('document.querySelector("[data-copy-measurements]").disabled'))
  assert.match(await cdp.evaluate<string>('document.querySelector(".fit-validation").textContent'), /Hip width/)
  await input('fit-hips', '13')
  const target = await cdp.send('Target.getTargetInfo') as { targetInfo: { browserContextId: string } }
  await cdp.send('Browser.grantPermissions', { origin, browserContextId: target.targetInfo.browserContextId, permissions: ['clipboardReadWrite', 'clipboardSanitizedWrite'] })
  await click(cdp, '[data-copy-measurements]')
  await waitFor(() => cdp.evaluate('document.querySelector(".fit-copy-status").textContent.includes("Worksheet copied")'))
  assert.match(await cdp.evaluate<string>('navigator.clipboard.readText()'), /Buddy/)
  await click(cdp, '.fit-use-record')
  assert.equal(await cdp.evaluate('document.getElementById("height").value'), '26')
  await click(cdp, '#size-helper button[type="submit"]')
  await waitFor(() => cdp.evaluate('document.querySelector("[data-fit-result]").textContent.includes("XL")'))
  await input('fit-groin', '')
  assert.match(await cdp.evaluate<string>('document.getElementById("fit-summary").value'), /height: PENDING/)
  assert.equal(await cdp.evaluate('document.getElementById("fit-rear").value'), '26')
  for (const width of [320, 428, 768, 1440]) {
    await cdp.send('Emulation.setDeviceMetricsOverride', { width, height: 1000, deviceScaleFactor: 1, mobile: width < 768 })
    await navigate(cdp, origin + '/fit-guide'); await settle(cdp)
    assert.equal(await cdp.evaluate<number>('Math.max(0,document.documentElement.scrollWidth-' + width + ')'), 0, 'Fit guide overflow at ' + width)
    const rects = await cdp.evaluate<{ height: number, width: number }[]>('[...document.querySelectorAll(".fit-step-options label>span")].map(e=>({height:e.getBoundingClientRect().height,width:e.getBoundingClientRect().width}))')
    assert.ok(Math.min(...rects.map(r => r.height)) >= 44)
    assert.ok(Math.max(...rects.map(r => r.height)) - Math.min(...rects.map(r => r.height)) <= 1)
    await cdp.evaluate('scrollTo(0,0)'); await settle(cdp)
    const shot = await cdp.send('Page.captureScreenshot', { format: 'png' }) as { data: string }
    await Bun.write(out + '/fit-' + width + '.png', Buffer.from(shot.data, 'base64'))
    if (width === 320 || width === 1440) {
      for (const section of ['.fit-guide-grid', '.fit-worksheet']) {
        await cdp.evaluate('document.querySelector(' + JSON.stringify(section) + ').scrollIntoView()'); await settle(cdp)
        const detail = await cdp.send('Page.captureScreenshot', { format: 'png' }) as { data: string }
        await Bun.write(out + '/detail-' + section.slice(1) + '-' + width + '.png', Buffer.from(detail.data, 'base64'))
      }
    }
    for (const route of ['/measurement-handbook', '/prototype-budget']) {
      await navigate(cdp, origin + route); await settle(cdp)
      assert.equal(await cdp.evaluate<number>('Math.max(0,document.documentElement.scrollWidth-' + width + ')'), 0, route + ' overflow at ' + width)
      if (route === '/measurement-handbook') {
        assert.equal(await cdp.evaluate('[...document.querySelectorAll(".guide-fields th")].filter(e => getComputedStyle(e).display !== "none").length'), 3)
        assert.ok(await cdp.evaluate('[...document.querySelectorAll(".guide-fields tbody tr")].every(row => [...row.children].filter(e => getComputedStyle(e).display !== "none").length === 3)'))
      }
    }
  }
  for (const path of ['/guides/buddy-wheels-measuring-guide.pdf', '/guides/buddy-wheels-xl-build-budget.pdf']) {
    const response = await fetch(origin + path)
    assert.equal(response.status, 200)
    assert.ok(new TextDecoder().decode((await response.arrayBuffer()).slice(0, 5)).startsWith('%PDF-'))
  }
  const budget = await (await fetch(origin + '/guides/xl-prototype-budget.json')).json() as { scenarios: { which: string, diyCash: number }[] }
  assert.equal(budget.scenarios.find(c => c.which === 'base')?.diyCash, 301212)
  const csv = await (await fetch(origin + '/guides/xl-prototype-budget.csv')).text()
  assert.match(csv, /549\.00/)
  assert.match(csv, /3012\.12/)
  await navigate(cdp, origin + '/prototype-budget')
  assert.match(await cdp.evaluate<string>('document.body.textContent'), /\$3,012\.12/)
  assert.match(await cdp.evaluate<string>('document.body.textContent'), /\$5,312\.12/)
  assert.deepEqual(cdp.errors, [])
  console.log(JSON.stringify({ origin, sixDiagrams: 'passed', worksheet: 'passed', unitsAndPending: 'passed', clipboard: 'passed', distinctHeightMethods: 'passed', sizeHelper: 'passed', responsiveWidths: [320, 428, 768, 1440], guideAndBudgetDownloads: 'passed', costArithmetic: 'passed', consoleErrors: [] }))
} finally { await browser.close() }
