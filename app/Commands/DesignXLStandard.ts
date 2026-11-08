import { defineCommand } from '@stacksjs/cli'
import { print } from '@stacksjs/cli/output'
import { designRoot } from '../Designs/Wheelchair'
import { buildStandardCad } from '../Designs/XLStandardBuild'
export default defineCommand({
  name: 'design:xl-standard',
  description: 'Generate XL r1 rigid bench CAD, complete BOM and priced manufacturing scenario',
  options: { '--export': { description: 'Export verified STL/DXF and native CAD preview', default: false }, '--openscad <path>': { description: 'OpenSCAD executable', default: 'openscad' } },
  async handle(options) { await buildStandardCad(designRoot, options.export ? options.openscad : undefined); print('Generated XL r1 rigid bench design and cost model. Not for animal use.') },
})
