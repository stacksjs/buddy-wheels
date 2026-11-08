import {transaction} from '@stacksjs/orm'
import {sqliteWriteOptions} from '@stacksjs/database/runtime'
import {verifyCartCookie} from '@stacksjs/defaults/app/Storefront/CartCookie.ts'
import {validQuantity} from '../../Storefront/Catalog'
export default new Action({
 name:'Update development basket',method:'POST',
 async handle(request){
  const token=verifyCartCookie(request.cookies?.get('stacks_cart'))
  if(!token)return response.json({error:'No active signed basket.'},{status:400})
  const id=Number(request.get('item_id'));const quantity=validQuantity(request.get('quantity'),true)
  if(!Number.isSafeInteger(id)||id<=0||quantity===null)return response.json({error:'Choose a valid item and a whole quantity from 0 to 5.'},{status:422})
  const result=await transaction(async tx=>{
   const cart=await tx.selectFrom('carts').where('session_token','=',token).where('status','=','active').selectAll().executeTakeFirst()
   if(!cart)return {error:'Basket not found.',status:404 as const}
   const item=await tx.selectFrom('cart_items').where('id','=',id).where('cart_id','=',cart.id).selectAll().executeTakeFirst()
   if(!item)return {error:'Item not in your basket.',status:404 as const}
   const siblings=await tx.selectFrom('cart_items').where('cart_id','=',cart.id).where('product_sku','=',item.product_sku).selectAll().execute()
   if(siblings.reduce((sum,line)=>sum+(Number(line.id)===id?0:Number(line.quantity)),0)+quantity>5)return {error:'You can save up to five of each product, across all colors.',status:422 as const}
   if(quantity===0)await tx.deleteFrom('cart_items').where('id','=',id).execute()
   else await tx.updateTable('cart_items').set({quantity,total_price:quantity*Number(item.unit_price)}).where('id','=',id).execute()
   const lines=await tx.selectFrom('cart_items').where('cart_id','=',cart.id).selectAll().execute()
   const subtotal=lines.reduce((sum,line)=>sum+Number(line.total_price),0);const totalItems=lines.reduce((sum,line)=>sum+Number(line.quantity),0)
   await tx.updateTable('carts').set({total_items:totalItems,subtotal,total:subtotal}).where('id','=',cart.id).execute()
   return {subtotal,total_items:totalItems}
  },{...sqliteWriteOptions(),retries:2})
  const html=(request.headers.get('accept')||'').includes('text/html')
  if(result.error)return html&&result.status===422?response.redirect('/cart?notice=quantity-limit'):response.json({error:result.error},{status:result.status})
  return html?response.redirect('/cart'):response.json({ok:true,...result})
 },
})
