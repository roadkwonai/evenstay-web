// SAF-17 비상 때 재실 명단. 동·층별 체크 목록, 줄을 고르면 옆 패널에서 [대피 확인함]. 마크업은 캔버스 보드(ref/SAF-17*.html)를 옮겼다.
import { tx } from '../../lib/text.js';
import { denied, dialog, esc, fmt, go, ic, me, refuse, view } from '../../lib/kit.js';
import * as L from './logic.js';
import { ROLES, hm, pn, rl } from './logic.js';
import { asof, crumb, demo, evacDialog, navBottom } from './screens.js';

const badges = (r) => `${r.help ? `<span class="badge">${tx('SAF-17.badge.help')}</span>` : ''}${r.absent ? `<span class="badge">${tx('SAF-17.badge.absent')}</span>` : ''}${r.fixed ? `<span class="badge">${tx('SAF-17.badge.fix')}</span>` : ''}`;

const history = (rid) => {
  const rows = L.evacHistory(rid);
  if (!rows.some((e) => e.type === 'CORRECT')) return '';
  return `<h3 class="t-label">${tx('SAF-17.hist')}</h3><ul class="plain">${rows.map((e) => `<li>${e.type === 'CHECK' ? tx('SAF-17.done.sub', { hm: hm(e.at), pn: pn(e.by) }) : tx('SAF-17.fix.line', { hm: hm(e.at), pn: pn(e.by), why: esc(e.why) })}</li>`).join('')}</ul>`;
};

function saf17() {
  if (!ROLES.evac.includes(me().key)) return denied(tx('safety.shared.denied'));
  const roll = L.evacRoll();
  const head = `<div class="page-head"><div>${crumb('SAF-01', tx('SAF-17.crumb'))}<h1 class="t-title2">${tx('SAF-17.title')}</h1></div><div class="row" style="gap: 8px;">${asof()}</div></div>`;
  if (!roll) {
    return { main: `${head}<section class="card" aria-label="${tx('SAF-17.title')}"><div class="empty"><span class="state-icon">${ic('clipboard-list')}</span><p class="t-body-md">${tx('SAF-17.closed')}</p><button class="btn btn-primary btn-sm" type="button" aria-haspopup="dialog" data-set="dialog=evac">${tx('SAF-01.evac.btn')}</button></div></section>${demo}`, overlay: `${evacDialog()}${navBottom('SAF-17')}` };
  }
  const groups = L.evacGroups(), all = groups.flatMap((g) => g.rows), done = all.filter((r) => r.check).length;
  const sel = all.find((r) => r.id === view.sel) || all.find((r) => !r.check) || all[0];
  const grp = groups.map((g) => `<div class="panelbox"><div class="grp-h"><h2 class="t-label">${g.label}</h2><span class="muted">${tx('SAF-17.grp', { n: g.rows.length, m: g.rows.filter((r) => r.check).length })}</span></div><ul class="chk">${g.rows.map((r) => `<li><button class="chk-row${r.check ? ' done' : ''}" type="button" aria-haspopup="dialog" data-set="sel=${r.id}"${r === sel ? ' aria-current="true"' : ''}><span class="lead">${ic(r.check ? 'circle-check' : 'circle')}</span><span class="body"><span class="title">${esc(rl(r.id))}${badges(r)}</span><span class="sub">${r.check ? tx('SAF-17.done.sub', { hm: hm(r.check.at), pn: pn(r.check.by) }) : r === sel ? tx('SAF-17.sub.sel') : tx('SAF-17.sub')}</span></span><span class="go">${r.check ? '' : tx('SAF-17.btn.check')}${ic('chevron-right')}</span></button></li>`).join('')}</ul></div>`).join('');
  const panel = sel ? `<aside class="panel-s" aria-label="${tx('SAF-17.panel.aria')}"><h2 class="t-heading2">${esc(rl(sel.id))}</h2>${badges(sel) ? `<div class="row" style="gap: 8px;">${badges(sel)}</div>` : ''}
          <p>${sel.check ? tx('SAF-17.again', { hm: hm(sel.check.at), pn: pn(sel.check.by) }) : tx('SAF-17.panel.p')}</p>
          ${sel.check ? `<div class="row"><button class="btn btn-ghost btn-sm" type="button" data-set="dialog=evacfix&sel=${sel.id}">${tx('SAF-17.fix.btn')}</button></div>` : `<div class="row"><button class="btn btn-secondary btn-sm" type="button" data-act="saf.evac.check" data-id="${sel.id}">${tx('SAF-17.btn.check')}</button></div>`}
          ${history(sel.id)}</aside>` : '';
  const fix = view.dialog === 'evacfix' && sel ? dialog(tx('SAF-17.fix.title'), `<p>${tx('SAF-17.fix.p', { rl: esc(rl(sel.id)) })}</p><div class="field"><label for="fix-why">${tx('SAF-17.fix.label')}</label><textarea id="fix-why" class="input" rows="2" data-bind="fixWhy" data-live></textarea></div>${(view.fixWhy || '').trim() ? '' : `<p class="muted">${tx('SAF-17.fix.hint')}</p>`}`,
    `<button class="btn btn-secondary btn-sm" type="button" data-set="dialog=&fixWhy=">${tx('SAF-17.fix.cancel')}</button><button class="btn btn-primary btn-sm" type="button" data-act="saf.evac.fix" data-id="${sel.id}"${(view.fixWhy || '').trim() ? '' : ' disabled'}>${tx('SAF-17.fix.save')}</button>`) : '';
  return { main: `${head}
      <p>${tx('SAF-17.intro')}</p>
      <p class="muted">${tx('SAF-17.opened', { pn: pn(roll.by), md: fmt.md(roll.at), hm: hm(roll.at) })}</p>
      ${done === all.length && all.length ? `<div class="alert alert-ok" role="status">${ic('circle-check')}<p>${tx('SAF-17.alldone')}</p></div>` : ''}
      <div class="stat-strip n3" aria-label="${tx('SAF-17.strip.aria')}">
        <div><span class="k">${tx('SAF-17.strip.all')}</span><span class="v">${tx('SAF-17.n', { n: all.length })}</span></div>
        <div><span class="k">${tx('SAF-17.strip.done')}</span><span class="v">${tx('SAF-17.n', { n: done })}</span></div>
        <div><span class="k">${tx('SAF-17.strip.left')}</span><span class="v">${tx('SAF-17.n', { n: all.length - done })}</span></div>
      </div>
      <div class="qwrap"><div class="queue"><div class="col">${grp}</div>${panel}</div></div>${demo}`, overlay: `${navBottom('SAF-17')}${fix}` };
}

export const actions = {
  'saf.evac.open': () => {
    if (!ROLES.evac.includes(me().key)) refuse(tx('SAF-17.refuse.role'));
    L.openRoll(me().id);
    delete view.dialog;
    go('SAF-17');
  },
  'saf.evac.check': (args) => { L.checkEvac(args.id, me().id, me()); view.sel = args.id; },
  'saf.evac.fix': (args) => { L.correctEvac(args.id, view.fixWhy, me().id, me()); view.dialog = ''; view.fixWhy = ''; },
};
export const screens = { 'SAF-17': { app: 'ops', title: tx('SAF-17.title'), render: saf17 } };
