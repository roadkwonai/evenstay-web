# Evenstay 단계별 아키텍처 제안

상태: 초안 · 작성: 2026-11-04 · 범위: 아키텍처와 기술 스택만. 코드와 기획 문서는 고치지 않았다.
방법: `prioritization-frameworks`(Weighted Decision Matrix, MoSCoW), `strategy-red-team`. 리서치는 서브에이전트 3개로 나눠 했고, 허브가 핵심 출처를 직접 열어 대조했다(9절).
앞선 문서: [architecture-options](architecture-options.md), [architecture-landscape](architecture-landscape.md). 프레임워크는 사용자가 지정한 후보에서 골랐고, JobRunr, Valkey, Langfuse, dlt, Dagster 같은 보조 도구는 허브가 더했다. Phoenix, Marten, DBOS처럼 생소한 기술은 뺐다.

## 1. 결론

**가볍게 시작하는 구성: Next.js + Spring Boot + PostgreSQL 하나 + AWS 서울.** [판단]

- 처음에는 컨테이너 3개(화면, API, 작업자)와 DB 하나만 둔다. 큐, 검색, 리포트를 PostgreSQL 안에서 해결한다.
- Python AI 서비스, Kubernetes, AI Gateway, RAG, GraphDB, 데이터 파이프라인은 **넘어가는 신호가 나타날 때** 더한다.
- 1단계 AI는 Python 없이 된다. 비서의 뜻 고르기와 주간 리포트 초안 모두 어댑터 뒤에 있어 Spring에서 Bedrock을 부르면 된다 [판단]. 데모 기본은 지금 설계대로 녹화 응답이다(ADR-G6).
- 클라우드는 AWS 하나로 간다 [판단]. 서울에서 Claude를 리전 안에서 처리할 수 있다. Bedrock Sonnet 5는 제안이고, LLM 제공자는 평가 세트로 비교한 뒤 정한다.

**사용자 확인(2026-11-04)**: MVP는 만들지 않는다. 이 문서는 구현 계획이 아니라 설계안이다. 7절 레드팀 1번은 이 답으로 닫혔다.

## 2. 단계별 구성

| 층 | 1단계 MVP | 2단계 운영 | 3단계 확장 |
|---|---|---|---|
| 화면 | Next.js 16 컨테이너 1개 | 2개 이상 + `cacheHandler`, 같은 암호화 키 | 필요 시 분리 |
| 업무 백엔드 | Spring Boot 4.1 + Modulith, 같은 이미지로 API와 작업자 | 2개씩, 무중단 배포 | 부하 패턴이 다른 모듈만 분리 |
| AI 서비스 | 없음. API가 어댑터로 LLM 호출 | FastAPI + Pydantic v2 + PydanticAI, Taskiq | LangGraph(긴 승인 흐름), LiteLLM |
| 작업 | 코어 아웃박스 유지 [판단], JobRunr(PostgreSQL), Modulith 이벤트 기록. 시스템 작업의 RLS 범위는 미해결 | AI 작업만 Taskiq + Valkey | 외부 전달이 늘면 Namastack 또는 SQS |
| DB | RDS PostgreSQL 18, Single-AZ, 가상 데이터 | Multi-AZ, 실제 데이터 전 필수 | 읽기 복제본, 필요 시 Aurora |
| 검색·RAG | PostgreSQL 전문 검색 또는 없음 | pgvector + 전문 검색 + `pg_bigm` | OpenSearch Nori |
| 데이터 | 월말 스냅샷 | Spring이 권한 검사 뒤 허용 칸만 넘기고 개인정보 제거 | dlt + Dagster |
| 실행 환경 | ECS Express Mode(화면·API), 작업자는 일반 ECS [추정] | ECS 서비스 + OpenTofu, 계정 분리 | EKS Auto Mode |
| 관측 | 구조화 로그, CloudWatch, 평가 JSON | OpenTelemetry | Langfuse 자체 호스팅(ClickHouse 등이 필요) |
| 월 고정비(계산) | 약 $207 | 약 $439 | 인원과 부하에 따라 [미정] |

**비용 계산** (AWS 서울 공식 가격, 730시간). 1단계: 화면 0.5vCPU·1GB $20.7, API·작업자 1vCPU·2GB 각 $41.5, ALB $22.3, RDS t4g.medium Single-AZ $74.5, 50GB $6.6. 2단계: 화면 2개, API·작업자 2개씩, AI 서비스 0.5vCPU·1GB 1개, ALB, RDS Multi-AZ $148.2와 50GB $13.1, Valkey small $27.4. NAT, 로그, 전송, 백업, Bedrock 호출료는 빠져 있다. 작업 크기는 추정이다 [가설]. 2단계 금액은 전부 넣은 값이고, 신호가 없으면 Python과 Valkey를 뺀다.

### 1단계 구조

```
브라우저 ─► Next.js ─► Spring Boot API ─┬─► PostgreSQL 18
                                       │   (모듈별 스키마, RLS, 작업 큐, 이벤트 기록)
업체 웹훅 ────────────────► API         ├─► Bedrock 서울(Sonnet 5, 뜻 고르기만)
                          작업자 ───────┘
                          (타이머, 월 청구, 알림 발송)
```

### 2단계에 더해지는 것

```
Spring Boot ─ HTTP 또는 큐 ─► FastAPI AI 서비스 ─► Bedrock
                                  │
                       Spring이 권한 검사 뒤 넘긴 칸과
                       공개 문서 조각만 받는다. 업무 DB에 접근하지 않는다
```

## 3. 넘어가는 신호

신호가 없으면 넘어가지 않는다. 아래 수치는 판단이고 공식 기준이 아니다.

| 더할 것 | 신호 |
|---|---|
| Multi-AZ, 2개 운영 | 실제 입주자 데이터를 넣기 전 |
| Python AI 서비스 | 문서 파싱·검색처럼 Python 라이브러리가 필요할 때 |
| Valkey | Next.js를 2개 이상 띄우거나 Taskiq를 쓸 때 |
| RAG(pgvector) | 직원용 문서 검색이 필요할 때. 회원에게 문서로 답하려면 ADR-G1부터 다시 정한다 |
| LangGraph | 승인이 하루를 넘기는 AI 흐름이 생길 때 |
| AI Gateway | LLM 공급자가 둘 이상이거나 앱별 예산 키가 필요할 때 |
| 데이터 파이프라인 | 원천 시스템이 3개를 넘을 때 |
| Kubernetes | 개발자가 10명을 넘거나, GPU 스케줄링·오퍼레이터가 필요할 때 |
| GraphDB | 여러 단계를 건너는 관계 질문이 평가 세트의 상당 부분을 차지할 때 |

## 4. 백엔드 후보 평가

점수는 1~5이고 **허브의 판단**이다. 측정값이 아니다. 경계 점수는 언어별로 같게 뒀다. Spring은 Modulith가 코드 의존만 보고 DB 권한은 보지 않아서 4다. 유지보수 안정은 관리자 수와 함께 사용 규모도 봤다. 팀·채용의 한국 시장 근거는 [미확인]이다.

| 기준 | 가중치 | Spring Boot | Fastify | Hono | AdonisJS | FastAPI | Axum | Elysia | Litestar |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| MVP 속도 | 25 | 3 | 4 | 4 | 5 | 4 | 2 | 4 | 3 |
| 확장·경계 | 20 | 4 | 3 | 3 | 3 | 2 | 3 | 3 | 2 |
| 트랜잭션·정확성 | 20 | 4 | 3 | 3 | 3 | 3 | 4 | 3 | 3 |
| 유지보수 안정 | 10 | 5 | 5 | 3 | 3 | 4 | 4 | 1 | 2 |
| 팀·채용 | 15 | 5 | 3 | 3 | 2 | 3 | 1 | 1 | 1 |
| AI 연결 | 10 | 3 | 3 | 3 | 3 | 5 | 2 | 3 | 5 |
| **기본 합계** | 100 | **3.90** | 3.45 | 3.25 | 3.35 | 3.35 | 2.65 | 2.75 | 2.60 |
| 속도 우선(45,15,15,10,5,10) | | 3.60 | 3.65 | 3.45 | **3.85** | 3.60 | 2.60 | 3.15 | 2.85 |
| 채용 제외(30,25,20,10,0,15) | | **3.65** | 3.50 | 3.30 | 3.60 | 3.45 | 2.85 | 3.10 | 2.95 |

**읽는 법**
- 기본은 Spring이고, 2026-11-04에 사용자가 고른 "팀과 채용" 기준과 맞다. 빠른 MVP를 앞세우면 1위가 아니다.
- 속도만 보면 AdonisJS가 앞선다. 인증, ORM, 검증, 메일이 내장이기 때문이다. 다만 공식 큐가 0.7.0이고, `request.raw()`가 문자열이라 웹훅 서명 검증을 먼저 시험해야 한다.
- TypeScript로 간다면 Fastify 5가 가장 안전하다. OpenJS Foundation 소속이고 관리자가 여럿이다. 6.0은 alpha라서 이행을 지켜본다.

| 후보 | 쓰임 |
|---|---|
| Spring Boot | **업무 코어** |
| FastAPI | **2단계 AI 서비스** |
| Fastify | TypeScript로 갈 때의 업무 코어 |
| AdonisJS | 속도가 가장 중요하고 웹훅 시험을 통과할 때 |
| Hono | Next.js와 타입을 직접 공유하는 작은 API. 조립이 많아 코어로는 권하지 않는다 |
| Axum | 코어로 쓰지 않는다. 신호 수신이 병목이 되면 그 부분만 후보 |
| ElysiaJS | 제외. 2.0 rc가 진행 중이고 최근 커밋 대부분이 한 사람이다 |
| Litestar | 보류. 구조는 좋지만 사용 회사를 찾지 못했다 |

## 5. 지정 기술별 판단

| 기술 | 시기 | 판단 |
|---|---|---|
| Next.js | 1단계 | 확정. 인스턴스 하나면 전 기능이 동작한다. 개인화 화면은 캐시를 끈다 |
| AWS | 1단계 | 주 클라우드 |
| Google Cloud | 안 씀 | Cloud Run은 좋지만 서울 AI 처리 보장이 약하다. 두 클라우드 병행은 1~5명에게 이득이 없다 [판단] |
| Kubernetes | 3단계 | 지금은 고정비와 업그레이드 부담만 는다. 이미지를 맞춰 두면 그대로 옮길 수 있다 |
| AI Gateway | 3단계 | 공급자가 하나인 동안 필요 없다. LiteLLM은 2026-03 PyPI 공급망 사고가 있어 쓰면 패키지 버전과 해시, 이미지 digest를 고정한다 |
| RAG | 2단계 | 기획 문서에 이 기능이 없다. 회원 답을 생성하면 ADR-G1과 충돌하므로 직원 검색과 문서 발췌부터 쓴다 |
| GraphDB | 보류 | 권한과 관계는 PostgreSQL 테이블과 RLS로 충분하다 [판단]. Apache AGE의 RDS 지원은 [미확인]이다 |
| 데이터 파이프라인 | 3단계 | 처음에는 허용 칸 뷰로 충분하다 |
| AI 서비스 환경 | 2단계 | 별도 ECS 서비스, GPU 없음 [판단] |
| AI 데이터 적재 | 2단계 | 원본 해시, 임베딩 모델 버전, 청크 버전을 칸으로 둬서 다시 적재할 수 있게 한다 |
| LangGraph | 3단계 | 지금 AI는 에이전트 반복이 거의 없다 |
| PydanticAI | 2단계 | 구조화 출력과 도구 승인에 맞다 |
| Pydantic v2 | 2단계 | FastAPI가 요구한다 |
| FastAPI | 2단계 | Python 서버로 선택 |
| msgspec | 안 씀 | FastAPI가 기본 지원하지 않고, 이 서비스의 병목은 직렬화가 아니다 |
| Litestar | 보류 | 4절 참고 |
| Taskiq | 2단계 | Valkey가 있을 때 쓴다. 스케줄러는 하나만 돌려야 하고 아직 0.x다 |
| ARQ | 안 씀 | README가 유지보수 전용이라고 밝힌다 |

## 6. 나중에 고치지 않으려고 처음부터 지킬 것

단계를 넘을 때 재작성을 막는 규칙이다. 비용이 거의 없다.

1. 서비스별 이미지 하나, 설정은 환경변수, 상태는 DB와 S3에 둔다(코어 11절의 "이미지 하나"는 고쳐야 한다). 헬스체크와 SIGTERM 종료를 지원한다. 이렇게 하면 ECS에서 EKS로 이미지를 그대로 옮긴다.
2. 큐, LLM, 검색, 알림은 인터페이스 뒤에 둔다. 지금 설계의 `IntentRouter`, `Notifier`가 이미 그렇다.
3. 모듈 경계는 첫날부터 CI로 검사한다. 나중에 떼어 낼 수 있는 이유가 이것이다.
4. AI 서비스는 업무 DB에 접근하지 않는다. Spring이 `authorize()` 뒤 허용 칸만 넘긴다(ADR-2, ADR-G4).
5. 금액은 원 단위 정수, 발행 항목은 불변으로 시작한다. 이 둘은 나중에 고치기 가장 어렵다.
6. IaC는 2단계에서 도입하되, 1단계 리소스 이름과 태그를 정리해 둔다.

## 7. 레드팀

**1. 지금 MVP를 만든다**
- 깨지는 조건: 2026-11-04 결정과 충돌한다. 프로토타입과 MVP를 같이 진행하면 범위가 다시 넓어진다.
- 이번 주 근거: 사용자가 MVP 시기를 정한다.
- 포기 기준: 구현 계획 없이는 이 문서를 설계안으로만 쓴다.
- 가장 싼 확인: 사용자 답변 한 줄.

**2. Spring으로도 빠르게 띄운다**
- 깨지는 조건: 속도 우선 평가에서는 AdonisJS, Fastify가 앞선다. 사용자 주력 언어 기록이 없다.
- 이번 주 근거: 로그인, 사업장 범위 조회, 청구 1건을 하루 안에 올려 본다.
- 포기 기준: 첫 세로 조각이 사흘을 넘기면 Fastify로 바꾼다 [판단].
- 가장 싼 확인: 코어 한 흐름 시험.

**3. PostgreSQL 하나로 충분하다**
- 깨지는 조건: 작업 큐, 안심 타이머, 월 청구가 같은 DB를 쓴다. DB가 멈추면 전부 멈춘다.
- 근거: 규모는 작다 [추정]. 다만 안심 넘김은 안전 경로다.
- 포기 기준: 월 청구가 넘김 지연을 일으키면 작업자를 나눈다.
- 가장 싼 확인: 청구 생성 중 넘김 지연 측정.

**4. 1단계에 RAG와 Python이 필요 없다**
- 깨지는 조건: 사용자가 원하는 AI 범위가 지금 설계보다 넓다면 2단계를 앞당겨야 한다. 사용자 후보 목록에 RAG, GraphDB, 데이터 파이프라인이 있지만 기획 문서에는 이 기능이 없다.
- 이번 주 근거: AI로 무엇을 하려는지 기능 목록을 정한다.
- 포기 기준: 첫 데모에 문서 답변이 필요하면 ADR-G1을 먼저 다시 정하고 FastAPI를 1단계로 올린다.
- 가장 싼 확인: 사용자 확인.

**5. 1단계 구성으로 실제 데이터를 받는다**
- 깨지는 조건: Single-AZ, 접속기록 미완성 상태로 실제 입주자 정보를 넣으면 안 된다.
- 포기 기준: 실제 데이터가 들어오는 날짜 전에 2단계 요건을 끝낸다.
- 가장 싼 확인: 1단계는 가상 데이터만 쓴다고 정한다.

**잘 된 부분**: 이미지와 인터페이스로 이식성을 지키면 Kubernetes를 미룰 수 있다는 판단은 AWS, Google 가이드 방향과 맞다. 서울 AI 처리 차이는 양쪽 공식 문서로 확인했다.

**판단하지 못한 것**: 사용자의 언어 숙련도, 실제 AI 기능 범위, [지원 회사] 계열 보안 기준, 호출벨 설비.

## 8. 앞선 문서와의 관계

- Spring 기본, AWS 서울, PostgreSQL, 모듈형 모놀리스는 같다.
- 건물 게이트웨이는 이 단계표 밖의 조건부 항목이고 [architecture-landscape](architecture-landscape.md)가 그대로 유효하다. 직원 승인 에이전트는 3단계 LangGraph 행과 이어진다.
- 사용자가 지정한 후보에 없어서 DBOS를 뺐다. A안(JobRunr)으로 보는 것은 허브 해석이고 사용자 확인이 필요하다.

## 9. 출처

**허브가 직접 대조**
- [Bedrock 서울 리전 내 처리](https://aws.amazon.com/blogs/machine-learning/introducing-anthropic-models-on-amazon-bedrock-for-in-region-inference-in-seoul-and-singapore/): Claude Opus 5, Sonnet 5.
- [App Runner 신규 고객 종료](https://docs.aws.amazon.com/apprunner/latest/dg/apprunner-availability-change.html), [ECS Express Mode](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/express-service-overview.html): 추가 요금 없음, ALB 공유, 웹앱과 API 대상. 작업자처럼 HTTP가 없는 서비스에 쓸 수 있는지는 문서에서 확인하지 못해 일반 ECS 서비스로 둘 수 있다 [추정].
- [ARQ README](https://github.com/python-arq/arq): "In maintenance only mode".
- [Spring Modulith 이벤트](https://docs.spring.io/spring-modulith/reference/events.html): 기본 외부 전달은 단순한 대신 아웃박스 구현의 핵심 기능이 빠져 있고, 2.1이 Namastack과 JobRunr 연동을 넣었다. 1단계는 외부 브로커가 없어 영향이 없다 [판단].
- [Vertex AI 데이터 위치](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/learn/data-residency): 한국 칸은 `gemini-2.5-flash`(128k)만. 다른 페이지의 폐기일과 어긋나 현재 사용 가능 여부는 [미확인]이다.

**2차 자료뿐인 것**: LiteLLM 사고. 공식 권고문을 직접 열지 못했다. [요약 글](https://letsdatascience.com/news/litellm-breach-exposes-ai-supply-chain-risk-69f3c6f7).

**서브에이전트 조사**(2026-11-04 조회): [Fastify](https://github.com/fastify/fastify) 5.12.8, [ElysiaJS](https://github.com/elysiajs/elysia) 1.4.30, [AdonisJS 큐](https://github.com/adonisjs/queue) 0.7.0, [AdonisJS 본문 처리](https://github.com/adonisjs/bodyparser), [Litestar](https://github.com/litestar-org/litestar) 2.25.0, [Taskiq 스케줄](https://taskiq-python.github.io/guide/scheduling-tasks.html), [msgspec 벤치마크](https://msgspec.dev/benchmarks.html), [Next.js 자체 호스팅](https://nextjs.org/docs/app/guides/self-hosting), [Kubernetes 릴리스](https://kubernetes.io/releases/), [AWS 컨테이너 선택 가이드](https://docs.aws.amazon.com/decision-guides/latest/decision-guides/choosing-aws-container-service.html), [Google 런타임 가이드](https://docs.cloud.google.com/architecture/select-managed-container-runtime-environment), [Anthropic 문맥 검색 글(2024)](https://www.anthropic.com/news/contextual-retrieval), [Apache AGE](https://github.com/apache/age), [LightRAG](https://github.com/HKUDS/LightRAG).

**못 찾은 것**: 언어별 한국 공고 수, Spring의 RLS 공식 가이드, Cloud SQL 서울 단가, Python 서비스 분리의 공식 기준, PydanticAI와 LangGraph 병용 운영 사례.
