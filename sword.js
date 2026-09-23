/*
  Sword training content, in the same shape as js/workouts.js.
  LIB  = every guard, cut, and drill: name, YouTube search terms (q),
         steps, and tips. A matching key in FIG (js/figures.js) adds a picture.
  DAYS = the sessions. Each plan item points at a LIB key and gives
         sets, reps (text) or time (seconds), rest (seconds between sets),
         sides:true (do it on both sides), and after (seconds before the
         next item, default 30).
  Guard and cut names follow the German (Liechtenauer) tradition.
  Directions are written for a right-hander. Left-handers mirror everything.
*/
/* ---------- Sword library ---------- */
var LIB = {
  warm_sword:{name:"Warm-up",q:"hema warm up routine",
    steps:["A couple of minutes of easy movement, marching or light jogging on the spot.","10 wrist circles each direction, then 10 arm circles forwards and backwards.","10 slow torso twists with loose arms, letting the hips turn.","10 slow, gentle practice cuts with the sword, just to get moving."],
    tips:["Longsword is hard on wrists and forearms. Don't skip this."]},
  cool_sword:{name:"Cool-down",q:"forearm wrist stretch",
    steps:["Forearm stretch, palm up then palm down: 30 seconds each arm.","Cross-body shoulder stretch: 30 seconds each arm.","Slow shoulder rolls, then shake your hands out."],
    tips:["Tight forearms after a session are normal. Stretching now helps the next one."]},

  grip_stance:{name:"Grip and stance",q:"longsword grip and stance beginner",
    steps:["Right hand just below the crossguard, left hand on or just above the pommel.","Grip mostly with your last three fingers, keeping the thumb and forefinger a little looser.","Feet about shoulder-width apart, left foot forward, knees soft, weight evenly split.","Stand tall and relaxed. Practise settling into this stance a few times."],
    tips:["A death grip slows your cuts and tires your forearms fast.","Hands stay apart on the grip. The gap between them is what lets you lever the blade."]},

  guard_vomtag:{name:"Vom Tag (from the roof)",q:"vom tag guard longsword",
    steps:["Left foot forward.","Hold the sword above your head, point angled up and back, or rest it on your right shoulder. Both versions are correct.","Elbows fairly close in, not flared out wide.","On the left side, mirror it: right foot forward, sword on your left."],
    tips:["Most descending cuts start from here.","Above the head gives a faster cut but tires the shoulders sooner, which is exactly why holding it builds endurance."]},
  guard_ochs:{name:"Ochs (the ox)",q:"ochs guard longsword",
    steps:["Left foot forward.","Raise the hilt beside the right side of your head, hands around temple height.","Aim the point straight at your opponent's face, like the horn of an ox.","On the left side, mirror it: right foot forward, hilt beside the left of your head."],
    tips:["The point should stay level on target, not drift up at the sky.","Arms bent but not cramped. You should be able to thrust straight out of it."]},
  guard_pflug:{name:"Pflug (the plough)",q:"pflug guard longsword",
    steps:["Left foot forward.","Hold the hilt beside your right hip, pommel low.","Point angled up at your opponent's face or chest.","On the left side, mirror it: right foot forward, hilt by your left hip."],
    tips:["Keep your back upright rather than hunching over the hilt.","If the point drops, it stops threatening anything."]},
  guard_alber:{name:"Alber (the fool)",q:"alber guard longsword",
    steps:["Either foot forward.","Hold the hilt low in front of you with the point angled down toward the ground.","Shoulders and arms relaxed, ready to cut upward."],
    tips:["It's called the fool because it looks open. That's the point: it invites an attack you're ready to meet with a rising cut.","It isn't a rest position. Stay ready."]},
  guard_flow:{name:"Guard flow",q:"liechtenauer four guards vier leger",
    steps:["Start in Vom Tag.","Move slowly into Ochs, then Pflug, then Alber, and back up the same way.","Do a few rounds on one side, then switch your feet and do the other side."],
    tips:["Slow and smooth. The aim is to know where your sword is without looking at it.","Keep your stance steady while the sword moves."]},

  foot_step:{name:"Step forward and back",q:"hema footwork basics longsword",
    steps:["From your stance, step the front foot forward, then bring the back foot up the same distance.","To go back, the back foot moves first and the front foot follows.","Keep the same stance width the whole time.","Keep stepping forward and back for the timer."],
    tips:["Small, balanced steps beat big lunges.","Don't bob up and down, and don't let your feet cross or close together."]},
  foot_pass:{name:"Passing step",q:"hema passing step footwork",
    steps:["From your stance, bring the back foot forward past the front foot so it becomes the new front foot, like a walking step.","Let your hips turn with the step.","Pass forward a few times, then pass backwards the same way."],
    tips:["Most longsword cuts are made with a passing step, so this is the big one to get comfortable with.","Land with your knees soft and weight balanced, ready to go again."]},
  step_guard:{name:"Passing with a guard",q:"hema passing step pflug guard change",
    steps:["Start in Pflug on the right, left foot forward.","Pass forward. As the right foot lands in front, move the sword across into Pflug on the left.","Pass again and change back. Then pass backwards, changing the guard each step."],
    tips:["Rule of thumb: the hilt sits on the side of your back foot.","Keep the point aimed forward the whole time. It shouldn't wander while your feet move."]},

  cut_ober:{name:"Oberhau (descending cut)",q:"oberhau longsword cut",
    steps:["Start in Vom Tag, left foot forward.","Cut diagonally down from above your right shoulder, through where an opponent's left shoulder or neck would be.","Let the sword carry through and finish low on your left.","Reset and repeat. For the other side, mirror everything."],
    tips:["Power comes from the hips and shoulders turning, not just the arms.","Lead with the edge. If the flat leads, the blade will wobble and slap."]},
  cut_unter:{name:"Unterhau (rising cut)",q:"unterhau longsword cut",
    steps:["Start low on your right, point down, like a low Alber off to the side.","Cut diagonally upward through where an opponent's arms or chin would be.","Finish high on your left, hands around head height.","Reset and repeat, then mirror it."],
    tips:["Drive it from the legs and hips. Don't just lift the sword with your arms."]},
  cut_mittel:{name:"Mittelhau (middle cut)",q:"mittelhau horizontal cut longsword",
    steps:["Start with the sword by your right shoulder.","Cut horizontally across at roughly neck or chest height.","Finish on your left side with the blade still level.","Reset and repeat, then mirror it."],
    tips:["Keep the blade level. It's easy to let it dip halfway through.","Turn the hips with it, just like the diagonal cuts."]},
  thrust:{name:"Thrust (Stich) into Langort",q:"longsword thrust langort",
    steps:["Start in Pflug.","Push your hands forward and slightly up so the point travels in a straight line to the target.","Finish in Langort (the long point): arms extended, sword pointing straight ahead.","Recover to Pflug and repeat."],
    tips:["The point moves in a straight line. If you swing it, it's a cut, not a thrust.","Keep your shoulders down as your arms extend."]},

  cut_zorn:{name:"Zornhau (wrath cut)",q:"zornhau longsword",
    steps:["Start in Vom Tag, left foot forward.","Make a strong diagonal descending cut from the right, passing forward so your right foot lands in front.","Stop the cut with the point aimed at your opponent, not swinging through to the floor.","Recover and repeat, then mirror it from the left."],
    tips:["The first of Liechtenauer's master cuts, and the basis of a lot of drills.","Get the sword moving first and let the step follow, rather than stepping and then swinging."]},
  zorn_ort:{name:"Zornhau into a thrust",q:"zornort zornhau thrust longsword",
    steps:["Cut a Zornhau.","Picture your opponent's sword meeting yours in the middle as it lands.","Keeping that contact, push the point straight on toward the face or chest.","Recover to guard and repeat."],
    tips:["This one combo shows the whole idea of the German style: cut, feel the contact, then take the most direct route to the target.","Push forward from the legs, not just the arms."]},
  cut_flow:{name:"Cutting flow",q:"longsword cutting drill solo",
    steps:["Link four cuts without stopping: Oberhau from the right, then from the left.","Then an Unterhau from the right, then from the left.","After each cut, bring the sword round smoothly to where the next one starts.","That's one round. Start slow, and only speed up once it's smooth."],
    tips:["Stay balanced. If you wobble, you're going too fast.","Breathe out on each cut."]},

  pell_measure:{name:"Finding your distance",q:"hema measure distance drill",
    steps:["Stand just out of reach of the dummy, in Vom Tag.","Pass forward and cut an Oberhau, so the last third of the blade lands on the head or shoulder.","Step straight back out of reach.","Adjust where you start until the step alone brings you into range."],
    tips:["Finding your distance, called measure, matters as much as the cut itself.","If the cut lands near the crossguard, you're too close."]},
  pell_ober:{name:"Dummy: Oberhau",q:"pell training longsword",
    steps:["Start out of reach in Vom Tag.","Step in and cut an Oberhau onto the head or shoulder, then step back out.","Alternate right and left sides for the timer."],
    tips:["A clean edge hit sounds sharp. The flat gives a slap.","Control the cut. Stop at the target instead of trying to chop through the post."]},
  pell_thrust:{name:"Dummy: thrust",q:"longsword thrust pell practice",
    steps:["Start out of reach in Pflug.","Step in and thrust at the painted target, stopping as the point lands.","Recover to Pflug and step back out. Repeat for the timer."],
    tips:["Only thrust into the dummy with a synthetic or wooden sword.","Accuracy first. Hit the target, not just the dummy."]},
  pell_combo:{name:"Dummy: combinations",q:"pell training combinations longsword",
    steps:["Pick one pair per round: Oberhau then Unterhau, Zornhau then thrust, or Unterhau then Oberhau.","Step in, land both actions, then step back out.","Change the pair each round."],
    tips:["The second action should flow from where the first one ended, with no reset in between.","Slow and correct beats fast and sloppy. Speed comes on its own."]}
};

/* ---------- Sessions ---------- */
var DAYS = [
  {id:"sw1",short:"1",full:"Session 1",focus:"Grip, stance and guards",
   equipment:"training sword or a broom handle",
   why:"The four guards are the positions every cut starts and ends in. Holding them builds the shoulder and grip endurance you'll need for everything else.",
   plan:[
    {ex:"warm_sword",time:240,after:15},
    {ex:"grip_stance",time:60,after:15},
    {ex:"guard_vomtag",sets:2,time:20,sides:true,rest:15},
    {ex:"guard_ochs",sets:2,time:20,sides:true,rest:15},
    {ex:"guard_pflug",sets:2,time:20,sides:true,rest:15},
    {ex:"guard_alber",sets:2,time:20,rest:15},
    {ex:"guard_flow",sets:3,reps:"3 slow rounds each side",rest:30},
    {ex:"cool_sword",time:120}
   ]},
  {id:"sw2",short:"2",full:"Session 2",focus:"Footwork",
   equipment:"space to move, sword for the last drill",
   why:"A cut with no footwork behind it is just an arm swing. This session is all legs, and it's the half of longsword that people most often skip.",
   plan:[
    {ex:"warm_sword",time:240,after:15},
    {ex:"foot_step",sets:3,time:45,rest:30},
    {ex:"foot_pass",sets:3,time:45,rest:30},
    {ex:"step_guard",sets:3,time:45,rest:30},
    {ex:"cool_sword",time:120}
   ]},
  {id:"sw3",short:"3",full:"Session 3",focus:"The basic cuts",
   equipment:"training sword",
   why:"Three cuts and a thrust cover most of what a longsword does. Slow, correct reps now build the pattern your body relies on later.",
   plan:[
    {ex:"warm_sword",time:240,after:15},
    {ex:"cut_ober",sets:3,reps:"8 each side",rest:45},
    {ex:"cut_unter",sets:3,reps:"8 each side",rest:45},
    {ex:"cut_mittel",sets:2,reps:"8 each side",rest:45},
    {ex:"thrust",sets:3,reps:"8 reps",rest:45},
    {ex:"cool_sword",time:120}
   ]},
  {id:"sw4",short:"4",full:"Session 4",focus:"Cutting with footwork",
   equipment:"training sword",
   why:"This is where the feet and the sword start moving as one. The Zornhau is the foundation of German longsword, so it gets the most reps.",
   plan:[
    {ex:"warm_sword",time:240,after:15},
    {ex:"cut_zorn",sets:3,reps:"8 each side",rest:45},
    {ex:"zorn_ort",sets:3,reps:"6 reps",rest:45},
    {ex:"cut_flow",sets:3,reps:"3 rounds",rest:45},
    {ex:"step_guard",sets:1,time:45},
    {ex:"cool_sword",time:120}
   ]},
  {id:"sw5",short:"5",full:"Session 5",focus:"Dummy work",
   equipment:"synthetic or wooden sword and the dummy",
   why:"Hitting something real teaches distance, edge alignment and control in a way air cutting can't. Save this one until the dummy is built.",
   plan:[
    {ex:"warm_sword",time:240,after:15},
    {ex:"pell_measure",sets:2,reps:"10 approaches",rest:30},
    {ex:"pell_ober",sets:4,time:40,rest:40},
    {ex:"pell_thrust",sets:3,time:40,rest:40},
    {ex:"pell_combo",sets:4,time:40,rest:40},
    {ex:"cool_sword",time:120}
   ]}
];
