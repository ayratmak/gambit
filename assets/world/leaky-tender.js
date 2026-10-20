/* 3D lesson: The leaky tender. Course: Designing a Winning Tender, lesson "Why most tenders leak value".
   Same story as the preview lesson in assets/courses/procurement.js: the appliance maker's washing-machine drum tender,
   the room that decides after the bids, engineering's veto, the five ways a decision leaks and the six habits to sort.
   The quotes in £ a drum are illustrative; the text lesson has no figures. */
import { stage, scenery, prop, cast, V, THREE, box, animate, CAST } from './kit.js';

export const meta = {
  id: 'leaky-tender',
  title: 'The leaky tender',
  course: 'procurement', lesson: 'why-tenders-leak',
  minutes: 7
};

/* ---------- Layout ---------- */
const R = 2.3, H = 3.4, Y0 = .45;                    // tank radius, glass height, height of its base
const SUP = {                                          // each supplier's factory and where they stand
  inc: { crate: [9.0, -4.6], at: [7.4, -2.6] },
  supc: { crate: [10.0, -.4], at: [8.2, 1.0] },
  max: { crate: [9.2, 3.6], at: [7.4, 4.8] }
};
const SUPPLIERS = ['inc', 'supc', 'max'];
const SEATS = { eng: [-9.6, -6.3], qual: [-8, -6.7], fin: [-6.4, -6.3] };
const ROOM = ['eng', 'qual', 'fin'];
const DOOR = [-10.4, -1.6];
const SHEET = [-8.15, -4.3], STAMP_HOME = [-8.95, -4.55];
const RAIL_AT = [-5.8, 5.8];
const BINS = { 'bin-leak': [-2.4, 6.1], 'bin-protect': [2.4, 6.1] }, PLACARD_AT = [0, 6.5];
const SPOTS = { leaks: [4.8, 2.0], rail: [-1.4, 4.4], sort: [3.9, 4.6] };

/* Quotes in £ a drum: opening, after two weeks of haggling, and next time round once they've learned to hold back */
const QUOTES = { inc: { open: 44, final: 43, held: 45 }, supc: { open: 40, final: 39, held: 42 }, max: { open: 38, final: 36, held: 41 } };
const FULL_FLOW = { inc: 5, supc: 5, max: 5 };

/* The five ways a decision leaks, one hole each. a = angle round the tank (0 faces the camera), h = height. */
const LEAKS = [
  { a: -56, h: 1.0, title: 'Dropped purely on cost', what: 'A high-quality supplier loses on price alone', learn: 'Better quality counts for nothing',
    text: 'Nobody put a money value on the better quality before the bids, so the room could only compare prices. Next time that supplier cuts corners or stays away.',
    plug: 'Quality differences priced in money before bidding' },
  { a: -28, h: 2.3, title: 'Vetoed on a rumour', what: "A supplier is ruled out on hearsay or one person's comment, with no analysis", learn: 'Gossip can beat a good offer',
    text: "Someone heard the plant was struggling, and that was the end of it. No check, no numbers. Every supplier watching learns that a good offer isn't enough.",
    plug: 'Calling out the rumour as a leak, so concerns get analysed before the bids' },
  { a: 2, h: 1.6, title: 'Judged without the users', what: "Suppliers are judged without input from the people who'll live with the part", learn: 'The real needs turn up too late to bid on',
    text: 'Engineering and quality only speak once the offers are in, so no supplier ever got the chance to price what they actually need.',
    plug: 'Stakeholders agreeing the award rules before quotes arrive' },
  { a: 26, h: 2.65, title: 'Overvalued, then a fight', what: 'One supplier is overvalued and the award turns into an internal fight', learn: 'Lobbying pays better than a sharp price',
    text: 'With no agreed rules, each department backs its favourite and the decision goes to whoever argues hardest. Suppliers put their effort into influence, not into the offer.',
    plug: 'Telling suppliers exactly how the winner will be chosen' },
  { a: 50, h: .8, title: 'Best whole-life cost eliminated', what: 'The supplier with the best whole-life cost is quietly dropped', learn: "Being cheapest over the life of the deal doesn't win",
    text: "Whole-life cost is everything the deal costs over its life, in today's money. If nobody measures it before the bids, the best long-term offer can vanish without anyone noticing.",
    plug: "Refusing to let the incumbent 'match the best offer' at the end" }
];
const ALL = [0, 1, 2, 3, 4];
const levelFor = leaking => .9 - .1 * leaking;

/* The six habits from the text lesson's sorting task. The last three are sorted together. */
const HABITS = [
  { text: "A supplier is excluded after someone says 'I heard their plant is struggling'", bin: 'bin-leak', plug: [1] },
  { text: 'Stakeholders agree the award rules before quotes arrive', bin: 'bin-protect', plug: [2] },
  { text: "The incumbent is invited to 'match the best offer' at the end", bin: 'bin-leak', plug: [4] },
  { three: true, plug: [0, 3] }
];

export function build(w) {
  const { mat, label } = w;
  stage(w, { width: 26, depth: 18 });

  // helpers: a clickable prop whose extra labels hide with it, a pop-in, a theme material with options
  const extras = new Map();
  const P = (key, g, text, y, cls) => { const p = prop(w, key, g, text, y, cls); extras.set(p, []); return p; };
  const tag = (p, text, pos, cls, parent) => { const l = label(p.obj.userData.key, text, pos, cls); (parent || p.obj).add(l.obj); extras.get(p).push(l); return l; };
  const setOn = (p, on) => { p.show(on); extras.get(p).forEach(l => { l.obj.visible = on; l.el.hidden = !on; }); };
  const pop = async (p, ms = 520) => {
    if (p.obj.visible) return;
    setOn(p, true); p.obj.scale.setScalar(.001);
    await animate(ms, k => p.obj.scale.setScalar(Math.max(.001, k)));
  };
  const cyl = (rt, rb, h, m, segs = 32, open = false) => new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, segs, 1, open), m);
  const at = (mesh, x, y, z) => { mesh.position.set(x, y, z); return mesh; };
  const goldScenery = mat('gold', { metalness: .35, roughness: .45 });
  const coinGeo = new THREE.CylinderGeometry(.16, .16, .05, 18);

  const S = {
    level: .5, quotes: 'none', flow: { inc: 0, supc: 0, max: 0 }, award: false, room: false, veto: 'off',
    habits: false, valve: 'none', open: [], plugged: [], timeline: null, sort: null, sorted: false, rulebook: false, lean: false
  };

  /* ---------- The tank of value, centre stage ---------- */
  const tankG = new THREE.Group();
  tankG.add(at(cyl(R + .35, R + .5, Y0, mat('surface'), 48), 0, Y0 / 2, 0));
  const glassM = mat('water', { transparent: true, opacity: .26, roughness: .08, side: THREE.DoubleSide, depthWrite: false });
  tankG.add(at(cyl(R, R, H, glassM, 48, true), 0, Y0 + H / 2, 0));
  const rimM = mat('muted', { metalness: .3, roughness: .5 });
  for (const y of [Y0 + .04, Y0 + H]) { const t = new THREE.Mesh(new THREE.TorusGeometry(R + .02, .09, 10, 56), rimM); t.rotation.x = Math.PI / 2; t.position.y = y; tankG.add(t); }
  for (let k = 0; k < 6; k++) {                        // four steel straps up the glass
    if (k % 3 === 0) continue;
    const a = k * Math.PI / 3 + Math.PI, strap = box(.12, H, .08, rimM, Math.sin(a) * (R + .03), Y0, Math.cos(a) * (R + .03));
    strap.rotation.y = a; tankG.add(strap);
  }
  const fillM = mat('gold', { metalness: .35, roughness: .45 });
  const fillGeo = new THREE.CylinderGeometry(R - .1, R - .1, 1, 44); fillGeo.translate(0, .5, 0);
  const fill = new THREE.Mesh(fillGeo, fillM); fill.position.y = Y0; tankG.add(fill);
  const topCoins = new THREE.Group(); tankG.add(topCoins);
  for (let k = 0; k < 18; k++) {
    const a = k * 2.4, r = .35 + (k % 6) * .3, c = new THREE.Mesh(coinGeo, fillM);
    c.position.set(Math.sin(a) * r, .03 + (k % 3) * .04, Math.cos(a) * r); c.rotation.set((k % 4) * .18, 0, (k % 5) * .15);
    topCoins.add(c);
  }
  const tank = P('tank', tankG, 'Value in the deal', Y0 + H + .9);
  tag(tank, '£', V(0, Y0 + H + .45, 0), 'coin');
  const setLevel = l => { const hgt = Math.max(.02, l * H * .94); fill.scale.y = hgt; topCoins.position.y = Y0 + hgt; };
  setLevel(S.level);

  /* ---------- Coins spilt on the floor in front of the tank ---------- */
  const pile = [];
  for (let k = 0; k < 24; k++) {
    const a = -1.1 + k * .09 + (k % 3) * .05, r = R + .9 + (k % 4) * .28;
    const c = new THREE.Mesh(coinGeo, goldScenery);
    c.position.set(Math.sin(a) * r, .03 + (k % 2) * .05, Math.cos(a) * r); c.rotation.set((k % 3) * .2, k, 0);
    c.visible = false; scenery(w, c); pile.push(c);
  }
  const setPile = () => { const n = Math.min(pile.length, S.open.length * 3 + Math.max(0, S.open.length - S.plugged.length) * 2); pile.forEach((c, k) => { c.visible = k < n; }); };

  /* ---------- Five holes in the tank, each spraying coins until it's plugged ---------- */
  const holes = LEAKS.map((L, i) => {
    const a = L.a * Math.PI / 180, dir = V(Math.sin(a), 0, Math.cos(a));
    const pos = V(dir.x * (R + .02), Y0 + L.h, dir.z * (R + .02));
    const g = new THREE.Group(); g.position.copy(pos); g.rotation.y = a;
    const rimH = new THREE.Mesh(new THREE.TorusGeometry(.24, .065, 10, 28), mat('bad'));
    const dark = new THREE.Mesh(new THREE.CircleGeometry(.22, 24), mat('mask')); dark.position.z = .01;
    g.add(rimH, dark);
    const crackM = mat('bad');
    [[.35, .4], [-.4, 2.3], [.3, 4.1]].forEach(([len, rot]) => { const c = box(.04, len, .02, crackM, 0, 0, .02); c.geometry.translate(0, .2, 0); c.position.y = 0; c.rotation.z = rot; g.add(c); });
    const cork = new THREE.Mesh(new THREE.CylinderGeometry(.2, .26, .4, 20), mat('wood'));
    cork.rotation.x = Math.PI / 2; cork.position.z = .14; cork.visible = false; g.add(cork);
    const p = P(`leak-${i + 1}`, g, String(i + 1), .62, 'coin');
    setOn(p, false);
    const spray = [];
    for (let j = 0; j < 8; j++) { const c = new THREE.Mesh(coinGeo, goldScenery); c.visible = false; scenery(w, c); spray.push(c); }
    return { p, cork, pos, dir, spray };
  });

  /* ---------- Three suppliers' factories, piped into the tank ---------- */
  const factories = {}, pipes = {}, quoteBoards = {};
  for (const k of SUPPLIERS) {
    const [cx, cz] = SUP[k].crate, g = new THREE.Group();
    g.add(box(2.0, .12, 1.6, mat('surface'), 0, 0, 0, .08));
    g.add(box(1.7, 1.15, 1.3, mat('surface'), 0, .12, 0, .1));
    const roofM = mat('muted');
    for (const x of [-.56, 0, .56]) { const r = box(.6, .08, 1.32, roofM, 0, 0, 0); r.rotation.z = .55; r.position.set(x, 1.38, 0); g.add(r); }
    g.add(at(cyl(.13, .15, .9, roofM, 16), .55, 1.7, -.38));
    g.add(box(.42, .62, .03, mat('ink'), -.35, .12, .66));
    for (const [dx, dy] of [[.42, .12], [.42, .52]]) {                 // finished drums stacked at the door
      const d = at(cyl(.24, .24, .38, mat('paper', { metalness: .4, roughness: .35 }), 24), dx, dy + .19, .82);
      d.rotation.x = Math.PI / 2; g.add(d);
    }
    g.position.set(cx, 0, cz); scenery(w, g); factories[k] = g;

    // glass pipe from the factory to the tank wall, on two little stands
    const from = V(cx - .9 * Math.sign(cx), 1.0, cz), dirN = V(cx, 0, cz).normalize(), to = V(dirN.x * R, 1.0, dirN.z * R);
    const dv = to.clone().sub(from), len = dv.length(), axis = dv.clone().normalize();
    const pg = new THREE.Group();
    const tube = cyl(.2, .2, len, mat('water', { transparent: true, opacity: .34, roughness: .08, side: THREE.DoubleSide, depthWrite: false }), 20, true);
    tube.position.copy(from).add(to).multiplyScalar(.5); tube.quaternion.setFromUnitVectors(V(0, 1, 0), axis); pg.add(tube);
    const ringM = mat('muted', { metalness: .3, roughness: .5 });
    for (const f of [.02, .5, .98]) {
      const r = new THREE.Mesh(new THREE.TorusGeometry(.215, .045, 8, 24), ringM);
      r.position.lerpVectors(from, to, f); r.quaternion.setFromUnitVectors(V(0, 0, 1), axis); pg.add(r);
    }
    for (const f of [.3, .72]) { const q = from.clone().lerp(to, f); pg.add(box(.1, .8, .1, ringM, q.x, 0, q.z)); pg.add(box(.4, .04, .4, ringM, q.x, 0, q.z)); }
    scenery(w, pg);
    const coins = [];
    for (let j = 0; j < 5; j++) { const c = new THREE.Mesh(coinGeo, goldScenery); c.scale.setScalar(.8); c.visible = false; scenery(w, c); coins.push(c); }
    pipes[k] = { from, to, coins };

    // quote board on a post above the roof
    const qb = new THREE.Group();
    qb.add(at(cyl(.05, .05, 1.0, mat('muted'), 8), 0, 1.9, 0));
    qb.add(box(1.25, .62, .07, mat('paper'), 0, 2.3, 0, .05));
    qb.position.set(cx - .2, 0, cz + .2);
    quoteBoards[k] = P(`quote-${k}`, qb, '£', 2.62, 'axis');
    setOn(quoteBoards[k], false);
  }

  // Max's valve, on his pipe: the habit "no reason to move"
  const vp = pipes.max.to.clone().lerp(pipes.max.from, .36);
  const valveG = new THREE.Group();
  valveG.add(at(cyl(.07, .07, .4, mat('muted'), 10), 0, .2, 0));
  const wheel = new THREE.Mesh(new THREE.TorusGeometry(.3, .05, 8, 28), mat('bad')); wheel.rotation.x = Math.PI / 2; wheel.position.y = .42; valveG.add(wheel);
  const spokeM = mat('bad');
  for (const r of [0, Math.PI / 2]) { const s = box(.6, .04, .05, spokeM, 0, .4, 0); s.rotation.y = r; valveG.add(s); }
  const gate = new THREE.Mesh(new THREE.CircleGeometry(.19, 24), mat('bad', { side: THREE.DoubleSide }));
  gate.position.y = -.21; valveG.add(gate);
  gate.quaternion.setFromUnitVectors(V(0, 0, 1), pipes.max.to.clone().sub(pipes.max.from).normalize());
  valveG.position.set(vp.x, 1.2, vp.z);
  const valve = P('valve', valveG, 'Valve', 1.1, 'sign');
  setOn(valve, false);

  // award flag on the incumbent's roof
  const flagG = new THREE.Group();
  flagG.add(at(cyl(.04, .04, 1.6, mat('muted'), 8), 0, .8, 0));
  const cloth = box(.9, .55, .03, mat('accent'), .47, 1.0, 0); flagG.add(cloth);
  flagG.add(at(new THREE.Mesh(new THREE.SphereGeometry(.07, 12, 8), mat('gold')), 0, 1.62, 0));
  flagG.position.set(SUP.inc.crate[0] + .55, 1.45, SUP.inc.crate[1] + .2);
  const award = P('award', flagG, 'Awarded', 2.1, 'sign');
  setOn(award, false);

  // a comfy chair kept warm for the incumbent: the habit "favours the incumbent"
  const chairG = new THREE.Group(), chairM = mat('muted'), cushM = mat('wood');
  chairG.add(box(1.25, .45, 1.0, chairM, 0, 0, 0, .12));
  chairG.add(box(1.25, 1.05, .28, chairM, 0, 0, -.42, .12));
  for (const x of [-.56, .56]) chairG.add(box(.22, .7, 1.0, chairM, x, 0, 0, .08));
  chairG.add(box(.85, .14, .7, cushM, 0, .45, .08, .06));
  chairG.position.set(5.6, 0, -4.6); chairG.rotation.y = -.5;
  const chair = P('armchair', chairG, 'Reserved', 1.8, 'sign');
  setOn(chair, false);

  /* ---------- The decision room, back left ---------- */
  const roomG = new THREE.Group();
  roomG.add(box(7.4, .05, 5.4, mat('floor'), -8, 0, -5.1, .2));
  roomG.add(box(7.8, 2.5, .3, mat('surface'), -8, 0, -7.95));
  roomG.add(box(.3, 1.2, 5.4, mat('surface'), -11.75, 0, -5.1));
  roomG.add(box(1.8, .95, .04, mat('water'), -5.8, 1.05, -7.78));             // window
  roomG.add(box(1.9, .06, .1, mat('muted'), -5.8, 1.0, -7.74));
  const clock = at(cyl(.34, .34, .05, mat('paper'), 28), -10.0, 1.75, -7.76); clock.rotation.x = Math.PI / 2; roomG.add(clock);
  const handM = mat('ink');
  const h1 = box(.04, .22, .02, handM, -10.0, 1.75, -7.72); roomG.add(h1);
  const h2 = box(.04, .16, .02, handM, -10.0, 1.75, -7.72); h2.geometry.translate(0, -.08, 0); h2.rotation.z = 1.6; roomG.add(h2);
  scenery(w, roomG);
  label(null, 'Decision room', V(-8, 3.0, -7.9), 'sign');

  const tableG = new THREE.Group(), woodM = mat('wood');
  tableG.add(at(cyl(1.35, 1.35, .1, woodM, 40), 0, .83, 0));
  tableG.add(at(cyl(.15, .2, .78, woodM, 16), 0, .39, 0));
  tableG.add(at(cyl(.55, .6, .06, woodM, 24), 0, .03, 0));
  const paperM = mat('paper'), inkM = mat('muted');
  [[-.5, .45, .3], [.15, .1, -.2], [.65, -.35, .15]].forEach(([x, z, r]) => {   // the three bids
    const s = box(.5, .01, .66, paperM, x, .88, z); s.rotation.y = r; tableG.add(s);
  });
  tableG.add(box(.6, .01, .8, paperM, SHEET[0] + 8, .885, SHEET[1] + 4.9));      // the award sheet
  tableG.position.set(-8, 0, -4.9);
  const table = P('decision-table', tableG, 'Decision table', 1.5, 'sign');
  const mark = box(.36, .012, .24, mat('bad'), SHEET[0], .89, SHEET[1]); mark.visible = false; scenery(w, mark);

  // the veto stamp
  const stampG = new THREE.Group();
  stampG.add(box(.5, .16, .36, mat('bad'), 0, 0, 0, .04));
  stampG.add(box(.42, .1, .3, mat('wood'), 0, .16, 0, .04));
  stampG.add(at(cyl(.07, .09, .4, mat('wood'), 12), 0, .46, 0));
  stampG.add(at(new THREE.Mesh(new THREE.SphereGeometry(.16, 18, 12), mat('wood')), 0, .72, 0));
  stampG.position.set(STAMP_HOME[0], .88, STAMP_HOME[1]);
  const veto = P('veto', stampG, 'Veto', 1.25, 'sign');
  setOn(veto, false);

  // the megaphone: the habit "the loudest voice wins"
  const megaG = new THREE.Group();
  const bell = new THREE.Mesh(new THREE.ConeGeometry(.26, .62, 22, 1, true), mat('bad', { side: THREE.DoubleSide }));
  bell.rotation.x = -Math.PI / 2; bell.position.set(0, .2, 0); megaG.add(bell);
  megaG.add(box(.08, .22, .08, mat('ink'), 0, -.05, -.12));
  megaG.position.set(-7.05, .88, -4.4); megaG.rotation.y = -.5;
  const mega = P('megaphone', megaG, 'Megaphone', 1.0, 'sign');
  setOn(mega, false);

  // the Rulebook, for the very end
  const bookG = new THREE.Group();
  bookG.add(box(.9, .2, .66, mat('accent'), 0, 0, 0, .04));
  bookG.add(box(.84, .14, .6, mat('paper'), .04, .03, 0));
  const sigM = mat('ink');
  for (let k = 0; k < 4; k++) bookG.add(box(.32, .005, .03, sigM, -.05, .205, -.2 + k * .13));
  bookG.position.set(-7.6, .88, -4.35); bookG.rotation.y = .3;
  const book = P('rulebook', bookG, 'Rulebook', 1.0, 'sign');
  setOn(book, false);

  /* ---------- The contract: a washing-machine drum on a stand ---------- */
  const drumG = new THREE.Group();
  drumG.add(box(1.3, .75, 1.3, mat('surface'), 0, 0, 0, .1));
  const spin = new THREE.Group(); spin.position.y = 1.4; spin.rotation.x = Math.PI / 2 - .35;
  const steel = mat('paper', { metalness: .5, roughness: .3, side: THREE.DoubleSide });
  spin.add(cyl(.6, .6, .85, steel, 36, true));
  const backDisc = new THREE.Mesh(new THREE.CircleGeometry(.6, 36), steel); backDisc.rotation.x = Math.PI / 2; backDisc.position.y = -.42; spin.add(backDisc);
  const holeM = mat('muted');
  for (let row = 0; row < 3; row++) for (let k = 0; k < 12; k++) {
    const a = k * Math.PI / 6 + row * .26, d = new THREE.Mesh(new THREE.SphereGeometry(.035, 6, 4), holeM);
    d.position.set(Math.sin(a) * .605, -.25 + row * .25, Math.cos(a) * .605); spin.add(d);
  }
  for (let k = 0; k < 3; k++) { const a = k * 2.09, rib = box(.08, .8, .14, steel, Math.sin(a) * .54, -.4, Math.cos(a) * .54); rib.rotation.y = a; spin.add(rib); }
  const lip = new THREE.Mesh(new THREE.TorusGeometry(.6, .05, 8, 36), steel); lip.rotation.x = Math.PI / 2; lip.position.y = .43; spin.add(lip);
  drumG.add(spin);
  drumG.position.set(-6.8, 0, 1.6);
  P('drum', drumG, 'The contract', 2.5);

  /* ---------- The order-of-events rail: bids then decision, or decide first ---------- */
  const railG = new THREE.Group();
  railG.add(box(4.6, .2, 1.1, mat('surface'), 0, 0, 0, .1));
  const arrowM = mat('muted');
  railG.add(box(3.4, .04, .08, arrowM, 0, .2, .42));
  const tip = new THREE.Mesh(new THREE.ConeGeometry(.12, .3, 12), arrowM); tip.rotation.z = -Math.PI / 2; tip.position.set(1.85, .22, .42); railG.add(tip);
  const bidsB = new THREE.Group(); bidsB.add(box(1.5, .6, .6, mat('paper'), 0, .2, -.1, .08)); railG.add(bidsB);
  const decideB = new THREE.Group(); decideB.add(box(1.5, .6, .6, mat('gold'), 0, .2, -.1, .08)); railG.add(decideB);
  railG.position.set(RAIL_AT[0], 0, RAIL_AT[1]);
  const rail = P('timeline', railG, 'Order of events', 1.7, 'sign');
  tag(rail, 'Bids', V(0, 1.05, 0), 'axis', bidsB);
  tag(rail, 'Decide', V(0, 1.05, 0), 'axis', decideB);
  const placeRail = order => { const first = order === 'first'; decideB.position.set(first ? -1.1 : 1.1, 0, 0); bidsB.position.set(first ? 1.1 : -1.1, 0, 0); };
  placeRail('after');
  setOn(rail, false);

  /* ---------- Sorting: two bins and a habit placard ---------- */
  const bucketG = new THREE.Group();
  const bucketM = mat('bad', { side: THREE.DoubleSide });
  bucketG.add(at(cyl(.78, .6, 1.0, bucketM, 30, true), 0, .5, 0));
  bucketG.add(at(cyl(.6, .6, .04, bucketM, 30), 0, .02, 0));
  const lipB = new THREE.Mesh(new THREE.TorusGeometry(.78, .05, 8, 30), mat('ink')); lipB.rotation.x = Math.PI / 2; lipB.position.y = 1.0; bucketG.add(lipB);
  const handle = new THREE.Mesh(new THREE.TorusGeometry(.7, .025, 6, 30, Math.PI), mat('ink')); handle.position.y = 1.0; handle.rotation.y = .3; bucketG.add(handle);
  bucketG.position.set(BINS['bin-leak'][0], 0, BINS['bin-leak'][1]);
  const binLeak = P('bin-leak', bucketG, 'Leaks value', 2.0, 'axis');

  const crateG = new THREE.Group(), crateM = mat('wood');
  crateG.add(box(1.5, .85, 1.1, crateM, 0, 0, 0, .06));
  const slatM = mat('muted');
  for (const y of [.25, .55]) crateG.add(box(1.52, .06, 1.12, slatM, 0, y, 0));
  const corkM = mat('paper');
  for (let k = 0; k < 6; k++) { const c = at(cyl(.15, .19, .3, corkM, 14), -.5 + (k % 3) * .5, 1.0, -.22 + Math.floor(k / 3) * .44); c.rotation.z = (k % 2) * .4; crateG.add(c); }
  crateG.position.set(BINS['bin-protect'][0], 0, BINS['bin-protect'][1]);
  const binProtect = P('bin-protect', crateG, 'Protects value', 2.0, 'axis');

  const cardG = new THREE.Group();
  cardG.add(at(cyl(.06, .06, 1.3, mat('muted'), 8), 0, .65, 0));
  const board = box(1.8, 1.05, .08, mat('paper'), 0, 1.25, 0, .06); cardG.add(board);
  const lineM = mat('muted');
  for (let k = 0; k < 4; k++) cardG.add(box(k === 0 ? .9 : 1.4, .05, .02, lineM, k === 0 ? -.2 : 0, 2.05 - k * .2, .05));
  cardG.position.set(PLACARD_AT[0], 0, PLACARD_AT[1]); cardG.rotation.x = -.08;
  const placard = P('habit', cardG, 'Habit', 2.7, 'sign');
  [binLeak, binProtect, placard].forEach(p => setOn(p, false));

  /* ---------- The cast: Libby buys, Max supplies, with two rival suppliers and the decision room ---------- */
  const extra = (name, o) => ({ ...CAST.detective, name, role: '', hat: null, moustache: false, coat: false, height: 1, ...o });
  const api = cast(w, {
    max: SUP.max.at, libby: [-4.2, 3.4],
    inc: { spec: extra('Incumbent', { top: '#7D868E', topDark: '#646C73', coat: true, hair: '#4A3F36', skin: '#E2B48E' }), at: SUP.inc.at },
    supc: { spec: extra('Supplier C', { top: '#8C8478', topDark: '#6E675D', hoodie: true, hair: '#2F2620', skin: '#B07A55' }), at: SUP.supc.at },
    eng: { spec: extra('Engineering', { top: '#76807A', topDark: '#5E6761', glasses: true, hair: '#3A2E26', skin: '#E8C0A0' }), at: SEATS.eng },
    qual: { spec: extra('Quality', { top: '#857A86', topDark: '#6A616B', hair: '#1F1A17', skin: '#7A4E33' }), at: SEATS.qual },
    fin: { spec: extra('Finance', { top: '#80796A', topDark: '#665F52', moustache: true, hair: '#8E8880', skin: '#D9A47F' }), at: SEATS.fin }
  }, { names: { max: 'Max · Supplier B', libby: 'Libby · Buyer' } });
  ROOM.forEach(k => api.show(k, false));
  api.S = S;

  /* ---------- Things that tick: sprays, coins in the pipes, the drum, Max leaning back ---------- */
  const maxRoot = api.chars.max.root;
  w.onTick((t, dt) => {
    holes.forEach((h, i) => {
      const on = S.open.includes(i) && !S.plugged.includes(i) && h.p.obj.visible;
      h.spray.forEach((c, j) => {
        c.visible = on; if (!on) return;
        const tt = ((t * .75 + j / h.spray.length + i * .13) % 1) * 1.05;
        const out = .25 + 2.3 * tt, y = h.pos.y + 1.3 * tt - 4.9 * tt * tt;
        c.position.set(h.pos.x + h.dir.x * out, Math.max(.04, y), h.pos.z + h.dir.z * out);
        c.rotation.set(t * 7 + j, t * 5, 0);
      });
    });
    for (const k of SUPPLIERS) {
      const p = pipes[k], n = S.flow[k];
      p.coins.forEach((c, j) => {
        c.visible = j < n; if (j >= n) return;
        c.position.lerpVectors(p.from, p.to, (t * .4 + j / 5) % 1);
        c.rotation.set(t * 3 + j, 0, t * 2);
      });
    }
    spin.rotation.y += dt * .6;
    const lean = S.lean ? -.17 : 0;
    maxRoot.rotation.x += (lean - maxRoot.rotation.x) * Math.min(1, dt * 4);
  });

  /* ---------- Moves the tour uses ---------- */
  api.look = cam => (w.look ? w.look(...(w.camera.aspect < 1 ? cam.phone : cam.wide), 1000) : null);
  api.fill = async (to, ms = 900) => {
    const from = S.level; S.level = to;
    await animate(ms, k => setLevel(from + (to - from) * k));
  };
  const quoteText = (k, stage2) => `£${QUOTES[k][stage2]} a drum`;
  api.setQuotes = stage2 => { S.quotes = stage2; for (const k of SUPPLIERS) { setOn(quoteBoards[k], stage2 !== 'none'); if (stage2 !== 'none') quoteBoards[k].label.set(quoteText(k, stage2)); } };
  api.slideQuotes = async (a, b, ms = 1600) => {
    await animate(ms, k => { for (const s of SUPPLIERS) quoteBoards[s].label.set(`£${Math.round(QUOTES[s][a] + (QUOTES[s][b] - QUOTES[s][a]) * k)} a drum`); });
    api.setQuotes(b);
  };
  api.setFlow = f => { Object.assign(S.flow, { inc: 0, supc: 0, max: 0 }, f); };
  api.raiseFlag = async () => {
    S.award = true;
    if (award.obj.visible) return;
    setOn(award, true); award.obj.scale.set(1, .001, 1);
    await animate(800, k => award.obj.scale.set(1, Math.max(.001, k), 1));
  };
  api.stamp = async () => {
    const g = veto.obj, from = g.position.clone(), over = V(SHEET[0], 1.9, SHEET[1]), down = V(SHEET[0], .9, SHEET[1]);
    await animate(450, k => g.position.lerpVectors(from, over, k));
    await animate(150, k => g.position.lerpVectors(over, down, k));
    mark.visible = true; S.veto = 'stamped';
    const y0 = tableG.position.y;
    await animate(260, k => { tableG.position.y = y0 + Math.sin(k * Math.PI * 4) * .03 * (1 - k); });
    await animate(520, k => { g.position.lerpVectors(down, from, k); g.position.y += Math.sin(k * Math.PI) * .6; });
  };
  api.burst = async () => {
    for (const i of ALL) {
      if (S.open.includes(i)) continue;
      S.open.push(i); setPile();
      const h = holes[i].p; setOn(h, true); h.obj.scale.setScalar(.001);
      await Promise.all([
        animate(380, k => h.obj.scale.setScalar(Math.max(.001, k * (1.3 - .3 * k)))),
        api.fill(levelFor(S.open.length - S.plugged.length), 380)
      ]);
    }
  };
  api.plug = async idxs => {
    await Promise.all(idxs.map(async (i, n) => {
      if (S.plugged.includes(i)) return;
      await animate(1 + n * 350, () => {});
      S.plugged.push(i); setPile();
      const c = holes[i].cork; c.visible = true;
      await animate(520, k => { c.position.z = .14 + (1 - k) * 1.4; c.scale.setScalar(.6 + .4 * k); });
    }));
    await api.fill(levelFor(S.open.length - S.plugged.length), 800);
  };
  api.toss = async bin => {
    const g = placard.obj, from = g.position.clone(), [bx, bz] = BINS[bin], to = V(bx, .5, bz);
    await animate(750, k => { g.position.lerpVectors(from, to, k); g.position.y += Math.sin(k * Math.PI) * 1.4; g.scale.setScalar(1 - .8 * k); g.rotation.z = k * 1.4; });
    setOn(placard, false); S.sorted = true;
    const b = (bin === 'bin-leak' ? binLeak : binProtect).obj;
    await animate(320, k => b.scale.set(1 + Math.sin(k * Math.PI) * .12, 1 - Math.sin(k * Math.PI) * .1, 1 + Math.sin(k * Math.PI) * .12));
  };
  api.swapRail = async () => {
    const from = decideB.position.clone(), to = V(-1.1, 0, 0), bFrom = bidsB.position.clone(), bTo = V(1.1, 0, 0);
    await animate(900, k => {
      decideB.position.lerpVectors(from, to, k); decideB.position.y = Math.sin(k * Math.PI) * 1.1;
      bidsB.position.lerpVectors(bFrom, bTo, k);
    });
    S.timeline = 'first';
  };
  api.openValve = async () => {
    S.valve = 'open';
    const q0 = gate.quaternion.clone();
    await animate(900, k => { wheel.rotation.z = k * Math.PI * 3; gate.scale.setScalar(Math.max(.001, 1 - k)); });
    gate.visible = false; gate.scale.setScalar(1); gate.quaternion.copy(q0);
  };
  api.lean = on => { S.lean = on; };
  const placeChar = (k, xz) => { const r = api.chars[k].root; r.position.set(xz[0], .02, xz[1]); r.rotation.y = 0; };
  const near = (k, xz) => { const p = api.chars[k].root.position; return Math.hypot(p.x - xz[0], p.z - xz[1]) < .1; };

  /* Put the whole scene into the state a step needs, so ?step=N works from cold. */
  const DEF = {
    level: .5, quotes: 'none', flow: {}, award: false, room: false, veto: 'off', habits: false, valve: 'none',
    open: [], plugged: [], timeline: null, sort: null, rulebook: false, lean: false, maxAt: null
  };
  api.setup = async o => {
    const s = { ...DEF, ...o }, anims = [];
    api.clearThoughts();
    api.setFlow(s.flow);
    api.setQuotes(s.quotes);
    S.award = s.award; if (s.award) anims.push(api.raiseFlag()); else setOn(award, false);
    // the decision room
    if (s.room === 'walk') {
      ROOM.forEach((k, n) => {
        if (api.chars[k].root.visible && near(k, SEATS[k])) return;
        placeChar(k, [DOOR[0] + n * .3, DOOR[1] + n * .5]); api.show(k, true);
        anims.push(animate(1 + n * 260, () => {}).then(() => api.walk(k, SEATS[k], 1500)));
      });
    } else ROOM.forEach(k => { api.show(k, !!s.room); placeChar(k, SEATS[k]); });
    S.room = !!s.room;
    ROOM.forEach(k => { api.chars[k].face('happy'); api.chars[k].pose('idle'); });
    // veto stamp
    S.veto = s.veto; mark.visible = s.veto === 'stamped';
    veto.obj.position.set(STAMP_HOME[0], .88, STAMP_HOME[1]);
    if (s.veto !== 'off') anims.push(pop(veto)); else setOn(veto, false);
    // the habits of the old way
    S.habits = s.habits;
    if (s.habits) anims.push(pop(chair), pop(mega)); else { setOn(chair, false); setOn(mega, false); }
    S.valve = s.valve;
    if (s.valve !== 'none') anims.push(pop(valve)); else setOn(valve, false);
    gate.visible = s.valve === 'shut'; wheel.rotation.z = 0;
    // the leaks
    S.open = [...s.open, ...s.plugged.filter(i => !s.open.includes(i))]; S.plugged = [...s.plugged];
    holes.forEach((h, i) => {
      const on = S.open.includes(i);
      setOn(h.p, on); h.p.obj.scale.setScalar(1);
      h.cork.visible = S.plugged.includes(i); h.cork.position.z = .14; h.cork.scale.setScalar(1);
    });
    setPile();
    // the order-of-events rail
    S.timeline = s.timeline;
    if (s.timeline) { placeRail(s.timeline); anims.push(pop(rail)); } else setOn(rail, false);
    // sorting
    S.sort = s.sort; S.sorted = false;
    if (s.sort !== null) {
      const g = placard.obj; g.position.set(PLACARD_AT[0], 0, PLACARD_AT[1]); g.scale.setScalar(1); g.rotation.set(-.08, 0, 0);
      setOn(placard, false);
      placard.label.set(HABITS[s.sort].three ? 'Habits 4, 5 and 6' : `Habit ${s.sort + 1} of 6`);
      anims.push(pop(binLeak), pop(binProtect), pop(placard, 650));
    } else [binLeak, binProtect, placard].forEach(p => setOn(p, false));
    // the Rulebook
    S.rulebook = s.rulebook;
    if (s.rulebook) anims.push(pop(book)); else setOn(book, false);
    // Max: leaning back or not, and where he stands
    api.lean(s.lean);
    const to = s.maxAt || SUP.max.at;
    if (!near('max', to)) anims.push(api.hop('max', to, 800));
    for (const k of ['libby', 'inc', 'supc']) if (!near(k, k === 'libby' ? [-4.2, 3.4] : SUP[k].at)) anims.push(api.hop(k, k === 'libby' ? [-4.2, 3.4] : SUP[k].at, 700));
    ['inc', 'supc'].forEach(k => { api.chars[k].face('happy'); api.chars[k].pose('idle'); });
    api.poses('idle');
    anims.push(api.fill(s.level));
    await Promise.all(anims);
  };

  return api;
}

/* ---------- State cards: what each object knows at this point in the story ---------- */
export function card(key, ctx) {
  const S = ctx.api.S, r = ctx.reached, end = S.rulebook;
  const q = (k, stage2 = S.quotes) => stage2 === 'none' ? 'Not in yet' : `£${QUOTES[k][stage2]} a drum`;
  const leaking = S.open.length - S.plugged.length;

  if (key.startsWith('leak-')) {
    const i = +key.slice(5) - 1, L = LEAKS[i], plugged = S.plugged.includes(i);
    return {
      kicker: `Leak ${i + 1} of 5 · ${plugged ? 'plugged' : 'spraying'}`, title: L.title,
      rows: [['What happens', L.what], ['What suppliers learn', L.learn], ...(plugged ? [['Plugged by', L.plug]] : [])],
      text: plugged ? 'Plugged. This habit now tells suppliers that their offer decides the result, so the value stays in the tank.' : L.text
    };
  }
  if (key.startsWith('quote-')) {
    const k = key.slice(6), who = { inc: 'The incumbent', supc: 'Supplier C', max: 'Max, Supplier B' }[k];
    const rows = [['Opening quote', q(k, 'open')]];
    if (S.quotes !== 'open') rows.push(['After two weeks', q(k, 'final')]);
    if (S.quotes === 'held') rows.push(['Next tender', q(k, 'held')]);
    let text = 'Quotes start high and come down as Buying negotiates.';
    if (S.quotes === 'final') text = k === 'max' ? 'The lowest of the three. On price alone, Max should win.' : k === 'inc' ? 'The highest of the three, and it barely moved in two weeks.' : 'Sharper than the incumbent, not quite as sharp as Max.';
    if (S.quotes === 'held') text = k === 'inc' ? "Up, not down. It won last time without moving, so why move now?" : 'Higher than last time. Their best price didn\'t decide it before, so they keep a margin back.';
    if (end) text = 'The rules are fixed before the bids, so a sharp price can actually win. That makes it worth giving.';
    return { kicker: 'Quote board · ' + who, title: `${who}: ${q(k)}`, rows, text };
  }

  const C = {
    max: () => {
      const rows = [['Role', 'Supplier B, a challenger'], ['Quote now', q('max')]];
      let text = 'Max grabs the biggest number in front of him. Here that means winning the drum contract with the sharpest price.';
      if (r('the-room') && S.award) { rows.push(['Last result', 'Lowest price, and still lost']); text = 'He gave the lowest price in the room, £36 a drum, and the incumbent won anyway.'; }
      if (r('what-they-learned') && S.award) rows.push(['Learned', "His best price wasn't what decided it"]);
      if (S.lean) { rows.push(['Doing', 'Leaning back, arms folded, waiting']); text = "With a veto after the bids, his best price might still lose. So he won't give it. He waits."; }
      if (end) { rows.push(['Doing', 'Sharpening his price again']); text = 'The rules come before the bids, so his best price can win. That makes it worth giving.'; }
      return { kicker: 'Supplier B · a challenger', title: 'Max', rows, text };
    },
    libby: () => ({
      kicker: 'The buyer', title: 'Libby',
      rows: [['Buying for', 'An appliance maker'], ['Contract', 'Washing-machine drums'], ['Wants', "Each supplier's best offer, first time"],
        ...(r('five-leaks') ? [['Problem', end ? 'Solved: the rules come first' : `${leaking} leak${leaking === 1 ? '' : 's'} still spraying`]] : [])],
      text: end ? 'She decided how the award works before anyone bid. Now the offers decide the result, and suppliers know it.'
        : 'Libby asks where a game ends up once everyone has made their best move. Here she asks what each supplier learns from the way she buys.'
    }),
    inc: () => ({
      kicker: 'Supplier A · the incumbent', title: 'The incumbent',
      rows: [['Holds the contract', 'Yes, for years'], ['Quote now', q('inc')], ...(r('what-they-learned') && S.award ? [['Learned', "It doesn't need to move"]] : [])],
      text: end ? 'No comfy chair any more. It has to beat the others under the same published rules, so it sharpens its price too.'
        : S.award ? 'It quoted the highest price and won anyway, as usual. Why would it ever move?'
        : 'The supplier that makes the drums today. Everyone in the decision room knows it, and that matters more than it should.'
    }),
    supc: () => ({
      kicker: 'Supplier C · a challenger', title: 'Supplier C',
      rows: [['Quote now', q('supc')], ...(r('what-they-learned') && S.award ? [['Learned', "Its best price wasn't what decided it"]] : [])],
      text: end ? 'It can see how the winner will be chosen, so it can aim for it.'
        : S.award ? 'A sharper price than the incumbent, and it lost. Next time it won\'t bother sharpening its pencil.'
        : 'A challenger that would love the contract. It will give a good price only if a good price can win.'
    }),
    eng: () => ({
      kicker: 'Decision room', title: 'Engineering',
      rows: [['Cares about', 'Whether the drum fits and lasts'], ['Joins in', end ? 'Before the bids' : 'After negotiations close'],
        ...(S.veto !== 'off' ? [['Wants', 'A final veto on the winner']] : [])],
      text: end ? 'Signed the Rulebook before anyone bid. Its needs are priced in, so it needs no veto.'
        : S.veto !== 'off' ? 'Engineering sees the veto as a safety net. Suppliers see a back door: a sharper price might still lose.'
        : "The people who'll live with the part. They only speak once the offers are in."
    }),
    qual: () => ({
      kicker: 'Decision room', title: 'Quality',
      rows: [['Cares about', 'Defects, audits and returns'], ['Joins in', end ? 'Before the bids' : 'After negotiations close']],
      text: end ? 'Its quality differences are priced in money before bidding, so suppliers compare like for like.'
        : 'Has views on every supplier. None of them were written down before the quotes came in.'
    }),
    fin: () => ({
      kicker: 'Decision room', title: 'Finance',
      rows: [['Cares about', 'Budget and payment terms'], ['Joins in', end ? 'Before the bids' : 'After negotiations close']],
      text: end ? 'Agreed how the award works before the bids. Now the cheapest whole-life cost can win.'
        : 'Wants the lowest cost but has no say on how cost is measured until the bids are already in.'
    }),
    tank: () => ({
      kicker: 'The value in the deal', title: 'The tank',
      rows: [['Fills from', 'Every pound a supplier gives up'], ['Level now', Math.round(S.level * 100) + '%'],
        ...(S.open.length ? [['Leaks spraying', String(leaking)], ['Plugged', String(S.plugged.length)]] : [])],
      text: end ? 'Holes plugged, pipes running. The rules come first, so every supplier\'s best offer flows in and stays in.'
        : S.open.length ? 'Five holes, five ways a decision leaks. Each one teaches suppliers that their offer may not decide the result.'
        : 'Each pound a supplier gives up in the tender lands here. The more the offers improve, the higher it fills.'
    }),
    drum: () => ({
      kicker: 'The contract', title: 'Washing-machine drums',
      rows: [['Buyer', 'An appliance maker'], ['For', 'Every machine in its new range'], ['Suppliers quoting', 'Three'], ['Made today by', 'The incumbent']],
      text: 'The stainless steel tub that spins the laundry. Every machine needs one, so the contract is big enough for all three suppliers to want it.'
    }),
    award: () => ({
      kicker: 'The result', title: 'Awarded to the incumbent, as usual',
      rows: [['Its final quote', '£43 a drum'], ['Lowest quote', '£36 a drum, from Max'], ['Why it won', 'Nobody can say: no criteria were written down']],
      text: "The final call was made after the bids, on criteria nobody wrote down, so the best bid didn't win. Suppliers notice."
    }),
    'decision-table': () => ({
      kicker: 'Decision room', title: end ? 'Decided first' : 'Where the decision is made',
      rows: end ? [['Who meets', 'Engineering, quality, finance and Buying'], ['When', 'Before anyone bids'], ['Criteria', 'Agreed, priced and published']]
        : [['Who meets', 'Engineering, quality and finance'], ['When', 'After negotiations close'], ['Criteria', 'None written down'], ['On the table', 'Three bids'],
          ...(S.award ? [['Result', 'The incumbent, as usual']] : [])],
      text: end ? 'The same people, the same table, but the meeting now happens before the quotes, so the quotes decide the winner.'
        : 'Two weeks of negotiating, and then the real decision happens here, on preferences and gut feel. The offers don\'t bind it.'
    }),
    veto: () => ({
      kicker: S.veto === 'stamped' ? 'Stamped' : 'On the table', title: "Engineering's final veto",
      rows: [['Who holds it', 'Engineering'], ['Used', 'After the bids, on the winner'], ['What engineering sees', 'A safety net'], ['What suppliers see', 'A back door']],
      text: S.veto === 'stamped' ? "If price and performance don't decide it, there's no reason to give your best number. All three suppliers stop moving."
        : 'Run the tender, but keep the right to overrule the winner. It sounds harmless.'
    }),
    armchair: () => ({
      kicker: 'Habit 1 of the traditional process', title: 'Favours the incumbent',
      rows: [['Kept warm for', 'Whoever won last time'], ['Effect', 'The incumbent has no reason to move']],
      text: 'Familiar feels safe, so the incumbent starts every tender ahead. Challengers can see the reserved sign.'
    }),
    valve: () => ({
      kicker: S.valve === 'open' ? 'Open again' : 'Habit 2 of the traditional process', title: S.valve === 'open' ? 'Max\'s valve, open' : 'No reason to move',
      rows: S.valve === 'open' ? [['Why it opened', 'His best offer can now win']] : [['Shut by', 'Max himself'], ['Why', 'A better offer might not change the result']],
      text: S.valve === 'open' ? 'Value flows from Max\'s factory into the tank again.' : 'Suppliers only give up value when giving it up can win. Here it can\'t, so the valve stays shut.'
    }),
    megaphone: () => ({
      kicker: 'Habit 3 of the traditional process', title: 'The loudest voice wins',
      rows: [['Who uses it', 'Whoever argues hardest in the room'], ['What decides it', 'Rumours, preferences and price alone']],
      text: 'When the rules aren\'t agreed first, the award goes to the strongest opinion, not the best offer.'
    }),
    timeline: () => S.timeline === 'first' ? {
      kicker: 'Order of events', title: 'Decide first, then bid',
      rows: [['1st', 'Agree how the award works'], ['2nd', 'Suppliers bid, and the rules pick the winner']],
      text: "Flip the order and the offers decide the result. That's the idea behind a Rules-First Tender, the subject of this course."
    } : {
      kicker: 'Order of events', title: 'Bids first, decision after',
      rows: [['1st', 'Suppliers bid and negotiate'], ['2nd', 'The room decides, on criteria nobody wrote down']],
      text: 'Every one of the five leaks comes from this order: the decision comes after the offers and isn\'t bound to them.'
    },
    'bin-leak': () => ({
      kicker: 'Sorting bin', title: 'Leaks value',
      rows: [['Goes in here', 'Habits that tell suppliers their offer may not decide the result']],
      text: 'Ask the same question every time: does this habit tell suppliers their offer decides the result? If not, it leaks.'
    }),
    'bin-protect': () => ({
      kicker: 'Sorting bin', title: 'Protects value',
      rows: [['Goes in here', 'Habits that tell suppliers their offer decides the result'], ['Full of', 'Corks']],
      text: 'Each habit sorted right plugs one hole in the tank.'
    }),
    habit: () => {
      const h = HABITS[S.sort] || HABITS[0];
      if (h.three) return {
        kicker: 'Habits 4, 5 and 6 · two protect, one leaks', title: 'Spot the leak',
        rows: [['A', 'Suppliers are told exactly how the winner will be chosen'], ['B', 'Quality differences are priced in money before bidding'], ['C', 'The final decision meeting happens after negotiations close']],
        text: 'Two of these plug holes and one makes them. Answer in the panel.'
      };
      return {
        kicker: `Habit ${S.sort + 1} of 6 · ${S.sorted ? 'sorted' : 'to sort'}`, title: h.text,
        rows: [['Ask yourself', 'Does it tell suppliers their offer decides the result?']],
        text: 'Click the bin it belongs in: Leaks value or Protects value.'
      };
    },
    rulebook: () => ({
      kicker: 'Coming up in this course', title: 'The Rulebook',
      rows: [['Signed by', 'Everyone who could veto'], ['Signed when', 'Before anyone bids'], ['Sets out', 'Scope, how differences are priced, how the award works']],
      text: "No back door left: the people who could have vetoed agreed the rules up front. You'll build one later in this course."
    })
  };
  return C[key] ? C[key]() : { kicker: '', title: key, rows: [], text: '' };
}

/* ---------- Camera presets: [position, target] for wide screens and for phones ---------- */
const OVER = { wide: [[0, 21, 26], [0, .5, -.5]], phone: [[0, 33, 35], [0, .5, -.5]] };
const MEET = { wide: [[1.4, 14, 24], [1.4, .9, .6]], phone: [[1.4, 22, 28], [1.4, .9, .6]] };
const SUPS = { wide: [[4.6, 8, 14.5], [7.4, 1.4, 0]], phone: [[5.6, 13, 19], [7.6, 1.2, 0]] };
const ROOMC = { wide: [[-6.6, 7, 6.5], [-8, 1.3, -5]], phone: [[-7.4, 10.5, 8.5], [-8, 1.2, -5]] };
const HABITC = { wide: [[-.6, 15, 19.5], [-.6, .8, -1.6]], phone: [[-.6, 24, 27], [-.6, .8, -1.6]] };
const LEAKC = { wide: [[.6, 7, 15.5], [.8, 1.6, .3]], phone: [[.6, 8, 17], [.6, 1.6, .5]] };
const RAILC = { wide: [[-4.2, 8.5, 19], [-4.4, 1, 3.8]], phone: [[-4.4, 12, 23], [-4.4, 1, 3.8]] };
const SORTC = { wide: [[0, 8, 19], [0, 1.4, 3.4]], phone: [[0, 12, 23], [0, 1.4, 3.4]] };

/* ---------- Scene states, built up step by step ---------- */
const S3 = { level: .9, quotes: 'final', room: true };
const S4 = { ...S3, award: true };
const S6 = { ...S4, quotes: 'held', veto: 'stamped', habits: true, valve: 'shut', lean: true };
const S8 = { ...S6, level: levelFor(5), open: ALL, timeline: 'after', maxAt: SPOTS.rail };
const SORT = (n, plugged) => ({ ...S8, timeline: 'first', sort: n, plugged, maxAt: SPOTS.sort, level: levelFor(5 - plugged.length) });
const SEND = { level: 1, quotes: 'final', room: true, open: ALL, plugged: ALL, timeline: 'first', valve: 'open', rulebook: true, flow: FULL_FLOW };

const sortTask = (n, wrongKey, wrongWhy, why) => ({ pick: {
  answer: HABITS[n].bin, say: `Sort habit ${n + 1}: "${HABITS[n].text}". Click the bin it belongs in.`,
  wrong: { [wrongKey]: wrongWhy }, why
} });
const sortDone = n => async api => {
  await api.toss(HABITS[n].bin);
  await api.plug(HABITS[n].plug);
};

/* ---------- The guided tour ---------- */
export const steps = [
  {
    id: 'meet', title: 'A tender for washing-machine drums',
    lines: [
      { who: 'libby', text: "I'm buying for an appliance maker: washing-machine drums for its new range. Three suppliers are quoting." },
      { who: 'max', text: "And I'm Supplier B! That big tank is the value in this deal. My job is to win the contract." },
      { who: 'libby', text: 'Every pound a supplier gives up flows down a pipe into the tank. Let\'s see how much of it we keep.' }
    ],
    cam: MEET, task: { click: ['tank', 'drum'], all: true, say: 'Click the tank of value, then the drum on its stand.' },
    async enter(api) {
      await api.setup({ level: .5 });
      api.faces('happy'); api.chars.max.pose('wave'); setTimeout(() => api.chars.max.pose('idle'), 2400);
    }
  },
  {
    id: 'two-weeks', title: 'Two weeks of haggling',
    lines: [
      { who: 'libby', text: 'Buying negotiates with all three for two weeks. Watch the quotes come down and the tank fill up.' },
      { who: 'max', text: '£38, now £36 a drum. Lowest on the board. This one is mine!' }
    ],
    cam: SUPS, task: { click: ['quote-inc', 'quote-supc', 'quote-max'], all: true, say: 'Click all three quote boards.' },
    async enter(api) {
      await api.setup({ level: .5, quotes: 'open', flow: FULL_FLOW });
      api.faces('grin', 'happy');
      await Promise.all([api.slideQuotes('open', 'final', 2200), api.fill(.9, 2400)]);
    },
    done(api) { api.chars.max.pose('cheer'); setTimeout(() => api.chars.max.pose('idle'), 1400); api.chars.inc.face('think'); }
  },
  {
    id: 'the-room', title: 'Then the room decides',
    lines: [
      { who: 'libby', text: 'Negotiations close. Now engineering, quality and finance meet to <b>decide</b>, after the bids are in.' },
      { who: 'max', text: 'Easy decision. Mine is the lowest price on the table!' }
    ],
    cam: ROOMC, task: { click: ['decision-table'], say: 'Click the decision table to see what the room will decide on.' },
    async enter(api) { await api.setup({ ...S3, room: 'walk' }); api.faces('grin', 'think'); },
    async done(api) {
      api.chars.fin.pose('point'); api.chars.eng.face('grin');
      await api.look(SUPS);
      await api.raiseFlag();
      api.chars.inc.face('grin');
      await api.hop('inc', [7.4, -2.6], 800);
      api.faces('surprised', 'worried');
      api.say('max', 'The incumbent? At £43? As usual?', 2600);
    }
  },
  {
    id: 'what-they-learned', title: 'What each supplier learned',
    lines: [
      { who: 'libby', text: 'Ask what each supplier just learned from that award. They are all paying attention.' },
      { who: 'max', text: "I learned my best price wasn't what decided it. So next time, why would I give it?" }
    ],
    cam: SUPS, task: { click: ['inc', 'supc', 'max'], all: true, say: 'Click each supplier to see what they learned.' },
    async enter(api) { await api.setup(S4); api.faces('worried', 'think'); api.chars.inc.face('grin'); },
    async done(api) {
      api.think('inc', "No need to move");
      api.think('supc', "Why bother?");
      api.think('max', "Hold back next time");
      await api.slideQuotes('final', 'held', 1400);
      api.faces('think', 'worried');
    }
  },
  {
    id: 'veto', title: 'Engineering wants a veto',
    lines: [
      { who: 'libby', text: "New tender. Engineering says: 'Run it, but we want a <b>final veto</b> on the winner.'" },
      { who: 'max', text: "A veto is just a safety net, right? Nothing changes for me." }
    ],
    cam: ROOMC,
    task: { choice: { q: "Engineering wants a final veto on the winner. What happens to supplier incentives?", options: [
      { text: 'Nothing, a veto is just a safety net', why: "Suppliers can't see a safety net, they see a back door. A veto means a sharper price might still lose." },
      { text: 'Suppliers bid harder to impress engineering', why: "They'll lobby engineering, not cut price. Effort goes into influence, not into the offer." },
      { text: 'Suppliers hold back, because their price may not decide the result', ok: true, why: "Right. If price and performance don't decide it, there's no reason to give your best number." },
      { text: 'Only the incumbent is affected', why: "Everyone is. Challengers suspect the outcome is fixed, so they don't bother sharpening their pencils." }
    ] } },
    async enter(api) {
      await api.setup({ ...S4, quotes: 'held', veto: 'on', flow: { inc: 2, supc: 4, max: 4 } });
      api.faces('happy', 'think'); api.chars.eng.pose('point'); api.chars.eng.face('grin');
    },
    async done(api) {
      await api.stamp();
      await api.look(SUPS);
      api.setFlow({}); api.lean(true);
      api.chars.max.face('think'); api.chars.supc.pose('shrug'); api.chars.inc.face('happy');
      api.think('max', 'Arms folded. I\'ll wait.');
      api.think('supc', 'Why sharpen my pencil?');
    }
  },
  {
    id: 'three-habits', title: 'Three habits of the old way',
    lines: [
      { who: 'libby', text: "This is the <b>traditional process</b>. It has three habits, and you can find all three in this scene." },
      { who: 'max', text: 'A comfy chair for the incumbent, a megaphone in the room, and my valve shut tight.' },
      { who: 'libby', text: 'It <b>favours the incumbent</b>, gives suppliers <b>no reason to move</b>, and lets <b>the loudest voice win</b>.' }
    ],
    cam: HABITC, task: { click: ['armchair', 'valve', 'megaphone'], all: true, say: 'Click the chair, the valve on Max\'s pipe and the megaphone.' },
    async enter(api) { await api.setup(S6); api.faces('think', 'happy'); api.chars.inc.face('grin'); },
    done(api) { api.chars.fin.pose('point'); api.chars.qual.face('worried'); }
  },
  {
    id: 'five-leaks', title: 'Five ways a decision leaks',
    lines: [
      { who: 'libby', text: 'When the decision rests on rumours, preferences and price alone, the same <b>five leaks</b> keep appearing.' },
      { who: 'max', text: "The tank's springing holes! That's all the value spraying out on the floor!" }
    ],
    cam: LEAKC, task: { click: ['leak-1', 'leak-2', 'leak-3', 'leak-4', 'leak-5'], all: true, say: 'Click all five leaks to see what each one is.' },
    async enter(api) {
      await api.setup({ ...S6, maxAt: SPOTS.leaks });
      api.faces('surprised', 'worried');
      await api.burst();
    },
    done(api) { api.faces('worried', 'think'); }
  },
  {
    id: 'root-cause', title: 'Five leaks, one root cause',
    lines: [
      { who: 'max', text: 'Five leaks? Easy fix: invite more suppliers next time.' },
      { who: 'libby', text: 'More suppliers would face the same room. Look at the order of events on this rail.' }
    ],
    cam: RAILC,
    task: { choice: { q: 'What do all five leaks have in common?', options: [
      { text: 'Too few suppliers were invited', why: 'More suppliers would face the same room after the bids, and learn the same lesson.' },
      { text: 'Buying negotiated too softly', why: 'Two weeks of hard negotiating still lost to a room that decided afterwards.' },
      { text: "The decision comes after the offers and isn't bound to them", ok: true, why: "Right. The root cause is the same every time: the offers don't bind the decision, so suppliers hold back." },
      { text: 'The suppliers quoted too high', why: "That's a symptom. They quote high because their best price may not decide the result." }
    ] } },
    async enter(api) { await api.setup(S8); api.faces('grin', 'think'); },
    async done(api) {
      await api.swapRail();
      api.faces('surprised', 'happy');
      api.say('libby', 'Decide first, then bid.', 2400);
    }
  },
  {
    id: 'sort-rumour', title: 'Sort it: the rumour',
    lines: [
      { who: 'libby', text: 'Your turn. Every habit you sort right plugs a hole. Ask: does it tell suppliers their offer decides the result?' },
      { who: 'max', text: 'This one sounds fair. Who wants a supplier whose plant is struggling?' }
    ],
    cam: SORTC,
    task: sortTask(0, 'bin-protect', "Nobody checked it. It's a rumour with no analysis, and every supplier learns that gossip can beat a good offer.",
      'Right. A rumour with no analysis. Every supplier learns that gossip can beat a good offer.'),
    async enter(api) { await api.setup(SORT(0, [])); api.faces('think', 'happy'); },
    done: sortDone(0)
  },
  {
    id: 'sort-rules', title: 'Sort it: rules before quotes',
    lines: [
      { who: 'max', text: 'Agreeing the rules before any quotes? Sounds like paperwork to me.' },
      { who: 'libby', text: 'Same question as before. Once the rules are agreed, what picks the winner?' }
    ],
    cam: SORTC,
    task: sortTask(1, 'bin-leak', "It's the opposite of a leak. The decision is made before the bids, so the bids decide the winner.",
      'Right. The decision is made before the bids, so the bids decide the winner.'),
    async enter(api) { await api.setup(SORT(1, [1])); api.faces('think', 'happy'); },
    async done(api) { await sortDone(1)(api); api.chars.max.face('happy'); }
  },
  {
    id: 'sort-match', title: 'Sort it: match the best offer',
    lines: [
      { who: 'max', text: 'Let the incumbent match the best offer? Libby gets my price and keeps her favourite. Clever!' },
      { who: 'libby', text: 'Clever once. Think about what it teaches you and Supplier C for next time.' }
    ],
    cam: SORTC,
    task: sortTask(2, 'bin-protect', "It feels like a bargain today, but challengers learn their bids only set the incumbent's price. Next time they won't bother.",
      "Right. Challengers learn their bids only set the incumbent's price, so next time they won't bother."),
    async enter(api) { await api.setup(SORT(2, [1, 2])); api.faces('grin', 'think'); },
    async done(api) { await sortDone(2)(api); api.faces('worried', 'happy'); }
  },
  {
    id: 'sort-last', title: 'Three left: spot the leak',
    lines: [
      { who: 'libby', text: 'Last three habits. Two of them protect value and one leaks.' },
      { who: 'max', text: 'Get this right and my valve opens again. No pressure!' }
    ],
    cam: SORTC,
    task: { choice: { q: 'Which of these habits leaks value?', options: [
      { text: 'Suppliers are told exactly how the winner will be chosen', why: 'That one protects value. If suppliers know what wins, they can aim for it.' },
      { text: 'Quality differences between suppliers are priced in money before bidding', why: 'That one protects value. Priced differences mean suppliers can compare offers like for like.' },
      { text: 'The final decision meeting happens after negotiations close', ok: true, why: "Right. That's the classic leak: the offers don't bind the decision. The other two plug holes." }
    ] } },
    async enter(api) { await api.setup(SORT(3, [1, 2, 4])); api.faces('think', 'happy'); },
    async done(api) {
      await api.toss('bin-leak');
      await api.plug(HABITS[3].plug);
      await api.openValve();
      api.setFlow(FULL_FLOW); api.lean(false);
      api.faces('grin', 'happy');
      await Promise.all([api.fill(1, 1600), api.hop('max', SPOTS.sort, 800)]);
    }
  },
  {
    id: 'end', title: 'A tank that holds',
    lines: [
      { who: 'max', text: 'Valve open, pipes running, and my best price can actually win!' },
      { who: 'libby', text: 'Because the rules come first. Next we write them into a <b>Rulebook</b>, signed by everyone who could veto, before anyone bids.' }
    ],
    summary: [
      'Most tenders decide <b>after</b> the bids, so suppliers learn to hold back.',
      'The traditional process <b>favours the incumbent</b>, gives suppliers no reason to move, and lets <b>the loudest voice</b> win.',
      'The fix is to <b>set the rules before anyone bids</b>: decide first, then bid.'
    ],
    cam: OVER, task: null,
    async enter(api) {
      await api.setup(SEND);
      api.faces('grin', 'happy'); api.poses('wave', 'idle');
      ['eng', 'qual', 'fin'].forEach(k => api.chars[k].face('happy'));
      api.chars.supc.face('happy');
    }
  }
];
