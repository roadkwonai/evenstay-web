# Evenstay 아키텍처 전면 재조사

상태: 초안 · 작성: 2026-11-04 · 범위: 아키텍처와 기술 스택만. 코드와 기획 문서는 고치지 않았다.
방법: `prioritization-frameworks`(Weighted Decision Matrix), `strategy-red-team`. 리서치는 서브에이전트 4개로 나눠 했고, 허브가 핵심 출처를 직접 열어 대조했다(10절).
앞선 문서: [architecture-options-2026-11-04.md](architecture-options.md)는 기존 방향 안에서만 비교했다. 이 문서는 기존 결정(Next.js, PostgreSQL, 모듈형 모놀리스)과 앞선 문서의 추천(Spring)을 전제로 두지 않고 다시 봤다.

## 사용자 선택 (2026-11-04)

사용자가 코어 기준을 "팀과 채용"으로 골랐다. 코어는 Spring 계열이고, A와 B는 비교 전까지 A를 기본으로 본다. 건물 층과 기획 문서 수정은 아직 정하지 않았다.

## 1. 결론

**추천 구조: 건물과 클라우드 두 층으로 나눈 모듈형 모놀리스.** [판단]

- 넓혀 봐도 **모듈형 모놀리스 + PostgreSQL + AWS 서울**은 바뀌지 않았다. PostgreSQL을 대체할 후보 중 확인된 것들은 이 설계가 쓰는 기능을 못 쓰거나 서울 리전이 없었다.
- **새 후보는 셋이다.** 건물 쪽 장애 대비, 범위를 제한한 내구 실행, 직원 업무용 사람 승인 에이전트다. 셋 다 7절의 확인이 남아 있다.
- **코어는 Spring이 기본이지만 차이가 작다.** 기본 평가에서 Spring 계열(A·B)이 앞서고, 혼자 구현이면 Phoenix(C)가 0.1점 앞선다. 인력 기준의 한국 시장 근거는 [미확인]이다.

| 판단 기준 | 코어 |
|---|---|
| 팀으로 키우고 채용까지 생각한다 | **Spring Boot + Modulith** (안 A, DBOS를 더하면 안 B) |
| 혼자 끝까지 만들고 실시간 화면이 중요하다 | **Phoenix + Ash + Oban** (안 C) |
| 주력이 TypeScript다 | **NestJS + DBOS TS** (안 G) |

## 2. 무엇을 위한 구조인가

조사 뒤 이 서비스의 어려운 점을 다섯으로 다시 추렸다. 트래픽은 어려운 점이 아니다.

| 어려운 점 | 왜 어려운가 | 맞는 도구의 방향 |
|---|---|---|
| 돈의 정확성 | 발행 항목은 불변, 보정으로 고친다 | 관계형 DB 트랜잭션과 추가만 하는 테이블 |
| 시간에 걸친 업무 | 분 단위 넘김, 월 청구, 몇 년 계약 | 짧은 일은 내구 실행, 긴 일은 상태 테이블 |
| 관계로 정해지는 권한 | 동의, 대리권, 소유주 기간 | 기간 칸과 이력이 있는 관계 테이블 |
| 건물이라는 물리 세계 | 인터넷이 끊겨도 사람은 호출한다 | 건물 안 경로를 클라우드와 분리 |
| 사람이 판단한다 | AI는 쓰기를 혼자 하지 않는다 | 도구 계층과 승인 지점 |

## 3. 추천 구조

```
[건물 층]                                       [클라우드 층: AWS 서울]

호출벨·침대 센서·출입통제                         모듈형 모놀리스 + 작업자
(기존 설비는 건물 안에서 계속 동작)                core · safety · family · assistant
        │                                        transitions · requests · community
        ▼                                                │
사업장 게이트웨이(조건부)  ──── 버퍼 후 재전송 ────►        ├─ PostgreSQL 18 (RLS, 트리거, 배제 제약)
끊김 감지, 신호 임시 보관                                 ├─ KMS (사람별 데이터 키)
                                                        ├─ 도구 계층(MCP) ─ 승인 ─ 직원 에이전트
직원 휴대폰 ◄──── 끊기면 사업장 대체 절차 [미정]           └─ 어댑터: 결제, CMS, 알림톡, ERP, LLM·STT
                                                                 ▲
                              회원·보호자: 웹 → 필요할 때 Expo 앱 ┘
```

## 4. 코어 청사진 일곱 가지

| 안 | 생각 | 구성 | 잘하는 것 | 대가 |
|---|---|---|---|---|
| **A** 단단한 코어 | 경계를 코드로 강제한다 | Java 25, Spring Boot 4.1, Spring Modulith 2.1, JobRunr, 화면은 Next.js 16 | 모듈 경계 검증과 이벤트 발행 기록이 내장 | 언어가 둘이다 |
| **B** 내구 실행 코어 | 업무 흐름을 코드 워크플로로 쓴다 | A + DBOS Java 1.2 | Postgres만으로 지속 타이머와 재개 | DBOS Java는 2025-06 시작으로 어리다. 워크플로 결정론 제약 |
| **C** 실시간 단일 스택 | 한 런타임이 웹훅·타이머·화면을 다 한다 | Elixir 1.20, Phoenix 1.8, LiveView 1.2, Ash 3, Oban | 테넌트 없는 조회를 오류로 막고, 작업을 트랜잭션에 묶는다. 언어 하나 | 한국 사례를 거의 못 찾았다. Oban 일부 기능은 유료 |
| **D** 기록 중심 코어 | 계약·청구·동의를 이벤트로 저장한다 | .NET 10 LTS, Marten 9(Postgres 위), DCB | 감사 이력이 구조에 녹아 있다 | 일반 업무까지 이벤트로 쓰면 과하다. 투영 재구축 부담 |
| **E** 최소 인원 코어 | 적은 인원으로 빠르게 | Rails 8.1, Solid Queue, Kamal | 큐와 배포까지 한 앱에서 해결 | 테넌시와 모듈 경계를 직접 설계 |
| **F** AWS 서버리스 | 서버를 두지 않는다 | Lambda durable functions, Step Functions, RDS | 서울 지원, 대기 중 컴퓨트 요금 없음 | AWS에 묶인다. RLS와 연결 풀 구성 [미확인] |
| **G** TypeScript 단일 언어 | 웹과 앱까지 한 언어로 간다 | NestJS 12, DBOS TS, Drizzle 또는 Kysely, Next.js 16, Expo | 기존 ADR-3의 npm 워크스페이스 구조와 맞다 | 경계 검증을 외부 도구로 맞춘다. 금액을 읽을 때 주의가 필요하다 |

### 가중 평가

점수는 1~5이고 **허브의 판단**이다. 측정값이 아니다. 인력·생태계 칸의 한국 시장 근거는 [미확인]이다. 서울 배치는 어느 코어든 AWS 서울에 올릴 수 있어 점수에서 빼고 통과 조건으로 뒀다.

| 기준 | 가중치 | A | B | C | D | E | F | G |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| 시간에 걸친 업무 | 15 | 4 | 5 | 4 | 3 | 3 | 5 | 5 |
| 원장·감사 정확성 | 25 | 4 | 4 | 4 | 5 | 3 | 3 | 3 |
| 경계·격리 강제 | 15 | 4 | 4 | 4 | 3 | 2 | 3 | 3 |
| 실시간·연동 | 10 | 4 | 4 | 5 | 4 | 4 | 3 | 4 |
| 소규모 운영 부담 | 20 | 4 | 4 | 4 | 3 | 5 | 4 | 4 |
| 인력·생태계 | 15 | 5 | 4 | 2 | 3 | 3 | 3 | 3 |
| **합계(기본)** | 100 | **4.15** | **4.15** | 3.80 | 3.60 | 3.35 | 3.50 | 3.60 |

| 시나리오 | A | B | C | D | E | F | G |
|---|---:|---:|---:|---:|---:|---:|---:|
| 기본 | **4.15** | **4.15** | 3.80 | 3.60 | 3.35 | 3.50 | 3.60 |
| 인력 기준 제외(시간 20, 원장 30, 경계 15, 실시간 10, 운영 25) | 4.00 | **4.20** | 4.10 | 3.70 | 3.45 | 3.65 | 3.75 |
| 혼자 구현(시간 15, 원장 20, 경계 10, 실시간 10, 운영 35, 인력 10. 언어가 둘이면 운영 칸 1점 감점: A 3, B 3, D 2) | 3.75 | 3.80 | **3.90** | 3.15 | 3.70 | 3.65 | 3.75 |

**읽는 법**
- A와 B는 기본에서 동점이다. 둘의 차이는 DBOS를 더하느냐이고, 레드팀 3번으로 정한다.
- 인력 기준을 빼면 B, C, A 순이고 차이는 0.2점 안이다.
- 혼자 구현이면 C가 0.1점 앞선다. 차이가 작아서 이 평가표만으로 언어를 정하면 안 된다.
- D의 원장 5점은 ADR-4(전체 이벤트 소싱을 쓰지 않음)를 뒤집는 대가로 얻는 점수다.

## 5. 층별 제안

대부분 코어와 무관하다. 시간 업무, 관리형 대안, 앱 줄은 코어별로 다르다. DBOS는 Python, TypeScript, Go, Java만 지원하고 Temporal 공식 SDK에는 Elixir가 없어서, 안 C는 Oban이 맡는다. Expo를 쓰면 안 C의 언어 하나도 깨진다.

| 층 | 제안 | 쓰지 않는 것과 이유 | 근거 |
|---|---|---|---|
| 운영 DB | PostgreSQL 18, 서울 | Aurora DSQL: 트리거와 PL/pgSQL 미지원, 트랜잭션당 3,000행. PG 19: 아직 RC | [허브 대조] [DSQL 문서](https://docs.aws.amazon.com/aurora-dsql/latest/userguide/working-with-postgresql-compatibility-migration-guide.html) |
| 원장 | 추가만 하는 테이블, ADJUSTMENT 항목과 음수 Payment, 트리거(ADR-4) | TigerBeetle: 프로덕션 6 replica, ECC 메모리. 월 수천 건 [추정]에 과하다 [판단] | [운영 요건](https://docs.tigerbeetle.com/operating/cluster/) |
| 권한 | 기간 칸·이력 테이블·`authorize()`·RLS. 모양은 관계 튜플처럼 둔다 | OpenFGA, SpiceDB 서버: 개념은 잘 맞지만 이력은 어차피 Postgres에 두므로 이중 기록이 된다. 여러 서비스가 권한을 공유할 때 다시 본다 | [SpiceDB 만료](https://authzed.com/docs/spicedb/concepts/expiring-relationships), [OpenFGA 조건](https://openfga.dev/docs/modeling/conditions) |
| 시간 업무 | 몇 분~몇 주 일만 워크플로 후보. 몇 년 계약은 상태 테이블 | 수년짜리 단일 워크플로: 코드가 바뀌면 진행 중 실행과 어긋날 수 있다 [추정] | [허브 대조] [DBOS Java](https://docs.dbos.dev/java/tutorials/workflow-tutorial) |
| 관리형 대안 | 직접 운영하기 싫으면 Temporal Cloud 서울 | 자체 호스팅 Temporal: 공식 글이 24/7 온콜 필요를 언급 | [허브 대조] [리전](https://docs.temporal.io/evaluate/cloud/regions), [온콜 글](https://docs.temporal.io/blog/estimating-the-cost-of-temporal-cloud) |
| 건물 | 조건부 게이트웨이(6절) | 사업장마다 풀스택을 두는 셀 구조: 1~5명에 과하다 [판단] | [AWS 셀 지침](https://docs.aws.amazon.com/wellarchitected/latest/reducing-scope-of-impact-with-cell-based-architecture/) |
| 센서 연결 | 기존 호출 설비는 유지, 센서는 보조 신호. MQTT 또는 업체 웹훅 | Home Assistant 업무 사용: 시설 SLA와 감사 근거 [미확인] | [AWS IoT 프로토콜](https://docs.aws.amazon.com/iot/latest/developerguide/protocols.html) |
| 회원 AI | ADR-G1 유지. LLM은 뜻만 고르고 답은 답 틀 | 음성 입력에서 음성 답을 바로 만드는 모델: 문장을 검수하기 어렵다 [판단] | `docs/assistant/` ADR-G1 |
| 직원 AI | 업무 API를 MCP 도구로. 읽기는 자동, 쓰기는 승인, 승인 기록은 자체 DB. 직원 에이전트가 LLM에 보낼 범위는 [미정]이다(회원 비서는 회원 정보와 도구 결과를 보내지 않는다) | 승인 없는 쓰기 에이전트. 승인이 정확히 한 번 실행을 보장하지 않으므로 멱등키가 필요하다 | [MCP 2026-07-28](https://modelcontextprotocol.io/specification/2026-07-28/changelog), [OpenAI Agents SDK 승인](https://openai.github.io/openai-agents-python/human_in_the_loop/) |
| 음성 | 지금 설계는 기기 음성 인식이고 TTS는 나중 버전이다. 서버로 옮기면 STT → 답 틀 → TTS 파이프라인, 국내 STT 후보 RTZR | 고령 화자 수치는 프리프린트뿐이므로 자체 녹음으로 잰다 | [허브 대조] [arXiv 2604.24770](https://arxiv.org/abs/2604.24770) |
| 앱 | 1단계 웹 + 알림톡. 푸시·음성이 필요해지면 Expo 한 코드베이스. 직원은 웹 | 생성형 UI: 업무 화면 생산 사례 [미확인] | — |
| 직원 오프라인 | 순찰·응대 메모가 끊겨도 써야 하면 PowerSync 후보 | Zero: 오프라인 쓰기 미지원 | [Zero 문서](https://zero.rocicorp.dev/docs/offline), [PowerSync](https://docs.powersync.com/intro/powersync-overview) |
| 리포트 | SQL 뷰, 월말 스냅샷, 서버 생성 PDF | ClickHouse, Iceberg: 이 규모에 운영비만 는다. 소유주 필터를 BI 도구에 맡기지 않는다 [판단] | — |
| 개인정보 | 원장에는 ID와 금액만. 민감 칸은 사람별 데이터 키 + KMS | 키 삭제가 법적 파기로 인정되는지는 [미확인] | [KMS 키 삭제](https://docs.aws.amazon.com/kms/latest/developerguide/deleting-keys.html) |
| 관측 | OpenTelemetry로 계측, 개인정보 제거 후 전송 | Datadog, Sentry SaaS, Grafana Cloud: 서울 사이트 없음 | [Datadog](https://docs.datadoghq.com/getting_started/site/), [Sentry](https://docs.sentry.io/product/accounts/choose-your-data-center/), [Grafana](https://grafana.com/docs/grafana-cloud/account-management/regional-availability/) |
| 배포 | ECS Fargate 서울, OpenTofu | Fly.io, Railway, Neon, Convex: 서울 리전 없음. Cloudflare Durable Objects, D1: 서울 위치 보장 안 됨 | [Fly](https://docs.fly.io/reference/regions), [Railway](https://docs.railway.com/reference/regions), [Convex](https://docs.convex.dev/production/regions), [Durable Objects](https://developers.cloudflare.com/durable-objects/reference/data-location/), [D1](https://developers.cloudflare.com/d1/configuration/data-location/) |

**사서 쓸 것과 만들 것** [판단]: 결제, 회계, 알림톡, 본인 인증은 산다. 호출·안심 운영, 보호자 동의, 계약·월 청구 규칙은 만든다. Mews, Apaleo, Cloudbeds 같은 호텔 PMS의 API 우선 구조는 참고하되, 내부 구조를 설명한 공개 글은 찾지 못했다.

## 6. 건물 층은 조건부다

**후속 조사(2026-11-04)**: `01-research/outputs/senior-housing-architecture.md`는 호출 설비 자립을 기본으로, 게이트웨이는 수집·기록용으로, Evenstay는 2차 알림까지로 본다. 근거가 해외 자료 위주라 벤더 문의 뒤 닫는다.

조사에서 가장 새로운 내용이지만 근거는 [벤더 자료](https://mini.carehome.splicecom.com/medic-call-key-features/single-care-home-cloud-deployment)뿐이다. 호출벨 설비가 어떻게 동작하는지에 따라 답이 달라진다.

| 상황 | 건물 층 구성 |
|---|---|
| 호출벨이 건물 안에서 스스로 동작한다 | 게이트웨이 없음. 끊김 감지와 직원 대체 절차만 둔다 |
| 설비는 동작하지만 신호가 끊기면 유실된다 | 작은 게이트웨이로 보관 후 재전송 |
| 호출과 넘김을 Evenstay가 직접 맡는다 | 게이트웨이가 로컬 타이머까지 갖는다. 사업장 수만큼 장비 운영 부담이 는다 |

**현재 설계의 빈칸**: 안심 ADR-S2의 넘김 타이머는 클라우드 DB와 작업자에 있다. F13 신호 끊김은 기기별 기본 2시간[가설]이다. 작업자 중단 경고(ADR-S2)와 수신반 유무 확인(`prd.md` 확인할 것 11)은 있지만, 건물 인터넷 전체가 끊긴 경우를 다룬 내용은 찾지 못했다.

## 7. 레드팀

영향이 크고 싸게 확인할 수 있는 순서다.

**1. 건물 게이트웨이가 필요하다**
- 깨지는 조건: 호출벨 설비가 인터넷 없이 이미 호출을 잇는다면 게이트웨이는 운영 부담만 늘린다.
- 이번 주 근거: 호출벨 업체 한 곳의 동작 방식과 연동 문서.
- 포기 기준: 설비가 스스로 이어 주면 끊김 감지만 남긴다.
- 가장 싼 확인: 업체 문의 한 번.

**2. 인력 기준이 언어를 정한다**
- 깨지는 조건: 공고 통계가 없다. 이 기준을 빼면 A는 1위가 아니다.
- 이번 주 근거: 원티드에서 Spring, Elixir, .NET, Rails 공고 수를 직접 센다. 사용자의 주력 언어도 필요하다.
- 포기 기준: 사용자가 방어할 수 없는 언어는 점수와 무관하게 뺀다.
- 가장 싼 확인: 사용자 답변 한 줄과 공고 검색 30분.

**3. 내구 실행이 코드를 줄인다**
- 깨지는 조건: ADR-S2와 아웃박스는 이미 단순한 SQL로 설계돼 있다. DBOS는 새 의존성과 결정론 제약을 더한다. DBOS Java는 2025-06에 시작했고 현재 1.2.0이다.
- 이번 주 근거: 넘김 타이머 하나를 두 방식으로 쓴 코드 비교.
- 포기 기준: 줄어드는 코드와 테스트가 뚜렷하지 않으면 쓰지 않는다.
- 가장 싼 확인: 작은 비교 코드. MVP를 만들지 않기로 한 결정과 닿으므로 사용자 확인이 먼저다.

**4. 승인 에이전트가 운영 부담을 줄인다**
- 깨지는 조건: 승인 절차가 직원 일을 오히려 늘린다. [공개 사례](https://www.realpage.com/news/realpage-unveils-next-generation-ai-workforce-at-realworld-2025/)는 승인 구조와 실패율을 밝히지 않았고, 수치는 회사 주장이다.
- 포기 기준: 저위험 업무 하나에서 건당 시간이 줄지 않으면 넓히지 않는다.
- 가장 싼 확인: 도입 시 정비 요청 분류 같은 한 업무로 잰다.

**5. 고령 화자 음성을 쓸 만하다**
- 깨지는 조건: 공개 수치는 프리프린트뿐이고, 방 안 소음이나 전화 음질 자료를 찾지 못했다.
- 포기 기준: 자체 측정이 나쁘면 큰 버튼을 주 경로로 유지한다. 지금 설계도 그렇다.
- 가장 싼 확인: 동의받은 소규모 녹음 측정.

**잘 된 부분**: 조사한 후보 안에서 PostgreSQL을 바꿀 이유는 찾지 못했다. 서울 리전이 없는 서비스를 뺀 것은 판단이고, 국외 이전의 법 해석은 [미확인]이다.

**판단하지 못한 것**: 실제 호출 설비, [지원 회사] 계열 보안 기준, 그룹 ERP, 한국 언어별 채용 수치, 법률 해석.

## 8. 이 문서로 바뀌는 것

| 앞선 문서 | 이 문서 |
|---|---|
| 안 2(Spring)를 기본 추천 | Spring 기본을 유지하되 혼자면 Phoenix, 주력이 TS면 안 G. 인력 근거를 확인해야 굳어진다 |
| 건물 장애를 다루지 않음 | 건물 층을 조건부로 추가 |
| 아웃박스와 작업자만 | 범위를 제한한 내구 실행을 후보로 추가 |
| AI는 회원 라우터만 | 직원 업무용 승인 에이전트 층 추가 |
| 웹앱 하나 | 웹으로 시작하고 필요할 때 Expo |
| 음성 언급 없음 | 서버로 옮기면 STT·TTS 파이프라인. 기기 음성 인식과 TTS 나중이라는 지금 설계가 바뀌는 지점이다 |

나머지 공통 결정(RLS 방식, 아웃박스, 원장, 서울 LLM, 접속기록)과 법·제약 정리는 앞선 문서 5·7절이 그대로 유효하다.

## 9. 고르고 나서 할 일

사용자가 고른 뒤에만 한다.

1. 코어 언어를 정하고 `shared/decisions.md`에 남긴다.
2. 호출벨 업체 동작을 확인하고 6절 표에서 건물 층 구성을 고른다.
3. 코어와 안심 세션에 `tech-design.md` 수정을 맡긴다.

## 10. 출처 메모

- **허브가 직접 대조**: Temporal Cloud 서울, Lambda durable functions 서울(2026-04-22), DBOS 구조·언어·Java 버전(1.2.0, 2026-10-01), DBOS Java 지속 sleep과 결정론 제약, Ash 테넌트 오류, Aurora DSQL 제약, arXiv 초록.
- **조사에서 뺀 것**: 클로바 케어콜이 생성 없이 답한다는 조사 내용은 원문을 찾지 못해 뺐다. [현 안내](https://guide.ncloud-docs.com/docs/en/clovacarecall-overview)는 HyperCLOVA X 기반 대화라고 쓴다.
- **허브 대조에서 줄인 것**: arXiv는 초록에서 "Whisper 대비 WER 최대 58.2% 감소"만 확인했다. 조사에 나온 절대 수치는 넣지 않았다. DSQL은 외래 키를 지원한다. RLS·EXCLUDE 미지원은 대조한 페이지에 없어서 표에서 뺐다.
- **버전**(서브에이전트, 2026-11-04 조회): Elixir 1.20.5, Phoenix 1.8.16, LiveView 1.2.13, Ash 3.37.2, .NET 10.0.14 LTS(2028-11-14까지), Marten 9.x, Rails 8.1.4.1, Expo 58, htmx 4.0.1, OpenTofu 1.13.2.
- **못 찾은 것**: 언어별 한국 공고 수, 호텔 PMS의 내부 구조 글, 시니어 리빙 AI 에이전트 운영 수치, 한국 호출 설비 연동 자료, 고령 화자 일상 발화 벤치마크.
- 나머지 출처: [Oban](https://oban.hexdocs.pm/Oban.html), [Ash 멀티테넌시](https://ash.hexdocs.pm/multitenancy.html), [Marten DCB](https://martendb.io/events/dcb.html), [.NET 지원 정책](https://dotnet.microsoft.com/en-us/platform/support/policy/dotnet-core), [Rails 8.1](https://guides.rubyonrails.org/8_1_release_notes.html), [Lambda durable](https://aws.amazon.com/about-aws/whats-new/2026/04/lambda-durable-functions-16-new-regions/), [DBOS 구조](https://docs.dbos.dev/architecture), [Greengrass](https://docs.aws.amazon.com/greengrass/v2/developerguide/how-it-works.html).
