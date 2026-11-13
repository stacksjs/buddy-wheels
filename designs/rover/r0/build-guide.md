# Buddy Rover r0 build guide

Configuration rover-r0-l1300-w700-h1000-r1000-a560-g1000-hub101.6-trail-swivel310-k350-t180-welded-sprung. All dimensions mm unless marked. Read this once to the end before ordering anything.

**What this builds.** A bench carrier for checking fit, handling and the ramp with sandbags. It has no load rating, an untested parking brake, no brake for slowing while moving, and no test behind it. Do not put a dog in it until the release gates at the end are met.

## 1. How the aluminum frame gets its shape

The frame is bent and welded by a fabrication shop and arrives as one rigid piece: 29 tubes, 10 bends and 36 welds, with no plates holding it together. The base is a flat ladder: two long side rails with 5 cross members between them. Each cabin side is one hoop bent from a single tube. It runs up the rear, forward along the roof, which falls 180 from rear to front, and down the front pillar, which leans back 350 to give the raked nose. An axle post stands under each hoop. The handle is one bent bar and the caster hangs from two bent hoops across the nose. See base-plan.svg for the view from above and drawing.svg for the side.

Every bend uses one centerline radius, 114.3 mm (4.5 inch), and each bent tube bends in a single plane. bend-schedule.csv gives the straight length to cut and each run and bend in order. The straight tubes are cut square, except the two axle posts, which have an angled top.

What is left for you once the frame arrives: bolt on the suspension and wheels, the caster, the brake clamps, the floor, the ramp and the cover.

Welding thin aluminum tube is TIG work and not a first welding project. Unless you already weld aluminum, a shop does it. There are two ways to use one:

1. **The shop does everything.** Send them cut-list.csv, bend-schedule.csv, weld-schedule.csv, drilling.csv, base-plan.svg and drawing.svg, and ask for a price to supply the tube, cut it, bend it, weld it and drill it. Search for "aluminum TIG welding" or "custom metal fabrication" near you, or ask at the counter of a metal supplier who they send people to. A bicycle frame builder, a marine or race-car fabricator, a community college welding program or a makerspace with a TIG welder are all worth a call for a single frame. Ask three.
2. **You cut the straight tubes, the shop bends and welds.** Buy the bars, cut and label the straight pieces as in section 6, and bring them with the uncut stock for the bent tubes and the same drawings. That saves a little saw time. With bends involved, most shops will prefer to do all of it.

The cost study puts the shop work on one frame at about $720.00: $540.00 of welding and $180.00 of bending. That is arithmetic on assumed shop rates, and no shop has seen the drawings.

What to tell the shop:

- Material. Chassis pieces are 1 x 1 x 1/8 inch 6061-T6. Cabin pieces are 1 x 1 x 1/16 inch 6063-T52. The cut list says which is which. The 1/16 wall is thin to weld; if they ask for 1/8 wall throughout, that works and adds about 4.9 kg.
- Filler is their choice, normally 4043 or 5356. If the frame will be anodized, say so first, because the filler decides whether the welds show dark afterwards.
- Bends. Every bend is drawn at 114.3 mm (4.5 inch) centerline radius, the tightest radius with a published clean result for 1 inch square aluminum tube with a 1/8 inch wall. If their tooling for 1 inch square tube uses another radius, that is fine: the bent lengths are redrawn to suit. Two questions for them. Can they bend the 1/8 inch wall 6061-T6 nose hoops without cracking, or what temper would they use instead? And can they bend the side hoops and handle bar in the 1/16 inch wall 6063-T52 as drawn? A thin wall can wrinkle or flatten on the inside of a bend; if they want the 1/8 inch wall for those three tubes, that adds about 3 kg and is an acceptable change.
- Tolerances that matter: base diagonals equal within 2 mm, the frame flat on a flat table, and the two axle posts square to the base and directly opposite each other. The wheels hang from those posts.
- Tack the whole frame, check it, then weld in short runs on alternating sides so the heat does not pull it out of square.
- A tube that ends up closed at both ends needs a small vent hole before the last weld. Ask them to put vents on the underside.
- Do not grind the welds flush.

Welding softens the aluminum beside each weld. Nothing in this design has been calculated or tested, welded or bolted, so nothing here allows for that loss. That is one reason the release gates at the end ask for an engineer before any load.

## 2. Set the size first

1. Measure the dog lying stretched out, sitting, and across the shoulders. Add room to shift position.
2. Open https://buddywheels.org/design-studio-rover, set clear length, width and height, and download the kit. Every cut length, hole position and fabric blank below changes with those three numbers.
3. This guide is for 1300 x 700 x 1000 clear, a 1000 ramp at 8.0 degrees, 15 inch trail (4.00-8) wheels and a swivel front caster.

## 3. Order in this sequence

Order the wheel and caster first, because two dimensions in the design come from them.

| Step | What | Where | Quantity | Notes |
| --- | --- | --- | --- | --- |
| A | Rear wheel | [Zoro Select 1NWV4](https://www.zoro.com/zoro-select-pneumatic-wheel-15-316dia-435lb-400-8-1nwv4/i/G1932594/), $32.89 each | 2 | When they arrive, measure the hub from bearing face to bearing face. If it is not 101.6, enter the real number in the studio and download the kit again before cutting axles |
| A | Front caster | [Service Caster SCC-100S3504-PNB-BSL](https://www.zoro.com/service-caster-10-inch-black-pneumatic-wheel-swivel-caster-with-bolt-swivel-lock-scc-100s3504-pnb-bsl/i/G705434817/), $64.69: 10 inch pneumatic, swivel lock, 350 lb and a 12-3/16 inch mounting height stated | 1 | Measure from the floor to the top of the mounting plate. This guide assumes 310. If yours differs, enter it in the studio: it sets the nose post length. A [Harbor Freight 63799](https://www.harborfreight.com/10-in-pneumatic-swivel-caster-63799.html) at $19.99 also fits, with no swivel lock and no stated height |
| A | Parking brake | [POWERTEC 302F push-pull toggle clamp](https://www.zoro.com/powertec-toggle-clamp-300lbs-cap-302f-quick-release-pushpull-clamp-20304n/i/G714915420/), $10.70 each, and a [DE-STA-CO 507208 neoprene-tipped spindle, 5/16-18](https://www.zoro.com/de-sta-co-flat-tip-spindle-516-18-083-3-507208/i/G0295985/), $4.15 each | 2 clamps, 2 spindles | The spindle replaces the plain bolt that comes in the clamp plunger. Eight #10 screws and lock nuts hold the clamps to their plates |
| B | Hangers and brake plates | A laser-cutting service. [OSH Cut](https://app.oshcut.com/cart) shows a price as soon as you drop the files in, with no account. [SendCutSend](https://sendcutsend.com) lists both materials, has no minimum quantity and ships laser parts in 1 to 3 days, and asks you to sign up first | 2 x brake_plate.dxf, 4 x shock_plate.dxf, 4 x shock_hanger.dxf, all in 0.125 inch 6061-T6 aluminum. No hangers are needed with the sprung rear and the swivel caster.  | Upload each of those DXF files from the metal folder, pick material and thickness, enter quantities. Add their deburring service or file the edges yourself |
| C | Chassis tube, 1 x 1 x 1/8 inch 6061-T6 | A local metal supplier, or [Metals Depot T3118-6061](https://www.metalsdepot.com/aluminum-products/aluminum-square-tube), 24 ft at $116.16 | 2 bars of 24 ft, each cut in half | Ask the supplier to cut each bar in half so it fits a car: 4 pieces of 12 ft. The price is one online supplier's for a bar that ships by truck; a local counter price was not checked. Most shops will supply the tube themselves, so ask before buying any. The bent tubes are too long for 8 ft parcel bars |
| C | Cabin tube, 1 x 1 x 1/16 inch 6063-T52 | The same supplier, or [Metals Depot T31116](https://www.metalsdepot.com/aluminum-products/aluminum-square-tube), 21 ft at $65.73 | 3 bars of 21 ft, each cut in half | 5 pieces of 10 ft 6 in. Do not swap this softer tube into the chassis positions |
| D | Bolts, nuts, washers | [Bolt Depot](https://boltdepot.com/Product-Details?product=328): 1/4-20 x 2 inch grade 5 zinc hex bolt 328, lock nut 2624, SAE washer 2976 | 1 box of 100 bolts, 1 of nuts, 1 of washers | You need 8 bolts and 4 at 5/16-18 x 2-1/2 inch for the caster |
| D | Sleeve tube | [Online Metals DOM steel tube, 3/8 inch OD x .049 wall](https://www.onlinemetals.com/en/buy/carbon-steel/0-375-od-x-0-049-wall-x-0-28-id-carbon-steel-round-tube-a513-type-5-dom/pid/7754), $11.66 per 6 ft | 1 lengths of 6 ft | Cut into 16 sleeves, each 25.4 long |
| D | Or: sleeves ready cut | [Mutual Screw FC1198-25-S-12](https://mutualscrew.com/products/spacers-3-8-od-x-1-1-4-hole-steel-clear-zinc_fc1198-25-s-12), 3/8 OD x 1/4 ID x 1 inch steel spacers, $184.32 per 250 | 1 pack | Replaces the sleeve tube and 16 saw cuts. Check that a 1/4 inch bolt slides through one before trusting the rest |
| D | Axle parts | [Online Metals DOM tube, 3/4 inch OD x .065 wall](https://www.onlinemetals.com/en/buy/carbon-steel/0-75-od-x-0-065-wall-x-0-62-id-carbon-steel-round-tube-a513-type-5-dom/pid/7765), $4.99 per foot. A 5/8 inch x 3 ft plain steel rod from a hardware store, about $20.57. [Bolt Depot](https://boltdepot.com) 5/8 inch SAE washers at $0.15 and 1/8 x 1-1/2 inch cotter pins at $0.07 | 1 ft of tube, 1 rod, 4 washers, 4 cotters | You need 337 of rod. Never use threaded rod as an axle |
| E | Plywood | [Home Depot 15/32 inch ACX sanded pine](https://www.homedepot.com/b/Lumber-Composites-Plywood/15-32/N-5yc1vZbqm7Z1z0mcqq), $52.00 a sheet | 1 | Floor 1350.8 x 750.8 and ramp 1000 x 688. Plus exterior sealer |
| F | Ramp hardware | [Zoro Select 2ZFK4 stainless piano hinge, 36 inch](https://www.zoro.com/zoro-select-piano-hinge-stainless-steel-full-surface-mounting-1-in-leaf-w-x-36-in-leaf-h-stainless-steel-2zfk4/i/G1671966/), $18.19. [Southco TL-20-202-52 stainless draw latch](https://www.zoro.com/southco-toggle-style-draw-latch-small-size-concealed-mount-stainless-steel-passivated-tl-20-202-52/i/G115615363/), $11.89 | 1 hinge, 2 latches, 18 carriage bolts 1/4-20 x 2 inch (Bolt Depot 2754, $0.16) | The hinge is unpunched: cut it to 680 and drill it. Check the latch comes with its keeper |
| F | Handle, floor and parking | [S&W BSW-1Z 3/8-16 swivel leveling mount](https://www.zoro.com/s-w-manufacturing-level-mount-swivel-stud-38-16-1-14-in-bsw-1z/i/G1257593/) in its tall version, $11.59. [Harbor Freight 96479 rubber wheel chock](https://www.harborfreight.com/solid-rubber-wheel-chock-96479.html), $7.49, in store. Hardware store: 1/4-20 rivet nuts, foam grip tube for a 1 inch bar, 1/8 inch foam strip | 2 tall leveling mounts, 2 chocks, 27 rivet nuts and flat-head screws 1/4-20, about 5 foam grips of 6 inch, about 9 m of foam strip, one 12.7 mm aluminum tube 1016.8582 long | A 4 ft store tube is too short for a 1016.8582 ridge. Rivet nut, grip and foam strip prices were seen on listings only |
| D | Rear suspension | [LvTu 150 mm coil-over shock](https://www.amazon.com/LvTu-Bicycle-Absorber-Suspension-Bushing/dp/B0CH6DCCPS), $31.05, in the 450 lbs spring. [Bunting EF081008 bronze flanged bearing](https://www.zoro.com/search?q=oil+impregnated+bronze+flanged+sleeve+bearing+1%2F2+x+5%2F8+x+1%2F2), $5.29 per pack of three. [Bolt Depot 399](https://boltdepot.com/Product-Details?product=399) 1/2-13 x 4 inch bolt, $1.64, and lock nut 21807, $0.41. M8 x 50 bolts with lock nuts | 2 shocks, 2 packs of bearings, 2 pivot bolts and nuts, 4 eye bolts, 4 hanger bolts 1/4-20 x 3-1/2 inch | Buy the shocks before ordering the plates. The plate files assume eyes 24 wide with an 8 bore; if yours differ, say so before cutting |
| G | Cover materials | See buy-list.md for every line with its link | | Cut list in cover-cut-schedule.csv |
| H | Filament | Any PETG for fit trials, ASA for parts left in the sun | About 1 kg | 76 printed pieces in all |

Materials for one build come to about $2,235.37 before tax and shipping. buy-list.md splits that into prices read on a supplier page and allowances.

## 4. Tools

- Miter saw with a non-ferrous metal blade, or a hacksaw with a miter box. Two clamps. A file or deburring tool.
- Drill press if you can get one; a hand drill with a drill guide block works. Center punch and hammer.
- Drill bits: 1/8 inch for pilots, 3/16 inch for the brake clamp screws, letter W (0.386 inch, 9.8 mm) for sleeve holes, 17/64 inch for plain bolt holes, 3/8 inch for the tip-stop stems, a 3/4 inch step bit or hole saw for the axle sleeve, 7/16 inch for the caster bolts.
- Tape measure, steel rule, combination square, calipers, a fine marker and a scriber.
- Two 7/16 inch wrenches or a wrench and socket. Rivet nut setter. Jigsaw for the plywood.
- A 3D printer with a bed of at least 220 x 220 mm.
- Safety glasses and hearing protection. Aluminum chips are sharp and hot.

## 5. Print first

Print in this order, because the first pieces are tools for the rest.

1. coupon.stl. Measure its holes with calipers. If the 6.75 hole is off by more than 0.2, adjust your slicer before printing anything else.
2. guide_butt.stl, guide_run.stl and guide_tee.stl. These are the drill guides.
3. One cap_heavy.stl and one cap_light.stl. Try them in an offcut of each tube.
4. The rest: 16 x cap_heavy.stl, 12 x cap_light.stl, 3 x ramp_toe.stl, 3 x ridge_saddle.stl, 28 x fabric_clip.stl, 6 x cable_clip.stl, 4 x axle_cover.stl.

Files named FIT_CHECK_ONLY are plastic copies of the metal plates. Print one of each to rehearse a joint. They never go in the carrier.

## 6. Cut the tube

Cut the long pieces first. Clamp the bar, cut square, and leave the saw 3 mm per cut. Deburr both ends inside and out. Write the ID on each piece as it comes off the saw. Cut pairs to the same stop so they match each other exactly; matching matters more than the absolute length.

Chassis tube, 1/8 inch wall, from 4 half bars of 12 ft:

| Bar | Pieces, ID and length | Offcut |
| --- | --- | ---: |
| 1 | C01 1678.65, C01 1678.65, C17 140, C17 140 | 6.7 |
| 2 | C06 1000, C06 1000, C28 999.284, C22 357.8103, C08 107.3571, C08 107.3571, C23 60 | 3.1915 |
| 3 | C28 999.284, C03 909.9122, C03 909.9122, C02 700, C23 60 | 61.8916 |
| 4 | C02 700, C22 357.8103 | 2592.1897 |

Cabin tube, 1/16 inch wall, from 5 half bars of 10 ft 6 in:

| Bar | Pieces, ID and length | Offcut |
| --- | --- | ---: |
| 1 | C26 2848.9582 | 346.5418 |
| 2 | C26 2848.9582 | 346.5418 |
| 3 | C27 2663.484 | 532.016 |
| 4 | C11 700, C11 700, C11 700, C14 700 | 386.5 |
| 5 | C14 700, C14 700, C07 688, C07 688 | 410.5 |

| ID | Member | Qty | Cut |
| --- | --- | ---: | ---: |
| C01 | Base side rail | 2 | 1678.65 |
| C02 | Base end cross member | 2 | 700 |
| C03 | Axle post | 2 | 909.9122 |
| C06 | Ramp side curb rail | 2 | 1000 |
| C07 | Ramp under rib | 2 | 688 |
| C08 | Ramp stand leg | 2 | 107.3571 |
| C11 | Top cross tube | 3 | 700 |
| C14 | Base intermediate cross member | 3 | 700 |
| C17 | Brake arm | 2 | 140 |
| C26 | Side hoop | 2 | 2848.9582 |
| C27 | Handle bar | 1 | 2663.484 |
| C28 | Nose hoop | 2 | 999.284 |
| C22 | Swing arm | 2 | 357.8103 |
| C23 | Shock spacer tube | 2 | 60 |

Angled ends. Lengths are along the middle of the tube, so mark the middle of each face and cut through that mark.

| Piece | End | Cut |
| --- | --- | --- |
| C03 axle post | Top | 10.2 degrees off square, high side to the rear, so the sloping roof run sits flat on it |
| C26 side hoop | Front foot | 22.7 degrees off square, so the pillar leans back. The rear foot is square |

Cut these a little long and trim to fit against the tacked frame, or leave them to the shop.

Bent tubes. The cut length is the straight tube before bending. Each bends in one plane at 114.3 centerline radius.

| Tube | Qty | Cut | Runs in order from one end |
| --- | ---: | ---: | --- |
| C26 Side hoop | 2 | 2848.9582 | straight 888.9243, bend 100.2 degrees, straight 785.3122, bend 57.1 degrees, straight 860.9953 |
| C27 Handle bar | 1 | 2663.484 | straight 878.4, bend 90.0 degrees, straight 547.6, bend 90.0 degrees, straight 878.4 |
| C28 Nose hoop | 2 | 999.284 | straight 71.7, bend 90.0 degrees, straight 496.8, bend 90.0 degrees, straight 71.7 |

Then cut 16 sleeves 25.4 long from the 3/8 inch steel tube, 2 axle sleeves 25.4 long and 2 wheel spacers 12.7 long from the 3/4 inch tube, and the axles: 2 at 162.4. Square and deburr every one. The linked 3/4 inch x .065 wall tube is 0.620 inch inside, a hair under the 5/8 inch axle: ream it to 5/8 or buy .058 wall instead. A sleeve that is short lets the tube crush; one that is long keeps the plate from seating.

## 7. Mark and drill

The welded frame has few holes: the axle hangers, the brake plates, the tip-stops, the ramp and the front wheel. Drill them after welding, or have the shop do it. Every hole is in drilling.csv, measured from a named end of a named piece. "Side" means through the two vertical faces of the tube as it sits in the carrier. "Vertical" means through top and bottom. "Fore-aft" means front to back.

1. Lay the tube down with the face to be drilled upward. Scribe a centerline along that face, 12.7 from either edge.
2. Use the printed guides for the repeated patterns. guide_butt hooks over a cut end and gives 22.3, 37.3, 52.3 and 67.3. guide_run gives 47.7, 62.7, 77.7 and 92.7 from a rail end. guide_tee centers on a scribed joint line and gives 30 each side. For anything else, measure and center punch.
3. Drill a 1/8 inch pilot through both walls in one pass, keeping the drill square. Then open to the size in the table. Deburr inside and out.
4. Push a sleeve into each sleeve hole. It should enter with thumb pressure and sit flush with both faces.
5. Drill pairs together where you can: clamp the two base rails side by side and drill both.

The base rails carry the most holes. For this configuration, from the rear end of each C01:

| Direction | Centers from the rear end | For |
| --- | --- | --- |
| vertical | 142.7 | Tip-stop foot stem |
| side | 885.4 | Swing arm pivot bolt |
| vertical | 112.5667, 337.7, 570.4, 787.9667, 1013.1, 1238.2333 | Floor screw rivet nuts |

Wait to drill the axle sleeve holes in the axle posts until a hanger plate is in your hand: clamp the hanger to the post, mark through its large hole, and drill to that mark.

## 8. Weld the frame

This is the shop's work. The order below is what to ask for and what to check. Weld numbers refer to weld-schedule.csv.

1. Base ladder, flat on the welding table. Two C01 rails parallel, 725.4 apart center to center, rear ends level. A C02 end cross member between them at the rear end and one with its center 1338.1 from the rear end. The 3 C14 cross members with their centers at 344.05, 680.4, 1006.75 from the rear end. Tack every joint, measure both diagonals, and correct until they match within 2 mm. Then weld all round. W01.
2. Axle posts. Each C03 axle post stands on a rail with its center 585.4 from the rear end, angled end up, long side to the rear. Tack, then check the two posts are square to the base and directly opposite each other before welding. W06.
3. Side hoops. Stand a C26 side hoop on each rail: its rear foot on the rear end of the rail, its front foot with its center 1338.1 from the rear end, its roof run resting on the axle post. The roof falls 180 from rear to front and the front pillar leans back 350. Tack, check that both hoops lean the same, then weld. W02, W04 and W07.
4. Roof. Fit the three C11 cross tubes between the roof runs of the two hoops, their centers 172.6329, 585.4, 894.7434 from the rear end of the rail, measured level. They sit on the straight part of the roof run, clear of the bends. W08.
5. Nose. Stand the two C28 nose hoops across the rail extensions, a foot on each rail, with their centers 1512.95 and 1598.65 from the rear end. Their top runs must be level with each other, 198.7 above the underside of the base rail to their underside, because the caster bolts up under both. W09.
6. Handle. Lay the C27 handle bar against the outside faces of the rear posts and the axle posts, its centerline 888.7 above the underside of the base rail, the ends of its two arms 40 past the axle posts. W12.
7. Brake arms. Butt a C17 arm against the outside face of each axle post, its centerline 419.1 up the post from the post's foot, pointing outward over the tire. W11.
8. Ramp legs. Weld the two C08 stand legs square to the hinge-end C07 rib, 60 in from each end of the rib. This is a separate small piece. W14.

When you collect the frame, check it before you pay:

1. It sits flat on a flat floor without rocking, and the base diagonals match within 2 mm.
2. A square held against each axle post shows it upright both ways. Sighting across the frame, one axle post hides the other.
3. Every joint in weld-schedule.csv is welded all the way round, with no gaps, cracks or pinholes, and none ground flush. No bend is cracked, kinked or flattened on the inside.
4. The clear width between the base rails is 700 and the handle is where you want it.

These are checks an owner can make. They say the frame is the right shape. They do not say how strong the welds are.

## 9. Suspension, wheels and caster

1. Drill the swing arms, the pivot holes in the base rails and the hanger holes in the axle posts from drilling.csv. Press a flanged bronze bushing into each wall of each arm at the pivot end, flanges outside, and fit a 3/4 inch axle sleeve through the other end.
2. Bolt a shock plate to each side face of each arm with two bolts through the arm, a sleeve in each hole. The ears with the large hole stand above the arm.
3. Hang each arm outside its base rail with the plates on top and the axle end to the rear. From inside: 1/2 inch bolt, washer, the rail with its crush sleeve, the 13 spacer, the arm, washer, lock nut. Tighten until the arm swings freely with no side play, and no tighter.
4. Hang two shock hangers from each axle post, ears down. From outside, each 3-1/2 inch bolt passes through the outer hanger, the C23 spacer tube, the inner hanger, a 9.8 spacer, then the post, with a washer and lock nut inside the cabin. The spacer tube stands upright between the two hangers.
5. Bolt a shock between the plates on the arm and the hangers on the post with M8 bolts and lock nuts. If an eye is narrower than the gap, pack it with washers equally on both sides.
6. Slide each rear axle through its sleeve from inside. From the inside out the order is cotter, washer, swing arm, spacer, wheel, washer, cotter. The stack between washer faces should be 142.7 with about 0.5 of end float. Spin the wheel. It must not rub the arm.
7. Stand the frame on its wheels. Empty, it should settle about 6. With the dog's weight in sandbags it should settle about 22, out of about 59 of wheel travel. Those numbers take the seller's 450 lbs spring label at face value. If it sits much lower, or tops out with no settle at all, the spring is wrong for this load. The same shock is sold with softer and stiffer springs: change the spring, not the geometry.
8. Push down on each rear corner and let go. It should rise once and stop. Rock the top of each wheel in and out by hand: any movement you can see is play at the pivot, and that needs fixing before a load goes in.
9. The maker lists the caster plate as 4 x 4-1/2 inch with slotted holes, and the drilling schedule puts two holes in each beam, 70 apart, to land in those slots. Hold the delivered caster up under the beams on the centerline to confirm before drilling 7/16 inch through each beam with a sleeve. Bolt it on with a washer over each slot.
10. Roll the frame. It should steer by pushing the handle end sideways and the caster should swing a full circle without touching the cabin front or the posts. Fit the bolt-on swivel lock as its maker shows and check it holds the wheel straight.

## 10. Ridge and finish

1. Clip the three ridge saddles over the top cross tubes at the centerline and lay the 12.7 mm ridge tube in them. It follows the roof down toward the front.
2. Bare aluminum is fine for a bench build. For a finished carrier, have the frame powder coated or anodized before anything is bolted to it.

## 11. Floor

1. Cut the floor panel 1350.8 x 750.8. Notch 44 x 30 at each of the six posts.
2. Seal every face and edge, including the notches, and let it cure.
3. Stick bedding tape along the rails and cross members.
4. Set a rivet nut in each floor hole in the tube tops: 6 along each rail and three across each cross member, 27 in all, placed in drilling.csv. Lay the panel on, mark each hole from underneath or measure from the schedule, drill the panel, and fasten it down with flat-head screws.

## 12. Ramp and tailgate

1. Cut the ramp panel 1000 x 688 and seal it.
2. Bolt the two C06 curb rails on top along the long edges with carriage bolts, smooth heads underneath.
3. Bolt the two C07 ribs underneath, one 40 from the hinge edge and one at mid length.
4. The two C08 stand legs come welded to the hinge-end rib, 60 in from each end. Press a printed chassis cap into the bottom of each leg. The cap is the foot.
5. Screw the hinge to the top face of the floor edge and the top face of the ramp, with a 6 gap between the panels.
6. Lower the ramp on level ground. Both capped legs should touch at the same time as the toe edge. If a leg floats or lifts the toe, trim or shim that leg; the cut length is 107.3571.
7. Stick the traction sheet between the curbs, stopping 18 short of the ground edge, and slide the three printed toes onto that edge with a bead of sealant.
8. Raise the ramp. Fit the two draw latches to the rear posts and the safety strap as a separate, second hold.

## 13. Handle, tip-stops and parking brake

1. The handle bar is part of the welded frame. The grip is 1000 above the ground.
2. The foam grip cannot slide round the bends: slit it lengthwise, fit it over the middle of the bar and tape it.
3. Screw a tall leveling mount up through each base rail at 142.7 from the rear end, a nut and washer above and below. Set the pads about 40 above the ground.
4. Brake arms. The C17 arms are welded to the axle posts. Bolt a brake clamp plate to the front face of each arm with two bolts through the arm, a sleeve in each hole.
5. Hold a toggle clamp against the plate with its plunger pointing straight down at the middle of the tread. With the handle open the pad should clear the tire by about 10; closed, it should press about 10 into it. Mark the four base holes, drill 3/16 inch through the plate, and bolt the clamp on.
6. Swap the clamp's plain plunger bolt for the neoprene-tipped spindle and set its height with the jam nuts. Close both clamps and try to roll the carrier. It should not move on level ground.
7. Chock both rear wheels as well on any slope and whenever the ramp is down. The clamps are a parking brake only. Nothing slows the carrier while it is moving.
8. With sprung wheels the tire rises and falls under the pad as the load changes. Set the pad with the dog's weight aboard and expect it to grip less when the carrier is empty. This is not solved; rely on the chocks.

## 14. Cover

Cut the 18 blanks in cover-cut-schedule.csv. Sew and seal as described in materials.md. Hang the cover with the printed rail clips and the hook-and-loop tabs.

## 15. Before any load

1. Check every bolt has a sleeve, two washers and a lock nut with thread showing. Look over every weld for cracks, now and after each step below.
2. Push, pull and rack the empty frame by hand. Nothing should shift or click.
3. Load sandbags in four steps up to the weight of the dog, in the middle of the floor. Look at the floor, the axle posts and the hangers at each step. Then move the bags to the tailgate end and watch for the front lifting. Stop at the first thing that bends, slips or creaks.
4. Walk the loaded ramp with sandbags at mid span and at the hinge.
5. Roll it loaded over the surfaces you intend to use, at walking pace.

Passing these does not make it safe for a dog. It tells you the bench carrier is worth showing to an engineer and to the dog's vet, which is the next step in assembly.md.
