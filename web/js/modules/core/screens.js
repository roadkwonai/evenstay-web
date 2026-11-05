// 코어 화면. 보드(CORE-02·04·05·06·07·08·09·13·14) 마크업을 옮겨 상태로 채운다. 앱 바와 사이드바는 틀이 그린다.
import { tx } from '../../lib/text.js';
import { api, commit, db, denied, dialog, empty, esc, fmt, go, href, ic, me, sheetWrap, view } from '../../lib/kit.js';
import { OWNERS, SITES } from '../../lib/people.js';
import * as M from './model.js';

const site = 'S1';
const none = `<span class="muted" aria-label="${tx('core.shared.ariaLabel.3')}">-</span>`;
const val = (v) => (v === undefined || v === null ? none : v);
const demoNote = `<p class="demo-note">${tx('core.shared.p.4')}</p>`;
const OTHER_OWNER = tx('core.shared.text.5');
const arrow = '<svg class="i i-inline" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';
const minus = (n) => `−${fmt.won(Math.abs(n))}`;
const signed = (n) => (n < 0 ? minus(n) : fmt.won(n));
const isOwner = () => me().key === 'OWNER';
const head = (t, extra = '') => `<div class="page-head"><h1 class="t-title2">${t}</h1>${extra}</div>`;
const blocked = (t) => head(t) + denied(tx('core.shared.ownerNoDetail'), tx('core.shared.denied'), href('CORE-09'));
const modalBtn = (cls, label, attrs) => `<button class="btn ${cls}" type="button" ${attrs}>${label}</button>`;
// 억·천만 단위만 쓴다. shortcut: 만 단위 이하 끝자리가 있으면 만 단위로 줄여 적지 않고 그대로 쓴다.
const eok = (n) => { const e = Math.floor(n / 1e8), man = Math.round((n % 1e8) / 1e4); const mp = man ? (man % 1000 === 0 ? `${tx('CORE-08.text.8', { v: man / 1000 })}` : `${tx('CORE-08.text.7', { num: fmt.num(man) })}`) : ''; return `${tx('CORE-08.text.9', { v: e ? `${tx('CORE-08.text.6', { e })}` : '', v2: e && mp ? ' ' : '', mp })}`; };
const visibleSites = () => { const p = me(); return p.key === 'OWNER' ? Object.values(SITES).filter((s) => s.ownerId === p.ownerId) : p.siteId ? [SITES[p.siteId]] : Object.values(SITES); };
const dlg = (title, body, no, yes) => dialog(title, body, `${no}${yes}`);
const cancelBtn = (label = tx('core.shared.text.4')) => modalBtn('btn-secondary btn-md', label, 'data-set="dialog="');
const tabs = (label, items, cur) => `<nav class="tabs" aria-label="${label}">${items.map(([k, t]) => `<a href="#" data-set="tab=${k}"${cur === k ? ' aria-current="page"' : ''}>${t}</a>`).join('')}</nav>`;

// ---- 사업장·호실 (CORE-02) ----
function core02(params) {
  const sites = visibleSites();
  if (isOwner()) view.siteName = sites.map((s) => s.name).join(', ');
  const want = view.site || params.site || sites[0].id;
  if (!sites.some((s) => s.id === want)) return head(tx('CORE-02.title')) + denied(OTHER_OWNER, tx('CORE-02.denied'), href('CORE-09'));
  const s = SITES[want], sum = M.unitSummary(want), mask = isOwner();
  const rows = sum.rows.map((r) => {
    const names = r.contract ? r.contract.residentIds.map((id) => (mask ? M.maskName(M.nameOf(id)) : M.nameOf(id))).join(', ') : '';
    const cell = !r.contract ? '-' : mask ? esc(names) : `<a href="${href('CORE-04', { sel: r.contract.id })}">${esc(names)}</a>`;
    const parts = r.unit.label.split(' ');
    const badge = { ACTIVE: M.STATUS.ACTIVE, SIGNED: M.STATUS.SIGNED, TERMINATING: M.STATUS.TERMINATING, VACANT: tx('CORE-02.VACANT') }[r.state];
    return `<tr><td>${parts.length > 1 ? parts[0] : '-'}</td><td data-label="${tx('CORE-02.dataLabel.3')}">${parts[parts.length - 1]}</td><td data-label="${tx('CORE-02.dataLabel.4')}">${cell}</td><td data-label="${tx('CORE-02.dataLabel.5')}"><span class="badge">${badge}</span></td></tr>`;
  }).join('');
  const siteRows = sites.map((x) => `<tr${x.id === want ? ' class="sel"' : ''}><td><strong>${x.name}</strong></td><td data-label="${tx('CORE-02.dataLabel')}">${x.kind}</td><td data-label="${tx('CORE-02.dataLabel.2')}">${OWNERS[x.ownerId].name}</td><td class="r" data-label="${tx('CORE-02.dataLabel.3')}">${tx('CORE-02.td', { total: M.unitSummary(x.id).total })}</td><td><a class="btn btn-ghost btn-sm" href="#" data-set="site=${x.id}">${tx('CORE-02.btn')}</a></td></tr>`).join('');
  return `${head(tx('CORE-02.title'))}
  <div class="with-panel">
    <div class="stack lg">
    <section class="stack" aria-labelledby="sites"><h2 id="sites" class="t-heading2">${tx('CORE-02.h2')}</h2>
      <div class="tbl reflow"><table aria-label="${tx('CORE-02.ariaLabel')}"><thead><tr><th>${tx('CORE-02.h2')}</th><th>${tx('CORE-02.dataLabel')}</th><th>${tx('CORE-02.dataLabel.2')}</th><th class="r">${tx('CORE-02.dataLabel.3')}</th><th></th></tr></thead><tbody>${siteRows}</tbody></table></div></section>
    <section class="stack" aria-labelledby="rooms"><h2 id="rooms" class="t-heading2">${tx('CORE-02.h2.2', { name: s.name })}</h2>
      <div class="tbl reflow"><table aria-label="${tx('CORE-02.ariaLabel.2', { name: s.name })}"><thead><tr><th>${tx('CORE-02.th')}</th><th>${tx('CORE-02.dataLabel.3')}</th><th>${tx('CORE-02.dataLabel.4')}</th><th>${tx('CORE-02.dataLabel.5')}</th></tr></thead><tbody>${rows}</tbody></table></div></section>
    </div>
    <aside class="side-panel" aria-label="${tx('CORE-02.ariaLabel.3', { name: s.name })}"><span class="grab" aria-hidden="true"></span>
      <h2 class="t-heading2">${s.name}</h2>
      <dl class="kvp"><dt>${tx('CORE-02.dataLabel')}</dt><dd>${s.kind}</dd><dt>${tx('CORE-02.dataLabel.2')}</dt><dd>${OWNERS[s.ownerId].name}</dd><dt>${tx('CORE-02.dt.2')}</dt><dd>${tx('CORE-02.td', { total: sum.total })}</dd><dt>${tx('CORE-02.dt.3')}</dt><dd>${tx('CORE-02.dd.2', { occupied: sum.occupied })}</dd>${sum.movingIn ? `<dt>${tx('CORE-02.dt')}</dt><dd>${tx('CORE-02.dd', { movingIn: sum.movingIn })}</dd>` : ''}<dt>${tx('CORE-02.VACANT')}</dt><dd>${tx('CORE-02.dd.3', { vacant: sum.vacant })}</dd></dl>
      <p class="hint">${esc(db.core.unitHints[want])}</p></aside>
  </div>${demoNote}`;
}

// ---- 입주 계약 목록·상세 (CORE-04), 계약 작성·승계 확인 (CORE-05) ----
const histText = (h) => {
  if (h.kind === 'SUCCEED') return `${tx('core.shared.text.3', { from: h.from })} <span class="sr-only"> ${tx('core.shared.span')} </span>${tx('core.shared.span.2', { arrow, to: h.to })}`;
  if (h.kind === 'INSURANCE') return `${tx('core.shared.text.2', { v: M.INSURANCE[h.before] })} <span class="sr-only"> ${tx('core.shared.span')} </span>${arrow} ${M.INSURANCE[h.after]}`;
  if (h.kind === 'JEONSE') return `${tx('core.shared.text.6', { v: h.before ?? tx('core.shared.k') })} <span class="sr-only"> ${tx('core.shared.span')} </span>${arrow} ${h.after ?? tx('core.shared.k')}`;
  if (h.kind === 'PAYMENT') return h.basis ? tx('core.shared.pay.proxy', { won: fmt.won(h.amount), nameOf: esc(M.nameOf(h.residentId)) }) : tx('core.shared.pay', { won: fmt.won(h.amount) });
  return h.kind === 'SIGN' ? tx('core.shared.text') : tx('core.shared.btn.4');
};
function histCard(chainId) {
  const list = M.historyOf(chainId), out = [];
  for (let i = 0; i < list.length; i++) {
    const h = list[i], prev = list[i + 1];
    const merge = h.kind === 'MOVE_IN' && prev?.kind === 'SIGN' && prev.at.slice(0, 10) === h.at.slice(0, 10) && prev.by === h.by;
    out.push(`<div class="record"><span class="when">${h.at.slice(0, 10)}</span><span class="what"><b>${esc(h.by)}</b> ${merge ? tx('core.shared.push') : histText(h)}</span></div>`);
    if (merge) i++;
  }
  return out.length ? `<section class="card" aria-labelledby="hist"><h2 id="hist" class="t-heading2">${tx('core.shared.h2.3')}</h2><div>${out.join('')}</div></section>` : '';
}
function detail(c) {
  const names = c.residentIds.map(M.nameOf).join(', '), ml = M.lockedRule(c, 'meal');
  const first = db.core.contracts.filter((x) => x.chainId === c.chainId).map((x) => x.startDate).sort()[0];
  const reps = c.status === 'SUCCEEDED' ? [] : c.residentIds.flatMap((r) => M.repsOf(r));
  const contacts = M.contactsOfContract(c.id);
  const can = M.can('contract');
  const next = c.status === 'SIGNED' && can ? `<p>${tx('core.shared.p.3', { startDate: c.startDate })}</p>
      <div class="panel-act"><button class="btn btn-primary btn-sm" type="button" data-act="core.contract.movein" data-id="${c.id}">${tx('core.shared.btn.4')}</button></div>`
    : c.status === 'ACTIVE' && c.occupancy === 2 && can ? `<div class="panel-act"><button class="btn btn-secondary btn-sm" type="button" data-set="dialog=succeed">${tx('core.shared.btn.3')}</button></div>` : '';
  const prot = c.status === 'DRAFT' || !can ? '' : `<hr class="divider"><h3 class="t-headline">${tx('core.shared.h3')}</h3>
      <form class="stack" data-act="core.deposit.save" data-id="${c.id}">
      <div class="field"><label for="ins">${tx('core.shared.label.6')}</label><select id="ins" name="ins" class="input">${Object.entries(M.INSURANCE).map(([k, v]) => `<option value="${k}"${k === c.insurance ? ' selected' : ''}>${v}</option>`).join('')}</select></div>
      <div class="field"><label for="jeon">${tx('core.shared.label.7')}</label><input id="jeon" name="jeon" class="input" type="text" value="${c.jeonseOn ?? tx('core.shared.k')}"><span class="hint">${tx('core.shared.span.6')}</span></div>
      <div class="panel-act"><button class="btn btn-secondary btn-sm" type="submit">${tx('core.shared.btn.6')}</button></div></form>`;
  return `<aside class="side-panel" aria-label="${tx('core.shared.ariaLabel.5', { roomOfContract: M.roomOfContract(c) })}"><span class="grab" aria-hidden="true"></span>
    <div class="row between"><h2 class="t-heading2">${tx('core.shared.h2.4', { roomOfContract: M.roomOfContract(c), names: esc(names) })}</h2><span class="badge">${M.STATUS[c.status]}</span></div>
    <dl class="kvp"><dt>${tx('core.shared.label')}</dt><dd>${first}</dd><dt>${tx('core.shared.dt.2')}</dt><dd>${c.endDate ?? '-'}</dd>
      ${reps.length ? `<dt>${tx('core.shared.tabs')}</dt><dd>${reps.map((r) => `${esc(r.name)} (${M.BASIS[r.basis]}, ${r.scopes.map((x) => M.SCOPE[x]).join('·')}, ${tx('core.shared.validUntil', { d: r.validUntil })})`).join(', ')}</dd>` : ''}
      <dt>${tx('core.shared.th.4')}</dt><dd>${tx('core.shared.dd.2', { occupancy: c.occupancy, won: fmt.won(c.rate) })}</dd>${ml ? `<dt>${tx('core.shared.dt')}</dt><dd>${tx('core.shared.dd', { won: fmt.won(ml.unitPrice), perDay: ml.perDay })}</dd>` : ''}<dt>${tx('core.shared.label.5')}</dt><dd>${c.deposit ? fmt.won(c.deposit) : '-'}</dd></dl>
    ${next}
    <hr class="divider"><h3 class="t-headline">${tx('core.shared.h3.2')}</h3>
    ${contacts.length ? `<ol class="list">${contacts.map((x) => `<li class="cell"><span class="body"><span class="title">${x.order}. ${esc(x.name)} (${M.RELATION[x.relation]})</span><span class="sub">${tx('core.shared.sub', { phone: esc(x.phone) })}</span></span></li>`).join('')}</ol>
      <p class="hint">${tx('core.shared.p.7')}</p>` : `<p>${tx('core.shared.p.2')}</p>`}
    ${prot}</aside>`;
}
function draftSheet(c) {
  const k = M.fv, units = db.core.units.filter((u) => u.siteId === site), two = (view.fP2 || '').trim();
  const rate = M.ruleAt(site, 'recurring')[two ? 'COUPLE' : 'SINGLE'];
  const contacts = M.contactsOfContract(c.id);
  const one = (id, v, items) => `<select id="${id}" class="input" data-bind="${id}">${items.map(([a, b]) => `<option value="${a}"${a === v ? ' selected' : ''}>${b}</option>`).join('')}</select>`;
  const err = view.err ? `<div class="alert alert-err" role="alert">${ic('triangle-alert')}<p>${esc(view.err)}</p></div>` : '';
  return sheetWrap(`<section class="rsheet" role="dialog" aria-modal="true" aria-labelledby="rs-t">
    <header><h2 id="rs-t" class="t-heading1">${tx('core.shared.btn.2')}</h2><button class="btn btn-ghost btn-sm" type="button" aria-label="${tx('core.shared.ariaLabel.4')}" data-act="core.draft.discard" data-id="${c.id}">${ic('x')}</button></header>
    <div class="body">
      <div class="field"><label for="fRoom">${tx('core.shared.th')}</label>${one('fRoom', k('fRoom', units[0].id), units.map((u) => [u.id, `${SITES[site].name} ${u.label}`]))}</div>
      <div class="field"><label for="fStart">${tx('core.shared.label')}</label><input id="fStart" class="input" type="date" data-bind="fStart" value="${esc(k('fStart', M.today()))}"></div>
      <div class="field"><label for="fP1">${tx('core.shared.label.2')}</label><input id="fP1" class="input" type="text" data-bind="fP1" data-live value="${esc(view.fP1 ?? '')}"></div>
      <div class="field"><label for="fP2">${tx('core.shared.label.3')}</label><input id="fP2" class="input" type="text" data-bind="fP2" data-live value="${esc(view.fP2 ?? '')}"></div>
      <div class="field"><label for="fRate">${tx('core.shared.label.4', { v: two ? 2 : 1 })}</label><input id="fRate" class="input" type="text" value="${fmt.won(rate)}" readonly><span class="hint">${tx('core.shared.span.3')}</span></div>
      <div class="field"><label for="fDeposit">${tx('core.shared.label.5')}</label><input id="fDeposit" class="input" type="text" inputmode="numeric" data-bind="fDeposit" value="${esc(view.fDeposit ?? '')}"></div>
      <hr class="divider"><h3 class="t-headline">${tx('core.shared.h3')}</h3>
      <div class="field"><label for="fIns">${tx('core.shared.label.6')}</label>${one('fIns', k('fIns', 'UNKNOWN'), Object.entries(M.INSURANCE))}</div>
      <div class="field"><label for="fJeon">${tx('core.shared.label.7')}</label><input id="fJeon" class="input" type="text" data-bind="fJeon" value="${esc(k('fJeon', tx('core.shared.k')))}"><span class="hint">${tx('core.shared.span.4')}</span></div>
      <hr class="divider"><h3 class="t-headline">${tx('core.shared.h3.2')}</h3>
      <p>${tx('core.shared.p.5')}</p>
      ${contacts.length ? `<ol class="list">${contacts.map((x) => `<li class="cell"><span class="body"><span class="title">${x.order}. ${esc(x.name)} (${M.RELATION[x.relation]})</span><span class="sub">${tx('core.shared.sub', { phone: esc(x.phone) })}</span></span></li>`).join('')}</ol>` : ''}
      <div class="field"><label for="cName">${tx('core.shared.label.8')}</label><input id="cName" class="input" type="text" data-bind="cName" value="${esc(view.cName ?? '')}"></div>
      <div class="field"><label for="cRel">${tx('core.shared.th.6')}</label>${one('cRel', k('cRel', 'CHILD'), Object.entries(M.RELATION))}</div>
      <div class="field"><label for="cPhone">${tx('core.shared.label.9')}</label><input id="cPhone" class="input" type="text" data-bind="cPhone" value="${esc(view.cPhone ?? '')}"><span class="hint">${tx('core.shared.span.5')}</span></div>
      <div class="field"><label for="cOrder">${tx('core.shared.label.10')}</label><input id="cOrder" class="input" type="text" inputmode="numeric" data-bind="cOrder" value="${esc(k('cOrder', String(contacts.length + 1)))}"></div>
      <div class="scope">${ic('info')}<p>${tx('core.shared.p.6')} </p></div>
      <div><button class="btn btn-ghost btn-sm" type="button" data-act="core.contact.add" data-id="${c.id}">${ic('plus')}${tx('core.shared.btn.5')}</button></div>
      ${err}
    </div>
    <footer><button class="btn btn-ghost btn-sm" type="button" data-act="core.draft.discard" data-id="${c.id}">${tx('core.shared.text.4')}</button><button class="btn btn-primary btn-sm sheet-foot-main" type="button" data-act="core.contract.sign" data-id="${c.id}"${(view.fP1 || '').trim() ? '' : ' disabled'}>${tx('core.shared.text')}</button></footer>
  </section>`);
}
function core04(params) {
  if (isOwner()) return blocked(tx('core.shared.head'));
  const tab = view.tab || 'list', writer = M.can('contract');
  const open = view.dialog === 'draft' ? db.core.contracts.find((c) => c.id === view.draftId && c.status === 'DRAFT') : null;
  const top = head(tx('core.shared.head'), open ? `<span class="badge">${M.STATUS.DRAFT}</span>` : writer ? `<button class="btn btn-primary btn-sm" type="button" data-act="core.draft.open">${tx('core.shared.btn.2')}</button>` : '');
  const nav = tabs(tx('core.shared.tabs.3'), [['list', tx('core.shared.tabs.2')], ['reps', tx('core.shared.tabs')]], tab);
  if (tab === 'reps') {
    const rows = db.core.reps.filter((r) => r.activeFrom <= M.today()).map((r) => `<tr><td><strong>${M.roomOfContract(M.contractOf(r.residentId))} ${M.nameOf(r.residentId)}</strong></td><td data-label="${tx('core.shared.th.5')}">${esc(r.name)}</td><td data-label="${tx('core.shared.th.6')}">${M.RELATION[r.relation]}</td><td data-label="${tx('core.shared.th.7')}">${M.BASIS[r.basis]}</td><td data-label="${tx('core.shared.th.8')}">${r.scopes.map((x) => M.SCOPE[x]).join(', ')}</td><td data-label="${tx('core.shared.th.valid')}" class="num">${tx('core.shared.validUntil', { d: r.validUntil })}</td></tr>`).join('');
    return `${top}${nav}<section class="stack" aria-labelledby="plist"><h2 id="plist" class="t-heading2">${tx('core.shared.h2.2')}</h2><div class="tbl reflow"><table aria-label="${tx('core.shared.ariaLabel.2')}"><thead><tr><th>${tx('core.shared.th.2')}</th><th>${tx('core.shared.th.5')}</th><th>${tx('core.shared.th.6')}</th><th>${tx('core.shared.th.7')}</th><th>${tx('core.shared.th.8')}</th><th>${tx('core.shared.th.valid')}</th></tr></thead><tbody>${rows}</tbody></table></div></section>`;
  }
  const list = M.contractsOfSite(site).sort((a, b) => (db.core.units.find((u) => u.id === a.unitId)?.order - db.core.units.find((u) => u.id === b.unitId)?.order) || M.STATUS_RANK[a.status] - M.STATUS_RANK[b.status]);
  const sel = list.find((c) => c.id === (view.sel || params.sel)) || list[0];
  const rows = list.map((c) => `<tr${c === sel ? ' class="sel"' : ''}><td><strong>${M.roomOfContract(c)}</strong></td><td data-label="${tx('core.shared.th.2')}">${esc(c.residentIds.map(M.nameOf).join(', ') || '-')}</td><td data-label="${tx('core.shared.th.3')}"><span class="badge">${M.STATUS[c.status]}</span></td><td class="r" data-label="${tx('core.shared.th.4')}">${c.rate ? fmt.won(c.rate) : '-'}</td><td>${c.status === 'DRAFT' ? `<a class="btn btn-ghost btn-sm" href="#" data-act="core.draft.resume" data-id="${c.id}">${tx('core.shared.btn')}</a>` : `<a class="btn btn-ghost btn-sm" href="#" data-set="sel=${c.id}">${tx('core.shared.btn')}</a>`}</td></tr>`).join('');
  let overlay = '';
  if (open) overlay = draftSheet(open);
  else if (view.dialog === 'succeed' && sel?.status === 'ACTIVE') {
    const gone = sel.residentIds.find((x) => x !== sel.leadId);
    overlay = dlg(tx('core.shared.dlg'), `<p>${tx('core.shared.p', { nameOf: esc(M.nameOf(gone)), nameOf2: esc(M.nameOf(sel.leadId)) })}</p>`, cancelBtn(), modalBtn('btn-primary btn-md', tx('core.shared.modalBtn'), `data-act="core.contract.succeed" data-id="${sel.id}"`));
  }
  const main = `${top}${nav}
  <div class="with-panel"><div class="stack lg">
    <section class="stack" aria-labelledby="clist"><h2 id="clist" class="t-heading2">${tx('core.shared.h2')}</h2>
      <div class="tbl reflow"><table aria-label="${tx('core.shared.ariaLabel')}"><thead><tr><th>${tx('core.shared.th')}</th><th>${tx('core.shared.th.2')}</th><th>${tx('core.shared.th.3')}</th><th class="r">${tx('core.shared.th.4')}</th><th></th></tr></thead><tbody>${rows}</tbody></table></div></section>
    ${sel ? histCard(sel.chainId) : ''}
  </div>${sel ? detail(sel) : ''}</div>${demoNote}`;
  return { main, overlay };
}

// ---- 식사 기록 올리기·마감 (CORE-06) ----
function hookFile() { // 실제 파일을 고르면 내용을 읽어 미리보기로 넘긴다
  const d = document.getElementById('frame')?.contentDocument;
  if (!d || d.__coreCsv) return;
  d.__coreCsv = true;
  d.addEventListener('change', (e) => {
    const t = e.target, f = t?.matches?.('input[type=file][data-csv]') ? t.files[0] : null;
    if (f) f.text().then((txt) => { view.csvText = txt; view.csvName = f.name; commit(); });
  });
}
function core06() {
  if (isOwner()) return blocked(tx('CORE-06.title'));
  hookFile();
  const m = M.monthNow(), n = +m.slice(5), closed = M.closingOf(m), up = M.can('mealUpload'), pv = view.csvText ? M.parseCsv(view.csvText, m) : null;
  const demo = db.core.demoCsv[m] && up && !closed ? `<div><button class="btn btn-ghost btn-sm" type="button" data-act="core.meal.demo">${tx('CORE-06.btn', { m })}</button></div>` : '';
  const preview = pv ? `<section class="stack" aria-labelledby="pv"><h2 id="pv" class="t-heading2">${tx('CORE-06.h2.3')}</h2>
      <p>${tx('CORE-06.p.5', { total: pv.total, valid: pv.valid, length: pv.errors.length })}</p>
      ${pv.errors.length ? `<div class="tbl"><table aria-label="${tx('CORE-06.ariaLabel.2')}"><thead><tr><th>${tx('CORE-06.th')}</th><th>${tx('CORE-06.th.2')}</th></tr></thead><tbody>${pv.errors.map((e) => `<tr><td>${tx('CORE-06.td', { n: e.n })}</td><td class="wrap">${esc(e.msg)}</td></tr>`).join('')}</tbody></table></div>` : ''}
      <div class="row"><button class="btn btn-secondary btn-sm" type="button" data-act="core.meal.apply">${pv.errors.length ? tx('CORE-06.text.3') : tx('CORE-06.text.2')}</button><button class="btn btn-ghost btn-sm" type="button" data-act="core.meal.cancel">${tx('CORE-06.btn.2')}</button></div></section>` : '';
  const zero = M.zeroSkipResidents(m);
  const close = closed ? `<p class="t-label-lg">${tx('CORE-06.p.2', { slice: closed.at.slice(0, 10), slice2: closed.at.slice(11, 16), by: esc(closed.by) })}</p>` : M.can('mealClose') ? `<div class="panel-act"><button class="btn btn-primary btn-sm" type="button" data-set="dialog=close">${tx('CORE-06.modalBtn')}</button></div>` : '';
  const overlay = view.dialog === 'close' && !closed ? dlg(`${tx('CORE-06.text', { n })}`, `<p>${tx('CORE-06.p')}</p>`, cancelBtn(), modalBtn('btn-primary btn-md', tx('CORE-06.modalBtn'), 'data-act="core.meal.close"')) : '';
  return { main: `${head(tx('CORE-06.title'))}
  <div class="with-panel"><div class="stack lg">
    <section class="card" aria-labelledby="up"><h2 id="up" class="t-heading2">${tx('CORE-06.h2')}</h2>
      <p>${tx('CORE-06.p.3')}</p>
      <div class="field"><label for="csv">${tx('CORE-06.label', { m })}</label><input id="csv" class="input" type="file" accept=".csv" data-csv${up ? '' : ' disabled'}></div>${demo}</section>
    ${preview}
  </div>
  <aside class="side-panel" aria-label="${tx('CORE-06.ariaLabel')}"><span class="grab" aria-hidden="true"></span>
    <h2 class="t-heading2">${tx('CORE-06.h2.2')}</h2><p>${tx('CORE-06.p.4')}</p>
    <ul class="list">${zero.map((r) => `<li class="cell"><span class="body"><span class="title">${r.room} ${esc(r.name)}</span></span></li>`).join('')}</ul>${close}</aside></div>${demoNote}`, overlay };
}

// ---- 청구 (CORE-07) ----
const roomName = (id) => `${M.roomOfContract(M.contractById(id))}`;
function evidence(v, extra) {
  const c = M.contractById(v.contractId), n = +v.period.slice(5);
  const lines = v.lines.map((l) => {
    const lbl = l.code === 'RECURRING' ? `${tx('CORE-07.text.3', { occupancy: c.occupancy })}` : l.code === 'MEAL' ? `${tx('CORE-07.text.2', { meals: l.plain.meals })}` : l.code === 'MEAL_SKIP' ? `<span class="hl">${tx('CORE-07.span')}</span>` : tx('CORE-07.map.2');
    return `<li class="money"><span>${lbl}</span><b>${signed(l.amount)}</b></li>`;
  }).join('');
  const notes = v.lines.filter((l) => l.code === 'MEAL_SKIP' || l.code === 'SERVICE').map((l) => (l.code === 'MEAL_SKIP'
    ? `<p>${l.plain.absenceCount ? tx('CORE-07.p.abs', { minus: minus(l.amount), n, recorded: l.plain.count - l.plain.absenceCount, absence: l.plain.absenceCount, count: l.plain.count, won: fmt.won(l.plain.unitPrice) }) : tx('CORE-07.p.5', { minus: minus(l.amount), n, count: l.plain.count, won: fmt.won(l.plain.unitPrice) })}<br>${tx('CORE-07.br')}</p>`
    : `<p>${tx('CORE-07.p.4', { name: esc(l.plain.name), quantity: l.plain.quantity, won: fmt.won(l.plain.unitPrice), usedOn: l.plain.usedOn, source: esc(l.plain.source) })}</p>`)).join('');
  const pay = M.paymentsOf(v.id).at(-1);
  const payInfo = pay ? `<dl class="kvp"><dt>${tx('CORE-07.pay.th.2')}</dt><dd>${fmt.won(M.paidOf(v.id))}</dd><dt>${tx('CORE-07.pay.th.3')}</dt><dd>${tx('CORE-07.pay.mock')}</dd></dl><p class="hint">${tx('CORE-07.pay.note')}</p>` : '';
  return `<p class="t-label-lg muted">${tx('CORE-07.p.3', { roomName: roomName(v.contractId), nameOf: esc(M.nameOf(v.leadId)), n })}</p><p class="t-number-lg">${fmt.won(v.total)}</p><ul class="list">${lines}</ul>${notes}${payInfo}${extra || ''}`;
}
// 수납 칸: 상태 아래에 낸 금액, 방법, 대신 낸 사람을 적는다
function payCell(v) {
  if (v.status !== 'ISSUED') return `<td data-label="${tx('CORE-07.pay.th')}"></td>`;
  const last = M.paymentsOf(v.id).at(-1), state = { UNPAID: tx('CORE-07.pay.UNPAID'), PARTIAL: tx('CORE-07.pay.PARTIAL'), PAID: tx('CORE-07.pay.PAID') }[M.payState(v)];
  const how = last ? `<br><span class="t-body-sm muted">${fmt.won(M.paidOf(v.id))}, ${tx('CORE-07.pay.mock')}${last.proxyName ? `<br>${tx('CORE-07.pay.proxy', { name: esc(last.proxyName) })}` : ''}</span>` : '';
  return `<td class="wrap" data-label="${tx('CORE-07.pay.th')}"><div><span class="badge">${state}</span>${how}</div></td>`;
}

function core07(params) {
  if (isOwner()) return blocked(tx('CORE-07.title'));
  const tab = view.tab || params.tab || 'list', m = M.monthNow(), n = +m.slice(5), writer = M.can('bill');
  const invs = M.invoicesOfSite(site, m), drafts = invs.filter((v) => v.status === 'DRAFT');
  const allIssued = invs.length > 0 && !drafts.length;
  const top = head(tx('CORE-07.title'), tab === 'list' && writer ? `<button class="btn btn-secondary btn-sm" type="button" data-act="core.bill.run"${allIssued ? ' disabled' : ''}>${tx('CORE-07.btn.5')}</button>` : '');
  const nav = tabs(tx('CORE-07.tabs.3'), [['list', tx('CORE-07.tabs.2')], ['usage', tx('CORE-07.tabs')], ['inquiry', tx('CORE-07.ariaLabel.2')]], tab);
  const aside = (inner) => `<aside class="side-panel" aria-label="${tx('CORE-07.ariaLabel.4')}"><span class="grab" aria-hidden="true"></span>${inner}</aside>`;
  let body = '', overlay = '';
  if (tab === 'usage') {
    const us = M.pendingUsages(), sel = us.find((u) => u.id === view.use) || us[0];
    const rows = us.map((u) => `<tr${u === sel ? ' class="sel"' : ''}><td><strong>${esc(u.name)}</strong> (${u.room})</td><td data-label="${tx('CORE-07.th.7')}">${esc(u.item)}</td><td data-label="${tx('CORE-07.th.8')}">${u.usedOn}</td><td class="r" data-label="${tx('CORE-07.th.3')}">${fmt.won(u.amount)}</td><td data-label="${tx('CORE-07.th.9')}">${tx('CORE-07.td.3', { v: +u.month.slice(5) })}</td><td data-label="${tx('CORE-07.th.10')}"><a href="#" data-set="use=${u.id}">${esc(u.source)}</a></td></tr>`).join('');
    body = `<div class="with-panel"><div class="stack lg"><section class="stack" aria-labelledby="us"><h2 id="us" class="t-heading2">${tx('CORE-07.tabs')}</h2>
      <p>${tx('CORE-07.p.9')}</p>
      ${us.length ? `<div class="tbl reflow"><table aria-label="${tx('CORE-07.ariaLabel.3')}"><thead><tr><th>${tx('CORE-07.th')}</th><th>${tx('CORE-07.th.7')}</th><th>${tx('CORE-07.th.8')}</th><th class="r">${tx('CORE-07.th.3')}</th><th>${tx('CORE-07.th.9')}</th><th>${tx('CORE-07.th.10')}</th></tr></thead><tbody>${rows}</tbody></table></div>` : empty(tx('CORE-07.empty.2'))}</section></div>
      ${sel ? aside(`<h2 class="t-heading2">${tx('CORE-07.ariaLabel.4')}</h2><p class="t-label-lg muted">${tx('CORE-07.p.6', { room: sel.room, name: esc(sel.name), v: +sel.month.slice(5) })}</p>
        <ul class="list"><li class="money"><span>${tx('CORE-07.map.2')}</span><b>${fmt.won(sel.amount)}</b></li></ul><p>${tx('CORE-07.p.7', { item: esc(sel.item), won: fmt.won(sel.amount), usedOn: sel.usedOn, source: esc(sel.source) })}</p>
        ${writer ? `<div class="panel-act"><button class="btn btn-primary btn-sm" type="button" data-act="core.bill.run">${tx('CORE-07.btn.5')}</button></div>` : ''}`) : ''}</div>`;
  } else if (tab === 'inquiry') {
    const all = db.core.inquiries, open = all.filter((q) => q.status !== 'ANSWERED'), done = all.length - open.length, flt = view.iq || 'open';
    const show = all.filter((q) => (flt === 'open') === (q.status !== 'ANSWERED'));
    const sel = show.find((q) => q.id === view.iqsel) || show[0], sv = sel && db.core.invoices.find((v) => v.id === sel.invoiceId);
    const rows = show.map((q) => { const v = db.core.invoices.find((x) => x.id === q.invoiceId); return `<tr${q === sel ? ' class="sel"' : ''}><td><strong>${esc(M.nameOf(q.residentId))}</strong></td><td data-label="${tx('CORE-07.th.5')}">${tx('CORE-07.td', { roomName: roomName(v.contractId), v: +v.period.slice(5) })}</td><td class="r" data-label="${tx('CORE-07.th.3')}">${fmt.won(v.total)}</td><td data-label="${tx('CORE-07.th.6')}">${tx('CORE-07.td.2')}</td><td><a class="btn btn-ghost btn-sm" href="#" data-set="iqsel=${q.id}">${tx('CORE-07.btn.4')}</a></td></tr>`; }).join('');
    body = `<div class="with-panel"><div class="stack lg">
      <div class="stat-strip" aria-label="${tx('CORE-07.ariaLabel.6')}"><a href="#" data-set="iq=open"><span class="k">${tx('CORE-07.span.2')}</span><span class="v">${open.length}<span class="u">${tx('CORE-07.span.3')}</span></span></a><a href="#" data-set="iq=done"><span class="k">${tx('CORE-07.span.4')}</span><span class="v">${done}<span class="u">${tx('CORE-07.span.3')}</span></span></a></div>
      <div class="row between"><div class="seg" role="group" aria-label="${tx('CORE-07.ariaLabel.7')}"><a href="#" data-set="iq=open"${flt === 'open' ? ' aria-current="true"' : ''}>${tx('CORE-07.span.2')}</a><a href="#" data-set="iq=done"${flt === 'done' ? ' aria-current="true"' : ''}>${tx('CORE-07.btn.3')}</a></div></div>
      <section class="stack" aria-labelledby="lst"><h2 id="lst" class="t-heading2">${tx('CORE-07.h2')}</h2>
        ${show.length ? `<div class="tbl reflow"><table aria-label="${tx('CORE-07.ariaLabel.2')}"><thead><tr><th>${tx('CORE-07.th')}</th><th>${tx('CORE-07.th.5')}</th><th class="r">${tx('CORE-07.th.3')}</th><th>${tx('CORE-07.th.6')}</th><th></th></tr></thead><tbody>${rows}</tbody></table></div>` : empty(tx('CORE-07.empty'))}</section></div>
      ${sv ? aside(`<h2 class="t-heading2">${tx('CORE-07.ariaLabel.4')}</h2>${evidence(sv, sel.status !== 'ANSWERED' && writer ? `<div class="panel-act"><button class="btn btn-primary btn-sm" type="button" data-act="core.inquiry.answer" data-id="${sel.id}">${tx('CORE-07.btn.3')}</button></div>` : '')}`) : ''}</div>`;
  } else {
    const past = M.invoicesOfSite(site, M.addMonths(m, -1)).filter(M.isIssued), inTable = [...invs, ...past];
    const sel = view.inv === 'none' ? null : inTable.find((v) => v.contractId === view.inv || v.id === view.inv) || inTable[0];
    const row = (v, key) => `<tr${v === sel ? ' class="sel"' : ''}><td><strong>${esc(M.nameOf(v.leadId))}</strong><br><span class="t-body-sm muted">${roomName(v.contractId)}</span></td><td class="r" data-label="${tx('CORE-07.th.3')}">${fmt.won(v.total)}</td><td class="num" data-label="${tx('CORE-07.th.4')}">${v.dueOn ?? tx('CORE-07.map')}</td>${payCell(v)}<td><a class="btn btn-ghost btn-sm" href="#" data-set="inv=${key}">${tx('CORE-07.btn.4')}</a></td></tr>`;
    const rows = invs.map((v) => row(v, v.contractId)).join('');
    const head7 = `<thead><tr><th>${tx('CORE-07.th')}</th><th class="r">${tx('CORE-07.th.3')}</th><th>${tx('CORE-07.th.4')}</th><th>${tx('CORE-07.pay.th')}</th><th></th></tr></thead>`;
    const pastN = past.length ? +past[0].period.slice(5) : 0;
    const warn = view.needClose ? `<div class="alert alert-err" role="alert">${ic('triangle-alert')}<p>${tx('CORE-07.p.2', { n })}</p></div>
      <div class="row"><button class="btn btn-secondary btn-sm" type="button" data-act="core.bill.run" data-force="1">${tx('CORE-07.btn')}</button><button class="btn btn-ghost btn-sm" type="button" data-set="needClose=">${tx('CORE-07.btn.2')}</button></div>` : '';
    body = `<div class="with-panel"><div class="stack lg"><section class="stack" aria-labelledby="inv"><h2 id="inv" class="t-heading2">${tx('CORE-07.ariaLabel', { n })}</h2>
      <p>${tx('CORE-07.p.8', { n, length: M.billable(site, m).length, md: fmt.md(M.monthEnd(m)) })}</p>${warn}
      ${invs.length ? `<div class="tbl reflow"><table aria-label="${tx('CORE-07.ariaLabel', { n })}">${head7}<tbody>${rows}</tbody></table></div>` : ''}</section>
      ${past.length ? `<section class="stack" aria-labelledby="pinv"><h2 id="pinv" class="t-heading2">${tx('CORE-07.ariaLabel', { n: pastN })}</h2><div class="tbl reflow"><table aria-label="${tx('CORE-07.ariaLabel', { n: pastN })}">${head7}<tbody>${past.map((v) => row(v, v.id)).join('')}</tbody></table></div></section>` : ''}</div>
      ${sel ? aside(`<div class="row between"><h2 class="t-heading2">${tx('CORE-07.ariaLabel.4')}</h2><button class="btn btn-ghost btn-sm" type="button" aria-label="${tx('CORE-07.ariaLabel.5')}" data-set="inv=none">${ic('x')}</button></div>${evidence(sel, sel.status === 'DRAFT' && writer ? `<div class="panel-act"><button class="btn btn-primary btn-sm" type="button" data-set="dialog=issue">${tx('CORE-07.modalBtn')}</button></div>` : '')}`) : ''}</div>`;
    if (view.dialog === 'issue' && drafts.length) overlay = dlg(`${tx('CORE-07.text', { n, length: drafts.length })}`, `<p>${tx('CORE-07.p', { addDays: M.addDays(M.today(), M.ruleAt(site, 'schedule').dueDays), dueDays: M.ruleAt(site, 'schedule').dueDays })}</p>`, cancelBtn(), modalBtn('btn-primary btn-md', tx('CORE-07.modalBtn'), 'data-act="core.bill.issue"'));
  }
  return { main: `${top}${allIssued && writer && tab === 'list' ? `<p class="muted">${tx('CORE-07.whyOff')}</p>` : ''}${nav}${body}${demoNote}`, overlay };
}

// ---- 회원 청구서 (CORE-08), 청구서 결제 (CORE-16) ----
const paidLine = (v) => { const x = M.paymentsOf(v.id).at(-1); return tx('CORE-08.pay.paid', { md: fmt.md(x.on), won: fmt.won(M.paidOf(v.id)) }); };
const paidCard = (v) => `<div class="alert alert-ok" role="status">${ic('check')}<div class="stack" style="gap: 4px;"><p class="t-body-lg">${paidLine(v)}</p><p class="t-body-lg">${tx('CORE-08.pay.practice')}</p></div></div>`;
// 청구서 맨 위: 다 냈으면 낸 사실, 일부를 냈으면 남은 금액, 아니면 낼 돈과 기한
function billTop(inv) {
  const v = M.rawInvoice(inv.id), st = M.payState(v), paid = M.paidOf(v.id), left = inv.total - paid;
  if (st === 'PAID') return `<h2 id="sum" class="sr-only">${tx('CORE-16.title')}</h2>${paidCard(v)}`;
  const due = `<p class="t-heading1">${tx('CORE-08.p.9', { md: fmt.md(inv.dueOn) })}</p>`;
  if (st === 'PARTIAL') return `<h2 id="sum" class="t-label-lg muted">${tx('CORE-16.amount.left')}</h2><p class="t-number-lg">${fmt.won(left)}</p><p class="t-body-lg">${tx('CORE-08.pay.left', { paid: fmt.won(paid), won: fmt.won(left) })}</p>${due}`;
  return `<h2 id="sum" class="t-label-lg muted">${tx('CORE-08.h2.2')}</h2><p class="t-number-lg">${fmt.won(inv.total)}</p>${due}`;
}
function payAct(inv) {
  const v = M.rawInvoice(inv.id), open = M.openAttempt(inv.id), st = M.payState(v);
  if (st === 'PAID') return '';
  if (open) return `<a class="btn btn-primary btn-block" href="${href('CORE-16', { at: open.id })}">${tx('CORE-08.pay.going')}</a>`;
  if (!M.canPay()) return `<p class="t-body-lg">${tx('CORE-08.pay.noScope')}</p>`;
  return `<a class="btn btn-primary btn-block" href="${href('CORE-16', { inv: inv.id })}">${tx('CORE-08.pay.btn')}</a>`;
}
function core16(params) {
  const p = me(), rid = p.residentId, nameOf = esc(M.nameOf(rid));
  const link = (k, c = 'btn-secondary') => `<a class="btn ${c} btn-block" href="${href('CORE-08')}">${tx(k)}</a>`, back = link('CORE-16.back'), done = link('CORE-16.result.back');
  if (!['MEMBER', 'PROXY'].includes(p.key)) return denied(tx('CORE-16.title'), tx('core.shared.denied'), href('COM-07'));
  const a = params.at ? M.attemptById(params.at) : null;
  const inv = M.rawInvoice(a?.invoiceId ?? params.inv ?? M.latestInvoice(rid)?.id);
  if (!inv) { go('CORE-08'); return ''; }
  const n = +inv.period.slice(5), paid = M.paidOf(inv.id), head16 = (t) => `<h1 class="t-title3">${t}</h1>`;
  const money = (label, won) => `<section class="card" aria-label="${label}"><h2 class="t-label-lg muted">${label}</h2><p class="t-number-lg">${fmt.won(won)}</p></section>`;
  if (a?.status === 'SUCCEEDED') return `${head16(p.key === 'PROXY' ? tx('CORE-16.ok.h1.proxy', { nameOf, n }) : tx('CORE-16.ok.h1', { n }))}${paidCard(inv)}<p class="t-body-lg">${tx('CORE-16.ok.p')}</p>${done}`;
  if (a?.status === 'FAILED') return `${head16(tx('CORE-16.fail.h1'))}<div class="alert alert-err" role="alert">${ic('triangle-alert')}<p class="t-body-lg">${tx('CORE-16.fail.p')}</p></div>${link('CORE-16.result.back', 'btn-primary')}`;
  if (a?.status === 'REQUESTED') {
    const pick = (r, cls, label) => `<button class="btn ${cls} btn-block" type="button" data-act="core.pay.close" data-id="${a.id}" data-r="${r}">${label}</button>`;
    return `${head16(tx('CORE-16.mock.h1'))}<p class="t-body-lg">${tx('CORE-16.mock.p')}</p>${money(tx('CORE-16.amount'), a.amount)}
      <div class="stack action-bar">${pick('SUCCEEDED', 'btn-primary', tx('CORE-16.mock.ok'))}${pick('FAILED', 'btn-secondary', tx('CORE-16.mock.fail'))}${pick('CANCELLED', 'btn-secondary', tx('CORE-16.mock.stop'))}</div>`;
  }
  if (M.payState(inv) === 'PAID') { const x = M.paymentsOf(inv.id).at(-1); return `${head16(tx('CORE-16.h1', { n }))}<p class="t-body-lg">${tx('CORE-16.already', { md: fmt.md(x.on), won: fmt.won(paid) })}</p>${done}`; }
  if (!M.canPay()) return `${head16(tx('CORE-16.h1', { n }))}<p class="t-body-lg">${M.repExpired() ? tx('CORE-16.expired', { nameOf }) : tx('CORE-16.noPay', { nameOf })}</p>${done}`;
  const open = M.openAttempt(inv.id);
  if (open) { go('CORE-16', { at: open.id }); return ''; }
  return `${head16(tx('CORE-16.h1', { n }))}
    ${p.key === 'PROXY' ? `<div class="scope">${ic('eye')}<p class="t-body-lg">${tx('CORE-16.proxy', { name: esc(p.name), nameOf })}</p></div>` : ''}
    ${paid ? `<p class="t-body-lg">${tx('CORE-16.left.note', { paid: fmt.won(paid) })}</p>` : ''}${money(paid ? tx('CORE-16.amount.left') : tx('CORE-16.amount'), inv.total - paid)}
    <p class="t-body-lg">${tx('CORE-16.practice')}</p>
    <div class="stack action-bar"><button class="btn btn-primary btn-block" type="button" data-act="core.pay.start" data-id="${inv.id}">${tx('CORE-08.pay.btn')}</button>${back}</div>
    <p class="t-body-lg">${tx('CORE-16.front')}</p>`;
}

function core08() {
  const p = me(), rid = p.residentId, inv = M.latestInvoice(rid), c = M.contractOf(rid), proxy = p.key === 'PROXY';
  if (!inv) {
    const pre = c && c.status === 'SIGNED' ? `<section class="card" aria-label="${tx('CORE-08.ariaLabel')}"><p class="t-body-lg">${tx('CORE-08.p.7', { md: fmt.md(c.startDate) })}</p><p class="t-body-lg">${tx('CORE-08.p.8', { v: +c.startDate.slice(5, 7) })}</p></section>` : '';
    return `<h1 class="t-title3">${c && c.status === 'SIGNED' ? tx('CORE-08.text.5') : tx('CORE-08.text.4')}</h1>${pre}`;
  }
  const n = +inv.month.slice(5);
  const items = inv.lines.map((l) => `<li><a class="cell item-row" href="#"><span class="body"><span class="title">${esc(l.label)}</span></span><b class="t-number">${signed(l.amount)}</b>${ic('chevron-right')}</a></li>`).join('');
  const skip = inv.lines.find((l) => l.code === 'MEAL_SKIP');
  const ins = { YES: tx('CORE-08.YES'), NO: tx('CORE-08.NO'), UNKNOWN: tx('CORE-08.UNKNOWN') }[c.insurance];
  const jeon = c.jeonseOn ? `${tx('CORE-08.text.3', { v: +c.jeonseOn.slice(0, 4), v2: +c.jeonseOn.slice(5, 7), v3: +c.jeonseOn.slice(8) })}` : tx('CORE-08.text.2');
  const prot = proxy ? '' : `<p class="t-body-lg">${tx('CORE-08.p.10', { ins, jeon, v: c.insurance === 'UNKNOWN' ? tx('CORE-08.text') : '' })}</p>`;
  const dep = c.deposit ? `<section class="stack" aria-labelledby="dep-h"><h2 id="dep-h" class="t-heading2">${tx('CORE-08.h2')}</h2>
        <p class="t-body-lg">${tx('CORE-08.p.6', { eok: eok(c.deposit) })}</p>${prot}</section>` : '';
  const cs = M.contactsOfContract(c.id);
  const contacts = `<section class="stack" id="contacts" aria-labelledby="ct-h"><h2 id="ct-h" class="t-heading2">${tx('CORE-08.h2.3')}</h2>
        ${cs.length ? `<p class="t-body-lg">${tx('CORE-08.p.4')}</p><ol class="list">${cs.map((x) => `<li class="cell"><span class="body"><span class="title">${x.order}. ${esc(x.name)} (${M.RELATION[x.relation]})</span><span class="sub">010-○○○○-○○○○</span></span></li>`).join('')}</ol>
        <p class="t-body-md muted">${tx('CORE-08.p.5')}</p>` : `<p class="t-body-lg">${tx('CORE-08.p.3')}</p>`}</section>`;
  const skipLine = skip ? `<p class="t-body-lg"><span class="hl">${tx('CORE-08.span', { count: skip.plain.count, won: fmt.won(skip.plain.amount) })}</span></p>` : '', isPaid = M.payState(M.rawInvoice(inv.id)) === 'PAID';
  return `${proxy ? `<div class="scope">${ic('eye')}<p class="t-body-lg">${tx('CORE-08.p.2', { nameOf: esc(M.nameOf(rid)) })}</p></div>` : ''}
    <h1 class="t-title3">${tx('CORE-08.h1', { n })}</h1>
    <section class="card bill" aria-labelledby="sum"><div class="bill-sum">${billTop(inv)}${isPaid ? '' : skipLine}</div>
      <div class="band"><ul class="list">${items}</ul>${isPaid ? skipLine : ''}${inv.meals ? `<p class="t-body-lg">${tx('CORE-08.p', { n, meals: inv.meals })}</p>` : ''}</div></section>
    <div class="stack">${payAct(inv)}<button class="btn btn-secondary btn-block" type="button" data-act="core.inquiry.create" data-id="${inv.id}">${tx('CORE-08.btn')}</button></div>
    <div class="pair">${dep}${contacts}</div>`;
}

// ---- 소유주 현황 (CORE-09), 월 리포트 (CORE-14) ----
const wrap960 = (inner) => `<div class="stack lg" style="max-width: 960px; margin: 0 auto; width: 100%;">${inner}</div>`;
function core09() {
  const p = me(), sites = visibleSites();
  if (isOwner()) view.siteName = sites.map((s) => s.name).join(', ');
  const intro = isOwner() ? `${tx('CORE-09.text.3', { name: OWNERS[p.ownerId].name, length: sites.length })}` : `${tx('CORE-09.text.2', { length: sites.length })}`;
  const cards = sites.map((s) => {
    const t = M.ownerTotals(s.id), sum = M.unitSummary(s.id), mn = t.month ? +t.month.slice(5) : null;
    const rows = t.rows.map((v) => `<tr><td>${roomName(v.contractId)}</td><td data-label="${tx('CORE-09.th.2')}">${esc(M.maskName(M.nameOf(v.leadId)))}</td><td class="r" data-label="${tx('CORE-09.th.3', { mn })}">${fmt.won(v.total)}</td></tr>`).join('');
    const y = M.monthNow();
    return `<section class="card" aria-labelledby="site-${s.id}"><div class="row between"><h2 id="site-${s.id}" class="t-heading2">${s.name}</h2><span class="badge">${s.kind}</span></div>
      <dl class="kv"><dt>${tx('CORE-09.th')}</dt><dd>${tx('CORE-09.dd', { total: sum.total })}</dd><dt>${tx('CORE-09.dt')}</dt><dd>${tx('CORE-09.dd.2', { residingCount: M.residingCount(s.id) })}</dd><dt>${mn ? `${tx('CORE-09.text', { mn })}` : tx('CORE-09.map.2')}</dt><dd>${t.total === null ? none : fmt.won(t.total)}</dd><dt>${tx('CORE-14.card.12')}</dt><dd>${M.paidSum(t.rows) === null ? tx('CORE-14.card.11') : fmt.won(M.paidSum(t.rows))}</dd></dl>
      ${rows ? `<div class="tbl reflow"><table aria-label="${tx('CORE-09.ariaLabel')}"><thead><tr><th>${tx('CORE-09.th')}</th><th>${tx('CORE-09.th.2')}</th><th class="r">${tx('CORE-09.th.3', { mn })}</th></tr></thead><tbody>${rows}</tbody></table></div>` : `<p class="t-body-md muted">${tx('CORE-09.p', { v: +y.slice(0, 4), v2: +y.slice(5) })}</p>`}</section>`;
  }).join('');
  const mg = db.core.management.filter((x) => sites.some((s) => s.id === x.siteId)).map((x) => `<tr><td data-label="${tx('CORE-09.th.4')}"><strong>${SITES[x.siteId].name}</strong></td><td data-label="${tx('CORE-09.th.5')}">${x.installerName}</td><td data-label="${tx('CORE-09.th.6')}">${x.operatorName}</td><td class="num" data-label="${tx('CORE-09.th.7')}">${x.validFrom}</td><td data-label="${tx('CORE-09.th.8')}">${x.validTo ?? tx('CORE-09.map')}</td></tr>`).join('');
  return wrap960(`${head(tx('CORE-09.title'), `<a class="btn btn-primary btn-sm" href="${href('CORE-14')}">${tx('CORE-09.btn')}</a>`)}<p>${intro}</p>${cards}
    <section class="card" aria-labelledby="mgmt"><h2 id="mgmt" class="t-heading2">${tx('CORE-09.h2')}</h2><p class="t-body-md muted">${tx('CORE-09.p.2')}</p>
      <div class="tbl reflow"><table aria-label="${tx('CORE-09.h2')}"><thead><tr><th>${tx('CORE-09.th.4')}</th><th>${tx('CORE-09.th.5')}</th><th>${tx('CORE-09.th.6')}</th><th>${tx('CORE-09.th.7')}</th><th>${tx('CORE-09.th.8')}</th></tr></thead><tbody>${mg}</tbody></table></div></section>${demoNote}`);
}
const pick = (o, ...ks) => { for (const k of ks) if (o && o[k] !== undefined && o[k] !== null) return o[k]; return null; };
const ask = (fn) => { try { return { v: fn() }; } catch { return { fail: true }; } };
function core14() {
  const sites = visibleSites();
  if (isOwner()) view.siteName = sites.map((s) => s.name).join(', ');
  const issued = [...new Set(db.core.invoices.filter((v) => M.isIssued(v) && sites.some((s) => s.id === v.siteId)).map((v) => v.period))].sort();
  const cur = M.monthNow(), first = issued[0] ?? cur, months = [];
  for (let m = first; m <= cur; m = M.addMonths(m, 1)) months.push(m);
  const m = view.repMonth || issued[issued.length - 1] || cur, n = +m.slice(5), y = m.slice(0, 4);
  const end = M.monthEnd(m), ref = end < M.today() ? end : M.today(), isNow = m === cur;
  const card = (title, rows) => `<section class="card" aria-label="${title}"><h2 class="t-heading2">${title}</h2><dl class="kv">${rows.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl></section>`;
  const fail = (t) => `<section class="card" aria-label="${t}"><h2 class="t-heading2">${t}</h2><p>${tx('CORE-14.p.3', { t })} <button class="btn btn-ghost btn-sm" type="button" data-set="reload=${db.now}">${tx('CORE-14.btn')}</button></p></section>`;
  const blocks = sites.map((s) => {
    const sum = M.unitSummary(s.id, ref), inv = db.core.invoices.filter((v) => v.siteId === s.id && M.isIssued(v) && v.period === m);
    const away = new Set(db.core.absences.filter((a) => a.status !== 'CANCELLED' && a.startedOn <= M.today() && a.startedOn <= end && (!a.returnedOn || a.returnedOn >= `${m}-01`) && M.contractsOfSite(s.id).some((c) => c.residentIds.includes(a.residentId))).map((a) => a.residentId));
    const own = s.id === site;
    const sf = own ? ask(() => api.safety.monthSummary?.(m)) : { v: null }, rq = own ? ask(() => api.requests.monthSummary?.(m)) : { v: null };
    const cnt = (v, u) => (v === null ? none : `${v}${u}`);
    return `<h2 class="t-heading1">${tx('CORE-14.h2', { name: s.name, y, n })}</h2>
      <div class="grid2" style="align-items: start;">
      ${card(`${tx('CORE-14.text.7', { ref })}`, [[tx('CORE-14.card.19'), `${tx('CORE-14.text.6', { total: sum.total })}`], [tx('CORE-14.card.18'), `${tx('CORE-14.text.5', { occupied: sum.occupied, movingOut: sum.movingOut })}`], [tx('CORE-14.card.17'), `${tx('CORE-14.text.4', { movingIn: sum.movingIn })}`], [tx('CORE-14.card.16'), `${tx('CORE-14.text.3', { vacant: sum.vacant })}`]])}
      ${inv.length ? card(tx('CORE-14.ariaLabel'), [[tx('CORE-14.card.15'), `${tx('CORE-14.text.2', { length: inv.length })}`], [tx('CORE-14.card.14'), fmt.won(inv.reduce((t, v) => t + v.total, 0))]]) : `<section class="card" aria-label="${tx('CORE-14.ariaLabel')}"><h2 class="t-heading2">${tx('CORE-14.ariaLabel')}</h2><p>${tx('CORE-14.p.2', { y, n })}</p></section>`}
      ${card(tx('CORE-14.card.13'), [[tx('CORE-14.card.12'), M.paidSum(inv) === null ? tx('CORE-14.card.11') : fmt.won(M.paidSum(inv))]])}
      ${card(tx('CORE-14.card.10'), [[tx('CORE-14.card.9'), `${tx('CORE-14.text', { size: away.size })}`]])}
      ${sf.fail ? fail(tx('CORE-14.card.8')) : card(tx('CORE-14.card.8'), [[tx('CORE-14.card.7'), cnt(pick(sf.v, 'signals', 'signalCount', 'received'), tx('CORE-14.cnt'))], [tx('CORE-14.card.6'), cnt(pick(sf.v, 'medianMinutes', 'median', 'ackMedian'), tx('CORE-14.cnt.2'))], [tx('CORE-14.card.5'), cnt(pick(sf.v, 'resolved', 'done', 'closed'), tx('CORE-14.cnt'))]])}
      ${rq.fail ? fail(tx('CORE-14.card.4')) : card(tx('CORE-14.card.4'), [[tx('CORE-14.card.3'), cnt(pick(rq.v, 'received', 'created', 'opened', 'intake'), tx('CORE-14.cnt'))], [tx('CORE-14.card.2'), cnt(pick(rq.v, 'closed', 'done'), tx('CORE-14.cnt'))], [tx('CORE-14.card'), cnt(pick(rq.v, 'openAtEnd', 'openEnd', 'stillOpen'), tx('CORE-14.cnt'))]])}
      </div>${own ? '' : `<p class="muted">${tx('CORE-14.dashNote')}</p>`}`;
  }).join('');
  return wrap960(`<div class="page-head"><div><nav class="crumb keep" aria-label="${tx('CORE-14.ariaLabel.2')}"><a href="${href('CORE-09')}">${tx('CORE-14.a')}</a></nav><h1 class="t-title2">${tx('CORE-14.title')}</h1></div>
      <p class="asof">${tx('CORE-14.p.4', { ymd: fmt.ymd(db.now), hm: fmt.hm(db.now) })} <button class="btn btn-ghost btn-sm" type="button" data-set="reload=${db.now}">${ic('refresh-cw')}${tx('CORE-14.btn')}</button></p></div>
    <p>${tx('CORE-14.p.5')}</p>
    <div class="field" style="max-width: 16em;"><label for="repMonth">${tx('CORE-14.label')}</label><select id="repMonth" class="input" data-bind="repMonth" data-live>${months.map((x) => `<option value="${x}"${x === m ? ' selected' : ''}>${tx('CORE-14.option', { slice: x.slice(0, 4), v: +x.slice(5) })}</option>`).join('')}</select></div>
    ${isNow ? `<div class="alert" role="status">${ic('info')}<p><b>${tx('CORE-14.b')}</b> ${tx('CORE-14.b.2')}</p></div>` : ''}
    ${blocks}${`<p class="demo-note">${tx('CORE-14.p')}</p>`}`);
}

// ---- 장기 부재 (CORE-13) ----
function core13() {
  if (isOwner()) return blocked(tx('CORE-13.title'));
  const list = M.openAbsences(), writer = M.can('absence'), sel = list.find((a) => a.id === view.sel) || list[0];
  const f = { rid: M.fv('abRes', M.openableResidents()[0]?.id), start: M.fv('abStart', M.today()), unknown: M.fv('abUnknown', view.abExp ? '' : '1'), route: M.fv('abRoute', 'FRONT') };
  const tgt = list.find((a) => a.id === view.target);
  const act = (a, d, label, cls = 'btn-ghost') => `<button class="btn ${cls} btn-sm" type="button" data-set="dialog=${d}&target=${a.id}" data-who="${a.residentId}">${label}</button>`;
  const rows = list.map((a) => `<tr${a === sel ? ' class="sel"' : ''}><td><strong>${a.room}</strong></td><td data-label="${tx('CORE-13.th.2')}">${esc(a.name)}</td><td class="num" data-label="${tx('CORE-13.th.3')}">${a.startedOn}</td>
    <td data-label="${tx('CORE-13.th.4')}">${a.expectedOn ? `<span class="num">${a.expectedOn}</span>${a.overdue ? `<br><span class="badge">${tx('CORE-13.span')}</span>` : ''}` : tx('CORE-13.dlg.4')}</td>
    <td>${writer ? `<span class="row-act">${act(a, 'return', tx('CORE-13.act'))}<button class="btn btn-ghost btn-sm" type="button" aria-label="${tx('CORE-13.ariaLabel.3')}" data-set="sel=${a.id}">${ic('ellipsis')}</button></span>` : ''}</td></tr>`).join('');
  const panel = sel ? `<aside class="side-panel" aria-label="${tx('CORE-13.ariaLabel.2')}"><span class="grab" aria-hidden="true"></span><h2 class="t-heading2">${tx('CORE-13.h2', { room: sel.room, name: esc(sel.name) })}</h2>
      <dl class="kvp"><dt>${tx('CORE-13.th.3')}</dt><dd>${sel.startedOn}</dd><dt>${tx('CORE-13.th.4')}</dt><dd>${sel.expectedOn ?? tx('CORE-13.dlg.4')}${sel.overdue ? ` <span class="badge">${tx('CORE-13.span')}</span>` : ''}</dd><dt>${tx('CORE-13.legend.2')}</dt><dd>${sel.route ? M.ROUTE[sel.route] : '-'}</dd></dl>
      ${sel.overdue ? `<p>${tx('CORE-13.p.4', { expectedOn: sel.expectedOn })}</p>` : ''}
      ${writer ? `<div class="stack">${act(sel, 'return', tx('CORE-13.act'), 'btn-secondary')}${act(sel, 'expected', tx('CORE-13.dlg.2'), 'btn-secondary')}${act(sel, 'cancel', tx('CORE-13.modalBtn'), 'btn-secondary')}</div>` : ''}</aside>` : '';
  const err = view.err ? `<div class="alert alert-err" role="alert">${ic('triangle-alert')}<p>${esc(view.err)}</p></div>` : '';
  const unk = (on) => `<label class="choice"><input type="checkbox" data-bind="abUnknown" data-live${on ? ' checked' : ''}>${tx('CORE-13.dlg.4')}</label>`;
  let overlay = '';
  if (view.dialog === 'start' && writer) {
    overlay = dlg(tx('CORE-13.btn'), `<div class="field"><label for="abRes">${tx('CORE-13.th.2')}</label><select id="abRes" class="input" data-bind="abRes">${M.openableResidents().map((r) => `<option value="${r.id}"${r.id === f.rid ? ' selected' : ''}>${r.room} ${esc(r.name)}</option>`).join('')}</select></div>
      <div class="field"><label for="abStart">${tx('CORE-13.th.3')}</label><input id="abStart" class="input" type="date" data-bind="abStart" value="${f.start}"></div>
      <div class="field"><label for="abExp">${tx('CORE-13.th.4')}</label><input id="abExp" class="input" type="date" data-bind="abExp" data-live value="${esc(view.abExp ?? '')}" placeholder="${tx('CORE-13.placeholder')}">${unk(f.unknown)}</div>
      <fieldset style="border: 0; padding: 0; margin: 0;"><legend class="label" style="font-weight: 600; margin-bottom: 4px;">${tx('CORE-13.legend.2')}</legend><div class="scale-4">${Object.entries(M.ROUTE).map(([k, v]) => `<label class="choice"><input type="radio" name="abRoute" value="${k}" data-bind="abRoute"${k === f.route ? ' checked' : ''}>${v}</label>`).join('')}</div></fieldset>
      <p class="hint">${tx('CORE-13.p.3')}</p>${err}`, cancelBtn(), modalBtn('btn-primary btn-md', tx('CORE-13.modalBtn.3'), 'data-act="core.absence.review"'));
  } else if (view.dialog === 'startConfirm' && writer) {
    const r = M.openableResidents().find((x) => x.id === f.rid), exp = f.unknown || !view.abExp ? null : view.abExp;
    overlay = dlg(tx('CORE-13.dlg.5'), `<p>${tx('CORE-13.p.6', { room: r.room, name: esc(r.name), start: f.start, v: exp ?? tx('CORE-13.dlg.4') })}</p>`, modalBtn('btn-secondary btn-md', tx('CORE-13.modalBtn.4'), 'data-set="dialog=start"'), modalBtn('btn-primary btn-md', tx('CORE-13.modalBtn.3'), 'data-act="core.absence.start"'));
  } else if (view.dialog === 'return' && tgt && writer) {
    overlay = dlg(tx('CORE-13.dlg.3'), `<p>${tx('CORE-13.p.2', { room: tgt.room, name: esc(tgt.name), today: M.today() })}</p>`, cancelBtn(), modalBtn('btn-primary btn-md', tx('CORE-13.modalBtn.3'), 'data-act="core.absence.return"'));
  } else if (view.dialog === 'expected' && tgt && writer) {
    overlay = dlg(tx('CORE-13.dlg.2'), `<div class="field"><label for="abExp">${tx('CORE-13.label')}</label><input id="abExp" class="input" type="date" data-bind="abExp" data-live value="${esc(view.abExp ?? tgt.expectedOn ?? '')}" placeholder="${tx('CORE-13.placeholder')}">${unk(M.fv('abUnknown', view.abExp ?? tgt.expectedOn ? '' : '1'))}</div>`, cancelBtn(), modalBtn('btn-primary btn-md', tx('CORE-13.modalBtn.2'), 'data-act="core.absence.expected"'));
  } else if (view.dialog === 'cancel' && tgt && writer) {
    overlay = dlg(tx('CORE-13.dlg'), `<p>${tx('CORE-13.p')}</p>
      <fieldset style="border: 0; padding: 0; margin: 0;"><legend class="label" style="font-weight: 600; margin-bottom: 4px;">${tx('CORE-13.legend')}</legend>${Object.entries(M.CANCEL_WHY).map(([k, v]) => `<label class="choice"><input type="radio" name="why" value="${k}" data-bind="why"${view.why === k ? ' checked' : ''}>${v}</label>`).join('')}</fieldset>`, cancelBtn(tx('CORE-13.cancelBtn')), modalBtn('btn-primary btn-md', tx('CORE-13.modalBtn'), 'data-act="core.absence.cancel"'));
  }
  return { main: `${head(tx('CORE-13.title'), writer ? `<button class="btn btn-primary btn-sm" type="button" data-set="dialog=start">${ic('plus')}${tx('CORE-13.btn')}</button>` : '')}
  <div class="with-panel"><div class="stack lg"><section class="stack" aria-labelledby="al"><h2 id="al" class="t-heading2">${tx('CORE-13.ariaLabel')}</h2>
    <p>${tx('CORE-13.p.5')}</p>
    ${list.length ? `<div class="tbl reflow"><table aria-label="${tx('CORE-13.ariaLabel')}"><thead><tr><th>${tx('CORE-13.th')}</th><th>${tx('CORE-13.th.2')}</th><th>${tx('CORE-13.th.3')}</th><th>${tx('CORE-13.th.4')}</th><th></th></tr></thead><tbody>${rows}</tbody></table></div>` : empty(tx('CORE-13.empty'))}</section></div>${panel}</div>${demoNote}`, overlay };
}

// ---- 요금 규칙 (CORE-03). 본사 관리자만. 마크업은 보드 그대로, 값은 상태(규칙 버전)에서 채운다 ----
const RULE_TITLE = { recurring: () => tx('CORE-03.r1'), meal: () => tx('CORE-03.r2'), skip: () => tx('CORE-03.r3'), schedule: () => tx('CORE-03.r4'), absence: () => tx('CORE-03.r5') };
const issueText = (d) => (d === 'LAST' ? tx('CORE-03.issueLast') : tx('CORE-03.issueDay', { n: d }));
const onOff = (b) => (b ? tx('CORE-03.on') : tx('CORE-03.off'));
const dash = (x) => x ?? '-';
// 버전 기록 한 줄: 앞 버전과 달라진 값마다 "이름 전 → 후"
const RULE_DIFF = {
  recurring: { SINGLE: (a, b) => tx('CORE-03.hist.single', { a: fmt.won(a), b: fmt.won(b) }), COUPLE: (a, b) => tx('CORE-03.hist.couple', { a: fmt.won(a), b: fmt.won(b) }) },
  meal: { unitPrice: (a, b) => tx('CORE-03.hist.meal', { a: fmt.won(a), b: fmt.won(b) }), perDay: (a, b) => tx('CORE-03.hist.perDay', { a, b }) },
  skip: { unitPrice: (a, b) => tx('CORE-03.hist.skip', { a: fmt.won(a), b: fmt.won(b) }), advanceOnly: (a, b) => tx('CORE-03.hist.cond', { a: a ? tx('CORE-03.c1') : tx('CORE-03.c2'), b: b ? tx('CORE-03.c1') : tx('CORE-03.c2') }) },
  schedule: { issueDay: (a, b) => tx('CORE-03.hist.issue', { a: issueText(a), b: issueText(b) }), dueDays: (a, b) => tx('CORE-03.hist.due', { a: tx('CORE-03.dueAfter', { n: a }), b: tx('CORE-03.dueAfter', { n: b }) }) },
  absence: { enabled: (a, b) => tx('CORE-03.hist.abs', { a: onOff(a), b: onOff(b) }), minDays: (a, b) => tx('CORE-03.hist.min', { a: dash(a), b: dash(b) }) },
};
function rateHistory() {
  const pr = db.core.pricing[site], rows = [];
  for (const k of M.RULE_KINDS) pr[k].forEach((v, i) => {
    if (!i) return;
    const diff = Object.entries(RULE_DIFF[k]).filter(([x]) => v[x] !== pr[k][i - 1][x]).map(([x, f]) => f(pr[k][i - 1][x], v[x])).join(', ');
    rows.push({ at: v.at, html: `<div class="record"><span class="when">${RULE_TITLE[k]()} v${v.v}</span><span class="what">${tx('CORE-03.hist.line', { from: v.from, diff })}<br><span class="muted">${esc(v.by)}</span></span></div>` });
  });
  return rows.sort((a, b) => (a.at < b.at ? 1 : a.at > b.at ? -1 : 0)).map((r) => r.html).join('');
}
function core03() {
  const title = tx('CORE-03.title');
  if (!M.can('configure')) return head(title) + denied(tx('core.need.refuse'), tx('common.NAV.text.26'), href('CORE-01'));
  const f = M.rateForm(site), req = tx('CORE-03.req'), opt = tx('CORE-03.opt'), ph = tx('CORE-03.placeholder');
  const text = (id, name, label, extra = '') => `<div class="field"><label for="${id}">${label}</label><input id="${id}" class="input" type="text" name="${name}" data-bind="${name}" value="${esc(f[name])}"${extra}></div>`;
  const from = (id, name, label) => text(id, name, label, ` placeholder="${ph}"`);
  const radio = (name, val, label) => `<label class="choice"><input type="radio" name="${name}" data-bind="${name}" value="${val}"${f[name] === val ? ' checked' : ''}>${label}</label>`;
  const legend = (t) => `<legend class="label" style="font-weight: 600; margin-bottom: 4px;">${t}</legend>`;
  const fs = 'style="border: 0; padding: 0; margin: 0;"';
  const opts = [['', tx('CORE-03.pick')], ['DAY', tx('CORE-03.issueSome')], ['LAST', tx('CORE-03.issueLast')]].map(([v, t]) => `<option value="${v}"${f.rIssue === v ? ' selected' : ''}>${t}</option>`).join('');
  const saved = (view.rateSaved || []).map((x) => {
    const w = M.ruleAt(site, x.kind, '9999-12-31'), line = { absence: () => tx('CORE-03.absScope'), schedule: () => tx('CORE-03.savedSched', { from: x.from, issue: issueText(w.issueDay), due: w.dueDays }) }[x.kind]?.() ?? tx('CORE-03.savedPrice', { from: x.from });
    return `<p><b>${RULE_TITLE[x.kind]()}</b> ${line}</p>`;
  }).join('');
  const note = view.rateNone ? `<div class="alert alert-ok" role="status">${ic('circle-check')}<p>${tx('CORE-03.noChange')}</p></div>` : saved ? `<div class="alert alert-ok" role="status">${ic('circle-check')}<div class="stack">${saved}</div></div>` : '';
  const err = view.err ? `<div class="alert alert-err" role="alert">${ic('triangle-alert')}<p>${esc(view.err)}</p></div>` : '';
  const hist = rateHistory();
  return `${head(title, `<span class="badge">${SITES[site].name}</span>`)}
  <p>${tx('CORE-03.p')}</p>
  <div class="stack lg" style="max-width: 720px;">
    <section class="card" aria-labelledby="r1"><h2 id="r1" class="t-heading2">${RULE_TITLE.recurring()}</h2>
      ${text('a1', 'rSingle', tx('CORE-03.a1') + req)}${text('a2', 'rCouple', tx('CORE-03.a2') + req)}${from('a3', 'rRecFrom', tx('CORE-03.from') + req)}</section>
    <section class="card" aria-labelledby="r2"><h2 id="r2" class="t-heading2">${RULE_TITLE.meal()}</h2>
      ${text('b1', 'rMeal', tx('CORE-03.b1') + req)}${text('b2', 'rPerDay', tx('CORE-03.b2') + req)}${from('b3', 'rMealFrom', tx('CORE-03.from') + req)}</section>
    <section class="card" aria-labelledby="r3"><h2 id="r3" class="t-heading2">${RULE_TITLE.skip()}</h2>
      ${text('c1', 'rSkip', tx('CORE-03.c1l') + req)}<fieldset ${fs}>${legend(tx('CORE-03.cond') + req)}${radio('rCond', 'ADVANCE', tx('CORE-03.c1'))}${radio('rCond', 'ALL', tx('CORE-03.c2'))}</fieldset>${from('c3', 'rSkipFrom', tx('CORE-03.from') + req)}</section>
    <section class="card" aria-labelledby="r4"><h2 id="r4" class="t-heading2">${RULE_TITLE.schedule()}</h2>
      <div class="field"><label for="d1">${tx('CORE-03.d1') + req}</label><select id="d1" class="input" name="rIssue" data-bind="rIssue" data-live>${opts}</select></div>
      ${f.rIssue === 'DAY' ? text('d1n', 'rIssueDay', tx('CORE-03.d1n') + req) : ''}${text('d2', 'rDue', tx('CORE-03.d2') + req)}${from('d3', 'rSchedFrom', tx('CORE-03.from') + req)}
      <p class="hint">${tx('CORE-03.hint.sched')}</p></section>
    <section class="card" aria-labelledby="r5"><h2 id="r5" class="t-heading2">${RULE_TITLE.absence()}</h2>
      <fieldset ${fs}>${legend(tx('CORE-03.abs') + req)}${radio('rAbs', 'ON', tx('CORE-03.on'))}${radio('rAbs', 'OFF', tx('CORE-03.off'))}</fieldset>
      ${text('e1', 'rAbsMin', tx('CORE-03.e1') + opt)}${from('e2', 'rAbsFrom', tx('CORE-03.from') + opt)}
      <p class="hint">${tx('CORE-03.hint.abs')}</p></section>
  </div>
  <p class="hint">${tx('CORE-03.hint.rental')}</p>
  <div class="stack" style="max-width: 720px;">${note}${err}</div>
  <div class="row end" style="max-width: 720px;"><button class="btn btn-primary btn-sm" type="button" data-act="core.rate.save">${tx('CORE-03.save')}</button></div>
  ${hist ? `<section class="card" aria-labelledby="vh" style="max-width: 720px;"><h2 id="vh" class="t-heading2">${tx('CORE-03.vh')}</h2><div>${hist}</div></section>` : ''}
  ${demoNote}`;
}

export const screens = {
  'CORE-02': { app: 'ops', title: tx('CORE-02.title'), render: core02 },
  'CORE-03': { app: 'ops', title: tx('CORE-03.title'), render: core03 },
  'CORE-04': { app: 'ops', title: tx('CORE-04.title'), render: core04 },
  'CORE-05': { app: 'ops', title: tx('CORE-05.title'), render: core04 },
  'CORE-06': { app: 'ops', title: tx('CORE-06.title'), render: core06 },
  'CORE-07': { app: 'ops', title: tx('CORE-07.title'), render: core07 },
  'CORE-08': { app: 'home', title: tx('CORE-08.title'), render: core08 },
  'CORE-16': { app: 'home', title: tx('CORE-16.title'), render: core16 },
  'CORE-09': { app: 'ops', title: tx('CORE-09.title'), render: core09 },
  'CORE-13': { app: 'ops', title: tx('CORE-13.title'), render: core13 },
  'CORE-14': { app: 'ops', title: tx('CORE-14.title'), render: core14 },
};
