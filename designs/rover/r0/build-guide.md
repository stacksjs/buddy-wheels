# Buddy Rover r0 build guide

Configuration rover-r0-l1300-w700-h1000-r1000-a560-g1000-hub101.6-trail-swivel310-k350. All dimensions mm unless marked. Read this once to the end before ordering anything.

**What this builds.** A bench carrier for checking fit, handling and the ramp with sandbags. It has no load rating, an untested parking brake, no brake for slowing while moving, and no test behind it. Do not put a dog in it until the release gates at the end are met.

## 1. How the aluminum base gets its shape

Nothing is bent, cast or welded. The base is a flat ladder: two long side rails with 5 cross members between them. Every piece is a straight length of 1 inch square tube cut square at both ends. The pieces are held together by flat plates called gussets that lie across each joint and are bolted through the tubes. A steel sleeve inside the tube at every bolt stops the bolt from crushing it. See base-plan.svg for the view from above and drawing.svg for the side.

So there are only three things to obtain: straight tube cut to length, flat plates cut to a drawn outline, and bolts. You have three ways to get the tube cut:

1. **Cut it yourself.** Buy stock bars and cut them with a miter saw fitted with a blade for non-ferrous metal, or with a hacksaw and a miter box. This is the cheapest route and the one priced here.
2. **Have the supplier cut it.** Online Metals says every order is cut to size, and Metals Depot offers a cut to size option. Order each line of cut-list.csv as its own cut length. You pay more per foot and receive a box of finished pieces. Their cut tolerance is looser than yours can be, so check every piece against the list when it arrives.
3. **Hand the package to a local shop.** A metal supplier with a saw, a fabrication shop or a makerspace can cut and drill the whole frame. Give them cut-list.csv, drilling.csv, base-plan.svg, drawing.svg and the DXF files. If they offer to weld it instead, that is a different frame from this one and needs its own review.

The plates are cut by a laser-cutting service from the DXF files in the kit. You do not make those by hand.

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
| B | Gussets and hangers | A laser-cutting service. [OSH Cut](https://app.oshcut.com/cart) shows a price as soon as you drop the files in, with no account. [SendCutSend](https://sendcutsend.com) lists both materials, has no minimum quantity and ships laser parts in 1 to 3 days, and asks you to sign up first | 44 x corner_gusset.dxf, 8 x tee_gusset.dxf and 2 x brake_plate.dxf in 0.125 inch 6061-T6 aluminum. 4 x axle_hanger_mid.dxf in 0.125 inch 304 stainless | Upload the four DXF files from the metal folder, pick material and thickness, enter quantities. Add their deburring service or file the edges yourself |
| C | Chassis tube, 1 x 1 x 1/8 inch 6061-T6 | [Metals Depot T3118-6061](https://www.metalsdepot.com/aluminum-products/aluminum-square-tube), 8 ft at $58.08 | 5 bars | 8 ft is the longest that ships by parcel. Longer bars are cheaper per foot but come by truck |
| C | Cabin tube, 1 x 1 x 1/16 inch 6063-T52 | [Metals Depot T31116](https://www.metalsdepot.com/aluminum-products/aluminum-square-tube), 8 ft at $41.60 | 7 bars | Do not swap this softer tube into the chassis positions |
| D | Bolts, nuts, washers | [Bolt Depot](https://boltdepot.com/Product-Details?product=328): 1/4-20 x 2 inch grade 5 zinc hex bolt 328, lock nut 2624, SAE washer 2976 | 2 boxes of 100 bolts, 2 of nuts, 4 of washers | You need 170 bolts, plus 4 at 3 inch long for the handle and 4 at 5/16-18 x 2-1/2 inch for the caster |
| D | Sleeve tube | [Online Metals DOM steel tube, 3/8 inch OD x .049 wall](https://www.onlinemetals.com/en/buy/carbon-steel/0-375-od-x-0-049-wall-x-0-28-id-carbon-steel-round-tube-a513-type-5-dom/pid/7754), $11.66 per 6 ft | 3 lengths of 6 ft | Cut into 178 sleeves, each 25.4 long |
| D | Axle parts | [Online Metals DOM tube, 3/4 inch OD x .065 wall](https://www.onlinemetals.com/en/buy/carbon-steel/0-75-od-x-0-065-wall-x-0-62-id-carbon-steel-round-tube-a513-type-5-dom/pid/7765), $4.99 per foot. A 5/8 inch x 3 ft plain steel rod from a hardware store, about $20.57. [Bolt Depot](https://boltdepot.com) 5/8 inch SAE washers at $0.15 and 1/8 x 1-1/2 inch cotter pins at $0.07 | 1 ft of tube, 1 rod, 4 washers, 4 cotters | You need 350 of rod. Never use threaded rod as an axle |
| E | Plywood | [Home Depot 15/32 inch ACX sanded pine](https://www.homedepot.com/b/Lumber-Composites-Plywood/15-32/N-5yc1vZbqm7Z1z0mcqq), $52.00 a sheet | 1 | Floor 1350.8 x 750.8 and ramp 1000 x 688. Plus exterior sealer |
| F | Ramp hardware | [Zoro Select 2ZFK4 stainless piano hinge, 36 inch](https://www.zoro.com/zoro-select-piano-hinge-stainless-steel-full-surface-mounting-1-in-leaf-w-x-36-in-leaf-h-stainless-steel-2zfk4/i/G1671966/), $18.19. [Southco TL-20-202-52 stainless draw latch](https://www.zoro.com/southco-toggle-style-draw-latch-small-size-concealed-mount-stainless-steel-passivated-tl-20-202-52/i/G115615363/), $11.89 | 1 hinge, 2 latches, 18 carriage bolts 1/4-20 x 2 inch (Bolt Depot 2754, $0.16) | The hinge is unpunched: cut it to 680 and drill it. Check the latch comes with its keeper |
| F | Handle, floor and parking | [S&W BSW-1Z 3/8-16 swivel leveling mount](https://www.zoro.com/s-w-manufacturing-level-mount-swivel-stud-38-16-1-14-in-bsw-1z/i/G1257593/) in its tall version, $11.59. [Harbor Freight 96479 rubber wheel chock](https://www.harborfreight.com/solid-rubber-wheel-chock-96479.html), $7.49, in store. Hardware store: 1/4-20 rivet nuts, foam grip tube for a 1 inch bar, 1/8 inch foam strip | 2 tall leveling mounts, 2 chocks, 27 rivet nuts and flat-head screws 1/4-20, about 5 foam grips of 6 inch, about 9 m of foam strip, one 12.7 mm aluminum tube 1000.8 long | A 4 ft store tube is too short for a 1000.8 ridge. Rivet nut, grip and foam strip prices were seen on listings only |
| G | Cover materials | See buy-list.md for every line with its link | | Cut list in cover-cut-schedule.csv |
| H | Filament | Any PETG for fit trials, ASA for parts left in the sun | About 1 kg | 76 printed pieces in all |

Materials for one build come to about $1,854.84 before tax and shipping. buy-list.md splits that into prices read on a supplier page and allowances.

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
| 3 | C03 1015.2, C03 1015.2, C15 173.3, C15 173.3 | 49.4 |
| 4 | C06 1000, C06 1000, C15 173.3, C15 173.3 | 79.8 |
| 5 | C02 700, C02 700, C17 140, C17 140, C08 107.3571, C08 107.3571 | 525.6858 |

Cabin tube, 1/16 inch wall, from 7 bars of 8 ft:

| Bar | Pieces, ID and length | Offcut |
| --- | --- | ---: |
| 1 | C09 1015.2, C09 1015.2 | 402 |
| 2 | C09 1015.2, C09 1015.2 | 402 |
| 3 | C12 1005.4, C12 1005.4 | 421.6 |
| 4 | C10 1000.8, C10 1000.8 | 430.8 |
| 5 | C13 750.8, C11 700, C11 700 | 278.6 |
| 6 | C11 700, C14 700, C14 700 | 329.4 |
| 7 | C14 700, C07 688, C07 688 | 353.4 |

| ID | Member | Qty | Cut |
| --- | --- | ---: | ---: |
| C01 | Base side rail | 2 | 1678.65 |
| C02 | Base end cross member | 2 | 700 |
| C03 | Axle post | 2 | 1015.2 |
| C06 | Ramp side curb rail | 2 | 1000 |
| C07 | Ramp under rib | 2 | 688 |
| C08 | Ramp stand leg | 2 | 107.3571 |
| C09 | Corner post | 4 | 1015.2 |
| C10 | Top side rail | 2 | 1000.8 |
| C11 | Top cross tube | 3 | 700 |
| C12 | Handle arm | 2 | 1005.4 |
| C13 | Handle grip tube | 1 | 750.8 |
| C14 | Base intermediate cross member | 3 | 700 |
| C15 | Nose post | 4 | 173.3 |
| C16 | Caster beam | 2 | 750.8 |
| C17 | Brake arm | 2 | 140 |

Then cut 178 sleeves 25.4 long from the 3/8 inch steel tube, 2 axle sleeves 25.4 long and 2 wheel spacers 12.7 long from the 3/4 inch tube, and the axles: 2 at 168.75. Square and deburr every one. A sleeve that is short lets the tube crush; one that is long keeps the plate from seating.

## 7. Mark and drill

Every hole is in drilling.csv, measured from a named end of a named piece. "Side" means through the two vertical faces of the tube as it sits in the carrier. "Vertical" means through top and bottom. "Fore-aft" means front to back.

1. Lay the tube down with the face to be drilled upward. Scribe a centerline along that face, 12.7 from either edge.
2. Use the printed guides for the repeated patterns. guide_butt hooks over a cut end and gives 22.3, 37.3, 52.3 and 67.3. guide_run gives 47.7, 62.7, 77.7 and 92.7 from a rail end. guide_tee centers on a scribed joint line and gives 30 each side. For anything else, measure and center punch.
3. Drill a 1/8 inch pilot through both walls in one pass, keeping the drill square. Then open to the size in the table. Deburr inside and out.
4. Push a sleeve into each sleeve hole. It should enter with thumb pressure and sit flush with both faces.
5. Drill pairs together where you can: clamp the two base rails side by side and drill both.

The base rails carry the most holes. For this configuration, from the rear end of each C01:

| Direction | Centers from the rear end | For |
| --- | --- | --- |
| side | 47.7, 77.7 | Rear corner post gusset |
| vertical | 62.7, 92.7 | Rear cross member gusset, underneath |
| vertical | 142.7 | Tip-stop foot stem |
| vertical | 314.05, 374.05, 650.4, 710.4, 976.75, 1036.75 | Intermediate cross member tee gussets, underneath |
| side | 555.4, 615.4 | Axle hanger bar |
| side | 923.1, 953.1 | Front post gusset. The front posts stand at 988.1 |
| vertical | 1258.1, 1288.1 | Front cross member gusset, underneath |
| side | 1447.95, 1477.95, 1633.65, 1663.65 | Nose post gussets. Posts stand at 1512.95 and 1598.65 |

Wait to drill the axle sleeve holes in the axle posts until a hanger plate is in your hand: clamp the hanger to the post, mark through its large hole, and drill to that mark.

## 8. Assemble the base flat

Work on a flat floor or table.

1. Lay the two C01 rails parallel, 725.4 apart center to center, rear ends level.
2. Set the two C02 end cross members between them, one at the rear end and one with its center 1338.1 from the rear end. Slide a corner gusset under each of the four corners, long-hole leg along the rail. Drop bolts down through tube, sleeve and plate with a washer under the head; add washer and lock nut underneath. Leave them finger tight.
3. Set the 3 C14 cross members at 344.05, 680.4, 1006.75 from the rear end, each with a tee gusset under each end, the stem along the cross member.
4. Measure both diagonals of the rectangle. Tap the frame until they match within 2 mm. Then tighten every bolt until the lock nut is fully engaged and the plate is clamped. Do not crush the tube; the sleeves set the limit. No torque figure is given because none has been validated.
5. Stand each C03 axle post on a rail at 585.4 from the rear end, a hanger on each side face, bar along the rail, stem up the post. Bolt the bar to the rail and the stem to the post. Fit the 3/4 inch axle sleeve through hanger, post and hanger.

The base now stands on its own and has the shape in base-plan.svg.

## 9. Wheels and nose

1. Slide each rear axle through its sleeve from inside. From the inside out the order is cotter, washer, inner hanger, post, outer hanger, spacer, wheel, washer, cotter. The stack between washer faces should be 149.05 with about 0.5 of end float. Spin the wheel. It must not rub the hanger.
2. Stand the four C15 nose posts on the rail extensions at 1512.95 and 1598.65 from the rear end. Each gets a corner gusset on both side faces, the rail leg pointing away from the other post.
3. Lay the two C16 caster beams across the post tops, ends flush with the outside of the rails. Tie each beam to its two posts with one corner gusset on the outside face.
4. The maker lists the caster plate as 4 x 4-1/2 inch with slotted holes, and the drilling schedule puts two holes in each beam, 70 apart, to land in those slots. Hold the delivered caster up under the beams on the centerline to confirm before drilling 7/16 inch through each beam with a sleeve. Bolt it on with a washer over each slot.
5. Roll the frame. It should steer by pushing the handle end sideways and the caster should swing a full circle without touching the cabin front or the posts. Fit the bolt-on swivel lock as its maker shows and check it holds the wheel straight.

## 10. Cabin frame

1. Stand the two rear C09 posts on the rear ends of the rails and the two front ones 988.1 from the rear end, one corner gusset on the outside face of each, long-hole leg up the post. The front posts stand 350 back from the front of the floor, which is what rakes the front wall.
2. Lay the two C10 top rails on the posts. Corner gussets on the outside face at each corner post, a pair at each axle post.
3. Fit the three C11 top cross tubes: front and rear with a corner gusset on top at each end, the middle one over the axle posts with a tee gusset on top.
4. Check the frame for square in both directions before the final tightening.
5. Clip the three ridge saddles over the top cross tubes at the centerline and lay the 12.7 mm ridge tube in them.
6. The raked front wall is fabric. When the cover goes on, slide a 1127.8836 windshield stay into the sleeve down each front edge so it runs from the base front corner up to the top front corner.

## 11. Floor

1. Cut the floor panel 1350.8 x 750.8. Notch 44 x 30 at each of the six posts.
2. Seal every face and edge, including the notches, and let it cure.
3. Stick bedding tape along the rails and cross members between the plates.
4. Set rivet nuts in the tube tops about every 250 and fasten the floor down with flat-head screws.

## 12. Ramp and tailgate

1. Cut the ramp panel 1000 x 688 and seal it.
2. Bolt the two C06 curb rails on top along the long edges with carriage bolts, smooth heads underneath.
3. Bolt the two C07 ribs underneath, one 40 from the hinge edge and one at mid length.
4. Fit the two C08 stand legs under the hinge-end rib, 60 in from each end, a corner gusset on both faces of the rib. Press a printed chassis cap into the bottom of each leg. The cap is the foot.
5. Screw the hinge to the top face of the floor edge and the top face of the ramp, with a 6 gap between the panels.
6. Lower the ramp on level ground. Both capped legs should touch at the same time as the toe edge. If a leg floats or lifts the toe, trim or shim that leg; the cut length is 107.3571.
7. Stick the traction sheet between the curbs, stopping 18 short of the ground edge, and slide the three printed toes onto that edge with a bead of sealant.
8. Raise the ramp. Fit the two draw latches to the rear posts and the safety strap as a separate, second hold.

## 13. Handle, tip-stops and parking brake

1. Bolt each C12 handle arm to the outside of a rear corner post and an axle post with one 3 inch bolt per post, 1000 above the ground.
2. Fit the C13 grip tube between the arm ends with a corner gusset above and below each end. Slide on the foam grip.
3. Screw a tall leveling mount up through each base rail at 142.7 from the rear end, a nut and washer above and below. Set the pads about 40 above the ground.
4. Brake arms. Butt a C17 arm against the outside face of each axle post, 419.1 up the post, pointing outward over the tire. Put a corner gusset on the front and rear faces, long-hole leg along the arm, and bolt through. On the front, hang a brake clamp plate on the same two arm bolts, outside the gusset.
5. Hold a toggle clamp against the plate with its plunger pointing straight down at the middle of the tread. With the handle open the pad should clear the tire by about 10; closed, it should press about 10 into it. Mark the four base holes, drill 3/16 inch through the plate, and bolt the clamp on.
6. Swap the clamp's plain plunger bolt for the neoprene-tipped spindle and set its height with the jam nuts. Close both clamps and try to roll the carrier. It should not move on level ground.
7. Chock both rear wheels as well on any slope and whenever the ramp is down. The clamps are a parking brake only. Nothing slows the carrier while it is moving.

## 14. Cover

Cut the 18 blanks in cover-cut-schedule.csv. Sew and seal as described in materials.md. Hang the cover with the printed rail clips and the hook-and-loop tabs.

## 15. Before any load

1. Check every bolt has a sleeve, two washers and a lock nut with thread showing.
2. Push, pull and rack the empty frame by hand. Nothing should shift or click.
3. Load sandbags in four steps up to the weight of the dog, in the middle of the floor. Look at the floor, the axle posts and the hangers at each step. Then move the bags to the tailgate end and watch for the front lifting. Stop at the first thing that bends, slips or creaks.
4. Walk the loaded ramp with sandbags at mid span and at the hinge.
5. Roll it loaded over the surfaces you intend to use, at walking pace.

Passing these does not make it safe for a dog. It tells you the bench carrier is worth showing to an engineer and to the dog's vet, which is the next step in assembly.md.
