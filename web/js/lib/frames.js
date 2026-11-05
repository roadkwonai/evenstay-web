// 세 앱의 틀(mvp-screens 1-1~1-3). 화면 render는 틀 안 내용만 돌려준다.
import { tx } from './text.js';
import { api, db, ic, me, route, view, href, esc } from './kit.js';
import { SITES } from './people.js';

export const altPath = () => `<div class="alt-path">
  <a class="btn btn-secondary btn-block" href="tel:0200000000">${ic('x0')}${tx('common.altPath.btn')}</a>
  <p class="t-body-md muted">${tx('common.altPath.p')} <span class="nowrap">02-000-0000</span> <span class="nowrap">${tx('common.altPath.span')}</span></p>
</div>`;
const LOGO = { home: 'assets/logo/evenstay-home-logo-light.svg', family: 'assets/logo/evenstay-family-logo-light.svg', ops: 'assets/logo/evenstay-logo-light.svg' };

/** 회원 틀. r = 문자열(본문만) 또는 { main, rail, foot, overlay, wide } */
export function homeFrame(r, isFirst) {
  const o = typeof r === 'string' ? { main: r } : r;
  const top = isFirst
    ? `<span class="btn btn-ghost btn-md is-current" aria-current="page">${ic('house')}${tx('common.homeFrame.btn')}</span>`
    : `<a class="btn btn-ghost btn-md" href="${href('COM-07')}">${ic('house')}${tx('common.homeFrame.btn')}</a>`;
  return `<div class="screen home">
  <header class="appbar"><img src="${LOGO.home}" alt="${tx('common.homeFrame.alt')}">${top}</header>
  <main class="wrap-home has-rail">
    <div class="desk-main">${o.main}</div>
    <aside class="side-rail" aria-label="${tx('common.homeFrame.ariaLabel')}">${o.rail || ''}${altPath()}</aside>
    ${o.foot || ''}
    <p class="t-body-md muted">${tx('common.homeFrame.p')}</p>
  </main>${o.overlay || ''}
</div>`;
}

const FAM_ITEMS = [[tx('common.FAM_ITEMS.text.5'), 'FAM-06b', 'LIFE'], [tx('common.FAM_ITEMS.text.4'), 'FAM-06e', 'SCHEDULE'], [tx('common.FAM_ITEMS.text.3'), 'FAM-06c', 'BILL'], [tx('common.FAM_ITEMS.text.2'), 'FAM-06d', 'HEALTH'], [tx('common.FAM_ITEMS.text'), 'REQ-10', 'REQUEST']];
/** 패밀리 틀. r = 문자열 또는 { main, railTop, noRail, overlay } */
export function familyFrame(r) {
  const o = typeof r === 'string' ? { main: r } : r;
  const p = me();
  const who = api.core.residentName?.(p.residentId) ?? '';
  const items = FAM_ITEMS.filter(([, , k]) => api.family.canSee?.(p.id, k));
  const cell = (t, id) => `<li class="cell"><a class="body" href="${href(id)}"${route.id === id ? ' aria-current="page"' : ''}><span class="title">${t}</span></a>${ic('chevron-right')}</li>`;
  const rail = o.noRail ? '' : `<aside class="side-rail" aria-label="${tx('common.familyFrame.ariaLabel')}">${o.railTop || ''}
    ${o.noList ? '' : `    <h2 class="t-label-lg muted">${tx('common.familyFrame.h2')}</h2>
    <nav aria-label="${tx('common.familyFrame.h2')}"><ul class="list">${items.map(([t, id]) => cell(t, id)).join('')}</ul></nav>
    <hr class="divider">`}
    <nav aria-label="${tx('common.familyFrame.cell')}"><ul class="list">${cell(tx('common.familyFrame.cell'), 'FAM-06f')}</ul></nav>
    <hr class="divider">
    <p class="t-body-md muted">${tx('common.familyFrame.p.2')}<span class="nowrap">(<a href="tel:0200000000">02-000-0000</a>${tx('common.familyFrame.a')}</span>${tx('common.familyFrame.span.2')}</p>
  </aside>`;
  return `<div class="screen fam">
  <header class="appbar"><img src="${LOGO.family}" alt="${tx('common.familyFrame.alt')}"><span class="who">${tx('common.familyFrame.span', { who: esc(who) })}</span></header>
  <main class="wrap-fam${o.noRail ? '' : ' has-rail'}">
    <div class="desk-main">${o.main}</div>
    ${rail}
    <p class="demo-note">${tx('common.familyFrame.p')}</p>
  </main>${o.overlay || ''}
</div>`;
}

const NAV = [
  ['today', tx('common.NAV.text.27'), [[tx('common.NAV.text.26'), 'CORE-01', ['CORE-01']]]],
  ['people', tx('common.NAV.text.25'), [[tx('common.NAV.text.24'), 'CORE-02', ['CORE-02']], [tx('common.NAV.text.23'), 'CORE-04', ['CORE-04', 'CORE-05']], [tx('common.NAV.text.22'), 'CORE-13', ['CORE-13']],
    [tx('common.NAV.text.21'), 'TRN-02', ['TRN-01', 'TRN-02', 'TRN-03', 'TRN-04', 'TRN-05']], [tx('common.NAV.text.20'), 'FAM-09', ['FAM-09', 'FAM-11', 'FAM-12']]]],
  ['money', tx('common.NAV.text.19'), [[tx('common.NAV.text.18'), 'CORE-06', ['CORE-06']], [tx('common.NAV.text.17'), 'CORE-07', ['CORE-07']], [tx('common.NAV.text.16'), 'CORE-14', ['CORE-09', 'CORE-14']]]],
  ['safety', tx('common.NAV.text.15'), [[tx('common.NAV.text.14'), 'SAF-01', ['SAF-01', 'SAF-02', 'SAF-13', 'SAF-16', 'SAF-17']], [tx('common.NAV.text.13'), 'SAF-12', ['SAF-12']], [tx('common.NAV.text.12'), 'SAF-08', ['SAF-08']]]],
  ['work', tx('common.NAV.text.11'), [[tx('common.NAV.text.10'), 'REQ-12', ['REQ-12', 'AST-09']], [tx('common.NAV.text.9'), 'CMN-14', ['CMN-14', 'CMN-17', 'CMN-20']], [tx('common.NAV.text.8'), 'FAM-10', ['FAM-10']]]],
  ['settings', tx('common.NAV.text.7'), [[tx('common.NAV.text.6'), 'CORE-03', ['CORE-03']], [tx('common.NAV.text.5'), 'TRN-12', ['TRN-12']], [tx('common.NAV.text.4'), 'SAF-11', ['SAF-11']], [tx('common.NAV.text.3'), 'REQ-17', ['REQ-17', 'REQ-18']], [tx('common.NAV.text.2'), 'CMN-22', ['CMN-22']], [tx('common.NAV.text'), 'AST-11', ['AST-11']]]],
];
const ROLE_GROUPS = {
  ACCOUNTING: ['today', 'people', 'money'], FRONT: ['people', 'money', 'safety', 'work'],
  LIFE: ['safety', 'people', 'work'], CARE: ['safety', 'people', 'work'], STAFF: ['work'],
};
const ROLE_ITEMS = { // 묶음 안에서 보이는 항목을 더 줄이는 역할(1-3절 역할 표)
  FRONT: { money: ['CORE-06'] }, ACCOUNTING: { people: ['CORE-04'] },
  LIFE: { people: ['TRN-02', 'FAM-09'] }, CARE: { people: ['TRN-02', 'FAM-09'] },
};
export const FIRST_SCREEN = { HQ_ADMIN: 'CORE-01', HQ_OPS: 'CORE-01', MANAGER: 'CORE-01', ACCOUNTING: 'CORE-01', FRONT: 'REQ-12', LIFE: 'SAF-12', CARE: 'SAF-12', STAFF: 'REQ-12', OWNER: 'CORE-09', MEMBER: 'COM-07', GUARDIAN: 'FAM-06a', PROXY: 'COM-07' };

/** 이 계정이 사이드바에서 갈 수 있는 화면(권한 없음 판단에도 쓴다) */
export function navFor(p) {
  const night = api.safety.isNightDuty?.(p.id);
  const groups = night ? ['safety'] : ROLE_GROUPS[p.key];
  return NAV.filter(([k]) => !groups || groups.includes(k)).map(([k, g, items]) => [g, items.filter(([, id]) => {
    const rule = ROLE_ITEMS[p.key]?.[k]; return !rule || rule.includes(id);
  })]);
}

/** 운영 틀. r = 문자열 또는 { main, overlay } */
export function opsFrame(r) {
  const o = typeof r === 'string' ? { main: r } : r;
  const p = me();
  const site = p.siteId ? SITES[p.siteId].name : view.siteName || SITES.S1.name;
  const counts = Object.assign({}, ...Object.values(api).map((a) => a.navCounts?.() || {}));
  const night = api.safety.isNightDuty?.(p.id);
  const owner = p.key === 'OWNER';
  const side = owner || night ? '' : `<nav class="ops-side${view.navOpen ? ' is-open' : ''}" aria-label="${tx('common.opsFrame.ariaLabel.3')}">${navFor(p).map(([g, items]) => `<p class="grp">${g}</p>` + items.map(([label, id, owns]) => {
    const n = counts[id];
    return `<a class="nav-item" href="${href(id)}"${owns.includes(route.id) ? ' aria-current="page"' : ''}>${label}${n ? `<span class="cnt">${n}</span>` : ''}</a>`;
  }).join('')).join('')}</nav>`;
  const tabs = night ? `<div class="tabs night" aria-label="${tx('common.opsFrame.ariaLabel.2')}">${navFor(p)[0][1].map(([label, id, owns]) => `<a href="${href(id)}"${owns.includes(route.id) ? ' aria-current="page"' : ''}>${label}</a>`).join('')}</div>` : '';
  return `<div class="screen ops">
  <header class="appbar"><img src="${LOGO.ops}" alt="Evenstay">
    <div class="row" style="gap: 12px; margin-left: auto;">
      <span class="t-label">${esc(site)}</span>
      <span class="t-label muted">${esc(p.name)} ${esc(night ? tx('common.opsFrame.esc') : p.role)}</span>
      ${owner || night ? '' : `<button class="btn btn-ghost btn-sm ops-menu" type="button" aria-label="${tx('common.opsFrame.ariaLabel')}" data-set="navOpen=${view.navOpen ? '' : '1'}">${ic('menu')}</button>`}
    </div>
  </header>
  <div class="ops-shell">${side}
    <main class="ops-main">${tabs}${o.main}</main>
  </div>${o.overlay || ''}
</div>`;
}
