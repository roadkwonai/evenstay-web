# 04-planning: 서비스 기획 → PRD → 개발 인계

목적: 아이디어 하나를 디자인과 MVP 개발에 바로 넘길 수 있는 기획 문서 묶음으로 만든다.

## 작업 단위
- 한 세션에서 아이디어 하나만 다룬다. 폴더: `ideas/<slug>/`
- 입력: `../02-ideation/outputs/shortlist.md` 해당 항목, `../03-copywriting/ideas/<slug>/`, `../01-research/outputs/` (문제 은행, 페르소나)

## 사용할 스킬과 순서
| 순서 | 스킬 | 하는 일 | 산출물 |
|---|---|---|---|
| 1 | `product-strategy` | 대상 이용자, 차별점, 목표 결과, **하지 않을 것** | `strategy.md` |
| 2 | `service-blueprint` | 시니어, 보호자, 운영 직원의 행동, 화면 접점, 직원 업무, 시스템, 실패 대응 | `service-blueprint.md` |
| 3 | `create-prd` | MVP 범위, 기능 요구사항, 권한, 오류, 성공 기준 | `prd.md` |
| 4 | `user-stories` | 이용자별 스토리와 인수 조건 | `user-stories.md` |
| 5 | `outcome-roadmap` | MVP → 다음 버전, 결과와 가설 기준 순서 | `roadmap.md` |

## PRD에 반드시 들어갈 것
- **MVP 범위**: 혼자 2~4주 안에 만들 수 있는 핵심 흐름 1~2개. 나머지는 "다음 버전"으로 뺀다.
- **데모 시나리오**: 면접에서 3~5분 안에 보여줄 순서와 시드 데이터(가상 입주자, 가상 시설)
- **시니어 접근성**: 큰 글씨와 터치 영역, 한 화면에 하나의 행동, 쉬운 말, 되돌리기, 음성·전화 대안, 보호자·직원 대행
- **역할과 권한**: 시니어 본인, 보호자, 운영 직원, 관리자
- **개인정보와 안전**: 민감정보(건강) 수집 범위, 동의, 응급 상황에서 사람이 개입하는 지점
- **기술 메모**: 외부 연동이 필요한 부분은 MVP에서 목업으로 대체하는지 명시

## 코어 + 모듈 구조 (2026-11-02 확정)
- 숏리스트 MVP는 하나의 PMS 코어(`pms-core-billing`) 위에 모듈(`safety-signal-hub`, `family-consent-portal`, `senior-ai-assistant`, `care-stage-transition`, 예비 `move-in-crm-agent`)을 얹는 구조다.
- 금융 기능은 별도 모듈이 아니다. 코어에 대리권·후견(I-30)과 청구 설명(I-29), 보호자 포털에 금전 업무 경계(I-31)와 AI 고지·동의·감사(I-42)를 넣는다.
- `senior-ai-assistant`(G)는 새 데이터를 만들지 않고 다른 모듈 API를 도구로 호출하는 앞단이다. 건강·금전·계약 판단은 사람에게 넘기고, 투자 추천·주문은 하지 않는다. 증권 계좌 조회는 모의투자 서버와 가상 데이터 시연만 한다. 설계 출발점은 `../02-ideation/drafts/ai-assistant.md`.
- **공통 도메인 모델의 기준은 `ideas/pms-core-billing/tech-design.md` 하나다.** 다른 모듈은 코어 엔티티(운영사, 소유주, 사이트, 동, 호실, 입주자, 보호자 관계, 계약, 청구, 역할)를 참조하고 자기 확장 엔티티와 이벤트만 정의한다. 코어 모델을 바꿔야 하면 코어 문서를 먼저 고치고 이유를 `../shared/decisions.md`에 남긴다.
- 기획 순서: 코어 → B → D → G → C. G 최소판(일정 조회 + 청구 설명)은 코어 직후에 붙이고 모듈이 늘 때마다 도구를 추가한다. 모듈 PRD에는 "코어에 기대는 것"과 "코어 없이 단독 데모할 때 대체하는 것"을 적는다.
- 개발은 상위 저장소 하나(``)에 코어와 모듈을 하위 폴더로 두는 **중첩 구조**다(2026-11-02 확정). 하나의 백엔드 안에서 모듈 경계를 지키는 모듈형 모놀리스를 기본으로 한다. 모듈이 다른 모듈의 테이블을 직접 읽지 않고 코어 API나 이벤트로만 주고받는 경계 규칙, 패키지 분리 방식, 기술 스택은 코어 tech-design에서 ADR로 정한다.
- 상위 `evenstay/CLAUDE.md`에는 공통 규칙(도메인 용어집, 권한 원칙)을, 모듈 폴더의 `CLAUDE.md`에는 그 모듈의 범위와 하지 않을 것을 둔다. 병행 작업은 모듈별 브랜치·worktree로 나누고 코어 변경은 순서대로 한다.

## 기술 설계 (지원 직무가 Backend/Tech Lead이므로 필수)
PRD 다음에 `ideas/<slug>/tech-design.md`를 쓴다. 기술 스택은 확정하지 말고 후보와 선택 기준만 적는다. 확정은 MVP 프로젝트에서 한다.
- 도메인 모델과 ERD 초안: 공통 PMS 코어(사업장, 호실, 입주자, 계약, 청구)와 이 아이디어의 확장 엔티티를 구분
- Multi-site·자산 유형 확장 방식과 그 이유 (ADR 형식: 맥락, 선택지, 결정, 결과)
- 주요 API 목록과 상태 전이(계약, 청구, 요청 처리)
- RBAC 역할표와 민감정보 처리(마스킹, 동의, 감사 로그)
- 외부 연동 경계(결제, 출입, IoT, AI Agent): 어댑터, 멱등성, 실패 처리
- 테스트·배포·모니터링 최소 기준

## 개발 인계
기획이 끝나면 `ideas/<slug>/handoff.md`에 아래 내용을 쓰고, 문서 묶음을 `docs/<모듈>/`로 복사한다. `senior-lab` 안에 MVP 프로젝트를 만들지 않는다(기획용 CLAUDE.md가 개발에 적용되지 않게).

| slug (기획) | 모듈 폴더 (개발) | 이름 |
|---|---|---|
| pms-core-billing | core | Evenstay Core |
| safety-signal-hub | safety | 안심 알림 (직원 화면, 2026-11-03 한글화) |
| family-consent-portal | family | Evenstay 패밀리 |
| senior-ai-assistant | assistant | Evenstay 홈 비서 |
| care-stage-transition | transitions | 생활 지원 단계 (직원 화면, 2026-11-03 한글화) |
| life-requests | requests | 생활 요청 (N1, 2026-11-03 추가) |
| community | community | 프로그램·시설·공지 (N2, 2026-11-04 추가) |
| move-in-crm-agent | leasing | Evenstay Leasing |

- 한 줄 요약, 대상, 핵심 흐름, 화면 목록, 데이터 모델 초안, 인수 조건 링크, 하지 않을 것
- `../shared/idea-board.md` 단계를 `인계`로 바꾼다.
