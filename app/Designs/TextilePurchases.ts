import type {SoftFrame,SoftSetup} from './SoftGoods'
import {softDimensions,wrapSchedule,parseSoft} from './SoftGoods'
import {softBill,bindingCuts} from './SoftGoodsBill'

export const textilePriceDate='2026-11-08'
export const textileSources=[
 {id:'woven',name:'Rockywoods 58-CORDURAPOLY-Black',url:'https://rockywoods.com/products/1000-denier-coated-cordura-hp-polyester-fabric',priceCents:1871,unit:'60-inch-wide linear yard',note:'1000D-class coated polyester, listed $18.71/yard. Model buys whole yards without an unverified roll discount. Exact black-variant availability is unconfirmed; page exposes both Sold Out and Add to Cart. Nominal .025-inch thickness is not the CAD .8 mm envelope.'},
 {id:'mesh',name:'OWF SPACER3MM',url:'https://www.owfinc.com/Spacer-3mm-Mesh/productinfo/SPACER3MM/',priceCents:1268,unit:'58-inch-wide linear yard',note:'Listed in stock. $12.68/yard, $9.89 at 20 yards, $8.62 for a full 30-yard roll. Use $12.68 until the actual purchase reaches a tier. Listed 3 mm / approximately 3/32 inch; this is a costing candidate for the 1.5 mm CAD reference layer, not an approved thickness substitution.'},
 {id:'foam',name:'Avetco E600 5 mm EVA SP60A.5MM.BLACK.39X51',url:'https://www.avetcoinc.com/product/e600-high-density-eva-foam-sheets-60-65-shore-c-39-x-51-5mm-10mm/?attribute_thickness=5+mm',priceCents:3150,unit:'39 x 51 inch sheet, 5 mm',note:'Exact 5 mm variation $31.50, in stock, MOQ one. Firm 60-65 Shore C. Comfort/compression remains unqualified. Sheet nesting, not net area pricing.'},
 {id:'webbing',name:'Strapworks WSR-POL-PUT-001-BLK',url:'https://www.strapworks.com/1-inch-utility-polyester-webbing-black',priceCents:7741,unit:'120-foot roll, 1 inch polyester',note:'Listed in stock. $77.41/120 ft; singles $0.74/ft, 30 ft $20.57, 60 ft $39.51. Batch uses actual 120-foot rolls; one-off compares those options without assuming a continuous splice-free roll. Nominal .065-.07 inch thickness; compatibility and sewn strength unqualified.'},
 {id:'adjusters',name:'Seattle Fabrics H-MLL',url:'https://www.seattlefabrics.com/1-Metal-Double-Bar-Ladder-Lock-in-Nickel-Plated-Steel_p_490.html',priceCents:75,unit:'one 1-inch nickel-plated steel double-bar ladder lock',note:'Page header $0.65, description $0.75. Model conservatively uses $0.75, not the lower conflicting price. Page states In Stock but also contains a generic wait-list block. Checkout and actual dimensions/radii/slip resistance need verification.'},
 {id:'buckle',name:'RBTR SR-1-B, variant 12231494785',url:'https://ripstopbytheroll.com/products/standard-side-release-buckle?variant=12231494785',priceCents:110,unit:'one 1-inch acetal single-adjust buckle',note:'Exact 1-inch variant $1.10, available=true. Default $0.90 is the smaller 3/4-inch option. Front restraint only in this study.'},
 {id:'binding',name:'HobbyTrendy BSB12 red polyester satin binding',url:'https://hobby-trendy.com/products/polyester-satin-bias-binding-tape-single-fold-20mm-13-16inch-10meters-10-93yds?variant=35564962873505',priceCents:899,unit:'10-meter pack, nominal 20 mm single fold',note:'Red available, black BSB24 unavailable. Satin construction, supplied/folded width and durability must be approved against the 20 mm cut/sew specification. Cost reference only; a qualified black industrial equivalent still needs a quote.'},
 {id:'thread',name:'Sailrite 123338 PremoBond Tex 90 black bonded polyester',url:'https://www.sailrite.com/PremoBond-V-92-Black-UV-Bonded-Polyester-Thread-4-Oz-1-350-Yds',priceCents:1595,unit:'4 oz cone, current title 1,080 yards / 987.552 m',note:'Current title says 1,080 yards although URL says 1,350. Use the shorter current yield. Listed available. 80 m per set covers top/bobbin/rework only as an unmeasured allowance.'},
 {id:'hook',name:'RBTR 1-VELCRO-HOOK-B',url:'https://ripstopbytheroll.com/products/velcro-industrial-hook-and-loop?variant=47238308692138',priceCents:90,unit:'one foot, 1-inch sew-on nylon hook',note:'Available=true. Trim width to 20 mm, charge full bought width. Cuts include 1 mm separation; account for 25-foot supplier section boundaries.'},
 {id:'loop',name:'RBTR 1-VELCRO-LOOP-B',url:'https://ripstopbytheroll.com/products/velcro-industrial-sew-on-tape-loop?variant=47238312591530',priceCents:90,unit:'one foot, 1-inch sew-on nylon loop',note:'Purchased separately from hook at the same price. Ten mated patches require ten pieces of each side.'},
] as const

export interface Rectangle {width:number,length:number}
/** Grain-aligned shelf nest with trim and 5 mm cut gaps. Entire sheets/yard increments are charged. */
export function rectanglePurchase(pieces:Rectangle[],width:number,increment:number,unitCents:number,sheetLength?:number){
 const shelves:{height:number,remaining:number,sheet:number}[]=[]
 let sheet=0,used=20
 for(const piece of [...pieces].sort((a,b)=>b.length-a.length||b.width-a.width)){
  if(piece.width+5>width-20||sheetLength&&piece.length+5>sheetLength-40)throw new Error('Textile blank exceeds usable stock.')
  const row=shelves.find(row=>row.height>=piece.length+5&&row.remaining>=piece.width+5)
  if(row){row.remaining-=piece.width+5;continue}
  if(sheetLength&&used+piece.length+5>sheetLength-20){sheet++;used=20}
  shelves.push({height:piece.length+5,remaining:width-20-piece.width-5,sheet});used+=piece.length+5
 }
 const length=shelves.reduce((sum,row)=>sum+row.height,40)
 const units=sheetLength?sheet+1:Math.ceil(length/increment)
 return {units,cents:units*unitCents,shelves:shelves.length,netAreaMm2:pieces.reduce((n,p)=>n+p.width*p.length,0),stockAreaMm2:units*width*(sheetLength??increment)}
}

/** First-fit decreasing cut schedule. Splices are forbidden within one cut; 2 mm separation per cut. */
export function linearPurchase(cuts:number[],stockLength:number,stockCents:number){
 const remaining:number[]=[]
 for(const length of [...cuts].sort((a,b)=>b-a)){
  const cut=length+2
  if(cut>stockLength)throw new Error('Textile cut exceeds continuous stock length.')
  const i=remaining.findIndex(space=>space>=cut)
  if(i<0)remaining.push(stockLength-cut);else remaining[i]!-=cut
 }
 return {units:remaining.length,cents:remaining.length*stockCents,cutMm:cuts.reduce((n,v)=>n+v,0),purchasedMm:remaining.length*stockLength}
}

export function textileDemand(frame:SoftFrame,setup:SoftSetup){
 const s=parseSoft({...setup},frame),d=softDimensions(s),bill=softBill(frame,s),wraps=wrapSchedule(frame)
 const webbing=bill.filter(row=>/^SG0[789]/.test(String(row[0]))).flatMap(row=>Array.from({length:Number(row[1])},()=>Number(row[3])))
 const binding=Number(String(bill.find(row=>row[0]==='SG13')![3]).split(' ')[0])
 const panels=[{width:s.slingWidth,length:s.slingLength},{width:d.bibWidth,length:d.bibLength}]
 const woven=[...panels,...Array.from({length:8},()=>({width:d.webbing+30,length:Math.ceil(wraps.rail.perimeter)+20})),...Array.from({length:4},()=>({width:d.webbing+30,length:Math.ceil(wraps.bridge.perimeter)+20})),...Array.from({length:10},()=>({width:20,length:70}))]
 return {webbing,binding,bindingCuts:bindingCuts(s),panels,woven,coveredIds:bill.slice(1).map(row=>String(row[0]))}
}

export function completeTextileCost(frame:SoftFrame,setup:SoftSetup,quantity=100,minutes=quantity===1?180:75,hourlyCents=3000){
 if(!Number.isInteger(quantity)||quantity<1||quantity>1000||!Number.isFinite(minutes)||minutes<0||!Number.isInteger(hourlyCents)||hourlyCents<0)throw new Error('Invalid textile cost scenario.')
 const referenceOnly=softDimensions(setup).webbing!==25.4
 const demand=textileDemand(frame,setup),copies=<T>(items:T[])=>Array.from({length:quantity},()=>items).flat()
 const woven=rectanglePurchase(copies(demand.woven),1524,914.4,1871)
 const meshBase=rectanglePurchase(copies(demand.panels),1473.2,914.4,1268)
 const meshOptions=[meshBase,...(meshBase.units>=20?[{...meshBase,cents:meshBase.units*989}]:[]),{...meshBase,units:Math.ceil(meshBase.units/30)*30,cents:Math.ceil(meshBase.units/30)*30*862,stockAreaMm2:Math.ceil(meshBase.units/30)*30*1473.2*914.4}]
 const mesh=meshOptions.sort((a,b)=>a.cents-b.cents)[0]!
 const foam=rectanglePurchase(copies(demand.panels),990.6,1295.4,3150,1295.4)
 const webCuts=copies(demand.webbing)
 const rollWeb=linearPurchase(webCuts,36576,7741)
 const webbing=quantity===1?[rollWeb,linearPurchase(webCuts,9144,2057),linearPurchase(webCuts,18288,3951),{units:Math.ceil((demand.webbing.reduce((n,v)=>n+v+2,0))/304.8),cents:Math.ceil((demand.webbing.reduce((n,v)=>n+v+2,0))/304.8)*74,cutMm:demand.webbing.reduce((n,v)=>n+v,0),purchasedMm:Math.ceil((demand.webbing.reduce((n,v)=>n+v+2,0))/304.8)*304.8}].sort((a,b)=>a.cents-b.cents)[0]!:rollWeb
 const binding=linearPurchase(copies(demand.bindingCuts),10000,899)
 // 25-foot maximum supplier sections, plus a final whole-foot section. Each 20 mm patch needs 1 mm cut gap.
 let patchFeet=Math.ceil(quantity*10*21/304.8)
 while(Math.floor(patchFeet/25)*Math.floor(7620/21)+Math.floor((patchFeet%25)*304.8/21)<quantity*10)patchFeet++
 const threadCones=Math.ceil(quantity*80000/987552)
 const rows=[
  {id:'woven',name:'Woven shells, 12 chafe panels and 10 closure tabs',purchase:woven.cents,units:woven.units,unit:'whole linear yards'},
  {id:'mesh',name:'Rear and front spacer mesh',purchase:mesh.cents,units:mesh.units,unit:'whole linear yards'},
  {id:'foam',name:'Rear and front 5 mm EVA pads',purchase:foam.cents,units:foam.units,unit:'39 x 51 inch sheets'},
  {id:'webbing',name:'Every webbing cut including returns, laps and tails',purchase:webbing.cents,units:webbing.units,unit:quantity===1?'cheapest listed whole purchasing option':'120-foot rolls'},
  {id:'adjusters',name:'Six metal double-bar adjusters',purchase:quantity*6*75,units:quantity*6,unit:'each, higher conflicting listing price'},
  {id:'buckle',name:'One 1-inch acetal front closure',purchase:quantity*110,units:quantity,unit:'each'},
  {id:'binding',name:'20 mm binding including cover-tab edges',purchase:binding.cents,units:binding.units,unit:'10-meter packs; each panel/tab edge stays continuous'},
  {id:'thread',name:'Tex 90 top/bobbin thread allowance',purchase:threadCones*1595,units:threadCones,unit:'987.552-meter cones'},
  {id:'hook',name:'Ten 20 x 20 mm hook patches',purchase:patchFeet*90,units:patchFeet,unit:'linear feet of 1-inch hook'},
  {id:'loop',name:'Ten 20 x 20 mm loop patches',purchase:patchFeet*90,units:patchFeet,unit:'linear feet of 1-inch loop'},
 ].map(row=>({...row,allocation:Math.ceil(row.purchase/quantity)}))
 const materials=rows.reduce((n,row)=>n+row.allocation,0),rejects=Math.ceil(materials*.1),labor=Math.ceil(minutes*hourlyCents/60),freight=quantity===1?5000:400
 return {referenceOnly,hardwareWidthMm:softDimensions(setup).webbing,pricedHardwareWidthMm:25.4,quantity,minutes,hourlyCents,demand,rows,purchases:{woven,mesh,foam,webbing,binding,patchFeet,threadCones},materials,rejects,labor,freight,total:materials+rejects+labor+freight,status:'LISTED_CANDIDATES_WITH_UNQUOTED_PRODUCTION_ASSUMPTIONS'}
}
