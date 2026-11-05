# 해외 시니어리빙 운영 소프트웨어: 시스템 구성과 연동 아키텍처 (축 7 보강)
작성·열람일 2026-11-04. 상태: 초안(미승인). 선행 `../outputs/pms-landscape.md`, `axis7-pms-proptech.md`에서 확정된 내용(Mews/Cloudbeds/OHIP/Entrata 등, 제품별 모듈 목록)은 반복하지 않는다.

**표기법**
- 라벨: [사실] [추정] [가설] [미정] [미확인]. 벤더가 한 말은 "회사 주장"으로 표시한다.
- 확인 방식(괄호): **직접**=본문을 열어 읽음 / **검색요약**=검색 결과 요약만 봄(본문 못 엶) / **제3자**=벤더가 아닌 목록·블로그·경쟁사·통합대행사 글(이해관계 있을 수 있음).
- 날짜는 게시일을 우선하고, 없으면 "열람 2026-11-04".
- 이번 조사에서 만난 주요 접근 실패는 맨 끝 "못 찾은 것"에 모았다.

**이번 조사의 핵심 출처**
- LeadingAge CAST EHR Selection Matrix(2026-05 업로드 파일, 벤더 자기신고). 직접 열었다(XLSX를 로컬에서 파싱). 벤더 응답을 CAST가 검증하지 않았다고 파일에 명시되어 있고, 일부 칸은 오래됐다(PointClickCare "현재 버전 릴리스 2021-04", KLAS 점수 2018 기준). 그래서 아래에서는 "CAST 자기신고"로 표기한다. 포함된 제품은 13개(ACMS, American Data, Collabrios, ECP, Eldermark, GEHRiMed, MatrixCare, Netsmart, Oracle Health, PointClickCare, ResiDex, WellSky, Yardi EHR)이고 **ALIS, August Health, Caremerge, Aline, WelcomeHome은 없다**. https://leadingage.org/cast-ehr-selection-tool/ , 파일 https://leadingage.org/wp-content/uploads/2026/05/2026-CAST-EHR-Selection-Matrix-Participating-Vendor-Self-Review_MASTER.xlsx
- Eldermark NEXT Release Notes 2026.1(문서 작성일 2026-01-30). 직접 읽음. 헬프데스크에 올라온 PDF이며 파일 제목 머리에 "Internal"이 붙어 있어 공개 문서인지 불분명하다. https://helpdesk.eldermark.com/hc/en-us/article_attachments/46210015805851
- MatrixCare 백서 "A Corporate Commitment to Openness, Data Access, and Industry-Leading Interoperability"(2017-04). 직접 읽음. 9년 전 문서다. https://go.matrixcare.com/rs/227-DAM-058/images/MatrixCare-Commitment-to-Interoperability.pdf

---

## Q1. 제품별 스위트 구성, 단일 플랫폼 vs 인수 모듈, 호스팅·테넌시, API·인증·개발자 조건

### Takeaway
공식 개발자 문서를 끝까지 연 곳은 Eldermark(2026.1 릴리스 노트)뿐이다. PointClickCare의 FHIR 프로그램 조건은 제3자 정리(Nirmitee)가 PCC 페이지를 요약한 것이고, Yardi·ALIS·August는 공개 API 문서를 찾지 못했다. 테넌시(멀티테넌트 vs 고객별 DB)를 공식 문서로 확인한 사례는 하나도 없다.

### Cited Findings

**Yardi (Senior Living Suite / Voyager / EHR)**
- [사실] CAST 자기신고에서 Yardi EHR은 SaaS와 호스팅 모델 "예", 로컬 설치 "아니오", 설치 약 3,500곳, 현재 버전 릴리스 2025-03이다. 강점으로 "여러 사업 라인을 단일 플랫폼에서 지원"을 적었다(회사 주장). (직접, CAST 2026-05) https://leadingage.org/wp-content/uploads/2026/05/2026-CAST-EHR-Selection-Matrix-Participating-Vendor-Self-Review_MASTER.xlsx
- [사실] 같은 매트릭스에서 Yardi는 HL7 ADT 계열 이벤트 13종(A01, A02, A03, A05–A08, A11–A13, A21, A22, A52), NCPDP 10.6+, FHIR "ONC 공통 임상 데이터셋 게시·소비"는 "예", 기타 표준에 "HL7 FHIR", Carequality/TEFCA 경유 "2.4M 제공자"(회사 주장)를 적었다. API는 "Yes; Both(독점+개방)"이고 API 안내 링크로 yardi.com/services/senior-interfaces/ 를 줬다. (직접, CAST)
- [사실] 같은 매트릭스에서 "재무(청구·AR·AP·GL)" 예, "인사(스케줄·급여)" 아니오, 제3자 인터페이스 필요 "예"(NCPDP, HL7로 연동). SOC 2 감사 "예". HIPAA/HITECH "모두 충족"(회사 주장). (직접, CAST)
- [사실] 구성: Voyager Senior Housing(청구·census), EHR, eMAR, Senior CRM 등. 이 부분은 선행 노트 B1(제3자)에 있고 이번에 공식 확인은 못 했다. yardi.com/suite/senior-living-suite/ 는 403. (선행 노트 / 직접 시도 403, 2026-11-04)
- [사실] Voyager(임대·주거용 코어)의 API는 SOAP 기반이며 관리자가 발급한 자격증명이 필요하다고 통합대행사 글이 설명한다. 반면 Supergood는 "공개 API 없음, SOAP 계층은 파트너 프로그램 뒤에 잠김"이라며 F 등급을 줬다. 두 글 모두 Yardi 공식 문서가 아니다. (제3자) https://www.rapidevelopers.com/md/lovable-integration/yardi , https://supergood.ai/api-report-card/yardi-voyager
- [사실] 호스팅: 2011년 Yardi 보도자료는 Yardi가 자사 데이터센터에서 고객(Bloomfield Senior Living)의 Voyager 애플리케이션과 DB를 운영·유지한다고 밝혔다. 현재 Yardi는 데이터센터 15곳, CSA STAR Level 2 인증을 주장한다(회사 주장). 두 건 모두 검색 요약만 확인했다. (검색요약) https://www.yardi.com/news/press-releases/bloomfield-senior-living-gains-comprehensive-portfolio-management-with-yardi-voyager-senior-housing-platform/ (2011-04-05), https://www.yardi.com/apac/?p=398411 (403, 열람 2026-11-04)
- [미확인] Voyager가 단일 테넌트인지 멀티테넌트인지, 고객별 DB인지: 위 어느 출처에도 서술이 없다.
- [사실] Yardi EHR–SafelyYou 인터페이스: SafelyYou의 케어 측정값(직접/간접 케어 시간, 혼자 있는 시간 등)이 Yardi EHR로 들어간다. 기사 서술상 한 방향이고 실시간 여부는 언급이 없다. (직접, Mann Report 2024-10-22) https://www.mannpublications.com/mannreport/2024/10/22/yardi-ehr-releases-care-enhancing-interface-with-safelyyou/

**PointClickCare (PCC)**
- [사실] PCC "EHR for Senior Living"(독립거주·AL·메모리케어 대상) 솔루션 시트의 기능: 입주자 관리(입주 전~입주, 일시 부재), Secure Conversations, Connected Care Center(가족 포털), PointClickCare Connect(케어 협업 네트워크), 대시보드. 청구·CRM·회계는 이 시트에 없다. (직접, 2025-10 업로드 PDF) https://pointclickcare.com/wp-content/uploads/2025/10/PointClickCare-Solution-Sheet-EHR-for-Senior-Living.pdf
- [사실] CAST 자기신고: SaaS·호스팅 "예", 로컬 "아니오", 설치 22,000+(시니어리빙만의 수 아님), "재무·인사 포함 완전 통합 시스템" 아니오, 인사 아니오, 제3자 연동은 "HL7 및/또는 API", HL7 이벤트 15종(P05 포함), NCPDP, FHIR "게시·소비" **아니오**, 2015 ONC 인증 예, SOC 2 "예". API "Yes; Open"에 developer.pointclickcare.com 안내. (직접, CAST) 같은 파일의 FHIR 칸은 아래 PCC FHIR 프로그램과 어긋난다. 매트릭스 쪽이 오래된 응답일 가능성이 있다 [추정].
- [사실] 개발자 포털 메인(developer.pointclickcare.com)을 열었으나 제목 외 본문을 얻지 못했고, fhir.pointclickcare.com 은 403이었다. (직접 시도, 2026-11-04)
- [사실] 아래는 Nirmitee(PCC 연동 대행업체, 2026-10-28 게시·11-04 갱신)가 PCC 공개 페이지와 자체 점검을 정리한 것이다. (제3자) https://nirmitee.io/blog/pointclickcare-api-integration-guide/
  - USCDI Connector: 읽기 전용 FHIR R4, US Core 3.1.1 / USCDI v1. Marketplace 파트너 프로그램은 독자 REST API, 웹훅, 파트너 매니저가 추가되며 API 레퍼런스는 파트너 로그인 뒤에 있다.
  - 인증: SMART App Launch 기반 OAuth2. 광고된 grant는 authorization_code와 client_credentials, PKCE(S256). mTLS가 필요해 보인다는 것은 글쓴이의 추론이다.
  - 웹훅은 Marketplace 파트너만. USCDI Connector 앱은 `_since` 폴링이나 bulk export를 써야 한다.
  - 비용: 개발자 접근 무료. 고객이 앱·시설당 월 $65 부담(연 1회 개정 가능). Marketplace 비용은 비공개. 속도 제한 수치 비공개.
  - 절차: 파트너 신청 → 개발 앱(자동 승인, 공유 샌드박스) → 운영 앱(신원 확인 10영업일). 시설별로 고객이 Letter of Authorization(LOA)을 발급해야 하고 시설 활성화에 최소 2주.
  - 제약: 미국·캐나다 외 접근 금지, 60일 통지 해지.
- [사실] Supergood(PCC 대신 접근을 파는 업체)도 "고객 연결마다 LOA가 필요, 앱 진위 심사 약 10영업일, 공유 FHIR 샌드박스, 웹훅 비공개"를 말해 위와 맞는다. 다만 이 페이지는 Supergood가 스스로 "가상의 설계 연습"이라고 밝힌 부분(엔드포인트)을 포함한다. 위 일치 항목만 쓴다. (제3자, 2026-07-07 게시) https://supergood.ai/docs/pointclickcare-api
- [사실] PCC Marketplace 100번째 연동 발표: 2018 출범, 5,500+ 시설, 11개 활용 범주(회사 주장). 이 숫자는 2020-09-22 기준으로 오래됐다. (직접) https://pointclickcare.com/?p=32392
- [사실] Securitas Arial(호출·응급 시스템)이 ALIS와 PCC EHR에 직접 연동된다고 Securitas 페이지가 적었다는 검색 요약. 페이지는 403. 데이터 방향·실시간 여부는 확인 못 함. (검색요약) https://www.securitashealthcare.com/products/arial-software-integrations

**MatrixCare (ResMed → 매각 진행)**
- [사실] ResMed 10-K(회계연도 2026, 6월 말 결산): MatrixCare 사업을 $490M 현금에 매각하는 확정 계약을 2026-06-30에 체결, 종료는 회계 2027년 1분기(2026-07~09) 예상. 매각 범위에 Healthcare First, Citus, 홈헬스·호스피스 솔루션 포함. 10-K 앞부분 10만 자에서는 매수인 이름과 MatrixCare 단독 매출을 찾지 못했다(문서의 나머지 26만 자는 읽지 못함). (직접, 부분) https://www.sec.gov/Archives/edgar/data/0000943819/000094381926000047/rmd-20260630.htm
- [사실] 매수인은 Frazier Healthcare Partners(사모펀드), MatrixCare FY2026 매출 약 $220M·조정영업이익 약 $55M(예비치)이라는 보도. ResMed는 2018년 $750M에 인수했었다. (검색요약, 2026-07) https://www.healthcaredive.com/news/resmed-to-sell-software-business-matrixcare-to-private-equity-firm/824803/ , https://www.medtechdive.com/news/resmed-to-sell-matrixcare-for-490m-to-private-equity-firm/824709/
- [미확인] 거래가 실제로 종결됐는지(2026-11-04 시점).
- [사실] 구조(2017-04 백서, 회사 문서): 전 서비스가 Microsoft Azure에서 제공됨. 연동은 통합 엔진(Orion Health Rhapsody 기반)과 MatrixCare Public API로 이뤄지고, 엔진은 FTP, TCP 소켓, 웹서비스, REST와 HL7, XML, NCPDP, JSON을 다룬다. 외부 서비스가 승인되면 엔진이 "MatrixCare 고객 인스턴스"로 가는 암호화 경로를 정의한다. 인바운드는 엔진이 메시지를 파싱해 Public API를 호출하고, 아웃바운드는 고객 인스턴스의 아웃바운드 메시지 큐 항목을 엔진이 변환해 전송한다. (직접) 위 백서 URL
- [사실] 같은 백서: MyData 솔루션은 모든 라이선스 모듈의 운영 테이블을 운영 데이터 저장소(ODS)로 "하루 몇 차례" 복제해 고객과 승인된 대리인이 조회하게 한다. MyAnalytics는 그 위에 구축. DIRECT 메시징, IHE XDS 지원. FHIR는 "2018 전면 지원 계획"이라고 썼다(2017 시점 계획). (직접)
- [사실] 같은 백서: Connections 파트너 프로그램은 제품 파트너, 컨설팅·서비스 파트너, 약국 파트너, ISV 파트너 4범주로 나뉘고, 파트너를 정식 계약으로 검증된 곳만 고객 환경에 접속시킨다고 설명한다. 경쟁 제품과의 기본 연동은 지원하되 자사 모듈 간에는 더 높은 수준의 비공개 연동을 둘 권리를 유보하고, 환자 안전 위험이나 지식재산 대가 문제가 있다고 "자사 재량으로" 판단하는 연동은 지원하지 않는다고 적었다. (직접)
- [사실] CAST 자기신고(2026): API "Yes; Open", "100개 이상 API, 카탈로그는 요청 시", FHIR 게시·소비 "예", HL7 이벤트에 ADT, ORU, MDM, RDS 등, IHE BPPC 예, XCPD/XCA 아니오, Carequality 운영 사용 예, SOC 2 예, 설치 11,000+ 시설(스킬드너싱 3,200 / 시니어리빙 700 / 라이프플랜 900), 현재 버전 2026-04. (직접, CAST)
- [추정] 백서의 "MatrixCare 고객 인스턴스"와 ODS 복제 구조는 2017년 시점에 고객(조직)별 인스턴스에 가까운 구조를 시사한다. 현재도 같은지는 확인하지 못했다.

**Eldermark (NEXT)**
- [사실] 2026.1 릴리스 노트: 새 Integrator API는 승인된 외부 통합업체(EMR, 청구, 케어 조정 도구)에 아래를 제공한다. (직접, 문서일 2026-01-30)
  - 인증: OAuth client credentials. 외부 통합업체 인증은 내부 직원 인증과 분리. 통합업체마다 고유 자격증명.
  - 권한: 조직·커뮤니티 단위로 통합업체를 배정, 데이터 도메인별 접근 설정, 접근 on/off.
  - 읽기 도메인 8종: 기본 신상, 인구통계(관계 포함), Census(입퇴원·전실·호실·점유·케어 레벨), 의료 기록, 활력징후, 케어 플랜, SSN(제한), 보험·재무(보증인·청구 상태). 도메인마다 변경 알림 이벤트가 있다.
  - 웹훅: 통합업체가 구독할 갱신 유형을 선택하고, 이벤트에 HMAC 서명이 붙는다.
  - 쓰기: 통합업체가 입주자와 연락처를 생성(호실 배정 포함) 가능. 권한은 커뮤니티·리소스 유형으로 제한.
  - 온보딩: 고객 성공 매니저나 지원팀에 요청 → 구현팀이 계정·권한·자격증명 생성 → 문서 전달 → 이후 셀프서비스. 커뮤니티 목록 조회, 변경 구독 생성, 커뮤니티 전체 입주자 일괄 로드가 가능하다. 샌드박스·요금·속도 제한은 문서에 없다.
- [사실] CAST 자기신고(Eldermark): SaaS·호스팅·로컬 모두 "예", 설치 6,600+, 현재 버전 2026-03, API "Yes; Both"(세부는 "문의"), FHIR 게시·소비 "아니오"이나 "FHIR R4 대응" 질문은 "예", HL7 이벤트는 ADT와 약국, **SOC 2 감사 "아니오"**, HIPAA "모두 충족". "단일 통합 플랫폼" 예이고 인사는 "통합 파트너를 통한 스태핑만". (직접, CAST)
- [사실] 이전 목록(GetApp)의 "API 없음"은 위 2026.1 발표 이전 내용으로 보인다 [추정]. Supergood가 말한 "Postman 워크스페이스, 자격증명은 통합업체별 발급"은 릴리스 노트의 온보딩 절차와 방향이 맞는다. (검색요약/제3자) https://supergood.ai/docs/eldermark-api
- [사실] Notify는 Eldermark의 모바일 기반 호출·소통 소프트웨어이며 Eldermark 다른 제품과 통합된다고 한다. 타사 호출벨 하드웨어 연동이 아니라 자체 제품 간 통합 서술이다. 게시일 미확인. (검색요약) https://healthcarefacilitiestoday.com/posts/Eldermark-leap-frogs-other-nurse-call-and-communication-systems-with-Notify--9620
- [사실] CarePredict가 Eldermark와의 첫 연동을 밝힌 페이지가 있다(입주자 데이터 입력 간소화). (검색요약, 날짜 미확인) https://www.carepredict.com/integrations/eldermark

**ALIS (Medtelligent)**
- [사실] go-alis.com(medtelligent.com이 301로 이동) 플랫폼 구성: eHR/eMAR(복약 패스, PRN, 전자 의사 처방, 150개+ 스마트 알림), "RevOps"(CRM, 입주 서류, 퇴실 예측, A/R, 투자자 보고서, 세금 명세서, ALIS Pay, ALIS Connect, ALIS HQ), 청구, BI, "Ask ALIS" AI. 파트너 연동 "130+"와 ALIS App Store(추가 비용 없음)를 주장(회사 주장). 로고로 Inspiren, Direct Supply, CarePredict, Total Incontinence 노출. API, 호스팅, 가족 포털은 서술이 없고 Trust Center(trust.go-alis.com)는 열지 못했다. (직접, 열람 2026-11-04) https://www.go-alis.com/
- [사실] 2026-08 하순 ALIS가 TapRoot의 Ella와 elbi(치매 행동 지원 AI)를 인수했다. ALIS의 첫 인수이고 Ella는 당분간 별도 브랜드로 두며 통합 일정은 밝히지 않았다. 2,000개 이상 커뮤니티 고객이라는 이전 보도도 있다. (검색요약) https://www.citybiz.co/article/894499/alis-acquires-ella-and-elbi-to-expand-ai-powered-senior-care-platform/
- [추정] 첫 인수가 2026년이라는 점은 스위트의 대부분이 자체 개발이라는 신호다(다른 인수 이력은 찾지 못함). 확정은 아니다.

**August Health**
- [사실] 모듈: Move-Ins(전자서명), EHR, eMAR, Insights(분석·위험 예측), Billing & Payments, Care Track(모바일 케어 기록). CRM, 가족 포털, API 서술은 해당 페이지에 없다. HIPAA, SOC 1 배지와 Trust Center 링크가 있고 SOC 2·HITRUST는 명시되지 않았다. 호스팅 서술 없음. (직접, 열람 2026-11-04) https://www.augusthealth.com/more-info/platform-senior-living
- [사실] 발표된 연동: Teton(낙상·수면·활동 데이터가 August EHR로, August가 census를 Teton으로 보내는 양방향이라고 서술, 실시간 여부와 방식 미기재), Inspiren, SafelyYou, Kevala(인력 배치), Accushield(방문자 관리), SkyPoint(데이터 환경 커넥터). (Teton 건은 직접, 나머지는 검색요약) https://www.teton.ai/blog/august-health-and-teton-partner-to-bring-ai-powered-monitoring-directly-into-senior-living-ehrs (2026-02-09 게시, 보도자료 일자는 02-11로 불일치)

**Aline (Sherpa·Enquire·Glennis 통합), WelcomeHome, Caremerge/Linked Senior**
- [사실] Aline은 2022-10 Enquire, Glennis Solutions, Sherpa CRM이 합병해 2023-05 Aline으로 개명했다. Enquire CRM 기술·데이터 플랫폼을 장기 기반으로 채택했고 Sherpa 고객은 이전 중이다. 제품군: 성장(CRM, Smart Referral CRM, Prospect-Centered Selling, Discover by Roobrik, Connect, Nurture, Contact Center), 입주자 생활(Aline Care, eMAR, Quality, Menus by Grove, POS by Grove), 재무(Leasing & Billing, Payments, Accounting), Aline Intelligence. 커뮤니티 수는 같은 페이지에서 5,700+와 9,000+로 갈린다. 호스팅·테넌시·API 서술 없음. (직접, 2022-10-29 게시·2024-08-23 갱신) https://alineops.com/press-releases/enquire-glennis-solutions-and-sherpa-crm-rebrand-as-aline/
- [사실] "100+ 연동, API 제공"은 제3자 목록 표기이고 Aline 공식 연동 카탈로그는 못 찾았다. 2026-05 보도자료는 Prospect-Centered Selling이 Aline CRM에 완전 통합됐다고 발표했다. (제3자/검색요약) https://www.streetinsider.com/PRNewswire/Aline+Reintroduces+Prospect-Centered+Selling%C2%AE+Across+Its+Next-Generation+CRM+Platform/26439781.html
- [사실] OpenLoop Network(2026-03-31, LifeLoop 주도): ALIS, August Health, ECP(EHR 3곳), Accushield(방문자), TELS(건물 관리), WelcomeHome(CRM) 등 7곳. 교환 데이터 종류, 표준, 실시간 여부는 기사에 없다. (직접) https://seniorhousingnews.com/2026/03/31/new-partnership-why-7-senior-living-technology-providers-are-teaming-up/
- [사실] Caremerge의 가족·입주자 참여 사업은 2022-06 VoiceFriend에 인수되어 Icon으로 개명됐다. 선행 노트 B28이 Caremerge를 가족 포털로 소개한 것은 이 이력을 반영하지 않았을 수 있다. Linked Senior 앱은 App Store 설명에서 PointClickCare 등 EHR 연동을 언급한다. Caremerge–Linked Senior 제휴 관계는 여전히 확인 못 했다. (검색요약) https://www.businesswire.com/news/home/20220621005173/en/5235922/Leading-Senior-Care-Communication-Platform-VoiceFriend-Acquires-Caremerge%E2%80%99s-Engagement-and-Wellness-Business-Rebrands-to-Icon , https://apps.apple.com/app/id1083819582
- [미확인] WelcomeHome의 API 인증 방식과 샌드박스. 선행 노트 B29(open API 주장) 이상은 못 찾았다.

### Inferences
- [추정] 시장 구조는 두 형태로 갈린다. (1) 케어 중심 + 파트너 마켓(PCC, MatrixCare): 청구·CRM·인사는 파트너에 맡긴다고 CAST와 백서가 서술한다. (2) 운영·재무까지 한 제품군에 묶으려는 곳(Yardi, Eldermark, ALIS, Aline, August): 다만 "단일 플랫폼"은 모두 회사 주장이다.
- [추정] 개방 방식의 공통 패턴: 파트너 계약 → 시설/조직 단위 승인 → 스코프된 OAuth → 이벤트 구독. Eldermark(2026.1)와 PCC(시설별 LOA)가 가장 구체적으로 확인된다. 과제용 설계(Integrator 계정, community 스코프, HMAC 웹훅, 일괄 로드 + 변경 구독)에 그대로 참고할 만하다.
- [추정] 이 영역의 "개방"은 대개 승인제다. 자체 가입 포털은 PCC 개발 앱(샌드박스)뿐이며 MatrixCare와 Eldermark는 영업 접점을 거친다.

### Gaps
- Yardi 공식 인터페이스 목록·API 조건: 공식 페이지 403(suite, senior-interfaces, blog, press). 우회하지 않았다.
- PCC 개발자 포털 본문: 메인은 제목만, FHIR 사이트는 403.
- 어느 제품이든 멀티테넌트/단일테넌트·DB 분리의 공식 서술.
- ALIS·August·Aline의 공개 API 문서, 샌드박스, 속도 제한, 파트너 수수료.

---

## Q2. 설비·외부 시스템 연동 (호출벨, 출입, 낙상 감지, 약국, EHR/HIE, 결제, 회계)

### Takeaway
공식 근거가 가장 단단한 것은 표준 계층(HL7 v2 ADT 이벤트, NCPDP, C-CDA, Carequality/CommonWell)이고, 호출벨·출입통제·낙상 감지는 "A와 B가 연동된다"는 발표 수준에 머문다. 방향과 실시간 여부까지 공개한 곳은 거의 없다.

### Cited Findings
- [사실] HL7 v2 ADT: Yardi 13종, PCC 15종(P05 포함), MatrixCare는 ADT, ORU, MDM, RDS 등, Eldermark는 ADT와 약국 이벤트. HL7 CCD/CDA/C-CDA는 4곳 모두 "예". 모두 벤더 자기신고. (직접, CAST)
- [사실] 약국: NCPDP 10.6+는 Yardi, PCC, MatrixCare "예", Eldermark "아니오". 컨설턴트 약국 시스템 인터페이스는 4곳 모두 "예"(Eldermark는 약국 이벤트 서술). 외부 EHR 연동 표준 IHE XCPD/XCA는 PCC, Yardi "예", MatrixCare, Eldermark "아니오". 전국 HIE(Carequality 등) 운영 사용은 Yardi, PCC, MatrixCare "예", Eldermark "아니오". (직접, CAST)
- [사실] 대시보드는 4곳 모두 "실시간", 별도 통합 플랫폼 불필요로 답했다. (직접, CAST)
- [사실] 청구 EDI: PCC, MatrixCare는 837, 270/271, 835, Yardi는 837, 835, 270, 271, Eldermark는 N/A. (직접, CAST)
- [사실] 안전 모니터링·착용형 기기 연동 항목: PCC, MatrixCare, Yardi는 지원 "예", Eldermark는 안전 모니터링 "예"이나 착용형·음성 인식 "아니오". (직접, CAST)
- [사실] 낙상·모니터링: Yardi EHR–SafelyYou(한 방향, 측정값 유입, 2024-10 / 직접), August–Teton(양방향 서술, 2026-02 / 직접), August–SafelyYou·Inspiren(발표만, 검색요약), ALIS–Inspiren(go-alis.com 로고 / 직접, 로고 이상의 서술 없음). 데이터 모델·주기·장애 처리는 어느 곳도 공개하지 않았다.
- [사실] 호출·응급: Securitas Arial이 ALIS와 PCC에 직접 연동된다는 검색 요약(페이지 403). Eldermark Notify는 자체 호출·소통 도구. Inspiren의 호출벨 제품(Argus) 연동 상세는 못 찾았다. (검색요약)
- [사실] 출입·방문자: August–Accushield 연동 발표(검색요약). OpenLoop에 Accushield 포함(직접). 도어락·출입통제 카드 시스템과 시니어 EHR의 연동 문서는 못 찾았다.
- [사실] 결제·회계: ALIS Pay, Aline Payments가 제품 안에 있다(직접). Eldermark Integrator API의 읽기 도메인에 보험·보증인·청구 상태가 있다(직접). 외부 ERP/회계(Sage, NetSuite 등) 연동은 시니어 제품에서 공식 근거를 못 찾았다.
- [사실] 인력·급식: Yardi 연동 파트너로 ServingIntel(식당 POS), Kevala(인력) 등이 제3자 목록에 있고(제3자, https://intuitionlabs.ai/software/assisted-living-senior-living/ccrc-continuing-care-retirement-community-management/yardi-senior-living-suite), August–Kevala는 발표됨(검색요약). MatrixCare는 2017 백서에서 스케줄링을 자체 제공하지 않고 파트너에 맡긴다고 밝혔다(직접).
- [사실] Yardi–Direct Supply 연동 발표가 있으나 페이지 403이라 내용은 못 읽었다. (검색요약) https://www.yardi.com/?p=345213

### Inferences
- [추정] 방향과 시점에 대해 확인 가능한 공통 패턴은 "센서·AI 쪽 이벤트 → EHR 기록" 단방향 중심이고, 반대로 EHR의 census·호실 정보를 센서 쪽에 주는 양방향은 August–Teton 정도다. 호출 이벤트가 근무자 단말로 가는 경로(호출벨 → 직원 앱)는 EHR을 거치지 않고 호출벨 벤더가 직접 처리할 가능성이 높다 [가설, 미검증].
- [추정] 접근 방식이 어댑터(점대점 연동)에서 허브/네트워크(OpenLoop, K4Connect FusionOS 등)로 옮겨가고 있다는 신호가 있다. 효과는 아직 입증되지 않았다.

### Gaps
- 호출벨·출입통제·낙상 감지 연동의 데이터 방향, 지연, 표준(HL7 v2 vs REST vs 웹훅), 실패 처리: 공식 문서를 못 찾았다.
- 외부 ERP/회계 연동 사례, 결제 PG 연동 방식.

---

## Q3. 입주자·가족 앱 구조, 동의·대리인 모델

### Takeaway
공식 서술이 있는 곳은 PCC Connected Care Center뿐이다. 입주자가 공개 범위를 조정하고 직원이 가족 접근을 추가·삭제하는 구조이며, "법적 대리인" 역할은 정의되지 않는다.

### Cited Findings
- [사실] PCC Connected Care Center: EHR for Senior Living 이용 시 추가 비용 없음(회사 주장). 입주자가 민감 항목의 공개를 허용·철회·제한하고, 직원은 가족 상황에 따라 접근을 부여·제거. 활성화 코드, 개인 계정으로 접속. 가족이 보는 정보는 돌봄·서비스 계획, 투약, 알레르기, 활력징후, 일상 활동(공동체 설정과 동의에 따름). 감사 추적과 전송 암호화를 보안 항목으로 나열. 임상 노트·청구 정보는 언급 없음. "인증된 가족 구성원"만 언급하고 대리인 검증 방식은 서술 없음. 모바일 앱 언급 없음. (직접, 게시일 미표기, 열람 2026-11-04) https://pointclickcare.com/products/connected-care-center-senior-living/
- [사실] PCC 마켓플레이스를 통한 가족 포털로 InteliChart Family Portal이 2020-07 발표됐다(입주자 건강 상태, 복약 이행, 식사량, 활동 참여 확인). (검색요약) https://www.businesswire.com/news/home/20200702005517/en/InteliChart-Partnership-with-PointClickCare-Brings-Family-Portal-to-Senior-Care-Industry
- [사실] CAST 자기신고: "PHR/입주자 포털로 내보내기"는 PCC, Yardi "예(기계 판독)", MatrixCare "예", Eldermark "아니오". 입주자↔제공자 방향 교환도 Eldermark만 "아니오". (직접, CAST)
- [사실] Eldermark 연동 도메인에서 SSN은 별도 제한 접근으로 분리돼 있다. 입주자 대상 포털 서술은 해당 문서에 없다. (직접, 2026.1)
- [사실] ALIS(go-alis.com)에는 "ALIS Connect"가 있으나 기능 설명이 없다. August 플랫폼 페이지에도 가족 포털 모듈 서술이 없다. (직접)
- [사실] Sentrics Engage가 입주자·가족·직원용 모바일 앱과 EHR·POS·원격의료 연동을 내세운다는 목록(제3자). Touchtown, K4Community, Uniguest, Eversound는 검색에서 서술을 찾지 못했다.

### Inferences
- [추정] 가족 접근을 "입주자 동의 + 직원 부여/회수 + 감사 로그"로 설계한 PCC 모델은 우리 설계의 참고점이다. 법적 대리인(후견인, 위임장 보유자)은 한국 제도와 맞춰 별도 역할로 모델링해야 한다 [판단].
- [추정] 가족에게 임상 노트·청구를 기본으로 열지 않는 점은 최소 수집·열람 원칙과 맞는다.

### Gaps
- 다른 제품의 동의 모델, 대리인 역할 정의, 가족이 청구서를 보는지 여부.
- Touchtown, K4Community, Uniguest, Eversound의 아키텍처.

---

## Q4. 데이터 분리, 멀티 법인·소유주·운영사 구조, 감사 로그, 인증

### Takeaway
권한 스코프는 "조직·커뮤니티" 단위가 표준으로 보이지만 소유주(owner) 대 운영사(operator)의 보고 구조(RIDEA, 수탁 운영)를 다룬 공식 서술은 찾지 못했다. 보안 인증은 대부분 자기신고다.

### Cited Findings
- [사실] 스코프: Eldermark는 통합업체를 조직·커뮤니티에 배정하고 읽기 도메인별로 권한을 나누며, 외부 통합업체 인증을 직원 인증과 분리했다. 통합업체 접근은 "감사 가능"하다고 서술했다. (직접, 2026.1)
- [사실] PCC는 시설마다 고객이 LOA를 발급해야 앱이 해당 시설 데이터에 접근한다. 수수료도 시설 단위다. (제3자 / PCC 계약 요약)
- [사실] 다중 사이트: CAST 자기신고에서 4곳(Eldermark, MatrixCare, PCC, Yardi) 모두 "다중 사이트 통합" 예. (직접, CAST)
- [사실] MatrixCare MyData: 고객과 "승인된 대리인"이 모든 모듈의 운영 데이터를 ODS에서 조회. 갱신은 하루 몇 차례(2017). (직접)
- [사실] ALIS: 제품 설명에 "투자자 보고서(investor reports)", "세금 명세서(tax statements)", A/R이 있다. 소유주별 분리 방식은 서술 없음. (직접, go-alis.com)
- [사실] Yardi 사례 페이지(Vitality Living 27개 커뮤니티, Brightwater 13개)는 중앙 재무 가시성과 수작업 보고 75% 감소(회사 사례 주장)를 말한다. 소유주 포털은 일반 Voyager 기능 목록에 있으나 시니어 버전의 RIDEA 보고 서술은 못 찾았다. (검색요약) https://www.yardi.com/client-story/vitality-living-on-yardi-voyager-senior-housing/
- [사실] 인증(모두 자기신고): SOC 2 감사 PCC, Yardi, MatrixCare "예", Eldermark "아니오". HIPAA/HITECH "모두 충족" 4곳 모두. 2015 ONC 인증은 PCC만 명시. (직접, CAST) August는 HIPAA, SOC 1 배지(직접). PCC의 HITRUST는 "PAC Network Management" 제품 2023 보도 1건만 확인되고 Connected Care Center나 EHR에 대해서는 못 찾았다(검색요약). 제3자 카탈로그에 PCC Trust Center(SOC 2, ISO 27001)가 있다는 서술은 PCC 공식 확인이 안 됐다. pointclickcare.com/trust-center/ 는 404. (제3자)
- [사실] Yardi는 SOC 1/2 Type 2, SOX, CSA STAR Level 2를 주장하며(회사 주장+제3자), BAA 포함 여부는 계약서 확인이 필요하다는 정리. (검색요약)
- [미확인] 감사 로그 항목·보존기간, PHI 분리 방식(별도 DB/스키마/행 단위 보안), 지역 관리자 역할 모델.

### Inferences
- [추정] 소유주와 운영사가 다른 구조는 문서에 거의 안 드러난다. 일반 PMS가 소유주 명세서로 해결하는 방식(선행 노트 B14)에 시니어 청구·케어 데이터를 덧붙이는 형태일 가능성이 있다 [가설].
- [추정] SOC 2 미보유 Eldermark의 자기신고는 대형 운영사의 보안 심사에서 쟁점이 될 수 있다. 다만 CAST 응답의 시점이 불명확하므로 단정하지 않는다.

### Gaps
- RIDEA 3자 운영 시 소유주 보고 구조, 소유주 전용 읽기 권한, 운영사 직원과의 PHI 분리.
- 각사 감사 로그 사양, HITRUST 보유 여부(제품별).

---

## Q5. 운영 환경의 AI: 위치와 사람 개입 설계

### Takeaway
AI는 "기존 EHR/CRM 안에 박혀 사람이 검토하는 보조"로 포지셔닝한다. 단, 사람 개입 구조를 구체적으로 설명한 곳은 Yardi(문구 수준)와 SafelyYou(원격 임상가) 정도이고, PCC Chart Advisor 발표문은 검토 단계를 명시하지 않는다.

### Cited Findings
- [사실] Yardi Virtuoso for Senior Living: 에이전트 워크플로가 Senior CRM과 EHR에 내장되고 "항상 사람이 개입한다"고 설명(회사 주장). 임상 쪽은 요약·정리를 돕되 임상 판단은 사람이 한다고 서술. 단계적 파일럿·베타로 공개되고 기능·일정은 변경될 수 있다고 명시. 보안은 SOX·HIPAA 충족을 주장. 직접 본문은 403이라 검색 요약만 확인했다. (검색요약, 회사 주장) https://www.yardi.com/blog/ai-senior-living/ , https://www.yardi.com/blog/virtuoso-assistant-voyager/
- [사실] 선행 노트 B18의 Yardi 오픈 에이전트 구조·Marketplace 보도자료(2025-09-11)는 이번에도 본문을 못 열었다. Virtuoso Enterprise 출시일을 2026-10-05라고 적은 제3자 요약(briefglance)은 확인되지 않았다. (제3자)
- [사실] PCC Chart Advisor 시니어리빙 확장(2026-05-12): PCC 환경 내 데이터를 지속 검토해 낙상·특정 약물 같은 고위험 상황과 문서 공백·불일치를 일찍 표시. "미국 시니어리빙 전체에 향후 수개월 내 상용 제공". 사람의 검토 방식은 보도자료에 없다. (직접) https://pointclickcare.com/press-releases/pointclickcare-expands-chart-advisor-to-senior-living/
- [사실] PCC Vox Advantage(음성 문서화, 한정 제공)와 Billing/Chart Advisor를 이어 붙이는 에이전트 체인 인터뷰가 있다. (검색요약) https://www.hcinnovationgroup.com/population-health-management/post-acute-care/article/55393754/pointclickcares-david-pessis-on-bringing-ai-to-long-term-care
- [사실] SafelyYou: 객실 카메라가 낙상을 감지하면 해당 구간만 보관하고 현장 직원에게 알리며, 직원이 영상으로 심각도를 본다. 24/7 원격 임상가 대응센터가 짧은 암호화 클립을 보고 야간 간호사에게 연락하는 사례. 비낙상 영상은 몇 분 내 자동 삭제, 음성 녹음·라이브 스트리밍 없음이라는 설명(회사 자료). HIPAA 준수 주장에 대한 제3자 평가는 못 찾았다. (검색요약, 회사 주장)
- [사실] August Health: 향후 "August Intelligence"(전 플랫폼에 걸친 AI 케어 파트너)를 구축 중이라고 밝힘(회사 주장). Insights는 위험 예측 플래그를 말하되 검토 절차 서술 없음(직접).
- [사실] ALIS: "Ask ALIS" AI, 150+ 스마트 알림, 인수한 Ella(행동 지원). 사람 감독 서술 없음(직접, 회사 주장).
- [사실] EliseAI: 범위를 벗어난 요청(협상, 복잡한 변경)은 사람 상담원으로 에스컬레이션하고 대화 이력을 함께 넘긴다는 서술이 제3자 글에 있다. 시니어리빙 제품 태그는 디렉터리에 있고 Yardi, PCC, WelcomeHome 연동은 확인되지 않았다(Entrata 파트너 표기만). (검색요약/제3자) https://aimagazine.com/news/how-eliseai-builds-ai-agents-for-housing-and-healthcare
- [사실] Inspiren의 AI 아키텍처와 사람 개입 설계는 이번에 공개 서술을 찾지 못했다.
- [사실] 업계 설문(Ziegler CTO Hotline, SHN 2026-08-12): 76%가 플랫폼 간 파편화를 문제로 꼽았고, 68%가 데이터 통합을 2026년 AI 최우선 활용처로, 68%가 AI로 여러 플랫폼 데이터를 통합할 수 있다고 답했다. 41%는 AI의 최대 우려로 법적·규제 준수를 들었다. SHN 기사를 통해 확인했고 원 보고서는 열지 않았다. (직접, 기사) https://seniorhousingnews.com/2026/08/12/senior-living-ctos-balance-efficiency-human-touch-in-tech-rollouts/

### Inferences
- [추정] AI의 위치는 세 가지다. (1) 인입 상담·영업(Yardi Senior CRM, EliseAI, Aline), (2) 기록·위험 표시(PCC Chart Advisor, August Insights, Yardi EHR), (3) 센서·영상 이벤트 해석(SafelyYou, Teton, Inspiren). (3)만 "원격 사람 검토" 구조가 공개돼 있다.
- [가설] 설문의 "AI로 플랫폼 간 데이터 통합" 기대는 연동 부담을 AI가 흡수해 주길 바라는 수요이며, 표준 API 부재의 반영일 수 있다.
- 마케팅 문구가 대부분이므로 효과 수치는 이 노트에서 채택하지 않았다.

### Gaps
- Yardi, PCC, August, ALIS, Inspiren의 사람 승인 단계, 감사 로그, 모델 공급자, PHI 처리 위치.
- 독립 검증된 AI 오류·사고 사례(이 축 외 축 9에서 다룸).

---

## Q6. 경쟁 비교 차원 (competitor-analysis 방식): 강점, 약점·고객 불만, 전환 비용

### Takeaway
고객 불만을 직접 확인한 근거는 업계 설문(Argentum, Ziegler)과 벤더 자기신고의 "개선 영역"뿐이다. 개별 제품 리뷰 사이트(Capterra 등)는 403이었고 McKnight's는 검색에서 관련 기사를 찾지 못했다.

### Cited Findings
- [사실] 업계 인식: Argentum×A Place for Mom 2025 기술 조사(1,000+ 응답, SHN 2025-07-01): 77%가 도구 간 상호운용성과 데이터 접근을 핵심 과제로, 74%가 기존 인프라와의 호환성을, 62%가 의료·제공자 간 데이터 공유 부족을 꼽았다. 74%는 ROI 입증 불가, 63%는 자금 부족을 도입 장벽으로 답했다. (직접) https://seniorhousingnews.com/2025/05/arg/argentum-technology-survey-identifies-top-trends-barriers-in-senior-living/
- [사실] OpenLoop 기사: 단절된 시스템이 스프레드시트, 대사(reconciliation), P&L 보고서 작성 회계 작업을 늘린다는 서술. (직접, SHN 2026-03-31)
- [사실] 시설 내 모바일 호출, 배회 관리, 출입통제, CCTV, 침대 센서가 서로 고립돼 운영된다는 운영사 글. (검색요약) https://seniorshousingbusiness.com/?p=10437
- [사실] 벤더가 적은 개선 영역(CAST, 직접, 자기신고): Yardi는 "모바일 확대", MatrixCare는 INSP 지원과 품질지표 관련, Eldermark는 "고객 요구에 맞춘 지속 개발", PCC는 분석·기기 연동·원격의료·인구건강 등(문구가 Cerner 시기 표현이라 오래됐을 가능성). 이 칸은 약점 근거로 약하다.
- [사실] KLAS 점수는 CAST에 MatrixCare 78.6, PCC 88.8로 기재되나 2018년 장기요양 보고서 기준이라 오래됐다. (직접, CAST)
- [사실] 전환 비용에 대해서는 일반 의료 EHR 글(HHS/ONC 계약 가이드, 벤더 블로그)만 나왔다. 계약 시 데이터 이관 지원과 형식을 요구하라는 취지이며 시니어리빙 특화 수치는 없다. (제3자) https://www.healthit.gov/sites/default/files/playbook/pdf/ehr-contract-guide-chapter-9.pdf
- [사실] CAST 설치 규모(자기신고): PCC 22,000+(전체), MatrixCare 11,000+ 시설 중 시니어리빙 700·라이프플랜 900, Eldermark 6,600+, Yardi EHR 약 3,500. (직접, CAST) 시니어리빙 한정 점유율로 해석하면 안 된다.

**비교 차원별 요약 (근거 수준 포함)**
- 강점: PCC는 네트워크(PointClickCare Connect, 마켓플레이스 파트너 수, 설치 규모), Yardi는 재무·부동산 코어와 한 제품군(회사 주장), MatrixCare는 대규모 API 카탈로그와 표준 지원(자기신고)과 매각 불확실성이 동시에 존재, Eldermark는 2026 Integrator API(공식 문서), ALIS는 RevOps·투자자 보고(회사 주장), August는 신생 EHR과 연동 속도(회사 주장).
- 약점·불만: 업계 공통의 상호운용성·파편화(설문), 개별 제품 불만은 근거 없음.
- 전환 비용: 제품별 공개 근거 없음.

### Inferences
- [추정] 상호운용성 불만의 구조적 원인은 "승인제 개방"(파트너 계약·시설별 승인·유료 구간)과 점대점 연동에 있을 수 있다. PCC의 시설별 LOA·수수료 구조가 한 예다 [가설].
- [추정] MatrixCare는 2026-06 매각 발표로 소유 구조 변화기에 있어 로드맵 불확실성이 있다. 종결 여부는 미확인이다.

### Gaps
- 제품별 사용자 리뷰 기반 불만(Capterra, G2, KLAS): Capterra 403, KLAS 로그인 필요.
- McKnight's Senior Living, SHN, NIC, Ziegler 보고서 원문에서의 제품별 연동 불만 인용.
- Ziegler CFO Hotline: 이번에는 CTO Hotline 기사만 확인했다.

---

## 비교표

| 제품 | 구성 | 호스팅·테넌시 | API·표준 | 설비 연동 | 입주자·가족 앱 | 근거 수준 |
|---|---|---|---|---|---|---|
| Yardi Senior Living Suite (Voyager SH, EHR, eMAR, Senior CRM) | 코어 재무·청구 + 케어 + CRM. 인사 없음(CAST). 단일 제품군 주장 | SaaS/호스팅 예, 로컬 아니오(CAST). Yardi 자사 데이터센터 운영(2011 보도), 15개소 주장. 테넌시 [미확인] | CAST: HL7 ADT 13종, NCPDP, FHIR 게시·소비 예, API 독점+개방, Carequality/TEFCA. Voyager 코어 API는 SOAP·파트너 잠금 추정(제3자 상충) | SafelyYou(단방향 측정값 유입, 2024), Direct Supply·Kevala·ServingIntel 연동(목록) | PHR/포털 내보내기 예(CAST). 가족 포털 상세 [미확인] | 중간-낮음: CAST 직접 + 공식 페이지 403 + 검색요약·제3자 |
| PointClickCare (EHR for Senior Living) | IL/AL/MC EHR, 입주자 관리, 보안 메시징, 가족 포털, Connect 네트워크. 청구·CRM은 시트에 없고 파트너 | SaaS/호스팅 예(CAST). 테넌시 [미확인] | USCDI Connector FHIR R4 읽기 전용(OAuth2/SMART, PKCE), $65/앱/시설/월(제3자 요약), 웹훅은 Marketplace만, 시설별 LOA. CAST: HL7 ADT 15종, FHIR 게시 "아니오"(구형 응답 가능) | Securitas Arial(검색요약), 마켓플레이스 다수(2020 기준 100개) | Connected Care Center: 입주자 동의 + 직원 부여, 임상 노트·청구 언급 없음(직접) | 중간: 솔루션 시트·가족 포털 페이지 직접, API 조건은 제3자 |
| MatrixCare (ResMed, Frazier로 매각 예정) | 다중 케어 세팅 EHR. 스케줄링 등은 파트너(2017) | Azure(2017). "고객 인스턴스" 서술. ODS 복제 하루 수회 | Rhapsody 엔진, Public API, HL7·NCPDP·REST·FTP 등(2017). CAST 2026: API 100+, FHIR 예 | Connections 파트너 4범주(제품·컨설팅·약국·ISV), 경쟁 연동 제한 권한 유보 | 가족 포털 [미확인], 포털 내보내기 예 | 중간: 백서(2017)와 10-K(매각) 직접, 현재 API 상세는 비공개 |
| ALIS (Medtelligent) | eHR/eMAR + RevOps(CRM, 청구, 투자자 보고) + BI, Ella·elbi 인수 | 서술 없음, Trust Center 미열람 | 공개 API 서술 없음. "130+ 연동", App Store 무료(회사 주장) | Inspiren, CarePredict, Direct Supply 로고, Securitas Arial(검색요약) | ALIS Connect(기능 불명) | 낮음-중간: 제품 페이지 직접, 아키텍처 서술 없음 |
| Eldermark (NEXT) | 올인원(EHR, eMAR, 청구, 입주, CRM), 자체 Notify 호출 | SaaS/호스팅/로컬 모두 예, SOC 2 아니오(자기신고). 테넌시 [미확인] | Integrator API(2026.1): OAuth client credentials, 도메인별 GET, 웹훅 + HMAC, 입주자 생성, 조직·커뮤니티 스코프. CAST: HL7 ADT·약국, FHIR 아니오 | CarePredict(검색요약), 인력은 파트너 경유 | 포털 내보내기 아니오(CAST) | 높음(API): 릴리스 노트 직접. 나머지는 CAST 자기신고 |
| August Health | Move-Ins, EHR, eMAR, Insights, Billing, Care Track. CRM 없음 | 서술 없음. HIPAA, SOC 1 배지 | 공개 API 서술 없음 | Teton(양방향 서술), Inspiren, SafelyYou, Kevala, Accushield, SkyPoint(발표) | 서술 없음 | 낮음-중간: 제품 페이지·Teton 블로그 직접, 나머지 검색요약 |
| Aline (Sherpa·Enquire·Glennis) | CRM 중심에서 Care, eMAR, 청구, 결제, 회계까지 확장. Enquire 플랫폼 기반, Sherpa 이전 중 | 서술 없음 | "100+ 연동, API"는 제3자 표기 | 서술 없음 | 서술 없음(Aline Connect 기능 불명) | 낮음: 제품 목록만 직접 |
| WelcomeHome / Caremerge→Icon / Linked Senior | 영업 CRM / 참여 포털(2022 Icon 분리) / 가족 앱 | 서술 없음 | WelcomeHome open API(선행 노트, 회사 주장). Linked Senior는 PCC 등 연동 언급 | OpenLoop 참여(WelcomeHome) | Linked Senior·Icon 세부 [미확인] | 낮음 |

---

## 못 찾은 것
- **Yardi 공식 자료 전반**: yardi.com의 suite, senior-interfaces, blog, press, cloud 페이지가 모두 403이었고 접근 우회는 시도하지 않았다. 그래서 인터페이스 목록(방향·실시간), Virtuoso 에이전트 구조, 호스팅·테넌시, 소유주 포털은 공식 근거 없음.
- **PCC 개발자 포털 본문**: developer.pointclickcare.com은 제목만 반환됐고 fhir.pointclickcare.com은 403. FHIR·수수료·샌드박스 정보는 Nirmitee·Supergood(대행업체) 요약에 의존했다. Marketplace 수수료와 속도 제한은 비공개로 확인됐다(제3자 서술).
- **PCC Trust Center**: pointclickcare.com/trust-center/ 404. SOC 2/HITRUST 공식 확인 없음.
- **ALIS Trust Center, API, 호스팅**, **August Health 통합 페이지·API**, **Aline 통합·보안 페이지**: 링크만 확인.
- **테넌시 모델**(멀티테넌트 vs 고객별 DB): 어느 제품도 공식 서술이 없다. MatrixCare 2017 백서의 "고객 인스턴스"가 유일한 단서.
- **호출벨·출입통제·약국의 구체 연동 규격**(방향, 지연, 표준): 발표 수준만 확인.
- **RIDEA/수탁 운영의 소유주 보고 구조**: 시니어 전용 서술 없음.
- **제품별 사용자 리뷰·전환 비용**: Capterra 403, KLAS 로그인 필요, McKnight's 관련 기사는 검색에서 나오지 않음.
- **Inspiren 아키텍처, EliseAI 시니어 연동 목록, Touchtown/K4Community/Uniguest/Eversound**: 서술 못 찾음.
- **MatrixCare 매각 종결 여부**와 10-K 나머지 부분(Note 18 등).
- **Eldermark, Aline, Caremerge/Linked Senior의 현재 소유 구조**: 미확인.
- **CAST 매트릭스 응답 시점**: 파일은 2026-05 업로드이나 일부 칸이 구형이라 응답 연도가 칸마다 다를 수 있다.
- **web.archive.org**는 현재 도구에서 열 수 없었다.
