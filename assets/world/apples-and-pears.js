/* 3D mini-lesson: Apples and pears. Course: Apples and Pears: True Price, lesson "Unequal suppliers and why scores fail".
   Same numbers as the text lesson in assets/courses/true-price.js: Supplier X 82/100 at £10.00 a part, Supplier Y 74/100
   at £9.40, three ways to compare, the four things that go wrong without money, and the five "No, or yes if?" objections. */
import { stage, scenery, cast, V, THREE, box, animate, CAST } from './kit.js';

export const meta = {
  id: 'apples-and-pears',
  title: 'Apples and pears',
  course: 'true-price', lesson: 'unequal-suppliers',
  minutes: 7
};

/* ---------- Layout ---------- */
const MAX_HOME = [-3.4, -.4], LIB_HOME = [3.4, -.4];
const STALL_X = -7, STALL_Y = 7, STALL_Z = -5;
const SCALE_Z = -5.6, PIVOT_Y = 3.7, ARM = 2.5;
const RULER_X0 = -5, RULER_Z = 1.6;          // the tape runs from x -5 to 5: one unit is 10p a part
const BENCH = [-7.6, 3.6];
const AT_BENCH = { max: [-10.5, 3.3], libby: [-4.7, 3.3] };
const AT_PEARS = [5.6, -3.1];
const AT_SORT = { max: [11.1, 2.4], libby: [3.4, 2.3] };

/* The five objections from the lesson's sort, and where each one ends up */
const OBJ = [
  { id: 'warranty', label: 'Warranty', text: 'The supplier\'s warranty is 2 years; you wanted 3', bin: 'tag', why: 'Price the risk of the missing year and add it as a charge.' },
  { id: 'safety', label: 'Safety approval', text: 'The supplier has no approval to make safety-critical parts', bin: 'stop', why: 'You can\'t price away a legal requirement.' },
  { id: 'distance', label: 'Distance', text: 'Their factory is 400 miles further away', bin: 'tag', why: 'Price the extra shipping.' },
  { id: 'clause', label: 'Terms clause', text: 'They won\'t accept one clause of your terms', bin: 'tag', why: 'Estimate what the clause is worth to you and charge it.' },
  { id: 'audit', label: 'Audit', text: 'They failed the quality audit outright', bin: 'stop', why: 'Below the minimum is a no-go until it\'s fixed.' }
];
const START = { warranty: [4.6, 0, 6.0], safety: [5.9, 0, 6.3], distance: [7.2, 0, 6.0], clause: [8.5, 0, 6.3], audit: [9.8, 0, 6.0] };
const SPOT = { warranty: [8.5, 0, 3.6], distance: [9.4, 0, 3.95], clause: [10.3, 0, 3.6], safety: [4.95, 0, 3.85], audit: [5.85, 0, 3.85] };
const WRONG = [9.4, .57, 3.95];   // on top of the distance crate, where Max puts the safety crate

/* Fruit colours stay fixed (an apple is red in the dark too); the set itself uses theme roles */
const APPLE = '#C4473A', PEAR = '#B5BE4C', LEAF = '#5E8C4A', STALK = '#5B3A22';

export function build(w) {
  const { mat } = w;
  stage(w, { width: 26, depth: 18 });

  const parts = {};
  /* One piece of the set. With a key it's clickable and gets a card; its labels show and hide with it. */
  const part = (name, group, { key = null, label = null, labelY = 2, cls = 'sign', extra = [] } = {}) => {
    if (key) { group.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } }); w.scene.add(w.thing(key, group)); }
    else scenery(w, group);
    const labels = [];
    if (label) { const l = w.label(key, label, V(0, labelY, 0), cls); group.add(l.obj); labels.push(l); }
    for (const [t, pos, c] of extra) { const l = w.label(key, t, pos, c || 'axis'); group.add(l.obj); labels.push(l); }
    const p = {
      group, labels, on: true, base: group.scale.clone(),
      show(on) { group.visible = on; labels.forEach(l => { l.obj.visible = on; l.el.hidden = !on; }); p.on = on; },
      async pop(ms = 650) {
        p.show(true); group.scale.set(.001, .001, .001);
        await animate(ms, k => { const s = Math.max(.001, k + Math.sin(k * Math.PI) * .12); group.scale.set(p.base.x * s, p.base.y * s, p.base.z * s); });
        group.scale.copy(p.base);
      }
    };
    parts[name] = p; return p;
  };
  const sph = (r, m, x = 0, y = 0, z = 0, sx = 1, sy = sx, sz = sx) => { const s = new THREE.Mesh(new THREE.SphereGeometry(r, 20, 14), m); s.position.set(x, y, z); s.scale.set(sx, sy, sz); return s; };
  const cyl = (rt, rb, h, m, x = 0, y = 0, z = 0, seg = 20) => { const c = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), m); c.position.set(x, y + h / 2, z); return c; };

  /* Fruit: an apple is a squashed ball with a stalk and a leaf; a pear is two balls stacked */
  const fruitM = { apple: mat(APPLE, { roughness: .45 }), pear: mat(PEAR, { roughness: .5 }), leaf: mat(LEAF), stalk: mat(STALK) };
  const apple = (s = 1) => {
    const g = new THREE.Group();
    g.add(sph(.2, fruitM.apple, 0, .18, 0, 1, .88, 1));
    g.add(cyl(.016, .02, .12, fruitM.stalk, 0, .32, 0, 6));
    const leaf = sph(.06, fruitM.leaf, .06, .41, 0, 1.4, .35, .7); leaf.rotation.z = -.5; g.add(leaf);
    g.scale.setScalar(s); return g;
  };
  const pear = (s = 1) => {
    const g = new THREE.Group();
    g.add(sph(.19, fruitM.pear, 0, .17, 0));
    g.add(sph(.13, fruitM.pear, 0, .36, 0, 1, 1.15, 1));
    g.add(cyl(.016, .02, .12, fruitM.stalk, .02, .48, 0, 6));
    g.scale.setScalar(s); return g;
  };

  /* ---------- Ground: a paved market square, barrels, and bunting strung behind the scale ---------- */
  const ground = new THREE.Group();
  const paveA = mat('floor'), paveB = mat('surface');
  for (let i = -3; i <= 3; i++) for (let j = -1; j <= 1; j++) ground.add(box(1.5, .04, 1.5, (i + j) % 2 ? paveA : paveB, i * 1.6, 0, -.6 + j * 1.6, .18));
  const barrelM = mat('wood'), hoopM = mat('mask');
  for (const [x, z] of [[-11.2, -6.6], [-10.2, -7.1], [11.2, -6.6]]) {
    ground.add(cyl(.42, .38, .95, barrelM, x, 0, z));
    for (const y of [.18, .72]) { const hoop = new THREE.Mesh(new THREE.TorusGeometry(.43, .025, 6, 28), hoopM); hoop.rotation.x = Math.PI / 2; hoop.position.set(x, y, z); ground.add(hoop); }
  }
  const poleM = mat('wood');
  for (const x of [-5.2, 5.2]) ground.add(cyl(.07, .09, 5.1, poleM, x, 0, -7.3, 10));
  const flagMs = [mat('accent'), mat('gold'), mat('paper')];
  for (let i = 0; i <= 14; i++) {
    const x = -5.2 + i * 10.4 / 14, sag = Math.sin(i / 14 * Math.PI) * .55;
    const flag = new THREE.Mesh(new THREE.ConeGeometry(.2, .42, 3), flagMs[i % 3]);
    flag.rotation.x = Math.PI; flag.position.set(x, 4.85 - sag - .22, -7.3); ground.add(flag);
  }
  const string = new THREE.Mesh(new THREE.CylinderGeometry(.015, .015, 10.4, 4), mat('muted'));
  string.rotation.z = Math.PI / 2; string.position.set(0, 4.62, -7.3); ground.add(string);
  scenery(w, ground);

  /* ---------- The two stalls: Supplier X sells apples, Supplier Y sells pears ---------- */
  const fruitGroups = [];
  const stall = (key, cx, kind, awning, name, quote) => {
    const g = new THREE.Group(); g.position.set(cx, 0, STALL_Z);
    const wood = mat('wood'), front = mat('surface'), post = mat('wood'), stripeA = mat(awning), stripeB = mat('paper'), crateM = mat('wood'), board = mat('paper');
    g.add(box(4.2, 1.0, 1.5, front, 0, 0, 0, .12));
    for (let i = 0; i < 4; i++) g.add(box(.05, .8, .02, wood, -1.5 + i, .1, .76));           // planks on the counter front
    g.add(box(4.4, .1, 1.7, wood, 0, 1.0, 0, .06));
    for (const x of [-2.05, 2.05]) { g.add(box(.14, 3.05, .14, post, x, 0, .78)); g.add(box(.14, 3.45, .14, post, x, 0, -.78)); }
    const aw = new THREE.Group();
    for (let i = 0; i < 6; i++) aw.add(box(4.7 / 6, .08, 2.1, i % 2 ? stripeB : stripeA, -2.35 + 4.7 / 12 + i * 4.7 / 6, 0, 0));
    aw.position.set(0, 3.18, 0); aw.rotation.x = .2; g.add(aw);
    for (let i = 0; i < 12; i++) g.add(sph(.2, i % 2 ? stripeB : stripeA, -2.2 + i * .4, 2.98, 1.06, 1, .75, .45));  // scalloped edge
    g.add(box(2.6, .6, .08, board, 0, 3.12, 1.16, .03));                                                          // name board
    const fruit = new THREE.Group();
    for (const dx of [-.95, .95]) {
      fruit.add(box(1.55, .4, 1.05, crateM, dx, 1.1, 0, .06));
      for (let r = 0; r < 2; r++) for (let c = 0; c < 3; c++) {
        const f = kind === 'apple' ? apple(1) : pear(1);
        f.position.set(dx - .45 + c * .45, 1.42, -.22 + r * .44); f.rotation.y = (r * 3 + c) * .9; fruit.add(f);
      }
      const top = kind === 'apple' ? apple(1.05) : pear(1.05); top.position.set(dx, 1.72, 0); fruit.add(top);
    }
    g.add(fruit); fruitGroups.push(fruit);
    return part(key, g, { key, label: name, labelY: 4.35, extra: [[quote, V(0, 3.42, 1.25), 'axis']] });
  };
  stall('stall-x', STALL_X, 'apple', '#B5533C', 'Supplier X', '82/100 · £10.00 a part');
  stall('stall-y', STALL_Y, 'pear', '#8E9E45', 'Supplier Y', '74/100 · £9.40 a part');

  /* ---------- The balance scale ---------- */
  const sg = new THREE.Group(); sg.position.set(0, 0, SCALE_Z);
  const sBase = mat('surface'), sMetal = mat('muted'), sGold = mat('gold'), sDark = mat('mask');
  sg.add(box(2.0, .3, 1.3, sBase, 0, 0, 0, .15));
  sg.add(box(1.2, .2, .8, sBase, 0, .3, 0, .1));
  sg.add(cyl(.09, .13, PIVOT_Y - .5, sMetal, 0, .5, 0, 16));
  sg.add(sph(.2, sGold, 0, PIVOT_Y + .12, 0));
  const beam = new THREE.Group(); beam.position.y = PIVOT_Y; sg.add(beam);
  beam.add(box(ARM * 2, .16, .22, sMetal, 0, -.08, 0, .06));
  for (const x of [-ARM, ARM]) beam.add(sph(.13, sGold, x, 0, 0));
  beam.add(box(.07, .75, .07, sDark, 0, 0, .14));                                  // the pointer
  const dial = new THREE.Mesh(new THREE.CylinderGeometry(.5, .5, .04, 32, 1, false, -.9, 1.8), mat('paper'));
  dial.rotation.x = Math.PI / 2; dial.position.set(0, PIVOT_Y + .05, .1); sg.add(dial);
  const pans = [-1, 1].map(side => {
    const g = new THREE.Group();
    for (let i = 0; i < 3; i++) {
      const a = i * Math.PI * 2 / 3 + .5, end = V(Math.cos(a) * .6, -1.25, Math.sin(a) * .6), len = end.length();
      const s = new THREE.Mesh(new THREE.CylinderGeometry(.012, .012, len, 4), sDark);
      s.position.copy(end.clone().multiplyScalar(.5)); s.quaternion.setFromUnitVectors(V(0, 1, 0), end.clone().normalize()); g.add(s);
    }
    g.add(cyl(.72, .55, .1, sGold, 0, -1.33, 0, 32));
    const f = side < 0 ? apple(1.7) : pear(1.7); f.position.y = -1.23; g.add(f);
    sg.add(g); return g;
  });
  let tilt = 0;
  const setTilt = a => {
    tilt = a; beam.rotation.z = a;
    pans[0].position.set(-ARM * Math.cos(a), PIVOT_Y - ARM * Math.sin(a), 0);
    pans[1].position.set(ARM * Math.cos(a), PIVOT_Y + ARM * Math.sin(a), 0);
  };
  setTilt(0);
  part('scale', sg, { key: 'scale', label: 'Balance scale', labelY: 4.6 });
  const gapLbl = w.label(null, '8 points vs 60p a part', V(0, 5.3, SCALE_Z), 'sign');

  /* ---------- The workbench and its three tools ---------- */
  const bench = new THREE.Group(); bench.position.set(BENCH[0], 0, BENCH[1]);
  const bWood = mat('wood'), bDark = mat('muted');
  bench.add(box(4.6, .14, 1.6, bWood, 0, .9, 0, .08));
  for (const [x, z] of [[-2.1, -.65], [2.1, -.65], [-2.1, .65], [2.1, .65]]) bench.add(box(.14, .9, .14, bWood, x, 0, z));
  bench.add(box(4.2, .06, 1.3, bDark, 0, .3, 0));
  for (let i = 0; i < 3; i++) bench.add(box(.5, .3, .4, mat('paper'), -1.4 + i * 1.3, .36, -.2, .05));   // boxes on the shelf
  part('bench', bench);
  const TOP = 1.04;

  const lights = new THREE.Group(); lights.position.set(BENCH[0] - 1.5, TOP, BENCH[1]);
  const housing = mat('mask');
  lights.add(box(.3, .12, .3, housing, 0, 0, 0));
  lights.add(box(.55, 1.25, .4, housing, 0, .12, 0, .1));
  const lamps = ['#C8553D', '#E0A43A', '#5E9E5A'].map((col, i) => {
    const m = mat(col, { emissive: new THREE.Color(col), emissiveIntensity: .35, roughness: .3 });
    const lamp = sph(.15, m, 0, 1.1 - i * .37, .2, 1, 1, .6); lamp.userData.noGlow = true; lights.add(lamp);
    lights.add(box(.4, .04, .16, housing, 0, 1.25 - i * .37, .26));
    return m;
  });
  part('tool-lights', lights, { key: 'tool-lights', label: 'Traffic lights', labelY: 1.85 });

  const score = new THREE.Group(); score.position.set(BENCH[0], TOP, BENCH[1]);
  const scoreFace = mat('paper'), scoreRim = mat('muted'), scoreNeedle = mat('bad');
  score.add(box(.5, .1, .35, scoreRim, 0, 0, 0, .06));
  score.add(box(.1, .5, .1, scoreRim, 0, .1, 0));
  const disc = new THREE.Mesh(new THREE.CylinderGeometry(.55, .55, .08, 36), scoreFace); disc.rotation.x = Math.PI / 2; disc.position.set(0, 1.05, 0); score.add(disc);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(.55, .04, 8, 36), scoreRim); rim.position.set(0, 1.05, .02); score.add(rim);
  for (let i = 0; i <= 10; i++) { const a = Math.PI * (1.15 - i * .13); const t = box(.03, .1, .02, scoreRim, Math.cos(a) * .44, 1.0 + Math.sin(a) * .44, .05); t.rotation.z = a - Math.PI / 2; score.add(t); }
  const needle = new THREE.Group(); needle.position.set(0, 1.05, .07); score.add(needle);
  needle.add(box(.04, .42, .02, scoreNeedle, 0, 0, 0));
  const needleAt = n => { needle.rotation.z = Math.PI * .5 - (n / 100) * Math.PI * 1.3 + Math.PI * .15; };   // 0 to 100 across the dial
  needleAt(82);
  part('tool-score', score, { key: 'tool-score', label: 'Scores', labelY: 2.15, extra: [['82/100', V(0, .62, .3), 'axis']] });

  const money = new THREE.Group(); money.position.set(BENCH[0] + 1.5, TOP, BENCH[1]);
  const coinM = mat('gold'), coinEdge = mat('muted');
  const coins = [];
  for (let s = 0; s < 2; s++) for (let i = 0; i < (s ? 3 : 5); i++) {
    const c = cyl(.24, .24, .07, i % 2 ? coinEdge : coinM, s ? .35 : -.15, i * .075, s ? .15 : -.05, 28); money.add(c); coins.push(c);
  }
  money.add(box(.36, .3, .3, mat('accent'), .1, 0, -.35, .1));          // a little tape measure, a hint of what's coming
  part('tool-money', money, { key: 'tool-money', label: 'Money', labelY: 1.85, extra: [['£', V(0, 1.05, 0), 'coin']] });

  /* ---------- The Ruler: a giant tape measure marked in pounds ---------- */
  const rg = new THREE.Group(); rg.position.set(RULER_X0, 0, RULER_Z);
  const caseM = mat('accent'), tapeM = mat('gold'), tickM = mat('mask'), standM = mat('muted');
  rg.add(box(1.15, 1.1, .9, caseM, -.6, 0, 0, .3));
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(.32, .32, .06, 28), tickM); hub.rotation.x = Math.PI / 2; hub.position.set(-.6, .55, .47); rg.add(hub);
  for (const x of [1, 9]) rg.add(box(.3, .36, .4, standM, x, 0, 0, .08));
  const blade = new THREE.Group(); blade.position.set(0, .4, 0); blade.rotation.x = .6; rg.add(blade);
  const tape = new THREE.Group(); blade.add(tape);
  tape.add(box(10, .04, .6, tapeM, 5, 0, 0));
  for (let i = 0; i <= 20; i++) tape.add(box(.05, .02, i % 2 ? .18 : .34, tickM, i * .5, .04, i % 2 ? -.21 : -.13));
  const tapeLabels = ['£0', '20p', '40p', '60p', '80p', '£1'].map((t, i) => { const l = w.label('ruler', t, V(i * 2, .06, .16), 'axis'); tape.add(l.obj); return l; });
  const marker = (m, text, y) => {
    const g = new THREE.Group();
    g.add(cyl(.05, .05, 1.3, m, 0, 0, 0, 8));
    g.add(box(.5, .3, .03, m, .26, 1.0, 0));
    const l = w.label('ruler', text, V(0, y, 0), 'sign'); g.add(l.obj);
    g.position.set(0, .5, -.05); rg.add(g); return { g, l };
  };
  const gapMark = marker(mat('bad'), 'Price gap: 60p', 1.75);
  const pointsMark = marker(mat('ink'), '8 points: 90p (say)', 2.25);
  gapMark.g.position.x = 6;
  const rulerPart = part('ruler', rg, { key: 'ruler', label: 'The Ruler', labelY: 1.75 });
  rulerPart.labels.push(...tapeLabels);
  rulerPart.labels[0].obj.position.x = -.6;
  tape.scale.x = .001; tapeLabels.forEach(l => { l.el.style.opacity = 0; });
  const showMark = (mk, on) => { mk.g.visible = on; mk.l.obj.visible = on; mk.l.el.hidden = !on; };

  /* ---------- Four mishaps: what goes wrong without money ---------- */
  const drop = new THREE.Group(); drop.position.set(-3.4, 0, 4.6);
  const dropCrate = box(.9, .55, .7, mat('wood'), 0, 0, 0, .06); dropCrate.rotation.z = 1.25; dropCrate.position.set(-.15, .45, 0); drop.add(dropCrate);
  [[.35, .25], [.7, -.1], [.55, .35], [1.0, .2]].forEach(([x, z], i) => { const a = apple(1); a.position.set(x, 0, z); a.rotation.z = i * .8; drop.add(a); });
  part('mishap-drop', drop, { key: 'mishap-drop', label: 'Dropped on cost', labelY: 1.5 });

  const users = new THREE.Group(); users.position.set(1.0, 0, 4.6);
  const stoolM = mat('wood'), hatM = mat('gold');
  users.add(cyl(.38, .38, .1, stoolM, 0, .7, 0, 24));
  for (let i = 0; i < 3; i++) { const a = i * Math.PI * 2 / 3; const leg = box(.07, .72, .07, stoolM, Math.cos(a) * .26, 0, Math.sin(a) * .26); leg.rotation.z = Math.cos(a) * -.08; users.add(leg); }
  const hat = new THREE.Mesh(new THREE.SphereGeometry(.25, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), hatM); hat.position.set(0, .8, 0); users.add(hat);
  users.add(cyl(.32, .32, .03, hatM, 0, .8, .03, 24));
  part('mishap-users', users, { key: 'mishap-users', label: 'Users not asked', labelY: 1.5 });

  const fight = new THREE.Group(); fight.position.set(3.2, 0, 4.6);
  const ropeM = mat('wood'), knotM = mat('bad'), tugM = mat('muted');
  const rope = new THREE.Mesh(new THREE.CylinderGeometry(.05, .05, 2.2, 8), ropeM); rope.rotation.z = Math.PI / 2; rope.position.y = .55; fight.add(rope);
  const knot = new THREE.Group(); knot.position.y = .55; fight.add(knot);
  knot.add(sph(.1, knotM));
  knot.add(box(.04, .45, .3, knotM, 0, -.45, 0));
  for (const x of [-1.25, 1.25]) { fight.add(cyl(.18, .22, .5, tugM, x, 0, 0, 14)); fight.add(sph(.16, tugM, x, .62, 0)); }
  part('mishap-fight', fight, { key: 'mishap-fight', label: 'Award fight', labelY: 1.5 });

  /* ---------- The veto sign that goes up on Y's stall ---------- */
  const veto = new THREE.Group(); veto.position.set(5.1, 0, -3.25);
  const vPost = mat('muted'), vStop = mat('bad'), vBar = mat('paper'), vTag = mat('gold'), vHole = mat('raised');
  veto.add(box(.5, .08, .5, vPost, 0, 0, 0, .1));
  veto.add(cyl(.05, .05, 1.75, vPost, 0, 0, 0, 8));
  const vHead = new THREE.Group(); vHead.position.y = 2.25; veto.add(vHead);
  const stopFace = new THREE.Group(); vHead.add(stopFace);
  const oct = new THREE.Mesh(new THREE.CylinderGeometry(.62, .62, .08, 8), vStop); oct.rotation.set(Math.PI / 2, Math.PI / 8, 0); stopFace.add(oct);
  stopFace.add(box(.75, .16, .02, vBar, 0, -.08, .05));
  const tagFace = new THREE.Group(); vHead.add(tagFace);
  tagFace.add(box(1.3, .8, .06, vTag, 0, -.4, 0, .1));
  const hole = new THREE.Mesh(new THREE.CylinderGeometry(.07, .07, .08, 16), vHole); hole.rotation.x = Math.PI / 2; hole.position.set(-.48, .22, 0); tagFace.add(hole);
  tagFace.rotation.z = -.12;
  const vetoPart = part('veto', veto, { key: 'veto', extra: [['No: warranty too short', V(0, 1.15, .3), 'sign']] });
  const vetoLbl = vetoPart.labels[0];

  /* ---------- The sorting yard: a stop sign, a price tag, and five objection crates ---------- */
  const stopG = new THREE.Group(); stopG.position.set(5.4, 0, 3.0);
  const sTray = mat('surface'), sPostM = mat('muted'), sRed = mat('bad'), sBand = mat('paper');
  stopG.add(box(2.0, .06, 1.5, sTray, 0, 0, .75, .2));
  stopG.add(cyl(.06, .06, 1.9, sPostM, 0, 0, 0, 8));
  const sOct = new THREE.Mesh(new THREE.CylinderGeometry(.72, .72, .1, 8), sRed); sOct.rotation.set(Math.PI / 2, Math.PI / 8, 0); sOct.position.y = 2.35; stopG.add(sOct);
  stopG.add(box(.9, .2, .02, sBand, 0, 2.25, .06));
  part('stop', stopG, { key: 'stop', label: '"No" stays "No"', labelY: 3.45 });

  const tagG = new THREE.Group(); tagG.position.set(9.4, 0, 3.0);
  const tTray = mat('surface'), tPostM = mat('muted'), tGold = mat('gold'), tHole = mat('raised');
  tagG.add(box(2.8, .06, 1.6, tTray, 0, 0, .75, .2));
  tagG.add(cyl(.06, .06, 1.9, tPostM, 0, 0, 0, 8));
  const tagBody = new THREE.Group(); tagBody.position.y = 2.35; tagBody.rotation.z = -.15; tagG.add(tagBody);
  tagBody.add(box(1.5, .9, .08, tGold, 0, -.45, 0, .12));
  const tHoleM = new THREE.Mesh(new THREE.CylinderGeometry(.08, .08, .1, 16), tHole); tHoleM.rotation.x = Math.PI / 2; tHoleM.position.set(-.55, .25, 0); tagBody.add(tHoleM);
  part('tag', tagG, { key: 'tag', label: '"Yes, if…"', labelY: 3.45, extra: [['£', V(.1, 2.35, .2), 'coin']] });

  const crates = {};
  OBJ.forEach((o, i) => {
    const g = new THREE.Group();
    const cw = mat('wood'), slat = mat('muted'), note = mat('paper');
    g.add(box(.7, .55, .6, cw, 0, 0, 0, .05));
    for (const y of [.12, .38]) g.add(box(.72, .05, .62, slat, 0, y, 0));
    g.add(box(.36, .26, .02, note, 0, .14, .31));
    g.position.set(...START[o.id]);
    crates[o.id] = part('obj-' + o.id, g, { key: 'obj-' + o.id, label: o.label, labelY: i % 2 ? 1.45 : 1.0, cls: 'axis' });
  });

  /* ---------- Max, Libby and a gossiping neighbour ---------- */
  const neighbour = { ...CAST.detective, name: 'Neighbour', top: '#8C8478', topDark: '#6E675D', trousers: '#4A4740', hair: '#5A4A3E', hat: null, moustache: false, coat: false, height: .95 };
  const c = cast(w, { max: MAX_HOME, libby: LIB_HOME, gossip: { spec: neighbour, at: [-1.2, 4.9] } });

  /* ---------- Animation: the wobbling scale and the tug of war ---------- */
  const api = Object.assign(c, {
    scaleMode: 'wobble', vetoFlipped: false, sortState: 'start', pointsShown: false
  });
  w.onTick((t, dt) => {
    const target = api.scaleMode === 'wobble' ? Math.sin(t * 2.6) * .2 + Math.sin(t * 6.3) * .05 : api.scaleMode === 'x' ? .17 : 0;
    setTilt(tilt + (target - tilt) * Math.min(1, dt * (api.scaleMode === 'wobble' ? 6 : 2.5)));
    if (parts['mishap-fight'].on) { const s = Math.sin(t * 3.1) * .18 + Math.sin(t * 7.7) * .05; rope.position.x = s; knot.position.x = s; }
  });

  /* ---------- Moves the tour uses ---------- */
  const GROUPS = {
    scale: ['scale'], bench: ['bench', 'tool-lights', 'tool-score', 'tool-money'], ruler: ['ruler'],
    mishaps: ['mishap-drop', 'mishap-users', 'mishap-fight'], veto: ['veto'],
    sort: ['stop', 'tag', ...OBJ.map(o => 'obj-' + o.id)]
  };
  /* Show exactly the groups named, popping in any that were hidden. Every step calls this, so ?step=N works. */
  api.setup = async (want = {}) => {
    const pops = [];
    let n = 0;
    for (const [g, names] of Object.entries(GROUPS)) for (const name of names) {
      const p = parts[name];
      if (want[g] && !p.on) { const d = n++ * 90; pops.push(new Promise(r => setTimeout(r, d)).then(() => p.pop())); }
      else if (!want[g] && p.on) p.show(false);
    }
    c.show('gossip', !!want.mishaps);
    showMark(gapMark, false); showMark(pointsMark, false);
    await Promise.all(pops);
    if (want.ruler) {
      if (want.tape !== false) { tape.scale.x = 1; tapeLabels.forEach(l => { l.el.style.opacity = 1; }); }
      const full = tape.scale.x > .99;
      showMark(gapMark, full); showMark(pointsMark, full && api.pointsShown);
    }
  };
  api.gapLabel = on => { gapLbl.obj.visible = on; gapLbl.el.hidden = !on; };
  api.popFruit = async () => {
    fruitGroups.forEach(f => f.scale.set(1, .001, 1));
    await animate(800, k => fruitGroups.forEach(f => f.scale.set(1, Math.max(.001, k), 1)));
  };
  /* Unroll the tape from its case */
  api.unroll = async () => {
    showMark(gapMark, false); showMark(pointsMark, false);
    tape.scale.x = .001;
    await animate(1300, k => { tape.scale.x = Math.max(.001, k); tapeLabels.forEach(l => { l.el.style.opacity = k; }); });
    gapMark.g.scale.set(1, .001, 1); showMark(gapMark, true);
    await animate(500, k => gapMark.g.scale.set(1, Math.max(.001, k), 1));
  };
  api.rulerUnrolled = () => tape.scale.x > .99;
  /* Slide the "8 points" marker along the tape to 90p */
  api.slidePoints = async () => {
    api.pointsShown = true; showMark(pointsMark, true);
    pointsMark.g.position.x = 0;
    await animate(1500, k => { pointsMark.g.position.x = 9 * k; });
  };
  api.placePoints = () => { api.pointsShown = true; showMark(pointsMark, true); pointsMark.g.position.x = 9; };
  api.hidePoints = () => { api.pointsShown = false; showMark(pointsMark, false); };
  /* The traffic light blinks amber, the score needle swings, the coins jump */
  api.toolShow = async () => {
    await animate(1600, k => {
      lamps.forEach((m, i) => { m.emissiveIntensity = i === 1 ? .35 + Math.abs(Math.sin(k * Math.PI * 4)) * 1.2 : .15; });
      needleAt(82 + Math.sin(k * Math.PI * 3) * 14 * (1 - k));
      coins.forEach((cn, i) => { cn.position.y = (i < 5 ? i : i - 5) * .075 + Math.max(0, Math.sin((k * 2 - i * .08) * Math.PI)) * .35; });
    });
    lamps.forEach(m => { m.emissiveIntensity = .35; }); needleAt(82);
    coins.forEach((cn, i) => { cn.position.y = (i < 5 ? i : i - 5) * .075; });
  };
  /* The veto sign: a stop sign that flips round to a price tag */
  api.setVeto = flipped => {
    api.vetoFlipped = flipped; stopFace.visible = !flipped; tagFace.visible = flipped; vHead.rotation.y = 0;
    vetoLbl.set(flipped ? 'Yes, if £120k lower' : 'No: warranty too short');
  };
  api.flipVeto = async () => {
    await animate(350, k => { vHead.rotation.y = k * Math.PI / 2; });
    api.setVeto(true); vHead.rotation.y = Math.PI / 2;
    await animate(450, k => { vHead.rotation.y = (1 - k) * Math.PI / 2; vHead.position.y = 2.25 + Math.sin(k * Math.PI) * .3; });
    vHead.position.y = 2.25;
  };
  /* Crates: put them all in a state at once, or fly one along an arc */
  const spotFor = (id, state) => {
    if (state === 'start') return START[id];
    if (id === 'safety' && state === 'mistake') return WRONG;
    return SPOT[id];
  };
  api.placeCrates = state => {
    api.sortState = state;
    OBJ.forEach(o => { crates[o.id].group.position.set(...spotFor(o.id, state)); crates[o.id].group.rotation.set(0, 0, 0); });
  };
  api.flyCrate = async (id, to, ms = 650) => {
    const g = crates[id].group, from = g.position.clone(), dest = V(...to), spin = (Math.random() - .5) * .6;
    await animate(ms, k => { g.position.lerpVectors(from, dest, k); g.position.y += Math.sin(k * Math.PI) * 1.8; g.rotation.y = spin * Math.sin(k * Math.PI); });
    g.rotation.y = 0;
  };
  api.sortAll = async () => {
    for (const id of ['warranty', 'audit', 'distance', 'clause']) await api.flyCrate(id, SPOT[id]);
    await api.flyCrate('safety', WRONG, 800);
    api.sortState = 'mistake';
  };
  /* Walk (or hop, when the tape is in the way) to these spots. Anyone already there stays put. */
  api.goTo = async (spots, { hop = false } = {}) => {
    await Promise.all(Object.entries(spots).map(([who, to]) => {
      const r = c.chars[who].root, d = Math.hypot(r.position.x - to[0], r.position.z - to[1]);
      if (d < .05) return null;
      return hop ? c.hop(who, to, 700 + d * 60) : c.walk(who, to, 500 + d * 170);
    }));
  };
  api.homeAll = (opts) => api.goTo({ max: MAX_HOME, libby: LIB_HOME }, opts);

  /* Start state: only the stalls and the hosts */
  for (const [name, p] of Object.entries(parts)) if (name !== 'stall-x' && name !== 'stall-y') p.show(false);
  api.gapLabel(false);
  api.setVeto(false);
  api.placeCrates('start');
  c.show('gossip', false);
  return api;
}

/* ---------- State cards: what each object knows at this point in the story ---------- */
export function card(key, ctx) {
  const { api, reached } = ctx;
  const priced = reached('worth');
  const obj = OBJ.find(o => 'obj-' + o.id === key);
  if (obj) {
    const yes = obj.bin === 'tag';
    const mistaken = obj.id === 'safety' && api.sortState === 'mistake';
    return {
      kicker: 'Objection · ' + obj.label, title: obj.text,
      rows: [['Can it be priced?', yes ? 'Yes' : 'No, it\'s a hard stop'], ['Belongs on', yes ? 'The price tag: "Yes, if…"' : 'The stop sign: "No" stays "No"'],
        ...(mistaken ? [['Where Max put it', 'On the price tag, by mistake']] : [])],
      text: obj.why + (yes ? ' The supplier stays in the race.' : '')
    };
  }
  const where = bin => OBJ.filter(o => api.sortState !== 'start' && (o.id === 'safety' && api.sortState === 'mistake' ? bin === 'tag' : o.bin === bin)).map(o => o.label).join(', ') || 'Nothing yet';
  const C = {
    max: {
      kicker: 'Buyer · picks the cheapest quote', title: 'Max',
      rows: [['Plan', 'Buy whatever is cheapest'], ['Picked', reached('grab') ? 'Y, at £9.40 a part' : 'Not yet'], ['Missed', 'What the 8 points are worth'],
        ...(priced ? [['Learned', 'Price the difference, then compare']] : [])],
      text: priced ? 'Once the 8 points were priced at 90p a part, the dearer apples turned out to be the better value.' : 'Max grabs the biggest number in front of him. Today that means the smallest price tag.'
    },
    libby: {
      kicker: 'Buyer · puts a price on every difference', title: 'Libby',
      rows: [['Plan', 'Turn every difference into pounds'], ['Asks', 'Better by how much, and is it worth it?'], ['Tools', reached('ruler') ? 'A scale, a workbench and the Ruler' : 'A scale and a workbench']],
      text: 'Libby doesn\'t argue about which supplier feels better. She asks what each difference is worth in money, then adds it up.'
    },
    gossip: {
      kicker: 'Mishap 2 of 4', title: 'A veto on a rumour',
      rows: [['What happened', 'Someone blocked a supplier on hearsay'], ['Evidence', 'None'], ['Fix', 'Ask what it would cost if true, then check it']],
      text: 'A rumour has no price, so it gets argued about instead of measured. Priced, it becomes a charge you can check, or a real hard stop.'
    },
    'stall-x': {
      kicker: 'Supplier X · the apple stall', title: 'Supplier X',
      rows: [['Score', '82/100'], ['Quoted price', '£10.00 a part'], ['Against Y', '8 points better, 60p a part dearer'],
        ...(priced ? [['8 points worth (say)', '90p a part']] : [])],
      text: priced ? 'With the 8 points worth 90p a part to you, X is better value by 30p a part, even with the higher quote.' : 'The higher score. But a score tells you who\'s better, not by how much.'
    },
    'stall-y': {
      kicker: 'Supplier Y · the pear stall', title: 'Supplier Y',
      rows: [['Score', '74/100'], ['Quoted price', '£9.40 a part'], ['Against X', '60p a part cheaper, 8 points lower'],
        ...(reached('yes-if') ? [['Status', api.vetoFlipped ? 'In the race, if £120k lower' : 'Vetoed: warranty too short']] : [])],
      text: api.vetoFlipped ? 'The shorter warranty costs you £120k, so it\'s priced in. Y stays in the race instead of being vetoed.' : 'The cheaper quote. Whether it\'s better value depends on what the 8 missing points cost you.'
    },
    scale: {
      kicker: 'Comparing them directly', title: 'The balance scale',
      rows: [['Left pan', 'X: 82/100 at £10.00'], ['Right pan', 'Y: 74/100 at £9.40'],
        ['Settles?', api.scaleMode === 'wobble' ? 'No: points and pounds don\'t mix' : api.scaleMode === 'x' ? 'Tips to X, by 30p a part' : 'Yes: both sides now in pounds']],
      text: api.scaleMode === 'wobble' ? 'You can\'t weigh points against pounds, and you can\'t average them either. They\'re different units.' : 'Once every difference is in pounds, the two sides can finally be weighed against each other.'
    },
    bench: {
      kicker: 'Three ways to compare', title: 'The workbench',
      rows: [['Tool 1', 'Traffic lights'], ['Tool 2', 'Scores'], ['Tool 3', 'Money']],
      text: 'Three tools for comparing suppliers that aren\'t alike. Only one of them can tell you by how much.'
    },
    'tool-lights': {
      kicker: 'Way 1 of 3', title: 'Traffic lights',
      rows: [['Says', 'Red, amber or green'], ['Good for', 'A quick first look'], ['Can\'t say', 'How much "amber" is worth']],
      text: 'Quick, but you can\'t add three ambers and a green, or set them against a lower price.'
    },
    'tool-score': {
      kicker: 'Way 2 of 3', title: 'Scores',
      rows: [['Says', 'X 82/100, Y 74/100'], ['Looks', 'Precise'], ['Really', 'It ranks, it doesn\'t price']],
      text: 'A score tells you who\'s better. It can\'t tell you whether 8 points are worth 60p a part.'
    },
    'tool-money': {
      kicker: 'Way 3 of 3', title: 'Money',
      rows: [['Says', 'Every difference in pounds'], ['Can you add it up?', 'Yes'], ['Same unit as the price?', 'Yes']],
      text: 'Money tells you by how much one supplier is better, and whether it\'s worth paying for.'
    },
    ruler: {
      kicker: 'Race, Ruler, Rulebook', title: 'The Ruler',
      rows: [['Measures in', 'Pounds'], ['Compares', 'Every supplier like for like'], ['Price gap', '60p a part'],
        ...(api.pointsShown ? [['8 points worth (say)', '90p a part'], ['Better value', priced ? 'X, by 30p a part' : 'Work it out']] : [])],
      text: 'The Ruler is the second part of Race, Ruler, Rulebook: one measure for every supplier. In this course, the Ruler is money.'
    },
    'mishap-drop': {
      kicker: 'Mishap 1 of 4', title: 'Dropped on cost alone',
      rows: [['What happened', 'A good supplier lost on price alone'], ['Why', 'Its better quality had no £ value'], ['Fix', 'Price the quality, then compare']],
      text: 'If quality isn\'t in pounds, only the price counts, and the better supplier goes out first.'
    },
    'mishap-users': {
      kicker: 'Mishap 3 of 4', title: 'The users weren\'t asked',
      rows: [['What happened', 'Suppliers judged without the people who\'ll use the part'], ['Missed', 'What the differences cost them'], ['Fix', 'Each team prices its own concerns']],
      text: 'The empty stool is the team that will actually use the part. Without them, nobody knows what a difference is really worth.'
    },
    'mishap-fight': {
      kicker: 'Mishap 4 of 4', title: 'The award turns into a fight',
      rows: [['What happened', 'Teams pull for different winners'], ['Why', 'Nobody agreed what a difference is worth'], ['Fix', 'Put it in pounds and let the sums decide']],
      text: 'Without money, the loudest voice wins the tug of war. With it, the argument is about numbers you can check.'
    },
    veto: {
      kicker: 'An objection about Supplier Y', title: api.vetoFlipped ? 'Yes, if £120k lower' : 'No: warranty too short',
      rows: [['Objection', 'Their warranty\'s too short'], ['Cost to us', api.vetoFlipped ? '£120k' : 'Not priced yet'], ['Becomes', api.vetoFlipped ? 'Use them if their price is £120k lower' : 'A flat "No"']],
      text: api.vetoFlipped ? 'Turning a "No" into a "Yes, if…" keeps Y in the race, so the race gets harder for everyone.' : 'A "No" knocks Y out of the race. But a short warranty has a cost, and a cost can be priced.'
    },
    stop: {
      kicker: 'Hard stops', title: '"No" stays "No"',
      rows: [['For', 'Things no price can fix'], ['Holds', where('stop')]],
      text: 'A legal requirement, or quality below the minimum. It stays a no until the problem is fixed.'
    },
    tag: {
      kicker: 'Things you can price', title: '"Yes, if…"',
      rows: [['For', 'Anything with a cost you can estimate'], ['Holds', where('tag')]],
      text: 'Price it as a charge and the supplier stays in. More suppliers in means a harder race.'
    }
  };
  return C[key] || { kicker: '', title: key, rows: [], text: '' };
}

/* ---------- Camera presets: [position, target] for wide screens and for phones ---------- */
const OVER = { wide: [[0, 20, 27], [0, .6, -.4]], phone: [[0, 33, 36], [0, .6, -.4]] };
const MARKET = { wide: [[0, 10, 21], [0, 1.6, -2.8]], phone: [[0, 16, 25], [0, 1.2, -2.5]] };
const GRAB = { wide: [[3.2, 6.8, 9.5], [4.4, 1.6, -2.6]], phone: [[3.6, 9.5, 13.5], [4.4, 1.4, -2.6]] };
const SCALE = { wide: [[0, 6, 12], [0, 1.9, -3.4]], phone: [[0, 9, 16], [0, 1.8, -3.2]] };
const BENCHCAM = { wide: [[-7.6, 6, 14.5], [-7.6, 1.4, 3.3]], phone: [[-7.4, 9.5, 18.5], [-7.4, 1.3, 3.3]] };
const RULER = { wide: [[-.4, 8, 15], [-.4, 1.5, -1.6]], phone: [[-.4, 13, 20], [-.4, 1.2, -1.4]] };
const MISHAP = { wide: [[.3, 7, 15], [.3, 1, 2.6]], phone: [[.3, 11, 19], [.3, .9, 2.4]] };
const SORT = { wide: [[7.4, 7.2, 15], [7.4, 1.3, 3.6]], phone: [[7.4, 11, 19], [7.4, 1.1, 3.6]] };

/* The scene each step needs, as api.setup() flags */
const SET = {
  start: {}, scale: { scale: true }, bench: { scale: true, bench: true }, ruler: { scale: true, bench: true, ruler: true },
  mishaps: { scale: true, bench: true, ruler: true, mishaps: true }, veto: { scale: true, bench: true, ruler: true, veto: true },
  sort: { scale: true, bench: true, ruler: true, veto: true, sort: true }
};
const fresh = api => { api.clearThoughts(); api.gapLabel(false); api.poses('idle'); };

/* ---------- The guided tour ---------- */
export const steps = [
  {
    id: 'market', title: 'Two stalls, one order',
    lines: [
      { who: 'libby', text: 'Welcome to the market! Two suppliers want our order for a part. Supplier X runs the apple stall, Supplier Y the pears.' },
      { who: 'max', text: 'Easy. We pick one and go for lunch.' },
      { who: 'libby', text: 'Real suppliers are never alike. Comparing them is comparing apples with pears.' }
    ],
    cam: MARKET, task: { click: ['stall-x', 'stall-y'], all: true, say: 'Click both stalls to read their quotes.' },
    async enter(api) {
      fresh(api); api.scaleMode = 'wobble'; api.setVeto(false); api.hidePoints(); api.placeCrates('start');
      await Promise.all([api.setup(SET.start), api.homeAll()]);
      api.faces('happy'); api.chars.max.pose('wave'); setTimeout(() => api.chars.max.pose('idle'), 2400);
      await api.popFruit();
    },
    done(api) { api.faces('grin', 'happy'); }
  },
  {
    id: 'grab', title: 'Max grabs the cheapest quote',
    lines: [
      { who: 'max', text: '£9.40 a part beats £10.00. Cheapest wins, I\'m buying pears!' },
      { who: 'libby', text: 'Cheaper, yes. But X scores 82 out of 100 and Y scores 74. Are those 8 points worth 60p a part?' }
    ],
    cam: GRAB, task: { click: ['max'], say: 'Click Max to see how he picked.' },
    async enter(api) {
      fresh(api); await api.setup(SET.start);
      api.faces('grin', 'think');
      await api.goTo({ max: AT_PEARS, libby: LIB_HOME });
      api.chars.max.pose('cheer'); setTimeout(() => api.chars.max.pose('idle'), 1800);
    },
    done(api) { api.faces('think', 'happy'); api.chars.max.pose('shrug'); api.say('max', 'Worth 60p? No idea.', 2200); }
  },
  {
    id: 'scale', title: 'Weighing apples against pears',
    lines: [
      { who: 'libby', text: 'Let\'s weigh them up. X on the left pan, Y on the right.' },
      { who: 'max', text: 'It won\'t settle! It just keeps wobbling.' },
      { who: 'libby', text: 'One side is in points, the other in pounds. Different units can\'t balance.' }
    ],
    cam: SCALE, task: { click: ['scale'], say: 'Click the scale.' },
    async enter(api) {
      fresh(api); api.scaleMode = 'wobble';
      await Promise.all([api.homeAll(), api.setup(SET.scale)]);
      api.faces('surprised', 'think');
    },
    done(api) { api.faces('worried', 'happy'); api.chars.max.pose('shrug'); }
  },
  {
    id: 'bench', title: 'Three ways to compare',
    lines: [
      { who: 'libby', text: 'There are three ways to compare. <b>Traffic lights</b> (red, amber, green) are quick. But how much is "amber" worth?' },
      { who: 'libby', text: '<b>Scores</b> like 82/100 look precise, and aren\'t. <b>Money</b> turns every difference into pounds, so you can add them up.' },
      { who: 'max', text: 'Pounds I understand!' }
    ],
    cam: BENCHCAM, task: { click: ['tool-lights', 'tool-score', 'tool-money'], all: true, say: 'Click all three tools on the workbench.' },
    async enter(api) {
      fresh(api); api.scaleMode = 'wobble';
      await Promise.all([api.setup(SET.bench), api.goTo(AT_BENCH)]);
      api.faces('happy', 'happy'); api.chars.libby.pose('point');
    },
    async done(api) { api.poses('cheer', 'idle'); api.faces('grin', 'happy'); await api.toolShow(); api.poses('idle'); }
  },
  {
    id: 'points', title: 'Points or pounds?',
    lines: [
      { who: 'max', text: 'X scores higher, so X wins. No, wait, Y is cheaper, so Y wins. Hmm.' },
      { who: 'libby', text: 'Here\'s the real question. Look at both quotes.' }
    ],
    cam: MARKET,
    task: { choice: { q: 'Supplier X scores 82/100 at £10.00 a part. Supplier Y scores 74/100 at £9.40. Who\'s better value?', options: [
      { text: 'X, it scores higher', why: 'Higher, but is it 60p a part better? The score can\'t say.' },
      { text: 'Y, it\'s cheaper', why: 'Maybe, if the 8 points are worth less than 60p a part to you. You don\'t know that yet.' },
      { text: 'You can\'t tell until the 8 points are priced in money', ok: true, why: 'Right. Scores rank suppliers; they don\'t price the difference.' },
      { text: 'Average the score and the price', why: 'You can\'t average points and pounds. They\'re different units.' }
    ] } },
    async enter(api) {
      fresh(api); api.scaleMode = 'wobble';
      await Promise.all([api.setup(SET.bench), api.homeAll()]);
      api.gapLabel(true); api.faces('think', 'happy'); api.chars.max.pose('think');
    },
    done(api) { api.chars.max.pose('idle'); api.faces('surprised', 'happy'); api.think('libby', 'Price the <b>8 points</b>'); }
  },
  {
    id: 'ruler', title: 'The Ruler turns it into money',
    lines: [
      { who: 'libby', text: 'Meet <b>the Ruler</b>: one measure that compares every supplier like for like. In this course, the Ruler is money.' },
      { who: 'max', text: 'A giant tape measure, marked in pounds? I love it.' },
      { who: 'libby', text: 'The price gap is 60p a part. Next, we put the 8 points on the same tape.' }
    ],
    cam: RULER, task: { click: ['ruler'], say: 'Click the tape measure.' },
    async enter(api) {
      fresh(api); api.scaleMode = 'wobble'; api.hidePoints();
      await Promise.all([api.setup({ ...SET.ruler, tape: false }), api.homeAll()]);
      if (!api.rulerUnrolled()) await api.unroll();
      api.faces('grin', 'happy');
    },
    done(api) { api.scaleMode = 'level'; api.faces('surprised', 'happy'); api.say('libby', 'Same units at last, so the scale can settle.', 2600); }
  },
  {
    id: 'worth', title: 'Price the 8 points',
    lines: [
      { who: 'max', text: 'So who\'s better value? I\'m getting hungry.' },
      { who: 'libby', text: 'Say the team works out that the 8 extra points save us 90p a part. Watch the tape.' }
    ],
    cam: RULER,
    task: { choice: { q: 'Say the 8 extra points are worth 90p a part to you. Who\'s better value now?', options: [
      { text: 'Y, it\'s still 60p cheaper', why: 'The 8 points are worth 90p to you, more than the 60p you\'d save. Y costs you 30p a part more.' },
      { text: 'X, because the 8 points are worth more than the 60p gap', ok: true, why: 'Right. In money, X is better value by 30p a part. If the points were worth less than 60p, Y would win.' },
      { text: 'Still can\'t tell', why: 'You can now. Both differences are in pounds, on the same Ruler.' }
    ] } },
    async enter(api) {
      fresh(api); api.scaleMode = 'level';
      await Promise.all([api.setup(SET.ruler), api.homeAll()]);
      api.faces('think', 'happy');
      await api.slidePoints();
    },
    done(api) { api.scaleMode = 'x'; api.faces('grin', 'happy'); api.chars.max.pose('cheer'); api.say('max', 'Apples it is! Better by 30p a part.', 2600); setTimeout(() => api.chars.max.pose('idle'), 2200); }
  },
  {
    id: 'mishaps', title: 'What goes wrong without money',
    lines: [
      { who: 'libby', text: 'When differences aren\'t priced, the same four things keep going wrong. Here they come.' },
      { who: 'max', text: 'Oh no. It\'s a whole parade of trouble.' }
    ],
    cam: MISHAP, task: { click: ['mishap-drop', 'gossip', 'mishap-users', 'mishap-fight'], all: true, say: 'Click all four mishaps.' },
    async enter(api) {
      fresh(api); api.scaleMode = 'x'; api.placePoints();
      await Promise.all([api.setup(SET.mishaps), api.homeAll()]);
      api.think('gossip', 'I heard X is always late…');
      api.faces('worried', 'think');
    },
    done(api) { api.think('gossip', null); api.faces('happy', 'grin'); api.say('libby', 'Put the differences in pounds and all four go away.', 2600); }
  },
  {
    id: 'yes-if', title: 'Turn a No into a Yes, if…',
    lines: [
      { who: 'max', text: 'Uh oh. Engineering stuck a big No on Y\'s stall. They say the warranty\'s too short.' },
      { who: 'libby', text: 'One idea fixes this: turn a <b>"No" into a "Yes, if…"</b>. Put a price on what the shorter warranty costs us.' }
    ],
    cam: MARKET,
    task: { choice: { q: '"We can\'t use them, their warranty\'s too short." What does Libby turn that into?', options: [
      { text: 'Drop Y: a No is a No', why: 'Only a hard stop stays a No. A short warranty has a cost, so price it.' },
      { text: 'Use them if their price is £120k lower, which is what the shorter warranty costs us', ok: true, why: 'Right. The "No" becomes a "Yes, if…", and Y stays in the race.' },
      { text: 'Ignore the warranty, price is all that matters', why: 'Then the cost of the missing cover lands on you later, unpriced.' }
    ] } },
    async enter(api) {
      fresh(api); api.scaleMode = 'x'; api.placePoints(); api.setVeto(false);
      await Promise.all([api.setup(SET.veto), api.homeAll()]);
      api.faces('worried', 'think');
    },
    async done(api) {
      await api.flipVeto();
      api.faces('grin', 'happy'); api.chars.libby.pose('cheer');
      api.say('libby', 'Y stays in. More suppliers in means a harder race.', 2600);
      setTimeout(() => api.chars.libby.pose('idle'), 2000);
    }
  },
  {
    id: 'sort', title: 'No, or yes if?',
    lines: [
      { who: 'libby', text: 'Five more objections came in. Some are hard stops: a <b>"No" stays "No"</b>. The rest can be priced.' },
      { who: 'max', text: 'Stop sign for the hard stops, price tag for the rest. Got it!' }
    ],
    cam: SORT, task: { click: OBJ.map(o => 'obj-' + o.id), all: true, say: 'Click each objection crate to see where it goes.' },
    async enter(api) {
      fresh(api); api.scaleMode = 'x'; api.placePoints(); api.setVeto(true); api.placeCrates('start');
      await Promise.all([api.setup(SET.sort), api.goTo(AT_SORT, { hop: true })]);
      api.faces('happy', 'think');
    },
    async done(api) {
      api.faces('grin', 'happy');
      await api.sortAll();
      api.chars.max.pose('point');
      api.say('max', 'And no safety approval? Bung a big charge on it!', 2600);
    }
  },
  {
    id: 'hard-stop', title: 'Some Nos stay No',
    lines: [
      { who: 'libby', text: 'Max put the safety approval crate on the price tag. Can money fix a legal requirement?' },
      { who: 'max', text: 'A big enough charge fixes anything. Doesn\'t it?' }
    ],
    cam: SORT,
    task: { pick: { answer: 'stop', say: 'Click the sign where the safety approval crate really belongs.', wrong: {
      tag: 'That\'s Max\'s idea. But you can\'t price away a legal requirement: no approval for safety-critical parts means no.',
      'obj-safety': 'That\'s the crate itself. Click the sign it belongs under.'
    }, why: 'Right. No approval for safety-critical parts is a hard stop, like failing the quality audit outright. The other three became a "Yes, if…".' } },
    async enter(api) {
      fresh(api); api.scaleMode = 'x'; api.placePoints(); api.setVeto(true);
      if (api.sortState !== 'mistake') api.placeCrates('mistake');
      await Promise.all([api.setup(SET.sort), api.goTo(AT_SORT, { hop: true })]);
      api.faces('grin', 'think'); api.chars.max.pose('point');
    },
    async done(api) {
      api.chars.max.pose('idle'); api.faces('surprised', 'happy');
      await api.flyCrate('safety', SPOT.safety, 900);
      api.sortState = 'fixed';
      api.faces('happy', 'grin');
      api.say('max', 'Fair. Some things money can\'t fix.', 2400);
    }
  },
  {
    id: 'end', title: 'What you just learned',
    lines: [
      { who: 'max', text: 'So the cheapest quote isn\'t always the best value. You price the difference first.' },
      { who: 'libby', text: 'And money is <b>the Ruler</b>, the second part of Race, Ruler, Rulebook. Next lesson: the single number it gives us.' }
    ],
    summary: [
      'Suppliers differ, and price alone can\'t compare them.',
      'Scores rank suppliers but don\'t price the difference.',
      'Money turns "No" into "Yes, if…", which keeps more suppliers in the race.'
    ],
    cam: OVER, task: null,
    async enter(api) {
      fresh(api); api.scaleMode = 'x'; api.placePoints(); api.setVeto(true); api.placeCrates('fixed');
      await Promise.all([api.setup(SET.sort), api.homeAll({ hop: true })]);
      api.faces('happy', 'grin'); api.poses('wave', 'idle');
    }
  }
];
