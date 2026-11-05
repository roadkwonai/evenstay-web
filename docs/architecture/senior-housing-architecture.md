# 시니어 하우징 아키텍처와 기술 스택
상태: 초안
작성: 2026-11-04
방법: `deep-research`, `competitor-analysis`
원문 요약은 `sources/arch-*.md` 10개(목록은 12절).
변경: 2026-11-04 허브 원문 대조로 토스 웹훅 서술 정정

앞선 문서(`00-hub/reviews/architecture-{options,landscape,staged}-2026-11-04.md`, `outputs/pms-landscape.md`)는 되풀이하지 않고 바뀌는 점과 그대로인 점만 적는다. 기준 결정(포트폴리오만, MVP 없음, 모듈형 모놀리스, Spring Boot 4.1 + Modulith, Next.js, PostgreSQL 18, AWS 서울)은 다시 열지 않는다. [사실]

표기: [사실] [추정] [가설] [미정] [미확인]. 근거 열은 직접(본문 열람) / 검색요약(요약만 봄) / 제3자(2차 자료). "회사 주장"은 벤더 자기 설명이다. 도구가 요약 중심이라 검색요약이 많다. 법령은 law.go.kr이 열리지 않아 미러(nepla.ai) 기준이고 원본 대조 전이다. 법적 결론은 내리지 않는다. [사실]

## 1. 결론

1. **건물 층(landscape 6절 a/b/c): (a)를 호출 안전 경로의 기본으로, (b)는 수집·기록용 얇은 어댑터로 한정, (c)는 2차 알림까지만.** [추정] (a) 호출 접수·표시가 건물 안에서 인터넷 없이 끝나는 구조가 근거 중상이다. UL 2560은 고정 위치의 중앙 수신 장소와 예비 전원을, VDE 0834는 호출 전용 독립망을 요구하는 방향이다(2012 백서와 업계단체 해설 기준. 규격 본문은 못 봤고, 열어 본 한국 규정은 경보장치 설치까지다). (b)는 중하다. 벤더가 단절 시 이벤트를 큐잉해 재전송한다는 서술을 하나도 못 찾았다. (c)는 반대 방향(약)이다. 한국은 호출 설비의 외부 출구가 공개되지 않아 (b)가 수집의 전제일 가능성이 있다. [가설]
2. **"벤더가 서명된 웹훅을 보낸다"는 가정은 한국에서 뒷받침되지 않는다.** 건물 설비·출입·센서 분야에서 공식 문서가 있는 유일한 국내 연동 면은 슈프리마 BioStar 2의 REST 조회와 WebSocket 샘플이고 웹훅 문서는 못 찾았다. 호출벨·월패드·센서·보안업체는 공개 연동 면이 없었다. [추정] "어댑터가 서명하고 벤더 연동은 계약·맞춤 가능성으로 표시"로 바꾼다. [가설]
3. **5분 넘김은 법정 요건으로 확인되지 않는다.** 노인복지법 시행규칙 별표 2·3 본문에서 호출·응답·24시간·당직은 검색 0건이고 설비는 경보장치 설치까지다(미러). [사실] 자체 SLA로 쓰고 설정값으로 둔다. [가설]
4. **업계 스택 증거는 B·C 등급뿐, A 등급(공식 기술글)은 0건이다.** 모듈형 모놀리스·멀티테넌트를 명시한 곳은 없다. [사실] 백엔드는 .NET, Java/Spring, Node, Python·Go, Elixir로 갈린다. [추정] Spring + Modulith는 업계 관행이 아니라 설계 선택으로 방어한다. [추정]
5. **도메인: 호텔·임대 PMS 골격을 재사용하되 동반 입주자, 평가 기반 변동 요금, 보증금·보증보험, 동반자 90일 퇴소 타이머, 설치자·위탁운영자 분리가 새로 필요하다.** [추정] 2026-10-13~11-23 입법예고가 미확정이라 상태기계는 설정으로 둔다. [사실][가설]
6. **결제는 CMS 중심 비동기 상태기계로, 고정식 가상계좌에 기대지 않는다.** ERP는 `LedgerExportBatch` 한 포트로 두되 그룹 ERP는 [미확인]이다. [추정]
7. **개인정보: Kim & Chang 해설은 2025-07-21 개정(2025-10-31 시행)이 접속기록 점검 주기를 내부관리계획에 맡겼다고 설명한다.** [사실] 이 조항의 시행 시점과 현행 고시 제2026-9호(2026-07-01)의 문구는 [미확인]이다. RLS 변수 주입은 풀러 고정(pinning) 실측이 필요하다. [추정]
8. **AI Agent: 이번 조사에서 확인한 운영 데이터용 공식 MCP 서버는 Apaleo(알파)와 Yardi(회사 주장, 본문 403)이고, 쓰기 승인 구조를 공개한 사례는 찾지 못했다.** MCP 현행판(2026-07-28)과 Spring AI의 Java SDK(2025-11-25판)가 어긋나므로 1단계에 외부 MCP를 열지 않는 현 설계를 유지한다. [사실][추정]

## 2. 공고 업무별 지도

기술 후보는 앞선 문서의 1단계 기준이고 [가설]이다. 공고의 기술 스택 항목은 비어 있다([원티드 392883](https://www.wanted.co.kr/wd/392883), 열람 2026-11-02). [사실]

| 주요업무 | 필요한 구조 | 기술 후보(1단계) | 근거 수준 | 절 |
|---|---|---|---|---|
| 핵심 도메인·데이터 모델 | 입소계약, 동반 입주자, 점유 기간, 변동 요금, 보증금 원장, 월 마감 | PG 18 `EXCLUDE`·`WITHOUT OVERLAPS`, 추가 전용 원장 | 법 직접(미러). 설계 [추정] | 4 |
| Multi-site | 운영사 → 사업장 → 호실, 소유주 읽기 스코프 | Modulith + RLS(`site_id`), `role_assignment` | AWS·Azure·PG 직접. 소유주 모델 [추정] | 5 |
| ERP | 확정 원장 → 내보내기 배치 | `LedgerExportBatch`, 어댑터 3형 | 해외 PMS 직접. 그룹 ERP [미확인] | 6.1 |
| 결제 | CMS·가상계좌·카드 비동기 상태기계, 대사 | PG·CMS 어댑터, JobRunr | CMS 기관 직접. 수수료 제3자 | 6.2 |
| CRM | 계약 확정 이벤트가 경계 | 외부 CRM + 읽기 참조, 알림톡 | 국내 시니어 사례 없음 | 6.3 |
| 출입통제 | 현장 어댑터가 조회·구독하고 서명 | 어댑터 + 아웃박스 | 슈프리마 직접. 나머지 [미확인] | 6.4 |
| IoT·호출 설비 | 호출은 현장 자립, 수집은 어댑터·버퍼 | API Gateway + SQS 또는 IoT Core MQTT | 해설 직접. 국내 벤더 검색요약 | 6.5, 6.6 |
| AI Agent | 읽기 자동, 쓰기는 제안 후 직원 승인 | Spring AI 2.0, Bedrock 서울 | 스펙 직접. 승인 설계 [추정] | 6.7 |
| 개인정보·RBAC | 동의, 대리권, 접속기록, 암호화 | 앱 봉투 암호화(KMS), `guardian_grant` | 고시 제3자. AWS 직접 | 7 |
| Cloud·CI/CD·모니터링 | 계정 분리, 배포, 안전 경로 감시 | GitHub OIDC, ECS, OpenTofu, CloudWatch | 문서·가격표 직접 | 8 |

## 3. 업계는 어떻게 구성되어 있나

### 3.1 플랫폼·일본·한국

[추정] 해외는 케어 중심 + 파트너 마켓(PCC, MatrixCare)과 운영·재무까지 묶으려는 제품군(Yardi, Eldermark, ALIS, Aline, August)으로 갈린다. 개방은 파트너 계약 → 시설 단위 승인 → 범위 있는 OAuth → 이벤트 구독의 승인제다. "단일 플랫폼"은 모두 회사 주장이다.

| 구분 | 호스팅·테넌시 | API·표준 | 설비 연동 | 가족 앱 | 근거 |
|---|---|---|---|---|---|
| Yardi | SaaS·자사 데이터센터(2011 [3년+]). 테넌시 [미확인] | HL7 ADT 13종·FHIR 자기신고([CAST](https://leadingage.org/wp-content/uploads/2026/05/2026-CAST-EHR-Selection-Matrix-Participating-Vendor-Self-Review_MASTER.xlsx)). Voyager API는 출처 상충 | SafelyYou 단방향 유입 | [미확인] | 직접(CAST). 공식 페이지 403 |
| PointClickCare | SaaS. 테넌시 [미확인] | FHIR R4 읽기, 시설별 LOA, 앱·시설당 월 $65([Nirmitee](https://nirmitee.io/blog/pointclickcare-api-integration-guide/)). CAST는 FHIR "아니오"로 충돌 | Securitas Arial(검색요약) | 입주자 동의 + 직원 부여 | 제3자·직접 |
| MatrixCare | Azure, "고객 인스턴스"([2017 백서](https://go.matrixcare.com/rs/227-DAM-058/images/MatrixCare-Commitment-to-Interoperability.pdf) [3년+]) | 통합 엔진 + Public API | 파트너 | [미확인] | 직접 |
| Eldermark | SaaS·호스팅·로컬. SOC 2 "아니오"(자기신고) | Integrator API 2026.1: OAuth client credentials, 웹훅 + HMAC, 조직·커뮤니티 스코프([헬프데스크 첨부](https://helpdesk.eldermark.com/hc/en-us/article_attachments/46210015805851), 제목에 Internal, 공개 여부 불명) | 자체 Notify | 내보내기 "아니오" | 직접 |
| ALIS·August·Aline | 서술 없음 | 공개 API 서술 없음 | 제휴 발표 수준 | 불명 | 직접. 낮음 |
| 일본 | — | 너스콜은 IHE PCD ACM(HL7 v2) 기반, 개호 센서는 2022년 제안 단계([NTT 보고서](https://www.amed.go.jp/content/000098072.pdf) 2022-03 [3년+]) | 너스콜 親機가 알람 허브 | [미확인] | 직접. 벤더 검색요약 |
| 한국 | 운영사 내부 [미확인] | 공개 API 없음(슈프리마 제외) | 폐쇄 유선 버스 + 수신반 | [미확인] | 검색요약·회사 주장 |

- [사실] 테넌시를 공식 문서로 확인한 제품은 없고, 소유주 대 운영사 보고 구조의 서술도 못 찾았다.
- [추정] 일본 사례는 간호 중심 시설에 치우쳐 있어 독립생활형 한국 레지던스에 그대로 옮기면 과설계가 된다.
- [미확인] 한국 대형 운영사(삼성노블카운티, 더시그넘하우스, KB골든라이프케어 등)의 설비·SI. 나라장터는 직접 조회하지 못했다.

### 3.2 실제 기술 스택 증거

**A 등급은 0건이고 전부 B(채용 공고)·C(제3자)다.** 공고는 그 팀의 스택만 증명한다. [사실]

| 회사 | 확인된 스택 | 등급·열람 | 패턴 |
|---|---|---|---|
| PointClickCare | Java, Spring Boot, 마이크로서비스, Kubernetes, Kafka, PostgreSQL·MySQL·MSSQL, Azure(일부 AWS) | B, 열람([MySQL 공고](https://jobs.lever.co/pointclickcare/dccd4d74-0d2e-42cb-b999-464853e0a2d1), [PostgreSQL 공고](https://builtintoronto.com/job/principal-software-engineer/8481356)) | Spring + PostgreSQL이 함께 나온 유일한 곳 |
| ALIS, Inspiren | C#·SQL Server·Azure 우대 / TypeScript·Node·AWS 서버리스·PostgreSQL | B, 열람 | .NET, 서버리스 혼합 |
| Mews·AppFolio(인접) | .NET + Azure / Rails + MySQL + AWS | B, 검색요약 | 언어 분산 |
| MGRV(한국 코리빙) | Python(FastAPI·Django) + PostgreSQL. 다른 공고는 Java·Kotlin·Next.js | B, 열람([공고](https://www.wanted.co.kr/wd/374348)) | 한국에서 PMS를 공고에 명시한 유일한 곳 |
| SafelyYou·Honor·Papa | Go·Python / Python·MySQL·AWS / Elixir | B, 검색요약 | 언어 분산 |
| 케어닥 | Next.js, Node, Go, MariaDB, GCP | C, 접근 실패([StackShare](https://stackshare.io/companies/caredoc)) | 등록 시점 불명 |
| 야놀자·산하IT, 한국 운영사, [지원 회사] 계열 | 스택 근거 없음. 야놀자 EKS 주장은 근거 기사에 없음 | — | — |

- [사실] 확인된 곳은 거의 모두 클라우드(Azure 또는 AWS)를 쓰고 온프레미스를 명시한 곳은 없다. AWS 서울 사용을 직접 밝힌 근거는 없다. Next.js는 한국 사례에서만 나왔다.
- [추정] 이 증거로 Spring을 업계 표준이라 주장할 수 없다. 한국 언어별 공고 수는 여전히 [미확인]이다.

## 4. 핵심 도메인·데이터 모델

### 4.1 호텔·임대 PMS와 다른 점

[추정] 호텔의 폴리오·계정과 임대의 리스·원장·오너 명세서는 재사용한다. 호텔의 박 단위 재고와 예약 시점 고정 요금은 평가 기반 변동 요금에 맞지 않고, 야간감사 대신 월 정산 마감이 필요하다.

| 요구 | 호텔 | 임대 | 시니어 하우징 |
|---|---|---|---|
| 점유 단위 | 박·재고 | 리스 1:1 호실 | 호실 + 입소자격자 + 동반 입주자(법 제33조의2) |
| 요금 | 예약 시점 고정 | 고정 월세 + 부가 | 평가 포인트로 월마다 변동, 30일 서면 통지([Bayview 2026](https://www.bayviewseattle.org/wp-content/uploads/2026/01/Bayview-Assisted-Living-Pricing-2026-1.pdf), 직접, 미국) |
| 입원·부재·사망 | 노쇼 | 공실에도 임대료 | 입원 중 청구는 법령이 아니라 계약 사항으로 보임 [추정]. 사망 시 위약금 감면·반환 대상·동반자 퇴소 기한 |

[사실] 혼합 포트폴리오(시니어 + 임대 + 숙박)를 한 PMS로 운영하는 사례의 공식 문서는 못 찾았다.

### 4.2 법이 만드는 상태기계 (미러 기준, 원본 대조 전)

[사실] 노인복지법 시행 2026.10.02(법률 제22020호, 2026.09.29 개정, 내용 [미확인]), 시행규칙 시행 2025.12.29, 별표 2는 `<개정 2019.9.27.>`, 별표 3은 `<개정 2021.6.30.>` 표기다. 출처: [법](https://www.nepla.ai/law/노인복지법), [시행규칙](https://www.nepla.ai/law/노인복지법-시행규칙), [별표 2](https://www.nepla.ai/api/law-file?flSeq=159739753&ext=pdf), [별표 3](https://www.nepla.ai/api/law-file?flSeq=159739769&ext=pdf), 직접(미러).

| 조문이 말하는 바 [사실] | 모델에 주는 것 [추정] |
|---|---|
| 60세 이상, 독립 주거생활 가능(시행규칙 제14조). 배우자와 부양 책임 24세 미만 자녀·손자녀는 동반 입소 가능(법 제33조의2 ①) | 자격자·동반자 구분 |
| 입소는 임대차계약. 정원 초과 시 순위. 계약 불가 사유가 인정되면 부양의무자가 당사자가 될 수 있음(시행규칙 제15조 ⑥⑦) | 대리 계약 주체 |
| 재임대 금지, 위탁운영 허용(법 ③⑥). 위탁 가능자는 전담인력·조직을 갖춘 법인(시행령 제20조의3, 2025.5.20 전문개정) | Owner와 Operator 분리가 전제 |
| 자격자가 사망하거나 거주하지 않으면 동반자는 90일 안에 퇴소. 90일 미만 해외 체류·입원은 예외(법 ⑦, 시행규칙 제17조의2) | 동반자 타이머. 입원 중 요금 규칙이 아님 |
| 임대형은 보증금 수납일부터 10일 안에 보증보험, 금액은 보증금 합계의 50% 이상(별표 2 2.다). 퇴소 시 지체 없이 반환(별표 3 4.나) | 보증보험·반환 타임라인을 1급 객체로 |
| 입소비용은 본인 전액 부담(시행규칙 제15조의2). 회계 분리와 운영일지·입소자 관리카드(별표 3 5·6) | payor 구분, 법정 장부 산출 |

- [사실] 한국소비자원 2016 조사 보도: 임대형 실버타운 17곳 중 14곳에 입주 전 위약금 면제·감면 규정이 없었다([경향신문](https://www.khan.co.kr/article/201603161200011), 검색요약, [3년+]).
- **입법예고 중**: [사실: 보도 기준] 복지부가 시행규칙 개정안을 2026-10-13~11-23 입법예고했다. 65세 이상 입소자가 장기요양급여 등 서비스로 독립생활을 유지하면 계속 거주 허용, 입소자 과반 서면동의와 지자체 승인으로 입소자대표회의 구성, 위탁운영자 선정·변경 신고다([SBS Biz](https://biz.sbs.co.kr/amp/article/20000339428), [매일신문](https://www.imaeil.com/page/view/2026101215574176948), 2026-10-12, 직접). 매일신문은 운영 주체가 없어지면 대표회의가 위탁사 선정 등을 제한적으로 대행한다고도 보도했다. 원문과 확정·시행일은 [미확인]이다.
- [미확인] 입법예고 원문, 확정 여부, 시행일. 기사 간 시행 시점과 "중간집" 서술이 다르다.
- [추정] 확정되면 한 입소자 계정에 민간 월 이용료와 재가급여가 공존하고, 대표회의용 관리비 명세 리포트와 위탁 변경 시 데이터 이관이 PMS 이벤트가 된다. [가설] 요건과 전이는 코드에 박지 않고 정책 버전·설정으로 둔다.

## 5. Multi-site·다자산 구조

- [사실] AWS는 공유 풀 PostgreSQL에서 RLS를 필수로 보고 앱이 세션 변수를 넣는 방식을 권한다([AWS](https://docs.aws.amazon.com/prescriptive-guidance/latest/saas-multitenant-managed-postgresql/rls.html), 직접). Azure는 RLS가 복잡해 많은 곳이 쓰지 않는다고 경고하고, 테넌트별 키·백업·지역 분리가 필요하면 격리 쪽을 권한다([Azure 2026-08-21](https://learn.microsoft.com/en-us/azure/architecture/guide/multitenant/approaches/storage-data), 직접).
- [가설] 격리 경계는 운영사 1개, 사업장은 모든 테이블의 스코프 축, 소유주는 읽기·리포트 스코프다. 수탁 운영이라 소유주는 데이터 생산자가 아니라 일부 사업장 집계를 읽는 이용자다. 소유 관계는 `site_ownership(site_id, owner_id, share, 유효기간)`에 기간 겹침 금지를 건다. [추정]
- [가설] 직원·지역 매니저·소유주·보호자를 `role_assignment(principal, role, scope_type, scope_id, 유효기간)`로 두고 "허용 site_id 배열"로 풀어 RLS 변수에 넣는다. 관계가 1단계라 외부 정책 엔진은 이득이 작고 DB와의 정합성 위험이 새로 생긴다. [추정]
- [사실] RDS Proxy는 PostgreSQL `SET`·`set_config`를 세션 고정 사유로 문서화한다([AWS](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/rds-proxy-pinning.html), 검색요약). PgBouncer 트랜잭션 모드는 `SET/RESET`을 지원하지 않는다([PgBouncer](https://www.pgbouncer.org/features.html), 직접). 트랜잭션 로컬 `set_config(…, true)`의 고정 여부와 Spring에서의 검증된 주입 후크는 [미확인]이다. [가설] 처음엔 앱 풀만 쓰고, 한 곳에서 주입하되 변수가 없으면 0행이 나오게 하는 소형 검증을 둔다.
- [가설] 비동기 워커는 아웃박스에 `site_id`·`actor_id`를 저장하고 단일 입구(`runAs`)로만 DB에 접근하며 일일 배치는 사업장별로 쪼갠다.
- [사실] PG 18은 `WITHOUT OVERLAPS`와 `PERIOD` 외래 키를 제공한다([문서](https://www.postgresql.org/docs/18/sql-createtable.html), 직접). [추정] 취소 건을 제외해야 하는 이중 점유 방지는 `WHERE`를 줄 수 있는 `EXCLUDE USING gist`가 맞다.
- [가설] 자산 유형은 계약 유형 전략(`RESIDENCY`·`LEASE`·`STAY`)과 사업장 설정 테이블로 나눈다. 차이는 청구 주기·상태 전이·필수 서류·점유 단위 네 가지로 좁힌다. 공식 비교 자료는 없다. [추정]

## 6. 외부 연동

### 6.1 ERP

- [미확인] [지원 회사]의 ERP 제품. 국내 ERP(더존·영림원)의 공개 연동 문서도 못 찾았다.
- [사실] 더존 I-U 연동은 중계 Agent가 자동전표 테이블에 넣는 방식이다([비즈플레이](https://docs.bizplay.co.kr/system_if/erp-2), 제3자). Mews는 불변 `LedgerEntry`를 계정 코드로 내보내고 정정은 현재 기간의 새 항목으로 낸다([Mews](https://docs.mews.com/connector-api/operations/_export-types), 직접). SAP Journal Entry Post API는 중복 검사를 하지 않는다([SAP KB](https://userapps.support.sap.com/sap/support/knowledge/en/3687026), 직접).
- [가설] 코어는 확정 원장을 `LedgerExportBatch`(기간, 버전, 상태, 라인)로 묶는 포트 하나만 안다. 어댑터가 자동전표 적재·파일·REST 중 하나를 맡고, 배치 ID·라인 번호를 외부 참조로 넣어 ERP에 이미 있는지 먼저 조회한다. 상태는 `DRAFT → SENT → ACKED → REJECTED(기간 마감)`이고 요약·건별 전표 중 정본은 [미정]이다.

### 6.2 결제

- [사실] 금융결제원 CMS 이용기관 심사: 월 출금한도 최소 5백만 원 이상, 개인사업자 3천만 원·법인 5천만 원 한도 안에서 설정(초과는 사전 협의), 건당 한도는 월 한도의 10% 이내, 신규 기관은 1년간 보증 가입금액이 월 한도의 100%다([기관 공식](https://www.cmsedi.or.kr/cms/apply/manual/new/decision), 직접). 출금 동의는 서면(전자문서 포함)·녹취·ARS이고 이용기관 직접 접수도 가능하다.
- [추정] 법인 월 한도 5천만 원이면 건당 최대 500만 원이라, 입주자 수십 명이 월 수백만 원을 내면 월 한도를 넘어 협의 대상이 된다. 입주금 수억 원은 건당 한도에 맞지 않는다. 한도 상향 가능 여부는 [미확인]이다.
- [사실] CMS 건당 수수료(약 200~250원)는 경쟁 정산 서비스 블로그에서만 확인된다([포트원 2026-09-03](https://blog.portone.io/cms-vs-card-billing), 제3자). [가설] 카드 3.20%를 가정하면 월 300만 원 1건당 약 9.6만 원이다(계약별 요율 [미확인]).
- [가설] CMS는 건별 `requestPayment`와 모양이 다르다. `DirectDebitMandate`(동의 방식·증빙·상태), 출금 의뢰 배치, 하루 이상 뒤 확정되는 결과, 영업일 보정이 필요해 `PENDING_BANK_RESULT`가 있는 비동기 상태기계가 된다. 시니어 동의는 보호자 대행·직원 입회와 함께 가고 증빙 보관 책임은 운영사에 있다. [추정]
- [사실] 토스페이먼츠 웹훅은 200이 아니면 최대 7회, 1·4·16·64·256·1024·4096분 간격으로 재전송한다(합계 약 3.8일은 노트의 계산, [문서](https://docs.tosspayments.com/en/webhooks), 직접). [이벤트 문서](https://docs.tosspayments.com/reference/using-api/webhook-events)(직접)는 `tosspayments-webhook-signature`를 공통 헤더로 설명한다. 이벤트별 유무는 이 문서로 알 수 없다 [미확인]. `secret` 비교를 적은 이벤트는 입금 웹훅(`DEPOSIT_CALLBACK`)뿐이고, 상태 변경 웹훅(`PAYMENT_STATUS_CHANGED`)에는 `eventId`가 없다. 문서는 본문에 `eventId`가 있으면 그 값으로 중복을 처리하라고 하지만, 없는 웹훅의 대체 키는 제시하지 않는다. [가설] `eventId`가 없는 웹훅은 `transactionKey`+`orderId`를 멱등 키 후보로 둔다(문서 권장 값이 아니다). [추정] 조회·정산 파일 대사가 필수다.
- [사실] 금감원이 2026-04-29 PG 가상계좌 재판매 기준을 발표해 고정식 발급을 제한된 경우로 한정한다고 보도됐다([기사](https://sateconomy.co.kr/news/view/1065588652345914), 검색요약, 시행일 [미확인]). [추정] 입주자별 고정 계좌 대신 `ExpectedPayment` 1건에 일반식 계좌 1개를 매칭하고, 예상 수납 → PG·CMS 결과 → 은행 입금 → 원장 확정의 3자 대사로 둔다. 전자세금계산서는 라인마다 과세구분이 있어야 `taxType`에 매핑되며([팝빌](https://developers.popbill.com/reference/taxinvoice/java/api/issue), 직접) 항목별 과세구분은 세무 검토 전이다. [미확인]

### 6.3 CRM

- [미확인] 국내 시니어 하우징의 리드·투어·계약 CRM 사례. 해외는 WelcomeHome(open API 회사 주장)과 Aline(2022-10 [3년+] Sherpa·Enquire·Glennis 합병)이 있다.
- [사실] Salesforce 변경 이벤트는 72시간만 보관하므로 구독자는 replay 위치를 저장하고 갭이 나면 전체 재동기화한다([Salesforce](https://developer.salesforce.com/docs/platform/api-streaming/guide/using-streaming-api-durability.html), 직접). [가설] 경계는 "계약 확정 이벤트 1개"로 좁히고, 이전은 CRM이, 이후는 코어가 정본이다. 방문 상담·보호자·대리 서명이 얽혀 일반 영업 CRM 모델이 맞는지는 검증 전이다.
- [사실] 알림톡은 정보성만 가능하고 2026-04-01부터 심사가 강화됐다는 대행사 설명이 있다([비즈고](https://blog.bizgo.io/howto/kakao-alimtalk-template-approval-guide/), 제3자, 카카오 원문 대조 전). [가설] 동의는 정보성·광고성·보호자 정보 공유로 나눠 이력으로 저장한다.
- [사실] 모두싸인 웹훅은 10초 안에 200번대로 응답하지 않으면 5회 재시도한다([모두싸인](https://docs.channel.io/modusign_faq/ko/articles/71169628), 직접). NICE 본인확인은 CI/DI 신청이 필요하고 PASS 직접 이용 요건은 못 찾았다. 대리 서명의 유효성은 [미확인]이다.

### 6.4 출입통제

- [사실] 슈프리마 BioStar 2는 서버 단위 REST이고 이벤트 조회는 `POST /events/search`다. 실시간에는 WebSocket을 권장하며 REST는 약 3~10초 지연이 있고 제공물은 샘플 HTML뿐이다([조회](https://support.supremainc.com/en/support/solutions/articles/24000072557), [실시간](https://support.supremainc.com/en/support/solutions/articles/24000022040), 직접). BioStar X 이벤트 가져오기 API는 외부 → BioStar 방향이고 별도 라이선스가 필요해 PMS의 푸시 수신에는 못 쓴다. 조회 사용 가능 여부와 라이선스 범위는 [미확인]이다([문서](https://support.supremainc.com/en/support/solutions/articles/24000101643), 직접).
- [미확인] BioStar 웹훅(전체 Swagger 열람 필요), API 라이선스 본문, 에스원·SK쉴더스·KT텔레캅, 국내 도어락·호텔 PMS 인터페이스. 해외 VingCard VConnect는 PMS에서 키를 발급하는 미들웨어이고 사양은 비공개다([회사 주장](https://www.vingcard.com/en/solutions/integrations-and-connectivity/pms-integration)).
- [추정] 월패드는 고시상 세대단말기 - 홈게이트웨이 - 단지서버 구조이고 2022-07-01 시행 개정으로 단지망·세대망 분리가 붙었다([뉴시스](https://www.newsis.com/view/NISX20220731_0001962567), 2022-07 [3년+], 검색요약). 외부 연동은 제조사 제휴로 보이고 공개 API는 못 찾았다. 노인복지주택이 고시 대상인지는 [미확인]이다.
- [가설] 공식 경로는 현장 어댑터의 주기 조회 또는 WebSocket 구독이고, "서명"의 주체는 벤더가 아니라 어댑터다. 안심 ADR-S1의 멱등 키는 `(source, vendor_event_id)`이므로, 이벤트 번호가 없는 벤더에는 대체 키 `(기기, 신호 종류, 생긴 시각)`을 제안한다.

### 6.5 호출 설비는 어떻게 동작하나

**표준과 토폴로지.** [사실] UL 2560은 고정 위치의 중앙 수신 장소, 방마다 호출 스테이션, 예비 전원을 요구하고 호출은 60초 안에 접수되어야 하며, 마이크로컨트롤러가 있으면 고장을 90초 안에 보고해야 한다. 무선 호출 개시 스테이션은 최대 24시간까지 허용된다([UL 백서 2012](https://code-authorities.ul.com/wp-content/uploads/sites/40/2015/02/UL_WP_Draft_UL-2560-and-Emergency-Call-Systems_v4_HR.pdf) [3년+], 직접, 규격 본문 미열람). ZVEI 해설(2023-09)은 VDE 0834 계열이 외부와 독립된 호출 전용 전송망을 요구하고 일반 건물 IT 인프라 경유 구성은 "어떤 경우에도" 부적합이라고 하며, 부가서비스는 제조사가 승인한 인터페이스로만 데이터를 주고받는다고 한다([ZVEI](https://www.zvei.org/fileadmin/user_upload/Presse_und_Medien/Publikationen/2023/Oktober/Merkblatt_33021_2023-09__Rufanlagen_nach_DIN_VDE_0834_und_IP-Vernetzung/Merkblatt_330212023-09_Rufanlagen_nach_DIN_VDE_0834_und_IP-Vernetzung.pdf), 직접, 업계단체 해설). VDE 0834-1:2016-06은 DIN 사이트에서 철회(withdrawn)로 표시되고 현행판은 [미확인]이다(검색요약).

**인터넷·서버가 끊기면.** [사실] 벤더별 대체 동작의 1차 문서는 못 찾았다. Televic 특허(우선일 2014 [3년+])는 서버 연결을 잃으면 방 단위 로컬 모드로 전환하는 설계를 쓰지만 출하 제품의 증거는 아니다([특허](https://patents.google.com/patent/EP2976992A1/de)). Austco는 시설망과 분리된 망을 주장하고([브로셔 2021-11](https://www.iheem.org.uk/wp-content/uploads/2021/11/Tacera-ip-nurse-call_A4.pdf) [3년+], 회사 주장), Inovonics Cloud는 로컬 알람을 온프레미스에 두고 게이트웨이로 클라우드에 올린다고 한다(검색요약, 회사 주장). 단절 시 이벤트를 큐잉하는 벤더는 못 찾았다.

**외부로 내보내는 면.**

| 방식 | 확인된 것 | 방향 | 근거 |
|---|---|---|---|
| 접점(dry contact) | 호출 시 외부 장치를 접점으로 구동 | 출력만 | 검색요약, 제3자 |
| ESPA 4.4.4 | 1984 직렬 규격, 호출 취소·수신자 확인 상태 정의. 실제 되돌림은 [미확인] | 정의상 양방향 | [직접](https://wiki.nicksoft.com/_media/espa-444.pdf) [3년+] |
| TAP | 호출을 페이징·미들웨어로 밀어냄. 응답은 별 경로(Rauland 구성은 SIP 다이얼백) | 사실상 단방향 | [직접](https://www.patton.com/manuals/Emergin_Vocera_HAN0083_Rauland%20Patton%20Application.pdf) 2012 [3년+] |
| HL7 | Connexall-Rauland 2017, 필드 비공개 | 양방향 | [직접](https://www.prweb.com/releases/new_connexall_integration_with_rauland_responder_all_touch_/prweb14070603.htm) 회사 주장 [3년+] |
| 웹서비스 API | Austco: 알람 주입, acknowledge·reject·escalate, WebSocket 피드 | 양방향 | 직접(브로셔), 회사 주장 |

- [사실] 에스컬레이션이 제어기 안에서 도는지 명시한 1차 문서는 Honeywell DECT 모듈(call type group별 escalation·반복 시간, 단종)뿐이다([Honeywell](https://buildings.honeywell.com/us/en/products/by-category/connected-life-solutions/nurse-call-systems/83we140-software-module-for-dect-paging-system), 회사 주장). [추정] 병원의 표준 구성은 호출 시스템 + 미들웨어(Emergin, Connexall, Spok) + PBX·DECT이고, 미들웨어는 호출 접수·표시를 대체하지 않는 2차 알림 계층이다.
- **일본**: [사실] 너스콜이 센서·카메라 알람을 모아 직원 스마트폰으로 뿌리는 알람 허브다(NTT 보고서, Aiphone Vi-nurse·眠りSCAN 연동 2016-03 [3년+], 검색요약). [추정] 기록 SW는 후행이다. IHE PCD ACM은 너스콜에서 쓰이지만 개호 센서에는 제안 단계라, "일본은 표준이 있다"고 쓰면 왜곡이다.
- **한국**: [사실] 코맥스 JNS 간호호출은 마스터 1대가 서브 32개를 맡고 4가닥 공통선으로 연결된다(검색요약, 연도 미확인). RS-485·TCP/IP·접점·API 사양을 밝힌 국내 벤더 자료는 못 찾았고, 해외 대형은 IP 게이트웨이 모듈을 따로 판다. [추정] 외부 출구는 수신반 접점이나 제조사 맞춤 개발일 가능성이 높다(근거는 [가설] 수준).
- [사실] 별표 2는 경보장치 1개소 이상을 거실·화장실·욕실·복도 등 필요한 곳에 설치하도록 쓰고, 받는 곳과 응답 시간은 별표 2·3 본문에 없다(미러). 소방시설법·편의증진법 별표·주거약자법은 열지 못했다. [미확인] 응급안전안심서비스는 복지부·지역센터 중심의 별개 제도이고([복지로](https://www.bokjiro.go.kr/ssis-tbu/cms/pc/news/promotion/1304668_1118.html), 직접) 민간 PMS의 연동 경로는 보이지 않는다. [추정]
- [미확인] 국내 시설에서 방 호출이 프런트 전화로 가는 구조(PBX·인터폰·콘솔)는 어느 자료에서도 확인하지 못했다.

**건물 층 판정.**

| 갈래 | 판정 | 강도 | 한계 |
|---|---|---|---|
| (a) 호출 설비 자립 + 단절 감지·직원 대체 절차 | 안전 경로의 기본 [추정] | 중상 | 규격 본문·벤더 장애 동작·한국 규정 미열람 |
| (b) 소형 store-and-forward 게이트웨이 | 수집·기록 한정. 한국은 수집 전제일 수 있음 [추정] | 중하 | 벤더 큐잉 서술 없음 |
| (c) 우리 SW가 호출 라우팅·로컬 타이머 소유 | 2차 알림 범위로 제한 [추정] | 약 | 허용 사례는 미들웨어의 2차 알림뿐 |

### 6.6 IoT 수집

- [사실] 국내 레이더·낙상 감지 사례는 여럿이지만 공개 API·웹훅 문서를 낸 곳은 없고, 알림은 보호자·간호 스테이션·카카오톡·전화 같은 자체 경로로 나간다. LG유플러스 H+ 실증(2020-11-03 [3년+], [보도](https://lg.co.kr/media/release/22641)), 스마트레이더시스템(2026-05-20, [뉴스핌](https://www.newspim.com/news/view/20260520000152)), 홈플릭스 7개 시설 36세대 시범(2026-06-12, [다음뉴스](https://v.daum.net/v/ykQtluu5Zk?f=p), 효과 수치는 회사 주장). 국내 침대 압력 센서 벤더는 못 찾았다. [추정] 공개 문서 부재는 비공개인지 연동이 없는지 구분되지 않으므로 맞춤 계약을 가정한다.
- [사실] AWS 서울에서 IoT Core(MQTT)와 Greengrass를 쓸 수 있다. HTTPS는 게시 전용이라 연결 끊김 감지가 없고 MQTT는 있다([AWS](https://docs.aws.amazon.com/iot/latest/developerguide/protocols.html), 직접). [추정] 웹훅만으로는 "조용해진 기기"를 서버가 시간으로 세어야 한다.
- **비용(사용량은 가정)**: [가설] 400세대 건물, 기기 400대, 분당 1회 하트비트, 기기당 하루 100건 이벤트, 메시지 5KB 이하, 30일. 단가는 AWS 서울 가격표([IoT Core](https://aws.amazon.com/iot-core/pricing/)).

| 구성 | 월 비용(가정 기준) |
|---|---|
| 기기 400대가 IoT Core에 직접 MQTT | 약 $30.49 |
| 건물 게이트웨이 2대가 묶어 전송 | 약 $2.02 (10곳 약 $19.44) |
| 웹훅 → API Gateway → SQS(이벤트만) | 약 $2.52 (하트비트까지 HTTP면 $22.73) |
| 건물마다 Site-to-Site VPN | 연결당 $36.50, 10곳 $365 |

- [추정] 가격을 가르는 것은 프로토콜이 아니라 메시지 개수다. 아웃바운드 TLS MQTT가 방화벽 협의에 유리해 보이나 현장 확인 전이라 [가설]이다.

### 6.7 AI Agent

- [사실] 이번 조사에서 확인한 운영 데이터용 공식 MCP 서버는 Apaleo(2025-09-22, 알파, [발표](https://apaleo.com/blog/apaleo-news/apaleo-launches-mcp-server))와 Yardi(2026-06-16, [보도](https://www.yardi.com/news/press-releases/yardi-adds-virtuoso-connector-for-claude-to-its-ai-platform/), 회사 주장, 본문 403)다. Apaleo는 요청 범위가 있어도 사용자 역할이 못 덮으면 403이다([문서](https://apaleo.dev/guides/api/scopes.md), 직접). 쓰기 승인 구조를 공개한 사례는 찾지 못했다(Yardi 본문 403, AppFolio는 승인자 라우팅 한 가지만 명시). AppFolio의 효과 수치는 모두 회사 주장이다. 시니어 쪽 AI는 EHR·CRM 안에서 사람이 검토하는 보조로 포지셔닝되며, 사람 개입을 구체적으로 설명한 곳은 Yardi(문구 수준)와 SafelyYou(원격 임상가)뿐이다.
- [사실] MCP 현행판은 2026-07-28(무상태, [changelog](https://modelcontextprotocol.io/specification/2026-07-28/changelog), 직접)이고, Spring AI 2.0 GA(2026-06-12, [블로그](https://spring.io/blog/2026/06/12/spring-ai-2-0-0-GA-available-now/))의 Java SDK는 2025-11-25판이며 새 판 지원은 SDK 2.2.0-M1(사전 릴리스, 서버만)이다. AgentCore는 서울에서 Runtime(microVM), Gateway, Identity, Memory, Policy, Observability, Evaluations가 되고 Runtime Instances, payments, Agent Registry는 안 된다([문서](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/agentcore-regions.html), 직접).
- [사실] Bedrock Guardrails Standard 티어는 교차 리전 추론으로 프롬프트가 주 리전 밖으로 나갈 수 있고([문서](https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails-cross-region.html), 직접), PII 필터에는 주민등록번호 유형이 없고 도구 인자·결과를 보지 않는다([문서](https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails-sensitive-filters.html), 직접). [추정] 마스킹은 앱 계층이 먼저 하고 서울 안 폴백(Sonnet 5, Opus 5)이 막히면 직원 수동 처리가 기본이다.
- [가설] 쓰기는 `action_proposal` 테이블(허용 칸만 담은 인자, 위험 등급, 승인자, 만료, 멱등 키, 인자 해시)로 제안하고, 승인 뒤 별도 작업자가 한 번만 실행하며 승인 시점에 해시를 다시 계산한다. 위험 등급은 T0 읽기·초안(자동), T1 되돌릴 수 있는 쓰기(1인 승인), T2 금전·권리·민감정보(변경 전후 비교)로 도구 코드에 선언한다. 승인 요청이 많으면 무심코 승인한다는 보고가 있어([Anthropic](https://www.anthropic.com/engineering/how-we-contain-claude), 직접) 승인 큐만을 방어로 삼지 않는다. 공식 참조 설계는 못 찾았다. [미확인]
- [가설] 응급·건강·불만·금액·개인정보 변경은 코드 규칙으로 즉시 사람에게 넘기고 전화는 사람 연결이 우선이다. AI 기본법 고지(2026-01-22 시행)의 법적 충족 여부는 [미확인]이다.

## 7. 개인정보·RBAC

- [사실] 「개인정보의 안전성 확보조치 기준」은 고시 제2026-9호(2026-07-01 시행)로 표시되나 본문은 못 읽었다([국가법령정보센터](https://www.law.go.kr/LSW/admRulInfoP.do?admRulSeq=2100000281400), 메타데이터만). 변경 내용과 부칙의 2027-01-01 시행 조항은 [미확인]이다.
- [사실] Kim & Chang 해설은 2025-07-21 개정(2025-10-31 시행)으로 접속기록 점검의 "월 1회 이상"이 없어지고 점검 주기·방법·사후조치를 내부관리계획으로 정하게 되었다고 설명한다. 같은 글은 내부관리계획 수립 등 준비가 필요한 사항은 발령 1년 후 시행한다고도 쓰지만 이 조항의 시행 시점은 밝히지 않고, 제2026-9호 이후 현행 문구는 [미확인]이다. 보관 대상은 "개인정보처리시스템에 접속한 자(정보주체 제외)"로 넓어졌다([Kim & Chang](https://www.kimchang.com/ko/insights/detail.kc?sch_section=4&idx=33291), 직접). 이 저장소의 허브·기획 문서에서 "월 1회" 표현은 찾지 못했다(검색 기준, 조사 의뢰의 전제였다). 접속기록 2년 이상 보관 대상에 민감정보 시스템이 든다는 것은 위키 요약뿐이고(제3자) 같은 위키의 개요 페이지는 개정 전 문구로 충돌한다. [추정] 2년을 하한으로 잡되 해당 여부는 법률 검토에 맡긴다.
- [가설] 컬럼 암호화는 KMS 데이터 키를 쓰는 앱 봉투 암호화로 하고(`pgcrypto`는 미조사), 암호화 컨텍스트에 개인정보를 넣지 않는다. 전화번호 등 검색 필드는 HMAC 블라인드 인덱스로 동등 검색만 허용한다. 주민등록번호는 원칙적 처리 금지라는 제3자 요약이 있어(개인정보 보호법 제24조의2, 시행일 표기 2026-09-11, 공식 확인 전) 기본 미수집으로 두고 필요 시 별도 역할·키·열람 사유를 붙인다.
- [가설] 파기는 보존 정책 테이블과 배치로 하고 법정 보존분은 분리한다(키 폐기가 "복원 불가 파기"인지는 해석 필요 [추정]). 감사 변조 방지는 추가 전용 테이블, 사업장별 해시 체인, S3 Object Lock 내보내기의 3단이며 해시 체인의 공개 사례는 못 찾았다. [미확인]
- [가설] 보호자 위임은 `guardian_grant(입주자, 보호자, 열람 범위[], 동의 참조, 유효기간, 철회)`, 파트너 토큰은 `api_client`(사업장 범위·만료·철회), 긴급 접근은 `break_glass_grant`(사유·승인자·만료)로 두고 모든 감사 행에 표시한다.
- [사실] PCC Connected Care Center는 입주자가 민감 항목 공개를 허용·철회하고 직원이 가족 접근을 부여·회수하며 감사 추적을 둔다. 법적 대리인 역할은 정의되지 않는다(직접). [추정] 한국은 위임장 대리인·후견인을 보호자와 다른 역할로 모델링하고, 치료 목적 예외를 가정하지 않는다. [미정] IdP는 Spring Authorization Server와 Keycloak 중 하나이고 우열 근거가 없다.

## 8. Cloud·CI/CD·모니터링

- [사실] GitHub Actions OIDC로 정적 키 없이 AWS에 들어가고([GitHub](https://docs.github.com/en/actions/how-tos/secure-your-work/security-harden-deployments/oidc-in-aws)), ECS는 2025-07부터 내장 blue/green이 있다([AWS](https://aws.amazon.com/about-aws/whats-new/2025/07/amazon-ecs-built-in-blue-green-deployments/), 검색요약). OpenTofu 상태는 S3 네이티브 잠금으로 충분하다([문서](https://opentofu.org/docs/language/settings/backends/s3/)). GitHub과 OpenTofu는 직접.
- [추정] HTTP가 없는 작업자는 사실상 롤링 교체라, 안심 타이머를 쥔 작업자는 중복 실행·누락을 막는 설계(리스, 멱등)가 필요하다. [가설] Flyway는 CI의 일회성 작업으로 먼저 돌리고 계정은 관리·스테이지·운영 3개로 나눈다(실제 입주자 데이터 전).
- [사실] Spring Boot 4.1의 공식 경로는 Micrometer + OTLP이고 서울에는 CloudWatch, Managed Prometheus, Managed Grafana 가격이 모두 있다. Opsgenie는 2027-04-05 지원 종료다([Atlassian](https://support.atlassian.com/jira-service-management-cloud/docs/should-i-merge-opsgenie-with-jira-service-management/)). 후속 온콜 도구는 [미확인]이다.
- [가설] 안전 경로의 "조용한 실패" 감시는 ① 작업자 분당 하트비트 메트릭, ② 누락을 경보로 처리, ③ 앱 밖에서 운영 URL을 부르는 외부 캐너리, ④ 문자·전화와 메신저 두 갈래 수신이다. 캐너리 1개를 5분마다 돌리면 월 약 $16.42(실행 수는 가정).
- [가설] 서울 가격표(730시간)로 계산하면 NAT 1대는 월 $43.07(앞선 문서의 $207·$439에 빠져 있던 항목)이고, 엔드포인트 5개를 2개 AZ에 두면 월 $94.90이라 통신이 월 약 1,058GB를 넘어야 이득이다. 사용량은 모두 가정이다.
- [사실] 서울 외 한국 리전은 못 찾았다. [추정] 한국 안 DR은 서울 안 별도 계정의 백업 볼트, PITR(복구 목표 약 5분 [가설]), IaC 재생성이 전부이고 리전 전체 장애는 막지 못한다. RTO는 복원 훈련으로 재야 한다. [미확인] ISMS-P 의무화(2027-07-01, 범위 미확정)와 CSAP 필요 여부도 [미확인]이다.

## 9. Evenstay 설계에 영향을 주는 점

문서는 고치지 않았다. 허브가 각 세션에 요청할 제안이다. [가설] 이 조사에서 읽은 설계 문서는 안심(safety-signal-hub) `prd.md`·`tech-design.md`와 코어(pms-core-billing) `tech-design.md` 일부이고 비서·가족·전환·커뮤니티 문서는 읽지 않았다. [사실]

| 현재 설계(문서·절) | 조사 결과 | 바꿀 제안 | 맡을 세션 |
|---|---|---|---|
| 안심 `prd.md` F1 "출처별 웹훅. 서명 검증", 13절 목업, `tech-design.md` ADR-S1 | 국내 벤더 서명 웹훅 근거 없음. 출입은 REST 조회·WebSocket | F1을 "수신 어댑터(웹훅·조회·접점·직렬) → 공통 신호 형식"으로 쓰고 서명은 어댑터에서 클라우드로 올라가는 구간에 둔다. 벤더 웹훅은 "형식 시뮬레이션, 실제 벤더 [미확인]"으로 표시 | 안심 |
| 안심 `tech-design.md` 4절 즉시 확인 5분 `[사실, shortlist B 데모]`, `prd.md` 6절 넘김 시간 | 법령 본문에서 응답시간·호출 규정을 못 찾음(미러). 법정 요건이 아니라 자체 SLA | 5분을 [가설]·사업장 설정값으로 쓰고 "법정 요건 아님, 운영 품질 목표" 한 줄을 넣는다. 확인할 것 11(야간 직원·시설장 검토) 뒤 조정 | 안심 |
| 안심 `prd.md` 1절 "5분 동안 아무도 확인하지 않으면…", 5절 "호출벨은 수신반" | 호출 접수·표시는 건물 안 설비가 맡는 구조 | `prd.md`에 이미 있는 경계(앱은 부른 뒤 보는 곳, 도움을 부르는 길은 호출벨·방 전화·119)는 유지한다. 건물 안 경로가 계속 동작하고 안심 알림은 2차 알림·기록을 맡는다는 점을 데모 서사에 넣는다 | 안심, 허브 |
| 안심 ADR-S2 넘김 타이머(클라우드 DB + 작업자), `tech-design.md` 11절 | 건물 인터넷 전체 단절은 문서에 없음 | 단절 시 2차 알림이 멈춘다고 명시하고 직원 대체 절차를 정한다. 작업자 생존 경보는 11절에 있으나 앱 안에서만 보인다. 앱 전체가 멈출 때를 위해 외부 캐너리와 앱 밖 수신 경로를 추가 | 안심, 코어(배포) |
| 안심 F13 신호 끊김 기본 2시간 [가설] | UL 2560 고장 보고 90초(컨트롤러 있는 경우), 무선 호출 개시 스테이션은 최대 24시간. Inovonics 중계기 20분·송신기 60분(검색요약) | 기기 종류별 기본값 표로 나눈다(호출 관련 수신 단절은 분 단위, 센서는 시간 단위). 호출 설비 자체 고장 표시는 수신반 몫임을 적는다 | 안심 |
| landscape 5절 "MQTT 또는 업체 웹훅", 6절 건물 층 표 | 한국 출구는 접점·직렬·조회 중 하나로 보임. (a) 중상, (b) 중하, (c) 약 | 6절을 (a) 기본, (b) 한정, (c) 2차 알림으로 확정 후보로 올리고 벤더 문의 1건(11절) 뒤 닫는다 | 허브 |
| 코어 `tech-design.md` 9절 `PaymentGateway.requestPayment` 건별 + 웹훅, `ErpExporter` CSV | CMS는 비동기·한도·동의 증빙. 고정식 가상계좌는 제한 방향. 토스는 서명 헤더를 공통 헤더로 설명하고(이벤트별 유무 [미확인]), `secret` 비교를 적은 이벤트는 입금 웹훅뿐이며, 상태 변경 웹훅에 `eventId`가 없다. ERP는 배치 + 멱등 | `DirectDebitMandate`, `PENDING_BANK_RESULT`, `ExpectedPayment` 매칭, 3자 대사를 결제 절에 추가. "웹훅 서명 검증, (provider, event_id) 유일"은 제공자별 검증과 멱등 키로 바꾼다. 토스의 `transactionKey`+`orderId`는 문서 권장이 아닌 [가설]이다. ERP는 `LedgerExportBatch`와 상태기계로 확장 | 코어 |
| 코어 계약·입주 상태기계(ADR-5 승계), 전환 모듈 | 동반자 90일 타이머, 보증보험 상태, 입법예고(계속 거주·대표회의·위탁 신고) | 계약 × 자격자 × 동반자 타이머를 정책 버전으로 두고 payor 구분·위탁 변경 데이터 이관을 이벤트로 | 코어, 전환 |
| 안심 `tech-design.md` 12절·확인할 것 13, 가족 `tech-design.md` 12절 "pgcrypto 또는 앱 암호화" | 앱 봉투 암호화 + 블라인드 인덱스 제안(pgcrypto 미조사) | 앱 봉투 암호화로 좁힌다. 접속기록 점검 주기를 적을 때는 내부관리계획 정의로 둔다. RLS 주입·풀러 pinning은 코어 검증 항목으로 | 안심, 가족, 코어 |
| 허브 `architecture-options` 5절 "내부 도구 등록부(ADR-G2)로 충분" | MCP 판·SDK 불일치. Guardrails Standard 교차 리전. 쓰기 승인 사례 없음 | 유지. 열 때는 읽기부터, 쓰기는 제안 테이블 + 위험 3단 + 멱등 키 | 비서 |
| `pms-landscape.md` B28, `competitive-landscape.md`, `service-coverage-review.md` S38·S41 | Caremerge의 참여·웰니스 사업은 2022-06 [3년+] VoiceFriend에 인수되어 Icon으로 개명([보도](https://www.businesswire.com/news/home/20220621005173/en/5235922/Leading-Senior-Care-Communication-Platform-VoiceFriend-Acquires-Caremerge%E2%80%99s-Engagement-and-Wellness-Business-Rebrands-to-Icon), 검색요약) | "Caremerge 가족 포털" 서술을 이력과 함께 정정(세 문서 2026-11-04 반영) | 허브(리서치) |
| 가족 동의(family) | PCC는 입주자 동의 + 직원 부여, 법적 대리인 미정의 | 위임장 대리인·후견인을 보호자와 다른 역할로 유지하는지 점검 | 가족 |

**5분 넘김은 법정 요건인가 자체 SLA인가.** [추정] 자체 SLA로 보인다. 별표 2·3 본문에서 24시간·당직·응답·호출이 검색 0건이고 경보장치 설치까지만 쓴다(미러, 직접). 미국 사례의 임계값(PEI 다운타임 절차의 2시간)도 법정 수치가 아니라 시설 내부 합의였다(직접, 발행 연도 [미확인]). [사실] 소방·건축 쪽 법령과 원본 대조는 못 했으므로 "법령에 없다"가 아니라 "열어 본 본문에서 못 찾았다"로 쓴다. [미확인]

## 10. 시니어 하우징 서비스 레퍼런스 구조

호출 경로는 건물 안에서 끝나고 PMS는 그 결과를 받는 2차 레이어다. 점선 아래가 건물 밖이다. 권고안이며 특정 사업자의 공식 구성도가 아니다. [가설]

```
L0 입주자 방    호출 버튼·경보장치     침대·재실 센서       출입 카드·서버
                     │                      │                   │
L1 건물 안 호출 호출 설비 제어기 → 수신반·표시기 → 직원 핸드셋     │ (제조사 소유,
   경로(자립)   ▲ 호출 접수·표시는 여기서 끝난다(인터넷 불필요)   │  예비 전원, 독립망)
                     │ 접점·직렬·조회 등(벤더별 [미확인]), 읽기 전용 사본
                     ▼                      ▼                   ▼
L2 현장 어댑터  정규화 · (어댑터가) 서명 · 단절 시 버퍼 · 끊김 감지   (조건부·얇게)
                     │ 아웃바운드 TLS(MQTT 또는 HTTPS), 인바운드 포트 없음
 - - - - - - - - - - │ - - - - - - - - - - - - - - - - - - - - - - - - - - -
L3 클라우드 수집 수신기 → 원본 먼저 보관(RawSignal) → 중복 확인(출처, 이벤트 번호)
                     │
L4 코어 PMS     모듈형 모놀리스(Spring Boot 4.1 + Modulith, PostgreSQL 18, RLS)
   (2차 레이어)  core(계약·원장·동의) · safety(2차 알림·넘김·기록) · family
                 · assistant(제안 → 직원 승인) · transitions · requests · community
                     │ 아웃박스 → 어댑터 뒤
L5 외부 시스템   ERP 배치 · 결제(CMS·PG)·대사 · CRM · 알림톡 · 본인확인 · LLM(Bedrock 서울)
```

L2나 L3 이상이 멈춰도 L1은 계속 동작해야 한다. 이때 2차 알림이 멈췄음을 직원 화면과 외부 캐너리로 알리고 직원 대체 절차로 넘어간다. [가설]

## 11. 못 찾은 것과 확인 방법

| 못 찾은 것 | 가장 싼 확인 방법 |
|---|---|
| 국내 호출 설비의 외부 출구(접점·RS-485·TCP/IP·API), 단절 시 동작, 이벤트 큐잉 | 코맥스 등 벤더 문의 1건, 시설 견학 때 수신반·제어기 모델 확인 |
| 국내 시설의 방 호출 → 프런트 연결, 야간 인원, 인수인계 | 입주 상담·견학, 운영 직원 인터뷰(`mom-test`), 나라장터 공고 직접 조회 |
| 슈프리마 웹훅 유무, API 라이선스 본문 | BioStar 2 Swagger를 내려받아 전체 읽기 |
| 센서 벤더의 알림 페이로드·웹훅·MQTT, 국내 침대 압력 센서 | 벤더 영업 문의 |
| 법령 원본 대조(별표 2·3, 소방시설법, 편의증진법 별표 1, 주거약자법, 홈네트워크 현행 고시) | law.go.kr 직접 열람 |
| 입법예고 원문·확정·시행일, 법률 제22020호 개정 내용, 고시 제2026-9호 변경점 | 국민참여입법센터, 국가법령정보센터 신구조문 대비 |
| 그룹 ERP, [지원 회사] 계열 보안 기준 | 공개 자료 없음. 면접·입사 후 질문 |
| CMS 한도 상향, 효성FMS 연동 명세, 고정식 가상계좌 시행일 | 결제원·효성FMS 문의, 금감원 원문 |
| RDS Proxy에서 `set_config(…, true)` pinning, Spring RLS 주입 후크 | 소형 검증 코드. MVP 없음 결정과 닿으므로 사용자 확인이 먼저 |
| 한국 언어별 공고 수, A 등급 기술글 | 원티드 직접 집계, 컨퍼런스·GitHub·클라우드 고객 사례 검색 |
| 5분 등 넘김 시간의 현장 타당성 | 야간 직원·시설장 1명 검토(안심 확인할 것 11) |

## 12. 출처 메모

**검증 한계.** [사실] 검색 도구가 요약 중심이라 검색요약 행이 많고, 일부 공식 페이지(Yardi, 코맥스 매뉴얼, PCC 개발자 포털)는 403이었다. 법령은 미러 기준이다. 벤더에는 연락하지 않았다.

**충돌(둘 다 표시).**
- [사실] PCC FHIR: CAST는 "게시·소비 아니오", Nirmitee는 USCDI FHIR R4 읽기를 설명한다. CAST 응답이 오래됐을 수 있다. [추정]
- [사실] Yardi Voyager API: SOAP·자격증명(통합대행사)과 "공개 API 없음·파트너 잠금"(Supergood)으로 갈리고 둘 다 공식이 아니다.
- [사실] 접속기록: 위키 개요는 "월 1회 점검"을, Kim & Chang 해설은 폐지를 말한다. 후자를 따랐다. 입법예고 시행 시점·"중간집", 가상계좌 시행일도 기사마다 다르다.
- [사실] 홈네트워크 고시 열람본(2020-24호 [3년+])은 2022 개정 이전이다. MCP 개요와 Spring AI GA 블로그의 SDK 버전 불일치 원인은 확인하지 못했다.

**앞선 문서에서 정정·보완이 필요한 것.**
- [사실] Caremerge의 참여·웰니스 사업이 2022-06 [3년+] VoiceFriend에 인수되어 Icon으로 개명되었다(검색요약). B28의 "가족 포털" 서술은 이력을 반영하지 않았을 수 있어 세 문서를 2026-11-04 정정했다. Linked Senior와의 제휴는 여전히 확인 못 했다.
- [사실] 토스 웹훅: 초안은 영문 페이지만 보고 서명 헤더가 없다고 썼다. 허브가 이벤트 문서를 대조해 공통 헤더 설명을 확인했고 6.2절과 9절을 고쳤다.
- [추정] 안심 `tech-design.md` 4절 "즉시 확인 5분 `[사실, shortlist B 데모]`"의 [사실]은 데모 값의 출처이지 법정 근거가 아니다.
- [사실] "일본에 호출·센서 표준이 있다"는 사실이 아니다. 너스콜 영역에서 IHE PCD ACM이 쓰이고 개호 센서에는 제안 단계다.
- [사실] 검색에서 '일진메가텍 너스콜 전문업체'로 나온 nursecall.co.kr은 2026-11-04에 열어 보니 도박성 사이트라 뺐다. 야놀자 EKS 주장은 근거 기사에 없어 뺐다. 산하IT WINGS 국내 점유율 70% 이상은 회사 주장이고 재검증하지 않았다.
- [미확인] landscape의 "Spring 인력 근거"는 이 조사에서도 닫히지 않았다.

**원문 요약(10개).** [global-platforms](sources/arch-global-platforms.md), [japan-systems](sources/arch-japan-systems.md), [tech-stacks](sources/arch-tech-stacks.md), [design-requirements](sources/arch-design-requirements.md), [call-system-mechanics](sources/arch-call-system-mechanics.md), [korea-call-access-vendors](sources/arch-korea-call-access-vendors.md), [erp-payment-crm](sources/arch-erp-payment-crm.md), [multisite-rbac-privacy](sources/arch-multisite-rbac-privacy.md), [cloud-cicd-iot-ingest](sources/arch-cloud-cicd-iot-ingest.md), [ai-agent](sources/arch-ai-agent.md).
