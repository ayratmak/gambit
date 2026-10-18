// POST /api/register  { name, email, consent, website (honeypot), cf-turnstile-response }
// Creates or refreshes a sign-up. Marketing consent is only ever switched on here, never off;
// withdrawing it will go through an unsubscribe link.
import { cors, reply, validEmail } from '../../lib/http.js';
import { PAID } from '../../lib/catalogue.js';
import { checkHuman, isHoneypot } from '../../lib/turnstile.js';

export async function onRequestOptions({ request }) {
  return new Response(null, { status: 204, headers: cors(request) });
}

export async function onRequestPost({ request, env }) {
  let data;
  try { data = await request.json(); } catch { return reply(request, 400, { error: 'Send name and email as JSON.' }); }
  // Honeypot filled in: look successful, store nothing.
  if (isHoneypot(data)) return reply(request, 200, { ok: true, purchases: [] });
  const name = String(data.name || '').trim().slice(0, 120);
  const email = String(data.email || '').trim().toLowerCase().slice(0, 254);
  const consent = data.consent === true;
  if (name.length < 2) return reply(request, 400, { error: 'Enter your full name. It goes on your certificates.' });
  if (!validEmail(email)) return reply(request, 400, { error: 'Enter a valid email address, like you@company.com.' });
  const blocked = await checkHuman(request, env, data);
  if (blocked) return blocked;

  const now = new Date().toISOString();
  const origin = (request.headers.get('Origin') || new URL(request.url).origin).slice(0, 100);
  await env.DB.prepare(
    `INSERT INTO signups (email, name, marketing_consent, consent_at, origin, created_at, last_seen_at)
     VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?6)
     ON CONFLICT(email) DO UPDATE SET
       name = excluded.name,
       last_seen_at = excluded.last_seen_at,
       visits = signups.visits + 1,
       marketing_consent = MAX(signups.marketing_consent, excluded.marketing_consent),
       consent_at = CASE WHEN excluded.marketing_consent = 1 AND signups.marketing_consent = 0 THEN excluded.consent_at ELSE signups.consent_at END`
  ).bind(email, name, consent ? 1 : 0, consent ? now : null, origin, now).run();

  let purchases = [];
  try {
    const { results } = await env.DB.prepare('SELECT DISTINCT course FROM purchases WHERE email = ?1').bind(email).all();
    purchases = (results || []).map(r => r.course);
  } catch { /* purchases table not created yet: sign-up still succeeds */ }
  // Admin accounts (Pages secret ADMIN_EMAILS, comma-separated) get every paid course.
  const admins = String(env.ADMIN_EMAILS || '').toLowerCase().split(',').map(x => x.trim()).filter(Boolean);
  if (admins.includes(email)) purchases = Object.keys(PAID);
  return reply(request, 200, { ok: true, purchases });
}
