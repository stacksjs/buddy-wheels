route.get('/cart', 'Actions/Storefront/GetCartAction')
route.post('/cart/add', 'Actions/Storefront/AddToCartAction').skipCsrf().rateLimit(30, 'minute')
route.post('/cart/update', 'Actions/Storefront/UpdateCartItemAction').skipCsrf().rateLimit(30, 'minute')
route.post('/checkout/place', 'Actions/Storefront/PreviewCheckoutAction').skipCsrf()
