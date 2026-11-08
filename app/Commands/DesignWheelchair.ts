import { defineCommand } from '@stacksjs/cli'
import { print } from '@stacksjs/cli/output'
import { bundleWheelchairDesign, designRoot, exportWheelchairCad, generateWheelchairSources, readWheelchairProfile } from '../Designs/Wheelchair'

export default defineCommand({
  name: 'design:wheelchair',
  description: 'Generate versioned bench-only wheelchair CAD, BOM and suspension kinematics',
  options: {
    '--size <size>': { description: 'XL first, or L, M, S, XS, all', default: 'XL' },
    '--export': { description: 'Export STL, DXF and CAD previews through OpenSCAD', default: false },
    '--openscad <path>': { description: 'Installed OpenSCAD executable', default: 'openscad' },
    '--profile <path>': 'JSON geometry profile, exported separately under designs/wheelchair/iterations',
    '--bundle': { description: 'Bundle current CAD and documents into an ignored tar.gz download', default: false },
  },
  async handle(options) {
    const profile = options.profile ? await readWheelchairProfile(options.profile) : undefined
    if (options.export)
      await exportWheelchairCad(designRoot, options.size, options.openscad, profile)
    else
      await generateWheelchairSources(designRoot, profile)
    print(`Generated bench-only CAD under designs/wheelchair/${profile ? `iterations/${profile.id}` : 'r0'}. Not an animal-use release. See r0/README.md and the XL assembly guide.`)
    if (options.bundle)
      print(await bundleWheelchairDesign(designRoot))
  },
})
