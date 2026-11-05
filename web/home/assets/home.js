// 메인 홈 스크립트. 설명 창, 툴팁, 탭과 거름, 아트보드 크게 보기, 목차 표시, 흐름도 그리기.
// 문장은 모두 생성기가 HTML에 넣어 둔다. 이 파일에는 주석 밖에 한글이 없다.
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  document.documentElement.classList.add('js');

  // ---- 가두는 포커스(창 안에서만 Tab이 돈다) ----
  const FOCUSABLE = 'button:not([disabled]),a[href],input:not([disabled]),select,textarea,summary,[tabindex="0"]';
  function trap(dlg) {
    dlg.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      const f = $$(FOCUSABLE, dlg).filter((el) => el.offsetParent !== null || el === document.activeElement);
      if (!f.length) { e.preventDefault(); return; }
      const first = f[0], last = f.at(-1), a = document.activeElement;
      if (e.shiftKey && (a === first || !dlg.contains(a) || a === dlg || a.id === 'hm-t')) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && a === last) { e.preventDefault(); first.focus(); }
    });
  }

  // ---- 아키텍처 페이지 탭 묶음: 스크립트가 없으면 패널이 모두 펼쳐져 있다 ----
  for (const set of $$('[data-tabset]')) {
    const ts = $$('[role="tab"]', set);
    const pick = (t, focus) => {
      for (const x of ts) {
        const on = x === t;
        x.setAttribute('aria-selected', String(on)); x.tabIndex = on ? 0 : -1;
        document.getElementById(x.getAttribute('aria-controls')).hidden = !on;
      }
      if (focus) t.focus();
    };
    ts.forEach((t, i) => {
      t.addEventListener('click', () => pick(t));
      t.addEventListener('keydown', (e) => {
        const k = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
        if (k) { e.preventDefault(); pick(ts[(i + k + ts.length) % ts.length], true); }
        if (e.key === 'Home') { e.preventDefault(); pick(ts[0], true); }
        if (e.key === 'End') { e.preventDefault(); pick(ts.at(-1), true); }
      });
    });
    pick(ts[0]);
  }

  // ---- 설명 창 ----
  const hm = $('#hm');
  let opener = null;
  if (hm) {
    trap(hm);
    const title = $('#hm-t'), body = $('.hm-body', hm);
    title.tabIndex = -1;
    const open = (id, from) => {
      const t = document.getElementById(id);
      if (!t) return;
      opener = from || document.activeElement;
      title.textContent = t.dataset.title || '';
      body.replaceChildren(t.content.cloneNode(true));
      hideTip();
      if (!hm.open) hm.showModal();
      body.scrollTop = 0;
      title.focus();
    };
    // 다른 스크립트(제작 히스토리)가 만든 내용을 같은 설명 창에 연다
    window.hmOpen = (t, node, from) => {
      opener = from || document.activeElement;
      title.textContent = t || '';
      body.replaceChildren(node);
      hideTip();
      if (!hm.open) hm.showModal();
      body.scrollTop = 0;
      title.focus();
    };
    hm.addEventListener('close', () => { const o = opener; opener = null; if (o && document.contains(o)) o.focus(); });
    hm.addEventListener('click', (e) => { if (e.target === hm || e.target.closest('[data-hm-close]')) hm.close(); });
    document.addEventListener('click', (e) => {
      const b = e.target.closest('[data-modal]');
      if (b) { e.preventDefault(); open(b.dataset.modal, b); }
    });
  }

  // ---- 툴팁: 마우스와 키보드 포커스에서 열고 Esc로 닫는다. 터치에서는 누르면 창이 열린다 ----
  const tip = $('#tip');
  let timer = 0, anchor = null, helpUi = null;
  // 공통 상단 영역의 설명은 tip.키 모양이라 설명 층 문구에서 읽는다. 내 설명은 글자 그대로다.
  const tipText = (v) => (/^tip\./.test(v) ? (helpUi?.[v] ?? '') : v);
  const canHover = matchMedia('(hover: hover) and (pointer: fine)');
  function place(el) {
    const r = el.getBoundingClientRect(), w = tip.offsetWidth, h = tip.offsetHeight;
    const x = Math.max(8, Math.min(r.left + r.width / 2 - w / 2, innerWidth - w - 8));
    const below = r.bottom + 8, y = below + h > innerHeight - 8 ? r.top - h - 8 : below;
    tip.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`;
  }
  function showTip(el, now) {
    clearTimeout(timer);
    const text = tipText(el.dataset.tip);
    if (!text) return;
    const go = () => { tip.textContent = text; tip.hidden = false; anchor = el; el.setAttribute('aria-describedby', 'tip'); place(el); };
    if (now) go(); else timer = setTimeout(go, 250);
  }
  function hideTip() {
    clearTimeout(timer);
    if (!tip || tip.hidden) return;
    tip.hidden = true; anchor?.removeAttribute('aria-describedby'); anchor = null;
  }
  if (tip) {
    document.addEventListener('mouseover', (e) => { const el = e.target.closest?.('[data-tip]'); if (el && canHover.matches) showTip(el); });
    document.addEventListener('mouseout', (e) => { if (e.target.closest?.('[data-tip]')) hideTip(); });
    document.addEventListener('focusin', (e) => { const el = e.target.closest?.('[data-tip]'); if (el && e.target.matches(':focus-visible')) showTip(el, true); });
    document.addEventListener('focusout', hideTip);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') hideTip(); });
    document.addEventListener('scroll', hideTip, true);
  }

  // ---- 공통 상단 영역 ----
  const bar = $('#topbar');
  if (bar) {
    const base = bar.dataset.base || '';
    fetch(base + 'strings/help.json').then((r) => r.json()).then((h) => { helpUi = h.ui; }).catch(() => {});
    import(new URL(base + 'shared/topbar.js', location.href).href).then((m) => m.mountTopbar(bar, { base })).catch((e) => console.error(e));
  }

  // ---- 좁은 폭에서 위쪽 메뉴가 옆으로 밀려 있을 때 지금 쪽이 보이게 한다 ----
  const cur = $('.main-nav a[aria-current="page"]');
  if (cur) { const ul = cur.closest('ul'); ul.scrollLeft = Math.max(0, cur.offsetLeft - (ul.clientWidth - cur.offsetWidth) / 2); }

  // ---- 탭(화면 찾아보기) ----
  const tabs = $$('[role="tab"]:not([data-tg])');
  if (tabs.length) {
    const select = (t, focus) => {
      for (const x of tabs) {
        const on = x === t;
        x.setAttribute('aria-selected', String(on)); x.tabIndex = on ? 0 : -1;
        const p = document.getElementById(x.getAttribute('aria-controls'));
        if (p) p.hidden = !on;
      }
      if (focus) t.focus();
    };
    tabs.forEach((t) => {
      t.addEventListener('click', () => { select(t); history.replaceState(null, '', t.id === 'tab-scenes' ? '#scenes' : location.pathname); });
      t.addEventListener('keydown', (e) => {
        const i = tabs.indexOf(t), k = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
        if (k) { e.preventDefault(); select(tabs[(i + k + tabs.length) % tabs.length], true); }
        if (e.key === 'Home') { e.preventDefault(); select(tabs[0], true); }
        if (e.key === 'End') { e.preventDefault(); select(tabs.at(-1), true); }
      });
    });
    select(location.hash === '#scenes' ? tabs[1] : tabs[0]);
    addEventListener('hashchange', () => select(location.hash === '#scenes' ? tabs[1] : tabs[0]));
  }

  // ---- 거름과 찾기 (화면 목록, 아트보드) ----
  const list = $('#rows') || $('#tiles');
  if (list) {
    const items = $$(':scope > li', list), q = $('#q'), count = $('.count'), empty = $('#empty');
    const sel = {};
    const apply = () => {
      const text = (q?.value || '').trim().toLowerCase();
      let n = 0;
      for (const li of items) {
        const ok = Object.entries(sel).every(([k, v]) => !v || li.dataset[k] === v) && (!text || (li.dataset.text || '').includes(text));
        li.hidden = !ok; if (ok) n++;
      }
      if (count) count.textContent = count.dataset.countTpl.replace('{n}', n).replace('{all}', count.dataset.all);
      if (empty) empty.hidden = n > 0;
    };
    $$('[data-filter]').forEach((c) => c.addEventListener('click', () => {
      const k = c.dataset.filter, on = c.getAttribute('aria-pressed') !== 'true';
      $$(`[data-filter="${k}"]`).forEach((x) => x.setAttribute('aria-pressed', 'false'));
      c.setAttribute('aria-pressed', String(on)); sel[k] = on ? c.dataset.value : '';
      apply();
    }));
    q?.addEventListener('input', apply);
    $$('[data-view]').forEach((c) => c.addEventListener('click', () => {
      $$('[data-view]').forEach((x) => x.setAttribute('aria-pressed', String(x === c)));
      list.dataset.view = c.dataset.view;
    }));
  }

  // ---- 아트보드 크게 보기 ----
  const lb = $('#lb'), data = $('#boards-data');
  if (lb && data) {
    const boards = JSON.parse(data.textContent), img = new Image(), 
      holder = $('.lb-body', lb), h = $('#lb-t'), view = () => ($('#tiles')?.dataset.view === 'm' ? 'm' : 'd');
    holder.append(img);
    let at = 0, from = null;
    trap(lb);
    const visible = () => $$('#tiles > li').filter((li) => !li.hidden).map((li) => +li.querySelector('[data-board]').dataset.board);
    const show = (i) => {
      const b = boards[i], m = view() === 'm';
      at = i; h.textContent = b.label;
      img.src = m ? b.m : b.d; img.width = m ? b.mw : b.w; img.height = m ? b.mh : b.h; img.alt = b.label;
      $('.lb-body', lb).scrollTop = 0;
    };
    const step = (d) => { const v = visible(), k = v.indexOf(at); if (k >= 0 && v.length) show(v[(k + d + v.length) % v.length]); };
    document.addEventListener('click', (e) => {
      const b = e.target.closest('[data-board]');
      if (b) { from = b; show(+b.dataset.board); lb.showModal(); $('[data-lb="close"]', lb).focus(); return; }
      const a = e.target.closest('[data-lb]')?.dataset.lb;
      if (a === 'close') lb.close(); else if (a === 'prev') step(-1); else if (a === 'next') step(1);
      else if (e.target === lb) lb.close();
    });
    lb.addEventListener('keydown', (e) => { if (e.key === 'ArrowLeft') step(-1); else if (e.key === 'ArrowRight') step(1); });
    lb.addEventListener('close', () => { if (from && document.contains(from)) from.focus(); });
  }

  // ---- 목차 현재 위치, 좁은 폭에서는 접어 둔다 ----
  const toc = $('.toc');
  if (toc) {
    const d = $('.toc-d', toc);
    if (d && matchMedia('(max-width: 899.98px)').matches) d.open = false;
    const links = new Map($$('a[href^="#"]', toc).map((a) => [a.getAttribute('href').slice(1), a]));
    const heads = [...links.keys()].map((id) => document.getElementById(id)).filter(Boolean);
    const io = new IntersectionObserver((entries) => {
      for (const en of entries) if (en.isIntersecting) { links.forEach((a) => a.removeAttribute('aria-current')); links.get(en.target.id)?.setAttribute('aria-current', 'true'); }
    }, { rootMargin: '-80px 0px -70% 0px' });
    heads.forEach((x) => io.observe(x));
  }

  // ---- 흐름도: mermaid가 있는 페이지에서만 스크립트가 불러와져 있다 ----
  const blocks = $$('pre.mermaid');
  if (blocks.length) {
    const draw = async () => {
      if (!window.mermaid) { blocks.forEach((b) => b.setAttribute('data-failed', 'no-lib')); return; }
      const cs = getComputedStyle(document.documentElement), v = (n) => cs.getPropertyValue(n).trim();
      window.mermaid.initialize({
        startOnLoad: false, securityLevel: 'strict', theme: 'base',
        flowchart: { useMaxWidth: false, htmlLabels: true }, sequence: { useMaxWidth: false }, er: { useMaxWidth: false }, state: { useMaxWidth: false },
        themeVariables: { fontFamily: v('--font-sans'), fontSize: '14px', primaryColor: v('--primary-subtle'), primaryTextColor: v('--fg-strong'), primaryBorderColor: v('--primary'), lineColor: v('--border-strong'), secondaryColor: v('--bg-subtle'), tertiaryColor: v('--bg-surface'), background: v('--bg-surface') },
      });
      try { await window.mermaid.run({ nodes: blocks, suppressErrors: true }); } catch (err) { console.error(err); }
      blocks.forEach((b) => {
        const svg = b.querySelector('svg');
        if (!svg) { b.setAttribute('data-failed', 'syntax'); return; }
        // 글자가 읽히도록 원래 크기로 두고, 넓으면 상자 안에서 옆으로 민다
        const vb = svg.viewBox.baseVal;
        if (vb && vb.width) { svg.style.maxWidth = 'none'; svg.setAttribute('width', String(Math.ceil(vb.width))); }
        b.setAttribute('data-ready', '1');
      });
      document.documentElement.dataset.mermaid = 'done';
    };
    if (document.readyState === 'complete') draw(); else addEventListener('load', draw);
  }
})();
