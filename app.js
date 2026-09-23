(function(){
"use strict";

/* ---------- Helpers ---------- */
var $ = function(id){return document.getElementById(id);};
var CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg>';
var INFO = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>';
var PAUSE = '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>';
var PLAY = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
var RING_C = 2 * Math.PI * 108;

function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];});}
function clock(s){s=Math.max(0,Math.round(s));var m=Math.floor(s/60),r=s%60;return m+":"+(r<10?"0":"")+r;}
function dur(s){if(s>=60&&s%60===0)return (s/60)+" min";if(s>=60)return clock(s);return s+"s";}
function scheme(item){
  var sets=item.sets||1;
  var per=item.time?dur(item.time):item.reps;
  if(item.sides)per+=" each side";
  return sets>1?sets+" × "+per:per;
}

function store(k,v){try{localStorage.setItem(k,v);}catch(e){}}
function load(k){try{return localStorage.getItem(k);}catch(e){return null;}}
function weekStart(){var d=new Date();var off=(d.getDay()+6)%7;d.setHours(0,0,0,0);d.setDate(d.getDate()-off);return d.getTime();}
function doneThisWeek(id){var t=Number(load("lp-done-"+id)||0);return t>=weekStart();}
function todayId(){return ["sun","mon","tue","wed","thu","fri","sat"][new Date().getDay()];}

function buildSteps(day){
  var steps=[];
  day.plan.forEach(function(item,pi){
    var ex=LIB[item.ex];
    var sets=item.sets||1;
    var sides=item.sides?["Left side","Right side"]:[null];
    for(var s=1;s<=sets;s++){
      sides.forEach(function(side,si){
        steps.push({kind:"work",exId:item.ex,name:ex.name,setNo:s,setTotal:sets,side:side,
          mode:item.time?"time":"reps",seconds:item.time||0,reps:item.reps||"",optional:!!item.optional,
          phase:/^warm/.test(item.ex)?"Warm-up":(/^cool/.test(item.ex)?"Cool-down":"Work")});
        if(si<sides.length-1)steps.push({kind:"rest",seconds:8,label:"Switch sides"});
      });
      if(s<sets&&item.rest)steps.push({kind:"rest",seconds:item.rest,label:item.restLabel||"Rest",cue:item.restCue||""});
    }
    if(pi<day.plan.length-1){
      steps.push({kind:"rest",seconds:(item.after!=null?item.after:30),label:"Get ready"});
    }
  });
  steps.forEach(function(st,i){
    if(st.kind==="rest"){
      for(var j=i+1;j<steps.length;j++){if(steps[j].kind==="work"){st.next=steps[j];break;}}
    }
  });
  return steps;
}
function estimateMin(day){
  var t=0;buildSteps(day).forEach(function(st){t+=(st.kind==="work"&&st.mode==="reps")?40:st.seconds;});
  return Math.round(t/60);
}

/* ---------- Screens ---------- */
var SCREENS=["home","preview","player","done"];
function show(id){SCREENS.forEach(function(s){$(s).hidden=(s!==id);});window.scrollTo(0,0);}

function renderHome(){
  var list=$("dayList");list.innerHTML="";
  var today=todayId(),count=0,total=0;
  DAYS.forEach(function(day){
    if(!day.rest){total++;if(doneThisWeek(day.id))count++;}
    var b=document.createElement("button");
    b.className="day-card"+(day.id===today?" today":"");
    var done=!day.rest&&doneThisWeek(day.id);
    var meta=day.rest?"No training":("About "+estimateMin(day)+" min");
    if(day.id===today)meta="Today, "+meta.charAt(0).toLowerCase()+meta.slice(1);
    b.innerHTML='<span class="dc-day">'+day.short+'</span><span class="dc-body"><span class="dc-focus">'+esc(day.focus)+'</span><br><span class="dc-meta">'+esc(meta)+'</span></span>'+
      (day.rest?'':'<span class="dc-status'+(done?' done':'')+'" aria-label="'+(done?'Done this week':'Not done yet')+'">'+(done?CHECK:'')+'</span>');
    b.addEventListener("click",function(){openPreview(day);});
    list.appendChild(b);
  });
  $("weekCount").textContent=count+" of "+total+" sessions done this week";
}

var current=null;
function openPreview(day){
  current=day;
  $("pvTitle").textContent=day.full+": "+day.focus;
  $("pvMeta").textContent=day.rest?"Rest day":("About "+estimateMin(day)+" min"+(day.equipment?(", "+day.equipment):""));
  $("pvWhy").textContent=day.why;
  var list=$("pvList");list.innerHTML="";
  if(day.rest){
    list.innerHTML='<p class="rest-msg">No exercises today. A slow walk or light stretching is fine if you feel restless, just don\'t train.</p>';
    $("pvStartBar").hidden=true;
  }else{
    $("pvStartBar").hidden=false;
    day.plan.forEach(function(item){
      var ex=LIB[item.ex];
      var row=document.createElement("div");row.className="plan-item";
      row.innerHTML='<div class="pi-body"><div class="pi-name">'+esc(ex.name)+(item.optional?'<span class="pi-opt">optional</span>':'')+'</div><div class="pi-scheme">'+esc(scheme(item))+'</div></div>';
      var hb=document.createElement("button");hb.className="how-btn";hb.innerHTML=INFO+"How to";
      hb.setAttribute("aria-label","How to do "+ex.name);
      hb.addEventListener("click",function(){openHowto(item.ex,false);});
      row.appendChild(hb);list.appendChild(row);
    });
  }
  show("preview");
}

/* ---------- How-to sheet ---------- */
var howFromPlayer=false,wasRunning=false;
function openHowto(exId,fromPlayer){
  var ex=LIB[exId];
  $("htName").textContent=ex.name;
  $("htSteps").innerHTML=ex.steps.map(function(s){return "<li>"+esc(s)+"</li>";}).join("");
  $("htTips").innerHTML=ex.tips.map(function(s){return "<li>"+esc(s)+"</li>";}).join("");
  var fb=$("htFig"),fg=FIG[exId];
  if(fg){
    var svgs=figureFrames(fg),html="";
    svgs.forEach(function(sv,k){
      if(k>0)html+='<svg class="fig-step" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>';
      html+='<figure>'+sv.replace('role="img"','role="img" aria-label="'+esc(fg.labels[k])+'"')+'<figcaption>'+esc(fg.labels[k])+'</figcaption></figure>';
    });
    fb.innerHTML=html;fb.className="fig-row"+(svgs.length===1?" single":"");fb.hidden=false;
  }else{fb.innerHTML="";fb.hidden=true;}
  $("htLink").href="https://www.youtube.com/results?search_query="+encodeURIComponent(ex.q);
  howFromPlayer=fromPlayer;
  if(fromPlayer&&P){wasRunning=P.running;P.running=false;renderControls();}
  $("howto").hidden=false;
}
function closeHowto(){
  $("howto").hidden=true;
  if(howFromPlayer&&P&&wasRunning){P.running=true;P.last=performance.now();renderControls();}
  howFromPlayer=false;
}
document.querySelectorAll("[data-close]").forEach(function(el){
  el.addEventListener("click",function(){
    var w=el.getAttribute("data-close");
    if(w==="howto")closeHowto();else $(w).hidden=true;
  });
});
document.addEventListener("keydown",function(e){
  if(e.key==="Escape"){if(!$("howto").hidden)closeHowto();else if(!$("confirm").hidden)$("confirm").hidden=true;}
});

/* ---------- Sound and wake lock ---------- */
var actx=null,wakeLock=null;
function unlockAudio(){
  try{if(!actx){var C=window.AudioContext||window.webkitAudioContext;if(C)actx=new C();}if(actx&&actx.state==="suspended")actx.resume();}catch(e){}
}
function beep(freq,len){
  if(!actx)return;
  try{
    var o=actx.createOscillator(),g=actx.createGain();
    o.type="sine";o.frequency.value=freq;
    g.gain.setValueAtTime(0.0001,actx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.25,actx.currentTime+0.02);
    g.gain.exponentialRampToValueAtTime(0.0001,actx.currentTime+len);
    o.connect(g);g.connect(actx.destination);o.start();o.stop(actx.currentTime+len+0.05);
  }catch(e){}
  try{if(navigator.vibrate)navigator.vibrate(len>0.3?200:60);}catch(e){}
}
function requestWake(){try{if(navigator.wakeLock)navigator.wakeLock.request("screen").then(function(l){wakeLock=l;}).catch(function(){});}catch(e){}}
function releaseWake(){try{if(wakeLock)wakeLock.release();}catch(e){}wakeLock=null;}
document.addEventListener("visibilitychange",function(){if(document.visibilityState==="visible"&&P)requestWake();});

/* ---------- Player ---------- */
var P=null,timer=null;
function startWorkout(day){
  unlockAudio();
  P={day:day,steps:buildSteps(day),i:0,running:true,start:Date.now(),last:performance.now()};
  $("ringFg").style.strokeDasharray=RING_C;
  show("player");
  requestWake();
  enterStep(0);
  if(!timer)timer=setInterval(tick,200);
}
function stopPlayer(){if(timer){clearInterval(timer);timer=null;}releaseWake();P=null;}

function enterStep(i){
  P.i=i;var st=P.steps[i];
  P.running=true;P.last=performance.now();
  if(st.kind==="rest"||st.mode==="time"){P.total=st.seconds;P.remaining=st.seconds;P.whole=Math.ceil(st.seconds);}
  else{P.elapsed=0;}
  renderStep();
}
function advance(){if(P.i<P.steps.length-1)enterStep(P.i+1);else finish();}
function back(){if(P.i>0)enterStep(P.i-1);else enterStep(0);}

function tick(){
  if(!P)return;
  var now=performance.now(),dt=(now-P.last)/1000;P.last=now;
  if(!P.running)return;
  var st=P.steps[P.i];
  if(st.kind==="rest"||st.mode==="time"){
    P.remaining-=dt;
    var w=Math.ceil(P.remaining);
    if(w<P.whole){P.whole=w;if(w>=1&&w<=3)beep(660,0.12);}
    if(P.remaining<=0){beep(880,0.45);advance();return;}
  }else{P.elapsed+=dt;}
  renderLive();
}

function workIndex(){ // counts work steps for the header
  var total=0,cur=0;
  P.steps.forEach(function(s,idx){if(s.kind==="work"){total++;if(idx<=P.i)cur=total;}});
  return {cur:Math.max(cur,1),total:total};
}

function renderStep(){
  var st=P.steps[P.i],pl=$("player");
  var isRest=st.kind==="rest",isReps=!isRest&&st.mode==="reps";
  pl.classList.toggle("is-rest",isRest);
  pl.classList.toggle("is-reps",isReps);
  var wi=workIndex();
  $("pCount").textContent="Exercise "+wi.cur+" of "+wi.total;
  $("pBar").style.width=Math.round((P.i/P.steps.length)*100)+"%";

  if(isRest){
    $("pPhase").textContent=st.label;
    var n=st.next;
    $("pName").textContent=n?n.name:"";
    $("pSet").textContent=n?("Up next"+setText(n)):"";
    $("pCue").textContent=st.cue||(n?(n.mode==="time"?dur(n.seconds):n.reps):"");
    $("pExtra").style.visibility="visible";
  }else{
    $("pPhase").textContent=st.optional?(st.phase+", optional"):st.phase;
    $("pName").textContent=st.name;
    $("pSet").textContent=setText(st).replace(/^, /,"");
    $("pCue").textContent=isReps?"Tap Done when you finish the set.":"";
    $("pExtra").style.visibility="hidden";
  }
  var big=$("pBig");
  if(isReps){big.classList.add("reps");big.textContent=st.reps;$("ringFg").style.strokeDashoffset=0;}
  else{big.classList.remove("reps");}
  renderLive();renderControls();
}
function setText(st){
  var parts=[];
  if(st.setTotal>1)parts.push("set "+st.setNo+" of "+st.setTotal);
  if(st.side)parts.push(st.side.toLowerCase());
  if(!parts.length)return "";
  var t=parts.join(", ");
  return ", "+t;
}
function renderLive(){
  var st=P.steps[P.i];
  if(st.kind==="rest"||st.mode==="time"){
    $("pBig").textContent=clock(Math.ceil(Math.max(0,P.remaining)));
    var frac=P.total?Math.max(0,P.remaining)/P.total:0;
    $("ringFg").style.strokeDashoffset=RING_C*(1-frac);
    $("pSmall").textContent=P.running?"":"Paused";
  }else{
    $("pSmall").textContent=clock(Math.floor(P.elapsed))+(P.running?"":" paused");
  }
}
function renderControls(){
  if(!P)return;
  var st=P.steps[P.i],m=$("pMain");
  if(st.kind==="rest"){m.innerHTML="Skip rest";}
  else if(st.mode==="reps"){m.innerHTML=CHECK.replace('stroke="#fff"','stroke="currentColor"')+"Done";}
  else{m.innerHTML=P.running?PAUSE+"Pause":PLAY+"Resume";}
  renderLive();
}

$("pMain").addEventListener("click",function(){
  if(!P)return;unlockAudio();
  var st=P.steps[P.i];
  if(st.kind==="rest"||st.mode==="reps"){advance();return;}
  P.running=!P.running;P.last=performance.now();renderControls();
});
$("pSkip").addEventListener("click",function(){if(P)advance();});
$("pPrev").addEventListener("click",function(){if(P)back();});
$("pAdd").addEventListener("click",function(){
  if(!P)return;var st=P.steps[P.i];if(st.kind!=="rest")return;
  P.remaining+=15;P.total=Math.max(P.total,P.remaining);P.whole=Math.ceil(P.remaining);renderLive();
});
$("pHow").addEventListener("click",function(){
  if(!P)return;var st=P.steps[P.i];var target=st.kind==="rest"?st.next:st;
  if(target)openHowto(target.exId,true);
});
$("pClose").addEventListener("click",function(){$("confirm").hidden=false;});
$("cfEnd").addEventListener("click",function(){
  $("confirm").hidden=true;if(!P)return;var d=P.day;stopPlayer();openPreview(d);
});

function finish(){
  var day=P.day,mins=Math.max(1,Math.round((Date.now()-P.start)/60000));
  beep(990,0.6);
  stopPlayer();
  store("lp-done-"+day.id,String(Date.now()));
  $("doneTitle").textContent=day.focus+" done";
  $("doneText").textContent="That took "+mins+" min. Rest up, drink some water, and the next session will feel a little easier.";
  show("done");
}

$("pvBack").addEventListener("click",function(){renderHome();show("home");});
$("pvStart").addEventListener("click",function(){if(current&&!current.rest)startWorkout(current);});
$("doneBack").addEventListener("click",function(){renderHome();show("home");});

renderHome();
})();
