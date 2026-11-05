# GPT 아키텍처 조사 보고서 핵심 주장 대조 (공식 문서 원문 기준)

조사: 2026-11-05
대상: `01-research/architecture/gpt_Architecture_Research_2026-11-04.md` (수정 안 함)
범위: 새 조사가 아니라 대조만 했다. 항목 1~16의 주장을 공식 페이지와 맞춰 봤다.

## 읽는 법
- 판정: 일치 / 일부 다름 / 틀림 / 확인 못 함.
- 근거 수준
  - **직접(원문)**: 페이지 HTML을 내려받아 본문·표 셀을 직접 파싱해 확인했다.
  - **직접(발췌)**: WebFetch로 페이지를 열었고 도구가 본문에서 뽑아 준 인용으로 확인했다. 원문 전체를 내가 읽지는 않았다.
  - **검색요약**: 검색 결과 요약만 봤다. 이 값은 단독 근거로 쓰지 않았다.
- 인용은 항목당 1개, 15단어 이내다. 가격은 페이지에 적힌 값이다. 별도 기준일이 없으면 "기준일 표기 없음, 조회일 2026-11-05"로 적었다.
- 부재 주장("~가 없다")은 "열어 본 페이지에서 못 찾음"으로만 적었다.
- 11번과 16번 주장은 대상 문서에서 해당 문구를 찾지 못했다(grep). 사용자가 "앞선 문서"의 판단으로 전달한 것으로 보고 같은 방식으로 대조했다.

## 대조표

| 번호 | 주장 | 판정 | 근거 수준 | 원문 근거·URL | 설계에 주는 영향 한 줄 |
|---|---|---|---|---|---|
| 1 | S01 NestJS 문서가 v12.3의 NodeAdapter 권고와 다음 메이저 기본값 계획을 설명한다 | 일치 | 직접(발췌) + npm 레지스트리 직접 | "Starting with NestJS v12.3, we recommend the `NodeAdapter`." 같은 페이지에 NestJS v13에서 NodeAdapter가 기본값이 된다는 문장이 있다. 최신 메이저는 12다. npm `latest`는 12.3.3(2026-11-05 조회), endoflife.date는 12.0 출시 2026-08-27·12.3.2를 표기한다. 이 페이지는 JS 렌더링이라 curl로는 본문이 안 나와 WebFetch 발췌에 의존했다. https://docs.nestjs.com/http/performance , https://registry.npmjs.org/@nestjs/core , https://endoflife.date/nestjs | 일치. 다만 같은 페이지에 Express를 유지하려면 `ExpressAdapter`를 명시하고, Express 전용 API를 쓰면 Express에 머물라는 문구가 있어 어댑터 선택은 의존 API 기준으로 한다. |
| 2 | S73 Cloud Tasks HTTP task dispatch deadline 최대 30분 | 일치 | 직접(원문) | "For HTTP tasks, the default is 10 minutes. The deadline must be in the interval [15 seconds, 30 minutes]." https://docs.cloud.google.com/tasks/docs/reference/rest/v2/projects.locations.queues.tasks | 최대 30분(기본 10분)이므로 그 이상 걸리는 문서·Agent 작업은 단계 분할이나 Jobs/Worker Pools로 나눈다. |
| 3 | S42 Cloud Run Worker Pools의 CREMA 기반 자동 확장 안내 | 일치 (출시 단계는 확인 못 함) | 직접(원문) | "Worker pools don't automatically scale." 뒤에 CREMA로 자동 확장하라는 안내가 이어진다(Cloud Run 개요 페이지). CREMA 전용 페이지는 갱신일 2026-10-30. 두 페이지에서 Preview/GA 표기를 못 찾음. https://docs.cloud.google.com/run/docs/configuring/workerpools/crema-autoscaling , https://docs.cloud.google.com/run/docs/overview/what-is-cloud-run | 자동 확장은 기본값이 아니라 CREMA를 따로 배포해야 한다. 채택 전에 출시 단계(GA 여부)를 별도로 확인한다. |
| 4a | S63 Vercel 서울 리전 icn1 | 일치 | 직접(발췌, 표 전체 확인) | 리전 표 행: "icn1 / ap-northeast-2 / Seoul, South Korea". 같은 페이지에서 함수 기본 리전은 iad1이다. https://vercel.com/docs/regions (페이지 갱신 2026-08-11) | 함수 리전을 icn1로 명시하지 않으면 기본 iad1에서 돈다. DB와 같은 리전으로 직접 지정한다. |
| 4b | S57 Supabase 서울 ap-northeast-2 선택 가능 | 일치 | 직접(원문) | Specific regions 목록에 "Northeast Asia (Seoul) ap-northeast-2"가 있다. 같은 페이지에 정확한 AWS 리전을 고를 수 있다는 안내가 있다(발췌). https://supabase.com/docs/guides/platform/regions | 서울 고정이 가능하다. 일반 리전(APAC) 선택과 구분해 정확한 리전을 고른다. |
| 5 | S66 Neon 리전 목록에 서울·도쿄가 없고 싱가포르가 있다 | 일치 | 직접(원문) | AWS 리전 8개(미국 3, 유럽 2, 싱가포르, 시드니, 상파울루). "AWS Asia Pacific (Singapore) — `aws-ap-southeast-1`"가 있고 ap-northeast-1·2는 페이지에서 못 찾음. Azure 3개는 deprecated. https://neon.com/docs/introduction/regions | 한국 리전 필수이거나 ERP와 짧은 왕복 지연이 필요하면 Neon은 싱가포르가 최선이다. |
| 6 | S16 Vercel AI Gateway 예산이 요청 시작 시 검사해서 진행 중 요청이 한도를 넘을 수 있다 | 일치 | 직접(발췌, 페이지 본문 전체 수신) | "A budget is a soft cap, not a hard limit." 뒤에 요청 시작 시 검사하므로 한도를 넘기는 그 요청도 끝까지 완료된다고 적혀 있다. 갱신 2026-09-10. 새 예산은 반영까지 1~2분, 변경은 최대 약 5분 걸린다는 주의도 있다. https://vercel.com/docs/ai-gateway/observability-and-spend/budgets | 예산은 소프트 캡이다. 엄격한 비용 상한이 필요하면 앱 쪽 차감·한도를 따로 둔다. BYOK 지출은 예산에 집계되지 않는다. |
| 7a | S53 Supabase Pro 월 $25, Team 월 $599 | 일치 ("조직당"은 확인 못 함) | 직접(발췌) | "Pro - from $25/month" 및 Team은 from $599/month로 표기. 업타임 SLA는 Free·Pro·Team "Not included", Enterprise만 "Included". Team은 "Priority email support & SLAs". 기준일 표기 없음. https://supabase.com/pricing | 둘 다 "부터" 가격이다. Team을 사도 업타임 SLA는 없으므로 가용성 계약은 Enterprise 문의 항목이다. 대조한 페이지에서 "조직당" 문구는 못 찾음. |
| 7b | S55 PITR 7일 약 $100 | 일치 | 직접(원문) | 표: 7일 시간당 $0.137·월 약 $100, 14일 $0.274·약 $200, 28일 $0.55·약 $400. 기준일 표기 없음. 활성 시간 기준 시간 과금, 부분 시간도 1시간으로 과금(발췌). https://supabase.com/docs/guides/platform/manage-your-usage/point-in-time-recovery | 월 $100은 상시 활성 기준 근사치다. 운영 DB 비용 산정에 PITR을 따로 더한다. |
| 7c | S58 읽기 복제본이 자동 장애 전환을 뜻하지 않는다 | 일치 (부재 근거) | 직접(원문 grep + 발췌) | 페이지에서 failover·promote·high availability 단어를 못 찾음. "Read Replicas only serve reads and won't help writes." https://supabase.com/docs/guides/platform/read-replicas | 읽기 복제본은 읽기 확장용으로만 보고, 장애 시 쓰기 가용성은 다른 수단(HA·복구)으로 설계한다. 부재 근거이므로 계약 전 문의로 확정한다. |
| 8a | S44 GKE 클러스터 관리비 $0.10/시간 | 일치 | 직접(원문) | "A flat cluster management fee of $0.10 per cluster per hour ... applies to all GKE clusters". https://cloud.google.com/kubernetes-engine/pricing | 컴퓨트 별도로 월 약 $73이 고정으로 든다. 같은 문장 근처에 무료 크레딧 조건이 있으나 이번에는 대조하지 않았다. |
| 8b | S45 EKS 표준 $0.10/시간, 연장 지원 $0.60/시간 | 일치 | 직접(원문) | "Extended Kubernetes version support $0.60 per cluster per hour"(표준분 포함, 추가 $0.50) https://aws.amazon.com/eks/pricing/ | $0.60은 표준분 $0.10을 포함한 값이다(추가분 $0.50). 버전 업그레이드를 미루면 월 약 $438로 뛴다. |
| 9 | S49 "Gemini Enterprise Agent Platform"이 실제 공식 제품명이다 (Vertex AI Agent Engine과의 관계) | 일치 | 직접(원문) | 공식 릴리스 노트의 명칭 대응표에 "Vertex AI Agent Engine → Agent Runtime", "Vertex AI Agent Engine Memory Bank → Agent Platform Memory Bank"가 있다. S49 페이지 제목은 "Scale your agents \| Gemini Enterprise Agent Platform". 릴리스 노트는 조회 시점 2026-11-05. https://docs.cloud.google.com/gemini-enterprise-agent-platform/release-notes , https://docs.cloud.google.com/gemini-enterprise-agent-platform/scale | 공식 이름이며 Agent Engine은 Agent Runtime으로 개명됐다. 옛 Vertex AI Agent Engine 자료의 이름·기능·가격을 그대로 쓰지 말고 현재 문서를 기준으로 한다. |
| 10a | S50 Bedrock의 in-region·지역(Geo) 범위·global 추론 구분 | 일치 | 직접(원문) | "Your requests never leave the AWS Region you specify."(in-region) Geo는 지리 단위(US, EU, 아시아태평양 등) 안, Global은 "any supported commercial Region worldwide". 모델 ID 접두사가 `us.`/`apac.`/`global.`처럼 갈린다. https://docs.aws.amazon.com/bedrock/latest/userguide/models-region-compatibility.html | 세 경로는 다른 보장이다. 모델 ID 접두사(global.)를 코드·IAM 정책에서 확인하고 막는 장치를 둔다. |
| 10b | 서울(ap-northeast-2)에서 Claude 최신 모델을 리전 안에서 처리할 수 있는가 | 최신은 불가, 한 세대 앞은 가능 (일부 다름) | 직접(원문, 서울 행 셀의 supported/not-supported 아이콘을 파싱) | 서울 행 결과: **Claude Fable 5.1, Fable 5, Opus 5.5, Sonnet 5.5, Haiku 5.5는 in-region 없음·Geo 없음·Global만**. **Opus 5, Sonnet 5는 in-region 가능**(bedrock-mantle, bedrock-runtime 둘 다 supported, Geo는 not-supported, Global supported). Opus 4.8/4.7/4.6, Sonnet 4.6, Haiku 4.5도 Global만. 같은 페이지의 위 설명 인용: "Your requests never leave the AWS Region you specify." | 서울에서 리전 안 처리를 요구하면 Opus 5/Sonnet 5급까지다. 5.5 세대·Fable은 global 라우팅이라 서울 보장이 없다. 표는 갱신되므로 모델 확정 시 다시 본다. |
| 11 | Google Cloud 서울(asia-northeast3)에서 Gemini 또는 Claude를 서울 안에서만 처리하는 보장이 있는가. "Cloud Run은 좋지만 서울 AI 처리 보장이 약하다" 판단이 지금도 맞는가 | 판단은 지금도 맞음 (Gemini 일부만 예외) | 직접(원문, 두 페이지 표 셀 파싱) | 데이터 거주 페이지(갱신 2026-11-03)의 Seoul 열에서 ML 처리 보장 표시가 있는 모델은 **Gemini 2.5 Flash(128k) 하나뿐**이다. Gemini 3.x·4 계열과 2.5 Pro·Flash-Lite 등은 비어 있다. Claude(파트너 모델) 표에는 Seoul 열 자체가 없고 Singapore(Opus 5/Sonnet 5, 5.5 세대, Fable)와 US/EU 멀티리전만 있다. global 엔드포인트는 ML 처리 요건이 있으면 쓰지 말라는 경고가 있다(같은 페이지). 리전 지원(locations) 페이지의 Seoul 열은 Gemini 2.5 Flash와 임베딩 3종에만 체크이고 Claude 표는 비었다. https://docs.cloud.google.com/vertex-ai/generative-ai/docs/learn/data-residency , https://docs.cloud.google.com/vertex-ai/generative-ai/docs/learn/locations | GCP에서 서울 안 AI 처리를 보장받는 최신 모델은 못 찾음. AWS Bedrock이 Opus 5/Sonnet 5로 서울 in-region을 제공하는 점이 대비된다. 서울 안 처리가 필수면 AWS 쪽 AI, 아니면 Cloud Run + 비보장 AI의 혼합이다. |
| 12 | S19~S21 LangGraph 재개 시 노드 코드가 처음부터 다시 실행될 수 있다 | 일치 | 직접(원문 grep) — S20, S21 확인. S19(Persistence)는 해당 문구를 못 찾음 | S20: "The node restarts from the beginning of the node where the interrupt was called when resumed" S21은 재시도가 노드 함수 전체를 처음부터 다시 실행해 at-least-once가 된다고 적는다. 크래시 재개에도 같은 모델이 적용된다고 적혀 있다. https://docs.langchain.com/oss/javascript/langgraph/interrupts , https://docs.langchain.com/oss/javascript/langgraph/fault-tolerance | 인터럽트·재시도 앞쪽의 외부 부작용(결제, 메일, 쓰기)은 멱등 키로 보호해야 한다. 노드 안에서 일부만 건너뛰려면 task로 감싼다. |
| 13 | S34 PostgreSQL 파티션 테이블의 유일성 제약에 파티션 키가 포함되어야 한다 | 일치 | 직접(원문) | "the constraint's columns must include all of the partition key columns" (또한 파티션 키에 표현식·함수 호출이 없어야 한다). https://www.postgresql.org/docs/current/ddl-partitioning.html | 시간 파티션 테이블의 PK·UNIQUE는 (id, 시간 키)처럼 설계한다. 전역 유일성이 필요하면 별도 장치를 둔다. |
| 14 | S39 Valkey WAIT이 강한 일관성을 만들지 않는다 | 일치 | 직접(원문) | "it does not turn a set of Valkey instances into a CP system with strong consistency" 뒤에 장애 전환 중 승인된 쓰기도 잃을 수 있다는 문장이 이어지고, WAIT/WAITAOF는 손실 확률을 줄일 뿐이라고 적혀 있다. https://valkey.io/topics/replication/ | Valkey는 정합성이 중요한 원장·재고가 아니라 캐시·큐·토큰 용도로 둔다. 승인된 쓰기 손실을 허용 범위로 정한다. |
| 15 | S37 PgBouncer transaction pooling에서 프로토콜 수준 prepared statement 지원 조건 | 일치 | 직접(원문) | 기능표 "Protocol-level prepared plans"는 session·transaction 둘 다 Yes이고, 각주: "You need to change max_prepared_statements to a non-zero value to enable this support." SQL `PREPARE/DEALLOCATE`는 transaction에서 "Never". https://www.pgbouncer.org/features.html | `max_prepared_statements`를 0이 아닌 값으로 두어야 한다. SQL PREPARE, 세션 advisory lock, WITH HOLD cursor는 transaction pooling에서 쓰지 않는다. |
| 16 | AWS "ECS Express Mode"가 공식 기능이며 작업자(요청 없는 백그라운드)에 쓸 수 있는가. "ECS Express Mode(화면·API), 작업자는 일반 ECS [추정]" | 기능은 일치, 작업자 제외 판단은 문서가 명시하진 않음 (일부 다름) | 직접(원문) + 검색요약(문서 목록) | 개요 페이지의 용도 첫 항목은 "Web applications and APIs"(HTTP 요청을 받는 stateless 앱)다. 구성은 Fargate 서비스 + URL + 로드밸런서(ALB) + 자동 확장이다. 사용 시나리오 4개(웹/API, 프로토타입, 개발자 생산성, 플랫폼팀)에 백그라운드 작업자는 없다. 도구: 콘솔·CLI·SDK·CloudFormation. 추가 요금 없음, ECS·Fargate 지원 리전 전부. 열어 본 페이지에서 "작업자에 쓸 수 없다"는 문장은 못 찾음. https://docs.aws.amazon.com/AmazonECS/latest/developerguide/express-service-overview.html | 요청 없는 큐 소비 작업자는 Express Mode의 ALB·HTTP 전제와 맞지 않아 일반 ECS 서비스로 두는 것이 안전하다. 이는 문서의 용도 설명에서 도출한 추정이지 명시 금지가 아니다. |

## 틀림 / 일부 다름 / 확인 못 함 요약
- 틀림: 없음.
- 일부 다름
  - 10b: 서울 in-region은 Claude 최신 세대(5.5, Fable 5·5.1)에는 없고 Opus 5·Sonnet 5까지만 있다.
  - 16: ECS Express Mode는 실제 기능이고 HTTP 서비스 중심이다. 작업자 불가는 명시된 사실이 아니라 용도 설명에서 나온 추정이다.
- 확인 못 함
  - 3: Cloud Run Worker Pools CREMA의 출시 단계(Preview/GA). 두 페이지에서 표기를 못 찾았다.
  - 7a: Supabase Pro "조직당" 문구는 못 찾았다. 가격 $25와 $599는 "from" 가격으로 일치한다.
  - 12: S19(Persistence)에서는 해당 문구를 못 찾았다. S20·S21은 확인했다.
  - 8a: GKE 무료 크레딧 조건은 대조하지 않았다.
- 판단 유지: 11번 "서울 AI 처리 보장이 약하다"는 GCP에서는 여전히 맞다. 다만 Gemini 2.5 Flash 한 모델은 서울 처리가 표기돼 있다.

## 한계
- 1번 NestJS와 7a Supabase 요금은 페이지가 JS 렌더링이라 curl 원문으로 본문이 나오지 않아 WebFetch 발췌에 의존했다.
- 클라우드 표(Bedrock·Vertex)는 체크 표시가 아이콘이므로 HTML의 icon/alt 값을 파싱했다. 표는 수시로 바뀐다(Vertex 2026-11-03 갱신).
- 문서 전체를 대조하지 않았고 요청한 16개 주장만 봤다.
