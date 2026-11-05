// 안심 알림(B) 상태와 규칙. 화면은 screens.js, 장면 단계는 flow.js.
// 키와 상태 코드는 영문, 화면 문구는 한 문장을 한 템플릿 안에 둔다.
import { tx } from '../../lib/text.js';
import { api, db, emit, fmt, nowISO, refuse } from '../../lib/kit.js';
import { PERSONAS, RESIDENTS } from '../../lib/people.js';

export const S = () => db.safety;

// --- 역할. 알림은 사업장 직원이 맡고, 본사는 보기만 한다(prd 10절). ---
export const ROLES = { view: ['HQ_ADMIN', 'HQ_OPS', 'MANAGER', 'FRONT', 'LIFE', 'CARE'], handle: ['MANAGER', 'FRONT', 'LIFE', 'CARE'], log: ['MANAGER', 'HQ_ADMIN', 'HQ_OPS'], visitWrite: ['LIFE', 'CARE'], front: ['FRONT'],
  // tech-design 6-2: link.edit, config.edit, evacuation.run·assist.set(대행), incident.view
  link: ['HQ_ADMIN', 'HQ_OPS', 'MANAGER', 'FRONT', 'LIFE', 'CARE'], config: ['HQ_ADMIN', 'HQ_OPS', 'MANAGER'], evac: ['MANAGER', 'FRONT', 'LIFE', 'CARE'], incidentView: ['HQ_ADMIN', 'HQ_OPS', 'MANAGER'] };

// --- 코드별 표시 이름 ---
export const SOURCE_LABEL = { BED_SENSOR: tx('safety.SOURCE_LABEL.BEDSENSOR'), CALL_BELL: tx('safety.SOURCE_LABEL.CALLBELL'), ACCESS_LOG: tx('safety.SOURCE_LABEL.ACCESSLOG'), FRONT_CALL: tx('safety.SOURCE_LABEL.FRONTCALL'), VISIT: tx('safety.SOURCE_LABEL.VISIT') };
export const GRADE = { IMMEDIATE: { cls: 'grade-now', icon: 'circle-alert', label: tx('safety.GRADE.label.2') }, CHECK: { cls: 'grade-check', icon: 'triangle-alert', label: tx('safety.GRADE.label') } };
export const LEVEL_LABEL = { 2: tx('safety.LEVEL_LABEL.2'), 3: tx('safety.LEVEL_LABEL.3'), 4: tx('safety.LEVEL_LABEL.4') };
export const ACTS = [
  ['CONFIRMED_OK', tx('safety.ACTS.text.7')], ['ASSISTED', tx('safety.ACTS.text.6')], ['CALLED_NURSE', tx('safety.ACTS.text.5')], ['CALLED_119', tx('safety.ACTS.text.4')],
  ['WENT_TO_HOSPITAL', tx('safety.ACTS.text.3')], ['CALLED_EMERGENCY_CONTACT', tx('safety.ACTS.text.2')], ['DEVICE_CHECK_REQUESTED', tx('safety.ACTS.text')],
];
export const VISIT_LONG = { VISITED: tx('safety.VISIT_LONG.VISITED'), NOT_IN_ROOM: tx('safety.VISIT_LONG.NOTINROOM'), DECLINED: tx('safety.VISIT_LONG.DECLINED') };
export const VISIT_SHORT = { VISITED: tx('safety.VISIT_SHORT.VISITED'), NOT_IN_ROOM: tx('safety.VISIT_SHORT.NOTINROOM'), DECLINED: tx('safety.VISIT_SHORT.DECLINED') };
// shortcut: 부재 때문에 멈추는 출처는 고정 목록이다. 규칙 편집 화면(SAF-11)이 생기면 규칙 안으로 옮긴다.
const PAUSED_BY_ABSENCE = ['BED_SENSOR', 'ACCESS_LOG', 'VISIT'];
// shortcut: 가족 모듈이 없을 때 쓰는 고정 동의(tech-design 10-2 "D 없이 데모할 때").
const FALLBACK_VIEWERS = { R_EUNSOOK: ['g.jimin'] };
const FALLBACK_CONTACTS = { R_EUNSOOK: [{ rank: 1, name: tx('safety.FALLBACK_CONTACTS.name.2'), relation: tx('safety.FALLBACK_CONTACTS.relation') }, { rank: 2, name: tx('safety.FALLBACK_CONTACTS.name'), relation: tx('safety.FALLBACK_CONTACTS.relation') }] };

// --- 시각 도구. db.now와 같은 'YYYY-MM-DDTHH:MM:SS' 문자열이라 사전순이 시간순이다. ---
const p2 = (n) => String(n).padStart(2, '0');
export const dateOf = (iso) => iso.slice(0, 10);
export const hm = (iso) => iso.slice(11, 16);
export const tstr = (iso) => (iso.slice(17, 19) === '00' ? iso.slice(11, 16) : iso.slice(11, 19));
export const isoOf = (d) => `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}T${p2(d.getHours())}:${p2(d.getMinutes())}:${p2(d.getSeconds())}`;
export const addSec = (iso, s) => isoOf(new Date(new Date(iso).getTime() + s * 1000));
export const secBetween = (a, b) => Math.round((new Date(b) - new Date(a)) / 1000);
const addDays = (iso, n) => addSec(iso, n * 86400);
const inWindow = (t, from, to) => (!from ? true : from < to ? t >= from && t < to : t >= from || t < to);
export const daypart = (h) => (h < 6 ? tx('safety.daypart.text.4') : h < 12 ? tx('safety.daypart.text.3') : h < 18 ? tx('safety.daypart.text.2') : tx('safety.daypart.text'));
export const koTime = (iso) => { const h = +iso.slice(11, 13), m = +iso.slice(14, 16); return `${tx('safety.koTime.text.2', { daypart: daypart(h), v: h % 12 || 12, v2: m ? ` ${tx('safety.koTime.text', { m })}` : '' })}`; };

// --- 사람 ---
export const pn = (id) => PERSONAS[id]?.name ?? id;
export const person = (rid) => ({ name: api.core.residentName?.(rid) ?? RESIDENTS[rid]?.name ?? rid, room: api.core.resident?.(rid)?.room || RESIDENTS[rid]?.room || '' });
export const rl = (rid) => { const r = person(rid); return `${tx('safety.rl.text', { room: r.room, name: r.name })}`; };
export const residentList = () => {
  const list = api.core.residents?.('S1') ?? Object.values(RESIDENTS).filter((r) => r.id !== 'R_HANGYEOL');
  return list.slice().sort((a, b) => (a.room < b.room ? -1 : 1));
};
export const isAbsent = (rid, iso = nowISO()) => !!api.core.isAbsent?.(rid, iso);
export const absences = () => (api.core.openAbsences?.(nowISO()) || []).slice().sort((a, b) => (person(a.residentId).room < person(b.residentId).room ? -1 : 1));

// --- 당번표 ---
export function shiftAt(iso = nowISO()) {
  const t = hm(iso);
  const sh = S().shifts.find((x) => inWindow(t, x.from, x.to));
  const wraps = sh.from > sh.to;
  const startDate = wraps && t < sh.to ? dateOf(addDays(iso, -1)) : dateOf(iso);
  const endDate = wraps && t >= sh.from ? dateOf(addDays(iso, 1)) : dateOf(iso);
  const start = `${startDate}T${sh.from}:00`, edit = (S().shiftEdits || []).find((e) => e.key === sh.key && e.start === start);
  return { key: sh.key, slots: (edit ? edit.slots : sh.slots).slice(), start, end: `${endDate}T${sh.to}:00` };
}
export const firstFilled = (slots, from = 0) => slots.slice(from).find(Boolean);

// --- 기록 ---
export function ev(sid, at, type, by = null, data = null) {
  const s = S(); s.events.push({ sid, at, type, by, data });
}
export const alertById = (id) => S().alerts.find((a) => a.id === id);
export const signalOf = (a) => S().signals.find((x) => x.id === a.sid);
export const ruleOf = (sg) => S().rules.find((r) => r.key === sg.ruleKey && (!sg.ruleVersion || r.version === sg.ruleVersion))
  ?? (S().ruleHist || []).find((r) => r.key === sg.ruleKey && r.version === sg.ruleVersion) ?? S().rules.find((r) => r.key === sg.ruleKey);
export const alertOfSignal = (sg) => S().alerts.find((a) => a.sid === sg.id);
export const eventsOf = (sid) => S().events.filter((e) => e.sid === sid).map((e, i) => ({ ...e, i })).sort((x, y) => (x.at < y.at ? -1 : x.at > y.at ? 1 : x.i - y.i));

// --- 신호 받기: 중복 확인, 규칙, 부재 멈춤, 알림 만들기 ---
export function receive(r) {
  const s = S();
  const dupe = s.signals.find((x) => x.source === r.source && x.vendorEventId === r.vendorEventId);
  if (dupe) { dupe.dups.push({ at: r.receivedAt }); ev(dupe.id, r.receivedAt, 'DUPLICATE'); return dupe; }
  const sg = { id: `S${++s.sigSeq}`, source: r.source, kind: r.kind, vendorEventId: r.vendorEventId, residentId: r.residentId, occurredAt: r.occurredAt, receivedAt: r.receivedAt, value: r.value || {}, severity: 'LOG_ONLY', ruleKey: null, ruleVersion: null, dups: [], paused: false, by: r.by || null };
  s.signals.push(sg);
  ev(sg.id, sg.receivedAt, 'RECEIVED');
  const rule = s.rules.find((x) => x.source === sg.source && x.kind === sg.kind && inWindow(hm(sg.occurredAt), x.from, x.to) && (!x.minDurationMin || (sg.value.durationMin ?? 0) >= x.minDurationMin));
  sg.paused = !!rule && PAUSED_BY_ABSENCE.includes(sg.source) && !!sg.residentId && isAbsent(sg.residentId, sg.occurredAt);
  // 장치 동의가 필요한 출처(침대 센서, 출입 기록)는 연결 기록이 없으면 알림 없이 기록만 남긴다(US-18 3).
  sg.unlinked = !!rule && NEEDS_LINK.includes(sg.source) && !!sg.residentId && !linkActive(sg.source, sg.residentId, sg.occurredAt);
  if (!rule || sg.paused || sg.unlinked) { if (sg.paused || sg.unlinked) { sg.ruleKey = rule.key; sg.ruleVersion = rule.version; } return sg; }
  sg.severity = rule.severity; sg.ruleKey = rule.key; sg.ruleVersion = rule.version;
  if (rule.severity === 'LOG_ONLY') return sg;
  const a = { id: `A${++s.alertSeq}`, sid: sg.id, residentId: sg.residentId, severity: rule.severity, status: 'OPEN', level: 1, dueAt: addSec(sg.receivedAt, rule.intervalMin * 60), intervalMin: rule.intervalMin, repeat: 0, ackBy: null, ackAt: null, metAt: null, searching: false, record: null, calls: [], outcome: null, resolvedAt: null, closedBy: null };
  s.alerts.push(a);
  const to = firstFilled(shiftAt(sg.receivedAt).slots);
  s.phones.push({ uid: to, at: sg.receivedAt, kind: 'FIRST', aid: a.id });
  ev(sg.id, addSec(sg.receivedAt, 1), 'NOTIFIED', null, { to });
  emit('safety.SafetyAlertRaised', { alertId: a.id, residentId: a.residentId, severity: a.severity });
  return sg;
}

// --- 넘김(5분 무응답 등). 시계가 앞으로 갈 때 기한이 지난 알림을 기한 순서대로 한 단계씩 넘긴다. ---
function escalate(a) {
  const s = S(), at = a.dueAt;
  const slots = shiftAt(at).slots;
  if (a.level === 4) a.repeat += 1; else a.level += 1;
  a.status = 'ESCALATED';
  const kind = { 2: 'L2', 3: 'L3', 4: 'ALL' }[a.level];
  const to = a.level === 4 ? slots.filter(Boolean) : [firstFilled(slots, a.level - 1) ?? firstFilled(slots)];
  to.forEach((uid) => s.phones.push({ uid, at, kind, aid: a.id }));
  ev(a.sid, at, 'ESCALATED', null, { level: a.level, to });
  // shortcut: 모두 호출 뒤 반복은 6회까지만 센다. 진행자가 시계를 크게 옮겨도 계산이 끝나게 하려는 한도다.
  a.dueAt = a.level === 4 && a.repeat >= 6 ? null : addSec(at, a.intervalMin * 60);
  emit('safety.SafetyAlertEscalated', { alertId: a.id, level: a.level });
}

function visitSweep(prev, next) {
  const s = S(), end = s.visitPlan.end;
  let d = dateOf(prev);
  for (let i = 0; i < 400 && d <= dateOf(next); i++, d = dateOf(addDays(`${d}T12:00:00`, 1))) {
    const t = `${d}T${end}:00`;
    // shortcut: 놓친 방문 신호는 시드로 정한 날(visitPlan.days)의 시간대 끝에만 만든다. 데모 시계가 건너뛴 날까지 신호가 쌓이지 않게 하려는 것이고, 운영에서는 매일로 바꾼다.
    if (!(t > prev && t <= next && d === dateOf(next) && s.visitPlan.days.includes(d))) continue;
    s.visitPlan.residentIds.forEach((rid) => {
      if (s.visits.some((v) => v.residentId === rid && v.date === d) || s.signals.some((x) => x.source === 'VISIT' && x.vendorEventId === `${rid}:${d}`)) return;
      receive({ source: 'VISIT', kind: 'VISIT_MISSED', vendorEventId: `${rid}:${d}`, residentId: rid, occurredAt: t, receivedAt: t });
    });
  }
}

export function tick(prev, next) {
  visitSweep(prev, next);
  for (let guard = 0; guard < 2000; guard++) {
    const due = S().alerts.filter((a) => (a.status === 'OPEN' || a.status === 'ESCALATED') && a.dueAt && a.dueAt <= next).sort((x, y) => (x.dueAt < y.dueAt ? -1 : 1))[0];
    if (!due) break;
    escalate(due);
  }
}

// --- 맡기, 조치 기록, 보호자 알림 ---
const canHandle = (p) => ROLES.handle.includes(p.key);
export function acknowledge(a, uid, p) {
  if (!canHandle(p)) refuse(tx('safety.acknowledge.refuse.2'));
  if (a.status === 'RESOLVED') refuse(tx('safety.acknowledge.refuse'));
  if (a.status === 'ACKNOWLEDGED') refuse(`${tx('safety.acknowledge.text', { pn: pn(a.ackBy) })}`);
  a.status = 'ACKNOWLEDGED'; a.ackBy = uid; a.ackAt = nowISO(); a.dueAt = null;
  ev(a.sid, a.ackAt, 'ACKNOWLEDGED', uid);
  emit('safety.SafetyAlertAcknowledged', { alertId: a.id, residentId: a.residentId });
}
export function stampMeeting(a) {
  if (a.status !== 'ACKNOWLEDGED') refuse(tx('safety.stampMeeting.refuse'));
  if (!a.metAt) a.metAt = nowISO();
}

export function contactsOf(rid) {
  const list = api.core.emergencyContacts?.(rid) ?? FALLBACK_CONTACTS[rid] ?? [];
  return list.map((c, i) => ({ rank: c.rank ?? c.priority ?? i + 1, name: c.name, relation: c.relation ?? '', phone: c.phone || tx('safety.contactsOf.phone') }));
}
export function logCall(a, uid, result) {
  const rank = Math.min(a.calls.length + 1, Math.max(contactsOf(a.residentId).length, 1));
  a.calls.push({ rank, at: nowISO(), result, by: uid });
  ev(a.sid, nowISO(), 'EMERGENCY_CALL', uid, { rank, result });
}

export function saveRecord(a, uid, form) {
  if (a.status !== 'ACKNOWLEDGED' || a.ackBy !== uid) refuse(`${tx('safety.saveRecord.text', { pn: pn(a.ackBy) })}`);
  if (form.meet === 'NOT_MET') {
    a.searching = true; ev(a.sid, nowISO(), 'NOT_MET', uid);
    const slots = shiftAt().slots;
    S().phones.push({ uid: slots[2], at: nowISO(), kind: 'L3', aid: a.id });
    return 'NOT_MET';
  }
  if (form.meet !== 'MET') refuse(tx('safety.saveRecord.refuse.2'));
  if (!form.acts.length) refuse(tx('safety.saveRecord.refuse'));
  stampMeeting(a);
  a.record = { acts: form.acts, memo: form.memo || '', by: uid, at: nowISO() };
  ev(a.sid, a.metAt, 'MET', uid);
  if (form.acts.includes('WENT_TO_HOSPITAL')) {
    S().escorts.push({ id: `H${S().escorts.length + 1}`, aid: a.id, residentId: a.residentId, escortUid: form.escort === 'NONE' ? null : form.escort, departAt: `${dateOf(nowISO())}T${form.depart}:00`, returnedAt: null, returnedBy: null, by: uid });
  }
  return 'MET';
}

export function viewersOf(rid) {
  const guardians = Object.values(PERSONAS).filter((p) => p.key === 'GUARDIAN' && p.residentId === rid);
  if (typeof api.family.canSee === 'function') return guardians.filter((p) => api.family.canSee(p.id, 'HEALTH'));
  return guardians.filter((p) => FALLBACK_VIEWERS[rid]?.includes(p.id));
}
// D의 조용한 시간(22~08시) 규칙을 B 문서대로 쓴다: 밤에 생긴 소식은 08:00에 문자를 보낸다.
export function nextSendAt(iso) {
  const h = +iso.slice(11, 13);
  if (h >= 22) return `${dateOf(addDays(iso, 1))}T08:00:00`;
  if (h < 8) return `${dateOf(iso)}T08:00:00`;
  return iso;
}
export function firstSentence(a) {
  const sg = signalOf(a), rule = ruleOf(sg), call = a.calls.find((c) => c.result === 'REACHED');
  if (call && a.record?.acts.includes('CALLED_EMERGENCY_CONTACT')) return `${tx('safety.firstSentence.text', { pn: pn(call.by), koTime: koTime(call.at) })}`;
  if (!rule?.template) return '';
  return rule.template.replace(tx('SAF-11.token.date'), fmt.md(sg.occurredAt)).replace(tx('SAF-11.token.time'), koTime(sg.occurredAt)).replace(tx('SAF-11.token.place'), placeOf(sg)).replace('{date}', fmt.md(sg.occurredAt)).replace('{daypart}', daypart(+sg.occurredAt.slice(11, 13))).replace('{time}', koTime(sg.occurredAt).split(' ').slice(1).join(' ')).replace('{duration}', sg.value.durationMin ?? '');
}
const isHospital = (a) => !!a.record?.acts.includes('WENT_TO_HOSPITAL');

function resolve(a, outcome, closedBy = null) {
  a.status = 'RESOLVED'; a.resolvedAt = nowISO(); a.outcome = outcome; a.closedBy = closedBy;
  if (!closedBy) ev(a.sid, a.resolvedAt, 'RESOLVED', a.ackBy);
  emit('safety.SafetyAlertResolved', { alertId: a.id, residentId: a.residentId });
}
export function postGuardian(a, second) {
  if (a.status !== 'ACKNOWLEDGED' || !a.record) refuse(tx('safety.postGuardian.refuse.2'));
  const sg = signalOf(a), viewers = viewersOf(a.residentId), first = firstSentence(a);
  const sentences = [first, (second || '').trim()].filter(Boolean);
  const hospital = isHospital(a), at = nowISO();
  if (viewers.length && !sentences.length) refuse(tx('safety.postGuardian.refuse'));
  const when = fmt.md(sg.occurredAt);
  api.family.publishHealthNews?.({
    residentId: a.residentId, kind: hospital ? 'HOSPITAL' : 'VISIT',
    listLine: hospital ? `${tx('safety.postGuardian.text.2', { when })}` : `${tx('safety.postGuardian.text', { when, daypart: daypart(+sg.occurredAt.slice(11, 13)) })}`,
    title: hospital ? tx('safety.postGuardian.title.2') : tx('safety.postGuardian.title'), body: sentences.join('\n'), at, source: 'SAFETY', sourceId: a.id, occurredAt: sg.occurredAt, sendAt: nextSendAt(at), recordedBy: a.ackBy,
  });
  resolve(a, { decision: 'POST', viewerIds: viewers.map((p) => p.id), sentences });
  if (viewers.length) ev(a.sid, addSec(a.resolvedAt, 60), 'GUARDIAN_SCHEDULED', null, { sendAt: nextSendAt(at) });
  else ev(a.sid, addSec(a.resolvedAt, 60), 'POSTED_NO_VIEWER');
}
export function withholdGuardian(a, f) {
  if (a.status !== 'ACKNOWLEDGED' || !a.record) refuse(tx('safety.withholdGuardian.refuse.4'));
  if (f.why === 'MEMBER_REQUEST') { if (!f.who?.trim() || !f.when?.trim()) refuse(tx('safety.withholdGuardian.refuse.3')); }
  else if (f.why === 'NOT_A_HEALTH_EVENT') { if (a.record.acts.includes('CALLED_119') || isHospital(a)) refuse(tx('safety.withholdGuardian.refuse.2')); }
  else refuse(tx('safety.withholdGuardian.refuse'));
  resolve(a, { decision: 'WITHHOLD', why: f.why, sub: f.sub || null, heardBy: f.who || null, heardAt: f.when || null });
  ev(a.sid, addSec(a.resolvedAt, 60), 'WITHHELD', null, { why: f.why });
}

// --- 안부 방문 ---
export const visitTargets = (iso = nowISO()) => S().visitPlan.residentIds.filter((rid) => !isAbsent(rid, iso));
export const defaultVisitSel = () => { const t = visitTargets(); return t.find((r) => !visitOf(r)) || t[0] || ''; };
export const visitOf = (rid, date = dateOf(nowISO())) => S().visits.find((v) => v.residentId === rid && v.date === date);
export function saveVisit(rid, result, uid) {
  const s = S(), now = nowISO(), date = dateOf(now);
  if (!VISIT_LONG[result]) refuse(tx('safety.saveVisit.refuse'));
  if (!visitTargets().includes(rid)) refuse(`${tx('safety.saveVisit.text', { rl: rl(rid) })}`);
  const old = visitOf(rid, date);
  if (old) Object.assign(old, { result, at: now, by: uid }); else s.visits.push({ residentId: rid, date, result, at: now, by: uid });
  // 놓친 방문 알림은 방문 기록으로 마친다. 조치 완료와 보호자 알림은 [미정]이라 여기까지만 한다.
  s.alerts.filter((a) => a.status !== 'RESOLVED' && a.residentId === rid && signalOf(a).source === 'VISIT' && dateOf(signalOf(a).occurredAt) === date).forEach((a) => {
    if (a.status !== 'ACKNOWLEDGED') { a.status = 'ACKNOWLEDGED'; a.ackBy = uid; a.ackAt = now; a.dueAt = null; ev(a.sid, now, 'ACKNOWLEDGED', uid); }
    resolve(a, { decision: 'VISIT_RECORDED', result }, 'VISIT_RECORD');
    ev(a.sid, now, 'VISIT_RECORDED', uid, { result });
  });
}

// --- 병원에 가신 분 ---
export const openEscorts = () => S().escorts.filter((h) => !h.returnedAt);
export function returnEscort(id, time, uid) {
  const h = S().escorts.find((x) => x.id === id);
  if (!h) refuse(tx('safety.returnEscort.refuse.3'));
  if (h.returnedAt) refuse(tx('safety.returnEscort.refuse.2'));
  if (!/^\d{1,2}:\d{2}$/.test(time || '')) refuse(tx('safety.returnEscort.refuse'));
  h.returnedAt = `${dateOf(nowISO())}T${time.padStart(5, '0')}:00`; h.returnedBy = uid;
  return h;
}

// --- 숫자 ---
export const minutesOf = (a, kind) => {
  const sg = signalOf(a), e = S().events.find((x) => x.sid === a.sid && x.type === kind);
  return e ? Math.round(secBetween(sg.receivedAt, e.at) / 60) : null;
};
function ackStats(alerts) {
  const m = alerts.map((a) => minutesOf(a, 'ACKNOWLEDGED')).filter((x) => x !== null).sort((x, y) => x - y);
  const mid = m.length ? (m.length % 2 ? m[(m.length - 1) / 2] : (m[m.length / 2 - 1] + m[m.length / 2]) / 2) : null;
  return { count: m.length, medianMinutes: mid, longestMinutes: m.length ? m[m.length - 1] : null };
}
export const unclaimedAlerts = () => S().alerts.filter((a) => a.status === 'OPEN' || a.status === 'ESCALATED');
export const disconnectedCount = () => S().devices.filter(isCut).length;
export function dutyNames(iso = nowISO()) { const [a, b, c] = shiftAt(iso).slots; const nm = (u) => (u ? pn(u) : '-'); return { first: nm(a), second: nm(b), third: nm(c) }; }

// ---------- 기기 연결과 장치 동의 (SAF-10), 기기 상태 (SAF-08) ----------
// 장치 동의가 필요한 출처. 호출벨은 동의 없이 연결된다.
const NEEDS_LINK = ['BED_SENSOR', 'ACCESS_LOG'];
const placeOf = (sg) => (sg.source === 'CALL_BELL' ? tx('safety.place.bell') : '');
export const KIND_ORDER = ['BED_SENSOR', 'CALL_BELL', 'ACCESS_LOG'];
export const isRetired = (d, iso = nowISO()) => !!d.retiredOn && d.retiredOn <= dateOf(iso);
// 시연에서 신호가 계속 오는 기기(live)는 끊기지 않는다. 신호가 없는 기기는 마지막 신호에서 2시간이 지나면 끊김이다.
export function isCut(d) { return !isRetired(d) && !d.live && (!d.lastSeenAt || secBetween(d.lastSeenAt, nowISO()) >= 2 * 3600); }
export const cutHours = (d) => (d.lastSeenAt ? Math.floor(secBetween(d.lastSeenAt, nowISO()) / 3600) : d.silentHours ?? 2);
export function deviceStats() {
  const list = S().devices, total = list.filter((d) => !isRetired(d)).length, cut = list.filter((d) => isCut(d)).length;
  return { total, ok: total - cut, byKind: KIND_ORDER.map((kind) => { const all = list.filter((d) => d.kind === kind), ended = all.filter((d) => isRetired(d)), bad = all.filter((d) => isCut(d)); return { kind, ok: all.length - ended.length - bad.length, cut: bad, ended }; }) };
}
export function requestCheck(kind, uid) {
  const bad = S().devices.filter((d) => d.kind === kind && isCut(d));
  (S().deviceChecks ||= []).push(...bad.map((d) => ({ deviceId: d.id, at: nowISO(), by: uid })));
  return bad.length;
}
export const staffOptions = () => Object.values(PERSONAS).filter((p) => p.siteId === 'S1' && ROLES.handle.includes(p.key));
export function linkActive(source, rid, at = nowISO()) {
  const day = dateOf(at);
  return S().links.some((l) => l.source === source && l.residentId === rid && l.from <= day && (!l.to || day <= l.to));
}
export const linkNeeded = () => { const day = dateOf(nowISO()); return residentList().filter((r) => !S().links.some((l) => l.residentId === r.id && l.from <= day && (!l.to || day <= l.to))); };
/** "11월 12일 10:30"이나 "2027-01-08 23:35"를 'YYYY-MM-DDTHH:MM:00'으로. 못 읽으면 null */
export function parseWhen(text) {
  const m = String(text || '').match(/(?:(\d{4})\D+)?(\d{1,2})\D+(\d{1,2})\D+(\d{1,2}):(\d{2})/);
  if (!m) return null;
  const [mo, d, h, mi] = [+m[2], +m[3], +m[4], +m[5]];
  if (mo < 1 || mo > 12 || d < 1 || d > 31 || h > 23 || mi > 59) return null;
  return `${m[1] || nowISO().slice(0, 4)}-${p2(mo)}-${p2(d)}T${p2(h)}:${p2(mi)}:00`;
}
const consentOf = (when, staff, by) => {
  if (!when?.trim() || !staff || !by) refuse(tx('SAF-10.refuse.consent'));
  const at = parseWhen(when);
  if (!at) refuse(tx('SAF-10.refuse.when'));
  return { at, staff, by };
};
/** f: { source, rid, when, staff, by, vWhen?, vStaff, vBy, aFrom, aStaff, aWhen } */
export function saveLink(f, p) {
  if (!ROLES.link.includes(p.key)) refuse(tx('SAF-10.refuse.role'));
  const s = S(), name = person(f.rid).name, bell = f.source === 'CALL_BELL';
  // 기기 동의 날짜를 비우고 안부 방문이나 도움 필요만 적으면 기기는 연결하지 않고 그 동의만 기록한다
  const only = !bell && !(f.when || '').trim() && !!((f.vWhen || '').trim() || (f.aWhen || '').trim());
  const consent = bell || only ? null : consentOf(f.when, f.staff, f.by);
  const dup = !only && s.links.find((l) => l.source === f.source && l.residentId === f.rid && linkActive(f.source, f.rid));
  if (dup) refuse(tx('SAF-10.refuse.dup', { md: fmt.md(dup.from), name }));
  const visit = f.vWhen?.trim() ? consentOf(f.vWhen, f.vStaff, f.vBy) : null;
  let assist = null;
  if (f.aWhen?.trim()) {
    if (!ROLES.evac.includes(p.key)) refuse(tx('SAF-10.refuse.assist'));
    const c = consentOf(f.aWhen, f.aStaff, f.aFrom);
    assist = { needs: true, source: 'STAFF', heardFrom: c.by, heardBy: c.staff, heardAt: c.at, by: p.id, at: nowISO() };
  }
  if (!only) s.links.push({ id: `L${++s.linkSeq}`, source: f.source, residentId: f.rid, from: dateOf(nowISO()), to: null, consent });
  if (visit) { (s.visitPlan.consents ||= {})[f.rid] = visit; if (!s.visitPlan.residentIds.includes(f.rid)) s.visitPlan.residentIds.push(f.rid); }
  if (assist) (s.assist ||= {})[f.rid] = assist;
  return { name, only };
}

// ---------- 규칙과 당번표 (SAF-11) ----------
export const SEVERITIES = ['IMMEDIATE', 'CHECK', 'LOG_ONLY'];
const parseSpan = (text) => {
  const m = String(text || '').trim().match(/^(\d{1,2}):(\d{2})\s*~\s*(\d{1,2}):(\d{2})$/);
  return m && +m[1] < 24 && +m[3] < 24 && +m[2] < 60 && +m[4] < 60 ? [`${p2(m[1])}:${m[2]}`, `${p2(m[3])}:${m[4]}`] : null;
};
export const spanText = (from, to) => (from ? `${from}~${to}` : '');
const empty = (field) => refuse(tx('SAF-11.refuse.empty', { field }));
export function saveRule(key, f, p) {
  if (!ROLES.config.includes(p.key)) refuse(tx('SAF-11.denied'));
  const s = S(), r = s.rules.find((x) => x.key === key);
  if (!r) refuse(tx('SAF-11.refuse.none'));
  const name = (f.name || '').trim();
  if (!name) empty(tx('SAF-11.n.name'));
  if (!SEVERITIES.includes(f.severity)) empty(tx('SAF-11.n.grade'));
  let span = [null, null];
  if ((f.span || '').trim()) { span = parseSpan(f.span); if (!span) refuse(tx('SAF-11.refuse.span')); }
  const interval = +String(f.interval || '').trim();
  if (f.severity !== 'LOG_ONLY' && !(Number.isInteger(interval) && interval >= 1 && interval <= 120)) empty(tx('SAF-11.n.interval'));
  const tpl = (f.template || '').trim();
  const bad = tpl.match(new RegExp(tx('SAF-11.banned.pattern')));
  if (bad) refuse(tx('SAF-11.refuse.banned', { word: bad[0] }));
  (s.ruleHist ||= []).push(structuredClone(r));
  Object.assign(r, { name, severity: f.severity, from: span[0], to: span[1], template: tpl || null, version: r.version + 1 });
  if (f.severity !== 'LOG_ONLY') r.intervalMin = interval;
  return r.version;
}
export function saveShift(slots, p) {
  if (!ROLES.config.includes(p.key)) refuse(tx('SAF-11.denied'));
  const s = S(), cur = shiftAt();
  if (!slots[0]) empty(tx('SAF-11.n.first'));
  const diff = [0, 1, 2].filter((i) => (cur.slots[i] || '') !== (slots[i] || ''));
  if (!diff.length) return 0;
  s.shiftEdits = (s.shiftEdits || []).filter((e) => !(e.key === cur.key && e.start === cur.start));
  s.shiftEdits.push({ key: cur.key, start: cur.start, slots: slots.map((u) => u || '') });
  diff.forEach((i) => (s.cfgLog ||= []).push({ at: nowISO(), by: p.id, pos: i + 1, to: slots[i] || '' }));
  return diff.length;
}
export function saveVisitCfg(perDay, span, p) {
  if (!ROLES.config.includes(p.key)) refuse(tx('SAF-11.denied'));
  if (!new RegExp(tx('SAF-11.perday.pattern')).test(perDay || '')) refuse(tx('SAF-11.refuse.perday'));
  const w = parseSpan(span);
  if (!w) refuse(tx('SAF-11.refuse.visitspan'));
  const vp = S().visitPlan;
  if (vp.start === w[0] && vp.end === w[1]) return false;
  vp.start = w[0]; vp.end = w[1];
  return true;
}

// ---------- 비상 때 도움 필요와 재실 명단 (SAF-09, SAF-17) ----------
export const assistOf = (rid) => (S().assist || {})[rid] || null;
export function setAssistSelf(rid, uid) {
  (S().assist ||= {})[rid] = { needs: true, source: 'SELF', heardFrom: 'SELF', heardBy: null, heardAt: nowISO(), by: uid, at: nowISO() };
}
export function clearAssistSelf(rid) { if (S().assist) delete S().assist[rid]; }
export const evacRoll = () => S().evac?.roll || null;
export function openRoll(uid) {
  const e = (S().evac ||= { roll: null, seq: 0 });
  if (!e.roll) e.roll = { id: `E${++e.seq}`, by: uid, at: nowISO(), events: [] };
  return e.roll;
}
/** 대피 기록은 추가만 한다. 지금 상태는 그 입주자의 마지막 기록으로 읽는다. */
const evacCheckOf = (roll, rid) => { const last = roll?.events.findLast((e) => e.rid === rid); return last?.type === 'CHECK' ? last : null; };
export const evacHistory = (rid) => evacRoll()?.events.filter((e) => e.rid === rid) || [];
/** 동·층 묶음. 명단은 코어 입주자·호실·부재로 만들고 출입 신호로 재실을 추정하지 않는다. */
export function evacGroups() {
  const roll = evacRoll(), groups = [];
  residentList().forEach((r) => {
    const m = r.room.match(/^(\S+)\s+(\d)\d{2}/), label = m ? tx('SAF-17.floor', { wing: m[1], floor: m[2] }) : r.room;
    let g = groups.find((x) => x.label === label);
    if (!g) groups.push(g = { label, rows: [] });
    g.rows.push({ ...r, check: evacCheckOf(roll, r.id), fixed: evacHistory(r.id).some((e) => e.type === 'CORRECT'), help: !!assistOf(r.id)?.needs, absent: isAbsent(r.id) });
  });
  return groups;
}
export function checkEvac(rid, uid, p) {
  if (!ROLES.evac.includes(p.key)) refuse(tx('SAF-17.refuse.role'));
  const roll = evacRoll();
  if (!roll) refuse(tx('SAF-17.refuse.closed'));
  const done = evacCheckOf(roll, rid);
  if (done) refuse(tx('SAF-17.again', { hm: hm(done.at), pn: pn(done.by) }));
  if (!residentList().some((r) => r.id === rid)) refuse(tx('SAF-17.refuse.none'));
  roll.events.push({ type: 'CHECK', rid, by: uid, at: nowISO() });
}
/** 잘못 누른 대피 확인의 정정. 앞선 기록을 지우거나 바꾸지 않고 정정 기록을 덧붙인다. */
export function correctEvac(rid, why, uid, p) {
  if (!ROLES.evac.includes(p.key)) refuse(tx('SAF-17.refuse.role'));
  const roll = evacRoll();
  if (!roll) refuse(tx('SAF-17.refuse.closed'));
  if (!evacCheckOf(roll, rid)) refuse(tx('SAF-17.refuse.nocheck'));
  if (!(why || '').trim()) refuse(tx('SAF-17.refuse.why'));
  roll.events.push({ type: 'CORRECT', rid, why: why.trim(), by: uid, at: nowISO() });
}

// ---------- 사고·학대 보고 (SAF-16) ----------
export const incidentOf = (aid) => (S().incidents || []).find((r) => r.aid === aid) || null;
export const canWriteIncident = (p, a) => ROLES.handle.includes(p.key) && (p.key === 'MANAGER' || a.ackBy === p.id);
export const canViewIncident = (p, r) => ROLES.incidentView.includes(p.key) || r.by === p.id;
export const hmOf = (t) => {
  if (!(t || '').trim()) return null;
  if (!/^\d{1,2}:\d{2}$/.test(t.trim())) refuse(tx('SAF-16.refuse.time'));
  return t.trim().padStart(5, '0');
};
export function saveIncident(a, p, f) {
  if (!canWriteIncident(p, a)) refuse(tx('SAF-16.refuse.write'));
  if (incidentOf(a.id)) refuse(tx('SAF-16.refuse.saved'));
  const account = (f.account || '').trim();
  if (!account) refuse(tx('SAF-16.refuse.empty'));
  const rec = { id: `I${(S().incidents ||= []).length + 1}`, aid: a.id, residentId: a.residentId, account, notified: f.notified || null, notifiedAt: f.notified === 'Y' ? hmOf(f.notifiedAt) : null, notifiedRank: f.notified === 'Y' ? +f.notifiedRank || 1 : null,
    reported: f.reported || null, agency: f.reported === 'Y' ? f.agency || 'ELDER_PROTECTION_AGENCY' : null, agencyOther: f.reported === 'Y' && f.agency === 'OTHER' ? (f.agencyOther || '').trim() : '', reportedAt: f.reported === 'Y' ? hmOf(f.reportedAt) : null,
    by: p.id, at: nowISO(), adds: [] };
  S().incidents.push(rec);
  return rec;
}
export function appendIncident(a, p, text) {
  const r = incidentOf(a.id), t = (text || '').trim();
  if (!r) refuse(tx('SAF-16.refuse.none'));
  if (!canWriteIncident(p, a) && r.by !== p.id) refuse(tx('SAF-16.refuse.write'));
  if (!t) refuse(tx('SAF-16.refuse.append'));
  r.adds.push({ at: nowISO(), by: p.id, text: t });
}
/** 열 때 남기는 기록(SENSITIVE_READ 자리) */
export function noteIncidentOpen(a, p) {
  if (incidentOf(a.id)) (S().incidentOpens ||= []).push({ aid: a.id, by: p.id, at: nowISO() });
}

export const apiFns = {
  isNightDuty(personaId) { const sh = shiftAt(); return sh.key === 'NIGHT' && sh.slots.slice(0, 2).includes(personaId); },
  board() {
    const now = nowISO(), recent = S().alerts.filter((a) => a.ackAt && secBetween(a.ackAt, now) <= 86400 && secBetween(a.ackAt, now) >= 0);
    return { unclaimed: unclaimedAlerts().length, unfinished: S().alerts.filter((a) => a.status !== 'RESOLVED').length, disconnected: disconnectedCount(), duty: dutyNames(now), ackMinutes: ackStats(recent).medianMinutes, ack: ackStats(recent), asOf: now };
  },
  isCalling(residentId) { return S().alerts.some((a) => a.residentId === residentId && a.status !== 'RESOLVED' && !a.metAt && ['CALL_BELL', 'FRONT_CALL'].includes(signalOf(a).source)); },
  monthSummary(ym) {
    const s = S(), sigs = s.signals.filter((x) => x.occurredAt.startsWith(ym)), al = s.alerts.filter((a) => signalOf(a).occurredAt.startsWith(ym));
    const ack = ackStats(al), done = al.filter((a) => a.status === 'RESOLVED').length;
    return { period: ym, asOf: nowISO(), complete: nowISO().slice(0, 7) > ym, signalCount: sigs.length, alertCount: al.length, logOnlyCount: sigs.length - al.length, ackTimes: ack, medianMinutes: ack.medianMinutes, escalatedCount: al.filter((a) => a.level >= 2).length, resolvedCount: done, resolved: done };
  },
  navCounts() { const n = unclaimedAlerts().length; return n ? { 'SAF-01': n } : {}; },
};
