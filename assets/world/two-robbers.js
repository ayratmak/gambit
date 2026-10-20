/* 3D mini-lesson: The two robbers. Course: Think Three Moves Ahead, lesson "Dominant strategies and the prisoner's dilemma".
   Same payoffs as the matrix step in assets/courses/foundations.js, so the 3D lesson and the text lesson agree. */
import { THREE, box, stack, animate } from './engine.js';
import { CAST, makeCharacter } from './characters.js';

export const meta = {
  id: 'two-robbers',
  title: 'The two robbers',
  course: 'foundations', lesson: 'dominant-strategies',
  minutes: 7
};

const V = (x, y, z) => new THREE.Vector3(x, y, z);

const GAMES = {
  robbers: {
    rows: ['Max denies', 'Max confesses'], cols: ['Libby denies', 'Libby confesses'],
    pay: [[[1, 1], [10, 0]], [[0, 10], [7, 7]]], // years in prison: [Max, Libby]
    unit: 'years', fmt: n => n === 0 ? 'free' : n + (n === 1 ? ' yr' : ' yrs')
  },
  cafes: {
    rows: ['Max charges £3', 'Max charges £2'], cols: ['Libby charges £3', 'Libby charges £2'],
    pay: [[[6, 6], [2, 8]], [[8, 2], [4, 4]]], // daily profit in £100s: [Max, Libby]
    unit: '£100s a day', fmt: n => '£' + n * 100
  }
};

// Board geometry: column x and row z centres
const BX = [-5.65, -1.35], BZ = [3.15, 6.05], ROOM_A = -7.75, ROOM_B = .25;

export function build(w) {
  const { scene, mat, thing, label, bubble } = w;
  const api = { game: 'robbers', stacks: [], stackLabels: [] };

  /* ---------- Ground: a paper diorama on a plinth, with a river cut into the right side ---------- */
  const base = new THREE.Group();
  const plinth = mat('raised'), bed = mat('floor');
  base.add(box(21.8, 1.2, 18, plinth, -2.1, -1.2, 0, .5));
  base.add(box(4, .6, 18, bed, 10.8, -1.2, 0));
  base.add(box(1.2, 1.2, 18, plinth, 13.4, -1.2, 0, .3));
  base.traverse(o => { if (o.isMesh) { o.receiveShadow = true; o.userData.noPick = true; } });
  scene.add(base);

  /* ---------- The two interrogation rooms ---------- */
  const rooms = new THREE.Group();
  const wallM = mat('surface'), floorA = mat('floor'), floorB = mat('floor');
  rooms.add(box(6.6, .06, 6, floorA, ROOM_A, 0, -5));
  rooms.add(box(6.6, .06, 6, floorB, ROOM_B, 0, -5));
  rooms.add(box(15.4, 2.6, .4, wallM, -3.75, 0, -8.2));          // back wall
  rooms.add(box(.4, 1.3, 6.4, wallM, -11.25, 0, -5));            // outer side walls, kept low so you can see in
  rooms.add(box(.4, 1.3, 6.4, wallM, 3.75, 0, -5));
  rooms.traverse(o => { if (o.isMesh) { o.castShadow = o.receiveShadow = true; o.userData.noPick = true; } });
  scene.add(rooms);

  // Room signs on the back wall
  const signs = [label(null, 'Room 1', V(ROOM_A, 3, -8), 'sign'), label(null, 'Room 2', V(ROOM_B, 3, -8), 'sign')];

  // The wall between the rooms: its own clickable thing
  const wall = new THREE.Group();
  const brick = mat('muted');
  wall.add(box(.5, 2.6, 6.2, mat('surface'), 0, 0, 0));
  for (let r = 0; r < 4; r++) for (let c = 0; c < 6; c++) wall.add(box(.52, .04, .02, brick, 0, .6 * r + .3, -3 + c + (r % 2) * .5)); // brick lines
  wall.position.set(-3.75, 0, -5);
  scene.add(thing('wall', wall));

  // Tables, lamps and the deal on each table
  const deals = {};
  for (const [key, cx] of [['deal-a', ROOM_A], ['deal-b', ROOM_B]]) {
    const wood = mat('wood');
    const t = new THREE.Group();
    t.add(box(2.4, .08, 1.4, wood, 0, .82, 0));
    for (const [dx, dz] of [[-1.05, -.55], [1.05, -.55], [-1.05, .55], [1.05, .55]]) t.add(box(.1, .82, .1, wood, dx, 0, dz));
    t.position.set(cx, 0, -5.6); t.traverse(o => { if (o.isMesh) { o.castShadow = o.receiveShadow = true; o.userData.noPick = true; } });
    scene.add(t);
    // hanging lamp
    const lampM = mat('mask'), glowM = mat('paper', { emissive: new THREE.Color('#fff4d6'), emissiveIntensity: .9 });
    const lamp = new THREE.Group();
    lamp.add(new THREE.Mesh(new THREE.ConeGeometry(.45, .4, 24, 1, true), lampM)); lamp.children[0].material.side = THREE.DoubleSide;
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(.14, 16, 10), glowM); bulb.position.y = -.12; lamp.add(bulb);
    const cord = box(.03, 1.6, .03, lampM, 0, .2, 0); lamp.add(cord);
    lamp.position.set(cx, 3.3, -5.6); lamp.traverse(o => { o.userData.noPick = true; });
    scene.add(lamp);
    // the deal: a sheet of paper with a few lines on it
    const paper = mat('paper'), ink = mat('muted');
    const d = new THREE.Group();
    d.add(box(.8, .03, 1, paper, 0, 0, 0));
    for (let k = 0; k < 5; k++) d.add(box(k === 0 ? .4 : .6, .005, .04, ink, k === 0 ? -.1 : 0, .03, -.35 + k * .16));
    d.position.set(cx + .3, .9, -5.5); d.rotation.y = -.25;
    scene.add(thing(key, d));
    deals[key] = d;
  }

  /* ---------- The players: Max and Libby, with the detective as an extra ---------- */
  const maxC = makeCharacter(CAST.max, mat), libC = makeCharacter(CAST.libby, mat), detC = makeCharacter(CAST.detective, mat);
  const you = maxC.root, them = libC.root, det = detC.root;
  api.chars = { max: maxC, libby: libC, detective: detC };
  you.position.set(ROOM_A, .06, -3.9);
  them.position.set(ROOM_B, .06, -3.9);
  scene.add(thing('max', you), thing('libby', them));
  const youLbl = label('max', 'Max', V(0, 2.55, 0), 'player you'); you.add(youLbl.obj);
  const themLbl = label('libby', 'Libby', V(0, 2.55, 0), 'player them'); them.add(themLbl.obj);
  const bubbles = { max: bubble(V(0, 3.2, 0)), libby: bubble(V(0, 3.2, 0)), detective: bubble(V(0, 3.4, 0)) };
  you.add(bubbles.max.obj); them.add(bubbles.libby.obj);
  det.position.set(-3.75, 0, -.9);
  det.add(bubbles.detective.obj);
  scene.add(thing('detective', det));
  const detLbl = label('detective', 'Detective', V(-3.75, 2.95, -.9), 'player');
  w.onTick((t, dt) => Object.values(api.chars).forEach(c => c.update(t, dt, w.camera.position)));

  // Speech: one bubble per character. A thought stays up until it's replaced or cleared.
  const thoughts = {};
  api.say = (who, html, ms) => {
    Object.entries(bubbles).forEach(([k, b]) => { if (k !== who) thoughts[k] ? b.show(thoughts[k], 'think') : b.hide(); });
    bubbles[who].show(html, 'say'); api.chars[who].talk(ms);
  };
  api.quiet = () => Object.entries(bubbles).forEach(([k, b]) => thoughts[k] ? b.show(thoughts[k], 'think') : b.hide());
  api.think = (who, html) => { thoughts[who] = html; html ? bubbles[who].show(html, 'think') : bubbles[who].hide(); };
  api.faces = (a, b = a) => { maxC.face(a); libC.face(b); };
  api.poses = (a, b = a) => { maxC.pose(a); libC.pose(b); };

  /* ---------- Evidence: the two guns ---------- */
  const ev = new THREE.Group();
  const evWood = mat('wood'), metal = mat('mask'), tag = mat('paper');
  ev.add(box(2.6, .08, 1.5, evWood, 0, .82, 0));
  for (const [dx, dz] of [[-1.15, -.6], [1.15, -.6], [-1.15, .6], [1.15, .6]]) ev.add(box(.1, .82, .1, evWood, dx, 0, dz));
  for (const [gx, rot] of [[-.55, .3], [.6, -.2]]) {
    const gun = new THREE.Group();
    gun.add(box(.7, .14, .16, metal, 0, 0, 0));                  // barrel and slide
    gun.add(box(.18, .34, .16, metal, -.22, -.26, 0));           // grip
    gun.children[1].rotation.z = -.25;
    gun.rotation.y = rot; gun.position.set(gx, .9, 0);
    ev.add(gun);
  }
  ev.add(box(.36, .02, .22, tag, .1, .9, .45)); // evidence tag
  ev.position.set(6.4, 0, -5.2);
  scene.add(thing('guns', ev));
  const evLbl = label('guns', 'Evidence', V(6.4, 2.3, -5.2), 'sign');

  /* ---------- The river and the sunken cash ---------- */
  const waterM = mat('water', { transparent: true, opacity: .88, roughness: .25 });
  const water = box(4, .42, 18, waterM, 10.8, -.6, 0);
  water.userData.noPick = true; water.receiveShadow = true;
  scene.add(water);
  const cash = new THREE.Group();
  const sackM = mat('wood');
  const sack = new THREE.Mesh(new THREE.SphereGeometry(.55, 24, 16), sackM); sack.scale.set(1, .85, 1); cash.add(sack);
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(.12, .2, .3, 16), sackM); neck.position.y = .52; cash.add(neck);
  cash.position.set(10.6, -.35, -1.5); cash.rotation.z = .5;
  scene.add(thing('cash', cash));
  const cashLbl = label('cash', '£', V(10.6, .9, -1.5), 'coin');
  const rippleM = new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: .5, depthWrite: false });
  const ripples = [0, 1, 2].map(k => { const r = new THREE.Mesh(new THREE.RingGeometry(.6, .66, 48), rippleM.clone()); r.rotation.x = -Math.PI / 2; r.position.set(10.6, -.17, -1.5); r.userData.noPick = true; scene.add(r); return r; });
  w.onTick(t => {
    cash.position.y = -.38 + Math.sin(t * 1.6) * .06; cash.rotation.x = Math.sin(t * 1.1) * .08;
    ripples.forEach((r, k) => { const p = ((t * .35) + k / 3) % 1; const s = 1 + p * 2.4; r.scale.set(s, s, 1); r.material.opacity = .45 * (1 - p); });
  });

  api.props = on => {
    [det, ev, cash, deals['deal-a'], deals['deal-b']].forEach(g => { g.visible = on; });
    [detLbl, evLbl, cashLbl].forEach(l => { l.obj.visible = on; l.el.hidden = !on; });
    signs[0].set(on ? 'Room 1' : 'Café 1'); signs[1].set(on ? 'Room 2' : 'Café 2');
  };

  /* ---------- The outcome board: one square per pair of choices ---------- */
  const board = new THREE.Group();
  board.add(box(8.9, .12, 6, mat('surface'), -3.5, 0, 4.6, .3));
  board.traverse(o => { o.userData.noPick = true; o.receiveShadow = true; });
  scene.add(board);
  api.cells = [];
  for (let r = 0; r < 2; r++) for (let c = 0; c < 2; c++) {
    const g = new THREE.Group();
    g.add(box(4, .1, 2.6, mat('raised'), 0, 0, 0, .18));
    g.position.set(BX[c], .12, BZ[r]);
    scene.add(thing(`cell-${r}${c}`, g));
    api.cells.push(g);
  }
  api.rowLbl = GAMES.robbers.rows.map((t, r) => label(null, t, V(-8.7, .3, BZ[r]), 'axis row'));
  api.colLbl = GAMES.robbers.cols.map((t, c) => label(null, t, V(BX[c], .3, 1.15), 'axis'));
  api.boardParts = [board, ...api.cells];
  api.boardLabels = [...api.rowLbl, ...api.colLbl];

  // Stacks of blocks on each square, in each character's colour: Max green, Libby gold.
  api.setGame = async (name, grow = true) => {
    api.game = name;
    const G = GAMES[name];
    for (const s of api.stacks) s.parent && s.parent.remove(s);
    for (const l of api.stackLabels) { l.obj.parent && l.obj.parent.remove(l.obj); l.el.remove(); }
    api.stacks = []; api.stackLabels = [];
    G.rows.forEach((t, r) => api.rowLbl[r].set(t));
    G.cols.forEach((t, c) => api.colLbl[c].set(t));
    for (let r = 0; r < 2; r++) for (let c = 0; c < 2; c++) {
      const [a, b] = G.pay[r][c], cell = api.cells[r * 2 + c];
      [[a, mat(CAST.max.top), -.75, ' you'], [b, mat(CAST.libby.top), .75, ' them']].forEach(([n, m, dx, who]) => {
        const s = stack(n, m, .22, .03); s.position.set(dx, .1, 0);
        s.traverse(o => { if (o.isMesh) { o.castShadow = true; o.userData.noGlow = true; } });
        cell.add(s); api.stacks.push(s);
        const lbl = label(`cell-${r}${c}`, G.fmt(n), V(dx, .2, .95), 'stack' + who);
        cell.add(lbl.obj); api.stackLabels.push(lbl);
        if (grow) { s.scale.y = .001; lbl.el.style.opacity = 0; }
      });
    }
    if (grow) await animate(900, k => { api.stacks.forEach(s => s.scale.y = Math.max(.001, k)); api.stackLabels.forEach(l => l.el.style.opacity = k); });
  };

  api.showBoard = async on => {
    if (on && api.cells[0].visible && api.stacks.length) return;
    api.boardParts.forEach(p => { p.visible = true; });
    api.boardLabels.forEach(l => { l.obj.visible = true; l.el.hidden = false; });
    if (on) {
      api.boardParts.forEach(p => p.scale.set(.001, .001, .001));
      await animate(700, k => api.boardParts.forEach(p => p.scale.set(k, k, k)));
      await api.setGame(api.game);
    }
  };
  api.hideBoard = () => {
    api.boardParts.forEach(p => { p.visible = false; });
    api.boardLabels.forEach(l => { l.obj.visible = false; l.el.hidden = true; });
    api.stackLabels.forEach(l => { l.el.hidden = true; });
  };
  api.hideBoard();

  // Spotlight one column: dim the other squares
  api.spot = (keys) => {
    api.cells.forEach((cell, i) => {
      const key = `cell-${Math.floor(i / 2)}${i % 2}`, on = !keys || keys.includes(key);
      cell.traverse(o => { if (o.isMesh) { o.material.transparent = true; o.material.opacity = on ? 1 : .22; } });
    });
    api.stackLabels.forEach(l => { const key = keyFromLabel(l); l.el.style.opacity = !keys || keys.includes(key) ? 1 : .2; });
  };
  const keyFromLabel = l => { let o = l.obj.parent; while (o && !o.userData.key) o = o.parent; return o && o.userData.key; };

  /* ---------- Moves the tour uses ---------- */
  const homes = { you: you.position.clone(), them: them.position.clone() };
  const air = on => api.poses(on ? 'cheer' : 'idle');
  const hop = (piece, to, ms = 900) => {
    const from = piece.position.clone(), dest = to.clone();
    return animate(ms, k => { piece.position.lerpVectors(from, dest, k); piece.position.y = from.y + (dest.y - from.y) * k + Math.sin(k * Math.PI) * 2.2; });
  };
  api.toCell = async (r, c) => {
    const cell = V(BX[c], .22, BZ[r]);
    air(true);
    await Promise.all([hop(you, cell.clone().add(V(-1.4, 0, .55))), hop(them, cell.clone().add(V(1.4, 0, .55)))]);
    air(false);
  };
  api.home = async () => {
    if (you.position.distanceTo(homes.you) < .01) return;
    air(true);
    await Promise.all([hop(you, homes.you, 700), hop(them, homes.them, 700)]);
    air(false);
  };
  api.masks = on => [maxC, libC].forEach(c => c.outfit({ mask: on, apron: !on }));
  api.names = (a, b) => { youLbl.set(a); themLbl.set(b); };

  // Arrows showing a player's temptation to leave a square
  const arrowM = mat('bad');
  api.arrows = [];
  const arrow = (from, to) => {
    const g = new THREE.Group(), dir = to.clone().sub(from), len = dir.length();
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(.07, .07, len - .5, 12), arrowM); shaft.position.y = (len - .5) / 2;
    const tip = new THREE.Mesh(new THREE.ConeGeometry(.22, .5, 16), arrowM); tip.position.y = len - .25;
    g.add(shaft, tip); g.position.copy(from);
    g.quaternion.setFromUnitVectors(V(0, 1, 0), dir.normalize());
    g.traverse(o => { o.userData.noPick = true; o.castShadow = true; });
    g.visible = false; scene.add(g); api.arrows.push(g); return g;
  };
  arrow(V(BX[0] - .75, 1.2, BZ[0] + .3), V(BX[0] - .75, 1.2, BZ[1] - .3));  // you switch from deny to confess
  arrow(V(BX[0] + 1, 1.2, BZ[0]), V(BX[1] - 1, 1.2, BZ[0]));               // they switch from deny to confess
  api.showArrows = async on => {
    api.arrows.forEach(a => { a.visible = on; a.scale.set(1, on ? .001 : 1, 1); });
    if (on) await animate(600, k => api.arrows.forEach(a => a.scale.set(1, Math.max(.001, k), 1)));
  };

  return api;
}

/* ---------- State cards: what each object knows at this point in the story ---------- */
export function card(key, ctx) {
  const cafes = ctx.api.game === 'cafes';
  if (key.startsWith('cell-')) {
    const r = +key[5], c = +key[6], G = GAMES[ctx.api.game], [a, b] = G.pay[r][c];
    let story = cafes ? CAFE_STORY[r][c] : ROBBER_STORY[r][c];
    if (key === 'cell-00' && !cafes && ctx.reached('trap')) story = { ...story, text: 'Best for the pair, but it doesn\'t hold. Follow the red arrows: from here, either of them cuts their sentence from 1 year to nothing by confessing. A promise to stay quiet can\'t fix it, because nobody can check it through the wall.' };
    return {
      kicker: 'Outcome · ' + G.rows[r] + ' · ' + G.cols[c],
      title: story.title,
      rows: [[cafes ? 'Max\'s café' : 'Max', G.fmt(a)], [cafes ? 'Libby\'s café' : 'Libby', G.fmt(b)], ['Together', G.fmt(a + b)]],
      text: story.text
    };
  }
  if (cafes && (key === 'max' || key === 'libby')) return key === 'max'
    ? { kicker: 'Café owner · player 1', title: 'Max', rows: [['Choices', '£3 or £2 a coffee'], ['Wants', 'The most profit'], ['Dominant move', '£2']], text: 'If Libby charges £3, £2 earns Max 8 instead of 6. If she charges £2, £2 earns him 4 instead of 2. Same shape as the robbers.' }
    : { kicker: 'Café owner · player 2', title: 'Libby', rows: [['Choices', '£3 or £2 a coffee'], ['Wants', 'The most profit'], ['Dominant move', '£2']], text: 'Runs the same sums from across the street and lands on £2 as well.' };
  const solved = ctx.reached('dominant');
  const C = {
    max: {
      kicker: 'Robber 1 · room 1', title: 'Max',
      rows: [['Choices', 'Deny or confess'], ['Knows', 'The deal and the evidence'], ['Doesn\'t know', 'What Libby will say'], ['Wants', 'The fewest years inside'],
        ...(solved ? [['Best move', 'Confess, whatever Libby does']] : [])],
      text: solved ? 'Confessing beats denying in both columns: free instead of 1 year, and 7 instead of 10.' : 'Max always reaches for the biggest number in front of him. Tonight that means the shortest sentence.'
    },
    libby: {
      kicker: 'Robber 2 · room 2', title: 'Libby',
      rows: [['Choices', 'Deny or confess'], ['Knows', 'Exactly what Max knows'], ['Doesn\'t know', 'What Max will say'], ['Wants', 'The fewest years inside'],
        ...(solved ? [['Best move', 'Confess, whatever Max does']] : [])],
      text: solved ? 'Same room, same deal, same sums. If Max denies, confessing sets her free. If he confesses, confessing gets her 7 instead of 10. So she confesses too.' : 'Libby always asks where a game ends up once everyone has made their best move.'
    },
    detective: {
      kicker: 'Sets the rules', title: 'The detective',
      rows: [['Wants', 'At least one confession'], ['Has', 'Two guns, no cash'], ['Trick', 'Same offer to both, in separate rooms']],
      text: 'The detective isn\'t choosing a move in this game. They designed it, and they designed it so that keeping quiet is a bad bet for each robber.'
    },
    wall: {
      kicker: 'The rules of the game', title: 'A wall, so no talking',
      rows: [['Can they talk?', 'No'], ['Can they agree a plan?', 'No'], ['Could they check a promise?', 'No']],
      text: 'Even if Max and Libby swore before the robbery to stay quiet, neither can see whether the other is keeping the promise. Each decides alone.'
    },
    guns: {
      kicker: 'Evidence', title: 'Two guns',
      rows: [['Proves', 'Carrying a weapon'], ['Doesn\'t prove', 'The robbery'], ['Sentence if nobody talks', '1 year each']],
      text: 'This is all the police can prove on their own. To make the robbery charge stick, they need a confession.'
    },
    cash: {
      kicker: 'The missing proof', title: 'The cash, in the river',
      rows: [['Where', 'At the bottom of the river'], ['Found by police', 'No']],
      text: 'They dumped it on the way out. No cash means no proof of the robbery, which is why the detective is offering a deal.'
    },
    'deal-a': DEAL, 'deal-b': DEAL
  };
  return C[key] || { kicker: '', title: key, rows: [], text: '' };
}
const DEAL = {
  kicker: 'The offer, the same in both rooms', title: 'The deal',
  rows: [['You testify, your partner doesn\'t', 'You walk free, they get 10 years'], ['Your partner testifies, you don\'t', 'They walk free, you get 10 years'], ['You both testify', '7 years each'], ['Nobody testifies', '1 year each, for the guns']],
  text: 'Testifying means confessing and naming your partner. Each robber reads this sheet alone.'
};
const ROBBER_STORY = [
  [{ title: 'Both stay quiet', text: 'The police only have the guns. One year each, the best result for the pair. But either of them could walk free by confessing instead.' },
   { title: 'Max keeps quiet, Libby talks', text: 'Libby testifies against Max and walks out. Max takes the full 10 years.' }],
  [{ title: 'Max talks, Libby keeps quiet', text: 'Max testifies and walks out free. Libby takes the full 10 years.' },
   { title: 'Both talk', text: 'Two confessions, so no deal for either. Seven years each.' }]
];
const CAFE_STORY = [
  [{ title: 'Both charge £3', text: 'Best for the street: 6 each. But either café can grab 8 by dropping to £2.' },
   { title: 'Max £3, Libby £2', text: 'Libby undercuts Max and takes most of the customers: 2 for him, 8 for her.' }],
  [{ title: 'Max £2, Libby £3', text: 'Max undercuts Libby: 8 for him, 2 for her.' },
   { title: 'Both charge £2', text: 'A price war. Same customers, lower price, 4 each.' }]
];

/* ---------- Camera presets: [position, target] for wide screens and for phones ---------- */
const OVER = { wide: [[0, 21, 27], [-.5, 0, -.5]], phone: [[0, 34, 36], [-.5, 0, -.5]] };
const ROOMS = { wide: [[-3.8, 8.5, 9.5], [-3.8, 1.2, -3.8]], phone: [[-3.75, 14, 10], [-3.75, 1, -4.1]] };
const BOARD = { wide: [[-5, 15.5, 19], [-5, .4, 3.6]], phone: [[-3.5, 18, 17.5], [-3.5, .4, 4]] };
const RIGHT = { wide: [[7, 8, 7], [8.4, 0, -3]], phone: [[7.5, 10, 7.5], [8.4, 0, -3.2]] };

/* ---------- The guided tour. lines are what Max and Libby say; the page plays them in order. ---------- */
export const steps = [
  {
    id: 'meet', title: 'Two robbers, one choice',
    lines: [
      { who: 'max', text: 'Hi, I\'m Max! Tonight Libby and I are playing two robbers who just got caught.' },
      { who: 'libby', text: 'We\'re in separate rooms, and each of us has one choice: deny everything, or confess.' }
    ],
    cam: ROOMS, task: { click: ['max'], say: 'Click Max to see what he knows.' },
    async enter(api) { api.hideBoard(); api.props(true); api.masks(true); api.names('Max', 'Libby'); api.faces('happy'); await api.home(); api.chars.max.pose('wave'); setTimeout(() => api.chars.max.pose('idle'), 2400); }
  },
  {
    id: 'evidence', title: 'Why the police need a confession',
    lines: [
      { who: 'libby', text: 'We threw the cash in the river on the way out. So they can\'t prove the robbery.' },
      { who: 'max', text: 'All they\'ve got is our guns. That\'s one year each, tops!' }
    ],
    cam: RIGHT, task: { click: ['cash', 'guns'], all: true, say: 'Click the cash in the river and the evidence table.' },
    async enter(api) { api.faces('grin', 'happy'); }
  },
  {
    id: 'deal', title: 'The deal on the table',
    lines: [
      { who: 'detective', text: 'Testify against your partner and you walk free. Think it over.' },
      { who: 'max', text: 'Walk free? Now that\'s a big number.' },
      { who: 'libby', text: 'Same sheet in my room. Read the small print, Max.' }
    ],
    cam: ROOMS, task: { click: ['deal-a', 'deal-b'], say: 'Click the sheet of paper on either table.' },
    async enter(api) { api.faces('surprised', 'think'); }
  },
  {
    id: 'wall', title: 'Nobody can talk',
    lines: [
      { who: 'libby', text: 'There\'s a wall between us, so we can\'t agree a story.' },
      { who: 'max', text: 'And even if we\'d promised, I couldn\'t check Libby\'s keeping it.' }
    ],
    cam: ROOMS, task: { click: ['wall', 'detective'], all: true, say: 'Click the wall between the rooms, then the detective.' },
    async enter(api) { api.faces('worried', 'think'); api.poses('shrug', 'idle'); setTimeout(() => api.poses('idle'), 2500); }
  },
  {
    id: 'board', title: 'Every outcome on one board',
    lines: [
      { who: 'libby', text: 'Two of us, two choices each: four ways tonight can end. Here they all are.' },
      { who: 'max', text: 'The <b class="g">green</b> stacks are my years inside, the <b class="y">gold</b> ones are Libby\'s. Shorter is better!' }
    ],
    cam: BOARD, task: { click: ['cell-00', 'cell-01', 'cell-10', 'cell-11'], all: true, say: 'Click all four squares to see what happens in each.' },
    async enter(api) { api.faces('happy'); await api.showBoard(true); api.spot(null); }
  },
  {
    id: 'if-deny', title: 'Suppose Libby denies',
    lines: [
      { who: 'max', text: 'I can\'t know what Libby will say. So let\'s take it one case at a time.' },
      { who: 'libby', text: 'Say I <b>deny</b>. Look only at the left column.' }
    ],
    cam: BOARD,
    task: { choice: { q: 'Libby denies. What\'s better for Max?', options: [
      { text: 'Deny too, and serve 1 year', why: 'Confessing gets Max out free, and free beats a year inside.' },
      { text: 'Confess, and walk free', ok: true, why: 'Right. If Libby denies, confessing sets Max free.' }
    ] } },
    async enter(api) { api.faces('think', 'happy'); api.chars.max.pose('think'); await api.showBoard(true); api.spot(['cell-00', 'cell-10']); },
    done(api) { api.chars.max.pose('idle'); api.faces('grin', 'happy'); api.think('max', 'If she denies, I <b>confess</b>'); }
  },
  {
    id: 'if-confess', title: 'Suppose Libby confesses',
    lines: [{ who: 'libby', text: 'Now say I <b>confess</b>. Right column only.' }],
    cam: BOARD,
    task: { choice: { q: 'Libby confesses. What\'s better for Max?', options: [
      { text: 'Deny, and serve 10 years', why: 'Confessing gets Max 7 years, and 7 beats 10.' },
      { text: 'Confess, and serve 7 years', ok: true, why: 'Right. If Libby confesses, confessing saves Max 3 years.' }
    ] } },
    async enter(api) { api.faces('think', 'happy'); api.chars.max.pose('think'); api.spot(['cell-01', 'cell-11']); api.think('max', 'If she denies, I <b>confess</b>'); },
    done(api) { api.chars.max.pose('idle'); api.faces('grin', 'happy'); api.think('max', 'Deny or confess, I <b>confess</b>'); }
  },
  {
    id: 'dominant', title: 'Confess wins either way',
    lines: [
      { who: 'max', text: 'Hang on. Confessing wins whatever Libby does!' },
      { who: 'libby', text: 'That\'s a <b>dominant strategy</b>: the best move whatever the other player does. But I\'m doing the same sums in here.' }
    ],
    cam: ROOMS, task: { click: ['libby'], say: 'Click Libby to see what she\'s thinking.' },
    async enter(api) { await api.showBoard(true); api.spot(null); api.faces('grin', 'think'); api.think('max', 'Deny or confess, I <b>confess</b>'); },
    done(api) { api.faces('grin', 'happy'); api.think('libby', 'Deny or confess, I <b>confess</b>'); }
  },
  {
    id: 'land', title: 'Where do they end up?',
    lines: [{ who: 'libby', text: 'We both follow our dominant strategy. So where do we land?' }],
    cam: BOARD,
    task: { pick: { answer: 'cell-11', say: 'Click the square where Max and Libby end up.', wrong: {
      'cell-00': 'That needs both to deny, but each of them does better by confessing.',
      'cell-01': 'That needs Max to deny. Confessing beats denying for him either way.',
      'cell-10': 'That needs Libby to deny. She runs the same sums Max does, so she confesses.'
    }, why: 'Both confess and serve 7 years each, when 1 year each was on the table.' } },
    async enter(api) { api.think('max', null); api.think('libby', null); api.faces('happy'); await Promise.all([api.home(), api.showBoard(true)]); api.spot(null); },
    async done(api) { await api.toCell(1, 1); api.spot(['cell-11']); api.faces('worried'); api.say('max', 'Seven years each? We could have had one!', 2600); }
  },
  {
    id: 'trap', title: 'The better square nobody can reach',
    lines: [
      { who: 'max', text: 'So why didn\'t we both just keep quiet?' },
      { who: 'libby', text: 'Because from there, either of us walks free by talking. Each of us does the sensible thing, and we both end up worse off. That\'s the <b>prisoner\'s dilemma</b>.' }
    ],
    cam: BOARD, task: { click: ['cell-00'], say: 'Click the top-left square, where both deny.' },
    async enter(api) { await api.showBoard(true); api.spot(['cell-11']); api.showArrows(false); api.faces('worried', 'think'); },
    async done(api) { api.spot(null); await api.showArrows(true); }
  },
  {
    id: 'cafes', title: 'Same trap, different street',
    lines: [
      { who: 'libby', text: 'Masks off. Now we each run a café on the same street and pick tomorrow\'s price for a coffee.' },
      { who: 'max', text: 'Now the stacks are profit in £100s a day, so <b>taller is better</b>!' }
    ],
    cam: BOARD,
    task: { pick: { answer: 'cell-11', say: 'Click the square where the two cafés end up.', wrong: {
      'cell-00': 'Best for the street, but either café can grab 8 by dropping to £2.',
      'cell-01': 'Max would make 2 there. Dropping to £2 makes him 4.',
      'cell-10': 'Libby would make 2 there, so she drops to £2 as well.'
    }, why: '£2 beats £3 whatever the other café does, so both charge £2 and make 4 each, when 6 each was possible. A price war is a prisoner\'s dilemma.' } },
    async enter(api) {
      api.showArrows(false); api.think('max', null); api.think('libby', null);
      await api.home(); api.masks(false); api.props(false); api.names('Max\'s café', 'Libby\'s café'); api.faces('happy');
      api.game = 'cafes'; await api.showBoard(true); await api.setGame('cafes'); api.spot(null);
    },
    async done(api) { await api.toCell(1, 1); api.spot(['cell-11']); api.faces('worried', 'think'); }
  },
  {
    id: 'end', title: 'What you just learned',
    lines: [
      { who: 'max', text: 'So grabbing the best move for me made things worse for both of us.' },
      { who: 'libby', text: 'Next time, we change the rules of the game instead. See you in the next lesson!' }
    ],
    summary: [
      'A <b>dominant strategy</b> is the best move whatever the other player does.',
      'When both players follow theirs, both can end up worse off. That\'s the <b>prisoner\'s dilemma</b>.',
      'The rules made it happen: separate rooms and no way to check a promise. Change the rules and you change the game.'
    ],
    cam: OVER, task: null,
    async enter(api) { api.spot(null); api.faces('happy', 'grin'); api.poses('wave', 'idle'); }
  }
];
