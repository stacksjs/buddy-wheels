import {expect,test}from'bun:test'
import{createModelGeometry}from'@stacksjs/browser/model-viewer'
import{coilMesh}from'../../app/Designs/CoilMesh'
import{textileStl,softStart}from'../../app/Designs/SoftGoods'
import{inspectBinaryStl}from'../../app/Designs/Mesh'
import{springScene}from'../../app/Designs/XLSpringScene'
import{springStart}from'../../app/Designs/XLSpring'
import{softScene}from'../../app/Designs/SoftGoodsScene'
import{xlSoftFrame}from'../../app/Designs/SoftGoodsFrame'
import{defaultFinish}from'../../app/Storefront/Finish'
test('one native indexed coil per wheel retains closed orientation and the nominal20/10 mm envelope',()=>{
 for(const length of [65,74,75]){const geometry=coilMesh(length);const mesh=inspectBinaryStl(new Uint8Array(textileStl({...geometry,boundary:[]})).buffer);expect(mesh.closed).toBe(true);expect(mesh.consistentlyOriented).toBe(true);expect(mesh.signedVolumeMm3).toBeGreaterThan(0);expect(mesh.boundsMm.size[0]).toBeCloseTo(20,4);expect(mesh.boundsMm.size[1]).toBeCloseTo(20,4);expect(Math.min(...geometry.vertices.map(([x,y])=>Math.hypot(x,y)))).toBeCloseTo(5,5);expect(createModelGeometry(geometry).length).toBe(geometry.triangles.length*9)}
 const frame=xlSoftFrame(springStart);expect(springScene(springStart).nodes.length+softScene(frame,softStart(frame),defaultFinish).nodes.length).toBeLessThan(500)
})
