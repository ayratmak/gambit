/* Landing page: portraits of Max and Libby, and the 3D stage for the repeated-tender mini game.
   The game logic stays in index.html; this file only draws it. index.html calls window.GambitStage.* after each move. */
import { createWorld, THREE, box, animate } from './engine.js';
import { CAST, portrait } from './characters.js';
import { stage, scenery, cast, V } from './kit.js';

export function boot({ host, portraits }) {
  // Portraits for the "Meet Max and Libby" cards
  for (const img of portraits) { try { img.src = portrait(CAST[img.dataset.portrait], 220); img.classList.add('on'); } catch (e) { /* cards keep their plain circle */ } }
  if (!host) return null;

  const w = createWorld({ canvasHost: host, labelHost: host, orbit: false });
  stage(w, { width: 12, depth: 7 });

  // Libby's podium: she's the buyer running the tender every quarter
  const pod = new THREE.Group();
  pod.add(box(1.6, 1.05, .8, w.mat('wood'), 0, 0, 0, .08));
  pod.add(box(1.75, .06, .9, w.mat('surface'), 0, 1.05, 0));
  pod.position.set(0, 0, -.9); scenery(w, pod);
  const sign = w.label(null, 'Tender · Q1', V(0, 3.3, -2.6), 'sign');

  // Two supplier desks: yours (left) and Max's (right)
  const desk = (x) => {
    const g = new THREE.Group(), m = w.mat('wood');
    g.add(box(2.4, .07, 1.1, m, 0, .82, 0));
    for (const [dx, dz] of [[-1.05, -.45], [1.05, -.45], [-1.05, .45], [1.05, .45]]) g.add(box(.09, .82, .09, m, dx, 0, dz));
    g.position.set(x, 0, 1.4); return scenery(w, g);
  };
  desk(-3.4); desk(3.4);
  const plate = new THREE.Group(); plate.add(box(.9, .3, .08, w.mat('paper'), 0, .9, .45)); plate.position.set(-3.4, 0, 1.4); scenery(w, plate);
  w.label(null, 'You', V(-3.4, 1.55, 1.9), 'player');

  const people = cast(w, { libby: [0, -1.8], max: [3.4, .35] });
  people.chars.libby.pose('idle');

  // Coin stacks on each desk: one coin per £1k of margin
  const coinM = w.mat('gold', { roughness: .35, metalness: .4 });
  const piles = { you: new THREE.Group(), max: new THREE.Group() };
  piles.you.position.set(-2.6, .89, 1.5); piles.max.position.set(4.2, .89, 1.5);
  Object.values(piles).forEach(p => w.scene.add(p));
  const coinGeo = new THREE.CylinderGeometry(.2, .2, .05, 24);
  const totals = { you: 0, max: 0 };
  const totalLbl = { you: w.label(null, '£0k', V(-2.6, 2.9, 1.5), 'stack you'), max: w.label(null, '£0k', V(4.2, 2.9, 1.5), 'stack them') };
  function setPile(who, n, animateIn = true) {
    const p = piles[who], had = p.children.length;
    while (p.children.length > n) p.remove(p.children[p.children.length - 1]);
    for (let k = had; k < n; k++) {
      const c = new THREE.Mesh(coinGeo, coinM); c.castShadow = true;
      // coins sit in two columns so a stack of 40 stays on the desk
      c.position.set((k % 2) * .44 - .22, Math.floor(k / 2) * .055 + .03, 0);
      p.add(c);
      if (animateIn) { const y = c.position.y; c.position.y = y + 1.6; animate(450 + (k - had) * 70, e => { c.position.y = y + (1 - e) * 1.6; }); }
    }
    totals[who] = n; totalLbl[who].set('£' + n + 'k');
    totalLbl[who].obj.position.y = 1.2 + Math.ceil(n / 2) * .055;
  }

  // Price cards held up each quarter
  const card = { you: w.label(null, '', V(-3.6, .5, 2.4), 'move'), max: w.label(null, '', V(3.2, .5, 2.4), 'move') };
  Object.values(card).forEach(c => { c.el.hidden = true; });
  const showCard = (who, m) => { const c = card[who]; c.set(m === 'H' ? 'Holds price' : 'Undercuts'); c.el.className = 'wlabel move ' + (m === 'H' ? 'hold' : 'cut'); c.el.hidden = false; };

  // Camera: whole little scene in frame, a touch closer on phones
  // pull back until both desks fit across the panel, whatever its shape
  const frame = () => {
    const aspect = host.clientWidth / Math.max(1, host.clientHeight), fov = (host.clientWidth < 640 ? 44 : 32) * Math.PI / 180;
    const half = Math.atan(Math.tan(fov / 2) * aspect), dist = Math.max(8.6, 5.6 / Math.tan(half));
    const dir = new THREE.Vector3(0, .45, .89).normalize();
    w.controls.target.set(0, 1.2, .1);
    w.camera.position.copy(w.controls.target).addScaledVector(dir, dist);
  };
  frame(); new ResizeObserver(frame).observe(host);

  const LINES = {
    HH: ['libby', 'You both held. Healthy margins all round.', 'happy', 'happy'],
    HU: ['libby', 'Max undercut you and takes this quarter.', 'grin', 'think'],
    UH: ['libby', 'You undercut Max and take the whole contract.', 'worried', 'surprised'],
    UU: ['libby', 'Price war. You both bid at cost, and I keep the margin.', 'worried', 'grin']
  };

  window.GambitStage = {
    intro() {
      people.say('libby', 'I run this tender every quarter. You and Max both bid. Hold your price, or undercut?', 4200);
      setTimeout(() => people.say('max', 'Fair warning: I remember what you did last time.', 3000), 4500);
    },
    play(q, you, max, totYou, totMax) {
      showCard('you', you); showCard('max', max);
      const [who, text, maxFace, libFace] = LINES[you + max];
      people.chars.max.face(maxFace); people.chars.libby.face(libFace);
      people.chars.max.pose(max === 'U' ? 'point' : 'idle');
      setTimeout(() => people.chars.max.pose('idle'), 1400);
      people.say(who, text, 2600);
      if (you === 'U' && max === 'H') setTimeout(() => people.say('max', 'Hey! Noted for next quarter.', 2000), 2400);
      setPile('you', totYou); setPile('max', totMax);
      sign.set('Tender · Q' + Math.min(8, q + 1));
    },
    over(html) {
      sign.set('Tender · done');
      people.chars.max.pose('wave'); people.chars.max.face('grin');
      people.say('libby', html, 5200);
    },
    sync(q, you, max) { setPile('you', you, false); setPile('max', max, false); sign.set('Tender · Q' + Math.min(8, q + 1)); },
    reset() {
      setPile('you', 0, false); setPile('max', 0, false);
      Object.values(card).forEach(c => { c.el.hidden = true; });
      people.faces('happy'); people.poses('idle'); people.quiet(); sign.set('Tender · Q1');
    }
  };
  return w;
}
