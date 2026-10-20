/* Gambit's cast. Max and Libby host every 3D lesson and play its roles; extras like the detective use the same body.
   Max is short for "maximise": he grabs the biggest number in front of him. Libby is short for "equilibrium":
   she asks where everything ends up. Their look and voice are written up in docs/CHARACTERS.md. */
import { THREE } from './engine.js';

const C = THREE;

export const CAST = {
  max: {
    name: 'Max', role: 'Grabs the biggest number',
    skin: '#EDBF9A', blush: '#E98B74', hair: '#3B2717', eyes: '#3A2414',
    top: '#3F7D5C', topDark: '#2F6248', trousers: '#2C3B57', shoes: '#F3F0E8', sole: '#D2553C',
    hairStyle: 'quiff', hoodie: true
  },
  libby: {
    name: 'Libby', role: 'Asks where it all ends up',
    skin: '#9A623F', blush: '#C9705A', hair: '#3A2419', eyes: '#241510',
    top: '#D6A33E', topDark: '#B98A2C', stripeA: '#243246', stripeB: '#F3EEE3', trousers: '#3B3552', shoes: '#243246', sole: '#F3EEE3',
    hairStyle: 'buns', glasses: true, jacket: true
  },
  detective: {
    name: 'Detective', role: 'Sets the rules',
    skin: '#D9A47F', blush: '#D88A72', hair: '#77706A', eyes: '#2B2420',
    top: '#9A8763', topDark: '#7C6C4D', trousers: '#3A3631', shoes: '#2B2724', sole: '#2B2724',
    hairStyle: 'short', coat: true, hat: '#34302B', moustache: true, height: 1.12
  }
};

const sph = (r, m, w = 32, h = 22) => new C.Mesh(new C.SphereGeometry(r, w, h), m);
const capsule = (r, len, m) => new C.Mesh(new C.CapsuleGeometry(r, len, 8, 24), m);
const at = (mesh, x, y, z, sx = 1, sy = sx, sz = sx) => { mesh.position.set(x, y, z); mesh.scale.set(sx, sy, sz); return mesh; };

function stripes(a, b) {
  const cv = document.createElement('canvas'); cv.width = 8; cv.height = 64;
  const g = cv.getContext('2d');
  for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? b : a; g.fillRect(0, i * 8, 8, 8); }
  const t = new C.CanvasTexture(cv); t.colorSpace = C.SRGBColorSpace; t.magFilter = C.NearestFilter;
  return t;
}

/* Build one character. mat(hex, opts) makes a material. Returns the root group plus controls for the face and pose. */
export function makeCharacter(spec, mat) {
  const s = spec, k = s.height || 1;
  const skin = mat(s.skin), hair = mat(s.hair, { roughness: .6 }), top = mat(s.top), topDark = mat(s.topDark);
  const legsM = mat(s.trousers), shoeM = mat(s.shoes, { roughness: .5 }), soleM = mat(s.sole);
  const dark = mat('#17120F', { roughness: .4 }), white = new C.MeshBasicMaterial({ color: '#ffffff' });
  const eyeWhite = mat('#FBF8F2', { roughness: .3 }), iris = mat(s.eyes, { roughness: .2 });
  const blush = mat(s.blush, { transparent: true, opacity: .5 });
  const mouthM = mat('#5B2420', { roughness: .6 });

  const root = new C.Group();
  const body = new C.Group(); root.add(body);
  body.scale.setScalar(k);

  /* Legs and sneakers */
  for (const x of [-.12, .12]) {
    body.add(at(capsule(.1, .3, legsM), x, .43, 0));
    body.add(at(sph(.135, soleM), x, .045, .05, 1, .3, 1.55));
    body.add(at(sph(.13, shoeM), x, .09, .05, 1, .62, 1.5));
  }

  /* Torso and outfit */
  const torso = new C.Group(); torso.position.y = .92; body.add(torso);
  const chestM = s.jacket ? mat('#ffffff', { map: stripes(s.stripeA, s.stripeB) }) : top;
  torso.add(at(capsule(.26, .26, chestM), 0, 0, 0, 1, 1, .8));
  if (s.hoodie) {
    const hood = new C.Mesh(new C.TorusGeometry(.17, .075, 12, 28), topDark);
    hood.position.set(0, .37, -.1); hood.rotation.x = Math.PI / 2.4; torso.add(hood);
    torso.add(at(sph(.16, topDark), 0, -.14, .17, 1.15, .55, .35));                 // front pocket
    for (const x of [-.06, .06]) { const st = new C.Mesh(new C.CylinderGeometry(.012, .012, .16, 6), white); st.position.set(x, .2, .22); torso.add(st); }
  }
  if (s.jacket) {
    const shell = new C.Mesh(new C.CylinderGeometry(.27, .3, .56, 32, 1, true, .5, Math.PI * 2 - 1), top);
    shell.material.side = C.DoubleSide; shell.scale.z = .84; shell.position.y = -.02; torso.add(shell);
    const collar = new C.Mesh(new C.TorusGeometry(.17, .045, 10, 28, Math.PI * 1.4), topDark);
    collar.rotation.set(Math.PI / 2, 0, Math.PI * .8); collar.position.set(0, .3, -.02); torso.add(collar);
  }
  if (s.coat) {
    const coat = new C.Mesh(new C.CylinderGeometry(.28, .36, .78, 32, 1, true, .25, Math.PI * 2 - .5), top);
    coat.material.side = C.DoubleSide; coat.scale.z = .86; coat.position.y = -.22; torso.add(coat);
    const belt = new C.Mesh(new C.TorusGeometry(.275, .03, 8, 32), topDark); belt.rotation.x = Math.PI / 2; belt.scale.y = .86; belt.position.y = -.1; torso.add(belt);
    const lapel = new C.Mesh(new C.TorusGeometry(.17, .05, 10, 28, Math.PI * 1.4), topDark);
    lapel.rotation.set(Math.PI / 2, 0, Math.PI * .8); lapel.position.set(0, .3, -.02); torso.add(lapel);
  }
  // café apron, worn in the price-war twist
  const apron = new C.Group();
  apron.add(at(sph(.2, mat('#F7F3EA')), 0, -.12, .17, 1.05, 1.25, .3));
  const strap = new C.Mesh(new C.TorusGeometry(.13, .012, 6, 24, Math.PI), mat('#F7F3EA')); strap.position.set(0, .14, .14); apron.add(strap);
  apron.visible = false; torso.add(apron);

  /* Arms: pivots at the shoulders so poses rotate them */
  const arms = [-1, 1].map(side => {
    const pivot = new C.Group(); pivot.position.set(side * .28, 1.13, 0);
    pivot.add(sph(.1, top));                                                          // shoulder, so the arm joins the body
    pivot.add(at(capsule(.085, .3, s.coat ? top : (s.jacket ? top : top)), 0, -.2, 0));
    pivot.add(at(sph(.095, skin), 0, -.43, 0));
    body.add(pivot); return pivot;
  });

  /* Head */
  const neck = new C.Mesh(new C.CylinderGeometry(.085, .095, .14, 16), skin); neck.position.y = 1.3; body.add(neck);
  const head = new C.Group(); head.position.y = 1.36; body.add(head);
  head.add(at(sph(.4, skin, 40, 30), 0, .36, 0, 1, .96, .94));
  for (const x of [-.39, .39]) head.add(at(sph(.075, skin), x, .33, 0, .55, 1, .8));
  head.add(at(sph(.042, skin), 0, .3, .375));

  // Eyes: white, iris, highlight. Grouped so they can blink.
  const eyes = [-1, 1].map(side => {
    const g = new C.Group(); g.position.set(side * .14, .38, .335);
    g.add(at(sph(.085, eyeWhite), 0, 0, 0, 1, 1.15, .55));
    g.add(at(sph(.056, iris), 0, -.005, .034, 1, 1.1, .5));
    g.add(at(sph(.018, white, 10, 8), side * -.012 + .02, .03, .064));
    head.add(g); return g;
  });
  const brows = [-1, 1].map(side => {
    const b = new C.Mesh(new C.CapsuleGeometry(.016, .1, 4, 8), hair);
    b.rotation.z = Math.PI / 2; b.position.set(side * .14, .53, .35); head.add(b); return b;
  });
  for (const x of [-.24, .24]) head.add(at(sph(.065, blush), x, .25, .3, 1, .6, .35));
  const smile = new C.Mesh(new C.TorusGeometry(.065, .014, 8, 24, Math.PI), mouthM);
  smile.rotation.z = Math.PI; smile.position.set(0, .21, .365); head.add(smile);
  const open = at(sph(.055, mouthM), 0, .19, .36, 1, .75, .4); open.visible = false; head.add(open);

  /* Hair */
  if (s.hairStyle === 'quiff') {
    const cap = new C.Mesh(new C.SphereGeometry(.42, 36, 18, 0, Math.PI * 2, 0, Math.PI * .52), hair);
    cap.position.y = .37; cap.rotation.x = -.55; cap.scale.set(1, .95, .98); head.add(cap);
    [[-.16, .66, .2, -.5], [-.05, .72, .22, -.35], [.07, .74, .2, -.25], [.18, .68, .16, -.4], [.0, .76, .05, -.1]].forEach(([x, y, z, rz]) => {
      const tuft = at(sph(.13, hair), x, y, z, .9, .55, 1.35); tuft.rotation.set(-.7, 0, rz * (x < 0 ? -1 : 1)); head.add(tuft);
    });
    for (const x of [-.37, .37]) head.add(at(sph(.07, hair), x, .44, -.02, .5, 1.1, .9));
  }
  if (s.hairStyle === 'buns') {
    const cap = new C.Mesh(new C.SphereGeometry(.425, 36, 18, 0, Math.PI * 2, 0, Math.PI * .55), hair);
    cap.position.y = .37; cap.rotation.x = -.5; head.add(cap);
    head.add(at(sph(.4, hair), 0, .33, -.09, 1.02, 1, .9));                       // back of the bob
    for (const x of [-.31, .31]) head.add(at(sph(.2, hair), x, .2, -.04, .72, 1.25, 1));  // bob sides
    [[-.2, .64, .25, -.35], [0, .62, .29, 0], [.2, .64, .25, .35]].forEach(([x, y, z, rz]) => {   // fringe, three soft lobes
      const lobe = at(sph(.16, hair), x, y, z, 1.15, .62, .55); lobe.rotation.z = rz; head.add(lobe);
    });
    const tie = mat('#D6A33E');
    for (const x of [-.25, .25]) {
      head.add(at(sph(.15, hair), x, .78, -.04));
      const t = new C.Mesh(new C.TorusGeometry(.09, .02, 8, 20), tie); t.position.set(x, .68, -.03); t.rotation.x = Math.PI / 2; head.add(t);
    }
  }
  if (s.hairStyle === 'short') {
    const cap = new C.Mesh(new C.SphereGeometry(.415, 36, 18, 0, Math.PI * 2, 0, Math.PI * .5), hair);
    cap.position.y = .37; cap.rotation.x = -.5; head.add(cap);
  }
  if (s.moustache) for (const x of [-.06, .06]) { const m = at(sph(.06, hair), x, .25, .37, 1.3, .5, .5); m.rotation.z = x < 0 ? .35 : -.35; head.add(m); }
  if (s.hat) {
    const hatM = mat(s.hat);
    const crown = new C.Mesh(new C.CylinderGeometry(.27, .32, .26, 32), hatM); crown.position.y = .78; head.add(crown);
    const brim = new C.Mesh(new C.CylinderGeometry(.55, .55, .03, 40), hatM); brim.position.y = .66; head.add(brim);
    const band = new C.Mesh(new C.CylinderGeometry(.322, .322, .06, 32), mat('#17120F')); band.position.y = .68; head.add(band);
    head.rotation.x = .04;
  }
  let glasses = null;
  if (s.glasses) {
    glasses = new C.Group();
    for (const x of [-.14, .14]) { const r = new C.Mesh(new C.TorusGeometry(.1, .013, 8, 32), dark); r.position.set(x, .38, .39); glasses.add(r); }
    const bridge = new C.Mesh(new C.CylinderGeometry(.01, .01, .08, 6), dark); bridge.rotation.z = Math.PI / 2; bridge.position.set(0, .4, .41); glasses.add(bridge);
    head.add(glasses);
  }

  // Robber's eye mask. When it's on, the eyes and glasses sit a touch forward so they show through it.
  const mask = new C.Group();
  const band = new C.Mesh(new C.CylinderGeometry(.408, .408, .15, 40, 1, true), mat('#17150F', { side: C.DoubleSide }));
  band.position.y = .39; band.scale.z = .95; mask.add(band);
  for (const r of [.5, -.5]) { const tail = at(sph(.06, mat('#17150F')), r * .1, .37, -.42, 1, .5, 1.8); tail.rotation.z = r; mask.add(tail); }
  mask.visible = false; head.add(mask);

  root.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = false; } });
  // highlights and stripes shouldn't light up on hover
  root.traverse(o => { if (o.isMesh && o.material === white) o.userData.noGlow = true; });

  /* ---------- Face and pose controls ---------- */
  const FACES = {
    happy:    { brow: [.1, 0], mouth: 'smile' },
    grin:     { brow: [.18, .02], mouth: 'open' },
    think:    { brow: [-.2, .05, .25], mouth: 'flat' },
    worried:  { brow: [-.35, .03], mouth: 'frown' },
    surprised:{ brow: [.05, .07], mouth: 'o' }
  };
  const POSES = {
    idle:  [[0, 0, -.12], [0, 0, .12]],
    wave:  [[0, 0, -.12], [0, 0, 2.7]],
    think: [[0, 0, -.12], [-2.0, 0, -.35]],
    point: [[0, 0, -.12], [-1.4, 0, .2]],
    cheer: [[0, 0, -2.6], [0, 0, 2.6]],
    shrug: [[-.4, 0, -.9], [-.4, 0, .9]]
  };
  const state = { face: 'happy', pose: 'idle', talkUntil: 0, nextBlink: 1 + Math.random() * 3, blink: 0, wave: false, look: null, phase: Math.random() * 6 };

  function face(name) {
    state.face = name; const f = FACES[name] || FACES.happy;
    brows.forEach((b, i) => {
      const side = i ? 1 : -1, tilt = (i === 1 && f.brow[2] !== undefined) ? f.brow[2] : f.brow[0];
      b.rotation.z = Math.PI / 2 + side * tilt; b.position.y = .53 + f.brow[1] + (i === 1 && f.brow[2] !== undefined ? .04 : 0);
    });
    smile.visible = f.mouth === 'smile' || f.mouth === 'frown';
    smile.rotation.z = f.mouth === 'frown' ? 0 : Math.PI; smile.position.y = f.mouth === 'frown' ? .17 : .21;
    smile.scale.set(f.mouth === 'frown' ? .7 : 1, 1, 1);
    open.visible = f.mouth === 'open' || f.mouth === 'o';
    open.scale.set(f.mouth === 'o' ? .6 : 1, f.mouth === 'o' ? .8 : .75, .4);
  }
  face('happy');

  function update(t, dt, lookAt) {
    const bob = Math.sin(t * 2.2 + state.phase);
    body.position.y = bob * .012 * k;
    torso.scale.set(1 + bob * .008, 1 - bob * .006, 1);
    // blink
    state.nextBlink -= dt;
    if (state.nextBlink < 0) { state.blink = .14; state.nextBlink = 2 + Math.random() * 3.5; }
    if (state.blink > 0) state.blink -= dt;
    const lid = state.blink > 0 ? .12 : 1;
    eyes.forEach(e => e.scale.y += (lid - e.scale.y) * Math.min(1, dt * 30));
    // talking
    const talking = performance.now() < state.talkUntil;
    if (talking) {
      open.visible = true; smile.visible = false;
      open.scale.y = .35 + Math.abs(Math.sin(t * 13)) * .7;
    } else if (state.wasTalking) face(state.face);
    state.wasTalking = talking;
    // arms ease towards the pose, with a little wave or gesture on top
    const P = POSES[state.pose] || POSES.idle;
    arms.forEach((a, i) => {
      const [tx, ty, tz] = P[i];
      let wz = tz, wx = tx;
      if (state.pose === 'wave' && i === 1) wz += Math.sin(t * 9) * .35;
      if (talking && state.pose === 'idle') { wx += Math.sin(t * 3 + i * 2) * .25 - .2; wz += (i ? 1 : -1) * (.12 + Math.abs(Math.sin(t * 2.4 + i)) * .2); }
      const e = Math.min(1, dt * 8);
      a.rotation.x += (wx - a.rotation.x) * e; a.rotation.y += (ty - a.rotation.y) * e; a.rotation.z += (wz - a.rotation.z) * e;
    });
    // head follows the camera (or a target), within a comfortable range
    if (lookAt) {
      const p = root.getWorldPosition(new C.Vector3());
      const target = state.look || lookAt;
      let yaw = Math.atan2(target.x - p.x, target.z - p.z) - root.rotation.y;
      yaw = Math.atan2(Math.sin(yaw), Math.cos(yaw));
      yaw = Math.max(-.7, Math.min(.7, yaw));
      const pitch = Math.max(-.25, Math.min(.2, -Math.atan2(target.y - (p.y + 1.7), Math.hypot(target.x - p.x, target.z - p.z)) * .4));
      const e = Math.min(1, dt * 4);
      head.rotation.y += (yaw - head.rotation.y) * e;
      head.rotation.x += (pitch - head.rotation.x) * e;
    }
    if (talking) head.rotation.z = Math.sin(t * 2.6 + state.phase) * .05; else head.rotation.z *= .9;
  }

  return {
    root, spec,
    face, update,
    pose(name) { state.pose = name; },
    talk(ms) { state.talkUntil = performance.now() + ms; },
    lookAt(v) { state.look = v; },
    outfit({ mask: m = mask.visible, apron: a = apron.visible } = {}) {
      mask.visible = m; apron.visible = a;
      eyes.forEach(e => { e.position.z = m ? .4 : .335; });
      if (glasses) glasses.position.z = m ? .045 : 0;
    }
  };
}

/* Render a head-and-shoulders portrait to an image, for the guide panel. */
export function portrait(spec, size = 160) {
  const r = new C.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
  r.setPixelRatio(1); r.setSize(size, size); r.outputColorSpace = C.SRGBColorSpace;
  const scene = new C.Scene();
  scene.add(new C.HemisphereLight(0xffffff, 0x8a8170, 1.4));
  const sun = new C.DirectionalLight(0xffffff, 1.6); sun.position.set(-2, 4, 5); scene.add(sun);
  const ch = makeCharacter(spec, (hex, opts = {}) => new C.MeshStandardMaterial({ color: hex, roughness: .85, ...opts }));
  ch.face('happy'); ch.update(0, .016, null);
  scene.add(ch.root);
  const k = spec.height || 1, y = (1.36 + .38) * k + (spec.hat ? .08 : 0);
  const cam = new C.PerspectiveCamera(26, 1, .1, 50); cam.position.set(.35, y + .1, 2.6); cam.lookAt(0, y - .05, 0);
  r.render(scene, cam);
  const url = r.domElement.toDataURL('image/png');
  r.dispose(); r.forceContextLoss();
  return url;
}
