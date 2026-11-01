// Keyword matching and the tracked guide link, shared by the Instagram (index.js) and Facebook (fb.js) sides.
import COPY from './copy.js';

const escapeRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// any run of spaces, hyphens, dashes, underscores or dots between a phrase's words, or none at all
const GAP = '[\\s\\-\\u2010-\\u2015_.]*';
const NOT_WORD = '[^\\p{L}\\p{N}_]';

export const PHRASE = new RegExp(COPY.phrases.map(p => p.trim().split(/\s+/).map(escapeRe).join(GAP)).join('|'), 'iu');
export const WORD = new RegExp(`(^|${NOT_WORD})(${COPY.words.map(escapeRe).join('|')})($|${NOT_WORD})`, 'iu');
const IGNORE = COPY.ignore.length
  ? new RegExp(`(^|${NOT_WORD})(${COPY.ignore.map(p => p.trim().split(/\s+/).map(escapeRe).join('\\s+')).join('|')})(?=$|${NOT_WORD})`, 'giu')
  : null;

// True when a comment asks for the guide.
export function wantsGuide(text) {
  const t = String(text || '');
  if (PHRASE.test(t)) return true;
  return WORD.test(IGNORE ? t.replace(IGNORE, '$1 ') : t);
}

// 10-character code from an unambiguous alphabet. Carries no personal data; kept in D1 only.
export function newRef() {
  const abc = 'abcdefghjkmnpqrstuvwxyz23456789', bytes = crypto.getRandomValues(new Uint8Array(10));
  return [...bytes].map(b => abc[b % abc.length]).join('');
}

// source: 'instagram' | 'facebook'. campaign: the video's slug when it went out through the queue, otherwise its post id.
export const guideUrl = (source, campaign) => {
  const q = new URLSearchParams({ utm_source: source, utm_medium: 'dm' });
  if (campaign) q.set('utm_campaign', String(campaign));
  return `${COPY.guide_url}?${q}`;
};

// Same comment always gets the same pick, so a retry doesn't change the wording.
export const publicReply = commentId =>
  COPY.public_replies.length ? COPY.public_replies[[...String(commentId)].reduce((a, ch) => a + ch.charCodeAt(0), 0) % COPY.public_replies.length] : null;

// The slug a post was scheduled under (schedule.mjs), for utm_campaign. Falls back to the post id.
export async function campaignFor(env, mediaId) {
  try {
    const row = await env.DB.prepare('SELECT id FROM ig_queue WHERE media_id = ?1').bind(String(mediaId)).first();
    if (row && row.id) return String(row.id).replace(/^fb:/, '');
  } catch { /* table missing or DB hiccup: the post id is fine */ }
  return String(mediaId);
}
