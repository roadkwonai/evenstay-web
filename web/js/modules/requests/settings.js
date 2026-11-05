// 책임자 설정 화면: REQ-17(정기 작업), REQ-18(요청 종류 설정). 정기 작업은 시계가 앞으로 갈 때 model.js catchUp이 회차로 만든다.
import { tx } from '../../lib/text.js';
import { dialog, denied, empty, esc, fmt, go, href, ic, me, nowISO, refuse, toast, view } from '../../lib/kit.js';
import { SITES } from '../../lib/people.js';
import { FEE_LABEL, S, TEAM_LABEL, TYPE_STAFF, WEEK, addDays, catchUp, nameOf, nextRuleDate, priceOf, residentsList, today } from './model.js';

const RECUR_ROLES = ['MANAGER', 'HQ_OPS'];       // requests.recurring.manage
const SETTINGS_ROLES = ['MANAGER', 'HQ_ADMIN'];  // requests.settings.manage
const TYPE_FEE = { LAUNDRY: 'LAUNDRY_BEDDING' };
const UNITS = '@UNITS', COMMON = '@COMMON';      // 대상 칸의 값. 동 이름과 겹치지 않는 기호
const NTH = tx('REQ-17.nth').split(' ');
const FORM_TEAMS = ['HOUSEKEEPING', 'FACILITY'];
const FORM_KINDS = ['CLEANING', 'INSPECTION'];

// ---------- 문장 ----------
const roomsOf = () => [...new Set(residentsList().map((x) => x.room))];
const buildings = () => [...new Set(roomsOf().map((r) => r.split(' ')[0]))];
const roomCount = (pred) => new Set(residentsList().filter(pred).map((x) => x.room)).size;
function repeatOf(t) {
  const r = t.rule;
  if (r.kind === 'WEEKLY') return tx('REQ-09.h2', { days: r.days.map((d) => WEEK[d]).join(', ') });
  if (r.kind === 'MONTHLY_NTH') return tx('REQ-17.rep.nth', { nth: NTH[r.nth - 1], w: WEEK[r.weekday] });
  return tx('REQ-17.rep.day', { day: r.day });
}
function targetOf(t) {
  if (t.target.kind === 'COMMON') return tx('REQ-17.target.common');
  if (t.target.kind === 'UNITS') return tx('REQ-17.target.units', { n: t.target.rooms.length });
  return tx('REQ-17.target.building', { building: esc(t.target.building), n: roomCount((x) => x.room.startsWith(t.target.building)) });
}
const dueText = (r) => {
  if (r.base === 'CREATED') return tx('REQ-18.due.created', { n: r.hours / 24 });
  if (r.base === 'PICKUP') return tx('REQ-18.due.pickup', { n: r.hours / 24 });
  if (r.base === 'PREFERRED') return tx('REQ-18.due.preferred');
  return r.type === 'INSPECTION' ? tx('REQ-18.due.occ') : tx('REQ-18.due.dayend');
};
const reEsc = (t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const pat = (key) => new RegExp('^' + reEsc(tx(key, { n: '@' })).replace('@', '(\\d+)') + '$');
const P_CREATED = pat('REQ-18.due.created'), P_PICKUP = pat('REQ-18.due.pickup');
/** 처리 기한 칸의 글을 (기준, 시간)으로 바꾼다. 맞는 모양이 아니면 null */
function parseDue(text) {
  const t = text.trim();
  let m = t.match(P_CREATED);
  if (m && +m[1] > 0) return { base: 'CREATED', hours: 24 * +m[1] };
  m = t.match(P_PICKUP);
  if (m && +m[1] > 0) return { base: 'PICKUP', hours: 24 * +m[1] };
  if (t === tx('REQ-18.due.preferred')) return { base: 'PREFERRED', hours: 0 };
  if (t === tx('REQ-18.due.dayend') || t === tx('REQ-18.due.occ')) return { base: 'DAYEND', hours: 0 };
  return null;
}

// ---------- 공통 ----------
const dateOk = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s) && fmt.ymd(new Date(`${s}T12:00:00`)) === s;
const dayOf = (ymd) => new Date(`${ymd}T12:00:00`).getDay();
const clearForm = (prefix) => { for (const k of Object.keys(view)) if (k.startsWith(prefix)) delete view[k]; };
const need = (roles, key) => { if (!roles.includes(me().key)) refuse(tx(key)); };
function head(title, here) {
  const p = me();
  const tabs = [[RECUR_ROLES, 'REQ-17', tx('REQ-17.title')], [SETTINGS_ROLES, 'REQ-18', tx('REQ-18.title')]].filter(([roles]) => roles.includes(p.key));
  return `<div class="page-head"><div><nav class="crumb" aria-label="${tx('REQ-17.crumb.aria')}"><span>${tx('REQ-17.crumb')}</span></nav><h1 class="t-title2">${title}</h1></div><span class="badge">${esc(SITES.S1.name)}</span></div>
<div class="tabs">${tabs.map(([, id, label]) => `<a href="${href(id)}"${id === here ? ' aria-current="page"' : ''}>${label}</a>`).join('')}</div>`;
}

// ---------- REQ-17 정기 작업 ----------
const live = () => S().tasks.filter((t) => !t.endedOn);
const taskById = (id) => live().find((t) => t.id === id);
/** 입력 칸 값. 만지지 않은 칸은 기본값 */
function form() {
  const blds = buildings();
  const rooms = roomsOf();
  return {
    name: (view.j_name ?? '').trim(), kind: view.j_kind ?? 'CLEANING', target: view.j_target ?? blds[0], team: view.j_team ?? 'HOUSEKEEPING', rep: view.j_rep ?? 'WEEKLY',
    start: (view.j_start ?? '').trim(), end: (view.j_end ?? '').trim(), rooms: rooms.filter((_, i) => view[`j_room_${i}`]), allow: view.j_skip === undefined ? true : !!view.j_skip,
  };
}
function formOk(f, editing) {
  if (!f.name) return false;
  if (editing) return !f.end || (dateOk(f.end) && f.end >= editing.startsOn);
  if (!dateOk(f.start) || (f.end && (!dateOk(f.end) || f.end < f.start))) return false;
  return f.target !== UNITS || f.rooms.length > 0;
}

function screen17() {
  const p = me();
  if (!RECUR_ROLES.includes(p.key)) {
    if (SETTINGS_ROLES.includes(p.key)) { go('REQ-18'); return ''; }
    return { main: `<div class="page-head"><div><h1 class="t-title2">${tx('REQ-17.title')}</h1></div></div>${denied(tx('REQ-17.denied'))}` };
  }
  const tasks = live();
  const editing = taskById(view.edit);
  const f = form();
  const row = (t) => `<tr data-task="${t.id}"><td data-label="${tx('REQ-17.th.name')}"><b class="strong">${esc(t.name)}</b></td><td data-label="${tx('REQ-17.th.repeat')}">${repeatOf(t)}</td><td data-label="${tx('REQ-17.th.target')}">${targetOf(t)}</td><td data-label="${tx('REQ-17.th.team')}">${tx('REQ-17.team', { team: TEAM_LABEL[t.team], name: nameOf(t.assignee) })}</td><td data-label="${tx('REQ-17.th.start')}" class="num">${t.startsOn}</td><td data-label="${tx('REQ-17.th.skip')}">${t.allowSkip ? tx('REQ-17.skip.on', { time: t.skipCutoff.time }) : tx('REQ-17.skip.off')}</td><td><span class="row-act"><button class="btn btn-ghost btn-sm" type="button" data-act="req.recur.edit" data-id="${t.id}">${tx('REQ-17.btn.change')}</button><button class="btn btn-ghost btn-sm" type="button" data-set="dialog=end&target=${t.id}">${tx('REQ-17.btn.end')}</button></span></td></tr>`;
  const list = tasks.length
    ? `<div class="tbl reflow fit"><table><thead><tr><th scope="col">${tx('REQ-17.th.name')}</th><th scope="col">${tx('REQ-17.th.repeat')}</th><th scope="col">${tx('REQ-17.th.target')}</th><th scope="col">${tx('REQ-17.th.team')}</th><th scope="col">${tx('REQ-17.th.start')}</th><th scope="col">${tx('REQ-17.th.skip')}</th><th scope="col"><span class="sr-only">${tx('REQ-17.th.act')}</span></th></tr></thead><tbody>${tasks.map(row).join('')}</tbody></table></div>`
    : empty(tx('REQ-17.empty'));
  // 바꾸기 중에는 종류, 대상, 반복, 시작일을 그대로 두고 이름, 담당 팀, 끝나는 날, 쉬기만 고친다
  const lock = editing ? ' disabled' : '';
  const kind = editing ? editing.type : f.kind;
  const target = editing ? (editing.target.kind === 'BUILDING' ? editing.target.building : editing.target.kind === 'UNITS' ? UNITS : COMMON) : f.target;
  const rep = editing ? (editing.rule.kind === 'WEEKLY' ? 'WEEKLY' : editing.rule.kind === 'MONTHLY_DAY' ? 'MONTHLY' : '') : f.rep;
  const start = editing ? editing.startsOn : f.start;
  const opt = (v, label, cur) => `<option value="${esc(v)}"${v === cur ? ' selected' : ''}>${label}</option>`;
  const picker = target === UNITS && !editing
    ? `<fieldset class="rg" style="border: 0; padding: 0; margin: 0;"><legend class="label" style="font-weight: 600; margin-bottom: 4px;">${tx('REQ-17.rooms')}</legend>${roomsOf().map((r, i) => `<label class="choice"><input type="checkbox" name="j_room_${i}" data-bind="j_room_${i}" data-live${view[`j_room_${i}`] ? ' checked' : ''}>${esc(r)}</label>`).join('')}</fieldset>`
    : '';
  const ok = formOk(f, editing);
  const dlg = view.dialog === 'end' ? taskById(view.target) : null;
  const created = view.created ? `<div class="alert alert-ok" role="status">${ic('circle-check')}<p>${tx('REQ-17.created', { md: fmt.md(`${view.created}T12:00:00`), w: WEEK[dayOf(view.created)] })}</p></div>` : '';
  const main = `${head(tx('REQ-17.title'), 'REQ-17')}
      <p>${tx('REQ-17.intro')}</p>${created}
      <section class="card" aria-labelledby="j1"><h2 id="j1" class="t-heading2">${tx('REQ-17.list.h2')}</h2>${list}<p class="muted">${tx('REQ-17.note')}</p></section>
      <section class="card" aria-labelledby="j2"><h2 id="j2" class="t-heading2">${editing ? tx('REQ-17.dlg.line', { name: esc(editing.name), repeat: repeatOf(editing) }) : tx('REQ-17.create.h2')}</h2>
        <div class="grid2">
          <div class="field"><label for="j-name">${tx('REQ-17.label.name')}</label><input id="j-name" class="input" type="text" name="j_name" data-bind="j_name" data-live value="${esc(view.j_name ?? '')}"></div>
          <div class="field"><label for="j-kind">${tx('REQ-17.label.kind')}</label><select id="j-kind" class="input" name="j_kind" data-bind="j_kind" data-live${lock}>${FORM_KINDS.map((k) => opt(k, TYPE_STAFF[k], kind)).join('')}</select></div>
          <div class="field"><label for="j-target">${tx('REQ-17.label.target')}</label><select id="j-target" class="input" name="j_target" data-bind="j_target" data-live${lock}>${buildings().map((b) => opt(b, esc(b), target)).join('')}${opt(UNITS, tx('REQ-17.target.pick'), target)}${opt(COMMON, tx('REQ-17.target.common'), target)}</select></div>
          <div class="field"><label for="j-team">${tx('REQ-17.label.team')}</label><select id="j-team" class="input" name="j_team" data-bind="j_team" data-live>${FORM_TEAMS.map((k) => opt(k, TEAM_LABEL[k], f.team)).join('')}</select></div>
          <div class="field"><label for="j-start">${tx('REQ-17.label.start')}</label><input id="j-start" class="input" type="text" name="j_start" data-bind="j_start" data-live placeholder="${tx('REQ-17.placeholder.start')}" value="${esc(start)}"${lock}></div>
          <div class="field"><label for="j-end">${tx('REQ-17.label.end')}</label><input id="j-end" class="input" type="text" name="j_end" data-bind="j_end" data-live value="${esc(view.j_end ?? '')}"></div>
        </div>${picker}
        <fieldset class="rg" style="border: 0; padding: 0; margin: 0;"><legend class="label" style="font-weight: 600; margin-bottom: 4px;">${tx('REQ-17.legend.repeat')}</legend><label class="choice"><input type="radio" name="j_rep" value="WEEKLY" data-bind="j_rep" data-live${rep === 'WEEKLY' ? ' checked' : ''}${lock}>${tx('REQ-17.rep.weekly')}</label><label class="choice"><input type="radio" name="j_rep" value="MONTHLY" data-bind="j_rep" data-live${rep === 'MONTHLY' ? ' checked' : ''}${lock}>${tx('REQ-17.rep.monthly')}</label></fieldset>
        <label class="choice"><input type="checkbox" name="j_skip" data-bind="j_skip" data-live${f.allow ? ' checked' : ''}>${tx('REQ-17.allow')}</label>
      </section>
      <div class="row end">${editing ? `<button class="btn btn-secondary btn-sm" type="button" data-act="req.recur.cancel">${tx('REQ-17.end.keep')}</button><button class="btn btn-primary btn-sm" type="button" data-act="req.recur.save" data-id="${editing.id}"${ok ? '' : ' disabled'}>${tx('REQ-17.btn.change')}</button>`
        : `<button class="btn ${view.dialog ? 'btn-secondary' : 'btn-primary'} btn-sm" type="button" data-act="req.recur.create"${ok ? '' : ' disabled'}>${tx('REQ-17.create.h2')}</button>`}</div>${ok || editing ? '' : `<p class="muted">${tx('REQ-17.whyOff')}</p>`}<p class="demo-note">${tx('REQ-17.demo')}</p>`;
  const overlay = dlg
    ? dialog(tx('REQ-17.end.title'), `<p class="muted">${tx('REQ-17.dlg.line', { name: esc(dlg.name), repeat: repeatOf(dlg) })}</p><p>${tx('REQ-17.end.body')}</p>`, `<button class="btn btn-secondary btn-md" type="button" data-set="dialog=">${tx('REQ-17.end.keep')}</button><button class="btn btn-primary btn-md" type="button" data-act="req.recur.end" data-id="${dlg.id}">${tx('REQ-17.btn.end')}</button>`)
    : '';
  return { main, overlay };
}

// ---------- REQ-18 요청 종류 설정 ----------
function screen18() {
  const p = me();
  if (!SETTINGS_ROLES.includes(p.key)) {
    if (RECUR_ROLES.includes(p.key)) { go('REQ-17'); return ''; }
    return { main: `<div class="page-head"><div><h1 class="t-title2">${tx('REQ-18.title')}</h1></div></div>${denied(tx('REQ-18.denied'))}` };
  }
  const s = S();
  const fee = (type) => {
    const code = TYPE_FEE[type];
    return code && priceOf(code) !== undefined ? tx('REQ-18.cost.fee', { unit: FEE_LABEL[code].unit, won: fmt.won(priceOf(code)) }) : tx('REQ-18.cost.none');
  };
  const row = (r) => {
    const team = view[`k_team_${r.type}`] ?? r.team, due = view[`k_due_${r.type}`] ?? dueText(r);
    return `<tr><td data-label="${tx('REQ-18.th.type')}"><b class="strong">${TYPE_STAFF[r.type]}</b></td>
      <td data-label="${tx('REQ-18.th.team')}"><label class="sr-only" for="kt-${r.type}">${tx('REQ-18.label.team', { type: TYPE_STAFF[r.type] })}</label><select id="kt-${r.type}" class="input" name="k_team_${r.type}" data-bind="k_team_${r.type}">${Object.keys(TEAM_LABEL).map((k) => `<option value="${k}"${k === team ? ' selected' : ''}>${TEAM_LABEL[k]}</option>`).join('')}</select></td>
      <td data-label="${tx('REQ-18.th.due')}"><label class="sr-only" for="kd-${r.type}">${tx('REQ-18.label.due', { type: TYPE_STAFF[r.type] })}</label><input id="kd-${r.type}" class="input" type="text" name="k_due_${r.type}" data-bind="k_due_${r.type}" value="${esc(due)}"></td>
      <td data-label="${tx('REQ-18.th.cost')}">${fee(r.type)}</td></tr>`;
  };
  return `${head(tx('REQ-18.title'), 'REQ-18')}
      <p>${tx('REQ-18.intro')}</p>
      <section class="card" aria-labelledby="k1"><h2 id="k1" class="t-heading2">${tx('REQ-18.h2')}</h2>
        <div class="tbl reflow fit"><table><thead><tr><th scope="col">${tx('REQ-18.th.type')}</th><th scope="col">${tx('REQ-18.th.team')}</th><th scope="col">${tx('REQ-18.th.due')}</th><th scope="col">${tx('REQ-18.th.cost')}</th></tr></thead><tbody>${s.settings.map(row).join('')}</tbody></table></div>
        <p class="muted">${tx('REQ-18.cost.note')}</p></section>
      <section class="card" aria-labelledby="k2"><h2 id="k2" class="t-heading2">${tx('REQ-18.teams.h2')}</h2>
        <dl class="kv wide">${Object.keys(TEAM_LABEL).map((k) => `<dt>${TEAM_LABEL[k]}</dt><dd>${s.teams[k].map(nameOf).join(', ')}</dd>`).join('')}</dl></section>
      <p class="muted">${tx('REQ-18.save.note')}</p>
      <div class="row end"><button class="btn btn-primary btn-sm" type="button" data-act="req.settings.save">${tx('REQ-18.save')}</button></div><p class="demo-note">${tx('REQ-18.demo')}</p>`;
}

// ---------- 행동 ----------
export const settingsActions = {
  'req.recur.create': () => {
    need(RECUR_ROLES, 'REQ-17.denied');
    const f = form(), s = S();
    if (view.edit || !formOk(f)) return;
    const rule = f.rep === 'MONTHLY' ? { kind: 'MONTHLY_DAY', day: +f.start.slice(8) } : { kind: 'WEEKLY', days: [dayOf(f.start)] }; // 요일과 날짜는 시작일에서 정한다(보드에 고르는 칸이 없다)
    const target = f.target === UNITS ? { kind: 'UNITS', rooms: f.rooms } : f.target === COMMON ? { kind: 'COMMON', label: f.name } : { kind: 'BUILDING', building: f.target };
    const from = f.start > today() ? f.start : today();
    const t = {
      id: `T-${s.tasks.length + 1}`, name: f.name, type: f.kind, rule, target, team: f.team, assignee: s.teams[f.team][0], startsOn: f.start, endsOn: f.end || null, endedOn: null,
      allowSkip: f.allow, skipCutoff: { daysBefore: 1, time: '18:00' }, generatedThrough: addDays(from, -1), history: [{ at: nowISO(), by: me().id, act: 'CREATE' }],
    };
    const first = nextRuleDate(t, addDays(from, -1));
    if (!first || (t.endsOn && first > t.endsOn)) return;
    s.tasks.push(t);
    catchUp(); // 첫 회차가 오늘이면 바로 만든다
    clearForm('j_');
    view.created = first;
    toast(tx('REQ-17.created', { md: fmt.md(`${first}T12:00:00`), w: WEEK[dayOf(first)] }));
  },
  'req.recur.edit': (a) => {
    need(RECUR_ROLES, 'REQ-17.denied');
    const t = taskById(a.id);
    if (!t) return;
    clearForm('j_');
    Object.assign(view, { edit: t.id, j_name: t.name, j_team: t.team, j_end: t.endsOn ?? '', j_skip: t.allowSkip ? '1' : '' });
    delete view.created;
  },
  'req.recur.cancel': () => { clearForm('j_'); delete view.edit; },
  'req.recur.save': (a) => {
    need(RECUR_ROLES, 'REQ-17.denied');
    const t = taskById(a.id), f = form();
    if (!t || !formOk(f, t)) return;
    if (t.team !== f.team) { t.team = f.team; t.assignee = S().teams[f.team][0]; }
    Object.assign(t, { name: f.name, endsOn: f.end || null, allowSkip: f.allow });
    (t.history ||= []).push({ at: nowISO(), by: me().id, act: 'CHANGE' });
    clearForm('j_'); delete view.edit;
  },
  'req.recur.end': (a) => {
    need(RECUR_ROLES, 'REQ-17.denied');
    const t = taskById(a.id);
    if (!t) return;
    t.endedOn = today(); // 이미 만든 회차는 그대로 두고 다음 회차부터 만들지 않는다
    (t.history ||= []).push({ at: nowISO(), by: me().id, act: 'END' });
    view.dialog = ''; view.target = '';
  },
  'req.settings.save': () => {
    need(SETTINGS_ROLES, 'REQ-18.denied');
    const s = S();
    const rows = s.settings.map((r) => {
      const due = parseDue(view[`k_due_${r.type}`] ?? dueText(r));
      if (!due) refuse(tx('REQ-18.refuse', { type: TYPE_STAFF[r.type], example: tx('REQ-18.due.created', { n: 2 }) }));
      return { type: r.type, team: view[`k_team_${r.type}`] ?? r.team, ...due };
    });
    if (rows.some((n, i) => n.team !== s.settings[i].team || n.base !== s.settings[i].base || n.hours !== s.settings[i].hours)) {
      s.settingsVersion ??= 1;
      (s.settingsLog ||= []).push({ version: s.settingsVersion, at: nowISO(), by: me().id, rows: s.settings }); // 옛 버전은 남긴다
      s.settingsVersion += 1;
      s.settings = rows; // 이미 만든 요청은 만들 때 값(dueAt, team)을 그대로 쓴다
    }
    clearForm('k_');
    toast(tx('REQ-18.saved'));
  },
};
export const settingsScreens = {
  'REQ-17': { app: 'ops', title: tx('REQ-17.title'), render: screen17 },
  'REQ-18': { app: 'ops', title: tx('REQ-18.title'), render: screen18 },
};
