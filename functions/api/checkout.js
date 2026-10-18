// POST /api/checkout  { course, email, base, cf-turnstile-response }
// Starts a Stripe Checkout payment for one paid course and returns its URL.
// Until STRIPE_SECRET_KEY is set, it records the buyer's interest instead and returns { pending: true }.
import { cors, reply, validEmail, ALLOWED } from '../../lib/http.js';
import { PAID, PRICE_PENCE } from '../../lib/catalogue.js';
import { checkHuman, isHoneypot } from '../../lib/turnstile.js';

export const onRequestOptions = ({ request }) => new Response(null, { status: 204, headers: cors(request) });

export async function onRequestPost({ request, env }) {
  let d;
  try { d = await request.json(); } catch { return reply(request, 400, { error: 'Send course and email as JSON.' }); }
  if (isHoneypot(d)) return reply(request, 200, { pending: true });
  const course = String(d.course || ''), email = String(d.email || '').trim().toLowerCase().slice(0, 254);
  if (!PAID[course]) return reply(request, 400, { error: 'That course isn\'t for sale.' });
  if (!validEmail(email)) return reply(request, 400, { error: 'Sign in again, then retry.' });
  const blocked = await checkHuman(request, env, d);
  if (blocked) return blocked;
  const now = new Date().toISOString();

  if (!env.STRIPE_SECRET_KEY) {
    try { await env.DB.prepare('INSERT INTO interest (email, course, created_at) VALUES (?1, ?2, ?3) ON CONFLICT(email, course) DO NOTHING').bind(email, course, now).run(); } catch { /* table missing: still tell the buyer */ }
    return reply(request, 200, { pending: true });
  }

  // Where Stripe sends the buyer back to: the page's own folder, if it's one of ours.
  let base = String(d.base || '');
  const okBase = ALLOWED.some(o => base.startsWith(o + '/')) || /^https:\/\/[a-z0-9-]+\.gambit-7w4\.pages\.dev\//.test(base);
  if (!okBase) base = 'https://gambitschool.com/';
  const form = new URLSearchParams({
    'mode': 'payment',
    'customer_email': email,
    'line_items[0][quantity]': '1',
    'line_items[0][price_data][currency]': 'gbp',
    'line_items[0][price_data][unit_amount]': String(PRICE_PENCE),
    'line_items[0][price_data][product_data][name]': 'Gambit course: ' + PAID[course],
    'metadata[course]': course,
    'metadata[email]': email,
    'success_url': base + 'course.html?c=' + encodeURIComponent(course) + '&session_id={CHECKOUT_SESSION_ID}',
    'cancel_url': base + 'course.html?c=' + encodeURIComponent(course)
  });
  const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST', body: form,
    headers: { 'Authorization': 'Bearer ' + env.STRIPE_SECRET_KEY, 'Content-Type': 'application/x-www-form-urlencoded' }
  });
  const s = await res.json();
  if (!res.ok || !s.url) return reply(request, 502, { error: 'Payments are unavailable right now. Try again in a few minutes.' });
  return reply(request, 200, { url: s.url });
}
