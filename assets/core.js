/* Gambit core: chess piece drawing, browser-only prototype store, shared header and helpers.
   Prototype note: accounts, purchases and progress live in this browser's localStorage.
   Passwords are never stored. A production build replaces Store with a real backend. */
(() => {
  const TAU = Math.PI * 2;

  /* ---------- Chess piece silhouettes in a 100x100 box ---------- */
  function rr(c, x, y, w, h, r) {
    c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r);
    c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath();
  }
  const F = (c, fn) => { c.beginPath(); fn(); c.fill(); };
  const ell = (c, x, y, rx, ry) => F(c, () => c.ellipse(x, y, rx, ry, 0, 0, TAU));
  const poly = (c, pts) => F(c, () => { c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]); c.closePath(); });
  const cut = (c, fn) => { c.save(); c.globalCompositeOperation = 'destination-out'; fn(); c.restore(); };

  function drawPiece(c, type) {
    F(c, () => rr(c, 23, 84, 54, 11, 3));
    F(c, () => rr(c, 29, 77.5, 42, 8, 2.5));
    switch (type) {
      case 'pawn':
        poly(c, [[36, 79], [43.5, 55], [56.5, 55], [64, 79]]); ell(c, 50, 54, 15, 4.2); ell(c, 50, 38, 13.5, 13.5); break;
      case 'rook':
        poly(c, [[33, 79], [37.5, 44], [62.5, 44], [67, 79]]); ell(c, 50, 44, 18.5, 3.6);
        F(c, () => rr(c, 30, 22, 40, 22, 2));
        cut(c, () => { c.fillRect(39, 19, 7, 10); c.fillRect(54, 19, 7, 10); }); break;
      case 'bishop':
        poly(c, [[35, 79], [43, 57], [57, 57], [65, 79]]); ell(c, 50, 56.5, 14.5, 4);
        F(c, () => { c.moveTo(50, 17); c.bezierCurveTo(67, 28, 67, 45, 58.5, 53); c.lineTo(41.5, 53); c.bezierCurveTo(33, 45, 33, 28, 50, 17); });
        ell(c, 50, 14, 4.6, 4.6);
        cut(c, () => { c.lineWidth = 3.6; c.lineCap = 'round'; c.beginPath(); c.moveTo(56, 27); c.lineTo(47.5, 40); c.stroke(); }); break;
      case 'queen':
        poly(c, [[33, 79], [42, 48], [58, 48], [67, 79]]); ell(c, 50, 48, 15.5, 4.2);
        poly(c, [[36, 47], [29.5, 24], [40.5, 36], [44.5, 19], [50, 34], [55.5, 19], [59.5, 36], [70.5, 24], [64, 47]]);
        [[29.5, 22.5], [44.5, 17.5], [55.5, 17.5], [70.5, 22.5]].forEach(([x, y]) => ell(c, x, y, 3.8, 3.8)); break;
      case 'king':
        poly(c, [[33, 79], [42, 48], [58, 48], [67, 79]]); ell(c, 50, 48, 15.5, 4.2);
        F(c, () => { c.moveTo(35.5, 47); c.bezierCurveTo(28, 34, 35, 25, 50, 27.5); c.bezierCurveTo(65, 25, 72, 34, 64.5, 47); c.closePath(); });
        F(c, () => { c.rect(47.4, 6, 5.2, 22); c.rect(41.5, 11.5, 17, 5.2); }); break;
      case 'knight': {
        const p = [[67, 79], [65, 64], [68, 52], [71, 40], [67, 28], [59, 19.5], [57, 9], [51, 16], [45, 16.5], [35.5, 22.5], [27, 33], [20, 44], [22.5, 51.5], [30, 53.5], [38.5, 48.5], [44, 49.5], [38, 60], [34, 70], [33, 79]];
        const m = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
        F(c, () => {
          const s = m(p[p.length - 1], p[0]); c.moveTo(s[0], s[1]);
          for (let i = 0; i < p.length; i++) { const n = p[(i + 1) % p.length], q = m(p[i], n); c.quadraticCurveTo(p[i][0], p[i][1], q[0], q[1]); }
          c.closePath();
        });
        cut(c, () => { c.beginPath(); c.ellipse(46, 29, 2.7, 2.7, 0, 0, TAU); c.fill(); });
        break;
      }
    }
  }
  const cssVar = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  function paintIcons(root = document) {
    root.querySelectorAll('canvas.piece-icon').forEach(cv => {
      const px = Math.round((cv.clientWidth || 40) * Math.min(devicePixelRatio || 1, 2));
      cv.width = cv.height = px;
      const c = cv.getContext('2d'); c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, px, px);
      c.scale(px / 100, px / 100); c.fillStyle = cssVar(cv.dataset.tone === 'accent' ? '--accent' : cv.dataset.tone === 'card' ? '--card-fg' : '--ink');
      drawPiece(c, cv.dataset.piece);
    });
  }
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => paintIcons());

  /* ---------- Settings ---------- */
  // The foundations course is free (course.free); every other course is a one-off purchase.
  const money = n => '£' + Number(n).toFixed(2);
  // Sign-ups go to the Cloudflare Pages function. Same origin on Cloudflare, absolute URL elsewhere (GitHub Pages, localhost).
  const API = /(^|\.)gambitschool\.com$|\.pages\.dev$/.test(location.hostname) ? '' : 'https://gambitschool.com';
  async function register(user) {
    const res = await fetch(API + '/api/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(user) });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(body.error || 'Something went wrong. Try again in a moment.');
    return body;
  }
  async function api(path, opts) {
    const res = await fetch(API + path, opts);
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(body.error || 'Something went wrong. Try again in a moment.');
    return body;
  }

  /* ---------- Local store (progress lives on this device for now) ---------- */
  const KEY = 'gambit.v1';
  const blank = () => ({ session: null, purchases: [], progress: {}, exams: {} });
  function load() { try { return Object.assign(blank(), JSON.parse(localStorage.getItem(KEY)) || {}); } catch { return blank(); } }
  function save(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* storage blocked: session lasts for this page only */ } }
  let state = load();
  const Store = {
    get user() { return state.session; },
    signIn(user) { state.session = user; save(state); },
    signOut() { state.session = null; save(state); },
    owns(courseId) {
      const c = (window.COURSES || []).find(x => x.id === courseId);
      if (c && c.free) return true;
      return state.purchases.includes(courseId);
    },
    buy(courseId) { if (!state.purchases.includes(courseId)) state.purchases.push(courseId); save(state); },
    addPurchases(ids) { (ids || []).forEach(id => { if (!state.purchases.includes(id)) state.purchases.push(id); }); save(state); },
    isDone(courseId, lessonId) { return !!(state.progress[courseId] || {})[lessonId]; },
    complete(courseId, lessonId) { (state.progress[courseId] ||= {})[lessonId] = Date.now(); save(state); },
    exam(courseId) { return state.exams[courseId] || null; },
    recordExam(courseId, score, total, passed) {
      const prev = state.exams[courseId];
      const certId = prev && prev.certId ? prev.certId : 'GMB-' + courseId.slice(0, 3).toUpperCase() + '-' + Math.random().toString(36).slice(2, 6).toUpperCase() + '-' + Date.now().toString(36).slice(-4).toUpperCase();
      if (prev && prev.passed && !passed) return prev; // a failed retake never removes a pass
      state.exams[courseId] = { score, total, passed, date: Date.now(), certId: passed ? certId : null };
      save(state); return state.exams[courseId];
    },
    reset() { state = blank(); save(state); }
  };

  /* ---------- Course helpers ---------- */
  const lessonsOf = course => course.modules.flatMap(m => m.lessons);
  const playable = l => Array.isArray(l.steps) && l.steps.length > 0;
  function courseProgress(course) {
    const ls = lessonsOf(course).filter(playable);
    const done = ls.filter(l => Store.isDone(course.id, l.id)).length;
    return { done, total: ls.length, pct: ls.length ? done / ls.length : 0, next: ls.find(l => !Store.isDone(course.id, l.id)) || null };
  }
  const canOpen = (course, lesson) => playable(lesson) && (lesson.preview || Store.owns(course.id));

  /* ---------- Page helpers ---------- */
  const qs = k => new URLSearchParams(location.search).get(k);
  // Only ever send people on to one of our own pages (blocks javascript: and off-site redirects).
  const safeNext = (n, fallback = 'app.html') => /^[a-z-]+(\.html)?(\?[\w=&%.-]*)?$/.test(n || '') ? n : fallback;
  const esc = s => String(s).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const initials = name => (name || '?').trim().split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase();
  function toast(msg) {
    document.querySelectorAll('.toast').forEach(t => t.remove());
    const t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); t.textContent = msg;
    document.body.appendChild(t); setTimeout(() => t.remove(), 3200);
  }
  function requireUser() {
    if (!Store.user) { location.replace('login.html?next=' + encodeURIComponent(location.pathname.split('/').pop() + location.search)); return false; }
    return true;
  }
  function header(active) {
    const u = Store.user;
    const el = document.createElement('header'); el.className = 'topbar';
    if (!u) {
      const back = encodeURIComponent(location.pathname.split('/').pop() + location.search);
      el.innerHTML = `<div class="wrap topbar-in">
        <a class="brand" href="index.html"><canvas class="piece-icon" data-piece="knight" aria-hidden="true"></canvas>Gambit</a>
        <nav class="tabs" aria-label="Site"><a href="index.html#tracks" ${active === 'catalogue' ? 'aria-current="page"' : ''}>All courses</a></nav>
        <div style="display:flex;gap:8px"><a class="btn ghost hide-sm" href="login.html?next=${back}">Sign in</a><a class="btn solid" href="login.html?next=${back}">Start free</a></div></div>`;
      document.body.prepend(el); paintIcons(el); return;
    }
    el.innerHTML = `<div class="wrap topbar-in">
      <a class="brand" href="app.html"><canvas class="piece-icon" data-piece="knight" aria-hidden="true"></canvas>Gambit</a>
      <nav class="tabs" aria-label="App">
        <a href="app.html#learning" ${active === 'learning' ? 'aria-current="page"' : ''}>My learning</a>
        <a href="app.html#catalogue" ${active === 'catalogue' ? 'aria-current="page"' : ''}>Courses</a>
        <a href="app.html#certificates" ${active === 'certificates' ? 'aria-current="page"' : ''}>Certificates</a>
      </nav>
      <div class="user">
        <button class="avatar" id="avatarBtn" aria-haspopup="menu" aria-expanded="false" aria-label="Account">${esc(initials(u && u.name))}</button>
        <div class="menu" id="userMenu" role="menu" hidden>
          <div class="who"><strong>${esc(u ? u.name : '')}</strong><span>${esc(u ? u.email : '')}</span></div>
          <a href="index.html" role="menuitem">Gambit home</a>
          <button id="signOutBtn" role="menuitem">Sign out</button>
        </div>
      </div></div>`;
    document.body.prepend(el);
    const btn = el.querySelector('#avatarBtn'), menu = el.querySelector('#userMenu');
    btn.addEventListener('click', e => { e.stopPropagation(); menu.hidden = !menu.hidden; btn.setAttribute('aria-expanded', String(!menu.hidden)); });
    document.addEventListener('click', e => { if (!menu.contains(e.target)) { menu.hidden = true; btn.setAttribute('aria-expanded', 'false'); } });
    el.querySelector('#signOutBtn').addEventListener('click', () => { Store.signOut(); location.href = 'login.html'; });
    paintIcons(el);
  }

  function checkout(course, onDone) {
    const s = document.createElement('div'); s.className = 'scrim';
    s.innerHTML = `<div class="modal" role="dialog" aria-modal="true" aria-labelledby="coTitle">
      <span class="mono">Checkout</span>
      <h2 id="coTitle">${esc(course.title)}</h2>
      <ul class="lines">
        <li>${lessonsOf(course).length} interactive lessons, yours to keep</li>
        <li>Final assessment, retake as often as you like</li>
        <li>Certificate of completion with a verification ID</li>
      </ul>
      <div class="total"><span>One-off payment</span><b class="num">${money(course.price)}</b></div>
      <p class="note" id="coNote">Secure card payment by Stripe. You'll come straight back to the course.</p>
      <div style="display:grid;gap:10px" id="coBtns">
        <button class="btn solid block" id="coPay">Pay ${money(course.price)}</button>
        <button class="btn ghost block" id="coCancel">Not now</button>
      </div></div>`;
    document.body.appendChild(s);
    const close = () => s.remove();
    s.addEventListener('click', e => { if (e.target === s) close(); });
    document.addEventListener('keydown', function k(e) { if (e.key === 'Escape') { close(); document.removeEventListener('keydown', k); } });
    s.querySelector('#coCancel').addEventListener('click', close);
    const pay = s.querySelector('#coPay');
    pay.addEventListener('click', async () => {
      const u = Store.user; if (!u) { location.href = 'login.html'; return; }
      pay.disabled = true; pay.textContent = 'Opening secure checkout…';
      try {
        const base = location.href.replace(/[^/]*$/, '');
        const r = await api('/api/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ course: course.id, email: u.email, base }) });
        if (r.url) { location.href = r.url; return; }
        s.querySelector('#coNote').textContent = `Card payments open in the next few days. We've noted that you want this course and will email ${u.email} as soon as you can buy it.`;
        s.querySelector('#coBtns').innerHTML = '<button class="btn solid block" id="coOk">OK</button>';
        s.querySelector('#coOk').addEventListener('click', close);
      } catch (err) {
        pay.disabled = false; pay.textContent = `Pay ${money(course.price)}`;
        s.querySelector('#coNote').textContent = err instanceof TypeError ? 'We couldn\'t reach Gambit. Check your connection and try again.' : err.message;
      }
    });
    pay.focus();
  }

  // After Stripe sends the buyer back: ?session_id=cs_... on the course page.
  async function confirmPayment(onDone) {
    const id = qs('session_id'); if (!id) return;
    history.replaceState(null, '', location.pathname + '?c=' + encodeURIComponent(qs('c') || ''));
    try {
      const r = await api('/api/confirm?session_id=' + encodeURIComponent(id));
      Store.buy(r.course);
      const c = (window.COURSES || []).find(x => x.id === r.course);
      toast((c ? c.title : 'Course') + ' unlocked. Thanks for buying.');
      onDone && onDone();
    } catch (err) { toast(err.message + ' If you were charged, email hello@gambitschool.com.'); }
  }

  window.G = { safeNext, money, api, confirmPayment, register, drawPiece, paintIcons, Store, lessonsOf, playable, courseProgress, canOpen, qs, esc, toast, requireUser, header, checkout, initials };
})();
