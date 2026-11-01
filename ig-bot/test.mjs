// Offline tests: fake Graph API, D1 and R2. Nothing touches Meta or Cloudflare.  node test.mjs
import assert from 'node:assert';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
const { wantsGuide, guideUrl, handleComment, poll } = await import('./src/index.js');
const COPY = (await import('./src/copy.js')).default;

// Keyword matching: "game theory" anywhere in any case and spelling, "guide" and "course" as whole words, never "of course".
for (const [t, want] of [
  ['GAME THEORY', true], ['game theory', true], ['Game Theory pls 🙏', true], ['gAmE tHeOrY', true],
  ['gametheory', true], ['GAMETHEORY!!', true], ['game-theory', true], ['Game – Theory', true], ['game  theory', true],
  ['#gametheory', true], ['love this, game theory please', true], ['@friend look: GameTheory', true],
  ['guide', true], ['GUIDE', true], ['Guide!', true], ['send the guide pls', true], ['course', true], ['Course?', true],
  ['the free course please', true], ['guide 📘', true],
  ['guided tour', false], ['courses', false], ['coursework', false], ['misguided', false], ['great vid', false],
  ['game on', false], ['theory of games', false], ['of course he lost', false], ['Of Course!', false], ['ofcourse', false],
  ['of course, send the guide', true], ['of course I want the course', true], ['', false],
]) assert.equal(wantsGuide(t), want, JSON.stringify(t));
// the DM goes out in British English without em dashes, and the link points at the free guide with the agreed UTM tags
assert.ok(!/[—]/.test(COPY.message + COPY.public_replies.join('')), 'no em dashes');
assert.ok(COPY.message.includes('{link}') && COPY.message.length < 900);
assert.ok(COPY.public_replies.length >= 3 && COPY.public_replies.length <= 4);
assert.equal(guideUrl('instagram', 'twenty-pound-auction'), 'https://gambitschool.com/free?utm_source=instagram&utm_medium=dm&utm_campaign=twenty-pound-auction');
assert.equal(guideUrl('facebook', '123'), 'https://gambitschool.com/free?utm_source=facebook&utm_medium=dm&utm_campaign=123');
console.log('keyword tests pass');

const rows = new Map(), sent = [];
const DB = { prepare: sql => ({ bind: (...a) => ({
  run: async () => { if (sql.startsWith('INSERT INTO ig_dms')) { const dup = rows.has(a[0]) || [...rows.values()].some(r => r.m === a[1] && r.f === a[2]); if (!dup) rows.set(a[0], { m: a[1], f: a[2] }); return { meta: { changes: dup ? 0 : 1 } }; }
    if (sql.startsWith('DELETE')) rows.delete(a[0]); return { meta: { changes: 1 } }; },
  first: async () => null }) }) };
globalThis.fetch = async (url, o) => { sent.push([url, o && o.body]); return new Response(JSON.stringify(url.includes('/media?') ? { data: [{ id: 'M1', timestamp: new Date().toISOString(), comments_count: 3 }] } : url.includes('/comments?') ? { data: [
  { id: 'C1', text: 'Game Theory please', timestamp: new Date().toISOString(), from: { id: 'U1', username: 'alice' } },
  { id: 'C2', text: 'guide again', timestamp: new Date().toISOString(), from: { id: 'U1', username: 'alice' } },
  { id: 'C3', text: 'nice, of course', timestamp: new Date().toISOString(), from: { id: 'U2', username: 'bob' } }] } : { id: 'x' })); };
const env = { DB, IG_ACCESS_TOKEN: 't', IG_ACCOUNT_ID: 'ME', IG_USERNAME: 'hayekyeah' };
const r = await poll(env);
assert.deepEqual([r.sent, r.errors], [1, 0]);
const dm = sent.find(([u]) => u.endsWith('ME/messages'));
assert.ok(JSON.parse(dm[1]).message.text.includes('https://gambitschool.com/free?utm_source=instagram&utm_medium=dm&utm_campaign=M1'));
assert.ok(COPY.public_replies.includes(JSON.parse(sent.find(([u]) => u.endsWith('C1/replies'))[1]).message));
assert.equal(await handleComment(env, { commentId: 'C9', mediaId: 'M1', fromId: 'ME', username: 'hayekyeah', text: 'game theory', time: Date.now() }), 'skip:own');
console.log('instagram comment tests pass', r);

// Scheduled Reels: queued -> container 15 min early -> publish at the time -> first comment.
{
  const { publishQueue } = await import('./src/publish.js');
  const row = { id: 'v1', video_key: 'v1.mp4', cover_key: 'v1.jpg', caption: 'hi', first_comment: 'Comment GAME THEORY', publish_at: '2026-11-03T16:30:00.000Z', status: 'queued', attempts: 0, updated_at: '2026-11-03T16:00:00.000Z' };
  const QDB = { prepare: sql => ({ all: async () => ({ results: [row].filter(r => ['queued', 'processing'].includes(r.status)) }),
    bind: (...a) => ({ run: async () => { const keys = [...sql.matchAll(/(\w+) = \?\d+/g)].map(m => m[1]).filter(k => k !== 'id'); keys.forEach((k, i) => { row[k] = a[i + 1]; }); return {}; } }) }) };
  const calls = []; let status = 'IN_PROGRESS';
  globalThis.fetch = async (url, o) => { calls.push([url.replace('https://graph.facebook.com/v26.0/', ''), o && o.body && JSON.parse(o.body)]);
    return new Response(JSON.stringify(url.includes('/media_publish') ? { id: 'M9' } : url.includes('?fields=status_code') ? { status_code: status } : { id: 'C7' })); };
  const qenv = { DB: QDB, IG_ACCESS_TOKEN: 't', IG_ACCOUNT_ID: 'ME', PUBLIC_URL: 'https://bot' }, at = Date.parse(row.publish_at);
  await publishQueue(qenv, at - 30 * 60000); assert.equal(row.status, 'queued');
  await publishQueue(qenv, at - 10 * 60000); assert.equal(row.status, 'processing'); assert.equal(calls[0][1].video_url, 'https://bot/media/v1.mp4'); assert.equal(calls[0][1].cover_url, 'https://bot/media/v1.jpg');
  status = 'FINISHED'; await publishQueue(qenv, at - 5 * 60000); assert.equal(row.status, 'processing');
  await publishQueue(qenv, at + 60000); assert.equal(row.status, 'published'); assert.equal(row.media_id, 'M9');
  assert.deepEqual(calls.at(-1), ['M9/comments', { message: 'Comment GAME THEORY' }]);
  console.log('queue tests pass');
}

// Facebook Reel: uploaded 20 min early as SCHEDULED for publish_at, first comment once live.
{
  const { publishQueue } = await import('./src/publish.js');
  const row = { id: 'fb:v1', platform: 'fb', video_key: 'v1.mp4', cover_key: 'v1.jpg', caption: 'hi', first_comment: 'Comment GAME THEORY', publish_at: '2026-11-03T16:30:00.000Z', status: 'queued', attempts: 0, updated_at: '2026-11-03T16:00:00.000Z' };
  const QDB = { prepare: sql => ({ all: async () => ({ results: [row].filter(r => ['queued', 'processing'].includes(r.status)) }),
    bind: (...a) => ({ run: async () => { [...sql.matchAll(/(\w+) = \?\d+/g)].map(m => m[1]).filter(k => k !== 'id').forEach((k, i) => { row[k] = a[i + 1]; }); return {}; } }) }) };
  const calls = []; let live = false, thumbOk = false;
  globalThis.fetch = async (url, o) => { calls.push([url, o && typeof o.body === 'string' ? JSON.parse(o.body) : o && o.body, o && o.headers]);
    if (url.endsWith('/thumbnails')) return new Response(JSON.stringify(thumbOk ? { success: true } : { error: { message: 'video not ready' } }), { status: thumbOk ? 200 : 400 });
    const j = url.includes('rupload') ? { success: true } : url.includes('video_reels') ? (o.body.includes('start') ? { video_id: 'V5' } : { success: true })
      : url.includes('?fields=status') ? { published: live, status: { video_status: 'ready' } } : url.includes('me?fields=id') ? { id: 'PAGE1' } : { id: 'x' };
    return new Response(JSON.stringify(j)); };
  const MEDIA = { get: async k => k === 'v1.jpg' ? { arrayBuffer: async () => new Uint8Array([1, 2]).buffer } : null };
  const env = { DB: QDB, MEDIA, IG_ACCESS_TOKEN: 't', IG_ACCOUNT_ID: 'ME', PUBLIC_URL: 'https://bot', FB_PAGE_ID: 'PAGE1' }, at = Date.parse(row.publish_at);
  await publishQueue({ ...env, FB_PAGE_ID: 'SOMEONE' }, at - 19 * 60000); assert.equal(row.status, 'failed'); assert.match(row.error, /refusing/);
  Object.assign(row, { status: 'queued', attempts: 0, error: null }); calls.length = 0;
  await publishQueue(env, at - 25 * 60000); assert.equal(row.status, 'queued');
  await publishQueue(env, at - 19 * 60000); assert.equal(row.status, 'processing');
  assert.equal(calls[2][2].file_url, 'https://bot/media/v1.mp4');
  assert.deepEqual([calls[3][1].video_state, calls[3][1].scheduled_publish_time], ['SCHEDULED', at / 1000]);
  // the cover is refused while the video processes, kept as an error, then retried until it goes on
  assert.equal(calls[4][0], 'https://graph.facebook.com/v26.0/V5/thumbnails'); assert.ok(calls[4][1] instanceof FormData);
  assert.equal(calls[4][1].get('is_preferred'), 'true'); assert.ok(!row.cover_set); assert.match(row.error, /video not ready/);
  thumbOk = true; await publishQueue(env, at - 18 * 60000); assert.equal(row.cover_set, 1); assert.equal(row.error, null);
  const before = calls.length; await publishQueue(env, at - 17 * 60000); assert.ok(!calls.slice(before).some(c => c[0].endsWith('/thumbnails')));
  await publishQueue(env, at + 60000); assert.equal(row.status, 'processing');
  live = true; await publishQueue(env, at + 120000); assert.equal(row.status, 'published');
  assert.deepEqual(calls.at(-1).slice(0, 2), ['https://graph.facebook.com/v26.0/V5/comments', { message: 'Comment GAME THEORY' }]);
  console.log('facebook queue tests pass');
}

// Facebook comments: one Messenger private reply per person per video, utm_source=facebook and the slug as campaign.
{
  const { pollFacebook } = await import('./src/fb.js');
  const rows = new Map(), calls = [];
  const DB = { prepare: sql => ({ bind: (...a) => ({
    run: async () => { if (sql.startsWith('INSERT INTO ig_dms')) { const dup = rows.has(a[0]) || [...rows.values()].some(r => r.m === a[1] && r.f === a[2]); if (!dup) rows.set(a[0], { m: a[1], f: a[2] }); return { meta: { changes: dup ? 0 : 1 } }; }
      if (sql.startsWith('DELETE')) rows.delete(a[0]); return { meta: { changes: 1 } }; },
    first: async () => sql.includes('FROM ig_queue') && a[0] === 'V1' ? { id: 'fb:ticket-touts' } : null }) }) };
  const now = new Date().toISOString();
  globalThis.fetch = async (url, o) => { calls.push([url, o && o.body && JSON.parse(o.body)]);
    const j = url.includes('me?fields=id') ? { id: 'PAGE1' } : url.includes('me/videos') ? { data: [{ id: 'V1', created_time: now, comments: { summary: { total_count: 4 } } }] }
      : url.includes('V1/comments?') ? { data: [
        { id: 'F1', message: 'GAME-THEORY', created_time: now, from: { id: 'P1', name: 'Pat' } },
        { id: 'F2', message: 'guide please', created_time: now, from: { id: 'P1', name: 'Pat' } },
        { id: 'F3', message: 'of course', created_time: now, from: { id: 'P2', name: 'Sam' } },
        { id: 'F4', message: 'Comment GAME THEORY for the free guide', created_time: now, from: { id: 'PAGE1', name: 'hayekyeah' } }] } : { id: 'x' };
    return new Response(JSON.stringify(j)); };
  const env = { DB, IG_ACCESS_TOKEN: 't', FB_ENABLED: '1', FB_PAGE_ID: 'PAGE1' };
  // not connected yet: nothing runs
  assert.deepEqual(await pollFacebook({ ...env, FB_PAGE_ID: '' }), { posts: 0, sent: 0, errors: 0 }); assert.equal(calls.length, 0);
  const r = await pollFacebook(env);
  assert.deepEqual([r.sent, r.errors], [1, 0]);
  const dms = calls.filter(([u]) => u.endsWith('me/messages'));
  assert.equal(dms.length, 1); assert.equal(dms[0][1].recipient.comment_id, 'F1');
  assert.ok(dms[0][1].message.text.includes('https://gambitschool.com/free?utm_source=facebook&utm_medium=dm&utm_campaign=ticket-touts'));
  assert.ok(COPY.public_replies.includes(calls.find(([u]) => u.endsWith('F1/comments'))[1].message));
  console.log('facebook comment tests pass', r);
}

// schedule.mjs reads a final folder: video.mp4, cover.jpg, post.md (Description = caption, Pinned comment = first comment).
{
  const { plan, when, section } = await import('./schedule.mjs');
  const repo = mkdtempSync(path.join(tmpdir(), 'hayek-')), folder = path.join(repo, 'final', '2026-11-07 ticket-touts');
  mkdirSync(folder, { recursive: true });
  writeFileSync(path.join(folder, 'video.mp4'), 'v'); writeFileSync(path.join(folder, 'cover.jpg'), 'c');
  writeFileSync(path.join(folder, 'post.md'), '# Touts\n\n## Title (YouTube Shorts title)\nWhy bands\n\n## Description (paste as is)\nLine one 🎟\nComment GAME THEORY for the free guide.\n#gametheory\n\n## Story repost\nno\n\n## Pinned comment\nCheap on purpose. Comment GAME THEORY 👇\n\n## Cover text\nx\n');
  const want = { slug: 'ticket-touts', caption: 'Line one 🎟\nComment GAME THEORY for the free guide.\n#gametheory', first_comment: 'Cheap on purpose. Comment GAME THEORY 👇', publish_at: '2026-11-07T18:00:00.000Z' };
  for (const arg of ['final/2026-11-07 ticket-touts', 'video/final/2026-11-07 ticket-touts', 'ticket-touts', folder]) {
    const p = plan(arg, '2026-11-07 18:00 UK', { repo, cwd: repo });
    assert.deepEqual({ slug: p.slug, caption: p.caption, first_comment: p.first_comment, publish_at: p.publish_at }, want, arg);
    assert.equal(p.video, path.join(folder, 'video.mp4')); assert.equal(p.cover, path.join(folder, 'cover.jpg'));
  }
  assert.equal(when('2026-07-07 18:00 UK'), '2026-07-07T17:00:00.000Z');   // British Summer Time
  assert.equal(when('2026-11-07 13:00 ET'), '2026-11-07T18:00:00.000Z');
  assert.equal(section('## Pinned comment\n', 'Pinned comment'), '');
  assert.throws(() => plan('no-such-video', '2026-11-07 18:00 UK', { repo, cwd: repo }), /no video/);
  console.log('schedule tests pass');
}
