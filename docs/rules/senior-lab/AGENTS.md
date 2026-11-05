# 다른 AI와 함께 작업하는 지침

ChatGPT, Codex, Gemini처럼 Claude Code가 아닌 AI가 이 프로젝트의 진행 상황을 확인하고 검토할 때 읽는 문서다. 규칙의 원본은 `CLAUDE.md`이고, 이 문서는 무엇을 어떤 순서로 확인할지, 아키텍처 페이지와 도식을 어떻게 만드는지, 어떤 스킬을 설치하고 썼는지 정리한다. 2026-11-05 사용자 요청으로 추가했다.

## 1. 프로젝트 한눈에 보기

- 시니어 하우징 회사 지원용 포트폴리오다. 결과물은 기획 문서, 아트보드, 클릭형 프로토타입, 아키텍처 설계안까지다. MVP는 만들지 않는다.
- 저장소가 둘이다. `senior-lab/`은 리서치와 기획, `evenstay/`는 디자인과 프로토타입이다. 같은 폴더에 있는 `~/ai/senior-lab`과 `~/ai/evenstay`다.
- **두 폴더 모두 git 저장소가 아니다.** 변경 이력이 없어서 덮어쓰면 되돌릴 수 없다. 같은 파일을 두 AI가 동시에 고치지 않는다.

## 2. 진행 상황을 확인하는 순서

아래 순서로 읽으면 현재 상태를 알 수 있다. 앞의 네 파일만 읽어도 전체 그림이 잡힌다.

| 순서 | 파일 | 여기서 확인할 것 |
|---|---|---|
| 1 | `senior-lab/CLAUDE.md` | 공통 규칙, 사실 표기, 시니어 서비스 원칙 |
| 2 | `senior-lab/shared/idea-board.md` | 아이디어별 단계와 다음 행동 |
| 3 | `senior-lab/shared/decisions.md` | 사용자가 정한 결정. 맨 아래가 최신이다. 여기 적힌 결정은 뒤집지 않는다 |
| 4 | `evenstay/docs/project.md` | 서비스, 흐름, 기술 기준, 문구 관리 규칙 |
| 5 | `evenstay/docs/glossary.md` | 용어, 화면 말, 쓰지 않는 말 |
| 6 | `evenstay/CLAUDE.md` | 모듈 경계, 화면 원칙, 디자인 규칙 |
| 7 | `senior-lab/00-hub/reviews/` | 날짜별 검토 기록과 결정 대기 항목 |

산출물이 승인됐는지는 제목 아래 `상태:` 줄을 본다. `상태: 초안`이면 사용자가 아직 승인하지 않은 문서다.

## 3. 주제별 확인 파일

| 주제 | 원본 | 웹에서 보기 | 근거와 대조 기록 |
|---|---|---|---|
| 아키텍처, 기술 스택, 로드맵 | `senior-lab/01-research/outputs/senior-housing-architecture-design.md` | `evenstay/design/prototype/home/architecture.html` | `senior-lab/01-research/sources/arch-*.md`, `senior-lab/01-research/outputs/senior-housing-architecture.md` |
| 리서치와 문제 은행 | `senior-lab/01-research/outputs/` | `home/research.html` | `senior-lab/01-research/sources/`, `notes/` |
| 아이디어 평가 | `senior-lab/02-ideation/outputs/` | 없음 | `senior-lab/shared/evaluation-rubric.md` |
| 모듈 기획 | `evenstay/docs/<모듈>/` (`prd.md`, `tech-design.md`, `user-stories.md`, `handoff.md`) | `home/docs.html` | `senior-lab/04-planning/ideas/<slug>/` |
| 화면 문구 | `evenstay/design/prototype/strings/<모듈>.json` | `index.html`, `app.html` | `evenstay/docs/<모듈>/copy/copy.md` |
| 디자인 값 | `evenstay/DESIGN.md` | `home/artboards.html` | 없음 |

웹은 `evenstay/`에서 아래 명령으로 연 뒤 http://localhost:4173/ 에서 본다.

```bash
python3 -m http.server 4173 --directory design/prototype
```

## 4. 파일을 올려서 쓰는 AI(ChatGPT 웹 등)

폴더를 직접 읽지 못하면 사용자가 아래 파일을 올린다. 아키텍처를 검토할 때 필요한 최소 묶음이다.

1. `senior-lab/CLAUDE.md`
2. `senior-lab/shared/decisions.md`
3. `senior-lab/01-research/outputs/senior-housing-architecture-design.md`
4. `evenstay/docs/glossary.md`
5. 필요하면 `senior-lab/01-research/outputs/senior-housing-architecture.md`, `senior-lab/01-research/sources/arch-gpt-crosscheck.md`

아래 문장을 함께 붙여 넣는다.

```text
올린 파일은 시니어 레지던스 운영 시스템의 설계안이고 구현물이 아닙니다.
파일을 다시 쓰지 말고 검토 의견만 주세요. 이미 결정된 사항은 decisions.md에 있습니다.
의견마다 위치(파일과 절), 문제, 근거 출처와 조회일, 고칠 내용, 심각도(높음/중간/낮음)를 적어 주세요.
확인하지 못한 내용은 '미확인'이라고 쓰고, 없는 수치와 회사 내부 사정을 지어내지 마세요.
```

## 5. 검토할 때 확인할 것

**사실과 근거**
- 문장마다 [사실] [추정] [가설] [미정] [미확인]이 내용과 맞는가.
- 통계, 정책, 회사 정보에 출처 URL과 기준 날짜가 있는가. 없는 수치, 인터뷰, 회사 내부 사정이 들어가지 않았는가.
- 법령은 시행일과 개정 여부를 확인했는가. 법적 결론을 단정하지 않았는가.
- 자주 바뀌는 값을 지금 기준으로 다시 봤는가. 프레임워크 버전, 클라우드 단가, Bedrock 모델의 서울 처리 범위가 해당한다.

**내용이 서로 맞는지**
- 단계, 비용, 도입 기준, 마일스톤, 영역별 로드맵이 절끼리 맞는가.
- 설계안, `strings/architecture.json`, 도식 16장의 내용이 같은가.
- `shared/decisions.md`의 결정과 어긋나지 않는가.

**지켜야 할 원칙**
- 호출 접수는 건물 안에서 끝나고, 클라우드가 멈춰도 호출은 동작한다.
- 의료, 응급, 금전, 계약 판단은 사람이 한다. 금전을 실행하는 AI 도구를 만들지 않는다.
- 회원에게 보이는 답은 기록을 틀에 채워 만든다. 건강 소식이 보호자에게 가는 경로는 `family` 하나다.
- 입주자와 보호자에게는 전화, 문자, 직원 대행, 보호자 대행 같은 앱 밖 경로가 있다.
- 건강과 돌봄 정보는 민감정보로 다룬다. 수집은 최소로 하고 동의와 열람 권한을 설계한다.
- 화면에 회사 이름, 이모지, 판단 단어(낙상, 응급, 위험 등)를 쓰지 않는다.

**한국어**
- 용어가 `evenstay/docs/glossary.md`와 맞는가. "쓰지 않는 말"이 남아 있지 않은가.
- 번역투와 한국 개발 문서에서 쓰지 않는 말이 없는가. 원본 문서는 한다체, 웹 문장은 합쇼체다.

## 6. 함께 작업할 때 지킬 것

| 할 수 있음 | 사용자에게 물어야 함 | 하지 않음 |
|---|---|---|
| 파일 읽기, 검토 노트 쓰기, 공식 자료 대조 | 승인 문서 내용 변경, 범위 변경, 결정 번복 | `상태: 승인` 표시, `shared/` 수정, MVP 구현 |

- 승인은 사용자만 한다. `shared/`는 허브 세션(`00-hub/`)이 고친다.
- 검토 결과는 원본을 고치지 말고 `senior-lab/00-hub/reviews/<주제>-<AI 이름>-<날짜>.md`에 쓴다. 예: `architecture-chatgpt-2026-11-06.md`. 노트 맨 위에 읽은 파일과 조회일을 적는다.
- 사용자가 직접 수정을 맡기면 고치기 전에 고칠 파일을 말한다. 다른 세션이 쓰는 중인지 사용자에게 확인한다.
- `방법:` 줄과 보고에는 실제로 한 일만 적는다. Claude Code 스킬은 Claude Code에서만 호출된다. 다른 AI는 `방법: ChatGPT 검토`처럼 쓴다.
- 외부 AI에 파일을 올리는 일은 사용자가 정한다. 데모 인물과 수치는 모두 가상이고, 실제 개인정보를 넣지 않는다.

**허브에 요청하는 절차**

사용자가 승인했거나 `shared/`, 다른 단계 문서의 수정이 필요할 때 쓴다. 허브에 요청은 사용자가 승인하거나 지시한 뒤에만 한다.

1. 사용자가 승인하면 대상 문서의 `상태:` 줄을 `상태: 승인(날짜)`로 바꾼다. 다른 AI는 이 줄을 고치지 않고 요청 파일에 적는다.
2. 요청에 아래 내용을 적는다.
   - 사용자 말을 그대로 인용한 승인 또는 지시
   - 승인 대상 파일과, 승인이 포함하지 않는 것
   - `shared/decisions.md`에 남길 내용(날짜, 결정, 이유, 근거)
   - `shared/idea-board.md`에서 바꿀 내용이 있으면 그 내용
   - 다른 문서의 보강 요청(파일, 절, 무엇이 없는지)
   - 근거 파일
3. 요청을 보낸다.
   - Claude Code 세션: 허브 세션에 `SendMessage`로 보내고, 세션 공유 노트가 있으면 같은 내용을 남긴다.
   - 다른 AI: 세션 메시지를 보낼 수 없다. `senior-lab/00-hub/reviews/hub-request-<주제>-<AI 이름>-<날짜>.md`에 쓰고, 사용자에게 허브에서 처리를 지시해 달라고 한다.
4. 보낸 것과 처리된 것을 구분해 보고한다. 허브의 처리 결과는 `shared/decisions.md`와 허브 보고로 확인한다.

## 7. 고치는 위치

고치는 곳이 정해져 있다. 생성물을 직접 고치면 다음 빌드에서 사라진다.

| 고칠 것 | 고칠 파일 | 고친 뒤 (`evenstay/`에서 실행) |
|---|---|---|
| 아키텍처 설계 내용 | senior-lab 설계안, 그다음 `strings/architecture.json`과 도식 원본 | `node design/home/build.mjs` |
| 아키텍처 문장 하나 | `evenstay/docs/project.md` 15절의 "고칠 문장" 칸 | `node design/home/architecture/sync-text.mjs` |
| 아키텍처 용어 전체 | `evenstay/docs/glossary.md`의 "쓰지 않는 말" | `node design/home/architecture/sync-text.mjs` |
| 프로토타입 화면 문장 | `evenstay/design/prototype/strings/<모듈>.json` | 없음 |
| 메인 홈 문장 | `evenstay/design/prototype/strings/home.json` | `node design/home/build.mjs` |

손으로 고치지 않는 생성물: `design/prototype/index.html`, `design/prototype/home/*.html`, `design/prototype/home/docs/`, `design/prototype/home/architecture/`, `design/prototype/site/`.

고친 뒤 검사는 아래 두 명령이다. 둘 다 `evenstay/`에서 돌린다.

```bash
node design/prototype/test/check-strings.mjs
```

```bash
node design/home/architecture/check-terms.mjs
```

## 8. 아키텍처 페이지 제작

통합웹 페이지는 `design/prototype/home/architecture.html`이고 생성물이다. 아래 순서로 만든다. 2026-11-05 작업을 기준으로 적었다.

1. **내용 확정.** `senior-lab/01-research/outputs/senior-housing-architecture-design.md`를 먼저 고친다. 나머지는 이 문서를 따라간다.
2. **페이지 문장.** `design/prototype/strings/architecture.json`을 고친다. 문장은 합쇼체이고 `[[용어]]`로 감싸면 용어집 단추가 된다. 감싼 말은 `docs/glossary.md`의 "아키텍처 용어"에 있어야 한다.
3. **페이지 틀.** 새 절이나 항목을 더할 때만 `design/home/build.mjs`의 `pageArchitecture`와 `design/prototype/home/assets/home.css`를 고친다.
4. **도식.** 아래 표의 원본을 고치고 도구별 명령으로 다시 만든다. 결과는 `design/prototype/home/architecture/`에 html과 png로 쌓인다.
5. **빌드.** `node design/home/build.mjs`로 페이지와 문서 페이지를 다시 만든다.
6. **문장표.** `node design/home/architecture/sync-text.mjs --list`로 `docs/project.md` 15절을 새로 쓴다.
7. **검사.** 7절의 두 명령과 `sloplint`를 돌리고, 데스크톱과 375px 폭을 브라우저로 본다.

**도식 스킬 고르기**

| 그릴 것 | 스킬 | 원본 | 다시 만드는 명령 |
|---|---|---|---|
| 클라우드 구성, 서비스 로고가 들어가는 인프라 | `stack-diagram` | `design/home/architecture/stack/make.py` | `stack/` 폴더에서 `./build.sh` |
| 전체 구조, 신호 흐름, 상태 전이, 시퀀스처럼 따라가며 보는 흐름 | `archify` | `design/home/architecture/archify/<id>/candidate.json` | 저장소 루트에서 `bash design/home/architecture/archify/build.sh` |
| 문서에 넣는 표, 판단 흐름, 층 구조, 단계 비교 | `diagram-design` | `design/home/architecture/dd/<id>/diagram.py` | `dd/` 폴더에서 `python3 build.py` |

| 스킬 | 도식 | 출처와 설치 위치 |
|---|---|---|
| `stack-diagram` | `stack-a1`, `stack-a2`, `stack-a5`, `stack-b`, `stack-c` | [caru-ini/stack-diagram](https://github.com/caru-ini/stack-diagram), `01-research/.claude/skills/`. 공개 공유 기능 `share.py`는 뺐다 |
| `archify` | `arch-system`(구조), `arch-signal`, `arch-doc`(데이터 흐름), `arch-payment`(상태), `arch-agent`(시퀀스) | [tt-a1i/archify](https://github.com/tt-a1i/archify), 전역 `~/.claude/skills/`. 빌드 때 임시 사본에 Evenstay 색과 글꼴을 입힌다 |
| `diagram-design` | `dd-roadmap`, `dd-choose`, `dd-modules`, `dd-timing`, `dd-ai-route`, `dd-delivery` | [cathrynlavery/diagram-design](https://github.com/cathrynlavery/diagram-design), `01-research/.claude/skills/` |

- `archify`는 라벨이 겹치거나 상자가 좁으면 빌드가 멈춘다. `finalize` 결과만으로 원인이 안 보이면 임시 사본의 `renderers/<유형>/render-<유형>.mjs`를 직접 돌리면 메시지가 나온다. 시퀀스는 참여자 7개까지 기본 폭에 맞는다.
- 도식의 내용 기준은 설계안이다. `design/home/architecture/brief.md`는 처음 만들 때의 지시서라 옛 값이 남아 있다.
- 웹 도식의 프레임 높이는 `strings/architecture.json`의 `figs.<id>.h`다. 도식 내용이 길어지면 함께 고친다.
- 페이지 디자인은 `hallmark`를 쓴다. `DESIGN.md`가 잠긴 시스템이라 테마를 새로 뽑지 않고 앱 범위로 돌린다. 끝낼 때 `sloplint`로 FAIL 0을 확인한다.
- 한국어 검수는 `grammar-checker`(맞춤법), `style-guide`(어조와 용어), `humanizer`(번역투) 순서로 한다.

## 9. 설치하고 사용한 스킬

Claude Code 스킬은 Claude Code에서 Skill 도구로만 호출된다. 다른 AI는 호출할 수 없으니 이 표로 어떤 방법을 썼는지 파악한다.

호출 횟수는 `evenstay/design/home/history/skills.json`의 집계다(2026-11-04 22:37 기준, 호출 ID로 중복 제거). 2026-11-05 아키텍처 작업은 집계 전이고, 이때 쓴 `stack-diagram`, `archify`, `diagram-design`은 숫자가 없다.

**기획과 PM 스킬.** 폴더마다 필요한 스킬만 `npx skills add`로 설치했다. 출처는 폴더별 `skills-lock.json`에 있다.

| 폴더 | 스킬(호출 횟수) | 출처 |
|---|---|---|
| `00-hub` | `prioritization-frameworks`(5), `strategy-red-team`(4), `pre-mortem`(3), `stakeholder-map`(1). 설치만: `retro`, `sprint-plan`, `summarize-meeting` | [phuryn/pm-skills](https://github.com/phuryn/pm-skills) |
| `01-research` | `competitor-analysis`(2), `deep-research`(1, 전역). 호출 기록 없음: `jobs-to-be-done`, `user-personas`. 설치만: `customer-research`, `mom-test`, `interview-script`, `summarize-interview` | pm-skills, [wondelai/skills](https://github.com/wondelai/skills), [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) |
| `02-ideation` | 호출 기록 없음: `brainstorm-ideas-new`, `opportunity-solution-tree`, `value-proposition`, `identify-assumptions-new` | pm-skills |
| `03-copywriting` | `copywriting`(52), `copy-editing`(51), `product-marketing`(7), `value-prop-statements`(6), `product-name`(4) | marketingskills, pm-skills |
| `04-planning` | `create-prd`(58), `user-stories`(47), `service-blueprint`(36), `outcome-roadmap`(28), `product-strategy`(17), `north-star-metric`(2) | pm-skills, [Owl-Listener/designer-skills](https://github.com/Owl-Listener/designer-skills) |
| `05-portfolio` | 설치만: `case-study`, `presentation-deck`, `review-resume` | designer-skills, pm-skills |

"호출 기록 없음"은 산출물의 `방법:` 줄에는 이름이 있는데 대화 기록에서 호출을 찾지 못한 스킬이다. 실제로 호출했다고 단정하지 않는다.

**디자인 스킬.** `evenstay/.claude/skills/`에 설치했다. 출처와 버전은 그 폴더의 `SOURCES.txt`에 있고, 작업별 사용 규칙은 `evenstay/CLAUDE.md`의 "디자인 스킬 사용 지침"을 따른다.

| 묶음 | 호출한 스킬(횟수) | 설치만 한 스킬 | 출처 |
|---|---|---|---|
| 화면 제작 | `hallmark`(30), `web-design-engineer`(12), `landing-page-design`(4), `build-awwwards-quality-sites`(3) | `tastemaker` | Nutlope/hallmark, ConardLi/garden-skills, elayadesign/ai-design-skills, MengTo/Skills, codeswithroh/tastemaker |
| 시각 검수 | `critique-visual-hierarchy`(36), `critique-information-density`(25), `critique-affordance`(22), `critique-typography`(16), `critique-composition`(15), `critique-brand-consistency`(9), `critique-color`(9) | 없음 | Owl-Listener/designer-skills |
| UI 설계 원칙 | `responsive-design`(16), `platform-conventions`(9), `layout-grid`(4), `law-of-common-region`(2), `readable-measure`(2), `color-system`(1), `spacing-system`(1), `typography-scale`(1), `visual-hierarchy`(1) | 나머지 10종 | Owl-Listener/designer-skills |
| 모션 | `emil-design-eng`(9) | 나머지 11종 | emilkowalski/skills |
| 인터페이스 검수 | `better-accessibility`(1), `better-ui`(1), `review-animations`(1) | 나머지 7종 | jakubkrehel/skills, emilkowalski/skills |

**전역 스킬.** `~/.claude/skills/`에 있고 어느 폴더에서나 쓴다.

| 쓰임 | 스킬(호출 횟수) | 출처 |
|---|---|---|
| 한국어 검수 | `grammar-checker`(101), `humanizer`(52), `style-guide`(50), `humanize-korean:humanize-korean`(1) | [DaleSeo/korean-skills](https://github.com/DaleSeo/korean-skills), 플러그인 humanize-korean |
| 이미지와 영상 | `gpt-image-api`(6), `gpt-image`(4), `higgsfield-generate`(1), `higgsfield-soul-id`(1) | 설치 기록 없음 |
