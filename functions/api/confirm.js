// GET /api/confirm?session_id=cs_...
// Checks a Stripe Checkout session after the buyer returns, records the purchase and returns { course, courses, email }.
import { cors, reply } from '../../lib/http.js';
import { unlocks } from '../../lib/catalogue.js';

const M = 'GET, OPTIONS';
export const onRequestOptions = ({ request }) => new Response(null, { status: 204, headers: cors(request, M) });

export async function onRequestGet({ request, env }) {
  const id = new URL(request.url).searchParams.get('session_id') || '';
  if (!/^cs_[A-Za-z0-9_]+$/.test(id)) return reply(request, 400, { error: 'Missing payment reference.' }, M);
  if (!env.STRIPE_SECRET_KEY) return reply(request, 503, { error: 'Payments are not switched on yet.' }, M);
  const res = await fetch('https://api.stripe.com/v1/checkout/sessions/' + id, { headers: { 'Authorization': 'Bearer ' + env.STRIPE_SECRET_KEY } });
  const s = await res.json();
  if (!res.ok) return reply(request, 404, { error: 'We couldn\'t find that payment.' }, M);
  const course = s.metadata && s.metadata.course, email = (s.metadata && s.metadata.email) || s.customer_email;
  if (s.payment_status !== 'paid' || !unlocks(course).length) return reply(request, 402, { error: 'That payment hasn\'t gone through.' }, M);
  await env.DB.prepare('INSERT INTO purchases (session_id, email, course, amount_pence, currency, created_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6) ON CONFLICT(session_id) DO NOTHING')
    .bind(id, email, course, s.amount_total || 0, s.currency || 'gbp', new Date().toISOString()).run();
  return reply(request, 200, { course, courses: unlocks(course), email }, M);
}
