import { expect, test } from 'bun:test'
import gate from '../../app/Actions/Storefront/PreviewCheckoutAction'
import placeOrder from '../../app/Actions/Storefront/PlaceOrderAction'

test('both the explicit checkout route and default order override refuse all order placement', async () => {
  expect(placeOrder).toBe(gate)
  const result = await gate.handle()
  expect(result.status).toBe(409)
  expect(await result.json()).toMatchObject({ code: 'PRODUCT_VALIDATION_REQUIRED' })
})
