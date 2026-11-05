import { tx } from '../lib/text.js';
import { loadData } from '../lib/text.js';
// 안심 알림(B). 화면 SAF-01·02·06·12·13(screens.js), SAF-08·10(devices.js), SAF-09(home.js), SAF-11(config.js), SAF-16(incident.js), SAF-17(evac.js). 상태와 규칙은 safety/logic.js, 장면은 safety/flow.js, 41장면 밖 단계는 safety/extra.js.
import { nowISO, me, refuse, setClock, view } from '../lib/kit.js';
import * as L from './safety/logic.js';
import { screens as baseScreens } from './safety/screens.js';
import * as dev from './safety/devices.js';
import * as home from './safety/home.js';
import * as cfg from './safety/config.js';
import * as inc from './safety/incident.js';
import * as evac from './safety/evac.js';
import flow from './safety/flow.js';
import extra from './safety/extra.js';
import { ACTS, ROLES } from './safety/logic.js';
const SEED = await loadData('safety');


const handler = () => { if (!ROLES.handle.includes(me().key)) refuse(tx('safety.handler.refuse')); };
const mineOf = (id) => { const a = L.alertById(id); if (!a) refuse(tx('safety.mineOf.refuse')); return a; };
const clear = (...names) => names.forEach((n) => { delete view[n]; });

const actions = {
  // 시뮬레이터는 신호를 보내기 전에 데모 시계를 보낸 시각으로 맞춘다(prd US-13).
  'saf.sim.send': (_args, form) => {
    const at = (form.at || '').trim(), evt = (form.evt || '').trim();
    if (!/^\d{1,2}:\d{2}(:\d{2})?$/.test(at)) refuse(tx('safety.action.refuse.6'));
    if (!evt) refuse(tx('safety.action.refuse.5'));
    const sent = `${L.dateOf(nowISO())}T${(at.length <= 5 ? `${at}:00` : at).padStart(8, '0')}`;
    if (sent !== nowISO()) setClock(sent);
    const base = { vendorEventId: evt, residentId: form.room, receivedAt: sent, occurredAt: sent };
    if (form.kind === 'BED_SENSOR') {
      const m = evt.match(/(\d{2})(\d{2})$/);
      let occ = m ? `${L.dateOf(sent)}T${m[1]}:${m[2]}:00` : L.addSec(sent, -1800);
      if (occ > sent) occ = L.addSec(occ, -86400);
      L.receive({ ...base, source: 'BED_SENSOR', kind: 'BED_EXIT_NO_RETURN', occurredAt: occ, value: { durationMin: Math.floor(L.secBetween(occ, sent) / 60) } });
    } else if (form.kind === 'CALL_BELL') L.receive({ ...base, source: 'CALL_BELL', kind: 'CALL_BELL_PRESSED' });
    else L.receive({ ...base, source: 'ACCESS_LOG', kind: 'DOOR_OPENED', value: { door: 'MAIN_1F', by: 'RESIDENT_CARD' } });
  },
  'saf.front.register': () => {
    if (!ROLES.front.includes(me().key)) refuse(tx('safety.action.refuse.4'));
    if (!view.room) refuse(tx('safety.action.refuse.3'));
    const now = nowISO();
    L.receive({ source: 'FRONT_CALL', kind: 'FRONT_CALL', vendorEventId: `front:${now}:${view.room}`, residentId: view.room, occurredAt: now, receivedAt: now, by: me().id });
    view.flash = `${tx('safety.action.text.4', { first: L.dutyNames().first })}`;
    clear('dialog', 'room');
  },
  'saf.ack': (args) => { handler(); L.acknowledge(mineOf(args.id), me().id, me()); clear('dialog'); },
  'saf.meet': (args) => { const a = mineOf(args.id); if (a.ackBy !== me().id) refuse(`${tx('safety.action.text.3', { pn: L.pn(a.ackBy) })}`); L.stampMeeting(a); view.meet = args.meet; },
  'saf.call.log': (args) => {
    const a = mineOf(args.id);
    if (a.ackBy !== me().id) refuse(`${tx('safety.action.text.3', { pn: L.pn(a.ackBy) })}`);
    L.logCall(a, me().id, view.callres); clear('callres');
  },
  'saf.record.save': (args) => {
    const a = mineOf(args.id), acts = ACTS.map(([k]) => k).filter((k) => view[`act_${k}`]), depart = (view.depart || '').trim();
    if (acts.includes('WENT_TO_HOSPITAL') && !/^\d{1,2}:\d{2}$/.test(depart)) refuse(tx('safety.action.refuse.2'));
    const res = L.saveRecord(a, me().id, { meet: view.meet, acts, memo: view.memo, escort: view.escort || L.shiftAt().slots.find(Boolean), depart: depart.padStart(5, '0') });
    clear('meet', 'memo', 'escort', 'depart', 'step', 'contacts', ...ACTS.map(([k]) => `act_${k}`));
    if (res === 'NOT_MET') view.flash = `${tx('safety.action.text.2', { third: L.dutyNames().third })}`;
  },
  'saf.guardian.post': (args) => { L.postGuardian(mineOf(args.id), view.second); clear('second', 'withhold'); },
  'saf.withhold.save': (args) => { L.withholdGuardian(mineOf(args.id), { why: view.why, sub: view.sub || 'OTHER_RESIDENT', who: view.who, when: view.when }); clear('why', 'sub', 'who', 'when', 'withhold'); },
  'saf.visit.save': () => {
    if (!ROLES.visitWrite.includes(me().key)) refuse(tx('safety.action.refuse'));
    L.saveVisit(view.sel || L.defaultVisitSel(), view.vr, me().id); clear('sel', 'vr');
  },
  'saf.escort.return': (args) => {
    handler();
    const h = L.returnEscort(args.id, (view.rtime || '').trim(), me().id);
    view.flash = `${tx('safety.action.text', { hm: L.hm(h.returnedAt), pn: L.pn(me().id) })}`;
    clear('ret', 'rtime');
  },
};

export default {
  key: 'safety',
  seed: () => structuredClone(SEED),
  api: L.apiFns,
  tick: L.tick,
  actions: { ...actions, ...dev.actions, ...home.actions, ...cfg.actions, ...inc.actions, ...evac.actions },
  screens: { ...baseScreens, ...dev.screens, ...home.screens, ...cfg.screens, ...inc.screens, ...evac.screens },
  flow,
  extra,
};
