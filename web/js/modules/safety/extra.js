// 41장면 밖 화면의 단계: SAF-08 기기 상태, SAF-10 기기 연결, SAF-09 회원 안심 알림, SAF-11 규칙과 당번표, SAF-16 사고·학대 보고, SAF-17 비상 때 재실 명단.
// 41장면 뒤(2027-01-08)에서 이어 누른다. 알림 번호에 기대지 않고 화면의 글자를 눌러 간다.
import { tx } from '../../lib/text.js';
import { PERSONAS, RESIDENTS } from '../../lib/people.js';

const D1 = '2027-01-11', D2 = '2027-01-12', D3 = '2027-01-13';
const RL = (rid) => tx('safety.rl.text', { room: RESIDENTS[rid].room, name: RESIDENTS[rid].name });
const NAME = (id) => PERSONAS[id].name;
const SEND = (kind, room, evt, at) => [{ fill: 'kind', value: kind }, { fill: 'room', value: room }, { fill: 'evt', value: evt }, { fill: 'at', value: at }, { click: tx('safety.SEND.click') }];
const TAKE = (name) => [{ click: name }, { click: tx('safety.TAKE.click') }, { click: tx('safety.TAKE.click') }];
const CARD_ONLY = (name) => [{ click: name }, { click: tx('safety.CARD_ONLY.click') }];
// 만나서 조치를 쓰고 보호자에게 알릴 사람이 없는 알림을 기록으로 마친다
const RECORD_END = [{ click: tx('safety.shared.click.6') }, { click: tx('safety.shared.click.15') }, { click: tx('safety.shared.click.21') }, { click: tx('safety.shared.click.8') }, { click: tx('safety.shared.click.12') }, { see: tx('safety.shared.see.42') }];

export default [
  // --- SAF-08 기기 상태 ---
  { at: `${D1}T09:00:00`, as: 'st.choiym', go: ['SAF-01'], say: tx('safety.extra.say.1'),
    steps: [{ sel: '.stat-strip a[href="#/SAF-08"]' }, { see: tx('SAF-08.head', { total: 20, ok: 19 }) }, { see: tx('SAF-08.cut.bed') }, { see: tx('SAF-08.cut.tail') }, { see: tx('SAF-08.badge.end') },
      { click: tx('SAF-08.btn.check') }, { see: tx('SAF-08.flash.check') },
      { click: tx('safety.SOURCE_LABEL.CALLBELL'), within: 'table' }, { see: tx('SAF-08.panel.empty') }, { no: tx('SAF-08.btn.check') }] },
  // --- SAF-10 기기 연결: 동의가 없는 기기의 신호는 기록만, 연결한 뒤에는 알림 ---
  { at: `${D1}T23:10:00`, as: 'hq.jung', go: ['SAF-06'], say: tx('safety.extra.say.2'),
    steps: [...SEND('ACCESS_LOG', 'R_YEONGSUN', 'door-ext-1', '23:10:00'), { no: tx('safety.shared.TAKE') }] },
  { at: `${D1}T23:12:00`, as: 'st.choiym', go: ['SAF-01'], say: tx('safety.extra.say.3'),
    steps: [{ click: tx('safety.shared.click.20') }, { see: tx('SAF-01.unlinked', { v: tx('safety.SOURCE_LABEL.ACCESSLOG') }) }] },
  { at: `${D1}T23:15:00`, as: 'st.choims', go: ['SAF-08', { tab: 'LINK' }], say: tx('safety.extra.say.4'),
    steps: [{ see: tx('SAF-10.intro') }, { fill: 'ldev', value: 'ACCESS_LOG' }, { fill: 'lres', value: 'R_YEONGSUN' }, { click: tx('SAF-10.btn.save') }, { see: tx('SAF-10.refuse.consent') },
      { fill: 'k1d', value: `${D1} 23:15` }, { fill: 'k3d', value: `${D1} 23:16` }, { click: tx('SAF-10.by.guardian') }, { click: tx('SAF-10.btn.save') },
      { see: tx('SAF-10.flash.saved', { name: RESIDENTS.R_YEONGSUN.name }) }, { see: tx('SAF-10.kind.assist') }, { see: tx('SAF-10.noconsent') }] },
  { at: `${D1}T23:20:00`, as: 'hq.jung', go: ['SAF-06'], say: tx('safety.extra.say.5'),
    steps: [...SEND('ACCESS_LOG', 'R_YEONGSUN', 'door-ext-2', '23:20:00'), { see: tx('safety.shared.see.61') }] },
  { at: `${D1}T23:21:00`, as: 'st.kimhj', go: ['SAF-01'], say: tx('safety.extra.say.6'),
    steps: [...TAKE(RL('R_YEONGSUN')), ...RECORD_END] },
  // --- SAF-09 회원 안심 알림: 호출은 실제 신호가 되어 SAF-01에 나타난다 ---
  { at: `${D2}T10:00:00`, as: 'm.malsun', go: ['SAF-09'], say: tx('safety.extra.say.7'),
    steps: [{ see: tx('SAF-09.idle') }, { click: tx('SAF-09.demo.btn') }, { see: tx('SAF-09.step.1.sub') }, { see: tx('SAF-09.call.note') }, { go: 'COM-07' }, { see: tx('COM-07.tile.2') }] },
  { at: `${D2}T10:01:00`, as: 'st.yoonsy', go: ['SAF-01'], say: tx('safety.extra.say.8'),
    steps: [{ see: tx('safety.shared.see.63') }, ...TAKE(RL('R_MALSUN'))] },
  { at: `${D2}T10:02:00`, as: 'm.malsun', go: ['SAF-09'], say: tx('safety.extra.say.9'),
    steps: [{ see: tx('SAF-09.step.2.sub', { pn: NAME('st.yoonsy') }) }, { no: tx('SAF-09.demo.btn') }] },
  // --- SAF-16 사고·학대 보고: 알림 처리의 더보기에서 연다 ---
  { at: `${D2}T10:05:00`, as: 'st.yoonsy', go: ['SAF-01'], say: tx('safety.extra.say.10'),
    steps: [...CARD_ONLY(RL('R_MALSUN')), { click: tx('SAF-02.menu.btn') }, { click: tx('SAF-02.menu.incident') }, { see: tx('SAF-16.title') }, { see: tx('SAF-16.scope') },
      { fill: 's16gw', value: tx('safety.extra.account') }, { sel: 'input[name="s16nt"][value="Y"]' }, { fill: 's16nt1', value: '10:08' },
      { sel: 'input[name="s16rp"][value="N"]' }, { sel: '[data-act="saf.incident.review"]' }, { click: tx('SAF-16.btn.save'), within: '.dialog' },
      { see: tx('SAF-16.hintduty') }, { see: tx('safety.extra.account') }, { click: tx('SAF-16.btn.add') }, { fill: 's16add', value: tx('safety.extra.add') }, { click: tx('SAF-16.btn.add') },
      { see: tx('safety.extra.add') }, { see: tx('SAF-16.btn.add') }] },
  { at: `${D2}T10:20:00`, as: 'st.choiym', go: ['SAF-01'], say: tx('safety.extra.say.11'),
    steps: [{ click: tx('safety.shared.click.20') }, { click: tx('SAF-16.title') }, { see: tx('safety.extra.account') }, { see: tx('SAF-16.btn.add') }] },
  { at: `${D2}T10:22:00`, as: 'hq.jung', go: ['SAF-01'], say: tx('safety.extra.say.12'),
    steps: [{ click: tx('safety.shared.click.20') }, { click: tx('SAF-16.title') }, { see: tx('safety.extra.add') }, { no: tx('SAF-16.btn.add') }] },
  { at: `${D2}T10:30:00`, as: 'st.yoonsy', go: ['SAF-01'], say: tx('safety.extra.say.13'),
    steps: [...CARD_ONLY(RL('R_MALSUN')), ...RECORD_END] },
  { at: `${D2}T10:35:00`, as: 'm.malsun', go: ['SAF-09'], say: tx('safety.extra.say.14'),
    steps: [{ see: tx('SAF-09.step.4.sub') }, { click: tx('SAF-09.rec.h2') }, { see: tx('SAF-09.rec.title', { pn: NAME('st.yoonsy') }) }] },
  // --- SAF-09 비상 때 도움, SAF-17 비상 때 재실 명단 ---
  { at: `${D2}T18:00:00`, as: 'm.eunsook', go: ['SAF-09'], say: tx('safety.extra.say.15'),
    steps: [{ click: tx('SAF-09.assist.btn') }, { see: tx('SAF-09.assist.done') }, { click: tx('SAF-09.dev.h2') }, { see: tx('SAF-09.dev.door') }] },
  { at: `${D2}T18:20:00`, as: 'st.kimhj', go: ['SAF-01'], say: tx('safety.extra.say.16'),
    steps: [{ sel: '[data-set="dialog=evac"]' }, { see: tx('SAF-01.evac.title') }, { see: tx('SAF-01.evac.p') }, { click: tx('SAF-01.evac.open'), within: '.dialog' },
      { see: tx('SAF-17.title') }, { see: tx('SAF-17.intro') }, { see: tx('SAF-17.badge.help') }] },
  { at: `${D2}T18:22:00`, as: 'st.kimhj', go: ['SAF-17'], say: tx('safety.extra.say.17'),
    steps: [{ click: RL('R_OKJA') }, { click: tx('SAF-17.btn.check') }, { see: tx('SAF-17.done.sub', { hm: '18:22', pn: NAME('st.kimhj') }) },
      { click: RL('R_OKJA') }, { see: tx('SAF-17.again', { hm: '18:22', pn: NAME('st.kimhj') }) }] },
  { at: `${D2}T18:25:00`, as: 'st.parksj', go: ['SAF-17'], say: tx('safety.extra.say.18'),
    steps: [{ click: RL('R_EUNSOOK') }, { click: tx('SAF-17.btn.check') }, { see: tx('SAF-17.done.sub', { hm: '18:25', pn: NAME('st.parksj') }) }] },
  { at: `${D2}T18:27:00`, as: 'st.kimhj', go: ['SAF-17'], say: tx('safety.extra.say.25'),
    steps: [{ click: RL('R_OKJA') }, { click: tx('SAF-17.fix.btn') }, { see: tx('SAF-17.fix.title') }, { see: tx('SAF-17.fix.hint') }, { fill: 'fixWhy', value: tx('safety.extra.fixWhy') }, { click: tx('SAF-17.fix.save'), within: '.dialog' },
      { see: tx('SAF-17.fix.line', { hm: '18:27', pn: NAME('st.kimhj'), why: tx('safety.extra.fixWhy') }) }, { see: tx('SAF-17.done.sub', { hm: '18:22', pn: NAME('st.kimhj') }) }, { see: tx('SAF-17.badge.fix') },
      { click: tx('SAF-17.btn.check') }, { see: tx('SAF-17.done.sub', { hm: '18:27', pn: NAME('st.kimhj') }) }] },
  // --- SAF-11 규칙과 당번표: 저장한 값이 다음 신호에 쓰인다 ---
  { at: `${D3}T09:00:00`, as: 'st.choiym', go: ['SAF-11'], say: tx('safety.extra.say.19'),
    steps: [{ see: tx('SAF-11.hint.rules') }, { sel: '[data-set="rule=CALL_BELL"]' }, { fill: 'rint', value: '3' }, { fill: 'rtpl', value: tx('safety.extra.template') }, { sel: '[data-act="saf.cfg.rule"]' },
      { see: tx('SAF-11.flash.rule', { n: 2 }) }, { see: tx('SAF-11.interval', { n: 3 }) },
      { fill: 'c1', value: 'st.parksj' }, { fill: 'vspan', value: '10:00~17:30' }, { click: tx('SAF-11.btn.save') },
      { see: tx('SAF-11.flash.duty') }, { see: tx('SAF-11.flash.visit') }, { see: tx('SAF-11.h2.log') }] },
  { at: `${D3}T09:10:00`, as: 'st.yoonsy', go: ['SAF-12'], say: tx('safety.extra.say.20'),
    steps: [{ see: tx('SAF-12.p.7', { start: '10:00', end: '17:30' }) }] },
  { at: `${D3}T09:15:00`, as: 'hq.jung', go: ['SAF-06'], say: tx('safety.extra.say.21'),
    steps: [...SEND('CALL_BELL', 'R_YEONGSUN', 'bell-ext-3', '09:15:00'), { see: tx('safety.shared.see.63') }] },
  { at: `${D3}T09:16:00`, as: 'st.parksj', go: ['SAF-01'], say: tx('safety.extra.say.22'),
    steps: [{ see: tx('safety.shared.text.12', { m: 2, s: 0, second: NAME('st.kimhj') }) }, ...TAKE(RL('R_YEONGSUN')), ...RECORD_END] },
  // --- 권한 ---
  { at: `${D3}T09:30:00`, as: 'st.choims', go: ['SAF-11'], say: tx('safety.extra.say.23'),
    steps: [{ see: tx('SAF-11.denied') }, { go: 'SAF-17' }, { see: tx('SAF-17.title') }, { no: tx('SAF-17.refuse.role') }] },
  { at: `${D3}T09:32:00`, as: 'hq.jung', go: ['SAF-17'], say: tx('safety.extra.say.24'),
    steps: [{ see: tx('safety.shared.denied') }, { go: 'SAF-11' }, { see: tx('SAF-11.hint.rules') }] },
];
