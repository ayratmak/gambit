// Comment-to-DM bot and Reel scheduler for @hayekyeah, ported from the Cornerlot bot (cphq-ig-bot), itself from @aigentmode.
// Every minute (cron) it checks the account's posts from the last 7 days for new comments asking for the guide
// ("game theory", "guide" or "course": match.js) and sends each commenter one private reply with the free guide link,
// plus a short public reply under the comment.
// Polling rather than Meta's webhook: until the app has Advanced Access, webhooks only arrive from people with a role on the app.
// Secrets: IG_ACCESS_TOKEN (Page access token for the hayekyeah Page, doesn't expire), STATS_KEY (for /stats, /queue, /check).
// Vars: IG_ACCOUNT_ID, IG_USERNAME, FB_PAGE_ID, FB_ENABLED, PUBLIC_URL. Wording: copy.js. Scheduled Reels: publish.js. Facebook: fb.js.
import COPY from './copy.js';
import { wantsGuide, newRef, guideUrl, publicReply, campaignFor } from './match.js';
import { publishQueue, serveMedia, queueApi } from './publish.js';
import { pollFacebook } from './fb.js';

export { wantsGuide, guideUrl };
const GRAPH = 'https://graph.facebook.com/v26.0';
const WEEK_MS = 7 * 24 * 3600 * 1000;

async function graph(path, token, body) {
  const r = await fetch(`${GRAPH}/${path}`, body
    ? { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(body) }
    : { headers: { Authorization: `Bearer ${token}` } });
  const out = await r.json().catch(() => ({}));
  if (!r.ok || out.error) throw new Error((out.error && out.error.message) || `HTTP ${r.status}`);
  return out;
}

// Answers one comment. Meta allows one private reply per comment, within 7 days of it.
export async function handleComment(env, ev, now = Date.now()) {
  if (!ev.commentId || !ev.mediaId || !ev.fromId) return 'skip:incomplete';
  if (ev.fromId === env.IG_ACCOUNT_ID || ev.username.toLowerCase() === String(env.IG_USERNAME).toLowerCase()) return 'skip:own';
  if (!wantsGuide(ev.text)) return 'skip:no-keyword';
  if (now - ev.time > WEEK_MS) return 'skip:too-old';

  // Claim first: a conflict on comment_id means already answered, on (media_id, from_id) that this person already has the link.
  const ref = newRef();
  const claim = await env.DB.prepare(`INSERT INTO ig_dms (comment_id, media_id, from_id, username, comment_text, ref, status, created_at)
    VALUES (?1, ?2, ?3, ?4, ?5, ?6, 'pending', ?7) ON CONFLICT DO NOTHING`)
    .bind(ev.commentId, ev.mediaId, ev.fromId, ev.username.slice(0, 64), ev.text.slice(0, 500), ref, new Date(now).toISOString()).run();
  if (!claim.meta || claim.meta.changes === 0) return 'skip:duplicate';

  const token = env.IG_ACCESS_TOKEN, link = guideUrl('instagram', ev.campaign || ev.mediaId);
  try {
    await graph(`${env.IG_ACCOUNT_ID}/messages`, token, { recipient: { comment_id: ev.commentId }, message: { text: COPY.message.replace('{link}', link) } });
  } catch (e) {
    // Nothing was sent, so free the claim and let the next run try again.
    await env.DB.prepare('DELETE FROM ig_dms WHERE comment_id = ?1').bind(ev.commentId).run();
    console.error(`dm failed for comment ${ev.commentId}: ${e.message}`);
    return 'error:dm';
  }
  await env.DB.prepare(`UPDATE ig_dms SET status = 'sent', sent_at = ?2 WHERE comment_id = ?1`).bind(ev.commentId, new Date(now).toISOString()).run();
  const pick = publicReply(ev.commentId);
  if (pick) {
    try {
      await graph(`${ev.commentId}/replies`, token, { message: pick });
      await env.DB.prepare('UPDATE ig_dms SET public_reply = 1 WHERE comment_id = ?1').bind(ev.commentId).run();
    } catch (e) { console.log(`public reply failed for comment ${ev.commentId}: ${e.message}`); }
  }
  return 'sent';
}

// Checks the last week's posts. A post's comments are only fetched when its comment count changed since the last run;
// if any reply fails the count isn't saved, so the next run tries again.
export async function poll(env, now = Date.now()) {
  const out = { posts: 0, checked: 0, sent: 0, errors: 0 };
  if (!env.IG_ACCESS_TOKEN || !env.IG_ACCOUNT_ID) return { ...out, error: 'not configured' };
  const media = await graph(`${env.IG_ACCOUNT_ID}/media?fields=id,timestamp,comments_count&limit=15`, env.IG_ACCESS_TOKEN);
  for (const m of media.data || []) {
    if (now - Date.parse(m.timestamp) > WEEK_MS) continue;
    out.posts++;
    const seen = await env.DB.prepare('SELECT comments_count FROM ig_poll WHERE media_id = ?1').bind(m.id).first();
    if (seen && seen.comments_count === m.comments_count) continue;
    out.checked++;
    const comments = await graph(`${m.id}/comments?fields=id,text,timestamp,username,from{id,username}&limit=50`, env.IG_ACCESS_TOKEN);
    let failed = false, campaign = null;
    for (const c of comments.data || []) {
      const username = (c.from && c.from.username) || c.username || '';
      const text = String(c.text || '');
      // only look up the slug when a comment actually asks for the guide
      if (campaign === null && wantsGuide(text)) campaign = await campaignFor(env, m.id);
      const ev = { time: Date.parse(c.timestamp), commentId: String(c.id), text, username, campaign,
        fromId: String((c.from && c.from.id) || (username && `u:${username}`) || ''), mediaId: String(m.id) };
      const r = await handleComment(env, ev, now).catch(e => `error:${e.message}`);
      if (r === 'sent') out.sent++;
      if (r.startsWith('error')) { out.errors++; failed = true; }
    }
    if (!failed) await env.DB.prepare(`INSERT INTO ig_poll (media_id, comments_count, checked_at) VALUES (?1, ?2, ?3)
      ON CONFLICT(media_id) DO UPDATE SET comments_count = excluded.comments_count, checked_at = excluded.checked_at`)
      .bind(m.id, m.comments_count, new Date(now).toISOString()).run();
  }
  return out;
}

export default {
  async scheduled(_e, env, ctx) {
    ctx.waitUntil(poll(env).then(r => { if (r.sent || r.errors) console.log('poll', JSON.stringify(r)); })
      .catch(e => console.error(`poll failed: ${e.message}`)));
    ctx.waitUntil(pollFacebook(env).then(r => { if (r.sent || r.errors) console.log('fb poll', JSON.stringify(r)); })
      .catch(e => console.error(`fb poll failed: ${e.message}`)));
    ctx.waitUntil(publishQueue(env).then(r => { if (r.created || r.published || r.failed) console.log('queue', JSON.stringify(r)); })
      .catch(e => console.error(`queue failed: ${e.message}`)));
  },
  // GET /health: is the token still good. GET /stats?key=...: DMs sent per post.
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith('/media/') && env.MEDIA) return serveMedia(request, env, decodeURIComponent(url.pathname.slice(7)));
    const keyOk = !!env.STATS_KEY && url.searchParams.get('key') === env.STATS_KEY;
    if (url.pathname.startsWith('/queue') && keyOk) {
      const r = await queueApi(request, env, url); if (r) return r;
    }
    // GET /probe?key=...: can the token publish? An empty container request fails on permissions first, otherwise on the missing video.
    if (url.pathname === '/probe' && keyOk) {
      try { await graph(`${env.IG_ACCOUNT_ID}/media`, env.IG_ACCESS_TOKEN, { media_type: 'REELS' }); return Response.json({ ok: true }); }
      catch (e) { return Response.json({ error: e.message }); }
    }
    if (url.pathname === '/health') {
      if (!env.IG_ACCESS_TOKEN) return Response.json({ ok: false, error: 'no token yet: run connect.sh' }, { status: 503 });
      try {
        const me = await graph('me?fields=id,name', env.IG_ACCESS_TOKEN);
        return Response.json({ ok: true, page: me.name, page_id: me.id, page_matches: !!env.FB_PAGE_ID && me.id === env.FB_PAGE_ID, ig_account: env.IG_ACCOUNT_ID || null });
      } catch (e) { return Response.json({ ok: false, error: e.message }, { status: 502 }); }
    }
    if (url.pathname === '/stats' && keyOk) {
      const { results } = await env.DB.prepare(`SELECT media_id, COUNT(*) AS dms, MAX(sent_at) AS last FROM ig_dms WHERE status = 'sent' GROUP BY media_id ORDER BY last DESC`).all();
      return Response.json(results);
    }
    // GET /check?key=...: what Instagram returns to the bot (recent posts, their comment counts, the newest comments). No tokens shown.
    if (url.pathname === '/check' && keyOk) {
      const out = { account: env.IG_ACCOUNT_ID };
      try {
        out.me = await graph(`${env.IG_ACCOUNT_ID}?fields=username,media_count`, env.IG_ACCESS_TOKEN);
        const media = await graph(`${env.IG_ACCOUNT_ID}/media?fields=id,timestamp,comments_count,media_product_type&limit=5`, env.IG_ACCESS_TOKEN);
        out.media = media.data;
        if (media.data && media.data[0]) out.comments = (await graph(`${media.data[0].id}/comments?fields=id,text,timestamp,username,from{id,username},replies{id,text,timestamp,username,from{id,username}}&limit=5`, env.IG_ACCESS_TOKEN)).data;
      } catch (e) { out.error = e.message; }
      return Response.json(out);
    }
    return new Response('Not found', { status: 404 });
  },
};
