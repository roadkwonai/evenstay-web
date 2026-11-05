// 패밀리 앱(보호자) 화면: REQ-10(목록·상세), REQ-11(회원님 대신 올리기). 보호자 허락은 api.family.canSee로 본다.
import { tx } from '../../lib/text.js';
import { api, denied, esc, href, ic, me, refuse, view } from '../../lib/kit.js';
import { DECLINE_MEMBER, HOLD_MEMBER, TYPE_MEMBER, allReqs, bodyMember, createReq, nameOf, resOf } from './model.js';
import { timeline } from './home.js';

const can = (k) => api.family.canSee?.(me().id, k) ?? true;
const who = () => resOf(me().residentId).name;
const NO_VIEW = () => `${tx('requests.shared.text.12', { who: who() })}`;
const SHOWN = ['REPAIR', 'CLEANING', 'LAUNDRY', 'TRANSPORT'];

function stateGuardian(r, c) {
  const n = who();
  switch (c.status) {
    case 'RECEIVED': return c.assignee ? `${tx('REQ-10.p.5', { nameOf: nameOf(c.assignee) })}` : tx('REQ-10.text.8');
    case 'IN_PROGRESS': return tx('REQ-10.text.7');
    case 'ON_HOLD': return HOLD_MEMBER[c.holdReason];
    case 'DONE': return `${tx('REQ-10.text.6', { n })}`;
    case 'CONFIRMED': return `${tx('REQ-10.text.5', { n })}`;
    case 'AUTO_CLOSED': return tx('REQ-10.text.4');
    case 'CANCELLED': return tx('REQ-10.text.3');
    case 'DECLINED': return DECLINE_MEMBER[c.declineReason].replaceAll(tx('REQ-10.replaceAll'), `${tx('REQ-10.text.2', { n })}`);
    default: return `${tx('REQ-10.text', { n })}`;
  }
}
const kindsFor = () => (can('HEALTH') ? [...SHOWN, 'HOSPITAL_ESCORT'] : SHOWN);

function screen10(params) {
  if (!can('REQUEST')) return { noRail: true, main: denied(NO_VIEW(), tx('REQ-10.btn.2'), href('FAM-06a')) };
  const id = me().residentId, n = who();
  if (!view.logged) { view.logged = 1; api.family.recordRequestView?.({ residentId: id, personaId: me().id }); }
  const list = allReqs().filter((x) => x.r.residentId === id && kindsFor().includes(x.c.type) && x.c.status !== 'MOVED_TO_SAFETY').sort((a, b) => b.r.createdAt.localeCompare(a.r.createdAt));
  const sel = list.find((x) => x.r.id === (view.sel ?? params.id)) ?? list[0];
  const backBtn = `<a class="btn btn-ghost btn-md" href="${href('FAM-06a')}" style="align-self: flex-start;">${ic('chevron-left')}${tx('REQ-10.btn.2')}</a>`;
  const scope = `<div class="scope">${ic('eye')}<div class="stack" style="gap: 4px;"><p class="t-body-md">${tx('REQ-10.p.7', { n })}</p><p class="t-body-sm muted">${tx('REQ-10.p.8')}</p></div></div>`;
  const add = `<a class="btn btn-secondary btn-block" href="${href('REQ-11')}">${ic('plus')}${tx('REQ-10.btn', { n })}</a>`;
  if (!sel) return { noRail: true, main: `${backBtn}${scope}<h1 class="sr-only">${tx('REQ-10.title')}</h1>${add}<div class="empty"><span class="state-icon">${ic('inbox')}</span><p class="t-body-md">${tx('REQ-10.p.6', { n })}</p></div>` };
  const item = (x) => `<li class="cell"${x.r.id === sel.r.id ? ' aria-current="true"' : ''}><a class="body" href="#" data-set="sel=${x.r.id}"><span class="title">${TYPE_MEMBER[x.c.type]}: ${esc(bodyMember(x.r, x.c))}</span><span class="sub">${esc(stateGuardian(x.r, x.c).replace(/\.$/, ''))}</span></a>${ic('chevron-right')}</li>`;
  const { r, c } = sel;
  const staff = c.assignee ? `<div class="stack"><p class="t-label-lg muted">${tx('REQ-10.p.4')}</p><p class="t-body-md">${tx('REQ-10.p.5', { nameOf: nameOf(c.assignee) })}</p></div>` : '';
  const rows = timeline(r, 'GUARDIAN').replace(/<div class="record"><span class="when">(.*?)<\/span><span class="what">(.*?)<\/span><\/div>/g, '<li><span class="t">$1</span><span>$2</span></li>');
  return {
    noRail: true,
    main: `${backBtn}${scope}<h1 class="sr-only">${tx('REQ-10.title')}</h1>
      <div class="list-detail"><div class="ld-list">${add}<section class="card" aria-label="${tx('REQ-10.ariaLabel')}"><ul class="list">${list.map(item).join('')}</ul></section></div>
        <div class="ld-detail"><section class="card" aria-labelledby="rh1"><h2 id="rh1" class="t-headline">${TYPE_MEMBER[c.type]}: ${esc(bodyMember(r, c))}</h2>
          <div class="stack"><p class="t-label-lg muted">${tx('REQ-10.p')}</p><p class="t-heading2">${esc(stateGuardian(r, c))}</p></div>${staff}
          <div class="stack"><p class="t-label-lg muted">${tx('REQ-10.p.2')}</p><ul class="timeline">${rows}</ul></div>
          <p class="t-body-md muted">${tx('REQ-10.p.3')}<span class="nowrap">(<a href="tel:0200000000">02-000-0000</a>${tx('REQ-10.a')}</span>${tx('REQ-10.span')}</p></section></div></div>`,
  };
}

const Q = { REPAIR: tx('REQ-11.REPAIR'), CLEANING: tx('REQ-11.CLEANING'), LAUNDRY: tx('REQ-11.LAUNDRY'), TRANSPORT: tx('REQ-11.TRANSPORT') };
function screen11() {
  if (!can('REQUEST')) return { noRail: true, main: denied(NO_VIEW(), tx('REQ-11.denied'), href('FAM-06a')) };
  const n = who();
  const ok = !!view.gkind && !!view.gtext?.trim();
  if (view.sent) {
    return { main: `<a class="btn btn-ghost btn-md" href="${href('REQ-10')}" style="align-self: flex-start;">${ic('chevron-left')}${tx('REQ-11.btn')}</a>
      <div class="alert alert-ok" role="status">${ic('check')}<div class="stack" style="gap: 4px;"><h1 class="t-heading2">${view.sent === 'PENDING' ? `${tx('REQ-11.text.2', { n })}` : tx('REQ-11.main.4')}</h1><p class="t-body-md">${view.sent === 'PENDING' ? tx('REQ-11.main.3') : `${tx('REQ-11.text', { n })}`}</p></div></div>` };
  }
  const kinds = SHOWN.map((t) => `<label><input type="radio" name="gkind" value="${t}" data-bind="gkind" data-live>${TYPE_MEMBER[t]}</label>`).join('');
  return {
    main: `<a class="btn btn-ghost btn-md" href="${href('REQ-10')}" style="align-self: flex-start;">${ic('chevron-left')}${tx('REQ-11.btn')}</a>
      <div class="scope">${ic('eye')}<p class="t-body-md">${tx('REQ-11.p.3', { n })}</p></div>
      <h1 class="t-title3">${tx('REQ-11.h1', { n })}</h1>
      <p class="t-body-md">${tx('REQ-11.p.4', { n, relation: me().relation, nameOf: nameOf(me().id) })}</p>
      <form class="stack lg" data-act="req.guardianSend">
        <fieldset class="radios"><legend class="t-label-lg strong">${tx('REQ-11.legend')}</legend>${kinds}</fieldset>
        <p class="hint" style="margin-top: -12px;">${tx('REQ-11.p.5', { n })}</p>
        <div class="field"><label for="req-text">${view.gkind ? Q[view.gkind] : tx('REQ-11.main.2')}</label><textarea id="req-text" class="input" rows="3" name="gtext" data-bind="gtext" data-live${view.gkind ? '' : tx('REQ-11.main')}></textarea></div>
        ${view.gkind === 'LAUNDRY' ? `<div class="alert">${ic('info')}<p class="t-body-md">${tx('REQ-11.p.2', { n })}</p></div>` : ''}
        <div class="action-bar stack"><button class="btn btn-primary btn-block" type="submit"${ok ? '' : ' disabled'}>${tx('REQ-11.btn.2')}</button>${ok ? '' : `<p class="hint">${tx('REQ-11.p')}</p>`}</div>
      </form>`,
  };
}

export const familyActions = {
  'req.guardianSend': () => {
    const p = me();
    if (p.key !== 'GUARDIAN') refuse(tx('requests.action.refuse.6'));
    if (!can('REQUEST')) refuse(`${tx('requests.action.text.6', { who: who() })}`);
    const type = view.gkind, body = view.gtext?.trim();
    if (!SHOWN.includes(type) || !body) return;
    if (view.sent) return;
    const fee = type === 'LAUNDRY' ? 'LAUNDRY_BEDDING' : null;
    createReq({ residentId: p.residentId, type, body, source: 'GUARDIAN_PORTAL', pending: !!fee, feeCode: fee, details: type === 'TRANSPORT' ? { dest: body } : {} });
    view.sent = fee ? 'PENDING' : 'SENT';
  },
};
export const familyScreens = {
  'REQ-10': { app: 'family', title: tx('REQ-10.title'), render: screen10 },
  'REQ-11': { app: 'family', title: tx('REQ-11.title'), render: screen11 },
};
