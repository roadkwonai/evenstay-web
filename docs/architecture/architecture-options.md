# Evenstay 아키텍처·기술 스택 방안

상태: 초안 · 작성: 2026-11-04 · 범위: 아키텍처와 기술 스택만. 코드와 기획 문서는 고치지 않았다.
방법: `prioritization-frameworks`(Weighted Decision Matrix), `strategy-red-team`, `pre-mortem`. 리서치는 서브에이전트 3개로 나눠 했고, 허브가 핵심 출처 4건을 직접 열어 대조했다(5절에 2건 표시, 전체 4건은 출처 메모).
함께 볼 문서: [PreMortem-evenstay-architecture-2026-11-04.md](reviews/pre-mortem.md)
후속: 기존 방향을 전제로 두지 않고 다시 본 문서는 [architecture-landscape-2026-11-04.md](architecture-landscape.md)다.

## 1. 결론

- **추천: 안 2. Spring Modulith 모듈형 모놀리스 + Next.js 화면 + PostgreSQL + AWS 서울.** [판단]
- 단, 사용자의 주력 언어가 TypeScript라면 바꾼다. 혼자 구현까지 생각하면 **안 1**, 팀을 전제로 하면 **안 3**이다. 면접에서 깊게 방어할 수 있는 언어가 평가표 점수보다 중요하다. 사용자 주력 언어 기록은 저장소에 없다 [미정].
- 그대로 지키는 것: 모듈형 모놀리스(ADR-3), PostgreSQL과 RLS(ADR-1), 아웃박스(ADR-2), 원장 불변(ADR-4). 조사 결과 이 네 가지를 뒤집을 근거는 없었다.
- 바뀌는 것: 안 2를 고르면 "Next.js는 `app/`·`ui/`에만"이라는 기존 규칙이 더 강해져서, 백엔드가 Next.js 밖으로 나간다. 2026-11-03 결정의 "MVP는 Next.js"를 "화면은 Next.js"로 고쳐야 한다.

## 2. 판단의 전제

| 전제 | 내용 | 근거 |
|---|---|---|
| 평가 대상 | 혼자 만드는 데모가 아니라 **실제 [지원 회사] PMS 0→1 설계안**. 2026-11-04에 MVP를 만들지 않기로 해서 "혼자 2~4주 생산성"의 비중이 줄었다 | `shared/decisions.md` 2026-11-04 |
| 팀 규모 | 직원 4명. 초기 개발자는 1~5명으로 본다 | [사실, S1] [추정: 개발자 수] |
| 부하 | 목동 약 400실(S4·S7), 다수 사업장(S2·S3). 트래픽은 작고 정확성이 중요하다 | [사실] [추정: 트래픽] |
| 공고 | 기술 스택 항목이 비어 있다. 언어로 가점을 받는다는 근거가 없다 | [사실, S2] |
| 한국 시장 | "Spring이 많다"는 의견은 많지만 비율 통계는 찾지 못했다 | [미확인] |

## 3. 방안 여섯 가지

| 안 | 구조 | 스택 | 잘 맞는 경우 | 약점 |
|---|---|---|---|---|
| **1** Next.js 풀스택 | 앱 프로세스 + 작업자 프로세스, 한 저장소 | Next.js 16, TypeScript, Node 24 또는 26 LTS, Drizzle 또는 Kysely, pg-boss | 주력이 TS, 혼자 끝까지 구현 | 경계·RLS·작업자를 직접 조립한다. Next.js는 문서에서 스스로 "완전한 백엔드 대체가 아니다"라고 쓴다 |
| **2** Spring Modulith + Next.js 화면 (추천) | API·작업자(같은 이미지) + 화면 서버 | Java 25 LTS, Spring Boot 4.1, Spring Modulith 2.1, jOOQ 또는 Spring Data JDBC, Flyway, JobRunr, Next.js 16 | 실제 0→1, Senior Backend 면접 | 언어가 둘이다. RLS 세션 변수 공식 가이드가 없어 직접 구현한다. Modulith는 코드 의존만 보고 DB 권한 경계는 보지 않는다 |
| **3** NestJS + Next.js | 안 2와 같고 언어만 TS | NestJS 12, TypeScript, Drizzle 또는 Kysely, pg-boss | TS를 유지하면서 백엔드를 분리 | 경계 검증은 안 1처럼 외부 도구로 맞춘다 [추정]. Modulith 같은 이벤트 레지스트리가 없다 |
| **4** 안 2 + 위성 서비스 2개 | 코어 모놀리스 + 신호 수신 게이트웨이 + AI 비서 서비스 | 안 2 + 가벼운 수신 서비스, AI는 Spring AI 또는 TS | 벤더 연동이 늘고 신호 수신을 코어 배포와 떼야 할 때 | 시작 때는 이르다. 안 2에서 옮겨 갈 **목적지**로 둔다 |
| **5** 마이크로서비스 + Kafka | 모듈마다 서비스, 이벤트 브로커 | Spring Boot 또는 NestJS, Kafka, Debezium, Kubernetes | 여러 팀이 독립 배포할 때 | 1~5명에 맞지 않는다. 비교 기준선으로만 둔다 |
| **6** Supabase 중심 | 관리형 PostgreSQL + 인증 + 함수 | Supabase(서울 리전 있음), Next.js | 가장 빠른 데모 | 업무 규칙이 DB 함수로 몰린다. 상주 작업자와 모듈 경계가 약하다 |

### 추천 구조 (안 2)

```
회원·보호자·직원 브라우저              업체(결제, 센서, 호출벨)
        │                                     │ 서명된 웹훅
        ▼                                     ▼
Next.js 화면 서버  ── REST ──►  Spring Boot API (같은 이미지, 시작 명령만 다름)
(DB 접속 권한 없음)             core · safety · family · assistant
                                transitions · requests · community
                                  │  Spring Modulith가 경계를 검증
                                  │
                       작업자: 아웃박스, 넘김 타이머, 일일 배치
                                  │
                                  ▼
             PostgreSQL 18 (모듈별 스키마, RLS, 트리거, 배제 제약)
                                  │
      Bedrock 서울(라우터) · 알림톡·문자 · 결제 · CMS · ERP  ← 전부 어댑터 뒤
```

화면 서버가 DB에 닿지 않는 것이 안 1과의 가장 큰 구조 차이다. 건강 신호와 원장을 다루는 코드가 공개된 웹 계층과 프로세스로 나뉜다.

## 4. 가중 평가

코어 `tech-design.md` 12절의 1·2·5·6번에 상주 작업과 규제를 더하고, 3번(혼자 생산성)은 운영 부담으로 바꾸고, 4번(테스트 속도)은 뺐다 [판단]. 점수는 1~5이고 **허브의 판단**이다. 측정값이 아니다.

경계 점수는 안 2·4를 5가 아니라 4로 뒀다. Modulith는 ADR-2 7번의 두 겹 중 코드 의존만 보고, DB 스키마 권한은 어느 안이든 직접 만들어야 한다.

| 기준 | 가중치 | 안 1 | 안 2 | 안 3 | 안 4 | 안 5 | 안 6 |
|---|---:|---:|---:|---:|---:|---:|---:|
| 모듈 경계 강제(ADR-2) | 20 | 3 | 4 | 3 | 4 | 4 | 2 |
| 금액·트랜잭션 정확성 | 15 | 3 | 4 | 3 | 4 | 2 | 3 |
| 상주 작업·외부 연동 | 15 | 3 | 5 | 4 | 5 | 4 | 2 |
| 소규모 팀 운영 부담 | 20 | 5 | 4 | 4 | 3 | 1 | 5 |
| 규제·보안 분리 | 10 | 3 | 4 | 4 | 5 | 4 | 3 |
| AI 연동 | 5 | 5 | 4 | 4 | 5 | 4 | 3 |
| 공고 연결·채용 | 15 | 3 | 5 | 3 | 4 | 2 | 1 |
| **합계(실제 0→1)** | 100 | 3.50 | **4.30** | 3.50 | 4.10 | 2.80 | 2.75 |

**가중치를 바꿔 본 결과**

| 시나리오 | 1위 | 2위 | 3위 | 읽는 법 |
|---|---|---|---|---|
| 실제 0→1 | 안 2 (4.30) | 안 4 (4.10) | 안 1·3 (3.50) | 기본 |
| 혼자 끝까지 구현(운영 부담 35, 언어 둘이면 감점) | **안 1 (3.90)** | 안 2 (3.80) | 안 3 (3.60) | **0.1점 차로 안 1이 앞선다** |
| 채용 기준 제외(근거가 [미확인]이라서) | 안 2·4 (4.15) | — | 안 3 (3.55) | 안 2와 안 4는 동점이고, 운영 부담이 적은 안 2로 시작한다 |

실제 0→1을 기준으로 삼으면 안 2가 앞서지만, 혼자 구현이면 순위가 바뀐다. 차이가 작고 점수도 판단이므로 주력 언어가 이 평가표보다 앞선다. TypeScript로 간다면 안 1과 안 3은 기본 점수가 같아서, 혼자면 안 1, 팀이면 백엔드가 분리된 안 3이다.

## 5. 어느 방안이든 같은 결정

| 영역 | 제안 | 근거 |
|---|---|---|
| DB | PostgreSQL 18(안정 18.6, 지원 종료 2030-11-14). 19는 아직 RC | [사실] [PG 버전 정책](https://www.postgresql.org/support/versioning/) |
| RLS | 앱 역할은 테이블 소유자가 아니고 BYPASSRLS가 없다. `FORCE ROW LEVEL SECURITY`. 범위는 트랜잭션 안 `set_config(..., true)`로 넣는다 [판단] | [사실] [PG 문서](https://www.postgresql.org/docs/current/ddl-rowsecurity.html), [AWS 글(2020)](https://aws.amazon.com/blogs/database/multi-tenant-data-isolation-with-postgresql-row-level-security/) |
| RLS 정책 | 정책 안 서브쿼리는 느려지고 경쟁 조건이 생길 수 있다고 PG 문서가 경고한다. `SiteOwnership` 조회는 앱이 먼저 풀어 site_id 목록과 회원·대리인 ID를 세션 변수로 넘긴다(비서 RLS가 두 겹이다) [판단] | 같은 문서 |
| 테넌시 | 지금은 pool + RLS. 계약이나 규제로 요구하는 소유주만 DB 분리(bridge)로 옮긴다 | [사실] [AWS PostgreSQL SaaS 가이드](https://docs.aws.amazon.com/prescriptive-guidance/latest/saas-multitenant-managed-postgresql/matrix.html) |
| 이벤트 | 아웃박스 + `SKIP LOCKED` 폴링. Kafka, Debezium은 쓰지 않는다. NOTIFY는 깨우는 용도까지만 | [사실] [아웃박스](https://microservices.io/patterns/data/transactional-outbox.html), [NOTIFY 장애 사례(2025)](https://www.recall.ai/blog/postgres-listen-notify-does-not-scale) |
| 원장 | 추가만 하는 테이블과 보정 항목. 이벤트 소싱은 쓰지 않는다 | [사실] [Square Books](https://developer.squareup.com/blog/books-an-immutable-double-entry-accounting-database-service/), [Azure 가이드](https://learn.microsoft.com/en-us/azure/architecture/patterns/event-sourcing) |
| 화면 | 웹앱 하나, 역할별 라우트. 개인화 화면은 Next.js 캐시를 끈다 | [사실, 허브 대조] [2026-11-03 Next.js 보안 릴리스](https://nextjs.org/blog/november-2026-security-release): Cache Components의 테넌트 간 노출(High) |
| 실시간 | 직원 화면은 5초 폴링으로 시작하고 SSE로 올린다. WebSocket은 쓰지 않는다 | 안심 확인할 것 11번, [MDN SSE](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events) |
| 회원 알림 | 앱 푸시에 기대지 않는다. 알림톡, 문자, 직원 경로를 기본으로 둔다. iOS 웹 푸시는 홈 화면에 추가해야 동작한다 | [사실] [WebKit](https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/) |
| LLM | Bedrock 서울의 Claude Sonnet 5로 시작한다. **서울 리전 내 처리는 Opus 5와 Sonnet 5만** 되고 5.5 계열은 글로벌 추론이다. 글로벌 프로파일은 IAM·SCP로 막는다. ADR-G1에서 LLM은 라우터뿐이라 이 모델로 충분하다 [판단] | [사실, 허브 대조] [AWS 2026-09-29](https://aws.amazon.com/blogs/machine-learning/introducing-anthropic-models-on-amazon-bedrock-for-in-region-inference-in-seoul-and-singapore/) |
| AI 도구 | 지금은 내부 도구 등록부(ADR-G2)로 충분하다. MCP는 외부 에이전트를 붙일 때 OAuth 2.1 리소스 서버로 연다 | [사실] [MCP 사양 2026-07-28](https://modelcontextprotocol.io/specification/latest/basic/authorization) |
| 접속기록 | 민감정보 시스템으로 보고 2년 이상 보관하며 위·변조를 막는다 [판단]. 해당 여부는 법률 검토가 필요하다. 서브에이전트 조사값이고 허브는 대조하지 않았다 | [안전성 확보조치 기준 8조](https://www.law.go.kr/LSW/admRulInfoP.do?admRulSeq=2100000281400) |

**버전 확인**: Spring Boot 4.1.2(2026-10-22), Spring Modulith 2.1.2(2026-10-23), Java 25 LTS, Next.js 16.4.5(2026-11-03), NestJS 12, Node 24·26 LTS. 모두 공식 릴리스 페이지 기준이고 2026-11-04에 열람했다. Spring Boot 4.1 지원 종료 2027-07-31은 2차 자료뿐이다 [미확인].

**Java와 Kotlin**: Java 25를 기본으로 제안한다. Kotlin도 공식 지원이지만 채용 폭을 넓게 잡을 이유가 더 크다 [판단]. 사용자가 Kotlin에 익숙하면 바꿔도 구조는 같다.

**jOOQ 또는 Spring Data JDBC**: JPA보다 SQL이 그대로 드러나는 쪽을 제안한다. 이 설계는 RLS, 트리거, 배제 제약처럼 DB 기능을 많이 쓴다 [판단].

## 6. 배포처

| 안 | 구성 | 맞는 점 | 막히는 점 |
|---|---|---|---|
| **AWS 서울 (추천)** | ECS Fargate + RDS PostgreSQL Multi-AZ + KMS + Bedrock | 상주 작업자, 서울 리전 LLM, IoT Core까지 한 곳 | 직접 설정할 것이 많다 |
| Vercel + 외부 DB | 화면만 Vercel `icn1` | 화면 배포가 쉽다 | 함수 최대 800초(Pro 기준), 상주 프로세스는 별도. 작업자와 DB가 다른 곳에 놓인다 |
| Supabase 서울 | DB·인증·저장소 | 시작이 빠르다 | 작업자는 어차피 따로 둔다. 가격 [미확인] |
| NCP·NHN Cloud | 국내 CSP 관리형 PostgreSQL | 국내 사업자라 설명이 쉽다 | 버전과 가격 [미확인]. 서울 리전 내 Claude 같은 선택지를 다시 찾아야 한다 |
| Neon | — | — | 서울 리전 없음. 제외 |

**AWS 서울 비용 계산**: 실운영 최소 구성은 월 약 $370이다. API·작업자 1vCPU·2GB 4개($166), 화면 0.5vCPU·1GB 2개($41), RDS t4g.medium Multi-AZ와 50GB($161)를 더했다. AWS 공식 가격 목록(2026-10)으로 730시간 기준 계산했고, ALB·NAT·전송·로그·백업·Bedrock 호출료는 빠져 있다 [미확인]. 작업 크기는 추정이다 [가설].

## 7. 법·제약이 구조에 주는 것

법률 자문이 아니라 설계 제약 정리다. 일부 조문은 2차 자료로만 확인했고, 실서비스 전에 원문 대조와 법무 검토가 필요하다.

| 제약 | 구조에 주는 영향 | 확인 수준 |
|---|---|---|
| 건강 정보는 민감정보(법 23조). 생활 신호가 건강정보인지는 해석 문제 | 센서 신호 동의를 계약 동의와 분리한다 | [법 23조](https://www.law.go.kr/lsLawLinkInfo.do?chrClsCd=010202&lsJoLnkSeq=1000575255) 검색 요약 기준 [추정: 해석] |
| 국외 이전(28조의8)은 조회도 포함 | 서울 리전이어도 처리방침과 위탁 근거는 쓴다 | [PIPC 안내](https://pipc.go.kr/np/default/page.do?mCode=D060040000) [추정: 리전과의 관계] |
| 유출 "가능성" 단계부터 72시간 통지(2026-09-11 시행) | 이상 탐지와 통지 절차가 필요하다 | [법률신문](https://www.lawtimes.co.kr/news/articleViewAmp.html?idxno=226414) 2차 자료 |
| AI 기본법 고지(2026-01-22 시행) | 비서 화면 고지. ADR-G5 고지 게이트와 이어진다 | [korea.kr](https://www.korea.kr/news/policyNewsView.do?newsId=148958380) 이용사업자 범위는 [미확인] |
| ISMS-P 의무화(2027-07-01). 시행령 범위 미확정 | 규모로는 대상이 아닐 수 있다 [추정]. 통제항목을 설계 기준으로 삼는다 | 보도 기준 |
| 금융권 클라우드 규정은 금융회사·전자금융업자 대상 | 비금융 법인이면 직접 대상이 아니다 [추정]. **[지원 회사] 계열 내부 기준은 [미확인]** | [금융보안원 가이드](https://www.fsec.or.kr/bbs/detail?menuNo=222&bbsNo=11691) |

## 8. 레드팀: 안 2를 공격한다

강한 순서다. 영향이 크고, 틀렸을 가능성이 있고, 싸게 확인할 수 있는 것을 앞에 뒀다.

**1. 사용자가 Java·Spring을 깊게 방어할 수 있다**
- 깨지는 조건: 트랜잭션 전파, 이벤트 리스너 실패 처리 같은 후속 질문에 답하지 못한다. 공고에 스택이 없으므로 안 2의 공고 가점은 추정뿐이다.
- 이번 주 근거: 사용자의 주력 언어와 운영 경험.
- 포기 기준: 최근 3년 운영 경험이 TS 쪽이면 안 1이나 안 3으로 바꾼다.
- 가장 싼 확인: 사용자 답변 한 줄.

**2. 코드 없는 설계를 면접관이 믿는다**
- 깨지는 조건: Modulith·RLS·아웃박스 주장이 문서뿐이라 "해 봤나"에서 멈춘다. MVP를 만들지 않기로 한 결정과 부딪히는 지점이다.
- 이번 주 근거: 어떤 주장이 코드 없이 설명되는지 추리기.
- 포기 기준: 핵심 세 주장 중 하나라도 동작을 못 보이면 그 주장은 "검증 안 함"이라고 밝힌다.
- 가장 싼 확인: 코어 한 모듈 크기의 검증 조각. `verify()`, RLS 격리 테스트, 아웃박스 재시도를 테스트로 보인다.

**3. 비동기 경로에서도 RLS 범위가 유지된다**
- 깨지는 조건: 트랜잭션 안 `set_config`는 요청 경로에서만 저절로 풀린다. 이벤트 리스너, 작업자, 일일 배치는 다른 스레드와 트랜잭션에서 돈다. 범위를 놓치면 0건이 조용히 나오고, 고치려고 BYPASSRLS 역할을 쓰면 이중 방어가 사라진다.
- 현재 설계의 빈칸: 코어 `tech-design.md`에 RLS 세션 변수를 어떻게 넣는지가 없고, 일일 배치 같은 시스템 작업의 RLS 범위 규칙도 없다. `SYSTEM:<모듈키>`는 코어 호출용 주체라서 이 빈칸을 메우지 않는다.
- 포기 기준: 시스템 주체용 범위 설정을 한 곳으로 모으지 못하면 RLS를 쓰기 경로 방어로 줄인다.
- 가장 싼 확인: 리스너 안에서 범위 없이 조회하면 실패하는 테스트.

**4. 한 프로세스에서 모듈별 DB 역할이 된다** (안 1, 3에도 해당)
- 깨지는 조건: ADR-2 7번은 "DB 스키마 권한"으로 경계를 확인한다. 그런데 모듈 전이와 코어 `AuditWriter`를 한 트랜잭션에 쓰면(`docs/requests/tech-design.md` 3절) 역할이 섞인다. Modulith는 코드 의존만 보고 DB 권한은 보지 않는다.
- 포기 기준: `SET LOCAL ROLE`이 복잡해지면 운영 역할은 하나로 두고, CI 안에서만 모듈별 역할로 쿼리를 검사한다.
- 가장 싼 확인: 두 모듈 동기 호출 테스트 하나.

**5. 결제 어댑터가 실제 납부 방식을 담는다**
- 깨지는 조건: 월 생활비가 수백만 원이면 카드보다 CMS 자동이체가 주 경로일 수 있다 [추정]. CMS는 파일 송수신과 심사를 거치는데, `PaymentGateway.requestPayment`는 건별 PG 모양이다. 수동 수납 기록(F16)이 있어 서비스가 멈추지는 않지만 수기 입력 부담이 커진다 [추정]. 토스 빌링도 정기 구독형이 아니면 제한되고 추가 계약이 필요하다 [사실].
- 포기 기준: 일괄 출금을 어댑터에 넣지 못하면 수납 흐름을 수기 입력 위주로 다시 잡는다.
- 가장 싼 확인: 시니어 하우징의 실제 납부 방식 조사, 어댑터에 일괄 출금 의뢰·결과 수신 추가.

**잘 된 부분**: 모듈형 모놀리스로 시작하는 판단은 Fowler와 Newman의 논거, Segment의 되돌림 사례와 맞다. 브로커 없는 아웃박스, 이벤트 소싱을 쓰지 않는 원장, 어댑터로 벤더를 가리는 구조도 공격할 근거를 찾지 못했다. 서울 리전 내 Claude 처리는 AWS 원문에서 확인했다.

**판단하지 못한 것**: [지원 회사] 계열 보안 기준, [지원 회사]가 이미 쓰는 ERP와 그룹 시스템, 실제 벤더 API, 면접관의 기술 배경. 이 중 어느 것이든 스택을 바꿀 수 있다.

## 9. 언제 떼어 내나 (안 2 → 안 4)

수치 기준은 공식 자료에서 찾지 못했다 [미확인]. 아래는 판단이다.

| 순서 | 대상 | 떼는 신호 |
|---|---|---|
| 1 | 신호 수신(`safety` 웹훅) | 코어 배포 때문에 신호가 끊기면 안 되는 시점, 벤더가 여럿으로 늘 때 |
| 2 | AI 비서 | LLM 호출 부하나 모델 교체 주기가 코어와 달라질 때 |
| 3 | 알림 발송 | 발송량과 재시도가 코어 작업자를 밀어낼 때 |
| 마지막 | 코어 원장 | 떼지 않는다. 일관성이 가장 중요하다 |

Kafka는 독립 소비자가 많아지거나 이벤트 재생이 필요할 때 다시 본다.

## 10. 고르고 나서 할 일

사용자가 방안을 고른 뒤에만 한다.

1. `shared/decisions.md`에 결정을 남긴다.
2. 코어 세션에 `tech-design.md` 12절과 ADR-3 수정을 맡긴다. 안 2라면 Next.js가 적힌 문서 25개(evenstay 13개, senior-lab 기획 12개)가 대상이고, 내용이 실제로 바뀌는 곳은 코어 ADR-3·11·12절, 안심 11절·12절 1·2번이다. 이미지가 하나에서 둘로 늘기 때문이다.
3. 빈칸을 설계에 넣는다: RLS 세션 설정, 모듈별 DB 역할, 일괄 출금 어댑터, 접속기록 보관.
4. 필요하면 레드팀 2번의 검증 조각을 만든다. MVP를 만들지 않기로 한 결정과 닿으므로 사용자 확인이 먼저다.

## 출처 메모

- 허브가 직접 대조: Bedrock 서울 리전, Spring Modulith `verify()`, Next.js 2026-11 보안 릴리스, Next.js BFF 문서.
- 나머지는 서브에이전트 조사 결과이고 표에 출처를 붙였다. 일부 요약은 소형 모델이 만든 페이지 요약이라 수치 인용 전에 원문 대조가 필요하다.
- 찾지 못한 것: Spring Boot 지원 종료 공식 표, Prime Video 원문, 한국 프레임워크 사용 비율, 국내 출입·호출벨 벤더 공개 API, PASS 요건, 효성 CMS 연동, 안전성 확보조치 기준 제2026-9호 개정 요지.
- 그 밖의 출처: [Next.js BFF](https://nextjs.org/docs/app/guides/backend-for-frontend), [Spring Modulith 검증](https://docs.spring.io/spring-modulith/reference/verification.html), [Spring Modulith 이벤트](https://docs.spring.io/spring-modulith/reference/events.html), [MonolithFirst](https://martinfowler.com/bliki/MonolithFirst.html), [Segment](https://www.twilio.com/en-us/blog/developers/best-practices/goodbye-microservices), [Shopify](https://shopify.engineering/shopify-monolith), [토스 빌링](https://docs.tosspayments.com/guides/v2/billing), [CMS 절차](https://www.cmsedi.or.kr/cms/apply/manual/new/decision), [Vercel 한계](https://vercel.com/docs/functions/limitations), [Neon 리전](https://neon.com/docs/introduction/regions).
