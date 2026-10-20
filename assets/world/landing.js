/* Landing page: portraits of Max and Libby, and the 3D stage for the repeated-tender mini game.
   The game logic stays in index.html; this file only draws it. index.html calls window.GambitStage.* after each move,
   and play() returns how long its animation runs so the page can wait before the next bid. */
import { createWorld, THREE, box, animate } from './engine.js';
import { CAST, portrait } from './characters.js';
import { stage, scenery, cast, V } from './kit.js';

export function boot({ host, portraits }) {
  // Portraits for the "Meet Max and Libby" cards
  for (const img of portraits) { try { img.src = portrait(CAST[img.dataset.portrait], 220); img.classList.add('on'); } catch (e) { /* cards keep their plain circle */ } }
  if (!host) return null;

  const w = createWorld({ canvasHost: host, labelHost: host, orbit: false });
  stage(w, { width: 12, depth: 7 });
  const wait = ms => new Promise(r => setTimeout(r, ms));

  // Libby's podium: she's the buyer running the tender every quarter
  const PODIUM = V(0, 1.12, -.9);
  const pod = new THREE.Group();
  pod.add(box(1.6, 1.05, .8, w.mat('wood'), 0, 0, 0, .08));
  pod.add(box(1.75, .06, .9, w.mat('surface'), 0, 1.05, 0));
  pod.position.set(0, 0, -.9); scenery(w, pod);
  const sign = w.label(null, 'Tender · Q1', V(0, 3.4, -2.6), 'sign');

  // Libby's jar: in a price war the margin both suppliers gave up ends up with her
  const jar = new THREE.Group();
  const glass = new THREE.Mesh(new THREE.CylinderGeometry(.24, .24, .5, 28, 1, true), new THREE.MeshStandardMaterial({ color: '#ffffff', transparent: true, opacity: .28, roughness: .1, side: THREE.DoubleSide }));
  glass.position.y = .25; jar.add(glass);
  jar.position.set(.55, 1.11, -.75); scenery(w, jar);
  const jarLbl = w.label(null, 'Libby £0k', V(.55, 1.95, -.75), 'stack them'); jarLbl.el.hidden = true;

  // Two supplier desks: yours (left) and Max's (right)
  const desk = (x) => {
    const g = new THREE.Group(), m = w.mat('wood');
    g.add(box(2.4, .07, 1.1, m, 0, .82, 0));
    for (const [dx, dz] of [[-1.05, -.45], [1.05, -.45], [-1.05, .45], [1.05, .45]]) g.add(box(.09, .82, .09, m, dx, 0, dz));
    g.position.set(x, 0, 1.4); return scenery(w, g);
  };
  const desks = { you: desk(-3.4), max: desk(3.4) };

  // You get a seat at the table too: a plain figure in muted colours, so Max and Libby stay the stars
  const youSpec = { ...CAST.detective, name: 'You', top: '#8C8478', topDark: '#6E675D', hair: '#4A3B2E', hat: null, moustache: false, coat: false, height: 1 };
  const people = cast(w, { libby: [0, -1.8], max: [3.4, .35], you: { spec: youSpec, at: [-3.4, .35] } });
  const ch = people.chars;
  ch.libby.pose('idle');

  // Coin stacks on each desk: one coin per £1k of margin
  const coinM = w.mat('gold', { roughness: .35, metalness: .4 });
  const piles = { you: new THREE.Group(), max: new THREE.Group(), jar: new THREE.Group() };
  piles.you.position.set(-2.6, .89, 1.5); piles.max.position.set(4.2, .89, 1.5); piles.jar.position.set(.55, 1.12, -.75);
  Object.values(piles).forEach(p => w.scene.add(p));
  const coinGeo = new THREE.CylinderGeometry(.2, .2, .05, 24), jarGeo = new THREE.CylinderGeometry(.09, .09, .03, 16);
  const totalLbl = { you: w.label(null, '£0k', V(-2.6, 1.3, 1.5), 'stack you'), max: w.label(null, '£0k', V(4.2, 1.3, 1.5), 'stack them') };
  const slot = (who, k) => who === 'jar'
    ? V(((k * 7) % 5 - 2) * .035, Math.floor(k / 3) * .032 + .02, ((k * 3) % 5 - 2) * .03)
    : V((k % 2) * .44 - .22, Math.floor(k / 2) * .055 + .03, 0);   // two columns so a stack of 40 stays on the desk
  // Grow a pile to n coins. New coins fly in from `from` (a world position) in an arc, or drop in from above.
  function setPile(who, n, { from = null, stagger = 90 } = {}) {
    const p = piles[who], had = p.children.length, jobs = [];
    while (p.children.length > n) p.remove(p.children[p.children.length - 1]);
    for (let k = had; k < n; k++) {
      const c = new THREE.Mesh(who === 'jar' ? jarGeo : coinGeo, coinM); c.castShadow = true;
      const end = slot(who, k); c.position.copy(end); p.add(c);
      if (from) {
        const start = p.worldToLocal(from.clone()); c.position.copy(start); c.visible = false;
        jobs.push(wait((k - had) * stagger).then(() => { c.visible = true; return animate(520, e => {
          c.position.lerpVectors(start, end, e); c.position.y += Math.sin(e * Math.PI) * 1.4; c.rotation.x = (1 - e) * 9;
        }); }));
      } else if (stagger) {
        const y = end.y; c.position.y = y + 1.6;
        jobs.push(animate(450 + (k - had) * 70, e => { c.position.y = y + (1 - e) * 1.6; }));
      }
    }
    if (who !== 'jar') { totalLbl[who].set('£' + n + 'k'); totalLbl[who].obj.position.y = 1.3 + Math.ceil(n / 2) * .055; }
    else { jarLbl.set('Libby £' + n + 'k'); jarLbl.el.hidden = n === 0; }
    return Promise.all(jobs);
  }

  // A "+3" that floats up from a pile and fades
  function gain(who, n) {
    if (!n) return;
    const p = piles[who].position, l = w.label(null, '+£' + n + 'k', V(p.x, 1.8, p.z), 'gain ' + (who === 'you' ? 'you' : 'them'));
    animate(1300, e => { l.obj.position.y = 1.8 + e * 1.1; l.el.style.opacity = String(1 - Math.max(0, e - .55) / .45); })
      .then(() => { l.obj.parent && l.obj.parent.remove(l.obj); l.el.remove(); });
  }

  // Sealed bids: an envelope slides from each desk to Libby's podium
  const envM = w.mat('paper');
  async function envelope(fromX) {
    const e = box(.5, .03, .34, envM, 0, 0, 0, .02); e.castShadow = true; w.scene.add(e);
    const a = V(fromX, .9, 1.3);
    await animate(560, k => { e.position.lerpVectors(a, PODIUM, k); e.position.y += Math.sin(k * Math.PI) * 1.1; e.rotation.y = k * Math.PI * 2; });
    await animate(160, k => e.scale.setScalar(1 - k * .99));
    w.scene.remove(e);
  }

  // Confetti for a win
  const CONF = ['#3F7D5C', '#D6A33E', '#D2553C', '#F3F0E8', '#2C3B57'].map(c => new THREE.MeshBasicMaterial({ color: c, side: THREE.DoubleSide }));
  const confGeo = new THREE.PlaneGeometry(.09, .14), bits = [];
  function confetti(at, n = 40) {
    for (let k = 0; k < n; k++) {
      const m = new THREE.Mesh(confGeo, CONF[k % CONF.length]); m.position.copy(at); w.scene.add(m);
      const a = Math.random() * Math.PI * 2, s = 1.6 + Math.random() * 2.2;
      bits.push({ m, v: V(Math.cos(a) * s * .55, 3.2 + Math.random() * 2.6, Math.sin(a) * s * .4), spin: V(Math.random() * 9, Math.random() * 9, 0), life: 1.7 + Math.random() * .6 });
    }
  }
  w.onTick((t, dt) => {
    for (let k = bits.length - 1; k >= 0; k--) {
      const b = bits[k]; b.life -= dt; b.v.y -= 7.5 * dt;
      b.m.position.addScaledVector(b.v, dt); b.m.rotation.x += b.spin.x * dt; b.m.rotation.y += b.spin.y * dt;
      if (b.m.position.y < .05) { b.m.position.y = .05; b.v.set(0, 0, 0); b.spin.set(0, 0, 0); }
      if (b.life < 0) { w.scene.remove(b.m); bits.splice(k, 1); }
    }
  });

  // A quick floor flash when the price war starts
  const flash = new THREE.Mesh(new THREE.PlaneGeometry(11.6, 6.6), new THREE.MeshBasicMaterial({ color: '#D2553C', transparent: true, opacity: 0 }));
  flash.rotation.x = -Math.PI / 2; flash.position.y = .015; w.scene.add(flash);
  const flashOnce = () => animate(700, e => { flash.material.opacity = Math.sin(e * Math.PI) * .32; });

  // A desk shakes when its supplier gets undercut
  const shake = who => { const d = desks[who], x0 = d.position.x; return animate(420, e => { d.position.x = x0 + Math.sin(e * Math.PI * 8) * .06 * (1 - e); }).then(() => { d.position.x = x0; }); };

  // Price cards held up each quarter
  const card = { you: w.label(null, '', V(-3.6, .5, 2.4), 'move'), max: w.label(null, '', V(3.2, .5, 2.4), 'move') };
  Object.values(card).forEach(c => { c.el.hidden = true; });
  const showCard = (who, m) => { const c = card[who]; c.set(m === 'H' ? 'Holds price' : 'Undercuts'); c.el.className = 'wlabel move pop ' + (m === 'H' ? 'hold' : 'cut'); c.el.hidden = false; };

  // Camera: pull back until both desks fit across the panel, whatever its shape, with a slow drift and a punch-in on each reveal
  const cam = { dist: 9, punch: 0 };
  const frame = () => {
    const aspect = host.clientWidth / Math.max(1, host.clientHeight), fov = (host.clientWidth < 640 ? 44 : 32) * Math.PI / 180;
    const half = Math.atan(Math.tan(fov / 2) * aspect);
    cam.dist = Math.max(7.4, (host.clientWidth < 640 ? 5.6 : 5.05) / Math.tan(half));
    w.controls.target.set(0, 1.05, .3);
  };
  frame(); new ResizeObserver(frame).observe(host);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  w.onTick(t => {
    const yaw = reduce ? 0 : Math.sin(t * .23) * .07, d = cam.dist * (1 - cam.punch * .07);
    const dir = V(Math.sin(yaw) * .89, .45, Math.cos(yaw) * .89).normalize();
    w.camera.position.copy(w.controls.target).addScaledVector(dir, d);
  });
  const punch = () => animate(900, e => { cam.punch = Math.sin(e * Math.PI); });

  // While you decide, Max fidgets and wonders what you'll do
  const IDLE = ['Hold or undercut?', 'Your move.', 'I remember what you did last time.', 'No pressure.'];
  let idleTimer = 0, idleN = 0, busy = false, lastAction = 0;
  const idle = () => {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      if (busy || performance.now() - lastAction < 6500) return idle();
      ch.max.pose('think'); people.think('max', IDLE[idleN++ % IDLE.length]);
      setTimeout(() => { if (!busy) { people.think('max', null); ch.max.pose('idle'); } idle(); }, 2600);
    }, 7000);
  };

  const LINES = {
    HH: ['libby', 'You both held. Healthy margins all round.'],
    HU: ['max', 'Ha! I undercut you, so I take this quarter.'],
    UH: ['libby', 'You undercut Max and take the whole contract.'],
    UU: ['libby', 'Price war. You both bid at cost, and I keep the margin.']
  };
  const PAY = { HH: [3, 3], HU: [0, 5], UH: [5, 0], UU: [1, 1] };
  let jarCoins = 0, lastQ = 0;

  async function reveal(you, max, totYou, totMax) {
    busy = true; clearTimeout(idleTimer); lastAction = performance.now();
    people.clearThoughts(); people.quiet();
    ch.you.pose('point'); ch.max.pose('point'); ch.libby.pose('idle'); ch.libby.face('think');
    await Promise.all([envelope(-3.4), wait(120).then(() => envelope(3.4))]);
    showCard('you', you); showCard('max', max); punch();
    const key = you + max, [py, pm] = PAY[key];
    const [who, text] = LINES[key];
    people.say(who, text, 2600);
    ch.you.pose('idle'); ch.max.pose('idle');
    const coins = Promise.all([setPile('you', totYou, { from: PODIUM }), setPile('max', totMax, { from: PODIUM })]);
    gain('you', py); gain('max', pm);
    if (key === 'HH') { people.faces('happy', 'happy'); ch.you.face('happy'); people.hop('max', [3.4, .35], 600); people.hop('you', [-3.4, .35], 600); }
    if (key === 'HU') { ch.max.face('grin'); ch.you.face('worried'); ch.libby.face('happy'); people.hop('max', [3.4, .35], 650); shake('you'); ch.you.pose('shrug'); }
    if (key === 'UH') {
      ch.you.face('grin'); ch.max.face('worried'); ch.libby.face('surprised');
      people.hop('you', [-3.4, .35], 650); confetti(V(-3.4, 2.2, 1.2)); shake('max'); ch.max.pose('shrug');
      setTimeout(() => people.say('max', 'Hey! Noted for next quarter.', 2000), 2300);
    }
    if (key === 'UU') {
      ch.max.face('worried'); ch.you.face('worried'); ch.libby.face('grin');
      flashOnce(); ch.max.pose('shrug'); ch.you.pose('shrug'); ch.libby.pose('cheer');
      jarCoins += 4; setPile('jar', jarCoins, { from: V(0, 2.4, -.2), stagger: 110 });
    }
    await coins;
    await wait(500);
    ch.libby.pose('idle'); ch.max.pose('idle'); ch.you.pose('idle');
    busy = false; idle();
  }

  window.GambitStage = {
    intro() {
      ch.libby.pose('wave');
      people.say('libby', 'I run this tender every quarter. You and Max both bid. Hold your price, or undercut?', 4200);
      setTimeout(() => { ch.libby.pose('idle'); ch.max.pose('wave'); people.say('max', 'Fair warning: I remember what you did last time.', 3000); }, 4500);
      setTimeout(() => { ch.max.pose('idle'); idle(); }, 7600);
    },
    // returns how long the animation runs, so the page can hold the next bid until it's done
    play(q, you, max, totYou, totMax) {
      lastQ = q;
      reveal(you, max, totYou, totMax);
      sign.set('Tender · Q' + Math.min(8, q + 1));
      return 1700;
    },
    over(html, won) {
      clearTimeout(idleTimer); busy = true;
      sign.set('Tender · done');
      if (won) { confetti(V(-3.4, 2.4, 1.2), 50); confetti(V(0, 2.8, -1), 50); confetti(V(3.4, 2.4, 1.2), 30); ch.you.pose('cheer'); ch.libby.pose('cheer'); ch.max.pose('wave'); people.faces('grin', 'happy'); }
      else { ch.max.pose('cheer'); ch.max.face('grin'); ch.you.pose('shrug'); ch.libby.pose('think'); }
      people.say('libby', html, 5600);
      setTimeout(() => { people.poses('idle'); ch.you.pose('idle'); }, 4000);
    },
    sync(q, you, max) { setPile('you', you, { stagger: 0 }); setPile('max', max, { stagger: 0 }); sign.set('Tender · Q' + Math.min(8, q + 1)); idle(); },
    reset() {
      setPile('you', 0); setPile('max', 0); jarCoins = 0; setPile('jar', 0);
      Object.values(card).forEach(c => { c.el.hidden = true; });
      people.faces('happy'); ch.you.face('happy'); people.poses('idle'); ch.you.pose('idle'); people.clearThoughts(); people.quiet(); sign.set('Tender · Q1');
      busy = false; idle();
    }
  };
  return w;
}
