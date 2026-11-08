import { defineCommand } from '@stacksjs/cli'
import { print } from '@stacksjs/cli/output'
import { designRoot } from '../Designs/Wheelchair'
import { publishStudioAssets } from '../Designs/StudioDownloads'

export default defineCommand({
  name: 'design:publish',
  description: 'Publish all verified wheelchair bench parts and CAD drawing into versioned public assets',
  async handle() { await publishStudioAssets(designRoot); print('Published XS, S, M, L and XL bench assets under public/designs/{size}/r0.') },
})
