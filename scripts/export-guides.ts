import { mkdir } from 'node:fs/promises'
import { launch, navigate, settle } from '@stacksjs/testing/browser'

const origin = (process.env.BUDDY_GUIDE_URL || 'http://localhost:3460').replace(/\/$/, '')
const exports = [
  { path: '/measurement-handbook', file: 'buddy-wheels-measuring-guide.pdf' },
  { path: '/prototype-budget', file: 'buddy-wheels-xl-build-budget.pdf' },
]
await mkdir('public/guides', { recursive: true })
const browser = await launch({ viewport: { width: 960, height: 1200 } })
try {
  for (const item of exports) {
    await navigate(browser.cdp, origin + item.path)
    await settle(browser.cdp)
    const ready = await browser.cdp.evaluate<boolean>('Array.from(document.images).every(image => image.complete && image.naturalWidth > 0)')
    if (!ready) throw new Error(`A guide image did not load at ${item.path}.`)
    await browser.cdp.send('Emulation.setEmulatedMedia', { media: 'print' })
    const result = await browser.cdp.send('Page.printToPDF', { printBackground: true, preferCSSPageSize: true, generateTaggedPDF: true, displayHeaderFooter: false }) as { data: string }
    const bytes = Buffer.from(result.data, 'base64')
    if (!bytes.subarray(0, 5).toString().startsWith('%PDF-')) throw new Error('Browser did not return a PDF.')
    await Bun.write(`public/guides/${item.file}`, bytes)
    console.log(JSON.stringify({ route: item.path, file: `public/guides/${item.file}`, bytes: bytes.length, sha256: new Bun.CryptoHasher('sha256').update(bytes).digest('hex') }))
    await browser.cdp.send('Emulation.setEmulatedMedia', { media: '' })
  }
  if (browser.cdp.errors.length) throw new Error(browser.cdp.errors.join('\n'))
}
finally { await browser.close() }
