import { tx } from '../lib/text.js';
import { loadData } from '../lib/text.js';
// D 보호자 포털·동의(모듈키 family). 회원 화면 FAM-01~05, 보호자 화면 FAM-06a~f, 직원 화면 FAM-09~11.
// 허락 판단은 canSee(canSeeLink) 한 곳이다. 다른 모듈 db는 읽지 않고 api.x.y?.()로만 부른다.
import { api, db, view, route, emit, refuse, go, href, me, nowISO, esc, ic, fmt, overlay, sheet, sheetWrap, denied, empty, save, sms } from '../lib/kit.js';
import { PERSONAS } from '../lib/people.js';
const SEED = await loadData('family');


// ---------- 코드와 표시 이름 ----------
const ITEMS = ['LIFE', 'SCHEDULE', 'BILL', 'HEALTH', 'REQUEST'];
const NAME = { LIFE: tx('family.shared.LIFE.2'), SCHEDULE: tx('family.shared.SCHEDULE.2'), BILL: tx('family.shared.BILL.2'), HEALTH: tx('family.shared.HEALTH.2'), REQUEST: tx('family.shared.REQUEST.2') };
const STAFF_NAME = { LIFE: tx('FAM-09.LIFE'), SCHEDULE: tx('FAM-09.SCHEDULE'), BILL: tx('FAM-09.BILL'), HEALTH: tx('FAM-09.HEALTH'), REQUEST: tx('FAM-09.REQUEST') };
const DESC = {
  LIFE: tx('family.shared.LIFE'),
  SCHEDULE: tx('family.shared.SCHEDULE'),
  BILL: tx('family.shared.BILL'),
  HEALTH: tx('family.shared.HEALTH'),
  REQUEST: tx('family.shared.REQUEST'),
};
const ICON = { LIFE: 'newspaper', SCHEDULE: 'calendar', BILL: 'file-text', HEALTH: 'heart', REQUEST: 'clipboard-list' };
const TARGET = { LIFE: 'FAM-06b', SCHEDULE: 'FAM-06e', BILL: 'FAM-06c', HEALTH: 'FAM-06d', REQUEST: 'REQ-10' };
const VERB = { LIFE: tx('FAM-04.LIFE'), SCHEDULE: tx('FAM-04.SCHEDULE'), BILL: tx('FAM-04.BILL'), HEALTH: tx('FAM-04.HEALTH'), REQUEST: tx('FAM-04.REQUEST') };
const KIND = { VISIT: tx('family.KIND.VISIT'), HOSPITAL: tx('family.KIND.HOSPITAL'), STAGE: tx('family.KIND.STAGE') };
const CHANGE_NAME = { NOT_GRANTED: tx('family.shared.NOTGRANTED'), PENDING: tx('family.shared.PENDING'), GRANTED: tx('family.shared.GRANTED'), REVOKED: tx('family.shared.REVOKED') };
const SEC_TITLE = { MEAL: tx('FAM-06b.MEAL'), PROG: tx('FAM-06b.PROG'), REQ: tx('FAM-06b.REQ') };
const HEALTH_WORDS = [tx('FAM-10.text.12'), tx('FAM-10.text.11'), tx('FAM-10.text.10'), tx('FAM-10.text.9'), tx('FAM-10.text.8'), tx('FAM-10.text.7'), tx('FAM-10.text.6'), tx('FAM-10.text.5'), tx('FAM-10.text.4')];
const HEALTH_MARK = tx('family.HEALTH_MARK.text');
const OPS_ROLES = ['HQ_ADMIN', 'HQ_OPS', 'MANAGER', 'FRONT', 'LIFE', 'CARE'];
const MONEY_ROLES = ['FRONT', 'LIFE', 'MANAGER']; // 금전 부탁 접수: 프런트, 생활 지원(책임자는 사업장 직원과 같다)
const MONEY_KINDS = ['BANKBOOKCARD', 'CASH', 'TRANSFER', 'PASSWORDOTP', 'FINANCIALPRODUCT', 'LENDING', 'OTHER'];
const MONEY_KIND = { BANKBOOKCARD: tx('FAM-12.kind.BANKBOOKCARD'), CASH: tx('FAM-12.kind.CASH'), TRANSFER: tx('FAM-12.kind.TRANSFER'), PASSWORDOTP: tx('FAM-12.kind.PASSWORDOTP'), FINANCIALPRODUCT: tx('FAM-12.kind.FINANCIALPRODUCT'), LENDING: tx('FAM-12.kind.LENDING'), OTHER: tx('FAM-12.kind.OTHER') };
const MONEY_REC = { BANKBOOKCARD: tx('FAM-12.rec.kind.BANKBOOKCARD'), CASH: tx('FAM-12.rec.kind.CASH'), TRANSFER: tx('FAM-12.rec.kind.TRANSFER'), PASSWORDOTP: tx('FAM-12.rec.kind.PASSWORDOTP'), FINANCIALPRODUCT: tx('FAM-12.rec.kind.FINANCIALPRODUCT'), LENDING: tx('FAM-12.rec.kind.LENDING'), OTHER: tx('FAM-12.rec.kind.OTHER') };
const MONEY_HOW = { PHONE: tx('FAM-12.how.PHONE'), DIRECT: tx('FAM-12.how.DIRECT') };
const MONEY_ROLE = { FRONT: tx('FAM-12.rec.role.FRONT'), LIFE: tx('FAM-12.rec.role.LIFE'), MANAGER: tx('FAM-12.rec.role.MANAGER') };
const MONEY_TO = { SELF: tx('FAM-12.rec.to.SELF'), REP: tx('FAM-12.to.1.name'), FAMILY: tx('FAM-12.to.2.name'), MANAGER: tx('FAM-12.to.4.name') };
const MONEY_CONTACT = { DECLINED: tx('FAM-12.rec.contact.DECLINED'), PERMITTED: tx('FAM-12.to.2.btn') };
const RELATIONS = [tx('FAM-14.rel.1'), tx('FAM-14.rel.2'), tx('FAM-14.rel.3'), tx('FAM-14.rel.4'), tx('FAM-14.rel.5'), tx('FAM-14.rel.6'), tx('FAM-14.rel.7'), tx('FAM-14.rel.8'), tx('FAM-14.rel.9')];
const INVITE_DAYS = 7; // [가설] 초대 링크 기간
const INPUT_ROLES = ['MANAGER', 'FRONT', 'LIFE', 'CARE'];
const LOG_ROLES = ['HQ_ADMIN', 'HQ_OPS', 'MANAGER'];
const FRONT = `${tx('family.shared.text.22')}<span class="nowrap">(<a href="tel:0200000000">02-000-0000</a>${tx('family.shared.a')}</span>${tx('family.shared.span')}`;
const STAFF_DENIED = tx('family.shared.text.21');
const WARN = tx('FAM-10.text.3');
const NOTICE_RULE = {
  LIFE_ABSENCE: { item: 'LIFE', start: 'absenceNoticeStartedAt' },
  SCHEDULE_PROGRAMS: { item: 'SCHEDULE', start: 'scheduleProgramsStartedAt' },
};
const ARROW = '<svg class="i i-inline" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';

// ---------- 작은 도구 ----------
const F = () => db.family;
const nid = (p) => `${p}${++F().n}`;
const p2 = (n) => String(n).padStart(2, '0');
const D = (s) => (s instanceof Date ? s : new Date(String(s).length === 10 ? `${s}T00:00:00` : s));
const toISO = (d) => `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}T${p2(d.getHours())}:${p2(d.getMinutes())}:${p2(d.getSeconds())}`;
const ymd = (s) => fmt.ymd(D(s));
const ymdKo = (s) => { const d = D(s); return `${tx('family.shared.text.20', { getFullYear: d.getFullYear(), v: d.getMonth() + 1, getDate: d.getDate() })}`; };
const md2 = (s) => { const d = D(s); return `${d.getMonth() + 1}/${d.getDate()}`; };
const when = (s) => `${fmt.md(D(s))} ${fmt.ampm(D(s))}`;
const weekday = (s) => `${tx('family.weekday.text.2', { v: tx('family.weekday.text')[D(s).getDay()] })}`;
const hasBatchim = (s) => { const c = String(s).trim().slice(-1).charCodeAt(0); return c >= 0xac00 && c <= 0xd7a3 && (c - 0xac00) % 28 !== 0; };
const iga = (s) => (hasBatchim(s) ? tx('family.shared.text.19') : tx('family.shared.text.18'));
const eul = (s) => (hasBatchim(s) ? tx('FAM-01.text.16') : tx('FAM-01.text.15'));
const addDays = (s, n) => { const d = new Date(D(s)); d.setDate(d.getDate() + n); return d; };
const weekLabel = (mon) => `${tx('family.shared.text.23', { v: D(mon).getMonth() + 1, v2: [tx('family.shared.text.17'), tx('family.shared.text.16'), tx('family.shared.text.15'), tx('family.shared.text.14'), tx('family.shared.text.13')][Math.ceil(D(mon).getDate() / 7) - 1] })}`;
const rec = (p) => PERSONAS[p];

const linkById = (id) => F().links.find((l) => l.id === id);
const linksOf = (rid) => F().links.filter((l) => l.residentId === rid);
const linkOfPersona = (pid) => F().links.find((l) => l.personId === pid);
const resOf = (rid) => F().residents.find((r) => r.id === rid);
const rname = (rid) => api.core.residentName?.(rid) || resOf(rid)?.name || '';

const cRow = (lid, item) => F().consent.find((c) => c.linkId === lid && c.item === item);
const cState = (lid, item) => cRow(lid, item)?.status ?? 'NOT_GRANTED';
const agreedOf = (lid) => { const rows = F().sensitive.filter((s) => s.linkId === lid); const r = rows[rows.length - 1]; return r?.status === 'AGREED' ? r : null; };
const lastGrantAt = (lid, item) => F().changes.filter((c) => c.linkId === lid && c.item === item && c.to === 'GRANTED').map((c) => c.at).pop();
const lastChange = (lid, item) => F().changes.filter((c) => c.linkId === lid && c.item === item).pop();
const josaName = (l) => `${tx('family.shared.text.12', { name: l.name, relation: l.relation })}`;

// ---------- 허락 판단 (유일한 곳) ----------
function canSeeLink(link, key) {
  if (!link || link.status !== 'ACTIVE') return false;
  if (cState(link.id, key) !== 'GRANTED') return false;
  if (key === 'HEALTH' && !agreedOf(link.id)) return false;
  return true;
}
function canSee(personaId, key) {
  const p = rec(personaId);
  if (!p) return false;
  if (p.key === 'MEMBER') return true;
  return canSeeLink(linkOfPersona(personaId), key);
}
// 범위가 늘기 전에 허락한 회원은 안내(FAM-17·20)를 확인해야 그 줄이 보호자에게 간다.
function gateOk(link, noticeKey) {
  const rule = NOTICE_RULE[noticeKey], g = lastGrantAt(link.id, rule.item);
  if (!g || g >= F().settings[rule.start]) return true;
  return F().noticeAcks.some((a) => a.residentId === link.residentId && a.key === noticeKey);
}
const absenceVisible = (link) => canSeeLink(link, 'LIFE') && gateOk(link, 'LIFE_ABSENCE');
const programsVisible = (link) => canSeeLink(link, 'SCHEDULE') && gateOk(link, 'SCHEDULE_PROGRAMS');
function pendingNotices(rid) {
  return Object.keys(NOTICE_RULE).filter((k) => linksOf(rid).some((l) => cState(l.id, NOTICE_RULE[k].item) === 'GRANTED' && !gateOk(l, k)));
}

function setConsent(link, item, to, actor, batchId = null) {
  const row = cRow(link.id, item), from = row?.status ?? 'NOT_GRANTED';
  if (row) { row.status = to; row.batchId = batchId; } else F().consent.push({ linkId: link.id, item, status: to, prev: from, batchId });
  if (to === 'PENDING' && cRow(link.id, item)) cRow(link.id, item).prev = from;
  const ch = { id: nid('CC'), at: nowISO(), residentId: link.residentId, linkId: link.id, item, from, to, actor, batchId };
  F().changes.push(ch);
  emit('family.FamilyConsentChanged', { residentId: link.residentId, guardianLinkId: link.id, item, status: to });
  return ch;
}

// ---------- 알림 문자 (내용 없음, 조용한 시간 22~08시) ----------
const smsNew = (n) => `${tx('FAM-01.text.14', { n })}`;
const smsWider = (n) => `${tx('FAM-01.text.13', { n })}`;
function quietUntil(iso) {
  const d = D(iso), h = d.getHours();
  if (h >= 22) { d.setDate(d.getDate() + 1); d.setHours(8, 0, 0, 0); return toISO(d); }
  if (h < 8) { d.setHours(8, 0, 0, 0); return toISO(d); }
  return iso;
}
function stillValid(row) {
  const refId = String(row.ref).split(':')[0];
  if (row.reason === 'SCOPE_WIDENED') return true;
  if (row.item === 'HEALTH') return F().news.some((n) => n.id === refId && n.status === 'POSTED');
  if (row.item === 'LIFE') return F().cards.some((c) => c.id === refId) && absenceVisible(linkById(row.linkId));
  return true;
}
function dispatch(row) {
  const link = linkById(row.linkId);
  const ok = !!link && link.status === 'ACTIVE' && canSeeLink(link, row.item) && stillValid(row);
  row.state = ok ? 'SENT' : 'SKIPPED';
  if (ok) db.sms.push({ at: row.sendAfter, to: link.name, text: row.reason === 'SCOPE_WIDENED' ? smsWider(rname(link.residentId)) : smsNew(rname(link.residentId)), from: '' });
}
function enqueue(linkId, reason, item, ref) {
  const q = F().queue;
  if (q.some((x) => x.linkId === linkId && x.reason === reason && x.item === item && x.ref === ref)) return;
  const row = { id: nid('NQ'), linkId, reason, item, ref, sendAfter: quietUntil(nowISO()), state: 'WAIT' };
  q.push(row);
  if (row.sendAfter <= nowISO()) dispatch(row);
}
const widened = (link, ch) => enqueue(link.id, 'SCOPE_WIDENED', ch.item, ch.id);

// ---------- 주간 생활 리포트 (규칙 기반 초안) ----------
const reportOf = (id) => F().reports.find((r) => r.id === id);
const healthHits = (text) => HEALTH_WORDS.filter((w) => text.includes(w));
const sentencesOf = (text) => String(text).split(/(?<=\.)\s+/).map((s) => s.trim()).filter(Boolean);
function draftLines(rid, from, to) {
  const lines = [], ev = { from, to, sessions: [], requests: [] };
  const m = api.core.mealCount?.(rid, from, to);
  if (m && m.total) lines.push({ k: 'MEAL', t: `${tx('family.draftLines.text.2', { total: m.total, served: m.served })}` });
  const at = api.community.attendance?.(rid, from, to);
  const progs = (Array.isArray(at) ? at : at?.items || []).map((x) => ({ d: x.startsAt ?? x.at ?? x.date, n: x.name ?? x.programName ?? x.title, id: x.sessionId ?? x.id })).filter((x) => x.d && x.n).sort((a, b) => String(a.d).localeCompare(String(b.d)));
  if (progs.length) { lines.push({ k: 'PROG', t: `${tx('family.draftLines.text', { join: progs.map((x) => `${weekday(x.d)} ${x.n}`).join(', ') })}` }); ev.sessions = progs.map((x) => x.id).filter(Boolean); }
  const dn = api.requests.doneList?.(rid, from, to);
  const reqs = (Array.isArray(dn) ? dn : dn?.items || []).map((x) => ({ d: x.closedAt ?? x.doneOn ?? x.at ?? x.date, line: x.line, kind: x.label ?? x.kind ?? x.title, id: x.id ?? x.requestId })).filter((x) => x.d);
  reqs.forEach((x) => { lines.push({ k: 'REQ', t: x.line ?? `${tx('family.draftLines.text.3', { weekday: weekday(x.d), v: x.kind ?? tx('family.draftLines.t') })}` }); if (x.id) ev.requests.push(x.id); });
  return { lines, ev };
}
function draftWeek(mon) {
  const from = ymd(mon), to = ymd(addDays(mon, 6));
  F().residents.forEach((r) => {
    const first = linksOf(r.id).filter((l) => canSeeLink(l, 'LIFE')).map((l) => lastGrantAt(l.id, 'LIFE')).sort()[0];
    if (!first || from < ymd(first)) return;
    if (F().reports.some((x) => x.residentId === r.id && x.weekStart === from)) return;
    const ai = F().acks.some((a) => a.personId === r.memberId && a.audience === 'MEMBER' && a.version >= 1);
    const { lines, ev } = ai ? draftLines(r.id, from, to) : { lines: [], ev: { from, to, sessions: [], requests: [] } };
    const body = [...lines.map((x) => x.t), ...(ai && F().settings.draftInjectsHealth ? [HEALTH_MARK] : [])].join(' ');
    F().reports.push({ id: nid('RP'), residentId: r.id, weekStart: from, weekEnd: to, status: 'DRAFT', source: ai ? 'AI' : 'STAFF', lines, body, evidence: ev, sections: [], recipients: [], reviewerId: null, sentAt: null });
  });
}
function makeDrafts(prev, next) {
  const end = D(next), d = D(prev);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 1);
  for (let g = 0; d <= end && g < 120; g++, d.setDate(d.getDate() + 1)) if (d.getDay() === 1) draftWeek(addDays(d, -7));
}

// ---------- 열람 기록 ----------
function basisOf(link, item) {
  const st = cState(link.id, item), ch = lastChange(link.id, item);
  if (st === 'GRANTED') return { type: 'GRANT', at: lastGrantAt(link.id, item) };
  if (st === 'REVOKED' && ch) return { type: 'REVOKE', at: ch.at };
  return { type: 'NONE', at: null };
}
// 계정·시각을 바꾸는 순간에는 앞 화면이 한 번 더 그려진다. 그 그림은 본 것이 아니라서, 화면이 그대로일 때만 기록한다.
const here = () => `${route.id}|${db.persona}|${db.now}`;
function logView(p, link, item, what, result) {
  if (!link) return;
  const key = here(), t = nowISO(), basis = basisOf(link, item);
  setTimeout(() => {
    if (here() !== key || !F()) return;
    if (F().log.some((x) => x.at === t && x.viewerId === p.id && x.item === item && x.what === what && x.result === result)) return;
    F().log.push({ id: nid('AL'), at: t, residentId: link.residentId, viewerId: p.id, viewerKind: 'GUARDIAN', name: link.name, relation: link.relation, item, what, result, basis });
    save();
  }, 0);
}
function basisText(x) {
  if (x.viewerKind === 'STAFF') return tx('FAM-11.text.9');
  if (x.basis.type === 'GRANT') return `${tx('FAM-11.text.8', { md2: md2(x.basis.at) })}`;
  if (x.basis.type === 'REVOKE') return `${tx('FAM-11.text.7', { md2: md2(x.basis.at), hm: fmt.hm(D(x.basis.at)) })}`;
  return tx('FAM-11.text.6');
}

// ---------- 공개 api ----------
const api_ = {
  canSee,
  viewersOf: (rid, item) => linksOf(rid).filter((l) => canSeeLink(l, item)).map((l) => ({ linkId: l.id, personId: l.personId, relation: l.relation })),
  nextSendAt: (iso = nowISO()) => quietUntil(iso),
  publishHealthNews(a) {
    const key = a.sourceId ? `${a.source}:${a.sourceId}` : null;
    const hit = F().news.find((n) => (key && n.key === key) || (!key && n.residentId === a.residentId && n.kind === a.kind && n.at === a.at));
    const row = { id: hit?.id ?? nid('HN'), key, residentId: a.residentId, kind: a.kind, listLine: a.listLine ?? '', title: a.title || KIND[a.kind] || '', body: a.body ?? '', at: a.at ?? nowISO(), occurredAt: a.occurredAt ?? a.at ?? nowISO(), recordedBy: a.recordedBy ?? null, status: 'POSTED' };
    if (hit) Object.assign(hit, row); else F().news.push(row);
    const seen = linksOf(a.residentId).filter((l) => visibleNews(l).some((n) => n.id === row.id));
    if (!hit) seen.forEach((l) => enqueue(l.id, 'NEW_NEWS', 'HEALTH', row.id));
    return { healthEventId: row.id, visibleToCount: seen.length, noticeSendAt: seen.length ? quietUntil(nowISO()) : null };
  },
  recordRequestView({ residentId, personaId, what = tx('family.api_.recordRequestView') }) {
    const link = linkOfPersona(personaId);
    if (canSeeLink(link, 'REQUEST') && link.residentId === residentId) logView(rec(personaId), link, 'REQUEST', what, 'ALLOW');
  },
  consentSummary() {
    const ids = new Set((api.core.residents?.() || F().residents).map((r) => r.id)), now = nowISO(), wk = toISO(addDays(now, -7));
    const act = F().links.filter((l) => l.status === 'ACTIVE' && ids.has(l.residentId));
    const rids = (f) => new Set(act.filter(f).map((l) => l.residentId)).size;
    const fb = F().feedback.filter((x) => x.state === 'OPEN' && x.at <= now);
    return {
      linked: rids(() => true),
      sharing: rids((l) => ITEMS.some((i) => cState(l.id, i) === 'GRANTED')),
      healthAgreed: rids((l) => !!agreedOf(l.id) && cState(l.id, 'HEALTH') === 'GRANTED'),
      pending: waiting().length,
      revoked7: F().changes.filter((c) => c.to === 'REVOKED' && c.actor.kind !== 'SYSTEM' && c.at <= now && c.at > wk).length,
      systemRevoked7: F().changes.filter((c) => c.to === 'REVOKED' && c.actor.kind === 'SYSTEM' && c.at <= now && c.at > wk).length,
      openFeedback: fb.length,
      overdueFeedback: fb.filter((x) => x.at < toISO(addDays(now, -2))).length,
      asOf: now,
    };
  },
  aiNoticeAcked(rid, personId) {
    const pid = personId ?? resOf(rid)?.memberId;
    return F().acks.some((a) => a.personId === pid && a.audience === 'MEMBER' && a.version >= 2);
  },
  navCounts() {
    const a = waiting().length, b = F().reports.filter((r) => r.status !== 'SENT').length;
    return { ...(a ? { 'FAM-09': a } : {}), ...(b ? { 'FAM-10': b } : {}) };
  },
};

function visibleNews(link) {
  const ag = agreedOf(link.id);
  if (!ag || !canSeeLink(link, 'HEALTH')) return [];
  return F().news.filter((n) => n.residentId === link.residentId && n.status === 'POSTED' && String(n.occurredAt).slice(0, 10) >= String(ag.at).slice(0, 10)).sort((a, b) => String(a.at).localeCompare(String(b.at)));
}
const waiting = (rid) => F().batches.filter((b) => b.status === 'WAITING' && (!rid || b.residentId === rid) && b.items.some((i) => cState(i.linkId, i.item) === 'PENDING'));

// ---------- 화면 조각 ----------
const flash = (text) => `<div class="alert" role="status">${ic('info')}<p class="t-body-lg">${text}</p></div>`;
const back = (to, label = tx('family.shared.text.11')) => `<a class="btn btn-ghost btn-md" href="${href(to)}" style="align-self: flex-start;">${ic('chevron-left')}${label}</a>`;
const scope = (text) => `<div class="scope">${ic('eye')}<p class="t-body-md">${text}</p></div>`;
const ctx = () => { const p = me(); return { p, link: linkOfPersona(p.id), rid: p.residentId }; };
function denyGuardian(link, rid) {
  if (link?.status === 'ENDED') return denied(`${tx('family.shared.text.10', { rname: rname(rid) })}`);
  return denied(`${tx('family.shared.text.9', { rname: rname(rid) })}`, tx('family.shared.denied.2'), href('FAM-06f'));
}
function sentReport(rid) { return F().reports.filter((r) => r.residentId === rid && r.status === 'SENT').sort((a, b) => b.weekStart.localeCompare(a.weekStart))[0]; }
function whatOf(item, rid) {
  if (item === 'LIFE') { const r = sentReport(rid); return r ? `${tx('family.shared.text.8', { weekLabel: weekLabel(r.weekStart) })}` : NAME.LIFE; }
  if (item === 'BILL') { const v = api.core.latestInvoice?.(rid); return v ? `${tx('family.shared.text.7', { Number: Number(String(v.month).slice(5)) })}` : NAME.BILL; }
  return NAME[item];
}
/** 보호자 화면 열기: 허락이 없으면 COM-04 문구(철회인지 미허용인지 구분하지 않는다)를 돌려주고 열람 기록에 거부로 남긴다. */
function gate(item) {
  const { p, link, rid } = ctx();
  const ok = canSeeLink(link, item);
  logView(p, link, item, whatOf(item, rid), ok ? 'ALLOW' : 'DENIED');
  return ok ? null : denyGuardian(link, rid);
}
function absenceCard(rid, link) {
  if (!absenceVisible(link)) return { card: '', drawer: '' };
  const c = F().cards.filter((x) => x.residentId === rid).pop();
  if (!c) return { card: '', drawer: '' };
  const live = api.core.openAbsences?.()?.find((x) => x.id === c.id);
  const exp = live ? live.expectedOn : c.expectedOn, n = rname(rid);
  const title = c.state === 'ENDED' ? `${tx('family.shared.text.6', { n, md: fmt.md(D(c.returnedOn)) })}` : `${tx('family.shared.text.5', { n, md: fmt.md(D(c.startedOn)) })}`;
  const line = c.state === 'ENDED' ? `${tx('family.shared.text.4', { md: fmt.md(D(c.startedOn)) })}` : exp ? `${tx('family.shared.text.3', { md: fmt.md(D(exp)) })}` : tx('family.shared.text.2');
  return {
    card: `<section class="card tight newsline" aria-label="${tx('family.shared.ariaLabel')}"><div class="row">${ic('bell')}<p class="t-body-md">${title}</p><button class="btn btn-secondary btn-md" type="button" data-set="sheet=absence">${tx('family.shared.btn.2')}</button></div></section>`,
    drawer: view.sheet === 'absence' ? sheetWrap(`<section class="rsheet" role="dialog" aria-modal="true" aria-labelledby="rs-t-ab"><header><h2 id="rs-t-ab" class="t-headline">${title}</h2><button class="btn btn-ghost btn-md" type="button" data-set="sheet=">${ic('x')}${tx('family.shared.btn')}</button></header><div class="body"><p class="t-body-md">${line}</p><p class="t-body-md muted">${tx('family.shared.p', { FRONT })}</p></div></section>`) : '',
  };
}
const programsOf = (rid, link) => {
  if (!programsVisible(link)) return [];
  const r = api.community.familySchedule?.(rid);
  return (Array.isArray(r) ? r : r?.programs || r?.items || []).map((x) => ({ at: x.startsAt ?? x.at, name: x.name ?? x.programName ?? x.title, place: x.place ?? x.placeName ?? '', off: ['CANCELLED', 'SESSION_CANCELLED'].includes(x.state ?? x.status) })).filter((x) => x.at).sort((a, b) => String(a.at).localeCompare(String(b.at)));
};

// ===================== 회원 화면 =====================
const PROXY_TEXT = (p) => `${tx('family.shared.text', { name: p.name })}`;
const memberOnly = (p) => (p.key === 'MEMBER' ? null : denied(PROXY_TEXT(p), tx('family.shared.denied'), href('COM-07')));

function itemBlock(l, item) {
  const st = cState(l.id, item), on = st === 'GRANTED';
  const badge = on ? tx('FAM-01.text.12') : st === 'PENDING' ? tx('FAM-01.text.11') : tx('FAM-01.text.10');
  const note = st === 'REVOKED' ? `<p class="t-body-md muted">${tx('FAM-01.p.10', { md: fmt.md(D(lastChange(l.id, item).at)) })}</p>` : '';
  let btn;
  if (on) btn = `<button class="btn btn-secondary btn-block" type="button" data-set="dialog=stop&dlgLink=${l.id}&dlgItem=${item}">${tx('FAM-01.btn.4')}</button>`;
  else if (st === 'PENDING') btn = `<a class="btn btn-secondary btn-block" href="${href('FAM-03')}">${tx('FAM-01.btn.5')}</a>`;
  else if (item === 'HEALTH') btn = `<a class="btn btn-secondary btn-block" href="${href('FAM-02', { link: l.id })}">${st === 'REVOKED' ? tx('FAM-01.text.9') : tx('FAM-01.text.8')}</a>`;
  else btn = `<button class="btn btn-secondary btn-block" type="button" data-act="fam.grant" data-id="${l.id}" data-item="${item}">${st === 'REVOKED' ? tx('FAM-01.text.9') : tx('FAM-01.text.8')}</button>`;
  return `<div class="stack" id="fam-item-${item}"><hr class="divider"><div class="row between" style="gap: 8px;"><h3 class="t-heading2">${NAME[item]}</h3><span class="badge">${badge}</span></div>${note}<p class="t-body-lg">${DESC[item]}</p>${btn}</div>`;
}
function fam01(params) {
  const p = me(), no = memberOnly(p);
  if (no) return no;
  const rid = p.residentId, links = linksOf(rid).filter((l) => l.status === 'ACTIVE');
  if (!links.length) return `<section class="stack"><h1 class="t-title3">${tx('FAM-01.home')}</h1><p class="t-body-lg">${tx('FAM-01.p.9')}</p><a class="btn btn-primary btn-block" href="${href('FAM-14')}">${tx('FAM-14.title')}</a></section>`;
  const sel = linkById(view.who) ?? links[0];
  const sub = (l) => { const on = ITEMS.filter((i) => cState(l.id, i) === 'GRANTED'); return on.length ? `${tx('FAM-01.text.7', { join: on.map((i) => NAME[i]).join(', '), iga: iga(NAME[on[on.length - 1]]) })}` : tx('FAM-01.text.6'); };
  const cell = (l) => `<li><a class="cell" href="#" data-set="who=${l.id}"${l.id === sel.id ? ' aria-current="true"' : ''}><span class="body"><span class="title">${esc(josaName(l))}</span><span class="sub">${sub(l)}</span></span>${ic('chevron-right')}</a></li>`;
  const on = ITEMS.filter((i) => cState(sel.id, i) === 'GRANTED'), off = ITEMS.filter((i) => !on.includes(i));
  let fl = '';
  if (view.flash === 'GRANTED') fl = flash(`${tx('FAM-01.text.5', { name: esc(sel.name), v: NAME[view.fi], eul: eul(NAME[view.fi]) })}`);
  if (view.flash === 'REVOKED') fl = flash(`${tx('FAM-01.text.4', { name: esc(sel.name), v: NAME[view.fi], eul: eul(NAME[view.fi]), ymdKo: ymdKo(nowISO()), ampm: fmt.ampm(nowISO()) })}`);
  const main = `<section class="stack"><h1 class="t-title3">${tx('FAM-01.home')}</h1><p class="t-body-lg">${tx('FAM-01.p.11')}</p></section>
  <div class="list-detail">
    <div class="ld-list with-alt"><ul class="list card flush">${links.map(cell).join('')}<li><a class="cell" href="${href('FAM-14')}">${ic('plus')}<span class="body"><span class="title">${tx('FAM-14.title')}</span></span>${ic('chevron-right')}</a></li><li><a class="cell" href="${href('FAM-04')}">${ic('eye')}<span class="body"><span class="title">${tx('FAM-04.home')}</span></span>${ic('chevron-right')}</a></li></ul>
      <div class="stack alt-block"><p class="t-body-lg">${tx('FAM-01.p.12')}</p></div></div>
    <div class="ld-detail"><section class="card" id="det" aria-labelledby="det-h"><h2 id="det-h" class="t-heading1">${tx('FAM-01.h2.3', { josaName: esc(josaName(sel)) })}</h2><p class="t-body-lg">${tx('FAM-01.p.13')}</p>${fl}
      ${ITEMS.map((i) => itemBlock(sel, i)).join('')}
      <div class="scope">${ic('eye')}<div class="stack" style="gap: 4px;"><p class="t-body-lg">${tx('FAM-01.p.14', { name: esc(sel.name), v: on.length ? on.map((i) => NAME[i]).join(', ') : tx('FAM-01.text.3') })}</p>${off.length ? `<p class="t-body-lg">${tx('FAM-01.p.8', { join: off.map((i) => NAME[i]).join(', ') })}</p>` : ''}</div></div></section></div>
  </div>`;
  let ovl = '';
  const dl = linkById(view.dlgLink);
  if (view.dialog === 'stop' && dl) {
    const lab = NAME[view.dlgItem];
    ovl = overlay(`<div class="dialog" role="dialog" aria-modal="true" aria-labelledby="stop-h"><h2 id="stop-h" class="t-heading1">${tx('FAM-01.h2.2', { josaName: esc(josaName(dl)), lab, eul: eul(lab) })}</h2>
      <p class="t-body-lg">${tx('FAM-01.p.6', { name: esc(dl.name), lab, iga: iga(lab), name2: esc(dl.name) })}</p>
      <p class="t-body-lg">${tx('FAM-01.p.7', { name: esc(dl.name) })}</p>
      <div class="actions safe-first"><button class="btn btn-secondary" type="button" data-set="dialog=">${tx('FAM-01.btn.3')}</button><button class="btn btn-secondary" type="button" data-act="fam.revoke" data-id="${dl.id}" data-item="${view.dlgItem}">${tx('FAM-01.btn.4')}</button></div></div>`);
  } else {
    const key = params.notice ?? (view.nt === 'done' ? null : pendingNotices(rid)[0]);
    if (key && NOTICE_RULE[key]) {
      const it = NOTICE_RULE[key].item, seers = links.filter((l) => cState(l.id, it) === 'GRANTED').map(josaName).join(', ');
      const intro = key === 'LIFE_ABSENCE'
        ? `<p class="t-body-lg">${tx('FAM-01.p.4')}</p><p class="t-body-lg">${tx('FAM-01.p.5')}</p>`
        : `<p class="t-body-lg">${tx('FAM-01.p.2')}</p><p class="t-body-lg">${tx('FAM-01.p.3')}</p>`;
      const outro = key === 'LIFE_ABSENCE' ? tx('FAM-01.text.2') : tx('FAM-01.text');
      ovl = overlay(`<div class="dialog" role="dialog" aria-modal="true" aria-labelledby="new-h"><h2 id="new-h" class="t-heading1">${tx('FAM-01.h2', { v: NAME[it] })}</h2>${intro}
        <div class="scope">${ic('eye')}<p class="t-body-lg">${tx('FAM-01.p', { v: NAME[it], eul: eul(NAME[it]), seers: esc(seers) })}</p></div><p class="t-body-lg">${outro}</p>
        <div class="actions"><button class="btn btn-secondary" type="button" data-set="nt=done">${tx('FAM-01.btn')}</button><button class="btn btn-primary" type="button" data-act="fam.noticeAck" data-key="${key}">${tx('FAM-01.btn.2')}</button></div></div>`);
    }
  }
  return { main, overlay: ovl };
}

const LAW_HEALTH = [tx('FAM-02.text.5'), tx('FAM-02.text.4'), tx('FAM-02.text.3'), tx('FAM-02.text.2'), tx('FAM-02.text')];
function fam02(params) {
  const p = me(), no = memberOnly(p);
  if (no) return no;
  const links = linksOf(p.residentId).filter((l) => l.status === 'ACTIVE');
  const l = linkById(params.link) ?? links.find((x) => cState(x.id, 'HEALTH') === 'PENDING') ?? links[0];
  if (!l) return empty(tx('FAM-02.empty'));
  const done = view.res === 'AGREED' ? `<div class="alert alert-ok" role="status">${ic('circle-check')}<p class="t-body-lg">${tx('FAM-02.p.9', { name: esc(l.name), ymdKo: ymdKo(nowISO()) })}</p></div>`
    : view.res === 'NOT_AGREED' ? `<div class="alert" role="status">${ic('info')}<p class="t-body-lg">${tx('FAM-02.p.8', { name: esc(l.name) })}</p></div>` : '';
  const law = view.law ? `<div class="band"><p class="t-label-lg strong">${tx('FAM-02.p.7')}</p><ol>${LAW_HEALTH.map((t, i) => `<li class="t-body-md">${i === 0 ? `${t}${esc(l.name)}(${l.relation})` : t}</li>`).join('')}</ol></div>` : '';
  const bar = done ? '' : `<div class="stack action-bar"><button class="btn btn-primary btn-block" type="button" data-act="fam.agree" data-id="${l.id}">${tx('FAM-02.btn.2')}</button><button class="btn btn-secondary btn-block" type="button" data-act="fam.decline" data-id="${l.id}">${tx('FAM-02.btn.3')}</button></div>`;
  return `<h1 class="t-title3">${tx('FAM-02.home')}</h1>
  <section class="card" aria-label="${tx('FAM-02.ariaLabel')}">
    <p class="t-body-lg">${tx('FAM-02.p')}</p>
    <p class="t-body-lg">${tx('FAM-02.p.2', { josaName: esc(josaName(l)), iga: iga(l.relation) })}</p>
    <p class="t-body-lg">${tx('FAM-02.p.3')}</p>
    <p class="t-body-lg">${tx('FAM-02.p.4')}</p>
    <p class="t-body-lg">${tx('FAM-02.p.5')}</p>
    <div class="band"><p class="t-body-lg">${tx('FAM-02.p.6')}</p></div>
    <button class="btn btn-secondary btn-block" type="button" data-set="law=${view.law ? '' : '1'}">${tx('FAM-02.btn')}</button>${law}
  </section>${done}${bar}`;
}

function fam03() {
  const p = me(), no = memberOnly(p);
  if (no) return no;
  const w = waiting(p.residentId);
  if (!w.length) {
    if (view.res === 'CONFIRMED') {
      const hl = linksOf(p.residentId).find((l) => cState(l.id, 'HEALTH') === 'PENDING');
      return `<h1 class="t-title3">${tx('FAM-03.home')}</h1><div class="alert alert-ok" role="status">${ic('circle-check')}<p class="t-body-lg">${tx('FAM-03.p.4')}</p></div>
        ${hl ? `<p class="t-body-lg">${tx('FAM-03.p')}</p><a class="btn btn-primary btn-block" href="${href('FAM-02', { link: hl.id })}">${tx('FAM-03.btn.2')}</a>` : ''}`;
    }
    if (view.res === 'REJECTED') return `<h1 class="t-title3">${tx('FAM-03.home')}</h1><p class="t-body-lg">${tx('FAM-03.p.2')}</p><a class="btn btn-secondary btn-block" href="${href('FAM-01')}">${tx('FAM-03.btn')}</a>`;
    go('FAM-01');
    return '';
  }
  const by = rec(w[0].by), pend = {};
  w.forEach((b) => b.items.forEach((i) => { if (cState(i.linkId, i.item) === 'PENDING') (pend[i.linkId] ||= []).push(i.item); }));
  const rows = Object.keys(pend).map((id) => `<div class="scope">${ic('eye')}<div class="stack" style="gap: 4px;"><p class="t-label-lg strong">${esc(josaName(linkById(id)))}</p><p class="t-body-lg">${ITEMS.filter((i) => pend[id].includes(i)).map((i) => NAME[i]).join(', ')}</p></div></div>`).join('');
  const health = Object.values(pend).some((v) => v.includes('HEALTH'));
  return `<section class="stack"><h1 class="t-title3">${tx('FAM-03.home')}</h1><p class="t-body-lg">${tx('FAM-03.p.3', { name: esc(by.name) })}</p></section>
  <section class="stack" aria-label="${tx('FAM-03.ariaLabel')}">${rows}${health ? `<p class="t-body-lg">${tx('FAM-03.p')}</p>` : ''}</section>
  <div class="stack"><button class="btn btn-primary btn-block" type="button" data-act="fam.confirm">${tx('FAM-03.btn.3')}</button><button class="btn btn-secondary btn-block" type="button" data-act="fam.reject">${tx('FAM-03.btn.4')}</button></div>`;
}

function fam04() {
  const p = me(), no = memberOnly(p);
  if (no) return no;
  const tab = view.tab ?? 'seen', now = nowISO();
  const tabs = `<nav class="tabs" aria-label="${tx('FAM-04.ariaLabel.2')}"><a href="#" data-set="tab=seen"${tab === 'seen' ? ' aria-current="page"' : ''}>${tx('FAM-04.a')}</a><a href="#" data-set="tab=cut"${tab === 'cut' ? ' aria-current="page"' : ''}>${tx('FAM-04.h2')}</a></nav>`;
  if (tab === 'cut') {
    const rows = F().withholds.filter((x) => x.residentId === p.residentId && x.at <= now);
    return `<h1 class="t-title3">${tx('FAM-04.home')}</h1>${tabs}<h2 class="t-heading2">${tx('FAM-04.h2')}</h2><section class="stack" aria-label="${tx('FAM-04.ariaLabel')}">
      ${rows.map((x) => `<div class="scope">${ic('eye-off')}<p class="t-body-lg">${esc(x.line)}</p></div>`).join('')}<p class="t-body-lg">${tx('FAM-04.p')}</p></section>`;
  }
  const rows = F().log.filter((x) => x.residentId === p.residentId && x.result === 'ALLOW' && x.at <= now).sort((a, b) => b.at.localeCompare(a.at));
  const who = (x) => (x.viewerKind === 'STAFF' ? `${tx('FAM-04.text.3', { name: esc(x.name), v: x.item === 'LIFE' ? tx('FAM-04.text.2') : VERB[x.item] })}` : `${tx('FAM-04.text', { name: esc(x.name), relation: esc(x.relation), v: VERB[x.item] })}`);
  return `<h1 class="t-title3">${tx('FAM-04.home')}</h1>${tabs}<p class="t-body-lg">${tx('FAM-04.p.2')}</p>
    ${rows.length ? `<ul class="list card flush">${rows.map((x) => `<li class="cell"><span class="body"><span class="title">${who(x)}</span><span class="sub">${when(x.at)}</span></span></li>`).join('')}</ul>` : empty(tx('FAM-04.empty'))}`;
}

const LAW_AI = [tx('FAM-05.text.8'),
  tx('FAM-05.text.7'),
  tx('FAM-05.text.6'),
  tx('FAM-05.text.5'),
  tx('FAM-05.text.4'),
  tx('FAM-05.text.3'),
  tx('FAM-05.text.2'),
  tx('FAM-05.text')];
function fam05() {
  const p = me(), rid = p.residentId, acked = F().acks.some((a) => a.personId === p.id && a.audience === 'MEMBER' && a.version >= 2);
  const proxy = p.key === 'PROXY' ? `<p class="t-body-lg">${tx('FAM-05.p.15', { name: esc(p.name), rname: esc(rname(rid)) })}</p>` : '';
  const law = view.law ? `<div class="band"><p class="t-label-lg strong">${tx('FAM-05.p.14')}</p><ol>${LAW_AI.map((t) => `<li class="t-body-md">${t}</li>`).join('')}</ol></div>` : '';
  const bar = acked
    ? `<div class="alert alert-ok" role="status">${ic('circle-check')}<p class="t-body-lg">${tx('FAM-05.p.13')}</p></div><div class="stack action-bar"><a class="btn btn-primary btn-block" href="${href('AST-02')}">${tx('FAM-05.h2.2')}</a><button class="btn btn-secondary btn-block" type="button" data-set="law=${view.law ? '' : '1'}">${tx('FAM-05.btn.2')}</button></div>`
    : `<div class="stack action-bar"><button class="btn btn-primary btn-block" type="button" data-act="fam.ai.ack">${tx('FAM-05.btn')}</button><button class="btn btn-secondary btn-block" type="button" data-set="law=${view.law ? '' : '1'}">${tx('FAM-05.btn.2')}</button></div>`;
  return `<section class="stack"><h1 class="t-title3">${tx('FAM-05.h1')}</h1><p class="t-body-lg">${tx('FAM-05.p')}</p>${proxy}</section>
  <section class="card" aria-label="${tx('FAM-05.ariaLabel')}">
    <div class="stack"><h2 class="t-heading1">${tx('FAM-05.h2')}</h2><p class="t-body-lg">${tx('FAM-05.p.2')}</p><p class="t-body-lg">${tx('FAM-05.p.3')}</p><p class="t-body-lg">${tx('FAM-05.p.4')}</p></div><hr class="divider">
    <div class="stack"><h2 class="t-heading1">${tx('FAM-05.h2.2')}</h2><p class="t-body-lg">${tx('FAM-05.p.5')}</p><p class="t-body-lg">${tx('FAM-05.p.6')}</p><p class="t-body-lg">${tx('FAM-05.p.7')}</p><p class="t-body-lg">${tx('FAM-05.p.8')}</p><p class="t-body-lg">${tx('FAM-05.p.9')}</p></div><hr class="divider">
    <div class="stack"><h2 class="t-heading1">${tx('FAM-05.h2.3')}</h2><p class="t-body-lg">${tx('FAM-05.p.10')}</p><p class="t-body-lg">${tx('FAM-05.p.11')}</p><p class="t-body-lg">${tx('FAM-05.p.12')}</p></div>
  </section>${law}${bar}`;
}

// ===================== 보호자 화면 =====================
function tiles(rid, link) {
  const sub = {
    LIFE: () => { const r = sentReport(rid); return `<span class="sub">${r ? `${tx('FAM-06a.text.3', { weekLabel: weekLabel(r.weekStart) })}` : tx('FAM-06a.LIFE')}</span>`; },
    SCHEDULE: () => { const n = programsOf(rid, link).filter((x) => !x.off)[0]; return n ? `<span class="sub">${fmt.mdw(D(n.at))} ${fmt.ampm(D(n.at))}</span><span class="sub">${esc(n.name)}${n.place ? `, ${esc(n.place)}` : ''}</span>` : `<span class="sub">${tx('FAM-06a.sub.3', { rname: esc(rname(rid)) })}</span>`; },
    BILL: () => { const v = api.core.latestInvoice?.(rid); return `<span class="sub">${v ? `${tx('FAM-06a.text.2', { Number: Number(String(v.month).slice(5)) })}` : DESC.BILL}</span>`; },
    HEALTH: () => { const n = visibleNews(link).pop(); return n ? `<span class="sub">${esc(n.title)}</span><span class="sub">${esc(newsSub(n))}</span>` : `<span class="sub">${tx('FAM-06a.sub.2')}</span>`; },
    REQUEST: () => { const c = api.requests.openCount?.(rid); return typeof c === 'number' ? `<span class="sub">${c ? `${tx('FAM-06a.text', { c })}` : tx('FAM-06a.REQUEST')}</span>` : ''; },
  };
  return sub;
}
const newsSub = (n) => (n.listLine.includes(' · ') ? n.listLine.split(' · ')[0] : `${fmt.md(D(n.occurredAt))}, ${n.listLine}`);
function noticesHtml(rid) {
  const r = api.community.familyNotices?.(rid), list = Array.isArray(r) ? r : r?.items || [];
  if (!list.length) return `<h2 class="t-label-lg muted">${tx('FAM-06a.ariaLabel')}</h2><p class="t-body-md muted">${tx('FAM-06a.p.4')}</p>`;
  const dt = (x) => { const v = x.publishedAt ?? x.at ?? x.postedOn ?? x.date ?? ''; return /^\d{4}-\d{2}-\d{2}/.test(String(v)) ? fmt.md(D(v)) : esc(v); };
  return `<h2 class="t-label-lg muted">${tx('FAM-06a.ariaLabel')}</h2><p class="t-body-md muted">${tx('FAM-06a.p.3')}</p><ul class="list">${list.map((x) => `<li class="cell"><a class="body" href="${x.href ?? href('CMN-13', { id: x.noticeId ?? x.id })}"><span class="title">${esc(x.title)}</span><span class="sub">${dt(x)}</span></a>${ic('chevron-right')}</li>`).join('')}</ul>`;
}
function fam06a() {
  const { link, rid } = ctx(), n = rname(rid);
  const see = ITEMS.filter((i) => canSeeLink(link, i)), cant = ITEMS.filter((i) => !see.includes(i)), t = tiles(rid, link);
  const cantList = `<ul class="cant-list">${cant.map((i) => `<li>${ic('eye-off')}<span>${NAME[i]}</span></li>`).join('')}</ul><p class="t-body-md muted">${tx('FAM-06a.p.2', { n: esc(n) })}</p>`;
  const cantBox = (cls, id) => `<section class="alert cant${cls}" aria-labelledby="${id}"><div class="stack"><h2 id="${id}" class="t-label-lg muted">${tx('FAM-06a.h2')}</h2>${cantList}</div></section>`;
  const odd = see.length % 2 === 1 && see.length !== 3;
  const li = (i, k) => `<li${odd && k === see.length - 1 ? ' class="span-all"' : ''}><a class="cell" href="${href(TARGET[i])}">${ic(ICON[i])}<span class="body"><span class="title">${NAME[i]}</span>${t[i]()}</span>${ic('chevron-right')}</a></li>`;
  const beside = see.length === 3 && cant.length;
  const nav = see.length ? `<nav aria-label="${tx('FAM-06a.ariaLabel.2')}"><ul class="list card flush tiles" aria-label="${tx('FAM-06a.ariaLabel.3')}">${see.map(li).join('')}${beside ? `<li class="beside">${cantBox('', 'cant-s1')}</li>` : ''}</ul></nav>` : '';
  const rest = !cant.length ? '' : beside ? cantBox(' cant-narrow', 'cant-s1n') : cantBox('', 'cant-s2');
  const ab = absenceCard(rid, link);
  return {
    noList: true,
    railTop: `<section class="stack rail-news" aria-label="${tx('FAM-06a.ariaLabel')}">${noticesHtml(rid)}</section><hr class="divider"><p class="t-body-md muted">${tx('FAM-06a.p', { n: esc(n) })}</p><hr class="divider">`,
    main: `<h1 class="t-title3">${tx('FAM-06a.h1', { n: esc(n) })}</h1>${ab.card}${nav}${rest}<ul class="list card flush myrow"><li><a class="cell" href="${href('FAM-06f')}">${ic('eye')}<span class="body"><span class="title">${tx('FAM-06a.title.2')}</span><span class="sub">${tx('FAM-06a.sub')}</span></span>${ic('chevron-right')}</a></li></ul>`,
    overlay: ab.drawer,
  };
}

const parseSections = (rep, body) => {
  const known = new Map(rep.lines.map((x) => [x.t, x.k]));
  return sentencesOf(body).map((t) => ({ k: known.get(t) ?? 'NOTE', t }));
};
function fam06b() {
  const { link, rid } = ctx(), no = gate('LIFE');
  if (no) return no;
  const n = rname(rid), r = sentReport(rid), ab = absenceCard(rid, link);
  const sec = (k) => { const ts = r.sections.filter((s) => s.k === k).map((s) => s.t); return ts.length ? `<div class="stack"><h2 class="t-headline">${SEC_TITLE[k]}</h2><p class="t-body-md">${esc(ts.join(' '))}</p></div>` : ''; };
  const notes = r?.sections.filter((s) => s.k === 'NOTE').map((s) => s.t) ?? [];
  const parts = r ? ['MEAL', 'PROG', 'REQ'].map(sec).filter(Boolean).concat(notes.length ? [`<div class="stack"><p class="t-body-md">${esc(notes.join(' '))}</p></div>`] : []) : [];
  const fb = r && F().feedback.some((x) => x.reportId === r.id && x.linkId === link.id);
  const body = r ? `<div class="stack"><h1 class="t-title3">${tx('FAM-06b.h1', { weekLabel: weekLabel(r.weekStart) })}</h1>${r.source === 'AI' ? `<p class="ai-mark">${ic('info')}${tx('FAM-06b.p.2', { name: esc(rec(r.reviewerId).name), md: fmt.md(D(r.sentAt)) })}</p>` : ''}</div>
    <section class="card" aria-label="${tx('FAM-06b.h1', { weekLabel: weekLabel(r.weekStart) })}">${parts.join('<hr class="divider">')}</section>
    <div class="stack">${fb ? `<p class="t-body-md">${tx('FAM-06b.p', { name: esc(rec(r.reviewerId).name) })}</p>` : `<button class="btn btn-secondary" type="button" data-act="fam.feedback" data-id="${r.id}">${tx('FAM-06b.btn')}</button>`}</div>` : '';
  return { main: `${back('FAM-06a')}${scope(`${tx('FAM-06b.text', { n: esc(n) })}`)}${ab.card}${body}`, overlay: ab.drawer };
}

function fam06c() {
  const { rid } = ctx(), no = gate('BILL');
  if (no) return no;
  const n = rname(rid), v = api.core.latestInvoice?.(rid);
  if (!v) return `${back('FAM-06a')}${scope(`${tx('FAM-06c.text', { n: esc(n) })}`)}`;
  const skip = v.lines.find((l) => l.amount < 0);
  const money = (l) => `<li class="money"><span>${esc(l.label)}</span><b>${l.amount < 0 ? '−' : ''}${fmt.won(Math.abs(l.amount))}</b></li>`;
  return `${back('FAM-06a')}${scope(`${tx('FAM-06c.text', { n: esc(n) })}`)}<h1 class="t-title3">${tx('FAM-06c.h1', { Number: Number(String(v.month).slice(5)) })}</h1>
  <section class="card bill" aria-labelledby="sum-c1"><div class="bill-sum"><h2 id="sum-c1" class="t-label-lg muted">${tx('FAM-06c.h2')}</h2><p class="t-number-lg">${fmt.won(v.total)}</p><p class="t-heading2">${tx('FAM-06c.p.2', { md: fmt.md(D(v.dueOn)) })}</p>
    ${v.mealSkips && skip ? `<p class="t-body-md"><span class="hl">${tx('FAM-06c.span', { mealSkips: v.mealSkips, won: fmt.won(Math.abs(skip.amount)) })}</span></p>` : ''}</div>
    <div class="band"><ul class="list">${v.lines.map(money).join('')}</ul>${v.meals ? `<p class="t-body-md">${tx('FAM-06c.p', { Number: Number(String(v.month).slice(5)), meals: v.meals })}</p>` : ''}</div></section>`;
}

function fam06d() {
  const { p, link, rid } = ctx(), no = gate('HEALTH');
  if (no) return { noRail: true, main: no };
  const n = rname(rid), list = visibleNews(link), sel = list.find((x) => x.id === view.he) ?? list[0];
  const rcd = (x) => { const w = rec(x.recordedBy); return w ? `${tx('FAM-06d.text.4', { name: w.name, v: w.key === 'MANAGER' ? tx('FAM-06d.text.3') : tx('FAM-06d.text.2'), iga: iga(w.key === 'MANAGER' ? tx('FAM-06d.iga.2') : tx('FAM-06d.iga')) })} ` : ''; };
  const body = sel ? `<div class="ld-detail"><section class="card" aria-labelledby="hd1"><h2 id="hd1" class="t-headline">${esc(sel.title)}</h2>${String(sel.body).split('\n').filter(Boolean).map((t) => `<p class="t-body-md">${esc(t)}</p>`).join('')}<p class="t-body-md muted">${esc(rcd(sel))}${FRONT}</p></section></div>` : '';
  const items = list.map((x) => `<li class="cell"${x.id === sel.id ? ' aria-current="true"' : ''}><a class="body" href="#" data-set="he=${x.id}"><span class="title">${esc(x.title)}</span><span class="sub">${esc(newsSub(x))}</span></a>${ic('chevron-right')}</li>`).join('');
  logView(p, link, 'HEALTH', sel ? `${sel.title} ${newsSub(sel)}` : NAME.HEALTH, 'ALLOW');
  return { noRail: true, main: `${back('FAM-06a', tx('FAM-06d.back'))}${scope(`${tx('FAM-06d.text', { n: esc(n) })}`)}<h1 class="t-title3">${tx('FAM-06d.title')}</h1>
    ${list.length ? `<div class="list-detail"><div class="ld-list"><section class="card" aria-label="${tx('FAM-06d.ariaLabel')}"><ul class="list">${items}</ul></section></div>${body}</div>` : empty(tx('FAM-06d.empty'))}` };
}

function fam06e() {
  const { link, rid } = ctx(), no = gate('SCHEDULE');
  if (no) return no;
  const n = rname(rid), k = api.core.keyDates?.(rid) || {}, progs = programsOf(rid, link);
  const row = (label, v, ko) => (v ? `<dt>${label}</dt><dd>${ko ? ymdKo(v) : fmt.md(D(v))}</dd>` : `<dt>${label}</dt><dd>${tx('FAM-06e.dd')}</dd>`);
  const prog = progs.length ? `<ul class="list">${progs.map((x) => (x.off ? `<li class="cell"><span class="body"><span class="title">${tx('FAM-06e.title.2', { mdw: fmt.mdw(D(x.at)), name: esc(x.name) })}</span></span></li>` : `<li class="cell"><span class="body"><span class="title">${fmt.mdw(D(x.at))} ${fmt.ampm(D(x.at))}</span><span class="sub">${esc(x.name)}${x.place ? `, ${esc(x.place)}` : ''}</span></span></li>`)).join('')}</ul>` : `<p class="t-body-md">${tx('FAM-06e.p', { n: esc(n) })}</p>`;
  return `${back('FAM-06a')}<div class="scope">${ic('eye')}<div class="stack" style="gap: 4px;"><p class="t-body-md">${tx('FAM-06e.p.2', { n: esc(n) })}</p><p class="t-body-sm muted">${tx('FAM-06e.p.3')}</p></div></div><h1 class="t-title3">${tx('FAM-06e.title')}</h1>
  <section class="card" aria-labelledby="prog-c2"><h2 id="prog-c2" class="t-headline">${tx('FAM-06e.h2')}</h2>${prog}</section>
  <section class="card" aria-label="${tx('FAM-06e.ariaLabel')}"><dl class="kv wide">${row(tx('FAM-06e.row.6'), k.moveInDate, true)}${row(tx('FAM-06e.row.5'), k.contractEndDate ?? k.contractEnd, true)}${row(tx('FAM-06e.row.4'), k.lastInvoiceIssuedOn)}${row(tx('FAM-06e.row.3'), k.lastInvoiceDueDate)}${row(tx('FAM-06e.row.2'), k.nextInvoiceScheduledOn)}${k.moveOutDate ? row(tx('FAM-06e.row'), k.moveOutDate, true) : ''}</dl></section>
  <div class="stack"><p class="t-body-md muted">${tx('FAM-06e.p.4')}</p><p class="t-body-md muted">${tx('FAM-06e.p.5', { n: esc(n) })}</p></div>`;
}

function fam06f() {
  const { link, rid } = ctx(), n = rname(rid);
  const see = ITEMS.filter((i) => canSeeLink(link, i)), cant = ITEMS.filter((i) => !see.includes(i));
  const grown = link.seen && see.some((i) => !link.seen.includes(i));
  link.seen = see;
  const col = (cls, t, list, ico) => `<ul class="list">${list.map((i) => `<li class="cell">${ic(ico)}<span class="body"><span class="title${cls}">${NAME[i]}</span></span></li>`).join('')}</ul>`;
  return `${back('FAM-06a')}${grown ? `<div class="alert" role="status">${ic('info')}<p class="t-body-md">${tx('FAM-06f.p.2', { n: esc(n) })}</p></div>` : ''}
  <div class="stack"><h1 class="t-title3">${tx('FAM-06f.title')}</h1><p class="t-body-md">${tx('FAM-06f.p.3')}</p></div>
  <div class="grid2"><section class="card" aria-labelledby="see-f1"><h2 id="see-f1" class="t-label-lg muted">${tx('FAM-06f.h2')}</h2>${col('', '', see, 'eye')}</section>
  <section class="card" aria-labelledby="nosee-f1"><h2 id="nosee-f1" class="t-label-lg muted">${tx('FAM-06f.h2.2')}</h2>${col(' muted', '', cant, 'eye-off')}${cant.length ? `<p class="t-body-md muted">${tx('FAM-06f.p', { n: esc(n) })}</p>` : ''}</section></div>
  <p class="t-body-md muted">${tx('FAM-06f.p.4', { n: esc(n) })}</p>`;
}

// ===================== 직원 화면 =====================
const staffOnly = (ok) => (ok ? null : denied(STAFF_DENIED));
function fam09(params) {
  const p = me(), no = staffOnly(OPS_ROLES.includes(p.key));
  if (no) return no;
  const rid = params.rid || 'R_EUNSOOK', r = resOf(rid), links = linksOf(rid), w = waiting(rid);
  const badge = (st) => `<span class="badge${st === 'GRANTED' || st === 'PENDING' ? '' : ' grade-log'}">${CHANGE_NAME[st]}</span>`;
  const row = (l) => {
    const pend = ITEMS.some((i) => cState(l.id, i) === 'PENDING'), ag = agreedOf(l.id), hs = cState(l.id, 'HEALTH');
    const cons = ag ? `${tx('FAM-09.text.6', { md2: md2(ag.at) })}` : hs === 'PENDING' ? tx('FAM-09.text.5') : tx('FAM-09.text.4');
    return `<tr><td data-label="${tx('FAM-09.label')}"><strong>${esc(l.name)}</strong></td><td data-label="${tx('FAM-09.th')}"><span class="badge">${l.status === 'ENDED' ? tx('FAM-09.text.3') : pend ? tx('FAM-09.text.2') : tx('FAM-09.text')}</span></td><td data-label="${tx('FAM-09.th.2')}">${esc(l.relation)}</td>${ITEMS.map((i) => `<td data-label="${STAFF_NAME[i]}">${badge(cState(l.id, i))}</td>`).join('')}<td data-label="${tx('FAM-09.th.3')}">${cons}</td></tr>`;
  };
  const input = INPUT_ROLES.includes(p.key);
  const who = linkById(view.who) ?? links[0];
  const chosen = (i) => view[`i_${i}`];
  const body = `<form class="stack lg" id="fam-input" data-act="fam.propose" data-rid="${rid}">
    <p>${tx('FAM-09.p')}</p>
    <div class="field"><label for="who">${tx('FAM-09.label')}</label><select id="who" name="who" class="input" data-bind="who" data-live>${links.map((l) => `<option value="${l.id}"${l.id === who?.id ? ' selected' : ''}>${esc(l.name)} (${esc(l.relation)})</option>`).join('')}</select></div>
    <fieldset style="border: 0; padding: 0; margin: 0;"><legend class="label" style="font-weight: 600; margin-bottom: 4px;">${tx('FAM-09.legend')}</legend>${ITEMS.map((i) => `<label class="choice"><input type="checkbox" name="i_${i}" data-bind="i_${i}" data-live${['GRANTED', 'PENDING'].includes(cState(who?.id, i)) ? ' disabled' : ''}>${STAFF_NAME[i]}</label>`).join('')}</fieldset>
    <fieldset style="border: 0; padding: 0; margin: 0;"><legend class="label" style="font-weight: 600; margin-bottom: 4px;">${tx('FAM-09.legend.2')}</legend><label class="choice"><input type="radio" name="how" value="PHONE" data-bind="how">${tx('FAM-09.input')}</label><label class="choice"><input type="radio" name="how" value="DIRECT" data-bind="how">${tx('FAM-09.input.2')}</label></fieldset>
    <div class="scope">${ic('info')}<p>${tx('FAM-09.p.2')}</p></div></form>`;
  const foot = `<button class="btn btn-ghost btn-sm" type="button" data-set="sheet=">${tx('FAM-09.btn.2')}</button><button class="btn btn-primary btn-sm" type="submit" form="fam-input"${ITEMS.some(chosen) ? '' : ' disabled'}>${tx('FAM-09.sheet')}</button>`;
  return {
    main: `<div class="page-head"><h1 class="t-title2">${tx('FAM-09.h1', { room: esc(r.room), name: esc(r.name) })}</h1>${LOG_ROLES.includes(p.key) ? `<a class="btn btn-secondary btn-sm" href="${href('FAM-11')}">${tx('FAM-09.btn')}</a>` : ''}${MONEY_ROLES.includes(p.key) ? `<a class="btn btn-secondary btn-sm" href="${href('FAM-12', { rid })}">${tx('FAM-12.title')}</a>` : ''}${input ? `<button class="btn btn-primary btn-sm" type="button" data-set="sheet=input">${ic('plus')}${tx('FAM-09.sheet')}</button>` : ''}</div>
    <section class="stack" aria-labelledby="g"><h2 id="g" class="t-heading2">${tx('FAM-09.label')}</h2><div class="tbl reflow wrapc"><table aria-label="${tx('FAM-09.ariaLabel')}"><thead><tr><th>${tx('FAM-09.label')}</th><th>${tx('FAM-09.th')}</th><th>${tx('FAM-09.th.2')}</th>${ITEMS.map((i) => `<th>${STAFF_NAME[i]}</th>`).join('')}<th>${tx('FAM-09.th.3')}</th></tr></thead><tbody>${links.map(row).join('')}</tbody></table></div>
    ${w.map((b) => `<div class="alert" role="status">${ic('info')}<p><b>${tx('FAM-09.b', { md2: md2(b.at), hm: fmt.hm(D(b.at)), name: esc(rec(b.by).name) })}</b></p></div>`).join('')}</section>
    <p class="demo-note">${tx('FAM-09.p.3')}</p>`,
    overlay: view.sheet === 'input' && input ? sheet(tx('FAM-09.sheet'), body, foot) : '',
  };
}

const reportsHere = () => F().reports.slice().sort((a, b) => a.weekStart.localeCompare(b.weekStart) || a.residentId.localeCompare(b.residentId));
function fam10() {
  const p = me(), no = staffOnly(OPS_ROLES.includes(p.key));
  if (no) return no;
  const fil = view.fil ?? 'pending', all = reportsHere();
  const pend = all.filter((r) => r.status !== 'SENT'), sent = all.filter((r) => r.status === 'SENT');
  const list = fil === 'sent' ? sent : pend; // 밀린 주도 모두 보인다(안 보이면 막대 숫자와 어긋난다)
  const sel = list.find((r) => r.id === view.rep) ?? list[0];
  const wk = (sel ?? all[all.length - 1])?.weekStart;
  if (sel && sel.status === 'DRAFT') sel.status = 'IN_REVIEW';
  if (sel && view.bodyRep !== sel.id) { view.body = undefined; view.bodyRep = sel.id; }
  const text = sel ? (view.body ?? sel.body) : '', hits = healthHits(text);
  const st = { DRAFT: tx('FAM-10.DRAFT'), IN_REVIEW: tx('FAM-10.INREVIEW'), SENT: tx('FAM-10.SENT') };
  const rows = list.map((r) => `<tr${r.id === sel?.id ? ' class="sel"' : ''}><td data-label="${tx('FAM-10.dataLabel')}"><a href="#" data-set="rep=${r.id}"><strong>${tx('FAM-10.row', { room: esc(resOf(r.residentId).room), rname: esc(rname(r.residentId)), weekLabel: weekLabel(r.weekStart) })}</strong></a></td><td data-label="${tx('FAM-10.dataLabel.2')}">${r.status === 'SENT' ? r.recipients.map((x) => `${esc(x.name)}(${esc(x.relation)})`).join(', ') : linksOf(r.residentId).filter((l) => canSeeLink(l, 'LIFE')).map((l) => `${esc(l.name)}(${esc(l.relation)})`).join(', ')}</td><td data-label="${tx('FAM-10.dataLabel.3')}"><span class="badge">${st[r.status]}</span></td></tr>`).join('');
  let panel = '';
  if (sel) {
    const recips = sel.status === 'SENT' ? sel.recipients.map((x) => ({ name: x.name, relation: x.relation, see: x.see })) : linksOf(sel.residentId).filter((l) => canSeeLink(l, 'LIFE')).map((l) => ({ name: l.name, relation: l.relation, see: ITEMS.filter((i) => canSeeLink(l, i)) }));
    const gone = linksOf(sel.residentId).filter((l) => cState(l.id, 'LIFE') === 'REVOKED' && sel.status !== 'SENT');
    const ev = sel.evidence;
    const evText = `${tx('FAM-10.text.13', { md2: md2(ev.from), md22: md2(ev.to), v: ev.sessions.length ? tx('FAM-10.text.2') : '', v2: ev.requests.length ? `${tx('FAM-10.text', { join: ev.requests.map((x) => `#${x}`).join(' ') })}` : '' })}`;
    panel = `<aside class="side-panel" aria-label="${tx('FAM-10.ariaLabel.3')}"><span class="grab" aria-hidden="true"></span>
      <div class="row between"><h2 class="t-heading2">${tx('FAM-10.h2.2', { room: esc(resOf(sel.residentId).room), rname: esc(rname(sel.residentId)), weekLabel: weekLabel(sel.weekStart) })}</h2>${sel.source === 'AI' ? `<span class="ai-mark">${ic('info')}${tx('FAM-10.span')}</span>` : ''}</div>
      ${sel.status === 'SENT' ? '' : `<p>${tx('FAM-10.p.3')}</p>`}
      ${recips.map((x) => `<p class="muted">${tx('FAM-10.p.5', { name: esc(x.name), relation: esc(x.relation) })}<br>${tx('FAM-10.br', { join: x.see.map((i) => NAME[i]).join(', '), v: x.see.includes('HEALTH') ? '' : tx('FAM-10.map') })}</p>`).join('')}
      ${hits.length && sel.status !== 'SENT' ? `<div class="alert alert-warn" role="alert">${ic('triangle-alert')}<p>${WARN}</p></div>` : ''}
      <div class="field"><label for="body">${tx('FAM-10.label')}</label><textarea id="body" class="input" rows="7" data-bind="body" data-live${sel.status === 'SENT' ? ' readonly' : ''}>${esc(sel.status === 'SENT' ? sel.body : text)}</textarea></div>
      <p><span class="hl">${tx('FAM-10.span.2', { evText })}</span></p>
      ${gone.map((l) => `<p class="muted">${tx('FAM-10.p.2', { name: esc(l.name), relation: esc(l.relation), md2: md2(lastChange(l.id, 'LIFE').at), hm: fmt.hm(D(lastChange(l.id, 'LIFE').at)) })}</p>`).join('')}
      ${sel.status === 'SENT' || p.key !== 'LIFE' ? '' : `<div class="panel-act"><button class="btn btn-primary btn-sm" type="button" data-set="dialog=send"${hits.length || !text.trim() ? ' disabled' : ''}>${tx('FAM-10.btn.3')}</button><button class="btn btn-ghost btn-sm" type="button" data-act="fam.report.manual">${tx('FAM-10.btn.4')}</button></div>`}</aside>`;
  }
  const dlg = view.dialog === 'send' && sel ? overlay(`<div class="dialog" role="alertdialog" aria-labelledby="dlg-t" aria-describedby="dlg-d"><h2 id="dlg-t" class="t-heading1">${tx('FAM-10.h2')}</h2><p id="dlg-d">${tx('FAM-10.p', { name: esc(p.name) })}</p><div class="actions"><button class="btn btn-secondary btn-md" type="button" data-set="dialog=">${tx('FAM-10.btn')}</button><button class="btn btn-primary btn-md" type="button" data-act="fam.report.send" data-id="${sel.id}">${tx('FAM-10.btn.2')}</button></div></div>`) : '';
  return {
    main: `<div class="page-head"><h1 class="t-title2">${tx('FAM-10.h1', { v: wk ? `, ${weekLabel(wk)}` : '' })}</h1></div>
    <div class="with-panel"><div class="stack lg"><div class="seg" role="group" aria-label="${tx('FAM-10.ariaLabel')}"><a href="#" data-set="fil=pending"${fil === 'pending' ? ' aria-current="true"' : ''}>${tx('FAM-10.DRAFT')}</a><a href="#" data-set="fil=sent"${fil === 'sent' ? ' aria-current="true"' : ''}>${tx('FAM-10.a')}</a></div>
      <section class="stack" aria-labelledby="lst"><h2 id="lst" class="t-heading2">${fil === 'sent' ? tx('FAM-10.main.2') : tx('FAM-10.main')}</h2><div class="tbl reflow"><table aria-label="${tx('FAM-10.ariaLabel.2')}"><thead><tr><th>${tx('FAM-10.dataLabel')}</th><th>${tx('FAM-10.dataLabel.2')}</th><th>${tx('FAM-10.dataLabel.3')}</th></tr></thead><tbody>${rows}</tbody></table></div></section></div>${panel}</div>
    <p class="demo-note">${tx('FAM-10.p.4')}</p>`,
    overlay: dlg,
  };
}

function logRows(rid) {
  const now = nowISO(), rows = [];
  F().log.filter((x) => x.residentId === rid && x.at <= now).forEach((x) => rows.push({ at: x.at, kind: 'VIEW', who: x.viewerKind === 'STAFF' ? `${x.name}(${x.relation})` : `${tx('FAM-11.text.5', { name: x.name, relation: x.relation })}`, kindWho: x.viewerKind, what: esc(x.what), item: x.item, result: x.result, basis: basisText(x) }));
  F().changes.filter((c) => c.residentId === rid && c.at <= now).forEach((c) => {
    const l = linkById(c.linkId), a = c.actor;
    rows.push({ at: c.at, kind: 'CHANGE', who: a.kind === 'SELF' ? `${tx('FAM-11.text.4', { rname: rname(rid) })}` : `${rec(a.id).name}(${rec(a.id).role})`, kindWho: a.kind, what: `${esc(l.name)}(${esc(l.relation)}) ${NAME[c.item]} ${CHANGE_NAME[c.from]} ${ARROW} ${CHANGE_NAME[c.to]}`, item: c.item, result: '', basis: a.kind === 'STAFF' ? tx('FAM-11.basis.2') : tx('FAM-11.basis') });
  });
  F().exports.filter((x) => x.residentId === rid && x.at <= now).forEach((x) => rows.push({ at: x.at, kind: 'EXPORT', who: x.who, kindWho: 'STAFF', what: tx('FAM-11.what'), item: 'ALL', result: '', basis: '' }));
  return rows.sort((a, b) => b.at.localeCompare(a.at));
}
function fam11() {
  const p = me(), no = staffOnly(LOG_ROLES.includes(p.key));
  if (no) return no;
  const rid = 'R_EUNSOOK', r = resOf(rid), tab = view.tab ?? 'log';
  const tabs = `<nav class="tabs" aria-label="${tx('FAM-11.ariaLabel')}"><a href="#" data-set="tab=log"${tab === 'log' ? ' aria-current="page"' : ''}>${tx('FAM-11.title')}</a><a href="#" data-set="tab=cut"${tab === 'cut' ? ' aria-current="page"' : ''}>${tx('FAM-11.a')}</a><a href="#" data-set="tab=ai"${tab === 'ai' ? ' aria-current="page"' : ''}>${tx('FAM-11.a.2')}</a></nav>`;
  const foot = `<p class="demo-note">${tx('FAM-11.p.2')}</p>`;
  if (tab === 'cut') {
    const rows = F().withholds.filter((x) => x.at <= nowISO());
    return `<div class="page-head"><h1 class="t-title2">${tx('FAM-11.a')}</h1></div>${tabs}<p>${tx('FAM-11.p.6')}</p>
      ${rows.length ? `<ul class="list card flush">${rows.map((x) => `<li class="cell"><span class="body"><span class="title">${esc(x.line)}</span></span></li>`).join('')}</ul>` : `<div class="empty"><span class="state-icon">${ic('inbox')}</span><p class="t-heading2">${tx('FAM-11.p')}</p></div>`}${foot}`;
  }
  if (tab === 'ai') {
    const ids = (api.core.residents?.() || F().residents).map((x) => x.id), now = nowISO();
    const ackOf = (x) => F().acks.filter((a) => a.personId === x.memberId && a.audience === 'MEMBER' && a.at <= now).pop();
    const consents = (x) => linksOf(x.id).filter((l) => agreedOf(l.id) && cState(l.id, 'HEALTH') === 'GRANTED');
    const tot = F().residents.reduce((s, x) => s + consents(x).length, 0), a0 = ackOf(r);
    const unacked = ids.filter((id) => !F().acks.some((a) => a.personId === resOf(id)?.memberId && a.audience === 'MEMBER' && a.at <= now)).length;
    const tr = F().residents.map((x) => { const a = ackOf(x), cs = consents(x); return `<tr><td data-label="${tx('FAM-11.h2')}"><strong>${esc(x.room)} ${esc(x.name)}</strong></td><td data-label="${tx('FAM-11.th')}">${a ? `${tx('FAM-11.text.3', { md2: md2(a.at), version: a.version })}` : '-'}</td><td data-label="${tx('FAM-11.span.2')}">${cs.length ? `${tx('FAM-11.text.2', { length: cs.length, join: cs.map((l) => esc(l.name)).join(', ') })}` : tx('FAM-11.map')}</td><td data-label="${tx('FAM-11.th.2')}">${tx('FAM-11.map')}</td></tr>`; }).join('');
    return `<div class="page-head"><h1 class="t-title2">${tx('FAM-11.a.2')}</h1></div>${tabs}
      <div class="stat-strip"><a href="#"><span class="k">${tx('FAM-11.span')}</span><span class="v">${a0 ? `${tx('FAM-11.text', { version: a0.version })}` : '-'}</span></a><a href="#"><span class="k">${tx('FAM-11.span.2')}</span><span class="v">${tot}<span class="u">${tx('FAM-11.span.3')}</span></span></a><a href="#"><span class="k">${tx('FAM-11.span.4')}</span><span class="v">${tx('FAM-11.map')}</span></a></div>
      <section class="stack" aria-labelledby="lst"><h2 id="lst" class="t-heading2">${tx('FAM-11.h2')}</h2><div class="tbl reflow"><table aria-label="${tx('FAM-11.ariaLabel.3')}"><thead><tr><th>${tx('FAM-11.h2')}</th><th>${tx('FAM-11.th')}</th><th>${tx('FAM-11.span.2')}</th><th>${tx('FAM-11.th.2')}</th></tr></thead><tbody>${tr}</tbody></table></div></section>
      <div class="alert" role="status">${ic('info')}<p>${tx('FAM-11.p.4')}</p></div>
      <div class="alert" role="status">${ic('info')}<p>${tx('FAM-11.p.5', { unacked })}</p></div>${foot}`;
  }
  const all = logRows(rid), first = all[all.length - 1];
  const range = view.range ?? `${first ? ymd(first.at) : ymd(nowISO())} ~ ${ymd(nowISO())}`, m = /(\d{4}-\d{2}-\d{2})\s*~\s*(\d{4}-\d{2}-\d{2})/.exec(range);
  const fw = view.fw ?? 'ALL', fr = view.fr ?? 'ALL', fi = view.fi2 ?? 'ALL';
  const list = all.filter((x) => (!m || (ymd(x.at) >= m[1] && ymd(x.at) <= m[2]))
    && (fw === 'ALL' || (x.kind === 'VIEW' && fw !== 'PROXY' && x.kindWho === (fw === 'STAFF' ? 'STAFF' : 'GUARDIAN')))
    && (fr === 'ALL' || x.result === fr) && (fi === 'ALL' || x.item === fi));
  const sel = list[Number(view.row ?? 0)] ?? list[0];
  const badge = (x) => (x.result ? `<span class="badge">${x.result === 'ALLOW' ? tx('FAM-11.opt.2') : tx('FAM-11.opt')}</span>` : '');
  const opt = (v, cur, t) => `<option value="${v}"${v === cur ? ' selected' : ''}>${t}</option>`;
  return `<div class="page-head"><h1 class="t-title2">${tx('FAM-11.h1', { room: esc(r.room), name: esc(r.name) })}</h1><button class="btn btn-primary btn-sm" type="button" data-act="fam.log.export">${ic('download')}${tx('FAM-11.what')}</button></div>${tabs}
    <p class="hint">${tx('FAM-11.p.7')}</p>
    <form class="log-filters" aria-label="${tx('FAM-11.ariaLabel.4')}" onsubmit="return false">
      <div class="field"><label for="f1">${tx('FAM-11.label')}</label><input id="f1" class="input" type="text" value="${esc(range)}" data-bind="range" data-live></div>
      <div class="field"><label for="f2">${tx('FAM-11.label.2')}</label><select id="f2" class="input" data-bind="fw" data-live>${opt('ALL', fw, tx('FAM-11.opt.8'))}${opt('GUARDIAN', fw, tx('FAM-11.opt.7'))}${opt('PROXY', fw, tx('FAM-11.opt.6'))}${opt('STAFF', fw, tx('FAM-11.opt.5'))}</select></div>
      <div class="field"><label for="f3">${tx('FAM-11.label.3')}</label><select id="f3" class="input" data-bind="fi2" data-live>${opt('ALL', fi, tx('FAM-11.opt.4'))}${ITEMS.map((i) => opt(i, fi, NAME[i])).join('')}</select></div>
      <div class="field"><label for="f4">${tx('FAM-11.dt.2')}</label><select id="f4" class="input" data-bind="fr" data-live>${opt('ALL', fr, tx('FAM-11.opt.3'))}${opt('ALLOW', fr, tx('FAM-11.opt.2'))}${opt('DENIED', fr, tx('FAM-11.opt'))}</select></div></form>
    <div class="with-panel"><div class="stack lg"><section class="stack" aria-labelledby="log"><h2 id="log" class="t-heading2">${tx('FAM-11.title')}</h2><div class="tbl reflow"><table aria-label="${tx('FAM-11.title')}"><thead><tr><th>${tx('FAM-11.dataLabel')}</th><th>${tx('FAM-11.dataLabel.2')}</th><th>${tx('FAM-11.dataLabel.3')}</th><th>${tx('FAM-11.dt.2')}</th></tr></thead><tbody>
      ${list.map((x, i) => `<tr${x === sel ? ' class="sel"' : ''}><td class="num" data-label="${tx('FAM-11.dataLabel')}"><a href="#" data-set="row=${i}">${fmt.stamp(D(x.at))}</a></td><td data-label="${tx('FAM-11.dataLabel.2')}"><b>${esc(x.who)}</b></td><td data-label="${tx('FAM-11.dataLabel.3')}">${x.what}</td><td data-label="${tx('FAM-11.dt.2')}">${badge(x)}</td></tr>`).join('')}</tbody></table></div></section></div>
      ${sel ? `<aside class="side-panel" aria-label="${tx('FAM-11.ariaLabel.2')}"><span class="grab" aria-hidden="true"></span><h2 class="t-heading2">${fmt.stamp(D(sel.at))}</h2><dl class="kvp"><dt>${tx('FAM-11.dataLabel.2')}</dt><dd>${esc(sel.who)}</dd><dt>${tx('FAM-11.dataLabel.3')}</dt><dd>${sel.what}</dd>${sel.result ? `<dt>${tx('FAM-11.dt.2')}</dt><dd>${badge(sel)}</dd>` : ''}${sel.basis ? `<dt>${tx('FAM-11.dt')}</dt><dd>${esc(sel.basis)}</dd>` : ''}</dl><p class="hint">${tx('FAM-11.p.3')}</p></aside>` : ''}</div>${foot}`;
}

// ---------- FAM-12 금전 부탁 접수 [운영사 기준 초안] ----------
// 직원은 돈을 다루지 않는다. 화면은 할 수 있는 일, 넘길 일, 넘길 곳과 처리 기록만 보인다. 기록은 추가만 한다.
const repOf = (rid) => Object.values(PERSONAS).find((x) => x.key === 'PROXY' && x.residentId === rid);
const moneyRows = (rid) => F().money.filter((m) => m.residentId === rid && m.at <= nowISO()).sort((a, b) => b.at.localeCompare(a.at) || b.id.localeCompare(a.id, undefined, { numeric: true }));
const moneyBase = (rid) => moneyRows(rid).find((m) => !m.followOf);
function moneyLine(m) {
  const r = resOf(m.residentId), by = rec(m.by);
  const who = `${tx('FAM-12.rec.who', { name: esc(by.name), role: MONEY_ROLE[by.key] })}`;
  const lines = [m.handoff.length ? `${tx('FAM-12.rec.to', { to: m.handoff.map((h) => MONEY_TO[h]).join(', ') })}` : '', m.contact ? `${tx('FAM-12.rec.contact', { v: MONEY_CONTACT[m.contact] })}` : ''].filter(Boolean);
  return `<div class="record"><span class="when">${ymd(m.at)} ${fmt.hm(D(m.at))}</span><span class="what"><b>${who}</b> ${tx('FAM-12.rec.line', { room: esc(r.room), name: esc(r.name), kind: MONEY_REC[m.kind] })}${lines.length ? `<br><span class="muted">${lines.join('<br>')}</span>` : ''}</span></div>`;
}
function fam12(params) {
  const p = me();
  if (!MONEY_ROLES.includes(p.key)) return denied(tx('FAM-12.denied'));
  const rid = params.rid || 'R_EUNSOOK', r = resOf(rid);
  if (!r) return denied(STAFF_DENIED);
  const rep = repOf(rid), base = moneyBase(rid);
  const li = (t) => `<li class="cell"><span class="body">${t}</span></li>`;
  const can = [tx('FAM-12.can.1'), tx('FAM-12.can.2'), tx('FAM-12.can.3'), tx('FAM-12.can.4'), tx('FAM-12.can.5')].map(li).join('');
  const no = [tx('FAM-12.no.1'), tx('FAM-12.no.2'), tx('FAM-12.no.3'), tx('FAM-12.no.4'), tx('FAM-12.no.5'), tx('FAM-12.no.6')].map(li).join('');
  const act = (label, name) => `<button class="btn btn-ghost btn-sm" type="button" data-act="${name}" data-rid="${rid}"${base ? '' : ' disabled'}>${label}</button>`;
  const row = (n, name, text) => `<tr><td data-label="${tx('FAM-12.to.th.1')}">${n}</td><td data-label="${tx('FAM-12.to.th.2')}">${name}</td><td class="wrap" data-label="${tx('FAM-12.to.th.3')}">${text}</td></tr>`;
  const rows = [
    rep ? row(1, tx('FAM-12.to.1.name'), tx('FAM-12.to.1.text', { name: esc(rep.name) })) : '',
    row(2, tx('FAM-12.to.2.name'), `<span>${tx('FAM-12.to.2.text')} ${act(tx('FAM-12.to.2.btn'), 'fam.money.permit')}</span>`),
    row(3, tx('FAM-12.to.3.name'), tx('FAM-12.to.3.text')),
    row(4, tx('FAM-12.to.4.name'), `<span>${tx('FAM-12.to.4.text')} ${act(tx('FAM-12.to.4.btn'), 'fam.money.report')}</span>`),
  ].join('');
  const radios = (name, map, cur) => Object.keys(map).map((k) => `<label class="choice"><input type="radio" name="${name}" value="${k}" data-bind="${name}" data-live${cur === k ? ' checked' : ''}>${map[k]}</label>`).join('');
  const done = view.m_saved && !view.m_kind && !view.m_how ? `<div class="alert alert-ok" role="status">${ic('circle-check')}<p>${tx('FAM-12.saved')}</p></div>` : '';
  const body = `<form class="stack lg" id="fam-money" data-act="fam.money.open" data-rid="${rid}">
    <p class="t-heading2">${tx('FAM-12.who', { room: esc(r.room), name: esc(r.name) })}</p>
    <fieldset style="border: 0; padding: 0; margin: 0;"><legend class="label" style="font-weight: 600; margin-bottom: 4px;">${tx('FAM-12.sheet.kind')}</legend>${radios('m_kind', MONEY_KIND, view.m_kind)}</fieldset>
    <fieldset style="border: 0; padding: 0; margin: 0;"><legend class="label" style="font-weight: 600; margin-bottom: 4px;">${tx('FAM-12.sheet.how')}</legend>${radios('m_how', MONEY_HOW, view.m_how)}</fieldset>${view.m_kind && view.m_how ? '' : `<p class="muted">${tx('FAM-12.whyOff')}</p>`}${done}</form>`;
  const foot = `<button class="btn btn-ghost btn-sm" type="button" data-set="sheet=&m_kind=&m_how=&m_saved=">${tx('FAM-12.cancel')}</button><button class="btn btn-primary btn-sm" type="submit" form="fam-money"${view.m_kind && view.m_how ? '' : ' disabled'}>${tx('FAM-12.submit')}</button>`;
  return {
    main: `<div class="page-head"><div class="row" style="gap: 12px;"><h1 class="t-title2">${tx('FAM-12.title')}</h1><span class="badge">${tx('FAM-12.draft')}</span></div><button class="btn btn-primary btn-sm" type="button" data-set="sheet=money">${ic('plus')}${tx('FAM-12.title')}</button></div>
    <div class="alert" role="status">${ic('info')}<p>${tx('FAM-12.alert')}</p></div>
    <div class="grid2" style="align-items: start;"><section class="card" aria-labelledby="can"><h2 id="can" class="t-heading2">${tx('FAM-12.can.h2')}</h2><ul class="list">${can}</ul></section><section class="card" aria-labelledby="no"><h2 id="no" class="t-heading2">${tx('FAM-12.no.h2')}</h2><ul class="list">${no}</ul></section></div>
    <section class="stack" aria-labelledby="to"><h2 id="to" class="t-heading2">${tx('FAM-12.to.h2')}</h2><div class="tbl reflow"><table aria-label="${tx('FAM-12.to.h2')}"><thead><tr><th>${tx('FAM-12.to.th.1')}</th><th>${tx('FAM-12.to.th.2')}</th><th>${tx('FAM-12.to.th.3')}</th></tr></thead><tbody>${rows}</tbody></table></div></section>
    <section class="card" aria-labelledby="rec"><h2 id="rec" class="t-heading2">${tx('FAM-12.rec.h2')}</h2>${moneyRows(rid).map(moneyLine).join('')}</section>
    <p class="demo-note">${tx('FAM-12.demo')}</p>`,
    overlay: view.sheet === 'money' ? sheet(tx('FAM-12.title'), body, foot) : '',
  };
}

// ---------- FAM-14 함께 보실 분 초대하기 (회원) ----------
// 초대받은 분 쪽 화면은 예시 카드뿐이다(보드). 수락 행동은 만들지 않았고, 링크 기간이 지나면 예시가 오류 문구로 바뀐다.
function fam14() {
  const p = me(), no = memberOnly(p);
  if (no) return no;
  const rid = p.residentId, d = F().inviteDraft, n = rname(rid);
  const name = view.inv_name ?? d.name, rel = view.inv_rel ?? d.relation, tel = view.inv_tel ?? '', telOk = /^\d{9,11}$/.test(tel.replace(/\D/g, ''));
  const last = F().invites.filter((i) => i.residentId === rid && i.sentAt <= nowISO()).pop();
  const left = view.sent
    ? `<div class="alert alert-ok" role="status">${ic('check')}<p class="t-body-lg">${tx('FAM-14.sent', { name: esc(view.sent) })}</p></div>`
    : `<section class="card" aria-label="${tx('FAM-14.form.aria')}">
        <div class="field"><label for="inv-name">${tx('FAM-14.label.name')}</label><input class="input" id="inv-name" name="inv_name" type="text" value="${esc(name)}" data-bind="inv_name" data-live></div>
        <div class="field"><label for="inv-rel">${tx('FAM-14.label.rel')}</label><select class="input" id="inv-rel" name="inv_rel" data-bind="inv_rel" data-live>${RELATIONS.map((x) => `<option${x === rel ? ' selected' : ''}>${x}</option>`).join('')}</select></div>
        <div class="field"><label for="inv-tel">${tx('FAM-14.label.tel')}</label><input class="input" id="inv-tel" name="inv_tel" type="tel" inputmode="tel" value="${esc(tel)}" placeholder="${esc(d.phone)}" data-bind="inv_tel" data-live></div>
        ${name.trim() ? `<div class="band"><p class="t-body-lg">${tx('FAM-14.band', { name: esc(name.trim()), relation: esc(rel) })}</p></div>` : ''}
        <div class="stack"><button class="btn btn-primary btn-block" type="button" data-act="fam.invite"${name.trim() && telOk ? '' : ' disabled'}>${tx('FAM-14.send')}</button><a class="btn btn-secondary btn-block" href="${href('FAM-01')}">${tx('FAM-14.cancel')}</a></div>
      </section>`;
  const err = (t) => `<div class="alert alert-err" role="status">${ic('circle-alert')}<p class="t-body-lg">${t}</p></div>`;
  const example = last?.status === 'EXPIRED' && !view.sent ? err(tx('FAM-14.err.id')) + err(tx('FAM-14.err.expired', { name: esc(n) })) : `<p class="t-body-lg">${tx('FAM-14.ex.sms', { name: esc(n) })}</p>`;
  return `<h1 class="t-title3">${tx('FAM-14.title')}</h1>
    <div class="pair"><div>${left}</div><div><hr class="divider pair-lead"><section class="card" aria-label="${tx('FAM-14.ex.label')}"><p class="t-label-lg muted">${tx('FAM-14.ex.label')}</p>${example}</section></div></div>`;
}

// ===================== 행동 =====================
const selfOnly = () => {
  const p = me();
  if (p.key === 'PROXY') refuse(PROXY_TEXT(p));
  if (p.key !== 'MEMBER') refuse(tx('family.selfOnly.refuse'));
  return p;
};
const mine = (id) => { const l = linkById(id), p = me(); if (!l || l.residentId !== p.residentId) refuse(STAFF_DENIED); return l; };
// 넘김과 가족 연락은 지난 기록을 고치지 않고 이어 쓴 새 기록으로 남긴다(추가만).
function moneyFollow(rid, handoff, contact) {
  const p = me();
  if (!MONEY_ROLES.includes(p.key)) refuse(tx('FAM-12.denied'));
  const base = moneyBase(rid);
  if (!base) return;
  const same = F().money.some((m) => m.followOf === base.id && m.contact === contact && m.handoff.join() === handoff.join());
  if (same) return;
  F().money.push({ id: nid('MR'), at: nowISO(), by: p.id, residentId: rid, kind: base.kind, how: base.how, handoff, contact, followOf: base.id });
}
const actions = {
  'fam.grant': (a) => {
    const p = selfOnly(), l = mine(a.id), it = a.item;
    if (it === 'HEALTH' && !agreedOf(l.id)) refuse(tx('family.action.refuse.4'));
    widened(l, setConsent(l, it, 'GRANTED', { kind: 'SELF', id: p.id }));
    view.flash = 'GRANTED'; view.fi = it;
  },
  'fam.revoke': (a) => {
    const p = selfOnly(), l = mine(a.id), it = a.item;
    if (cState(l.id, it) !== 'GRANTED') refuse(tx('family.action.refuse.3'));
    if (it === 'HEALTH') F().sensitive.push({ id: nid('SC'), linkId: l.id, status: 'WITHDRAWN', ver: 'v1', at: nowISO(), by: p.id });
    setConsent(l, it, 'REVOKED', { kind: 'SELF', id: p.id });
    view.dialog = ''; view.flash = 'REVOKED'; view.fi = it; view.who = l.id;
  },
  'fam.propose': (a, form) => {
    const p = me();
    if (!INPUT_ROLES.includes(p.key)) refuse(STAFF_DENIED);
    const l = linkById(form.who), picked = ITEMS.filter((i) => form[`i_${i}`] !== undefined && !['GRANTED', 'PENDING'].includes(cState(l.id, i)));
    if (!l || !picked.length) return;
    const b = { id: nid('PB'), residentId: l.residentId, by: p.id, how: form.how ?? 'DIRECT', at: nowISO(), status: 'WAITING', items: picked.map((i) => ({ linkId: l.id, item: i })) };
    F().batches.push(b);
    picked.forEach((i) => setConsent(l, i, 'PENDING', { kind: 'STAFF', id: p.id }, b.id));
    view.sheet = '';
    ITEMS.forEach((i) => { view[`i_${i}`] = ''; });
  },
  'fam.confirm': () => {
    const p = selfOnly(), got = {};
    waiting(p.residentId).forEach((b) => {
      b.items.forEach((i) => {
        if (cState(i.linkId, i.item) !== 'PENDING' || i.item === 'HEALTH') return;
        got[i.linkId] = setConsent(linkById(i.linkId), i.item, 'GRANTED', { kind: 'SELF', id: p.id }, b.id);
      });
      b.status = 'CONFIRMED'; b.decidedAt = nowISO();
    });
    Object.keys(got).forEach((id) => widened(linkById(id), got[id]));
    view.res = 'CONFIRMED';
  },
  'fam.reject': () => {
    const p = selfOnly();
    waiting(p.residentId).forEach((b) => {
      b.items.forEach((i) => { if (cState(i.linkId, i.item) === 'PENDING') setConsent(linkById(i.linkId), i.item, cRow(i.linkId, i.item).prev, { kind: 'SELF', id: p.id }); });
      b.status = 'REJECTED'; b.decidedAt = nowISO();
    });
    view.res = 'REJECTED';
  },
  'fam.agree': (a) => {
    const p = selfOnly(), l = mine(a.id);
    F().sensitive.push({ id: nid('SC'), linkId: l.id, status: 'AGREED', ver: 'v1', at: nowISO(), by: p.id });
    widened(l, setConsent(l, 'HEALTH', 'GRANTED', { kind: 'SELF', id: p.id }));
    view.res = 'AGREED';
  },
  'fam.decline': (a) => {
    const p = selfOnly(), l = mine(a.id);
    F().sensitive.push({ id: nid('SC'), linkId: l.id, status: 'NOT_AGREED', ver: 'v1', at: nowISO(), by: p.id });
    if (cState(l.id, 'HEALTH') === 'PENDING') setConsent(l, 'HEALTH', cRow(l.id, 'HEALTH').prev, { kind: 'SELF', id: p.id });
    view.res = 'NOT_AGREED';
  },
  'fam.noticeAck': (a) => {
    const p = selfOnly();
    F().noticeAcks.push({ residentId: p.residentId, key: a.key, personId: p.id, at: nowISO() });
    view.nt = 'done';
  },
  'fam.ai.ack': () => {
    const p = me();
    F().acks.push({ personId: p.id, audience: 'MEMBER', version: 2, at: nowISO(), acting: p.key === 'PROXY' ? 'REPRESENTATIVE' : 'SELF' });
  },
  'fam.feedback': (a) => {
    const { link } = ctx();
    if (!link || !canSeeLink(link, 'LIFE')) refuse(tx('family.action.refuse.2'));
    F().feedback.push({ id: nid('FB'), reportId: a.id, linkId: link.id, at: nowISO(), state: 'OPEN' });
  },
  'fam.report.manual': () => { view.body = ''; },
  'fam.report.send': (a) => {
    const p = me(), rep = reportOf(a.id);
    if (p.key !== 'LIFE') refuse(tx('family.action.refuse'));
    if (!rep || rep.status === 'SENT') return;
    const text = view.body ?? rep.body;
    if (healthHits(text).length) refuse(WARN);
    const rcp = linksOf(rep.residentId).filter((l) => canSeeLink(l, 'LIFE'));
    Object.assign(rep, { status: 'SENT', body: text, sections: parseSections(rep, text), reviewerId: p.id, sentAt: nowISO(), recipients: rcp.map((l) => ({ linkId: l.id, name: l.name, relation: l.relation, see: ITEMS.filter((i) => canSeeLink(l, i)) })) });
    F().log.push({ id: nid('AL'), at: nowISO(), residentId: rep.residentId, viewerId: p.id, viewerKind: 'STAFF', name: p.name, relation: p.role, item: 'LIFE', what: tx('family.action.what'), result: 'ALLOW', basis: { type: 'DUTY', at: null } });
    rcp.forEach((l) => enqueue(l.id, 'NEW_NEWS', 'LIFE', `${rep.id}`));
    view.dialog = ''; view.fil = 'sent'; view.rep = rep.id; view.body = undefined;
  },
  'fam.money.open': (a, form) => {
    const p = me();
    if (!MONEY_ROLES.includes(p.key)) refuse(tx('FAM-12.denied'));
    const r = resOf(a.rid);
    if (!r) refuse(STAFF_DENIED);
    if (!MONEY_KINDS.includes(form.m_kind) || !MONEY_HOW[form.m_how]) return;
    F().money.push({ id: nid('MR'), at: nowISO(), by: p.id, residentId: r.id, kind: form.m_kind, how: form.m_how, handoff: [], contact: null, followOf: null });
    view.m_saved = '1'; view.m_kind = ''; view.m_how = '';
  },
  'fam.money.permit': (a) => moneyFollow(a.rid, [...(repOf(a.rid) ? ['REP'] : []), 'FAMILY'], 'PERMITTED'),
  'fam.money.report': (a) => moneyFollow(a.rid, ['MANAGER'], null),
  'fam.invite': () => {
    const p = selfOnly(), d = F().inviteDraft;
    const name = (view.inv_name ?? d.name).trim(), relation = view.inv_rel ?? d.relation, phone = (view.inv_tel ?? '').trim();
    if (!name || !/^\d{9,11}$/.test(phone.replace(/\D/g, '')) || !RELATIONS.includes(relation)) return;
    // 같은 번호의 이전 초대는 취소한다
    F().invites.filter((i) => i.residentId === p.residentId && i.phone === phone && i.status === 'SENT').forEach((i) => { i.status = 'CANCELLED'; });
    F().invites.push({ id: nid('IV'), residentId: p.residentId, invitedBy: p.id, name, relation, phone, sentAt: nowISO(), expiresAt: toISO(addDays(nowISO(), INVITE_DAYS)), status: 'SENT' });
    sms(name, tx('FAM-14.ex.sms', { name: rname(p.residentId) }));
    view.sent = name;
  },
  'fam.log.export': () => {
    const p = me();
    F().exports.push({ at: nowISO(), residentId: 'R_EUNSOOK', who: `${p.name}(${p.role})` });
  },
};

// ===================== 이벤트 =====================
const on = {
  'core.ResidentAbsenceStarted': (e) => {
    const c = { id: e.absenceId ?? nid('AB'), residentId: e.residentId, startedOn: e.startedOn, expectedOn: e.expectedOn ?? null, returnedOn: null, state: 'OPEN' };
    F().cards.push(c);
    linksOf(e.residentId).forEach((l) => { if (absenceVisible(l)) enqueue(l.id, 'NEW_NEWS', 'LIFE', c.id); });
  },
  'core.ResidentAbsenceEnded': (e) => {
    const c = F().cards.find((x) => x.id === e.absenceId) ?? F().cards.filter((x) => x.residentId === e.residentId && x.state === 'OPEN').pop();
    if (!c) return;
    if (!e.returnedOn) { F().cards.splice(F().cards.indexOf(c), 1); return; }
    Object.assign(c, { state: 'ENDED', returnedOn: e.returnedOn });
    linksOf(e.residentId).forEach((l) => { if (absenceVisible(l)) enqueue(l.id, 'NEW_NEWS', 'LIFE', `${c.id}:END`); });
  },
  'core.InvoiceIssued': (e) => {
    linksOf(e.residentId).forEach((l) => { if (canSeeLink(l, 'BILL')) enqueue(l.id, 'NEW_NEWS', 'BILL', `${e.invoiceId ?? e.month}`); });
  },
  'requests.ServiceRequestStatusChanged': (e) => {
    if (e.source !== 'GUARDIAN_PORTAL' || !['ASSIGNED', 'DONE'].includes(e.change)) return;
    const l = linkOfPersona(e.createdByPersonId);
    if (l) enqueue(l.id, 'NEW_NEWS', 'REQUEST', `${e.requestId}:${e.change}`);
  },
};

// ===================== 장면 단계 =====================
const FIX = tx('family.FIX.text');
const flow = [
  { scene: 6, ord: 1, at: '2026-11-11T13:30:00', as: 'm.eunsook', go: ['COM-07'], say: tx('flow.family.s6.say'),
    steps: [{ click: tx('COM-07.tile.5') }, { see: tx('COM-07.tile.4') }, { see: tx('FAM-01.text.6') }, { click: tx('flow.family.s6.click') }, { see: tx('flow.family.s6.see') }] },
  { scene: 7, ord: 1, at: '2026-11-11T14:30:00', as: 'st.choims', go: ['FAM-09'], say: tx('flow.family.s7.say.3'),
    steps: [{ click: tx('FAM-09.sheet') }, { fill: 'who', value: 'GL_JIMIN' }, { click: tx('common.FAM_ITEMS.text.5'), within: '.proto-rsheet' }, { click: tx('common.NAV.text.17'), within: '.proto-rsheet' }, { click: tx('common.FAM_ITEMS.text.2'), within: '.proto-rsheet' }, { click: tx('FAM-09.input.2'), within: '.proto-rsheet' }, { click: tx('FAM-09.sheet'), within: '.proto-rsheet' },
      { click: tx('FAM-09.sheet') }, { fill: 'who', value: 'GL_TAEHO' }, { click: tx('common.FAM_ITEMS.text.5'), within: '.proto-rsheet' }, { click: tx('FAM-09.input.2'), within: '.proto-rsheet' }, { click: tx('FAM-09.sheet'), within: '.proto-rsheet' },
      { see: tx('FAM-09.text.2') }, { see: tx('flow.family.s7.see.8') }] },
  { scene: 7, ord: 2, at: '2026-11-11T14:40:00', as: 'm.eunsook', go: ['FAM-03'], say: tx('flow.family.s7.say.2'),
    steps: [{ see: tx('FAM-03.home') }, { see: tx('flow.family.s7.see.6') }, { see: tx('flow.family.s7.see.5') }, { click: tx('FAM-03.btn.3') }, { see: tx('FAM-03.p.4') }] },
  { scene: 7, ord: 3, at: '2026-11-11T14:45:00', as: 'm.eunsook', go: ['FAM-02', { link: 'GL_JIMIN' }], say: tx('flow.family.s7.say'),
    steps: [{ see: tx('FAM-02.home') }, { click: tx('FAM-02.btn') }, { see: tx('flow.family.s7.see.2') }, { click: tx('FAM-02.btn.2') }, { see: tx('flow.family.s7.see') }] },
  { scene: 10, ord: 1, at: '2026-11-12T08:00:00', as: 'g.jimin', go: ['FAM-06a'], say: tx('flow.family.s10.say.2'),
    steps: [{ see: tx('flow.family.s10.see.4') }, { click: tx('common.FAM_ITEMS.text.2') }, { see: tx('family.KIND.VISIT') }] },
  { scene: 10, ord: 2, at: '2026-11-12T08:10:00', as: 'p.taeho', go: ['FAM-06d'], say: tx('flow.family.s10.say'),
    steps: [{ see: tx('family.action.refuse.2') }, { see: tx('flow.family.s10.see') }] },
  { scene: 11, ord: 1, at: '2026-11-12T09:14:22', as: 'g.jimin', go: ['FAM-06a'], say: tx('flow.family.s11.say.2'),
    steps: [{ see: tx('FAM-06a.h2') }, { click: tx('assistant.action.invoice') }, { see: tx('flow.family.s11.see.5') }, { see: tx('flow.family.s11.see.4') }, { click: tx('common.familyFrame.cell') }, { see: tx('FAM-06a.h2') }] },
  { scene: 11, ord: 2, at: '2026-11-12T09:20:00', as: 'p.taeho', go: ['FAM-06a'], say: tx('flow.family.s11.say'),
    steps: [{ see: tx('common.FAM_ITEMS.text.5') }, { see: tx('FAM-06a.h2') }, { go: 'FAM-06c' }, { see: tx('family.action.refuse.2') }, { go: 'FAM-06f' }, { see: tx('FAM-06a.h2') }] },
  { scene: 16, ord: 1, at: '2026-11-17T15:00:00', as: 'm.eunsook', go: ['FAM-01'], say: tx('flow.family.s16.say'),
    steps: [{ click: tx('flow.family.s16.click.2') }, { click: tx('FAM-01.text.8'), within: '#fam-item-REQUEST' }, { see: tx('flow.family.s16.see') }] },
  { scene: 21, ord: 4, at: '2026-11-18T14:50:00', as: 'm.eunsook', go: ['FAM-01'], say: tx('flow.family.s21.say.3'),
    steps: [{ click: tx('flow.family.s21.click.3') }, { click: tx('FAM-01.text.8'), within: '#fam-item-SCHEDULE' }, { see: tx('flow.family.s21.see.6') }] },
  { scene: 21, ord: 5, at: '2026-11-18T15:00:00', as: 'g.jimin', go: ['FAM-06a'], say: tx('flow.family.s21.say.2'),
    steps: [{ see: tx('FAM-06a.ariaLabel') }, { click: tx('common.FAM_ITEMS.text.4') }, { see: tx('FAM-06e.h2') }, { see: tx('flow.family.s21.see.3') }, { see: tx('FAM-01.p.3') }] },
  { scene: 21, ord: 6, at: '2026-11-18T15:05:00', as: 'p.taeho', go: ['FAM-06e'], say: tx('flow.family.s21.say'), steps: [{ see: tx('family.action.refuse.2') }] },
  { scene: 24, ord: 1, at: '2026-11-23T10:02:40', as: 'st.kimhj', go: ['FAM-10'], say: tx('flow.family.s24.say.2'),
    steps: [{ see: tx('flow.family.s24.see.6') }, { see: tx('flow.family.s24.no') }, { fill: 'body', value: FIX }, { no: tx('flow.family.s24.no') }, { click: tx('FAM-10.btn.3') }, { see: tx('FAM-10.h2') }, { click: tx('FAM-10.btn.2'), within: '.dialog' }, { see: tx('FAM-10.SENT') }] },
  { scene: 24, ord: 2, at: '2026-11-23T10:30:00', as: 'p.taeho', go: ['FAM-06b'], say: tx('flow.family.s24.say'),
    steps: [{ see: tx('flow.family.s24.see.3') }, { see: tx('flow.family.s24.see.2') }, { see: tx('FAM-06b.btn') }] },
  { scene: 25, ord: 1, at: '2026-11-23T15:10:31', as: 'm.eunsook', go: ['FAM-01'], say: tx('flow.family.s25.say.4'),
    steps: [{ click: tx('flow.family.s25.click.2') }, { click: tx('FAM-01.btn.4'), within: '#fam-item-LIFE' }, { see: tx('flow.family.s25.see.7') }, { see: tx('flow.family.s25.see.6') }, { click: tx('FAM-01.btn.4'), within: '.dialog' }, { see: tx('flow.family.s25.see.5') }] },
  { scene: 25, ord: 2, at: '2026-11-23T15:12:05', as: 'p.taeho', go: ['FAM-06b'], say: tx('flow.family.s25.say.3'),
    steps: [{ see: tx('family.action.refuse.2') }] },
  { scene: 25, ord: 3, at: '2026-11-23T15:30:00', as: 'hq.jung', go: ['FAM-11'], say: tx('flow.family.s25.say.2'),
    steps: [{ see: '2026-11-23 15:12:05' }, { see: tx('flow.family.s25.see.3') }, { see: '2026-11-23 15:10:31' }, { see: '2026-11-23 10:02:40' }] },
  { scene: 25, ord: 4, at: '2026-11-23T15:40:00', as: 'm.eunsook', go: ['FAM-04'], say: tx('flow.family.s25.say'),
    steps: [{ see: tx('flow.family.s25.see.2') }, { see: tx('flow.family.s25.see') }, { no: tx('AST-11.text.6') }] },
  { scene: 29, ord: 2, at: '2026-12-02T11:12:00', as: 'g.jimin', go: ['FAM-06a'], say: tx('flow.family.s29.say.2'),
    steps: [{ see: tx('flow.family.s29.see.3') }, { see: tx('family.KIND.HOSPITAL') }] },
  { scene: 29, ord: 3, at: '2026-12-02T11:15:00', as: 'g.jimin', go: ['FAM-06a'], say: tx('flow.family.s29.say'),
    steps: [{ click: tx('COM-07.span') }, { see: tx('family.shared.text.2') }, { click: tx('common.popHtml.btn.4') }, { go: 'FAM-06d' }, { see: tx('family.KIND.HOSPITAL') }, { as: 'p.taeho' }, { go: 'FAM-06a' }, { no: tx('flow.family.s29.no') }] },
  { scene: 30, ord: 4, at: '2026-12-07T16:50:00', as: 'g.jimin', go: ['FAM-06a'], say: tx('flow.family.s30.say'),
    steps: [{ see: tx('flow.family.s30.see.2') }, { click: tx('COM-07.span') }, { see: tx('flow.family.s30.see') }, { click: tx('common.popHtml.btn.4') }, { at: '2026-12-07T18:00:00' }] },
  { scene: 34, ord: 3, at: '2026-12-10T16:40:00', as: 'g.jimin', go: ['FAM-06d'], say: tx('flow.family.s34.say'),
    steps: [{ see: tx('family.KIND.STAGE') }, { as: 'p.taeho' }, { go: 'FAM-06d' }, { see: tx('family.action.refuse.2') }] },
  { scene: 37, ord: 1, at: '2027-01-05T10:00:00', as: 'm.eunsook', go: ['FAM-05'], say: tx('flow.family.s37.say'),
    steps: [{ see: tx('FAM-05.h1') }, { click: tx('FAM-05.btn') }, { see: tx('flow.family.s37.see') }] },
];

// 41장면 밖 화면(FAM-12, FAM-14). 41장면 뒤 상태에서 이어 누른다.
const extra = [
  { at: '2027-01-08T10:00:00', as: 'st.choims', go: ['FAM-09'], say: tx('flow.family.x1.say'),
    steps: [{ click: tx('FAM-12.title') }, { see: tx('FAM-12.draft') }, { see: tx('FAM-12.can.h2') }, { see: tx('FAM-12.no.h2') }, { see: tx('FAM-12.to.1.name') }, { see: tx('FAM-12.to.2.text') },
      { see: '2026-11-11 10:20' }, { see: tx('FAM-12.rec.contact', { v: tx('FAM-12.rec.contact.DECLINED') }) },
      { click: tx('FAM-12.title'), within: '.page-head' }, { click: tx('FAM-12.kind.TRANSFER'), within: '.proto-rsheet' }, { click: tx('FAM-12.how.PHONE'), within: '.proto-rsheet' }, { click: tx('FAM-12.submit') }, { see: tx('FAM-12.saved') },
      { click: tx('FAM-12.cancel'), within: '.proto-rsheet' }, { see: '2027-01-08 10:00' }, { see: tx('FAM-12.rec.kind.TRANSFER') },
      { click: tx('FAM-12.to.2.btn') }, { see: tx('FAM-12.rec.contact', { v: tx('FAM-12.to.2.btn') }) }, { click: tx('FAM-12.to.4.btn') }, { see: tx('FAM-12.rec.to', { to: tx('FAM-12.to.4.name') }) },
      { as: 'hq.han' }, { go: 'FAM-12' }, { see: tx('FAM-12.denied') }] },
  { at: '2027-01-08T11:00:00', as: 'm.eunsook', go: ['FAM-01'], say: tx('flow.family.x2.say'),
    steps: [{ click: tx('FAM-14.title') }, { see: tx('FAM-14.ex.label') }, { see: tx('FAM-14.ex.sms', { name: SEED.residents[0].name }) }, { see: tx('FAM-14.band', { name: SEED.inviteDraft.name, relation: SEED.inviteDraft.relation }) },
      { fill: 'inv_tel', value: '010-2345-6789' }, { click: tx('FAM-14.send') }, { see: tx('FAM-14.sent', { name: SEED.inviteDraft.name }) },
      { at: '2027-01-15T11:01:00' }, { go: 'FAM-01' }, { click: tx('FAM-14.title') }, { see: tx('FAM-14.err.id') }, { see: tx('FAM-14.err.expired', { name: SEED.residents[0].name }) }] },
];

// ===================== 모듈 =====================
const home = (title, render) => ({ app: 'home', title, render });
export default {
  key: 'family',
  // 순수 데이터. 이름과 관계는 시드 사람(people.js)과 같다. 함께 보실 분 연결은 모두 "안 보여요"에서 시작한다.
  seed: () => structuredClone(SEED),
  api: api_,
  on,
  tick(prev, next) {
    F().queue.filter((q) => q.state === 'WAIT' && q.sendAfter <= next).forEach(dispatch);
    F().invites.filter((i) => i.status === 'SENT' && i.expiresAt <= next).forEach((i) => { i.status = 'EXPIRED'; });
    makeDrafts(prev, next);
  },
  actions,
  screens: {
    'FAM-01': home(tx('FAM-01.home'), fam01),
    'FAM-02': home(tx('FAM-02.home'), fam02),
    'FAM-03': home(tx('FAM-03.home'), fam03),
    'FAM-04': home(tx('FAM-04.home'), fam04),
    'FAM-05': home(tx('FAM-05.home'), fam05),
    'FAM-06a': { app: 'family', title: tx('FAM-06a.title'), render: fam06a },
    'FAM-06b': { app: 'family', title: tx('FAM-06b.title'), render: fam06b },
    'FAM-06c': { app: 'family', title: tx('FAM-06c.title'), render: fam06c },
    'FAM-06d': { app: 'family', title: tx('FAM-06d.title'), render: fam06d },
    'FAM-06e': { app: 'family', title: tx('FAM-06e.title'), render: fam06e },
    'FAM-06f': { app: 'family', title: tx('FAM-06f.title'), render: fam06f },
    'FAM-09': { app: 'ops', title: tx('FAM-09.title'), render: fam09 },
    'FAM-10': { app: 'ops', title: tx('FAM-10.title'), render: fam10 },
    'FAM-11': { app: 'ops', title: tx('FAM-11.title'), render: fam11 },
    'FAM-12': { app: 'ops', title: tx('FAM-12.title'), render: fam12 },
    'FAM-14': home(tx('FAM-14.title'), fam14),
  },
  flow,
  extra,
};
