import { join } from 'node:path'
import { designRoot } from '../../Designs/Wheelchair'
import { xlAssetRoot, xlPartFile } from '../../Designs/XLSetup'

export default new Action({
  name: 'Download XL printable bench part',
  method: 'GET',
  handle(request) {
    let file
    try { file = xlPartFile(String(request.getParam('part'))) }
    catch { return new Response('Part not found.', { status: 404 }) }
    return new Response(Bun.file(join(designRoot, 'public', xlAssetRoot, 'parts', file)), { headers: { 'Content-Type': 'application/octet-stream', 'Content-Disposition': `attachment; filename="buddy-xl-r0-${file}"`, 'Cache-Control': 'public, max-age=300', 'X-Content-Type-Options': 'nosniff' } })
  },
})
