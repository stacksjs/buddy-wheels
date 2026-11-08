import { designRoot } from '../../Designs/Wheelchair'
import { parseSpringSetup } from '../../Designs/XLSpring'
import { springDownload } from '../../Designs/XLSpringDownloads'
export default new Action({
  name: 'Download XL r2 standard-parts spring bench design', method: 'GET',
  async handle(request) {
    let setup
    try {
      const input: Record<string, string> = Object.create(null)
      for (const [key, value] of new URL(request.url).searchParams) {
        if (Object.hasOwn(input, key)) throw new Error('Repeated setup fields are not allowed.')
        input[key] = value
      }
      setup = parseSpringSetup(input)
    }
    catch (error) { return response.json({ code: 'INVALID_R2_SETUP', error: error instanceof Error ? error.message : 'Check the r2 dimensions.' }, { status: 422 }) }
    return springDownload(designRoot, String(request.getParam('artifact')), setup)
  },
})
