import nativeGet from '@stacksjs/defaults/app/Actions/Storefront/GetCartAction.ts'
import { verifyCartCookie } from '@stacksjs/defaults/app/Storefront/CartCookie.ts'

export default new Action({
  name: 'Read signed planning basket',
  method: 'GET',
  handle(request) {
    if (!verifyCartCookie(request.cookies?.get('stacks_cart')))
      return response.json({ items: [], subtotal: 0, total_items: 0 })
    return nativeGet.handle(request)
  },
})
