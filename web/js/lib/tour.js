// 안내: 시작 안내, 전체 안내, 권한별 안내, 화면별 안내. 실제 화면을 옮겨 다니며 요소를 밝힌다. 단계 형식은 design/home/tour-plan.md 4절.
import { api, db, hooks, ic, replaceDb, reset, route, setPersona, view } from './kit.js';
import { loadData, loadStrings } from './text.js';
import { firstScreen, frameDoc, render } from './app.js';
import { HELP, closeModal, currentId, frameHtml, hx, modal, openModal } from './help.js';

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const SEEN = 'evenstay-help-start-hidden', MARK = 'evenstay-tour-progress';
const FILES = { COM: 'common', CORE: 'core', SAF: 'safety', FAM: 'family', AST: 'assistant', TRN: 'transitions', REQ: 'requests', CMN: 'community' };
const fileOf = (id) => FILES[id.split('-')[0]];
const wait = () => new Promise((r) => setTimeout(r, 0));
const shown = (el) => !!(el && (el.offsetWidth || el.offsetHeight || el.getClientRects().length));
const norm = (s) => (s || '').replace(/[\s ]+/g, ' ').trim();

let stage = null; // 무대가 넘겨 주는 조작: pop(이름), guide(켜고 끔), paint(), doStep(단계), playTo(순서)
const cache = new Map();
const file = (n) => { if (!cache.has(n)) cache.set(n, loadStrings('tour/' + n)); return cache.get(n); };
const roles = () => loadData('roles');

// --- 어디까지 봤는지 ---
const marks = () => { try { return JSON.parse(localStorage.getItem(MARK)) ?? {}; } catch { return {}; } };
function mark(key, i, title) {
  const m = marks();
  if (i === null) delete m[key]; else m[key] = { i, title, at: Date.now() };
  try { localStorage.setItem(MARK, JSON.stringify(m)); } catch { /* 저장이 막혀도 안내는 돈다 */ }
}

// --- 안내 만들기 ---
function screenSteps(id, def) {
  const h = HELP.screens[id];
  const first = { t: h.title, b: h.purpose, sub: `${hx('screen.users')}: ${h.users}`, note: true };
  const last = { t: hx('screen.flow'), b: h.after, sub: `${hx('screen.before')}: ${h.before}`, note: true };
  return [first, ...def.steps, last];
}
const roleOf = async (id) => (await roles()).find((r) => r.accounts.includes(id));
/** key: all, role:<id>, screen:<화면 ID>[:<변형>] */
async function build(key) {
  if (key === 'start') return { key, title: '', steps: HELP.ui.tour.map((s) => ({ t: s.title, b: s.body, bar: s.target })), start: null };
  if (key === 'all') { const a = (await file('common')).all; return { key, title: a.title, steps: a.steps, start: null }; }
  const [kind, id, variant] = key.split(':');
  if (kind === 'role') {
    const r = (await roles()).find((x) => x.id === id), t = (await file('roles'))[id];
    return { key, title: t.title, steps: t.steps, start: t.start ?? 'end', as: r.as, go: [r.go], at: t.at, seed: t.seed };
  }
  const def = (await file(fileOf(id))).screens?.[id];
  if (!def) return null;
  const v = variant ? def.variants?.[variant] : null, use = v ? { ...def, ...v } : def;
  return { key, title: HELP.screens[id].title, steps: screenSteps(id, use), start: use.start ?? 'end', as: use.as, go: use.go ?? [id], at: use.at, seed: use.seed };
}

// --- 안내 중 상태 ---
const run = { tour: null, i: 0, saved: null, ctx: '', busy: false, guide: false, base: new Map(), absent: false };
export const touring = () => !!run.tour;

/** 단계 i까지 이어진 위치와 준비 동작 */
function placeOf(t, i) {
  const c = { as: t.as, go: t.go, at: t.at, seed: t.seed, pop: '', guide: undefined, do: [] };
  for (const s of t.steps.slice(0, i + 1)) {
    for (const k of ['as', 'at', 'guide', 'seed']) if (s[k] !== undefined) c[k] = s[k];
    if (s.pop !== undefined) c.pop = s.pop;
    if (s.popNarrow !== undefined && innerWidth < 768) c.pop = s.popNarrow;
    if (s.go || s.as) c.do = [];
    if (s.go) c.go = s.go;
    if (s.fresh) c.do = [];
    if (s.do) c.do = [...c.do, ...s.do];
  }
  return c;
}
async function baseData(start) {
  if (!run.base.has(start)) {
    if (start === 'end') run.base.set(start, JSON.stringify(await loadData('end-state')));
    else { reset(); await stage.playTo(start); run.base.set(start, JSON.stringify(db)); }
  }
  return JSON.parse(run.base.get(start));
}
async function moveTo(t, c) {
  const key = JSON.stringify(c);
  if (key === run.ctx) return;
  run.ctx = key;
  if (t.start !== null) {
    replaceDb(await baseData(t.start));
    for (const { push, value } of c.seed ?? []) push.split('.').reduce((o, k) => o[k] ??= (k === push.split('.').at(-1) ? [] : {}), db).push(value); // 시연에서 지나간 기록을 임시 자료에만 더한다. 닫으면 사라진다
    if (c.as) setPersona(c.as);
    if (c.at) db.now = c.at; // 시계만 옮긴다. 시간이 지나 생기는 일은 일어나지 않게 tick을 부르지 않는다
    for (const k of Object.keys(view)) delete view[k];
    const [id, params] = c.go ?? [route.id, route.params];
    const q = new URLSearchParams(params ?? {}).toString();
    const hash = `#/${id}${q ? '?' + q : ''}`;
    if (location.hash === hash) hooks.render(); else { location.hash = hash; render(); }
    await wait(); await wait();
    frameDoc().getElementById('toasts')?.replaceChildren();
    for (const s of c.do) { await stage.doStep(s); await wait(); }
  }
  stage.pop(c.pop); stage.guide(c.guide ?? run.guide); stage.paint();
  await wait();
}

// --- 대상 찾기 ---
function findTarget(s) {
  if (s.bar) { const el = [...document.querySelectorAll(s.bar)].find(shown); return el ? { el, frame: false } : null; }
  const d = frameDoc();
  if (s.sel) { const el = [...d.querySelectorAll(s.sel)].find(shown); return el ? { el, frame: true } : null; }
  if (s.text) {
    const scopes = s.within ? [...d.querySelectorAll(s.within)].filter(shown) : [d];
    const all = scopes.flatMap((x) => [...x.querySelectorAll('h1,h2,h3,a,button,th,summary,label,[data-act],[data-set],li,p,span,td,div')]).filter(shown);
    const want = norm(s.text), el = all.find((e) => norm(e.textContent) === want) || all.reverse().find((e) => norm(e.textContent).includes(want));
    return el ? { el, frame: true } : null;
  }
  return null;
}
function rectOf(t) {
  const r = t.el.getBoundingClientRect();
  if (!t.frame) return r;
  const f = document.getElementById('frame').getBoundingClientRect();
  return new DOMRect(r.left + f.left, r.top + f.top, r.width, r.height);
}
const clamp = (v, a, b) => Math.min(Math.max(v, a), Math.max(a, b));
const overlap = (a, b) => Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) * Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
/** 밝힐 곳을 화면 영역에 맞추고 안내 창을 겹치지 않는 자리에 둔다 */
function place(target) {
  const box = modal(), hm = box.querySelector('.hm');
  if (!target) return;
  if (target.frame) { // 고정 머리글에 가리지 않게 가운데로 옮긴다. 긴 대상은 머리글 높이만큼 비켜 위에 맞춘다
    const tall = target.el.getBoundingClientRect().height > innerHeight * 0.4;
    target.el.scrollIntoView({ block: tall ? 'start' : 'center', inline: 'nearest' });
    if (tall) target.el.ownerDocument.defaultView.scrollBy(0, -72);
  }
  const bar = document.getElementById('bar').getBoundingClientRect().bottom;
  const raw = rectOf(target), top = target.frame ? Math.max(raw.top, bar) : raw.top;
  const r = new DOMRect(clamp(raw.left, 0, innerWidth), top, Math.min(raw.right, innerWidth) - clamp(raw.left, 0, innerWidth), Math.max(Math.min(raw.bottom, innerHeight) - top, 0));
  box.classList.add('has-target');
  const pad = 4, w = hm.offsetWidth, h = hm.offsetHeight, gap = 12, m = 12;
  const spots = innerWidth < 640
    ? [[0, innerHeight - h], [0, 0]]
    : [[r.right + gap, r.top], [r.left - w - gap, r.top], [r.left, r.bottom + gap], [r.left, r.top - h - gap]].map(([x, y]) => [clamp(x, m, innerWidth - w - m), clamp(y, m, innerHeight - h - m)]).concat([[innerWidth - w - m, innerHeight - h - m], [m, innerHeight - h - m], [innerWidth - w - m, m], [m, m]]);
  const hit = ([x, y]) => overlap(r, new DOMRect(x, y, w, h));
  const best = spots.reduce((a, b) => (hit(b) < hit(a) ? b : a));
  hm.style.position = 'fixed'; hm.style.margin = '0'; hm.style.left = `${Math.round(best[0])}px`; hm.style.top = `${Math.round(best[1])}px`;
  // 좁은 폭에서 위아래 어디에 두어도 겹치면 안내 창을 뺀 곳만 밝힌다
  const card = new DOMRect(best[0], best[1], w, h);
  const covered = overlap(r, card) > 0;
  const bottom = covered && best[1] > r.top ? Math.min(r.bottom, card.top - gap) : r.bottom;
  const up = covered && best[1] <= r.top ? Math.max(r.top, card.bottom + gap) : r.top;
  box.insertAdjacentHTML('afterbegin', `<div class="tour-hole" style="transform: translate(${Math.round(r.left - pad)}px, ${Math.round(up - pad)}px); width: ${Math.round(r.width + pad * 2)}px; height: ${Math.round(Math.max(bottom - up, 8) + pad * 2)}px;"></div>`);
  run.rect = new DOMRect(r.left, up, r.width, bottom - up);
}

// --- 단계 보이기 ---
async function show(opener) {
  const t = run.tour, s = t.steps[run.i], last = run.i === t.steps.length - 1, again = !!modal();
  run.busy = true;
  await moveTo(t, placeOf(t, run.i));
  const target = findTarget(s);
  run.rect = null;
  run.absent = !target && !s.note && !!(s.bar || s.sel || s.text);
  const body = `<p>${esc(s.b)}</p>${s.why ? `<p class="tour-why">${esc(s.why)}</p>` : ''}${s.sub ? `<p class="tour-sub">${esc(s.sub)}</p>` : ''}${run.absent ? `<p class="tour-sub">${hx('tour.absent')}</p>` : ''}`;
  const foot = `<span class="tour-n">${run.i + 1} / ${t.steps.length}</span>
    ${t.key === 'start' ? `<button class="btn btn-ghost btn-sm tour-hide" type="button" data-hm="hide">${hx('start.hide')}</button>` : ''}
    ${run.i ? `<button class="btn btn-secondary btn-sm" type="button" data-hm="prev">${hx('tour.prev')}</button>` : ''}
    <button class="btn btn-primary btn-sm" type="button" data-hm="${last ? 'done' : 'next'}">${last ? (t.key === 'start' ? hx('start.go') : hx('tour.done')) : hx('tour.next')}</button>`;
  openModal(frameHtml(s.t, body, foot), opener);
  const box = modal();
  box.classList.add('tour');
  box.classList.toggle('tour-again', again); // 단계를 넘길 때는 움직임 없이 바로 바꾼다
  place(target);
  if (t.key !== 'start') mark(t.key, last ? null : run.i, t.title);
  if (again) box.querySelector(`[data-hm="${last ? 'done' : 'next'}"]`).focus();
  run.busy = false;
}

/** 안내를 끝낸다. 시연 자료를 되돌리고 지금 화면에 남는다. */
function leave() {
  const t = run.tour;
  if (!t) return;
  run.tour = null; run.ctx = '';
  hooks.frozen = false;
  if (t.start !== null) {
    const stayAs = t.key.startsWith('role:') ? db.persona : run.saved.persona; // 권한별 안내는 그 권한에 남고, 화면별 안내는 보던 화면으로 돌아간다
    replaceDb(run.saved); setPersona(stayAs);
    for (const k of Object.keys(view)) delete view[k];
    if (!t.key.startsWith('role:') && location.hash !== run.hash) location.hash = run.hash;
  }
  stage.pop(''); stage.guide(run.guide);
  try { hooks.render(); } catch { location.hash = `#/${firstScreen()}`; } // 안내 자료에만 있던 항목을 가리키면 첫 화면으로 간다
  stage.paint();
}

export async function startTour(key, opener, from = 0) {
  if (run.tour) { closeModal(); }
  const t = await build(key);
  if (!t) return false;
  run.tour = t; run.i = from; run.ctx = ''; run.guide = stage.guideOn();
  run.saved = JSON.parse(JSON.stringify(db)); run.hash = location.hash;
  hooks.frozen = t.start !== null;
  await show(opener);
  return true;
}

// --- 고르는 창 ---
export async function openChooser(opener) {
  const [rs, common] = await Promise.all([roles(), file('common')]);
  const mine = api.safety.isNightDuty?.(db.persona) ? rs.find((r) => r.id === 'night') : await roleOf(db.persona), id = currentId(), screen = HELP.screens[id];
  const row = (key, label, sub, i = 0) => `<button class="tool" type="button" data-tour="${esc(key)}" data-from="${i}"><b>${esc(label)}</b><span>${esc(sub)}</span></button>`;
  const open = Object.entries(marks()).sort((a, b) => b[1].at - a[1].at)[0];
  const rows = [
    open ? row(open[0], hx('tour.resume').replace('{title}', open[1].title), hx('tour.resumeSub').replace('{n}', open[1].i + 1), open[1].i) : '',
    row('all', common.all.title, hx('tour.pick.all')),
    mine ? row(`role:${mine.id}`, hx('tour.pick.role').replace('{role}', mine.label), hx('tour.pick.roleSub')) : '',
    screen ? row(`screen:${id}${(await file(fileOf(id))).screens?.[id]?.variants?.[mine?.id] ? ':' + mine.id : ''}`, hx('tour.pick.screen').replace('{title}', screen.title), hx('tour.pick.screenSub')) : '',
  ].join('');
  const others = rs.filter((r) => r.id !== mine?.id).map((r) => `<button class="chip" type="button" data-tour="role:${r.id}" data-from="0">${esc(r.label)}</button>`).join('');
  openModal(frameHtml(hx('tour.pick.h'), `<div class="tour-pick">${rows}</div><details><summary>${hx('tour.pick.others')}</summary><div class="chips">${others}</div></details><p class="tour-sub">${hx('tour.pick.note')}</p>`, `<button class="btn btn-secondary btn-sm" type="button" data-hm="close">${hx('close')}</button>`), opener);
}

// --- 화면을 옮겼을 때 작게 제안한다 ---
let lastId = null, hintTimer = 0;
function hint() {
  const id = currentId(), el = document.getElementById('tour-hint');
  if (id === lastId) return;
  const first = lastId === null;
  lastId = id;
  clearTimeout(hintTimer);
  el?.remove();
  if (first || run.tour || modal() || stage.busy() || !HELP.screens[id]) return;
  document.querySelector('.stage-view').insertAdjacentHTML('afterbegin', `<button id="tour-hint" class="btn btn-secondary btn-sm" type="button" data-tour="screen:${id}" data-from="0">${ic('info')}${hx('tour.hint')}</button>`);
  hintTimer = setTimeout(() => document.getElementById('tour-hint')?.remove(), 8000);
}

export function mountTour(ctl) {
  stage = ctl;
  const after = hooks.afterRender;
  hooks.afterRender = () => { after?.(); hint(); };
  modal.onClose = leave;
  document.addEventListener('click', async (e) => {
    const b = e.target.closest?.('[data-tour],[data-hm]');
    if (!b || run.busy) return;
    if (b.dataset.tour) { const opener = () => document.querySelector('[data-do="help"]'); document.getElementById('tour-hint')?.remove(); closeModal(); await startTour(b.dataset.tour, opener, +b.dataset.from || 0); return; }
    const a = b.dataset.hm;
    if (a === 'next') { run.i++; await show(); } else if (a === 'prev') { run.i--; await show(); } else if (a === 'done') { if (run.tour?.key !== 'start') mark(run.tour.key, null); closeModal(); } else if (a === 'hide') { try { localStorage.setItem(SEEN, '1'); } catch { /* 저장이 막혀도 창은 닫는다 */ } closeModal(); }
  });
}
export const startHidden = () => { try { return localStorage.getItem(SEEN) === '1' || /[?&](notour|as=|beat=|x=|tour=)/.test(location.search); } catch { return true; } };

/** 시험이 보는 지금 단계 */
export const tourNow = () => {
  const box = modal(), hm = box?.querySelector('.hm')?.getBoundingClientRect(), r = run.rect;
  return { key: run.tour?.key ?? null, i: run.i, total: run.tour?.steps.length ?? 0, step: run.tour?.steps[run.i] ?? null, absent: run.absent, hole: !!box?.querySelector('.tour-hole'), target: r && { l: r.left, t: r.top, r: r.right, b: r.bottom }, card: hm && { l: hm.left, t: hm.top, r: hm.right, b: hm.bottom }, W: innerWidth, H: innerHeight, busy: run.busy };
};
