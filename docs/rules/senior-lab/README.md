# senior-lab 사용 가이드

시니어 하우징 회사 지원용 포트폴리오 MVP를 위해 리서치 → 아이디어 → 카피 → 기획 → 포트폴리오를 진행하는 워크스페이스.

```text
01-research ──► 02-ideation ──► 03-copywriting ──► 04-planning ──► (MVP 개발: evenstay/<모듈>) ──► 05-portfolio
 문제 은행        숏리스트 3~5     아이디어별 이름·카피   아이디어별 PRD                           회사별 케이스 스터디
        └──────────────── shared/ (지원 회사, 아이디어 상태판, 평가 기준, 결정 기록) ────────────────┘
```

## 핵심 사용법
- **허브는 `00-hub/`에서 연다.** 허브는 `shared/`를 관리하고 단계 세션을 시작·확인하며, 단계 산출물은 직접 쓰지 않는다. 관리용 스킬은 `00-hub/.claude/skills/`에만 둔다. 상위 `senior-lab/.claude/skills/`에 두면 모든 단계 폴더에 섞여 보이므로 루트에는 스킬을 설치하지 않는다(2026-11-03 확인).
- **각 단계 폴더에서 Claude Code를 연다.** 그래야 그 폴더의 `.claude/skills/`와 CLAUDE.md가 로드된다. 상위 `senior-lab/CLAUDE.md`(공통 규칙)는 자동으로 함께 적용된다.
- 전역 스킬(gstack, OMC 등)은 어느 폴더에서나 보인다. 폴더 분리는 "추가 스킬 최소화 + 단계별 지침"이고 완전한 격리는 아니다.
- 03과 04는 **한 세션에 아이디어 하나**만 다룬다.

| 폴더 | 로컬 스킬 | 같이 쓰는 전역 스킬 |
|---|---|---|
| 00-hub | prioritization-frameworks, pre-mortem, strategy-red-team, sprint-plan, retro, stakeholder-map, summarize-meeting | — |
| 01-research | mom-test, jobs-to-be-done, customer-research, user-personas, competitor-analysis, interview-script, summarize-interview | deep-research |
| 02-ideation | opportunity-solution-tree, brainstorm-ideas-new, value-proposition, identify-assumptions-new | office-hours |
| 03-copywriting | product-marketing, product-name, value-prop-statements, copywriting, copy-editing | humanizer, grammar-checker |
| 04-planning | product-strategy, service-blueprint, create-prd, user-stories, outcome-roadmap, north-star-metric | — |
| 05-portfolio | case-study, presentation-deck, review-resume | make-pdf, anthropic-skills:pptx |

출처: wondelai/skills, coreyhaines31/marketingskills, phuryn/pm-skills, Owl-Listener/designer-skills. 설치 버전은 폴더별 `skills-lock.json`에 있다.

## 단계별 요청 예시

### 01-research
```text
지원할 회사는 [회사명, 공고 링크]야. deep-research로 회사의 사업, 운영 시설, 서비스, 최근 뉴스를 조사해서 ../shared/target-companies.md를 채워줘. 모든 사실에 출처와 날짜를 붙여줘.
```
```text
CLAUDE.md의 리서치 축 2~7을 하나씩 deep-research로 조사해줘. 축마다 sources/와 notes/에 저장하고, 끝나면 customer-research와 jobs-to-be-done으로 정리해서 outputs/problem-bank.md를 만들어줘. 시니어, 보호자, 운영사 직원의 문제가 고르게 들어가게 해줘.
```
```text
mom-test로 우리 부모님(70대)과 실버타운 직원에게 물어볼 인터뷰 질문을 각각 만들어줘.
```

### 02-ideation
```text
../01-research/outputs/problem-bank.md를 입력으로 opportunity-solution-tree를 만들고, 상위 기회마다 brainstorm-ideas-new로 아이디어를 발산해줘. B2C와 운영사용 B2B 도구가 섞이게 해줘. 결과는 drafts/에 저장.
```
```text
롱리스트를 ../shared/evaluation-rubric.md로 평가해서 outputs/scorecard.md를 만들고, 상위 후보는 value-proposition과 identify-assumptions-new로 정리한 뒤 숏리스트 5개를 제안해줘. 확정은 내가 할게.
```

### 03-copywriting (아이디어 하나씩)
```text
숏리스트의 [slug]로 작업할게. product-marketing으로 ideas/[slug]/product-marketing.md를 만들고, product-name으로 이름 후보 10개, value-prop-statements로 시니어/보호자/운영사별 가치 제안, copywriting으로 서비스 소개와 첫 화면 문구를 써줘.
```

### 04-planning (아이디어 하나씩)
```text
[slug]를 기획해줘. product-strategy → service-blueprint → create-prd → user-stories → outcome-roadmap 순서로 ideas/[slug]/에 저장하고, 단계마다 내가 확인한 뒤 다음으로 넘어가줘. PRD에는 CLAUDE.md의 필수 항목을 모두 넣어줘.
```

### MVP 프로젝트로 넘어갈 때
MVP는 상위 저장소 하나(``)에 코어와 모듈을 하위 폴더로 두는 중첩 구조다(2026-11-02 확정). slug와 모듈 폴더 대응은 `04-planning/CLAUDE.md` "개발 인계"에 있다. 예: 코어(`pms-core-billing` → `core`)
```bash
mkdir -p docs/core
```
```bash
cp -R senior-lab/04-planning/ideas/pms-core-billing/. docs/core/
```
MVP 폴더에서는 전역 스킬(superpowers의 brainstorming·writing-plans, impeccable, frontend-design, design-consultation)로 디자인과 개발을 진행한다. 시니어 접근성 점검이 더 필요하면 그 프로젝트에만 추가한다:
```bash
npx skills add Owl-Listener/designer-skills -a claude-code --skill accessibility-audit -y
```

### 05-portfolio
```text
[회사명] 지원용으로 [slug] MVP의 케이스 스터디를 case-study로 써줘. 회사 관심사는 ../shared/target-companies.md를 참고해. 실제로 하지 않은 검증이나 성과는 쓰지 마.
```

## 스킬 관리
- 업데이트(해당 폴더에서): `npx skills update -p -y`
- 추가: `npx skills add <owner/repo> --list`로 이름을 확인한 뒤 `npx skills add <owner/repo> -a claude-code --skill <이름> -y`
- 제거: `npx skills remove <이름>`
- 스킬을 추가하기 전에 같은 역할의 스킬이 이미 있는지 위 표에서 확인한다.

## 나중에 추가를 검토할 스킬
| 필요해지는 시점 | 후보 |
|---|---|
| AI 기능이 핵심인 아이디어 | RefoundAI/lenny-skills `ai-product-strategy` (02, 04) |
| 시장 규모를 회사에 설명해야 할 때 | phuryn/pm-skills `market-sizing` (01) |
| 시니어 대상 사용성 테스트 | Owl-Listener/designer-skills `usability-test-plan` (MVP 프로젝트) |
