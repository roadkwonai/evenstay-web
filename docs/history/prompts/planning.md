# 프롬프트 기록: 기획

[이력 개요](../README.md) · 전체 167건 (사용자 43, 허브 지시 106, 에이전트 지시 18)

### p0033

2026-11-02 23:42 · 허브 지시 · A 코어 기획: Evenstay Core PRD·tech-design

~~~~text
Background (from the session that started this one):
사용자는 [지원 회사]([지원 회사] 계열 시니어하우징 위탁 운영사, 2026-05 설립, 자체 PMS를 0→1로 구축 중)의 Tech Lead / Senior Backend Engineer 직무에 지원하려고 포트폴리오 MVP를 기획한다. 워크스페이스는 `~/ai/senior-lab/`이고 단계별 폴더(01-research → 02-ideation → 03-copywriting → 04-planning → 05-portfolio)로 나뉜다. 2026-11-02까지 확정된 것: 숏리스트는 하나의 PMS 코어 위에 모듈을 얹는 "코어 + 모듈" 구조(A 계약·청구 코어 → B 이상 신호 허브 → D 보호자 포털 → G AI 생활 비서 → C 케어 단계 전환, E 예비). 금융 기능은 별도 모듈이 아니라 A에 I-30 대리권·후견과 I-29 청구 명세 설명, D에 I-31 금전 업무 경계와 I-42 AI 고지·동의·감사로 넣었다. 브랜드는 Evenstay 단일(운영 Evenstay, 회원 Evenstay Home, 보호자 Evenstay Family). 개발은 senior-lab 밖 `~/ai/evenstay/` 저장소 하나에 core·safety·family·assistant·transitions·leasing 하위 폴더를 두는 중첩 구조(모듈형 모놀리스 기본). 이 세션은 허브 세션이 띄운 하위 세션이며, 다른 하위 세션이 동시에 `03-copywriting/ideas/safety-signal-hub/`와 `03-copywriting/ideas/family-consent-portal/`에서 카피를 쓰고 있다. 공유 파일(`shared/` 전체)은 허브만 고친다.

Task:
`pms-core-billing`(A. 계약·청구 코어, 브랜드 Evenstay Core)의 기획 문서 묶음을 만든다. 이 폴더의 `CLAUDE.md`와 상위 `~/ai/senior-lab/CLAUDE.md`의 규칙을 따른다(한국어, [사실]/[추정]/[가설]/[미정] 구분, 출처 번호 유지, 없는 수치·고객·후기 금지).

## 먼저 읽을 것
- `../02-ideation/outputs/shortlist.md` A 절, 데모 시나리오, 마지막 "AI 비서·금융 자산관리 반영 — 확정 (통합안)" 절
- `../02-ideation/drafts/value-propositions.md` A, `../02-ideation/drafts/assumptions.md` A
- `../03-copywriting/ideas/pms-core-billing/` 4개 파일. 특히 `product-marketing.md`의 용어집(도메인 코드 → 직원 화면 → 회원 화면)은 도메인 모델의 공통 언어로 그대로 쓴다. `copy.md`의 화면 문구와 상태 라벨도 맞춘다.
- `../01-research/outputs/problem-bank.md`(v0.4. 특히 P-006, P-014, P-015, P-017, P-018, P-044, P-047, P-049), `personas.md`, `jtbd.md`(J6, J7), `pms-landscape.md`(Mews의 Enterprise/Property/Portfolio, Bill이 Profile에 귀속되는 구조, 범위별 토큰. B8)
- `../shared/target-companies.md`(공고 요구 역량 표), `../shared/evaluation-rubric.md`

## 할 일 (이 폴더의 로컬 스킬 순서대로, 결과는 `ideas/pms-core-billing/`)
1. `product-strategy` → `strategy.md` (대상, 차별점, 목표 결과, 하지 않을 것)
2. `service-blueprint` → `service-blueprint.md` (운영 매니저·경리·현장 직원·입주자·보호자·소유주의 접점, 직원 업무, 시스템, 실패 대응. 계약 체결 → 월 청구 → 사별 승계 → 후견인 등록 → 퇴거 정산 흐름)
3. `create-prd` → `prd.md`. `CLAUDE.md`의 "PRD에 반드시 들어갈 것"을 모두 넣는다. MVP 범위는 혼자 2~4주. 청구 규칙은 생활비·식비·결식 감면 3개로 제한(가정 문서의 축소안). 데모 시나리오는 shortlist A의 5단계를 기준으로 하고, 시드 데이터(운영사 1, 소유주 2, 사업장 2: 시니어 레지던스·임대주택)를 정의한다.
4. `user-stories` → `user-stories.md` (이용자별 스토리와 인수 조건)
5. `outcome-roadmap` → `roadmap.md` (MVP → 다음 버전. I-25 소유주 리포트, I-41 이례 거래 보호자 알림(금융기관 제휴 전제)은 로드맵 후보)
6. `tech-design.md` — `CLAUDE.md` "기술 설계"와 "코어 + 모듈 구조"를 따른다. **이 문서가 모든 모듈의 공통 도메인 모델 기준이다.** 반드시 포함:
   - 코어 엔티티와 ERD 초안: 운영사, 소유주, 사업장, 동, 호실, 입주자, 보호자 관계(관계만. 동의 정책은 D가 확장), 대리인(Representative: 근거·증빙·권한 범위·유효기간), 계약(상태 전이: 작성 중 → 거주 중 → 승계됨 / 퇴거 예정 → 정산 완료), 청구 원장(Charge/Invoice/Payment, 조정 전표, 항목별 근거 링크), 요금 항목·감면 규칙(사업장별 설정), 역할, 변경 이력
   - ADR 최소 4개: (1) Multi-site·Multi-owner 테넌시 방식, (2) 모듈 경계 규칙(다른 모듈 테이블 직접 접근 금지, 코어 API·이벤트로만), (3) 저장소·패키지 구조(`~/ai/evenstay/` 아래 core·safety·family·assistant·transitions·leasing), (4) 원장 불변성과 정정 방식. 기술 스택은 확정하지 말고 후보와 선택 기준만.
   - 주요 API 목록, RBAC 역할표(본사, 사업장 직원, 경리, 소유주, 입주자, 보호자, 대리인), 민감정보 처리, 외부 연동 경계(결제·ERP는 어댑터·목업), 다른 모듈(B, D, G, C)이 코어에 기대는 확장 지점
7. `handoff.md` (`CLAUDE.md` "개발 인계" 항목). `evenstay` 폴더를 만들거나 파일을 복사하지는 않는다(허브가 검수 후 한다).

## 지킬 것
- 모든 파일 첫머리에 `상태: 초안`.
- `ideas/pms-core-billing/` 밖은 쓰지 않는다. 특히 `../shared/`(상태판·결정 기록), `../03-copywriting/`, 다른 모듈 폴더는 읽기만 한다. 공유 문서를 바꿔야 할 것 같으면 바꾸지 말고 최종 보고에 "허브에 요청"으로 적는다.
- 사용자에게 확인이 필요한 결정(범위 축소, ADR 선택)은 대안과 함께 각 문서 끝 "확인할 것"에 남기고 진행은 계속한다.

## 끝나면 (최종 보고)
만든 파일 목록, 핵심 설계 결정 5개 이내, 사용자 확인이 필요한 것, 허브에 요청할 공유 파일 변경, 남은 [NEED]/[미확인]을 짧게 보고한다.

Shared notes folder for this group of sessions (outside the repo; read siblings' notes there, leave hand-over notes or large findings there instead of pasting them into messages): ~/Library/Application Support/Claude/side-session-notes/local_4ea3b11d-fd3a-4c6e-847f-d3162e709e19
~~~~

### p0036

2026-11-02 23:57 · 에이전트 지시 · A 코어 기획: Evenstay Core PRD·tech-design

~~~~text
읽기 전용 검토다. 파일을 고치지 말고 문제 목록만 보고해라.

대상: ~/ai/senior-lab/04-planning/ideas/pms-core-billing/ 의 7개 파일(strategy.md, service-blueprint.md, prd.md, user-stories.md, roadmap.md, tech-design.md, handoff.md). 한국어 기획 문서 묶음이다.

기준 문서(읽기만):
- ~/ai/senior-lab/CLAUDE.md, ~/ai/senior-lab/04-planning/CLAUDE.md ("PRD에 반드시 들어갈 것", "기술 설계", "개발 인계")
- ~/ai/senior-lab/03-copywriting/ideas/pms-core-billing/product-marketing.md 의 Glossary 표(도메인 코드 → 직원 화면 → 회원 화면)
- ~/ai/senior-lab/02-ideation/outputs/shortlist.md A 절 데모 시나리오 5단계

확인할 것:
1. 필수 항목 누락: 04-planning/CLAUDE.md의 PRD 필수 6개(MVP 범위, 데모 시나리오+시드, 시니어 접근성, 역할과 권한, 개인정보와 안전, 기술 메모)와 기술 설계 항목, 개발 인계 항목이 각각 어느 파일 몇 절에 있는지. 없으면 지적.
2. 숫자 계산: 시드 요금(생활비 1인 2,100,000/2인 3,300,000, 식비 1끼 9,000원, 하루 3끼)으로 prd.md·user-stories.md·tech-design.md에 나온 금액(4,947,000원, 1,674,000원, 186끼, 2,910,000원 등)이 맞는지 직접 계산.
3. 문서 간 불일치: 계약 상태 이름(용어집 DRAFT/ACTIVE/SUCCEEDED/TERMINATING/SETTLED와 한국어 라벨), 청구 시작·종료일 규칙, 대리인 범위 4개 이름, 역할 이름, 우선순위(P0/P1)와 기능 ID(F1~F17)·스토리 ID(US-01~21) 상호 참조가 서로 맞는지. prd.md 7절 표의 스토리 번호가 user-stories.md의 실제 제목과 맞는지.
4. 규칙 위반: 모든 파일 첫머리에 "상태: 초안"이 있는지. [사실]/[추정]/[가설]/[미정] 외의 이상한 태그. 출처 없는 통계·수치를 사실처럼 쓴 곳. "노인" 같은 금지 표현. 실재 회사·인물을 가상 시드처럼 쓴 곳.
5. 각 문서 끝에 "확인할 것" 절이 있는지(handoff.md는 "착수 전에 정할 것"이어도 됨).

출력: 심각도(높음/중간/낮음)별로 "파일:줄 — 문제 — 고칠 방향" 한 줄씩. 문제 없으면 그 항목은 "문제 없음"이라고만. 600단어 이내.
~~~~

### p0042

2026-11-03 00:04 · 허브 지시 · A 코어 기획: Evenstay Core PRD·tech-design

~~~~text
허브에서 처리한 결과와 호칭 기준입니다(사용자 확정, 2026-11-03).
1. 요청하신 카피 수정은 반영했습니다. ../03-copywriting/ideas/pms-core-billing/copy.md: "난방비"를 빼고, 합계를 2,910,000원(생활비 2,100,000 · 식비 837,000 · 감면 −27,000)으로 고쳤습니다. 2월과 비교하면 식사 수가 달라 "지난달보다 27,000원 적어요" 줄도 뺐습니다. 퇴거 정산 안내에서는 선납금과 중도 퇴거 공제를 빼고 [미정: P1 단순형 계산 항목에 맞춤]을 붙였습니다. product-marketing.md 용어집은 MEAL_SKIP_DISCOUNT(결식 감면)과 ADJUSTMENT(조정)로 나눴습니다.
2. 호칭: 직원 화면에서는 "입주자", 회원에게 직접 말할 때는 "회원님"으로 부릅니다. 직원 화면에서는 "회원"을 쓰지 않습니다. 기획 문서의 설명문은 그대로 두셔도 됩니다. 다만 화면 라벨, 데모 시나리오의 직원 화면 문구, 사용자 스토리 확인 조건에 들어간 화면 문구는 이 기준에 맞춰 주세요. 예: prd.md 데모 시나리오의 "회원 이은숙 화면"처럼 회원이 보는 화면을 가리키는 말은 그대로 둡니다.
범위: 04-planning/ideas/pms-core-billing/ 안에서만 고치고, shared/와 evenstay는 건드리지 마세요. 문서는 사용자 확인 전이니 상태: 초안을 유지해 주세요. 끝나면 바꾼 곳 수만 짧게 보고해 주세요.
~~~~

### p0051

2026-11-03 00:12 · 허브 지시 · A 코어 기획: Evenstay Core PRD·tech-design

~~~~text
handoff.md의 "착수 전에 정할 것" 7건이 확정됐으니 기획 문서에 반영해 주세요(사용자 확정, 2026-11-03).
1. 기술 스택: 아직 정하지 않습니다. 정해진 것은 방향뿐입니다. 프로토타입은 HTML·JS로, MVP는 Next.js로 만듭니다. tech-design 12절에서 Kotlin, NestJS, Python 후보 표는 빼고 이 방향을 적어 주세요. ADR-2·3의 경계 강제 수단과 저장소 구조가 특정 프레임워크(Spring Modulith 등)를 전제했다면, 프레임워크 중립으로 쓰거나 Next.js 기준 후보(eslint 경계 규칙, dependency-cruiser 등)로 바꿔 주세요. DB는 PostgreSQL을 유지합니다. 스택 확정은 여전히 [미정]입니다.
2. 계약 상태에 "입주 예정"(SIGNED)을 추가해 6개로 만듭니다. 상태 전이는 DRAFT →(sign) SIGNED →(move-in) ACTIVE입니다. ERD, 상태 표, 전이 표, API, 사용자 스토리, PRD를 모두 맞춰 주세요. 카피 라벨은 직원 화면 "입주 예정", 회원 화면 "입주를 기다리고 있어요"이고 용어집에 반영했습니다.
3. G 최소판 일정은 코어 keyDates만 씁니다. SiteSchedule은 추가하지 않습니다.
4. 원장 보호: RLS와 발행 항목 보호 트리거를 둘 다 켭니다. 제안대로 "확정"으로 표시해 주세요.
5. 요금: 일할 없이 갑니다. 입주 월은 1개월분, 승계는 다음 달 1일부터, 퇴거는 그 달 말일까지입니다. 요금표는 체결 때 버전으로 고정합니다. 데모 시드의 입주일은 1일로 맞춰 주세요.
6. 보호자 청구서 화면은 D가 열고, 코어는 청구서 API만 줍니다. 대리 근거 enum에 특정후견을 추가합니다. 카피 2-4에 "특정후견을 골랐을 때" 안내도 넣었습니다.
7. 빠진 카피는 허브가 썼습니다. ../03-copywriting/ideas/pms-core-billing/copy.md의 2-5 요금 규칙(US-06), 2-6 식사 기록 올리기(US-08), 2-7 퇴거 접수와 정산(US-21)입니다. 각 스토리의 "[NEED: 카피]"를 이 절을 가리키게 바꿔 주세요.
각 문서의 "확인할 것"에서 위 항목은 결정 내용으로 바꿔 주세요. 아직 결정하지 않은 것(North Star, 소유주 이름 가림, 승계 되돌리기, 대리인 승인자, 문의 취소 10분, 로드맵 2건)은 제안과 함께 [미정]으로 남겨 두세요.
범위: 04-planning/ideas/pms-core-billing/ 안에서만 고칩니다. 상태: 초안은 유지하고, shared/와 evenstay는 건드리지 마세요. 끝나면 파일별로 바꾼 곳을 짧게 보고해 주세요.
~~~~

### p0056

2026-11-03 00:28 · 사용자 · 시니어 서비스 MVP 기획 환경 구성

~~~~text
각 Nested 세션별로 필요한 스킬들을 설치해서 해당 스킬들로 작업진행하도록 진행하고 있어?
~~~~

### p0057

2026-11-03 00:28 · 사용자 · 시니어 서비스 MVP 기획 환경 구성

~~~~text
네, 규칙 추가
~~~~

### p0058

2026-11-03 00:32 · 사용자 · 시니어 서비스 MVP 기획 환경 구성

~~~~text
다음 어떤것 진행해야해 ?
~~~~

### p0059

2026-11-03 00:33 · 사용자 · 시니어 서비스 MVP 기획 환경 구성

~~~~text
기획 먼저
~~~~

### p0063

2026-11-03 00:42 · 사용자 · 시니어 서비스 MVP 기획 환경 구성

~~~~text
코어에 추가 (Recommended)
~~~~

### p0064

2026-11-03 00:42 · 허브 지시 · A 코어 기획: Evenstay Core PRD·tech-design

~~~~text
승인된 코어 기획에 비상 연락처("급할 때 연락할 분")를 추가해 주세요. 사용자가 2026-11-03에 확정했습니다.
배경: B 결과 알림과 D 동의 체계를 맞추면서 정한 내용입니다. 119 신고나 병원 이송 때 직원이 거는 전화는 보호자 동의 항목(D "건강 소식")과 따로 두고, 입주 계약의 비상 연락처로 겁니다. 지금 코어에는 비상 연락처가 없습니다. D 쪽 라벨은 `../03-copywriting/ideas/family-consent-portal/names.md` 1-1, 문구는 같은 폴더 `copy.md` 2-4("비상 연락은 이 동의와 따로예요")에 있습니다.
할 일:
1. `tech-design.md`: 입주 계약에 딸린 비상 연락처 엔티티를 넣어 주세요. 사람(Person 참조), 관계, 연락처, 연락 순서, 동의·고지 기록을 갖습니다. 입주자 한 명에 여러 명을 둘 수 있습니다. ERD, 권한 표(누가 보고 고치는지), 다른 모듈에 줄 조회 API(B가 읽음), 10절 확장 지점에 반영합니다. GuardianLink(관계만)와 무엇이 다른지 한 줄로 적어 주세요. 비상 연락의 법적 근거(계약 때 받은 동의인지, 생명·신체가 급박할 때의 예외인지)는 [법률 검토]로 표시합니다.
2. `prd.md`, `user-stories.md`(계약 작성 스토리의 입력 항목과 인수 조건), `service-blueprint.md`(흐름 1), `handoff.md`(핵심 흐름이나 데이터 모델 요약)에서 필요한 곳만 고칩니다. 화면 문구가 필요하면 "[NEED: 카피]"로 남겨 두세요. 카피는 허브가 03-copywriting 세션에 맡깁니다.
3. 방법: 이 폴더의 스킬은 Skill 도구로 불러 씁니다. senior-lab 공통 규칙에 2026-11-03에 추가됐습니다. 예를 들어 스토리를 고칠 때는 `user-stories`, PRD를 고칠 때는 `create-prd`를 부릅니다. 이번에는 SKILL.md를 직접 읽어서 따르는 방식으로 대신하지 마세요.
4. 고친 문서는 상태 줄을 `상태: 승인(2026-11-03) · 변경: 2026-11-03 비상 연락처 추가(사용자 재확인 대기)`로 바꿔 주세요.
범위: `04-planning/ideas/pms-core-billing/` 안에서만 고칩니다. `shared/`와 `evenstay`는 건드리지 마세요. 다시 복사하는 일은 허브가 합니다. 끝나면 파일별로 고친 곳과 [NEED: 카피] 목록을 짧게 보고해 주세요.
~~~~

### p0065

2026-11-03 00:44 · 사용자 · 시니어 서비스 MVP 기획 환경 구성

~~~~text
이 디렉토리는 pm-skills 로 전체프로젝트 매니징 하는건 어때?
~~~~

### p0066

2026-11-03 00:45 · 사용자 · 시니어 서비스 MVP 기획 환경 구성

~~~~text
senior-lab 루트 + 선별 (Recommended)
~~~~

### p0067

2026-11-03 00:46 · 허브 지시 · ffd33f4b

~~~~text
Skill 도구로 쓸 수 있는 스킬 목록에 다음 이름이 있는지만 답해. 있으면 이름, 없으면 없음: pre-mortem, sprint-plan, retro, north-star-metric, create-prd, mom-test. 한 줄로.
~~~~

### p0070

2026-11-03 00:49 · 사용자 · 시니어 서비스 MVP 기획 환경 구성

~~~~text
00-hub로 옮기기
~~~~

### p0071

2026-11-03 00:50 · 허브 지시 · 7052356c

~~~~text
Skill 도구로 쓸 수 있는 스킬 목록에 다음 이름이 있는지만 답해. 있는 이름만 쉼표로 나열하고 없는 것은 "없음:" 뒤에 나열. 한 줄로: pre-mortem, sprint-plan, retro, north-star-metric, create-prd, mom-test
~~~~

### p0072

2026-11-03 00:50 · 사용자 · 197d2ab0

~~~~text
Skill 도구로 쓸 수 있는 스킬 목록에 다음 이름이 있는지만 답해. 있는 이름만 쉼표로 나열하고 없는 것은 "없음:" 뒤에 나열. 한 줄로: pre-mortem, sprint-plan, retro, north-star-metric, create-prd, mom-test
~~~~

### p0073

2026-11-03 00:56 · 사용자 · 시니어 서비스 MVP 기획 환경 구성

~~~~text
승인하고 다시 복사 (Recommended)
~~~~

### p0074

2026-11-03 00:56 · 사용자 · 시니어 서비스 MVP 기획 환경 구성

~~~~text
둘 다 승인 (Recommended)
~~~~

### p0075

2026-11-03 00:57 · 허브 지시 · 시니어 서비스 MVP 기획 환경 구성

~~~~text
`safety-signal-hub`(B, Evenstay Safety)를 기획해서 `ideas/safety-signal-hub/`에 7개 문서를 만들어 주세요: `strategy.md`, `service-blueprint.md`, `prd.md`, `user-stories.md`, `roadmap.md`, `tech-design.md`, `handoff.md`. 모든 문서 첫머리에 `상태: 초안`을 둡니다.

먼저 읽을 것
- 이 폴더 `CLAUDE.md`. "PRD에 반드시 들어갈 것", "코어 + 모듈 구조", "개발 인계"(safety-signal-hub → `evenstay/docs/safety/`) 절을 지킵니다. 상위 `../CLAUDE.md` 공통 규칙도 따릅니다.
- 승인된 카피: `../03-copywriting/ideas/safety-signal-hub/`(copy, names, product-marketing, value-prop). 보호자 쪽은 `../03-copywriting/ideas/family-consent-portal/copy.md` 4-4 "건강 소식"과 names.md 1-1.
- 코어 기준 모델(바꾸지 않음): `ideas/pms-core-billing/tech-design.md`. 특히 10절 확장 지점, 6절 권한, EmergencyContact, ADR-1~5를 봅니다. 형식은 같은 폴더의 코어 문서 7개를 참고합니다.
- 근거: `../02-ideation/outputs/shortlist.md`의 B 항목, `../01-research/outputs/problem-bank.md`(P-010, P-025, P-028), `../01-research/outputs/personas.md`.

확정된 것(바꾸지 말 것)
- 알림은 판단하지 않고 관찰된 사실과 시각만 씁니다. 상태 판단과 119 신고는 직원이 합니다. 등급은 즉시 확인 / 확인 필요 / 기록만입니다.
- 보호자에게 가는 결과는 D의 "건강 소식"(민감정보 별도 동의)으로 올라갑니다. 문자 머리말은 [Evenstay Family]이고, 문자에는 내용, "건강"이라는 말, 링크를 넣지 않습니다. 119나 이송 때 거는 전화는 코어의 비상 연락처로 하고, `EmergencyContactQuery`로 읽습니다.
- 모듈 경계(ADR-2): B는 자기 스키마 `safety`만 쓰고, 코어는 `core/api`와 이벤트로만 씁니다. 동의 여부는 D가 공개하는 API나 정책으로 묻습니다. D와의 인터페이스는 제안으로 적어 두면 D 기획 세션과 허브가 맞춥니다.
- 기술 방향: 프로토타입은 HTML·JS, MVP는 Next.js, DB는 PostgreSQL. 센서와 호출벨은 MVP에서 목업이나 시뮬레이터로 대신합니다.

이 세션에서 정할 것(제안과 대안을 함께 "확인할 것"에 적기)
- 직원이 회원이 동의한 건강 소식을 올리지 않을 수 있는지(B copy 2-8의 "보내지 않기"). D 기획 세션도 같은 질문을 받았으니 B 쪽 제안을 적어 주세요.
- copy.md에 남은 [미정] 4건: 확인 필요 등급을 넘기는 시간, 같은 회원의 신호를 묶는 시간 범위, 3차 호출 대상, 보호자 알림을 보내는 시각.

방법: 이 폴더의 스킬을 **Skill 도구로 불러** 순서대로 씁니다. product-strategy → service-blueprint → create-prd → user-stories → outcome-roadmap 순서이고, 북극성 지표가 필요하면 north-star-metric을 씁니다. SKILL.md를 읽고 따라 하는 것으로 대신하지 마세요. tech-design은 코어 tech-design 형식을 따릅니다. 문서의 `방법:` 줄에는 실제로 호출한 스킬만 적습니다. 다 쓰면 검토 에이전트로 문서 사이의 불일치와 코어와의 불일치를 한 번 점검합니다.

범위: `ideas/safety-signal-hub/` 안에서만 씁니다. `shared/`, 코어 문서, 카피 폴더, `~/ai/evenstay/`는 건드리지 마세요. 코어를 바꿔야 할 일이 생기면 "허브에 요청"으로 보고합니다. 끝나면 핵심 결정, 확인할 것, 허브에 요청할 것을 짧게 보고해 주세요.
~~~~

### p0076

2026-11-03 00:59 · 사용자 · 시니어 서비스 MVP 기획 환경 구성

~~~~text
3개 시작
~~~~

### p0077

2026-11-03 01:00 · 허브 지시 · B 기획: Evenstay Safety 안심 알림

~~~~text
Background (from the session that started this one):
senior-lab은 [지원 회사] Tech Lead / Senior Backend 지원용으로 시니어 레지던스 PMS 'Evenstay'를 기획하는 워크스페이스이고, 단계 폴더마다 필요한 스킬만 설치해 둡니다. 하나의 코어(pms-core-billing, 계약·청구, 2026-11-03 승인·인계) 위에 모듈 B(안심 알림), D(보호자 포털·동의), G(AI 비서), C(케어 단계 전환)를 얹는 모듈형 모놀리스입니다. B·D 카피는 2026-11-03에 승인됐고, 지금은 B 기획, D 기획, G 카피를 동시에 진행합니다. 공유 파일(shared/)은 허브 세션만 고칩니다. 사실에는 [사실]/[추정]/[가설]/[미정] 표시와 출처를 붙이고, 수치나 사례를 지어내지 않습니다.

Task:
`safety-signal-hub`(B, Evenstay Safety)를 기획해서 `ideas/safety-signal-hub/`에 문서 7개를 만들어 주세요: `strategy.md`, `service-blueprint.md`, `prd.md`, `user-stories.md`, `roadmap.md`, `tech-design.md`, `handoff.md`. 모든 문서 첫머리에 `상태: 초안`을 둡니다.

먼저 읽을 것
- 이 폴더의 `CLAUDE.md`에서 "PRD에 반드시 들어갈 것", "코어 + 모듈 구조", "개발 인계"(safety-signal-hub → `evenstay/docs/safety/`) 절, 그리고 상위 `../CLAUDE.md`의 공통 규칙.
- 승인된 카피: `../03-copywriting/ideas/safety-signal-hub/` 전체(copy, names, product-marketing, value-prop). 보호자 쪽은 `../03-copywriting/ideas/family-consent-portal/copy.md` 4-4 "건강 소식"과 `names.md` 1-1.
- 코어 기준 모델(바꾸지 않음): `ideas/pms-core-billing/tech-design.md`. 10절 확장 지점, 6절 권한, EmergencyContact, ADR-1~5를 특히 봅니다. 문서 형식은 같은 폴더의 코어 문서 7개를 참고합니다.
- 근거: `../02-ideation/outputs/shortlist.md`의 B 항목, `../01-research/outputs/problem-bank.md`의 P-010·P-025·P-028, `../01-research/outputs/personas.md`.

이미 정한 것(바꾸지 말 것)
- 알림에는 판단을 쓰지 않고 관찰한 사실과 시각만 씁니다. 상태 판단과 119 신고는 직원이 합니다. 등급은 즉시 확인 / 확인 필요 / 기록만 세 가지입니다.
- 보호자에게 가는 결과는 D의 "건강 소식"(민감정보라 별도 동의)으로 올라갑니다.
  - 문자 머리말은 [Evenstay Family]입니다.
  - 문자에는 내용도, "건강"이라는 말도, 링크도 넣지 않습니다.
  - 119 신고나 병원 이송 때 거는 전화는 코어의 비상 연락처로 겁니다. 연락처는 `EmergencyContactQuery`로 읽습니다.
- 모듈 경계(ADR-2)
  - B는 자기 스키마 `safety`에만 씁니다. 코어는 `core/api`와 이벤트로만 씁니다.
  - 회원이 동의했는지는 D가 공개하는 API나 정책으로 묻습니다.
  - D와 주고받는 인터페이스는 제안으로 적어 주세요. D 기획 세션과 허브가 맞춥니다.
- 기술 방향: 프로토타입은 HTML·JS, MVP는 Next.js, DB는 PostgreSQL입니다. 센서와 호출벨은 MVP에서 목업이나 시뮬레이터로 대신합니다.

이 세션에서 정할 것(각 문서 "확인할 것"에 제안과 대안을 함께 적기)
- 회원이 동의한 건강 소식을 직원이 보호자에게 올리지 않아도 되는지(B copy 2-8의 "보내지 않기" 버튼). D 기획 세션도 같은 질문을 받았으니 B 쪽 제안을 적습니다.
- copy.md에 남은 [미정] 4건: 확인 필요 등급을 넘기는 시간, 같은 회원의 신호를 묶는 시간 범위, 3차 호출 대상, 보호자 알림을 보내는 시각.

방법
- 이 폴더의 스킬을 **Skill 도구로 불러** 순서대로 씁니다: product-strategy → service-blueprint → create-prd → user-stories → outcome-roadmap. 북극성 지표가 필요하면 north-star-metric을 씁니다. SKILL.md를 읽고 따라 하는 것으로 대신하지 않습니다.
- tech-design은 코어 tech-design의 형식을 따릅니다.
- 문서의 `방법:` 줄에는 실제로 호출한 스킬만 적습니다.
- 다 쓰면 검토 에이전트로 문서끼리 어긋나는 곳과 코어와 어긋나는 곳을 한 번 점검합니다.

범위
- `ideas/safety-signal-hub/` 안에만 씁니다.
- `shared/`, 코어 문서, 카피 폴더, `~/ai/evenstay/`는 건드리지 않습니다. 코어를 바꿔야 하면 "허브에 요청"으로 보고합니다.
- 끝나면 핵심 결정, 확인할 것, 허브에 요청할 것만 짧게 보고해 주세요.

Shared notes folder for this group of sessions (outside the repo; read siblings' notes there, leave hand-over notes or large findings there instead of pasting them into messages): ~/Library/Application Support/Claude/side-session-notes/local_4ea3b11d-fd3a-4c6e-847f-d3162e709e19
~~~~

### p0078

2026-11-03 01:00 · 사용자 · 시니어 서비스 MVP 기획 환경 구성

~~~~text
pm-skills 사용중이야?
~~~~

### p0079

2026-11-03 01:00 · 허브 지시 · D 기획: Evenstay Family 보호자 포털·동의

~~~~text
Background (from the session that started this one):
senior-lab은 [지원 회사] Tech Lead / Senior Backend 지원용으로 시니어 레지던스 PMS 'Evenstay'를 기획하는 워크스페이스입니다. 단계 폴더마다 필요한 스킬만 따로 설치해 둡니다. 구조는 코어 하나(pms-core-billing, 계약·청구, 2026-11-03 승인·인계) 위에 모듈 B(안심 알림), D(보호자 포털·동의), G(AI 비서), C(케어 단계 전환)를 얹는 모듈형 모놀리스입니다. B·D 카피는 2026-11-03에 승인됐고, 지금은 B 기획, D 기획, G 카피를 동시에 진행합니다. 공유 파일(shared/)은 허브 세션만 고칩니다. 사실에는 [사실]/[추정]/[가설]/[미정] 표시와 출처를 붙이고, 가짜 수치나 사례를 지어내지 않습니다. 법적 효력이 있는 문구는 법률 검토 전 초안으로 표시합니다.

Task:
`family-consent-portal`(D, Evenstay Family)을 기획해서 `ideas/family-consent-portal/`에 문서 7개를 만들어 주세요: `strategy.md`, `service-blueprint.md`, `prd.md`, `user-stories.md`, `roadmap.md`, `tech-design.md`, `handoff.md`. 모든 문서 첫머리에 `상태: 초안`을 둡니다.

먼저 읽을 것
- 이 폴더 `CLAUDE.md`의 "PRD에 반드시 들어갈 것", "코어 + 모듈 구조", "개발 인계" 절(family-consent-portal → `evenstay/docs/family/`)과 상위 `../CLAUDE.md`의 공통 규칙.
- 승인된 카피: `../03-copywriting/ideas/family-consent-portal/` 전체. 특히 2절 동의, 3절 AI 고지, 4절 보호자 화면, 5절 금전 경계, 7절 법률 검토 목록을 봅니다. B 쪽 맞춤은 `../03-copywriting/ideas/safety-signal-hub/copy.md` 2-8·3절.
- 코어 기준 모델(바꾸지 않음): `ideas/pms-core-billing/tech-design.md`의 6-3 `authorize()`와 확장 정책 규칙, GuardianLink, Representative, EmergencyContact, 10절 확장 지점, ADR-1~5. 문서 형식은 같은 폴더의 코어 문서 7개를 따릅니다.
- 근거: `../02-ideation/outputs/shortlist.md`의 D 항목(I-18, I-19, I-31, I-42), `../02-ideation/drafts/ai-assistant.md`(G가 D의 고지·동의를 씀), `../01-research/outputs/problem-bank.md`의 P-023·P-024·P-041·P-048·P-053·P-054.

이미 정한 것(바꾸지 말 것)
- 동의의 주인은 회원입니다.
  - 보호자는 회원 화면에서 "함께 보실 분"으로 부르고, 기본값은 "안 보여요"입니다.
  - 직원이 대신 입력할 때 범위를 넓히면 회원이 확인해야 적용되고, 좁히면 바로 적용됩니다.
  - 보호자 화면은 못 보는 이유를 구분해서 보여 주지 않습니다.
- 동의 항목은 생활 소식, 일정, 청구서, 건강 소식 4개입니다. 건강 소식은 민감정보라 별도 동의를 받고, B 결과 알림이 여기에 들어갑니다.
  - 문자 머리말은 [Evenstay Family]이고, 문자에는 내용, "건강"이라는 말, 링크를 넣지 않습니다.
  - 119·병원 이송 전화는 동의와 따로, 코어 비상 연락처로 겁니다.
- 보호자 청구서 화면은 D가 엽니다. 코어는 청구서 API만 줍니다.
- 금전 부탁은 "직원이 할 수 있는 일 / 넘길 곳"으로만 다룹니다. 운영사는 돈을 대신 다루지 않고 금융상품을 권하지 않습니다.
- 생활 소식에 "AI가 첫 글을 쓰고 ○○○ 직원이 확인했어요"를 붙입니다. D의 AI 고지는 G가 그대로 씁니다.
- 모듈 경계(ADR-2)
  - D는 자기 스키마 `family`에만 씁니다.
  - 권한은 코어 `authorize()`에 확장 정책을 등록해 "허용"만 더합니다. 코어가 범위 밖이라고 거부한 것은 뒤집지 못합니다.
  - B와 G가 동의를 물을 공개 API(예: 이 회원의 이 소식을 이 보호자가 볼 수 있는가)를 D가 정의합니다.
- 기술 방향: 프로토타입은 HTML·JS, MVP는 Next.js, DB는 PostgreSQL. 문자 발송은 MVP에서 목업이나 로그로 대신합니다.

이 세션에서 정할 것(제안과 대안을 "확인할 것"에 함께 적기)
- 회원이 동의한 건강 소식을 직원이 보호자에게 올리지 않을 수 있는지(B copy 2-8의 "보내지 않기"). 동의 체계의 주인인 D 쪽 제안을 적어 주세요. B 기획 세션도 같은 질문을 받았고, 허브가 두 제안을 비교해 맞춥니다.
- copy.md 9절의 남은 [NEED]·[미정] 중 기획에서 정할 수 있는 것: 초대 링크 유효기간, 건강정보 제공 기록 보관 기간의 제안값 등. 법률 검토 항목은 그대로 두고 목록만 정리합니다.

방법
- 이 폴더의 스킬을 **Skill 도구로 불러** 순서대로 씁니다: product-strategy → service-blueprint → create-prd → user-stories → outcome-roadmap. 북극성 지표가 필요하면 north-star-metric을 씁니다. SKILL.md를 읽고 따라 하는 것으로 대신하지 않습니다.
- tech-design은 코어 형식을 따릅니다. `방법:` 줄에는 실제로 호출한 스킬만 적습니다.
- 다 쓰면 검토 에이전트로 문서 사이와 코어와의 불일치를 한 번 점검합니다.

범위: `ideas/family-consent-portal/` 안에서만 씁니다. `shared/`, 코어 문서, 카피 폴더, `~/ai/evenstay/`는 건드리지 않습니다. 코어를 바꿔야 할 일이 생기면 "허브에 요청"으로 보고합니다. 끝나면 핵심 결정, 확인할 것, B·G에 공개할 API 요약, 허브에 요청할 것을 짧게 보고해 주세요.

Shared notes folder for this group of sessions (outside the repo; read siblings' notes there, leave hand-over notes or large findings there instead of pasting them into messages): ~/Library/Application Support/Claude/side-session-notes/local_4ea3b11d-fd3a-4c6e-847f-d3162e709e19
~~~~

### p0081

2026-11-03 01:03 · 사용자 · 시니어 서비스 MVP 기획 환경 구성

~~~~text
00-hub 스킬을 쓰려면 Claude 앱에서 ~/ai/senior-lab/00-hub 폴더로 새 세션을 열어 허브를 옮겨
~~~~

### p0082

2026-11-03 01:17 · 에이전트 지시 · B 기획: Evenstay Safety 안심 알림

~~~~text
You are reviewing 7 Korean planning documents for a portfolio project. READ-ONLY review: do not edit any files. Report in Korean.

Documents under review (all draft): ~/ai/senior-lab/04-planning/ideas/safety-signal-hub/ — strategy.md, service-blueprint.md, prd.md, user-stories.md, roadmap.md, tech-design.md, handoff.md

Reference sources (approved, must NOT be contradicted; do not suggest changing them):
- Core domain model: ~/ai/senior-lab/04-planning/ideas/pms-core-billing/tech-design.md (esp. sections 2, 6, 8-2, 8-3, 10, ADR-1~5) and pms-core-billing/prd.md section 9 (seed data)
- Approved copy: ~/ai/senior-lab/03-copywriting/ideas/safety-signal-hub/copy.md, names.md, product-marketing.md, value-prop.md
- D's health news: ~/ai/senior-lab/03-copywriting/ideas/family-consent-portal/copy.md section 4-4 and names.md section 1-1
- Workspace rules: ~/ai/senior-lab/CLAUDE.md and ~/ai/senior-lab/04-planning/CLAUDE.md ("PRD에 반드시 들어갈 것", "코어 + 모듈 구조", "기술 설계", "개발 인계")

Fixed decisions the docs must respect (verify, don't relitigate):
- Alerts state only observed facts and times; staff judge state and call 119. Severities: 즉시 확인 / 확인 필요 / 기록만.
- Guardian results go into D's "건강 소식" (separate consent). SMS header [Evenstay Family]; SMS has no content, no word "건강", no link. Calls at 119/hospital use core EmergencyContact via EmergencyContactQuery.
- B writes only to schema `safety`; core only via core/api and events; consent asked of D's API/policy; D interface written as proposals.
- Prototype HTML·JS, MVP Next.js, PostgreSQL; devices are simulated.

Check and report:
1. Inconsistencies BETWEEN the 7 docs (feature IDs F1~F19 vs story IDs US-01~22 mappings, P0/P1 assignments, numbers like 5분/15분/30분, seed names/rooms/times, entity/event names, permission table vs PRD role table, 확인할 것 numbering cross-references like "prd.md 확인할 것 2").
2. Conflicts with the core tech-design (entity names, API names/signatures, roles, ADRs, event payloads) — and whether anything claimed as "[사실, 코어 …]" is actually in the core doc.
3. Conflicts with approved copy (labels, statuses, SMS text, timeline 02:10/02:40:03/02:40:08/02:45:03/02:46/02:49/02:58/08:00, action choices).
4. Missing required items per 04-planning/CLAUDE.md (PRD must-haves, tech-design must-haves, handoff must-haves), and whether each doc starts with "상태: 초안" and has a 방법: line.
5. Any invented facts/numbers presented as [사실] without source, or forbidden judgment words (낙상/응급/위험/감지했습니다/배회) used in UI text proposals (using them in "don't use" lists is fine).

Output: a numbered list of concrete findings, each with file:line (or section), what is wrong, and a suggested fix. Rank most severe first. Skip style nitpicks. Keep it under ~800 words.
~~~~

### p0083

2026-11-03 01:17 · 에이전트 지시 · D 기획: Evenstay Family 보호자 포털·동의

~~~~text
읽기 전용 검토다. 파일을 고치지 말고 발견만 보고해라. 한국어로 답한다.

대상: ~/ai/senior-lab/04-planning/ideas/family-consent-portal/ 의 7개 문서(strategy.md, service-blueprint.md, prd.md, user-stories.md, roadmap.md, tech-design.md, handoff.md). 시니어 레지던스 PMS 'Evenstay'의 모듈 D(보호자 포털·동의) 기획 초안이다.

기준 문서(이것들은 바뀌지 않는 기준이다):
- 코어 공통 모델: ~/ai/senior-lab/04-planning/ideas/pms-core-billing/tech-design.md (특히 2-2 엔티티 GuardianLink·EmergencyContact·Representative·UserAccount·AuditLog, 6절 역할·권한과 6-3 authorize() 순서, 8-2 내부 API, 8-3 이벤트, 10절 확장 지점, ADR-1~5, 12절). 파일이 커서 offset/limit로 나눠 읽어라.
- 승인된 카피: ~/ai/senior-lab/03-copywriting/ideas/family-consent-portal/copy.md, names.md
- B 카피: ~/ai/senior-lab/03-copywriting/ideas/safety-signal-hub/copy.md 2-8절과 3절
- 규칙: ~/ai/senior-lab/CLAUDE.md, ~/ai/senior-lab/04-planning/CLAUDE.md

이미 확정되어 기획이 따라야 하는 것(어기면 높은 심각도):
- 동의 주인은 회원. 보호자는 회원 화면에서 "함께 보실 분", 기본값 "안 보여요". 직원 대신 입력 시 넓히면 회원 확인 후 적용, 좁히면 즉시. 보호자 화면은 못 보는 이유를 구분하지 않음.
- 항목 4개(생활 소식, 일정, 청구서, 건강 소식). 건강 소식은 별도 동의, B 결과 알림 포함. 문자 머리말 [Evenstay Family], 문자에 내용·"건강"·링크 없음(초대 문자만 링크). 119·병원 이송 전화는 동의와 따로 코어 비상 연락처로.
- 보호자 청구서 화면은 D, 코어는 청구서 API만.
- 금전 부탁은 "직원이 할 수 있는 일 / 넘길 곳"으로만. 운영사는 돈을 대신 다루지 않고 금융상품을 권하지 않음.
- 생활 소식에 "AI가 첫 글을 쓰고 ○○○ 직원이 확인했어요". D의 AI 고지를 G가 그대로 씀.
- 모듈 경계: D는 family 스키마에만 씀. 권한은 코어 authorize()에 확장 정책으로 "허용"만 더하고 코어 거부를 못 뒤집음. B·G가 쓸 동의 공개 API는 D가 정의.
- 프로토타입 HTML·JS, MVP Next.js, DB PostgreSQL. 문자는 MVP에서 목업·로그.
- 모든 문서 첫머리 "상태: 초안". `방법:` 줄에는 실제 호출한 스킬만(strategy=product-strategy, service-blueprint=service-blueprint, prd=create-prd, user-stories=user-stories, roadmap=outcome-roadmap, tech-design·handoff는 스킬 없음).
- 사실에는 [사실]/[추정]/[가설]/[미정] 표시와 출처. 가짜 수치·사례 금지. 법적 효력 문구는 법률 검토 전 초안 표시.

점검할 것:
1. 7개 문서 사이의 불일치: 기능 ID(F1~F17)와 스토리 ID(US-01~19) 대응, 우선순위(P0/P1), 제안값(초대 7일, 보관 3년, 회신 2영업일, 조용한 시간 22~08시, 범위 넓어질 때만 알림 등), 시드 이름(김정희, 이수진, 이민호, 최민수, 박지호, 김말순, 김태호), 금액, 엔티티·상태 코드 이름, API 이름, 확인할 것 번호 상호 참조가 서로 맞는지.
2. 코어와의 불일치: 코어 엔티티·필드·역할 코드·API·이벤트 이름을 잘못 쓰거나, 코어에 없는 것을 있는 것처럼 쓰거나, 코어를 바꾸는 내용을 "허브에 요청" 없이 확정처럼 쓴 곳. authorize() 순서와 확장 정책 규칙 위반.
3. 승인된 카피·names.md와 어긋나는 라벨·상태·문구. (카피를 바꾸자는 제안은 "카피 수정 요청"으로 표시돼 있으면 괜찮다.)
4. 위 확정 사항 위반, 근거 표시 누락, 지어낸 것처럼 보이는 수치·출처.
5. 문서 안 논리 모순(예: 같은 문서 두 곳에서 다른 규칙).

보고 형식: 심각도(높음/중간/낮음)별로, 각 항목에 파일:줄, 무엇이 어긋나는지, 기준 문서의 근거(파일:줄), 고칠 방향 한 줄. 사소한 문체는 빼고 결정에 영향 있는 것만. 마지막에 "문제 없음으로 확인한 것"을 짧게.
~~~~

### p0084

2026-11-03 01:18 · 허브 지시 · D 기획: Evenstay Family 보호자 포털·동의

~~~~text
검토 결과를 반영할 때 이 문제도 함께 다뤄 주세요. G 카피 세션이 찾은 것입니다.
- D 동의 항목 `SCHEDULE`(일정)의 설명은 "병원 가시는 날, 프로그램, 면회 예약"입니다(`../03-copywriting/ideas/family-consent-portal/names.md` 17줄). 그런데 코어에는 이 데이터가 없습니다. 코어 일정은 `ContractQuery.keyDates`(입주일, 계약 만료일, 청구 발행일, 퇴거 예정일)뿐이고, `SiteSchedule`은 두지 않기로 2026-11-03에 확정했습니다.
- D 기획에서 보호자 "일정" 화면이 MVP에서 무엇을 보여 줄지 정해 주세요. 선택지는 이렇습니다. (가) keyDates만 보여 준다. (나) 면회 예약 같은 D 자체 데이터를 `family` 스키마에 둔다. (다) MVP에서는 빼고 Next로 미룬다. 제안과 대안을 "확인할 것"에 적고, 카피 설명 줄을 바꿔야 하면 "허브에 요청"으로 남겨 주세요. 카피 폴더는 고치지 않습니다.
- 참고로 G는 D 3절 AI 고지를 그대로 썼습니다. 그런데 그 고지는 생활 소식 초안만 다루고 비서(직원 검토 없이 바로 답함)는 다루지 않습니다. 고지 문구 수정은 사용자 확인 뒤 허브가 따로 처리합니다. D 기획의 AI 고지·감사 설계(I-42)에서는 비서도 대상에 들어간다고 보고 써 주세요.
~~~~

### p0085

2026-11-03 01:19 · 사용자 · 시니어 서비스 MVP 기획 환경 구성

~~~~text
코어에 추가 (Recommended)
~~~~

### p0086

2026-11-03 01:19 · 사용자 · 시니어 서비스 MVP 기획 환경 구성

~~~~text
D 고지에 비서 추가 (Recommended)
~~~~

### p0087

2026-11-03 01:20 · 허브 지시 · A 코어 기획: Evenstay Core PRD·tech-design

~~~~text
코어 청구에 납부 기한을 넣고 keyDates를 나눠 주세요. 사용자가 2026-11-03에 확정했습니다.
배경: G 카피 세션이 찾았습니다. Invoice에 납부 기한 필드가 없고, `ContractQuery.keyDates`의 "청구 발행일"이 지난 발행일인지 다음 발행 예정일인지 정해지지 않았습니다. "다음 납부일이 언제예요?"는 G 데모의 대표 질문입니다.
할 일
1. `tech-design.md`: Invoice에 `due_date`(납부 기한)를 넣습니다. 정하는 규칙(예: 발행일 + N일, 사업장 설정)은 요금 규칙과 같은 방식으로 사업장 설정에 두고, 기본값은 제안으로 [미정]이라고 적습니다. keyDates는 입주일, 계약 만료일, 최근 청구 발행일, 최근 청구 납부 기한, 다음 청구 예정일, 퇴거 예정일로 나눕니다. 다음 청구 예정일은 청구 주기 규칙에서 계산합니다. ERD, API 표, 10절 G 행에 반영합니다. 미납 판정과 연체 처리는 MVP 범위 밖으로 둡니다(이미 그렇다면 그대로).
2. `prd.md`, `user-stories.md`(청구 생성·발행, 회원 청구서), 시드(납부 기한 예시)에서 필요한 곳만 고칩니다. 화면 문구는 "[NEED: 카피]"로 남깁니다.
3. 방법: 이 폴더의 스킬을 Skill 도구로 불러 씁니다. PRD는 `create-prd`, 스토리는 `user-stories`로 고칩니다. tech-design은 지난번처럼 직접 고쳐도 됩니다.
4. 고친 문서의 상태 줄 끝에 "· 변경: 2026-11-03 납부 기한·keyDates(사용자 재확인 대기)"를 붙입니다.
범위: `ideas/pms-core-billing/` 안에서만 고칩니다. shared/, evenstay, 카피는 건드리지 마세요. 끝나면 파일별로 고친 곳과 [NEED: 카피] 목록을 짧게 보고해 주세요.
~~~~

### p0091

2026-11-03 01:33 · 사용자 · 시니어 서비스 MVP 기획 환경 구성

~~~~text
둘 다 승인 (Recommended)
~~~~

### p0092

2026-11-03 01:33 · 사용자 · 시니어 서비스 MVP 기획 환경 구성

~~~~text
코어 keyDates만 (Recommended)
~~~~

### p0093

2026-11-03 01:33 · 사용자 · 시니어 서비스 MVP 기획 환경 구성

~~~~text
이유 2가지만 (Recommended)
~~~~

### p0094

2026-11-03 01:33 · 사용자 · 시니어 서비스 MVP 기획 환경 구성

~~~~text
코어 v1.1로 한번에 (Recommended)
~~~~

### p0095

2026-11-03 01:34 · 허브 지시 · A 코어 기획: Evenstay Core PRD·tech-design

~~~~text
코어 v1.1 보강을 진행해 주세요. B·D 기획이 요청한 코어 변경을 한 번에 반영하는 작업입니다(사용자 확정, 2026-11-03). 앞의 납부 기한 변경은 사용자가 재승인했습니다.
요청 원문(직접 읽어 주세요)
- B: `ideas/safety-signal-hub/tech-design.md` "확인할 것" 1~4-1, 6과 10-2절
- D: `ideas/family-consent-portal/tech-design.md` HUB-1~HUB-11과 8-2절(D 공개 API)
허브가 합친 목록(겹치는 것은 하나로)
1. ADR-2 보강: 모듈이 다른 모듈의 `api/`에 의존하는 것을 허용(domain·infra는 계속 금지). 순환 의존 금지. 모듈이 자기 행동에 대한 정책을 `registerPolicy`로 등록할 수 있게 함(B 요청, D HUB-1).
2. 역할·직무: SITE_MANAGER(사업장 책임자) 역할(B), 직원 직무 구분(간호·생활지원 등, D HUB-7), GUARDIAN 범위 정의와 UserAccount.kind GUARDIAN(D HUB-2). 대리 범위 대응표에 D 행동 추가(D HUB-9).
3. 보호자 연결: `GuardianCommand.link/unlink`(D HUB-3). 관계 코드 대응 확인(D HUB-4).
4. 공유 인프라: Notifier를 `platform/`에 두고 모듈이 공유(B, D HUB-6). 데모 시계 `Clock.now()`와 시각 단위 조작(B). 감사 범주 추가(D HUB-8).
5. 조회 API: 직원 목록 조회(B), 식사 조회(D HUB-5), `EmergencyContactQuery`에 actor 인자(B).
6. 이벤트 payload: ContractTerminationRequested·ContractSettled·ContractSucceeded에 계약 당사자 residentIds(B, D HUB-10). EmergencyContactsChanged 구독자 목록에서 "B(캐시 갱신)" 삭제(B).
7. 시드 보강: 직원 3명, 장녀 김수진 GuardianLink(가상), 호실 배치(B). B와 D가 같은 데모 회원·호실을 쓰도록 맞춤(D 카피 요청 13). B 제안: 대리인 김태호에게 MANAGE_GUARDIAN_ACCESS를 주지 않음.
8. 문서 동기화(D HUB-11): 8-2 EmergencyContactQuery 소비자에 D 추가, 2-1 GuardianLink 회원 라벨("함께 보실 분"), "건강 이벤트" 라벨.
이미 정한 것(반영만): 건강 소식을 올리지 않는 경우는 MEMBER_REQUEST·NOT_A_HEALTH_EVENT 두 가지(D 소관이므로 코어는 감사 범주만). 보호자 "일정"은 keyDates만.
방법: prd는 `create-prd`, 스토리는 `user-stories`, 블루프린트는 `service-blueprint`를 Skill 도구로 불러 고칩니다. tech-design·handoff는 직접 고칩니다. 새 ADR이 필요하면 ADR-6으로 추가합니다. 화면 문구가 필요한 곳은 "[NEED: 카피]"로 둡니다.
고친 문서의 상태 줄 끝에 "· 변경: 2026-11-03 v1.1 보강(사용자 재확인 대기)"를 붙입니다.
범위: `ideas/pms-core-billing/`만 고칩니다. B·D 문서와 shared/, evenstay는 건드리지 않습니다. B·D 요청 중 받아들이지 않거나 바꿔 받아들인 것은 이유와 함께 보고해 주세요. 끝나면 항목별 처리 결과와 [NEED: 카피] 목록을 짧게 보고해 주세요.
~~~~

### p0096

2026-11-03 01:34 · 허브 지시 · B 기획: Evenstay Safety 안심 알림

~~~~text
허브와 사용자가 B·D 사이의 결정을 확정했습니다(2026-11-03). B 기획 문서에 반영해 주세요.
1. 보내지 않기: 직원 재량 버튼은 없습니다. 건강 소식을 올리지 않는 경우는 두 가지입니다. ① MEMBER_REQUEST(회원이나 대리인이 "이번 일은 알리지 말아 줘"라고 함. 들은 직원과 시각 필수, 회원 화면에 표시) ② NOT_A_HEALTH_EVENT(다른 회원 기록, 중복, 기기 시험). 119·병원 이송 기록 건은 ①만 가능합니다. 운영 매니저가 매주 확인합니다.
2. B→D 인터페이스는 D가 공개한 API를 기준으로 맞춥니다. D `ideas/family-consent-portal/tech-design.md` 8-2절의 `FamilyConsentQuery.canView`/`viewersOf`, `HealthFeedCommand.post`/`withhold`(reasonCode 두 가지), 이벤트 `HealthEventWithheld`입니다. B가 제안했던 D1~D7 중 D 안과 다른 것은 D 안을 따르고, B에 꼭 필요한데 D에 없는 것만 "확인할 것"에 남겨 주세요. 예를 들어 문장을 누가 보관하는지는 B 제안(B만 보관)과 D 안(`post`에 body)이 다릅니다. 둘 중 하나로 정해서 제안해 주세요.
3. 코어 요청은 허브가 합쳐 A 세션에 v1.1 보강으로 맡겼습니다. B 문서의 코어 요청 항목에는 "코어 v1.1 반영 대기"라고 적어 주세요.
방법: 고칠 문서에 맞는 스킬(create-prd, user-stories, service-blueprint)을 Skill 도구로 불러 씁니다. tech-design·handoff는 직접 고칩니다. 상태는 초안을 유지합니다.
범위: `ideas/safety-signal-hub/`만 고칩니다. 끝나면 바뀐 곳과 D와 아직 다른 점만 짧게 보고해 주세요.
~~~~

### p0097

2026-11-03 01:34 · 허브 지시 · D 기획: Evenstay Family 보호자 포털·동의

~~~~text
허브와 사용자가 다음을 확정했습니다(2026-11-03). D 기획 문서에 반영해 주세요.
1. 보내지 않기: D 제안을 채택합니다. 직원 재량 버튼은 두지 않고, MEMBER_REQUEST·NOT_A_HEALTH_EVENT 두 가지만 허용하며 운영 매니저가 매주 확인합니다. B 제안에서 하나를 더 받습니다. 119·병원 이송이 기록된 건은 MEMBER_REQUEST로만 올리지 않을 수 있습니다. prd 12절과 확인할 것 1을 결정으로 바꿔 주세요.
2. 일정 항목: (가) MVP는 코어 keyDates만 씁니다. 병원 일정은 일정 항목에서 뺍니다. 면회 예약은 Next로 미룹니다. keyDates는 6개입니다(코어 tech-design 참고: moveInDate, contractEndDate, lastInvoiceIssuedOn, lastInvoiceDueDate, nextInvoiceScheduledOn, moveOutDate).
3. AI 고지: D copy.md 3절이 v2(비서 포함)로 재승인됐습니다. AiNotice purpose의 LIFE_REPORT·ASSISTANT 구분이 v2 문구와 맞는지 확인해 주세요.
4. HUB-1~11은 허브가 B 요청과 합쳐 A 세션에 코어 v1.1 보강으로 맡겼습니다. D 문서에는 "코어 v1.1 반영 대기"라고 적어 주세요.
5. B 기획 세션에 D 8-2 API를 기준으로 맞추라고 전했습니다. B 문장 보관 위치(B만 보관 vs `post`에 body)는 B가 제안합니다. 결과가 오면 허브가 전달합니다.
방법: 문서에 맞는 스킬(create-prd, user-stories 등)을 Skill 도구로 불러 고칩니다. tech-design·handoff는 직접 고칩니다. 상태는 초안을 유지합니다.
범위: `ideas/family-consent-portal/`만 고칩니다. 끝나면 바뀐 곳만 짧게 보고해 주세요.
~~~~

### p0100

2026-11-03 01:35 · 사용자 · 시니어 서비스 MVP 기획 환경 구성

~~~~text
pm-skills 도 사용중이야?
~~~~

### p0101

2026-11-03 01:40 · 사용자 · 시니어 서비스 MVP 기획 환경 구성

~~~~text
동결 후 프로토타입 (Recommended)
~~~~

### p0102

2026-11-03 01:40 · 사용자 · 시니어 서비스 MVP 기획 환경 구성

~~~~text
201호 이은숙 (Recommended)
~~~~

### p0103

2026-11-03 01:40 · 사용자 · 시니어 서비스 MVP 기획 환경 구성

~~~~text
세 가지 모두 승인 (Recommended)
~~~~

### p0104

2026-11-03 01:41 · 사용자 · 시니어 서비스 MVP 기획 환경 구성

~~~~text
구현은 나중에 할거야 기획까지만 마무리해
~~~~

### p0105

2026-11-03 01:42 · 허브 지시 · A 코어 기획: Evenstay Core PRD·tech-design

~~~~text
코어 v1.1은 사용자가 재승인했고 evenstay/docs/core에 다시 복사했습니다. 이어서 통합 데모 주인공이 확정됐습니다(사용자, 2026-11-03).
- 주인공은 A동 201호 이은숙입니다. 부부 계약 → 청구 → 사별 승계 → 1인 거주로 이어지는 코어 이야기 위에 B(혼자 지내게 된 뒤의 밤사이 신호), D(건강 소식·청구서를 보는 보호자), G(비서 질문)를 같은 사람에게 붙입니다.
- 보호자 연결: 딸 김지민(CHILD)을 이은숙의 GuardianLink로 시드에 넣습니다. 김지민은 이미 비상 연락처 1순위입니다. 아들 김태호는 대리인(청구서 확인·결제만)으로 그대로 두고, GuardianLink를 줄지는 D 시드에 맡깁니다.
- 김말순·김정희 세트는 배경 회원으로 남겨도 됩니다. 주인공 줄에서는 빼 주세요.
- prd 확인할 것 8을 결정으로 바꾸고 9절 시드와 데모 표에 반영합니다. B·D 모듈 장면이 승계(2026-11-10) 뒤에 온다는 점을 시드 설명에 한 줄 적어 주세요.
- SITE_MANAGER 승인 권한(확인할 것 13)은 [미정]으로 둡니다.
방법: prd는 `create-prd` 스킬을 Skill 도구로 불러 고칩니다. 상태 줄 끝에 "· 변경: 2026-11-03 데모 주인공(사용자 확정)"을 붙입니다(재확인 대기 아님).
범위: `ideas/pms-core-billing/`만 고칩니다. 끝나면 바뀐 시드 줄만 짧게 보고해 주세요.
~~~~

### p0106

2026-11-03 01:42 · 허브 지시 · B 기획: Evenstay Safety 안심 알림

~~~~text
남은 세 가지에 대한 결정을 전합니다(2026-11-03).
1. 코어 v1.1이 재승인됐습니다. "코어 v1.1 반영 대기"를 "반영됨"으로 바꾸고, B가 쓰는 코어 API 이름이 실제 코어 tech-design 8-2·10절과 같은지 맞춰 주세요. 예: GuardianQuery.guardiansOf, StaffQuery.listStaff, EmergencyContactQuery(actor), Clock.now(), Notifier(platform). 코어가 요청을 바꿔 받아들인 것이 2건 있습니다. registerPolicy는 자기 이름공간만 등록할 수 있고, 다른 모듈이 api에 "D 동의로 연다"고 선언한 행동만 예외입니다. EmergencyContactQuery 소비자는 B뿐입니다.
2. 데모 주인공을 A동 201호 이은숙으로 확정했습니다(사용자). 이은숙은 남편 김한결이 사별한 뒤(2026-11-10 승계) 혼자 지냅니다. B 데모 장면은 그 뒤 날짜로 옮기고, 김말순·장녀 김수진을 이은숙·딸 김지민으로 바꿉니다. 김지민은 건강 소식을 보는 보호자이자 비상 연락처 1순위입니다. 아들 김태호는 대리인(청구서·결제)입니다. B 시드의 호실과 기기 배치도 이에 맞춥니다.
3. 문자 예정 시각은 B 제안을 채택했습니다(허브 결정). D `post` 결과에 `noticeSendAt`을 더하고, 미리보기용 `nextSendAt(siteId, at)` 조회를 엽니다. D 기획 세션에도 같은 내용을 전달했습니다. "D와 아직 다른 점" 1을 해결로 바꿉니다.
B 카피 2-8은 이미 "올리지 않는 경우 두 가지"로 고쳐 재승인됐습니다. 카피 요청 3은 해결로 표시합니다.
방법: 문서에 맞는 스킬을 Skill 도구로 불러 고칩니다. 마지막에 검토 에이전트로 B 문서 7개와 코어 v1.1, D 8-2절 사이의 불일치를 한 번 점검합니다. 상태는 초안을 유지합니다.
범위: `ideas/safety-signal-hub/`만 고칩니다. 끝나면 남은 [미정]과 허브 요청만 짧게 보고해 주세요.
~~~~

### p0107

2026-11-03 01:42 · 허브 지시 · D 기획: Evenstay Family 보호자 포털·동의

~~~~text
남은 일에 대한 결정을 전합니다(2026-11-03).
1. 코어 v1.1이 재승인됐습니다. HUB-1~11의 "코어 v1.1 반영 대기"를 실제 처리 결과로 바꿔 주세요(코어 tech-design v1.1 보강 절 참고). 코어가 바꿔 받아들인 것이 있습니다. HUB-11(가)는 D 원문대로 EmergencyContactQuery 소비자에서 D를 뺐습니다. registerPolicy에는 예외 조항이 생겼습니다(다른 모듈이 api에 "D 동의로 연다"고 선언한 행동만 D가 정책을 등록할 수 있음). 직무는 RoleAssignment.duties(FRONT, LIFE_SUPPORT, CARE)로 들어가서 D의 임시 staff_duty를 대신합니다.
2. B가 문장 보관을 D 안(post에 본문 스냅샷)으로 채택했습니다(B ADR-S3). ADR-F4의 [미정]을 결정으로 바꿉니다.
3. 문자 예정 시각: `post` 결과에 `noticeSendAt`을 더하고, 미리보기용 `nextSendAt(siteId, at)` 조회를 8-2절에 엽니다(허브 결정, B 제안 채택).
4. 데모 주인공을 A동 201호 이은숙으로 확정했습니다(사용자). 이은숙은 2026-11-10 사별 승계 뒤 혼자 지냅니다. D 시드의 김정희·딸 이수진·아들 이민호를 이은숙·딸 김지민·아들 김태호로 바꿉니다. 김지민은 건강 소식·청구서·생활 소식을 보는 보호자이고 비상 연락처 1순위입니다. 김태호는 코어 대리인(청구서 확인·결제, MANAGE_GUARDIAN_ACCESS 없음)입니다. 김태호에게 보호자 연결을 줄지, 어떤 항목을 보여 줄지는 D가 시드로 정합니다. D 데모 장면은 승계 뒤 날짜로 둡니다.
방법: 문서에 맞는 스킬을 Skill 도구로 불러 고칩니다. 마지막에 검토 에이전트로 D 문서 7개와 코어 v1.1, B 10-2절 사이의 불일치를 한 번 점검합니다. 상태는 초안을 유지합니다.
범위: `ideas/family-consent-portal/`만 고칩니다. 끝나면 남은 [미정]과 허브 요청만 짧게 보고해 주세요.
~~~~

### p0108

2026-11-03 01:47 · 에이전트 지시 · B 기획: Evenstay Safety 안심 알림

~~~~text
READ-ONLY review in Korean. Do not edit files.

Review the 7 draft docs in ~/ai/senior-lab/04-planning/ideas/safety-signal-hub/ (strategy, service-blueprint, prd, user-stories, roadmap, tech-design, handoff) against:
1. Core v1.1 (approved): ~/ai/senior-lab/04-planning/ideas/pms-core-billing/tech-design.md — esp. ADR-2 (items 2 and 5: module api/ dependency, registerPolicy only own namespace with a D-consent exception), 6 (roles incl. SITE_MANAGER, duties), 8-2 internal APIs (SiteQuery, ResidentQuery, GuardianQuery.guardiansOf(residentId, at), StaffQuery.listStaff(siteId, at), EmergencyContactQuery.emergencyContactsOf(residentId, at, actor) — core does authorize + SENSITIVE_READ, consumer is B only; Authorization; AuditWriter; platform Clock.now()/today(); platform Notifier.send(template, recipientRef, vars, sendAfter?)), 8-3 events (ContractTerminationRequested now has residentIds; EmergencyContactsChanged has no B subscriber), 10 (safety row). Also pms-core-billing/prd.md section 9 seed.
2. D public API: ~/ai/senior-lab/04-planning/ideas/family-consent-portal/tech-design.md section 8-2 and 8-3 (FamilyConsentQuery.viewersOf, HealthFeedCommand.post({..., involvesEmergencyCall}) / withhold({..., involvesEmergencyCall}), HealthEventWithheld). Hub decided 2026-11-03 that D adds `noticeSendAt` to post's result and opens `nextSendAt(siteId, at)`; D's doc may not show it yet — that's expected, don't flag it as B's error, just note.
3. Approved B copy: ~/ai/senior-lab/03-copywriting/ideas/safety-signal-hub/copy.md (2-8 was re-approved with buttons "보내기 · 올리지 않기" and two reasons).

Decisions already fixed (verify B docs follow them; don't relitigate):
- No staff-discretion withholding. Only MEMBER_REQUEST (heard-by staff + time required, shown on member screen) and NOT_A_HEALTH_EVENT (other resident / duplicate / device test). 119·hospital-recorded items → MEMBER_REQUEST only. Ops manager checks weekly.
- B posts body to D via HealthFeedCommand.post (D keeps a snapshot); B exposes no API to guardians.
- Demo protagonist: A동 201호 이은숙 (after 2026-11-10 succession; B demo on 2026-11-12 early morning). Daughter 김지민 = health-news guardian AND emergency contact #1. Son 김태호 = representative (billing view·payment) only. 김말순/김수진/302 should no longer be the B demo protagonist (copy example placeholders mapped in prd 9 are OK).
- Core requests now "반영됨" (reflected in core v1.1), except items B lists as still requested.

Report: numbered findings, most severe first, each with file:line, the mismatch, and a concrete fix. Cover: wrong/missing API names or signatures vs core 8-2 and D 8-2, leftover old decisions (보내지 않기 by staff, SafetyOutcomeShared, B-side SENSITIVE_READ, HQ_MANAGER as site manager, "반영 대기"), demo seed/timeline inconsistencies between prd 9, blueprint, user-stories (dates, rooms, names, event IDs), broken cross-references ("확인할 것 N"), and docs missing "상태: 초안". Skip style nits. Keep under ~600 words.
~~~~

### p0109

2026-11-03 01:48 · 에이전트 지시 · D 기획: Evenstay Family 보호자 포털·동의

~~~~text
읽기 전용 검토다. 파일을 고치지 말고 발견만 한국어로 보고해라.

대상: ~/ai/senior-lab/04-planning/ideas/family-consent-portal/ 의 7개 문서(strategy, service-blueprint, prd, user-stories, roadmap, tech-design, handoff). 시니어 레지던스 PMS 'Evenstay'의 모듈 D(보호자 포털·동의) 기획 초안이다.

기준(바뀌지 않음):
- 코어 v1.1: ~/ai/senior-lab/04-planning/ideas/pms-core-billing/tech-design.md (큰 파일이라 offset/limit로 나눠 읽어라. 특히 2-1·2-2(GuardianLink, UserAccount.kind, RoleAssignment.duties, StaffDuty), ADR-2 2번·5번(모듈 간 api 의존, registerPolicy 이름공간과 "D 동의로 연다" 예외), 6-1·6-2·6-3(GUARDIAN 범위, SITE_MANAGER, 보호자 관계 등록·끊기, D 행동의 MANAGE_GUARDIAN_ACCESS 대응), 7절 감사 범주(READ, SENSITIVE_READ), 8-2(GuardianCommand, StaffQuery, MealQuery, EmergencyContactQuery, ContractQuery.keyDates 6개 날짜, Notifier sendAfter, Clock), 8-3 이벤트 residentIds, 확인할 것 12·13)과 코어 prd.md 9절 시드.
- B 기술 설계: ~/ai/senior-lab/04-planning/ideas/safety-signal-hub/tech-design.md 10-2절(D와 주고받는 인터페이스), ADR-S3, 확인할 것 2-1.
- D 승인 카피: ~/ai/senior-lab/03-copywriting/ideas/family-consent-portal/copy.md(3절 AI 고지 v2 포함), names.md

2026-11-03에 확정된 것(D 문서가 따라야 함):
1. 건강 소식 올리지 않기: 직원 재량 없음, MEMBER_REQUEST·NOT_A_HEALTH_EVENT 두 가지만, 운영 매니저 매주 확인, 119·병원 이송 기록은 MEMBER_REQUEST로만.
2. 일정 항목: 코어 keyDates 6개만, 병원 일정 제외, 면회 예약은 Next.
3. AI 고지: 회원 v2(생활 소식 + 비서), 보호자 v1. 목적 LIFE_REPORT·ASSISTANT 구분.
4. HUB-1~11은 코어 v1.1로 처리됨. D의 임시 staff_duty는 코어 RoleAssignment.duties로 대체.
5. B 문장 보관: post에 본문 스냅샷(B ADR-S3).
6. 문자 예정 시각: post 결과 noticeSendAt, 미리보기용 FamilyNoticeQuery.nextSendAt(siteId, at).
7. 데모 주인공: A동 201호 이은숙(11/10 사별 승계 뒤), 딸 김지민(청구서·건강 소식·생활 소식, 비상 연락처 1순위), 아들 김태호(코어 대리인: 청구서 확인·결제, MANAGE_GUARDIAN_ACCESS 없음). D 데모 장면은 승계 뒤 날짜.
그 밖의 원칙: 모든 문서 머리 "상태: 초안", 사실 표시와 출처, 지어낸 수치 금지, D는 family 스키마에만 쓰고 권한은 허용만 추가.

점검할 것:
1. D 7개 문서 사이 불일치(시드 이름·날짜·금액, 기능 F·스토리 US 대응, API 이름·서명, 확인할 것 번호 상호 참조, 남아 있는 옛 이름(김정희·이수진·이민호·박지호)이나 "반영 대기"·"제안" 같은 낡은 상태 표시).
2. 코어 v1.1과의 불일치: 이름·서명·역할·감사 범주·이벤트 payload를 잘못 쓴 곳, 코어가 바꿔 받아들인 것(registerPolicy 예외, EmergencyContactQuery에서 D 제외, duties)을 반영하지 않은 곳, 코어 시드와 D 시드가 어긋나는데 허브 요청으로 표시하지 않은 곳.
3. B 10-2절과의 불일치(서명, 이벤트, 문자 시각, 의존 방향). D 쪽이 맞고 B가 고쳐야 하는 경우는 "D가 허브에 요청으로 표시했는지"만 확인.
4. 위 확정 사항 위반, 권한 정책 의사코드(tech-design 4절)와 6-2 표의 어긋남.

보고: 심각도(높음/중간/낮음)별, 파일:줄, 무엇이 어긋나는지, 기준 근거(파일:줄), 고칠 방향 한 줄. 결정에 영향 있는 것만. 마지막에 "문제 없음으로 확인한 것" 짧게.
~~~~

### p0110

2026-11-03 02:03 · 사용자 · 시니어 서비스 MVP 기획 환경 구성

~~~~text
승인하고 G 기획 시작 (Recommended)
~~~~

### p0111

2026-11-03 02:03 · 사용자 · 시니어 서비스 MVP 기획 환경 구성

~~~~text
예비로 두기 (Recommended)
~~~~

### p0112

2026-11-03 02:03 · 사용자 · 시니어 서비스 MVP 기획 환경 구성

~~~~text
지금 시작 (Recommended)
~~~~

### p0113

2026-11-03 02:03 · 허브 지시 · G 기획: Evenstay Home 비서 최소판

~~~~text
Background (from the session that started this one):
senior-lab은 [지원 회사] Tech Lead / Senior Backend 지원용으로 시니어 레지던스 PMS 'Evenstay'를 기획하는 워크스페이스이고, 단계 폴더마다 필요한 스킬만 설치해 둡니다. 코어(계약·청구)는 v1.1까지 승인되어 인계됐고, B(안심 알림)와 D(보호자 포털·동의)는 기획을 마무리하는 중입니다. G(AI 생활 비서)는 공고의 AI Agent 연동을 보여 주는 모듈이고, 카피 최소판이 2026-11-03에 승인됐습니다. 사용자는 구현은 나중에 하고 지금은 기획까지만 마무리하기로 했습니다(A, B, D, G, C. E는 예비). 공유 파일(shared/)은 허브 세션만 고칩니다. 사실에는 출처를 붙이고 수치나 사례를 지어내지 않습니다.

Task:
`senior-ai-assistant`(G, Evenstay Home 비서)를 기획해서 `ideas/senior-ai-assistant/`에 문서 7개를 만들어 주세요. 문서는 `strategy.md`, `service-blueprint.md`, `prd.md`, `user-stories.md`, `roadmap.md`, `tech-design.md`, `handoff.md`이고, 모두 첫머리에 `상태: 초안`을 둡니다. 범위는 A(코어) 바로 다음에 붙일 **최소판**입니다(도구: 일정 조회, 청구 설명). 다만 B·D·C 도구가 늘어날 때 구조가 바뀌지 않게 설계합니다.

먼저 읽을 것
- 이 폴더 `CLAUDE.md`: "PRD에 반드시 들어갈 것", "코어 + 모듈 구조"(G 규칙), "개발 인계"(senior-ai-assistant → `evenstay/docs/assistant/`)
- 상위 `../CLAUDE.md` 공통 규칙
- 승인된 카피 `../03-copywriting/ideas/senior-ai-assistant/` 전체: 답의 틀, 넘기기, 7절 요청 상태
- 설계 출발점 `../02-ideation/drafts/ai-assistant.md`: 0, 3, 4, 5, 6, 7절
- 코어(바꾸지 않음): `ideas/pms-core-billing/tech-design.md`. 특히 10절 G 행(BillingQuery.explainInvoice, ContractQuery.keyDates 6개, InquiryCommand, Authorization, AuditWriter), 6절 권한과 대리인, Invoice.due_date, Payment(F16, P1)
- D(초안, 기획 중): `ideas/family-consent-portal/tech-design.md` 8-2절의 `AiNoticeQuery`, `AiNoticeCommand`(purpose ASSISTANT. 확인 전에는 비서를 열지 않음), `MoneyRequestCommand`(P1)

확정된 것(바꾸지 말 것)
- 비서는 새 데이터를 만들지 않습니다. 다른 모듈 API를 도구로 호출하는 앞단이고, 자기 스키마 `assistant`에는 대화, 도구 호출 기록, 확인 토큰만 둡니다.
- 건강, 금전, 계약 판단은 하지 않고 사람에게 넘깁니다. 넘기기는 회원이 [네, 전해 주세요]를 누른 뒤에만 합니다. 투자 추천과 주문은 하지 않고, 자산 조회는 최소판에 없습니다.
- 답은 도구가 돌려준 사실만 말합니다(답의 틀: 답 → 사실 → 확인한 곳 → 넘기기).
- AI 고지는 D 고지 v2(비서 포함)이고, 고지 원본은 D가 관리합니다.
- 청구 이의 경로는 코어 `InquiryCommand`를 쓰는 쪽으로 제안돼 있습니다. 여기서 확정합니다.
- 통합 데모 주인공은 A동 201호 이은숙입니다. 2026-11-10 사별 승계 뒤 1인이고, 딸 김지민이 보호자, 아들 김태호가 대리인(청구서·결제)입니다. G 장면은 승계 뒤 날짜로 둡니다.
- 기술 방향은 프로토타입 HTML·JS, MVP Next.js, DB PostgreSQL입니다. LLM 제공자와 모델은 [미정]입니다. 데모에서 외부 LLM 호출을 목업이나 녹화 응답으로 대신할지도 정합니다.

이 세션에서 정할 것(제안과 대안을 "확인할 것"에 적기)
- 납부했는지를 어디서 읽을지(코어 Payment는 P1). 기한이 지났는데 납부 기록이 없을 때의 답(코어는 미납 판정을 하지 않음).
- 청구 이의를 `InquiryCommand`로 보낼지(도구 3개가 됨).
- 대리인(김태호)이 비서를 쓸 때의 권한과 답 범위.
- 프롬프트 주입, 환각, 다른 회원 데이터 노출을 막는 장치. 예: 도구가 actor 범위로만 조회하고, 답이 도구 결과를 인용하는지 검사.
- AI 기본법 사전 고지, 대화 기록 보관 기간, 사람에게 넘기는 지점의 감사 기록.

방법: 이 폴더의 스킬을 **Skill 도구로 불러** 순서대로 씁니다. 순서는 product-strategy → service-blueprint → create-prd → user-stories → outcome-roadmap이고, 필요하면 north-star-metric도 씁니다. SKILL.md를 읽고 따라 하는 것으로 대신하지 않습니다. tech-design은 코어 형식을 따릅니다. `방법:` 줄에는 실제로 호출한 스킬만 적습니다. 다 쓰면 검토 에이전트로 문서 사이의 불일치와 코어·D와의 불일치를 한 번 점검합니다.

범위: `ideas/senior-ai-assistant/` 안에서만 씁니다. `shared/`, 다른 모듈 문서, 카피 폴더, evenstay는 건드리지 않습니다. 코어나 D를 바꿔야 하면 "허브에 요청"으로 보고합니다. 끝나면 핵심 결정, 확인할 것, 허브 요청을 짧게 보고해 주세요.

Shared notes folder for this group of sessions (outside the repo; read siblings' notes there, leave hand-over notes or large findings there instead of pasting them into messages): ~/Library/Application Support/Claude/side-session-notes/local_4ea3b11d-fd3a-4c6e-847f-d3162e709e19
~~~~

### p0115

2026-11-03 02:04 · 허브 지시 · A 코어 기획: Evenstay Core PRD·tech-design

~~~~text
김태호는 이은숙의 아들로 옮겨 주세요(허브 결정). 사용자가 주인공을 확정할 때 고른 안이 "보호자 딸 김지민, 대리인 아들 김태호"였고, B·D 기획 세션에도 이미 그렇게 전달했습니다.
- 이은숙 → 아들 김태호: 대리인입니다. 근거는 위임장으로 둡니다(이은숙은 판단 능력이 있는 상태로 위임). 범위는 청구서 확인과 결제만이고, MANAGE_GUARDIAN_ACCESS는 없습니다. 비상 연락처 순서는 김지민 1순위, 김태호 2순위를 제안합니다.
- 김말순(배경 회원)에게는 김태호 대신 새 가상 인물을 한정후견인이자 비상 연락처 1순위로 넣어 주세요. 한정후견 예시는 대리인 화면에서 쓸모가 있으니 남깁니다. 이름은 지어 쓰되 "가상"이라고 표시해 주세요.
- 부록 데모(대리인 김태호의 범위와 계약 서명 거부)는 이은숙 계약 기준으로 맞춥니다.
- [미정]을 지우고, 상태 줄의 "데모 주인공(사용자 확정)" 표시는 그대로 둡니다.
범위: `ideas/pms-core-billing/`만 고칩니다. 끝나면 바뀐 시드 줄만 짧게 보고해 주세요.
~~~~

### p0116

2026-11-03 02:10 · 사용자 · 시니어 서비스 MVP 기획 환경 구성

~~~~text
D 화면이 기준 (Recommended)
~~~~

### p0117

2026-11-03 02:10 · 사용자 · 시니어 서비스 MVP 기획 환경 구성

~~~~text
제안값으로 확정 (Recommended)
~~~~

### p0118

2026-11-03 02:11 · 허브 지시 · A 코어 기획: Evenstay Core PRD·tech-design

~~~~text
B·D 기획 세션이 마지막 점검에서 낸 코어 요청을 반영해 주세요. 모두 작은 동기화이고, 허브가 묶어서 보냅니다(2026-11-03). 원문은 B `ideas/safety-signal-hub/tech-design.md` 확인할 것 4-1 근처, D `ideas/family-consent-portal/prd.md` 확인할 것 13과 tech-design HUB 항목에 있습니다.
1. 시드(prd 9절)
   - 이은숙 → 김태호 GuardianLink(CHILD)를 추가합니다. D가 김태호에게 보일 항목은 D 시드가 정합니다.
   - 2026-11-16~22에 이은숙의 사전 신청 결식 3끼를 넣습니다. D 생활 소식 "21끼 중 18끼"에 씁니다.
2. 8-3 이벤트
   - `ContractSucceeded` 구독자에 B를 더합니다. 이유는 사별하신 분의 침대 센서 연결 종료입니다.
   - `InvoiceIssued` payload에 residentIds를 더합니다(D).
3. ADR-2 5번 예시 `safety.outcome.view_as_guardian`은 B에 없는 행동이라 지웁니다. 다른 모듈이 "D 동의로 연다"고 선언하는 예외 조항은 남기고, 예시만 실제로 있는 행동으로 바꿉니다. 마땅한 행동이 없으면 예시를 지웁니다.
4. 6-2의 "(D)" 칸이 D 행동 `family.consent.*`, `family.view(BILLING)` 등으로 열린다고 주석을 답니다. 10절 D 줄에서 `safety/api` 의존을 뺍니다.
5. 확인만 하는 `canView` 호출의 감사 기록: 제안을 하나 정해 확인할 것에 적습니다(예: 화면 표시에 쓰인 조회만 READ로 남김).
6. 남은 [미정] 중 운영값·정책은 사용자가 "각 문서 제안값으로 확정, [가설] 표시"로 정했습니다. 코어 확인할 것 중 제안값이 있는 항목(청구 일정 기본값 매월 말일·발행 후 10일, 체결 때 비상 연락처 1명 필수 등)은 결정으로 바꾸고 [가설]을 붙입니다. 법률 검토 항목, North Star, SITE_MANAGER 승인 권한처럼 제안이 없거나 판단이 필요한 것은 그대로 둡니다.
방법: prd는 `create-prd` 스킬을 Skill 도구로 불러 고칩니다. tech-design은 직접 고칩니다. 고친 문서의 상태 줄 끝에 "· 변경: 2026-11-03 B·D 동기화(사용자 재확인 대기)"를 붙입니다.
범위: `ideas/pms-core-billing/`만 고칩니다. 끝나면 항목별 처리 결과를 짧게 보고해 주세요.
~~~~

### p0119

2026-11-03 02:11 · 허브 지시 · B 기획: Evenstay Safety 안심 알림

~~~~text
B 기획을 마무리해 주세요. 허브가 요청을 처리한 결과와 사용자 결정을 전합니다(2026-11-03).
허브 요청 처리 결과
1. 김태호는 이은숙의 아들이자 대리인으로 코어 시드에 반영됐습니다(위임장, 청구서 확인·결제만, 비상 연락처 2순위). 김말순의 한정후견인은 새 가상 인물 김도현입니다.
2. ContractSucceeded 구독자에 B 추가, ADR-2 5번 예시 정리는 A 세션에 보냈습니다. 반영되면 코어 문서에 "B·D 동기화"라고 표시됩니다.
3. D `withhold` 인자(residentId, 종류, 사건 시각, 들은 시각)는 D가 이미 반영했습니다.
4. 회원 요청으로 뺀 일의 회원 화면 표시: D 회원 화면(D copy 2-9)을 기준으로 하고, B 안심 알림 기록(P1)에는 같은 문장을 붙입니다(사용자 확정). B 문서를 이에 맞춥니다.
사용자 결정: 남은 운영값과 정책 [미정]은 **각 문서의 제안값으로 확정하고 [가설]로 표시**합니다. 예: 확인 필요 등급 넘김 15분, 같은 입주자 신호 묶음 30분(화면에서만), 3차 호출 대상은 당직 책임자 → 모두 호출, 직원 기록 열람 범위 7일. 제안이 없는 것, 법률 검토 항목, North Star는 그대로 둡니다. "확인할 것"을 "결정됨 [가설]"과 "남은 것"으로 나눠 정리해 주세요.
남은 카피 요청(비상 연락처 버튼·목록, 직원 휴대폰 패널, "모두 호출" 라벨, 호출벨·정문 보호자 문장 틀, 예시 호실·주인공 맞춤)은 허브가 B 카피 세션에 보냅니다. B 문서에서는 "카피 반영 대기"로 표시합니다.
방법: 문서에 맞는 스킬을 Skill 도구로 불러 고칩니다. 끝나면 검토 에이전트로 한 번 더 점검합니다. 상태는 초안을 유지합니다. 범위는 `ideas/safety-signal-hub/`만입니다. 끝나면 "남은 것" 목록만 짧게 보고해 주세요. 이 보고를 받으면 사용자 승인을 요청합니다.
~~~~

### p0120

2026-11-03 02:11 · 허브 지시 · D 기획: Evenstay Family 보호자 포털·동의

~~~~text
D 기획을 마무리해 주세요. 허브가 요청을 처리한 결과와 사용자 결정을 전합니다(2026-11-03).
허브 요청 처리 결과
1. 코어 시드: 김태호를 이은숙의 아들이자 대리인으로 옮겼습니다(위임장, 청구서 확인·결제, MANAGE_GUARDIAN_ACCESS 없음, 비상 연락처 2순위). 이은숙 → 김태호 GuardianLink(CHILD)와 11월 16~22일 결식 3끼는 A 세션에 보냈습니다.
2. 코어 동기화(6-2 "(D)" 칸 주석, 10절 D 줄에서 `safety/api` 빼기, InvoiceIssued payload residentIds, `canView` 감사 처리 제안)는 A 세션에 보냈습니다.
3. D-2 회원 요청으로 뺀 일의 표시: D 회원 화면(copy 2-9)을 기준으로 하고, B 기록에는 같은 문장을 붙입니다(사용자 확정). "B와의 조정"을 해결로 바꿉니다.
4. 카피 수정(prd 확인할 것 10·11·12·14, 직원 화면 "건강 이벤트" 라벨)은 허브가 D 카피 세션에 보냅니다. D 문서에서는 "카피 반영 대기"로 표시합니다.
사용자 결정: 남은 운영값과 정책 [미정]은 **각 문서의 제안값으로 확정하고 [가설]로 표시**합니다. 예: 초대 링크 7일, 문의 회신 2영업일, 범위가 넓어질 때만 문자, 조용한 시간 22~08시, 동의한 날부터의 건강 소식, 뺀 건강 소식을 다시 올릴 때는 직원 입력 뒤 회원 확인, 대리인이 있는 회원도 직접 좁힐 수 있음. 아래는 확정하지 않고 그대로 둡니다.
- 법률 검토 항목: 기록 보관 3년, 부부 청구서의 사별한 분 항목, 건강 소식 본문 암호화 방식
- North Star
- 제안이 없는 것
퇴거·사별 때의 처리와 임대주택 적용 여부도 제안이 있으면 확정하고, 없으면 남깁니다. "확인할 것"을 "결정됨 [가설]"과 "남은 것"으로 나눠 정리해 주세요.
방법: 문서에 맞는 스킬을 Skill 도구로 불러 고칩니다. 끝나면 검토 에이전트로 한 번 더 점검합니다. 상태는 초안을 유지하고, 범위는 `ideas/family-consent-portal/`만입니다. 끝나면 "남은 것" 목록만 짧게 보고해 주세요. 이 보고를 받으면 사용자 승인을 요청합니다.
~~~~

### p0123

2026-11-03 02:16 · 에이전트 지시 · D 기획: Evenstay Family 보호자 포털·동의

~~~~text
읽기 전용 검토다. 파일을 고치지 말고 발견만 한국어로 짧게 보고해라.

대상: ~/ai/senior-lab/04-planning/ideas/family-consent-portal/ 의 7개 문서(strategy, service-blueprint, prd, user-stories, roadmap, tech-design, handoff). 모듈 D(보호자 포털·동의) 기획 초안의 마무리본이다.

기준:
- 코어 v1.1: ~/ai/senior-lab/04-planning/ideas/pms-core-billing/tech-design.md (offset/limit로 필요한 절만), 코어 prd.md 9절 시드
- B: ~/ai/senior-lab/04-planning/ideas/safety-signal-hub/tech-design.md 10-2절과 확인할 것 D-1~D-3
- D 카피: ~/ai/senior-lab/03-copywriting/ideas/family-consent-portal/copy.md, names.md

2026-11-03 사용자 결정(이번 정리의 기준):
- 남은 운영값·정책 [미정]은 각 문서의 제안값으로 확정하고 [가설]로 표시한다(예: 초대 7일, 회신 2영업일, 넓어질 때만 문자, 조용한 시간 22~08시, 동의한 날부터의 건강 소식, 뺀 건강 소식 다시 올리기는 직원 입력 뒤 회원 확인, 대리인 있는 회원도 직접 좁히기, 퇴거·사별 처리, 임대주택 제외).
- 확정하지 않고 남기는 것: 법률 검토 항목(기록 보관 3년, 부부 청구서의 사별한 분 항목, 본문 암호화 방식 등), North Star, 제안이 없는 것.
- "확인할 것"은 "결정됨 [가설]"과 "남은 것"(+ 결정됨, 해결, 코어·카피 반영 대기)으로 나눈다.
- 허브 처리: 김태호는 이은숙의 아들·대리인(위임장, 청구서 확인·결제, MGA 없음, 비상 연락처 2순위)으로 코어 시드에 옮겨짐. 이은숙→김태호 GuardianLink와 11/16~22 결식 3끼, 코어 문서 동기화는 A 세션에 보냄(코어 반영 대기). B D-2는 D 회원 화면 2-9 기준 + B 기록 같은 문장으로 해결. 카피 수정(prd 확인할 것 10·11·12·14, "건강 이벤트" 라벨)은 카피 반영 대기.
- 모든 문서 머리 "상태: 초안".

점검:
1. 확인할 것의 분류가 위 결정과 맞는지(법률 검토·North Star·제안 없는 것을 [가설]로 확정한 곳, 반대로 제안이 있는데 남겨 둔 곳).
2. 본문에 아직 "[미정 제안]", "[제안]", "제안값" 같은 낡은 표시나, 확인할 것과 다른 상태(예: 본문은 [가설]인데 확인할 것은 남은 것)가 있는지.
3. 문서 사이 상호 참조(prd 확인할 것 번호, tech-design 확인할 것 번호, handoff 목록)가 맞는지.
4. 직전 검토에서 고친 것(withhold 인자 residentId·kind·occurredAt·heardAt, 정책의 POSTED 검사, `family.*`만 정책 등록, 데모 시간표 11/11·11/12·11/23, 올리지 않기 주간 목록 화면·API)이 문서들 사이에서 일관된지. 코어 v1.1이나 B 10-2와 새로 어긋난 곳.

보고: 심각도(높음/중간/낮음)별 파일:줄, 무엇이, 고칠 방향 한 줄. 결정에 영향 있는 것만. 마지막에 "문제 없음" 요약 몇 줄.
~~~~

### p0124

2026-11-03 02:17 · 에이전트 지시 · B 기획: Evenstay Safety 안심 알림

~~~~text
READ-ONLY final review in Korean. Do not edit files.

Target: 7 draft docs in ~/ai/senior-lab/04-planning/ideas/safety-signal-hub/ (strategy, service-blueprint, prd, user-stories, roadmap, tech-design, handoff). They were just finalized: each "## 확인할 것" section was reorganized into "결정됨", "결정됨 [가설]", and "남은 것".

Rules from the user (2026-11-03): remaining operating values and policy [미정] items that HAD a proposal are now decided with the proposal and marked [가설]. Items with no proposal, legal-review items ([법률 검토]), and North Star stay open in "남은 것". Copy requests are marked "카피 반영 대기". Two core items wait on the A session (ContractSucceeded subscriber B, ADR-2 5번 example) and are marked "코어 반영 대기". All docs must keep "상태: 초안".

Reference (approved/current, do not suggest changing them):
- Core v1.1: ~/ai/senior-lab/04-planning/ideas/pms-core-billing/tech-design.md (8-2, 8-3, 10) and prd.md 9절 seed (이은숙, 딸 김지민, 대리인 아들 김태호 = 위임장·청구서 확인·결제만·비상 연락처 2순위)
- D: ~/ai/senior-lab/04-planning/ideas/family-consent-portal/tech-design.md 8-2 (viewersOf, post with noticeSendAt, withhold with residentId/kind/occurredAt/heardAt/involvesEmergencyCall, FamilyNoticeQuery.nextSendAt, HealthEventWithheld) and D copy 2-9 at ~/ai/senior-lab/03-copywriting/ideas/family-consent-portal/copy.md (member screen for withheld items; B 안심 알림 기록 P1 carries the same sentence — user decision).

Check and report (numbered, most severe first, file:line, issue, concrete fix; under ~500 words):
1. Any leftover "[미정]" or "(제안)" for an item that had a proposal and should now be "[가설]"; any item wrongly closed that should stay open (North Star, legal review, no-proposal items).
2. Contradictions between docs on decided values (15분/30분/3차/모두 호출/7일/P1/G tools/D 실연동/작업자 위치/폴링) or between a doc's body and its own 확인할 것.
3. Broken cross-references "확인할 것 N" after renumbering (e.g., prd 확인할 것 now 1~12, tech-design 1~15, blueprint 1~7, user-stories 1~4, roadmap 1~3, strategy 1~3; handoff points to these).
4. Remaining mismatches with core v1.1 / D 8-2 (API names, withhold args, seed people) or old decisions (staff-discretion 보내지 않기, B-side SENSITIVE_READ, 김말순/김수진 as protagonist, "반영 대기" for things already reflected).
5. Missing "상태: 초안".
Skip style nits.
~~~~

### p0125

2026-11-03 02:20 · 에이전트 지시 · G 기획: Evenstay Home 비서 최소판

~~~~text
You are reviewing planning documents (Korean) for a senior-residence PMS module. Read-only review; do NOT edit files. Answer in Korean.

Target folder (7 docs, all 상태: 초안): ~/ai/senior-lab/04-planning/ideas/senior-ai-assistant/ — strategy.md, service-blueprint.md, prd.md, user-stories.md, roadmap.md, tech-design.md, handoff.md. Module G = "Evenstay Home 비서", an AI assistant that only calls other modules' APIs as tools.

Reference docs (do not edit):
- Core (approved, source of truth for domain model): ~/ai/senior-lab/04-planning/ideas/pms-core-billing/tech-design.md (esp. sections 2-2 entities, 3-2 invoice/payment status, 4 keyDates calc, 6 roles/representatives, 8-2 internal APIs incl. ContractQuery.keyDates, BillingQuery, InquiryCommand, 8-3 events, 10 G row) and prd.md section 9 (seed: 이은숙, 김태호 etc.), F13/F15/F16 priorities.
- D module (draft): ~/ai/senior-lab/04-planning/ideas/family-consent-portal/tech-design.md section 2-2 (AiNoticeVersion/Ack), 8-2 (AiNoticeQuery, AiNoticeCommand, MoneyRequestCommand), ADR-F6.
- Approved copy for G: ~/ai/senior-lab/03-copywriting/ideas/senior-ai-assistant/copy.md and names.md (답의 틀, 2-3 dates & payment branches, 2-5, 2-6 handoff, 5-x staff screens, 7절 hub requests).
- Workspace rules: ~/ai/senior-lab/CLAUDE.md and ~/ai/senior-lab/04-planning/CLAUDE.md ("PRD에 반드시 들어갈 것", G rules in "코어 + 모듈 구조").

Fixed constraints the docs must respect: G creates no new domain data (assistant schema holds conversations, tool-call logs, confirmation tokens; docs also add handoffs and flag it); no health/money/contract judgment, handoff only after member presses [네, 전해 주세요]; no investment advice/orders, no asset lookup; answers state only tool-returned facts (답 → 사실 → 확인한 곳 → 넘기기); AI notice is D v2 owned by D; demo protagonist A동 201호 이은숙 after 2026-11-10 succession; tech direction HTML/JS prototype, Next.js MVP, PostgreSQL; LLM provider undecided.

Check and report concretely (file:section, quote, what conflicts, suggested fix):
1. Inconsistencies BETWEEN the 7 G docs: feature IDs (F1–F16), story IDs (US-01–15) and their P0/P1, hub request numbers H1–H12 and what each refers to, tool count/names, handoff reasons, demo date/amounts (2027-01-05, 12월 청구서 2,910,000원 = 2,100,000 + 837,000 − 27,000, dates 12-31/01-10/01-31), retention, token expiry, KR definitions, eval set counts (40 = 14+19+3+4).
2. Conflicts with core: API names/signatures, entity fields, role codes, representative scopes, priorities (F13/F15/F16 P1), event names, AuditLog categories, claims about what core already says.
3. Conflicts with D: AiNotice API shape/audience/channel values, MoneyRequestCommand, claims attributed to D.
4. Conflicts with approved copy (labels, branch wording, handoff reasons, staff screen tool list) that are NOT already listed as hub request H10.
5. Workspace-rule violations: missing [사실]/[추정]/[가설]/[미정] marking on numbers or claims, invented numbers/sources, missing required PRD items, `방법:` lines naming skills not used (skills actually invoked: product-strategy, service-blueprint, create-prd, user-stories, outcome-roadmap; tech-design and handoff have no skill).
6. Logic gaps in the security design (prompt injection, hallucination, other-resident data, confirmation token, notice gate) that a Tech Lead interviewer would catch.

Prioritize: list must-fix items first (factual conflicts), then should-fix, then nits. Be concise; max ~40 findings. Give an overall verdict (통과 / 수정 필요).
~~~~

### p0128

2026-11-03 07:07 · 사용자 · 시니어 서비스 MVP 기획 환경 구성

~~~~text
승인 (Recommended)
~~~~

### p0129

2026-11-03 07:07 · 사용자 · 시니어 서비스 MVP 기획 환경 구성

~~~~text
세 가지 모두 승인 (Recommended)
~~~~

### p0130

2026-11-03 07:07 · 사용자 · 시니어 서비스 MVP 기획 환경 구성

~~~~text
승인하고 넘기기 (Recommended)
~~~~

### p0131

2026-11-03 08:41 · 사용자 · 시니어 서비스 MVP 기획 환경 구성

~~~~text
완료됐어?
~~~~

### p0132

2026-11-03 08:57 · 사용자 · 시니어 서비스 MVP 기획 환경 구성

~~~~text
둘 다 시작
~~~~

### p0133

2026-11-03 08:58 · 허브 지시 · A 코어 기획: Evenstay Core PRD·tech-design

~~~~text
[허브] G(비서) 기획의 코어 요청 10건을 코어 문서에 반영해 주세요. 사용자가 "둘 다 시작"으로 G 결정 제안값을 확정했습니다(2026-11-03).

범위: `ideas/pms-core-billing/`만. 코어는 이미 승인·인계본이므로, 고친 문서의 상태 줄에 `변경: 2026-11-03 G 요청 반영(사용자 재승인 대기)`를 덧붙이세요. 스킬은 Skill 도구로 호출하고 `방법:` 줄에는 실제 호출한 것만 적으세요. shared/는 고치지 말고 필요한 것은 보고에 적으세요.

원문: `ideas/senior-ai-assistant/tech-design.md` "확인할 것" 허브 요청 표.
- HUB-1 8-2 `BillingQuery.invoicesOf`(또는 `explainInvoice` 머리)에 `paymentState`(UNPAID·PARTIAL·PAID·NOT_TRACKED, 계산값이고 미납 판정이 아님)와 `hasOtherIssuedWithoutPayment`를 추가하세요. 회원·대리인 경로에는 ISSUED만 돌려준다는 것도 명시하세요.
- HUB-2 10절 G 행의 "다음 납부일" 규칙을 G의 4-4 갈래로 바꾸세요. 기한이 지났는데 낸 기록이 없는 경우를 "다음 청구 예정일"로 묶지 않습니다.
- HUB-3 6-2에 "계약·청구 주요 날짜 보기" 행을 추가하세요(회원 ◐ 본인, 대리인은 청구 날짜 VIEW_INVOICE·계약 날짜 SIGN_CONTRACT, 사업장 직원 ●). `keyDates(residentId, at, actor?)`는 actor를 선택 인자로 받아 범위 밖 필드를 null로 두고 `hiddenFields[]`를 돌려줍니다. actor가 선택 인자인 이유는 D F6(보호자 일정)이 지금 서명 그대로 쓰기 때문입니다.
- HUB-4 승계 뒤 `moveInDate`는 `succeeded_from` 사슬의 첫 계약 입주일(이은숙 2026-10-01)로 확정하세요.
- HUB-5 `InquiryCommand`의 channel에 ASSISTANT 값을 추가하세요. ASSISTANT면 `confirmationToken`이 필수이고 불투명 값입니다. Inquiry와 감사에 저장하고, 검사는 G가 하며, 토큰 ID를 멱등 키로 씁니다.
- HUB-6 시드를 추가하세요: 이은숙 11·12월 청구 생성·발행, 12월 사전 결식 3끼, 계약 만료일 값, G 장면 시계 2027-01-05 10:00. `/demo/reset`에는 "G 시작 상태"(ASSISTANT 고지 미확인, 넘김·대화 비움)를 둡니다.
- HUB-7 8-3에서 ContractActivated·ContractSucceeded·InvoiceIssued·Payment·Representative·InquiryReceived의 구독자 "G"를 지우세요. 최소판 G는 구독하지 않습니다.
- HUB-11 승계 달(11월) 청구서에 사별 뒤 날짜까지 2인 식비가 붙는 것이 의도인지 판단해 주세요. "요금은 다음 달 1일부터" 규칙은 유지하되, 식비는 식사 기록 기준인지를 [가설]로 정해 근거와 함께 적으세요.
- HUB-13 4절 `Charge.evidence.plain`을 MEAL_FEE와 RECURRING_FEE에 대해 정의하세요(예: MEAL_FEE `{code, days:31, mealsPerDay:3, occupancy:1, meals:93, unitPrice:9000, amount:837000}`). 렌더러가 계산하지 않게 하기 위함입니다.
- HUB-15 2-2 AuditLog에 배치 작업의 행위자 표기를 추가하세요(actor_user_id 없음 + actor_role SYSTEM 등).

보고: 요청마다 반영한 위치(파일:절)와 결정 내용, D·G에 영향 가는 것, 재승인이 필요한 변경 목록.
~~~~

### p0134

2026-11-03 08:58 · 허브 지시 · D 기획: Evenstay Family 보호자 포털·동의

~~~~text
[허브] G(비서) 기획의 D 요청 3건을 D 기획 문서에 반영해 주세요. 사용자가 G 결정 제안값을 확정했습니다(2026-11-03).

범위: `ideas/family-consent-portal/`만. D는 승인·인계본이므로 고친 문서의 상태 줄에 `변경: 2026-11-03 G 요청 반영(사용자 재승인 대기)`를 덧붙이세요. 스킬은 Skill 도구로 호출하고 `방법:` 줄에는 실제 호출한 것만 적으세요. shared/와 카피는 고치지 마세요.

원문: `ideas/senior-ai-assistant/tech-design.md` 허브 요청 HUB-7·8·9.
- HUB-7 8-2·8-3에서 `FamilyConsentChanged` 구독자 "G(대화 중 캐시 무효화)"와 `canView`·`viewersOf` 사용처의 "G(보호자 질문에 답하기 전)"를 지우세요. 최소판 G는 구독하지 않고, 보호자용 비서도 없습니다. `viewersOf`는 Next 도구 후보로만 남기세요.
- HUB-8 대리인(P1)이 비서를 쓸 때 어떤 AI 고지 판을 확인하는지 정하세요. 후보는 MEMBER 판을 대리인도 확인하는 것과 REPRESENTATIVE 대상을 추가하는 것입니다. 제안 하나를 [가설]로 정하고 대안과 함께 적으세요.
- HUB-9 `MoneyRequestCommand`(Next)는 비서가 request_type을 고를 수 없게 하고(고르는 것 자체가 판단), OTHER + note(회원 말 원문)로 받는다고 명시하세요.
- 추가로, G 결정 ⑪에 따라 투자 질문도 "돈"으로 묶어 [직원에게 전하기]를 보입니다. 이것은 D 고지 v2 공통 2와 맞습니다. D 쪽에 바꿀 것이 없는지만 확인하세요.

보고: 반영 위치, HUB-8 결정과 그 이유, 카피(D)에 필요한 변경.
~~~~

### p0137

2026-11-03 08:59 · 허브 지시 · G 기획: Evenstay Home 비서 최소판

~~~~text
[허브] G 기획 확인할 것 11건(tech-design)과 prd 확인할 것 1~10이 제안값으로 확정됐습니다(사용자, 2026-11-03).

확정된 내용:
- ADR-G8 paymentState, 4-4 갈래, ADR-G7 InquiryCommand.
- 대리인 P1은 코어 범위 그대로 따릅니다.
- ADR-G1·G4.
- 원문 1년 뒤 삭제 [운영사 기준 초안, 법률 검토], 음성은 저장하지 않습니다.
- 녹화 응답 기본 + 전환 + LLM 끔 장면. 제공자는 [미정]입니다.
- 토큰 5분, 대화 닫힘 30분, 넘김은 `assistant` 스키마에 둡니다.
- 투자도 "돈"으로 묶어 [직원에게 전하기]를 보입니다.
- 데모 2027-01-05, 큰 버튼은 LLM 없이 답합니다.

할 일 (범위: `ideas/senior-ai-assistant/`만, shared/는 고치지 않음):
1. 7개 문서의 확인할 것을 "결정됨 [가설] / 남은 것"으로 정리하세요(B·D 마무리와 같은 형식). 법률 검토 항목과 LLM 제공자는 남은 것으로 둡니다.
2. 허브 요청 표에 처리 상태를 붙이세요. 코어 1~7·11·13·15는 A 세션, D 7·8·9는 D 기획, 14는 D 카피, 10은 G 카피에 보냈습니다. 12는 허브가 처리했습니다(decisions.md 기록). 표시는 "반영 대기"로 하세요.
3. 남은 스킬 검토가 있으면 Skill 도구로 호출하고 `방법:` 줄에 반영하세요.
보고: 정리 결과와 반영 대기 목록. 코어·D·카피 반영이 끝나면 허브가 결과를 다시 보내 드립니다.
~~~~

### p0138

2026-11-03 09:00 · 허브 지시 · C 기획: Evenstay Transitions 생활 지원 단계

~~~~text
Background (from the session that started this one):
senior-lab은 시니어 하우징 운영사 Tech Lead 지원용 포트폴리오 기획 워크스페이스다. 아이디어 A(계약·청구 코어), B(안심 알림), D(보호자 포털·동의)는 기획이 승인돼 ~/ai/evenstay/docs/<모듈>/로 넘겼다. G(AI 비서)는 기획 초안이 있고 허브 요청을 반영하는 중이다. C(생활 지원 단계 전환)는 2026-11-03에 카피 4개가 승인됐고 이제 기획을 쓴다. 사용자는 구현을 나중에 하고 지금은 기획까지만 마무리하기로 했다. 허브(00-hub 세션)가 shared/를 관리하고 단계 세션의 보고를 파일과 스킬 호출 기록으로 확인한다. 승인은 사용자만 한다. evenstay는 모듈형 모놀리스다. 모듈마다 스키마가 따로 있고, 모듈 간에는 api/로만 통하며, 권한은 코어 authorize()가 맡는다.

Task:
[허브 지시] C(care-stage-transition, 제품 이름 Evenstay Transitions) 기획 문서 7개를 써 주세요. 7개는 strategy, service-blueprint, prd, user-stories, roadmap, tech-design, handoff이고, 모두 `상태: 초안`입니다.

## 범위
- `ideas/care-stage-transition/`에만 씁니다. 다른 아이디어 폴더, `../shared/`, 카피 폴더는 고치지 않습니다. 바꿔야 할 것은 "허브 요청" 표(HUB-n)로 둡니다.
- 먼저 읽을 것:
  - `CLAUDE.md`(이 폴더, 상위 senior-lab)
  - 승인된 C 카피 `../03-copywriting/ideas/care-stage-transition/`의 4개(product-marketing, names, value-prop, copy)
  - 코어 기준 문서 `ideas/pms-core-billing/` 7개
  - 같은 형식의 예: B `ideas/safety-signal-hub/`, D `ideas/family-consent-portal/`
  - G `ideas/senior-ai-assistant/`는 초안이니 참고만 합니다.
  - `../shared/idea-board.md`, `../shared/decisions.md`, `~/ai/evenstay/CLAUDE.md`(모듈 경계 규칙)

## 스킬 (Skill 도구로 호출. SKILL.md를 읽고 따라 하는 것으로 대신하지 않음)
- product-strategy → strategy.md
- service-blueprint → service-blueprint.md
- create-prd → prd.md
- user-stories → user-stories.md
- outcome-roadmap → roadmap.md
- tech-design.md와 handoff.md는 `CLAUDE.md`의 형식을 따릅니다. 이 둘은 B·D 문서와 같은 절 구성입니다.
- 끝나면 검토 에이전트로 한 번 점검하고 지적을 반영합니다.
- 각 문서의 `방법:` 줄에는 실제로 호출한 스킬만 적습니다.

## 지켜야 할 것
- 문장마다 [사실]/[추정]/[가설]/[미정]을 구분합니다. 없는 인터뷰, 수치, 회사 사정을 만들지 않습니다. 법적 문구에는 "[법률 검토 전 초안]"을 붙입니다.
- [지원 회사] 상표는 쓰지 않습니다.
- 호칭: 직원 화면은 "입주자"(합쇼체), 회원 화면은 "회원님"(해요체)입니다.
- 단계 이름은 카피 그대로, 번호 없이 씁니다.
  - 직원 화면: 기본 서비스 / 생활 지원 추가 / 외부 돌봄 병행 / 거처 상담
  - 회원 화면: 기본 서비스 / 생활 지원 더하기 / 다른 기관 돌봄 함께 / 지낼 곳 함께 의논
- 평가 기록에는 점수·병명·진단·추천 칸을 두지 않습니다. 시스템은 단계를 판단하거나 추천하지 않습니다.
- 제안자와 결정자는 다른 사람입니다. 거처 상담은 입주자 의견 없이 결정할 수 없고, 단계는 양쪽으로 바뀝니다.
- 장기요양 등급 판정, 요양 급여 청구, 의료 판단, 퇴거 결정은 하지 않습니다. 이것은 "하지 않을 것"에 명시합니다.
- 모듈 경계(코어 ADR-2 v1.1):
  - 다른 모듈은 `core/api`, `family/api`로만 씁니다. 스키마는 `transitions`만 씁니다.
  - 정책은 `transitions.*`만 `registerPolicy`로 등록합니다.
  - 보호자에게 가는 것은 D `HealthFeedCommand.post`로만 보냅니다. 결정된 것만, 올리지 않는 이유는 MEMBER_REQUEST·NOT_A_HEALTH_EVENT 두 가지뿐입니다.
- 데모 주인공은 A동 201호 이은숙입니다.
  - 남편 김한결 사별, 2026-11-10 승계.
  - 딸 김지민: 보호자, 청구서·건강·생활 동의.
  - 아들 김태호: 대리인(VIEW_INVOICE·PAY), 생활만 동의.
  - 직원: 프런트 최민수, 생활지원 김하진, 경리 박소연, 사업장 책임자 최영미.
  - 데모 날짜는 카피 제안을 출발점으로 합니다: 12/2 입원 → 12/7 퇴원 → 12/8 평가 → 12/9 제안·설명 → 12/10 결정 → 2027-01-12 방문요양 시작.
  - B 장면(11/12)과 G 장면(2027-01-05, 12월 청구서 2,910,000원)이 이미 있습니다. 이 둘과 어긋나지 않게 맞춥니다. 특히 12월 입원 기간 결식이 G의 12월 청구서 금액(사전 결식 3끼)을 바꾸지 않는지 확인하세요.
- 기술 방향: 프로토타입 HTML·JS, MVP Next.js, PostgreSQL. 자세한 스택은 [미정]입니다. 구현은 하지 않습니다(기획까지만).

## C 카피가 허브에 남긴 요청 (기획에서 다룰 것)
1. D 건강 소식 종류(`HealthFeedCommand.post` kind)에 CARE_STAGE_CHANGE·EXTERNAL_CARE_START를 추가할지 정합니다. 대안은 CARE_NOTE나 "그 밖"입니다. 제안을 정하고 D 허브 요청으로 남깁니다.
2. 코어 관련:
   - 결정자 역할을 정합니다(SITE_MANAGER, RoleAssignment.duties).
   - MVP의 계약 변경 경로를 정합니다. 경리의 "확인할 일" 한 줄로 남기고, `requestAmendment`는 Next로 둡니다.
   - 단계별 서비스 요금이 코어 요금 규칙(정기 요금·식비·결식 감면 3개)에 없습니다. MVP에서 어떻게 둘지 정합니다. 계약 변경 전까지 청구는 그대로입니다.
3. 코어 시드: 이은숙 입주일(2026-10-01, 첫 계약 기준), 12월 입원 기간 결식 처리. 사전 신청 결식만 감면하는 규칙과의 관계를 정합니다.
4. G 비서에 C 도구(생활 지원 단계 설명)를 넣을지는 Next 후보로만 둡니다.
5. 개정안 입법예고가 2026-11-23에 끝난 뒤 확정본으로 카피 3-3 법률 문구를 다시 확인합니다. 이것은 남은 것으로 둡니다.

## 보고 형식
- 문서별 핵심과 호출한 스킬
- 확인할 것(사용자 결정 필요): 제안과 대안
- 허브 요청 표: 코어 / D / G / 카피 / shared
- 데모 날짜가 B·D·G와 겹치거나 어긋나는 점
- 검토 에이전트 지적과 반영 여부

Shared notes folder for this group of sessions (outside the repo; read siblings' notes there, leave hand-over notes or large findings there instead of pasting them into messages): ~/Library/Application Support/Claude/side-session-notes/local_4ea3b11d-fd3a-4c6e-847f-d3162e709e19
~~~~

### p0139

2026-11-03 09:03 · 에이전트 지시 · D 기획: Evenstay Family 보호자 포털·동의

~~~~text
한국어로 답하라. 읽기 전용 검토다(파일 수정 금지).

대상: ~/ai/senior-lab/04-planning/ideas/family-consent-portal/ 의 7개 문서(strategy, service-blueprint, prd, user-stories, roadmap, tech-design, handoff). 오늘 "G 요청 반영" 변경이 들어갔다. 원문 요청은 ~/ai/senior-lab/04-planning/ideas/senior-ai-assistant/tech-design.md 의 허브 요청 표 HUB-7·8·9(355~357줄 부근)와, ~/ai/senior-lab/shared/decisions.md 48줄의 G 결정 ⑪(투자 질문도 "돈"으로 [직원에게 전하기]).

요청 내용:
- HUB-7: D 8-2·8-3에서 FamilyConsentChanged 구독자 "G(대화 중 캐시 무효화)"와 canView·viewersOf 사용처 "G(보호자 질문에 답하기 전)"를 지운다. 최소판 G는 구독하지 않고 보호자용 비서 없음. viewersOf는 Next 도구 후보로만.
- HUB-8: 대리인(P1)이 비서를 쓸 때 어떤 AI 고지 판을 확인하는지 하나를 [가설]로 정하고 대안과 함께 적는다. D 선택: MEMBER 판을 대리인도 확인(acting_as = REPRESENTATIVE), 대안 REPRESENTATIVE 대상 추가.
- HUB-9: MoneyRequestCommand(Next)는 비서가 request_type을 고르지 못하고 OTHER + note(회원 말 원문)로 받는다.
- ⑪: D 고지 v2 공통 1·2와 맞는지, D에 바꿀 것이 없는지 확인. D 카피는 ~/ai/senior-lab/03-copywriting/ideas/family-consent-portal/copy.md 3절(170~215줄)과 5-3(360~395줄).

점검할 것(심각도 높음/중간/낮음으로, 파일:줄과 함께):
1. 요청 3건이 빠짐없이, 서로 모순 없이 반영됐는가. 7개 문서 사이에 남은 옛 표현(G가 canView/viewersOf를 씀, FamilyConsentChanged 구독, MoneyRequestCommand에 requestType 인자, MoneyRequestCommand를 P1로 적음, G 보호자 질문 응답)이 있는가.
2. tech-design의 MoneyRequest 엔티티(2-2), 정책 의사코드 4절(family.money_request.open_from_assistant, family.ai_notice.ack), 8-2, 8-3, 확인할 것 18~21이 서로 맞는가. "추가만" 규칙과 비서 접수 → 직원 이어 쓰기 행(follows_request_id)이 충돌하지 않는가.
3. HUB-8 결정이 G 문서(G tech-design 47줄 Conversation.notice_audience, 219·258줄)와 충돌하지 않는가. 대리인이 보호자이기도 한 경우(김태호) 처리.
4. 상태 줄에 "변경: 2026-11-03 G 요청 반영(사용자 재승인 대기)"가 고친 문서마다 있는가, 그리고 고치지 않은 문서에는 없는가(service-blueprint는 고치지 않음).
5. [사실]/[가설] 표기 누락, 근거 없는 단정.
마지막 줄에 VERDICT: OK 또는 VERDICT: REVISE.
~~~~

### p0140

2026-11-03 09:04 · 에이전트 지시 · A 코어 기획: Evenstay Core PRD·tech-design

~~~~text
Read-only check. In ~/ai/senior-lab/04-planning/ideas/pms-core-billing/ (tech-design.md, prd.md, user-stories.md, handoff.md), lines tagged "2026-11-03 G 요청" were just added to apply hub requests HUB-1,2,3,4,5,6,7,11,13,15 listed in the table under "허브 요청" at the end of ~/ai/senior-lab/04-planning/ideas/senior-ai-assistant/tech-design.md (also see its section 4-4 납부 갈래). The hub's extra requirements: HUB-3 keyDates actor must be OPTIONAL (D F6 uses current signature, see ../family-consent-portal/tech-design.md); HUB-11 keep "요금은 다음 달 1일부터" and decide as [가설] whether meal fee is based on meal records, with reasons; HUB-7 remove G as subscriber from ContractActivated, ContractSucceeded, InvoiceIssued, Payment*, Representative*, InquiryReceived only.
Check: (1) each request is actually reflected and matches G's ask; (2) arithmetic in seeds (11월 2인 30일 invoice 4,893,000; 12월 1인 2,910,000; due dates = issue + 10 days); (3) contradictions with other unchanged text in these 4 files (e.g., old "다음 납부일" rule, old plain example, event subscriber lists, 6-2/6-3 scope mapping, ADR-4 adjustment rule vs the HUB-11 adjustment approach); (4) every changed file's status line ends with "· 변경: 2026-11-03 G 요청 반영(사용자 재승인 대기)". Report only concrete problems with file:line, max 10, Korean. Do not edit.
~~~~

### p0141

2026-11-03 09:09 · 허브 지시 · G 기획: Evenstay Home 비서 최소판

~~~~text
[허브] 코어와 G 카피가 G 요청을 반영했습니다. G 문서에 맞춰 넣어 주세요(범위 `ideas/senior-ai-assistant/`, 상태 초안 유지).

코어 결과(파일 `ideas/pms-core-billing/`, 사용자 재승인 대기):
- HUB-1: `invoicesOf(residentId, actor?)` 항목마다 paymentState를 붙이고, `explainInvoice(invoiceId, actor?)` 머리에 paymentState와 hasOtherIssuedWithoutPayment를 붙였습니다. NOT_TRACKED이면 hasOther는 null입니다. 회원·대리인 경로는 ISSUED만 보고, DRAFT는 404입니다.
- HUB-2: 10절 G 행을 G 4-4 갈래로 바꿨습니다.
- HUB-3: 6-2 "계약·청구 주요 날짜 보기" 행을 더했습니다. `keyDates(residentId, at, actor?)`는 묶음마다 CHECK하고, 범위 밖이면 null과 hiddenFields[]를 돌려줍니다. 두 묶음이 다 막히면 코어가 DENIED를 남기고 DENY합니다.
- HUB-4: moveInDate는 승계 사슬의 첫 계약 기준입니다(2026-10-01).
- HUB-5: channel ASSISTANT에서는 confirmation_token이 필수이고 (channel, token)이 유일합니다.
- HUB-6: 계약 만료일 2028-09-30 [가설]이고 승계 계약이 이어받습니다. 11월 청구서는 4,893,000원(발행 11/30, 기한 12/10)입니다. 12월 결식은 12/24 세 끼이고 수납 시드는 없습니다(F16이 있으면 UNPAID, 없으면 NOT_TRACKED). F16이 있으면 hasOther는 true입니다. `/demo/reset {state: G_START}`가 있고, D 고지 확인 지우기는 D 시드 스크립트 몫입니다.
- HUB-7: G 구독을 지웠습니다.
- HUB-11: 승계 달 식비는 계약 인원 기준이고 의도입니다 [가설]. 남은 식비는 같은 승계 사슬의 다음 청구서에 조정 전표로 돌려줍니다.
- HUB-13: plain 표입니다. RECURRING `{code, plan, amount}`, MEAL `{code, days, mealsPerDay, occupancy, meals, unitPrice, amount}`, ADJUSTMENT를 더했습니다. amount는 양수 크기입니다.
- HUB-15: 배치 행위자는 actor_user_id null, actor_role SYSTEM, request_id는 배치 실행 ID입니다.

G 카피 결과(재승인 대기):
- tech-design 4-2 INVEST 행이 아직 "넘김 없음"입니다. 금전 판단 넘김으로 바꿔 주세요.
- 넘긴 이유 라벨 "입주자 요청"이 "직접 요청"으로 바뀌었습니다(MEMBER_ASKED). 기획 문서도 맞춰 주세요.
- 2-7 대리인 화면, 6절 오류(고지 실패, 고지 바뀜, 확인 기한 지남, 문의 저장 실패)를 더했습니다.

할 일:
1. 위 내용을 G 문서에 반영하세요. 해당 허브 요청은 "반영됨(사용자 재승인 대기)"로 바꾸세요.
2. prd 9절 계약 만료일 [미정]을 채우세요.
3. D(HUB-7·8·9)는 아직 진행 중입니다. "반영 대기"로 두세요.

보고: 고친 위치와 남은 것.
~~~~

### p0143

2026-11-03 09:18 · 에이전트 지시 · C 기획: Evenstay Transitions 생활 지원 단계

~~~~text
한국어로 답해 주세요. 읽기만 하고 파일은 고치지 마세요.

검토 대상: `~/ai/senior-lab/04-planning/ideas/care-stage-transition/` 의 7개 기획 문서(strategy, service-blueprint, prd, user-stories, roadmap, tech-design, handoff). 시니어 레지던스 PMS 포트폴리오의 모듈 C(생활 지원 단계 전환, Evenstay Transitions) 기획 초안입니다.

기준 문서(읽어서 대조):
- 규칙: `~/ai/senior-lab/CLAUDE.md`, `~/ai/senior-lab/04-planning/CLAUDE.md`, `~/ai/evenstay/CLAUDE.md`
- 승인된 C 카피: `~/ai/senior-lab/03-copywriting/ideas/care-stage-transition/` (names.md, copy.md, product-marketing.md, value-prop.md)
- 코어 기준(승인): `~/ai/senior-lab/04-planning/ideas/pms-core-billing/tech-design.md`(특히 2-2, 3, 4, ADR-2, 6, 8-2, 8-3, 10), `prd.md` 9절 시드
- D 건강 소식 API(승인): `~/ai/senior-lab/04-planning/ideas/family-consent-portal/tech-design.md` 2-2, 3절, 8-2 (HealthFeedCommand.post/withhold), prd.md 9절 데모 날짜
- G(초안, 참고): `~/ai/senior-lab/04-planning/ideas/senior-ai-assistant/prd.md` 9절 (2027-01-05, 12월 청구서 2,910,000원)
- B 형식 예: `~/ai/senior-lab/04-planning/ideas/safety-signal-hub/`

반드시 점검할 것:
1. 모듈 경계: transitions 스키마만 쓰는가, core/api·family/api만 쓰는가, registerPolicy는 transitions.*만인가, 보호자에게 가는 길이 D HealthFeedCommand.post뿐이고 withhold 이유가 MEMBER_REQUEST·NOT_A_HEALTH_EVENT 두 가지뿐인가, 코어가 모듈을 모르는 원칙을 어기지 않는가.
2. 하지 않을 것: 장기요양 등급 판정, 요양 급여 청구, 의료 판단, 퇴거 결정이 명시돼 있고 다른 곳에서 어기지 않는가. 평가 기록에 점수·병명·진단·추천 칸이 없는가. 시스템이 단계를 판단·추천하는 문장이 없는가.
3. 제안자 ≠ 결정자, 거처 상담은 입주자 의견 없이 결정 불가, 단계 양방향이 일관되게 반영됐는가. 상태 전이와 결정 규칙 표에 모순이나 빈틈이 있는가.
4. 단계 이름·호칭: 직원 화면 "입주자"(합쇼체), 회원 화면 "회원님"(해요체), 단계 이름이 카피와 정확히 같고 번호가 없는가. [지원 회사] 상표를 쓰지 않았는가.
5. 데모 날짜·숫자 정합: 12/2 입원 → 12/7 퇴원 → 12/8 평가 → 12/9 → 12/10 → 2027-01-12. 요일이 맞는가(2026-12-02 수 등). 입원 기간 결식 15끼 계산, 12월 청구서 2,910,000원 계산이 코어 규칙(사전 신청 결식만 감면, 식비 = 일수×3×9,000)과 맞는가. B(11/12), D(11/11 동의, 11/23 철회 장면), G(2027-01-05)와 어긋나는 곳.
6. 사실/추정/가설/미정 표기, 출처 URL·날짜, 없는 수치·인터뷰를 만들었는지, 법적 문구에 [법률 검토 전 초안] 표시.
7. 문서 사이 상호 참조(확인할 것 번호, F/US 번호, HUB 번호)가 맞는가. 7개 문서 사이 모순.
8. 각 문서 `방법:` 줄: strategy=product-strategy, service-blueprint=service-blueprint, prd=create-prd, user-stories=user-stories, roadmap=outcome-roadmap, tech-design·handoff=스킬 없음. 다른 스킬 이름을 적었는지.

출력: "꼭 고칠 것"과 "고치면 좋을 것"으로 나눠, 각 지적마다 파일:줄 또는 절, 문제, 근거(기준 문서 위치), 고칠 방향을 짧게. 최대 25건. 문제가 없으면 없다고 쓰세요. 마지막에 판정(통과 / 수정 필요).
~~~~

### p0145

2026-11-03 09:19 · 허브 지시 · G 기획: Evenstay Home 비서 최소판

~~~~text
[허브] D 기획과 D 카피가 G 요청을 반영했습니다(재승인 대기). G 문서에 맞춰 넣어 주세요(범위 `ideas/senior-ai-assistant/`, 상태 초안 유지).

**D 기획** (`ideas/family-consent-portal/`)
- HUB-7: canView의 사용처는 B만 남았습니다. viewersOf는 "G는 쓰지 않음, Next 도구 후보"로 바뀌었고, FamilyConsentChanged의 구독자에서 G가 빠졌습니다.
- HUB-8: 대리인도 회원용(MEMBER) 고지 판을 확인합니다 [가설].
  - 확인은 사람마다 한 번 합니다. 보호자 판(GUARDIAN v1)을 확인한 것은 비서 확인으로 세지 않습니다.
  - `AiNoticeCommand.acknowledge`에 기록용 선택 인자 `actingAs`가 추가됐습니다. G는 대리인일 때 이 값을 넘겨야 합니다.
  - 대안은 REPRESENTATIVE 대상입니다(법률 검토 결과에 따라).
- HUB-9: `MoneyRequestCommand.open({residentId, sourceRef, note})`로 종류 인자가 없습니다.
  - D가 OTHER로 저장하고, note는 회원 말 원문입니다. D는 저장 전에 숫자 4자리 이상을 가립니다 [가설].
  - **회원 본인만 부를 수 있습니다.** 대리인이 돈 이야기를 넘기면 G 넘김에 남고, 직원이 금전 부탁 화면에서 접수합니다.
  - 직원이 유형을 골라 처리한 기록은 원래 접수에 이어 붙이고, 두 기록을 1건으로 셉니다.

**D 카피 HUB-14** (`03-copywriting/ideas/family-consent-portal/copy.md`)
- 음성은 저장하지 않습니다. 원문은 1년 뒤 지웁니다.
- 비서 고지 문구를 ADR-G1에 맞췄습니다. 비서 1은 이렇게 바뀌었습니다: "…말로 물으시면, 무엇을 물으셨는지 알아듣는 데 AI를 써요. 답은 AI가 쓰지 않고, 입주 계약과 청구서에 적힌 내용으로 바로 드려요."
- 3-3 6항에 "조회한 기록은 AI에 전송하지 않습니다"가 들어갔습니다.
- 고지 판은 v2를 유지하는 것으로 제안했고, 사용자 확인을 기다립니다.

**할 일**
1. HUB-7(D)·8·9·14를 "반영됨(사용자 재승인 대기)"로 바꾸세요.
2. G 문서 중 대리인 고지, 금전 넘김(대리인 경로), 고지 문구 인용이 있는 곳을 맞추세요.
3. 다시 검토하지 않은 변경이 두 차례 쌓였습니다. 검토 에이전트로 한 번 점검하고 지적을 반영하세요.

**보고**: 고친 위치, 검토 지적과 반영 여부, 남은 것.
~~~~

### p0146

2026-11-03 09:21 · 에이전트 지시 · G 기획: Evenstay Home 비서 최소판

~~~~text
You are reviewing Korean planning documents. Do NOT edit any file; read only. Reply in Korean.

Target: the 7 docs in ~/ai/senior-lab/04-planning/ideas/senior-ai-assistant/ (strategy.md, service-blueprint.md, prd.md, user-stories.md, roadmap.md, tech-design.md, handoff.md). They plan "Evenstay Home 비서" (module G): an AI assistant for senior residents. The LLM only routes intent; answers come from server templates filled with core tool results; writes need a one-time confirmation token. These docs were edited three times today without re-review:
1. The 확인할 것 sections were reorganized into "결정됨 [가설] / 반영 대기 / 남은 것", and [제안] tags became [가설].
2. Core (A) and G copy results were synced in: paymentState, keyDates(actor) + hiddenFields, plain fields incl. ADJUSTMENT, G_START reset, SYSTEM batch actor, the MEMBER_ASKED label "직접 요청", and the INVEST intent now handing off as MONEY.
3. D results were synced in: representatives acknowledge the MEMBER notice version with actingAs; MoneyRequestCommand.open({residentId, sourceRef, note}) is callable by the resident only; the D notice copy changed (비서 1, 3-3 6항).

Reference docs (current versions, read the relevant parts):
- Core: ~/ai/senior-lab/04-planning/ideas/pms-core-billing/tech-design.md (sections 2-2, 4 plain table, 6-2, 8-1, 8-2 BillingQuery/ContractQuery/InquiryCommand, 10 G row, 확인할 것 16-18) and prd.md section 9 seed.
- D: ~/ai/senior-lab/04-planning/ideas/family-consent-portal/tech-design.md (8-2 AiNoticeQuery/AiNoticeCommand/MoneyRequestCommand, 확인할 것 18-20).
- G copy: ~/ai/senior-lab/03-copywriting/ideas/senior-ai-assistant/copy.md and names.md.
- D copy section 3: ~/ai/senior-lab/03-copywriting/ideas/family-consent-portal/copy.md.
Some files are large; read them with offset/limit or grep.

Find:
(a) contradictions between the 7 G docs: numbers, dates, amounts, statuses, API signatures, intent/reason names, priorities, which items are "decided" vs "remaining", and HUB-n statuses;
(b) mismatches between the G docs and the reference docs above;
(c) stale text left from earlier rounds, e.g. "[제안]", "반영 대기" where the item is already reflected, old labels like "입주자 요청", old fallback paths, "[NEED: 카피]" where the copy now exists;
(d) broken cross-references (section numbers, 확인할 것 numbers, US/F numbers).

Do not judge product direction or style. Report only concrete defects, each with file:line, quoted text, what it conflicts with (file:line), and a suggested fix. Group them as 꼭 고칠 것 / 고치면 좋을 것 / 사소한 것. Keep it under about 60 lines. If something only looks wrong but you cannot confirm it, say so.
~~~~

### p0148

2026-11-03 09:35 · 사용자 · 시니어 서비스 MVP 기획 환경 구성

~~~~text
모두 재승인 (Recommended)
~~~~

### p0149

2026-11-03 09:35 · 사용자 · 시니어 서비스 MVP 기획 환경 구성

~~~~text
제안값으로 확정 (Recommended)
~~~~

### p0150

2026-11-03 09:37 · 허브 지시 · A 코어 기획: Evenstay Core PRD·tech-design

~~~~text
[허브] 코어 G 반영분 9건은 사용자가 재승인했습니다(2026-11-03). 상태 줄은 허브가 "(사용자 재승인 2026-11-03)"으로 바꿨습니다. 이어서 C 기획의 코어 요청 HUB-C1~C9를 반영해 주세요. C 결정 1~6은 제안값으로 확정됐습니다 [가설].

범위: `ideas/pms-core-billing/`만. 고친 문서의 상태 줄에 `변경: 2026-11-03 C 요청 반영(사용자 재승인 대기)`를 덧붙이세요. 스킬은 Skill 도구로 호출하고 `방법:` 줄에는 실제로 호출한 것만 적으세요. shared/와 evenstay는 고치지 마세요.
원문: `ideas/care-stage-transition/tech-design.md` 허브 요청 표 HUB-C1~C9.

요점
- C1: 10절 C 줄에 moveInDate(첫 계약 기준)를 쓴다고 적으세요.
- C2: 시드는 그대로 둡니다. 15절에 입원 기간 식비 처리를 [미정], [NEED: 계약서 식비 조항]으로 한 줄 적으세요.
- C3: 6-3 대리 범위 표에 `transitions.member.view`, `transitions.review_request.create` → SIGN_CONTRACT를 넣으세요.
- C4: `requestAmendment`(Next)는 reasonRef = C 결정 ID, effectiveDate = 매월 1일입니다. 단계 요금은 RECURRING_FEE 요금 플랜으로 [가설]. 고정 요금표 판에 그 플랜이 없을 때는 [미정]입니다.
- C5: 10절 transitions 줄, 8-3 ContractTerminationRequested에서 C 빼기, 8-2 쓰는 모듈 칸에 C를 넣으세요.
- C6: "확인할 일"은 app/이 모듈 api/를 붙여 조립한다는 원칙을 적으세요. evenstay CLAUDE.md 한 줄은 허브가 넣습니다.
- C7: platform 아웃박스의 `available_at`을 넣으세요.
- C8: `/demo/reset`의 AFTER_SUCCESSION·G_START에서 C 시드 스크립트가 같이 도는 방식을 적으세요. C 시작점도 함께 적으세요.
- C9: `RepresentationQuery.representativesOf(residentId, at)`를 추가하세요.

함께 할 것: 본문에 남은 "재승인 대기" 표시 가운데 G 반영분은 "재승인됨(2026-11-03)"으로 정리하세요(handoff 6과 만료일 포함).

보고: 요청별 반영 위치, 결정한 것, D·G·C에 영향 가는 것, 재승인할 변경 목록.
~~~~

### p0151

2026-11-03 09:37 · 허브 지시 · D 기획: Evenstay Family 보호자 포털·동의

~~~~text
[허브] D 기획의 G 반영분(HUB-7·8·9)은 사용자가 재승인했습니다(2026-11-03). 상태 줄은 허브가 고쳤습니다. 이어서 C 기획의 D 요청 HUB-D1~D3을 반영해 주세요. C 결정 1(종류 2개 추가)은 확정됐습니다 [가설].

범위: `ideas/family-consent-portal/`만. 고친 문서의 상태 줄에 `변경: 2026-11-03 C 요청 반영(사용자 재승인 대기)`를 덧붙이세요. 스킬은 Skill 도구로 호출하세요. 카피와 shared/는 고치지 마세요.
원문: `ideas/care-stage-transition/tech-design.md` HUB-D1~D3.

할 일
- D1: `HealthEvent.kind`에 `CARE_STAGE_CHANGE`(생활 지원 단계가 바뀐 일)와 `EXTERNAL_CARE_START`(다른 기관 돌봄이 시작된 일)를 추가하세요. `EXTERNAL_CARE_END`는 Next입니다.
  - B와 같은 규칙을 따릅니다: post 멱등, 진단명 거부, withhold 이유 2개.
  - 라벨은 D 카피 names.md 1-1 몫입니다. 허브가 D 카피에 보냅니다.
- D2: 데모 시드를 확인하세요. 김지민의 건강 별도 동의(11/11)가 12/10까지 유지되고, 11/23 철회는 김태호의 생활 소식뿐인지 봐 주세요.
- D3: 8-2 "쓰는 모듈"에 C를 넣으세요(viewersOf·withhold 포함). 8-3 HealthEventWithheld 구독자에 C(P1)를 더하세요.

함께 할 것: 본문에 남은 G 반영분 "재승인 대기" 표시를 "재승인됨(2026-11-03)"으로 정리하세요. 지난번 검토 지적 6건을 고친 뒤에는 다시 검토하지 않았으니, 이번 변경까지 묶어 검토 에이전트로 한 번 점검하세요.

보고: 반영 위치, D2 확인 결과, 검토 지적과 반영 여부.
~~~~

### p0154

2026-11-03 09:38 · 허브 지시 · G 기획: Evenstay Home 비서 최소판

~~~~text
[허브] 사용자가 G 라운드 반영분을 모두 재승인했습니다(2026-11-03). 범위는 코어·D 기획·D 카피(고지 판 v2 유지 포함)·G 카피(HUB-10·16)입니다. G 문서에 남은 "반영됨(사용자 재승인 대기)"와 "재승인 대기"를 "반영됨(재승인 2026-11-03)"으로 정리해 주세요. 문서 상태는 초안을 유지합니다. 범위는 `ideas/senior-ai-assistant/`입니다.

C 기획 요청 HUB-G2도 반영해 주세요.
- Next 도구 후보에 "내 생활 지원 단계 설명" = `transitions/api CareStageQuery.memberView`(읽기만)를 추가하세요. 고영향 AI 여부는 다시 검토할 대상으로 표시하세요.
- `roadmap.md`의 "다음 단계 조건 설명"은 단계에 위아래가 있는 것처럼 읽힙니다. "단계가 바뀌는 때 설명"으로 바꿔 주세요.
- G 카피 2-4의 [허브 확인]에 대한 답: 조정 항목은 데모 12월 청구서에 들어가지 않으므로 2,910,000원 그대로입니다. 이 답은 허브가 G 카피에 따로 전달합니다.

이 반영이 끝나고 코어·D의 C 요청까지 반영되면 G 기획 승인을 사용자에게 올립니다. 승인 전에 남은 것이 "법률 검토"와 "판단·[미정]"뿐인지 확인한 결과를 보고에 함께 적어 주세요.
~~~~

### p0155

2026-11-03 09:38 · 허브 지시 · C 기획: Evenstay Transitions 생활 지원 단계

~~~~text
[허브] 사용자가 C 기획 prd 확인할 것 1~6을 제안값으로 확정했습니다(2026-11-03, [가설]). 확정된 내용은 다음과 같습니다.
- 건강 소식 종류 2개 추가
- 결정자는 SITE_MANAGER 또는 HQ_MANAGER, 자기 제안은 결정할 수 없음
- 계약 변경 요청은 C가 기록하고, app/에서 경리 "확인할 일"로 보여 줌
- 요금 묶음을 비교해 계약 변경 요청을 만들고, 외부 돌봄 병행·거처 상담은 이전 단계 것을 이어받음
- 12월 입원 기간 결식은 시드에 넣지 않음
- 운영값은 [가설]로 둠

이 결정은 shared/decisions.md에 기록했습니다. HUB-S1·S2는 허브가 처리했습니다(45행 표시도 정리). 나머지 허브 요청은 이렇게 보냈습니다: C1~C9는 코어 세션, D1~D3은 D 기획, D1 라벨은 D 카피, G2는 G 기획, K1~K5는 C 카피.

할 일(범위 `ideas/care-stage-transition/`, 상태 초안 유지)
1. 7개 문서의 확인할 것을 "결정됨 [가설] / 반영 대기 / 남은 것"으로 정리하세요. 확인할 것 7~12 중 제안이 있는 것도 제안값을 [가설]로 확정한 것으로 봅니다. 사용자 판단이 따로 필요한 것만 남기세요.
2. 허브 요청 표에 처리 상태를 붙이세요. S1·S2는 "처리됨", 나머지는 "반영 대기"입니다.
3. 지적 24건을 고친 뒤 다시 검토하지 않았습니다. 정리를 마친 다음 검토 에이전트로 한 번 점검하고 지적을 반영하세요.

보고: 정리 결과, 남은 것, 검토 지적과 반영 여부.
~~~~

### p0157

2026-11-03 09:40 · 에이전트 지시 · C 기획: Evenstay Transitions 생활 지원 단계

~~~~text
한국어로 답해 주세요. 읽기만 하고 파일은 고치지 마세요.

대상: `~/ai/senior-lab/04-planning/ideas/care-stage-transition/` 7개 문서(strategy, service-blueprint, prd, user-stories, roadmap, tech-design, handoff). 시니어 레지던스 PMS 포트폴리오의 모듈 C(생활 지원 단계 전환) 기획 초안입니다. 1차 검토 지적 24건을 고쳤고, 그 뒤 각 문서의 "확인할 것"을 "결정됨 [가설] / 반영 대기 / 남은 것"으로 정리했습니다. 이번 검토는 (1) 고친 내용이 새 모순을 만들지 않았는지, (2) 정리가 맞는지를 봅니다.

1차 검토에서 고친 것(맞게 고쳐졌는지 확인):
- 겹침: 화요일 목욕 구간을 1/11에 닫고 목요일 구간을 1/14에 연다.
- ServiceSlot 제약에 시간 구간을 넣었다(하루 두 번 약 챙기기 허용).
- 12월 결식은 코어 시드(12/24 세 끼) 그대로 쓰고, 입원 기간 결식은 시드에 넣지 않는다.
- 데모 순서: D 1~2 → B → D 3~5 → C 1~5 → G(G_START) → C 6.
- 정책에 self 판정을 넣었다.
- 요금 묶음(fee_group)을 비교하고, KEEP_CURRENT 단계(외부 돌봄 병행·거처 상담)는 이어받는다.
- 프런트·대리인의 회원 화면 열람은 SENSITIVE_READ로 남긴다.
- 대리인 목록 API를 HUB-C9로 요청했다.
- 그 밖에 platform import 허용, 복합 FK, 정책 → 앱 → DB 순서, NOT_A_HEALTH_EVENT 미사용, revision 1 고정, 법령 출처를 바꿨다.

정리 기준(허브 지시):
- prd 확인할 것 1~6은 사용자가 제안값으로 확정했다.
- 7~12와 다른 문서의 제안값은 [가설]로 확정한 것으로 본다.
- 사용자 판단이 따로 필요한 것만 남긴다.
- tech-design 허브 요청 표: HUB-S1·S2는 "처리됨", 나머지는 "반영 대기".

대조할 기준 문서:
- 승인된 C 카피: `~/ai/senior-lab/03-copywriting/ideas/care-stage-transition/` (names.md, copy.md)
- 코어: `~/ai/senior-lab/04-planning/ideas/pms-core-billing/tech-design.md`, `prd.md` 9절
- D: `~/ai/senior-lab/04-planning/ideas/family-consent-portal/tech-design.md` 4절 정책, 8-2
- 규칙: `~/ai/evenstay/CLAUDE.md`, `~/ai/senior-lab/04-planning/CLAUDE.md`

중점 점검 항목:
1. KEEP_CURRENT·fee_group 도입이 상태 전이, 결정 트랜잭션, 회원 화면("더해진 도움"), 건강 소식 본문, 단계 정의 화면, 테스트 표와 어긋나지 않는가. 특히 기본 서비스 → 거처 상담, 거처 상담 → 기본 서비스처럼 이어받기와 되돌리기가 섞인 경로.
2. 날짜·숫자: 1/11, 1/14, 12/24, 2,910,000원, 요일.
3. 문서 사이 번호(F, US, HUB, 확인할 것 번호)와 상태 표시가 일관된가. 아직 "사용자 결정 필요"나 "제안" 표시가 남은 곳이 있는가.
4. 모듈 경계, 하지 않을 것(장기요양 등급 판정, 요양 급여 청구, 의료 판단, 퇴거 결정), 호칭(직원 화면 "입주자", 회원 화면 "회원님"), 단계 이름, 표기([사실]/[추정]/[가설]/[미정]).

출력:
- "꼭 고칠 것"과 "고치면 좋을 것"으로 나눕니다.
- 각 지적에 파일:줄, 문제, 근거, 고칠 방향을 짧게 씁니다. 최대 15건.
- 마지막에 판정(통과 / 수정 필요)을 적습니다.
~~~~

### p0158

2026-11-03 09:40 · 에이전트 지시 · A 코어 기획: Evenstay Core PRD·tech-design

~~~~text
Read-only check, Korean report, max 8 concrete problems with file:line. In ~/ai/senior-lab/04-planning/ideas/pms-core-billing/ (tech-design.md, prd.md, user-stories.md, handoff.md), lines tagged "2026-11-03 C 요청" apply hub requests HUB-C1..C9 from the "허브 요청" table near the end of ~/ai/senior-lab/04-planning/ideas/care-stage-transition/tech-design.md (lines ~418-426). Also check C's prd.md 9절 seed start points ("퇴원 후", "결정 후") match what core wrote. Hub's summary: C1 10절 C row notes moveInDate first-contract basis; C2 seed unchanged + prd 15절 one line [미정]+[NEED: 계약서 식비 조항]; C3 6-3 transitions.member.view & transitions.review_request.create → SIGN_CONTRACT; C4 requestAmendment reasonRef=C decision ID, effectiveDate=1st of month, stage fee as RECURRING_FEE plan [가설], plan missing from locked pricing version [미정]; C5 10절 transitions row text, remove C from 8-3 ContractTerminationRequested, add C to 8-2 users of GuardianQuery/StaffQuery/RepresentationQuery; C6 '확인할 일' assembled by app/ from module api/; C7 outbox available_at; C8 /demo/reset runs C seed script for AFTER_SUCCESSION/G_START plus C start points; C9 RepresentationQuery.representativesOf(residentId, at). Also: G-related "재승인 대기" marks in body should now read "재승인됨(2026-11-03)" (only C items may say 재승인 대기); each of the 4 files' status line ends with "· 변경: 2026-11-03 C 요청 반영(사용자 재승인 대기)". Look for contradictions with unchanged text (e.g., other places listing C as an event subscriber, 6-2 table, ADR-3 'core knows no module' vs reset orchestration, outbox description elsewhere). Do not edit.
~~~~

### p0159

2026-11-03 09:41 · 에이전트 지시 · D 기획: Evenstay Family 보호자 포털·동의

~~~~text
한국어로 답하라. 읽기 전용 검토다(파일 수정 금지).

대상: ~/ai/senior-lab/04-planning/ideas/family-consent-portal/ 의 7개 문서(strategy, service-blueprint, prd, user-stories, roadmap, tech-design, handoff).

이번 점검 범위는 두 묶음이다.
(1) G 요청 반영분(G HUB-7·8·9, 사용자 재승인됨). 지난 검토가 짚은 6건을 고쳤는데 고친 뒤 다시 보지 않았다. 고친 내용: tech-design 6-2 역할표 "AI 고지 확인" 대리인 칸 ◐; AiNoticeAck 규칙(같은 사람은 역할과 상관없이 MEMBER 판 확인 한 번, 다른 사람끼리는 대신 못 함, acting_as는 기록용); `AiNoticeCommand.acknowledge(..., actingAs?)`; MoneyRequest 비서 접수 규칙(follows_request_id 유일, 이어 쓴 행 channel = 원행, 사슬 1건 집계, 확인할 일 = 이어 쓴 행 없는 ASSISTANT 행, note 숫자 4자리 이상 가림); 7절 "저장 안 함" 줄; 8-2 MoneyRequestCommand "회원 본인만"; 11절 테스트 2행(고지 확인 결정표, 비서 금전 접수); `/me/ai-notice` 비고; 확인할 것 18~21; prd 1절 요약, roadmap 9줄·27줄, strategy 63줄의 G 표현; US-15 5·6번; handoff "G에" 요청.
(2) C 요청 반영분(C HUB-D1~D3, 원문: ~/ai/senior-lab/04-planning/ideas/care-stage-transition/tech-design.md 427~429줄, C의 D 사용은 같은 파일 17, 306, 333~341, 369~372줄).
- D1: HealthEvent.kind에 CARE_STAGE_CHANGE, EXTERNAL_CARE_START(C P1) 추가, EXTERNAL_CARE_END는 Next. B와 같은 규칙(post 멱등, 진단명 거부, withhold 이유 2개). 라벨은 카피 names.md 1-1 몫.
- D2: 데모 시드 확인 — 김지민 건강 별도 동의(11/11)가 12/10까지 유지되고 11/23 철회는 김태호 생활 소식뿐인지. prd 9절 진행표와 tech-design 3-3(동의한 날 이후 규칙)으로 직접 따져 보라.
- D3: 8-2 viewersOf·withhold 쓰는 모듈에 C, 8-3 HealthEventWithheld 구독자에 C(P1).
- 본문의 G 반영분 "재승인 대기" 표시를 "재승인됨(2026-11-03)"으로 바꿨다. C 반영분은 "사용자 재승인 대기"다. 상태 줄에 "변경: 2026-11-03 C 요청 반영(사용자 재승인 대기)"가 고친 문서(prd, user-stories, roadmap, tech-design, handoff)에만 있어야 한다.

점검할 것(심각도 높음/중간/낮음, 파일:줄과 함께):
1. 지난 6건의 수정이 서로, 그리고 G 문서(~/ai/senior-lab/04-planning/ideas/senior-ai-assistant/tech-design.md)와 모순 없이 맞는가. 새로 생긴 빈틈.
2. C 반영이 빠짐없고 C 문서와 맞는가. C가 보내는 withhold 인자(334줄: heardByUserId·heardAt = 설명 행, requestedByKind SELF, involvesEmergencyCall false, summaryLine·body)가 D 8-2 withhold 규칙과 맞는가. NOT_A_HEALTH_EVENT 하위 코드(DEVICE_TEST 등)가 C에 맞는지. C 종류가 HEALTH_EVENT 항목 안에서 별도 동의 규칙을 그대로 타는지.
3. 남은 "재승인 대기" 표시가 맞는 곳에만 있는가. 옛 표현 잔재.
4. [사실]/[가설] 표기 누락, 근거 없는 단정.
마지막 줄에 VERDICT: OK 또는 VERDICT: REVISE.
~~~~

### p0161

2026-11-03 09:46 · 허브 지시 · G 기획: Evenstay Home 비서 최소판

~~~~text
[허브] 코어가 C 요청을 반영하면서 데모 초기화 방식을 바꿨습니다(재승인 대기). G 문서도 맞춰 주세요. 범위는 `ideas/senior-ai-assistant/`이고, 문서 상태는 초안 그대로 둡니다.

바뀐 점
- `/demo/reset`은 이제 `app/` 데모 라우트가 조율합니다. core → B → D → G → C 순서로 각 모듈 `<모듈>/seed`의 `reset(state)`를 부릅니다.
- 상태 목록은 루트 `seed/`에 있는 세 개입니다: AFTER_SUCCESSION, G_START, C_AFTER_DISCHARGE.
- 모듈은 자기와 상관없는 상태를 받으면 AFTER_SUCCESSION 데이터를 둡니다. G 시드는 C_AFTER_DISCHARGE를 받으면 대화와 넘김을 비워 둡니다.
- 모르는 상태 이름은 400으로 거부합니다.
- 아웃박스는 모듈별 테이블을 쓰고, 공통 구현은 platform 것을 같이 씁니다. 최소판 G는 발행하지 않으니 해당이 없는지만 확인해 주세요.

할 일: tech-design 8절의 데모 초기화 문장에서 "코어 `/demo/reset {state: G_START}`"를 위 방식으로 고쳐 주세요. 보고는 고친 줄만 적어 주세요.
~~~~

### p0162

2026-11-03 09:48 · 허브 지시 · C 기획: Evenstay Transitions 생활 지원 단계

~~~~text
[허브] 코어가 HUB-C1~C9를 반영했습니다(재승인 대기). C 문서에 맞춰 주세요(범위 `ideas/care-stage-transition/`). 검토 반영과 함께 처리해도 됩니다.

**바뀐 점**
- **C8 데모 초기화**: `/demo/reset` 조율은 `app/` 데모 라우트가 맡습니다.
  - 순서는 core → B → D → G → C이고, 각 `<모듈>/seed`의 `reset(state)`를 부릅니다.
  - 상태 목록은 루트 `seed/`에 있습니다: AFTER_SUCCESSION(시계 2026-11-10), G_START, C_AFTER_DISCHARGE(승계 후 + 11월 청구서 + 시계 12/7 저녁, 12월 결식은 아직 없음). C 문서의 "퇴원 후"는 C_AFTER_DISCHARGE로 부르세요.
  - 모듈은 자기와 상관없는 상태를 받으면 AFTER_SUCCESSION 데이터를 둡니다. 모르는 상태 이름은 400입니다.
- **C6 확인할 일**: 코어에 `TodoQuery.itemsOf(siteId, at, actor)`가 새로 생겼습니다. app/이 코어 TodoQuery와 C `TransitionsInboxQuery`를 붙여 대시보드 "확인할 일"을 만듭니다.
- **C7 아웃박스**: available_at·attempts·last_error 열을 둡니다. 테이블은 모듈마다 자기 스키마에 두고, 구현은 platform 것을 같이 씁니다. C가 5회 실패하면 FEED_FAILED입니다.
- **C4 계약 변경**: `requestAmendment`(Next)의 effectiveDate는 매월 1일만 받습니다. 단계 요금은 RECURRING_FEE 요금 플랜 [가설]입니다. 고정 요금표 판에 그 플랜이 없을 때는 [미정]입니다(코어 확인할 것 19).
- **C3**: `transitions.member.view`와 `review_request.create`는 SIGN_CONTRACT가 필요합니다. 김태호는 거부됩니다.
- **C9**: `representativesOf(residentId, at)`가 추가됐습니다.
- **C2**: 시드는 그대로입니다. 입원 기간 식비 처리는 [미정]이고 [NEED: 계약서 식비 조항]입니다.

**할 일**: 이 반영분 상태를 "반영됨(사용자 재승인 대기)"로 바꾸고, 관련 문장을 맞추세요. D·C 카피 결과는 따로 보내 드립니다.
~~~~

### p0163

2026-11-03 09:50 · 허브 지시 · C 기획: Evenstay Transitions 생활 지원 단계

~~~~text
[허브] C 카피와 D 카피가 C 요청을 반영했습니다(재승인 대기). C 기획을 마무리해 주세요. 범위는 `ideas/care-stage-transition/`이고, 상태는 초안을 유지합니다.

C 카피(`03-copywriting/ideas/care-stage-transition/`)
- K1 새 문구 위치:
  - 평가 정정: 2-2, 5절
  - 막힘 오류 2개: 5절 [가설]
  - 겹침 경고: 2-5
  - 다시 살펴본 뒤: 2-4, 3-4
  - 경리 [확인함]: 2-4, 7일 [가설]
  - 가족에게 알리지 않기 체크: 2-3, 2-5, 2-4, 3-1
  - 대리인 화면: 새 3-8
  - 입주자 단계 요약: 새 2-7
  - 외부 돌봄 시작 상세: 4절
  - 결정자 문구: 5절
- K2 시드 이름(박서준, 김하진, 최영미), K3, K4(김태호 "건강 소식 동의 없음")를 반영했습니다. K5는 남은 것으로 둡니다.
- 요청 밖에서 함께 고친 것:
  - 결정자 SITE_MANAGER/HQ_MANAGER [가설]
  - 정기 살펴보기 주기는 Next
  - 외부 전문가 의견 원문은 저장하지 않음
  - "열린 제안"을 작성 중, 설명 전, 결정 대기로 넓힘
- 남은 [미정]: 경리 처리 메모를 필수로 할지

D 카피
- names.md 1-1에 라벨 2줄을 넣었습니다(C 7절과 같음). 4-4 목록 예시는 C 4절 문장 그대로입니다.
- 회원 설명 2-3 항목 4와 2-4 법적 문구 3(제공 항목)에 단계 변경과 외부 돌봄 시작을 넣었습니다.
- 7절에 "제공 항목이 늘 때 이미 동의한 회원에게 다시 동의를 받을지"를 검토할 점으로 더했습니다.

D 기획: D1~D3 반영(재승인 대기).

할 일
1. HUB-K1~K4, D1~D3을 "반영됨(사용자 재승인 대기)"로 바꾸세요. K5는 "남은 것"으로 둡니다. [NEED: 카피] 자리는 카피 절 번호로 채우세요.
2. 두 번째 검토 에이전트 결과를 받았다면 반영하세요. 받지 못했다면 지금 문서 7개를 대상으로 검토 에이전트를 한 번 돌려 지적을 반영하세요.
3. 승인 전에 남은 것이 "법률 검토", "[미정] 판단", "[NEED] 외부 자료"뿐인지 확인하세요.

보고: 검토 지적과 반영 여부, 남은 것 목록, 승인 준비가 됐는지.
~~~~

### p0164

2026-11-03 09:50 · 허브 지시 · D 기획: Evenstay Family 보호자 포털·동의

~~~~text
[허브] D 기획에서 C 반영분과 묶음 검토 지적을 고친 것을 확인했습니다. 재승인을 올리기 전에 마지막 점검을 한 번 부탁드립니다. 범위는 `ideas/family-consent-portal/`입니다.
1. 검토 에이전트로 지금 문서를 다시 점검하세요. 이번 수정분(G·C 반영과 지적 반영)이 대상입니다.
   - D 카피와 맞는지 함께 보세요(`03-copywriting/ideas/family-consent-portal/`). D 카피에는 names.md 1-1에 C 종류 2개, copy 2-3 항목 4와 2-4 법적 문구 3 제공 항목, 7절 "제공 항목이 늘 때 재동의 여부"가 들어갔습니다.
   - 코어 C 반영분과도 맞는지 보세요. `/demo/reset` 조율 주체가 `app/`이 되었고, 상태는 AFTER_SUCCESSION, G_START, C_AFTER_DISCHARGE 세 개입니다. C_AFTER_DISCHARGE에서는 D 데이터가 AFTER_SUCCESSION 데이터로 유지됩니다.
2. 지적을 반영하세요. 높음 지적이 없으면 거기서 끝냅니다.
보고: 지적 수와 반영 여부, 재승인할 변경 목록(G 반영분 다음에 생긴 것만).
~~~~

### p0165

2026-11-03 09:51 · 에이전트 지시 · D 기획: Evenstay Family 보호자 포털·동의

~~~~text
한국어로 답하라. 읽기 전용 검토다(파일 수정 금지). 재승인 전 마지막 점검이다.

대상: ~/ai/senior-lab/04-planning/ideas/family-consent-portal/ 7개 문서. 특히 오늘 들어간 수정분: G 요청 반영(G HUB-7·8·9, 재승인됨), C 요청 반영(HUB-D1~D3, 재승인 대기), 그리고 두 번의 검토 지적 반영. 바뀐 곳: tech-design 2-1·2-2(HealthEvent kind, HealthEventWithhold, AiNoticeAck, MoneyRequest), ADR-F4, 4절 정책, 6-2, 7절, 8-1 withhold 줄, 8-2, 8-3, 11절 테스트·배포, 확인할 것 18~24; prd F8·F10·F13, 9절 "시드 초기화 시작점" 표와 C 데모 문단, 확인할 것 17·18; user-stories US-11 8번, US-14 7번, US-15 5·6번; roadmap Next G·C 행과 그림; strategy 5절·7절; handoff.

함께 대조할 것:
(A) D 카피: ~/ai/senior-lab/03-copywriting/ideas/family-consent-portal/ (copy.md, names.md). names.md 1-1에 C 종류 2개, copy.md 2-3 항목 4, 2-4 법적 문구 3 제공 항목, 7절 "제공 항목이 늘 때 재동의 여부"가 새로 들어갔다. D 기획 문서가 이것과 맞는지(용어, 제공 항목 범위, 재동의 [법률 검토] 항목이 D 기획의 법률 검토 목록·user-stories 확인할 것에 반영돼 있는지, 3-1 대리인 한 줄 요청 상태).
(B) 코어: ~/ai/senior-lab/04-planning/ideas/pms-core-billing/tech-design.md 391줄 `/demo/reset` 규칙(조율 주체 `app/`, 상태 AFTER_SUCCESSION·G_START·C_AFTER_DISCHARGE, "각 모듈은 목록의 모든 상태를 자기 시작점으로 바꾼다. 자기와 상관없는 상태는 AFTER_SUCCESSION의 자기 데이터로 둔다(예: C_AFTER_DISCHARGE에서 D는 김지민의 건강 별도 동의를 그대로 둔다)"), 같은 파일 526줄, prd.md 128줄. D prd 9절 표는 C_AFTER_DISCHARGE = D 데모 끝 상태(김지민 허락·별도 동의 유지), AFTER_SUCCESSION = D 1단계 직전(허락 없음)으로 정했다. 이것이 코어 규칙과 충돌하는지, 충돌하면 어느 쪽 문서를 고쳐야 C 12/10 장면(김지민에게 C 소식이 보임)과 D 1단계(허락 없음에서 시작)가 둘 다 성립하는지 판단하라. G_START에서 D가 할 일(이은숙 ASSISTANT 고지 확인 없음, 코어 391줄)과 D 표가 맞는지.
(C) C·G 문서와의 일관성: ~/ai/senior-lab/04-planning/ideas/care-stage-transition/tech-design.md(17, 306, 333~341, 369~372, 425~429줄), prd.md 124·137줄; ~/ai/senior-lab/04-planning/ideas/senior-ai-assistant/tech-design.md, prd.md 103줄.

점검: 모순, 빠진 반영, 옛 표현, [사실]/[가설]/[법률 검토] 표기 누락, 상태 줄(C 반영 줄은 prd·user-stories·roadmap·tech-design·handoff에만). 각 지적에 심각도(높음/중간/낮음)와 파일:줄. 높음은 "구현하거나 데모하면 실제로 깨지거나 문서끼리 정면으로 모순"일 때만 쓴다. 마지막 줄에 VERDICT: OK 또는 VERDICT: REVISE.
~~~~

### p0166

2026-11-03 09:51 · 에이전트 지시 · C 기획: Evenstay Transitions 생활 지원 단계

~~~~text
한국어로 답해 주세요. 읽기만 하고 파일은 고치지 마세요.

대상: `~/ai/senior-lab/04-planning/ideas/care-stage-transition/` 7개 문서(strategy, service-blueprint, prd, user-stories, roadmap, tech-design, handoff). 시니어 레지던스 PMS 포트폴리오의 모듈 C(생활 지원 단계 전환) 기획 초안입니다. 앞서 두 번 검토했고 지적은 모두 반영했습니다. 이번 검토는 사용자 승인 전 마지막 점검입니다.

1·2차 검토 이후 바뀐 것:
- 확인할 것 정리: 결정됨 [가설] / 반영됨(사용자 재승인 대기) / 남은 것.
- 코어 반영분에 맞춤:
  - `/demo/reset` 상태 AFTER_SUCCESSION·C_AFTER_DISCHARGE·G_START, 모르는 상태 이름은 400
  - 코어 TodoQuery.itemsOf
  - 아웃박스 available_at
  - requestAmendment는 매월 1일만, 요금표 판에 플랜이 없을 때는 코어 [미정]
  - SIGN_CONTRACT
  - representativesOf
- C·D 카피 반영분에 맞춤: [NEED: 카피] 자리를 카피 절 번호로 바꿨습니다.
- 허브 요청 표 상태: C1~C9, D1~D3, G2, K1~K4는 반영됨, K5는 남은 것, S1·S2는 처리됨.

대조할 기준 문서(재승인 대기 판 포함, 지금 파일 그대로 읽으세요):
- C 카피: `~/ai/senior-lab/03-copywriting/ideas/care-stage-transition/` (copy.md 2-2~2-7, 3-1~3-8, 4~5절, 7절 끝 "2026-11-03 C 기획 반영" 표, names.md)
- D 카피·기획: `~/ai/senior-lab/03-copywriting/ideas/family-consent-portal/names.md` 1-1, `~/ai/senior-lab/04-planning/ideas/family-consent-portal/tech-design.md` 2-2, 4절, 8-2, 확인할 것 22~24
- 코어: `~/ai/senior-lab/04-planning/ideas/pms-core-billing/tech-design.md` 2-2 OutboxEvent, 6-3, 8-1 /demo/reset, 8-2(RepresentationQuery, TodoQuery, ContractCommand), 10절 C 줄, 확인할 것 19·20. `prd.md` 9절 이은숙 행, 15절
- 규칙: `~/ai/evenstay/CLAUDE.md`, `~/ai/senior-lab/CLAUDE.md`, `~/ai/senior-lab/04-planning/CLAUDE.md`

점검할 것:
1. C 문서가 카피·코어·D의 지금 문구와 어긋나는 곳. 절 번호 참조가 실제 위치를 가리키는지, 문구·숫자·이름(박서준, 김하진, 최영미, 박소연, 정하늘)이 같은지.
2. 상태 표시가 실제와 맞는지. 아직 "요청한다", "사용자 결정 필요", "[NEED: 카피]"로 남은 곳이 있는지. 남은 것은 prd 확인할 것 18뿐이어야 합니다.
3. 승인 전 남은 것이 "법률 검토", "[미정] 판단", "[NEED] 외부 자료"뿐인지. 그렇지 않은 항목이 있으면 목록으로 적어 주세요.
4. 문서 사이 모순, 1·2차에서 고친 규칙이 다시 깨진 곳. 특히 다음 경로:
   - KEEP_CURRENT·fee_group 경로
   - 서비스 시간: 열린 칸은 유지하고 없는 칸만 연다
   - 1/11·1/14
   - 데모 3단계 "설명 전" 막힘
5. 하지 않을 것 4가지(장기요양 등급 판정, 요양 급여 청구, 의료 판단, 퇴거 결정), 모듈 경계, 호칭, 단계 이름, 표기([사실]/[추정]/[가설]/[미정]), 법적 문구의 [법률 검토 전 초안].

출력 형식:
- "꼭 고칠 것"과 "고치면 좋을 것"으로 나눕니다.
- 각 지적에 파일:줄, 문제, 근거, 고칠 방향을 짧게 적습니다. 최대 12건입니다.
- 마지막에 "승인 준비"를 됨 / 안 됨으로 판정하고, 남은 것을 분류한 목록을 붙입니다.
~~~~

### p0168

2026-11-03 09:54 · 허브 지시 · C 기획: Evenstay Transitions 생활 지원 단계

~~~~text
[허브] C 카피에 빠져 있던 문구 세 개를 채웠습니다. 위치는 `03-copywriting/ideas/care-stage-transition/copy.md`입니다.
- 3-1: 이어받는 단계(외부 돌봄 병행, 거처 상담)일 때 회원 화면 줄
- 3-1: 기본 서비스로 돌아간 경우 회원 화면 줄. 제목은 "받지 않으시는 도움"입니다.
- 4절: 이 두 경우의 보호자 건강 소식 상세 줄

모두 재승인 대기 상태입니다. 검토 결과를 반영할 때 이 자리의 [NEED: 카피]도 카피 절 번호로 바꿔 주세요. 그다음 최종 보고를 보내 주세요.
~~~~

### p0169

2026-11-03 10:01 · 허브 지시 · A 코어 기획: Evenstay Core PRD·tech-design

~~~~text
[허브] D가 마지막 점검에서 코어 문서의 높음 지적 1건을 넘겼습니다. 범위는 `ideas/pms-core-billing/`이고, 이미 붙은 "C 요청 반영(사용자 재승인 대기)" 표시는 그대로 두세요.

문제가 된 곳은 `tech-design.md` 8-1 `/demo/reset` 예시입니다. 지금 문장은 "`C_AFTER_DISCHARGE`에서 D는 `AFTER_SUCCESSION` 데이터를 두고, 김지민 동의는 그대로 둔다"입니다. 그런데 D의 AFTER_SUCCESSION은 1단계 직전이라 허락이 하나도 없습니다. 그래서 이 예시를 글자대로 구현하면 12/10 C 장면에서 김지민에게 소식이 보이지 않습니다.

예시를 "각 모듈은 상태마다 자기 시작점을 정한다. 예: `C_AFTER_DISCHARGE`에서 D는 D 데모 끝 상태(김지민 건강 별도 동의 유지)를 자기 시작점으로 둔다"로 고쳐 주세요. 규칙 본문은 이미 이 뜻과 맞습니다.

"모르는 상관없는 상태 → AFTER_SUCCESSION 데이터" 같은 문장이 prd 9절, US-17, handoff에도 있다면 같은 뜻으로 맞춰 주세요.

보고는 고친 줄만 짧게 적어 주세요.
~~~~

### p0171

2026-11-03 10:01 · 허브 지시 · G 기획: Evenstay Home 비서 최소판

~~~~text
[허브] D가 G 앞으로 요청 1건을 남겼습니다. D `handoff.md` "허브에 요청할 것"에 있습니다. 범위는 `ideas/senior-ai-assistant/`이고, 문서 상태는 초안을 유지합니다.

요청 내용
- D는 비서가 넘긴 금전 부탁을 저장할 때 회원 말 원문을 가립니다 [가설]. 숫자 4개 이상은 숫자 사이의 공백, 하이픈, 점을 무시하고 가립니다. 금액 단위가 붙은 숫자는 남깁니다.
- 그런데 G 넘김(Handoff.member_message)과 대화 Turn.text에는 같은 원문이 1년 동안 남습니다.

할 일
- G가 원문 숫자를 어떻게 처리할지 [가설]로 정해 주세요. 제안: D와 같은 규칙으로 저장 전에 가린다. 화면 안내 "통장 번호나 비밀번호는 말하지 마세요"(G 카피)는 그대로 둔다.
- ADR-G9(보관), 데이터 모델, 테스트에 반영해 주세요.
- 카피 변경이 필요하면 허브 요청으로 남겨 주세요.

보고: 정한 것, 고친 위치, 승인 준비 상태.
~~~~

### p0173

2026-11-03 10:12 · 사용자 · 시니어 서비스 MVP 기획 환경 구성

~~~~text
완료됐어?
~~~~

### p0174

2026-11-03 10:12 · 사용자 · 시니어 서비스 MVP 기획 환경 구성

~~~~text
모두 재승인 (Recommended)
~~~~

### p0175

2026-11-03 10:12 · 사용자 · 시니어 서비스 MVP 기획 환경 구성

~~~~text
승인하고 인계 (Recommended)
~~~~

### p0176

2026-11-03 10:13 · 허브 지시 · G 기획: Evenstay Home 비서 최소판

~~~~text
[허브] 사용자가 G 기획을 승인했습니다(2026-11-03). 상태 줄은 허브가 `승인(2026-11-03)`으로 바꿉니다. 승인 전에 마지막으로 한 가지를 반영해 주세요. 사용자가 확정한 규칙입니다 [가설].
- 숫자 가림 예외를 넓힙니다. 금액 단위(원, 만원 등)뿐 아니라 날짜 단위(년, 월, 일)가 바로 붙은 숫자도 남깁니다. 예: "2026년 1월 10일"은 가리지 않습니다.
- G 카피가 남긴 경계 질문("2-2 들은 말"의 범위)도 이 규칙으로 답해 주세요.
- 범위는 `ideas/senior-ai-assistant/`입니다. ADR-G9, 테스트, 확인할 것 12에 반영하세요. 상태 줄은 고치지 마세요.
보고: 고친 줄만 짧게.
~~~~

### p0177

2026-11-03 10:13 · 허브 지시 · D 기획: Evenstay Family 보호자 포털·동의

~~~~text
[허브] 사용자가 D의 C 라운드 변경을 재승인했습니다(2026-11-03). 상태 줄은 허브가 바꿉니다. 마지막으로 한 가지를 반영해 주세요. 사용자가 [가설]로 확정한 규칙입니다.
- 금전 부탁 note의 숫자 가림 예외를 넓힙니다. 지금은 금액 단위(원·만원 등)가 붙은 숫자만 남기는데, 날짜 단위(년·월·일)가 바로 붙은 숫자도 남깁니다. 예를 들어 "2026년 1월 10일"은 가리지 않습니다. G와 같은 규칙입니다.
- 범위는 `ideas/family-consent-portal/`입니다. 규칙과 테스트가 있는 곳(tech-design 2-2·11절, prd F13, US-15)만 고치고, 상태 줄은 건드리지 마세요.
보고: 고친 줄만 짧게.
~~~~

### p0178

2026-11-03 10:20 · 사용자 · 시니어 서비스 MVP 기획 환경 구성

~~~~text
승인으로 표시
~~~~

### p0179

2026-11-03 10:26 · 사용자 · 시니어 서비스 MVP 기획 환경 구성

~~~~text
다음 진행할 사항 있어?
~~~~

### p0274

2026-11-03 20:18 · 허브 지시 · B 기획: Evenstay Safety 안심 알림

~~~~text
Hub request: apply the Korean staff-screen module name to the B planning docs and re-hand off to evenstay docs/safety/.
User decision (2026-11-03, replied "Yes, send all three" in the hub): staff-screen module names go to Korean. Evenstay Safety → 안심 알림. Others: Evenstay Family Admin → 보호자 포털·동의, Evenstay Assistant Admin → AI 생활 비서, Evenstay Transitions → 생활 지원 단계. Member and guardian brands and code names (safety/, Safety* types, etc.) stay as they are. The B copy session has already updated 03-copywriting/ideas/safety-signal-hub/ (copy.md, names.md, product-marketing.md, value-prop.md).

1. In 04-planning/ideas/safety-signal-hub/, change the English staff names in handoff.md, prd.md, roadmap.md, service-blueprint.md, strategy.md, tech-design.md, user-stories.md. Leave the status line as it is and add a change note only.
2. Re-hand off to evenstay/docs/safety/ per "개발 인계" in 04-planning/CLAUDE.md. Copy the updated planning docs plus the B copy files into docs/safety/ (copy/ etc.) in the same layout as before. Afterwards, check that grep 'Evenstay Safety' in docs/safety/ finds it only in change notes.

Do not do: do not edit shared/, other modules' folders, or evenstay code or design/. Do not invent numbers or facts.
Report: changed files, the skills you actually called, and the leftover grep results.
~~~~

### p0275

2026-11-03 20:18 · 허브 지시 · C 기획: Evenstay Transitions 생활 지원 단계

~~~~text
Hub request: apply the Korean staff-screen module name to the C planning docs and re-hand off to evenstay docs/transitions/.
User decision (2026-11-03, replied "Yes, send all three" in the hub): staff-screen module names go to Korean. Evenstay Transitions → 생활 지원 단계. Others: Evenstay Safety → 안심 알림, Evenstay Family Admin → 보호자 포털·동의, Evenstay Assistant Admin → AI 생활 비서. Member and guardian brands, code names (transitions/), and the screen-name rules (no stage numbers, banned words) stay as they are. The C copy session has already updated 03-copywriting/ideas/care-stage-transition/ (4 files).

1. In 04-planning/ideas/care-stage-transition/, change the English staff names in handoff.md, prd.md, roadmap.md, service-blueprint.md, strategy.md, tech-design.md, user-stories.md. Leave the status line as it is and add a change note only.
2. Re-hand off to evenstay/docs/transitions/ per "개발 인계" in 04-planning/CLAUDE.md. Copy the updated planning docs plus the C copy files in the same layout as before. Afterwards, check that grep 'Evenstay Transitions' in docs/transitions/ finds it only in change notes.

Do not do: do not edit shared/, other modules' folders, or evenstay code or design/. evenstay/transitions/CLAUDE.md already uses the Korean names, so do not touch it.
Report: changed files, the skills you actually called, and the leftover grep results.
~~~~

### p0276

2026-11-03 20:19 · 허브 지시 · D 기획: Evenstay Family 보호자 포털·동의

~~~~text
Hub request: apply the Korean staff-screen module names to the D planning docs and re-hand off to evenstay docs/family/.
User decision (2026-11-03, replied "Yes, send all three" in the hub):
- Staff-screen module names go to Korean. Evenstay Family Admin → 보호자 포털·동의. Others: Evenstay Safety → 안심 알림, Evenstay Assistant Admin → AI 생활 비서, Evenstay Transitions → 생활 지원 단계. Evenstay Family (guardian brand) and code names stay as they are.
- The D copy session also made changes in 03-copywriting/ideas/family-consent-portal/. It added consent-scope lines to FAM-06b and 06e, added the two-line note to 4-4 health news, and applied the staff-screen name (copy.md, names.md, product-marketing.md).

1. In 04-planning/ideas/family-consent-portal/, change the English staff names in service-blueprint.md and tech-design.md. If prd.md or user-stories.md describe the FAM-06b or 06e top notice differently from the new copy, align them too. Leave the status line as it is and add a change note only.
2. Re-hand off to evenstay/docs/family/ per "개발 인계" in 04-planning/CLAUDE.md. Copy the updated planning docs plus the D copy files in the same layout as before. Afterwards, check that grep 'Evenstay Family Admin' in docs/family/ finds it only in change notes.

Do not do: do not edit shared/, other modules' folders, or evenstay code or design/.
Report: changed files, the skills you actually called, and the leftover grep results.
~~~~

### p0277

2026-11-03 20:19 · 허브 지시 · G 기획: Evenstay Home 비서 최소판

~~~~text
Hub request: apply the Korean staff-screen module name to the G planning docs and re-hand off to evenstay docs/assistant/.
User decision (2026-11-03, replied "Yes, send all three" in the hub): staff-screen module names go to Korean. Evenstay Assistant Admin → AI 생활 비서. Others: Evenstay Safety → 안심 알림, Evenstay Family Admin → 보호자 포털·동의, Evenstay Transitions → 생활 지원 단계. Evenstay Home 비서 (member-facing) and code names stay as they are. The G copy session has updated 03-copywriting/ideas/senior-ai-assistant/ (copy.md, names.md, product-marketing.md). It is also changing the copy.md:338 staff error "(Evenstay Family 응답 없음)" to "(보호자 포털·동의 응답 없음)".

1. In 04-planning/ideas/senior-ai-assistant/, change the English staff names in handoff.md, service-blueprint.md, tech-design.md. If the same staff error message appears in a planning doc, use "보호자 포털·동의" there too. Leave the status line as it is and add a change note only.
2. Wait until copy.md:338 shows "보호자 포털·동의". Then re-hand off to evenstay/docs/assistant/ per "개발 인계" in 04-planning/CLAUDE.md, copying the updated planning docs plus the G copy files in the same layout as before. Afterwards, check that grep 'Evenstay Assistant Admin' in docs/assistant/ finds it only in change notes.

Do not do: do not edit shared/, other modules' folders, or evenstay code or design/.
Report: changed files, the skills you actually called, and the leftover grep results.
~~~~

### p0278

2026-11-03 20:19 · 허브 지시 · A 코어 기획: Evenstay Core PRD·tech-design

~~~~text
Hub request: re-hand off the core copy changes to evenstay docs/core/copy/.
User decision (2026-11-03, replied "Yes, send all three" in the hub). The core copy session changed two files in 03-copywriting/ideas/pms-core-billing/:
- copy.md section 3: the sentence under the bill details ends at "3월 식사는 모두 93끼예요.". The reason already appears in the discount notice line.
- names.md v3: the staff-screen column is now in Korean (안심 알림 / 보호자 포털·동의 / AI 생활 비서 / 생활 지원 단계).

1. Check whether the 04-planning/ideas/pms-core-billing/ planning docs (prd, user-stories, etc.) contain the long version of the bill-detail sentence ("그중 3끼를 드시지 않아 …") or the English staff names. If they do, align them. Leave the status line as it is and add a change note only.
2. Copy the two copy files above into evenstay/docs/core/copy/ in the same layout as before. Also update any planning docs you changed in docs/core/. Afterwards, check that grep -E 'Evenstay (Safety|Family Admin|Assistant Admin|Transitions)' in docs/core/ finds them only in change notes.

Do not do: do not edit shared/, other modules' folders, or evenstay code or design/.
Report: changed files, the skills you actually called, and the leftover grep results.
~~~~

### p0314

2026-11-03 21:01 · 허브 지시 · B 기획: Evenstay Safety 안심 알림

~~~~text
Hub request: re-hand off the B copy changes to evenstay docs/safety/copy/. The user approved the fixes ("모두 고쳐").
In 03-copywriting/ideas/safety-signal-hub/copy.md, the B copy session made these changes:
- Line 247: "앱을 쓰지 않으셔도 호출벨이나 프런트 전화(내선 0번)로 앱과 똑같이 직원을 부르실 수 있어요."
- Lines 155, 164, 165: "119 신고나 병원 이송이면" → "119에 신고했거나 병원으로 모셨다면".
1. Check whether any planning doc quotes these sentences. If one does, change it to match. Leave the status line as is and add only a change note.
2. Copy copy.md, plus any planning doc you changed, to evenstay/docs/safety/ using the same path rules as last time. Then diff each copied file against its source. The only differences should be the rewritten paths.
Report: the files you changed and the diff result.
~~~~

### p0315

2026-11-03 21:01 · 허브 지시 · D 기획: Evenstay Family 보호자 포털·동의

~~~~text
Hub request: re-hand off the D copy change to evenstay docs/family/copy/. The user approved the fix ("모두 고쳐").
In 03-copywriting/ideas/family-consent-portal/copy.md line 257, the D copy session changed the text to: "이 소식은 이은숙 회원님이 허락한 범위에서만 보이고, 보신 기록은 회원님께도 보여요."
1. If a planning doc quotes this sentence, change it to match. Leave the status line as is and add only a change note.
2. Copy copy.md, plus any planning doc you changed, to evenstay/docs/family/ using the same path rules as last time. Then diff each copied file against its source. The only differences should be the rewritten paths.
Report: the files you changed and the diff result.
~~~~

### p0316

2026-11-03 21:01 · 허브 지시 · G 기획: Evenstay Home 비서 최소판

~~~~text
Hub request: re-hand off the G copy changes to evenstay docs/assistant/copy/. The user approved the fix ("모두 고쳐").
The G copy session changed the first-screen title to "Evenstay(이븐스테이) 홈 비서" in copy.md line 75 and names.md line 17 of 03-copywriting/ideas/senior-ai-assistant/. It also updated the decision note in copy.md at lines 591 and 595.
1. If any planning doc (prd, user-stories, etc.) quotes this title, change it to match. Leave the status line as is and add only a change note.
2. Copy copy.md, names.md, and any planning docs you changed to evenstay/docs/assistant/, using the same path rules as last time. Then diff each one against its source. The only differences should be the path rewrites.
Report: the files you changed and the diff result.
~~~~

### p0356

2026-11-03 21:33 · 허브 지시 · A 코어 기획: Evenstay Core PRD·tech-design

~~~~text
허브 확인 결과 한 곳이 남았어요: user-stories.md 147행 US 조건 2의 "10월 식사는 모두 186끼예요."가 copy.md 3절 "3월 식사는 모두 93끼예요."와 달라요(시드 데모 달도 copy.md와 같게). copy.md 문장 그대로 바꾸고, 변경 기록의 "2026-11-03 화면 문구 인용 맞춤" 표에 한 줄 덧붙인 뒤 evenstay/docs/core/user-stories.md에 다시 복사해 주세요. 보고는 한 줄이면 돼요(전→후, diff 결과).
~~~~

### p0358

2026-11-03 21:36 · 허브 지시 · B 기획: Evenstay Safety 안심 알림

~~~~text
허브 요청: 방금 보고에서 말한 "확인할 것" 절의 "카피 반영 대기" 목록을 정리하고 evenstay/docs/safety/로 다시 인계해 주세요.
사용자 말(그대로): "정리해".

방법:
- 항목마다 03-copywriting/ideas/safety-signal-hub/copy.md에 이미 반영됐는지 확인해요.
- 반영된 항목은 지우지 말고 "반영됨(copy.md 절 번호)"으로 표시해 완료로 옮기고, 아직 반영 안 된 항목만 대기로 남겨요.
- copy.md, 다른 모듈, shared/, 03-copywriting은 고치지 않아요. 변경 기록 절에 한 줄 덧붙여요. 상태 줄과 "재승인 대기" 메모는 그대로예요.
- 다시 인계한 뒤 원본과 docs/가 경로 줄만 다른지 diff로 확인해요.

보고: 반영됨으로 옮긴 항목 수와 목록, 남은 대기 항목(있으면 무엇이 빠졌는지), diff 결과.
~~~~

### p0361

2026-11-03 21:45 · 허브 지시 · B 기획: Evenstay Safety 안심 알림

~~~~text
허브 요청: B 카피 세션이 대기 문구를 copy.md에 넣었어요. 기획 문서의 "카피 반영 대기" 표시를 정리하고 copy까지 evenstay/docs/safety/로 다시 인계해 주세요.
사용자 말(그대로): "맡겨"(남은 두 화면 문구를 카피 세션에 맡기라는 답).

카피 쪽 변경(허브 확인함): 03-copywriting/ideas/safety-signal-hub/copy.md에 새 절 2-11 전화로 받은 호출 등록, 2-12 기기 연결과 장치 동의, 2-13 규칙과 당번표 설정, 2-14 처리 실패 신호가 생겼고, 2-6·2-7 표에 줄이 더해졌으며, names.md에 출처 "프런트 전화"가 들어갔어요. 판단 단어는 없고 합쇼체예요.

할 일:
1. 기획 문서 7종의 "[카피 반영 대기]" 표시와 "확인할 것"의 대기 목록을 copy.md와 대조해, 들어간 항목은 "반영됨(`copy.md` 절 번호)"으로 바꿔요. US-18·US-21 디자인 줄과 US-01 인수 조건 5도 해당 절을 가리키게 해요. "맡은 뒤 오래 머문 알림 안내"(Next)처럼 아직 없는 것만 대기로 남겨요.
2. copy.md 교정 기록에 "기획 확인 필요"로 남은 3건을 확인할 것에 옮겨 적어요: ① 2-11 카드에 규칙 대신 "등록: ○○○ 님" 표시 ② 연결 화면에 연결 끝내기 버튼 없음(직원이 끝내는 흐름이 기획에 없음) ③ 당번표를 바꿀 때 이미 넘김이 시작된 알림이 어느 당번표를 따르는지 [미정]. ①②는 기획과 맞으면 "확인함"으로, 아니면 후보로 두고, ③은 [미정]으로 남겨요. 새로 결정을 지어내지 않아요.
3. 기획 문서 7종과 copy 폴더(copy.md, names.md, 바뀐 다른 copy 파일)를 evenstay/docs/safety/와 docs/safety/copy/로 다시 복사해요(지난번 경로 규칙: 상대 경로는 절대 경로로).
- 상태 줄과 "재승인 대기" 메모는 그대로, 변경 기록 절에 한 줄 덧붙여요. 03-copywriting, shared/, 다른 모듈은 고치지 않아요.

보고: 반영됨으로 바꾼 곳 수, 남은 대기 항목, 3건 처리 결과, diff 결과(기획 7종과 copy 파일 모두 경로 줄만 다른지).
~~~~

### p0382

2026-11-03 22:38 · 허브 지시 · A 코어 기획: Evenstay Core PRD·tech-design

~~~~text
허브 요청: 코어 기획에 두 가지를 추가하고 evenstay/docs/core/로 다시 인계해 주세요.
사용자 선택(그대로): "넓게(N1 포함)". 근거: `../01-research/outputs/service-coverage-review.md` 4-2(S44)와 5절(대시보드). 같은 결정으로 B·D·새 모듈 N1(생활 요청)도 동시에 기획해요.

1. 장기 부재(입원·외박·기타 부재, S44) — A 확장
- 입주자 단위 "부재 기간"(시작, 예정 복귀, 실제 복귀, 등록한 직원). 이유·병명·병원 이름은 받지 않아요(민감정보 최소화).
- 이벤트 이름은 허브가 B·D에 이렇게 미리 알렸어요: `ResidentAbsenceStarted`, `ResidentAbsenceEnded` (absenceId, residentId, siteId, unitId, 시각, 예정 복귀일만). 바꿔야 하면 이유와 함께 보고해 주세요. 허브가 B·D에 맞춰 전해요.
- 코어 안의 쓰임: 식사 기록·식비 정지 규칙과 연결(규칙 값은 [가설]/[미정]), 확인할 일에 "예정 복귀일 지남".
- 권한, 감사 기록, 데모 시드(이은숙 회원님 아닌 다른 가상 입주자 권장)와 인수 조건, 화면(CORE-xx) 정의.
2. 운영 현황 대시보드 D1(사업장 책임자) — `app/` 조립
- CORE-01 "오늘의 운영" 위에 카드: 호실 현황, 열린 안전 신호와 맡지 않은 것, 지난 24시간 확인까지 걸린 시간, 끊긴 기기, 오늘 당번, 확인할 일, 장기 부재 중인 분, 열린 생활 요청(N1).
- 숫자는 사실만, 목표선·좋음/나쁨 색 없음, 입주자 개인 활동량·위치 없음. `app/`이 매 요청 각 모듈 `api/`를 읽고 복사하지 않음(모듈 경계 8번).
- 모듈별로 새로 필요한 조회를 표로 적어요(B 사업장 단위 신호 조회, D 사업장 동의 집계, N1 열린 요청 수, G `AssistantUsageQuery`는 있음). 조회 이름은 [가설]로 두고 각 모듈 기획이 확정해요.
- D2(야간 당번 보기, SAF-01 확장)는 B가 맡아요.

지킬 것: 판단 단어 금지, 직원 화면 합쇼체·"입주자", 효과 수치·목표값 지어내지 않기, "판" 대신 "버전". 기획 문서 상태 줄은 그대로 두고 "변경: 2026-11-03 장기 부재·운영 현황 대시보드 추가(재승인 대기)" 메모와 변경 기록. 새 화면 문구는 `[NEED: 카피]`로 표시(허브가 코어 카피 세션에 맡겨요). 03-copywriting, shared/, 다른 모듈은 고치지 않아요. 고친 뒤 docs/core/로 재인계하고 경로 줄만 다른지 diff 확인.

보고: 추가한 절·US·화면 ID, 확정한 이벤트·조회 이름(허브 제안과 다르면 표시), 다른 모듈에 필요한 조회 목록, `[NEED: 카피]` 목록, 실제 호출한 스킬.
~~~~

### p0383

2026-11-03 22:38 · 허브 지시 · B 기획: Evenstay Safety 안심 알림

~~~~text
허브 요청: 안전 빈 곳 검토의 제안을 B 기획에 넣고 evenstay/docs/safety/로 다시 인계해 주세요.
사용자 선택(그대로): "넓게(N1 포함)". 당신이 낸 추천 1안보다 조금 넓어요.

넣을 것:
1. A안 출동까지 걸린 시간 표시 — P0 확장(SAF-05 알림 기록에 "확인까지 n분 · 만남까지 n분").
2. B안 병원 동행 기록 — P1.
3. C안 안부 방문 기록(정기 순회) — P1. 주기 값은 [가설]. 놓친 방문은 새 신호 출처 "안부 방문".
4. 장기 부재 구독: 코어가 새로 정의하는 `ResidentAbsenceStarted`/`ResidentAbsenceEnded`(absenceId, residentId, siteId, unitId, 시각, 예정 복귀일만, 이유 없음)를 받아 그 기간 침대 센서·밤 출입·안부 방문 규칙을 멈추고 화면에 "부재 중" 표시. 이벤트 이름은 코어 확정 전 [가설]로 적어요.
5. D2 야간 당번 보기: SAF-01 위에 "맡지 않은 신호 n, 끊긴 기기 n, 오늘 당번" 한 줄.
6. 대시보드 D1용 사업장 단위 조회(예: `SafetyBoardQuery`): 열린 신호 수, 맡지 않은 것, 지난 24시간 걸린 시간 분포, 끊긴 기기 수, 오늘 당번. `app/`이 읽기만 해요.
7. 진단·치료를 만들지 않는 이유를 하지 않을 것에 한 줄(의료법 근거, 원문 미확인이면 [미확인]).
D(호실 현황판)·E·F와 비상 때 재실 명단은 Next로 적어 둬요.

지킬 것: 문구 방향은 검토 5절대로(금지어 없음, "모니터링·순찰·감시" 안 씀). 새 문구는 `[NEED: 카피]`(허브가 B 카피 세션에 맡겨요). "판" 대신 "버전". 상태 줄 그대로, "변경: 2026-11-03 안전 서비스 보완(재승인 대기)" 메모와 변경 기록. 03-copywriting, shared/, 다른 모듈은 고치지 않아요. 고친 뒤 docs/safety/로 재인계, 경로 줄만 다른지 diff.

보고: 추가한 F·US·화면 ID와 우선순위, 확정한 조회 이름, `[NEED: 카피]` 목록, 실제 호출한 스킬.
~~~~

### p0384

2026-11-03 22:38 · 허브 지시 · D 기획: Evenstay Family 보호자 포털·동의

~~~~text
허브 요청: D 기획에 두 가지를 넣고 evenstay/docs/family/로 다시 인계해 주세요.
사용자 선택(그대로): "넓게(N1 포함)". 근거: `../01-research/outputs/service-coverage-review.md` 4-2(S44)와 5절.

1. 장기 부재 소식: 코어가 새로 정의하는 `ResidentAbsenceStarted`/`ResidentAbsenceEnded`(absenceId, residentId, siteId, unitId, 시각, 예정 복귀일만, 이유 없음)를 받아, 회원님이 허락한 범위 안에서만 보호자에게 생활 소식으로 올려요("외출·외박 중", "돌아오셨어요" 같은 사실만, 병원·병명 없음). 어느 동의 항목에 묶을지 정하고, 허락이 없으면 보내지 않아요. 이벤트 이름은 코어 확정 전 [가설].
2. 대시보드 D1용 사업장 단위 조회: 동의를 받은 회원 수, 최근 철회, 열린 "이상해요" 문의 수 같은 집계만(개인 이름 없이). 이름 예: `FamilyConsentSummaryQuery` [가설]. `app/`이 읽기만 해요.

지킬 것: 건강 소식 길은 D 하나라는 원칙 유지, 판단 단어 금지, 회원·보호자 화면 해요체, "대신 처리하실 분" 용어. 새 문구는 `[NEED: 카피]`(허브가 D 카피 세션에 맡겨요). "판" 대신 "버전". 상태 줄 그대로, "변경: 2026-11-03 장기 부재 소식·동의 집계 추가(재승인 대기)" 메모와 변경 기록. 03-copywriting, shared/, 다른 모듈은 고치지 않아요. 고친 뒤 docs/family/로 재인계, 경로 줄만 다른지 diff.

보고: 추가한 절·US·화면, 묶은 동의 항목, 확정한 조회 이름, `[NEED: 카피]` 목록, 실제 호출한 스킬.
~~~~

### p0388

2026-11-03 22:52 · 허브 지시 · B 기획: Evenstay Safety 안심 알림

~~~~text
허브 요청(맞추기): 코어가 장기 부재 이벤트를 확정했어요. B 문서를 맞추고 docs/safety/로 재인계해 주세요.

코어 확정(코어 tech-design 2-2, 3-4, 8절):
- `ResidentAbsenceStarted` / `ResidentAbsenceEnded`. payload: absenceId, residentId, unitId, startedOn / endedOn, expectedReturnOn. siteId와 occurredAt은 공통 이벤트 머리에서 와요. 지금 B의 `at`, `plannedReturnOn`은 이 이름으로 바꿔 주세요.
- 등록 취소도 Ended를 내고, 승계·정산 때 열린 부재는 자동으로 끝나며 Ended를 내요. 예정 복귀일만 바뀌면 이벤트가 없어요. 필요하면 `AbsenceQuery.absenceOf(residentId, at)`로 읽어요. 부재 종류(입원/외박)는 기록하지 않아요.
- 코어는 B 조회 이름을 B 것으로 따를게요: `SafetyBoardQuery.boardOf(siteId, at, actor)`. 끊긴 기기 수, 오늘 당번, 지난 24시간 확인까지 걸린 시간(건수, 중앙값, 가장 긴 것)이 이 하나에 다 들어가는지 확인해 반환 형태를 적어 주세요.

확인할 것: 모듈 경계 8번("다른 모듈 데이터를 복사해 두지 않고 매 요청 `api/`로 읽는다"). B의 `AbsencePeriod` 테이블이 코어 데이터의 사본이 되지 않는지 봐 주세요. 규칙을 멈추는 판단을 이벤트로 받은 최소 상태(absenceId, 시작·끝 시각)로만 하고 표시용 정보는 `AbsenceQuery`로 읽는다면 그 이유를 ADR에 한 줄 적고, 아니면 매 평가 때 `AbsenceQuery`로 읽는 쪽으로 바꿔요.

보고: 바꾼 곳, 경계 8번 판단과 이유, boardOf 반환 형태, diff 결과.
~~~~

### p0389

2026-11-03 22:52 · 허브 지시 · D 기획: Evenstay Family 보호자 포털·동의

~~~~text
허브 요청(맞추기): 코어가 장기 부재 이벤트를 확정했어요. D 문서를 맞추고 docs/family/로 재인계해 주세요.

코어 확정(코어 tech-design 2-2, 3-4, 8절):
- `ResidentAbsenceStarted` / `ResidentAbsenceEnded`. payload: absenceId, residentId, unitId, startedOn / endedOn, expectedReturnOn. siteId와 occurredAt은 공통 이벤트 머리에서 와요.
- 등록 취소도 Ended를 내요. 취소된 부재에 "돌아오셨어요" 소식이 나가지 않게 처리 방법을 정해 주세요(필요하면 `AbsenceQuery.absenceOf`로 상태 확인, 또는 코어에 끝난 이유를 요청). 승계·정산 때 자동 종료도 Ended를 내요. 예정 복귀일만 바뀌면 이벤트가 없어요.
- 부재 종류(입원/외박/기타)는 기록하지 않아요. 보호자 문구에 "외박" 같은 종류를 쓰지 말고 "자리를 비우셨어요"처럼 사실만 쓰는 방향으로 `[NEED: 카피]`를 고쳐 주세요.
- `MealQuery.mealsOf`에 `absent` 필드가 생겨요. 부재가 없으면 "21끼 중 18끼" 같은 지금 표시는 그대로예요. 부재 끼니를 D 식사 표시에 어떻게 보일지(또는 안 보일지) 정해 주세요.
- 코어는 D 조회 이름을 D 것으로 따를게요: `FamilyConsentSummaryQuery.siteSummary(siteId, at)`. actor 인자가 없으니 `app/`이 `authorize(CHECK)`로 먼저 권한을 확인한다는 점과 D가 등록할 행동 이름을 적어 주세요.

확인할 것: 모듈 경계 8번(다른 모듈 데이터를 복사해 두지 않음). D가 부재 데이터를 사본으로 저장하지 않는지 봐 주세요.

보고: 바꾼 곳, 취소 처리 방법, 식사 표시 결정, 행동 이름, diff 결과.
~~~~

### p0390

2026-11-03 22:53 · 허브 지시 · A 코어 기획: Evenstay Core PRD·tech-design

~~~~text
허브 요청(맞추기): 코어 tech-design 10절 카드 표와 확인할 것의 다른 모듈 조회 이름을 각 모듈이 확정한 이름으로 바꾸고 docs/core/로 재인계해 주세요.
- B: `SafetyBoardQuery.boardOf(siteId, at, actor)` 하나에 열린 신호·맡지 않은 것·걸린 시간·끊긴 기기·오늘 당번이 들어가요(반환 형태는 B가 지금 확정 중이라 [가설] 유지). `DeviceQuery`, `DutyQuery`, `ackTimes`는 빼요.
- D: `FamilyConsentSummaryQuery.siteSummary(siteId, at)`. actor가 없어 G처럼 `app/`이 `authorize(CHECK)`를 먼저 불러요.
- N1: `ServiceRequestQuery.openCount`는 N1 기획 전이라 [가설] 그대로.
B·D에는 코어 확정 payload(startedOn/endedOn/expectedReturnOn, 취소·자동 종료 때 Ended, 예정일 변경은 이벤트 없음, 종류 없음, MealQuery absent)를 전했어요.

질문 답: 이은숙 회원님의 12/2~12/7 입원(C 장면)을 장기 부재로 넣을지는 사용자에게 올려 둘게요. 지금은 시드에 넣지 않은 상태를 유지해 주세요(확인할 것 25 그대로).

보고: 바꾼 곳과 diff 결과만 짧게.
~~~~

### p0394

2026-11-03 22:58 · 허브 지시 · A 코어 기획: Evenstay Core PRD·tech-design

~~~~text
허브 요청(맞추기): B가 모듈 경계 8번 판단으로 부재를 저장하지 않고, 코어 부재 이벤트도 구독하지 않기로 했어요. 신호를 평가할 때마다 `AbsenceQuery`로 읽어요(B ADR-S7). 코어 문서에서 B를 `ResidentAbsenceStarted`/`Ended` 구독자로 적은 곳(이벤트 표의 구독 열, 10절 의존 표, service-blueprint 등)을 "B는 `AbsenceQuery.absenceOf`를 신호 평가 때 읽음"으로 바꾸고 docs/core/로 재인계해 주세요. D는 아직 맞추는 중이라 D 줄은 그대로 두세요. 보고는 바꾼 곳과 diff 결과만 짧게.
~~~~

### p0395

2026-11-03 23:00 · 허브 지시 · A 코어 기획: Evenstay Core PRD·tech-design

~~~~text
허브 요청(D가 남긴 코어 요청 1건): `AbsenceQuery.absencesIn`(필요하면 `absenceOf`도) 결과 항목에 status(OPEN, ENDED, CANCELLED)와 returnedOn을 넣어 주세요. D는 `ResidentAbsenceEnded`를 받은 뒤 이 값으로 등록 취소를 가려내서, 취소된 부재에는 "돌아오셨어요" 소식을 보내지 않아요(D tech-design 3-6, 확인할 것 26). 이벤트 payload에는 끝난 이유를 넣지 않는 지금 방침은 그대로예요.
함께: 10절 카드 표의 D 행에 권한 행동 이름 `family.summary.read`(app/이 `authorize(…, CHECK)`로 먼저 확인)를 적어 주세요. 이름 맞추기 (나)는 이미 끝났어요.
docs/core/로 재인계 후 바꾼 곳과 diff 결과만 짧게 보고해 주세요.
~~~~

### p0402

2026-11-03 23:20 · 허브 지시 · D 기획: Evenstay Family 보호자 포털·동의

~~~~text
허브 요청: D 기획에 "생활 요청" 허락 항목을 넣고, 새 카피까지 evenstay/docs/family/로 다시 인계해 주세요.
근거: 사용자가 N1 생활 요청 카피 결정에서 "추천대로"(2026-11-03)를 골랐어요: D 허락 항목에 "생활 요청"을 더함(보기 + 대신 올리기, 기본값 "안 보여요"), 병원 동행 요청은 건강 소식 허락 보호자에게만, 병원 이름 없이. D 카피 세션이 copy.md(2-10, 4-7, 5-6 등)와 names.md에 문구를 넣었고, "D 기획이 아직 허락 항목 4개 고정이라 반영이 필요"하다고 했어요.

할 일:
1. 허락 항목(동의 종류) 목록과 정책, ERD/enum, 권한 표, US·인수 조건, 화면에 "생활 요청"을 더해요. N1(생활 요청 모듈, slug `life-requests`, 기획 진행 중)이 D `api/`로 허락 여부를 확인하는 조회가 필요하면 이름을 [가설]로 적어 N1 기획에 넘길 것으로 표시해요.
2. 새 카피(`../03-copywriting/ideas/family-consent-portal/copy.md`, `names.md`)의 `[NEED: 카피]`가 채워진 곳을 "반영됨(copy 절 번호)"으로 바꿔요. D 카피 2-10에 법률 검토 필요 메모가 있으면 확인할 것에 옮겨요.
3. 기획 7종과 copy 폴더 파일을 docs/family/와 docs/family/copy/로 다시 복사(경로 규칙 같음).
상태 줄 그대로, 변경 메모 "(재승인 대기)"와 변경 기록. "판" 대신 "버전". shared/, 03-copywriting, 다른 모듈은 고치지 않아요.
보고: 바꾼 곳, N1에 넘길 조회, 남은 `[NEED: 카피]`, diff 결과(기획·copy 모두 경로 줄만 다른지).
~~~~

### p0403

2026-11-03 23:20 · 허브 지시 · A 코어 기획: Evenstay Core PRD·tech-design

~~~~text
허브 요청: 코어 카피 세션이 copy.md에 장기 부재(2-9), 운영 현황 카드(2-10), 2-5 장기 부재 끼니 설정 문구를 넣었어요. 코어 기획의 해당 `[NEED: 카피]`를 "반영됨(copy 절 번호)"으로 바꾸고(카피가 B·D·G 조회 형태 미정으로 [NEED]를 남긴 곳은 그대로), 기획 7종과 copy 폴더 파일을 docs/core/와 docs/core/copy/로 다시 복사해 주세요(경로 규칙 같음). 상태 줄 그대로, 변경 기록 한 줄. 보고: 반영됨으로 바꾼 수, 남은 `[NEED: 카피]`, diff 결과(기획·copy 모두).
~~~~

### p0404

2026-11-03 23:20 · 허브 지시 · B 기획: Evenstay Safety 안심 알림

~~~~text
허브 요청: B 카피 세션이 copy.md에 2-15 안부 방문, 2-16 병원 동행, 2-17 부재 중과 기존 표 6곳의 줄을 넣고, names.md에 출처 "안부 방문"을 넣었어요. B 기획(F20~F25)의 해당 `[NEED: 카피]`를 "반영됨(copy 절 번호)"으로 바꾸고, 기획 7종과 copy 폴더 파일을 docs/safety/와 docs/safety/copy/로 다시 복사해 주세요(경로 규칙 같음). 상태 줄 그대로, 변경 기록 한 줄. 보고: 반영됨으로 바꾼 수, 남은 `[NEED: 카피]`, diff 결과(기획·copy 모두).
~~~~

### p0408

2026-11-03 23:25 · 허브 지시 · A 코어 기획: Evenstay Core PRD·tech-design

~~~~text
허브 요청: 코어 카피 세션이 남은 `[NEED: 카피]`를 채웠어요(① 비상 연락처: 2-8 계약 사본 한 줄, ② 납부 기한: 2-3·2-5·3절에 이미 있음, ③ 계정 고르기: 2-11 새 절). 코어 기획의 해당 표시(prd 15절, US-04 조건 6, US-22, service-blueprint 1a, tech-design 2-1, US-06·10·12, US-17)를 "반영됨(copy 절 번호)"으로 바꾸고, copy.md를 docs/core/copy/에 다시 복사해 주세요(지금 docs/core/copy/copy.md가 원본과 73줄 달라요). 운영 현황 카드 숫자 문구는 B·D 반환 형태 대기로 그대로 둬요. 보고: 바꾼 곳, 남은 `[NEED: 카피]`, diff 결과(기획·copy).
~~~~

### p0418

2026-11-04 00:07 · 허브 지시 · A 코어 기획: Evenstay Core PRD·tech-design

~~~~text
허브 요청: 전체 리뷰 뒤 보완을 시작해요. 사용자 말(그대로): "추천대로 시작". 목표는 모든 화면이 흐름대로 실제처럼 동작하는 클릭형 프로토타입이에요(MVP 구현 없음).
지시서: `~/ai/senior-lab/00-hub/reviews/supplement-orders-2026-11-04.md` — "공통 규칙", "통합 데모에 넣을 새 장면", "코어" 절(1~8)을 읽고 그대로 해 주세요. 다른 모듈과 겹치는 이름(직원 4명, 이은숙 12/2~12/7 부재, ServiceCharge 등)은 확정한 값을 보고에 적어 주세요. 허브가 다른 세션에 전해요.
보고: 항목별 처리 결과, 새 화면 ID, 새 장면(기준 시각·계정·화면), 확정한 이름, `[NEED: 카피]` 목록, diff 결과, 실제 호출한 스킬.
~~~~

### p0419

2026-11-04 00:07 · 허브 지시 · B 기획: Evenstay Safety 안심 알림

~~~~text
허브 요청: 전체 리뷰 뒤 보완을 시작해요. 사용자 말(그대로): "추천대로 시작". 목표는 모든 화면이 흐름대로 실제처럼 동작하는 클릭형 프로토타입이에요(MVP 구현 없음).
지시서: `~/ai/senior-lab/00-hub/reviews/supplement-orders-2026-11-04.md` — "공통 규칙", "통합 데모에 넣을 새 장면", "안심 알림" 절(1~4)을 읽고 그대로 해 주세요. 이은숙 12/2 병원 동행은 코어(장기 부재)·D(부재 소식)·C와 이어지니 시각을 보고에 적어 주세요.
보고: 항목별 처리 결과, 새 F·US·화면 ID, 새 장면, 확정한 명령·조회 이름, `[NEED: 카피]` 목록, diff 결과, 실제 호출한 스킬.
~~~~

### p0420

2026-11-04 00:07 · 허브 지시 · D 기획: Evenstay Family 보호자 포털·동의

~~~~text
허브 요청: 전체 리뷰 뒤 보완을 시작해요. 사용자 말(그대로): "추천대로 시작". 목표는 모든 화면이 흐름대로 실제처럼 동작하는 클릭형 프로토타입이에요(MVP 구현 없음).
지시서: `~/ai/senior-lab/00-hub/reviews/supplement-orders-2026-11-04.md` — "공통 규칙", "통합 데모에 넣을 새 장면", "보호자 포털·동의" 절(1~7)을 읽고 그대로 해 주세요.
보고: 항목별 처리 결과, 새 장면, 바꾼 구독·조회, `[NEED: 카피]` 목록, diff 결과, 실제 호출한 스킬.
~~~~

### p0421

2026-11-04 00:07 · 허브 지시 · G 기획: Evenstay Home 비서 최소판

~~~~text
허브 요청: 전체 리뷰 뒤 보완을 시작해요. 사용자 말(그대로): "추천대로 시작". 목표는 모든 화면이 흐름대로 실제처럼 동작하는 클릭형 프로토타입이에요(MVP 구현 없음).
배경: 새 모듈 N1 생활 요청(`~/ai/evenstay/docs/requests/`)이 생겼고, G의 "직원에게 넘기기"가 N1 요청을 만들어요(N1 tech-design 10-3 N1-G1~G4). 운영 현황 대시보드가 G `AssistantUsageQuery.summary`를 읽어요(코어 tech-design 10절).
지시서: `~/ai/senior-lab/00-hub/reviews/supplement-orders-2026-11-04.md` — "공통 규칙", "AI 생활 비서" 절(1~4)을 읽고 그대로 해 주세요.
보고: 항목별 처리 결과, 등록한 행동 이름, Handoff 상태 변화, `[NEED: 카피]` 목록, diff 결과(docs/assistant/), 실제 호출한 스킬.
~~~~

### p0423

2026-11-04 00:08 · 허브 지시 · C 기획: Evenstay Transitions 생활 지원 단계

~~~~text
허브 요청: 전체 리뷰 뒤 보완이에요. 사용자 말(그대로): "추천대로 시작". 목표는 모든 화면이 흐름대로 실제처럼 동작하는 클릭형 프로토타입이에요(MVP 구현 없음).
지시서: `~/ai/senior-lab/00-hub/reviews/supplement-orders-2026-11-04.md` — "공통 규칙", "통합 데모에 넣을 새 장면"(12/2~12/7 줄), "생활 지원 단계" 절을 읽어 주세요. C 데모 앞에 이은숙 회원님 입원 기간(B 병원 동행 12/2 → 코어 장기 부재 → D 부재 소식 → 12/7 복귀)이 이어지게 C 9절과 시드 설명을 맞춰요. C의 기존 장면과 원칙(판정·추천 없음)은 그대로예요. 코어·B·D가 정하는 시각은 허브가 확정되면 전할게요.
보고: 바꾼 곳, diff 결과(docs/transitions/), 실제 호출한 스킬.
~~~~

### p0431

2026-11-04 00:24 · 허브 지시 · A 코어 기획: Evenstay Core PRD·tech-design

~~~~text
허브 전달(시각 맞추기): B가 이은숙 장면 시각을 확정했어요. 12/2 10:20 프런트 전화 호출 등록 → 10:50 윤서연 병원 동행 출발 → 10:55 건강 소식. 12/7 16:20 돌아오심, 16:30 윤서연이 [돌아오셨습니다] 기록 → C 시작점 12/7 18:00.
코어 장면 "12/7 15:00 최민수 복귀 기록"이 B 기록보다 앞서요. 코어 복귀 기록을 12/7 16:40 전후로 옮기고, 12/2 부재 시작은 B 10:50 출발 뒤(예: 11:10)로 맞춰 주세요. 낮 당번 윤서연은 코어 시드에 이미 있으니 그대로예요. docs/core/로 재인계해 주세요. 보고는 바꾼 시각과 diff만 짧게.
~~~~

### p0432

2026-11-04 00:24 · 허브 지시 · C 기획: Evenstay Transitions 생활 지원 단계

~~~~text
허브 전달(HUB-A1 확정값): 이은숙 12/2~12/7 장면 시각이에요. B: 12/2 10:20 프런트 전화 호출 등록(최민수) → 10:22 윤서연 맡음, 10:35 만남 → 10:40 김지민 통화 → 10:50 병원 동행 출발 → 10:55 건강 소식(병원에 가신 일). 코어: 12/2 11:10 전후 프런트 최민수가 장기 부재 시작(예정 복귀일 모름). D: 12/2 김지민에게 "12월 2일부터 자리를 비우셨어요"(김태호는 없음). 12/7 16:20 돌아오심, 16:30 윤서연 [돌아오셨습니다], 16:40 전후 코어 복귀 기록, D "돌아오셨어요" → C 시작점 12/7 18:00. 부재 종류·병원 이름은 기록하지 않아요. C 9절과 시드 설명의 [미정]을 이 값으로 닫고 docs/transitions/로 재인계해 주세요. 보고는 바꾼 곳과 diff만 짧게.
~~~~

### p0435

2026-11-04 00:26 · 허브 지시 · B 기획: Evenstay Safety 안심 알림

~~~~text
허브 전달: 사용자가 열린 결정을 모두 추천대로 정했어요(그대로: "모두 추천대로"). B에 해당하는 것: H5 소유주 월 리포트(코어 CORE-14)에 안심 알림 월 숫자(신호 수, 확인까지 걸린 시간 등)를 열어요. 이름·호실은 없어요. OWNER_VIEWER용 월 요약 조회와 행동 이름을 정하고, docs/safety/로 재인계해 주세요. 보고: 조회·행동 이름, 반환 형태, diff.
~~~~

### p0436

2026-11-04 00:27 · 허브 지시 · D 기획: Evenstay Family 보호자 포털·동의

~~~~text
허브 전달: 사용자가 열린 결정을 모두 추천대로 정했어요(그대로: "모두 추천대로"). D에 해당하는 것:
- H2: 보호자가 생활 요청을 본 것을 회원 "본 기록"에 남겨요(확인할 것 27 닫기). `app/`이 보호자 생활 요청 화면을 그릴 때 `family/api` 기록 명령을 부르는 방식(제안대로).
- H6: 입소보증금 보호 상태(코어 `ContractQuery.depositProtection`)는 대리인(청구서 권한)에게만 보이고, 보호자 화면에는 두지 않아요.
- N2-2: 새 모듈 N2 커뮤니티(slug `community`, 카피 초안)에서, D 허락 항목 "일정"에 회원이 신청한 프로그램을 더해요(항목 수는 다섯 그대로). 대기·시설 예약은 보이지 않아요. N2 기획 전이라 조회 이름은 [가설]로 두세요.
docs/family/로 재인계해 주세요. 보고: 바꾼 곳, `[NEED: 카피]`, diff.
~~~~

### p0438

2026-11-04 00:27 · 허브 지시 · A 코어 기획: Evenstay Core PRD·tech-design

~~~~text
허브 전달: 사용자가 열린 결정을 모두 추천대로 정했어요(그대로: "모두 추천대로"). 코어에 해당하는 것:
- H1: 11/17 유료 요청은 배경 입주자 정옥자 것으로 옮겨요. 이은숙 12월 청구서 2,910,000원 유지. tech-design 26 / prd 13 [미정]을 닫고, 11/17 17:00 CORE-07 사용 기록 장면의 대상도 정옥자로.
- H5: CORE-14에 B·N1 월 숫자를 보여 줘요(이름·호실 없음). 조회 이름은 B·N1이 지금 정하고 있어요. 받으면 허브가 전할게요. 지금은 자리만 두세요.
- H6: 입소보증금 보호 상태는 회원·대리인 화면(CORE-08)에만, 보호자에게는 없음.
- H8: 회원이 앱에서 "이 날은 안 먹어요"를 알리는 기능은 roadmap Next 후보로 한 줄.
docs/core/로 재인계해 주세요. 보고: 바꾼 곳과 diff.
~~~~

### p0443

2026-11-04 00:29 · 허브 지시 · A 코어 기획: Evenstay Core PRD·tech-design

~~~~text
허브 전달(H5): B가 소유주 월 리포트용 이름을 확정했어요. 조회 `SafetyBoardQuery.monthOf`(safety/api), 권한 행동 `safety.owner_report.view`(OWNER_VIEWER, 자기 사업장만, 이름·호실 없음). B F30·US-34. 코어 tech-design 10절과 CORE-14 정의의 B 자리 [가설]을 이 이름으로 바꾸고 docs/core/로 재인계해 주세요. 반환 형태는 `~/ai/evenstay/docs/safety/tech-design.md`에서 확인해 맞춰 주세요. N1 이름은 받으면 따로 전할게요. 보고는 바꾼 곳과 diff만 짧게.
~~~~

### p0445

2026-11-04 00:29 · 허브 지시 · A 코어 기획: Evenstay Core PRD·tech-design

~~~~text
허브 전달(H5 마지막): N1 이름도 확정됐어요. 조회 `ServiceRequestQuery.monthlySummary(siteId, period, actor)`(requests/api, N1 prd F22), 권한 행동 `requests.summary.owner_read`(OWNER_VIEWER, 기준일 소유 사업장만, 숫자만). 반환 형태는 `~/ai/evenstay/docs/requests/tech-design.md`에서 확인해 맞춰 주세요. 코어 10절과 CORE-14, 확인할 것 30의 N1 [가설]을 닫고 docs/core/로 재인계해 주세요. 보고는 diff만 짧게.
~~~~

### p0455

2026-11-04 00:54 · 허브 지시 · B 기획: Evenstay Safety 안심 알림

~~~~text
허브 요청: B 카피 세션이 보완분 문구를 copy.md에 넣었어요(새 절 2-18 호실 현황, 2-19 사고·학대 보고, 2-20 비상 때 재실 명단, 2-21 소유주 월 요약, 기존 표 5곳, names.md 출처 "생활 요청에서 옮김"). B 기획 본문의 해당 `[NEED: 카피]`를 "반영됨(copy 절 번호)"으로 바꾸고, 기획 7종과 copy 폴더를 docs/safety/로 재인계해 주세요. 보고: 바꾼 수, 남은 `[NEED: 카피]`, diff.
~~~~

### p0456

2026-11-04 00:54 · 허브 지시 · D 기획: Evenstay Family 보호자 포털·동의

~~~~text
허브 요청: D 카피 세션이 보완분 문구를 넣었어요(새 절 2-11, 2-3·2-8·4-1·4-6·4-7 줄 추가·수정, names.md 일정 설명). D 기획 본문의 해당 `[NEED: 카피]`를 "반영됨(copy 절 번호)"으로 바꾸고 기획 7종과 copy 폴더를 docs/family/로 재인계해 주세요. 카피가 남긴 미정(레지던스 공지 자리, 부재 예정일 표시)은 확인할 것에 올려요. 보고: 바꾼 수, 남은 `[NEED: 카피]`, diff.
~~~~

### p0457

2026-11-04 00:54 · 허브 지시 · G 기획: Evenstay Home 비서 최소판

~~~~text
허브 요청: G 카피 세션이 "생활 요청으로 보냄" 8줄(5-2)과 사용량 카드 5-4(10줄)를 쓰고 용어집 UNKNOWN을 OUT_OF_SCOPE로 고쳤어요. 카피가 "카드 제목과 가림 표시가 G 기획과 어긋난다"고 남겼으니 G copy.md 5-4와 기획을 대조해 기획 쪽이 맞으면 카피 세션 몫으로 확인할 것에 적고, 기획을 고쳐야 하면 고쳐요. 기획 본문의 `[NEED: 카피]`를 "반영됨(copy 절 번호)"으로 바꾸고 기획 7종과 copy 폴더를 docs/assistant/로 재인계해 주세요. 보고: 바꾼 수, 어긋남 처리, 남은 `[NEED: 카피]`, diff.
~~~~

### p0459

2026-11-04 01:02 · 허브 지시 · A 코어 기획: Evenstay Core PRD·tech-design

~~~~text
허브 요청(세 가지, 한 번에 재인계):
1. 코어 카피 세션이 보완분 문구 63줄을 넣었어요(2-12 월 리포트 CORE-14, 2-13 위탁 운영 계약 CORE-15, 2-14 용어 등, 운영 현황 카드 6줄 수정). 코어 기획 본문의 `[NEED: 카피]`를 "반영됨(copy 절 번호)"으로 바꿔요.
2. G가 확인: 직원 화면 모듈 이름에 맞춰 카드 제목은 "AI 생활 비서 사용량"이에요. tech-design 10절 카드 표의 "AI 비서 사용량"을 고쳐요.
3. 새 모듈 N2 커뮤니티(`~/ai/evenstay/docs/community/`, 초안)가 코어에 보낸 요청 N2-C1~C4(그 tech-design 10-1): 10절 의존 표에 community 줄과 문서 동기화, `/demo/reset` 순서 끝에 community(requests 다음), 운영 현황 카드 후보 `CommunityBoardQuery.todayOf`, (선택) 호실 층 칸, 보호자 동의 행동 선언 목록에 N2 공지 행동 추가. 원문을 읽고 반영하고, 선택 항목은 판단해 [가설]/[미정]으로 남겨도 돼요. 새 시드 직원은 필요 없다고 해요.
기획 7종과 copy 폴더를 docs/core/로 재인계해 주세요. 보고: 항목별 처리, 남은 `[NEED: 카피]`, diff.
~~~~

### p0460

2026-11-04 01:02 · 허브 지시 · D 기획: Evenstay Family 보호자 포털·동의

~~~~text
허브 요청: 새 모듈 N2 커뮤니티(`~/ai/evenstay/docs/community/`, 초안)가 D에 요청 N2-D1~D5를 보냈어요(그 tech-design 10-2). 원문을 읽고 반영해 주세요. 요약: D1 일정 조회 이름 `ProgramQuery.enrolledSessionsOf` 확정(healthRelated 칸 없음), D2 보호자 첫 화면 "레지던스 공지" 칸(보호자 관계만으로 열고, 공지마다 직원이 공개 선택·기본 끔), D3 생활 소식 재료를 `AttendanceQuery.attendedIn`으로(예: "수요일 가벼운 체조, 목요일 수채화"), D4 데모 장면 D-N2-1(11/18 14:50 이은숙이 김지민에게 일정 허락, 15:00 김지민 확인), D5 보호자 새 소식 문자는 [미정]으로. 새 문구는 `[NEED: 카피]`. docs/family/로 재인계해 주세요. 보고: 바꾼 곳, `[NEED: 카피]`, diff.
~~~~

### p0465

2026-11-04 01:03 · 허브 지시 · G 기획: Evenstay Home 비서 최소판

~~~~text
허브 요청(작은 일): G 카피 세션이 copy.md 2-6 가림 규칙에 날짜 단위 예외를 더하고, 5-1 직원 안내를 "금액과 날짜는 가리지 않습니다"로, 7절 11 (가)를 해결됨으로 바꿨어요(ADR-G9와 맞음, 허브 확인). tech-design 확인할 것의 해당 항목을 닫고 copy 폴더를 docs/assistant/copy/로 다시 복사해 주세요. 보고는 diff만 짧게.
~~~~

### p0467

2026-11-04 01:04 · 허브 지시 · A 코어 기획: Evenstay Core PRD·tech-design

~~~~text
허브 덧붙임: 코어 카피 세션이 방금 `names.md` 모듈 표에 N1·N2 두 줄을 더했어요(160~161행). 지금 하는 재인계 때 copy 폴더를 마지막에 복사해서 최신 names.md가 docs/core/copy/에 들어가게 해 주세요.
~~~~

### p0469

2026-11-04 01:06 · 사용자 · A 코어 기획: Evenstay Core PRD·tech-design

~~~~text
계속 진행해
~~~~

### p0475

2026-11-04 01:10 · 허브 지시 · D 기획: Evenstay Family 보호자 포털·동의

~~~~text
허브 전달: 사용자가 확인할 것 31을 정했어요(그대로: "보내지 않음"). N2 프로그램 신청 변경은 보호자에게 문자로 알리지 않아요. prd 확인할 것 31을 닫고 관련 줄(N2-D5)을 결정으로 바꾼 뒤 docs/family/로 재인계해 주세요. D 카피 세션이 지금 4-1·4-2 문구를 쓰고 있으니, 그 결과가 오면 허브가 반영됨 표시를 따로 요청할게요. 상태 줄 그대로, "변경: … (재승인 대기)" 메모. 보고는 diff만 짧게.
~~~~

### p0476

2026-11-04 01:11 · 허브 지시 · D 기획: Evenstay Family 보호자 포털·동의

~~~~text
허브 요청(작은 일): D 카피가 4-2 프로그램 예시("수요일 가벼운 체조, 목요일 수채화에 나오셨어요."), 4-1 김지민 11/18 뒤 "볼 수 있는 것" 줄 2개, 4-1 레지던스 공지 칸 4줄을 넣었어요. 기획 본문에 남은 해당 `[NEED: 카피]`를 "반영됨(copy 절)"으로 바꾸고 재인계해 주세요. 보고는 남은 `[NEED: 카피]` 수와 diff만.
~~~~

### p0498

2026-11-04 07:39 · 허브 지시 · D 기획: Evenstay Family 보호자 포털·동의

~~~~text
허브 요청(작은 일): user-stories.md 168행의 "넘어지신"은 판단 단어 "낙상"과 같은 뜻이라 관찰 사실 표현(예: "바닥에 앉아 계셨던 일")으로 바꿔요. D 카피도 같은 정리를 하고 있어요(107·429행). 카피 세션이 끝나면 허브가 copy 재인계를 요청할게요. 지금은 이 한 줄과 변경 기록만, docs/family/로 재인계. 보고는 diff만.
~~~~

### p0519

2026-11-04 10:18 · 허브 지시 · A 코어 기획: Evenstay Core PRD·tech-design

~~~~text
코어 카피 문구 규칙 정리가 끝났으니 `docs/core/copy/`에 다시 인계해 주세요.
바뀐 원본: `senior-lab/03-copywriting/ideas/pms-core-billing/copy.md`
- 2-10을 CORE-01 3층 구성에 맞췄어요.
- 2-10과 2-12의 기준 시각을 하나로 줄였어요.
- 프런트 번호 5곳을 고쳤어요.

할 일: copy/ 파일을 다시 복사하고 diff로 확인해요. 경로 줄 말고는 차이가 0이어야 해요. 기획 7개는 바뀐 게 없으면 손대지 않아요.
보고: 파일별 diff 줄 수.
~~~~

### p0520

2026-11-04 10:18 · 허브 지시 · B 기획: Evenstay Safety 안심 알림

~~~~text
B 카피 문구 규칙 정리가 끝났으니 `docs/safety/copy/`에 다시 인계해 주세요.
바뀐 원본: `senior-lab/03-copywriting/ideas/safety-signal-hub/copy.md`
- 2-19 신고의무 안내 문장을 고쳤어요.
- [미확인] 표시는 근거 쪽으로 옮겼어요.
- 프런트 번호 4곳을 고쳤어요.

할 일: copy/ 파일을 다시 복사하고 diff로 확인해요. 경로 줄 말고는 차이가 0이어야 해요.
같이 볼 것: 화면 정의서 검토에서 prd 9절 11/12 안부 방문 장면이 걸렸어요. 김정희(A동 301호)가 장기 부재 시드(11/8~11/19) 기간인데 그 장면에 나와요. 고칠 필요가 있으면 고치고 기획도 재인계해요. 상태 줄 메모는 "(재승인 대기)"로 달아요.
보고: 파일별 diff 줄 수, 그리고 11/12 장면을 어떻게 처리했는지.
~~~~

### p0521

2026-11-04 10:18 · 허브 지시 · C 기획: Evenstay Transitions 생활 지원 단계

~~~~text
C 카피 문구 규칙 정리가 끝났으니 `docs/transitions/copy/`에 다시 인계해 주세요.
바뀐 원본은 `senior-lab/03-copywriting/ideas/care-stage-transition/`의 세 파일이에요.
- `names.md` 46행: "넘어지신"을 고쳤어요.
- `product-marketing.md`: v1.3이 됐어요.
- `copy.md`: 프런트 번호 2곳을 고쳤어요.

할 일: copy/ 파일을 다시 복사하고 diff로 확인해요. 경로 줄 말고는 차이가 0이어야 해요.
보고: 파일별 diff 줄 수.
~~~~

### p0522

2026-11-04 10:18 · 허브 지시 · D 기획: Evenstay Family 보호자 포털·동의

~~~~text
D 카피 세션이 끝났으니 `docs/family/copy/`에 다시 인계해 주세요.
바뀐 원본: `senior-lab/03-copywriting/ideas/family-consent-portal/copy.md`
- "넘어지신" 2곳을 고쳤어요.
- 프런트 번호 9곳을 고쳤어요.

할 일: copy/ 파일을 다시 복사하고 diff로 확인해요. 경로 줄 말고는 차이가 0이어야 해요.
같이 볼 것: 화면 정의서 검토에서 시드 하나가 걸렸어요. D 시드에서 AI 고지 v2가 이미 확인된 상태로 들어가 있어서, 통합 데모 37단계(G 장면의 고지 확인)가 사라져요. 필요하면 시드를 "미확인"으로 고치고 기획도 재인계해요. 상태 줄 메모는 "(재승인 대기)"로 달아요.
보고: 파일별 diff 줄 수, 그리고 AI 고지 시드를 어떻게 처리했는지.
~~~~

### p0583

2026-11-04 12:36 · 허브 지시 · B 기획: Evenstay Safety 안심 알림

~~~~text
B 카피에서 "앱과 똑같이" 표현을 뺐으니 `docs/safety/copy/`에 다시 인계해 주세요. 바뀐 원본은 `03-copywriting/ideas/safety-signal-hub/`의 `copy.md`, `value-prop.md`, `product-marketing.md`예요. 앱에는 호출 버튼이 없고 앱은 부른 뒤 보는 곳이에요(사용자 결정).

할 일
- 기획 7종에 앱에서 직원을 부른다고 읽히는 문장이 있으면 고치고 "(재승인 대기)" 메모와 변경 기록을 달아요.
- 복사하고 diff로 확인해요. 경로 줄 말고는 차이가 0이어야 해요.

보고: 고친 곳, 파일별 diff 줄 수.
~~~~

### p0619

2026-11-04 13:44 · 허브 지시 · A 코어 기획: Evenstay Core PRD·tech-design

~~~~text
코어 카피가 바뀌었으니 `docs/core/copy/`에 다시 인계해 주세요. 바뀐 원본은 `03-copywriting/ideas/pms-core-billing/copy.md`, `names.md`예요. 앱 캔버스 가칭 문구를 확정했어요. 복사하고 diff로 확인해요. 경로 줄 말고는 차이가 0이어야 해요. 보고: 파일별 diff 줄 수.
~~~~

### p0620

2026-11-04 13:44 · 허브 지시 · B 기획: Evenstay Safety 안심 알림

~~~~text
B 카피 2-22절이 더해졌으니 `docs/safety/copy/`에 다시 인계해 주세요. 앱 캔버스 가칭 문구를 확정했어요. 복사하고 diff로 확인해요. 경로 줄 말고는 차이가 0이어야 해요. 보고: 파일별 diff 줄 수.
~~~~

### p0626

2026-11-04 13:47 · 허브 지시 · D 기획: Evenstay Family 보호자 포털·동의

~~~~text
D 카피에 앱 캔버스 확정 문구와 4-4 문장 수정이 들어갔으니 `docs/family/copy/`에 다시 인계해 주세요. 복사하고 diff로 확인해요. 경로 줄 말고는 차이가 0이어야 해요. 보고: 파일별 diff 줄 수.
~~~~

### p0651

2026-11-04 14:27 · 허브 지시 · C 기획: Evenstay Transitions 생활 지원 단계

~~~~text
C 카피에서 화면의 "그대로인 것"을 없앴어요. 회원·보호자는 "이번에 바뀌지 않아요", 직원은 "바뀌지 않는 것"이에요. "더해진 도움"도 풀었어요. 사용자가 매우 어색하다고 지적한 말이에요.

할 일
- 기획 문서가 화면 문구로 인용한 곳을 맞춰요. 개념 설명의 낱말은 뜻이 같으면 두어도 돼요. "(재승인 대기)" 메모와 변경 기록을 달아요.
- 기획과 copy/ 4개를 `evenstay/docs/transitions/`로 다시 인계하고 diff로 확인해요. 경로 줄 말고는 차이가 0이어야 해요.

보고: 고친 곳, 파일별 diff 줄 수.
~~~~

### p0679

2026-11-04 15:28 · 허브 지시 · A 코어 기획: Evenstay Core PRD·tech-design

~~~~text
코어 기획 문서의 인용 문구를 바뀐 카피에 맞춰 주세요. 사용자가 쉬운 말 재검수와 공용 문구를 "추천대로"로 확정했습니다.

근거: `03-copywriting/ideas/pms-core-billing/plain-read-review-2026-11-04.md`의 전후 표, 공용 문구 반영 절, 남은 곳 목록. `shared/decisions.md` 2026-11-04 공용 문구 행도 봅니다.

범위: `ideas/pms-core-billing/` 기획 문서에서 회원·보호자 화면 문구를 인용한 줄을 새 문구로 맞추고, `evenstay/docs/core/`의 같은 파일도 같게 고칩니다. 경로 줄을 뺀 차이가 0인지 확인합니다. 회원 화면의 억 단위 금액 "5억 8천만 원" 표시 규칙은 해당 요구사항에 적습니다. 직원 화면과 업무 용어 "퇴거"는 그대로입니다.

하지 않을 것: 기능, 범위, 정책, 수치 변경. 카피 파일과 `mvp-screens.md` 수정. 커밋. 고친 문서의 상태 줄에 "재승인 대기"를 적습니다.

보고: 파일별 고친 줄 수, docs 차이 결과, 옛 문구를 다시 찾은 결과, 판단이 필요해 남긴 곳.
~~~~

### p0680

2026-11-04 15:28 · 허브 지시 · B 기획: Evenstay Safety 안심 알림

~~~~text
안심 알림 기획 문서의 인용 문구를 바뀐 카피에 맞춰 주세요. 사용자가 쉬운 말 재검수와 공용 문구를 "추천대로"로 확정했습니다.

근거: `03-copywriting/ideas/safety-signal-hub/plain-read-review-2026-11-04.md`의 전후 표, 공용 문구 반영 절, 남은 곳 목록(`service-blueprint.md` 73, 93행 등). `shared/decisions.md` 2026-11-04 공용 문구 행도 봅니다.

범위: `ideas/safety-signal-hub/` 기획 문서에서 회원·보호자 화면 문구를 인용한 줄을 새 문구로 맞추고, `evenstay/docs/safety/`의 같은 파일도 같게 고칩니다. 경로 줄을 뺀 차이가 0인지 확인합니다.

하지 않을 것: 기능, 범위, 정책, 수치 변경. 카피 파일과 `mvp-screens.md` 수정. 커밋. 고친 문서의 상태 줄에 "재승인 대기"를 적습니다.

보고: 파일별 고친 줄 수, docs 차이 결과, 옛 문구를 다시 찾은 결과, 판단이 필요해 남긴 곳.
~~~~

### p0681

2026-11-04 15:28 · 허브 지시 · D 기획: Evenstay Family 보호자 포털·동의

~~~~text
보호자 포털 기획 문서의 인용 문구를 바뀐 카피에 맞춰 주세요. 사용자가 쉬운 말 재검수와 공용 문구를 "추천대로"로 확정했습니다.

근거: `03-copywriting/ideas/family-consent-portal/plain-read-review-2026-11-04.md`의 전후 표, 공용 문구 반영 절, 남은 곳 목록. `shared/decisions.md` 2026-11-04 공용 문구 행도 봅니다.

범위: `ideas/family-consent-portal/` 기획 문서에서 회원·보호자 화면 문구를 인용한 줄을 새 문구로 맞추고, `evenstay/docs/family/`의 같은 파일도 같게 고칩니다. 경로 줄을 뺀 차이가 0인지 확인합니다. 운영값 이름 "2영업일"은 그대로 둡니다. 동의 체계 설명의 "동의" 용어는 그대로 둡니다.

하지 않을 것: 기능, 범위, 정책, 수치 변경. 카피 파일과 `mvp-screens.md` 수정. 커밋. 고친 문서의 상태 줄에 "재승인 대기"를 적습니다.

보고: 파일별 고친 줄 수, docs 차이 결과, 옛 문구를 다시 찾은 결과, 판단이 필요해 남긴 곳.
~~~~

### p0682

2026-11-04 15:29 · 허브 지시 · G 기획: Evenstay Home 비서 최소판

~~~~text
홈 비서 기획 문서의 인용 문구를 바뀐 카피에 맞춰 주세요. 사용자가 쉬운 말 재검수와 공용 문구를 "추천대로"로 확정했습니다.

근거: `03-copywriting/ideas/senior-ai-assistant/plain-read-review-2026-11-04.md`의 전후 표, 공용 문구 반영 절, 고칠 곳 표(`prd.md` 12절 납부 갈래, `tech-design.md` 152~157, `user-stories.md`, `service-blueprint.md`, `handoff.md`, `strategy.md`). `shared/decisions.md` 2026-11-04 공용 문구 행도 봅니다.

범위: `ideas/senior-ai-assistant/` 기획 문서에서 회원 화면 문구를 인용한 줄을 새 문구로 맞추고, `evenstay/docs/assistant/`의 같은 파일도 같게 고칩니다. 경로 줄을 뺀 차이가 0인지 확인합니다. 답 틀의 원문 일치 표는 답변 카피와 글자까지 같아야 합니다. 버전 뜻의 "최소판"은 "최소 버전"으로 맞춥니다.

하지 않을 것: 기능, 범위, 정책, 수치, 답변 갈래 변경. 카피 파일과 `mvp-screens.md` 수정. 커밋. 고친 문서의 상태 줄에 "재승인 대기"를 적습니다.

보고: 파일별 고친 줄 수, docs 차이 결과, 옛 문구를 다시 찾은 결과, 판단이 필요해 남긴 곳.
~~~~

### p0683

2026-11-04 15:29 · 허브 지시 · C 기획: Evenstay Transitions 생활 지원 단계

~~~~text
생활 지원 단계 기획 문서의 인용 문구를 바뀐 카피에 맞춰 주세요. 사용자가 쉬운 말 재검수와 공용 문구를 "추천대로"로 확정했습니다.

근거: `03-copywriting/ideas/care-stage-transition/plain-read-review-2026-11-04.md`의 전후 표, 공용 문구 반영 절, 남은 곳 목록("하루 한 번 직원 방문" 포함). `shared/decisions.md` 2026-11-04 공용 문구 행도 봅니다.

범위: `ideas/care-stage-transition/` 기획 문서에서 회원·보호자 화면 문구를 인용한 줄을 새 문구로 맞추고, `evenstay/docs/transitions/`의 같은 파일도 같게 고칩니다. 경로 줄을 뺀 차이가 0인지 확인합니다. 단계가 바뀐 적 없는 회원에게 "이번에 바뀌지 않아요" 제목을 숨기는 표시 조건도 해당 요구사항에 적습니다.

하지 않을 것: 그 밖의 기능, 범위, 정책, 수치 변경. 카피 파일과 `mvp-screens.md` 수정. 커밋. 고친 문서의 상태 줄에 "재승인 대기"를 적습니다.

보고: 파일별 고친 줄 수, docs 차이 결과, 옛 문구를 다시 찾은 결과, 판단이 필요해 남긴 곳.
~~~~

### p0776

2026-11-04 19:56 · 허브 지시 · B 기획: Evenstay Safety 안심 알림

~~~~text
허브 지시: 시니어 하우징 조사 결과를 안심 기획에 반영한다(사용자 "검토 후 반영").
기준 문서: `~/ai/senior-lab/00-hub/reviews/research-reflection-2026-11-04.md` 1절 R1~R5. 근거: `~/ai/senior-lab/01-research/outputs/senior-housing-architecture.md` 6·9절.
범위: `~/ai/senior-lab/04-planning/ideas/safety-signal-hub/`의 `prd.md`, `tech-design.md`, 영향이 있으면 `handoff.md`.
규칙: 바뀐 곳에 "재승인 대기"를 쓰고 변경 기록을 남긴다. 화면과 copy는 바꾸지 않는다. 화면 문구에 영향이 있으면 고치지 말고 목록으로 보고한다. 5분 값 자체는 유지하고 근거 표시만 고친다. "법령에 없다"가 아니라 "열어 본 본문에서 찾지 못했다"로 쓴다. `evenstay/docs/`, `shared/`는 고치지 않고 커밋하지 않는다. 쉬운 말로 쓰고 "판" 대신 "버전"을 쓴다.
보고: 고친 파일과 절, 다른 모듈에 영향이 있는 점, 호출한 스킬. 끝나면 턴을 마친다.
~~~~

### p0777

2026-11-04 19:56 · 허브 지시 · A 코어 기획: Evenstay Core PRD·tech-design

~~~~text
허브 지시: 시니어 하우징 조사 결과를 코어 기획에 반영한다(사용자 "검토 후 반영").
기준 문서: `~/ai/senior-lab/00-hub/reviews/research-reflection-2026-11-04.md` 1절 R6~R10과 2절. 근거: `~/ai/senior-lab/01-research/outputs/senior-housing-architecture.md` 6·9절, `sources/arch-erp-payment-crm.md`, `sources/arch-design-requirements.md`.
범위: `~/ai/senior-lab/04-planning/ideas/pms-core-billing/`의 `tech-design.md`, `prd.md`의 확인할 것, 영향이 있으면 `handoff.md`.
규칙: MVP는 만들지 않으므로 설계 문서 변경이다. 화면을 추가하지 않는다. 한도 수치는 [추정], 제공자별 멱등 키는 [가설], 90일 규정은 [미확인]으로 표시한다. 동반자 타이머는 상태기계에 넣지 않고 확인할 것으로만 쓴다. 기존 원장 불변(ADR-4)과 시드 금액은 바꾸지 않는다. 바뀐 곳에 "재승인 대기"를 쓰고 변경 기록을 남긴다. `evenstay/docs/`, `shared/`는 고치지 않고 커밋하지 않는다. 쉬운 말로 쓰고 "판" 대신 "버전"을 쓴다.
보고: 고친 파일과 절, 새 엔티티와 상태, 다른 모듈에 영향이 있는 점, 호출한 스킬. 끝나면 턴을 마친다.
~~~~

### p0779

2026-11-04 20:01 · 에이전트 지시 · A 코어 기획: Evenstay Core PRD·tech-design

~~~~text
읽기 전용으로 검수해 주세요. 파일을 고치지 마세요. 한국어로 보고합니다.

대상: ~/ai/senior-lab/04-planning/ideas/pms-core-billing/tech-design.md 의 새 내용(2-2 Payment·DirectDebitMandate·DirectDebitBatch·ExpectedPayment·LedgerExportBatch, 2-3 ERD, 3-5 절 전체, ADR-1 '남은 설계 빈칸', 8-1 웹훅 줄, 9절 표와 그 아래 세 단락, 11절 멱등·자동이체 줄, 확인할 것 32~36, 변경 기록 마지막 절), 같은 폴더 prd.md 확인할 것 16~18, handoff.md '재승인 대기' 절.

기준: ~/ai/senior-lab/00-hub/reviews/research-reflection-2026-11-04.md 1절 R6~R10, 2절, 3절. 근거: ~/ai/senior-lab/01-research/outputs/senior-housing-architecture.md 6·9절, ~/ai/senior-lab/01-research/sources/arch-erp-payment-crm.md, ~/ai/senior-lab/01-research/sources/arch-design-requirements.md.

규칙: 화면 추가 없음. 한도 수치 [추정], 제공자별 멱등 키 [가설], 90일 규정 [미확인]. 동반자 타이머는 상태기계에 넣지 않음. 원장 불변(ADR-4)과 시드 금액 불변. 바뀐 곳에 '재승인 대기'. 지어낸 사실 금지.

확인할 것:
1. R6~R10과 2절의 각 항목이 빠짐없이 들어갔는가.
2. 기존 문서와 모순되는가(ADR-4, ADR-5, 3-1, 3-2의 수납 상태 계산, 6-3 대리 범위 PAY, 8-3 이벤트 PaymentRecorded/PaymentFailed, 7절).
3. 새 상태 전이에 빈틈이나 논리 오류가 있는가.
4. 근거 문서에 없는 사실을 [사실]로 쓴 곳이 있는가. 태그가 근거와 맞는가.

결과는 문제만 심각도 순으로, 파일:줄과 고칠 내용을 짧게. 문제가 없으면 없다고 씁니다.
~~~~

### p0785

2026-11-04 20:52 · 허브 지시 · B 기획: Evenstay Safety 안심 알림

~~~~text
허브 지시: 프로토타입에서 드러난 안심 항목을 고친다(사용자 "추천대로", `~/ai/evenstay/design/prototype/REPORT.md` 2·4·10번).
1. `prd.md` B-2의 놓친 안부 방문 대상을 화면 정의서 5절대로 박영순으로 고친다.
2. SAF-17 [대피 확인함]을 잘못 눌렀을 때의 정정 기록을 설계에 넣는다. 원 기록은 고치지 않고 추가만 한다. 누가 언제 정정했는지 남긴다. 화면 문구는 쓰지 않는다.
3. SAF-11 규칙 표는 `tech-design.md` 규칙이 기준이라는 한 줄을 넣는다. 보드의 "안부 전화 2회 미응답", "낮 침대 떠남"이 규칙에 없는 까닭이 문서에 있으면 그대로 두고, 없으면 확인할 것에 적는다.
범위: `04-planning/ideas/safety-signal-hub/`. 바뀐 곳에 "재승인 대기"를 쓰고 변경 기록을 남긴다. `evenstay/docs/`, `shared/`는 고치지 않고 커밋하지 않는다. 끝나면 고친 곳을 보고하고 턴을 마친다.
~~~~

### p0786

2026-11-04 20:52 · 허브 지시 · A 코어 기획: Evenstay Core PRD·tech-design

~~~~text
허브 지시: 프로토타입이 시드에 없어서 지어낸 값을 코어 시드 목록에 올린다(사용자 "추천대로", `~/ai/evenstay/design/prototype/REPORT.md` 1번).
입력: `~/ai/evenstay/design/prototype/review-notes.md` 3절의 지어낸 값. 다온하우스 임차인 이름 등 코어 시드에 속하는 값만 고른다. 다른 모듈 값은 목록으로만 보고한다.
범위: `04-planning/ideas/pms-core-billing/prd.md` 9절. 값마다 "가상"으로 표시한다. 기존 금액과 인물은 바꾸지 않는다. 바뀐 곳에 "재승인 대기"를 쓰고 변경 기록을 남긴다. `evenstay/docs/`, `shared/`는 고치지 않고 커밋하지 않는다. 끝나면 고친 곳을 보고하고 턴을 마친다.
~~~~

### p0788

2026-11-04 20:54 · 허브 지시 · A 코어 기획: Evenstay Core PRD·tech-design

~~~~text
사용자 확정: 김태호 대리인 유효기간 종료일은 2028-09-30(가상)이다. `prd.md` 9절의 [미정]을 이 값으로 고친다. 재승인 대기 표시와 변경 기록을 유지한다. `evenstay/docs/`, `shared/`는 고치지 않고 커밋하지 않는다. 끝나면 턴을 마친다.
~~~~

### p0792

2026-11-04 21:02 · 허브 지시 · A 코어 기획: Evenstay Core PRD·tech-design

~~~~text
프로토타입이 시드 어긋남을 고치며 넣은 값 두 가지를 `prd.md` 9절에 가상으로 올린다.
1. 새봄 요금표 시작일 2026-03-01(가상, 다섯 가지 모두).
2. 김도현 대리인: 범위는 청구서 확인·결제, 기간은 2026-05-01부터 2028-04-30까지(가상).
재승인 대기 표시와 변경 기록을 유지한다. `evenstay/docs/`, `shared/`는 고치지 않고 커밋하지 않는다. 끝나면 턴을 마친다.
~~~~
