// 생활 지원 단계 화면. 마크업은 캔버스 보드(TRN-01~05, TRN-09) 그대로이고 값과 목록만 상태에서 채운다.
import { tx } from '../../lib/text.js';
import { denied, empty, esc, fmt, href, ic, me, nowISO, overlay, sheetWrap, view } from '../../lib/kit.js';
import { PERSONAS } from '../../lib/people.js';
import * as D from './domain.js';

const SCOPE = `<div class="scope">${ic('info')}<p>${tx('transitions.shared.p.2')}</p></div>`;
const ARROW = '<svg class="i i-inline" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';
const FS = 'style="border: 0; padding: 0; margin: 0;"';
const LEG = 'style="font-weight: 600; margin-bottom: 4px;"';
const arrow = (a, b, at) => `${esc(D.stageOf(a, at).staffLabel)} ${ARROW} ${esc(D.stageOf(b, at).staffLabel)}`;
const gate = (keys) => (keys.includes(me().key) ? '' : denied(D.MSG.noRole));
const alert = (kind, icon, text) => `<div class="alert alert-${kind}" role="${kind === 'ok' ? 'status' : 'alert'}">${ic(icon)}<p>${esc(text)}</p></div>`;
const stamp = (iso) => `${D.ymdOf(iso)} ${fmt.hm(iso)}`;

const pickRid = (params) => {
  const list = D.residentsList(), want = view.rid || params.rid;
  return list.find((r) => r.id === want)?.id ?? list.find((r) => r.id === 'R_EUNSOOK')?.id ?? list[0]?.id;
};
const pageHead = () => `<div class="page-head"><div class="stack" style="gap: 4px;"><span class="crumb"><a href="${href('TRN-01')}">${tx('transitions.shared.a')}</a></span><h1 class="t-title2">${tx('transitions.shared.h1')}</h1></div></div>`;
const tabs = (cur) => `<nav class="tabs" aria-label="${tx('TRN-02.ariaLabel.4')}">${[['', tx('TRN-02.map')], ['ext', tx('TRN-02.h2')], ['hist', tx('TRN-02.ariaLabel')]].map(([k, label]) => `<a href="#" data-set="tab=${k}"${cur === k ? ' aria-current="page"' : ''}>${label}</a>`).join('')}</nav>`;
/** 오른쪽 입력 시트. 보드의 .rs 마크업을 시트 틀에 넣는다 */
const rs = (title, closeHref, body, foot) => sheetWrap(`<section class="rs proto-rsheet" role="dialog" aria-modal="true" aria-labelledby="rs-t">
  <div class="rs-head"><h2 id="rs-t" class="t-heading1">${title}</h2><a class="btn btn-ghost btn-sm" href="${closeHref}" aria-label="${tx('transitions.shared.ariaLabel')}">${ic('x')}</a></div>
  <div class="stack lg">${body}</div><div class="rs-foot">${foot}</div></section>`);

// ---------- 공통 조각 ----------
function stageLine(cur) {
  if (cur.implicit) return `${tx('transitions.shared.text.2', { staffLabel: esc(cur.staffLabel), since: cur.since })}`;
  const dec = D.decisionOf(cur.decisionId);
  return `${tx('transitions.shared.text', { staffLabel: esc(cur.staffLabel), since: cur.since, name: esc(PERSONAS[dec.by].name) })}`;
}
const lastAssessLine = (a) => `${D.ymdOf(a.at)} ${D.T().triggerLabels[a.trigger]}`;
const badge = (p) => (p ? `<span class="badge">${D.T().statusLabels[p.status]}</span>` : '');

function summary(rid) {
  const rows = D.residentsList().map((r) => {
    const cur = D.currentStage(r.id), a = D.latestAssessment(r.id), op = D.openProposal(r.id);
    return `<tr${r.id === rid ? ' class="sel"' : ''}><td data-label="${tx('transitions.shared.th')}"><a href="#" data-set="rid=${r.id}"><strong>${esc(r.room)} ${esc(r.name)}</strong></a></td><td data-label="${tx('transitions.shared.th.2')}">${stageLine(cur)}</td><td class="num" data-label="${tx('transitions.shared.th.3')}">${a ? lastAssessLine(a) : '-'}</td><td data-label="${tx('transitions.shared.th.4')}">${badge(op)}</td></tr>`;
  }).join('');
  return `<section class="stack" aria-labelledby="sm"><h2 id="sm" class="t-heading2">${tx('transitions.shared.h2')}</h2><div class="tbl reflow"><table aria-label="${tx('transitions.shared.h2')}"><thead><tr><th>${tx('transitions.shared.th')}</th><th>${tx('transitions.shared.th.2')}</th><th>${tx('transitions.shared.th.3')}</th><th>${tx('transitions.shared.th.4')}</th></tr></thead><tbody>${rows}</tbody></table></div></section>`;
}

function panel(rid) {
  const cur = D.currentStage(rid), a = D.latestAssessment(rid), op = D.openProposal(rid), who = D.whoLabel(rid);
  const ex = D.externalsOf(rid).at(-1), nOv = D.openOverlaps(rid).length;
  const exLine = ex ? `${tx('TRN-02.text.8', { provider: esc(ex.provider), label: D.T().careTypes.find((c) => c.code === ex.type).label, join: ex.times.map((t) => `${D.wdShort(t.wd)} ${t.start}~${t.end}`).join(', '), start: ex.start })}` : '';
  const first = op && D.explanationsOf(op)[0];
  const openCell = op
    ? `<li><a class="cell" href="${href(op.status === 'DRAFT' ? 'TRN-04' : 'TRN-05', { rid })}"><span class="body"><span class="sub">${tx('TRN-02.sub')}</span><span class="title">${D.T().statusLabels[op.status]}: ${arrow(op.from, op.to)}</span><span class="sub">${tx('TRN-02.sub.6', { staffTag: esc(D.staffTag(op.by)), v: first ? `${tx('TRN-02.text.7', { md2: D.md2(first.date) })}` : '' })}</span></span>${ic('chevron-right')}</a></li>`
    : `<li class="cell"><span class="body"><span class="sub">${tx('TRN-02.sub')}</span><span class="title">${tx('TRN-02.title.3')}</span></span></li>`;
  return `<aside class="side-panel" aria-label="${tx('TRN-02.ariaLabel.3', { who: esc(who) })}"><span class="grab" aria-hidden="true"></span>
    <h2 class="t-heading2">${tx('TRN-02.h2.3', { who: esc(who) })}</h2>
    <ul class="list">
      <li class="cell"><span class="body"><span class="sub">${tx('TRN-02.sub.2')}</span><span class="title">${stageLine(cur)}</span></span></li>
      <li class="cell"><span class="body"><span class="sub">${tx('TRN-02.sub.3')}</span>${a ? `<span class="title">${lastAssessLine(a)}</span><span class="sub">${[a.by, ...a.withIds].map(D.staffTag).map(esc).join(', ')}</span>` : `<span class="title">${tx('TRN-02.title.2')}</span>`}</span></li>
      ${openCell}
      <li class="cell"><span class="body"><span class="sub">${tx('TRN-02.sub.4')}</span><span class="title">${ex ? exLine : tx('TRN-02.text.6')}</span>${nOv ? `<span class="sub">${tx('TRN-02.text.5', { nOv })}</span>` : ''}</span></li>
      <li class="cell"><span class="body"><span class="sub">${tx('TRN-02.sub.5')}</span><span class="title">${nOv ? `${tx('TRN-02.text.5', { nOv })}` : tx('TRN-02.text.4')}</span></span></li>
    </ul>
    <div class="stack"><a class="btn btn-secondary btn-md" href="${href('TRN-03', { rid })}">${tx('TRN-02.btn.6')}</a><a class="btn btn-secondary btn-md" href="${href('TRN-04', { rid })}">${tx('TRN-02.btn.7')}</a><a class="btn btn-secondary btn-md" href="#" data-set="tab=ext">${tx('TRN-02.h2')}</a><a class="btn btn-secondary btn-md" href="#" data-set="tab=hist">${tx('TRN-02.ariaLabel')}</a></div>
  </aside>`;
}

const demoNote = `<p class="demo-note">${tx('transitions.shared.p')}</p>`;

// ---------- TRN-01 단계 정의 ----------
function trn01() {
  if (me().key === 'OWNER') return denied(D.MSG.noRole);
  const sel = view.stage || 'LIVING_SUPPORT', cur = D.stageOf(sel);
  const rows = D.stages().map((s) => `<tr${s.code === sel ? ' class="sel"' : ''}><td data-label="${tx('TRN-01.th')}"><a href="#" data-set="stage=${s.code}"><b>${esc(s.staffLabel)}</b></a></td><td class="wrap" data-label="${tx('TRN-01.th.2')}">${esc(D.servicesText(s))}</td><td data-label="${tx('TRN-01.th.3')}">${esc(s.feeLabel)}</td></tr>`).join('');
  const edit = D.EDIT_KEYS.includes(me().key) ? `<a class="btn btn-secondary btn-sm" href="${href('TRN-12', { stage: sel })}">${tx('TRN-01.edit')}</a>` : '';
  return `<div class="page-head"><h1 class="t-title2">${tx('TRN-01.h1')}</h1>${edit}</div>
${SCOPE}
<p>${tx('TRN-01.p')}</p>
<div class="tbl reflow"><table aria-label="${tx('TRN-01.title')}"><thead><tr><th>${tx('TRN-01.th')}</th><th>${tx('TRN-01.th.2')}</th><th>${tx('TRN-01.th.3')}</th></tr></thead><tbody>${rows}</tbody></table></div>
<section class="card" aria-labelledby="keep"><h2 id="keep" class="t-heading2">${tx('TRN-01.h2', { staffLabel: esc(cur.staffLabel) })}</h2><p>${esc(D.unchangedLines(cur).join(', '))}</p><hr class="divider"><p class="muted">${tx('TRN-01.p.2')}</p><p class="muted">${tx('TRN-01.p.3')}</p></section>
${demoNote}`;
}

// ---------- TRN-02 요약, 외부 돌봄 일정 탭, 단계 변경 이력 탭 ----------
function histRow(l) {
  const content = {
    ASSESSMENT: () => esc(D.T().triggerLabels[l.trigger]), PROPOSAL: () => arrow(l.from, l.to, D.ymdOf(l.at)), DECISION_CHANGE: () => arrow(l.from, l.to, D.ymdOf(l.at)),
    DECISION_KEEP: () => esc(D.stageOf(l.from, D.ymdOf(l.at)).staffLabel), DECISION_REASSESS: () => '', AMENDMENT: () => '',
    EXPLANATION: () => esc(D.T().opinions.find((o) => o.code === l.opinion).label.replace(tx('TRN-02.replace'), '')),
    EXTERNAL: () => { const e = D.T().externals.find((x) => x.id === l.ext); return `${esc(e.provider)}, ${D.T().careTypes.find((c) => c.code === e.type).label}`; },
    OVERLAP: () => esc(l.text),
  }[l.kind]();
  return { content, kind: D.T().kindLabels[l.kind] };
}
function histTab(rid) {
  const list = D.historyOf(rid), selId = view.row || list.at(-1)?.id, sel = list.find((l) => l.id === selId);
  const rows = list.map((l) => { const r = histRow(l); return `<tr${l.id === selId ? ' class="sel"' : ''}><td class="num" data-label="${tx('TRN-02.th')}">${stamp(l.at)}</td><td data-label="${tx('TRN-02.th.2')}"><a href="#" data-set="row=${l.id}"><b>${r.kind}</b></a></td><td data-label="${tx('TRN-02.th.3')}">${esc(D.staffTag(l.by))}</td><td class="wrap" data-label="${tx('TRN-02.th.4')}">${r.content}</td></tr>`; }).join('');
  const side = sel ? (() => { const r = histRow(sel); return `<aside class="side-panel" aria-label="${tx('TRN-02.ariaLabel.2')}"><span class="grab" aria-hidden="true"></span><h2 class="t-heading2">${r.kind}</h2><dl class="kvp"><dt>${tx('TRN-02.th')}</dt><dd>${stamp(sel.at)}</dd><dt>${tx('TRN-02.th.3')}</dt><dd>${esc(D.staffTag(sel.by))}</dd><dt>${tx('TRN-02.th.4')}</dt><dd>${r.content}</dd></dl><p class="hint">${tx('TRN-02.p.4')}</p></aside>`; })() : '';
  return `<div class="with-panel"><div class="stack lg"><section class="stack" aria-labelledby="h7"><h2 id="h7" class="t-heading2">${tx('TRN-02.h2.2', { whoLabel: esc(D.whoLabel(rid)) })}</h2><div class="tbl reflow"><table aria-label="${tx('TRN-02.ariaLabel')}"><thead><tr><th>${tx('TRN-02.th')}</th><th>${tx('TRN-02.th.2')}</th><th>${tx('TRN-02.th.3')}</th><th>${tx('TRN-02.th.4')}</th></tr></thead><tbody>${rows}</tbody></table></div></section></div>${side}</div>`;
}

function extSheet(rid) {
  const t = D.T(), ov = D.openOverlaps(rid)[0], extId = view.extSaved || ov?.extId || D.externalsOf(rid).at(-1)?.id, ext = t.externals.find((e) => e.id === extId);
  const intro = `<p>${tx('TRN-02.p.3')}</p>`;
  const typeLabel = (c) => t.careTypes.find((x) => x.code === c).label;
  const noShare = (on, dis) => `<label class="choice"><input type="checkbox"${on ? ' checked' : ''}${dis ? ' disabled' : ' data-bind="noShare"'}>${tx('TRN-02.input')}</label><p class="hint">${tx('TRN-02.p.2')}</p>`;
  const kvp = ext && `<dl class="kvp"><dt>${tx('TRN-02.label')}</dt><dd>${esc(ext.provider)}</dd><dt>${tx('TRN-02.label.2')}</dt><dd>${typeLabel(ext.type)}</dd><dt>${tx('TRN-02.label.3')}</dt><dd>${ext.times.map((x) => `${D.wdShort(x.wd)} ${x.start}~${x.end}`).join(', ')}</dd><dt>${tx('TRN-02.label.4')}</dt><dd>${ext.start}</dd><dt>${tx('TRN-02.label.5')}</dt><dd>${ext.end || tx('TRN-02.text.3')}</dd><dt>${tx('TRN-02.label.6')}</dt><dd>${t.infoSources.find((s) => s.code === ext.source).label}</dd><dt>${tx('TRN-02.label.7')}</dt><dd>${esc(ext.contact || '-')}</dd></dl>`;
  const cancel = `<button class="btn btn-ghost btn-sm" type="button" data-set="tab=">${tx('TRN-02.btn.3')}</button>`;
  const msg = view.extMsg || (view.extSaved ? `${tx('TRN-02.text.10', { v: D.openOverlaps(rid).length ? ` ${tx('TRN-02.text.2', { length: D.openOverlaps(rid).length })}` : '' })}` : '');
  const closeBtn = `<a class="btn btn-ghost btn-sm" href="#" data-set="tab=" aria-label="${tx('TRN-02.btn.2')}">${ic('x')}</a>`;
  const wrap = (body, foot) => sheetWrap(`<section class="rs proto-rsheet" role="dialog" aria-modal="true" aria-labelledby="rs-t"><div class="rs-head"><h2 id="rs-t" class="t-heading1">${tx('TRN-02.h2')}</h2>${closeBtn}</div><div class="stack lg">${SCOPE}${intro}${body}</div><div class="rs-foot">${foot}</div></section>`);
  if (ov) {
    const sl = t.slots.find((s) => s.id === ov.slotId), svc = D.serviceOf(sl.svc), e = t.externals.find((x) => x.id === ov.extId), et = e.times[ov.ei];
    const method = view.fix || 'MOVE', rest = view.remain;
    const warn = `${tx('TRN-02.text.9', { wdLong: D.wdLong(ov.wd), start: sl.start, end: sl.end, shortLabel: svc.shortLabel, josa: D.josa(svc.shortLabel, tx('TRN-02.josa.2'), tx('TRN-02.josa')), provider: esc(e.provider), typeLabel: typeLabel(e.type), start2: et.start, end2: et.end, first: ov.first })}`;
    const suggest = D.mdText(D.addDays(ov.first, -1));
    const dateList = rest ? (rest.dates.length <= 2 ? rest.dates.map(D.mdText).join(tx('TRN-02.join')) : `${tx('TRN-02.text', { mdText: D.mdText(rest.dates[0]), length: rest.dates.length })}`) : '';
    const restWarn = rest ? `<div class="alert alert-warn" role="alert">${ic('triangle-alert')}<div class="stack"><p>${tx('TRN-02.p.5', { wdLong: D.wdLong(ov.wd), shortLabel: svc.shortLabel, mdText: D.mdText(rest.last), dateList, typeLabel: typeLabel(e.type), josa: D.josa(typeLabel(e.type), tx('TRN-02.josa.2'), tx('TRN-02.josa')), suggest, josaRo: D.josaRo(suggest) })}</p><div class="row" style="gap: 8px;"><button class="btn btn-secondary btn-sm" type="button" data-act="trn.ext.suggest" data-ov="${ov.id}">${tx('TRN-02.btn.4')}</button><button class="btn btn-secondary btn-sm" type="button" data-act="trn.ext.fix" data-ov="${ov.id}" data-force="1">${tx('TRN-02.btn.5')}</button></div></div></div>` : '';
    const fix = `<fieldset ${FS}><legend class="label" ${LEG}>${tx('TRN-02.legend')}</legend>${t.fixMethods.map((m) => `<label class="choice"><input type="radio" name="fix" data-bind="fix" data-live value="${m.code}"${method === m.code ? ' checked' : ''}>${m.label}</label>`).join('')}</fieldset>`;
    const move = `<div class="field"><label for="o1">${tx('TRN-02.label.9')}</label><input id="o1" class="input" type="text" data-bind="o1" placeholder="2027-01-11"></div><div class="field"><label for="o2">${tx('TRN-02.label.10')}</label><input id="o2" class="input" type="text" data-bind="o2" placeholder="${tx('TRN-02.placeholder.4')}"></div><div class="field"><label for="o3">${tx('TRN-02.label.11')}</label><input id="o3" class="input" type="text" data-bind="o3" placeholder="2027-01-14"></div><p class="hint">${tx('TRN-02.p')}</p>`;
    const keep = `<div class="field"><label for="kw">${tx('TRN-02.label.8')}</label><textarea id="kw" class="input" data-bind="keepWhy"></textarea></div>`;
    const body = `${msg ? alert('ok', 'circle-check', msg) : ''}${alert('warn', 'triangle-alert', warn)}${kvp}${noShare(e.noShare, true)}${fix}${method === 'MOVE' ? move : method === 'KEEP_BOTH' ? keep : ''}${restWarn}`;
    return wrap(body, `${cancel}<button class="btn btn-primary btn-sm" type="button" data-act="trn.ext.fix" data-ov="${ov.id}">${t.fixMethods.find((m) => m.code === method).label}</button>`);
  }
  if (msg) return wrap(`${alert('ok', 'circle-check', msg)}${kvp || ''}`, `<button class="btn btn-ghost btn-sm" type="button" data-set="tab=">${tx('TRN-02.btn.2')}</button>`);
  const filled = view.provider && view.times && view.start;
  const form = `<div class="field"><label for="x1">${tx('TRN-02.label')}</label><input id="x1" class="input" type="text" data-bind="provider" data-live placeholder="${tx('TRN-02.placeholder')}"></div>
    <div class="field"><label for="x2">${tx('TRN-02.label.2')}</label><select id="x2" class="input" data-bind="careType">${t.careTypes.map((c) => `<option value="${c.code}">${c.label}</option>`).join('')}</select></div>
    <div class="field"><label for="x3">${tx('TRN-02.label.3')}</label><input id="x3" class="input" type="text" data-bind="times" data-live placeholder="${tx('TRN-02.placeholder.2')}"></div>
    <div class="field"><label for="x4">${tx('TRN-02.label.4')}</label><input id="x4" class="input" type="text" data-bind="start" data-live placeholder="2027-01-12"></div>
    <div class="field"><label for="x5">${tx('TRN-02.label.5')}</label><input id="x5" class="input" type="text" data-bind="end"><span class="hint">${tx('TRN-02.span')}</span></div>
    <div class="field"><label for="x6">${tx('TRN-02.label.6')}</label><select id="x6" class="input" data-bind="source">${t.infoSources.map((c) => `<option value="${c.code}">${c.label}</option>`).join('')}</select></div>
    <div class="field"><label for="x7">${tx('TRN-02.label.7')}</label><input id="x7" class="input" type="text" data-bind="contact" placeholder="${tx('TRN-02.placeholder.3')}"></div>${noShare(false, false)}`;
  return wrap(form, `${cancel}<button class="btn btn-primary btn-sm" type="button" data-act="trn.ext.save" data-rid="${rid}"${filled ? '' : ' disabled'}>${tx('TRN-02.btn')}</button>`);
}

function trn02(params) {
  const g = gate(D.READ_KEYS); if (g) return g;
  const rid = pickRid(params), tab = view.tab || '';
  if (!rid) return `${pageHead()}${SCOPE}`;
  const body = tab === 'hist' ? histTab(rid) : `<div class="with-panel"><div class="stack lg">${summary(rid)}</div>${panel(rid)}</div>`;
  return { main: `${pageHead()}${tabs(tab)}${SCOPE}${body}${demoNote}`, overlay: tab === 'ext' ? extSheet(rid) : '' };
}

// ---------- TRN-03 평가 기록 ----------
function trn03(params) {
  const g = gate(D.READ_KEYS); if (g) return g;
  const rid = pickRid(params), t = D.T(), p = me(), who = D.whoLabel(rid);
  const recId = params.a || view.saved, rec = t.assessments.find((a) => a.id === recId), locked = !!rec;
  const lvOf = (c) => (rec ? rec.items.find((i) => i.code === c).level : view[`lv-${c}`]);
  const ntOf = (c) => (rec ? rec.items.find((i) => i.code === c).note : view[`nt-${c}`] || '');
  const bound = (k) => (locked ? '' : ` data-bind="${k}" data-live`);
  const staffs = rec ? [rec.by, ...rec.withIds] : [p.id, D.coAssessor(p)];
  const at = rec ? rec.at : nowISO();
  const head = `<dl class="kvp"><dt>${tx('TRN-03.dt')}</dt><dd>${stamp(at)}</dd><dt>${tx('TRN-03.dt.2')}</dt><dd>${staffs.map((s) => esc(D.staffTag(s))).join(', ')}</dd><dt>${tx('TRN-03.dt.3')}</dt><dd>${t.triggerLabels[t.assessDefaults.trigger]}</dd><dt>${tx('TRN-03.dt.4')}</dt><dd>${tx('TRN-03.dd')}</dd></dl>`;
  const items = t.items.map((it) => `<fieldset ${FS}><legend class="label" ${LEG}>${it.label}</legend><div class="scale-4">${t.levels.map((l) => `<label class="choice"><input type="radio" name="lv-${it.code}"${bound(`lv-${it.code}`)} value="${l.code}"${lvOf(it.code) === l.code ? ' checked' : ''}${locked ? ' disabled' : ''}>${l.label}</label>`).join('')}</div><div class="field"><label for="w-${it.code}">${tx('TRN-03.label.2')}</label><textarea id="w-${it.code}" class="input" rows="2"${bound(`nt-${it.code}`)}${locked ? ' disabled' : ''}>${esc(ntOf(it.code))}</textarea></div></fieldset>`).join('');
  const wishVal = rec ? rec.wish : view.wish || '';
  const banned = D.bannedFound(wishVal, ...t.items.map((i) => ntOf(i.code)));
  const warn = banned ? alert('warn', 'triangle-alert', `${tx('TRN-03.text.2', { banned })}`) : '';
  const complete = t.items.every((i) => lvOf(i.code));
  const saved = view.saved && rec ? `${alert('ok', 'circle-check', D.SAVED_ASSESS)}<a class="btn btn-secondary btn-md" href="${href('TRN-04', { rid })}">${tx('TRN-03.btn.4')}</a>` : '';
  const body = `${SCOPE}<p>${tx('TRN-03.p.2')}</p>
    ${head}<h3 class="t-headline">${tx('TRN-03.h3')}</h3>${items}
    <p class="hint">${tx('TRN-03.p.3')}</p>${warn}
    <div class="field"><label for="wish">${tx('TRN-03.label')}</label><textarea id="wish" class="input"${bound('wish')}${locked ? ' disabled' : ''}>${esc(wishVal)}</textarea><span class="hint">${tx('TRN-03.span')}</span></div>
    <p class="muted">${tx('TRN-03.p.4')}</p>${saved}`;
  const back = href('TRN-02', { rid });
  const foot = locked ? `<a class="btn btn-ghost btn-sm" href="${back}">${tx('TRN-03.btn.3')}</a>` : `<a class="btn btn-ghost btn-sm" href="${back}">${tx('TRN-03.btn')}</a><button class="btn btn-primary btn-sm" type="button" data-act="trn.assess.save" data-rid="${rid}"${complete ? '' : ' disabled'}>${tx('TRN-03.btn.2')}</button>`;
  return { main: `<div class="page-head"><h1 class="t-title2">${tx('TRN-03.h1')}</h1></div><p class="muted">${tx('TRN-03.p', { who: esc(who) })}</p>`, overlay: rs(`${tx('TRN-03.text', { who: esc(who) })}`, back, body, foot) };
}

// ---------- TRN-04 제안과 설명 ----------
function trn04(params) {
  const g = gate(D.READ_KEYS); if (g) return g;
  const rid = pickRid(params), t = D.T(), who = D.whoLabel(rid), back = href('TRN-02', { rid });
  const open = D.openProposal(rid), explain = open && open.status !== 'DRAFT' && view.savedP !== open.id;
  const bg = `${pageHead()}${summary(rid)}`;
  const hasX = view.savedX;
  if (explain) {
    const done = !!hasX, off = done ? ' disabled' : '';
    const ex = D.stageOf(open.to).explainExample, c = t.explainDefaults.companion;
    const body = `${open.blocked && open.status === 'AWAITING_EXPLANATION' ? alert('err', 'triangle-alert', D.MSG.explainMissing) : ''}
      ${ex ? `<p class="muted">${tx('TRN-04.p', { ex: esc(ex) })}</p>` : ''}
      <dl class="kvp"><dt>${tx('TRN-04.dt.3')}</dt><dd>${D.today()}</dd><dt>${tx('TRN-04.dt.4')}</dt><dd>${esc(D.staffTag(me().id))}</dd><dt>${tx('TRN-04.dt.5')}</dt><dd>${esc(c.name)}(${c.relation}, ${c.via})</dd></dl>
      <fieldset ${FS}><legend class="label" ${LEG}>${tx('TRN-04.legend')}</legend>${t.opinions.map((o) => `<label class="choice"><input type="radio" name="op" data-bind="opinion" data-live value="${o.code}"${view.opinion === o.code ? ' checked' : ''}${off}>${o.label}</label>`).join('')}</fieldset>
      ${view.opinion === 'COULD_NOT_HEAR' ? `<div class="field"><label for="bc">${tx('TRN-04.label')}</label><textarea id="bc" class="input" data-bind="because" data-live${off}></textarea></div>` : ''}
      <div class="field"><label for="said">${tx('TRN-04.label.4')}</label><textarea id="said" class="input" data-bind="words"${off}></textarea></div>
      <label class="choice"><input type="checkbox" data-bind="noShare"${view.noShare ? ' checked' : ''}${off}>${tx('TRN-04.input')}</label>
      <p class="hint">${tx('TRN-04.p.5')}</p>
      <p class="muted">${tx('TRN-04.p.6')}</p>
      ${done ? alert('ok', 'circle-check', D.SAVED_EXPLAIN) : ''}`;
    const ok = view.opinion && (view.opinion !== 'COULD_NOT_HEAR' || (view.because || '').trim());
    const foot = `<a class="btn btn-ghost btn-sm" href="${back}">${tx('TRN-04.btn')}</a><button class="btn btn-primary btn-sm" type="button" data-act="trn.explain" data-pid="${open.id}"${ok && !done ? '' : ' disabled'}>${tx('TRN-04.btn.3')}</button>`;
    return { main: bg, overlay: rs(tx('TRN-04.rs'), back, body, foot) };
  }
  const cur = D.currentStage(rid), ev = D.latestAssessment(rid), saved = open && view.savedP === open.id;
  const options = D.stages().filter((s) => s.code !== cur.stage), sel = view.stage || open?.to || options[0].code, to = D.stageOf(sel);
  const fee = D.feeChanged(rid, sel) ? tx('TRN-04.text.4') : tx('TRN-04.text.3');
  const evLine = ev ? `${D.ymdOf(ev.at)} ${t.triggerLabels[ev.trigger]}, ${[ev.by, ...ev.withIds].map((s) => esc(D.staffTag(s))).join(', ')} <a href="${href('TRN-03', { rid, a: ev.id })}">${tx('TRN-04.a.2')}</a>` : `${D.MSG.noEvidence} <a href="${href('TRN-03', { rid })}">${tx('TRN-04.a')}</a>`;
  const off = saved ? ' disabled' : '';
  const body = `${SCOPE}
    <dl class="kvp"><dt>${tx('TRN-04.dt')}</dt><dd>${esc(cur.staffLabel)} (${cur.implicit ? tx('TRN-04.text.2') : `${tx('TRN-04.text', { since: cur.since })}`})</dd><dt>${tx('TRN-04.dt.2')}</dt><dd>${evLine}</dd></dl>
    <div class="field"><label for="stage">${tx('TRN-04.label.2')}</label><select id="stage" class="input" data-bind="stage" data-live${off}>${options.map((s) => `<option value="${s.code}"${s.code === sel ? ' selected' : ''}>${esc(s.staffLabel)}</option>`).join('')}</select></div>
    ${to.proposeNote ? `<p class="muted">${esc(to.proposeNote)}</p>` : ''}
    <div class="band"><p class="t-label">${tx('TRN-04.p.2')}</p><p>${esc(D.changeText(to))}</p><p class="t-label">${tx('TRN-04.p.3')}</p><p>${esc(D.unchangedLines(to).join(', '))}</p><p class="t-label">${tx('TRN-04.p.4')}</p><p>${fee}</p></div>
    <div class="field"><label for="why">${tx('TRN-04.label.3')}</label><textarea id="why" class="input" data-bind="why" data-live${off}></textarea><span class="hint">${tx('TRN-04.span')}</span></div>
    ${saved ? alert('ok', 'circle-check', D.SAVED_PROPOSAL) : ''}`;
  const can = ev && (view.why || '').trim() && !saved;
  const foot = `<a class="btn btn-ghost btn-sm" href="${back}">${tx('TRN-04.btn')}</a><button class="btn btn-primary btn-sm" type="button" data-act="trn.propose" data-rid="${rid}"${can ? '' : ' disabled'}>${tx('TRN-04.btn.2')}</button>`;
  return { main: bg, overlay: rs(tx('TRN-04.title'), back, body, foot) };
}

// ---------- TRN-05 결정 ----------
function confirmDialog(prop) {
  const to = D.stageOf(prop.to), amend = D.feeChanged(prop.rid, prop.to), noShare = D.noShareOf(prop);
  const mid = amend
    ? (noShare ? tx('TRN-05.text.8') : tx('TRN-05.text.7'))
    : (noShare ? tx('TRN-05.text.6') : tx('TRN-05.text.5'));
  return overlay(`<div class="dialog" role="alertdialog" aria-labelledby="dlg-t" aria-describedby="dlg-d"><h2 id="dlg-t" class="t-heading1">${tx('TRN-05.h2.2', { staffTo: to.staffTo })}</h2>
    <p id="dlg-d">${tx('TRN-05.p.2', { residentName: esc(D.residentName(prop.rid)), today: D.today(), staffTo: to.staffTo, mid })}</p>
    <div class="actions"><button class="btn btn-secondary btn-md" type="button" data-set="dialog=">${tx('TRN-05.btn')}</button><button class="btn btn-primary btn-md" type="button" data-act="trn.decide.do" data-pid="${prop.id}" data-choice="CHANGE">${tx('TRN-05.btn.2')}</button></div></div>`);
}
function trn05(params) {
  const g = gate(D.READ_KEYS); if (g) return g;
  const t = D.T(), filter = view.filter || '';
  const open = t.proposals.filter((p) => p.status === 'AWAITING_EXPLANATION' || p.status === 'AWAITING_DECISION');
  const done = t.proposals.filter((p) => p.status === 'DECIDED_CHANGE' || p.status === 'DECIDED_KEEP');
  const list = filter === 'done' ? done : open;
  const pid = view.pid || params.pid || list.find((p) => p.rid === params.rid)?.id || list[0]?.id, sp = D.proposalById(pid);
  const rows = list.length ? list.map((p) => `<tr${p.id === pid ? ' class="sel"' : ''}><td data-label="${tx('TRN-05.dataLabel')}"><a href="#" data-set="pid=${p.id}"><strong>${esc(D.whoLabel(p.rid))}</strong></a></td><td data-label="${tx('TRN-05.dataLabel.2')}">${arrow(p.from, p.to)}</td><td data-label="${tx('TRN-05.dataLabel.3')}">${esc(D.staffTag(p.by))}</td><td data-label="${tx('TRN-05.dataLabel.4')}">${badge(p)}</td></tr>`).join('')
    : ''; // 빈 목록은 표 머리만 둔다. 보드의 "-" 줄은 자리 표시였다.
  let side = '';
  if (sp) {
    const ex = D.explanationsOf(sp), last = ex.at(-1), ns = ex.find((x) => x.noShare), dec = t.decisions.filter((d) => d.pid === sp.id).at(-1), c = t.explainDefaults.companion;
    const bundle = `${tx('TRN-05.text.10', { length: sp.evidence.length })}<br>${last ? `${tx('TRN-05.text.9', { replace: esc(t.opinions.find((o) => o.code === last.opinion).label.replace(tx('TRN-05.replace'), '')), md2: D.md2(last.date) })}<br>${tx('TRN-05.br.2', { name: esc(c.name), relation: c.relation })}` : `${tx('TRN-05.text.4', { AWAITING_EXPLANATION: t.statusLabels.AWAITING_EXPLANATION })}`}${ns ? `<br>${tx('TRN-05.br', { md2: D.md2(ns.noShareAt.slice(0, 10)), hm: fmt.hm(ns.noShareAt) })}` : ''}`;
    const isOpen = D.OPEN_STATUS.includes(sp.status);
    const reason = (view.reason || '').trim();
    const controls = isOpen
      ? `${view.err ? alert('err', 'triangle-alert', view.err) : ''}
        <div class="field"><label for="rs">${tx('TRN-05.dt.3')}</label><textarea id="rs" class="input" data-bind="reason" data-live></textarea><span class="hint">${tx('TRN-05.span')}</span></div>
        <div class="stack">${t.choices.map((c2) => `<button class="btn btn-secondary btn-md" type="button" data-act="trn.decide.ask" data-pid="${sp.id}" data-choice="${c2.code}"${reason ? '' : ' disabled'}>${c2.label}</button>`).join('')}</div>`
      : `${view.result ? alert('ok', 'circle-check', view.result) : ''}${dec ? `<dl class="kvp"><dt>${tx('TRN-05.ariaLabel')}</dt><dd>${t.statusLabels[sp.status]} (${dec.date})</dd><dt>${tx('TRN-05.dt.2')}</dt><dd>${esc(D.staffTag(dec.by))}</dd><dt>${tx('TRN-05.dt.3')}</dt><dd>${esc(dec.reason)}</dd></dl>` : ''}`;
    side = `<aside class="side-panel" aria-label="${tx('TRN-05.ariaLabel')}"><span class="grab" aria-hidden="true"></span><h2 class="t-heading2">${tx('TRN-05.h2', { whoLabel: esc(D.whoLabel(sp.rid)) })}</h2>
      <p class="strong">${tx('TRN-05.p', { staffTag: esc(D.staffTag(sp.by)), arrow: arrow(sp.from, sp.to) })}</p>
      <dl class="kvp"><dt>${tx('TRN-05.dt')}</dt><dd>${bundle}</dd></dl>${controls}</aside>`;
  }
  const main = `<div class="page-head"><div class="stack" style="gap: 4px;"><span class="crumb"><a href="${href('TRN-02')}">${tx('TRN-05.a')}</a></span><h1 class="t-title2">${tx('TRN-05.h1', { length: open.length })}</h1></div></div>
${SCOPE}
<div class="with-panel"><div class="stack lg"><div class="seg" role="group" aria-label="${tx('TRN-05.ariaLabel.2')}"><a href="#" data-set="filter="${filter === '' ? ' aria-current="true"' : ''}>${tx('TRN-05.title')}</a><a href="#" data-set="filter=done"${filter === 'done' ? ' aria-current="true"' : ''}>${tx('TRN-05.text')}</a></div>
<section class="stack" aria-labelledby="q"><h2 id="q" class="t-heading2">${filter === 'done' ? tx('TRN-05.text.3') : tx('TRN-05.text.2')}</h2><div class="tbl reflow"><table aria-label="${filter === 'done' ? tx('TRN-05.text') : tx('TRN-05.title')}"><thead><tr><th>${tx('TRN-05.dataLabel')}</th><th>${tx('TRN-05.dataLabel.2')}</th><th>${tx('TRN-05.dataLabel.3')}</th><th>${tx('TRN-05.dataLabel.4')}</th></tr></thead><tbody>${rows}</tbody></table></div></section></div>${side}</div>${demoNote}`;
  return { main, overlay: view.dialog === 'confirm' && sp && D.OPEN_STATUS.includes(sp.status) ? confirmDialog(sp) : '' };
}

// ---------- TRN-08 경리 확인 (CORE-01 확인할 일 줄을 누르면 연다) ----------
function trn08(params) {
  const t = D.T(), am = t.amendments.find((a) => a.id === params.id);
  if (!D.ACK_KEYS.includes(me().key) || !am) return denied(D.MSG.noRole);
  const dec = D.decisionOf(am.decisionId), from = D.stageOf(dec.from), to = D.stageOf(am.to);
  const done = am.status === 'ACKNOWLEDGED';
  const kv = `<dl class="kvp"><dt>${tx('TRN-08.dt')}</dt><dd>${tx('TRN-08.dd', { whoLabel: esc(D.whoLabel(am.rid)) })}</dd><dt>${tx('TRN-08.dt.2')}</dt><dd>${arrow(dec.from, dec.to)}</dd><dt>${tx('TRN-08.dt.3')}</dt><dd>${tx('TRN-08.dd.2', { date: dec.date })}</dd><dt>${tx('TRN-08.dt.4')}</dt><dd>${esc(D.staffTag(am.by))}</dd><dt>${tx('TRN-08.dt.5')}</dt><dd>${esc(from.feeLabel)} ${ARROW} ${esc(to.feeLabel)}</dd></dl>`;
  const foot = done
    ? `<p class="strong">${tx('TRN-08.p.2', { stamp: stamp(am.ackAt), staffTag: esc(D.staffTag(am.ackBy)), v: am.note ? ` ${tx('TRN-08.text', { note: esc(am.note) })}` : '' })}</p>`
    : `<div class="field"><label for="memo">${tx('TRN-08.label')}</label><textarea id="memo" class="input" data-bind="memo" placeholder="${tx('TRN-08.placeholder')}"></textarea></div><div class="stack"><button class="btn btn-primary btn-md" type="button" data-act="trn.amend.ack" data-id="${am.id}">${tx('TRN-08.btn')}</button></div>`;
  return `<div class="page-head"><div class="stack" style="gap: 4px;"><span class="crumb"><a href="${href('CORE-01')}">${tx('TRN-08.a')}</a></span><h1 class="t-title2">${tx('TRN-08.h1', { whoLabel: esc(D.whoLabel(am.rid)) })}</h1></div></div>
${kv}<p class="muted">${tx('TRN-08.p')}</p>${foot}${demoNote}`;
}

// ---------- TRN-09 회원 화면 ----------
const list = (items) => `<ul class="list">${items.map((s) => `<li class="money"><span>${esc(s)}</span></li>`).join('')}</ul>`;
function memberMain(rid) {
  const t = D.T(), cur = D.currentStage(rid), stage = D.stageOf(cur.stage, cur.since), room = D.resident(rid).room;
  const changes = t.decisions.filter((d) => d.rid === rid && d.choice === 'CHANGE'), last = changes.at(-1);
  const same = [`${tx('TRN-09.text.15', { room })}`, ...(stage.unchangedLines ? stage.unchangedLines.filter((l) => l !== D.roomItem()) : D.defsAt().memberUnchanged)];
  let pair = '', cardExtra = '';
  if (last) {
    const dec = last, to = D.stageOf(dec.to), md = D.mdText(dec.date), kept = D.activeServices(rid).map((s) => s.memberLabel);
    const added = dec.opened.length ? { title: `${tx('TRN-09.text.14', { md })}`, items: dec.opened.map((c) => D.serviceOf(c).memberLabel) }
      : dec.closed.length ? { title: `${tx('TRN-09.text.13', { md })}`, items: dec.closed.map((c) => D.serviceOf(c).memberLabel) }
      : kept.length ? { title: tx('TRN-09.title.3'), items: kept } : null;
    pair = `<div class="pair"><section class="card" aria-labelledby="same-h"><h2 id="same-h" class="t-heading1">${tx('TRN-09.h2.3')}</h2>${list(same)}</section>${added ? `<section class="card" aria-labelledby="added-h"><h2 id="added-h" class="t-heading1">${added.title}</h2>${list(added.items)}</section>` : ''}</div>`;
    const money = dec.amend ? (to.code === 'BASIC' ? tx('TRN-09.text.12') : tx('TRN-09.text.11')) : tx('TRN-09.text.10');
    cardExtra = `<div class="band"><p class="t-body-lg">${esc(D.whoDecidedText(dec))}</p></div>${dec.noShare ? `<p class="t-body-lg">${tx('TRN-09.p.8')}</p>` : ''}${to.code === 'WITH_EXTERNAL_CARE' ? `<p class="t-body-lg">${tx('TRN-09.p.7')}</p>` : ''}<p class="t-body-lg">${money}</p>`;
  }
  const stageCard = `<section class="card" aria-labelledby="stage-h"><h2 id="stage-h" class="t-heading1">${tx('TRN-09.h2.2', { memberLabel: esc(stage.memberLabel) })}</h2><p class="t-body-lg">${esc(stage.memberDesc)}</p>${cardExtra}</section>`;
  const spans = D.stageSpans(rid);
  const spanLine = (s) => `${s.implicit ? tx('TRN-09.text.2') : `${tx('TRN-09.text', { longDate: D.longDate(s.from) })}`}: ${D.stageOf(s.stage, s.from).memberLabel}`;
  const more = `<section class="stack" aria-labelledby="more-h"><h2 id="more-h" class="t-heading2">${tx('TRN-09.h2')}</h2><ul class="list card flush">
    <li><a class="cell" href="#" data-set="sub=cond"><span class="body"><span class="title">${tx('TRN-09.h1.4')}</span><span class="sub">${tx('TRN-09.sub')}</span></span>${ic('chevron-right')}</a></li>
    <li><a class="cell" href="#" data-set="sub=all"><span class="body"><span class="title">${tx('TRN-09.title.2')}</span><span class="sub">${tx('TRN-09.sub.2')}</span></span>${ic('chevron-right')}</a></li>
    <li><a class="cell" href="#" data-set="sub=offer"><span class="body"><span class="title">${tx('TRN-09.h1.3')}</span></span>${ic('chevron-right')}</a></li>
    <li><a class="cell" href="#" data-set="sub=other"><span class="body"><span class="title">${tx('TRN-09.h1.2')}</span></span>${ic('chevron-right')}</a></li>
    <li><a class="cell" href="#" data-set="sub=past"><span class="body"><span class="title">${tx('TRN-09.h1')}</span>${spans.map((s) => `<span class="sub">${spanLine(s)}</span>`).join('')}</span>${ic('chevron-right')}</a></li></ul></section>`;
  return `<h1 class="t-title3">${tx('TRN-09.title')}</h1>${pair}${stageCard}${more}`;
}
const back = `<a class="btn btn-ghost btn-md back" href="#" data-set="sub=">${ic('chevron-left')}${tx('transitions.shared.btn')}</a>`;
function memberSub(rid, sub) {
  const t = D.T();
  if (sub === 'cond') return `${back}<h1 class="t-title3">${tx('TRN-09.h1.4')}</h1><p class="t-body-lg">${tx('TRN-09.p.4')}</p>
    <section class="card"><p class="t-body-lg">${tx('TRN-09.p.5')}</p></section>
    <section class="card"><p class="t-body-lg">${tx('TRN-09.p.6')}</p></section>${(D.stageOf(D.currentStage(rid).stage, D.currentStage(rid).since).conds ?? []).map((c) => `<section class="card"><p class="t-body-lg">${esc(c)}</p></section>`).join('')}`;
  if (sub === 'all') {
    const cur = D.currentStage(rid).stage;
    return `${back}<h1 class="t-title3">${tx('TRN-09.title.2')}</h1><p class="t-body-lg">${tx('TRN-09.p.10')}</p>
    ${D.stages().map((s) => `<section class="card"><h2 class="t-heading1">${esc(s.memberLabel)}${s.code === cur ? tx('TRN-09.map') : ''}</h2><p class="t-body-lg">${esc(s.memberDesc)}</p></section>`).join('')}
    <p class="t-body-lg">${tx('TRN-09.p.11')}</p>`;
  }
  if (sub === 'offer') {
    const prop = D.openProposal(rid), ex = prop && D.explanationsOf(prop).at(-1);
    const mgr = Object.values(PERSONAS).find((p) => p.key === 'MANAGER' && p.siteId === D.resident(rid).siteId);
    const op = ex && t.opinions.find((o) => o.code === ex.opinion);
    let text = tx('TRN-09.text.9');
    if (prop?.status === 'AWAITING_DECISION' && op) {
      const by = D.memberTag(prop.by), asked = D.mdText(D.ymdOf(prop.at)), m = mgr ? D.memberTag(mgr.id) : tx('TRN-09.text.8');
      const tail = ex.opinion === 'AGREES' ? `${tx('TRN-09.text.17', { m, josa: D.josa(m, tx('TRN-09.josa.6'), tx('TRN-09.josa.5')) })}` : ex.opinion === 'WANTS_TIME' ? tx('TRN-09.text.7') : ex.opinion === 'DISAGREES' ? tx('TRN-09.text.6') : '';
      text = `${tx('TRN-09.text.16', { asked, by, josa: D.josa(by, tx('TRN-09.josa.6'), tx('TRN-09.josa.5')), memberLabel: D.stageOf(prop.to).memberLabel, josa2: D.josa(D.stageOf(prop.to).memberLabel, tx('TRN-09.josa.4'), tx('TRN-09.josa.3')), v: op.member ? `${tx('TRN-09.text.5', { member: op.member })}` : '', tail })}`.replace(/\s+/g, ' ').trim();
    } else if (prop?.status === 'DRAFT') text = tx('TRN-09.text.4');
    return `${back}<h1 class="t-title3">${tx('TRN-09.h1.3')}</h1><section class="card"><p class="t-body-lg">${esc(text)}</p></section>`;
  }
  if (sub === 'other') {
    const exts = D.externalsOf(rid);
    const body = exts.length ? exts.map((e) => {
      const w = e.times.map((x) => `${tx('TRN-09.text.3', { wdLong: D.wdLong(x.wd), korTime: D.korTime(x.start), korTime2: D.korTime(x.end) })}`).join(', ');
      const type = t.careTypes.find((c) => c.code === e.type).label;
      const moved = t.overlaps.filter((o) => o.extId === e.id && o.resolution === 'MOVE_RESIDENCE_SERVICE').map((o) => {
        const sl = t.slots.filter((s) => s.movedFrom === o.slotId).at(-1), svc = D.serviceOf(sl.svc), ts = D.korTime(sl.start);
        return `<p class="t-body-lg">${tx('TRN-09.p.9', { type, josa: D.josa(type, tx('TRN-09.josa.2'), tx('TRN-09.josa')), shortLabel: svc.shortLabel, wdLong: D.wdLong(sl.wds[0]), ts, josaRo: D.josaRo(ts) })}</p>`;
      }).join('');
      return `<section class="card"><p class="t-body-lg">${esc(e.provider)}, ${type}, ${w}</p>${moved}</section>`;
    }).join('') : `<section class="card"><p class="t-body-lg">${tx('TRN-09.p.3')}</p></section>`;
    return `${back}<h1 class="t-title3">${tx('TRN-09.h1.2')}</h1>${body}<p class="t-body-lg">${tx('TRN-09.p.2')}</p>`;
  }
  const spans = D.stageSpans(rid);
  const row = (s) => {
    const dec = s.decisionId && D.decisionOf(s.decisionId), title = `${s.implicit ? tx('TRN-09.text.2') : `${tx('TRN-09.text', { longDate: D.longDate(s.from) })}`} · ${D.stageOf(s.stage, s.from).memberLabel}`;
    return dec ? `<details class="card"><summary class="t-body-lg">${esc(title)}</summary><p class="t-body-lg">${esc(D.whoDecidedText(dec))}</p></details>` : `<section class="card"><p class="t-body-lg">${esc(title)}</p></section>`;
  };
  return `${back}<h1 class="t-title3">${tx('TRN-09.h1')}</h1>${spans.map(row).join('')}<p class="t-body-lg">${tx('TRN-09.p')}</p>`;
}
function trn09() {
  const p = me();
  if (p.key === 'PROXY') return denied(tx('TRN-09.denied'));
  const rid = p.residentId;
  if (!D.currentStage(rid)) return empty(tx('TRN-09.empty'));
  return view.sub ? memberSub(rid, view.sub) : memberMain(rid);
}

// ---------- TRN-12 단계 정의 편집 (본사 관리자, 사업장 책임자). 한 번에 단계 하나를 새 버전으로 저장한다 ----------
function trn12(params) {
  if (me().key === 'OWNER' || !D.EDIT_KEYS.includes(me().key)) return `<div class="page-head"><h1 class="t-title2">${tx('TRN-12.h1')}</h1></div>${denied(D.MSG.noDef, tx('TRN-12.back'), href('TRN-01'))}`;
  const t = D.T(), code = params.stage && D.stageOf(params.stage) ? params.stage : 'LIVING_SUPPORT', f = D.defForm(code), st = t.defVersions.at(-1).stages.find((s) => s.code === code);
  const keep = f.dFee === 'KEEP', who = (id) => esc(D.staffTag(id));
  const field = (id, name, label, body) => `<div class="field"><label for="${id}">${label}</label>${body}</div>`;
  const input = (id, name, ph = '') => `<input id="${id}" class="input" type="text" name="${name}" data-bind="${name}" value="${esc(f[name])}"${ph ? ` placeholder="${ph}"` : ''}>`;
  const area = (id, name) => `<textarea id="${id}" class="input" name="${name}" data-bind="${name}">${esc(f[name])}</textarea>`;
  const fee = `<select id="n7" class="input" name="dFee" data-bind="dFee" data-live>${D.feeOptions().map(([v, l]) => `<option value="${v}"${f.dFee === v ? ' selected' : ''}>${l}</option>`).join('')}</select>`;
  const rec = t.defVersions.map((v) => `<div class="record"><span class="when">v${v.version}</span><span class="what">${v.by ? `${tx('TRN-12.from', { from: v.validFrom })} · ${esc(v.summary)}<br><span class="muted">${who(v.by)}</span>` : tx('TRN-12.from', { from: v.validFrom })}</span></div>`).join('');
  const ok = view.defSaved ? alert('ok', 'circle-check', tx('TRN-12.saved', { from: view.defSaved })) : '';
  const err = view.err ? alert('err', 'triangle-alert', view.err) : '';
  return `<div class="page-head">
        <div class="stack" style="gap: 4px;"><span class="crumb"><a href="${href('TRN-01')}">${tx('TRN-12.crumb')}</a></span><h1 class="t-title2">${tx('TRN-12.h1')}</h1></div>
      </div>
${SCOPE}
<p>${tx('TRN-12.p')}</p>
<section class="card" aria-label="${tx('TRN-12.aria')}"><h2 class="t-heading2">${esc(st.staffLabel)}</h2>
  <div class="grid2">${field('n1', 'dStaff', tx('TRN-12.n1'), input('n1', 'dStaff'))}${field('n2', 'dMember', tx('TRN-12.n2'), input('n2', 'dMember'))}</div>
  <p class="hint">${tx('TRN-12.hintName')}</p>
  ${field('n3', 'dDesc', tx('TRN-12.n3'), input('n3', 'dDesc'))}
  ${keep ? '' : field('n4', 'dServ', tx('TRN-12.n4'), area('n4', 'dServ'))}
  ${field('n5', 'dKeep', tx('TRN-12.n5'), area('n5', 'dKeep'))}
  ${field('n6', 'dCond', tx('TRN-12.n6'), area('n6', 'dCond'))}
  <div class="grid2">${field('n7', 'dFee', tx('TRN-12.n7'), fee)}${field('n8', 'dFrom', tx('TRN-12.n8'), input('n8', 'dFrom', tx('TRN-12.ph')))}</div>
  <p class="hint">${tx('TRN-12.hintFee')}</p>
  <p class="muted">${tx('TRN-12.scope')}</p>
  ${ok}${err}
  <div class="row"><button class="btn btn-primary btn-sm" type="button" data-act="trn.def.save" data-stage="${code}">${tx('TRN-12.save')}</button></div></section>
<section class="card" aria-labelledby="vh"><h2 id="vh" class="t-heading2">${tx('TRN-12.vh')}</h2><div>${rec}</div></section>
${demoNote}`;
}

export const screens = {
  'TRN-01': { app: 'ops', title: tx('TRN-01.title'), render: trn01 },
  'TRN-02': { app: 'ops', title: tx('TRN-02.title'), render: trn02 },
  'TRN-03': { app: 'ops', title: tx('TRN-03.title'), render: trn03 },
  'TRN-04': { app: 'ops', title: tx('TRN-04.title'), render: trn04 },
  'TRN-05': { app: 'ops', title: tx('TRN-05.title'), render: trn05 },
  'TRN-08': { app: 'ops', title: tx('TRN-08.title'), render: trn08 },
  'TRN-12': { app: 'ops', title: tx('TRN-12.title'), render: trn12 },
  'TRN-09': { app: 'home', title: tx('TRN-09.title'), render: trn09 },
};
