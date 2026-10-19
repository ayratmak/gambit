// POST /api/certificate  { email, name, course, answers: [index, ...] }
//   Marks the final assessment on the server. On a pass, issues (or keeps) the learner's certificate and
//   returns { passed, score, total, certificate }. A lower retake never replaces a better score.
// GET /api/certificate?id=GMB-...  Public lookup used by the verify page and anyone checking a certificate.
import { cors, reply, validEmail } from '../../lib/http.js';
import { EXAMS } from '../../lib/exams.js';
import { CERT_ID, newCertId, hasAccess, certView } from '../../lib/certs.js';

const M = 'GET, POST, OPTIONS';
export const onRequestOptions = ({ request }) => new Response(null, { status: 204, headers: cors(request, M) });

export async function onRequestGet({ request, env }) {
  const id = (new URL(request.url).searchParams.get('id') || '').trim().toUpperCase();
  if (!CERT_ID.test(id)) return reply(request, 400, { error: 'That doesn\'t look like a Gambit certificate ID.' }, M);
  const row = await env.DB.prepare('SELECT * FROM certificates WHERE id = ?1').bind(id).first();
  if (!row) return reply(request, 404, { error: 'No certificate with that ID.' }, M);
  return reply(request, 200, { certificate: certView(row) }, M);
}

export async function onRequestPost({ request, env }) {
  let d;
  try { d = await request.json(); } catch { return reply(request, 400, { error: 'Send your answers as JSON.' }, M); }
  const email = String(d.email || '').trim().toLowerCase().slice(0, 254);
  const name = String(d.name || '').trim().slice(0, 120);
  const course = String(d.course || ''), exam = EXAMS[course];
  if (!exam) return reply(request, 400, { error: 'Unknown course.' }, M);
  if (!validEmail(email) || name.length < 2) return reply(request, 400, { error: 'Sign in again, then retake the assessment.' }, M);
  const answers = Array.isArray(d.answers) ? d.answers : [];
  if (answers.length !== exam.answers.length) return reply(request, 400, { error: 'Answer every question, then submit.' }, M);
  if (!(await hasAccess(env, email, course))) return reply(request, 403, { error: 'This course isn\'t unlocked for ' + email + '.' }, M);

  const score = exam.answers.reduce((n, a, i) => n + (Number(answers[i]) === a ? 1 : 0), 0);
  const total = exam.answers.length, passed = score >= exam.pass;
  const prev = await env.DB.prepare('SELECT * FROM certificates WHERE email = ?1 AND course = ?2').bind(email, course).first();
  if (!passed) return reply(request, 200, { passed, score, total, certificate: certView(prev) }, M);

  const now = new Date().toISOString();
  if (prev) {
    if (score > prev.score || name !== prev.name) await env.DB.prepare('UPDATE certificates SET score = MAX(score, ?1), name = ?2, updated_at = ?3 WHERE id = ?4').bind(score, name, now, prev.id).run();
    const row = await env.DB.prepare('SELECT * FROM certificates WHERE id = ?1').bind(prev.id).first();
    return reply(request, 200, { passed, score, total, certificate: certView(row) }, M);
  }
  const id = newCertId(course);
  await env.DB.prepare('INSERT INTO certificates (id, email, name, course, score, total, issued_at, updated_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?7)').bind(id, email, name, course, score, total, now).run();
  return reply(request, 200, { passed, score, total, certificate: certView({ id, email, name, course, score, total, issued_at: now }) }, M);
}
