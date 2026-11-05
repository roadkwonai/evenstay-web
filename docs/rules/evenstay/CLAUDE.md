# Evenstay — 시니어 레지던스 PMS (코어 + 모듈)

[지원 회사] Tech Lead / Senior Backend 지원용 포트폴리오 MVP. 기획 원본은 `senior-lab/`(리서치·아이디어·카피·기획)이고, 이 저장소에는 승인된 인계 문서만 `docs/<모듈>/`로 들어온다. 기획을 바꿔야 하면 senior-lab 문서를 먼저 고친다.

## 먼저 읽을 문서 (2026-11-04 사용자 지시)
- 전체 그림은 `docs/project.md`, 용어와 공용 문구, 쓰지 않는 말은 `docs/glossary.md`를 먼저 읽는다. 긴 기획 문서는 필요한 절만 찾아 읽는다.
- 프로토타입 문장은 `design/prototype/strings/<모듈>.json`, 소개 사이트 문장은 `design/site/src/strings/<페이지>.json`에서 고친다. 문구만 고칠 때는 화면 코드를 읽지 않는다.
- MVP는 만들지 않는다. 결과물은 아트보드와 클릭형 프로토타입까지다. 문서의 "MVP"는 설계 범위로 읽는다.
- 다른 AI와 함께 작업할 때 볼 항목은 `AGENTS.md`와 senior-lab `AGENTS.md`에 있다.
- 아키텍처 페이지 제작 순서, 도식별 스킬, 설치하고 쓴 스킬 목록은 senior-lab `AGENTS.md` 8·9절에 있다.

## 구조 (docs/core/tech-design.md ADR-3)
`platform/ core/ safety/ family/ assistant/ transitions/ requests/ community/ leasing/ app/ ui/ seed/ docs/`. 한 저장소, 한 번에 배포(모듈형 모놀리스). 모듈 폴더마다 `CLAUDE.md`에 그 모듈의 범위와 하지 않을 것을 둔다.

| 모듈 | 폴더 | 인계 문서 |
|---|---|---|
| 계약·청구 코어 | `core/` | `docs/core/` (2026-11-03 인계) |
| 안심 알림 | `safety/` | `docs/safety/` (2026-11-03 인계) |
| 보호자 포털·동의 | `family/` | `docs/family/` (2026-11-03 인계) |
| AI 생활 비서 | `assistant/` | `docs/assistant/` (2026-11-03 인계) |
| 생활 지원 단계 | `transitions/` | `docs/transitions/` (2026-11-03 인계) |
| 생활 요청 | `requests/` | `docs/requests/` (2026-11-03 인계, 기획 초안) |
| 프로그램·시설·공지 | `community/` | `docs/community/` (2026-11-04 인계, 기획 초안) |
| 입주 상담(예비) | `leasing/` | 기획 전 |

## 기술 방향
- 프로토타입은 HTML·JS, MVP는 Next.js, DB는 PostgreSQL. 나머지(언어 세부, ORM, 배포처)는 [미정]이다. 정할 때 기준은 `docs/core/tech-design.md` 12절.
- Next.js는 `app/`·`ui/`에만 들어온다. `core/`와 모듈의 domain·application은 프레임워크를 import하지 않는다.
- 금액은 원 단위 정수. DB 64비트 정수를 읽는 방식(문자열 또는 BigInt)은 [미정].

## 모듈 경계 (ADR-2, 어기면 안 됨)
1. 모듈마다 DB 스키마(`core`, `safety`, `family`, `assistant`, `transitions`, `requests`, `community`, `leasing`). 다른 스키마에 쓰지 않는다.
2. 모듈 구현은 `core/api`와 다른 모듈의 `api/`만 import한다. 다른 모듈의 domain·infra는 import하지 않는다. `api/`끼리는 서로 의존하지 않고 순환도 없다. `core`는 어떤 모듈도 모른다(코어 ADR-2 v1.1).
3. 다른 모듈 테이블을 조인하지 않고, 스키마 사이에 외래 키를 두지 않는다. ID만 보관한다.
4. 모듈 사이의 변화는 도메인 이벤트(아웃박스)로 전달하고, 소비자는 이벤트 ID로 멱등 처리한다.
5. 권한 검사는 코어 `authorize()` 하나(ENFORCE는 감사 기록, CHECK는 기록 없음). 모듈은 자기 이름공간 행동에만 "허용" 정책을 등록하고, 코어의 범위 거부를 뒤집지 못한다(검사 순서: `docs/core/tech-design.md` 6-3). 예외는 보호자 동의 하나다: 다른 모듈이 자기 `api/`에 "D 동의로 연다"고 선언한 행동에 한해 D가 허용 정책을 등록한다(`docs/core/tech-design.md` ADR-2 5번). 모듈이 코어를 부를 때는 시작할 때 등록한 시스템 주체 `SYSTEM:<모듈키>`로 부르고, 코어가 정한 모듈 호출용 행동만 그 사업장 범위에서 한다(6-3 0단계).
6. 변경 이력은 코어 AuditLog 하나에 `AuditWriter` API로 쓴다.
7. CI에서 import 경계 검사와 DB 스키마 권한으로 1~3을 확인한다.
8. 다른 모듈 데이터를 복사해 두지 않고 매 요청 `api/`로 읽는다. 대시보드 "확인할 일"은 `app/`이 코어 `TodoQuery`와 각 모듈 `api/`를 붙여 조립한다.
9. 데모 초기화(`/demo/reset`)는 `app/` 데모 라우트가 core → safety → family → assistant → transitions → requests → community 순서로 각 `<모듈>/seed`의 `reset(state)`를 부른다. 상태 목록은 루트 `seed/`에 있고(AFTER_SUCCESSION, G_START, C_AFTER_DISCHARGE), 모듈은 상태마다 자기 시작점을 정한다. 모르는 상태는 400.

## 용어와 호칭
- 통합 데모 주인공: A동 201호 이은숙(사별 승계 뒤 1인), 딸 김지민(보호자, 비상 연락처 1순위), 아들 김태호(대리인, 청구서 확인·결제). 시드는 `docs/core/prd.md` 9절.
- 코드 이름과 화면 용어는 `docs/core/copy/product-marketing.md` 용어집과 `docs/core/tech-design.md` 2-1절을 따른다. 화면 문구는 각 모듈 `docs/<모듈>/copy/copy.md`.
- 직원 화면과 데이터는 "입주자", 회원에게 직접 말할 때는 "회원님". 직원 화면에서 "회원", 어느 화면에서든 "노인", "입소자"는 쓰지 않는다.

## 시니어 서비스 원칙 (화면을 만들 때)
- 큰 글씨와 터치 영역, 한 화면에 하나의 행동, 쉬운 말, 되돌리기, 전화·프런트 같은 앱 밖의 대안 경로.
- 건강·돌봄 정보는 민감정보다. 별도 동의 없이 저장하거나 보여 주지 않는다.
- 의료·응급·금전·계약 판단은 사람이 한다. 시스템은 관찰된 사실과 근거만 보여 준다. 판단 단어(낙상, 쓰러짐, 응급, 위험, 배회 등)를 화면에 쓰지 않는다. 투자 추천이나 주문은 하지 않는다.
- 건강 소식이 보호자에게 가는 길은 D(family) 하나다. 다른 모듈은 보호자에게 직접 보내지 않는다.
- AI는 질문의 뜻을 고르는 데만 쓰고, 회원에게 보이는 답 문장은 기록을 틀에 채워 만든다(`docs/assistant/` ADR-G1).
- 생활 요청은 안전 신호가 아니다. 급한 일은 호출벨·프런트 전화로 가고, 요청을 안심 알림으로 옮길지는 직원이 판단한다(`docs/requests/` ADR).
- 생활 지원 단계는 사람이 정한다. 판정·추천·점수·단계 번호가 없고, 제안한 사람은 결정하지 못한다(`docs/transitions/` ADR-T1·T2).
- 데모 데이터는 가상이다. 실제 사람, 시설, 효과 수치를 지어내지 않는다.

## 디자인 작업 규칙 (2026-11-03 사용자 지시)
- 순서: ① 브랜드 컨셉 3안(포지셔닝이 서로 다름)과 로고 시안을 짧은 HTML로 보여 주고 사용자가 고른다 → ② 고른 안으로 디자인 시스템과 `DESIGN.md`([google-labs-code/design.md](https://github.com/google-labs-code/design.md) 원칙) → ③ 웹앱, 슬라이드, 로고, 브랜드 가이드라인. 앞 단계를 사용자가 고르기 전에 다음 단계를 만들지 않는다.
- 브랜드는 Evenstay(운영) / Evenstay 홈(회원) / Evenstay 패밀리(보호자, 2026-11-03 뒷말 한글 표기로 변경)(`docs/core/copy/names.md`). [지원 회사] 이름과 표지는 쓰지 않는다.
- 폰트는 Pretendard 하나. 사용자가 지정한 배포처(https://cactus.tistory.com/306)에서 받아 저장소에 두고 쓴다.
- UI는 shadcn/ui + Tailwind CSS + Lucide 아이콘. 어떤 UI 요소에도 이모지를 쓰지 않는다.
- 디자인 스킬은 `.claude/skills/`에 있고 Skill 도구로 부른다. 어떤 일에 어떤 스킬을 쓰는지는 아래 "디자인 스킬 사용 지침"을 따른다.
- 디자인 시스템 원본은 루트 `DESIGN.md`다. 값을 바꾸면 `npx @google/design.md lint DESIGN.md`(오류·경고 0) 뒤 `node design/system/build.mjs`로 `theme.css`·`tokens.css`·`globals.css`를 다시 만든다. 생성 파일은 손으로 고치지 않는다.
- 이미지: 일러스트·아이콘·마스코트와 단순 이미지는 `gpt-image`로 만든다. `gpt-image-api`는 키 이미지, higgsfield로 영상을 만들 원본 이미지, 그 밖에 고품질이 꼭 필요한 이미지에만 쓴다. 모델은 `gpt-image-2.5-sunburst`다(`gpt-image-2.5-pro`는 API에 없다). 영상은 higgsfield CLI(`higgsfield`)로 만든다.

## 디자인 스킬 사용 지침 (2026-11-03 사용자 지시)
화면·페이지·컴포넌트를 만들거나 고치거나 검토할 때는 작업 종류에 맞는 스킬을 먼저 부른 뒤 시작한다. 한 작업에 여러 줄이 걸리면 위에서 아래 순서로 쓴다. 어느 스킬도 `DESIGN.md`의 토큰과 규칙(Pretendard, Lucide, 이모지 금지, 모션 300ms 이하, `prefers-reduced-motion`, 판단 단어 금지)을 넘지 못한다. 스킬 지시와 이 파일이 다르면 이 파일이 이긴다.

| 작업 | 스킬 | 언제 |
|---|---|---|
| 기본 지침(상시) | `web-design-engineer`, `build-awwwards-quality-sites` | 새 화면·페이지를 설계하기 전 원칙 확인. 마케팅 연출(GSAP, 스크롤 연출, Three.js)은 랜딩 페이지에만 쓰고 앱 화면에는 쓰지 않는다 |
| MVP 화면 제작(상시) | `hallmark` | MVP 앱 화면과 프로토타입을 만들거나 고칠 때마다. `DESIGN.md`가 잠긴 시스템이므로 테마를 새로 뽑지 않는다(앱 범위 `--scope app`). 끝낼 때 `sloplint`를 돌려 FAIL 0을 확인한다 |
| 랜딩 페이지 | `landing-page-design` | 회원·보호자 대상 소개 페이지, 포트폴리오 소개 페이지 |
| 레퍼런스 적용 | `tastemaker` | 사용자가 레퍼런스 이미지·URL을 주고 그 느낌을 반영하라고 할 때. 색과 글꼴은 `DESIGN.md` 토큰으로 옮겨 적용하고, 레퍼런스의 자산·문구는 베끼지 않는다 |
| 애니메이션 | `emil-design-eng`(기준), `animate`(새 모션), `improve-animations`(기존 모션 개선), `apple-design`(제스처·시트), `animation-vocabulary`(용어 정리) | `hallmark`로 화면 구성이 끝난 뒤 페이지 디테일을 다듬을 때. 보조로 `review-animations`, `find-animation-opportunities`, `remove-animations`, `animation-performance`, `mobile-native`, `break-ui`, `pick-ui-library`, `ask-sonner`, `prototype`을 쓸 수 있다 |
| 디자인 검수 | visual-critique: `critique-visual-hierarchy`, `critique-information-density`, `critique-affordance`, `critique-color`, `critique-typography`, `critique-composition`, `critique-brand-consistency`. 명령 `/critique-screen`, `/critique-ux`. ui-design(Owl-Listener, 19종): `visual-hierarchy`, `layout-grid`, `spacing-system`, `typography-scale`, `readable-measure`, `color-system`, `dark-mode-design`, `responsive-design`, `platform-conventions`, `data-visualization`, 게슈탈트 법칙 7종(`law-of-*`), `von-restorff-effect`, `aesthetic-usability`, `illustration-style`. 명령 `/design-screen`, `/responsive-audit`, `/platform-audit`, `/type-system`, `/color-palette`. 보조로 `better-*`, `interface-review` | 화면을 넘기기 전. 검수는 만든 쪽과 다른 패스(새 컨텍스트의 에이전트)에서 한다. 화면 종류에 맞는 critique 3개 이상을 돌리고, 지적을 ui-design의 짝 스킬로 고친 뒤(예: `critique-visual-hierarchy` → `visual-hierarchy`, `critique-color` → `color-system`, `critique-typography` → `typography-scale`) 다시 확인한다. 색·글자·간격 값을 바꿔야 하면 스킬이 제안한 값이 아니라 `DESIGN.md`를 고쳐 다시 만든다 |

- 한 화면 작업의 기본 흐름: 기본 지침 확인 → `hallmark`로 구성 → (레퍼런스가 있으면 `tastemaker`) → 애니메이션 스킬로 디테일 → 디자인 검수 → 고친 뒤 `sloplint` 재확인.
- 보고할 때는 실제로 부른 스킬 이름을 적는다. 부르지 않은 스킬을 부른 것처럼 쓰지 않는다.
