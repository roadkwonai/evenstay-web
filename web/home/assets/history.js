// 제작 히스토리 쪽 스크립트: 프롬프트 원문 보기(단계별 JSON을 필요할 때 fetch)와 이미지 프롬프트 설명 창. 문장은 모두 생성기가 쪽에 넣은 JSON(#hist-t)에서 읽는다.
// 이 파일에는 주석 밖에 한글이 없다.
(() => {
  const el = document.getElementById('hist-t');
  if (!el) return;
  const B = JSON.parse(el.textContent), T = B.T, $ = (s, r = document) => r.querySelector(s);
  const fmt = (tpl, o) => tpl.replace(/\{(\w+)\}/g, (m, k) => (k in o ? o[k] : m));
  const mk = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text !== undefined) e.textContent = text; return e; };
  const when = (s) => (s || '').slice(5, 16).replace('T', ' ');
  const getJson = (name) => fetch(B.base + name).then((r) => { if (!r.ok) throw new Error(name + ' ' + r.status); return r.json(); });

  // ---- 프롬프트 ----
  if (B.page === 'prompts') {
    const list = $('#plist'), count = $('#pcount'), empty = $('#pempty'), more = $('#pmore'), q = $('#q'), sess = $('#sess');
    const cache = {}, state = { stage: null, kinds: new Set(), session: '', q: '', shown: 40, items: [] };
    const STEP = 40, nameOf = Object.fromEntries(B.stages.map((s) => [s.id, s.name]));
    const loadStage = async (id) => { if (!cache[id]) cache[id] = (await getJson('prompts-' + id + '.json')).items; return cache[id]; };
    const agentOf = (a) => { const m = /'type':\s*'([^']+)'/.exec(String(a)); return m ? m[1] : String(a).slice(0, 60); };

    function meta(it) {
      const parts = [];
      if (it.from) parts.push(T.from + ': ' + it.from);
      if (it.to_title) parts.push(T.to + ': ' + it.to_title);
      if (it.via) parts.push(T.via + ': ' + (it.question || '') + (it.picked_option !== undefined ? ' / ' + T.picked + ': ' + it.picked_option : ''));
      if (it.agent) parts.push(T.agent + ': ' + agentOf(it.agent));
      if (it.queued) parts.push(T.queued);
      return parts;
    }
    function card(it) {
      const li = mk('li', 'hm-prompt'); li.dataset.kind = it.kind;
      const h = mk('div', 'phd');
      h.append(mk('span', 'badge', T.kind[it.kind] || it.kind), mk('span', 'num', when(it.at)), mk('span', 'pid', it.id));
      if (state.stage === 'all') h.append(mk('span', 'pst', nameOf[it.stage] || it.stage));
      li.append(h);
      for (const m of meta(it)) li.append(mk('p', 'pmeta', m));
      const long = it.text.length > 420 || it.text.split('\n').length > 9;
      const pre = mk('pre', 'pt' + (long ? ' clamp' : ''), it.text);
      li.append(pre);
      if (long) {
        const b = mk('button', 'btn btn-secondary btn-sm', T.full); b.type = 'button';
        b.addEventListener('click', () => {
          const box = document.createElement('div');
          const mh = mk('p', 'muted', [T.kind[it.kind] || it.kind, when(it.at), it.id].join(', ')); box.append(mh);
          for (const m of meta(it)) box.append(mk('p', 'pmeta', m));
          box.append(mk('p', 'muted', T.copyNote), mk('pre', 'pt full', it.text));
          window.hmOpen(it.id, box, b);
        });
        li.append(b);
      }
      return li;
    }
    function filtered() {
      const t = state.q.trim().toLowerCase();
      return state.items.filter((it) => (!state.kinds.size || state.kinds.has(it.kind)) && (!state.session || it.session === state.session) && (!t || it.text.toLowerCase().includes(t) || it.id === t));
    }
    function render(reset) {
      const all = filtered();
      if (reset) { list.replaceChildren(); state.shown = 0; }
      const upto = Math.min(all.length, (state.shown || 0) + STEP);
      for (let i = state.shown || 0; i < upto; i++) list.append(card(all[i]));
      state.shown = upto;
      count.textContent = fmt(T.count, { n: all.length, all: state.items.length }) + (upto < all.length ? ' ' + fmt(T.shown, { n: upto }) : '');
      empty.hidden = all.length > 0 || !state.items.length;
      more.hidden = upto >= all.length;
    }
    function sessions() {
      const m = new Map();
      for (const it of state.items) { const e = m.get(it.session) || { n: 0 }; e.n++; m.set(it.session, e); }
      sess.replaceChildren(new Option(T.allSessions, ''));
      let i = 0;
      for (const [k, v] of m) sess.append(new Option(T.session + ' ' + (++i) + ' (' + v.n + ')', k));
      sess.disabled = false; state.session = '';
    }
    async function pick(id) {
      document.querySelectorAll('[data-stage]').forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.stage === id)));
      state.stage = id; count.textContent = T.loading;
      try {
        if (id === 'all') { const parts = await Promise.all(B.stages.map((s) => loadStage(s.id))); state.items = parts.flat().sort((a, b) => (a.at < b.at ? -1 : a.at > b.at ? 1 : 0)); }
        else state.items = await loadStage(id);
      } catch (e) { count.textContent = T.failed; console.error(e); return; }
      sessions(); render(true);
      try { history.replaceState(null, '', '#' + id); } catch { /* 주소 바꾸기가 막혀도 보기는 된다 */ }
    }
    document.querySelectorAll('[data-stage]').forEach((c) => c.addEventListener('click', () => pick(c.dataset.stage)));
    document.querySelectorAll('[data-kind]').forEach((c) => c.addEventListener('click', () => {
      const k = c.dataset.kind, on = !state.kinds.has(k);
      if (on) state.kinds.add(k); else state.kinds.delete(k);
      c.setAttribute('aria-pressed', String(on)); if (state.stage) render(true);
    }));
    sess.addEventListener('change', () => { state.session = sess.value; render(true); });
    q.addEventListener('input', () => { state.q = q.value; if (state.stage) render(true); });
    more.addEventListener('click', () => render(false));
    const start = location.hash.slice(1);
    pick(B.stages.some((s) => s.id === start) || start === 'all' ? start : B.stages[0].id);
    addEventListener('hashchange', () => { const h = location.hash.slice(1); if (h !== state.stage && (h === 'all' || B.stages.some((s) => s.id === h))) pick(h); });
  }

  // ---- 이미지와 영상: 이미지 프롬프트는 눌렀을 때 불러온다 ----
  if (B.page === 'media') {
    let all = null;
    const row = (box, k, v) => { if (v === null || v === undefined || v === '') return; const d = mk('dt', '', k), e = mk('dd'); if (v instanceof Node) e.append(v); else e.textContent = v; box.append(d, e); };
    const pageLink = (p) => { const a = mk('a', '', p.title || p.path); a.href = B.siteBase + p.path.replace(/^design\/prototype\//, ''); return a; };
    function detail(f) {
      const box = document.createElement('div');
      const img = new Image(); img.src = 'history/media/' + f.thumb.split('/').pop(); img.alt = f.name; img.className = 'hm-mthumb'; box.append(img);
      if (!f.prompt) { box.append(mk('p', 'callout-line', T.noRecord)); if (f.no_record_note) box.append(mk('p', '', f.no_record_note)); }
      else { box.append(mk('h3', '', T.prompt), mk('pre', 'pt full', f.prompt)); }
      const dl = mk('dl', 'hm-kv');
      row(dl, T.tool, f.tool ? f.tool + (f.model ? ', ' + f.model : '') : '');
      row(dl, T.model, f.model ? '' : f.model_note || '');
      row(dl, T.how, f.tool_note); row(dl, T.mode, f.mode);
      row(dl, T.source, [f.prompt_source, f.section].filter(Boolean).join(', '));
      row(dl, T.tries, f.attempts_note);
      if (f.retry_chain && f.retry_chain.length > 1) row(dl, T.chain, f.retry_chain.map((c) => c.section + ': ' + c.attempts_note).join(' / '));
      row(dl, T.refs, f.references); row(dl, T.first, f.first_scene);
      const c = f.cost;
      row(dl, T.cost, c ? [c.usd !== undefined ? c.usd + ' USD' : '', c.credits !== undefined ? c.credits + ' credits' : '', c.basis].filter(Boolean).join(', ') : T.noCost);
      if (f.pages && f.pages.length) { const ul = mk('ul', 'hm-links'); for (const p of f.pages) { const li = mk('li'); li.append(pageLink(p)); ul.append(li); } row(dl, T.pages, ul); } else row(dl, T.pages, T.noPages);
      row(dl, T.derived, (f.derivatives || []).join(', '));
      if (f.made_by) row(dl, T.madeBy, (f.made_by.how || []).join(', '));
      row(dl, T.file, f.file); row(dl, T.size, f.bytes ? Math.round(f.bytes / 1024) + ' KB' : '');
      box.append(dl);
      return box;
    }
    document.addEventListener('click', async (e) => {
      const b = e.target.closest('[data-media]');
      if (!b) return;
      try { if (!all) all = (await getJson('media.json')).files; } catch (err) { console.error(err); window.hmOpen(b.dataset.media, mk('p', '', T.failed), b); return; }
      const f = all.find((x) => x.name === b.dataset.media);
      window.hmOpen(b.dataset.media, f ? detail(f) : mk('p', '', T.noRecord), b);
    });
  }
})();
