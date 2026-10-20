#!/usr/bin/env node
/* Checks every 3D lesson in assets/world/ without a browser: builds the scene with a stand-in renderer, plays every
   step's enter and done hooks, opens every object's card at every step, and checks the tour points at real things.
   Needs three.js in node_modules (deploy.sh installs it). Usage: node tools/validate-worlds.mjs [world-id ...] */
import { register } from 'node:module';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const THREE_DIR = path.join(ROOT, 'node_modules', 'three');
if (!existsSync(THREE_DIR)) { console.error('three.js not installed: run  npm i --no-save three@0.160.0'); process.exit(1); }

// Map the browser import map ('three', 'three/addons/...') onto node_modules
const hook = `
const T = ${JSON.stringify(pathToFileURL(THREE_DIR).href)};
export async function resolve(spec, ctx, next) {
  if (spec === 'three') return { url: T + '/build/three.module.js', shortCircuit: true };
  if (spec.startsWith('three/addons/')) return { url: T + '/examples/jsm/' + spec.slice(13), shortCircuit: true };
  return next(spec, ctx);
}`;
register('data:text/javascript,' + encodeURIComponent(hook));

// Minimal browser stand-ins for the bits the characters touch at build time
const fakeCtx = { fillRect() {}, set fillStyle(v) {} };
globalThis.document = { createElement: () => ({ width: 0, height: 0, getContext: () => fakeCtx, style: {} }), documentElement: { dataset: {} } };
globalThis.matchMedia = () => ({ matches: false, addEventListener() {} });
globalThis.getComputedStyle = () => ({ getPropertyValue: () => '#888888' });
// Animations can't tick without a browser; their timer fallback finishes them. Make those timers instant.
const realTimeout = setTimeout;
globalThis.setTimeout = (fn, ms, ...a) => realTimeout(fn, 0, ...a);

const THREE = await import('three');
const { CAST } = await import(pathToFileURL(path.join(ROOT, 'assets/world/characters.js')).href);

const BANNED = /\b(TWS|JLR|Jaguar|Land Rover|LBG|Lloyds|bonus\/malus|malus|comparison price|transfer price|structured negotiation|WAO|MDO|shiftability|war room)\b|[–—]/i;

function fakeWorld() {
  const scene = new THREE.Scene(), things = new Map(), labels = [];
  const shown = o => { while (o) { if (!o.visible) return false; o = o.parent; } return true; };
  const el = () => ({ hidden: false, style: {}, textContent: '', remove() {}, classList: { add() {}, remove() {} } });
  return {
    scene, things, shown, labels,
    camera: new THREE.PerspectiveCamera(), controls: { target: new THREE.Vector3() },
    mat: (role, opts = {}) => new THREE.MeshStandardMaterial({ color: role.startsWith('#') ? role : '#888888', ...opts }),
    thing(key, group) { group.userData.key = key; things.set(key, { key, group }); return group; },
    label(key, text, pos) { const o = new THREE.Object3D(); o.position.copy(pos); scene.add(o); const l = { key, text, obj: o, el: el(), set(t) { l.text = t; } }; labels.push(l); return l; },
    bubble(pos) { const o = new THREE.Object3D(); o.position.copy(pos); scene.add(o); return { obj: o, show() {}, hide() {} }; },
    hint() {}, glow() {}, look: async () => {}, onTick() {}, pal: () => ({})
  };
}

function strings(v, out = []) {
  if (typeof v === 'string') out.push(v);
  else if (Array.isArray(v)) v.forEach(x => strings(x, out));
  else if (v && typeof v === 'object') Object.values(v).forEach(x => strings(x, out));
  return out;
}

const ids = process.argv.slice(2).length ? process.argv.slice(2)
  : readdirSync(path.join(ROOT, 'assets/world')).filter(f => f.endsWith('.js') && !['engine.js', 'characters.js', 'kit.js', 'landing.js'].includes(f)).map(f => f.slice(0, -3));

// The registry (assets/worlds.js) says which lesson in each course has a 3D lesson
const reg = (() => { const window = {}; new Function('window', readFileSync(path.join(ROOT, 'assets/worlds.js'), 'utf8'))(window); return window.GAMBIT_WORLDS; })();
let failures = 0;
if (!process.argv.slice(2).length) for (const [course, r] of Object.entries(reg)) {
  if (!ids.includes(r.world)) { failures++; console.log(`✗ registry: ${course} points at missing world "${r.world}"`); }
}
for (const id of ids) {
  const errs = [], err = m => errs.push(m);
  try {
    const mod = await import(pathToFileURL(path.join(ROOT, 'assets/world', id + '.js')).href);
    const { meta, steps, card, build } = mod;
    if (!meta || meta.id !== id) err(`meta.id should be "${id}"`);
    const courseFile = path.join(ROOT, 'assets/courses', (meta && meta.course) + '.js');
    if (!existsSync(courseFile)) err(`meta.course "${meta && meta.course}" has no course file`);
    else if (!new RegExp(`id:\\s*['"]${meta.lesson}['"]`).test(readFileSync(courseFile, 'utf8'))) err(`meta.lesson "${meta.lesson}" isn't a lesson in ${meta.course}`);
    const entry = Object.entries(reg).find(([, r]) => r.world === id);
    if (!entry) err('not listed in assets/worlds.js');
    else if (entry[0] !== meta.course || entry[1].lesson !== meta.lesson) err(`assets/worlds.js says ${entry[0]}/${entry[1].lesson}, meta says ${meta.course}/${meta.lesson}`);
    if (!Array.isArray(steps) || steps.length < 8 || steps.length > 14) err(`needs 8 to 14 steps, has ${steps && steps.length}`);
    if (!steps[steps.length - 1].summary) err('last step needs a summary');
    const seen = new Set();
    const w = fakeWorld();
    const api = build(w);
    if (!w.things.has('max') || !w.things.has('libby')) err('Max and Libby must both be in the scene (keys "max" and "libby")');
    const badPos = () => { const bad = []; w.scene.traverse(o => { if (![o.position.x, o.position.y, o.position.z].every(Number.isFinite)) bad.push(o.userData.key || o.type); }); return bad; };
    const camOk = c => Array.isArray(c) && c.length === 2 && c.every(v => Array.isArray(v) && v.length === 3 && v.every(Number.isFinite));
    for (let i = 0; i < steps.length; i++) {
      const s = steps[i], at = `step ${i + 1} (${s.id})`;
      if (!s.id || seen.has(s.id)) err(`${at}: missing or duplicate id`); seen.add(s.id);
      if (!s.title) err(`${at}: no title`);
      if (!s.cam || !camOk(s.cam.wide) || !camOk(s.cam.phone)) err(`${at}: cam needs wide and phone [[x,y,z],[x,y,z]]`);
      if (!s.lines || !s.lines.length) err(`${at}: Max and Libby should say something (lines)`);
      for (const l of s.lines || []) {
        if (!CAST[l.who]) err(`${at}: unknown speaker "${l.who}"`);
        const plain = (l.text || '').replace(/<[^>]+>/g, '');
        if (!plain) err(`${at}: empty line`);
        if (plain.length > 200) err(`${at}: line too long for a speech bubble (${plain.length} chars): "${plain.slice(0, 40)}…"`);
      }
      const t = s.task;
      if (t) {
        if (t.click) { if (!t.say) err(`${at}: click task needs "say"`); }
        else if (t.pick) { if (!t.pick.say || !t.pick.why) err(`${at}: pick task needs say and why`); }
        else if (t.choice) { if (t.choice.options.filter(o => o.ok).length !== 1) err(`${at}: choice needs exactly one ok option`); t.choice.options.forEach(o => { if (!o.why) err(`${at}: every option needs a why`); }); }
        else err(`${at}: task must be click, pick or choice`);
      } else if (!s.summary) err(`${at}: only the summary step may have no task`);
      try { if (s.enter) await s.enter(api); } catch (e) { err(`${at}: enter() threw ${e.message}`); }
      const keys = [...w.things.keys()].filter(k => w.shown(w.things.get(k).group));
      const need = t ? (t.click || (t.pick ? [t.pick.answer, ...Object.keys(t.pick.wrong || {})] : [])) : [];
      for (const k of need) if (!keys.includes(k)) err(`${at}: task points at "${k}", which isn't visible after enter()`);
      const ctx = { api, stepId: s.id, reached: id2 => steps.findIndex(x => x.id === id2) <= i };
      for (const k of keys) {
        try {
          const c = card(k, ctx);
          if (!c || !c.title || !Array.isArray(c.rows)) err(`${at}: card("${k}") needs a title and rows`);
          else if (c.title === k) err(`${at}: card("${k}") falls through to the default; give it a real card`);
          for (const str of strings(c)) { const m = str.match(BANNED); if (m) err(`${at}: card("${k}") uses banned "${m[0]}"`); }
        } catch (e) { err(`${at}: card("${k}") threw ${e.message}`); }
      }
      try { if (s.done) await s.done(api); } catch (e) { err(`${at}: done() threw ${e.message}`); }
      const bad = badPos(); if (bad.length) err(`${at}: objects at a non-number position: ${[...new Set(bad)].slice(0, 5).join(', ')}`);
    }
    for (const str of strings(steps.map(s => ({ t: s.title, l: s.lines, s: s.summary, k: s.task })))) { const m = str.match(BANNED); if (m) err(`banned word or dash "${m[0]}" in: ${str.slice(0, 60)}`); }
  } catch (e) { err(`failed to load: ${e.stack || e.message}`); }
  if (errs.length) { failures++; console.log(`✗ ${id}`); errs.forEach(e => console.log('   ' + e)); }
  else console.log(`✓ ${id}`);
}
process.exit(failures ? 1 : 0);
