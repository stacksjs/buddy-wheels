import { designRoot } from '../../Designs/Wheelchair'
import { parseStandardSetup } from '../../Designs/XLStandard'
import { standardDownload } from '../../Designs/XLStandardDownloads'
export default new Action({
  name: 'Download XL r1 standard-parts rigid bench design', method: 'GET',
  async handle(request) {
    let setup
    try {
      const input: Record<string, string> = Object.create(null)
      for (const [key, value] of new URL(request.url).searchParams) {
        if (Object.hasOwn(input, key)) throw new Error('Repeated setup fields are not allowed.')
        input[key] = value
      }
      setup = parseStandardSetup(input)
    }
    catch (error) { return response.json({ code: 'INVALID_R1_SETUP', error: error instanceof Error ? error.message : 'Check the r1 dimensions.' }, { status: 422 }) }
    return standardDownload(designRoot, String(request.getParam('artifact')), setup)
  },
})
