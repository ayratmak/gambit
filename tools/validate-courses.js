#!/usr/bin/env node
// Checks every course in assets/courses/ against docs/STEP-TYPES.md.
// Usage: node tools/validate-courses.js [course-id ...]
const fs = require('fs'), path = require('path'), vm = require('vm');
const dir = path.join(__dirname, '..', 'assets', 'courses');
const only = process.argv.slice(2);
const BANNED = /\b(TWS|JLR|Jaguar|Land Rover|LBG|Lloyds|bonus\/malus|malus|comparison price|transfer price|structured negotiation|Hong Kong|Safe Harbour|comDOC|WAO|MDO|shiftability|war room)\b|[–—]/i;
let errors = 0, warnings = 0;
const err = (where, msg) => { errors++; console.log(`  ✗ ${where}: ${msg}`); };
const warn = (where, msg) => { warnings++; console.log(`  ! ${where}: ${msg}`); };

function scanText(where, obj) {
  const walk = (v, p) => {
    if (typeof v === 'string') { const m = v.match(BANNED); if (m) err(where + p, `banned word or dash "${m[0]}"`); }
    else if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${p}[${i}]`));
    else if (v && typeof v === 'object') for (const k of Object.keys(v)) if (k !== 'expr') walk(v[k], `${p}.${k}`);
  };
  walk(obj, '');
}

function backward(node) {
  if (node.pay) return node.pay;
  const outs = node.options.map(o => backward(o.next || o));
  let best = outs[0];
  outs.forEach(o => { if (o[node.p] > best[node.p]) best = o; });
  return best;
}

function checkStep(s, w) {
  const need = (k) => { if (s[k] === undefined || s[k] === '') err(w, `missing "${k}"`); };
  switch (s.t) {
    case 'read': need('title'); if (!Array.isArray(s.body) || !s.body.length) err(w, 'body must be a non-empty array'); break;
    case 'summary': if (!Array.isArray(s.points) || s.points.length !== 3) err(w, 'summary needs exactly 3 points'); break;
    case 'choice': {
      need('q');
      if (!Array.isArray(s.options) || s.options.length < 2 || s.options.length > 4) { err(w, 'choice needs 2-4 options'); break; }
      const oks = s.options.filter(o => o.ok).length; if (oks !== 1) err(w, `choice needs exactly one ok option, has ${oks}`);
      s.options.forEach((o, i) => { if (!o.text) err(w, `option ${i} missing text`); if (!o.why) err(w, `option ${i} missing why`); });
      break;
    }
    case 'sort':
      need('title'); need('prompt');
      if (!Array.isArray(s.buckets) || s.buckets.length < 2 || s.buckets.length > 3) err(w, 'sort needs 2-3 buckets');
      if (!Array.isArray(s.items) || s.items.length < 3) err(w, 'sort needs 3+ items');
      else s.items.forEach((it, i) => { if (!(it.bucket >= 0 && it.bucket < s.buckets.length)) err(w, `item ${i} bad bucket`); if (!it.why) err(w, `item ${i} missing why`); });
      break;
    case 'matrix': case 'repeated': {
      need('title'); need('prompt');
      const ok = Array.isArray(s.rows) && Array.isArray(s.cols) && Array.isArray(s.pay) && s.pay.length === s.rows.length && s.pay.every(r => r.length === s.cols.length && r.every(c => Array.isArray(c) && c.length === 2 && c.every(Number.isFinite)));
      if (!ok) err(w, 'rows/cols/pay shape is wrong');
      if (s.t === 'matrix') { if (!['explore', 'nash'].includes(s.task)) err(w, 'task must be explore or nash'); if (s.task === 'nash') need('explain'); }
      if (s.t === 'repeated') { if (s.rows.length !== 2 || s.cols.length !== 2) err(w, 'repeated must be 2x2'); need('moves'); need('short'); need('rounds'); if (s.bot && !['tft', 'grim', 'always'].includes(s.bot)) err(w, 'bad bot'); }
      break;
    }
    case 'slider': {
      need('title'); need('prompt');
      if (!Array.isArray(s.inputs) || !s.inputs.length) { err(w, 'slider needs inputs'); break; }
      if (!Array.isArray(s.outputs) || !s.outputs.length) { err(w, 'slider needs outputs'); break; }
      const env = {};
      s.inputs.forEach(inp => { if (!inp.id || !(inp.min < inp.max) || !(inp.value >= inp.min && inp.value <= inp.max)) err(w, `input ${inp.id} needs id and min < value <= max`); env[inp.id] = inp.value; });
      const run = (expr, e) => Function(...Object.keys(e), 'return (' + expr + ')')(...Object.values(e));
      try {
        s.outputs.forEach(o => { const v = run(o.expr, env); if (!Number.isFinite(v)) err(w, `output ${o.id || o.label} is not a number at defaults`); if (o.id) env[o.id] = v; });
        if (s.goal) {
          if (run(s.goal.expr, env)) warn(w, 'goal is already met at default values');
          // Can the goal be reached? Try every slider combination when there are few enough, otherwise a fixed
          // pseudo-random sample (deterministic, so the deploy check never flakes).
          const sizes = s.inputs.map(inp => Math.round((inp.max - inp.min) / (inp.step || 1)) + 1);
          const combos = sizes.reduce((a, b) => a * b, 1);
          let seed = 12345; const rand = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
          const tries = combos <= 200000 ? combos : 60000;
          let reach = false;
          for (let k = 0; k < tries && !reach; k++) {
            const e = {}; let rest = k;
            s.inputs.forEach((inp, j) => { const idx = combos <= 200000 ? rest % sizes[j] : Math.floor(rand() * sizes[j]); if (combos <= 200000) rest = Math.floor(rest / sizes[j]); e[inp.id] = inp.min + idx * (inp.step || 1); });
            s.outputs.forEach(o => { if (o.id) e[o.id] = run(o.expr, e); });
            if (run(s.goal.expr, e)) reach = true;
          }
          if (!reach) err(w, combos <= 200000 ? 'goal can\'t be reached with any slider setting' : 'goal not reached in 60,000 sampled settings');
        }
      } catch (x) { err(w, 'expression error: ' + x.message); }
      break;
    }
    case 'tree': {
      need('title'); need('prompt'); need('explain');
      if (!Array.isArray(s.players) || s.players.length !== 2) err(w, 'tree needs 2 players');
      let leaves = 0, depth = 0;
      const walk = (n, d) => {
        depth = Math.max(depth, d);
        if (n.pay) { leaves++; if (n.pay.length !== 2 || !n.pay.every(Number.isFinite)) err(w, 'leaf pay must be 2 numbers'); return; }
        if (!(n.p === 0 || n.p === 1) || !Array.isArray(n.options) || n.options.length < 2) { err(w, 'decision node needs p (0/1) and 2+ options'); return; }
        n.options.forEach(o => { if (!o.label) err(w, 'option missing label'); if (o.next) walk(o.next, d + 1); else if (o.pay) { leaves++; if (o.pay.length !== 2) err(w, 'leaf pay must be 2 numbers'); } else err(w, 'option needs next or pay'); });
      };
      if (s.root) walk(s.root, 1); else err(w, 'missing root');
      if (leaves > 8) warn(w, `${leaves} leaves; keep to 8 so it fits a phone`);
      if (depth > 3) warn(w, `depth ${depth}; keep to 3`);
      break;
    }
    case 'dialogue': {
      need('title'); need('prompt'); need('them'); need('start');
      const nodes = s.nodes || {};
      if (!nodes[s.start]) { err(w, 'start node missing'); break; }
      const seen = new Set(), stack = [s.start]; let ends = 0;
      while (stack.length) {
        const id = stack.pop(); if (seen.has(id)) continue; seen.add(id);
        const n = nodes[id]; if (!n) { err(w, `next "${id}" does not exist`); continue; }
        if (!n.say) err(w, `node ${id} missing say`);
        if (n.end) { ends++; if (!n.result) err(w, `end ${id} missing result`); if (!['good', 'ok', 'bad'].includes(n.verdict)) err(w, `end ${id} bad verdict`); continue; }
        if (!Array.isArray(n.options) || n.options.length < 2) err(w, `node ${id} needs 2+ options`);
        else n.options.forEach((o, i) => { if (!o.text || !o.next) err(w, `node ${id} option ${i} needs text and next`); if (!o.note) err(w, `node ${id} option ${i} missing note`); stack.push(o.next); });
      }
      if (!ends) err(w, 'no reachable end node');
      Object.keys(nodes).forEach(k => { if (!seen.has(k)) warn(w, `node ${k} is unreachable`); });
      break;
    }
    case 'auction':
      need('title'); need('prompt');
      if (!['buy', 'sell'].includes(s.side)) err(w, 'side must be buy or sell');
      if (!['first', 'second', 'english'].includes(s.mode)) err(w, 'mode must be first, second or english');
      if (!(s.rivals >= 1 && s.rivals <= 12)) err(w, 'rivals must be 1-12');
      if (!s.common && !(Array.isArray(s.range) && s.range[0] < s.range[1])) err(w, 'private-value auction needs range [lo, hi]');
      if (s.common && !(s.common.truth > 0 && s.common.spread > 0 && s.common.spread < 1)) err(w, 'common needs truth > 0 and 0 < spread < 1');
      if (!(s.rounds >= 1 && s.rounds <= 6)) err(w, 'rounds must be 1-6');
      need('explain');
      break;
    default: err(w, `unknown step type "${s.t}"`);
  }
}

const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'));
const sandbox = { window: {} }; vm.createContext(sandbox);
for (const f of files) { try { vm.runInContext(fs.readFileSync(path.join(dir, f), 'utf8'), sandbox, { filename: f }); } catch (x) { errors++; console.log(`✗ ${f} does not load: ${x.message}`); } }
const courses = (sandbox.window.GAMBIT_COURSES || []).filter(c => !only.length || only.includes(c.id));
const ids = new Set();
for (const c of courses) {
  console.log(`\n${c.id}: ${c.title}`);
  if (ids.has(c.id)) err(c.id, 'duplicate course id'); ids.add(c.id);
  ['id', 'order', 'title', 'piece', 'level', 'track', 'minutes', 'summary'].forEach(k => { if (c[k] === undefined) err(c.id, `missing ${k}`); });
  if (!['pawn', 'knight', 'bishop', 'rook', 'queen', 'king'].includes(c.piece)) err(c.id, 'bad piece');
  if (!c.free && c.price !== 9.89) err(c.id, 'paid courses cost 9.89');
  if (!Array.isArray(c.outcomes) || c.outcomes.length < 3) err(c.id, 'needs 3+ outcomes');
  const lessons = (c.modules || []).flatMap(m => m.lessons || []);
  const lids = new Set(); let mins = 0, previews = 0;
  lessons.forEach(l => {
    const w = `${c.id}/${l.id}`;
    if (lids.has(l.id)) err(w, 'duplicate lesson id'); lids.add(l.id);
    if (!l.title || !l.minutes || !['Concept', 'Game', 'Case'].includes(l.kind)) err(w, 'lesson needs title, minutes, kind (Concept/Game/Case)');
    mins += l.minutes || 0; if (l.preview) previews++;
    if (!Array.isArray(l.steps) || l.steps.length < 3) { err(w, 'lesson needs 3+ steps'); return; }
    if (l.steps[l.steps.length - 1].t !== 'summary') warn(w, 'last step is usually a summary');
    if (!l.steps.some(s => s.t !== 'read' && s.t !== 'summary')) err(w, 'lesson needs at least one interactive step');
    l.steps.forEach((s, i) => checkStep(s, `${w} step ${i + 1} (${s.t})`));
  });
  if (!c.free && previews !== 1) err(c.id, `paid course needs exactly one preview lesson, has ${previews}`);
  const ex = c.exam;
  if (!ex || ex.pass !== 7 || !Array.isArray(ex.questions) || ex.questions.length !== 10) err(c.id, 'exam needs pass 7 and 10 questions');
  else ex.questions.forEach((q, i) => { if (!q.q || !Array.isArray(q.options) || q.options.length !== 4 || !(q.answer >= 0 && q.answer < 4) || !q.why) err(`${c.id} exam q${i + 1}`, 'needs q, 4 options, answer 0-3, why'); });
  scanText(c.id, c);
  console.log(`  ${lessons.length} lessons, ${mins} min, ${lessons.reduce((n, l) => n + (l.steps || []).length, 0)} steps`);
}
console.log(`\n${courses.length} course(s), ${errors} error(s), ${warnings} warning(s)`);
process.exit(errors ? 1 : 0);
