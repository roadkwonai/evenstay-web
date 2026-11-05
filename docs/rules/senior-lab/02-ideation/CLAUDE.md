# 02-ideation: 아이디어 발산 → 평가 → 숏리스트

목적: 문제 은행에서 해결할 기회를 고르고, 아이디어를 넓게 낸 뒤 MVP 후보 3~5개로 좁힌다.

## 입력
- `../01-research/outputs/problem-bank.md` (필수), `personas.md`, `jtbd.md`, `competitive-landscape.md`
- `../shared/target-companies.md`, `../shared/evaluation-rubric.md`

## 사용할 스킬과 순서
| 순서 | 스킬 | 위치 | 하는 일 |
|---|---|---|---|
| 1 | `opportunity-solution-tree` | 로컬 | 목표(시니어 삶의 질, 운영 효율) → 기회(문제 ID) → 해결 아이디어로 트리 구성 |
| 2 | `brainstorm-ideas-new` | 로컬 | 기회별로 접근이 다른 아이디어 발산 (B2C, B2B 운영 도구, 보호자용, 오프라인 결합) |
| 3 | `value-proposition` | 로컬 | 상위 후보의 과업, 고통, 기대와 해결 결과 연결 |
| 4 | `identify-assumptions-new` | 로컬 | 후보별 핵심 가정과 가장 위험한 가정 찾기 |
| 5 | `office-hours` | 전역 | 최종 후보 2~3개를 압박 검증 (선택) |

`identify-assumptions-new` 같은 pm 스킬은 `/스킬명 <대상>` 형태로 호출하면 `$ARGUMENTS`에 대상이 들어간다.

## 저장 규칙
- `drafts/`: 트리, 발산 결과, 중간 평가
- `outputs/idea-longlist.md`: 아이디어 전체 (ID, 한 줄 설명, 연결 문제 ID, 이용자)
- `outputs/scorecard.md`: 평가 기준을 적용한 점수표 (항목별 근거 한 줄)
- `outputs/shortlist.md`: 선정 3~5개. 아이디어마다 slug, 문제, 이용자, 가치 제안, 핵심 가정, MVP 데모 시나리오 한 단락
- 선정과 탈락 이유는 `../shared/decisions.md`, 상태는 `../shared/idea-board.md`에 반영한다.

## 완료 기준
- 롱리스트 20개 이상, 모든 아이디어가 문제 ID와 연결된다.
- 숏리스트 후보마다 "어떤 증거가 나오면 계속하고 어떤 반응이면 버릴지"가 적혀 있다.
