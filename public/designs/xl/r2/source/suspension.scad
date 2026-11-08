// XL r2 undamped die-spring BENCH candidate, millimeters. No animal-use rating.
// Frozen r1 profiles/service parts are reused. Latest module definitions below
// replace rigid assembly/metal dispatch; original top-level assembly invokes them.
include <rigid.scad>
outer=31.75; travel_max=8; carriage_len=220;
housing_len=height-tube/2-R-55;
base=R-45; housing_bottom=R+55-travel;
lower_seat=R+175; upper_seat=R+175+plate+75-travel;
module rail_shim_profile(){difference(){square([100,25.4],center=true);for(x=[-30,30])translate([x,0])circle(d=6.75);}}
module spring_seat_profile(){difference(){square([27.8,27.8],center=true);circle(d=5.5);}}
module metal(name){if(projection_mode)profile(name);else linear_extrude(plate)profile(name);}
module profile(name){if(name=="joint_plate")joint_profile();else if(name=="axle_plate")axle_profile();else if(name=="rail_shim")rail_shim_profile();else spring_seat_profile();}
module square_tube(od,len){difference(){translate([-od/2,-od/2,0])cube([od,od,len]);translate([-od/2+wall,-od/2+wall,-eps])cube([od-2*wall,od-2*wall,len+2*eps]);}}
module carriage(){difference(){square_tube(tube,220);for(z=[20,70])translate([0,0,z])rotate([90,0,0])cylinder(d=9.725,h=40,center=true);translate([0,0,45])rotate([90,0,0])cylinder(d=19.25,h=40,center=true);hull()for(z=[147,155])translate([0,0,z])rotate([90,0,0])cylinder(d=8.2,h=40,center=true);}}
module housing(){difference(){square_tube(outer,housing_len);for(z=[55,205.35])translate([0,0,z])rotate([90,0,0])cylinder(d=8.2,h=40,center=true);for(z=[housing_len-22.3,housing_len-47.3])translate([0,0,z])rotate([90,0,0])cylinder(d=9.725,h=40,center=true);}}
module retaining_pin(){color("silver")rotate([90,0,0])cylinder(d=8,h=45,center=true);color("silver")translate([0,24.5,0])rotate([90,0,0])cylinder(d=14,h=4,center=true);color("silver")translate([0,-20,0])cylinder(d=2,h=18,center=true);for(y=[-16.625,16.625])color("silver")translate([0,y,0])rotate([90,0,0])difference(){cylinder(d=16,h=1.5,center=true);cylinder(d=8.4,h=3,center=true);}}
// Envelope helix for inspection only; rectangular-wire spring supplied by MISUMI.
module coil(len){color("#daae38")translate([0,0,2.5])linear_extrude(height=len-5,twist=7*360,slices=168)translate([7.5,0])circle(r=2.5,$fn=12);}
module r2_bolt(grip,long=false,sleeve_length=0){color("silver")rotate([90,0,0])cylinder(d=6.35,h=long?57.15:50.8,center=true);color("#64736a")rotate([90,0,0])difference(){cylinder(d=sleeve,h=sleeve_length>0?sleeve_length:grip,center=true);cylinder(d=sleeve-2*sleeveWall,h=(sleeve_length>0?sleeve_length:grip)+1,center=true);}for(sign=[-1,1]){color("silver")translate([0,sign*(grip/2+plate+0.75),0])rotate([90,0,0])difference(){cylinder(d=14,h=1.5,center=true);cylinder(d=6.75,h=3,center=true);}color("silver")translate([0,sign*(grip/2+plate+4),0])rotate([90,0,0])cylinder(d=11,h=sign==1?4:6.35,center=true,$fn=6);}}
module assembly(){
for(side=[-1,1]){
y=side*width/2; zheight=height-travel;
color("#b4bfb8")translate([-(rail-200),y,zheight])rail_tube();
// Cutaway is inspection only. Exported model defaults to complete outer housing.
color("#83958a",0.65)translate([0,y,housing_bottom])housing();
color("#bdc6c0")translate([0,y,base])carriage();
for(sign=[-1,1]){
color("#536358")translate([0,y+sign*(outer/2+plate/2)+plate/2,zheight])rotate([90,0,0])metal("joint_plate");
color("#536358")translate([0,y+sign*(tube/2+plate/2)+plate/2,zheight])rotate([90,0,0])metal("rail_shim");
color("#536358")translate([0,y+sign*(tube/2+plate/2)+plate/2,R])rotate([90,0,0])metal("axle_plate");
color("#536358")translate([120,y,zheight+sign*(tube/2+plate/2)-plate/2])scale([1,side,1])metal("joint_plate");
}
for(x=[-30,30])translate([x,y,zheight])r2_bolt(outer,true,tube);
for(z=[-35,-60])translate([0,y,zheight+z])r2_bolt(outer,true);
for(x=[90,150])translate([x,y,zheight])rotate([90,0,0])r2_bolt(tube);
for(step=[35,60])translate([120,y-side*step,zheight])rotate([90,0,0])r2_bolt(tube);
for(z=[-25,25])translate([0,y,R+z])r2_bolt(tube);
for(z=[R+110-travel,R+260.35-travel])translate([0,y,z])retaining_pin();
color("#536358")translate([0,y,lower_seat])metal("spring_seat");
color("#536358")translate([0,y,upper_seat])metal("spring_seat");
translate([0,y,lower_seat+plate])coil(75-preload-travel);
if(preload>0)color("silver")translate([0,y,upper_seat-preload])difference(){cylinder(d=20,h=preload);cylinder(d=10,h=preload+eps);}
color("silver")translate([0,y,lower_seat+plate])difference(){cylinder(d=9.525,h=55);cylinder(d=7.0358,h=56);}
color("silver")translate([0,y,lower_seat-10.825])cylinder(d=5,h=70);
color("silver")translate([0,y,lower_seat+plate+55])difference(){cylinder(d=9,h=1);cylinder(d=5.3,h=2);};
color("silver")translate([0,y,lower_seat+plate+56])cylinder(d=8.5,h=5);
color("silver")translate([0,y,lower_seat-6])difference(){cylinder(d=9.24,h=5,$fn=6);cylinder(d=5,h=6);}
color("silver")translate([0,y,lower_seat-1])difference(){cylinder(d=10,h=1);cylinder(d=5.3,h=2);}
for(z=[120,180])for(face=[0:3])color("#e5e6d9")translate([0,y,base+z])rotate([0,0,90*face])difference(){translate([-9,12.7,0])cube([18,1.27,35]);if(z==120&&(face==0||face==2))hull()for(k=[27,35])translate([0,0,k])rotate([90,0,0])cylinder(d=8.2,h=40,center=true);}
color("#64736a")translate([0,y,R])large_sleeve(tube);
color("#64736a")translate([0,y+side*(tube/2+plate+spacer/2),R])large_sleeve(spacer);
start=-(tube/2+plate+1.5+9.6+0.25);
color("silver")translate([0,y+side*start,R])scale([1,side,1])cross_shaft();
for(end=[start+8,start+shaft-8])color("silver")translate([0,y+side*end,R])cylinder(d=cotter,h=24,center=true);
for(wy=[-(tube/2+plate+washer/2),tube/2+plate+spacer+hub+washer/2])color("silver")translate([0,y+side*wy,R])rotate([90,0,0])difference(){cylinder(d=28,h=washer,center=true);cylinder(d=axle+0.3,h=washer+1,center=true);}
translate([0,y+side*offset,R])wheel_model();
for(x=[-(rail-200),200])color("#254b38")translate([x+(x<0?-3:3),y,zheight])rotate([0,x<0?90:-90,0])end_cap();
color("#254b38")translate([0,y,R-48])end_cap();
}
color("#b4bfb8")translate([120,-width/2+tube/2,height-travel])bridge_tube();
}
if(part=="rail_shim"||part=="spring_seat")metal(part);
