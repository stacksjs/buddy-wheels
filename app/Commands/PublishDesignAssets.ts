import { defineCommand } from '@stacksjs/cli'
import { print } from '@stacksjs/cli/output'
import { designRoot } from '../Designs/Wheelchair'
import { publishXLAssets } from '../Designs/XLDownloads'

export default defineCommand({
  name: 'design:publish',
  description: 'Publish the verified XL bench parts and CAD drawing into versioned public assets',
  async handle() { await publishXLAssets(designRoot); print('Published XL bench assets under public/designs/xl/r0.') },
})
