import nativeAdd from '@stacksjs/defaults/app/Actions/Storefront/AddToCartAction.ts'
import { catalog, validQuantity } from '../../Storefront/Catalog'

export default new Action({
  name: 'Add development configuration to basket', method: 'POST',
  async handle(request) {
    const product = catalog.find(item => item.slug === request.get('slug'))
    if (!product || validQuantity(request.get('quantity') ?? 1) === null)
      return response.json({ error: 'Choose a known size and a whole quantity from 1 to 5.' }, { status: 422 })
    const redirect = request.get('redirect')
    if (redirect && redirect !== '/cart')
      return response.json({ error: 'Invalid basket destination.' }, { status: 422 })
    return nativeAdd.handle(request)
  },
})
