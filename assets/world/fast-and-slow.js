/* 3D mini-lesson: Fast and slow thinking at the table. Course: The Psychology of the Deal, lesson "fast-and-slow".
   Same puzzle, numbers and deadline as the preview lesson in assets/courses/psychology.js, so both agree.
   A sports shop counter with a bat, a ball and a £1.10 tag. Max blurts 10p (the fast engine sparks), Libby writes it
   out (the slow engine's gears turn) and finds 5p. Then a supplier slams down a "valid until 5pm today" sign. */
import { stage, scenery, prop, cast, V, THREE, box, stack, animate, CAST } from './kit.js';

export const meta = {
  id: 'fast-and-slow',
  title: 'Fast and slow',
  course: 'psychology', lesson: 'fast-and-slow',
  minutes: 7
};

const COUNTER_Z = -3.2, TOP = 1.18;
const NOTES = ['Ball = ?', 'Bat = ball + £1', 'Ball + ball + £1 = £1.10', 'Two balls = 10p, so ball = 5p', 'Offer vs walk-away point?'];
const TILL = { idle: '£0.00', wrong: '10p + £1.10 = £1.20', right: '5p + £1.05 = £1.10' };
const SUPPLIER_DOOR = [4.7, -6.6], SUPPLIER_DESK = [-.6, -4.75];

const sph = (r, m, x = 0, y = 0, z = 0, sx = 1, sy = sx, sz = sx) => {
  const s = new THREE.Mesh(new THREE.SphereGeometry(r, 24, 16), m); s.position.set(x, y, z); s.scale.set(sx, sy, sz); return s;
};
const cyl = (rt, rb, h, m, x = 0, y = 0, z = 0, seg = 24) => {
  const c = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), m); c.position.set(x, y + h / 2, z); return c;
};
const show = (l, on) => { l.obj.visible = on; l.el.hidden = !on; };

/* A gear: a disc with teeth round the rim, facing the camera (+z). */
function gear(r, m, hubM) {
  const g = new THREE.Group();
  const disc = new THREE.Mesh(new THREE.CylinderGeometry(r, r, .14, 36), m); disc.rotation.x = Math.PI / 2; g.add(disc);
  const n = Math.max(8, Math.round(r * 20));
  for (let i = 0; i < n; i++) {
    const a = i / n * Math.PI * 2, t = new THREE.Mesh(new THREE.BoxGeometry(.15, .11, .14), m);
    t.position.set(Math.cos(a) * (r + .05), Math.sin(a) * (r + .05), 0); t.rotation.z = a; g.add(t);
  }
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(r * .26, r * .26, .2, 20), hubM); hub.rotation.x = Math.PI / 2; g.add(hub);
  for (let i = 0; i < 3; i++) {
    const a = i / 3 * Math.PI * 2, hole = new THREE.Mesh(new THREE.CylinderGeometry(r * .14, r * .14, .16, 14), hubM);
    hole.rotation.x = Math.PI / 2; hole.position.set(Math.cos(a) * r * .58, Math.sin(a) * r * .58, .01); g.add(hole);
  }
  return g;
}

/* A little hare, running towards +x. */
function hare(fur, light, dark) {
  const g = new THREE.Group();
  g.add(sph(.22, fur, 0, .22, 0, 1.45, .95, .9));
  g.add(sph(.14, fur, .3, .38, 0));
  for (const z of [-.05, .05]) {
    const ear = new THREE.Mesh(new THREE.CapsuleGeometry(.035, .22, 4, 10), fur);
    ear.position.set(.24, .62, z); ear.rotation.z = .45; g.add(ear);
  }
  g.add(sph(.025, dark, .4, .43, .09));
  g.add(sph(.07, light, -.33, .3, 0));
  g.add(sph(.07, fur, .18, .07, 0, 1, .7, 1));
  g.add(sph(.1, fur, -.16, .07, 0, 1.4, .6, .8));
  return g;
}

/* A flat lightning bolt. */
function bolt(m, s = 1) {
  const sh = new THREE.Shape();
  [[0, .5], [.24, .5], [.08, .1], [.26, .1], [-.14, -.58], [.0, -.06], [-.18, -.06]].forEach(([x, y], i) => i ? sh.lineTo(x * s, y * s) : sh.moveTo(x * s, y * s));
  sh.closePath();
  const geo = new THREE.ExtrudeGeometry(sh, { depth: .08, bevelEnabled: false }); geo.translate(0, 0, -.04);
  return new THREE.Mesh(geo, m);
}

export function build(w) {
  const { mat, label } = w;
  const api = { st: {} };
  let token = 0;
  const later = (ms, fn) => { const t = token; setTimeout(() => { if (t === token) fn(); }, ms); };
  api.begin = () => ++token;

  /* ---------- The plinth and the shop ---------- */
  stage(w, { width: 24, depth: 15, z: -1 });
  const shop = new THREE.Group();
  shop.add(box(21, .04, 12.4, mat('floor'), 0, 0, -1.6, .3));                           // shop floor
  shop.add(box(9, .05, 3.2, mat('surface'), 0, .01, 3.1, .4));                           // rug in front of the counter
  for (let i = 0; i < 5; i++) shop.add(box(.05, .055, 3.2, mat('muted'), -3.6 + i * 1.8, .01, 3.1));
  shop.add(box(20, 3.9, .35, mat('surface'), 0, 0, -7.6));                               // back wall
  shop.add(box(20, .25, .4, mat('wood'), 0, 3.9, -7.6));                                 // wall cap
  for (const y of [1.45, 2.15]) shop.add(box(7.4, .07, .5, mat('wood'), 0, y, -7.2));    // shelves
  const ballMats = ['bad', 'paper', 'gold', 'muted'].map(r => mat(r));
  for (let s = 0; s < 2; s++) for (let i = 0; i < 12; i++) {
    const r = .13 + ((i * 7 + s * 3) % 4) * .025;
    shop.add(sph(r, ballMats[(i + s) % 4], -3.3 + i * .6, (s ? 2.22 : 1.52) + r, -7.2));
  }
  const batM = mat('wood'), gripM = mat('mask');
  for (const [x, rz] of [[-4.3, .12], [-4.0, .16], [-3.75, .2]]) {             // bats leaning on the wall
    const b = new THREE.Group();
    b.add(box(.28, 1.15, .07, batM, 0, 0, 0, .04)); b.add(cyl(.045, .045, .55, gripM, 0, 1.12, 0, 10));
    b.position.set(x, 0, -7.25); b.rotation.z = rz; shop.add(b);
  }
  // back-room door, where the supplier comes from
  shop.add(box(1.5, 2.7, .08, mat('wood'), 4.6, 0, -7.4));
  const door = box(1.3, 2.55, .06, mat('raised'), 0, 0, 0); door.position.set(5.25, 0, -7.32); door.rotation.y = .25;
  door.geometry.translate(-.65, 0, 0); shop.add(door);
  shop.add(sph(.06, mat('gold'), 4.2, 1.25, -6.85));
  // the counter
  const wood = mat('wood');
  shop.add(box(7.4, 1.1, 1.5, wood, 0, 0, COUNTER_Z, .1));
  shop.add(box(7.7, .08, 1.7, mat('surface'), 0, 1.1, COUNTER_Z, .08));
  shop.add(box(7.42, .16, .04, mat('muted'), 0, .12, COUNTER_Z + .75));
  shop.add(box(7.42, .05, .04, mat('gold'), 0, .9, COUNTER_Z + .75));
  // a cricket corner: stumps and a kit bag
  const stumpM = mat('paper'), bagM = mat('muted');
  for (const dx of [-.22, 0, .22]) shop.add(cyl(.045, .045, 1.05, stumpM, -9.6 + dx, 0, 1.4, 10));
  for (const dx of [-.11, .11]) shop.add(box(.24, .05, .06, mat('wood'), -9.6 + dx, 1.05, 1.4));
  const bag = new THREE.Group();
  bag.add(box(1.6, .5, .6, bagM, 0, 0, 0, .2)); bag.add(box(.9, .06, .62, mat('gold'), 0, .35, 0));
  bag.position.set(-9.3, 0, 3.2); bag.rotation.y = .3; shop.add(bag);
  const basket = new THREE.Group();
  basket.add(cyl(.55, .45, .55, mat('wood'), 0, 0, 0, 20));
  for (let i = 0; i < 7; i++) basket.add(sph(.14, ballMats[i % 2 ? 0 : 1], Math.cos(i) * .3, .62, Math.sin(i) * .3));
  basket.position.set(-10.2, 0, -1.2); shop.add(basket);
  scenery(w, shop);
  label(null, 'Sports shop', V(0, 4.55, -7.6), 'sign');

  /* ---------- Max, Libby and the supplier ---------- */
  const c = cast(w, {
    max: [-4.8, -1.9], libby: [4.8, -1.9],
    supplier: { spec: { ...CAST.detective, name: 'Supplier', top: '#8C8478', topDark: '#6E675D', hair: '#4A3B30', hat: null, moustache: false, coat: false, height: 1 }, at: SUPPLIER_DOOR }
  });
  Object.assign(api, c);

  /* ---------- On the counter: buzzer, bat, ball, price tag, till, notepad ---------- */
  const buzzer = new THREE.Group();
  buzzer.add(cyl(.32, .36, .14, mat('mask')));
  const dome = sph(.25, mat('bad'), 0, .14, 0, 1, .6, 1); buzzer.add(dome);
  buzzer.position.set(-3.05, TOP, COUNTER_Z + .2);
  prop(w, 'buzzer', buzzer);

  const bat = new THREE.Group();
  bat.add(box(1.15, .09, .3, mat('wood'), 0, 0, 0, .06));
  const handle = new THREE.Mesh(new THREE.CylinderGeometry(.05, .05, .5, 12), mat('wood')); handle.rotation.z = Math.PI / 2; handle.position.set(-.8, .05, 0); bat.add(handle);
  const grip = new THREE.Mesh(new THREE.CylinderGeometry(.062, .062, .32, 12), mat('mask')); grip.rotation.z = Math.PI / 2; grip.position.set(-.9, .05, 0); bat.add(grip);
  bat.position.set(-1.75, TOP, COUNTER_Z + .05); bat.rotation.y = .12;
  prop(w, 'bat', bat);

  const ball = new THREE.Group();
  ball.add(sph(.14, mat('bad'), 0, .14, 0));
  const seam = new THREE.Mesh(new THREE.TorusGeometry(.142, .012, 6, 32), mat('paper')); seam.position.y = .14; seam.rotation.y = .6; ball.add(seam);
  ball.add(cyl(.11, .13, .04, mat('wood')));                                            // a little ring so it doesn't roll away
  ball.position.set(-.55, TOP, COUNTER_Z + .2);
  prop(w, 'ball', ball);

  const tag = new THREE.Group();
  const tagCard = box(.55, .36, .04, mat('paper'), 0, 0, 0, .04); tagCard.rotation.x = -.25; tag.add(tagCard);
  const tagStripe = box(.55, .07, .045, mat('bad'), 0, .3, -.07); tagStripe.rotation.x = -.25; tag.add(tagStripe);
  tag.add(box(.4, .03, .14, mat('mask'), 0, 0, -.05));
  tag.position.set(.3, TOP, COUNTER_Z + .3);
  const tagP = prop(w, 'tag', tag, '£1.10 together', .85, 'axis');

  const till = new THREE.Group();
  till.add(box(.95, .42, .75, mat('muted'), 0, 0, 0, .08));
  const drawer = box(.82, .14, .6, mat('wood'), 0, .02, .1, .03); till.add(drawer);
  const keys = box(.7, .06, .32, mat('paper'), 0, .42, .14); keys.rotation.x = .25; till.add(keys);
  till.add(box(.08, .32, .08, mat('mask'), 0, .42, -.22));
  const dispM = { idle: mat('paper'), wrong: mat('bad'), right: mat('accent') };
  const display = box(.66, .26, .07, dispM.idle, 0, .7, -.22, .03); till.add(display);
  till.position.set(2.45, TOP, COUNTER_Z - .05);
  const tillP = prop(w, 'till', till, TILL.idle, 1.25, 'axis');
  api.tillP = tillP;

  const pad = new THREE.Group();
  pad.add(box(.7, .04, .92, mat('wood'), 0, 0, 0, .05));
  pad.add(box(.6, .02, .8, mat('paper'), 0, .04, .02));
  pad.add(box(.3, .07, .1, mat('mask'), 0, .05, -.42));
  const inkM = mat('mask');
  const writing = [.3, .42, .5, .46, .4].map((len, i) => {
    const ln = box(len, .012, .04, inkM, -.24 + len / 2, .055, -.26 + i * .14); ln.geometry.translate(-len / 2, 0, 0);
    ln.position.x = -.24; pad.add(ln); return ln;
  });
  const pencil = new THREE.Mesh(new THREE.CylinderGeometry(.025, .025, .55, 8), mat('gold')); pencil.rotation.set(0, .5, Math.PI / 2); pencil.position.set(.12, .09, .3); pad.add(pencil);
  pad.position.set(3.3, TOP + .2, COUNTER_Z + .05); pad.rotation.x = .45; pad.rotation.y = -.2;
  prop(w, 'notepad', pad);
  const padLbl = label('notepad', '', V(3.35, 2.4, COUNTER_Z), 'axis');

  // Floating answers above the ball: Max's in green, Libby's in gold
  const maxAns = label('ball', 'Max: 10p', V(-1.05, 2.0, COUNTER_Z + .2), 'stack you');
  const libAns = label('ball', 'Libby: 5p', V(-.15, 2.45, COUNTER_Z + .2), 'stack them');

  /* ---------- The deadline sign the supplier slams down ---------- */
  const sign = new THREE.Group();
  const signBody = new THREE.Group(); sign.add(signBody);
  signBody.add(box(1.08, .7, .05, mat('bad'), 0, .12, -.03, .05));
  signBody.add(box(.96, .58, .06, mat('paper'), 0, .18, 0, .04));
  for (let i = 0; i < 3; i++) signBody.add(box(i ? .6 : .76, .04, .065, mat('mask'), 0, .6 - i * .14, .003));
  sign.add(box(.9, .06, .3, mat('mask'), 0, 0, 0));
  sign.position.set(1.35, TOP, COUNTER_Z - .25);
  const signP = prop(w, 'deadline', sign, 'Valid until 5pm today', .95, 'axis');

  /* ---------- The wall clock ---------- */
  const clock = new THREE.Group();
  const face = new THREE.Mesh(new THREE.CylinderGeometry(.55, .55, .08, 40), mat('paper')); face.rotation.x = Math.PI / 2; clock.add(face);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(.56, .055, 10, 40), mat('mask')); clock.add(rim);
  const tickM = mat('mask');
  for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2, t = new THREE.Mesh(new THREE.BoxGeometry(.035, i % 3 ? .07 : .12, .02), tickM); t.position.set(Math.sin(a) * .45, Math.cos(a) * .45, .05); t.rotation.z = -a; clock.add(t); }
  const hand = (len, wdt, m, z) => { const p = new THREE.Group(); const h = new THREE.Mesh(new THREE.BoxGeometry(wdt, len, .02), m); h.position.y = len / 2 - .05; p.add(h); p.position.z = z; clock.add(p); return p; };
  const hourH = hand(.28, .055, mat('mask'), .06), minH = hand(.42, .035, mat('mask'), .075), secH = hand(.46, .015, mat('bad'), .09);
  clock.add(sph(.04, mat('bad'), 0, 0, .1));
  clock.position.set(2.6, 3.2, -7.38);
  prop(w, 'clock', clock);
  const setTime = mins => { minH.rotation.z = -(mins % 60) / 60 * Math.PI * 2; hourH.rotation.z = -((16 + mins / 60) % 12) / 12 * Math.PI * 2; };
  api.st.mins = 20; setTime(20);

  /* ---------- The two thinking engines ---------- */
  // Fast: a hare in a running wheel with a lightning bolt on top
  const fast = new THREE.Group();
  fast.add(box(2.2, .45, 1.3, mat('surface'), 0, 0, 0, .15));
  fast.add(box(2.24, .08, 1.34, mat('gold'), 0, .3, 0, .15));
  fast.add(box(.18, 1.2, .18, mat('mask'), 0, .45, -.5));
  const axle = new THREE.Mesh(new THREE.CylinderGeometry(.06, .06, .55, 10), mat('mask')); axle.rotation.x = Math.PI / 2; axle.position.set(0, 1.55, -.28); fast.add(axle);
  const wheel = new THREE.Group(); wheel.position.set(0, 1.55, 0); fast.add(wheel);
  const rimM = mat('accent');
  for (const z of [-.3, .3]) { const t = new THREE.Mesh(new THREE.TorusGeometry(.82, .045, 10, 48), rimM); t.position.z = z; wheel.add(t); }
  for (let i = 0; i < 18; i++) {
    const a = i / 18 * Math.PI * 2, r = new THREE.Mesh(new THREE.CylinderGeometry(.02, .02, .6, 6), rimM);
    r.rotation.x = Math.PI / 2; r.position.set(Math.cos(a) * .82, Math.sin(a) * .82, 0); wheel.add(r);
  }
  for (let i = 0; i < 6; i++) { const s = box(.035, .82, .035, rimM, 0, 0, -.3); s.rotation.z = i / 6 * Math.PI * 2; wheel.add(s); }
  const hareG = hare(mat('wood'), mat('paper'), mat('mask')); hareG.position.set(-.05, .78, 0); fast.add(hareG);
  fast.add(box(.06, .5, .06, mat('mask'), 0, 2.4, -.28));
  const boltM = mat('gold', { emissive: new THREE.Color('#ffcf5a'), emissiveIntensity: .15 });
  const fastBolt = bolt(boltM, 1.1); fastBolt.position.set(0, 3.2, -.25); fastBolt.userData.noGlow = true; fast.add(fastBolt);
  const sparkM = mat('gold', { emissive: new THREE.Color('#ffd27a'), emissiveIntensity: 1 });
  const sparks = Array.from({ length: 10 }, (_, i) => { const s = sph(.05, sparkM); s.userData.noGlow = true; s.userData.noPick = true; s.visible = false; s.userData.dir = V(Math.cos(i * 2.4), Math.sin(i * 2.4) * .8 + .5, .3 + (i % 3) * .2).normalize(); fast.add(s); return s; });
  fast.position.set(-7.2, 0, -5.3);
  const fastP = prop(w, 'engine-fast', fast, 'Fast engine', 3.95, 'sign');

  // Slow: three meshing gears on a panel, a gauge and a little chimney
  const slow = new THREE.Group();
  slow.add(box(2.4, .45, 1.3, mat('surface'), 0, 0, 0, .15));
  slow.add(box(2.44, .08, 1.34, mat('gold'), 0, .3, 0, .15));
  slow.add(box(2.2, 2.3, .15, mat('raised'), 0, .45, -.45, .1));
  const hubM = mat('mask');
  const gears = [[.62, 'gold', -.45, 1.4, 1], [.42, 'muted', .6, 1.05, -.62 / .42], [.3, 'wood', .68, 1.97, (.62 / .42) * (.42 / .3)]].map(([r, role, x, y, ratio]) => {
    const g = gear(r, mat(role), hubM); g.position.set(x, y, -.3); g.userData.ratio = ratio; slow.add(g); return g;
  });
  const gauge = new THREE.Group();
  const gFace = new THREE.Mesh(new THREE.CylinderGeometry(.2, .2, .05, 24), mat('paper')); gFace.rotation.x = Math.PI / 2; gauge.add(gFace);
  const needle = new THREE.Group(); const nd = new THREE.Mesh(new THREE.BoxGeometry(.02, .16, .02), mat('bad')); nd.position.y = .07; needle.add(nd); needle.position.z = .04; gauge.add(needle);
  gauge.position.set(-.55, 2.4, -.33); slow.add(gauge);
  slow.add(cyl(.12, .14, .45, mat('mask'), .75, 2.75, -.45, 14));
  const puffM = mat('paper', { transparent: true, opacity: .7 });
  const puffs = [0, 1, 2].map(() => { const p = sph(.13, puffM); p.userData.noGlow = true; p.userData.noPick = true; slow.add(p); return p; });
  slow.position.set(7.2, 0, -5.3);
  const slowP = prop(w, 'engine-slow', slow, 'Slow engine', 3.95, 'sign');

  /* ---------- The three drivers of behaviour ---------- */
  const drivers = {};
  const pedestal = (g, role) => { g.add(cyl(.62, .7, .55, mat(role), 0, 0, 0, 28)); g.add(cyl(.66, .66, .06, mat('gold'), 0, .55, 0, 28)); };
  // Social: a balance, for fairness and reputation
  const social = new THREE.Group(); pedestal(social, 'surface');
  social.add(cyl(.05, .07, 1.1, mat('mask'), 0, .6, 0, 10));
  const beam = new THREE.Group(); beam.position.y = 1.72; social.add(beam);
  beam.add(box(1.1, .06, .08, mat('wood'), 0, -.03, 0));
  const panM = mat('gold');
  for (const x of [-.52, .52]) {
    beam.add(box(.015, .4, .015, mat('mask'), x, -.42, 0));
    beam.add(cyl(.2, .14, .05, panM, x, -.45, 0, 20));
    beam.add(box(.12, .12, .12, mat('paper'), x, -.4, 0));
  }
  social.add(sph(.07, mat('gold'), 0, 1.75, 0));
  // Cognitive: a signpost with a long way round and a shortcut
  const cognitive = new THREE.Group(); pedestal(cognitive, 'surface');
  cognitive.add(cyl(.05, .05, 1.35, mat('wood'), 0, .6, 0, 10));
  const armA = new THREE.Group(); armA.add(box(.8, .2, .05, mat('paper'), .3, 0, 0)); const tipA = new THREE.Mesh(new THREE.ConeGeometry(.14, .2, 3), mat('paper')); tipA.rotation.z = -Math.PI / 2; tipA.position.set(.8, .1, 0); armA.add(tipA);
  armA.position.set(0, 1.55, .05); cognitive.add(armA);
  const armB = new THREE.Group(); armB.add(box(.6, .2, .05, mat('accent'), -.22, 0, 0)); const tipB = new THREE.Mesh(new THREE.ConeGeometry(.14, .2, 3), mat('accent')); tipB.rotation.z = Math.PI / 2; tipB.position.set(-.62, .1, 0); armB.add(tipB);
  armB.position.set(0, 1.22, .05); armB.rotation.z = -.15; cognitive.add(armB);
  // Emotional: a beating heart
  const emotional = new THREE.Group(); pedestal(emotional, 'surface');
  const heart = new THREE.Group(); heart.position.y = 1.35; emotional.add(heart);
  const heartM = mat('bad');
  heart.add(sph(.25, heartM, -.17, .08, 0, 1, 1, .7)); heart.add(sph(.25, heartM, .17, .08, 0, 1, 1, .7));
  const point = new THREE.Mesh(new THREE.ConeGeometry(.38, .55, 24), heartM); point.rotation.z = Math.PI; point.scale.z = .62; point.position.y = -.24; heart.add(point);
  [['social', social, -4, 'Social'], ['cognitive', cognitive, 0, 'Cognitive'], ['emotional', emotional, 4, 'Emotional']].forEach(([k, g, x, t]) => {
    g.position.set(x, 0, 3.1); drivers[k] = prop(w, k, g, t, 2.35, 'sign');
  });

  /* ---------- Bargaining power: options (gold) and how you present things (accent) ---------- */
  const power = new THREE.Group();
  power.add(box(2.3, .15, 1.2, mat('wood'), 0, 0, 0, .1));
  const optStack = stack(5, mat('gold'), .34, .04); optStack.position.set(-.5, .15, 0); power.add(optStack);
  const preStack = stack(3, mat('accent'), .34, .04); preStack.position.set(.5, .15, 0); power.add(preStack);
  power.position.set(8.6, 0, 2.2); power.rotation.y = -.35;
  const powerP = prop(w, 'power', power, 'Bargaining power', 2.6, 'sign');
  const optLbl = label('power', 'Options', V(-.55, .1, .75), 'stack them'); power.add(optLbl.obj);
  const preLbl = label('power', 'How you present it', V(.6, .1, .95), 'stack'); power.add(preLbl.obj);

  /* ---------- Animation loop ---------- */
  const eng = { fast: 2, slow: .6, fastNow: 2, slowNow: .6, spark: 0 };
  let tickAcc = 0;
  w.onTick((t, dt) => {
    eng.fastNow += (eng.fast - eng.fastNow) * Math.min(1, dt * 3);
    eng.slowNow += (eng.slow - eng.slowNow) * Math.min(1, dt * 2);
    wheel.rotation.z -= eng.fastNow * dt;
    hareG.position.y = .78 + Math.abs(Math.sin(t * (4 + eng.fastNow * 1.6))) * .07;
    hareG.rotation.z = Math.sin(t * (4 + eng.fastNow * 1.6)) * .08;
    gears.forEach(g => { g.rotation.z += eng.slowNow * dt / g.userData.ratio; });
    needle.rotation.z = .9 - eng.slowNow * .6 + Math.sin(t * 1.3) * .05;
    puffs.forEach((p, i) => { const k = ((t * .25 * (.4 + eng.slowNow)) + i / 3) % 1; p.position.set(.75 + Math.sin(k * 5 + i) * .1, 3.25 + k * 1.1, -.45); p.scale.setScalar(.5 + k); p.material.opacity = .6 * (1 - k); });
    eng.spark = Math.max(0, eng.spark - dt);
    const on = eng.spark > 0;
    boltM.emissiveIntensity = on ? .6 + Math.abs(Math.sin(t * 20)) * .9 : .15;
    fastBolt.rotation.y = on ? Math.sin(t * 30) * .25 : 0;
    sparks.forEach((s, i) => {
      s.visible = on;
      if (on) { const k = ((t * 2.4) + i / sparks.length) % 1; s.position.copy(s.userData.dir).multiplyScalar(.4 + k * 1.3).add(V(0, 1.55, 0)); s.scale.setScalar(1 - k * .8); }
    });
    // clock: quiet ticks, then urgent ones that make it shake
    const mode = api.st.clock;
    if (mode !== 'stopped') {
      const every = mode === 'tick' ? .35 : 1;
      tickAcc += dt;
      if (tickAcc > every) {
        tickAcc = 0; secH.rotation.z -= Math.PI / 30;
        if (mode === 'tick' && api.st.mins < 60) { api.st.mins = Math.min(60, api.st.mins + .2); setTime(api.st.mins); }
      }
      clock.rotation.z = mode === 'tick' ? Math.sin(t * 40) * .03 * Math.max(0, 1 - tickAcc / every * 2) : 0;
    } else clock.rotation.z = 0;
    // drivers
    beam.rotation.z = Math.sin(t * 1.2) * .12;
    armB.rotation.z = -.15 + Math.sin(t * 2) * .05;
    const beat = 1 + Math.max(0, Math.sin(t * 5)) * .12 * (1 + (api.st.racing ? 1 : 0));
    heart.scale.setScalar(beat);
  });

  /* ---------- State setters: each step calls api.set() so ?step=N always works ---------- */
  api.setTill = s => { api.st.till = s; display.material = dispM[s]; display.userData.noGlow = s !== 'idle'; tillP.label.set(TILL[s]); };
  api.ringTill = async s => {
    await animate(250, k => { drawer.position.z = .1 + k * .4; till.position.y = TOP + Math.sin(k * Math.PI) * .12; });
    api.setTill(s);
    await animate(350, k => { drawer.position.z = .5 - k * .4; });
  };
  api.setNotes = n => {
    api.st.notes = n;
    writing.forEach((ln, i) => { ln.scale.x = i < n ? 1 : .001; ln.visible = i < n; });
    padLbl.set(n ? NOTES[n - 1] : ''); show(padLbl, n > 0);
  };
  api.writeNotes = async to => {
    for (let i = api.st.notes; i < to; i++) {
      const ln = writing[i]; ln.visible = true; padLbl.set(NOTES[i]); show(padLbl, true);
      api.chars.libby.pose('think');
      await animate(650, k => { ln.scale.x = Math.max(.001, k); pencil.position.x = .12 + Math.sin(k * Math.PI * 4) * .06; });
      api.st.notes = i + 1;
    }
  };
  api.answers = (m, l) => { api.st.maxAns = m; api.st.libAns = l; show(maxAns, m); show(libAns, l); };
  api.engines = (f, s, spark = 0) => { eng.fast = f; eng.slow = s; eng.spark = spark; };
  api.systems = on => { api.st.systems = on; fastP.label.set(on ? 'System 1' : 'Fast engine'); slowP.label.set(on ? 'System 2' : 'Slow engine'); };
  api.slam = async () => {
    await api.hop('max', [-4.8, -1.9], 520);
    api.chars.max.pose('point');
    await animate(160, k => { dome.scale.y = .6 - k * .4; });
    api.engines(14, .6, 1.6); api.answers(true, api.st.libAns);
    await animate(260, k => { dome.scale.y = .2 + k * .4; });
    later(1400, () => { if (eng.fast === 14) eng.fast = 5; api.chars.max.pose('idle'); });
  };
  api.setDrivers = on => { api.st.drivers = on; Object.values(drivers).forEach(d => { d.show(on); d.obj.scale.set(1, 1, 1); }); };
  api.riseDrivers = async () => {
    api.setDrivers(true);
    const list = Object.values(drivers);
    list.forEach(d => d.obj.scale.set(1, .001, 1));
    for (const d of list) await animate(420, k => d.obj.scale.set(1, Math.max(.001, k + Math.sin(k * Math.PI) * .2), 1));
  };
  api.setPower = n => {
    api.st.power = n; powerP.show(n > 0); show(optLbl, n > 0); show(preLbl, n > 0);
    optStack.children.forEach((b, i) => { b.visible = i < n; b.scale.set(1, 1, 1); });
  };
  api.shrinkOptions = async to => {
    for (let i = api.st.power - 1; i >= to; i--) {
      const b = optStack.children[i];
      await animate(300, k => { b.scale.setScalar(Math.max(.001, 1 - k)); b.position.x = k * .6; });
      b.visible = false; b.position.x = 0; api.st.power = i;
    }
    api.st.power = to;
  };
  api.pulsePresent = () => animate(700, k => preStack.scale.set(1 + Math.sin(k * Math.PI) * .25, 1 + Math.sin(k * Math.PI) * .25, 1 + Math.sin(k * Math.PI) * .25));
  api.setSupplier = where => {
    api.st.supplier = where;
    api.show('supplier', where !== 'away');
    const at = where === 'door' ? SUPPLIER_DOOR : SUPPLIER_DESK, r = api.chars.supplier.root;
    r.position.set(at[0], .02, at[1]); r.rotation.y = 0;
    api.chars.supplier.face('happy'); api.chars.supplier.pose('idle');
  };
  api.setSign = s => {
    api.st.deadline = s; signP.show(s !== 'hidden');
    // once the sign is up, the price tag and till labels step aside so the deadline reads clearly
    show(tagP.label, s === 'hidden'); show(tillP.label, s === 'hidden');
    signP.label.set(s === 'friday' ? 'Valid until Friday' : 'Valid until 5pm today');
    signBody.rotation.x = 0; sign.position.y = TOP;
  };
  api.slamSign = async () => {
    api.setSign('today'); sign.position.y = TOP + 2.4;
    await animate(380, k => { sign.position.y = TOP + 2.4 * (1 - k * k); });
    const items = [bat, ball, tag, till, pad, buzzer], ys = items.map(o => o.position.y);
    await animate(320, k => items.forEach((o, i) => { o.position.y = ys[i] + Math.sin(k * Math.PI) * .15; }));
  };
  api.flipSign = async () => {
    let swapped = false;
    await animate(800, k => { signBody.rotation.x = k * Math.PI * 2; if (k > .5 && !swapped) { swapped = true; signP.label.set('Valid until Friday'); } });
    api.setSign('friday');
  };
  api.setClock = m => { if (m === 'still') { api.st.mins = 20; setTime(20); } api.st.clock = m; };

  api.set = async (o = {}) => {
    api.begin();
    const s = { supplier: 'away', sign: 'hidden', clock: 'still', till: 'idle', notes: 0, maxAns: false, libAns: false, systems: false,
      fast: 2, slow: .6, spark: 0, drivers: false, power: 0, racing: false, ...o };
    api.clearThoughts();
    api.chars.supplier.root.position.set(SUPPLIER_DOOR[0], .02, SUPPLIER_DOOR[1]);
    api.setSupplier(s.supplier); api.setSign(s.sign); api.setClock(s.clock); api.setTill(s.till); api.setNotes(s.notes);
    api.answers(s.maxAns, s.libAns); api.systems(s.systems); api.engines(s.fast, s.slow, s.spark);
    api.setDrivers(s.drivers); api.setPower(s.power); api.st.racing = s.racing;
    api.poses('idle'); api.faces('happy');
    await api.home();
  };
  api.later = later;
  return api;
}

/* ---------- State cards ---------- */
export function card(key, ctx) {
  const { api } = ctx, st = api.st, r = ctx.reached;
  const solved = st.libAns || r('engines');
  const C = {
    max: {
      kicker: 'Customer · fast thinker', title: 'Max',
      rows: [['Shopping for', 'A cricket bat and a ball'],
        ['His answer', r('blurt') ? '10p, in under a second' : 'Not asked yet'],
        ...(solved ? [['Right answer', '5p']] : []),
        ...(r('deadline') ? [['Feels', st.deadline === 'friday' ? 'Relieved, and a bit amazed' : 'Rushed: the clock is ticking']] : [])],
      text: r('respond') ? 'Pressure pushed Max straight into fast mode: he wanted the pen before anyone had checked the offer.'
        : solved ? 'The 10p answer arrived instantly and felt right. That is what fast thinking feels like from the inside.'
          : 'Max grabs the first answer that pops into his head. Quick is usually good. Today it costs him.'
    },
    libby: {
      kicker: 'Customer · slow thinker', title: 'Libby',
      rows: [['Method', 'Writes the sum down'], ['Her answer', solved ? '5p' : 'Still working'],
        ...(r('respond') ? [['Under pressure', 'Asks for time and checks her walk-away point']] : [])],
      text: 'Libby is not cleverer than Max. She just refuses to answer until the slow engine has done its job.'
    },
    supplier: {
      kicker: 'Sells the kit', title: 'The supplier',
      rows: [['Offer', 'The kit deal for the club'], ['Deadline', st.deadline === 'friday' ? 'Friday, once asked' : '5pm today'],
        ['Wants', 'A yes before you have thought about it']],
      text: st.deadline === 'friday' ? 'When Libby asked for time, the deadline quietly moved. Many do when tested, though not every one.'
        : 'He is not lying, exactly. The deadline is there to make a quick yes feel safer than a careful check.'
    },
    tag: {
      kicker: 'Price tag', title: '£1.10 together',
      rows: [['Bat and ball together', '£1.10'], ['The bat costs', '£1 more than the ball'], ['The ball costs', solved ? '5p' : '?']],
      text: solved ? 'Ball 5p, bat £1.05. The difference is £1 and the total is £1.10. Both facts hold.' : 'Two facts and one question. Try it in your head before anyone answers for you.'
    },
    bat: {
      kicker: 'On the counter', title: 'Cricket bat',
      rows: [['Price', solved ? '£1.05' : '£1 more than the ball'], ['If the ball were 10p', 'The bat would be £1.10']],
      text: 'The trap is reading "£1 more" as "£1". The bat is £1 dearer than the ball, not £1 on the nose.'
    },
    ball: {
      kicker: 'On the counter', title: 'Cricket ball',
      rows: [['Price', solved ? '5p' : '?'], ...(st.maxAns || r('blurt') ? [['Max\'s guess', '10p']] : []), ...(solved ? [['Libby\'s answer', '5p']] : [])],
      text: solved ? 'Most people\'s first instinct says 10p (Frederick, 2005). The slow check says 5p.' : 'The question everyone answers too fast.'
    },
    buzzer: {
      kicker: 'Answer button', title: 'The buzzer',
      rows: [['Pressed by', r('blurt') ? 'Max, in under a second' : 'Nobody yet'], ['Checked first?', r('blurt') ? 'No' : 'Not yet']],
      text: 'Speed feels like skill. At a shop counter that is harmless. At a negotiating table it can cost real money.'
    },
    till: {
      kicker: 'The till', title: 'Ringing it up',
      rows: [['Display', TILL[st.till]], ['Should come to', '£1.10']],
      text: st.till === 'wrong' ? 'Max\'s answer fails the check: a 10p ball means a £1.10 bat, and £1.20 in all.'
        : st.till === 'right' ? 'Libby\'s answer passes: 5p plus £1.05 is exactly £1.10.' : 'Ring up an answer and the till tells you if it adds up.'
    },
    notepad: {
      kicker: 'Libby\'s working', title: 'The notepad',
      rows: st.notes ? NOTES.slice(0, st.notes).map((n, i) => ['Line ' + (i + 1), n]) : [['Written so far', 'Nothing yet']],
      text: 'Writing it down is the simplest way to switch on slow thinking: it forces you to check each step.'
    },
    clock: {
      kicker: 'Wall clock', title: st.clock === 'tick' ? 'Ticking down to 5pm' : 'The clock',
      rows: [['Time', st.mins >= 60 ? '5pm' : '4:' + String(Math.floor(st.mins)).padStart(2, '0') + 'pm'],
        ['Ticking', st.clock === 'tick' ? 'Loudly' : st.clock === 'stopped' ? 'Nobody is watching it now' : 'Quietly'],
        ...(r('deadline') ? [['Deadline', st.deadline === 'friday' ? 'Moved to Friday' : '5pm today']] : [])],
      text: st.clock === 'tick' ? 'A ticking clock makes the quick answer feel right. That is the point of it.'
        : st.deadline === 'friday' ? 'Once the deadline moved, the clock stopped mattering.' : 'Just a clock on a shop wall. For now.'
    },
    deadline: {
      kicker: 'The supplier\'s sign', title: st.deadline === 'friday' ? 'Valid until Friday' : 'Valid until 5pm today',
      rows: [['Valid until', st.deadline === 'friday' ? 'Friday' : '5pm today'], ['Built to', 'Get a System 1 yes'], ['Tested?', st.deadline === 'friday' ? 'Yes, and it moved' : 'Not yet']],
      text: st.deadline === 'friday' ? 'Many deadlines quietly move when tested. Not all, so check your walk-away point either way.'
        : 'Deadlines, a tense room and a counterpart who wants an answer now all push you into fast mode.'
    },
    'engine-fast': {
      kicker: 'Thinking engine', title: st.systems ? 'System 1: fast' : 'The fast engine',
      rows: [['Speed', 'Instant'], ['Effort', 'None at all'], ['Works', 'Automatically, by intuition'], ...(r('blurt') ? [['Gave', '10p']] : []),
        ...(r('deadline') ? [['Revved up by', 'Deadlines and pressure']] : [])],
      text: 'Kahneman (2011) calls this System 1. It runs all day and is mostly right, which is why you trust it when it is wrong.'
    },
    'engine-slow': {
      kicker: 'Thinking engine', title: st.systems ? 'System 2: slow' : 'The slow engine',
      rows: [['Speed', 'Slow'], ['Effort', 'Real effort'], ['Works', 'Deliberately, step by step'], ...(solved ? [['Gave', '5p']] : []),
        ...(r('deadline') ? [['Needs', 'Time, which a deadline takes away']] : [])],
      text: 'Kahneman (2011) calls this System 2. It checks the sum and finds 5p, but only if you give it the time.'
    },
    social: {
      kicker: 'Driver 1 of 3', title: 'Social',
      rows: [['What it is', 'Fairness and reputation'], ['Sounds like', '"Is this fair? What will people think?"'], ['Coming up', 'The ultimatum game']],
      text: 'People will turn down money to punish an offer that feels unfair, and they care how they look to others.'
    },
    cognitive: {
      kicker: 'Driver 2 of 3', title: 'Cognitive',
      rows: [['What it is', 'Mental shortcuts and biases'], ['Example', 'The 10p answer'], ['Coming up', 'Framing, anchoring and decoys']],
      text: 'Shortcuts save effort and are often fine. A bias is a shortcut that goes wrong in a predictable way.'
    },
    emotional: {
      kicker: 'Driver 3 of 3', title: 'Emotional',
      rows: [['What it is', 'Pride, fear and excitement'], ['Example', 'Fear of losing the deal at 5pm']],
      text: 'All three drivers are in the room at every negotiation, on both sides of the table.'
    },
    power: {
      kicker: 'Why this matters', title: 'Bargaining power',
      rows: [['Options (gold)', st.power <= 1 ? 'One supplier, no plan B' : 'Plenty of suppliers'], ['How you present things', 'Much of the power you have left'],
        ['Rule', 'The weaker your position, the more the behavioural tools matter']],
      text: 'When you lack competition and alternatives, the way you present things is much of the power you have got.'
    }
  };
  return C[key] || { kicker: 'In the shop', title: 'Something in the shop', rows: [['What it is', key]], text: '' };
}

/* ---------- Camera presets: [position, target], for wide screens and phones ---------- */
const SHOP = { wide: [[0, 8, 16], [0, 1.6, -3]], phone: [[0, 12.5, 21], [0, 1.3, -3]] };
const COUNTER = { wide: [[0, 6.5, 10.5], [0, 1.5, -3.2]], phone: [[0, 9.5, 13], [0, 1.3, -3.2]] };
const ENGINES = { wide: [[0, 10, 21], [0, 1.5, -4]], phone: [[0, 16, 27], [0, 1.2, -3.5]] };
const DRIVERS = { wide: [[0, 8, 15.5], [0, 1, 2.2]], phone: [[0, 11, 18], [0, .9, 2.2]] };
const POWER = { wide: [[4.5, 6.5, 12], [7, 1.2, .3]], phone: [[5, 9.5, 15], [7.2, 1.1, .3]] };
const DEAD = { wide: [[0, 7, 12.5], [.3, 2, -4.6]], phone: [[0, 10, 17], [.3, 1.7, -4.4]] };
const OVER = { wide: [[0, 15, 25], [0, .6, -1.5]], phone: [[0, 25, 33], [0, .4, -1.5]] };

const AFTER_SUM = { till: 'right', notes: 4, systems: true };
const AT_DEADLINE = { ...AFTER_SUM, drivers: true, power: 1, supplier: 'desk', sign: 'today', clock: 'tick', fast: 14, slow: .05, spark: 1e9, racing: true };

/* ---------- The guided tour ---------- */
export const steps = [
  {
    id: 'meet', title: 'Shopping for a bat and a ball',
    lines: [
      { who: 'max', text: 'Hi, I\'m Max! Libby and I are buying a bat and a ball for Saturday\'s cricket match.' },
      { who: 'libby', text: 'Game theory assumes every player is perfectly rational. Today we watch what real people do at a shop counter.' }
    ],
    cam: SHOP, task: { click: ['tag'], say: 'Click the price tag on the counter.' },
    async enter(api) {
      await api.set();
      api.chars.max.pose('wave'); api.later(2400, () => api.chars.max.pose('idle'));
    }
  },
  {
    id: 'blurt', title: 'Max answers in a flash',
    lines: [
      { who: 'libby', text: 'Together they cost £1.10, and the bat costs £1 more than the ball. So how much is the ball?' },
      { who: 'max', text: 'Ten pence! Easy. Done!' }
    ],
    cam: SHOP, task: { click: ['till'], say: 'Click the till to ring up Max\'s answer.' },
    async enter(api) {
      await api.set();
      api.faces('happy', 'think'); api.chars.libby.pose('think');
      api.later(5000, () => { api.faces('grin', 'surprised'); api.chars.libby.pose('idle'); api.slam(); });
    },
    async done(api) {
      api.answers(true, false);
      await api.ringTill('wrong');
      api.faces('surprised', 'think');
    }
  },
  {
    id: 'check', title: 'Now you, slowly',
    lines: [
      { who: 'max', text: '£1.20? But the tag says £1.10. Where did my 10p go wrong?' },
      { who: 'libby', text: 'Let me write it down. The ball is the unknown, and the bat is the ball plus £1. Take your time.' }
    ],
    cam: COUNTER,
    task: { choice: { q: 'A bat and a ball cost £1.10 together. The bat costs £1 more than the ball. How much is the ball?', options: [
      { text: '10p', why: 'That\'s the fast answer, and it\'s wrong. If the ball were 10p, the bat would be £1.10 and the total £1.20.' },
      { text: '5p', ok: true, why: 'Right. The bat is £1.05 and the ball 5p, which makes £1.10. Most people\'s first instinct says 10p (Frederick, 2005).' },
      { text: '1p', why: 'Then the bat would be £1.01 and the total £1.02, not £1.10.' },
      { text: '55p', why: 'Then the bat would be £1.55 and the total £2.10.' }
    ] } },
    async enter(api) {
      await api.set({ till: 'wrong', maxAns: true });
      api.faces('worried', 'think');
      api.later(3600, () => api.writeNotes(2));
    },
    async done(api) {
      await api.writeNotes(4);
      api.answers(true, true); api.chars.libby.pose('idle');
      api.engines(2, 1.6);
      await api.ringTill('right');
      api.faces('grin', 'happy');
      await api.hop('max', [-4.8, -1.9], 700);
      api.say('max', '5p! And the bat is £1.05. That adds up.', 2600);
    }
  },
  {
    id: 'engines', title: 'Two engines, fast and slow',
    lines: [
      { who: 'libby', text: 'Daniel Kahneman (2011) describes two modes of thinking. <b>System 1</b> is automatic, intuitive, fast and effortless. It gave you 10p.' },
      { who: 'libby', text: '<b>System 2</b> is deliberate, slow and effortful. It checks the sum and finds 5p.' },
      { who: 'max', text: 'So mine is the one with the hare in it.' }
    ],
    cam: ENGINES, task: { click: ['engine-fast', 'engine-slow'], all: true, say: 'Click both thinking engines.' },
    async enter(api) {
      await api.set({ ...AFTER_SUM, fast: 6, slow: 1, spark: 1.2 });
      api.faces('happy', 'happy'); api.chars.libby.pose('point');
      api.later(4000, () => api.chars.libby.pose('idle'));
    }
  },
  {
    id: 'which', title: 'Which engine said 10p?',
    lines: [
      { who: 'max', text: 'Be honest with me. Which one of these blurted out 10p at the till?' },
      { who: 'libby', text: 'Click the one that answered first, before anybody checked the sum.' }
    ],
    cam: ENGINES,
    task: { pick: { answer: 'engine-fast', say: 'Click the engine that gave the 10p answer.', wrong: {
      'engine-slow': 'That one is slow on purpose. It wrote the sum down and found 5p.'
    }, why: 'Right. System 1 answered in a flash, and the answer felt right because it came so easily.' } },
    async enter(api) { await api.set({ ...AFTER_SUM, fast: 4, slow: 1 }); api.faces('think', 'happy'); api.chars.max.pose('think'); },
    async done(api) {
      api.engines(14, 1, 2); api.chars.max.pose('shrug'); api.faces('grin', 'happy');
      api.say('max', 'Guilty. The hare did it.', 2400);
      api.later(1800, () => { api.engines(4, 1); api.chars.max.pose('idle'); });
    }
  },
  {
    id: 'drivers', title: 'Three drivers of behaviour',
    lines: [
      { who: 'libby', text: '<b>Behavioural economics</b> studies where real people predictably depart from the rational model, and why.' },
      { who: 'libby', text: 'There are three drivers. <b>Social</b>: fairness and reputation. <b>Cognitive</b>: shortcuts and biases. <b>Emotional</b>: pride, fear and excitement.' },
      { who: 'max', text: 'All three on our side of the counter, then. And all three on theirs.' }
    ],
    cam: DRIVERS, task: { click: ['social', 'cognitive', 'emotional'], all: true, say: 'Click each of the three drivers.' },
    async enter(api) {
      await api.set({ ...AFTER_SUM });
      api.faces('surprised', 'happy');
      await api.riseDrivers();
      api.faces('happy');
    }
  },
  {
    id: 'weak', title: 'A weak hand needs these tools most',
    lines: [
      { who: 'libby', text: 'One rule runs through this course: <b>the weaker your bargaining position, the more the behavioural tools matter</b>.' },
      { who: 'max', text: 'Watch the gold stack. Say we had five suppliers to choose from, and now there\'s only one.' }
    ],
    cam: POWER,
    task: { choice: { q: 'Who gets the most out of these behavioural tools?', options: [
      { text: 'A buyer with five keen suppliers chasing the order', why: 'The tools still help, but competition is doing most of the work for this buyer.' },
      { text: 'A buyer with one possible supplier and no plan B', ok: true, why: 'Right. With no competition and no alternatives, how you present things is much of the power you\'ve got.' },
      { text: 'Nobody. Sensible people ignore these effects', why: 'Real people on both sides of the table depart from rational models, and in predictable ways.' }
    ] } },
    async enter(api) {
      await api.set({ ...AFTER_SUM, drivers: true, power: 5 });
      api.faces('happy', 'think');
      api.later(6200, async () => { api.faces('worried', 'think'); await api.shrinkOptions(1); });
    },
    async done(api) {
      if (api.st.power > 1) await api.shrinkOptions(1);
      api.chars.libby.pose('point'); api.faces('happy', 'grin');
      await api.pulsePresent();
      api.say('libby', 'How we present things is most of the power we have left.', 2800);
      api.later(2800, () => api.chars.libby.pose('idle'));
    }
  },
  {
    id: 'deadline', title: 'Valid until 5pm today',
    lines: [
      { who: 'max', text: 'Whoa! "Valid until 5pm today"? We\'d better sign right now, before it\'s gone!' },
      { who: 'libby', text: 'Look at the engines, Max. A deadline like that is built to keep us in System 1.' }
    ],
    cam: DEAD, task: { click: ['deadline', 'clock'], all: true, say: 'Click the supplier\'s sign, then the clock.' },
    async enter(api) {
      await api.set({ ...AFTER_SUM, drivers: true, power: 1, supplier: 'door' });
      await api.walk('supplier', [SUPPLIER_DESK[0], SUPPLIER_DESK[1]], 1300);
      api.st.supplier = 'desk';
      await api.slamSign();
      api.setClock('tick'); api.engines(14, .05, 1e9); api.st.racing = true;
      api.faces('surprised', 'worried'); api.chars.supplier.face('grin');
      api.think('supplier', 'A yes before 5pm, please');
      await api.hop('max', [-4.8, -1.9], 600);
    }
  },
  {
    id: 'respond', title: 'The System 2 response',
    lines: [
      { who: 'max', text: 'Quick, pass me the pen!' },
      { who: 'libby', text: 'Deadlines, a tense room and a counterpart who wants an answer now all make the quick reply feel right.' }
    ],
    cam: DEAD,
    task: { choice: { q: 'The supplier says: "This price is only valid until 5pm today." What\'s the System 2 response?', options: [
      { text: 'Accept before it expires', why: 'That\'s exactly what the deadline is for. It wants a System 1 yes.' },
      { text: 'Ask for time, check the offer against your walk-away point, and test whether the deadline is real', ok: true, why: 'Right. Slow the decision down and check the facts. Many deadlines quietly move when tested.' },
      { text: 'Reject it to show strength', why: 'Also a fast reaction. Think first, then decide.' }
    ] } },
    async enter(api) {
      await api.set(AT_DEADLINE);
      api.think('supplier', 'A yes before 5pm, please');
      api.faces('grin', 'think'); api.chars.max.pose('point'); api.chars.supplier.face('grin');
    },
    async done(api) {
      api.chars.max.pose('idle'); api.chars.libby.pose('wave');
      api.engines(3, 1.4, 0); api.st.racing = false;
      await api.writeNotes(5);
      api.faces('think', 'happy');
      api.later(1500, () => api.chars.libby.pose('idle'));
    }
  },
  {
    id: 'test', title: 'Test the deadline',
    lines: [
      { who: 'libby', text: 'Could we have until Friday? We\'d like to check your offer against our walk-away point first.' },
      { who: 'max', text: 'Er, Libby... what if he says no?' }
    ],
    cam: DEAD, task: { click: ['supplier'], say: 'Click the supplier to hear his answer.' },
    async enter(api) {
      await api.set({ ...AT_DEADLINE, notes: 5, fast: 3, slow: 1.4, spark: 0, racing: false });
      api.think('supplier', 'A yes before 5pm, please');
      api.faces('worried', 'happy'); api.chars.supplier.face('think');
    },
    async done(api) {
      api.think('supplier', null);
      api.chars.supplier.pose('shrug'); api.chars.supplier.face('surprised');
      api.say('supplier', 'Friday? Er... yes, Friday works.', 2600);
      await api.flipSign();
      api.setClock('stopped'); api.engines(1.5, 1.2);
      api.faces('surprised', 'grin');
      api.later(2700, () => { api.faces('grin', 'happy'); api.chars.supplier.pose('idle'); api.chars.supplier.face('happy'); api.say('max', 'It moved!', 2000); });
    }
  },
  {
    id: 'wait', title: 'Wait, wait, wait',
    lines: [
      { who: 'libby', text: 'So: <b>wait, wait, wait</b>. Don\'t rush to close, and don\'t show you\'re eager or short of time.' },
      { who: 'libby', text: 'Take your time over decisions. Let the other side be the one who makes the System 1 mistake.' },
      { who: 'max', text: 'Got it. So what do we tell him now?' }
    ],
    cam: SHOP,
    task: { choice: { q: 'The supplier rings on Thursday to chase you. Which reply keeps you in System 2?', options: [
      { text: 'We need this signed today. Can you do it?', why: 'That tells him you\'re short of time, which hands him the pressure to use on you.' },
      { text: 'Thanks. We\'re still checking it, and we\'ll come back to you on Friday.', ok: true, why: 'Right. No rush and no eagerness, so the decision stays in System 2. If he wants the deal, he waits.' },
      { text: 'Knock 10% off and we\'ll sign this minute.', why: 'A quick counter-offer is still a System 1 move. It races the clock instead of checking the offer.' }
    ] } },
    async enter(api) {
      await api.set({ ...AFTER_SUM, drivers: true, power: 1, supplier: 'desk', sign: 'friday', clock: 'stopped', notes: 5, fast: 1.5, slow: 1.2 });
      api.faces('think', 'happy');
    },
    async done(api) {
      api.engines(1, 2);
      api.faces('grin', 'grin');
      await Promise.all([api.hop('max', [-4.8, -1.9], 800), api.hop('libby', [4.8, -1.9], 800)]);
      api.chars.supplier.pose('shrug');
      api.later(1500, () => api.chars.supplier.pose('idle'));
    }
  },
  {
    id: 'end', title: 'What you just learned',
    lines: [
      { who: 'max', text: 'So my hare is quick, but it isn\'t always right.' },
      { who: 'libby', text: 'Next time someone rushes you, slow down and let System 2 check the sum. See you in the next lesson!' }
    ],
    summary: [
      'Real people depart from rational models in predictable ways, pushed by <b>social</b>, <b>cognitive</b> and <b>emotional</b> drivers.',
      'The weaker your position, the more these effects are your toolkit.',
      'Slow down: pressure is designed to keep you in fast mode, <b>System 1</b>. Give <b>System 2</b> the time to check.'
    ],
    cam: OVER, task: null,
    async enter(api) {
      await api.set({ ...AFTER_SUM, drivers: true, power: 1, supplier: 'desk', sign: 'friday', clock: 'stopped', notes: 5, fast: 1.5, slow: 1.2 });
      api.faces('happy', 'grin'); api.poses('wave', 'idle');
    }
  }
];
