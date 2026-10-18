// Bot protection shared by every function that stores or emails an address.
// Cloudflare Turnstile: the page sends the widget's token as cf-turnstile-response, we check it here.
// Without the TURNSTILE_SECRET Pages secret (local dev) the check is skipped.
import { reply } from './http.js';

export const ROBOT = 'Please confirm you\'re not a robot and try again.';

// Hidden "website" field: people never see it, form-filling bots usually do.
export const isHoneypot = data => String((data && data.website) || '').trim() !== '';

// Returns null when the request may go ahead, or the 400 Response to send back.
export async function checkHuman(request, env, data, methods) {
  if (!env.TURNSTILE_SECRET) return null;
  const token = String((data && data['cf-turnstile-response']) || '');
  if (!token || token.length > 2048) return reply(request, 400, { error: ROBOT, code: 'turnstile' }, methods);
  const form = new URLSearchParams({ secret: env.TURNSTILE_SECRET, response: token });
  const ip = request.headers.get('CF-Connecting-IP');
  if (ip) form.set('remoteip', ip);
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: form });
    const out = await res.json();
    if (out.success === true) return null;
  } catch { /* siteverify unreachable: treat as failed, the visitor can retry */ }
  return reply(request, 400, { error: ROBOT, code: 'turnstile' }, methods);
}
