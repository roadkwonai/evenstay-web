import { tx } from '../lib/text.js';
import { loadData } from '../lib/text.js';
// 생활 지원 단계(C). 화면은 transitions/ui.js, 상태와 행동은 transitions/domain.js, 여기는 모듈 모양과 장면 단계(flow)다.
import { actions, publicApi } from './transitions/domain.js';
import { screens } from './transitions/ui.js';
const SEED = await loadData('transitions');


const RID = 'R_EUNSOOK';
const MORE = ['MEAL', 'MOBILITY', 'DRESSING', 'TOILETING', 'GOING_OUT'];
const lv = (code, level) => ({ sel: `input[name="lv-${code}"][value="${level}"]` });
const WHY = tx('transitions.WHY.text');

export default {
  key: 'transitions',
  seed: () => structuredClone(SEED),
  api: publicApi,
  actions,
  screens,
  flow: [
    { scene: 31, ord: 1, at: '2026-12-08T09:00:00', as: 'st.choiym', go: ['TRN-01'], say: tx('flow.transitions.s31.say'),
      steps: [{ see: tx('flow.transitions.s31.see.6') }, { see: tx('transitions.seed.memberLabel.5') }, { see: tx('transitions.seed.servicesNote') }, { click: tx('transitions.seed.staffLabel.2') }, { see: tx('flow.transitions.s31.see.3') }, { click: tx('transitions.seed.staffLabel.4') }, { see: tx('flow.transitions.s31.see.2') }, { see: tx('transitions.seed.feeLabel') }] },
    { scene: 32, ord: 1, at: '2026-12-08T15:30:00', as: 'st.parksj', go: ['TRN-03', { rid: RID }], say: tx('flow.transitions.s32.say'),
      steps: [{ see: tx('flow.transitions.s32.see.3') }, ...MORE.map((c) => lv(c, 'NOT_OBSERVED')), lv('BATHING', 'ALWAYS_HELPED'), lv('MEDICATION', 'SOMETIMES_HELPED'),
        { fill: 'nt-BATHING', value: tx('flow.transitions.s32.value.4') }, { see: tx('flow.transitions.s32.no') },
        { fill: 'nt-BATHING', value: tx('flow.transitions.s32.value.3') }, { no: tx('flow.transitions.s32.no') },
        { fill: 'nt-MEDICATION', value: tx('flow.transitions.s32.value.2') }, { fill: 'wish', value: tx('flow.transitions.s32.value') },
        { click: tx('safety.shared.click.18') }, { see: tx('flow.transitions.s32.see.2') }, { see: tx('TRN-03.btn.4') }] },
    { scene: 33, ord: 1, at: '2026-12-09T10:05:00', as: 'st.parksj', go: ['TRN-04', { rid: RID }], say: tx('flow.transitions.s33.say.3'),
      steps: [{ see: tx('TRN-04.dt.2') }, { see: tx('flow.transitions.s33.see.6') }, { fill: 'why', value: WHY }, { click: tx('TRN-04.btn.2') }, { see: tx('flow.transitions.s33.see.5') }] },
    { scene: 33, ord: 2, as: 'st.choiym', go: ['TRN-02', { rid: RID }], say: tx('flow.transitions.s33.say.2'),
      steps: [{ see: tx('TRN-02.sub') }, { see: tx('transitions.seed.AWAITINGEXPLANATION') }, { click: tx('TRN-02.sub') }, { see: tx('flow.transitions.s33.see.3') }, { fill: 'reason', value: tx('flow.transitions.s33.value.2') }, { click: tx('transitions.seed.label.13') }, { see: tx('flow.transitions.s33.see.2') }, { no: tx('flow.transitions.s33.no') }] },
    { scene: 33, ord: 3, at: '2026-12-09T11:20:00', as: 'st.parksj', go: ['TRN-04', { rid: RID }], say: tx('flow.transitions.s33.say'),
      steps: [{ see: tx('flow.transitions.s33.see.2') }, { click: tx('transitions.seed.label.17') }, { fill: 'words', value: tx('flow.transitions.s33.value') }, { click: tx('TRN-04.btn.3') }, { see: tx('flow.transitions.s33.see') }] },
    { scene: 34, ord: 1, at: '2026-12-10T16:20:00', as: 'st.choiym', go: ['TRN-05', { rid: RID }], say: tx('flow.transitions.s34.say'),
      steps: [{ see: tx('flow.transitions.s34.see.6') }, { see: tx('flow.transitions.s34.see.5') }, { fill: 'reason', value: tx('flow.transitions.s34.value') }, { click: tx('transitions.seed.label.13') }, { see: tx('flow.transitions.s34.see.4') }, { see: tx('flow.transitions.s34.see.3') },
        { click: tx('CORE-13.modalBtn.2'), within: '.dialog' }, { see: tx('flow.transitions.s34.see.2') }, { see: tx('transitions.decisionResult.text.5') }] },
    { scene: 35, ord: 1, at: '2026-12-10T19:00:00', as: 'm.eunsook', go: ['TRN-09'], say: tx('flow.transitions.s35.say'),
      steps: [{ see: tx('COM-09.tile.11') }, { see: tx('TRN-09.h2.3') }, { see: tx('flow.transitions.s35.see.6') }, { see: tx('transitions.seed.familyLabel.3') }, { see: tx('flow.transitions.s35.see.4') },
        { see: tx('flow.transitions.s35.see.3') }, { see: tx('flow.transitions.s35.see.2') }, { no: tx('flow.transitions.s35.no') },
        { click: tx('TRN-09.h1') }, { see: tx('flow.transitions.s35.see') }] },
    { scene: 41, ord: 1, at: '2027-01-08T09:00:00', as: 'st.kimhj', go: ['TRN-02', { rid: RID }], say: tx('flow.transitions.s41.say.2'),
      steps: [{ click: tx('TRN-02.h2') }, { fill: 'provider', value: tx('TRN-02.placeholder') }, { fill: 'times', value: tx('TRN-02.placeholder.2') }, { fill: 'start', value: '2027-01-12' }, { fill: 'contact', value: tx('safety.contactsOf.phone') }, { click: tx('safety.shared.click.18') },
        { see: tx('flow.transitions.s41.see.7') }, { see: tx('flow.transitions.s41.see.6') },
        { fill: 'o1', value: '2027-01-11' }, { fill: 'o2', value: tx('TRN-02.placeholder.4') }, { fill: 'o3', value: '2027-01-14' }, { click: tx('transitions.seed.label.3'), within: '.rs-foot' },
        { see: tx('flow.transitions.s41.see.5') }, { click: tx('common.popHtml.btn.4') }, { click: tx('TRN-02.ariaLabel') }, { see: tx('flow.transitions.s41.see.4') }] },
    { scene: 41, ord: 2, as: 'm.eunsook', go: ['TRN-09'], say: tx('flow.transitions.s41.say'),
      steps: [{ click: tx('TRN-09.h1.2') }, { see: tx('flow.transitions.s41.see.3') }, { see: tx('flow.transitions.s41.see.2') }, { see: tx('TRN-09.p.2') }] },
  ],
  // 41장면 밖 화면(③단계). TRN-12는 본사 관리자와 사업장 책임자만 새 버전을 저장하고, 새 정의는 시작일부터 하는 결정에 쓰인다.
  extra: [
    { at: '2027-01-20T09:00:00', as: 'hq.han', go: ['TRN-01'], say: tx('flow.transitions.p3.say.1'),
      steps: [{ click: tx('TRN-01.edit') }, { see: tx('TRN-12.h1') }, { see: tx('transitions.seed.staffLabel.4') },
        { fill: 'dStaff', value: tx('flow.transitions.p3.name.1') }, { click: tx('TRN-12.save') }, { sel: '.alert-err' },
        { fill: 'dStaff', value: tx('flow.transitions.p3.name.2') }, { fill: 'dMember', value: tx('flow.transitions.p3.name.3') },
        { fill: 'dServ', value: [tx('transitions.seed.previewLabel.3'), tx('transitions.seed.staffLabel.3'), tx('transitions.seed.previewLabel'), tx('flow.transitions.p3.line')].join('\n') },
        { click: tx('TRN-12.save') }, { see: tx('transitions.MSG.badDate') }, { sel: '.alert-err' },
        { fill: 'dFrom', value: '2027-01-20' }, { click: tx('TRN-12.save') },
        { see: tx('TRN-12.saved', { from: '2027-01-20' }) }, { see: tx('TRN-12.sumAdd', { x: tx('flow.transitions.p3.line') }) }, { see: tx('TRN-12.sumChange', { item: tx('TRN-12.n1') }) },
        { click: tx('TRN-12.save') }, { sel: '.alert-err' },
        { go: 'TRN-01' }, { see: tx('flow.transitions.p3.name.2') }, { see: tx('flow.transitions.p3.line') }] },
    { at: '2027-01-20T09:20:00', as: 'st.choiym', go: ['TRN-01'], say: tx('flow.transitions.p3.say.2'),
      steps: [{ see: tx('TRN-01.edit') }, { as: 'hq.jung' }, { go: 'TRN-01' }, { no: tx('TRN-01.edit') }, { go: 'TRN-12' }, { see: tx('core.need.refuse') }, { no: tx('TRN-12.save') }, { as: 'st.kimhj' }, { go: 'TRN-12' }, { see: tx('core.need.refuse') }] },
    { at: '2027-01-20T10:00:00', as: 'st.kimhj', go: ['TRN-04', { rid: 'R_OKJA' }], say: tx('flow.transitions.p3.say.3'),
      steps: [{ see: tx('flow.transitions.p3.name.2') }, { see: tx('transitions.changeText.text', { join: [tx('transitions.seed.previewLabel.3'), tx('transitions.seed.previewLabel.2'), tx('transitions.seed.previewLabel'), tx('flow.transitions.p3.line')].join(', ') }) }] },
    { at: '2027-01-20T10:30:00', as: 'st.choiym', go: ['TRN-02', { rid: 'R_EUNSOOK' }], say: tx('flow.transitions.p3.say.4'),
      steps: [{ see: tx('transitions.seed.staffLabel.4') }, { no: tx('flow.transitions.p3.name.2') }, { as: 'm.eunsook' }, { go: 'TRN-09' }, { see: tx('transitions.seed.memberLabel.4') }, { no: tx('flow.transitions.p3.name.3') }] },
  ],
};
