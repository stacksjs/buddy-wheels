import { defineCommand } from '@stacksjs/cli'
import { print } from '@stacksjs/cli/output'
import { designRoot } from '../Designs/Wheelchair'
import { buildSpringCad } from '../Designs/XLSpringBuild'
export default defineCommand({
  name: 'design:xl-spring',
  description: 'Generate XL r2 undamped spring bench CAD, complete BOM and priced manufacturing scenario',
  options: { '--export': { description: 'Export verified STL/DXF and native CAD preview', default: false }, '--openscad <path>': { description: 'OpenSCAD executable', default: 'openscad' } },
  async handle(options) { await buildSpringCad(designRoot, options.export ? options.openscad : undefined); print('Generated XL r2 undamped spring bench design and cost model. Not for animal use.') },
})
