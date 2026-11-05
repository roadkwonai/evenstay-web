// SAF-09 안심 알림(회원). 호출 중 상태, 비상 때 도움, 내 방 장치 안내, 기록. 마크업은 캔버스 보드(ref/SAF-09.html)를 옮겼다.
import { tx } from '../../lib/text.js';
import { denied, esc, fmt, href, ic, me, nowISO, refuse } from '../../lib/kit.js';
import * as L from './logic.js';
import { SOURCE_LABEL, daypart, koTime, pn } from './logic.js';

// 이 회원의 가장 최근 호출(호출벨, 프런트 전화). 조치가 끝난 호출은 그날까지만 보인다.
function callOf(rid) {
  const list = L.S().alerts.filter((a) => a.residentId === rid && ['CALL_BELL', 'FRONT_CALL'].includes(L.signalOf(a).source)).sort((x, y) => (L.signalOf(x).receivedAt < L.signalOf(y).receivedAt ? 1 : -1));
  const a = list[0];
  return a && (a.status !== 'RESOLVED' || L.dateOf(a.resolvedAt) === L.dateOf(nowISO())) ? a : null;
}
const stepOf = (a) => (a.status === 'RESOLVED' || a.metAt ? 4 : a.status === 'ACKNOWLEDGED' ? 2 : a.status === 'ESCALATED' ? 3 : 1);

function callCard(rid) {
  const a = callOf(rid), step = a ? stepOf(a) : 0, active = a && step < 4;
  const rows = [[tx('SAF-09.step.1'), tx('SAF-09.step.1.sub')], [tx('SAF-09.step.2'), a?.ackBy ? tx('SAF-09.step.2.sub', { pn: pn(a.ackBy) }) : ''], [tx('SAF-09.step.3'), tx('SAF-09.step.3.sub')], [tx('SAF-09.step.4'), tx('SAF-09.step.4.sub')]];
  const list = a ? `<ol class="list">${rows.map(([t, sub], i) => `<li class="cell"${i + 1 === step ? ' aria-current="step"' : ''}><span class="body"><span class="title">${t}</span>${sub ? `<span class="sub">${sub}</span>` : ''}</span>${i + 1 === step ? `<span class="badge badge-brand">${tx('SAF-09.now')}</span>` : ''}</li>`).join('')}</ol>` : `<p class="t-body-lg">${tx('SAF-09.idle')}</p>`;
  const demo = active ? '' : `<div class="stack"><p class="t-body-md muted">${tx('SAF-09.demo.note')}</p><button class="btn btn-secondary btn-block" type="button" data-act="saf.home.call">${tx('SAF-09.demo.btn')}</button></div>`;
  return `<section class="card" aria-labelledby="call-h">
      <h2 id="call-h" class="t-heading1">${tx('SAF-09.call.h2')}</h2>
      ${list}
      ${active ? `<p class="t-body-md muted">${tx('SAF-09.call.note')}</p>` : demo}
    </section>`;
}
function assistBlock(rid) {
  return L.assistOf(rid)?.needs
    ? `<section class="stack" aria-label="${tx('SAF-09.assist.aria')}"><p class="t-body-lg">${tx('SAF-09.assist.done')}</p>${L.assistOf(rid).source === 'SELF' ? `<button class="btn btn-secondary btn-block" type="button" data-act="saf.assist.clear">${tx('SAF-09.assist.cancel')}</button>` : ''}</section>`
    : `<section class="stack" aria-label="${tx('SAF-09.assist.aria')}"><p class="t-body-lg">${tx('SAF-09.assist.p')}</p><button class="btn btn-secondary btn-block" type="button" data-act="saf.assist.set">${tx('SAF-09.assist.btn')}</button></section>`;
}
function devices(rid) {
  const item = (t, sub) => `<li class="cell"><span class="body"><span class="title">${t}</span><span class="sub">${sub}</span></span></li>`;
  return [L.linkActive('BED_SENSOR', rid) ? item(SOURCE_LABEL.BED_SENSOR, tx('SAF-09.dev.bed')) : '', item(SOURCE_LABEL.CALL_BELL, tx('SAF-09.dev.bell')), L.linkActive('ACCESS_LOG', rid) ? item(SOURCE_LABEL.ACCESS_LOG, tx('SAF-09.dev.door')) : '',
    item(tx('SAF-09.dev.call.title'), tx('SAF-09.dev.call')), L.S().visitPlan.residentIds.includes(rid) ? item(SOURCE_LABEL.VISIT, tx('SAF-09.dev.visit')) : ''].join('');
}
function records(rid) {
  const met = L.S().alerts.filter((a) => a.residentId === rid && a.metAt).sort((x, y) => (x.metAt < y.metAt ? 1 : -1));
  const lines = met.map((a) => {
    const w = a.outcome?.decision === 'WITHHOLD' && a.outcome.why === 'MEMBER_REQUEST'
      ? `<p class="t-body-lg">${tx('SAF-09.rec.withheld', { md: fmt.md(a.metAt), daypart: daypart(+a.metAt.slice(11, 13)), pn: pn(a.ackBy) })}</p>` : '';
    return `<li class="cell"><span class="body"><span class="title">${tx('SAF-09.rec.title', { pn: pn(a.ackBy) })}</span><span class="sub">${fmt.md(a.metAt)} ${koTime(a.metAt)}</span></span></li>${w ? `<li>${w}</li>` : ''}`;
  }).join('');
  const names = L.viewersOf(rid).map((p) => tx('SAF-09.news.name', { relation: p.relation, name: esc(p.name) })).join(', ');
  return `${lines ? `<ul class="list">${lines}</ul>` : `<p class="t-body-lg">${tx('SAF-09.rec.empty')}</p>`}
        <p class="t-body-lg">${tx('SAF-09.news.p')}</p>
        <p class="t-body-lg">${names ? tx('SAF-09.news.who', { names }) : tx('SAF-09.news.none')}</p>
        <a class="btn btn-secondary btn-block" href="${href('FAM-01')}">${tx('SAF-09.news.btn')}</a>
        <p class="t-body-md muted">${tx('SAF-09.news.front')}</p>`;
}
function saf09() {
  const p = me();
  if (p.key !== 'MEMBER') return denied(tx('safety.shared.denied'));
  const rid = p.residentId;
  return `<section class="stack">
      <h1 class="t-title3">${tx('SAF-09.title')}</h1>
      <p class="t-body-lg">${tx('SAF-09.lead')}</p>
    </section>
    ${callCard(rid)}
    ${assistBlock(rid)}
    <section class="stack" aria-label="${tx('SAF-09.other.aria')}">
      <p class="t-body-lg">${tx('SAF-09.other.1')}</p>
      <p class="t-body-lg">${tx('SAF-09.other.2')}</p>
      <div class="alert">${ic('info')}<p class="t-body-lg">${tx('SAF-09.other.119')}</p></div>
    </section>
    <div class="pair">
      <details class="card fold" aria-labelledby="dev-h">
        <summary><h2 id="dev-h" class="t-heading1">${tx('SAF-09.dev.h2')}</h2>${ic('chevron-right')}</summary>
        <ul class="list">${devices(rid)}</ul>
      </details>
      <details class="card fold" aria-labelledby="rec-h">
        <summary><h2 id="rec-h" class="t-heading1">${tx('SAF-09.rec.h2')}</h2>${ic('chevron-right')}</summary>
        ${records(rid)}
      </details>
    </div>`;
}

const mine = () => { const p = me(); if (p.key !== 'MEMBER') refuse(tx('safety.shared.denied')); return p.residentId; };
export const actions = {
  // 시연: 호출벨이 눌린 것처럼 실제 신호를 만든다. 직원 화면(SAF-01)에 알림이 생기고 isCalling이 true가 된다.
  'saf.home.call': () => {
    const rid = mine(), now = nowISO();
    if (L.apiFns.isCalling(rid)) return;
    L.receive({ source: 'CALL_BELL', kind: 'CALL_BELL_PRESSED', vendorEventId: `bell-app-${rid}-${now}`, residentId: rid, occurredAt: now, receivedAt: now });
  },
  'saf.assist.set': () => { L.setAssistSelf(mine(), me().id); },
  'saf.assist.clear': () => { const rid = mine(); if (L.assistOf(rid)?.source === 'SELF') L.clearAssistSelf(rid); },
};
export const screens = { 'SAF-09': { app: 'home', title: tx('SAF-09.title'), render: saf09 } };
