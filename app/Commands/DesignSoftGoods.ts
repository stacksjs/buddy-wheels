import {defineCommand} from '@stacksjs/cli'
import {print} from '@stacksjs/cli/output'
import {designRoot} from '../Designs/Wheelchair'
import {buildSoftGoods} from '../Designs/SoftGoodsBuild'
export default defineCommand({
 name:'design:softgoods',description:'Generate all-size cut/sew bench patterns, non-printable reference meshes and sewing guides',
 options:{'--openscad <path>':{description:'Official OpenSCAD executable for assembled previews and independent XL panel verification'}},
 async handle(options){await buildSoftGoods(designRoot,options.openscad);print('Generated seven textile studies and 42 closed non-printable reference meshes. Not for animal use.')},
})
