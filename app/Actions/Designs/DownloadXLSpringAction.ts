import {splitSoft,parseSoft} from '../../Designs/SoftGoods'
import {xlSoftFrame} from '../../Designs/SoftGoodsFrame'
import {softDownload} from '../../Designs/SoftGoodsDownloads'
import {splitFinish} from '../../Storefront/Finish'
import {finishDownload} from '../../Designs/FinishDownloads'
import { designRoot } from '../../Designs/Wheelchair'
import { parseSpringSetup } from '../../Designs/XLSpring'
import { springDownload } from '../../Designs/XLSpringDownloads'
export default new Action({
  name: 'Download XL r2 standard-parts spring bench design', method: 'GET',
  async handle(request) {
    let goods
    let textileFrame
    let finish
    let setup
    try {
      const input: Record<string, string> = Object.create(null)
      for (const [key, value] of new URL(request.url).searchParams) {
        if (Object.hasOwn(input, key)) throw new Error('Repeated setup fields are not allowed.')
        input[key] = value
      }
      const selected=splitFinish(input);finish=selected.finish;const textile=splitSoft(selected.configuration);setup = parseSpringSetup(textile.frame)
      textileFrame=xlSoftFrame(setup,'r2');goods=parseSoft(textile.soft,textileFrame)
    }
    catch (error) { return response.json({ code: 'INVALID_R2_SETUP', error: error instanceof Error ? error.message : 'Check the r2 dimensions.' }, { status: 422 }) }
    return finishDownload(await softDownload(designRoot,await springDownload(designRoot, String(request.getParam('artifact')), setup),String(request.getParam('artifact')),textileFrame!,goods!,finish!),String(request.getParam('artifact')),finish!)
  },
})
