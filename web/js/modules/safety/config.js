// SAF-11 규칙과 당번표 설정. 마크업은 캔버스 보드(ref/SAF-11.html)를 옮겼다. 규칙을 바꾸면 새 버전이 생기고, 이미 생긴 알림은 바꾸기 전 규칙을 따른다.
import { tx } from '../../lib/text.js';
import { denied, esc, fmt, href, ic, me, refuse, sheetWrap, view } from '../../lib/kit.js';
import * as L from './logic.js';
import { GRADE, ROLES, SOURCE_LABEL, hm, pn } from './logic.js';
import { demo, flash } from './screens.js';

const stamp = (iso) => `${fmt.md(iso)} ${hm(iso)}`;
const COND = { NIGHT_BED_EXIT_30: tx('SAF-11.cond.bed'), CALL_BELL: tx('SAF-11.cond.bell'), NIGHT_DOOR: tx('SAF-11.cond.door'), VISIT_MISSED: tx('SAF-11.cond.visit'), FRONT_CALL: tx('SAF-11.cond.front') };
const gradeBadge = (sev) => (sev === 'LOG_ONLY' ? `<span class="badge grade-log">${tx('SAF-11.grade.log')}</span>` : `<span class="badge ${GRADE[sev].cls}">${ic(GRADE[sev].icon)}${GRADE[sev].label}</span>`);
const gradeName = (sev) => (sev === 'LOG_ONLY' ? tx('SAF-11.grade.log') : GRADE[sev].label);
const nextVersion = (r) => r.version + 1;
const POS = [tx('SAF-11.pos.1'), tx('SAF-11.pos.2'), tx('SAF-11.pos.3')];

function staffSelect(id, name, cur) {
  const opts = L.staffOptions().map((p) => `<option value="${p.id}"${p.id === cur ? ' selected' : ''}>${esc(p.name)}</option>`).join('');
  return `<select id="${id}" class="input" name="${name}">${opts}<option value=""${cur ? '' : ' selected'}>${tx('SAF-11.blank')}</option></select>`;
}
function ruleSheet() {
  const r = L.S().rules.find((x) => x.key === view.rule);
  if (!r) return '';
  return sheetWrap(`<section class="proto-rsheet" role="dialog" aria-modal="true" aria-label="${esc(r.name)}">
    <h2 class="t-heading2">${esc(r.name)}</h2>
    <form class="stack" aria-label="${esc(r.name)}">
      <div class="field"><label for="rl-name">${tx('SAF-11.f.name')}</label><input id="rl-name" class="input" type="text" name="rname" value="${esc(r.name)}"></div>
      <dl class="kv"><dt>${tx('SAF-11.f.source')}</dt><dd>${SOURCE_LABEL[r.source]}</dd><dt>${tx('SAF-11.f.cond')}</dt><dd>${COND[r.key]}</dd></dl>
      <div class="field"><label for="rl-span">${tx('SAF-11.f.span')}</label><input id="rl-span" class="input" type="text" name="rspan" value="${L.spanText(r.from, r.to)}"></div>
      <div class="field"><label for="rl-grade">${tx('SAF-11.f.grade')}</label><select id="rl-grade" class="input" name="rgrade">${L.SEVERITIES.map((v) => `<option value="${v}"${v === r.severity ? ' selected' : ''}>${gradeName(v)}</option>`).join('')}</select></div>
      <div class="field"><label for="rl-int">${tx('SAF-11.f.interval')}</label><input id="rl-int" class="input" type="text" inputmode="numeric" name="rint" value="${r.intervalMin}"></div>
      <div class="field"><label for="rl-tpl">${tx('SAF-11.f.template')}</label><textarea id="rl-tpl" class="input" name="rtpl">${esc(r.template || '')}</textarea><p class="hint">${tx('SAF-11.hint.template')}</p></div>
      <p class="hint">${tx('SAF-11.hint.version', { n: nextVersion(r) })}</p>
      <div class="row" style="gap:8px;justify-content:flex-end;"><button class="btn btn-secondary" type="button" data-set="rule=">${tx('SAF-11.btn.cancel')}</button><button class="btn btn-primary" type="button" data-act="saf.cfg.rule" data-key="${r.key}">${tx('SAF-11.btn.save')}</button></div>
    </form></section>`);
}

function saf11() {
  if (!ROLES.config.includes(me().key)) return denied(tx('SAF-11.denied'));
  const s = L.S(), cur = L.shiftAt(), vp = s.visitPlan;
  const rows = s.rules.map((r) => `<tr><td data-label="${tx('SAF-11.th.rule')}">${esc(r.name)}</td><td data-label="${tx('SAF-11.th.source')}">${SOURCE_LABEL[r.source]}</td><td data-label="${tx('SAF-11.th.grade')}">${gradeBadge(r.severity)}</td><td data-label="${tx('SAF-11.th.interval')}">${r.severity === 'LOG_ONLY' ? tx('SAF-11.interval.none') : tx('SAF-11.interval', { n: r.intervalMin })}</td><td><button class="btn btn-ghost btn-sm" type="button" aria-haspopup="dialog" data-set="rule=${r.key}">${tx('SAF-11.btn.change')}</button></td></tr>`).join('');
  const log = (s.cfgLog || []).slice().reverse().slice(0, 6);
  const hist = log.length ? `<section class="card" aria-labelledby="r4"><h2 id="r4" class="t-heading2">${tx('SAF-11.h2.log')}</h2><ul class="list">${log.map((e) => `<li class="record"><span class="when">${stamp(e.at)}</span><span class="what">${e.to ? tx('SAF-11.log.line', { by: pn(e.by), pos: POS[e.pos - 1], to: pn(e.to) }) : tx('SAF-11.log.clear', { by: pn(e.by), pos: POS[e.pos - 1] })}</span></li>`).join('')}</ul></section>` : '';
  return { main: `<div class="page-head"><div><nav class="crumb" aria-label="${tx('safety.shared.ariaLabel.2')}"><span>${tx('SAF-11.crumb')}</span></nav><h1 class="t-title2">${tx('SAF-11.title')}</h1></div></div>${flash()}
      <form class="card" aria-label="${tx('SAF-11.title')}">
        <section class="stack" aria-labelledby="r1">
          <h2 id="r1" class="t-heading2">${tx('SAF-11.h2.rules')}</h2>
          <p class="hint">${tx('SAF-11.hint.rules')}</p>
        </section>
        <div class="tbl reflow"><table><thead><tr><th>${tx('SAF-11.th.rule')}</th><th>${tx('SAF-11.th.source')}</th><th>${tx('SAF-11.th.grade')}</th><th>${tx('SAF-11.th.interval')}</th><th><span class="sr-only">${tx('SAF-11.th.act')}</span></th></tr></thead><tbody>${rows}</tbody></table></div>
        <p class="muted">${tx('SAF-01.p.6')}</p>
        <hr class="divider">
        <section class="stack" aria-labelledby="r2">
          <h2 id="r2" class="t-heading2">${tx('SAF-11.h2.duty')}</h2>
          <p class="hint">${tx('SAF-11.hint.duty')}</p>
          <p class="t-label">${tx('SAF-11.range', { from: stamp(cur.start), to: stamp(cur.end) })}</p>
          <div class="grid3">
            <div class="field"><label for="c1">${tx('SAF-11.f.first')}</label>${staffSelect('c1', 'c1', cur.slots[0])}</div>
            <div class="field"><label for="c2">${tx('SAF-11.f.second')}</label>${staffSelect('c2', 'c2', cur.slots[1])}</div>
            <div class="field"><label for="c3">${tx('SAF-11.f.third')}</label>${staffSelect('c3', 'c3', cur.slots[2])}</div>
          </div>
        </section>
        <hr class="divider">
        <section class="stack" aria-labelledby="r3">
          <h2 id="r3" class="t-heading2">${tx('SAF-11.h2.visit')}</h2>
          <div class="grid2">
            <div class="field"><label for="v1">${tx('SAF-11.f.perday')}</label><input id="v1" class="input" type="text" name="vper" value="${tx('SAF-11.perday.value')}"></div>
            <div class="field"><label for="v2">${tx('SAF-11.f.visitspan')}</label><input id="v2" class="input" type="text" name="vspan" value="${vp.start}~${vp.end}"></div>
          </div>
          <p class="hint">${tx('SAF-11.hint.visit')}</p>
        </section>
        <p class="hint">${tx('SAF-11.hint.version', { n: Math.max(...s.rules.map(nextVersion)) })}</p>
        <div class="row end"><button class="btn btn-primary btn-sm" type="button" data-act="saf.cfg.save">${tx('SAF-11.btn.save')}</button></div>
      </form>${hist}${demo}`, overlay: ruleSheet() };
}

export const actions = {
  'saf.cfg.rule': (args, f) => {
    delete view.flash;
    const v = L.saveRule(args.key, { name: f.rname, span: f.rspan, severity: f.rgrade, interval: f.rint, template: f.rtpl }, me());
    view.flash = tx('SAF-11.flash.rule', { n: v });
    delete view.rule;
  },
  'saf.cfg.save': (_a, f) => {
    delete view.flash;
    if (!f.c1) refuse(tx('SAF-11.refuse.empty', { field: tx('SAF-11.n.first') }));
    const visit = L.saveVisitCfg(f.vper, f.vspan, me()), duty = L.saveShift([f.c1, f.c2, f.c3], me());
    view.flash = duty ? (visit ? `${tx('SAF-11.flash.duty')} ${tx('SAF-11.flash.visit')}` : tx('SAF-11.flash.duty')) : visit ? tx('SAF-11.flash.visit') : tx('SAF-11.flash.nochange');
  },
};
export const screens = { 'SAF-11': { app: 'ops', title: tx('SAF-11.title'), render: saf11 } };
