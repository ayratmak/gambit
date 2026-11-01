// Schedules a finished video as a Reel on @hayekyeah (Instagram) and the hayekyeah Facebook Page, through the bot's queue
// (src/publish.js, src/fb.js). Run from the repo root:
//   node ig-bot/schedule.mjs "final/2026-11-07 ticket-touts" "2026-11-07 18:00 UK" [--ig-only|--fb-only] [--dry-run]
//   node ig-bot/schedule.mjs ticket-touts "2026-11-07 18:00 UK"     same thing: finds the final folder by its slug
//   (by default it queues the Reel for Instagram and for the Facebook Page)
//   node ig-bot/schedule.mjs list
//   node ig-bot/schedule.mjs cancel <id>          id = the slug for Instagram, fb:<slug> for Facebook
//   node ig-bot/schedule.mjs cover fb:<slug>      put the cover on a Facebook reel that went out without it
// A final folder holds video.mp4, cover.jpg and post.md. post.md's "## Description (paste as is)" section is the caption,
// "## Pinned comment" the first comment. Without a final folder it falls back to video/out/<slug>.mp4 and
// video/out/<slug>-cover.jpg. <when> takes an ISO time with offset, or "YYYY-MM-DD HH:MM UK|ET|UTC".
// --dry-run reads and checks everything, prints what it would queue, and uploads nothing.
import { readFileSync, existsSync, statSync, readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import os from 'node:os';

const DIR = path.dirname(fileURLToPath(import.meta.url)), REPO = path.join(DIR, '..');
const BASE = 'https://hayek-ig-bot.ayrat-mak.workers.dev', BUCKET = 'hayek-media';
const KEY_FILE = path.join(os.homedir(), '.config/hayekyeah/ig-stats-key');

// "2026-11-03 18:00 UK" -> ISO. UK/ET resolve daylight saving through Intl, so the wall-clock time is what you typed.
export function when(s) {
  const m = /^(\d{4}-\d{2}-\d{2})[ T](\d{1,2}):(\d{2})\s*(ET|UK|UTC)$/i.exec(s.trim());
  if (!m) { const d = new Date(s); if (!s.trim() || isNaN(d)) throw new Error(`can't read time "${s}"`); return d.toISOString(); }
  const zone = { ET: 'America/New_York', UK: 'Europe/London', UTC: 'UTC' }[m[4].toUpperCase()];
  const guess = Date.parse(`${m[1]}T${m[2].padStart(2, '0')}:${m[3]}:00Z`);
  const shown = new Date(new Date(guess).toLocaleString('en-US', { timeZone: zone }) + ' UTC').getTime();
  return new Date(guess + (guess - shown)).toISOString();
}

// The text under a "## <name>..." heading, up to the next "## " heading. Matches "## Description (paste as is)" for "Description".
export function section(md, name) {
  const lines = md.replace(/\r\n/g, '\n').split('\n');
  const start = lines.findIndex(l => new RegExp(`^##\\s+${name}\\b`, 'i').test(l));
  if (start < 0) return '';
  const end = lines.findIndex((l, i) => i > start && /^##\s/.test(l));
  return lines.slice(start + 1, end < 0 ? undefined : end).join('\n').trim();
}

export function readPost(file) {
  const md = readFileSync(file, 'utf8');
  return { caption: section(md, 'Description'), first_comment: section(md, 'Pinned comment') || null };
}

const isDir = p => existsSync(p) && statSync(p).isDirectory();

// Works out video, cover, post.md and the slug from a final folder path or a bare slug.
export function resolveInput(arg, { cwd = process.cwd(), repo = REPO } = {}) {
  const tries = [path.resolve(cwd, arg), path.resolve(repo, arg)];
  // the final folders sit at the repo root (final/), not under video/
  if (/^video\/final\//.test(arg)) tries.push(path.resolve(repo, arg.replace(/^video\//, '')));
  let folder = tries.find(isDir);
  if (!folder && !arg.includes('/')) {
    const finals = path.join(repo, 'final');
    const hit = isDir(finals) && readdirSync(finals).filter(n => n.replace(/^\d{4}-\d{2}-\d{2}\s+/, '') === arg).sort().pop();
    if (hit) folder = path.join(finals, hit);
  }
  const slug = (folder ? path.basename(folder) : arg).replace(/^\d{4}-\d{2}-\d{2}\s+/, '').trim();
  if (!/^[a-z0-9][a-z0-9-]*$/i.test(slug)) throw new Error(`"${arg}" is not a final folder or a video slug`);
  const out = path.join(repo, 'video/out');
  const first = (...ps) => { ps = ps.filter(Boolean); return ps.find(p => existsSync(p)) || ps[0]; };
  return {
    slug, folder: folder || null,
    video: first(folder && path.join(folder, 'video.mp4'), path.join(out, `${slug}.mp4`)),
    cover: first(folder && path.join(folder, 'cover.jpg'), path.join(out, `${slug}-cover.jpg`)),
    post: folder ? path.join(folder, 'post.md') : null,
  };
}

// Everything needed for the queue rows, checked before any upload.
export function plan(arg, whenText, opts) {
  const input = resolveInput(arg, opts);
  if (!existsSync(input.video)) throw new Error(`no video at ${input.video}`);
  // without a cover Instagram and Facebook pick a frame themselves, so a missing cover stops the queueing
  if (!existsSync(input.cover)) throw new Error(`no cover at ${input.cover}`);
  if (!input.post || !existsSync(input.post)) throw new Error(`no post.md for ${input.slug}: pass its final folder, e.g. "final/<date> ${input.slug}"`);
  const { caption, first_comment } = readPost(input.post);
  if (!caption) throw new Error(`no "## Description" section in ${input.post}`);
  if (caption.length > 2200) throw new Error(`caption is ${caption.length} characters, Instagram's limit is 2200`);
  return { ...input, caption, first_comment, publish_at: when(whenText) };
}

function upload(file, key, type) {
  execFileSync('npx', ['wrangler@3', 'r2', 'object', 'put', `${BUCKET}/${key}`, '--file', file, '--content-type', type], { cwd: DIR, stdio: ['ignore', 'ignore', 'inherit'] });
}

async function main(argv) {
  let KEY;
  const api = async (p, opts = {}) => {
    KEY ??= readFileSync(KEY_FILE, 'utf8').trim();
    const r = await fetch(`${BASE}${p}${p.includes('?') ? '&' : '?'}key=${KEY}`, opts); const j = await r.json(); if (!r.ok || j.error) throw new Error(JSON.stringify(j)); return j;
  };
  const [cmd, ...rest] = argv;
  if (cmd === 'list') {
    for (const q of await api('/queue')) console.log(`${q.publish_at}  ${(q.platform || 'ig').padEnd(3)} ${q.status.padEnd(10)}  ${q.id}${q.media_id ? `  media ${q.media_id}` : ''}${q.platform === 'fb' && q.cover_key && !q.cover_set && q.status !== 'queued' ? '  NO COVER YET' : ''}${q.error ? `  (${q.error})` : ''}`);
  } else if (cmd === 'cover') {
    console.log(await api(`/queue/cover?id=${encodeURIComponent(rest[0])}`, { method: 'POST' }));
  } else if (cmd === 'cancel') {
    console.log(await api(`/queue/cancel?id=${encodeURIComponent(rest[0])}`, { method: 'POST' }));
  } else if (cmd && rest.some(a => !a.startsWith('--'))) {
    const flags = rest.filter(a => a.startsWith('--')), args = rest.filter(a => !a.startsWith('--'));
    const p = plan(cmd, args.join(' '));
    const platforms = flags.includes('--ig-only') ? ['ig'] : flags.includes('--fb-only') ? ['fb'] : ['ig', 'fb'];
    if (Date.parse(p.publish_at) < Date.now()) throw new Error(`${p.publish_at} is in the past`);
    if (flags.includes('--dry-run')) {
      console.log(JSON.stringify({ slug: p.slug, publish_at: p.publish_at, platforms, video: p.video, cover: p.cover, caption: p.caption, first_comment: p.first_comment }, null, 2));
      return;
    }
    const stamp = Date.now().toString(36), vkey = `${p.slug}-${stamp}.mp4`, ckey = `${p.slug}-${stamp}.jpg`;
    upload(p.video, vkey, 'video/mp4'); upload(p.cover, ckey, 'image/jpeg');
    for (const platform of platforms) {
      const r = await api('/queue', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: platform === 'fb' ? `fb:${p.slug}` : p.slug, platform, video_key: vkey, cover_key: ckey, caption: p.caption, first_comment: p.first_comment, publish_at: p.publish_at }) });
      console.log(`${platform === 'fb' ? 'Facebook ' : 'Instagram'} ${p.slug}: ${r.status} for ${new Date(r.publish_at).toUTCString()}${p.first_comment ? ', with first comment' : ''}`);
    }
  } else {
    console.log('usage: node ig-bot/schedule.mjs "final/<date> <slug>" "2026-11-07 18:00 UK" [--ig-only|--fb-only] [--dry-run] | list | cancel <id> | cover fb:<slug>');
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main(process.argv.slice(2)).catch(e => { console.error(e.message); process.exit(1); });
}
