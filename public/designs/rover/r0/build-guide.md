# Buddy Rover r0 build guide

Configuration rover-r0-l1300-w700-h1000-r1000-a560-g1000-hub101.6-trail-swivel310-k350-t180-welded. All dimensions mm unless marked. Read this once to the end before ordering anything.

**What this builds.** A bench carrier for checking fit, handling and the ramp with sandbags. It has no load rating, an untested parking brake, no brake for slowing while moving, and no test behind it. Do not put a dog in it until the release gates at the end are met.

## 1. How the aluminum frame gets its shape

The frame is welded by a fabrication shop into one rigid piece. The base is a flat ladder: two long side rails with 5 cross members between them. Two rear posts, two axle posts and two front pillars stand on it and carry a roof frame that falls 180 from rear to front. Each pillar leans back 350, which gives the raked nose. No plates hold it together. See base-plan.svg for the view from above and drawing.svg for the side.

Every piece is still a straight length of 1 inch square tube. Nothing is bent. Six pieces have an angled end, listed in section 6, and the rest are cut square.

Welding thin aluminum tube is TIG work and not a first welding project. Unless you already weld aluminum, a shop does it. There are two ways to use one:

1. **The shop does everything.** Send them cut-list.csv, weld-schedule.csv, drilling.csv, base-plan.svg and drawing.svg, and ask for a price to supply the tube, cut it, weld it and drill it. Search for "aluminum TIG welding" or "custom metal fabrication" near you, or ask at the counter of a metal supplier who they send people to. A bicycle frame builder, a marine or race-car fabricator, a community college welding program or a makerspace with a TIG welder are all worth a call for a single frame. Ask three.
2. **You cut, the shop welds.** Buy the bars, cut and label every piece as in section 6, and bring the shop a box of labelled tube with the same drawings. That saves their saw time and lets you check every length first. Ask before you cut whether they would rather cut the angled ends themselves.

The cost study puts the welding of one frame at about $690.00. That is arithmetic on an assumed shop rate, and no shop has seen the drawings.

What to tell the shop:

- Material. Chassis pieces are 1 x 1 x 1/8 inch 6061-T6. Cabin pieces are 1 x 1 x 1/16 inch 6063-T52. The cut list says which is which. The 1/16 wall is thin to weld; if they ask for 1/8 wall throughout, that works and adds about 5.0 kg.
- Filler is their choice, normally 4043 or 5356. If the frame will be anodized, say so first, because the filler decides whether the welds show dark afterwards.
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
| B | Hangers and brake plates | A laser-cutting service. [OSH Cut](https://app.oshcut.com/cart) shows a price as soon as you drop the files in, with no account. [SendCutSend](https://sendcutsend.com) lists both materials, has no minimum quantity and ships laser parts in 1 to 3 days, and asks you to sign up first | 2 x brake_plate.dxf in 0.125 inch 6061-T6 aluminum. 4 x axle_hanger_mid.dxf in 0.125 inch 304 stainless | Upload the two DXF files from the metal folder, pick material and thickness, enter quantities. Add their deburring service or file the edges yourself |
| C | Chassis tube, 1 x 1 x 1/8 inch 6061-T6 | [Metals Depot T3118-6061](https://www.metalsdepot.com/aluminum-products/aluminum-square-tube), 8 ft at $58.08 | 5 bars | 8 ft is the longest that ships by parcel. Longer bars are cheaper per foot but come by truck |
| C | Cabin tube, 1 x 1 x 1/16 inch 6063-T52 | [Metals Depot T31116](https://www.metalsdepot.com/aluminum-products/aluminum-square-tube), 8 ft at $41.60 | 7 bars | Do not swap this softer tube into the chassis positions |
| D | Bolts, nuts, washers | [Bolt Depot](https://boltdepot.com/Product-Details?product=328): 1/4-20 x 2 inch grade 5 zinc hex bolt 328, lock nut 2624, SAE washer 2976 | 1 box of 100 bolts, 1 of nuts, 1 of washers | You need 14 bolts and 4 at 5/16-18 x 2-1/2 inch for the caster |
| D | Sleeve tube | [Online Metals DOM steel tube, 3/8 inch OD x .049 wall](https://www.onlinemetals.com/en/buy/carbon-steel/0-375-od-x-0-049-wall-x-0-28-id-carbon-steel-round-tube-a513-type-5-dom/pid/7754), $11.66 per 6 ft | 1 lengths of 6 ft | Cut into 14 sleeves, each 25.4 long |
| D | Axle parts | [Online Metals DOM tube, 3/4 inch OD x .065 wall](https://www.onlinemetals.com/en/buy/carbon-steel/0-75-od-x-0-065-wall-x-0-62-id-carbon-steel-round-tube-a513-type-5-dom/pid/7765), $4.99 per foot. A 5/8 inch x 3 ft plain steel rod from a hardware store, about $20.57. [Bolt Depot](https://boltdepot.com) 5/8 inch SAE washers at $0.15 and 1/8 x 1-1/2 inch cotter pins at $0.07 | 1 ft of tube, 1 rod, 4 washers, 4 cotters | You need 350 of rod. Never use threaded rod as an axle |
| E | Plywood | [Home Depot 15/32 inch ACX sanded pine](https://www.homedepot.com/b/Lumber-Composites-Plywood/15-32/N-5yc1vZbqm7Z1z0mcqq), $52.00 a sheet | 1 | Floor 1350.8 x 750.8 and ramp 1000 x 688. Plus exterior sealer |
| F | Ramp hardware | [Zoro Select 2ZFK4 stainless piano hinge, 36 inch](https://www.zoro.com/zoro-select-piano-hinge-stainless-steel-full-surface-mounting-1-in-leaf-w-x-36-in-leaf-h-stainless-steel-2zfk4/i/G1671966/), $18.19. [Southco TL-20-202-52 stainless draw latch](https://www.zoro.com/southco-toggle-style-draw-latch-small-size-concealed-mount-stainless-steel-passivated-tl-20-202-52/i/G115615363/), $11.89 | 1 hinge, 2 latches, 18 carriage bolts 1/4-20 x 2 inch (Bolt Depot 2754, $0.16) | The hinge is unpunched: cut it to 680 and drill it. Check the latch comes with its keeper |
| F | Handle, floor and parking | [S&W BSW-1Z 3/8-16 swivel leveling mount](https://www.zoro.com/s-w-manufacturing-level-mount-swivel-stud-38-16-1-14-in-bsw-1z/i/G1257593/) in its tall version, $11.59. [Harbor Freight 96479 rubber wheel chock](https://www.harborfreight.com/solid-rubber-wheel-chock-96479.html), $7.49, in store. Hardware store: 1/4-20 rivet nuts, foam grip tube for a 1 inch bar, 1/8 inch foam strip | 2 tall leveling mounts, 2 chocks, 27 rivet nuts and flat-head screws 1/4-20, about 5 foam grips of 6 inch, about 9 m of foam strip, one 12.7 mm aluminum tube 1016.8582 long | A 4 ft store tube is too short for a 1016.8582 ridge. Rivet nut, grip and foam strip prices were seen on listings only |
| G | Cover materials | See buy-list.md for every line with its link | | Cut list in cover-cut-schedule.csv |
| H | Filament | Any PETG for fit trials, ASA for parts left in the sun | About 1 kg | 76 printed pieces in all |

Materials for one build come to about $2,255.42 before tax and shipping. buy-list.md splits that into prices read on a supplier page and allowances.

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

Chassis tube, 1/8 inch wall, from 5 bars of 8 ft:

| Bar | Pieces, ID and length | Offcut |
| --- | --- | ---: |
| 1 | C01 1678.65, C16 750.8 | 2.95 |
| 2 | C01 1678.65, C16 750.8 | 2.95 |
| 3 | C06 1000, C06 1000, C15 173.3, C15 173.3 | 79.8 |
| 4 | C03 909.9122, C03 909.9122, C15 173.3, C15 173.3, C17 140, C08 107.3571 | 6.6185 |
| 5 | C02 700, C02 700, C17 140, C08 107.3571 | 779.0429 |

Cabin tube, 1/16 inch wall, from 7 bars of 8 ft:

| Bar | Pieces, ID and length | Offcut |
| --- | --- | ---: |
| 1 | C10 1016.8582, C10 1016.8582 | 398.6836 |
| 2 | C09 1015.2, C09 1015.2 | 402 |
| 3 | C12 1005.4, C12 1005.4 | 421.6 |
| 4 | C21 905.5711, C21 905.5711 | 621.2578 |
| 5 | C13 750.8, C11 700, C11 700 | 278.6 |
| 6 | C11 700, C14 700, C14 700 | 329.4 |
| 7 | C14 700, C07 688, C07 688 | 353.4 |

| ID | Member | Qty | Cut |
| --- | --- | ---: | ---: |
| C01 | Base side rail | 2 | 1678.65 |
| C02 | Base end cross member | 2 | 700 |
| C03 | Axle post | 2 | 909.9122 |
| C06 | Ramp side curb rail | 2 | 1000 |
| C07 | Ramp under rib | 2 | 688 |
| C08 | Ramp stand leg | 2 | 107.3571 |
| C09 | Rear corner post | 2 | 1015.2 |
| C10 | Top side rail | 2 | 1016.8582 |
| C11 | Top cross tube | 3 | 700 |
| C12 | Handle arm | 2 | 1005.4 |
| C13 | Handle grip tube | 1 | 750.8 |
| C14 | Base intermediate cross member | 3 | 700 |
| C15 | Nose post | 4 | 173.3 |
| C16 | Caster beam | 2 | 750.8 |
| C17 | Brake arm | 2 | 140 |
| C21 | Front pillar | 2 | 905.5711 |

Angled ends. Lengths are along the middle of the tube, so mark the middle of each face and cut through that mark.

| Piece | End | Cut |
| --- | --- | --- |
| C03 axle post, C09 rear post | Top | 10.2 degrees off square, high side to the rear, so the sloping top rail sits flat on it |
| C21 front pillar | Foot | 22.7 degrees off square, so the pillar leans back |
| C21 front pillar | Top | 32.9 degrees off square, so it sits flat under the top rail |

Cut these a little long and trim to fit against the tacked frame, or leave them to the shop.

Then cut 14 sleeves 25.4 long from the 3/8 inch steel tube, 2 axle sleeves 25.4 long and 2 wheel spacers 12.7 long from the 3/4 inch tube, and the axles: 2 at 168.75. Square and deburr every one. A sleeve that is short lets the tube crush; one that is long keeps the plate from seating.

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
| side | 555.4, 615.4 | Axle hanger bar |

Wait to drill the axle sleeve holes in the axle posts until a hanger plate is in your hand: clamp the hanger to the post, mark through its large hole, and drill to that mark.

## 8. Weld the frame

This is the shop's work. The order below is what to ask for and what to check. Weld numbers refer to weld-schedule.csv.

1. Base ladder, flat on the welding table. Two C01 rails parallel, 725.4 apart center to center, rear ends level. A C02 end cross member between them at the rear end and one with its center 1338.1 from the rear end. The 3 C14 cross members with their centers at 344.05, 680.4, 1006.75 from the rear end. Tack every joint, measure both diagonals, and correct until they match within 2 mm. Then weld all round. W01.
2. Posts. Each C03 axle post stands on a rail with its center 585.4 from the rear end. Each C09 rear post stands on the rear end of a rail. Both have the angled end up, long side to the rear. Tack, then check the two axle posts are square to the base and directly opposite each other before welding. W02 and W06.
3. Front pillars. The foot of each C21 pillar sits on a rail with its center 1338.1 from the rear end. The pillar leans back so its top is 350 behind its foot. W04.
4. Roof. Lay each C10 top rail on the rear post, the axle post and the pillar top, rear end level with the back of the rear post. It falls 180 from rear to front. Fit the three C11 cross tubes between the rails: over the rear posts, over the axle posts and at the pillar tops. W03, W05, W07 and W08.
5. Nose. Stand the four C15 nose posts on the rail extensions with their centers 1512.95 and 1598.65 from the rear end. Lay the two C16 caster beams across the post tops, ends flush with the outside of the rails. W09 and W10.
6. Handle. Lay each C12 handle arm against the outside faces of a rear post and an axle post, its centerline 888.7 above the underside of the base rail, its front end 40 past the axle post. Fit the C13 grip tube between the rear ends of the arms. W12 and W13.
7. Brake arms. Butt a C17 arm against the outside face of each axle post, its centerline 419.1 up the post from the post's foot, pointing outward over the tire. W11.
8. Ramp legs. Weld the two C08 stand legs square to the hinge-end C07 rib, 60 in from each end of the rib. This is a separate small piece. W14.

When you collect the frame, check it before you pay:

1. It sits flat on a flat floor without rocking, and the base diagonals match within 2 mm.
2. A square held against each axle post shows it upright both ways. Sighting across the frame, one axle post hides the other.
3. Every joint in weld-schedule.csv is welded all the way round, with no gaps, cracks or pinholes, and none ground flush.
4. The clear width between the base rails is 700 and the handle is where you want it.

These are checks an owner can make. They say the frame is the right shape. They do not say how strong the welds are.

## 9. Wheels and caster

1. Drill the bolt-on holes now, from drilling.csv. Clamp a hanger to each axle post with its bar along the rail and mark through it, so the holes match the plate you actually have.
2. Bolt a hanger to each side face of each axle post, bar to the rail, stem to the post, a sleeve in every hole. Fit the 3/4 inch axle sleeve through hanger, post and hanger.
3. Slide each rear axle through its sleeve from inside. From the inside out the order is cotter, washer, inner hanger, post, outer hanger, spacer, wheel, washer, cotter. The stack between washer faces should be 149.05 with about 0.5 of end float. Spin the wheel. It must not rub the hanger.
4. The maker lists the caster plate as 4 x 4-1/2 inch with slotted holes, and the drilling schedule puts two holes in each beam, 70 apart, to land in those slots. Hold the delivered caster up under the beams on the centerline to confirm before drilling 7/16 inch through each beam with a sleeve. Bolt it on with a washer over each slot.
5. Roll the frame. It should steer by pushing the handle end sideways and the caster should swing a full circle without touching the cabin front or the posts. Fit the bolt-on swivel lock as its maker shows and check it holds the wheel straight.

## 10. Ridge and finish

1. Clip the three ridge saddles over the top cross tubes at the centerline and lay the 12.7 mm ridge tube in them. It follows the roof down toward the front.
2. Bare aluminum is fine for a bench build. For a finished carrier, have the frame powder coated or anodized before anything is bolted to it.

## 11. Floor

1. Cut the floor panel 1350.8 x 750.8. Notch 44 x 30 at each of the six posts.
2. Seal every face and edge, including the notches, and let it cure.
3. Stick bedding tape along the rails and cross members.
4. Set rivet nuts in the tube tops about every 250 and fasten the floor down with flat-head screws.

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

1. The handle arms and grip tube are part of the welded frame, 1000 above the ground.
2. Slide the foam grip onto the grip tube. If it will not pass the arm ends, slit it lengthwise and tape it.
3. Screw a tall leveling mount up through each base rail at 142.7 from the rear end, a nut and washer above and below. Set the pads about 40 above the ground.
4. Brake arms. The C17 arms are welded to the axle posts. Bolt a brake clamp plate to the front face of each arm with two bolts through the arm, a sleeve in each hole.
5. Hold a toggle clamp against the plate with its plunger pointing straight down at the middle of the tread. With the handle open the pad should clear the tire by about 10; closed, it should press about 10 into it. Mark the four base holes, drill 3/16 inch through the plate, and bolt the clamp on.
6. Swap the clamp's plain plunger bolt for the neoprene-tipped spindle and set its height with the jam nuts. Close both clamps and try to roll the carrier. It should not move on level ground.
7. Chock both rear wheels as well on any slope and whenever the ramp is down. The clamps are a parking brake only. Nothing slows the carrier while it is moving.

## 14. Cover

Cut the 18 blanks in cover-cut-schedule.csv. Sew and seal as described in materials.md. Hang the cover with the printed rail clips and the hook-and-loop tabs.

## 15. Before any load

1. Check every bolt has a sleeve, two washers and a lock nut with thread showing. Look over every weld for cracks, now and after each step below.
2. Push, pull and rack the empty frame by hand. Nothing should shift or click.
3. Load sandbags in four steps up to the weight of the dog, in the middle of the floor. Look at the floor, the axle posts and the hangers at each step. Then move the bags to the tailgate end and watch for the front lifting. Stop at the first thing that bends, slips or creaks.
4. Walk the loaded ramp with sandbags at mid span and at the hinge.
5. Roll it loaded over the surfaces you intend to use, at walking pace.

Passing these does not make it safe for a dog. It tells you the bench carrier is worth showing to an engineer and to the dog's vet, which is the next step in assembly.md.
