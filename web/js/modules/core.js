import { loadData } from '../lib/text.js';
// 코어(계약·청구). 모듈키 core. 이 파일에는 seed와 공개 api만 두고, 도메인 함수는 core/model.js, 화면은 core/screens.js, 행동은 core/actions.js, 장면 단계는 core/flow.js에 있다.
import * as M from './core/model.js';
import { actions } from './core/actions.js';
import { screens } from './core/screens.js';
import { flow, extra } from './core/flow.js';
const SEED = await loadData('core');


const D = (r) => ({ id: r.id, name: r.name, room: r.room, siteId: r.siteId });
const pubContract = (c) => c && ({ id: c.id, status: c.status, siteId: c.siteId, unitId: c.unitId, room: M.roomOfContract(c), residentIds: [...c.residentIds], plan: c.plan, occupancy: c.occupancy, monthlyFee: c.rate, deposit: c.deposit, startDate: c.startDate, endDate: c.endDate, billingStart: c.billingStart, billingEnd: c.billingEnd });

export default {
  key: 'core',
  // 순수 데이터만 돌려준다(함수 호출 없음). 계약의 날짜 행은 시계가 그 날짜에 닿아야 보인다.
  seed: () => structuredClone(SEED),
  api: {
    residentName: (id) => M.nameOf(id),
    repOf: (rid, name) => { const r = M.C().reps.find((x) => x.residentId === rid && x.name === name); return r && { ...r, scopeText: r.scopes.map((x) => M.SCOPE[x]).join(', ') }; },
    residents: (siteId = 'S1') => M.residents(siteId).map(D),
    resident: (id) => { const p = M.person(id); const c = M.contractOf(id); return p && { id: p.id, name: p.name, code: p.code, siteId: p.siteId, room: M.roomOfContract(c), contractId: c?.id ?? null, contractStatus: c?.status ?? null }; },
    contractOf: (rid) => pubContract(M.contractOf(rid)),
    keyDates: (rid) => M.keyDates(rid),
    invoiceOf: (rid, month) => M.invoiceOf(rid, month),
    latestInvoice: (rid) => M.latestInvoice(rid),
    emergencyContacts: (rid) => { const c = M.contractOf(rid); return c ? M.contactsOfContract(c.id).map((x) => ({ order: x.order, name: x.name, relation: M.RELATION[x.relation], relationCode: x.relation, phone: x.phone })) : []; },
    isAbsent: (rid, iso) => M.isAbsent(rid, iso),
    openAbsences: (iso) => M.openAbsences(iso),
    mealCount: (rid, from, to) => M.mealCount(rid, from, to),
    recordServiceUsage: (a) => M.recordServiceUsage(a),
    pendingUsages: () => M.pendingUsages(),
    occupancy: (siteId = 'S1') => { const { total, units, occupied, movingIn, vacant, movingOut } = M.unitSummary(siteId); return { total, units, occupied, movingIn, vacant, movingOut }; },
    todos: (persona) => M.todos(persona),
  },
  actions,
  screens,
  flow,
  extra,
};
