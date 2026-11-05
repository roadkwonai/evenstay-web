// 설명 층: 툴팁, 시작 안내, [이 화면 설명], [설명 켜기]. 제품 화면 문구와 섞지 않고 strings/help.json만 쓴다.
import { hooks, ic, me, route, view } from './kit.js';
import { loadStrings } from './text.js';
import { frameDoc } from './app.js';

export const HELP = await loadStrings('help');
/** 설명 층 문구 */
export const hx = (key) => { const s = HELP.ui[key]; if (s === undefined) console.error('missing help', key); return s ?? key; };
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const state = { explain: false, pass: null };
export const explainOn = () => state.explain;

// --- 툴팁: 마우스와 키보드 포커스에서 열고 Esc로 닫는다 ---
const tip = document.createElement('div');
tip.id = 'tip'; tip.setAttribute('role', 'tooltip'); tip.hidden = true;
document.body.append(tip);
let timer = 0, lastHide = 0, anchor = null;
function place(el, frame) {
  const r = el.getBoundingClientRect(), o = frame ? frame.getBoundingClientRect() : { left: 0, top: 0 };
  const w = tip.offsetWidth, h = tip.offsetHeight, x = o.left + r.left + r.width / 2 - w / 2;
  const below = o.top + r.bottom + 8, y = below + h > innerHeight - 8 ? o.top + r.top - h - 8 : below;
  tip.style.transform = `translate(${Math.round(Math.max(8, Math.min(x, innerWidth - w - 8)))}px, ${Math.round(y)}px)`;
}
function show(el, text, frame, now) {
  clearTimeout(timer);
  const open = () => {
    tip.textContent = text; tip.hidden = false; anchor = el;
    tip.dataset.instant = Date.now() - lastHide < 400 ? '1' : ''; // 이어서 볼 때는 기다리지 않는다
    place(el, frame); el.setAttribute('aria-describedby', 'tip');
  };
  if (now || Date.now() - lastHide < 400) open(); else timer = setTimeout(open, 300);
}
export function hideTip() {
  clearTimeout(timer);
  if (tip.hidden) return;
  tip.hidden = true; lastHide = Date.now(); anchor?.removeAttribute('aria-describedby'); anchor = null;
}
const tipOf = (t) => {
  const el = t.closest?.('[data-tip],[data-explain]');
  if (!el) return null;
  return { el, text: el.dataset.tip ? hx(el.dataset.tip) : currentHelp()?.buttons?.[+el.dataset.explain]?.does };
};
/** 문서 하나에 툴팁을 건다. iframe 안이면 frame을 넘긴다. */
export function bindTips(doc, frame) {
  doc.addEventListener('mouseover', (e) => { const t = tipOf(e.target); if (t?.text) show(t.el, t.text, frame); });
  doc.addEventListener('mouseout', (e) => { if (tipOf(e.target)) hideTip(); });
  doc.addEventListener('focusin', (e) => { const t = tipOf(e.target); if (t?.text && e.target.matches(':focus-visible')) show(t.el, t.text, frame, true); });
  doc.addEventListener('focusout', hideTip);
  doc.addEventListener('keydown', (e) => { if (e.key === 'Escape') hideTip(); });
  doc.addEventListener('scroll', hideTip, true);
}

// --- 모달: 포커스 가두기, Esc 닫기, 닫으면 연 버튼으로 돌아간다 ---
let box = null, back = null;
/** 지금 열린 창. onClose는 안내가 쓴다. */
export const modal = () => box;
const focusables = () => [...box.querySelectorAll('button,a[href],input,summary,[tabindex="0"]')].filter((e) => !e.disabled);
export function closeModal() {
  if (!box) return;
  box.remove(); box = null;
  for (const id of ['bar', 'stage', 'pop']) document.getElementById(id).inert = false;
  modal.onClose?.();
  const target = typeof back === 'function' ? back() : back;
  back = null; target?.focus?.();
}
export function openModal(html, opener) {
  const keep = box ? back : opener; // 모달 안에서 다른 설명으로 옮겨 가도 돌아갈 곳은 처음 버튼이다
  if (box) { box.remove(); box = null; }
  back = keep;
  hideTip();
  box = document.createElement('div');
  box.className = 'hm-scrim'; box.innerHTML = html;
  document.body.append(box);
  for (const id of ['bar', 'stage', 'pop']) document.getElementById(id).inert = true;
  box.addEventListener('mousedown', (e) => { if (e.target === box) closeModal(); });
  box.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { e.stopPropagation(); closeModal(); return; }
    if (e.key !== 'Tab') return;
    const f = focusables(), first = f[0], last = f.at(-1), a = document.activeElement;
    if (e.shiftKey && (a === first || !box.contains(a))) { e.preventDefault(); last.focus(); } else if (!e.shiftKey && a === last) { e.preventDefault(); first.focus(); }
  });
  box.querySelector('.hm').focus();
}
export const frameHtml = (title, body, foot) => `<section class="hm" role="dialog" aria-modal="true" aria-labelledby="hm-t" tabindex="-1">
  <header><h2 id="hm-t">${esc(title)}</h2><button class="btn btn-ghost btn-sm" type="button" data-hm="close">${ic('x')}${hx('close')}</button></header>
  <div class="hm-body">${body}</div><footer>${foot}</footer></section>`;
const sec = (h, inner) => `<section><h3>${esc(h)}</h3>${inner}</section>`;

/** 지금 화면의 설명 ID. 화면이 아니라 상태로 있는 페이지는 여기서 고른다. */
export function currentId() {
  if (route.id === 'COM-07' && me().key === 'PROXY') return 'FAM-13';
  if (route.id === 'CMN-14' && view.write) return 'CMN-20';
  return route.id;
}
function currentHelp() { return HELP.screens[currentId()]; }

export function openScreen(id, opener) {
  const s = HELP.screens[id];
  if (!s) return;
  const btns = s.buttons.map((b) => `<dt>${esc(b.label)}</dt><dd>${esc(b.does)}</dd>`).join('');
  const body = `${sec(hx('screen.purpose'), `<p>${esc(s.purpose)}</p>`)}
    <dl class="hm-kv"><dt>${hx('screen.users')}</dt><dd>${esc(s.users)}</dd><dt>${hx('screen.service')}</dt><dd>${esc(s.service)}</dd></dl>
    ${sec(hx('screen.buttons'), `<dl>${btns}</dl>`)}
    ${sec(hx('screen.flow'), `<dl><dt>${hx('screen.before')}</dt><dd>${esc(s.before)}</dd><dt>${hx('screen.after')}</dt><dd>${esc(s.after)}</dd></dl>`)}`;
  const also = [id !== 'COM-01' && ['COM-01', hx('screen.bar')], id !== 'COM-08' && route.id && document.getElementById('frame').contentDocument.querySelector('.screen.ops') && ['COM-08', hx('screen.frame')]].filter(Boolean);
  openModal(frameHtml(s.title, body, `<span class="hm-also">${also.map(([to, l]) => `<button class="btn btn-ghost btn-sm" type="button" data-hm="screen" data-to="${to}">${l}</button>`).join('')}</span><button class="btn btn-secondary btn-sm" type="button" data-hm="close">${hx('close')}</button><button class="btn btn-primary btn-sm" type="button" data-tour="screen:${id}" data-from="0">${hx('screen.start')}</button>`), opener);
}

// --- [설명 켜기]: 끄면 실제 화면 그대로다 ---
export function setExplain(on) { state.explain = on; hooks.render(); }
const norm = (s) => (s || '').replace(/[\s\u00a0]+/g, ' ').trim();
export function decorate() {
  const d = frameDoc(), root = d?.getElementById('root');
  if (!root) return;
  root.classList.toggle('explain-on', state.explain);
  if (!state.explain) return;
  const list = currentHelp()?.buttons || [];
  const els = [...root.querySelectorAll('a,button,[data-act],[data-set]')];
  list.forEach((b, i) => els.filter((e) => norm(e.textContent) === norm(b.label) && !e.dataset.explain).forEach((e) => {
    e.dataset.explain = i;
    if (getComputedStyle(e).position === 'static') e.style.position = 'relative'; // 표시를 모서리에 붙이되 원래 위치 지정은 바꾸지 않는다
    e.insertAdjacentHTML('beforeend', `<span class="explain-i" aria-hidden="true">${ic('info')}</span>`);
  }));
}
function onExplainClick(e) {
  const el = state.explain && e.target.closest?.('[data-explain]');
  if (!el) return;
  if (state.pass === el) { state.pass = null; return; }
  e.preventDefault(); e.stopImmediatePropagation();
  const b = currentHelp()?.buttons?.[+el.dataset.explain];
  if (!b) return;
  openModal(frameHtml(b.label, `<p>${esc(b.does)}</p>`, `<button class="btn btn-secondary btn-sm" type="button" data-hm="close">${hx('close')}</button><button class="btn btn-primary btn-sm" type="button" data-hm="press">${hx('explain.press')}</button>`), el);
  box.pressTarget = el;
}

export function mountHelp(frame) {
  bindTips(document);
  const doc = frame.contentDocument;
  bindTips(doc, frame);
  doc.addEventListener('click', onExplainClick, true);
  document.addEventListener('click', (e) => {
    const a = e.target.closest?.('[data-hm]')?.dataset;
    if (!a) return;
    if (a.hm === 'close') closeModal();
    else if (a.hm === 'screen') openScreen(a.to);
    else if (a.hm === 'press') { const el = box.pressTarget; state.pass = el; closeModal(); el.click(); }
  });
}
