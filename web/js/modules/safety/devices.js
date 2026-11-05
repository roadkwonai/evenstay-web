// SAF-08 기기 상태(탭 기기 목록), SAF-10 기기 연결·장치 동의(탭 기기 연결). 마크업은 캔버스 보드(ref/SAF-08*.html)를 옮겼다.
import { tx } from '../../lib/text.js';
import { api, esc, fmt, ic, me, nowISO, refuse, view } from '../../lib/kit.js';
import * as L from './logic.js';
import { ROLES, SOURCE_LABEL, hm, pn, rl } from './logic.js';
import { asof, crumb, deniedMsg, demo, flash, navBottom } from './screens.js';

const can = (list) => list.includes(me().key);
const KIND_LABEL = { BED_SENSOR: SOURCE_LABEL.BED_SENSOR, CALL_BELL: SOURCE_LABEL.CALL_BELL, ACCESS_LOG: tx('SAF-08.kind.reader') };
const BY = { SELF: tx('SAF-10.by.self'), REPRESENTATIVE: tx('SAF-10.by.rep'), GUARDIAN: tx('SAF-10.by.guardian') };
const n = (v) => tx('SAF-08.n', { n: v });
const stamp = (iso) => `${fmt.md(iso)} ${hm(iso)}`;

const tabs = (cur) => `<nav class="tabs" aria-label="${tx('SAF-08.tabs.aria')}"><a href="#" data-set="tab=LIST&flash="${cur === 'LIST' ? ' aria-current="page"' : ''}>${tx('SAF-08.tab.list')}</a><a href="#" data-set="tab=LINK&flash="${cur === 'LINK' ? ' aria-current="page"' : ''}>${tx('SAF-08.tab.link')}</a></nav>`;

// ---------- 기기 목록 ----------
function listTab() {
  const st = L.deviceStats(), sel = st.byKind.find((k) => k.kind === view.kind) || st.byKind.find((k) => k.cut.length) || st.byKind[0];
  const alerts = st.byKind.flatMap((k) => k.cut.map((d) => `<div class="alert" role="alert">${ic('triangle-alert')}<p><b>${tx('SAF-08.cut.bold', { room: esc(d.room), kind: KIND_LABEL[d.kind], hours: L.cutHours(d) })}</b> ${d.kind === 'BED_SENSOR' ? `${tx('SAF-08.cut.bed')} ` : ''}${tx('SAF-08.cut.tail')}</p></div>`)).join('');
  const rows = st.byKind.map((k) => `<tr${k === sel ? ' class="sel"' : ''}><td data-label="${tx('SAF-08.th.kind')}"><a class="lnk" href="#" data-set="kind=${k.kind}"${k === sel ? ' aria-current="true"' : ''}>${KIND_LABEL[k.kind]}</a></td><td class="r" data-label="${tx('SAF-08.th.ok')}">${n(k.ok)}</td><td class="r" data-label="${tx('SAF-08.th.cut')}">${k.cut.length ? `<span class="badge grade-check">${ic('triangle-alert')}${n(k.cut.length)}</span>` : n(0)}</td><td class="r" data-label="${tx('SAF-08.th.end')}">${n(k.ended.length)}</td></tr>`).join('');
  const items = [...sel.cut.map((d) => `<li class="cell"><span class="body"><span class="title">${esc(d.residentId ? rl(d.residentId) : d.room)}</span><span class="sub">${tx('SAF-08.cut.sub', { hours: L.cutHours(d) })}</span></span><span class="badge grade-check">${tx('SAF-08.badge.cut')}</span></li>`),
    ...sel.ended.map((d) => `<li class="cell"><span class="body"><span class="title">${esc(d.room)}</span><span class="sub">${tx('SAF-08.end.sub', { md: fmt.md(d.retiredOn), n: st.total })}</span></span><span class="badge grade-log">${tx('SAF-08.badge.end')}</span></li>`)];
  const check = sel.cut.length && can(ROLES.handle) ? `<div class="row"><button class="btn btn-primary btn-sm" type="button" data-act="saf.dev.check" data-kind="${sel.kind}">${tx('SAF-08.btn.check')}</button></div>` : '';
  return `<p class="t-headline">${tx('SAF-08.head', { total: st.total, ok: st.ok })}</p>${alerts}
      <div class="qwrap"><div class="queue">
        <div class="tbl reflow"><table><thead><tr><th>${tx('SAF-08.th.kind')}</th><th class="r">${tx('SAF-08.th.ok')}</th><th class="r">${tx('SAF-08.th.cut')}</th><th class="r">${tx('SAF-08.th.end')}</th></tr></thead><tbody>${rows}</tbody></table></div>
        <aside class="panel-s info" aria-label="${tx('SAF-08.panel.aria')}"><h2 class="t-heading2">${KIND_LABEL[sel.kind]}</h2>${items.length ? `<ul class="list">${items.join('')}</ul>` : `<p>${tx('SAF-08.panel.empty')}</p>`}${check}</aside>
      </div></div>`;
}

// ---------- 기기 연결 ----------
const staffSelect = (id, name) => {
  const mine = L.staffOptions().find((p) => p.id === me().id)?.id;
  return `<select id="${id}" class="input" name="${name}" data-bind="${name}">${L.staffOptions().map((p) => `<option value="${p.id}"${p.id === mine ? ' selected' : ''}>${esc(p.name)}</option>`).join('')}</select>`;
};
const whenInput = (id, name) => `<input id="${id}" class="input" type="text" name="${name}" data-bind="${name}" placeholder="${tx('SAF-10.when.ph')}">`;
const radios = (name, opts) => opts.map(([v, t], i) => `<label class="choice"><input type="radio" name="${name}" value="${v}" data-bind="${name}"${i === 0 ? ' checked' : ''}> ${t}</label>`).join('');

function linkRows() {
  const s = L.S(), out = [];
  const person = (rid, ended) => ({ room: esc(L.person(rid).room), who: ended ? tx('SAF-10.name.ended', { name: esc(L.person(rid).name) }) : tx('SAF-10.name', { name: esc(L.person(rid).name) }) });
  const consent = (c) => tx('SAF-10.consent', { md: stamp(c.at), pn: pn(c.staff), by: BY[c.by] });
  s.links.forEach((l) => {
    const ended = !!l.to && l.to < L.dateOf(nowISO()), p = person(l.residentId, ended);
    out.push({ ended, kind: KIND_LABEL[l.source], ...p, consent: ended ? tx('SAF-10.ended') : l.consent ? consent(l.consent) : tx('SAF-10.noconsent'), period: ended ? tx('SAF-10.endedby', { md: fmt.md(l.to) }) : tx('SAF-10.since', { md: fmt.md(l.from) }) });
  });
  Object.entries(s.visitPlan.consents || {}).forEach(([rid, c]) => out.push({ ended: false, kind: tx('SAF-10.kind.visit'), ...person(rid), consent: consent(c), period: '-' }));
  Object.entries(s.assist || {}).forEach(([rid, a]) => out.push({ ended: false, kind: tx('SAF-10.kind.assist'), ...person(rid),
    consent: a.source === 'SELF' ? tx('SAF-10.assist.self', { md: stamp(a.heardAt) }) : tx('SAF-10.assist.staff', { md: stamp(a.heardAt), pn: pn(a.heardBy), from: BY[a.heardFrom] }), period: '-' }));
  return out.sort((x, y) => Number(x.ended) - Number(y.ended));
}
function linkTab() {
  const resOpts = L.residentList().map((r) => `<option value="${r.id}">${esc(r.room)} ${esc(r.name)}</option>`).join('');
  const need = L.linkNeeded();
  const todo = need.length ? `<ul class="list">${need.map((r) => { const d = api.core.keyDates?.(r.id)?.moveInDate; return `<li class="cell"><span class="body"><span class="title">${d ? tx('SAF-10.todo.row', { room: esc(r.room), name: esc(r.name), md: fmt.md(d) }) : tx('SAF-10.todo.row2', { room: esc(r.room), name: esc(r.name) })}</span></span><button class="btn btn-ghost btn-sm" type="button" data-set="lres=${r.id}">${tx('SAF-10.todo.btn')}</button></li>`; }).join('')}</ul>` : `<p class="muted">${tx('SAF-10.todo.none')}</p>`;
  const rows = linkRows();
  const table = `<div class="tbl reflow wrapc"><table><thead><tr><th>${tx('SAF-10.th.kind')}</th><th>${tx('SAF-10.th.room')}</th><th>${tx('SAF-10.th.who')}</th><th>${tx('SAF-10.th.consent')}</th><th>${tx('SAF-10.th.period')}</th></tr></thead><tbody>${rows.map((r) => `<tr><td data-label="${tx('SAF-10.th.kind')}">${r.kind}</td><td data-label="${tx('SAF-10.th.room')}">${r.room}</td><td data-label="${tx('SAF-10.th.who')}">${r.who}</td><td data-label="${tx('SAF-10.th.consent')}">${r.consent}</td><td data-label="${tx('SAF-10.th.period')}">${r.period}</td></tr>`).join('')}</tbody></table></div>`;
  const grid = (k, wname, sname, dname, opts) => `<div class="grid3">
            <div class="field"><label for="${k}-d">${tx('SAF-10.f.when')}</label>${whenInput(`${k}-d`, dname)}</div>
            <div class="field"><label for="${k}-s">${tx('SAF-10.f.staff')}</label>${staffSelect(`${k}-s`, sname)}</div>
            <fieldset class="fieldset-r"><legend>${tx('SAF-10.f.by')}</legend>${radios(wname, opts)}</fieldset>
          </div>`;
  const byOpts = [['SELF', BY.SELF], ['REPRESENTATIVE', BY.REPRESENTATIVE]];
  const assist = can(ROLES.evac) ? `<hr class="divider">
        <section class="stack" aria-labelledby="k3">
          <h2 id="k3" class="t-heading2">${tx('SAF-10.h2.assist')}</h2>
          <p class="hint">${tx('SAF-10.hint.assist')}</p>
          <div class="grid3">
            <fieldset class="fieldset-r"><legend>${tx('SAF-10.f.from')}</legend>${radios('k3w', [['SELF', BY.SELF], ['GUARDIAN', BY.GUARDIAN], ['REPRESENTATIVE', BY.REPRESENTATIVE]])}</fieldset>
            <div class="field"><label for="k3-s">${tx('SAF-10.f.heard')}</label>${staffSelect('k3-s', 'k3s')}</div>
            <div class="field"><label for="k3-d">${tx('SAF-10.f.heardwhen')}</label>${whenInput('k3-d', 'k3d')}</div>
          </div>
        </section>` : '';
  return `<p>${tx('SAF-10.intro')}</p>${flash()}
      <form class="card" aria-label="${tx('SAF-10.form.aria')}">
        <section class="stack" aria-labelledby="k1">
          <h2 id="k1" class="t-heading2">${tx('SAF-10.h2.link')}</h2>
          <div class="grid2">
            <div class="field"><label for="k-dev">${tx('SAF-10.f.dev')}</label><select id="k-dev" class="input" name="ldev" data-bind="ldev"><option value="BED_SENSOR">${KIND_LABEL.BED_SENSOR}</option><option value="CALL_BELL">${KIND_LABEL.CALL_BELL}</option><option value="ACCESS_LOG">${KIND_LABEL.ACCESS_LOG}</option></select></div>
            <div class="field"><label for="k-res">${tx('SAF-10.f.res')}</label><select id="k-res" class="input" name="lres" data-bind="lres">${resOpts}</select></div>
          </div>
          <p class="t-label">${tx('SAF-10.f.consent')}</p>
          ${grid('k1', 'k1w', 'k1s', 'k1d', byOpts)}
          <p class="hint">${tx('SAF-10.hint.link')}</p>
        </section>
        <hr class="divider">
        <section class="stack" aria-labelledby="k2">
          <h2 id="k2" class="t-heading2">${tx('SAF-10.h2.visit')}</h2>
          <p class="hint">${tx('SAF-10.hint.visit')}</p>
          ${grid('k2', 'k2w', 'k2s', 'k2d', byOpts)}
        </section>${assist}
        <div class="row"><button class="btn btn-primary btn-sm" type="button" data-act="saf.link.save">${tx('SAF-10.btn.save')}</button></div>
      </form>
      <section class="card" aria-labelledby="k4">
        <h2 id="k4" class="t-heading2">${tx('SAF-10.h2.list')}</h2>
        ${todo}${table}
      </section>`;
}

function saf08(params) {
  if (!can(ROLES.view)) return deniedMsg();
  const cur = (view.tab || params.tab) === 'LINK' ? 'LINK' : 'LIST';
  const head = cur === 'LIST' ? `<div class="row" style="gap: 8px;">${asof()}</div>` : '';
  return { main: `<div class="page-head"><div>${crumb('SAF-01', tx('SAF-08.crumb'))}<h1 class="t-title2">${tx('SAF-08.title')}</h1></div>${head}</div>${tabs(cur)}${cur === 'LIST' ? `${flash()}${listTab()}` : linkTab()}${demo}`, overlay: navBottom('SAF-08') };
}

const clear = (...names) => names.forEach((k) => { delete view[k]; });
export const actions = {
  'saf.dev.check': (args) => {
    delete view.flash;
    if (!can(ROLES.handle)) refuse(tx('SAF-08.refuse.check'));
    L.requestCheck(args.kind, me().id);
    view.flash = tx('SAF-08.flash.check');
  },
  'saf.link.save': (_a, f) => {
    delete view.flash;
    const { name, only } = L.saveLink({ source: f.ldev, rid: f.lres, when: f.k1d, staff: f.k1s, by: f.k1w, vWhen: f.k2d, vStaff: f.k2s, vBy: f.k2w, aFrom: f.k3w, aStaff: f.k3s, aWhen: f.k3d }, me());
    view.flash = only ? tx('SAF-10.flash.consent', { name }) : tx('SAF-10.flash.saved', { name });
    clear('ldev', 'lres', 'k1d', 'k1s', 'k1w', 'k2d', 'k2s', 'k2w', 'k3w', 'k3s', 'k3d');
  },
};
export const screens = { 'SAF-08': { app: 'ops', title: tx('SAF-08.title'), render: saf08 } };
