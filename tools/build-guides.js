// Builds the /guides section from content/guides/*.md: one page per guide, the hub (/guides/) and an RSS feed.
// A guide goes live on its `date`: anything dated after today (UTC, or GUIDES_TODAY=YYYY-MM-DD) is left out of the build
// entirely, and links to it from other guides render as plain text until it's out. The daily scheduled deploy
// (.github/workflows/deploy.yml) is what publishes the next one. Called by build-course-pages.js, which adds the
// returned [url, lastmod] pairs to sitemap.xml. Preview the schedule: node tools/build-guides.js --list
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..'), SRC = path.join(ROOT, 'content/guides'), SITE = 'https://gambitschool.com';
const TODAY = process.env.GUIDES_TODAY || new Date().toISOString().slice(0, 10);
const COURSES = {   // slug -> name, for the course box under each guide
  'game-theory-foundations': 'Game theory foundations (free)', 'strategic-thinking': 'Strategic thinking',
  'negotiation-bargaining-power': 'Negotiation: bargaining power', 'negotiation-psychology': 'Negotiation psychology',
  'negotiation-preparation': 'Negotiation preparation', 'procurement-tender-design': 'Procurement: tender design',
  'supplier-evaluation-total-cost': 'Supplier evaluation and total cost', 'auction-theory': 'Auction theory', 'advanced-auction-design': 'Advanced auction design' };

const esc = s => String(s).replace(/[&<>"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));

// front matter: "key: value" lines between --- fences; repeated faq lines are "question | answer"
function parse(file) {
  const raw = fs.readFileSync(file, 'utf8'), m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) throw new Error('No front matter in ' + file);
  const g = { slug: path.basename(file, '.md'), faq: [], body: m[2].trim() };
  for (const line of m[1].split('\n')) { const i = line.indexOf(':'); if (i < 0) continue; const k = line.slice(0, i).trim(), v = line.slice(i + 1).trim();
    if (k === 'faq') { const [q, a] = v.split(' | '); g.faq.push({ q, a }); } else g[k] = v; }
  for (const k of ['title', 'seo_title', 'description', 'date', 'category']) if (!g[k]) throw new Error(`${file}: missing ${k}`);
  if (g.seo_title.length > 65) throw new Error(`${file}: seo_title over 65 characters`);
  if (g.description.length > 160) throw new Error(`${file}: description over 160 characters`);
  g.related = (g.related || '').split(',').map(s => s.trim()).filter(Boolean);
  g.words = g.body.split(/\s+/).length; g.minutes = Math.max(2, Math.round(g.words / 230));
  return g;
}
const all = fs.existsSync(SRC) ? fs.readdirSync(SRC).filter(f => f.endsWith('.md')).map(f => parse(path.join(SRC, f))).sort((a, b) => a.date.localeCompare(b.date)) : [];
const live = all.filter(g => g.date <= TODAY), liveSet = new Set(live.map(g => g.slug));

// a small markdown renderer: ## and ### headings, paragraphs, - and 1. lists, > quotes, **bold**, *italic*, [links](/x)
function inline(s) {
  return esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, text, href) => {
      const gm = href.match(/^\/guides\/([a-z0-9-]+)$/); if (gm && !liveSet.has(gm[1])) return text;   // not out yet
      return `<a href="${href}"${/^https?:/.test(href) ? ' rel="noopener"' : ''}>${text}</a>`; });
}
function md(src) {
  const out = []; let list = null, para = [], quote = null;
  const flush = () => { if (para.length) { out.push(`<p>${inline(para.join(' '))}</p>`); para = []; } if (list) { out.push(`<${list.t}>${list.items.map(i => `<li>${inline(i)}</li>`).join('')}</${list.t}>`); list = null; }
    if (quote) { out.push(`<blockquote>${quote.join('\n').split(/\n\s*\n/).map(p => `<p>${p.split('\n').map(inline).join('<br>')}</p>`).join('')}</blockquote>`); quote = null; } };
  for (const line of src.split('\n')) {
    let m;
    // consecutive > lines are one quote (an email, a script); a bare > is a paragraph break inside it
    if ((m = line.match(/^>(?: (.*))?$/))) { if (!quote) { flush(); quote = []; } quote.push(m[1] || ''); continue; }
    if (quote) flush();
    if (!line.trim()) { flush(); continue; }
    if ((m = line.match(/^(#{2,3}) (.+)/))) { flush(); const id = m[2].toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); out.push(`<h${m[1].length} id="${id}">${inline(m[2])}</h${m[1].length}>`); continue; }
    if ((m = line.match(/^(-|\d+\.) (.+)/))) { if (para.length) { out.push(`<p>${inline(para.join(' '))}</p>`); para = []; } const t = m[1] === '-' ? 'ul' : 'ol'; if (!list || list.t !== t) { flush(); list = { t, items: [] }; } list.items.push(m[2]); continue; }
    if (list) flush();
    para.push(line.trim());
  }
  flush(); return out.join('\n');
}
const nice = d => new Date(d + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
const url = g => `${SITE}/guides/${g.slug}`;

const FONTS = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300..600;1,6..72,300..500&family=Geist:wght@400;500&family=Geist+Mono:wght@400;500&display=swap">';
const STYLE = `<style>
  main { padding-block: 36px 96px; }
  .crumbs { display: flex; flex-wrap: wrap; gap: 8px; color: var(--muted); font-size: 14px; margin-bottom: 28px; list-style: none; padding: 0; }
  .crumbs li + li::before { content: "/"; margin-right: 8px; opacity: .6; }
  .art { max-width: 720px; }
  .art h1 { font-size: clamp(36px, 5vw, 56px); line-height: 1.04; letter-spacing: -.035em; }
  .art .lead { font: 350 21px/1.45 var(--font-display); color: var(--muted); margin-top: 16px; }
  .art .meta { margin: 18px 0 30px; color: var(--muted); font: 400 13px var(--font-mono); letter-spacing: .04em; text-transform: uppercase; }
  .art .body p, .art .body li { font: 350 19px/1.65 var(--font-display); }
  .art .body p + p { margin-top: 14px; }
  .art .body h2 { font-size: 30px; letter-spacing: -.015em; margin: 40px 0 12px; }
  .art .body h3 { font-size: 22px; margin: 28px 0 8px; }
  .art .body ul, .art .body ol { padding-left: 22px; margin: 12px 0; display: grid; gap: 8px; }
  .art .body blockquote { border-left: 3px solid var(--accent); padding: 4px 0 4px 18px; margin: 18px 0; }
  .art .body blockquote p { font: 400 19px/1.55 var(--font-display); font-style: italic; }
  .art .body a, .faq a { text-decoration: underline; text-underline-offset: 3px; }
  .cta { margin: 40px 0; border: 1px solid var(--line-strong); border-radius: 12px; background: var(--surface); padding: 24px; display: grid; gap: 10px; }
  .cta b { font: 400 24px/1.2 var(--font-display); }
  .cta p { color: var(--muted); font-size: 15px; }
  .cta .row { display: flex; gap: 10px; flex-wrap: wrap; }
  .faq { display: grid; gap: 8px; margin-top: 12px; }
  .faq details { border: 1px solid var(--line); border-radius: 10px; padding: 14px 16px; background: var(--surface); }
  .faq summary { cursor: pointer; font-weight: 500; }
  .faq details p { margin-top: 10px; color: var(--muted); font-size: 15px; line-height: 1.55; }
  .rel { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 10px; margin-top: 12px; }
  .rel a { border: 1px solid var(--line); border-radius: 10px; padding: 14px 16px; display: grid; gap: 4px; background: var(--surface); }
  .rel a:hover, .gl a:hover { border-color: var(--ink); }
  .rel b, .gl b { font: 400 19px/1.25 var(--font-display); }
  .rel span, .gl span { font-size: 13px; color: var(--muted); }
  .share { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 28px; }
  .tabs { display: flex; gap: 8px; margin: 26px 0 8px; flex-wrap: wrap; }
  .tabs button { border: 1px solid var(--line-strong); background: transparent; border-radius: 999px; padding: 7px 14px; font: inherit; font-size: 14px; cursor: pointer; color: var(--ink); }
  .tabs button[aria-pressed="true"] { background: var(--ink); color: var(--bg); }
  .gl { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 12px; margin-top: 18px; }
  .gl a { border: 1px solid var(--line-strong); border-radius: 12px; padding: 20px; display: grid; gap: 8px; align-content: start; background: var(--surface); }
  .topbar-in nav a { color: var(--muted); font-size: 14px; padding: 7px 13px; }
  .topbar-in nav a:hover { color: var(--ink); }
  @media (max-width: 420px) { .hide-sm { display: none !important; } }
</style>`;

function head({ title, description, canonical, jsonld, type = 'article', published }) {
  return `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${canonical}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta property="og:type" content="${type}">
<meta property="og:site_name" content="Gambit">
<meta property="og:locale" content="en_GB">
<meta property="og:url" content="${canonical}">
<meta property="og:title" content="${esc(title.replace(/ \| Gambit$/, ''))}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:image" content="${SITE}/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
${published ? `<meta property="article:published_time" content="${published}">` : ''}
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="alternate" type="application/rss+xml" title="Gambit guides" href="${SITE}/guides/feed.xml">
${FONTS}
<link rel="stylesheet" href="/assets/app.css?v=6">
${STYLE}
${jsonld.map(j => `<script type="application/ld+json">${JSON.stringify(j)}</script>`).join('\n')}
</head>`;
}
const topbar = next => `<header class="topbar"><div class="wrap topbar-in">
  <a class="brand" href="/"><canvas class="piece-icon" data-piece="knight" aria-hidden="true"></canvas>Gambit</a>
  <nav aria-label="Site" class="hide-sm"><a href="/courses/">Courses</a><a href="/guides/">Guides</a></nav>
  <div style="display:flex;gap:8px" id="authBtns"><a class="btn ghost hide-sm" href="/login.html?next=${encodeURIComponent(next)}">Sign in</a><a class="btn solid" href="/free">Start free</a></div>
</div></header>`;
const SCRIPTS = `<script src="/assets/core.js?v=10"></script>
<script>G.paintIcons(); if (G.Store.user) document.getElementById('authBtns').innerHTML = '<a class="btn solid" href="/app.html">My learning</a>';</script>`;
const PUBLISHER = { '@type': 'Organization', name: 'Gambit', url: SITE + '/', logo: { '@type': 'ImageObject', url: SITE + '/icon-512.png' } };

function guidePage(g) {
  const canonical = url(g), related = g.related.filter(s => liveSet.has(s)).map(s => live.find(x => x.slug === s));
  for (const x of live.filter(x => x.category === g.category && x.slug !== g.slug).reverse()) { if (related.length >= 3) break; if (!related.includes(x)) related.push(x); }
  const jsonld = [
    { '@context': 'https://schema.org', '@type': 'Article', headline: g.title, description: g.description, datePublished: g.date, dateModified: g.updated || g.date,
      author: { '@type': 'Organization', name: 'Gambit', url: SITE + '/' }, publisher: PUBLISHER, image: SITE + '/og-image.png', mainEntityOfPage: canonical,
      articleSection: g.category, wordCount: g.words, inLanguage: 'en-GB' },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Gambit', item: SITE + '/' }, { '@type': 'ListItem', position: 2, name: 'Guides', item: SITE + '/guides/' },
      { '@type': 'ListItem', position: 3, name: g.title, item: canonical }] }];
  if (g.faq.length) jsonld.push({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: g.faq.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) });
  const course = g.course && COURSES[g.course];
  const share = encodeURIComponent(canonical), stext = encodeURIComponent(g.title);
  return `${head({ title: g.seo_title + ' | Gambit', description: g.description, canonical, jsonld, published: g.date })}
<body>
${topbar('/guides/' + g.slug)}
<main class="wrap">
  <ol class="crumbs" aria-label="Breadcrumb"><li><a href="/">Gambit</a></li><li><a href="/guides/">Guides</a></li><li aria-current="page">${esc(g.category)}</li></ol>
  <article class="art">
    <h1>${esc(g.title)}</h1>
    <p class="lead">${esc(g.description)}</p>
    <p class="meta">${esc(g.category)} · <time datetime="${g.date}">${nice(g.date)}</time> · ${g.minutes} min read</p>
    <div class="body">${md(g.body)}</div>
    <aside class="cta"><b>Play it, don't just read it</b><p>Gambit's free course, Think Three Moves Ahead, turns ideas like this into games you play in your browser: 10 short lessons and a certificate.${course && g.course !== 'game-theory-foundations' ? ` To go further, see the <a href="/courses/${g.course}" style="text-decoration:underline">${esc(course)}</a> course.` : ''}</p>
      <div class="row"><a class="btn solid" href="/free?utm_source=guides&utm_medium=article&utm_campaign=${g.slug}">Start the free course</a></div></aside>
    ${g.faq.length ? `<section aria-labelledby="faq"><h2 id="faq" style="font-size:30px;letter-spacing:-.015em">Questions people ask</h2><div class="faq">${g.faq.map(f => `<details><summary>${esc(f.q)}</summary><p>${inline(f.a)}</p></details>`).join('')}</div></section>` : ''}
    <div class="share"><a class="btn ghost" href="https://www.linkedin.com/sharing/share-offsite/?url=${share}" rel="noopener" target="_blank">Share on LinkedIn</a><a class="btn ghost" href="https://x.com/intent/post?url=${share}&text=${stext}" rel="noopener" target="_blank">Share on X</a><a class="btn ghost" href="https://wa.me/?text=${stext}%20${share}" rel="noopener" target="_blank">WhatsApp</a></div>
    ${related.length ? `<section aria-labelledby="more" style="margin-top:40px"><h2 id="more" style="font-size:26px">Keep reading</h2><div class="rel">${related.map(r => `<a href="/guides/${r.slug}"><span>${esc(r.category)}</span><b>${esc(r.title)}</b></a>`).join('')}</div></section>` : ''}
  </article>
</main>
${SCRIPTS}
</body>
</html>
`;
}

function hubPage() {
  const canonical = SITE + '/guides/', list = live.slice().reverse();
  const jsonld = [{ '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Negotiation and game theory guides', url: canonical, publisher: PUBLISHER,
    mainEntity: { '@type': 'ItemList', itemListElement: list.map((g, i) => ({ '@type': 'ListItem', position: i + 1, url: url(g), name: g.title })) } },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Gambit', item: SITE + '/' }, { '@type': 'ListItem', position: 2, name: 'Guides', item: canonical }] }];
  const cats = [...new Set(list.map(g => g.category))];
  return `${head({ title: 'Negotiation and Game Theory Guides | Gambit', description: 'Free, plain-English guides to negotiation and game theory: BATNA, anchoring, the prisoner\'s dilemma, Nash equilibrium, salary talks and more. A new one every day.', canonical, jsonld, type: 'website' })}
<body>
${topbar('/guides/')}
<main class="wrap">
  <ol class="crumbs" aria-label="Breadcrumb"><li><a href="/">Gambit</a></li><li aria-current="page">Guides</li></ol>
  <div class="art"><h1>Negotiation and game theory, in plain English</h1>
  <p class="lead">Short guides to the ideas that decide deals, pay rises and everyday choices, with real examples and no maths needed. A new guide every day.</p></div>
  <div class="tabs" role="group" aria-label="Filter guides"><button type="button" aria-pressed="true" data-c="">All</button>${cats.map(c => `<button type="button" aria-pressed="false" data-c="${esc(c)}">${esc(c)}</button>`).join('')}</div>
  <div class="gl">${list.map(g => `<a href="/guides/${g.slug}" data-c="${esc(g.category)}"><span>${esc(g.category)} · ${g.minutes} min</span><b>${esc(g.title)}</b><span>${esc(g.description)}</span></a>`).join('')}</div>
</main>
${SCRIPTS}
<script>document.querySelectorAll('.tabs button').forEach(b => b.onclick = () => { document.querySelectorAll('.tabs button').forEach(x => x.setAttribute('aria-pressed', x === b)); document.querySelectorAll('.gl a').forEach(a => a.hidden = b.dataset.c && a.dataset.c !== b.dataset.c); });</script>
</body>
</html>
`;
}

function feed() {
  const items = live.slice().reverse().slice(0, 30).map(g => `<item><title>${esc(g.title)}</title><link>${url(g)}</link><guid>${url(g)}</guid><pubDate>${new Date(g.date + 'T06:00:00Z').toUTCString()}</pubDate><description>${esc(g.description)}</description><category>${esc(g.category)}</category></item>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel><title>Gambit guides</title><link>${SITE}/guides/</link><description>Negotiation and game theory, in plain English.</description><language>en-gb</language>\n${items}\n</channel></rss>\n`;
}

module.exports = function build(OUT) {
  if (!live.length) return [];
  fs.mkdirSync(path.join(OUT, 'guides'), { recursive: true });
  for (const g of live) fs.writeFileSync(path.join(OUT, 'guides', g.slug + '.html'), guidePage(g));
  fs.writeFileSync(path.join(OUT, 'guides', 'index.html'), hubPage());
  fs.writeFileSync(path.join(OUT, 'guides', 'feed.xml'), feed());
  console.log(`Built ${live.length} of ${all.length} guides (next: ${all.find(g => g.date > TODAY)?.date || 'none queued'})`);
  return [[SITE + '/guides/', live[live.length - 1].date], ...live.map(g => [url(g), g.updated || g.date])];
};

if (require.main === module) {
  if (process.argv.includes('--list')) { for (const g of all) console.log(`${g.date}  ${g.date <= TODAY ? 'live ' : 'queued'}  ${g.category.padEnd(12)} ${String(g.words).padStart(5)}w  ${g.slug}`); console.log(`${all.length} guides, ${live.length} live, last ${all.at(-1)?.date}`); }
  else module.exports(process.argv[2] || path.join(ROOT, 'dist'));
}
