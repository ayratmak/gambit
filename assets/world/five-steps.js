/* 3D mini-lesson: Five steps to the table. Course: From Facts to Game Plan, lesson "Why one-to-one negotiations fail".
   A winding path crosses the plinth past five stations: Facts, Power, Plan, Play, Learn. Max sprints straight to the
   negotiating table and it goes wrong in the four ways the lesson names. Libby then walks the path station by station.
   Facts, sorting items and answers follow assets/courses/game-plan.js so the 3D lesson and the text lesson agree. */
import { stage, scenery, prop, cast, V, THREE, box, animate, CAST } from './kit.js';

export const meta = {
  id: 'five-steps',
  title: 'Five steps to the table',
  course: 'game-plan', lesson: 'why-negotiations-fail',
  minutes: 7
};

/* ---------- Small shape helpers ---------- */
const cyl = (r, h, m, x = 0, y = 0, z = 0, r2 = r, seg = 24) => {
  const c = new THREE.Mesh(new THREE.CylinderGeometry(r, r2, h, seg), m); c.position.set(x, y + h / 2, z); return c;
};
const ball = (r, m, x = 0, y = 0, z = 0) => { const s = new THREE.Mesh(new THREE.SphereGeometry(r, 20, 14), m); s.position.set(x, y, z); return s; };
const rod = (a, b, r, m) => {
  const d = b.clone().sub(a), len = d.length();
  const c = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, 10), m);
  c.position.copy(a).add(b).multiplyScalar(.5); c.quaternion.setFromUnitVectors(V(0, 1, 0), d.normalize());
  return c;
};
const lerp = (a, b, k) => a + (b - a) * k;
const springy = k => Math.max(.001, k + Math.sin(k * Math.PI) * .25);
const wait = ms => new Promise(r => setTimeout(r, ms));

/* ---------- Where things stand ---------- */
const AT = {
  calendar: [-12.1, 4.6], facts: [-8.8, 1.3], power: [-4.6, -3.8], plan: [0, 1.0], table: [5, -4.4], learn: [10.4, 0.9],
  lever: [2.9, -3.0], target: [2.3, -6.4], supplier: [5, -6.0]
};
const HOME = { max: [-11.7, 7.3], libby: [-10.4, 7.0] };
const AT_TABLE = { max: [4.0, -2.4], libby: [1.5, -0.9] };      // Max at the table, Libby watching from the side
const SHORTCUT = [[-2.6, -0.2], [4.0, -2.4]];                    // Max's straight run, between Power and Plan
const PATH = [[-11.9, 7.6], [-10.4, 7.0], [-8.4, 3.8], [-6.6, 0.9], [-4.4, -1.5], [-2.4, 1.5], [0, 3.5], [2.6, 1.4], [5.2, -2.3], [7.4, 0.2], [9.8, 3.6], [11.4, 6.8]];
const FLAG_SPOTS = [[-10.3, 2.4], [-10.5, 0.6], [1.9, 2.1], [7.0, -2.7]];  // Facts, Facts, Plan, Play
const SUPPLIER = {
  ...CAST.detective, name: 'Supplier', role: 'Across the table',
  skin: '#C99474', hair: '#4A3A30', top: '#7D8790', topDark: '#646D75', trousers: '#3A3D44', shoes: '#2B2A28', sole: '#2B2A28',
  coat: false, jacket: false, hat: null, moustache: false, glasses: true, hairStyle: 'short', height: 1
};

export function build(w) {
  const { mat, label } = w;
  stage(w, { width: 26, depth: 18 });

  /* ---------- The winding path: stepping stones from Start to Learn ---------- */
  const curve = new THREE.CatmullRomCurve3(PATH.map(([x, z]) => V(x, 0, z)), false, 'centripetal');
  const L = curve.getLength();
  const uOf = (x, z) => {
    let best = 0, bd = 1e9;
    for (let i = 0; i <= 800; i++) { const p = curve.getPointAt(i / 800), d = (p.x - x) ** 2 + (p.z - z) ** 2; if (d < bd) { bd = d; best = i / 800; } }
    return best;
  };
  const U = { start: uOf(-10.4, 7.0), facts: uOf(-8.4, 3.8), power: uOf(-4.4, -1.5), plan: uOf(0, 3.5), play: uOf(5.2, -2.3), learn: uOf(9.8, 3.6) };
  const GAP = 1.5 / L;

  const ground = new THREE.Group();
  const stoneA = mat('floor'), stoneB = mat('surface'), padM = mat('surface');
  const n = Math.floor(L / .95);
  for (let i = 0; i <= n; i++) {
    const p = curve.getPointAt(i / n);
    const s = cyl(.42, .07, i % 2 ? stoneB : stoneA, p.x, 0, p.z, .42, 20);
    s.scale.set(1 + (i % 3) * .06, 1, .9); s.rotation.y = i * .7; ground.add(s);
  }
  // round pads under each station
  [[-8.8, 1.6, 1.7], [-4.6, -3.6, 1.8], [0, 1.2, 1.8], [5, -4.6, 2.9], [10.4, 1.1, 1.7]].forEach(([x, z, r]) => ground.add(cyl(r, .04, padM, x, 0, z, r, 40)));
  // start mat and a finishing post
  ground.add(box(1.6, .05, 1.1, mat('accent'), -11.9, 0, 7.6, .2));
  // a few trees round the edge, to make it a little landscape
  const trunk = mat('wood'), leaf = mat('accent');
  [[-12, -7.4, 1], [-9.6, -7.9, .8], [12, -7.3, 1.1], [12.2, -4.6, .8], [-1.6, -7.8, .9], [12.1, 7.6, .85]].forEach(([x, z, k]) => {
    ground.add(cyl(.12 * k, .9 * k, trunk, x, 0, z));
    ground.add(ball(.62 * k, leaf, x, 1.25 * k, z)); ground.add(ball(.45 * k, leaf, x + .3 * k, 1.75 * k, z - .1));
  });
  scenery(w, ground);
  label(null, 'Start', V(-11.9, .5, 8.1), 'sign');

  const api = Object.assign(cast(w, {
    max: HOME.max, libby: HOME.libby,
    supplier: { spec: SUPPLIER, at: AT.supplier }
  }), {});
  const chars = api.chars;
  api.u = { max: 0, libby: U.start };
  api.st = { weeks: 0, papers: 'tidy', lever: 'tidy', leak: false, target: 'blank', facts: false, scales: 0, plan: false, play: false, learn: false, foot: false, flags: [false, false, false, false], zones: false };
  api.shortcut = false;

  /* ---------- The calendar at the start: four weeks ---------- */
  const cal = new THREE.Group();
  const calWood = mat('wood'), calPaper = mat('paper'), calHead = mat('bad'), calCell = mat('surface'), calFill = mat('accent'), calRing = mat('mask');
  cal.add(box(.1, 2.3, .1, calWood, -.85, 0, -.06), box(.1, 2.3, .1, calWood, .85, 0, -.06));
  cal.add(box(1.9, 1.15, .08, calPaper, 0, 1.0, 0, .06));
  cal.add(box(1.9, .26, .1, calHead, 0, 1.9, 0, .06));
  for (const x of [-.5, 0, .5]) { const r = new THREE.Mesh(new THREE.TorusGeometry(.07, .02, 6, 16), calRing); r.position.set(x, 2.18, .03); cal.add(r); }
  const cells = [];
  for (let i = 0; i < 4; i++) {
    const x = -.63 + i * .42;
    cal.add(box(.34, .5, .03, calCell, x, 1.22, .05));
    const f = box(.28, .42, .04, calFill, x, 1.26, .07); f.visible = false; cal.add(f); cells.push(f);
  }
  cal.position.set(AT.calendar[0], 0, AT.calendar[1]); cal.rotation.y = .35;
  prop(w, 'calendar', cal, 'Four weeks', 2.8);
  api.weeks = async (k, anim = true) => {
    const was = api.st.weeks; api.st.weeks = k;
    const grow = [];
    cells.forEach((c, i) => {
      const on = i < k;
      if (on && !c.visible) { c.visible = true; if (anim) grow.push(c); else c.scale.set(1, 1, 1); }
      if (!on) c.visible = false;
    });
    if (grow.length && was !== k) { grow.forEach(c => c.scale.set(1, .001, 1)); await animate(500, q => grow.forEach(c => c.scale.set(1, springy(q), 1))); }
  };

  /* ---------- 1 Facts: a filing cabinet with a fact sheet inside ---------- */
  const fx = new THREE.Group();
  const cabM = mat('muted'), drawM = mat('surface'), handM = mat('mask'), tagM = mat('paper'), binderA = mat('accent'), binderB = mat('gold');
  fx.add(box(1.4, 2.2, 1.1, cabM, 0, 0, 0, .08));
  [.15, .85].forEach(y => { fx.add(box(1.24, .6, .06, drawM, 0, y, .56)); fx.add(box(.42, .07, .07, handM, 0, y + .22, .62)); fx.add(box(.3, .13, .02, tagM, 0, y + .4, .6)); });
  const drawer = new THREE.Group();
  drawer.add(box(1.24, .6, .06, drawM, 0, 1.55, .56)); drawer.add(box(.42, .07, .07, handM, 0, 1.77, .62)); drawer.add(box(.3, .13, .02, tagM, 0, 1.95, .6));
  drawer.add(box(1.1, .5, 1.0, drawM, 0, 1.6, .05));
  for (let i = 0; i < 4; i++) { drawer.add(box(1.0, .48, .03, tagM, 0, 1.68, -.3 + i * .18)); drawer.add(box(.22, .08, .03, i % 2 ? binderA : binderB, -.3 + i * .18, 2.16, -.3 + i * .18)); }
  fx.add(drawer);
  fx.add(box(.9, .14, .65, binderA, -.1, 2.2, -.1, .04)); fx.add(box(.8, .12, .6, binderB, .05, 2.34, -.08, .04));
  const sheet = new THREE.Group();
  const sheetM = mat('paper'), lineM = mat('mask'), headM = mat('accent');
  sheet.add(box(.95, 1.25, .03, sheetM, 0, 0, 0, .04));
  sheet.add(box(.6, .1, .01, headM, -.1, 1.05, .02));
  for (let i = 0; i < 5; i++) { sheet.add(box(.12, .08, .01, headM, -.32, .82 - i * .17, .02)); sheet.add(box(.5, .05, .01, lineM, .08, .83 - i * .17, .02)); }
  sheet.position.set(0, 1.7, .4); sheet.visible = false; fx.add(sheet);
  fx.position.set(AT.facts[0], 0, AT.facts[1]); fx.rotation.y = .25;
  prop(w, 'facts', fx, '1 · Facts', 4.4);
  w.onTick(t => { if (api.st.facts && !api._factsAnim) { sheet.position.y = 2.75 + Math.sin(t * 1.6) * .07; sheet.rotation.y = Math.sin(t * .9) * .12; } });
  api.factsOpen = async (on, anim = true) => {
    if (api.st.facts === on) return; api.st.facts = on;
    if (!anim) { drawer.position.z = on ? .75 : 0; sheet.visible = on; sheet.position.y = 2.75; return; }
    api._factsAnim = true;
    if (on) {
      await animate(500, k => { drawer.position.z = k * .75; });
      sheet.visible = true;
      await animate(700, k => { sheet.position.y = lerp(1.7, 2.75, k); sheet.scale.setScalar(springy(k)); });
    } else {
      sheet.visible = false; await animate(400, k => { drawer.position.z = (1 - k) * .75; });
    }
    api._factsAnim = false;
  };

  /* ---------- 2 Power: a set of scales for your levers and theirs ---------- */
  const pw = new THREE.Group();
  const brass = mat('gold'), plinthW = mat('wood'), chainM = mat('mask'), ours = mat('accent'), theirs = mat('muted'), nextM = mat('gold', { emissive: new THREE.Color('#6b5320'), emissiveIntensity: .4 });
  pw.add(cyl(.8, .22, plinthW, 0, 0, 0, .9, 32)); pw.add(cyl(.5, .14, plinthW, 0, .22, 0, .55, 32));
  pw.add(cyl(.08, 2.2, brass, 0, .36, 0)); pw.add(ball(.15, brass, 0, 2.68, 0));
  const beam = new THREE.Group(); beam.position.y = 2.5; pw.add(beam);
  beam.add(box(3.2, .1, .14, brass, 0, -.05, 0, .04)); beam.add(ball(.08, brass, -1.6, 0, 0)); beam.add(ball(.08, brass, 1.6, 0, 0));
  const pans = [-1, 1].map(side => {
    const g = new THREE.Group();
    g.add(cyl(.62, .08, brass, 0, 0, 0, .5, 32));
    for (let a = 0; a < 3; a++) { const an = a * Math.PI * 2 / 3 + .5; g.add(rod(V(Math.cos(an) * .55, .08, Math.sin(an) * .55), V(0, 1.1, 0), .015, chainM)); }
    pw.add(g); return g;
  });
  const blocks = { ours: [], theirs: [], next: null };
  [[-.22, -.15], [.22, -.12], [0, .2]].forEach(([x, z], i) => { const b = box(.3, .3, .3, ours, x, .08, z, .04); b.rotation.y = i * .3; b.visible = false; pans[0].add(b); blocks.ours.push(b); });
  [[-.16, 0], [.18, .05]].forEach(([x, z], i) => { const b = box(.3, .3, .3, theirs, x, .08, z, .04); b.rotation.y = i * .5; b.visible = false; pans[1].add(b); blocks.theirs.push(b); });
  blocks.next = box(.26, .26, .26, nextM, 0, .38, -.02, .04); blocks.next.visible = false; pans[0].add(blocks.next);
  const panLbl = [label(null, 'Our levers', V(0, -.45, .2), 'axis'), label(null, 'Their levers', V(0, -.45, .2), 'axis')];
  panLbl.forEach((l, i) => { pans[i].add(l.obj); l.obj.visible = false; l.el.hidden = true; });
  pw.position.set(AT.power[0], 0, AT.power[1]);
  prop(w, 'power', pw, '2 · Power', 3.4);
  let tilt = 0, tiltGoal = 0, wobble = 0;
  const layScales = (t = 0) => {
    const a = tilt + Math.sin(t * 5) * wobble;
    beam.rotation.z = a;
    pans.forEach((p, i) => { const x = (i ? 1.5 : -1.5); p.position.set(x * Math.cos(a), 2.5 + x * Math.sin(a) - 1.1, 0); });
  };
  layScales();
  w.onTick((t, dt) => { tilt += (tiltGoal - tilt) * Math.min(1, dt * 3); wobble *= Math.max(0, 1 - dt * 1.5); layScales(t); });
  // Positive tilt drops the left pan, which holds our levers
  api.scales = async (k, anim = true) => {
    if (api.st.scales === k) return;
    const was = api.st.scales; api.st.scales = k;
    const show = (b, on) => { b.visible = on; b.scale.setScalar(1); };
    if (!anim || k < was) {
      blocks.ours.forEach(b => show(b, k >= 1)); blocks.theirs.forEach(b => show(b, k >= 1)); show(blocks.next, k >= 2);
      tiltGoal = tilt = k === 0 ? 0 : k === 1 ? .09 : .16; layScales();
      panLbl.forEach(l => { l.obj.visible = k >= 1; l.el.hidden = k < 1; });
      return;
    }
    if (was < 1) {
      panLbl.forEach(l => { l.obj.visible = true; l.el.hidden = false; });
      const drops = [blocks.ours[0], blocks.theirs[0], blocks.ours[1], blocks.theirs[1], blocks.ours[2]];
      for (const [i, b] of drops.entries()) {
        const y0 = b.position.y; b.visible = true;
        await animate(320, q => { b.position.y = y0 + (1 - q) * 1.6; });
        const ourCount = drops.slice(0, i + 1).filter(x => blocks.ours.includes(x)).length;
        const theirCount = i + 1 - ourCount;
        tiltGoal = (ourCount - theirCount) * .09; wobble = .05;
      }
    }
    if (k >= 2) {
      const b = blocks.next, y0 = .38; b.visible = true;
      await animate(450, q => { b.position.y = y0 + (1 - q) * 2; b.scale.setScalar(springy(q)); });
      tiltGoal = .16; wobble = .06;
    }
  };
  api.bump = () => { wobble = .14; };

  /* ---------- 3 Plan: a whiteboard with the game plan drawn on it ---------- */
  const pl = new THREE.Group();
  const legM = mat('mask'), frameM = mat('surface'), boardM = mat('paper'), penA = mat('accent'), penB = mat('bad'), penC = mat('mask'), noteM = mat('gold');
  [-1.45, 1.45].forEach(x => { pl.add(box(.08, 2.75, .08, legM, x, 0, 0)); pl.add(box(.1, .06, .8, legM, x, 0, 0)); });
  pl.add(box(3.1, 1.85, .1, frameM, 0, .9, 0, .05));
  pl.add(box(2.9, 1.65, .12, boardM, 0, 1.0, 0, .04));
  pl.add(box(2.4, .06, .22, frameM, 0, .9, .12));
  pl.add(cyl(.035, .3, penA, -.4, .96, .14)); pl.add(cyl(.035, .3, penB, -.2, .96, .14));
  pl.children.slice(-2).forEach(m => { m.rotation.z = Math.PI / 2; });
  const bits = [];
  const draw = (m, w2, h, x, y) => { const b = box(w2, h, .02, m, x, y, .07); b.scale.x = .001; pl.add(b); bits.push(b); return b; };
  draw(penC, .9, .07, -.7, 2.38);                                                      // heading
  [[-1.05, 1.25], [-.6, 1.55], [-.15, 1.85]].forEach(([x, y]) => draw(penA, .42, .1, x, y));   // the package ladder
  draw(penB, .95, .06, -.55, 2.12);                                                    // the escalation arrow
  [1.4, 1.7, 2.0].forEach(y => draw(penC, .75, .05, .85, y));                          // storyline notes
  const notes = [box(.32, .32, .02, noteM, 1.05, 1.08, .07), box(.32, .32, .02, noteM, .55, 1.12, .07)];
  notes.forEach(nt => { nt.rotation.z = .12; nt.visible = false; pl.add(nt); });
  pl.position.set(AT.plan[0], 0, AT.plan[1]);
  prop(w, 'plan', pl, '3 · Plan', 3.4);
  api.planDraw = async (on, anim = true) => {
    if (api.st.plan === on) return; api.st.plan = on;
    if (!anim || !on) { bits.forEach(b => b.scale.x = on ? 1 : .001); notes.forEach(nt => { nt.visible = on; nt.scale.setScalar(1); }); return; }
    for (const b of bits) await animate(170, k => { b.scale.x = Math.max(.001, k); });
    for (const nt of notes) { nt.visible = true; await animate(260, k => nt.scale.setScalar(springy(k))); }
  };

  /* ---------- 4 Play: the negotiating table ---------- */
  const tb = new THREE.Group();
  const top = mat('wood'), tentM = mat('paper'), glassM = mat('water', { transparent: true, opacity: .75, roughness: .2 }), chairM = mat('surface');
  tb.add(box(3.8, .1, 1.8, top, 0, .82, 0, .12));
  [[-1.7, -.75], [1.7, -.75], [-1.7, .75], [1.7, .75]].forEach(([x, z]) => tb.add(box(.1, .82, .1, top, x, 0, z)));
  tb.add(box(.9, .5, .7, chairM, 0, 0, -2.4, .08)); tb.add(box(.9, 1.0, .1, chairM, 0, .5, -2.75, .05));
  [[-1.3, .3], [1.4, .35], [0, -.55]].forEach(([x, z]) => tb.add(cyl(.09, .26, glassM, x, .92, z)));
  const tents = [];
  [[-.6, .55], [.7, .55]].forEach(([x, z]) => {
    const tn = new THREE.Mesh(new THREE.CylinderGeometry(.16, .16, .6, 3), tentM);
    tn.rotation.z = Math.PI / 2; tn.position.set(x, 1.0, z); tn.visible = false; tb.add(tn); tents.push(tn);
  });
  tb.position.set(AT.table[0], 0, AT.table[1]);
  const playProp = prop(w, 'play', tb, '4 · Play', 1.5);
  playProp.label.obj.position.set(0, 1.45, 1.05);
  api.playSet = async (on, anim = true) => {
    if (api.st.play === on) return; api.st.play = on;
    tents.forEach(t => { t.visible = on; t.scale.setScalar(1); });
    if (on && anim) await animate(450, k => tents.forEach(t => t.scale.setScalar(springy(k))));
  };

  /* ---------- Mishap 1: Max's papers ---------- */
  const pp = new THREE.Group();
  const folderM = mat('accent'), paperM = mat('paper');
  pp.add(box(.95, .03, .7, folderM, 4.8, .87, -4.1, .03));
  const flap = box(.95, .03, .7, folderM, 4.8, .87, -4.8, .03); flap.rotation.x = -.18; pp.add(flap);
  const TIDY = [], WILD = [
    [3.1, .02, -1.9, 0, .5, 0], [5.0, .02, -1.5, 0, -.8, 0], [2.3, .02, -4.7, 0, 1.2, 0], [6.4, .88, -4.0, 0, .6, 0],
    [4.5, .88, -4.9, 0, -.4, 0], [3.6, 2.7, -3.7, .5, .3, .4], [5.9, 3.1, -3.3, -.4, .9, -.5], [6.7, .02, -2.1, 0, 2.2, 0]
  ];
  const sheets = WILD.map((_, i) => {
    const s = box(.55, .012, .75, paperM, 0, 0, 0); s.add(box(.36, .004, .04, mat('mask'), -.04, .012, -.22)); s.add(box(.4, .004, .03, mat('mask'), 0, .012, -.1));
    TIDY.push([4.8 + (i % 3 - 1) * .02, .9 + i * .014, -4.1 + (i % 2) * .02, 0, i * .05 - .2, 0]);
    s.position.set(...TIDY[i].slice(0, 3)); s.rotation.set(...TIDY[i].slice(3));
    pp.add(s); return s;
  });
  prop(w, 'papers', pp);
  w.onTick(t => {
    if (api.st.papers !== 'broken' || api._papersAnim) return;
    [5, 6].forEach(i => { const b = WILD[i]; sheets[i].position.y = b[1] + Math.sin(t * 1.7 + i) * .2; sheets[i].rotation.z = b[5] + Math.sin(t * 1.3 + i) * .35; sheets[i].rotation.x = b[3] + Math.sin(t * 1.1 + i) * .2; });
  });
  api.papers = async (state, anim = true) => {
    if (api.st.papers === state) return; api.st.papers = state;
    const goal = state === 'broken' ? WILD : TIDY;
    flap.rotation.x = state === 'broken' ? -1.1 : -.18;
    if (!anim) { sheets.forEach((s, i) => { s.position.set(...goal[i].slice(0, 3)); s.rotation.set(...goal[i].slice(3)); }); return; }
    api._papersAnim = true;
    await Promise.all(sheets.map(async (s, i) => {
      await wait(i * 70);
      const p0 = s.position.clone(), r0 = [s.rotation.x, s.rotation.y, s.rotation.z], g = goal[i];
      await animate(900, k => {
        s.position.set(lerp(p0.x, g[0], k), lerp(p0.y, g[1], k) + Math.sin(k * Math.PI) * (state === 'broken' ? 2.4 : 1.2), lerp(p0.z, g[2], k));
        s.rotation.set(lerp(r0[0], g[3], k) + Math.sin(k * Math.PI) * 2, lerp(r0[1], g[4], k), lerp(r0[2], g[5], k));
      });
    }));
    api._papersAnim = false;
  };

  /* ---------- Mishap 2: the big lever, pulled in the first five minutes ---------- */
  const lv = new THREE.Group();
  const leverBase = mat('muted'), leverArm = mat('mask'), knobM = mat('bad'), sparkM = mat('gold', { emissive: new THREE.Color('#ffcc55'), emissiveIntensity: .9 });
  lv.add(box(.75, .35, .55, leverBase, 0, 0, 0, .06)); lv.add(box(.12, .04, .45, leverArm, 0, .35, 0));
  lv.add(box(.6, .3, .03, knobM, 0, .03, .29));
  const arm = new THREE.Group(); arm.position.y = .35; lv.add(arm);
  arm.add(cyl(.05, 1.4, leverArm, 0, 0, 0)); arm.add(ball(.09, leverArm, 0, 0, 0));
  const knob = ball(.17, knobM, 0, 0, 0); lv.add(knob);
  const sparks = Array.from({ length: 9 }, () => { const s = ball(.05, sparkM); s.visible = false; s.userData.noPick = true; lv.add(s); return s; });
  const KNOB_FLOOR = V(.75, .17, 1.1);
  const knobOnArm = () => { const a = arm.rotation.x; knob.position.set(0, .35 + 1.4 * Math.cos(a), 1.4 * Math.sin(a)); };
  arm.rotation.x = -.45; knobOnArm();
  lv.position.set(AT.lever[0], 0, AT.lever[1]);
  prop(w, 'lever', lv);
  api.leverState = async (state, anim = true) => {
    if (api.st.lever === state) return; api.st.lever = state;
    if (!anim) { arm.rotation.x = state === 'broken' ? 1.05 : -.45; if (state === 'broken') knob.position.copy(KNOB_FLOOR); else knobOnArm(); return; }
    if (state === 'broken') {
      await animate(260, k => { arm.rotation.x = lerp(-.45, 1.05, k); knobOnArm(); });
      const from = knob.position.clone();
      sparks.forEach((s, i) => { s.visible = true; s.position.copy(from); s.userData.dir = V(Math.cos(i * .7) * 1.2, .6 + (i % 3) * .5, Math.sin(i * .7) * 1.2); });
      await animate(800, k => {
        knob.position.lerpVectors(from, KNOB_FLOOR, k); knob.position.y += Math.sin(k * Math.PI) * 1.1;
        sparks.forEach(s => { s.position.copy(from).addScaledVector(s.userData.dir, k); s.position.y -= k * k * .8; s.scale.setScalar(Math.max(.001, 1 - k)); });
      });
      sparks.forEach(s => { s.visible = false; });
    } else {
      const from = knob.position.clone(), a0 = arm.rotation.x;
      await animate(700, k => {
        arm.rotation.x = lerp(a0, -.45, k);
        const a = arm.rotation.x, dest = V(0, .35 + 1.4 * Math.cos(a), 1.4 * Math.sin(a));
        knob.position.lerpVectors(from, dest, k); knob.position.y += Math.sin(k * Math.PI) * .8;
      });
      knobOnArm();
    }
  };

  /* ---------- Mishap 3: a pipe that leaks to the supplier's side ---------- */
  const lk = new THREE.Group();
  const pipeM = mat('muted'), jointM = mat('mask'), valveM = mat('accent'), crackM = mat('bad'), dropM = mat('water'), puddleM = mat('water', { transparent: true, opacity: .85, roughness: .15 }), noteLk = mat('paper');
  const P = { a: V(7.8, 0, -1.6), b: V(7.8, 1.0, -1.6), c: V(7.8, 1.0, -5.9), d: V(6.5, 1.0, -5.9), e: V(6.5, .75, -5.9) };
  [[P.a, P.b], [P.b, P.c], [P.c, P.d], [P.d, P.e]].forEach(([a, b]) => lk.add(rod(a, b, .12, pipeM)));
  [P.b, P.c, P.d].forEach(p => lk.add(ball(.16, jointM, p.x, p.y, p.z)));
  const spout = new THREE.Mesh(new THREE.CylinderGeometry(.17, .15, .12, 16), jointM); spout.position.copy(P.e); lk.add(spout);
  [-3.0, -4.6].forEach(z => lk.add(box(.1, .9, .1, jointM, 7.8, 0, z)));
  const valve = new THREE.Mesh(new THREE.TorusGeometry(.22, .045, 8, 20), valveM); valve.position.set(7.8, .62, -1.38); lk.add(valve);
  lk.add(rod(V(7.8, .62, -1.6), V(7.8, .62, -1.4), .03, valveM));
  const crack = new THREE.Mesh(new THREE.TorusGeometry(.15, .04, 6, 12), crackM); crack.position.set(7.8, 1.0, -3.8); crack.visible = false; lk.add(crack);
  const puddle = cyl(.95, .02, puddleM, 6.4, 0, -6.1, .95, 40); puddle.scale.set(.001, 1, .001); lk.add(puddle);
  const floatNotes = [box(.26, .01, .2, noteLk, 6.1, .03, -6.0), box(.22, .01, .18, noteLk, 6.75, .03, -6.35)];
  floatNotes.forEach((nt, i) => { nt.rotation.y = i * .9; nt.visible = false; lk.add(nt); });
  const drops = Array.from({ length: 12 }, () => { const d = ball(.06, dropM); d.visible = false; d.userData.noPick = true; lk.add(d); return d; });
  prop(w, 'leak', lk);
  let puddleK = 0;
  w.onTick((t, dt) => {
    const on = api.st.leak;
    puddleK += ((on ? 1 : 0) - puddleK) * Math.min(1, dt * .8);
    puddle.scale.set(Math.max(.001, puddleK), 1, Math.max(.001, puddleK));
    floatNotes.forEach((nt, i) => { nt.visible = on && puddleK > .5; nt.position.y = .03 + Math.sin(t * 2 + i) * .01; nt.rotation.y = i * .9 + Math.sin(t * .6 + i) * .3; });
    drops.forEach((d, i) => {
      d.visible = on;
      if (!on) return;
      const p = ((t * .9) + i / drops.length) % 1;
      if (i % 2) d.position.set(6.5 + Math.sin(i) * .04, .7 - p * .7, -5.9);
      else d.position.set(7.8 + Math.sin(i * 3) * .15, 1.0 + Math.sin(p * Math.PI) * .55 - p * .95, -3.8 - p * 1.7);
      d.scale.setScalar(Math.max(.001, 1 - p * .6));
    });
    if (on) valve.rotation.z += dt * 2;
  });
  api.leak = async (on, anim = true) => {
    if (api.st.leak === on) return; api.st.leak = on;
    crack.visible = on;
    if (!anim) { puddleK = on ? 1 : 0; return; }
    if (on) await animate(400, k => crack.scale.setScalar(springy(k)));
    else await wait(600);
  };

  /* ---------- Mishap 4: a target nobody agreed ---------- */
  const tg = new THREE.Group();
  const standM = mat('wood'), ringA = mat('paper'), ringB = mat('bad'), bullM = mat('gold'), dartM = mat('mask'), flightM = mat('accent');
  const apex = V(0, 1.95, -.05);
  [V(-.5, 0, .35), V(.5, 0, .35), V(0, 0, -.6)].forEach(f => tg.add(rod(f, apex, .045, standM)));
  const spin = new THREE.Group(); spin.position.set(0, 1.95, .08); tg.add(spin);
  [[.8, ringA], [.62, ringB], [.44, ringA], [.26, ringB], [.1, bullM]].forEach(([r, m], i) => {
    const disc = new THREE.Mesh(new THREE.CylinderGeometry(r, r, .06, 40), m); disc.rotation.x = Math.PI / 2; disc.position.z = i * .012; spin.add(disc);
  });
  const makeDart = () => {
    const g = new THREE.Group();
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(.025, .025, .5, 8), dartM); shaft.rotation.x = Math.PI / 2; shaft.position.z = .25; g.add(shaft);
    const tip = new THREE.Mesh(new THREE.ConeGeometry(.04, .14, 8), dartM); tip.rotation.x = -Math.PI / 2; tip.position.z = -.05; g.add(tip);
    g.add(box(.18, .01, .12, flightM, 0, -.005, .48), box(.01, .18, .12, flightM, 0, -.09, .48));
    return g;
  };
  const dart = makeDart(); dart.visible = false; spin.add(dart);
  const DART_HOME = V(0, 0, .06);
  const floorDarts = [[-.9, .8, .9], [1.1, .6, -.6], [-.4, -.8, 2.2]].map(([x, z, ry]) => {
    const d = makeDart(); d.position.set(x, .04, z); d.rotation.y = ry; d.visible = false; tg.add(d); return d;
  });
  tg.position.set(AT.target[0], 0, AT.target[1]);
  prop(w, 'target', tg);
  w.onTick((t, dt) => {
    if (api.st.target === 'broken') spin.rotation.y += dt * 6.5;
    else { const goal = Math.round(spin.rotation.y / (Math.PI * 2)) * Math.PI * 2; spin.rotation.y += (goal - spin.rotation.y) * Math.min(1, dt * 4); }
  });
  api.targetState = async (state, anim = true) => {
    if (api.st.target === state) return; api.st.target = state;
    floorDarts.forEach(d => { d.visible = state === 'broken'; });
    if (state !== 'agreed') { dart.visible = false; return; }
    spin.rotation.y = Math.round(spin.rotation.y / (Math.PI * 2)) * Math.PI * 2;
    dart.visible = true;
    if (!anim) { dart.position.copy(DART_HOME); return; }
    const from = V(3.3, -1.1, 3.9);
    await animate(650, k => { dart.position.lerpVectors(from, DART_HOME, k); dart.position.y += Math.sin(k * Math.PI) * .8; });
    await animate(300, k => { spin.rotation.x = Math.sin(k * Math.PI * 3) * .08 * (1 - k); });
  };

  /* ---------- 5 Learn: a bookshelf with a notebook and a trophy ---------- */
  const ln = new THREE.Group();
  const shelfM = mat('wood'), bookM = [mat('accent'), mat('gold'), mat('bad'), mat('surface'), mat('muted')], coverM = mat('accent'), pageM = mat('paper'), trophyM = mat('gold'), pageInk = mat('mask');
  [-1.15, 1.15].forEach(x => ln.add(box(.1, 2.2, .7, shelfM, x, 0, 0)));
  [0, .02, 1.0, 2.15].forEach((y, i) => { if (i !== 1) ln.add(box(2.4, .08, .72, shelfM, 0, y, 0)); });
  ln.add(box(2.4, 2.2, .05, shelfM, 0, 0, -.34));
  [.34, .3, .38, .28, .36, .33, .4].forEach((h, i) => { const b = box(.18, h * 2.2, .5, bookM[i % 5], -.95 + i * .22, 1.08, 0, .02); if (i === 6) b.rotation.z = -.22; ln.add(b); });
  [.3, .35, .28].forEach((h, i) => ln.add(box(.2, h * 2, .5, bookM[(i + 2) % 5], .5 + i * .23, .08, 0, .02)));
  const book = new THREE.Group(); book.position.set(-.45, 2.23, .05); ln.add(book);
  book.add(box(.8, .06, .55, pageM, .4, 0, 0, .02));
  const pageLines = [0, 1, 2].map(i => { const b = box(.45, .005, .04, pageInk, .4, .065, -.15 + i * .14); b.visible = false; book.add(b); return b; });
  const cover = new THREE.Group(); book.add(cover);
  cover.add(box(.84, .03, .58, coverM, .42, .06, 0, .02));
  const trophy = new THREE.Group(); trophy.position.set(.6, 2.19, 0); ln.add(trophy);
  trophy.add(box(.36, .14, .3, shelfM, 0, 0, 0, .03)); trophy.add(cyl(.05, .3, trophyM, 0, .14, 0)); trophy.add(cyl(.24, .32, trophyM, 0, .44, 0, .1, 24));
  [-1, 1].forEach(s => { const h = new THREE.Mesh(new THREE.TorusGeometry(.1, .025, 6, 14, Math.PI), trophyM); h.position.set(s * .24, .64, 0); h.rotation.z = s > 0 ? -Math.PI / 2 : Math.PI / 2; trophy.add(h); });
  const spark = ball(.16, sparkM); spark.visible = false; spark.userData.noPick = true; w.scene.add(spark);
  ln.position.set(AT.learn[0], 0, AT.learn[1]); ln.rotation.y = -.35;
  prop(w, 'learn', ln, '5 · Learn', 3.6);
  w.onTick(t => { if (api.st.learn && !api._learnAnim) { trophy.position.y = 2.19 + .08 + Math.sin(t * 2) * .04; trophy.rotation.y = t * .8; } });
  api.learnOpen = async (on, anim = true) => {
    if (api.st.learn === on) return; api.st.learn = on;
    pageLines.forEach(b => { b.visible = on; });
    if (!anim || !on) { cover.rotation.z = on ? Math.PI * .97 : 0; trophy.position.y = on ? 2.27 : 2.19; return; }
    api._learnAnim = true;
    await animate(700, k => { cover.rotation.z = k * Math.PI * .97; });
    await animate(500, k => { trophy.position.y = 2.19 + springy(k) * .08; trophy.rotation.y = k * Math.PI * 2; });
    api._learnAnim = false;
  };
  // A spark flies from the trophy back to the Power scales: learning builds power for next time
  api.sparkHome = async () => {
    const from = trophy.getWorldPosition(V(0, 0, 0)).add(V(0, .8, 0)), to = pans[0].getWorldPosition(V(0, 0, 0)).add(V(0, .6, 0));
    spark.visible = true;
    await animate(1500, k => { spark.position.lerpVectors(from, to, k); spark.position.y += Math.sin(k * Math.PI) * 4; spark.scale.setScalar(1 - k * .4); });
    spark.visible = false;
  };

  /* ---------- Max's footprints along the shortcut ---------- */
  const feet = new THREE.Group();
  const footM = mat('#3F7D5C', { transparent: true, opacity: .8 });
  const route = [HOME.max, ...SHORTCUT].map(([x, z]) => V(x, .03, z));
  const prints = [];
  for (let s = 0; s < route.length - 1; s++) {
    const a = route[s], b = route[s + 1], d = b.clone().sub(a), len = d.length(), dir = d.clone().normalize(), side = V(-dir.z, 0, dir.x);
    const steps = Math.floor(len / .8);
    for (let i = 1; i <= steps; i++) {
      const p = a.clone().addScaledVector(dir, i * .8).addScaledVector(side, (i % 2 ? .14 : -.14));
      const f = cyl(.11, .015, footM, p.x, 0, p.z, .11, 12); f.scale.set(1, 1, 1.7); f.rotation.y = Math.atan2(dir.x, dir.z);
      feet.add(f); prints.push(f);
    }
  }
  feet.visible = false; scenery(w, feet);
  api.foot = async (on, anim = false) => {
    if (api.st.foot === on && !anim) return; api.st.foot = on; feet.visible = on;
    if (on && anim) { prints.forEach(p => { p.visible = false; }); await animate(2300, k => prints.forEach((p, i) => { p.visible = i / prints.length <= k; })); }
    else prints.forEach(p => { p.visible = true; });
  };

  /* ---------- Flags: where each mishap's root cause lives ---------- */
  const flagPole = mat('mask'), flagCloth = mat('bad');
  const flagFrom = [V(4.8, 1.2, -4.1), V(2.3, 2.0, -6.2), V(2.9, 1.6, -3.0), V(7.8, 1.2, -3.8)];   // papers, target, lever, leak
  const flags = FLAG_SPOTS.map(([x, z]) => {
    const g = new THREE.Group();
    g.add(cyl(.035, 1.4, flagPole, 0, 0, 0)); g.add(cyl(.16, .05, flagPole, 0, 0, 0, .2));
    const cloth = box(.55, .34, .03, flagCloth, .3, 1.02, 0); g.add(cloth);
    g.userData.home = V(x, 0, z); g.visible = false; scenery(w, g); return g;
  });
  w.onTick(t => flags.forEach((f, i) => { if (f.visible) f.children[2].rotation.y = Math.sin(t * 3 + i) * .25; }));
  api.flag = async (i, on, anim = true) => {
    if (api.st.flags[i] === on) return; api.st.flags[i] = on;
    const f = flags[i];
    if (!on) { f.visible = false; return; }
    f.visible = true;
    if (!anim) { f.position.copy(f.userData.home); f.scale.setScalar(1); return; }
    f.position.copy(flagFrom[i]); f.scale.setScalar(.6);
    await animate(1300, k => { f.position.lerpVectors(flagFrom[i], f.userData.home, k); f.position.y += Math.sin(k * Math.PI) * 4.5; f.rotation.y = k * Math.PI * 2; f.scale.setScalar(lerp(.6, 1, k)); });
    await animate(300, k => f.scale.set(1, 1 + Math.sin(k * Math.PI) * .25, 1));
  };

  /* ---------- Labels for the mishaps, and the two zones for sorting ---------- */
  api.tags = {
    papers: label('papers', 'Unread contract', V(6.4, 1.7, -4.0), 'sign'),
    lever: label('lever', 'Biggest threat', V(2.9, 2.35, -3.0), 'sign'),
    leak: label('leak', 'Leak', V(8.3, 1.75, -3.8), 'sign'),
    target: label('target', 'No agreed target', V(2.3, 3.05, -6.4), 'sign')
  };
  api.showTags = (keys = []) => Object.entries(api.tags).forEach(([k, l]) => { const on = keys.includes(k); l.obj.visible = on; l.el.hidden = !on; });
  api.showTags([]);
  const zones = [label(null, 'Preparation: Facts or Power', V(-6.7, .3, 8.3), 'axis'), label(null, 'Execution: Plan or Play', V(2.5, .3, 8.3), 'axis')];
  api.zones = on => { api.st.zones = on; zones.forEach(z => { z.obj.visible = on; z.el.hidden = !on; }); };
  api.zones(false);

  /* ---------- Moving people ---------- */
  api.place = (who, [x, z]) => { const r = chars[who].root; r.position.set(x, .02, z); r.rotation.y = 0; };
  const near = (who, [x, z], d = .3) => Math.hypot(chars[who].root.position.x - x, chars[who].root.position.z - z) < d;

  // Walk along the stepping stones, from where they are on the path to path position u1
  const walkPath = async (who, u1, ms) => {
    const r = chars[who].root;
    let u0 = api.u[who];
    if (u0 === null) { const p = curve.getPointAt(u1); await api.hop(who, [p.x, p.z], 800); api.u[who] = u1; return; }
    if (Math.abs(u1 - u0) * L < .05) return;
    const dir = Math.sign(u1 - u0);
    await animate(ms, (k, raw) => {
      const u = lerp(u0, u1, raw), p = curve.getPointAt(Math.min(1, Math.max(0, u))), tn = curve.getTangentAt(Math.min(1, Math.max(0, u)));
      r.position.set(p.x, .02 + Math.abs(Math.sin(raw * ms / 1000 * Math.PI * 3.2)) * .07, p.z);
      r.rotation.y = Math.atan2(tn.x * dir, tn.z * dir);
    });
    r.position.y = .02; r.rotation.y = 0; api.u[who] = u1;
  };
  // Libby walks to a station; Max follows a pace behind her
  api.walkTo = async station => {
    if (api.u.libby === null || api.u.max === null) await api.homeAll();
    const u1 = U[station], u0 = api.u.libby;
    const ms = Math.max(700, Math.abs(u1 - u0) * L / 3.4 * 1000);
    await Promise.all([walkPath('libby', u1, ms), walkPath('max', Math.max(0, u1 - GAP), ms)]);
  };
  api.homeAll = async () => {
    await Promise.all(['max', 'libby'].filter(k => !near(k, HOME[k], .05)).map(k => api.hop(k, HOME[k], 800)));
    api.u.max = 0; api.u.libby = U.start;
  };
  // Max and Libby at the table, for any step that starts there
  api.toTable = async () => {
    if (near('max', AT_TABLE.max) && near('libby', AT_TABLE.libby)) return;
    await Promise.all(['max', 'libby'].map(k => api.hop(k, AT_TABLE[k], 800)));
    api.u.max = api.u.libby = null;
  };
  // The sprint: Max runs the shortcut while Libby follows his footprints, slower
  api.sprint = async () => {
    api.u.max = api.u.libby = null;
    api.shortcut = true;
    const run = (async () => { chars.max.pose('point'); for (const [p, ms] of [[SHORTCUT[0], 1250], [SHORTCUT[1], 1000]]) await api.walk('max', p, ms); chars.max.pose('idle'); })();
    const follow = (async () => { await wait(900); chars.libby.face('worried'); await api.walk('libby', SHORTCUT[0], 2100); await api.walk('libby', AT_TABLE.libby, 1300); })();
    await Promise.all([api.foot(true, true), run, follow]);
  };

  /* ---------- Whole-scene setups, so ?step=N always looks right ---------- */
  api.stations = async (level, anim = false) => {   // 0 none, 1 facts, 2 power, 3 plan, 4 play, 5 learn
    await api.factsOpen(level >= 1, anim);
    await api.scales(level >= 5 ? 2 : level >= 2 ? 1 : 0, anim);
    await api.planDraw(level >= 3, anim);
    await api.playSet(level >= 4, anim);
    if (level >= 4 && api.st.target === 'blank') await api.targetState('agreed', anim);
    await api.learnOpen(level >= 5, anim);
  };
  api.mishaps = async (list, anim = true) => {     // list of broken mishaps; the rest are tidied
    const has = k => list.includes(k);
    await Promise.all([
      api.papers(has('papers') ? 'broken' : 'tidy', anim),
      api.leverState(has('lever') ? 'broken' : 'tidy', anim),
      api.leak(has('leak'), anim),
      api.targetState(has('target') ? 'broken' : api.st.target !== 'broken' ? api.st.target : api.st.play ? 'agreed' : 'blank', anim)
    ]);
  };
  api.flagsTo = async (k, anim = false) => { for (let i = 0; i < 4; i++) await api.flag(i, i < k, anim); };
  api.supplierFace = f => chars.supplier.face(f);

  return api;
}

/* ---------- State cards: what each object knows at this point in the story ---------- */
export function card(key, ctx) {
  const { api } = ctx, st = api.st;
  const sortedPrep = st.flags[0], sortedExec = st.flags[2];
  const C = {
    max: () => api.shortcut && !st.facts
      ? { kicker: 'Team member · rushing in', title: 'Max', rows: [['Stations skipped', 'Facts, Power, Plan'], ['Weeks of preparation', '0 of 4'], ['Mishaps so far', String(['papers', 'lever', 'leak', 'target'].filter(k => k === 'leak' ? st.leak : st[k] === 'broken').length) + ' of 4']], text: 'Max always reaches for the deal in front of him, right now. Today that meant running straight past the three stations that decide how the meeting goes.' }
      : st.facts
        ? { kicker: 'Team member · second try', title: 'Max', rows: [['Walking', 'The path, a pace behind Libby'], ['Promise', 'No shortcuts']], text: 'Max is quick and keen. Pointed down the path, that energy wins deals; pointed at the table on day one, it loses them.' }
        : { kicker: 'Team member', title: 'Max', rows: [['Wants', 'To get to the table, fast'], ['Has read', 'Nothing yet'], ['Plan', 'Wing it']], text: 'Max is short for maximise. He grabs the biggest number in front of him, which is how most negotiations go wrong.' },
    libby: () => ({ kicker: 'Team lead', title: 'Libby', rows: [['Runs', 'Facts, Power, Plan, Play, Learn'], ['Time she gives a big deal', 'About four weeks'], ['Where she starts', 'Facts, never the table']], text: 'Libby is short for equilibrium. She asks where a negotiation ends up once both sides have made their best moves, and she prepares for it.' }),
    supplier: () => st.target === 'broken'
      ? { kicker: 'The other side', title: 'The supplier', rows: [['Knows', 'You have no alternative'], ['Sees', 'A team arguing over its own number'], ['Plans to', 'Wait, then push']], text: 'Every mishap so far has handed the supplier something for free. They only have to sit still and let the team argue.' }
      : st.leak
        ? { kicker: 'The other side', title: 'The supplier', rows: [['Knows', 'You have no alternative'], ['Learned it from', 'Your own product team'], ['Mood', 'Delighted']], text: 'That one sentence moved power across the table. A supplier who knows you can\'t leave has no reason to move on price.' }
        : { kicker: 'The other side', title: 'The supplier', rows: [['Has', 'Their own facts, levers and plan'], ['Knows about you', st.play ? 'Only what your team agreed to say' : 'What you tell them']], text: st.play ? 'Facing a prepared team with one voice and agreed lines, the supplier has to take every offer seriously.' : 'The supplier has done their homework. Whatever your team lets slip at the table, they will use.' },
    calendar: () => ({ kicker: 'Time to prepare', title: 'Four-week calendar', rows: [['For a significant negotiation', 'About four weeks'], ['Weeks used so far', st.weeks + ' of 4'], ['Most failures trace back to', 'Facts or Power']], text: api.shortcut && !st.facts ? 'Max went to the table with no weeks of preparation at all. The meeting is where you find out how well you prepared, and by then it\'s usually too late.' : 'The five steps overlap and build on each other. Most of the four weeks go on the work before anyone sits down.' }),
    facts: () => ({ kicker: 'Step 1 of 5', title: 'Facts', rows: [['Targets', 'What you want to win'], ['Asks', 'What you will ask for'], ['The situation', 'Contract, spend, scope'], ['The people involved', 'Who really decides'], ['The history', 'How the last round went'], ...(sortedPrep ? [['Flags here', 'Unread contract, no walk-away point']] : [])], text: st.facts ? 'The fact sheet is out of the drawer. Read the old contract here, and the volume-discount clause would never have been a surprise.' : 'Max ran straight past this cabinet. Everything in it was there to read.' }),
    power: () => ({ kicker: 'Step 2 of 5 · the heart of the method', title: 'Power', rows: [['Our levers', st.scales ? '3 on the scales' : 'Not collected'], ['Their levers', st.scales ? '2 on the scales' : 'Not collected'], ['A power fact Max missed', 'How much of the supplier\'s revenue you are'], ...(st.scales >= 2 ? [['Gold block', 'Power built by Learn, for next time']] : []), ['Decides', 'What you can realistically achieve']], text: 'Collect your levers and theirs, and judge each side\'s real bargaining power. The balance sets the range of deals you can reach. Everything after it is about using that power well.' }),
    plan: () => ({ kicker: 'Step 3 of 5', title: 'Plan', rows: [['Strategy', 'What you are going for'], ['Game plan', 'Which lever, and when'], ['Storyline', 'What you say, in what order'], ...(sortedExec ? [['Flag here', 'The biggest threat, five minutes in']] : [])], text: st.plan ? 'The board shows a ladder of offers and, at the top, the moment to change gear. The biggest threat comes late, if at all.' : 'An empty board. Without a plan, every lever gets pulled whenever someone feels like it.' }),
    play: () => ({ kicker: 'Step 4 of 5', title: 'Play', rows: [['Organise', 'Who does what in the room'], ['Rehearse', 'Practise the hard moments'], ['Run', 'One voice, agreed lines'], ...(sortedExec ? [['Flag here', 'The leak about no alternative']] : [])], text: st.play ? 'Name cards are out and everyone knows their line. The table is only step four: it is where you find out how well you prepared.' : 'The negotiating table. Max thought the whole deal happened here.' }),
    learn: () => ({ kicker: 'Step 5 of 5', title: 'Learn', rows: [['Capture', 'What worked and what didn\'t'], ['Build', 'Power for next time'], ['Helps', 'The next deal, not this one']], text: st.learn ? 'The notebook is open and the lesson is written down. The gold spark carried it back to Power, ready for next time.' : 'The shelf where a team keeps what it learned. Empty notebooks make the same mistakes twice.' }),
    papers: () => st.papers === 'broken'
      ? { kicker: 'Way 1 · not prepared', title: 'Papers everywhere', rows: [['What went wrong', 'Nobody read the old contract'], ['What they missed', 'A volume-discount clause'], ...(ctx.reached('sort-prep') ? [['Root cause', 'Preparation (Facts)']] : [])], text: 'The fact was sitting in the old contract all along. Reading it is preparation, and it should have happened at Facts, weeks before the day.' }
      : { kicker: 'Max\'s folder', title: 'Max\'s papers', rows: [['Inside', sortedPrep ? 'The old contract, read and flagged' : 'The old contract'], ['Read by the team', sortedPrep || st.facts ? 'Yes' : 'Not yet']], text: sortedPrep ? 'Back in the folder, and this time someone has read every page.' : 'A folder of paperwork for the meeting. Whether anyone has read it is another matter.' },
    lever: () => st.lever === 'broken'
      ? { kicker: 'Way 2 · levers used badly', title: 'The big lever, pulled', rows: [['When', 'The first five minutes'], ['Left to step up to', 'Nothing'], ...(ctx.reached('sort-exec') && sortedExec ? [['Root cause', 'Execution (Plan)']] : [])], text: 'Levers go wrong three ways: used too early, too weakly, or not at all. The lever was real. Using it at the wrong moment is an execution failure.' }
      : { kicker: 'A lever', title: 'The big lever', rows: [['What it is', 'The team\'s biggest threat'], ['When to pull it', st.plan ? 'Late, and only if cooperative offers fail' : 'Not decided yet']], text: 'A lever is anything that gives you power over the deal: something you can give, or something you can take away.' },
    leak: () => st.leak
      ? { kicker: 'Way 3 · information leaking', title: 'A leaking pipe', rows: [['Who said it', 'Someone from product'], ['What leaked', 'We have no alternative'], ['Where it went', 'Straight to the supplier'], ...(sortedExec ? [['Root cause', 'Execution (Play)']] : [])], text: 'Information leaked in the room. That is a Play problem: one voice, and lines agreed before the day.' }
      : { kicker: 'Between the two sides', title: 'The pipe', rows: [['Carries', 'Information, from your side to theirs'], ['Valve', st.play || sortedExec ? 'Closed: one voice, agreed lines' : 'Nobody is watching it']], text: 'What your team says at the table flows to the supplier. Keep the valve shut on anything you didn\'t agree to share.' },
    target: () => st.target === 'broken'
      ? { kicker: 'Way 4 · no agreed targets', title: 'A target that won\'t sit still', rows: [['Target', 'Not agreed'], ['Walk-away point', 'Not agreed'], ['Result', 'An argument in the break'], ...(ctx.reached('sort-prep') ? [['Root cause', 'Preparation (Facts)']] : [])], text: 'The walk-away point should be signed off weeks before the day. Agreed inside the team, never said out loud.' }
      : st.target === 'agreed'
        ? { kicker: 'Agreed before the day', title: 'Target board', rows: [['Target', 'Agreed'], ['Walk-away point', 'Agreed, kept to the team'], ['Signed off', 'Weeks before the meeting']], text: 'One dart in the middle: the whole team is aiming at the same number.' }
        : { kicker: 'Waiting by the table', title: 'Target board', rows: [['Target', 'Not set yet'], ['Walk-away point', 'Not set yet']], text: 'A walk-away point is the worst deal you would still sign. Nobody has written one down yet.' }
  };
  return C[key] ? C[key]() : { kicker: '', title: key, rows: [], text: '' };
}

/* ---------- Camera presets: [position, target] for wide screens and for phones ---------- */
const OVER = { wide: [[0, 23, 30], [0, 0, -.5]], phone: [[0, 36, 31], [0, 0, 0]] };
const TABLE = { wide: [[4.6, 9, 8.5], [4.6, 1, -3.6]], phone: [[4.8, 12.5, 10], [4.8, 1, -3.4]] };
const START = { wide: [[-6.5, 10, 17], [-8.5, 1, 3.2]], phone: [[-8.5, 13, 18], [-8.5, 1, 3.2]] };
const POWER = { wide: [[-3.6, 8.5, 9], [-4.8, 1.3, -2.6]], phone: [[-4.6, 11.5, 10.5], [-4.8, 1.2, -2.4]] };
const MID = { wide: [[2.5, 17, 21], [2.5, .5, -.8]], phone: [[2.5, 26, 23], [2.5, .5, -.5]] };

/* ---------- The guided tour ---------- */
export const steps = [
  {
    id: 'meet', title: 'Five stations to the table',
    lines: [
      { who: 'max', text: 'Hi, I\'m Max! Libby and I have a big meeting with a supplier today. The deal gets done at that table over there.' },
      { who: 'libby', text: 'And there\'s a path to it: five stations and about <b>four weeks</b> of work. Facts, Power, Plan, Play, Learn.' }
    ],
    cam: OVER, task: { click: ['calendar'], say: 'Click the calendar at the start of the path.' },
    async enter(api) {
      api.clearThoughts(); api.showTags([]); api.zones(false); api.foot(false);
      await Promise.all([api.homeAll(), api.mishaps([], false), api.stations(0), api.weeks(0, false), api.flagsTo(0)]);
      api.faces('grin', 'happy'); api.supplierFace('happy'); api.chars.max.pose('wave'); setTimeout(() => api.chars.max.pose('idle'), 2400);
    }
  },
  {
    id: 'sprint', title: 'Max takes the shortcut',
    lines: [
      { who: 'max', text: 'Four weeks? The table\'s right there. Back by lunch!' },
      { who: 'libby', text: 'Max, wait! You\'ve just run past Facts, Power and Plan.' }
    ],
    cam: OVER, task: { click: ['play', 'supplier'], all: true, say: 'Click the negotiating table, then the supplier waiting behind it.' },
    async enter(api) {
      api.clearThoughts(); api.showTags([]); api.zones(false);
      await Promise.all([api.mishaps([], false), api.stations(0), api.weeks(0, false), api.flagsTo(0)]);
      api.faces('grin', 'worried'); api.supplierFace('happy');
      if (api.u.max === null) { await api.toTable(); await api.foot(true); } else await api.sprint();
      api.faces('grin', 'think');
    },
    done(api) { api.say('supplier', 'Lovely. Shall we start?', 2200); api.chars.max.pose('cheer'); setTimeout(() => api.chars.max.pose('idle'), 1500); }
  },
  {
    id: 'papers', title: 'Way one: nobody prepared',
    lines: [
      { who: 'max', text: 'Right, the old contract says... hang on. Has anyone actually read it?' },
      { who: 'libby', text: 'Nobody did, and it had a volume-discount clause in it. That\'s the first way it goes wrong: the team <b>didn\'t prepare</b> enough.' }
    ],
    cam: TABLE, task: { click: ['papers'], say: 'Click the papers flying round the table.' },
    async enter(api) {
      api.clearThoughts(); api.zones(false); api.foot(true);
      await Promise.all([api.toTable(), api.stations(0), api.weeks(0, false), api.flagsTo(0)]);
      api.faces('surprised', 'worried'); api.supplierFace('think'); api.showTags(['papers']);
      await api.mishaps(['papers']);
      api.chars.max.pose('shrug');
    },
    done(api) { api.chars.max.pose('idle'); api.faces('worried', 'think'); }
  },
  {
    id: 'lever', title: 'Way two: the big threat, too early',
    lines: [
      { who: 'max', text: 'Time for my biggest threat. Give us a better price or we take our business elsewhere!' },
      { who: 'libby', text: 'Five minutes in. A <b>lever</b> is anything that gives you power over the deal, and our strongest one is spent.' },
      { who: 'max', text: 'Oops. So now there\'s nothing left to step up to.' }
    ],
    cam: TABLE,
    task: { choice: { q: 'What went wrong with Max\'s lever?', options: [
      { text: 'It wasn\'t a real lever', why: 'It was real, and the strongest one the team had. The trouble was when he pulled it.' },
      { text: 'He pulled it far too early', ok: true, why: 'Right. Levers go wrong when they\'re used too early, too weakly, or not at all. Max opened with his biggest one.' },
      { text: 'He pulled it too gently', why: 'He pulled it as hard as he could. Too weakly is a real failure, just not this one.' }
    ] } },
    async enter(api) {
      api.clearThoughts(); api.zones(false); api.foot(true);
      await Promise.all([api.toTable(), api.stations(0), api.weeks(0, false), api.flagsTo(0), api.mishaps(['papers'], false)]);
      api.showTags(['lever']); api.faces('grin', 'worried'); api.chars.max.pose('point');
      await new Promise(r => setTimeout(r, 900));
      await api.mishaps(['papers', 'lever']);
      api.chars.max.pose('idle'); api.faces('surprised', 'worried'); api.supplierFace('surprised');
      setTimeout(() => api.supplierFace('happy'), 1500);
    },
    done(api) { api.faces('worried', 'think'); api.chars.max.pose('shrug'); setTimeout(() => api.chars.max.pose('idle'), 1800); }
  },
  {
    id: 'leak', title: 'Way three: information leaks',
    lines: [
      { who: 'max', text: 'Our product lead just told them we have no alternative. That\'s honest, right?' },
      { who: 'libby', text: 'Honest, and costly. That\'s the third way: <b>information leaking</b> out of control. Now they know they can push.' }
    ],
    cam: TABLE, task: { click: ['leak', 'supplier'], all: true, say: 'Click the leaking pipe, then the supplier.' },
    async enter(api) {
      api.clearThoughts(); api.zones(false); api.foot(true);
      await Promise.all([api.toTable(), api.stations(0), api.weeks(0, false), api.flagsTo(0), api.mishaps(['papers', 'lever'], false)]);
      api.showTags(['leak']); api.faces('think', 'worried');
      await api.mishaps(['papers', 'lever', 'leak']);
      api.supplierFace('grin');
    },
    done(api) { api.say('supplier', 'No alternative? Good to know.', 2200); api.faces('worried'); }
  },
  {
    id: 'target', title: 'Way four: no agreed target',
    lines: [
      { who: 'max', text: 'Fine, we\'ll walk away at 2%. No, 4%. Libby, what\'s our number?' },
      { who: 'libby', text: 'We never agreed one. No target and no <b>walk-away point</b>, the worst deal you\'d still sign. So we argue in the break.' }
    ],
    cam: TABLE, task: { click: ['target'], say: 'Click the target that won\'t sit still.' },
    async enter(api) {
      api.zones(false); api.foot(true);
      await Promise.all([api.toTable(), api.stations(0), api.weeks(0, false), api.flagsTo(0), api.mishaps(['papers', 'lever', 'leak'], false)]);
      api.showTags(['target']); api.faces('worried', 'think'); api.supplierFace('grin');
      await api.mishaps(['papers', 'lever', 'leak', 'target']);
      api.think('max', '2%? 4%? 8%?');
    },
    done(api) { api.say('supplier', 'Take all the time you need.', 2200); api.chars.max.pose('shrug'); api.chars.libby.pose('shrug'); setTimeout(() => api.poses('idle'), 2000); }
  },
  {
    id: 'facts', title: 'Start again, at Facts',
    lines: [
      { who: 'libby', text: 'Three of those four were settled before anyone sat down. The table is just where we found out.' },
      { who: 'max', text: 'Fine. Do-over. I\'ll walk this time, promise.' },
      { who: 'libby', text: 'First stop, <b>Facts</b>: targets, asks, the situation, the people involved and the history.' }
    ],
    cam: START, task: { click: ['facts'], say: 'Click the filing cabinet at Facts.' },
    async enter(api) {
      api.clearThoughts(); api.showTags([]); api.zones(false); api.supplierFace('happy');
      await Promise.all([api.mishaps([]), api.flagsTo(0), api.weeks(0, false), api.stations(0), api.foot(false)]);
      api.shortcut = false;
      await api.homeAll();
      api.faces('happy', 'happy');
      await api.walkTo('facts');
      await Promise.all([api.factsOpen(true), api.weeks(1)]);
      api.chars.libby.pose('point'); setTimeout(() => api.chars.libby.pose('idle'), 2000);
    },
    done(api) { api.faces('grin', 'happy'); }
  },
  {
    id: 'power', title: 'Power: weigh both sides',
    lines: [
      { who: 'libby', text: 'Next, <b>Power</b>. Collect your levers and theirs, and judge each side\'s real bargaining power.' },
      { who: 'max', text: 'Empty scales. So I walked in without knowing how strong we were?' }
    ],
    cam: POWER, task: { click: ['power'], say: 'Click the scales to load both sides\' levers.' },
    async enter(api) {
      api.clearThoughts(); api.showTags([]); api.zones(false); api.foot(false);
      await Promise.all([api.mishaps([], false), api.flagsTo(0), api.stations(1), api.weeks(1, false)]);
      api.faces('happy', 'think');
      await api.walkTo('power');
      api.weeks(2); api.faces('surprised', 'think');
    },
    async done(api) { await api.scales(1); api.faces('grin', 'happy'); api.chars.libby.pose('point'); setTimeout(() => api.chars.libby.pose('idle'), 1600); }
  },
  {
    id: 'walk', title: 'Plan, Play, Learn',
    lines: [
      { who: 'libby', text: '<b>Plan</b> picks which lever you use and when. <b>Play</b> is organising, rehearsing and running the day.' },
      { who: 'libby', text: '<b>Learn</b> captures what worked, and starts building power for next time.' },
      { who: 'max', text: 'Five steps, about four weeks. And the table is only step four!' }
    ],
    cam: MID, task: { click: ['plan', 'play', 'learn'], all: true, say: 'Click the whiteboard, the table and the trophy shelf.' },
    async enter(api) {
      api.clearThoughts(); api.showTags([]); api.zones(false); api.foot(false);
      await Promise.all([api.mishaps([], false), api.flagsTo(0), api.stations(2), api.weeks(2, false)]);
      api.faces('happy');
      await api.walkTo('plan'); await Promise.all([api.planDraw(true), api.weeks(3)]);
      await api.walkTo('play'); await Promise.all([api.playSet(true), api.targetState('agreed'), api.weeks(4)]); api.supplierFace('think');
      await api.walkTo('learn'); await api.learnOpen(true);
      await api.sparkHome(); await api.scales(2);
      api.faces('grin', 'happy');
    },
    done(api) { api.poses('cheer', 'idle'); setTimeout(() => api.poses('idle'), 1500); }
  },
  {
    id: 'sort-prep', title: 'Before the room: preparation',
    lines: [
      { who: 'libby', text: 'Let\'s sort Max\'s four mishaps. <b>Preparation</b> means Facts or Power. <b>Execution</b> means Plan or Play.' },
      { who: 'max', text: 'Show them again, then. I can take it.' }
    ],
    cam: OVER,
    task: { choice: { q: 'Which two of Max\'s mishaps were preparation failures?', options: [
      { text: 'The flying papers and the spinning target', ok: true, why: 'Right. Nobody read the old contract, and nobody agreed a walk-away point. Both belong at Facts, weeks before the day.' },
      { text: 'The pulled lever and the leaking pipe', why: 'Those went wrong once the plan met the room: when to pull a lever, and who says what. That\'s execution.' },
      { text: 'The flying papers and the leaking pipe', why: 'The papers were preparation, but the leak happened in the room when someone said too much.' }
    ] } },
    async enter(api) {
      api.clearThoughts(); api.foot(false); api.zones(true);
      await Promise.all([api.stations(5), api.weeks(4, false), api.flagsTo(0)]);
      api.showTags(['papers', 'lever', 'leak', 'target']); api.faces('happy', 'think'); api.supplierFace('grin');
      await api.mishaps(['papers', 'lever', 'leak', 'target']);
    },
    async done(api) {
      api.faces('grin', 'happy');
      await Promise.all([api.flag(0, true), api.flag(1, true)]);
      api.showTags(['lever', 'leak']);
      await api.mishaps(['lever', 'leak']);
    }
  },
  {
    id: 'sort-exec', title: 'In the room: execution',
    lines: [
      { who: 'libby', text: 'The other two are execution. The leak happened in the room, so that\'s a Play problem: one voice, agreed lines.' },
      { who: 'max', text: 'And my big threat went off in the room too. So that\'s Play as well, surely?' }
    ],
    cam: OVER,
    task: { pick: { answer: 'plan', say: 'Click the station where the timing of Max\'s threat should have been decided.', wrong: {
      play: 'It went off in the room, but which lever to use and when is decided in the Plan, before the day.',
      power: 'Power found the lever, and the lever was real. The mistake was its timing.',
      facts: 'The facts were fine here. The lever existed; it was used at the wrong moment.',
      learn: 'Learn writes it down afterwards. It can\'t stop it happening.',
      lever: 'That\'s the lever itself. Click the station where its timing gets decided.'
    }, why: 'Right. The Plan says which lever you use and when. Opening with the biggest threat leaves nothing to escalate to.' } },
    async enter(api) {
      api.clearThoughts(); api.foot(false); api.zones(true);
      await Promise.all([api.stations(5), api.weeks(4, false), api.flagsTo(2)]);
      api.showTags(['lever', 'leak']); api.faces('think', 'happy'); api.supplierFace('grin');
      await api.mishaps(['lever', 'leak']);
    },
    async done(api) {
      api.faces('grin', 'happy');
      await api.flag(2, true); await api.leverState('tidy');
      await api.flag(3, true); await api.leak(false);
      api.showTags([]); api.supplierFace('think');
    }
  },
  {
    id: 'heart', title: 'The heart of the method',
    lines: [
      { who: 'max', text: 'Flags at Facts, Plan and Play. So the step that matters most must be Play. That\'s where the deal happens!' },
      { who: 'libby', text: 'Play is where you find out. But one step sets the range of deals you can reach before you ever sit down.' }
    ],
    cam: OVER,
    task: { pick: { answer: 'power', say: 'Click the station that decides what you can realistically achieve.', wrong: {
      facts: 'Facts feed it, but facts alone don\'t tell you what you can win.',
      plan: 'The Plan uses your power well. It can\'t make power you don\'t have.',
      play: 'Good play gets you the most out of your power, but it can\'t create power you don\'t have.',
      learn: 'Learning builds power for next time, not for this deal.'
    }, why: 'Right. The balance of levers sets the range of deals you can reach. Everything after it is about using that power well.' } },
    async enter(api) {
      api.clearThoughts(); api.foot(false); api.zones(false); api.showTags([]);
      await Promise.all([api.stations(5), api.weeks(4, false), api.flagsTo(4), api.mishaps([], false)]);
      api.faces('grin', 'think'); api.supplierFace('think');
    },
    async done(api) {
      api.u.max = api.u.libby = null;
      await Promise.all([api.hop('libby', [-3.9, -1.3]), api.hop('max', [-5.4, -0.8])]);
      api.bump(); api.poses('cheer'); api.faces('grin', 'happy');
      api.say('libby', 'Your levers and theirs. That\'s the heart of it.', 2600);
      setTimeout(() => api.poses('idle'), 1800);
    }
  },
  {
    id: 'end', title: 'What you just learned',
    lines: [
      { who: 'max', text: 'So my shortcut was the long way round.' },
      { who: 'libby', text: 'Most deals are won or lost before the table. Next lesson, we start at Facts properly. See you there!' }
    ],
    summary: [
      'Most bad outcomes are settled before the meeting starts: no preparation, levers used badly, information leaking and no agreed target.',
      'Five steps, about four weeks: <b>Facts, Power, Plan, Play, Learn</b>. Most failures trace back to Facts or Power.',
      '<b>Power</b>, meaning your levers and theirs, is the heart of the method. Play can only use the power you bring.'
    ],
    cam: OVER, task: null,
    async enter(api) {
      api.clearThoughts(); api.foot(false); api.zones(false); api.showTags([]);
      await Promise.all([api.stations(5), api.weeks(4, false), api.flagsTo(4), api.mishaps([], false)]);
      api.faces('happy', 'grin'); api.supplierFace('happy'); api.poses('wave', 'idle');
      setTimeout(() => api.poses('idle'), 2600);
    }
  }
];
