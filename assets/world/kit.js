/* Shared building blocks for 3D lessons: the plinth, Max and Libby (plus extras) with speech, and a 2x2 payoff board.
   A world file calls these from build(w) so every lesson looks and behaves the same. See docs/3D-LESSONS.md. */
import { THREE, box, stack, animate } from './engine.js';
import { CAST, makeCharacter } from './characters.js';

export const V = (x, y, z) => new THREE.Vector3(x, y, z);
export const COLORS = { max: CAST.max.top, libby: CAST.libby.top };

/* A paper diorama base. Everything sits on top of it at y = 0. */
export function stage(w, { width = 26, depth = 18, x = 0, z = 0 } = {}) {
  const g = new THREE.Group();
  g.add(box(width, 1.2, depth, w.mat('raised'), x, -1.2, z, .5));
  g.traverse(o => { if (o.isMesh) { o.receiveShadow = true; o.userData.noPick = true; } });
  w.scene.add(g);
  return g;
}

/* Scenery that can't be clicked (tables, walls, trees). */
export function scenery(w, obj) {
  obj.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; o.userData.noPick = true; } });
  w.scene.add(obj);
  return obj;
}

/* A clickable object with its own state card (the card text comes from the world's card(key) function). */
export function prop(w, key, obj, labelText, labelY = 2, cls = 'sign') {
  w.scene.add(w.thing(key, obj));
  let lbl = null;
  if (labelText) { lbl = w.label(key, labelText, V(0, labelY, 0), cls); obj.add(lbl.obj); }
  return { obj, label: lbl, show(on) { obj.visible = on; if (lbl) { lbl.obj.visible = on; lbl.el.hidden = !on; } } };
}

/* Max, Libby and any extras. places: { max: [x, z], libby: [x, z], detective: [x, z], ... } where extras are CAST keys
   or { spec, at } for a one-off. Returns speech, faces, poses and movement helpers. Keys 'max' and 'libby' are clickable. */
export function cast(w, places, { names = {} } = {}) {
  const chars = {}, bubbles = {}, labels = {}, homes = {};
  for (const [key, where] of Object.entries(places)) {
    const one = !Array.isArray(where);              // a one-off extra: { spec, at }
    const spec = one ? where.spec : CAST[key];
    const at = one ? where.at : where;
    const c = makeCharacter(spec, w.mat);
    c.root.position.set(at[0], .02, at[1]);
    if (at[2]) c.root.rotation.y = at[2];
    w.scene.add(w.thing(key, c.root));
    const cls = key === 'max' ? 'player you' : key === 'libby' ? 'player them' : 'player';
    labels[key] = w.label(key, names[key] || spec.name, V(0, 2.55 * (spec.height || 1), 0), cls);
    c.root.add(labels[key].obj);
    bubbles[key] = w.bubble(V(0, 3.2 * (spec.height || 1), 0)); c.root.add(bubbles[key].obj);
    chars[key] = c; homes[key] = c.root.position.clone();
  }
  w.onTick((t, dt) => Object.values(chars).forEach(c => c.update(t, dt, w.camera.position)));

  const thoughts = {};
  const api = {
    chars,
    say(who, html, ms = 2400) {
      Object.entries(bubbles).forEach(([k, b]) => { if (k !== who) thoughts[k] ? b.show(thoughts[k], 'think') : b.hide(); });
      bubbles[who].show(html, 'say'); chars[who].talk(ms);
    },
    quiet() { Object.entries(bubbles).forEach(([k, b]) => thoughts[k] ? b.show(thoughts[k], 'think') : b.hide()); },
    think(who, html) { thoughts[who] = html; html ? bubbles[who].show(html, 'think') : bubbles[who].hide(); },
    clearThoughts() { Object.keys(bubbles).forEach(k => api.think(k, null)); },
    faces(a, b = a) { chars.max && chars.max.face(a); chars.libby && chars.libby.face(b); },
    poses(a, b = a) { chars.max && chars.max.pose(a); chars.libby && chars.libby.pose(b); },
    name(who, text) { labels[who].set(text); },
    outfit(who, o) { chars[who].outfit(o); },
    /* Jump a character to a point [x, z] (arms up while airborne). */
    async hop(who, to, ms = 900) {
      const r = chars[who].root, from = r.position.clone(), dest = V(to[0], to[2] === undefined ? .02 : to[2], to[1]);
      chars[who].pose('cheer');
      await animate(ms, k => { r.position.lerpVectors(from, dest, k); r.position.y = from.y + (dest.y - from.y) * k + Math.sin(k * Math.PI) * 2; });
      chars[who].pose('idle');
    },
    /* Walk along the floor (no jump), turning to face the way they go, then face the camera again. */
    async walk(who, to, ms = 1200) {
      const r = chars[who].root, from = r.position.clone(), dest = V(to[0], .02, to[1]);
      r.rotation.y = Math.atan2(dest.x - from.x, dest.z - from.z);
      await animate(ms, k => { r.position.lerpVectors(from, dest, k); r.position.y = .02 + Math.abs(Math.sin(k * Math.PI * 6)) * .06; });
      r.rotation.y = 0;
    },
    async home(ms = 700) {
      await Promise.all(Object.keys(chars).filter(k => chars[k].root.position.distanceTo(homes[k]) > .01)
        .map(k => api.hop(k, [homes[k].x, homes[k].z], ms)));
    },
    show(who, on) { chars[who].root.visible = on; labels[who].obj.visible = on; labels[who].el.hidden = !on; if (!on) bubbles[who].hide(); }
  };
  return api;
}

/* A 2x2 (or 2x3) payoff board. Cells are clickable as 'cell-<row><col>'. Max's payoff stacks are green (left), Libby's gold (right).
   game = { rows: [...], cols: [...], pay: [[[max, libby], ...], ...], fmt: n => string }. */
export function board(w, { center = [0, 4], cell = [4, 2.6], gap = .3 } = {}) {
  const parts = [], cells = {}, stacks = [], stackLabels = [];
  let game = null, rowLbl = [], colLbl = [];
  const base = new THREE.Group(); w.scene.add(base);
  const make = g => {
    // rebuild the frame for this game's shape
    for (const p of parts) p.parent && p.parent.remove(p);
    for (const l of [...rowLbl, ...colLbl]) { l.obj.parent && l.obj.parent.remove(l.obj); l.el.remove(); }
    parts.length = 0; rowLbl = []; colLbl = [];
    Object.keys(cells).forEach(k => { w.things.delete(k); delete cells[k]; });
    const R = g.rows.length, Cn = g.cols.length;
    const W = Cn * cell[0] + (Cn - 1) * gap, D = R * cell[1] + (R - 1) * gap;
    const x0 = center[0] - W / 2 + cell[0] / 2, z0 = center[1] - D / 2 + cell[1] / 2;
    const frame = box(W + .9, .12, D + .9, w.mat('surface'), center[0], 0, center[1], .3);
    frame.receiveShadow = true; frame.userData.noPick = true; base.add(frame); parts.push(frame);
    for (let r = 0; r < R; r++) for (let c = 0; c < Cn; c++) {
      const cg = new THREE.Group();
      cg.add(box(cell[0], .1, cell[1], w.mat('raised'), 0, 0, 0, .18));
      cg.position.set(x0 + c * (cell[0] + gap), .12, z0 + r * (cell[1] + gap));
      w.thing(`cell-${r}${c}`, cg); base.add(cg);
      cells[`cell-${r}${c}`] = cg; parts.push(cg);
    }
    rowLbl = g.rows.map((t, r) => w.label(null, t, V(center[0] - W / 2 - .7, .3, z0 + r * (cell[1] + gap)), 'axis row'));
    colLbl = g.cols.map((t, c) => w.label(null, t, V(x0 + c * (cell[0] + gap), .3, center[1] - D / 2 - .45), 'axis'));
  };
  const api = {
    cells, get game() { return game; },
    cellCenter(r, c) { const p = cells[`cell-${r}${c}`].position; return [p.x, p.z]; },
    async set(g, grow = true) {
      const shapeChanged = !game || game.rows.length !== g.rows.length || game.cols.length !== g.cols.length;
      game = g;
      if (shapeChanged) make(g);
      g.rows.forEach((t, r) => rowLbl[r].set(t)); g.cols.forEach((t, c) => colLbl[c].set(t));
      for (const s of stacks) s.parent && s.parent.remove(s);
      for (const l of stackLabels) { l.obj.parent && l.obj.parent.remove(l.obj); l.el.remove(); }
      stacks.length = 0; stackLabels.length = 0;
      g.rows.forEach((_, r) => g.cols.forEach((__, c) => {
        const [a, b] = g.pay[r][c], cg = cells[`cell-${r}${c}`];
        [[a, COLORS.max, -.75, ' you'], [b, COLORS.libby, .75, ' them']].forEach(([n, col, dx, who]) => {
          const s = stack(Math.max(0, Math.round(n)), w.mat(col), .22, .03); s.position.set(dx, .1, 0);
          s.traverse(o => { if (o.isMesh) { o.castShadow = true; o.userData.noGlow = true; } });
          cg.add(s); stacks.push(s);
          const l = w.label(`cell-${r}${c}`, g.fmt ? g.fmt(n) : String(n), V(dx, .2, .95), 'stack' + who);
          cg.add(l.obj); stackLabels.push(l);
          if (grow) { s.scale.y = .001; l.el.style.opacity = 0; }
        });
      }));
      if (grow) await animate(900, k => { stacks.forEach(s => s.scale.y = Math.max(.001, k)); stackLabels.forEach(l => l.el.style.opacity = k); });
    },
    async show(g) {
      if (g && g !== game) {
        base.visible = true; [...rowLbl, ...colLbl].forEach(l => { l.obj.visible = true; l.el.hidden = false; });
        return api.set(g);
      }
      if (base.visible && stacks.length) return;
      base.visible = true;
      [...rowLbl, ...colLbl].forEach(l => { l.obj.visible = true; l.el.hidden = false; });
      base.scale.set(.001, .001, .001);
      await animate(600, k => base.scale.set(k, k, k));
      if (g || game) await api.set(g || game);
    },
    hide() {
      base.visible = false;
      [...rowLbl, ...colLbl, ...stackLabels].forEach(l => { l.obj.visible = false; l.el.hidden = true; });
    },
    /* Dim every square except the keys given (null shows all). */
    spot(keys) {
      Object.entries(cells).forEach(([k, cg]) => {
        const on = !keys || keys.includes(k);
        cg.traverse(o => { if (o.isMesh) { o.material.transparent = true; o.material.opacity = on ? 1 : .22; } });
      });
      stackLabels.forEach(l => { let o = l.obj.parent; while (o && !o.userData.key) o = o.parent; l.el.style.opacity = !keys || keys.includes(o && o.userData.key) ? 1 : .2; });
    }
  };
  base.visible = false;
  return api;
}

export { THREE, box, stack, animate, CAST };
