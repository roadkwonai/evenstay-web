// 시연 막대(COM-01~03)와 시연 순서 창. 문구는 코어 copy 2-11, 2-16. 장면 안내는 프로토타입 전용이다.
import { loadData, tx } from './text.js';
import { commit, db, esc, fmt, go, hooks, me, modules, replaceDb, reset, setClock, setPersona, toast } from './kit.js';
import { PERSONAS } from './people.js';
import { initTopbar, topbarHtml, githubLink } from '../../shared/topbar.js';
import { SCENES } from './scenes.js';
import { firstScreen, frameDoc, render } from './app.js';
import { closeModal, currentId, decorate, explainOn, hideTip, hx, mountHelp, openScreen, setExplain } from './help.js';
import { mountTour, openChooser, startHidden, startTour } from './tour.js';

const START = { DEFAULT: [tx('common.START.DEFAULT')], AFTER_SUCCESSION: [tx('common.START.AFTERSUCCESSION'), 4, '2026-11-10T18:00:00'], C_AFTER_DISCHARGE: [tx('common.START.CAFTERDISCHARGE'), 30, '2026-12-07T18:00:00'], G_START: [tx('common.START.GSTART'), 36, '2027-01-05T10:00:00'] };
const ui = { pop: '', start: 'DEFAULT', guide: window.innerWidth >= 1024, busy: false, fails: [] };
const beats = () => modules.flatMap((m) => (m.flow || []).map((b) => ({ ...b, mod: m.key }))).sort((a, b) => a.scene - b.scene || (a.ord ?? 0) - (b.ord ?? 0));
const extras = () => modules.flatMap((m) => m.extra || []).filter((b) => b.go);
const label = (iso) => iso.slice(0, 16).replace('T', ' ');

// --- 단계 진행기. 안내 버튼, 시작 상태, 시험이 같은 정의를 쓴다. ---
const wait = () => new Promise((r) => setTimeout(r, 0));
const norm = (s) => (s || '').replace(/[\s ]+/g, ' ').trim();
const shown = (el) => !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
function byText(text, within) {
  // within이 가리키는 곳이 폭에 따라 둘로 나뉘면(데스크톱 칸, 휴대폰 목록) 보이는 쪽에서 찾는다.
  const scopes = within ? [...frameDoc().querySelectorAll(within)].filter(shown) : [frameDoc()];
  const all = scopes.flatMap((s) => [...s.querySelectorAll('a,button,[data-act],[data-set],label,summary')]).filter(shown);
  return all.find((e) => norm(e.textContent) === text) || all.find((e) => norm(e.textContent).includes(text));
}
async function doStep(s) {
  const d = frameDoc();
  if (s.at) { setClock(s.at); commit(); }
  else if (s.as) { setPersona(s.as); commit(); }
  else if (s.go) go(s.go, s.params || {});
  else if (s.click) { const el = byText(s.click, s.within); if (!el) return `${tx('common.doStep.text.5', { click: s.click })}`; el.click(); }
  else if (s.sel) { const el = d.querySelector(s.sel); if (!el) return `${tx('common.doStep.text.4', { sel: s.sel })}`; el.click(); }
  else if (s.fill) {
    const el = d.querySelector(`[name="${s.fill}"],[data-bind="${s.fill}"]`) || d.querySelector(s.fill);
    if (!el) return `${tx('common.doStep.text.3', { fill: s.fill })}`;
    el.value = s.value; el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true }));
  } else if (s.see) { if (!norm(d.body.textContent).includes(norm(s.see))) return `${tx('common.doStep.text.2', { see: s.see })}`; }
  else if (s.no) { if (norm(d.getElementById('root').textContent).includes(norm(s.no))) return `${tx('common.doStep.text', { no: s.no })}`; }
  await wait(); await wait();
  return null;
}
const clearToast = () => frameDoc().getElementById('toasts')?.replaceChildren(); // 앞 사람 화면의 알림이 다음 사람 화면에 남지 않게
export function openBeat(b) {
  clearToast();
  if (b.at) setClock(b.at);
  if (b.as) setPersona(b.as);
  commit();
  go(b.go?.[0] || firstScreen(), b.go?.[1] || {});
}
export async function playBeat(b) {
  openBeat(b); await wait(); await wait();
  const bad = [];
  for (const s of b.steps || []) { const e = await doStep(s); if (e) { bad.push(`${tx('common.playBeat.text', { scene: b.scene, v: b.say || '', e })}`); break; } }
  return bad;
}
/** 시험과 시작 상태. upto 장면까지 처음부터 눌러 본다. */
export async function playAll(upto = 99, onEach, only) {
  const fails = [];
  const list = beats().filter((b) => b.scene <= upto && (!only || only === b.mod));
  for (let i = 0; i < list.length; i++) { fails.push(...await playBeat(list[i])); db.beat = i + 1; await onEach?.(list[i]); }
  commit();
  return fails;
}

/** 41장면에 없는 부록·없음 화면의 단계(모듈 extra). 41장면 뒤 상태에서 이어 누른다. */
export async function playExtra(only, onEach) {
  const fails = [];
  for (const m of modules) {
    if (only && only !== m.key) continue;
    for (const b of m.extra || []) { fails.push(...await playBeat({ ...b, scene: b.scene ?? m.key })); await onEach?.({ ...b, scene: 'x' + m.key, ord: (m.extra.indexOf(b)) }); }
  }
  commit();
  return fails;
}

async function resetTo(key) {
  reset(); ui.fails = [];
  const [, upto, clock] = START[key];
  commit();
  if (upto) { ui.busy = true; paint(); const f = await playAll(upto); ui.busy = false; if (f.length) console.warn(f); setClock(clock); db.beat = beats().filter((b) => b.scene <= upto).length; }
  ui.pop = '';
  commit(); go(firstScreen());
  toast(key === 'DEFAULT' ? tx('common.resetTo.toast') : `${tx('common.resetTo.text', { v: START[key][0] })}`);
}

// --- 주소로 여는 입구: 메인 홈에서 온다. app.html?as=계정&go=화면, ?beat=순서, ?x=번호 ---
export const beatList = () => beats();
export const extraList = () => extras();
async function loadEnd() { replaceDb(await loadData('end-state')); }
function veil(on, text = '') {
  let v = document.getElementById('veil');
  if (!on) { v?.remove(); return; }
  if (!v) { v = document.createElement('div'); v.id = 'veil'; v.setAttribute('role', 'status'); document.body.append(v); }
  v.textContent = text;
}
async function playTo(n) { // 안내가 쓰는 시작 자료. 지정한 순서까지 눌러 둔다
  const list = beats();
  for (let i = 0; i < n; i++) { veil(true, hx('enter.wait').replace('{n}', i + 1).replace('{total}', n)); await playBeat(list[i]); db.beat = i + 1; }
  veil(false);
}
export async function enterFromUrl() {
  const q = new URLSearchParams(location.search), beat = q.get('beat'), x = q.get('x'), as = q.get('as'), tour = q.get('tour');
  if (beat === null && x === null && !as && !tour) return;
  history.replaceState(null, '', location.pathname); // 새로 고침은 저장 상태를 쓴다
  const fresh = db.beat === 0 && !db.outbox.length;
  if (beat !== null) {
    const list = beats(), n = Math.min(+beat, list.length - 1);
    reset(); commit(); ui.busy = true; paint();
    for (let i = 0; i < n; i++) { veil(true, hx('enter.wait').replace('{n}', i + 1).replace('{total}', n)); await playBeat(list[i]); db.beat = i + 1; }
    ui.busy = false; veil(false); ui.fails = []; db.beat = n; openBeat(list[n]);
  } else if (tour) {
    if (fresh) await loadEnd();
    paint(); await startTour(tour, () => document.querySelector('[data-do="help"]'));
  } else if (x !== null) {
    if (fresh) await loadEnd();
    openBeat(extras()[+x]);
  } else {
    if (fresh) await loadEnd();
    setPersona(as); commit(); go(q.get('go') || firstScreen());
  }
  paint();
}

// --- 막대 ---
function barHtml() {
  return `<div class="devbar tb-bar" role="region" aria-label="${tx('common.barHtml.ariaLabel')}">
  ${topbarHtml('data-do="help" data-tip="tip.help"')}
  <div class="bar-tools">
    <span class="bar-demo"><b>${tx('common.barHtml.span')}</b> <span class="note">${tx('common.barHtml.span.2')}</span></span>
    <span class="num bar-clock">${tx('common.barHtml.span.4', { stamp: fmt.stamp(db.now) })}</span>
    <button class="btn btn-sm" type="button" data-do="screen" data-tip="tip.screen">${hx('bar.screen')}</button>
    <button class="btn btn-sm" type="button" data-do="explain" data-tip="tip.explain" aria-pressed="${explainOn()}">${explainOn() ? hx('bar.explain.off') : hx('bar.explain.on')}</button>
    <button class="btn btn-sm" type="button" data-do="guide" data-tip="tip.guide">${ui.guide ? tx('common.barHtml.text.2') : tx('common.barHtml.text')}</button>
    <button class="btn btn-sm" type="button" data-pop="tools" data-tip="tip.tools" aria-haspopup="dialog" aria-expanded="${ui.pop === 'tools'}">${hx('bar.tools')}</button>
    ${githubLink}
  </div>
</div>`;
}
const toolRow = (attr, label, tip) => `<button class="tool" type="button" ${attr}><b>${label}</b><span>${hx(tip)}</span></button>`;
function toolsHtml() {
  return `<section class="pop" aria-label="${hx('bar.tools')}"><h2>${hx('bar.tools')}</h2>
    ${toolRow('data-pop="clock"', tx('common.barHtml.btn.2'), 'tip.clock')}
    ${toolRow('data-pop="reset"', tx('common.barHtml.btn.3'), 'tip.reset')}
    ${toolRow('data-pop="sms"', tx('common.barHtml.btn.4', { length: db.sms.length }), 'tip.sms')}
    ${toolRow('data-do="wide"', isPhone() ? tx('common.barHtml.text.4') : tx('common.barHtml.text.3'), 'tip.wide')}
    <div class="tools-narrow">
      ${toolRow('data-do="screen"', hx('bar.screen'), 'tip.screen')}
      ${toolRow('data-do="explain"', explainOn() ? hx('bar.explain.off') : hx('bar.explain.on'), 'tip.explain')}
      ${toolRow('data-do="guide"', ui.guide ? tx('common.barHtml.text.2') : tx('common.barHtml.text'), 'tip.guide')}
    </div>
  </section>`;
}
function popHtml() {
  if (ui.pop === 'tools') return toolsHtml();
  if (ui.pop === 'clock') {
    const chips = [...new Set(beats().map((b) => b.at).filter(Boolean))];
    const [d, t] = fmt.stamp(db.now).split(' ');
    return `<section class="pop" aria-label="${tx('common.popHtml.ariaLabel.2')}"><h2>${tx('common.popHtml.ariaLabel.2')}</h2><p class="hint">${tx('common.popHtml.p.2')}</p>
    <div class="row2"><label>${tx('common.popHtml.label')}<input id="ck-d" type="date" value="${d}"></label><label>${tx('common.popHtml.label.2')}<input id="ck-t" type="time" step="1" value="${t}"></label></div>
    <h3 class="t-label muted">${tx('common.popHtml.h3')}</h3><div class="chips">${chips.map((c) => `<button class="chip" type="button" data-chip="${c}">${label(c)}</button>`).join('')}</div>
    <div class="row2"><button class="btn btn-primary btn-sm" type="button" data-do="clock">${tx('common.popHtml.btn.3')}</button><button class="btn btn-secondary btn-sm" type="button" data-do="close">${tx('common.popHtml.btn.2')}</button></div></section>`;
  }
  if (ui.pop === 'reset') {
    const k = ui.start, name = START[k][0];
    const body = k === 'DEFAULT' ? tx('common.popHtml.text.2') : `${tx('common.popHtml.text', { name, slice: START[k][2].slice(0, 10) })}`;
    return `<section class="pop" aria-label="${tx('common.popHtml.ariaLabel')}"><h2>${tx('common.popHtml.h2')}</h2><div class="chips">${Object.entries(START).map(([key, v]) => `<button class="chip" type="button" data-start="${key}" aria-pressed="${key === k}">${v[0]}</button>`).join('')}</div><p class="hint">${body}</p>
    <div class="row2"><button class="btn btn-primary btn-sm" type="button" data-do="reset">${tx('common.popHtml.btn')}</button><button class="btn btn-secondary btn-sm" type="button" data-do="close">${tx('common.popHtml.btn.2')}</button></div></section>`;
  }
  if (ui.pop === 'sms') return `<section class="pop" aria-label="${tx('common.popHtml.ariaLabel.4')}"><h2>${tx('common.popHtml.ariaLabel.4')}</h2><p class="hint">${tx('common.popHtml.p.4')}</p>${db.sms.length ? `<table><tbody>${db.sms.slice().reverse().map((m) => `<tr><td class="num">${label(m.at)}</td><td>${esc(m.to)}</td><td>${esc(m.text)}</td></tr>`).join('')}</tbody></table>` : `<p class="hint">${tx('common.popHtml.p')}</p>`}<div class="row2"><button class="btn btn-secondary btn-sm" type="button" data-do="close">${tx('common.popHtml.btn.4')}</button></div></section>`;
  return '';
}
function guideHtml() {
  const list = beats(); const i = Math.min(db.beat, Math.max(list.length - 1, 0)); const b = list[i];
  if (!b) return `<h2>${tx('common.guideHtml.h2')}</h2><p class="k">${tx('common.guideHtml.p.2')}</p>`;
  const sc = SCENES.find((s) => s.n === b.scene) || {};
  return `<h2>${tx('common.guideHtml.h2.2', { scene: b.scene, length: SCENES.length })}</h2>
  <p class="k">${esc(sc.at)} · ${esc(sc.who)}</p>
  <p class="k">${tx('common.guideHtml.p.3', { v: i + 1, length: list.length, v2: b.at ? ` ${tx('common.guideHtml.text', { label: label(b.at) })}` : '', v3: b.as ? ` · ${esc(PERSONAS[b.as].name)}` : '' })}</p>
  <p class="say">${esc(b.say || '')}</p>
  ${ui.busy ? `<p class="k">${tx('common.guideHtml.p')}</p>` : `<div class="acts"><button class="btn btn-primary btn-sm" type="button" data-do="open" data-tip="tip.open">${tx('common.guideHtml.btn')}</button><button class="btn btn-secondary btn-sm" type="button" data-do="play" data-tip="tip.play">${tx('common.guideHtml.btn.2')}</button><button class="btn btn-secondary btn-sm" type="button" data-do="prev" data-tip="tip.prev">${tx('common.guideHtml.btn.3')}</button><button class="btn btn-secondary btn-sm" type="button" data-do="next" data-tip="tip.next">${tx('common.guideHtml.btn.4')}</button></div>`}
  ${ui.fails.map((f) => `<p class="fail">${esc(f)}</p>`).join('')}
  <p class="k">${esc(sc.show || '')}</p>
  <details><summary>${tx('common.guideHtml.summary')}</summary><ol>${SCENES.map((s) => { const j = list.findIndex((x) => x.scene === s.n); return `<li><button type="button" data-jump="${j}" aria-current="${s.n === b.scene}"${j < 0 ? ' disabled' : ''}>${s.n}. ${esc(s.at)} ${esc(s.who)}</button></li>`; }).join('')}</ol></details>
  <details><summary>${tx('common.guideHtml.extra')}</summary><ol>${extras().map((x, n) => `<li><button type="button" data-xb="${n}">${esc(x.say || x.go[0])}</button></li>`).join('')}</ol></details>`;
}
// 기본은 기기 폭으로 고른다. 사용자가 직접 바꾼 값만 기억한다.
const VIEW = 'evenstay-view';
const chosenView = () => { try { return localStorage.getItem(VIEW); } catch { return null; } };
const isPhone = () => { const v = chosenView(); return v ? v === 'mobile' : window.innerWidth < 768; };

export function paint() {
  const bar = document.getElementById('bar');
  bar.innerHTML = barHtml();
  document.documentElement.style.setProperty('--bar-h', `${bar.offsetHeight}px`); // 막대가 두 줄이 되어도 팝업이 막대 아래에서 열린다
  document.getElementById('pop').innerHTML = popHtml();
  document.getElementById('guide').innerHTML = guideHtml();
  hideTip(); decorate();
  document.querySelector('.stage-view').classList.toggle('is-phone', isPhone());
  document.getElementById('stage').classList.toggle('no-guide', !ui.guide);
}

// 좁은 폭에서는 막대 버튼이 시연 도구 안으로 들어가므로 보이는 쪽으로 포커스를 돌린다
const shownOpener = (sel) => () => [...document.querySelectorAll(sel)].find((e) => e.offsetParent) || document.querySelector('[data-pop="tools"]');
async function onClick(e) {
  const t = e.target.closest('button'); if (!t || t.classList.contains('tb-theme')) return;
  const d = t.dataset;
  if (d.pop) { ui.pop = ui.pop === d.pop ? '' : d.pop; }
  else if (d.chip) { const [a, b] = d.chip.split('T'); document.getElementById('ck-d').value = a; document.getElementById('ck-t').value = b; return; }
  else if (d.start) { ui.start = d.start; }
  else if (d.xb) { openBeat(extras()[+d.xb]); }
  else if (d.jump) { db.beat = +d.jump; ui.fails = []; commit(); }
  else if (d.do === 'close') ui.pop = '';
  else if (d.do === 'clock') { const v = `${document.getElementById('ck-d').value}T${document.getElementById('ck-t').value}`; const iso = v.length === 16 ? v + ':00' : v; setClock(iso); ui.pop = ''; commit(); toast(`${tx('common.onClick.text', { stamp: fmt.stamp(iso) })}`); }
  else if (d.do === 'reset') { await resetTo(ui.start); }
  else if (d.do === 'help') { ui.pop = ''; paint(); await openChooser(() => document.querySelector('[data-do="help"]')); return; }
  else if (d.do === 'screen') { ui.pop = ''; paint(); openScreen(currentId(), shownOpener('[data-do="screen"]')); return; }
  else if (d.do === 'explain') { ui.pop = ''; setExplain(!explainOn()); shownOpener('[data-do="explain"]')()?.focus(); return; }
  else if (d.do === 'wide') { try { localStorage.setItem(VIEW, isPhone() ? 'desktop' : 'mobile'); } catch { /* 저장이 막혀도 이번 화면은 그대로 둔다 */ } }
  else if (d.do === 'guide') ui.guide = !ui.guide;
  else if (d.do === 'prev') { db.beat = Math.max(db.beat - 1, 0); ui.fails = []; commit(); }
  else if (d.do === 'next') { db.beat = Math.min(db.beat + 1, beats().length - 1); ui.fails = []; commit(); }
  else if (d.do === 'open') openBeat(beats()[db.beat]);
  else if (d.do === 'play') { ui.busy = true; paint(); ui.fails = await playBeat(beats()[db.beat]); ui.busy = false; if (!ui.fails.length) db.beat = Math.min(db.beat + 1, beats().length - 1); commit(); }
  paint();
}

export async function mountStage() {
  await initTopbar({ current: () => db.persona, onPick: (id, to) => { setPersona(id); commit(); go(to || firstScreen()); toast(`${tx('common.onClick.text.2', { name: me().name, role: me().role })}`); } });
  document.addEventListener('click', onClick);
  document.addEventListener('keydown', (e) => { // 열린 막대 창은 Esc로 닫고 시연 도구 버튼으로 돌아간다
    if (e.key === 'Escape' && ui.pop) { ui.pop = ''; paint(); document.querySelector('[data-pop="tools"]')?.focus(); }
  });
  mountHelp(document.getElementById('frame'));
  hooks.afterRender = paint;
  mountTour({ pop: (v) => { ui.pop = v; }, guide: (v) => { ui.guide = v; }, guideOn: () => ui.guide, busy: () => ui.busy, paint, doStep, playTo });
  if (!startHidden()) startTour('start', () => document.querySelector('[data-do="help"]'));
  window.addEventListener('resize', paint);
  paint();
}
