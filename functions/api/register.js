// POST /api/register  { name, email, consent }
// Creates or refreshes a sign-up. Marketing consent is only ever switched on here, never off;
// withdrawing it will go through an unsubscribe link.
const ALLOWED = ['https://ayratmak.github.io', 'http://localhost:4817', 'http://localhost:8000'];

function cors(request) {
  const origin = request.headers.get('Origin') || '';
  const h = { 'Content-Type': 'application/json', 'Vary': 'Origin' };
  if (ALLOWED.includes(origin)) {
    h['Access-Control-Allow-Origin'] = origin;
    h['Access-Control-Allow-Methods'] = 'POST, OPTIONS';
    h['Access-Control-Allow-Headers'] = 'Content-Type';
  }
  return h;
}
const reply = (request, status, body) => new Response(JSON.stringify(body), { status, headers: cors(request) });

export async function onRequestOptions({ request }) {
  return new Response(null, { status: 204, headers: cors(request) });
}

export async function onRequestPost({ request, env }) {
  let data;
  try { data = await request.json(); } catch { return reply(request, 400, { error: 'Send name and email as JSON.' }); }
  const name = String(data.name || '').trim().slice(0, 120);
  const email = String(data.email || '').trim().toLowerCase().slice(0, 254);
  const consent = data.consent === true;
  if (name.length < 2) return reply(request, 400, { error: 'Enter your full name. It goes on your certificates.' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return reply(request, 400, { error: 'Enter a valid email address, like you@company.com.' });

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

  return reply(request, 200, { ok: true });
}
