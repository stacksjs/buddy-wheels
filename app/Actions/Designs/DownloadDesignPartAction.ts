import { join } from 'node:path'
import { designRoot } from '../../Designs/Wheelchair'
import { studioAssetRoot, studioPartFile, parseStudioSize } from '../../Designs/StudioSetup'

export default new Action({
  name: 'Download wheelchair printable bench part',
  method: 'GET',
  handle(request) {
    let file
    let size
    try { size = parseStudioSize(request.getParam('size')); file = studioPartFile(String(request.getParam('part'))) }
    catch { return new Response('Part not found.', { status: 404 }) }
    return new Response(Bun.file(join(designRoot, 'public', studioAssetRoot(size), 'parts', file)), { headers: { 'Content-Type': 'application/octet-stream', 'Content-Disposition': `attachment; filename="buddy-${size.toLowerCase()}-r0-${file}"`, 'Cache-Control': 'public, max-age=300', 'X-Content-Type-Options': 'nosniff' } })
  },
})
