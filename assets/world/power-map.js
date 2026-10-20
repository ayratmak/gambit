/* 3D mini-lesson: The power map. Course: Bargaining Power, lesson "When there are only two of you".
   One market square, one open stall. Max sells, Libby buys, every other stall is shut. Learners sort deals into
   "true monopoly" or "bilateral, but alternatives exist" (the other stalls light up or stay dark), then walk the
   power map on the floor and finish with the five things that decide the split. Cases and wording follow
   assets/courses/negotiation.js, so the 3D lesson and the text lesson agree. */
import { stage, scenery, prop, cast, V, THREE, box, animate, CAST } from './kit.js';

export const meta = {
  id: 'power-map',
  title: 'The power map',
  course: 'negotiation', lesson: 'only-two-of-you',
  minutes: 7
};

/* ---------- Layout ---------- */
const COUNTER_Z = -3.3;                           // Max's counter, centre line
const HOME = { max: [.6, -4.4], libby: [-2.9, -2.0] };
const SIDE = [3.0, -4.4], FRONT_SIDE = [3.0, -1.6]; // Max's way out from behind the counter
const TILE = [4.6, 3.0];
const QX = { w: -2.45, s: 2.45 };                 // columns: your power (Libby, the buyer)
const QZ = { s: 2.6, w: 5.9 };                    // rows: their power (Max), strong at the back
const MAP_BACK = QZ.s - TILE[1] / 2 - .35;        // back edge of the map frame
const RIVALS = [
  { key: 'stall-1', name: 'pear stall', goods: '#A9AE52', at: [-6.6, -5.6, .32] },
  { key: 'stall-2', name: 'apple stall', goods: '#B5533E', at: [6.6, -5.6, -.32] },
  { key: 'stall-3', name: 'lemon stall', goods: '#D8C04A', at: [-10, .9, .95] },
  { key: 'stall-4', name: 'plum stall', goods: '#6D4C78', at: [10, .9, -.95] }
];
const TOKENS = ['competition', 'information', 'alternatives', 'timing', 'focal'];
const TOKEN_NAMES = { competition: 'Competition', information: 'Information', alternatives: 'Alternatives', timing: 'Timing', focal: 'Focal points' };
const CASES = {
  oranges: 'Today: oranges for Libby\'s café',
  machine: 'Servicing Libby\'s patented coffee machine',
  haulage: 'Max has delivered for Libby for eight years',
  rack: 'Three more deals to sort',
  tuesday: 'Talks on the machine: next Tuesday',
  five: 'Who gets which slice?'
};

// A small seeded random so the cobbles land in the same place every time
const rand = (s => () => (s = (s * 16807) % 2147483647) / 2147483647)(42);
const noPick = o => { o.traverse(m => { m.userData.noPick = true; }); return o; };
const cyl = (rt, rb, h, m, x = 0, y = 0, z = 0, seg = 24) => { const c = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), m); c.position.set(x, y + h / 2, z); return c; };
const sph = (r, m, x = 0, y = 0, z = 0) => { const s = new THREE.Mesh(new THREE.SphereGeometry(r, 18, 12), m); s.position.set(x, y, z); return s; };

export function build(w) {
  const { scene, mat, label } = w;
  stage(w, { width: 26, depth: 18 });
  const cs = cast(w, { max: HOME.max, libby: HOME.libby });
  const api = { ...cs, case: 'oranges', stallMode: 'shut', stallText: 'Shut today', pie: { size: .75, share: .5, grown: false }, at: 'home' };

  /* ---------- The square: a paved inlay, cobbles, trees, lamps, bunting ---------- */
  const square = new THREE.Group();
  square.add(box(23.4, .02, 16, mat('floor'), 0, 0, 0, .6));
  const stoneM = mat('surface');
  for (let i = 0; i < 70; i++) {
    const x = -11 + rand() * 22, z = -7.5 + rand() * 15;
    if (Math.abs(x) < 3 && z < -1.8) continue;                 // keep clear of Max's stall
    if (Math.abs(x) < 5.4 && z > .9 && z < 7.6) continue;       // and of the power map
    const r = .16 + rand() * .2, s = cyl(r, r, .03, stoneM, x, .02, z, 7); s.rotation.y = rand() * 3; square.add(s);
  }
  const trunkM = mat('wood'), leafM = mat('water'), leafM2 = mat('muted');
  for (const [x, z, k] of [[-11.6, -7.3, 1], [11.6, -7.3, .9], [-12, -3.2, .7], [12, -3.1, .75]]) {
    square.add(cyl(.12 * k, .16 * k, 1.5 * k, trunkM, x, 0, z, 10));
    square.add(sph(.85 * k, leafM, x, 1.9 * k, z), sph(.6 * k, leafM2, x + .35 * k, 2.5 * k, z + .1), sph(.55 * k, leafM, x - .4 * k, 2.35 * k, z + .2));
  }
  const poleM = mat('mask'), lampM = mat('paper', { emissive: new THREE.Color('#fff0cc'), emissiveIntensity: .6 });
  for (const x of [-11.9, 11.9]) {
    square.add(cyl(.07, .1, 3.2, poleM, x, 0, 7.8, 10), cyl(.22, .16, .12, poleM, x, 3.2, 7.8, 12), sph(.18, lampM, x, 3.15, 7.8));
  }
  for (const [x, z] of [[-4.4, -6.6], [4.8, -6.9], [-12, 4.2], [12.1, 4.6], [-8.4, -7.3]]) {           // barrels
    square.add(cyl(.38, .34, .8, mat('wood'), x, 0, z, 18), cyl(.39, .39, .05, poleM, x, .18, z, 18), cyl(.39, .39, .05, poleM, x, .58, z, 18));
  }
  // bunting from the back stalls over Max's awning
  const flagMs = [mat('gold'), mat('paper'), mat(CAST.max.top), mat('accent')];
  const strM = mat('muted');
  const bunt = (a, b, sag) => {
    const n = 9;
    for (let i = 0; i <= n; i++) {
      const k = i / n, p = a.clone().lerp(b, k); p.y -= Math.sin(k * Math.PI) * sag;
      if (i < n) {
        const q = a.clone().lerp(b, (i + 1) / n); q.y -= Math.sin((i + 1) / n * Math.PI) * sag;
        const seg = new THREE.Mesh(new THREE.CylinderGeometry(.015, .015, p.distanceTo(q), 4), strM);
        seg.position.copy(p).lerp(q, .5); seg.quaternion.setFromUnitVectors(V(0, 1, 0), q.clone().sub(p).normalize()); square.add(seg);
        const f = new THREE.Mesh(new THREE.ConeGeometry(.17, .38, 3), flagMs[i % 4]);
        f.rotation.x = Math.PI; f.position.copy(p).lerp(q, .5); f.position.y -= .2; f.scale.z = .3; square.add(f);
      }
    }
  };
  bunt(V(-6.2, 3.4, -6.1), V(-2.3, 4.15, -4.9), .45);
  bunt(V(2.3, 4.15, -4.9), V(6.2, 3.4, -6.1), .45);
  scenery(w, square);

  /* ---------- Max's stall: counter, green awning, crates of oranges ---------- */
  const stall = new THREE.Group();
  const counterM = mat('wood'), plankM = mat('paper'), awnM = mat(CAST.max.top), awnB = mat('paper'), postM = mat('wood');
  stall.add(box(4.2, 1.0, 1.4, counterM, 0, 0, 0, .1));
  for (let i = 0; i < 5; i++) stall.add(box(.74, .7, .04, plankM, -1.68 + i * .84, .15, .71));
  stall.add(box(4.4, .06, 1.55, counterM, 0, .98, 0, .05));
  for (const [x, z, h] of [[-2.15, .78, 3.7], [2.15, .78, 3.7], [-2.15, -1.2, 4.1], [2.15, -1.2, 4.1]]) stall.add(cyl(.07, .07, h, postM, x, 0, z, 10));
  const awning = new THREE.Group();
  for (let i = 0; i < 8; i++) awning.add(box(.6, .06, 2.6, i % 2 ? awnB : awnM, -2.1 + i * .6, 0, 0));
  for (let i = 0; i < 8; i++) { const v = cyl(.3, .3, .05, i % 2 ? awnB : awnM, -2.1 + i * .6, -.22, 1.3, 16); v.rotation.x = Math.PI / 2; v.scale.set(1, 1, .5); awning.add(v); }
  awning.position.set(0, 3.8, -.2); awning.rotation.x = .17; stall.add(awning);
  stall.add(box(2.4, .6, .08, mat('paper'), 0, 4.1, 1.05, .08));
  const fruitM = mat('#D98A35'), crateM = mat('wood');
  for (const [x, z] of [[-1.35, -.35], [0, -.4], [1.35, -.35]]) {
    stall.add(box(1.1, .36, .62, crateM, x, 1.02, z, .04));
    for (let a = 0; a < 4; a++) for (let b = 0; b < 2; b++) stall.add(sph(.13, fruitM, x - .4 + a * .27, 1.46 + (a + b) % 2 * .04, z - .13 + b * .26));
  }
  stall.add(cyl(.05, .05, .5, mat('mask'), 2.0, 1.04, .25, 8), cyl(.22, .2, .05, mat('mask'), 2.0, 1.54, .25, 16));   // weighing scale
  stall.position.set(0, 0, COUNTER_Z);
  stall.traverse(o => { if (o.isMesh) { o.castShadow = o.receiveShadow = true; } });
  prop(w, 'stall', stall, null);
  label('stall', 'Max\'s oranges', V(0, 4.4, COUNTER_Z + 1.12), 'sign');

  /* ---------- The case board: an A-frame chalkboard saying which deal we're looking at ---------- */
  const easel = new THREE.Group();
  const chalkM = mat('mask'), frameM = mat('wood');
  for (const s of [-1, 1]) {
    const leaf = new THREE.Group();
    leaf.add(box(1.2, 1.5, .06, frameM, 0, 0, 0)); leaf.add(box(1.04, 1.3, .07, chalkM, 0, .1, 0));
    leaf.add(box(.6, .03, .08, mat('paper'), -.1, 1.0, s * .01), box(.8, .03, .08, mat('paper'), 0, .8, s * .01), box(.5, .03, .08, mat('paper'), -.15, .6, s * .01));
    leaf.position.z = s * .32; leaf.rotation.x = s * .22; easel.add(leaf);
  }
  easel.position.set(4.4, 0, -2.6); easel.rotation.y = -.35;
  easel.traverse(o => { if (o.isMesh) o.castShadow = true; });
  const caseBoard = prop(w, 'case-board', easel, CASES.oranges, 2.3);

  /* ---------- The licence seal, pinned to the front of the counter when Max is the only one allowed ---------- */
  const seal = new THREE.Group();
  const sealM = mat('gold'), ribbonM = mat('bad');
  for (const dx of [-.16, .16]) { const r = box(.16, .55, .03, ribbonM, dx, -.55, 0); r.rotation.z = dx * 1.2; seal.add(r); }
  const disc = new THREE.Mesh(new THREE.CylinderGeometry(.42, .42, .08, 32), sealM); disc.rotation.x = Math.PI / 2; seal.add(disc);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(.32, .03, 8, 32), mat('paper')); ring.position.z = .05; seal.add(ring);
  seal.add(box(.3, .06, .03, mat('paper'), 0, -.03, .06));
  seal.position.set(-1.25, .62, COUNTER_Z + .78);
  const licence = prop(w, 'licence', seal, null);

  /* ---------- The pie, on the counter: Max's slice green, Libby's gold ---------- */
  const pieG = new THREE.Group();
  const plate = cyl(.62, .55, .04, mat('paper'), 0, 0, 0, 32); pieG.add(plate);
  const maxSlice = new THREE.Mesh(new THREE.BufferGeometry(), mat(CAST.max.top));
  const libSlice = new THREE.Mesh(new THREE.BufferGeometry(), mat(CAST.libby.top));
  const knife = new THREE.Group();
  knife.add(box(.035, .03, .5, mat('paper', { metalness: .3, roughness: .3 }), 0, 0, .28));
  knife.add(box(.06, .06, .2, mat('mask'), 0, 0, -.06));
  pieG.add(maxSlice, libSlice, knife);
  pieG.position.set(-1.0, 1.04, COUNTER_Z + .3);
  const pie = prop(w, 'pie', pieG, 'The pie', 1.05);
  const drawPie = (size, share) => {
    const r = .5 * size, h = .2;
    [maxSlice, libSlice].forEach(m => m.geometry.dispose());
    maxSlice.geometry = new THREE.CylinderGeometry(r, r, h, 40, 1, false, 0, Math.PI * 2 * share);
    libSlice.geometry = new THREE.CylinderGeometry(r, r, h, 40, 1, false, Math.PI * 2 * share, Math.PI * 2 * (1 - share));
    maxSlice.position.y = libSlice.position.y = .04 + h / 2;
    knife.rotation.y = Math.PI * 2 * share; knife.position.y = .04 + h + .03; knife.scale.setScalar(Math.max(.8, size));
    plate.scale.set(Math.max(1, size), 1, Math.max(1, size));
  };
  api.pieSet = async (size, share, ms = 900) => {
    const a = { ...api.pie };
    api.pie.size = size; api.pie.share = share;
    if (!ms) return drawPie(size, share);
    await animate(ms, k => drawPie(a.size + (size - a.size) * k, a.share + (share - a.share) * k));
  };
  drawPie(api.pie.size, api.pie.share);

  /* ---------- The rival stalls: shut, unknown, open (lit) or locked out ---------- */
  api.rivals = RIVALS.map((R, i) => {
    const g = new THREE.Group();
    const wood = mat('wood'), shutM = mat('surface'), slatM = mat('muted'), dimAwn = mat('muted'), litAwn = mat('gold'), paperM = mat('paper');
    const bulbM = mat('paper', { emissive: new THREE.Color('#ffc65c'), emissiveIntensity: 0 });
    g.add(box(2.7, .9, 1.0, wood, 0, 0, 0, .08));
    g.add(box(2.85, .05, 1.1, wood, 0, .88, 0));
    for (const [x, z, h] of [[-1.3, .5, 2.4], [1.3, .5, 2.4], [-1.3, -.5, 2.7], [1.3, -.5, 2.7]]) g.add(cyl(.05, .05, h, wood, x, 0, z, 8));
    const goodsM = mat(R.goods);
    for (let a = 0; a < 6; a++) for (let b = 0; b < 2; b++) g.add(sph(.12, goodsM, -.75 + a * .3, 1.05, -.15 + b * .25));
    const strips = [];
    const awn = new THREE.Group();
    for (let s = 0; s < 6; s++) { const st = box(.5, .05, 1.5, s % 2 ? paperM : dimAwn, -1.25 + s * .5, 0, 0); if (!(s % 2)) strips.push(st); awn.add(st); }
    awn.position.set(0, 2.55, 0); awn.rotation.x = .2; g.add(awn);
    // roll-up shutter, pivoting at its top edge
    const shutter = new THREE.Group();
    shutter.add(box(2.55, 1.45, .06, shutM, 0, -1.45, 0));
    for (let s = 0; s < 6; s++) shutter.add(box(2.56, .025, .08, slatM, 0, -1.3 + s * .24, 0));
    shutter.position.set(0, 2.38, .56); g.add(shutter);
    // two planks nailed across: nobody else may do this
    const cross = new THREE.Group(), barM = mat('bad');
    for (const r of [.42, -.42]) { const p = box(2.6, .14, .05, barM, 0, -.07, 0); p.rotation.z = r; cross.add(p); }
    cross.position.set(0, 1.65, .64); cross.visible = false; g.add(cross);
    // lantern
    const lantern = new THREE.Group();
    lantern.add(box(.02, .35, .02, mat('mask'), 0, -.35, 0));
    const bulb = sph(.16, bulbM, 0, -.48, 0); bulb.userData.noGlow = true; lantern.add(bulb);
    lantern.add(cyl(.12, .18, .08, mat('mask'), 0, -.36, 0, 12));
    lantern.position.set(1.05, 2.42, .85); g.add(lantern);
    g.position.set(R.at[0], 0, R.at[1]); g.rotation.y = R.at[2];
    g.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
    const p = prop(w, R.key, g, 'Shut today', 3.35);
    return { ...R, g, shutter, cross, bulbM, strips, dimAwn, litAwn, prop: p, open: 0 };
  });
  api.stalls = async (mode, text) => {
    api.stallMode = mode; api.stallText = text;
    const target = mode === 'open' ? 1 : 0;
    api.rivals.forEach(r => { r.prop.label.set(text); r.cross.visible = false; });
    await Promise.all(api.rivals.map(async (r, i) => {
      if (Math.abs(r.open - target) > .01) {
        const from = r.open;
        await new Promise(res => setTimeout(res, i * 140));
        await animate(650, k => {
          r.open = from + (target - from) * k;
          r.shutter.scale.y = Math.max(.06, 1 - r.open * .94);
          r.bulbM.emissiveIntensity = r.open * 1.4;
        });
        r.strips.forEach(s => { s.material = target ? r.litAwn : r.dimAwn; });
      }
      r.open = target; r.shutter.scale.y = target ? .06 : 1; r.bulbM.emissiveIntensity = target * 1.4;
      r.strips.forEach(s => { s.material = target ? r.litAwn : r.dimAwn; });
      if (mode === 'locked') {
        r.cross.visible = true; r.cross.scale.set(.001, 1, 1);
        await animate(400, k => r.cross.scale.set(Math.max(.001, k), 1, 1));
      }
    }));
  };

  /* ---------- Three placards for the quick sort ---------- */
  api.placards = {};
  const placard = (key, x, title, icon) => {
    const g = new THREE.Group(), postPM = mat('wood'), faceM = mat('paper');
    g.add(cyl(.06, .08, 1.3, postPM, 0, 0, 0, 10), cyl(.35, .4, .08, postPM, 0, 0, 0, 16));
    g.add(box(1.7, 1.15, .08, faceM, 0, 1.2, 0, .1));
    const ic = new THREE.Group(); icon(ic); ic.position.set(0, 1.78, .06); g.add(ic);
    g.position.set(x, 0, 1.6);
    g.traverse(o => { if (o.isMesh) o.castShadow = true; });
    const p = prop(w, key, g, title, 2.85);
    api.placards[key] = { g, prop: p, title };
    return g;
  };
  placard('case-software', -3.8, 'Software your staff all know', ic => {
    ic.add(box(.8, .52, .05, mat('mask'), 0, -.3, 0), box(.68, .4, .06, mat('water'), 0, -.24, 0), box(.1, .14, .05, mat('mask'), 0, -.44, 0), box(.4, .04, .12, mat('mask'), 0, -.46, 0));
  });
  const hourglass = new THREE.Group();
  placard('case-patent', 0, 'A drug patent, five years left', ic => {
    const cap = new THREE.Group();
    const a = new THREE.Mesh(new THREE.CapsuleGeometry(.14, .3, 6, 16), mat('bad')); cap.add(a);
    const b = new THREE.Mesh(new THREE.CapsuleGeometry(.145, .3, 6, 16), mat('paper')); b.scale.set(1.01, .5, 1.01); b.position.y = .1; cap.add(b);
    cap.rotation.z = 1.1; cap.position.set(-.05, -.3, .1); ic.add(cap);
    const sandM = mat('gold'), glassM = mat('paper', { transparent: true, opacity: .55 });
    const top = new THREE.Mesh(new THREE.ConeGeometry(.16, .28, 16), glassM); top.rotation.x = Math.PI; top.position.y = .2;
    const bot = new THREE.Mesh(new THREE.ConeGeometry(.16, .28, 16), sandM); bot.position.y = -.06;
    hourglass.add(top, bot, cyl(.2, .2, .04, mat('wood'), 0, .34, 0, 16), cyl(.2, .2, .04, mat('wood'), 0, -.24, 0, 16));
    hourglass.position.set(.62, -.25, .12); hourglass.visible = false; ic.add(hourglass);
  });
  placard('case-landlord', 3.8, 'Your landlord, at renewal', ic => {
    ic.add(box(.6, .42, .1, mat('surface'), 0, -.55, 0));
    const roof = new THREE.Mesh(new THREE.ConeGeometry(.5, .32, 4), mat('bad')); roof.rotation.y = Math.PI / 4; roof.scale.z = .25; roof.position.y = -.0; ic.add(roof);
    ic.add(box(.14, .24, .12, mat('wood'), 0, -.55, 0));
  });
  api.hourglass = async on => {
    hourglass.visible = on; if (!on) return;
    hourglass.scale.setScalar(.001);
    await animate(500, k => hourglass.scale.setScalar(Math.max(.001, k)));
  };
  api.showPlacards = on => Object.values(api.placards).forEach(p => p.prop.show(on));

  /* ---------- The power map: a 2x2 floor mat that rolls out towards you ---------- */
  const map = new THREE.Group();
  map.position.set(0, 0, MAP_BACK);
  scene.add(map);
  const mapW = TILE[0] * 2 + .3 + .8, mapD = TILE[1] * 2 + .3 + .7;
  const frame = box(mapW, .1, mapD, mat('surface'), 0, 0, mapD / 2, .3);
  noPick(frame); frame.receiveShadow = true; map.add(frame);
  api.quads = {};
  const quadLabels = [];
  const icons = {
    race(g) {      // three runners on a start line: a competition
      const lineM = mat('paper');
      g.add(box(2.0, .02, .1, lineM, 0, .1, .35));
      [[mat(CAST.max.top), -.6], [mat('muted'), 0], [mat('gold'), .6]].forEach(([m, x]) => {
        g.add(cyl(.0, .2, .55, m, x, .1, 0, 16), sph(.13, m, x, .78, 0));
      });
      const flagM = mat('bad'); g.add(cyl(.025, .025, 1.0, mat('mask'), .95, .1, -.2, 6), box(.32, .2, .02, flagM, 1.11, .88, -.2));
    },
    table(g) {     // a small round table, two stools and a notebook: a prepared one-to-one
      const tw = mat('wood');
      g.add(cyl(.5, .5, .06, tw, 0, .62, 0, 24), cyl(.05, .07, .62, tw, 0, .1, 0, 8));
      for (const x of [-.78, .78]) g.add(cyl(.2, .2, .05, tw, x, .42, 0, 16), cyl(.04, .05, .32, tw, x, .1, 0, 6));
      g.add(box(.36, .04, .26, mat('paper'), -.08, .68, .02), box(.03, .03, .26, mat('bad'), .14, .7, 0));
    },
    scales(g) {    // a balance, level: both can walk away
      const sm = mat('gold');
      g.add(cyl(.05, .07, .9, mat('mask'), 0, .1, 0, 8), box(1.3, .05, .05, sm, 0, .98, 0));
      for (const x of [-.6, .6]) g.add(box(.02, .3, .02, sm, x, .7, 0), cyl(.25, .18, .06, sm, x, .66, 0, 16));
      g.add(cyl(.3, .3, .03, mat('mask'), 0, .1, 0, 16));
    }
  };
  const QUADS = {
    'quad-ws': { you: 'w', them: 's', icon: 'table', text: 'Cooperative, prepared one-to-one' },
    'quad-ss': { you: 's', them: 's', icon: 'scales', text: 'Both can walk away' },
    'quad-ww': { you: 'w', them: 'w', icon: 'table', text: 'Cooperative, prepared one-to-one' },
    'quad-sw': { you: 's', them: 'w', icon: 'race', text: 'Run a competition' }
  };
  for (const [key, Q] of Object.entries(QUADS)) {
    const g = new THREE.Group();
    const tileM = mat('raised'), edgeM = mat(Q.icon === 'race' ? 'gold' : Q.icon === 'scales' ? 'muted' : 'water');
    g.add(box(TILE[0], .08, TILE[1], tileM, 0, 0, 0, .2));
    g.add(box(TILE[0] - .3, .02, .1, edgeM, 0, .08, -TILE[1] / 2 + .2));
    const ic = new THREE.Group(); icons[Q.icon](ic); ic.position.set(0, 0, -.75); ic.scale.setScalar(.85); g.add(ic);
    g.position.set(QX[Q.you], .1, QZ[Q.them] - MAP_BACK);
    g.traverse(o => { if (o.isMesh) o.castShadow = true; });
    map.add(w.thing(key, g));
    const l = label(key, Q.text, V(0, 1.25, -.75), 'sign'); g.add(l.obj); quadLabels.push(l);
    api.quads[key] = { ...Q, g, icon: ic, tileM, edgeM, label: l };
  }
  const axes = [
    label(null, 'You: weak', V(QX.w, .3, .1), 'axis'), label(null, 'You: strong', V(QX.s, .3, .1), 'axis'),
    label(null, 'Them: strong', V(-mapW / 2 - .55, .3, QZ.s - MAP_BACK), 'axis row'), label(null, 'Them: weak', V(-mapW / 2 - .55, .3, QZ.w - MAP_BACK), 'axis row')
  ];
  axes.forEach(l => map.add(l.obj));
  const mapLabels = [...quadLabels, ...axes];
  map.visible = false; mapLabels.forEach(l => { l.el.hidden = true; });
  api.mapOn = false;
  api.showMap = async on => {
    if (!on) { map.visible = false; mapLabels.forEach(l => { l.obj.visible = false; l.el.hidden = true; }); api.mapOn = false; return; }
    if (api.mapOn) return;
    api.mapOn = true; map.visible = true;
    mapLabels.forEach(l => { l.obj.visible = true; l.el.hidden = false; l.el.style.opacity = 0; });
    const icos = Object.values(api.quads).map(q => q.icon);
    icos.forEach(i => i.scale.setScalar(.001));
    map.scale.set(1, 1, .001);
    await animate(900, k => map.scale.set(1, 1, Math.max(.001, k)));
    axes.forEach(l => { l.el.style.opacity = 1; });
    for (const [n, q] of Object.values(api.quads).entries()) {
      await new Promise(res => setTimeout(res, 120 * Math.min(n, 1)));
      await animate(380, k => { q.icon.scale.setScalar(Math.max(.001, k * .85 + Math.sin(k * Math.PI) * .25)); q.label.el.style.opacity = k; });
    }
  };
  // Dim every square but one (null shows all)
  api.spotQuad = key => {
    Object.entries(api.quads).forEach(([k, q]) => {
      const on = !key || k === key;
      q.g.traverse(o => { if (o.isMesh) { o.material.transparent = true; o.material.opacity = on ? 1 : .3; } });
      q.label.el.style.opacity = on ? 1 : .25;
    });
  };
  api.quadSpot = (key, who) => {
    const q = QUADS[key];
    return [QX[q.you] + (who === 'max' ? -.85 : .85), QZ[q.them] + .55];
  };

  /* ---------- The new stall going up: a second supplier, months away ---------- */
  const build2 = new THREE.Group();
  const scafM = mat('wood'), tarpM = mat('muted');
  for (const [x, z] of [[-1.2, -.5], [1.2, -.5], [-1.2, .5], [1.2, .5]]) build2.add(box(.1, 2.5, .1, scafM, x, 0, z));
  for (const y of [.9, 1.8]) build2.add(box(2.5, .08, .08, scafM, 0, y, .5), box(2.5, .08, .08, scafM, 0, y, -.5));
  const brace = box(.07, 2.6, .07, scafM, 0, 0, .52); brace.rotation.z = .85; brace.position.y = 1.2; build2.add(brace);
  build2.add(box(1.4, .5, .8, scafM, -.4, 0, 0), box(1.1, .08, 1.0, tarpM, .55, .02, .05));
  build2.add(box(.9, .5, .05, mat('paper'), 0, 2.15, .58));
  build2.position.set(9.0, 0, 5.8); build2.rotation.y = -.6;
  build2.traverse(o => { if (o.isMesh) o.castShadow = true; });
  const newStall = prop(w, 'new-stall', build2, 'Second supplier, months away', 3.1);
  api.newStall = async on => {
    if (!on) return newStall.show(false);
    if (build2.visible && build2.scale.y > .99) return;
    newStall.show(true); build2.scale.set(1, .001, 1);
    await animate(1100, k => build2.scale.set(1, Math.max(.001, k), 1));
  };

  /* ---------- Five tokens on the counter ---------- */
  api.tokens = {};
  const emblem = {
    competition(g, m) { g.add(box(.11, .2, .04, m, -.13, -.15, 0), box(.11, .3, .04, m, 0, -.15, 0), box(.11, .13, .04, m, .13, -.15, 0), box(.42, .03, .04, m, 0, -.18, 0)); },
    information(g, m) { const t = new THREE.Mesh(new THREE.TorusGeometry(.11, .028, 8, 24), m); t.position.set(-.04, .05, 0); g.add(t); const h = box(.05, .17, .04, m, .1, -.2, 0); h.rotation.z = .8; g.add(h); },
    alternatives(g, m) { g.add(box(.04, .38, .04, m, 0, -.2, 0)); const a = box(.26, .07, .04, m, .08, .04, 0); a.rotation.z = .25; const b = box(.26, .07, .04, m, -.08, -.08, 0); b.rotation.z = -.25; g.add(a, b); },
    timing(g, m) { const t = new THREE.Mesh(new THREE.TorusGeometry(.19, .025, 8, 32), m); g.add(t, box(.03, .14, .04, m, 0, -.01, 0), box(.11, .03, .04, m, .05, -.015, 0)); },
    focal(g, m) { [.2, .11].forEach(r => g.add(new THREE.Mesh(new THREE.TorusGeometry(r, .022, 8, 32), m))); g.add(sph(.045, m)); }
  };
  TOKENS.forEach((t, i) => {
    const g = new THREE.Group(), discM = mat('gold'), standM = mat('wood'), emM = mat('mask');
    g.add(box(.4, .06, .22, standM, 0, 0, 0, .03));
    const d = new THREE.Mesh(new THREE.CylinderGeometry(.33, .33, .08, 36), discM); d.rotation.x = Math.PI / 2; d.position.y = .42; g.add(d);
    const e = new THREE.Group(); emblem[t](e, emM); e.position.set(0, .42, .05); g.add(e);
    g.position.set(-1.72 + i * .86, 1.04, COUNTER_Z + .45);
    g.traverse(o => { if (o.isMesh) o.castShadow = true; });
    const key = 'tok-' + t;
    const p = prop(w, key, g, null);
    const l = label(key, TOKEN_NAMES[t], V(0, i % 2 ? -.72 : -.36, .3), 'sign'); g.add(l.obj);
    api.tokens[key] = { g, prop: p, label: l, y: 1.04 };
  });
  api.showTokens = async on => {
    const list = Object.values(api.tokens);
    const show = (t, v) => { t.g.visible = v; t.label.obj.visible = v; t.label.el.hidden = !v; };
    if (!on) return list.forEach(t => show(t, false));
    if (list.every(t => t.g.visible && Math.abs(t.g.position.y - t.y) < .01)) return;
    list.forEach(t => { show(t, true); t.g.position.y = t.y + 3; t.label.el.style.opacity = 0; });
    for (const t of list) {
      await animate(320, k => { t.g.position.y = t.y + 3 * (1 - k); t.label.el.style.opacity = k; });
    }
  };

  /* ---------- Scene setup helpers ---------- */
  api.setCase = (key) => {
    api.case = key; caseBoard.label.set(CASES[key]);
    const names = {
      oranges: ['Max', 'Libby'], machine: ['Max · servicing firm', 'Libby · café'], haulage: ['Max · delivery firm', 'Libby · café'],
      rack: ['Max', 'Libby'], tuesday: ['Max · servicing firm', 'Libby · café'], five: ['Max', 'Libby']
    }[key];
    cs.name('max', names[0]); cs.name('libby', names[1]);
  };
  api.showLicence = async on => {
    if (!on) return licence.show(false);
    if (seal.visible && seal.scale.x > .99) return;
    licence.show(true); seal.scale.setScalar(.001);
    await animate(500, k => seal.scale.setScalar(Math.max(.001, k + Math.sin(k * Math.PI) * .3)));
  };
  api.only = ({ pie: p = false, placards = false, map: m = false, tokens = false, licence: lic = false, scaffold = false } = {}) => {
    pie.show(p); api.showPlacards(placards); if (!placards) api.hourglass(false);
    if (!m) api.showMap(false);
    if (!tokens) api.showTokens(false);
    if (!lic) api.showLicence(false);
    if (!scaffold) api.newStall(false);
    cs.clearThoughts();
  };

  /* ---------- Moving Max and Libby around the square ---------- */
  const pos = who => cs.chars[who].root.position;
  const near = (who, p) => Math.hypot(pos(who).x - p[0], pos(who).z - p[1]) < .1;
  api.toQuad = async key => {
    if (api.at === key && near('max', api.quadSpot(key, 'max'))) return;
    const behind = pos('max').z < COUNTER_Z - .5;
    const maxGo = async () => {
      if (behind) { await cs.walk('max', SIDE, 700); await cs.walk('max', FRONT_SIDE, 900); }
      await cs.hop('max', api.quadSpot(key, 'max'), 950);
    };
    const libGo = () => api.at === 'home' ? cs.walk('libby', api.quadSpot(key, 'libby'), 1500) : cs.hop('libby', api.quadSpot(key, 'libby'), 950);
    await Promise.all([maxGo(), libGo()]);
    api.at = key;
  };
  api.goHome = async () => {
    const jobs = [];
    if (!near('max', HOME.max)) jobs.push((async () => {
      if (pos('max').z > COUNTER_Z - .5) { await cs.hop('max', FRONT_SIDE, 900); await cs.walk('max', SIDE, 800); }
      await cs.walk('max', HOME.max, 700);
    })());
    if (!near('libby', HOME.libby)) jobs.push(cs.walk('libby', HOME.libby, 1300));
    await Promise.all(jobs);
    api.at = 'home';
  };

  // Starting state
  api.only();
  api.rivals.forEach(r => { r.shutter.scale.y = 1; });
  return api;
}

/* ---------- State cards ---------- */
export function card(key, ctx) {
  const api = ctx.api, c = api.case, mode = api.stallMode;
  const rival = RIVALS.find(r => r.key === key);
  if (rival) {
    const n = rival.name;
    const byCase = {
      oranges: mode === 'open'
        ? { rows: [['Sells', 'Fruit, oranges included'], ['Open', 'Yes, and keen'], ['At the table today', 'No']],
            text: ctx.reached('competition') ? 'Ready to bid for Libby\'s order. With four stalls in the race, Max can\'t name his price.' : 'Shut today, open tomorrow. It isn\'t in the room, but it\'s a real alternative for Libby.' }
        : { rows: [['Sells', 'Fruit, oranges included'], ['Open today', 'No'], ['Gone for good', 'No']],
            text: 'Shut for the day. Nobody else is at the table, which makes this deal bilateral. It doesn\'t make Max a monopoly.' },
      machine: { rows: [['Could service the machine', mode === 'locked' ? 'No, not licensed' : 'Not decided yet'], ['Exists', 'Yes']],
        text: mode === 'locked' ? 'Other firms exist, but none is licensed to touch this machine. No one else can legally do it, so this stall stays dark.' : 'Could this stall do the job instead? Sort the deal and it will light up or stay dark.' },
      haulage: { rows: [['Could deliver to the café', mode === 'open' ? 'Yes' : 'Not decided yet'], ['Switching', 'Painful, not impossible']],
        text: mode === 'open' ? 'Another delivery firm. Eight years with Max makes switching feel hard, but it can be done. That\'s an alternative.' : 'Could this stall do the job instead? Sort the deal and it will light up or stay dark.' },
      rack: { rows: [['Shows', 'Whether anyone else could do it'], ['Lit', 'Bilateral, alternatives exist'], ['Barred', 'True monopoly']],
        text: mode === 'locked' ? 'Barred for the drug patent: nobody else can sell it while the patent holds. When it ends in five years, rivals can open up.' : 'The stalls light up when anyone else could, in principle, do the deal, and stay dark when no one can.' },
      tuesday: { rows: [['Could service the machine', 'No, not licensed'], ['Could that change', 'Yes, over months']],
        text: 'Qualifying a second supplier is how Libby builds power for next time. It won\'t happen by Tuesday.' },
      five: { rows: [['Open', mode === 'open' ? 'Yes' : 'No'], ['Which of the five', 'Competition']],
        text: 'A rival who could do the deal is competition, the first of the five things that decide the split.' }
    };
    const b = byCase[c] || byCase.rack;
    return { kicker: 'Another stall · ' + api.stallText, title: 'The ' + n, rows: b.rows, text: b.text };
  }
  if (key.startsWith('quad-')) {
    const Q = {
      'quad-sw': { kicker: 'Power map · you strong, them weak', title: 'Run a competition',
        rows: [['Your power', 'High'], ['Their power', 'Low'], ['Approach', 'Run a competition'], ['How', 'Course 6, Designing a Winning Tender']],
        text: 'You have real alternatives and they need you. Put them in a race against each other and let the competition set the price.' },
      'quad-ws': { kicker: 'Power map · you weak, them strong', title: 'A cooperative, prepared one-to-one',
        rows: [['Your power', 'Low'], ['Their power', 'High'], ['Approach', 'Cooperative, carefully prepared'], ['Before every offer', 'Ask how they\'ll react']],
        text: 'They hold the cards. Weak isn\'t powerless: use the levers you have as well as possible, and start building more for next time.' },
      'quad-ww': { kicker: 'Power map · you weak, them weak', title: 'A cooperative, prepared one-to-one',
        rows: [['Your power', 'Low'], ['Their power', 'Low'], ['Approach', 'Cooperative, carefully prepared']],
        text: 'Neither side can push hard. You\'re weak, so the rule for weak you still applies: work with them, and prepare as carefully as ever.' },
      'quad-ss': { kicker: 'Power map · you strong, them strong', title: 'Both can walk away',
        rows: [['Your power', 'High'], ['Their power', 'High'], ['Approach', 'Prepared one-to-one, options kept real']],
        text: 'Our reading, not a rule from the lesson: with options on both sides, neither can squeeze the other. Prepare as carefully as ever and keep your alternatives real.' }
    }[key];
    let extra = '';
    if (key === 'quad-sw' && ctx.reached('competition')) extra = ' The orange deal sits here: Max has no plan B, Libby has four stalls to try.';
    if (key === 'quad-ws' && ctx.reached('weak-you')) extra = ' The coffee-machine deal sits here: only Max\'s firm is licensed.';
    return { ...Q, text: Q.text + extra };
  }
  if (key.startsWith('tok-')) {
    const T = {
      'tok-competition': { title: 'Competition', rows: [['Asks', 'Who else could do this deal?'], ['Lesson', 'Competition changes everything']],
        text: 'The same stock and the same costs can split very differently once there is a second bidder, or a missing one.' },
      'tok-information': { title: 'Information', rows: [['Asks', 'Who knows the real costs and values?'], ['Lesson', 'What they know, what you know']],
        text: 'The side that knows more can claim more. Later you\'ll see how to make the other side reveal what it knows.' },
      'tok-alternatives': { title: 'Alternatives', rows: [['Asks', 'What happens if you walk?'], ['Lesson', 'Your best alternative'], ['Max today', 'No plan B']],
        text: 'Your BATNA, your best alternative to a negotiated agreement, sets your walk-away point. The better it is, the less you need them.' },
      'tok-timing': { title: 'Timing', rows: [['Asks', 'Whose clock is running?'], ['Lesson', 'Clocks and focal points'], ['Max today', 'Oranges won\'t keep past Saturday']],
        text: 'A deadline helps the side less hurt by no deal, and only if it\'s believed.' },
      'tok-focal': { title: 'Focal points', rows: [['Asks', 'Which number will everyone argue from?'], ['Lesson', 'Clocks and focal points']],
        text: 'Last year\'s price, a benchmark, a 50:50 split. The first credible number becomes the focal point, and once given it\'s hard to remove.' }
    }[key];
    return { kicker: 'One of five things that decide the split', ...T };
  }
  const machineCase = c === 'machine' || c === 'tuesday';
  const C = {
    max: c === 'haulage'
      ? { kicker: 'Seller · delivery firm', title: 'Max', rows: [['Delivers to', 'Libby\'s café'], ['For', 'Eight years'], ['Wants', 'Higher rates'], ['Only one who could', 'No']],
          text: 'A long, comfortable relationship isn\'t a monopoly. Other delivery firms exist, even if switching would be a pain.' }
      : machineCase
      ? { kicker: 'Seller · servicing firm', title: 'Max', rows: [['Services', 'Libby\'s patented coffee machine'], ['Licensed rivals', 'None'], ['Power', 'High']],
          text: 'The only firm licensed to service this machine. That\'s a true monopoly, so any deal with him is bilateral too.' }
      : { kicker: 'Seller · fruit stall', title: 'Max', rows: [['Sells', 'Oranges'], ['Customers today', 'Just Libby'], ['Plan B', 'None'], ['Fruit keeps until', 'Saturday']],
          text: ctx.reached('competition') ? 'No plan B and a clock running: his power is low, however empty the square looks.' : 'Max grabs the biggest number in front of him. Today, that\'s whatever price he thinks Libby will pay.' },
    libby: machineCase
      ? { kicker: 'Buyer · café owner', title: 'Libby', rows: [['Needs', 'Her machine serviced'], ['Alternatives', 'None licensed'], ['Power', 'Low']],
          text: ctx.reached('tuesday') ? 'For Tuesday, she uses what she has. For next time, she starts qualifying a second supplier.' : 'Weak here, so she plans a cooperative, carefully prepared one-to-one.' }
      : { kicker: 'Buyer · café owner', title: 'Libby', rows: [['Wants', 'Oranges for juice'], ['Other stalls', 'Shut today, open tomorrow'], ['Knows', 'Her walk-away point']],
          text: 'Libby asks one question before every offer: how will they react when they get this?' },
    stall: { kicker: 'The only stall open', title: 'Max\'s oranges', rows: [['Open today', 'Yes'], ['Rival stalls open', mode === 'open' ? 'Yes' : 'No'], ['Customers', 'One: Libby']],
      text: 'One buyer, one seller, nobody else at the table: a bilateral negotiation. Who is stronger is a separate question.' },
    'case-board': { kicker: 'The deal we\'re looking at', title: CASES[c], rows: [['Parties at the table', 'Two'], ['Test', 'Could anyone else, in principle, do this?']],
      text: c === 'five' ? 'However the deal is set up, five things decide who gets which slice.' : 'Max and Libby act out each deal at the stall. The other stalls show whether anyone else could do it.' },
    licence: { kicker: 'Pinned to the counter', title: 'The licence', rows: [['Held by', 'Max\'s servicing firm'], ['Lets them', 'Service the patented machine'], ['Anyone else', 'Not allowed']],
      text: 'This is what makes it a true monopoly: no one else can legally do the work.' },
    pie: { kicker: 'What the deal is worth', title: 'The pie', rows: [['Size', api.pie.size > 1 ? 'Bigger' : 'As it stands'], ['Max\'s slice', Math.round(api.pie.share * 100) + '%'], ['Libby\'s slice', Math.round((1 - api.pie.share) * 100) + '%']],
      text: api.pie.size > 1 ? 'First the pie grew, so there was more for both. Then the cut moved Libby\'s way. Every tactic serves one or the other.' : 'Every negotiation argues about two things: how big the pie is, and how it\'s cut.' },
    'case-software': { kicker: 'Placard', title: 'Software your staff all know', rows: [['Bucket', api.hourglassOn ? 'Bilateral, alternatives exist' : '?'], ['Why', 'Rivals exist; retraining costs money']],
      text: 'Swapping means retraining everyone, which costs money. It doesn\'t make the vendor the only one.' },
    'case-patent': { kicker: 'Placard', title: 'A drug patent, five years left', rows: [['Bucket', api.hourglassOn ? 'True monopoly, for now' : '?'], ['Ends', 'When the patent runs out']],
      text: 'While the patent holds, nobody else can make it. A monopoly for now, until the patent ends.' },
    'case-landlord': { kicker: 'Placard', title: 'Your landlord, at renewal', rows: [['Bucket', api.hourglassOn ? 'Bilateral, alternatives exist' : '?'], ['Alternative', 'Move premises']],
      text: 'Moving is a hassle, but you could. That\'s the alternative.' },
    'new-stall': { kicker: 'Being built', title: 'A second supplier', rows: [['Ready by Tuesday', 'No'], ['Ready in', 'Months'], ['Changes', 'Libby\'s power next time']],
      text: 'Structural work: qualifying a second supplier or changing a design, done months before the meeting.' }
  };
  return C[key] || { kicker: '', title: key, rows: [], text: '' };
}

/* ---------- Camera presets: [position, target], wide (about 1.2:1, fov 32) and phone (about 0.8:1, fov 44) ---------- */
const STALL = { wide: [[.8, 6, 9.6], [.8, 1.4, -2.9]], phone: [[.8, 7.6, 11.4], [.8, 1.3, -2.9]] };
const PIE = { wide: [[-1.2, 4.6, 4.4], [-1.0, 1.3, -3.0]], phone: [[-1.1, 5.8, 5.8], [-1.0, 1.2, -3.0]] };
const MARKET = { wide: [[0, 17, 28], [0, .8, -1.5]], phone: [[0, 24, 31], [0, .4, -1.2]] };
const RACK = { wide: [[0, 7.5, 16], [0, 1.5, -.4]], phone: [[0, 10, 18.5], [0, 1.4, -.3]] };
const MAP = { wide: [[-.4, 13.5, 17.5], [-.4, .3, 3.4]], phone: [[-.3, 17.5, 18], [-.3, .2, 3.6]] };
const MAPST = { wide: [[0, 16, 24], [0, .5, .8]], phone: [[0, 21, 26], [0, .3, 1.2]] };
const MAPR = { wide: [[2.2, 15, 22], [2.2, .5, 2.8]], phone: [[2.6, 19, 22], [2.6, .4, 3.2]] };
const TABLE = { wide: [[-.4, 4.4, 4.2], [-.4, 1.15, -3.0]], phone: [[-.4, 5.4, 5.4], [-.4, 1.1, -3.0]] };
const OVER = { wide: [[0, 21, 29], [0, 0, .2]], phone: [[0, 30, 34], [0, 0, .6]] };

/* ---------- The guided tour ---------- */
export const steps = [
  {
    id: 'meet', title: 'Two of you, one stall',
    lines: [
      { who: 'max', text: 'Hi, I\'m Max! I sell oranges, and this morning there\'s exactly one customer at my stall.' },
      { who: 'libby', text: 'That\'s me. One buyer, one seller, nobody else at the table: a <b>bilateral negotiation</b>. It says nothing yet about who\'s stronger.' }
    ],
    cam: STALL, task: { click: ['max', 'libby'], all: true, say: 'Click Max, then Libby, to see what each of them brings.' },
    async enter(api) {
      api.only(); api.setCase('oranges'); api.pieSet(.75, .5, 0);
      await Promise.all([api.goHome(), api.stalls('shut', 'Shut today')]);
      api.faces('happy'); api.poses('wave', 'idle'); setTimeout(() => api.poses('idle'), 2400);
    },
    done(api) { api.faces('grin', 'happy'); }
  },
  {
    id: 'shut', title: 'Nobody here isn\'t nobody anywhere',
    lines: [
      { who: 'max', text: 'Every other stall is shut. That makes me a monopoly! Name your price, Libby. Actually, I\'ll name it.' },
      { who: 'libby', text: 'A <b>monopolist</b> is the only one who can supply the thing at all. Those stalls are shut today, not gone.' }
    ],
    cam: MARKET, task: { click: RIVALS.map(r => r.key), say: 'Click any of the shuttered stalls.' },
    async enter(api) {
      api.only(); api.setCase('oranges');
      await Promise.all([api.goHome(), api.stalls('shut', 'Shut today')]);
      api.faces('grin', 'think'); api.poses('cheer', 'idle'); setTimeout(() => api.poses('idle'), 1800);
    },
    async done(api) {
      await api.stalls('open', 'Open tomorrow');
      api.faces('surprised', 'happy');
      api.say('libby', 'No competition in the room doesn\'t mean no alternatives.', 2800);
    }
  },
  {
    id: 'pie', title: 'Only two things to argue about',
    lines: [
      { who: 'max', text: 'Fine. So what are we really haggling over? The price of a crate?' },
      { who: 'libby', text: 'Only ever two things: how <b>big</b> the pie is, and how it\'s <b>cut</b>. Every tactic you\'ll learn serves one or the other.' }
    ],
    cam: PIE, task: { click: ['pie'], say: 'Click the pie on the counter.' },
    async enter(api) {
      api.only({ pie: true }); api.setCase('oranges'); api.pieSet(.75, .5, 0);
      await Promise.all([api.goHome(), api.stalls('open', 'Open tomorrow')]);
      api.faces('think', 'happy');
    },
    async done(api) {
      api.faces('surprised', 'happy');
      await api.pieSet(1.25, .5, 1000);
      api.say('max', 'A bigger pie! More for both of us.', 1800);
      await api.pieSet(1.25, .4, 900);
      api.faces('worried', 'grin'); api.chars.max.pose('shrug'); setTimeout(() => api.chars.max.pose('idle'), 1800);
    }
  },
  {
    id: 'sort-machine', title: 'Monopoly, or just bilateral?',
    lines: [
      { who: 'libby', text: 'New deal. My café\'s coffee machine is patented, and Max\'s firm is the only one licensed to service it.' },
      { who: 'max', text: 'Ooh. I like the sound of this one.' },
      { who: 'libby', text: 'Sort it with one question: could anyone else, in principle, do this?' }
    ],
    cam: MARKET,
    task: { choice: { q: 'Servicing Libby\'s patented machine. Which is it?', options: [
      { text: 'Bilateral, but alternatives exist', why: 'Other firms exist, but none is licensed to touch this machine. No one else can legally do it.' },
      { text: 'A true monopoly', ok: true, why: 'Right. No one else can legally do it, so the other stalls stay dark.' }
    ] } },
    async enter(api) {
      api.only(); api.setCase('machine');
      await Promise.all([api.goHome(), api.stalls('shut', 'Could they?')]);
      api.faces('grin', 'think');
    },
    async done(api) {
      await api.stalls('locked', 'Not licensed');
      await api.showLicence(true);
      api.faces('grin', 'worried'); api.poses('cheer', 'idle'); setTimeout(() => api.poses('idle'), 1600);
    }
  },
  {
    id: 'sort-haulage', title: 'Eight years together',
    lines: [
      { who: 'libby', text: 'Next. Max\'s van has delivered to my café for eight years, and now he wants to raise his rates.' },
      { who: 'max', text: 'Eight years! She\'d never switch. That makes me a monopoly too, right?' }
    ],
    cam: MARKET,
    task: { choice: { q: 'Libby\'s delivery firm of eight years. Which is it?', options: [
      { text: 'A true monopoly', why: 'Long and comfortable isn\'t the same as the only one. Other delivery firms exist.' },
      { text: 'Bilateral, but alternatives exist', ok: true, why: 'Right. Other providers exist. Switching is painful, not impossible.' }
    ] } },
    async enter(api) {
      api.only(); api.setCase('haulage');
      await Promise.all([api.goHome(), api.stalls('shut', 'Could they?')]);
      api.faces('grin', 'think');
    },
    async done(api) {
      await api.stalls('open', 'Another delivery firm');
      api.faces('worried', 'happy'); api.chars.max.pose('shrug'); setTimeout(() => api.chars.max.pose('idle'), 1800);
      api.say('max', 'Four of them? Since when?', 2000);
    }
  },
  {
    id: 'sort-rack', title: 'Three more to sort',
    lines: [
      { who: 'libby', text: 'Three more deals on the placards. Only one of them is a true monopoly.' },
      { who: 'max', text: 'The landlord! You can\'t exactly pick up a shop and carry it off.' }
    ],
    cam: RACK,
    task: { pick: { answer: 'case-patent', say: 'Click the placard that\'s a true monopoly.', wrong: {
      'case-software': 'Retraining your staff costs money, but rival products exist.',
      'case-landlord': 'You could move. That\'s the alternative, even if it\'s a hassle.'
    }, why: 'Right. Nobody else can sell the drug while the patent holds. A monopoly for now, until the patent ends.' } },
    async enter(api) {
      api.only({ placards: true }); api.setCase('rack'); api.hourglassOn = false;
      Object.values(api.placards).forEach(p => p.prop.label.set(p.title));
      await Promise.all([api.goHome(), api.stalls('shut', 'Could they?')]);
      api.faces('grin', 'think'); api.chars.max.pose('point'); setTimeout(() => api.chars.max.pose('idle'), 2000);
    },
    async done(api) {
      api.hourglassOn = true;
      api.placards['case-patent'].prop.label.set('Monopoly, for five years');
      api.placards['case-software'].prop.label.set('Bilateral');
      api.placards['case-landlord'].prop.label.set('Bilateral');
      await api.hourglass(true);
      await api.stalls('locked', 'Not for five years');
      api.faces('surprised', 'happy');
      api.say('max', 'A monopoly with a timer on it.', 2000);
    }
  },
  {
    id: 'power-map', title: 'The power map',
    lines: [
      { who: 'libby', text: 'Now plot it. Your power across, theirs going back, high or low on each side. That\'s the <b>power map</b>. Here, you means me, the buyer.' },
      { who: 'max', text: 'Four squares. And each one comes with its own game plan?' }
    ],
    cam: MAP, task: { click: ['quad-ws', 'quad-ss', 'quad-ww', 'quad-sw'], all: true, say: 'Click all four squares of the power map.' },
    async enter(api) {
      api.only({ map: true }); api.setCase('oranges');
      await Promise.all([api.goHome(), api.stalls('shut', 'Shut today')]);
      api.spotQuad(null); api.faces('happy', 'happy');
      await api.showMap(true); api.spotQuad(null);
    },
    done(api) {
      api.faces('grin', 'happy'); api.chars.libby.pose('point'); setTimeout(() => api.chars.libby.pose('idle'), 2400);
      api.say('libby', 'Strong you, weak them: run a competition. Weak you: a cooperative, carefully prepared one-to-one.', 3800);
    }
  },
  {
    id: 'competition', title: 'Back to the oranges',
    lines: [
      { who: 'max', text: 'Back to my oranges. Only my stall\'s open, so I\'m the strong one, right?' },
      { who: 'libby', text: 'Your oranges won\'t keep past Saturday and you\'ve no other buyer. I can try four more stalls tomorrow.' }
    ],
    cam: MAPST,
    task: { pick: { answer: 'quad-sw', say: 'Click the square where the orange deal sits.', wrong: {
      'quad-ws': 'That\'s weak you, strong them. Libby has four other stalls to try, so she isn\'t weak.',
      'quad-ss': 'Max has no plan B, and his fruit won\'t keep. His power is low, not high.',
      'quad-ww': 'Libby isn\'t weak here: four other stalls could sell her oranges.'
    }, why: 'Right. Libby is strong and Max is weak, so she runs a competition: every stall bids for her order.' } },
    async enter(api) {
      api.only({ map: true, pie: false }); api.setCase('oranges');
      await Promise.all([api.goHome(), api.stalls('open', 'Open tomorrow'), api.showMap(true)]);
      api.spotQuad(null); api.faces('grin', 'think');
    },
    async done(api) {
      api.spotQuad('quad-sw');
      await Promise.all([api.toQuad('quad-sw'), api.stalls('open', 'Bidding for Libby')]);
      api.faces('worried', 'grin'); api.chars.libby.pose('cheer'); setTimeout(() => api.chars.libby.pose('idle'), 1500);
      api.say('max', 'Five stalls racing for one order. Gulp.', 2200);
    }
  },
  {
    id: 'weak-you', title: 'The machine only Max can fix',
    lines: [
      { who: 'max', text: 'Remember the patented coffee machine? Only my firm can service it. Ha!' },
      { who: 'libby', text: 'So I\'m weak and Max is strong. A race with one runner isn\'t a race.' }
    ],
    cam: MAPST,
    task: { pick: { answer: 'quad-ws', say: 'Click the square where the coffee-machine deal sits.', wrong: {
      'quad-sw': 'A competition needs other bidders, and no one else is licensed.',
      'quad-ss': 'Libby has no alternative here, so her power is low.',
      'quad-ww': 'Max isn\'t weak: his firm is the only one allowed to do the work.'
    }, why: 'Right. Weak you, strong them: a cooperative, carefully prepared one-to-one. Before every offer, ask how Max will react when he gets it.' } },
    async enter(api) {
      api.only({ map: true, licence: true }); api.setCase('machine');
      await Promise.all([api.showMap(true), api.stalls('locked', 'Not licensed'), api.showLicence(true)]);
      api.spotQuad(null); api.faces('grin', 'worried');
    },
    async done(api) {
      api.spotQuad('quad-ws');
      await api.toQuad('quad-ws');
      api.faces('happy', 'think'); api.chars.libby.pose('think');
      api.think('libby', 'How will he react when he gets this?');
    }
  },
  {
    id: 'tuesday', title: 'The meeting is next Tuesday',
    lines: [
      { who: 'max', text: 'Easy fix, Libby. Run a full tender by Tuesday and make me sweat!' },
      { who: 'libby', text: 'Moving from weak to strong is <b>structural work</b>, done months ahead, like qualifying a second supplier or changing a design.' }
    ],
    cam: MAPR,
    task: { choice: { q: 'You\'re weak and they\'re strong on the power map. Your negotiation is next Tuesday. What\'s realistic?', options: [
      { text: 'Run a full tender to create competition by Tuesday', why: 'Building real competition takes months, not days.' },
      { text: 'Use the power you have as well as possible, and start building more for next time', ok: true, why: 'Right. Short term you make the most of what you\'ve got; long term you change the structure.' },
      { text: 'Accept their price; there\'s nothing you can do', why: 'Weak isn\'t powerless. The rest of this course is the toolkit.' },
      { text: 'Threaten to walk away', why: 'Only if walking away is real. Lesson 7 is about exactly that.' }
    ] } },
    async enter(api) {
      api.only({ map: true, licence: true }); api.setCase('tuesday');
      await Promise.all([api.showMap(true), api.stalls('locked', 'Not licensed'), api.showLicence(true)]);
      api.spotQuad('quad-ws');
      await api.toQuad('quad-ws');
      api.faces('grin', 'think'); api.chars.libby.pose('idle');
    },
    async done(api) {
      await api.newStall(true);
      api.faces('surprised', 'grin'); api.chars.libby.pose('point'); setTimeout(() => api.chars.libby.pose('idle'), 2000);
      api.say('libby', 'Tuesday: I use what I\'ve got. That: power for next time.', 2600);
    }
  },
  {
    id: 'five', title: 'Five things decide the split',
    lines: [
      { who: 'libby', text: 'Back at the stall. This course takes the five things that decide who gets which slice, one lesson each.' },
      { who: 'max', text: 'Five shiny tokens on my counter? I\'ll take the lot!' },
      { who: 'libby', text: '<b>Competition</b>, <b>information</b>, <b>alternatives</b>, <b>timing</b> and <b>focal points</b>. Click each one to see what it decides.' }
    ],
    cam: TABLE, task: { click: TOKENS.map(t => 'tok-' + t), all: true, say: 'Click all five tokens on the counter.' },
    async enter(api) {
      api.only({ map: true, tokens: true, scaffold: true }); api.setCase('five');
      api.spotQuad(null);
      await Promise.all([api.goHome(), api.stalls('open', 'Open'), api.showMap(true), api.newStall(true)]);
      api.faces('grin', 'happy');
      await api.showTokens(true);
    },
    done(api) {
      api.faces('grin', 'happy'); api.poses('cheer', 'idle'); setTimeout(() => api.poses('idle'), 1800);
      api.say('max', 'Five things, five lessons. I\'m collecting all of them.', 2400);
    }
  },
  {
    id: 'end', title: 'What you just learned',
    lines: [
      { who: 'max', text: 'So being the only stall open in the square doesn\'t make me the only stall in the world.' },
      { who: 'libby', text: 'And power is mostly built months before the meeting. Next, we play a game about splitting a pie. See you there!' }
    ],
    summary: [
      '<b>Bilateral</b> means two parties at the table, not one supplier in the world.',
      'Every negotiation is about the <b>size</b> of the pie and how it\'s <b>split</b>.',
      'Structural power is built months ahead. At the table you use what you\'ve got.'
    ],
    cam: OVER, task: null,
    async enter(api) {
      api.only({ map: true, tokens: true, scaffold: true }); api.setCase('five');
      api.spotQuad(null);
      await Promise.all([api.goHome(), api.stalls('open', 'Open'), api.showMap(true), api.newStall(true), api.showTokens(true)]);
      api.faces('happy', 'grin'); api.poses('wave', 'idle');
    }
  }
];
