// 프로토타입 공통 도구. 모듈은 이 파일과 api만 쓴다(다른 모듈 파일을 import하지 않는다, CLAUDE.md 규칙 2).
import { tx } from './text.js';
import { ICONS } from './icons.js';
import { PERSONAS } from './people.js';
import { STATE_KEY } from '../../shared/topbar.js';

export const db = {};      // 저장되는 상태 전체. db.now, db.persona, db.<모듈키>
export const view = {};    // 화면 안 임시 상태(탭, 대화창, 입력 값). 저장하지 않고 화면이 바뀌면 비운다
export const api = {};     // 모듈 공개 함수. api.core.residents()
export const route = { id: null, params: {} };
export const screens = {}, actions = {}, modules = [];
const subs = {};
const KEY = STATE_KEY;

export function register(m) {
  modules.push(m);
  api[m.key] = m.api || {};
  Object.assign(screens, m.screens || {});
  Object.assign(actions, m.actions || {});
  for (const [t, fn] of Object.entries(m.on || {})) (subs[t] ||= []).push(fn);
}

// 모듈 사이 변화는 이벤트로 전한다(규칙 4). 데모는 한 탭 안이라 같은 자리에서 바로 전달한다.
// shortcut: 소비자 멱등 처리 없음, 재시도가 없어서 중복 전달이 생기지 않는다.
export function emit(type, data = {}) {
  db.outbox.push({ id: ++db.seq, type, at: db.now, data });
  (subs[type] || []).forEach((fn) => fn(data));
}

export class Refuse extends Error {}
/** 불가능한 전이나 권한 거부. 메시지는 copy 문구를 쓴다. 화면에 띠로 보인다. */
export function refuse(msg) { throw new Refuse(msg); }

export const hooks = { render() {}, toast() {} };
export function save() { if (hooks.frozen) return; try { localStorage.setItem(KEY, JSON.stringify(db)); } catch { /* 저장소가 막혀도 화면은 돈다 */ } }
export function commit() { save(); hooks.render(); }
export function load() {
  try { const s = localStorage.getItem(KEY); if (s) { Object.assign(db, JSON.parse(s)); return true; } } catch { /* 깨진 저장 값은 시드로 시작 */ }
  return false;
}

export function reset() {
  for (const k of Object.keys(db)) delete db[k];
  Object.assign(db, { now: '2026-10-01T09:00:00', persona: 'hq.jung', seq: 0, outbox: [], sms: [], beat: 0 });
  modules.forEach((m) => { db[m.key] = m.seed ? m.seed() : {}; });
}

/** 저장해 둔 전체 상태로 바꾼다(메인 홈 입구) */
export function replaceDb(data) {
  for (const k of Object.keys(db)) delete db[k];
  Object.assign(db, data);
}

// --- 시계. 멈춘 시계이고 진행자가 옮길 때만 간다(US-17). ---
export function nowISO() { return db.now; }
export function now() { return new Date(db.now); }
export function setClock(iso) {
  const prev = db.now; db.now = iso;
  if (iso > prev) modules.forEach((m) => m.tick && m.tick(prev, iso));
  // 시간이 뒤로 가도 기록은 그대로 둔다.
}

// --- 계정 ---
export function me() { return PERSONAS[db.persona]; }
export function setPersona(id) { db.persona = id; }

// --- 이동 ---
export function href(id, params = {}) { const q = new URLSearchParams(params).toString(); return `#/${id}${q ? '?' + q : ''}`; }
export function go(id, params = {}) { const h = href(id, params); if (location.hash === h) hooks.render(); else location.hash = h; }

// 문자 로그(B·D·N2가 보내는 문자). 실제로 보내지 않고 쌓기만 한다.
export function sms(to, text, from = '') { db.sms.push({ at: db.now, to, text, from }); }

// --- 표시 ---
export const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
export const ic = (n) => `<svg class="i" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n] ?? ''}</svg>`;
const DAYS = tx('common.DAYS.text');
const D = (d) => (d instanceof Date ? d : new Date(d));
const p2 = (n) => String(n).padStart(2, '0');
export const fmt = {
  won: (n) => Number(n).toLocaleString('ko-KR') + tx('common.fmt.won'),
  num: (n) => Number(n).toLocaleString('ko-KR'),
  ymd: (d) => { d = D(d); return `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}`; },
  md: (d) => { d = D(d); return `${tx('common.fmt.text.3', { v: d.getMonth() + 1, getDate: d.getDate() })}`; },
  mdw: (d) => { d = D(d); return `${tx('common.fmt.text.2', { v: d.getMonth() + 1, getDate: d.getDate(), v2: DAYS[d.getDay()] })}`; },
  hm: (d) => { d = D(d); return `${p2(d.getHours())}:${p2(d.getMinutes())}`; },
  ampm: (d) => { d = D(d); const h = d.getHours(), m = d.getMinutes(); return `${tx('common.fmt.text.4', { v: h < 12 ? tx('common.fmt.ampm.2') : h === 12 ? tx('common.fmt.ampm.noon') : tx('common.fmt.ampm'), v2: h % 12 || 12, v3: m ? ` ${tx('common.fmt.text', { m })}` : '' })}`; },
  stamp: (d) => { d = D(d); return `${fmt.ymd(d)} ${fmt.hm(d)}:${p2(d.getSeconds())}`; },
};

// --- 화면 조각. 대화창과 시트는 render 결과에 넣는다. view 값으로 열고 닫는다. ---
export const overlay = (inner) => `<div class="scrim proto-scrim" role="presentation" data-scrim>${inner}</div>`;
/** 확인 창. actions는 버튼 HTML. 닫기는 data-set="dialog=" */
export const dialog = (title, body, actionsHtml) => overlay(`<section class="dialog" role="dialog" aria-modal="true" aria-label="${esc(title)}"><h2 class="t-heading2">${title}</h2>${body}<div class="actions">${actionsHtml}</div></section>`);
/** 오른쪽 시트(긴 입력). 데스크톱 480px, 좁으면 전폭 */
export const sheet = (title, body, actionsHtml) => sheetWrap(`<section class="proto-rsheet" role="dialog" aria-modal="true" aria-label="${esc(title)}"><h2 class="t-heading2">${title}</h2>${body}<div class="row" style="gap:8px;justify-content:flex-end;">${actionsHtml}</div></section>`);
/** 보드의 .rsheet 마크업을 그대로 쓸 때 바깥 틀만 씌운다 */
export const sheetWrap = (inner) => `<div class="proto-sheet-wrap" data-scrim>${inner}</div>`;
/** COM-04. 다른 화면으로 돌아가는 링크 하나 */
export const denied = (msg, backLabel, backHref) => `<section class="card state-card" aria-label="${tx('common.denied.ariaLabel')}"><span class="state-icon">${ic('lock')}</span><p class="t-heading2">${msg}</p>${backHref ? `<a class="btn btn-secondary btn-md" href="${backHref}" style="align-self:flex-start;">${backLabel}</a>` : ''}</section>`;
/** COM-06 */
export const empty = (msg) => `<div class="empty"><span class="state-icon">${ic('inbox')}</span><p class="t-body-md">${msg}</p></div>`;
export const toast = (msg) => hooks.toast(msg);
