// SAF-16 사고·학대 보고(알림 처리 위에 열리는 오른쪽 시트), 저장한 보고는 고치지 않고 덧붙인다. 마크업은 캔버스 보드(ref/SAF-16*.html)를 옮겼다.
import { tx } from '../../lib/text.js';
import { denied, dialog, empty, esc, fmt, go, href, ic, me, refuse, sheetWrap, view } from '../../lib/kit.js';
import * as L from './logic.js';
import { SOURCE_LABEL, alertById, hm, pn, rl, signalOf } from './logic.js';
import { crumb, infoStep } from './screens.js';

const AGENCY = { ELDER_PROTECTION_AGENCY: tx('SAF-16.agency'), POLICE: tx('SAF-16.agency.2'), LOCAL_GOVERNMENT: tx('SAF-16.agency.3'), OTHER: tx('SAF-16.agency.4') };
const stamp = (iso) => `${+iso.slice(5, 7)}/${+iso.slice(8, 10)} ${hm(iso)}`;
const sheetHead = (a) => `<div class="rs-head"><h2 class="t-heading1">${tx('SAF-16.title')}</h2><a class="btn btn-ghost btn-sm" href="${href('SAF-02', { id: a.id })}" data-set="" aria-label="${tx('SAF-16.close')}">${ic('x')}</a></div>
      <p>${tx('SAF-16.intro')}</p>
      <p class="scope">${ic('eye')}${tx('SAF-16.scope')}</p>
      <p class="muted">${tx('SAF-16.alert', { md: fmt.md(signalOf(a).occurredAt), hm: hm(signalOf(a).occurredAt), rl: esc(rl(a.residentId)), v: SOURCE_LABEL[signalOf(a).source] })}</p>`;

// ---------- 쓰기 ----------
function writeSheet(a) {
  const on = (k) => view[k] === 'Y', ranks = Math.max(L.contactsOf(a.residentId).length, 2), other = view.s16rp1 === 'OTHER';
  const radio = (name, v, t) => `<label class="choice"><input type="radio" name="${name}" value="${v}" data-bind="${name}" data-live> ${t}</label>`;
  const save = `data-act="saf.incident.review" data-id="${a.id}"`;
  return `<section class="rsheet-s" role="dialog" aria-modal="true" aria-label="${tx('SAF-16.title')}">
      ${sheetHead(a)}
      <input class="st-in n1" type="radio" name="s16st" id="s16-n1" value="n1" data-bind="s16st" checked aria-label="${tx('SAF-16.step.1')}"><input class="st-in n2" type="radio" name="s16st" id="s16-n2" value="n2" data-bind="s16st" aria-label="${tx('SAF-16.step.2')}"><input class="st-in n3" type="radio" name="s16st" id="s16-n3" value="n3" data-bind="s16st" aria-label="${tx('SAF-16.step.3')}">
      <div class="step s1">
        <p class="stepno t-label">${tx('SAF-16.stepno.1')}</p><div class="prog stepno" role="presentation"><span style="width: 33%"></span></div>
        <div class="field"><label for="s16-gw">${tx('SAF-16.f.account')}</label><textarea id="s16-gw" class="input" data-bind="s16gw"></textarea><p class="hint">${tx('SAF-16.hint.account')}</p></div>
      </div>
      <div class="step s2">
        <p class="stepno t-label">${tx('SAF-16.stepno.2')}</p><div class="prog stepno" role="presentation"><span style="width: 66%"></span></div>
        <fieldset class="fieldset-r"><legend>${tx('SAF-16.f.notify')}</legend>
          ${radio('s16nt', 'Y', tx('SAF-16.yes.notify'))}${radio('s16nt', 'N', tx('SAF-16.no.notify'))}
          <div class="subfields"><div class="field"><label for="s16-nt1">${tx('SAF-16.f.time')}</label><input id="s16-nt1" class="input" type="text" data-bind="s16nt1"${on('s16nt') ? '' : ' disabled'}></div>
          <div class="field"><label for="s16-nt2">${tx('SAF-16.f.rank')}</label><select id="s16-nt2" class="input" data-bind="s16nt2"${on('s16nt') ? '' : ' disabled'}>${Array.from({ length: ranks }, (_, i) => `<option value="${i + 1}">${tx('SAF-16.rank', { n: i + 1 })}</option>`).join('')}</select></div></div>
        </fieldset>
      </div>
      <div class="step s3">
        <p class="stepno t-label">${tx('SAF-16.stepno.3')}</p><div class="prog stepno" role="presentation"><span style="width: 100%"></span></div>
        <fieldset class="fieldset-r"><legend>${tx('SAF-16.f.report')}</legend>
          ${radio('s16rp', 'Y', tx('SAF-16.yes.report'))}${radio('s16rp', 'N', tx('SAF-16.no.report'))}
          <div class="subfields"><div class="field"><label for="s16-rp1">${tx('SAF-16.f.agency')}</label><select id="s16-rp1" class="input" data-bind="s16rp1" data-live${on('s16rp') ? '' : ' disabled'}>${Object.entries(AGENCY).map(([k, t]) => `<option value="${k}">${t}</option>`).join('')}</select></div>
          ${other ? `<div class="field"><label for="s16-rp1x">${tx('SAF-16.f.other')}</label><input id="s16-rp1x" class="input" type="text" data-bind="s16rp1x"></div>` : ''}
          <div class="field"><label for="s16-rp2">${tx('SAF-16.f.time')}</label><input id="s16-rp2" class="input" type="text" data-bind="s16rp2"${on('s16rp') ? '' : ' disabled'}></div></div>
        </fieldset>
        <p class="hint">${tx('SAF-16.hintduty')}</p>
      </div>
      <div class="row rs-foot"><button class="btn btn-primary btn-sm" type="button" ${save}>${tx('SAF-16.btn.save')}</button><a class="btn btn-secondary btn-sm" href="${href('SAF-02', { id: a.id })}" data-set="">${tx('SAF-16.btn.cancel')}</a></div>
      <div class="sticky-act m-only"><label class="btn btn-primary a1" for="s16-n2">${tx('SAF-16.btn.next')}</label><label class="btn btn-secondary a2" for="s16-n1">${tx('SAF-16.btn.prev')}</label><label class="btn btn-primary a2" for="s16-n3">${tx('SAF-16.btn.next')}</label><label class="btn btn-secondary a3" for="s16-n2">${tx('SAF-16.btn.prev')}</label><button class="btn btn-primary a3" type="button" ${save}>${tx('SAF-16.btn.save')}</button></div>
    </section>`;
}

// ---------- 보기와 덧붙이기 ----------
function viewSheet(a, r) {
  const yn = (v, yes, no) => (v === 'Y' ? yes : v === 'N' ? no : '-');
  const notify = r.notified === 'Y' ? [tx('SAF-16.yes.notify'), r.notifiedAt, tx('SAF-16.rank', { n: r.notifiedRank })].filter(Boolean).join(', ') : yn(r.notified, '', tx('SAF-16.no.notify'));
  const report = r.reported === 'Y' ? [tx('SAF-16.yes.report'), r.agency === 'OTHER' && r.agencyOther ? esc(r.agencyOther) : AGENCY[r.agency], r.reportedAt].filter(Boolean).join(', ') : yn(r.reported, '', tx('SAF-16.no.report'));
  const adds = r.adds.map((d) => `<li class="record"><span class="when">${stamp(d.at)}</span><span class="what">${tx('SAF-16.add.line', { pn: pn(d.by), text: esc(d.text) })}</span></li>`).join('');
  const canAdd = L.canWriteIncident(me(), a) || r.by === me().id;
  const add = !canAdd ? '' : view.append ? `<div class="field"><label for="s16-add">${tx('SAF-16.f.add')}</label><textarea id="s16-add" class="input" data-bind="s16add" data-live></textarea></div>
      <div class="row"><button class="btn btn-secondary btn-sm" type="button" data-act="saf.incident.append" data-id="${a.id}"${(view.s16add || '').trim() ? '' : ' disabled'}>${tx('SAF-16.btn.add')}</button><button class="btn btn-ghost btn-sm" type="button" data-set="append=">${tx('SAF-16.btn.cancel')}</button></div>`
    : `<div class="row"><button class="btn btn-secondary btn-sm" type="button" data-set="append=1">${tx('SAF-16.btn.add')}</button></div>`;
  return `<section class="rsheet-s" role="dialog" aria-modal="true" aria-label="${tx('SAF-16.title')}">
      ${sheetHead(a)}
      ${view.saved ? `<div class="alert alert-ok" role="status">${ic('circle-check')}<p>${esc(view.saved)}</p></div>` : ''}
      <p class="muted">${tx('SAF-16.by', { pn: pn(r.by), hm: hm(r.at) })}</p>
      <dl class="kv"><dt>${tx('SAF-16.f.account')}</dt><dd style="white-space: pre-line;">${esc(r.account)}</dd><dt>${tx('SAF-16.f.notify')}</dt><dd>${notify}</dd><dt>${tx('SAF-16.f.report')}</dt><dd>${report}</dd></dl>
      <p class="hint">${tx('SAF-16.hintduty')}</p>
      ${adds ? `<ul class="list">${adds}</ul>` : ''}
      ${add}
    </section>`;
}

function saf16(params) {
  const a = alertById(params.id), p = me();
  const head = `<div class="page-head"><div>${crumb('SAF-01', tx('SAF-02.crumb'))}<h1 class="t-title2">${tx('SAF-02.title')}</h1></div></div>`;
  if (!a) return { main: `${head}${empty(tx('SAF-02.empty'))}` };
  const r = L.incidentOf(a.id), ok = r ? L.canViewIncident(p, r) : L.canWriteIncident(p, a);
  if (!ok) return { main: `${head}${denied(tx('SAF-16.denied'), tx('SAF-02.crumb'), href('SAF-01'))}` };
  const confirm = view.dialog === 'confirm16' && !r ? dialog(tx('SAF-16.confirm.title'), `<p>${tx('SAF-16.confirm.p')}</p>`,
    `<button class="btn btn-secondary" type="button" data-set="dialog=">${tx('SAF-16.btn.cancel')}</button><button class="btn btn-primary" type="button" data-act="saf.incident.save" data-id="${a.id}">${tx('SAF-16.btn.save')}</button>`) : '';
  return { main: `${head}${infoStep(a).step}`, overlay: `${sheetWrap(r ? viewSheet(a, r) : writeSheet(a))}${confirm}` };
}

const FIELDS = ['s16gw', 's16nt', 's16nt1', 's16nt2', 's16rp', 's16rp1', 's16rp1x', 's16rp2', 's16st', 's16add'];
const alertOf = (id) => { const a = alertById(id); if (!a) refuse(tx('safety.mineOf.refuse')); return a; };
export const actions = {
  'saf.incident.open': (args) => {
    const a = alertOf(args.id), r = L.incidentOf(a.id);
    if (r ? !L.canViewIncident(me(), r) : !L.canWriteIncident(me(), a)) refuse(tx('SAF-16.denied'));
    L.noteIncidentOpen(a, me());
    go('SAF-16', { id: a.id });
  },
  // 저장 전 확인 창을 연다. 경위와 시각을 먼저 본다.
  'saf.incident.review': (args) => {
    const a = alertOf(args.id);
    if (!L.canWriteIncident(me(), a)) refuse(tx('SAF-16.refuse.write'));
    if (!(view.s16gw || '').trim()) refuse(tx('SAF-16.refuse.empty'));
    if (view.s16nt === 'Y') L.hmOf(view.s16nt1);
    if (view.s16rp === 'Y') L.hmOf(view.s16rp2);
    view.dialog = 'confirm16';
  },
  'saf.incident.save': (args) => {
    const a = alertOf(args.id), v = view;
    const r = L.saveIncident(a, me(), { account: v.s16gw, notified: v.s16nt, notifiedAt: v.s16nt1, notifiedRank: v.s16nt2 || '1', reported: v.s16rp, agency: v.s16rp1, agencyOther: v.s16rp1x, reportedAt: v.s16rp2 });
    view.saved = tx('SAF-16.flash.saved', { pn: pn(me().id), hm: hm(r.at) });
    FIELDS.forEach((k) => { delete view[k]; });
    delete view.dialog;
  },
  'saf.incident.append': (args) => {
    L.appendIncident(alertOf(args.id), me(), view.s16add);
    delete view.s16add; delete view.append; delete view.saved;
  },
};
export const screens = { 'SAF-16': { app: 'ops', title: tx('SAF-16.title'), render: saf16 } };
