/* 3D mini-lesson: Four formats in one grid. Course: Auctions Decoded, lesson "Four formats in one grid" (the preview).
   One painting, three bidders, four rule books laid out as a 2x2 grid on the floor: open or sealed, and pay your bid or
   pay the runner-up. Max values the painting at £900, Libby at £700, Ash at £500. English and second-price both cost
   Max £700; Dutch and first-price both cost him £750, so the twins show up in the numbers. Then the grid flips for
   buying: Libby runs the lesson's reverse ticker (£1 a step) and the format zoo closes it out. */
import { stage, scenery, prop, cast, V, THREE, box, animate, CAST } from './kit.js';

export const meta = {
  id: 'four-formats',
  title: 'Four formats',
  course: 'auctions', lesson: 'four-formats',
  minutes: 7
};

/* ---------- The lesson's numbers ---------- */
const VALUE = { max: 900, libby: 700, ash: 500 };                    // what the painting is worth to each bidder
const FIG = {                                                          // what each one writes in the envelope
  first: { max: 750, libby: 600, ash: 400 },                          // pay your bid: everyone shades
  second: { max: 900, libby: 700, ash: 500 }                          // pay the runner-up: everyone writes their value
};
const COST = { max: 40, ash: 47 };                                     // reverse ticker: cost per frame
const NAME = { max: 'Max', libby: 'Libby', ash: 'Ash' };
const COL = { max: '#3F7D5C', libby: '#D6A33E', ash: '#9A958C' };
const BIDDERS = ['max', 'libby', 'ash'];

/* ---------- Layout ---------- */
const HOME = { max: [-1.3, -1.4], libby: [1.3, -1.4], ash: [3.9, -1.4] };
const BUYER = [6.4, -3.3];                                             // where Libby stands once she's the buyer
const EASEL = [0, -6.4], BOARD_AT = [4.4, -6.3], CLOCK_AT = [8.1, -6.3], TABLE_AT = [-3.6, -5.4], PODIUM_AT = [-7.3, -5.0];
const ENV_X = { max: -.3, libby: .65, ash: 1.6 };                      // envelope spots along the table
const GX = [-2.8, 2.8], GZ = [2.6, 6.0];                               // grid: column x (open, sealed), row z (pay bid, pay runner-up)
const OPEN = 2.95;                                                     // how far a rule book's cover swings open

const FMT = {
  dutch: { r: 0, c: 0, name: 'Dutch', rev: 'Reverse Dutch', cover: 'bad' },
  first: { r: 0, c: 1, name: 'First-price sealed', rev: 'Reverse first-price', cover: 'water' },
  english: { r: 1, c: 0, name: 'English', rev: 'Reverse English', cover: 'accent' },
  second: { r: 1, c: 1, name: 'Second-price sealed', rev: 'Reverse second-price', cover: 'gold' }
};
const IDS = ['dutch', 'first', 'english', 'second'];
const ZOO = [
  ['zoo-ticker', 'English ticker', 'accent'], ['zoo-outcry', 'Open outcry', 'water'], ['zoo-fixed', 'Fixed-price', 'gold'],
  ['zoo-true', 'True Price', 'wood'], ['zoo-combo', 'Combinatorial', 'bad'], ['zoo-anglo', 'Anglo-Dutch', 'muted']
];

const ASH = { ...CAST.detective, name: 'Ash', role: 'The third bidder', hair: '#5B4A3B', top: '#8E9899', topDark: '#727B7C',
  trousers: '#4A4C50', coat: false, hat: null, moustache: false, height: 1 };
const AUCTIONEER = { ...CAST.detective, name: 'Auctioneer', role: 'Runs the rule book', top: '#8C8478', topDark: '#6E675D',
  hat: null, moustache: false };

const gbp = n => '£' + (n >= 1000 ? Math.floor(n / 1000) + ',' + String(n % 1000).padStart(3, '0') : n);
const tick = ms => animate(ms, () => {});
const cyl = (rt, rb, h, m, x = 0, y = 0, z = 0, seg = 28) => {
  const c = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), m); c.position.set(x, y + h / 2, z); return c;
};
const ball = (r, m, x, y, z) => { const s = new THREE.Mesh(new THREE.SphereGeometry(r, 24, 16), m); s.position.set(x, y, z); return s; };
const disc = (r, m, x, y, z, half = false) => {
  const d = new THREE.Mesh(new THREE.CircleGeometry(r, 36, 0, half ? Math.PI : Math.PI * 2), m); d.position.set(x, y, z); return d;
};

export function build(w) {
  const M = r => w.mat(r);
  const api = { mode: 'intro', reverse: false, price: 100, clockPrice: 1200, envFig: null, stillIn: [...BIDDERS], sold: null, named: [], tok: 0 };

  stage(w, { width: 26, depth: 18 });

  /* ---------- The saleroom: carpet, a back wall with a picture rail, two plants ---------- */
  const room = new THREE.Group();
  room.add(box(23, .04, 7.6, M('floor'), 0, 0, -4.8, .3));
  room.add(box(24, 4.8, .3, M('surface'), 0, 0, -8.45));
  room.add(box(24, .45, .36, M('wood'), 0, 0, -8.42));
  room.add(box(24, .1, .38, M('wood'), 0, 3.5, -8.42));
  for (const [x, wd, ht, art] of [[-10.2, 1.7, 1.3, 'water'], [11, 1.2, 1.6, 'accent']]) {
    room.add(box(wd, ht, .08, M('gold'), x, 1.7, -8.24));
    room.add(box(wd - .3, ht - .3, .04, M(art), x, 1.85, -8.18));
  }
  for (const x of [-11.2, 11.3]) {
    room.add(cyl(.42, .32, .75, M('wood'), x, 0, -7.2));
    [[0, 1.15, 0, .5], [-.25, 1.5, .1, .38], [.25, 1.55, -.05, .4], [0, 1.85, 0, .32]].forEach(([dx, y, dz, r]) => room.add(ball(r, M('accent'), x + dx, y, -7.2 + dz)));
  }
  // podium with a gavel on top
  room.add(box(1.5, 1.2, .9, M('wood'), PODIUM_AT[0], 0, PODIUM_AT[1]));
  room.add(box(1.75, .1, 1.1, M('wood'), PODIUM_AT[0], 1.2, PODIUM_AT[1]));
  room.add(box(1.05, .7, .02, M('gold'), PODIUM_AT[0], .25, PODIUM_AT[1] + .46));
  // the long table the sealed box sits on
  room.add(box(4, .08, 1.3, M('wood'), TABLE_AT[0], .85, TABLE_AT[1]));
  for (const [dx, dz] of [[-1.85, -.55], [1.85, -.55], [-1.85, .55], [1.85, .55]]) room.add(box(.1, .85, .1, M('wood'), TABLE_AT[0] + dx, 0, TABLE_AT[1] + dz));
  scenery(w, room);

  const gavel = new THREE.Group();
  gavel.add(box(.55, .05, .05, M('wood'), .27, 0, 0));
  const gh = new THREE.Mesh(new THREE.CylinderGeometry(.08, .08, .3, 16), M('ink')); gh.rotation.x = Math.PI / 2; gh.position.set(.55, .06, 0); gavel.add(gh);
  gavel.position.set(PODIUM_AT[0] - .1, 1.31, PODIUM_AT[1] + .2); gavel.rotation.y = -.4;
  scenery(w, gavel);
  api.bang = async () => {
    await animate(200, k => { gavel.rotation.z = .8 * k; });
    await animate(140, k => { gavel.rotation.z = .8 * (1 - k); });
  };

  /* ---------- The painting on its easel (it turns into a "wanted" notice when Libby is buying) ---------- */
  const easel = new THREE.Group();
  const ew = M('wood');
  for (const [x, rz] of [[-.8, -.1], [.8, .1]]) { const l = box(.1, 4.3, .1, ew, x, 0, .15); l.rotation.z = rz; easel.add(l); }
  const back = box(.1, 4.2, .1, ew, 0, 0, -.55); back.rotation.x = .16; easel.add(back);
  easel.add(box(2.4, .1, .32, ew, 0, 1.85, .2));
  const canvasG = new THREE.Group(); canvasG.position.set(0, 0, .2); easel.add(canvasG);
  canvasG.add(box(2.8, 2.2, .12, M('gold'), 0, 1.95, 0));
  canvasG.add(box(2.5, 1.9, .04, M('paper'), 0, 2.1, .07));
  const art = new THREE.Group(); canvasG.add(art);
  art.add(box(2.5, 1.4, .02, M('water'), 0, 2.6, .1));
  art.add(disc(.24, M('bad'), .7, 3.5, .115));
  art.add(disc(.8, M('accent'), -.4, 2.1, .12, true));
  art.add(disc(.62, M('wood'), .58, 2.1, .125, true));
  const notice = new THREE.Group(); canvasG.add(notice);
  notice.add(box(2.2, 1.7, .03, M('paper'), 0, 2.2, .12));
  notice.add(box(1.5, .2, .02, M('ink'), 0, 3.5, .15));
  for (let k = 0; k < 4; k++) notice.add(box(k === 3 ? 1 : 1.7, .07, .02, M('muted'), k === 3 ? -.35 : 0, 3.1 - k * .28, .15));
  notice.add(box(.5, .4, .02, M('gold'), .6, 2.35, .15));
  notice.visible = false;
  easel.position.set(EASEL[0], 0, EASEL[1]);
  const painting = prop(w, 'painting', easel, 'The painting', 4.75);
  api.spinCanvas = async toNotice => {
    let swapped = false;
    await animate(800, k => {
      canvasG.rotation.y = k * Math.PI * 2;
      if (k > .5 && !swapped) { swapped = true; art.visible = !toNotice; notice.visible = toNotice; }
    });
    canvasG.rotation.y = 0;
  };

  /* ---------- Max, Libby, Ash and the auctioneer ---------- */
  const cs = cast(w, {
    max: HOME.max, libby: HOME.libby,
    ash: { spec: ASH, at: HOME.ash },
    auctioneer: { spec: AUCTIONEER, at: [PODIUM_AT[0], PODIUM_AT[1] - .95] }
  });
  Object.assign(api, cs);
  const C = cs.chars;

  // a paddle in each bidder's right hand: down by the knee, or up in front
  const PD = { p: V(.34, .7, .08), rx: Math.PI * .9, rz: 0 }, PU = { p: V(.32, 1.0, .46), rx: 0, rz: -.3 };
  const paddles = {};
  for (const b of BIDDERS) {
    const p = new THREE.Group();
    p.add(cyl(.03, .035, .55, M('wood')));
    const face = new THREE.Mesh(new THREE.CylinderGeometry(.24, .24, .04, 32), w.mat(COL[b])); face.rotation.x = Math.PI / 2; face.position.y = .72; p.add(face);
    p.add(disc(.11, M('paper'), 0, .72, .025));
    p.traverse(o => { if (o.isMesh) o.castShadow = true; });
    C[b].root.add(p); paddles[b] = p;
  }
  const setPad = (b, up) => {
    const s = up ? PU : PD, p = paddles[b];
    p.position.copy(s.p); p.rotation.set(s.rx, 0, s.rz); p.userData.up = up;
    C[b].pose(up ? 'point' : 'idle');
  };
  api.paddle = async (b, up, ms = 320) => {
    const p = paddles[b], from = p.position.clone(), rx0 = p.rotation.x, rz0 = p.rotation.z, s = up ? PU : PD;
    C[b].pose(up ? 'point' : 'idle'); p.userData.up = up;
    await animate(ms, k => { p.position.lerpVectors(from, s.p, k); p.rotation.x = rx0 + (s.rx - rx0) * k; p.rotation.z = rz0 + (s.rz - rz0) * k; });
  };

  // Walk or hop everyone to where this step needs them (home unless told otherwise). at[who] = [x, z] or [x, z, y].
  api.place = async (at = {}) => {
    await Promise.all(['max', 'libby', 'ash'].map(b => {
      const t = at[b] || HOME[b], r = C[b].root.position, y = t[2] === undefined ? .02 : t[2];
      return Math.hypot(r.x - t[0], r.z - t[1]) > .05 || Math.abs(r.y - y) > .05 ? cs.hop(b, t, 700) : null;
    }));
  };

  /* ---------- Price board (English, and later Libby's reverse ticker) ---------- */
  const bd = new THREE.Group();
  for (const x of [-1.05, 1.05]) bd.add(box(.1, 1.75, .1, M('ink'), x, 0, 0));
  bd.add(box(2.7, 2.7, .1, M('wood'), 0, 1.6, -.05));
  bd.add(box(2.45, 2.45, .12, M('mask'), 0, 1.72, .02));
  bd.add(box(.07, 1.55, .03, M('muted'), -.85, 1.95, .1));
  for (let k = 0; k <= 4; k++) bd.add(box(.22, .03, .03, M('muted'), -.85, 1.95 + k * .38, .1));
  const marker = box(.34, .14, .06, M('accent'), -.85, 1.95, .13); bd.add(marker);
  bd.add(box(1.2, .9, .02, M('surface'), .35, 2.55, .09));          // a little window behind the bidder lamps
  const lamps = {};
  BIDDERS.forEach((b, n) => { lamps[b] = ball(.13, w.mat(COL[b]), -.05 + n * .4, 3.0, .14); bd.add(lamps[b]); });
  bd.position.set(BOARD_AT[0], 0, BOARD_AT[1]);
  const board = prop(w, 'board', bd, '£100', 4.6);
  const setPrice = p => {
    api.price = p;
    board.label.set(api.reverse ? gbp(p) + ' a frame' : gbp(p));
    const f = api.reverse ? (p - 40) / 20 : p / 1000;
    marker.position.y = 1.95 + Math.max(0, Math.min(1, f)) * 1.52;
  };
  api.lamp = (b, on) => {
    lamps[b].material.color.set(on ? COL[b] : '#4A4943');
    api.stillIn = on ? [...new Set([...api.stillIn, b])] : api.stillIn.filter(x => x !== b);
  };
  // Step the price from one figure to another, calling onStep at each one (for drop-outs). Stops if the step changes.
  api.run = async (from, to, step, ms, onStep) => {
    const tok = api.tok;
    for (let p = from; step > 0 ? p <= to : p >= to; p += step) {
      if (tok !== api.tok) return false;
      setPrice(p);
      if (onStep) await onStep(p);
      await tick(ms);
    }
    return tok === api.tok;
  };

  /* ---------- The Dutch clock ---------- */
  const ck = new THREE.Group();
  ck.add(cyl(.5, .6, .12, M('ink')));
  ck.add(cyl(.07, .07, 1.95, M('ink')));
  const dial = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.15, .14, 48), M('paper')); dial.rotation.x = Math.PI / 2; dial.position.y = 3; ck.add(dial);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(1.15, .07, 10, 48), M('gold')); rim.position.y = 3; ck.add(rim);
  for (let k = 0; k < 12; k++) {
    const a = k / 12 * Math.PI * 2, t = new THREE.Mesh(new THREE.BoxGeometry(.05, k % 3 ? .12 : .22, .03), M('ink'));
    t.position.set(Math.sin(a) * .95, 3 + Math.cos(a) * .95, .09); t.rotation.z = -a; ck.add(t);
  }
  const hand = new THREE.Group(); hand.position.set(0, 3, .1); ck.add(hand);
  hand.add(box(.08, .9, .04, M('bad'), 0, 0, 0));
  hand.add(ball(.09, M('bad'), 0, 0, 0));
  ck.position.set(CLOCK_AT[0], 0, CLOCK_AT[1]);
  const clock = prop(w, 'clock', ck, '£1,200', 4.6);
  const setClock = p => { api.clockPrice = p; clock.label.set(gbp(p)); hand.rotation.z = -(1 - p / 1200) * Math.PI * 2; };
  api.fall = async (from, to, ms) => {
    const tok = api.tok;
    await animate(ms, (k, t) => { if (tok === api.tok) setClock(Math.round((from + (to - from) * t) / 10) * 10); });
    return tok === api.tok;
  };

  /* ---------- The sealed box and three envelopes ---------- */
  const bx = new THREE.Group();
  bx.add(box(.9, .75, .8, M('raised'), 0, .93, 0));
  bx.add(box(.98, .06, .88, M('ink'), 0, 1.68, 0));
  bx.add(box(.5, .02, .08, M('mask'), 0, 1.74, 0));
  bx.add(box(.92, .14, .02, M('accent'), 0, 1.25, .41));
  bx.position.set(TABLE_AT[0] - 1.4, 0, TABLE_AT[1]);
  prop(w, 'ballot', bx, 'Sealed box', 2.3);
  const SLOT = V(TABLE_AT[0] - 1.4, 1.85, TABLE_AT[1]);
  const handPos = b => { const r = C[b].root.position; return V(r.x + .45, 1.05, r.z + .45); };
  const tablePos = b => V(TABLE_AT[0] + ENV_X[b], .93, TABLE_AT[1] + .2);
  const envs = {};
  for (const b of BIDDERS) {
    const g = new THREE.Group();
    g.add(box(.62, .03, .42, M('paper'), 0, 0, 0));
    for (const s of [-1, 1]) { const f = box(.4, .006, .025, M('muted'), s * .15, .03, -.08); f.rotation.y = s * .55; g.add(f); }
    g.add(cyl(.07, .07, .02, w.mat(COL[b]), 0, .03, .04));
    envs[b] = prop(w, 'env-' + b, g, '?', b === 'libby' ? .8 : .45);
  }
  const envLabel = (b, on) => { envs[b].label.obj.visible = on; envs[b].label.el.hidden = !on; };
  const fly = (obj, from, to, ms, arc, rx0, rx1) => animate(ms, k => {
    obj.position.lerpVectors(from, to, k); obj.position.y += Math.sin(k * Math.PI) * arc; obj.rotation.x = rx0 + (rx1 - rx0) * k;
  });
  const payLbl = w.label(null, '', V(TABLE_AT[0] + .4, 2.5, TABLE_AT[1]), 'sign');
  api.pay = text => { payLbl.set(text || ''); payLbl.obj.visible = !!text; payLbl.el.hidden = !text; };
  // Envelopes go from each bidder's hand into the box, then the auctioneer lays them out on the table
  api.collect = async figs => {
    const tok = api.tok; api.envFig = null;
    for (const b of BIDDERS) { const e = envs[b]; e.show(true); envLabel(b, false); e.obj.position.copy(handPos(b)); e.obj.rotation.set(-1.25, 0, 0); }
    for (const b of BIDDERS) {
      if (tok !== api.tok) return;
      C[b].pose('point');
      await fly(envs[b].obj, handPos(b), SLOT, 650, 1.4, -1.25, -Math.PI / 2);
      envs[b].show(false); C[b].pose('idle');
    }
    if (tok !== api.tok) return;
    cs.say('auctioneer', 'Envelopes in. Opening the box!', 1600);
    await tick(700);
    api.envFig = figs;
    for (const b of BIDDERS) {
      if (tok !== api.tok) return;
      const e = envs[b]; e.obj.visible = true; e.label.set(gbp(figs[b]));
      await fly(e.obj, SLOT, tablePos(b), 520, 1, -Math.PI / 2, 0);
      envLabel(b, true);
    }
  };
  api.lift = (b, dx = 0, dy = .6) => { const o = envs[b].obj, from = o.position.clone(), to = tablePos('max').add(V(dx, dy, 0)); return fly(o, from, to, 500, .3, 0, -.9); };

  /* ---------- The floor grid: four rule books ---------- */
  const gridBase = box(12.2, .1, 7.2, M('surface'), 0, 0, 4.3, .35);
  gridBase.receiveShadow = true; gridBase.userData.noPick = true; w.scene.add(gridBase);
  const cells = {}, hinges = {};
  for (const id of IDS) {
    const f = FMT[id], g = new THREE.Group();
    g.add(box(5, .12, 3, M('raised'), 0, 0, 0, .25));
    // the rule book: back cover, pages, and a cover on a hinge
    const bk = new THREE.Group(); bk.position.set(.4, .12, -.15); g.add(bk);
    bk.add(box(1.7, .08, 1.2, M(f.cover), 0, 0, 0, .05));
    bk.add(box(1.6, .22, 1.1, M('paper'), .02, .08, 0));
    for (let k = 0; k < 4; k++) bk.add(box(1.1, .01, .05, M('muted'), .05, .3, -.35 + k * .22));
    const hinge = new THREE.Group(); hinge.position.set(-.85, .3, 0); bk.add(hinge);
    hinge.add(box(1.7, .08, 1.2, M(f.cover), .85, 0, 0, .05));
    hinge.add(box(.9, .02, .24, M('paper'), .85, .08, -.25));
    hinges[id] = hinge;
    // a little sign of how this format works
    const ic = new THREE.Group(); ic.position.set(1.85, .12, -.1); g.add(ic);
    if (id === 'english') { ic.add(cyl(.07, .07, .5, M('ink'))); const tip = new THREE.Mesh(new THREE.ConeGeometry(.2, .3, 20), M('ink')); tip.position.y = .65; ic.add(tip); }
    if (id === 'dutch') {
      const d = new THREE.Mesh(new THREE.CylinderGeometry(.34, .34, .06, 32), M('paper')); d.rotation.x = Math.PI / 2; d.position.y = .5; ic.add(d);
      ic.add(cyl(.04, .04, .16, M('ink'))); const hd = box(.05, .25, .03, M('bad'), 0, .5, .04); hd.rotation.z = -2.2; ic.add(hd);
    }
    if (id === 'first' || id === 'second') {
      const n = id === 'first' ? 1 : 2;
      for (let k = 0; k < n; k++) {
        const e = box(.62, .42, .03, M('paper'), k * .22, 0, -k * .18); e.rotation.x = -.25; ic.add(e);
        const s = new THREE.Mesh(new THREE.CylinderGeometry(.06, .06, .02, 16), M('bad')); s.rotation.x = Math.PI / 2 - .25; s.position.set(k * .22, .2, .06 - k * .18); ic.add(s);
      }
    }
    g.position.set(GX[f.c], .1, GZ[f.r]);
    cells[id] = prop(w, 'fmt-' + id, g, '?', .5);
    cells[id].label.obj.position.set(0, .45, 1.3);
  }
  const colLbl = ['Open', 'Sealed'].map((t, c) => w.label(null, t, V(GX[c], .3, .45), 'axis'));
  const rowLbl = ['Pay your bid', 'Pay the runner-up'].map((t, r) => w.label(null, t, V(-6.8, .3, GZ[r]), 'axis row'));

  // the two signposts with the sorting questions
  const posts = {};
  for (const [key, z, text, a, b] of [['q-see', 2.3, 'Open or sealed?', 'paper', 'mask'], ['q-pay', 5.9, 'Pay what?', 'gold', 'water']]) {
    const g = new THREE.Group();
    g.add(cyl(.07, .07, 2.2, M('wood')));
    g.add(cyl(.32, .38, .1, M('wood')));
    g.add(box(2.2, .9, .08, M('ink'), 0, 1.3, .02));
    g.add(box(.98, .7, .02, M(a), -.52, 1.4, .07));
    g.add(box(.98, .7, .02, M(b), .52, 1.4, .07));
    g.position.set(8.9, 0, z);
    posts[key] = prop(w, key, g, text, 2.65);
  }

  // the twin bridges: one along each row, from one format's sign to its twin's
  const twins = {};
  for (const [key, r, role] of [['twin-bid', 0, 'gold'], ['twin-runner', 1, 'accent']]) {
    const g = new THREE.Group(), m = M(role);
    const arc = new THREE.Mesh(new THREE.TorusGeometry(2.8, .1, 10, 64, Math.PI), m); arc.scale.y = .55; g.add(arc);
    for (const x of [-2.8, 2.8]) g.add(ball(.17, m, x, 0, 0));
    g.position.set(1.85 + GX[0] + 2.8, .85, GZ[r] - .1);
    twins[key] = prop(w, key, g, 'Twins', 1.95);
  }

  // the format zoo: six more rule books standing along the front edge
  const zoo = ZOO.map(([key, text, role], n) => {
    const g = new THREE.Group();
    g.add(box(1.25, 1.5, .32, M(role), 0, 0, 0));
    g.add(box(.9, .24, .02, M('paper'), 0, 1.0, .17));
    g.add(box(.6, .05, .02, M('paper'), 0, .55, .17));
    g.position.set(-5.5 + n * 2.2, 0, 8.45);
    const p = prop(w, key, g, text, n % 2 ? 2.4 : 1.95);
    return p;
  });
  const fade = (obj, on) => obj.traverse(o => { if (o.isMesh) { o.material.transparent = true; o.material.opacity = on ? 1 : .25; } });
  api.spotCells = ids => IDS.forEach(id => fade(cells[id].obj, !ids || ids.includes(id)));
  api.spotZoo = keys => zoo.forEach((z, n) => fade(z.obj, !keys || keys.includes(ZOO[n][0])));

  const budgetLbl = w.label(null, 'Budget: £2m, frozen', V(0, 3.3, 8.45), 'sign');
  api.budget = on => { budgetLbl.obj.visible = on; budgetLbl.el.hidden = !on; };

  const gridOn = on => {
    gridBase.visible = on;
    IDS.forEach(id => cells[id].show(on));
    [...colLbl, ...rowLbl].forEach(l => { l.obj.visible = on; l.el.hidden = !on; });
    Object.values(posts).forEach(p => p.show(on));
  };
  const labelCells = () => IDS.forEach(id => cells[id].label.set(api.reverse ? FMT[id].rev : api.named.includes(id) ? FMT[id].name : '?'));
  const axisText = () => {
    rowLbl[0].set(api.reverse ? 'Paid your bid' : 'Pay your bid');
    rowLbl[1].set(api.reverse ? 'Paid the runner-up\'s' : 'Pay the runner-up');
  };
  const castNames = () => {
    cs.name('max', api.reverse ? 'Max · supplier' : 'Max');
    cs.name('ash', api.reverse ? 'Ash · supplier' : 'Ash');
    cs.name('libby', api.reverse ? 'Libby · buyer' : 'Libby');
  };

  /* ---------- Moves the tour uses ---------- */
  api.raiseGrid = async () => {
    gridOn(true);
    gridBase.scale.set(.001, 1, .001);
    IDS.forEach(id => cells[id].obj.scale.set(.001, .001, .001));
    await animate(500, k => gridBase.scale.set(k, 1, k));
    await Promise.all(IDS.map((id, n) => tick(n * 140).then(() => animate(480, k => cells[id].obj.scale.set(k, k, k)))));
  };
  api.openBook = (id, on = true, ms = 650) => {
    const h = hinges[id], from = h.rotation.z, to = on ? OPEN : 0;
    return animate(ms, k => { h.rotation.z = from + (to - from) * k; });
  };
  api.nameBook = (id, on = true) => { if (on && !api.named.includes(id)) api.named.push(id); labelCells(); };
  api.flip = async () => {
    const tok = api.tok;
    api.reverse = true;
    await Promise.all([
      api.spinCanvas(true),
      ...IDS.map((id, n) => tick(n * 170).then(() => animate(900, k => {
        if (tok !== api.tok) return;
        cells[id].obj.rotation.x = k * Math.PI * 2; cells[id].obj.position.y = .1 + Math.sin(k * Math.PI) * 1.4;
        if (k > .5) cells[id].label.set(FMT[id].rev);
      })))
    ]);
    painting.label.set('Wanted: 500 frames');
    axisText(); castNames();
    lamps.libby.visible = false; api.stillIn = ['max', 'ash'];
    setPrice(60);
  };
  api.growTwins = async () => {
    Object.values(twins).forEach(t => { t.show(true); t.obj.scale.set(.001, 1, 1); });
    await animate(800, k => Object.values(twins).forEach(t => t.obj.scale.set(Math.max(.001, k), 1, 1)));
  };
  api.popZoo = async () => {
    zoo.forEach(z => { z.show(true); z.obj.scale.set(1, .001, 1); });
    for (const z of zoo) await animate(260, k => z.obj.scale.set(1, Math.max(.001, k), 1));
  };
  api.bobZoo = () => Promise.all(zoo.map((z, n) => tick(n * 110).then(() => animate(520, k => { z.obj.position.y = Math.sin(k * Math.PI) * .45; }))));
  api.raiseZoo = key => {
    const z = zoo[ZOO.findIndex(x => x[0] === key)];
    return animate(900, k => { z.obj.position.y = Math.sin(k * Math.PI / 2) * .7; z.obj.rotation.y = k * Math.PI * 2; });
  };
  api.sold = null;
  api.sell = (text, price) => { api.sold = price; painting.label.set(text); };

  /* Put the whole scene into a known state, instantly, so any step can be opened directly. */
  api.reset = (o = {}) => {
    api.tok++;
    api.mode = o.mode || 'intro'; api.reverse = !!o.reverse; api.sold = null; api.envFig = null;
    gridOn(!!o.grid); gridBase.scale.set(1, 1, 1);
    api.named = [...(o.named || [])];
    IDS.forEach(id => { const c = cells[id].obj; c.rotation.x = 0; c.position.y = .1; c.scale.set(1, 1, 1); hinges[id].rotation.z = (o.open || []).includes(id) ? OPEN : 0; });
    labelCells(); axisText(); api.spotCells(null);
    Object.values(twins).forEach(t => { t.show(!!o.twins); t.obj.scale.set(1, 1, 1); });
    zoo.forEach(z => { z.show(!!o.zoo); z.obj.scale.set(1, 1, 1); z.obj.position.y = 0; z.obj.rotation.y = 0; });
    api.spotZoo(null); api.budget(false);
    board.show(!!o.board); clock.show(!!o.clock);
    setPrice(api.reverse ? 60 : 100); setClock(1200);
    BIDDERS.forEach(b => { envs[b].show(false); envs[b].obj.rotation.set(0, 0, 0); });
    api.pay(null);
    art.visible = !api.reverse; notice.visible = api.reverse; canvasG.rotation.y = 0;
    painting.label.set(api.reverse ? 'Wanted: 500 frames' : 'The painting');
    castNames();
    cs.clearThoughts(); cs.faces('happy'); cs.poses('idle');
    C.ash.face('happy'); C.auctioneer.face('happy'); C.ash.pose('idle'); C.auctioneer.pose('idle');
    BIDDERS.forEach(b => setPad(b, (o.up || []).includes(b)));
    lamps.libby.visible = !api.reverse;
    api.stillIn = [];
    BIDDERS.forEach(b => api.lamp(b, api.reverse ? b !== 'libby' : true));
    gavel.rotation.z = 0;
  };
  api.reset({});
  return api;
}

/* ---------- State cards ---------- */
const RULE = {
  intro: ['Not chosen yet', 'Four rule books on the floor'],
  english: ['English', 'Price climbs in £100 steps. Last paddle up wins, at that price'],
  dutch: ['Dutch', 'Clock falls from £1,200. First to press wins, at the price showing'],
  first: ['First-price sealed', 'Highest envelope wins and pays its own figure'],
  second: ['Second-price sealed', 'Highest envelope wins and pays the next figure down'],
  twins: ['All four, side by side', 'Same painting, same three bidders'],
  reverse: ['Reverse auctions', 'Suppliers compete to sell to Libby'],
  ticker: ['Reverse English ticker', 'Price falls £1 a step. Last supplier in wins, at that price'],
  zoo: ['The format zoo', 'More names buyers use in practice'],
  animal: ['The format zoo', 'More names buyers use in practice'],
  end: ['All four, side by side', 'Same painting, same three bidders']
};
const BOOK = {
  dutch: {
    see: 'Yes: a public clock falls', pays: 'Its own bid: the price when it pressed', paid: 'Pressed at £750',
    text: 'Waiting is the gamble. Every second the price falls, but a rival might press first. So you pick a number in your head and press when the clock gets there.',
    rev: { moves: 'Price rises from low', wins: 'First supplier to accept', paid: 'The price showing when it accepted', text: 'The buyer starts low and raises the price until the first supplier accepts.' }
  },
  first: {
    see: 'No: one hidden envelope each', pays: 'Its own bid: what it wrote', paid: 'Wrote £750',
    text: 'You never see the others, so you write one number and pay it if you win. Write your full value and winning gains you nothing.',
    rev: { moves: 'One sealed offer each', wins: 'The lowest offer', paid: 'Its own offer', text: 'Lowest sealed offer wins and is paid exactly what it asked.' }
  },
  english: {
    see: 'Yes: a rising price, paddles in view', pays: 'About the runner-up\'s value: where the last rival quit', paid: 'Paid £700',
    text: 'You stay in while the price is below your value. The price stops when the second-to-last bidder gives up, so the runner-up sets it.',
    rev: { moves: 'Price falls, suppliers drop out', wins: 'The last supplier standing', paid: 'The price where the second-to-last dropped out', text: 'The price falls, suppliers drop out, and the last one standing wins at that price. Libby\'s £1 ticker is one.' }
  },
  second: {
    see: 'No: one hidden envelope each', pays: 'The runner-up\'s figure', paid: 'Paid £700',
    text: 'Also called a Vickrey auction. Your envelope decides whether you win; the next one down decides how much you pay.',
    rev: { moves: 'One sealed offer each', wins: 'The lowest offer', paid: 'The second-lowest offer', text: 'Lowest sealed offer wins, but is paid the second-lowest offer.' }
  }
};
const ZOO_CARDS = {
  'zoo-ticker': { kicker: 'Zoo · open', title: 'English ticker', rows: [['Price', 'Moves in fixed steps'], ['To stay in', 'Accept each step'], ['Ends', 'When the second-to-last supplier drops']], text: 'Libby\'s £1-a-step frame auction was one of these.' },
  'zoo-outcry': { kicker: 'Zoo · open', title: 'Open outcry', rows: [['Bids', 'Suppliers type any lower offer'], ['Needs', 'An ending rule']], text: 'With no fixed steps, the auction has to say up front when and how it stops.' },
  'zoo-fixed': { kicker: 'Zoo · price frozen', title: 'Fixed-price auction', rows: [['Price', 'Frozen'], ['Suppliers compete on', 'Payment terms, warranty, service']], text: 'Nobody bids on price at all. All the competition goes into everything else.' },
  'zoo-true': { kicker: 'Zoo · price adjusted', title: 'True Price auction', rows: [['Ranks bids on', 'Quoted price plus charges minus credits'], ['So', 'A better supplier can win with a higher quote']], text: 'Suppliers still bid on price, but the ranking puts a £ value on every difference between them.' },
  'zoo-combo': { kicker: 'Zoo · bundles', title: 'Combinatorial auction', rows: [['Suppliers bid on', 'Bundles of items'], ['The buyer picks', 'The cheapest combination']], text: 'Useful when a supplier can do two lots together for less than the two apart.' },
  'zoo-anglo': { kicker: 'Zoo · hybrid', title: 'Anglo-Dutch', rows: [['Round one', 'Open, to narrow the field'], ['Round two', 'Sealed final offers']], text: 'A hybrid. Paul Klemperer\'s rule of thumb sums up the zoo: auction design is "horses for courses".' }
};

export function card(key, ctx) {
  const a = ctx.api, rev = a.reverse, R = ctx.reached;
  const paidRows = [
    ...(R('dutch') ? [['Paid in English', '£700']] : []), ...(R('first-price') ? [['Paid in Dutch', '£750']] : []),
    ...(R('second-price') ? [['Paid in first-price', '£750']] : []), ...(R('twins') ? [['Paid in second-price', '£700']] : [])
  ];
  const still = a.stillIn.length ? a.stillIn.map(b => NAME[b]).join(', ') : 'Nobody';

  if (key.startsWith('fmt-')) {
    const id = key.slice(4), f = FMT[id], b = BOOK[id], open = f.c === 0;
    if (rev) return {
      kicker: 'Rule book, flipped for buying', title: f.rev,
      rows: [['Who competes', 'Suppliers, to sell'], ['How it runs', b.rev.moves], ['Who wins', b.rev.wins], ['Winner is paid', b.rev.paid]],
      text: b.rev.text
    };
    if (!a.named.includes(id)) return {
      kicker: 'Rule book · ' + (open ? 'open' : 'sealed') + ' · ' + (f.r ? 'pay the runner-up' : 'pay your bid'), title: 'A closed rule book',
      rows: [['Can you see the other bids?', open ? 'Yes' : 'No'], ['Winner pays', f.r ? 'About the runner-up\'s price' : 'Its own bid']],
      text: 'Its column and row already tell you how it works. Max and Libby will play it soon.'
    };
    return {
      kicker: 'Rule book · ' + (open ? 'open' : 'sealed') + ' · ' + (f.r ? 'pay the runner-up' : 'pay your bid'), title: f.name,
      rows: [['Can you see the other bids?', b.see], ['Winner pays', b.pays],
        ...(R(id === 'english' ? 'dutch' : id === 'dutch' ? 'first-price' : id === 'first' ? 'second-price' : 'twins') ? [['Max', b.paid]] : []),
        ...(R('twins') ? [['Twin', { dutch: 'First-price sealed', first: 'Dutch', english: 'Second-price sealed', second: 'English' }[id]]] : [])],
      text: b.text
    };
  }
  if (ZOO_CARDS[key]) return ZOO_CARDS[key];
  if (key.startsWith('env-')) {
    const b = key.slice(4), mode = a.mode === 'second' ? 'second' : 'first', fig = a.envFig && a.envFig[b];
    return {
      kicker: 'Sealed envelope · ' + (mode === 'first' ? 'first-price' : 'second-price'), title: NAME[b] + '\'s envelope',
      rows: [['Figure inside', fig ? gbp(fig) : 'Still sealed'], ['Painting is worth to ' + NAME[b], gbp(VALUE[b])],
        ['If it wins, pays', mode === 'first' ? 'This figure' : 'The next figure down']],
      text: mode === 'first'
        ? (b === 'max' ? 'Max shaded from £900 to £750, the same figure he pressed at on the clock.' : NAME[b] + ' shaded below their value too: pay your bid means paying what you wrote.')
        : NAME[b] + ' wrote exactly what the painting is worth to them. In second-price, writing less can only lose you a painting you\'d have been glad to buy.'
    };
  }
  const C = {
    max: rev ? {
      kicker: 'Supplier · green paddle', title: 'Max',
      rows: [['Selling', 'Frames to Libby'], ['Cost per frame', gbp(COST.max)], ['Rival', 'Ash, at ' + gbp(COST.ash) + ' a frame'], ...(R('zoo') ? [['Won at', '£46 a frame']] : [])],
      text: 'He stays in while the price is above his £40 cost. Below that, every frame would lose him money.'
    } : {
      kicker: 'Bidder · green paddle', title: 'Max',
      rows: [['Painting is worth to him', gbp(VALUE.max)], ['Habit', 'Grabs the biggest number'], ...paidRows],
      text: 'Max always wants to bid his full £900. In a pay-your-bid format that wins him the painting and nothing else.'
    },
    libby: rev ? {
      kicker: 'Buyer', title: 'Libby',
      rows: [['Buying', '500 frames'], ['Starts at', '£60 a frame'], ['Each step', 'Down £1'], ['Ends', 'When one supplier is left']],
      text: 'Libby doesn\'t need to know anyone\'s cost. The falling price finds it for her.'
    } : {
      kicker: 'Bidder · gold paddle', title: 'Libby',
      rows: [['Painting is worth to her', gbp(VALUE.libby)], ['Habit', 'Shades her bid'], ['Open, rising price', 'Stays in to £700'], ['Pay your bid', 'Shades to £600']],
      text: 'In English she stays in right up to her value. Where she pays her own bid, she aims lower and keeps the gap.'
    },
    ash: rev ? {
      kicker: 'Supplier · grey paddle', title: 'Ash',
      rows: [['Cost per frame', gbp(COST.ash)], ['Stays in', 'Down to £47'], ['Drops out', 'When the ticker hits £46']],
      text: 'At £46 a frame Ash would lose £1 on every one, so out he goes.'
    } : {
      kicker: 'Bidder · grey paddle', title: 'Ash',
      rows: [['Painting is worth to him', gbp(VALUE.ash)], ['English', 'Drops out at £500'], ['Pay your bid', 'Shades to £400'], ['Second-price', 'Writes £500']],
      text: 'The third bidder. He never wins today, but he still matters: more bidders push the price up.'
    },
    auctioneer: {
      kicker: 'Runs the rule book', title: 'The auctioneer',
      rows: [['Rule book now', RULE[a.mode][0]], ['The rule', RULE[a.mode][1]]],
      text: 'The auctioneer doesn\'t bid. They announce the rules before anyone bids, then stick to them.'
    },
    painting: rev ? {
      kicker: 'What Libby is buying', title: 'Wanted: 500 frames',
      rows: [['Buyer', 'Libby'], ['Ticker starts', '£60 a frame'], ['Suppliers', 'Max and Ash'], ...(a.sold ? [['Result', 'Max wins at £46 a frame']] : [])],
      text: 'Same idea as the painting, turned around: now the suppliers compete and the price falls.'
    } : {
      kicker: 'The lot', title: 'One painting',
      rows: [['Worth to Max', gbp(VALUE.max)], ['Worth to Libby', gbp(VALUE.libby)], ['Worth to Ash', gbp(VALUE.ash)], ['Who knows these', 'Each bidder knows only their own'],
        ...(a.sold ? [['Sold to Max for', gbp(a.sold)]] : [])],
      text: 'Each bidder\'s value is their own; nobody\'s changes when they see the others bid. That\'s when the twins in this lesson hold.'
    },
    board: rev ? {
      kicker: 'Open · price falls', title: 'Libby\'s reverse ticker',
      rows: [['Price now', gbp(a.price) + ' a frame'], ['Each step', 'Down £1'], ['Still in', still], ['Ends', 'When one supplier is left']],
      text: 'Everyone can see the price move. Suppliers click to stay in at each step.'
    } : {
      kicker: 'Open · price climbs', title: 'The price board',
      rows: [['Price now', gbp(a.price)], ['Each step', 'Up £100'], ['Still in', still]],
      text: 'Each lamp is a bidder whose paddle is still up. When only one is lit, the auction is over.'
    },
    clock: {
      kicker: 'Open · price falls', title: 'The Dutch clock',
      rows: [['Price now', gbp(a.clockPrice)], ['Started at', '£1,200'], ['Who wins', 'The first to press'], ['Winner pays', 'The price on the clock']],
      text: 'Nobody else\'s bid is ever visible: the first press ends it. That\'s why it plays like a sealed envelope.'
    },
    ballot: {
      kicker: 'Sealed', title: 'The sealed box',
      rows: [['Envelopes', 'One per bidder'], ['Who can see them', 'Nobody, until it opens'], ['Rule now', a.mode === 'second' ? 'Highest wins, pays the next figure down' : 'Highest wins, pays its own figure']],
      text: 'Everyone bids once, blind. All the envelopes are opened together.'
    },
    'q-see': {
      kicker: 'Question one', title: 'Can you see the other bids?',
      rows: [['Open', 'You watch a price move'], ['Sealed', 'One hidden offer each'], ['Open formats', 'English, Dutch'], ['Sealed formats', 'First-price, second-price']],
      text: 'This splits the grid into two columns.'
    },
    'q-pay': {
      kicker: 'Question two', title: rev ? 'What is the winner paid?' : 'What does the winner pay?',
      rows: [[rev ? 'Its own offer' : 'Its own bid', 'Dutch, first-price'], [rev ? 'About the runner-up\'s price' : 'About the runner-up\'s', 'English, second-price']],
      text: 'This splits the grid into two rows. Formats in the same row turn out to be twins.'
    },
    'twin-bid': {
      kicker: 'Twins · pay your bid', title: 'Dutch and first-price',
      rows: [['Dutch clock', 'Max pressed at £750'], ['First-price envelope', 'Max wrote £750'], ['Why they match', 'Pick a number blind, then pay it']],
      text: 'On the clock you see nothing useful until someone presses, and then it\'s over. So it plays like an envelope. The twins hold when each bidder\'s value is its own; Lesson 7 shows where they break.'
    },
    'twin-runner': {
      kicker: 'Twins · pay the runner-up', title: 'English and second-price',
      rows: [['English', 'Max paid £700'], ['Second-price', 'Max paid £700'], ['Why they match', 'The winner pays what it took to beat the runner-up']],
      text: 'In English the price stops where Libby quits at £700. In second-price Libby\'s envelope says £700. Same bidder sets the price both times.'
    }
  };
  return C[key] || { kicker: '', title: key, rows: [], text: '' };
}

/* ---------- Camera presets: [position, target] for wide screens and for phones ---------- */
const ROOM = { wide: [[.6, 10.5, 18.5], [.6, 1.8, -4.3]], phone: [[.6, 17, 24], [.6, 1.5, -4]] };
const ENGLISH = { wide: [[2, 7.5, 10], [2, 2, -3.8]], phone: [[2, 11, 13], [2, 1.8, -3.8]] };
const DUTCH = { wide: [[3.8, 8.5, 12], [3.8, 2.1, -4]], phone: [[3.8, 13, 15.5], [3.8, 1.8, -4]] };
const SEALED = { wide: [[-1.8, 9.5, 13.5], [-1.8, 1.6, -4]], phone: [[-1.8, 14, 17], [-1.8, 1.4, -3.8]] };
const GRID = { wide: [[1.2, 17, 21.5], [1.2, 0, 3.8]], phone: [[1.2, 24, 23], [1.2, 0, 3.6]] };
const TICKER = { wide: [[2.8, 7.5, 10.5], [2.8, 2, -3.8]], phone: [[2.8, 11.5, 13.5], [2.8, 1.8, -3.8]] };
const ZOO_CAM = { wide: [[0, 12, 24.5], [0, .6, 5.4]], phone: [[0, 18, 27], [0, .5, 5.2]] };
const OVER = { wide: [[0, 21, 27], [0, .5, 0]], phone: [[0, 33, 35], [0, 0, .5]] };

const ALL = ['dutch', 'first', 'english', 'second'];

/* ---------- The guided tour ---------- */
export const steps = [
  {
    id: 'meet', title: 'One painting, three bidders',
    lines: [
      { who: 'max', text: 'Hi, I\'m Max! One painting, three bidders: me, Libby and Ash over there. And I really want that painting.' },
      { who: 'libby', text: 'Before anyone lifts a paddle, the rules have already shaped who wins and what they pay. So today we try four rule books.' }
    ],
    cam: ROOM, task: { click: ['painting', 'ash'], all: true, say: 'Click the painting, then Ash, the third bidder.' },
    async enter(api) {
      api.reset({});
      await api.place();
      api.chars.max.pose('wave'); api.faces('grin', 'happy');
      setTimeout(() => api.chars.max.pose('idle'), 2400);
    },
    done(api) { api.chars.ash.pose('wave'); setTimeout(() => api.chars.ash.pose('idle'), 1800); }
  },
  {
    id: 'questions', title: 'Two questions sort every format',
    lines: [
      { who: 'libby', text: 'An <b>auction</b> is a game whose rules are announced before anyone bids, and the best offer wins. No open-ended haggling.' },
      { who: 'libby', text: 'Two questions sort the rule books. Can you see the other bids? And does the winner pay its own bid, or roughly the runner-up\'s?' },
      { who: 'max', text: 'Four squares, four rule books. Which one gets me the painting cheapest?' }
    ],
    cam: GRID, task: { click: ['q-see', 'q-pay'], all: true, say: 'Click both signposts to read the two questions.' },
    async enter(api) {
      api.reset({});
      api.faces('surprised', 'happy');
      await Promise.all([api.place(), api.raiseGrid()]);
      api.chars.libby.pose('point');
    },
    done(api) { api.poses('idle'); api.faces('think', 'happy'); }
  },
  {
    id: 'english', title: 'English: the price climbs',
    lines: [
      { who: 'libby', text: 'Rule book one: <b>English</b>. The price climbs in the open, and you keep your paddle up while you\'re still in.' },
      { who: 'max', text: 'Easy. My paddle stays up till the end. It\'s worth £900 to me!' }
    ],
    cam: ENGLISH,
    task: { choice: { q: 'Ash drops out at £500. Libby will drop out at £700. What does Max pay?', options: [
      { text: '£900, what it\'s worth to him', why: 'The price never gets that high. It stops as soon as Libby lowers her paddle.' },
      { text: '£700, where Libby quits', ok: true, why: 'Right. The price stops where the last rival quit, so the runner-up sets what Max pays.' },
      { text: '£500, where Ash quits', why: 'Libby is still bidding at £500, so the price keeps climbing.' }
    ] } },
    async enter(api) {
      api.reset({ grid: true, mode: 'english', board: true });
      api.spotCells(['english']); api.nameBook('english');
      await api.place();
      await Promise.all(['max', 'libby', 'ash'].map(b => api.paddle(b, true)));
      api.faces('grin', 'happy');
      api.openBook('english');
      await api.run(100, 500, 100, 450, async p => {
        if (p === 500) { await api.paddle('ash', false); api.lamp('ash', false); api.chars.ash.face('worried'); api.chars.ash.pose('shrug'); }
      });
    },
    async done(api) {
      api.chars.ash.pose('idle');
      const ok = await api.run(600, 700, 100, 550, async p => {
        if (p === 700) { await api.paddle('libby', false); api.lamp('libby', false); api.chars.libby.pose('shrug'); }
      });
      if (!ok) return;
      await api.bang(); api.sell('Sold to Max · £700', 700);
      api.say('auctioneer', 'Sold, to Max, at £700!', 2200);
      api.chars.libby.pose('idle'); api.faces('grin', 'happy');
      await api.hop('max', [-1.3, -1.4]);
      api.paddle('max', true, 1);
    }
  },
  {
    id: 'dutch', title: 'Dutch: a clock that falls',
    lines: [
      { who: 'libby', text: 'Rule book two: <b>Dutch</b>. A clock starts high and falls. The first bidder to press wins, at the price showing.' },
      { who: 'max', text: 'It\'s worth £900 to me, so I\'ll press the second it hits £900!' }
    ],
    cam: DUTCH,
    task: { choice: { q: 'Max plans to press at £900, his full value. What happens if he does?', options: [
      { text: 'He wins and does well out of it', why: 'He wins, but he pays everything the painting is worth to him. That leaves him nothing.' },
      { text: 'He wins, but gains nothing', ok: true, why: 'Right. Here you pay your own bid, so pressing at your full value wins you nothing. Wait a bit, though not so long that a rival presses first.' },
      { text: 'Libby beats him to it', why: 'Libby values it at £700, so she won\'t press anywhere near £900.' }
    ] } },
    async enter(api) {
      api.reset({ grid: true, mode: 'dutch', clock: true, open: ['english'], named: ['english'] });
      api.spotCells(['dutch']); api.nameBook('dutch');
      await api.place();
      api.openBook('english', false); api.openBook('dutch');
      api.faces('grin', 'think');
      if (await api.fall(1200, 950, 2400)) api.think('max', 'Press at <b>£900</b>?');
    },
    async done(api) {
      api.think('max', null); api.faces('worried', 'think');
      api.say('max', 'Fine, I\'ll hold my nerve a bit longer...', 1800);
      if (!await api.fall(950, 750, 2200)) return;
      await api.paddle('max', true, 250);
      await api.bang(); api.sell('Sold to Max · £750', 750);
      api.faces('grin', 'happy');
      api.say('max', 'Pressed at £750. That\'s £150 better than £900!', 2600);
      api.think('libby', 'I\'d have pressed at <b>£600</b>');
    }
  },
  {
    id: 'first-price', title: 'Sealed: one envelope each',
    lines: [
      { who: 'libby', text: 'Rule book three: <b>first-price sealed bid</b>. One hidden envelope each, opened together. The highest wins and pays its own figure.' },
      { who: 'libby', text: 'When you pay your own bid, you <b>shade</b>: write less than it\'s worth to you, and keep the gap.' },
      { who: 'max', text: 'Learned that on the clock. I wrote £750, not £900.' }
    ],
    cam: SEALED,
    task: { pick: { answer: 'env-max', say: 'Click the envelope that wins.', wrong: {
      'env-libby': 'Libby wrote £600, below Max\'s £750.',
      'env-ash': 'Ash wrote £400, the lowest of the three.'
    }, why: 'Max\'s £750 is the highest, and in first-price he pays exactly that. The same price he paid on the Dutch clock.' } },
    async enter(api) {
      api.reset({ grid: true, mode: 'first', open: ['dutch'], named: ['english', 'dutch'] });
      api.spotCells(['first']); api.nameBook('first');
      await api.place();
      api.openBook('dutch', false); api.openBook('first');
      api.faces('think', 'happy');
      await api.collect(FIG.first);
      api.faces('happy');
    },
    async done(api) {
      await api.lift('max');
      api.pay('Max pays £750');
      await api.bang(); api.sell('Sold to Max · £750', 750);
      api.faces('grin', 'happy');
    }
  },
  {
    id: 'second-price', title: 'Sealed again: pay the runner-up',
    lines: [
      { who: 'libby', text: 'Rule book four: <b>second-price sealed bid</b>, also called Vickrey. Highest envelope wins, but pays the next figure down.' },
      { who: 'max', text: 'So I can write my full £900 and still not pay £900? Everyone writes their real value, then.' }
    ],
    cam: SEALED,
    task: { choice: { q: 'The envelopes say £900, £700 and £500. What does Max pay?', options: [
      { text: '£900, his own figure', why: 'That\'s first-price. Here the winner pays the next envelope down.' },
      { text: '£700, Libby\'s figure', ok: true, why: 'Right. His envelope decides whether he wins. The runner-up\'s envelope decides how much he pays.' },
      { text: '£800, halfway between', why: 'Nothing gets split. He pays the runner-up\'s figure exactly.' }
    ] } },
    async enter(api) {
      api.reset({ grid: true, mode: 'second', open: ['first'], named: ['english', 'dutch', 'first'] });
      api.spotCells(['second']); api.nameBook('second');
      await api.place();
      api.openBook('first', false); api.openBook('second');
      api.faces('grin', 'happy');
      await api.collect(FIG.second);
    },
    async done(api) {
      await api.lift('max');
      await api.lift('libby', .45, .3);
      api.pay('Max pays Libby\'s £700');
      await api.bang(); api.sell('Sold to Max · £700', 700);
      api.faces('grin', 'happy');
      await api.hop('max', [-1.3, -1.4]);
    }
  },
  {
    id: 'twins', title: 'Two pairs of twins',
    lines: [
      { who: 'max', text: 'Hang on. English cost me £700, and so did second-price. The clock and the first envelope both cost me £750.' },
      { who: 'libby', text: 'They\'re <b>twins</b>. English and second-price: the winner pays what it took to beat the runner-up. Dutch and first-price: pick a number blind, pay it.' }
    ],
    cam: GRID,
    task: { pick: { answer: 'fmt-second', say: 'Click the rule book that behaves like English.', wrong: {
      'fmt-dutch': 'Dutch is open like English, but there you pay your own bid. Look along the row instead.',
      'fmt-first': 'First-price makes you pay your own figure. English stops where the runner-up quits.',
      'fmt-english': 'That\'s English itself. Find its twin.'
    }, why: 'Both cost Max £700: the winner pays what it took to beat the runner-up. And Dutch and first-price both cost him £750.' } },
    async enter(api) {
      api.reset({ grid: true, mode: 'twins', open: ALL, named: ALL });
      api.faces('surprised', 'happy');
      await api.place({ max: [-1.3, 7.1, .22], libby: [-1.3, 3.7, .22] });
    },
    async done(api) {
      await api.growTwins();
      await Promise.all([api.hop('max', [4.3, 7.1, .22]), api.hop('libby', [4.3, 3.7, .22])]);
      api.faces('grin', 'happy');
      api.say('max', 'Different rules, same price. Who knew?', 2200);
    }
  },
  {
    id: 'reverse', title: 'Flip it for buying',
    lines: [
      { who: 'libby', text: 'Now flip it. In a <b>reverse auction</b> a buyer buys and suppliers compete on price. I\'m buying 500 frames.' },
      { who: 'max', text: 'So Ash and I are selling. The price goes down, and the lowest offer wins?' },
      { who: 'libby', text: 'Same four rule books, turned over. Reverse Dutch even runs the other way: the price rises until the first supplier accepts.' }
    ],
    cam: OVER, task: { click: ['fmt-english', 'fmt-dutch'], all: true, say: 'Click Reverse English and Reverse Dutch.' },
    async enter(api) {
      api.reset({ grid: true, mode: 'reverse', open: ALL, named: ALL, twins: true });
      await api.place();
      await api.flip();
      api.faces('surprised', 'happy');
      await api.walk('libby', BUYER);
    },
    done(api) { api.faces('think', 'happy'); api.think('max', 'Lowest price wins now'); }
  },
  {
    id: 'ticker', title: 'Name the format',
    lines: [
      { who: 'libby', text: 'My ticker starts at £60 a frame and falls by £1 a step. Click to stay in. It ends when only one supplier is left.' },
      { who: 'max', text: 'Each frame costs me £40 to make, and Ash £47. I\'m staying in!' }
    ],
    cam: TICKER,
    task: { choice: { q: 'A buyer runs a ticker where the price falls by £1 a step. Suppliers click to stay in. It ends when only one supplier remains. Which format is this?', options: [
      { text: 'Reverse English', ok: true, why: 'Right. Falling price, and the last supplier standing wins at that price.' },
      { text: 'Reverse Dutch', why: 'Reverse Dutch starts low and rises until the first supplier accepts.' },
      { text: 'First-price sealed bid', why: 'Nothing is sealed here: everyone sees the price move.' },
      { text: 'Fixed-price auction', why: 'In a fixed-price auction the price is frozen and suppliers compete on other terms.' }
    ] } },
    async enter(api) {
      api.reset({ grid: true, mode: 'ticker', reverse: true, board: true, open: ALL, named: ALL, up: ['max', 'ash'] });
      api.spotCells(['english']);
      await api.place({ libby: BUYER });
      api.paddle('max', true, 1); api.paddle('ash', true, 1);
      api.faces('grin', 'happy');
      await api.run(60, 52, -1, 420);
    },
    async done(api) {
      const ok = await api.run(51, 46, -1, 420, async p => {
        if (p === 46) { await api.paddle('ash', false); api.lamp('ash', false); api.chars.ash.face('worried'); api.chars.ash.pose('shrug'); }
      });
      if (!ok) return;
      await api.bang(); api.sell('Max wins at £46 a frame', 46);
      api.faces('grin', 'happy');
      await api.hop('max', [-1.3, -1.4]);
      api.paddle('max', true, 1);
      api.say('max', '£46 a frame, and each one costs me £40!', 2400);
    }
  },
  {
    id: 'zoo', title: 'The format zoo',
    lines: [
      { who: 'libby', text: 'Buyers use more names. An <b>English ticker</b> moves in fixed steps. <b>Open outcry</b> lets suppliers type any lower offer, so it needs an ending rule.' },
      { who: 'libby', text: 'A <b>fixed-price auction</b> freezes the price. A <b>True Price auction</b> ranks quoted price plus charges minus credits.' },
      { who: 'max', text: 'It\'s a whole zoo! And what are the last two, bundles and a hybrid?' }
    ],
    cam: ZOO_CAM, task: { click: ['zoo-fixed', 'zoo-true', 'zoo-anglo'], all: true, say: 'Click Fixed-price, True Price and Anglo-Dutch.' },
    async enter(api) {
      api.reset({ grid: true, mode: 'zoo', reverse: true, open: ALL, named: ALL });
      api.faces('surprised', 'happy');
      await Promise.all([api.place(), api.popZoo()]);
    },
    done(api) { api.faces('grin', 'happy'); }
  },
  {
    id: 'animal', title: 'Which animal is it?',
    lines: [
      { who: 'max', text: 'Here\'s one. The budget is fixed at £2m, and suppliers fight over warranty, payment terms and service.' },
      { who: 'libby', text: 'Price isn\'t moving at all. So which book from the zoo is it?' }
    ],
    cam: ZOO_CAM,
    task: { choice: { q: 'The budget is fixed at £2m. Suppliers compete on warranty length, payment terms and service levels. Which format is this?', options: [
      { text: 'Fixed-price auction', ok: true, why: 'Right. The price is frozen, so all the competition goes into the terms.' },
      { text: 'True Price auction', why: 'A True Price auction still has suppliers bidding on price, then adjusts for credits and charges.' },
      { text: 'Reverse English ticker', why: 'A ticker moves the price. Here the price never moves.' },
      { text: 'Combinatorial auction', why: 'There are no bundles to choose between here, just one fixed-price contract.' }
    ] } },
    async enter(api) {
      api.reset({ grid: true, mode: 'animal', reverse: true, open: ALL, named: ALL, zoo: true });
      api.budget(true);
      api.faces('think', 'happy');
      await Promise.all([api.place(), api.bobZoo()]);
    },
    async done(api) {
      api.spotZoo(['zoo-fixed']);
      await api.raiseZoo('zoo-fixed');
      api.faces('grin', 'happy'); api.chars.max.pose('cheer');
      setTimeout(() => api.chars.max.pose('idle'), 1600);
    }
  },
  {
    id: 'end', title: 'What you just learned',
    lines: [
      { who: 'max', text: 'Four rule books, one painting, and I paid either £700 or £750 every time.' },
      { who: 'libby', text: 'Next lesson, the same market ends near £0 or near £100, just from the format. See you there!' }
    ],
    summary: [
      'Two questions sort the four formats: <b>open or sealed</b>, and does the winner <b>pay its own bid or about the runner-up\'s</b>.',
      '<b>English</b> is a twin of <b>second-price</b> (Max paid £700 in both), and <b>Dutch</b> is a twin of <b>first-price</b> (£750 in both).',
      '<b>Reverse auctions</b> are the same formats with suppliers competing to sell, like Libby\'s £1-a-step ticker for frames.'
    ],
    cam: OVER, task: null,
    async enter(api) {
      api.reset({ grid: true, mode: 'end', open: ALL, named: ALL, twins: true, zoo: true, board: true, clock: true });
      await api.place();
      api.faces('happy', 'grin'); api.poses('wave', 'idle');
    }
  }
];
