# 리서치 축 7 출처: 운영 소프트웨어(PMS·PropTech)
열람일: 2026-11-02 (별도 표기 없으면 동일)

**신뢰도 표기**: 직접=WebFetch로 본문 확인 / 검색요약=WebSearch 요약만 확인(원문 미열람, 일부 사이트는 403) / 제3자=벤더 아닌 목록·리뷰 사이트(마케팅·오류 가능).
Yardi·Entrata 공식 페이지는 403으로 본문을 못 열었다. 해당 항목은 검색요약 기준이다.

| 번호 | 출처(링크) | 날짜 | 신뢰도 | 확인한 내용(요약) |
|---|---|---|---|---|
| B1 | https://intuitionlabs.ai/software/assisted-living-senior-living/ccrc-continuing-care-retirement-community-management/yardi-senior-living-suite | 열람 11-02 | 제3자·검색요약 | Yardi Senior Living Suite 구성: Voyager Senior Housing(자산·입주자 청구·census), EHR, eMAR, Senior IQ(분석), Senior CRM(RentCafe Senior CRM). 가격 비공개. |
| B2 | https://www.yardi.com/suite/care-suite/ | 열람 11-02 | 검색요약(403) | Care Suite = Yardi EHR + eMAR. 케어 플랜·청구 옵션 설정 가능(회사 주장). |
| B3 | https://www.yardi.com/blog/?p=12605 | 열람 11-02 | 검색요약 | Senior CRM 데이터가 Suite 전체로 흐른다(회사 주장). 입주 예정자 프로필·건강정보가 EHR로 연동(회사 주장). |
| B4 | https://www.softwareadvice.com/long-term-care/medtelligent-alis-profile/ | 열람 11-02 | 제3자·검색요약 | ALIS(Medtelligent): 클라우드. eMAR/EHR/CRM/입주(move-in)/청구/인사이트 모듈. 연동 약 60개(벤더식 목록), open API 여부는 출처 간 상이. |
| B5 | https://www.getapp.com/assisted-living-software/a/matrixcare-senior-living-facility | 열람 11-02 | 제3자·검색요약 | MatrixCare Senior Living: 이 목록은 API 없음으로 표기. 다른 목록(softwarefinder)은 API 제공으로 표기 → API 공개 여부 [미확인]. |
| B6 | https://slashdot.org/software/comparison/Eldermark-vs-MatrixCare/ | 열람 11-02 | 제3자·검색요약 | Eldermark: 임상·청구·분석·운영을 묶은 올인원, API 있음으로 표기. MatrixCare 연동 목록에 ALIS, Carefeed 등. |
| B7 | https://www.mcknightsseniorliving.com/?p=7331 | [날짜 미확인] | 검색요약 | ALIS와 리드 관리 플랫폼 연동 보도. |
| B8 | https://docs.mews.com/getting-started/glossary | 열람 11-02 | 직접 | Mews 개체: Enterprise(단일/멀티프로퍼티 고객), Property, Chain, Portfolio(Multi-Property), Service(Bookable/Additional), Product, Resource/Space/Category, Rate, Customer/Company/Profile, Reservation(ServiceOrder, Owner+Companion), Bill(folio, Profile에 귀속), AccountingItem(Order/Payment), AccountingCategory, Outlet, Integration, Access Token/Portfolio Access Token. |
| B9 | https://docs.mews.com/connector-api/use-cases/events | 열람 11-02 | 직접 | 폴링 대신 웹훅(ServiceOrderUpdated 등)으로 예약 변경을 받으라고 안내. |
| B10 | https://docs.mews.com/connector-api/deprecations/migration-guide-get-reservations | 버전 2023-06-06 | 검색요약 | 새 Get all reservations는 extent 미지원, 연관 개체는 별도 호출. Resource가 Space를 대체(2020), Rate·제약이 Enterprise→Service 수준으로 이동. 요청마다 ClientToken+AccessToken(제3자 래퍼 설명). |
| B11 | https://docs.entrata.com/api/v1/documentation/getLeases (및 sendPropertyUnits, sendLeases) | 열람 11-02 | 검색요약(403) | Entrata 공식 API 문서에 properties/units/leases 메서드 존재. getLeases는 property ID 필수, customer ID·unit·building·입퇴실일 필터. 고객·원장 메서드 페이지는 확인 못함. |
| B12 | https://tray.ai/connectors/entrata-integrations.md | 열람 11-02 | 제3자·검색요약 | Entrata가 커스텀 XML 기반 API, 인증·rate limit 특이하다는 설명. (Reddit 언급 "JSON" 주장과 상충 → [미확인]) |
| B13 | https://docs.supergood.ai/entrata-api | 열람 11-02 | 제3자(비공식 래퍼) | 비공식 REST 래퍼: properties, property별 units, leases. Entrata 공식 API 아님. |
| B14 | https://www.capterra.com/p/92228/AppFolio-Property-Manager/reviews/?page=6 | 2026 | 제3자·리뷰 | AppFolio 사용자 후기: 오너 명세서(owner statement), 재무제표, 오너 포털 존재. 소유주가 여러 자산을 가질 때 통합 명세서 가능하나 기본값·발견성은 불만(리뷰 기준). |
| B15 | https://biggerpockets.com/forums/48/topics/1111278-owner-statement-on-appfolio | [날짜 미확인] | 제3자·포럼 | 한 단지가 건물별 별도 대차대조표로 나뉘어 발송된 사례(소유주 시각). |
| B16 | https://www.softwareadvice.co.uk/software/528032/Yardi-Investment-Accounting | 열람 11-02 | 제3자·검색요약 | Yardi Voyager는 다중 법인·다중 자산 GL(복수 장부, 법인간 회계), Investment Accounting은 자본 호출·분배·파트너 이전. SEO성 사이트 다수라 신뢰 낮음. |
| B17 | https://www.businesswire.com/news/home/20260611736825/en/ | 2026-06-11 | 검색요약 | EliseAI-Zillow: AI Assist 쓰는 임차 희망자 지원률 43% 높음(회사·파트너 주장). EliseAI는 임대 문의 24/7(문자·이메일·챗·음성), 투어 예약·자격 확인. 시니어리빙을 지원 산업으로 목록화(디렉터리), 시니어 전용 사례·독립 검증은 [미확인]. 헬스케어 HealthAI(비임상 업무) 확장. |
| B18 | https://www.yardi.com/news/press-releases/yardi-launches-virtuoso-ai-agents-to-deploy-ai-powered-workflows/ | 2025-09-11 (후속 2026-06-15) | 검색요약(403) | Yardi Virtuoso AI 에이전트, 오픈 에이전트 아키텍처, Virtuoso Marketplace. 2026-06 기준 임대·입주자 서비스·정비·회계 에이전트(다가구, 회사 주장). 리싱 에이전트 Chat IQ. |
| B19 | https://www.realpage.com/blog/realpages-lumina-ai-leasing-agent/ | 열람 11-02 | 검색요약 | RealPage Lumina AI 플랫폼, AI Leasing Agent(24/7, OpenAI 모델 기반이라고 회사 설명), 리싱·입주자·재무 등 에이전트가 데이터 플랫폼 공유. |
| B20 | https://docs.oracle.com/en/industries/hospitality/integration-platform/axern/c_release_25_3.htm (및 https://oracle.com/a/ocom/docs/industries/hospitality/hosp-integration-platform-ds.pdf) | 2025-09 릴리스 | 검색요약 | OHIP: 개발자 포털, 셀프 가입, 샌드박스, API 3,100+(데이터시트)·3,400+(Oracle 글), 이벤트 구독, 역할 기반 접근(관리자/개발자/분석), Chain Code 검색, Oracle Cloud Marketplace 연계. |
| B21 | https://developers.cloudbeds.com/docs | 열람 11-02 | 직접 | Cloudbeds API 군(PMS, Insights, Accounting, 유통), API Key/OAuth2, 웹훅, 샌드박스, 그룹 계정(group account), 구현 가이드 분야(출입/도어락, 회계, CRM, 결제, 하우스키핑, POS 등), 마켓플레이스. |
| B22 | https://www.cloudbeds.com/hospitality-platform/ | 열람 11-02 | 검색요약 | 그룹 레벨 API로 포트폴리오 전체 속성에 한 세트 자격증명(회사 주장). 마켓플레이스 20,000+ 속성, 파트너 수는 페이지마다 400+/450+로 상이(회사 주장). |
| B23 | https://www.ambientproptech.com/resources/ambient-pms-realpage-yardi-entrata-resman | 2025-02-20 | 검색요약 | 스마트 아파트 플랫폼 Ambient가 RealPage·Yardi·Entrata·ResMan 연동 완료 발표(원격 출입 관리, 입퇴거 자동 반영)(회사 주장). DOOR도 Yardi·RealPage·Entrata·AppFolio 연동 주장. |
| B24 | https://supergood.ai/api-report-card/buildium , https://marketplace.buildium.com | 열람 11-02 | 제3자·검색요약 | Buildium Open API(읽기/쓰기, 웹훅, 샌드박스 — 제3자 설명), 상위 요금제 요구 주장은 Buildium 마켓플레이스 문구와 상충 → [미확인]. RealPage 연동은 RPX(표준 API) 마켓. |
| B25 | https://insurancenewsnet.com/oarticle/k4connect-launches-fusionos-as-a-stand-alone-integration-platform-enabling-seamless-technology-and-data-optimization-for-senior-living-operators | [날짜 미확인] | 검색요약 | K4Connect FusionOS: 시니어리빙용 통합 플랫폼, 제3자 포인트 솔루션 50+ 연결(회사 주장). 2025-04 Artemis Care 제휴. |
| B26 | https://hitconsultant.net/2025/01/28/safelyyou-secures-43m-for-ai-powered-solutions-for-senior-living-communities | 2025-01-28 | 검색요약 | SafelyYou $43M(C라운드). SafelyYou 사이트는 Yardi·ALIS·PCC 등 EHR 연동 목록과 "coming soon" 병기(회사 주장, 공개 API 문서는 못 찾음). 낙상 감지 99%+는 회사 주장. 2023 NOTIFY 연동, PalCare 호출벨 연동(날짜 [미확인]). |
| B27 | https://www.mobihealthnews.com/news/inspiren-raises-70m-ai-senior-care-platform | [날짜 미확인, 2025-09 $100M Series B 보도 별도] | 검색요약 | Inspiren: 안전·케어·인력 AI 플랫폼. 라운드·금액 출처 간 상이 → 수치 [미확인]. Solera "Alliance for Connected Senior Living" 파일럿에 ALIS 포함(파일럿일 뿐). |
| B28 | https://intuitionlabs.ai/software/assisted-living-senior-living/memory-care-documentation/caremerge | 열람 11-02 | 직접(제3자 목록) | Caremerge: 가족 참여 포털(보안 메시징, 활동 출석), eMAR, 약국 연동(QS/1 등), "API 제공". Linked Senior 제휴는 이 페이지에서 확인 못함(검색 요약에는 언급) → [미확인]. |
| B29 | https://welcomehomesoftware.com/post/integration-overview-connecting-to-the-welcomehome-software-senior-living-crm-1 | 2023-07-27 작성, 2025-07-22 갱신 | 직접 | WelcomeHome: open API 보유(회사 주장), 연동 예로 PointClickCare 등 의료 플랫폼·마케팅·가족 소통 도구. 청구 연동은 언급 없음. Sherpa·Enquire는 기능·연동 상세 [미확인](리뷰 요약만). |
| B30 | https://www.yanoljagroup.com/en/press_release/view?id=1523 | 2025-11-25 | 직접 | 산하IT WINGS PMS: 클라우드, 모듈형, 키오스크·RMS·객실제어 연동. 일본계 호텔 7개 브랜드에 공급, 한국 PMS 점유율 70% 이상(회사 주장), 일본 약 90개 호텔. 산하IT는 야놀자 계열(thevc.kr, thecompanycheck 요약). |
| B31 | https://www.unicornfactory.co.kr/article/2024032817160827316 | 2024-03-28 | 직접 | 제온스(ZEONS) ezREMS 임대관리 솔루션: 전자 고지서·계약서, 수납·청구 기능(당시 상반기 적용 예정). MGRV(맹그로브)가 도입 협약, 앱에서 지점·객실 타입별 공실, 예상 월 이용료, 투어 신청. |
| B32 | https://www.venturesquare.net/1005590 | 2025-09-23 | 직접 | 트러스테이 노크타운: 640개 단지·약 60만 세대, 앱 50여 기능(회사 주장), 홈 IoT, 커뮤니티 시설 예약, AI 차량 번호판 감시, 화재 감지. 관리비 청구 연동은 기사에 언급 없음. 임대자산 관리 HomeKnock, 스마트 코리빙 Hey. |
| B33 | https://apps.apple.com/us/app/id1570365791 | 열람 11-02 | 검색요약 | 케어포(한강시스템) 보호자 앱: 장기요양기관이 쓰는 "케어포" 프로그램 이용 시 건강정보·사진·식단표·급여 내역·상담 제공. (검색 결과 앱 2개 중 어느 쪽인지 불확실 → 앱 ID 재확인 필요) |
| B34 | https://www.etoday.co.kr/news/view/885106 | [날짜 미확인] | 검색요약 | 분양형 실버타운: 운영·의사결정 권한은 설치자, 노인복지법상 입소보증금 50% 이상 반환 보증보험 요구라는 설명. 이 항목은 검색 요약이 어느 기사 문장인지 특정하지 못함 → 법령 원문 확인 필요. |
| B35 | https://thevc.kr/sanhainformationtechnology | 열람 11-02 | 제3자·검색요약 | 산하정보기술 1994년 설립, WINGS PMS 주력, 서울. |

## 한계
- 해외 시니어리빙 SW(Yardi, MatrixCare, Eldermark, ALIS, Sherpa, Enquire)는 공식 문서 직접 열람 실패. 대부분 제3자 목록이라 모듈·API 항목은 "목록상 표기"다.
- 국내 시니어 전용 PMS는 "없다"를 증명하지 못했다. 검색에서 발견되지 않았다는 사실만 있다.
