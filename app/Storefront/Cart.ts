import { readStorefront } from '@stacksjs/defaults/app/Storefront/StorefrontDatabase.ts'
import { verifyCartCookie } from '@stacksjs/defaults/app/Storefront/CartCookie.ts'
import { money, storeProducts } from './Catalog'

export interface BasketLine {
  id: number
  name: string
  slug: string
  qty: number
  price: number
  lineTotalLabel: string
  image: string
  href: string
}

/** Native storefront cookie and read boundary; this app uses SQLite. */
export function basket(cookie: string | null): { items: BasketLine[], subtotalLabel: string } {
  const token = verifyCartCookie(cookie)
  const items = token ? readStorefront<BasketLine[]>('Buddy Wheels basket', [], (database) => {
    const cart = database.query<{ id: number }, [string]>("SELECT id FROM carts WHERE session_token = ? AND status = 'active'").get(token)
    if (!cart)
      return []
    return database.query<{ id: number, product_name: string, product_sku: string, quantity: number, unit_price: number }, [number]>('SELECT id, product_name, product_sku, quantity, unit_price FROM cart_items WHERE cart_id = ? ORDER BY id').all(cart.id).map(line => ({
      id: line.id, name: line.product_name, slug: line.product_sku, qty: Number(line.quantity), price: Number(line.unit_price), lineTotalLabel: money(Number(line.quantity) * Number(line.unit_price)),
      image: storeProducts.find(item => item.slug === line.product_sku)?.image || '/images/chair-concept-640.webp',
      href: storeProducts.find(item => item.slug === line.product_sku)?.href || '/shop',
    }))
  }) : []
  return { items, subtotalLabel: money(items.reduce((sum, line) => sum + line.qty * line.price, 0)) }
}
