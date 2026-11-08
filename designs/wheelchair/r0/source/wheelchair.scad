// Buddy Wheels r0. Units: mm. BENCH PROTOTYPE, NOT AN ANIMAL-USE RELEASE.
// Parameters are supplied by each family's model.scad. See README and BOM.
$fn=48;
part = "assembly";
setting = 1;
angle = 0;
locked = false;
explode = 0;
projection_mode = false;
eps=0.05;
R=wheel/2;
E=shock_neutral;
maxr=radii[2];
plate_outer=gap/2+plate;
arm_y=eye_width/2+arm_plate/2;

module disc_hull(points,r) { hull() for(p=points) translate(p) circle(r); }
module hole(p,d) { translate(p) circle(d=d); }
module slot(a,b,d) { hull() { hole(a,d); hole(b,d); } }
module fixed_profile() {
 difference() {
  polygon([[-18,-22],[lock_r+12,-22],[maxr+15,E-18],[maxr+15,E+15],[-18,E+15]]);
  hole([0,0],pivot+0.2);
  for(z=[35,65]) hole([0,z],frame_bolt+0.4);
  for(r=radii) hole([r,E],eye_bolt+0.2);
  hole([lock_r,0],lock_bolt+0.2);
  // The end caps are the mechanical stops. Clearance adds angular play.
  for(a=[-3:0.5:5.5]) slot([stop_r*cos(a),stop_r*sin(a)],
   [stop_r*cos(a+0.5),stop_r*sin(a+0.5)],stop_bolt+0.4);
 }
}
module arm_profile() {
 difference() {
  disc_hull([[0,0],[arm,0]],12);
  hole([0,0],pivot_bore);
  hole([arm,0],axle+0.2);
  for(r=radii) hole([r,0],eye_bolt+0.2);
  hole([lock_r,0],lock_bolt+0.2);
  hole([stop_r,0],stop_bolt+0.2);
 }
}
module corner_profile() {
 difference() {
  polygon([[-78,14],[14,14],[14,-78],[-14,-78],[-14,-14],[-78,-14]]);
  for(p=[[-2*pitch,0],[-pitch,0],[0,-pitch],[0,-2*pitch]]) hole(p,frame_bolt+0.4);
 }
}
module sheet(profile="fixed") {
 if(projection_mode) {
  if(profile=="fixed") fixed_profile();
  if(profile=="arm") arm_profile();
  if(profile=="corner") corner_profile();
 } else linear_extrude(height=profile=="arm" ? arm_plate : plate) {
  if(profile=="fixed") fixed_profile();
  if(profile=="arm") arm_profile();
  if(profile=="corner") corner_profile();
 }
}
module square_tube(od,wall,len) {
 difference() {
  translate([-od/2,-od/2,0]) cube([od,od,len]);
  translate([-od/2+wall,-od/2+wall,-eps]) cube([od-2*wall,od-2*wall,len+2*eps]);
 }
}
module cap(od=tube,w=wall) {
 id=od-2*w-0.4;
 difference() {
  union() {
   translate([-(od+4)/2,-(od+4)/2,0]) cube([od+4,od+4,3]);
   translate([-id/2,-id/2,3-eps]) cube([id,id,12+eps]);
  }
  translate([-(id-3)/2,-(id-3)/2,3]) cube([id-3,id-3,13]);
  translate([0,0,-eps]) cylinder(d=3,h=4);
 }
}
module index_collar() {
 difference() {
  translate([-(tube+8)/2,-(tube+8)/2,0]) cube([tube+8,tube+8,12]);
  translate([-(tube+0.6)/2,-(tube+0.6)/2,-eps]) cube([tube+0.6,tube+0.6,13]);
  translate([tube/2,-3,4]) cube([6,6,9]);
 }
}
module pivot_guard() {
 difference() {
  cylinder(d=40,h=7);
  translate([0,0,-eps]) cylinder(d=pivot+7,h=8);
  // Cover is a removable loose shield, not a bearing or fastener retainer.
  translate([-25,-2,3]) cube([50,4,6]);
 }
}
module drill_jig() {
 difference() {
  translate([-tube/2-5,-tube/2-5,0]) cube([tube+10,tube+10,85]);
  translate([-tube/2-0.3,-tube/2-0.3,-eps]) cube([tube+0.6,tube+0.6,86]);
  for(z=[20,20+pitch]) translate([0,0,z]) rotate([90,0,0]) cylinder(d=frame_bolt+0.4,h=tube+12,center=true);
  translate([tube/2,-4,-eps]) cube([6,8,86]);
 }
}
module coupon() {
 difference() {
  cube([90,35,8]);
  for(i=[0:3]) translate([12+i*20,17.5,-eps]) cylinder(d=frame_bolt+[0.1,0.2,0.3,0.4][i],h=9);
 }
}
module shock_dummy() {
 // Rigid eye-distance gauge. It contains no spring/damping and carries no load.
 linear_extrude(eye_width) difference() {
  disc_hull([[0,0],[E,0]],eye_bolt/2+8);
  hole([0,0],eye_bolt+0.4);
  hole([E,0],eye_bolt+0.4);
 }
}
module profile_in_xz(kind,t,y) {
 translate([0,y+t/2,0]) rotate([90,0,0]) linear_extrude(t) {
  if(kind=="fixed") fixed_profile();
  if(kind=="arm") arm_profile();
  if(kind=="corner") corner_profile();
 }
}
module pin_y(x,z,d,len) {
 translate([x,0,z]) rotate([90,0,0]) cylinder(d=d,h=len,center=true);
}
module shock_model() {
 r=radii[setting];
 bottom=[r*cos(angle),0,r*sin(angle)];
 top=[r,0,E];
 vec=top-bottom; len=norm(vec);
 translate(bottom) rotate([0,atan2(vec[0],vec[2]),0]) {
  color("silver") cylinder(d=eye_bolt+8,h=len);
  color([0.24,0.28,0.27]) translate([0,0,len*0.28]) cylinder(d=shock_od,h=len*0.46);
 }
 color("silver") {pin_y(top[0],top[2],eye_bolt,gap+2*plate+8);
 pin_y(bottom[0],bottom[2],eye_bolt,eye_width+2*arm_plate+8);}
}
module suspension() {
 for(s=[-1,1]) color([0.55,0.60,0.62]) profile_in_xz("fixed",plate,s*(gap/2+plate/2+explode));
 rotate([0,-angle,0]) {
  for(s=[-1,1]) color([0.25,0.42,0.34]) profile_in_xz("arm",arm_plate,s*(arm_y+explode));
  color("silver") {pin_y(arm,0,axle,eye_width+2*arm_plate+60);
   pin_y(stop_r,0,stop_bolt,gap+2*plate+8);}
 }
 color("silver") pin_y(0,0,pivot,gap+2*plate+8);
 if(locked) color([0.19,0.37,0.28]) pin_y(lock_r,0,lock_bolt,gap+2*plate+12);
 shock_model();
}
module wheel_model() {
 rotate([90,0,0]) {
  color([0.12,0.14,0.13]) difference() {cylinder(d=wheel,h=tire_width,center=true); cylinder(d=wheel-30,h=tire_width+1,center=true);}
  color([0.65,0.67,0.65]) difference() {cylinder(d=wheel-28,h=6,center=true); cylinder(d=wheel-45,h=7,center=true);}
  color("silver") cylinder(d=30,h=hub_width,center=true);
  for(a=[0:30:330]) color("silver") rotate([0,0,a]) translate([-1,0,-1]) cube([2,wheel/2-17,2]);
 }
}
module assembly() {
 // No dog is depicted. Softgoods are not a fitted harness pattern.
 for(side=[-1,1]) translate([0,side*width/2,0]) {
  color([0.72,0.75,0.74]) {
   translate([0,0,R+25]) square_tube(tube,wall,height-R-(2*pitch+20)-25);
   translate([0,0,height-tube/2-inner_length]) square_tube(inner,inner_wall,inner_length);
   translate([-(rail-80),0,height]) rotate([0,90,0]) square_tube(tube,wall,rail);
  }
  for(s=[-1,1]) color([0.55,0.60,0.62]) translate([0,0,height]) profile_in_xz("corner",plate,s*(tube/2+plate/2));
  translate([0,0,R]) suspension();
  translate([arm*cos(angle),side*(wheel_offset+explode*2),R+arm*sin(angle)]) wheel_model();
  color([0.23,0.40,0.31]) translate([-(rail-80),0,height]) rotate([0,90,0]) cap();
 }
 color([0.72,0.75,0.74]) {
  translate([60,-width/2+tube/2,height]) rotate([-90,0,0]) square_tube(tube,wall,(width-tube)*0.7);
  translate([60,width/2-tube/2,height]) rotate([90,0,0]) square_tube(inner,inner_wall,(width-tube)*0.7);
 }
 // Four metal corner plates join the rear bridge, above and below its tubes.
 for(side=[-1,1],s=[-1,1]) color([0.55,0.60,0.62]) translate([60,side*width/2,height+s*(tube/2+plate/2)])
  scale([1,side,1]) linear_extrude(plate,center=true) corner_profile();
}
assert(setting>=0 && setting<=2 && setting==floor(setting),"setting must be 0, 1 or 2");
assert(angle>=-3 && angle<=6,"angle exceeds nominal bench stop range");
assert(!locked || angle==0,"neutral lock requires zero travel");
if(part=="fixed_plate") sheet("fixed");
else if(part=="arm_plate") sheet("arm");
else if(part=="corner_plate") sheet("corner");
else if(part=="tube_cap") cap();
else if(part=="inner_cap") cap(inner,inner_wall);
else if(part=="index_collar") index_collar();
else if(part=="pivot_guard") pivot_guard();
else if(part=="drill_jig") drill_jig();
else if(part=="coupon") coupon();
else if(part=="shock_dummy") shock_dummy();
else if(part=="suspension") suspension();
else if(part=="assembly") assembly();
else assert(false,"unknown part");
