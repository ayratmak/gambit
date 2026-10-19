// Certificate helpers shared by /api/certificate, /api/register and /verify/<id>.
import { EXAMS } from './exams.js';
import { PAID, unlocks } from './catalogue.js';

export const CERT_ID = /^GMB-[A-Z0-9]{3}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;

export function newCertId(course) {
  const abc = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', r = new Uint8Array(8);
  crypto.getRandomValues(r);
  const part = a => [...a].map(b => abc[b % abc.length]).join('');
  return 'GMB-' + course.replace(/[^a-z]/gi, '').slice(0, 3).toUpperCase().padEnd(3, 'X') + '-' + part(r.slice(0, 4)) + '-' + part(r.slice(4));
}

// Can this email take the course's assessment? Free courses yes; paid ones need a purchase or admin access.
export async function hasAccess(env, email, course) {
  const exam = EXAMS[course];
  if (!exam) return false;
  if (exam.free) return true;
  const admins = String(env.ADMIN_EMAILS || '').toLowerCase().split(',').map(x => x.trim()).filter(Boolean);
  if (admins.includes(email)) return true;
  if (!PAID[course]) return false;
  const { results } = await env.DB.prepare('SELECT course FROM purchases WHERE email = ?1').bind(email).all();
  return (results || []).some(r => unlocks(r.course).includes(course));
}

export const certView = row => row && ({ id: row.id, name: row.name, course: row.course, title: (EXAMS[row.course] || {}).title || row.course, score: row.score, total: row.total, issued_at: row.issued_at });
