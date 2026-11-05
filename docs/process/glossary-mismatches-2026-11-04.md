# 문서끼리 어긋난 용어 (2026-11-04)

상태: 초안 · 작성: 2026-11-04 · 범위: `evenstay/docs/glossary.md`, `docs/project.md`를 쓰며 찾은 27건. 아무 문서도 고치지 않았다.

- 줄 번호는 이 파일을 쓸 때의 값이다. 표의 `docs/...`, `CLAUDE.md`, `design/...`은 `evenstay/` 기준이고, `shared/...`, `00-hub/...`는 `senior-lab/` 기준이다. 다른 세션이 문서를 고치면 줄이 밀릴 수 있다.
- `docs/<모듈>/`의 기획·카피 문서는 senior-lab 원본이 있다. 고칠 때는 senior-lab을 먼저 고친다(루트 `CLAUDE.md`).
- 추천 표기는 작성자의 제안이고 결정이 아니다. 화면 말을 바꾸는 건은 "사용자 결정"을 "예"로 두었다.

요약: 닫힘 1건, 확정 3건(5, 6, 18), 열림 23건. 남은 사용자 결정은 없다. 확정 3건의 원본 문서 수정은 남아 있다.

## 결정과 어긋남

| 번호 | 용어 | 문서별 표기(파일:줄) | 추천 표기 | 사용자 결정 |
|---|---|---|---|---|
| 1 | 기술 스택 | `CLAUDE.md:25` "MVP는 Next.js, 나머지 [미정]" · `docs/core/tech-design.md:556` 같은 말, `:566` Next.js 기준 경계 도구 · `shared/decisions.md:117` 코어 Spring 계열, 화면 Next.js | 두 문서를 설계 기준으로 고친다: 코어 Spring 계열, 화면 Next.js. `docs/project.md` 7절이 이미 이 표현이다 | 아니요(결정됨, 문서 수정만) |
| 2 | MVP 범위 | `shared/decisions.md:76` 만들지 않음 · `00-hub/reviews/architecture-staged-2026-11-04.md:20` "1단계 MVP" · `design/mvp-screens.md:1` 제목 | **닫힘**: 사용자 확정(MVP 만들지 않음, 결과물은 아트보드와 클릭형 프로토타입). `docs/project.md` 1·7·12절에서 "MVP"를 설계 범위로 설명했다. 원본 표현은 그대로 둔다 | 아니요(닫힘) |
| 3 | 판(버전의 뜻) | `docs/` 26개 파일 71줄. 많은 곳: `docs/assistant/copy/value-prop.md` 8, `docs/assistant/copy/product-marketing.md` 8, `docs/assistant/copy/copy.md` 6, `docs/transitions/tech-design.md` 4, `docs/assistant/handoff.md` 4, `docs/assistant/copy/names.md` 4. 낱말 예: `docs/assistant/tech-design.md:47` 고지 판, `:48` 모델·판, `docs/assistant/user-stories.md:28` 고지 판 번호, `docs/assistant/roadmap.md:10` 새 판마다. 찾은 식: `최소판\|고지 판\|판 번호\|모델·판\|새 판마다\|같은 판` | 버전, 최소 버전. 변경 기록 줄은 기록이라 그대로 둔다. 줄마다 봐야 한다 | 아니요(사용자 규칙이 있다) |
| 4 | 직원 화면 "회원 확인" | `docs/assistant/copy/product-marketing.md:92`, `:109` 회원 확인 · `docs/assistant/tech-design.md:36`, `docs/assistant/copy/copy.md:297` 입주자 확인 · `docs/requests/copy/names.md:79` "회원 확인"을 직원 화면 규칙 위반으로 적음 | 직원 화면은 입주자 확인. 회원에게 받는 확인을 설명하는 기획 문장은 그대로 둔다 | 아니요 |
| 5 | 금지 범위 | 미납·연체: `docs/core/copy/product-marketing.md:88` 회원 화면(미납만), `docs/requests/copy/product-marketing.md:92`, `docs/community/copy/copy.md:14` 모든 화면 · 모니터링: `docs/family/copy/product-marketing.md:96` 모든 화면, `docs/safety/copy/product-marketing.md:93` 회원·보호자 화면, `:135` 회원 화면 · 쓰러짐: `docs/safety/copy/product-marketing.md:92` "직원이 확인하기 전", `CLAUDE.md:48` 조건 없음 · 미수납: `docs/core/copy/copy.md:56`, `:172` 직원 화면에서 씀, `:603` 메모 | **확정(2026-11-04)**: 미납·연체, 모니터링, 쓰러짐은 모든 화면 금지. 미수납은 경리 업무 말로 직원 화면에 둔다. `docs/glossary.md`에 반영했다. 원본 문서는 아직 고치지 않았다 | 확정(2026-11-04) |
| 6 | 퇴거 준비 중 | `docs/core/copy/product-marketing.md:98` 회원 말 "퇴거 준비 중" · 공용 문구 "이사 나가실 날"(`shared/decisions.md:114`) | **확정(2026-11-04)**: 이사 나갈 준비 중. `docs/glossary.md`에 반영했다. 원본 문서는 아직 고치지 않았다 | 확정(2026-11-04) |

## 같은 것에 다른 이름

| 번호 | 용어 | 문서별 표기(파일:줄) | 추천 표기 | 사용자 결정 |
|---|---|---|---|---|
| 7 | 허락 대기 코드 | `docs/family/copy/product-marketing.md:108`, `docs/family/tech-design.md:87` `PENDING` · `docs/family/tech-design.md:35`, `docs/family/copy/names.md:96` `PENDING_MEMBER_CONFIRMATION` | `PENDING_MEMBER_CONFIRMATION` | 아니요 |
| 8 | 건강 소식 종류 | `docs/family/copy/product-marketing.md:114` `HealthEvent.source = SAFETY_SIGNAL` · `docs/family/tech-design.md:54` `kind`와 `source_module` | `kind = SAFETY_SIGNAL`, `source_module = SAFETY` | 아니요 |
| 9 | 단계 코드 이름 | `docs/transitions/copy/product-marketing.md:105` `CareStageDefinition`, `:109` `ResidentOpinion`, `:115` `StageHistory` · `docs/transitions/tech-design.md:36`, `:58` `StageDefinitionVersion`, `:44` `Explanation`, `:46` `StageAssignment` | tech-design 이름을 코드로 쓴다. `:44`, `:46`에 대응 메모가 있어 용어집 쪽에 같은 메모를 더한다 | 아니요 |
| 10 | 확인 토큰 코드 | `docs/assistant/copy/product-marketing.md:109` `ConfirmationToken` · `docs/assistant/tech-design.md:36`, `:50` `Confirmation` | `Confirmation` | 아니요 |
| 11 | 시설 | `docs/community/copy/product-marketing.md:108` `Facility`, `:109` 직원 "시설 예약" · `docs/community/tech-design.md:34`, `:45` `Place`, `:33` 직원 "예약" · `docs/community/copy/names.md:132` 상태 라벨 "예약" | 코드는 `Place`. 메뉴 이름은 시설 예약, 상태 라벨은 예약 | 아니요 |
| 12 | 요청 들어온 곳 | `docs/requests/copy/names.md:98` `RECURRING` · `docs/requests/tech-design.md:48` source 목록에 없음 | tech-design source 목록에 더할지 N1 기획이 확인한다 | 아니요 |
| 13 | 조정 회원 말 | `docs/core/tech-design.md:50` 조정 · `docs/core/copy/product-marketing.md:104` 지난 청구서 바로잡음 | 지난 청구서 바로잡음 | 아니요 |
| 14 | 열람 기록 회원 말 | `docs/family/tech-design.md:41`, `docs/family/copy/names.md:116` 내 소식을 본 기록 · `docs/family/copy/product-marketing.md:109` 본 기록 | 내 소식을 본 기록 | 아니요 |
| 15 | 대화 직원 말 | `docs/assistant/tech-design.md:31` 대화 · `docs/assistant/copy/product-marketing.md:100`, `docs/assistant/copy/names.md:49` 대화 기록 | 메뉴는 대화 기록 | 아니요 |
| 16 | 도구 회원 화면 | `docs/assistant/tech-design.md:34` 큰 버튼 이름, `:35` 표시 안 함 · `docs/assistant/copy/product-marketing.md:101` 표시 안 함, `:102` 확인한 곳 | 도구는 큰 버튼 이름, 도구 호출은 확인한 곳 | 아니요 |
| 17 | 보호자 결과 직원 말 | `docs/safety/tech-design.md:48` 보호자 알림 · `docs/family/tech-design.md:38` 건강 소식 · `docs/family/copy/product-marketing.md:114` 둘 다 | 유지: B 결정 화면은 보호자 알림, D는 건강 소식 | 아니요 |
| 18 | 생활지원 띄어쓰기 | `docs/core/tech-design.md:40` 직무 "생활지원" · `docs/requests/tech-design.md:39` 팀 "생활 지원". 코어와 모듈 문서, `design/mvp-screens.md` 합계 152회, 300회 | **확정(2026-11-04)**: 생활 지원으로 통일. `docs/glossary.md`, `docs/project.md`에 반영했다. 원본 문서는 아직 고치지 않았다 | 확정(2026-11-04) |
| 19 | REST 직원 접두어 | `docs/requests/tech-design.md:277`, `docs/community/tech-design.md:291` `/staff/*` · `docs/family/tech-design.md:309` `/admin/family/*` · `docs/assistant/tech-design.md:275` `/assistant/admin/*` · `docs/safety/tech-design.md:260`, `docs/transitions/tech-design.md:301` 접두어 없음 | 구현하지 않으므로 지금은 둔다. 구현한다면 하나로 모은다 | 아니요 |
| 20 | 모듈 키 표기 | `docs/family/tech-design.md:54` `SAFETY`, `TRANSITIONS` · `docs/core/tech-design.md:85` `requests` | 코어가 뜻을 모르는 문자열이라 당장 문제는 없다. 설계를 다시 볼 때 하나로 맞춘다 | 아니요 |
| 21 | 코어 문서 묶음 | `docs/core/tech-design.md:19`, `:279` 모듈 목록에 requests, community 없음 · `docs/core/prd.md:244` 소유주 리포트(I-25)가 다음 버전, `design/mvp-screens.md:150` CORE-14 월 리포트 | 목록에 두 모듈을 더한다. `prd.md`는 무엇이 다음 버전으로 남는지 코어 기획이 확인한다 | 아니요 |

## 같은 말이 다른 뜻

화면마다 맥락이 달라 바로 틀린 것은 아니다. 문서와 세션 지시에서 헷갈리지 않게 구분해 부른다. `docs/glossary.md`는 이미 구분해 적었다.

| 번호 | 용어 | 문서별 표기(파일:줄) | 추천 표기 | 사용자 결정 |
|---|---|---|---|---|
| 22 | 넘김 | `docs/safety/tech-design.md:44`, `:172` 호출 단계 · `docs/assistant/tech-design.md:37` 비서 넘김(Handoff) · `docs/requests/tech-design.md:41` 청구 넘김 | 넘김(호출 단계), 넘김(비서), 청구 넘김 | 아니요 |
| 23 | 회차 | `docs/requests/tech-design.md:54` 정기 작업 회차 · `docs/community/tech-design.md:48` 프로그램 회차 | 정기 작업 회차, 회차(프로그램) | 아니요 |
| 24 | 입주자 확인 | `docs/family/tech-design.md:36`, `:52` 입주자 확인 대기 · `docs/assistant/tech-design.md:36` 확인 토큰 · `docs/requests/copy/names.md:79` `CONFIRMED` | 화면 말은 유지. 문서에서는 모듈 이름을 붙인다 | 아니요 |
| 25 | 다시 봐 주세요 | `docs/transitions/tech-design.md:51`, `docs/transitions/copy/names.md:150` 재검토 요청 · `docs/requests/copy/names.md:120` 정기 청소 후속 요청 | 유지. 회원에게는 같은 뜻으로 읽힌다 | 아니요 |
| 26 | 병원 동행 | `docs/safety/tech-design.md:50`, `:76` `HospitalEscort`(알림 뒤) · `docs/requests/copy/names.md:60` `HOSPITAL_ESCORT`(요청 종류). 관계는 `docs/requests/tech-design.md` 10-4 N1-B4 | 유지. 문서에서는 병원 동행(알림 뒤), 병원 동행(요청)으로 나눈다 | 아니요 |
| 27 | 담당자 | `docs/safety/copy/product-marketing.md:105` `Responder` · `docs/requests/copy/product-marketing.md:102` `Assignee` | 유지. 회원 말이 직원, 맡은 직원으로 나뉜다 | 아니요 |

## 확인 못 한 것

- 3번의 71줄은 낱말 검색 수다. 변경 기록 줄과 "판단", "판매" 같은 다른 낱말은 식에서 걸렀지만 줄마다 읽지는 않았다.
- 원본 전문을 읽고 찾은 목록이 아니다. `user-stories`, `service-blueprint`, `roadmap`은 낱말 검색만 했으므로 어긋난 말이 더 있을 수 있다.
- 프로토타입 `design/prototype/strings/*.json`과는 대조하지 않았다.
