// 공통 상단 영역: 메인 홈, 소개 사이트, 앱이 같은 코드를 쓴다. 문구는 strings/topbar.json, 권한 목록은 data/roles.json과 data/accounts.json이다.
export const STATE_KEY = 'evenstay-proto-v5';
const cfg = { base: '', current: null, onPick: null };
let T = {}, ROLES = [], ACCOUNTS = [], open = false, pop = null;
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const CARET = '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';

function savedPersona() {
  try { return JSON.parse(localStorage.getItem(STATE_KEY))?.persona ?? null; } catch { return null; }
}
function currentLabel() {
  const id = cfg.current ? cfg.current() : savedPersona(), a = ACCOUNTS.find((x) => x.id === id);
  if (!a) return { long: T.pick, short: T.pick };
  const g = ROLES.find((r) => r.accounts.includes(id));
  const role = g ? g.label : a.role;
  return { long: T.now.replace('{role}', role).replace('{name}', a.name), short: T.nowShort.replace('{role}', role) };
}
/** 막대 안쪽 글자. 앱은 시연 막대에 합치므로 문자열로 준다. */
const ic = (d) => `<svg class="i" viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;
const I = {
  home: ic('<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>'),
  site: ic('<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>'),
  help: ic('<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>'),
};
const label = (long, short) => `<span class="tb-long">${esc(long)}</span><span class="tb-short">${esc(short)}</span>`;
/** 지금 있는 곳. 앱에서는 눌린 표시를 두지 않는다. */
function here() {
  const p = location.pathname;
  if (/\/site\//.test(p)) return 'site';
  return /\/app\.html$/.test(p) ? '' : 'home';
}
/** helpAttr를 주면 도움말이 그 페이지의 버튼이 되고, 없으면 메인 홈의 보는 법으로 간다. */
export function topbarHtml(helpAttr) {
  const c = currentLabel(), at = here(), cur = (k) => (at === k ? ' aria-current="page"' : '');
  const helpInner = `${I.help}<span>${esc(T.help)}</span>`;
  const help = helpAttr ? `<button class="tb-link" type="button" ${helpAttr}>${helpInner}</button>` : `<a class="tb-link" href="${cfg.base}index.html#how">${helpInner}</a>`;
  return `<img class="tb-mark" src="${cfg.base}assets/logo/evenstay-logo-white.svg" alt="Evenstay" width="84" height="18">
  <nav class="tb-nav" aria-label="${esc(T.nav)}">
    <a class="tb-link tb-home" href="${cfg.base}index.html"${cur('home')} data-tip="tip.home">${I.home}${label(T.home, T.homeShort)}</a>
    <a class="tb-link" href="${cfg.base}site/index.html"${cur('site')}>${I.site}${label(T.site, T.siteShort)}</a>
    ${help}
    <button class="tb-role" type="button" aria-haspopup="dialog" aria-expanded="${open}" data-tip="tip.acct"><span class="tb-long">${esc(c.long)}</span><span class="tb-short">${esc(c.short)}</span>${CARET}</button>
  </nav>`;
}
function popHtml() {
  const link = (url, id, go, inner, cls = '') => `<a class="tb-item${cls}" href="${cfg.base}${url}" data-as="${id}" data-go="${go}">${inner}</a>`;
  return `<section class="tb-pop" role="dialog" aria-label="${esc(T.title)}">
    <h2>${esc(T.title)}</h2>
    <div class="tb-groups">${ROLES.map((r) => link(r.url, r.as, r.go, esc(r.label))).join('')}</div>
    <details><summary>${esc(T.all)}</summary><div class="tb-all">${ACCOUNTS.map((a) => link(`app.html?as=${a.id}&go=${a.go}`, a.id, a.go, `<b>${esc(a.name)}</b><span>${esc(a.role)}, ${esc(a.org)}</span>`)).join('')}</div></details>
  </section>`;
}
const button = () => document.querySelector('.tb-role');
function setOpen(on) {
  open = on;
  pop.innerHTML = on ? popHtml() : '';
  const b = button();
  b?.setAttribute('aria-expanded', on);
  if (on) pop.querySelector('a')?.focus(); else b?.focus();
}
function onKey(e) {
  if (!open) return;
  if (e.key === 'Escape') { e.stopPropagation(); setOpen(false); return; }
  if (e.key !== 'Tab') return;
  const f = [...pop.querySelectorAll('a,summary')].filter((x) => x.offsetParent), first = f[0], last = f.at(-1), a = document.activeElement;
  if (e.shiftKey && a === first) { e.preventDefault(); last.focus(); } else if (!e.shiftKey && a === last) { e.preventDefault(); first.focus(); }
}
function onClick(e) {
  if (e.target.closest?.('.tb-role')) { setOpen(!open); return; }
  const a = e.target.closest?.('.tb-pop [data-as]');
  if (a && cfg.onPick) { e.preventDefault(); open = false; pop.innerHTML = ''; cfg.onPick(a.dataset.as, a.dataset.go); return; } // 앱 안에서는 시연 기록을 지우지 않고 바꾼다
  if (open && !e.target.closest?.('.tb-pop')) setOpen(false);
}
const get = (p) => fetch(new URL(cfg.base + p, location.href)).then((r) => r.json());
export async function initTopbar(options = {}) {
  Object.assign(cfg, options);
  // 페이지 쪽 링크에 기대지 않는다: HTML이 캐시에 남아 있어도 막대 스타일은 함께 온다
  if (!document.querySelector('link[href$="shared/topbar.css"]')) {
    const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = new URL('./topbar.css', import.meta.url).href; document.head.append(l);
  }
  [T, ROLES, ACCOUNTS] = await Promise.all([get('strings/topbar.json'), get('data/roles.json'), get('data/accounts.json')]);
  pop = document.createElement('div'); pop.id = 'tb-pop-root'; document.body.append(pop);
  document.addEventListener('click', onClick);
  document.addEventListener('keydown', onKey);
}
/** 메인 홈과 소개 사이트: 자리 하나에 그린다 */
export async function mountTopbar(el, options) {
  await initTopbar(options);
  el.className = 'tb-bar'; el.innerHTML = topbarHtml();
}
