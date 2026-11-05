---
version: alpha
name: Evenstay
description: 회원과 가족이 같은 사실을 같은 때에, 근거와 함께 보는 시니어 레지던스 PMS. 브랜드 컨셉 3안 "함께 보는 기록"(2026-11-03 사용자 선택). v2(2026-11-03) 원티드 몽타주 수준으로 보완.
colors:
  # semantic, light (default). atomic ramps are in ## Colors
  bg-canvas: "#FAFAF7"
  bg-surface: "#FEFEFC"
  bg-subtle: "#F4F4F0"
  bg-muted: "#EEEFEA"
  bg-elevated: "#FEFEFC"
  bg-inverse: "#17191C"
  fg-strong: "#17191C"
  fg-default: "#24272A"
  fg-secondary: "#555A60"
  fg-tertiary: "#65696F"
  fg-disabled: "#65696F"
  fg-on-inverse: "#FAFAF7"
  fg-brand-on-inverse: "#9DB2F2"
  border-subtle: "#E3E4DF"
  border-default: "#D2D4CE"
  border-strong: "#555A60"
  primary: "#2340A0"
  primary-hover: "#183083"
  primary-active: "#0C1D60"
  on-primary: "#F8F9FC"
  primary-subtle: "#E8EDF8"
  fg-brand: "#2340A0"
  highlight: "#F3D766"
  on-highlight: "#17191C"
  danger: "#B42318"
  danger-hover: "#94170E"
  on-danger: "#FBF8F7"
  danger-subtle: "#FEF4F2"
  fg-danger: "#B42318"
  success-subtle: "#EBFCEF"
  fg-success: "#1E7A46"
  warning-subtle: "#FEF5EC"
  fg-warning: "#9A5B00"
  # semantic, dark (.dark). same names with dark- prefix
  dark-bg-canvas: "#121316"
  dark-bg-surface: "#1A1C20"
  dark-bg-subtle: "#202328"
  dark-bg-muted: "#272A30"
  dark-bg-elevated: "#2A2D33"
  dark-bg-inverse: "#FAFAF7"
  dark-fg-strong: "#F4F4F1"
  dark-fg-default: "#E3E4E0"
  dark-fg-secondary: "#AEB2B8"
  dark-fg-tertiary: "#9195A0"
  dark-fg-disabled: "#9195A0"
  dark-fg-on-inverse: "#17191C"
  dark-fg-brand-on-inverse: "#2340A0"
  dark-border-subtle: "#2C2F35"
  dark-border-default: "#3A3E45"
  dark-border-strong: "#9195A0"
  dark-primary: "#8EA6F0"
  dark-primary-hover: "#A8BBF4"
  dark-primary-active: "#C2D0F8"
  dark-on-primary: "#0C1640"
  dark-primary-subtle: "#1E2A55"
  dark-fg-brand: "#9DB2F2"
  dark-highlight: "#F3D766"
  dark-on-highlight: "#17191C"
  dark-danger: "#F2877A"
  dark-danger-hover: "#F5A196"
  dark-on-danger: "#2A0703"
  dark-danger-subtle: "#3A1B18"
  dark-fg-danger: "#F48E81"
  dark-success-subtle: "#14301F"
  dark-fg-success: "#7FCB98"
  dark-warning-subtle: "#33240F"
  dark-fg-warning: "#E5AE6A"
  # interaction overlays (ink on light, paper on dark)
  state-hover: "#17191C0F"
  state-active: "#17191C1F"
  dark-state-hover: "#F4F4F114"
  dark-state-active: "#F4F4F129"
  scrim: "#17191C80"
  dark-scrim: "#000000A6"
typography:
  display1:
    fontFamily: Pretendard
    fontSize: 3rem
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: -0.025em
  display2:
    fontFamily: Pretendard
    fontSize: 2.5rem
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: -0.022em
  title1:
    fontFamily: Pretendard
    fontSize: 2rem
    fontWeight: 700
    lineHeight: 1.35
    letterSpacing: -0.02em
  title2:
    fontFamily: Pretendard
    fontSize: 1.75rem
    fontWeight: 700
    lineHeight: 1.36
    letterSpacing: -0.018em
  title3:
    fontFamily: Pretendard
    fontSize: 1.5rem
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: -0.015em
  heading1:
    fontFamily: Pretendard
    fontSize: 1.375rem
    fontWeight: 700
    lineHeight: 1.45
    letterSpacing: -0.012em
  heading2:
    fontFamily: Pretendard
    fontSize: 1.25rem
    fontWeight: 600
    lineHeight: 1.45
    letterSpacing: -0.01em
  headline:
    fontFamily: Pretendard
    fontSize: 1.125rem
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: -0.004em
  body-lg:
    fontFamily: Pretendard
    fontSize: 1.25rem
    fontWeight: 400
    lineHeight: 1.6
  body-md:
    fontFamily: Pretendard
    fontSize: 1.0625rem
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0.002em
  body-md-read:
    fontFamily: Pretendard
    fontSize: 1.0625rem
    fontWeight: 400
    lineHeight: 1.75
    letterSpacing: 0.002em
  body-sm:
    fontFamily: Pretendard
    fontSize: 0.9375rem
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: 0.006em
  label-lg:
    fontFamily: Pretendard
    fontSize: 1.0625rem
    fontWeight: 600
    lineHeight: 1.4
  label:
    fontFamily: Pretendard
    fontSize: 0.9375rem
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 0.004em
  caption:
    fontFamily: Pretendard
    fontSize: 0.8125rem
    fontWeight: 500
    lineHeight: 1.45
    letterSpacing: 0.012em
  number-lg:
    fontFamily: Pretendard
    fontSize: 1.75rem
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: -0.015em
    fontFeature: "'tnum'"
  number:
    fontFamily: Pretendard
    fontSize: 1.25rem
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: -0.005em
    fontFeature: "'tnum'"
  number-sm:
    fontFamily: Pretendard
    fontSize: 0.9375rem
    fontWeight: 600
    lineHeight: 1.4
    fontFeature: "'tnum'"
rounded:
  sm: 4px
  md: 8px
  lg: 12px
  xl: 16px
  2xl: 20px
  3xl: 24px
  full: 9999px
spacing:  # keys equal Tailwind multiples of 4px, so p-4 = 16px everywhere
  "1": 4px
  "2": 8px
  "3": 12px
  "4": 16px
  "5": 20px
  "6": 24px
  "8": 32px
  "10": 40px
  "12": 48px
  "14": 56px
  "16": 64px
  "20": 80px
  "24": 96px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.md}"
    height: 56px
    padding: 0 24px
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.on-primary}"
  button-primary-active:
    backgroundColor: "{colors.primary-active}"
    textColor: "{colors.on-primary}"
  button-md:
    height: 48px
    padding: 0 20px
    typography: "{typography.label-lg}"
    rounded: "{rounded.md}"
  button-sm:
    height: 40px
    padding: 0 16px
    typography: "{typography.label}"
    rounded: "{rounded.md}"
  button-secondary:
    backgroundColor: "{colors.bg-surface}"
    textColor: "{colors.fg-strong}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.md}"
    height: 56px
  button-tertiary:
    backgroundColor: "{colors.bg-muted}"
    textColor: "{colors.fg-strong}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.md}"
  button-ghost:
    backgroundColor: "{colors.bg-canvas}"
    textColor: "{colors.fg-brand}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.md}"
  button-danger:
    backgroundColor: "{colors.danger}"
    textColor: "{colors.on-danger}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.md}"
  button-danger-hover:
    backgroundColor: "{colors.danger-hover}"
    textColor: "{colors.on-danger}"
  button-disabled:
    backgroundColor: "{colors.bg-muted}"
    textColor: "{colors.fg-disabled}"
  icon-button:
    backgroundColor: "{colors.bg-canvas}"
    textColor: "{colors.fg-default}"
    rounded: "{rounded.full}"
    size: 44px
  input:
    backgroundColor: "{colors.bg-surface}"
    textColor: "{colors.fg-strong}"
    typography: "{typography.body-lg}"
    rounded: "{rounded.md}"
    height: 56px
    padding: 0 16px
  input-sm:
    height: 44px
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: 0 12px
  input-placeholder:
    backgroundColor: "{colors.bg-surface}"
    textColor: "{colors.fg-tertiary}"
  input-outline:
    backgroundColor: "{colors.border-strong}"
  field-helper:
    backgroundColor: "{colors.bg-canvas}"
    textColor: "{colors.fg-secondary}"
    typography: "{typography.body-sm}"
  field-error:
    backgroundColor: "{colors.bg-canvas}"
    textColor: "{colors.fg-danger}"
    typography: "{typography.label}"
  checkbox:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.sm}"
    size: 24px
  switch:
    backgroundColor: "{colors.primary}"
    rounded: "{rounded.full}"
    width: 52px
    height: 32px
  switch-off:
    backgroundColor: "{colors.border-strong}"
  chip:
    backgroundColor: "{colors.bg-surface}"
    textColor: "{colors.fg-default}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    height: 44px
    padding: 0 16px
  chip-selected:
    backgroundColor: "{colors.fg-strong}"
    textColor: "{colors.bg-canvas}"
  badge-neutral:
    backgroundColor: "{colors.bg-muted}"
    textColor: "{colors.fg-default}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: 2px 8px
  badge-brand:
    backgroundColor: "{colors.primary-subtle}"
    textColor: "{colors.fg-brand}"
  badge-success:
    backgroundColor: "{colors.success-subtle}"
    textColor: "{colors.fg-success}"
  badge-warning:
    backgroundColor: "{colors.warning-subtle}"
    textColor: "{colors.fg-warning}"
  badge-danger:
    backgroundColor: "{colors.danger-subtle}"
    textColor: "{colors.fg-danger}"
  alert:
    backgroundColor: "{colors.bg-subtle}"
    textColor: "{colors.fg-default}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: 16px
  toast:
    backgroundColor: "{colors.bg-inverse}"
    textColor: "{colors.fg-on-inverse}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: 16px 20px
  toast-action:
    backgroundColor: "{colors.bg-inverse}"
    textColor: "{colors.fg-brand-on-inverse}"
    typography: "{typography.label-lg}"
  tooltip:
    backgroundColor: "{colors.bg-inverse}"
    textColor: "{colors.fg-on-inverse}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: 8px 12px
  card:
    backgroundColor: "{colors.bg-surface}"
    textColor: "{colors.fg-default}"
    rounded: "{rounded.xl}"
    padding: 24px
  list-cell:
    backgroundColor: "{colors.bg-surface}"
    textColor: "{colors.fg-strong}"
    typography: "{typography.headline}"
    padding: 16px
    height: 64px
  dialog:
    backgroundColor: "{colors.bg-elevated}"
    textColor: "{colors.fg-default}"
    rounded: "{rounded.2xl}"
    padding: 24px
    width: 440px
  bottom-sheet:
    backgroundColor: "{colors.bg-elevated}"
    textColor: "{colors.fg-default}"
    rounded: "{rounded.3xl}"
    padding: 24px
  dropdown-menu:
    backgroundColor: "{colors.bg-elevated}"
    textColor: "{colors.fg-default}"
    rounded: "{rounded.lg}"
    padding: 4px
  tabs:
    backgroundColor: "{colors.bg-canvas}"
    textColor: "{colors.fg-secondary}"
    typography: "{typography.label-lg}"
    height: 48px
  tabs-active:
    backgroundColor: "{colors.bg-canvas}"
    textColor: "{colors.fg-strong}"
  segmented:
    backgroundColor: "{colors.bg-muted}"
    textColor: "{colors.fg-secondary}"
    rounded: "{rounded.lg}"
    height: 48px
  segmented-active:
    backgroundColor: "{colors.bg-surface}"
    textColor: "{colors.fg-strong}"
  table-header:
    backgroundColor: "{colors.bg-subtle}"
    textColor: "{colors.fg-secondary}"
    typography: "{typography.label}"
    height: 44px
  table-row:
    backgroundColor: "{colors.bg-surface}"
    textColor: "{colors.fg-default}"
    typography: "{typography.body-sm}"
    height: 52px
  table-row-hover:
    backgroundColor: "{colors.bg-subtle}"
  skeleton:
    backgroundColor: "{colors.bg-muted}"
    rounded: "{rounded.sm}"
  progress:
    backgroundColor: "{colors.primary}"
    rounded: "{rounded.full}"
    height: 8px
  progress-track:
    backgroundColor: "{colors.bg-muted}"
  empty-state:
    backgroundColor: "{colors.bg-canvas}"
    textColor: "{colors.fg-secondary}"
    typography: "{typography.body-md}"
    padding: 48px 24px
  app-bar:
    backgroundColor: "{colors.bg-surface}"
    textColor: "{colors.fg-strong}"
    height: 64px
    padding: 0 24px
  nav-item-active:
    backgroundColor: "{colors.primary-subtle}"
    textColor: "{colors.fg-brand}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
  divider:
    backgroundColor: "{colors.border-subtle}"
  divider-strong:
    backgroundColor: "{colors.border-default}"
  link:
    backgroundColor: "{colors.bg-canvas}"
    textColor: "{colors.fg-brand}"
  page:
    backgroundColor: "{colors.bg-canvas}"
    textColor: "{colors.fg-default}"
    typography: "{typography.body-md}"
  heading:
    backgroundColor: "{colors.bg-canvas}"
    textColor: "{colors.fg-strong}"
    typography: "{typography.title2}"
  evidence-highlight:
    backgroundColor: "{colors.highlight}"
    textColor: "{colors.on-highlight}"
  consent-scope:
    backgroundColor: "{colors.bg-muted}"
    textColor: "{colors.fg-default}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: 12px 16px
  alt-path:
    backgroundColor: "{colors.bg-surface}"
    textColor: "{colors.fg-strong}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.md}"
    height: 56px
  record-row:
    backgroundColor: "{colors.bg-surface}"
    textColor: "{colors.fg-secondary}"
    typography: "{typography.body-sm}"
    padding: 12px 0
  money:
    backgroundColor: "{colors.bg-surface}"
    textColor: "{colors.fg-strong}"
    typography: "{typography.number}"
  focus-ring:
    backgroundColor: "{colors.primary}"
  state-layer:
    backgroundColor: "{colors.state-hover}"
  state-layer-active:
    backgroundColor: "{colors.state-active}"
  overlay:
    backgroundColor: "{colors.scrim}"
  inverse:
    backgroundColor: "{colors.bg-inverse}"
    textColor: "{colors.fg-on-inverse}"
  caption:
    backgroundColor: "{colors.bg-canvas}"
    textColor: "{colors.fg-secondary}"
    typography: "{typography.caption}"
  dark-button-primary:
    backgroundColor: "{colors.dark-primary}"
    textColor: "{colors.dark-on-primary}"
  dark-button-primary-hover:
    backgroundColor: "{colors.dark-primary-hover}"
    textColor: "{colors.dark-on-primary}"
  dark-button-primary-active:
    backgroundColor: "{colors.dark-primary-active}"
    textColor: "{colors.dark-on-primary}"
  dark-button-secondary:
    backgroundColor: "{colors.dark-bg-surface}"
    textColor: "{colors.dark-fg-strong}"
  dark-button-tertiary:
    backgroundColor: "{colors.dark-bg-muted}"
    textColor: "{colors.dark-fg-strong}"
  dark-button-ghost:
    backgroundColor: "{colors.dark-bg-canvas}"
    textColor: "{colors.dark-fg-brand}"
  dark-button-danger:
    backgroundColor: "{colors.dark-danger}"
    textColor: "{colors.dark-on-danger}"
  dark-button-danger-hover:
    backgroundColor: "{colors.dark-danger-hover}"
    textColor: "{colors.dark-on-danger}"
  dark-button-disabled:
    backgroundColor: "{colors.dark-bg-muted}"
    textColor: "{colors.dark-fg-disabled}"
  dark-icon-button:
    backgroundColor: "{colors.dark-bg-canvas}"
    textColor: "{colors.dark-fg-default}"
  dark-input:
    backgroundColor: "{colors.dark-bg-surface}"
    textColor: "{colors.dark-fg-strong}"
  dark-input-placeholder:
    backgroundColor: "{colors.dark-bg-surface}"
    textColor: "{colors.dark-fg-tertiary}"
  dark-input-outline:
    backgroundColor: "{colors.dark-border-strong}"
  dark-field-helper:
    backgroundColor: "{colors.dark-bg-canvas}"
    textColor: "{colors.dark-fg-secondary}"
  dark-field-error:
    backgroundColor: "{colors.dark-bg-canvas}"
    textColor: "{colors.dark-fg-danger}"
  dark-checkbox:
    backgroundColor: "{colors.dark-primary}"
    textColor: "{colors.dark-on-primary}"
  dark-switch:
    backgroundColor: "{colors.dark-primary}"
  dark-switch-off:
    backgroundColor: "{colors.dark-border-strong}"
  dark-chip:
    backgroundColor: "{colors.dark-bg-surface}"
    textColor: "{colors.dark-fg-default}"
  dark-chip-selected:
    backgroundColor: "{colors.dark-fg-strong}"
    textColor: "{colors.dark-bg-canvas}"
  dark-badge-neutral:
    backgroundColor: "{colors.dark-bg-muted}"
    textColor: "{colors.dark-fg-default}"
  dark-badge-brand:
    backgroundColor: "{colors.dark-primary-subtle}"
    textColor: "{colors.dark-fg-brand}"
  dark-badge-success:
    backgroundColor: "{colors.dark-success-subtle}"
    textColor: "{colors.dark-fg-success}"
  dark-badge-warning:
    backgroundColor: "{colors.dark-warning-subtle}"
    textColor: "{colors.dark-fg-warning}"
  dark-badge-danger:
    backgroundColor: "{colors.dark-danger-subtle}"
    textColor: "{colors.dark-fg-danger}"
  dark-alert:
    backgroundColor: "{colors.dark-bg-subtle}"
    textColor: "{colors.dark-fg-default}"
  dark-toast:
    backgroundColor: "{colors.dark-bg-inverse}"
    textColor: "{colors.dark-fg-on-inverse}"
  dark-toast-action:
    backgroundColor: "{colors.dark-bg-inverse}"
    textColor: "{colors.dark-fg-brand-on-inverse}"
  dark-tooltip:
    backgroundColor: "{colors.dark-bg-inverse}"
    textColor: "{colors.dark-fg-on-inverse}"
  dark-card:
    backgroundColor: "{colors.dark-bg-surface}"
    textColor: "{colors.dark-fg-default}"
  dark-list-cell:
    backgroundColor: "{colors.dark-bg-surface}"
    textColor: "{colors.dark-fg-strong}"
  dark-dialog:
    backgroundColor: "{colors.dark-bg-elevated}"
    textColor: "{colors.dark-fg-default}"
  dark-bottom-sheet:
    backgroundColor: "{colors.dark-bg-elevated}"
    textColor: "{colors.dark-fg-default}"
  dark-dropdown-menu:
    backgroundColor: "{colors.dark-bg-elevated}"
    textColor: "{colors.dark-fg-default}"
  dark-tabs:
    backgroundColor: "{colors.dark-bg-canvas}"
    textColor: "{colors.dark-fg-secondary}"
  dark-tabs-active:
    backgroundColor: "{colors.dark-bg-canvas}"
    textColor: "{colors.dark-fg-strong}"
  dark-segmented:
    backgroundColor: "{colors.dark-bg-muted}"
    textColor: "{colors.dark-fg-secondary}"
  dark-segmented-active:
    backgroundColor: "{colors.dark-bg-surface}"
    textColor: "{colors.dark-fg-strong}"
  dark-table-header:
    backgroundColor: "{colors.dark-bg-subtle}"
    textColor: "{colors.dark-fg-secondary}"
  dark-table-row:
    backgroundColor: "{colors.dark-bg-surface}"
    textColor: "{colors.dark-fg-default}"
  dark-table-row-hover:
    backgroundColor: "{colors.dark-bg-subtle}"
  dark-skeleton:
    backgroundColor: "{colors.dark-bg-muted}"
  dark-progress:
    backgroundColor: "{colors.dark-primary}"
  dark-progress-track:
    backgroundColor: "{colors.dark-bg-muted}"
  dark-empty-state:
    backgroundColor: "{colors.dark-bg-canvas}"
    textColor: "{colors.dark-fg-secondary}"
  dark-app-bar:
    backgroundColor: "{colors.dark-bg-surface}"
    textColor: "{colors.dark-fg-strong}"
  dark-nav-item-active:
    backgroundColor: "{colors.dark-primary-subtle}"
    textColor: "{colors.dark-fg-brand}"
  dark-divider:
    backgroundColor: "{colors.dark-border-subtle}"
  dark-divider-strong:
    backgroundColor: "{colors.dark-border-default}"
  dark-link:
    backgroundColor: "{colors.dark-bg-canvas}"
    textColor: "{colors.dark-fg-brand}"
  dark-page:
    backgroundColor: "{colors.dark-bg-canvas}"
    textColor: "{colors.dark-fg-default}"
  dark-heading:
    backgroundColor: "{colors.dark-bg-canvas}"
    textColor: "{colors.dark-fg-strong}"
  dark-evidence-highlight:
    backgroundColor: "{colors.dark-highlight}"
    textColor: "{colors.dark-on-highlight}"
  dark-consent-scope:
    backgroundColor: "{colors.dark-bg-muted}"
    textColor: "{colors.dark-fg-default}"
  dark-alt-path:
    backgroundColor: "{colors.dark-bg-surface}"
    textColor: "{colors.dark-fg-strong}"
  dark-record-row:
    backgroundColor: "{colors.dark-bg-surface}"
    textColor: "{colors.dark-fg-secondary}"
  dark-money:
    backgroundColor: "{colors.dark-bg-surface}"
    textColor: "{colors.dark-fg-strong}"
  dark-focus-ring:
    backgroundColor: "{colors.dark-primary}"
  dark-state-layer:
    backgroundColor: "{colors.dark-state-hover}"
  dark-state-layer-active:
    backgroundColor: "{colors.dark-state-active}"
  dark-overlay:
    backgroundColor: "{colors.dark-scrim}"
  dark-inverse:
    backgroundColor: "{colors.dark-bg-inverse}"
    textColor: "{colors.dark-fg-on-inverse}"
  dark-caption:
    backgroundColor: "{colors.dark-bg-canvas}"
    textColor: "{colors.dark-fg-secondary}"
---

# Evenstay — DESIGN.md

> 상태: 승인(2026-11-03) v2.6(사용자 재승인 2026-11-04). v2.6(2026-11-04, 사용자 "모두 추천대로", 소개 사이트 `handoff.md` U-01·U-07, 검토 G-16): "소개 사이트 예외" 절 추가. 같은 날 `screen-spec.md` LND-01의 히어로 규칙(전환, 지속 시간 띠, 화살표)을 더했다. 앱 화면 규칙은 그대로다. v2.5(사용자 재승인 2026-11-04, 2026-11-04, 사용자 "핵심제안들 적용해줘", 레이아웃 검토 `layout-review-2026-11-04.md`): 화면 틀(Home 5, Family 4, 운영 6 + 입력 창 2), 운영 휴대폰 틀(640px 아래 4단, 아래 고정 행동 줄, 야간·생활지원 아래 탭), `consent-scope` 자리와 둘째 줄, `stat-strip`, Home 터치 56px 변형(탭·구간·칩)과 날짜 고르기, 확인 규칙, 표 줄 행동, 보조 열 내용 세 가지. 토큰 값은 그대로다. v2.4. v2.4(같은 날, 사용자가 검수에서 정의서에 막혔던 화면 6건을 고치기로 함): 목록-상세는 모바일에서도 고른 상세 하나만, `menu-tile` 행 높이 같게와 범위 밖 안내 자리, 읽고 답하는 화면의 행동 줄 붙이기. 토큰 값은 그대로다. v2.3. v2.3(같은 날, 사용자 결정 A안 → 대표 화면 2개 검수 → 25화면 진행 승인): Home·Family를 1024px 이상에서 본문 열 + 보조 열 2단으로 배치한다(사용자 결정 A안). 토큰 값은 그대로이고, Layout에 데스크톱 절, Components에 `menu-tile`·`side-rail`·`list-detail`을 더했다. v2.2. 다크 모드 포함. v2.2(같은 날, 프로토타입 4묶음 검수): 토큰 값은 바꾸지 않고, 검수에서 드러난 문서 안의 어긋남과 빠진 규칙을 채웠다(사이드바 접는 기준점 하나로, 최대 폭의 뜻, Home 제목 단계, 13px 캡션을 쓰는 곳, 반전 바탕 위 포커스, 알림 등급 배지, 화면 안 보조 패널, 표의 모바일 규칙, 앱 밖 경로와 버튼 사이 간격, 범위 밖 정보 문구). v2.1(같은 날, 사용자 지시 "모두 반영"): emil-design-eng·web-design-engineer 점검을 반영해 hover를 마우스 기기로 한정하고, 움직임 줄이기 규칙, 스피너의 움직임 줄이기 대안, 드롭다운과 토스트의 등장 모션을 정했다. v1(같은 날)의 3안 토큰을 그대로 앵커로 두고, 원티드 몽타주 design.md(사용자 제공 `~/Downloads/wanted.md`, 2026-10-27 갱신본)의 구성 수준에 맞춰 원자 램프, 다크 모드, 글자 단계, 컴포넌트 명세, 반응형, 알려진 공백, 출처를 보완했다. 원티드의 값과 브랜드는 가져오지 않았고 문서 구조와 검증 방식만 참고했다.

## Overview

Evenstay는 **"함께 보는 기록"**이다. 회원님, 보호자, 직원이 같은 사실을 같은 때에 보고, 숫자에는 언제나 이유가 붙는다. 화면은 차분하고 정확하다. 장식으로 마음을 끌지 않고, 근거를 보여 줘서 믿음을 얻는다.

- **제품:** Evenstay(운영, 직원), Evenstay 홈(회원 앱), Evenstay 패밀리(보호자 화면). [지원 회사] 이름과 표지는 쓰지 않는다.
- **목소리:** 차분하다, 존중한다, 근거를 보인다(`docs/core/copy/product-marketing.md`).
- **UI 구현:** 컴포넌트는 shadcn/ui, 스타일은 Tailwind CSS v4, 아이콘은 Lucide다(`CLAUDE.md` 디자인 작업 규칙). 이 파일의 토큰이 `design/system/globals.css`를 거쳐 Tailwind 테마와 shadcn 변수가 된다(Exports 절). 다른 UI 라이브러리, 아이콘 세트, 이모지는 쓰지 않는다.
- **원칙 세 가지:**
  1. **같은 사실, 다른 밀도.** 세 화면은 색, 모양, 컴포넌트를 공유하고 글자 크기와 컨트롤 높이만 다르다(아래 밀도 표).
  2. **근거가 강조다.** 강조색은 행동(코발트)과 근거(노란 밑줄) 두 곳에만 쓴다. 상태, 장식, 감정에는 쓰지 않는다.
  3. **사람이 정한다.** 판단, 점수, 등급을 화면이 만들지 않는다. 관찰된 사실과 누가 언제 무엇을 했는지만 보인다.
- **로고:** 겹친 두 둥근 사각형(먹 선과 코발트 선, 겹친 칸은 노랑)과 소문자 워드마크 "evenstay". 겹친 부분이 같이 보는 기록이다. 확정 파일과 규칙은 `design/brand/logo/`(README.md, index.html), 시안 원본은 `design/brand/concepts.html` 3안.

### 세 밀도
| 화면 | 이용자 | 본문 | 라벨 | 버튼·입력 높이 | 최소 터치 | 한 화면의 행동 |
|---|---|---|---|---|---|---|
| Home | 70~80대 회원 | `body-lg` 20px | `label-lg` 17px | 56px | 56px | 채운 버튼 1개 + 앱 밖 경로 1개 |
| Family | 보호자 자녀 | `body-md` 17px | `label-lg` 17px | 56px(주), 48px(보조) | 48px | 채운 버튼 1개 |
| 운영 | 운영사 직원 | `body-sm` 15px | `label` 15px | 40px(`button-sm`), 44px 입력 | 44px | 화면당 채운 버튼 1개, 표 안에는 텍스트 버튼 |

Home에서는 `body-sm`, `label`, `caption`을 쓰지 않는다. 가장 작은 글자가 17px이다. Home에서는 `heading2`(20px)가 본문 `body-lg`(20px)와 크기가 같아 제목 구실을 못 하므로 쓰지 않고, 카드·섹션 제목은 `heading1`(22px)을 쓴다.

## Colors

밝은 종이 바탕, 먹색 글자, 코발트 하나, 근거를 표시하는 노랑 하나. 두 층으로 운영한다.

1. **원자 램프(atomic):** 아래 7개 램프. 화면 코드에서 직접 부르지 않고, 새 의미 색을 정의할 때만 쓴다.
2. **의미 색(semantic):** 위 YAML `colors`. 화면과 컴포넌트는 이것만 부른다. 다크 모드는 같은 이름에 `dark-`를 붙인 값이고, 앱에서는 `.dark` 클래스로 바뀐다.

### 원자 램프
OKLCH에서 앵커 색(굵게 표시한 단계)의 색상(hue)을 유지하고 밝기를 고르게 나눈 뒤 sRGB로 옮겼다. 중성색은 두 갈래다. **paper**(따뜻한 흰색 계열)는 바탕과 구분선, **ink**(차가운 회색 계열)는 글자와 컨트롤 테두리를 맡는다.

| 램프 | 단계 |
|---|---|
| cobalt | 50 `#F4F7FE` · 100 `#E8EDF8` · 200 `#D2DBEF` · 300 `#B2C1E3` · 400 `#8BA1D4` · 500 `#6681C3` · 600 `#4664B3` · **700 `#2340A0`** · 800 `#183083` · 900 `#0C1D60` · 950 `#040D43` |
| ink | 50 `#F6F7F8` · 100 `#ECEDEE` · 200 `#D9DBDD` · 300 `#BFC1C4` · 400 `#9FA2A6` · 500 `#808488` · 600 `#65696F` · **700 `#555A60`** · 800 `#373B3F` · 900 `#24272A` · **950 `#17191C`** |
| paper | 0 `#FEFEFC` · **25 `#FAFAF7`** · 50 `#F4F4F0` · 100 `#EEEFEA` · 200 `#E3E4DF` · 300 `#D2D4CE` |
| yellow | 50 `#FFF7D9` · 100 `#FFEDA8` · **200 `#F3D766`** · 300 `#D8C060` · 400 `#B4A158` · 500 `#90834F` · 600 `#726946` · 700 `#55503C` · 800 `#3D3B33` · 900 `#28261F` · 950 `#18160F` |
| red | 50 `#FEF4F2` · 100 `#FEE7E3` · 200 `#FFCDC5` · 300 `#F4ACA1` · 400 `#E18476` · 500 `#CD5B4C` · **600 `#B42318`** · 700 `#94170E` · 800 `#710A05` · 900 `#4F0100` · 950 `#320000` |
| green | 50 `#EBFCEF` · 100 `#DEF3E3` · 200 `#C6E3CE` · 300 `#A5CCB0` · 400 `#7BB08B` · 500 `#509467` · **600 `#1E7A46`** · 700 `#125F34` · 800 `#064725` · 900 `#003016` · 950 `#001C0A` |
| amber | 50 `#FEF5EC` · 100 `#FEE9D5` · 200 `#F1D5BB` · 300 `#DEB997` · 400 `#C6976A` · 500 `#AD753A` · **600 `#9A5B00`** · 700 `#724303` · 800 `#563000` · 900 `#3A1F00` · 950 `#231100` |

### 의미 색의 역할
- **바탕:** `bg-canvas`(페이지) → `bg-surface`(카드, 입력) → `bg-subtle`(표 머리, 알림) → `bg-muted`(배지, 비활성, 트랙). `bg-elevated`는 대화상자와 메뉴, `bg-inverse`는 토스트와 툴팁이다. 반전 바탕 위 글자는 `fg-on-inverse`, 반전 바탕 위 행동은 `fg-brand-on-inverse`다.
- **글자:** `fg-strong`(제목, 금액) → `fg-default`(본문) → `fg-secondary`(라벨, 캡션) → `fg-tertiary`(자리표시 글자). 비활성 글자 `fg-disabled`는 `fg-tertiary`와 같은 값이라 읽을 수 있다(4.8:1 이상). 회원이 왜 누를 수 없는지 읽어야 하기 때문이다.
- **테두리 세 단계:** `border-subtle`(카드 경계, 구분선) → `border-default`(강한 구분선, 표 머리 아래) → `border-strong`(입력칸, 보조 버튼, 체크박스. 바탕 대비 6.6:1). 앞의 두 단계는 1.4:1이라 **누를 수 있는 것의 경계로 쓰지 않는다.**
- **행동:** `primary`(코발트)와 `primary-hover`, `primary-active`. `primary-subtle`과 `fg-brand`는 선택된 내비게이션 항목과 브랜드 배지에 쓴다.
- **근거:** `highlight`는 숫자와 그 이유 뒤에 까는 밑줄이다. 글자는 언제나 `on-highlight`(12.4:1)이고 다크 모드에서도 같은 값을 쓴다. 한 화면에 한 곳만 쓴다.
- **시스템 피드백:** `danger`, `fg-success`, `fg-warning`과 각 `-subtle` 바탕. **저장됨, 보내지 못함, 입력 오류처럼 시스템이 한 일의 결과에만 쓴다.** 입주자의 건강, 생활, 단계, 계약 상태를 빨강, 초록, 주황으로 칠하지 않는다. 그런 상태는 중립 배지와 글자로 쓴다.
- **상호작용 층:** `state-hover`(먹 6%), `state-active`(먹 12%)를 중립 표면(보조 버튼, 표 행, 메뉴 항목, 아이콘 버튼) 위에 덮는다. 채운 버튼은 `-hover`/`-active` 색 단계를 쓴다.
- **가림막:** `scrim`(먹 50%, 다크 검정 65%)은 대화상자와 시트 뒤에만 쓴다.

### 대비 (WCAG 2.2, 2026-11-03 계산)
모든 컴포넌트의 글자·바탕 쌍은 라이트와 다크 모두 `npx @google/design.md lint`로 4.5:1 이상을 확인했다. 주요 값은 다음과 같다.

| 쌍 | 라이트 | 다크 |
|---|---|---|
| fg-strong / bg-canvas | 16.8 | 16.9 |
| fg-default / bg-canvas | 14.4 | 14.5 |
| fg-secondary / bg-canvas | 6.7 | 8.7 |
| fg-tertiary / bg-muted | 4.8 | 4.8 |
| on-primary / primary | 8.6 | 7.4 |
| primary / bg-canvas (링크, 포커스 링) | 8.7 | 7.8 |
| border-strong / bg-canvas (컨트롤 경계) | 6.7 | 6.2 |
| on-highlight / highlight | 12.4 | 12.4 |
| fg-danger / danger-subtle | 6.1 | 6.7 |
| fg-success / success-subtle | 5.0 | 7.4 |
| fg-warning / warning-subtle | 5.0 | 7.6 |

Home 화면의 본문(`fg-default`, `fg-strong`)은 AAA(7:1) 이상이다.

## Typography

글꼴은 **Pretendard 하나**다. 파일은 `design/fonts/pretendard/PretendardVariable.woff2`(v1.3.9, SIL OFL 1.1, https://cactus.tistory.com/306 이 안내하는 공식 GitHub 릴리스)이고 CDN을 쓰지 않는다. 가변 굵기 45~920 중 **400, 500, 600, 700** 네 단계만 쓴다.

### 단계 (18개)
| 무리 | 이름 | 크기/굵기/줄간격 | 자간 | 쓰는 곳 |
|---|---|---|---|---|
| Display | `display1`, `display2` | 48/700/1.25, 40/700/1.3 | -2.5%, -2.2% | 소개 페이지, 슬라이드 표지 |
| Title | `title1`~`title3` | 32/700/1.35, 28/700/1.36, 24/700/1.4 | -2.0% ~ -1.5% | 화면 제목. Home 첫 인사는 `title3` |
| Heading | `heading1`, `heading2` | 22/700/1.45, 20/600/1.45 | -1.2%, -1.0% | 카드·섹션 제목 |
| Headline | `headline` | 18/600/1.5 | -0.4% | 목록 행 제목, 운영 화면 섹션 제목 |
| Body | `body-lg`, `body-md`, `body-md-read`, `body-sm` | 20/400/1.6, 17/400/1.6, 17/400/1.75, 15/400/1.55 | 0 ~ +0.6% | 본문. `-read`는 안내문과 동의서처럼 긴 글 |
| Label | `label-lg`, `label` | 17/600/1.4, 15/600/1.4 | 0, +0.4% | 버튼, 입력 라벨, 탭, 배지 |
| Caption | `caption` | 13/500/1.45 | +1.2% | 운영 화면의 브레드크럼, 사이드바 묶음 이름, 데모 안내만. 입력 도움말과 결과를 바꾸는 설명은 `body-sm`(15px) |
| Number | `number-lg`, `number`, `number-sm` | 28/700, 20/700, 15/600, 고정폭 숫자 | -1.5% ~ 0 | 금액, 날짜, 호실, 건수 |

- 18px 이상은 음수 자간, 17px 이하는 0 또는 양수 자간이다. 큰 한글 제목은 조이고, 작은 글자는 숨을 준다.
- 금액은 언제나 원 단위까지 쓰고 `number` 계열(`font-variant-numeric: tabular-nums`)로 세로 정렬한다. 표의 숫자 열은 오른쪽 정렬이다.
- 대문자 자간 라벨, 작은 대문자, 모노 글꼴 라벨, 기울임은 쓰지 않는다.
- 한글 줄바꿈은 `word-break: keep-all`(낱말 단위), 제목은 `text-wrap: balance`, 본문은 `text-wrap: pretty`.
- 본문 한 줄은 한글 기준 최대 40자(약 `max-width: 36em`)다.
- Tailwind 기본 크기도 함께 올린다: `text-xs` 13px, `text-sm` 15px, `text-base` 17px, `text-lg` 20px(`globals.css`). shadcn 컴포넌트가 기본으로 쓰는 `text-sm`이 14px보다 작아지지 않게 하기 위해서다.

## Layout

간격은 4px 단위이고, 키를 **Tailwind 배수와 같은 숫자**로 지었다(`"4"` = 16px = `p-4`). 2px 보정은 Tailwind 기본 `0.5`를 쓴다(내보내기가 점이 든 이름을 받지 않는다). 이름형 키(`lg`, `xl`)를 쓰면 Tailwind v4에서 `max-w-lg` 같은 크기 클래스까지 덮어써 shadcn 대화상자 폭이 16px이 되는 문제를 2026-11-03에 컴파일로 확인했다.

| 용도 | 값 |
|---|---|
| 아이콘과 글자 사이 | `2`(8px) |
| 라벨과 입력, 목록 행 안 | `2`~`3`(8~12px) |
| 카드 안 여백 | `6`(24px). Home 카드는 `6`, 운영 표 셀은 `3`×`4`(12×16px) |
| 카드 사이, 폼 묶음 사이 | `4`~`6`(16~24px) |
| 섹션 사이 | `12`~`16`(48~64px) |
| 소개 페이지 섹션 사이 | `20`~`24`(80~96px) |

### 너비와 그리드
| 화면 | 최대 콘텐츠 폭 | 그리드 | 바깥 여백 |
|---|---|---|---|
| Home | 1024px 아래: 560px(글자가 놓이는 폭. 바깥 여백은 따로), 한 열. 1024px 이상: 바깥 틀 1120px | 1단 / 본문 + 보조 열 2단 | 모바일 16px, 그 이상 24px, 1024px 이상 32px |
| Family | 1024px 아래: 720px(글자가 놓이는 폭). 1024px 이상: 바깥 틀 1120px | 1~2단 / 본문 + 보조 열 2단 | 16 / 24 / 32px |
| 운영 | 1280px(사이드바 포함 바깥 틀. 1280px보다 넓으면 가운데 두고 여백만 늘린다) | 12단, 사이 24px. 640px 아래 직원 휴대폰은 4단 한 열(아래 "운영 휴대폰") | 640px 아래 16px, 24 / 32px |
| 소개·포트폴리오 | 1120px | 12단, 사이 24px | 24 / 64px |

### 반응형 기준점
Tailwind 기본값을 그대로 쓴다. 새 기준점을 만들지 않는다.

| 이름 | 최소 폭 | 바뀌는 것 |
|---|---|---|
| (기본) | 0 | Home·Family 한 열, 운영 표는 가로 스크롤 영역 안에 |
| `sm` | 640px | Family 2단 카드 |
| `md` | 768px | 운영 화면 상단 바에 내비게이션 노출 |
| `lg` | 1024px | 표 전체 폭. Home·Family는 본문 + 보조 열 2단(아래 "Home·Family 데스크톱"). 운영 사이드바는 이 기준점이 아니라 아래 60rem을 따른다 |
| `xl` | 1280px | 운영 화면 최대 폭 도달, 여백만 늘어남 |

- 이동할 곳이 7개 이하면 상단 바, 넘으면 사이드바다. 60rem(960px) 아래에서 사이드바는 메뉴 버튼과 시트로 접는다. 사이드바를 접는 기준점은 이 60rem 하나다.
- 앱 바 안쪽(로고와 오른쪽 버튼)은 넓은 화면에서 콘텐츠 틀의 양끝에 맞춘다(1024px 아래 Home 560px·Family 720px, 1024px 이상 1120px).
- Home은 하단 탭을 쓰지 않는다(Family도 같고, 운영 휴대폰의 야간·생활지원 역할만 예외다. 아래 "운영 휴대폰"). 첫 화면 목록에서 들어가고, 모든 화면 위쪽에 "처음으로" 버튼이 있다. 첫 화면에서는 같은 자리에 같은 글자로 두되 링크가 아니라 "지금 여기" 표시다(`fg-secondary`, `aria-current="page"`, 누름 반응 없음).

### Home·Family 데스크톱 (1024px 이상)
1024px 아래는 한 열 그대로다. 1024px 이상에서는 한 줄을 길게 늘이지 않고, 늘어난 폭에 정보를 나눠 담는다.

| 항목 | 값 |
|---|---|
| 바깥 틀 | 최대 1120px, 가운데, 좌우 32px |
| 열 | 본문 `minmax(0, 1fr)` + 보조 열 320px, 사이 48px |
| 본문 글 한 줄 | 36em 그대로(Home 20px → 720px, Family 17px → 612px) |
| 보조 열 | `side-rail`. 앱 바 아래에 붙어 따라온다(`position: sticky`, 위 88px) |
| 화면 유형 | 네 가지: 타일(첫 화면, 고르는 화면), 목록-상세(`list-detail`), 본문 2단(한 카드 안의 요약과 내역을 나란히), 한 열 + 보조 열(읽고 답하는 화면). 화면마다의 유형은 `design/mvp-screens.md` 4-7절 |

- **화면 제목만 한 단계 올린다:** 1024px 이상 Home·Family의 화면 제목(h1)은 `title3`(24px) 대신 `title2`(28px)다. 타일 제목(22px)과 인사가 같은 무게로 보이지 않게 하기 위해서다. 예외: 청구서 화면(`card bill`이 있는 화면)은 금액(`number-lg` 28px)이 입구이므로 제목을 `title3`(24px)에 둔다.
- **바뀌지 않는 것:** 화면 제목을 뺀 글자 크기, 버튼·입력 높이, 터치 최소값(Home 56px, Family 48px), 화면당 채운 버튼 1개, 근거 밑줄 한 곳, 하단 탭 없음, "처음으로"의 자리.
- **읽고 답하는 화면의 행동 줄은 본문 열 바닥에 붙는다:** 1024px 이상에서 글이 첫 화면보다 긴 "한 열 + 보조 열" 화면(FAM-05)은 채운 버튼 줄을 `position: sticky; bottom: 0`으로 본문 열 아래에 붙인다. 바탕은 위쪽 24px 동안 투명에서 `bg-canvas`로 차오르는 그라디언트(글이 아래로 이어진다는 표시, 선을 그으면 글의 끝처럼 보인다), 위 32px·아래 16px, 버튼은 한 줄에 나란히. 앱 밖 경로(보조 열)보다 주 행동이 먼저 보이게 하기 위해서다.
- **보조 열에는 채운 버튼을 두지 않는다.** Home 보조 열의 행동은 앱 밖 경로(`alt-path`) 하나뿐이다. 세 밀도 표의 "채운 버튼 1개 + 앱 밖 경로 1개"에서 그 1개가 옆으로 옮겨 간 것이고, 긴 화면에서도 늘 보인다.
- Family 보조 열의 내용은 화면 틀마다 다르다(첫 화면, 읽기·쓰기, 목록-상세 세 가지. Components `side-rail`).
- 640~1023px(태블릿)은 한 열이고, 타일만 2열이다. 640px 아래 타일은 지금의 목록 행(`list-cell`)으로 돌아간다. 640px은 타일 쪽에 속한다(모바일 규칙은 639.98px까지).
- **본문 2단 카드**(요약과 내역)와 나란히 놓는 두 덩어리(`pair`)는 본문 열이 740px 이상일 때만 나란히 놓고(컨테이너 쿼리), 그보다 좁으면(1024~약 1170px 포함) 쌓는다. 본문 열 최대가 752px이므로 740px은 그 아래여야 한다. 700px 바로 위에서는 내역 띠가 좁아 줄이 꺾였다. 나란히 놓을 때 내역 띠는 카드 오른쪽 끝까지 닿는 면이고, 카드 안에 떠 있는 상자로 만들지 않는다(카드 안 카드 금지).
- **전화기 아이콘은 앱 밖 경로 전용이다.** Home·Family에서 전화기 모양(Lucide `phone`)은 프런트로 전화하는 버튼에만 쓴다. 사람 목록으로 가는 메뉴("급할 때 연락할 분")는 `contact-round`를 쓴다.
- 앱 바 오른쪽 글자 버튼은 버튼 상자가 아니라 글자 끝을 틀 오른쪽 끝에 맞춘다(640px 이상 `margin-inline-end: -20px`, 360~639px -12px, 360px 아래는 0). 앱 바 로고 높이는 세 앱이 같다(640px 이상 28px, 아래 24px). 회원 앱만 키우면 워드마크가 화면 제목과 같은 무게가 된다.
- 정보 위에 두는 `consent-scope`는 보조 열로 옮기지 않는다. 보는 정보 바로 위에 있어야 하기 때문이다.

### 운영 휴대폰 (640px 아래)
야간 직원, 생활지원, 현장 팀이 복도와 방에서 한 손으로 쓰는 화면만 이 틀을 쓴다: SAF-01~04, SAF-12~14, SAF-16, SAF-17, REQ-13, CMN-18, TRN-03(`design/mvp-screens.md` 4-9절). 사무실 화면(코어, 보호자 포털, 설정, 기록)은 데스크톱 전제이고 640px 아래에서는 표 접기 규칙만 따른다.
- **4단, 바깥 16px, 내용 한 열.** 데스크톱 카드를 그대로 쌓지 않는다. 카드 안 상세(중복 수신 내역 등)는 접어 두고 줄을 고르면 연다.
- **아래 고정 행동 줄.** 화면의 채운 버튼 하나만 `position: sticky; bottom: 0`, `padding-bottom: env(safe-area-inset-bottom)`에 둔다. 카드마다 채운 버튼을 두지 않고, 줄을 고르면 아래 줄에 그 줄의 행동([확인하러 갑니다], [완료], [저장])이 나온다.
- **야간 밀도.** 버튼 `md` 48px, 줄 64px, 터치 44px 이상. 새 값이 아니라 기존 토큰이다. 다크 모드로 한 번 더 확인한다.
- **상세는 `bottom-sheet`.** 1024px 이상의 옆 패널(`side-panel`)이 휴대폰에서는 아래에서 올라오는 시트가 된다(손잡이, 끌어 닫기, 닫기 버튼 둘 다).
- **체크 목록 줄.** 안부 방문, 비상 때 재실 명단, 출석은 줄 전체가 누르는 영역이고, 결과는 시트에서 고른다. 줄마다 라디오 셋을 두지 않는다.
- **`nav-bottom`.** 야간 직원·생활지원 역할만, 4칸(신호 / 안부 방문 / 비상 명단 / 더 보기). 다른 역할은 메뉴 버튼과 시트다. 가장자리 서랍은 쓰지 않는다(iOS 뒤로 가기 몸짓과 겹친다).
- 전화는 한 번 누름(`tel:`)이고, 1024px 이상에서는 번호를 글자로 함께 보인다.

### 터치 영역
| 화면 | 최소 | 근거 |
|---|---|---|
| Home | 56×56px | 70~80대 손 떨림과 시력 [가설: 내부 원칙. WCAG 2.5.5 AAA 44px보다 크게] |
| Family | 48×48px | |
| 운영 | 44×44px | WCAG 2.5.8(AA) 24px 이상, 2.5.5(AAA) 44px |

40px 버튼(`button-sm`)과 작은 체크박스는 투명 히트 영역(`::after { inset: -4px }`)으로 44px을 채운다.

## Elevation & Depth

평면이 기본이다. 깊이는 바탕 단계(`bg-canvas` → `bg-surface` → `bg-elevated`)와 1px 구분선으로 만든다. 카드에는 그림자를 쓰지 않는다. 그림자는 화면 위에 떠야 하는 것에만 쓰고, 두 겹(넓게 퍼지는 주변광 + 아래로 떨어지는 직사광)을 쌓는다. 그림자 색은 먹(`#17191C`)에 투명도만 바꾼다.

```css
--shadow-1: 0 1px 2px #17191C0F, 0 1px 3px #17191C0A;   /* 스위치 손잡이, 선택된 세그먼트 */
--shadow-2: 0 4px 12px #17191C14, 0 1px 3px #17191C0F;   /* 드롭다운, 툴팁, 토스트 */
--shadow-3: 0 12px 32px #17191C1F, 0 4px 8px #17191C0F;  /* 대화상자, 시트 */
```
다크 모드에서는 그림자가 잘 보이지 않으므로 `bg-elevated`의 밝기 차이와 1px `dark-border-default`로 띄운다.

### Motion
방금 설치한 `emil-design-eng` 스킬의 기준을 따른다(`.claude/skills/emil-design-eng/SKILL.md`, emilkowalski/skills f1090be).

```css
--ease-out: cubic-bezier(0.23, 1, 0.32, 1);     /* 들어오고 반응하는 모든 것 */
--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1); /* 화면 안에서 위치를 옮기는 것 */
--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);  /* 시트, 서랍 */
--duration-press: 120ms;   /* 버튼 누름 */
--duration-fast: 160ms;    /* 색, 툴팁 */
--duration-base: 200ms;    /* 드롭다운, 토스트 */
--duration-slow: 280ms;    /* 대화상자, 시트 */
```
- UI 모션은 300ms를 넘지 않는다. `ease-in`은 쓰지 않는다.
- 누름: `transform: scale(0.97)`. 나타남: `opacity 0 → 1`과 `scale(0.95) → 1`(0에서 시작하지 않는다).
- `transform`과 `opacity`만 움직인다. `transition: all`, 너비·높이·위치 애니메이션은 쓰지 않는다.
- 키보드로 한 행동, 자주 반복하는 행동(표 정렬, 탭 전환)에는 모션을 넣지 않는다.
- hover 효과는 `@media (hover: hover) and (pointer: fine)` 안에만 둔다. 터치 기기에서 누른 뒤 hover 색이 남아 "아직 눌린 상태"로 보이지 않게 하기 위해서다. 누름(`:active`)과 포커스는 모든 기기에 둔다.
- `prefers-reduced-motion: reduce`에서는 이동(`transform`의 이동·크기·회전, 시트 미끄러짐)을 모두 끄고, 투명도와 색 전환은 `duration-fast`(160ms)로 남긴다. 바뀐 것을 알아채게 돕는 페이드까지 없애지 않는다. 정보는 모션 없이도 전달된다.
- 연달아 생길 수 있는 것(토스트, 상태 전환)은 keyframes가 아니라 CSS transition으로 움직여 중간에 끊겨도 자연스럽게 이어지게 한다. 처음 나타남은 `@starting-style`로 만든다.
- 튕김, 시차, 페이지 슬라이드, 자동 재생은 쓰지 않는다. 소개 사이트의 영상은 "소개 사이트 예외" 절을 따른다.

## Shapes

- 모서리는 크기가 클수록 커진다: `sm` 4px(배지, 체크박스, 스켈레톤) → `md` 8px(버튼, 입력, 메뉴 항목) → `lg` 12px(알림, 토스트, 메뉴, 세그먼트) → `xl` 16px(카드) → `2xl` 20px(대화상자) → `3xl` 24px(시트 위쪽) → `full`(칩, 스위치, 아바타, 아이콘 버튼).
- 안쪽 모서리 = 바깥 모서리 - 안쪽 여백. 카드(16px) 안에 꽉 찬 요소를 둘 때는 8px 이하로 줄인다.
- 카드 안에 카드를 넣지 않는다. 카드 안의 묶음은 구분선이나 `bg-subtle` 띠로 나눈다.
- 구분선은 1px. 섹션을 크게 나눌 때만 8px `bg-subtle` 띠를 쓴다.
- 장식용 2px 테두리, 색 있는 왼쪽 띠 카드, 그라디언트, 유리 효과, 질감은 쓰지 않는다.

**아이콘:** Lucide(https://lucide.dev), 선 굵기 2px(Home 2.25px), 크기 16/20/24px, 색은 `currentColor`를 물려받는다. Home에서는 아이콘만 있는 버튼을 쓰지 않고 언제나 글자를 함께 둔다. 운영 화면의 아이콘 버튼은 `aria-label`과 툴팁을 함께 둔다. 이모지와 유니코드 화살표는 쓰지 않는다.

**일러스트:** 빈 상태와 첫 사용 안내에만, 평면·기하 형태, cobalt와 paper 램프 안에서 `gpt-image`로 만든다. 사람 얼굴, 노화를 과장한 모습, 의료 장면은 그리지 않는다. 소개 사이트는 "소개 사이트 예외" 절을 따른다.

## Components

shadcn/ui 컴포넌트를 쓰고 위 토큰으로 칠한다. YAML `components`의 값이 기준이고, 아래는 해부도, 상태, 쓰는 규칙이다. 모든 컨트롤은 **8가지 상태**(기본, hover, focus-visible, active, disabled, loading, error, success)를, 데이터를 읽는 영역은 **4가지 상태**(loading, empty, error, full)를 그린다. 포커스는 모든 컴포넌트에서 같다: `primary` 2px 선 + 2px 띄움, 바로 나타난다. 반전 바탕(`bg-inverse`: 토스트, 데모 막대) 위에서는 선 색만 `fg-brand-on-inverse`로 바꾼다(`primary`는 반전 바탕 대비 2:1이라 보이지 않는다). 반전 바탕 위 입력칸 경계는 `fg-tertiary`(3.2:1)다.

### 화면 틀
화면은 아래 틀 중 하나로 만든다. 같은 틀의 화면은 같은 골격(영역 순서, 행동 자리)을 쓰고 내용과 상태만 다르다. 상태만 다른 화면은 한 아트보드의 상태로 그린다(`design/mvp-screens.md` 6-2절). 화면마다의 틀은 `design/mvp-screens.md` 4-7절(Home·Family)과 4-9절(운영).

| 앱 | 틀 | 골격 |
|---|---|---|
| Home | 메뉴 타일 | 인사 → `menu-tile` 2~3열(모바일은 `list-cell`) → `alt-path`. 첫 화면 타일은 6개까지 |
| Home | 단계 입력 | "n/m 단계" → 질문 하나 → 입력 하나 → 예 문구 → [다음으로]. 한 화면 한 칸, 2단으로 늘이지 않는다 |
| Home | 확인 카드 | 요약 → 채운 버튼 + 같은 크기 테두리 버튼. 단계 입력의 끝, 읽을 요약이 세 줄 이상일 때 |
| Home | 안내 확인 | 제목 → 본문(36em) → 1024px 이상에서 본문 열 바닥에 붙는 행동 줄([읽었어요]·[알겠어요] 채움) |
| Home·Family | 목록-상세 | `list-detail`. 1024px 이상 보조 열 없음, 앱 밖 경로는 목록 열 아래(Home) 또는 상세 열 아래(Family) |
| Family | 첫 화면 | 허락 문장(h1) → 새 소식 줄(부재 카드만) → 허락 항목 타일 → 볼 수 없는 것 → 내가 볼 수 있는 것 한 줄. 보조 열에 레지던스 공지 |
| Family | 읽기 | 뒤로 → `consent-scope` → h1 → 카드 → (행동). 보조 열에 볼 수 있는 것 목록 |
| Family | 쓰기 | 뒤로 → `consent-scope` → 안내 → 입력 → 채운 버튼 하나. 1024px 이상 입력이 첫 화면보다 길면 행동 줄을 본문 열 바닥에 붙인다 |
| 운영 | 처리 큐 | 위 `stat-strip` → 거름(`segmented`·`chip`) → 줄 목록 → 고른 줄의 상세(`side-panel`, 휴대폰은 `bottom-sheet`). 맡기·시작·완료는 상세의 채운 버튼 하나 |
| 운영 | 체크 목록 | 대상 줄 목록 → 줄마다 한 가지 기록(시트에서 고름) → 아래 고정 [저장] |
| 운영 | 표 + 옆 패널 | `table`(첫 열은 사람·사업장 이름) → 고른 행의 `side-panel`(1024px 아래는 시트) |
| 운영 | 기록·로그 | 거름(기간·사람·종류) → 시간 순 `table` 또는 `record-row`(첫 열 날짜와 시각) → 줄을 열면 `side-panel`. 고치거나 지울 수 없다는 문장 |
| 운영 | 설정 폼 | 묶음 제목 → 칸 → 새 버전 안내 → [저장] 하나 |
| 운영 | 현황 카드 | 확인할 일 목록(입구) → `stat-strip` 4칸 → 지표 칸. 첫 화면 숫자 10개 이하, 화면 기준 시각 하나 |
| 모든 앱 | 짧은 창 | 칸 4개 이하, `dialog` 440px |
| 모든 앱 | 긴 입력 | 칸 5개 이상, 오른쪽 시트 480px(운영) 또는 한 화면 폼(Home·Family). 휴대폰은 전체 화면 |

### Actions
**button.** 변형 5개 × 크기 3개.

| 변형 | 바탕 / 글자 / 테두리 | 쓰는 곳 |
|---|---|---|
| `primary` | primary / on-primary / 없음 | 화면의 한 가지 행동 |
| `secondary` | bg-surface / fg-strong / 2px border-strong | 앱 밖 경로("프런트에 전화하기"), 취소, 나중에 |
| `tertiary` | bg-muted / fg-strong / 없음 | 같은 화면의 덜 중요한 행동(운영) |
| `ghost` | 투명 / fg-brand / 없음 | 표 안 행동, "더 보기" |
| `danger` | danger / on-danger / 없음 | 되돌릴 수 없는 행동만(동의 철회, 계약 해지 확정). 누르기 전 확인 대화상자 |

| 크기 | 높이 | 좌우 여백 | 글자 | 쓰는 화면 |
|---|---|---|---|---|
| `lg`(기본) | 56px | 24px | `label-lg` | Home, Family |
| `md` | 48px | 20px | `label-lg` | Family 보조, 운영 대화상자 |
| `sm` | 40px(히트 44px) | 16px | `label` | 운영 |

- 상태: hover는 `-hover` 색(중립 변형은 `state-hover` 층), active는 `-active` 색 + `scale(0.97)`, disabled는 `bg-muted` + `fg-disabled` + 아래에 이유 한 문장, loading은 회전 아이콘 + 글자 바꿈("보내는 중") + `aria-busy`, 폭 고정.
- 라벨은 동사로 끝낸다("청구서 보기", "보내기", "동의 철회하기"). "확인", "여기를 누르세요"는 쓰지 않는다. 라벨 끝에 마침표를 찍지 않는다.
- Home·Family 모바일에서는 버튼이 전체 폭이다.
- **확인 규칙.** 앞 화면이 내용을 다 보여 줬으면 확인 창(`dialog`), 단계 입력의 끝이거나 읽을 요약이 세 줄 이상이면 확인 카드(화면). 되돌릴 수 없거나 새로 시작하는 결정(신청, 전달, 확정, 발행)은 채운 버튼 + 같은 크기 테두리 버튼, 취소·그만두기 확인은 두 버튼 모두 테두리다. 운영의 되돌릴 수 없는 확정은 한 방식이다: 쪽의 채운 [○○하기] → 확인 창(취소 `secondary`, 같은 라벨 채움).
- **표 줄 행동.** 표와 목록 줄 안 행동은 `ghost`다. 한 줄에 둘 이상이면 가장 잦은 하나만 보이고 나머지는 더 보기(`dropdown-menu`)에 둔다. `secondary` 2px 테두리를 줄마다 반복하지 않는다.
- Home에서 큰 버튼을 쌓을 때 버튼 사이는 16px, 대화상자의 버튼 행도 16px이다(손 떨림으로 옆 버튼을 누르지 않게).

**icon-button.** 44px 원형(운영), 아이콘 20px, `state-hover` 층. 반드시 `aria-label`이 있다. Home에서는 쓰지 않는다.

**link.** `fg-brand`, 밑줄 1px, 밑줄 띄움 0.16em. 본문 안 링크는 밑줄을 없애지 않는다.

**alt-path (Evenstay 고유).** 앱 밖 경로 블록. `secondary` 버튼 + 전화 아이콘 + 번호를 글자로 보인다("프런트 02-000-0000"). Home의 모든 화면 아래쪽에 있다. 화면 안 행동 버튼과 섞이지 않게 위에 1px `border-subtle` 선과 24px 간격을 두고, 버튼 묶음 안에 넣지 않는다. 번호 줄은 17px 이상 `fg-strong` 600이다.

### Selection and input
**input / textarea / select.** 해부도: 라벨(위, `label-lg` 또는 `label`) → 입력 상자 → 도움말(`body-sm`, `fg-secondary`) 또는 오류(`field-error`).
- 크기: Home·Family 56px, `body-lg`, 좌우 16px. 운영 44px(`input-sm`), `body-sm`.
- 테두리 2px `border-strong`, 모서리 `md`. hover는 테두리 `fg-strong`, focus는 포커스 링, error는 테두리 `danger` + 아래 오류 문장(아이콘 + "무엇이 안 됐는지, 무엇을 하면 되는지"), disabled는 `bg-muted` 바탕과 `fg-disabled` 글자.
- 자리표시 글자(`fg-tertiary`)는 예시만 쓴다. 라벨을 대신하지 않는다.
- 필수 항목은 라벨 옆에 "(필수)" 글자로 쓴다. 별표만 쓰지 않는다.
- 전화번호, 금액은 `inputmode`를 맞추고, 확대를 막지 않도록 모바일 입력 글자는 16px 이상이다.
- textarea는 최소 높이 120px, `body-md-read`, 아래쪽에 글자 수(`number-sm`)를 둔다.

**checkbox / radio.** 24px(Home 28px), 테두리 2px `border-strong`. 선택 시 `primary` 채움 + `on-primary` 체크. 라벨 전체가 누를 수 있는 영역이고 줄 높이를 합쳐 터치 최소값을 채운다.

**switch.** 52×32px, 손잡이 26px + `shadow-1`. 꺼짐은 `border-strong`, 켜짐은 `primary`. 켜짐과 꺼짐을 글자로도 쓴다("알림 받음"). **동의처럼 법적 의미가 있는 선택에는 쓰지 않는다.** 동의는 체크박스와 확인 버튼으로 받는다.

**chip.** 44px 높이, 모서리 `full`, 1px `border-default` 바탕 테두리 + `bg-surface`. 선택 시 `fg-strong` 채움 + `bg-canvas` 글자(명도 반전). 필터에만 쓴다.

**Home 터치 변형.** Home의 탭, 구간 버튼(`segmented`), 칩은 높이 56px다(운영·Family 값 44~48px를 그대로 쓰지 않는다).

**날짜 고르기 (Home).** 한 달 격자 달력을 쓰지 않는다(칸이 56px보다 작아진다). 앞으로 일주일을 큰 줄 목록("오늘", "내일", "수요일 11월 18일")으로 보이고, 그 밖의 날은 [다른 날 고르기]에서 연다. 하루씩 보는 화면은 "◀ 11월 18일 수요일 ▶" 큰 화살표 둘(56px)로 옮긴다. 1024px 이상에서는 7일을 한 줄로 보여도 된다.

**segmented.** 2~4개의 서로 배타적인 보기 전환. `bg-muted` 트랙(모서리 `lg`, 안쪽 4px) 안에서 선택된 항목만 `bg-surface` + `shadow-1`. 높이 48px.

### Contents
**card.** `bg-surface`, 1px `border-subtle`, 모서리 `xl`, 안쪽 24px, 그림자 없음. 제목 `heading1`(Home)·`headline`(운영), 부제 `body-sm` `fg-secondary`. 누를 수 있는 카드는 카드 전체가 하나의 링크이고 hover에서 `state-hover` 층.

**list-cell.** 앞(아이콘 24px 또는 아바타) · 몸(제목 `headline` + 부제 `body-sm`) · 뒤(값 `number-sm` 또는 chevron 아이콘) 세 칸. 높이 64px 이상(Home 72px), 안쪽 16px. 구분선은 몸 칸부터 시작한다.

**table (운영).** 머리 44px `bg-subtle` + `label` `fg-secondary` + 아래 1px `border-default`. 행 52px, `body-sm`, 아래 1px `border-subtle`, hover `bg-subtle`. 숫자 열 오른쪽 정렬, 고정폭 숫자. 선택 행은 `primary-subtle`. 정렬 가능한 머리에는 방향 아이콘. 작은 화면에서는 가로 스크롤 영역(`overflow-x: auto`)에 두고 첫 열을 고정한다. 결정·상태 열은 앞쪽에 둔다. 칸마다 고르는 선택 표는 640px 아래에서 행마다 "머리: 값" 묶음으로 푼다. 날짜·시각 열은 왼쪽 정렬(고정폭 숫자), 금액 열만 오른쪽 정렬이다. 카드 안에 넣는 표는 바깥 테두리 없이 위 1px `border-default` 선만 둔다.

**badge.** 높이 24px(Home 28px), 안쪽 2×8px, 모서리 `sm`, `label`. 변형 `neutral`·`brand`·`success`·`warning`·`danger`. **언제나 글자가 있다.** 입주자 상태(동의함, 갱신 필요, 공개 안 함)는 `neutral`, 시스템 결과(보냄, 보내지 못함)만 의미 색을 쓴다.
- **알림 등급 배지(B 안심 알림).** 색 없이 선과 굵기의 사다리로 구분한다: "즉시 확인"은 `bg-surface` + 안쪽 2px `fg-strong` 선 + 700, "확인 필요"는 `bg-surface` + 안쪽 1px `border-strong` 선 + 600, "기록만"은 투명 + 안쪽 1px `border-default` 선 + 500 + `fg-secondary`. 아이콘 모양도 서로 다르게 둔다. 빨강·주황은 쓰지 않는다(`design/mvp-screens.md` 7절 결정 10).

**avatar.** 원형 32/40/56px, 사진이 없으면 `bg-muted` 바탕에 이름 첫 글자(`label`, `fg-secondary`). 그라디언트를 쓰지 않는다.

**divider.** 1px `border-subtle`. 강한 구분은 `border-default`, 섹션 구분은 8px `bg-subtle` 띠.

**evidence-highlight (Evenstay 고유).** 숫자와 이유 뒤에 깐다. 라이트는 아래쪽 45% 밑줄(`background: linear-gradient(transparent 55%, var(--highlight) 55%)`), 다크는 글자 뒤 전체를 칠한다(`background: var(--highlight)`, 좌우 4px, 모서리 `sm`). 글자는 두 모드 모두 `on-highlight`라서, 다크에서 밑줄만 깔면 글자 위쪽 절반이 어두운 바탕 위의 먹색이 되기 때문이다. 한 화면 한 곳. 글자 굵기는 바꾸지 않는다.

**money (Evenstay 고유).** 금액 행: 왼쪽 항목 이름(`body-md`), 오른쪽 금액(`number`, `fg-strong`). 차이와 이유는 다음 줄 `body-sm` `fg-secondary`. 금액에는 언제나 "원"을 붙이고 0원도 숨기지 않는다.

**consent-scope (Evenstay 고유).** 자리: 보호자 읽기·목록-상세·쓰기 화면의 같은 곳, 뒤로 가기 바로 아래와 h1 위. 첫 줄은 눈 아이콘 + 허락 문장(D copy "…보여 주기로 한 ~이에요."), 둘째 줄(선택)은 범위 설명 `body-sm` `fg-secondary`, 아이콘 없음. 첫 화면(h1이 허락 문장이다), "내가 볼 수 있는 것"(화면이 허락 자체다), 허락이 아닌 안내(레지던스 공지)에는 쓰지 않는다. 정보 위에 둔다: 눈 아이콘 + "이은숙 님이 청구서 열람을 허락하셨어요." `bg-muted`, 모서리 `md`, 안쪽 12×16px. 허락 범위 밖 정보는 자리를 비우지 않고 D copy 6절 문구("이 소식은 지금 볼 수 없어요. 볼 수 있는 범위는 이은숙 회원님이 정해요.")를 쓴다.

**stat-strip (운영).** 라벨 + 숫자(`number`)의 가로 한 줄, 4칸 이하. 칸을 누르면 같은 화면의 거름이나 그 목록으로 간다. 해석 문구, 목표선, 좋음·나쁨 색이 없다. 기준 시각은 화면 오른쪽 위에 하나("10:20 기준 [다시 불러오기]")만 두고, 칸의 기준 시각이 다를 때만 칸에 쓴다.

**record-row (Evenstay 고유).** 변경 기록 한 줄: 누가(이름 + 역할) · 언제(날짜와 시각, `number-sm`) · 무엇을(바꾼 내용). `body-sm` `fg-secondary`, 위아래 12px, 아래 1px `border-subtle`. 고친 값은 "이전 → 이후"를 글자로 쓴다(화살표는 Lucide 아이콘).

### Feedback
**alert (페이지 안 알림).** `bg-subtle` + 1px `border-subtle`, 모서리 `lg`, 안쪽 16px. 앞 아이콘 20px(상태 색은 아이콘에만), 제목 `label-lg` `fg-strong`, 내용 `body-md` `fg-default`. 변형 `info`(cobalt 아이콘), `success`, `warning`, `danger`. 닫기 버튼이 없고 페이지 흐름에 남는다.

**toast.** Sonner(`ask-sonner` 스킬). `bg-inverse` + `fg-on-inverse`, 모서리 `lg`, 안쪽 16×20px, `shadow-2`, 최대 폭 420px, 아래 가운데. 자동으로 닫히는 시간 6초(Home은 토스트 대신 화면 안 알림), 마우스를 올리거나 탭이 가려지면 멈춤. 아래에서 `translateY(100%)` + 투명도 0으로 시작해 `duration-base` `ease-out`으로 올라오고, 닫힐 때는 같은 방향으로 내려간다(transition, 끊겨도 이어짐). 행동 버튼("되돌리기")은 `fg-brand-on-inverse`(반전 바탕 위 코발트, 라이트 8.5:1·다크 8.7:1). `aria-live="polite"`.

**tooltip (운영만).** `bg-inverse`, `body-sm`, 모서리 `md`, 안쪽 8×12px, 지연 400ms(같은 무리 안에서는 지연 없음). 중요한 정보를 툴팁에만 두지 않는다.

**dialog.** `scrim` 위 `bg-elevated`, 모서리 `2xl`, 폭 440px(모바일은 좌우 16px 여백), 안쪽 24px, `shadow-3`. 제목 `heading1`, 내용 `body-md`, 아래 버튼 행(오른쪽 정렬, 모바일은 세로로 쌓고 주 버튼이 위). 열림 `opacity` + `scale(0.95 → 1)` 280ms `ease-out`. Esc와 바깥 누름으로 닫히되, 위험 확인 대화상자는 바깥 누름으로 닫히지 않는다.

**menu-tile (Home·Family, 640px 이상).** 첫 화면과 고르는 화면의 볼 곳·물을 것 하나. 타일 전체가 하나의 링크이고, 같은 무게의 큰 버튼 규칙(`design/mvp-screens.md` 7절 결정 3)에 따라 채우지 않는다: `bg-surface` + 2px `border-strong`, 모서리 `xl`, 안쪽 24px, hover `state-hover`, 누름 `state-active`. 해부도: 아이콘(Home 32px, Family 24px, `fg-strong`) → 제목(Home `heading1` 22px, Family `headline` 18px) → 부제(`body-md` 17px, `fg-secondary`, 두 줄까지). 최소 높이 Home 136px, Family 112px. 제목과 부제는 `text-wrap: balance`로 한 글자만 다음 줄에 남지 않게 한다. 한 줄 타일 행은 높이가 같다(`grid-auto-rows: 1fr`). 어떤 타일에 붙는 범위 밖 안내(`alert` `neutral`)는 640px 이상에서 그 타일 옆 칸을 채우고, 640px 아래에서는 그 타일 바로 아래에 온다. Home 첫 화면은 1024px 이상에서 타일 한 칸이 200px 이상일 때 3열(`repeat(auto-fit, minmax(200px, 1fr))`, 1024~1058px에서는 2열로 접힘), 그 밖 2열. 640px 아래는 `list-cell`. 타일 수가 홀수면 마지막 타일을 전폭으로 늘려 빈 칸을 남기지 않는다. Home 첫 화면은 6개까지(3×2)이고, 더 많은 볼 곳은 묶음 화면(같은 `menu-tile` 2열)으로 한 번 더 연다.

**side-rail (Home·Family, 1024px 이상).** 본문 옆 320px 보조 열. `bg-surface`, 1px `border-subtle`, 모서리 `xl`, 안쪽 24px, 그림자 없음. Home은 `alt-path` 하나(전화 버튼 전체 폭 + 번호 줄). 데스크톱에는 전화가 없는 경우가 많아 번호 줄을 `heading1`(22px, 700, `fg-strong`)로 올려 버튼과 같은 무게로 읽히게 한다. Family는 제목 `label-lg` `fg-secondary` → 소식 목록(`nav`로 감싼 `list-cell`, 항목 글자 `body-md` 17px 500, 항목 사이 구분선 없음) → 구분선 → 프런트 문의 문장. 지금 보는 화면은 색만으로 알리지 않는다: `primary-subtle` 바탕 + `fg-brand` 700 + 오른쪽 화살표 숨김 + `aria-current="page"`. 1024px 아래에서는 보조 열의 내용이 본문 맨 아래로 돌아가되, 앱 밖 경로가 멀어지지 않게 프런트 문의 문장을 목록보다 먼저 두고 구분선은 숨긴다. Family 보조 열은 화면 틀마다 셋 중 하나다: 첫 화면은 레지던스 공지 카드(없으면 "보호자께 알리는 공지가 없어요.") → 신뢰 문장 → 구분선 → 프런트 문의. 읽기·쓰기 화면은 "볼 수 있는 것" 목록(허락 항목, 지금 화면 표시) → 구분선 → "내가 볼 수 있는 것" 한 줄 → 구분선 → 프런트 문의. 목록-상세 화면은 보조 열이 없고 상세 열 아래에 프런트 문의를 둔다(다른 소식으로는 "첫 화면으로"를 거친다).

**list-detail.** 1024px 이상에서 목록 열 360px + 상세 `minmax(0, 1fr)`, 사이 32px. 고른 줄은 `primary-subtle` + `aria-current="true"`. 이 유형의 화면은 보조 열을 두지 않고 상세 열 맨 아래에 앱 밖 경로나 문의 문장을 둔다. 1024px 아래에서는 목록 → 고른 항목의 상세 하나로 쌓는다. 고른 줄 표시는 폭과 상관없이 같고, 고르지 않은 항목의 상세는 그리지 않는다(같은 제목이 두 번 보이지 않게).

**side-panel (운영, 화면 안 보조 패널).** 표 옆에 붙어 고른 행의 근거·상세를 보여 주는 패널은 떠 있는 것이 아니라 화면의 일부다. 카드와 같이 `bg-elevated`, 1px `border-subtle`, 모서리 `xl`, 그림자 없음. 가장자리에서 밀려 나오는 오버레이 시트만 아래 `bottom-sheet`처럼 그림자와 위쪽 `3xl` 모서리를 쓴다.

**bottom-sheet (Family·Home 모바일, 운영 휴대폰).** 아래에서 올라오는 시트, 위쪽 모서리 `3xl`, 손잡이 40×4px, `ease-drawer` 280ms. 끌어서 닫을 수 있고 닫기 버튼도 있다.

**empty-state.** 가운데 정렬, 안쪽 48×24px. 56px 원(`bg-muted`) 안 아이콘 28px(`fg-secondary`) → 제목 `heading2` → 설명 `body-md` `fg-secondary` → 버튼 하나(채울 방법). 문구는 "무엇이 여기에 오는지 + 어떻게 채우는지"("아직 발행한 청구서가 없어요. 청구 일정을 확인해 보세요.").

### Loading
**skeleton.** 오게 될 내용의 모양 그대로, `bg-muted`, 모서리 `sm`. 반짝임 애니메이션은 1.6초, `prefers-reduced-motion`에서는 멈춘 채로 둔다.
**spinner.** 버튼 안 20px, 독립 24/32px, 한 바퀴 800ms linear(빠를수록 빠르게 느껴진다). `prefers-reduced-motion`에서는 돌지 않고 투명도가 1.2초마다 1 → 0.4 → 1로 바뀌며, 옆에 "불러오는 중" 글자를 둔다(멈춘 원은 "멈췄다"로 읽힌다).
**progress.** 트랙 8px `bg-muted`, 막대 `primary`, 모서리 `full`. 몇 단계 중 몇 번째인지 글자("2/3 단계")를 함께 쓴다.

### Navigations
**app-bar.** 높이 64px, `bg-surface`, 아래 1px `border-subtle`, 위쪽 고정. 왼쪽 로고, 가운데·왼쪽 내비게이션, 오른쪽 사업장 선택과 사용자 메뉴.
**nav-item.** `label`, 선택 시 `primary-subtle` 바탕 + `fg-brand` 글자 + `aria-current="page"`.
**nav-bottom (운영 휴대폰, 야간·생활지원만).** 높이 64px + 안전 영역, 4칸(아이콘 24px + `label` 글자), 선택 칸은 `fg-strong` + 위 2px 선. 글자를 숨기지 않는다. Home·Family에는 쓰지 않는다.

**tabs.** 높이 48px(Home 56px), `label-lg` `fg-secondary`, 선택 시 `fg-strong` + 아래 2px `fg-strong` 선. 선 이동에 모션을 넣지 않는다.
**pagination.** 40px 칸, 모서리 `md`, 선택된 쪽은 `fg-strong` 채움 + `bg-canvas` 글자. 처음·이전·다음·끝 버튼은 글자 라벨을 숨기지 않는다(운영).
**breadcrumb.** `body-sm`, 링크 `fg-secondary`, 구분 아이콘 chevron 16px `fg-tertiary`, 현재 위치 `fg-strong` 600.
**accordion.** 머리 56px `headline` + 오른쪽 chevron(열면 180° 회전, 200ms). Home에서는 중요한 내용을 접어 두지 않는다.
**dropdown-menu.** `bg-elevated`, 1px `border-subtle`, 모서리 `lg`, 안쪽 4px, `shadow-2`, 최소 폭 200px. 항목 44px, 모서리 `md`, hover `state-hover`. 위험 항목은 `fg-danger`이고 구분선 아래 맨 끝에 둔다. 열 때 연 버튼 쪽을 기준점(`transform-origin`, Radix는 `var(--radix-dropdown-menu-content-transform-origin)`)으로 `scale(0.95)` + 투명도 0에서 `duration-base` `ease-out`으로 나타나고, 닫힐 때는 `duration-fast`로 사라진다. 대화상자는 기준점을 가운데로 둔다. 키보드 단축키로 연 메뉴는 모션 없이 바로 연다.

## Do's and Don'ts

**Do**
- 숫자 옆에 이유를 쓴다("식사 3끼를 드시지 않아 27,000원을 빼 드렸어요").
- Home의 모든 화면에 앱 밖 경로(전화, 프런트)를 둔다.
- 보호자에게 보이는 정보 위에 회원님이 허락한 범위를 밝힌다.
- 화면 코드는 의미 색(`bg-*`, `fg-*`, `border-*`, `primary`)만 부른다. 원자 램프는 새 의미 색을 만들 때만 쓴다.
- 화면당 채운 버튼은 하나다.
- 상태는 글자로 쓰고, 색은 그 글자를 돕기만 한다.
- 회원·보호자에게는 해요체와 "회원님", 직원 화면은 합쇼체 또는 명사형 라벨과 "입주자"를 쓴다.
- 오류 문장은 "무엇이 안 됐는지 → 무엇을 하면 되는지" 순서로, 사용자 탓을 하지 않는다.
- 데모 데이터는 가상임을 화면에 밝힌다.

**Don't**
- 판단 단어(낙상, 쓰러짐, 응급, 위험, 배회)를 화면에 쓰지 않는다. 관찰된 사실만 쓴다.
- 점수, 등급, 단계 번호, 추천을 색이나 그래프로 만들지 않는다.
- 입주자 상태를 빨강·초록·주황 신호등으로 칠하지 않는다.
- 코발트를 장식이나 넓은 면에 쓰지 않는다. 노랑을 배경 면으로 쓰지 않는다.
- `border-subtle`, `border-default`를 버튼이나 입력칸의 경계로 쓰지 않는다.
- 그라디언트, 빛 번짐, 유리 효과, 질감, 이모지, 대문자 자간 라벨, 기울임 강조를 쓰지 않는다.
- 카드에 그림자를 주지 않는다. 카드 안에 카드를 넣지 않는다.
- 동의를 스위치나 미리 체크된 체크박스로 받지 않는다.
- 지어낸 수치, 후기, 로고를 넣지 않는다.
- 원티드를 비롯한 다른 회사의 색, 서체, 로고, 도메인 개념을 가져오지 않는다. 참고한 것은 문서의 구성 방식뿐이다.

## Responsive Behavior
- **접는 순서:** 운영 표는 가로 스크롤(첫 열 고정) → 사이드바는 메뉴 시트 → 카드 그리드는 1단. Home·Family는 1024px 아래에서 보조 열을 본문 맨 아래로, 목록-상세를 목록 → 상세로, 타일을 2열 → 목록 행으로 접는다.
- **글자 확대:** 브라우저 글자 200% 확대에서도 가로 스크롤 없이 읽혀야 한다(WCAG 1.4.4, 1.4.10). 크기는 rem으로만 쓴다.
- **안전 영역:** 모바일 아래쪽 고정 버튼은 `padding-bottom: env(safe-area-inset-bottom)`를 더한다(`mobile-native` 스킬).
- **이미지:** 사진은 쓰지 않는 것이 기본이다. 쓴다면 16:9 또는 4:3으로 자르고 `alt`에 사실을 쓴다. 소개 사이트는 "소개 사이트 예외" 절을 따른다.

## Accessibility
- 목표: WCAG 2.2 AA, Home 본문은 AAA 대비(7:1).
- 모든 기능은 키보드로 쓸 수 있고, 포커스 순서가 보이는 순서와 같다. 포커스 링을 지우지 않는다.
- 색만으로 뜻을 전하지 않는다. 오류는 아이콘 + 글자 + `aria-invalid` + `aria-describedby`.
- 바뀌는 내용은 `aria-live`로 알리고(토스트 polite, 오류 assertive), 로딩 영역은 `aria-busy`.
- 고대비 모드(`forced-colors: active`)에서 로고와 근거 밑줄은 `forced-color-adjust: none`으로 지킨다.
- 시간 제한이 있는 화면(인증번호 등)은 연장 버튼을 둔다.

## 소개 사이트 예외

회원·보호자 대상 소개 사이트(`senior-lab/04-planning/ideas/evenstay-landing/`, 사용자 결정 U-01, U-07, 2026-11-04 "모두 추천대로")에만 쓴다. **앱 화면(Evenstay, Evenstay 홈, Evenstay 패밀리)에는 쓰지 않고, 앱 화면 규칙은 이 절로 바뀌지 않는다.** 여기 적지 않은 것은 이 파일의 규칙을 그대로 따른다.

| 무엇 | 앱 화면 규칙 | 소개 사이트 |
|---|---|---|
| 자동 재생 영상 | 자동 재생을 쓰지 않는다 | 쓴다. 소리 없음, 키보드와 터치로 되는 일시정지 버튼. `prefers-reduced-motion: reduce`나 `Save-Data`면 영상을 받지 않고 포스터만 보인다 |
| 사람 사진 | 사진을 쓰지 않는 것이 기본 | 쓴다. 가상 데모 인물이고 `alt`에 사실을 쓴다 |
| 히어로 영상 전환 | UI 모션 300ms 이하 | 약 1.6초 교차 전환, `ease-in-out`. 다음 장면은 지금 영상 끝 1.2초 전에 시작해 겹치고, 들어오는 장면은 1.035배에서 2.4초 동안 제자리로 온다. 좌우 이동은 없다. 움직임 줄이기에서는 확대와 자동 넘김 없이 포스터만 160ms로 바뀐다. 히어로 영상에만 쓰고 버튼, 메뉴, 시트 같은 UI 모션은 300ms 상한 그대로다 |
| 히어로 지속 시간 띠 | 정한 것 없음 | 영상별 칸으로 나뉜 띠. 보이는 줄 4px, 칸마다 누르는 영역 높이 56px. 지금 칸이 재생 시간에 맞춰 선형으로 차고, 칸을 누르면 그 영상으로 간다. `button`이고 포커스 링을 유지한다 |
| 히어로 화살표 | Home에서는 아이콘만 있는 버튼을 쓰지 않는다 | Lucide `chevron-left`, `chevron-right`, 글자 없는 아이콘 버튼. 보이는 크기 48px, 누르는 영역 56px. 접근성 이름은 카피를 쓴다 |
| 자르기 | 16:9 또는 4:3 | 인물 카드는 4:5로 자른다. 히어로 영상의 640px 아래 화면도 4:5다 |
| 일러스트 사용처 | 빈 상태와 첫 사용 안내에만 | 메인 섹션에도 쓴다(ILL-1 LND-02·SITE-ABOUT-01, ILL-2 LND-06, ILL-3 LND-07). 그림 안에 글자를 넣지 않고, 뜻은 본문이 말한다 |
| 일러스트 색 | cobalt와 paper 램프 안 | ILL-1, ILL-2, ILL-3, 마스코트 두칸(MAS-1)은 `ink` 램프의 먹색과 `yellow` 200도 쓴다. 평면도, 약도는 cobalt와 paper 램프 안에 둔다 |
| 마스코트 | 정한 것 없음 | 두칸 MAS-1 하나를 LND-08, LND-10 접수 뒤 안내, SITE-404-01에만 둔다. 얼굴 없이 자세로 표정을 내고, 말풍선과 대사는 없다 |

- 쓰지 않는 것: 붙박이 스크롤(LND-05 포함). 시니어가 화면 위치를 잃기 쉬워 U-01에서 뺐다.
- 일러스트에 사람 얼굴, 노화를 과장한 모습, 의료 장면을 그리지 않는 규칙은 소개 사이트에도 그대로다. 그라디언트와 질감도 쓰지 않는다.
- 먹색과 노랑 예외는 그림(ILL-1, ILL-2, ILL-3, MAS-1) 안의 색에만 해당한다. 소개 사이트의 글자, 버튼, 바탕 색 규칙은 바뀌지 않는다.

## Exports
세 파일은 `node design/system/build.mjs`가 이 파일 하나에서 만든다. 손으로 고치지 않는다.
- `design/system/theme.css`: `npx @google/design.md export --format css-tailwind`의 결과. Tailwind v4 `@theme` 블록.
- `design/system/tokens.css`: 같은 값을 `:root` 변수로 바꾸고, 내보내기가 빠뜨리는 줄 간격(`--text-*--line-height`)과 `.dark`에서 바뀌는 의미 색 층(`--bg-canvas`, `--primary` 등)을 더한 정적 HTML용 파일. 미리보기와 슬라이드가 읽는다.
- `design/system/globals.css`: Next.js 앱용. Pretendard `@font-face`, shadcn/ui 변수(`--background`, `--primary` 등)와 `.dark` 짝, 줄 간격과 자간, 그림자와 모션 변수, Tailwind 기본 글자 크기 상향. 앱을 만들 때 `app/globals.css`로 옮기고 글꼴 경로를 고친다. shadcn 변수에는 값을 직접 넣는다(`--primary`가 같은 이름의 DESIGN.md 색을 `var()`로 부르면 순환한다).
- `design/system/preview.html`: 토큰과 컴포넌트를 세 밀도, 라이트·다크로 보여 주는 확인 페이지. 글자 단계 값은 실행 중에 `tokens.css`에서 읽는다.
- 바꾸는 순서: DESIGN.md 수정 → `npx @google/design.md lint DESIGN.md`(오류·경고 0) → `node design/system/build.mjs` → 미리보기 확인.

## Known Gaps
- **내보내기 한계:** `@google/design.md`(alpha)의 `css-tailwind` 내보내기는 `lineHeight`, 그림자, 모션을 싣지 않는다. 그래서 줄 간격은 `build.mjs`가 이 파일의 YAML을 직접 읽어 채우고, 그림자와 모션 값은 `build.mjs` 안에 따로 적혀 있어 바꿀 때 본문 CSS 블록과 함께 고쳐야 한다.
- **그림자·모션 토큰:** design.md 명세에 그림자와 모션 토큰 형식이 없어서 YAML이 아니라 본문 CSS 블록에 둔다.
- **다크 모드 검증 범위:** 다크 값은 대비 계산으로 확인했고, 실제 기기(OLED, 저밝기)에서는 보지 않았다.
- **고령 이용자 검증 없음:** 크기, 대비, 터치 영역은 기준(WCAG)과 내부 원칙에서 정한 [가설]이다. 70~80대 이용자 시험은 하지 않았다.
- **상표:** "Evenstay" 상표는 KIPRIS·USPTO에서 확인하지 않았다 [미확인](`docs/core/copy/names.md`).
- **원자 램프:** 앵커를 뺀 단계는 OKLCH 보간으로 만든 값이라, 실제 화면에서 단계 간 차이를 눈으로 다시 맞춰야 할 수 있다.

## References
1. google-labs-code/design.md README와 명세(alpha), https://github.com/google-labs-code/design.md , 2026-11-03 확인.
2. 원티드 몽타주 design.md(사용자 제공 `~/Downloads/wanted.md`, last_updated 2026-10-27). 구성(원자→의미 2층, 다크 짝, 글자 단계표, 컴포넌트 해부도, 반응형, Known Gaps, 출처)만 참고했다.
3. Pretendard v1.3.9, https://github.com/orioncactus/pretendard (배포 안내 https://cactus.tistory.com/306 ), SIL OFL 1.1.
4. WCAG 2.2, https://www.w3.org/TR/WCAG22/ (1.4.3 대비, 1.4.4 글자 크기 조정, 1.4.10 리플로, 1.4.11 비텍스트 대비, 2.5.5·2.5.8 타깃 크기).
5. emilkowalski/skills f1090be(2026-11-02), `emil-design-eng` 모션 기준, MIT.
6. Tailwind CSS v4.1.13, shadcn/ui 테마 변수 규약. `max-w-*` 충돌은 2026-11-03 로컬 컴파일로 확인.
7. Lucide 아이콘, https://lucide.dev , ISC.
