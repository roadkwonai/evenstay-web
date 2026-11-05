# 아키텍처 설계안 기술 사실 재대조 (공식 자료 직접 조회)

조회일: 2026-11-05 (KST). 가격표는 AWS 공개 가격 JSON의 게시 시각을 함께 적었다.
대상: `01-research/outputs/senior-housing-architecture-design.md` (수정하지 않음)
범위: `sources/arch-gpt-crosscheck.md`의 16건은 다시 하지 않았다. 거기서 "확인 못 함"으로 남은 항목만 5절에서 다시 시도했다.

## 읽는 법
- 판정: 일치 / 일부 다름 / 틀림 / 확인 못 함.
- 문서가 버전을 적지 않은 구성요소(FastAPI, LiteLLM 등)는 "최신 안정판이 문서 표기와 다른가"를 볼 수 없어 최신판과 지원 상태만 적고 "일치(버전 미표기)"로 두었다.
- 버전·날짜는 레지스트리(PyPI, npm, Maven Central, GitHub 태그)에서 직접 받은 값이다. endoflife.date는 제3자 집계라 지원 종료일에만 쓰고 그렇게 표시했다.
- 가격은 AWS 가격 JSON(서울 `ap-northeast-2`, 온디맨드)에서 직접 읽었고 730시간으로 곱했다. 달러 이하 둘째 자리에서 반올림했다.
- 인용은 항목당 한 개, 15단어 이내다. 부재 주장은 "열어 본 페이지에서 못 찾음"으로만 적었다.
- [사실] 공식 자료에 적힌 내용. [추정] 그 내용에서 내가 이끌어 낸 것. 못 찾으면 "못 찾음".

## 1. 문서를 고쳐야 하는 항목 (요약)

| 번호 | 설계안 위치 | 문제 | 판정 | 근거 절 |
|---|---|---|---|---|
| F1 | 7절 비용, 4.2절 | 사설 서브넷에 ECS 태스크를 두면 NAT 게이트웨이 또는 VPC 엔드포인트가 필요한데 합계에 없다. 서울 NAT는 월 $43.07(AZ당)과 데이터 $0.059/GB, 공용 IPv4는 개당 월 $3.65다 | 일부 다름 (빠진 항목) | 3.2, 4.1 |
| F2 | 4.2절 2단계 "큐를 업무별로 나눠" | JobRunr 무료판(OSS)에는 우선순위 큐와 동적 큐가 없고 Pro 기능이다. 트랜잭션 참여(`@Transactional`), 배치, 체이닝, 뮤텍스, 작업 시간 초과, DB 장애 시 일시 중지도 Pro다. 무료판 반복 작업은 100개까지다 | 일부 다름 | 2.1 JobRunr |
| F3 | 6.6절 가드레일·재순위화·임베딩 | 한국어 가드레일은 Standard 등급만 되고(Classic은 영어·프랑스어·스페인어) Standard는 교차 리전 처리다. 재순위화는 Bedrock 서울 미제공이다. 임베딩은 Titan V2만 서울 안 처리이고 Cohere Embed v4는 서울에서 global만이다 | 일부 다름 (조건 추가) | 4.3, 4.4 |
| F4 | 2절·3절 Next.js 16 | 16.0.0~16.4.0에 인증 없는 원격 코드 실행(critical) 2건이 2026-10-22에 공지됐고 16.4.1에서 수정됐다. "Next.js 16"만 적으면 취약한 버전도 포함한다 | 일치 + 주의 | 2.1 Next.js |
| F5 | 4.2절 4단계, 6.3절 LiteLLM | 2026-03 PyPI 악성 릴리스 사고, CISA 악용 취약점 목록(KEV) 3건, GitHub 보안 권고 다수. "필요하면 LiteLLM"에 위험 부기가 없다 | 일치(버전 미표기) + 위험 누락 | 2.2 |
| F6 | 7절 Valkey small $27.4 | 단일 노드 가격이다. 복제본이 없으면 장애 전환이 안 되므로 2단계 "무중단"과 맞추려면 2노드($54.9)로 봐야 한다 | 일부 다름 | 3.1 |
| F7 | 3절 표, 4.2절 1단계 "RDS PostgreSQL 18" | RDS PostgreSQL 18의 서울 제공을 명시한 공식 페이지를 못 찾았다. 가용성은 CLI 한 줄로 확인한다 | 확인 못 함 | 2.1 RDS |

선택 사항(고치면 좋음): Spring Boot 4.1 오픈소스 지원 종료일(2027-07-31, 제3자 집계)과 4.2 GA 임박, JobRunr 9.0 메이저 변경, Fargate ARM 20% 절감, Sonnet 5 수명(EOL 2027-06-30 이전 아님).

## 2. 버전과 지원 상태

### 2.1 구성요소별 표

| 구성요소 | 문서 표기 | 조회한 최신 안정판·상태 | 판정 | 출처(조회일 2026-11-05) | 비고 |
|---|---|---|---|---|---|
| Next.js | 16 | 16.4.5 (npm 2026-11-03). 16은 2025-10-22 출시, LTS 표시 | 일치 + 주의(F4) | https://registry.npmjs.org/next , https://endoflife.date/api/nextjs.json | critical 2건 GHSA-673q-mjm6-r5xr(`use cache` 반환 형식), GHSA-2464-fhr4-w9xw(이미지 최적화 API, SVG). 영향 16.0.0~16.4.0, 수정 16.4.1. https://api.github.com/advisories/GHSA-673q-mjm6-r5xr . 같은 날 DoS(high) 1건도 수정 16.4.1 |
| Java | 25 | LTS. 25.0.5 (Oracle 2026-10-24, Temurin 25.0.5+8, Corretto 25.0.5.0.10). 25 출시 2025-09-16 | 일치 | https://endoflife.date/api/oracle-jdk.json , /eclipse-temurin.json , /amazon-corretto.json | Java 27(2026-09-15, 비LTS)이 나왔고 26은 지원 종료. Spring Boot 4.1.2는 Java 17 이상~27까지 호환. 인용: "Spring Framework 7.0.10 or above is also required." https://docs.spring.io/spring-boot/system-requirements.html |
| Spring Boot | 4.1 | 4.1.2 GA(spring.io 페이지에 4.1.2 표시). 4.2.0-RC1이 2026-10-22에 Maven Central에 올라옴 | 일치 | https://spring.io/projects/spring-boot , https://repo1.maven.org/maven2/org/springframework/boot/spring-boot/maven-metadata.xml | 오픈소스 지원 종료 2027-07-31, 확장 지원 2028-07-31은 endoflife.date(제3자) 값이다. spring.io 페이지에는 지원 날짜가 없어 공식 확인은 못 했다. 4.0은 2026-12-31 종료 |
| Spring Modulith | 2.1 | 2.1.2 GA(spring.io 표시). 2.2.0-RC1 존재 | 일치 | https://spring.io/projects/spring-modulith , https://repo1.maven.org/maven2/org/springframework/modulith/spring-modulith-core/2.1.2/spring-modulith-core-2.1.2.pom | 2.1.2 POM이 `spring-boot-autoconfigure` 4.1.2를 참조한다. 문서 페이지에는 Boot 요구 버전이 없어 POM으로 확인했다 |
| PostgreSQL | 18 | 18.6 (커뮤니티 2026-08-13). 18은 2025-11-13 출시, 커뮤니티 지원 종료 2030-11 | 일치 | https://endoflife.date/api/postgresql.json , https://docs.aws.amazon.com/AmazonRDS/latest/PostgreSQLReleaseNotes/postgresql-release-calendar.html | |
| RDS for PostgreSQL 18, 서울 | RDS PostgreSQL 18, AWS 서울 | RDS 18은 2025-11-14 제공, 18.6은 2026-08-25. RDS 표준 지원 종료 2031-02-28 | 확인 못 함(서울) | 위 릴리스 달력. https://aws.amazon.com/about-aws/whats-new/2025/11/amazon-rds-postgresql-major-version-18 | 공지문이 "리전 제공은 가격 페이지 참조"라고만 적고 리전 목록이 없다. 서울 가격 JSON에 PostgreSQL 엔진 행은 있지만 버전이 안 적혀 있다. 확인: `aws rds describe-db-engine-versions --engine postgres --engine-version 18 --region ap-northeast-2` |
| pgvector, RDS PG18 | 3단계 pgvector | 0.8.2 (18.4 이후), 18.6 포함 | 일치 | https://docs.aws.amazon.com/AmazonRDS/latest/PostgreSQLReleaseNotes/postgresql-extensions.html | 표는 메이저 버전 기준이라 서울 한정 확인은 아님. 인용: "Extension versions don't automatically upgrade during engine version upgrade workflows." |
| pg_bigm, RDS PG18 | 3단계 `pg_bigm` | 1.2_20250903 (18.0 미리보기~18.6) | 일치 | 같은 페이지 | |
| Valkey, ElastiCache 서울 | Valkey 공유 캐시 | ElastiCache 지원 엔진 Valkey 9.1, 9.0, 8.2, 8.1, 8.0, 7.2. Valkey 오픈소스 최신 9.1.3 (2026-10-26). 서울 가격표에 `cache.t4g.small` Valkey 행이 있다 | 일치 | https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/engine-versions.html , 서울 가격 JSON(3.1절), https://endoflife.date/api/valkey.json | 서울 제공은 가격표 행으로 확인했다. 9.0부터 다중 AZ 트랜잭션 로그 기반 내구성 옵션이 있다고 적혀 있으나 이 설계는 캐시 용도라 쓰지 않는다 |
| FastAPI | 3단계 FastAPI | 0.162.0 (PyPI 2026-10-23) | 일치(버전 미표기) | https://pypi.org/pypi/fastapi/json | 1.0 이전. 마이너 올림 때 호환 확인 필요 [추정] |
| Pydantic v2 | v2 | 2.14.2 (2026-10-29). v3 없음 | 일치 | https://pypi.org/pypi/pydantic/json | |
| PydanticAI | 3단계 PydanticAI | 2.66.0 (2026-11-04) | 일치(버전 미표기) | https://pypi.org/pypi/pydantic-ai/json | 릴리스가 매우 잦다. 버전 고정 필요 [추정] |
| Taskiq | 3단계 Taskiq | 0.13.0 (2026-09-26), MIT | 일치(버전 미표기) | https://pypi.org/pypi/taskiq/json , https://api.github.com/repos/taskiq-python/taskiq | 1.0 이전 |
| LangGraph | Python, TypeScript | Python `langgraph` 1.2.19 (2026-10-30). TypeScript `@langchain/langgraph` 1.6.1 (2026-11-04) | 일치 | https://pypi.org/pypi/langgraph/json , https://registry.npmjs.org/@langchain/langgraph | 두 언어 모두 1.x. 재개 시 노드 재실행은 기존 대조 12번에서 확인됨 |
| Spring AI | 4단계 선택지 | 2.0.2 GA, 2.1.0-RC1 | 일치 | https://spring.io/projects/spring-ai , https://repo1.maven.org/maven2/org/springframework/ai/spring-ai-model/maven-metadata.xml | 인용: "Spring AI 2.0.x supports Spring Boot 4.0.x and 4.1.x." https://docs.spring.io/spring-ai/reference/getting-started.html |
| LiteLLM | 필요하면 LiteLLM | 1.108.0 (2026-11-04) | 일치(버전 미표기) + 위험(F5) | 2.2절 | 라이선스 변경은 못 찾음: MIT, `enterprise/` 디렉터리만 별도 라이선스 |
| OpenTofu | 2단계 OpenTofu | 1.13.5 (GitHub 태그, 2026-10-29). 1.13은 2026-09-30 출시, 지원 종료 2027-08-01 | 일치 | https://api.github.com/repos/opentofu/opentofu/tags , https://endoflife.date/api/opentofu.json | GitHub의 "latest release" 표시는 v1.13.2에 머물러 있어 태그 목록을 기준으로 했다. MPL-2.0 |
| JobRunr | JobRunr(PostgreSQL) | 9.0.3 (Maven 2026-10-29). 9.0.0은 2026-09-30 출시 | 일부 다름(F2) | 아래 JobRunr 상세 | 9.0은 하위 호환이 깨지는 변경이 있는 메이저다. Spring Boot 4용 starter(`jobrunr-spring-boot-4-starter`)가 Maven에 있다 |
| DBOS | JobRunr 또는 DBOS | Python `dbos` 3.4.0 (2026-10-28, MIT). Java `dbos-transact-java` GitHub 릴리스 1.2.0 (2026-10-01), 1.0.0은 2026-07-01 | 일치 | https://pypi.org/pypi/dbos/json , https://api.github.com/repos/dbos-inc/dbos-transact-java/releases | Maven Central `dev.dbos:transact`의 latest 표시가 `1.3.0-m19`(마일스톤)로 나온다. 정식 1.x가 Maven에도 올라와 있는지는 이번에 목록 끝까지 보지 못했다 |
| OpenTelemetry | 2단계 OpenTelemetry | Java API 1.67.0 (2026-10-09), JS API 1.10.0, Python API 1.45.2 | 일치 | https://repo1.maven.org/maven2/io/opentelemetry/opentelemetry-api/maven-metadata.xml , npm, PyPI | 생성형 AI 시맨틱 규약은 별도 저장소로 옮겨졌다고만 적혀 있고 안정도 표기를 못 찾음 → 확인 못 함. 인용: "GenAI semantic conventions have moved to the OpenTelemetry GenAI semantic conventions repository." https://opentelemetry.io/docs/specs/semconv/gen-ai/ |
| Langfuse | 5단계 자체 호스팅 | 플랫폼 GitHub v4.75.0 (2026-11-04), Python SDK 5.1.0 | 일치 + 맥락 | https://api.github.com/repos/langfuse/langfuse/releases/latest , https://clickhouse.com/blog/clickhouse-acquires-langfuse-open-source-llm-observability | 2026-01-16 ClickHouse가 인수했고 MIT 코어와 자체 호스팅은 유지한다고 발표(검색 요약 기준). `LICENSE`에 `ee/` 디렉터리 별도 라이선스가 있다. 아키텍처가 ClickHouse 기반이라 6.6절의 "자체 호스팅 운영 부담"은 타당하다 [추정] |
| dlt | dlt + Dagster | dlt 1.32.0 (2026-10-29), Dagster 1.13.28 (2026-10-30), 둘 다 Apache-2.0 | 일치 | https://pypi.org/pypi/dlt/json , https://pypi.org/pypi/dagster/json | |
| EKS Auto Mode | 5단계 EKS Auto Mode | AWS 공식 문서에 정식 기능으로 서술. 관리 요금은 EC2 요금 위에 별도 과금. EKS 최신 Kubernetes는 1.37 | 일치(서울 제공은 확인 못 함) | https://docs.aws.amazon.com/eks/latest/userguide/automode.html , https://aws.amazon.com/eks/pricing/ , https://endoflife.date/api/amazon-eks.json | 가격 페이지에 Auto Mode 비율 규칙은 없고 예시 4번이 EC2 가격의 약 12%다. 인용: "EKS Auto Mode charges are billed per-second, with a one-minute minimum." 표준 $0.10/시간, 연장 $0.60/시간 |
| OpenSearch Nori | 5단계 OpenSearch Nori | Nori 분석 플러그인이 OpenSearch Service 지원 플러그인 목록에 있음(최소 1.3). 선택 설치 플러그인 | 일치 | https://docs.aws.amazon.com/opensearch-service/latest/developerguide/supported-plugins.html | |
| ECS Express Mode | 화면·API 후보 | 공식 기능. 공개 또는 사설 HTTPS 서비스, ALB 공유, 추가 요금 없음, Terraform도 지원 | 일치 | https://docs.aws.amazon.com/AmazonECS/latest/developerguide/express-service-overview.html | 인용: "Web applications and APIs - Stateless containerized applications that serve HTTP requests" 작업자 제외는 여전히 명시 문장이 없어 용도 설명에서 나온 추정이다(기존 대조 16번과 같음) |

### JobRunr: 무료판과 Pro의 경계, 이 설계가 쓰는 기능

[사실] 아래는 JobRunr 공식 가격·문서 페이지에서 읽은 내용이다.
- https://www.jobrunr.io/en/pricing/ , https://www.jobrunr.io/en/documentation/pro/ , https://www.jobrunr.io/en/documentation/pro/priority-queues/ , https://www.jobrunr.io/en/documentation/pro/transactions/ , https://www.jobrunr.io/en/documentation/background-methods/recurring-jobs/
- 무료판 라이선스는 가격 페이지에 LGPL 3.0으로 적혀 있다. GitHub API의 라이선스 표시는 "NOASSERTION"이고 `LICENSE.md` 경로는 404였다. 가격 페이지 값을 따랐다.
- 인용(반복 작업): "JobRunr OSS supports up to 100 recurring jobs"

| 이 설계가 쓰는 기능 | 설계 위치 | 무료판(OSS) | 판정 |
|---|---|---|---|
| 백그라운드 작업 등록·예약, 자동 재시도, 대시보드, SQL 저장소(PostgreSQL) | 1단계 "JobRunr 큐" | 가능 [사실: 가격표 "Automatic retries", Spring Boot 통합 표기] | 일치. PostgreSQL 지원 문구는 가격 페이지에서 못 찾음 |
| 업무별로 큐를 나눠 결제 웹훅이 문서 작업 뒤에서 기다리지 않게 함 | 4.2절 2단계 | 안 됨. 우선순위 큐(최대 5단계, `@Job(queue = ...)`)와 동적 큐는 Pro 문서에만 있다. OSS가 큐를 어떻게 다루는지는 열어 본 페이지에서 못 찾음 | 일부 다름. 대안은 [추정]: 작업자(JobRunr 서버) 프로세스를 용도별로 나누거나 8절의 SQS 도입 기준을 앞당긴다 |
| 업무 트랜잭션과 같은 트랜잭션에서 작업 등록 | 1단계 "코어 아웃박스 + JobRunr" | Pro 문서에 `@Transactional` 플러그인이 있다. OSS 동작은 페이지에서 못 찾음 | 확인 못 함(OSS). 이 설계는 아웃박스를 따로 두므로 영향이 작다 [추정] |
| 작업 시간 초과, DB 장애 시 자동 일시 중지, 뮤텍스, 배치·체이닝 | 6.3절 재시도·장시간 작업 | Pro 기능 목록에 있음 | 설계가 직접 쓰는지는 문서에 없음. 쓰면 Pro |
| 반복 작업 | 정기 대사, 배치 | 최대 100개. 무제한은 Enterprise | 일치(한도 명시 필요) |
| 대시보드 SSO, 대시보드에서 민감정보 가리기 | 2단계 접속기록 점검 | Pro Enterprise 기능 | 실제 입주자 데이터가 대시보드에 보이면 필요 [추정] |

## 2.2 LiteLLM 보안·라이선스

[사실] 조회: GitHub 보안 권고 API(`api.github.com/advisories?ecosystem=pip&affects=litellm`), CISA KEV JSON(`cisa.gov/.../known_exploited_vulnerabilities.json`, 갱신 2026-11-03), LiteLLM 공식 블로그.

| 사건 | 날짜 | 내용 | 출처 |
|---|---|---|---|
| PyPI 악성 릴리스 | 2026-03-24 | 1.82.7과 1.82.8이 약 40분 게시됐고 자격 증명을 탈취하는 코드를 포함했다. 원인은 CI 보안 점검 도구(Trivy) 침해로 추정되며 조사 중이라고 적었다. 공식 프록시 Docker 이미지는 영향 없음. 이후 1.83.0부터 새 CI 파이프라인으로 배포, Docker 이미지에 cosign 서명 | https://docs.litellm.ai/blog/security-update-march-2026 . 인용: "Customers running the official LiteLLM Proxy Docker image were not impacted." |
| CISA KEV 등재 | 2026-05-08 | CVE-2026-42208 (프록시 API 키 검증 SQL 주입, critical, 수정 1.83.7) | KEV JSON, https://api.github.com/advisories/GHSA-r75f-5x8p-qvmc |
| CISA KEV 등재 | 2026-06-08 | CVE-2026-42271 (MCP stdio 시험 엔드포인트 명령 실행, high, 수정 1.83.7) | KEV JSON |
| CISA KEV 등재 | 2026-09-02 | CVE-2026-59822 (MCP OAuth2 우회, high, 수정 1.84.0) | KEV JSON |
| 최근 권고 | 2026-10-27 | `internal_user_viewer` 임의 파일 읽기(high, 수정 1.95.0), 솔트 키 재사용 관리자 권한 상승(high, 여러 수정 버전) | https://api.github.com/advisories?ecosystem=pip&affects=litellm |
| 권고 규모 | 2026-04~10 | 조회 첫 30건 중 critical 4건(CVE-2026-35030, -37004, -42208, -49468) | 같은 API(페이지당 30건까지만 받음) |
| 라이선스 | 변경 못 찾음 | 대부분 MIT, `enterprise/` 디렉터리는 별도 `enterprise/LICENSE` | https://github.com/BerriAI/litellm/blob/main/LICENSE |

[추정] 이 설계는 LiteLLM을 4단계에 "필요하면" 두므로 당장 영향은 없다. 도입하면 프록시를 공식 Docker 이미지로, 버전을 고정하고, 관리 API를 인터넷에 열지 않는 조건이 필요하다.

Spring Boot 쪽: 2026-04-28 권고 CVE-2026-40976(critical, 액추에이터가 있고 헬스 엔드포인트가 없을 때 기본 보안 필터 체인에 인가 규칙 없음)은 영향 범위가 4.0.0~4.0.5이고 4.0.6에서 수정됐다. 4.1은 영향 범위에 없다. https://api.github.com/advisories/GHSA-8v8j-3hxp-93wr

## 3. 가격 재계산 (AWS 서울, 730시간)

### 3.1 문서 7절 항목

단가는 서울 가격 JSON에서 읽었다. 게시 시각: ECS 2026-10-19, ELB 2026-11-02, RDS 2026-10-29, ElastiCache 2026-10-28.
URL 형식: `https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/<서비스>/current/ap-northeast-2/index.json` (서비스: AmazonECS, AWSELB, AmazonRDS, AmazonElastiCache)

| 항목 | 서울 단가 | 재계산 | 문서 | 판정 |
|---|---|---|---|---|
| Fargate x86, 0.5vCPU·1GB | vCPU $0.04656/시, GB $0.00511/시 | $20.72 | $20.7 | 일치 |
| Fargate x86, 1vCPU·2GB | 같음 | $41.45 | $41.5 | 일치 |
| Fargate ARM, 0.5vCPU·1GB | vCPU $0.03725/시, GB $0.00409/시 | $16.58 | 없음 | 문서는 x86 기준. ARM은 약 20% 낮다 |
| Fargate ARM, 1vCPU·2GB | 같음 | $33.16 | 없음 | 같음 |
| ALB | 시간 $0.0225, LCU $0.008/LCU-시 | 시간분 $16.43 + LCU 1개 상시 $5.84 = $22.27 | $22.3 | 일치. LCU 1개 상시를 가정한 값으로 보인다 [추정] |
| RDS db.t4g.medium PostgreSQL Single-AZ | $0.102/시 | $74.46 | $74.5 | 일치 |
| RDS db.t4g.medium PostgreSQL Multi-AZ | $0.203/시 | $148.19 | $148.2 | 일치 |
| RDS gp3 50GB Single-AZ | $0.131/GB-월 | $6.55 | $6.6 | 일치 |
| RDS gp3 50GB Multi-AZ | $0.262/GB-월 | $13.10 | $13.1 | 일치 |
| ElastiCache Valkey cache.t4g.small | $0.0376/시 | $27.45 (1노드) | $27.4 | 일치. 단일 노드이므로 복제본을 더하면 $54.90(F6) |
| 1단계 합계 | | $206.9 | 약 $207 | 일치 |
| 2단계 합계 (화면 2 + API 2 + 작업자 2, Multi-AZ, Valkey 1노드) | | $418.2 | 약 $418 | 일치 |
| 3단계 합계 (+ AI 서비스 0.5vCPU·1GB) | | $439.0 | 약 $439 | 일치 |
| 참고: Multi-AZ DB 클러스터(읽기 가능 대기) gp3 | $0.393/GB-월 | $19.65 (50GB) | 없음 | 문서의 "Multi-AZ가 곧 읽기 분산은 아니다"와 맞는 별도 상품이다 |

Fargate ARM으로 바꾸면 1단계 $186.2, 2단계 $376.8로 계산된다(약 $21, $41 절감). 문서 가격은 x86이고 RDS는 Graviton(t4g)이다. ARM 이미지로 쓸 수 있는지는 [미확인].

### 3.2 문서가 뺀 항목의 서울 단가

| 항목 | 서울 단가 | 월 환산(730시간) | 출처·게시 시각 | 비고 |
|---|---|---|---|---|
| NAT 게이트웨이(AZ별) | $0.059/시, 처리 $0.059/GB | $43.07/AZ. 2개 AZ면 $86.14 | EC2 서울 가격 JSON(`AmazonEC2`) 2026-11-03 (`APN2-NatGateway-Hours`, `-Bytes`) | AWS 문서는 장애 대비로 AZ마다 NAT를 두라고 적었다. https://docs.aws.amazon.com/AmazonECS/latest/developerguide/networking-outbound.html |
| 리전형 NAT 게이트웨이 | 서울 가격표에 `RegionalNatGateway-Hours` $0.059/시 항목이 있다. 항목 설명이 "TransitGatewayVPC"로 적혀 있어 서울에서 그대로 청구되는지는 확인 못 함 | | 같은 JSON | AWS 문서상 AZ 자동 확장, 수동 모드에서는 EIP를 직접 지정. https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateways-regional.html |
| 공용 IPv4 주소 | $0.005/시 (사용 중·유휴 모두) | $3.65/개 | VPC 서울 가격 JSON 2026-11-03, https://aws.amazon.com/vpc/pricing/ | NAT의 EIP, 공용 IP를 받는 Fargate 태스크, ALB의 주소에 적용된다. ALB 페이지는 "You will incur standard public IPv4 address charges." 라고만 적었고 주소 개수는 안 적었다. ALB가 AZ당 1개라면 2개 AZ에서 $7.30 [추정] |
| VPC 인터페이스 엔드포인트 | $0.013/시/AZ, 처리 $0.01/GB(1PB까지) | $9.49/엔드포인트·AZ | VPC 서울 가격 JSON | ECR(api, dkr), CloudWatch Logs, Secrets Manager 4개를 2개 AZ에 두면 $75.92. 게이트웨이 엔드포인트(S3)는 가격표에 요금 항목이 없음 |
| CloudWatch Logs 수집 | $0.76/GB (Standard 클래스, 사용자 로그) | 사용량 비례 | CloudWatch 서울 가격 JSON 2026-10-07 | 같은 파일에 0~5GB 구간 $0인 "Global" 항목이 있다. 무료 한도 조건은 못 읽음 |
| CloudWatch Logs 저장 | $0.0314/GB-월 | 사용량 비례 | 같음 | |
| CloudWatch 경보 | $0.10/경보-월 (표준 해상도) | | 같음 | 10개까지 $0인 "Global" 항목이 있음 |
| Secrets Manager | $0.40/비밀-월, API $0.05/1만 건 | 비밀 10개면 $4.00 | Secrets Manager 서울 가격 JSON 2026-09-11 | |
| KMS | 고객 관리형 키 $1/키-월, 요청 $0.03/1만 건 | 키 1개 $1.00 | KMS 서울 가격 JSON 2026-10-26 | 월 2만 건 무료 구간 항목 있음 |
| RDS 백업 저장 | $0.095/GB-월 (무료 할당 초과분) | 사용량 비례 | RDS 서울 가격 JSON | 무료 할당은 리전·계정의 프로비저닝 DB 스토리지 100%. 인용: "equal to 100 percent of the total provisioned database storage" https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_WorkingWithAutomatedBackups.html |
| S3 표준 | $0.025/GB-월 (50TB까지) | 사용량 비례 | S3 서울 가격 JSON 2026-10-15 | |
| Titan Text Embeddings V2 | 입력 $0.000024592/1천 토큰 | 사용량 비례 | Bedrock 서울 가격 JSON 2026-11-02 | 문서는 Bedrock 호출료를 뺐다고 밝혔다. 참고용 |

[추정] 2단계에 NAT 2개 + EIP 2개 + ALB 주소 2개를 더하면 $418.2 → 약 $519(+$100.8). 1단계에 NAT 1개 + EIP 1개 + ALB 주소 2개를 더하면 $206.9 → 약 $261. 합산은 내 계산이고 사용량 비례 항목은 뺐다. 엔드포인트를 쓰면 NAT 대신 위 표의 엔드포인트 요금이 든다.

## 4. 네트워크와 AI

### 4.1 사설 서브넷 ECS 태스크의 외부 접근

| 확인 사항 | 판정 | 근거 |
|---|---|---|
| Fargate 태스크가 이미지를 받으려면 인터넷 경로가 필요하다. 사설 서브넷이면 NAT 게이트웨이를 붙이거나, ECR은 인터페이스 VPC 엔드포인트로 받는다 | 확인함 | https://docs.aws.amazon.com/AmazonECS/latest/developerguide/fargate-task-networking.html . 인용: "the task must have a route to the internet" |
| 로그 드라이버 전송과 Secrets Manager 조회도 태스크 ENI를 지나므로 같은 경로(NAT 또는 해당 서비스 엔드포인트)가 필요하다 | 확인함 | 같은 페이지 표 [추정: 표에는 "Task ENI"로만 적혀 있고 엔드포인트 이름은 없다. 서비스별 엔드포인트가 필요하다는 해석은 내 추론] |
| 공개 서브넷에 두고 공용 IP를 붙이는 방법도 있다. 태스크마다 공용 IP가 생긴다 | 확인함 | https://docs.aws.amazon.com/AmazonECS/latest/developerguide/networking-outbound.html |
| 결론: 이 설계의 "ECS + RDS + 서울"에서 사설 서브넷을 쓰면 NAT 또는 엔드포인트가 비용·구성에 들어가야 한다 | F1 | 3.2절 |

### 4.2 외부 기관 허용목록용 고정 송신 IP

[사실] 사설 서브넷의 태스크 외부 요청은 NAT 게이트웨이의 공용 IP로 나간다. ECS 문서: "Hosts on the internet receive an inbound connection that appears to be coming from the public IP address of the NAT gateway" (https://docs.aws.amazon.com/AmazonECS/latest/developerguide/networking-outbound.html).
- 표준 방법: 사설 서브넷 + NAT 게이트웨이(+ Elastic IP). AZ마다 NAT를 두면 허용목록에 AZ 수만큼 IP가 들어간다 [추정: 문서의 권고와 EIP 구조에서 이끌어 냄].
- 리전형 NAT는 수동 모드에서 EIP를 직접 연결할 수 있다(공식 문서 CLI 예시 `associate-nat-gateway-address`). 자동 모드는 AWS가 주소를 관리한다. 허용목록에는 수동 모드가 맞다 [추정].
- 공용 IP를 받는 Fargate 태스크의 주소는 태스크마다 달라 허용목록용으로 쓸 수 없다 [추정: 문서가 고정 주소를 약속한다는 문장을 못 찾음].
- C안(Vercel): Static IPs는 Pro·Enterprise에서 제공하고, 공유 고정 송신 IP 쌍, 프로젝트당 월 $100 + 비공개 데이터 전송료다. 미들웨어에는 적용되지 않고 컨테이너 이미지 베타와 함께 쓸 수 없다. 설계안 3절의 "고정 송신 IP를 따로 더해야 한다"와 일치한다. https://vercel.com/docs/networking/static-ips (갱신 2026-06-30)

### 4.3 Bedrock 서울: 임베딩·재순위화·처리 위치

출처: https://docs.aws.amazon.com/bedrock/latest/userguide/models-region-compatibility.html (모델별 표의 서울 행 아이콘을 직접 파싱), https://docs.aws.amazon.com/bedrock/latest/userguide/rerank-supported.html

| 모델 | 서울 In-Region | Geo | Global | 해석 |
|---|---|---|---|---|
| Titan Text Embeddings V2 | 있음 | 없음 | 없음 | 서울 안 처리 |
| Cohere Embed v4 | 없음 | 없음 | 있음 | 서울에서 쓰면 global 처리. 서울 밖 [사실: 표의 "Global" 정의가 전 세계 상용 리전] |
| Marengo Embed 3.0 (TwelveLabs, 영상) | 있음 | 없음 | 없음 | 서울 안 처리 |
| Nova Multimodal Embeddings | 서울 행을 못 찾음 | | | 확인 못 함 |
| Cohere Embed multilingual·english v3 | 서울 행을 못 찾음 | | | 확인 못 함 |
| Amazon Rerank 1.0 (재순위화) | 서울 없음. 단일 리전 목록: ap-northeast-1(도쿄), ca-central-1, eu-central-1, us-west-2 | | | 서울 미제공 |
| Cohere Rerank 3.5 (재순위화) | 서울 없음. 위 목록 + us-east-1 | | | 서울 미제공 |

판정: 일부 다름. 설계안 6.6절은 "임베딩, OCR, 재순위화: 3단계에 결정"이라 틀린 주장은 없다. 다만 재순위화를 Bedrock으로 하면 처리가 도쿄 등 서울 밖이라는 점, 임베딩은 Titan V2나 Marengo만 서울 안이라는 점을 표에 적어야 한다(F3).

[추정] 재순위화는 서울 안에서 자체 모델을 돌리거나, 서울 밖 처리를 법적 검토(문서 9절 10번)에 넣거나, 재순위화를 쓰지 않는 선택지가 있다.

### 4.4 Bedrock 서울 Sonnet 5 현재 상태 (대조표 10b 재확인)

| 확인 사항 | 결과 | 판정 |
|---|---|---|
| Sonnet 5 서울 In-Region(`bedrock-runtime`) | 지원. Geo 없음, Global 지원 | 일치 |
| Opus 5 서울 In-Region | 지원(mantle, runtime) | 일치 |
| Opus 5.5, Sonnet 5.5, Haiku 5.5, Fable 5, Fable 5.1 | 서울은 Global만 | 일치 (문서 6.6절 표기와 같음) |
| Mythos 5.1 | 서울 Global만 (문서에 언급 없음) | 추가 정보 |
| Sonnet 5 수명 | "Model lifecycle: Active", 출시 2026-06-30, "EOL no sooner than: June 30, 2027", 유예 기간 6개월 이상, 컨텍스트 1M 토큰 | 일치. 문서에 EOL 하한을 적으면 좋다 |
| `bedrock-mantle` 엔드포인트의 서울 | 지역 호환 표는 서울 In-Region(mantle) 지원, Sonnet 5 모델 카드의 mantle 지역 표에는 서울이 없음(us-east-1, us-gov-west-1, eu-north-1, eu-west-1, ap-southeast-4만) | 두 페이지가 어긋남. 확인 못 함. `bedrock-runtime`은 둘 다 서울 지원 |

출처: https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-anthropic-claude-sonnet-5.html , 위 지역 호환 페이지. 조회 2026-11-05. 이 표들은 자주 바뀐다.

### 4.5 Bedrock Guardrails 서울

| 확인 사항 | 결과 | 판정 |
|---|---|---|
| 서울이 안전장치 등급(Safeguard tier) 지원 리전에 있다 | 있음 | 일치 |
| Standard 등급은 교차 리전 추론을 쓴다. Classic은 쓰지 않는다 | 확인함. 인용: "Guardrails with Standard tier also use cross-Region inference." | 일치(문서 6.6절 "Standard 등급의 교차 리전 처리") |
| 교차 리전 요청은 같은 지리 범위 안에서만 처리되고 프롬프트·출력이 기본 리전 밖으로 나갈 수 있다 | 확인함. 서울에서 APAC 프로필이 어느 리전으로 가는지는 열어 본 페이지에서 못 찾음 | 확인 못 함(목적지) |
| 한국어 지원 | Standard 등급: 콘텐츠 필터·프롬프트 공격·금지 주제·그라운딩 모두 한국어 "Optimized and supported". Classic 등급: 영어·프랑스어·스페인어만. 단어 필터는 영어·프랑스어·스페인어만. 민감정보 필터는 한국어 지원 | 문서에 없던 조건 → F3 |
| 맥락 근거 확인(contextual grounding)의 Standard 등급 | 서울 미지원(도쿄 등 11개 리전 목록에 서울 없음). 그 리전에서 Standard를 지정하면 검증 오류 | 문서에 없던 조건 → F3 |
| 임베딩·재순위화 모델에 가드레일 적용 | 지원 안 함(미지원 모델 목록에 Titan V2, Cohere Embed, Rerank 등) | 해당 없음 |
| `bedrock-mantle` 엔드포인트 | 가드레일 미지원 | 가드레일을 쓰려면 `bedrock-runtime` 사용 |

출처: https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails-tiers.html , https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails-cross-region.html , https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails-supported-languages.html , https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails-supported.html

[추정] 한국어 서비스에서 가드레일을 쓰면 사실상 Standard를 써야 하고, 그러면 처리가 서울 안에서 끝난다는 보장이 없다. 6.6절 "가드레일: 미사용 기본" 행에 "한국어는 Standard만 지원"을 더하면 판단 근거가 분명해진다.

## 5. 기존 대조(`arch-gpt-crosscheck.md`)에서 "확인 못 함"이었던 항목 재시도

| 기존 번호 | 항목 | 이번 결과 | 판정 | 출처 |
|---|---|---|---|---|
| 3 | Cloud Run Worker Pools CREMA의 출시 단계 | Cloud Run 릴리스 노트에 "Support for worker pools is in General Availability (GA)" 2026-04-14 항목이 있다(Worker Pools 자체는 2025-06-25 미리보기였다). CREMA 전용 페이지(갱신 2026-10-30)에는 미리보기 표기가 없고, 릴리스 노트에는 CREMA 항목이 없다 | 확인 못 함(CREMA 단계). Worker Pools는 GA | https://docs.cloud.google.com/run/docs/release-notes , https://docs.cloud.google.com/run/docs/configuring/workerpools/crema-autoscaling |
| 7a | Supabase Pro "조직당" | 결제 문서가 "Supabase bills separately for each organization. Each organization has its own subscription" 라고 적었다 | 일치(확인됨) | https://supabase.com/docs/guides/platform/billing-on-supabase |
| 8a | GKE 무료 크레딧 조건 | 무료 등급: 결제 계정당 월 $74.40 크레딧. 영역형(zonal)과 Autopilot 클러스터에만 적용되고 리전형 클러스터 관리비에는 적용 안 됨 | 확인됨(조건) | https://cloud.google.com/kubernetes-engine/pricing |
| 12 | LangGraph S19(Persistence) 재실행 문구 | 지속성(Persistence) 페이지(`docs.langchain.com/oss/python/langgraph/persistence`)에서 재실행·재개 문구를 못 찾음. 인터럽트·내결함성 페이지에서는 이미 확인됨 | 확인 못 함(S19 한정) | 해당 페이지 |
| 16 | ECS Express Mode 작업자 불가 | 개요 페이지에 "작업자에 쓸 수 없다"는 문장이 여전히 없다. 새로 확인한 내용: 사설 HTTPS 서비스도 지원하고, ALB를 공유하며, Terraform을 지원한다. 사용 시나리오 네 가지에 백그라운드 작업자는 없다 | 일부 다름 유지(추정) | https://docs.aws.amazon.com/AmazonECS/latest/developerguide/express-service-overview.html |

## 6. 문서 기술 주장 중 스스로 찾아 대조한 것

| 번호 | 문서 주장(위치) | 결과 | 판정 | 근거 |
|---|---|---|---|---|
| S1 | 파티션 테이블 유일성에는 파티션 키가 들어가야 한다(6.5절) | 기존 대조 13번에서 확인됨. 이번에 다시 하지 않음 | 일치 | 기존 대조 |
| S2 | RLS 변수 주입은 트랜잭션 범위로 두고 풀러 고정(pinning)을 실측한다(6.5절, [추정]) | RDS Proxy PostgreSQL 절은 "Using `SET` commands"와 `set_config`로 기본값을 되돌리는 경우를 고정 사유로 적고, `SET LOCAL` 예외는 MySQL 절에만 있다. PostgreSQL에서 `SET LOCAL`이 고정을 일으키는지는 페이지에서 못 찾음 | 일치(추정 유지, 실측 필요) | https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-proxy-pinning.html . 인용: "for PostgreSQL setting a variable leads to session pinning" |
| S3 | Multi-AZ가 곧 읽기 분산은 아니다(6.5절) | 서울 가격표에 Multi-AZ 인스턴스(단일 대기)와 "Multi-AZ (readable standbys)"가 별도 상품으로 있다. 가격이 다르다(gp3 $0.262 vs $0.393/GB) | 일치 | RDS 서울 가격 JSON |
| S4 | RDS 백업·복구(6.5절) | 자동 백업 저장은 무료 할당(프로비저닝 100%)을 넘으면 $0.095/GB-월. 다른 리전으로 스냅샷을 복사하면 대상 리전 백업 저장이 늘어난다 | 일치(비용 보완 필요) | 3.2절 |
| S5 | Spring Modulith 2.1 + Spring Boot 4.1 조합(결론, 3절) | 2.1.2 POM이 Boot 4.1.2를 참조 | 일치 | 2.1절 |
| S6 | Spring AI(4단계 선택지)와 Boot 4.1의 호환 | 공식 문서가 2.0.x는 Boot 4.0.x·4.1.x 지원이라고 적음 | 일치 | 2.1절 |
| S7 | JobRunr가 Spring Boot 4를 지원한다(전제) | `jobrunr-spring-boot-4-starter` 9.0.3이 Maven Central에 있다 | 일치 | https://repo1.maven.org/maven2/org/jobrunr/jobrunr-spring-boot-4-starter/maven-metadata.xml |
| S8 | 3단계 `pg_bigm` 전문 검색 | RDS PG18에서 1.2_20250903 제공. 한국어 형태소 분석이 아니라 2-gram 방식이라는 점은 이번에 확인하지 않음 | 일치(제공 여부) | 2.1절 |
| S9 | Fargate 이미지 하나, 헬스체크, SIGTERM 종료(5절 1번) | 이번에 조회하지 않음 | 확인 못 함 | |
| S10 | 문서 7절 "NAT, 로그, 전송, 백업, Bedrock 호출료는 빠져 있다" | 문서가 스스로 밝힌 대로다. 단가는 3.2절 | 일치(솔직한 한계 표기) | |

## 7. 한계

- RDS PostgreSQL 18의 서울 제공 여부, `bedrock-mantle` 서울 제공(두 페이지 불일치), Guardrails 서울 교차 리전 목적지, OpenTelemetry 생성형 AI 규약 안정도, Nova Multimodal Embeddings와 Cohere Embed v3의 서울 행은 열어 본 페이지에서 못 찾았거나 어긋났다.
- 공식 페이지 가운데 JobRunr, Vercel, EKS 가격, Spring, ElastiCache 문서는 WebFetch가 뽑아 준 발췌에 의존했다. 원문 전체를 내가 읽지 않았다. 가격 JSON, Bedrock 표, 레지스트리, GitHub API, endoflife.date, CISA KEV는 내려받아 직접 파싱했다.
- LiteLLM 공급망 사고의 원인(Trivy 침해)은 LiteLLM이 "조사 중"이라고 적은 내용이다.
- 가격은 온디맨드 기준이다. 예약·절감 플랜, 프리 티어, 세금, 환율은 넣지 않았다.
- 표와 가격 JSON은 수시로 바뀐다. 모델·가격을 확정할 때 다시 본다.
- 대상 문서는 수정하지 않았다.
