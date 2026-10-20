/* 3D mini-lesson: The textbook machine. Course: When the Textbook Breaks, lesson "When revenue equivalence breaks".
   A workshop machine built from the revenue equivalence theorem: five condition lights, two quiet-assumption dials and
   four format boxes that all pay out the same coin stack while every light is green. Tenders arrive as crates on a belt;
   each one breaks a condition, a light goes red and the stacks stop matching. Same conditions, examples and questions
   as the text lesson in assets/courses/advanced-auctions.js. */
import { stage, scenery, prop, cast, V, THREE, box, animate } from './kit.js';
import { pawn } from './engine.js';

export const meta = {
  id: 'textbook-breaks',
  title: 'The textbook machine',
  course: 'advanced-auctions', lesson: 'revenue-equivalence-breaks',
  minutes: 7
};

/* ---------- Layout ---------- */
const HOME = { max: [-5.6, .8], libby: [4.6, .8] };
const LIGHT_X = [-3.6, -1.8, 0, 1.8, 3.6], LIGHT_Y = 3.9, LIGHT_Z = -5.2;
const FMT_X = [-4.2, -1.4, 1.4, 4.2], FMT_Z = -3.4;
const BELT_Y = 1.13, BELT_Z = -5.5, CRATE_START = -11.2, CRATE_STOP = -8.0;
const PILE = { 'crate-favourite': [9.0, 1.8, .22], 'crate-mustwin': [10.2, 1.8, .22], 'crate-ring': [9.0, 3.0, .22], 'crate-split': [10.2, 3.0, .22], 'crate-six': [9.6, 2.4, 1.24] };
const GREEN = '#58B26F', RED = '#E0574B';

const LIGHTS = [
  { key: 'light-similar', short: 'Similar', name: 'Similar bidders, more than three' },
  { key: 'light-common', short: 'Private costs', name: 'No strong common value' },
  { key: 'light-vital', short: 'Not vital', name: 'Not strategically vital' },
  { key: 'light-lot', short: 'One lot', name: 'One lot' },
  { key: 'light-ring', short: 'No collusion', name: 'No collusion risk' }
];
const FORMATS = [
  { key: 'fmt-english', name: 'English', title: 'English auction', how: 'The price falls in the open until one supplier is left' },
  { key: 'fmt-dutch', name: 'Dutch', title: 'Dutch auction', how: 'A price clock moves until the first supplier accepts' },
  { key: 'fmt-first', name: 'First-price', title: 'Sealed first-price', how: 'One sealed bid each; the lowest wins and is paid its bid' },
  { key: 'fmt-second', name: 'Second-price', title: 'Sealed second-price', how: "One sealed bid each; the lowest wins and is paid the runner-up's bid" }
];
const CRATES = [
  { key: 'crate-favourite', tag: 'Tender 1', title: 'Tender: the giant incumbent', inside: 'One incumbent has twice the capacity and half the cost of anyone else', breaks: 'Similar bidders', lever: 'Handicap the favourite or set a ceiling (lessons 3 and 4)' },
  { key: 'crate-mustwin', tag: 'Tender 2', title: 'Tender: the plant that must win', inside: "A supplier's plant closes if it loses this contract", breaks: 'Not strategically vital', lever: 'Prefer sealed first-price or Dutch, and check low bids against should-cost (lesson 2)' },
  { key: 'crate-ring', tag: 'Tender 3', title: 'Tender: the same three faces', inside: 'The same three suppliers have met in every monthly auction for four years', breaks: 'No collusion risk', lever: 'Sealed first-price, fixed bid steps, fewer lots than bidders, a firm reserve (lesson 5)' },
  { key: 'crate-split', tag: 'Tender 4', title: 'Tender: the 70/30 split', inside: '70% of the volume from one supplier and 30% from another', breaks: 'One lot', lever: 'Price the second source before you offer it (lessons 5 and 7)', split: true },
  { key: 'crate-six', tag: 'Tender 5', title: 'Tender: the clean one', inside: 'Six similar suppliers, private costs, one lot, no repeat play, nothing strategic at stake', breaks: 'Nothing', lever: 'Bring in more bidders' }
];
const CRATE = Object.fromEntries(CRATES.map(c => [c.key, c]));

/* What each format box pays out in each scene: coins (price the buyer pays on average) and the label on the stack */
const OUT = {
  empty: { n: [0, 0, 0, 0], l: ['', '', '', ''] },
  tie: { n: [6, 6, 6, 6], l: ['Same', 'Same', 'Same', 'Same'] },
  favourite: { n: [6, 6, 6, 6], l: ['?', '?', '?', '?'], wobble: true },
  mustwin: { n: [6, 5, 5, 6], l: ['Same', 'Lower', 'Lower', 'Same'] },
  ring: { n: [9, 7, 7, 9], l: ['Highest', 'Higher', 'Higher', 'Highest'] },
  split: { n: [8, 7, 7, 8], l: ['Higher', 'Higher', 'Higher', 'Higher'] },
  levers: { n: [6, 6, 6, 6], l: ['?', '?', '?', '?'], wobble: true },
  dials: { n: [6, 6, 6, 6], l: ['?', '?', '?', '?'], wobble: true },
  more: { n: [5, 5, 5, 5], l: ['Lower', 'Lower', 'Lower', 'Lower'] }
};

export function build(w) {
  const { mat, label, scene } = w;
  const api = { scene: 'empty', red: new Set(), diagnosed: new Set(), dialsBroken: false, bidders: 0, busy: 0, belt: 0 };

  /* ---------- Plinth, workshop floor, back wall ---------- */
  stage(w, { width: 26, depth: 18 });
  const shop = new THREE.Group();
  const floorM = mat('floor'), wallM = mat('surface'), trimM = mat('muted'), woodM = mat('wood'), darkM = mat('mask'), goldM = mat('gold'), paperM = mat('paper');
  shop.add(box(25, .04, 17.2, floorM, 0, 0, .1, .3));
  for (let k = 0; k < 12; k++) shop.add(box(.5, .022, .14, goldM, -5.4 + k * 1, .04, -1.05)); // safety line in front of the payout trays
  shop.add(box(25, 4.6, .3, wallM, 0, 0, -8.65));
  shop.add(box(25, .3, .34, trimM, 0, 0, -8.6));
  // pegboard with tools
  shop.add(box(4.4, 2.4, .08, woodM, -8.6, 1.5, -8.45, .08));
  for (let r = 0; r < 4; r++) for (let c = 0; c < 8; c++) shop.add(box(.07, .07, .02, darkM, -10.35 + c * .5, 1.75 + r * .55, -8.4));
  const wrenchH = box(.14, 1.1, .05, trimM, -9.9, 2.1, -8.36); wrenchH.rotation.z = .25; shop.add(wrenchH);
  const wrenchT = new THREE.Mesh(new THREE.TorusGeometry(.17, .06, 8, 20, Math.PI * 1.5), trimM); wrenchT.position.set(-10.05, 3.35, -8.34); shop.add(wrenchT);
  shop.add(box(.12, 1.2, .06, woodM, -8.6, 1.95, -8.36), box(.6, .26, .2, darkM, -8.6, 3.1, -8.32));         // hammer
  shop.add(box(.5, .9, .1, trimM, -7.3, 2.2, -8.36, .06), box(.18, .5, .1, darkM, -7.3, 1.75, -8.36));        // spirit level and handle
  // shelf with tins on the right of the wall
  shop.add(box(3.6, .12, .7, woodM, 9.6, 1.9, -8.15));
  for (const x of [8.2, 11]) shop.add(box(.1, .5, .6, trimM, x, 1.42, -8.2));
  shop.add(box(.7, .7, .55, woodM, 8.4, 2.02, -8.15, .05), box(.55, .5, .55, woodM, 9.2, 2.02, -8.15, .05));
  for (const x of [10.1, 10.65]) { const tin = new THREE.Mesh(new THREE.CylinderGeometry(.2, .2, .55, 18), trimM); tin.position.set(x, 2.3, -8.1); shop.add(tin); }
  // wall clock
  const clockFace = new THREE.Mesh(new THREE.CylinderGeometry(.6, .6, .08, 36), paperM); clockFace.rotation.x = Math.PI / 2; clockFace.position.set(9.6, 3.55, -8.42); shop.add(clockFace);
  const clockRim = new THREE.Mesh(new THREE.TorusGeometry(.62, .06, 8, 36), trimM); clockRim.position.set(9.6, 3.55, -8.38); shop.add(clockRim);
  const hands = [box(.05, .45, .02, darkM, 0, 0, 0), box(.06, .3, .02, darkM, 0, 0, 0)].map(h => { const p = new THREE.Group(); p.add(h); p.position.set(9.6, 3.55, -8.35); shop.add(p); return p; });
  // spare crates in the back corner
  shop.add(box(1.1, 1.1, 1.1, woodM, -11.2, 0, -7.4, .06), box(1.1, 1.1, 1.1, woodM, -10.3, 0, -7.6, .06), box(1, 1, 1, woodM, -10.8, 1.1, -7.5, .06));
  scenery(w, shop);

  /* ---------- Intake belt on the left, feeding the machine's side door ---------- */
  const belt = new THREE.Group();
  belt.add(box(7.2, .22, 1.5, trimM, -8.1, .88, BELT_Z, .06));
  belt.add(box(7.0, .04, 1.2, darkM, -8.1, 1.09, BELT_Z));
  for (const x of [-11.4, -8.1, -4.9]) for (const z of [-.6, .6]) belt.add(box(.14, .88, .14, trimM, x, 0, BELT_Z + z));
  for (let k = 0; k < 15; k++) { const roller = new THREE.Mesh(new THREE.CylinderGeometry(.08, .08, 1.56, 10), woodM); roller.rotation.x = Math.PI / 2; roller.position.set(-11.5 + k * .47, 1.0, BELT_Z); belt.add(roller); }
  const chevrons = [];
  for (let k = 0; k < 7; k++) { const c = box(.12, .015, .9, goldM, 0, 1.11, BELT_Z); c.position.x = -11.4 + k; belt.add(c); chevrons.push(c); }
  scenery(w, belt);

  /* ---------- The machine ---------- */
  const machine = new THREE.Group();
  const bodyM = mat('surface'), bodyTrim = mat('muted'), windowM = mat('mask'), plateM = mat('paper'), rivetM = mat('gold'), gearM = mat('wood'), gearM2 = mat('gold');
  machine.add(box(9.4, .3, 2.9, bodyTrim, 0, 0, -5.9, .15));
  machine.add(box(9, 3.6, 2.6, bodyM, 0, .3, -5.9, .25));
  machine.add(box(9.1, .18, 2.7, bodyTrim, 0, 3.75, -5.9, .12));
  machine.add(box(3.2, 1.1, .06, windowM, -2.6, 2.3, -4.58));
  machine.add(box(3.4, .9, .06, plateM, 1.7, 2.4, -4.58));
  for (let k = 0; k < 3; k++) machine.add(box(k ? 2.2 : 2.8, .04, .02, bodyTrim, 1.7 - (k ? .3 : 0), 2.95 - k * .22, -4.54));
  for (const [x, y] of [[-4.2, .7], [4.2, .7], [-4.2, 3.4], [4.2, 3.4]]) { const r = new THREE.Mesh(new THREE.SphereGeometry(.09, 10, 8), rivetM); r.position.set(x, y, -4.6); machine.add(r); }
  machine.add(box(.06, 1.3, 1.3, windowM, -4.53, 1.15, BELT_Z));                                   // side door for crates
  const gear = (r, m) => {
    const g = new THREE.Group();
    const disc = new THREE.Mesh(new THREE.CylinderGeometry(r, r, .1, 24), m); disc.rotation.x = Math.PI / 2; g.add(disc);
    for (let k = 0; k < 10; k++) { const t = box(.12, .16, .1, m, 0, 0, 0); t.position.set(Math.cos(k * Math.PI / 5) * (r + .05), Math.sin(k * Math.PI / 5) * (r + .05) - .08, 0); t.rotation.z = k * Math.PI / 5 + Math.PI / 2; g.add(t); }
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(.08, .08, .14, 12), windowM); hub.rotation.x = Math.PI / 2; g.add(hub);
    return g;
  };
  const gears = [gear(.36, gearM), gear(.28, gearM2), gear(.22, gearM)];
  [[-3.4, 2.85], [-2.55, 2.75], [-1.82, 2.95]].forEach(([x, y], k) => { gears[k].position.set(x, y, -4.5); machine.add(gears[k]); });
  // chimney with puffs
  const chim = new THREE.Mesh(new THREE.CylinderGeometry(.28, .32, 1.3, 18), bodyTrim); chim.position.set(3.4, 4.55, -6.7); machine.add(chim);
  const puffM = mat('paper', { transparent: true, opacity: .7 });
  const puffs = [0, 1, 2, 3].map(() => { const p = new THREE.Mesh(new THREE.SphereGeometry(.26, 14, 10), puffM); p.userData.noGlow = true; machine.add(p); return p; });
  // manifold pipe out to the four format boxes
  const pipeM = mat('muted');
  const manifold = new THREE.Mesh(new THREE.CylinderGeometry(.16, .16, 8.8, 16), pipeM); manifold.rotation.z = Math.PI / 2; manifold.position.set(0, 1.85, -3.95); machine.add(manifold);
  for (const x of [-2.8, 2.8]) { const c = new THREE.Mesh(new THREE.CylinderGeometry(.14, .14, .7, 12), pipeM); c.rotation.x = Math.PI / 2; c.position.set(x, 1.85, -4.3); machine.add(c); }
  for (const x of FMT_X) { const d = new THREE.Mesh(new THREE.CylinderGeometry(.13, .13, .5, 12), pipeM); d.position.set(x, 1.6, -3.95); machine.add(d); }
  prop(w, 'machine', machine, null);
  label('machine', 'Revenue equivalence', V(1.7, 3.1, -4.4), 'sign');

  // the lever Max pulls, beside the machine
  const lever = new THREE.Group();
  lever.add(box(.6, .7, .6, trimM, 0, 0, 0, .08));
  const arm = new THREE.Group(); arm.position.set(0, .7, 0);
  const stick = new THREE.Mesh(new THREE.CylinderGeometry(.05, .05, 1.1, 10), trimM); stick.position.y = .55; arm.add(stick);
  const knob = new THREE.Mesh(new THREE.SphereGeometry(.15, 14, 10), mat('bad')); knob.position.y = 1.12; arm.add(knob);
  arm.rotation.x = -.5; lever.add(arm);
  lever.position.set(-5.9, 0, -4.0);
  scenery(w, lever);

  /* ---------- The five condition lights on top ---------- */
  api.lights = {};
  LIGHTS.forEach((L, i) => {
    const g = new THREE.Group();
    const socketM = mat('muted'), cageM = mat('wood');
    g.add(box(.7, .16, .7, socketM, 0, 0, 0, .08));
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(.18, .24, .3, 16), socketM); stem.position.y = .3; g.add(stem);
    const bulbM = new THREE.MeshBasicMaterial({ color: GREEN });
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(.28, 20, 14), bulbM); bulb.position.y = .66; g.add(bulb);
    const haloM = new THREE.MeshBasicMaterial({ color: GREEN, transparent: true, opacity: .22, depthWrite: false });
    const halo = new THREE.Mesh(new THREE.SphereGeometry(.44, 20, 14), haloM); halo.position.y = .66; halo.userData.noPick = true; g.add(halo);
    const cage = new THREE.Mesh(new THREE.TorusGeometry(.31, .025, 6, 24), cageM); cage.rotation.x = Math.PI / 2; cage.position.y = .66; g.add(cage);
    const cage2 = new THREE.Mesh(new THREE.TorusGeometry(.31, .025, 6, 24), cageM); cage2.position.y = .66; g.add(cage2);
    g.position.set(LIGHT_X[i], LIGHT_Y, LIGHT_Z);
    prop(w, L.key, g, L.short, i % 2 ? 1.75 : 1.3);
    api.lights[L.key] = { bulb: bulbM, halo: haloM, g };
  });
  api.setLight = (key, ok) => { const L = api.lights[key]; L.bulb.color.set(ok ? GREEN : RED); L.halo.color.set(ok ? GREEN : RED); ok ? api.red.delete(key) : api.red.add(key); };
  api.setLights = red => LIGHTS.forEach(L => api.setLight(L.key, !red.includes(L.key)));
  api.flicker = async key => {
    for (let k = 0; k < 3; k++) {
      api.lights[key].bulb.color.set(RED); api.lights[key].halo.color.set(RED); await animate(140, () => {});
      api.lights[key].bulb.color.set(GREEN); api.lights[key].halo.color.set(GREEN); await animate(120, () => {});
    }
    api.setLight(key, false);
    const g = api.lights[key].g;
    await animate(380, k => { const s = 1 + Math.sin(k * Math.PI) * .35; g.scale.set(s, s, s); });
  };

  /* ---------- Two quiet-assumption dials on a gauge board to the right ---------- */
  const board = new THREE.Group();
  const boardM = mat('surface'), boardTrim = mat('muted');
  for (const x of [-1.5, 1.5]) board.add(box(.16, 1.6, .16, boardTrim, x, 0, 0));
  board.add(box(3.4, 1.9, .25, boardM, 0, 1.6, 0, .12));
  board.add(box(3.5, .12, .35, boardTrim, 0, 3.5, 0));
  board.position.set(6.7, 0, -5.9);
  scenery(w, board);
  api.dials = {};
  [['dial-rivals', 'Rivals known', 5.9], ['dial-after', 'Auction ends it', 7.5]].forEach(([key, text, x]) => {
    const g = new THREE.Group();
    const rimM = mat('muted'), faceM = mat('paper');
    const rim = new THREE.Mesh(new THREE.CylinderGeometry(.62, .62, .12, 40), rimM); rim.rotation.x = Math.PI / 2; g.add(rim);
    const face = new THREE.Mesh(new THREE.CylinderGeometry(.54, .54, .13, 40), faceM); face.rotation.x = Math.PI / 2; face.position.z = .01; g.add(face);
    const ok = new THREE.Mesh(new THREE.RingGeometry(.3, .46, 24, 1, Math.PI / 2, Math.PI * .42), new THREE.MeshBasicMaterial({ color: GREEN })); ok.position.z = .085; g.add(ok);
    const bad = new THREE.Mesh(new THREE.RingGeometry(.3, .46, 24, 1, Math.PI * .08, Math.PI * .42), new THREE.MeshBasicMaterial({ color: RED })); bad.position.z = .085; g.add(bad);
    const needle = new THREE.Group(); needle.position.z = .1;
    needle.add(box(.05, .44, .03, mat('mask'), 0, 0, 0));
    const hub = new THREE.Mesh(new THREE.SphereGeometry(.07, 10, 8), mat('mask')); needle.add(hub);
    g.add(needle); needle.rotation.z = .75;
    g.position.set(x, 2.55, -5.72);
    const p = prop(w, key, g, text, .95);
    api.dials[key] = { p, needle };
  });
  api.showDials = async (on, grow = false) => {
    board.visible = on; Object.values(api.dials).forEach(d => d.p.show(on));
    if (on && grow) {
      const parts = [board, ...Object.values(api.dials).map(d => d.p.obj)];
      parts.forEach(o => o.scale.set(1, .001, 1));
      await animate(700, k => parts.forEach(o => o.scale.set(1, Math.max(.001, k), 1)));
      parts.forEach(o => o.scale.set(1, 1, 1));
    }
  };
  api.setDials = async (broken, ms = 0) => {
    api.dialsBroken = broken;
    const to = broken ? -.75 : .75;
    const ns = Object.values(api.dials).map(d => d.needle), from = ns.map(n => n.rotation.z);
    if (!ms) { ns.forEach(n => n.rotation.z = to); return; }
    await animate(ms, k => ns.forEach((n, i) => { n.rotation.z = from[i] + (to - from[i]) * k + Math.sin(k * Math.PI * 3) * .25 * (1 - k); }));
  };

  /* ---------- Four format boxes, each with a tray of coins in front ---------- */
  const coinGeo = new THREE.CylinderGeometry(.34, .34, .13, 28);
  api.formats = FORMATS.map((F, i) => {
    const g = new THREE.Group();
    const bodyF = mat('raised'), lidF = mat('wood'), slotF = mat('mask'), trayF = mat('wood'), coinF = mat('gold'), iconF = mat('paper'), iconD = mat('muted');
    g.add(box(2.1, 1.4, 1.5, bodyF, 0, 0, 0, .12));
    g.add(box(2.2, .1, 1.6, lidF, 0, 1.4, 0, .08));
    g.add(box(1.0, .12, .04, slotF, 0, .95, .76));
    const chute = box(.8, .05, .7, iconD, 0, 0, 0); chute.position.set(0, .55, 1.0); chute.rotation.x = .45; g.add(chute);
    g.add(box(1.3, .1, 1.0, trayF, 0, 0, 1.45, .08));
    // a small icon on the lid so each box reads differently
    if (i === 0) { // gavel
      const h = new THREE.Mesh(new THREE.CylinderGeometry(.05, .05, .9, 10), lidF); h.rotation.z = Math.PI / 2 - .3; h.position.set(.1, 1.58, .1); g.add(h);
      const hd = new THREE.Mesh(new THREE.CylinderGeometry(.13, .13, .42, 16), iconD); hd.rotation.x = Math.PI / 2; hd.position.set(-.33, 1.68, .1); g.add(hd);
    } else if (i === 1) { // price clock
      const c = new THREE.Mesh(new THREE.CylinderGeometry(.4, .4, .1, 28), iconF); c.position.set(0, 1.55, 0); g.add(c);
      g.add(box(.05, .02, .32, slotF, .06, 1.6, -.1), box(.22, .02, .05, slotF, .1, 1.6, 0));
    } else { // one or two sealed envelopes
      for (let e = 0; e < i - 1; e++) {
        const env = box(.9, .05, .6, iconF, -.15 + e * .3, 1.5 + e * .06, -.05 + e * .12);
        env.rotation.y = .2 - e * .35; g.add(env);
        const flap = box(.4, .02, .4, iconD, 0, 0, 0); flap.rotation.y = Math.PI / 4; flap.position.set(-.15 + e * .3, 1.56 + e * .06, -.2 + e * .12); g.add(flap);
      }
    }
    const coins = [];
    for (let k = 0; k < 10; k++) { const c = new THREE.Mesh(coinGeo, coinF); c.position.set((k % 2) * .03, .17 + k * .16, 1.45); c.visible = false; g.add(c); coins.push(c); }
    g.position.set(FMT_X[i], 0, FMT_Z);
    const p = prop(w, F.key, g, F.name, 0);
    p.label.obj.position.set(0, .08, 2.2);   // nameplate on the floor in front of the tray
    const lbl = label(F.key, '', V(0, 1, 1.45), 'stack'); g.add(lbl.obj); lbl.el.hidden = true;
    return { g, p, coins, lbl, n: 0, base: 0 };
  });
  const showCoins = (f, n) => {
    n = Math.max(0, Math.min(10, Math.round(n)));
    f.coins.forEach((c, k) => { c.visible = k < n; });
    f.n = n;
  };
  api.setStacks = async (name, ms = 900) => {
    api.scene = name;
    const O = OUT[name];
    const from = api.formats.map(f => f.n);
    api.wobble = false;
    api.formats.forEach((f, i) => {
      f.base = O.n[i];
      f.lbl.set(O.l[i]); f.lbl.el.hidden = !O.l[i];
      f.lbl.obj.position.y = .4 + (O.wobble ? 8 : O.n[i]) * .16;
    });
    if (ms) await animate(ms, k => api.formats.forEach((f, i) => showCoins(f, from[i] + (O.n[i] - from[i]) * k)));
    api.formats.forEach((f, i) => showCoins(f, O.n[i]));
    api.wobble = !!O.wobble;
  };

  /* ---------- The textbook on a lectern ---------- */
  const book = new THREE.Group();
  const standM = mat('wood'), pageM = mat('paper'), coverM = mat('accent'), lineM = mat('muted');
  book.add(box(.9, .1, .9, standM, 0, 0, 0, .06));
  const post = new THREE.Mesh(new THREE.CylinderGeometry(.08, .1, 1.1, 12), standM); post.position.y = .65; book.add(post);
  const desk = new THREE.Group(); desk.position.set(0, 1.25, 0); desk.rotation.x = .45;
  desk.add(box(1.5, .06, 1.0, standM, 0, 0, 0));
  desk.add(box(1.46, .05, .96, coverM, 0, .06, 0));
  for (const s of [-1, 1]) {
    const page = box(.68, .05, .9, pageM, s * .36, .1, 0); page.rotation.z = s * -.08; desk.add(page);
    for (let k = 0; k < 5; k++) desk.add(box(k ? .48 : .3, .01, .04, lineM, s * .37 - (k ? 0 : .08), .16, -.3 + k * .15));
  }
  book.add(desk);
  book.position.set(-7.6, 0, -1.0);
  prop(w, 'textbook', book, 'Textbook', 2.3);

  /* ---------- Tender crates ---------- */
  api.crates = {};
  CRATES.forEach(C => {
    const g = new THREE.Group(), body = new THREE.Group();
    const wd = mat('wood'), sl = mat('muted'), tg = mat('paper'), stamp = mat('bad');
    let small = null;
    if (C.split) {
      body.add(box(.68, 1, 1, wd, -.16, 0, 0, .05));
      small = new THREE.Group(); small.add(box(.3, 1, 1, wd, 0, 0, 0, .05)); small.position.x = .35; body.add(small);
    } else body.add(box(1, 1, 1, wd, 0, 0, 0, .06));
    for (const y of [.2, .8]) body.add(box(1.02, .08, 1.02, sl, 0, y, 0));
    body.add(box(.5, .34, .02, tg, 0, .33, .51));
    const st = box(.42, .08, .02, stamp, 0, .45, .53); st.visible = false; body.add(st);
    g.add(body); g.visible = false;
    const p = prop(w, C.key, g, C.tag, 1.55);
    p.show(false);
    api.crates[C.key] = { g, p, stamp: st, small };
  });
  api.placeCrates = (pile, current) => {
    api.diagnosed = new Set(pile);
    for (const C of CRATES) {
      const c = api.crates[C.key];
      c.g.scale.set(1, 1, 1);
      if (c.small) c.small.position.x = .35;
      if (pile.includes(C.key)) {
        const [x, z, y] = PILE[C.key];
        c.g.position.set(x, y, z); c.g.rotation.y = (x * 7 % 3 - 1) * .08; c.stamp.visible = C.key !== 'crate-six'; c.p.show(true);
      } else if (C.key === current) {
        c.g.position.set(CRATE_START, BELT_Y, BELT_Z); c.g.rotation.y = 0; c.stamp.visible = false; c.p.show(true);
      } else c.p.show(false);
    }
  };
  api.rollIn = async key => {
    const c = api.crates[key]; c.g.position.x = CRATE_START;
    api.belt = 1;
    await animate(1400, k => { c.g.position.x = CRATE_START + (CRATE_STOP - CRATE_START) * k; });
    api.belt = 0;
  };
  // Pull the lever, feed the crate in, shake the machine
  api.feed = async key => {
    const c = api.crates[key];
    await animate(350, k => { arm.rotation.x = -.5 + k * 1; });
    api.belt = 1; api.busy = 1;
    await animate(1000, k => { c.g.position.x = CRATE_STOP + (-4.9 - CRATE_STOP) * k; const s = k < .7 ? 1 : 1 - (k - .7) / .3; c.g.scale.set(Math.max(.001, s), Math.max(.001, s), Math.max(.001, s)); });
    c.p.show(false); api.belt = 0;
    await animate(900, k => { machine.position.x = Math.sin(k * 46) * .07 * (1 - k); machine.position.y = Math.abs(Math.sin(k * 30)) * .04 * (1 - k); });
    machine.position.set(0, 0, 0);
    animate(400, k => { arm.rotation.x = .5 - k * 1; });
    api.busy = 0;
  };

  /* ---------- Bidders waiting for the clean tender ---------- */
  const crowd = new THREE.Group();
  const crowdM = mat('muted'), newM = mat('accent');
  api.pawns = [];
  for (let k = 0; k < 8; k++) {
    const pw = pawn(k < 6 ? crowdM : newM); pw.scale.setScalar(.55);
    pw.position.set(k < 6 ? -2.5 + k : (k === 6 ? -3.5 : 3.5), 0, 2.4);
    crowd.add(pw); api.pawns.push(pw);
  }
  const crowdP = prop(w, 'bidders', crowd, 'Suppliers', 1.4);
  crowdP.label.obj.position.set(0, 1.4, 2.4);
  api.setBidders = n => {
    api.bidders = n; crowdP.show(n > 0);
    api.pawns.forEach((pw, k) => { pw.visible = k < n; if (k >= 6) pw.position.set(k === 6 ? -3.5 : 3.5, 0, 2.4); });
  };
  api.twoMore = async () => {
    api.bidders = 8;
    for (const [k, x] of [[6, -3.5], [7, 3.5]]) {
      const pw = api.pawns[k]; pw.visible = true;
      const from = V(k === 6 ? -11 : 11, 0, 2.4);
      await animate(800, t => { pw.position.set(from.x + (x - from.x) * t, Math.sin(t * Math.PI) * 1.6, 2.4); });
      pw.position.set(x, 0, 2.4);
    }
  };

  /* ---------- Max and Libby ---------- */
  const people = cast(w, { max: HOME.max, libby: HOME.libby });
  Object.assign(api, people);
  api.pull = async () => { await people.walk('max', [-6.0, -3.0], 900); people.chars.max.pose('point'); };

  /* ---------- Things that tick: belt, gears, puffs, clock, wobbling stacks ---------- */
  w.onTick((t, dt) => {
    if (api.belt) chevrons.forEach(c => { c.position.x += dt * 2.4; if (c.position.x > -4.8) c.position.x -= 6.8; });
    const spin = dt * (api.busy ? 6 : .6);
    gears[0].rotation.z += spin; gears[1].rotation.z -= spin * 1.3; gears[2].rotation.z += spin * 1.6;
    puffs.forEach((p, k) => {
      const ph = ((t * (api.busy ? .9 : .35)) + k / 4) % 1;
      p.position.set(3.4 + Math.sin(ph * 5 + k) * .2, 5.3 + ph * 2.2, -6.7);
      const s = .5 + ph * 1.1; p.scale.set(s, s, s);
    });
    puffM.opacity = .55;
    hands[0].rotation.z = -t * .5; hands[1].rotation.z = -t * .04;
    if (api.wobble) api.formats.forEach((f, i) => showCoins(f, f.base + Math.sin(t * 2.6 + i * 1.9) * 2.4));
  });

  /* ---------- One call per step to put the whole scene in a known state ---------- */
  api.setup = async ({ out = 'tie', red = [], pile = [], crate = null, dials = false, bidders = 0 } = {}) => {
    api.setLights(red);
    api.placeCrates(pile, crate);
    await api.showDials(dials);
    await api.setDials(false);
    api.setBidders(bidders);
    machine.position.set(0, 0, 0); arm.rotation.x = -.5;
    api.clearThoughts();
    await api.setStacks(out, 0);
  };

  return api;
}

/* ---------- State cards ---------- */
const FMT_STORY = {
  empty: () => ({ head: 'Waiting', text: 'Nothing has come through the machine yet.' }),
  tie: () => ({ head: 'Same as the others', text: 'When bidders are similar, independent, risk-neutral and know their own values, every standard format lands on the same average price. This box is no better or worse than its neighbours.' }),
  favourite: i => ({ head: 'Off the tie', text: i === 0 || i === 3
    ? 'With a strong favourite, English and second-price still match each other, but no longer match the pay-your-bid formats. Which pair comes out cheaper depends on how strong the favourite is.'
    : 'With a strong favourite, Dutch and first-price still match each other, but no longer match English and second-price. Which pair comes out cheaper depends on how strong the favourite is.' }),
  mustwin: i => i === 0 || i === 3
    ? { head: 'Unchanged', text: "Here bidding your true cost is still the best move whatever your attitude to risk, because your own bid never sets the price you're paid. Fear of losing changes nothing." }
    : { head: 'Lower', text: 'Paid its own bid, a supplier that hates losing gives up margin to win more often. It buys insurance by shading less, so the average price falls. Check any very low bid against your should-cost.' },
  ring: i => [
    { head: 'Highest', text: 'Open bidding lets the ring signal and watch each other in real time, so it holds together best here.' },
    { head: 'Higher', text: 'The first acceptance ends it, so there is less room to signal than in English. But the same three still meet every month.' },
    { head: 'Higher', text: "A ring can't watch in real time, and a cheat can undercut by a whisker. That makes the ring harder to hold, so this is the safest of the four." },
    { head: 'Highest', text: "The ring's chosen winner can bid high safely, because the others agree not to undercut it." }][i],
  split: i => ({ head: 'Higher', text: i === 0 || i === 1
    ? 'Two shares instead of one prize. In an open format bidders can see each other and share out the volume, and a second source carries a premium on top.'
    : 'A second source costs a premium in every format. Lessons 5 and 7 show what that costs and how bidders exploit it.' }),
  levers: () => ({ head: 'Off the tie', text: 'Four tenders, four red lights. With any one of them this box stops tying with its neighbours, so the format now matters.' }),
  dials: i => ({ head: 'Off the tie', text: i === 0
    ? "If a supplier is really alone, an English auction ends the moment it opens, and the supplier knows it."
    : i === 2 ? "A supplier that can't see the field must price against the chance of a rival. With one or two suppliers, that helps you."
    : 'Bidders now bid against what they believe about the field, and with the tender as round one, against what you will learn about them.' }),
  more: () => ({ head: 'Lower', text: 'Two more similar suppliers push the price down in every format alike. The formats still tie; competition did the work.' })
};
const PRICE_WORD = { Same: 'Same as the other three', Lower: 'Lower than the tie', Higher: 'Higher than the tie', Highest: 'Highest of the four', '?': "Won't settle" };
const LIGHT_CARD = {
  'light-similar': { means: 'No strong favourite, and a real field', breaks: 'One incumbent with twice the capacity and half the cost', lever: 'Handicap the favourite or set a ceiling (lessons 3 and 4)', text: 'Two very different bidders and the formats stop tying. So does a field of only two or three.' },
  'light-common': { means: "Each supplier's cost is its own", breaks: 'A big uncertain cost that every bidder shares', lever: "Course 8: watch for the winner's curse", text: 'None of the tenders today breaks this one. It is about uncertain costs everyone shares, which Course 8 covered.' },
  'light-vital': { means: "Losing wouldn't hurt any supplier badly", breaks: 'A plant that closes if it loses, or a sales target to hit', lever: 'Prefer sealed first-price or Dutch, and check low bids against should-cost (lesson 2)', text: 'Fear of losing changes how a supplier bids, but only in the formats where it is paid its own bid.' },
  'light-lot': { means: 'One contract, one winner', breaks: 'A 70/30 split, or many units at once', lever: 'Price the second source before you offer it (lessons 5 and 7)', text: 'Shares and multiple units break it, even when the suppliers themselves are perfectly similar.' },
  'light-ring': { means: "Bidders can't co-ordinate", breaks: 'The same few suppliers meeting again and again, or a shared parent company', lever: 'Sealed first-price, fixed bid steps, fewer lots than bidders, a firm reserve (lesson 5)', text: 'A small field that meets often can hold a ring together without a single phone call.' }
};

export function card(key, ctx) {
  const api = ctx.api;
  const fi = FORMATS.findIndex(F => F.key === key);
  if (fi >= 0) {
    const F = FORMATS[fi], S = (FMT_STORY[api.scene] || FMT_STORY.tie)(fi), lbl = OUT[api.scene].l[fi];
    return {
      kicker: 'Format box ' + (fi + 1) + ' of 4', title: F.title,
      rows: [['How it works', F.how], ['Price you pay now', PRICE_WORD[lbl] || 'Nothing out yet'], ['Coins in the tray', String(OUT[api.scene].wobble ? 'Going up and down' : OUT[api.scene].n[fi])]],
      text: S.text
    };
  }
  const li = LIGHTS.findIndex(L => L.key === key);
  if (li >= 0) {
    const L = LIGHTS[li], C = LIGHT_CARD[key], red = api.red.has(key);
    return {
      kicker: 'Condition light ' + (li + 1) + ' of 5', title: L.name,
      rows: [['Status', red ? 'Red: broken' : 'Green: holds'], ['Means', C.means], ['Broken by', C.breaks], ['Lever if broken', C.lever]],
      text: C.text
    };
  }
  if (CRATE[key]) {
    const C = CRATE[key], done = api.diagnosed.has(key);
    return {
      kicker: done ? 'Diagnosed tender' : 'Tender on the belt', title: C.title,
      rows: [['Inside', C.inside], ['Breaks', done ? C.breaks : 'Your call'], ...(done ? [['Lever', C.lever]] : [])],
      text: done
        ? (key === 'crate-six' ? 'Nothing broken, so the formats tie. The lever that works is more bidders.' : 'A red light is a clue, not a dead end. It tells you which design lever to reach for.')
        : 'Read what is inside before you trust the textbook with it.'
    };
  }
  if (key === 'dial-rivals') return {
    kicker: 'Quiet assumption 1 of 2', title: 'Bidders know how many rivals they face',
    rows: [['Status', api.dialsBroken ? 'Broken' : 'Set'], ['Real life', "Often they don't know"], ['Lever', "With one or two suppliers, sealed first-price and don't announce the field (lesson 6)"]],
    text: 'In a sealed tender a supplier bids against what it thinks its rivals are. That belief becomes something you can design.'
  };
  if (key === 'dial-after') return {
    kicker: 'Quiet assumption 2 of 2', title: 'The auction is the end of the story',
    rows: [['Status', api.dialsBroken ? 'Broken' : 'Set'], ['Real life', "In long contracts it's only round one"], ['Lever', 'Choose what the tender reveals, and index prices (lessons 8 and 9)']],
    text: 'What you learn in the tender gets used in the renegotiation, and suppliers know it. So they bid with the next round in mind.'
  };
  if (key === 'machine') return {
    kicker: 'The workshop', title: 'The revenue equivalence machine',
    rows: [['Takes in', 'One tender'], ['Pays out', 'The average price from four formats'], ['Ties when', 'All five lights are green'], ...(ctx.reached('dials') ? [['Also assumes', 'The two dials on the right']] : [])],
    text: 'Built straight from the textbook. It is honest about the theorem, and silent about everything the theorem needs.'
  };
  if (key === 'textbook') return ctx.reached('levers')
    ? { kicker: "Libby's reading", title: 'The textbook, as a checklist',
        rows: [['Step 1', 'Check the five lights'], ['Step 2', 'Check the two dials'], ['Nothing broken', 'Chase more bidders'], ['Something broken', 'Reach for that light\'s lever']],
        text: 'The theorem is right. It just only promises the tie when its conditions hold, so use it to diagnose, not to copy.' }
    : { kicker: "Max's favourite page", title: 'The textbook',
        rows: [['Bidders are', 'Similar and independent'], ['Attitude to risk', 'Risk-neutral'], ['They know', 'Their own values'], ['Promise', 'Every standard format earns the same on average']],
        text: "Sealed or open, first-price or second-price, it doesn't matter which you pick. Max has underlined that bit twice." };
  if (key === 'bidders') return {
    kicker: 'The clean tender', title: api.bidders > 6 ? 'Eight similar suppliers' : 'Six similar suppliers',
    rows: [['Costs', 'Private, each their own'], ['Lots', 'One'], ['Repeat play', 'None'], ['At stake', 'Nothing strategic']],
    text: api.bidders > 6 ? 'Two more joined. Every format pays out less, and they still tie.' : 'Every light green and both dials set. The question is where your design time goes.'
  };
  if (key === 'max') return {
    kicker: 'Auction designer', title: 'Max',
    rows: [['Method', ctx.reached('levers') ? 'Learning to read the crate' : 'Copy the textbook'], ['Favourite format', 'Whichever is nearest'], ['Tenders run today', String(api.diagnosed.size)]],
    text: ctx.reached('levers') ? 'He still loves the textbook. Now he reads the lights before he pulls the lever.' : 'Max reaches for the quickest answer. The textbook says the format never matters, so why read the crate?'
  };
  if (key === 'libby') return {
    kicker: 'Finds the flaw', title: 'Libby',
    rows: [['Method', 'Check every condition first'], ['Red lights found', String(api.red.size)], ['Motto', 'Diagnose, then design']],
    text: 'Libby trusts the theorem. She just checks whether today\'s tender is the one the theorem was written for.'
  };
  return { kicker: '', title: key, rows: [], text: '' };
}

/* ---------- Cameras: [position, target] for wide screens and phones ---------- */
const OVER = { wide: [[0, 18, 27], [0, .8, -2]], phone: [[0, 28, 32], [0, .5, -1.5]] };
const FLOOR = { wide: [[0, 11, 21], [0, 1.4, -3]], phone: [[0, 16, 22], [0, 1.2, -3]] };
const LIGHTS_CAM = { wide: [[0, 8, 11], [0, 3.6, -4.8]], phone: [[0, 9.5, 12.5], [0, 3.2, -4.8]] };
const FORMATS_CAM = { wide: [[0, 7.5, 12], [0, 1.3, -2.8]], phone: [[0, 10, 13.5], [0, 1.1, -2.8]] };
const TENDER = { wide: [[-1, 10, 17], [-1, 2, -4.5]], phone: [[-1.5, 14, 20], [-1.5, 1.8, -4.5]] };
const PILE_CAM = { wide: [[5.2, 7, 11], [8.6, 1, 1.6]], phone: [[5.5, 8.5, 12.5], [8.6, 1, 1.6]] };
const GAUGES = { wide: [[4.2, 6, 5.5], [6.9, 2.1, -5]], phone: [[4.8, 7.5, 7.5], [6.9, 2, -5]] };

const LIGHT_WRONG = (right, notes) => Object.fromEntries(LIGHTS.filter(L => L.key !== right).map(L => [L.key, notes[L.key]]));

/* ---------- The guided tour ---------- */
export const steps = [
  {
    id: 'meet', title: 'A machine built from the textbook',
    lines: [
      { who: 'max', text: "Welcome to the workshop! I'm Max, and I design tenders straight from the textbook. Fastest way there is." },
      { who: 'libby', text: "I'm Libby. Before we feed it anything, have a look at what that textbook actually promises." }
    ],
    cam: FLOOR, task: { click: ['textbook'], say: 'Click the textbook on the lectern.' },
    async enter(api) {
      await api.setup({ out: 'empty' }); await api.home();
      api.faces('grin', 'happy'); api.poses('wave', 'idle'); setTimeout(() => api.poses('idle'), 2400);
    },
    done(api) { api.faces('happy', 'think'); api.think('max', 'Format <b>never</b> matters!'); }
  },
  {
    id: 'tie', title: 'Four formats, one coin stack',
    lines: [
      { who: 'libby', text: 'Every standard format earns the same on average when bidders are similar, independent, risk-neutral and know their own values. That\'s <b>revenue equivalence</b>.' },
      { who: 'max', text: 'Watch: one tender in, four identical coin stacks out. Each stack is the average price we pay. So I can pick any format I like!' }
    ],
    cam: FORMATS_CAM, task: { click: ['fmt-english', 'fmt-dutch', 'fmt-first', 'fmt-second'], all: true, say: 'Click all four format boxes to compare what they pay out.' },
    async enter(api) {
      await api.setup({ out: 'empty' }); await api.home(); api.faces('grin', 'happy');
      api.busy = 1; await api.setStacks('tie', 1600); api.busy = 0;
      await api.hop('max', [-5.6, .8], 700);
    },
    done(api) { api.faces('grin', 'think'); }
  },
  {
    id: 'lights', title: 'Five lights hold the tie up',
    lines: [
      { who: 'libby', text: 'In practice the tie rests on five conditions, one per light: <b>similar</b> bidders, no strong <b>common value</b>, not <b>strategically vital</b>, <b>one lot</b>, no <b>collusion</b> risk.' },
      { who: 'max', text: 'All green! The textbook\'s happy, so I\'m happy.' }
    ],
    cam: LIGHTS_CAM, task: { click: LIGHTS.map(L => L.key), all: true, say: 'Click all five lights on top of the machine.' },
    async enter(api) {
      await api.setup({ out: 'tie', red: LIGHTS.map(L => L.key) }); await api.home();
      api.faces('happy', 'think'); api.chars.libby.pose('point');
      for (const L of LIGHTS) { await animate(260, () => {}); api.setLight(L.key, true); }
      api.chars.libby.pose('idle');
    },
    done(api) { api.faces('grin', 'happy'); api.say('libby', 'Real tenders rarely meet all five.', 2400); }
  },
  {
    id: 'favourite', title: 'Tender 1: the giant incumbent',
    lines: [
      { who: 'libby', text: 'First real tender. One incumbent has twice the capacity and half the cost of anyone else.' },
      { who: 'max', text: 'Textbook says the format doesn\'t matter. I\'ll pick English and pull the lever!' }
    ],
    cam: TENDER,
    task: { pick: { answer: 'light-similar', say: 'Click the light this tender turns red.', wrong: LIGHT_WRONG('light-similar', {
      'light-common': "Nothing here is a big uncertain cost they all share. Look at how different the bidders are.",
      'light-vital': 'Nobody here needs the deal to survive. The problem is one bidder towering over the rest.',
      'light-lot': "It's still one contract with one winner.",
      'light-ring': 'Nothing suggests the bidders co-ordinate. One of them is simply far stronger.'
    }), why: 'Right. A strong favourite breaks the similar-bidders condition, and the formats stop tying. Lessons 3 and 4 deal with it.' } },
    async enter(api) {
      await api.setup({ out: 'tie', crate: 'crate-favourite' }); await api.home();
      api.faces('grin', 'think'); await api.rollIn('crate-favourite');
      api.chars.max.pose('point');
    },
    async done(api) {
      await api.pull(); await api.feed('crate-favourite'); await api.flicker('light-similar');
      await api.setStacks('favourite', 700); api.diagnosed.add('crate-favourite');
      api.poses('shrug', 'idle'); api.faces('worried', 'think');
      api.say('max', 'Hey, the stacks won\'t sit still!', 2600);
    }
  },
  {
    id: 'mustwin', title: 'Tender 2: the plant that must win',
    lines: [
      { who: 'max', text: 'Fresh tender, all green again. Same plan: textbook, any format, lever.' },
      { who: 'libby', text: 'Read it first. This supplier\'s plant closes if it loses the contract.' }
    ],
    cam: TENDER,
    task: { pick: { answer: 'light-vital', say: 'Click the light this tender turns red.', wrong: LIGHT_WRONG('light-vital', {
      'light-similar': 'The crate says nothing about the suppliers being different sizes or costs.',
      'light-common': "It isn't about a shared uncertain cost. It's about how much losing would hurt.",
      'light-lot': 'Still one contract, one winner.',
      'light-ring': "Nobody's co-ordinating. One supplier is just desperate not to lose."
    }), why: 'Right. Losing would hurt it badly, so the deal is strategically vital and it bids differently. Lesson 2 shows how.' } },
    async enter(api) {
      await api.setup({ out: 'tie', crate: 'crate-mustwin', pile: ['crate-favourite'] }); await api.home();
      api.faces('happy', 'think'); await api.rollIn('crate-mustwin');
    },
    async done(api) {
      await api.pull(); await api.feed('crate-mustwin'); await api.flicker('light-vital');
      await api.setStacks('mustwin', 900); api.diagnosed.add('crate-mustwin');
      api.poses('idle', 'point'); api.faces('surprised', 'happy');
      api.say('libby', 'Paid its own bid, it shades less to make losing less likely. Dutch and first-price come out lower.', 4200);
    }
  },
  {
    id: 'ring', title: 'Tender 3: the same three faces',
    lines: [
      { who: 'libby', text: 'Next crate. The same three suppliers have met in every monthly auction for four years.' },
      { who: 'max', text: 'Old friends! Lovely. That should make it easier, surely?' }
    ],
    cam: TENDER,
    task: { pick: { answer: 'light-ring', say: 'Click the light this tender turns red.', wrong: LIGHT_WRONG('light-ring', {
      'light-similar': 'Three similar suppliers is a small field, but the real worry is what they can do together.',
      'light-common': "Nothing here is about a shared uncertain cost.",
      'light-vital': 'Nobody needs this one deal to survive. They meet every month.',
      'light-lot': 'Each auction is still one lot.'
    }), why: 'Right. A small field that meets often can hold a ring together. Lesson 5 shows how to make that harder.' } },
    async enter(api) {
      await api.setup({ out: 'tie', crate: 'crate-ring', pile: ['crate-favourite', 'crate-mustwin'] }); await api.home();
      api.faces('happy', 'think'); await api.rollIn('crate-ring');
    },
    async done(api) {
      await api.pull(); await api.feed('crate-ring'); await api.flicker('light-ring');
      await api.setStacks('ring', 1100); api.diagnosed.add('crate-ring');
      api.faces('worried', 'think'); api.poses('shrug', 'idle');
      api.say('max', 'Every stack went up! Easier for them, not for me.', 3000);
    }
  },
  {
    id: 'split', title: 'Tender 4: the 70/30 split',
    lines: [
      { who: 'libby', text: 'Last crate of the morning. We buy 70% of the volume from one supplier and 30% from another.' },
      { who: 'max', text: 'Easy, two suppliers. That\'s the similar-bidders light again!' }
    ],
    cam: TENDER,
    task: { choice: { q: "You're buying 70% of the volume from one supplier and 30% from another. Which condition breaks?", options: [
      { text: 'One lot', ok: true, why: 'Right. Shares and multiple units break it. Lessons 5 and 7 show what that costs and how bidders exploit it.' },
      { text: 'Similar bidders', why: 'Nothing here says the suppliers differ. The award itself has changed.' },
      { text: 'No strong common value', why: "That's about uncertain costs everyone shares, which Course 8 covered." },
      { text: 'Nothing breaks', why: 'Splitting the award is exactly what the one-lot condition rules out.' }
    ] } },
    async enter(api) {
      await api.setup({ out: 'tie', crate: 'crate-split', pile: ['crate-favourite', 'crate-mustwin', 'crate-ring'] }); await api.home();
      api.faces('grin', 'think'); await api.rollIn('crate-split');
    },
    async done(api) {
      const small = api.crates['crate-split'].small;
      await animate(600, k => { small.position.x = .35 + k * .45; });
      await api.pull(); await api.feed('crate-split'); await api.flicker('light-lot');
      await api.setStacks('split', 1000); api.diagnosed.add('crate-split');
      api.faces('surprised', 'happy');
      api.say('libby', 'Look at the award, not the suppliers. Two shares is not one lot.', 3000);
    }
  },
  {
    id: 'levers', title: 'A red light is a clue',
    lines: [
      { who: 'libby', text: "Real tenders rarely meet all five. That's useful, not depressing: each red light tells you which <b>design lever</b> to reach for." },
      { who: 'max', text: 'So this pile isn\'t a scrap heap. It\'s a to-do list!' }
    ],
    cam: PILE_CAM, task: { click: ['crate-favourite', 'crate-mustwin', 'crate-ring', 'crate-split'], all: true, say: 'Click all four diagnosed crates to see the lever each one needs.' },
    async enter(api) {
      await api.setup({ out: 'levers', red: ['light-similar', 'light-vital', 'light-ring', 'light-lot'], pile: ['crate-favourite', 'crate-mustwin', 'crate-ring', 'crate-split'] });
      await api.home(); api.faces('happy', 'happy');
      await api.walk('libby', [7.6, 1.4], 1000); api.chars.libby.pose('point');
    },
    done(api) { api.chars.libby.pose('cheer'); api.faces('grin', 'grin'); setTimeout(() => api.chars.libby.pose('idle'), 1600); }
  },
  {
    id: 'dials', title: 'Two quiet assumptions',
    lines: [
      { who: 'libby', text: 'The textbook also assumes <b>bidders know how many rivals they face</b>, and that <b>the auction is the end of the story</b>.' },
      { who: 'max', text: 'Wait, there are dials too? Nobody told me about dials.' },
      { who: 'libby', text: 'Real procurement breaks both all the time. Have a look.' }
    ],
    cam: GAUGES, task: { click: ['dial-rivals', 'dial-after'], all: true, say: 'Click both dials on the gauge board.' },
    async enter(api) {
      await api.setup({ out: 'tie', pile: ['crate-favourite', 'crate-mustwin', 'crate-ring', 'crate-split'] }); await api.home();
      api.faces('surprised', 'think');
      await Promise.all([api.walk('libby', [8.9, -4.0], 1100), api.walk('max', [5.4, -1.6], 1100), api.showDials(true, true)]);
      api.chars.libby.pose('point');
    },
    async done(api) {
      api.chars.libby.pose('idle');
      await api.setDials(true, 1200);
      await api.setStacks('dials', 0);
      api.faces('worried', 'happy');
      api.say('max', 'Both in the red, and the stacks are off again!', 2800);
    }
  },
  {
    id: 'clean', title: 'Where to spend your design time',
    lines: [
      { who: 'libby', text: 'A clean one at last: six similar suppliers, private costs, one lot, no repeat play, nothing strategic at stake.' },
      { who: 'max', text: 'Nothing broken? Then I\'ll spend all week perfecting the format!' }
    ],
    cam: FLOOR,
    task: { choice: { q: "A tender has six similar suppliers, private costs, one lot, no repeat play and nothing strategic at stake. What's the best use of your design time?", options: [
      { text: 'Bring in a seventh and eighth supplier', ok: true, why: "Right. Nothing's broken, so the formats tie and more bidders is the lever that works." },
      { text: 'Switch from first-price to English', why: "Under the tie, that's worth nothing on average." },
      { text: 'Add a hidden ceiling price', why: 'It could help a little, but more bidders help more here.' },
      { text: 'Split the award 70/30', why: 'That adds cost for no reason when nothing calls for a second source.' }
    ] } },
    async enter(api) {
      await api.setup({ out: 'tie', crate: 'crate-six', dials: true, bidders: 6, pile: ['crate-favourite', 'crate-mustwin', 'crate-ring', 'crate-split'] });
      await api.home(); api.faces('grin', 'think');
      await api.rollIn('crate-six');
    },
    async done(api) {
      api.faces('surprised', 'happy');
      await api.twoMore();
      await api.pull(); await api.feed('crate-six'); api.diagnosed.add('crate-six');
      await api.setStacks('more', 1000);
      api.faces('grin', 'grin'); api.poses('cheer', 'idle'); setTimeout(() => api.poses('idle'), 1800);
      api.say('libby', 'When nothing is broken, chase more bidders. Every stack drops, and they still tie.', 3600);
    }
  },
  {
    id: 'end', title: 'What you just learned',
    lines: [
      { who: 'max', text: 'So the textbook isn\'t wrong. I was just pulling the lever without reading the crate.' },
      { who: 'libby', text: 'Check the lights, then pick the lever. Next lesson: suppliers who really hate losing.' }
    ],
    summary: [
      'Use the revenue equivalence conditions as a <b>diagnostic checklist</b>: similar bidders, no strong common value, not strategically vital, one lot, no collusion risk.',
      'Each broken condition points to a specific design lever, and that is when the format and the rules start to matter.',
      'Watch the two quiet assumptions too: unknown competition and life after the auction. When nothing is broken, chase more bidders.'
    ],
    cam: OVER, task: null,
    async enter(api) {
      await api.setup({ out: 'more', dials: true, bidders: 8, pile: ['crate-favourite', 'crate-mustwin', 'crate-ring', 'crate-split', 'crate-six'] });
      await api.home(); api.faces('happy', 'grin'); api.poses('wave', 'idle');
    }
  }
];
