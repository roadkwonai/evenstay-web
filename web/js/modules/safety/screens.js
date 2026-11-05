// SAF-06 시뮬레이터, SAF-01 지금 처리할 신호(알림 기록 탭), SAF-02 알림 처리 3단계, SAF-12 호실 현황, SAF-13 자리 비운 입주자.
// 마크업은 캔버스 보드(ref/SAF-*.html)를 옮겼고 값과 목록은 상태에서 채운다.
import { tx } from '../../lib/text.js';
import { dialog, denied, empty, esc, fmt, href, ic, me, nowISO, view } from '../../lib/kit.js';
import * as L from './logic.js';
import { ACTS, GRADE, LEVEL_LABEL, ROLES, SOURCE_LABEL, VISIT_LONG, VISIT_SHORT, S, alertById, hm, pn, rl, signalOf, tstr } from './logic.js';

const key = () => me().key;
const can = (list) => list.includes(key());
const deniedMsg = () => denied(tx('safety.shared.denied'));
const asof = () => `<span class="asof">${tx('safety.shared.span.2', { md: fmt.md(nowISO()), hm: hm(nowISO()) })}</span><button class="btn btn-ghost btn-sm" type="button" data-set="reloaded=1">${tx('safety.shared.btn')}</button>`;
const crumb = (to, label) => `<nav class="crumb" aria-label="${tx('safety.shared.ariaLabel.2')}"><a href="${href(to)}">${label}</a></nav>`;
const fx = `<p class="muted fx">${tx('safety.shared.p.3')}</p>`;
const demo = `<p class="demo-note fx">${tx('safety.shared.p.2')}</p>`;
const navBottom = (cur) => `<nav class="nav-bottom" aria-label="${tx('safety.shared.ariaLabel')}">
    <a href="${href('SAF-01')}"${cur === 'SAF-01' ? ' aria-current="page"' : ''}>${ic('x5')}${tx('safety.shared.a')}</a>
    <a href="${href('SAF-12')}"${cur === 'SAF-12' ? ' aria-current="page"' : ''}>${ic('door-open')}${tx('safety.shared.a.2')}</a>
    <a href="${href('SAF-17')}"${cur === 'SAF-17' ? ' aria-current="page"' : ''}>${ic('clipboard-list')}${tx('safety.shared.a.3')}</a>
    <a href="${href('SAF-13')}"${cur === 'SAF-13' ? ' aria-current="page"' : ''}>${ic('ellipsis')}${tx('safety.shared.a.4')}</a>
  </nav>`;
const flash = () => (view.flash ? `<div class="alert alert-ok" role="status">${ic('circle-check')}<p>${esc(view.flash)}</p></div>` : '');
const check = (name, label, extra = '') => `<label class="choice"><input type="checkbox" data-bind="${name}" data-live ${extra}> ${label}</label>`;

// ---------- 알림 카드 조각 ----------
const factText = (sg) => ({
  BED_EXIT_NO_RETURN: `${tx('safety.shared.text.23', { durationMin: sg.value.durationMin })}`,
  CALL_BELL_PRESSED: tx('safety.shared.see.63'),
  DOOR_OPENED: tx('safety.shared.see.61'),
  FRONT_CALL: tx('safety.shared.see.17'),
  VISIT_MISSED: tx('safety.shared.see.29'),
}[sg.kind]);
const kvInline = (sg) => {
  const rule = L.ruleOf(sg), src = SOURCE_LABEL[sg.source];
  const rows = sg.kind === 'BED_EXIT_NO_RETURN' ? [[tx('safety.shared.text.22'), hm(sg.occurredAt)], [tx('safety.shared.text.21'), hm(sg.receivedAt)], [tx('safety.shared.text.17'), src], [tx('safety.shared.text.16'), rule.name]]
    : sg.source === 'FRONT_CALL' ? [[tx('safety.shared.text.18'), hm(sg.occurredAt)], [tx('safety.shared.text.17'), src], [tx('safety.shared.text.20'), `${tx('safety.shared.text.19', { pn: pn(sg.by) })}`]]
      : [[tx('safety.shared.text.18'), hm(sg.occurredAt)], [tx('safety.shared.text.17'), src], [tx('safety.shared.text.16'), rule.name]];
  return `<dl class="kv inline">${rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>`;
};
const statusBadge = (a) => (a.status === 'OPEN' ? tx('safety.shared.text.15') : a.status === 'ESCALATED' ? LEVEL_LABEL[a.level] : tx('safety.shared.text.14'));
const dupBand = (sg) => {
  const n = sg.dups.length;
  if (!n) return '';
  const times = sg.dups.map((d) => `<li class="record"><span class="when">${tstr(d.at)}</span><span class="what">${tx('safety.shared.span')}</span></li>`).join('');
  return `<div class="band">
            <p class="t-label">${tx('safety.shared.p.4', { n })}</p>
            <p>${n === 1 ? tx('safety.shared.see.56') : `${tx('safety.shared.text.13', { v: n + 1 })}`}</p>
            <ul class="list">
              <li class="record"><span class="when">${tstr(sg.receivedAt)}</span><span class="what">${tx('safety.shared.span.3')}</span></li>${times}
              <li class="record"><span class="when">${tx('safety.shared.span.4')}</span><span class="what">${esc(sg.vendorEventId)}</span></li>
            </ul>
          </div>`;
};
const escalatedBand = (a) => {
  const rows = S().events.filter((e) => e.sid === a.sid && e.type === 'ESCALATED').map((e) => {
    const lvl = e.data.level, to = e.data.to.map(pn);
    const t = lvl === 2 ? `${tx('SAF-02.text.6', { v: to[0] })}` : lvl === 3 ? `${tx('SAF-02.text.5', { v: to[0] })}` : tx('SAF-02.map.3');
    return `<li class="record"><span class="when">${hm(e.at)}</span><span class="what">${t}</span></li>`;
  });
  return rows.length ? `<div class="band"><p class="t-label">${tx('SAF-02.p.12')}</p><ul class="list">${rows.join('')}</ul></div>` : '';
};
const dueLine = (a) => {
  const sec = Math.max(0, L.secBetween(nowISO(), a.dueAt)), m = Math.floor(sec / 60), s = sec % 60, d = L.dutyNames();
  if (a.level === 1) return `${tx('safety.shared.text.12', { m, s, second: d.second })}`;
  if (a.level === 2) return `${tx('safety.shared.text.11', { m, s, third: d.third })}`;
  if (a.level === 3) return `${tx('safety.shared.text.10', { m, s })}`;
  return `${tx('safety.shared.text.9', { m, s })}`;
};
const holderLine = (a) => (a.ackBy === me().id ? `${tx('SAF-01.text.11', { pn: pn(a.ackBy) })}` : `${tx('SAF-01.text.10', { pn: pn(a.ackBy) })}`);
const handedLine = (a) => {
  const first = L.shiftAt(L.signalOf(a).receivedAt).slots[0];
  if (a.status !== 'ESCALATED' || me().id !== first) return '';
  const e = S().events.filter((x) => x.sid === a.sid && x.type === 'ESCALATED').pop();
  return `<p>${tx('safety.shared.p', { hm: hm(e.at), pn: pn(e.data.to[0]) })}</p>`;
};
const absBadge = (a) => (L.isAbsent(a.residentId) ? `<span class="badge">${tx('safety.shared.see.7')}</span>` : '');

// ---------- SAF-01 지금 처리할 신호 ----------
function queueCard(a, sel) {
  const sg = signalOf(a), g = GRADE[a.severity], open = a.status === 'OPEN' || a.status === 'ESCALATED';
  return `<article class="card pick"${sel ? ' aria-current="true"' : ''} aria-labelledby="c-${a.id}">
        <div class="row" style="gap: 8px;"><span class="badge ${g.cls}">${ic(g.icon)}${g.label}</span><span class="badge">${statusBadge(a)}</span>${sg.dups.length ? `<span class="badge">${tx('SAF-01.span', { length: sg.dups.length })}</span>` : ''}${absBadge(a)}</div>
        <h2 class="t-headline"><a class="stretch" id="c-${a.id}" href="#" data-set="sel=${a.id}">${esc(rl(a.residentId))}</a></h2>
        <p>${factText(sg)}</p>
        ${kvInline(sg)}
        ${open ? `${handedLine(a)}<div class="more"><p class="strong">${dueLine(a)}</p>${dupBand(sg)}</div>` : `<p class="strong">${holderLine(a)}</p>`}
      </article>`;
}
function panelFor(a) {
  const sg = signalOf(a), open = a.status === 'OPEN' || a.status === 'ESCALATED', handler = can(ROLES.handle);
  const btn = open && handler ? `<a class="btn btn-primary btn-sm" href="${href('SAF-02', { id: a.id })}">${tx('SAF-01.btn.6')}</a>`
    : a.ackBy === me().id ? `<a class="btn btn-primary btn-sm" href="${href('SAF-02', { id: a.id })}">${tx('SAF-01.btn.5')}</a>` : '';
  return { btn, html: `<aside class="panel-s d-only" aria-label="${tx('SAF-01.ariaLabel.4')}">
        <h2 class="t-heading2">${esc(rl(a.residentId))}</h2>
        <p class="strong">${open ? dueLine(a) : holderLine(a)}</p>
        ${dupBand(sg)}
        <div class="row">${btn}</div>
      </aside>` };
}
function signalsTab() {
  const f = view.f || 'ALL', all = S().alerts.filter((a) => a.status !== 'RESOLVED');
  const open = all.filter((a) => a.status === 'OPEN' || a.status === 'ESCALATED').sort((x, y) => (signalOf(x).occurredAt < signalOf(y).occurredAt ? -1 : 1));
  const taken = all.filter((a) => a.status === 'ACKNOWLEDGED').sort((x, y) => (signalOf(x).occurredAt < signalOf(y).occurredAt ? 1 : -1));
  const list = (f === 'UNCLAIMED' ? open : f === 'TAKEN' ? taken : [...open, ...taken]);
  const selA = list.find((a) => a.id === view.sel) || list[0];
  const duty = L.dutyNames(), hosp = L.openEscorts().length, abs = L.absences().length, unclaimed = open.length, cut = L.disconnectedCount();
  const sumLine = `${tx('SAF-01.text.9', { unclaimed, cut, first: duty.first, second: duty.second, third: duty.third })}`;
  const need = L.linkNeeded().length, to = (tab) => (tab === 'LINK' ? href('SAF-08', { tab }) : href('SAF-13', { tab }));
  const p1 = (cls, text, tab) => `<div class="abs-cell ${cls}"><span class="k">${text}</span><a class="btn btn-ghost btn-sm" href="${to(tab)}">${tx('SAF-01.btn.4')}</a></div>`;
  const p1m = (text, tab) => `<li class="cell"><span class="body"><span class="title">${text}</span></span><a class="btn btn-ghost btn-sm" href="${to(tab)}">${tx('SAF-01.btn.4')}</a></li>`;
  const strip = `<div class="stat-strip d-only" aria-label="${tx('SAF-01.ariaLabel.8')}">
        <a href="#" data-set="f=UNCLAIMED"><span class="k">${tx('SAF-01.span.3')}</span><span class="v">${tx('SAF-01.span.4', { unclaimed })}</span></a>
        <a href="${href('SAF-08')}"><span class="k">${tx('SAF-01.span.5')}</span><span class="v">${tx('SAF-01.span.6', { cut })}</span></a>
        <div><span class="k">${tx('SAF-01.span.7')}</span><span class="v s">${duty.first}</span><span class="k">${tx('SAF-01.span.8', { second: duty.second, third: duty.third })}</span></div>
        ${hosp ? p1('hosp', `${tx('SAF-01.text.8', { hosp })}`, 'HOSP') : ''}${abs ? p1('absn', `${tx('SAF-01.text.7', { abs })}`, 'ABS') : ''}${need ? p1('link', tx('SAF-01.link', { n: need }), 'LINK') : ''}
      </div>
      <p class="sum-line m-only">${sumLine}</p>
      ${hosp || abs || need ? `<section class="card tight p1-card abs-m m-only" aria-label="${tx('SAF-01.ariaLabel.7')}"><ul class="list">${hosp ? p1m(`${tx('SAF-01.text.8', { hosp })}`, 'HOSP') : ''}${abs ? p1m(`${tx('SAF-01.text.7', { abs })}`, 'ABS') : ''}${need ? p1m(tx('SAF-01.link', { n: need }), 'LINK') : ''}</ul></section>` : ''}`;
  const seg = `<div class="seg" role="group" aria-label="${tx('SAF-01.ariaLabel.5')}">${[['UNCLAIMED', tx('SAF-01.map.6')], ['TAKEN', tx('SAF-01.map.5')], ['ALL', tx('SAF-01.map.4')]].map(([k, t]) => `<button type="button" data-set="f=${k}"${f === k ? ' aria-current="true"' : ''}>${t}</button>`).join('')}</div>`;
  let body;
  if (!list.length) {
    const last = S().signals.slice().sort((x, y) => (x.receivedAt < y.receivedAt ? 1 : -1))[0];
    body = `<section class="card" aria-label="${tx('SAF-01.ariaLabel.6')}"><div class="empty"><span class="state-icon">${ic('circle-check')}</span><h2 class="t-heading2">${tx('SAF-01.h2')}</h2>${last ? `<p class="muted">${tx('SAF-01.p.7', { hm: hm(last.receivedAt), room: esc(L.person(last.residentId).room), v: SOURCE_LABEL[last.source] })}</p>` : ''}</div></section>`;
  }
  const pf = selA ? panelFor(selA) : { btn: '', html: '' };
  return `${flash()}${strip}${seg}
      <div class="qwrap"><div class="queue"><div class="col">${body || list.map((a) => queueCard(a, a === selA)).join('')}</div>${pf.html}</div></div>
      ${fx}<p class="muted fx">${tx('SAF-01.p.6')}</p>${demo}
      ${pf.btn ? `<div class="sticky-act m-only">${pf.btn.replace('btn-sm', '')}</div>` : ''}`;
}

const eventText = (e, sg, n) => {
  const d = e.data || {};
  const T = {
    RECEIVED: () => (sg.paused ? `${tx('safety.shared.text.8', { v: SOURCE_LABEL[sg.source] })}` : sg.unlinked ? `${tx('SAF-01.unlinked', { v: SOURCE_LABEL[sg.source] })}` : `${tx('safety.shared.text.7', { v: SOURCE_LABEL[sg.source] })}`),
    NOTIFIED: () => `${tx('safety.shared.text.6', { pn: pn(d.to) })}`,
    DUPLICATE: () => `${tx('safety.shared.text.5', { n })}`,
    ESCALATED: () => (d.level === 4 ? tx('safety.shared.ESCALATED') : `${tx('safety.shared.text.4', { pn: pn(d.to[0]), v: LEVEL_LABEL[d.level] })}`),
    ACKNOWLEDGED: () => `${tx('safety.shared.text.3', { pn: pn(e.by) })}`,
    MET: () => tx('safety.shared.click.15'),
    NOT_MET: () => tx('safety.shared.NOTMET'),
    RESOLVED: () => `<b>${tx('safety.shared.b')}</b>`,
    GUARDIAN_SCHEDULED: () => `${tx('safety.shared.text.2', { hm: hm(d.sendAt) })}`,
    POSTED_NO_VIEWER: () => tx('safety.shared.POSTEDNOVIEWER'),
    WITHHELD: () => tx('safety.shared.WITHHELD'),
    EMERGENCY_CALL: () => `${tx('safety.shared.text.24', { rank: d.rank, v: esc(L.contactsOf(S().alerts.find((a) => a.sid === e.sid).residentId)[d.rank - 1]?.name ?? ''), v2: d.result === 'REACHED' ? tx('safety.shared.click.13') : tx('safety.shared.EMERGENCYCALL') })}`,
    VISIT_RECORDED: () => `${tx('safety.shared.text', { v: VISIT_LONG[d.result], pn: pn(e.by) })}`,
  };
  return T[e.type]();
};
const timeline = (sg) => {
  let n = 0;
  return `<ul class="list">${L.eventsOf(sg.id).map((e) => `<li class="record"><span class="when">${tstr(e.at)}</span><span class="what">${eventText(e, sg, e.type === 'DUPLICATE' ? ++n : n)}</span></li>`).join('')}</ul>`;
};
const timeCell = (sg) => {
  const a = L.alertOfSignal(sg);
  if (!a) return tx('SAF-01.text.6');
  const ack = L.minutesOf(a, 'ACKNOWLEDGED'), met = L.minutesOf(a, 'MET');
  if (ack === null) return tx('SAF-01.text.5');
  return met === null ? `${tx('SAF-01.text.4', { ack })}` : `${tx('SAF-01.text.3', { ack, minutesOf: L.minutesOf(a, 'MET') })}`;
};
const holderCell = (sg) => {
  const a = L.alertOfSignal(sg);
  if (!a) return tx('SAF-01.text.2');
  if (!a.ackBy) return '-';
  const lvl = S().events.some((e) => e.sid === sg.id && e.type === 'ESCALATED' && e.data.to.includes(a.ackBy));
  return lvl ? `${pn(a.ackBy)}(${LEVEL_LABEL[a.level] ?? tx('SAF-01.text')})` : pn(a.ackBy);
};
function incidentLink(sg) {
  const a = L.alertOfSignal(sg), r = a && L.incidentOf(a.id);
  return r && L.canViewIncident(me(), r) ? `<div class="row"><a class="btn btn-secondary btn-sm" href="${href('SAF-16', { id: a.id })}">${tx('SAF-16.title')}</a></div>` : '';
}
function logTab() {
  const f = view.lf || 'ALL', sigs = S().signals.slice().sort((x, y) => (x.receivedAt < y.receivedAt ? 1 : -1));
  const keep = (sg) => {
    const a = L.alertOfSignal(sg);
    if (f === 'ESCALATED') return !!a && a.level >= 2;
    if (f === 'WITHHELD') return !!a && a.outcome?.decision === 'WITHHOLD';
    if (f === 'NO_CONTACT') return !!a && !L.contactsOf(a.residentId).length;
    return true;
  };
  const rows = sigs.filter(keep), selSg = rows.find((x) => x.id === view.logsel) || rows[0];
  const seg = `<div class="seg wrap" role="group" aria-label="${tx('SAF-01.ariaLabel.5')}">${[['ALL', tx('SAF-01.map.4')], ['ESCALATED', tx('SAF-01.map.3')], ['WITHHELD', tx('SAF-01.map.2')], ['NO_CONTACT', tx('SAF-01.map')]].map(([k, t]) => `<button type="button" data-set="lf=${k}"${f === k ? ' aria-current="true"' : ''}>${t}</button>`).join('')}</div>`;
  const stamp = (iso) => `${+iso.slice(5, 7)}/${+iso.slice(8, 10)} ${tstr(iso)}`;
  const table = rows.length ? `<div class="tbl reflow wrapc"><table>
            <thead><tr><th>${tx('SAF-01.dataLabel')}</th><th>${tx('SAF-01.dataLabel.2')}</th><th>${tx('SAF-01.dataLabel.3')}</th><th>${tx('SAF-01.dataLabel.4')}</th><th>${tx('SAF-01.dataLabel.5')}</th><th><span class="sr-only">${tx('SAF-01.span.2')}</span></th></tr></thead>
            <tbody>${rows.map((sg) => `<tr${sg === selSg ? ' class="sel"' : ''}><td class="num" data-label="${tx('SAF-01.dataLabel')}"><a class="lnk" href="#" data-set="logsel=${sg.id}"${sg === selSg ? ' aria-current="true"' : ''}>${stamp(sg.receivedAt)}</a></td><td data-label="${tx('SAF-01.dataLabel.2')}">${esc(L.person(sg.residentId).room)} ${esc(L.person(sg.residentId).name)}</td><td data-label="${tx('SAF-01.dataLabel.3')}">${SOURCE_LABEL[sg.source]}</td><td data-label="${tx('SAF-01.dataLabel.4')}">${holderCell(sg)}</td><td data-label="${tx('SAF-01.dataLabel.5')}">${timeCell(sg)}</td><td class="go"><a class="btn btn-ghost btn-sm" href="#" data-set="logsel=${sg.id}" aria-label="${tx('SAF-01.ariaLabel.3')}">${ic('chevron-right')}</a></td></tr>`).join('')}</tbody>
          </table></div>` : `<section class="card">${empty(tx('SAF-01.empty'))}</section>`;
  const panel = selSg ? `<aside class="panel-s info" aria-label="${tx('SAF-01.ariaLabel.2')}"><h2 class="t-heading2">${esc(rl(selSg.residentId))}, ${SOURCE_LABEL[selSg.source]}</h2>${timeline(selSg)}${incidentLink(selSg)}<p class="muted">${tx('SAF-01.p.5')}</p></aside>` : '';
  return `<p>${tx('SAF-01.p.2')}</p>${seg}
      <div class="qwrap"><div class="queue">${table}${panel}</div></div>
      <p class="muted">${tx('SAF-01.p.3')}</p>
      <p class="demo-note">${tx('SAF-01.p.4')}</p>`;
}
function frontDialog() {
  if (view.dialog !== 'front') return '';
  const opts = L.residentList().map((r) => `<option value="${r.id}">${esc(r.room)} ${esc(r.name)}</option>`).join('');
  return dialog(tx('SAF-01.dialog'), `<p>${tx('SAF-01.p')}</p>
    <div class="field"><label for="fc-r">${tx('SAF-01.label')}</label><select id="fc-r" class="input" name="room" data-bind="room"><option value="">${tx('SAF-01.label')}</option>${opts}</select></div>`,
  `<button class="btn btn-secondary" type="button" data-set="dialog=">${tx('SAF-01.btn.2')}</button><button class="btn btn-primary" type="button" data-act="saf.front.register">${tx('SAF-01.btn.3')}</button>`);
}
function evacDialog() {
  if (view.dialog !== 'evac' || !can(ROLES.evac)) return '';
  return dialog(tx('SAF-01.evac.title'), `<p>${tx('SAF-01.evac.p')}</p>`,
    `<button class="btn btn-secondary" type="button" data-set="dialog=">${tx('SAF-01.btn.2')}</button><button class="btn btn-primary" type="button" data-act="saf.evac.open">${tx('SAF-01.evac.open')}</button>`);
}
function saf01() {
  if (!can(ROLES.view)) return deniedMsg();
  const tab = view.tab === 'LOG' && can(ROLES.log) ? 'LOG' : 'LIVE';
  const tabs = can(ROLES.log) ? `<nav class="tabs" aria-label="${tx('SAF-01.ariaLabel')}"><a href="#" data-set="tab=LIVE"${tab === 'LIVE' ? ' aria-current="page"' : ''}>${tx('SAF-01.a')}</a><a href="#" data-set="tab=LOG"${tab === 'LOG' ? ' aria-current="page"' : ''}>${tx('SAF-01.a.2')}</a></nav>` : '';
  const acts = tab === 'LIVE' ? `<div class="head-act"><div class="row" style="gap: 8px;">${asof()}</div>${can(ROLES.front) ? `<button class="btn btn-secondary btn-sm" type="button" data-set="dialog=front">${tx('SAF-01.btn')}</button>` : ''}${can(ROLES.evac) ? `<button class="btn btn-secondary btn-sm d-only" type="button" aria-haspopup="dialog" data-set="dialog=evac">${tx('SAF-01.evac.btn')}</button>` : ''}</div>` : `<div class="row" style="gap: 8px;">${asof()}</div>`;
  return { main: `<div class="page-head"><div>${crumb('SAF-01', tx('SAF-01.crumb'))}<h1 class="t-title2">${tx('SAF-01.title')}</h1></div>${acts}</div>${tabs}${tab === 'LIVE' ? signalsTab() : logTab()}`, overlay: `${frontDialog()}${evacDialog()}${navBottom('SAF-01')}` };
}

// ---------- SAF-02 알림 처리 ----------
const prog = (label, w) => `<div class="field"><p class="t-label">${label}</p><div class="prog" role="presentation"><span style="width: ${w}%"></span></div></div>`;
function contactsAside(a) {
  const list = L.contactsOf(a.residentId), d = L.dutyNames();
  const logged = a.calls.map((c) => `<li class="record"><span class="when">${hm(c.at)}</span><span class="what">${tx('SAF-02.span.6', { rank: c.rank, v: esc(list[c.rank - 1]?.name ?? ''), v2: c.result === 'REACHED' ? tx('SAF-02.map.2') : tx('SAF-02.map') })}</span></li>`).join('');
  const rows = list.map((c) => `<li class="cell"><span class="body"><span class="title">${tx('SAF-02.title.2', { rank: c.rank, name: esc(c.name), relation: esc(c.relation) })}</span><span class="sub">${esc(c.phone)}</span></span><a class="btn btn-ghost btn-sm" href="tel:">${ic('x0')}${tx('SAF-02.btn.10')}</a></li>`).join('');
  return `<aside class="panel-s" aria-label="${tx('SAF-02.ariaLabel.4')}">
            <h2 class="t-heading2">${tx('SAF-02.h2.4', { rl: esc(rl(a.residentId)) })}</h2>
            <p>${tx('SAF-02.p.17')}</p>
            ${list.length ? `<ol class="list">${rows}</ol>` : `<p>${tx('SAF-02.p.11', { third: d.third })}</p>`}
            <fieldset class="fieldset-r"><legend>${tx('SAF-02.legend.4')}</legend>
              <label class="choice"><input type="radio" name="callres" value="REACHED" data-bind="callres" data-live> ${tx('SAF-02.map.2')}</label>
              <label class="choice"><input type="radio" name="callres" value="NO_ANSWER" data-bind="callres" data-live> ${tx('SAF-02.map')}</label>
              ${view.callres === 'NO_ANSWER' ? `<p class="hint">${tx('SAF-02.p.10')}</p>` : ''}
            </fieldset>
            <div class="row"><button class="btn btn-secondary btn-sm" type="button" data-act="saf.call.log" data-id="${a.id}"${view.callres ? '' : ' disabled'}>${tx('SAF-02.btn.7')}</button></div>
            ${logged ? `<ul class="list">${logged}</ul>` : ''}
            <p class="scope">${ic('eye')}${tx('SAF-02.p.18')}</p>
          </aside>`;
}
function infoStep(a) {
  const sg = signalOf(a), g = GRADE[a.severity], open = a.status === 'OPEN' || a.status === 'ESCALATED', mine = a.ackBy === me().id, handler = can(ROLES.handle);
  const allCall = a.status === 'ESCALATED' && a.level === 4;
  const act = open && handler ? (allCall ? `<button class="btn btn-primary btn-sm" type="button" data-set="dialog=all">${tx('SAF-02.btn.2')}</button>` : `<button class="btn btn-primary btn-sm" type="button" data-act="saf.ack" data-id="${a.id}">${tx('SAF-02.btn.2')}</button>`)
    : mine ? `<button class="btn btn-primary btn-sm" type="button" data-set="step=RECORD">${tx('SAF-02.btn.11')}</button>${view.contacts ? '' : `<button class="btn btn-secondary btn-sm" type="button" data-set="contacts=1">${tx('SAF-02.btn.9')}</button>`}` : '';
  const lines = open ? `${handedLine(a)}<p class="strong">${dueLine(a)}</p>` : `<p class="t-headline">${mine ? `${tx('SAF-02.text.4', { pn: pn(a.ackBy), hm: hm(a.ackAt) })}` : `${tx('SAF-02.text.3', { pn: pn(a.ackBy) })}`}</p>`;
  const notes = mine ? `<p>${tx('SAF-02.p.9')}</p>` : allCall ? `<p>${tx('SAF-02.p.8')}</p>` : '';
  const card = `<article class="card" aria-labelledby="d-${a.id}">
            <div class="row" style="gap: 8px;"><span class="badge ${g.cls}">${ic(g.icon)}${g.label}</span><span class="badge">${statusBadge(a)}</span>${sg.dups.length ? `<span class="badge">${tx('SAF-02.span.3', { length: sg.dups.length })}</span>` : ''}${absBadge(a)}</div>
            <h2 id="d-${a.id}" class="t-headline">${esc(rl(a.residentId))}</h2>
            <p>${factText(sg)}</p>
            ${kvInline(sg)}
            ${lines}${open ? dupBand(sg) : escalatedBand(a)}${notes}
            <div class="row">${act}</div>
          </article>`;
  const side = mine && view.contacts ? contactsAside(a) : '';
  return { step: `${prog(tx('SAF-02.prog.3'), 33)}<div class="qwrap"><div class="queue${side ? '' : ' one'}"><div class="col">${card}</div>${side}</div></div>`, sticky: act.replace('btn-sm', '') };
}
function recordStep(a) {
  const hospital = !!view.act_WENT_TO_HOSPITAL, slots = L.shiftAt().slots.filter(Boolean);
  const ready = view.meet === 'NOT_MET' || (view.meet === 'MET' && ACTS.some(([k]) => view[`act_${k}`]) && (!hospital || (view.depart || '').trim()));
  const band = hospital ? `<div class="band"><div class="grid2">
                <div class="field"><label for="r-esc">${tx('SAF-02.label.5')}</label><select id="r-esc" class="input" name="escort" data-bind="escort">${slots.map((u) => `<option value="${u}">${pn(u)}</option>`).join('')}<option value="NONE">${tx('SAF-02.option.4')}</option></select></div>
                <div class="field"><label for="r-dep">${tx('SAF-02.label.6')}</label><input id="r-dep" class="input" type="text" name="depart" data-bind="depart" data-live></div>
              </div><p class="hint">${tx('SAF-02.p.7')}</p></div>` : '';
  const save = `data-act="saf.record.save" data-id="${a.id}"${ready ? '' : ' disabled'}`;
  const form = `<form class="card" aria-label="${tx('SAF-02.ariaLabel.2')}">
          <fieldset class="fieldset-r"><legend>${tx('SAF-02.legend.2')}</legend>
            <label class="choice"><input type="radio" name="meet" value="MET" data-bind="meet" data-live data-act="saf.meet" data-id="${a.id}" data-meet="MET"> ${tx('SAF-02.input.3')}</label>
            <label class="choice"><input type="radio" name="meet" value="NOT_MET" data-bind="meet" data-live> ${tx('SAF-02.input.4')}</label>
            <p class="hint">${tx('SAF-02.p.5', { third: L.dutyNames().third })}</p>
          </fieldset>
          <fieldset class="fieldset-r"><legend>${tx('SAF-02.legend.3')}</legend>
            <div class="checks">${ACTS.map(([k, t]) => check(`act_${k}`, t)).join('')}</div>${band}
          </fieldset>
          <div class="field"><label for="r-memo">${tx('SAF-02.label.4')}</label><textarea id="r-memo" class="input" data-bind="memo"></textarea>
            <p class="hint">${tx('SAF-02.p.6')}</p></div>
          <div class="row d-only"><button class="btn btn-primary btn-sm" type="button" ${save}>${tx('SAF-02.btn.8')}</button></div>
        </form>`;
  const times = `<aside class="panel-s info" aria-label="${tx('SAF-02.ariaLabel.3')}"><h2 class="t-heading2">${tx('SAF-02.ariaLabel.3')}</h2>
          <ul class="timeline"><li><span class="t">${hm(a.ackAt)}</span><span>${tx('SAF-02.span.4')}</span></li><li><span class="t">${a.metAt ? hm(a.metAt) : ''}</span><span>${tx('SAF-02.legend.2')}</span></li><li><span class="t"></span><span>${tx('SAF-02.span.5')}</span></li></ul>
          ${view.contacts ? '' : `<div class="row"><button class="btn btn-secondary btn-sm" type="button" data-set="contacts=1">${tx('SAF-02.btn.9')}</button></div>`}
        </aside>`;
  return { step: `<p class="muted">${esc(rl(a.residentId))}</p>${prog(tx('SAF-02.prog.2'), 66)}<div class="qwrap"><div class="queue">${form}<div class="stack">${times}${view.contacts ? contactsAside(a) : ''}</div></div></div>`, sticky: `<button class="btn btn-primary" type="button" ${save}>${tx('SAF-02.btn.8')}</button>` };
}
function guardianStep(a) {
  const rid = a.residentId, viewers = L.viewersOf(rid), now = nowISO(), first = L.firstSentence(a), send = L.nextSendAt(now);
  const names = viewers.map((p) => `${tx('SAF-02.text.2', { relation: p.relation, name: p.name })}`).join(', ');
  const empt = !first && !(view.second || '').trim();
  if (!viewers.length) {
    return { step: `${prog(tx('SAF-02.prog'), 100)}<div class="qwrap"><div class="queue one"><div class="col">
        <section class="card" aria-labelledby="g-ng"><h2 id="g-ng" class="t-heading2">${tx('SAF-02.h2.3')}</h2>
          <div class="alert">${ic('info')}<p>${tx('SAF-02.p.16', { name: esc(L.person(rid).name) })}</p></div>
          <div class="row d-only"><button class="btn btn-primary btn-sm" type="button" data-act="saf.guardian.post" data-id="${a.id}">${tx('SAF-02.btn.7')}</button></div>
        </section></div></div></div>`, sticky: `<button class="btn btn-primary" type="button" data-act="saf.guardian.post" data-id="${a.id}">${tx('SAF-02.btn.7')}</button>` };
  }
  const why = view.withhold ? `<section class="card" aria-labelledby="g-wh">
          <h2 id="g-wh" class="t-heading2">${tx('SAF-02.h2')}</h2>
          <p>${tx('SAF-02.p.2')}</p>
          <fieldset class="fieldset-r"><legend>${tx('SAF-02.legend')}</legend>
            <label class="choice"><input type="radio" name="why" value="MEMBER_REQUEST" data-bind="why" data-live> ${tx('SAF-02.input')}</label>
            <div class="subfields"><div class="field"><label for="w-who">${tx('SAF-02.label')}</label><input id="w-who" class="input" type="text" name="who" data-bind="who"></div><div class="field"><label for="w-when">${tx('SAF-02.label.2')}</label><input id="w-when" class="input" type="text" name="when" data-bind="when"></div></div>
            <p class="hint" style="margin-left: 36px;">${tx('SAF-02.p.3')}</p>
            <label class="choice"><input type="radio" name="why" value="NOT_A_HEALTH_EVENT" data-bind="why" data-live> ${tx('SAF-02.input.2')}</label>
            <div class="field" style="margin-left: 36px;"><label for="w-sub">${tx('SAF-02.label.3')}</label><select id="w-sub" class="input" name="sub" data-bind="sub"${view.why === 'NOT_A_HEALTH_EVENT' ? '' : ' disabled'}><option value="OTHER_RESIDENT">${tx('SAF-02.option')}</option><option value="DUPLICATE">${tx('SAF-02.option.2')}</option><option value="DEVICE_TEST">${tx('SAF-02.option.3')}</option></select></div>
          </fieldset>
          <p class="muted">${tx('SAF-02.p.4')}</p>
          <div class="row d-only"><button class="btn btn-primary btn-sm" type="button" data-act="saf.withhold.save" data-id="${a.id}">${tx('SAF-02.btn.6')}</button><button class="btn btn-secondary btn-sm" type="button" data-set="withhold=">${tx('SAF-02.btn.5')}</button></div>
        </section>` : '';
  const btns = view.withhold ? '' : `<div class="row d-only"><button class="btn btn-primary btn-sm" type="button" data-act="saf.guardian.post" data-id="${a.id}"${empt ? ' disabled' : ''}>${tx('SAF-02.btn.4')}</button><button class="btn btn-secondary btn-sm" type="button" data-set="withhold=1">${tx('SAF-02.btn.3')}</button></div>`;
  const sendLine = send === now ? `<span class="hl">${tx('SAF-02.span', { hm: hm(send) })}</span>` : `<span class="hl">${tx('SAF-02.span', { hm: hm(send) })}</span> ${tx('SAF-02.span.2')}`;
  return { step: `${prog(tx('SAF-02.prog'), 100)}
      <p class="scope">${ic('eye')}${tx('SAF-02.p.13', { name: esc(L.person(rid).name), length: viewers.length, names: esc(names) })}</p>
      <div class="qwrap"><div class="queue one"><div class="col">
        <section class="card" aria-labelledby="g-pv">
          <h2 id="g-pv" class="t-heading2">${tx('SAF-02.h2.2')}</h2>
          ${first ? `<p class="t-body-md">${esc(first)}</p>` : ''}
          <div class="field"><label for="g-s2">${tx('SAF-02.label.7')}</label>
            <textarea id="g-s2" class="input" data-bind="second" data-live></textarea>
            <p class="hint">${tx('SAF-02.p.14')}</p></div>
          <hr class="divider">
          <p>${sendLine}</p>
          <p class="muted">${tx('SAF-02.p.15')}</p>
          ${btns}
        </section>${why}
      </div></div></div>`, sticky: view.withhold ? `<button class="btn btn-secondary" type="button" data-set="withhold=">${tx('SAF-02.btn.5')}</button><button class="btn btn-primary" type="button" data-act="saf.withhold.save" data-id="${a.id}">${tx('SAF-02.btn.6')}</button>` : `<button class="btn btn-secondary" type="button" data-set="withhold=1">${tx('SAF-02.btn.3')}</button><button class="btn btn-primary" type="button" data-act="saf.guardian.post" data-id="${a.id}"${empt ? ' disabled' : ''}>${tx('SAF-02.btn.4')}</button>` };
}
function doneStep(a) {
  const sg = signalOf(a), met = a.metAt && a.closedBy !== 'VISIT_RECORD';
  const summary = met ? `${tx('SAF-02.text', { hm: hm(a.ackAt), hm2: hm(a.metAt), hm3: hm(a.resolvedAt) })}` : '';
  return { step: `<div class="qwrap"><div class="queue one"><div class="col"><section class="card" aria-label="${tx('SAF-02.ariaLabel')}">
          ${summary ? `<div class="alert alert-ok" role="status">${ic('circle-check')}<p>${summary}</p></div>` : ''}
          <h2 class="t-heading2">${esc(rl(a.residentId))}, ${SOURCE_LABEL[sg.source]}</h2>${timeline(sg)}
        </section></div></div></div>`, sticky: '' };
}
function moreMenu(a) {
  const write = L.canWriteIncident(me(), a), open = view.menu === '1';
  return `<div class="hd-menu"><button class="btn btn-ghost btn-sm" type="button" aria-label="${tx('SAF-02.menu.btn')}" aria-haspopup="menu" aria-expanded="${open}" data-set="menu=${open ? '' : '1'}">${ic('ellipsis-vertical')}${tx('SAF-02.menu.btn')}</button>${open ? `<div class="menu" role="menu"><button role="menuitem" type="button" data-act="saf.incident.open" data-id="${a.id}">${write ? tx('SAF-02.menu.incident') : tx('SAF-16.title')}</button></div>` : ''}</div>`;
}
function saf02(params) {
  if (!can(ROLES.view)) return deniedMsg();
  const a = alertById(params.id);
  if (!a) return { main: `<div class="page-head"><div>${crumb('SAF-01', tx('SAF-02.crumb'))}<h1 class="t-title2">${tx('SAF-02.title')}</h1></div></div>${empty(tx('SAF-02.empty'))}` };
  const mine = a.ackBy === me().id;
  const step = a.status === 'RESOLVED' ? 'DONE' : !(a.status === 'ACKNOWLEDGED' && mine) ? 'INFO' : a.record ? 'GUARDIAN' : view.step === 'RECORD' ? 'RECORD' : 'INFO';
  const r = { INFO: infoStep, RECORD: recordStep, GUARDIAN: guardianStep, DONE: doneStep }[step](a);
  const rep = L.incidentOf(a.id), menu = L.canWriteIncident(me(), a) || (!!rep && L.canViewIncident(me(), rep));
  const head = step === 'INFO' ? (menu ? moreMenu(a) : `<div class="row" style="gap: 8px;">${asof()}</div>`) : '';
  const dlg = view.dialog === 'all' ? dialog(tx('SAF-02.dialog'), `<p>${tx('SAF-02.p')}</p>`,
    `<button class="btn btn-secondary" type="button" data-set="dialog=">${tx('SAF-02.btn')}</button><button class="btn btn-primary" type="button" data-act="saf.ack" data-id="${a.id}">${tx('SAF-02.btn.2')}</button>`) : '';
  return { main: `<div class="page-head"><div>${crumb('SAF-01', tx('SAF-02.crumb'))}<h1 class="t-title2">${tx('SAF-02.title')}</h1></div>${head}</div>${flash()}${r.step}
      ${step === 'INFO' || step === 'RECORD' ? fx : ''}${demo}${r.sticky ? `<div class="sticky-act m-only">${r.sticky}</div>` : ''}`, overlay: `${dlg}${navBottom('SAF-01')}` };
}

// ---------- SAF-06 기기 시뮬레이터 ----------
const phoneLine = (p, a) => {
  const sg = signalOf(a), tag = p.kind === 'FIRST' ? GRADE[a.severity].label : LEVEL_LABEL[{ L2: 2, L3: 3, ALL: 4 }[p.kind]];
  const tail = { FIRST: '', L2: tx('SAF-06.L2'), L3: tx('SAF-06.L3'), ALL: ` ${tx('SAF-06.text.4', { hm: hm(sg.receivedAt) })}` }[p.kind];
  return `<li class="record"><span class="when">${tstr(p.at)}</span><span class="what"><b>[${tag}]</b> ${esc(rl(a.residentId))} · ${factText(sg)}${tail}</span></li>`;
};
function saf06() {
  const sh = L.shiftAt(), role = [tx('SAF-06.text.3'), tx('SAF-06.text.2'), tx('SAF-06.text')];
  const panels = sh.slots.map((uid, i) => {
    const lines = S().phones.filter((p) => p.uid === uid && p.at >= sh.start && p.at < sh.end).sort((x, y) => (x.at < y.at ? -1 : 1)).map((p) => phoneLine(p, alertById(p.aid))).join('');
    return `<section class="card" aria-labelledby="ph${i}"><h2 id="ph${i}" class="t-heading2">${tx('SAF-06.h2', { pn: pn(uid), v: role[i] })}</h2>${lines ? `<ul class="list">${lines}</ul>` : `<p class="muted">${tx('SAF-06.p.2')}</p>`}</section>`;
  }).join('');
  const rooms = ['R_EUNSOOK', 'R_YEONGSUN', 'R_OKJA'].map((r) => `<option value="${r}">${esc(L.person(r).room)} ${esc(L.person(r).name)}</option>`).join('');
  return { main: `<div class="page-head"><div>${crumb('SAF-01', tx('SAF-06.crumb'))}<h1 class="t-title2">${tx('SAF-06.title')}</h1></div><span class="badge badge-brand">${tx('SAF-06.span')}</span></div>
      <div class="alert">${ic('info')}<div class="stack" style="gap: 4px;"><p>${tx('SAF-06.p.3')}</p><p class="muted">${tx('SAF-06.p.4')}</p></div></div>
      <div class="split"><div class="main"><form class="card" aria-label="${tx('SAF-06.ariaLabel')}"><h2 class="t-heading2">${tx('SAF-06.ariaLabel')}</h2>
        <div class="field"><label for="kind">${tx('SAF-06.label')}</label><select id="kind" class="input" name="kind" data-bind="kind"><option value="BED_SENSOR">${tx('SAF-06.option')}</option><option value="CALL_BELL">${tx('SAF-06.option.2')}</option><option value="ACCESS_LOG">${tx('SAF-06.option.3')}</option></select></div>
        <div class="field"><label for="room">${tx('SAF-06.label.2')}</label><select id="room" class="input" name="room" data-bind="room">${rooms}</select></div>
        <div class="field"><label for="evt">${tx('SAF-06.label.3')}</label><input id="evt" class="input" type="text" name="evt" data-bind="evt" value="bed-a201-0210"><p class="hint">${tx('SAF-06.p.5')}</p></div>
        <div class="field"><label for="at">${tx('SAF-06.label.4')}</label><input id="at" class="input" type="text" name="at" data-bind="at" value="02:40:03"><p class="hint">${tx('SAF-06.p.6')}</p></div>
        <div class="row"><button class="btn btn-primary btn-sm" type="button" data-act="saf.sim.send">${tx('SAF-06.ariaLabel')}</button></div>
      </form></div><div class="aside stack lg">${panels}</div></div>${`<p class="demo-note">${tx('SAF-06.p')}</p>`}` };
}

// ---------- SAF-12 호실 현황 ----------
function lastSignals(rid) {
  const mine = S().signals.filter((x) => x.residentId === rid && x.source !== 'VISIT'), now = nowISO();
  const parts = ['BED_SENSOR', 'CALL_BELL', 'ACCESS_LOG', 'FRONT_CALL'].map((src) => {
    const last = mine.filter((x) => x.source === src).sort((x, y) => (x.occurredAt < y.occurredAt ? 1 : -1))[0];
    return last ? `${SOURCE_LABEL[src]} ${L.dateOf(last.occurredAt) === L.dateOf(now) ? hm(last.occurredAt) : `${fmt.md(last.occurredAt)} ${hm(last.occurredAt)}`}` : '';
  }).filter(Boolean);
  return parts.length ? parts.join(', ') : tx('SAF-12.text.10');
}
function saf12() {
  if (!can(ROLES.view)) return deniedMsg();
  const write = can(ROLES.visitWrite), now = nowISO(), targets = L.visitTargets(now), plan = S().visitPlan;
  const rows = L.residentList(), done = targets.filter((r) => L.visitOf(r)).length, left = targets.length - done;
  const selId = view.sel || (write ? L.defaultVisitSel() : rows[0]?.id);
  const cell = (rid) => {
    const v = L.visitOf(rid), absent = L.isAbsent(rid, now), consent = plan.residentIds.includes(rid);
    if (absent && consent) return `${tx('SAF-12.text.12', { v: write ? `<br><span class="muted">${tx('SAF-12.span.4')}</span>` : '' })}`;
    if (!consent) return tx('SAF-12.text.3');
    if (!v) return `${tx('SAF-12.text.11', { v: write ? `<br><span class="muted">${tx('SAF-12.span.3')}</span>` : '' })}`;
    return `${VISIT_SHORT[v.result]}${write ? `<br><span class="muted">${tx('SAF-12.span.2', { hm: hm(v.at), v: VISIT_LONG[v.result], pn: pn(v.by) })}</span>` : ''}`;
  };
  const act = (rid) => {
    if (!write || !targets.includes(rid)) return '<td class="go"></td>';
    const v = L.visitOf(rid);
    return `<td class="go"><button class="btn btn-ghost btn-sm" type="button" aria-haspopup="dialog" data-set="sel=${rid}&vr=${v ? v.result : ''}"${v ? ` ${tx('SAF-12.text.9')}${ic('pen')}` : tx('SAF-12.text.8')}</button></td>`;
  };
  const open = (rid) => (write ? `<a class="lnk" href="#" data-set="sel=${rid}&vr="${rid === selId ? ' aria-current="true"' : ''}>` : `<a class="lnk" href="#" data-set="sel=${rid}"${rid === selId ? ' aria-current="true"' : ''}>`);
  const body = rows.map((r) => {
    const open_n = S().alerts.filter((a) => a.residentId === r.id && a.status !== 'RESOLVED').length;
    const v = L.visitOf(r.id), rowSet = write && targets.includes(r.id) ? ` data-set="sel=${r.id}&vr=${v ? v.result : ''}"` : '';
    return `<tr${r.id === selId ? ' class="sel"' : ''}${rowSet}><td data-label="${tx('SAF-12.th')}">${open(r.id)}${esc(r.room)}</a></td><td data-label="${tx('SAF-12.th.2')}">${esc(r.name)} ${L.isAbsent(r.id, now) ? `<span class="badge">${tx('SAF-12.span')}</span>` : ''}</td><td data-label="${tx('SAF-12.dt.2')}">${cell(r.id)}</td><td class="num" data-label="${tx('SAF-12.dt.3')}">${esc(lastSignals(r.id))}</td><td data-label="${tx('SAF-12.dt.4')}">${open_n ? `${tx('SAF-12.text.7', { open_n })}` : tx('SAF-12.text')}</td>${write ? act(r.id) : `<td class="go"><a class="btn btn-ghost btn-sm" href="#" data-set="sel=${r.id}" aria-label="${tx('SAF-12.ariaLabel.2')}">${ic('chevron-right')}</a></td>`}</tr>`;
  }).join('');
  const table = `<div class="tbl reflow wrapc"><table><thead><tr><th>${tx('SAF-12.th')}</th><th>${tx('SAF-12.th.2')}</th><th>${tx('SAF-12.dt.2')}</th><th>${tx('SAF-12.dt.3')}</th><th>${tx('SAF-12.dt.4')}</th><th><span class="sr-only">${write ? tx('SAF-12.text.6') : tx('SAF-12.text.5')}</span></th></tr></thead><tbody>${body}</tbody></table></div>`;
  const sel = rows.find((r) => r.id === selId);
  let panel = '';
  if (sel && write && targets.includes(sel.id)) {
    panel = `<aside class="panel-s" aria-label="${tx('SAF-12.ariaLabel')}"><h2 class="t-heading2">${esc(rl(sel.id))}</h2><fieldset class="fieldset-r"><legend>${tx('SAF-12.legend')}</legend>
            ${Object.entries(VISIT_LONG).map(([k, t]) => `<label class="choice"><input type="radio" name="vr" value="${k}" data-bind="vr" data-live${(view.vr === undefined ? L.visitOf(sel.id)?.result : view.vr) === k ? ' checked' : ''}> ${t}</label>`).join('')}
            <p class="hint">${tx('SAF-12.p.5')}</p></fieldset></aside>`;
  } else if (sel && !write) {
    const v = L.visitOf(sel.id), na = S().alerts.filter((a) => a.residentId === sel.id && a.status !== 'RESOLVED').length;
    panel = `<aside class="panel-s info" aria-label="${tx('SAF-12.ariaLabel.3')}"><h2 class="t-heading2">${esc(rl(sel.id))}</h2><dl class="kv"><dt>${tx('SAF-12.dt.2')}</dt><dd>${v ? VISIT_LONG[v.result] : plan.residentIds.includes(sel.id) && !L.isAbsent(sel.id, now) ? tx('SAF-12.text.4') : tx('SAF-12.text.3')}</dd>${v ? `<dt>${tx('SAF-12.dt')}</dt><dd>${tx('SAF-12.dd', { hm: hm(v.at), pn: pn(v.by) })}</dd>` : ''}<dt>${tx('SAF-12.dt.3')}</dt><dd>${esc(lastSignals(sel.id))}</dd><dt>${tx('SAF-12.dt.4')}</dt><dd>${na ? `${tx('SAF-12.text.2', { na })}` : tx('SAF-12.text')}</dd></dl></aside>`;
  }
  const head = write ? `<p>${tx('SAF-12.p.7', { start: plan.start, end: plan.end })}</p>${targets.length ? `${left === 0 ? `<div class="alert alert-ok" role="status">${ic('circle-check')}<p>${tx('SAF-12.p.4')}</p></div>` : ''}<p class="t-headline">${tx('SAF-12.p.6', { length: targets.length, done, left })}</p>` : empty(tx('SAF-12.empty'))}`
    : `<p>${tx('SAF-12.p.3')}</p>`;
  const foot = write ? `<p class="demo-note">${tx('SAF-12.p.2')}</p><div class="sticky-act keep"><button class="btn btn-primary" type="button" data-act="saf.visit.save"${view.vr ? '' : ' disabled'}>${tx('SAF-12.btn')}</button></div>`
    : `<p class="muted">${tx('SAF-12.p')}</p><p class="demo-note">${tx('SAF-12.p.2')}</p>`;
  return { main: `<div class="page-head"><div>${crumb('SAF-01', tx('SAF-12.crumb'))}<h1 class="t-title2">${tx('SAF-12.title')}</h1></div><div class="row" style="gap: 8px;">${asof()}</div></div>${flash()}${head}
      <div class="qwrap"><div class="queue">${table}${panel}</div></div>${foot}`, overlay: navBottom('SAF-12') };
}

// ---------- SAF-13 자리 비운 입주자 ----------
function saf13(params) {
  if (!can(ROLES.view)) return deniedMsg();
  const tab = view.tab || params.tab || 'HOSP', now = nowISO();
  const tabs = `<nav class="tabs" aria-label="${tx('SAF-13.ariaLabel')}"><a href="#" data-set="tab=HOSP"${tab === 'HOSP' ? ' aria-current="page"' : ''}>${tx('SAF-13.a')}</a><a href="#" data-set="tab=ABS"${tab === 'ABS' ? ' aria-current="page"' : ''}>${tx('SAF-13.a.2')}</a></nav>`;
  let body, note;
  if (tab === 'HOSP') {
    const list = L.openEscorts();
    body = list.length ? `<div class="panelbox"><ul class="chk">${list.map((h) => `<li><div class="chk-row"><span class="body"><span class="title">${esc(rl(h.residentId))}${absBadge(h)}</span><span class="sub">${tx('SAF-13.sub.2', { hm: hm(h.departAt), v: h.escortUid ? `${tx('SAF-13.text', { pn: pn(h.escortUid) })}` : tx('SAF-13.map') })}</span></span><button class="btn btn-ghost btn-sm" type="button" aria-haspopup="dialog" data-set="ret=${h.id}">${tx('SAF-13.btn.3')}</button></div></li>`).join('')}</ul></div>`
      : `<div class="panelbox"><div class="empty"><span class="state-icon">${ic('circle-check')}</span><h2 class="t-heading2">${tx('SAF-13.h2')}</h2></div></div>`;
    note = `<p>${tx('SAF-13.p.3')}</p>`;
  } else {
    const list = L.absences();
    body = list.length ? `<div class="card"><ul class="list">${list.map((x) => `<li class="cell"><span class="body"><span class="title">${esc(rl(x.residentId))}</span><span class="sub">${tx('SAF-13.sub', { md: fmt.md(x.startedOn ?? x.startedAt) })}</span></span><span class="badge">${tx('SAF-13.span')}</span></li>`).join('')}</ul></div>` : empty(tx('SAF-13.empty'));
    note = '';
  }
  const foot = tab === 'HOSP' ? `<p class="muted">${tx('SAF-13.p.2')}</p>` : `<p class="muted">${tx('SAF-13.p')}</p>`;
  const dlg = view.ret ? dialog(tx('SAF-13.dialog'), `<div class="field"><label for="rt-in">${tx('SAF-13.label')}</label><input id="rt-in" class="input" type="text" name="rtime" data-bind="rtime"></div>`,
    `<button class="btn btn-secondary" type="button" data-set="ret=">${tx('SAF-13.btn')}</button><button class="btn btn-primary" type="button" data-act="saf.escort.return" data-id="${view.ret}">${tx('SAF-13.btn.2')}</button>`) : '';
  return { main: `<div class="page-head"><div>${crumb('SAF-01', tx('SAF-13.crumb'))}<h1 class="t-title2">${tx('SAF-13.title')}</h1></div><div class="row" style="gap: 8px;">${asof()}</div></div>${tabs}${note}${flash()}
      <div class="qwrap"><div class="queue one"><div class="col">${body}</div></div></div>${foot}<p class="demo-note">${tx('SAF-13.p.4')}</p>`, overlay: `${dlg}${navBottom('SAF-13')}` };
}

export const screens = {
  'SAF-01': { app: 'ops', title: tx('SAF-01.title'), render: saf01 },
  'SAF-02': { app: 'ops', title: tx('SAF-02.title'), render: saf02 },
  'SAF-06': { app: 'ops', title: tx('SAF-06.title'), render: saf06 },
  'SAF-12': { app: 'ops', title: tx('SAF-12.title'), render: saf12 },
  'SAF-13': { app: 'ops', title: tx('SAF-13.title'), render: saf13 },
};

export { absBadge, asof, check, crumb, deniedMsg, demo, evacDialog, flash, fx, infoStep, navBottom };
