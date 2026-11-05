// Plain-page port of the canvas logic in build.py (LOGIC). Same state, same timings; keep the two in step.
(() => {
  const LEAD = 1.2; // start the next scene this many seconds before a clip ends, so the crossfade overlaps moving footage
  const st = { scene: 0, prev: -1, paused: false, failed: false, menuOpen: false, telOpen: false, dlgTop: 16, away: false, errs: {}, sending: false, done: false, gal: [0, 0], day: 2, faq: {}, copied: false };
  const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches || !!(navigator.connection && navigator.connection.saveData);
  const $ = (s) => document.querySelector(s), $$ = (s) => [...document.querySelectorAll(s)];
  const show = (name, on) => $$(`s-if[data-if="${name}"]`).forEach((x) => { x.hidden = !on; });
  const hole = (name, text) => $$(`[data-hole="${name}"]`).forEach((x) => { x.textContent = text; });
  // 기존 이동 링크는 유지하고, 이미지를 원본 파일에 연결한다.
  $$('.site main img').forEach((image) => {
    if (!image.alt || image.closest('a, button, .hero-media, .s-media')) return;
    const link = document.createElement('a');
    link.className = 's-image-link'; link.href = image.src;
    link.target = '_blank'; link.rel = 'noopener noreferrer';
    link.title = '원본 이미지 보기 (새 창)';
    link.setAttribute('aria-label', [image.alt, link.title].filter(Boolean).join(' · '));
    image.replaceWith(link); link.append(image);
  });
  const hero = $('section.hero');
  let shown = 0, key = '', wasDone = false, wasOpen = false, opener = null, toForm = false, sendTimer = 0;

  const go = (i) => { if (i !== st.scene) set({ prev: st.scene, scene: i }); };
  const next = () => go((st.scene + 1) % 6), back = () => go((st.scene + 5) % 6);
  const set = (patch) => { Object.assign(st, patch); render(); };

  function setDur(v) { if (hero) hero.style.setProperty('--dur', (v.duration ? Math.max(v.duration - LEAD, 1) : 5) + 's'); }
  function sync() {
    const { scene, prev } = st;
    const paused = st.paused || st.away;
    const moved = scene !== shown;
    shown = scene;
    // going back to the previous scene: its layer is already opaque, so the crossfade has to be forced
    const layer = moved && !calm && $$('.hero-layer')[scene];
    if (layer) layer.animate({ opacity: [0, 1] }, { duration: 1600, easing: 'cubic-bezier(0.77, 0, 0.175, 1)' });
    $$('video.h-vid').forEach((v) => {
      const i = Number(v.dataset.i);
      v.muted = true;
      if (!v.getAttribute('src') && (i === scene || i === (scene + 1) % 6)) { v.preload = 'auto'; v.src = v.dataset.src; }
      if (i === scene) {
        if (moved) v.currentTime = 0;
        if (paused) v.pause(); else v.play().catch(() => {});
        setDur(v);
      } else if (i !== prev) v.pause(); // the outgoing clip keeps moving under the crossfade
    });
  }

  function renderHero() {
    const { scene, prev, paused, failed, away } = st;
    const live = !calm && !failed;
    if (!live) $$('video.h-vid').forEach((v) => v.remove());
    hero.className = 'hero' + (live ? ' is-auto' : '') + (paused || away ? ' is-paused' : '');
    $$('.hero-layer').forEach((el, i) => { el.className = 'hero-layer' + (i === scene ? ' is-on' : i === prev ? ' is-prev' : ''); el.setAttribute('aria-hidden', i === scene ? 'false' : 'true'); });
    $$('.hero-seg').forEach((el, i) => { el.className = 'hero-seg' + (i === scene ? ' is-cur' : i < scene ? ' is-done' : ''); el.setAttribute('aria-current', i === scene ? 'true' : 'false'); });
    $$('.hero-name').forEach((el, i) => { el.className = 'hero-name' + (i === scene ? ' is-on' : ''); el.setAttribute('aria-hidden', i === scene ? 'false' : 'true'); });
    show('showCtl', live); show('showStrip', !failed); show('paused', paused); show('playing', !paused);
    const k = [scene, paused, failed, away].join();
    if (k !== key) { key = k; if (live) sync(); }
  }

  function render() {
    if (hero) renderHero();
    const { errs, done, sending, gal, day, faq, copied, menuOpen, telOpen } = st;
    show('menuOpen', menuOpen); show('telOpen', telOpen);
    const dlg = $('.s-dlg'); if (dlg) dlg.style.top = st.dlgTop + 'px';
    show('done', done); show('notDone', !done); show('sending', sending); show('idle', !sending);
    const errN = Object.keys(errs).length;
    show('anyErr', errN > 0); hole('errN', errN); hole('eTelMsg', errs.tel || '');
    show('eWho', !!errs.who); show('eName', !!errs.name); show('eTel', !!errs.tel); show('eHow', !!errs.how); show('eAgree', !!errs.agree);
    [['#f-name', errs.name], ['#f-tel', errs.tel], ['input[name="agree"]', errs.agree]].forEach(([s, on]) => { const f = $(s); if (f) f.setAttribute('aria-invalid', on ? 'true' : 'false'); });
    const send = $('.s-form button[type="submit"]'); if (send) send.disabled = sending;
    $$('.p-gal').forEach((box, g) => {
      [...box.children].forEach((el, i) => { el.className = 'p-slide' + (gal[g] === i ? ' is-on' : ''); el.setAttribute('aria-hidden', gal[g] === i ? 'false' : 'true'); });
      hole('pos' + g, (gal[g] + 1) + ' / 3');
    });
    for (let i = 0; i < 7; i++) show('day' + i, day === i);
    $$('.p-days button').forEach((b, i) => b.setAttribute('aria-pressed', day === i ? 'true' : 'false'));
    $$('.p-q').forEach((b, i) => { b.setAttribute('aria-expanded', faq[i] ? 'true' : 'false'); show('q' + i, !!faq[i]); });
    show('copied', copied); show('notCopied', !copied);
    if (done && !wasDone) { const h = document.getElementById('done-h'); if (h) h.focus(); }
    wasDone = done;
    const open = menuOpen || telOpen;
    if (open !== wasOpen) {
      $$('.s-q').forEach((q) => { q.inert = open; });
      if (open) { opener = document.activeElement; const f = $('.s-sheet button, .s-dlg button'); if (f) f.focus(); }
      else if (opener && !toForm) opener.focus();
      toForm = false;
      wasOpen = open;
    }
  }

  const goForm = () => setTimeout(() => { const f = $('input[name="who"]'); if (f) f.focus({ preventScroll: true }); }, 0);
  const reset = () => { const f = $('.s-form'); if (f) f.reset(); clearTimeout(sendTimer); set({ done: false, errs: {}, sending: false }); };
  function onSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget, d = new FormData(form);
    const digits = String(d.get('ftel') || '').replace(/\D/g, '');
    const errs = {};
    if (!d.get('who')) errs.who = true;
    if (!String(d.get('fname') || '').trim()) errs.name = true;
    if (!digits) errs.tel = '연락처를 적어 주세요. 상담 직원이 이 번호로 연락드려요.';
    else if (digits.length < 9 || digits.length > 11) errs.tel = '연락처 자릿수가 맞지 않아요. 다시 한번 봐 주세요.';
    if (!d.get('how')) errs.how = true;
    if (!d.get('agree')) errs.agree = true;
    set({ errs });
    if (Object.keys(errs).length) {
      const first = errs.who ? 'input[name="who"]' : errs.name ? '#f-name' : errs.tel ? '#f-tel' : errs.how ? 'input[name="how"]' : 'input[name="agree"]';
      requestAnimationFrame(() => { const f = form.querySelector(first); if (f) f.focus(); });
      return;
    }
    set({ sending: true });
    sendTimer = setTimeout(() => set({ sending: false, done: true }), 900);
  }

  const turn = (g, d) => { const n = st.gal.slice(); n[g] = (n[g] + d + 3) % 3; set({ gal: n }); };
  const ACT = {
    back, next, goForm, reset,
    toggle: () => set({ paused: !st.paused }),
    openMenu: () => set({ menuOpen: true }), closeMenu: () => set({ menuOpen: false }),
    // a keyboard click reports no pointer position, so the dialog opens beside the button instead; a tall page needs it kept on screen
    openTel: (e, el) => {
      const y = (e.detail ? e.pageY : el.getBoundingClientRect().top + window.scrollY) - 120, top = window.scrollY;
      set({ telOpen: true });
      set({ dlgTop: Math.max(top + 16, Math.min(y, top + window.innerHeight - $('.s-dlg').offsetHeight - 16)) });
    },
    closeTel: () => set({ telOpen: false }),
    telToForm: () => { toForm = true; set({ telOpen: false }); goForm(); },
    copyAddr: () => { if (navigator.clipboard) navigator.clipboard.writeText('가상시 안뜰구 머묾로 12').catch(() => {}); set({ copied: true }); },
  };
  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-click]');
    if (!el) return;
    const n = el.dataset.click; let m;
    if (ACT[n]) ACT[n](e, el);
    else if ((m = /^p(\d)$/.exec(n))) go(+m[1]);
    else if ((m = /^(prev|next)(\d)$/.exec(n))) turn(+m[2], m[1] === 'prev' ? -1 : 1);
    else if ((m = /^dayGo(\d)$/.exec(n))) set({ day: +m[1] });
    else if ((m = /^qt(\d+)$/.exec(n))) set({ faq: Object.assign({}, st.faq, { [m[1]]: !st.faq[m[1]] }) });
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && (st.menuOpen || st.telOpen)) set({ menuOpen: false, telOpen: false }); });
  const form = $('.s-form'); if (form) form.addEventListener('submit', onSubmit);

  // the huge top margin reveals anything a fast scroll or an anchor jump left above the viewport
  const rvIO = new IntersectionObserver((es) => {
    let n = 0;
    es.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      rvIO.unobserve(el);
      el.style.setProperty('--d', (el.dataset.rv === 't' ? 0 : Math.min(n++, 2) * 30) + 'ms');
      el.classList.add('in');
      setTimeout(() => { el.classList.remove('rv', 'in'); el.classList.add('rv-done'); }, 400); // hands hover and press transitions back to the element
    });
  }, { root: document, rootMargin: '100000px 0px -4% 0px' });
  // Only elements below the fold are ever hidden, so a page without this script shows everything.
  function arm() {
    const fold = window.innerHeight;
    $$('main section').forEach((s) => { if (s.querySelector('[data-rv]')) s.querySelectorAll('.s-head').forEach((h) => h.setAttribute('data-rv', 't')); });
    $$('[data-rv]:not(.rv):not(.rv-done)').forEach((el) => { if (el.getBoundingClientRect().top > fold) { el.classList.add('rv'); rvIO.observe(el); } });
    const line = $('.p-time');
    if (line && document.documentElement.scrollHeight > fold + 4) line.classList.add('is-draw');
  }

  if (hero) {
    new IntersectionObserver(([e]) => set({ away: !e.isIntersecting }), { threshold: 0.2 }).observe(hero);
    hero.addEventListener('keydown', (e) => { if (e.altKey || e.metaKey || e.ctrlKey) return; if (e.key === 'ArrowLeft') back(); else if (e.key === 'ArrowRight') next(); });
    const media = hero.querySelector('.hero-media').parentElement;
    let x0 = null, y0 = 0;
    media.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
    media.addEventListener('touchend', (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
      x0 = null;
      if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy)) (dx < 0 ? next : back)();
    }, { passive: true });
    $$('video.h-vid').forEach((v) => {
      const mine = () => Number(v.dataset.i) === st.scene;
      v.addEventListener('timeupdate', () => { if (!mine() || !v.duration) return; setDur(v); if (v.currentTime >= v.duration - LEAD) next(); });
      v.addEventListener('ended', () => { if (mine()) next(); });
      v.addEventListener('error', () => set({ failed: true }));
    });
  }
  const once = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { once.unobserve(e.target); e.target.src = e.target.dataset.src; e.target.play().catch(() => {}); } }), { threshold: 0.5 });
  if (!calm) $$('video.vid-once').forEach((v) => { v.muted = true; once.observe(v); });
  const sent = $('.s-sent'), bar = $('.s-bar');
  if (sent && bar) new IntersectionObserver(([e]) => bar.classList.toggle('is-stuck', !e.isIntersecting), { root: document }).observe(sent);
  arm();
  window.addEventListener('resize', arm);
  render();
})();
