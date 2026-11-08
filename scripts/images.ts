import { image } from '@stacksjs/image'

for (const name of ['buddy-meadow', 'chair-concept', 'buddy-rover', 'buddy-rover-snow']) {
  const manifest = await image(`public/images/${name}.png`, { outputDir: 'storage/framework/runtime/image-variants', publicPath: '/images', concurrency: 1 })
    .widths([640, 1280]).formats(['webp']).quality(82).original(false).generate()
  for (const variant of manifest.variants) {
    const output = `public/images/${name}${variant.width === 1280 ? '' : `-${variant.width}`}.webp`
    await Bun.write(output, Bun.file(variant.path))
    console.log(`${output}: ${variant.width}x${variant.height}, ${variant.bytes} bytes`)
  }
}
