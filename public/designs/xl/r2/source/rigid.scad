// XL r1 rigid standard-stock bench design. Not for animal use.
// millimeters; configured wrapper supplies height,width,rail,hub.
part="assembly";
projection_mode=false;
$fn=64;
eps=0.02;

R=wheel/2; post=height-tube/2-R+45;
bridge=width-tube; offset=tube/2+plate+spacer+hub/2;
stack=tube+2*plate+spacer+hub+2*washer;
shaft=stack+0.5+2*(8+cotter/2);
module joint_profile(){difference(){offset(r=2)offset(delta=-2)polygon([[-50,20],[50,20],[50,-20],[20,-20],[20,-75],[-20,-75],[-20,-20],[-50,-20]]);for(p=[[-30,0],[30,0],[0,-35],[0,-60]])translate(p)circle(d=6.75);}}
module axle_profile(){difference(){offset(r=3)square([44,84],center=true);circle(d=19.25);for(y=[-25,25])translate([0,y])circle(d=6.75);}}
module metal(name){if(projection_mode){if(name=="joint_plate")joint_profile();else axle_profile();}else linear_extrude(plate){if(name=="joint_plate")joint_profile();else axle_profile();}}
module end_cap(){difference(){union(){linear_extrude(3)offset(r=2)square([tube,tube],center=true);translate([-(tube-2*wall-0.5)/2,-(tube-2*wall-0.5)/2,3-eps])cube([tube-2*wall-0.5,tube-2*wall-0.5,12]);}translate([-(tube-2*wall-3.5)/2,-(tube-2*wall-3.5)/2,3])cube([tube-2*wall-3.5,tube-2*wall-3.5,14]);}}
module axle_cover(){difference(){union(){cylinder(d=40,h=8);translate([0,0,8])cylinder(d1=40,d2=32,h=4);}translate([0,0,-eps])cylinder(d=28,h=9);}}
module drill_guide(){difference(){translate([-18,-18,0])cube([36,36,85]);translate([-12.9,-12.9,-eps])cube([25.8,25.8,86]);for(z=[25,50])translate([0,0,z])rotate([90,0,0])cylinder(d=3,h=40,center=true);translate([12,-4,-eps])cube([8,8,86]);}}
module coupon(){difference(){cube([100,35,8]);for(i=[0:3])translate([12+25*i,17.5,-eps])cylinder(d=6.45+i*0.15,h=9);}}
module sqtube(len){difference(){translate([-tube/2,-tube/2,0])cube([tube,tube,len]);translate([-tube/2+wall,-tube/2+wall,-eps])cube([tube-2*wall,tube-2*wall,len+2*eps]);}}
module rail_tube(){difference(){rotate([0,90,0])sqtube(rail);for(x=[rail-230,rail-170])translate([x,0,0])rotate([90,0,0])cylinder(d=9.725,h=40,center=true);for(x=[rail-110,rail-50])translate([x,0,0])cylinder(d=9.725,h=40,center=true);}}
module post_tube(){difference(){sqtube(post);for(z=[post-22.3,post-47.3,20,70])translate([0,0,z])rotate([90,0,0])cylinder(d=9.725,h=40,center=true);translate([0,0,45])rotate([90,0,0])cylinder(d=19.25,h=40,center=true);}}
module bridge_tube(){difference(){rotate([-90,0,0])sqtube(bridge);for(y=[22.3,47.3,bridge-47.3,bridge-22.3])translate([0,y,0])cylinder(d=9.725,h=40,center=true);}}
module cross_shaft(){difference(){rotate([-90,0,0])cylinder(d=axle,h=shaft);for(y=[8,shaft-8])translate([0,y,0])cylinder(d=3.2,h=25,center=true);}}
module wheel_model(){rotate([90,0,0]){color("#29322d")difference(){cylinder(d=wheel,h=tire,center=true);cylinder(d=180,h=tire+1,center=true);}color("#64736a")cylinder(d=180,h=10,center=true);color("silver")difference(){cylinder(d=36,h=hub,center=true);cylinder(d=axle,h=hub+1,center=true);}}}
module joint_bolt(){
 color("silver")rotate([90,0,0])cylinder(d=6.35,h=50.8,center=true);
 color("#64736a")rotate([90,0,0])difference(){cylinder(d=sleeve,h=tube,center=true);cylinder(d=sleeve-2*sleeveWall,h=tube+1,center=true);}
 for(sign=[-1,1])color("silver")translate([0,sign*16.625,0])rotate([90,0,0])difference(){cylinder(d=14,h=1.5,center=true);cylinder(d=6.75,h=3,center=true);}
 color("silver")translate([0,20,0])rotate([90,0,0])cylinder(d=11,h=4,center=true,$fn=6);
 color("silver")translate([0,-21,0])rotate([90,0,0])cylinder(d=11,h=6.35,center=true,$fn=6);
}
module large_sleeve(len){rotate([90,0,0])difference(){cylinder(d=axleSleeve,h=len,center=true);cylinder(d=axleSleeve-2*axleSleeveWall,h=len+1,center=true);}}
module assembly(){
for(side=[-1,1]){
y=side*width/2;
color("#b4bfb8")translate([-(rail-200),y,height])rail_tube();
color("#b4bfb8")translate([0,y,R-45])post_tube();
for(sign=[-1,1]){
 color("#b4bfb8")translate([0,y+sign*(tube/2+plate/2)+plate/2,height])rotate([90,0,0])metal("joint_plate");
 color("#b4bfb8")translate([0,y+sign*(tube/2+plate/2)+plate/2,R])rotate([90,0,0])metal("axle_plate");
 color("#b4bfb8")translate([120,y,height+sign*(tube/2+plate/2)-plate/2])scale([1,side,1])metal("joint_plate");
}
for(x=[-30,30])translate([x,y,height])joint_bolt();
for(z=[-35,-60])translate([0,y,height+z])joint_bolt();
for(x=[90,150])translate([x,y,height])rotate([90,0,0])joint_bolt();
for(step=[35,60])translate([120,y-side*step,height])rotate([90,0,0])joint_bolt();
for(z=[-25,25])translate([0,y,R+z])joint_bolt();
color("#64736a")translate([0,y,R])large_sleeve(tube);
color("#64736a")translate([0,y+side*(tube/2+plate+spacer/2),R])large_sleeve(spacer);
// Nominal smooth shaft and positive cross-hole datums, not a turned custom spindle.
start=-(tube/2+plate+1.5+9.6+0.25);
color("silver")translate([0,y+side*start,R])scale([1,side,1])cross_shaft();
for(end=[start+8,start+shaft-8])color("silver")translate([0,y+side*end,R])cylinder(d=cotter,h=24,center=true);
for(wy=[-(tube/2+plate+washer/2),tube/2+plate+spacer+hub+washer/2])color("silver")translate([0,y+side*wy,R])rotate([90,0,0])difference(){cylinder(d=28,h=washer,center=true);cylinder(d=axle+0.3,h=washer+1,center=true);}
translate([0,y+side*offset,R])wheel_model();
for(x=[-(rail-200),200])color("#254b38")translate([x+(x<0?-3:3),y,height])rotate([0,x<0?90:-90,0])end_cap();
color("#254b38")translate([0,y,R-48])end_cap();
}
color("#b4bfb8")translate([120,-width/2+tube/2,height])bridge_tube();
}
if(part=="assembly")assembly();
else if(part=="joint_plate"||part=="axle_plate")metal(part);
else if(part=="end_cap")end_cap();
else if(part=="axle_cover")axle_cover();
else if(part=="drill_guide")drill_guide();
else if(part=="coupon")coupon();
