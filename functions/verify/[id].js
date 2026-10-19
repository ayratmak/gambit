// GET /verify/<certificate id>: the public page employers and contacts see when a learner shares a certificate.
// Rendered on the server from the certificates table, so it works for anyone, signed in or not.
import { EXAMS } from '../../lib/exams.js';
import { CERT_ID } from '../../lib/certs.js';

const esc = s => String(s).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));

function page({ title, body, status = 200 }) {
  return new Response(`<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex, follow">
<title>${esc(title)}</title>
<link rel="icon" href="/favicon.ico" sizes="32x32"><link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300..600;1,6..72,300..500&family=Geist:wght@400;500&family=Geist+Mono:wght@400;500&display=swap">
<link rel="stylesheet" href="/assets/app.css?v=6">
<link rel="stylesheet" href="/assets/certificate.css?v=1">
<style>
  .ok { width: min(1000px, 100%); display: flex; gap: 14px; align-items: center; justify-content: space-between; flex-wrap: wrap; border: 1px solid var(--accent); background: var(--accent-soft); border-radius: 12px; padding: 16px 20px; }
  .ok b { font: 400 22px var(--font-display); }
  .ok p { color: var(--muted); font-size: 14px; margin-top: 2px; }
  .ok .tick { width: 34px; height: 34px; border-radius: 50%; background: var(--accent); color: var(--bg); display: grid; place-items: center; font-size: 18px; flex: none; }
  .ok .who { display: flex; gap: 14px; align-items: center; }
  .cta { width: min(1000px, 100%); display: flex; justify-content: space-between; gap: 12px; flex-wrap: wrap; align-items: center; color: var(--muted); font-size: 15px; }
</style>
</head>
<body>
<header class="topbar"><div class="wrap topbar-in"><a class="brand" href="/"><canvas class="piece-icon" data-piece="knight" aria-hidden="true"></canvas>Gambit</a><a class="btn ghost" href="/courses/">Courses</a></div></header>
<main class="wrap">${body}</main>
<script src="/assets/core.js?v=10"></script>
<script>
  G.paintIcons();
  (function () {
    var paint = function (cv, fn) { if (!cv) return; var px = Math.round(cv.clientWidth * 2) || 200; cv.width = cv.height = px; fn(cv.getContext('2d'), px); };
    paint(document.querySelector('.c-brand canvas'), function (c, px) { c.scale(px / 100, px / 100); c.fillStyle = '#17150F'; G.drawPiece(c, 'knight'); });
    var seal = function () { paint(document.getElementById('seal'), function (c, px) {
      var r = px / 2; c.translate(r, r); c.strokeStyle = '#2E5B45'; c.lineWidth = px * .012;
      c.beginPath(); c.arc(0, 0, r * .96, 0, Math.PI * 2); c.stroke(); c.beginPath(); c.arc(0, 0, r * .74, 0, Math.PI * 2); c.stroke();
      c.fillStyle = '#2E5B45'; c.font = '500 ' + (px * .07) + 'px "Geist Mono", monospace'; c.textAlign = 'center'; c.textBaseline = 'middle';
      var t = 'GAMBIT · GAME THEORY · VERIFIED · ', n = t.length;
      for (var k = 0; k < n; k++) { c.save(); c.rotate((k / n) * Math.PI * 2); c.fillText(t[k], 0, -r * .85); c.restore(); }
      c.save(); c.translate(-r * .38, -r * .42); c.scale(r * .0076, r * .0076); G.drawPiece(c, 'king'); c.restore();
    }); };
    seal(); document.fonts && document.fonts.ready.then(seal);
  })();
</script>
</body>
</html>`, { status, headers: { 'Content-Type': 'text/html; charset=utf-8', 'X-Robots-Tag': 'noindex', 'Cache-Control': 'public, max-age=300' } });
}

const notFound = id => page({ status: 404, title: 'Certificate not found · Gambit', body: `
  <div class="empty" style="margin-top:40px"><span class="mono">Certificate check</span><h1>No certificate with this ID.</h1>
  <p class="muted">We couldn't find ${id ? `<b>${esc(id)}</b>` : 'that ID'} in Gambit's records. Check it was copied exactly, including the dashes, or ask the holder to share the link from their certificate page.</p>
  <div><a class="btn solid" href="/courses/">See Gambit's courses</a></div></div>` });

export async function onRequestGet({ params, env }) {
  const id = String(params.id || '').trim().toUpperCase();
  if (!CERT_ID.test(id)) return notFound(id);
  const row = await env.DB.prepare('SELECT * FROM certificates WHERE id = ?1').bind(id).first();
  if (!row) return notFound(id);
  const c = EXAMS[row.course] || { title: row.course, summary: '', page: '/courses/' };
  const d = new Date(row.issued_at), date = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/London' });
  const words = c.title.split(' '), last = words.pop();
  return page({ title: `${row.name}: ${c.title} certificate · Gambit`, body: `
    <div class="ok" role="status"><div class="who"><span class="tick" aria-hidden="true">✓</span><div><b>Verified certificate</b><p>Issued by Gambit to ${esc(row.name)} on ${esc(date)} for passing the ${esc(c.title)} final assessment.</p></div></div><span class="mono">ID ${esc(row.id)}</span></div>
    <article class="cert" aria-label="Certificate of completion">
      <div class="frame">
        <div class="c-head"><span class="c-brand"><canvas aria-hidden="true"></canvas>Gambit</span><span class="c-mono">Certificate of completion</span></div>
        <div class="c-body">
          <span class="c-title">This certifies that</span>
          <span class="c-name">${esc(row.name)}</span>
          <span class="c-line"></span>
          <span class="c-title">has completed</span>
          <span class="c-course">${esc(words.join(' '))} <em>${esc(last)}</em></span>
          <p class="c-desc">${esc(c.summary)}</p>
        </div>
        <div class="c-foot">
          <div><span class="c-mono">Awarded</span><b>${esc(date)}</b></div>
          <div><span class="c-mono">Assessment</span><b class="num">${row.score} of ${row.total}</b></div>
          <div><span class="c-mono">Certificate ID</span><b class="num">${esc(row.id)}</b></div>
          <div class="seal"><canvas id="seal" aria-hidden="true"></canvas></div>
        </div>
      </div>
    </article>
    <div class="cta"><span>Gambit teaches game theory for negotiation, procurement and strategy through interactive lessons.</span><a class="btn solid" href="${esc(c.page)}">About this course</a></div>` });
}
