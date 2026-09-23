/*
  Silhouette figures for the "How to" sheets.
  Poses are built from joint angles in degrees: 0 = pointing down,
  90 = pointing right (the way the figure faces), 180 = up, -90 = left.
  t = torso, ua/fa = upper arm/forearm, th/sh = thigh/shin, f = foot,
  hd = hand. 1 = near side, 2 = far side (drawn faded).
  a1/a2 (arms) or l1/l2 (legs) = {to:[x,y], bend:1 or -1} places a hand or
  foot at a point instead (the hip is at 0,0). front:true draws a front view.
*/
/* ---------- Figure engine: poses drawn from joint angles ---------- */
var FIGDIM={T:40,S:35,HN:12,HR:9.5,UA:23,FA:21,TH:30,SH:29,FT:9,HD:12};
function fdir(a){var r=a*Math.PI/180;return [Math.sin(r),Math.cos(r)];}
function fadd(p,d,l){return [p[0]+d[0]*l,p[1]+d[1]*l];}
function fang(v){return Math.atan2(v[0],v[1])*180/Math.PI;}
function fik(base,tgt,a,b,bend){
  if(!bend){var up=fik(base,tgt,a,b,1),dn=fik(base,tgt,a,b,-1);return up[0][1]>=dn[0][1]?up:dn;}
  var v=[tgt[0]-base[0],tgt[1]-base[1]],d=Math.hypot(v[0],v[1]);
  d=Math.min(d,a+b-0.01);d=Math.max(d,Math.abs(a-b)+0.01);
  var phi=fang(v),c=(a*a+d*d-b*b)/(2*a*d);c=Math.max(-1,Math.min(1,c));
  var al=Math.acos(c)*180/Math.PI;
  var el=fadd(base,fdir(phi+bend*al),a);
  var end=fadd(el,fdir(fang([tgt[0]-el[0],tgt[1]-el[1]])),b);
  return [el,end];
}
function fpose(p){
  var D=FIGDIM,tl=p.tl||1,t=p.t==null?180:p.t,td=fdir(t),front=!!p.front;
  var perp=[-Math.cos(t*Math.PI/180),Math.sin(t*Math.PI/180)];
  var H=[0,0],N=fadd(H,td,D.T*tl),Sh=fadd(H,td,D.S*tl);
  var head=fadd(N,fdir(p.h==null?t:p.h),p.hover?3:D.HN);
  var segs=[],dots=[];
  var sw=front?11:0,hw=front?6:0;
  function limb(i,base,kind){
    var A=kind==="arm"?D.UA:D.TH,B=kind==="arm"?D.FA:D.SH;
    var k1=kind==="arm"?"ua":"th",k2=kind==="arm"?"fa":"sh",ik=p[(kind==="arm"?"a":"l")+i];
    var j1,j2;
    if(ik){var r=fik(base,ik.to,A,B,ik.bend==null?1:ik.bend);j1=r[0];j2=r[1];}
    else{
      var d1=p[k1+i];if(d1==null)d1=p[k1];if(d1==null)d1=0;
      var d2=p[k2+i];if(d2==null)d2=p[k2];if(d2==null)d2=d1;
      j1=fadd(base,fdir(d1),A);j2=fadd(j1,fdir(d2),B);
    }
    var far=!front&&i===2;
    var pts=[base,j1,j2];
    if(kind==="leg"){var f=p["f"+i];if(f==null)f=p.f;if(f==null)f=90;pts.push(fadd(j2,fdir(f),D.FT));}
    else{var hd=p["hd"+i];if(hd==null)hd=p.hd;if(hd!=null){var e=fadd(j2,fdir(hd),D.HD);pts.push(e);j2=e;}}
    segs.push({pts:pts,w:kind==="arm"?9:11,far:far});
    if(kind==="arm"&&(p.db===true||(p.db==="one"&&i===1))){dots.push({c:j2,r:p.db==="one"?6.5:(p.hd1!=null||p.hd!=null?4:5),far:far});}
    return pts;
  }
  var sh1=fadd(Sh,perp,sw),sh2=fadd(Sh,perp,-sw),hp1=fadd(H,perp,hw),hp2=fadd(H,perp,-hw);
  limb(2,hp2,"leg");limb(2,sh2,"arm");
  segs.push({pts:[H,N],w:front?20:15,far:false,torso:true});
  limb(1,hp1,"leg");limb(1,sh1,"arm");
  // order: far limbs first, then torso, then near
  var far=segs.filter(function(s){return s.far;}),near=segs.filter(function(s){return !s.far;});
  var box=[1e9,1e9,-1e9,-1e9];
  function grow(pt,r){box[0]=Math.min(box[0],pt[0]-r);box[1]=Math.min(box[1],pt[1]-r);box[2]=Math.max(box[2],pt[0]+r);box[3]=Math.max(box[3],pt[1]+r);}
  segs.forEach(function(s){s.pts.forEach(function(pt){grow(pt,s.w/2);});});
  grow(head,D.HR);dots.forEach(function(d){grow(d.c,d.r);});
  (p.props||[]).forEach(function(pr){grow([pr.x,pr.y],1);grow([pr.x+(pr.w||0),pr.y+(pr.h||(pr.type==="dummy"?56:0))],1);});
  var sword=null;
  if(p.sword){
    var sw2=p.sword,ang=sw2.angle,len=sw2.len==null?66:sw2.len,guard=sw2.guard==null?8:sw2.guard;
    var hilt=sw2.hilt,dblade=fdir(ang),tip=fadd(hilt,dblade,len),pommel=fadd(hilt,dblade,-(sw2.grip==null?16:sw2.grip));
    var pp=[-dblade[1],dblade[0]];
    sword={hilt:hilt,tip:tip,pommel:pommel,g1:fadd(hilt,pp,guard),g2:fadd(hilt,pp,-guard)};
    grow(hilt,5);grow(tip,4);grow(pommel,4);grow(sword.g1,4);grow(sword.g2,4);
  }
  return {hover:!!p.hover,far:far,near:near,head:head,dots:dots,box:box,props:p.props||[],ground:p.ground!==false,sword:sword};
}
function fpath(pts){return "M"+pts.map(function(q){return q[0].toFixed(1)+" "+q[1].toFixed(1);}).join(" L");}
function figureFrames(fig){
  var W=150,Hh=140,pad=10;
  var ps=fig.frames.map(fpose);
  var s=1;
  ps.forEach(function(p){
    var bw=p.box[2]-p.box[0],bh=p.box[3]-p.box[1];
    s=Math.min(s,(W-2*pad)/bw,(Hh-2*pad-6)/bh);
  });
  return ps.map(function(p){
    var cx=(p.box[0]+p.box[2])/2,groundY=p.box[3];
    var tx=W/2-cx*s,ty=p.ground?(Hh-pad-4-groundY*s):(Hh/2-((p.box[1]+p.box[3])/2)*s);
    var g='<g transform="translate('+tx.toFixed(1)+' '+ty.toFixed(1)+') scale('+s.toFixed(3)+')">';
    p.props.forEach(function(pr){
      if(pr.type==="bench"){
        var bottom=groundY;
        g+='<rect x="'+pr.x+'" y="'+pr.y+'" width="'+pr.w+'" height="5" rx="2" style="fill:var(--fig-prop)"/>';
        g+='<rect x="'+(pr.x+3)+'" y="'+(pr.y+4)+'" width="4" height="'+(bottom-pr.y-4)+'" style="fill:var(--fig-prop)"/>';
        g+='<rect x="'+(pr.x+pr.w-7)+'" y="'+(pr.y+4)+'" width="4" height="'+(bottom-pr.y-4)+'" style="fill:var(--fig-prop)"/>';
      }else if(pr.type==="dummy"){
        var cx=pr.x+pr.w/2;
        g+='<rect x="'+(cx-3)+'" y="'+(pr.y+50)+'" width="6" height="'+(groundY-pr.y-50)+'" style="fill:var(--fig-prop)"/>';
        g+='<rect x="'+(cx-14)+'" y="'+(groundY-5)+'" width="28" height="5" rx="2" style="fill:var(--fig-prop)"/>';
        g+='<rect x="'+pr.x+'" y="'+(pr.y+19)+'" width="'+pr.w+'" height="36" rx="9" style="fill:var(--fig-prop)"/>';
        g+='<circle cx="'+cx+'" cy="'+(pr.y+9)+'" r="9" style="fill:var(--fig-prop)"/>';
        g+='<circle cx="'+cx+'" cy="'+(pr.y+35)+'" r="6" fill="none" stroke-width="2" style="stroke:var(--fig-db)"/>';
      }else if(pr.type==="bar"){
        g+='<line x1="'+pr.x+'" y1="'+pr.y+'" x2="'+(pr.x+pr.w)+'" y2="'+pr.y+'" stroke-width="4" stroke-linecap="round" style="stroke:var(--fig-prop)"/>';
      }
    });
    function draw(list,op){
      list.forEach(function(sg){
        g+='<path d="'+fpath(sg.pts)+'" fill="none" stroke-width="'+sg.w+'" stroke-linecap="round" stroke-linejoin="round" style="stroke:var(--fig)'+(op?';opacity:'+op:'')+'"/>';
      });
    }
    draw(p.far,0.42);
    p.dots.filter(function(d){return d.far;}).forEach(function(d){g+='<circle cx="'+d.c[0].toFixed(1)+'" cy="'+d.c[1].toFixed(1)+'" r="'+d.r+'" style="fill:var(--fig-db);opacity:.6"/>';});
    draw(p.near,0);
    g+='<circle cx="'+p.head[0].toFixed(1)+'" cy="'+p.head[1].toFixed(1)+'" r="'+FIGDIM.HR+'" style="fill:var(--fig)'+(p.hover?';stroke:var(--fig-bg);stroke-width:2':'')+'"/>';
    p.dots.filter(function(d){return !d.far;}).forEach(function(d){g+='<circle cx="'+d.c[0].toFixed(1)+'" cy="'+d.c[1].toFixed(1)+'" r="'+d.r+'" style="fill:var(--fig-db)"/>';});
    if(p.sword){
      var sw3=p.sword;
      g+='<line x1="'+sw3.pommel[0].toFixed(1)+'" y1="'+sw3.pommel[1].toFixed(1)+'" x2="'+sw3.hilt[0].toFixed(1)+'" y2="'+sw3.hilt[1].toFixed(1)+'" stroke-width="5.5" stroke-linecap="round" style="stroke:var(--fig-prop)"/>';
      g+='<line x1="'+sw3.g1[0].toFixed(1)+'" y1="'+sw3.g1[1].toFixed(1)+'" x2="'+sw3.g2[0].toFixed(1)+'" y2="'+sw3.g2[1].toFixed(1)+'" stroke-width="3.4" stroke-linecap="round" style="stroke:var(--fig-prop)"/>';
      g+='<line x1="'+sw3.hilt[0].toFixed(1)+'" y1="'+sw3.hilt[1].toFixed(1)+'" x2="'+sw3.tip[0].toFixed(1)+'" y2="'+sw3.tip[1].toFixed(1)+'" stroke-width="3.2" stroke-linecap="round" style="stroke:var(--fig-blade)"/>';
    }
    g+='</g>';
    var ground=p.ground?'<line x1="8" y1="'+(Hh-pad-4)+'" x2="'+(W-8)+'" y2="'+(Hh-pad-4)+'" stroke-width="2" stroke-linecap="round" style="stroke:var(--fig-ground)"/>':'';
    return '<svg viewBox="0 0 '+W+' '+Hh+'" xmlns="http://www.w3.org/2000/svg" role="img">'+ground+g+'</svg>';
  });
}

/* ---------- Poses ---------- */
var STAND={t:180,th1:3,sh1:3,th2:-3,sh2:-3,ua1:4,ua2:-4};
var FSTANCE={t:172,th1:22,sh1:12,th2:-16,sh2:-20,f1:88,f2:96};
function X(base,o){var r={};for(var k in base)r[k]=base[k];for(var k2 in o)r[k2]=o[k2];return r;}
/* SWD(stance, hilt [x,y], blade angle, front view?, props): both hands on the grip */
var FFRONT={front:true,t:180,th1:14,sh1:4,th2:-14,sh2:-4,f1:90,f2:-90};
function SWD(base,hilt,angle,front,props){
  var d=fdir(angle),h1=[hilt[0]-d[0]*3,hilt[1]-d[1]*3],h2=[hilt[0]-d[0]*12,hilt[1]-d[1]*12];
  var o={a1:{to:h1,bend:0},a2:{to:h2,bend:0},sword:{hilt:hilt,angle:angle}};
  if(props)o.props=props;
  return X(base,o);
}
var FIG={
  squat:{labels:["Stand tall","Sit back and down"],frames:[
    X(STAND,{ua1:92,ua2:88,fa:92}),
    {t:142,th1:82,sh1:-18,th2:78,sh2:-20,ua1:100,ua2:96,fa:100}]},
  bridge:{labels:["Hips down","Squeeze and lift"],frames:[
    {t:-90,h:-100,th:150,sh:30,f:90,ua:90,fa:90,ua2:92,fa2:92},
    {t:-70,h:-100,th:110,sh:40,f:90,ua:95,fa:92}]},
  lunge:{labels:["Stand tall","Step back and lower"],frames:[
    X(STAND,{}),
    {t:180,th1:85,sh1:0,th2:-20,sh2:-100,f2:25,ua1:6,ua2:-6}]},
  calf:{labels:["Heels down","Rise onto your toes"],frames:[
    X(STAND,{}),X(STAND,{f:45})]},
  plank:{labels:["Hold a straight line"],frames:[
    {t:100,h:100,th:-80,sh:-80,f:10,ua:0,fa:90,ua2:-4,fa2:90}]},
  side_plank:{labels:["Lift your hips"],frames:[
    {t:104,h:110,th:-76,sh:-76,f:100,ua1:0,fa1:90,ua2:175,fa2:178,th2:-74,sh2:-74}]},
  dead_bug:{labels:["Arms and knees up","Lower opposite arm and leg"],frames:[
    {t:-90,h:-95,ua:180,fa:180,ua2:176,fa2:176,th:180,sh:90,th2:176,sh2:88,f:180},
    {t:-90,h:-95,ua1:-100,fa1:-98,ua2:176,fa2:176,th1:180,sh1:90,f1:180,th2:100,sh2:100,f2:170}]},
  farmer:{labels:["Stand tall, weights at sides","Slow, steady steps"],frames:[
    X(STAND,{db:true,ua1:2,ua2:-2}),
    {t:180,th1:22,sh1:4,th2:-16,sh2:-30,f2:45,ua1:2,ua2:-2,db:true}]},
  wrist_curl:{labels:["Let the weight roll down","Curl the wrist up"],frames:[
    {t:150,th:90,sh:0,ua:0,fa:90,hd:8,db:true,props:[{type:"bench",x:-16,y:7,w:34}]},
    {t:150,th:90,sh:0,ua:0,fa:90,hd:172,db:true,props:[{type:"bench",x:-16,y:7,w:34}]}]},
  rev_wrist:{labels:["Palms down, hand relaxed","Lift the back of the hand"],frames:[
    {t:150,th:90,sh:0,ua:0,fa:90,hd:8,db:true,props:[{type:"bench",x:-16,y:7,w:34}]},
    {t:150,th:90,sh:0,ua:0,fa:90,hd:150,db:true,props:[{type:"bench",x:-16,y:7,w:34}]}]},
  dead_hang:{labels:["Hang with straight arms"],frames:[
    {t:180,ua1:178,fa1:178,ua2:182,fa2:182,th1:8,sh1:-4,th2:2,sh2:-8,f:60,ground:false,props:[{type:"bar",x:-24,y:-86,w:48}]}]},
  pushup:{labels:["Straight arms, straight body","Chest to just above the floor"],frames:[
    {t:111,h:108,th:-69,sh:-69,f:12,ua:0,fa:0,ua2:-3,fa2:-3},
    {t:95,h:95,th:-85,sh:-85,f:12,ua:-100,fa:0,ua2:-104,fa2:-2}]},
  db_row:{labels:["Arm hanging straight","Pull elbow past your ribs"],frames:[
    {t:108,h:104,th1:12,sh1:-4,a2:{to:[34,32],bend:1},th2:0,sh2:-90,f2:-90,ua1:4,fa1:4,db:true,props:[{type:"bench",x:-36,y:34,w:84}]},
    {t:108,h:104,th1:12,sh1:-4,a2:{to:[34,32],bend:1},th2:0,sh2:-90,f2:-90,ua1:-118,fa1:2,db:true,props:[{type:"bench",x:-36,y:34,w:84}]}]},
  press:{labels:["Weights at shoulders","Press straight up"],frames:[
    {front:true,t:180,th1:4,sh1:2,th2:-4,sh2:-2,f1:90,f2:-90,ua1:80,fa1:178,ua2:-80,fa2:-178,db:true},
    {front:true,t:180,th1:4,sh1:2,th2:-4,sh2:-2,f1:90,f2:-90,ua1:172,fa1:178,ua2:-172,fa2:-178,db:true}]},
  rear_delt:{labels:["Hinge, arms hanging","Raise out to the sides"],frames:[
    {front:true,t:180,tl:0.62,h:0,hover:true,th1:6,sh1:0,th2:-6,sh2:0,f1:90,f2:-90,ua1:6,fa1:4,ua2:-6,fa2:-4,db:true},
    {front:true,t:180,tl:0.62,h:0,hover:true,th1:6,sh1:0,th2:-6,sh2:0,f1:90,f2:-90,ua1:84,fa1:76,ua2:-84,fa2:-76,db:true}]},
  squat_press:{labels:["Squat with weights at shoulders","Stand and press overhead"],frames:[
    {t:148,th1:82,sh1:-18,th2:78,sh2:-20,ua1:30,fa1:172,ua2:26,fa2:170,db:true},
    X(STAND,{ua1:178,fa1:180,ua2:174,fa2:178,db:true})]},
  plank_row:{labels:["High plank holding weights","Row one to your ribs"],frames:[
    {t:111,h:108,th:-69,sh:-69,f:12,ua:0,fa:0,ua2:-3,fa2:-3,db:true},
    {t:111,h:108,th:-69,sh:-69,f:12,ua1:-118,fa1:2,ua2:-3,fa2:-3,db:true}]},
  woodchop:{labels:["Weight above one shoulder","Chop down across to the other hip"],frames:[
    {front:true,t:176,th1:14,sh1:6,th2:-14,sh2:-6,f1:90,f2:-90,a1:{to:[-24,-66],bend:-1},a2:{to:[-24,-66],bend:1},db:"one"},
    {front:true,t:188,h:196,th1:14,sh1:6,th2:-10,sh2:-4,f1:90,f2:-60,a1:{to:[24,10],bend:1},a2:{to:[24,10],bend:-1},db:"one"}]},
  russian:{labels:["Lean back, hands in front","Rotate to touch beside the hip"],frames:[
    {t:-155,h:-165,th:135,sh:30,f:90,a1:{to:[22,-32],bend:-1},a2:{to:[20,-31],bend:-1}},
    {t:-155,h:-150,th:135,sh:30,f:90,a1:{to:[-6,4],bend:-1},a2:{to:[-4,2],bend:-1}}]},
  bird_dog:{labels:["On hands and knees","Reach opposite arm and leg"],frames:[
    {t:106,h:104,th:0,sh:-90,f:-100,a1:{to:[34,30],bend:1},a2:{to:[31,30],bend:1},th2:-3,sh2:-90},
    {t:106,h:104,th1:0,sh1:-90,f1:-100,ua1:98,fa1:98,a2:{to:[31,30],bend:1},th2:-92,sh2:-92,f2:-100}]},

  grip_stance:{labels:["Hands apart, knees soft"],frames:[
    SWD(FSTANCE,[18,-6],135)]},
  guard_vomtag:{labels:["Vom Tag: sword above the head"],frames:[
    SWD(FSTANCE,[12,-70],-140)]},
  guard_ochs:{labels:["Ochs: hilt by the head, point at the face"],frames:[
    SWD(FSTANCE,[10,-56],88)]},
  guard_pflug:{labels:["Pflug: hilt by the hip, point up at the face"],frames:[
    SWD(FSTANCE,[18,-6],135)]},
  guard_alber:{labels:["Alber: point toward the ground"],frames:[
    SWD(FSTANCE,[16,6],40)]},

  foot_step:{labels:["Front foot steps forward","Back foot follows"],frames:[
    X(FSTANCE,{th1:40,sh1:14,th2:-22,sh2:-18}),
    X(FSTANCE,{})]},
  foot_pass:{labels:["Left foot forward","Back foot passes to the front"],frames:[
    X(FSTANCE,{}),
    X(FSTANCE,{th1:-18,sh1:-20,f1:96,th2:22,sh2:12,f2:88})]},
  step_guard:{labels:["Pflug on the right","Pass, Pflug on the left"],frames:[
    SWD(FSTANCE,[18,-6],135),
    SWD(X(FSTANCE,{th1:-18,sh1:-20,f1:96,th2:22,sh2:12,f2:88}),[16,-8],130)]},

  cut_ober:{labels:["Start in Vom Tag","Cut down and through"],frames:[
    SWD(FSTANCE,[12,-70],-140),
    SWD(FSTANCE,[18,4],45)]},
  cut_unter:{labels:["Start low","Cut rising, hands finish high"],frames:[
    SWD(FSTANCE,[16,6],40),
    SWD(FSTANCE,[24,-48],122)]},
  cut_mittel:{labels:["Sword high on one side","Cut level across"],frames:[
    SWD(FFRONT,[-20,-36],-100,true),
    SWD(FFRONT,[22,-36],96,true)]},
  thrust:{labels:["Start in Pflug","Extend into Langort"],frames:[
    SWD(FSTANCE,[18,-6],135),
    SWD(FSTANCE,[40,-30],90)]},
  cut_zorn:{labels:["Vom Tag, left foot forward","Pass and cut, point on target"],frames:[
    SWD(FSTANCE,[12,-70],-140),
    SWD(X(FSTANCE,{th1:-18,sh1:-20,f1:96,th2:26,sh2:10,f2:88}),[34,-34],92)]},
  zorn_ort:{labels:["The Zornhau lands","Push the point on"],frames:[
    SWD(X(FSTANCE,{th1:-18,sh1:-20,f1:96,th2:26,sh2:10,f2:88}),[34,-34],92),
    SWD(X(FSTANCE,{th1:-22,sh1:-20,f1:96,th2:34,sh2:12,f2:88}),[42,-36],90)]},

  pell_ober:{labels:["Vom Tag, out of reach","Step in, cut lands on the head"],frames:[
    SWD(FSTANCE,[12,-70],-140,false,[{type:"dummy",x:92,y:-64,w:28}]),
    SWD(X(FSTANCE,{th1:-18,sh1:-20,f1:96,th2:26,sh2:10,f2:88}),[34,-46],96,false,[{type:"dummy",x:92,y:-64,w:28}])]},
  pell_thrust:{labels:["Pflug, out of reach","Step in, point on the target"],frames:[
    SWD(FSTANCE,[18,-6],135,false,[{type:"dummy",x:102,y:-64,w:28}]),
    SWD(X(FSTANCE,{th1:-18,sh1:-20,f1:96,th2:26,sh2:10,f2:88}),[40,-30],92,false,[{type:"dummy",x:102,y:-64,w:28}])]}
};
