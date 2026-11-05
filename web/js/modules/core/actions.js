// 코어 행동(data-act). 불가능한 동작은 model의 refuse가 막고, 화면은 버튼을 빼거나 막는다.
import { tx } from '../../lib/text.js';
import { go, me, refuse, toast, view } from '../../lib/kit.js';
import * as M from './model.js';

const site = 'S1';
const firstUnit = () => M.C().units.find((u) => u.siteId === site).id;
const formKeys = ['fRoom', 'fStart', 'fP1', 'fP2', 'fDeposit', 'fIns', 'fJeon', 'cName', 'cRel', 'cPhone', 'cOrder', 'err'];
const clearForm = () => formKeys.forEach((k) => { delete view[k]; });
const absForm = () => ({ rid: M.fv('abRes', M.openableResidents()[0]?.id), start: M.fv('abStart', M.today()), unknown: M.fv('abUnknown', view.abExp ? '' : '1'), exp: view.abExp, route: M.fv('abRoute', 'FRONT') });
const expectedOf = (f) => (f.unknown || !f.exp ? null : f.exp);
// 입력 오류는 화면 안에도 보이게 view.err에 담고 refuse로 거부한다.
const guard = (fn) => { try { fn(); } catch (e) { view.err = e.message; throw e; } };

export const actions = {
  'core.draft.open': () => { M.need('contract'); clearForm(); const c = M.createDraft(site); view.dialog = 'draft'; view.draftId = c.id; view.sel = c.id; },
  'core.draft.resume': (a) => { clearForm(); view.dialog = 'draft'; view.draftId = a.id; view.sel = a.id; },
  'core.draft.discard': (a) => { M.discardDraft(a.id); clearForm(); view.dialog = ''; view.draftId = ''; view.sel = ''; },
  'core.contact.add': (a) => {
    delete view.err;
    guard(() => M.addContact(a.id, { name: view.cName, relation: M.fv('cRel', 'CHILD'), phone: view.cPhone, order: M.fv('cOrder', M.contactsOfContract(a.id).length + 1) }));
    ['cName', 'cPhone', 'cOrder'].forEach((k) => { delete view[k]; });
  },
  'core.contract.sign': (a) => {
    delete view.err;
    guard(() => {
      if ((view.cName || '').trim()) {
        M.addContact(a.id, { name: view.cName, relation: M.fv('cRel', 'CHILD'), phone: view.cPhone, order: M.fv('cOrder', M.contactsOfContract(a.id).length + 1) });
        ['cName', 'cPhone', 'cOrder'].forEach((k) => { delete view[k]; }); // 다시 눌러도 같은 분이 두 번 들어가지 않게
      }
      M.signDraft(a.id, { unitId: M.fv('fRoom', firstUnit()), startDate: M.fv('fStart', M.today()), p1: view.fP1, p2: view.fP2, deposit: view.fDeposit, insurance: M.fv('fIns', 'UNKNOWN'), jeonse: M.fv('fJeon', '') });
    });
    clearForm(); view.dialog = ''; view.draftId = ''; view.sel = a.id;
  },
  'core.contract.movein': (a) => { M.moveIn(a.id); },
  'core.contract.succeed': (a) => { const n = M.succeed(a.id); view.dialog = ''; view.sel = n.id; },
  'core.deposit.save': (a, f) => { M.saveDeposit(a.id, f.ins, f.jeon); },

  'core.meal.demo': () => { M.need('mealUpload'); const m = M.monthNow(); view.csvText = M.C().demoCsv[m]; view.csvName = `meal-skips-${m}.csv`; },
  'core.meal.apply': () => {
    const r = M.applyCsv(view.csvText || '', M.monthNow());
    view.csvText = ''; view.csvName = '';
    toast(r.dup ? `${tx('core.action.text.4', { dup: r.dup })}` : `${tx('core.action.text.3', { length: r.ok.length })}`);
  },
  'core.meal.cancel': () => { view.csvText = ''; view.csvName = ''; },
  'core.meal.close': () => { M.closeMonth(M.monthNow()); view.dialog = ''; },

  'core.bill.run': (a) => {
    M.need('bill');
    const p = M.monthNow();
    if (!M.closingOf(p) && !a.force) { view.needClose = '1'; return; }
    view.needClose = ''; view.tab = 'list'; view.inv = '';
    const r = M.runBilling(site, p);
    toast(`${tx('core.action.text.2', { count: r.count, reduced: r.reduced })}`);
  },
  'core.bill.issue': () => { M.issueBilling(site, M.monthNow()); view.dialog = ''; },
  'core.pay.start': (a) => { go('CORE-16', { at: M.startPayment(a.id).id }); },
  'core.pay.close': (a) => {
    const t = M.closePayment(a.id, a.r);
    if (t?.status === 'CANCELLED') go('CORE-08'); else go('CORE-16', { at: a.id });
  },
  'core.inquiry.create': (a) => {
    M.createInquiry(a.id, me().residentId);
    toast(tx('core.action.toast.2'));
  },
  'core.inquiry.answer': (a) => { M.need('bill'); const q = M.C().inquiries.find((x) => x.id === a.id); if (q) q.status = 'ANSWERED'; },

  'core.rate.save': () => {
    delete view.err; delete view.rateSaved; delete view.rateNone;
    guard(() => {
      const done = M.saveRules(site, M.rateForm(site));
      if (done.length) { view.rateSaved = done; Object.keys(M.rateFields(site)).forEach((k) => { delete view[k]; }); } else view.rateNone = '1';
    });
  },
  'core.absence.review': () => {
    delete view.err;
    guard(() => { const f = absForm(); if (!f.rid) refuse(tx('core.action.refuse')); M.startAbsence(f.rid, f.start, expectedOf(f), f.route, true); });
    view.dialog = 'startConfirm';
  },
  'core.absence.start': () => {
    const f = absForm();
    M.startAbsence(f.rid, f.start, expectedOf(f), f.route);
    ['abRes', 'abStart', 'abExp', 'abUnknown', 'abRoute', 'err'].forEach((k) => { delete view[k]; });
    view.dialog = '';
  },
  'core.absence.return': () => { M.endAbsence(view.target); view.dialog = ''; },
  'core.absence.expected': () => {
    delete view.err;
    const unknown = M.fv('abUnknown', view.abExp ? '' : '1');
    const before = M.changeExpected(view.target, unknown || !view.abExp ? null : view.abExp);
    toast(before ? `${tx('core.action.text', { before })}` : tx('core.action.toast'));
    ['abExp', 'abUnknown'].forEach((k) => { delete view[k]; });
    view.dialog = '';
  },
  'core.absence.cancel': () => { M.cancelAbsence(view.target, view.why); delete view.why; view.dialog = ''; },
};
