import { defineCommand } from '@stacksjs/cli'
import { print } from '@stacksjs/cli/output'
import { buildRover } from '../Designs/RoverBuild'
import { designRoot } from '../Designs/Wheelchair'

export default defineCommand({
  name: 'design:rover',
  description: 'Generate the Buddy Rover r0 bench design: printable parts, metal profiles, drawings, materials and cost study',
  async handle() {
    const result = await buildRover(designRoot)
    print(`Generated Buddy Rover r0: ${result.assets} files, ${result.printVolumeCm3} cm3 of printed parts per carrier. Bench design, not for animal use.`)
  },
})
