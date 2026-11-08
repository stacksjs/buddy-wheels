import nativeUpdate from '@stacksjs/defaults/app/Actions/Storefront/UpdateCartItemAction.ts'
import { verifyCartCookie } from '@stacksjs/defaults/app/Storefront/CartCookie.ts'
import { validQuantity } from '../../Storefront/Catalog'

export default new Action({
  name: 'Update development basket', method: 'POST',
  async handle(request) {
    if (!verifyCartCookie(request.cookies?.get('stacks_cart')))
      return response.json({ error: 'No active signed basket.' }, { status: 400 })
    const id = Number(request.get('item_id'))
    if (!Number.isSafeInteger(id) || id <= 0 || validQuantity(request.get('quantity'), true) === null)
      return response.json({ error: 'Choose a valid item and a whole quantity from 0 to 5.' }, { status: 422 })
    return nativeUpdate.handle(request)
  },
})
