import { defineCommand } from '@stacksjs/cli'
import { db } from '@stacksjs/database/runtime'
import { catalog } from '../Storefront/Catalog'

export default defineCommand({
  name: 'seed-catalog',
  description: 'Idempotently install the Buddy Wheels development catalog using native commerce tables',
  async handle() {
    for (const item of catalog) {
      const existing = await db.selectFrom('products').where('slug', '=', item.slug).select('id').executeTakeFirst()
      const data = { name: `${item.name} / ${item.code}`, slug: item.slug, description: `${item.description} Development concept. No orders accepted.`, price: item.price, image_url: '/images/chair-concept.png', is_available: true, inventory_count: 0, preparation_time: 0 }
      if (existing)
        await db.updateTable('products').set(data).where('id', '=', existing.id).execute()
      else
        await db.insertInto('products').values(data).execute()
    }
    console.log(`Installed ${catalog.length} development configurations. Checkout remains disabled.`)
  },
})
