// 코어 장면 단계(mvp-screens 5절). 2~5, 18(ord 5), 26, 27, 29(ord 1), 30(ord 2), 36.
import { tx } from '../../lib/text.js';
import { fmt } from '../../lib/kit.js';
const ok = { click: tx('core.ok.click'), within: '.dialog' };
const closeMonth = [{ click: tx('core.closeMonth.click') }, { see: tx('core.closeMonth.see.2') }, { click: tx('core.closeMonth.click'), within: '.dialog' }, { see: tx('core.closeMonth.see') }];
const issue = (n, due) => [{ click: tx('core.issue.click') }, { see: `${tx('core.issue.text', { n })}` }, { click: tx('core.issue.click'), within: '.dialog' }, { see: due }];

export const flow = [
  { scene: 2, ord: 1, at: '2026-10-01T09:30:00', as: 'st.parksy', go: ['CORE-04'], say: tx('flow.core.s2.say.2'),
    steps: [{ click: tx('CORE-05.title') }, { see: tx('core.shared.h3') }, { fill: 'fP1', value: tx('flow.core.s2.value') }, { fill: 'fP2', value: tx('flow.core.s2.value.4') }, { see: tx('flow.core.s2.see.8') },
      { fill: 'fDeposit', value: '580,000,000' }, { fill: 'fIns', value: 'YES' },
      { fill: 'cName', value: tx('safety.FALLBACK_CONTACTS.name.2') }, { fill: 'cRel', value: 'CHILD' }, { fill: 'cPhone', value: '010-0000-0000' }, { fill: 'cOrder', value: '1' }, { click: tx('core.shared.btn.5') },
      { see: tx('flow.core.s2.see.7') }, { fill: 'cName', value: tx('safety.FALLBACK_CONTACTS.name') }, { fill: 'cPhone', value: '010-0000-0000' },
      { click: tx('core.shared.text') }, { see: tx('CORE-14.card.17') }, { see: tx('flow.core.s2.see.5') },
      { click: tx('core.shared.btn.4') }, { see: tx('CORE-02.dt.3') }, { see: tx('core.shared.push') }, { see: tx('flow.core.s2.see.2') }] },
  { scene: 2, ord: 2, at: '2026-10-01T09:50:00', as: 'st.parksy', go: ['CORE-04'], say: tx('flow.core.s2.say'),
    steps: [{ click: tx('CORE-05.title') }, { fill: 'fP1', value: tx('flow.core.s2.value') }, { click: tx('core.shared.text') }, { see: tx('flow.core.s2.see') }, { click: tx('common.popHtml.btn.2') }, { no: tx('core.STATUS.DRAFT') }] },

  { scene: 3, ord: 1, at: '2026-10-31T18:00:00', as: 'st.parksy', go: ['CORE-06'], say: tx('flow.core.s3.say.3'),
    steps: [{ click: tx('flow.core.s3.click.3') }, { see: tx('flow.core.s3.see.14') }, { click: tx('CORE-06.text.2') },
      { see: tx('CORE-06.h2.2') }, { see: tx('flow.core.s3.see.12') }, ...closeMonth, { see: tx('flow.core.s3.see.11') }] },
  { scene: 3, ord: 2, at: '2026-10-31T18:20:00', as: 'st.parksy', go: ['CORE-07'], say: tx('flow.core.s3.say.2'),
    steps: [{ click: tx('CORE-07.btn.5') }, { see: tx('flow.core.s3.see.8') }, { see: tx('flow.core.s3.see.10') }, ...issue(7, '2026-11-10'), { see: '2026-11-10' }] },
  { scene: 3, ord: 3, at: '2026-10-31T19:00:00', as: 'm.eunsook', go: ['CORE-08'], say: tx('flow.core.s3.say'),
    steps: [{ see: tx('flow.core.s3.see.9') }, { see: tx('flow.core.s3.see.8') }, { see: tx('flow.core.s3.see.7') }, { see: tx('flow.core.s3.see.6') },
      { see: tx('flow.core.s3.see.5') }, { see: tx('flow.core.s3.see.4') }, { see: tx('flow.core.s3.see.3') }, { see: tx('COM-09.tile.10') }, { see: tx('flow.core.s3.see') }] },

  { scene: 4, ord: 1, at: '2026-11-10T10:00:00', as: 'st.parksy', go: ['CORE-04'], say: tx('flow.core.s4.say'),
    steps: [{ see: tx('flow.core.s4.see.6') }, { click: tx('core.shared.btn.3') }, { see: tx('core.shared.dlg') }, { see: tx('flow.core.s4.see.4') },
      { click: tx('core.shared.modalBtn') }, { see: tx('core.STATUS.SUCCEEDED') }, { see: tx('flow.core.s4.see.2') }, { see: tx('flow.core.s4.see') }] },

  { scene: 5, ord: 1, at: '2026-11-10T11:00:00', as: 'ow.daon', go: ['CORE-02'], say: tx('flow.core.s5.say.2'),
    steps: [{ see: tx('flow.core.s5.see.5') }, { no: tx('flow.core.s5.no.2') }, { go: 'CORE-02', params: { site: 'S1' } }, { see: tx('core.shared.text.5') }] },
  { scene: 5, ord: 2, at: '2026-11-10T11:10:00', as: 'ow.onnuri', go: ['CORE-09'], say: tx('flow.core.s5.say'),
    steps: [{ see: tx('flow.core.s5.see.3') }, { see: tx('flow.core.s5.see.2') }, { see: tx('flow.core.s5.see') }, { no: tx('flow.core.s5.no') }] },

  { scene: 18, ord: 5, at: '2026-11-17T17:05:00', as: 'st.parksy', go: ['CORE-07', { tab: 'usage' }], say: tx('flow.core.s18.say'),
    steps: [{ see: tx('CORE-07.tabs') }, { see: tx('flow.core.s18.see.4') }, { see: tx('core.ITEM_LABEL.LAUNDRYBEDDING') }, { see: tx('flow.core.s18.see.2') }, { see: tx('common.NAV.text.10') }] },

  { scene: 26, ord: 1, at: '2026-11-30T18:00:00', as: 'st.parksy', go: ['CORE-06'], say: tx('flow.core.s26.say.3'),
    steps: [{ see: tx('CORE-06.h2.2') }, ...closeMonth] },
  { scene: 26, ord: 2, at: '2026-11-30T18:20:00', as: 'st.parksy', go: ['CORE-07'], say: tx('flow.core.s26.say.2'),
    steps: [{ click: tx('CORE-07.btn.5') }, { see: tx('flow.core.s26.see.4') }, ...issue(7, '2026-12-10')] },
  { scene: 26, ord: 3, at: '2026-11-30T18:30:00', as: 'st.parksy', go: ['CORE-07'], say: tx('flow.core.s26.say'),
    steps: [{ sel: '[data-set="inv=CT-OKJA"]' }, { see: tx('CORE-07.map.2') }, { see: tx('flow.core.s26.see.2') }, { see: tx('flow.core.s26.see') }] },

  { scene: 27, ord: 1, at: '2026-12-01T10:00:00', as: 'ow.onnuri', go: ['CORE-09'], say: tx('flow.core.s27.say.2'),
    steps: [{ click: tx('common.NAV.text.16') }, { see: tx('flow.core.s27.see.6') }, { see: tx('flow.core.s27.see.5') }, { see: tx('CORE-14.card.11') }, { see: tx('CORE-14.card.15') }, { no: tx('flow.core.s27.no.2') }] },
  { scene: 27, ord: 2, at: '2026-12-01T10:10:00', as: 'ow.daon', go: ['CORE-14'], say: tx('flow.core.s27.say'),
    steps: [{ see: tx('flow.core.s27.see.2') }, { see: tx('flow.core.s27.see') }, { no: tx('flow.core.s27.no') }] },

  { scene: 29, ord: 1, at: '2026-12-02T11:10:00', as: 'st.choims', go: ['CORE-13'], say: tx('flow.core.s29.say'),
    steps: [{ see: tx('flow.core.s29.see.4') }, { click: tx('CORE-13.btn') }, { fill: 'abRes', value: 'R_EUNSOOK' }, { click: tx('common.altPath.p') }, { click: tx('core.ok.click') }, { see: tx('CORE-13.dlg.5') }, { see: tx('flow.core.s29.see.2') }, ok, { see: tx('flow.core.s29.see') }, { see: '2026-12-02' }] },

  { scene: 30, ord: 2, at: '2026-12-07T16:40:00', as: 'st.choims', go: ['CORE-13'], say: tx('flow.core.s30.say'),
    steps: [{ see: tx('CORE-13.span') }, { sel: 'button[data-who="R_EUNSOOK"][data-set*="dialog=return"]' }, { see: tx('CORE-13.dlg.3') }, { see: '2026-12-07' }, ok, { no: '2026-12-02' }, { see: tx('flow.core.s30.see') }] },

  { scene: 36, ord: 1, at: '2026-12-31T17:00:00', as: 'st.choims', go: ['CORE-06'], say: tx('flow.core.s36.say.3'),
    steps: [{ click: tx('flow.core.s36.click.3') }, { see: tx('flow.core.s36.see.4') }, { click: tx('CORE-06.text.2') }, { see: tx('CORE-06.h2.2') }] },
  { scene: 36, ord: 2, at: '2026-12-31T17:30:00', as: 'st.parksy', go: ['CORE-06'], say: tx('flow.core.s36.say.2'), steps: [...closeMonth] },
  { scene: 36, ord: 3, at: '2026-12-31T18:00:00', as: 'st.parksy', go: ['CORE-07'], say: tx('flow.core.s36.say'),
    steps: [{ click: tx('CORE-07.btn.5') }, { see: tx('flow.core.s36.see.2') }, { see: tx('flow.core.s36.see') }, ...issue(7, '2027-01-10')] },
];

// 41장면 밖 화면(③단계). CORE-03 요금 규칙은 본사 관리자만 저장하고, 저장한 값은 다음 청구와 새 계약에 쓰인다.
const rateSaved = [
  { see: tx('CORE-03.savedPrice', { from: '2027-02-01' }) }, { see: tx('CORE-03.savedSched', { from: '2027-01-11', issue: tx('CORE-03.issueDay', { n: 25 }), due: 14 }) }, { see: tx('CORE-03.absScope') },
  { see: tx('CORE-03.hist.single', { a: fmt.won(2100000), b: fmt.won(2200000) }) }, { see: tx('CORE-03.hist.due', { a: tx('CORE-03.dueAfter', { n: 10 }), b: tx('CORE-03.dueAfter', { n: 14 }) }) },
];
export const extra = [
  { at: '2027-01-08T10:00:00', as: 'p.taeho', go: ['CORE-08'], say: tx('flow.core.pay.say'),
    steps: [{ sel: 'a[href*="CORE-16"]' }, { see: tx('CORE-16.proxy', { name: tx('flow.core.pay.proxy'), nameOf: tx('flow.core.pay.name') }) }, { sel: '[data-act="core.pay.start"]' }, { see: tx('CORE-16.mock.h1') }, { click: tx('CORE-16.mock.fail') }, { see: tx('CORE-16.fail.p') }, { click: tx('CORE-16.result.back') },
      { sel: 'a[href*="CORE-16"]' }, { click: tx('CORE-16.back') }, { sel: 'a[href*="CORE-16"]' }, { sel: '[data-act="core.pay.start"]' }, { click: tx('CORE-16.mock.stop') }, { see: tx('CORE-08.pay.btn') },
      { sel: 'a[href*="CORE-16"]' }, { sel: '[data-act="core.pay.start"]' }, { click: tx('CORE-16.mock.ok') }, { see: tx('CORE-16.ok.p') }, { click: tx('CORE-16.result.back') }, { see: tx('CORE-08.pay.paid', { md: fmt.md('2027-01-08'), won: fmt.won(2910000) }) }, { no: tx('CORE-08.pay.btn') }] },
  { at: '2027-01-08T10:05:00', as: 'st.parksy', go: ['CORE-07'], say: tx('flow.core.pay.say.2'),
    steps: [{ see: tx('CORE-07.pay.PAID') }, { see: tx('CORE-07.pay.mock') }, { see: tx('CORE-07.pay.proxy', { name: tx('flow.core.pay.proxy') }) }] },
  { at: '2027-01-08T10:10:00', as: 'ow.onnuri', go: ['CORE-09'], say: tx('flow.core.pay.say.3'),
    steps: [{ see: tx('CORE-14.card.12') }, { see: fmt.won(2910000) }, { no: tx('flow.core.pay.proxy') }] },
  { at: '2027-01-10T08:30:00', as: 'st.parksy', go: ['CORE-04'], say: tx('flow.core.p3.say.rep'),
    steps: [{ click: tx('core.shared.tabs') }, { see: tx('core.shared.th.valid') }, { see: tx('core.shared.validUntil', { d: '2028-09-30' }) }, { see: tx('flow.core.p3.see.dohyun') }, { see: tx('core.BASIS.LIMITED') }, { see: tx('core.shared.validUntil', { d: '2028-04-30' }) }] },
  { at: '2027-01-10T09:00:00', as: 'hq.han', go: ['CORE-03'], say: tx('flow.core.p3.say.1'),
    steps: [{ see: tx('CORE-03.title') }, { see: tx('CORE-03.r1') }, { see: tx('CORE-03.issueLast') },
      { click: tx('CORE-03.save') }, { see: tx('CORE-03.noChange') },
      { fill: 'rSingle', value: '2100000.5' }, { click: tx('CORE-03.save') }, { see: tx('CORE-03.errAmount') },
      { fill: 'rSingle', value: '2200000' }, { click: tx('CORE-03.save') }, { see: tx('CORE-03.errOrder', { from: '2026-03-01' }) },
      { fill: 'rRecFrom', value: '2027-02-01' }, { fill: 'rIssue', value: '' }, { click: tx('CORE-03.save') }, { see: tx('CORE-03.errIssue') },
      { fill: 'rIssue', value: 'DAY' }, { fill: 'rIssueDay', value: '40' }, { click: tx('CORE-03.save') }, { see: tx('CORE-03.errIssueRange') }, { fill: 'rIssueDay', value: '25' }, { fill: 'rDue', value: '' }, { click: tx('CORE-03.save') }, { see: tx('CORE-03.errDue') },
      { fill: 'rDue', value: '14' }, { fill: 'rSchedFrom', value: '2027-01-11' }, { click: tx('CORE-03.on') }, { fill: 'rAbsFrom', value: '2027-01-09' },
      { click: tx('CORE-03.save') }, ...rateSaved, { see: tx('CORE-03.vh') }] },
  { at: '2027-01-10T09:30:00', as: 'hq.jung', go: ['CORE-03'], say: tx('flow.core.p3.say.2'),
    steps: [{ see: tx('core.need.refuse') }, { no: tx('CORE-03.save') }, { as: 'st.parksy' }, { go: 'CORE-03' }, { see: tx('core.need.refuse') }, { no: tx('CORE-03.save') }] },
  { at: '2027-01-10T10:00:00', as: 'st.choims', go: ['CORE-13'], say: tx('flow.core.p3.say.3'),
    steps: [{ click: tx('CORE-13.btn') }, { fill: 'abRes', value: 'R_KYUNGSOOK' }, { click: tx('common.altPath.p') }, { click: tx('core.ok.click') }, { see: tx('CORE-13.dlg.5') }, ok, { see: tx('flow.core.p3.see.1') }] },
  { at: '2027-01-14T10:00:00', as: 'st.choims', go: ['CORE-13'], say: tx('flow.core.p3.say.4'),
    steps: [{ sel: 'button[data-who="R_KYUNGSOOK"][data-set*="dialog=return"]' }, { see: tx('CORE-13.dlg.3') }, ok, { no: tx('flow.core.p3.see.1') }] },
  { at: '2027-01-31T18:00:00', as: 'st.parksy', go: ['CORE-06'], say: tx('flow.core.p3.say.5'), steps: [{ see: tx('CORE-06.h2.2') }, ...closeMonth] },
  { at: '2027-01-31T18:20:00', as: 'st.parksy', go: ['CORE-07'], say: tx('flow.core.p3.say.6'),
    steps: [{ click: tx('CORE-07.btn.5') }, { see: fmt.won(2856000) }, { see: fmt.won(2937000) }, ...issue(7, '2027-02-14'), { see: '2027-02-14' },
      { sel: '[data-set="inv=CT-KYUNGSOOK"]' }, { see: tx('CORE-07.p.abs', { minus: `\u2212${fmt.won(81000)}`, n: 1, recorded: 0, absence: 9, count: 9, won: fmt.won(9000) }) }] },
  { at: '2027-02-02T09:00:00', as: 'st.parksy', go: ['CORE-04', { sel: 'CT-OKJA' }], say: tx('flow.core.p3.say.7'),
    steps: [{ see: tx('core.shared.dd.2', { occupancy: 1, won: fmt.won(2100000) }) }, { click: tx('CORE-05.title') }, { sel: `#fRate[value="${fmt.won(2200000)}"]` }, { click: tx('common.popHtml.btn.2') }, { no: tx('core.STATUS.DRAFT') }] },
];
