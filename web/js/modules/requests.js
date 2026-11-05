import { tx } from '../lib/text.js';
import { loadData } from '../lib/text.js';
// 생활 요청(N1) 모듈. 화면은 requests/ 아래, 상태 전이는 requests/model.js.
import { DECLINE_STAFF, OPEN, TEAM_LABEL, TYPE_MEMBER, S, WEEK, allReqs, bodyMember, board, catchUp, createReq, monthSummary, nameOf } from './requests/model.js';
import { homeActions, homeScreens } from './requests/home.js';
import { familyActions, familyScreens } from './requests/family.js';
import { opsActions, opsScreens } from './requests/ops.js';
import { settingsActions, settingsScreens } from './requests/settings.js';
import { fmt } from '../lib/kit.js';
const SEED = await loadData('requests');


const REPAIR_201 = '[data-type="REPAIR"][data-res="R_EUNSOOK"]';
const LAUNDRY_OKJA = '[data-type="LAUNDRY"][data-res="R_OKJA"]';
const RIDE_201 = '[data-type="TRANSPORT"][data-res="R_EUNSOOK"]';
const ROW_REPAIR = tx('requests.ROW_REPAIR.text');

export default {
  key: 'requests',
  // 날짜를 가진 행. 시계가 그 시각에 닿아야 보인다(PRD 9절). 직원 id는 people.js 계정 id.
  seed: () => structuredClone(SEED),

  api: {
    board,
    monthSummary,
    navCounts: () => ({ 'REQ-12': board().unassigned }),
    openCount: (residentId) => allReqs().filter((x) => x.r.residentId === residentId && (OPEN.includes(x.c.status) || x.c.status === 'PENDING_MEMBER_OK')).length,
    homeSub: (residentId) => {
      const n = allReqs().filter((x) => x.r.residentId === residentId && (OPEN.includes(x.c.status) || x.c.status === 'PENDING_MEMBER_OK')).length;
      return n ? `${tx('requests.api.text', { n })}` : '';
    },
    doneList: (residentId, fromYmd, toYmd) => allReqs()
      .filter((x) => x.r.residentId === residentId && ['CONFIRMED', 'AUTO_CLOSED'].includes(x.c.status) && x.c.closedAt.slice(0, 10) >= fromYmd && x.c.closedAt.slice(0, 10) <= toYmd)
      .map((x) => ({ id: x.r.id, type: x.c.type, label: TYPE_MEMBER[x.c.type], text: bodyMember(x.r, x.c), closedAt: x.c.closedAt, status: x.c.status })),
    /** 비서가 넘긴 분류 전 요청. 같은 넘김 id는 한 번만 만든다. 만든 요청 id를 돌려준다 */
    intakeFromAssistant: ({ residentId, handoffId, text }) => {
      const had = handoffId && S().reqs.find((r) => r.handoffId === handoffId);
      return had ? had.id : createReq({ residentId, type: null, body: text, source: 'ASSISTANT_HANDOFF', handoffId: handoffId ?? null }).id;
    },
  },

  tick() { catchUp(); },

  actions: { ...homeActions, ...familyActions, ...opsActions, ...settingsActions },
  screens: { ...homeScreens, ...familyScreens, ...opsScreens, ...settingsScreens },

  // 41장면 밖 화면: REQ-17(정기 작업), REQ-18(요청 종류 설정). 41장면 뒤 상태에서 이어 누른다.
  extra: [
    { at: '2027-01-11T09:10:00', as: 'st.choiym', go: ['REQ-17'], say: tx('flow.requests.x17.say.1'),
      steps: [{ see: tx('REQ-17.intro') }, { see: tx('REQ-17.list.h2') }, { see: SEED.tasks[0].name }, { see: SEED.tasks[1].name }, { see: tx('REQ-17.note') },
        { fill: 'j_name', value: tx('flow.requests.x17.name') }, { fill: 'j_target', value: tx('flow.requests.x17.building') }, { fill: 'j_start', value: '2027-01-12' },
        { click: tx('REQ-17.create.h2') }, { see: tx('REQ-17.created', { md: fmt.md('2027-01-12T12:00:00'), w: WEEK[2] }) },
        { see: tx('flow.requests.x17.name') }, { see: tx('REQ-09.h2', { days: WEEK[2] }) }] },
    { at: '2027-01-12T08:30:00', as: 'st.ohsj', go: ['REQ-12'], say: tx('flow.requests.x17.say.2'),
      steps: [{ click: tx('REQ-12.button') }, { see: tx('flow.requests.x17.building') }, { as: 'm.malsun' }, { go: 'REQ-01' }, { see: tx('REQ-01.title.2', { join: tx('REQ-01.text', { v: WEEK[2] }) }) },
        { go: 'REQ-09' }, { see: tx('REQ-09.h2', { days: tx('REQ-09.text.6', { v: WEEK[2] }) }) }] },
    { at: '2027-01-12T10:00:00', as: 'st.choiym', go: ['REQ-17'], say: tx('flow.requests.x17.say.3'),
      steps: [{ click: tx('REQ-17.btn.change'), within: 'tr[data-task="T-3"]' }, { fill: 'j_team', value: 'FACILITY' }, { click: tx('REQ-17.btn.change'), within: '.row.end' },
        { see: tx('REQ-17.team', { team: TEAM_LABEL.FACILITY, name: nameOf(SEED.teams.FACILITY[0]) }) },
        { click: tx('REQ-17.btn.end'), within: 'tr[data-task="T-3"]' }, { see: tx('REQ-17.end.title') }, { see: tx('REQ-17.end.body') }, { click: tx('REQ-17.btn.end'), within: '.dialog' }, { no: tx('flow.requests.x17.name') },
        { as: 'st.ohsj' }, { go: 'REQ-12' }, { click: tx('REQ-12.button') }, { see: tx('flow.requests.x17.building') },
        { at: '2027-01-19T08:30:00' }, { no: tx('flow.requests.x17.building') },
        { as: 'm.malsun' }, { go: 'REQ-09' }, { see: tx('REQ-09.empty') }] },
    { at: '2027-01-19T09:00:00', as: 'st.choiym', go: ['REQ-18'], say: tx('flow.requests.x17.say.4'),
      steps: [{ see: tx('REQ-18.intro') }, { see: tx('REQ-18.h2') }, { see: tx('REQ-18.cost.note') }, { see: tx('REQ-18.save.note') }, { see: tx('REQ-18.teams.h2') },
        { fill: 'k_due_REPAIR', value: tx('REQ-18.due.created', { n: 1 }) }, { click: tx('REQ-18.save') }, { see: tx('REQ-18.saved') },
        { as: 'st.choims' }, { go: 'REQ-12' }, { click: tx('REQ-12.btn.2') }, { fill: 'r_room', value: tx('flow.requests.s13.value.3') }, { fill: 'r_res', value: 'R_OKJA' }, { fill: 'r_kind', value: 'REPAIR' }, { fill: 'r_say', value: tx('flow.requests.s14.see.7') }, { click: tx('REQ-12.btn.13'), within: '.rsheet' }, { see: tx('flow.requests.s14.see.7') }] },
    { at: '2027-01-20T09:30:00', as: 'st.choiym', go: ['REQ-12'], say: tx('flow.requests.x17.say.5'),
      steps: [{ click: tx('REQ-12.segBtn.2') }, { see: tx('flow.requests.s14.see.7') },
        { sel: '[data-type="REPAIR"][data-res="R_OKJA"] .rq-open' }, { click: tx('REQ-12.btn.7'), within: '.detail' }, { click: tx('REQ-12.btn.7'), within: '.dialog' }, { see: tx('REQ-12.text.37', { v: DECLINE_STAFF.OUT_OF_SCOPE }) },
        { go: 'REQ-18' }, { fill: 'k_due_REPAIR', value: tx('REQ-18.due.created', { n: 2 }) }, { click: tx('REQ-18.save') }, { see: tx('REQ-18.saved') }] },
    { at: '2027-01-20T10:00:00', as: 'st.choims', go: ['REQ-17'], say: tx('flow.requests.x17.say.6'),
      steps: [{ see: tx('REQ-17.denied') }, { as: 'hq.han' }, { go: 'REQ-17' }, { see: tx('REQ-18.intro') }, { as: 'hq.jung' }, { go: 'REQ-18' }, { see: tx('REQ-17.intro') }] },
  ],

  flow: [
    // 13. 시계를 11/17로. 정기 청소 첫 회차, 확인 없이 닫힘, 대신 등록
    { scene: 13, ord: 1, at: '2026-11-17T08:40:00', as: 'st.choims', go: ['REQ-12'], say: tx('flow.requests.s13.say.2'),
      steps: [{ see: tx('REQ-12.segBtn.3') }, { click: tx('REQ-12.button') }, { see: tx('REQ-12.SKIPPED.2') }, { see: tx('REQ-12.SCHEDULED') }, { click: tx('REQ-12.button') }, { click: tx('AST-11.opt.2') }, { see: tx('REQ-12.add.6') }] },
    { scene: 13, ord: 2, at: '2026-11-17T08:40:00', as: 'st.choims', go: ['REQ-12'], say: tx('flow.requests.s13.say'),
      steps: [{ click: tx('REQ-12.btn.2') }, { fill: 'r_room', value: tx('flow.requests.s13.value.3') }, { fill: 'r_res', value: 'R_OKJA' }, { fill: 'r_kind', value: 'LAUNDRY' }, { fill: 'r_when', value: tx('requests.shared.TODAYPM') }, { fill: 'r_say', value: tx('flow.requests.s13.value') }, { click: tx('REQ-12.input') }, { click: tx('REQ-12.btn.13'), within: '.rsheet' }, { see: tx('flow.requests.s13.see.2') }, { see: tx('REQ-12.span.5') }] },
    // 14. 회원 요청 → 배정 → 처리 → 완료
    { scene: 14, ord: 1, at: '2026-11-17T09:05:00', as: 'm.eunsook', go: ['REQ-01'], say: tx('flow.requests.s14.say.4'),
      steps: [{ click: tx('requests.TYPE_MEMBER.REPAIR') }, { fill: 'body', value: tx('flow.requests.s14.see.7') }, { click: tx('REQ-03.text') }, { click: tx('REQ-03.ALLOWEDWHENABSENT') }, { click: tx('REQ-03.text') }, { see: tx('REQ-05.title') }, { see: tx('REQ-05.ALLOWEDWHENABSENT') }, { click: tx('assistant.shared.YES') }, { see: tx('REQ-07.h1') }, { see: tx('REQ-07.p.2') }, { click: tx('REQ-07.btn.8') }, { see: ROW_REPAIR }] },
    { scene: 14, ord: 2, at: '2026-11-17T09:20:00', as: 'st.choims', go: ['REQ-12'], say: tx('flow.requests.s14.say.3'),
      steps: [{ see: tx('flow.requests.s14.see.7') }, { click: tx('REQ-12.btn.10'), within: REPAIR_201 }, { see: tx('REQ-12.dialog.4') }, { click: tx('REQ-12.btn.10'), within: '.dialog' }, { see: tx('flow.requests.s14.see.9') }, { click: tx('REQ-12.btn.10'), within: LAUNDRY_OKJA }, { click: tx('REQ-12.btn.10'), within: '.dialog' }, { see: tx('flow.requests.s14.see.8') }] },
    { scene: 14, ord: 3, at: '2026-11-17T10:10:00', as: 'st.handy', go: ['REQ-12'], say: tx('flow.requests.s14.say.2'),
      steps: [{ see: tx('flow.requests.s14.see.7') }, { click: tx('REQ-12.B.3'), within: REPAIR_201 }, { see: tx('REQ-12.add.10') }, { at: '2026-11-17T10:30:00' }, { click: tx('REQ-12.B.2'), within: REPAIR_201 }, { fill: 'done', value: tx('REQ-12.placeholder') }, { click: tx('REQ-12.B.2'), within: '.detail' }, { see: tx('flow.requests.s14.see.5') }] },
    { scene: 14, ord: 4, at: '2026-11-17T10:30:00', as: 'm.eunsook', go: ['REQ-01'], say: tx('flow.requests.s14.say'),
      steps: [{ see: tx('flow.requests.s14.see.4') }, { see: tx('REQ-07.h1.3') }, { click: ROW_REPAIR }, { see: tx('flow.requests.s14.see.2') }, { see: tx('REQ-07.p.3') }] },
    // 15. 아직이에요 → 다시 열림 → 다시 완료 → 확인, 나누기
    { scene: 15, ord: 1, at: '2026-11-17T11:00:00', as: 'm.eunsook', go: ['REQ-01'], say: tx('flow.requests.s15.say.4'),
      steps: [{ click: ROW_REPAIR }, { see: tx('REQ-07.h1.3') }, { click: tx('REQ-07.btn.5') }, { fill: 'note', value: tx('flow.requests.s15.value.2') }, { click: tx('REQ-09.btn.7') }, { see: tx('REQ-07.h1.4') }, { see: tx('flow.requests.s15.see.14') }] },
    { scene: 15, ord: 2, at: '2026-11-17T13:40:00', as: 'st.handy', go: ['REQ-12'], say: tx('flow.requests.s15.say.3'),
      steps: [{ see: tx('REQ-12.span.4') }, { see: tx('flow.requests.s15.see.12') }, { click: tx('REQ-12.B.2'), within: REPAIR_201 }, { fill: 'done', value: tx('flow.requests.s15.value') }, { click: tx('REQ-12.B.2'), within: '.detail' }, { see: tx('flow.requests.s15.see.11') }] },
    { scene: 15, ord: 3, at: '2026-11-17T14:00:00', as: 'm.eunsook', go: ['REQ-01'], say: tx('flow.requests.s15.say.2'),
      steps: [{ click: ROW_REPAIR }, { click: tx('REQ-07.btn.4') }, { see: tx('requests.shared.text.5') }, { see: tx('REQ-07.main') }, { click: tx('REQ-07.btn.8') }, { click: tx('REQ-01.a.2') }, { click: ROW_REPAIR }, { see: tx('flow.requests.s15.see.8') }, { see: tx('flow.requests.s15.see.7') }] },
    { scene: 15, ord: 4, at: '2026-11-17T14:05:00', as: 'st.choims', go: ['REQ-12'], say: tx('flow.requests.s15.say'),
      steps: [{ click: tx('AST-11.EXPIRED') }, { see: tx('flow.requests.s15.see.6') }, { see: tx('flow.requests.s15.see.5') }, { see: tx('flow.requests.s15.see.4') }, { see: tx('flow.requests.s15.see.3') }, { click: tx('AST-11.opt.2') }, { see: tx('REQ-12.add.6') }, { see: tx('flow.requests.s15.see') }] },
    // 16. 보호자가 대신 올리기(ord 1은 보호자 허락 모듈)
    { scene: 16, ord: 2, at: '2026-11-17T15:10:00', as: 'g.jimin', go: ['REQ-10'], say: tx('flow.requests.s16.say.3'),
      steps: [{ see: tx('flow.requests.s16.see.5') }, { click: tx('flow.requests.s16.click.3') }, { click: tx('requests.TYPE_MEMBER.REPAIR') }, { fill: 'gtext', value: tx('flow.requests.s16.no') }, { click: tx('REQ-11.btn.2') }, { see: tx('REQ-11.main.4') }, { go: 'REQ-10' }, { see: tx('flow.requests.s16.no') }] },
    { scene: 16, ord: 3, at: '2026-11-17T15:10:00', as: 'm.eunsook', go: ['REQ-01'], say: tx('flow.requests.s16.say.2'),
      steps: [{ click: tx('flow.requests.s16.no') }, { see: tx('flow.requests.s16.see.3') }, { see: tx('REQ-07.btn') }] },
    { scene: 16, ord: 4, at: '2026-11-17T15:10:00', as: 'g.jimin', go: ['REQ-10'], say: tx('flow.requests.s16.say'),
      steps: [{ see: tx('flow.requests.s16.no') }, { as: 'p.taeho' }, { go: 'REQ-10' }, { see: tx('flow.requests.s16.see') }, { no: tx('flow.requests.s16.no') }] },
    // 17. 외출 차량과 정기 청소 쉬기
    { scene: 17, ord: 1, at: '2026-11-17T16:00:00', as: 'm.eunsook', go: ['REQ-01'], say: tx('flow.requests.s17.say.4'),
      steps: [{ click: tx('requests.TYPE_MEMBER.TRANSPORT') }, { click: tx('flow.requests.s17.click.10') }, { click: tx('REQ-03.text') }, { click: tx('REQ-03.text.16') }, { click: tx('REQ-03.text') }, { fill: 'dest', value: tx('flow.requests.s17.click.3') }, { click: tx('REQ-03.text') }, { click: tx('REQ-03.YES') }, { click: tx('REQ-03.text') }, { see: tx('REQ-05.title') }, { see: tx('flow.requests.s17.click.3') }, { click: tx('assistant.shared.YES') }, { see: tx('REQ-07.h1') }] },
    { scene: 17, ord: 2, at: '2026-11-17T16:05:00', as: 'st.jungty', go: ['REQ-12'], say: tx('flow.requests.s17.say.3'),
      steps: [{ click: tx('REQ-12.segBtn.3') }, { see: tx('flow.requests.s17.click.3') }, { click: tx('REQ-12.B.4'), within: RIDE_201 }, { see: tx('flow.requests.s17.see.6') }] },
    { scene: 17, ord: 3, at: '2026-11-17T16:10:00', as: 'm.eunsook', go: ['REQ-01'], say: tx('flow.requests.s17.say.2'),
      steps: [{ click: tx('flow.requests.s17.click.3') }, { see: tx('flow.requests.s17.see.5') }] },
    { scene: 17, ord: 4, at: '2026-11-17T16:30:00', as: 'm.eunsook', go: ['REQ-09'], say: tx('flow.requests.s17.say'),
      steps: [{ see: tx('flow.requests.s17.see.4') }, { click: tx('REQ-09.btn.5') }, { see: tx('flow.requests.s17.see.3') }, { click: tx('REQ-09.btn.4') }, { see: tx('flow.requests.s17.see.2') }, { see: tx('flow.requests.s17.see') }] },
    // 18. 세탁 완료 → 확인 대신 기록 → 청구 넘김 → 운영 현황
    { scene: 18, ord: 1, at: '2026-11-17T17:00:00', as: 'st.ohsj', go: ['REQ-12'], say: tx('flow.requests.s18.say.5'),
      steps: [{ click: tx('REQ-12.B.3'), within: LAUNDRY_OKJA }, { click: tx('REQ-12.B.2'), within: LAUNDRY_OKJA }, { fill: 'done', value: tx('flow.requests.s18.value') }, { click: tx('REQ-12.B.2'), within: '.detail' }, { see: tx('flow.requests.s18.see.10') }, { see: tx('flow.requests.s18.see.9') }] },
    { scene: 18, ord: 2, at: '2026-11-17T17:00:00', as: 'st.choims', go: ['REQ-12'], say: tx('flow.requests.s18.say.4'),
      steps: [{ sel: `${LAUNDRY_OKJA} .rq-open` }, { see: tx('REQ-12.DONE') }, { click: tx('REQ-12.dialog.3'), within: '.detail' }, { see: tx('REQ-12.p.7') }] },
    { scene: 18, ord: 3, at: '2026-11-17T17:05:00', as: 'st.choims', go: ['REQ-12'], say: tx('flow.requests.s18.say.3'),
      steps: [{ sel: `${LAUNDRY_OKJA} .rq-open` }, { click: tx('REQ-12.dialog.3'), within: '.detail' }, { click: tx('REQ-12.choice.4') }, { click: tx('core.ok.click'), within: '.dialog' }, { see: tx('flow.requests.s18.see.6') }] },
    { scene: 18, ord: 4, at: '2026-11-17T17:05:00', as: 'st.choiym', go: ['REQ-12'], say: tx('flow.requests.s18.say.2'),
      steps: [{ click: tx('AST-11.opt.2') }, { sel: `${LAUNDRY_OKJA} .rq-open` }, { see: tx('REQ-12.text.39') }, { see: tx('flow.requests.s18.see.4') }] },
    { scene: 18, ord: 7, at: '2026-11-17T17:10:00', as: 'st.choiym', go: ['REQ-12', { view: 'overdue' }], say: tx('flow.requests.s18.say'),
      steps: [{ see: tx('flow.requests.s18.see.3') }, { see: tx('flow.requests.s18.see.2') }, { see: tx('flow.requests.s18.see') }, { no: tx('flow.requests.s18.no') }] },
  ],
};
