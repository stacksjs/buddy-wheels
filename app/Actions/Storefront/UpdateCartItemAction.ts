import nativeUpdate from '@stacksjs/defaults/app/Actions/Storefront/UpdateCartItemAction.ts'
import { validQuantity } from '../../Storefront/Catalog'

export default new Action({
  name: 'Update development basket', method: 'POST',
  async handle(request) {
    const id = Number(request.get('item_id'))
    if (!Number.isSafeInteger(id) || id <= 0 || validQuantity(request.get('quantity'), true) === null)
      return response.json({ error: 'Choose a valid item and a whole quantity from 0 to 5.' }, { status: 422 })
    return nativeUpdate.handle(request)
  },
})
