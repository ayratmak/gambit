// Scheduled Reels for @hayekyeah and its Facebook Page. Instagram's API can publish a Reel but has no "publish at" time, so the queue
// lives here: schedule.mjs uploads the video and cover to R2 (bucket hayek-media, served at /media/<key>) and adds a row to
// ig_queue. Every minute the cron moves rows along:
//   queued      -> about 15 minutes before publish_at, create the Reel container (Instagram fetches the video from /media)
//   processing  -> once Instagram reports FINISHED and publish_at has passed, publish it, then post the first comment
//   published / failed / cancelled are final.
// Needs a token with instagram_content_publish (README).
import { stepFacebook, setCover } from './fb.js';

const GRAPH = 'https://graph.facebook.com/v26.0';
const LEAD_MS = 15 * 60 * 1000;           // container processing takes a few minutes, so start early
const MAX_ATTEMPTS = 5;
const STALE_MS = 3 * 3600 * 1000;         // a container still processing after this long is given up on

async function graph(path, token, body) {
  const r = await fetch(`${GRAPH}/${path}`, body
    ? { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(body) }
    : { headers: { Authorization: `Bearer ${token}` } });
  const out = await r.json().catch(() => ({}));
  if (!r.ok || out.error) throw new Error((out.error && out.error.message) || `HTTP ${r.status}`);
  return out;
}

const set = (env, id, fields, now) => {
  const keys = Object.keys(fields);
  return env.DB.prepare(`UPDATE ig_queue SET ${keys.map((k, i) => `${k} = ?${i + 2}`).join(', ')}, updated_at = ?${keys.length + 2} WHERE id = ?1`)
    .bind(id, ...keys.map(k => fields[k]), new Date(now).toISOString()).run();
};

export async function publishQueue(env, now = Date.now()) {
  const out = { created: 0, published: 0, failed: 0 };
  if (!env.IG_ACCESS_TOKEN || !env.IG_ACCOUNT_ID) return out;
  const token = env.IG_ACCESS_TOKEN, base = env.PUBLIC_URL;
  const { results } = await env.DB.prepare(`SELECT * FROM ig_queue WHERE status IN ('queued', 'processing') ORDER BY publish_at`).all();
  for (const q of results || []) {
    const due = Date.parse(q.publish_at);
    try {
      if (q.platform === 'fb') {
        const r = await stepFacebook(env, q, now);
        if (r === 'created') out.created++; if (r === 'published') out.published++;
        continue;
      }
      if (q.status === 'queued') {
        if (now < due - LEAD_MS) continue;
        const c = await graph(`${env.IG_ACCOUNT_ID}/media`, token, {
          media_type: 'REELS', video_url: `${base}/media/${q.video_key}`, caption: q.caption, share_to_feed: true,
          ...(q.cover_key ? { cover_url: `${base}/media/${q.cover_key}` } : {}),
        });
        await set(env, q.id, { status: 'processing', container_id: c.id, error: null }, now);
        out.created++;
      } else {
        const c = await graph(`${q.container_id}?fields=status_code,status`, token);
        if (c.status_code === 'ERROR' || c.status_code === 'EXPIRED') throw Object.assign(new Error(`container ${c.status_code}: ${c.status || ''}`), { final: true });
        if (c.status_code !== 'FINISHED') {
          if (now - Date.parse(q.updated_at) > STALE_MS) throw Object.assign(new Error(`container stuck in ${c.status_code}`), { final: true });
          continue;
        }
        if (now < due) continue;
        const m = await graph(`${env.IG_ACCOUNT_ID}/media_publish`, token, { creation_id: q.container_id });
        await set(env, q.id, { status: 'published', media_id: m.id, error: null }, now);
        out.published++;
        if (q.first_comment) {
          try { await graph(`${m.id}/comments`, token, { message: q.first_comment }); await set(env, q.id, { comment_posted: 1 }, now); }
          catch (e) { console.log(`first comment failed for ${q.id}: ${e.message}`); }
        }
      }
    } catch (e) {
      const attempts = (q.attempts || 0) + 1, final = e.final || attempts >= MAX_ATTEMPTS;
      await set(env, q.id, { attempts, error: e.message.slice(0, 500), ...(final ? { status: 'failed' } : {}) }, now);
      if (final) out.failed++;
      console.error(`queue ${q.id}: ${e.message}`);
    }
  }
  return out;
}

// GET /media/<key>: the queued files, with Range support (Instagram may fetch the video in parts).
export async function serveMedia(request, env, key) {
  const range = request.headers.get('range');
  let opts;
  if (range) { const m = /bytes=(\d*)-(\d*)/.exec(range); if (m) opts = { range: m[1] === '' ? { suffix: +m[2] } : { offset: +m[1], ...(m[2] ? { length: +m[2] - +m[1] + 1 } : {}) } }; }
  const obj = await env.MEDIA.get(key, opts);
  if (!obj) return new Response('Not found', { status: 404 });
  const h = new Headers({ 'Content-Type': obj.httpMetadata?.contentType || (key.endsWith('.mp4') ? 'video/mp4' : 'image/jpeg'), 'Accept-Ranges': 'bytes', 'Cache-Control': 'public, max-age=86400' });
  if (opts && obj.range) {
    const start = obj.range.offset ?? (obj.size - obj.range.suffix), len = obj.range.length ?? (obj.size - start);
    h.set('Content-Range', `bytes ${start}-${start + len - 1}/${obj.size}`); h.set('Content-Length', String(len));
    return new Response(obj.body, { status: 206, headers: h });
  }
  h.set('Content-Length', String(obj.size));
  return new Response(obj.body, { headers: h });
}

// POST /queue (JSON row), GET /queue (list), POST /queue/cancel?id=. All need ?key=STATS_KEY.
export async function queueApi(request, env, url) {
  if (url.pathname === '/queue' && request.method === 'POST') {
    const b = await request.json();
    if (!b.id || !b.video_key || !b.publish_at || isNaN(Date.parse(b.publish_at))) return Response.json({ error: 'id, video_key and publish_at are required' }, { status: 400 });
    if ((b.caption || '').length > 2200) return Response.json({ error: 'caption over 2200 characters' }, { status: 400 });
    const t = new Date().toISOString();
    await env.DB.prepare(`INSERT INTO ig_queue (id, video_key, cover_key, caption, first_comment, publish_at, status, attempts, created_at, updated_at, platform)
      VALUES (?1, ?2, ?3, ?4, ?5, ?6, 'queued', 0, ?7, ?7, ?8)
      ON CONFLICT(id) DO UPDATE SET video_key = excluded.video_key, cover_key = excluded.cover_key, caption = excluded.caption, first_comment = excluded.first_comment,
        publish_at = excluded.publish_at, platform = excluded.platform, status = 'queued', attempts = 0, error = NULL, container_id = NULL, updated_at = excluded.updated_at
      WHERE ig_queue.status IN ('queued', 'failed', 'cancelled')`)
      .bind(b.id, b.video_key, b.cover_key || null, b.caption || '', b.first_comment || null, new Date(b.publish_at).toISOString(), t, b.platform === 'fb' ? 'fb' : 'ig').run();
    return Response.json(await env.DB.prepare('SELECT id, status, publish_at FROM ig_queue WHERE id = ?1').bind(b.id).first());
  }
  if (url.pathname === '/queue' && request.method === 'GET') {
    const { results } = await env.DB.prepare(`SELECT id, platform, publish_at, status, media_id, cover_key, cover_set, comment_posted, attempts, error FROM ig_queue ORDER BY publish_at`).all();
    return Response.json(results);
  }
  if (url.pathname === '/queue/cancel' && request.method === 'POST') {
    await env.DB.prepare(`UPDATE ig_queue SET status = 'cancelled', updated_at = ?2 WHERE id = ?1 AND status = 'queued'`).bind(url.searchParams.get('id'), new Date().toISOString()).run();
    return Response.json(await env.DB.prepare('SELECT id, status FROM ig_queue WHERE id = ?1').bind(url.searchParams.get('id')).first());
  }
  // POST /queue/cover?id=fb:...: put the cover on a Facebook reel again (for one that went out without it).
  if (url.pathname === '/queue/cover' && request.method === 'POST') {
    const q = await env.DB.prepare('SELECT * FROM ig_queue WHERE id = ?1').bind(url.searchParams.get('id')).first();
    if (!q || q.platform !== 'fb' || !q.container_id || !q.cover_key) return Response.json({ error: 'needs a Facebook row that has been uploaded and has a cover' }, { status: 400 });
    try { await setCover(env, q.container_id, q.cover_key); }
    catch (e) { return Response.json({ error: e.message }, { status: 502 }); }
    await env.DB.prepare('UPDATE ig_queue SET cover_set = 1, updated_at = ?2 WHERE id = ?1').bind(q.id, new Date().toISOString()).run();
    return Response.json({ id: q.id, cover_set: 1 });
  }
  return null;
}
