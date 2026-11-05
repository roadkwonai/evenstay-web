// 공통 화면: COM-07 회원 첫 화면, COM-09 묶음 화면, CORE-01 오늘의 운영(규칙 8: app이 각 모듈 api를 붙여 조립한다).
// 숫자를 복사해 두지 않고 그릴 때마다 각 모듈 api로 읽는다.
import { tx } from '../lib/text.js';
import { api, db, esc, fmt, href, ic, me, view } from '../lib/kit.js';
import { RESIDENTS, SITES } from '../lib/people.js';

const none = `<span class="muted" aria-label="${tx('CORE-01.ariaLabel')}">-</span>`;
const val = (v) => (v === undefined || v === null ? none : v);
const tile = (icon, title, sub, to, cls = '') => `<li${cls ? ` class="${cls}"` : ''}><a class="cell" href="${to}">${ic(icon)}<span class="body"><span class="title">${title}</span><span class="sub">${sub}</span></span>${ic('chevron-right')}</a></li>`;

function billSub(rid) {
  const inv = api.core.latestInvoice?.(rid);
  return inv ? `${tx('COM-07.text.4', { v: +inv.month.slice(5) })}` : tx('COM-07.text.3');
}

function home() {
  const p = me(), rid = p.residentId;
  if (p.key === 'PROXY') {
    const who = api.core.residentName?.(rid) ?? RESIDENTS[rid].name;
    return `<section class="stack">
      <h1 class="t-title3">${tx('COM-07.h1.2', { name: esc(p.name) })}</h1>
      <p class="t-body-lg">${tx('COM-07.p')}</p>
      <div class="scope">${ic('eye')}<p class="t-body-lg">${tx('COM-07.p.2', { who: esc(who) })}</p></div>
    </section>
    <nav aria-label="${tx('COM-07.ariaLabel.3')}"><ul class="list card flush tiles">
      ${tile('file-text', tx('COM-07.tile.8'), billSub(rid), href('CORE-08'))}
      ${tile('message-circle', tx('COM-07.tile.7'), tx('COM-07.tile.6'), href('AST-02'))}
    </ul></nav>`;
  }
  const n = api.community.importantNotice?.(rid);
  const band = n ? `<a class="alert notice-band" href="${href('CMN-11', { id: n.id })}" aria-label="${tx('COM-07.ariaLabel.2')}">${ic('megaphone')}
      <p class="t-body-lg">${n.count > 1 ? `${tx('COM-07.text.2', { count: n.count })}` : `${tx('COM-07.text', { title: esc(n.title) })}`}</p>
      <span class="go">${tx('COM-07.span')}${ic('chevron-right')}</span></a>` : '';
  const calling = api.safety.isCalling?.(rid);
  return `<section class="stack">
      <h1 class="t-title3">${tx('COM-07.h1', { name: esc(p.name) })}</h1>
      <p class="t-body-lg">${tx('COM-07.p')}</p>
    </section>
    ${band}
    <nav aria-label="${tx('COM-07.ariaLabel')}"><ul class="list card flush tiles tiles-3">
      ${tile('calendar', tx('COM-07.tile.12'), api.community.homeToday?.(rid) || tx('COM-07.tile.11'), href('COM-09'))}
      ${tile('clipboard-list', tx('COM-07.tile.10'), api.requests.homeSub?.(rid) || tx('COM-07.tile.9'), href('REQ-01'))}
      ${tile('file-text', tx('COM-07.tile.8'), billSub(rid), href('CORE-08'))}
      ${tile('message-circle', tx('COM-07.tile.7'), tx('COM-07.tile.6'), href('AST-02'))}
      ${tile('users', tx('COM-07.tile.5'), tx('COM-07.tile.4'), href('FAM-01'))}
      ${tile('x4', tx('COM-07.tile.3'), calling ? tx('COM-07.tile.2') : tx('COM-07.tile'), href('COM-09', { g: 'safe' }))}
    </ul></nav>`;
}

function bundle({ g }) {
  const feat = api.community.features?.() || { programs: true, places: true, notices: true }; // CMN-22에서 끈 기능은 타일을 뺀다
  if (g === 'safe') {
    return `<section class="stack"><h1 class="t-title3">${tx('COM-09.h1.2')}</h1><p class="t-body-lg">${tx('COM-09.p')}</p></section>
    <nav aria-label="${tx('COM-09.h1.2')}"><ul class="list card flush tiles">
      ${tile('x4', tx('COM-09.tile.12'), tx('COM-09.tile.11'), href('TRN-09'))}
      ${tile('contact-round', tx('COM-09.tile.10'), tx('COM-09.tile.9'), href('CORE-08', { focus: 'contacts' }))}
      ${tile('x5', tx('COM-09.tile.8'), tx('COM-09.tile.7'), href('SAF-09'), 'span-all')}
    </ul></nav>`;
  }
  return `<section class="stack"><h1 class="t-title3">${tx('COM-09.h1')}</h1><p class="t-body-lg">${tx('COM-09.p')}</p></section>
    <nav aria-label="${tx('COM-09.h1')}"><ul class="list card flush tiles">
      ${feat.programs ? tile('calendar-days', tx('COM-09.tile.6'), tx('COM-09.tile.5'), href('CMN-02')) : ''}
      ${feat.places ? tile('door-open', tx('COM-09.tile.4'), tx('COM-09.tile.3'), href('CMN-08')) : ''}
      ${feat.notices ? tile('megaphone', tx('COM-09.tile.2'), tx('COM-09.tile'), href('CMN-10'), 'span-all') : ''}
    </ul></nav>`;
}

function todoCard(p) {
  const rows = [...(api.core.todos?.(p) || []), ...(api.transitions.inbox?.(p) || [])];
  const list = view.allTodo ? rows : rows.slice(0, 5);
  if (!rows.length) {
    return `<section class="card" aria-labelledby="todo"><h2 id="todo" class="t-heading2">${tx('CORE-01.h2')}</h2>
      <div class="stack" style="gap: 4px;"><p class="t-headline">${tx('CORE-01.p.3')}</p><p class="muted">${tx('CORE-01.p.4')}</p></div></section>`;
  }
  return `<section class="card" aria-labelledby="todo">
    <div class="row between"><h2 id="todo" class="t-heading2">${tx('CORE-01.h2')}</h2><span class="muted">${tx('CORE-01.span', { length: rows.length })}</span></div>
    <ul class="list">${list.map((t) => `<li class="cell"><span class="body"><span class="title">${esc(t.text)}</span>${t.sub ? `<span class="sub">${esc(t.sub)}</span>` : ''}</span><a class="btn btn-ghost btn-sm" href="${t.href}">${tx('CORE-01.btn.5')}${ic('chevron-right')}</a></li>`).join('')}</ul>
    ${rows.length > 5 && !view.allTodo ? `<button class="btn btn-ghost btn-sm" type="button" data-set="allTodo=1">${tx('CORE-01.btn.4')}</button>` : ''}
  </section>`;
}

const stat = (label, to, v, unit, sub = '') => `<a href="${href(to)}"><span class="k">${label}${ic('chevron-right')}</span><span class="v">${v === undefined || v === null ? none : `${v}<span class="u">${unit}</span>`}</span>${sub ? `<span class="sub">${sub}</span>` : ''}</a>`;
const metric = (label, big, line, more = '') => `<section class="metric" aria-label="${label}"><h3>${label}</h3><p class="big">${val(big)}</p><p class="line">${line}</p>${more}</section>`;

function layers() {
  const s = api.safety.board?.() || {}, r = api.requests.board?.() || {}, c = api.community.board?.() || {};
  const f = api.family.consentSummary?.() || {}, a = api.assistant.usageSummary?.() || {}, o = api.core.occupancy?.('S1') || {};
  const abs = api.core.openAbsences?.();
  const overdue = abs?.filter((x) => x.overdue).length || 0;
  return `<div class="stat-strip" aria-label="${tx('CORE-01.ariaLabel.2')}">
      ${stat(tx('CORE-01.cell.4'), 'SAF-01', s.unclaimed, tx('CORE-01.stat.3'))}
      ${stat(tx('CORE-01.cell.3'), 'SAF-08', s.disconnected, tx('CORE-01.stat.2'))}
      ${stat(tx('CORE-01.cell.2'), 'CORE-13', abs?.length, overdue ? `${tx('CORE-01.text.15', { overdue })}` : tx('CORE-01.stat'))}
      ${stat(tx('CORE-01.cell'), 'REQ-12', r.overdue, `${tx('CORE-01.text.14', { v: r.open ?? 0, v2: r.unassigned ?? 0 })}`, r.todayRoutine ? (r.todayRoutine.total ? tx('CORE-01.routine', r.todayRoutine) : tx('REQ-12.empty.3')) : '')}
    </div>
    <div class="metrics">
      ${metric(tx('CORE-01.metric.11'), o.occupied !== undefined ? `${tx('CORE-01.text.13', { occupied: o.occupied })}` : null, `${tx('CORE-01.text.12', { v: o.total ?? '-' })}`)}
      ${metric(tx('CORE-01.metric.10'), s.ackMinutes !== undefined && s.ackMinutes !== null ? `${tx('CORE-01.text.11', { ackMinutes: s.ackMinutes })}` : null, tx('CORE-01.metric.9'))}
      ${metric(tx('CORE-01.metric.8'), s.duty?.first, s.duty ? `${tx('CORE-01.text.10', { second: esc(s.duty.second), third: esc(s.duty.third) })}` : tx('CORE-01.metric.7'))}
      ${metric(tx('CORE-01.metric.6'), f.linked !== undefined ? `${tx('CORE-01.text.9', { linked: f.linked })}` : null, tx('CORE-01.metric.5'), `<a class="btn btn-ghost btn-sm more" href="${href('FAM-09')}">${tx('CORE-01.btn.3')}</a>`)}
      ${metric(tx('CORE-01.metric.4'), a.chats !== undefined ? `${tx('CORE-01.text.8', { chats: a.chats })}` : null, a.range ? `${tx('CORE-01.text.7', { range: esc(a.range) })}` : tx('CORE-01.metric.3'))}
      ${metric(tx('CORE-01.metric.2'), c.sessions !== undefined ? `${tx('CORE-01.text.6', { sessions: c.sessions })}` : null, c.sessions !== undefined ? `${tx('CORE-01.text.5', { attendancePending: c.attendancePending, bookings: c.bookings, unreadNotices: c.unreadNotices, unreadRooms: c.unreadRooms })}` : tx('CORE-01.metric'), `<a class="btn btn-ghost btn-sm more" href="${href('CMN-14', { tab: 'notice' })}">${tx('CORE-01.btn.2')}</a>`)}
    </div>`;
}

function sitesTable() {
  const s = api.safety.board?.() || {}, r = api.requests.board?.() || {}, abs = api.core.openAbsences?.() || [];
  const cell = (l, v) => `<td class="r" data-label="${l}">${val(v)}</td>`;
  return `<section class="stack" aria-labelledby="sites">
    <h2 id="sites" class="t-heading2">${tx('CORE-01.h2.2')}</h2>
    <div class="tbl reflow"><table aria-label="${tx('CORE-01.h2.2')}">
      <thead><tr><th>${tx('CORE-01.th')}</th><th class="r">${tx('CORE-01.cell.4')}</th><th class="r">${tx('CORE-01.cell.3')}</th><th class="r">${tx('CORE-01.cell.2')}</th><th class="r">${tx('CORE-01.cell')}</th><th></th></tr></thead>
      <tbody>
        <tr><td data-label="${tx('CORE-01.th')}"><strong>${SITES.S1.name}</strong></td>${cell(tx('CORE-01.cell.4'), s.unclaimed !== undefined ? `${tx('CORE-01.text.4', { unclaimed: s.unclaimed })}` : null)}${cell(tx('CORE-01.cell.3'), s.disconnected !== undefined ? `${tx('CORE-01.text.3', { disconnected: s.disconnected })}` : null)}${cell(tx('CORE-01.cell.2'), `${tx('CORE-01.text.2', { length: abs.length })}`)}${cell(tx('CORE-01.cell'), r.overdue !== undefined ? `${tx('CORE-01.text', { overdue: r.overdue })}` : null)}<td><a class="btn btn-ghost btn-sm" href="${href('CORE-02')}">${tx('CORE-01.btn.5')}</a></td></tr>
        <tr><td data-label="${tx('CORE-01.th')}"><strong>${SITES.S2.name}</strong></td>${cell(tx('CORE-01.cell.4'))}${cell(tx('CORE-01.cell.3'))}${cell(tx('CORE-01.cell.2'))}${cell(tx('CORE-01.cell'))}<td><a class="btn btn-ghost btn-sm" href="${href('CORE-02')}">${tx('CORE-01.btn.5')}</a></td></tr>
      </tbody>
    </table></div>
  </section>`;
}

function today() {
  const p = me();
  return `<div class="page-head"><h1 class="t-title2">${tx('CORE-01.title')}</h1>
      <p class="asof">${tx('CORE-01.p', { ymd: fmt.ymd(db.now), hm: fmt.hm(db.now) })} <button class="btn btn-ghost btn-sm" type="button" data-set="reload=${db.now}">${ic('refresh-cw')}${tx('CORE-01.btn')}</button></p></div>
    ${todoCard(p)}
    ${p.key === 'MANAGER' ? layers() : ''}
    ${p.key === 'HQ_ADMIN' || p.key === 'HQ_OPS' ? sitesTable() : ''}
    <p class="demo-note">${tx('CORE-01.p.2')}</p>`;
}

export default {
  key: 'common',
  seed: () => ({}),
  api: {},
  actions: {},
  screens: {
    'COM-07': { app: 'home', title: tx('COM-07.title'), render: home },
    'COM-09': { app: 'home', title: tx('COM-09.title'), render: bundle },
    'CORE-01': { app: 'ops', title: tx('CORE-01.title'), render: today },
  },
  flow: [
    { scene: 1, ord: 1, at: '2026-10-01T09:00:00', as: 'hq.jung', go: ['CORE-01'], say: tx('flow.common.s1.say'), steps: [{ see: tx('flow.common.s1.see.2') }, { see: tx('flow.common.s1.see') }] },
    { scene: 9, ord: 1, at: '2026-11-12T07:30:00', as: 'st.choiym', go: ['CORE-01'], say: tx('flow.common.s9.say'), steps: [{ see: tx('CORE-01.cell.4') }, { see: tx('common.NAV.text.13') }, { see: tx('CORE-01.cell.2') }] },
    { scene: 18, ord: 6, at: '2026-11-17T17:10:00', as: 'st.choiym', go: ['CORE-01'], say: tx('flow.common.s18.say'), steps: [{ see: tx('CORE-01.cell') }] },
    { scene: 22, ord: 2, at: '2026-11-18T16:10:00', as: 'st.choiym', go: ['CORE-01'], say: tx('flow.common.s22.say'), steps: [{ see: tx('common.NAV.text.9') }] },
    { scene: 30, ord: 3, at: '2026-12-07T16:45:00', as: 'st.parksy', go: ['CORE-01'], say: tx('flow.common.s30.say'), steps: [{ see: tx('flow.common.s30.see') }, { no: tx('flow.common.s30.no') }] },
    { scene: 34, ord: 2, at: '2026-12-10T16:30:00', as: 'st.parksy', go: ['CORE-01'], say: tx('flow.common.s34.say'), steps: [{ see: tx('TRN-08.title') }] },
  ],
};
