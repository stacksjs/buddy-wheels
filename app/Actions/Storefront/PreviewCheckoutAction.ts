export default new Action({
  name: 'Development checkout gate',
  method: 'POST',
  handle() {
    return response.json({ code: 'PRODUCT_VALIDATION_REQUIRED', error: 'Buddy Wheels is in development. No orders, reservations or payments are accepted. Product testing, professional fitting review and fulfillment setup must be complete before launch.' }, { status: 409 })
  },
})
