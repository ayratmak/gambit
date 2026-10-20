/* 3D mini-lesson: The four levers. Course: Changing the Game, lesson "Don't play the game, design it".
   Max buys for a hotel group and haggles harder; Libby stands at a control desk with four levers (Players, Rules,
   Timing, Pie) and changes the game instead. The sorting moves and the "three or six suppliers" decision use the
   same moves and numbers as the text lesson in assets/courses/strategy.js, so the two agree. */
import { stage, scenery, prop, cast, V, THREE, box, animate, CAST } from './kit.js';

export const meta = {
  id: 'four-levers',
  title: 'The four levers',
  course: 'strategy', lesson: 'design-the-game',
  minutes: 7
};

const LEVERS = ['players', 'rules', 'timing', 'pie'];
const LEVER_NAME = { players: 'Players', rules: 'Rules', timing: 'Timing', pie: 'Pie' };
const LEVER_X = [3.4, 4.8, 6.2, 7.6];
const DESK = [5.5, 1.0];          // desk centre x, z
const TABLE = [-4.5, .4];         // games table centre x, z
const TOP = .97;                  // table surface height
const BOOTH_X = [-8.75, -5.25, -1.75, 1.75, 5.25, 8.75], BOOTH_Z = -5.9;

// Where people stand: at the game (Max at the table, Libby at the desk) or out front for the furniture tender
const SPOTS = {
  game: { max: [-7, 1.6], libby: [5.5, -.9] },
  front: { max: [-2.4, 4.7], libby: [2.4, 4.7] }
};
const EXTRA_AT = { supplierA: [-2, 1.6], supplierB: [-4.5, -2.1], partner: [-8.9, .2] };
const OFFSTAGE = { supplierB: [-11.8, -2.1], partner: [-11.8, .2] };

const extra = (name, o) => ({ ...CAST.detective, name, hat: null, moustache: false, coat: false, height: 1, hairStyle: 'short', ...o });
const SPECS = {
  supplierA: extra('Supplier A', { skin: '#E0B08E', hair: '#5A4A3E', top: '#8C8478', topDark: '#6E675D', trousers: '#3A3631', moustache: true }),
  supplierB: extra('Supplier B', { skin: '#B07A55', hair: '#2B2724', top: '#7D8A93', topDark: '#64707A', trousers: '#34383D' }),
  partner: extra('Partner hotel', { skin: '#D9A47F', hair: '#77706A', top: '#8E7F92', topDark: '#706376', trousers: '#3B3740', glasses: true })
};

export function build(w) {
  const { mat } = w;
  stage(w, { width: 26, depth: 18 });
  const api = { state: { power: false, pulled: [], locked: false, booths: 'off', spot: 'game', partner: false, extras: true } };
  const camFor = c => (w.camera.aspect < 1 ? c.phone : c.wide);
  api.look = (c, ms = 1000) => w.look(...camFor(c), ms);
  api.wait = ms => new Promise(r => setTimeout(r, ms));

  /* ---------- The games room: a rug, the round games table, chips and cards ---------- */
  const room = new THREE.Group();
  const rug = new THREE.Mesh(new THREE.CylinderGeometry(3.6, 3.6, .03, 64), mat('floor'));
  rug.position.set(TABLE[0], .015, TABLE[1]); room.add(rug);
  const rugEdge = new THREE.Mesh(new THREE.TorusGeometry(3.45, .04, 6, 80), mat('muted'));
  rugEdge.rotation.x = Math.PI / 2; rugEdge.position.set(TABLE[0], .04, TABLE[1]); room.add(rugEdge);
  const wood = mat('wood'), felt = mat('water'), rim = mat('wood');
  const foot = new THREE.Mesh(new THREE.CylinderGeometry(.9, 1, .1, 40), wood); foot.position.set(TABLE[0], .05, TABLE[1]); room.add(foot);
  const post = new THREE.Mesh(new THREE.CylinderGeometry(.28, .38, .8, 24), wood); post.position.set(TABLE[0], .45, TABLE[1]); room.add(post);
  const top = new THREE.Mesh(new THREE.CylinderGeometry(2.05, 2.05, .12, 64), rim); top.position.set(TABLE[0], .88, TABLE[1]); room.add(top);
  const cloth = new THREE.Mesh(new THREE.CylinderGeometry(1.85, 1.85, .04, 64), felt); cloth.position.set(TABLE[0], .95, TABLE[1]); room.add(cloth);
  // betting chips in front of Max and Supplier A
  const chipA = mat('gold'), chipB = mat('accent'), chipC = mat('paper');
  [[-6, .9, 5], [-5.75, 1.25, 3], [-3.1, .95, 4], [-3.3, 1.3, 2]].forEach(([x, z, n]) => {
    for (let i = 0; i < n; i++) { const c = new THREE.Mesh(new THREE.CylinderGeometry(.16, .16, .05, 20), [chipA, chipB, chipC][i % 3]); c.position.set(x, TOP + .03 + i * .055, z); room.add(c); }
  });
  // a few playing cards face down
  const cardM = mat('paper');
  [[-5.4, -.5, .4], [-5.1, -.6, -.2], [-3.7, -.5, .7]].forEach(([x, z, r]) => { const c = box(.36, .012, .5, cardM, x, TOP, z); c.rotation.y = r; room.add(c); });
  scenery(w, room);

  // Pot plants at the corners, to make it a room
  const plants = new THREE.Group();
  for (const [x, z] of [[-11.2, -2.6], [11.3, -2.4], [-11.4, 6.6]]) {
    const pot = new THREE.Mesh(new THREE.CylinderGeometry(.42, .32, .7, 20), mat('muted')); pot.position.set(x, .35, z); plants.add(pot);
    [[0, 1.15, 0, .55], [.25, 1.45, .1, .4], [-.2, 1.5, -.1, .38], [0, 1.75, 0, .3]].forEach(([dx, y, dz, r]) => {
      const leaf = new THREE.Mesh(new THREE.SphereGeometry(r, 18, 12), mat('#6F8F6A')); leaf.position.set(x + dx, y, z + dz); plants.add(leaf);
    });
  }
  scenery(w, plants);

  /* ---------- The rule card on the table: it flips when the Rules lever is pulled ---------- */
  const ruleG = new THREE.Group();
  const ruleFlip = new THREE.Group(); ruleG.add(ruleFlip);
  const stand = box(.5, .06, .2, mat('wood'), 0, 0, 0); ruleG.add(stand);
  const faceOld = mat('paper'), faceNew = mat('gold'), inkOld = mat('muted'), inkNew = mat('ink');
  ruleFlip.add(box(.8, .58, .03, faceOld, 0, .06, .02));
  ruleFlip.add(box(.8, .58, .03, faceNew, 0, .06, -.02));
  for (let k = 0; k < 4; k++) {
    ruleFlip.add(box(k ? .56 : .36, .035, .01, inkOld, k ? 0 : -.1, .5 - k * .11, .04));
    ruleFlip.add(box(k ? .56 : .36, .035, .01, inkNew, k ? 0 : .1, .5 - k * .11, -.04));
  }
  ruleG.position.set(-3.55, TOP, 1.45); ruleG.rotation.y = -.35;
  const rule = prop(w, 'rule', ruleG, 'Rule: haggle again and again', 1.05);
  api.rule = on => { ruleFlip.rotation.y = on ? Math.PI : 0; rule.label.set(on ? 'Rule: scores published first' : 'Rule: haggle again and again'); };
  api.flipRule = async () => {
    let swapped = false;
    await animate(900, k => {
      ruleFlip.rotation.y = k * Math.PI; ruleFlip.position.y = Math.sin(k * Math.PI) * .45;
      if (k > .5 && !swapped) { swapped = true; rule.label.set('Rule: scores published first'); }
    });
  };

  /* ---------- The pie: three small tarts that merge into one big pie ---------- */
  const pieG = new THREE.Group();
  const crust = mat('wood'), filling = mat('gold'), lattice = mat('paper');
  const tart = () => {
    const g = new THREE.Group();
    const c = new THREE.Mesh(new THREE.CylinderGeometry(.34, .28, .16, 28), crust); c.position.y = .08; g.add(c);
    const f = new THREE.Mesh(new THREE.CylinderGeometry(.29, .29, .03, 28), filling); f.position.y = .165; g.add(f);
    for (const a of [0, Math.PI / 2]) { const b = box(.5, .02, .05, lattice, 0, .17, 0); b.rotation.y = a; g.add(b); }
    return g;
  };
  const TART_AT = [[-.55, .25], [.55, .25], [0, -.5]];
  const tarts = TART_AT.map(([x, z]) => { const t = tart(); t.position.set(x, 0, z); pieG.add(t); return t; });
  const big = new THREE.Group();
  const bc = new THREE.Mesh(new THREE.CylinderGeometry(.95, .8, .28, 48), crust); bc.position.y = .14; big.add(bc);
  const bf = new THREE.Mesh(new THREE.CylinderGeometry(.84, .84, .04, 48), filling); bf.position.y = .29; big.add(bf);
  for (let k = 0; k < 4; k++) { const b = box(1.6, .03, .07, lattice, 0, .3, 0); b.rotation.y = k * Math.PI / 4; big.add(b); }
  const crimp = new THREE.Mesh(new THREE.TorusGeometry(.9, .06, 8, 48), crust); crimp.rotation.x = Math.PI / 2; crimp.position.y = .29; big.add(crimp);
  pieG.add(big);
  pieG.position.set(TABLE[0], TOP, TABLE[1] - .1);
  const pie = prop(w, 'pie', pieG, '3 small contracts', .95);
  api.pie = on => {
    tarts.forEach((t, i) => { t.visible = !on; t.position.set(TART_AT[i][0], 0, TART_AT[i][1]); t.scale.setScalar(1); });
    big.visible = on; big.scale.setScalar(1);
    pie.label.set(on ? '1 big contract' : '3 small contracts');
  };
  api.bakePie = async () => {
    await animate(800, k => tarts.forEach((t, i) => { t.position.set(TART_AT[i][0] * (1 - k), Math.sin(k * Math.PI) * .5, TART_AT[i][1] * (1 - k)); t.scale.setScalar(1 - k * .5); }));
    tarts.forEach(t => { t.visible = false; });
    big.visible = true; pie.label.set('1 big contract');
    await animate(700, k => big.scale.setScalar(.2 + k * .8 + Math.sin(k * Math.PI) * .25));
  };

  /* ---------- The chess clock: rises out of the table when the Timing lever is pulled ---------- */
  const clockG = new THREE.Group();
  const clockBody = mat('mask'), dialM = mat('paper'), handM = mat('ink'), btnA = mat('gold'), btnB = mat('accent');
  clockG.add(box(.95, .42, .36, clockBody, 0, 0, 0, .06));
  const hands = [];
  for (const [x, b] of [[-.23, btnA], [.23, btnB]]) {
    const dial = new THREE.Mesh(new THREE.CylinderGeometry(.16, .16, .03, 28), dialM);
    dial.rotation.x = Math.PI / 2; dial.position.set(x, .22, .19); clockG.add(dial);
    const h = new THREE.Group(); h.position.set(x, .22, .21);
    h.add(box(.02, .13, .01, handM, 0, 0, 0)); clockG.add(h); hands.push(h);
    const btn = new THREE.Mesh(new THREE.CylinderGeometry(.07, .07, .08, 16), b); btn.position.set(x, .46, 0); clockG.add(btn);
  }
  clockG.position.set(-5.55, TOP, 1.35); clockG.rotation.y = .3;
  const clock = prop(w, 'clock', clockG, 'Quiet quarter', 1);
  api.clockSpeed = .6;
  w.onTick((t, dt) => { if (clockG.visible) hands.forEach((h, i) => { h.rotation.z -= dt * api.clockSpeed * (i ? 1 : 12); }); });
  api.clock = text => { clock.show(!!text); if (text) { clock.label.set(text); clockG.position.y = TOP; clockG.scale.setScalar(1); } };
  api.raiseClock = async text => {
    clock.show(true); clock.label.set(text);
    await animate(800, k => { clockG.position.y = TOP - .5 + k * .5 + Math.sin(k * Math.PI) * .4; clockG.scale.setScalar(Math.max(.01, k)); });
  };
  api.whirl = async () => { api.clockSpeed = 14; await api.wait(1400); api.clockSpeed = .6; };

  /* ---------- The control desk with four levers ---------- */
  const desk = new THREE.Group();
  desk.add(box(5.8, 1.0, 1.7, mat('surface'), DESK[0], 0, DESK[1], .15));
  desk.add(box(6.0, .08, 1.9, mat('raised'), DESK[0], .98, DESK[1], .12));
  desk.add(box(6.0, .35, .35, mat('surface'), DESK[0], 1.06, .3, .1));
  desk.add(box(5.9, .06, .04, mat('muted'), DESK[0], .1, 1.86));
  for (const x of [2.85, 8.15]) { const knob = new THREE.Mesh(new THREE.CylinderGeometry(.12, .12, .08, 18), mat('muted')); knob.position.set(x, 1.1, 1.5); desk.add(knob); }
  scenery(w, desk);

  const KNOB = { players: 'accent', rules: 'gold', timing: 'water', pie: 'wood' };
  api.levers = {};
  LEVERS.forEach((name, i) => {
    const g = new THREE.Group();
    g.add(box(.55, .06, .8, mat('mask'), 0, 1.04, -.75, .05));                                   // slot
    g.add(box(1.15, .4, .03, mat('paper'), 0, .35, .02, .05));                                   // name plate on the desk front
    const pivot = new THREE.Group(); pivot.position.set(0, 1.1, -.75); g.add(pivot);
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(.055, .055, 1.05, 14), mat('muted')); shaft.position.y = .52; pivot.add(shaft);
    const knob = new THREE.Mesh(new THREE.SphereGeometry(.21, 24, 16), mat(KNOB[name], { roughness: .4 })); knob.position.y = 1.08; pivot.add(knob);
    const lampM = mat(KNOB[name], { emissive: new THREE.Color('#FFE6A0'), emissiveIntensity: 0, roughness: .3 });
    const lamp = new THREE.Mesh(new THREE.SphereGeometry(.14, 18, 12), lampM); lamp.position.set(0, 1.53, -1.56); lamp.userData.noGlow = true; g.add(lamp);
    // padlock, for the night before
    const lock = new THREE.Group();
    lock.add(box(.34, .28, .12, mat('gold'), 0, 0, 0, .04));
    const shackle = new THREE.Mesh(new THREE.TorusGeometry(.1, .03, 8, 20, Math.PI), mat('muted')); shackle.position.y = .28; lock.add(shackle);
    lock.position.set(0, 1.2, -.3); lock.visible = false; g.add(lock);
    g.position.set(LEVER_X[i], 0, 1.86);
    const p = prop(w, 'lever-' + name, g, LEVER_NAME[name], .55, 'axis');
    pivot.rotation.x = -.5;
    api.levers[name] = { p, pivot, lamp, lock };
  });
  const lampLevel = name => (!api.state.power ? 0 : api.state.pulled.includes(name) ? 1.1 : .18);
  api.lamps = () => LEVERS.forEach(n => { api.levers[n].lamp.material.emissiveIntensity = lampLevel(n); });
  api.powerOn = async () => {
    api.state.power = true;
    for (const n of LEVERS) { await animate(260, k => { api.levers[n].lamp.material.emissiveIntensity = 1.2 - k * (1.2 - lampLevel(n)); }); }
  };
  api.pull = async name => {
    const L = api.levers[name];
    await animate(650, k => { L.pivot.rotation.x = -.5 + k * 1.0 + Math.sin(k * Math.PI) * .15; });
    if (!api.state.pulled.includes(name)) api.state.pulled.push(name);
    await animate(400, k => { L.lamp.material.emissiveIntensity = .18 + k * .92 + Math.sin(k * Math.PI) * .6; });
  };
  api.wiggle = async names => {
    await animate(900, k => names.forEach(n => { const L = api.levers[n], base = api.state.pulled.includes(n) ? .5 : -.5; L.pivot.rotation.x = base + Math.sin(k * Math.PI * 4) * .18 * (1 - k); }));
  };
  api.unlock = async () => {
    await animate(700, k => LEVERS.forEach((n, i) => { const lk = api.levers[n].lock; lk.position.y = 1.2 - k * k * 1.3; lk.rotation.z = k * (i % 2 ? 1.2 : -1.2); }));
    LEVERS.forEach(n => { const lk = api.levers[n].lock; lk.visible = false; lk.position.y = 1.2; lk.rotation.z = 0; });
    api.state.locked = false;
  };

  /* ---------- The furniture tender: six supplier booths, the design team's bench and the quote board ---------- */
  api.booths = BOOTH_X.map((x, i) => {
    const g = new THREE.Group(), role = ['gold', 'water', 'accent'][i % 3];
    g.add(box(2.8, 2.3, .1, mat('raised'), 0, 0, -.3));                                          // back panel
    g.add(box(2.8, 1.0, 1.0, mat('surface'), 0, 0, .3, .1));                                      // counter
    g.add(box(2.82, .18, .02, mat(role), 0, .66, .81));                                           // stripe
    for (const px of [-1.32, 1.32]) { const pst = new THREE.Mesh(new THREE.CylinderGeometry(.06, .06, 2.6, 10), mat('wood')); pst.position.set(px, 1.3, .75); g.add(pst); }
    const awn = box(3.1, .12, 1.4, mat(role), 0, 2.55, .2, .05); awn.rotation.x = .16; g.add(awn);
    g.add(box(1.7, .42, .05, mat('paper'), 0, 2.05, -.22, .05));                                  // name board
    // a sample armchair on the counter
    const fab = mat(['accent', 'gold', 'water'][i % 3]), leg = mat('wood');
    g.add(box(.7, .2, .6, fab, 0, 1.08, .3, .06));
    g.add(box(.7, .55, .14, fab, 0, 1.12, .04, .06));
    for (const ax of [-.36, .36]) g.add(box(.12, .32, .6, fab, ax, 1.08, .3, .04));
    for (const [lx, lz] of [[-.28, .05], [.28, .05], [-.28, .55], [.28, .55]]) g.add(box(.06, .08, .06, leg, lx, 1.0, lz));
    g.position.set(x, 0, BOOTH_Z);
    const p = prop(w, 'booth-' + i, g, 'Supplier ' + (i + 1), 3.05);
    p.show(false);
    return { p, g };
  });
  api.dimBooth = (i, on) => api.booths[i].g.traverse(o => { if (o.isMesh) { o.material.transparent = true; o.material.opacity = on ? .22 : 1; } });

  const teamG = new THREE.Group();
  const benchWood = mat('wood');
  teamG.add(box(2.7, .08, 1.0, benchWood, 0, .74, 0, .05));
  for (const [lx, lz] of [[-1.2, -.4], [1.2, -.4], [-1.2, .4], [1.2, .4]]) teamG.add(box(.09, .74, .09, benchWood, lx, 0, lz));
  api.swatches = [];
  const swM = [mat('accent'), mat('gold'), mat('water')];
  for (let i = 0; i < 6; i++) { const s = box(.3, .1 + (i % 3) * .04, .3, swM[i % 3], -1.0 + i * .4, .82, -.15, .04); teamG.add(s); api.swatches.push(s); }
  const glassRing = new THREE.Mesh(new THREE.TorusGeometry(.17, .03, 8, 24), mat('ink')); glassRing.rotation.x = -Math.PI / 2 + .3; glassRing.position.set(.7, .9, .28); teamG.add(glassRing);
  const glassHandle = box(.05, .05, .32, mat('wood'), .7, .86, .55); teamG.add(glassHandle);
  teamG.add(box(.5, .02, .36, mat('paper'), -.7, .82, .28));
  teamG.position.set(0, 0, 4.5);
  api.team = prop(w, 'team', teamG, 'Design team', 1.6);
  api.teamCapacity = n => api.swatches.forEach((s, i) => { s.visible = i < n; });

  const easel = new THREE.Group();
  const eLeg = mat('wood');
  for (const [lx, rz] of [[-.75, .12], [.75, -.12]]) { const l = box(.08, 2.3, .08, eLeg, lx, 0, 0); l.rotation.z = rz; easel.add(l); }
  const back = box(.08, 2.2, .08, eLeg, 0, 0, -.55); back.rotation.x = -.25; easel.add(back);
  easel.add(box(1.9, 1.5, .06, mat('paper'), 0, .85, .08, .06));
  const bar3 = box(.5, 1.0, .05, mat('gold'), -.42, 1.0, .14), bar6 = box(.5, .62, .05, mat('accent'), .42, 1.0, .14);
  easel.add(bar3, bar6);
  easel.add(box(1.5, .03, .05, mat('ink'), 0, .99, .14));
  easel.position.set(5.6, 0, 4.4);
  api.quotes = prop(w, 'quotes', easel, 'Expected quote', 2.75);
  api.barGlow = six => { [bar3, bar6].forEach((b, i) => { b.material.transparent = true; b.material.opacity = (i === 1) === six ? 1 : .35; }); };
  api.saving = w.label(null, 'Saves £600k for £150k', V(5.6, 3.35, 4.4), 'sign');
  api.saving.obj.visible = false; api.saving.el.hidden = true;
  api.showSaving = on => { api.saving.obj.visible = on; api.saving.el.hidden = !on; };

  api.boothParts = [api.team, api.quotes];
  api.setBooths = async mode => {
    const was = api.state.booths;
    api.state.booths = mode;
    const on = mode !== 'off';
    api.boothParts.forEach(p => p.show(on));
    api.teamCapacity(mode === 'six' ? 6 : 3);
    api.barGlow(mode === 'six');
    api.showSaving(mode === 'six');
    api.booths.forEach((b, i) => { api.dimBooth(i, mode === 'three' && i >= 3); });
    if (!on) { api.booths.forEach(b => b.p.show(false)); return; }
    if (was !== 'off') { api.booths.forEach(b => { b.p.show(true); b.g.scale.setScalar(1); }); return; }
    api.booths.forEach(b => { b.p.show(true); b.g.scale.set(1, .001, 1); });
    for (const b of api.booths) await animate(260, k => b.g.scale.set(1, Math.max(.001, k + Math.sin(k * Math.PI) * .15), 1));
  };
  api.openUp = async () => {
    api.state.booths = 'six';
    await animate(600, k => [3, 4, 5].forEach(i => api.booths[i].g.traverse(o => { if (o.isMesh) o.material.opacity = .22 + k * .78; })));
    await Promise.all([3, 4, 5].map(i => animate(500, k => { api.booths[i].g.position.y = Math.sin(k * Math.PI) * .6; })));
    api.teamCapacity(6); api.barGlow(true); api.showSaving(true);
  };

  /* ---------- The people ---------- */
  const people = cast(w, {
    max: SPOTS.game.max, libby: SPOTS.game.libby,
    supplierA: { spec: SPECS.supplierA, at: EXTRA_AT.supplierA },
    supplierB: { spec: SPECS.supplierB, at: OFFSTAGE.supplierB },
    partner: { spec: SPECS.partner, at: OFFSTAGE.partner }
  });
  Object.assign(api, people);
  const place = (who, at) => { const r = people.chars[who].root; r.position.set(at[0], .02, at[1]); r.rotation.y = 0; };

  /* Snap the scene to a step's starting state, so ?step=N works. Max and Libby hop if they need to change spot. */
  api.setup = async (o = {}) => {
    const s = { pulled: [], power: true, locked: false, clock: null, partner: false, booths: 'off', spot: 'game', extras: true, ...o };
    api.clearThoughts();
    api.state.power = s.power; api.state.pulled = [...s.pulled]; api.state.locked = s.locked; api.state.partner = s.partner; api.state.extras = s.extras;
    LEVERS.forEach(n => { const L = api.levers[n]; L.pivot.rotation.x = s.pulled.includes(n) ? .5 : -.5; L.lock.visible = s.locked; });
    api.lamps();
    api.rule(s.pulled.includes('rules'));
    api.pie(s.pulled.includes('pie'));
    api.clock(s.clock || (s.pulled.includes('timing') ? 'Quiet quarter' : null));
    api.clockSpeed = .6;
    const b = s.extras && s.pulled.includes('players');
    people.show('supplierA', s.extras); place('supplierA', EXTRA_AT.supplierA);
    people.show('supplierB', b); place('supplierB', b ? EXTRA_AT.supplierB : OFFSTAGE.supplierB);
    people.show('partner', s.partner); place('partner', s.partner ? EXTRA_AT.partner : OFFSTAGE.partner);
    ['supplierA', 'supplierB', 'partner'].forEach(k => { people.chars[k].face('happy'); people.chars[k].pose('idle'); });
    people.poses('idle'); people.faces('happy');
    const moves = [];
    for (const who of ['max', 'libby']) {
      const to = SPOTS[s.spot][who], r = people.chars[who].root;
      if (Math.hypot(r.position.x - to[0], r.position.z - to[1]) > .05) moves.push(people.hop(who, to, 900));
      else r.rotation.y = 0;
    }
    api.state.spot = s.spot;
    await Promise.all([...moves, api.setBooths(s.booths)]);
  };

  return api;
}

/* ---------- State cards ---------- */
const pulledText = (st, n) => st.locked ? 'Locked: no time to pull it before tomorrow' : st.pulled.includes(n) ? 'Pulled' : 'Not pulled yet';
const LEVER_CARD = {
  players: { kicker: 'Lever 1 of 4', title: 'Players', changes: 'Who is in the game', moves: 'Bring a supplier in, take one out, team up with a partner',
    text: 'Bring someone in or take someone out: a second supplier, a new bidder, a partner. One more bidder changes how every other bidder prices.' },
  rules: { kicker: 'Lever 2 of 4', title: 'Rules', changes: 'How the decision gets made', moves: 'Publish the scoring, lowest price wins with no second round',
    text: "In the pirates' game from Course 1, changing only the tie rule moved the split from 98/0/1/0/1 to 97/0/1/2/0. Small rules, big effects." },
  timing: { kicker: 'Lever 3 of 4', title: 'Timing', changes: 'Who moves first, when, and how often', moves: 'Tender in a quiet quarter, every two years instead of every year',
    text: 'The cartel in Course 1 relied on meeting often. Change when and how often the game is played, and you change how it ends.' },
  pie: { kicker: 'Lever 4 of 4', title: 'The pie', changes: "What's at stake", moves: 'Bundle, unbundle, add a feature, lengthen the contract',
    text: 'A five-year contract is a bigger prize than a one-year one, and three small contracts bundled into one are worth fighting harder for.' }
};

export function card(key, ctx) {
  const st = ctx.api.state, tender = st.booths !== 'off';
  if (key.startsWith('lever-')) {
    const n = key.slice(6), L = LEVER_CARD[n];
    return { kicker: L.kicker, title: L.title, rows: [['Changes', L.changes], ['Example moves', L.moves], ['Status', st.power ? pulledText(st, n) : 'Desk switched off']], text: L.text };
  }
  if (key.startsWith('booth-')) {
    const i = +key.slice(6), out = st.booths === 'three' && i >= 3;
    return {
      kicker: 'Furniture tender · qualified supplier', title: 'Supplier ' + (i + 1),
      rows: [['Qualified', 'Yes'], ['Samples checked', out ? 'No, outside the shortlist of three' : st.booths === 'three' ? 'Yes, on the shortlist' : st.booths === 'six' ? 'Yes, all six are checked' : 'Not yet'],
        ['Expected quote', st.booths === 'six' ? 'About £50 a piece, with six bidding' : 'About £56 a piece, with three bidding']],
      text: out ? "Qualified, but cut for lack of checking time. Its absence lets the other three quote higher." : 'One of six suppliers able to make the bedroom furniture. How hard it prices depends on how many rivals it faces.'
    };
  }
  const C = {
    max: tender
      ? { kicker: 'Buyer · hotel group', title: 'Max', rows: [['Buying', '100,000 pieces of bedroom furniture'], ['Qualified suppliers', '6'], ['First instinct', 'Shortlist the best three']], text: 'Max wants to save the £150k. Libby wants to know what the cheaper shortlist costs in prices.' }
      : { kicker: 'Buyer · hotel group', title: 'Max', rows: [['Buying', 'Laundry for the hotels'], ['Bidders', st.pulled.includes('players') ? 'Supplier A and Supplier B' : 'Only Supplier A'], ['Plan', st.pulled.length ? 'Let the new game do the work' : 'Haggle harder']], text: st.pulled.length ? 'Max plays the same hand as before. The game around him has changed, so the same hand now wins.' : 'Max grabs the biggest number in front of him, right now. His idea of strategy is a louder voice and a longer stare.' },
    libby: { kicker: tender ? 'Buyer · hotel group' : 'Game designer · at the levers', title: 'Libby',
      rows: [['Job', 'Change the game before it is played'], ['Levers pulled', st.pulled.length + ' of 4'], ['Rule she keeps', 'Start weeks or months early']],
      text: 'Libby asks where a game ends up. If the answer is bad, she changes the players, the rules, the timing or the pie.' },
    supplierA: { kicker: 'Laundry supplier · the incumbent', title: 'Supplier A',
      rows: [['Rivals', st.pulled.includes('players') ? 'Supplier B' : 'None'], ['Asks for', st.pulled.includes('players') ? 'Whatever beats Supplier B' : 'Last year plus 9%'], ['Waits for', st.pulled.includes('rules') ? 'Nothing: there is no last round now' : 'The last round of haggling']],
      text: st.pulled.includes('players') ? 'Still the same supplier, playing a different game. With a rival at the table, his take-it-or-leave-it price has gone.' : 'As the only bidder, Supplier A can name his price every year. Haggling harder only moves it a little.' },
    supplierB: { kicker: 'Laundry supplier · from another country', title: 'Supplier B',
      rows: [['Invited by', 'The Players lever'], ['Needs to win?', 'No'], ['Effect', 'Supplier A must price against him']],
      text: "Supplier B doesn't have to win to be worth inviting. Just being at the table changes how Supplier A prices." },
    partner: { kicker: 'Another hotel group', title: 'Partner hotel',
      rows: [['Deal', 'Buy laundry jointly with Max'], ['Lever', 'Players'], ['Effect', 'Two buyers become one bigger player']],
      text: 'Nothing about the rules, timing or contract changed. What changed is who is sitting on the buyer side of the table.' },
    rule: st.pulled.includes('rules')
      ? { kicker: 'The rules of the game', title: 'Scores published first', rows: [['Before', 'Haggle round after round'], ['Now', 'Scoring published before bids arrive'], ['Lever', 'Rules']], text: 'Everyone now plays under a known rule. Holding back for a last round no longer pays, so suppliers lead with their best price.' }
      : { kicker: 'The rules of the game', title: 'Haggle again and again', rows: [['How price is set', 'Round after round'], ['Who it suits', 'Supplier A'], ['Why', 'He waits for the last round']], text: 'Under this rule, the best price only appears at the very end, and only a little better than the first.' },
    pie: st.pulled.includes('pie')
      ? { kicker: "What's at stake", title: 'One big contract', rows: [['Before', '3 small contracts, one per hotel'], ['Now', '1 bundled contract'], ['Lever', 'Pie']], text: "You've changed what's at stake. A bigger prize is worth sharpening a price for." }
      : { kicker: "What's at stake", title: 'Three small contracts', rows: [['Contracts', '3, one per hotel'], ['Each worth', 'Not much on its own'], ['Supplier effort', 'Low']], text: 'Three small prizes, each too small to fight hard for.' },
    clock: st.locked || ctx.stepId === 'early'
      ? { kicker: 'Timing · when the game is played', title: st.locked ? 'Tomorrow, 9am' : 'Six weeks out', rows: [['Negotiation', 'Tomorrow morning'], ['Time to change the game', st.locked ? 'One evening' : 'Weeks, if you start early']], text: 'Structural change takes weeks or months. The night before, all that is left is playing the game you are in.' }
      : { kicker: 'Timing · when the game is played', title: 'Quiet quarter', rows: [['When', "The quarter suppliers' factories are quiet"], ['Why it helps', 'Idle factories are hungry for work'], ['Lever', 'Timing']], text: 'Same game, same suppliers, played at a moment that suits you.' },
    team: { kicker: 'Hotel group · checks samples', title: 'Design team',
      rows: [['Can check', st.booths === 'six' ? '6 of 6 suppliers' : '3 of 6 suppliers'], ['Extra assessment time', '£150k'], ['Covers', 'All six sets of samples']],
      text: st.booths === 'six' ? 'Paid for the extra time, so all six suppliers stay in the race.' : 'With the time it has, the team can only check samples from three suppliers. £150k buys time for all six.' },
    quotes: { kicker: '100,000 pieces of bedroom furniture', title: 'Expected quote',
      rows: [['3 bidders', 'About £56 a piece'], ['6 bidders', 'About £50 a piece'], ['Difference', '£6 × 100,000 = £600k'], ['Cost of six', '£150k']],
      text: st.booths === 'six' ? 'Paying £150k to keep six bidders saves about £600k. Competition is worth paying for.' : 'The gold bar is three bidders, the other bar six. More rivals, lower quotes.' }
  };
  return C[key] || { kicker: '', title: key, rows: [], text: '' };
}

/* ---------- Cameras: [position, target] for the wide scene panel and for phones ---------- */
const TABLE_CAM = { wide: [[-4.5, 6.8, 12], [-4.5, 1.1, 0]], phone: [[-4.5, 9.5, 14.5], [-4.5, 1, 0]] };
const TABLE_TOP = { wide: [[-4.4, 5.8, 8.2], [-4.4, .9, .5]], phone: [[-4.4, 8, 10.5], [-4.4, .9, .5]] };
const TABLE_WIDE = { wide: [[-5.2, 7.5, 13.5], [-5.2, 1.1, 0]], phone: [[-5.2, 10.5, 16], [-5.2, 1, 0]] };
const DESK_CAM = { wide: [[5.5, 6, 10.5], [5.5, 1.2, .6]], phone: [[5.5, 8.5, 13], [5.5, 1.1, .6]] };
const BOTH = { wide: [[0, 13.5, 24], [0, 1, .3]], phone: [[0, 19, 25], [0, 1, .3]] };
const BOOTHS = { wide: [[0, 14, 22.5], [0, 1.2, -1.8]], phone: [[0, 22, 27], [0, 1, -2]] };
const OVER = { wide: [[0, 18, 27], [0, .8, -.8]], phone: [[0, 26, 32], [0, .5, -.8]] };

const ALL = ['players', 'rules', 'timing', 'pie'];

/* ---------- The guided tour ---------- */
export const steps = [
  {
    id: 'meet', title: 'One supplier, every year',
    lines: [
      { who: 'max', text: "Hi, I'm Max! I buy laundry for our hotel group, and Supplier A is the only one who ever bids." },
      { who: 'libby', text: "So every year he names a price and Max haggles it down a little. I'm Libby. Today we try something else." }
    ],
    cam: TABLE_CAM, task: { click: ['max', 'supplierA'], all: true, say: 'Click Max, then Supplier A, to see where each one stands.' },
    async enter(api) { await api.setup({ power: false }); api.chars.max.pose('wave'); api.chars.supplierA.face('grin'); await api.wait(2200); api.chars.max.pose('idle'); },
    async done(api) { api.say('supplierA', 'Same as last year, plus 9%. Take it or leave it.', 2800); api.chars.max.face('worried'); api.chars.max.pose('shrug'); await api.wait(1800); api.chars.max.pose('idle'); }
  },
  {
    id: 'three-ways', title: 'Play harder, or change the game?',
    lines: [
      { who: 'libby', text: 'Game theory helps three ways. It helps you <b>avoid mistakes</b>, <b>play the game</b> well, and <b>change the game</b> itself.' },
      { who: 'max', text: 'Play it well! Poker face, louder voice, longer stare. This year I just haggle harder.' }
    ],
    cam: BOTH,
    task: { choice: { q: 'Where does most of the value sit?', options: [
      { text: 'Avoiding mistakes', why: "Useful, and lesson 8 is all about it, but it only stops you losing value." },
      { text: 'Playing the game better', why: 'A brilliant move in a bad game usually loses to an ordinary move in a good one.' },
      { text: 'Changing the game', ok: true, why: "Right. Most of the value sits in reshaping a structure that's working against you." }
    ] } },
    async enter(api) { await api.setup({ power: false }); api.faces('grin', 'think'); api.chars.max.pose('cheer'); api.chars.libby.pose('think'); },
    async done(api) {
      api.poses('idle'); api.faces('surprised', 'happy');
      await api.powerOn();
      api.chars.libby.pose('point'); api.say('libby', 'Desk on. Let me show you.', 2200);
    }
  },
  {
    id: 'desk', title: 'Four levers on the desk',
    lines: [
      { who: 'libby', text: 'This desk changes the game before anyone plays it. Four levers: <b>Players</b>, <b>Rules</b>, <b>Timing</b> and the <b>Pie</b>, meaning what is at stake.' },
      { who: 'max', text: "Four levers, and not one of them says 'haggle harder'?" }
    ],
    cam: DESK_CAM, task: { click: ['lever-players', 'lever-rules', 'lever-timing', 'lever-pie'], all: true, say: 'Click all four levers to see what each one changes.' },
    async enter(api) { await api.setup({}); api.faces('surprised', 'happy'); api.chars.libby.pose('point'); },
    async done(api) { api.chars.libby.pose('cheer'); await api.wiggle(ALL); api.chars.libby.pose('idle'); api.say('libby', "Let's pull them, one at a time.", 2200); }
  },
  {
    id: 'players', title: 'Bring a new player in',
    lines: [
      { who: 'max', text: 'First move: invite a laundry supplier from another country to bid. That changes the rules, right?' },
      { who: 'libby', text: 'Look at what actually changes. Is it how we decide, or who is in the game?' }
    ],
    cam: BOTH,
    task: { pick: { answer: 'lever-players', say: 'Move: invite a supplier from another country to bid. Click the lever it pulls.', wrong: {
      'lever-rules': 'The way the decision gets made stays the same. What changes is who is at the table.',
      'lever-timing': 'Nothing moves in time. A new bidder joins the game.',
      'lever-pie': "The contract is the same size. There's just one more supplier chasing it."
    }, why: 'You add someone to the game. One more bidder, and Supplier A is no longer the only option.' } },
    async enter(api) { await api.setup({}); api.faces('think', 'happy'); },
    async done(api) {
      api.chars.libby.pose('point');
      await api.pull('players');
      api.show('supplierB', true);
      await api.walk('supplierB', [-4.5, -2.1], 1800);
      api.chars.supplierA.face('worried'); api.faces('grin', 'happy'); api.chars.libby.pose('idle');
      api.say('supplierA', "Wait. Who's that?", 2200);
    }
  },
  {
    id: 'rules', title: 'Flip the rule card',
    lines: [
      { who: 'max', text: 'Supplier A always waits for the last round, then shaves a penny off. I could just hold out longer.' },
      { who: 'libby', text: "Or change how the decision gets made, so there's no last round to wait for." }
    ],
    cam: BOTH,
    task: { pick: { answer: 'lever-rules', say: 'Move: publish how bids will be scored before they arrive. Click the lever it pulls.', wrong: {
      'lever-players': 'Nobody joins or leaves. Everyone now plays under a known rule.',
      'lever-timing': "The tender date doesn't move. The scoring does.",
      'lever-pie': "The prize is the same size. Only the way it's awarded changes."
    }, why: 'Everyone now plays under a known rule, so holding back for a last round no longer pays.' } },
    async enter(api) { await api.setup({ pulled: ['players'] }); api.faces('think', 'happy'); },
    async done(api) {
      api.chars.libby.pose('point');
      await api.pull('rules');
      await api.look(TABLE_TOP, 900);
      await api.flipRule();
      api.chars.libby.pose('idle'); api.faces('surprised', 'happy'); api.chars.supplierA.face('worried');
    }
  },
  {
    id: 'timing', title: 'Pick your moment',
    lines: [
      { who: 'max', text: "Next: hold the tender in the quarter when suppliers' factories are quiet. Juicier deal, so that's the Pie!" },
      { who: 'libby', text: 'Same contract, same size. What changes is <b>when</b> we play.' }
    ],
    cam: BOTH,
    task: { pick: { answer: 'lever-timing', say: "Move: hold the tender in the quarter when suppliers' factories are quiet. Click the lever it pulls.", wrong: {
      'lever-players': 'Nobody new arrives. The same suppliers bid, at a moment that suits you.',
      'lever-rules': 'The scoring stays as published. Only the date moves.',
      'lever-pie': 'The contract is the same size. Quiet factories just make suppliers keener.'
    }, why: 'Same game, played at a moment that suits you. Quiet factories are hungry for work.' } },
    async enter(api) { await api.setup({ pulled: ['players', 'rules'] }); api.faces('grin', 'think'); },
    async done(api) {
      api.chars.libby.pose('point');
      await api.pull('timing');
      await api.look(TABLE_TOP, 900);
      await api.raiseClock('Quiet quarter');
      api.chars.libby.pose('idle'); api.faces('happy', 'happy');
      api.say('supplierB', 'Quiet factory. I need this work.', 2400);
    }
  },
  {
    id: 'pie', title: 'Bake a bigger pie',
    lines: [
      { who: 'max', text: "Last one: bundle three small laundry contracts, one per hotel, into one large one. That's Players, fewer contracts!" },
      { who: 'libby', text: "Same suppliers, same rules, same date. What's changed is the <b>prize</b>." }
    ],
    cam: BOTH,
    task: { pick: { answer: 'lever-pie', say: 'Move: bundle three small contracts into one large one. Click the lever it pulls.', wrong: {
      'lever-players': 'The same suppliers are at the table. The prize is what got bigger.',
      'lever-rules': 'The award rules are unchanged. There is just more to win.',
      'lever-timing': 'Nothing moves in time. One big contract replaces three small ones.'
    }, why: "You've changed what's at stake. A bigger prize makes every supplier sharpen its price." } },
    async enter(api) { await api.setup({ pulled: ['players', 'rules', 'timing'] }); api.faces('grin', 'think'); },
    async done(api) {
      api.chars.libby.pose('point');
      await api.pull('pie');
      await api.look(TABLE_TOP, 900);
      await api.bakePie();
      ['supplierA', 'supplierB'].forEach(k => { api.chars[k].face('grin'); api.chars[k].pose('cheer'); });
      api.faces('grin', 'happy'); api.chars.libby.pose('idle');
      await api.wait(1600);
      ['supplierA', 'supplierB'].forEach(k => api.chars[k].pose('idle'));
    }
  },
  {
    id: 'jointly', title: 'Team up with a partner',
    lines: [
      { who: 'max', text: 'I have one of my own. Our hotel group teams up with another hotel group, and we buy laundry together.' },
      { who: 'libby', text: 'Nice. Before you answer, think about who is now sitting on our side of the table.' }
    ],
    cam: TABLE_WIDE,
    task: { choice: { q: 'Max agrees with a partner to buy jointly. Which lever is that?', options: [
      { text: 'Players', ok: true, why: 'Right. Two buyers become one bigger player.' },
      { text: 'Rules', why: "The award rules haven't changed. The buyer side of the table has." },
      { text: 'Timing', why: 'Nothing moves in time. The tender runs when it was going to.' },
      { text: 'Pie', why: 'Tempting, since the order gets bigger. But the main change is who is playing: two buyers become one.' }
    ] } },
    async enter(api) { await api.setup({ pulled: ALL }); api.faces('grin', 'think'); api.chars.max.pose('point'); },
    async done(api) {
      api.chars.max.pose('idle');
      api.show('partner', true);
      await api.walk('partner', [-8.9, .2], 1500);
      api.chars.max.pose('cheer'); api.faces('grin', 'happy'); api.chars.supplierA.face('surprised'); api.chars.supplierB.face('surprised');
      await api.wiggle(['players']);
      api.chars.max.pose('idle');
    }
  },
  {
    id: 'early', title: 'Not the night before',
    lines: [
      { who: 'max', text: 'Libby, I negotiate the next contract tomorrow at 9. Make me strong by then!' },
      { who: 'libby', text: 'Good luck. Bringing in bidders, rewriting rules, moving dates: changing the game takes <b>weeks or months</b>, not one evening.' }
    ],
    cam: BOTH,
    task: { choice: { q: 'Max negotiates tomorrow morning. Which lever can he still pull properly tonight?', options: [
      { text: 'Players: invite a new supplier tonight', why: 'A new supplier needs weeks to get qualified and put a real quote together.' },
      { text: 'Rules: rewrite the scoring overnight', why: 'The suppliers have priced for the old rules, and a switch the night before looks like a trick.' },
      { text: 'Pie: bundle in more contracts', why: 'Bundling needs the other hotels to agree first. That takes weeks too.' },
      { text: 'Realistically none. He needed to start weeks ago', ok: true, why: "Right. Structural change takes weeks or months. You can't restructure a game the night before." }
    ] } },
    async enter(api) { await api.setup({ locked: true, clock: 'Tomorrow, 9am' }); api.faces('worried', 'think'); api.chars.max.pose('shrug'); api.clockSpeed = 3; },
    async done(api) {
      api.chars.max.pose('idle');
      await api.whirl();
      api.clock('Six weeks out');
      await api.unlock();
      api.faces('happy', 'grin'); api.chars.libby.pose('cheer');
      api.say('libby', 'Start six weeks out, and every lever is yours.', 2600);
      await api.wait(1800); api.chars.libby.pose('idle');
    }
  },
  {
    id: 'booths', title: 'Six suppliers want the job',
    lines: [
      { who: 'libby', text: 'New game. Our hotel group is buying <b>100,000 pieces</b> of bedroom furniture, and <b>6 suppliers</b> are qualified to make it.' },
      { who: 'max', text: 'Snag: our design team can only check samples from 3 of them, unless we pay <b>£150k</b> for extra assessment time.' }
    ],
    cam: BOOTHS, task: { click: ['team', 'quotes'], all: true, say: 'Click the design team, then the quote board.' },
    async enter(api) { await api.setup({ pulled: ALL, spot: 'front', extras: false, booths: 'all' }); api.faces('happy', 'happy'); api.chars.libby.pose('point'); await api.wait(1500); api.chars.libby.pose('idle'); },
    async done(api) { api.faces('think', 'think'); api.think('max', '£150k is a lot...'); }
  },
  {
    id: 'three-or-six', title: 'Three or six?',
    lines: [
      { who: 'max', text: 'Easy. Shortlist the best three and keep the £150k. They are the best anyway!' },
      { who: 'libby', text: 'The best three quote higher when they know there are only three. Do the sums first.' }
    ],
    cam: BOOTHS,
    task: { choice: { q: 'Three bidders should quote about £56 a piece; six, about £50. Checking all six costs £150k extra. What should the hotel group do?', options: [
      { text: "Shortlist three, they're the best anyway", why: 'The best three quote higher when they know there are only three.' },
      { text: 'Pay the £150k and keep all six', ok: true, why: 'Right. £6 a piece on 100,000 pieces is £600k, for £150k. Competition is worth paying for.' },
      { text: 'Shortlist three and tell them there are six', why: "Bluffing about competition backfires when it's found out. And it usually is." },
      { text: 'Delay the decision', why: "Delay doesn't create more bidders." }
    ] } },
    async enter(api) { await api.setup({ pulled: ALL, spot: 'front', extras: false, booths: 'three' }); api.faces('grin', 'think'); api.chars.max.pose('point'); },
    async done(api) {
      api.chars.max.pose('idle'); api.clearThoughts();
      await api.openUp();
      api.faces('surprised', 'grin'); api.chars.libby.pose('cheer');
      api.say('max', 'Spend £150k, save £600k? Fine, you win.', 2600);
      await api.wait(1800); api.chars.libby.pose('idle'); api.chars.max.face('grin');
    }
  },
  {
    id: 'end', title: 'What you just learned',
    lines: [
      { who: 'max', text: 'So I stop haggling harder and start pulling levers, weeks before the game.' },
      { who: 'libby', text: 'Players, rules, timing, pie. Next lesson: why tying your own hands can make you stronger.' }
    ],
    summary: [
      'Most value is created before the negotiation, by deciding which game gets played.',
      'You can change the <b>players</b>, the <b>rules</b>, the <b>timing</b> or the <b>pie</b>.',
      "Start early: you can't restructure a game the night before."
    ],
    cam: OVER, task: null,
    async enter(api) { await api.setup({ pulled: ALL, spot: 'front', partner: true, booths: 'six' }); api.faces('happy', 'grin'); api.poses('wave', 'idle'); }
  }
];
