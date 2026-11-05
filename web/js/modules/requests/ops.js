// 운영 앱(직원) 화면: REQ-12(목록), REQ-13(상세 서랍), REQ-14(대신 등록), REQ-15(배정), REQ-16(확인 대신 기록)
import { tx } from '../../lib/text.js';
import { api, dialog, denied, empty, esc, fmt, href, ic, me, nowISO, refuse, sheetWrap, toast, view } from '../../lib/kit.js';
import { PERSONAS } from '../../lib/people.js';
import {
  ACTIVE, DECLINE_STAFF, ESCORT_DONE_STAFF, FEE_LABEL, HOLD_STAFF, MISSED_STAFF, OPEN, S, TEAM_LABEL, TYPE_FILTER, TYPE_STAFF, addDays, allReqs, assign, bodyStaff, canStaff, claim, classify,
  complete, confirm, createReq, cur, decline, getReq, hold, isFront, isHq, isMgr, isOverdue, kindOf, memberAnswer, moveToSafety, nameOf, notYet, occToday, priceOf, residentsList, resOf, slashMd,
  stamp, start, teamsOf, today,
} from './model.js';

const ENTRY_TYPES = ['REPAIR', 'CLEANING', 'LAUNDRY', 'TRANSPORT', 'HOSPITAL_ESCORT', 'FEEDBACK', 'OTHER'];
const FNOTE = tx('REQ-12.text.52');
const FNOTE_NO_SAFETY = tx('REQ-12.text.51');
const ESCORT_HIDDEN = tx('REQ-12.text.50');
const WHY = { SHIFT: tx('REQ-12.SHIFT'), OTHER_TEAM: tx('REQ-12.OTHERTEAM'), OTHER: tx('REQ-12.OTHER') };
const HEARD = { PHONE: tx('REQ-12.PHONE'), IN_PERSON: tx('REQ-12.INPERSON') };
const mine = (c, p) => isMgr(p) || c.assignee === p.id;
const myTeam = (c, p) => isMgr(p) || teamsOf(p.id).includes(c.team);
const canSeeDest = (p) => isMgr(p) || teamsOf(p.id).some((t) => t === 'LIFE_SUPPORT' || t === 'DRIVER');
const pendingShown = (r) => nowISO() >= `${addDays(r.createdAt.slice(0, 10), 1)}T09:00:00`;

// --- 문장 ---
function sourceStaff(r) {
  const t = stamp(r.createdAt);
  if (r.source === 'STAFF_ENTRY') return r.heardVia === 'IN_PERSON' ? `${tx('REQ-12.text.49', { nameOf: nameOf(r.trans[0].by), t })}` : `${tx('REQ-12.text.48', { nameOf: nameOf(r.trans[0].by), t })}`;
  if (r.source === 'GUARDIAN_PORTAL') return `${tx('REQ-12.text.47', { relation: PERSONAS[r.byId].relation, nameOf: nameOf(r.byId), t })}`;
  if (r.source === 'ASSISTANT_HANDOFF') return `${tx('REQ-12.text.46', { t })}`;
  return `${tx('REQ-12.text.45', { t })}`;
}
const holdText = (c) => (c.holdDate ? `${HOLD_STAFF[c.holdReason]}, ${slashMd(c.holdDate)}` : HOLD_STAFF[c.holdReason]);
const CANCEL_BY = { MEMBER: tx('REQ-12.MEMBER'), SYSTEM: tx('REQ-12.SYSTEM'), GUARDIAN: tx('REQ-12.GUARDIAN') };
function statusStaff(r, c) {
  const who = c.assignee ? ` ${tx('REQ-12.text.7', { nameOf: nameOf(c.assignee) })}` : '';
  switch (c.status) {
    case 'RECEIVED': return c.assignee ? `${tx('REQ-12.text.44', { who })}` : tx('REQ-12.text.43');
    case 'IN_PROGRESS': return `${tx('REQ-12.text.42', { who })}`;
    case 'ON_HOLD': return `${tx('REQ-12.text.41', { holdText: holdText(c), who })}`;
    case 'DONE': return `${tx('REQ-12.text.40', { who })}`;
    case 'CONFIRMED': return tx('REQ-12.text.39');
    case 'AUTO_CLOSED': return tx('REQ-12.add.6');
    case 'CANCELLED': return `${tx('REQ-12.text.53', { v: CANCEL_BY[c.cancelledBy] ?? tx('REQ-12.text.38') })}`;
    case 'DECLINED': return `${tx('REQ-12.text.37', { v: DECLINE_STAFF[c.declineReason] })}`;
    case 'MOVED_TO_SAFETY': return tx('REQ-12.text.36');
    default: return tx('REQ-12.text.35');
  }
}
const kindLabel = (c) => (c.type ? TYPE_STAFF[c.type] : tx('REQ-12.text.3'));
const who = (r) => `${tx('REQ-12.text.34', { room: r.room, name: resOf(r.residentId).name })}`;
const chargeLine = (r) => {
  if (!r.feeCode) return '';
  const label = `${FEE_LABEL[r.feeCode].staff} ${fmt.won(priceOf(r.feeCode))}`;
  if (!r.charge) return `${tx('REQ-12.text.33', { label })}`;
  if (r.charge.status === 'SENT') return `${tx('REQ-12.text.32', { label, month: r.charge.month })}`;
  if (r.charge.status === 'FAILED') return `${tx('REQ-12.text.31', { staff: FEE_LABEL[r.feeCode].staff, room: r.room })}`;
  return `${tx('REQ-12.text.30', { label })}`;
};

function staffTimeline(r) {
  const now = nowISO(), rows = [];
  const name = resOf(r.residentId).name;
  for (const t of r.trans) {
    if (t.at > now) continue;
    const add = (s) => rows.push(`<li><span class="t">${stamp(t.at)}</span><span>${esc(s)}</span></li>`);
    switch (t.act) {
      case 'CREATE':
        if (r.source === 'STAFF_ENTRY') add(`${tx('REQ-12.text.29', { nameOf: nameOf(t.by) })}`);
        else if (r.source === 'GUARDIAN_PORTAL') add(`${tx('REQ-12.text.28', { relation: PERSONAS[t.by].relation, nameOf: nameOf(t.by) })}`);
        else if (r.source === 'ASSISTANT_HANDOFF') add(tx('REQ-12.add.11'));
        else add(`${tx('REQ-12.text.27', { name })}`);
        break;
      case 'CLASSIFY': add(`${tx('REQ-12.text.26', { v: TYPE_STAFF[t.type] })}`); break;
      case 'ASSIGN': add(t.claim ? `${tx('REQ-12.text.24', { nameOf: nameOf(t.to) })}` : `${tx('REQ-12.text.25', { nameOf: nameOf(t.by), nameOf2: nameOf(t.to) })}`); break;
      case 'START': if (t.to) add(`${tx('REQ-12.text.24', { nameOf: nameOf(t.to) })}`); add(tx('REQ-12.add.10')); break;
      case 'HOLD': add(`${tx('REQ-12.text.23', { v: HOLD_STAFF[t.reason] })}`); break;
      case 'RESUME': add(tx('REQ-12.add.9')); break;
      case 'COMPLETE': add(r.type === 'HOSPITAL_ESCORT' ? `${tx('REQ-12.text.22', { v: ESCORT_DONE_STAFF[t.note] })}` : `${tx('REQ-12.text.21', { note: t.note })}`); break;
      case 'CONFIRM': add(t.heardBy ? `${tx('REQ-12.text.20', { nameOf: nameOf(t.heardBy) })}` : tx('REQ-12.add.8')); break;
      case 'NOT_YET': add(t.heardBy ? `${tx('REQ-12.text.19', { nameOf: nameOf(t.heardBy) })}` : tx('REQ-12.add.7')); add(tx('REQ-12.span.4')); break;
      case 'AUTO_CLOSE': add(tx('REQ-12.add.6')); break;
      case 'DECLINE': add(`${tx('REQ-12.text.18', { v: DECLINE_STAFF[t.reason] })}`); break;
      case 'CANCEL': add(kindOf(t.by) === 'MEMBER' ? tx('REQ-12.add.5') : `${tx('REQ-12.text.17', { nameOf: nameOf(t.by) })}`); break;
      case 'MOVE_TO_SAFETY': add(tx('REQ-12.add.4')); break;
      case 'ACCEPT': add(t.heardBy ? `${tx('REQ-12.text.16', { nameOf: nameOf(t.heardBy) })}` : tx('REQ-12.add.3')); break;
      case 'MEMBER_DECLINE': add(t.heardBy ? `${tx('REQ-12.text.15', { nameOf: nameOf(t.heardBy) })}` : tx('REQ-12.add.2')); break;
      case 'EXPIRE': add(tx('REQ-12.add')); break;
      default: break;
    }
  }
  return rows.join('');
}

// --- 카드 ---
function badges(r, c) {
  const b = [];
  if (r.feeCode) b.push(`<span class="badge">${tx('REQ-12.span.5')}</span>`);
  if (isOverdue(c)) b.push(`<span class="badge">${ic('x2')}${tx('REQ-12.segBtn.2')}</span>`);
  if (c.reopen > 0 && ACTIVE.includes(c.status)) b.push(`<span class="badge">${ic('rotate-ccw')}${tx('REQ-12.span.4')}</span>`);
  return b.join('');
}
function rowActs(r, c, p) {
  const id = r.id, a = [];
  const btn = (label, attrs) => a.push(`<button class="btn btn-ghost btn-sm" type="button" ${attrs}>${label}</button>`);
  if (c.status === 'PENDING_MEMBER_OK') { if (isFront(p)) btn(tx('REQ-12.dialog.2'), `data-set="dialog=accept&target=${id}"`); return a.join(''); }
  if (!c.type) { if (isFront(p)) btn(tx('REQ-12.btn.9'), `data-set="dialog=classify&target=${id}"`); return a.join(''); }
  if (c.status === 'RECEIVED' && !c.assignee) {
    if (myTeam(c, p)) btn(tx('REQ-12.B.4'), `data-act="req.claim" data-id="${id}"`);
    if (isFront(p)) btn(tx('REQ-12.btn.10'), `data-set="dialog=assign&target=${id}"`);
  } else if (c.status === 'RECEIVED') {
    if (mine(c, p)) btn(tx('REQ-12.B.3'), `data-act="req.start" data-id="${id}"`);
    if (isFront(p)) btn(tx('REQ-12.btn.16'), `data-set="dialog=assign&target=${id}"`);
  } else if (c.status === 'IN_PROGRESS') {
    if (mine(c, p)) { btn(tx('REQ-12.B.2'), `data-set="open=${id}"`); btn(tx('REQ-12.btn.8'), `data-set="dialog=hold&target=${id}"`); }
    else if (isFront(p)) btn(tx('REQ-12.btn.16'), `data-set="dialog=assign&target=${id}"`);
  } else if (c.status === 'ON_HOLD') {
    if (mine(c, p)) btn(tx('REQ-12.B.3'), `data-act="req.start" data-id="${id}"`);
    else if (isFront(p)) btn(tx('REQ-12.btn.16'), `data-set="dialog=assign&target=${id}"`);
  } else if (c.status === 'DONE') {
    if (isFront(p) || mine(c, p)) btn(tx('REQ-12.dialog.3'), `data-set="dialog=proxy&target=${id}"`);
  }
  return a.join('');
}
function card(r, c, p, openId) {
  let lead = '';
  if (!c.type) lead = tx('REQ-12.text.14');
  else if (c.status === 'PENDING_MEMBER_OK') lead = tx('REQ-12.text.13');
  else if (c.reopen > 0 && ACTIVE.includes(c.status)) lead = c.reopenNote ? `${tx('REQ-12.text.12', { hm: fmt.hm(c.reopenAt), reopenNote: c.reopenNote })}` : `${tx('REQ-12.text.11', { hm: fmt.hm(c.reopenAt) })}`;
  const dest = c.type === 'HOSPITAL_ESCORT' ? `<span><span class="muted">${tx('REQ-12.label.7')}</span> ${ESCORT_HIDDEN}</span>` : '';
  const reason = r.source === 'ASSISTANT_HANDOFF' ? `<span><span class="muted">${tx('REQ-12.push.9')}</span> ${tx('REQ-12.push.8')}</span>` : '';
  return `<article class="card tight rq" data-req="${r.id}" data-type="${c.type ?? 'NONE'}" data-res="${r.residentId}"${openId === r.id ? ' aria-current="true"' : ''}>
  ${lead ? `<p class="rq-lead">${ic('info')}<span>${esc(lead)}</span></p>` : ''}
  <div class="rq-top"><span class="rq-kind">${kindLabel(c)}</span><a class="rq-open t-label" href="#" data-set="open=${r.id}">${esc(who(r))}</a></div>
  <p class="rq-body">${esc(bodyStaff(r, c))}</p>
  <div class="rq-meta">${dest}<span><span class="muted">${tx('REQ-12.push.4')}</span> ${esc(sourceStaff(r))}</span>${reason}<span><span class="muted">${tx('REQ-12.push.3')}</span> ${esc(statusStaff(r, c))}</span></div>
  <div class="rq-foot"><span class="badges">${badges(r, c)}</span><span class="row-act">${rowActs(r, c, p)}</span></div>
</article>`;
}
function occCard(o) {
  const t = S().tasks.find((x) => x.id === o.taskId);
  const st = { SCHEDULED: tx('REQ-12.SCHEDULED'), IN_PROGRESS: tx('REQ-12.INPROGRESS'), DONE: tx('REQ-12.B.2'), SKIPPED: o.skipReason === 'ABSENCE' ? tx('REQ-12.SKIPPED.2') : tx('REQ-12.SKIPPED'), MISSED: `${tx('REQ-12.text.10', { v: MISSED_STAFF[o.missedReason] ?? '' })}` }[o.status];
  const p = me();
  const acts = o.status === 'SCHEDULED' && (isMgr(p) || teamsOf(p.id).includes(t.team)) ? `<button class="btn btn-ghost btn-sm" type="button" data-act="req.occDone" data-id="${o.id}">${tx('REQ-12.B.2')}</button><button class="btn btn-ghost btn-sm" type="button" data-set="dialog=missed&target=${o.id}">${tx('REQ-12.dialog.5')}</button>` : '';
  const days = t.rule.days ? t.rule.days.map((d) => tx('REQ-12.map')[d]).join(', ') : '';
  return `<article class="card tight rq" data-occ="${o.id}">
  <div class="rq-top"><span class="rq-kind">${TYPE_STAFF[t.type]}</span><span class="rq-open t-label">${esc(o.room ?? t.target.label)}</span></div>
  <p class="rq-body">${days ? `${tx('REQ-12.text.9', { days })}` : tx('REQ-12.text.8')}</p>
  <div class="rq-meta"><span><span class="muted">${tx('REQ-12.push.3')}</span> ${esc(st)}${o.assignee && o.status !== 'SKIPPED' ? ` ${tx('REQ-12.text.7', { nameOf: nameOf(o.assignee) })}` : ''}</span></div>
  <div class="rq-foot"><span class="badges"><span class="badge">${tx('REQ-12.text.8')}</span></span><span class="row-act">${acts}</span></div>
</article>`;
}

// --- 상세 서랍(REQ-13) ---
function drawer(r, c, p) {
  const id = r.id;
  const rows = [[tx('REQ-12.text.6'), esc(bodyStaff(r, c))]];
  if (c.type === 'HOSPITAL_ESCORT') rows.push([tx('REQ-12.label.7'), canSeeDest(p) ? esc(r.details.dest || tx('REQ-12.esc')) : ESCORT_HIDDEN]);
  if (r.source === 'ASSISTANT_HANDOFF') rows.push([tx('REQ-12.push.9'), tx('REQ-12.push.8')]);
  if (c.type === 'REPAIR' && r.details.entry) rows.push([tx('REQ-12.push.7'), r.details.entry === 'ALLOWED_WHEN_ABSENT' ? tx('REQ-12.push.6') : tx('REQ-12.push.5')]);
  rows.push([tx('REQ-12.push.4'), esc(sourceStaff(r))]);
  const stShort = { RECEIVED: tx('REQ-12.RECEIVED'), IN_PROGRESS: tx('REQ-12.INPROGRESS'), ON_HOLD: `${tx('REQ-12.text.5', { holdText: holdText(c) })}`, DONE: tx('REQ-12.DONE') }[c.status];
  rows.push([tx('REQ-12.push.3'), esc(stShort ? (c.reopen > 0 && ACTIVE.includes(c.status) ? `${tx('REQ-12.text.4', { stShort })}` : stShort) : statusStaff(r, c))]);
  if (c.assignee) rows.push([tx('REQ-12.push.2'), esc(nameOf(c.assignee))]);
  const ch = chargeLine(r);
  if (ch) rows.push([tx('REQ-12.push'), esc(ch)]);
  const active = ACTIVE.includes(c.status);
  let field = '';
  if (c.status === 'IN_PROGRESS' && mine(c, p)) {
    field = c.type === 'HOSPITAL_ESCORT'
      ? `<fieldset class="rg" style="border: 0; padding: 0; margin: 0;"><legend class="label" style="font-weight: 600; margin-bottom: 4px;">${tx('REQ-12.legend.2')}</legend>${Object.keys(ESCORT_DONE_STAFF).map((k) => `<label class="choice"><input type="radio" name="done" value="${k}" data-bind="done" data-live>${ESCORT_DONE_STAFF[k]}</label>`).join('')}</fieldset>`
      : `<div class="field"><label for="did">${tx('REQ-12.label.10')}</label><input id="did" class="input" type="text" name="done" data-bind="done" data-live placeholder="${tx('REQ-12.placeholder')}"><span class="hint">${tx('REQ-12.span.3')}</span></div>`;
  }
  const sub = [];
  if (active && mine(c, p)) sub.push(`<button class="btn btn-ghost btn-sm" type="button" data-set="dialog=hold&target=${id}">${tx('REQ-12.btn.8')}</button><button class="btn btn-ghost btn-sm" type="button" data-set="dialog=decline&target=${id}">${tx('REQ-12.btn.7')}</button>`);
  if (active && c.assignee && isFront(p) && !(c.status === 'RECEIVED' && mine(c, p))) sub.push(`<button class="btn btn-ghost btn-sm" type="button" data-set="dialog=assign&target=${id}">${tx('REQ-12.btn.16')}</button>`);
  if (!c.type && r.source === 'ASSISTANT_HANDOFF') sub.push(`<button class="btn btn-ghost btn-sm" type="button" data-set="dialog=">${tx('REQ-12.btn.15')}</button>`);
  if (active && canStaff(p) && !isHq(p)) sub.push(`<details class="more"><summary class="btn btn-ghost btn-sm">${tx('REQ-12.btn.14')}</summary><ul class="menu"><li><a href="#" data-set="dialog=safety&target=${id}">${tx('REQ-12.dialog')}</a></li></ul></details>`);
  let main = '';
  const B = (label, attrs, off) => `<button class="btn btn-secondary btn-sm btn-next" type="button" ${attrs}${off ? ' disabled' : ''}>${label}</button>`;
  if (c.status === 'PENDING_MEMBER_OK') { if (isFront(p)) main = B(tx('REQ-12.dialog.2'), `data-set="dialog=accept&target=${id}"`); }
  else if (!c.type) { if (isFront(p)) main = B(tx('REQ-12.btn.9'), `data-set="dialog=classify&target=${id}"`); }
  else if (c.status === 'RECEIVED' && !c.assignee) main = myTeam(c, p) ? B(tx('REQ-12.B.4'), `data-act="req.claim" data-id="${id}"`) : (isFront(p) ? B(tx('REQ-12.btn.10'), `data-set="dialog=assign&target=${id}"`) : '');
  else if (c.status === 'RECEIVED') main = mine(c, p) ? B(tx('REQ-12.B.3'), `data-act="req.start" data-id="${id}"`) : '';
  else if (c.status === 'IN_PROGRESS') main = mine(c, p) ? B(tx('REQ-12.B.2'), `data-act="req.complete" data-id="${id}"`, !view.done?.trim()) : '';
  else if (c.status === 'ON_HOLD') main = mine(c, p) ? B(tx('REQ-12.B'), `data-act="req.start" data-id="${id}"`) : '';
  else if (c.status === 'DONE') main = isFront(p) || mine(c, p) ? B(tx('REQ-12.dialog.3'), `data-set="dialog=proxy&target=${id}"`) : '';
  const alert = !c.type ? `<div class="alert">${ic('info')}<p>${tx('REQ-12.p.6')}</p></div>` : '';
  return `<aside class="card detail" aria-label="${tx('REQ-12.ariaLabel.2')}" id="d-${id}">
  <button class="btn btn-ghost btn-sm sheet-x" type="button" aria-label="${tx('REQ-12.ariaLabel')}" data-set="open=">${ic('x')}</button>
  <div class="stack" style="gap: 2px;"><span class="rq-kind">${kindLabel(c)}</span><h2 class="t-heading2">${esc(who(r))}</h2></div>
  ${alert}
  <dl class="kv">${rows.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl>
  <div><h3 class="t-label">${tx('REQ-12.h3')}</h3><ul class="timeline">${staffTimeline(r)}</ul></div>
  ${field}
  ${sub.length ? `<div class="act-sub">${sub.join('')}</div>` : ''}
  ${main ? `<div class="sticky-act">${main}</div>` : ''}
</aside>`;
}

// --- 대화창과 서랍 ---
const cancelBtn = `<button class="btn btn-secondary btn-md" type="button" data-set="dialog=">${tx('REQ-12.btn.12')}</button>`;
const choice = (name, k, label, checked) => `<label class="choice"><input type="radio" name="${name}" value="${k}" data-bind="${name}"${checked ? ' checked' : ''}>${label}</label>`;
const group = (inner) => `<fieldset class="rg" style="border: 0; padding: 0; margin: 0;">${inner}</fieldset>`;
const head2 = (r, c) => `<p class="muted">${TYPE_STAFF[c.type] ?? tx('REQ-12.text.3')}, ${esc(who(r))}<br>${esc(bodyStaff(r, c))}</p>`;

function assignPick(r, c) {
  const team = view.a_team ?? c.team ?? 'FRONT';
  const members = S().teams[team];
  const pick = members.includes(view.a_who) ? view.a_who : (members.includes(c.assignee) ? c.assignee : members[0]);
  return { team, members, pick };
}
const openCount = (pid) => allReqs().filter((x) => x.c.assignee === pid && ACTIVE.includes(x.c.status)).length;

function entrySheet() {
  const list = residentsList();
  const rooms = [...new Set(list.map((x) => x.room))];
  const room = rooms.includes(view.r_room) ? view.r_room : rooms[0];
  const inRoom = list.filter((x) => x.room === room);
  const res = inRoom.find((x) => x.id === view.r_res)?.id ?? inRoom[0]?.id;
  const kind = view.r_kind ?? 'REPAIR';
  const heard = view.r_heard ?? 'PHONE';
  const sel = (name, opts, val) => `<select id="${name}" class="input" name="${name}" data-bind="${name}" data-live>${opts.map(([v, l]) => `<option value="${esc(v)}"${v === val ? ' selected' : ''}>${esc(l)}</option>`).join('')}</select>`;
  const heardBox = `<fieldset class="rg" style="border: 0; padding: 0; margin: 0;"><legend class="label" style="font-weight: 600; margin-bottom: 4px;">${tx('REQ-12.legend')}</legend>${Object.keys(HEARD).map((k) => `<label class="choice"><input type="radio" name="r_heard" value="${k}" data-bind="r_heard"${heard === k ? ' checked' : ''}>${HEARD[k]}</label>`).join('')}</fieldset>`;
  const kindSel = `<div class="field"><label for="r_kind">${tx('REQ-12.label.13')}</label>${sel('r_kind', ENTRY_TYPES.map((t) => [t, t === 'OTHER' ? tx('REQ-12.choice.5') : TYPE_STAFF[t]]), kind)}</div>`;
  const top = `<div class="pair2"><div class="field"><label for="r_room">${tx('REQ-12.label.8')}</label>${sel('r_room', rooms.map((x) => [x, x]), room)}</div><div class="field"><label for="r_res">${tx('REQ-12.label.9')}</label>${sel('r_res', inRoom.map((x) => [x.id, x.name]), res)}</div></div>`;
  let body;
  if (kind === 'HOSPITAL_ESCORT') {
    body = `${kindSel}<div class="pair2"><div class="field"><label for="r_date">${tx('REQ-12.label.5')}</label><input id="r_date" class="input" type="text" name="r_date" data-bind="r_date" placeholder="${tx('REQ-12.label.5')}"></div><div class="field"><label for="r_time">${tx('REQ-12.label.6')}</label><input id="r_time" class="input" type="text" name="r_time" data-bind="r_time" placeholder="${tx('REQ-12.label.6')}"></div></div>
      <div class="field"><label for="r_where">${tx('REQ-12.label.7')}</label><input id="r_where" class="input" type="text" name="r_where" data-bind="r_where" placeholder="${tx('REQ-12.label.7')}"><span class="hint">${tx('REQ-12.span.2')}</span></div>
      <label class="choice"><input type="checkbox" name="r_ret" data-bind="r_ret">${tx('REQ-12.input.2')}</label>${heardBox}`;
  } else {
    const fee = kind === 'LAUNDRY' ? `<div class="alert">${ic('info')}<div><p>${tx('REQ-12.p.5', { unit: FEE_LABEL.LAUNDRY_BEDDING.unit, won: fmt.won(priceOf('LAUNDRY_BEDDING')) })}</p><label class="choice"><input type="checkbox" name="r_ack" data-bind="r_ack">${tx('REQ-12.input')}</label></div></div>` : '';
    body = `<div class="pair2">${kindSel}<div class="field"><label for="r_when">${tx('REQ-12.label.3')}</label><input id="r_when" class="input" type="text" name="r_when" data-bind="r_when"></div></div>
      <div class="field"><label for="r_say">${tx('REQ-12.label.4')}</label><textarea id="r_say" class="input" name="r_say" data-bind="r_say"></textarea></div>${fee}${heardBox}`;
  }
  return sheetWrap(`<section class="rsheet" role="dialog" aria-modal="true" aria-labelledby="rs-t"><header><h2 id="rs-t" class="t-heading1">${tx('REQ-12.btn.2')}</h2><button class="btn btn-ghost btn-sm" type="button" aria-label="${tx('REQ-12.ariaLabel')}" data-set="dialog=">${ic('x')}</button></header>
    <div class="body"><p class="muted">${tx('REQ-12.p.4', { name: esc(me().name) })}</p>${top}${body}</div>
    <footer><button class="btn btn-ghost btn-sm" type="button" data-set="dialog=">${tx('REQ-12.btn.12')}</button><button class="btn btn-primary btn-sm sheet-foot-main" type="button" data-act="req.entry">${tx('REQ-12.btn.13')}</button></footer></section>`);
}
function overlay() {
  const d = view.dialog;
  if (!d) return '';
  if (d === 'entry') return entrySheet();
  const r = getReq(view.target), c = r && cur(r);
  const o = S().occ.find((x) => x.id === view.target);
  if (d === 'missed' && o) return dialog(tx('REQ-12.dialog.5'), `<p class="muted">${tx('REQ-12.p.3', { v: esc(o.room ?? '') })}</p>${group(Object.keys(MISSED_STAFF).map((k) => choice('m_why', k, MISSED_STAFF[k], (view.m_why ?? 'NOT_HOME') === k)).join(''))}`, `${cancelBtn}<button class="btn btn-primary btn-md" type="button" data-act="req.occMissed" data-id="${o.id}">${tx('REQ-12.btn.11')}</button>`);
  if (!c?.status) return '';
  if (d === 'assign') {
    const { team, members, pick } = assignPick(r, c);
    const why = c.assignee ? `<div class="field"><label for="a_why">${tx('REQ-12.label.2')}</label><select id="a_why" class="input" name="a_why" data-bind="a_why"><option value="">${tx('REQ-12.option')}</option>${Object.keys(WHY).map((k) => `<option value="${k}"${view.a_why === k ? ' selected' : ''}>${WHY[k]}</option>`).join('')}</select></div>` : '';
    return dialog(tx('REQ-12.dialog.4'), `${head2(r, c)}<div class="field"><label for="a_team">${tx('REQ-12.label.11')}</label><select id="a_team" class="input" name="a_team" data-bind="a_team" data-live>${Object.keys(TEAM_LABEL).map((k) => `<option value="${k}"${team === k ? ' selected' : ''}>${TEAM_LABEL[k]}</option>`).join('')}</select></div>${group(`<legend class="label" style="font-weight: 600; margin-bottom: 4px;">${tx('REQ-12.legend.3')}</legend>${members.map((m) => `<label class="choice"><input type="radio" name="a_who" value="${m}" data-bind="a_who"${pick === m ? ' checked' : ''}>${nameOf(m)}<span class="muted">${tx('REQ-12.span', { openCount: openCount(m) })}</span></label>`).join('')}`)}${why}`, `${cancelBtn}<button class="btn btn-primary btn-md" type="button" data-act="req.assign" data-id="${r.id}">${tx('REQ-12.btn.10')}</button>`);
  }
  if (d === 'classify') return dialog(tx('REQ-12.btn.9'), `${head2(r, c)}<p class="muted">${tx('REQ-12.p.6')}</p>${group(ENTRY_TYPES.map((k) => choice('c_kind', k, k === 'OTHER' ? tx('REQ-12.choice.5') : TYPE_STAFF[k], (view.c_kind ?? 'REPAIR') === k)).join(''))}`, `${cancelBtn}<button class="btn btn-primary btn-md" type="button" data-act="req.classify" data-id="${r.id}">${tx('REQ-12.btn.9')}</button>`);
  if (d === 'hold') {
    const memo = c.type === 'HOSPITAL_ESCORT' ? '' : `<div class="field"><label for="h_note">${tx('REQ-12.label')}</label><textarea id="h_note" class="input" name="h_note" data-bind="h_note"></textarea></div>`;
    return dialog(tx('REQ-12.btn.8'), `${head2(r, c)}${group(Object.keys(HOLD_STAFF).map((k) => choice('h_why', k, HOLD_STAFF[k], (view.h_why ?? 'PARTS') === k)).join(''))}${memo}`, `${cancelBtn}<button class="btn btn-primary btn-md" type="button" data-act="req.hold" data-id="${r.id}">${tx('REQ-12.btn.8')}</button>`);
  }
  if (d === 'decline') return dialog(tx('REQ-12.btn.7'), `${head2(r, c)}<p class="muted">${tx('REQ-12.p.2')}</p>${group(Object.keys(DECLINE_STAFF).map((k) => choice('d_why', k, DECLINE_STAFF[k], (view.d_why ?? 'OUT_OF_SCOPE') === k)).join(''))}`, `${cancelBtn}<button class="btn btn-primary btn-md" type="button" data-act="req.decline" data-id="${r.id}">${tx('REQ-12.btn.7')}</button>`);
  if (d === 'proxy') return dialog(tx('REQ-12.dialog.3'), `${head2(r, c)}<p class="muted">${tx('REQ-12.p.7')}</p>${group(`${choice('p_res', 'CONFIRM', tx('REQ-12.choice.4'), (view.p_res ?? 'CONFIRM') === 'CONFIRM')}${choice('p_res', 'NOT_YET', tx('REQ-12.choice.3'), view.p_res === 'NOT_YET')}`)}`, `${cancelBtn}<button class="btn btn-primary btn-md" type="button" data-act="req.proxy" data-id="${r.id}">${tx('REQ-12.btn.6')}</button>`);
  if (d === 'accept') return dialog(tx('REQ-12.dialog.2'), `<p class="muted">${tx('REQ-12.text.13')}</p>${group(`${choice('p_ans', 'ACCEPT', tx('REQ-12.choice.2'), (view.p_ans ?? 'ACCEPT') === 'ACCEPT')}${choice('p_ans', 'DECLINE', tx('REQ-12.choice'), view.p_ans === 'DECLINE')}`)}`, `${cancelBtn}<button class="btn btn-primary btn-md" type="button" data-act="req.accept" data-id="${r.id}">${tx('REQ-12.btn.6')}</button>`);
  if (d === 'safety') return dialog(tx('REQ-12.dialog'), `<p class="muted">${tx('REQ-12.p')}</p>`, `<button class="btn btn-secondary btn-md" type="button" data-set="dialog=">${tx('REQ-12.btn.5')}</button>` + `<button class="btn btn-primary btn-md" type="button" data-act="req.safety" data-id="${r.id}">${tx('REQ-12.btn.4')}</button>`);
  return '';
}

// --- 목록(REQ-12) ---
function screen12(params) {
  const p = me();
  if (!canStaff(p)) return { main: `<div class="page-head"><div><h1 class="t-title2">${tx('REQ-12.title')}</h1></div></div>${denied(tx('REQ-12.denied'))}` };
  const front = isFront(p) || isHq(p);
  const all = allReqs().filter((x) => (x.c.type !== 'FEEDBACK' || front) && (x.c.status !== 'PENDING_MEMBER_OK' || pendingShown(x.r)));
  const sum = {
    unassigned: all.filter((x) => x.c.status === 'RECEIVED' && !x.c.assignee).length,
    active: all.filter((x) => ACTIVE.includes(x.c.status) && x.c.assignee).length,
    done: all.filter((x) => x.c.status === 'DONE').length,
    overdue: all.filter((x) => isOverdue(x.c)).length,
  };
  const seg = view.seg ?? params.view ?? (['STAFF', 'LIFE', 'CARE'].includes(p.key) ? 'mine' : 'all');
  const routine = !!view.routine;
  const week = `${addDays(today(), -7)}T${nowISO().slice(11)}`;
  let rows = all.filter((x) => {
    const { c } = x;
    if (seg === 'mine') return c.assignee === p.id && OPEN.includes(c.status);
    if (seg === 'unassigned') return c.status === 'RECEIVED' && !c.assignee && (front || myTeam(c, p));
    if (seg === 'overdue') return isOverdue(c);
    if (view.st === 'DONE') return c.status === 'DONE';
    if (view.st === 'ACTIVE') return ACTIVE.includes(c.status) && !!c.assignee;
    return OPEN.includes(c.status) || c.status === 'PENDING_MEMBER_OK' || (c.closedAt && c.closedAt >= week);
  });
  if (view.fteam && view.fteam !== 'ALL') rows = rows.filter((x) => x.c.team === view.fteam);
  if (view.fkind && view.fkind !== 'ALL') rows = rows.filter((x) => x.c.type === view.fkind);
  const rank = (x) => (x.c.status === 'RECEIVED' && !x.c.assignee ? 0 : x.c.status === 'DONE' ? 1 : isOverdue(x.c) ? 2 : OPEN.includes(x.c.status) ? 3 : 4);
  rows.sort((a, b) => rank(a) - rank(b) || b.r.createdAt.localeCompare(a.r.createdAt));
  const openId = view.open !== undefined ? view.open : params.id;
  const sel = openId ? all.find((x) => x.r.id === openId) : null;
  let occs = occToday();
  if (view.fteam && view.fteam !== 'ALL') occs = occs.filter((o) => S().tasks.find((t) => t.id === o.taskId).team === view.fteam);
  let list;
  if (routine) list = occs.length ? occs.map(occCard).join('') : empty(tx('REQ-12.empty.3'));
  else if (rows.length) list = rows.map((x) => card(x.r, x.c, p, sel?.r.id)).join('');
  else if (seg === 'mine') list = empty(`${tx('REQ-12.text.2', { unassigned: sum.unassigned })}`) + `<button class="btn btn-ghost btn-sm" type="button" data-set="seg=unassigned">${tx('REQ-12.btn.3')}</button>`;
  else if (seg === 'unassigned') list = empty(tx('REQ-12.empty.2'));
  else if (seg === 'overdue') list = empty(tx('REQ-12.empty'));
  else list = '';
  const segBtn = (k, label) => `<a href="#" data-set="seg=${k}&st=&routine="${seg === k && !routine ? ' aria-current="true"' : ''}>${label}</a>`;
  const opt = (map, cur2, allLabel) => `<option value="ALL">${allLabel}</option>${Object.keys(map).map((k) => `<option value="${k}"${cur2 === k ? ' selected' : ''}>${map[k]}</option>`).join('')}`;
  const asof = `${tx('REQ-12.text', { slice: nowISO().slice(5, 7), slice2: nowISO().slice(8, 10), slice3: nowISO().slice(11, 16) })}`;
  const main = `<div class="page-head"><div><nav class="crumb" aria-label="${tx('REQ-12.ariaLabel.3')}"><a href="${href('REQ-12')}">${tx('REQ-12.a')}</a></nav><h1 class="t-title2">${tx('REQ-12.title')}</h1></div>
      <div class="row"><span class="asof">${asof} <button class="btn btn-ghost btn-sm" type="button" data-set="reload=1">${tx('REQ-12.btn.17')}</button></span>
      ${isFront(p) ? `<a class="btn btn-ghost btn-sm" href="${href('AST-09')}">${tx('REQ-12.btn')}</a><button class="btn ${sel ? 'btn-secondary' : 'btn-primary'} btn-sm btn-new" type="button" data-set="dialog=entry">${ic('plus')}${tx('REQ-12.btn.2')}</button>` : ''}</div></div>
    <div class="stat-strip" aria-label="${tx('REQ-12.ariaLabel.4')}"><a href="#" data-set="seg=unassigned&st=&routine="><span class="k">${tx('REQ-12.segBtn.3')}</span><span class="v">${sum.unassigned}</span></a><a href="#" data-set="seg=all&st=ACTIVE&routine="><span class="k">${tx('REQ-12.INPROGRESS')}</span><span class="v">${sum.active}</span></a><a href="#" data-set="seg=all&st=DONE&routine="><span class="k">${tx('REQ-12.span.6')}</span><span class="v">${sum.done}</span></a><a href="#" data-set="seg=overdue&st=&routine="><span class="k">${tx('REQ-12.segBtn.2')}</span><span class="v">${sum.overdue}</span></a></div>
    <div class="filters-row"><div class="seg" role="group" aria-label="${tx('REQ-12.ariaLabel.5')}">${segBtn('mine', tx('REQ-12.segBtn.4'))}${segBtn('unassigned', tx('REQ-12.segBtn.3'))}${segBtn('overdue', tx('REQ-12.segBtn.2'))}${segBtn('all', tx('REQ-12.segBtn'))}</div><button class="chip" type="button" data-set="routine=${routine ? '' : '1'}" aria-pressed="${routine}">${tx('REQ-12.button')}</button><label class="sr-only" for="f-team">${tx('REQ-12.label.11')}</label><select id="f-team" class="chip-sel" data-bind="fteam" data-live>${opt(TEAM_LABEL, view.fteam, tx('REQ-12.opt.2'))}</select><label class="sr-only" for="f-kind">${tx('REQ-12.label.12')}</label><select id="f-kind" class="chip-sel" data-bind="fkind" data-live>${opt(TYPE_FILTER, view.fkind, tx('REQ-12.opt'))}</select></div>
    <div class="q-split"><div class="q-list">${list}<p class="muted fnote">${typeof api.safety.registerFromRequest === 'function' ? FNOTE : FNOTE_NO_SAFETY}</p></div>${sel ? drawer(sel.r, sel.c, p) : ''}</div>`;
  return { main, overlay: overlay() };
}

// --- 행동 ---
const need = (id) => { if (!canStaff(me())) refuse(tx('requests.need.refuse.2')); const r = getReq(id); if (!r) refuse(tx('requests.need.refuse')); return r; };
export const opsActions = {
  'req.claim': (a) => claim(need(a.id)),
  'req.start': (a) => start(need(a.id)),
  'req.assign': (a) => { const r = need(a.id); assign(r, assignPick(r, cur(r)).pick, view.a_why); view.dialog = ''; view.a_why = ''; },
  'req.classify': (a) => { classify(need(a.id), view.c_kind ?? 'REPAIR'); view.dialog = ''; },
  'req.hold': (a) => { hold(need(a.id), view.h_why ?? 'PARTS', view.h_note); view.dialog = ''; view.h_note = ''; },
  'req.complete': (a) => { complete(need(a.id), view.done); view.done = ''; },
  'req.decline': (a) => { decline(need(a.id), view.d_why ?? 'OUT_OF_SCOPE'); view.dialog = ''; },
  'req.proxy': (a) => { const r = need(a.id); if ((view.p_res ?? 'CONFIRM') === 'CONFIRM') confirm(r, true); else notYet(r, '', true); view.dialog = ''; },
  'req.accept': (a) => { memberAnswer(need(a.id), (view.p_ans ?? 'ACCEPT') === 'ACCEPT', true); view.dialog = ''; },
  'req.safety': (a) => { moveToSafety(need(a.id)); view.dialog = ''; },
  'req.occDone': (a) => {
    const o = S().occ.find((x) => x.id === a.id);
    if (!o || o.status !== 'SCHEDULED') refuse(tx('requests.action.refuse.5'));
    o.status = 'DONE'; o.doneAt = nowISO(); o.doneBy = me().id;
  },
  'req.occMissed': (a) => {
    const o = S().occ.find((x) => x.id === a.id);
    if (!o || o.status !== 'SCHEDULED') refuse(tx('requests.action.refuse.5'));
    o.status = 'MISSED'; o.missedReason = view.m_why ?? 'NOT_HOME'; o.doneBy = me().id; view.dialog = '';
  },
  'req.entry': () => {
    const p = me();
    if (!isFront(p)) refuse(tx('requests.action.refuse.4'));
    const list = residentsList(), rooms = [...new Set(list.map((x) => x.room))];
    const room = rooms.includes(view.r_room) ? view.r_room : rooms[0];
    const inRoom = list.filter((x) => x.room === room);
    const residentId = inRoom.find((x) => x.id === view.r_res)?.id ?? inRoom[0]?.id;
    const type = view.r_kind ?? 'REPAIR';
    const heardVia = view.r_heard ?? 'PHONE';
    const empty1 = tx('requests.action.reqEntry');
    if (!room || !residentId || !type) refuse(empty1);
    let o = { residentId, type, source: 'STAFF_ENTRY', heardVia };
    if (type === 'HOSPITAL_ESCORT') o = { ...o, body: null, details: { whenText: `${view.r_date ?? ''} ${view.r_time ?? ''}`.trim(), dest: view.r_where?.trim() ?? '', ret: !!view.r_ret } };
    else {
      if (!view.r_say?.trim()) refuse(empty1);
      o = { ...o, body: view.r_say.trim(), details: { whenText: view.r_when ?? '' } };
      if (type === 'LAUNDRY') {
        if (!view.r_ack) refuse(`${tx('requests.action.text.5', { unit: FEE_LABEL.LAUNDRY_BEDDING.unit, won: fmt.won(priceOf('LAUNDRY_BEDDING')) })}`);
        o.feeCode = 'LAUNDRY_BEDDING';
      }
    }
    const r = createReq(o);
    for (const k of ['r_room', 'r_res', 'r_kind', 'r_when', 'r_say', 'r_ack', 'r_heard', 'r_date', 'r_time', 'r_where', 'r_ret']) delete view[k];
    view.dialog = '';
    toast(`${tx('requests.action.text.4', { v: TEAM_LABEL[r.team] })}`);
  },
};
export const opsScreens = { 'REQ-12': { app: 'ops', title: tx('REQ-12.title'), render: screen12 } };
