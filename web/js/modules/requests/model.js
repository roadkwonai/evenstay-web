// 생활 요청(N1) 상태와 전이. 화면은 이 파일의 함수만 부른다. 상태 판단은 영문 코드로 한다.
import { tx } from '../../lib/text.js';
import { api, db, fmt, me, nowISO, refuse, sms, toast } from '../../lib/kit.js';
import { PERSONAS, RESIDENTS } from '../../lib/people.js';

export const S = () => db.requests;

// --- 이름표(코드 → 화면 글자) ---
export const TYPE_STAFF = { REPAIR: tx('requests.TYPE_STAFF.REPAIR'), CLEANING: tx('requests.TYPE_STAFF.CLEANING'), LAUNDRY: tx('requests.TYPE_STAFF.LAUNDRY'), TRANSPORT: tx('requests.TYPE_STAFF.TRANSPORT'), HOSPITAL_ESCORT: tx('requests.TYPE_STAFF.HOSPITALESCORT'), FEEDBACK: tx('requests.TYPE_STAFF.FEEDBACK'), OTHER: tx('requests.TYPE_STAFF.OTHER'), INSPECTION: tx('requests.TYPE_STAFF.INSPECTION') };
export const TYPE_FILTER = { REPAIR: tx('requests.TYPE_FILTER.REPAIR'), CLEANING: tx('requests.TYPE_FILTER.CLEANING'), LAUNDRY: tx('requests.TYPE_FILTER.LAUNDRY'), TRANSPORT: tx('requests.TYPE_FILTER.TRANSPORT'), HOSPITAL_ESCORT: tx('requests.TYPE_FILTER.HOSPITALESCORT'), FEEDBACK: tx('requests.TYPE_FILTER.FEEDBACK'), OTHER: tx('requests.TYPE_FILTER.OTHER'), INSPECTION: tx('requests.TYPE_FILTER.INSPECTION') };
export const TYPE_MEMBER = { REPAIR: tx('requests.TYPE_MEMBER.REPAIR'), CLEANING: tx('requests.TYPE_MEMBER.CLEANING'), LAUNDRY: tx('requests.TYPE_MEMBER.LAUNDRY'), TRANSPORT: tx('requests.TYPE_MEMBER.TRANSPORT'), HOSPITAL_ESCORT: tx('requests.TYPE_MEMBER.HOSPITALESCORT'), FEEDBACK: tx('requests.TYPE_MEMBER.FEEDBACK'), OTHER: tx('requests.TYPE_MEMBER.OTHER'), INSPECTION: tx('requests.TYPE_MEMBER.INSPECTION') };
export const TEAM_LABEL = { FRONT: tx('requests.TEAM_LABEL.FRONT'), FACILITY: tx('requests.TEAM_LABEL.FACILITY'), HOUSEKEEPING: tx('requests.TEAM_LABEL.HOUSEKEEPING'), DRIVER: tx('requests.TEAM_LABEL.DRIVER'), LIFE_SUPPORT: tx('requests.TEAM_LABEL.LIFESUPPORT') };
export const HOLD_STAFF = { PARTS: tx('requests.HOLD_STAFF.PARTS'), VENDOR: tx('requests.HOLD_STAFF.VENDOR'), RESIDENT_DATE: tx('requests.HOLD_STAFF.RESIDENTDATE'), RESIDENT_TIME: tx('requests.HOLD_STAFF.RESIDENTTIME') };
export const HOLD_MEMBER = { PARTS: tx('requests.HOLD_MEMBER.PARTS'), VENDOR: tx('requests.HOLD_MEMBER.VENDOR'), RESIDENT_DATE: tx('requests.HOLD_MEMBER.RESIDENTDATE'), RESIDENT_TIME: tx('requests.HOLD_MEMBER.RESIDENTTIME') };
export const DECLINE_STAFF = { OUT_OF_SCOPE: tx('requests.DECLINE_STAFF.OUTOFSCOPE'), DUPLICATE: tx('requests.DECLINE_STAFF.DUPLICATE'), RESIDENT_WITHDREW: tx('requests.DECLINE_STAFF.RESIDENTWITHDREW'), NOT_OFFERED: tx('requests.DECLINE_STAFF.NOTOFFERED') };
export const DECLINE_MEMBER = {
  OUT_OF_SCOPE: tx('requests.DECLINE_MEMBER.OUTOFSCOPE'),
  DUPLICATE: tx('requests.DECLINE_MEMBER.DUPLICATE'),
  RESIDENT_WITHDREW: tx('requests.DECLINE_MEMBER.RESIDENTWITHDREW'),
  NOT_OFFERED: tx('requests.DECLINE_MEMBER.NOTOFFERED'),
};
export const ESCORT_DONE = { ESCORTED_BOTH_WAYS: tx('requests.ESCORT_DONE.ESCORTEDBOTHWAYS'), ESCORTED_ONE_WAY: tx('requests.ESCORT_DONE.ESCORTEDONEWAY') };
export const ESCORT_DONE_STAFF = { ESCORTED_BOTH_WAYS: tx('requests.ESCORT_DONE_STAFF.ESCORTEDBOTHWAYS'), ESCORTED_ONE_WAY: tx('requests.ESCORT_DONE_STAFF.ESCORTEDONEWAY') };
export const MISSED_STAFF = { NOT_HOME: tx('requests.MISSED_STAFF.NOTHOME'), MEMBER_LATER: tx('requests.MISSED_STAFF.MEMBERLATER'), STAFF: tx('requests.MISSED_STAFF.STAFF') };
export const FEE_LABEL = { LAUNDRY_BEDDING: { staff: tx('requests.FEE_LABEL.staff'), member: tx('requests.FEE_LABEL.member'), unit: tx('requests.FEE_LABEL.unit') } };
export const ACTIVE = ['RECEIVED', 'IN_PROGRESS', 'ON_HOLD'];
export const OPEN = [...ACTIVE, 'DONE'];
export const CLOSED = ['CONFIRMED', 'AUTO_CLOSED', 'CANCELLED', 'DECLINED', 'MOVED_TO_SAFETY'];
export const STAFF_KEYS = ['FRONT', 'LIFE', 'CARE', 'STAFF', 'MANAGER', 'HQ_ADMIN', 'HQ_OPS'];
export const WEEK = tx('requests.WEEK.text');

// --- 시각 ---
const p2 = (n) => String(n).padStart(2, '0');
export const isoOf = (d) => fmt.stamp(d).replace(' ', 'T');
export const addH = (iso, h) => isoOf(new Date(new Date(iso).getTime() + h * 36e5));
export const addDays = (ymd, n) => fmt.ymd(new Date(new Date(`${ymd}T12:00:00`).getTime() + n * 864e5));
export const today = () => nowISO().slice(0, 10);

/** 직원 화면 시각. 오늘이면 시:분, 아니면 월/일 시:분 */
export const stamp = (iso) => (iso.slice(0, 10) === today() ? iso.slice(11, 16) : `${iso.slice(5, 7)}/${iso.slice(8, 10)} ${iso.slice(11, 16)}`);
export const slashMd = (iso) => `${iso.slice(5, 7)}/${iso.slice(8, 10)}`;
export const memberWhen = (iso, withDate) => (withDate ? `${fmt.md(iso)} ${fmt.ampm(iso)}` : fmt.ampm(iso));
export const nameOf = (pid) => PERSONAS[pid]?.name ?? '';
export const resOf = (id) => RESIDENTS[id] ?? { id, name: '', room: '' };

// --- 사람과 팀 ---
export const teamsOf = (pid) => Object.keys(S().teams).filter((t) => S().teams[t].includes(pid));
export const isMgr = (p = me()) => p.key === 'MANAGER';
export const isFront = (p = me()) => isMgr(p) || S().teams.FRONT.includes(p.id);
export const isHq = (p = me()) => p.key === 'HQ_ADMIN' || p.key === 'HQ_OPS';
export const canStaff = (p = me()) => STAFF_KEYS.includes(p.key);
export const kindOf = (by) => (by === 'SYSTEM' ? 'SYSTEM' : (PERSONAS[by]?.key ?? 'MEMBER'));

// --- 현재 상태 계산. 전이 기록(trans)을 시각까지 접는다. ---
export function cur(r) {
  const now = nowISO();
  const o = { status: null, assignee: null, reopen: 0, holdReason: null, holdDate: null, holdNote: '', doneNote: '', doneAt: null, closedAt: null, declineReason: null, type: r.type, team: r.team, dueAt: r.dueAt, completions: 0, reopenNote: '', reopenAt: null, assignedAt: null, mergedInto: null, cancelledBy: null };
  for (const t of r.trans) {
    if (t.at > now) continue;
    switch (t.act) {
      case 'CREATE': o.status = t.pending ? 'PENDING_MEMBER_OK' : 'RECEIVED'; break;
      case 'CLASSIFY': o.type = t.type; o.team = t.team; o.dueAt = t.dueAt; break;
      case 'ASSIGN': o.assignee = t.to; o.assignedAt = t.at; break;
      case 'START': o.status = 'IN_PROGRESS'; if (t.to) { o.assignee = t.to; o.assignedAt = t.at; } break;
      case 'HOLD': o.status = 'ON_HOLD'; o.holdReason = t.reason; o.holdDate = t.date ?? null; o.holdNote = t.note ?? ''; break;
      case 'RESUME': o.status = 'IN_PROGRESS'; break;
      case 'COMPLETE': o.status = 'DONE'; o.doneNote = t.note; o.doneAt = t.at; o.completions += 1; break;
      case 'CONFIRM': o.status = 'CONFIRMED'; o.closedAt = t.at; break;
      case 'NOT_YET': o.status = 'IN_PROGRESS'; o.reopen += 1; o.reopenNote = t.note ?? ''; o.reopenAt = t.at; break;
      case 'AUTO_CLOSE': o.status = 'AUTO_CLOSED'; o.closedAt = t.at; break;
      case 'DECLINE': o.status = 'DECLINED'; o.declineReason = t.reason; o.mergedInto = t.mergedInto ?? null; o.closedAt = t.at; break;
      case 'MOVE_TO_SAFETY': o.status = 'MOVED_TO_SAFETY'; o.closedAt = t.at; break;
      case 'ACCEPT': o.status = 'RECEIVED'; break;
      case 'CANCEL': case 'MEMBER_DECLINE': case 'EXPIRE': o.status = 'CANCELLED'; o.closedAt = t.at; o.cancelledBy = t.act === 'EXPIRE' ? 'SYSTEM' : kindOf(t.by); break;
      default: break;
    }
  }
  return o;
}
/** 시계까지 보이는 요청만 [{r, c}] */
export const allReqs = () => S().reqs.map((r) => ({ r, c: cur(r) })).filter((x) => x.c.status);
export const getReq = (id) => S().reqs.find((r) => r.id === id);
export const isOverdue = (c) => !!c.dueAt && c.dueAt < nowISO() && ACTIVE.includes(c.status);


// --- 내용 문장 ---
export function ymdParts(iso) { const d = new Date(iso); return { md: `${p2(d.getMonth() + 1)}/${p2(d.getDate())}`, w: WEEK[d.getDay()], hm: fmt.hm(d) }; }
/** 직원 화면 내용 한 줄 */
export function bodyStaff(r, c) {
  if (c.type === 'TRANSPORT' && r.details.rideAt) {
    const q = ymdParts(r.details.rideAt);
    return r.details.ret ? `${tx('requests.bodyStaff.text.4', { md: q.md, w: q.w, hm: q.hm, dest: r.details.dest })}` : `${tx('requests.bodyStaff.text.3', { md: q.md, w: q.w, hm: q.hm, dest: r.details.dest })}`;
  }
  if (c.type === 'HOSPITAL_ESCORT') {
    const q = r.details.rideAt ? ymdParts(r.details.rideAt) : null;
    const when = q ? `${q.md}(${q.w}) ${q.hm}` : (r.details.whenText ?? '');
    return r.details.ret ? `${tx('requests.bodyStaff.text.2', { when })}` : `${tx('requests.bodyStaff.text', { when })}`;
  }
  return r.body ?? '';
}
/** 회원·보호자 화면 내용 한 줄 */
export function bodyMember(r, c) {
  if (c.type === 'TRANSPORT' && r.details.rideAt) return `${fmt.mdw(r.details.rideAt)} ${fmt.ampm(r.details.rideAt)}, ${r.details.dest}`;
  if (c.type === 'HOSPITAL_ESCORT') return fmt.mdw(r.details.rideAt ?? r.createdAt);
  return r.body ?? '';
}
export const doneText = (r, c, viewer) => (c.type === 'HOSPITAL_ESCORT' ? (viewer === 'STAFF' ? ESCORT_DONE_STAFF[c.doneNote] : ESCORT_DONE[c.doneNote]) : c.doneNote);

// --- 요금 ---
export const priceOf = (code) => api.core.priceOf?.(code) ?? S().fees[code];

// --- 요청 만들기 ---
function dueFor(type, base) {
  const row = S().settings.find((x) => x.type === type);
  if (!row) return null;
  if (row.base === 'CREATED') return addH(base.createdAt, row.hours);
  if (row.base === 'PREFERRED') return addH(base.preferredAt ?? base.createdAt, row.hours);
  if (row.base === 'PICKUP') return addH(base.pickupAt ?? base.createdAt, row.hours);
  return `${(base.preferredAt ?? base.createdAt).slice(0, 10)}T23:59:00`;
}
const teamFor = (type) => S().settings.find((x) => x.type === type)?.team ?? null;

/** o: { residentId, type, body, details, source, heardVia, pending, preferredAt, pickupAt, feeCode } */
export function createReq(o) {
  const s = S(), p = me(), at = nowISO();
  s.seq += 1;
  const id = `R-${p2(s.seq)}`;
  const r = {
    id, residentId: o.residentId, room: resOf(o.residentId).room, type: o.type ?? null, team: o.type ? teamFor(o.type) : null, source: o.source, byId: p.id,
    heardVia: o.heardVia ?? null, createdAt: at, body: o.body ?? null, details: o.details ?? {}, preferredAt: o.preferredAt ?? null,
    dueAt: o.type ? dueFor(o.type, { createdAt: at, preferredAt: o.preferredAt, pickupAt: o.pickupAt }) : null,
    feeCode: o.feeCode ?? null, charge: null, handoffId: o.handoffId ?? null,
    trans: [{ at, act: 'CREATE', by: o.source === 'ASSISTANT_HANDOFF' ? 'SYSTEM' : p.id, pending: !!o.pending }],
  };
  s.reqs.push(r);
  return r;
}

// --- 전이 ---
const closedMsg = (c) => (c.status === 'CANCELLED' ? `${tx('requests.closedMsg.text.2', { hm: fmt.hm(c.closedAt) })}` : tx('requests.closedMsg.text'));
const mustBe = (c, list) => { if (!list.includes(c.status)) refuse(CLOSED.includes(c.status) ? closedMsg(c) : tx('requests.mustBe.refuse')); };
const push = (r, act, extra = {}) => r.trans.push({ at: nowISO(), act, by: me().id, ...extra });
const mineOrMgr = (c, p) => isMgr(p) || c.assignee === p.id;

function tellGuardian(r) {
  if (r.source !== 'GUARDIAN_PORTAL' || PERSONAS[r.byId]?.key !== 'GUARDIAN') return;
  sms(nameOf(r.byId), `${tx('requests.tellGuardian.text', { name: resOf(r.residentId).name })}`, 'requests');
}

export function claim(r) {
  const c = cur(r), p = me();
  mustBe(c, ['RECEIVED', 'IN_PROGRESS', 'ON_HOLD']);
  if (c.assignee) refuse(`${tx('requests.claim.text.2', { nameOf: nameOf(c.assignee), hm: fmt.hm(c.assignedAt), nameOf2: nameOf(c.assignee) })}`);
  if (!c.type) refuse(tx('requests.claim.refuse.2'));
  if (!isMgr(p) && !teamsOf(p.id).includes(c.team)) refuse(tx('requests.claim.refuse'));
  const first = !r.trans.some((t) => t.act === 'ASSIGN');
  push(r, 'ASSIGN', { to: p.id, from: null, claim: true });
  if (first) tellGuardian(r);
  toast(`${tx('requests.claim.text', { name: p.name })}`);
}
export function assign(r, to, why) {
  const c = cur(r), p = me();
  mustBe(c, ['RECEIVED', 'IN_PROGRESS', 'ON_HOLD']);
  if (!isFront(p)) refuse(tx('requests.assign.refuse.3'));
  if (!c.type) refuse(tx('requests.assign.refuse.2'));
  if (!to) refuse(tx('requests.assign.refuse'));
  const first = !r.trans.some((t) => t.act === 'ASSIGN');
  push(r, 'ASSIGN', { to, from: c.assignee, why: why || null });
  if (first) tellGuardian(r);
  toast(`${tx('requests.assign.text', { nameOf: nameOf(to) })}`);
}
export function classify(r, type) {
  const c = cur(r);
  mustBe(c, ['RECEIVED']);
  if (c.type) refuse(tx('requests.classify.refuse.2'));
  if (!isFront()) refuse(tx('requests.classify.refuse'));
  push(r, 'CLASSIFY', { type, team: teamFor(type), dueAt: dueFor(type, { createdAt: r.createdAt }) });
  toast(`${tx('requests.classify.text', { v: TEAM_LABEL[teamFor(type)] })}`);
}
export function start(r) {
  const c = cur(r), p = me();
  mustBe(c, ['RECEIVED', 'ON_HOLD']);
  if (!c.type) refuse(tx('requests.start.refuse.3'));
  if (c.status === 'ON_HOLD') {
    if (!mineOrMgr(c, p)) refuse(tx('requests.start.refuse.2'));
    push(r, 'RESUME');
  } else if (c.assignee) {
    if (!mineOrMgr(c, p)) refuse(`${tx('requests.start.text.2', { nameOf: nameOf(c.assignee), nameOf2: nameOf(c.assignee) })}`);
    push(r, 'START');
  } else {
    if (!isMgr(p) && !teamsOf(p.id).includes(c.team)) refuse(tx('requests.start.refuse'));
    push(r, 'START', { to: p.id });
    tellGuardian(r);
  }
  toast(`${tx('requests.start.text', { nameOf: nameOf(cur(r).assignee) })}`);
}
export function hold(r, reason, note) {
  const c = cur(r), p = me();
  mustBe(c, ['RECEIVED', 'IN_PROGRESS']);
  if (!mineOrMgr(c, p)) refuse(tx('requests.hold.refuse.2'));
  if (!reason) refuse(tx('requests.hold.refuse'));
  push(r, 'HOLD', { reason, note: c.type === 'HOSPITAL_ESCORT' ? '' : (note ?? '') });
}
export function complete(r, note) {
  const c = cur(r), p = me();
  mustBe(c, ['IN_PROGRESS']);
  if (!mineOrMgr(c, p)) refuse(tx('requests.complete.refuse.2'));
  if (!note?.trim()) refuse(tx('requests.complete.refuse'));
  push(r, 'COMPLETE', { note: note.trim() });
  tellGuardian(r);
  // 토스트는 한 번에 하나만 보이므로 두 문장을 한 번에 띄운다
  toast([tx('requests.complete.toast'), r.feeCode && tx('requests.complete.text', { staff: FEE_LABEL[r.feeCode].staff, won: fmt.won(priceOf(r.feeCode)) })].filter(Boolean).join(' '));
}
export function decline(r, reason) {
  const c = cur(r), p = me();
  mustBe(c, ACTIVE);
  if (!mineOrMgr(c, p)) refuse(tx('requests.decline.refuse.3'));
  if (!reason) refuse(tx('requests.decline.refuse.2'));
  const first = reason === 'DUPLICATE' ? allReqs().filter((x) => x.r.residentId === r.residentId && x.r.id !== r.id && OPEN.includes(x.c.status) && x.r.createdAt < r.createdAt).sort((a, b) => a.r.createdAt.localeCompare(b.r.createdAt))[0] : null;
  if (reason === 'DUPLICATE' && !first) refuse(tx('requests.decline.refuse'));
  push(r, 'DECLINE', { reason, mergedInto: first?.r.id ?? null });
}
export function moveToSafety(r) {
  const c = cur(r);
  mustBe(c, ACTIVE);
  if (typeof api.safety.registerFromRequest !== 'function') refuse(tx('requests.moveToSafety.refuse.2'));
  try { api.safety.registerFromRequest({ residentId: r.residentId, requestId: r.id, source: 'requests' }); } catch { refuse(tx('requests.moveToSafety.refuse')); }
  push(r, 'MOVE_TO_SAFETY');
  toast(`${tx('requests.moveToSafety.text', { hm: fmt.hm(nowISO()), name: me().name })}`);
}

// 청구 넘김. 요청 종료와 다른 일이라 실패해도 요청은 닫힌 채 둔다.
function handoff(r) {
  if (!r.feeCode || r.charge) return;
  r.charge = { status: 'PENDING', month: nowISO().slice(5, 7) };
  if (typeof api.core.recordServiceUsage !== 'function') return;
  try {
    api.core.recordServiceUsage({ residentId: r.residentId, item: FEE_LABEL[r.feeCode].member, amount: priceOf(r.feeCode), source: 'requests', sourceId: r.id, sourceLabel: tx('requests.handoff.sourceLabel'), occurredOn: today() });
    r.charge.status = 'SENT';
  } catch { r.charge.status = 'FAILED'; }
}
/** 회원 본인(또는 보호자 대신이 아닌 본인) 확인과 직원 대신 기록 */
export function confirm(r, proxy) {
  const c = cur(r), p = me();
  mustBe(c, ['DONE']);
  if (proxy) { if (!canStaff(p)) refuse(tx('requests.confirm.refuse')); push(r, 'CONFIRM', { heardBy: p.id, heardVia: 'PHONE' }); toast(`${tx('requests.confirm.text', { hm: fmt.hm(nowISO()), name: p.name })}`); } else push(r, 'CONFIRM');
  handoff(r);
}
export function notYet(r, note, proxy) {
  const c = cur(r), p = me();
  mustBe(c, ['DONE']);
  if (proxy) { push(r, 'NOT_YET', { heardBy: p.id, note: '' }); toast(`${tx('requests.notYet.text', { hm: fmt.hm(nowISO()), name: p.name })}`); } else push(r, 'NOT_YET', { note: (note ?? '').trim() });
}
export function cancel(r) {
  const c = cur(r), p = me();
  if (c.status === 'CANCELLED') refuse(tx('requests.cancel.refuse.3'));
  if (CLOSED.includes(c.status)) refuse(closedMsg(c));
  if (p.key === 'MEMBER') {
    if (!['RECEIVED', 'PENDING_MEMBER_OK'].includes(c.status)) refuse(tx('requests.cancel.refuse.2'));
  } else if (!(isFront(p) || mineOrMgr(c, p))) refuse(tx('requests.cancel.refuse'));
  push(r, 'CANCEL');
}
export function memberAnswer(r, ok, proxy) {
  const c = cur(r), p = me();
  mustBe(c, ['PENDING_MEMBER_OK']);
  push(r, ok ? 'ACCEPT' : 'MEMBER_DECLINE', proxy ? { heardBy: p.id } : {});
  if (proxy) toast(ok ? `${tx('requests.memberAnswer.text.2', { name: p.name })}` : `${tx('requests.memberAnswer.text', { name: p.name })}`);
}

// --- 정기 작업 ---
export function residentsList() {
  const l = api.core.residents?.('S1');
  return Array.isArray(l) && l.length ? l : Object.values(RESIDENTS).filter((x) => x.id !== 'R_HANGYEOL');
}
const ruleHits = (rule, ymd) => {
  const d = new Date(`${ymd}T12:00:00`);
  if (rule.kind === 'WEEKLY') return rule.days.includes(d.getDay());
  if (rule.kind === 'MONTHLY_NTH') return d.getDay() === rule.weekday && Math.ceil(d.getDate() / 7) === rule.nth;
  if (rule.kind === 'MONTHLY_DAY') return d.getDate() === rule.day; // shortcut: 29~31일은 그 날이 없는 달에 건너뛴다, 정해진 말이 생기면 바꾼다
  return false;
};
export const taskOf = (resident) => S().tasks.find((t) => t.type === 'CLEANING' && !t.endedOn && ((t.target.kind === 'BUILDING' && resOf(resident).room.startsWith(t.target.building)) || (t.target.kind === 'UNITS' && t.target.rooms.includes(resOf(resident).room))));
/** ymd 다음 날부터 가장 이른 회차 날짜 */
export function nextRuleDate(task, ymd) {
  for (let i = 1; i <= 62; i += 1) { const d = addDays(ymd, i); if (d >= task.startsOn && (!task.endsOn || d <= task.endsOn) && ruleHits(task.rule, d)) return d; }
  return null;
}
export const skipOf = (task, residentId, ymd) => S().skips.find((k) => k.taskId === task.id && k.residentId === residentId && k.date === ymd && !k.cancelled);
export const skipCutoff = (task, ymd) => `${addDays(ymd, -task.skipCutoff.daysBefore)}T${task.skipCutoff.time}:00`;

/** 시계가 앞으로 가면 그 사이에 생길 회차와 닫힘을 따라잡는다 */
export function catchUp() {
  const s = S(), now = nowISO(), t0 = today();
  for (const t of s.tasks) {
    if (t.endedOn) continue;
    for (let d = addDays(t.generatedThrough, 1); d <= t0; d = addDays(d, 1)) {
      if (d < t.startsOn || (t.endsOn && d > t.endsOn) || !ruleHits(t.rule, d)) continue;
      const rooms = new Set();
      const targets = t.target.kind === 'COMMON' ? [null] : residentsList().filter((x) => (t.target.kind === 'UNITS' ? t.target.rooms.includes(x.room) : x.room.startsWith(t.target.building)) && !rooms.has(x.room) && rooms.add(x.room));
      for (const x of targets) {
        if (s.occ.some((o) => o.taskId === t.id && o.date === d && o.room === (x?.room ?? null))) continue;
        let status = 'SCHEDULED', skipReason = null;
        if (x && skipOf(t, x.id, d)) { status = 'SKIPPED'; skipReason = 'MEMBER_REQUEST'; }
        else if (x && api.core.isAbsent?.(x.id, `${d}T12:00:00`)) { status = 'SKIPPED'; skipReason = 'ABSENCE'; }
        s.occSeq += 1;
        s.occ.push({ id: `O-${p2(s.occSeq)}`, taskId: t.id, name: t.name, date: d, residentId: x?.id ?? null, room: x?.room ?? null, status, skipReason, assignee: t.assignee, doneAt: null, doneBy: null, missedReason: null, followUpId: null });
      }
    }
    if (t0 > t.generatedThrough) t.generatedThrough = t0;
  }
  for (const r of s.reqs) {
    const c = cur(r);
    if (c.status === 'DONE' && addH(c.doneAt, 168) <= now && !r.trans.some((x) => x.act === 'AUTO_CLOSE')) {
      r.trans.push({ at: addH(c.doneAt, 168), act: 'AUTO_CLOSE', by: 'SYSTEM' });
      handoff(r);
    }
    if (c.status === 'PENDING_MEMBER_OK' && addH(r.createdAt, 168) <= now && !r.trans.some((x) => x.act === 'EXPIRE')) r.trans.push({ at: addH(r.createdAt, 168), act: 'EXPIRE', by: 'SYSTEM' });
  }
}
export const occToday = () => S().occ.filter((o) => o.date === today());

// --- 숫자 ---
export function board() {
  const l = allReqs();
  const occ = occToday();
  return {
    open: l.filter((x) => OPEN.includes(x.c.status)).length,
    unassigned: l.filter((x) => x.c.status === 'RECEIVED' && !x.c.assignee).length,
    overdue: l.filter((x) => isOverdue(x.c)).length,
    todayRoutine: { total: occ.length, done: occ.filter((o) => o.status === 'DONE').length, skipped: occ.filter((o) => o.status === 'SKIPPED').length, missed: occ.filter((o) => o.status === 'MISSED').length },
    asOf: nowISO(), href: '#/REQ-12?view=overdue',
  };
}
export function monthSummary(ym) {
  const l = allReqs(), end = `${ym}-31T23:59:59`;
  const inMonth = l.filter((x) => x.r.createdAt.startsWith(ym));
  const closed = l.filter((x) => x.c.closedAt?.startsWith(ym));
  const byType = {};
  for (const k of Object.keys(TYPE_STAFF)) if (k !== 'HOSPITAL_ESCORT' && k !== 'INSPECTION') byType[k] = { created: inMonth.filter((x) => x.c.type === k).length, closed: closed.filter((x) => x.c.type === k).length };
  const occ = S().occ.filter((o) => o.date.startsWith(ym));
  return {
    created: inMonth.length, closed: closed.length,
    openAtEnd: l.filter((x) => x.r.createdAt <= end && (!x.c.closedAt || x.c.closedAt > end)).length,
    confirmed: closed.filter((x) => x.c.status === 'CONFIRMED').length, autoClosed: closed.filter((x) => x.c.status === 'AUTO_CLOSED').length,
    byType, routine: { total: occ.length, done: occ.filter((o) => o.status === 'DONE').length, skipped: occ.filter((o) => o.status === 'SKIPPED').length, missed: occ.filter((o) => o.status === 'MISSED').length },
  };
}
