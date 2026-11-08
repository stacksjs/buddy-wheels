# Printer options for the Buddy Wheels bench prototype

Checked November 8, 2026. The owner reports Buddy weighs 140 lb and describes him as tall and large, reaching roughly 5 ft 11 in while standing with paws on the owner's shoulders. This does not provide hip height, rail length or body width. Keep the XL dimensions configurable until those measurements arrive. Printer selection follows the size of individual parts, not the dog's overall size.

## Recommendation

Choose the **Bambu Lab P2S, printer only**, for the current r0 package. Its 256 x 256 x 256 mm build volume accommodates the current parts, whose supplied design envelope is 220 x 220 x 100 mm; the XL arm fit-check copy is approximately 204 mm long. It leaves more bed margin than the narrow axis of the Prusa. Verify actual placement, brim and exclusions in the slicer before starting each job. The printer's dimensions are listed by [Micro Center](https://www.microcenter.com/product/705069/bambu-lab-p2s-3d-printer) and [Additive Plus](https://additiveplus.com/product/bambu-lab-p2s/).

Use PETG first for coupons, caps, setup markers, jigs and fit-check copies. The r0 load path remains metal. `FIT_CHECK_ONLY` plate STLs are plastic geometry checks, not substitutes for their metal DXFs. A more expensive printer or carbon-filled filament does not qualify these parts for Buddy.

## Three useful choices

| Choice | Verified capability | Price observed | Why choose it here |
| --- | --- | --- | --- |
| Bambu Lab P2S | Enclosed, 256 mm cube; manufacturer manual includes PETG and ASA use | Additive Plus listing starts at **$549**, with printer-only and Combo variants | Best value for the current single-material parts and repeated fit iterations. Confirm selected configuration before paying. |
| Prusa CORE One+ / Gen2 | 250 x 220 x 270 mm; chamber maximum 55 C | **$1,299 assembled or $999 kit**, on Prusa's page | Premium alternative if long-term repair access, build familiarity and Prusa's support matter more than initial cost. A part actually using all 220 mm needs its brim/clearance checked carefully. |
| Bambu Lab H2S | 340 x 320 x 340 mm; actively heated chamber up to 65 C | Current US price not verified | Choose for planned larger one-piece guards, fixtures or wider batches. Current r0 parts do not require this capacity. The larger chamber adds headroom for future material/process work. |

Sources: [P2S seller listing](https://additiveplus.com/product/bambu-lab-p2s/), [Bambu P2S manufacturer manual](https://csm.bblcdn.com/hub/9425242c00344b0e801b6179f9a243aa.pdf), [Prusa official specifications and prices](https://www.prusa3d.com/p/core-one-plus/), [H2S manufacturer introduction](https://blog.bambulab.com/h2s-the-ultimate-single-nozzle-3d-printer-now-bigger-than-ever/). The H2S article's 2025 launch prices are not treated as current offers. Prices exclude tax, shipping and optional accessories.

**Skip AMS initially.** The current prints need one material at a time. An automatic multi-spool system is optional convenience; a separate dryer is enough to start this workflow. Do not purchase a laser bundle for this package. If choosing Prusa, assembled is the quicker route to printing; choose the kit if assembly itself is worthwhile to you.

## Los Angeles purchasing and support

[Additive Plus contact information](https://additiveplus.com/contact-us/) lists **17800 South Main Street, Unit 104, Gardena, CA 90248**, telephone **747-800-4854**. Its [support page](https://additiveplus.com/support/) advertises installation/training, repairs, calibration, spare parts and application help. Confirm P2S-specific support terms, pickup arrangements, configuration and stock before traveling. Its website claims are not evidence of a booked demonstration or guaranteed local inventory.

[Micro Center's P2S page](https://www.microcenter.com/product/705069/bambu-lab-p2s-3d-printer) is another Southern California purchase path through Tustin. At this check, the store selector showed **Tustin out of stock**. The page also displayed a $449.99 sale in its generic pickup listing; this was not verified as a currently available Tustin offer. Local price and stock can change. No item was reserved or purchased.

## Starter budget and setup

Allow an **estimated $200-350 beyond the printer**, before tax, for a filament dryer, digital calipers, initial PETG, sealed storage/desiccant, basic cleanup tools and a spare nozzle. These are planning allowances, not supplier quotes. At the observed $549 P2S starting price, that gives roughly **$750-900 before tax/shipping**, excluding any room ventilation work. Spend on dry filament and measurement before multicolor accessories.

Start with a 0.4 mm nozzle and the correct manufacturer material profile; print the supplied clearance coupon, measure it, then print a single cap or jig before batching. Document actual orientation, settings and measured fits. The P2S manual advises drying moisture-sensitive materials including PETG; material and drying settings must match the specific spool. [Bambu P2S manual, filament chapter](https://csm.bblcdn.com/hub/9425242c00344b0e801b6179f9a243aa.pdf)

Plan printer location and ventilation before ASA work. NIOSH recommends source controls such as ventilated enclosures or exhaust, with particulate and gas filtration selected for the emissions involved. A printer enclosure by itself does not establish adequate room emission control. Use a workspace separated from normal occupancy and arrange appropriate exhaust/filtration for the actual room and material. [NIOSH safe 3D printing guide](https://www.cdc.gov/niosh/docs/2024-103/)
