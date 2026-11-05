# 출처: 시니어·돌봄·주거 소프트웨어 실제 기술 스택 (공개 자료 기준)

조사일(열람일): 2026-11-04. 목적은 "Spring + Next.js + PostgreSQL + AWS 서울 모듈러 모놀리스"를 현실 대비 어디에 놓을지 보기 위한 증거 수집이다. 언어·스택의 우열은 평가하지 않는다.

## 읽는 법 (한계)
- 근거 등급: A=회사 공식 기술글·개발 문서 / B=채용 공고 본문 / C=제3자 스택 사이트. 이번에 **A 등급은 하나도 못 찾았다**. 모든 행이 B 또는 C다.
- 채용 공고는 "그 공고의 팀이 쓰는 스택"만 증명한다. 제품 전체 스택이 아니다. [사실]
- 원문 열람 표시: **열람**=페이지 본문을 직접 열어 확인. **요약**=검색 결과 요약만 봤고 원문은 열지 못했다(원문 미열람이므로 신뢰도를 한 단계 낮춰 읽을 것).
- 공고 게시일은 대부분 페이지에 표시되지 않았다. 아래는 확인된 만료·삭제일만 적었고, 없으면 "게시일 미표시"로 쓴다. 이미 내려간 공고는 현재 스택과 다를 수 있다. [사실]
- 한계: 검색 도구가 요약 중심이고 LinkedIn은 쓰지 않았다. 도구 호출 상한 때문에 GitHub 조직, 컨퍼런스 발표, AWS/Azure 고객 사례는 체계적으로 뒤지지 못했다. [사실]

---

## 1. 글로벌 시니어리빙·케어 벤더

### Takeaway
- PointClickCare(PCC)는 Java/Spring Boot 마이크로서비스 + Kubernetes + Kafka 기반 팀이 공고에 나오고, 클라우드는 Azure(AKS)가 가장 뚜렷하다. [사실, B] 다만 일부 공고는 "AWS 또는 Azure"로 열려 있다. [사실, B]
- ALIS(Medtelligent)는 .NET/SQL Server 계열이다. [사실, B] 소규모 벤더는 스택이 제각각이고 공개 근거가 얇다.

### 근거 (회사별)
**PointClickCare (토론토/미시사가, 케어·시니어리빙 EHR)**
- Senior Software Architect 공고: Java, JavaScript, Spring Boot, Gradle, Docker, Kubernetes, Kafka(+Avro), MySQL, Microsoft Azure(또는 다른 퍼블릭 클라우드), HL7/FHIR, AI·NLP 언급. 게시일 미표시, 열람. 등급 B. [사실] — [Lever](https://jobs.lever.co/pointclickcare/dccd4d74-0d2e-42cb-b999-464853e0a2d1), 열람 2026-11-04
- Principal Software Engineer 공고(미시사가, 플랫폼 서비스팀): Java, Spring Boot, REST, 마이크로서비스, React(마이크로 프런트엔드), PostgreSQL·MSSQL·Redis, Azure·AKS·Terraform, GitHub Actions·Jenkins, 개발 도구로 Claude Code·Copilot. 페이지는 2026-04-24에 내려갔다고 표시. 열람. 등급 B. [사실] — [Built In Toronto](https://builtintoronto.com/job/principal-software-engineer/8481356)
- Java 엔지니어 공고들: Spring Boot, SQL Server 또는 MySQL, Jenkins, Docker/Kubernetes, AWS 또는 Azure 중 택일. 요약만 확인. 등급 B(원문 미열람). [사실] — [Lever Senior Java](https://jobs.lever.co/pointclickcare/163f10cd-663a-4a2a-a6b8-2e5ed532326b), [Lever Intermediate](https://jobs.lever.co/pointclickcare/92bd0a33-a934-499a-81ec-b38956488cc5)
- 빅데이터 Java 공고: Java, Python, Kotlin, Go, Apache Hudi, Trino, Spark, Databricks, HDFS, S3. Snowflake는 이번 검색에서 어떤 공고에도 안 나왔다. 요약만 확인. 등급 B(원문 미열람). [사실] — [Built In](https://builtin.com/job/senior-software-engineer-big-data-java/8125567)
- 서로 다른 공고가 AWS와 Azure를 모두 언급한다. 한 팀이 둘 다 쓴다는 뜻인지, 팀·시기별 차이인지는 구분 못 했다. [미정]
- 공식 엔지니어링 블로그는 못 찾음. [사실]

**ALIS / Medtelligent (시카고, 어시스티드 리빙 운영 SW)**
- Senior .NET Engineer 공고: C#, ASP.NET MVC/Core, Blazor, Entity Framework 6/Core, Dapper, SQL Server·T-SQL, Azure(우대), DOMO, Sentry. 만료된 공고, 게시일 미표시, 열람. 등급 B. [사실] — [SmartRecruiters](https://jobs.smartrecruiters.com/Medtelligent/744000117744257-senior-net-engineer)
- 해당 공고는 "클라우드 네이티브·SaaS 경험"을 요구한다. 제품이 멀티테넌트인지는 공고에 없다. [사실/미확인]

**MatrixCare (ResMed 소속)**
- ResMed/MatrixCare 공고 묶음: C#·.NET·ASP.NET Core·AWS·Docker, 또 다른 공고는 Java·Spring·마이크로서비스·AWS, 또 다른 공고는 Java/.NET/Node + React + AWS 컨테이너. 모두 요약만 확인, 게시일 미표시, 일부는 폐쇄·재게시. 등급 B(원문 미열람). 제품 분리(EHR 모더나이제이션 팀 vs 신규 팀)가 불명이라 하나의 스택으로 합치지 않는다. [사실/미정] — [Built In C#, AWS](https://builtin.com/job/senior-software-engineer-c-aws/4265019), [Built In Java Full Stack](https://builtin.com/job/senior-engineer-java-full-stack/3244286)
- Scribd 재게시본의 "Java, Spring, 마이크로서비스" 공고는 재게시라 신뢰도가 더 낮다. [사실, B-]

**Yardi (시니어리빙 포함)**
- 일반 개발 공고: SQL Server, C#/VB.NET, Angular, 일부 Java·Oracle. Azure 요구는 못 찾음. 시니어리빙 전용 개발 공고는 못 찾았고, 시니어리빙 공고는 기술 계정 매니저뿐. 요약만 확인, 많은 공고 만료. 등급 B(원문 미열람). [사실] — [WomenTech Yardi SDE III](https://www.womentech.net/en-us/job/yardi/santa-barbara/software-development-engineer-iii), [Yardi 블로그 API 목록 항목](https://www.yardi.com/blog/wp-json/wp/v2/posts/17705)
- "Yardi cloud" 호스팅 구조(자체 데이터센터인지 퍼블릭 클라우드인지)는 못 찾음. [미확인]

**Eldermark (Yardi 계열)**
- 제품 비교 목록 한 곳이 Microsoft Azure 프라이빗 클라우드 호스팅이라고 적음. 애플리케이션 스택은 아님. 제3자 목록, 요약만 확인. 등급 C. [사실, C] — [GetApp Eldermark](https://www.getapp.com/healthcare-pharmaceuticals-software/a/service-minder/alternatives/)에 연결된 검색 결과 요약 기준. 정확한 문구 위치는 원문 재확인 필요. [미정]

**August Health**
- Senior Full Stack Engineer 공고 한 건: React, TypeScript, Scala, Kubernetes. 7년 이상 경력. 게시일 미표시, 원문 접근 실패(403), 요약만 확인. 등급 B(원문 미열람). [사실] — [aijobs 재게시](https://aijobs.app/senior-full-stack-engineer-august-health-7177176)

**Aline**
- 소프트웨어 엔지니어 공고에서 C#/.NET 우대, React·Node.js 가산. 같은 이름 회사의 AI 엔지니어 공고(Python, React, SQL)는 시니어리빙 회사와 동일한지 불명이라 제외. 요약만 확인. 등급 B(원문 미열람). [사실/미정] — [Teal 공고](https://www.tealhq.com/job/software-engineer_7ea1a322ec4ef7f768581f30b280bad8eaef8)

**ECP (시니어리빙 SaaS, 8천 커뮤니티 이용 주장)**
- Senior Software Engineer 공고: Lucee(ColdFusion 계열) + React. 한 건은 2025-11-19 표기. 요약만 확인. 등급 B(원문 미열람). [사실] — [Built In](https://builtin.com/job/senior-software-engineer-lucee-react/7753343)

**Inspiren (AI 카메라·시니어리빙 케어 플랫폼)**
- Senior/Staff Backend 공고: TypeScript·Node.js(필수), AWS Lambda·Fargate·SQS/SNS·Kinesis·DynamoDB·RDS, PostgreSQL, React 가산, 개발 도구로 Cursor·Claude Code. 2026-08-05에 내려감. 열람. 등급 B. [사실] — [Built In](https://builtin.com/job/senior-software-engineer-backend/7139664)
- 인프라 공고: AWS/Azure/GCP 중 클라우드, Python·C++·JavaScript, Docker/Kubernetes, 기기(device) 운영. 요약만 확인. 등급 B(원문 미열람). [사실] — [Greenhouse](https://job-boards.greenhouse.io/inspiren/jobs/4621334007)(접근 시 404, 검색 요약 기준)
- EHR 연동팀 공고는 언어 미명시. [사실]

**SafelyYou (AI 낙상 감지 카메라)**
- Fleet 팀 공고: 백엔드 Go 또는 Python, AWS 또는 GCP, 수만 대 엣지 기기 관리·OTA·관측성. C&N 팀 공고: Go 선호, Python·Java 허용, UI는 Svelte/Flutter/Vue/React/Angular 중 언급. 요약만 확인, 게시일 미표시. 등급 B(원문 미열람). [사실] — [SafelyYou Fleet](https://careers.safely-you.com/jobs/198459-software-developer-fleet)(접근 시 410, 검색 요약 기준), [C&N](https://careers.safely-you.com/jobs/124311-software-developer-c-n)

**Honor (홈케어 마켓플레이스)**
- Senior Staff Full Stack 공고: Python, Thrift, MySQL, AWS, JavaScript·React, Looker·Datadog. 다른 공고는 Python 서비스를 Kubernetes·서버리스로 운영. 스택 사이트는 "전체 프로덕션 스택은 비공개"라고 적음. 요약만 확인. 등급 B(원문 미열람). [사실] — [Taro 재게시](https://www.jointaro.com/jobs/honor-technology/senior-staff-full-stack-engineer), [Greenhouse](https://job-boards.greenhouse.io/honor/jobs/7717810002)

**Papa (동반 돌봄 서비스)**
- Elixir 백엔드 엔지니어 공고 여러 건(Staff/Senior). 집계 사이트 기준이라 원문 확인 못 함. 요약만 확인. 등급 B(원문 미열람). [사실] — [Jobera](https://jobera.com/job/papa-staff-backend-software-engineer-elixir-community-50459060/)

### 추론
- 위 벤더들의 백엔드는 .NET(ALIS, Aline 일부, MatrixCare 일부, Yardi), Java/Spring(PCC, MatrixCare 일부), Node/TypeScript(Inspiren), Python·Go(SafelyYou, Honor), Elixir(Papa)로 갈린다. 하나로 수렴하는 패턴은 없다. [추정]
- 마이크로서비스 + Kubernetes를 명시한 곳은 PCC, 일부 Honor·August Health다. 이 셋은 공고 상 "팀 단위" 근거다. [추정]

### Gaps
- WelcomeHome, Caremerge, K4Connect, Aline(시니어리빙 쪽), Papa·CareRev의 제품 전체 스택, Honor의 DB 외 상세는 못 찾음.
- PCC의 AWS vs Azure 비중, Snowflake 사용 여부(이번 검색에선 미등장)는 [미확인].

---

## 2. 인접 PMS (짧게, 근거가 단단한 것만)

### Takeaway
- 호텔·임대 PMS 중 Mews는 .NET + Azure로 근거가 가장 풍부하다. [사실, B] AppFolio는 Rails + React + MySQL + AWS 조합이 공고에 일관되게 나온다. [사실, B]

### 근거
- **Mews**: 백엔드 C#/.NET(ASP.NET MVC, Entity Framework를 .NET Core로 이전 중이라는 표현), Azure SQL·Redis·Cosmos DB, 프런트 React+TypeScript, 데이터 쪽 Databricks·dbt·Kafka·Spark, IaC Terraform·Pulumi, CI/CD Azure DevOps·GitHub, 모니터링 Sentry·Coralogix·Azure Monitor, "다중 리전 지원" 문구. Kubernetes는 못 찾음. 요약만 확인, 게시일 미표시. 등급 B(원문 미열람). [사실] — [Built In Staff SWE](https://builtin.com/job/staff-software-engineer/7639070), [Built In SWE](https://builtin.com/job/software-engineer/7094374)
- **AppFolio**: 공고 본문에 Ruby on Rails, React, MySQL, AWS, SOA가 함께 등장. 인프라 공고는 Lambda·EC2·EKS·S3·SQS·DynamoDB·RDS·Terraform·Kubernetes, 일부는 TypeScript·GraphQL·Go·Python·Temporal. 요약만 확인(원문 jobvite 링크는 404). 등급 B(원문 미열람). [사실] — [Jobvite](https://jobs.jobvite.com/appfolio-internal/job/oMtpAfwY), [Monster](https://www.monster.com/job-openings/sr-software-engineer-mixed-portfolio-foundation-washington-dc--c6f1f820-f014-4389-b6df-e8d83201f2d5)
- **Apaleo**: 백엔드 .NET 8+ 컨테이너(Docker), 일부 Terraform·CloudFormation 언급. 원문 페이지는 이미 내려가 있었고 본문 확인 못 함. 요약만 확인. 등급 B(원문 미열람). [사실/미정] — [RemoteFirstJobs](https://remotefirstjobs.com/companies/apaleo/jobs/senior-backend-engineer-net-715953)
- **RealPage**: 일부 공고가 Java·Ruby on Rails을 언급. "Docker·Kubernetes·Azure·AWS"는 제3자 공고 재게시 문구라 신뢰도 낮음. 등급 B-/C. [사실, 약함] — [Teal](https://www.tealhq.com/job/sr-software-engineer-java-ror_7ea1ace7a3518617e2080ed836c3c7698bb0a)
- **Entrata, Cloudbeds, Buildium, Oracle OPERA Cloud**: 근거 있는 스택 정보 못 찾음.

### Gaps
- Yanolja Cloud는 아래 한국 절 참고.

---

## 3. 한국 시니어·돌봄·주거 테크

### Takeaway
- 한국 쪽 직접 근거로는 **MGRV(맹그로브)** 가 가장 가치가 크다. 공고에 PMS가 직접 언급되고, 백엔드가 Python(FastAPI/Django)+PostgreSQL 계열이다. 또한 [지원 회사] 시니어 사업 인력([지원 회사] 임원)이 MGRV 출신이라는 기존 조사와 이어진다. [사실, B]
- 케어닥, 효돌, 와이즈케어, 케어포(한강시스템) 등 국내 시니어 돌봄 업체의 현재 스택 근거는 거의 못 찾았다. [사실]

### 근거
**MGRV(맹그로브 코리빙, 엠지알브이)**
- Python Backend Engineer(3~10년, 상시채용): Python, FastAPI 또는 Django(DRF), RDBMS(PostgreSQL 등), SQLAlchemy/Django ORM, asyncio. 우대: Redis, Docker, CI/CD, AWS/GCP/Azure. 업무에 PMS(Property Management System), 홈페이지, 운영 어드민, 입주·계약·결제·시설 관련 백엔드 포함. 게시일 미표시, 열람. 등급 B. [사실] — [원티드 wd/374348](https://www.wanted.co.kr/wd/374348), [리멤버 326213](https://career.rememberapp.co.kr/job/posting/326213)
- Product Engineer(LP Group, 5년 이상): Java, Kotlin, Python, AWS 명시. 자격요건에 JavaScript/TypeScript, React, Next.js. DB 언급 없음. 같은 서비스군(공실 조회, 비대면 입주계약 홈페이지, PMS, 출입 제어, 커뮤니티)을 다룬다고 소개. 게시일 미표시, 열람. 등급 B. [사실] — [DemoDay 9460](https://demoday.co.kr/recruits/9460)
- 두 공고는 서로 다른 직무라, 한 회사가 "Python 백엔드 + Java/Kotlin/Next.js 프런트·프로덕트"를 함께 말한다. 한 스택으로 단정하지 않는다. [추정]
- PMS가 별도 서비스(공고 문구)인지 모놀리스 안의 모듈인지는 공고로 알 수 없다. [미확인]

**트러스테이(노크타운)**
- 야놀자클라우드 관련 2021 기사에 클라우드 솔루션 계열사로 이름이 올라 있다(산하정보기술, 이지테크노시스, 젠룸스 등과 함께). 열람. [사실] — [파이낸셜뉴스 2021-08-24](https://www.fnnews.com/news/202108241205125478)
- Product Engineer 공고(inthiswork 재게시)는 본문이 잘려 스택 확인 못 함. [미확인] — [inthiswork](https://inthiswork.com/?p=347428)
- 노크타운 관리자 앱 출시(2025-06), 2021-03 설립, 프롭테크 분류는 혁신의숲 요약 기준. 등급 C. [사실, C] — [혁신의숲](https://www.innoforest.co.kr/company/CP00012679)

**야놀자클라우드 / 산하IT (호텔 PMS)**
- 호스피탈리티 SaaS, 170여 개국 3.7만 고객사, 객실 관리 솔루션 Y FLUX. 채용 페이지에는 열린 공고 0건, 기술 태그 없음. 열람. [사실] — [원티드 야놀자클라우드](https://www.wanted.co.kr/company/26088)
- 2021 기사에서 클라우드 계열 구성에 산하정보기술이 포함. 기사에는 AWS·EKS·MSA 언급이 없다. 열람. [사실] — [파이낸셜뉴스 2021-08-24](https://www.fnnews.com/news/202108241205125478)
- 검색 요약 한 곳이 "야놀자가 Amazon EKS를 쓴다"고 했으나, 근거 기사를 열어 보니 해당 언급이 없었고 AWS 고객 사례도 못 찾았다. **EKS 주장은 확인하지 못했다.** [미확인]
- 제3자 스타트업 디렉터리가 Java/Spring, React/Vue, AWS/Kubernetes를 적었다는 요약이 있으나 출처 페이지를 열지 못했다. 등급 C 이하. [미확인]
- 기술 블로그·산하IT 개발 공고는 못 찾음.

**케어닥(어르신 돌봄 플랫폼)**
- StackShare 페이지(제3자, 사용자 등록 정보)에 Next.js, React Native, Node.js, Golang, TypeORM, Redis, MariaDB, Google Cloud, Kubernetes, Terraform, CircleCI가 올라 있다는 요약. 페이지 접근은 429로 실패, 등록 시점 불명. 등급 C. [사실, C] — [StackShare](https://stackshare.io/companies/caredoc)
- 케어닥 자체 개발 공고(2019년 React/서버 개발자)는 마감·오래됨. 현재 공고는 못 찾음. 케어랩스(다른 회사로 보임)의 원티드 공고는 케어닥과의 관계 미확인이라 제외. [사실/미정]

**직방 (스마트홈)**
- 스마트홈 서비스 백엔드 공고: Java Spring Boot, Node.js, 테스트 자동화·Clean Architecture 경험 우대, AWS IoT Core 개발 경험 우대. 중개 플랫폼 쪽 백엔드 공고는 Kotlin·TypeScript·C#·Java·Python·Go 중 택일, AWS·GCP. 요약만 확인, 게시일 미표시. 등급 B(원문 미열람). [사실] — [Jobgether 스마트홈](https://dynamic.jobgether.com/offer/67e465d7211d0e724de8fb8a-jigbang-smarthome-seobiseu-baegendeu-gaebalja-java-spring-boot-node.js), [Jobgether Sr. Backend](https://dynamic.jobgether.com/offer/67f6bd1f3b1cb2ad1738475b-jigbang-sr.-backend-engineer)

**네이버 클로바 케어콜 (AI 안부 전화)**
- 하이퍼클로바 기반, 수면·건강·식사·외출·운동 상태 추출, 기억 모델, 지자체 담당자용 대시보드 제공. 2022-05 정식 오픈. 열람. 등급 A에 가까운 컨퍼런스 보도(DEVIEW 2023-02-28)이나 보도 매체 기사라 A로 올리지 않고 B-로 둔다. 인프라·배포 구조는 기사에 없음. [사실] — [바이라인네트워크](https://byline.network/2023/02/0228_06/)
- 2026-03 발표 기준 150여 개 기관·약 5만 명 대상 제공이라는 검색 요약이 있다. 원문 미열람. [사실, 약함] — [네이버 보도자료](https://navercorp.com/media/pressReleasesDetail?seq=34429)

**삼성물산 홈닉(Homeniq), 코오롱 하우스비전, 현대건설 마이힐스, GS건설 자이AI, 롯데, 호반, KT/SKT 돌봄, SK쉴더스**
- 개발 공고 기반의 스택 근거 못 찾음. 홈닉은 2025-01 기준 5만 가구 이상이라는 기사 정도만 있고 스택은 없음. [사실/미확인]

**케어포(한강시스템), 보살핌, 스마일시니어, 한국시니어연구소, 효돌, 와이즈케어, 마이시니어, 제온스**
- 개발 공고·기술 블로그 모두 못 찾음. 케어포는 사회복지사 공고에서 "케어포 사용 가능자 우대"라는 현장 사용 흔적만 확인(스택 아님). [사실] — 검색 요약 기준. 한강시스템이 정확한 회사명인지도 확인 못 했다. [미정]

### 추론
- 국내에서 "PMS"를 공고 문구로 직접 밝힌 곳은 MGRV 하나였다. [지원 회사] 지원 맥락에서 가장 가까운 비교 대상이다. [추정]
- 국내 시니어 돌봄 회사는 공개 개발 공고 자체가 거의 없다. 스택을 모르는 것이지 "없다"는 뜻이 아니다. [추정]

### Gaps
- 야놀자 PMS 실제 클라우드·아키텍처 근거, 산하IT 개발 직군 공고.
- 케어닥 최신 공고, 효돌·와이즈케어의 개발 조직 규모와 스택.

---

## 4. 국내 시니어 레지던스 운영사

### Takeaway
- 삼성노블카운티, 더시그넘하우스(서울시니어스타워), KB골든라이프케어, 롯데 VL, 더클래식500 등 어느 운영사에서도 자체 시스템, 그룹 SI 계약, 나라장터 공고를 **못 찾음**. [사실]

### 근거
- "입주자 앱·시스템 구축 SI 사업자 선정"으로 검색해도 해당 운영사 관련 발주·사업자 선정 기사는 없었다. 일반 실버타운 소개 기사와 2010년 학술 논문만 나옴. [사실] — 검색 요약 기준, 2026-11-04. 나라장터 직접 검색은 하지 못했다. [미확인]

### Gaps
- 나라장터, 그룹 SI(삼성SDS, 롯데이노베이트, KB데이타시스템) 쪽 발주 확인은 직접 접근이 필요하다. 이번엔 못 했다.

---

## 5. [지원 회사] 계열 IT (공개 자료 기준)

### Takeaway
- [지원 회사] 본사·계열의 클라우드 전환, 차세대 시스템, 개발 직군 공고에서 스택을 알 수 있는 자료를 **못 찾음**. [사실]

### 근거
- [지원 회사] 클라우드 전환 검색은 현대상선(Oracle 선정, 2019), 현대차·기아(AWS ERP) 등 **다른 그룹** 사례만 나왔고, [지원 회사]과 무관하므로 반영하지 않는다. [사실] — 검색 요약 기준
- [지원 회사] IT 개발자 공고 검색도 현대오토에버·현대캐피탈 공고만 나왔다(Java·Spring·Oracle, Kotlin·Spring Boot·Kubernetes 등). 이는 현대자동차그룹 계열이고 [지원 회사] 계열이 아니므로 근거로 쓰지 않는다. [사실]
- [지원 회사] Tech Lead / Backend 공고의 기술 스택 항목은 비어 있다. [사실] — [원티드 wd/392883](https://www.wanted.co.kr/wd/392883), 기존 조사 `company-[지원 회사].md`(열람 2026-11-02)
- [지원 회사] PMS 기획 공고는 ERP·결제·CRM·IoT·출입통제 연동을 명시한다. 어떤 ERP인지는 없다. [사실] — [원티드 wd/389305](https://www.wanted.co.kr/wd/389305), 기존 조사 `company-[지원 회사].md`
- [지원 회사]은 [지원 회사] 사옥·대학병원 등 시설을 관리하는 자회사로 알려져 있으나 IT 스택 정보는 없다. [사실] — [잡코리아](https://www.jobkorea.co.kr/company/16152436), 기존 조사 기준

### 추론
- [지원 회사]가 붙을 수 있는 연동 대상(그룹 ERP, [지원 회사] 시스템)의 스택은 공개 자료로 알 수 없다. 연동 방식은 인터뷰나 입사 후 확인할 사안이다. [가설]

---

## 6. 공통 패턴 점검 (모듈러 모놀리스 vs MSA, 온프레 vs 클라우드, 멀티테넌트)

### Takeaway
- 공고만으로 "모듈러 모놀리스"를 확인한 곳은 **없음**. 마이크로서비스를 말하는 곳은 PCC(Spring Boot 마이크로서비스, Kubernetes, Kafka), August Health(Kubernetes) 등이다. 다만 공고 문구는 팀 단위 요구 사항이다. [사실, B]
- 클라우드: 확인된 곳은 거의 모두 클라우드 사용(Azure: PCC, Mews, ALIS 우대, Eldermark 호스팅; AWS: AppFolio, Inspiren, MGRV 우대, 직방, MatrixCare 일부). 온프레미스를 명시한 근거는 못 찾음. [사실, B/C]
- 멀티테넌트 vs 싱글테넌트: 공고에 명시한 곳 못 찾음. [미확인]

### Gaps
- 아키텍처 스타일을 증명하려면 공식 엔지니어링 글(A 등급)이 필요한데 이번에 한 건도 못 찾았다. 컨퍼런스 발표, GitHub 조직, 클라우드 고객 사례(AWS/Azure)를 후속으로 봐야 한다.

---

## 요약 표

| 회사 | 분류 | 언어·프레임워크 | DB·데이터 | 클라우드·인프라 | 모바일 | AI | 근거 등급·날짜 |
|---|---|---|---|---|---|---|---|
| PointClickCare | 글로벌 케어·시니어 EHR | Java, Spring Boot, JS/React, Gradle (마이크로서비스) | MySQL, PostgreSQL, MSSQL, Redis, Kafka(+Avro), Hudi/Trino/Spark/Databricks | Azure·AKS, Kubernetes, Terraform, (일부 AWS 병기) | 못 찾음 | AI·NLP 언급, 개발 도구 Claude Code·Copilot | B, 공고 게시일 미표시 (한 건은 2026-04-24 삭제), 열람 2026-11-04 |
| ALIS (Medtelligent) | 글로벌 어시스티드 리빙 | C#, ASP.NET MVC/Core, Blazor, EF, Dapper | SQL Server | Azure 우대 | 못 찾음 | 못 찾음 | B, 만료 공고, 열람 2026-11-04 |
| MatrixCare (ResMed) | 글로벌 EHR | C#/.NET Core 또는 Java·Spring·Node, React | 못 찾음 | AWS, Docker, Terraform | 못 찾음 | 못 찾음 | B(원문 미열람), 게시일 미표시, 2026-11-04 |
| Yardi (시니어리빙) | 글로벌 PMS·EHR | C#, VB.NET, Angular, (일부 Java) | SQL Server, Oracle | Yardi cloud 구조 못 찾음 | 못 찾음 | 못 찾음 | B(원문 미열람), 2026-11-04 |
| Eldermark | 글로벌 시니어리빙 CRM | 못 찾음 | 못 찾음 | Azure 프라이빗 클라우드 호스팅 | 못 찾음 | 못 찾음 | C, 2026-11-04 |
| August Health | 글로벌 시니어리빙 | React, TypeScript, Scala | 못 찾음 | Kubernetes | 못 찾음 | 못 찾음 | B(원문 미열람), 2026-11-04 |
| Aline | 글로벌 시니어리빙 | C#/.NET 우대, React, Node.js | 못 찾음 | 못 찾음 | 못 찾음 | 못 찾음 | B(원문 미열람), 2026-11-04 |
| ECP | 글로벌 시니어리빙 SaaS | Lucee(CFML), React | 못 찾음 | 못 찾음 | 못 찾음 | 못 찾음 | B(원문 미열람), 한 건 2025-11-19 표기 |
| Inspiren | 글로벌 케어 플랫폼·기기 | TypeScript, Node.js, React, (Python·C++) | PostgreSQL, DynamoDB | AWS Lambda·Fargate·SQS·SNS·Kinesis·RDS | 못 찾음 | 개발 도구 Cursor·Claude Code, 서비스 AI는 못 찾음 | B, 2026-08-05 삭제, 열람 2026-11-04 |
| SafelyYou | 글로벌 낙상 감지 | Go, Python, (Java), Svelte/Flutter/Vue/React/Angular 중 | 못 찾음 | AWS 또는 GCP, 엣지 기기 OTA | Flutter 언급 | 컴퓨터 비전 제품, 스택 못 찾음 | B(원문 미열람), 2026-11-04 |
| Honor | 글로벌 홈케어 | Python, Thrift, JS, React | MySQL, Looker | AWS, Kubernetes, 서버리스 | 못 찾음 | 못 찾음 | B(원문 미열람), 2026-11-04 |
| Papa | 글로벌 동반 돌봄 | Elixir | 못 찾음 | 못 찾음 | 못 찾음 | 못 찾음 | B(원문 미열람), 2026-11-04 |
| Mews | 인접 호텔 PMS | C#/.NET, ASP.NET, React·TypeScript | Azure SQL, Redis, Cosmos DB, Databricks·dbt·Kafka·Spark | Azure, Terraform·Pulumi, Azure DevOps·GitHub | 못 찾음 | 못 찾음 | B(원문 미열람), 2026-11-04 |
| AppFolio | 인접 임대 PMS | Ruby on Rails, React, TypeScript, GraphQL, Go, Python | MySQL, DynamoDB, RDS | AWS Lambda·EC2·EKS·S3·SQS, Terraform, Kubernetes, Temporal | 못 찾음 | 못 찾음 | B(원문 미열람), 2026-11-04 |
| Apaleo | 인접 호텔 PMS | C#/.NET 8+ | 못 찾음 | Docker, Terraform·CloudFormation | 못 찾음 | 못 찾음 | B(원문 미열람, 원문 삭제), 2026-11-04 |
| RealPage | 인접 임대 PMS | Java, Ruby on Rails | 못 찾음 | Docker·Kubernetes·Azure·AWS (약한 근거) | 못 찾음 | 못 찾음 | B-/C, 2026-11-04 |
| MGRV(맹그로브) | 한국 코리빙 운영·PMS | Python(FastAPI, Django), Java·Kotlin, TypeScript·React·Next.js | PostgreSQL 등, Redis 우대 | AWS (+GCP/Azure 우대), Docker | 못 찾음 | 못 찾음 | B, 게시일 미표시, 열람 2026-11-04 |
| 야놀자클라우드/산하IT | 한국 호텔 PMS | 못 찾음 (제3자 Java/Spring 요약은 미검증) | 못 찾음 | EKS 주장은 미확인 | 못 찾음 | 못 찾음 | 스택 근거 없음, 사업 정보만 B, 열람 2026-11-04 |
| 트러스테이(노크타운) | 한국 코리빙 | 못 찾음 | 못 찾음 | 못 찾음 | 관리자 앱 출시(2025-06) | 못 찾음 | C, 2026-11-04 |
| 케어닥 | 한국 시니어 돌봄 | Next.js, React Native, Node.js, Go, TypeORM | MariaDB, Redis | Google Cloud, Kubernetes, Terraform, CircleCI | React Native | 못 찾음 | C(사용자 등록), 원문 접근 실패, 2026-11-04 |
| 직방 (스마트홈) | 한국 프롭테크·스마트홈 | Java Spring Boot, Node.js | 못 찾음 | AWS, AWS IoT Core 우대 | 못 찾음 | 못 찾음 | B(원문 미열람), 2026-11-04 |
| 네이버 클로바 케어콜 | 한국 AI 안부 전화 | 못 찾음 | 못 찾음 | 인프라 못 찾음 | 해당 없음(전화) | 하이퍼클로바 기반, 대화 상태 추출·기억 | B-(기사), 2023-02-28 |
| [지원 회사] | 한국 시니어 하우징 사업 주체 | 못 찾음 ([지원 회사] 공고 스택란 비어 있음) | 못 찾음 | 못 찾음 | 못 찾음 | [지원 회사] PMS 기획은 AI Agent 기획 포함 | 공개 자료 기준, 스택 근거 없음 |
| 삼성노블카운티·더시그넘·KB골든라이프케어·롯데 VL·더클래식500 | 한국 시니어 레지던스 운영사 | 못 찾음 | 못 찾음 | 못 찾음 | 못 찾음 | 못 찾음 | 근거 없음, 2026-11-04 |

## 패턴 요약 (근거가 지지하는 범위만)
- 이번 수집에서 **A 등급(공식 기술글) 근거는 0건**이다. 아래는 모두 채용 공고(B)와 제3자(C) 기반이고 팀 단위 근거다. [사실]
- 글로벌 시니어리빙·케어 벤더의 백엔드 언어는 .NET, Java/Spring, TypeScript/Node, Python/Go, Elixir로 분산돼 있고 하나로 수렴하지 않는다. [사실]
- 확인된 벤더는 거의 모두 클라우드(Azure 또는 AWS) 사용을 언급한다. 온프레미스를 명시한 근거는 못 찾았다. [사실]
- 마이크로서비스를 명시한 곳은 PCC 등 소수이고, 모듈러 모놀리스를 명시한 곳은 없다. 멀티테넌트 여부를 명시한 곳도 없다. [사실]
- Spring Boot + PostgreSQL 조합이 한 공고에 함께 나온 곳은 PCC Principal 공고(Java/Spring Boot, PostgreSQL·MSSQL)다. Next.js는 한국 사례(MGRV, 케어닥 StackShare)에서만 나왔다. AWS 서울 리전 사용을 직접 밝힌 근거는 못 찾았다. [사실]
- 한국에서 PMS를 공고 문구로 명시한 곳은 MGRV 한 곳이고, 그 PMS 백엔드는 Python/PostgreSQL 계열로 보이는 공고가 있다. 다만 이것이 PMS 전체의 스택인지는 불명이다. [사실/추정]
- 공고에 AI 코딩 도구(Claude Code, Cursor, Copilot)를 쓴다고 적은 곳이 PCC와 Inspiren 두 곳 있다. 서비스 자체의 AI 스택과는 별개다. [사실]

## 못 찾은 것
- 공식 엔지니어링 블로그·개발 문서·GitHub 조직 근거(A 등급) 전반. PCC, Mews, AppFolio 등은 이번 호출 한도에서 직접 확인하지 못했다.
- Yardi cloud 호스팅 구조, WelcomeHome, Caremerge, K4Connect, CareRev, Cloudbeds, Entrata, Buildium, Oracle OPERA Cloud의 스택.
- 야놀자/산하IT PMS의 실제 스택과 클라우드, 야놀자 EKS 주장의 근거.
- 케어닥 최신 공고, 케어포(한강시스템), 보살핌, 스마일시니어, 한국시니어연구소, 효돌, 와이즈케어, 마이시니어, 제온스의 개발 스택.
- 삼성물산 홈닉, 코오롱 하우스비전, 현대건설 마이힐스, GS건설 자이AI, 롯데, 호반, KT/SKT 돌봄, SK쉴더스의 개발 공고 스택.
- 국내 시니어 레지던스 운영사의 자체 시스템, 그룹 SI, 나라장터 발주 (나라장터는 직접 조회하지 못함).
- [지원 회사]의 IT 스택, ERP 종류, 클라우드 전환 여부.
- 모듈러 모놀리스, 멀티테넌트, 온프레미스에 대한 직접 근거.
- 이번에 열람하지 못해 요약만 확인한 행(표에서 "원문 미열람")은 후속에 원문을 열어 확인해야 한다.
