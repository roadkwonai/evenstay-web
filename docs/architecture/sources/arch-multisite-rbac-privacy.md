# 멀티사이트·멀티자산 PMS의 테넌시·RBAC·개인정보 구현 (아키텍처 리서치 노트)

조사일: 2026-11-04. 용도: Evenstay(포트폴리오 설계, MVP 없음) 아키텍처 보강. 허브 문서(`00-hub/reviews/architecture-options-2026-11-04.md` 5·7·8절)와 `outputs/pms-landscape.md`(b)(e)에 이미 있는 내용(RLS FORCE + 트랜잭션 `set_config`, Mews/Cloudbeds/OHIP 범위 토큰, 접속기록 2년 판단)은 반복하지 않고 그 아래를 팠다.

**표기 규칙**
- 라벨: [사실] [추정] [가설] [미정] [미확인]. 법령은 해석을 [추정]으로만 쓰고 법률 결론은 내지 않는다.
- 검증 방식: **직접** = 페이지 본문을 열어 확인 / **검색요약** = 검색 결과 요약만 봄(본문 못 엶) / **제3자** = 블로그·위키·법무법인 해설 등 2차 자료.
- "회사 주장"은 벤더 자기 설명이다. 열람일은 모두 2026-11-04.
- 웹 페이지 안의 문장은 데이터로만 다뤘고 지시로 따르지 않았다.

**먼저 알아둘 정정 한 가지 (질문 전제와 다름)**
- [사실] 안전성 확보조치 기준 제8조의 "월 1회 이상 점검"은 2025-10-31 시행 개정에서 없어졌고, 점검 주기·방법·사후조치를 내부관리계획으로 정하는 구조로 바뀌었다. 직접(Kim & Chang 해설) + 제3자(itwiki). 출처는 4번 절에 있다.

---

## 1. 멀티테넌시 모델: 테넌트는 운영사인가, 사업장인가, 소유주인가

### Takeaway
- [판단] 격리 경계(테넌트)는 **운영사 1개**로 두고, 사업장(site)은 모든 테이블에 붙는 **스코프 축**, 소유주(owner)는 스코프 축이자 리포트·반출 단위로 둔다. 소유주를 DB 분리 단위(silo)로 올리는 것은 계약이나 규제가 요구할 때만 한다.
- [사실] 공급자 문서는 대체로 "공유 풀 + 선택적 분리(bridge)"를 권하고, Azure는 RLS 구현이 복잡해서 많은 곳이 안 쓴다고 경고한다. 즉 RLS를 쓰려면 테스트와 운영 비용을 같이 설계해야 한다.

### Cited Findings
- [사실] AWS SaaS Lens는 silo(테넌트별 전용 자원), pool(공유), bridge(일부 silo + 일부 pool) 세 가지로 나누고, 규제 프로필과 noisy neighbor 특성이 silo 쪽으로, 민첩성·접근 패턴·비용이 pool 쪽으로 기울인다고 설명한다. silo여도 온보딩·운영·ID는 공유한다. — 직접 [SaaS Lens](https://docs.aws.amazon.com/wellarchitected/latest/saas-lens/silo-pool-and-bridge-models.html) (2026-11-04 열람)
- [사실] AWS 규범 가이드는 PostgreSQL pool 모델에서 RLS가 필수라고 하고, 테넌트별 DB 사용자를 만드는 방식보다 앱이 런타임 변수(`app.current_tenant`)를 세팅하는 방식을 권한다. 테넌트 데이터가 있는 모든 테이블에 RLS를 켜라고 한다. — 직접 [AWS 규범 가이드 RLS](https://docs.aws.amazon.com/prescriptive-guidance/latest/saas-multitenant-managed-postgresql/rls.html) (2026-11-04)
- [사실] Azure 아키텍처 센터(문서 날짜 2026-08-21): 공유 DB는 밀도가 높고 싸지만 규모 한계·noisy neighbor·테넌트별 요건 불일치·스키마 커스터마이즈 어려움이 있다. 테넌트 자체 암호화 키, 개별 백업·복구 정책, 지리적 분리가 필요하면 격리 쪽으로 간다. — 직접 [Azure 저장소 접근법](https://learn.microsoft.com/en-us/azure/architecture/guide/multitenant/approaches/storage-data)
- [사실] 같은 Azure 문서의 안티패턴: 테넌트별 테이블, 특정 테넌트만을 위한 컬럼 추가, 수동 스키마 변경, 스키마 버전 단일 의존. 대안으로 테넌트 식별 컬럼이 있는 공용 테이블, 테넌트별 커스텀 데이터는 전용 테이블, 기능 플래그와 테넌트 설정을 쓰라고 한다. — 직접 (같은 URL)
- [사실] 같은 문서: 공유 DB에서 한 테넌트만 복구하려면 DB를 별도로 복원한 뒤 그 테넌트 데이터만 골라내야 할 수 있다. 오프보딩·반출·보존 자동화를 처음부터 만들라고 한다. — 직접 (같은 URL)
- [사실] 같은 문서: RLS는 사용자와 테넌트 ID가 앱에서 데이터 저장소까지 매 쿼리에 전달돼야 해서 설계·구현·테스트·유지가 복잡하고, 그래서 많은 멀티테넌트 솔루션이 RLS를 쓰지 않는다고 적었다. — 직접 (같은 URL)
- [사실] Citus 13.0.1 문서: 행 기반 샤딩은 분산 컬럼 `tenant_id`로 같은 테넌트를 같은 노드에 두고(co-location), 테넌트 한 곳으로 한정된 쿼리는 한 노드에서 끝난다. 테넌트 없이 도는 쿼리는 여러 샤드로 퍼진다. 테넌트마다 DB나 스키마를 두는 방식은 "비용이 크고 비현실적"이라 부르며 마이그레이션·백업·분석이 어려워진다고 적었다(이 페이지는 스키마 기반 샤딩을 별도 패턴으로 설명하지 않는다). — 직접 [Citus 데이터 모델링](https://docs.citusdata.com/en/stable/sharding/data_modeling.html)
- [추정] 모든 테이블이 `site_id`로 통일돼 있으면 소유주별 반출은 "소유주가 가진 사이트 집합 × 소유 기간"으로 필터한 조회가 된다. Azure의 오프보딩·반출 자동화 권고에서 끌어낸 내 정리이며 별도 출처는 없다.
- [사실] 실제 PMS: Mews(Enterprise/Portfolio), Cloudbeds(그룹 계정), OHIP(체인 범위 접근)는 `pms-landscape.md`(b)에 기록돼 있어 반복하지 않는다.
- [사실] Apaleo 개발자 가이드(채널 연동 편)는 요금제(rate plan)가 정확히 한 unit group(객실 카테고리)에 속하고, 요금제 ID가 property 코드·요금 코드·unit group 코드의 조합이라고 설명한다. — 검색요약 [Apaleo 요금제 매핑](https://apaleo.dev/guides/business-cases/channel-integration/rates.html)
- [사실, 제3자 도구 설명] Apaleo 엔티티는 property → unit group → unit, 요금제, 서비스로 나뉜다는 요약이 있다. 멀티 property 계정 구조는 이번 조사에서 확인하지 못했다. — 검색요약 (anythingmcp.com 커넥터 소개)
- [사실] Yardi: 분석기관(Verdantix)은 Voyager가 상업·주거 포트폴리오를 한 중앙 DB에서 다룬다고 소개하고, Yardi Senior Living Suite는 독립생활·지원생활·메모리케어·전문간호를 통합하는 별도 제품으로 소개된다. 두 제품이 데이터 모델을 공유하는지는 확인하지 못했다. — 검색요약 [Verdantix](https://atlas.verdantix.com/yardi/voyager-suite), [Yardi Voyager](https://www.yardi.com/voyager/), [IntuitionLabs](https://intuitionlabs.ai/software/assisted-living-senior-living/ccrc-continuing-care-retirement-community-management/yardi-senior-living-suite)
- [사실, 회사 주장] Yardi 설명에 따르면 Voyager에 상업·주거·공공주택·시니어 버전이 있다. — 제3자 [SoftwareConnect](https://softwareconnect.com/property-management/yardi-voyager/)

### Inferences
- [추정] 수탁 운영이라 "소유주"는 계약 당사자이지 SaaS의 "고객 테넌트"가 아니다. 데이터를 만드는 주체는 운영사 직원과 입주자이고, 소유주는 일부 사이트의 집계와 명세서를 읽는 이용자다. 그래서 소유주를 테넌트로 모델링하면 사이트 하나를 여러 소유주가 지분으로 나눌 때와 소유주가 바뀔 때 데이터 소유가 꼬인다.
- [판단] 구조 제안: `operator`(1행, 또는 그룹 계열사를 넣으면 몇 행) → `site` → `building/unit`. 소유 관계는 `site_ownership(site_id, owner_id, share, valid_at daterange)`로 두고, 같은 사이트·소유주에 기간이 겹치지 않게 막는다. 소유주 읽기 전용 이용자는 이 테이블로 접근 가능한 `site_id` 집합이 풀린다(소유주 변경 시점의 명세서는 그 시점의 소유 관계로 계산).
- [판단] 운영사 직원 스코프: 직원 역할 부여를 `(role, scope_type, scope_id, valid_at)`로 둔다. 본사=`operator`, 지역 매니저=`site_group`(또는 사이트 목록), 사업장 직원=`site`. 파트타임·순환 근무는 기간으로 풀고 겸직은 행을 늘린다.
- [판단] 허브 문서 5절이 정한 "앱이 `SiteOwnership` 조회를 먼저 풀어 site_id 목록을 세션 변수로 넘기는" 방식은 이 구조와 맞는다. 여기에 직원·소유주·보호자 모두 **허용 site_id 배열** 하나(+ 보호자는 입주자 ID 배열)로 환원하는 규칙을 더하면 정책이 단순해진다. 이 환원 규칙은 내 설계안이다.
- [추정] 소유주별 데이터 반출이 계약상 요구되는 수준이면 pool에서도 충분히 할 수 있다(사이트·기간 필터). DB 자체를 분리해야 하는 쪽은 소유주 고유 암호화 키나 지역 분리를 요구받을 때로 보이며, 이는 Azure가 든 조건과 같다.

### Gaps
- Mews 외 실제 PMS(Apaleo, Yardi, Entrata)의 멀티 property 접근 권한 모델(그룹·역할·스코프)을 공식 문서로 확인하지 못했다.
- 소유주 명세서 산출 시 소유 기간 변경을 PMS가 어떻게 처리하는지 확인한 자료가 없다.
- 한국 수탁 운영사(예: 롯데/[지원 회사]) 내부 구조는 공개 자료 없음 [미확인].

---

## 2. RLS 운영 이슈: 풀러, 성능, 테스트, Spring 연동, 비동기 워커

### Takeaway
- [사실] RDS Proxy는 PostgreSQL에서 `SET`과 `set_config` 사용을 세션 고정(pinning) 사유로 문서화한다. 트랜잭션 로컬(`set_config(..., true)`)이 예외인지는 이번에 확인하지 못했다. 이 점은 반드시 실측해야 한다.
- [사실] PgBouncer 트랜잭션 풀링 모드는 `SET`/`RESET`을 "지원 안 함"으로 적었고 `SET LOCAL`은 언급하지 않는다.
- [판단] Evenstay 시작 구성에서는 앱 수준 Hikari 풀만 쓰고, 외부 풀러(RDS Proxy 등)는 도입 시점에 pinning을 측정해 결정한다.

### Cited Findings (풀러)
- [사실] AWS 문서 요약: PostgreSQL에서 "SET 명령 사용"이 pinning을 일으키고, 세션 변수 기본값 지정에 쓰는 `SET`과 `set_config`가 거론된다. 저장 프로시저·함수 호출은 pinning을 일으키지 않는다. 세션 변수 설정에 대한 pinning을 끄는 필터가 있다. "SET LOCAL은 pinning 안 함"이라는 문구는 MySQL 쪽 설명에서만 보이고 PostgreSQL 쪽에는 없었다. — 검색요약 [RDS Proxy pinning(Aurora 가이드)](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/rds-proxy-pinning.html) (RDS UserGuide 경로는 404였고 Aurora 가이드 경로는 검색 결과로만 확인)
- [추정] 위 "pinning 끄는 필터"를 켜면 세션 값이 다른 클라이언트에 새는 위험이 생길 수 있다. 이 위험의 구체 문구는 확인하지 못했다. 테넌트 변수에는 쓰지 않는 쪽이 안전해 보인다.
- [사실, 제3자] 한 pgsql-odbc 스레드 요약에 RDS Proxy의 InitQuery로 `SET`을 대신할 수 있다는 보고가 있다. 일본어 블로그는 2023-11 업데이트 이후 확장 쿼리 프로토콜이 pinning 사유가 아니라고 주장하지만 공식 문서로 확인하지 못했다. — 검색요약 [Classmethod](https://dev.classmethod.jp/articles/rds-proxy-avoid-session-pinning)
- [사실] PgBouncer 기능 표: 트랜잭션 풀링에서 `SET/RESET`, `LISTEN`, `WITH HOLD` 커서, SQL 수준 `PREPARE`/`DEALLOCATE`, 세션 수준 advisory lock은 "Never"로 표시된다. 프로토콜 수준 prepared statement는 `max_prepared_statements`가 0이 아니면 가능하다. — 직접 [PgBouncer features](https://www.pgbouncer.org/features.html)
- [사실] Bytebase(2025-09-05): PgBouncer 뒤에서는 `current_user`가 공유되므로 트랜잭션 단위 세션 변수를 쓰고, 클라이언트가 그 변수를 직접 못 바꾸게 막으라고 한다. — 직접 [RLS footguns](https://www.bytebase.com/blog/postgres-row-level-security-footguns/)

### Cited Findings (PG 동작과 성능)
- [사실] PostgreSQL 문서: 슈퍼유저와 BYPASSRLS 역할은 항상 우회, 소유자는 `FORCE ROW LEVEL SECURITY`로만 정책을 받는다. 정책 안 서브쿼리는 READ COMMITTED에서 경쟁 조건을 만들 수 있다(완화: `SELECT ... FOR SHARE`, ACCESS EXCLUSIVE 락, 동시 트랜잭션 종료 대기). UNIQUE·PK·FK 검사는 항상 RLS를 우회하므로 공변 채널(covert channel)을 피하도록 설계해야 한다. 백업 시 `row_security=off`로 두면 필터링될 상황에서 조용히 빠지는 대신 오류가 난다. 연결 풀링과 `current_setting`은 이 페이지에서 다루지 않는다. — 직접 [PG RLS 문서](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [사실] Bytebase: LEAKPROOF가 아닌 함수가 정책에 있으면 인덱스 푸시다운이 막힐 수 있다. 정책 컬럼에 인덱스를 둔다. 뷰는 PG15+에서 `security_invoker = true`로 호출자 권한을 따르게 한다. FK 검사가 부모 테이블 SELECT 권한이 필요해 RLS가 오탐 위반을 낼 수 있다. 전역 UNIQUE 인덱스는 다른 테넌트에 값이 있는지 드러내므로 테넌트로 범위를 줄인다. 막힌 행은 오류 없이 0건 갱신이 된다. 구체화 뷰·COPY·백그라운드 작업은 정책 밖으로 행을 복사한다. 타이밍 채널이 있다. — 직접 [RLS footguns](https://www.bytebase.com/blog/postgres-row-level-security-footguns/)
- [사실] Supabase 문서(회사 문서): 정책 컬럼에 인덱스, 함수 호출을 `(select ...)`로 감싸 initplan으로 한 번만 평가, 정책에 `TO <역할>` 지정, 정책 안 조인 회피, 쿼리에 명시 필터를 중복 추가, RLS를 켠 채/끈 채 `EXPLAIN ANALYZE` 비교. 예시에서 인덱스 없는 필터는 10만 행에서 171ms, PK 조회는 0.046ms였다(예시 수치이며 일반화 근거 아님). — 직접 [Supabase RLS 성능](https://supabase.com/docs/guides/database/postgres/row-level-security-performance)
- [사실, 제3자] 한 엔지니어링 글은 정책을 고쳐 피크 CPU가 약 80%에서 16%로 줄었고, 처음에는 EXPLAIN을 RLS를 우회하는 권한 있는 역할로 돌려 운영과 달랐다고 한다. — 검색요약 [myhoai](https://engineering.myhoai.com/posts/debugging-postgres-performance-under-row-level-security/)
- [사실] Crunchy Data(2024-04-03): 테넌트별 DB 사용자 대신 연결 시 세션 변수를 세팅하는 방식을 소개한다. 성능·함정은 다루지 않고 예제의 변수명이 서로 달라 맞춰야 한다. — 직접 [Crunchy](https://www.crunchydata.com/blog/row-level-security-for-tenants-in-postgres)

### Cited Findings (Spring·Hibernate·비동기)
- [사실] Hibernate 7 사용자 가이드의 24장 "Multitenancy"는 별도 DB·별도 스키마·파티션(구분 컬럼) 방식과 `@TenantId`, `MultiTenantConnectionProvider`, `CurrentTenantIdentifierResolver`를 다룬다. 이번에는 목차만 확인했고 본문(네이티브 SQL·2차 캐시 동작)은 읽지 못했다. — 직접(목차만) [Hibernate 가이드](https://docs.hibernate.org/orm/7.0/userguide/html_single/Hibernate_User_Guide.html#multitenacy)
- [사실, 제3자] 커뮤니티 보고: Hibernate 6.4.4에서 PK 로드 시 `@TenantId` 필터가 기대대로 적용되지 않는다는 문의(HHH-16830 언급). 네이티브 쿼리는 자동 필터되지 않는다. — 검색요약 [Hibernate Discourse](https://discourse.hibernate.org/t/tenantid-filtering-when-loading-by-primary-key/9250)
- [사실, 제3자] 2026-08-21 글: `@TenantId`와 `CurrentTenantIdentifierResolver`를 JWT 보안 컨텍스트와 연결하는 방식을 소개하며, 네이티브 SQL은 자동 필터되지 않고, 비동기 작업·메시지 소비자·배치는 보안 컨텍스트를 잃어서 테넌트 ID를 명시로 넘겨 세션을 열기 전에 복원해야 한다고 적었다. 글이 말하는 "Spring의 새 멀티테넌시" 기능이 어떤 Spring 버전인지는 글에 없다. — 직접 [besthub](https://www.besthub.dev/articles/spring-s-new-multitenancy-serving-1-000-tenants-with-one-spring-boot-app-without-hand-writing-tenant-id-e61c6fdf261a)
- [미확인] jOOQ `ExecuteListener`/`ConnectionProvider`, `AbstractRoutingDataSource`, `TransactionSynchronization`으로 RLS 변수를 넣는 공식 패턴 문서는 이번에 찾지 못했다.

### Inferences
- [추정] `@TenantId`는 앱 계층 필터라 RLS의 대체가 아니라 중복 방어다. 허브 문서가 jOOQ/Spring Data JDBC를 제안했으므로 JPA의 `@TenantId` 경로는 해당이 없고, 그 경우 안전망은 RLS 하나가 된다.
- [판단] 주입 지점을 하나로 모은다. 트랜잭션 시작 직후 `select set_config('app.site_ids', ?, true), set_config('app.actor_id', ?, true), ...`를 실행하는 코드를 한 곳(예: `DataSourceTransactionManager.doBegin` 후크 또는 트랜잭션 템플릿 래퍼)에 두고, 변수 없이 쿼리가 나가면 정책이 0행을 주도록(= fail closed) 한다. 어느 후크가 맞는지는 [미확인]이라 스파이크로 검증한다.
- [판단] 비동기 워커 규칙: (1) 아웃박스 행에 `site_id`, `actor_id`, `scope_snapshot`을 저장한다. (2) 워커는 `ScopeRunner.runAs(scope, () -> ...)` 한 입구로만 DB에 접근한다. (3) 일일 배치는 사이트 단위로 쪼개 사이트마다 runAs로 돈다(전체를 BYPASSRLS로 돌리지 않는다). (4) 크로스사이트 집계는 읽기 전용 별도 역할과 승인된 뷰(`security_invoker`)로 한정한다. 허브 문서 8절 3번의 "범위 없이 조회하면 실패하는 테스트"가 이 규칙의 검증이 된다.
- [판단] 정책은 `site_id = ANY (current_setting('app.site_ids')::uuid[])` 모양으로 단순하게 두고 현재 사이트 목록 변수는 `(select ...)`로 감싼다. 복합 인덱스는 `(site_id, …)`로 시작한다. 실제 이득은 EXPLAIN으로 확인해야 하며 이 글의 수치로 대체하지 않는다.
- [판단] 테스트 3종: (a) 앱 역할로 접속해 다른 사이트 행이 안 보이는지, (b) 변수 없는 쿼리가 0행인지, (c) `INSERT`/`UPDATE`에서 `WITH CHECK`가 막는지. 운영 역할이 소유자나 BYPASSRLS가 아닌지는 CI에서 `pg_roles`로 단언한다.

### Gaps
- RDS Proxy에서 `set_config(..., true)`가 실제로 pinning을 일으키는지는 공식 문구로 확정하지 못했다. 실측 필요.
- PgBouncer에서 `SET LOCAL`이 트랜잭션 모드에서 동작한다는 공식 문구를 이번에 찾지 못했다(일반 지식으로는 동작하지만 이 조사에서 [미확인]).
- 모듈별 DB 역할(허브 문서 8절 4번)을 한 프로세스에서 쓰는 사례는 찾지 못했다.
- Notion/Figma/Shopify/Toss/우아한형제들 엔지니어링 글에서 멀티테넌시 사례는 이번에 조사하지 못했다.

---

## 3. 멀티 자산 확장: 공통 코어 + 자산별 규칙, 재고, 시간 모델

### Takeaway
- [판단] 공통 코어(Party, Site, Unit, Contract, Charge/Invoice/Payment, ServiceOrder)에 **계약 유형별 규칙을 설정 테이블 + 전략 코드**로 두고, 자산 유형별 속성은 소수의 확장 테이블과 JSONB로 나눈다. 기능 켜기·끄기는 사이트 단위 entitlement 테이블로 둔다.
- [사실] PostgreSQL 18은 `PRIMARY KEY/UNIQUE ... WITHOUT OVERLAPS`와 `FOREIGN KEY ... PERIOD`를 제공한다. 이중 예약 방지는 이 제약이나 `EXCLUDE USING gist`로 DB가 강제할 수 있다.

### Cited Findings
- [사실] PG 18 `CREATE TABLE`: `UNIQUE/PRIMARY KEY (…, col WITHOUT OVERLAPS)`는 마지막 컬럼만 해당하며 범위 또는 다중범위 타입이어야 하고 빈 범위는 안 된다. 다른 컬럼은 GiST에서 동등 비교가 가능해야 해서 보통 `btree_gist` 확장이 필요하다. GiST 인덱스를 쓰고 `EXCLUDE USING GIST (id WITH =, valid_at WITH &&)`와 같다고 문서가 말한다. `FOREIGN KEY (…, PERIOD col) REFERENCES …`는 참조 테이블이 `WITHOUT OVERLAPS` 키를 가져야 하며, 참조 동작은 `NO ACTION`만 가능하고 `RESTRICT/CASCADE/SET NULL/SET DEFAULT`는 "시간 외래키에서 지원 안 함"이다. — 직접 [PG 18 CREATE TABLE](https://www.postgresql.org/docs/18/sql-createtable.html)
- [사실] PG 18 `EXCLUDE`: 접근 방식은 `amgettuple`을 지원해야 해 GIN은 안 되고 GiST/SP-GiST를 쓴다. `WHERE (predicate)`로 부분 제약을 줄 수 있다(괄호 필수). 파티션 테이블이면 파티션 키 컬럼을 모두 `=`로 포함해야 한다. — 직접 (같은 URL) 및 [PG 18 제약 조건](https://www.postgresql.org/docs/18/ddl-constraints.html) (이 페이지는 EXCLUDE만 다루고 `WITHOUT OVERLAPS`는 CREATE TABLE 페이지에 있다)
- [사실] PG 19(개발판)는 `UPDATE/DELETE ... FOR PORTION OF`를 추가했다. 2026-04-01 커밋(depesz), PG 19 Beta 1은 2026-06-04. 공식 19 문서는 동시 세션 문제 때문에 같은 조건의 `SELECT FOR UPDATE`를 먼저 하라고 권한다. — 검색요약 [PG 19 문서](https://www.postgresql.org/docs/19/dml-application-time-update-delete.html), 제3자 [Neon 요약](https://neon.com/postgresql/postgresql-19/temporal-data-operations), [depesz](https://www.depesz.com/?p=4446). 허브 문서는 19가 "아직 RC"라고 적었고 이번 조사는 그 시점 확인이 아니다.
- [사실] Azure: 테넌트별 커스텀 컬럼 대신 커스텀 데이터를 전용 테이블에 두고, 기능 플래그와 테넌트 설정으로 변형을 처리하라고 한다. — 직접 [Azure](https://learn.microsoft.com/en-us/azure/architecture/guide/multitenant/approaches/storage-data)
- [사실] Apaleo: 요금제는 정확히 한 unit group에 속하고 파생 요금제의 요율은 수정할 수 없으며 제약(restriction)은 상속되지 않는다. — 검색요약 [Apaleo](https://apaleo.dev/guides/business-cases/revenue-management/get-rates.html)
- [사실, 회사 주장] Mews의 Service/Product/Resource 모델은 `pms-landscape.md`(b)에 이미 있다. 이번에 새로 확인한 Yardi·Entrata·Oracle의 자산 간 공용 모델 구조는 없다.

### Inferences
- [판단] 코어 엔티티는 `contract(contract_type, unit_id|service_id, party_id, period, status)`로 통일하고, 유형은 `RESIDENCY`(시니어), `LEASE`(임대), `STAY`(단기숙박)로 시작한다. 유형별 차이는 (a) 청구 주기와 일할 규칙, (b) 상태 전이, (c) 필수 서류·동의, (d) 점유 단위(월/일/시간)다. 이 네 가지만 전략 코드로 두고 나머지(요금표, 보증금 비율, 퇴실 정산일)는 사이트별 설정 테이블로 둔다. [판단]
- [판단] 점유(재고)는 `occupancy(unit_id, period daterange|tstzrange, contract_id, state)`에 `EXCLUDE USING gist (unit_id WITH =, period WITH &&) WHERE (state IN ('held','active'))`로 둔다. 취소건을 지울 필요 없이 부분 제약으로 제외하기 위해서다. 같은 목적으로 `WITHOUT OVERLAPS` PK를 쓰면 문서의 문법에 `WHERE`가 없어 취소 상태를 제약에서 뺄 수 없어 보인다 [추정]. 단기숙박은 시간 경계가 걸리므로 `tstzrange`, 월 단위 계약은 `daterange`(반개구간 `[)`)가 자연스럽다.
- [판단] 소유 관계·요금표·역할 부여처럼 "이 기간 동안 이 값"인 데이터는 PG 18의 `WITHOUT OVERLAPS`로 겹침을 막고, 과거 정정 이력이 중요한 계약 조건은 정정 이력 테이블을 별도로 둔다(이중시간 모델의 "시스템 시간"에 해당). PG가 시스템 시간 자체를 내장하는지는 이번에 확인하지 못했다 [미확인]. PG 19의 `FOR PORTION OF`는 도입 시 단순화되지만 18을 기준 버전으로 잡았으므로 포트폴리오에서는 "19에서 쉬워진다" 정도로만 언급하는 것이 안전하다.
- [판단] JSONB는 자산 유형별 선택 속성(예: 시니어 주거의 돌봄 등급 메모)에, 조회·집계·정산에 쓰는 필드는 정규 컬럼에 둔다. EAV는 쓰지 않는다. 이 선택은 Azure의 "전용 테이블" 권고와 방향이 같다는 점 외에 별도 비교 자료를 찾지 못했다 [판단].
- [판단] 사이트별 기능은 `site_feature(site_id, feature_key, enabled, valid_at)` 테이블로 시작하고 외부 플래그 서비스(OpenFeature/Unleash/Togglz)는 쓰지 않는다. 플래그가 "배포 제어"가 아니라 "사이트 계약 범위(entitlement)"이기 때문이다.

### Gaps
- OpenFeature/Unleash/Togglz는 이번에 조사하지 않았다. 위 판단은 문서 근거 없는 설계 판단이다.
- Entrata, Oracle Hospitality의 멀티 버티컬 설계, Yardi Voyager와 Senior Living Suite의 공유 코어 여부는 공식 자료를 못 찾았다.
- 국가별 청구 규칙(country-specific billing)은 한국 단일 국가라 이번 범위에서 제외했다.
- JSONB vs EAV의 성능·유지보수 비교 자료는 이번에 조사하지 않았다.

---

## 4. 인증·인가 스택

### Takeaway
- [판단] 시작은 **IdP 하나 + 앱 DB의 범위 있는 역할 테이블 + RLS**다. 외부 정책 엔진(OpenFGA/SpiceDB/Cerbos)은 보호자 위임과 사이트×소유주 그래프가 DB 조인으로 감당 안 될 때 올린다.
- [사실] Spring Authorization Server는 2025-09-11 발표대로 Spring Security 7.0으로 이전했다. 새 프로젝트면 Spring Security 쪽 문서를 기준으로 본다.

### Cited Findings
- [사실] Spring Authorization Server는 2022-11 1.0 이후 별도 프로젝트였고 Spring Security 7.0으로 이전한다. 아티팩트 `org.springframework.security:spring-security-oauth2-authorization-server:7.0.0`, groupId·artifactId 유지, 문서·이슈는 Spring Security 저장소로 통합. — 직접 [Spring 블로그, 2025-09-11](https://spring.io/blog/2025/09/11/spring-authorization-server-moving-to-spring-security-7-0)
- [사실, 제3자] InfoQ 글은 Spring Security 7.1.0이 2026-06, 7.1.1이 2026-08에 나왔고 Boot 4에서 스타터 이름에 `security-` 접두사가 붙었다고 한다. 공식 릴리스 페이지로 확인하지 못했다. — 검색요약 [InfoQ](https://infoq.com/articles/spring-security-7-server-side-dpop-token-exchange)
- [사실] Keycloak 최신 문서 헤더에 26.8.1이 보이고, 관리자 가이드에 Organizations(조직 생성, 도메인, 멤버, 초대, 조직별 IdP 연결, 토큰의 조직 클레임 매핑) 항목이 있다. GA 시점과 제약은 본문을 못 읽어 확인하지 못했다. — 직접(목차만) [Keycloak 관리 가이드](https://www.keycloak.org/docs/latest/server_admin/index.html#_managing_organizations)
- [사실] 카카오 로그인: OpenID Connect를 앱에서 켜면 액세스·리프레시 토큰과 함께 ID 토큰이 나온다. 만료는 REST API 기준 6시간이다. 메타데이터 `/.well-known/openid-configuration`, JWKS `/.well-known/jwks.json`, 사용자 정보 `GET /v1/oidc/userinfo`가 있다. 전화번호·이름·생일·CI 등의 동의항목 요건과 비즈 앱 검수는 이 페이지에 없다. — 직접 [카카오 로그인 공통](http://developers.kakao.com/docs/ko/kakaologin/common)
- [사실] OpenFGA 조건(conditions): Google CEL로 평가하고, 튜플에 `grant_time`, `grant_duration` 같은 값을 넣어 `current_time < grant_time + grant_duration` 같은 시간 제한 권한을 만든다. 튜플 컨텍스트는 최대 32KB, 요청 컨텍스트는 요청 크기 한도 512KB, CEL 평가 비용 기본 상한 100이며 한도에 걸리면 메인테이너에게 문의하라고 한다. 튜플과 요청 컨텍스트가 겹치면 튜플 값이 이긴다. 임의의 시작·종료 시각은 문서에 예가 없다. — 직접 [OpenFGA conditions](https://openfga.dev/docs/modeling/conditions)
- [사실] Cerbos: 리소스 정책은 리소스·액션·효과를 규칙으로 정하고, 파생 역할(derived roles)은 IdP가 준 정적 역할과 요청 속성에서 요청 시점에 계산한다. 조건은 `request.principal.attr`, `request.resource.attr`를 읽으므로 속성은 요청마다 넘기는 구조로 보인다(Cerbos가 데이터를 저장하는지는 이 페이지에 없다). 페이지에 표시된 최신 PDP는 0.57.0이다. 스코프 정책·주체 정책은 이 페이지에서 설명을 못 읽었다. — 직접 [Cerbos 파생 역할](https://docs.cerbos.dev/cerbos/latest/policies/derived_roles)
- [사실] SpiceDB 스키마: 정의(definition), 관계(relation), 권한(permission; 합집합·교집합·제외·화살표 `->`), caveat(관계에 붙는 조건식, 체크 시점에 참이어야 유효). 관계 만료와 ZedToken 일관성은 이 페이지에 설명이 없다. — 직접 [SpiceDB 스키마](https://authzed.com/docs/spicedb/concepts/schema)
- [사실, 제3자] 브레이크글래스 관행: 이유를 요청 시 남기고, 만료를 분·시간 단위로 두고, 공유 계정이 아니라 실명 개인에게 묶고, MFA 재인증 후 부여, 감사 로그는 변조 불가로 보관한다. 한 회사의 ADR(Raxx)은 기본 1시간, 최대 4시간, 최소 이유 길이 20자, 재요청 시 재인증·재소명이며 상시 그룹 멤버십은 기각했다. 표준(NIST/ISO)은 찾지 못했다. — 검색요약 [Raxx ADR](https://raxx-internal-docs.pages.dev/architecture/adr/0057-rbac-break-glass-time-limit), [hoop.dev(벤더 블로그)](https://hoop.dev/blog/what-is-break-glass-access/)

### Inferences
- [판단] IdP: 직원 SSO(Entra ID)는 페더레이션으로 붙이고, 입주자·보호자는 카카오 등 소셜 + 전화번호 인증 대체 경로(허브 문서의 대안 경로 원칙)로 둔다. Spring Authorization Server나 Keycloak 중 무엇이 포트폴리오에 맞는지는 운영 부담 차이(Keycloak은 별도 서버)와 "Spring 스택 일관성"으로 갈리고, 이번 조사로 우열을 가를 근거는 없다 [미정]. Cognito, Auth0/Okta, Ory, Zitadel은 조사하지 않았다.
- [판단] 역할×사이트×소유주×기간: DB 테이블 `role_assignment(principal_id, role, scope_type, scope_id, valid_at)`과 RLS로 시작한다. 이 요구는 "허용 사이트 집합 계산"이라 DB 조인으로 풀리고, ReBAC 그래프는 필요하지 않다 [추정].
- [판단] 보호자 위임(가족): `guardian_grant(resident_id, guardian_party_id, scopes[], consent_ref, valid_at, revoked_at)` 테이블. 열람 범위(식사/일정/건강)별 동의를 분리한다. 관계의 깊이가 1단계(보호자→입주자)라 Zanzibar식 관계 튜플의 이점(재귀 상속, 대규모 ListObjects)이 작다 [추정]. 이 판단은 입주자-보호자 관계가 1단계라는 도메인 가정에 의존한다.
- [판단] 외부 엔진을 고른다면 OpenFGA(조건으로 시간 제한 표현 가능)가 후보이고 Cerbos는 속성을 요청에 실어 보내므로 RLS와 이중 정책이 되기 쉽다. 어느 쪽이든 "허용 site_id 목록"을 RLS 변수로 환원하려면 엔진에서 ListObjects를 받아야 하고, 그 정합성(엔진 저장소와 DB 사이)이 새 위험이다 [추정].
- [판단] 파트너 API 토큰은 `api_client(client_id, site_scope[], scopes[], expires_at, revoked_at)` + 해시 저장 + 사이트 범위 고정. 폐기는 DB 컬럼 하나로 즉시 반영된다. MCP를 열 때는 허브 문서가 이미 OAuth 2.1 리소스 서버로 정했다.
- [판단] 브레이크글래스: `break_glass_grant(actor, reason, approver, site_scope, expires_at<=4h)`를 만들고, 부여 시 세션 변수에 `app.break_glass=true`를 넣어 감사 로그 모든 행에 표시하며 알림을 보낸다. 시간·길이 상한은 단일 회사 사례를 참고한 설계값일 뿐이다.

### Gaps
- Spring Security method security(`@PreAuthorize`, `AuthorizationManager`), Casbin, OPA는 이번에 조사하지 않았다.
- Zanzibar 논문 자체는 읽지 않았고 적용 가능성은 SpiceDB/OpenFGA 문서 기준의 판단이다.
- 카카오 동의항목별 수집 조건과 비즈 앱 요건, Entra ID 연동 세부, Cognito/Auth0/Okta/Ory/Zitadel 비교는 확인하지 못했다.
- Keycloak Organizations의 GA 여부와 Spring AS의 조직 모델 대체 가능성은 확인하지 못했다.

---

## 5. 한국 개인정보 구현

### Takeaway
- [사실] 「개인정보의 안전성 확보조치 기준」 현행 표시는 개인정보보호위원회고시 제2026-9호(2026-07-01 일부개정·시행)다. 조문 본문은 이번에 못 읽었고(국가법령정보센터 페이지는 본문 탭이 렌더링되지 않았다), 2025-10-31 시행 개정까지는 제3자 해설과 위키로 맞췄다. 제2026-9호가 무엇을 바꿨는지는 [미확인]이다.
- [사실] 접속기록 점검 "월 1회"는 2025-10-31 개정으로 폐지되어 내부관리계획 위임으로 바뀌었다.
- [판단] 구현 설계는 "원문 대조 전 잠정"으로 두고, 포트폴리오에는 조문 번호보다 통제 항목을 적는다.

### Cited Findings (고시)
- [사실] 법령 정보: 개인정보보호위원회고시 제2026-9호, 2026-07-01 일부개정, 시행 2026-07-01. — 직접(메타데이터만) [국가법령정보센터](https://www.law.go.kr/LSW/admRulInfoP.do?admRulSeq=2100000281400)
- [사실] 같은 고시의 부칙에 "제15조제5호와 제18조는 2027년 1월 1일부터 시행"이 있다고 검색 요약이 전한다. 조문 내용은 확인하지 못했다. — 검색요약 [국가법령정보센터 행정규칙](https://law.go.kr/LSW/admRulLsInfoP.do?admRulId=73493&efYd=0) [미확인: 내용]
- [사실] 2025-07-21 일부개정, 2025-10-31 시행: 접속기록 보관 대상이 "개인정보취급자"에서 "개인정보처리시스템에 접속한 자(정보주체 제외)"로 확대(제8조 제1항). 접속기록 점검은 "월 1회 이상" 고정에서 점검 주기·방법·사후조치 절차를 내부관리계획으로 정하는 방식으로 변경(제8조 제2항). 외부 접속 시 안전한 인증수단 적용 대상이 "정당한 접근권한을 가진 자(정보주체 제외)"로 확대(제6조 제2항). 접근권한 차등 부여 대상이 "업무수행자"로, 반복 인증 실패 시 접근 제한 대상이 "접근하는 모든 자"로 확대(제5조). 내부관리계획 항목에 출력·복사 시 안전조치와 파기가 추가(제4조). 인터넷망 차단은 위험분석에 따라 완화(전년도 말 직전 3개월 일일평균 이용자 100만 명 이상 대규모 처리자 대상). "내부관리계획 등 준비가 필요한 사항은 발령일로부터 1년 후 시행"이라는 문구도 있으나 이 개정의 어떤 조항이 해당하는지, 정확한 날짜 계산은 [미확인]. 해설 페이지에 "다중인증"이라는 단어는 직접 나오지 않는다. — 직접 [Kim & Chang 해설](https://www.kimchang.com/ko/insights/detail.kc?sch_section=4&idx=33291)
- [사실, 제3자] 제8조 요약(2025-10-31 개정분 반영, 위키 최종 수정 2026-10-17): 접속기록 1년 이상 보관, 2년 이상: ① 5만 명 이상 정보주체의 개인정보를 처리하는 시스템, ② 고유식별정보 또는 민감정보를 처리하는 시스템, ③ 전기통신사업법에 따른 기간통신사업자. 점검 주기는 숫자가 현행 조문에 없다. 위·변조·도난·분실 방지 조치 의무. 접근 권한 부여·변경·말소 기록 3년(최소)은 제8조가 아니라 제5조 제3항이라고 같은 페이지가 적었다. — 제3자 [itwiki 제8조](https://itwiki.kr/w/개인정보의 안전성 확보조치 기준 제8조). 이 위키는 2026-9호(2026-07-01) 개정을 반영했는지 알 수 없다.
- [사실, 제3자, 상충] 같은 위키의 개요 페이지 요약은 "접속기록 1년 이상 보관, 월 1회 점검"이라 적고 제5조에서는 3년 보관 문구를 찾지 못했다고 했다. 이 개요 페이지는 개정 전 문구가 남은 듯하며 위 제8조 페이지, Kim & Chang 해설과 충돌한다. 신뢰는 해설과 제8조 페이지 쪽에 둔다. — 제3자 [itwiki 개요](https://itwiki.kr/w/개인정보의 안전성 확보조치 기준)
- [사실, 제3자] 제7조 요약: 고유식별정보·비밀번호·바이오정보를 전송·저장(DMZ, 단말) 시 암호화, 비밀번호는 일방향 암호화, 안전한 알고리즘과 키 관리. 제13조: 파기는 복원 불가 방법. 알고리즘·키 길이 명시는 요약에 없다. — 제3자 (itwiki 개요, 같은 URL)
- [사실] 허브 문서 7절은 이 고시 제8조를 "접속기록을 민감정보 시스템으로 보고 2년 이상"으로 인용한다. 위 제3자 요약과 방향이 같다. 그 허브 줄이 "서브에이전트 조사값"이라고 적은 점은 그대로다.

### Cited Findings (법: 주민등록번호·파기·분리 보관)
- [사실, 제3자] 개인정보 보호법 제24조의2: 원칙적으로 주민등록번호 처리 금지, 예외는 법령이 구체적으로 처리를 요구·허용한 경우, 급박한 생명·신체·재산 보호, 행정안전부령이 정한 불가피한 경우. 제2항은 주민등록번호를 암호화해 보관하도록 하고 적용 대상과 시기는 대통령령에 위임. 위키는 이 조항이 2026-03-10까지 개정됐고 시행일이 2026-09-11로 표기되어 있다고 하나 공식 확인 못 함. — 검색요약+제3자 [itwiki 제24조의2](https://itwiki.kr/w/개인정보 보호법 제24조의2)
- [사실, 검색요약] 시행령은 2026-09-10 일부개정(시행 2026-09-11)이라는 검색 요약이 있다. 공식 확인 못 함. — 검색요약 (안전성 확보조치 검색 결과 중 요약)
- [사실, 제3자] 제21조: 보유기간 경과·목적 달성 시 지체 없이 파기, 다른 법령에 따라 보존해야 하면 분리하여 저장·관리. 시행령 제16조: 전자 파일은 복원 불가한 방법으로 영구 삭제, 영구 삭제가 현저히 곤란하면 익명처리 등. — 제3자 [korea.legal 제21조](https://korea.legal/wiki/%ea%b0%9c%ec%9d%b8%ec%a0%95%eb%b3%b4-%eb%b3%b4%ed%98%b8%eb%b2%95-%ec%a0%9c21%ec%a1%b0/), 검색요약 (교육청 지침 PDF 포함)
- [미확인] 세금계산서·임대차·입주 계약이 주민등록번호 처리를 구체적으로 요구하는 법령 조항은 찾지 못했다.
- [미확인] 정보주체 열람(제35조)·정정(제36조)의 기한과 절차는 이번에 확인하지 못했다.

### Cited Findings (암호화·마스킹·감사 변조 방지)
- [사실] AWS Encryption SDK: 메시지마다 고유 데이터 키를 만들고 래핑 키(KMS 포함)로 감싸는 봉투 암호화. 기본 알고리즘 스위트는 AES-GCM + HKDF + 키 커밋먼트 + ECDSA 서명 + 256비트 키. 암호화 컨텍스트는 비밀이 아닌 AAD로 메시지 헤더에 평문으로 들어가고 KMS를 쓰면 CloudTrail 같은 로그에도 평문으로 보일 수 있다. 하나의 데이터 키를 여러 래핑 키로 감쌀 수 있다. 계층형(Hierarchical) 키링 등은 암호화자와 복호화자를 구분하지 못해서 서명이 암호학적 가치가 없다. — 직접 [Encryption SDK 개념](https://docs.aws.amazon.com/encryption-sdk/latest/developer-guide/concepts.html)
- [사실] AWS Database Encryption SDK의 검색 가능 암호화는 비콘(beacon: 잘린 HMAC 태그)으로 동등 검색(표준 비콘)과 복합 검색을 지원한다. 문서 범위는 DynamoDB이고 계층형 키링이 필요하다. 잘림·분할로 빈도 분석을 줄이며 대신 쿼리 팬아웃이 늘어난다. PostgreSQL/Aurora 지원 여부는 확인하지 못했다. — 검색요약 [Beacons](https://docs.aws.amazon.com/database-encryption-sdk/latest/devguide/beacons.html)
- [사실] S3 Object Lock: WORM 모델, 버저닝 필수, 객체 버전 단위로 적용. 규정 준수(compliance) 모드는 루트 포함 누구도 보존 기간 중 삭제·덮어쓰기·기간 단축이 불가하고, 기간 전 삭제는 계정을 삭제하는 방법뿐이다. 거버넌스 모드는 `s3:BypassGovernanceRetention` 권한자가 해제할 수 있다. 법적 보존(legal hold)은 만료가 없다. 보존 기간은 연장만 가능하다. AWS 문서는 Cohasset Associates가 SEC 17a-4 등 환경에 대해 평가했다고 적었다(AWS 문서 서술). — 직접 [S3 Object Lock](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock.html)

### Inferences
- [추정] 서비스가 입주자 건강·돌봄 정보를 다루면 허브 문서가 이미 접속기록 2년 이상 판단을 두었으므로, 접속기록 보존은 2년을 하한으로 잡고 내부관리계획에 점검 주기·담당·사후조치를 명시하는 구조가 안전하다. 해당 여부 판단은 법률 검토 대상이다.
- [판단] 컬럼 암호화는 **애플리케이션 계층 봉투 암호화**(KMS + 데이터 키, 암호화 컨텍스트에 `party_id`·컬럼명 포함)를 쓰고 `pgcrypto`는 쓰지 않는다. 이유: SQL 문장에 평문이나 키가 실려 로그·`pg_stat_statements`에 남을 수 있다는 위험이 있기 때문이나, 이 위험을 직접 검증한 자료는 이번에 찾지 못했다. `pgcrypto`는 이번에 조사하지 않았다 [미확인].
- [판단] 검색이 필요한 필드(전화번호, 이름 일부)는 블라인드 인덱스: 정규화한 값의 HMAC-SHA256을 별도 키로 계산해 별도 컬럼에 저장하고 동등 검색만 허용한다. AWS 비콘 문서가 설명하는 빈도 분석 위험(같은 값이 같은 태그)을 줄이려고 잘라서(truncation) 충돌을 허용하는 방식을 따르되, 검색 정확도와의 교환이다. 부분 일치·접두 검색은 포기한다. 이 키를 KMS의 MAC 생성 기능으로 만들 수 있는지는 이번에 확인하지 못했다 [미확인].
- [판단] 주민등록번호는 **수집하지 않는 것을 기본**으로 하고, 법령상 필요한 경우만 별도 테이블(별도 역할, 별도 키, 열람 시 사유 필수)에 둔다. 시니어 주거에서 법적으로 요구되는 경우의 목록은 확인하지 못했다.
- [판단] 파기와 분리 보관: 각 개인정보 컬럼에 "목적 종료일"을 연결한 보존 정책 테이블(`retention_policy(data_class, basis, period)`)과 파기 배치를 두고, 법령상 보존 대상은 별도 스키마로 옮겨 일반 업무 역할의 접근을 끊는다. 암호화한 데이터는 데이터 키 폐기로 복원 불가 상태를 만들 수 있다는 점이 장점이나, 이것이 "복원 불가 파기" 요건을 충족하는지는 해석이 필요하다 [추정].
- [판단] 감사 변조 방지 3단: (1) DB의 `audit_log`는 `INSERT`만 허용(UPDATE/DELETE 권한·트리거 차단), (2) 행마다 이전 해시를 포함한 해시 체인을 사이트별로 저장, (3) 정기 배치로 S3 Object Lock(compliance)에 내보낸다. 해시 체인에 대한 출처는 이번에 찾지 못한 설계안이다. Object Lock은 기간 단축이 불가하므로 보존기간을 법정 하한+여유로 정하고, 로그 본문에 평문 개인정보를 넣지 않아야 파기 의무와 충돌하지 않는다 [추정].
- [판단] 화면·로그 마스킹: 기본 마스킹 + 열람 사유를 쓴 뒤 일정 시간 해제 + 해제 이벤트를 감사 로그에 기록. 로그에는 식별자(ID)만 남기고 값은 남기지 않는다.

### Gaps
- 안전성 확보조치 기준 제2026-9호 개정 내용, 부칙의 2027-01-01 시행 조항(제15조제5호, 제18조) 내용, 각 조의 현행 조문번호와 항은 국가법령정보센터 본문 또는 개인정보보호위원회 해설서로 확인해야 한다.
- 제5조 권한 부여 기록 3년의 현행 조문 위치는 제3자 위키 하나로만 확인했다.
- 민감정보 규정(법 제23조)과 시니어 주거 맥락의 적용, 정보주체 열람·정정 절차의 기한은 이번에 확인하지 못했다.
- 다중인증(MFA)이 요구되는 정확한 대상은 확인하지 못했다. 해설은 "안전한 인증수단"이라고 표현한다.
- 한국 맥락에서 AWS Encryption SDK/KMS를 쓰는 사례, 토스·우아한형제들의 암호화·마스킹 공개 글은 찾지 못했다.

---

## 설계 지점 요약표

| 설계 지점 | 후보 | 고른다면 무엇 [판단] | 이유 | 대가 | 근거 수준 |
|---|---|---|---|---|---|
| 격리 경계(테넌트) | 운영사 / 사업장 / 소유주 / 사업장 DB 분리 | 운영사 1 + `site_id` 스코프 + 소유주는 읽기 스코프 | 수탁 운영이라 소유주는 데이터 생산자가 아님. 소유 지분·기간 변경을 다루기 쉬움 | 소유주별 키·지역 분리 요구가 오면 bridge 이행 필요 | 모델은 직접(AWS·Azure), 소유주 판단은 추정 |
| 스코프 모델 | 역할×사이트×기간 테이블 / ReBAC 엔진 | `role_assignment(scope_type, scope_id, valid_at)` + 허용 site_id 배열로 환원 | 직원·지역 매니저·소유주가 모두 "허용 사이트 집합"으로 풀림 | 소유주 지분 비율 같은 세밀 권한은 별도 규칙 필요 | 설계 판단, 근거 약함 |
| RLS 변수 주입(Spring) | `@TenantId` / 커넥션 래퍼 / 트랜잭션 후크 / jOOQ 리스너 | 트랜잭션 시작 후크 한 곳에서 `set_config(…, true)`, 변수 없으면 0행 | 허브 결정과 일치, 누락 시 안전 쪽으로 실패 | 어느 후크가 안전한지 스파이크 필요 | `@TenantId` 한계는 제3자·검색요약, 후크는 [미확인] |
| 풀러 | Hikari만 / RDS Proxy / PgBouncer | 처음엔 Hikari만, 도입 시 pinning 실측 | RDS Proxy는 SET·set_config를 pinning 사유로 문서화, PgBouncer 트랜잭션 모드는 SET 미지원 | 연결 수가 늘면 풀러 재검토 | RDS 검색요약, PgBouncer 직접. 트랜잭션 로컬 동작 [미확인] |
| 비동기 워커 | 이벤트에 스코프 실어 `runAs` / BYPASSRLS 워커 | 아웃박스에 `site_id`·`actor_id` 저장 + `ScopeRunner.runAs` 한 입구, 배치는 사이트별 분할 | 허브 8절 3번의 빈칸을 메움. 이중 방어 유지 | 크로스사이트 집계는 별도 읽기 역할·뷰 필요 | 제3자(비동기에서 컨텍스트 소실)+판단 |
| RLS 성능·테스트 | 정책 내 서브쿼리 / 변수 배열 비교 | `site_id = ANY(변수)`를 `(select …)`로 감싸고 `(site_id, …)` 인덱스, 앱 역할 CI 단언 | PG 문서의 서브쿼리 경쟁 조건 경고, Supabase·Bytebase 지침 | 실제 이득은 EXPLAIN으로만 확인 가능 | PG 직접, 나머지 직접(벤더·블로그) |
| 공통 코어 + 자산별 규칙 | 계약 유형 전략 / 테이블 상속 / JSONB 전부 / EAV | 계약 유형 전략 코드 + 사이트 설정 테이블 + 소수 확장 테이블 + 선택 속성만 JSONB | 유형별 차이를 4가지로 좁히면 코드가 작음. Azure도 전용 테이블·설정 권고 | 유형이 늘면 전략 클래스 증가 | Azure 직접, 나머지 판단 |
| 이중 예약 방지 | `EXCLUDE` + `tstzrange`/`daterange` / `WITHOUT OVERLAPS` PK / 앱 락 | `EXCLUDE USING gist … WHERE (state IN ('held','active'))` | 취소건 제외가 필요. `WITHOUT OVERLAPS` 문법에 `WHERE`가 없음 | `btree_gist` 확장, GiST 인덱스 비용 | PG 18 직접. `WHERE` 제약 한계는 추정 |
| 시간 모델 | PG 18 `WITHOUT OVERLAPS`/`PERIOD` / 이력 테이블 / 이중시간 | 유효기간은 `WITHOUT OVERLAPS`, 정정 이력은 별도 이력 테이블 | 겹침을 DB가 막음. PERIOD FK는 NO ACTION만 | CASCADE 불가, 19의 `FOR PORTION OF`는 개발판 | PG 18 직접, PG 19 검색요약+제3자 |
| 사이트별 기능 | `site_feature` 테이블 / OpenFeature·Unleash·Togglz | 테이블로 시작 | 계약 범위 entitlement이지 배포 플래그가 아님 | 실험·점진 배포는 못 함 | 설계 판단, 도구 조사 안 함 |
| IdP | Spring AS(Security 7) / Keycloak / Cognito / Auth0·Okta / Ory / Zitadel | [미정] Spring AS와 Keycloak이 후보 | Spring AS는 Security 7로 통합 확인. Keycloak은 Organizations 있음 | 나머지는 비교 안 함 | Spring AS 직접, Keycloak 목차, 나머지 없음 |
| 인가 엔진 | 앱 테이블+RLS / OpenFGA / SpiceDB / Cerbos / Casbin / OPA | 앱 테이블+RLS로 시작, 필요 시 OpenFGA | 관계가 1단계, 엔진 도입 시 이중 정합성 위험 | 엔진 시연 없음 | OpenFGA·Cerbos·SpiceDB 직접, 적용 판단은 추정 |
| 보호자 위임 | `guardian_grant` 테이블 / ReBAC 튜플 | 범위·동의 참조·기간·철회를 가진 테이블 | 열람 범위별 동의를 분리 | 관계가 깊어지면 재설계 | 판단 |
| 파트너 토큰 | 사이트 범위 API 키 해시 / OAuth 클라이언트 | `api_client` 테이블(사이트 범위, 만료, 철회) | 철회가 컬럼 하나 | MCP 개방 시 OAuth 2.1로 확장(허브 결정) | 판단 (Mews·Cloudbeds 사례는 기존 기록) |
| 브레이크글래스 | 상시 관리자 / 사유+승인+만료 부여 | `break_glass_grant`(사유, 승인자, ≤4h) + 감사 로그 표시 | 제3자 관행 일치, 상시 그룹은 기각 | 지연, 알림 채널 장애 대비 필요 | 제3자·벤더 블로그, 수치는 단일 회사 사례 |
| 접속기록·감사 | DB 감사 테이블 / 해시 체인 / S3 Object Lock | DB 추가 전용 + 해시 체인 + Object Lock(compliance) 내보내기 | 변조 방지 3중. 보존 하한(2년) 이상 | 보존 기간 단축 불가, 로그에 평문 개인정보 금지 | S3 직접, 고시 제3자, 해시 체인은 판단 |
| 컬럼 암호화 | pgcrypto / 앱 봉투 암호화(KMS) / AWS DB Encryption SDK | 앱 봉투 암호화 + 암호화 컨텍스트 | 키가 DB 밖. 컨텍스트는 비밀 아니므로 PII 넣지 않음 | 서버 측 검색·정렬 불가 | Encryption SDK 직접, pgcrypto 미조사 |
| 검색 가능 암호화 | HMAC 블라인드 인덱스 / SDK 비콘 / 평문 | 정규화값 HMAC을 별도 키로 | 동등 검색만 필요 | 부분 일치 포기, 빈도 분석 위험(잘림으로 완화) | 비콘 개념 검색요약(DynamoDB), PG 지원 [미확인] |
| 주민등록번호 | 수집 안 함 / 필요 시 격리 저장 | 기본 미수집, 필요 시 별도 역할·키·사유 필수 | 법 제24조의2 원칙 금지(제3자 요약) | 필요 사례 확인 전 | 제3자, 계약·세금계산서 근거는 [미확인] |
| 파기·분리 보관 | 즉시 삭제 / 보존 정책 테이블+분리 스키마 | 보존 정책+파기 배치, 법정 보존분 분리 | 법 제21조 구조(제3자) | 키 폐기 파기의 충분성은 해석 필요 | 제3자 |
| 접속기록 점검 주기 | 월 1회 고정 / 내부관리계획 | 내부관리계획에 주기·담당·사후조치 명시(월 1회를 기본값으로 둠) | 현행 조문엔 숫자 없음. 보수적으로 둠 | 과잉 운영 부담 | Kim & Chang 직접 |

---

## 못 찾은 것

- 안전성 확보조치 기준 **제2026-9호(2026-07-01)** 의 변경 조문과 신구 대조. 부칙의 2027-01-01 시행 조항(제15조제5호, 제18조) 내용. 국가법령정보센터 본문 탭이 렌더링되지 않았다(`law.go.kr` OPEN API는 서버 IP 등록이 필요해 호출 실패).
- 같은 고시 현행 본문의 접근 권한 기록 3년(제5조 제3항), 다중인증 요건, 암호화 대상의 정확한 조문 문구. 제3자 요약만 확보.
- 개인정보 보호법 제35조(열람)·제36조(정정·삭제)의 기한과 절차, 제23조(민감정보) 시니어 주거 적용, 주민등록번호 처리를 요구하는 계약·세금계산서 근거 조항, 법·시행령 2026 개정의 시행일 공식 확인.
- RDS Proxy에서 `set_config(…, true)` / `SET LOCAL`의 pinning 여부, PgBouncer 트랜잭션 모드의 `SET LOCAL` 공식 문구, Hibernate `@TenantId`의 네이티브 쿼리·PK 로드 공식 동작(24장 본문), jOOQ·`AbstractRoutingDataSource`·`TransactionSynchronization`으로 RLS 변수를 넣는 검증된 패턴.
- Mews 외 PMS(Apaleo, Yardi, Entrata, Oracle)의 멀티 property 접근 권한 모델, Yardi Voyager와 Senior Living Suite의 공유 코어 여부.
- OpenFeature, Unleash, Togglz, JSONB vs EAV, Casbin, OPA, Spring Security method security, Cognito, Auth0/Okta, Ory, Zitadel, Entra ID 연동 세부, 카카오 동의항목·비즈 앱 요건.
- `pgcrypto`와의 비교, KMS HMAC 기반 블라인드 인덱스 구현 가능성, AWS Database Encryption SDK의 PostgreSQL/Aurora 지원 여부, Hibernate `AttributeConverter` 패턴.
- 해시 체인 감사 로그의 공개 구현 사례, 브레이크글래스의 표준(NIST/ISO) 근거. 현재 확보한 건 벤더 블로그와 단일 회사 ADR뿐이다.
- Notion, Figma, Stripe, Shopify, Toss, 우아한형제들의 멀티테넌시·암호화·마스킹 엔지니어링 글.
- [지원 회사] 계열의 내부 보안 기준, [지원 회사]가 이미 쓰는 인증·권한 체계(허브 문서가 이미 [미확인]으로 둔 것과 같다).
