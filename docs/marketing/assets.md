# Original concept assets

Generated with the built-in image-generation tool for this project. These images are design concepts, not product photographs, CAD evidence, test results, veterinary demonstrations or a likeness of Buddy. They do not establish mechanically complete geometry. Source reference-product photographs were not copied.

## public/images/buddy-meadow.png

Prompt: premium natural photographic-style product concept for Buddy Wheels; a happy golden retriever with a plausible rear-support two-wheeled chair, forest-green printable connectors, brushed-aluminum rails, black wheels and soft harness, in a quiet sunlit meadow. Entire dog and wheels in view, muted cream/sage palette, natural texture. No text, logos, watermark, human, medical claims or red crosses. Explicitly a design concept, not a real patient photograph.

Used for the marketing hero and origin-story concept. The caption and alt text identify it as generated and distinguish it from Buddy.

## public/images/chair-concept.png

Prompt: original studio product concept of an empty rear-support dog wheelchair; brushed-aluminum round-tube rails, forest-green chunky printable junctions, black rubber spoked wheels, steel axles/bolts, soft black rear sling and front harness. Three-quarter side angle, entire object in frame, warm off-white background, soft shadow, realistic material detail. No podium, text, logo, watermark, labels or captions. Development concept only.

Used for the product and basket, with a shared concept render across size families. The shared footer identifies design renders; product availability and final fit limits are described at the purchase boundary. Do not infer exact assembly, fastener count, clearances or load paths from the image.

Both final PNG assets are saved in the repository. Fonts are DM Sans loaded with display=swap from Google Fonts. Icon glyphs use the existing Iconify/hugeicons pipeline. No icon package or hand-drawn icon path was added.

## Native delivery variants

`scripts/images.ts` uses @stacksjs/image to encode 640px and 1280px WebP variants at quality 82. The original PNGs remain the provenance inputs. The hero's 1280px derivative is about 178 KB and the chair's is about 72 KB; the 640px derivatives are about 63 KB and 28 KB. The hero uses native responsive `srcset` selection. These are delivery encodings, not changes to the product design shown.

## Buddy Rover visuals, November 8, 2026

Generated with the built-in image-generation tool. Original inputs are public/images/buddy-rover.png and public/images/buddy-rover-snow.png. Native @stacksjs/image produces matching 640px and 1280px WebP files. The running render is approximately 173 KB at 1280px; Snow is approximately 210 KB. These are design visualizations, not tested equipment or a photograph of Buddy.

Run prompt: Photorealistic 3:2 outdoor equipment visualization. Original large-dog adventure carrier, forest-green fabric and black breathable mesh cabin, golden retriever entirely inside, brushed-aluminum chassis, two rear pneumatic wheels and a forward running wheel, ergonomic handle, brake and wrist tether. Show the complete product on a firm wet sandy beach path, calm ocean and dune grass, soft morning light, natural sage/cream colors, realistic fabric/metal/rubber. No person, branding, text, collage, copied competitor geometry or orange details.

Snow edit prompt: Preserve the Run render's cabin, mesh, dog, metal chassis, photorealism and 3:2 framing. Move to a flat groomed snowy cross-country route beside frosted pines. Replace every wheel and front fork with a coherent pair of skis on retained metal supports. Replace the push handle with rigid forward tow shafts and a padded waist harness resting on the snow. Show the entire assembly. No person, wheels, downhill slope, text or logos.

Rover switches to the Snow visual when Snow is selected. Run remains explicitly identified for the other configurations. Basket thumbnails follow the selected SKU. Original files remain in the repository; no generated asset is referenced only from the tool cache.

The exact built-in prompt set, edit reference and saved output paths are recorded in [rover-image-prompts.json](rover-image-prompts.json).
