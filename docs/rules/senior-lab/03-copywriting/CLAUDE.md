# 03-copywriting: 서비스 이름 · 가치 제안 · 소개 카피

목적: 숏리스트 아이디어마다 이름과 핵심 메시지를 정해 기획 문서와 MVP 화면, 포트폴리오에서 같은 언어를 쓰게 한다. 마케팅 캠페인 카피는 범위가 아니다.

## 작업 단위
- 한 세션에서 아이디어 하나만 다룬다. 폴더: `ideas/<slug>/`
- 시작할 때 `../shared/idea-board.md`에서 해당 아이디어의 단계를 `카피`로 바꾼다.
- 숏리스트는 코어 + 모듈 구조다(2026-11-02 확정). **코어(`pms-core-billing`)에서 전체 플랫폼 이름과 말투를 먼저 정하고**, 모듈 이름과 카피는 그 체계를 따른다. 플랫폼 이름은 `ideas/pms-core-billing/names.md`에 둔다.
- 입력: `../02-ideation/outputs/shortlist.md`의 해당 항목, `../01-research/outputs/personas.md`

## 사용할 스킬과 순서
| 순서 | 스킬 | 위치 | 하는 일 |
|---|---|---|---|
| 1 | `product-marketing` | 로컬 | 제품, 이용자, 차별점 문맥 정리 → **`ideas/<slug>/product-marketing.md`에 저장** |
| 2 | `product-name` | 로컬 | 이름 후보 (시니어가 발음하고 기억하기 쉬운 한국어 이름 우선) |
| 3 | `value-prop-statements` | 로컬 | 이용자별(시니어/보호자/운영사) 가치 제안 한 줄 |
| 4 | `copywriting` | 로컬 | 서비스 소개, 첫 화면 문구, 주요 버튼·안내 문구 |
| 5 | `copy-editing` | 로컬 | 모호함, 과장, 중복 정리 |
| 6 | `humanizer`, `grammar-checker` | 전역 | 한국어 문체와 맞춤법 마무리 |

**문맥 파일 규칙**: `product-marketing`, `copywriting`, `copy-editing`은 기본으로 `.agents/product-marketing.md` 하나를 읽고 쓴다. 아이디어가 여러 개라서 그 경로는 쓰지 않는다. 항상 `ideas/<slug>/product-marketing.md`를 읽고 쓴다.

## 시니어 카피 원칙
- 짧은 문장, 존댓말, 외래어와 약어 최소화 ("케어" 대신 "돌봄", "체크인" 대신 "안부 확인"처럼 쉬운 말을 먼저 검토)
- 기능보다 결과를 말한다: "복약 알림" → "약 드실 시간을 놓치지 않게"
- 공포 마케팅, 근거 없는 효과("치매 예방"), 가짜 후기, 가짜 수치를 쓰지 않는다.

## 산출물 (`ideas/<slug>/`)
- `product-marketing.md`, `names.md` (후보와 선정 이유), `value-prop.md`, `copy.md` (소개문, 첫 화면, 핵심 UI 문구)
- 확정되면 `../shared/idea-board.md` 단계를 `기획`으로 바꾼다.
