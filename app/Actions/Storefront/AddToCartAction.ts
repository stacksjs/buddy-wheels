import {parseFinish,finishNote,savedFinish} from '../../Storefront/Finish'
import { randomUUIDv7 } from 'bun'
import { transaction } from '@stacksjs/orm'
import { sqliteWriteOptions, sqlDateTime } from '@stacksjs/database/runtime'
import { verifyCartCookie, writeCartCookie } from '@stacksjs/defaults/app/Storefront/CartCookie.ts'
import { storeProducts, validQuantity } from '../../Storefront/Catalog'

export default new Action({
  name: 'Add a product to the basket',
  method: 'POST',
  async handle(request) {
    const selected = storeProducts.find(item => item.slug === request.get('slug'))
    const quantity = validQuantity(request.get('quantity') ?? 1)
    if (!selected || quantity === null)
      return response.json({ error: 'Choose a product and a whole quantity from 1 to 5.' }, { status: 422 as const })
    let finish
    try { finish=parseFinish({accent:request.get('accent')??undefined,trim:request.get('trim')??undefined}) }
    catch { return response.json({error:'Choose valid six-digit finish colors.'},{status:422}) }
    const note=finishNote(finish)
    const redirect = request.get('redirect')
    if (redirect && redirect !== '/cart')
      return response.json({ error: 'Invalid basket destination.' }, { status: 422 as const })

    const token = verifyCartCookie(request.cookies?.get('stacks_cart')) || randomUUIDv7()
    // The planning basket has an app-specific five-per-size limit. Reserve the
    // SQLite writer before reading so concurrent adds cannot bypass that limit.
    const result = await transaction(async (tx) => {
      const product = await tx.selectFrom('products').where('slug', '=', selected.slug).where('is_available', '=', true).selectAll().executeTakeFirst()
      if (!product)
        return { error: 'This configuration is unavailable. Please choose another.', status: 404 as const }
      let cart = await tx.selectFrom('carts').where('session_token', '=', token).where('status', '=', 'active').selectAll().executeTakeFirst()
      if (!cart) {
        await tx.insertInto('carts').values({ status: 'active', total_items: 0, subtotal: 0, total: 0, currency: 'USD', session_token: token, checkout_step: 'cart', expires_at: sqlDateTime(new Date(Date.now() + 30 * 86400000)) }).execute()
        cart = await tx.selectFrom('carts').where('session_token', '=', token).selectAll().executeTakeFirst()
      }
      if (!cart)
        throw new Error('The planning basket could not be created.')
      const variants=await tx.selectFrom('cart_items').where('cart_id','=',cart.id).where('product_sku','=',selected.slug).selectAll().execute()
      const existing=variants.find(line=>finishNote(savedFinish(line.notes))===note)
      const totalQuantity = Number(existing?.quantity || 0) + quantity
      if (variants.reduce((sum,line)=>sum+Number(line.quantity),0)+quantity > 5)
        return { error: 'You can add up to five of each configuration.', status: 422 as const }
      const unitPrice = Number(product.price)
      if (!Number.isSafeInteger(unitPrice) || unitPrice < 0)
        throw new Error('The planning catalog contains an invalid price.')
      if (existing)
        await tx.updateTable('cart_items').set({ notes:note,quantity: totalQuantity, unit_price: unitPrice, total_price: totalQuantity * unitPrice }).where('id', '=', existing.id).execute()
      else
        await tx.insertInto('cart_items').values({ cart_id: cart.id, quantity, unit_price: unitPrice, total_price: quantity * unitPrice, product_name: String(product.name), product_sku: selected.slug, notes:note, product_image: String(product.image_url || '') }).execute()
      const lines = await tx.selectFrom('cart_items').where('cart_id', '=', cart.id).selectAll().execute()
      const totalItems = lines.reduce((sum, line) => sum + Number(line.quantity), 0)
      const subtotal = lines.reduce((sum, line) => sum + Number(line.total_price), 0)
      await tx.updateTable('carts').set({ total_items: totalItems, subtotal, total: subtotal }).where('id', '=', cart.id).execute()
      return { cartId: cart.id }
    }, { ...sqliteWriteOptions(), retries: 2 })
    const wantsHtml = (request.headers.get('accept') || '').includes('text/html')
    if (result.error && result.status === 422 && wantsHtml)
      return response.redirect('/cart?notice=quantity-limit')
    if (result.error)
      return response.json({ error: result.error }, { status: result.status })
    writeCartCookie(request, 'stacks_cart', token, { path: '/', httpOnly: true, sameSite: 'lax', secure: config.app.env === 'production', maxAge: 30 * 86400 })
    return wantsHtml ? response.redirect('/cart') : response.json({ ok: true, cart_id: result.cartId })
  },
})
