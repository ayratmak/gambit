// Builds the audience landing pages (/for/<slug>) from tools/track-pages.config.js and assets/bundles.js.
// Called by tools/build-course-pages.js, which owns the sitemap. Returns [url, lastmod] pairs.
const fs = require('fs'), path = require('path'), vm = require('vm');
const SITE = 'https://gambitschool.com';
const esc = s => String(s).replace(/[&<>"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
const money = n => '£' + (Number.isInteger(n) ? String(n) : n.toFixed(2));

module.exports = function buildTracks(OUT, courses, courseCfg, lastmod) {
  const ROOT = path.join(__dirname, '..');
  const tracks = require('./track-pages.config.js');
  const sb = { window: {} }; vm.createContext(sb);
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'assets/bundles.js'), 'utf8'), sb);
  const BUNDLES = sb.window.GAMBIT_BUNDLES;
  const byId = Object.fromEntries(courses.map(c => [c.id, c]));
  const lessons = c => c.modules.flatMap(m => m.lessons);
  const courseUrl = c => '/courses/' + courseCfg.courses[c.id].slug;

  // Server and client bundle lists must agree, or buyers would pay for one thing and unlock another.
  const server = fs.readFileSync(path.join(ROOT, 'lib/catalogue.js'), 'utf8');
  for (const [id, b] of Object.entries(BUNDLES)) {
    const m = server.match(new RegExp(`'${id}':\\s*\\{[^}]*pence:\\s*(\\d+),\\s*courses:\\s*\\[([^\\]]*)\\]`));
    if (!m) throw new Error('Bundle ' + id + ' missing from lib/catalogue.js');
    const sc = m[2].replace(/'/g, '').split(',').map(x => x.trim()).filter(Boolean);
    if (+m[1] !== Math.round(b.price * 100) || sc.join() !== b.courses.join()) throw new Error('Bundle ' + id + ' differs between assets/bundles.js and lib/catalogue.js');
    b.courses.forEach(c => { if (!byId[c] || byId[c].free) throw new Error('Bundle ' + id + ' lists unknown or free course ' + c); });
  }

  const STYLE = `<style>
  body { overflow-x: hidden; }
  .tb-top { position: sticky; top: 0; z-index: 20; background: color-mix(in srgb, var(--bg) 88%, transparent); backdrop-filter: blur(10px); border-bottom: 1px solid var(--line); }
  .tb-top .in { display: flex; align-items: center; justify-content: space-between; gap: 12px; height: 64px; }
  .tb-top nav { display: flex; gap: 4px; }
  .tb-top nav a { color: var(--muted); font-size: 14px; padding: 7px 12px; border-radius: 999px; }
  .tb-top nav a:hover, .tb-top nav a[aria-current] { color: var(--ink); background: var(--surface); }
  .hero { position: relative; isolation: isolate; padding: clamp(56px, 9vw, 120px) 0 clamp(48px, 7vw, 96px); overflow: hidden; }
  .hero::before { content: ""; position: absolute; inset: -20% -10% auto -10%; height: 120%; z-index: -2;
    background: radial-gradient(60% 55% at 78% 30%, color-mix(in srgb, var(--accent) 26%, transparent), transparent 70%), radial-gradient(40% 40% at 10% 90%, color-mix(in srgb, var(--accent) 12%, transparent), transparent 70%); }
  .hero canvas.field { position: absolute; inset: 0; width: 100%; height: 100%; z-index: -1; opacity: .9; pointer-events: none; }
  .eyebrow { display: inline-flex; align-items: center; gap: 10px; font: 500 12px var(--font-mono); letter-spacing: .08em; text-transform: uppercase; color: var(--accent); }
  .eyebrow::before { content: ""; width: 24px; height: 1px; background: currentColor; }
  .hero h1 { font-size: clamp(44px, 7.2vw, 96px); line-height: .98; letter-spacing: -.04em; max-width: 14ch; margin: 18px 0 22px; }
  .hero h1 em, .close h2 em, h2 em { color: var(--accent); font-style: italic; }
  .hero .sub { font: 350 clamp(19px, 2.1vw, 23px)/1.45 var(--font-display); color: var(--muted); max-width: 52ch; }
  .ctas { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 30px; align-items: center; }
  .btn.big { padding: 16px 26px; font-size: 16px; white-space: normal; text-align: center; }
  .ctas .fine { font-size: 13px; color: var(--muted); width: 100%; }
  .ctas .fine s { opacity: .7; }
  .proof { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 26px; }
  .proof span { border: 1px solid var(--line-strong); border-radius: 999px; padding: 6px 12px; font: 500 12px var(--font-mono); letter-spacing: .03em; background: color-mix(in srgb, var(--surface) 70%, transparent); }
  section.band { padding: clamp(48px, 7vw, 88px) 0; border-top: 1px solid var(--line); }
  .band h2 { font-size: clamp(32px, 4.4vw, 52px); line-height: 1.04; letter-spacing: -.03em; max-width: 20ch; margin-bottom: 28px; }
  .band .kick { font: 500 12px var(--font-mono); letter-spacing: .08em; text-transform: uppercase; color: var(--muted); margin-bottom: 12px; display: block; }
  .pains { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; }
  .pain { border: 1px solid var(--line-strong); border-radius: 14px; padding: 24px; background: var(--surface); display: grid; gap: 10px; align-content: start; }
  .pain b { font: 400 23px/1.2 var(--font-display); }
  .pain p { color: var(--muted); font-size: 15px; line-height: 1.55; }
  .pain .x { font: 500 11px var(--font-mono); color: var(--accent); letter-spacing: .06em; text-transform: uppercase; }
  .demo { border: 1px solid var(--accent); border-radius: 16px; padding: clamp(22px, 4vw, 36px); background: linear-gradient(160deg, color-mix(in srgb, var(--accent) 10%, var(--surface)), var(--surface)); display: grid; gap: 18px; max-width: 820px; }
  .demo .q { font: 400 clamp(20px, 2.4vw, 26px)/1.35 var(--font-display); }
  .demo .opts { display: grid; gap: 10px; }
  .demo .opts button { text-align: left; padding: 15px 18px; border-radius: 10px; border: 1.5px solid var(--line-strong); background: var(--bg); cursor: pointer; font-size: 16px; color: var(--ink); }
  .demo .opts button:hover:not(:disabled) { border-color: var(--ink); }
  .demo .opts button.good { border-color: var(--accent); background: var(--accent-soft); }
  .demo .opts button.bad { border-color: var(--bad); background: var(--bad-soft); }
  .demo .why { min-height: 1.5em; font-size: 15px; line-height: 1.55; }
  .demo .after { display: none; gap: 10px; flex-wrap: wrap; }
  .demo.done .after { display: flex; }
  .path { display: grid; gap: 0; counter-reset: s; max-width: 900px; }
  .step { display: grid; grid-template-columns: 56px minmax(0, 1fr) auto; gap: 18px; padding: 20px 0; border-top: 1px dashed var(--line-strong); align-items: start; }
  .step .n { width: 44px; height: 44px; border-radius: 50%; border: 1.5px solid var(--line-strong); display: grid; place-items: center; font: 400 20px var(--font-display); }
  .step.free .n { background: var(--accent); border-color: var(--accent); color: var(--bg); }
  .step h3 { font: 400 24px/1.2 var(--font-display); letter-spacing: -.01em; }
  .step h3 a:hover { text-decoration: underline; text-underline-offset: 4px; }
  .step p { color: var(--muted); font-size: 15px; margin-top: 4px; }
  .step .m { font: 500 12px var(--font-mono); color: var(--muted); margin-top: 8px; }
  .step .tag { font: 500 11px var(--font-mono); letter-spacing: .06em; text-transform: uppercase; border: 1px solid var(--line-strong); border-radius: 999px; padding: 4px 10px; white-space: nowrap; }
  .step.free .tag { border-color: var(--accent); color: var(--accent); }
  .prices { display: grid; grid-template-columns: 1.25fr 1fr 1fr; gap: 14px; align-items: stretch; }
  .price { border: 1px solid var(--line-strong); border-radius: 16px; padding: 26px; display: grid; gap: 14px; align-content: start; background: var(--surface); position: relative; }
  .price.best { border: 2px solid var(--accent); background: linear-gradient(170deg, color-mix(in srgb, var(--accent) 14%, var(--surface)), var(--surface) 60%); box-shadow: 0 30px 80px -40px color-mix(in srgb, var(--accent) 60%, transparent); }
  .price .flag { position: absolute; top: -12px; left: 22px; background: var(--accent); color: var(--bg); font: 500 11px var(--font-mono); letter-spacing: .06em; text-transform: uppercase; padding: 5px 10px; border-radius: 999px; }
  .price h3 { font: 400 22px var(--font-display); }
  .price .amt { font: 400 58px/1 var(--font-display); letter-spacing: -.03em; }
  .price .amt small { font: 400 14px var(--font-ui); color: var(--muted); letter-spacing: 0; margin-left: 6px; }
  .price .was { font-size: 14px; color: var(--muted); }
  .price .was s { margin-right: 6px; }
  .price .save { color: var(--accent); font-weight: 500; }
  .price ul { list-style: none; padding: 0; margin: 0; display: grid; gap: 7px; font-size: 14px; }
  .price li { display: flex; gap: 8px; }
  .price li::before { content: "✓"; color: var(--accent); }
  .who { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; list-style: none; padding: 0; margin: 0; }
  .who li { border-left: 2px solid var(--accent); padding: 4px 0 4px 14px; font: 350 19px/1.4 var(--font-display); }
  .faq { display: grid; gap: 8px; max-width: 820px; }
  .faq details { border: 1px solid var(--line); border-radius: 10px; padding: 16px 18px; background: var(--surface); }
  .faq summary { cursor: pointer; font-weight: 500; font-size: 16px; }
  .faq details p { margin-top: 10px; color: var(--muted); font-size: 15px; line-height: 1.6; }
  .rel { display: flex; flex-wrap: wrap; gap: 10px; }
  .rel a { border: 1px solid var(--line-strong); border-radius: 999px; padding: 10px 16px; font-size: 14px; }
  .rel a:hover { border-color: var(--ink); }
  .close { text-align: left; padding: clamp(56px, 8vw, 110px) 0; border-top: 1px solid var(--line); position: relative; isolation: isolate; overflow: hidden; }
  .close::before { content: ""; position: absolute; inset: 0; z-index: -1; background: radial-gradient(50% 80% at 85% 50%, color-mix(in srgb, var(--accent) 18%, transparent), transparent 70%); }
  .close h2 { font-size: clamp(36px, 5.6vw, 72px); line-height: 1; letter-spacing: -.035em; max-width: 16ch; }
  .close p { color: var(--muted); font-size: 18px; margin-top: 16px; max-width: 50ch; }
  .sticky { display: none; }
  footer.ft { padding: 32px 0 110px; color: var(--muted); font-size: 13px; border-top: 1px solid var(--line); }
  footer.ft a { text-decoration: underline; text-underline-offset: 3px; }
  @media (max-width: 920px) { .pains, .who { grid-template-columns: 1fr; } .prices { grid-template-columns: 1fr; } .step { grid-template-columns: 48px minmax(0, 1fr); } .step .tag { grid-column: 2; justify-self: start; } }
  @media (max-width: 700px) {
    .tb-top nav { display: none; }
    .sticky { display: flex; position: fixed; left: 0; right: 0; bottom: 0; z-index: 30; gap: 12px; align-items: center; justify-content: space-between; padding: 12px 16px calc(12px + env(safe-area-inset-bottom, 0px)); background: var(--bg); border-top: 1px solid var(--line-strong); }
    .sticky b { font: 400 24px var(--font-display); } .sticky span { font-size: 12px; color: var(--muted); display: block; }
  }
</style>`;

  const urls = [];
  fs.mkdirSync(path.join(OUT, 'for'), { recursive: true });
  for (const t of tracks) {
    const b = BUNDLES[t.bundle];
    const paid = b.courses.map(id => byId[id]);
    const sum = paid.reduce((n, c) => n + c.price, 0);
    const save = Math.round((1 - b.price / sum) * 100);
    const mins = paid.reduce((n, c) => n + c.minutes + 10, 0);
    const hrs = Math.round(mins / 60);
    const canonical = `${SITE}/for/${t.slug}`;
    const first = paid.find(c => lessons(c).some(l => l.preview)) || paid[0];
    const firstLesson = lessons(first).find(l => l.preview) || lessons(first)[0];
    const others = tracks.filter(x => x.slug !== t.slug);
    const proof = t.proof.map(p => /^About \d+ hours$/.test(p) ? `About ${hrs} hours` : p);
    const jsonld = [
      { '@context': 'https://schema.org', '@type': 'ItemList', name: b.title, itemListElement: t.path.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: SITE + courseUrl(byId[p.id]), name: byId[p.id].title })) },
      { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Gambit', item: SITE + '/' },
        { '@type': 'ListItem', position: 2, name: t.eyebrow, item: canonical }] },
      { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: t.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) }
    ];
    const step = (p, i) => {
      const c = byId[p.id], free = !!c.free;
      return `<div class="step${free ? ' free' : ''}"><span class="n">${i + 1}</span><div><h3><a href="${courseUrl(c)}">${esc(c.title)}</a></h3><p>${esc(p.why)}</p><div class="m">${lessons(c).length} lessons · about ${Math.round((c.minutes + 10) / 60)} h · certificate</div></div><span class="tag">${free ? 'Free' : 'In the track'}</span></div>`;
    };
    const buyBtn = (cls, label) => `<button class="btn solid ${cls}" type="button" data-buy="${t.bundle}">${label}</button>`;
    const html = `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(t.title)}</title>
<meta name="description" content="${esc(t.description)}">
<link rel="canonical" href="${canonical}">
<meta name="robots" content="index, follow">
<meta property="og:type" content="website"><meta property="og:site_name" content="Gambit"><meta property="og:locale" content="en_GB">
<meta property="og:url" content="${canonical}"><meta property="og:title" content="${esc(t.title.replace(/ \| Gambit$/, ''))}"><meta property="og:description" content="${esc(t.description)}">
<meta property="og:image" content="${SITE}/og-image.png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.ico" sizes="32x32"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="apple-touch-icon" href="/apple-touch-icon.png"><link rel="manifest" href="/site.webmanifest">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300..600;1,6..72,300..500&family=Geist:wght@400;500&family=Geist+Mono:wght@400;500&display=swap">
<link rel="stylesheet" href="/assets/app.css?v=6">
${STYLE}
${jsonld.map(j => `<script type="application/ld+json">${JSON.stringify(j)}</script>`).join('\n')}
</head>
<body>
<header class="tb-top"><div class="wrap in">
  <a class="brand" href="/"><canvas class="piece-icon" data-piece="knight" aria-hidden="true"></canvas>Gambit</a>
  <nav aria-label="Tracks">${tracks.map(x => `<a href="/for/${x.slug}"${x.slug === t.slug ? ' aria-current="page"' : ''}>${esc(x.eyebrow.replace(/^For /, '').replace(/^./, s => s.toUpperCase()))}</a>`).join('')}<a href="/courses/">All courses</a></nav>
  <div id="authBtns" style="display:flex;gap:8px"><a class="btn ghost" href="/login.html?next=app.html">Sign in</a></div>
</div></header>
<main>
  <section class="hero"><canvas class="field" id="field" aria-hidden="true"></canvas><div class="wrap">
    <span class="eyebrow">${esc(t.eyebrow)}</span>
    <h1>${t.h1}</h1>
    <p class="sub">${esc(t.sub)}</p>
    <div class="ctas">
      ${buyBtn('big', `Get all ${paid.length} courses · ${money(b.price)}`)}
      <a class="btn ghost big" href="/lesson.html?c=${first.id}&l=${firstLesson.id}">Play a free lesson first</a>
      <p class="fine">One-off payment, lifetime access. ${paid.length} courses for ${money(b.price)} <s>${money(sum)}</s>, you save ${save}%. Plus the free foundations course.</p>
    </div>
    <div class="proof">${proof.map(p => `<span>${esc(p)}</span>`).join('')}</div>
  </div></section>

  <section class="band"><div class="wrap">
    <span class="kick">The problem</span>
    <h2>What changes on <em>Monday</em></h2>
    <div class="pains">${t.pains.map((p, i) => `<div class="pain"><span class="x">0${i + 1}</span><b>${esc(p.h)}</b><p>${esc(p.p)}</p></div>`).join('')}</div>
  </div></section>

  <section class="band"><div class="wrap">
    <span class="kick">${esc(t.demo.label)}</span>
    <h2>Every lesson starts with a <em>game</em></h2>
    <div class="demo" id="demo">
      <p class="q">${esc(t.demo.q)}</p>
      <div class="opts">${t.demo.options.map((o, i) => `<button type="button" data-k="${i}">${esc(o.t)}</button>`).join('')}</div>
      <p class="why" id="why" aria-live="polite"></p>
      <div class="after">${buyBtn('', `Unlock the track · ${money(b.price)}`)}<a class="btn ghost" href="/lesson.html?c=${first.id}&l=${firstLesson.id}">Play a full lesson free</a></div>
    </div>
  </div></section>

  <section class="band" id="path"><div class="wrap">
    <span class="kick">Your learning path</span>
    <h2>${paid.length + 1} courses, in the <em>right order</em></h2>
    <div class="path">${t.path.map(step).join('')}</div>
  </div></section>

  <section class="band" id="pricing"><div class="wrap">
    <span class="kick">Pricing</span>
    <h2>Pay once. Keep it <em>for good.</em></h2>
    <div class="prices">
      <div class="price best"><span class="flag">Best value · save ${save}%</span><h3>${esc(b.title)}</h3>
        <div class="amt num">${money(b.price)}<small>one-off</small></div>
        <div class="was"><s>${money(sum)}</s><span class="save">${paid.length} courses for the price of ${Math.ceil(b.price / 9.89)}</span></div>
        <ul>${paid.map(c => `<li>${esc(c.title)}</li>`).join('')}<li>Free foundations course</li><li>${paid.length + 1} certificates</li></ul>
        ${buyBtn('block', `Get the track · ${money(b.price)}`)}</div>
      <div class="price"><h3>One course at a time</h3><div class="amt num">£9.89<small>per course</small></div><ul><li>Any single course</li><li>First lesson free to try</li><li>Certificate on passing</li></ul><a class="btn ghost block" href="#path">Choose a course</a></div>
      ${t.team
        ? `<div class="price"><h3>For your team</h3><div class="amt" style="font-size:40px">5+ seats</div><ul><li>Company invoice</li><li>Progress reports for managers</li><li>Optional live workshop</li></ul><a class="btn ghost block" href="mailto:hello@gambitschool.com?subject=${encodeURIComponent('Gambit for my team: ' + b.title)}">Email us about a team</a></div>`
        : `<div class="price"><h3>Start free</h3><div class="amt num">£0</div><ul><li>Think Three Moves Ahead</li><li>10 lessons and a certificate</li><li>No card needed</li></ul><a class="btn ghost block" href="/login.html?next=${encodeURIComponent('lesson.html?c=foundations&l=what-is-a-game')}">Start the free course</a></div>`}
    </div>
  </div></section>

  <section class="band"><div class="wrap">
    <span class="kick">Who it's for</span>
    <h2>Built for <em>you</em> if you are</h2>
    <ul class="who">${t.forYou.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
  </div></section>

  <section class="band"><div class="wrap">
    <span class="kick">Questions</span>
    <h2>Before you <em>buy</em></h2>
    <div class="faq">${t.faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a).replace('hello@gambitschool.com', '<a href="mailto:hello@gambitschool.com">hello@gambitschool.com</a>')}</p></details>`).join('')}</div>
    <p style="margin-top:28px;color:var(--muted)">Also on Gambit:</p>
    <div class="rel" style="margin-top:10px">${others.map(x => `<a href="/for/${x.slug}">${esc(x.eyebrow)}</a>`).join('')}<a href="/courses/">All ${courses.length} courses</a></div>
  </div></section>

  <section class="close"><div class="wrap">
    <h2>${t.close.h}</h2>
    <p>${esc(t.close.p)}</p>
    <div class="ctas">${buyBtn('big', `Get the track · ${money(b.price)}`)}<a class="btn ghost big" href="/lesson.html?c=${first.id}&l=${firstLesson.id}">Play a free lesson</a></div>
  </div></section>
</main>
<footer class="ft"><div class="wrap">Gambit is run by Origin Collective Limited. <a href="/privacy.html">Privacy</a> · <a href="mailto:hello@gambitschool.com">hello@gambitschool.com</a></div></footer>
<div class="sticky"><div><b>${money(b.price)}</b><span>${paid.length} courses · save ${save}%</span></div>${buyBtn('', 'Get the track')}</div>
<script src="/assets/core.js?v=9"></script>
<script src="/assets/bundles.js?v=1"></script>
<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
<script>
(function () {
  G.paintIcons();
  var owned = ${JSON.stringify(b.courses)}.every(function (id) { return G.Store.owns(id); });
  if (G.Store.user) document.getElementById('authBtns').innerHTML = '<a class="btn ghost" href="/app.html">My learning</a>';
  document.querySelectorAll('[data-buy]').forEach(function (el) {
    if (owned) { el.textContent = 'Go to my courses'; el.addEventListener('click', function () { location.href = '/app.html'; }); return; }
    el.addEventListener('click', function () { G.checkoutBundle(el.dataset.buy); });
  });
  // The 30-second demo
  var demo = document.getElementById('demo'), why = document.getElementById('why'), opts = ${JSON.stringify(t.demo.options.map(o => ({ ok: !!o.ok, why: o.why })))};
  demo.querySelectorAll('.opts button').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var o = opts[+btn.dataset.k];
      btn.classList.add(o.ok ? 'good' : 'bad'); why.textContent = o.why;
      if (o.ok) { demo.classList.add('done'); demo.querySelectorAll('.opts button').forEach(function (x) { x.disabled = true; }); }
    });
  });
  // Hero field of chess pieces
  var cv = document.getElementById('field'), ctx = cv.getContext('2d'), types = ['pawn', 'knight', 'bishop', 'rook', 'queen', 'king'], hero = '${t.piece}';
  function draw() {
    var r = cv.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2); cv.width = r.width * dpr; cv.height = r.height * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var cs = getComputedStyle(document.documentElement), ink = cs.getPropertyValue('--ink').trim(), acc = cs.getPropertyValue('--accent').trim();
    var wide = r.width > 760, pts = wide ? [[.80,.32,180,hero,1],[.66,.66,74,'pawn'],[.93,.72,92,'knight'],[.58,.18,54,'bishop'],[.97,.18,60,'queen'],[.72,.9,48,'rook']] : [[.9,.045,52,hero,1]];
    pts.forEach(function (p) {
      var s = p[2], x = r.width * p[0] - s / 2, y = r.height * p[1] - s / 2, c = document.createElement('canvas'); c.width = c.height = s * 2;
      var cx = c.getContext('2d'); cx.scale(s * 2 / 100, s * 2 / 100); cx.fillStyle = p[4] ? acc : ink; G.drawPiece(cx, p[3]);
      ctx.globalAlpha = p[4] ? .95 : .12; ctx.drawImage(c, x, y, s, s);
    });
    ctx.globalAlpha = 1;
  }
  draw(); addEventListener('resize', draw); document.fonts && document.fonts.ready.then(draw);
})();
</script>
</body>
</html>
`;
    fs.writeFileSync(path.join(OUT, 'for', t.slug + '.html'), html);
    urls.push([canonical, [lastmod('tools/track-pages.config.js'), lastmod('tools/build-track-pages.js'), lastmod('assets/bundles.js')].sort().pop()]);
  }
  return urls;
};
