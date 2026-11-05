import { tx } from '../lib/text.js';
import { loadData } from '../lib/text.js';
// AI 생활 비서(G). 회원 앱 AST-02~05, 운영 앱 AST-09·AST-11(대화 기록 탭 AST-10).
// 실제 LLM을 부르지 않는다. 질문 뜻은 규칙으로 고르고(ADR-G6 녹화 응답 자리), 답 문장은 코어 기록을 틀에 채워 만든다(ADR-G1).
// 비서는 계산하지 않는다. 금액·끼니·날짜는 api.core가 준 값 그대로 쓴다.
import { api, db, view, refuse, go, href, me, now, nowISO, esc, ic, fmt, denied, empty } from '../lib/kit.js';
import { RESIDENTS } from '../lib/people.js';
import { FIRST_SCREEN } from '../lib/frames.js';
const SEED = await loadData('assistant');


// --- 영문 코드 -> 화면 라벨 ---
const REASON = { HEALTH: tx('assistant.shared.HEALTH'), MONEY: tx('assistant.shared.MONEY'), CONTRACT: tx('assistant.shared.CONTRACT'), OUT_OF_SCOPE: tx('assistant.shared.OUTOFSCOPE'), MEMBER_ASKED: tx('assistant.shared.MEMBERASKED') };
const TOPIC = { BILLING: tx('AST-09.BILLING'), CONTRACT: tx('AST-09.CONTRACT.2') };
const PICK = { BILLING: tx('AST-05.BILLING'), CONTRACT: tx('AST-05.CONTRACT'), OTHER: tx('AST-05.OTHER') };
const STATUS = { NEW: tx('AST-09.NEW'), IN_PROGRESS: tx('AST-09.INPROGRESS'), DONE: tx('AST-09.map'), FORWARDED: tx('AST-09.map.2') };
const TOOL = { KEY_DATES: tx('AST-11.KEYDATES'), EXPLAIN_INVOICE: tx('AST-11.EXPLAININVOICE'), HANDOFF: tx('AST-11.HANDOFF') };
const RESULT = { OK: tx('AST-11.OK'), NO_DATA: tx('AST-11.NODATA'), ERROR: tx('AST-11.ERROR'), DENIED: tx('AST-11.DENIED') };
const DENY_LABEL = { OTHER_RESIDENT: tx('AST-11.OTHERRESIDENT.2'), NO_CONFIRMATION: tx('AST-11.NOCONFIRMATION.2'), EXPIRED: tx('AST-11.EXPIRED.2') };
const DENY_TITLE = { OTHER_RESIDENT: tx('AST-11.OTHERRESIDENT'), NO_CONFIRMATION: tx('AST-11.NOCONFIRMATION'), EXPIRED: tx('AST-11.EXPIRED') };
const BTN = { DATES: tx('assistant.shared.DATES'), CONTRACT_DATES: tx('assistant.shared.CONTRACTDATES'), BILL: tx('assistant.shared.BILL'), HANDOFF: tx('assistant.shared.HANDOFF'), DISPUTE: tx('assistant.shared.DISPUTE'), CALL: tx('assistant.shared.CALL'), YES: tx('assistant.shared.YES'), NO: tx('assistant.shared.NO') };
const BTN_INTENT = { DATES: 'DATES_BILLING', CONTRACT_DATES: 'DATES_CONTRACT', BILL: 'EXPLAIN_INVOICE' };
const REASON_NOTE = {
  MONEY: tx('AST-09.MONEY'),
  HEALTH: tx('AST-09.HEALTH'),
  CONTRACT: tx('AST-09.CONTRACT'),
};
const NOTE_INVEST = tx('AST-09.text.3');
const NOTE_MASK = tx('AST-09.text.2');
const MISS = [tx('AST-03.text.7'), tx('AST-03.text.6')];
const ERR_AI = tx('assistant.ERR_AI.text');
const HANDOFF_ROLES = ['FRONT', 'LIFE', 'CARE', 'MANAGER', 'HQ_ADMIN', 'HQ_OPS'];
const LOG_ROLES = ['MANAGER', 'HQ_ADMIN', 'HQ_OPS'];
const FILTER = { todo: ['NEW', 'IN_PROGRESS'], fwd: ['FORWARDED'], done: ['DONE'] };
const EXPIRE_MS = 5 * 60000; // 확인 토큰 기한 5분 [가설]
const CONV_IDLE_MS = 30 * 60000; // 마지막 턴 뒤 30분이면 대화를 닫는다 [가설]

// --- 질문 뜻 고르기: 규칙. 민감 규칙(s)이 먼저이고 LLM 연결과 상관없이 답한다(tech-design 4-1) ---
const RULES = [
  { i: 'INVEST', s: 1, re: new RegExp(tx('assistant.RULES.pattern.17'), '') },
  { i: 'MONEY', s: 1, re: new RegExp(tx('assistant.RULES.pattern.16'), '') },
  { i: 'HEALTH', s: 1, re: new RegExp(tx('assistant.RULES.pattern.15'), '') },
  { i: 'CONTRACT_CHANGE', s: 1, re: new RegExp(tx('assistant.RULES.pattern.14'), '') },
  { i: 'OTHER_PERSON', re: new RegExp(tx('assistant.RULES.pattern.13'), '') },
  { i: 'BILLING_DISPUTE', re: new RegExp(tx('assistant.RULES.pattern.12'), '') },
  { i: 'EXPLAIN_CHARGE', re: new RegExp(tx('assistant.RULES.pattern.11'), '') },
  { i: 'LATE_PAYMENT', re: new RegExp(tx('assistant.RULES.pattern.10'), '') },
  { i: 'DUE_DATE', re: new RegExp(tx('assistant.RULES.pattern.9'), '') },
  { i: 'NEXT_INVOICE_DATE', re: new RegExp(tx('assistant.RULES.pattern.8'), '') },
  { i: 'DATES_BILLING', re: new RegExp(tx('assistant.RULES.pattern.7'), '') },
  { i: 'DATES_CONTRACT', re: new RegExp(tx('assistant.RULES.pattern.6'), '') },
  { i: 'EXPLAIN_INVOICE', re: new RegExp(tx('assistant.RULES.pattern.5'), '') },
  { i: 'FACILITY_REQUEST', re: new RegExp(tx('assistant.RULES.pattern.4'), '') },
  { i: 'PROGRAM', re: new RegExp(tx('assistant.RULES.pattern.3'), '') },
  { i: 'OUT_OF_SCOPE', re: new RegExp(tx('assistant.RULES.pattern.2'), '') },
  { i: 'SMALL_TALK', re: new RegExp(tx('assistant.RULES.pattern'), '') },
];
function classify(text) {
  const r = RULES.find((x) => x.re.test(text));
  const m = text.match(new RegExp(tx('assistant.classify.pattern.2'), ''));
  return { i: r ? r.i : 'UNCLEAR', s: !!r?.s, slots: { month: m ? +m[1] : null, code: new RegExp(tx('assistant.classify.pattern'), '').test(text) ? 'RECURRING' : 'MEAL' } };
}

// --- 숫자 가림(ADR-G9): 4자리 이상 숫자는 [가린 번호]. 금액·날짜 단위가 바로 붙으면 둔다 ---
function mask(s) {
  let changed = false;
  const text = s.replace(/\d(?:[ .\-]?\d)*/g, (m, off) => {
    if (m.replace(/\D/g, '').length < 4 || new RegExp(tx('assistant.mask.pattern'), '').test(s.slice(off + m.length))) return m;
    changed = true;
    return tx('assistant.mask.replace');
  });
  return { text, changed };
}

// --- 도움 ---
const A = () => db.assistant;
const nid = () => ++A().seq;
const pad = (n) => String(n).padStart(2, '0');
const toISO = (d) => `${fmt.ymd(d)}T${fmt.hm(d)}:${pad(d.getSeconds())}`;
const addMs = (iso, ms) => toISO(new Date(new Date(iso).getTime() + ms));
const hm = (iso) => iso.slice(11, 16);
const hms = (iso) => iso.slice(11, 19);
const day = (iso) => iso.slice(0, 10);
const stamp = (iso) => `${day(iso)} ${hm(iso)}`;
const md = (s) => `${tx('AST-02.text.3', { v: +s.slice(5, 7), v2: +s.slice(8, 10) })}`;
const ymdK = (s) => `${tx('assistant.ymdK.text', { v: +s.slice(0, 4), md: md(s) })}`;
const place = (rid) => `${RESIDENTS[rid].room} ${RESIDENTS[rid].name}`;
const lastConv = (rid) => A().convs.filter((c) => c.resident === rid && c.actor === me().id).at(-1); // 대리인과 회원의 대화는 섞지 않는다(US-13)
// 대리인 범위는 코어를 그대로 따른다. 비서가 넓히지 않는다.
const repOf = (p) => (p.key === 'PROXY' ? api.core.repOf?.(p.residentId, p.name) : null);
const reasonText = (h) => (h.reason === 'MEMBER_ASKED' && TOPIC[h.topic] ? `${REASON[h.reason]} · ${TOPIC[h.topic]}` : REASON[h.reason]);

function openConv(rid, actor) {
  const last = lastConv(rid);
  if (last && nowISO() < addMs(last.last, CONV_IDLE_MS)) return last;
  const rep = repOf(me()), c = { id: nid(), resident: rid, actor, proxy: rep ? tx('AST-09.proxy', { name: rep.name, scope: rep.scopeText }) : '', at: nowISO(), last: nowISO(), unclear: 0, turns: [] };
  A().convs.push(c);
  return c;
}

// 도구 실행기 한 곳. 권한 검사와 기록을 여기서 한다(ADR-G2). 권한 검사는 코어 authorize()의 자리이고
// shortcut: 프로토타입이라 "대상 청구서의 주인 = 대화 대상 회원"만 본다. 실제 코어 authorize를 붙일 때 이 줄을 바꾼다.
function exec(c, o) {
  const call = { id: nid(), at: nowISO(), conv: c.conv, turn: c.turn, resident: c.resident, tool: o.tool, target: o.target || '', reason: o.reason || null, authz: 'ALLOW', deny: null, result: 'OK', demo: !!o.demo };
  let out = null;
  if (o.owner && o.owner !== c.resident) { call.authz = 'DENY'; call.deny = 'OTHER_RESIDENT'; call.result = 'DENIED'; }
  else if (o.deny) { call.authz = 'DENY'; call.deny = o.deny; call.result = 'DENIED'; }
  else {
    try { out = o.run(); if (out == null) call.result = 'NO_DATA'; } catch { call.result = 'ERROR'; }
  }
  A().calls.push(call);
  return { call, out };
}

// --- 코어 값 읽기 ---
function parts(inv) {
  const o = { rec: null, meal: null, skip: null, adj: [], svc: [] };
  for (const l of inv?.lines ?? []) {
    const p = l.plain ?? l, code = l.code ?? p.code ?? l.type, amount = Math.abs(p.amount ?? l.amount ?? 0);
    if (code === 'RECURRING') o.rec = { amount };
    else if (code === 'MEAL') o.meal = { amount, days: p.days, meals: p.meals ?? l.qty, unit: p.unitPrice };
    else if (code === 'MEAL_SKIP') o.skip = { amount, count: p.count ?? l.qty };
    else if (code === 'SERVICE') o.svc.push({ name: p.name ?? l.label, amount });
    else if (code === 'ADJUSTMENT') o.adj.push({ amount, period: p.adjustsPeriod, dir: p.direction });
  }
  return o;
}
const monthOf = (inv) => (inv?.month ? +inv.month.slice(5) : null);

// 낸 기록 갈래(tech-design 4-4). 코어가 paymentState를 주기 전에는 NOT_TRACKED다.
function dueLine(inv, due, alone) {
  const st = inv?.paymentState ?? 'NOT_TRACKED', m = monthOf(inv), late = day(nowISO()) > due;
  if (st === 'PAID') return `${tx('assistant.dueLine.text.6', { m })}`;
  if (st === 'PARTIAL') return `${tx('assistant.dueLine.text.5', { m })}`;
  if (!late) return alone ? `${tx('assistant.dueLine.text.4', { m, md: md(due) })}` : `${tx('assistant.dueLine.text.3', { md: md(due) })}`;
  if (st === 'UNPAID') return `${tx('assistant.dueLine.text.2', { m, md: md(due) })}`;
  return `${tx('assistant.dueLine.text', { m, md: md(due) })}`;
}

// --- 답 만들기. 값이 없는 줄은 만들지 않는다(줄마다 출처) ---
const ans = (o) => ({ kind: 'CARD', head: '', rows: [], hl: '', p: '', q: '', notes: [], src: '', btns: [], offer: null, ...o });
const nobill = () => ans({ head: tx('assistant.nobill.head'), p: tx('assistant.nobill.p'), btns: ['DATES', 'HANDOFF'] });

function billingDates(c, intent) {
  const rid = c.resident, kd = api.core.keyDates?.(rid), inv = api.core.latestInvoice?.(rid);
  const { out } = exec(c, { tool: 'KEY_DATES', target: tx('assistant.billingDates.target'), run: () => (kd || inv ? { kd, inv } : null) });
  const issued = kd?.lastInvoiceIssuedOn ?? inv?.issuedOn, due = kd?.lastInvoiceDueDate ?? inv?.dueOn, next = kd?.nextInvoiceScheduledOn;
  const m = monthOf(inv), btns = ['CONTRACT_DATES', 'BILL', 'HANDOFF'];
  if (!out || (!issued && !next)) return nobill();
  if (intent === 'NEXT_INVOICE_DATE') {
    return next
      ? ans({ head: `${tx('assistant.billingDates.text.2', { md: md(next) })}`, src: tx('assistant.billingDates.src'), btns })
      : ans({ head: tx('assistant.billingDates.head.3'), p: tx('assistant.billingDates.p'), btns });
  }
  if (intent === 'DUE_DATE') {
    return due ? ans({ head: dueLine(inv, due, true), src: `${tx('assistant.billingDates.text.4', { m })}`, btns }) : ans({ head: tx('assistant.billingDates.head.2'), p: tx('assistant.billingDates.p'), btns });
  }
  const rows = [];
  if (issued) rows.push({ l: `${tx('assistant.billingDates.text.3', { m, md: md(issued) })}` });
  if (due) rows.push({ l: dueLine(inv, due, false) });
  rows.push({ l: next ? `${tx('assistant.billingDates.text.2', { md: md(next) })}` : tx('assistant.billingDates.l') });
  return ans({ head: tx('assistant.billingDates.head'), rows, src: `${tx('assistant.billingDates.text', { m })}`, btns });
}

function contractDates(c) {
  if (repOf(me()) && !repOf(me()).scopes.includes('SIGN_CONTRACT')) return ans({ head: tx('AST-02.proxy.out', { rname: RESIDENTS[c.resident].name }), btns: ['BILL', 'HANDOFF'] });
  const kd = api.core.keyDates?.(c.resident);
  const { out } = exec(c, { tool: 'KEY_DATES', target: tx('assistant.contractDates.target'), run: () => kd });
  const end = kd?.contractEndDate ?? kd?.contractEnd;
  if (!out) return ans({ head: tx('assistant.contractDates.head.2'), p: tx('assistant.contractDates.p'), btns: ['BILL', 'HANDOFF'] });
  const rows = [];
  if (kd.moveInDate) rows.push({ l: `${tx('assistant.contractDates.text.3', { ymdK: ymdK(kd.moveInDate) })}` });
  if (end) rows.push({ l: `${tx('assistant.contractDates.text.2', { ymdK: ymdK(end) })}` });
  if (kd.moveOutDate) rows.push({ l: `${tx('assistant.contractDates.text', { ymdK: ymdK(kd.moveOutDate) })}` });
  return ans({ head: tx('assistant.contractDates.head'), rows, src: tx('assistant.contractDates.src'), btns: ['BILL', 'HANDOFF'] });
}

// 청구서 한 장을 읽는다. 말한 달이 있으면 그 달 청구서를 찾는다.
function readInvoice(c, month) {
  const latest = api.core.latestInvoice?.(c.resident);
  let inv = latest;
  if (month) {
    const y = now().getFullYear() - (month > now().getMonth() + 1 ? 1 : 0);
    inv = api.core.invoiceOf?.(c.resident, `${y}-${pad(month)}`);
  }
  const m = month || monthOf(latest);
  const { out } = exec(c, { tool: 'EXPLAIN_INVOICE', target: m ? `${tx('assistant.readInvoice.text', { m })}` : tx('assistant.readInvoice.target'), run: () => inv });
  return { inv: out, latest, month };
}

function explain(c, month) {
  const { inv, latest } = readInvoice(c, month);
  if (!inv) {
    if (!month || !latest) return nobill();
    const next = api.core.keyDates?.(c.resident)?.nextInvoiceScheduledOn, lm = monthOf(latest);
    return ans({ head: next ? `${tx('assistant.explain.text.8', { month, md: md(next) })}` : `${tx('assistant.explain.text.7', { month })}`, p: `${tx('assistant.explain.text.6', { lm })}`, btns: [{ k: 'BILL', label: `${tx('assistant.explain.text.5', { lm })}` }] });
  }
  const m = monthOf(inv), o = parts(inv), total = inv.total ?? inv.totalAmount, rows = [];
  if (o.rec) rows.push({ l: tx('assistant.explain.l.2'), v: fmt.won(o.rec.amount) });
  if (o.meal) rows.push({ l: o.meal.meals ? `${tx('assistant.explain.text.4', { m, meals: o.meal.meals })}` : tx('assistant.explain.l'), v: fmt.won(o.meal.amount) });
  o.svc.forEach((x) => rows.push({ l: x.name, v: fmt.won(x.amount) }));
  return ans({
    head: `${tx('assistant.explain.text.3', { m, won: fmt.won(total) })}`, rows,
    hl: o.skip ? `${tx('assistant.explain.text.2', { count: o.skip.count, won: fmt.won(o.skip.amount) })}` : '',
    notes: o.adj.filter((a) => a.period).map((a) => `${tx('assistant.explain.text.9', { v: +a.period.slice(5), won: fmt.won(a.amount), v2: a.dir === 'SUBTRACT' ? tx('assistant.explain.map.2') : tx('assistant.explain.map') })}`),
    src: `${tx('assistant.explain.text', { m })}`, btns: ['DISPUTE', 'HANDOFF'],
  });
}

function explainMeal(c, month, code) {
  const { inv } = readInvoice(c, month);
  const o = parts(inv), m = monthOf(inv);
  if (code === 'RECURRING' || !o.meal?.meals) return explain(c, month);
  return ans({
    head: o.meal.days ? `${tx('assistant.explainMeal.text.4', { m, days: o.meal.days, meals: o.meal.meals })}` : `${tx('assistant.explainMeal.text.3', { m, meals: o.meal.meals })}`,
    p: o.meal.unit ? `${tx('assistant.explainMeal.text.2', { num: fmt.num(o.meal.unit), won: fmt.won(o.meal.amount) })}` : '',
    src: `${tx('assistant.explainMeal.text', { m })}`, btns: ['DISPUTE', 'HANDOFF'],
  });
}

function disputeAnswer(c) {
  const { inv } = readInvoice(c, null), o = parts(inv), m = monthOf(inv);
  return ans({
    head: o.skip ? `${tx('assistant.disputeAnswer.text.3', { count: o.skip.count })}` : tx('assistant.disputeAnswer.p'),
    p: o.skip ? tx('assistant.disputeAnswer.p') : '', q: tx('assistant.disputeAnswer.q'), btns: ['YES', 'NO'],
    // 코어 문의 기능(F15)이 없어서 넘김(직접 요청, 청구서)으로 대신한다(copy 2-4)
    offer: { reason: 'MEMBER_ASKED', topic: 'BILLING', dispute: true, invoice: m ? `${tx('assistant.disputeAnswer.text.2', { m })}` : tx('assistant.disputeAnswer.invoice'), item: o.skip ? `${tx('assistant.disputeAnswer.text', { count: o.skip.count, won: fmt.won(o.skip.amount) })}` : '' },
  });
}

const OOS = { reason: 'OUT_OF_SCOPE', topic: 'OTHER' };
const FIXED = {
  PROGRAM: { head: tx('assistant.FIXED.head.10'), p: tx('assistant.FIXED.p.6'), btns: ['CALL', 'HANDOFF'] },
  OUT_OF_SCOPE: { head: tx('assistant.FIXED.head.9'), p: tx('assistant.FIXED.p.5'), btns: ['CALL', 'HANDOFF'] },
  LATE_PAYMENT: { head: tx('assistant.FIXED.head.8'), p: tx('assistant.FIXED.p.5'), btns: ['HANDOFF'] },
  HEALTH: { head: tx('assistant.FIXED.head.7'), p: tx('assistant.FIXED.p.4'), q: tx('assistant.FIXED.q.2'), btns: ['YES', 'CALL'], offer: { reason: 'HEALTH', topic: null } },
  MONEY: { head: tx('assistant.FIXED.head.6'), p: tx('assistant.FIXED.p.3'), q: tx('assistant.FIXED.q'), btns: ['YES', 'CALL'], offer: { reason: 'MONEY', topic: null } },
  CONTRACT_CHANGE: { head: tx('assistant.FIXED.head.5'), q: tx('assistant.FIXED.q'), btns: ['YES', 'NO'], offer: { reason: 'CONTRACT', topic: null } },
  INVEST: { head: tx('assistant.FIXED.head.4'), p: tx('assistant.FIXED.p.2'), btns: [{ k: 'YES', label: tx('assistant.FIXED.label') }, 'CALL'], offer: { reason: 'MONEY', topic: null, invest: true } },
  FACILITY_REQUEST: { head: tx('assistant.FIXED.head.3'), q: tx('assistant.FIXED.q'), btns: ['YES', 'CALL'], offer: OOS },
  SMALL_TALK: { head: tx('assistant.FIXED.head.2'), p: tx('assistant.FIXED.p'), btns: ['CALL'] },
  OTHER_PERSON: { head: tx('assistant.FIXED.head'), kind: 'OTHER_PERSON', btns: ['HANDOFF'] },
};
FIXED.PROGRAM.offer = OOS; FIXED.OUT_OF_SCOPE.offer = OOS;

function build(c, intent, slots) {
  switch (intent) {
    case 'DATES_BILLING': case 'NEXT_INVOICE_DATE': case 'DUE_DATE': return billingDates(c, intent);
    case 'DATES_CONTRACT': return contractDates(c);
    case 'EXPLAIN_INVOICE': return explain(c, slots.month);
    case 'EXPLAIN_CHARGE': return explainMeal(c, slots.month, slots.code);
    case 'BILLING_DISPUTE': return disputeAnswer(c);
    default: return ans(FIXED[intent]);
  }
}
const ansText = (a) => [a.head, ...a.rows.map((r) => (r.v ? `${r.l} ${r.v}` : r.l)), a.hl, a.p, ...a.notes].filter(Boolean).join(' ');

// --- 한 턴 ---
function takeTurn({ mode, button, raw }) {
  const p = me(), rid = p.residentId, conv = openConv(rid, p.id);
  let intent, slots = {}, text, masked = false, sens = false;
  if (mode === 'BUTTON') { intent = BTN_INTENT[button]; text = BTN[button]; }
  else {
    const m = mask(raw), r = classify(raw);
    text = m.text; masked = m.changed; intent = r.i; slots = r.slots; sens = r.s;
    if (!sens && A().router === 'LLM' && A().llmDown) intent = 'AI_ERROR'; // LLM 연결이 끊기면 라우터를 못 쓴다. 큰 버튼은 영향 없다.
  }
  const mt = { id: nid(), at: nowISO(), who: 'MEMBER', mode, text, masked, intent };
  conv.turns.push(mt);
  conv.unclear = intent === 'UNCLEAR' ? conv.unclear + 1 : 0;
  let answer;
  if (intent === 'UNCLEAR') answer = ans({ kind: 'UNCLEAR', head: MISS[conv.unclear > 1 ? 1 : 0] });
  else if (intent === 'AI_ERROR') answer = ans({ kind: 'ERROR', head: ERR_AI });
  else answer = build({ conv: conv.id, turn: mt.id, resident: rid }, intent, slots);
  conv.turns.push({ id: nid(), at: nowISO(), who: 'ASSISTANT', intent, answer: { ...answer, text: ansText(answer) } });
  conv.last = nowISO();
  return { unclear: intent === 'UNCLEAR' ? conv.unclear : 0 };
}

// --- 확인 토큰과 넘김(tech-design 3-1, 3-2) ---
function issue(rid, o) {
  const conv = lastConv(rid), mt = conv?.turns.filter((t) => t.who === 'MEMBER').at(-1);
  const cf = { id: nid(), conv: conv?.id ?? null, turn: mt?.id ?? null, resident: rid, actor: me().id, status: 'ISSUED', issued: nowISO(), expires: addMs(nowISO(), EXPIRE_MS), dispute: false, invoice: '', item: '', invest: false, masked: false, answer: '', ...o };
  A().confirms.push(cf);
  return cf;
}
const findTurn = (id) => A().convs.flatMap((c) => c.turns.map((t, i) => ({ t, prev: c.turns[i - 1], conv: c }))).find((x) => x.t.id === id);

function accept(cf) {
  if (cf.actor !== me().id) refuse(tx('assistant.accept.refuse.2'));
  if (cf.status === 'USED') return;
  const c = { conv: cf.conv, turn: cf.turn, resident: cf.resident };
  if (cf.status !== 'ISSUED' || nowISO() > cf.expires) {
    cf.status = 'EXPIRED';
    exec(c, { tool: 'HANDOFF', reason: cf.reason, deny: 'EXPIRED' });
    refuse(tx('assistant.accept.refuse'));
  }
  const h = { id: nid(), conv: cf.conv, turn: cf.turn, resident: cf.resident, at: nowISO(), reason: cf.reason, topic: cf.topic, message: cf.message, answer: cf.answer, masked: cf.masked, invest: cf.invest, confirmedAt: nowISO(), status: 'NEW', ref: null, startedBy: null, startedAt: null, doneBy: null, doneAt: null, note: '' };
  exec(c, { tool: 'HANDOFF', reason: cf.reason, run: () => { A().handoffs.push(h); return h; } });
  cf.status = 'USED';
  // 도구 밖 질문·직접 요청(그 밖의 일)은 생활 요청으로 보낸다. 보내지 못하면 NEW로 남는다(3-2).
  if ((h.reason === 'OUT_OF_SCOPE' || h.reason === 'MEMBER_ASKED') && (h.topic === 'OTHER' || !h.topic)) {
    try {
      const r = api.requests.intakeFromAssistant?.({ residentId: h.resident, handoffId: h.id, text: h.message });
      const ref = r?.id ?? r;
      if (ref) { h.status = 'FORWARDED'; h.ref = ref; }
    } catch { /* 보내지 못해도 넘김은 남는다 */ }
  }
}

// --- 회원 화면 ---
const mark = `<span class="ai-mark">${tx('assistant.shared.span')}</span>`;
const dev = (body) => `<section class="stack" aria-label="${tx('assistant.shared.ariaLabel')}"><h2 class="t-label-lg muted">${tx('assistant.shared.ariaLabel')}</h2>${body}</section>`;
const devBtn = (act, label, data = '') => `<button class="btn btn-ghost btn-sm" type="button" data-act="${act}"${data}>${label}</button>`;
const bigBtn = (b, turnId) => {
  const k = b.k ?? b, label = b.label ?? BTN[k];
  if (k === 'CALL') return `<a class="btn btn-secondary btn-block" href="tel:0200000000">${label}</a>`;
  if (k === 'HANDOFF') return `<a class="btn btn-secondary btn-block" href="${href('AST-05', { pick: 1 })}">${label}</a>`;
  if (k === 'NO') return `<a class="btn btn-secondary btn-block" href="${href('AST-05', { no: 1 })}">${label}</a>`;
  if (k === 'YES') return `<button class="btn btn-secondary btn-block" type="button" data-act="ast.offer" data-t="${turnId}">${label}</button>`;
  if (k === 'DISPUTE') return `<button class="btn btn-secondary btn-block" type="button" data-act="ast.dispute">${label}</button>`;
  return `<button class="btn btn-secondary btn-block" type="button" data-act="ast.btn" data-b="${k}">${label}</button>`;
};
const tile = (icon, label, attrs) => `<li${attrs.cls || ''}><a class="cell" href="${attrs.href || '#'}"${attrs.act || ''}>${ic(icon)}<span class="body"><span class="title">${label}</span></span>${ic('chevron-right')}</a></li>`;
const bigTile = (icon, k) => tile(icon, BTN[k], { act: ` data-act="ast.btn" data-b="${k}"` });
const handoffTile = (cls) => tile('send', BTN.HANDOFF, { href: href('AST-05', { pick: 1 }), cls });
const tiles3 = () => `<ul class="list card flush tiles tiles-btn">${bigTile('calendar', 'DATES')}${bigTile('file-text', 'BILL')}${handoffTile(' class="span-all"')}</ul>`;
const alertInfo = (msg, cls = '') => `<div class="alert${cls}" role="status">${ic(cls ? 'circle-alert' : 'info')}<p class="t-body-lg">${msg}</p></div>`;

function member(fn) {
  return (params) => {
    const p = me();
    const rep = repOf(p);
    if (p.key !== 'MEMBER' && !rep?.scopes.includes('VIEW_INVOICE')) { go('COM-07'); return ''; }
    if (rep && rep.validUntil < nowISO().slice(0, 10)) return denied(tx('AST-02.proxy.ended', { rname: RESIDENTS[p.residentId].name }), tx('assistant.shared.denied'), href('COM-07'));
    if (api.family.aiNoticeAcked?.(p.residentId, rep ? p.id : undefined) !== true) return denied(tx('assistant.shared.denied.4'), tx('assistant.shared.denied.3'), href('FAM-05')); // 확인 못 하면 닫힘(ADR-G5)
    return fn(params, p.residentId);
  };
}

function convTitle(c) {
  const e = A().calls.find((k) => k.conv === c.id && k.tool === 'EXPLAIN_INVOICE' && k.result === 'OK');
  if (e) return `${tx('AST-02.text.2', { target: e.target })}`;
  return A().calls.some((k) => k.conv === c.id && k.tool === 'KEY_DATES') ? BTN.DATES : tx('AST-02.text');
}

function ast02(_, rid) {
  const past = A().convs.filter((c) => c.resident === rid && c.actor === me().id && c.turns.length).reverse(), rep = repOf(me()), rname = esc(RESIDENTS[rid].name);
  const rows = past.map((c) => `<li><div class="cell"><span class="body"><span class="title">${esc(convTitle(c))}</span><span class="sub">${md(c.at)}${A().handoffs.some((h) => h.conv === c.id) ? tx('AST-02.map') : ''}</span></span></div></li>`).join('');
  return `<section class="stack">
      <h1 class="t-title3">${tx('AST-02.h1')}</h1>
      ${mark}
      ${rep ? `<p class="t-body-lg">${tx('AST-02.proxy.p', { name: esc(me().name), rname })}</p><div class="scope">${ic('eye')}<p class="t-body-lg">${tx('COM-07.p.2', { who: rname })}</p></div><p class="t-body-lg">${tx('AST-02.proxy.p.2')}</p>`
    : `<p class="t-body-lg">${tx('AST-02.p.2', { name: esc(me().name) })}</p>
      <p class="t-body-lg">${tx('AST-02.p.3')}</p>`}
    </section>
    <ul class="list card flush tiles tiles-btn">
      ${tile('x1', tx('AST-02.tile'), { href: href('AST-03') })}${bigTile('calendar', 'DATES')}${bigTile('file-text', 'BILL')}${handoffTile('')}
    </ul>
    <section class="stack" aria-labelledby="past-h">
      <h2 id="past-h" class="t-heading2">${tx('AST-02.h2')}</h2>
      <p class="t-body-lg">${tx('AST-02.p.4')}</p>
      ${rows ? `<ul class="list card flush">${rows}</ul>` : `<p class="t-body-lg">${tx('AST-02.p')}</p>`}
      <p class="t-body-lg">${tx('AST-02.p.5')}</p>
    </section>
    <div class="stack"><a class="btn btn-ghost btn-md" href="${href('FAM-05')}">${tx('AST-02.btn')}</a></div>`;
}

const EXAMPLES = [tx('AST-03.text.5'), tx('AST-03.text.4'), tx('AST-03.text.3'), tx('AST-03.text.2'), tx('AST-03.text')];

function ast03(params) {
  const a = A(), miss = +params.miss;
  const rail = dev(`<p class="t-body-md muted">${tx('AST-03.p.3')}</p>
    ${a.router === 'LLM' ? devBtn('ast.router', tx('AST-03.devBtn.4'), ' data-v="REPLAY"') : devBtn('ast.router', tx('AST-03.devBtn.3'), ' data-v="LLM"')}
    ${a.router === 'LLM' ? (a.llmDown ? devBtn('ast.down', tx('AST-03.devBtn.2'), ' data-v="0"') : devBtn('ast.down', tx('AST-03.devBtn'), ' data-v="1"')) : ''}`);
  if (miss) {
    return { rail, main: `<h1 class="t-title3">${tx('AST-03.title')}</h1>
    ${alertInfo(MISS[miss > 1 ? 1 : 0])}
    ${miss > 1 ? '' : `<a class="btn btn-secondary btn-block" href="${href('AST-03')}">${ic('x1')}${tx('AST-03.btn.2')}</a>`}
    ${tiles3()}` };
  }
  return { rail, main: `<h1 class="t-title3">${tx('AST-03.title')}</h1>
    <section class="card" aria-label="${tx('AST-03.ariaLabel')}">
      <form class="stack" data-act="ast.say">
        <div class="row" style="gap: 12px; flex-wrap: nowrap; align-items: flex-start;">
          ${ic('x1')}
          <p class="t-body-lg" role="status">${tx('AST-03.p')}</p>
        </div>
        <div class="progress" role="progressbar" aria-label="${tx('AST-03.ariaLabel.2')}"><span style="width: 40%"></span></div>
        <div class="field"><label class="sr-only" for="utter">${tx('AST-03.label')}</label><input id="utter" class="input" name="utter" data-bind="utter" autocomplete="off"></div>
        <button class="btn btn-primary btn-block" type="submit">${tx('AST-03.btn')}</button>
      </form>
    </section>
    <section class="stack" aria-label="${tx('AST-03.ariaLabel.3')}">
      <p class="t-body-lg">${tx('AST-03.p.2')}</p>
      ${EXAMPLES.map((s) => `<button class="btn btn-secondary btn-block" type="button" data-act="ast.say" data-utter="${esc(s)}">${esc(s)}</button>`).join('')}
    </section>` };
}

function answerCard(a, turnId) {
  const li = a.rows.map((r) => `<li class="money"><span>${esc(r.l)}</span>${r.v ? `<b>${r.v}</b>` : ''}</li>`).join('');
  const pq = [a.p, a.q].filter(Boolean).join(' ');
  return `<section class="card" aria-label="${tx('AST-04.ariaLabel.2')}">
      ${mark}
      <h2 class="t-heading1">${esc(a.head)}</h2>
      ${li ? `<ul class="list">${li}</ul>` : ''}
      ${a.hl ? `<p class="t-body-lg"><span class="hl">${esc(a.hl)}</span></p>` : ''}
      ${pq ? `<p class="t-body-lg">${esc(pq)}</p>` : ''}
      ${a.notes.map((n) => `<p class="t-body-lg">${esc(n)}</p>`).join('')}
      ${a.src ? `<p class="t-body-md muted">${esc(a.src)}</p>` : ''}
      <div class="stack">${a.btns.map((b) => bigBtn(b, turnId)).join('')}</div>
    </section>`;
}

function ast04(_, rid) {
  const conv = lastConv(rid), i = conv ? conv.turns.map((t) => t.who).lastIndexOf('ASSISTANT') : -1;
  if (i < 0) { go('AST-02'); return ''; }
  const t = conv.turns[i], prev = conv.turns[i - 1], a = t.answer;
  if (a.kind === 'ERROR') return `<h1 class="sr-only">${tx('AST-04.h1')}</h1>${alertInfo(a.head, ' alert-err')}${tiles3()}`;
  if (a.kind === 'UNCLEAR') { go('AST-03', { miss: conv.unclear }); return ''; }
  const heard = prev?.mode === 'TEXT' ? `<section class="card" aria-label="${tx('AST-04.ariaLabel')}"><p class="t-body-lg">${tx('AST-04.p', { text: esc(prev.text) })}</p><a class="btn btn-secondary btn-block" href="${href('AST-03')}">${ic('x1')}${tx('AST-04.btn')}</a></section>` : '';
  const rail = a.kind === 'OTHER_PERSON' ? dev(devBtn('ast.denyOther', tx('AST-04.devBtn'))) : '';
  return { rail, main: `<h1 class="sr-only">${tx('AST-04.title')}</h1>${heard}${answerCard(a, t.id)}` };
}

function ast05(params, rid) {
  const back = `<a class="btn btn-secondary btn-block" href="${href('AST-05', { pick: 1 })}">${BTN.HANDOFF}</a>`;
  const cf = params.c ? A().confirms.find((x) => x.id === +params.c && x.resident === rid) : null;
  if (params.no || cf?.status === 'DECLINED') {
    return `${alertInfo(cf?.dispute ? tx('AST-05.alertInfo.3') : tx('AST-05.alertInfo.2'))}${back}`;
  }
  if (!cf) {
    return `<section class="card" aria-labelledby="ask-h"><h1 id="ask-h" class="t-title3">${tx('AST-05.h1.2')}</h1>
      <p class="t-body-lg">${tx('AST-05.p.5')}</p>
      <div class="stack">${['BILLING', 'CONTRACT', 'OTHER'].map((k) => `<button class="btn btn-secondary btn-block" type="button" data-act="ast.pick" data-topic="${k}">${PICK[k]}</button>`).join('')}
        <a class="btn btn-secondary btn-block" href="${href('AST-03')}">${ic('x1')}${tx('AST-05.btn')}</a></div></section>`;
  }
  if (cf.status === 'USED') {
    return { rail: dev(devBtn('ast.denyToken', tx('AST-05.devBtn'))), main: `<div class="alert alert-ok" role="status">${ic('check')}
      <div class="stack" style="gap: 4px;"><h1 class="t-heading2">${tx('AST-05.h1')}</h1><p class="t-body-lg">${tx('AST-05.p.3')}</p></div></div>
      <p class="t-body-lg">${tx('AST-05.p.4')}</p>` };
  }
  if (cf.status === 'EXPIRED' || nowISO() > cf.expires) {
    return `${alertInfo(tx('AST-05.alertInfo'))}
      <button class="btn btn-primary btn-block" type="button" data-act="ast.again" data-id="${cf.id}">${tx('AST-05.btn.2')}</button>`;
  }
  const yn = `<div class="stack"><button class="btn btn-primary btn-block" type="button" data-act="ast.accept" data-id="${cf.id}">${BTN.YES}</button><button class="btn btn-secondary btn-block" type="button" data-act="ast.decline" data-id="${cf.id}">${BTN.NO}</button></div>`;
  if (cf.dispute) {
    return `<section class="card" aria-labelledby="ask-h">${mark}
      <p class="t-body-lg">${tx('AST-05.p.8')}</p>
      <h1 id="ask-h" class="t-title3">${tx('AST-05.h1.4')}</h1>
      <p class="t-body-lg">${tx('AST-05.p.9', { invoice: esc(cf.invoice) })}</p>
      ${cf.item ? `<p class="t-body-lg">${tx('AST-05.p.2', { item: esc(cf.item) })}</p>` : ''}
      ${yn}</section>`;
  }
  return `<section class="card" aria-labelledby="ask-h">
      <h1 id="ask-h" class="t-title3">${tx('AST-05.h1.3')}</h1>
      <p class="t-body-lg">${tx('AST-05.p.6', { message: esc(cf.message) })}</p>
      <p class="t-body-lg">${tx('AST-05.p.7')}</p>
      ${repOf(me()) ? `<p class="t-body-lg">${tx('AST-05.proxy', { name: esc(me().name), rname: esc(RESIDENTS[rid].name) })}</p>` : ''}
      ${cf.masked ? `<p class="t-body-lg">${tx('AST-05.p')}</p>` : ''}
      ${yn}</section>`;
}

// --- 직원 화면 ---
const noAccess = () => denied(tx('assistant.shared.denied.2'), tx('assistant.shared.denied'), href(FIRST_SCREEN[me().key]));
const stageHead = (title) => `<div class="page-head"><h1 class="t-title2">${title}</h1></div>`;
const kvp = (pairs) => `<dl class="kvp">${pairs.map(([k, v]) => `<dt>${k}</dt><dd>${esc(v)}</dd>`).join('')}</dl>`;
const note = (msg) => `<div class="alert" role="status">${ic('info')}<p>${esc(msg)}</p></div>`;

function handoffPanel(h, f) {
  const conv = `<p><a href="#" data-act="ast.openConv" data-id="${h.conv}">${tx('AST-09.a')}</a></p>`;
  const head = `<h2 class="t-heading2">${tx('AST-09.h2', { v: STATUS[h.status], place: esc(place(h.resident)) })}</h2>`;
  if (h.status === 'FORWARDED') {
    return `<aside class="side-panel" aria-label="${tx('AST-09.ariaLabel.3')}"><span class="grab" aria-hidden="true"></span>${head}
      ${note(tx('AST-09.note'))}
      <div class="panel-act"><a class="btn btn-secondary btn-sm" href="${href('REQ-12', { id: h.ref })}">${tx('AST-09.btn')}</a></div>
      ${kvp([[tx('AST-09.th.4'), reasonText(h)]])}</aside>`;
  }
  const pairs = [[tx('AST-09.text'), stamp(h.at)], [tx('AST-09.th.4'), reasonText(h)]];
  const proxy = A().convs.find((c) => c.id === h.conv)?.proxy;
  if (proxy) pairs.push([tx('AST-09.proxy.k'), proxy]);
  if (h.startedBy) pairs.push([tx('AST-09.btn.2'), `${h.startedBy} ${hm(h.startedAt)}`]);
  if (h.doneBy) pairs.push([tx('AST-09.map'), `${h.doneBy} ${hm(h.doneAt)}`], [tx('AST-09.push'), h.note]);
  const reasonNote = h.invest ? NOTE_INVEST : REASON_NOTE[h.reason];
  const act = h.status === 'NEW'
    ? `<button class="btn btn-primary btn-sm" type="button" data-act="ast.start" data-id="${h.id}">${tx('AST-09.btn.2')}</button>`
    : h.status === 'IN_PROGRESS'
      ? `<form class="stack" data-act="ast.done" data-id="${h.id}"><div class="field"><label for="note">${tx('AST-09.label')}</label><p class="hint">${tx('AST-09.p.3')}</p>
          <textarea id="note" class="input" name="note" data-bind="note" data-live></textarea></div>
          <div class="panel-act"><button class="btn btn-primary btn-sm" type="submit"${(view.note || '').trim() ? '' : ' disabled'}>${tx('AST-09.map')}</button></div></form>`
      : '';
  return `<aside class="side-panel" aria-label="${tx('AST-09.ariaLabel.2', { v: STATUS[h.status] })}"><span class="grab" aria-hidden="true"></span>${head}
    ${kvp(pairs)}
    <p><b>${tx('AST-09.b')}</b> "${esc(h.message)}"</p>
    ${h.masked ? `<p class="hint">${NOTE_MASK}</p>` : ''}
    <p><b>${tx('AST-09.b.2')}</b> "${esc(h.answer)}"</p>
    <p><b>${tx('AST-09.b.3')}</b> ${hm(h.confirmedAt)} [${BTN.YES}]</p>
    ${conv}
    ${reasonNote ? note(reasonNote) : ''}
    ${act ? `<div class="panel-act">${act}</div>` : ''}</aside>`;
}

function ast09(params) {
  const p = me();
  if (!HANDOFF_ROLES.includes(p.key)) return noAccess();
  const f = FILTER[params.f] ? params.f : 'todo';
  const list = A().handoffs.filter((h) => FILTER[f].includes(h.status) && (!p.siteId || RESIDENTS[h.resident].siteId === p.siteId)).sort((a, b) => (a.at < b.at ? 1 : -1));
  const sel = list.find((h) => h.id === +params.id);
  const seg = [['todo', tx('AST-09.map.3')], ['fwd', tx('AST-09.map.2')], ['done', tx('AST-09.map')]].map(([k, t]) => `<a href="${href('AST-09', { f: k })}"${k === f ? ' aria-current="true"' : ''}>${t}</a>`).join('');
  const lead = f === 'todo'
    ? `<p class="muted">${tx('AST-09.p.2')}</p>`
    : f === 'fwd' ? `<p class="muted">${tx('AST-09.p')}</p>` : '';
  const rows = list.map((h) => `<tr${h === sel ? ' class="sel"' : ''}><td data-label="${tx('AST-09.th')}"><span class="badge">${STATUS[h.status]}</span></td><td class="num" data-label="${tx('AST-09.th.2')}">${stamp(h.at)}</td><td data-label="${tx('AST-09.th.3')}">${tx('AST-09.td', { place: esc(place(h.resident)) })}</td><td data-label="${tx('AST-09.th.4')}">${reasonText(h)}</td>
      <td>${h.status === 'FORWARDED' ? `<a class="btn btn-ghost btn-sm" href="${href('REQ-12', { id: h.ref })}">${tx('AST-09.btn')}</a>` : ''}<a class="btn btn-ghost btn-sm" href="#" data-act="ast.open" data-id="${h.id}" data-f="${f}">${tx('AST-09.btn.3')}</a></td></tr>`).join('');
  const table = list.length
    ? `<div class="tbl reflow"><table aria-label="${tx('AST-09.title')}"><thead><tr><th>${tx('AST-09.th')}</th><th>${tx('AST-09.th.2')}</th><th>${tx('AST-09.th.3')}</th><th>${tx('AST-09.th.4')}</th><th></th></tr></thead><tbody>${rows}</tbody></table></div>`
    : empty(f === 'fwd' ? tx('AST-09.empty.2') : tx('AST-09.empty'));
  const left = `<div class="stack lg"><div class="seg" role="group" aria-label="${tx('AST-09.ariaLabel')}">${seg}</div>${lead}${table}</div>`;
  return `${stageHead(tx('AST-09.title'))}${sel ? `<div class="with-panel">${left}${handoffPanel(sel, f)}</div>` : left}<p class="demo-note">${tx('AST-09.p.4')}</p>`;
}

const authzText = (c) => (c.authz === 'ALLOW' ? tx('AST-11.text.2') : tx('AST-11.text.6'));
const targetText = (c) => (c.tool === 'HANDOFF' ? (c.authz === 'DENY' ? tx('AST-11.text.5') : `${tx('AST-11.text.4', { v: REASON[c.reason] })}`) : c.target);
const resultCell = (c) => (c.authz === 'DENY' ? `<span class="badge grade-check">${DENY_LABEL[c.deny]}</span>` : `${c.tool === 'HANDOFF' ? tx('AST-11.text.3') : tx('AST-11.text.2')}, ${RESULT[c.result]}`);
const inRange = (iso, from, to) => iso >= from && iso <= to;
const rate = (conv, handed) => (conv ? Math.round((handed / conv) * 100) : 0);
const handedConvs = (convs) => convs.filter((c) => A().handoffs.some((h) => h.conv === c.id)).length;

function callsTab() {
  const d = day(nowISO()), calls = A().calls.filter((c) => day(c.at) === d), convs = A().convs.filter((c) => day(c.at) === d), handed = handedConvs(convs);
  const denied2 = calls.filter((c) => c.authz === 'DENY');
  const who = [...new Set(calls.map((c) => RESIDENTS[c.resident].room))];
  const strip = `<div class="stat-strip four"><div><span class="k">${tx('AST-11.span.3')}</span><span class="v">${convs.length}<span class="u">${tx('AST-11.span.4')}</span></span></div><div><span class="k">${tx('AST-11.span.5')}</span><span class="v">${calls.length}<span class="u">${tx('AST-11.span.6')}</span></span></div><div><span class="k">${tx('AST-11.span.7')}</span><span class="v">${denied2.length}<span class="u">${tx('AST-11.span.4')}</span></span></div><div><span class="k">${tx('AST-11.span.8')}</span><span class="v">${rate(convs.length, handed)}<span class="u">%</span><span class="sub">${tx('AST-11.sub', { length: convs.length, handed })}</span></span></div></div>`;
  const rows = calls.map((c) => `<tr${c.authz === 'DENY' ? ' class="sel"' : ''}><td class="num" data-label="${tx('AST-11.th')}">${hms(c.at)}</td><td data-label="${tx('AST-11.th.3')}">${TOOL[c.tool]}</td><td data-label="${tx('AST-11.th.4')}">${esc(targetText(c))}${c.demo ? ` <span class="badge">${tx('AST-11.span.2')}</span>` : ''}</td><td data-label="${tx('AST-11.th.5')}">${resultCell(c)}</td></tr>`).join('');
  const lines = denied2.map((c) => `<div class="alert" role="status">${ic('info')}<p><b>${hms(c.at)} · ${DENY_TITLE[c.deny]}</b><br>${c.deny === 'OTHER_RESIDENT' ? `${tx('AST-11.text', { room: esc(RESIDENTS[c.resident].room), target: esc(c.target) })}` : c.deny === 'NO_CONFIRMATION' ? tx('AST-11.map.2') : tx('AST-11.map')}</p></div>`).join('');
  const panel = denied2.length ? `<aside class="side-panel" aria-label="${tx('AST-11.ariaLabel.3')}"><span class="grab" aria-hidden="true"></span><h2 class="t-heading2">${tx('AST-11.ariaLabel.3')}</h2>${lines}<p class="hint">${tx('AST-11.p.5')}</p></aside>` : '';
  const left = `<div class="stack lg">${strip}
    <p class="hint">${tx('AST-11.p.7', { handed, length: convs.length })}</p>
    <p>${tx('AST-11.p.8')}</p>
    ${calls.length ? `<p class="muted">${tx('AST-11.p.4', { d, join: esc(who.join(', ')) })}</p>
    <div class="tbl reflow"><table aria-label="${tx('AST-11.title')}"><thead><tr><th>${tx('AST-11.th')}</th><th>${tx('AST-11.th.3')}</th><th>${tx('AST-11.th.4')}</th><th>${tx('AST-11.th.5')}</th></tr></thead><tbody>${rows}</tbody></table></div>` : empty(tx('AST-11.empty.2'))}</div>`;
  return panel ? `<div class="with-panel">${left}${panel}</div>` : left;
}

function convTab(params) {
  const a = A(), today = day(nowISO());
  const dates = [...new Set([today, ...a.convs.map((c) => day(c.at))])].sort().reverse();
  const f1 = view.f1 ?? today, f2 = view.f2 ?? 'ALL', f3 = view.f3 ?? 'ALL', f4 = view.f4 ?? 'ALL';
  const residents = [...new Set(a.convs.map((c) => c.resident))];
  const calls = (c) => a.calls.filter((k) => k.conv === c.id);
  const list = a.convs.filter((c) => day(c.at) === f1 && (f2 === 'ALL' || c.resident === f2) && (f3 === 'ALL' || (f3 === 'YES') === a.handoffs.some((h) => h.conv === c.id)) && (f4 === 'ALL' || calls(c).some((k) => k.tool === f4)));
  const opt = (v, cur, label) => `<option value="${v}"${v === cur ? ' selected' : ''}>${label}</option>`;
  const filters = `<form class="log-filters" aria-label="${tx('AST-11.ariaLabel.4')}"><div class="field"><label for="f1">${tx('AST-11.label')}</label><select id="f1" class="input" data-bind="f1" data-live>${dates.map((d) => opt(d, f1, d)).join('')}</select></div>
    <div class="field"><label for="f2">${tx('AST-11.rec.3')}</label><select id="f2" class="input" data-bind="f2" data-live>${opt('ALL', f2, tx('AST-11.opt.2'))}${residents.map((r) => opt(r, f2, esc(place(r)))).join('')}</select></div>
    <div class="field"><label for="f3">${tx('AST-11.label.2')}</label><select id="f3" class="input" data-bind="f3" data-live>${opt('ALL', f3, tx('AST-11.opt.2'))}${opt('YES', f3, tx('AST-11.opt.4'))}${opt('NO', f3, tx('AST-11.opt.3'))}</select></div>
    <div class="field"><label for="f4">${tx('AST-11.th.3')}</label><select id="f4" class="input" data-bind="f4" data-live>${opt('ALL', f4, tx('AST-11.opt.2'))}${opt('KEY_DATES', f4, TOOL.KEY_DATES)}${opt('EXPLAIN_INVOICE', f4, TOOL.EXPLAIN_INVOICE)}${opt('HANDOFF', f4, TOOL.HANDOFF)}${opt('CREATE_INQUIRY', f4, tx('AST-11.opt'))}</select></div></form>`;
  const sel = a.convs.find((c) => c.id === +params.id);
  const rows = list.map((c) => `<tr${c === sel ? ' class="sel"' : ''}><td class="num" data-label="${tx('AST-11.th')}">${stamp(c.at)}</td><td data-label="${tx('AST-11.th.2')}">${tx('AST-11.td', { place: esc(place(c.resident)), length: c.turns.filter((t) => t.who === 'MEMBER').length, length2: calls(c).length, length3: a.handoffs.filter((h) => h.conv === c.id).length })}</td><td><a class="btn btn-ghost btn-sm" href="#" data-act="ast.openConv" data-id="${c.id}">${tx('AST-11.btn')}</a></td></tr>`).join('');
  const table = list.length ? `<div class="tbl reflow"><table aria-label="${tx('AST-11.stageHead')}"><thead><tr><th>${tx('AST-11.th')}</th><th>${tx('AST-11.th.2')}</th><th></th></tr></thead><tbody>${rows}</tbody></table></div>` : empty(tx('AST-11.empty'));
  const left = `<div class="stack lg"><section class="stack" aria-labelledby="cv"><h2 id="cv" class="t-heading2">${tx('AST-11.stageHead')}</h2><p class="muted">${tx('AST-11.p.3')}</p>${table}</section></div>`;
  if (!sel) return `${filters}${left}`;
  const rec = (who, what) => `<div class="record"><span class="when">${who}</span><span class="what">${what}</span></div>`;
  const trans = sel.turns.map((t) => {
    if (t.who === 'MEMBER') return rec(tx('AST-11.rec.3'), `"${esc(t.text)}"`);
    const ai = rec(tx('AST-11.rec.2'), `<span class="ai-mark">${ic('info')}AI</span><br>${esc(t.answer.text)}${t.answer.src ? `<br><span class="muted">${esc(t.answer.src)}</span>` : ''}`);
    const mine = sel.turns.find((x) => x.who === 'MEMBER' && x.id === sel.turns[sel.turns.indexOf(t) - 1]?.id);
    return ai + calls(sel).filter((k) => k.turn === mine?.id).map((k) => rec(tx('AST-11.rec'), `${TOOL[k.tool]}(${esc(targetText(k))})<br><span class="muted">${tx('AST-11.span', { authzText: authzText(k), v: RESULT[k.result] })}</span>`)).join('');
  }).join('');
  const panel = `<aside class="side-panel" aria-label="${tx('AST-11.ariaLabel.2')}"><span class="grab" aria-hidden="true"></span><h2 class="t-heading2">${tx('AST-11.h2', { stamp: stamp(sel.at), place: esc(place(sel.resident)) })}</h2>${sel.proxy ? `<p class="hint">${esc(sel.proxy)}</p>` : ''}${trans}
    <p class="hint">${tx('AST-11.p')}</p>
    <p class="hint">${tx('AST-11.p.2')}</p></aside>`;
  return `${filters}<div class="with-panel">${left}${panel}</div>`;
}

function ast11(params) {
  if (!LOG_ROLES.includes(me().key)) return noAccess();
  const conv = params.tab === 'conv';
  const tabs = `<nav class="tabs" aria-label="${tx('AST-11.ariaLabel')}"><a href="${href('AST-11')}"${conv ? '' : ' aria-current="page"'}>${tx('AST-11.title')}</a><a href="${href('AST-11', { tab: 'conv' })}"${conv ? ' aria-current="page"' : ''}>${tx('AST-11.stageHead')}</a></nav>`;
  return `${stageHead(conv ? tx('AST-11.stageHead') : tx('AST-11.title'))}${tabs}${conv ? convTab(params) : callsTab()}<p class="demo-note">${tx('AST-11.p.6')}</p>`;
}

// --- 행동 ---
const needHandoffRole = () => { if (!HANDOFF_ROLES.includes(me().key)) refuse(tx('assistant.needHandoffRole.refuse')); };
const own = (id) => A().confirms.find((x) => x.id === +id);
function newConfirm(o) {
  const cf = issue(me().residentId, o);
  go('AST-05', { c: cf.id });
}
const actions = {
  'ast.btn': (a) => { if (!BTN_INTENT[a.b]) refuse(ERR_AI); takeTurn({ mode: 'BUTTON', button: a.b }); go('AST-04'); },
  'ast.say': (a, f) => {
    const r = takeTurn({ mode: 'TEXT', raw: (a.utter ?? f.utter ?? '').trim() });
    if (r.unclear) go('AST-03', { miss: r.unclear }); else go('AST-04');
  },
  'ast.dispute': () => {
    if (!lastConv(me().residentId)) refuse(ERR_AI);
    const inv = api.core.latestInvoice?.(me().residentId);
    newConfirm({ reason: 'MEMBER_ASKED', topic: 'BILLING', message: BTN.DISPUTE, dispute: true, invoice: inv ? `${tx('assistant.action.text.2', { monthOf: monthOf(inv) })}` : tx('assistant.action.invoice') });
  },
  'ast.offer': (a) => {
    const x = findTurn(+a.t), o = x?.t.answer.offer;
    if (!o) refuse(ERR_AI);
    newConfirm({ reason: o.reason, topic: o.topic, message: x.prev.text, masked: x.prev.masked, answer: x.t.answer.text, dispute: !!o.dispute, invoice: o.invoice || '', item: o.item || '', invest: !!o.invest });
  },
  'ast.pick': (a) => {
    if (!PICK[a.topic]) refuse(ERR_AI);
    newConfirm({ reason: 'MEMBER_ASKED', topic: a.topic, message: PICK[a.topic] });
  },
  'ast.accept': (a) => { const cf = own(a.id); if (!cf) refuse(ERR_AI); accept(cf); go('AST-05', { c: cf.id }); },
  'ast.decline': (a) => { const cf = own(a.id); if (!cf) refuse(ERR_AI); if (cf.status === 'ISSUED') cf.status = 'DECLINED'; go('AST-05', { c: cf.id }); },
  'ast.again': (a) => { const cf = own(a.id); if (!cf) refuse(ERR_AI); newConfirm({ reason: cf.reason, topic: cf.topic, message: cf.message, masked: cf.masked, answer: cf.answer, dispute: cf.dispute, invoice: cf.invoice, item: cf.item, invest: cf.invest }); },
  'ast.router': (a) => { if (a.v !== 'REPLAY' && a.v !== 'LLM') refuse(ERR_AI); A().router = a.v; if (a.v === 'REPLAY') A().llmDown = false; },
  'ast.down': (a) => { if (A().router !== 'LLM') refuse(tx('assistant.action.refuse.6')); A().llmDown = a.v === '1'; },
  // 데모 전용 경로(ADR-G4 6번): 정상 화면에는 다른 회원 청구서를 넣을 길이 없어서 진행자가 실행기에 직접 넣는다.
  'ast.denyOther': () => {
    const conv = lastConv(me().residentId), mt = conv?.turns.filter((t) => t.who === 'MEMBER').at(-1);
    if (!mt) refuse(ERR_AI);
    exec({ conv: conv.id, turn: mt.id, resident: conv.resident }, { tool: 'EXPLAIN_INVOICE', target: `${tx('assistant.action.text', { room: RESIDENTS.R_MALSUN.room })}`, owner: 'R_MALSUN', demo: true, run: () => null });
    refuse(tx('assistant.action.refuse.5'));
  },
  'ast.denyToken': () => {
    const conv = lastConv(me().residentId), mt = conv?.turns.filter((t) => t.who === 'MEMBER').at(-1);
    if (!mt) refuse(ERR_AI);
    exec({ conv: conv.id, turn: mt.id, resident: conv.resident }, { tool: 'HANDOFF', deny: 'NO_CONFIRMATION', demo: true });
    refuse(tx('assistant.action.refuse.4'));
  },
  'ast.open': (a) => {
    needHandoffRole();
    A().reads.push({ id: nid(), at: nowISO(), by: me().id, kind: 'HANDOFF', ref: +a.id });
    go('AST-09', { f: a.f, id: a.id });
  },
  'ast.openConv': (a) => {
    if (!HANDOFF_ROLES.includes(me().key)) refuse(tx('assistant.action.refuse.3'));
    A().reads.push({ id: nid(), at: nowISO(), by: me().id, kind: 'CONVERSATION', ref: +a.id });
    if (LOG_ROLES.includes(me().key)) go('AST-11', { tab: 'conv', id: a.id });
    else refuse(tx('assistant.action.refuse.3'));
  },
  'ast.start': (a) => {
    needHandoffRole();
    const h = A().handoffs.find((x) => x.id === +a.id);
    if (h?.status === 'FORWARDED') refuse(tx('assistant.action.refuse.2'));
    if (h?.status !== 'NEW') refuse(ERR_AI);
    Object.assign(h, { status: 'IN_PROGRESS', startedBy: me().name, startedAt: nowISO() });
  },
  'ast.done': (a, f) => {
    needHandoffRole();
    const h = A().handoffs.find((x) => x.id === +a.id), memo = (f.note || '').trim();
    if (h?.status === 'FORWARDED') refuse(tx('assistant.action.refuse.2'));
    if (h?.status !== 'IN_PROGRESS') refuse(ERR_AI);
    if (!memo) refuse(tx('assistant.action.refuse'));
    Object.assign(h, { status: 'DONE', doneBy: me().name, doneAt: nowISO(), note: memo });
    view.note = '';
  },
};

// --- 모듈 ---
export default {
  key: 'assistant',
  seed: () => structuredClone(SEED),
  api: {
    // AST-13 칸. 시계 기준 지난 7일을 센다.
    usageSummary() {
      const to = nowISO(), from = addMs(to, -7 * 86400000);
      const convs = A().convs.filter((c) => inRange(c.at, from, to)), calls = A().calls.filter((c) => inRange(c.at, from, to));
      const handedOff = handedConvs(convs);
      const period = `${stamp(from)} ~ ${stamp(to)}`; // chats, range는 CORE-01 칸(common.js)이 읽는 이름
      return { from, to, period, range: period, chats: convs.length, conversations: convs.length, toolCalls: calls.length, handedOff, handoffRate: rate(convs.length, handedOff), denied: calls.filter((c) => c.authz === 'DENY').length, seed: true };
    },
    navCounts() { return { 'AST-09': A().handoffs.filter((h) => h.status === 'NEW').length }; },
  },
  actions,
  screens: {
    'AST-02': { app: 'home', title: tx('AST-02.title'), render: member(ast02) },
    'AST-03': { app: 'home', title: tx('AST-03.title'), render: member(ast03) },
    'AST-04': { app: 'home', title: tx('AST-04.title'), render: member(ast04) },
    'AST-05': { app: 'home', title: tx('AST-05.title'), render: member(ast05) },
    'AST-09': { app: 'ops', title: tx('AST-09.title'), render: ast09 },
    'AST-11': { app: 'ops', title: tx('AST-11.title'), render: ast11 },
  },
  flow: [
    { scene: 37, ord: 2, at: '2027-01-05T10:11:40', as: 'm.eunsook', go: ['AST-02'], say: tx('flow.assistant.s37.say.2'),
      steps: [{ see: tx('flow.assistant.s37.see.17') }, { click: tx('assistant.shared.DATES') }, { see: tx('assistant.billingDates.head') }, { see: tx('flow.assistant.s37.see.15') }, { see: tx('flow.assistant.s37.see.14') }, { see: tx('flow.assistant.s37.see.13') }, { see: tx('flow.assistant.s37.see.12') }, { see: tx('assistant.shared.span') }, { click: tx('assistant.shared.CONTRACTDATES') }, { see: tx('flow.assistant.s37.see.10') }, { see: tx('flow.assistant.s37.see.9') }, { see: tx('assistant.contractDates.src') }] },
    { scene: 37, ord: 3, at: '2027-01-05T10:12:40', as: 'm.eunsook', go: ['AST-04'], say: tx('flow.assistant.s37.say'),
      steps: [{ click: tx('assistant.shared.BILL') }, { see: tx('flow.assistant.s37.see.7') }, { see: tx('assistant.explain.l.2') }, { see: tx('flow.assistant.s37.see.5') }, { see: tx('flow.assistant.s37.see.4') }, { see: tx('flow.assistant.s37.see.3') }, { see: tx('flow.assistant.s37.see.2') }, { see: tx('flow.assistant.s37.see') }] },
    { scene: 38, ord: 1, at: '2027-01-05T10:13:00', as: 'm.eunsook', go: ['AST-03'], say: tx('flow.assistant.s38.say.2'),
      steps: [{ fill: 'utter', value: tx('AST-03.text.5') }, { click: tx('AST-03.btn') }, { see: tx('flow.assistant.s38.see.14') }, { see: tx('flow.assistant.s38.see.13') }, { see: tx('flow.assistant.s38.see.12') }, { see: tx('flow.assistant.s38.see.11') },
        { at: '2027-01-05T10:13:25' }, { go: 'AST-03' }, { fill: 'utter', value: tx('AST-03.text.4') }, { click: tx('AST-03.btn') }, { see: tx('assistant.FIXED.head') },
        { at: '2027-01-05T10:13:30' }, { click: tx('AST-04.devBtn') }, { see: tx('assistant.action.refuse.5') }] },
    { scene: 38, ord: 2, at: '2027-01-05T10:13:50', as: 'm.eunsook', go: ['AST-03'], say: tx('flow.assistant.s38.say'),
      steps: [{ fill: 'utter', value: tx('AST-03.text.3') }, { click: tx('AST-03.btn') }, { see: tx('assistant.FIXED.head.6') }, { see: tx('assistant.FIXED.q') }, { click: tx('assistant.shared.YES') }, { see: tx('AST-05.h1.3') }, { see: tx('flow.assistant.s38.see.5') }, { see: tx('flow.assistant.s38.see.4') },
        { at: '2027-01-05T10:14:02' }, { click: tx('assistant.shared.YES') }, { see: tx('AST-05.h1') }, { see: tx('AST-05.p.4') },
        { at: '2027-01-05T10:14:30' }, { click: tx('AST-05.devBtn') }, { see: tx('assistant.action.refuse.4') }] },
    { scene: 39, ord: 1, at: '2027-01-05T10:20:00', as: 'st.choims', go: ['AST-09'], say: tx('flow.assistant.s39.say.2'),
      steps: [{ see: tx('AST-09.title') }, { see: tx('AST-09.NEW') }, { see: tx('assistant.shared.MONEY') }, { click: tx('AST-11.btn') }, { see: tx('flow.assistant.s39.see.16') }, { see: tx('flow.assistant.s39.see.15') }, { see: tx('flow.assistant.s39.see.14') }, { see: tx('flow.assistant.s39.see.13') }, { click: tx('AST-09.btn.2') }, { see: tx('flow.assistant.s39.see.12') }] },
    { scene: 39, ord: 2, at: '2027-01-05T10:30:00', as: 'st.choiym', go: ['AST-11'], say: tx('flow.assistant.s39.say'),
      steps: [{ see: tx('AST-11.title') }, { see: tx('AST-11.span.7') }, { see: tx('AST-11.OTHERRESIDENT.2') }, { see: tx('AST-11.span.2') }, { see: tx('AST-11.NOCONFIRMATION.2') }, { see: tx('flow.assistant.s39.see.6') }, { see: tx('flow.assistant.s39.see.5') }, { see: tx('AST-11.p.5') },
        { click: tx('AST-11.stageHead') }, { click: tx('AST-11.btn') }, { see: tx('AST-11.rec.2') }, { see: tx('flow.assistant.s39.see.2') }, { see: tx('flow.assistant.s39.see') }] },
    { scene: 40, ord: 1, at: '2027-01-05T11:00:00', as: 'm.eunsook', go: ['AST-03'], say: tx('flow.assistant.s40.say'),
      steps: [{ click: tx('AST-03.devBtn.3') }, { click: tx('AST-03.devBtn') }, { see: tx('AST-03.devBtn.2') }, { fill: 'utter', value: tx('flow.assistant.s40.value') }, { click: tx('AST-03.btn') }, { see: tx('assistant.ERR_AI.text') }, { click: tx('assistant.shared.DATES') }, { see: tx('flow.assistant.s40.see.2') },
        { go: 'AST-03' }, { click: tx('AST-03.devBtn.2') }, { click: tx('AST-03.devBtn.4') }, { see: tx('AST-03.devBtn.3') }] },
  ],
};
