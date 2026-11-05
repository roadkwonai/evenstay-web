// 코어 도메인 함수. db.core만 읽고 쓴다(다른 모듈 상태는 건드리지 않는다). 상태 판단은 영문 코드로 한다.
import { tx } from '../../lib/text.js';
import { db, emit, fmt, me, nowISO, refuse, view } from '../../lib/kit.js';
import { PERSONAS } from '../../lib/people.js';

export const C = () => db.core;
export const fv = (k, d) => view[k] ?? d; // 입력 칸 값(없으면 기본값)
const p2 = (n) => String(n).padStart(2, '0');
export const ymd = (d) => `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}`;
export const today = () => nowISO().slice(0, 10);
export const monthNow = () => nowISO().slice(0, 7);
export const addDays = (s, n) => { const d = new Date(`${s}T00:00:00`); d.setDate(d.getDate() + n); return ymd(d); };
export const addMonths = (m, n) => { const [y, mo] = m.split('-').map(Number); const d = new Date(y, mo - 1 + n, 1); return `${d.getFullYear()}-${p2(d.getMonth() + 1)}`; };
export const monthEnd = (m) => { const [y, mo] = m.split('-').map(Number); return ymd(new Date(y, mo, 0)); };
export const daysIn = (m) => +monthEnd(m).slice(8);
const isDate = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s || '');

// 화면에 보이는 이름표. 키는 영문 코드, 값만 한글이다.
export const STATUS = { DRAFT: tx('core.STATUS.DRAFT'), SIGNED: tx('core.STATUS.SIGNED'), ACTIVE: tx('core.STATUS.ACTIVE'), SUCCEEDED: tx('core.STATUS.SUCCEEDED'), TERMINATING: tx('core.STATUS.TERMINATING'), SETTLED: tx('core.STATUS.SETTLED') };
export const STATUS_RANK = { ACTIVE: 0, TERMINATING: 1, SIGNED: 2, DRAFT: 3, SUCCEEDED: 4, SETTLED: 5 };
export const RELATION = { CHILD: tx('core.RELATION.CHILD'), SPOUSE: tx('core.RELATION.SPOUSE'), SIBLING: tx('core.RELATION.SIBLING'), RELATIVE: tx('core.RELATION.RELATIVE'), FRIEND: tx('core.RELATION.FRIEND'), OTHER: tx('core.RELATION.OTHER') };
export const ROUTE = { PHONE: tx('core.ROUTE.PHONE'), FRONT: tx('core.ROUTE.FRONT'), GUARDIAN: tx('core.ROUTE.GUARDIAN'), PROXY: tx('core.ROUTE.PROXY') };
export const CANCEL_WHY = { OTHER_RESIDENT: tx('core.CANCEL_WHY.OTHERRESIDENT'), DATE_ERROR: tx('core.CANCEL_WHY.DATEERROR'), DUPLICATE: tx('core.CANCEL_WHY.DUPLICATE') };
export const MEAL = { BREAKFAST: tx('core.MEAL.BREAKFAST'), LUNCH: tx('core.MEAL.LUNCH'), DINNER: tx('core.MEAL.DINNER') };
export const INSURANCE = { YES: tx('core.INSURANCE.YES'), NO: tx('core.INSURANCE.NO'), UNKNOWN: tx('core.INSURANCE.UNKNOWN') };
export const BASIS = { GUARDIANSHIP: tx('core.BASIS.GUARDIANSHIP'), LIMITED: tx('core.BASIS.LIMITED'), SPECIFIC: tx('core.BASIS.SPECIFIC'), VOLUNTARY: tx('core.BASIS.VOLUNTARY'), POWER_OF_ATTORNEY: tx('core.BASIS.POWEROFATTORNEY') };
export const SCOPE = { SIGN_CONTRACT: tx('core.SCOPE.SIGNCONTRACT'), VIEW_INVOICE: tx('core.SCOPE.VIEWINVOICE'), PAY: tx('core.SCOPE.PAY'), GUARDIAN_ACCESS: tx('core.SCOPE.GUARDIANACCESS') };
export const LINE_LABEL = { RECURRING: tx('core.LINE_LABEL.RECURRING'), MEAL: tx('core.LINE_LABEL.MEAL'), MEAL_SKIP: tx('core.LINE_LABEL.MEALSKIP') };
export const ROLES = {
  contract: ['ACCOUNTING', 'MANAGER', 'HQ_ADMIN', 'HQ_OPS'],
  mealUpload: ['FRONT', 'ACCOUNTING', 'MANAGER', 'HQ_ADMIN', 'HQ_OPS'],
  mealClose: ['ACCOUNTING', 'MANAGER', 'HQ_ADMIN', 'HQ_OPS'],
  bill: ['ACCOUNTING', 'MANAGER', 'HQ_ADMIN', 'HQ_OPS'],
  absence: ['FRONT', 'LIFE', 'CARE', 'ACCOUNTING', 'MANAGER', 'HQ_ADMIN', 'HQ_OPS'],
  configure: ['HQ_ADMIN'], // 요금 규칙(core.site.configure, tech-design 6-2)
};
export const can = (what) => ROLES[what].includes(me().key);
export const need = (what) => { if (!can(what)) refuse(tx('core.need.refuse')); };
const by = () => { const p = me(); return `${p.name}(${p.role})`; };
const nid = (pre) => `${pre}-${++C().seq}`;

// --- 사람·호실·계약 ---
export const person = (id) => C().people.find((x) => x.id === id);
export const unitOf = (id) => C().units.find((u) => u.id === id);
export const nameOf = (id) => person(id)?.name ?? '';
const unitRank = (c) => unitOf(c.unitId)?.order ?? 999;
export const contractsOfSite = (siteId) => C().contracts.filter((c) => c.siteId === siteId);
const RESIDING = ['ACTIVE', 'TERMINATING'];
export const contractOf = (rid) => C().contracts.filter((c) => c.residentIds.includes(rid))
  .sort((a, b) => (STATUS_RANK[a.status] - STATUS_RANK[b.status]) || b.startDate.localeCompare(a.startDate))[0] || null;
export const roomOfContract = (c) => unitOf(c?.unitId)?.label ?? '';
export function residents(siteId = 'S1') {
  return contractsOfSite(siteId).filter((c) => RESIDING.includes(c.status)).sort((a, b) => unitRank(a) - unitRank(b))
    .flatMap((c) => c.residentIds.map((id) => ({ id, name: nameOf(id), room: roomOfContract(c), siteId })));
}
export const residingCount = (siteId) => contractsOfSite(siteId).filter((c) => RESIDING.includes(c.status)).length;
export const openableResidents = () => residents('S1');
export function unitSummary(siteId, date = today()) {
  const rows = C().units.filter((u) => u.siteId === siteId).map((u) => {
    const cs = C().contracts.filter((c) => c.unitId === u.id);
    const live = cs.find((c) => ['ACTIVE', 'TERMINATING', 'SUCCEEDED', 'SETTLED'].includes(c.status) && c.occupiedFrom && c.occupiedFrom <= date && (!c.occupiedTo || c.occupiedTo > date));
    const state = live ? (live.status === 'TERMINATING' ? 'TERMINATING' : 'ACTIVE') : cs.some((c) => c.status === 'SIGNED' || (c.status === 'ACTIVE' && c.occupiedFrom > date)) ? 'SIGNED' : 'VACANT';
    return { unit: u, state, contract: live || null };
  });
  const n = (s) => rows.filter((r) => r.state === s).length;
  const occupied = n('ACTIVE') + n('TERMINATING');
  return { rows, total: rows.length, units: rows.length, occupied, movingIn: n('SIGNED'), vacant: n('VACANT'), movingOut: n('TERMINATING') };
}
export const deposit = (c) => c.deposit;
export function chainOf(rid) { return C().contracts.filter((c) => c.residentIds.includes(rid) && c.billingStart).sort((a, b) => a.billingStart.localeCompare(b.billingStart)); }
export function moveInDate(rid) { const c = contractOf(rid); if (!c) return null; const first = C().contracts.filter((x) => x.chainId === c.chainId).sort((a, b) => a.startDate.localeCompare(b.startDate))[0]; return first.startDate; }
export const maskName = (n) => (n ? n[0] + '○'.repeat(n.length - 1) : '');
export const repsOf = (rid, date = today()) => C().reps.filter((r) => r.residentId === rid && r.activeFrom <= date);

// --- 변경 이력 ---
const hist = (chainId, kind, extra = {}) => C().history.push({ id: nid('H'), at: nowISO(), by: by(), chainId, kind, ...extra });
const seqOf = (h) => Number(h.id.split('-')[1]);
export const historyOf = (chainId) => C().history.filter((h) => h.chainId === chainId).sort((a, b) => b.at.localeCompare(a.at) || seqOf(b) - seqOf(a));

// --- 계약 전이 ---
export function createDraft(siteId) {
  need('contract');
  const c = { id: nid('CT'), siteId, unitId: C().units.find((u) => u.siteId === siteId).id, status: 'DRAFT', plan: 'SINGLE', occupancy: 1, rate: 0, deposit: null, insurance: 'UNKNOWN', jeonseOn: null, startDate: today(), endDate: null, billingStart: null, billingEnd: null, occupiedFrom: null, occupiedTo: null, residentIds: [], leadId: null, succeededFromId: null };
  c.chainId = c.id;
  C().contracts.push(c);
  return c;
}
export function discardDraft(id) {
  C().contracts = C().contracts.filter((c) => !(c.id === id && c.status === 'DRAFT'));
  C().contacts = C().contacts.filter((x) => x.contractId !== id);
}
const phoneOk = (s) => /^\d{2,3}-\d{3,4}-\d{4}$/.test(s);
export function addContact(contractId, f) {
  const name = (f.name || '').trim(), phone = (f.phone || '').trim(), order = Number(f.order);
  if (!name || !f.relation || !phone || !order) refuse(tx('core.addContact.refuse.2'));
  if (!phoneOk(phone)) refuse(tx('core.addContact.refuse'));
  const dup = C().contacts.find((x) => x.contractId === contractId && x.order === order);
  if (dup) refuse(`${tx('core.addContact.text', { order, name: dup.name, name2: dup.name })}`);
  C().contacts.push({ id: nid('EC'), contractId, order, name, relation: f.relation, phone, consentAt: nowISO(), basis: 'CONTRACT' });
}
export const contactsOfContract = (id) => C().contacts.filter((x) => x.contractId === id).sort((a, b) => a.order - b.order);

export function signDraft(id, f) {
  need('contract');
  const c = C().contracts.find((x) => x.id === id && x.status === 'DRAFT');
  if (!c) refuse(tx('core.signDraft.refuse.4'));
  const names = [f.p1, f.p2].map((s) => (s || '').trim()).filter(Boolean);
  if (!names.length) refuse(tx('core.signDraft.refuse.3'));
  const unit = unitOf(f.unitId);
  if (!unit || !isDate(f.startDate)) refuse(tx('core.signDraft.refuse.2'));
  const end = new Date(`${f.startDate}T00:00:00`); end.setFullYear(end.getFullYear() + 2); end.setDate(end.getDate() - 1);
  const endDate = ymd(end);
  const other = C().contracts.find((x) => x.id !== id && x.unitId === unit.id && ['SIGNED', 'ACTIVE', 'TERMINATING'].includes(x.status) && x.startDate <= endDate && f.startDate <= x.endDate);
  if (other) refuse(`${tx('core.signDraft.text', { startDate: other.startDate })}`);
  if (!contactsOfContract(id).length) refuse(tx('core.signDraft.refuse'));
  const plan = names.length === 2 ? 'COUPLE' : 'SINGLE';
  const ids = names.map((n) => {
    let p = C().people.find((x) => x.siteId === unit.siteId && x.name === n);
    if (!p) { p = { id: nid('R'), code: `R-${String(9000 + C().seq).padStart(4, '0')}`, name: n, siteId: unit.siteId }; C().people.push(p); }
    return p.id;
  });
  const lead = ids.find((r) => Object.values(PERSONAS).some((p) => p.residentId === r && p.key === 'MEMBER')) ?? ids[0];
  Object.assign(c, { siteId: unit.siteId, unitId: unit.id, status: 'SIGNED', plan, occupancy: names.length, rate: ruleAt(unit.siteId, 'recurring')[plan], lockedOn: today(), deposit: Number(String(f.deposit).replace(/\D/g, '')) || null, insurance: f.insurance, jeonseOn: isDate((f.jeonse || '').trim()) ? f.jeonse.trim() : null, startDate: f.startDate, endDate, residentIds: ids, leadId: lead });
  hist(c.chainId, 'SIGN');
  return c;
}
export function moveIn(id) {
  need('contract');
  const c = C().contracts.find((x) => x.id === id);
  if (!c || c.status !== 'SIGNED') refuse(tx('core.moveIn.refuse'));
  c.status = 'ACTIVE'; c.billingStart = `${c.startDate.slice(0, 7)}-01`; c.occupiedFrom = c.startDate;
  hist(c.chainId, 'MOVE_IN');
}
export function succeed(id) {
  need('contract');
  const old = C().contracts.find((x) => x.id === id);
  if (!old || old.status !== 'ACTIVE' || old.occupancy !== 2) refuse(tx('core.succeed.refuse'));
  const remain = old.leadId, t = today();
  const nxt = { ...old, id: nid('CT'), status: 'ACTIVE', plan: 'SINGLE', occupancy: 1, rate: ruleAt(old.siteId, 'recurring').SINGLE, lockedOn: t, residentIds: [remain], startDate: t, billingStart: `${addMonths(t.slice(0, 7), 1)}-01`, billingEnd: null, occupiedFrom: t, occupiedTo: null, succeededFromId: old.id };
  old.status = 'SUCCEEDED'; old.billingEnd = monthEnd(t.slice(0, 7)); old.occupiedTo = t;
  C().contracts.push(nxt);
  C().contacts.filter((x) => x.contractId === old.id).forEach((x) => C().contacts.push({ ...x, id: nid('EC'), contractId: nxt.id }));
  hist(old.chainId, 'SUCCEED', { from: old.occupancy, to: 1 });
  emit('core.ContractSucceeded', { residentId: remain, remainingResidentId: remain, residentIds: [...old.residentIds], fromContractId: old.id, toContractId: nxt.id, billingStartOfNew: nxt.billingStart });
  return nxt;
}
export function saveDeposit(id, insurance, jeonseText) {
  need('contract');
  const c = C().contracts.find((x) => x.id === id); if (!c) return;
  const j = isDate((jeonseText || '').trim()) ? jeonseText.trim() : null;
  if (insurance !== c.insurance) hist(c.chainId, 'INSURANCE', { before: c.insurance, after: insurance });
  if (j !== c.jeonseOn) hist(c.chainId, 'JEONSE', { before: c.jeonseOn, after: j });
  c.insurance = insurance; c.jeonseOn = j;
}

// --- 식사 기록 ---
const skipKey = (s) => `${s.residentId}|${s.date}|${s.meal}`;
export const visibleSkips = () => C().mealSkips.filter((s) => s.appliedOn <= nowISO());
export const skipsOf = (rids, from, to, advanceOnly) => visibleSkips().filter((s) => rids.includes(s.residentId) && s.date >= from && s.date <= to && (!advanceOnly || s.advance));
export const closingOf = (month) => C().closings[month] || null;
export function parseCsv(text, month, siteId = 'S1') {
  const out = { total: 0, ok: [], errors: [], dup: 0 };
  const seen = new Set(C().mealSkips.map(skipKey));
  text.split(/\r?\n/).forEach((raw, i) => {
    const l = raw.trim(), n = i + 1;
    if (!l) return;
    const [code = '', date = '', mealLabel = '', adv = ''] = l.split(',').map((s) => s.trim());
    if (n === 1 && !/^R-/.test(code)) return; // 머리글 줄
    out.total++;
    const p = C().people.find((x) => x.code === code && x.siteId === siteId);
    if (!p) { out.errors.push({ n, msg: `${tx('core.parseCsv.text.2', { code })}` }); return; }
    const meal = Object.entries(MEAL).find(([, v]) => v === mealLabel)?.[0];
    if (!meal) { out.errors.push({ n, msg: tx('core.parseCsv.msg') }); return; }
    if (!isDate(date) || date.slice(0, 7) !== month) { out.errors.push({ n, msg: `${tx('core.parseCsv.text', { v: +month.slice(5) })}` }); return; }
    const row = { residentId: p.id, date, meal, advance: !new RegExp(tx('core.parseCsv.pattern'), 'i').test(adv) };
    if (seen.has(skipKey(row))) { out.dup++; return; }
    seen.add(skipKey(row)); out.ok.push(row);
  });
  out.valid = out.total - out.errors.length;
  return out;
}
export function applyCsv(text, month) {
  need('mealUpload');
  if (closingOf(month)) refuse(tx('core.applyCsv.refuse'));
  const r = parseCsv(text, month);
  r.ok.forEach((x) => C().mealSkips.push({ id: nid('MS'), ...x, appliedOn: nowISO(), source: 'CSV' }));
  return r;
}
export function closeMonth(month) {
  need('mealClose');
  if (closingOf(month)) refuse(tx('core.closeMonth.refuse'));
  C().closings[month] = { at: nowISO(), by: by() };
}
export function zeroSkipResidents(month, siteId = 'S1') {
  const got = new Set(skipsOf(residents(siteId).map((r) => r.id), `${month}-01`, monthEnd(month)).map((s) => s.residentId));
  return residents(siteId).filter((r) => !got.has(r.id)).sort((a, b) => a.name.localeCompare(b.name, 'ko'));
}
export function mealCount(rid, from, to) {
  const days = Math.round((new Date(`${to}T00:00:00`) - new Date(`${from}T00:00:00`)) / 86400000) + 1;
  const perDay = ruleAt('S1', 'meal').perDay, total = days * perDay, skips = skipsOf([rid], from, to), skipped = skips.length;
  // 청구 계산(lineSet)과 같은 규칙으로 세고, 결식 기록과 겹친 끼니는 한 번만 뺀다
  const seen = new Set(skips.map(skipKey));
  for (let p = from.slice(0, 7); p <= to.slice(0, 7); p = addDays(monthEnd(p), 1).slice(0, 7)) {
    const ab = ruleAt('S1', 'absence', monthEnd(p));
    if (ab?.enabled) absenceKeys({ residentIds: [rid] }, p, ab.minDays, perDay).filter((k) => { const d = k.split('|')[1]; return d >= from && d <= to; }).forEach((k) => seen.add(k));
  }
  const absent = seen.size - skipped;
  return { served: total - skipped - absent, total, skipped, absent, taken: total - skipped - absent };
}

// --- 청구 ---
export const invoicesOfSite = (siteId, p) => C().invoices.filter((v) => v.siteId === siteId && v.period === p)
  .sort((a, b) => unitRank(contractById(a.contractId)) - unitRank(contractById(b.contractId)));
export const isIssued = (v) => v.status === 'ISSUED' && (!v.dated || v.issuedOn <= today()); // 날짜 행(시드)은 시계가 닿아야 보인다
export const contractById = (id) => C().contracts.find((c) => c.id === id);
const issuedFor = (c, m) => C().invoices.some((v) => v.contractId === c.id && v.period === m && isIssued(v));
export const billable = (siteId, p) => contractsOfSite(siteId).filter((c) => c.billingStart && c.billingStart <= monthEnd(p) && (!c.billingEnd || c.billingEnd >= `${p}-01`) && ['ACTIVE', 'SUCCEEDED', 'TERMINATING'].includes(c.status)).sort((a, b) => unitRank(a) - unitRank(b));
// --- 요금 규칙 버전(CORE-03). 규칙마다 버전 목록이고, 기준일의 버전 = 시작일이 그날 이전인 가장 늦은 버전(없으면 첫 버전) ---
export const ruleAt = (siteId, kind, date = today()) => { const l = C().pricing[siteId][kind]; return l.filter((x) => x.from <= date).at(-1) ?? l[0]; };
/** 요금(생활비, 식비, 결식 감면)은 계약을 체결한 날의 버전에 고정한다. 체결일이 없는 시드 계약은 첫 버전 */
export const lockedRule = (c, kind) => ruleAt(c.siteId, kind, c.lockedOn || '');
const MEAL_CODES = ['BREAKFAST', 'LUNCH', 'DINNER'];
const dayCount = (a, b) => (a > b ? 0 : Math.round((new Date(`${b}T00:00:00`) - new Date(`${a}T00:00:00`)) / 86400000) + 1);
/** 장기 부재 끼니(코어 4절): 떠난 날과 돌아온 날은 빼고 p에 든 날 × 하루 끼니 수. 최소 일수보다 짧은 부재는 세지 않는다 */
function absenceKeys(c, p, minDays, perDay) {
  const first = `${p}-01`, last = monthEnd(p), keys = [];
  C().absences.filter((a) => a.status !== 'CANCELLED' && c.residentIds.includes(a.residentId)).forEach((a) => {
    const from = addDays(a.startedOn, 1), to = a.returnedOn ? addDays(a.returnedOn, -1) : last;
    if (dayCount(from, to) < (minDays || 0)) return;
    for (let d = from > first ? from : first; d <= (to < last ? to : last); d = addDays(d, 1)) for (let i = 0; i < perDay; i++) keys.push(`${a.residentId}|${d}|${MEAL_CODES[i] ?? i}`);
  });
  return keys;
}
function lineSet(c, p) {
  const ml = lockedRule(c, 'meal'), sk = lockedRule(c, 'skip'), lines = [{ code: 'RECURRING', amount: c.rate, plain: { plan: c.plan, amount: c.rate } }];
  if (ml) {
    const days = daysIn(p), meals = days * ml.perDay * c.occupancy;
    lines.push({ code: 'MEAL', amount: meals * ml.unitPrice, plain: { days, mealsPerDay: ml.perDay, occupancy: c.occupancy, meals, unitPrice: ml.unitPrice, amount: meals * ml.unitPrice } });
  }
  const ab = ruleAt(c.siteId, 'absence', monthEnd(p));
  const keys = new Set(sk ? skipsOf(c.residentIds, `${p}-01`, monthEnd(p), sk.advanceOnly).map(skipKey) : []);
  const recorded = keys.size;
  if (sk && ml && ab?.enabled) absenceKeys(c, p, ab.minDays, ml.perDay).forEach((k) => keys.add(k)); // 결식 기록과 같은 끼니는 한 번만
  const n = keys.size;
  if (n) lines.push({ code: 'MEAL_SKIP', amount: -n * sk.unitPrice, plain: { count: n, absenceCount: n - recorded, unitPrice: sk.unitPrice, amount: n * sk.unitPrice } });
  C().usages.filter((u) => u.status === 'PENDING' && u.period === p && c.residentIds.includes(u.residentId)).forEach((u) =>
    lines.push({ code: 'SERVICE', amount: u.amount, plain: { serviceCode: u.serviceCode, name: u.item, quantity: 1, unitPrice: u.amount, amount: u.amount, usedOn: u.usedOn, source: u.source, usageId: u.id } }));
  return lines;
}
/** 청구서 발행 예정일: 말일이거나 매월 N일(없는 날이면 말일) */
export function issueDate(siteId, m) { const d = ruleAt(siteId, 'schedule', monthEnd(m)).issueDay; return d === 'LAST' || d >= daysIn(m) ? monthEnd(m) : `${m}-${p2(d)}`; }
export function runBilling(siteId, p) {
  need('bill');
  const cs = billable(siteId, p);
  let reduced = 0;
  C().invoices = C().invoices.filter((v) => !(v.siteId === siteId && v.period === p && v.status === 'DRAFT'));
  cs.forEach((c) => {
    if (issuedFor(c, p)) return;
    const lines = lineSet(c, p);
    if (lines.some((l) => l.code === 'MEAL_SKIP')) reduced++;
    C().invoices.push({ id: `IV-${c.id}-${p}`, contractId: c.id, siteId, residentIds: [...c.residentIds], leadId: c.leadId, period: p, status: 'DRAFT', lines, total: lines.reduce((s, l) => s + l.amount, 0), issuedOn: null, dueOn: null });
  });
  return { count: C().invoices.filter((v) => v.siteId === siteId && v.period === p && v.status === 'DRAFT').length, reduced };
}
export function issueBilling(siteId, p) {
  need('bill');
  const t = today(), list = C().invoices.filter((v) => v.siteId === siteId && v.period === p && v.status === 'DRAFT');
  list.forEach((v) => {
    v.status = 'ISSUED'; v.issuedOn = t; v.dueOn = addDays(t, ruleAt(siteId, 'schedule', t).dueDays);
    v.lines.filter((l) => l.code === 'SERVICE').forEach((l) => { const u = C().usages.find((x) => x.id === l.plain.usageId); if (u) u.status = 'BILLED'; });
    v.residentIds.forEach((rid) => emit('core.InvoiceIssued', { residentId: rid, month: p, invoiceId: v.id, residentIds: v.residentIds, totalAmount: v.total }));
  });
  return list;
}
export function pubInvoice(v) {
  if (!v) return null;
  const skip = v.lines.find((l) => l.code === 'MEAL_SKIP'), meal = v.lines.find((l) => l.code === 'MEAL');
  return { id: v.id, month: v.period, period: v.period, total: v.total, totalAmount: v.total, issuedOn: v.issuedOn, dueOn: v.dueOn, dueDate: v.dueOn, status: v.status, paymentState: 'NOT_TRACKED',
    mealSkips: skip ? skip.plain.count : 0, meals: meal ? meal.plain.meals : 0,
    lines: v.lines.map((l) => ({ code: l.code, type: l.code, label: l.code === 'SERVICE' ? l.plain.name : LINE_LABEL[l.code], amount: l.amount, plain: l.plain })) };
}
export const invoiceOf = (rid, month) => pubInvoice(C().invoices.find((v) => isIssued(v) && v.period === month && v.residentIds.includes(rid)));
export const latestInvoice = (rid) => pubInvoice(C().invoices.filter((v) => isIssued(v) && v.residentIds.includes(rid)).sort((a, b) => b.period.localeCompare(a.period))[0]);
export function keyDates(rid) {
  const c = contractOf(rid);
  if (!c) return null;
  const last = latestInvoice(rid), chain = chainOf(rid);
  let next = null, m = chain[0]?.billingStart.slice(0, 7);
  for (let i = 0; m && i < 60; i++, m = addMonths(m, 1)) {
    const cov = chain.find((x) => x.billingStart <= monthEnd(m) && (!x.billingEnd || x.billingEnd >= `${m}-01`));
    if (!cov) break;
    if (!issuedFor(cov, m)) { next = issueDate(cov.siteId, m); break; }
  }
  return { moveInDate: moveInDate(rid), contractEnd: c.endDate, contractEndDate: c.endDate, lastInvoiceIssuedOn: last?.issuedOn ?? null, lastInvoiceDueDate: last?.dueOn ?? null, nextInvoiceScheduledOn: next, moveOutDate: c.moveOutDate ?? null };
}
export function ownerTotals(siteId) {
  const months = [...new Set(C().invoices.filter((v) => v.siteId === siteId && isIssued(v)).map((v) => v.period))].sort();
  const month = months[months.length - 1] ?? null;
  const rows = month ? C().invoices.filter((v) => v.siteId === siteId && isIssued(v) && v.period === month).sort((a, b) => unitRank(contractById(a.contractId)) - unitRank(contractById(b.contractId))) : [];
  return { month, rows, total: rows.length ? rows.reduce((s, v) => s + v.total, 0) : null };
}

// --- 수납과 결제 시도(US-30, tech-design 3-6). 시드에는 넣지 않는다. 실제 돈은 움직이지 않고 목업까지만 간다 ---
const pays = () => (C().payments ??= []), tries = () => (C().paymentAttempts ??= []);
export const paymentsOf = (id) => pays().filter((x) => x.invoiceId === id);
export const paidOf = (id) => paymentsOf(id).reduce((s, x) => s + x.amount, 0);
export const payState = (v) => { const paid = paidOf(v.id); return paid >= v.total ? 'PAID' : paid ? 'PARTIAL' : 'UNPAID'; };
export const paidSum = (list) => { const on = list.flatMap((v) => paymentsOf(v.id)); return on.length ? on.reduce((s, x) => s + x.amount, 0) : null; };
export const attemptById = (id) => tries().find((a) => a.id === id);
export const openAttempt = (id) => tries().find((a) => a.invoiceId === id && a.status === 'REQUESTED');
export const rawInvoice = (id) => C().invoices.find((v) => v.id === id);
const myRep = () => { const p = me(); return p.key === 'PROXY' ? C().reps.find((x) => x.residentId === p.residentId && x.name === p.name) : null; };
export const repExpired = () => { const r = myRep(); return !!r && r.validUntil < today(); };
export function canPay() { // core.payment.pay: 본인 또는 유효한 PAY 대리인
  const p = me(), r = myRep();
  return p.key === 'MEMBER' || !!(r && r.scopes.includes('PAY') && r.validUntil >= today());
}
export function startPayment(invoiceId) {
  const v = rawInvoice(invoiceId), r = myRep();
  if (!v || !isIssued(v)) refuse(tx('core.createInquiry.refuse'));
  if (!canPay() || !v.residentIds.includes(me().residentId)) refuse(tx('CORE-16.noPay', { nameOf: nameOf(me().residentId) }));
  const open = openAttempt(invoiceId);
  if (open) return open;
  const amount = v.total - paidOf(invoiceId);
  if (amount <= 0) refuse(tx('CORE-16.already', { md: fmt.md(paymentsOf(invoiceId).at(-1).on), won: fmt.won(paidOf(invoiceId)) }));
  const a = { id: nid('PA'), invoiceId, amount, actor: me().id, actorName: me().name, signedAs: r ? 'REPRESENTATIVE' : 'SELF', provider: 'MOCK', status: 'REQUESTED', requestedAt: nowISO(), closedAt: null };
  tries().push(a);
  return a;
}
export function closePayment(id, result) { // 이미 닫힌 시도는 다시 닫지 않는다. 그래서 수납은 한 번만 남는다
  const a = attemptById(id);
  if (!a || a.status !== 'REQUESTED') return a;
  a.status = result; a.closedAt = nowISO();
  if (result !== 'SUCCEEDED') return a;
  const v = rawInvoice(a.invoiceId), r = myRep();
  pays().push({ id: nid('PM'), invoiceId: a.invoiceId, attemptId: id, amount: a.amount, on: today(), provider: 'MOCK', method: 'CARD', proxyName: r ? r.name : null });
  hist(contractById(v.contractId).chainId, 'PAYMENT', { amount: a.amount, basis: r?.basis ?? null, residentId: r?.residentId ?? null });
  return a;
}

// --- 서비스 사용 기록(생활 요청이 넘긴다) ---
export function targetPeriod(rid, usedOn) {
  const c = contractOf(rid);
  if (!c || !c.billingStart) return null;
  let m = usedOn.slice(0, 7);
  for (let i = 0; i < 24; i++, m = addMonths(m, 1)) {
    if (c.billingEnd && c.billingEnd < `${m}-01`) return null;
    if (c.billingStart > monthEnd(m)) continue;
    if (!issuedFor(c, m)) return m;
  }
  return null;
}
// 생활 요청이 넘기는 값. item은 서비스 이름이나 서비스 코드, source는 모듈 키나 보여 줄 이름 어느 쪽이어도 받는다.
export const ITEM_LABEL = { LAUNDRY_BEDDING: tx('core.ITEM_LABEL.LAUNDRYBEDDING') };
export const SOURCE_LABEL = { requests: tx('core.SOURCE_LABEL.requests') };
export function recordServiceUsage({ residentId, item, amount, source, sourceId, serviceCode = null }) {
  const dup = C().usages.find((u) => u.sourceKey === source && u.sourceId === sourceId);
  if (dup) return dup;
  const usedOn = today(), period = targetPeriod(residentId, usedOn), c = contractOf(residentId);
  if (!period || !c) return null;
  const code = serviceCode ?? (C().pricing[c.siteId].services[item] != null ? item : null);
  const price = amount ?? (code ? C().pricing[c.siteId].services[code] : null);
  if (price == null) return null;
  const u = { id: nid('SU'), siteId: c.siteId, residentId, item: ITEM_LABEL[item] ?? item, serviceCode: code, amount: Number(price), usedOn, period, source: SOURCE_LABEL[source] ?? source, sourceKey: source, sourceId, status: 'PENDING' };
  C().usages.push(u);
  return u;
}
export const pendingUsages = () => C().usages.filter((u) => u.status === 'PENDING').map((u) => ({ ...u, name: nameOf(u.residentId), room: roomOfContract(contractOf(u.residentId)), month: u.period }));

// --- 문의 ---
export function createInquiry(invoiceId, residentId, channel = 'APP') {
  const v = C().invoices.find((x) => x.id === invoiceId);
  if (!v || v.status !== 'ISSUED') refuse(tx('core.createInquiry.refuse'));
  const open = C().inquiries.find((q) => q.invoiceId === invoiceId && q.status !== 'ANSWERED');
  if (open) return open;
  const q = { id: nid('IQ'), invoiceId, residentId, channel, at: nowISO(), status: 'RECEIVED' };
  C().inquiries.push(q);
  return q;
}

// --- 장기 부재 ---
export const absOpenAt = (a, date) => a.status !== 'CANCELLED' && a.startedOn <= date && (!a.returnedOn || a.returnedOn > date);
export function openAbsences(iso = nowISO()) {
  const date = iso.slice(0, 10);
  return C().absences.filter((a) => absOpenAt(a, date)).map((a) => {
    const overdue = !!a.expectedOn && a.expectedOn < date;
    return { id: a.id, residentId: a.residentId, name: nameOf(a.residentId), room: unitOf(a.unitId)?.label ?? '', startedOn: a.startedOn, expectedOn: a.expectedOn, expectedReturnOn: a.expectedOn, route: a.route, overdue, returnOverdue: overdue };
  }).sort((a, b) => a.startedOn.localeCompare(b.startedOn) || a.room.localeCompare(b.room, 'ko'));
}
export const isAbsent = (rid, iso = nowISO()) => C().absences.some((a) => a.residentId === rid && absOpenAt(a, iso.slice(0, 10)));
export function startAbsence(rid, startedOn, expectedOn, route, dry = false) {
  need('absence');
  const t = today(), c = contractOf(rid);
  if (startedOn > t) refuse(`${tx('core.startAbsence.text.4', { t })}`);
  if (expectedOn && expectedOn < startedOn) refuse(`${tx('core.startAbsence.text.3', { startedOn })}`);
  const open = C().absences.find((a) => a.residentId === rid && absOpenAt(a, t));
  if (open) refuse(`${tx('core.startAbsence.text.2', { nameOf: nameOf(rid), startedOn: open.startedOn })}`);
  const past = C().absences.find((a) => a.residentId === rid && a.status !== 'CANCELLED' && a.returnedOn && a.startedOn <= (expectedOn || startedOn) && startedOn <= a.returnedOn);
  if (past) refuse(`${tx('core.startAbsence.text', { nameOf: nameOf(rid), startedOn: past.startedOn, returnedOn: past.returnedOn })}`);
  if (dry) return null;
  const a = { id: nid('AB'), residentId: rid, unitId: c.unitId, startedOn, expectedOn: expectedOn || null, returnedOn: null, status: 'OPEN', route, cancelReason: null, changes: [] };
  C().absences.push(a);
  emit('core.ResidentAbsenceStarted', { absenceId: a.id, residentId: rid, unitId: a.unitId, startedOn, expectedOn: a.expectedOn, expectedReturnOn: a.expectedOn });
  return a;
}
const absOf = (id) => C().absences.find((a) => a.id === id && a.status !== 'CANCELLED' && (!a.returnedOn || a.returnedOn > today()));
export function endAbsence(id) {
  need('absence');
  const a = absOf(id); if (!a) refuse(tx('core.endAbsence.refuse'));
  const t = today();
  if (t < a.startedOn) refuse(`${tx('core.endAbsence.text', { startedOn: a.startedOn })}`);
  a.returnedOn = t; a.status = 'ENDED';
  emit('core.ResidentAbsenceEnded', { absenceId: a.id, residentId: a.residentId, unitId: a.unitId, returnedOn: t, endedOn: t, expectedOn: a.expectedOn, expectedReturnOn: a.expectedOn });
}
export function changeExpected(id, expectedOn) {
  need('absence');
  const a = absOf(id); if (!a) refuse(tx('core.changeExpected.refuse'));
  if (expectedOn && expectedOn < a.startedOn) refuse(`${tx('core.changeExpected.text', { startedOn: a.startedOn })}`);
  a.changes.push({ at: nowISO(), by: by(), before: a.expectedOn, after: expectedOn || null });
  const before = a.expectedOn; a.expectedOn = expectedOn || null;
  return before;
}
export function cancelAbsence(id, why) {
  need('absence');
  const a = absOf(id); if (!a) refuse(tx('core.cancelAbsence.refuse.2'));
  if (!CANCEL_WHY[why]) refuse(tx('core.cancelAbsence.refuse'));
  a.status = 'CANCELLED'; a.cancelReason = why;
  emit('core.ResidentAbsenceEnded', { absenceId: a.id, residentId: a.residentId, unitId: a.unitId, returnedOn: null, endedOn: today(), expectedOn: a.expectedOn, expectedReturnOn: a.expectedOn, cancelled: true });
}
export function todos(persona) {
  if (!persona || !['HQ_ADMIN', 'HQ_OPS', 'MANAGER', 'ACCOUNTING'].includes(persona.key)) return [];
  return openAbsences().filter((a) => a.overdue).map((a) => ({ kind: 'ABSENCE_RETURN_OVERDUE', text: `${tx('core.todos.text', { room: a.room, name: a.name })}`, href: '#/CORE-13', dueOn: a.expectedOn }));
}

// --- 요금 규칙 저장(CORE-03). 바뀐 규칙만 새 버전이 되고 옛 버전은 지우지 않는다. 입력 오류 문구는 코어 copy 2-5 ---
export const RULE_KINDS = ['recurring', 'meal', 'skip', 'schedule', 'absence'];
const amt = (s) => { const t = String(s ?? '').replace(/[,\s]/g, '').replace(new RegExp(`${tx('common.fmt.won')}$`), ''); return /^\d+$/.test(t) ? Number(t) : null; };
/** 화면 칸의 지금 값(마지막 버전). 칸 이름은 view 키와 같다 */
export function rateFields(siteId) {
  const last = (k) => C().pricing[siteId][k].at(-1), r = last('recurring'), m = last('meal'), k = last('skip'), s = last('schedule'), a = last('absence');
  return { rSingle: fmt.won(r.SINGLE), rCouple: fmt.won(r.COUPLE), rRecFrom: r.from, rMeal: fmt.won(m.unitPrice), rPerDay: String(m.perDay), rMealFrom: m.from,
    rSkip: fmt.won(k.unitPrice), rCond: k.advanceOnly ? 'ADVANCE' : 'ALL', rSkipFrom: k.from,
    rIssue: s.issueDay === 'LAST' ? 'LAST' : 'DAY', rIssueDay: s.issueDay === 'LAST' ? '' : String(s.issueDay), rDue: String(s.dueDays), rSchedFrom: s.from,
    rAbs: a.enabled ? 'ON' : 'OFF', rAbsMin: a.minDays == null ? '' : String(a.minDays), rAbsFrom: '' };
}
/** 화면 값. 손대지 않은 칸은 지금 값 */
export function rateForm(siteId) {
  const f = rateFields(siteId);
  for (const k of Object.keys(f)) if (view[k] !== undefined) f[k] = view[k];
  return f;
}
function readRules(f) {
  const money = (s) => { const n = amt(s); if (n === null) refuse(tx('CORE-03.errAmount')); return n; };
  const count = (s, min) => { const n = amt(s); if (n === null || n < min) refuse(tx('CORE-03.errCount')); return n; };
  const recurring = { SINGLE: money(f.rSingle), COUPLE: money(f.rCouple) }, meal = { unitPrice: money(f.rMeal), perDay: count(f.rPerDay, 1) }, skip = { unitPrice: money(f.rSkip), advanceOnly: f.rCond !== 'ALL' };
  const day = f.rIssue === 'LAST' ? 'LAST' : f.rIssue === 'DAY' ? amt(f.rIssueDay) : null; // 매월 31일은 달 끝을 넘으면 말일로 본다
  if (f.rIssue === 'DAY' && (day === null || day < 1 || day > 31)) refuse(tx('CORE-03.errIssueRange'));
  if (day === null) refuse(tx('CORE-03.errIssue'));
  const due = amt(f.rDue);
  if (due === null || due < 1) refuse(tx('CORE-03.errDue'));
  const min = String(f.rAbsMin ?? '').trim() === '' ? null : count(f.rAbsMin, 0);
  return { recurring, meal, skip, schedule: { issueDay: day, dueDays: due }, absence: { enabled: f.rAbs === 'ON', minDays: min } };
}
/** 본사 관리자만. 모두 검사한 뒤에 쓴다. 돌려주는 값은 새 버전이 된 규칙 [{kind, from, v}] */
export function saveRules(siteId, f) {
  need('configure');
  const want = readRules(f), pr = C().pricing[siteId];
  const froms = { recurring: f.rRecFrom, meal: f.rMealFrom, skip: f.rSkipFrom, schedule: f.rSchedFrom, absence: String(f.rAbsFrom ?? '').trim() || today() }; // 장기 부재 끼니 시작일은 비우면 오늘
  const changed = RULE_KINDS.filter((k) => Object.keys(want[k]).some((x) => want[k][x] !== pr[k].at(-1)[x]));
  changed.forEach((k) => {
    const from = String(froms[k] ?? '').trim();
    if (!isDate(from)) refuse(tx('CORE-03.errDate'));
    if (from <= pr[k].at(-1).from) refuse(`${tx('CORE-03.errOrder', { from: pr[k].at(-1).from })}`);
  });
  return changed.map((k) => { const v = pr[k].at(-1).v + 1, from = String(froms[k]).trim(); pr[k].push({ v, from, ...want[k], by: by(), at: nowISO() }); return { kind: k, from, v }; });
}
