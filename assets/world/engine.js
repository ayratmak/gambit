/* Gambit 3D lesson engine. A world file (e.g. two-robbers.js) builds a small diorama with these helpers
   and lists guided steps; the engine handles the camera, clicking, state cards and the step tour. */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

export { THREE };

/* ---------- Palette: read from the site's CSS tokens so the world follows light and dark mode ---------- */
const ROLES = {
  bg: '--bg', surface: '--surface', raised: '--raised', ink: '--ink', muted: '--muted', accent: '--accent', bad: '--bad'
};
const EXTRA = { // colours the site doesn't have a token for, per theme
  light: { water: '#8FA6A8', paper: '#F6F4EC', wood: '#B9A887', gold: '#B08A3E', floor: '#CFCDC3', mask: '#17150F' },
  dark: { water: '#2F4447', paper: '#E7E4D9', wood: '#5E5444', gold: '#C9A55A', floor: '#2A2A23', mask: '#12120E' }
};
function isDark() {
  const t = document.documentElement.dataset.theme;
  return t ? t === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
}
function readPalette() {
  const cs = getComputedStyle(document.documentElement), p = {};
  for (const [k, v] of Object.entries(ROLES)) p[k] = cs.getPropertyValue(v).trim() || '#888';
  Object.assign(p, EXTRA[isDark() ? 'dark' : 'light']);
  return p;
}

/* ---------- Tiny tween helper ---------- */
const tweens = new Set();
const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
export function animate(ms, fn) {
  return new Promise(res => {
    const tw = { start: performance.now(), ms, fn, res };
    tweens.add(tw);
    // Hidden tabs pause animation frames; finish the tween anyway so the lesson never stalls
    setTimeout(() => { if (tweens.has(tw)) { tweens.delete(tw); fn(1, 1); res(); } }, ms + 250);
  });
}
function tickTweens(now) {
  for (const tw of tweens) {
    const t = Math.min(1, (now - tw.start) / tw.ms);
    tw.fn(ease(t), t);
    if (t >= 1) { tweens.delete(tw); tw.res(); }
  }
}

export function createWorld({ canvasHost, labelHost, orbit = true }) {
  let pal = readPalette();
  const mats = [];
  const mat = (role, opts = {}) => {
    // A role from the palette follows the theme; a literal '#hex' colour (characters' skin, hair, clothes) stays fixed
    const fixed = role.startsWith('#');
    const m = new THREE.MeshStandardMaterial({ color: fixed ? role : pal[role], roughness: .85, metalness: 0, ...opts });
    if (!fixed) { m.userData.role = role; mats.push(m); }
    return m;
  };

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  canvasHost.appendChild(renderer.domElement);

  const labels = new CSS2DRenderer();
  labels.domElement.className = 'wlabels';
  labelHost.appendChild(labels.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, .1, 400);
  camera.position.set(0, 26, 30);
  const controls = new OrbitControls(camera, labels.domElement);
  controls.enableDamping = true; controls.dampingFactor = .08;
  controls.minDistance = 8; controls.maxDistance = 60;
  controls.maxPolarAngle = Math.PI * .44; controls.minPolarAngle = Math.PI * .08;
  controls.enablePan = false;
  if (!orbit) { controls.enabled = false; } // embedded scenes (the landing page) must never trap page scroll

  const hemi = new THREE.HemisphereLight(0xffffff, 0x888070, 1.25);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xffffff, 1.7);
  sun.position.set(-10, 24, 14); sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -20, right: 20, top: 20, bottom: -20, near: 1, far: 80 });
  sun.shadow.bias = -.0004; sun.shadow.radius = 4;
  scene.add(sun);

  /* ---------- Clickable things ---------- */
  const things = new Map(); // key -> { group, card, label, ring }
  let onPick = () => {}, onHover = () => {};
  function thing(key, group, card) {
    group.userData.key = key;
    group.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
    things.set(key, { key, group, card });
    return group;
  }
  // visible only if it and every parent are visible
  function shown(o) { while (o) { if (!o.visible) return false; o = o.parent; } return true; }
  function keyOf(obj) { while (obj) { if (obj.userData.key) return obj.userData.key; obj = obj.parent; } return null; }

  const ray = new THREE.Raycaster(), ptr = new THREE.Vector2();
  let hovered = null, downAt = null;
  const el = labels.domElement;
  function pickAt(e) {
    const r = el.getBoundingClientRect();
    ptr.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ptr, camera);
    const groups = [...things.values()].filter(t => shown(t.group)).map(t => t.group);
    const hit = ray.intersectObjects(groups, true).find(h => shown(h.object) && !h.object.userData.noPick);
    return hit ? keyOf(hit.object) : null;
  }
  function setHover(key) {
    if (key === hovered) return;
    if (hovered && things.get(hovered)) glow(hovered, 0);
    hovered = key;
    if (key) glow(key, .22);
    el.style.cursor = key ? 'pointer' : (orbit ? 'grab' : 'default');
    onHover(key);
  }
  function glow(key, amount) {
    const t = things.get(key); if (!t) return;
    t.group.traverse(o => { if (o.isMesh && o.material.emissive && !o.userData.noGlow) { o.material.emissive.set(pal.accent); o.material.emissiveIntensity = amount; } });
  }
  el.addEventListener('pointermove', e => { if (e.pointerType === 'mouse') setHover(pickAt(e)); });
  el.addEventListener('pointerdown', e => { downAt = [e.clientX, e.clientY]; });
  el.addEventListener('pointerup', e => {
    if (!downAt || Math.hypot(e.clientX - downAt[0], e.clientY - downAt[1]) > 6) return; // a drag, not a click
    if (e.target.closest && e.target.closest('.wlabel')) return;
    const key = pickAt(e); if (key) onPick(key);
  });
  el.addEventListener('pointerleave', () => setHover(null));

  /* ---------- Labels and hint rings ---------- */
  function label(key, text, pos, cls = '') {
    const div = document.createElement('button');
    div.type = 'button'; div.className = 'wlabel ' + cls; div.textContent = text;
    div.addEventListener('click', ev => { ev.stopPropagation(); if (key) onPick(key); });
    div.addEventListener('pointerenter', () => key && setHover(key));
    const o = new CSS2DObject(div); o.position.copy(pos);
    scene.add(o);
    return { obj: o, el: div, set(t) { div.textContent = t; } };
  }
  function bubble(pos) {
    const div = document.createElement('div'); div.className = 'wbubble'; div.hidden = true;
    const o = new CSS2DObject(div); o.position.copy(pos); scene.add(o);
    return {
      obj: o,
      show(html, style = 'say') {
        const same = !div.hidden && div.innerHTML === html && div.dataset.style === style;
        div.innerHTML = html; div.hidden = false; div.dataset.style = style; div.className = 'wbubble ' + style;
        if (!same) { void div.offsetWidth; div.classList.add('pop'); }
      },
      hide() { div.hidden = true; }
    };
  }
  const ringMat = new THREE.MeshBasicMaterial({ color: pal.accent, transparent: true, opacity: .8, depthWrite: false });
  ringMat.userData.role = 'accent'; mats.push(ringMat);
  const rings = new Map();
  function hint(keys) {
    for (const [k, r] of rings) { if (!keys.includes(k)) { scene.remove(r); rings.delete(k); } }
    for (const k of keys) {
      if (rings.has(k) || !things.has(k)) continue;
      const box = new THREE.Box3().setFromObject(things.get(k).group);
      const c = box.getCenter(new THREE.Vector3()), s = box.getSize(new THREE.Vector3());
      const rad = Math.max(s.x, s.z) / 2 + .35;
      const r = new THREE.Mesh(new THREE.RingGeometry(rad, rad + .14, 64), ringMat);
      r.rotation.x = -Math.PI / 2; r.position.set(c.x, box.min.y + .03, c.z); r.userData.noPick = true;
      scene.add(r); rings.set(k, r);
    }
  }

  /* ---------- Camera moves ---------- */
  async function look(pos, target, ms = 1100) {
    const p0 = camera.position.clone(), t0 = controls.target.clone();
    const p1 = new THREE.Vector3(...pos), t1 = new THREE.Vector3(...target);
    await animate(ms, k => { camera.position.lerpVectors(p0, p1, k); controls.target.lerpVectors(t0, t1, k); });
  }

  /* ---------- Theme ---------- */
  function retheme() {
    pal = readPalette();
    for (const m of mats) if (pal[m.userData.role]) m.color.set(pal[m.userData.role]);
  }
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', retheme);

  // Speech bubbles near the edge of the scene get nudged back inside it
  function keepBubblesInside() {
    const box = labels.domElement.getBoundingClientRect();
    for (const b of labels.domElement.querySelectorAll('.wbubble:not([hidden])')) {
      b.style.translate = '0 0';
      const r = b.getBoundingClientRect();
      let nx = 0, ny = 0;
      if (r.left < box.left + 8) nx = box.left + 8 - r.left;
      else if (r.right > box.right - 8) nx = box.right - 8 - r.right;
      if (r.top < box.top + 8) ny = box.top + 8 - r.top;
      b.style.translate = `${nx}px ${ny}px`;
      b.style.setProperty('--tail', (-nx) + 'px');
    }
  }

  /* ---------- Loop ---------- */
  const tickers = [];
  function resize() {
    const w = canvasHost.clientWidth, h = canvasHost.clientHeight;
    renderer.setSize(w, h, false); labels.setSize(w, h);
    camera.aspect = w / h;
    camera.fov = w < 640 ? 44 : 32; // phones: wider lens so the whole diorama fits
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(canvasHost); resize();
  const clock = new THREE.Clock();
  renderer.setAnimationLoop(now => {
    const dt = clock.getDelta(), t = clock.elapsedTime;
    tickTweens(performance.now());
    for (const r of rings.values()) { const s = 1 + .08 * Math.sin(t * 4); r.scale.set(s, s, 1); r.material.opacity = .55 + .35 * Math.sin(t * 4); }
    for (const f of tickers) f(t, dt);
    controls.update();
    renderer.render(scene, camera); labels.render(scene, camera);
    keepBubblesInside();
  });

  return {
    scene, camera, controls, mat, pal: () => pal, thing, things, shown, label, bubble, hint, look, glow,
    onTick: f => tickers.push(f),
    set onPick(f) { onPick = f; }, set onHover(f) { onHover = f; }
  };
}

/* ---------- Shape helpers ---------- */
export function box(w, h, d, m, x = 0, y = 0, z = 0, r = 0) {
  const g = r ? roundedBox(w, h, d, r) : new THREE.BoxGeometry(w, h, d);
  const mesh = new THREE.Mesh(g, m); mesh.position.set(x, y + h / 2, z); return mesh;
}
function roundedBox(w, h, d, r) {
  const s = new THREE.Shape(), x = -w / 2, y = -d / 2;
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + d - r); s.quadraticCurveTo(x + w, y + d, x + w - r, y + d);
  s.lineTo(x + r, y + d); s.quadraticCurveTo(x, y + d, x, y + d - r);
  s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
  const g = new THREE.ExtrudeGeometry(s, { depth: h, bevelEnabled: false, curveSegments: 6 });
  g.rotateX(-Math.PI / 2); g.translate(0, -h / 2, 0);
  return g;
}
const lathe = pts => new THREE.LatheGeometry(pts.map(([r, y]) => new THREE.Vector2(r, y)), 40);

/* A chess pawn, the site's emblem for a player. Height about 1.7. */
export function pawn(m, maskMat) {
  const g = new THREE.Group();
  g.add(new THREE.Mesh(lathe([[0, 0], [.62, 0], [.64, .1], [.55, .2], [.42, .28], [.3, .5], [.22, .95], [.36, 1.02], [.36, 1.07], [.18, 1.12], [0, 1.12]]), m));
  const head = new THREE.Mesh(new THREE.SphereGeometry(.34, 32, 20), m); head.position.y = 1.38; g.add(head);
  if (maskMat) { // a robber's eye mask
    const mask = new THREE.Mesh(new THREE.CylinderGeometry(.352, .352, .13, 32, 1, true), maskMat);
    mask.position.y = 1.42; mask.material.side = THREE.DoubleSide; g.add(mask);
    const knot = new THREE.Mesh(new THREE.SphereGeometry(.07, 12, 8), maskMat); knot.position.set(0, 1.42, -.36); g.add(knot);
  }
  return g;
}

/* A chess king, used for the detective. Height about 2.6. */
export function king(m) {
  const g = new THREE.Group();
  g.add(new THREE.Mesh(lathe([[0, 0], [.7, 0], [.72, .12], [.6, .24], [.46, .32], [.34, .6], [.26, 1.5], [.42, 1.58], [.42, 1.64], [.3, 1.7], [.44, 2.1], [.44, 2.18], [0, 2.18]]), m));
  g.add(box(.12, .42, .12, m, 0, 2.18, 0));
  g.add(box(.34, .11, .12, m, 0, 2.38, 0));
  return g;
}

/* A stack of n unit blocks, used for years in prison or profit. */
export function stack(n, m, size = .3, gap = .04) {
  const g = new THREE.Group();
  for (let i = 0; i < n; i++) g.add(box(size, size, size, m, 0, i * (size + gap), 0));
  return g;
}

export { CSS2DObject };
