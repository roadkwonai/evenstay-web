// 생활 지원 단계(transitions) 도메인. 상태는 db.transitions 하나에만 두고, 다른 모듈은 api.x.y?.()로만 부른다.
// 상태 판단은 영문 코드로 한다(PRD 7절, tech-design 3절). 화면에 보이는 한글은 seed와 문구 조각에 둔다.
import { tx } from '../../lib/text.js';
import { api, db, emit, me, nowISO, refuse, view } from '../../lib/kit.js';
import { PERSONAS, RESIDENTS } from '../../lib/people.js';

export const T = () => db.transitions;

// ---------- 시드 (함수 호출 없는 데이터) ----------


// ---------- 문구 조각 (한 문장은 한 문자열) ----------
export const MSG = {
  noRole: tx('transitions.MSG.noRole'),
  sameDecider: tx('transitions.MSG.sameDecider'),
  explainMissing: tx('transitions.MSG.explainMissing'),
  placeNoOpinion: tx('transitions.MSG.placeNoOpinion'),
  wantsTime: tx('transitions.MSG.wantsTime'),
  placeDisagrees: tx('transitions.MSG.placeDisagrees'),
  noEvidence: tx('transitions.MSG.noEvidence'),
  oldEvidence: tx('transitions.MSG.oldEvidence'),
  openExists: tx('transitions.MSG.openExists'),
  dateOrder: tx('transitions.MSG.dateOrder'),
  reasonNeeded: tx('transitions.MSG.reasonNeeded'),
  proposeReasonNeeded: tx('transitions.MSG.proposeReasonNeeded'),
  itemsNeeded: tx('transitions.MSG.itemsNeeded'),
  fillAll: tx('transitions.MSG.fillAll'),
  badSlot: tx('transitions.MSG.badSlot'),
  badDate: tx('transitions.MSG.badDate'),
  keepBothReason: tx('transitions.MSG.keepBothReason'),
  moreNone: tx('transitions.MSG.moreNone'),
  noDef: tx('core.need.refuse'),
  nameRule: tx('TRN-12.hintName'),
};
export const SAVED_ASSESS = tx('transitions.SAVED_ASSESS.text');
export const SAVED_PROPOSAL = tx('transitions.SAVED_PROPOSAL.text');
export const SAVED_EXPLAIN = tx('transitions.SAVED_EXPLAIN.text');

// ---------- 날짜와 말 ----------
const D = (s) => new Date(`${s}T00:00:00Z`);
export const ymdOf = (iso) => iso.slice(0, 10);
export const today = () => ymdOf(nowISO());
export const addDays = (s, n) => new Date(D(s).getTime() + n * 864e5).toISOString().slice(0, 10);
export const wdOf = (s) => D(s).getUTCDay();
export const dayDiff = (a, b) => Math.round((D(b) - D(a)) / 864e5);
export const mdText = (s) => `${tx('transitions.mdText.text', { v: +s.slice(5, 7), v2: +s.slice(8, 10) })}`;
export const md2 = (s) => `${+s.slice(5, 7)}/${+s.slice(8, 10)}`;
export const longDate = (s) => `${tx('transitions.longDate.text', { v: +s.slice(0, 4), v2: +s.slice(5, 7), v3: +s.slice(8, 10) })}`;
export const wdShort = (n) => T().weekdayShort[n];
export const wdLong = (n) => `${tx('transitions.wdLong.text', { v: T().weekdayShort[n] })}`;
export const korTime = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number); const mm = m ? ` ${tx('transitions.korTime.text.4', { m })}` : '';
  return h === 12 ? `${tx('transitions.korTime.text.3', { mm })}` : h < 12 ? `${tx('transitions.korTime.text.2', { h, mm })}` : `${tx('transitions.korTime.text', { v: h - 12, mm })}`;
};
const batchim = (w) => { const c = w.trim().slice(-1).charCodeAt(0) - 0xAC00; return c < 0 || c > 11171 ? 0 : c % 28; };
/** 받침 없으면 open, 있으면 close (이/가, 와/과 …) */
export const josa = (w, open, close) => (batchim(w) ? close : open);
export const josaRo = (w) => (batchim(w) === 0 || batchim(w) === 8 ? tx('transitions.josaRo.text.2') : tx('transitions.josaRo.text'));

// ---------- 사람과 입주자 ----------
export const staffTag = (id) => { const p = PERSONAS[id]; return `${p.name}(${T().roleWords[p.key]?.staff ?? p.role})`; };
export const memberTag = (id) => { const p = PERSONAS[id], w = T().roleWords[p.key]?.member ?? p.role; return p.key === 'MANAGER' || p.key === 'HQ_OPS' ? `${p.name} ${w}` : `${tx('transitions.memberTag.text', { w, name: p.name })}`; };
export const resident = (rid) => api.core.residents?.()?.find((x) => x.id === rid) ?? RESIDENTS[rid];
export const whoLabel = (rid) => { const r = resident(rid); return `${r.room} ${r.name}`; };
export const residentName = (rid) => api.core.residentName?.(rid) ?? RESIDENTS[rid]?.name ?? '';
export const moveIn = (rid) => (api.core.keyDates?.(rid)?.moveInDate ?? T().fallbackMoveIn[rid] ?? null)?.slice(0, 10) ?? null;
export const WRITE_KEYS = ['CARE', 'LIFE', 'MANAGER'];
export const READ_KEYS = ['CARE', 'LIFE', 'MANAGER', 'HQ_OPS'];
export const DECIDE_KEYS = ['MANAGER', 'HQ_OPS'];
export const ACK_KEYS = ['ACCOUNTING', 'MANAGER', 'HQ_OPS'];

// ---------- 단계 정의와 지금 단계 ----------
// 단계 정의는 버전 목록이다(TRN-12). 기준일의 정의 = 시작일이 그날 이전인 가장 늦은 버전. 이미 정한 단계는 결정한 날의 정의로 본다.
export const defsAt = (at = today()) => { const l = T().defVersions; return l.filter((d) => d.validFrom <= at).at(-1) ?? l[0]; };
export const stages = (at) => defsAt(at).stages;
export const stageOf = (code, at) => stages(at).find((s) => s.code === code);
// 옛 버전에서 뺀 서비스도 이미 받는 입주자의 시간표에 남으므로 모든 버전에서 찾는다.
export const serviceOf = (code) => [...T().defVersions].reverse().flatMap((d) => d.stages).flatMap((s) => s.services).find((v) => v.code === code);
export const roomItem = () => T().defVersions[0].unchanged.split(', ')[0];
export const unchangedLines = (s) => s.unchangedLines ?? T().defVersions[0].unchanged.split(', ');
export const EDIT_KEYS = ['HQ_ADMIN', 'MANAGER'];
export const changeText = (s) => (s.mode === 'KEEP_CURRENT' ? s.keepNote : s.services.length ? `${tx('transitions.changeText.text', { join: s.services.map((v) => v.previewLabel).join(', ') })}` : s.servicesNote);
export const servicesText = (s) => s.servicesNote || s.services.map((v) => v.staffLabel).join(', ');
export const feeChanged = (rid, toCode) => { const to = stageOf(toCode), cur = currentStage(rid); return !!cur && (to.mode === 'OWN' ? to.fee : cur.feeGroup) !== cur.feeGroup; };

export function currentStage(rid, at = today()) {
  const a = T().assignments.filter((x) => x.rid === rid && x.from <= at && (!x.to || x.to >= at)).at(-1);
  const mv = moveIn(rid);
  const pack = (code, since, fee, decisionId, implicit) => { const s = stageOf(code, since); return { stage: code, staffLabel: s.staffLabel, memberLabel: s.memberLabel, since, feeGroup: fee, decisionId, implicit }; };
  if (a) return pack(a.stage, a.from, a.fee, a.decisionId, false);
  if (!mv || mv > at) return null;
  return pack('BASIC', mv, stageOf('BASIC').fee, null, true);
}
/** 지난 단계 기록용 구간 목록(최근 것 먼저) */
export function stageSpans(rid) {
  const mv = moveIn(rid), list = T().assignments.filter((x) => x.rid === rid).sort((a, b) => a.from.localeCompare(b.from));
  const spans = list.map((a) => ({ stage: a.stage, from: a.from, to: a.to, decisionId: a.decisionId }));
  if (mv && (!spans.length || spans[0].from > mv)) spans.unshift({ stage: 'BASIC', from: mv, to: spans.length ? addDays(spans[0].from, -1) : null, decisionId: null, implicit: true });
  return spans.reverse();
}

// ---------- 조회 ----------
export const OPEN_STATUS = ['DRAFT', 'AWAITING_EXPLANATION', 'AWAITING_DECISION'];
/** 코어 거주 목록. 코어에 아직 없어도 시드 주인공(fallbackMoveIn)은 넣는다 */
export const residentsList = () => {
  const base = api.core.residents?.() ?? [];
  const extra = Object.keys(T().fallbackMoveIn).filter((id) => !base.some((r) => r.id === id)).map((id) => RESIDENTS[id]);
  return [...extra, ...base].filter((r) => currentStage(r.id));
};
export const assessmentsOf = (rid) => T().assessments.filter((a) => a.rid === rid).sort((a, b) => a.at.localeCompare(b.at));
export const latestAssessment = (rid) => assessmentsOf(rid).at(-1);
export const openProposal = (rid) => T().proposals.find((p) => p.rid === rid && OPEN_STATUS.includes(p.status));
export const proposalById = (id) => T().proposals.find((p) => p.id === id);
export const explanationsOf = (p) => T().explanations.filter((x) => x.pid === p.id && x.round === p.round);
export const lastOpinion = (p) => explanationsOf(p).at(-1)?.opinion ?? null;
export const noShareOf = (p) => explanationsOf(p).some((x) => x.noShare);
export const decisionOf = (id) => T().decisions.find((d) => d.id === id);
export const openOverlaps = (rid) => T().overlaps.filter((o) => o.rid === rid && o.status === 'OPEN');
export const externalsOf = (rid) => T().externals.filter((e) => e.rid === rid && !e.cancelled);
export const historyOf = (rid) => T().log.filter((l) => l.rid === rid).sort((a, b) => a.at.localeCompare(b.at));
export const bannedFound = (...texts) => T().bannedWords.find((w) => texts.some((s) => (s || '').includes(w)));
export const coAssessor = (p) => T().assessDefaults.coIds.find((c) => c !== p.id);
export const activeServices = (rid) => (T().active[rid] ?? []).map(serviceOf).filter(Boolean);

function log(rid, kind, by, extra = {}) { T().log.push({ id: `L${++T().seq}`, at: nowISO(), rid, kind, by, ...extra }); }
const nid = (p) => `${p}${++T().seq}`;
const need = (cond, msg) => { if (!cond) refuse(msg); };
const mustWrite = () => need(WRITE_KEYS.includes(me().key), MSG.noRole);

// ---------- 겹침 계산 (tech-design 4절) ----------
const INF = '9999-12-31';
/** 두 기간이 그 요일을 함께 포함하는 날짜들. 둘 다 끝이 없으면 앞 26주만 센다 */
function commonDates(ext, slot, wd) {
  const lo = ext.start > slot.from ? ext.start : slot.from;
  const hi = [ext.end || INF, slot.to || INF].sort()[0];
  let d = lo; while (wdOf(d) !== wd) d = addDays(d, 1);
  const out = []; for (let i = 0; d <= hi && i < 26; i += 1, d = addDays(d, 7)) out.push(d);
  return out;
}
const timesCross = (a, b) => a.start < b.end && b.start < a.end;

export function recalcOverlaps(rid) {
  const t = T(), seen = new Set();
  for (const ext of externalsOf(rid)) {
    ext.times.forEach((et, ei) => {
      for (const sl of t.slots.filter((s) => s.rid === rid)) {
        if (!sl.wds.includes(et.wd) || !timesCross(et, sl)) continue;
        const dates = commonDates(ext, sl, et.wd); if (!dates.length) continue;
        let rec = t.overlaps.find((o) => o.extId === ext.id && o.slotId === sl.id && o.ei === ei);
        if (!rec) { rec = { id: nid('V'), rid, extId: ext.id, slotId: sl.id, ei, wd: et.wd, first: dates[0], status: 'OPEN', resolution: '', note: '', by: '', at: '' }; t.overlaps.push(rec); }
        rec.first = dates[0]; seen.add(rec.id);
      }
    });
  }
  t.overlaps.filter((o) => o.rid === rid && o.status === 'OPEN' && !seen.has(o.id)).forEach((o) => { o.status = 'OBSOLETE'; });
}

// ---------- 평가 기록 (F2) ----------
function actSaveAssessment(args) {
  mustWrite();
  const t = T(), p = me(), rid = args.rid, d = t.assessDefaults;
  const items = t.items.map((it) => ({ code: it.code, level: view[`lv-${it.code}`] || '', note: (view[`nt-${it.code}`] || '').trim() }));
  need(items.every((i) => i.level), MSG.itemsNeeded);
  const wish = (view.wish || '').trim();
  const rec = { id: nid('A'), rid, at: nowISO(), by: p.id, withIds: [coAssessor(p)], trigger: d.trigger, present: true, items, wish, warnIgnored: !!bannedFound(wish, ...items.map((i) => i.note)) };
  t.assessments.push(rec);
  log(rid, 'ASSESSMENT', p.id, { trigger: rec.trigger });
  view.saved = rec.id;
}

// ---------- 제안 (F3) ----------
function actPropose(args) {
  mustWrite();
  const t = T(), p = me(), rid = args.rid, cur = currentStage(rid), open = openProposal(rid);
  need(!open || open.status === 'DRAFT', MSG.openExists);
  const ev = latestAssessment(rid);
  need(ev, MSG.noEvidence);
  need(dayDiff(ymdOf(ev.at), today()) <= 30, MSG.oldEvidence);
  const to = view.stage || stages().find((s) => s.code !== cur.stage).code;
  const reason = (view.why || '').trim();
  need(reason, MSG.proposeReasonNeeded);
  let prop = open;
  if (prop) Object.assign(prop, { to, from: cur.stage, evidence: [ev.id], reason, status: 'AWAITING_EXPLANATION', blocked: null });
  else { prop = { id: nid('P'), rid, from: cur.stage, to, evidence: [ev.id], reason, by: p.id, at: nowISO(), status: 'AWAITING_EXPLANATION', round: 1, blocked: null }; t.proposals.push(prop); }
  log(rid, 'PROPOSAL', p.id, { from: prop.from, to: prop.to });
  view.savedP = prop.id;
}

// ---------- 설명과 의견 (F4) ----------
function actExplain(args) {
  mustWrite();
  const t = T(), p = me(), prop = proposalById(args.pid);
  need(prop && ['AWAITING_EXPLANATION', 'AWAITING_DECISION'].includes(prop.status), MSG.openExists);
  const opinion = view.opinion;
  need(opinion, MSG.fillAll);
  const why = (view.because || '').trim();
  need(opinion !== 'COULD_NOT_HEAR' || why, MSG.fillAll);
  const x = { id: nid('X'), pid: prop.id, round: prop.round, at: nowISO(), date: today(), by: p.id, companion: { ...t.explainDefaults.companion }, opinion, reason: why, words: (view.words || '').trim(), noShare: !!view.noShare, noShareAt: view.noShare ? nowISO() : '' };
  t.explanations.push(x);
  prop.status = 'AWAITING_DECISION'; prop.blocked = null;
  log(prop.rid, 'EXPLANATION', p.id, { opinion });
  view.savedX = x.id;
}

// ---------- 결정 (F5, F6, F8, F9) ----------
/** 결정 규칙. 막히면 화면 띠(view.err)와 refuse 둘 다 */
function checkDecision(prop, choice) {
  const p = me();
  const fail = (msg) => { view.err = msg; refuse(msg); };
  if (p.id === prop.by || !DECIDE_KEYS.includes(p.key)) fail(MSG.sameDecider);
  need(OPEN_STATUS.includes(prop.status), MSG.openExists);
  if (prop.status === 'AWAITING_EXPLANATION' || prop.status === 'DRAFT') { prop.blocked = { at: nowISO(), by: p.id }; fail(MSG.explainMissing); }
  const op = lastOpinion(prop);
  if (prop.to === 'PLACE_CONSULT' && op === 'COULD_NOT_HEAR') fail(MSG.placeNoOpinion);
  if (choice === 'CHANGE' && op === 'WANTS_TIME') fail(MSG.wantsTime);
  if (choice === 'CHANGE' && prop.to === 'PLACE_CONSULT' && op === 'DISAGREES') fail(MSG.placeDisagrees);
  if (!(view.reason || '').trim()) fail(MSG.reasonNeeded);
  delete view.err;
}


function actDecideAsk(args) {
  const prop = proposalById(args.pid);
  checkDecision(prop, args.choice);
  if (args.choice === 'CHANGE') { view.dialog = 'confirm'; return; }
  actDecideDo(args);
}

function actDecideDo(args) {
  const t = T(), prop = proposalById(args.pid), p = me(), choice = args.choice;
  checkDecision(prop, choice);
  const rid = prop.rid, date = today(), reason = view.reason.trim();
  const first = t.assessments.find((a) => a.id === prop.evidence[0]), ex = explanationsOf(prop)[0];
  const dec = { id: nid('D'), pid: prop.id, rid, choice, reason, by: p.id, at: nowISO(), date, from: prop.from, to: prop.to, amend: false, opened: [], closed: [], news: '', noShare: noShareOf(prop),
    assessedOn: ymdOf(first.at), assessorId: first.by, explainedOn: ex.date, explainerId: ex.by };
  t.decisions.push(dec);
  if (choice === 'KEEP') prop.status = 'DECIDED_KEEP';
  if (choice === 'REASSESS') { prop.status = 'DRAFT'; prop.round += 1; }
  if (choice === 'CHANGE') { prop.status = 'DECIDED_CHANGE'; applyChange(prop, dec); }
  log(rid, `DECISION_${choice}`, p.id, { from: prop.from, to: prop.to });
  view.result = decisionResult(dec);
  view.dialog = ''; view.reason = ''; view.pid = prop.id;
}

function applyChange(prop, dec) {
  const t = T(), rid = prop.rid, eff = dec.date, to = stageOf(prop.to), cur = currentStage(rid);
  const feeAfter = to.mode === 'OWN' ? to.fee : cur.feeGroup;
  dec.amend = feeAfter !== cur.feeGroup;
  const live = t.assignments.find((a) => a.rid === rid && !a.to); if (live) live.to = addDays(eff, -1);
  t.assignments.push({ id: nid('G'), rid, stage: prop.to, from: eff, to: null, fee: feeAfter, decisionId: dec.id });
  if (to.mode === 'OWN') {
    const before = t.active[rid] ?? [], after = to.services.map((s) => s.code);
    dec.opened = after.filter((c) => !before.includes(c)); dec.closed = before.filter((c) => !after.includes(c));
    t.slots.filter((s) => s.rid === rid && !s.to && dec.closed.includes(s.svc)).forEach((s) => { s.to = addDays(eff, -1); });
    for (const code of dec.opened) for (const tm of serviceOf(code).times) t.slots.push({ id: nid('S'), rid, svc: code, wds: [...tm.wds], start: tm.start, end: tm.end, from: eff, to: null, src: 'DECISION', decisionId: dec.id, movedFrom: '' });
    t.active[rid] = after;
  }
  if (dec.amend) {
    t.amendments.push({ id: nid('M'), rid, decisionId: dec.id, to: prop.to, status: 'OPEN', by: dec.by, at: dec.at, ackBy: '', ackAt: '', note: '' });
    log(rid, 'AMENDMENT', dec.by, {});
  }
  recalcOverlaps(rid);
  dec.news = dec.noShare ? 'WITHHELD' : 'POSTED';
  if (!dec.noShare) api.family.publishHealthNews?.({ residentId: rid, kind: 'STAGE', listLine: to.newsListLine, title: tx('transitions.applyChange.title'), body: newsBody(dec), at: dec.at, source: 'transitions', recordedBy: dec.by });
  emit('transitions.CareStageChanged', { residentId: rid, decisionId: dec.id, stage: prop.to });
}

/** 결정 뒤 보이는 한 줄(copy 2-4) */
function decisionResult(dec) {
  if (dec.choice === 'KEEP') return tx('transitions.decisionResult.text.7');
  if (dec.choice === 'REASSESS') return tx('transitions.decisionResult.text.6');
  const to = stageOf(dec.to);
  const contract = dec.amend ? tx('transitions.decisionResult.text.5') : tx('transitions.decisionResult.text.4');
  const news = dec.noShare ? tx('transitions.decisionResult.text.3') : tx('transitions.decisionResult.text.2');
  return `${tx('transitions.decisionResult.text', { staffLabel: to.staffLabel, date: dec.date, contract, news })}`;
}

/** 보호자에게 가는 본문(copy 4절). 평가 내용, 의견, 결정한 까닭은 넣지 않는다 */
export function whoDecidedText(dec, afterDischarge = false) {
  const a = memberTag(dec.assessorId), e = memberTag(dec.explainerId), c = memberTag(dec.by);
  const seen = afterDischarge && dec.assessorId === dec.explainerId
    ? `${tx('transitions.whoDecidedText.text.4', { mdText: mdText(dec.assessedOn), a, josa: josa(a, tx('transitions.whoDecidedText.josa.2'), tx('transitions.whoDecidedText.josa')), mdText2: mdText(dec.explainedOn) })}`
    : dec.assessorId === dec.explainerId
    ? `${tx('transitions.whoDecidedText.text.3', { a, josa: josa(a, tx('transitions.whoDecidedText.josa.2'), tx('transitions.whoDecidedText.josa')), mdText: mdText(dec.assessedOn), mdText2: mdText(dec.explainedOn) })}`
    : `${tx('transitions.whoDecidedText.text.2', { a, josa: josa(a, tx('transitions.whoDecidedText.josa.2'), tx('transitions.whoDecidedText.josa')), mdText: mdText(dec.assessedOn), e, josa2: josa(e, tx('transitions.whoDecidedText.josa.2'), tx('transitions.whoDecidedText.josa')), mdText2: mdText(dec.explainedOn) })}`;
  return `${tx('transitions.whoDecidedText.text', { seen, c, josa: josa(c, tx('transitions.whoDecidedText.josa.2'), tx('transitions.whoDecidedText.josa')), mdText: mdText(dec.date) })}`;
}
function newsBody(dec) {
  const rid = dec.rid, name = residentName(rid), from = stageOf(dec.from), to = stageOf(dec.to), md = mdText(dec.date);
  const sawAfterDischarge = T().assessments.find((a) => ymdOf(a.at) === dec.assessedOn && a.rid === rid)?.trigger === 'AFTER_DISCHARGE';
  const head = {
    LIVING_SUPPORT: `${tx('transitions.newsBody.text.6', { name, md, memberLabel: from.memberLabel, memberLabel2: to.memberLabel, josaRo: josaRo(to.memberLabel) })}`,
    BASIC: `${tx('transitions.newsBody.text.6', { name, md, memberLabel: from.memberLabel, memberLabel2: to.memberLabel, josaRo: josaRo(to.memberLabel) })}`,
    WITH_EXTERNAL_CARE: `${tx('transitions.newsBody.text.8', { name, md, memberLabel: from.memberLabel, memberLabel2: to.memberLabel, josaRo: josaRo(to.memberLabel), v: to.memberDesc.split(tx('transitions.newsBody.split'))[0] })}`,
    PLACE_CONSULT: `${tx('transitions.newsBody.text.5')}`,
  }[to.code];
  const who = dec.to === 'PLACE_CONSULT' ? '' : whoDecidedText(dec, sawAfterDischarge);
  const keepList = activeServices(rid).map((s) => s.familyLabel).join(', ');
  const lines = {
    LIVING_SUPPORT: [`${tx('transitions.newsBody.text.4', { join: dec.opened.map((c) => serviceOf(c).familyLabel).join(', ') })}`, `${tx('transitions.newsBody.text')}`, dec.amend ? tx('transitions.newsBody.LIVINGSUPPORT') : ''],
    BASIC: [dec.closed.length ? `${tx('transitions.newsBody.text.3', { join: dec.closed.map((c) => serviceOf(c).familyLabel).join(', ') })}` : '', `${tx('transitions.newsBody.text')}`, dec.amend ? tx('transitions.newsBody.BASIC') : ''],
    WITH_EXTERNAL_CARE: [keepList ? `${tx('transitions.newsBody.text.2', { keepList })}` : '', `${tx('transitions.newsBody.text')}`],
    PLACE_CONSULT: [keepList ? `${tx('transitions.newsBody.text.2', { keepList })}` : '', `${tx('transitions.newsBody.text')}`],
  }[to.code];
  const foot = `${tx('transitions.newsBody.text.7', { memberTag: memberTag(dec.by), josa: josa(memberTag(dec.by), tx('transitions.newsBody.josa.2'), tx('transitions.newsBody.josa')) })}`;
  return [head, who, ...lines, foot].filter(Boolean).join('\n');
}

// ---------- 외부 돌봄 일정 (F10) ----------
function parseSlots(text) {
  return text.split(',').map((s) => s.trim()).filter(Boolean).map((s) => {
    const m = s.match(new RegExp(tx('transitions.parseSlots.pattern'), ''));
    need(m, MSG.badSlot);
    const pad = (h, mi) => `${String(h).padStart(2, '0')}:${mi}`;
    return { wd: T().weekdayShort.indexOf(m[1]), start: pad(m[2], m[3]), end: pad(m[4], m[5]) };
  });
}
const okDate = (s) => { need(/^\d{4}-\d{2}-\d{2}$/.test(s), MSG.badDate); return s; };

function actSaveExternal(args) {
  mustWrite();
  const t = T(), p = me(), rid = args.rid;
  const provider = (view.provider || '').trim();
  need(provider, MSG.fillAll);
  const times = parseSlots(view.times || '');
  need(times.length, MSG.badSlot);
  const start = okDate((view.start || '').trim()), end = (view.end || '').trim() ? okDate(view.end.trim()) : '';
  need(!end || end >= start, MSG.dateOrder);
  const ext = { id: nid('E'), rid, provider, type: view.careType || t.careTypes[0].code, times, start, end, source: view.source || 'RESIDENT', contact: (view.contact || '').trim(), noShare: !!view.noShare, noShareAt: view.noShare ? nowISO() : '', by: p.id, at: nowISO(), cancelled: false };
  t.externals.push(ext);
  log(rid, 'EXTERNAL', p.id, { ext: ext.id });
  recalcOverlaps(rid);
  view.extSaved = ext.id;
}

function actFixOverlap(args) {
  mustWrite();
  const t = T(), p = me(), ov = t.overlaps.find((o) => o.id === args.ov), method = view.fix || 'MOVE';
  need(ov && ov.status === 'OPEN', MSG.moreNone);
  const ext = t.externals.find((e) => e.id === ov.extId), sl = t.slots.find((s) => s.id === ov.slotId), svc = serviceOf(sl.svc);
  const done = (resolution, note, text) => {
    ov.status = 'RESOLVED'; ov.resolution = resolution; ov.note = note; ov.by = p.id; ov.at = nowISO();
    log(ov.rid, 'OVERLAP', p.id, { text });
    view.extMsg = text;
  };
  if (method === 'ASK_PROVIDER') { done('ASK_PROVIDER', '', tx('transitions.actFixOverlap.done')); return; }
  if (method === 'KEEP_BOTH') {
    const why = (view.keepWhy || '').trim(); need(why, MSG.keepBothReason);
    done('KEEP_BOTH', why, `${tx('transitions.actFixOverlap.text.5', { why })}`); return;
  }
  const last = okDate((view.o1 || '').trim()), first = okDate((view.o3 || '').trim()), nt = parseSlots(view.o2 || '');
  need(nt.length === 1, MSG.badSlot);
  const rest = commonDates(ext, { ...sl, to: last }, ov.wd);
  if (rest.length && !args.force) { view.remain = { last, dates: rest }; return; }
  delete view.remain;
  sl.to = last;
  const moved = { id: nid('S'), rid: ov.rid, svc: sl.svc, wds: [nt[0].wd], start: nt[0].start, end: nt[0].end, from: first, to: null, src: 'MOVED_FOR_OVERLAP', decisionId: sl.decisionId, movedFrom: sl.id };
  t.slots.push(moved);
  recalcOverlaps(ov.rid);
  const still = t.overlaps.find((o) => o.id === ov.id).status === 'OPEN';
  const note = `${tx('transitions.actFixOverlap.text.4', { shortLabel: svc.shortLabel, wdLong: wdLong(nt[0].wd), start: nt[0].start })}`;
  const text = `${tx('transitions.actFixOverlap.text.6', { shortLabel: svc.shortLabel, v: rest.length ? `${tx('transitions.actFixOverlap.text.3', { length: rest.length })}` : tx('transitions.actFixOverlap.text.2') })}`;
  if (!still) { ov.status = 'RESOLVED'; ov.resolution = 'MOVE_RESIDENCE_SERVICE'; ov.note = note; ov.by = p.id; ov.at = nowISO(); }
  log(ov.rid, 'OVERLAP', p.id, { text: `${tx('transitions.actFixOverlap.text', { note })}` });
  view.extMsg = text;
}

function actSuggestLast(args) {
  const ov = T().overlaps.find((o) => o.id === args.ov);
  view.o1 = addDays(ov.first, -1); delete view.remain;
}

// ---------- 단계 정의 새 버전 (TRN-12) ----------
const lines = (s) => String(s ?? '').split(/\r?\n/).map((x) => x.trim()).filter(Boolean);
/** 입력 칸의 지금 값. 손대지 않은 칸은 마지막 버전의 값 */
export function defForm(code) {
  const st = T().defVersions.at(-1).stages.find((x) => x.code === code);
  const f = { dStaff: st.staffLabel, dMember: st.memberLabel, dDesc: st.memberDesc, dServ: st.services.map((v) => v.staffLabel).join('\n'), dKeep: unchangedLines(st).join('\n'), dCond: (st.conds ?? []).join('\n'), dFee: st.mode === 'KEEP_CURRENT' ? 'KEEP' : st.fee, dFrom: '' };
  for (const k of Object.keys(f)) if (view[k] !== undefined) f[k] = view[k];
  return f;
}
const FEE_LABEL = { KEEP: () => tx('transitions.seed.servicesNote'), BASE: () => tx('transitions.seed.feeLabel.2'), LIVING_SUPPORT: () => tx('transitions.seed.feeLabel') };
export const feeOptions = () => ['LIVING_SUPPORT', 'BASE', 'KEEP'].map((k) => [k, FEE_LABEL[k]()]);
function actSaveDef(args) {
  delete view.err; delete view.defSaved;
  try { saveDef(args); } catch (e) { view.err = e.message; throw e; } // 입력 오류는 화면에도 띠로 남긴다
}
function saveDef(args) {
  need(EDIT_KEYS.includes(me().key), MSG.noDef);
  const t = T(), last = t.defVersions.at(-1), idx = last.stages.findIndex((s) => s.code === args.stage);
  need(idx >= 0, MSG.moreNone);
  const f = defForm(args.stage), old = last.stages[idx], staff = f.dStaff.trim(), member = f.dMember.trim(), desc = f.dDesc.trim();
  need(staff && member && desc, MSG.fillAll);
  need(!/\d/.test(staff + member) && !bannedFound(staff, member), MSG.nameRule); // 단계 이름에 번호와 병명을 쓰지 않는다
  const from = okDate(f.dFrom.trim());
  need(from > last.validFrom, `${tx('TRN-12.errOrder', { from: last.validFrom })}`);
  const keep = f.dFee === 'KEEP', serv = keep ? [] : lines(f.dServ), known = (l) => last.stages.flatMap((s) => s.services).find((v) => v.staffLabel === l);
  const services = serv.map((l) => known(l) ?? { code: nid('SV'), staffLabel: l, previewLabel: l, memberLabel: l, familyLabel: l, shortLabel: l, times: [] }); // 새 줄은 시간표 없는 서비스
  const ns = { ...structuredClone(old), staffLabel: staff, memberLabel: member, memberDesc: desc, mode: keep ? 'KEEP_CURRENT' : 'OWN', fee: keep ? '' : f.dFee, feeLabel: FEE_LABEL[f.dFee](),
    servicesNote: keep ? tx('transitions.seed.servicesNote') : services.length ? '' : tx('transitions.seed.servicesNote.2'), keepNote: keep ? tx('transitions.seed.keepNote') : '', services, unchangedLines: lines(f.dKeep), conds: lines(f.dCond) };
  if (staff !== old.staffLabel) ns.staffTo = `${staff}${josaRo(staff)}`;
  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  const parts = [
    ...services.filter((v) => !old.services.some((o) => o.code === v.code)).map((v) => tx('TRN-12.sumAdd', { x: v.staffLabel })),
    ...old.services.filter((o) => !services.some((v) => v.code === o.code)).map((o) => tx('TRN-12.sumDrop', { x: o.staffLabel })),
    ...[[staff !== old.staffLabel, tx('TRN-12.n1')], [member !== old.memberLabel, tx('TRN-12.n2')], [desc !== old.memberDesc, tx('TRN-12.n3')], [!same(ns.unchangedLines, unchangedLines(old)), tx('TRN-12.n5')],
      [!same(ns.conds, old.conds ?? []), tx('TRN-12.n6')], [ns.fee !== old.fee || ns.mode !== old.mode, tx('TRN-12.n7')]].filter(([on]) => on).map(([, item]) => tx('TRN-12.sumChange', { item })),
  ];
  need(parts.length, tx('TRN-12.noChange'));
  const nv = structuredClone(last);
  Object.assign(nv, { version: last.version + 1, validFrom: from, by: me().id, at: nowISO(), summary: `${tx('TRN-12.sum', { label: staff, parts: parts.join(', ') })}` });
  nv.stages[idx] = ns;
  t.defVersions.push(nv);
  ['dStaff', 'dMember', 'dDesc', 'dServ', 'dKeep', 'dCond', 'dFee', 'dFrom'].forEach((k) => { delete view[k]; });
  view.defSaved = from;
}

// ---------- 계약 변경 요청 확인 (TRN-08) ----------
function actAck(args) {
  need(ACK_KEYS.includes(me().key), MSG.noRole);
  const am = T().amendments.find((a) => a.id === args.id);
  need(am && am.status === 'OPEN', MSG.moreNone);
  Object.assign(am, { status: 'ACKNOWLEDGED', ackBy: me().id, ackAt: nowISO(), note: (view.memo || '').trim() });
  view.acked = am.id;
}

export const actions = {
  'trn.assess.save': actSaveAssessment,
  'trn.propose': actPropose,
  'trn.explain': actExplain,
  'trn.decide.ask': actDecideAsk,
  'trn.decide.do': actDecideDo,
  'trn.ext.save': actSaveExternal,
  'trn.ext.fix': actFixOverlap,
  'trn.ext.suggest': actSuggestLast,
  'trn.amend.ack': actAck,
  'trn.def.save': actSaveDef,
};

// ---------- 다른 모듈이 부르는 함수 ----------
const personaOf = (x) => (typeof x === 'string' ? PERSONAS[x] : x);
export const publicApi = {
  currentStage: (rid) => currentStage(rid),
  navCounts: () => {
    const n = T().proposals.filter((p) => p.status === 'AWAITING_DECISION').length + T().overlaps.filter((o) => o.status === 'OPEN').length;
    return n ? { 'TRN-02': n } : {};
  },
  /** 확인할 일 줄(TRN-08). 경리는 계약 변경 요청, 책임자는 7일 넘게 확인 전인 요청 */
  inbox: (persona) => {
    const p = personaOf(persona); if (!p) return [];
    const open = T().amendments.filter((a) => a.status === 'OPEN');
    if (p.key === 'ACCOUNTING') return open.map((a) => ({ text: `${tx('transitions.publicApi.text.2', { whoLabel: whoLabel(a.rid), staffLabel: stageOf(a.to).staffLabel, md2: md2(decisionOf(a.decisionId).date), name: PERSONAS[a.by].name })}`, href: `#/TRN-08?id=${a.id}` }));
    if (p.key === 'MANAGER') return open.filter((a) => dayDiff(decisionOf(a.decisionId).date, today()) > 7).map((a) => ({ text: `${tx('transitions.publicApi.text', { whoLabel: whoLabel(a.rid), md2: md2(decisionOf(a.decisionId).date) })}`, href: `#/TRN-08?id=${a.id}` }));
    return [];
  },
};

