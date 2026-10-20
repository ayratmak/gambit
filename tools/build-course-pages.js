#!/usr/bin/env node
// Builds the public, indexable course pages (/courses/<slug>), the course hub (/courses/) and sitemap.xml
// from assets/courses/*.js and tools/course-pages.config.js. Run by deploy.sh.
// Usage: node tools/build-course-pages.js <outDir> <homeLastmod YYYY-MM-DD>
const fs = require('fs'), path = require('path'), vm = require('vm'), { execSync } = require('child_process');
const ROOT = path.join(__dirname, '..'), OUT = process.argv[2] || path.join(ROOT, 'dist'), HOME_LASTMOD = process.argv[3] || new Date().toISOString().slice(0, 10);
const SITE = 'https://gambitschool.com';
const cfg = require('./course-pages.config.js');
const TRACKS = require('./track-pages.config.js');
const TRACK_ANCHOR = { procurement: 'procurement negotiation training', sales: 'sales negotiation training', students: 'game theory for students' };

const sb = { window: {} }; vm.createContext(sb);
for (const f of fs.readdirSync(path.join(ROOT, 'assets/courses')).filter(f => f.endsWith('.js'))) vm.runInContext(fs.readFileSync(path.join(ROOT, 'assets/courses', f), 'utf8'), sb);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'assets/worlds.js'), 'utf8'), sb);
const WORLDS = sb.window.GAMBIT_WORLDS || {};
const courses = sb.window.GAMBIT_COURSES.slice().sort((a, b) => a.order - b.order);
for (const c of courses) if (!cfg.courses[c.id]) throw new Error('No SEO config for course ' + c.id);

const esc = s => String(s).replace(/[&<>"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
const plain = html => String(html).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const lessons = c => c.modules.flatMap(m => m.lessons);
const url = c => `${SITE}/courses/${cfg.courses[c.id].slug}`;
const money = c => c.free ? 'Free' : '£' + c.price.toFixed(2);
const hours = m => (m / 60).toFixed(1).replace(/\.0$/, '');
// A one-sentence teaser for each lesson: the first paragraph of its first read step, cut at a sentence end.
function teaser(l) {
  const r = l.steps.find(s => s.t === 'read'); if (!r) return '';
  let t = plain(r.body[0]);
  if (t.length > 190) { const cut = t.slice(0, 190); const end = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('? ')); t = end > 60 ? cut.slice(0, end + 1) : cut.replace(/\s+\S*$/, '') + '…'; }
  return t;
}
function lastmod(file) {
  try { const dirty = execSync(`git status --porcelain -- "${file}"`, { cwd: ROOT }).toString().trim(); if (dirty) return new Date().toISOString().slice(0, 10);
        return execSync(`git log -1 --format=%cs -- "${file}"`, { cwd: ROOT }).toString().trim() || new Date().toISOString().slice(0, 10); }
  catch { return new Date().toISOString().slice(0, 10); }
}

const FONTS = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300..600;1,6..72,300..500&family=Geist:wght@400;500&family=Geist+Mono:wght@400;500&display=swap">';
const STYLE = `<style>
  main { padding-block: 36px 96px; }
  .crumbs { display: flex; flex-wrap: wrap; gap: 8px; color: var(--muted); font-size: 14px; margin-bottom: 28px; list-style: none; padding: 0; }
  .crumbs li + li::before { content: "/"; margin-right: 8px; opacity: .6; }
  .crumbs a:hover { color: var(--ink); }
  .layout { display: grid; grid-template-columns: minmax(0, 1fr) 340px; gap: clamp(28px, 5vw, 72px); align-items: start; }
  .hero { display: grid; gap: 18px; padding-bottom: 32px; border-bottom: 1px solid var(--line); }
  .hero canvas.big { width: 72px; height: 72px; }
  .hero h1 { font-size: clamp(38px, 5vw, 62px); line-height: 1.02; letter-spacing: -.035em; }
  .hero p.lead { font: 350 20px/1.45 var(--font-display); color: var(--muted); max-width: 44ch; }
  .meta { display: flex; flex-wrap: wrap; gap: 8px; }
  section.block { padding: 32px 0; border-bottom: 1px solid var(--line); display: grid; gap: 14px; }
  section.block h2 { font-size: 30px; letter-spacing: -.015em; }
  .prose p { font: 350 18px/1.6 var(--font-display); max-width: 62ch; }
  .prose p + p { margin-top: 12px; }
  .prose a, .faq a, .related a.inline { text-decoration: underline; text-underline-offset: 3px; }
  .outcomes { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px 24px; list-style: none; margin: 0; padding: 0; }
  .outcomes li { display: flex; gap: 10px; font-size: 15px; }
  .outcomes li::before { content: ""; flex: none; width: 14px; height: 1px; background: var(--accent); margin-top: .75em; }
  .mod { display: grid; gap: 4px; margin-top: 10px; }
  .mod-head { display: flex; justify-content: space-between; gap: 12px; padding-bottom: 6px; }
  .mod-head h3 { font-size: 22px; }
  .les { display: grid; grid-template-columns: 34px minmax(0, 1fr); gap: 14px; padding: 12px 0; border-top: 1px dashed var(--line); }
  .les .n { width: 28px; height: 28px; border-radius: 50%; border: 1.5px solid var(--line-strong); display: grid; place-items: center; font: 500 12px var(--font-mono); color: var(--muted); }
  .les h4 { font: 400 17px/1.35 var(--font-ui); }
  .les p { font-size: 14px; color: var(--muted); margin-top: 4px; max-width: 66ch; }
  .les .sub { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 6px; align-items: center; }
  .les .play { font-size: 13px; text-decoration: underline; text-underline-offset: 3px; color: var(--accent); }
  .faq { display: grid; gap: 8px; }
  .faq details { border: 1px solid var(--line); border-radius: 10px; padding: 14px 16px; background: var(--surface); }
  .faq summary { cursor: pointer; font-weight: 500; }
  .faq details p { margin-top: 10px; color: var(--muted); font-size: 15px; line-height: 1.55; }
  .rel { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 10px; }
  .rel a { border: 1px solid var(--line); border-radius: 10px; padding: 14px 16px; display: grid; gap: 4px; background: var(--surface); }
  .rel a:hover { border-color: var(--ink); }
  .rel b { font: 400 19px/1.25 var(--font-display); }
  .rel span { font-size: 13px; color: var(--muted); }
  .buy { position: sticky; top: calc(env(safe-area-inset-top, 0px) + 88px); border: 1px solid var(--line-strong); border-radius: 12px; background: var(--surface); padding: 26px; display: grid; gap: 16px; }
  .buy .price-big { font: 400 54px/1 var(--font-display); letter-spacing: -.03em; }
  .buy .price-big small { font: 400 14px var(--font-ui); color: var(--muted); letter-spacing: 0; margin-left: 6px; }
  .buy .small { font-size: 13px; color: var(--muted); }
  .topbar-in nav a { color: var(--muted); font-size: 14px; padding: 7px 13px; }
  .topbar-in nav a:hover { color: var(--ink); }
  .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 14px; }
  .card { border: 1px solid var(--line-strong); border-radius: 12px; padding: 22px; display: grid; gap: 10px; align-content: start; background: var(--surface); }
  .card:hover { border-color: var(--ink); }
  .card canvas { width: 40px; height: 40px; }
  .card h3 { font-size: 24px; letter-spacing: -.01em; }
  .card p { font-size: 14px; color: var(--muted); }
  .track { display: grid; gap: 14px; padding: 28px 0; border-top: 1px solid var(--line); }
  .track h2 { font-size: 26px; }
  @media (max-width: 920px) { .layout { grid-template-columns: 1fr; } .buy { position: static; order: -1; } .outcomes { grid-template-columns: 1fr; } }
  @media (max-width: 420px) { .hide-sm { display: none !important; } }
</style>`;

function head({ title, description, canonical, jsonld }) {
  return `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${canonical}">
<meta name="robots" content="index, follow">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Gambit">
<meta property="og:locale" content="en_GB">
<meta property="og:url" content="${canonical}">
<meta property="og:title" content="${esc(title.replace(/ \| Gambit$/, ''))}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:image" content="${SITE}/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
${FONTS}
<link rel="stylesheet" href="/assets/app.css?v=6">
${STYLE}
${jsonld.map(j => `<script type="application/ld+json">${JSON.stringify(j)}</script>`).join('\n')}
</head>`;
}

function topbar(nextPath) {
  const n = encodeURIComponent(nextPath);
  return `<header class="topbar"><div class="wrap topbar-in">
  <a class="brand" href="/"><canvas class="piece-icon" data-piece="knight" aria-hidden="true"></canvas>Gambit</a>
  <nav aria-label="Site" class="hide-sm"><a href="/courses/">All courses</a></nav>
  <div style="display:flex;gap:8px" id="authBtns"><a class="btn ghost hide-sm" href="/login.html?next=${n}">Sign in</a><a class="btn solid" href="/login.html?next=${n}">Start free</a></div>
</div></header>`;
}

// Swap sign-up buttons for "Open course" when the visitor is already signed in on this device.
const SIGNED_IN = id => `<script src="/assets/core.js?v=10"></script>
<script>
  G.paintIcons();
  if (G.Store.user) {
    document.getElementById('authBtns').innerHTML = '<a class="btn solid" href="/app.html">My learning</a>';
    var p = document.getElementById('primaryCta'); if (p) { p.textContent = 'Open the course'; p.href = '/course.html?c=${id}'; }
    document.querySelectorAll('[data-anon]').forEach(function (x) { x.remove(); });
  }
</script>`;

const ORG = { '@type': 'Organization', name: 'Gambit', url: SITE + '/' };

function faq(c) {
  const n = lessons(c).length, pv = lessons(c).find(l => l.preview);
  const items = [
    ['How long does the course take?', `About ${hours(c.minutes + 10)} hours: ${n} lessons totalling ${c.minutes} minutes, plus a 10-minute final assessment. It's self-paced, so you can stop after any lesson and pick up where you left off.`],
    ['Do I get a certificate?', 'Yes. Pass the 10-question final assessment (7 out of 10) and you get a certificate of completion with your name and a verification ID. You can retake the assessment as often as you like.'],
    [c.free ? 'Is it really free?' : 'How much does it cost?', c.free ? 'Yes. The whole course, the assessment and the certificate are free. You only need to register with your name and email.' : `${money(c)}, a one-off payment with lifetime access. Signing up is free, and the first lesson, "${pv ? pv.title : ''}", is free to play before you buy.`],
    ['Do I need to know any maths?', 'No. Everything is explained in plain English with small, worked numbers. If you can compare two prices, you can do this course.'],
    ['How is it taught?', 'Every lesson is interactive: you play a game, make a choice or move a slider first, then the idea behind it is explained. There are no videos to sit through.']
  ];
  return items;
}

function coursePage(c) {
  const k = cfg.courses[c.id], ls = lessons(c), pv = ls.find(l => l.preview) || ls[0];
  const canonical = url(c);
  const same = courses.filter(x => x.id !== c.id && x.track === c.track);
  const others = courses.filter(x => x.id !== c.id && x.track !== c.track);
  const related = same.concat(others.filter(x => x.id === 'foundations'), others.filter(x => x.id !== 'foundations')).slice(0, 4);
  const fq = faq(c);
  const jsonld = [
    { '@context': 'https://schema.org', '@type': 'Course', name: c.title, description: k.description, url: canonical, inLanguage: 'en-GB', provider: ORG,
      educationalLevel: c.level, teaches: c.outcomes,
      offers: [{ '@type': 'Offer', category: c.free ? 'Free' : 'Paid', price: c.free ? 0 : c.price, priceCurrency: 'GBP', availability: 'https://schema.org/InStock', url: canonical }],
      hasCourseInstance: [{ '@type': 'CourseInstance', courseMode: 'Online', courseWorkload: `PT${c.minutes + 10}M`, inLanguage: 'en-GB' }] },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Gambit', item: SITE + '/' },
      { '@type': 'ListItem', position: 2, name: 'Courses', item: SITE + '/courses/' },
      { '@type': 'ListItem', position: 3, name: c.title, item: canonical }] },
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: fq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) }
  ];
  const buyNext = c.free ? `lesson.html?c=${c.id}&l=${ls[0].id}` : `course.html?c=${c.id}&buy=1`;
  let n = 0;
  const mods = c.modules.map((m, mi) => `<div class="mod"><div class="mod-head"><h3>${esc(m.title)}</h3><span class="mono">Module ${mi + 1}</span></div>
    ${m.lessons.map(l => { n++; const t = teaser(l); return `<div class="les"><span class="n num">${n}</span><div><h4>${esc(l.title)}</h4>${t ? `<p>${esc(t)}</p>` : ''}<div class="sub"><span class="mono">${esc(l.kind)}</span><span class="mono num">${l.minutes} min</span>${l.preview ? `<a class="play" href="/lesson.html?c=${c.id}&l=${l.id}">Play this lesson free</a>` : ''}</div></div></div>`; }).join('')}
  </div>`).join('');
  const relLinks = related.map(x => `<a href="/courses/${cfg.courses[x.id].slug}"><span class="mono">${esc(x.track)} · ${money(x)}</span><b>${esc(x.title)}</b><span>${esc(cfg.courses[x.id].h1.replace(/^[^:]+: /, '').replace(/^./, s => s.toUpperCase()))}</span></a>`).join('');
  const inlineRel = related.slice(0, 3).map(x => `<a class="inline" href="/courses/${cfg.courses[x.id].slug}">${esc(cfg.courses[x.id].h1.split(':')[0].toLowerCase())}</a>`);
  return `${head({ title: k.title, description: k.description, canonical, jsonld })}
<body>
${topbar('course.html?c=' + c.id)}
<main class="wrap">
  <ol class="crumbs" aria-label="Breadcrumb"><li><a href="/">Gambit</a></li><li><a href="/courses/">Courses</a></li><li aria-current="page">${esc(c.title)}</li></ol>
  <div class="layout">
    <div>
      <div class="hero">
        <canvas class="piece-icon big" data-piece="${c.piece}" aria-hidden="true"></canvas>
        <span class="mono">Course ${c.order} of ${courses.length} · ${esc(c.track)}</span>
        <h1>${esc(k.h1)}</h1>
        <p class="lead">${esc(c.summary)}</p>
        <div class="meta"><span class="badge">${esc(c.level)}</span><span class="badge num">${ls.length} lessons</span><span class="badge num">${c.minutes + 10} min</span><span class="badge">Certificate</span><span class="badge">${c.free ? 'Free' : money(c)}</span></div>
      </div>
      <section class="block prose" aria-labelledby="h-about"><h2 id="h-about">About this course</h2>${k.about.map(p => `<p>${esc(p)}</p>`).join('')}<p><b>Who it's for:</b> ${esc(k.forWho)}</p></section>
      <section class="block" aria-labelledby="h-out"><h2 id="h-out">What you'll be able to do</h2><ul class="outcomes">${c.outcomes.map(o => `<li>${esc(o)}</li>`).join('')}</ul></section>
      ${WORLDS[c.id] ? `<section class="block prose" aria-labelledby="h-3d"><h2 id="h-3d">Interactive 3D lesson: ${esc(WORLDS[c.id].title)}</h2><p>Max and Libby, Gambit's two hosts, act out this course's key game in a 3D scene you can turn, zoom and click. Every object tells you what it knows, you make the call before you're told the answer, and Max and Libby explain what happened. It's a lesson of its own in the course, about seven minutes long, and it starts straight after the lesson it's built on.${c.free ? ' Like the rest of this course, it\'s free.' : ' It comes with the course.'}</p>${c.free ? `<p><a class="btn accent" href="/world.html?w=${WORLDS[c.id].world}">Play the 3D lesson free</a></p>` : ''}</section>` : ''}
      <section class="block" aria-labelledby="h-syl"><h2 id="h-syl">Syllabus: ${ls.length} lessons</h2>${mods}
        <div class="les"><span class="n">★</span><div><h4>Final assessment and certificate</h4><p>Ten questions on fresh scenarios. Score 7 or more and your certificate is issued straight away.</p></div></div></section>
      <section class="block" aria-labelledby="h-faq"><h2 id="h-faq">Questions</h2><div class="faq">${fq.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</div></section>
      <section class="block related" aria-labelledby="h-rel" style="border-bottom:0"><h2 id="h-rel">Related courses</h2>
        <p class="prose" style="font-size:16px">This course pairs well with ${inlineRel.slice(0, -1).join(', ')} and ${inlineRel[inlineRel.length - 1]}. New to game theory? The free <a class="inline" href="/courses/${cfg.courses.foundations.slug}">game theory foundations course</a> is the place to start${c.id === 'foundations' ? ', and you are on it' : ''}.</p>
        <div class="rel">${relLinks}</div>
        ${(() => { const ts = TRACKS.filter(t => t.path.some(p => p.id === c.id)); return ts.length ? `<p class="prose" style="font-size:16px">Part of ${ts.map(t => `<a class="inline" href="/for/${t.slug}">${TRACK_ANCHOR[t.slug] || t.eyebrow}</a>`).join(' and ')}: take it with the related courses as a track and save.</p>` : ''; })()}
        <p style="font-size:14px"><a class="inline" href="/courses/">See all ${courses.length} courses</a></p></section>
    </div>
    <aside class="buy" aria-label="Enrol">
      <div class="price-big num">${c.free ? 'Free' : money(c)}<small>${c.free ? 'certificate included' : 'one-off'}</small></div>
      <ul class="lines"><li>${ls.length} interactive lessons</li><li>About ${hours(c.minutes + 10)} hours, self-paced</li><li>Final assessment</li><li>Certificate of completion</li></ul>
      <a class="btn solid block" id="primaryCta" href="/login.html?next=${encodeURIComponent(buyNext)}">${c.free ? 'Start free' : 'Sign up and buy · ' + money(c)}</a>
      <a class="btn ghost block" href="/lesson.html?c=${c.id}&l=${pv.id}">Play lesson one free</a>
      <p class="small" data-anon>${c.free ? 'Just your name and email. No card needed.' : 'Lesson one needs no account. Signing up is free; you only pay when you buy.'}</p>
    </aside>
  </div>
</main>
${SIGNED_IN(c.id)}
</body>
</html>
`;
}

function hubPage() {
  const canonical = SITE + '/courses/';
  const jsonld = [
    { '@context': 'https://schema.org', '@type': 'ItemList', itemListElement: courses.map((c, i) => ({ '@type': 'ListItem', position: i + 1, url: url(c), name: c.title })) },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Gambit', item: SITE + '/' },
      { '@type': 'ListItem', position: 2, name: 'Courses', item: canonical }] }
  ];
  const tracks = [...new Set(courses.map(c => c.track))];
  const card = c => `<a class="card" href="/courses/${cfg.courses[c.id].slug}"><canvas class="piece-icon" data-piece="${c.piece}" aria-hidden="true"></canvas><span class="mono">${esc(c.level)} · ${lessons(c).length} lessons · ${c.free ? 'Free' : money(c)}</span><h3>${esc(c.title)}</h3><p>${esc(c.summary)}</p></a>`;
  return `${head({ title: cfg.hub.title, description: cfg.hub.description, canonical, jsonld })}
<body>
${topbar('app.html')}
<main class="wrap">
  <ol class="crumbs" aria-label="Breadcrumb"><li><a href="/">Gambit</a></li><li aria-current="page">Courses</li></ol>
  <div class="hero" style="border:0">
    <h1>Game theory, negotiation and procurement courses</h1>
    <p class="lead">Nine self-paced courses of about two hours each. You play every game before you learn its name, and you earn a certificate when you pass. Start with the free <a href="/courses/${cfg.courses.foundations.slug}" style="text-decoration:underline;text-underline-offset:3px">game theory foundations course</a>; the rest cost £9.89 each, with the first lesson free to play.</p>
  </div>
  ${tracks.map(t => `<section class="track" aria-label="${esc(t)}"><h2>${esc(t)}</h2><div class="cards">${courses.filter(c => c.track === t).map(card).join('')}</div></section>`).join('')}
</main>
${SIGNED_IN('')}
</body>
</html>
`;
}

fs.mkdirSync(path.join(OUT, 'courses'), { recursive: true });
fs.writeFileSync(path.join(OUT, 'courses', 'index.html'), hubPage());
const urls = [[SITE + '/', HOME_LASTMOD]];
let hubMod = '0000-00-00';
for (const c of courses) {
  const k = cfg.courses[c.id];
  fs.writeFileSync(path.join(OUT, 'courses', k.slug + '.html'), coursePage(c));
  const lm = [lastmod('assets/courses/' + c.id + '.js'), lastmod('tools/course-pages.config.js'), lastmod('tools/build-course-pages.js')].sort().pop();
  if (lm > hubMod) hubMod = lm;
  urls.push([url(c), lm]);
}
urls.splice(1, 0, [SITE + '/courses/', hubMod]);
urls.splice(1, 0, ...require('./build-track-pages.js')(OUT, courses, cfg, lastmod));
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + urls.map(([u, d]) => `  <url><loc>${u}</loc><lastmod>${d}</lastmod></url>`).join('\n') + '\n</urlset>\n');
console.log(`Built ${courses.length} course pages, the hub and a sitemap with ${urls.length} URLs in ${OUT}`);
