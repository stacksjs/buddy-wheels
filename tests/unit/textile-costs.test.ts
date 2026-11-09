import {expect,test} from 'bun:test'
import {completeTextileCost,textileDemand,rectanglePurchase,linearPurchase} from '../../app/Designs/TextilePurchases'
import {softStart} from '../../app/Designs/SoftGoods'
import {softBill,bindingCuts} from '../../app/Designs/SoftGoodsBill'
import {xlSoftFrame} from '../../app/Designs/SoftGoodsFrame'
import {springStart} from '../../app/Designs/XLSpring'
import {springEconomics} from '../../app/Designs/XLSpringCost'
import {xlCompleteCostReport} from '../../app/Designs/XLCompleteCosts'
import {signedMoney} from '../../app/Storefront/Catalog'
const frame=xlSoftFrame(springStart),setup=softStart(frame)

test('complete XL textiles charge every cut and both hook/loop sides in full supplier packs',()=>{
 const demand=textileDemand(frame,setup),bill=softBill(frame,setup),cost=completeTextileCost(frame,setup)
 expect(demand.webbing.reduce((n,v)=>n+v,0)).toBe(8228)
 expect(demand.binding).toBe(8292)
 expect(demand.bindingCuts.reduce((n,v)=>n+v,0)).toBe(demand.binding)
 expect(bindingCuts(setup).slice(-10)).toEqual(Array(10).fill(207))
 expect(cost.demand.coveredIds).toEqual(bill.slice(1).map(row=>String(row[0])))
 expect(cost.purchases.webbing.units).toBe(23)
 expect(cost.purchases.mesh.units).toBe(10)
 expect(cost.purchases.woven.units).toBe(19)
 expect(cost.purchases.foam.units).toBe(12)
 expect(cost.purchases.binding.units).toBe(84)
 expect(cost.purchases.threadCones).toBe(9)
 expect(cost.purchases.patchFeet).toBe(70)
 expect(Math.floor(25*304.8/21)*2+Math.floor(20*304.8/21)).toBeGreaterThanOrEqual(1000)
 expect(cost.rows.find(row=>row.id==='hook')?.purchase).toBe(6300)
 expect(cost.rows.find(row=>row.id==='loop')?.purchase).toBe(6300)
 expect(cost.rows.find(row=>row.id==='adjusters')?.purchase).toBe(45000)
 expect(cost.materials).toBe(4228)
 expect(cost.rejects).toBe(423)
 expect(cost.labor).toBe(3750)
 expect(cost.freight).toBe(400)
 expect(cost.total).toBe(8801)
 expect(completeTextileCost(frame,setup,1).total).toBe(26738)
 for(const row of cost.rows)expect(row.allocation*100).toBeGreaterThanOrEqual(row.purchase)
 expect(cost.purchases.foam.stockAreaMm2).toBeGreaterThan(cost.purchases.foam.netAreaMm2)
})

test('purchasing respects stock boundaries and selected geometry instead of a flat material-area allowance',()=>{
 expect(linearPurchase([700,700,700],1000,200).units).toBe(3)
 expect(()=>linearPurchase([1000],1000,200)).toThrow()
 expect(rectanglePurchase([{width:60,length:60},{width:60,length:60}],100,100,100).units).toBe(2)
 expect(()=>rectanglePurchase([{width:100,length:60}],100,100,100)).toThrow()
 const larger={...setup,slingWidth:355,slingLength:300,legLength:180}
 const expanded=completeTextileCost(frame,larger)
 expect(expanded.demand.webbing.reduce((n,v)=>n+v,0)).toBeGreaterThan(8228)
 expect(expanded.total).toBeGreaterThan(8801)
 expect(completeTextileCost(frame,{...setup,chest:700}).referenceOnly).toBe(true)
 for(const quantity of [0,.5,1001,Infinity])expect(()=>completeTextileCost(frame,setup,quantity)).toThrow()
 expect(()=>completeTextileCost(frame,setup,100,NaN)).toThrow()
})

test('$299 full-chair reconciliation removes the old support allowance once and preserves the gross gate',()=>{
 const current=springEconomics(),freeSewing=completeTextileCost(frame,setup,100,0)
 expect(current.cogs-current.textiles.total).toBe(19344)
 expect(current.cogs).toBe(28145)
 expect(current.gross).toBe(1755)
 expect(current.fee).toBe(897)
 expect(current.warranty).toBe(1495)
 expect(current.contribution).toBe(-4137)
 expect(current.maxCogs).toBe(20930)
 expect(current.meetsCostGate).toBe(false)
 expect(current.maxCogs-(current.cogs-current.textiles.total)).toBe(1586)
 expect(freeSewing.total).toBe(5051)
 expect(19344+freeSewing.total).toBeGreaterThan(current.maxCogs)
 expect(completeTextileCost(frame,setup,100,45,2500).total).toBe(6926)
 expect(signedMoney(current.contribution)).toBe('-$41.37')
 const report=xlCompleteCostReport()
 for(const phrase of ['$281.45','$88.01','$72.15','$15.86','$402.08','black binding is unavailable','not changed by this study'])expect(report).toContain(phrase)
})
