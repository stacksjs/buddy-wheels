import { finishDownload } from '../../Designs/FinishDownloads'
import { parseRoverSetup } from '../../Designs/Rover'
import { roverDownload } from '../../Designs/RoverDownloads'
import { designRoot } from '../../Designs/Wheelchair'
import { splitFinish } from '../../Storefront/Finish'

export default new Action({
  name: 'Download Buddy Rover r0 bench design',
  method: 'GET',
  async handle(request) {
    let finish
    let setup
    try {
      const input: Record<string, string> = Object.create(null)
      for (const [key, value] of new URL(request.url).searchParams) {
        if (Object.hasOwn(input, key)) throw new Error('Repeated setup fields are not allowed.')
        input[key] = value
      }
      const selected = splitFinish(input); finish = selected.finish; setup = parseRoverSetup(selected.configuration)
    }
    catch (error) { return response.json({ code: 'INVALID_ROVER_SETUP', error: error instanceof Error ? error.message : 'Check the Rover dimensions.' }, { status: 422 }) }
    const artifact = String(request.getParam('artifact'))
    return finishDownload(await roverDownload(designRoot, artifact, setup), artifact, finish)
  },
})
