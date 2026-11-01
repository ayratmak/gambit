// The Facebook side of @hayekyeah: the same Reels on the linked hayekyeah Page, and the same comment-to-DM.
// Uses the Page token (IG_ACCESS_TOKEN is the Page's token), so `me` is the Page.
//   Reels: a queue row with platform 'fb' is uploaded about 20 minutes early (Facebook fetches the file from /media) and
//   handed to Facebook as SCHEDULED for publish_at, so Facebook publishes it on the minute. After that the cron posts the
//   first comment once the video is live. The cover (cover_key) is uploaded as the reel's preferred thumbnail; Facebook
//   ignores it while the video is still processing, so it is retried every minute until accepted (cover_set = 1).
//   Comments: every minute, the Page's videos from the last 7 days are checked for new comments asking for the guide
//   (match.js); each commenter gets one Messenger private reply with the guide link (utm_source=facebook) and a short public reply.
// Needs pages_manage_posts, pages_read_user_content, pages_manage_engagement, pages_messaging (README).
import COPY from './copy.js';
import { wantsGuide, newRef, guideUrl, publicReply, campaignFor } from './match.js';

const GRAPH = 'https://graph.facebook.com/v26.0', WEEK_MS = 7 * 24 * 3600 * 1000, LEAD_MS = 20 * 60 * 1000;

async function graph(path, token, body, extra = {}) {
  const r = await fetch(path.startsWith('http') ? path : `${GRAPH}/${path}`, body
    ? { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...extra }, body: JSON.stringify(body) }
    : { headers: { Authorization: `Bearer ${token}`, ...extra } });
  const out = await r.json().catch(() => ({}));
  if (!r.ok || out.error) throw new Error((out.error && out.error.message) || `HTTP ${r.status}`);
  return out;
}
// Only ever act as the hayekyeah Page: the token's `me` must be FB_PAGE_ID (set by connect.sh), never a personal profile.
async function pageGuard(env) {
  const me = await graph('me?fields=id', env.IG_ACCESS_TOKEN);
  if (!env.FB_PAGE_ID || me.id !== env.FB_PAGE_ID) throw Object.assign(new Error(`token is not the hayekyeah Page (got ${me.id}), refusing`), { final: true });
  return me;
}
// Upload the queued cover as the video's preferred thumbnail (multipart, so Facebook doesn't need to fetch it).
export async function setCover(env, videoId, coverKey) {
  const obj = await env.MEDIA.get(coverKey);
  if (!obj) throw new Error(`cover ${coverKey} not in R2`);
  const fd = new FormData();
  fd.append('source', new Blob([await obj.arrayBuffer()], { type: 'image/jpeg' }), 'cover.jpg');
  fd.append('is_preferred', 'true');
  const r = await fetch(`${GRAPH}/${videoId}/thumbnails`, { method: 'POST', headers: { Authorization: `Bearer ${env.IG_ACCESS_TOKEN}` }, body: fd });
  const out = await r.json().catch(() => ({}));
  if (!r.ok || out.error) throw new Error(`facebook cover: ${(out.error && out.error.message) || r.status}`);
}
const set = (env, id, fields, now) => {
  const keys = Object.keys(fields);
  return env.DB.prepare(`UPDATE ig_queue SET ${keys.map((k, i) => `${k} = ?${i + 2}`).join(', ')}, updated_at = ?${keys.length + 2} WHERE id = ?1`)
    .bind(id, ...keys.map(k => fields[k]), new Date(now).toISOString()).run();
};

// A cover that won't go on doesn't stop the post: the error is kept on the row and it is retried next minute.
async function tryCover(env, q, now) {
  if (!q.cover_key || q.cover_set) return;
  try { await setCover(env, q.container_id, q.cover_key); await set(env, q.id, { cover_set: 1, error: null }, now); q.cover_set = 1; }
  catch (e) { await set(env, q.id, { error: e.message.slice(0, 500) }, now); console.log(`fb cover failed for ${q.id}: ${e.message}`); }
}

// One Facebook queue row. Returns 'created' | 'published' | null; throws to let publish.js count attempts.
export async function stepFacebook(env, q, now) {
  const token = env.IG_ACCESS_TOKEN, due = Date.parse(q.publish_at);
  if (q.status === 'queued') {
    if (now < due - LEAD_MS) return null;
    await pageGuard(env);
    // Facebook only accepts a scheduled time at least 10 minutes ahead; closer than that, publish straight away
    const scheduled = due - now > 11 * 60 * 1000;
    const start = await graph('me/video_reels', token, { upload_phase: 'start' });
    // hosted upload: Facebook pulls the file from file_url
    const up = await fetch(`https://rupload.facebook.com/video-upload/v26.0/${start.video_id}`, { method: 'POST',
      headers: { Authorization: `OAuth ${token}`, file_url: `${env.PUBLIC_URL}/media/${q.video_key}` } });
    const upj = await up.json().catch(() => ({}));
    if (!up.ok || !upj.success) throw new Error(`facebook upload: ${(upj.error && upj.error.message) || up.status}`);
    await graph('me/video_reels', token, { upload_phase: 'finish', video_id: start.video_id, description: q.caption,
      ...(scheduled ? { video_state: 'SCHEDULED', scheduled_publish_time: Math.floor(due / 1000) } : { video_state: 'PUBLISHED' }) });
    await set(env, q.id, { status: 'processing', container_id: start.video_id, error: null }, now);
    await tryCover(env, { ...q, container_id: start.video_id }, now);
    return 'created';
  }
  await tryCover(env, q, now);
  if (now < due) return null;
  const v = await graph(`${q.container_id}?fields=status,published`, token);
  const st = v.status || {};
  if (st.video_status === 'error') throw Object.assign(new Error(`facebook video error: ${JSON.stringify(st).slice(0, 300)}`), { final: true });
  if (!(v.published || (st.publishing_phase && st.publishing_phase.status === 'complete'))) {
    if (now - due > 3 * 3600 * 1000) throw Object.assign(new Error('facebook video not live 3h after its time'), { final: true });
    return null;
  }
  await set(env, q.id, { status: 'published', media_id: q.container_id, ...(q.cover_key && !q.cover_set ? {} : { error: null }) }, now);
  if (q.first_comment) {
    try { await graph(`${q.container_id}/comments`, token, { message: q.first_comment }); await set(env, q.id, { comment_posted: 1 }, now); }
    catch (e) { console.log(`fb first comment failed for ${q.id}: ${e.message}`); }
  }
  return 'published';
}

// Guide requests in comments on the Page's videos. Rows share ig_dms with an "fb:" prefix on the ids.
export async function pollFacebook(env, now = Date.now()) {
  const out = { posts: 0, sent: 0, errors: 0 };
  // FB_PAGE_ID is empty until connect.sh has run
  if (!env.IG_ACCESS_TOKEN || env.FB_ENABLED !== '1' || !env.FB_PAGE_ID) return out;
  const token = env.IG_ACCESS_TOKEN;
  const me = await pageGuard(env);
  const vids = await graph('me/videos?fields=id,created_time,comments.limit(0).summary(true)&limit=15', token);
  for (const v of vids.data || []) {
    if (now - Date.parse(v.created_time) > WEEK_MS) continue;
    out.posts++;
    const count = (v.comments && v.comments.summary && v.comments.summary.total_count) || 0, mid = `fb:${v.id}`;
    const seen = await env.DB.prepare('SELECT comments_count FROM ig_poll WHERE media_id = ?1').bind(mid).first();
    if (seen && seen.comments_count === count) continue;
    const comments = await graph(`${v.id}/comments?fields=id,message,created_time,from&filter=stream&limit=50`, token);
    let failed = false, campaign = null;
    for (const c of comments.data || []) {
      const from = c.from || {};
      if (from.id === me.id || !wantsGuide(c.message || '') || now - Date.parse(c.created_time) > WEEK_MS) continue;
      const ref = newRef(), cid = `fb:${c.id}`, fromId = from.id ? `fb:${from.id}` : cid;
      const claim = await env.DB.prepare(`INSERT INTO ig_dms (comment_id, media_id, from_id, username, comment_text, ref, status, created_at)
        VALUES (?1, ?2, ?3, ?4, ?5, ?6, 'pending', ?7) ON CONFLICT DO NOTHING`)
        .bind(cid, mid, fromId, (from.name || '').slice(0, 64), (c.message || '').slice(0, 500), ref, new Date(now).toISOString()).run();
      if (!claim.meta || claim.meta.changes === 0) continue;
      if (campaign === null) campaign = await campaignFor(env, v.id);
      const link = guideUrl('facebook', campaign);
      try {
        await graph('me/messages', token, { recipient: { comment_id: c.id }, message: { text: COPY.message.replace('{link}', link) } });
      } catch (e) {
        await env.DB.prepare('DELETE FROM ig_dms WHERE comment_id = ?1').bind(cid).run();
        console.error(`fb dm failed for ${c.id}: ${e.message}`); out.errors++; failed = true; continue;
      }
      await env.DB.prepare(`UPDATE ig_dms SET status = 'sent', sent_at = ?2 WHERE comment_id = ?1`).bind(cid, new Date(now).toISOString()).run();
      out.sent++;
      const pick = publicReply(c.id);
      if (pick) try { await graph(`${c.id}/comments`, token, { message: pick }); await env.DB.prepare('UPDATE ig_dms SET public_reply = 1 WHERE comment_id = ?1').bind(cid).run(); }
      catch (e) { console.log(`fb public reply failed for ${c.id}: ${e.message}`); }
    }
    if (!failed) await env.DB.prepare(`INSERT INTO ig_poll (media_id, comments_count, checked_at) VALUES (?1, ?2, ?3)
      ON CONFLICT(media_id) DO UPDATE SET comments_count = excluded.comments_count, checked_at = excluded.checked_at`).bind(mid, count, new Date(now).toISOString()).run();
  }
  return out;
}
