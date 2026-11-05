import { tx } from '../lib/text.js';
import { loadData } from '../lib/text.js';
// N2 community: 프로그램·시설·공지. 규칙은 docs/community/tech-design.md(정원, 대기 승급, 시간 겹침, 공지 대상과 확인)를 따른다.
// 다른 모듈의 db는 읽지 않고 api.core.x?.() 로만 부른다. 코어가 없으면 people.js 시드로 이름과 호실을 채운다.
import { api, db, view, refuse, go, href, me, esc, ic, fmt, toast, sms, overlay, sheetWrap, denied, empty, screens } from '../lib/kit.js';
import { RESIDENTS, PERSONAS, SITES } from '../lib/people.js';
const SEED = await loadData('community');


// ---------------------------------------------------------------- 시드 (함수 호출 없는 순수 데이터)
// 회차(sessions)와 시설 칸(SESSION)은 ensure()가 프로그램 규칙으로 만든다. genFrom~genTo는 시드가 미리 만든 범위다.


// ---------------------------------------------------------------- 시간과 글자 도구
const DOWS = tx('community.shared.text.39');
const p2 = (n) => String(n).padStart(2, '0');
const ymdOf = (iso) => iso.slice(0, 10);
const hmOf = (iso) => iso.slice(11, 16);
const mk = (ymd, hm) => `${ymd}T${hm}:00`;
const addDays = (ymd, n) => { const d = new Date(`${ymd}T00:00:00`); d.setDate(d.getDate() + n); return fmt.ymd(d); };
const addMin = (iso, n) => { const d = new Date(new Date(iso).getTime() + n * 60000); return `${fmt.ymd(d)}T${fmt.hm(d)}:00`; };
const dowOf = (ymd) => new Date(`${ymd}T00:00:00`).getDay();
const dowName = (ymd) => DOWS[dowOf(ymd)];
const mm = (hm) => +hm.slice(0, 2) * 60 + +hm.slice(3, 5);
const toHM = (m) => `${p2(Math.floor(m / 60))}:${p2(m % 60)}`;
const durText = (m) => [m >= 60 ? tx('CMN-22.hour', { n: Math.floor(m / 60) }) : '', m % 60 ? tx('CMN-22.min', { n: m % 60 }) : ''].filter(Boolean).join(' ');
const md = (s) => `${+s.slice(5, 7)}/${+s.slice(8, 10)}`;
const mdDow = (iso) => `${md(iso)}(${dowName(ymdOf(iso))})`;
const clockOnly = (iso) => { const d = new Date(iso), h = d.getHours(), m = d.getMinutes(); return `${tx('community.shared.text.40', { v: h % 12 || 12, v2: m ? ` ${tx('community.shared.text.38', { m })}` : '' })}`; };
const halfOf = (iso) => (new Date(iso).getHours() < 12 ? 'AM' : 'PM');
const whenKo = (iso) => `${fmt.mdw(iso)} ${fmt.ampm(iso)}`;
const rangeKo = (s, e) => `${tx('community.shared.text.37', { mdw: fmt.mdw(s), ampm: fmt.ampm(s), v: halfOf(s) === halfOf(e) ? clockOnly(e) : fmt.ampm(e) })}`;
const josa = (w, a, b) => { const c = w.charCodeAt(w.length - 1) - 0xAC00; return c >= 0 && c % 28 !== 0 ? a : b; };
const ORD = [tx('community.shared.text.36'), tx('community.shared.text.35'), tx('community.shared.text.34'), tx('community.shared.text.33'), tx('community.shared.text.32'), tx('community.shared.text.31'), tx('community.shared.text.30'), tx('community.shared.text.29'), tx('community.shared.text.28'), tx('community.shared.text.27')];
const ordinal = (n) => (n <= 10 ? `${tx('community.shared.text.26', { v: ORD[n - 1] })}` : `${tx('community.shared.text.25', { n })}`);
const weekStart = (ymd) => addDays(ymd, -((dowOf(ymd) + 6) % 7));

// ---------------------------------------------------------------- 상태 읽기
const C = () => db.community;
const prog = (id) => C().programs.find((p) => p.id === id);
const place = (id) => C().places.find((p) => p.id === id);
const sess = (id) => C().sessions.find((s) => s.id === id);
const staffName = (id) => PERSONAS[id]?.name ?? '';

function residents() {
  const r = api.core.residents?.('S1');
  return Array.isArray(r) && r.length ? r : Object.values(RESIDENTS).filter((x) => x.siteId === 'S1' && x.id !== 'R_HANGYEOL');
}
const R = (id) => residents().find((x) => x.id === id) || RESIDENTS[id] || { id, name: id, room: '' };
const nameOf = (id) => api.core.residentName?.(id) ?? R(id).name;
const roomOf = (id) => R(id).room;
const staffLabel = (id) => `${tx('community.shared.text.24', { roomOf: roomOf(id), nameOf: nameOf(id) })}`;
const byRoom = (a, b) => roomOf(a).localeCompare(roomOf(b), 'ko');
const inAudience = (code, id) => code === 'ALL' || roomOf(id).startsWith(`${tx('community.shared.text.23', { code })}`);

// 장기 부재 표시는 코어 조회로만 읽는다. 상세를 모르면 date를 알 수 없는 것으로 둔다.
function absence(rid) {
  const a = api.core.isAbsent?.(rid, db.now);
  if (!a) return null;
  const o = typeof a === 'object' ? a : (api.core.openAbsences?.(db.now) || []).find((x) => x.residentId === rid);
  return { known: !!o, expectedOn: o?.expectedOn ?? o?.expectedReturnOn ?? null };
}
function absenceText(rid) {
  const a = absence(rid);
  if (!a) return '';
  if (!a.known) return tx('community.shared.text.22');
  return a.expectedOn ? `${tx('community.shared.text.21', { md: md(a.expectedOn) })}` : tx('community.shared.text.20');
}

const deadlineOf = (s) => mk(addDays(ymdOf(s.startsAt), -1), '18:00');
const visEnroll = (e) => e.queuedAt <= db.now;
const enrollsOf = (sid, status) => C().enrollments.filter((e) => e.sessionId === sid && e.status === status && visEnroll(e)).sort((a, b) => (a.queuedAt === b.queuedAt ? a.seq - b.seq : a.queuedAt < b.queuedAt ? -1 : 1));
const waitlist = (s) => enrollsOf(s.id, 'WAITLISTED');
const seatsLeft = (s) => s.capacity - enrollsOf(s.id, 'ENROLLED').length;
const openEnroll = (sid, rid) => C().enrollments.find((e) => e.sessionId === sid && e.residentId === rid && e.status !== 'CANCELLED' && visEnroll(e));
const rankOf = (s, e) => waitlist(s).findIndex((w) => w.id === e.id) + 1;
const visBooking = (b) => b.status === 'ACTIVE' && (b.createdAt ?? '') <= db.now;
const progOf = (s) => prog(s.programId);
const placeOf = (s) => place(s.placeId);
// 이용 규칙 버전은 사업장 안에서 늘기만 한다(CMN-22). 입주자가 확인한 버전보다 장소의 버전이 크면 다음 예약 때 규칙을 다시 보여 준다.
const needRules = (rid, pl) => (C().rulesAcked[rid] ?? 0) < pl.rulesVersion;
const ackRules = (rid, pl) => { C().rulesAcked[rid] = Math.max(C().rulesAcked[rid] ?? 0, pl.rulesVersion); };
// 사업장에서 쓰는 기능(CMN-22). 끈 기능은 직원, 입주자, 보호자 화면에 나오지 않는다.
const feat = (k) => C().features?.[k] !== false;


// 회차와 시설 칸 만들기, 게시 예약 공지 게시. 시계가 옮겨질 때와 그릴 때마다 따라잡는다(ADR-M8, 멱등).
function ensure() {
  const c = C();
  if (!c) return;
  const today = ymdOf(db.now), top = addDays(today, 28), to = c.genTo > top ? c.genTo : top;
  for (let d = c.genDone ? addDays(c.genDone, 1) : c.genFrom; d <= to; d = addDays(d, 1)) {
    for (const p of c.programs) {
      if (!p.active || !p.weekdays.includes(dowOf(d)) || d < p.startsOn || (p.endsOn && d > p.endsOn)) continue;
      const id = `S-${p.id}-${d.replace(/-/g, '')}`, st = mk(d, p.time), en = addMin(st, p.minutes);
      if (sess(id)) continue;
      if (c.bookings.some((b) => b.status === 'ACTIVE' && b.placeId === p.placeId && st < b.end && en > b.start)) {
        if (!c.failed.some((f) => f.sessionId === id)) c.failed.push({ sessionId: id, programId: p.id, startsAt: st, reason: 'BLOCK' });
        continue;
      }
      c.sessions.push({ id, programId: p.id, placeId: p.placeId, startsAt: st, endsAt: en, capacity: p.capacity, status: 'ACTIVE', savedAt: null });
      c.bookings.push({ id: `BK-${id}`, placeId: p.placeId, kind: 'SESSION', start: st, end: en, sessionId: id, status: 'ACTIVE', createdAt: '' });
    }
  }
  if (!c.genDone || to > c.genDone) c.genDone = to;
  for (const n of c.notices) if (n.status === 'SCHEDULED' && n.publishAt <= db.now) publishNotice(n, n.publishAt);
}

function publishNotice(n, at) {
  n.status = 'PUBLISHED';
  n.publishedAt = at;
  for (const r of residents()) if (inAudience(n.audience, r.id)) C().recipients.push({ noticeId: n.id, residentId: r.id });
  if (n.sendSms) {
    const text = n.requiresAck
      ? `${tx('community.shared.text.19', { title: n.title })}`
      : `${tx('community.shared.text.18', { title: n.title })}`;
    for (const rc of C().recipients.filter((x) => x.noticeId === n.id)) sms(nameOf(rc.residentId), text);
  }
}

// ---------------------------------------------------------------- 공지 계산
const isRecipient = (nid, rid) => C().recipients.some((x) => x.noticeId === nid && x.residentId === rid);
const ackOf = (nid, rid) => C().acks.find((a) => a.noticeId === nid && a.residentId === rid);
const published = () => C().notices.filter((n) => n.status === 'PUBLISHED').sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
function ackSummary(n) {
  const rec = C().recipients.filter((x) => x.noticeId === n.id).map((x) => x.residentId);
  const acked = rec.filter((r) => ackOf(n.id, r)?.kind === 'ACKED').length;
  const delivered = rec.filter((r) => ackOf(n.id, r)?.kind === 'DELIVERED_IN_PERSON').length;
  return { total: rec.length, acked, delivered, pending: rec.length - acked - delivered, rec };
}

// ---------------------------------------------------------------- 시설 칸 계산 (ADR-M1, 4-4)
const bookingsOn = (placeId, ymd) => C().bookings.filter((b) => b.placeId === placeId && visBooking(b) && ymdOf(b.start) === ymd).sort((a, b) => (a.start < b.start ? -1 : 1));
const overlapping = (placeId, s, e) => C().bookings.find((b) => b.placeId === placeId && visBooking(b) && s < b.end && e > b.start);
function freeSlots(pl, ymd) {
  const out = [];
  for (let m = mm(pl.openFrom); m + pl.slot <= mm(pl.openTo); m += pl.slot) {
    const s = mk(ymd, toHM(m));
    if (s > db.now && !overlapping(pl.id, s, mk(ymd, toHM(m + pl.slot)))) out.push(toHM(m));
  }
  return out;
}
function checkBooking({ pl, rid, ymd, start, end, people }) {
  const s = mk(ymd, start), e = mk(ymd, end);
  if (e <= s) return tx('community.shared.text.17');
  if (s <= db.now) return tx('community.shared.text.16');
  if (ymd > addDays(ymdOf(db.now), pl.windowDays)) return `${tx('community.shared.text.15', { windowDays: pl.windowDays })}`;
  if (start < pl.openFrom || end > pl.openTo) return `${tx('community.shared.text.14', { openFrom: pl.openFrom, openTo: pl.openTo })}`;
  if (people > pl.maxPeople) return `${tx('community.shared.text.13', { name: pl.name, maxPeople: pl.maxPeople })}`;
  const mine = C().bookings.filter((b) => b.kind === 'RESERVATION' && visBooking(b) && b.residentId === rid && ymdOf(b.start) === ymd).reduce((t, b) => t + mm(hmOf(b.end)) - mm(hmOf(b.start)), 0);
  if (mine + mm(end) - mm(start) > pl.dailyMax) return `${tx('community.shared.text.12', { round: Math.round(mine / 60) })}`;
  const o = overlapping(pl.id, s, e);
  if (!o) return '';
  const near = freeSlots(pl, ymd).filter((t) => t > start).slice(0, 2).join(', ');
  const tail = near ? ` ${tx('community.shared.text.11', { near })}` : '';
  if (o.kind === 'SESSION') return `${tx('community.shared.text.10', { hmOf: hmOf(o.start), hmOf2: hmOf(o.end), name: progOf(sess(o.sessionId)).name, tail })}`;
  if (o.kind === 'BLOCK') return `${tx('community.shared.text.9', { tail })}`;
  return `${tx('community.shared.text.8', { roomOf: roomOf(o.residentId), hmOf: hmOf(o.start), hmOf2: hmOf(o.end), tail })}`;
}

// ---------------------------------------------------------------- 승급 (4-3). 자리를 낸 쪽의 행동 안에서 부른다.
function promote(s) {
  if (db.now >= deadlineOf(s)) return 0;
  let n = 0;
  for (const w of waitlist(s)) {
    if (seatsLeft(s) <= 0) break;
    const a = absence(w.residentId);
    if (a && (!a.expectedOn || a.expectedOn > ymdOf(s.startsAt))) continue; // 장기 부재(F20): 건너뛰고 순서는 남긴다
    w.status = 'ENROLLED';
    w.promotedAt = db.now;
    w.promotedBy = null;
    n += 1;
    sms(nameOf(w.residentId), `${tx('community.shared.text.7', { md: fmt.md(s.startsAt), dowName: dowName(ymdOf(s.startsAt)), ampm: fmt.ampm(s.startsAt), name: progOf(s).name })}`);
  }
  return n;
}

// ---------------------------------------------------------------- 권한 (코어 authorize 자리, 프로토타입은 계정 종류로 가른다)
const WRITERS = ['FRONT', 'LIFE', 'CARE', 'STAFF', 'MANAGER'];
const ATTENDERS = ['LIFE', 'MANAGER'];
const canWrite = () => WRITERS.includes(me().key);
const canAttend = () => ATTENDERS.includes(me().key);
const mustWrite = () => { if (!canWrite()) refuse(tx('community.shared.refuse')); };
const mustMember = () => { const p = me(); if (p.key !== 'MEMBER') refuse(tx('community.shared.denied.4')); return p.residentId; };

// ---------------------------------------------------------------- 화면 조각
const v = (k, d) => view[k] ?? d;
const dlg = (id, title, body, actions, cls = 't-heading2') => overlay(`<div class="dialog" role="alertdialog" aria-modal="true" aria-label="${esc(title)}" id="${id}"><h2 class="${cls}">${title}</h2>${body}<div class="actions">${actions}</div></div>`);
const formDlg = (id, act, data, title, body, actions) => overlay(`<form data-act="${act}" ${data} style="display:contents"><div class="dialog" role="alertdialog" aria-modal="true" aria-label="${esc(title)}" id="${id}"><h2 class="t-heading2">${title}</h2>${body}<div class="actions">${actions}</div></div></form>`);
const close = (label, cls = 'btn btn-secondary btn-md') => `<button class="${cls}" type="button" data-set="dialog=&confirm=&preview=">${label}</button>`;
const radios = (legend, name, opts, cur) => `<fieldset class="rg" style="border: 0; padding: 0; margin: 0;"><legend class="label" style="font-weight: 600; margin-bottom: 4px;">${legend}</legend>${opts.map(([val, label]) => `<label class="choice"><input type="radio" name="${name}" data-bind="${name}" value="${val}"${cur === val ? ' checked' : ''}>${label}</label>`).join('')}</fieldset>`;
const sel = (id, label, name, opts, cur, live = true) => `<div class="field"><label for="${id}">${label}</label><select id="${id}" class="input" name="${name}" data-bind="${name}"${live ? ' data-live' : ''}>${opts.map(([val, text]) => `<option value="${esc(val)}"${val === cur ? ' selected' : ''}>${esc(text)}</option>`).join('')}</select></div>`;
const HOWS = [['PHONE', tx('community.shared.text.6')], ['IN_PERSON', tx('community.shared.text.5')]];
const backLink = (to, label = tx('community.shared.text.4')) => `<a class="btn btn-ghost btn-md back" href="${esc(to)}">${ic('chevron-left')}${label}</a>`;
const memberOnly = () => (me().key === 'MEMBER' ? '' : denied(tx('community.shared.denied.4'), tx('community.shared.denied.3'), href('COM-07')));
const memberOff = (k) => (feat(k) ? '' : denied(tx('CMN-22.featOff'), tx('community.shared.denied.3'), href('COM-07')));
const staffOnly = () => (['ACCOUNTING', 'OWNER'].includes(me().key) ? denied(tx('community.shared.denied.2'), tx('community.shared.denied'), href('CORE-01')) : '');
const asof = () => `<span class="asof">${tx('community.shared.span', { md: md(db.now), hmOf: hmOf(db.now) })} <button class="btn btn-ghost btn-sm" type="button" data-set="r=${db.now}">${tx('community.shared.btn')}</button></span>`;
const SOURCE = { RESIDENT_APP: () => tx('CMN-17.RESIDENTAPP'), FRONT_PROXY: (e) => `${tx('CMN-17.text.11', { staffName: staffName(e.takenBy) })}`, STAFF_PROXY: (e) => `${tx('CMN-17.text.10', { staffName: staffName(e.takenBy) })}` };
const isProxy = (e) => e.source !== 'RESIDENT_APP';

// ================================================================ 회원 화면
const kvRows = (s, withSeats) => {
  const p = progOf(s), pl = placeOf(s);
  return `<dl class="kv wide"><dt>${tx('CMN-03.dt.2')}</dt><dd>${rangeKo(s.startsAt, s.endsAt)}</dd><dt>${tx('CMN-03.dt.3')}</dt><dd>${pl.name}</dd><dt>${tx('CMN-03.dt.4')}</dt><dd>${tx('CMN-03.dd.2', { staffName: staffName(p.lead) })}</dd>${withSeats && s.capacity != null ? `<dt>${tx('CMN-03.dt')}</dt><dd>${tx('CMN-03.dd', { capacity: s.capacity, seatsLeft: seatsLeft(s) })}</dd>` : ''}<dt>${tx('CMN-03.dt.5')}</dt><dd>${tx('CMN-03.dd.3')}</dd></dl>`;
};
const alertBox = (icon, head, lines = []) => `<div class="alert">${ic(icon)}<div class="stack"><p class="t-body-lg">${head}</p>${lines.map((l) => `<p class="t-body-lg">${l}</p>`).join('')}</div></div>`;
const DEADLINE_NOTE = `<p class="t-body-md muted">${tx('CMN-03.p.6')}</p>`;
const CLOSED_NOTE = `<p class="t-body-md muted">${tx('CMN-03.p.5')}</p>`;

function memberState(s, rid) {
  const attended = C().attendance.some((a) => a.sessionId === s.id && a.residentId === rid);
  if (s.status === 'CANCELLED') return 'REST';
  if (s.endsAt <= db.now) return attended ? 'DONE' : 'PAST';
  if (s.capacity == null) return 'NOSIGNUP';
  const e = openEnroll(s.id, rid), closed = db.now >= deadlineOf(s);
  if (e?.status === 'ENROLLED') return e.promotedAt ? 'PROMOTED' : isProxy(e) ? 'PROXY' : 'ENROLLED';
  if (e?.status === 'WAITLISTED') return closed ? 'MISSED' : 'WAITING';
  if (closed) return 'CLOSED';
  return seatsLeft(s) > 0 ? 'OPEN' : 'FULL';
}

function sameTimeLine(s, rid) {
  const other = C().enrollments.find((e) => e.residentId === rid && e.status === 'ENROLLED' && visEnroll(e) && e.sessionId !== s.id && sess(e.sessionId) && s.startsAt < sess(e.sessionId).endsAt && s.endsAt > sess(e.sessionId).startsAt);
  if (other) { const n = progOf(sess(other.sessionId)).name; return `${tx('CMN-03.text.5', { n, josa: josa(n, tx('CMN-03.josa.6'), tx('CMN-03.josa.5')) })}`; }
  const rv = C().bookings.find((b) => b.kind === 'RESERVATION' && visBooking(b) && b.residentId === rid && s.startsAt < b.end && s.endsAt > b.start);
  if (rv) { const n = place(rv.placeId).short; return `${tx('CMN-03.text.4', { n, josa: josa(n, tx('CMN-03.josa.6'), tx('CMN-03.josa.5')) })}`; }
  return '';
}

function proxyLine(e, verb) {
  const how = e.heardVia === 'IN_PERSON' ? tx('community.shared.text.3') : tx('community.shared.text.2');
  return `${tx('community.shared.text', { staffName: staffName(e.takenBy), how, verb })}`;
}

function sessionAlert(s, st, e) {
  const where = `${tx('CMN-03.text.3', { whenKo: whenKo(s.startsAt), name: placeOf(s).name, josa: josa(placeOf(s).name, tx('CMN-03.josa.4'), tx('CMN-03.josa.3')) })}`;
  switch (st) {
    case 'REST': return alertBox('bell-off', `<b>${tx('CMN-03.b.10')}</b>`, [tx('CMN-03.alertBox.7')]);
    case 'NOSIGNUP': return alertBox('info', `<b>${tx('CMN-03.b.9')}</b>`);
    case 'DONE': return alertBox('circle-check', `<b>${tx('CMN-03.b.8')}</b>`);
    case 'FULL': return alertBox('info', `<b>${tx('CMN-03.b.6')}</b> ${tx('CMN-03.b.7')}`);
    case 'ENROLLED': return alertBox('circle-check', `<b>${tx('CMN-03.b.5')}</b> ${where}`, [tx('CMN-03.alertBox.6')]);
    case 'PROXY': return alertBox('circle-check', `<b>${tx('CMN-03.b.5')}</b>`, [proxyLine(e, tx('CMN-03.proxyLine'))]);
    case 'PROMOTED': return e.promotedBy
      ? alertBox('circle-check', `<b>${tx('CMN-03.b.12', { staffName: staffName(e.promotedBy), v: e.heardVia === 'IN_PERSON' ? tx('CMN-03.alertBox.5') : tx('CMN-03.alertBox.4') })}</b> ${where}`)
      : alertBox('circle-check', `<b>${tx('CMN-03.b.4')}</b> ${where}`, [tx('CMN-03.alertBox.3')]);
    case 'WAITING': return alertBox('hourglass', `<b>${tx('CMN-03.b.3', { ordinal: ordinal(rankOf(s, e)) })}</b>`, [tx('CMN-03.alertBox.2')]);
    case 'MISSED': return alertBox('info', `<b>${tx('CMN-03.b.11', { name: progOf(s).name, josa: josa(progOf(s).name, tx('CMN-03.josa.2'), tx('CMN-03.josa')) })}</b>`, [tx('CMN-03.alertBox')]);
    case 'CLOSED': return alertBox('info', `<b>${tx('CMN-03.b')}</b> ${tx('CMN-03.b.2')}`);
    default: return '';
  }
}

function memberDialog(s, rid) {
  const d = view.dialog, p = progOf(s), pl = placeOf(s);
  if (d === 'enroll') {
    const extra = sameTimeLine(s, rid);
    return dlg('cmn-dialog', tx('CMN-03.dlg.3'), `<div class="stack"><p class="t-body-lg"><b class="strong">${p.name}</b></p><p class="t-body-lg">${whenKo(s.startsAt)}</p><p class="t-body-lg">${pl.name}</p>${extra ? `<p class="t-body-lg">${extra}</p>` : ''}</div>`,
      `${close(tx('CMN-03.close.3'), 'btn btn-secondary')}<button class="btn btn-primary" type="button" data-act="cmn.enroll" data-id="${s.id}" data-intent="ENROLL">${tx('CMN-03.btn.9')}</button>`, 't-heading1');
  }
  if (d === 'wait') {
    return dlg('cmn-dialog', tx('CMN-03.dlg.2'), `<p class="t-body-lg">${tx('CMN-03.p.3')}</p><p class="t-body-lg">${tx('CMN-03.p.4')}</p>`,
      `${close(tx('CMN-03.close.3'), 'btn btn-secondary')}<button class="btn btn-primary" type="button" data-act="cmn.enroll" data-id="${s.id}" data-intent="WAITLIST">${tx('CMN-03.btn.8')}</button>`, 't-heading1');
  }
  if (d === 'race') {
    return dlg('cmn-dialog', `${tx('CMN-03.text.2', { ordinal: ordinal(waitlist(s).length + 1) })}`, '',
      `${close(tx('CMN-03.close.3'), 'btn btn-secondary')}<button class="btn btn-primary" type="button" data-act="cmn.enroll" data-id="${s.id}" data-intent="WAITLIST">${tx('CMN-03.btn.7')}</button>`, 't-heading1');
  }
  if (d === 'cancel') {
    const more = waitlist(s).length ? `<p class="t-body-lg">${tx('CMN-03.p.2')}</p>` : '';
    return dlg('cmn-dialog', `${tx('CMN-03.text', { name: p.name })}`, more,
      `${close(tx('CMN-03.close.2'), 'btn btn-secondary')}<button class="btn btn-secondary" type="button" data-act="cmn.cancel" data-id="${s.id}">${tx('CMN-03.btn.6')}</button>`, 't-heading1').replace('class="actions"', 'class="actions safe-first"');
  }
  if (d === 'leave') {
    return dlg('cmn-dialog', tx('CMN-03.dlg'), `<p class="t-body-lg">${tx('CMN-03.p')}</p>`,
      `${close(tx('CMN-03.close'), 'btn btn-secondary')}<button class="btn btn-secondary" type="button" data-act="cmn.leave" data-id="${s.id}">${tx('CMN-03.close.3')}</button>`, 't-heading1').replace('class="actions"', 'class="actions safe-first"');
  }
  return '';
}

function sessionDetail({ id }) {
  ensure();
  const bad = memberOnly() || memberOff('programs'); if (bad) return bad;
  const s = sess(id), rid = me().residentId;
  if (!s) return denied(tx('CMN-03.denied.2'), tx('CMN-03.denied'), href('CMN-02'));
  const p = progOf(s), st = memberState(s, rid), e = openEnroll(s.id, rid), closed = db.now >= deadlineOf(s);
  const withSeats = st !== 'DONE' && st !== 'PAST' && st !== 'REST';
  let action = '', note = '';
  if (st === 'OPEN') action = `<button class="btn btn-primary btn-block" type="button" data-set="dialog=enroll">${tx('CMN-03.btn.5')}</button>`;
  if (st === 'FULL') action = `<button class="btn btn-primary btn-block" type="button" data-set="dialog=wait">${tx('CMN-03.btn.4')}</button>`;
  if (['ENROLLED', 'PROXY', 'PROMOTED'].includes(st)) action = closed ? '' : `<button class="btn btn-secondary btn-block" type="button" data-set="dialog=cancel">${tx('CMN-03.btn.3')}</button>`;
  if (st === 'WAITING') action = `<button class="btn btn-secondary btn-block" type="button" data-set="dialog=leave">${tx('CMN-03.btn.2')}</button>`;
  if (st === 'MISSED' || st === 'REST') action = `<a class="btn btn-secondary btn-block" href="${esc(href('CMN-02', { week: 'next', day: addDays(ymdOf(s.startsAt), 7) }))}">${tx('CMN-03.btn')}</a>`;
  if (['OPEN', 'FULL', 'WAITING', 'MISSED'].includes(st) || (['ENROLLED', 'PROXY', 'PROMOTED'].includes(st) && !closed)) note = DEADLINE_NOTE;
  if (['ENROLLED', 'PROXY', 'PROMOTED'].includes(st) && closed) note = CLOSED_NOTE;
  return {
    main: `${backLink(href('CMN-02'))}
      <section class="card" aria-labelledby="pd-h"><div class="stack"><h1 id="pd-h" class="t-heading1">${p.name}</h1><p class="t-body-lg">${esc(p.desc)}</p></div>
      ${kvRows(s, withSeats)}${sessionAlert(s, st, e)}${action}${note}</section>`,
    overlay: memberDialog(s, rid),
  };
}

function programList(params) {
  ensure();
  const bad = memberOnly() || memberOff('programs'); if (bad) return bad;
  const rid = me().residentId, today = ymdOf(db.now), thisMon = weekStart(today);
  const next = (v('week', params.week) === 'next');
  const wk = next ? addDays(thisMon, 7) : thisMon, days = [0, 1, 2, 3, 4, 5, 6].map((i) => addDays(wk, i));
  const picked = v('day', params.day);
  const day = days.includes(picked) ? picked : next ? wk : days.includes(today) ? today : wk;
  const tag = (d) => (d === today ? tx('CMN-02.small') : d === addDays(today, 1) ? tx('CMN-02.text.5') : next ? tx('CMN-02.text.4') : '');
  const weekNav = days.map((d) => {
    const off = d < today;
    return `<a href="#" ${off ? 'aria-disabled="true"' : `data-set="day=${d}"`}${d === day ? ' aria-current="date"' : ''}><span>${tx('CMN-02.span', { v: DOWS[dowOf(d)] })}</span><b>${tx('CMN-02.text', { v: +d.slice(8, 10) })}</b>${d === today ? `<small>${tx('CMN-02.small')}</small>` : ''}</a>`;
  }).join('');
  const prev = addDays(day, -1), nx = addDays(day, 1);
  const rows = C().sessions.filter((s) => ymdOf(s.startsAt) === day).sort((a, b) => (a.startsAt < b.startsAt ? -1 : 1)).map((s) => {
    const p = progOf(s), pl = placeOf(s), e = openEnroll(s.id, rid), past = s.endsAt <= db.now;
    const last = s.status === 'CANCELLED' ? tx('CMN-02.map.4') : s.capacity == null ? tx('CMN-02.map.3') : e?.status === 'ENROLLED' ? tx('CMN-02.map.2') : e?.status === 'WAITLISTED' ? `${tx('CMN-02.text.3', { ordinal: ordinal(rankOf(s, e)) })}` : seatsLeft(s) > 0 ? `${tx('CMN-02.text.2', { seatsLeft: seatsLeft(s) })}` : tx('CMN-02.map');
    const body = `<span class="body"><span class="title">${tx('CMN-02.title.2', { v: DOWS[dowOf(day)], ampm: fmt.ampm(s.startsAt), name: p.name })}</span><span class="sub">${pl.name}</span><span class="sub">${last}</span></span>`;
    return past ? `<li><div class="cell" aria-disabled="true" style="opacity: .55;">${body}</div></li>` : `<li><a class="cell" href="${esc(href('CMN-03', { id: s.id }))}">${body}${ic('chevron-right')}</a></li>`;
  }).join('');
  const lo = +wk.slice(5, 7) === +addDays(wk, 6).slice(5, 7) ? `${tx('CMN-02.text', { v: +addDays(wk, 6).slice(8, 10) })}` : fmt.md(addDays(wk, 6));
  return {
    main: `<section class="stack"><h1 class="t-title3">${tx('CMN-02.title')}</h1><p class="t-body-lg">${tx('CMN-02.p')}</p></section>
      <div class="date-pick"><div class="week-head row between"><p class="t-label-lg muted">${tx('CMN-02.p.2', { v: next ? tx('CMN-02.main.3') : '', md: fmt.md(wk), lo })}</p><a class="btn btn-secondary btn-md" href="#" data-set="week=${next ? 'this' : 'next'}&day=${next ? today : addDays(thisMon, 7)}">${next ? tx('CMN-02.main.2') : tx('CMN-02.main')}</a></div>
      <nav class="week" aria-label="${tx('CMN-02.ariaLabel')}">${weekNav}</nav>
      <div class="day-nav"><button class="btn btn-secondary" type="button" aria-label="${tx('CMN-02.ariaLabel.2')}" ${prev < today ? 'disabled' : `data-set="day=${prev}"`}>${ic('chevron-left')}</button><p class="day-nav-label"><b class="t-heading1">${fmt.mdw(day)}</b><span class="muted">${tag(day)}</span></p><button class="btn btn-secondary" type="button" aria-label="${tx('CMN-02.ariaLabel.3')}" data-set="day=${nx}${nx > addDays(thisMon, 6) ? '&week=next' : ''}">${ic('chevron-right')}</button></div></div>
      ${rows ? `<ul class="list card flush">${rows}</ul>` : empty(tx('CMN-02.empty'))}
      <a class="btn btn-secondary btn-block" href="${esc(href('CMN-07'))}">${tx('CMN-02.btn')}</a>
      <p class="t-body-lg">${tx('CMN-02.p.3')}</p>`,
  };
}

// 내 신청과 내 예약(CMN-07, 예약 상세 CMN-09 컷은 params.res)
function myList(params) {
  ensure();
  const bad = memberOnly(); if (bad) return bad;
  const rid = me().residentId;
  if (params.res) return reservationDetail(params.res, rid);
  const tab = v('tab', 'upcoming');
  const tabs = `<nav class="tabs" aria-label="${tx('CMN-07.ariaLabel')}"><a href="#" data-set="tab=upcoming"${tab === 'upcoming' ? ' aria-current="page"' : ''}>${tx('CMN-07.a')}</a><a href="#" data-set="tab=past"${tab === 'past' ? ' aria-current="page"' : ''}>${tx('CMN-07.a.2')}</a></nav>`;
  const row = (to, t, a, b) => `<li><a class="cell" href="${esc(to)}"><span class="body"><span class="title">${t}</span><span class="sub">${a}</span><span class="sub">${b}</span></span>${ic('chevron-right')}</a></li>`;
  if (tab === 'past') {
    const done = C().attendance.filter((a) => a.residentId === rid && sess(a.sessionId) && sess(a.sessionId).endsAt <= db.now).map((a) => sess(a.sessionId)).sort((a, b) => (a.startsAt < b.startsAt ? 1 : -1));
    return { main: `<h1 class="t-title3">${tx('CMN-07.title')}</h1>${tabs}<section class="stack" aria-labelledby="mine"><h2 id="mine" class="t-heading1">${tx('CMN-07.h2')}</h2>
      ${done.length ? `<ul class="list card flush">${done.map((s) => row(href('CMN-03', { id: s.id }), progOf(s).name, fmt.mdw(s.startsAt), tx('CMN-07.row.3'))).join('')}</ul>` : empty(tx('CMN-07.empty.2'))}</section>` };
  }
  const mine = !feat('programs') ? [] : C().enrollments.filter((e) => e.residentId === rid && e.status !== 'CANCELLED' && visEnroll(e) && sess(e.sessionId) && sess(e.sessionId).status === 'ACTIVE' && sess(e.sessionId).endsAt > db.now).sort((a, b) => (sess(a.sessionId).startsAt < sess(b.sessionId).startsAt ? -1 : 1));
  const everEnrolled = C().enrollments.some((e) => e.residentId === rid && visEnroll(e));
  const rvs = !feat('places') ? [] : C().bookings.filter((b) => b.kind === 'RESERVATION' && visBooking(b) && b.residentId === rid && b.end > db.now).sort((a, b) => (a.start < b.start ? -1 : 1));
  const none = everEnrolled ? tx('CMN-07.text.4') : tx('CMN-07.text.3');
  return { main: `<h1 class="t-title3">${tx('CMN-07.title')}</h1>${tabs}
    <section class="stack" aria-labelledby="mine"><h2 id="mine" class="t-heading1">${tx('CMN-07.h2')}</h2>
      ${mine.length ? `<ul class="list card flush">${mine.map((e) => { const s = sess(e.sessionId); return row(href('CMN-03', { id: s.id }), progOf(s).name, whenKo(s.startsAt), e.status === 'WAITLISTED' ? `${tx('CMN-07.text.2', { ordinal: ordinal(rankOf(s, e)) })}` : tx('CMN-07.row.2')); }).join('')}</ul>` : empty(none)}</section>
    <section class="stack" aria-labelledby="res"><h2 id="res" class="t-heading1">${tx('CMN-07.h2.2')}</h2>
      ${rvs.length ? `<ul class="list card flush">${rvs.map((b) => row(href('CMN-07', { res: b.id }), place(b.placeId).name, rangeKo(b.start, b.end), tx('CMN-07.row'))).join('')}</ul>` : empty(tx('CMN-07.empty'))}</section>
    <p class="t-body-lg">${tx('CMN-07.p')}</p>` };
}

function reservationDetail(bid, rid) {
  const b = C().bookings.find((x) => x.id === bid);
  if (!b || b.residentId !== rid) return denied(tx('CMN-07.denied'), tx('CMN-07.title'), href('CMN-07'));
  const pl = place(b.placeId), live = b.status === 'ACTIVE' && b.start > db.now;
  const cancelled = b.status === 'CANCELLED';
  const alertHtml = cancelled
    ? alertBox('info', `<b>${tx('CMN-07.b.3')}</b>`, [tx('CMN-07.alertBox')])
    : b.source !== 'RESIDENT_APP' ? alertBox('circle-check', `<b>${proxyLine(b, tx('CMN-07.proxyLine'))}</b>`) : b.start <= db.now ? alertBox('info', `<b>${tx('CMN-07.b')}</b> ${tx('CMN-07.b.2')}`) : '';
  const dialog = view.dialog === 'rvcancel'
    ? dlg('cmn-dialog', `${tx('CMN-07.text', { short: pl.short })}`, '', `${close(tx('CMN-07.close'), 'btn btn-secondary')}<button class="btn btn-secondary" type="button" data-act="cmn.rv.cancel" data-id="${b.id}">${tx('CMN-07.btn.2')}</button>`, 't-heading1').replace('class="actions"', 'class="actions safe-first"') : '';
  return {
    main: `${backLink(href('CMN-07'))}<section class="card" aria-labelledby="rd-h"><div class="stack"><h1 id="rd-h" class="t-heading1">${pl.name}</h1><p class="t-body-lg">${esc(pl.desc)}</p></div>
      <dl class="kv wide"><dt>${tx('CMN-07.dt')}</dt><dd>${rangeKo(b.start, b.end)}</dd><dt>${tx('CMN-07.dt.2')}</dt><dd>${pl.name}</dd><dt>${tx('CMN-07.dt.3')}</dt><dd>${tx('CMN-07.dd', { people: b.people })}</dd></dl>${alertHtml}
      ${live ? `<div class="stack"><button class="btn btn-secondary btn-block" type="button" data-set="dialog=rvcancel">${tx('CMN-07.btn')}</button></div>` : ''}</section>`,
    overlay: dialog,
  };
}

function noticeDetail({ id }) {
  ensure();
  const bad = memberOnly() || memberOff('notices'); if (bad) return bad;
  const rid = me().residentId, n = C().notices.find((x) => x.id === id);
  const back = href(screens['CMN-10'] ? 'CMN-10' : 'COM-09');
  if (!n || !['PUBLISHED', 'ARCHIVED'].includes(n.status) || !isRecipient(n.id, rid)) return denied(tx('CMN-11.denied.2'), tx('CMN-11.denied'), back);
  const a = ackOf(n.id, rid), by = `${n.authorTitle} ${n.authorName} · ${fmt.md(n.publishedAt)}`;
  const top = n.requiresAck && !a ? alertBox('megaphone', `<b>${tx('CMN-11.b.3')}</b> ${tx('CMN-11.b.4')}`) : '';
  const how = { PHONE: tx('CMN-11.PHONE'), VISIT: tx('CMN-11.VISIT'), FRONT_DESK: tx('CMN-11.FRONTDESK') };
  const state = a?.kind === 'ACKED' ? alertBox('circle-check', `<b>${tx('CMN-11.b.2')}</b> ${fmt.md(a.at)} ${fmt.ampm(a.at)}`)
    : a ? alertBox('circle-check', `<b>${tx('CMN-11.b', { staffName: staffName(a.by), v: how[a.method] })}</b>`) : '';
  const foot = n.requiresAck && !a ? `<p class="t-body-md muted">${tx('CMN-11.p')}</p>` : '';
  return {
    main: `${backLink(back)}<section class="stack">${top}<h1 class="t-title3">${esc(n.title)}</h1><p class="t-body-lg">${esc(n.body)}</p><p class="t-body-md muted">${esc(by)}</p>${foot}</section>${state}
      ${n.requiresAck && !a ? `<div class="stack action-bar"><button class="btn btn-primary btn-block" type="button" data-act="cmn.ack" data-id="${n.id}">${tx('CMN-11.btn')}</button></div>` : ''}`,
  };
}

// 공지 목록(CMN-10). 꼭 보실 공지가 맨 위, 읽으면 둘째 줄에 "읽으셨어요".
function noticeList() {
  ensure();
  const bad = memberOnly() || memberOff('notices'); if (bad) return bad;
  const rid = me().residentId, tab = v('tab', 'now');
  const list = C().notices.filter((n) => n.status === (tab === 'past' ? 'ARCHIVED' : 'PUBLISHED') && isRecipient(n.id, rid))
    .sort((a, b) => (a.requiresAck === b.requiresAck ? (a.publishedAt < b.publishedAt ? 1 : -1) : a.requiresAck ? -1 : 1));
  const row = (n) => `<li><a class="cell" href="${esc(href('CMN-11', { id: n.id }))}"><span class="body">${n.requiresAck ? `<span class="badge">${ic('megaphone')}${tx('CMN-10.badge')}</span>` : ''}<span class="title">${esc(n.title)}</span>${n.requiresAck ? (ackOf(n.id, rid) ? `<span class="sub">${tx('CMN-10.read')}</span>` : '') : `<span class="sub">${fmt.md(n.publishedAt)}</span>`}</span>${ic('chevron-right')}</a></li>`;
  return { main: `<h1 class="t-title3">${tx('CMN-10.title')}</h1>
    <nav class="tabs" aria-label="${tx('CMN-10.ariaLabel')}"><a href="#" data-set="tab=now"${tab === 'now' ? ' aria-current="page"' : ''}>${tx('CMN-10.a')}</a><a href="#" data-set="tab=past"${tab === 'past' ? ' aria-current="page"' : ''}>${tx('CMN-10.a.2')}</a></nav>
    ${list.length ? `<ul class="list card flush">${list.map(row).join('')}</ul>` : empty(tab === 'past' ? tx('CMN-10.empty.2') : tx('CMN-10.empty'))}
    <p class="t-body-lg">${tx('CMN-10.p')}</p>` };
}

// 시설 예약(CMN-08). 방, 날짜, 시간, 인원, (첫 예약이면 이용 규칙), 확인 순서. 단계는 view.step.
const RULES = { MEET: [tx('CMN-08.rules.MEET.1'), tx('CMN-08.rules.MEET.2'), tx('CMN-08.rules.MEET.3')] };
const rulesLines = (pl) => (RULES[pl.id] && pl.rulesText === SEED.places.find((x) => x.id === pl.id)?.rulesText ? RULES[pl.id] : pl.rulesText.split(',').map((x) => esc(x.trim())).filter(Boolean));
function facilityBook() {
  ensure();
  const bad = memberOnly() || memberOff('places'); if (bad) return bad;
  const rid = me().residentId, c = C();
  if (view.done) {
    const b = c.bookings.find((x) => x.id === view.done), pl = place(b.placeId);
    return { main: `<section class="stack"><h1 class="t-title3">${tx('CMN-08.doneH1')}</h1></section>
      <section class="card" aria-label="${tx('CMN-08.doneAria')}"><div class="alert">${ic('circle-check')}<div class="stack"><p class="t-body-lg"><b>${tx('CMN-08.doneB', { when: `${fmt.mdw(b.start)} ${fmt.ampm(b.start)}`, name: pl.name })}</b></p><p class="t-body-lg">${tx('CMN-08.doneP')}</p></div></div></section>
      <a class="btn btn-primary btn-block" href="${esc(href('CMN-07'))}">${tx('CMN-08.doneBtn')}</a>` };
  }
  const places = c.places.filter((p) => p.reservable), pl = place(view.room) && place(view.room).reservable ? place(view.room) : places[0];
  const today = ymdOf(db.now), need = needRules(rid, pl);
  const steps = ['room', 'day', 'time', 'people', ...(need ? ['rules'] : []), 'confirm'];
  const n = Math.min(Math.max(+view.step || 1, 1), steps.length), key = steps[n - 1];
  const days = Array.from({ length: view.more ? pl.windowDays + 1 : 7 }, (_, i) => addDays(today, i));
  const day = days.includes(view.day) ? view.day : '';
  const slots = day ? freeSlots(pl, day).filter((t) => !checkBooking({ pl, rid, ymd: day, start: t, end: toHM(mm(t) + pl.slot), people: 1 })) : [];
  const time = slots.includes(view.time) ? view.time : '';
  const people = +view.people >= 1 && +view.people <= pl.maxPeople ? +view.people : 0;
  const ok = { room: true, day: !!day, time: !!time, people: !!people, rules: true, confirm: true }[key];
  const radio = (name, val, cur, inner) => `<label class="opt"><input type="radio" name="${name}" value="${esc(val)}" data-bind="${name}" data-live${cur === val ? ' checked' : ''}>${inner}</label>`;
  const chips = (label, items) => `<div class="chips" role="group" aria-label="${label}">${items.map(([k, t, on]) => `<button class="chip" type="button" data-set="${k}" aria-pressed="${on}">${t}</button>`).join('')}</div>`;
  const endHm = time ? toHM(mm(time) + pl.slot) : '';
  const s = day && time ? mk(day, time) : '', e = day && time ? mk(day, endHm) : '';
  let h1 = '', sub = '', body = '', next = tx('CMN-08.next');
  if (key === 'room') {
    h1 = tx('CMN-08.h1'); sub = tx('CMN-08.p');
    body = `<div class="opts" role="radiogroup" aria-label="${tx('CMN-08.room')}">${places.map((p) => radio('room', p.id, pl.id, `<span class="stk"><b>${p.name}</b><span class="sub">${tx('CMN-08.roomSub', { desc: esc((p.desc || p.name).replace(/\.$/, '')), max: p.maxPeople })}</span></span>`)).join('')}</div>`;
  } else if (key === 'day') {
    h1 = tx('CMN-08.dateH1');
    body = `<div class="opts days" role="radiogroup" aria-label="${tx('CMN-08.date')}">${days.map((d, i) => radio('day', d, day, `<span>${i < 2 ? `<b>${i ? tx('CMN-08.tomorrow') : tx('CMN-08.today')}</b> ` : ''}${fmt.mdw(d)}</span>`)).join('')}</div>
      ${view.more ? '' : `<button class="btn btn-ghost back" type="button" data-set="more=1">${tx('CMN-08.more')}</button>`}<p class="t-body-md muted">${tx('CMN-08.dateNote', { n: pl.windowDays })}</p>`;
  } else if (key === 'time') {
    h1 = tx('CMN-08.timeH1'); sub = slots.length ? tx('CMN-08.timeP') : '';
    body = `${slots.length ? chips(tx('CMN-08.timeAria'), slots.map((t) => [`time=${t}`, fmt.ampm(mk(day, t)), time === t])) : empty(tx('CMN-08.timeEmpty'))}<p class="t-body-md muted">${tx('CMN-08.timeNote', { slot: durText(pl.slot), daily: durText(pl.dailyMax) })}</p>`;
  } else if (key === 'people') {
    h1 = tx('CMN-08.peopleH1');
    body = `${chips(tx('CMN-08.peopleAria'), Array.from({ length: pl.maxPeople }, (_, i) => [`people=${i + 1}`, tx('CMN-08.peopleN', { n: i + 1 }), people === i + 1]))}<p class="t-body-md muted">${tx('CMN-08.peopleNote', { short: pl.short, josa: josa(pl.short, tx('CMN-08.eun'), tx('CMN-08.neun')), max: pl.maxPeople })}</p>`;
  } else if (key === 'rules') {
    h1 = tx('CMN-08.rulesH1', { short: pl.short }); next = tx('CMN-08.rulesOk');
    body = `<section class="card" aria-label="${tx('CMN-08.rulesAria')}"><ul class="rules">${rulesLines(pl).map((t) => `<li>${ic('check')}<p class="t-body-lg">${t}</p></li>`).join('')}</ul></section>`;
  } else {
    const endLabel = halfOf(s) === halfOf(e) ? clockOnly(e) : fmt.ampm(e);
    h1 = tx('CMN-08.confirmH1', { when: `${fmt.mdw(s)} ${fmt.ampm(s)}`, end: endLabel, name: pl.name, josa: josa(pl.name, tx('CMN-03.josa.6'), tx('CMN-03.josa.5')) });
    body = `<section class="card" aria-label="${tx('CMN-08.confirmAria')}"><dl class="kv wide"><dt>${tx('CMN-08.dtRoom')}</dt><dd>${pl.name}</dd><dt>${tx('CMN-08.dtDate')}</dt><dd>${fmt.mdw(s)}</dd><dt>${tx('CMN-08.dtTime')}</dt><dd>${tx('CMN-08.ddTime', { start: fmt.ampm(s), end: endLabel })}</dd><dt>${tx('CMN-08.dtPeople')}</dt><dd>${tx('CMN-08.peopleN', { n: people })}</dd></dl></section>`;
  }
  const foot = key === 'confirm'
    ? `<div class="stack"><button class="btn btn-primary btn-block" type="button" data-act="cmn.rv.make">${tx('CMN-08.yes')}</button><button class="btn btn-secondary btn-block" type="button" data-set="step=1&room=&day=&time=&people=&more=">${tx('CMN-08.again')}</button></div>`
    : `<button class="btn btn-primary btn-block" type="button"${ok ? ` data-set="step=${n + 1}"` : ' disabled'}>${next}</button>`;
  return { main: `${n === 1 ? backLink(href('COM-09')) : `<button class="btn btn-ghost btn-md back" type="button" data-set="step=${n - 1}">${ic('chevron-left')}${tx('CMN-08.back')}</button>`}
    <div class="step-meta"><p class="t-label-lg muted">${tx('CMN-08.step', { n, total: steps.length })}</p><div class="progress" role="progressbar" aria-label="${tx('CMN-08.step', { n, total: steps.length })}" aria-valuemin="0" aria-valuemax="${steps.length}" aria-valuenow="${n}"><span style="width: ${Math.round((n / steps.length) * 100)}%;"></span></div></div>
    <section class="stack"><h1 class="t-title3">${h1}</h1>${sub ? `<p class="t-body-lg">${sub}</p>` : ''}</section>
    ${body}
    ${foot}` };
}

// 보호자 레지던스 공지(CMN-13). 첫 화면 칸에서 들어온다. 목록과 상세를 한 화면에 둔다.
function familyNotices({ id }) {
  ensure();
  const p = me();
  if (!['GUARDIAN', 'PROXY'].includes(p.key)) return denied(tx('CMN-13.denied'), tx('CMN-13.back'), href('FAM-06a'));
  if (!feat('notices')) return denied(tx('CMN-22.featOff'), tx('CMN-13.back'), href('FAM-06a'));
  const list = published().filter((n) => n.guardianVisible && isRecipient(n.id, p.residentId));
  const cur = list.find((n) => n.id === id) || list[0];
  const back = `<a class="btn btn-ghost btn-md" href="${esc(href('FAM-06a'))}" style="align-self: flex-start;">${ic('chevron-left')}${tx('CMN-13.back')}</a>`;
  const head = `<h1 class="t-title3">${tx('CMN-13.title')}</h1><p class="t-body-md muted">${tx('CMN-13.p')}</p>`;
  if (!cur) return { noRail: true, main: `${back}${head}${empty(tx('CMN-13.empty'))}` };
  return { noRail: true, main: `${back}${head}
    <div class="list-detail"><div class="ld-list"><section class="card" aria-label="${tx('CMN-13.list')}"><ul class="list">${list.map((n) => `<li class="cell"${n.id === cur.id ? ' aria-current="true"' : ''}><a class="body" href="${esc(href('CMN-13', { id: n.id }))}"><span class="title">${esc(n.title)}</span><span class="sub">${fmt.md(n.publishedAt)}</span></a>${ic('chevron-right')}</li>`).join('')}</ul></section></div>
    <div class="ld-detail"><section class="card" aria-labelledby="nh"><h2 id="nh" class="t-headline">${esc(cur.title)}</h2><p class="t-body-md">${esc(cur.body)}</p><p class="t-body-md muted">${tx('CMN-13.by', { title: esc(cur.authorTitle), name: esc(cur.authorName), md: fmt.md(cur.publishedAt) })}</p><p class="t-body-md muted">${tx('family.shared.text.22')}<span class="nowrap">(<a href="tel:0200000000">02-000-0000</a>${tx('family.shared.a')}</span>${tx('family.shared.span')}</p></section></div></div>` };
}

// ================================================================ 운영 화면
const TABS = [['today', tx('CMN-14.map.12')], ['program', tx('CMN-14.map.11'), 'programs'], ['facility', tx('CMN-14.map.10'), 'places'], ['notice', tx('CMN-14.text.3'), 'notices']];
const tabsRow = (cur) => `<div class="tabs">${TABS.filter(([, , f]) => !f || feat(f)).map(([k, l]) => `<a href="#" data-set="tab=${k}&prog=&r=&ack=&write=&dialog=&confirm=&preview="${cur === k ? ' aria-current="page"' : ''}>${l}</a>`).join('')}</div>`;
const pageHead = (title, crumb, acts) => `<div class="page-head"><div><nav class="crumb" aria-label="${tx('CMN-14.ariaLabel.6')}">${crumb}</nav><h1 class="t-title2">${title}</h1></div><div class="row">${asof()}<div class="hub-act">${acts}</div></div></div>`;
const crumbHome = `<a href="${href('CMN-14')}">${tx('CMN-14.a')}</a>`;
const FNOTE = `<p class="muted fnote">${tx('community.shared.p')}</p>`;
const todaySessions = () => C().sessions.filter((s) => s.status === 'ACTIVE' && ymdOf(s.startsAt) === ymdOf(db.now)).sort((a, b) => (a.startsAt < b.startsAt ? -1 : 1));
const pending = (s) => s.startsAt <= db.now && !s.savedAt;
const ackBoard = () => {
  const open = published().filter((n) => n.requiresAck).map((n) => ({ n, s: ackSummary(n) })).filter((x) => x.s.pending > 0);
  return { open, rooms: new Set(open.flatMap((x) => x.s.rec.filter((r) => !ackOf(x.n.id, r)))).size };
};

function hub(params) {
  ensure();
  const bad = staffOnly(); if (bad) return bad;
  const tab = TABS.some(([k, , f]) => k === v('tab', params.tab || 'today') && (!f || feat(f))) ? v('tab', params.tab || 'today') : 'today';
  let body = '', acts = '', overlayHtml = '';
  if (tab === 'today') {
    const ss = feat('programs') ? todaySessions() : [], rv = !feat('places') ? [] : C().bookings.filter((b) => b.kind === 'RESERVATION' && visBooking(b) && ymdOf(b.start) === ymdOf(db.now)).sort((a, b) => (a.start < b.start ? -1 : 1)), ab = feat('notices') ? ackBoard() : { open: [], rooms: 0 };
    const sessRows = ss.map((s) => `<li><a class="nl-row" href="${esc(href('CMN-17', { id: s.id, tab: s.startsAt <= db.now ? 'att' : 'roster' }))}" data-sess="${s.id}"><span class="nm"><b>${hmOf(s.startsAt)} ${progOf(s).name}</b><span class="sub">${placeOf(s).name}${s.capacity != null ? ` ${tx('CMN-14.text.23', { length: enrollsOf(s.id, 'ENROLLED').length, capacity: s.capacity })}` : ''}</span></span>${pending(s) ? `<span class="badge">${tx('CMN-14.span.7')}</span>` : ''}<span class="btn btn-ghost btn-sm" aria-hidden="true">${s.startsAt <= db.now ? tx('CMN-14.map.9') : tx('CMN-14.map.8')}</span></a></li>`).join('');
    const rvRows = rv.map((b) => `<li><a class="nl-row" href="#" data-set="tab=facility&date=${ymdOf(b.start)}"><span class="nm"><b>${hmOf(b.start)}~${hmOf(b.end)} ${place(b.placeId).name}</b><span class="sub">${tx('CMN-14.sub.3', { staffLabel: staffLabel(b.residentId), people: b.people })}</span></span><span class="btn btn-ghost btn-sm" aria-hidden="true">${tx('CMN-14.btn.5')}</span></a></li>`).join('');
    const ackRows = ab.open.map(({ n, s }) => `<li><a class="nl-row" href="#" data-set="tab=notice&ack=${n.id}"><span class="nm"><b>${esc(n.title)}</b><span class="sub">${tx('CMN-14.sub.2', { total: s.total, acked: s.acked, delivered: s.delivered, pending: s.pending })}</span></span><span class="btn btn-ghost btn-sm" aria-hidden="true">${tx('CMN-14.btn.4')}</span></a></li>`).join('');
    const card = (t, id, rows) => (rows ? `<section class="card nl-card" aria-labelledby="${id}"><div class="nl-head"><h2 id="${id}" class="t-heading2">${t}</h2></div><ul class="nl">${rows}</ul></section>` : '');
    body = `<div class="stat-strip" aria-label="${tx('CMN-14.ariaLabel.7')}"><div><span class="k">${tx('CMN-14.card.3')}</span><span class="v">${ss.length}</span></div><div><span class="k">${tx('CMN-14.span.11')}</span><span class="v">${ss.filter(pending).length}</span></div><div><span class="k">${tx('CMN-14.map.10')}</span><span class="v">${rv.length}</span></div><div><span class="k">${tx('CMN-14.card')}</span><span class="v">${ab.open.length}${ab.open.length ? `<span class="sub">${tx('CMN-14.sub', { rooms: ab.rooms })}</span>` : ''}</span></div></div>
      ${card(tx('CMN-14.card.3'), 't1', sessRows)}${card(tx('CMN-14.card.2'), 't2', rvRows)}${card(tx('CMN-14.card'), 't3', ackRows)}
      ${!sessRows && !rvRows && !ackRows ? empty(tx('CMN-14.empty')) : ''}${FNOTE}`;
    acts = canWrite() ? `<button class="btn btn-primary btn-sm" type="button" data-set="tab=notice&write=1">${ic('plus')}${tx('CMN-14.btn.3')}</button>` : '';
  }
  if (tab === 'program') ({ body, acts } = programTab());
  if (tab === 'facility') ({ body, acts, overlayHtml } = facilityTab(params));
  if (tab === 'notice') ({ body, acts, overlayHtml } = noticeTab());
  const crumb = tab === 'program' && view.prog ? `<a href="${href('CMN-14')}">${tx('CMN-14.title')}</a>` : crumbHome;
  const title = tab === 'program' && view.prog ? `${tx('CMN-14.text.22', { name: prog(view.prog).name })}` : tx('CMN-14.title');
  return { main: `${pageHead(title, crumb, acts)}${tabsRow(tab)}${body}`, overlay: overlayHtml };
}

function programTab() {
  if (!view.prog) {
    const rows = C().programs.map((p) => `<tr><td data-label="${tx('CMN-14.th.9')}"><b class="strong">${p.name}</b></td><td data-label="${tx('CMN-14.th.10')}">${p.weekdays.map((d) => DOWS[d]).join('·')} ${p.time}, ${p.minutes >= 60 ? `${tx('CMN-14.text.27', { floor: Math.floor(p.minutes / 60), v: p.minutes % 60 ? ` ${tx('CMN-14.text.21', { v: p.minutes % 60 })}` : '' })}` : `${tx('CMN-14.text.20', { minutes: p.minutes })}`}</td><td data-label="${tx('CMN-14.th.11')}">${place(p.placeId).name}</td><td data-label="${tx('CMN-14.th.12')}" class="num">${p.capacity ?? tx('CMN-14.map.7')}</td><td data-label="${tx('CMN-14.th.13')}">${staffName(p.lead)}</td><td><span class="row-act"><button class="btn btn-ghost btn-sm" type="button" data-set="prog=${p.id}" data-prog="${p.id}">${tx('CMN-14.btn.13')}</button></span></td></tr>`).join('');
    return { body: `<section class="card" aria-labelledby="p1"><h2 id="p1" class="t-heading2">${tx('CMN-14.h2.3')}</h2><div class="tbl reflow fit"><table><thead><tr><th scope="col">${tx('CMN-14.th.9')}</th><th scope="col">${tx('CMN-14.th.10')}</th><th scope="col">${tx('CMN-14.th.11')}</th><th scope="col">${tx('CMN-14.th.12')}</th><th scope="col">${tx('CMN-14.th.13')}</th><th scope="col"><span class="sr-only">${tx('CMN-14.span.3')}</span></th></tr></thead><tbody>${rows}</tbody></table></div><p class="muted">${tx('CMN-14.p.6')}</p></section>`, acts: '' };
  }
  const p = prog(view.prog);
  const list = C().sessions.filter((s) => s.programId === p.id && s.endsAt > db.now).sort((a, b) => (a.startsAt < b.startsAt ? -1 : 1)).slice(0, 5)
    .map((s) => ({ at: s.startsAt, s })).concat(C().failed.filter((f) => f.programId === p.id).map((f) => ({ at: f.startsAt, f }))).sort((a, b) => (a.at < b.at ? -1 : 1));
  const first = list.find((x) => x.s)?.s;
  const rows = list.map(({ s, f, at }) => {
    const label = `${mdDow(at)} ${hmOf(at)}`;
    if (f) return `<tr><td data-label="${tx('CMN-14.h2.2')}"><b class="strong">${label}</b></td><td data-label="${tx('CMN-14.th.7')}" class="num">${tx('CMN-14.map.6')}</td><td data-label="${tx('CMN-14.th.8')}" class="num">${tx('CMN-14.map.6')}</td><td data-label="${tx('CMN-14.th.4')}" class="wrap">${tx('CMN-14.td')}</td><td></td></tr>`;
    const full = s.capacity != null && seatsLeft(s) <= 0;
    return `<tr${s === first ? ' class="sel"' : ''}><td data-label="${tx('CMN-14.h2.2')}"><b class="strong">${label}</b></td><td data-label="${tx('CMN-14.th.7')}" class="num">${s.capacity == null ? tx('CMN-14.map.6') : `${enrollsOf(s.id, 'ENROLLED').length}/${s.capacity}`}</td><td data-label="${tx('CMN-14.th.8')}" class="num">${s.capacity == null ? tx('CMN-14.map.6') : waitlist(s).length}</td><td data-label="${tx('CMN-14.th.4')}" class="wrap">${full ? tx('CMN-14.map.5') : ''}</td><td><span class="row-act"><a class="btn btn-ghost btn-sm" href="${esc(href('CMN-17', { id: s.id }))}">${tx('CMN-14.btn.12')}</a></span></td></tr>`;
  }).join('');
  const aside = first ? `<aside class="card detail" aria-label="${tx('CMN-14.ariaLabel.8')}"><div class="stack" style="gap: 2px;"><span class="rq-kind">${p.name}</span><h2 class="t-heading2">${mdDow(first.startsAt)} ${hmOf(first.startsAt)}</h2></div>
    <dl class="kv"><dt>${tx('CMN-14.th.11')}</dt><dd>${placeOf(first).name}</dd><dt>${tx('CMN-14.th.13')}</dt><dd>${staffName(p.lead)}</dd><dt>${tx('CMN-14.th.7')}</dt><dd class="num">${first.capacity == null ? tx('CMN-14.text.19') : `${enrollsOf(first.id, 'ENROLLED').length}/${first.capacity}${seatsLeft(first) <= 0 ? tx('CMN-14.text.18') : ''}`}</dd>${first.capacity == null ? '' : `<dt>${tx('CMN-14.th.8')}</dt><dd class="num">${waitlist(first).length}</dd>`}</dl>
    <a class="btn btn-primary btn-sm" href="${esc(href('CMN-17', { id: first.id }))}">${tx('CMN-14.btn.11')}</a></aside>` : '';
  return { body: `<div class="q-split"><div class="q-list"><section class="card" aria-labelledby="s1" style="min-width: 0;"><h2 id="s1" class="t-heading2">${tx('CMN-14.h2.2')}</h2><div class="tbl reflow fit"><table><thead><tr><th scope="col">${tx('CMN-14.h2.2')}</th><th scope="col">${tx('CMN-14.th.7')}</th><th scope="col">${tx('CMN-14.th.8')}</th><th scope="col">${tx('CMN-14.th.4')}</th><th scope="col"><span class="sr-only">${tx('CMN-14.span.3')}</span></th></tr></thead><tbody>${rows}</tbody></table></div></section><p class="muted">${tx('CMN-14.p.5')}</p></div>${aside}</div>`, acts: '' };
}

// ---- 시설 예약 탭(CMN-19)
function facilityTab(params) {
  const today = ymdOf(db.now), date = v('date', params.date || today), places = C().places.filter((p) => p.reservable);
  const G0 = 540, G1 = 1260, rowOf = (m) => 2 + (m - G0) / 30;
  const times = []; for (let m = G0; m < G1; m += 60) times.push(`<div class="tm" style="grid-column:1;grid-row:${rowOf(m)}/span 2">${toHM(m)}</div>`);
  const cell = (col, a, b, cls, inner) => `<div class="c ${cls}" style="grid-column:${col};grid-row:${rowOf(a)}/${rowOf(b)}"><span>${inner}</span></div>`;
  const cols = places.map((pl, i) => {
    const col = i + 2, out = []; let cur = mm(pl.openFrom);
    if (cur > G0) out.push(cell(col, G0, cur, 'hatch', `${ic('ban')}${tx('CMN-14.text.13', { openFrom: pl.openFrom, openTo: pl.openTo })}`));
    const vac = (a, b) => cell(col, a, b, 'vac', b - a > 60 ? `${tx('CMN-14.text.17', { toHM: toHM(a), toHM2: toHM(b) })}` : tx('CMN-14.i'));
    for (const b of bookingsOn(pl.id, date)) {
      const a = mm(hmOf(b.start)), e = mm(hmOf(b.end)), tm = `${hmOf(b.start)}~${hmOf(b.end)}`;
      if (a > cur) out.push(vac(cur, a));
      if (b.kind === 'SESSION') out.push(cell(col, a, e, 'solid', `${ic('calendar')}${tx('CMN-14.text.16', { tm, name: progOf(sess(b.sessionId)).name })}`));
      else if (b.kind === 'BLOCK') out.push(cell(col, a, e, 'hatch', `${ic('ban')}${tx('CMN-14.text.15', { tm })}`));
      else out.push(cell(col, a, e, 'solid', `${ic('user')}${tx('CMN-14.text.14', { tm, staffLabel: staffLabel(b.residentId), people: b.people })}`));
      cur = Math.max(cur, e);
    }
    if (cur < mm(pl.openTo)) out.push(vac(cur, mm(pl.openTo)));
    if (mm(pl.openTo) < G1) out.push(cell(col, mm(pl.openTo), G1, 'hatch', `${ic('ban')}${tx('CMN-14.text.13', { openFrom: pl.openFrom, openTo: pl.openTo })}`));
    return out.join('');
  }).join('');
  const head = places.map((pl, i) => `<div class="h" style="grid-column:${i + 2}">${pl.name}</div>`).join('');
  const body = `<section class="stack" aria-label="${tx('CMN-14.ariaLabel')}"><div class="day-nav"><button class="btn btn-secondary btn-sm" type="button" aria-label="${tx('CMN-14.ariaLabel.2')}" data-set="date=${addDays(date, -1)}">${ic('chevron-left')}</button><h2 class="t-heading2">${fmt.mdw(date)}</h2><button class="btn btn-secondary btn-sm" type="button" aria-label="${tx('CMN-14.ariaLabel.3')}" data-set="date=${addDays(date, 1)}">${ic('chevron-right')}</button></div>
    <div class="legend" aria-label="${tx('CMN-14.ariaLabel.4')}"><span><i></i>${tx('CMN-14.i')}</span><span><i class="solid"></i>${tx('CMN-14.i.2')}</span><span><i class="hatch"></i>${tx('CMN-14.i.3')}</span></div>
    <div class="dg" role="group" aria-label="${tx('CMN-14.ariaLabel.5', { mdDow: mdDow(date) })}"><div class="h" style="grid-column:1"><span class="sr-only">${tx('CMN-14.span.6')}</span></div>${head}${times.join('')}${cols}</div></section>
    <p class="muted fnote">${tx('CMN-14.p.4')}</p>`;
  const acts = canWrite() ? `<button class="btn btn-primary btn-sm" type="button" data-set="dialog=rv">${ic('plus')}${tx('CMN-14.formDlg.2')}</button>` : '';
  return { body, acts, overlayHtml: view.dialog === 'rv' ? proxyReservationDialog(date, places) : '' };
}

function proxyReservationDialog(date, places) {
  const pl = place(v('rvFac', places[0].id)), res = residents().map((r) => r.id).sort(byRoom);
  const rid = res.includes(view.rvRes) ? view.rvRes : res[0], free = freeSlots(pl, date);
  const start = v('rvStart', free[0] ?? pl.openFrom), end = view.rvEnd ?? toHM(mm(start) + pl.slot);
  const hours = (a, b) => { const o = []; for (let m = mm(a); m <= mm(b); m += 60) o.push([toHM(m), toHM(m)]); return o; };
  const people = parseInt(v('rvPeople', '1'), 10) || 1;
  const err = checkBooking({ pl, rid, ymd: date, start, end, people });
  const needRule = needRules(rid, pl), ok = !err && (!needRule || view.rvRules);
  const body = `<p class="muted">${tx('CMN-14.p.10', { name: pl.name, md: fmt.md(date), dowName: dowName(date), staffName: staffName(me().id) })}</p>
    ${sel('rv-fac', tx('CMN-14.sel.3'), 'rvFac', places.map((x) => [x.id, x.name]), pl.id)}
    <fieldset style="border: 0; padding: 0; margin: 0;"><legend class="label" style="font-weight: 600; margin-bottom: 4px;">${tx('CMN-14.legend')}</legend>
      <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;">${sel('rv-s', `<span class="sr-only">${tx('CMN-14.span.5')}</span>`, 'rvStart', hours(pl.openFrom, toHM(mm(pl.openTo) - pl.slot)), start)}${sel('rv-e', `<span class="sr-only">${tx('CMN-14.span.4')}</span>`, 'rvEnd', hours(toHM(mm(pl.openFrom) + pl.slot), pl.openTo), end)}</div>
      ${err ? `<p class="err-msg" style="margin-top:8px;">${ic('circle-alert')}${err}</p>` : ''}</fieldset>
    ${sel('rv-res', tx('CMN-14.sel.2'), 'rvRes', res.map((r) => [r, `${roomOf(r)} ${nameOf(r)}`]), rid)}
    <div class="field"><label for="rv-n">${tx('CMN-14.label.4')}</label><input id="rv-n" class="input" type="text" name="rvPeople" data-bind="rvPeople" data-live value="${esc(v('rvPeople', '1'))}"></div>
    ${radios(tx('CMN-14.radios.5'), 'rvHow', HOWS, v('rvHow', 'PHONE'))}
    ${needRule ? `<label class="choice"><input type="checkbox" name="rvRules" data-bind="rvRules" data-live>${tx('CMN-14.input', { short: pl.short, rulesText: esc(pl.rulesText) })}</label>` : ''}`;
  return formDlg('cmn-dialog', 'cmn.rv.proxy', `data-date="${date}"`, tx('CMN-14.formDlg.2'), body, `${close(tx('CMN-14.close'))}<button class="btn btn-primary btn-md" type="submit"${ok ? '' : ' disabled'}>${tx('CMN-14.btn.10')}</button>`);
}

// ---- 공지 탭(CMN-14 공지 + CMN-20 쓰기 + CMN-21 확인 현황)
function noticeTab() {
  const rows = [...C().notices.filter((n) => n.status === 'PUBLISHED').sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1)), ...C().notices.filter((n) => n.status === 'SCHEDULED')].map((n) => {
    const s = ackSummary(n), live = n.status === 'PUBLISHED';
    const target = `${n.audience === 'ALL' ? tx('CMN-14.text.8') : `${tx('CMN-14.text.12', { audience: n.audience })}`}${n.guardianVisible ? tx('CMN-14.map.4') : ''}`;
    const kind = n.requiresAck ? `${tx('CMN-14.text.26', { v: n.sendSms ? tx('CMN-14.map.3') : '' })}` : tx('CMN-14.map.2');
    const stateText = live ? `${tx('CMN-14.text.11', { md: md(n.publishedAt), hmOf: hmOf(n.publishedAt) })}` : `${tx('CMN-14.text.10', { md: md(n.publishAt), hmOf: hmOf(n.publishAt) })}`;
    const ack = !n.requiresAck ? tx('CMN-14.map') : `${tx('CMN-14.text.25', { acked: s.acked, v: s.delivered ? `${tx('CMN-14.text.9', { delivered: s.delivered })}` : '', total: s.total })}`;
    return `<tr><td data-label="${tx('CMN-14.th')}" class="wrap" style="min-width:16em"><b class="strong">${esc(n.title)}</b></td><td data-label="${tx('CMN-14.th.2')}">${target}</td><td data-label="${tx('CMN-14.th.3')}">${kind}</td><td data-label="${tx('CMN-14.th.4')}">${stateText}</td><td data-label="${tx('CMN-14.th.5')}">${esc(n.authorName)}</td><td data-label="${tx('CMN-14.th.6')}">${ack}</td><td><span class="row-act">${n.requiresAck && live ? `<button class="btn btn-ghost btn-sm" type="button" data-set="ack=${n.id}">${tx('CMN-14.btn.4')}</button>` : ''}</span></td></tr>`;
  }).join('');
  const body = `<section class="card" aria-labelledby="n1"><h2 id="n1" class="t-heading2">${tx('CMN-14.h2')}</h2><div class="tbl reflow fit"><table><thead><tr><th scope="col">${tx('CMN-14.th')}</th><th scope="col">${tx('CMN-14.th.2')}</th><th scope="col">${tx('CMN-14.th.3')}</th><th scope="col">${tx('CMN-14.th.4')}</th><th scope="col">${tx('CMN-14.th.5')}</th><th scope="col">${tx('CMN-14.th.6')}</th><th scope="col"><span class="sr-only">${tx('CMN-14.span.3')}</span></th></tr></thead><tbody>${rows}</tbody></table></div><p class="muted">${tx('CMN-14.p.3')}</p></section>`;
  const acts = canWrite() ? `<button class="btn btn-primary btn-sm" type="button" data-set="write=1">${ic('plus')}${tx('CMN-14.btn.3')}</button>` : '';
  const parts = [];
  if (view.write) parts.push(writeSheet());
  if (view.ack) parts.push(ackSheet(view.ack));
  if (view.confirm) parts.push(confirmDialog());
  if (view.preview) parts.push(previewDialog());
  if (view.dialog === 'ack') parts.push(deliverDialog());
  return { body, acts, overlayHtml: parts.join('') };
}

const TARGETS = [['ALL', tx('CMN-14.text.8')], ['A', tx('CMN-14.text.7')], ['B', tx('CMN-14.text.6')]];
const targetCount = (code) => residents().filter((r) => inAudience(code, r.id)).length;
function writeSheet() {
  const ok = (view.wTitle || '').trim() && (view.wBody || '').trim();
  const box = (name, label, hint) => `<label class="choice"><input type="checkbox" name="${name}" data-bind="${name}"${view[name] ? ' checked' : ''}>${label}</label><span class="hint">${hint}</span>`;
  return sheetWrap(`<section class="rsheet" role="dialog" aria-modal="true" aria-labelledby="rs20-t"><header><h2 id="rs20-t" class="t-heading1">${tx('CMN-14.btn.3')}</h2><button class="btn btn-ghost btn-sm" type="button" aria-label="${tx('CMN-14.btn')}" data-set="write=&confirm=&preview=">${ic('x')}</button></header>
    <div class="body">
      <div class="field"><label for="w-title">${tx('CMN-14.label.2')}</label><input id="w-title" class="input" type="text" name="wTitle" data-bind="wTitle" data-live value=""><span class="hint">${tx('CMN-14.span.9')}</span></div>
      <div class="field"><label for="w-body">${tx('CMN-14.label.3')}</label><textarea id="w-body" class="input" name="wBody" data-bind="wBody" data-live></textarea><span class="hint">${tx('CMN-14.span.10')}</span></div>
      ${sel('w-to', tx('CMN-14.sel'), 'wTo', TARGETS, v('wTo', 'ALL'))}
      <div class="stack" style="gap:4px;">
        ${box('wImportant', tx('CMN-14.box.6'), tx('CMN-14.box.5'))}
        ${box('wGuardian', tx('CMN-14.box.4'), tx('CMN-14.box.3'))}
        ${box('wSms', tx('CMN-14.box.2'), tx('CMN-14.box'))}
      </div></div>
    <footer><button class="btn btn-ghost btn-sm" type="button" data-set="write=&confirm=&preview=">${tx('CMN-14.close')}</button><button class="btn btn-ghost btn-sm" type="button" data-set="preview=1"${ok ? '' : ' disabled'}>${ic('eye')}${tx('CMN-14.btn.9')}</button><button class="btn btn-primary btn-sm sheet-foot-main" type="button" data-set="confirm=1"${ok ? '' : ' disabled'}>${tx('CMN-14.btn.2')}</button></footer></section>`);
}
function confirmDialog() {
  const code = v('wTo', 'ALL'), n = targetCount(code), label = TARGETS.find(([k]) => k === code)[1];
  const text = n === 0 ? `${tx('CMN-14.text.5', { label })}` : `${tx('CMN-14.text.24', { label, n, v: view.wImportant ? tx('CMN-14.text.4') : tx('CMN-14.text.3'), v2: view.wSms ? tx('CMN-14.text.2') : tx('CMN-14.text') })}`;
  return dlg('cmn-confirm', text, '', `<button class="btn btn-secondary btn-md" type="button" data-set="confirm=">${tx('CMN-14.btn.8')}</button>${n ? `<button class="btn btn-primary btn-md" type="button" data-act="cmn.notice.publish">${tx('CMN-14.btn.2')}</button>` : ''}`);
}
function previewDialog() {
  return dlg('cmn-preview', esc(view.wTitle || ''), `<p class="t-body-lg">${esc(view.wBody || '')}</p>${view.wImportant ? `<p class="muted">${tx('CMN-14.p.2')}</p>` : ''}`, `<button class="btn btn-secondary btn-md" type="button" data-set="preview=">${tx('CMN-14.btn')}</button>`);
}

function ackSheet(nid) {
  const n = C().notices.find((x) => x.id === nid);
  if (!n) return '';
  const s = ackSummary(n), order = { none: 0, DELIVERED_IN_PERSON: 1, ACKED: 2 };
  const list = s.rec.slice().sort((a, b) => order[ackOf(nid, a)?.kind ?? 'none'] - order[ackOf(nid, b)?.kind ?? 'none'] || byRoom(a, b));
  const row = (rid) => {
    const a = ackOf(nid, rid), who = `<b>${staffLabel(rid)}</b>`;
    if (a?.kind === 'ACKED') return `<li><div class="nl-row"><span class="nm">${who}<span class="sub">${hmOf(a.at)}</span></span><span class="badge">${ic('check')}${tx('CMN-14.span.2')}</span></div></li>`;
    if (a) return `<li><div class="nl-row"><span class="nm">${who}<span class="sub">${hmOf(a.at)}, ${staffName(a.by)}, ${{ PHONE: tx('CMN-14.radios.3'), VISIT: tx('CMN-14.radios.2'), FRONT_DESK: tx('CMN-14.radios') }[a.method]}</span></span><span class="badge">${ic('x2')}${tx('CMN-14.formDlg')}</span></div></li>`;
    const ab = absenceText(rid), inner = `<span class="nm">${who}${ab ? `<span class="sub">${ab}</span>` : ''}</span><span class="badge">${ic('x2')}${tx('CMN-14.span')}</span>`;
    return canWrite() ? `<li><button class="nl-row" type="button" data-set="dialog=ack&rid=${rid}">${inner}<span class="btn btn-ghost btn-sm" aria-hidden="true">${tx('CMN-14.formDlg')}</span></button></li>` : `<li><div class="nl-row">${inner}</div></li>`;
  };
  return sheetWrap(`<section class="rsheet" role="dialog" aria-modal="true" aria-labelledby="rs21-t"><header><h2 id="rs21-t" class="t-heading1">${tx('CMN-14.h2.4', { title: esc(n.title) })}</h2><button class="btn btn-ghost btn-sm" type="button" aria-label="${tx('CMN-14.btn')}" data-set="ack=&dialog=">${ic('x')}</button></header>
    <div class="body"><span class="asof">${tx('CMN-14.span.8', { hmOf: hmOf(db.now) })} <button class="btn btn-ghost btn-sm" type="button" data-set="r=${db.now}">${tx('CMN-14.btn.7')}</button></span>
      <div class="stat-strip" aria-label="${tx('CMN-14.ariaLabel.7')}"><div><span class="k">${tx('CMN-14.th.2')}</span><span class="v">${s.total}</span></div><div><span class="k">${tx('CMN-14.span.2')}</span><span class="v">${s.acked}</span></div><div><span class="k">${tx('CMN-14.formDlg')}</span><span class="v">${s.delivered}</span></div><div><span class="k">${tx('CMN-14.span')}</span><span class="v">${s.pending}</span></div></div>
      <p class="muted">${tx('CMN-14.p.8')}</p>
      ${s.pending === 0 ? `<p class="muted">${tx('CMN-14.p', { total: s.total })}</p>` : ''}
      <section class="card nl-card" aria-label="${tx('CMN-14.btn.4')}"><ul class="nl">${list.map(row).join('')}</ul></section>
      <p class="muted fnote">${tx('CMN-14.p.9')}</p></div></section>`);
}
function deliverDialog() {
  return formDlg('cmn-dialog', 'cmn.notice.deliver', `data-nid="${view.ack}" data-rid="${view.rid}"`, tx('CMN-14.formDlg'),
    `<p class="muted">${tx('CMN-14.p.7', { staffLabel: staffLabel(view.rid) })}</p>${radios(tx('CMN-14.radios.4'), 'dHow', [['PHONE', tx('CMN-14.radios.3')], ['VISIT', tx('CMN-14.radios.2')], ['FRONT_DESK', tx('CMN-14.radios')]], v('dHow', 'PHONE'))}
    <div class="field"><label for="d-memo">${tx('CMN-14.label')}</label><textarea id="d-memo" class="input" name="dMemo" data-bind="dMemo" placeholder="${tx('CMN-14.placeholder')}"></textarea></div>`,
    `${close(tx('CMN-14.close'))}<button class="btn btn-primary btn-md" type="submit">${tx('CMN-14.btn.6')}</button>`);
}

// ---- CMN-17 신청 명단 / 출석 체크
function sessionPage(params) {
  ensure();
  const bad = staffOnly(); if (bad) return bad;
  const s = sess(params.id);
  if (!s) return denied(tx('CMN-17.denied'), tx('CMN-17.a'), href('CMN-14'));
  const tab = v('tab', params.tab || 'roster'), p = progOf(s), label = `${mdDow(s.startsAt)} ${hmOf(s.startsAt)} ${p.name}`;
  const tabs = `<div class="tabs"><a href="#" data-set="tab=roster&dialog="${tab === 'roster' ? ' aria-current="page"' : ''}>${tx('CMN-17.ariaLabel.2')}</a><a href="#" data-set="tab=att&dialog="${tab === 'att' ? ' aria-current="page"' : ''}>${tx('CMN-17.a.3')}</a></div>`;
  const crumb = `<a href="${href('CMN-14')}">${tx('CMN-17.a')}</a> / <a href="${href('CMN-14', { tab: 'program' })}">${tx('CMN-17.a.2')}</a>`;
  const page = tab === 'att' ? attendanceTab(s, label, tabs, crumb) : rosterTab(s, label, tabs, crumb);
  return page;
}

function rosterTab(s, label, tabs, crumb) {
  const enrolled = enrollsOf(s.id, 'ENROLLED'), wait = waitlist(s), started = s.startsAt <= db.now, closed = db.now >= deadlineOf(s);
  const can = canWrite() && !started && s.status === 'ACTIVE';
  const free = s.capacity == null ? 0 : seatsLeft(s);
  const firstPromotable = closed && free > 0 ? wait[0] : null;
  const src = (e) => `${SOURCE[e.source](e)} ${md(e.queuedAt)}`;
  const ab = (rid) => { const t = absenceText(rid); return t ? ` · ${t}` : ''; };
  const eRow = (e) => {
    const sub = e.promotedAt ? (e.promotedBy ? `${tx('CMN-17.text.9', { hmOf: hmOf(e.promotedAt) })}` : `${tx('CMN-17.text.8', { hmOf: hmOf(e.promotedAt) })}`) : `${tx('CMN-17.text.7', { src: src(e) })}`;
    const inner = `<span class="nm"><b>${staffLabel(e.residentId)}</b><span class="sub">${sub}${ab(e.residentId)}</span></span>`;
    return can ? `<li><button class="nl-row" type="button" data-set="dialog=cancel&eid=${e.id}" data-eid="${e.id}">${inner}<span class="btn btn-ghost btn-sm" aria-hidden="true">${tx('CMN-17.formDlg.7')}</span></button></li>` : `<li><div class="nl-row">${inner}</div></li>`;
  };
  const wRow = (e, i) => {
    const skipped = free > 0 && !closed && absence(e.residentId) && (!absence(e.residentId).expectedOn || absence(e.residentId).expectedOn > ymdOf(s.startsAt));
    const sub = skipped ? tx('CMN-17.text.6') : `${tx('CMN-17.text.5', { md: md(e.queuedAt), hmOf: hmOf(e.queuedAt), undefined: SOURCE[e.source](e), ab: ab(e.residentId) })}`;
    const inner = `<span class="nm"><b>${tx('CMN-17.b', { v: i + 1, staffLabel: staffLabel(e.residentId) })}</b><span class="sub">${sub}</span></span>`;
    if (!can) return `<li><div class="nl-row">${inner}</div></li>`;
    const promo = firstPromotable?.id === e.id;
    return `<li><button class="nl-row" type="button" data-set="dialog=${promo ? 'promote' : 'leave'}&eid=${e.id}" data-eid="${e.id}">${inner}<span class="btn btn-ghost btn-sm" aria-hidden="true">${promo ? tx('CMN-17.formDlg.5') : tx('CMN-17.text.4')}</span></button></li>`;
  };
  const alertHtml = firstPromotable ? `<div class="alert">${ic('info')}<p>${tx('CMN-17.p.6', { free, staffLabel: staffLabel(firstPromotable.residentId) })}</p></div>` : '';
  const list = enrolled.map(eRow).join('') + (wait.length ? `<li class="nl-sep">${tx('CMN-17.li')}</li>${wait.map(wRow).join('')}` : '');
  const acts = can && s.capacity != null ? `<button class="btn btn-primary btn-sm" type="button" data-set="dialog=pe">${ic('plus')}${tx('CMN-17.formDlg.4')}</button>` : '';
  return {
    main: `<div class="page-head"><div><nav class="crumb" aria-label="${tx('CMN-17.ariaLabel.3')}">${crumb}</nav><h1 class="t-title2">${tx('CMN-17.h1.2', { label })}</h1></div><div class="row">${asof()}${acts}</div></div>${tabs}${alertHtml}
      ${s.capacity == null ? empty(tx('CMN-17.empty.3')) : `<div class="stat-strip" aria-label="${tx('CMN-17.ariaLabel.4')}"><div><span class="k">${tx('CMN-17.span.4')}</span><span class="v">${enrolled.length}/${s.capacity}</span></div><div><span class="k">${tx('CMN-17.span.5')}</span><span class="v">${wait.length}</span></div></div>
      ${list ? `<section class="card nl-card" aria-label="${tx('CMN-17.ariaLabel.2')}"><ul class="nl">${list}</ul></section>` : empty(tx('CMN-17.empty.2'))}`}`,
    overlay: rosterDialog(s),
  };
}

function rosterDialog(s) {
  const d = view.dialog, e = C().enrollments.find((x) => x.id === view.eid), p = progOf(s);
  const how = radios(tx('CMN-17.radios'), 'sHow', HOWS, v('sHow', 'PHONE'));
  const sub = `${mdDow(s.startsAt)} ${hmOf(s.startsAt)} ${p.name}`;
  if (d === 'cancel' && e) return formDlg('cmn-dialog', 'cmn.pc', `data-eid="${e.id}"`, tx('CMN-17.formDlg.7'), `<p class="muted">${staffLabel(e.residentId)} · ${sub}</p>${how}`, `${close(tx('CMN-17.close.2'))}<button class="btn btn-primary btn-md" type="submit">${tx('CMN-17.formDlg.7')}</button>`);
  if (d === 'leave' && e) return formDlg('cmn-dialog', 'cmn.pl', `data-eid="${e.id}"`, tx('CMN-17.formDlg.6'), `<p>${tx('CMN-17.p.5', { staffLabel: staffLabel(e.residentId) })}</p>${how}`, `${close(tx('CMN-17.close.2'))}<button class="btn btn-primary btn-md" type="submit">${tx('CMN-17.btn.4')}</button>`);
  if (d === 'promote' && e) return formDlg('cmn-dialog', 'cmn.pp', `data-eid="${e.id}"`, tx('CMN-17.formDlg.5'), `<p>${tx('CMN-17.p.4', { staffLabel: staffLabel(e.residentId) })}</p>${how}`, `${close(tx('CMN-17.close.2'))}<button class="btn btn-primary btn-md" type="submit">${tx('CMN-17.formDlg.5')}</button>`);
  if (d === 'pe') {
    const cand = residents().map((r) => r.id).filter((r) => !openEnroll(s.id, r)).sort(byRoom);
    const rooms = [...new Set(cand.map(roomOf))], room = rooms.includes(view.peRoom) ? view.peRoom : rooms[0];
    const names = cand.filter((r) => roomOf(r) === room), rid = names.includes(view.peRes) ? view.peRes : names[0];
    const full = seatsLeft(s) <= 0 || waitlist(s).length > 0;
    return formDlg('cmn-dialog', 'cmn.pe', `data-id="${s.id}"`, tx('CMN-17.formDlg.4'),
      `<p class="muted">${tx('CMN-17.p.8', { staffName: staffName(me().id) })}</p><p class="strong"><b>${sub}</b></p>
      ${sel('pe-room', tx('CMN-17.sel.2'), 'peRoom', rooms.map((r) => [r, r]), room)}${sel('pe-res', tx('CMN-17.sel'), 'peRes', names.map((r) => [r, nameOf(r)]), rid)}${how}
      ${full ? `<p class="err-msg">${ic('circle-alert')}${tx('CMN-17.p.3', { length: enrollsOf(s.id, 'ENROLLED').length, capacity: s.capacity })}</p>` : ''}`,
      `${close(tx('CMN-17.close'))}<button class="btn btn-primary btn-md" type="submit"${rid ? '' : ' disabled'}>${full ? tx('CMN-17.formDlg.3') : tx('CMN-17.formDlg.2')}</button>`);
  }
  return '';
}

function attendanceTab(s, label, tabs, crumb) {
  const c = C(), saved = !!s.savedAt, editing = !saved || view.editing;
  const enrolled = enrollsOf(s.id, 'ENROLLED').map((e) => e.residentId).sort((a, b) => (absence(a) ? 1 : 0) - (absence(b) ? 1 : 0) || byRoom(a, b));
  const rows = c.attendance.filter((a) => a.sessionId === s.id);
  const on = view.att ?? Object.fromEntries(rows.filter((a) => a.kind === 'ATTENDED').map((a) => [a.residentId, true]));
  const walk = view.walk ?? rows.filter((a) => a.kind === 'WALK_IN').map((a) => a.residentId);
  const can = canAttend() && editing;
  const att = enrolled.filter((r) => on[r]).length;
  const row = (rid, extra, pressed) => {
    const ab = absenceText(rid), inner = `<span class="nm"><b>${staffLabel(rid)}</b>${extra ? `<span class="sub">${extra}</span>` : ''}</span>${ab ? `<span class="badge">${ic('x2')}${tx('CMN-17.span')}</span>` : ''}<span class="tog" aria-hidden="true">${pressed ? `${ic('check')}${tx('CMN-17.text.3')}` : tx('CMN-17.text.2')}</span>`;
    return can ? `<li><button class="nl-row" type="button" aria-pressed="${pressed}" data-act="cmn.att.toggle" data-rid="${rid}" data-sid="${s.id}">${inner}</button></li>` : `<li><div class="nl-row" aria-pressed="${pressed}">${inner}</div></li>`;
  };
  const sameDay = ymdOf(db.now) === ymdOf(s.startsAt);
  const savedBox = saved && !view.editing ? `<div class="alert">${ic('check')}<div><p><b>${tx('CMN-17.b.2', { length: enrolled.length, att, v: walk.length ? `${tx('CMN-17.text', { length: walk.length })}` : '' })}</b></p><p>${tx('CMN-17.p.7')}</p></div></div>` : '';
  const tiles = `<div class="stat-strip" aria-label="${tx('CMN-17.ariaLabel.4')}"><div><span class="k">${tx('CMN-17.span.3')}</span><span class="v">${enrolled.length}</span></div><div><span class="k">${tx('CMN-17.text.2')}</span><span class="v">${att}</span></div>${walk.length ? `<div><span class="k">${tx('CMN-17.row')}</span><span class="v">${walk.length}</span></div>` : ''}</div>`;
  const foot = !canAttend() ? '' : editing
    ? `<button class="btn btn-secondary btn-sm" type="button" style="align-self:flex-start;" data-set="dialog=walk">${ic('plus')}${tx('CMN-17.formDlg')}</button><div class="sticky-act desk"><button class="btn btn-primary btn-sm" type="button" data-act="cmn.att.save" data-sid="${s.id}">${tx('CMN-17.btn.2')}</button></div>`
    : sameDay ? `<div class="sticky-act desk"><button class="btn btn-secondary btn-sm" type="button" data-act="cmn.att.edit" data-sid="${s.id}">${tx('CMN-17.btn')}</button></div>`
      : `<p class="muted">${tx('CMN-17.p.2', { md: md(s.startsAt), name: progOf(s).name })}</p>`;
  const list = enrolled.map((r) => row(r, '', !!on[r])).join('') + (walk.length ? `<li class="nl-sep">${tx('CMN-17.li.2')}</li>${walk.map((r) => row(r, tx('CMN-17.row'), true)).join('')}` : '');
  return {
    main: `<div class="page-head"><div><nav class="crumb" aria-label="${tx('CMN-17.ariaLabel.3')}">${crumb}</nav><h1 class="t-title2">${tx('CMN-17.h1', { label })}</h1></div><span class="asof">${tx('CMN-17.span.2', { hmOf: hmOf(db.now) })}</span></div>${tabs}
      ${savedBox || (can ? `<p class="muted">${tx('CMN-17.p')}</p>` : '')}${tiles}
      ${list ? `<section class="card nl-card" aria-label="${tx('CMN-17.ariaLabel')}"><ul class="nl">${list}</ul></section>` : empty(tx('CMN-17.empty'))}${foot}${FNOTE}`,
    overlay: view.dialog === 'walk' ? walkDialog(s, enrolled, walk) : '',
  };
}
function walkDialog(s, enrolled, walk) {
  const cand = residents().map((r) => r.id).filter((r) => !enrolled.includes(r) && !walk.includes(r)).sort(byRoom);
  const rooms = [...new Set(cand.map(roomOf))], room = rooms.includes(view.wiRoom) ? view.wiRoom : rooms[0];
  const names = cand.filter((r) => roomOf(r) === room), rid = names.includes(view.wiRes) ? view.wiRes : names[0];
  return formDlg('cmn-dialog', 'cmn.att.walkin', `data-sid="${s.id}"`, tx('CMN-17.formDlg'),
    `<p class="muted">${mdDow(s.startsAt)} ${hmOf(s.startsAt)} ${progOf(s).name}</p>${sel('wi-room', tx('CMN-17.sel.2'), 'wiRoom', rooms.map((r) => [r, r]), room)}${sel('wi-res', tx('CMN-17.sel'), 'wiRes', names.map((r) => [r, nameOf(r)]), rid)}`,
    `${close(tx('CMN-17.close'))}<button class="btn btn-primary btn-md" type="submit"${rid ? '' : ' disabled'}>${tx('CMN-17.btn.3')}</button>`);
}

// ================================================================ 행동
const actions = {
  'cmn.pl.pick': ({ id }) => { PL_KEYS.concat(FEATURES.map(([k]) => `f_${k}`)).forEach((k) => { delete view[k]; }); delete view.err; view.pl = id; },
  'cmn.pl.save': ({ id }) => {
    delete view.err; delete view.plNone;
    try { savePlace(id); } catch (e) { view.err = e.message; throw e; }
    toast(view.plNone ? tx('CMN-22.noChange') : tx('CMN-22.saved'));
  },
  // ---- 회원
  'cmn.enroll': ({ id, intent }) => {
    ensure();
    const rid = mustMember(), s = sess(id);
    if (!s || s.status !== 'ACTIVE') refuse(tx('community.action.refuse.27'));
    if (s.capacity == null) refuse(tx('community.action.refuse.26'));
    if (db.now >= deadlineOf(s)) refuse(tx('community.action.refuse.25'));
    if (openEnroll(s.id, rid)) refuse(tx('community.action.refuse.24'));
    const c = C(), room = seatsLeft(s) > 0 && waitlist(s).length === 0;
    if (intent === 'ENROLL' && !room) { view.dialog = 'race'; return; } // 행 없이 거부(409 FULL)
    c.enrollments.push({ id: `E-${++c.seq}`, seq: c.seq, sessionId: s.id, residentId: rid, status: room ? 'ENROLLED' : 'WAITLISTED', queuedAt: db.now, source: 'RESIDENT_APP', takenBy: null, heardVia: null });
    view.dialog = '';
  },
  'cmn.cancel': ({ id }) => {
    const rid = mustMember(), s = sess(id), e = s && openEnroll(s.id, rid);
    if (!e || e.status !== 'ENROLLED') refuse(tx('community.action.refuse.23'));
    if (db.now >= deadlineOf(s)) refuse(tx('community.action.refuse.22'));
    e.status = 'CANCELLED'; e.cancelKind = 'RESIDENT'; e.cancelledAt = db.now;
    promote(s);
    view.dialog = '';
    toast(tx('community.action.toast.5'));
  },
  'cmn.leave': ({ id }) => {
    const rid = mustMember(), s = sess(id), e = s && openEnroll(s.id, rid);
    if (!e || e.status !== 'WAITLISTED') refuse(tx('community.action.refuse.21'));
    e.status = 'CANCELLED'; e.cancelKind = 'WAITLIST_LEFT'; e.cancelledAt = db.now;
    view.dialog = '';
  },
  'cmn.rv.make': () => {
    const rid = mustMember(), c = C(), pl = place(view.room) || c.places.find((p) => p.reservable);
    const ymd = view.day, start = view.time, people = +view.people;
    if (!pl?.reservable) refuse(tx('community.action.refuse.6'));
    const end = toHM(mm(start) + pl.slot), err = checkBooking({ pl, rid, ymd, start, end, people });
    if (err) refuse(err);
    const id = `BK-${++c.seq}`;
    c.bookings.push({ id, placeId: pl.id, kind: 'RESERVATION', start: mk(ymd, start), end: mk(ymd, end), residentId: rid, people, source: 'RESIDENT_APP', rulesAck: 'MEMBER', status: 'ACTIVE', createdAt: db.now });
    ackRules(rid, pl);
    view.done = id;
  },
  'cmn.rv.cancel': ({ id }) => {
    const rid = mustMember(), b = C().bookings.find((x) => x.id === id);
    if (!b || b.residentId !== rid || b.status !== 'ACTIVE') refuse(tx('community.action.refuse.20'));
    if (b.start <= db.now) refuse(tx('community.action.refuse.19'));
    b.status = 'CANCELLED'; b.cancelKind = 'RESIDENT';
    view.dialog = '';
    toast(tx('community.action.toast.4'));
    go('CMN-07');
  },
  'cmn.ack': ({ id }) => {
    const rid = mustMember(), n = C().notices.find((x) => x.id === id);
    if (!n || n.status !== 'PUBLISHED' || !isRecipient(n.id, rid)) refuse(tx('community.action.refuse.18'));
    if (!ackOf(n.id, rid)) C().acks.push({ noticeId: n.id, residentId: rid, kind: 'ACKED', method: null, by: me().id, at: db.now });
  },
  // ---- 직원: 신청
  'cmn.pe': ({ id }, f) => {
    mustWrite();
    const s = sess(id), rid = f.peRes, c = C();
    if (!s || s.status !== 'ACTIVE' || s.capacity == null) refuse(tx('community.action.refuse.17'));
    if (s.startsAt <= db.now) refuse(tx('community.action.refuse.14'));
    if (!rid || openEnroll(s.id, rid)) refuse(tx('community.action.refuse.16'));
    const room = seatsLeft(s) > 0 && waitlist(s).length === 0;
    c.enrollments.push({ id: `E-${++c.seq}`, seq: c.seq, sessionId: s.id, residentId: rid, status: room ? 'ENROLLED' : 'WAITLISTED', queuedAt: db.now, source: me().key === 'FRONT' ? 'FRONT_PROXY' : 'STAFF_PROXY', takenBy: me().id, heardVia: f.sHow || 'PHONE' });
    view.dialog = '';
    toast(room ? `${tx('community.action.text.7', { length: enrollsOf(s.id, 'ENROLLED').length, capacity: s.capacity })}` : `${tx('community.action.text.6', { length: waitlist(s).length })}`);
  },
  'cmn.pc': ({ eid }) => {
    mustWrite();
    const e = C().enrollments.find((x) => x.id === eid), s = e && sess(e.sessionId);
    if (!e || e.status !== 'ENROLLED') refuse(tx('community.action.refuse.15'));
    if (s.startsAt <= db.now) refuse(tx('community.action.refuse.14'));
    e.status = 'CANCELLED'; e.cancelKind = 'STAFF_PROXY'; e.cancelledAt = db.now; e.cancelledBy = me().id;
    promote(s);
    view.dialog = '';
    const up = C().enrollments.find((x) => x.sessionId === s.id && x.promotedAt === db.now);
    toast(up ? `${tx('community.action.text.5', { staffLabel: staffLabel(up.residentId) })}` : tx('community.action.toast.3'));
  },
  'cmn.pl': ({ eid }) => {
    mustWrite();
    const e = C().enrollments.find((x) => x.id === eid);
    if (!e || e.status !== 'WAITLISTED') refuse(tx('community.action.refuse.13'));
    e.status = 'CANCELLED'; e.cancelKind = 'WAITLIST_LEFT'; e.cancelledAt = db.now;
    view.dialog = '';
    toast(tx('community.action.toast.2'));
  },
  'cmn.pp': ({ eid }, f) => {
    mustWrite();
    const e = C().enrollments.find((x) => x.id === eid), s = e && sess(e.sessionId);
    if (!e || e.status !== 'WAITLISTED') refuse(tx('community.action.refuse.12'));
    if (waitlist(s)[0].id !== e.id) refuse(tx('community.action.refuse.11'));
    if (db.now < deadlineOf(s) || seatsLeft(s) <= 0) refuse(tx('community.action.refuse.10'));
    e.status = 'ENROLLED'; e.promotedAt = db.now; e.promotedBy = me().id; e.heardVia = f.sHow || 'PHONE';
    view.dialog = '';
    toast(`${tx('community.action.text.4', { length: enrollsOf(s.id, 'ENROLLED').length, capacity: s.capacity })}`);
  },
  // ---- 직원: 출석
  'cmn.att.toggle': ({ rid, sid }) => {
    if (!canAttend()) refuse(tx('community.action.refuse.7'));
    const s = sess(sid), rows = C().attendance.filter((a) => a.sessionId === sid && a.kind === 'ATTENDED');
    view.att = { ...(view.att ?? Object.fromEntries(rows.map((a) => [a.residentId, true]))) };
    view.att[rid] = !view.att[rid];
    if (!view.walk) view.walk = C().attendance.filter((a) => a.sessionId === s.id && a.kind === 'WALK_IN').map((a) => a.residentId);
  },
  'cmn.att.walkin': ({ sid }, f) => {
    if (!canAttend()) refuse(tx('community.action.refuse.7'));
    const cur = view.walk ?? C().attendance.filter((a) => a.sessionId === sid && a.kind === 'WALK_IN').map((a) => a.residentId);
    if (!f.wiRes) refuse(tx('community.action.refuse.9'));
    view.walk = cur.includes(f.wiRes) ? cur : [...cur, f.wiRes];
    view.dialog = '';
  },
  'cmn.att.save': ({ sid }) => {
    if (!canAttend()) refuse(tx('community.action.refuse.7'));
    const s = sess(sid), c = C();
    if (s.startsAt > db.now) refuse(tx('community.action.refuse.8'));
    const prev = c.attendance.filter((a) => a.sessionId === sid), on = view.att ?? Object.fromEntries(prev.filter((a) => a.kind === 'ATTENDED').map((a) => [a.residentId, true]));
    const walk = view.walk ?? prev.filter((a) => a.kind === 'WALK_IN').map((a) => a.residentId);
    c.attendance = c.attendance.filter((a) => a.sessionId !== sid);
    for (const [rid, yes] of Object.entries(on)) if (yes) c.attendance.push({ sessionId: sid, residentId: rid, kind: 'ATTENDED', at: db.now, by: me().id });
    for (const rid of walk) c.attendance.push({ sessionId: sid, residentId: rid, kind: 'WALK_IN', at: db.now, by: me().id });
    s.savedAt = db.now; s.savedBy = me().id;
    view.att = undefined; view.walk = undefined; view.editing = false;
  },
  'cmn.att.edit': ({ sid }) => {
    if (!canAttend()) refuse(tx('community.action.refuse.7'));
    const s = sess(sid);
    if (ymdOf(db.now) !== ymdOf(s.startsAt)) refuse(`${tx('community.action.text.3', { md: md(s.startsAt), name: progOf(s).name })}`);
    view.editing = true;
  },
  // ---- 직원: 시설
  'cmn.rv.proxy': ({ date }, f) => {
    mustWrite();
    const pl = place(f.rvFac), rid = f.rvRes, people = parseInt(f.rvPeople, 10) || 1;
    if (!pl || !pl.reservable) refuse(tx('community.action.refuse.6'));
    const err = checkBooking({ pl, rid, ymd: date, start: f.rvStart, end: f.rvEnd, people });
    if (err) refuse(err);
    const need = needRules(rid, pl);
    if (need && !f.rvRules) refuse(tx('community.action.refuse.5'));
    const c = C();
    c.bookings.push({ id: `BK-${++c.seq}`, placeId: pl.id, kind: 'RESERVATION', start: mk(date, f.rvStart), end: mk(date, f.rvEnd), residentId: rid, people, source: me().key === 'FRONT' ? 'FRONT_PROXY' : 'STAFF_PROXY', takenBy: me().id, heardVia: f.rvHow || 'PHONE', rulesAck: need ? 'STAFF_TOLD' : 'MEMBER', status: 'ACTIVE', createdAt: db.now });
    if (need) ackRules(rid, pl);
    view.dialog = '';
    toast(`${tx('community.action.text.2', { mdDow: mdDow(mk(date, f.rvStart)), rvStart: f.rvStart, rvEnd: f.rvEnd, name: pl.name, roomOf: roomOf(rid), nameOf: nameOf(rid) })}`);
  },
  // ---- 직원: 공지
  'cmn.notice.publish': () => {
    mustWrite();
    ensure();
    const title = (view.wTitle || '').trim(), body = (view.wBody || '').trim(), code = v('wTo', 'ALL'), c = C();
    if (!title || !body) refuse(tx('community.action.refuse.4'));
    if (targetCount(code) === 0) refuse(tx('community.action.refuse.3'));
    const p = me(), titles = { MANAGER: tx('community.action.MANAGER'), LIFE: tx('community.action.LIFE'), FRONT: tx('community.action.FRONT'), CARE: tx('community.action.CARE'), STAFF: tx('community.action.authorTitle') };
    const n = { id: `N-${++c.seq}`, title, body, audience: code, requiresAck: !!view.wImportant, guardianVisible: !!view.wGuardian, sendSms: !!view.wSms, status: 'DRAFT', publishAt: db.now, publishedAt: null, authorId: p.id, authorName: p.name, authorTitle: titles[p.key] ?? tx('community.action.authorTitle') };
    c.notices.push(n);
    publishNotice(n, db.now);
    for (const k of ['wTitle', 'wBody', 'wTo', 'wImportant', 'wGuardian', 'wSms']) view[k] = undefined;
    view.write = ''; view.confirm = '';
    toast(tx('community.action.toast'));
  },
  'cmn.notice.deliver': ({ nid, rid }, f) => {
    mustWrite();
    const n = C().notices.find((x) => x.id === nid);
    if (!n || !isRecipient(nid, rid)) refuse(tx('community.action.refuse.2'));
    if (ackOf(nid, rid)) refuse(tx('community.action.refuse'));
    const method = f.dHow || 'PHONE', label = { PHONE: tx('community.action.PHONE.2'), VISIT: tx('community.action.VISIT.2'), FRONT_DESK: tx('community.action.FRONTDESK') }[method], phrase = { PHONE: tx('community.action.PHONE'), VISIT: tx('community.action.VISIT'), FRONT_DESK: tx('community.action.FRONTDESK') }[method];
    C().acks.push({ noticeId: nid, residentId: rid, kind: 'DELIVERED_IN_PERSON', method, by: me().id, at: db.now });
    if ((f.dMemo || '').trim()) C().notes.push({ noticeId: nid, residentId: rid, note: f.dMemo.trim(), by: me().id, at: db.now });
    view.dialog = ''; view.dMemo = '';
    toast(`${tx('community.action.text', { hmOf: hmOf(db.now), name: me().name, label, name2: me().name, phrase })}`);
  },
};

// ================================================================ 다른 모듈이 부르는 함수
const api_ = {
  /** CMN-23 칸. 이름과 호실 없이 숫자만 */
  board() {
    ensure();
    const ss = todaySessions(), ab = ackBoard();
    return { sessions: ss.length, attendancePending: ss.filter(pending).length, bookings: C().bookings.filter((b) => b.kind === 'RESERVATION' && visBooking(b) && ymdOf(b.start) === ymdOf(db.now)).length, unreadNotices: ab.open.length, unreadRooms: ab.rooms, asOf: db.now };
  },
  /** 이 사업장에서 쓰는 기능(CMN-22). 끈 기능은 다른 화면의 타일과 줄도 감춘다 */
  features() { return { notices: feat('notices'), programs: feat('programs'), places: feat('places') }; },
  /** 운영 사이드바 숫자 */
  navCounts() {
    if (!C()) return {};
    ensure();
    const n = todaySessions().filter(pending).length + ackBoard().open.length;
    return n ? { 'CMN-14': n } : {};
  },
  /** COM-07 1번 타일 부제. 오늘 신청·예약이 없으면 빈 문자열 */
  homeToday(residentId) {
    ensure();
    const mine = !feat('programs') ? [] : C().enrollments.filter((e) => e.residentId === residentId && e.status === 'ENROLLED' && visEnroll(e)).map((e) => sess(e.sessionId)).filter((s) => s && s.status === 'ACTIVE' && ymdOf(s.startsAt) === ymdOf(db.now) && s.endsAt > db.now)
      .map((s) => ({ at: s.startsAt, text: `${tx('community.api_.text.2', { ampm: fmt.ampm(s.startsAt), name: progOf(s).name, josa: josa(progOf(s).name, tx('community.api_.josa.2'), tx('community.api_.josa')), name2: placeOf(s).name, josa2: josa(placeOf(s).name, tx('community.api_.josa.4'), tx('community.api_.josa.3')) })}` }));
    const rv = !feat('places') ? [] : C().bookings.filter((b) => b.kind === 'RESERVATION' && visBooking(b) && b.residentId === residentId && ymdOf(b.start) === ymdOf(db.now) && b.end > db.now)
      .map((b) => ({ at: b.start, text: `${tx('community.api_.text', { ampm: fmt.ampm(b.start), short: place(b.placeId).short, josa: josa(place(b.placeId).short, tx('community.api_.josa.2'), tx('community.api_.josa')) })}` }));
    return [...mine, ...rv].sort((a, b) => (a.at < b.at ? -1 : 1))[0]?.text ?? '';
  },
  /** COM-07 꼭 보실 공지 띠 */
  importantNotice(residentId) {
    ensure();
    if (!feat('notices')) return null;
    const open = published().filter((n) => n.requiresAck && isRecipient(n.id, residentId) && !ackOf(n.id, residentId));
    return open.length ? { id: open[0].id, title: open[0].title, count: open.length } : null;
  },
  /** CMN-12 보호자 일정 재료. 신청 확정과 쉬게 된 회차만(대기, 예약, 출석 없음) */
  familySchedule(residentId, fromYmd, toYmd) {
    ensure();
    if (!feat('programs')) return [];
    return C().enrollments.filter((e) => e.residentId === residentId && visEnroll(e) && (e.status === 'ENROLLED' || e.cancelKind === 'SESSION_CANCELLED')).map((e) => ({ e, s: sess(e.sessionId) }))
      .filter(({ s }) => s && s.endsAt > db.now && (!fromYmd || ymdOf(s.startsAt) >= fromYmd) && (!toYmd || ymdOf(s.startsAt) <= toYmd)).sort((a, b) => (a.s.startsAt < b.s.startsAt ? -1 : 1))
      .map(({ e, s }) => ({ sessionId: s.id, programName: progOf(s).name, startsAt: s.startsAt, endsAt: s.endsAt, placeName: placeOf(s).name, state: s.status === 'CANCELLED' ? 'SESSION_CANCELLED' : 'ENROLLED', when: whenKo(s.startsAt) }));
  },
  /** CMN-13 보호자 첫 화면 레지던스 공지(보이기를 켠 공지 중 그 회원이 대상인 것) */
  familyNotices(residentId) {
    ensure();
    if (!feat('notices')) return [];
    return published().filter((n) => n.guardianVisible && isRecipient(n.id, residentId)).map((n) => ({ noticeId: n.id, title: n.title, body: n.body, publishedAt: n.publishedAt, when: fmt.md(n.publishedAt) }));
  },
  /** 생활 소식 재료. 온 회차만(오지 않음은 저장하지 않는다) */
  attendance(residentId, fromYmd, toYmd) {
    ensure();
    return C().attendance.filter((a) => a.residentId === residentId).map((a) => sess(a.sessionId)).filter((s) => s && (!fromYmd || ymdOf(s.startsAt) >= fromYmd) && (!toYmd || ymdOf(s.startsAt) <= toYmd))
      .sort((a, b) => (a.startsAt < b.startsAt ? -1 : 1)).map((s) => ({ sessionId: s.id, programName: progOf(s).name, startsAt: s.startsAt }));
  },
};

// ---------------------------------------------------------------- 공용 시설 설정 (CMN-22). 책임자와 본사 운영 매니저만. 저장하면 다음 예약부터 바뀐다
const PLACE_KEYS = ['MANAGER', 'HQ_OPS'];
const canPlace = () => PLACE_KEYS.includes(me().key);
const FEATURES = [['notices', () => tx('CMN-22.f1')], ['programs', () => tx('CMN-22.f2')], ['places', () => tx('CMN-22.f3')]];
const onOff = (b) => (b ? tx('CMN-22.on') : tx('CMN-22.off'));
const digits = (x) => { const t = String(x ?? '').replace(/\D/g, ''); return t ? +t : null; };
const durParse = (x) => { const h = String(x ?? '').match(new RegExp(tx('CMN-22.pat.hour'))), m = String(x ?? '').match(new RegExp(tx('CMN-22.pat.min'))); return h || m ? (h ? +h[1] * 60 : 0) + (m ? +m[1] : 0) : null; };
const dash = (x) => (x ? esc(x) : '-');
/** 입력 칸의 지금 값. 손대지 않은 칸은 장소의 지금 값 */
function placeForm(pl) {
  const f = { cRsv: pl.reservable ? '1' : '0', cName: pl.name, cDesc: pl.desc ?? '', cMax: pl.maxPeople ? tx('CMN-22.people', { n: pl.maxPeople }) : '', cUnit: String(pl.slot ?? 60), cDay: pl.dailyMax ? durText(pl.dailyMax) : '',
    cHours: pl.openFrom ? `${pl.openFrom}~${pl.openTo}` : '', cAhead: pl.windowDays ? tx('CMN-22.days', { n: pl.windowDays }) : '', cRule: pl.rulesText ?? '' };
  for (const k of Object.keys(f)) if (view[k] !== undefined) f[k] = view[k];
  return f;
}
const featOn = (k) => (view[`f_${k}`] ?? (feat(k) ? '1' : '0')) === '1';
const selPlace = () => place(view.pl) ?? C().places.find((p) => p.reservable) ?? C().places[0];
function cmn22() {
  ensure();
  const title = tx('CMN-22.title');
  if (!canPlace()) return `<div class="page-head"><h1 class="t-title2">${title}</h1></div>${denied(tx('core.need.refuse'))}`;
  const pl = selPlace(), f = placeForm(pl), on = f.cRsv === '1', req = tx('CMN-22.req'), opt = tx('CMN-22.opt');
  const rows = C().places.map((p) => `<tr${p.id === pl.id ? ' class="sel"' : ''}><td data-label="${tx('CMN-22.l.name')}"><b class="strong">${esc(p.name)}</b></td><td data-label="${tx('CMN-22.th.rsv')}">${p.reservable ? tx('CMN-22.rsvOn') : tx('CMN-22.rsvOff')}</td>
    <td data-label="${tx('CMN-22.l.max')}" class="num hide-m">${p.reservable ? tx('CMN-22.people', { n: p.maxPeople }) : '-'}</td><td data-label="${tx('CMN-22.l.unit')}" class="hide-m">${p.reservable ? tx('CMN-22.unitLine', { slot: durText(p.slot), daily: durText(p.dailyMax) }) : '-'}</td>
    <td data-label="${tx('CMN-22.l.hours')}" class="num hide-m">${p.reservable ? `${p.openFrom}~${p.openTo}` : '-'}</td><td><span class="row-act"><a class="btn btn-ghost btn-sm" href="#" data-act="cmn.pl.pick" data-id="${p.id}">${tx('CMN-22.pick')}</a></span></td></tr>`).join('');
  const sw = (name, st, setTo) => `<button class="switch" type="button" role="switch" aria-checked="${st}" data-set="${setTo}"><span class="trk"></span>${tx('CMN-22.sw', { name, st: onOff(st) })}</button>`;
  const field = (id, label, inner, hint = '') => `<div class="field"><label for="${id}">${label}</label>${inner}${hint}</div>`;
  const input = (id, name, extra = '') => `<input id="${id}" class="input" type="text" name="${name}" data-bind="${name}" value="${esc(f[name])}"${extra}>`;
  const unitSel = `<select id="c-unit" class="input" name="cUnit" data-bind="cUnit">${[60, 30].map((m) => `<option value="${m}"${f.cUnit === String(m) ? ' selected' : ''}>${durText(m)}</option>`).join('')}</select>`;
  const fieldsHtml = on ? `<div class="grid2">
          ${field('c-name', tx('CMN-22.l.name') + req, input('c-name', 'cName'))}${field('c-desc', tx('CMN-22.l.desc') + opt, input('c-desc', 'cDesc'))}
          ${field('c-max', tx('CMN-22.l.max') + req, input('c-max', 'cMax'))}${field('c-unit', tx('CMN-22.l.unit') + req, unitSel)}
          ${field('c-day', tx('CMN-22.l.day') + req, input('c-day', 'cDay'))}${field('c-hours', tx('CMN-22.l.hours') + req, input('c-hours', 'cHours'))}
          ${field('c-ahead', tx('CMN-22.l.ahead') + req, input('c-ahead', 'cAhead', ' data-live'), `<span class="hint" id="c-ahead-h">${tx('CMN-22.aheadHint', { n: digits(f.cAhead) ?? '-' })}</span>`)}
        </div>
        ${field('c-rule', tx('CMN-22.l.rule') + req, `<textarea id="c-rule" class="input" name="cRule" data-bind="cRule">${esc(f.cRule)}</textarea>`, `<span class="hint" id="c-rule-h">${tx('CMN-22.ruleHint')}</span>`)}`
    : `<div class="grid2">${field('c-name', tx('CMN-22.l.name') + req, input('c-name', 'cName'))}</div>`;
  const log = C().placeLog.map((l) => `<div class="record"><span class="when">${l.at.slice(0, 16).replace('T', ' ')}</span><span class="what"><b>${esc(l.by)}</b> ${tx('CMN-22.logLine', { scope: esc(l.scope), items: esc(l.items) })}</span></div>`).join('');
  const err = view.err ? `<div class="alert alert-err" role="alert">${ic('triangle-alert')}<p>${esc(view.err)}</p></div>` : '';
  return `<div class="page-head">
        <div>
          <nav class="crumb" aria-label="${tx('CMN-22.crumbAria')}"><span>${tx('CMN-22.crumb')}</span></nav>
          <h1 class="t-title2">${title}</h1>
        </div>
        <span class="badge">${SITES.S1.name}</span>
      </div>
      <section class="card" aria-labelledby="l1"><h2 id="l1" class="t-heading2">${tx('CMN-22.list')}</h2>
        <div class="tbl reflow fit"><table><thead><tr><th scope="col">${tx('CMN-22.l.name')}</th><th scope="col">${tx('CMN-22.th.rsv')}</th><th scope="col" class="hide-m">${tx('CMN-22.l.max')}</th><th scope="col" class="hide-m">${tx('CMN-22.l.unit')}</th><th scope="col" class="hide-m">${tx('CMN-22.l.hours')}</th><th scope="col"><span class="sr-only">${tx('CMN-22.th.act')}</span></th></tr></thead><tbody>${rows}</tbody></table></div>
      </section>
      <section class="card" aria-labelledby="g1"><h2 id="g1" class="t-heading2">${esc(pl.name)}</h2>
        ${sw(tx('CMN-22.rsv'), on, `cRsv=${on ? '0' : '1'}`)}
        <p class="muted">${tx('CMN-22.rsvHint')}</p>
        ${fieldsHtml}
      </section>
      <section class="card" aria-labelledby="f1"><h2 id="f1" class="t-heading2">${tx('CMN-22.fTitle')}</h2>
        <div class="stack" style="gap:0;">${FEATURES.map(([k, name]) => sw(name(), featOn(k), `f_${k}=${featOn(k) ? '0' : '1'}`)).join('')}</div>
        <p class="muted">${tx('CMN-22.fHint')}</p>
      </section>
      ${log ? `<section class="card" aria-labelledby="lg"><h2 id="lg" class="t-heading2">${tx('CMN-22.logH')}</h2><div>${log}</div></section>` : ''}
      <p class="muted">${tx('CMN-22.after')}</p>${err}
      <div class="row end"><button class="btn btn-primary btn-sm" type="button" data-act="cmn.pl.save" data-id="${pl.id}">${tx('CMN-22.save')}</button></div>
      <p class="demo-note">${tx('core.shared.p.4')}</p>`;
}
const PL_KEYS = ['cRsv', 'cName', 'cDesc', 'cMax', 'cUnit', 'cDay', 'cHours', 'cAhead', 'cRule'];
function savePlace(id) {
  if (!canPlace()) refuse(tx('core.need.refuse'));
  const c = C(), pl = place(id), f = placeForm(pl), on = f.cRsv === '1', name = f.cName.trim(), next = { name, reservable: on };
  if (!name) refuse(tx('CMN-22.errFill'));
  if (on) {
    const hm = String(f.cHours).trim().match(/^(\d\d):(\d\d)~(\d\d):(\d\d)$/), rule = f.cRule.trim();
    if (![f.cMax, f.cDay, f.cHours, f.cAhead, rule].every((x) => String(x).trim())) refuse(tx('CMN-22.errFill'));
    const max = digits(f.cMax), ahead = digits(f.cAhead), slot = +f.cUnit, day = durParse(f.cDay);
    if (!max || !ahead) refuse(tx('CMN-22.errNum'));
    if (!hm || +hm[1] > 24 || +hm[3] > 24 || +hm[2] > 59 || +hm[4] > 59 || mm(`${hm[1]}:${hm[2]}`) >= mm(`${hm[3]}:${hm[4]}`)) refuse(tx('CMN-22.errHours'));
    if (day === null || day < slot) refuse(tx('CMN-22.errDur'));
    Object.assign(next, { desc: f.cDesc.trim(), maxPeople: max, slot, dailyMax: day, openFrom: `${hm[1]}:${hm[2]}`, openTo: `${hm[3]}:${hm[4]}`, windowDays: ahead, rulesText: rule });
    if (!pl.short) next.short = name.replace(/^\S+\s+/, '');
    if (rule !== pl.rulesText) next.rulesVersion = Math.max(0, ...c.places.map((x) => x.rulesVersion || 0)) + 1; // 규칙이 바뀌면 다음 예약 때 다시 보인다
  }
  const item = (label, a, b) => (a === b ? [] : [tx('CMN-22.logItem', { label, a: a || '-', b: b || '-' })]);
  const was = { max: pl.maxPeople && tx('CMN-22.people', { n: pl.maxPeople }), unit: pl.slot && durText(pl.slot), day: pl.dailyMax && durText(pl.dailyMax), hours: pl.openFrom && `${pl.openFrom}~${pl.openTo}`, ahead: pl.windowDays && tx('CMN-22.days', { n: pl.windowDays }) };
  const now = on ? { max: tx('CMN-22.people', { n: next.maxPeople }), unit: durText(next.slot), day: durText(next.dailyMax), hours: `${next.openFrom}~${next.openTo}`, ahead: tx('CMN-22.days', { n: next.windowDays }) } : was;
  const placeItems = [...item(tx('CMN-22.rsv'), onOff(pl.reservable), onOff(on)), ...item(tx('CMN-22.l.name'), pl.name, name), ...item(tx('CMN-22.l.desc'), pl.desc, next.desc ?? pl.desc),
    ...item(tx('CMN-22.l.max'), was.max, now.max), ...item(tx('CMN-22.l.unit'), was.unit, now.unit), ...item(tx('CMN-22.l.day'), was.day, now.day), ...item(tx('CMN-22.l.hours'), was.hours, now.hours), ...item(tx('CMN-22.l.ahead'), was.ahead, now.ahead),
    ...(next.rulesVersion ? [tx('CMN-22.logRule')] : [])];
  const featItems = FEATURES.filter(([k]) => featOn(k) !== feat(k)).map(([k, n]) => tx('CMN-22.logItem', { label: n(), a: onOff(feat(k)), b: onOff(featOn(k)) }));
  if (!placeItems.length && !featItems.length) { view.plNone = '1'; return; }
  const by = `${me().name}(${me().role})`;
  if (featItems.length) c.placeLog.unshift({ at: db.now, by, scope: tx('CMN-22.fTitle'), items: featItems.join(', ') });
  if (placeItems.length) c.placeLog.unshift({ at: db.now, by, scope: pl.name, items: placeItems.join(', ') });
  Object.assign(pl, next);
  FEATURES.forEach(([k]) => { c.features[k] = featOn(k); });
  PL_KEYS.concat(FEATURES.map(([k]) => `f_${k}`)).forEach((k) => { delete view[k]; });
}

// ================================================================ 장면 단계
const PAINT = 'S-PAINT-20261119';
const flow = [
  { scene: 19, ord: 1, at: '2026-11-18T08:50:00', as: 'st.choiym', go: ['CMN-14', { tab: 'notice' }], say: tx('flow.community.s19.say.3'),
    steps: [{ see: tx('CMN-14.h2') }, { see: tx('flow.community.s19.see.8') }, { see: tx('flow.community.s19.see.7') }] },
  { scene: 19, ord: 2, at: '2026-11-18T09:00:00', as: 'st.choiym', go: ['CMN-14', { tab: 'notice' }], say: tx('flow.community.s19.say.2'),
    steps: [{ click: tx('CMN-14.btn.3') }, { fill: 'wTitle', value: tx('flow.community.s19.value.2') }, { fill: 'wBody', value: tx('flow.community.s19.value') },
      { fill: 'wTo', value: 'A' }, { click: tx('CMN-14.box.6') }, { click: tx('CMN-14.box.2') }, { click: tx('CMN-14.btn.2'), within: '.rsheet' }, { see: tx('flow.community.s19.see.6') },
      { click: tx('CMN-14.btn.2'), within: '#cmn-confirm' }, { see: tx('flow.community.s19.see.5') }, { see: tx('flow.community.s19.see.4') }, { see: tx('flow.community.s19.see.3') }] },
  { scene: 19, ord: 3, at: '2026-11-18T09:30:00', as: 'm.eunsook', go: ['COM-07'], say: tx('flow.community.s19.say'),
    steps: [{ see: tx('flow.community.s19.no') }, { sel: '.notice-band' }, { see: tx('CMN-11.b.3') }, { click: tx('FAM-05.btn') }, { see: tx('flow.community.s19.see') }, { go: 'CMN-10' }, { see: tx('CMN-10.read') }, { go: 'COM-07' }, { no: tx('flow.community.s19.no') }] },
  { scene: 20, ord: 1, at: '2026-11-18T10:45:00', as: 'st.yoonsy', go: ['CMN-14'], say: tx('flow.community.s20.say.4'),
    steps: [{ see: tx('flow.community.s20.see.17') }, { see: tx('CMN-14.span.7') }, { sel: '[data-sess="S-EXERCISE-20261118"]' }, { see: tx('flow.community.s20.see.15') },
      { sel: '[data-act="cmn.att.toggle"][data-rid="R_EUNSOOK"]' }, { sel: '[data-act="cmn.att.toggle"][data-rid="R_OKJA"]' }, { sel: '[data-act="cmn.att.toggle"][data-rid="R_YEONGSUN"]' },
      { click: tx('CMN-17.formDlg') }, { fill: 'wiRoom', value: tx('flow.community.s20.value') }, { fill: 'wiRes', value: 'R_MALSUN' }, { click: tx('CMN-17.btn.3'), within: '#cmn-dialog' }, { see: tx('CMN-17.row') },
      { click: tx('CMN-17.btn.2') }, { see: tx('flow.community.s20.see.13') }] },
  { scene: 20, ord: 2, at: '2026-11-18T11:00:00', as: 'm.eunsook', go: ['COM-07'], say: tx('flow.community.s20.say.3'),
    steps: [{ sel: 'a[href="#/COM-09"]' }, { sel: 'a[href="#/CMN-02"]' }, { see: tx('CMN-02.title') }, { sel: '[data-set="day=2026-11-19"]' }, { see: tx('flow.community.s20.click.8') }, { see: tx('CMN-02.map') },
      { click: tx('flow.community.s20.click.8') }, { see: tx('flow.community.s20.see.10') }, { click: tx('CMN-03.btn.4') }, { see: tx('CMN-03.dlg.2') }, { click: tx('CMN-03.btn.8'), within: '#cmn-dialog' }, { see: tx('flow.community.s20.see.8') }] },
  { scene: 20, ord: 3, at: '2026-11-18T11:20:00', as: 'st.choims', go: ['CMN-14'], say: tx('flow.community.s20.say.2'),
    steps: [{ click: tx('COM-09.tile.4') }, { sel: tx('flow.community.s20.sel') }, { see: tx('flow.community.s20.see.7') }, { click: tx('CMN-14.formDlg.2') }, { fill: 'rvStart', value: '14:00' }, { fill: 'rvEnd', value: '15:00' },
      { see: tx('flow.community.s20.see.6') }, { fill: 'rvStart', value: '16:00' }, { fill: 'rvEnd', value: '17:00' }, { fill: 'rvRes', value: 'R_EUNSOOK' }, { fill: 'rvPeople', value: '4' },
      { click: tx('flow.community.s20.click.3') }, { click: tx('CMN-14.btn.10'), within: '#cmn-dialog' }, { see: tx('flow.community.s20.see.5') }] },
  { scene: 20, ord: 4, at: '2026-11-18T11:25:00', as: 'm.eunsook', go: ['CMN-07'], say: tx('flow.community.s20.say'),
    steps: [{ see: tx('CMN-07.title') }, { see: tx('flow.community.s20.see.3') }, { click: tx('flow.community.s20.click') }, { see: tx('flow.community.s20.see.2') }, { see: tx('flow.community.s20.see') }] },
  { scene: 21, ord: 1, at: '2026-11-18T14:00:00', as: 'st.choims', go: ['CMN-14', { tab: 'program' }], say: tx('flow.community.s21.say.3'),
    steps: [{ sel: '[data-prog="PAINT"]' }, { see: tx('flow.community.s21.see.10') }, { click: tx('CMN-14.btn.11') }, { see: tx('flow.community.s21.see.9') }, { see: tx('flow.community.s21.see.8') },
      { sel: '[data-eid="E-2"]' }, { see: tx('CMN-17.formDlg.7') }, { click: tx('CMN-17.formDlg.7'), within: '#cmn-dialog' }, { see: tx('community.action.toast.3') }, { see: tx('flow.community.s21.see.6') }, { no: tx('CMN-17.text.4') }] },
  { scene: 21, ord: 2, at: '2026-11-18T14:05:00', as: 'm.eunsook', go: ['CMN-03', { id: PAINT }], say: tx('flow.community.s21.say.2'),
    steps: [{ see: tx('CMN-03.b.4') }, { see: tx('flow.community.s21.see.4') }, { see: tx('CMN-03.btn.3') }] },
  { scene: 21, ord: 3, at: '2026-11-18T14:10:00', as: 'm.eunsook', go: ['CMN-07'], say: tx('flow.community.s21.say'),
    steps: [{ see: tx('flow.community.s21.see.2') }, { see: tx('CMN-07.row.2') }, { no: tx('flow.community.s21.no') }] },
  // 보호자 첫 화면의 레지던스 공지 칸에서 상세로. 일반 공지만 오고 A동 단수 공지는 없다(FAM-06a 장면 21 ord 5 뒤).
  { scene: 21, ord: 7, at: '2026-11-18T15:06:00', as: 'g.jimin', go: ['FAM-06a'], say: tx('flow.community.s21.say.9'),
    steps: [{ no: tx('flow.community.s21.no.2') }, { click: tx('flow.community.s21.click') }, { see: tx('CMN-13.title') }, { see: tx('flow.community.s21.see.3') }, { no: tx('flow.community.s21.no.2') }] },
  { scene: 22, ord: 1, at: '2026-11-18T16:00:00', as: 'st.choiym', go: ['CMN-14', { tab: 'notice' }], say: tx('flow.community.s22.say'),
    steps: [{ see: tx('flow.community.s22.see.8') }, { click: tx('CMN-14.btn.4') }, { see: tx('flow.community.s22.see.7') }, { see: tx('safety.shared.CARD_ONLY') }, { see: tx('flow.community.s22.see.5') }, { see: tx('CMN-17.span') },
      { at: '2026-11-18T16:05:00' }, { as: 'st.choims' }, { sel: '[data-set*="R_YEONGSUN"]' }, { see: tx('flow.community.s22.see.3') }, { click: tx('CMN-14.btn.6'), within: '#cmn-dialog' },
      { see: tx('flow.community.s22.see.2') }, { see: tx('flow.community.s22.see') }] },
  { scene: 23, ord: 1, at: '2026-11-19T15:40:00', as: 'st.yoonsy', go: ['CMN-14'], say: tx('flow.community.s23.say'),
    steps: [{ sel: `[data-sess="${PAINT}"]` }, { see: tx('flow.community.s23.see.2') }, { sel: '[data-act="cmn.att.toggle"][data-rid="R_EUNSOOK"]' }, { sel: '[data-act="cmn.att.toggle"][data-rid="R_OKJA"]' },
      { sel: '[data-act="cmn.att.toggle"][data-rid="R_MALSUN"]' }, { sel: '[data-act="cmn.att.toggle"][data-rid="R_KYUNGSOOK"]' }, { click: tx('CMN-17.btn.2') }, { see: tx('flow.community.s23.see') }] },
];

// 41장면 밖 화면(③단계). CMN-22는 책임자와 본사 운영 매니저만 저장하고, 저장한 값은 다음 예약부터 쓰인다.
const rsvOn = tx('CMN-22.sw', { name: tx('CMN-22.rsv'), st: tx('CMN-22.on') }), rsvOff = tx('CMN-22.sw', { name: tx('CMN-22.rsv'), st: tx('CMN-22.off') });
const noticeOn = tx('CMN-22.sw', { name: tx('CMN-22.f1'), st: tx('CMN-22.on') }), noticeOff = tx('CMN-22.sw', { name: tx('CMN-22.f1'), st: tx('CMN-22.off') });
const pick = (id) => ({ sel: `[data-act="cmn.pl.pick"][data-id="${id}"]` });
const extra = [
  { at: '2027-01-21T09:00:00', as: 'st.choiym', go: ['CMN-22'], say: tx('flow.community.p3.say.1'),
    steps: [{ see: tx('CMN-22.title') }, { see: tx('CMN-22.rsvOff') }, { see: rsvOn },
      { fill: 'cMax', value: tx('CMN-22.people', { n: 0 }) }, { click: tx('CMN-22.save') }, { see: tx('CMN-22.errNum') }, { sel: '.alert-err' },
      { fill: 'cMax', value: tx('CMN-22.people', { n: 6 }) }, { fill: 'cDay', value: tx('CMN-22.min', { n: 30 }) }, { click: tx('CMN-22.save') }, { see: tx('CMN-22.errDur') },
      { fill: 'cDay', value: `${tx('CMN-22.hour', { n: 1 })} ${tx('CMN-22.min', { n: 30 })}` }, { fill: 'cHours', value: '09:00~25:00' }, { click: tx('CMN-22.save') }, { see: tx('CMN-22.errHours') },
      { fill: 'cHours', value: '09:00~20:00' }, { fill: 'cRule', value: tx('flow.community.p3.rule') }, { click: tx('CMN-22.save') },
      { see: tx('CMN-22.logH') }, { see: tx('CMN-22.logItem', { label: tx('CMN-22.l.max'), a: tx('CMN-22.people', { n: 8 }), b: tx('CMN-22.people', { n: 6 }) }) }, { see: tx('CMN-22.logRule') },
      { see: tx('CMN-22.unitLine', { slot: tx('CMN-22.hour', { n: 1 }), daily: `${tx('CMN-22.hour', { n: 1 })} ${tx('CMN-22.min', { n: 30 })}` }) },
      pick('KARAOKE'), { click: rsvOn }, { click: tx('CMN-22.save') }, { see: tx('CMN-22.logItem', { label: tx('CMN-22.rsv'), a: tx('CMN-22.on'), b: tx('CMN-22.off') }) },
      { click: noticeOn }, { click: tx('CMN-22.save') }, { see: tx('CMN-22.logItem', { label: tx('CMN-22.f1'), a: tx('CMN-22.on'), b: tx('CMN-22.off') }) }] },
  { at: '2027-01-21T09:30:00', as: 'hq.han', go: ['CMN-22'], say: tx('flow.community.p3.say.2'),
    steps: [{ see: tx('core.need.refuse') }, { no: tx('CMN-22.save') }, { as: 'st.kimhj' }, { go: 'CMN-22' }, { see: tx('core.need.refuse') }, { as: 'hq.jung' }, { go: 'CMN-22' }, { see: tx('CMN-22.list') }, { see: tx('CMN-22.logH') }] },
  { at: '2027-01-21T10:00:00', as: 'm.malsun', go: ['CMN-08'], say: tx('flow.community.p3.say.3'),
    steps: [{ see: tx('flow.community.p3.see.1') }, { no: tx('flow.community.p3.no.1') }, { click: tx('CMN-08.next') }, { sel: 'input[name="day"][value="2027-01-22"]' }, { click: tx('CMN-08.next') },
      { see: tx('CMN-08.timeNote', { slot: tx('CMN-22.hour', { n: 1 }), daily: `${tx('CMN-22.hour', { n: 1 })} ${tx('CMN-22.min', { n: 30 })}` }) }, { sel: '[data-set="time=14:00"]' }, { click: tx('CMN-08.next') },
      { sel: '[data-set="people=2"]' }, { click: tx('CMN-08.next') }, { see: tx('CMN-08.rulesH1', { short: tx('flow.community.p3.short') }) }, { see: tx('flow.community.p3.rule.last') },
      { click: tx('CMN-08.rulesOk') }, { click: tx('CMN-08.yes') }, { see: tx('CMN-08.doneH1') }, { go: 'CMN-10' }, { see: tx('CMN-22.featOff') }] },
  { at: '2027-01-21T11:00:00', as: 'st.choiym', go: ['CMN-22'], say: tx('flow.community.p3.say.4'),
    steps: [{ click: noticeOff }, { click: tx('CMN-22.save') }, { see: tx('CMN-22.logItem', { label: tx('CMN-22.f1'), a: tx('CMN-22.off'), b: tx('CMN-22.on') }) }, pick('KARAOKE'), { click: rsvOff }, { click: tx('CMN-22.save') },
      { see: tx('CMN-22.logItem', { label: tx('CMN-22.rsv'), a: tx('CMN-22.off'), b: tx('CMN-22.on') }) }, { as: 'm.malsun' }, { go: 'CMN-10' }, { no: tx('CMN-22.featOff') }, { go: 'CMN-08' }, { see: tx('flow.community.p3.no.1') }] },
];

export default {
  key: 'community',
  seed: () => structuredClone(SEED),
  api: api_,
  tick() { ensure(); },
  actions,
  screens: {
    'CMN-02': { app: 'home', title: tx('CMN-02.title'), render: programList },
    'CMN-03': { app: 'home', title: tx('CMN-03.title'), render: sessionDetail },
    'CMN-08': { app: 'home', title: tx('CMN-08.title'), render: facilityBook },
    'CMN-07': { app: 'home', title: tx('CMN-07.title'), render: myList },
    'CMN-10': { app: 'home', title: tx('CMN-10.title'), render: noticeList },
    'CMN-11': { app: 'home', title: tx('CMN-11.title'), render: noticeDetail },
    'CMN-13': { app: 'family', title: tx('CMN-13.title'), render: familyNotices },
    'CMN-14': { app: 'ops', title: tx('CMN-14.title'), render: hub },
    'CMN-17': { app: 'ops', title: tx('CMN-17.title'), render: sessionPage },
    'CMN-22': { app: 'ops', title: tx('CMN-22.title'), render: cmn22 },
  },
  flow,
  extra,
};
