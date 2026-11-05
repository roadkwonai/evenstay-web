# Evenstay 도메인 용어집

작성: 2026-11-04 · 상태: 초안 · 기준: `docs/*/tech-design.md`, `docs/*/copy/`, `design/mvp-screens.md`, senior-lab `shared/decisions.md`

용어와 화면 말을 찾을 때 이 파일 하나만 읽으면 되게 모았다. 전체 그림은 `docs/project.md`에 있다. 프로토타입 화면 문장은 `design/prototype/strings/<모듈>.json`이 기준이고, 상태 전이 같은 세부 내용은 출처 칸의 문서를 연다. 이 파일과 원본이 다르면 원본이 맞다. 원본을 바꾸는 순서는 senior-lab 문서가 먼저다(루트 `CLAUDE.md`).

**읽는 법**
- 화면 말 칸은 `직원:`, `회원:`, `보호자:`로 나눈다. 적지 않은 화면에는 그 말을 보이지 않는다. "회원·보호자:"는 둘이 같다는 뜻이다.
- 테이블명 칸: 원본 문서에는 실제 테이블 이름이 없다(DDL이 없고 ERD는 대문자 초안 이름뿐이다). 그래서 스키마만 적고 이름은 `[미정]`으로 둔다. `—`는 테이블이 아닌 말(코드 값, 화면, 개념, 파일)이다.
- 출처 줄임말: T = `tech-design.md`, C = `copy/copy.md`, N = `copy/names.md`, M = `copy/product-marketing.md`, P = `prd.md`. 앞에 모듈 폴더를 붙인다(`core T2-2` = `docs/core/tech-design.md` 2-2절). `화면정의` = `design/mvp-screens.md`, `루트` = 루트 `CLAUDE.md`, `결정` = senior-lab `shared/decisions.md`, `설계안` = senior-lab `01-research/outputs/senior-housing-architecture-design.md`, `조사` = senior-lab `01-research/outputs/senior-housing-architecture.md`.
- 모듈 약칭: 코어 = `core`, B = `safety`, D = `family`, G = `assistant`, C = `transitions`, N1 = `requests`, N2 = `community`.
- MVP는 만들지 않는다. 이 파일의 "MVP"는 기획 문서의 말이고 설계 범위를 뜻한다. P1은 그다음 우선순위, Next는 다음 버전이다. `[문서 다름]`은 원본끼리 말이 다른 곳이다. 화면 말은 그중 `tech-design.md`와 `names.md`를 앞세워 적었다.

## 액터

| 한글 용어 | 화면에 쓰는 말 | 영문·코드 이름 | 정의 | 테이블명 | 출처 |
|---|---|---|---|---|---|
| 입주자(회원) | 직원: 입주자 / 회원: 회원님 / 보호자: ○○○ 회원님 | `MEMBER` 역할, `Resident` | 호실 계약이 걸린 사람. 70~80대. Evenstay 홈을 쓴다 | — | 루트, core M, 화면정의 1 |
| 보호자 | 직원: 보호자 / 회원: 함께 보실 분 | `GUARDIAN` 역할, `Guardian` | 활성 보호자 관계가 있는 사람. 회원이 허락한 것만 Evenstay 패밀리로 본다 | — | core T6-1, family M |
| 대리인 | 직원: 대리인 / 회원·보호자: 대신 처리하실 분 | `Representative` | 법적 근거로 회원의 일을 맡은 사람. 역할 코드가 아니라 대리인 행으로 판단한다 | — | core T6-1, core M |
| 본사 관리자 | 직원: 본사 관리자 | `HQ_ADMIN` | 운영사 전체 범위. 요금표와 청구 일정을 설정한다 | — | core T6-1 |
| 본사 운영 매니저 | 직원: 본사 운영 매니저 | `HQ_MANAGER` | 운영사 전체나 여러 사업장을 맡는다 | — | core T6-1 |
| 사업장 경리 | 직원: 경리 | `SITE_ACCOUNTANT` | 사업장의 계약, 청구, 수납을 맡는다 | — | core T6-1 |
| 사업장 책임자 | 직원: 사업장 책임자 / 회원 공지: 센터장 | `SITE_MANAGER` | 사업장 운영을 맡고 운영 현황 카드를 본다 | — | core T6-1, requests N |
| 사업장 직원 | 직원: 사업장 직원 | `SITE_STAFF` | 프런트, 생활 지원, 간호 직원. 일은 직무로 나눈다 | — | core T6-1 |
| 직무 | 직원: 프런트 / 생활 지원 / 간호 | `StaffDuty`: `FRONT`, `LIFE_SUPPORT`, `CARE` | 사업장 직원의 일. 역할 행의 `duties`에 담는다 | — | core T2-1 |
| 소유주 계정 | 직원: 소유주 | `OWNER_VIEWER` | 기준일에 소유한 사업장의 합계만 본다. 입주자 이름은 가린다 | — | core T6-1 |
| 모듈 시스템 주체 | 화면에 없음 | `SYSTEM:<moduleKey>` | 모듈이 시작할 때 등록한다. 코어가 정한 모듈 호출용 행동만 그 사업장 범위에서 한다 | — | core T6-1·6-3 |
| 데모 진행자 | 직원: 진행자 | COM-01~03 막대 | 데모에서 계정, 시계, 시드를 바꾸는 사람 | — | 화면정의 1-3 |
| 계정 | 화면에 없음 | `UserAccount`: `STAFF`, `OWNER_USER`, `MEMBER`, `GUARDIAN` | 로그인 단위. 권한은 계정 종류가 아니라 역할로 판단한다 | `core.[미정]` | core T2-2 |
| 역할 배정 | 직원: 역할 | `RoleAssignment` | 계정에 역할, 범위, 기간, 직무를 붙인 행 | `core.[미정]` | core T2-2 |

## 핵심 도메인 (운영사·소유주·사업장·호실·입주자)

| 한글 용어 | 화면에 쓰는 말 | 영문·코드 이름 | 정의 | 테이블명 | 출처 |
|---|---|---|---|---|---|
| 운영사 | 직원: 운영사 | `Operator` | 소유주를 대신해 사업장을 운영하는 회사. MVP는 1곳 | `core.[미정]` | core T2-2, core M |
| 소유주 | 직원: 소유주 | `Owner`: `FUND`, `REIT`, `CORP` | 사업장 자산을 가진 쪽 | `core.[미정]` | core T2-2 |
| 소유 기간 | 직원: 소유 기간 | `SiteOwnership` | 사업장 소유주가 바뀌어도 기간별로 나눈 기록. 기간은 겹치지 않는다 | `core.[미정]` | core T2-1·2-2 |
| 사업장 | 직원: 사업장 / 회원·보호자: 레지던스 이름 | `Site` | 운영 단위. 자산 유형은 `SENIOR_RESIDENCE`, `RENTAL_HOUSING`이고 요금 규칙 조합만 바꾼다 | `core.[미정]` | core T2-2, core M |
| 위탁 운영 계약 | 직원: 위탁 운영 계약 | `ManagementContract` | 사업장의 설치자와 위탁 운영자, 기간. 바뀌면 새 행을 쓴다 | `core.[미정]` | core T2-1·2-2 |
| 동 | 직원: 동 / 회원: ○동 | `Building` | 사업장 안의 건물 | `core.[미정]` | core T2-1 |
| 호실 | 직원: 호실 / 회원: ○동 ○호 | `Unit` | 계약이 걸리는 방. 층 칸 `floor`가 있다 | `core.[미정]` | core T2-2, core M |
| 인물 | 직원: 인물 | `Person` | 입주자, 보호자, 대리인의 공통 신원. 주민번호를 받지 않는다 | `core.[미정]` | core T2-1·2-2 |
| 입주자 기록 | 직원: 입주자 / 회원: 회원님 | `Resident` | 사업장마다 한 행. 거주 상태는 계약에서 계산한다 | `core.[미정]` | core T2-2 |
| 장기 부재 | 직원: 장기 부재, 부재 중 / 보호자: 자리를 비우셨어요(FAM-16) | `ResidentAbsence`: `OPEN`, `ENDED`, `CANCELLED` | 사업장에 없는 기간을 이유 없이 날짜로만 적은 기록. 병명, 입원 여부, 메모 칸이 없다 | `core.[미정]` | core T2-1·2-2, safety T2-1 |

## 계약·청구·수납

| 한글 용어 | 화면에 쓰는 말 | 영문·코드 이름 | 정의 | 테이블명 | 출처 |
|---|---|---|---|---|---|
| 입주 계약 | 직원·회원: 입주 계약 | `Contract` | 호실과 입주자를 잇는 계약. 요금표 버전을 체결 때 고정한다 | `core.[미정]` | core T2-2, core M |
| 계약 상태 | 직원: 작성 중 / 입주 예정 / 거주 중 / 승계됨 / 퇴거 예정 / 정산 완료. 회원: (없음) / 아직 입주 전이에요 / 거주하고 계세요 / 계약이 바뀌었어요 / 이사 나갈 준비 중 / 정산이 끝났어요 | `ContractStatus`: `DRAFT`, `SIGNED`, `ACTIVE`, `SUCCEEDED`, `TERMINATING`, `SETTLED` | 계약의 6개 상태 | — | core M, core T3-1 |
| 계약 당사자 | 화면 말 `[미정]` | `ContractParty`: `PRIMARY`, `CO` | 계약의 당사자 한 사람당 한 행 | `core.[미정]` | core T2-2 |
| 서명 기록 | 화면 말 `[미정]` | `ContractSignature` | 서명 사실만 남긴다. 전자서명은 MVP 밖 | `core.[미정]` | core T2-2 |
| 증빙 확인 | 화면 말 `[미정]` | `EvidenceCheck` | 승계, 대리인 증빙을 확인한 기록. 원본은 저장하지 않는다 | `core.[미정]` | core T2-2 |
| 사별 승계 | 직원: 승계 / 회원: 계약이 바뀌었어요 | `ContractSucceeded`, `succeeded_from_id` | 옛 계약을 닫고 새 계약을 여는 일. 당사자가 바뀌면 새 계약이다 | — | core T ADR-5 |
| 계약 변경 | 직원: 계약 변경 요청 | `ContractCommand.requestAmendment`(Next) | 당사자는 같고 조건만 바뀌는 일. 코어 명령은 다음 버전이다 | — | core T ADR-5·8-2 |
| 주요 날짜 | 직원: 입주일 / 계약 만료일 / 최근 청구 발행일 / 최근 청구 납부 기한 / 다음 청구 예정일 / 퇴거 예정일. 회원: 입주하신 날 / 계약이 끝나는 날 / ○월 청구서가 나온 날 / ○월 ○일까지 내시면 돼요 / 다음 청구서가 나올 날 / 이사 나가실 날 | `keyDates`: `moveInDate`, `contractEndDate`, `lastInvoiceIssuedOn`, `lastInvoiceDueDate`, `nextInvoiceScheduledOn`, `moveOutDate` | 코어가 계산해 주는 6개 날짜. 비서 일정과 보호자 일정의 재료 | — | assistant M, core T8-2 |
| 요금표 버전 | 직원: 요금표 버전 | `PricingVersion` | 사업장 요금 규칙 묶음. 바꾸면 새 버전이고 옛 버전은 지우지 않는다 | `core.[미정]` | core T2-1·2-2 |
| 청구 일정 | 직원: 청구 일정 | `BillingSchedule` | 발행 예정일과 납부 기한 규칙 버전. 계약에 고정하지 않고 기준일 버전을 쓴다 | `core.[미정]` | core T2-2 |
| 결식 | 직원: 결식 / 회원: 드시지 않은 식사 | `MealSkip` | 입주자가 끼니를 먹지 않은 기록. 이유는 받지 않는다 | `core.[미정]` | core T2-1·2-2 |
| 식사 마감 | 직원: 식사 마감 | `MealPeriodClose` | 달마다 식사 기록을 닫는 일 | `core.[미정]` | core T2-1·2-2 |
| 청구 생성 실행 | 직원: 청구 생성 실행 | `BillingRun` | 사업장과 달마다 청구서를 만드는 실행 기록 | `core.[미정]` | core T2-1·2-2 |
| 청구서 | 직원: 청구서 / 회원: 이번 달 청구서 | `Invoice`: `DRAFT`, `ISSUED` | 계약과 달마다 하나. 발행이 원장 확정 시점이다 | `core.[미정]` | core T2-2, core M |
| 납부 기한 | 직원: 납부 기한 / 회원: ○월 ○일까지 내시면 돼요 | `Invoice.due_date` | 발행 때 정하고 바꾸지 않는다 | — | core T2-1, core M |
| 수납 상태 | 회원: 내셨다고 기록돼 있어요 등 문장 | `paymentState`: `UNPAID`, `PARTIAL`, `PAID`, `NOT_TRACKED` | 저장하지 않는 계산값. 미납 판정과 연체 처리는 MVP 밖이다 | — | core T3-2, assistant T4-4 |
| 청구 항목 | 직원: 청구 항목 / 회원: 내실 돈 항목 | `Charge` | 청구서의 한 줄. 발행 뒤에는 추가만 한다 | `core.[미정]` | core T2-2, core M |
| 청구 항목 종류 | 직원: 결식 감면, 조정, 서비스 이용료 / 회원: 드시지 않은 식사 빼 드림, 지난 청구서 바로잡음, 서비스 이름 그대로 | `RECURRING_FEE`, `MEAL_FEE`, `MEAL_SKIP_DISCOUNT`, `ADJUSTMENT`, `SERVICE_FEE` | 정기 요금, 식비, 결식 감면, 정정 전표, 서비스 이용료 | — | core T2-2, core M, core C |
| 조정 | 직원: 조정 / 회원: 지난 청구서 바로잡음(core T2-1은 "조정") `[문서 다름]` | `Adjustment`, `ADJUSTMENT` | 발행 후 정정 전표. 원래 항목 ID와 사유가 필수다. 규칙 감면은 조정이 아니다 | — | core T2-1, core M |
| 서비스 사용 기록 | 직원: 서비스 사용 기록(탭: 다음 청구서에 들어갈 사용 기록) | `ServiceUsage`: `PENDING`, `BILLED` | 모듈의 유료 사용을 다음 청구서에 넣기 전까지 기다리는 기록 | `core.[미정]` | core T2-2, core C |
| 수납 | 직원: 수납 / 회원: 납부 | `Payment` | 추가만 한다. 환불은 음수 행 | `core.[미정]` | core T2-1·2-2 |
| 보증금 | 직원: 보증금 / 회원: 맡기신 보증금 | `Deposit`, `DepositEntry` | 수익이 아니라 맡긴 돈. 청구 원장과 나눈 별도 원장 | `core.[미정]` | core T2-2, core M |
| 보증금 보호 상태 | 직원: 보증금 보호 상태 / 회원: 보증금 보호(회원·대리인만) | `Contract.deposit_protection` | 전세권 설정일과 보증보험 가입 여부. 법 기준을 채웠는지는 판단하지 않는다 | — | core T2-1·2-2 |
| 몰취 | 직원: 몰취 / 회원: 중도 퇴거 시 돌려드리지 않는 금액 | `Forfeiture` | MVP 밖. 코어 엔티티가 없다 | — | core M |
| 퇴거 정산 | 직원: 퇴거 정산 | `Settlement` | 보증금 잔액과 미수납을 맞춰 돌려줄 돈을 정한다. P1 | `core.[미정]` | core T2-2 |
| 청구 문의 | 직원: 입주자가 문의한 청구 / 회원: 이 금액이 이상해요 | `Inquiry` | 청구 항목에 대한 문의. P1 | `core.[미정]` | core T2-1·2-2 |

## 안심 알림

| 한글 용어 | 화면에 쓰는 말 | 영문·코드 이름 | 정의 | 테이블명 | 출처 |
|---|---|---|---|---|---|
| 신호 원본 | 직원: 신호 원본 | `RawSignal` | 서명이 맞으면 형식과 상관없이 먼저 보관하는 원본 | `safety.[미정]` | safety T2-1·2-2 |
| 신호 | 직원: 신호 | `SignalEvent` | 정규화한 한 건. (출처, 업체 이벤트 번호)로 유일하다 | `safety.[미정]` | safety T2-2, safety M |
| 중복 수신 | 직원: 중복 수신 | `DuplicateEvent`, 저장은 `DuplicateReceipt` | 같은 신호를 다시 받은 기록 한 줄 | `safety.[미정]` | safety T2-1 |
| 기기 | 직원: 침대 센서 / 호출벨 / 출입 기록 / 안부 전화(외부) / 회원: 같은 말(안부 전화) | `Device`: `BED_SENSOR`, `CALL_BELL`, `ACCESS_LOG`, `CHECK_IN_CALL` | 신호를 보내는 장치. `FRONT_CALL`, `VISIT`, `REQUEST`는 기기 없는 출처다 | `safety.[미정]` | safety T2-2, safety M |
| 기기 연결 | 직원: 기기 연결 / 회원: 내 방 장치 | `ResidentLink` | 기기, 출입 카드, 안부 전화 가입을 입주자와 잇고 장치 동의를 담는다 | `safety.[미정]` | safety T2-1·2-2 |
| 규칙 | 직원: 규칙 | `Rule` | 신호에 등급을 정하는 조건. 사업장마다 5개 이내, 바꾸면 새 버전 | `safety.[미정]` | safety T2-2, safety P6 |
| 등급 | 직원: 즉시 확인 / 확인 필요 / 기록만 | `Severity`: `IMMEDIATE`, `CHECK`, `LOG_ONLY` | 다음 행동의 급한 정도. 기록만은 알림을 만들지 않는다 | — | safety M, 결정 |
| 당번표 | 직원: 당번표, 근무, 당번 자리(1차·2차·3차) | `OnCallRoster`, 저장은 `OnCallShift`, `OnCallSlot` | 근무 시간과 자리. 근무 기간은 겹치지 않는다 | `safety.[미정]` | safety T2-1·2-2 |
| 알림 | 직원: 알림 / 회원: 안심 알림 | `Alert` | 신호 1건에서 최대 1건 생기는 직원 할 일 | `safety.[미정]` | safety T2-2, safety M |
| 알림 상태 | 직원: 접수 / 2차 호출(3차 호출, 모두 호출) / 확인 중 / 조치 완료. 회원: 직원에게 알렸어요 / 다른 직원에게도 알렸어요 / 직원이 가고 있어요 / 직원이 다녀갔어요 | `AlertStatus`: `OPEN`, `ESCALATED`, `ACKNOWLEDGED`, `RESOLVED` | "직원이 가고 있어요"는 직원이 맡은 뒤에만 보인다 | — | safety M, 결정 |
| 넘김(호출 단계) | 직원: 2차 호출 / 3차 호출 / 모두 호출 / 회원: 다른 직원에게도 알렸어요 | `EscalationLevel` 1~4 | 시간 안에 맡지 않으면 다음 자리로 넘긴다. 시스템은 119에 신고하지 않는다 | — | safety T2-1, safety P6 |
| 알림 기록 | 직원: 알림 기록 한 줄 | `AlertEvent` | 알림 타임라인. 추가만 한다 | `safety.[미정]` | safety T2-1·2-2 |
| 직원 알림 | 직원: 직원 알림 | `StaffNotification` | 직원 휴대폰 알림 발송과 전달 결과 | `safety.[미정]` | safety T2-1·2-2 |
| 담당자 | 직원: 담당자 / 회원: 직원 | `Responder` | 알림을 맡은 직원 | — | safety M |
| 조치 기록 | 직원: 조치 기록 / 회원: 직원이 한 일 | `ActionRecord` | 만남 여부와 한 일. 진단, 투약 칸이 없다. 정정은 새 행 | `safety.[미정]` | safety T2-2, safety M |
| 비상 연락처 통화 기록 | 직원: 비상 연락처 통화 기록 | `EmergencyCallLog` | 순위, 시각, 결과만 남긴다. 전화번호와 이름은 없다 | `safety.[미정]` | safety T2-1·2-2 |
| 보호자용 결과 | 직원: 보호자 알림 / 보호자: 건강 소식 | `GuardianNotice`, 저장은 `GuardianOutcome` | 건강 소식에 올릴지 정한 내용과 결정. 정해진 이유로만 올리지 않는다 | `safety.[미정]` | safety T2-1·2-2 |
| 안부 방문 | 직원: 안부 방문 계획, 안부 방문 기록 / 회원: 안부 방문 | `VisitPlan`, `VisitRecord` | 회원이 받기로 한 정기 순회. 놓치면 신호가 된다. P1 | `safety.[미정]` | safety T2-1·2-2 |
| 병원 동행(알림 뒤) | 직원: 병원 동행, 병원에 가신 분 | `HospitalEscort` | 알림에서 이어진 동행의 직원과 시각만. 생활 요청의 병원 동행과 다른 기록이다. P1 | `safety.[미정]` | safety T2-1·2-2 |
| 사고·학대 보고 | 직원: 사고·학대 보고 | `IncidentReport` | 사람이 쓴 경위, 통보, 신고만 담는다. 판정 칸이 없다. P1 | `safety.[미정]` | safety T2-1·2-2 |
| 비상 명단 | 직원: 비상 때 재실 명단 | `EvacuationRoll` | 사업장마다 열린 명단 하나. 출입 신호로 재실을 추정하지 않는다. P1 | `safety.[미정]` | safety T2-1·2-2 |
| 대피 확인 | 직원: 대피 확인 | `EvacuationCheck` | 명단에서 사람이 확인한 기록. P1 | `safety.[미정]` | safety T2-1·2-2 |
| 도움 필요 | 직원: 도움 필요 / 회원: 비상 때 도움 | `EvacuationAssist` | 대피에 도움이 필요한지. 이유 칸이 없다. P1 | `safety.[미정]` | safety T2-1·2-2 |

## 보호자·동의·대리

| 한글 용어 | 화면에 쓰는 말 | 영문·코드 이름 | 정의 | 테이블명 | 출처 |
|---|---|---|---|---|---|
| 보호자 관계 | 직원: 보호자 / 회원: 함께 보실 분 | `GuardianLink`: `CHILD`, `SPOUSE`, `SIBLING`, `OTHER` | 누가 보호자인가. 관계만 담고 동의 정책은 D가 붙인다 | `core.[미정]` | core T2-1·2-2 |
| 비상 연락처 | 직원: 비상 연락처 / 회원: 급할 때 연락할 분 / 보호자: 비상 연락처에 적힌 분(119 신고, 병원 이송 기록에서만) | `EmergencyContact` | 응급 때 직원이 누구에게 어떤 순서로 전화하는가. 계약에 딸리고 동의 항목과 무관하다 | `core.[미정]` | core T2-1·2-2 |
| 대리인 기록 | 직원: 대리인 / 회원·보호자: 대신 처리하실 분 | `Representative`: `PENDING_APPROVAL`, `ACTIVE`, `EXPIRED`, `REJECTED`, `REVOKED` | 근거, 범위, 유효기간. 승인자는 등록자와 달라야 한다 | `core.[미정]` | core T2-2·3-3 |
| 권한 범위 | 직원: 권한 범위 / 회원: 대신 처리하실 수 있는 일 | `AuthorityScope`: `SIGN_CONTRACT`, `VIEW_INVOICE`, `PAY`, `MANAGE_GUARDIAN_ACCESS` | 대리인이 맡은 일의 범위 | — | core T2-2, core M |
| 보호자 연결 | 직원: 보호자 연결 / 회원: 함께 보실 분 | `GuardianAccess` | 코어 보호자 관계 1개당 1행. 상세 관계 9종과 연결 상태 | `family.[미정]` | family T2-1·2-2 |
| 허락 항목 | 직원: 주간 생활 리포트 / 일정 / 청구 / 건강 소식 / 생활 요청. 회원: 생활 소식 / 일정 / 청구서 / 건강 소식 / 생활 요청 | `ConsentItem`: `LIFE_REPORT`, `SCHEDULE`, `BILLING`, `HEALTH_EVENT`, `LIFE_REQUEST` | 보호자마다 고르는 5개 항목. 직원 칸 이름은 "열람 항목", 회원은 "보여 줄 것", 보호자는 "볼 수 있는 것" | — | family T2-1, family M |
| 허락 | 직원: 미허용 / 입주자 확인 대기 / 허용 / 철회. 회원: 안 보여요 / 회원님 확인을 기다려요 / 보여요 / 안 보여요(날짜). 보호자: 볼 수 없어요 / 볼 수 없어요 / 볼 수 있어요 / 볼 수 없어요 | `Consent`: `NOT_GRANTED`, `PENDING_MEMBER_CONFIRMATION`, `GRANTED`, `REVOKED` | 보호자 × 항목의 현재 상태. 행이 없으면 미허용. family M은 `PENDING`으로 줄여 적었다 `[문서 다름]` | `family.[미정]` | family T2-1·2-2 |
| 허락 이력 | 직원: 근거 | `ConsentChange` | 허락이 바뀐 기록. 추가만 한다 | `family.[미정]` | family T2-2 |
| 확인 대기 묶음 | 직원: 입주자 확인 대기 묶음 / 회원: 직원이 적은 내용 | `PendingBatch` | 직원이 대신 입력한 넓힘. 회원 본인 세션만 확정한다 | `family.[미정]` | family T2-1·2-2 |
| 건강정보 별도 동의 | 직원: 건강정보 별도 동의 완료 / 없음 / 철회. 회원: 건강 소식 따로 동의 | `SensitiveConsent`: `AGREED`, `NOT_AGREED`, `WITHDRAWN` | 건강 소식을 켜기 전에 보호자마다 받는 동의 | `family.[미정]` | family T2-1·2-2 |
| 건강 소식 | 직원·회원·보호자: 건강 소식. 종류: 직원이 다녀간 일 / 병원에 가신 일 / 그 밖의 건강 기록 / 생활 지원 단계가 바뀐 일 / 다른 기관 돌봄이 시작된 일 | `HealthEvent`: `SAFETY_SIGNAL`, `HOSPITAL_TRANSFER`, `CARE_NOTE`, `CARE_STAGE_CHANGE`, `EXTERNAL_CARE_START` | B, C가 올린 본문 스냅샷. 건강 소식이 보호자에게 가는 길은 D 하나다 | `family.[미정]` | family T2-1·2-2 |
| 올리지 않기 | 직원: 건강 소식 올리지 않기 | `HealthEventWithhold`: `MEMBER_REQUEST`, `NOT_A_HEALTH_EVENT` | 정해진 두 이유로만 뺀 기록. 119, 병원 이송 기록은 회원 요청으로만 뺀다 | `family.[미정]` | family T2-2 |
| 주간 생활 리포트 | 직원: 주간 생활 리포트(AI 초안 / 검토 중 / 발송 완료) / 회원·보호자: 이번 주 생활 소식 | `WeeklyReport`: `DRAFT`, `IN_REVIEW`, `SENT` | AI 초안을 직원이 검토해 보내는 글. 보낸 뒤에는 고치지 않는다 | `family.[미정]` | family T2-1·2-2, family M |
| 내용이 이상해요 | 보호자: 내용이 이상해요 | `ReportFeedback` | 생활 소식에 대한 보호자 의견. P1 | `family.[미정]` | family T2-2 |
| AI 고지문 버전 | 직원: AI 사용 고지 / 회원·보호자: AI 사용 안내 | `AiNoticeVersion`, `AiNotice` | 받는 사람별 고지문 버전. G도 같은 고지를 쓴다 | `family.[미정]` | family T2-1·2-2 |
| 고지 확인 | 직원: 확인 | `AiNoticeAck` | 사람마다 한 번 받는 확인 기록 | `family.[미정]` | family T2-2 |
| AI 미사용 선택 | 화면 말 `[미정]` | `AiPreference` | 생활 소식에 AI를 쓰지 않겠다는 선택 `[가설]` | `family.[미정]` | family T2-2 |
| 범위 안내 확인 | 회원: 알겠어요 | `ScopeNoticeAck` | 허락 범위가 늘 때 받는 확인. P1 | `family.[미정]` | family T2-2, 화면정의 3-3 |
| 열람 기록 | 직원: 열람 기록 / 회원: 내 소식을 본 기록(family M은 "본 기록") `[문서 다름]` | `AccessLog` | 조회용 기록. 원본은 코어 변경 이력이다 | `family.[미정]` | family T2-1·2-2 |
| 초대 | 화면 말은 family C | `Invitation` | 보호자 초대. 1회용 토큰. P1 | `family.[미정]` | family T2-2 |
| 알림 대기 | 화면에 없음 | `NoticeQueue` | 조용한 시간(22~08시)을 피해 보내는 보호자 문자 대기 | `family.[미정]` | family T2-2 |
| 금전 부탁 | 직원: 금전 부탁 | `MoneyRequest` | 입주자의 돈 관련 부탁을 받은 기록. 직원은 대행하지 않고 넘길 곳을 정한다. P1 | `family.[미정]` | family T2-1·2-2 |

## AI 생활 비서

| 한글 용어 | 화면에 쓰는 말 | 영문·코드 이름 | 정의 | 테이블명 | 출처 |
|---|---|---|---|---|---|
| 비서 | 직원: AI 생활 비서 / 회원: 비서(첫 화면만 Evenstay 홈 비서) | `Assistant` | 회원의 날짜와 청구 질문에 기록으로 답하는 기능 | — | assistant M |
| 대화 | 직원: 대화(assistant M은 "대화 기록") `[문서 다름]` / 회원: 지난 대화 | `Conversation` | 대상 회원 1명, 행위자 1명의 묶음 | `assistant.[미정]` | assistant T2-1·2-2 |
| 턴 | 직원: 입주자 / 비서(AI) / 회원: 들은 말 / AI 비서 답 | `Turn` | 대화 안의 한 줄. 추가만 한다 | `assistant.[미정]` | assistant T2-1·2-2 |
| 의도 | 직원: 의도 | `Intent` | 질문의 뜻 분류. 목록은 도구 등록부에서 만든다 | — | assistant T2-1·4-2 |
| 도구 | 직원: 일정 조회 / 청구 설명 / 청구 문의 접수 / 직원에게 넘기기 / 회원: 큰 버튼 이름 | `Tool` | 비서가 부를 수 있는 기능. 도구 밖 사실은 말하지 않는다 | — | assistant T2-1, assistant M |
| 도구 호출 | 직원: 도구 호출, 도구 호출 기록 / 회원: 확인한 곳(답 아래 한 줄, assistant T2-1은 표시 안 함) `[문서 다름]` | `ToolCall` | 호출 기록. 결과 본문은 저장하지 않는다 | `assistant.[미정]` | assistant T2-1·2-2, assistant M |
| 입주자 확인 | 직원: 입주자 확인(assistant M은 "회원 확인") `[문서 다름]` / 회원: 네, 전해 주세요 | `Confirmation`, `ConfirmationToken` | 쓰기 전에 받는 확인 토큰. 기한 5분 `[가설]` | `assistant.[미정]` | assistant T2-1·2-2, assistant C |
| 넘김(비서) | 직원: 넘겨받은 요청 / 회원: 직원에게 전하기, 직원에게 전했어요 | `Handoff` | 회원 확인 뒤 대화에서 직원에게 보내는 요청 | `assistant.[미정]` | assistant T2-1·2-2 |
| 넘긴 이유 | 직원: 건강 판단 / 금전 판단 / 계약 판단 / 도구 밖 질문 / 직접 요청 | `HandoffReason`: `HEALTH`, `MONEY`, `CONTRACT`, `OUT_OF_SCOPE`, `MEMBER_ASKED` | 왜 사람에게 넘겼는가. 투자 질문은 금전 판단이다 | — | assistant T2-1, assistant M |
| 넘김 주제 | 직원: 주제 / 회원: 청구서가 궁금해요 / 계약이 궁금해요 / 그 밖의 일 | `HandoffTopic`: `BILLING`, `CONTRACT`, `OTHER` | 회원이 고르는 버튼 | — | assistant T2-1·2-2 |
| 넘김 상태 | 직원: 새 요청 / 처리 중 / 처리 완료 / 생활 요청으로 보냄 | `HandoffStatus`: `NEW`, `IN_PROGRESS`, `DONE`, `FORWARDED` | 회원 화면은 "직원에게 전했어요" 그대로다 | — | assistant M |
| 답 틀 | 회원: 답의 틀 | `AnswerTemplate` | 도구와 결과 상태마다 하나. 회원에게 보이는 문장은 기록을 틀에 채워 만든다 | — | assistant T2-1, ADR-G1 |
| 의도 라우터 | 화면에 없음 | `IntentRouter` | 규칙 다음에 LLM이나 녹화 응답으로 뜻을 고르는 어댑터 | — | assistant T1, ADR-G6 |
| 권한 거부 | 직원: 권한 거부 / 회원: 그 내용은 제가 볼 수 없어요 | `PolicyDeny` | 도구 호출이 권한 검사에서 막힌 결과 | — | assistant M |
| 평가 문항 | 화면에 없음 | `EvalCase` | 저장소 파일 `assistant/eval/cases.json`의 문항. DB 테이블이 아니다 | — | assistant T2-2 |

## 생활 지원 단계

| 한글 용어 | 화면에 쓰는 말 | 영문·코드 이름 | 정의 | 테이블명 | 출처 |
|---|---|---|---|---|---|
| 생활 지원 단계 | 직원: 기본 서비스 / 생활 지원 추가 / 외부 돌봄 병행 / 거처 상담. 회원: 기본 서비스 / 생활 지원 더하기 / 다른 기관 돌봄 함께 / 지낼 곳 함께 의논 | `CareStage`: `BASIC`, `LIVING_SUPPORT`, `WITH_EXTERNAL_CARE`, `PLACE_CONSULT` | 받는 도움의 양. 코드는 순서와 정렬에만 쓰고 화면에 번호가 없다 | — | transitions T2-1, transitions N1 |
| 단계 정의 버전 | 직원: 단계 정의 버전 | `StageDefinitionVersion` | 사업장 단계 4개를 묶은 버전. transitions M은 `CareStageDefinition` `[문서 다름]` | `transitions.[미정]` | transitions T2-1·2-2 |
| 단계 정의 | 직원: 단계 정의 | `StageDefinition` | 단계 이름, 설명, 바뀌지 않는 것, 조건 | `transitions.[미정]` | transitions T2-2 |
| 추가 서비스 | 직원: 추가 서비스 / 회원: 새로 받으시는 도움 | `StageService` | 단계에 붙는 서비스 코드 | `transitions.[미정]` | transitions T2-1·2-2 |
| 기본 시간 | 화면 말 `[미정]` | `StageServiceTime` | 서비스의 기본 요일과 시간 줄 | `transitions.[미정]` | transitions T2-2 |
| 서비스 방식 | 직원: 자기 서비스 목록 / 지금 서비스 그대로 | `ServiceMode`: `OWN`, `KEEP_CURRENT` | 단계가 서비스와 요금 묶음을 새로 정하는지 이어받는지 | — | transitions T2-1 |
| 요금 묶음 | 직원: 기본 묶음 / 생활 지원 묶음 | `FeeGroup`: `BASE`, `LIVING_SUPPORT` | 금액 없는 묶음 코드. 전후를 비교해 요금 영향을 계산한다 | — | transitions T2-1, transitions N4 |
| 요금 영향 | 직원: 요금 변화 없음 / 계약 변경 필요 / 회원: 내실 돈은 그대로예요 / 내실 돈이 바뀔 수 있어요 | `FeeImpact`: `NO_FEE_CHANGE`, `AMENDMENT_NEEDED` | 고정값이 아니라 결정 전후로 계산한다 | — | transitions T2-1 |
| 평가 기록 | 직원: 평가 기록 / 회원: 직원이 살펴본 날 | `Assessment` | 직원이 관찰한 내용. 추가만 한다. 점수와 진단 칸이 없다 | `transitions.[미정]` | transitions T2-1·2-2 |
| 일상생활 항목 | 화면 말은 transitions N2 | `AssessmentItem` | 평가의 7개 항목 | `transitions.[미정]` | transitions T2-2 |
| 단계 변경 제안 | 직원: 단계 변경 제안 / 회원: 직원이 드린 제안 | `StageChangeProposal` | 입주자당 열린 제안 1건 | `transitions.[미정]` | transitions T2-1·2-2 |
| 제안 상태 | 직원: 작성 중 / 설명 전 / 결정 대기 / 변경 결정 / 유지 결정 / 제안 취소 | `DRAFT`, `AWAITING_EXPLANATION`, `AWAITING_DECISION`, `DECIDED_CHANGE`, `DECIDED_KEEP`, `WITHDRAWN` | 회원 문장은 transitions N3 | — | transitions T3-1, transitions N3 |
| 근거 평가 | 화면 말 `[미정]` | `ProposalEvidence` | 제안의 근거 평가. 평가일은 제출일 기준 30일 안 `[가설]` | `transitions.[미정]` | transitions T2-2 |
| 입주자 설명과 의견 | 직원: 입주자 설명과 의견 / 회원: 회원님 생각 | `Explanation`, 용어집 `ResidentOpinion` | 설명 기록 한 줄. 동의하심, 더 생각하고 싶어 하심, 동의하지 않으심, 의견을 듣지 못함 | `transitions.[미정]` | transitions T2-1·2-2, transitions N3 |
| 결정 | 직원: 결정(제안대로 바꾸기 / 지금 단계 유지 / 다시 살펴본 뒤 결정) / 회원: 정해진 내용 | `StageDecision`: `CHANGE`, `KEEP`, `REASSESS` | 제안한 사람은 결정하지 못한다. DB CHECK로도 막는다 | `transitions.[미정]` | transitions T2-2, transitions N3 |
| 단계 구간 | 직원: 단계(구간) / 회원: 지금 단계, 지난 단계 기록 | `StageAssignment`, 용어집 `StageHistory` | 기간별 단계. 기록이 없으면 입주일부터 기본 서비스 | `transitions.[미정]` | transitions T2-1·2-2 |
| 서비스 시간 | 직원: 서비스 시간 / 회원: 새로 받으시는 도움의 때 | `ServiceSlot` | 입주자별 서비스 요일과 시간 | `transitions.[미정]` | transitions T2-1·2-2 |
| 계약 변경 요청 | 직원: 계약 변경 요청 / 회원: 입주 계약을 바꿀지 직원이 따로 여쭤봐요 | `AmendmentRequest`: `OPEN`, `ACKNOWLEDGED` | MVP는 C 안의 기록이고 경리 확인할 일에 한 줄 보인다 | `transitions.[미정]` | transitions T2-1·2-2, ADR-T3 |
| 외부 돌봄 일정 | 직원: 외부 돌봄 일정 / 회원: 다른 기관 돌봄 | `ExternalCareSchedule` | 방문요양 같은 다른 기관 일정. 보호자 일정에는 넣지 않는다 | `transitions.[미정]` | transitions T2-1·2-2, transitions M |
| 외부 돌봄 시간 | 직원: 요일·시간 / 회원: 오시는 때 | `ExternalCareSlot` | 일정의 요일과 시간 줄 | `transitions.[미정]` | transitions T2-2, transitions N6 |
| 시간 겹침 | 직원: 시간 겹침 | `ScheduleOverlap` | 외부 돌봄과 서비스 시간이 겹친 기록. 경고만 하고 막지 않는다 | `transitions.[미정]` | transitions T2-1·2-2 |
| 다시 검토 요청 | 직원: 다시 검토 요청 / 회원: 다시 봐 주세요 | `ReviewRequest`: `OPEN`, `REASSESSED` | 회원 쪽 재검토 요청. P1 | `transitions.[미정]` | transitions T2-1·2-2 |

## 생활 요청

| 한글 용어 | 화면에 쓰는 말 | 영문·코드 이름 | 정의 | 테이블명 | 출처 |
|---|---|---|---|---|---|
| 생활 요청 | 직원: 생활 요청(줄여 요청) / 회원·보호자: 요청 | `ServiceRequest` | 고장, 청소, 세탁, 외출 차량, 병원 동행, 불편을 받는 한 건. 안전 신호가 아니다 | `requests.[미정]` | requests T2-2, requests M |
| 요청 종류 | 직원: 수리 / 청소 / 세탁 / 외출 차량 / 병원 동행 / 의견·불편 / 그 밖의 일 / 점검. 회원: 고장·수리 / 청소 / 세탁 / 외출 차량 / 병원 동행 / 불편한 점 / 그 밖의 일 | `RequestType`: `REPAIR`, `CLEANING`, `LAUNDRY`, `TRANSPORT`, `HOSPITAL_ESCORT`, `FEEDBACK`, `OTHER`, `INSPECTION` | 점검은 정기 작업에서만 생긴다 | — | requests N2, requests T2-2 |
| 요청 상태 | 직원: 접수 / 처리 중 / 기다림 / 완료 / 입주자 확인 / 확인 없이 닫힘 / 취소 / 하지 않음 / 안심 알림으로 옮김 / 입주자 답 기다림 | `RequestStatus`: `RECEIVED`, `IN_PROGRESS`, `ON_HOLD`, `DONE`, `CONFIRMED`, `AUTO_CLOSED`, `CANCELLED`, `DECLINED`, `MOVED_TO_SAFETY`, `PENDING_MEMBER_OK` | 회원, 보호자 문장은 requests N3 | — | requests N3, requests T3-1, requests C |
| 들어온 곳 | 직원: Evenstay 홈 / Evenstay 패밀리 · 보호자 이름 / 프런트 대신 등록 · 직원 이름 / 홈 비서 · 넘긴 이유 / 정기 작업 | `RequestSource`: `RESIDENT_APP`, `GUARDIAN_PORTAL`, `STAFF_ENTRY`, `ASSISTANT_HANDOFF`, `RECURRING` | requests T2-2의 source 목록에는 `RECURRING`이 없다 `[문서 다름]` | — | requests N4-1 |
| 담당자 | 직원: 담당자 / 회원·보호자: 맡은 직원 | `Assignee` | 요청을 맡은 직원 | — | requests M |
| 담당 팀 | 직원: 프런트, 시설, 청소·세탁, 운전, 생활 지원 | `Team`: `FRONT`, `FACILITY`, `HOUSEKEEPING`, `DRIVER`, `LIFE_SUPPORT` | N1 설정이고 코어 직무와 다르다 | — | requests T2-1 |
| 팀 구성 | 직원: 담당 팀 구성 | `TeamMembership` | 코어 직원을 팀에 넣은 업무 배치 | `requests.[미정]` | requests T2-1·2-2 |
| 원하는 시각 | 직원: 원하는 시각 / 회원·보호자: 원하시는 날짜·시각 | `PreferredTime` | 입주자가 바라는 때 | — | requests M |
| 처리 기한 | 직원: 처리 기한 | `DueAt` | 사업장 설정값. 회원, 보호자에게 보이지 않는다 | — | requests M, requests N3 |
| 지나온 일 | 직원·회원: 지나온 일 | `RequestTransition` | 상태가 바뀐 기록 한 줄. 추가만 한다 | `requests.[미정]` | requests T2-1·2-2 |
| 요청 종류 설정 | 직원: 요청 종류 설정 | `RequestTypeSetting` | 종류별 팀, 기한, 서비스 코드. 바꾸면 새 버전 | `requests.[미정]` | requests T2-1·2-2 |
| 가실 곳 | 직원·회원: 가실 곳 | `EscortDestination` | 병원 동행의 제한 정보. 닫힌 뒤 30일에 지운다 `[가설]` | `requests.[미정]` | requests T2-1·2-2 |
| 정기 작업 | 직원: 정기 작업 / 회원: 정기 청소, 정기 점검 | `RecurringTask` | 정해진 날에 회차를 만드는 틀 | `requests.[미정]` | requests T2-2, requests M |
| 정기 작업 회차 | 직원: 예정 / 처리 중 / 완료 / 쉼 / 못 함. 회원: 정기 청소(그날) | `RecurringOccurrence`: `SCHEDULED`, `IN_PROGRESS`, `DONE`, `SKIPPED`, `MISSED` | 호실별 그날의 작업. 프로그램 회차와 다른 말이다 | `requests.[미정]` | requests T2-1·2-2, requests N4-3 |
| 쉬기 신청 | 직원: 이번 회 쉼 / 회원: 이번 주 청소 쉬기 | `RecurringSkipRequest` | 회차가 만들어지기 전의 쉬기 | `requests.[미정]` | requests T2-1·2-2 |
| 입주자 확인(요청) | 직원: 입주자 확인 / 회원: 다 됐어요, 아직이에요 | `ResidentConfirmation` | 직원이 마친 뒤 입주자가 닫는 단계. 7일이면 확인 없이 닫힌다 | — | requests M, ADR-R3 |
| 청구 넘김 | 직원: 청구 넘김 | `ChargeHandoff`: `PENDING`, `SENT`, `FAILED` | 코어 청구 명령을 부른 기록 | `requests.[미정]` | requests T2-1·2-2 |
| 딱지 | 직원: 먼저 처리 / 기한 지남 / 다시 열림 / 비용 있음 / 정기 | `priority_flag`, `reopen_count` 등 | 목록 표시. "기한 지남"은 요청에만 쓴다 | — | requests N4-2 |
| 안심 알림으로 옮기기 | 직원: 안심 알림으로 옮기기 | `move_to_safety` | 직원이 판단해 B 알림으로 옮긴다. 자동으로 옮기지 않는다. P1 | — | requests T3-1, ADR-R7 |

## 프로그램·시설·공지

| 한글 용어 | 화면에 쓰는 말 | 영문·코드 이름 | 정의 | 테이블명 | 출처 |
|---|---|---|---|---|---|
| 프로그램 | 직원·회원·보호자: 프로그램 | `Program` | 반복 모임의 틀. 바꾸면 다음 회차부터 | `community.[미정]` | community T2-2, community M |
| 프로그램 변경 이력 | 직원: 변경 이력 | `ProgramRevision` | 프로그램 변경 전후 값 | `community.[미정]` | community T2-2 |
| 회차 | 직원: 회차 / 회원·보호자: 날짜와 시각으로만 | `ProgramSession`: `ACTIVE`, `CANCELLED` | 한 번의 모임 | `community.[미정]` | community T2-2, community M |
| 회차 화면 상태 | 직원: 신청 받는 중 / 정원 참 / 신청 마감 / 신청 없음 / 회차 취소 / 마침. 회원: 자리 2개 남았어요 등 | `OPEN`, `FULL`, `CLOSED`, `FREE_JOIN`, `CANCELLED`, `DONE` | 저장하지 않고 계산한다 | — | community N2, ADR-M8 |
| 정원 | 직원: 정원 / 회원: 자리 | `Capacity` | 회차에 받을 수 있는 수 | — | community M |
| 신청 | 직원·회원: 신청 | `Enrollment`: `ENROLLED`, `WAITLISTED`, `CANCELLED` | 회차에 넣은 신청과 대기 | `community.[미정]` | community T2-2, community M |
| 대기 | 직원: 대기 ○번 / 회원: ○번째로 기다리고 계세요 | `Waitlist`, `WAITLISTED` | 순서는 서버가 받은 시각으로 정한다. 대기 번호는 우리말 서수로 쓴다 | — | community M, community N3 |
| 신청 마감 | 직원: 신청 마감 / 회원: 신청은 전날 오후 6시까지 받아요 | `EnrollmentDeadline` | 저장하지 않고 계산한다 | — | community T2-1·4-2 |
| 출석 | 직원: 참여 / 오지 않음 / 회원: 함께하셨어요(참여한 회차만) | `Attendance`: `ATTENDED`, `WALK_IN` | 온 분만 저장한다. 입주자 평가에 쓰지 않는다 | `community.[미정]` | community T2-2, ADR-M4 |
| 장소 | 직원: 장소, 공용 시설 / 회원: 시설, 방 이름 | `Place`, 용어집 `Facility` | 예약 받는 방과 프로그램 장소. 원본의 코드 이름이 둘이다 `[문서 다름]` | `community.[미정]` | community T2-1·2-2, community M |
| 자원 예약 | 직원: 방 일정표의 한 칸 | `PlaceBooking`: `SESSION`, `RESERVATION`, `BLOCK` | 회차, 예약, 막은 시간을 한 테이블에 둔다. DB 배제 제약으로 겹침을 막는다 | `community.[미정]` | community T2-2, ADR-M1 |
| 시설 예약 | 직원: 시설 예약(community T2-1은 "예약") / 회원: 예약 | `FacilityReservation` | 저장은 자원 예약(`RESERVATION`) | — | community T2-1, community M |
| 예약 변경 이력 | 직원: 바뀜 | `ReservationChange` | 예약 시간이 바뀐 기록 | `community.[미정]` | community T2-2 |
| 이용 안 함 | 직원: 이용 안 함 · 이유 / 회원: 이 시간에는 쓸 수 없어요 | `BLOCK` | 직원이 막은 시간 | — | community N4-2 |
| 이용 규칙 | 직원·회원: 이용 규칙 | `FacilityRule`, `Place.rules_text` | 규칙이 바뀌면 다음 예약 때 다시 보인다 | — | community M, community T2-2 |
| 공지 | 직원·회원: 공지 / 보호자: 공지(직원이 고른 것만, 기본값 끔) | `Notice`: `DRAFT`, `SCHEDULED`, `PUBLISHED`, `ARCHIVED` | 게시 뒤 대상은 바꾸지 않는다 `[가설]` | `community.[미정]` | community T2-2, community M |
| 중요 공지 | 직원: 중요 공지 · 확인 받기 / 회원: 꼭 보실 공지 | `Notice.requiresAck` | 확인을 받는 공지. 회원 버튼은 읽었어요 하나 | — | community M, community N |
| 공지 대상 | 직원: 대상(전체, A동, B동, 층) | `Audience`, 저장은 `NoticeRecipient` | 게시 순간 대상 입주자를 코어에서 읽어 한 번 쓴다 | `community.[미정]` | community T2-1·2-2, ADR-M5 |
| 공지 확인 | 직원: 확인함 / 확인 전 / 직접 전함 / 회원: 읽었어요 | `NoticeAck`: `ACKED`, `DELIVERED_IN_PERSON` | 열어 본 것과 누른 것을 나눈다. 직원에게는 확인만 보인다 | `community.[미정]` | community T2-2, community M |
| 메모 | 직원: 메모(직원만 봄) | `DeliveryNote` | 전하지 못했을 때의 메모. 문자에 넣지 않는다 | `community.[미정]` | community T2-1·2-2 |

## 운영 대시보드

| 한글 용어 | 화면에 쓰는 말 | 영문·코드 이름 | 정의 | 테이블명 | 출처 |
|---|---|---|---|---|---|
| 오늘의 운영 | 직원: 오늘의 운영 | CORE-01 | 운영 앱 첫 화면. 3층 구성이고 조립은 `app/`이 한다 | — | core C2-1·2-10, 화면정의 1-3 |
| 확인할 일 | 직원: 확인할 일 | `TodoQuery.itemsOf`, 모듈 조회(`TransitionsInboxQuery` 등) | 대리인 증빙 만료, 비상 연락처 없음, 예정 복귀일 지남 같은 할 일. 코어가 모으지 않고 `app/`이 붙인다 | — | core T8-2·10 |
| 운영 현황 카드 | 직원: 운영 현황 | `GET /sites/{id}/operations-board` | 사업장 책임자, 본사용 숫자 칸. 매 요청 읽고 저장하지 않는다. 목표선이 없다 | — | core T8-1·10 |
| 호실 현황 | 직원: 호실 현황 | `OccupancyQuery.summary` | 동별 입주, 빈 호실, 입주 예정, 퇴거 예정 수 | — | core T10 |
| 장기 부재 중인 분 | 직원: 장기 부재 중인 분 | `AbsenceQuery.openAbsences` | 부재 수와 예정 복귀일 지남 수 | — | core T10 |
| 안전 신호 칸 | 직원: 열린 안전 신호, 맡지 않은 신호, 끊긴 기기, 오늘 당번 | `SafetyBoardQuery.boardOf` | B 조회 한 번으로 네 칸을 읽는다 | — | core T10 |
| 보호자 동의 현황 | 직원: 보호자 동의 현황 | `FamilyConsentSummaryQuery.siteSummary` | 사람 수만 보인다 | — | core T10 |
| AI 생활 비서 사용량 | 직원: AI 생활 비서 사용량 | `AssistantUsageQuery.summary` | 숫자만, 대화 원문 없음 | — | core T10 |
| 열린 생활 요청 | 직원: 열린 생활 요청 | `ServiceRequestQuery.openCount` | 열린 요청, 배정 전, 확인 기다림, 기한 지남, 오늘 회차 수 | — | core T10 |
| 프로그램·시설·공지 칸 | 직원: 프로그램·시설·공지 | `CommunityBoardQuery.todayOf` | 오늘 회차, 출석 체크 전, 예약, 확인 전. 카드로 둘지는 `[가설]` | — | core T10 |
| 다시 불러오기 | 직원: 다시 불러오기 | `?cards=<카드>` | 그 카드의 조회만 다시 부른다. 자동으로 다시 읽지 않는다 `[가설]` | — | core T10 |
| 소유주 현황 | 직원: 소유주 현황 | CORE-09, `GET /owner/summary` | 소유주가 보는 자기 사업장 합계. 이름은 가린다 | — | core T8-1, 화면정의 3-1 |
| 월 리포트 | 직원: 월 리포트 | CORE-14, `OwnerReportQuery.monthOf` | 숫자만 보이고 저장하지 않는다 | — | core T8-2·10 |

## 기술 용어

| 한글 용어 | 화면에 쓰는 말 | 영문·코드 이름 | 정의 | 테이블명 | 출처 |
|---|---|---|---|---|---|
| 모듈형 모놀리스 | 화면에 없음 | modular monolith | 한 저장소, 한 번에 배포. 모듈마다 스키마와 `api/`를 둔다 | — | 루트, core T ADR-2·3 |
| 모듈 공개 API | 화면에 없음 | `<모듈>/api` | 다른 모듈이 import할 수 있는 유일한 곳. `api/`끼리는 서로 의존하지 않는다 | — | 루트, core T ADR-2 |
| 권한 검사 | 직원: 권한 없음 화면(COM-04) | `authorize(actor, action, resource, at, mode)` | 코어 하나로 검사한다. ENFORCE는 감사 기록, CHECK는 기록 없음 | — | core T6-3·8-2 |
| 확장 정책 | 화면에 없음 | `registerPolicy` | 모듈이 자기 행동에 "허용"을 등록한다. 코어의 범위 거부는 뒤집지 못한다 | — | core T6-3 |
| D 동의 행동 | 화면에 없음 | `requests.request.view_as_guardian` 등 | 다른 모듈이 "D 동의로 연다"고 선언한 행동. D가 허용 정책을 등록한다 | — | core T ADR-2, requests ADR-R6 |
| 변경 이력 | 직원: 변경 이력 / 회원: 바뀐 기록 | `AuditLog`: `WRITE`, `READ`, `SENSITIVE_READ`, `DENIED` | 모든 모듈이 쓰는 감사 기록. 추가만 한다. 쓰기 API는 `AuditWriter` | `core.[미정]` | core T2-2, core M |
| 아웃박스 | 화면에 없음 | `OutboxEvent` | 상태 변경과 같은 트랜잭션에 쓰는 이벤트 행. 모듈마다 자기 스키마에 같은 열로 둔다 | `core.[미정]` 외 모듈별 `[미정]` | core T2-2 |
| 도메인 이벤트 | 화면에 없음 | `ContractActivated`, `InvoiceIssued`, `ResidentAbsenceStarted` 등 | 모듈 사이 변화를 전한다. 소비자는 이벤트 ID로 멱등 처리한다 | — | core T8-3, 루트 |
| 멱등 키 | 화면에 없음 | `Idempotency-Key` | 모든 쓰기 요청이 받는 헤더 | — | core T8-1 |
| 행 수준 보안 | 화면에 없음 | RLS | `site_id`로 사업장 데이터를 DB에서도 가른다 | — | core T ADR-1 |
| 배제 제약 | 화면에 없음 | `EXCLUDE` | 기간이나 시간 겹침을 DB가 거부한다 | — | core T12, community ADR-M1 |
| 낙관적 잠금 | 화면에 없음 | `row_version` | 동시 수정을 행 버전으로 막는다 | — | core T2-2, requests T3-1 |
| 멈춘 시계 | 직원: 데모 시계(COM-02) | `Clock`, `/demo/clock` | 진행자가 옮길 때만 시간이 간다 | — | core T8-1·8-2 |
| 문자 발송기 | 화면에 없음 | `Notifier` | `platform`의 발송 인터페이스. MVP는 로그다 | — | core T8-2 |
| 어댑터 | 화면에 없음 | 결제, ERP, 알림, 파일 저장, LLM | 외부 연동 경계. MVP는 목업이다 | — | core T1·9 |
| 데모 초기화 | 직원: 시드 초기화(COM-03) | `/demo/reset {state}`: `AFTER_SUCCESSION`, `G_START`, `C_AFTER_DISCHARGE` | `app/`이 core → safety → family → assistant → transitions → requests → community 순서로 부른다 | — | 루트, 화면정의 2 |
| 화면 ID | 화면에 없음 | `COM`, `CORE`, `SAF`, `FAM`, `AST`, `TRN`, `REQ`, `CMN` | 화면 정의서의 접두어 | — | 화면정의 |
| 근거 표기 | 화면에 없음 | `[사실]`, `[추정]`, `[가설]`, `[미정]`, `[미확인]`, `[NEED]`, `[법률 검토 전 초안]` | 출처 있음, 검증 전, 사용자 확인 필요, 출처 못 찾음, 실제 자료 필요, 법률 검토 전 | — | core strategy 머리말 |

## 아키텍처 용어

아키텍처 페이지(`home/architecture.html`)의 용어 단추는 이 표의 정의 칸을 그대로 보여 준다. 여기를 고치고 다시 만들면 페이지가 따라 바뀐다. 말을 바꾸는 순서는 `docs/project.md` 13절, 문장 전체는 15절 문장 보정표에 있다.

| 한글 용어 | 화면에 쓰는 말 | 영문·코드 이름 | 정의 | 테이블명 | 출처 |
|---|---|---|---|---|---|
| 구성안 | 화면에 없음 | A안, B안, C안 | 무엇을 먼저 고정하고 시작하는가로 나눈 세 구성. A안은 기준안, B안은 TypeScript 단일 언어, C안은 빠른 파일럿이다 | — | 설계안 3 |
| 확장 단계 | 화면에 없음 | 0~5단계 | 기술이 쌓이는 순서. 일정이 아니다. 프로토타입, 핵심 업무 구축, 운영 전환, 문서 AI, 승인 기반 에이전트, 플랫폼 확장 | — | 설계안 4 |
| 영역별 로드맵 | 화면에 없음 | workstream | 일을 업무 코어, 권한과 개인정보, 외부 연동, 건물 층, 데이터와 복구, AI, 운영과 관측, 현장 전환 여덟 영역으로 나눠 마일스톤마다 끝낼 일을 적은 표 | — | 설계안 10.2 |
| 시작 조건 | 화면에 없음 | entry criteria | 마일스톤을 시작하기 전에 채울 조건 | — | 설계안 10.1 |
| 완료 기준 | 화면에 없음 | exit criteria | 마일스톤을 마쳤다고 볼 기준. 채우지 못하면 다음 단계로 진행하지 않는다 | — | 설계안 10.1 |
| 도입 시점 | 화면에 없음 | adoption point | 구성요소를 도입하는 단계 | — | 설계안 8 |
| 마일스톤 | 화면에 없음 | M0~M5 | M0은 1단계 준비이고 M1부터 단계마다 하나씩 두는 묶음. 시작 조건, 작업 순서, 완료 기준, 되돌리기 조건, 결정 사항을 적는다 | — | 설계안 10.1 |
| 도입 기준 | 화면에 없음 | signal | 다음 구성요소를 더해야 할 근거가 되는 관찰. 신호가 없으면 더하지 않는다 | — | 설계안 8 |
| 작업자 | 화면에 없음 | Worker | 요청과 별도로 실행되는 백그라운드 처리 단위. 타이머, 월 청구, 알림 발송, 문서 처리를 맡는다 | — | 설계안 4 |
| 관측 | 화면에 없음 | observability | 로그, 지표, 추적으로 시스템 상태를 보는 일. 입주자를 살피는 일이 아니다 | — | 설계안 6.7 |
| 호출 경로 | 화면에 없음 | call path | 호출 버튼에서 수신반과 직원 핸드셋까지. 건물 안에서 끝나고 인터넷이 필요 없는 구조를 권고안으로 둔다. 국내 설비 구조는 벤더 문의 전이다 | — | 조사 10, 설계안 6.1 |
| 2차 알림 | 화면에 없음 | secondary alert | 호출 경로의 사본을 받아 당번에게 다시 알리는 일. Evenstay가 맡는 범위다 | — | 조사 10, 설계안 6.1 |
| 건물 층 | 화면에 없음 | building layer | 건물 안 호출 설비, 출입, 센서와 클라우드를 잇는 구성. 호출 설비 자립을 기본으로 둔다 | — | 조사 1 |
| 현장 어댑터 | 화면에 없음 | site adapter | 건물 안에서 설비 신호를 공통 형식으로 바꾸고 서명해 밖으로 보내는 얇은 프로그램. 끊기면 잠시 쌓아 둔다 | — | 조사 10 |
| 외부 상태 점검 | 화면에 없음 | external canary | 앱 밖에서 URL과 하트비트로 앱이 살아 있는지 확인하고, 멈추면 앱 밖 경로로 알리는 장치. 영어로는 캐너리라고 한다 | — | 설계안 6.1 |
| 출금 동의 | 직원: 출금 동의 | `DirectDebitMandate` | 자동이체를 설정하기 전에 받는 동의와 그 증빙 | — | 조사 6.2 |
| 은행 결과 대기 | 직원: 은행 결과 대기 | `PENDING_BANK_RESULT` | 출금을 요청했고 결과가 아직 오지 않은 상태 | — | 조사 6.2 |
| 예상 수납 | 직원: 예상 수납 | `ExpectedPayment` | 입금될 금액을 미리 적어 두고 은행 결과와 대조하는 기록 | — | 조사 6.2 |
| 3자 대사 | 직원: 대사 | reconciliation | 내부 원장, 결제 제공자, 은행 기록을 서로 대조하는 일 | — | 조사 6.2 |
| 원장 내보내기 배치 | 직원: 원장 내보내기 | `LedgerExportBatch` | 확정된 원장을 ERP로 보내는 묶음과 그 상태 | — | 조사 6.1 |
| 모델 어댑터 | 화면에 없음 | model adapter | 모델 호출이 거치는 단일 지점. 공급자를 바꿔도 업무 코드는 그대로다 | — | 설계안 6.3 |
| AI 게이트웨이 | 화면에 없음 | AI Gateway | 여러 모델 공급자의 키, 비용, 폴백을 한곳에서 다루는 제품. 공급자가 둘이 될 때 더한다 | — | 설계안 6.3 |
| 에이전트 | 화면에 없음 | agent | 다음 단계를 스스로 고르며 도구를 호출하는 실행. Evenstay에서는 직원용 초안과 제안까지 맡는다 | — | 설계안 6.3 |
| 승인 기반 에이전트 | 화면에 없음 | approval agent | 제안을 만들어 두고 사람의 승인을 기다렸다가 재개하는 에이전트 | — | 설계안 4.2 |
| 실행 기록 | 화면에 없음 | `AgentRun` `[가설]` | 에이전트 실행의 상태, 범위, 버전, 승인 대상, 비용을 남기는 표 | `[미정]` | 설계안 6.3 |
| 체크포인트 | 화면에 없음 | checkpoint | 실행을 어디까지 했는지 저장한 지점. 외부 효과의 중복은 막아 주지 않는다 | — | 설계안 6.3 |
| 재시도 한도 | 화면에 없음 | retry budget | 시간, 토큰, 시도 수의 총 한도. 재시도 권한은 한 층에만 둔다 | — | 설계안 6.3 |
| DB 연결 한도 | 화면에 없음 | connection budget | 서버, 작업자, 배치가 데이터베이스에 여는 연결의 합계와 상한 | — | 설계안 6.5 |
| 읽기 복제본 | 화면에 없음 | read replica | 읽기 부하를 나누는 DB 사본. 지연이 있어 돈과 권한 판단에 쓰지 않는다 | — | 설계안 6.5 |
| 시점 복구 | 화면에 없음 | PITR | DB를 특정 시각으로 되돌리는 복구. 외부 시스템까지 같은 시점으로 되돌려 주지는 않는다 | — | 설계안 6.5 |
| 복구 목표 | 화면에 없음 | `RPO`, `RTO` | 잃어도 되는 데이터 범위와 복구에 쓸 수 있는 시간 | — | 설계안 6.5 |
| 활성 버전 전환 | 화면에 없음 | active version switch | 새 인덱스를 다 만들어 검증한 뒤 한 번에 바꾸는 일 | — | 설계안 6.4 |
| 근거 검색 | 직원: 문서 검색 | RAG | 권한 안의 문서에서 조항을 찾아 쪽 번호와 함께 답하는 일 | — | 설계안 6.3 |
| 봉투 암호화 | 화면에 없음 | envelope encryption | 칸 값을 앱에서 데이터 키로 암호화하고 그 키를 KMS로 다시 암호화하는 방식 | — | 조사 7 |
| 하트비트 | 화면에 없음 | heartbeat | 작업자와 현장 어댑터가 주기적으로 보내는 살아 있다는 신호. 끊기면 앱 밖 점검이 경보를 낸다 | — | 설계안 6.1 |
| 위임 권한 | 화면에 없음 | delegation | 세션이 없는 에이전트 실행이 사람 대신 조회할 때 쓰는 권한. 요청자, 범위, 만료를 서버가 저장하고 호출마다 현재 권한을 다시 평가한다 | `[미정]` | 설계안 6.3 |
| 실제 입주자 데이터 투입 조건 | 화면에 없음 | go-live criteria | 2단계 완료 기준. 복구, 알림, 접속기록, 법률 검토, 대체 절차 훈련을 모두 채워야 실제 데이터를 받는다 | — | 설계안 4.2 |
| 위탁·이전 대장 | 화면에 없음 | processor register | 수탁자, 항목, 처리 위치, 이전 근거를 적은 설정 파일. 대장에 없는 경로로 나가는 배포를 막는다 | — | 설계안 6.6 |
| 데이터 분류표 | 화면에 없음 | data classification | 컬럼마다 분류, 암호화 여부, 보존 기간, 모델 투입 가능 여부를 적은 표. M0 산출물이다 | — | 설계안 6.8 |
| AI 기능 등록부 | 화면에 없음 | AI register | AI 기능의 대상, 입력 분류, 최종 결정자, 고지 문구 버전과 고영향 해당성 점검을 적는 표 | — | 설계안 6.3 |
| 긴급 열람 | 화면에 없음 | break-glass | 평소 권한 밖의 정보를 사유, 승인자, 만료를 남기고 여는 일. 사후에 통지한다 | `[미정]` | 설계안 6.8 |
| 대체 절차 | 화면에 없음 | downtime procedure | 시스템이 멈출 때 직원이 읽기 전용 스냅샷과 기록으로 이어받는 절차 | — | 설계안 6.1 |
| 현장 전환 | 화면에 없음 | site cutover | 기존 장부를 쓰는 사업장을 이 시스템으로 옮기는 일. 한 사업장부터, 월 마감 경계에서 한다 | — | 설계안 10.6 |

## 공용 문구

2026-11-04에 사용자가 확정한 14건이다(`결정` 2026-11-04 행). 고칠 때는 한 모듈만 바꾸지 않고 허브에 제안한다.

| 번호 | 확정 문구 | 쓰는 화면 | 출처 |
|---|---|---|---|
| 1 | 침대로 가셨어요 | 보호자 건강 소식 상세(FAM-06d, 밤 침대 떠남 문장 끝) | safety C3, family C4-4 |
| 2 | 프런트 전화와 직원 안내는 전처럼 쓰실 수 있어요 | AI 사용 안내 비서 5(FAM-05, AST-01) | assistant C4, family C3-1 |
| 3 | 앱 연결이 잠시 끊겼어요 | 회원·보호자 연결 오류(COM-05, 모든 모듈). 직원 화면은 "서버와 연결이 잠시 끊겼습니다" | 각 모듈 C 오류 절 |
| 4 | 비상 연락처에 적힌 분께 | 보호자 건강 소식의 119 예시(FAM-06d) | safety C3, family C4-4 |
| 5 | 매주 보내는 생활 소식은 AI가 먼저 써요 | AI 사용 안내 생활 소식 1(FAM-05) | family C3-1 |
| 6 | 직원이 대신 요청해 드려요 | 생활 요청 첫 화면의 다른 길(REQ-01) | requests C2-1 |
| 7 | 이은숙 회원님이 일정을 보여 주지 않기로 하셨어요 | 보호자 허락이 꺼질 때만(CMN-12, FAM-06e). 생활 요청도 같은 틀(REQ-10) | community C7, requests C7 |
| 8 | ○○○ 회원님이 허락하신 (소식, 청구서, 일정, 건강 소식, 생활 요청)이에요 | 보호자 화면 상단 안내(FAM-06a·c·d·e, REQ-10, CMN-12) | family C4-1·4-4·4-6, core C3, requests C3-1, community C3-1 |
| 9 | 이사 나가실 날 | 회원·보호자 화면만(비서 날짜 답, 보호자 일정). 직원 화면은 퇴거 예정일 | assistant C2-3, family C4-6 |
| 10 | 아직 입주 전이에요 | 회원 청구서의 입주 전 상태(CORE-08) | core C3 |
| 11 | 5억 8천만 원 | 회원 화면의 억 단위 금액(CORE-08 보증금 안내). 직원 화면은 숫자 그대로 | core C3 |
| 12 | 지금은 비서가 입주 계약의 날짜와 청구서만 볼 수 있어요 | AI 사용 안내 비서 2(FAM-05, AST-01) | assistant C4, family C3-1 |
| 13 | 자리를 기다리시는 프로그램과 시설 예약은 보이지 않아요 | 일정 안내(FAM-20, FAM-06e, CMN-12) | family C2-11·4-6, community C3-1 |
| 14 | 소식 함께 보기 열기 | 안심 알림 바꾸기 버튼(SAF-09) | safety C4-4 |

같은 결정에서 정한 그 밖의 말:
- 그대로 쓰는 말: 함께 보실 분, 대신 처리하실 분, 내실 돈, 지나온 일.
- 프런트 번호는 `02-000-0000 (가상 번호)`다.
- 단계가 바뀐 적 없는 회원에게는 "이번에 바뀌지 않아요" 제목을 숨긴다(TRN-09).

## 쓰지 않는 말

범위의 "모든 화면"은 직원 화면까지 포함한다. 기획 문서의 설명과 코드 이름은 이 규칙의 대상이 아니다.

| 쓰지 않는 말 | 범위 | 바꿔 쓸 말 | 이유 | 출처 |
|---|---|---|---|---|
| 노인, 독거노인 | 모든 화면 | 회원님, 입주자 | 비하 인상 | core M, 루트 |
| 입소자 | 모든 화면(법령 인용은 예외) | 입주자 | 요양시설 어감 | 결정, transitions M |
| 어르신 | 모든 화면 | 회원님, 입주자 | 나이를 강조한다 | 결정 |
| 회원 | 직원 화면 | 입주자 | 상담 고객, 대기자까지 가리켜 계약 상태와 어긋난다 | 결정, core M |
| 입주자님 | 회원에게 말할 때 | 회원님 | 어색하고 관리 대상처럼 들린다 | 결정 |
| 보호자 | 회원 화면 | 함께 보실 분 | 회원이 고른 사람이라는 뜻을 살린다 | safety M, family M |
| 낙상, 쓰러짐, 응급, 위험 | 모든 화면 | 관찰된 사실과 시각 | 시스템이 판단하는 것처럼 읽힌다 | 루트, safety M |
| 배회 | 모든 화면 | 밤에 1층 정문으로 나가셨습니다 | 인지 저하를 낙인찍는다 | safety M |
| 감지했습니다, 이상 행동 | 모든 화면 | 관찰된 사실과 시각 | 판단 단정 | safety M |
| 고독사, 골든타임, 이대로 두면 | 모든 화면 | 쓰지 않는다 | 공포 표현 | safety M, core M |
| 판정, 하향·상향, 악화, 중증, 퇴소, 강제, 부적합, 문제 행동, 치매 환자 | 모든 화면 | 본 일을 쓴다 | 판단과 낙인 | transitions M, requests M |
| 등급(단계를 뜻할 때) | 모든 화면 | 단계 | 장기요양 등급과 헷갈린다 | transitions M |
| 전원, 요양원으로 옮기심, 단계가 떨어짐, 케어 플랜, 평가 점수, 단계 번호 | 회원·보호자 화면 | 지낼 곳 함께 의논, 단계 이름 | 내리막으로 읽힌다 | transitions M |
| 케어 | 회원 화면 | 돌봄, 구체 행동 | 쉬운 말 | core M |
| 결식 | 회원 화면 | 드시지 않은 식사 | 쉬운 말 | core M |
| 몰취 | 회원 화면 | 중도 퇴거 시 돌려드리지 않는 금액 | 쉬운 말 | core M |
| 차감 | 회원 화면 | 빼 드렸어요 | 쉬운 말 | core M |
| 채권, PMS, RBAC | 회원 화면 | 쓰지 않는다 | 업무 말과 약어 | core M |
| 미납, 연체 | 모든 화면 | 아직 내셨다는 기록이 없어요. 경리 업무 말로는 직원 화면에서 미수납을 쓴다 | 판정은 MVP 밖이다 | 결정 확정 2026-11-04, requests M, assistant T4-4 |
| AI가 알아서, AI가 판단, AI가 낙상을 감지 | 모든 화면 | 쓰지 않는다 | 판단 대행 오해, AI 기본법 고지 원칙과 충돌 | core M, safety M, assistant M |
| AI가 작성한 리포트(단독) | 모든 화면 | AI가 초안을 쓰고 ○○○ 직원이 확인했어요 | 직원 확인 사실이 빠진다 | family M |
| AI가 단계를 추천 | 모든 화면 | 쓰지 않는다 | C에는 AI가 없다 | transitions M |
| 안심 보장, 100%, 24시간 지켜 드립니다, 놓치는 신호 0 | 모든 화면 | 쓰지 않는다 | 근거 없는 보장 | core M, safety M |
| 계속 거주 보장, 자동으로 요금 반영 | 모든 화면 | 쓰지 않는다 | 확인되지 않았고 기능이 없다 | transitions M |
| 빠르게 처리해 드립니다, 24시간 안에 | 모든 화면 | 쓰지 않는다 | 처리 시간을 약속할 근거가 없다 | requests M |
| 무엇이든, 언제든, 24시간 | 회원 화면 | 쓰지 않는다 | 지킬 수 없는 약속 | assistant M |
| 말벗, 친구, 대화 친구 | 회원 화면 | 쓰지 않는다 | 정서적 과의존 위험 | assistant M |
| AI 에이전트, 도구, 챗봇, 프롬프트, 의도 | 회원 화면 | 비서 | 내부 말 | assistant M |
| 추천, 투자, 자산, 자산 관리, 재테크, 상품 안내 | 회원 화면, 금전 화면 | 쓰지 않는다 | 금융 권유로 읽힌다 | assistant M, family M |
| 정확한 답, 틀리지 않아요 | 모든 화면 | 쓰지 않는다 | 보장할 근거가 없다 | assistant M |
| 감시, 지켜보기, 위치 추적, 관리 대상 | 모든 화면 | 쓰지 않는다 | 회원을 감시 대상으로 그린다 | family M |
| 모니터링 | 모든 화면 | 쓰지 않는다 | 사생활 침해 인상 | 결정 확정 2026-11-04, family M |
| 동의 철회 | 회원·보호자 화면 | 그만 보여 주기 | 쉬운 말 | family M |
| 권한, 열람 | 회원·보호자 화면 | 보기, 본 기록 | 쉬운 말 | family M |
| 리포트 | 회원·보호자 화면 | 생활 소식 | 쉬운 말 | family M |
| 민감정보 | 회원·보호자 화면(법적 고지문 안은 예외) | 쉬운 말과 함께 쓴다 | 쉬운 말 | family M |
| 안심 알림, 안부 | 동의 항목 이름 | 건강 소식 | 호출벨 서비스 동의처럼 읽힌다 | family M |
| 에스컬레이션, 이벤트, 알람 | 회원·보호자 화면 | 쉬운 말로 풀어 쓴다 | 내부 말 | safety M |
| 내용, 건강, 링크 | 보호자 문자 | 새 소식이 있다는 말만 | 문자가 건강 정보를 드러낸다 | safety M |
| 민원 | 회원 화면 | 불편한 점 | 관청 말 | requests M, requests N2 |
| 티켓, 작업 지시, SLA | 회원 화면 | 요청, 정기 청소 | 내부 말 | requests M |
| 반려, 처리 불가 | 회원 화면 | 이 요청은 해 드리기 어려워요 | 탓하는 말 | requests M, requests N3 |
| 진료, 증상 | 병원 동행 입력 | 날짜와 가실 곳 | 일정과 이동만 받는다 | requests M |
| 고립, 외로움 해소, 치매 예방, 건강 개선 | 모든 화면 | 쓰지 않는다 | 효과 근거가 없다 | community M |
| 활동량, 참여율, 적극적, 소극적 | 모든 화면 | 쓰지 않는다 | 입주자를 평가한다 | community M |
| 결석, 불참, 불참자, 노쇼 | 모든 화면 | 오지 않음(직원 화면만) | 평가처럼 읽힌다 | community M |
| 미확인, 미확인자 | 모든 화면 | 확인 전 | 근거 태그와 헷갈리고 탓하는 말 | community M |
| 참여해 보세요, 놓치지 마세요, 마감 임박, 인기 | 모든 화면 | 남은 자리와 대기 순서를 숫자로 | 재촉하지 않는다 | community C, community N |
| 커뮤니티, 클래스, 슬롯, 웨이팅, RSVP | 회원 화면 | 프로그램, 날짜와 시각 | 외래어. 커뮤니티는 slug와 문서에서만 쓴다 | community M |
| 판(버전의 뜻) | 버전을 말할 때 어디서든 | 버전 | 사용자 지시 | 결정, community M |
| 그대로인 것 | 회원 화면 | 바뀌지 않는 것 | 어색한 말 | transitions M |
| 입주를 기다리고 있어요 | 회원 화면 | 아직 입주 전이에요 | 공용 문구 확정 | core M, 결정 |
| 비상 연락처로 등록된 분 | 보호자 화면 | 비상 연락처에 적힌 분 | 공용 문구 확정 | core M, 결정 |
| 급할 때 연락할 분 | 보호자 화면 | 비상 연락처에 적힌 분 | 회원 화면 말이다 | family M |
| 보여 주기로 한 | 보호자 화면 상단 | 허락하신 | 공용 문구 확정 | 결정 |
| 대신 올려 드려요 | 회원 화면 | 대신 요청해 드려요 | 공용 문구 확정 | 결정, requests C |
| 퇴거하실 날 | 회원·보호자 화면 | 이사 나가실 날 | 공용 문구 확정 | 결정 |
| 소식 함께 보기로 가기 | 회원 화면 | 소식 함께 보기 열기 | 공용 문구 확정 | 결정 |
| [지원 회사] | 브랜드와 화면 | Evenstay | 회사 이름과 표지를 쓰지 않는다 | 루트 |
| Unit, 세대 | 아키텍처 페이지와 도식 | 호실 | 이 저장소의 말이 아니다 | 설계안 2.3 |
| Site | 아키텍처 페이지와 도식 | 사업장 | 이 저장소의 말이 아니다 | 설계안 2.3 |
| Organization, 테넌트 | 아키텍처 페이지와 도식 | 운영사 | 소유주 범위가 빠져 뜻이 어긋난다 | 설계안 2.1 |
| Customer | 아키텍처 페이지와 도식 | 입주자, 인물 | 계약 상태를 흐린다 | 설계안 2.3 |
| Worker | 아키텍처 페이지와 도식 | 작업자 | 제품 이름 안에서만 쓴다 | 설계안 2.3 |
| Agent | 아키텍처 페이지와 도식 | 에이전트 | 제품 이름 안에서만 쓴다 | 설계안 2.3 |
| 단계 지도 | 아키텍처 페이지와 도식 | 단계별 구성 | 한국 개발 문서에서 쓰지 않는 말이다 | 사용자 지시 2026-11-05 |
| 발전 지도 | 아키텍처 페이지와 도식 | 확장 계획 | 한국 개발 문서에서 쓰지 않는 말이다 | 사용자 지시 2026-11-05 |
| 발전 단계 | 아키텍처 페이지와 도식 | 확장 단계 | 한국 개발 문서에서 쓰지 않는 말이다 | 사용자 지시 2026-11-05 |
| 출발 안 | 아키텍처 페이지와 도식 | 구성안 | 한국 개발 문서에서 쓰지 않는 말이다 | 사용자 지시 2026-11-05 |
| 넘어가는 신호 | 아키텍처 페이지와 도식 | 도입 기준 | 한국 개발 문서에서 쓰지 않는 말이다 | 사용자 지시 2026-11-05 |
| 이정표 | 아키텍처 페이지와 도식 | 마일스톤 | 한국 개발 문서에서 쓰지 않는 말이다 | 사용자 지시 2026-11-05 |
| 들어가는 조건 | 아키텍처 페이지와 도식 | 시작 조건 | 한국 개발 문서에서 쓰지 않는 말이다 | 사용자 지시 2026-11-05 |
| 마치는 기준 | 아키텍처 페이지와 도식 | 완료 기준 | 한국 개발 문서에서 쓰지 않는 말이다 | 사용자 지시 2026-11-05 |
| 통과 기준 | 아키텍처 페이지와 도식 | 완료 기준 | 한국 개발 문서에서 쓰지 않는 말이다 | 사용자 지시 2026-11-05 |
| 그때 정할 것 | 아키텍처 페이지와 도식 | 결정 사항 | 한국 개발 문서에서 쓰지 않는 말이다 | 사용자 지시 2026-11-05 |
| 실운영 | 아키텍처 페이지와 도식 | 운영 전환 | 한국 개발 문서에서 쓰지 않는 말이다 | 사용자 지시 2026-11-05 |
| 승인형 에이전트 | 아키텍처 페이지와 도식 | 승인 기반 에이전트 | 한국 개발 문서에서 쓰지 않는 말이다 | 사용자 지시 2026-11-05 |
| 외부 캐너리 | 아키텍처 페이지와 도식 | 외부 상태 점검 | 한국 개발 문서에서 쓰지 않는 말이다 | 사용자 지시 2026-11-05 |
| 재시도 예산 | 아키텍처 페이지와 도식 | 재시도 한도 | 한국 개발 문서에서 쓰지 않는 말이다 | 사용자 지시 2026-11-05 |
| 연결 수 예산 | 아키텍처 페이지와 도식 | DB 연결 한도 | 한국 개발 문서에서 쓰지 않는 말이다 | 사용자 지시 2026-11-05 |
| 일곱 트랙 | 아키텍처 페이지와 도식 | 영역별 | 한국 개발 문서에서 쓰지 않는 말이다 | 사용자 지시 2026-11-05 |
| 트랙 | 아키텍처 페이지와 도식 | 영역 | 한국 개발 문서에서 쓰지 않는 말이다 | 사용자 지시 2026-11-05 |
| 안 A | 아키텍처 페이지와 도식 | A안 | 한국 개발 문서에서 쓰지 않는 말이다 | 사용자 지시 2026-11-05 |
| 안 B | 아키텍처 페이지와 도식 | B안 | 한국 개발 문서에서 쓰지 않는 말이다 | 사용자 지시 2026-11-05 |
| 안 C | 아키텍처 페이지와 도식 | C안 | 한국 개발 문서에서 쓰지 않는 말이다 | 사용자 지시 2026-11-05 |
| 안심 서비스 보장, 무중단 보장 | 아키텍처 페이지와 도식 | 쓰지 않는다 | 설계안이고 측정한 값이 없다 | 설계안 머리말 |
