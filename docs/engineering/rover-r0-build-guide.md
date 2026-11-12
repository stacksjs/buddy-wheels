# Buddy Rover r0 build guide

Configuration rover-r0-l1200-w700-h950-r900-a520-g980-hub101.6-trail-swivel311. All dimensions mm unless marked. Read this once to the end before ordering anything.

**What this builds.** A bench carrier for checking fit, handling and the ramp with sandbags. It has no load rating, no brake beyond wheel chocks and no test behind it. Do not put a dog in it until the release gates at the end are met.

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
3. This guide is for 1200 x 700 x 950 clear, a 900 ramp at 8.9 degrees, 15 inch trail wheel, 4.00-8s and a swivel front caster.

## 3. Order in this sequence

Order the wheel and caster first, because two dimensions in the design come from them.

| Step | What | Where | Quantity | Notes |
| --- | --- | --- | --- | --- |
| A | Rear wheel | [Zoro Select 1NWV4](https://www.zoro.com/zoro-select-pneumatic-wheel-15-316dia-435lb-400-8-1nwv4/i/G1932594/), $32.89 each | 2 | When they arrive, measure the hub from bearing face to bearing face. If it is not 101.6, enter the real number in the studio and download the kit again before cutting axles |
| A | Front caster | [Harbor Freight 63799](https://www.harborfreight.com/10-in-pneumatic-swivel-caster-63799.html), $19.99. Or [CasterHQ CB-SPC10](https://casterhq.com/products/10-swivel-pneumatic-caster-4-ply-350-lbs-capacity), $79.00, whose maker states a 12-1/4 inch height | 1 | Measure from the floor to the top of the mounting plate with the wheel trailing. This guide assumes 311. If yours differs, enter it in the studio: it sets the nose post length |
| B | Gussets and hangers | A laser-cutting service. [SendCutSend](https://sendcutsend.com) lists both materials, accepts DXF, has no minimum quantity and ships laser parts in 1 to 3 days | 40 x corner_gusset.dxf and 8 x tee_gusset.dxf in 0.125 inch 6061-T6 aluminum. 4 x axle_hanger_mid.dxf in 0.125 inch 304 stainless | Upload the three DXF files from the metal folder, pick material and thickness, enter quantities. Add their deburring service or file the edges yourself |
| C | Chassis tube, 1 x 1 x 1/8 inch 6061-T6 | [Metals Depot T3118-6061](https://www.metalsdepot.com/aluminum-products/aluminum-square-tube), 8 ft at $58.08 | 5 bars | 8 ft is the longest that ships by parcel. Longer bars are cheaper per foot but come by truck |
| C | Cabin tube, 1 x 1 x 1/16 inch 6063-T52 | [Metals Depot T31116](https://www.metalsdepot.com/aluminum-products/aluminum-square-tube), 8 ft at $41.60 | 7 bars | Do not swap this softer tube into the chassis positions |
| D | Bolts, nuts, washers | [Bolt Depot](https://boltdepot.com/Product-Details?product=328): 1/4-20 x 2 inch grade 5 zinc hex bolt 328, lock nut 2624, SAE washer 2976 | 2 boxes of 100 bolts, 2 of nuts, 4 of washers | You need 162 bolts, plus 4 at 3 inch long for the handle and 4 at 5/16-18 x 2-1/2 inch for the caster |
| D | Sleeve tube | A metal supplier: 4130 or DOM steel tube, 3/8 inch OD x .049 wall | 4.6 m | Cut into 170 sleeves, each 25.4 long. Price not verified |
| D | Axle parts | Hardware store or metal supplier: 5/8 inch plain steel rod; 3/4 inch OD x .058 wall steel tube; 5/8 inch washers; 1/8 inch cotter pins | 350 of rod, 85 of tube, 4 washers, 4 cotters | Never use threaded rod as an axle. Prices not verified |
| E | Plywood | [Home Depot 15/32 inch ACX sanded pine](https://www.homedepot.com/b/Lumber-Composites-Plywood/15-32/N-5yc1vZbqm7Z1z0mcqq), $52.00 a sheet | 1 | Floor 1250.8 x 750.8 and ramp 900 x 688. Plus exterior sealer |
| F | Small hardware | Hardware store or online. Prices not verified | Stainless continuous hinge about 24 inch; 2 stainless draw latches; 4 leveling feet 3/8-16 (2 with a 4 inch stem for the tip-stops, 2 short ones for the ramp legs); 2 threaded inserts for 1 inch square tube, 3/8-16; 16 carriage bolts 1/4-20 x 2 inch; 27 rivet nuts and flat-head screws 1/4-20; one 12.7 mm aluminum tube 1250.8 long; foam grip; 2 wheel chocks; about 9 m of 3 mm bedding tape | One 3/8-16 swivel foot with a 4 inch stem was seen at $6.49 on a search listing |
| G | Cover materials | See buy-list.md for every line with its link | | Cut list in cover-cut-schedule.csv |
| H | Filament | Any PETG for fit trials, ASA for parts left in the sun | About 1 kg | 72 printed pieces in all |

Materials for one build come to about $1,750.04 before tax and shipping. buy-list.md splits that into prices read on a supplier page and allowances.

## 4. Tools

- Miter saw with a non-ferrous metal blade, or a hacksaw with a miter box. Two clamps. A file or deburring tool.
- Drill press if you can get one; a hand drill with a drill guide block works. Center punch and hammer.
- Drill bits: 1/8 inch for pilots, letter W (0.386 inch, 9.8 mm) for sleeve holes, 17/64 inch for plain bolt holes, 3/8 inch for the tip-stop stems, a 3/4 inch step bit or hole saw for the axle sleeve, 7/16 inch for the caster bolts.
- Tape measure, steel rule, combination square, calipers, a fine marker and a scriber.
- Two 7/16 inch wrenches or a wrench and socket. Rivet nut setter. Jigsaw for the plywood.
- A 3D printer with a bed of at least 220 x 220 mm.
- Safety glasses and hearing protection. Aluminum chips are sharp and hot.

## 5. Print first

Print in this order, because the first pieces are tools for the rest.

1. coupon.stl. Measure its holes with calipers. If the 6.75 hole is off by more than 0.2, adjust your slicer before printing anything else.
2. guide_butt.stl, guide_run.stl and guide_tee.stl. These are the drill guides.
3. One cap_heavy.stl and one cap_light.stl. Try them in an offcut of each tube.
4. The rest: 12 x cap_heavy.stl, 12 x cap_light.stl, 3 x ramp_toe.stl, 3 x ridge_saddle.stl, 28 x fabric_clip.stl, 6 x cable_clip.stl, 4 x axle_cover.stl.

Files named FIT_CHECK_ONLY are plastic copies of the metal plates. Print one of each to rehearse a joint. They never go in the carrier.

## 6. Cut the tube

Cut the long pieces first. Clamp the bar, cut square, and leave the saw 3 mm per cut. Deburr both ends inside and out. Write the ID on each piece as it comes off the saw. Cut pairs to the same stop so they match each other exactly; matching matters more than the absolute length.

Chassis tube, 1/8 inch wall, from 5 bars of 8 ft:

| Bar | Pieces, ID and length | Offcut |
| --- | --- | ---: |
| 1 | C01 1578.65, C16 750.8, C08 82.0748 | 17.8752 |
| 2 | C01 1578.65, C16 750.8, C08 82.0748 | 17.8752 |
| 3 | C03 965.2, C03 965.2, C15 174.3, C15 174.3 | 147.4 |
| 4 | C06 900, C06 900, C15 174.3, C15 174.3 | 277.8 |
| 5 | C02 700, C02 700 | 1032.4 |

Cabin tube, 1/16 inch wall, from 7 bars of 8 ft:

| Bar | Pieces, ID and length | Offcut |
| --- | --- | ---: |
| 1 | C10 1250.8, C12 965.4 | 216.2 |
| 2 | C10 1250.8, C12 965.4 | 216.2 |
| 3 | C09 965.2, C09 965.2 | 502 |
| 4 | C09 965.2, C09 965.2 | 502 |
| 5 | C13 750.8, C11 700, C11 700 | 278.6 |
| 6 | C11 700, C14 700, C14 700 | 329.4 |
| 7 | C14 700, C07 688, C07 688 | 353.4 |

| ID | Member | Qty | Cut |
| --- | --- | ---: | ---: |
| C01 | Base side rail | 2 | 1578.65 |
| C02 | Base end cross member | 2 | 700 |
| C03 | Axle post | 2 | 965.2 |
| C06 | Ramp side curb rail | 2 | 900 |
| C07 | Ramp under rib | 2 | 688 |
| C08 | Ramp stand leg | 2 | 82.0748 |
| C09 | Corner post | 4 | 965.2 |
| C10 | Top side rail | 2 | 1250.8 |
| C11 | Top cross tube | 3 | 700 |
| C12 | Handle arm | 2 | 965.4 |
| C13 | Handle grip tube | 1 | 750.8 |
| C14 | Base intermediate cross member | 3 | 700 |
| C15 | Nose post | 4 | 174.3 |
| C16 | Caster beam | 2 | 750.8 |

Then cut 170 sleeves 25.4 long from the 3/8 inch steel tube, 2 axle sleeves 25.4 long and 2 wheel spacers 12.7 long from the 3/4 inch tube, and the axles: 2 at 168.75. Square and deburr every one. A sleeve that is short lets the tube crush; one that is long keeps the plate from seating.

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
| vertical | 289.05, 349.05, 610.4, 670.4, 901.75, 961.75 | Intermediate cross member tee gussets, underneath |
| side | 515.4, 575.4 | Axle hanger bar |
| side | 1173.1, 1203.1 | Front corner post gusset |
| vertical | 1158.1, 1188.1 | Front cross member gusset, underneath |
| side | 1347.95, 1377.95, 1533.65, 1563.65 | Nose post gussets. Posts stand at 1412.95 and 1498.65 |

Wait to drill the axle sleeve holes in the axle posts until a hanger plate is in your hand: clamp the hanger to the post, mark through its large hole, and drill to that mark.

## 8. Assemble the base flat

Work on a flat floor or table.

1. Lay the two C01 rails parallel, 725.4 apart center to center, rear ends level.
2. Set the two C02 end cross members between them, one at the rear end and one with its center 1238.1 from the rear end. Slide a corner gusset under each of the four corners, long-hole leg along the rail. Drop bolts down through tube, sleeve and plate with a washer under the head; add washer and lock nut underneath. Leave them finger tight.
3. Set the 3 C14 cross members at 319.05, 640.4, 931.75 from the rear end, each with a tee gusset under each end, the stem along the cross member.
4. Measure both diagonals of the rectangle. Tap the frame until they match within 2 mm. Then tighten every bolt until the lock nut is fully engaged and the plate is clamped. Do not crush the tube; the sleeves set the limit. No torque figure is given because none has been validated.
5. Stand each C03 axle post on a rail at 545.4 from the rear end, a hanger on each side face, bar along the rail, stem up the post. Bolt the bar to the rail and the stem to the post. Fit the 3/4 inch axle sleeve through hanger, post and hanger.

The base now stands on its own and has the shape in base-plan.svg.

## 9. Wheels and nose

1. Slide each rear axle through its sleeve from inside. From the inside out the order is cotter, washer, inner hanger, post, outer hanger, spacer, wheel, washer, cotter. The stack between washer faces should be 149.05 with about 0.5 of end float. Spin the wheel. It must not rub the hanger.
2. Stand the four C15 nose posts on the rail extensions at 1412.95 and 1498.65 from the rear end. Each gets a corner gusset on both side faces, the rail leg pointing away from the other post.
3. Lay the two C16 caster beams across the post tops, ends flush with the outside of the rails. Tie each beam to its two posts with one corner gusset on the outside face.
4. Hold the caster up under the beams on the centerline with its plate spanning both. Mark its four holes, drill 7/16 inch through each beam with a sleeve, and bolt it on.
5. Roll the frame. It should steer by pushing the handle end sideways and the caster should swing a full circle without touching the cabin front or the posts.

## 10. Cabin frame

1. Stand the four C09 corner posts on the rail ends, one corner gusset on the outside face of each, long-hole leg up the post.
2. Lay the two C10 top rails on the posts. Corner gussets on the outside face at each corner post, a pair at each axle post.
3. Fit the three C11 top cross tubes: front and rear with a corner gusset on top at each end, the middle one over the axle posts with a tee gusset on top.
4. Check the frame for square in both directions before the final tightening.
5. Clip the three ridge saddles over the top cross tubes at the centerline and lay the 12.7 mm ridge tube in them.

## 11. Floor

1. Cut the floor panel 1250.8 x 750.8. Notch 44 x 30 at each of the six posts.
2. Seal every face and edge, including the notches, and let it cure.
3. Stick bedding tape along the rails and cross members between the plates.
4. Set rivet nuts in the tube tops about every 250 and fasten the floor down with flat-head screws.

## 12. Ramp and tailgate

1. Cut the ramp panel 900 x 688 and seal it.
2. Bolt the two C06 curb rails on top along the long edges with carriage bolts, smooth heads underneath.
3. Bolt the two C07 ribs underneath, one 40 from the hinge edge and one at mid length.
4. Fit the two C08 stand legs under the hinge-end rib, 60 in from each end, a corner gusset on both faces of the rib. Press a threaded insert into each leg and screw in a leveling foot. The leg bolts leave about 30 of clear bore, so cut the foot stem short if it bottoms out.
5. Screw the hinge to the top face of the floor edge and the top face of the ramp, with a 6 gap between the panels.
6. Lower the ramp on level ground and turn the stand feet until both touch and the hinge is not being levered.
7. Stick the traction sheet between the curbs, stopping 18 short of the ground edge, and slide the three printed toes onto that edge with a bead of sealant.
8. Raise the ramp. Fit the two draw latches to the rear posts and the safety strap as a separate, second hold.

## 13. Handle, tip-stops and parking

1. Bolt each C12 handle arm to the outside of a rear corner post and an axle post with one 3 inch bolt per post, 980 above the ground.
2. Fit the C13 grip tube between the arm ends with a corner gusset above and below each end. Slide on the foam grip.
3. Screw a leveling foot with a 4 inch stem up through each base rail at 142.7 from the rear end, a nut and washer above and below. Set the pads about 40 above the ground.
4. There is no wheel brake. Chock both rear wheels every time the carrier is parked and before the ramp comes down.

## 14. Cover

Cut the 18 blanks in cover-cut-schedule.csv. Sew and seal as described in materials.md. Hang the cover with the printed rail clips and the hook-and-loop tabs.

## 15. Before any load

1. Check every bolt has a sleeve, two washers and a lock nut with thread showing.
2. Push, pull and rack the empty frame by hand. Nothing should shift or click.
3. Load sandbags in four steps up to the weight of the dog, in the middle of the floor. Look at the floor, the axle posts and the hangers at each step. Then move the bags to the tailgate end and watch for the front lifting. Stop at the first thing that bends, slips or creaks.
4. Walk the loaded ramp with sandbags at mid span and at the hinge.
5. Roll it loaded over the surfaces you intend to use, at walking pace.

Passing these does not make it safe for a dog. It tells you the bench carrier is worth showing to an engineer and to the dog's vet, which is the next step in assembly.md.
