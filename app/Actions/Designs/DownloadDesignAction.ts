import {splitSoft,parseSoft} from '../../Designs/SoftGoods'
import {studioSoftFrame} from '../../Designs/SoftGoodsFrame'
import {softDownload} from '../../Designs/SoftGoodsDownloads'
import {splitFinish} from '../../Storefront/Finish'
import {finishDownload} from '../../Designs/FinishDownloads'
import { designRoot } from '../../Designs/Wheelchair'
import { studioDownload } from '../../Designs/StudioDownloads'
import { parseStudioSetup } from '../../Designs/StudioSetup'

export default new Action({
  name: 'Download configured wheelchair bench design',
  method: 'GET',
  async handle(request) {
    const artifact = request.getParam('artifact')
    if (!['kit', 'assembly', 'bom', 'profile', 'textiles'].includes(String(artifact))) return new Response('File not found.', { status: 404 })
    let goods
    let textileFrame
    let finish
    let setup
    try {
      const query = new URL(request.url).searchParams
      const input: Record<string, string> = Object.create(null)
      for (const [key, value] of query) {
        if (Object.hasOwn(input, key)) throw new Error('Repeated setup fields are not allowed.')
        input[key] = value
      }
      const selected=splitFinish(input);finish=selected.finish;const textile=splitSoft(selected.configuration);setup = parseStudioSetup(textile.frame, request.getParam('size'))
      textileFrame=studioSoftFrame(setup);goods=parseSoft(textile.soft,textileFrame)
    }
    catch (error) { return response.json({ code: 'INVALID_DESIGN_SETUP', error: error instanceof Error ? error.message : 'Check your wheelchair setup.' }, { status: 422 }) }
    return finishDownload(await softDownload(designRoot,await studioDownload(designRoot, String(artifact), setup),String(artifact),textileFrame!,goods!,finish!),String(artifact),finish!)
  },
})
