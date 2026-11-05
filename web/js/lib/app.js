// 화면 그리기와 이벤트. 한 번만 쓰는 무대 코드라 모듈은 이 파일을 쓰지 않는다.
import { tx } from './text.js';
import { actions, api, commit, db, go, hooks, me, Refuse, route, screens, view } from './kit.js';
import { FIRST_SCREEN, familyFrame, homeFrame, opsFrame } from './frames.js';
import { PERSONAS } from './people.js';

let doc, root, lastKey = '', wasOpen = false;
export const frameDoc = () => doc;

export function firstScreen(p = me()) { return FIRST_SCREEN[p.key]; }

function parseHash() {
  const [path, q] = location.hash.replace(/^#\/?/, '').split('?');
  route.id = path || firstScreen();
  route.params = Object.fromEntries(new URLSearchParams(q || ''));
}

export function render() {
  if (!root) return;
  parseHash();
  const p = me(), sc = screens[route.id];
  if (sc && !p.apps.includes(sc.app)) { go(firstScreen()); return; } // 다른 앱 화면으로 가면 그 계정의 첫 화면으로 간다
  if (!sc) {
    root.innerHTML = `<div class="screen" style="padding:24px"><p class="t-body-md">${tx('common.render.p', { id: route.id })}</p><p><a class="btn btn-secondary btn-md" href="#/${firstScreen()}">${tx('common.render.btn')}</a></p></div>`;
    hooks.afterRender?.();
    return;
  }
  const key = location.hash;
  if (key !== lastKey) for (const k of Object.keys(view)) delete view[k];
  const y = doc.defaultView.scrollY, a = doc.activeElement, bind = a?.dataset?.bind, sel = a?.selectionStart;
  const r = sc.render(route.params);
  const html = sc.app === 'home' ? homeFrame(r, route.id === 'COM-07') : sc.app === 'family' ? familyFrame(r) : opsFrame(r);
  root.innerHTML = html;
  doc.title = sc.title || 'Evenstay';
  doc.defaultView.scrollTo(0, key === lastKey ? y : 0);
  lastKey = key;
  if (bind) { const el = root.querySelector(`[data-bind="${bind}"]`); if (el) { el.focus(); if (sel != null && el.setSelectionRange) try { el.setSelectionRange(sel, sel); } catch { /* 입력 종류에 따라 커서 지정 불가 */ } } }
  for (const el of root.querySelectorAll('[data-bind]')) { // 다시 그려도 입력 값을 잃지 않는다
    const k = el.dataset.bind; if (view[k] === undefined) continue;
    if (el.type === 'radio') el.checked = el.value === view[k];
    else if (el.type === 'checkbox') el.checked = !!view[k];
    else el.value = view[k];
  }
  const dlg = root.querySelector('[data-scrim] [role="dialog"]');
  if (dlg && !wasOpen) dlg.querySelector('button,a[href],input,select,textarea')?.focus(); // 창이 열리면 키보드 초점을 창 안으로
  wasOpen = !!dlg;
  hooks.afterRender?.();
}

export function run(name, args, form) {
  const fn = actions[name];
  if (!fn) { console.error('unknown action', name); return; }
  try { fn(args, form); } catch (e) {
    if (e instanceof Refuse) hooks.toast(e.message); else throw e;
  }
  commit();
}

function setView(spec) {
  for (const [k, v] of new URLSearchParams(spec)) view[k] = v;
  render();
}

function onClick(e) {
  const t = e.target;
  const a = t.closest('a[href]');
  if (a) {
    const h = a.getAttribute('href');
    if (h.startsWith('tel:')) { e.preventDefault(); hooks.toast(tx('common.onClick.toast')); return; }
    if (h.startsWith('#/')) { e.preventDefault(); location.hash = h; return; }
    if (h === '#') e.preventDefault();
  }
  const s = t.closest('[data-set]');
  if (s) { e.preventDefault(); setView(s.dataset.set); return; }
  const b = t.closest('[data-act]');
  if (b && b.tagName !== 'FORM') {
    e.preventDefault();
    const f = b.closest('form');
    run(b.dataset.act, { ...b.dataset }, f ? Object.fromEntries(new FormData(f)) : {});
  }
}

function onSubmit(e) {
  const f = e.target.closest('form');
  e.preventDefault();
  if (f?.dataset.act) run(f.dataset.act, { ...f.dataset }, Object.fromEntries(new FormData(f)));
}

function onInput(e) {
  const el = e.target, k = el.dataset?.bind;
  if (!k) return;
  view[k] = el.type === 'checkbox' ? (el.checked ? '1' : '') : el.value;
  if (el.dataset.live !== undefined) render();
}

export function mount(frame) {
  doc = frame.contentDocument; root = doc.getElementById('root');
  doc.addEventListener('click', onClick);
  doc.addEventListener('submit', onSubmit);
  doc.addEventListener('input', onInput);
  doc.addEventListener('change', onInput);
  doc.addEventListener('keydown', (e) => { // Esc는 열린 창의 닫기 버튼을 누른 것과 같다
    if (e.key !== 'Escape') return;
    const closers = [...doc.querySelectorAll('[data-scrim] [data-set]')];
    closers.pop()?.click();
  });
  hooks.render = render;
  hooks.toast = (msg) => {
    const box = doc.getElementById('toasts'), el = doc.createElement('div');
    el.className = 'toast'; el.setAttribute('role', 'status'); el.textContent = msg; box.replaceChildren(el);
    setTimeout(() => el.remove(), 4000);
  };
  window.addEventListener('hashchange', render);
}
export { PERSONAS, api, db };
