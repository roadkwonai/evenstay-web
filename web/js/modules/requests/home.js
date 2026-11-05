// 회원 앱(Evenstay 홈) 화면: REQ-01, REQ-03, REQ-05(비용 안내 포함), REQ-07(확인하기 포함), REQ-09
import { tx } from '../../lib/text.js';
import { dialog, denied, empty, esc, fmt, go, href, ic, me, nowISO, refuse, toast, view } from '../../lib/kit.js';
import { PERSONAS } from '../../lib/people.js';
import {
  CLOSED, DECLINE_MEMBER, FEE_LABEL, HOLD_MEMBER, S, TYPE_MEMBER, WEEK, addDays, allReqs, bodyMember, cancel, confirm, createReq, cur, doneText, getReq, memberAnswer,
  memberWhen, nameOf, nextRuleDate, notYet, priceOf, resOf, skipCutoff, skipOf, taskOf, today,
} from './model.js';

const FOOT = tx('requests.shared.text.11');
const FOOT_FIRST = `${tx('requests.shared.text.10', { FOOT })}`;
const foot = (first) => `<p class="t-body-md">${first ? FOOT_FIRST : FOOT}</p>`;
const back = (h) => `<a class="btn btn-ghost btn-md back" href="${h}">${ic('chevron-left')}${tx('requests.shared.btn')}</a>`;
const backSet = (spec) => `<button class="btn btn-ghost btn-md back" type="button" data-set="${spec}">${ic('chevron-left')}${tx('REQ-03.btn.2')}</button>`;
const residentId = () => me().residentId;
const own = (r) => { if (!r || r.residentId !== residentId()) refuse(tx('requests.own.refuse')); return r; };

// --- 상태 문장 ---
export function stateMember(r, c) {
  switch (c.status) {
    case 'RECEIVED': return c.assignee ? `${tx('requests.shared.text.9', { nameOf: nameOf(c.assignee) })}` : tx('requests.shared.text.8');
    case 'IN_PROGRESS': return `${tx('requests.shared.text.7', { nameOf: nameOf(c.assignee) })}`;
    case 'ON_HOLD': return HOLD_MEMBER[c.holdReason];
    case 'DONE': return tx('requests.shared.text.6');
    case 'CONFIRMED': return tx('requests.shared.text.5');
    case 'AUTO_CLOSED': return tx('requests.shared.text.4');
    case 'CANCELLED': return tx('requests.shared.text.3');
    case 'DECLINED': return DECLINE_MEMBER[c.declineReason];
    case 'MOVED_TO_SAFETY': return tx('requests.shared.text.2');
    default: return tx('requests.shared.text');
  }
}
const relName = (pid) => `${tx('REQ-07.text.31', { v: PERSONAS[pid]?.relation ?? '', nameOf: nameOf(pid) })}`;

/** 지나온 일. viewer = MEMBER 또는 GUARDIAN */
export function timeline(r, viewer) {
  const now = nowISO(), rows = [];
  const who = resOf(r.residentId).name;
  let done = 0;
  for (const t of r.trans) {
    if (t.at > now) continue;
    let what = null;
    switch (t.act) {
      case 'CREATE':
        if (r.source === 'STAFF_ENTRY') what = `${tx('REQ-07.text.30', { nameOf: nameOf(t.by) })}`;
        else if (r.source === 'GUARDIAN_PORTAL') what = `${tx('REQ-07.text.29', { relName: relName(t.by) })}`;
        else if (r.source === 'ASSISTANT_HANDOFF') what = tx('REQ-07.text.28');
        else what = viewer === 'MEMBER' ? tx('REQ-07.text.27') : `${tx('REQ-07.text.26', { who })}`;
        break;
      case 'ASSIGN': what = `${tx('REQ-07.text.25', { nameOf: nameOf(t.to) })}`; break;
      case 'START': if (t.to) what = `${tx('REQ-07.text.25', { nameOf: nameOf(t.to) })}`; break;
      case 'HOLD': what = HOLD_MEMBER[t.reason]; break;
      case 'COMPLETE': done += 1; what = `${viewer === 'GUARDIAN' && done > 1 ? tx('REQ-07.text.24') : tx('REQ-07.text.23')}: ${doneText(r, { type: r.type, doneNote: t.note }, 'MEMBER')}`; break;
      case 'CONFIRM': what = t.heardBy ? `${tx('REQ-07.text.22', { nameOf: nameOf(t.heardBy) })}` : (viewer === 'MEMBER' ? tx('REQ-07.text.21') : `${tx('REQ-07.text.20', { who })}`); break;
      case 'NOT_YET':
        if (t.heardBy) what = `${tx('REQ-07.text.19', { nameOf: nameOf(t.heardBy) })}`;
        else if (viewer === 'GUARDIAN') what = `${tx('REQ-07.text.18', { who })}`;
        else what = t.note ? `${tx('REQ-07.text.17', { note: t.note })}` : tx('REQ-07.text.16');
        break;
      case 'AUTO_CLOSE': what = tx('REQ-07.text.15'); break;
      case 'DECLINE': what = DECLINE_MEMBER[t.reason]; break;
      case 'CANCEL': what = tx('REQ-07.text.14'); break;
      case 'MOVE_TO_SAFETY': what = tx('REQ-07.text.13'); break;
      case 'ACCEPT': what = t.heardBy ? `${tx('REQ-07.text.12', { nameOf: nameOf(t.heardBy) })}` : tx('REQ-07.text.11'); break;
      case 'MEMBER_DECLINE': what = t.heardBy ? `${tx('REQ-07.text.10', { nameOf: nameOf(t.heardBy) })}` : tx('REQ-07.text.9'); break;
      case 'EXPIRE': what = `${tx('REQ-07.text.8', { relName: relName(r.byId) })}`; break;
      default: break;
    }
    if (what) rows.push({ at: t.at, what });
  }
  let prev = '';
  return rows.map((x) => {
    const day = x.at.slice(0, 10), when = memberWhen(x.at, day !== prev);
    prev = day;
    return `<div class="record"><span class="when">${when}</span><span class="what">${esc(x.what)}</span></div>`;
  }).join('');
}

// --- 첫 화면 ---
const TILES = [['REPAIR', 'wrench', tx('REQ-01.text.7')], ['CLEANING', 'sparkles', tx('REQ-01.text.6')], ['LAUNDRY', 'shirt', tx('REQ-01.text.5')], ['TRANSPORT', 'car', tx('REQ-01.text.4')], ['FEEDBACK', 'message-square-text', tx('REQ-01.text.3')], ['OTHER', 'ellipsis', tx('REQ-01.text.2')]];
const row = (r, c) => `<li><a class="cell" href="${href('REQ-07', { id: r.id })}"><span class="body"><span class="title">${TYPE_MEMBER[c.type]} · ${esc(bodyMember(r, c))}</span><span class="sub">${esc(stateMember(r, c))}</span></span>${ic('chevron-right')}</a></li>`;

function screen01() {
  const id = residentId();
  const mine = allReqs().filter((x) => x.r.residentId === id).sort((a, b) => b.r.createdAt.localeCompare(a.r.createdAt));
  const tab = view.tab === 'done' ? 'done' : 'open';
  const list = mine.filter((x) => (tab === 'done') === CLOSED.includes(x.c.status));
  const wait = mine.filter((x) => x.c.status === 'DONE').length;
  let body;
  if (list.length) body = `<ul class="list card flush">${list.map((x) => row(x.r, x.c)).join('')}</ul>`;
  else if (!mine.length) body = `<section class="card" aria-label="${tx('REQ-01.ariaLabel')}"><div class="empty"><span class="state-icon">${ic('inbox')}</span><h2 class="t-heading2">${tx('REQ-01.h2')}</h2><p class="t-body-lg muted">${tx('REQ-01.p.2')}</p></div></section>`;
  else body = empty(tab === 'open' ? tx('REQ-01.empty.2') : tx('REQ-01.empty'));
  const task = taskOf(id);
  const nextOk = task && nextRuleDate(task, today());
  const clean = task && nextOk ? `<ul class="list card flush" aria-label="${tx('REQ-01.ariaLabel.4')}"><li class="cell" style="flex-wrap: wrap; row-gap: 4px;">${ic('repeat')}<span class="body"><span class="title">${task.rule.kind === 'MONTHLY_DAY' ? tx('REQ-01.title.3', { day: task.rule.day }) : tx('REQ-01.title.2', { join: task.rule.days.map((d) => `${tx('REQ-01.text', { v: WEEK[d] })}`).join(', ') })}</span></span><a class="btn btn-ghost btn-md" href="${href('REQ-09')}">${tx('REQ-01.btn')}</a></li></ul>` : '';
  return {
    foot: foot(true),
    main: `<h1 class="t-title3">${tx('REQ-01.title')}</h1>
      <p class="t-body-lg">${tx('REQ-01.p.3')}</p>
      <h2 class="t-heading1">${tx('REQ-01.h2.2')}</h2>
      <nav aria-label="${tx('REQ-01.ariaLabel.2')}"><ul class="list card flush tiles">${TILES.map(([t, i, sub]) => `<li><a class="cell" href="${href('REQ-03', { type: t })}">${ic(i)}<span class="body"><span class="title">${TYPE_MEMBER[t]}</span><span class="sub">${sub}</span></span>${ic('chevron-right')}</a></li>`).join('')}</ul></nav>
      <p class="t-body-lg">${tx('REQ-01.p.4')}</p>
      <section class="stack" aria-labelledby="my"><h2 id="my" class="t-heading1">${tx('REQ-01.h2.3')}</h2>
        <nav class="tabs" aria-label="${tx('REQ-01.ariaLabel.3')}"><a href="#" data-set="tab=open"${tab === 'open' ? ' aria-current="page"' : ''}>${tx('REQ-01.a')}</a><a href="#" data-set="tab=done"${tab === 'done' ? ' aria-current="page"' : ''}>${tx('REQ-01.a.2')}</a></nav>
        ${tab === 'open' && wait ? `<div class="alert">${ic('info')}<p class="t-body-lg">${tx('REQ-01.p', { wait })}</p></div>` : ''}
        ${body}
      </section>${clean}`,
  };
}

// --- 종류별 입력 ---
const STEPS = { REPAIR: ['body', 'entry'], CLEANING: ['body', 'day'], LAUNDRY: ['item', 'pickup'], TRANSPORT: ['day', 'time', 'dest', 'ret'], FEEDBACK: ['body'], OTHER: ['body'] };
const BODY_Q = { REPAIR: [tx('REQ-03.REPAIR.2'), tx('REQ-03.REPAIR')], CLEANING: [tx('REQ-03.CLEANING.2'), tx('REQ-03.CLEANING')], FEEDBACK: [tx('REQ-03.FEEDBACK.2'), tx('REQ-03.FEEDBACK')], OTHER: [tx('REQ-03.OTHER.2'), tx('REQ-03.OTHER')] };
const ENTRY = { ALLOWED_WHEN_ABSENT: tx('REQ-03.ALLOWEDWHENABSENT'), ONLY_WHEN_PRESENT: tx('REQ-03.ONLYWHENPRESENT') };
const ITEM = { CLOTHES: tx('requests.shared.CLOTHES'), BEDDING: tx('requests.shared.BEDDING'), OTHER: tx('requests.shared.OTHER') };
const PICKUP = { TODAY_PM: tx('requests.shared.TODAYPM'), TOMORROW_AM: tx('requests.shared.TOMORROWAM') };
const RET = { YES: tx('REQ-03.YES'), NO: tx('REQ-03.NO') };
const TIMES = [['09:00', tx('REQ-03.text.17')], ['10:00', tx('REQ-03.text.16')], ['11:00', tx('REQ-03.text.15')], ['13:00', tx('REQ-03.text.14')], ['14:00', tx('REQ-03.text.13')], ['15:00', tx('REQ-03.text.12')]];
const ENTRY_SUM = { ALLOWED_WHEN_ABSENT: tx('REQ-05.ALLOWEDWHENABSENT'), ONLY_WHEN_PRESENT: tx('REQ-05.ONLYWHENPRESENT') };

const radios = (name, map, order) => `<div class="opts" role="radiogroup" aria-labelledby="q">${(order ?? Object.keys(map)).map((k) => `<label class="opt"><input type="radio" name="${name}" value="${k}" data-bind="${name}" data-live>${map[k]}</label>`).join('')}</div>`;
function dayList(more) {
  const n = more ? 14 : 7, base = today();
  return Array.from({ length: n }, (_, i) => {
    const d = addDays(base, i), w = new Date(`${d}T12:00:00`).getDay();
    const label = i < 2 ? `<b>${i ? tx('REQ-03.from.2') : tx('REQ-03.from')}</b> ${fmt.mdw(d)}` : `<b>${tx('REQ-03.b', { v: WEEK[w] })}</b> ${fmt.md(d)}`;
    return `<label class="opt"><input type="radio" name="day" value="${d}" data-bind="day" data-live><span>${label}</span></label>`;
  }).join('');
}
const stepOk = (k) => ({ body: !!view.body?.trim(), entry: !!view.entry, day: !!view.day, time: !!view.time, dest: !!view.dest?.trim(), ret: !!view.ret, item: !!view.item, pickup: !!view.pickup })[k];

function screen03(params) {
  const type = STEPS[params.type] ? params.type : 'OTHER';
  const steps = STEPS[type], n = +view.step || 1, key = steps[n - 1];
  let q = '', inner = '', full = '';
  if (key === 'body') {
    q = BODY_Q[type][0];
    inner = `<div class="field"><label class="sr-only" for="f1">${q}</label><textarea id="f1" class="input" name="body" data-bind="body" data-live></textarea><p class="hint">${BODY_Q[type][1]}</p></div>`;
  } else if (key === 'entry') { q = tx('REQ-03.text.11'); inner = radios('entry', ENTRY); }
  else if (key === 'item') { q = tx('REQ-03.text.10'); inner = radios('item', ITEM); }
  else if (key === 'pickup') { q = tx('REQ-03.text.9'); inner = radios('pickup', PICKUP); }
  else if (key === 'day') {
    q = type === 'TRANSPORT' ? tx('REQ-03.text.8') : tx('REQ-03.text.7');
    const hint = type === 'TRANSPORT' ? tx('REQ-03.text.6') : tx('REQ-03.text.5');
    full = `<section class="stack lg"><div class="stack"><h1 id="q" class="t-title3">${q}</h1><p class="t-body-lg">${hint}</p></div><div class="opts days" role="radiogroup" aria-labelledby="q">${dayList(view.more)}</div>${view.more ? '' : `<button class="btn btn-ghost btn-md back" type="button" data-set="more=1">${tx('REQ-03.btn')}</button>`}</section>`;
  } else if (key === 'time') {
    q = tx('REQ-03.text.4');
    full = `<section class="stack lg"><div class="stack"><h1 id="q" class="t-title3">${q}</h1><p class="t-body-lg muted">${view.day ? fmt.mdw(view.day) : ''}</p></div><div class="chips" role="group" aria-labelledby="q">${TIMES.map(([v, l]) => `<button class="chip" type="button" data-set="time=${v}" aria-pressed="${view.time === v}">${l}</button>`).join('')}</div></section>`;
  } else if (key === 'dest') {
    q = tx('REQ-03.text.3');
    inner = `<div class="field"><label class="sr-only" for="f1">${q}</label><input id="f1" class="input" type="text" name="dest" data-bind="dest" data-live><p class="hint">${tx('REQ-03.p.2')}</p><p class="hint">${tx('REQ-03.p.3')}</p></div>`;
  } else { q = tx('REQ-03.text.2'); inner = radios('ret', RET); }
  const stack = full || `<section class="stack lg" aria-labelledby="q"><h1 id="q" class="t-title3">${q}</h1>${inner}</section>`;
  const nextLabel = tx('REQ-03.text');
  return {
    foot: foot(false),
    main: `${n === 1 ? back(href('REQ-01')) : backSet(`step=${n - 1}`)}
      <div class="step-meta"><p class="t-label-lg muted">${tx('REQ-03.p', { n, length: steps.length })}</p><div class="progress" role="progressbar" aria-label="${tx('REQ-03.p', { n, length: steps.length })}" aria-valuemin="0" aria-valuemax="${steps.length}" aria-valuenow="${n}"><span style="width: ${Math.round((n / steps.length) * 100)}%;"></span></div></div>
      ${stack}
      <button class="btn btn-primary btn-block" type="button" data-act="req.next" data-type="${type}"${stepOk(key) ? '' : ' disabled'}>${nextLabel}</button>`,
  };
}

function draftFromView(type) {
  const d = { type, body: view.body?.trim() ?? '', entry: view.entry, item: view.item, pickup: view.pickup, day: view.day, time: view.time, dest: view.dest?.trim(), ret: view.ret };
  return d;
}
function pickupIso(pk) { return pk === 'TODAY_PM' ? `${today()}T14:00:00` : `${addDays(today(), 1)}T10:00:00`; }

// --- 올리기 전 확인과 올린 뒤 ---
function screen05() {
  const s = S(), d = s.draft, id = residentId();
  if (view.sent) return { foot: foot(false), main: `<section class="stack lg" aria-label="${tx('REQ-05.ariaLabel.2')}"><div class="alert alert-ok" role="status">${ic('check')}<div class="stack" style="gap: 4px;"><h1 class="t-heading2">${tx('REQ-05.h1.2')}</h1><p class="t-body-lg">${tx('REQ-05.p.2')}</p></div></div><p class="t-body-lg">${tx('REQ-05.p.3')}</p><a class="btn btn-primary btn-block" href="${href('REQ-01')}">${tx('REQ-05.btn.4')}</a></section>` };
  if (!d) return { foot: foot(false), main: `<h1 class="t-title3">${tx('REQ-05.h1')}</h1><a class="btn btn-primary btn-block" href="${href('REQ-01')}">${tx('REQ-05.btn.3')}</a>` };
  const fee = d.type === 'LAUNDRY' && d.item === 'BEDDING' ? 'LAUNDRY_BEDDING' : null;
  if (fee && !d.costOk) {
    const proxy = Object.values(PERSONAS).find((p) => p.key === 'PROXY' && p.residentId === id);
    return { foot: foot(false), main: `<h1 class="t-title3">${tx('REQ-05.h1.3')}</h1><section class="card" aria-label="${tx('REQ-05.ariaLabel.3')}"><div class="stack" style="gap: 4px;"><p class="t-body-lg muted">${tx('REQ-05.p.4', { member: FEE_LABEL[fee].member })}</p><p class="t-number-lg">${fmt.won(priceOf(fee))}</p></div><p class="t-body-lg">${tx('REQ-05.p.5')}</p>${proxy ? `<p class="t-body-lg">${tx('REQ-05.p', { name: proxy.name })}</p>` : ''}<div class="stack"><button class="btn btn-primary btn-block" type="button" data-act="req.cost" data-ok="1">${tx('REQ-05.btn.5')}</button><button class="btn btn-secondary btn-block" type="button" data-act="req.cost" data-ok="0">${tx('REQ-05.btn.6')}</button></div></section>` };
  }
  const kv = [[tx('REQ-05.text'), TYPE_MEMBER[d.type]]];
  if (d.type === 'REPAIR') kv.push([tx('REQ-05.push'), d.body], [tx('REQ-05.push.10'), ENTRY_SUM[d.entry]]);
  else if (d.type === 'CLEANING') kv.push([tx('REQ-05.push'), d.body], [tx('REQ-05.push.7'), fmt.mdw(d.day)]);
  else if (d.type === 'LAUNDRY') kv.push([tx('REQ-05.push.9'), ITEM[d.item]], [tx('REQ-05.push.8'), PICKUP[d.pickup]]);
  else if (d.type === 'TRANSPORT') kv.push([tx('REQ-05.push.7'), fmt.mdw(d.day)], [tx('REQ-05.push.6'), fmt.ampm(`${d.day}T${d.time}:00`)], [tx('REQ-05.push.5'), d.dest], [tx('REQ-05.push.4'), d.ret === 'YES' ? tx('REQ-05.push.3') : tx('REQ-05.push.2')]);
  else kv.push([tx('REQ-05.push'), d.body]);
  return {
    foot: foot(false),
    main: `<h1 class="t-title3">${tx('REQ-05.title')}</h1>
      <section class="card" aria-label="${tx('REQ-05.ariaLabel')}"><dl class="kv wide">${kv.map(([k, v]) => `<dt>${k}</dt><dd class="t-body-lg">${esc(v)}</dd>`).join('')}</dl></section>
      <div class="stack action-bar"><button class="btn btn-primary btn-block" type="button" data-act="req.send">${tx('REQ-05.btn')}</button><a class="btn btn-secondary btn-block" href="${href('REQ-03', { type: d.type })}">${tx('REQ-05.btn.2')}</a></div>`,
  };
}

// --- 상세와 확인 ---
function screen07(params) {
  const r = getReq(params.id), c = r && cur(r);
  if (!c?.status || r.residentId !== residentId()) return { foot: foot(false), main: denied(tx('REQ-07.denied.2'), tx('REQ-07.denied'), href('REQ-01')) };
  const kind = TYPE_MEMBER[c.type], bodyText = bodyMember(r, c);
  const cancelDialog = view.dialog === 'cancel' ? dialog(tx('REQ-07.dialog'), '', `<button class="btn btn-secondary btn-md" type="button" data-set="dialog=">${tx('REQ-07.btn.9')}</button><button class="btn btn-secondary btn-md" type="button" data-act="req.cancel" data-id="${r.id}">${tx('REQ-07.btn.10')}</button>`) : '';
  const rec = `<div class="stack"><h2 class="t-heading2">${tx('REQ-07.h2')}</h2><div>${timeline(r, 'MEMBER')}</div></div>`;
  const crumb = `<p class="t-body-lg muted">${kind} · ${esc(bodyText)}</p>`;
  const staffer = c.assignee ? `<dl class="kv inline"><dt>${tx('REQ-07.dt')}</dt><dd class="t-body-lg">${tx('REQ-07.dd', { nameOf: nameOf(c.assignee) })}</dd></dl>` : '';
  // 확인하기(REQ-08) 컷
  if (c.status === 'DONE' || view.just) {
    if (view.just === 'confirmed') return { foot: foot(false), main: `<section class="stack lg" aria-label="${tx('REQ-07.ariaLabel.3')}"><div class="alert alert-ok" role="status">${ic('check')}<div class="stack" style="gap: 4px;"><h1 class="t-heading2">${tx('REQ-07.h1.5')}</h1><p class="t-body-lg">${r.feeCode ? `${tx('REQ-07.text.7', { member: FEE_LABEL[r.feeCode].member, won: fmt.won(priceOf(r.feeCode)) })}` : tx('REQ-07.main')}</p></div></div><a class="btn btn-primary btn-block" href="${href('REQ-01')}">${tx('REQ-07.btn.8')}</a></section>` };
    if (view.just === 'notyet') return { foot: foot(false), main: `<section class="stack lg" aria-label="${tx('REQ-07.ariaLabel.2')}"><div class="alert alert-ok" role="status">${ic('check')}<div class="stack" style="gap: 4px;"><h1 class="t-heading2">${tx('REQ-07.h1.4')}</h1><p class="t-body-lg">${tx('REQ-07.p.6', { nameOf: nameOf(c.assignee) })}</p></div></div><a class="btn btn-primary btn-block" href="${href('REQ-01')}">${tx('REQ-07.btn.8')}</a></section>` };
    const did = `<p class="t-body-lg"><b class="strong">${tx('REQ-07.b', { nameOf: nameOf(c.assignee) })}</b> ${esc(doneText(r, c, 'MEMBER'))}</p>`;
    if (view.notyet) {
      const noteBox = c.type === 'HOSPITAL_ESCORT' ? '' : `<div class="field"><label for="nf">${tx('REQ-07.label')}</label><textarea id="nf" class="input" name="note" data-bind="note"></textarea><p class="hint">${tx('REQ-07.p.5')}</p></div>`;
      return { foot: foot(false), main: `<h1 class="t-title3">${tx('REQ-07.h1.3')}</h1><section class="card" aria-label="${tx('REQ-07.btn.5')}">${did}${noteBox}<div class="stack"><button class="btn btn-primary btn-block" type="button" data-act="req.notyet" data-id="${r.id}">${tx('REQ-07.btn.6')}</button><button class="btn btn-secondary btn-block" type="button" data-set="notyet=">${tx('REQ-07.btn.7')}</button></div></section>` };
    }
    return { foot: foot(false), main: `<h1 class="t-title3">${tx('REQ-07.h1.3')}</h1><section class="card" aria-label="${tx('REQ-07.ariaLabel')}">${crumb}${did}<p class="t-heading2">${tx('REQ-07.p.3')}</p><div class="stack"><button class="btn btn-primary btn-block" type="button" data-act="req.confirm" data-id="${r.id}">${tx('REQ-07.btn.4')}</button><button class="btn btn-secondary btn-block" type="button" data-set="notyet=1">${tx('REQ-07.btn.5')}</button></div></section><p class="t-body-lg">${tx('REQ-07.p.4')}</p>` };
  }
  // 다른 사람이 올린 요청 표시
  const first = r.trans[0];
  const canCancel = ['RECEIVED', 'PENDING_MEMBER_OK'].includes(c.status);
  let banner = '';
  if (r.source === 'STAFF_ENTRY') banner = r.heardVia === 'IN_PERSON' ? `${tx('REQ-07.text.6', { nameOf: nameOf(first.by) })}` : `${tx('REQ-07.text.5', { nameOf: nameOf(first.by) })}`;
  else if (r.source === 'GUARDIAN_PORTAL') banner = c.status === 'PENDING_MEMBER_OK' ? `${tx('REQ-07.text.4', { relName: relName(first.by), kind })}` : (canCancel ? `${tx('REQ-07.text.3', { relName: relName(first.by) })}` : `${tx('REQ-07.text.2', { relName: relName(first.by) })}`);
  else if (r.source === 'ASSISTANT_HANDOFF') banner = `${tx('REQ-07.text', { body: r.body })}`;
  const alert = banner ? `<div class="alert">${ic('users')}<p class="t-body-lg">${esc(banner)}</p></div>` : '';
  if (c.status === 'PENDING_MEMBER_OK') {
    const code = r.feeCode;
    return { foot: foot(false), overlay: cancelDialog, main: `${back(href('REQ-01'))}<section class="card" aria-labelledby="dh">${alert}<div class="stack"><h1 id="dh" class="t-heading1">${tx('REQ-07.h1.2')}</h1><div class="stack" style="gap: 4px;"><p class="t-body-lg muted">${FEE_LABEL[code].unit}</p><p class="t-number-lg">${fmt.won(priceOf(code))}</p></div></div>${rec}<div class="stack"><button class="btn btn-primary btn-block" type="button" data-act="req.answer" data-id="${r.id}" data-ok="1">${tx('REQ-07.btn.2')}</button><button class="btn btn-secondary btn-block" type="button" data-act="req.answer" data-id="${r.id}" data-ok="0">${tx('REQ-07.btn.3')}</button></div></section>` };
  }
  const head = c.status === 'RECEIVED' && !c.assignee
    ? `<div class="stack">${crumb}<h1 id="dh" class="t-heading1">${tx('REQ-07.h1')}</h1><p class="t-body-lg">${tx('REQ-07.p.2')}</p></div>`
    : `<div class="stack">${crumb}<h1 id="dh" class="t-heading1">${esc(stateMember(r, c))}</h1></div>`;
  const tail = canCancel ? `<button class="btn btn-secondary btn-block" type="button" data-set="dialog=cancel">${tx('REQ-07.btn')}</button>`
    : (c.status === 'IN_PROGRESS' || c.status === 'ON_HOLD' ? `<p class="t-body-lg">${tx('REQ-07.p')}</p>` : '');
  return { foot: foot(false), overlay: cancelDialog, main: `${back(href('REQ-01'))}<section class="card" aria-labelledby="dh">${alert}${head}${c.status === 'RECEIVED' && !c.assignee ? '' : staffer}${rec}${tail}</section>` };
}

// --- 정기 청소 ---
function screen09() {
  const id = residentId(), task = taskOf(id);
  if (!task) return { foot: foot(false), main: `<h1 class="t-title3">${tx('REQ-09.title')}</h1>${empty(tx('REQ-09.empty'))}` };
  const days = task.rule.kind === 'MONTHLY_DAY' ? '' : task.rule.days.map((d) => `${tx('REQ-09.text.6', { v: WEEK[d] })}`).join(', ');
  const t0 = today(), occToday = S().occ.find((o) => o.taskId === task.id && o.residentId === id && o.date === t0);
  let todayLine = '';
  if (occToday?.status === 'DONE') todayLine = `<div class="row between" style="gap: 8px;"><p class="t-body-lg">${tx('REQ-09.p.7', { nameOf: nameOf(occToday.assignee) })}</p><button class="btn btn-ghost btn-md rowact" type="button" data-act="req.followUp" data-id="${occToday.id}">${tx('REQ-09.btn.7')}</button></div>`;
  else if (occToday?.status === 'MISSED') todayLine = `<p class="t-body-lg">${occToday.missedReason === 'NOT_HOME' ? tx('REQ-09.text.5') : occToday.missedReason === 'MEMBER_LATER' ? tx('REQ-09.text.4') : tx('REQ-09.text.3')}</p>`;
  else if (occToday?.skipReason === 'ABSENCE') todayLine = `<p class="t-body-lg">${tx('REQ-09.p.6')}</p>`;
  const next = nextRuleDate(task, t0);
  const open = !!next && skipCutoff(task, next) > nowISO();
  const skipped = next && skipOf(task, id, next);
  const hint = `<p class="hint">${tx('REQ-09.p.5')}</p>`;
  let after = `<h2 id="rc" class="t-heading1">${task.rule.kind === 'MONTHLY_DAY' ? tx('REQ-09.h2.2', { day: task.rule.day }) : tx('REQ-09.h2', { days })}</h2>${todayLine}`;
  if (skipped) {
    let n2 = nextRuleDate(task, next);
    while (n2 && skipOf(task, id, n2)) n2 = nextRuleDate(task, n2);
    after += `<div class="alert alert-ok" role="status">${ic('check')}<div class="stack" style="gap: 4px;"><p class="t-heading2">${tx('REQ-09.p.3', { mdw: fmt.mdw(next) })}</p><p class="t-body-lg">${tx('REQ-09.p.4', { v: n2 ? fmt.mdw(n2) : '' })}</p></div></div>${hint}`;
    after += open ? `<button class="btn btn-secondary btn-block" type="button" data-set="dialog=unskip">${tx('REQ-09.btn.6')}</button>` : `<p class="t-body-lg">${tx('REQ-09.p.2')}</p>`;
  } else if (next) {
    after += `<dl class="kv wide"><dt>${tx('REQ-09.dt')}</dt><dd class="t-body-lg">${fmt.mdw(next)}</dd></dl>`;
    after += open ? `${hint}<button class="btn btn-primary btn-block" type="button" data-set="dialog=skip">${tx('REQ-09.btn.5')}</button>` : `<p class="t-body-lg">${tx('REQ-09.p')}</p>`;
  }
  let overlay = '';
  if (view.dialog === 'skip' && next) overlay = dialog(`${tx('REQ-09.text.2', { mdw: fmt.mdw(next) })}`, '', `<button class="btn btn-secondary" type="button" data-set="dialog=">${tx('REQ-09.btn.3')}</button><button class="btn btn-secondary" type="button" data-act="req.skip">${tx('REQ-09.btn.4')}</button>`);
  if (view.dialog === 'unskip' && next) overlay = dialog(`${tx('REQ-09.text', { mdw: fmt.mdw(next) })}`, '', `<button class="btn btn-secondary" type="button" data-set="dialog=">${tx('REQ-09.btn')}</button><button class="btn btn-secondary" type="button" data-act="req.unskip">${tx('REQ-09.btn.2')}</button>`);
  return { foot: foot(false), overlay, main: `<h1 class="t-title3">${tx('REQ-09.title')}</h1><section class="card" aria-labelledby="rc">${after}</section>` };
}

// --- 행동 ---
const mustMember = () => { if (me().key !== 'MEMBER') refuse(tx('requests.mustMember.refuse')); };
export const homeActions = {
  'req.next': (a) => {
    mustMember();
    const steps = STEPS[a.type], n = +view.step || 1, key = steps[n - 1];
    if (!stepOk(key)) return;
    if (key === 'time' && view.day === today() && `${view.day}T${view.time}:00` <= nowISO()) refuse(tx('requests.action.refuse.3'));
    if (n < steps.length) { view.step = n + 1; return; }
    S().draft = draftFromView(a.type);
    view.step = 1;
    go('REQ-05');
  },
  'req.cost': (a) => { if (a.ok === '1') S().draft.costOk = true; else { S().draft = null; go('REQ-01'); } },
  'req.send': () => {
    mustMember();
    const d = S().draft;
    if (!d || view.sent) return;
    const o = { residentId: residentId(), type: d.type, source: 'RESIDENT_APP', body: d.body, details: {} };
    if (d.type === 'REPAIR') o.details = { entry: d.entry };
    else if (d.type === 'CLEANING') o.preferredAt = `${d.day}T09:00:00`;
    else if (d.type === 'LAUNDRY') {
      o.body = `${tx('requests.action.text.3', { v: d.item === 'BEDDING' ? tx('requests.action.reqSend') : ITEM[d.item], v2: PICKUP[d.pickup] })}`;
      o.details = { item: d.item, pickup: d.pickup };
      o.pickupAt = pickupIso(d.pickup);
      if (d.item === 'BEDDING') o.feeCode = 'LAUNDRY_BEDDING';
    } else if (d.type === 'TRANSPORT') {
      o.details = { rideAt: `${d.day}T${d.time}:00`, dest: d.dest, ret: d.ret === 'YES' };
      o.preferredAt = o.details.rideAt;
    }
    createReq(o);
    S().draft = null;
    view.sent = true;
  },
  'req.confirm': (a) => { const r = own(getReq(a.id)); confirm(r, false); view.just = 'confirmed'; },
  'req.notyet': (a) => { const r = own(getReq(a.id)); notYet(r, view.note, false); view.just = 'notyet'; view.notyet = ''; },
  'req.cancel': (a) => { cancel(own(getReq(a.id))); view.dialog = ''; },
  'req.answer': (a) => { mustMember(); own(getReq(a.id)); memberAnswer(getReq(a.id), a.ok === '1', false); },
  'req.skip': () => {
    mustMember();
    const id = residentId(), task = taskOf(id), next = task && nextRuleDate(task, today());
    if (!next) return;
    if (skipCutoff(task, next) <= nowISO()) refuse(tx('requests.action.refuse.2'));
    const s = S();
    s.skips.push({ id: `K-${s.skips.length + 1}`, taskId: task.id, residentId: id, date: next, by: me().id, at: nowISO(), cancelled: false });
    const o = s.occ.find((x) => x.taskId === task.id && x.residentId === id && x.date === next && x.status === 'SCHEDULED');
    if (o) { o.status = 'SKIPPED'; o.skipReason = 'MEMBER_REQUEST'; }
    view.dialog = '';
  },
  'req.unskip': () => {
    mustMember();
    const id = residentId(), task = taskOf(id), next = task && nextRuleDate(task, today());
    const k = next && skipOf(task, id, next);
    if (!k) return;
    if (skipCutoff(task, next) <= nowISO()) refuse(tx('requests.action.refuse'));
    k.cancelled = true;
    const o = S().occ.find((x) => x.taskId === task.id && x.residentId === id && x.date === next && x.skipReason === 'MEMBER_REQUEST');
    if (o) { o.status = 'SCHEDULED'; o.skipReason = null; }
    view.dialog = '';
    toast(`${tx('requests.action.text.2', { mdw: fmt.mdw(next) })}`);
  },
  'req.followUp': (a) => {
    mustMember();
    const o = S().occ.find((x) => x.id === a.id && x.residentId === residentId());
    if (!o || o.status !== 'DONE' || o.followUpId) return;
    const r = createReq({ residentId: o.residentId, type: 'CLEANING', source: 'RESIDENT_APP', body: tx('requests.action.body'), preferredAt: `${today()}T09:00:00`, details: { occurrenceId: o.id } });
    o.followUpId = r.id;
    toast(`${tx('requests.action.text', { nameOf: nameOf(o.assignee) })}`);
  },
};

export const homeScreens = {
  'REQ-01': { app: 'home', title: tx('REQ-01.title'), render: screen01 },
  'REQ-03': { app: 'home', title: tx('REQ-03.title'), render: screen03 },
  'REQ-05': { app: 'home', title: tx('REQ-05.title'), render: screen05 },
  'REQ-07': { app: 'home', title: tx('REQ-07.title'), render: screen07 },
  'REQ-09': { app: 'home', title: tx('REQ-09.title'), render: screen09 },
};
