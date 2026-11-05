# 재승인 묶음: 시니어 하우징 조사 반영

상태: 승인(2026-11-04, 사용자 "승인") · 작성: 2026-11-04 · 근거: [research-reflection-2026-11-04.md](../architecture/reviews/research-reflection.md)
`04-planning/ideas/`의 표시 42곳을 "사용자 재승인 2026-11-04"로 바꾸고 `evenstay/docs/core`, `evenstay/docs/safety`로 복사했다.

## 대상

인계본(`evenstay/docs/`)과 비교한 줄 수다. 경로 줄은 뺐다.

| 파일 | 더한 줄 | 뺀 줄 |
|---|---:|---:|
| `pms-core-billing/tech-design.md` | 76 | 8 |
| `pms-core-billing/prd.md` | 8 | 0 |
| `pms-core-billing/handoff.md` | 6 | 0 |
| `safety-signal-hub/tech-design.md` | 14 | 11 |
| `safety-signal-hub/prd.md` | 15 | 3 |
| `safety-signal-hub/handoff.md` | 4 | 1 |

## 무엇이 바뀌나

**안심**
- 신호 수신을 수신 어댑터 구조로 바꿨다. 업체 웹훅은 시뮬레이션이라고 표시한다.
- 5분은 값은 그대로이고 표시를 [가설]로 고쳤다.
- 호출은 건물 설비가 맡고 안심은 2차 알림이라고 적었다.
- 건물 인터넷 끊김과 앱 전체 중단, 외부 감시를 적었다. 대체 절차는 [미정]이다.
- 신호 끊김 기본값을 기기 종류별 표로 나눴다.

**코어**
- 새 엔티티: `DirectDebitMandate`, `DirectDebitBatch`, `ExpectedPayment`, `LedgerExportBatch`. 화면과 시드는 더하지 않았다.
- `Payment`: `provider_event_id`를 `provider_dedupe_key`로 바꾸고, `DIRECT_DEBIT`과 `expected_payment_id`를 더했다. 되돌림은 음수 행이라 ADR-4는 그대로다.
- 확인할 것 32~36: CMS 실연동, 제공자별 키, 그룹 ERP, RLS 운영 빈칸, 동반 입주자 90일.

## 허브가 확인한 것

- 새 엔티티 4개, 3-5절, 확인할 것 32~36, 안심 F1·F13, 외부 감시 절이 파일에 있다.
- 안심의 `[사실, shortlist B 데모]` 표시는 0건이다.
- 조사 문서의 토스, Caremerge 정정이 들어갔다.

## 확인하지 못한 것

- 코어 세션은 검수 지적을 고친 뒤 검수를 다시 돌리지 않았다.
- 허브는 문장 전체를 읽지 않고 핵심 항목만 대조했다.
- `user-stories.md` 등 범위 밖 문서에는 "서명 검증" 같은 옛 표현이 남아 있다.

## 승인 뒤 남는 일

| 모듈 | 내용 |
|---|---|
| 비서 | 결과 대기가 UNPAID로 계산돼 "낸 기록 없음"으로 답할 수 있다. 보이는 방법은 [미정] |
| 보호자 | `PaymentRecorded`에 음수 금액이 올 수 있다. 보호자는 PAY 대리인이 아니면 자동이체 동의를 못 한다 |
| 생활 지원, 커뮤니티 | 입법예고의 계속 거주, 입소자대표회의와 닿는다 |
| 전 모듈 | RLS 시스템 작업 범위와 모듈별 DB 역할 |
| 시드 | 사별 승계 데모는 이은숙의 입소 자격을 [가설]로 전제한다. 시드에 나이와 자격이 없다 |
