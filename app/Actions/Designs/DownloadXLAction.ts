import { designRoot } from '../../Designs/Wheelchair'
import { xlDownload } from '../../Designs/XLDownloads'
import { parseXLSetup } from '../../Designs/XLSetup'

export default new Action({
  name: 'Download configured XL bench design',
  method: 'GET',
  async handle(request) {
    const artifact = request.getParam('artifact')
    if (!['kit', 'assembly', 'bom', 'profile'].includes(String(artifact))) return new Response('File not found.', { status: 404 })
    let setup
    try {
      const query = new URL(request.url).searchParams
      const input: Record<string, string> = Object.create(null)
      for (const [key, value] of query) {
        if (Object.hasOwn(input, key)) throw new Error('Repeated setup fields are not allowed.')
        input[key] = value
      }
      setup = parseXLSetup(input)
    }
    catch (error) { return response.json({ code: 'INVALID_XL_SETUP', error: error instanceof Error ? error.message : 'Check your XL setup.' }, { status: 422 }) }
    return xlDownload(designRoot, String(artifact), setup)
  },
})
