# PMS·PropTech 랜드스케이프 (리서치 축 7)
작성 2026-11-02 · 출처 번호는 `../sources/axis7-pms-proptech.md`의 B번호. 상태: 초안(미승인).
변경: 2026-11-03 한국어 문장·용어 검수(korean-skills)
변경: 2026-11-04 Caremerge 서술을 이력과 함께 정정(허브 지시)
주의: 해외 시니어 SW는 공식 문서를 직접 못 열었고 제3자 목록 위주다. "목록상"으로 표시한 것은 확정 사실이 아니다.

## (a) 제품 비교표
| 분류 | 제품 | 모듈(확인된 범위) | 멀티사이트·오너 | API·연동 | 시니어 특화 |
|---|---|---|---|---|---|
| 시니어 스위트 | Yardi Senior Living Suite | Voyager Senior Housing(입주자 청구·census), EHR, eMAR, Senior IQ, Senior CRM [B1] | Voyager는 다중 법인·자산 GL이라고 리뷰 설명 [B16, 낮은 신뢰] | 파트너 SafelyYou 등이 연동 목록에 표기 [B26]. 공개 API 범위 [미확인] | 예. 레벨오브케어 청구가 어떻게 요금에 반영되는지는 [미확인]. 케어 비용이 원장에 반영된다는 서술만 있음 [B1] |
| 시니어 | ALIS(Medtelligent) | eMAR, EHR, CRM, 입주, 청구, 인사이트(목록상) [B4] | [미확인] | 연동 약 60개, open API 여부 출처 상이 [B4] | 예 |
| 시니어 | MatrixCare Senior Living | 청구·EHR 계열(목록상) [B5][B6] | [미확인] | API 유무 출처 간 상충 [B5] | 예 |
| 시니어 | Eldermark | 임상·청구·분석·운영 올인원(목록상), API 있음으로 표기 [B6] | [미확인] | [B6] | 예 |
| 시니어 CRM | WelcomeHome / Sherpa / Enquire | 영업 CRM(리드·투어·입주). WelcomeHome은 open API 주장, PointClickCare 등 연동 예 [B29]. Sherpa·Enquire 세부 [미확인] | [미확인] | WelcomeHome API [B29] | 예(영업) |
| 입주자·가족 참여 | Caremerge → Icon | 가족 포털, eMAR, 약국 연동, API(목록상, Caremerge 이름 기준) [B28]. 참여·웰니스 사업은 2022-06 VoiceFriend 인수 후 Icon으로 개명, 검색요약([이력](../architecture/sources/arch-global-platforms.md)). 현재 제공 주체 [미확인] | [미확인] | API 주장 [B28] | 예 |
| IoT·안전 | SafelyYou, Inspiren, K4Connect | 낙상 감지 AI(SafelyYou), 안전·케어·인력 AI(Inspiren), 통합 허브 FusionOS 50+ 연결(K4Connect) [B25][B26][B27] | 해당 없음 | EHR 연동 주장은 있으나 공개 API 문서 못 찾음 [B26] | 예 |
| 임대 PMS | Yardi Voyager | 다자산 GL, 투자·분배 모듈(리뷰) [B16] | 멀티엔티티가 강점이라고 설명 [B16] | 스마트 액세스 업체들이 연동 주장 [B23] | 아니오 |
| 임대 PMS | AppFolio | 오너 명세서, 재무제표, 오너 포털(리뷰) [B14] | 오너별 통합 명세서 가능하나 사용성 불만 [B14][B15] | [미확인] | 아니오 |
| 임대 PMS | Entrata | properties/units/leases API 문서 존재 [B11] | [미확인] | 공식 API, 방식(XML/JSON)은 출처 상충 [B11][B12] | 아니오 |
| 임대 PMS | RealPage / Buildium | RPX 마켓(표준 API), Buildium Open API(웹훅·샌드박스, 제3자 설명) [B24] | [미확인] | [B24]. 요금제 제한은 상충 | 아니오 |
| 호텔 PMS | Oracle OPERA Cloud | 3,100+ API, 개발자 포털, 샌드박스, 이벤트 구독, 역할별 접근 [B20] | 체인 코드 단위 분석·권한 [B20] | OHIP + Oracle Cloud Marketplace [B20] | 아니오 |
| 호텔 PMS | Mews | Enterprise/Property/Portfolio, 서비스·리소스·청구 [B8] | Portfolio Access Token [B8] | Connector API, 웹훅 [B9] | 아니오 |
| 호텔 PMS | Cloudbeds | PMS/Insights/Accounting/유통 API, 그룹 계정, 웹훅, OAuth2 [B21] | 그룹 레벨 API(회사 주장) [B22] | 마켓플레이스 [B21][B22] | 아니오 |
| 국내 호텔 | 산하IT WINGS(야놀자 계열) | 클라우드, 모듈형, 키오스크·RMS·객실제어 연동 [B30] | [미확인] | 연동 목록 수준 [B30] | 아니오. 국내 점유율 70%+는 회사 주장 |
| 국내 임대 | 제온스 ezREMS | 전자 계약서·고지서, 수납·청구, 공실·투어 앱 [B31] | 지점·객실타입 [B31] | [미확인] | 아니오 |
| 국내 주거 | 트러스테이 노크타운 | 단지 관리 앱 50여 기능, IoT, 시설 예약, AI 차량·화재 [B32] | 640개 단지 [B32] | [미확인] | 아니오 |
| 국내 요양 | 케어포(한강시스템) | 장기요양기관 관리 프로그램 + 보호자 앱 [B33] | [미확인] | [미확인] | 요양(장기요양)용, 민간 시니어주거 아님 |

## (b) 공통 도메인 모델
확인 근거는 Mews 용어집이 가장 명확하다 [B8]. Entrata는 property/unit/lease/customer 필터가 확인된다 [B11]. 나머지는 제품별 문서에서 직접 확인하지 못해 아래 ERD의 시니어 확장 부분은 **내 설계안**이다 [판단].

```
Tenant(운영사/소유주 경계)       ← Mews: Enterprise / Portfolio [B8]
  └─ Owner(소유주·펀드)  ──< Property/Site(사업장)   ← Entrata property [B11], Mews Property [B8]
                               └─ Building ─< Unit(호실)  ← Entrata unit [B11], Mews Space/Resource [B8]
Party(Contact) : Resident/Tenant | Family(보호자) | Company(법인)   ← Mews Customer/Company/Profile [B8]
Lease/Contract ── Party, Unit, 기간, 상태       ← Entrata lease [B11]; Mews Reservation=계약(ServiceOrder) [B8]
Charge/Invoice/Payment ── Bill(folio)에 귀속   ← Mews: Bill은 Profile에 귀속, AccountingItem=Order|Payment [B8]
Service(서비스 정의) ─< ServiceOrder(이용)     ← Mews Service/Product/Order [B8]
Resource(예약 대상) ─< Reservation              ← Mews [B8]
WorkOrder/ServiceRequest                       ← 임대 PMS 일반 개념, 이번 조사에서 문서로 직접 확인 못 함 [미확인]
Integration/Token(테넌트·사업장 범위)          ← Mews Access Token, Portfolio Access Token [B8]; Cloudbeds 그룹 계정 [B21]
Webhook/Event                                  ← Mews [B9], Cloudbeds [B21], OHIP 이벤트 구독 [B20]
```

멀티테넌시·멀티오너 처리 방식 (확인된 것만)
- **Mews**: Enterprise 아래 Property, 여러 Property는 Portfolio로 묶고, 토큰은 단일 Property용과 Portfolio용을 구분한다 [B8].
- **Cloudbeds**: 그룹 단위 계정/크리덴셜로 여러 속성 접근(회사 주장) [B21][B22].
- **OHIP**: 체인 코드 기준 분석, 역할별 접근, 파트너 접근을 고객이 철회 가능 [B20].
- **AppFolio(리뷰)**: 오너별 명세서 발행이 핵심 산출물이고, 한 오너의 여러 자산을 합산한 명세서가 쓰임. 사용성은 불만 [B14][B15].
- **Mews 설계 힌트**: Rate·제약이 Enterprise에서 Service 수준으로 내려왔다 [B10]. 청구가 예약이 아닌 Profile에 귀속되는 점은 입주자에게 여러 계약·서비스가 붙는 구조에 참고가 된다 [B8].

## (c) 시니어하우징 PMS에만 필요한 것
다음은 해외 제품 목록의 모듈 [B1][B4][B28]과 우리 프로필 [shared/target-companies.md]을 합친 **정리**다. 국내 운영 실무 검증은 축 4가 맡는다.
1. **입주 영업 CRM → 입주 전환**: 리드, 투어, 상담 이력이 계약으로 이어짐. Yardi는 CRM 데이터가 스위트로 흐른다고 주장 [B3]. 독립 CRM(WelcomeHome 등)은 API로 PMS/EHR에 붙인다 [B29].
2. **케어 레벨 기반 요금**: 해외 스위트는 케어 비용이 원장에 반영된다고 설명하나 산식 [미확인] [B1]. 국내 노인복지주택은 장기요양보험이 아닌 민간 계약이라 월 생활비·서비스 이용료·식사 정산이 계약에 들어간다 [target-companies.md, S6][추정].
3. **보호자(가족) 포털과 권한**: Caremerge(참여·웰니스 사업은 2022-06 VoiceFriend 인수 후 Icon으로 개명, 검색요약)는 제3자 목록상 가족 포털/보안 메시징이다 [B28]. 현재 제공 주체 [미확인]. 입주자 본인과 다른 동의·열람 범위가 필요 [판단].
4. **케어·복약 기록(eMAR)**: 해외는 EHR/eMAR 모듈로 분리 [B1][B28]. 국내 민간 시니어주거에서 어디까지 PMS 범위인지는 [미확인]. MVP는 기록 자체보다 이벤트 연동 지점이 적절 [판단].
5. **응급·안전 이벤트**: 낙상 감지·호출벨(SafelyYou, Inspiren)과 직원 앱 알림 연동 [B26][B27]. 공개 API는 못 찾았으므로 어댑터+목업이 현실적 [판단].
6. **보증금 구조**: 분양형 실버타운은 입소보증금 일정 비율 보증보험을 노인복지법이 요구한다는 설명이 있으나 원문 확인 필요 [B34].
7. **식사·프로그램 정산, 시설 예약**: 해외 목록에서 식사·활동은 별 모듈/참여 도구로 존재(목록 수준) [B28]. 세부 정산 방식 [미확인].

## (d) 국내 공백
- 호텔 PMS는 WINGS가 강한 점유율을 주장 [B30]. 임대는 제온스·트러스테이 등 단지·임대관리 솔루션이 있다 [B31][B32]. 요양은 케어포 같은 장기요양기관 프로그램이 있다 [B33].
- **시니어 주거 전용(입주 CRM+계약+케어 레벨 청구+가족 포털) PMS는 이번 검색에서 발견하지 못했다.** [사실: 발견 못함] "국내에 없다"는 확정이 아니다. 운영사 내부 개발·비공개 SW 가능성이 있다 [추정].
- 호텔·임대·요양 제품은 각각 따로 있지만, [지원 회사]처럼 시니어하우징+임대주택+숙박을 한 PMS로 묶는 국내 사례는 못 찾았다 [사실: 발견 못함]. MGRV가 제온스를 도입한 것은 코리빙 운영 디지털화 선례로 의미가 있다 [B31]. ([지원 회사] 대표가 MGRV 출신이라는 프로필 [target-companies.md]과의 연결은 추정)

## (e) 포트폴리오 MVP에 주는 시사점 (백엔드 설계 포인트)
1. **Tenant(운영사)–Owner–Site–Building–Unit 계층과 사업장 스코프 토큰**: Mews의 Enterprise/Portfolio와 범위별 토큰 [B8], Cloudbeds 그룹 계정 [B21], OHIP 체인 단위 권한 [B20]. 수탁 운영이라 소유주별 데이터 분리·리포팅이 핵심 [target-companies.md]. RLS 또는 tenant_id 설계를 ADR로 남긴다.
2. **Party 모델(입주자·보호자·법인)과 청구 귀속**: Mews는 Bill을 Profile에 귀속 [B8]. 입주자 1명에 계약·서비스가 여러 개 붙는 구조, 보호자는 별도 Party와 관계로 표현.
3. **Charge/Invoice/Payment 원장과 월 정산 배치**: Mews AccountingItem(Order/Payment) [B8]. 케어 레벨 변경이 요금에 반영되는 규칙은 내 설계(해외 산식 [미확인] [B1])로 상태 전이와 소급 정산을 보여줄 수 있다. 소유주 명세서(owner statement) 산출은 AppFolio 사례 [B14].
4. **계약(Lease/Contract) 상태 전이와 Unit 점유**: Entrata의 lease가 property·customer·unit·기간으로 조회됨 [B11]. 입주 상담→계약→입주→퇴거 상태기계와 동시 예약 충돌 방지(이중 계약 방지).
5. **이벤트·웹훅 수신과 멱등 어댑터**: Mews는 폴링 대신 웹훅 권장 [B9], Cloudbeds·OHIP도 웹훅/이벤트 [B21][B20]. 출입통제/IoT/결제를 어댑터로 목업하고 중복 수신 멱등 처리, 재시도, 서명 검증 시연.
6. **공개 API + 파트너 접근 철회 + 샌드박스**: OHIP는 파트너 접근 철회, 역할별 접근, 샌드박스 [B20]. Cloudbeds도 샌드박스 [B21]. API Key/OAuth, 스코프, 감사 로그를 설계로 보여줌.
7. **AI Agent를 도구 호출 계층으로**: Yardi Virtuoso는 오픈 에이전트 구조와 마켓(회사 주장) [B18], RealPage Lumina는 에이전트들이 데이터 플랫폼 공유 [B19], EliseAI는 문의 응대·투어 예약 [B17]. 시니어 버전은 입주 문의 응대 에이전트가 PMS의 공실·요금 조회 API를 호출하고 직원 인계 지점과 개인정보 마스킹을 명시. 효과 수치는 모두 회사 주장이므로 MVP에서 "측정 가능한 로그" 설계로 대체.
8. **RBAC·민감정보**: 본사·사업장 직원·입주자·보호자·소유주 역할과 건강정보 열람 분리는 공통 요구 [target-companies.md]. 구현은 정책 테이블+감사 로그.

## (f) 확인 못 한 것
- Yardi, MatrixCare, Eldermark, ALIS의 **공식 API 공개 범위·마켓플레이스 조건**. 출처 간 상충 [B4][B5][B6].
- 레벨오브케어 평가가 요금 산식에 연결되는 방식 [B1].
- Sherpa·Enquire의 모듈·연동 [B29].
- Entrata API 방식(XML vs JSON)과 고객·원장 메서드 [B11][B12].
- Yardi/AppFolio 멀티 오너 정산의 공식 문서 기반 구조 [B14][B16].
- Work Order/Service Request 엔티티를 제품 문서로 직접 확인하는 것.
- Caremerge–Linked Senior 제휴(검색 요약에만 있음) [B28]. 2022 Icon 개명 뒤의 관계도 [미확인].
- Inspiren 투자 수치 [B27], SafelyYou 낙상 감지 정확도(회사 주장) [B26].
- 국내 시니어주거 전용 PMS 부재의 확정, 국내 운영사 내부 시스템.
- 케어포 앱 ID 정합성 [B33], 실버타운 보증보험 설명의 기사 출처 [B34].
- 직접 열람 실패(403): Yardi 공식 페이지, Entrata 문서 본문.
