# Evenstay MVP 화면 정의

상태: 승인(2026-11-03). 4-7절(데스크톱 배치)과 7절 결정 12도 같은 날 사용자가 확인했다. 7절 결정 13(검수에서 정의서에 막혔던 화면 6건의 배치)은 같은 날 사용자가 "정의서에 막힌 2건, 남은 설계 문제 4건"을 고르고 고친 것이다.

변경: 2026-11-03 서비스 보완 화면 추가(사용자 재승인 2026-11-04). 사용자가 서비스 빈 곳 보완 범위 "넓게(N1 포함)"를 골라 갱신된 기획(모두 초안·사용자 재승인 2026-11-04)의 화면을 넣었다. 새 행은 3-1·3-2·3-3절과 새 3-6절(N1 생활 요청), 컷은 6절, 내역은 8-1절 변경 기록에 있다. 이 변경분은 정의서 재승인 전까지 캔버스에 반영하지 않는다.

변경: 2026-11-04 보완 화면 목록 추가(사용자 재승인 2026-11-04). 2026-11-04 승인·보완된 기획의 새 화면을 **목록만** 넣었다(새 행 33개, 바뀐 행 47개, 새 3-7절 N2). 5절 통합 흐름은 시드 초기화 없이 시계만 옮기는 41단계로 다시 이었고, 6절은 "통합 데모 흐름에 나오는지"(흐름/부록/없음) 표시로 바꿨다. 흐름 정의(들어오는 곳, 나가는 곳, 버튼 목적지)는 다음 단계다. 내역은 8-1절.

변경: 2026-11-04 레이아웃 검토 핵심 제안 적용(사용자 재승인 2026-11-04, 7절 결정 14). 회원 첫 화면 6타일 + 묶음 화면(COM-09), 운영 사이드바 6묶음과 역할별 첫 화면, CORE-01 3층, 운영 휴대폰 틀(4-9절), 운영 화면 틀(4-9절), 보호자 첫 화면·읽기 골격, 확인 규칙, 4-7절 빈칸, 아트보드 묶음(6-2절). 같은 날 `DESIGN.md` v2.5.

변경: 2026-11-04 화면 합치기 74개 안 적용(사용자 재승인 2026-11-04, 7절 결정 15). 사용자가 "74개 안(탭·목록상세)"을 골랐다. 행은 지우지 않고 2·3절에 "들어갈 곳과 형태" 열을 더했다. 따로 만들 페이지는 6-1절, 5절 화면 열은 "화면 + 탭/상태"로 고쳤다. 근거는 `senior-lab/00-hub/reviews/screen-necessity-review-2026-11-04.md`. 같은 날 4-8절 REQ-01 설명을 N1 copy 2-1에 맞추고 SAF-09 "다른 길" 문장에서 "앱과 똑같이"를 뺐다. CMN-01 행을 N2 `prd.md`, copy 2-1(묶음 타일, COM-09)에 맞추고 5절 20단계에 COM-09를 넣었다(6절 흐름 94, 없음 27). 탭·단계·버튼 이름은 확정 카피로 바꿨다(사용자 재승인 2026-11-04).

이 문서는 승인된 다섯 모듈 기획과 디자인 시스템으로 MVP에 필요한 화면을 한곳에 모은 것이다. 새 기능을 정하지 않는다. 기획 문서에 없는 화면, 문구, 배치는 `[가설]`로 표시하고 근거를 적었다. 값이 다르면 아래 원본이 맞다. 7절은 사용자가 2026-11-03에 정한 결정이다.

| 무엇 | 원본 |
|---|---|
| 화면 목록 | `docs/{core,safety,family,assistant,transitions,requests,community}/prd.md` 8절 |
| 데모 시나리오와 시드 | 각 `prd.md` 9절. 시드 값은 코어 `prd.md` 9절 |
| 인수 조건 | 각 `user-stories.md` (표기: 코어 US-03 → `core US-03`) |
| 화면 문구 | 각 `copy/copy.md` (표기: `B copy 2-4`) |
| 화면 디자인 | 루트 `DESIGN.md` v2.6, `design/brand/guidelines.html` |
| 모듈 경계 | 루트 `CLAUDE.md` 규칙 8("확인할 일" 조립), 규칙 9(`/demo/reset`) |

모듈 약칭: 코어 = Core(`core/`), B = 안심 알림(`safety/`), D = 보호자 포털·동의(`family/`), G = AI 생활 비서(`assistant/`), C = 생활 지원 단계(`transitions/`), N1 = 생활 요청(`requests/`, 화면 ID 접두어 `REQ`), N2 = 프로그램·시설·공지(`community/`, 화면 ID 접두어 `CMN`. `COM-`은 공통 화면).

---

## 1. 이용자와 앱

세 앱은 같은 색, 모양, 컴포넌트를 쓰고 글자 크기와 컨트롤 높이만 다르다(`DESIGN.md` Overview "세 밀도").

| 앱 | 이용자 | 밀도 | 말투 | 최대 폭 |
|---|---|---|---|---|
| Evenstay 홈 | 입주 회원(70~80대), 대리인(P1 화면) | 본문 `body-lg` 20px, 버튼·입력 56px, 터치 56px, 가장 작은 글자 17px | 해요체, "회원님" | 560px 한 열. 1024px 이상 본문 + 보조 열(최대 1120px, 4-7절) |
| Evenstay 패밀리 | 보호자(자녀) | 본문 `body-md` 17px, 버튼 56px(주)·48px(보조), 터치 48px | 해요체, "○○○ 회원님" | 720px, 1~2단. 1024px 이상 본문 + 보조 열(최대 1120px, 4-7절) |
| Evenstay(운영) | 본사, 경리, 프런트, 생활지원·간호, 사업장 책임자, 소유주 | 본문 `body-sm` 15px, 버튼 40px, 입력 44px, 터치 44px | 합쇼체·명사형 라벨, "입주자" | 1280px, 12단 |

공통 규칙(`CLAUDE.md` 시니어 서비스 원칙, `DESIGN.md` Do's and Don'ts):
- 화면당 채운 버튼은 하나. Home은 여기에 앱 밖 경로(`alt-path`, "프런트로 전화하기") 하나를 더한다.
- 근거 밑줄(`evidence-highlight`)은 화면에 한 곳.
- 판단 단어(낙상, 쓰러짐, 응급, 위험, 배회)를 쓰지 않는다. 관찰된 사실과 시각만 쓴다.
- 입주자의 건강, 생활, 단계, 계약 상태는 중립 `badge`와 글자로 쓰고 신호등 색을 쓰지 않는다.
- 동의는 스위치나 미리 체크된 칸으로 받지 않는다.
- 데모 데이터는 가상이고, 화면에 그렇게 밝힌다.

### 1-1. Evenstay 홈 내비게이션
- 하단 탭을 쓰지 않는다. 첫 화면 목록에서 들어가고, 모든 화면 위쪽에 "처음으로" 버튼이 있다(`DESIGN.md` Layout "반응형 기준점" 아래 목록). 첫 화면(COM-07)에서는 같은 자리의 "처음으로"가 링크가 아니라 지금 위치 표시다(사용자 결정 2026-11-03).
- 첫 화면은 `menu-tile` 6개(1024px 이상 3×2, 640~1023px 2열 세 줄, 640px 아래 목록 여섯 줄)다(7절 결정 14, 레이아웃 검토). 더 많은 볼 곳은 묶음 화면(COM-09)으로 한 번 더 연다. 순서는 `[가설]`이다. 묶음 이름은 "프로그램과 예약", "도움과 안심"으로 정했다(사용자 2026-11-04, 코어 `names.md`).
  1. 프로그램과 예약 → 묶음 화면: 프로그램(CMN-02) · 시설 예약(CMN-08) · 공지(CMN-10). 부제는 오늘 신청·예약 한 줄("오늘 11:00 수채화 신청하셨어요")이고, 오늘 일이 없으면 평소 부제
  2. 생활 요청 (N1, REQ-01). 부제 "진행 중인 요청 1건"
  3. 이번 달 청구서 (코어, CORE-08)
  4. 비서 (G, AST-02)
  5. 소식 함께 보기 (D, FAM-01. Evenstay 홈 안의 "Evenstay 패밀리" 메뉴)
  6. 도움과 안심 → 묶음 화면: 생활 지원 단계(TRN-09) · 급할 때 연락할 분(CORE-08의 "급할 때 연락할 분" 영역으로 바로 감 `[가설]`) · 안심 알림(SAF-09, P1). 호출 중이면 부제가 "호출 중이에요"로 바뀐다
- "꼭 보실 공지" 띠(CMN-01)는 인사 아래, 타일 위에 한 줄만 둔다(공지가 둘 이상이어도 "꼭 보실 공지 2건" 한 줄). 오늘 신청·예약 한 줄은 따로 두지 않고 1번 타일 부제에 넣는다.
- 대리인(김태호)은 같은 COM-07의 다른 상태다. 허락된 범위(청구서 확인·결제, 비서)만 타일로 보이고 범위 문장 한 줄을 둔다(FAM-13과 같은 아트보드, 6-2절).
- 모든 화면에 "프런트로 전화하기"를 둔다(G copy 2-1, C copy 3-1 버튼. G copy 비서 화면은 큰 버튼 "프런트로 전화하기" 아래에 "02-000-0000 (가상 번호)"를 쓴다. D copy는 문장 안에서 "프런트 02-000-0000 (가상 번호)로 전화 주세요"라고 쓴다). 번호는 `DESIGN.md` `alt-path`처럼 글자로 보인다. MVP는 데모용 가상 번호 "02-000-0000"을 쓰고, 번호 옆에 "가상 번호"라고 표시한다 `[가설]`(7절 결정 8).

### 1-2. Evenstay 패밀리 내비게이션
- 1024px 이상에서는 목록-상세 화면을 뺀 모든 화면의 보조 열에 같은 목록이 늘 보여, 소식 사이를 첫 화면을 거치지 않고 옮겨 다닌다. 목록-상세 화면(FAM-06d, REQ-10, 공지 상세)은 보조 열이 없고 "첫 화면으로"를 거친다(4-7절, `DESIGN.md` side-rail).
- 첫 화면은 허락 항목만 타일이다(1~5개, 홀수면 마지막 타일 전폭). 새 소식 줄은 부재 카드(FAM-16)만 두고, 청구서 소식은 청구서 타일 부제로 옮긴다. "내가 볼 수 있는 것"은 타일이 아니라 타일 아래 한 줄이다. 레지던스 공지(CMN-13)는 허락 소식과 떼어 1024px 이상 보조 열 위쪽, 1024px 아래 본문 맨 아래 별도 카드다(7절 결정 14).
- 첫 화면(FAM-06a)이 내비게이션이다. 회원님이 허락한 항목(생활 소식, 일정, 청구서, 건강 소식, 생활 요청)만 목록에 나오고, "내가 볼 수 있는 것"으로 범위를 확인한다(D copy 4-1, 4-3). 항목 순서와 다섯째 "생활 요청"(P1, 누르면 N1 REQ-10)은 D `copy/names.md`의 보호자 메뉴를 따른다(서비스 보완, 사용자 재승인 2026-11-04). 새 메뉴는 없고, 일정 안에 신청 프로그램 줄(CMN-12), 첫 화면에 허락 항목이 아닌 "레지던스 공지" 칸(CMN-13)이 더해진다(2026-11-04).
- 위쪽 `app-bar`: Evenstay 패밀리 로고, 보고 있는 회원 이름 `[가설]`. MVP에서 보호자는 회원 한 명만 본다. 회원 바꾸기는 Next다(7절 결정 11).

### 1-3. Evenstay(운영) 내비게이션
- 이동할 곳이 7개 이하면 상단 바, 넘으면 사이드바다. 60rem 아래에서 사이드바는 메뉴 버튼과 시트로 접는다(`DESIGN.md` Layout).
- 운영 화면은 이동할 곳이 7개를 넘으므로 사이드바를 쓴다. 묶음은 `[가설]`이다(7절 결정 5. 근거: PRD 8절의 화면 이용자와 모듈 이름 `names.md` v3).

운영 화면의 모듈 이름은 한글로 보인다(사용자 결정 2026-11-03). `docs/core/copy/names.md` v3와 각 모듈 copy·기획 문서도 같은 날 허브가 senior-lab에서 고쳐 다시 인계했다(안심 알림 / 보호자 포털·동의 / AI 생활 비서 / 생활 지원 단계).

사이드바는 일 기준 6묶음이다(7절 결정 14, 레이아웃 검토). 항목 이름은 `[가설]`이다. 항목 줄 오른쪽에 처리할 건수를 단다(맡지 않은 신호, 배정 전, 결정 대기, 검토 대기. `number-sm`, 해석 문구 없음).

| 묶음 | 항목 | 화면 |
|---|---|---|
| 오늘 | 오늘의 운영 | CORE-01(TRN-08, CORE-13 "예정 복귀일 지남", REQ-19, FAM-19, AST-13, CMN-23은 이 화면의 줄·칸) |
| 입주자 | 사업장·호실 / 입주 계약 / 장기 부재 / 생활 지원 단계 / 보호자 연결 | CORE-02(CORE-15는 탭) / CORE-04(CORE-10, 12는 탭), 05 / CORE-13 / TRN-01~05(TRN-06, 07은 TRN-02 탭. TRN-05 결정 대기가 항목) / FAM-09, 11(FAM-08, 15는 탭), 12 |
| 돈 | 식사 기록 / 청구 / 월 리포트 | CORE-06 / CORE-07(CORE-11은 탭) / CORE-09, 14 |
| 안전 | 지금 처리할 신호 / 호실 현황 / 기기 상태 | SAF-01(SAF-05는 탭. SAF-02, 13, 16, 17은 여기서) / SAF-12(SAF-15는 책임자 읽기 모드) / SAF-08(SAF-10은 탭) |
| 요청·프로그램 | 생활 요청 / 프로그램·시설·공지 / 주간 생활 리포트 | REQ-12(REQ-13~16, 21은 서랍·대화창. AST-09는 이 항목 안 별도 페이지) / CMN-14(CMN-15, 16, 19, 21은 탭 안. CMN-17, 20은 여기서) / FAM-10 |
| 설정 | 요금 규칙 / 단계 정의 / 안심 규칙·당번표 / 요청 종류·정기 작업 / 공용 시설 / 점검 | CORE-03 / TRN-12 / SAF-11 / REQ-17, 18 / CMN-22 / AST-11(AST-10은 탭) |

| 역할 | 첫 화면 | 보이는 묶음 |
|---|---|---|
| 야간 직원 | SAF-01 | 안전뿐. 사이드바 대신 상단 탭, 휴대폰은 아래 탭(4-9절) |
| 프런트 | REQ-12 | 입주자, 돈(식사 기록), 안전(전화로 받은 호출 등록, 기기 연결), 요청·프로그램 |
| 경리 | CORE-01(확인할 일) | 오늘, 입주자(계약), 돈 |
| 생활지원·간호 | SAF-12 | 안전, 입주자(생활 지원 단계, 보호자 연결), 요청·프로그램 |
| 사업장 책임자 | CORE-01 | 6묶음 모두(설정은 자기 사업장 값) |
| 본사 | CORE-01(사업장 선택) | 6묶음 모두 |
| 소유주 | CORE-09 | 사이드바 없음. CORE-09와 월 리포트 |
| 데모 진행자 | 지금 보던 화면 | 위쪽 막대(COM-01~03) |

- 기록 화면은 일하는 화면의 탭이다(SAF-05는 SAF-01, TRN-07은 TRN-02, 결정 15). FAM-11은 보호자 연결 안에 두고 감사용 점검(AST-11)만 설정 아래 "점검"으로 둔다. 팀(시설, 청소·세탁, 운전)은 N1 설정이라 REQ-12 안의 거름으로만 쓴다.
- SAF-06과 COM-01~03은 사이드바가 아니라 데모 진행자 막대에서 연다.
- 소유주 계정은 CORE-09 하나만 본다(코어 `prd.md` 9절 5단계). 위탁 운영 계약은 CORE-09 안 카드에서 자기 사업장 한 줄만 연다(결정 15).
- 역할마다 보이는 묶음이 다르다. 권한 검사는 코어 `authorize()` 하나다(`CLAUDE.md` 규칙 5).

---

## 2. 공통 화면

| ID | 이름 | 이용자 | 하나의 행동 | 근거 | 가설 여부 | 들어갈 곳과 형태 |
|---|---|---|---|---|---|---|
| COM-01 | 데모 계정 고르기 | 데모 진행자 | 시드 계정을 고른다 | `core US-17` 인수 조건 1, 코어 copy 2-11. 로그인 없이 화면 상단에서 고른다 | 계정 목록 문구는 코어 copy 2-11(22계정, 6묶음, 사용자 재승인 2026-11-04). 막대의 위치와 배치는 `[가설]` | 페이지: 진행자 막대(팝오버 3개) |
| COM-02 | 데모 시계 | 데모 진행자 | 기준 날짜·시각을 옮긴다 | `core US-17` 인수 조건 2. 멈춘 시계, 초 단위 | 문구 `[가설]` | → COM-01 진행자 막대의 시계 팝오버 |
| COM-03 | 시드 초기화 | 데모 진행자 | 시작 상태를 골라 되돌린다 | `core US-17` 인수 조건 4~7, `CLAUDE.md` 규칙 9 | 문구 `[가설]` | → COM-01 진행자 막대의 초기화 팝오버 |
| COM-04 | 권한 없음 | 모두 | 다른 화면으로 돌아간다 | 코어 copy 4절, D copy 6절, G copy 2-5 | 화면이 아니라 각 화면의 상태로 쓴다 | 모든 화면의 상태 |
| COM-05 | 오류(연결 오류 등) | 모두 | 다시 시도한다 | 코어 copy 4절, B copy 5절, D copy 6절, G copy 6절, C copy 5절 | 화면이 아니라 상태 | 모든 화면의 상태 |
| COM-06 | 빈 상태 | 모두 | 첫 항목을 만든다(직원) | 코어 copy 2-1 빈 상태, `DESIGN.md` `empty-state` | 화면이 아니라 상태 | 모든 화면의 상태 |
| COM-07 | Home 첫 화면 | 회원 | 볼 곳을 고른다 | `DESIGN.md` Layout(첫 화면 목록, 하단 탭 없음) | 화면 자체가 `[가설]` | 페이지 |
| COM-08 | 운영 앱 틀(app-bar, 사이드바, 사업장 선택) | 직원, 소유주 | 이동할 곳을 고른다 | `DESIGN.md` `app-bar`, `nav-item`, Layout | 묶음 구성 `[가설]` | 페이지 |
| COM-09 | 묶음 화면(프로그램과 예약 / 도움과 안심) | 회원 | 볼 곳을 고른다 | 레이아웃 검토(2026-11-04, 7절 결정 14). 첫 화면 6타일에 들지 않는 볼 곳을 한 번 더 연다 | 화면은 `[가설]`, 묶음 이름은 코어 `names.md` 확정. 한 아트보드에 두 상태 | 페이지 |

- **로그인 화면은 MVP에 두지 않는다.** `core US-17`이 "로그인 없이 시드 계정을 바꾼다"고 정했다. 운영 설정에서는 계정 고르기와 시계 API가 없다(인수 조건 3). 실제 로그인 화면은 기획 밖이다.
- **데모 진행자 막대 `[가설]`.** COM-01~03은 모든 앱 위쪽의 한 줄 막대에 둔다. 근거는 US-17 "화면 상단에서 고른다". 막대는 데모 환경 설정에서만 보이고, 막대 안 글자에 "데모"를 밝힌다.
- **COM-03 시작 상태:** 기본(시드 그대로, 인수 조건 4), "승계 후"(`AFTER_SUCCESSION`, 시계 2026-11-10), "C 퇴원 후"(`C_AFTER_DISCHARGE`, 시계 2026-12-07 저녁), "G 시작 상태"(`G_START`, 시계 2027-01-05 10:00:00). 상태마다 코어 장기 부재 시드가 다르다(코어 `prd.md` 9절, 사용자 재승인 2026-11-04). `app/` 데모 라우트가 core → safety → family → assistant → transitions → requests → community 순서로 각 `<모듈>/seed`의 `reset(state)`를 부르고, 모르는 상태는 400이다(`CLAUDE.md` 규칙 9).
- **COM-04 문구 예(원본 그대로):**
  - 직원: "이 사업장은 다른 소유주의 사업장이라 볼 수 없습니다."(코어 copy 4절)
  - 보호자: "이 소식은 지금 볼 수 없어요. 볼 수 있는 범위는 이은숙 회원님이 정해요."(D copy 6절)
  - 회원 비서: "다른 분의 청구서는 제가 볼 수 없어요."(G `prd.md` 9절 4단계)
- **COM-05 문구 예:** 직원 "서버와 연결이 잠시 끊겼습니다. 입력한 내용은 저장되어 있습니다. 다시 시도해 주세요."(코어 copy 4절), 보호자 "앱 연결이 잠시 끊겼어요. 조금 뒤에 다시 열어 주세요."(D copy 6절). 회원 문구도 "앱 연결이 잠시 끊겼어요."로 시작한다(호출벨까지 끊겼다고 읽히지 않게).
- **상태 네 가지:** 데이터를 읽는 모든 영역은 로딩(`skeleton`), 빈 상태(`empty-state`), 오류(`alert` + 다시 시도), 권한 없음(COM-04 문구)을 그린다(`DESIGN.md` Components). 아래 표의 "상태" 열은 그 화면에 특별한 것만 적는다.

---

## 3. 화면 목록

열: **ID** · **이름**(화면에 보이는 그대로. 카피에 제목이 없으면 PRD 이름) · **이용자** · **하나의 행동**(채운 버튼) · **출처**(PRD 8절 행, 스토리) · **API**(읽고 쓰는 `api/`) · **컴포넌트**(shadcn/ui + `DESIGN.md`) · **상태**(특별한 것) · **카피** · **데모**(쓰이는 단계).

- API 열: 같은 모듈 화면은 그 모듈의 application을 부르고, 다른 모듈 데이터는 그 모듈 `api/`로만 읽는다(`CLAUDE.md` 규칙 2, 8). `[가설]` 이름은 tech-design에 공개 이름이 없어 `core/api`에 새로 두기로 한 것이다(7절 결정 7). 코어 tech-design 반영은 구현할 때 허브가 한다.
- 데모 열: 코어 `prd.md` 9절 = 코어 n, B·D·G·C는 각 `prd.md` 9절 단계 번호. "부록"은 시간이 남을 때.

### 3-1. 코어(Evenstay Core)

| ID | 이름 | 이용자 | 하나의 행동 | 출처 | API | 컴포넌트 | 상태 | 카피 | 데모 | 들어갈 곳과 형태 |
|---|---|---|---|---|---|---|---|---|---|---|
| CORE-01 | 오늘의 운영 | 본사, 경리. 운영 현황 카드는 책임자, 본사만(서비스 보완) | 확인할 일 한 줄을 연다 | 코어 8절 1행, `core US-01`, 코어 8절 새 화면 정의(운영 현황 카드, 8절 14행·prd.md:120, 132), `core US-25` | `core/api` `TodoQuery`, C `TransitionsInboxQuery` 등 각 모듈 `api/`(규칙 8). 운영 현황 카드는 `app/`이 `GET /sites/{id}/operations-board`로 조립하고 `?cards=<카드>`로 한 카드만 다시 읽는다(TD:423, 517): 코어 `OccupancyQuery.summary`·`AbsenceQuery.openAbsences`, B `SafetyBoardQuery.boardOf`, D `FamilyConsentSummaryQuery.siteSummary`, G `AssistantUsageQuery.summary`(D·G는 actor 인자가 없어 `app/`이 먼저 `authorize(..., CHECK)`, TD:516), N1 `ServiceRequestQuery.openCount`, N2 `CommunityBoardQuery.todayOf`(9번째 카드, 후보 `[가설]`, TD:531) | Card, Table, Badge, Button(다시 불러오기), Alert(카드 조회 실패) / `list-cell`, `money`, `number`·`number-sm`(카드 숫자), Skeleton | 빈 상태(사업장 없음), 카드 없음(모듈이나 권한이 없을 때), 한 카드 조회 실패(나머지 정상, "(화면 이름) 열기" 버튼), [다시 불러오기] 뒤 그 카드의 기준 시각만 바뀜(자동 갱신 없음), 끊긴 기기 숫자 없음(기기 연결 전), 오늘 당번표 비었음, 숫자마다 기준 시각 | 코어 copy 2-1, C copy 2-4 마지막 줄, 코어 copy 2-9(확인할 일 "예정 복귀일 지남"), 2-10(운영 현황 카드) | 코어 1, C 4, 카드는 통합 장면 8단계 뒤 2026-11-12 07:30(prd.md:182)과 12/7 복귀 뒤(prd.md:187), 부록(코어 9절 부록 2) | 페이지 |
| CORE-02 | 사업장·호실 목록 | 본사, 경리 | 사업장을 연다 | 코어 8절 2행, `core US-01`, `US-02` | `SiteQuery` | Table, Breadcrumb / `table` | 권한 없음(다른 소유주) | 코어 copy 2-1, 4절 | 코어 1, 5 | 페이지(탭: 사업장 목록 / 위탁 운영 계약) |
| CORE-03 | 요금 규칙 | 본사 | 요금 규칙을 저장한다 | 코어 8절 3행, `core US-06`, `core US-24` 조건 1(장기 부재 끼니 설정) | `core/api` `RateRuleCommand` `[가설]` | Form, Input, Select, Button | 입력 오류(발행일, 납부 기한) | 코어 copy 2-5 | 없음(시드) | 페이지 |
| CORE-04 | 입주 계약 목록·상세 | 경리 | 계약을 연다 / 상세에서 다음 상태 버튼 | 코어 8절 4행, `core US-03`, `US-04`, `US-14`, 보증금 보호 칸은 코어 8절 18행(prd.md:124, 136), `core US-28` | `ContractQuery.contractHistory`, 코어 `GET /audit-logs`(코어 `tech-design.md` 8-1), `ContractQuery.depositProtection`(TD:464), 보증금 보호 입력 `PUT /contracts/{id}/deposit-protection`(TD:438, 행동 `core.deposit_protection.manage`, 공개 command 이름은 TD 8-2에 없음 `[가설]`) | Table, Tabs, Badge, Select(보증보험), Input(date)(전세권 설정일) / `record-row` | 빈 상태(계약 없음), 보증금 보호 값이 비었을 때 "모름"(copy 2-2:72), 전세권 설정일 "없음"(copy 2-2:71), 변경 이력에 전후 값 한 줄(copy 2-2:74), 저장 버튼 이름이 copy에 없음 `[NEED: 카피]`(채운 버튼은 다음 상태 버튼 하나이므로 저장은 테두리 `[가설]`) | 코어 copy 2-2(보증금 보호 상태 칸 70~74행) | 코어 2, 4, 부록(보증금 보호, prd.md:189) | 페이지(탭: 계약 목록 / 대리인 / 퇴거 정산) |
| CORE-05 | 계약 작성 / 계약을 1인으로 바꿀까요?(승계 확인 창) | 경리 | 계약 체결 / 승계하기 | 코어 8절 5행, `core US-03`, `US-04`, `US-05`, `US-22`, 보증금 보호 칸은 코어 8절 18행, `core US-28` | 코어 application(계약 작성·체결·승계), `EmergencyContactQuery`, 보증금 보호 입력 `PUT /contracts/{id}/deposit-protection`(TD:438) | Form, Input, Select(보증보험), Input(date)(전세권 설정일), AlertDialog, Button | 같은 호실 겹침 거부, 보증보험 "모름" 선택지, 승계하면 보증금 보호 두 값이 새 계약으로 복사됨(US-28 조건 4, user-stories.md:328) | 코어 copy 2-2, 2-8, 4절 | 코어 2, 4(시드 값: 이은숙 계약 보증보험 가입, 전세권 설정일 없음, prd.md:160) | 페이지 |
| CORE-06 | 식사 기록 올리기 | 프런트, 경리 | 마감하기 | 코어 8절 6행, `core US-07`, `US-08` | `MealQuery`, `core/api` `MealCommand.closeMonth` `[가설]` | Input(file), Table, AlertDialog | 오류 행 미리보기 | 코어 copy 2-6 | 코어 3 | 페이지 |
| CORE-07 | 청구 생성·청구서 목록·근거 패널·다음 청구서에 들어갈 사용 기록 탭 | 경리 | 이번 달 청구서 만들기 → 발행하기. 청구서 표에 수납 상태(미수·일부·완납), 낸 금액, 방법, 대신 낸 표시(P1, `core US-30`) | 코어 8절 7행, `core US-09`, `US-10`, `US-11`, 사용 기록 탭은 코어 8절 17행(prd.md:123, 135), `core US-26` | `BillingQuery`, `MealQuery`, 사용 기록 탭은 `ServiceChargeQuery.pendingUsages`(TD:461)와 `GET /sites/{id}/service-usages?status=PENDING`(TD:437, 행동 `core.service_usage.view`) | Table, Tabs, Sheet(근거 패널), AlertDialog / `money`, `evidence-highlight` | 식사 마감 전 거부, 사용 기록 탭 빈 상태(copy 2-3:94), 청구 항목 이름 "서비스 이용료"와 근거 패널의 서비스 줄(copy 2-3:95-96), 사용 기록 출처는 기록을 넘긴 모듈이 준 이름(데모는 생활 요청) | 코어 copy 2-3, 2-14, 4절 | 코어 3, 통합 장면 10단계와 11단계 사이 2026-11-17 17:00(탭), 12단계 뒤 2026-11-30(청구 생성·발행)(prd.md:183-184) | 페이지(탭 더함: 입주자가 문의한 청구) |
| CORE-08 | 이번 달 청구서(인쇄 보기 포함) | 회원, 대리인 | 수납 상태가 미수·일부면 첫 행동 [내기]로 CORE-16을 연다(P1, `core US-30`) / 항목을 눌러 근거를 본다 / "이 금액이 이상해요"(P1). 완납이면 [내기] 대신 낸 금액과 날짜, 결제 진행 중이면 진행 중 안내, 청구서 확인 범위만 있는 대리인은 프런트 안내 한 줄 | 코어 8절 8행, `core US-12`, 보증금 보호 줄은 코어 8절 18행, `core US-28` | `BillingQuery`, `ContractQuery.depositProtection`(회원 본인과 SIGN_CONTRACT 범위 대리인만, TD:464-465) | Card, Separator, Button / `money`, `evidence-highlight`, `alt-path` | 입주 전 안내, 보증금 보호 줄 셋(보증보험 가입·전세권 없음 / 미가입·전세권 설정일 있음 / 모름이면 프런트에 물어봐 달라는 문장, copy 3절 381-383), 보호자 화면에는 줄이 없음, 서비스 이용이 있을 때 항목 한 줄(copy 3절 378) | 코어 copy 3절 | 코어 3, 부록(보증금 보호, prd.md:189) | 페이지. "급할 때 연락할 분"은 이 화면 안 칸(1-1절 6번 묶음에서 바로 옴) |
| CORE-09 | 소유주 현황 | 소유주, 본사(TD:361에서 본사도 볼 수 있다. 월 리포트 진입 때문) | 사업장 합계를 본다. 위에 [월 리포트] 버튼으로 CORE-14를 연다 `[가설: 채운 버튼인지 copy에 없음]` | 코어 8절 9행, `core US-13`, `US-02`, 월 리포트 버튼은 `core US-27` 조건 1(user-stories.md:314) | `SiteQuery`, `BillingQuery`(이름 가린 합계) | Card, Table, Button | 권한 없음(다른 소유주 주소) | 코어 copy 4절, 코어 copy 2-12(CORE-09 버튼 "월 리포트", copy 2-12:315) | 코어 5, 통합 장면 12/1(월 리포트로 이어짐, prd.md:185) | 페이지. 소유주용 위탁 운영 계약 카드(자기 사업장 한 줄) 포함 |
| CORE-10 | 대리인 등록 | 프런트, 본사 | 등록 / 승인 | 코어 8절 10행, `core US-15`, `US-16` | `RepresentationQuery`, `core/api` `RepresentationCommand` `[가설]` | Form, RadioGroup, Checkbox | 특정후견 범위 안내 | 코어 copy 2-4 | 없음(P1) | → CORE-04 "대리인" 탭 |
| CORE-11 | 입주자가 문의한 청구 | 경리 | 문의를 처리한다 | 코어 8절 11행, `core US-19` | `InquiryCommand`, `BillingQuery` | Table, Sheet | 빈 상태 | 코어 copy 2-3 | 부록(P1) | → CORE-07 "입주자가 문의한 청구" 탭 |
| CORE-12 | 퇴거 정산 미리보기 | 경리, 본사 | 정산 확정 | 코어 8절 12행, `core US-21` | `ContractCommand`, `BillingQuery` | Card, Table, AlertDialog / `money` | 승인 대기 | 코어 copy 2-7 | 없음(P1) | → CORE-04 "퇴거 정산" 탭 |
| CORE-13 | 장기 부재 | 사업장 직원(프런트·생활지원·간호), 경리, 책임자, 본사 | [부재 시작](채운 버튼 하나). 행 버튼 [복귀 기록]·[예정 복귀일 바꾸기]·[등록 취소]는 `ghost` 버튼(표 줄 행동 규칙, 결정 14) | 코어 8절 13행(prd.md:119, 131), `core US-23`, `US-24` 조건 6 | `AbsenceQuery.openAbsences`(목록). 시작·예정 복귀일 수정·복귀·등록 취소는 TD:422 REST(`/residents/{id}/absences`, `/absences/{id}`, `/absences/{id}/end`, `/absences/{id}/cancel`)를 부르는 코어 application. 공개 command 이름은 TD 8-2에 없음 `[가설]` | Table, Form, Select(입주자), RadioGroup(접수 경로, 취소 사유), Input(date) 또는 Calendar+Popover(날짜), Checkbox("모름"), AlertDialog(기록하기, 등록 취소 확인), Badge 중립("예정 복귀일 지남") / `field-error` | (현재 행과 같음) | 코어 copy 2-9 | 코어 통합 장면 12단계 뒤 2026-12-02 11:10(이은숙 시작)과 13단계 앞 2026-12-07 16:40(복귀 기록)(prd.md:186-187), 부록(prd 9절 부록 2, prd.md:176) | 페이지 |
| CORE-14 | 월 리포트 | 소유주, 본사(운영 매니저·관리자) | 달을 고른다(보는 화면, 채운 버튼 없음) | 코어 8절 15행(prd.md:121, 133), `core US-27`, F21(prd.md:100) | `app/`이 `GET /owner/reports/{yyyy-mm}?siteId`(TD:436)로 조립: 코어 `OwnerReportQuery.monthOf`(TD:463), B `SafetyBoardQuery.monthOf`(행동 `safety.owner_report.view`), N1 `ServiceRequestQuery.monthlySummary`(행동 `requests.summary.owner_read`). 코어 행동 `core.owner_report.view`(TD:366) | Card, Select(달 고르기), Alert(아직 다 세지 않은 달) / `number`·`number-sm`, Skeleton | 청구서가 아직 없는 달(copy 2-12:331), 이번 달 고름(아직 다 세지 않은 달 표시, copy 2-12:330), 수납 기능 없음("기록 없음", copy 2-12:324), 모듈이 배포에 없으면 그 묶음 없음, 한 묶음 조회 실패(그 숫자만 실패 문구와 [다시 불러오기], copy 2-12:332), 다른 소유주 사업장 주소(COM-04 문구, copy 2-12:333), 숫자마다 기준 시각. 이름·호실·목표선·좋음·나쁨 색 없음 | 코어 copy 2-12, 4절 | 코어 통합 장면 12단계 뒤 2026-12-01 10:00 온누리 담당자 → 다온 담당자(prd.md:185) | 페이지 |
| CORE-15 | 위탁 운영 계약 | 본사 관리자(입력), 본사 운영 매니저·소유주(읽기. 소유주는 자기 사업장 줄만) | [새 위탁 계약](본사 관리자만. 읽기 계정은 보는 화면). 행 버튼 [끝난 날 넣기]는 `ghost` 버튼(표 줄 행동 규칙, 결정 14) | 코어 8절 16행(prd.md:122, 134), `core US-29`, F23(prd.md:102) | `ManagementContractQuery.historyOf`(TD:465). 쓰기는 `GET·POST /sites/{id}/management-contracts`, `POST /management-contracts/{id}/end`(TD:439). 행동 `core.management_contract.manage`·`core.management_contract.view`(TD:367-368). 공개 command 이름은 TD 8-2에 없음 `[가설]` | Table, Select(사업장 고르기, 구분), Form(입력 칸 4개), Input(date), AlertDialog(기록하기, 끝난 날), Badge 중립("진행 중") | 빈 상태 둘(본사 관리자용 문구, 읽기 계정용 문구, copy 2-13:355-356), 기간 겹침 거부(copy 2-13:354, TD:439 409), 다른 소유주 사업장 주소(COM-04), 신고 칸·신고 안내 없음(개정안 확정 전 `[미정]`, copy 2-13:336), 지우는 기능 없음 | 코어 copy 2-13, 4절 | 부록(prd.md:190). 소유주는 자기 사업장 한 줄만 읽는다 | → CORE-02 "위탁 운영 계약" 탭. 소유주는 CORE-09 안 카드에서 자기 사업장 한 줄만 연다 |
| CORE-16 | 청구서 결제 | 회원, PAY 범위 대리인 | 낼 금액을 확인하고 낸다. 목업 결제 화면에서 성공, 실패, 그만두기 중 하나를 고른다 | 코어 8절 CORE-16(`prd.md` 141행), `core US-30`, F16 | POST `/me/invoices/{id}/payment-attempts`, GET `/me/payment-attempts/{id}`(TD 3-6, 8-1) | Card, Button / `money`, `alt-path` | 이미 낸 청구서, 일부를 낸 청구서(남은 금액만), 결제 진행 중, 자동이체 결과 대기(실연동 때만), 청구서 확인 범위만 있는 대리인, 만료된 대리인. 카드 번호, 계좌 번호, 금액 입력 칸이 없다 | 코어 copy `core16.*`, `core08.pay.*`, `core07.pay.*` | 부록(prd.md 205행) | 페이지 |

### 3-2. B 안심 알림

| ID | 이름 | 이용자 | 하나의 행동 | 출처 | API | 컴포넌트 | 상태 | 카피 | 데모 | 들어갈 곳과 형태 |
|---|---|---|---|---|---|---|---|---|---|---|
| SAF-01 | 지금 처리할 신호 | 야간 직원 | 확인하러 갑니다 | B 8절 1행, `safety US-02`, `US-03`, `US-05`, `US-06`, `US-14`, `US-24`, `US-26`, `US-27`(맨 위 한 줄, P0), `US-29`(생활 요청에서 옮긴 호출), `US-32`(비상 명단 열기), `US-33`(P1 줄과 [보기]) | B 내부 `GET /safety/sites/{id}/board`(TD:259, `dutyLine`, `p1Lines`), `ResidentQuery.residentsInUnit`, `SiteQuery.listUnits`, `StaffQuery.listStaff`, 코어 `AbsenceQuery.openAbsences`(부재 중 표시). 옮긴 호출 카드의 입구는 N1이 부르는 `SafetyFrontCallCommand.registerFromRequest`(TD:287) | Card, Badge(중립) + Lucide 아이콘, Button, AlertDialog(비상 명단 열기 확인) / `record-row` | 기록만 묶음, 같은 입주자 묶음, 중복 수신. 맨 위 한 줄(맡지 않은 신호 · 오늘 당번, 끊긴 기기 칸은 SAF-08 전까지 숨김. 숫자 0이어도 줄은 남음). P1 줄 셋(병원에 가신 분 n명, 부재 중인 입주자 n명, 기기 연결이 필요한 입주자 n명)은 기능이 꺼져 있으면 필드와 줄이 없음. [보기] 대상은 SAF-13, SAF-14, SAF-10 안의 "기기 연결이 필요한 입주자" 목록. 출처 "생활 요청에서 옮김" 카드(카드를 누르면 "요청 내용은 생활 요청에 남아 있습니다…"). 놓친 방문 카드. 버튼 [전화로 받은 호출 등록], [비상 명단 열기]는 테두리 `[가설]` | B copy 2-1, 2-2, 2-3, 2-6, 2-11, 2-12, 2-15, 2-16, 2-17, 2-20 | B 1~3, B 9절 새 장면 B-1, B-2, B-3. 생활 요청에서 옮기는 장면은 N1 부록(`docs/requests/prd.md:170`) | 페이지(탭: 처리할 신호 / 알림 기록) |
| SAF-02 | 알림 상세 | 야간 직원 | 확인하러 갑니다 | B 8절 2행, `safety US-06`, `US-07`, `US-11`, `US-31`(더보기의 사고·학대 보고 쓰기 입구) | B 내부 `GET /safety/alerts/{id}`, `EmergencyContactQuery` | Card, Sheet, AlertDialog("이 알림을 맡을까요?", "모두 호출" 상태에서만), DropdownMenu(더보기) | 넘김 남은 시간, 다른 직원이 확인 중. 더보기 메뉴 "사고·학대 보고 쓰기"(맡은 직원·책임자에게만, SAF-16으로) | B copy 2-4, 2-5, 2-6, 2-9, 2-19(더보기 메뉴 한 줄) | B 3, 4, 부록, B-부록 | 페이지: 알림 처리, 3단계 패널(1/3 알림 내용) |
| SAF-03 | 조치 기록 | 야간 직원 | 조치 기록 저장 | B 8절 3행, `safety US-08`, `US-24`(병원 동행, P1) | B 내부, `AuditWriter` | Form, RadioGroup, Textarea / `record-row`. "병원으로 가심"을 고르면 동행 직원 Select와 출발 시각 Input(P1) | 입력 오류 | B copy 2-4, 2-16 | B 4 | → SAF-02 조치 패널(2/3) |
| SAF-04 | 보호자 알림 미리보기 | 야간 직원 | 보내기(= 조치 완료) / 올리지 않기 | B 8절 4행, `safety US-09`, `US-10` | `FamilyConsentQuery.viewersOf`(건강 소식을 볼 보호자), `GuardianQuery.guardiansOf`(이름 표시), `FamilyNoticeQuery.nextSendAt`, `HealthFeedCommand.post` | Card, Textarea, Select(올리지 않는 이유) | 건강 소식을 볼 보호자 없음 | B copy 2-8 | B 4 | → SAF-02 보호자 알림 패널(3/3) |
| SAF-05 | 알림 기록 | 사업장 책임자 | 알림 한 줄의 타임라인을 연다 | B 8절 5행, `safety US-12`, `US-23`(걸린 시간, P0), `US-26`(부재 중 기록 줄) | `GET /safety/sites/{id}/logs`(`minutesToAcknowledge`, `minutesToMeet`, TD:272) 등 B 내부, `SafetySummaryQuery`는 Later | Table, Accordion / `record-row`. "걸린 시간" 열(확인까지, 만나기까지) | 빈 상태, 필터 결과 없음, 아직 맡지 않음, 확인까지 6분 · 아직 만나지 못함, 부재 중에 들어온 신호의 기록 줄(알림 없이 기록만) | B copy 2-7 | 부록, B 9절 새 장면 B-1 | → SAF-01 "알림 기록" 탭(책임자, 본사만) |
| SAF-06 | 기기 시뮬레이터 + 직원 휴대폰 패널 | 데모 진행자 | 신호 보내기 | B 8절 6행, `safety US-01`, `US-13` | B 내부(어댑터 입구) | Card, Select, Button | 데모 환경에서만 | B copy 1절 데모 안내, 2-10 | B 1~3 | 페이지 |
| SAF-07 | 건강 소식 목록·상세 | 보호자 | (FAM-06d와 같은 화면) | B 8절 7행, `safety US-22` | `family/api` | FAM-06d 참고 | D 의존 | D copy 4-4, B copy 3-1·3-2 | B 5 | = FAM-06d(같은 화면) |
| SAF-08 | 기기 상태 | 야간 직원, 책임자 | 끊긴 기기를 확인한다 | B 8절 8행, `safety US-15` | B 내부 | Table, Badge, Alert | 신호 끊김을 "이상 없음"처럼 보이지 않게 | B copy 2-1 기기 상태, 5절 | 없음(P1) | 페이지(탭: 기기 목록 / 기기 연결) |
| SAF-09 | 안심 알림 | 회원 | 호출 중 상태를 본다. 비상 때 도움 칸은 [비상 때 도움이 필요해요]를 고른다(테두리) `[가설: 보는 화면이라 채운 버튼 없음]` | B 8절 9행, `safety US-16`, `US-32`(도움 필요 본인 설정) | `GET /safety/me/calls`(`me.status`), `PUT /safety/residents/{id}/evacuation-assist`(`evacuation.assist.set`, 본인만, TD:264) | Card, Button(테두리) / `alt-path` | 호출 중 상태, 비상 때 도움 칸. 고른 뒤의 표시 문구와 해제 문구는 카피에 없음(3절 어긋남 8) | B copy 4-1~4-4 | 없음(P1). 시드 "도움 필요" 1명은 B-부록 명단에서 보임 | 페이지 |
| SAF-10 | 기기 연결·장치 동의 | 프런트, 책임자, 직원(비상 때 도움 필요 대행) | 기기를 연결한다 | B 8절 10행, `safety US-18`, `US-25`(안부 방문 동의), `US-32`(도움 필요 직원 대행), `US-33`(기기 연결 할 일 목록) | B 내부 `POST /safety/resident-links`(TD:278, `link.edit`), `ResidentQuery`, `PUT /safety/residents/{id}/evacuation-assist`(직원 대행: 들은 사람, 들은 직원, 시각) | Form, Checkbox(동의 아님, 확인용), RadioGroup(들은 사람), Select / `field-error` | 동의 비어 있음, 이미 다른 입주자와 연결된 기기, 계약 승계로 끝난 연결, 연결 목록 비었음, 저장 실패. "기기 연결이 필요한 입주자" 할 일 목록(SAF-01 [보기]에서 열림). 도움 필요 칸은 이유를 받지 않음 | B copy 2-12 | 없음(P1) | → SAF-08 "기기 연결" 탭 |
| SAF-11 | 규칙·당번표 설정 | 책임자 | 저장한다 | B 8절 11행, `safety US-04`, `US-21`, `US-25`(안부 방문 설정) | B 내부, `StaffQuery.listStaff` | Table, Select, Form | | B copy 2-13(서비스 보완 때 들어옴, 사용자 재승인 2026-11-04) | 없음(P1) | 페이지 |
| SAF-12 | 안부 방문 | 생활지원(낮·야간 직원), 책임자 | 호실 줄을 눌러 결과를 시트에서 고른다(아래 고정 [저장]) | B 8절 15행(PRD:130), `safety US-25` | B 내부 `POST /safety/visit-records`, `GET/PUT /safety/sites/{id}/visit-plans`(TD:275), `ResidentQuery`, 코어 `AbsenceQuery.openAbsences`·`absenceOf`. 오늘 들를 곳 목록을 읽는 GET은 TD에 없음 `[가설]` | Card, Table, 체크 목록 줄 + 시트(결과 3개), Button, Badge(중립 "부재 중") / `record-row`, `list-cell` | 빈 상태(오늘 들를 곳 없음), 모두 기록함, 부재 중 줄(들르지 않음), 저장 실패 [다시 저장], 방에 계시지 않음(기록만, 알림 없음) | B copy 2-15(결과 선택지·놓친 방문 카드), 2-17 | B 9절 새 장면 B-2 | 페이지: 호실 현황(직원 쓰기 모드, 책임자 읽기 모드) |
| SAF-13 | 병원에 가신 분 | 야간 직원, 아침 근무자 | 돌아오심 시각을 덧붙인다(`[돌아오셨습니다]`) | B 8절 17행(PRD:132), `safety US-24`, `US-33`(F21, F29) | B 내부 `GET /safety/sites/{id}/hospital-escorts?open=true`(TD:260, 응답에 `absent`), `POST /safety/hospital-escorts/{id}/return`(TD:276, 돌아오심은 한 번만) | Card, Table, Dialog(시각 입력), Button / `record-row` | 빈 상태("병원에 가신 분이 없습니다."), 동행 직원 없음 줄, 부재 중으로도 등록된 줄, 근무가 바뀌어도 남음. N1 병원 동행 신청은 세지 않음(US:377) | B copy 2-16 | B 9절 새 장면 B-3 | 페이지: 자리 비운 입주자(탭: 병원에 가신 분 / 부재 중인 입주자) |
| SAF-14 | 부재 중인 입주자 | 야간 직원, 책임자 | (보는 화면) | B 8절 18행(PRD:133), `safety US-26`, `US-33`(F23, F29) | B 내부 `GET /safety/sites/{id}/absences`(TD:261, 코어 `AbsenceQuery.openAbsences(siteId, at, actor)` 그대로 전달, 복사 안 함), 코어 `tech-design.md:459` | Card, Table / `list-cell` | 빈 상태("지금 부재 중인 입주자가 없습니다."), 부재 정보 불러오지 못함(평소대로 알림을 보냄). 부재 이유·종류는 받지도 보이지도 않음 | B copy 2-17 | B 9절 새 장면 B-3(PRD:171) | → SAF-13 "부재 중인 입주자" 탭 |
| SAF-15 | 호실 현황 | 사업장 책임자, 직원 | (보는 화면) 호실마다 오늘 안부 방문, 부재 중, 마지막 신호, 처리 중 알림을 한 표로 본다 | B 8절 19행(PRD:134), `safety US-30`(F26) | TD:262 `GET /safety/sites/{id}/units-overview`(`alert.view`, 매 요청 계산), 코어 `ResidentQuery`, `SiteQuery.listUnits`, `AbsenceQuery.openAbsences`(US:344) | Table, Badge(중립 "부재 중") / `list-cell`, `record-row` | 빈 상태(보여 줄 호실 없음), "받은 신호 없음", 처리 중 알림 "없음", 오늘 안부 방문 칸 값 5개(다녀왔습니다·방에 계시지 않았습니다·입주자가 방문을 원하지 않으셨습니다·아직 없음·대상 아님), 부재 중 호실. 위치·영상·활동량 칸 없음 | B copy 2-18 | B 9절 새 장면 B-2(PRD:170, 18:10) | → SAF-12 책임자 읽기 모드 |
| SAF-16 | 사고·학대 보고 | 알림을 맡은 직원, 사업장 책임자(보기: 본사 관리자·매니저, 작성자) | 보고 저장(저장 전 확인 창의 채운 버튼. 취소와 [덧붙여 적기]는 테두리) `[가설: 채운 버튼은 확인 창 안 하나]` | B 8절 20행(PRD:135), `safety US-31`(F27) | TD:263 `POST /safety/alerts/{id}/incident-reports`, `GET /safety/incident-reports/{id}`(`incident.record`, `incident.view`, 열 때 SENSITIVE_READ). 덧붙이기 호출은 TD에 따로 없고 `corrects_id`를 가진 새 행(TD:81) `[가설: 같은 POST에 corrects_id]`. 보호자 통보 칸의 순위는 B 내부 `EmergencyCallLog`, 코어 `AuditWriter` | Form, Textarea(경위), RadioGroup(보호자 통보, 신고), Select(신고 기관), Input(시각), AlertDialog(저장 전 확인), DropdownMenu(알림 상세의 더보기) / `record-row`(덧붙인 줄), `field-error` | 경위 비어 있음, 저장 실패 [다시 저장], 볼 권한 없음, 저장 뒤 고칠 수 없고 덧붙임만, 신고의무 안내([미확인] 그대로 보임, 3절 어긋남 6). 판정·원인·책임 칸 없음. 보호자·D·G로 나가지 않음 | B copy 2-19 | B 9절 새 장면 B-부록(PRD:172, 시각은 허브가 정함) | 페이지 |
| SAF-17 | 비상 때 재실 명단 | 직원, 사업장 책임자 | 사람마다 [대피 확인함]을 누른다. 여는 확인 창 [열기]가 채운 버튼이고 줄 전체를 누르는 체크 목록(4-9절, 결정 14) | B 8절 21행(PRD:136), `safety US-32`(F28) | TD:264 `POST /safety/sites/{id}/evacuation-rolls`(열기), `POST /safety/evacuation-rolls/{id}/checks`(`evacuation.run`), 코어 `ResidentQuery`, `SiteQuery.listUnits`, `AbsenceQuery.openAbsences`. 열린 명단을 다시 읽는 GET은 TD에 없음 `[가설]` `GET /safety/sites/{id}/evacuation-rolls/open` | Card(층 묶음), Table 또는 `list-cell`, Badge(중립 "도움 필요", "부재 중"), AlertDialog(여는 확인), Button / `record-row` | 이미 확인된 분을 다시 누름(누가 언제), 모두 확인함, 명단을 열지 못함(종이 명단 안내, [다시 열기]), 부재 중인 분, 도움 필요 표시. 출입 신호로 재실을 추정하지 않음 | B copy 2-20 | B 9절 새 장면 B-부록(PRD:172) | 페이지 |

### 3-3. D 보호자 포털·동의(보호자 화면 Evenstay 패밀리)

| ID | 이름 | 이용자 | 하나의 행동 | 출처 | API | 컴포넌트 | 상태 | 카피 | 데모 | 들어갈 곳과 형태 |
|---|---|---|---|---|---|---|---|---|---|---|
| FAM-01 | 내 소식을 누구에게 보여 줄지 정하세요(입구) / 김지민 님(딸)께 보여 줄 것 / 그만 보여 주기 확인 창 | 회원 | 보여 주기 / 그만 보여 주기 | D 8절 1행, `family US-01`, `US-02`, `US-07`, `US-21`(생활 소식에 장기 부재), `US-23`(생활 요청 허락, P1), `US-20`(일정에 신청한 프로그램) | D 내부, `GuardianQuery` | Card, Button, AlertDialog / `consent-scope`, `list-cell` | 기본값 "안 보여요", 저장 실패. 항목은 다섯(생활 소식, 일정, 청구서, 건강 소식, 생활 요청). 생활 요청은 P1이라 N1이 없는 빌드에서는 넷만 보인다. 요약 줄은 항목 다섯 기준(어긋난 곳 10) | D copy 2-1, 2-3, 2-7, 6절 | D 1, 5, D-N1-1(11/17), D-N2-1(11/18) | 페이지(안내 대화창 상태 둘 더함) |
| FAM-02 | 건강 소식은 따로 여쭤봐요 | 회원 | 동의하고 보여 주기 | D 8절 2행, `family US-04` | D 내부, `AuditWriter` | Card, Button, Accordion(자세히 보기) | | D copy 2-4 | D 2 | 페이지 |
| FAM-03 | 직원이 적은 내용이 맞는지 봐 주세요 | 회원 | 맞아요 | D 8절 3행, `family US-08` | D 내부 | Card, Button / `consent-scope` | 입주자 확인 대기 | D copy 2-5 | D 2 | 페이지 |
| FAM-04 | 내 소식을 본 기록 | 회원 | (보는 화면) | D 8절 4행, `family US-10`, `US-23` 인수 조건 8 | D 내부, `GuardianViewLogCommand.record`(`app/`이 N1 보호자 생활 요청 화면을 그린 뒤 부름, TD 8-2 마지막 행) | Card / `record-row` | 빈 상태. 생활 요청 열람 줄은 그 시각 생활 요청 허락이 있을 때만 생김(철회 뒤에는 없음). 거부 줄은 회원에게 안 보임 | D copy 2-8 | D 5, D-N1-1 뒤(김지민이 N1 화면을 열 때) | 페이지(탭: 누가 봤는지 / 건강 소식에서 뺀 일) |
| FAM-05 | Evenstay는 AI(인공지능)를 이렇게 써요 | 회원, 보호자 | 읽었어요 | D 8절 5행, `family US-14`, G 8절 1행, `assistant US-01` | `AiNoticeQuery.acknowledged`, `AiNoticeCommand.acknowledge` | Card, Accordion(더 자세히 보기) | 확인 전 비서 잠김 | D copy 3-1, 3-2, G copy 4절 | G 1 | 페이지 |
| FAM-06a | 보호자 첫 화면 | 보호자 | 소식 한 줄을 연다 | D 8절 6행, `family US-06`(인수 조건 7 레지던스 공지 칸), `US-21`, `US-23`, `community US-17`(CMN-13) | D 내부, `FamilyConsentQuery`, D 내부 부재 소식 조회(코어 `AbsenceQuery`를 볼 때마다 읽음). `GET /family/residents/{id}/overview`가 N2 `NoticeQuery.guardianNoticesFor(residentId, at, actor)`를 보호자 actor로 불러 공지 칸을 그림(행동 `community.notice.view_as_guardian`, 허락 항목과 무관, 활성 보호자 관계만. 사본 없음, 열람 기록·본 기록에 안 남김 `[가설]`). 생활 요청 건수 줄의 조회 이름은 정해지지 않았다 `[미정]`(어긋난 곳 13) | Card, `list-cell`. 레지던스 공지 칸은 Card + `list-cell`(공지 상세 포함 = CMN-13) | 볼 수 있는 것이 없을 때. 새 소식 카드 "자리를 비우셨어요 / 돌아오셨어요"(P1, FAM-16으로 감). 볼 수 있는 항목이 다섯(11/18 뒤)이 되면 "볼 수 없는 것"과 그 아래 안내가 사라짐. 생활 요청 자리 아래 건수 줄(처리하고 있는 요청이 있을 때 / 없을 때). 레지던스 공지 칸: 공지가 없을 때 "보호자께 알리는 공지가 없어요."(N2 copy 6절, D copy에는 없음. 어긋난 곳 12), [읽었어요] 없음. 타일 배치(4-7절 2×2)와 공지 칸 자리는 다시 정해야 한다 `[가설]` | D copy 4-1, 4-3, 6절. 공지 칸은 N2 copy 3-2 | D 3, B 5, C 4, D-N1-1(11/17 뒤 생활 요청 줄), D-N2-1(11/18 15:00 공지 칸. N2 M8), D-부재-1(12/2 새 소식 카드) | 페이지(부재 카드 + 상세 서랍 더함) |
| FAM-06b | 11월 셋째 주 생활 소식 | 보호자 | 내용이 이상해요(P1) | D 8절 6행, `family US-13`, `US-19`, `US-21`(FAM-16 카드가 이 화면 안) | D 내부, `MealQuery.mealsOf`(프로그램·요청 줄 재료는 FAM-10 참고) | Card, Badge(AI 표시) | 허락 없음. 식사 줄은 부재 끼니를 뺀 숫자이고, 한 주 내내 자리를 비우셨으면 식사 줄이 없음. 프로그램 줄(수요일 가벼운 체조, 목요일 수채화)과 요청 줄은 재료가 있을 때만 | D copy 4-2, 3-4 | D 4 | 페이지 |
| FAM-06c | 청구서(보호자) | 보호자 | (보는 화면) | D 8절 6행, `family US-06` | `BillingQuery` | Card / `money`, `consent-scope` | 허락 없음 | 코어 copy 3절 "보호자 화면 상단" | D 3 | 페이지 |
| FAM-06d | 건강 소식(목록·상세) | 보호자 | 소식을 연다 | D 8절 6행, `family US-11`, `safety US-22`, `transitions US-10` | D 내부(B·C가 `HealthFeedCommand.post`로 올림) | Card, `list-cell` / `record-row` | 허락 없음, 별도 동의 없음 | D copy 4-4, B copy 3절, C copy 4절 | B 5, D 3, C 4 | 페이지 |
| FAM-06e | 일정 | 보호자 | (보는 화면) | D 8절 6행, `family US-20`(인수 조건 6~8), `community US-16`(CMN-12) | 코어 `ContractQuery.keyDates` 6개 날짜 + N2 `ProgramQuery.enrolledSessionsOf(residentId, from, to, actor)`를 보호자 actor로 부름(행동 `community.enrollment.view_as_guardian`, SCHEDULE 허락 필요. 사본 없음) | Card, `list-cell` | 빈 상태("아직 정해지지 않았어요." / "이은숙 회원님이 신청하신 프로그램이 없어요."). 쉬는 회차 줄("11월 19일 목요일 수채화는 쉬어요."). 일정 허락 없음(COM-04 문구). 프로그램이 더해지기 전에 일정을 허락한 회원은 FAM-20 확인 전까지 프로그램 줄 없음. 대기·취소한 신청, 시설 예약, 출석은 안 보임 | D copy 4-6, 2-3 항목 2, 2-11 | D-N2-1(11/18 15:00, N2 M8). 새 통합 장면 | 페이지 |
| FAM-06f | 내가 볼 수 있는 것 | 보호자 | (보는 화면) | D 8절 6행, `family US-06` | `FamilyConsentQuery` | Card / `consent-scope` | 범위가 넓어졌을 때, 좁아졌을 때 | D copy 4-1, 4-3 | D 3 | 페이지 |
| FAM-07 | 건강 소식에서 뺀 일 | 회원 | (보는 화면) | D 8절 7행, `family US-11` | D 내부 | Card / `record-row` | 빈 상태 | D copy 2-9 | 없음 | → FAM-04 "건강 소식에서 뺀 일" 탭 |
| FAM-08 | 건강 소식 올리지 않기 주간 목록 | 본사 운영 매니저, 책임자 | 한 줄을 연다 | D 8절 8행, `family US-11` | D 내부 | Table / `record-row` | 빈 상태 | 카피 없음(D `prd.md` 8절 8행). 직원 안내는 B copy 2-8 "올리지 않은 일은 운영 매니저가 매주 확인합니다." 참고 | 없음 | → FAM-11 "건강 소식 올리지 않기 주간 목록" 탭 |
| FAM-09 | 보호자 연결 · A동 201호 이은숙 입주자 | 프런트 | 입주자 말씀대로 입력하기 | D 8절 9행, `family US-03`, `US-23` | `GuardianQuery`, `ResidentQuery.getResident`, D 내부 | Form, Checkbox(항목 고르기), Table. 표에 "생활 요청" 칸(P1) | 입주자 확인 대기 | D copy 5-1 | D 2 | 페이지 |
| FAM-10 | 주간 생활 리포트 · 검토 대기 | 생활지원 | 확인하고 발송 | D 8절 10행, `family US-12` | D 내부, `MealQuery.mealsOf`, `StaffQuery`, N2 `AttendanceQuery.attendedIn(residentId, from, to, actor)`(프로그램 줄), N1 `ServiceRequestQuery.doneIn(residentId, from, to, actor)`(요청 줄). 근거 패널에는 sessionId, requestId만 남김 | Table, Sheet(근거 패널), Textarea, Alert(병명 경고) | 직원 확인 전 발송 불가. N1이 없으면 요청 줄 없이 초안. 건강 문장 경고 낱말 목록의 판단 단어 문제는 D 추출 어긋난 곳 14 | D copy 5-2 | D 4 | 페이지 |
| FAM-11 | 열람 기록 · A동 201호 이은숙 입주자 | 본사 매니저 | 기간 기록 내려받기 | D 8절 11행, `family US-09` | D 내부(열람 기록, D `tech-design.md` ADR-F5) | Table / `record-row` | 거부 줄 | D copy 5-4 | D 5 | 페이지(탭: 열람 기록 / 건강 소식 올리지 않기 주간 목록 / AI 고지·동의) |
| FAM-12 | 금전 부탁 접수 | 프런트, 생활지원 | 접수한다 | D 8절 12행, `family US-15` | `MoneyRequestCommand.open`, `RepresentationQuery` | Form, RadioGroup | | D copy 5-3 `[운영사 기준 초안]` | 부록(P1) | 페이지 |
| FAM-13 | 대리인 화면 | 대리인 | 범위 안 일을 한다 | D 8절 13행, `family US-16` | `RepresentationQuery.activeScopes` | Card / `consent-scope` | 범위 밖 거부 | D copy 2-6, 4-5 | 부록(P1) | 페이지 |
| FAM-14 | 함께 보실 분 초대하기 / 초대 수락·본인 확인 | 회원, 보호자 | 초대 보내기 / 수락 | D 8절 14행, `family US-17` | D 내부 | Form, Input | 링크 기간 지남, 본인 확인 실패 | D copy 2-2, 6절. 회원의 초대(Home)와 보호자의 수락(Family)을 PRD 한 행대로 한 ID로 묶음 | 없음(P1) | 페이지 |
| FAM-15 | AI 고지·동의 | 본사 | (보는 화면) | D 8절 15행, `family US-18` | `AiNoticeQuery`, `AssistantUsageQuery` | Table | | D copy 5-5 | 없음(P1) | → FAM-11 "AI 고지·동의" 탭 |
| FAM-16 | 자리를 비우신 소식과 돌아오신 소식(생활 소식 화면 안 카드. 카드 첫 줄은 "이은숙 회원님이 12월 2일부터 자리를 비우셨어요.") | 보호자 | (보는 화면) | D 8절 16행(`prd.md:138`, ID는 8절 행 번호를 따른 `[가설]`), `family US-21`, 설명 `prd.md` F18(`prd.md:111`), 장면 D-부재-1·2(`prd.md:188-189`) | 같은 모듈 D 내부 `GET /family/residents/{id}/absences`(`tech-design.md:307`), 코어 `AbsenceQuery.absencesIn`, `absenceOf`(볼 때마다 읽음. 사본 저장 없음, `tech-design.md:122`), `FamilyConsentQuery`(LIFE_REPORT 허락) | Card, `list-cell` / `consent-scope`(허락 표시는 4-2와 같은 줄) | 생활 소식 허락 없음 또는 그만 보여 주기 뒤(COM-04 문구, 지난 부재 소식도 안 보임. 데모: 김태호는 11/23에 거둬 카드도 문자도 없음), 예정 복귀일 없음("돌아오실 날은 아직 정해지지 않았어요." 데모 카드는 이 줄. 코어 `prd.md:186` 예정 복귀일 모름), 예정일이 바뀐 경우(다음에 볼 때 바뀐 날짜, 표시 없음), 등록 취소된 부재(카드 없음), 사별 승계·정산으로 닫힌 부재(돌아오신 소식 없음), 건강 소식만 허락한 보호자(카드 없음), FAM-17 확인 전(카드 없음) | D copy 4-7(카드 6행), 4-1(첫 화면 새 소식 카드 2행: 12월 2일, 12월 7일), 6절 | D-부재-1(12/2), D-부재-2(12/7). 통합 데모 새 장면 | → FAM-06a 카드 + 상세 서랍 |
| FAM-17 | 생활 소식에 새로 들어가는 것이 있어요 | 회원, 대신 처리하실 분(MANAGE_GUARDIAN_ACCESS 대리인) | 알겠어요 | D 8절 17행(`prd.md:130`, ID는 8절 행 번호를 따른 `[가설]`), `family US-21` 인수 조건 8, `prd.md` 확인할 것 25 | D 내부 `GET /me/family/scope-notices`, `POST /me/family/scope-notices/{key}/ack`(`tech-design.md:290`), `ScopeNoticeAck`(notice_key = LIFE_REPORT_ABSENCE, `tech-design.md:61`), 코어 `GuardianQuery`(지금 보시는 분 이름) | Card, Button(채운 [알겠어요] 하나 + `secondary` [보여 줄 것 정하기]) / `consent-scope`, `alt-path`(프런트로 전화하기) | 확인 전에는 부재 카드와 문자가 없다(보호자 쪽 변화). 대신 처리하실 분은 같은 화면. 직원 태블릿 동석 확인도 가능(`tech-design.md:290`). 이미 본 뒤에는 다시 안 나옴(회원마다 한 번) | D copy 2-10(7행, 제목 포함) | 없음(P1) | → FAM-01 안내 대화창 상태 |
| FAM-19 | 보호자 동의 현황(CORE-01 운영 현황 카드 안 칸. 카드 제목 "보호자 동의 현황") | 사업장 책임자, 본사 | (보는 칸. 채운 버튼 없음. 아래 안내 "입주자별 상태는 보호자 연결 화면에서 확인하세요.") | D 8절 19행(`prd.md:141`, ID는 8절 행 번호를 따른 `[가설]`), `family US-22`, `prd` F19(`prd.md:112`), 코어 copy 2-10 "아래 1"(`docs/core/copy/copy.md:260`). ID `[가설]` | `app/`이 코어 `GET /sites/{id}/operations-board`로 조립. D `FamilyConsentSummaryQuery.siteSummary(siteId, at)`(숫자 8개, 이름·ID 없음. actor 인자 없음: `app/`이 먼저 코어 `authorize(actor, family.summary.read, site, at, CHECK)`, TD 8-2 `FamilyConsentSummaryQuery` 행) | Card / `number`·`number-sm`(카드 숫자), Skeleton | 권한 없음(카드를 그리지 않음), 모듈 없음(카드 없음), 이 칸만 조회 실패(나머지 카드 정상), 숫자마다 기준 시각, 목표선과 좋음·나쁨 색 없음 | D copy 5-6, 코어 copy 2-10 | 부록(코어 9절 부록 2). 11/12 07:30 장면에 넣을지는 코어가 정함(`prd.md:191`) | CORE-01 운영 현황 카드의 칸 |
| FAM-20 | 일정에 새로 들어가는 것이 있어요 | 회원, 대신 처리하실 분(MANAGE_GUARDIAN_ACCESS 대리인) | 알겠어요 | D 8절 행 없음(8절 20행 자리, 8절에 행을 더해야 함. 어긋난 곳 1), `family US-20` 인수 조건 7(`user-stories.md:257`), `prd` 확인할 것 28(`prd.md:318`). ID `[가설]` | D 내부 `GET /me/family/scope-notices`, `POST /me/family/scope-notices/{key}/ack`(`tech-design.md:301`), `ScopeNoticeAck`(notice_key = SCHEDULE_PROGRAMS, `tech-design.md:61`), 코어 `GuardianQuery`(지금 일정을 보시는 분 이름) | Card, Button(채운 [알겠어요] 하나 + `secondary` [보여 줄 것 정하기]) / `consent-scope`, `alt-path`(프런트로 전화하기) | 확인 전에는 보호자 일정(FAM-06e)에 프로그램 줄이 없다(날짜는 그대로). 대신 처리하실 분은 같은 화면. 직원 태블릿 동석 확인 가능. 이미 본 뒤에는 다시 안 나옴(회원마다 한 번). 프로그램을 일정에 켠 뒤(`schedule_programs_started_at`, 시드 11/01) 허락한 보호자에게는 안내 자체가 없음 | D copy 2-11(7행, 제목 포함) | 없음(P1, 부록 화면). 11/18 장면은 안내가 나오지 않는다(`prd.md:186`) | → FAM-01 안내 대화창 상태 |

### 3-4. G AI 생활 비서(회원 화면 Evenstay 홈 비서)

| ID | 이름 | 이용자 | 하나의 행동 | 출처 | API | 컴포넌트 | 상태 | 카피 | 데모 | 들어갈 곳과 형태 |
|---|---|---|---|---|---|---|---|---|---|---|
| AST-01 | AI 사용 안내 | 회원 | 읽었어요 | G 8절 1행, `assistant US-01` | FAM-05와 같은 화면 | | | G copy 4절 | G 1 | = FAM-05(같은 화면) |
| AST-02 | Evenstay 홈 비서 | 회원 | 큰 버튼 하나를 누른다(계약·청구서 날짜 / 이번 달 청구서 설명 / 직원에게 전하기 / 프런트로 전화하기) | G 8절 2행, `assistant US-02` | G 내부 | Button `secondary`(큰 버튼 4개, 모두 테두리) / `alt-path` | 고지 확인 전 잠김 | G copy 2-1 | G 1~2 | 페이지(지난 대화 구역, 대리인 역할 변형 더함) |
| AST-03 | 말로 묻기 | 회원 | 말한다 | G 8절 3행, `assistant US-05` | G 내부(라우터) | Button, Progress | 잘 못 들었을 때, 두 번 못 들었을 때 | G copy 2-2 | G 4 | 페이지 |
| AST-04 | 답 화면(일정, 청구 설명, 모를 때) | 회원 | 답 아래 버튼 하나 | G 8절 4행, `assistant US-03`, `US-04`, `US-06`, `US-10` | `ContractQuery.keyDates`, `BillingQuery.explainInvoice` | Card, Badge("AI 비서") / `evidence-highlight`, `money` | 나온 청구서 없음, 다른 분 청구서 | G copy 2-3, 2-4, 2-5 | G 2~5, 7 | 페이지(연결 끊김 상태 더함) |
| AST-05 | 직원에게 전하기(확인·완료) | 회원 | 네, 전해 주세요 | G 8절 5행, `assistant US-07` | G 내부(넘기기, 확인 토큰). 도구 밖 질문·직접 요청(주제 그 밖의 일)을 회원 본인이 넘기고 N1이 배포돼 있으면 같은 요청 안에서 `requests/api` `ServiceRequestCommand.receiveFromAssistant`를 동기로 부름(FORWARDED, G `tech-design.md` 3-2, 10-1). 회원 쪽 REST는 그대로 | Card, Button | 생활 요청으로 보내기가 성공하든 실패하든 미배포든 회원이 보는 완료 화면은 같음(US-07 9) | G copy 2-6 | G 5, 부록 | 페이지(청구 문의 변형 더함) |
| AST-06 | 청구 문의 확인·접수 | 회원 | 네, 전해 주세요 | G 8절 6행, `assistant US-12` | `InquiryCommand` | Card, Button | 코어 문의 기능이 없을 때 | G copy 2-4 | 부록(P1) | → AST-05 "청구 문의" 변형 |
| AST-07 | 지난 대화 | 회원 | (보는 화면) | G 8절 7행, `assistant US-14` | G 내부 | Card, `list-cell` | 빈 상태 | G copy 3절 | 없음(P1) | → AST-02 "지난 대화" 구역 |
| AST-08 | 대리인 비서 | 대리인 | 큰 버튼 하나 | G 8절 8행, `assistant US-13` | `RepresentationQuery`, `BillingQuery` | AST-02와 같음 | 범위 밖 버튼 안내 | G copy 2-7 | 부록(P1) | → AST-02 대리인 역할 변형 |
| AST-09 | 넘겨받은 요청 | 프런트, 책임자 | 처리 시작 → 처리 완료(메모 필수). "생활 요청으로 보냄" 줄에는 처리 버튼이 없고 [생활 요청 보기]만(테두리) | G 8절 9행, `assistant US-08`(인수 7), `US-07`(인수 9) | G 내부 `GET /assistant/admin/handoffs?status`, `…/{id}`, `/start`, `/complete`(FORWARDED면 422). 기본 목록은 NEW·IN_PROGRESS만, FORWARDED는 필터 "생활 요청으로 보냄"에서만. [생활 요청 보기]는 N1 직원 요청 상세(REQ-13, `GET /staff/requests/{id}`)로 이동(Handoff.external_ref = 요청 ID). 상세 열람 SENSITIVE_READ | Table, Sheet(상세), 필터 셋(처리할 요청 · 생활 요청으로 보냄 · 처리 완료) `[가설: 컴포넌트는 기획에 없음]`, Badge(중립, 상태 넷) / `record-row` | 빈 상태 둘(기본, "생활 요청으로 보낸 요청이 없습니다."), "생활 요청으로 보냄" 필터 위 한 줄, 상세 위 한 줄(보냈을 때), 보내지 못해 새 요청으로 남겼을 때 한 줄, 이유별 안내(건강, 금전, 투자 질문, 계약), 대리인 행위자 줄, 가린 번호 줄, 청구 문의 안내 | G copy 5-2 | G 6, 부록 | 페이지 |
| AST-10 | 대화 기록 | 직원 | 대화 한 건을 연다 | G 8절 11행, `assistant US-09` | G 내부 | Table, Sheet | | G copy 5-1 | 없음 | → AST-11 "대화 기록" 탭 |
| AST-11 | 도구 호출 기록 | 직원 | 거부 줄을 연다 | G 8절 12행, `assistant US-09`, `US-10` | G 내부(요약 카드) | Table, Card(요약 카드), Badge | 거부 줄(권한, 확인 토큰 없음), 요약 카드의 넘긴 비율에 FORWARDED도 넘김으로 셈(`tech-design.md` 8-2) | G copy 5-3 | G 6 | 페이지(탭: 도구 호출 기록 / 대화 기록) |
| AST-12 | 오류 안내 | 모두 | 큰 버튼으로 다시 묻는다 | G 8절 13행(스토리 없음) | G 내부 | Alert / `alt-path` | LLM 연결 끊김 | G copy 6절 | G 7 | → AST-04 연결 끊김 상태 |
| AST-13 | AI 생활 비서 사용량(운영 현황 카드의 한 칸, CORE-01 안) | 사업장 책임자, 본사 | (보는 칸) 숫자만 본다. 조회 실패 때만 [다시 불러오기] `[가설: 평소 누르면 가는 곳이 G 카피 5-4에 없음]` | G 8절 10행(스토리 없음, `prd.md` F17), 코어 8절 새 화면 정의(운영 현황 카드) | `app/`이 먼저 `authorize(actor, assistant.usage.read, {siteId}, at, CHECK)`(열람 기록 없음), 그 뒤 `assistant/api` `AssistantUsageQuery.summary(siteId, from, to) → {conversations, toolCalls, handoffRate, denied}`. 기간 from = 기준 시각 7일 전 `[가설]` | Card, Skeleton / `list-cell`, `number`·`number-sm`(카드 숫자) | 모듈 미배포·권한 없음이면 칸이 나오지 않음, 한 칸 조회 실패(나머지 정상, "불러오지 못했습니다" 줄), 기간 표시 "지난 7일 (…)", 숫자마다 기준 시각, 데모 숫자는 "시드 값"이라고 밝힘, 넘긴 비율에 생활 요청으로 보낸 대화도 들어감(카드 아래 한 줄), 사업장 직원에게는 없음 | G copy 5-4, 코어 copy 2-10(아래 2) | 코어 8단계 뒤 2026-11-12 07:30(G `prd.md` 9절 통합 데모 새 장면, 배경 대화는 G 시드) | CORE-01 운영 현황 카드의 칸 |

- AST-05, AST-09의 "직원에게 넘기기" → N1 생활 요청 연결은 2026-11-04 G 기획에 정의됐다(G F7·F8, FORWARDED). 새 화면은 없고 AST-09의 필터·줄·상세가 늘었다. N1 쪽은 REQ-12 "분류 전" 카드와 REQ-13 [비서 대화 보기]다.

### 3-5. C 생활 지원 단계(회원 화면 "생활 지원 단계")

| ID | 이름 | 이용자 | 하나의 행동 | 출처 | API | 컴포넌트 | 상태 | 카피 | 데모 | 들어갈 곳과 형태 |
|---|---|---|---|---|---|---|---|---|---|---|
| TRN-01 | 단계 정의 · ○○레지던스 | 직원 전체, 책임자 | (읽기) | C 8절 1행, `transitions US-01` | `CareStageQuery` | Table, Card | 상단 "시스템은 단계를 정하지 않습니다." | C copy 2-1 | C 1 | 페이지 |
| TRN-02 | 생활 지원 단계 · A동 201호 이은숙 입주자(입주자 단계 요약) | 간호·생활지원, 책임자 | 평가 기록하기 등 네 버튼 중 하나(모두 테두리 버튼) | C 8절 2행(스토리 없음) | `CareStageQuery` | Card, Button / `list-cell` | 열린 제안 있음 | C copy 2-7 | C 3 | 페이지(탭: 요약 / 외부 돌봄 일정 / 단계 변경 이력) |
| TRN-03 | 평가 기록 · A동 201호 이은숙 입주자 | 간호·생활지원 | 저장한다 | C 8절 3행, `transitions US-02`, `US-03` | C 내부, `StaffQuery.listStaff` | Form, RadioGroup, Textarea, Alert(병명 경고) | 병명 경고 | C copy 2-2 | C 2 | 페이지 |
| TRN-04 | 단계 변경 제안 · A동 201호 이은숙 입주자 / 입주자 설명과 의견 | 간호·생활지원 | 제안한다 / 설명을 기록한다 | C 8절 4행, `transitions US-04`, `US-05` | C 내부, `GuardianQuery.guardiansOf` | Form, Card(미리보기), Textarea | 설명 전 결정 거부(`EXPLANATION_MISSING`) | C copy 2-3, 5절 | C 3 | 페이지 |
| TRN-05 | 결정 대기 · 2건 / 생활 지원 추가로 바꿀까요? | 책임자, 본사 운영 매니저 | 제안대로 바꾸기 → 바꾸기 | C 8절 5행, `transitions US-06`, `US-07` | C 내부, `ContractCommand.requestAmendment`, `HealthFeedCommand.post` | Table, AlertDialog, Textarea(결정한 까닭) | 제안자 = 결정자 거부 | C copy 2-4, 5절 | C 3, 4 | 페이지 |
| TRN-06 | 외부 돌봄 일정 · A동 201호 이은숙 입주자 | 간호·생활지원 | 겹침을 처리한다(레지던스 서비스 시간 옮김) | C 8절 6행, `transitions US-12`, `US-13` | C 내부 | Form, Table, Alert(겹침 경고) | 겹침 | C copy 2-5 | C 6 | → TRN-02 "외부 돌봄 일정" 탭 |
| TRN-07 | 단계 변경 이력 · A동 201호 이은숙 입주자 | 간호·생활지원, 책임자 | 한 줄을 연다 | C 8절 7행, `transitions US-14` | C 내부 | Table / `record-row` | 고치거나 지울 수 없음 | C copy 2-6 | 없음 | → TRN-02 "단계 변경 이력" 탭 |
| TRN-08 | 확인할 일(계약 변경 요청 줄) | 경리 | 확인함 | C 8절 8행, `transitions US-11` | `TransitionsInboxQuery`(CORE-01에서 조립) | CORE-01 안의 한 줄 | | C copy 2-4 마지막 줄 | C 4 | CORE-01 확인할 일의 줄 |
| TRN-09 | 회원님이 받고 계신 도움(생활 지원 단계 첫 화면)과 하위 화면 | 회원, 프런트(읽어 드림) | 다시 봐 주세요(P1) / 프런트로 전화하기 | C 8절 9행, `transitions US-09` | `CareStageQuery.memberView` | Card, Accordion / `alt-path` | 기본 서비스로 돌아갔을 때. 단계가 바뀐 적 없는 회원에게는 "이번에 바뀌지 않아요" 제목을 숨긴다 | C copy 3-1~3-4, 3-6, 3-7 | C 5, 6 | 페이지(확인 상태 하나 더함) |
| TRN-10 | 건강 소식(보호자, D 목업) | 보호자 | (FAM-06d와 같은 화면) | C 8절 10행, `transitions US-10` | `family/api` | FAM-06d 참고 | 김태호 계정에는 없음 | C copy 4절 | C 4 | = FAM-06d(같은 화면) |
| TRN-11 | 다시 살펴봐 달라고 할까요? | 회원 | 다시 봐 주세요 | C 8절 11행, `transitions US-16` | C 내부 | AlertDialog | | C copy 3-5 | 없음(P1) | → TRN-09 "다시 살펴봐 달라고 할까요?" 확인 상태 |
| TRN-12 | 단계 정의 편집 | 본사 관리자, 책임자 | 새 버전 저장 | C 8절 12행, `transitions US-17` | C 내부 | Form, Table | | C copy 2-1 | 없음(P1) | 페이지 |

TRN-09의 하위 화면: 단계가 바뀌는 때(3-2), ○○레지던스의 생활 지원 단계(3-3), 직원이 드린 제안(3-4), 다른 기관 돌봄(3-6), 지난 단계 기록(3-7). 모두 같은 틀에 "처음으로"와 "프런트로 전화하기"를 둔다.

### 3-6. N1 생활 요청(회원 화면 "생활 요청", 보호자 화면 Evenstay 패밀리 "생활 요청", 직원 화면 "생활 요청")

N1 기획(`docs/requests/`)은 승인(2026-11-04)이다. 데모 열의 "N1 Ln"은 N1 `prd.md` 8절 표의 장면 번호(L0~L10)이고 "부록"은 같은 절 부록이다. REQ-14~16, REQ-21은 직원 창이지만 CORE-05의 확인 창처럼 행 하나로 센다. REQ-19는 TRN-08처럼 CORE-01 안의 한 칸, REQ-20은 CORE-14 안의 한 칸이다.

| ID | 이름 | 이용자 | 하나의 행동 | 출처 | API | 컴포넌트 | 상태 | 카피 | 데모 | 들어갈 곳과 형태 |
|---|---|---|---|---|---|---|---|---|---|---|
| REQ-01 | 생활 요청 | 회원 | 종류 타일을 고른다(같은 무게의 큰 버튼이라 모두 테두리, 결정 3). 아래 "내 요청" 구역에서 진행 중 요청을 연다 | N1 8절 1행, `requests US-01`, `US-16` | N1 내부 `GET /me/requests`, `GET /me/recurring` | Card, Button / `menu-tile`, `list-cell`, `alt-path` | 정기 청소 줄 없음(copy 6절), 연결 오류(copy 7절) | N1 copy 2-0, 2-1, 6절 | N1 L2 | 페이지(종류 타일 6개, 내 요청 구역) |
| REQ-02 | 어떤 일인가요? | 회원 | 종류 한 가지를 고른다(큰 버튼 6개, 모두 테두리) | N1 8절 2행, `requests US-01` | N1 내부(종류 목록, 병원 동행 켜짐 여부) | Button `secondary` 큰 버튼 / `menu-tile`, `alt-path` | 병원 동행 버튼은 F14 꺼짐이면 없음, "점검"은 보이지 않음 | N1 copy 2-2 | N1 L2, L7 | → REQ-01 첫 화면의 종류 타일 6개 |
| REQ-03 | 요청하기: 종류별 입력(첫 칸 "무엇이 고장 났나요?" 등, 한 화면 한 칸) | 회원 | 다음으로 | N1 8절 3행, `requests US-01`, `US-02`, `US-18` | N1 내부 `POST /me/requests`로 가기 전 입력 단계(저장은 REQ-05) | Input, Textarea, RadioGroup(선택지 버튼), Calendar+Select(날짜·시각) `[가설: DESIGN.md에 날짜 컴포넌트 없음]`, Button / `alt-path` | 지난 시각 거부, 차량 운행 시간 밖 `[NEED]`, 병원 동행 가실 곳 안내(진료 칸 없음), 외출 차량 "어디에 가세요?" 칸 아래 "병원에 가실 때는 '병원 동행'으로 요청해 주세요." 안내(copy 10-7), 사진 칸 없음(Next), 말로 하기 버튼 없음(P1) | N1 copy 2-3, 7절, 10-7 | N1 L2, L7, 부록 | 페이지 |
| REQ-04 | 비용 안내 | 회원 | 맡길게요 | N1 8절 4행, `requests US-17` | `ServiceFeeQuery.priceOf`(코어 반영됨, N1-C2) | Card, Button / `money` | 금액 없으면 이 화면 없이 비용 없음 처리, 대신 처리하실 분 줄 `[가설]` | N1 copy 2-4 | 없음(P1) | → REQ-05 "비용 있음" 상태 |
| REQ-05 | 이대로 전할까요? | 회원 | 네, 전해 주세요(채운 버튼). 다시 쓸게요는 같은 크기 테두리 | N1 8절 5행, `requests US-01` | N1 내부 `POST /me/requests`(Idempotency-Key) | Card, Button, Separator | 저장 실패(다시 보내기), 프런트 운영 시간 밖 줄 `[NEED]`, 올린 뒤 화면 | N1 copy 2-5, 7절 | N1 L2, L7 | 페이지(비용 있음 상태 더함) |
| REQ-06 | 내 요청 | 회원 | 요청 한 줄을 연다(확인할 요청이 있으면 확인하기로) | N1 8절 6행, `requests US-07` | N1 내부 `GET /me/requests?status=open\|closed` | Card, Tabs(진행 중·끝난 요청), `list-cell`, `empty-state` | 빈 상태 둘(처음, 진행 중 없음), 목록 위 "확인하실 요청이 1건 있어요."(DONE 3일째 안내 `[가설: 3일]`) | N1 copy 2-6, 6절 | 없음 | → REQ-01 "내 요청" 구역 |
| REQ-07 | 요청 상세와 상태(제목 없음, PRD 이름) | 회원 | 요청 취소하기(처리 시작 전에만, 테두리). 보호자가 올린 비용 요청에는 [맡길게요] · [그만둘게요]를 같은 크기로 `[가설]`. 그 밖에는 보는 화면 | N1 8절 7행, `requests US-10`, `US-13`, `US-09`, `US-20`, `US-21` | N1 내부 `GET /me/requests/{id}`, `/cancel`, `/accept`, `/decline` | Card, Badge(중립), AlertDialog(취소 확인) / `record-row`(지나온 일), `alt-path` | 상태 문장 9종 + 새 상태 둘(안심 알림으로 옮김, 보호자 비용 요청 답 기다림, copy 10-1), 기다림 이유 4, 하지 않음 이유 4개 모두 문장 있음(합치기는 [먼저 들어온 요청 보기], copy 10-2), 확인 없이 닫힘, 이미 취소, 7일 답 없어 취소 문장(copy 10-1), 다른 사람이 올린 표시 5(직원 전화·직원 직접·보호자·보호자+비용 질문·비서) + 답 없을 때 한 줄 `[가설]`, 직원이 대신 기록한 지나온 일 줄 4(copy 10-3) | N1 copy 2-7, 2-10, 4-9 회원 줄, 10-1, 10-2, 10-3 | N1 L4, L6, L7 | 페이지(확인 대기 상태 더함) |
| REQ-08 | 직원이 마쳤어요. 확인해 주세요. | 회원 | 다 됐어요(채운 버튼). 아직이에요는 같은 크기 테두리 | N1 8절 8행, `requests US-07`, `US-17` | N1 내부 `/confirm`, `/not-yet`, `ServiceChargeQuery.previewTargetPeriod`(코어 반영됨 2026-11-04, N1-C1) | Card, Button, Textarea(의견, 선택) / `money` | 의견 칸 선택, 동시 확인 409, 비용 있음 문장("12월 청구서". 달 조회가 없으면 "다음 청구서에 들어가요", copy 10-6), 병원 동행은 의견 칸 없음·[아직이에요] 뒤 문장 따로(ADR-R10, copy 10-7) | N1 copy 2-8, 10-6, 10-7 | N1 L3, L4 | → REQ-07 "확인 대기" 상태 |
| REQ-09 | 정기 청소 | 회원 | 이번 주 쉬기. 쉬기 뒤에는 [쉬지 않고 청소 받기](마감 전, 테두리) | N1 8절 9행, `requests US-16`, `US-15` | N1 내부 `GET /me/recurring`, `POST /me/recurring/{taskId}/skips`, `DELETE /me/recurring/skips/{id}`, `POST /me/recurring/occurrences/{id}/follow-up` | Card, AlertDialog(쉬기 확인·되돌리기 확인), Button | 정기 청소 없음(copy 6), 쉬기 마감 지남(copy 7)·되돌리기 마감 지남 안내(copy 10-4), 장기 부재 중 한 줄 "자리를 비우신 동안 청소는 쉬어요."(copy 10-4), 못 함 이유(방에 안 계심 · 다음에 해 달라고 하심 · 담당자 사정), 마친 날 [다시 봐 주세요], 직원이 대신 쉼으로 적은 줄(copy 10-3, 10-4) | N1 copy 2-9, 6절, 7절, 10-3, 10-4 | N1 L8 | 페이지 |
| REQ-10 | 보호자 생활 요청 목록·상세(제목 없음, PRD 이름. 화면 위 한 줄 "이은숙 회원님이 허락하신 생활 요청이에요.") | 보호자 | 요청 한 줄을 연다(보는 화면) | N1 8절 10행, `requests US-19` | N1 내부 `GET /family/residents/{id}/requests`, `authorize(requests.request.view_as_guardian)`(D 정책) | Card, `list-cell`, `consent-scope` / `record-row` | 허락 없음, 허락 바뀜, 병원 동행은 건강 소식 허락과 건강정보 별도 동의가 모두 있을 때만·병원 이름 없음(US-19 3), 빈 목록, 비용 요청 답 기다림 줄·7일 답 없어 취소 줄(copy 10-1), 하지 않음 이유 문장(copy 10-2), 안심 알림으로 옮긴 요청은 목록에서 뺌(copy 10-1) | N1 copy 3-1, 3-2, 6절, 7절, 10-1, 10-2 | 없음 | 페이지 |
| REQ-11 | 회원님 대신 올리기(버튼 "이은숙 회원님 대신 요청하기") | 보호자 | 요청을 전한다 | N1 8절 11행, `requests US-20` | N1 내부 `POST /family/residents/{id}/requests`, `create_as_guardian`(D 정책) | Form, RadioGroup(종류 넷), Textarea, Button | 병원 동행 버튼 없음+도움말, 비용 종류는 회원 답 기다림(올린 뒤 문장 따로), 저장 실패 | N1 copy 3-3, 7절 | N1 L6 | 페이지 |
| REQ-12 | 생활 요청(직원 첫 화면) | 프런트, 담당 팀 직원, 책임자(본사는 보기) | 요청 카드를 연다. 위 버튼 [대신 등록] `[가설: 채운 버튼은 이 하나, 카드 안 맡기·배정은 테두리]` | N1 8절 12행, `requests US-04`, `US-05`, `US-09`, `US-11`, `US-15`, `US-16`, `US-18`, `US-20`, `US-21` | N1 내부 `GET /staff/sites/{id}/requests?view=mine\|unassigned\|overdue\|recurring_today\|all&team&type`, `POST /staff/occurrences/{id}/{start\|complete\|miss\|skip\|follow-up}`, `StaffQuery.listStaff`, `ResidentQuery`, `SiteQuery.listUnits` | Tabs(나누기 5. 여섯째 "입주자 답 기다림"은 copy 10-1 `[가설: prd·tech-design는 5개]`), Card(요청 카드), Badge(딱지 5, 중립), Select(필터), Button / `record-row` | 빈 상태 3(내 일, 배정 전, 기한 지남. 정기용은 copy 6절에 없음 `[NEED]`), 권한 없음(다른 사업장), 의견·불편·가실 곳 범위 제한, 분류 전 카드(홈 비서, 넘긴 이유 직접 요청·도구 밖 질문, copy 4-10·10-8), 입주자 답 기다림 목록·카드(다음 날 09:00부터, copy 10-1), 정기 회차 카드 버튼(시작·완료·못 함·쉼 대신 기록), 안심 알림 연결 전이면 아래 고정 문구가 바뀜(copy 10-5), 아래 고정 문구 | N1 copy 4-1, 4-2, 4-10, 6절, 7절, 10-1, 10-4, 10-5, 10-8 | N1 L1, L3, L5, L7, L10 | 페이지(서랍 둘, 대화창 셋) |
| REQ-13 | 요청 상세(직원) | 담당 직원, 프런트, 책임자 | 상태에 맞는 다음 버튼 하나(접수 → 시작, 처리 중 → 완료). 나머지는 테두리 | N1 8절 13행, `requests US-06`, `US-07`, `US-12`, `US-13`, `US-17`, `US-18`, `US-21` | N1 내부 전이 `POST /staff/requests/{id}/…`(`move-to-safety`, `merge` 포함), `GET …/escort-destination`(SENSITIVE_READ), `safety/api` `SafetyFrontCallCommand.registerFromRequest`(B 확정 2026-11-04, N1-B1), `…/charge/retry`. [비서 대화 보기]는 G `GET /assistant/admin/handoffs/{id}`로 이동(`assistant.handoff.view`, N1-G2) | Sheet(상세), Card, Button, AlertDialog(옮기기 확인), DropdownMenu(더보기), Textarea(한 일 적기) / `record-row`(지나온 일) | 먼저 맡음 409, 이미 취소, 안심 알림으로 옮기지 못함 안내·안심 알림 연결 전 안내(copy 10-5), 청구 넘김 줄 상태 셋(대기, 넘김, 실패, copy 10-6), 청구 넘김 실패(P1, 5회 재시도 `[가설]`), 닫힌 요청은 동작 없음, 병원 동행은 한 일 선택지 둘(copy 10-7), 시스템이 취소한 요청 줄(copy 10-1), 홈 비서에서 온 요청 카드 위 한 줄 둘(copy 4-10, 10-8) | N1 copy 4-5, 4-6, 4-8, 4-9, 4-10, 7절, 10-1, 10-5, 10-6, 10-7, 10-8 | N1 L3, L4, L7, L9, 부록 | → REQ-12 상세 서랍 |
| REQ-14 | 대신 등록 | 프런트 | 등록 | N1 8절 14행, `requests US-03`, `US-17` | N1 내부 `POST /staff/sites/{id}/requests`, `ResidentQuery.listResidents` | Form(Sheet), Select, Input, RadioGroup(들은 방법), Textarea, Checkbox(금액 말씀드림, 동의 아님·확인용) | 호실·입주자·종류 비면 막힘, 병원 동행 칸 바뀜, 비용 확인(P1), 사업장 밖 입주자 없음 | N1 copy 4-3 | N1 L1 | → REQ-12 대신 등록 서랍 |
| REQ-15 | 담당자를 고르세요. | 프런트, 책임자 | 배정 | N1 8절 15행, `requests US-05` | N1 내부 `…/assign`, `…/classify`, `StaffQuery.listStaff` | Dialog, RadioGroup, Select(담당 바꾼 이유, 선택) | 먼저 맡은 사람 409, 분류 전 → 종류 정하기, 오늘 근무·휴무 표시는 Next | N1 copy 4-4, 7절 | N1 L3 | → REQ-12 배정 대화창 |
| REQ-16 | 입주자 확인 대신 기록 | 프런트, 담당 팀, 책임자 | 기록한다 | N1 8절 16행, `requests US-08`, `US-20`(인수 4) | N1 내부 `POST /staff/requests/{id}/proxy-confirm {result: CONFIRMED\|NOT_YET\|ACCEPT\|DECLINE, heardAt}` | Dialog, RadioGroup | 완료(DONE) 요청에는 [입주자 확인 대신 기록](다 됐다고 하셨습니다 · 아직이라고 하셨습니다), 입주자 답 기다림 요청에는 [입주자 답 대신 기록](맡기겠다고 하셨습니다 · 그만두겠다고 하셨습니다, copy 10-1) | N1 copy 4-7, 10-1, 10-3 | N1 L9 | → REQ-12 확인 대신 기록 대화창 |
| REQ-17 | 정기 작업 | 책임자, 본사 운영 매니저 | 정기 작업 만들기 | N1 8절 17행, `requests US-14` | N1 내부 `GET·POST /staff/sites/{id}/recurring-tasks`, `PATCH`, `…/end`, `SiteQuery.listUnits`, `StaffQuery.listStaff` | Table, Form, Select, Input, AlertDialog(끝내기) | 빈 상태(copy 6), 바꾸기 안내, 끝내기 확인 | N1 copy 5-1, 6절 | 없음(시드) | 페이지 |
| REQ-18 | 요청 종류 설정 | 책임자, 본사 관리자 | 저장한다 | N1 8절 18행, `requests US-24` | N1 내부 `GET·PUT /staff/sites/{id}/request-settings`, `…/teams`, `ServiceFeeQuery`(코어 반영됨, N1-C2) | Table, Select, Input, Button | 요금표에 없으면 비용 없음, 새 버전 | N1 copy 5-2 | 없음(시드) | 페이지 |
| REQ-19 | 생활 요청(운영 현황 카드의 한 칸, CORE-01 안) | 책임자, 본사 | 칸을 눌러 기한 지남 목록(REQ-12)으로 간다 | N1 8절 19행, `requests US-22` | `app/`이 `ServiceRequestQuery.openCount`를 부름(CHECK, 숫자만) | Card / `list-cell` | N1 미배포·권한 없으면 칸이 나오지 않음, 한 칸 조회 실패(나머지 정상), 기준 시각 | N1 copy 5-3, 코어 copy 2-10 | N1 L10 | CORE-01 운영 현황 카드의 칸 |
| REQ-20 | 생활 요청(소유주 월 리포트 CORE-14 안의 한 칸) | 소유주, 본사 운영 매니저·관리자 | (보는 칸) 숫자만 본다 | N1 8절에 행 없음(`requests US-25`, F22), 코어 8절 CORE-14. ID 제안 | `app/`이 코어 `OwnerReportQuery.monthOf`와 함께 `requests/api` `ServiceRequestQuery.monthlySummary(siteId, period, actor) → {created, closed, confirmed, autoClosed, openAtEnd, byType, recurring}`(`requests.summary.owner_read` CHECK, 숫자만). period는 YYYY-MM | Card / `list-cell`, `number` | 빈 상태, N1 미배포·권한 없으면 칸이 나오지 않음 `[가설: REQ-19와 같은 규칙]`, 이름·호실·글 없음, 병원 동행은 종류별 숫자에 없고 합계에만, 소유주는 자기 사업장만(코어 1단계) | N1 copy 10-9, 코어 copy 2-12 | 코어 9절 12단계 뒤 2026-12-01 10:00 | CORE-14 안의 칸 |
| REQ-21 | 정기 청소 쉼 대신 기록 | 프런트 | 쉼으로 기록 | N1 8절에 행 없음(`requests US-16` 인수 3, copy 10-4). ID 제안 | N1 내부 `POST /staff/occurrences/{id}/skip`, `ResidentQuery.listResidents` | Dialog, Select(호실·입주자·날짜), RadioGroup(들은 방법: 전화, 직접), Button | 입력 칸 비면 막힘 `[NEED: 카피에 막는 문구 없음]`, 기록 뒤 한 줄(들은 직원 표시) | N1 copy 10-4 | 없음(L8은 회원 앱에서 쉬기) | → REQ-12 정기 청소 쉼 대신 기록 대화창 |

### 3-7. N2 프로그램·시설·공지(회원 화면 Evenstay 홈 "프로그램"·"시설 예약"·"공지", 보호자 화면 Evenstay 패밀리 "일정"과 "레지던스 공지", 직원 화면 "프로그램·시설·공지")

N2 기획(`docs/community/`)은 승인(2026-11-04)이고 카피 보완분은 사용자 재승인 2026-11-04다. 데모 열의 "N2 Mn"은 N2 `prd.md` 9절 장면 번호(M0~M11), "부록 A~C"는 같은 절 부록이다. CMN-01은 COM-07 안, CMN-12는 FAM-06e 안, CMN-13은 FAM-06a 안의 영역이고 CMN-23은 CORE-01 안의 한 칸이라 따로 만들지 않는다. CMN-08(회원)과 CMN-19(직원)는 같은 일을 다른 앱에서 본다.

| ID | 이름 | 이용자 | 하나의 행동 | 출처 | API | 컴포넌트 | 상태 | 카피 | 데모 | 들어갈 곳과 형태 |
|---|---|---|---|---|---|---|---|---|---|---|
| CMN-01 | Evenstay 홈 첫 화면에 더하는 것(제목 없음, PRD 이름. 묶음 타일 "프로그램과 예약"과 오늘 신청·예약 부제, 꼭 보실 공지 띠. 프로그램·시설 예약·공지 버튼은 묶음 화면 COM-09에 있다) | 회원 | 묶음 타일을 연다. 띠의 [보기]는 띠 안 링크 | N2 8절 1행, `community US-04`, `US-14` | N2 내부 `GET /me/notices?state=current`(띠), `GET /me/enrollments?when=upcoming`, `GET /me/reservations`(타일 부제). 첫 화면용으로 한 번에 읽는 경로는 tech-design 8-1에 없음 `[가설]` | `menu-tile`, `alert`(띠), `alt-path` | 띠는 꼭 보실 공지를 [읽었어요]로 확인할 때까지 남음(일반 공지는 안 올림). 타일 부제는 오늘 신청·예약이 있을 때만 바뀜. 끈 기능의 버튼은 없음(ADR-M10) | N2 copy 2-0, 2-1 | N2 M2, M4 | COM-07의 띠와 타일 부제 |
| CMN-02 | 이번 주 프로그램 | 회원 | 가고 싶은 프로그램 한 줄을 연다(보는 화면). [내 신청 보기]는 테두리 | N2 8절 2행, `community US-04` | N2 내부 `GET /me/programs?week=this\|next` | Card, Tabs 또는 `segmented`(요일별), `list-cell`, `empty-state`, `alt-path` | 빈 상태(copy 6절). 둘째 줄 여섯 가지(자리 남음, 다 참, 신청 없음, 신청함, 기다림, 쉬는 회차). 지난 회차는 흐리게, 누를 수 없음 | N2 copy 2-0, 2-2, 6절 | N2 M4 | 페이지 |
| CMN-03 | 프로그램 상세(제목은 프로그램 이름, 예: 수채화. PRD 이름) | 회원 | 자리가 있으면 [신청하기], 다 찼으면 [기다리기]. 상태에 맞는 하나만 채운 버튼. [신청 취소]는 테두리. 신청 없는 회차는 버튼 없음 | N2 8절 3행, `community US-04`, `US-05`, `US-06` | N2 내부 `GET /me/sessions/{id}`(남은 자리, 내 상태·순서, 마감) | Card, Button, Badge(중립) / `list-cell`, `alt-path` | 회차 상태 여섯(신청 받는 중, 정원 참, 신청 마감, 신청 없음, 회차 취소, 마침, names 2-2), 신청함·기다림 순서·올라감, 직원이 넣음 표시(copy 2-12), 대기 수·다른 입주자 안 보임, 소리로 듣기 `[가설: Next]` | N2 copy 2-3, 2-5, 2-12 | N2 M4, M6 | 페이지(확인 상태 셋 더함) |
| CMN-04 | 이 프로그램을 신청할까요? | 회원 | 네, 신청할게요(채운 버튼). 그만둘게요는 같은 크기 테두리 | N2 8절 4행, `community US-04` | N2 내부 `POST /me/sessions/{id}/enrollments`(`intent: ENROLL`, `confirmSameTime?`, Idempotency-Key) | Card, Button, AlertDialog `[가설: 확인을 창으로 할지 화면으로 할지 copy에 없음]` / `list-cell` | 같은 시간 묻기(P1, 막지 않음), 동시 신청에 지면 409 FULL로 행 없이 CMN-05 문구, 마감 뒤, 이미 신청함, 저장 실패 | N2 copy 2-4, 7절 | 부록 B | → CMN-03 신청 확인 상태 |
| CMN-05 | 자리가 다 찼어요. 기다리시겠어요? | 회원 | 네, 기다릴게요(채운 버튼). 그만둘게요는 같은 크기 테두리. 기다리는 중 화면의 [그만 기다릴게요]는 테두리 | N2 8절 5행, `community US-05` | N2 내부 `POST /me/sessions/{id}/enrollments`(`intent: WAITLIST`), `POST /me/enrollments/{id}/leave` | Card, Button, AlertDialog(그만두기 확인) / `list-cell` | 동시 신청에 진 뒤 "방금 다른 분이…" 문구(copy 7절), 그만두기 확인(다시 기다리면 맨 뒤), 마감 뒤까지 자리 안 남(다음 주 보기), 순서는 본인 것만, 올라감 문구와 문자(승급) | N2 copy 2-5, 7절 | N2 M4, 부록 B | → CMN-03 대기 확인 상태 |
| CMN-06 | 신청 취소(제목 없음, PRD 이름. 확인 문장 "수채화 신청을 취소할까요?") | 회원 | 신청을 취소한다. [취소할게요]·[그대로 둘게요]는 같은 무게라 모두 테두리 `[가설: 결정 3, REQ-07 취소와 같은 이유]` | N2 8절 6행, `community US-06`, `US-07` | N2 내부 `POST /me/enrollments/{id}/cancel` | AlertDialog, Button | 기다리는 분이 있으면 둘째 줄, 마감 뒤 앱 취소 막힘(직원 대신 취소 안내, `[가설]`), 취소 뒤 문구 | N2 copy 2-6 | 없음 | → CMN-03 취소 확인 상태 |
| CMN-07 | 내 신청 | 회원 | 신청 한 줄을 연다(보는 화면) | N2 8절 7행, `community US-05` | N2 내부 `GET /me/enrollments?when=upcoming`, `GET /me/programs/past` | Tabs(다가오는·지난), `list-cell`, `empty-state` | 빈 상태 셋(처음, 다가오는 것 없음, 지난 없음). 지난 프로그램은 함께하신 회차만(신청 없이 온 회차 포함), 횟수·합계 없음 | N2 copy 2-7, 6절 | N2 M6 | 페이지(내 예약 구역 더함) |
| CMN-08 | 시설 예약 | 회원 | 예약할게요(마지막 확인 단계의 채운 버튼). 다시 고를게요는 같은 크기 테두리. 방·날짜·시간·인원 고르기는 앞 단계 | N2 8절 8행, `community US-10` | N2 내부 `GET /me/places`, `GET /me/places/{id}/free-slots?date=`, `POST /me/reservations` | Card, RadioGroup(방), Calendar+Select(날짜) `[가설: DESIGN.md에 날짜 컴포넌트 없음, REQ-03과 같음]`, `chip`(비어 있는 시간), Select(인원), Dialog(이용 규칙 [알겠어요]) / `list-cell`, `alt-path` | 이용 규칙은 처음 한 번, 그날 빈 시간 없음(copy 6절), 겹침 409와 가까운 빈 시간 2칸, 하루 최대·인원·이용 시간·예약 기간 오류(copy 7절), 예약 받는 방이 없으면 화면 없음 | N2 copy 2-8, 6절, 7절 | 부록 C | 페이지 |
| CMN-09 | 내 예약 | 회원 | 예약 한 줄을 연다. [예약 취소]·시간 바꾸기는 같은 크기 테두리 | N2 8절 9행, `community US-10`, `US-11` | N2 내부 `GET /me/reservations`, `PATCH /me/reservations/{id}`(P1), `POST /me/reservations/{id}/cancel` | Card, AlertDialog(취소 확인), `list-cell`, `empty-state` | 빈 상태, 직원이 대신 예약한 표시(copy 2-12), 사업장이 취소한 예약(이유와 [다시 예약]), 이미 시작한 시간, 새 시간이 잡힐 때까지 기존 예약 유지(P1) | N2 copy 2-9, 2-12, 6절 | N2 M5 | → CMN-07 "내 예약" 구역 |
| CMN-10 | 공지 | 회원 | 공지 한 줄을 연다(보는 화면) | N2 8절 10행, `community US-13` | N2 내부 `GET /me/notices?state=current\|past` | Tabs(지금·지난), `list-cell`, Badge(중립) | 꼭 보실 공지가 맨 위, 읽으셨어요 줄, 빈 상태(copy 6절), 일반 공지는 [읽었어요] 없음 | N2 copy 2-10, 6절 | 없음(M2는 띠에서 CMN-11로 바로 간다) | 페이지 |
| CMN-11 | 공지 상세와 [읽었어요](제목은 공지 제목. PRD 이름) | 회원 | 읽었어요(꼭 보실 공지에만 채운 버튼. 일반 공지는 버튼 없음) | N2 8절 11행, `community US-14` | N2 내부 `GET /me/notices/{id}`, `POST /me/notices/{id}/ack`(Idempotency-Key) | Card, Button / `alt-path`, `record-row`(직접 전함 줄) | 누른 뒤 "읽으셨어요. 시각"과 띠 사라짐, 직원이 직접 전했을 때 문장(copy 2-11), 저장 실패 [다시 누르기], 열람 기록 없음, 소리로 듣기 `[가설]` | N2 copy 2-11, 7절 | N2 M2, M9(박영순 화면은 설명만) | 페이지 |
| CMN-12 | 보호자 일정의 프로그램 줄(제목 없음, PRD 이름. FAM-06e 안, 위 한 줄 "이은숙 회원님이 허락하신 일정이에요.") | 보호자 | (보는 화면) | N2 8절 12행, `community US-16` | D가 `community/api` `ProgramQuery.enrolledSessionsOf(residentId, from, to, actor)`를 부름. `community.enrollment.view_as_guardian`은 D 정책(SCHEDULE) | Card, `list-cell` / `consent-scope` | 허락 없음·바뀜(COM-04, copy 7절 "일정을 보여 주지 않기로 하셨어요"), 빈 상태(copy 6절), 쉬는 회차 줄, 대기·시설 예약·출석 안 보임. 프로그램이 켜지기 전에 허락한 회원의 안내는 D copy 2-11(ID 없음, 4절 11번) | N2 copy 3-1, 6절, 7절 | N2 M8(허락은 M7, D-N2-1) | FAM-06e 안의 줄 |
| CMN-13 | 레지던스 공지(FAM-06a 첫 화면의 칸과 상세. 제목 없음, 칸 제목) | 보호자 | 공지 한 줄을 연다(보는 화면) | N2 8절 13행, `community US-17` | D가 `community/api` `NoticeQuery.guardianNoticesFor(residentId, at, actor)`를 부름. `community.notice.view_as_guardian`은 D 정책(보호자 관계만) | Card, `list-cell` | 빈 상태(copy 6절 "보호자께 알리는 공지가 없어요."), [읽었어요] 없음, 허락 항목이 아니라 "볼 수 있는 것"에 이름이 안 나옴, 보이기를 끈 공지(A동 단수)는 안 보임 | N2 copy 3-2, 6절 | N2 M8 | FAM-06a 안의 칸과 상세 |
| CMN-14 | 프로그램·시설·공지(직원 첫 화면, 오늘) | 프런트, 생활지원 직원, 책임자, 본사(보기) | 오늘 회차나 시설 예약 한 줄을 연다. 위 버튼 [대신 신청]·[대신 예약]·[공지 쓰기]는 같은 무게라 모두 테두리 `[가설: 결정 3. 세 창은 CMN-17·19·20]` | N2 8절 14행, `community US-09` | N2 내부 `GET /staff/sites/{id}/community/today` | Tabs(오늘·프로그램·시설 예약·공지), Card, Button, `list-cell`, `number` | 빈 상태("오늘 회차와 시설 예약이 없습니다."), 출석 체크 전 줄, 화면 아래 고정 문구, 끈 기능의 나누기는 없음 | N2 copy 4-1, 6절 | N2 M1, M3 | 페이지(탭: 오늘 / 프로그램 / 시설 예약 / 공지) |
| CMN-15 | 프로그램 등록 | 생활지원 직원, 책임자 | 프로그램을 등록한다(채운 버튼 라벨은 copy에 없음 `[가설]`) | N2 8절 15행, `community US-01`, `US-02` | N2 내부 `GET·POST /staff/sites/{id}/programs`, `PATCH /staff/programs/{id}`(P1), `POST /staff/programs/{id}/end`(P1), `StaffQuery.listStaff`, `GET /staff/sites/{id}/places` | Form(Sheet), Input, Select, Calendar+Select `[가설]`, AlertDialog(끝내기) / `field-error` | 장소 겹침 409와 겹친 날 목록(copy 7절), 정원 비우면 신청 없음, 효과를 적지 않는 한 줄 풀이 안내, 등록 뒤 4주 앞 회차, 바꾸기·끝내기 안내(P1), 빈 상태 [프로그램 등록] | N2 copy 4-2, 6절, 7절 | 없음(시드) | → CMN-14 "프로그램" 탭의 등록 서랍 |
| CMN-16 | 회차 목록과 정원(제목 없음, PRD 이름) | 생활지원 직원(진행), 책임자 | 회차 한 줄을 연다(CMN-17로). [이 회차 정원 바꾸기]·이 회차 쉬기는 테두리 | N2 8절 16행, `community US-01`, `US-03` | N2 내부 `GET /staff/programs/{id}/sessions`, `PATCH /staff/sessions/{id}/capacity`(P1), `POST /staff/sessions/{id}/cancel`(P1) | Table, Badge(중립), Dialog, AlertDialog(쉬기 확인), Select(이유 넷) / `record-row` | 회차를 만들지 못한 줄과 눌렀을 때 설명(방 겹침), 신청 수보다 줄이기 거부, 정원을 늘리면 대기 승급 문장, 쉬기 이유 넷 | N2 copy 4-3, 6절 | 없음 | → CMN-14 "프로그램" 탭의 회차 목록 |
| CMN-17 | 신청 명단(제목은 회차마다 "11/19(목) 14:00 수채화 신청 명단". PRD 이름 "신청 명단·대기·대신 신청·대신 취소") | 프런트, 생활지원 직원, 책임자, 본사(보기) | 대신 신청 창의 저장 `[가설: 라벨이 copy에 없음]`이 채운 버튼 하나. 줄 안 [대신 취소]·[신청으로 올리기]·[대신 기다리기 그만두기]는 `ghost`, 둘 이상이면 가장 잦은 하나만 보이고 나머지는 더 보기(결정 14) | N2 8절 17행, `community US-05`, `US-06`, `US-07`, `US-08`, `US-20` | N2 내부 `GET /staff/sessions/{id}/roster`, `POST /staff/sessions/{id}/enrollments`, `POST /staff/enrollments/{id}/cancel`·`leave`·`promote`, `ResidentQuery.listResidents`, `AbsenceQuery.absenceOf`(P1) | Table, Dialog(대신 신청), AlertDialog(올리기·그만두기 확인), RadioGroup(들은 방법), Select(호실·입주자), Badge(중립) / `record-row` | 정원 참이면 대기 N번으로 넣음, 마감 뒤 자리 안내, [신청으로 올리기]는 마감 뒤 대기 맨 앞 줄에만(아니면 409), 장기 부재 표시와 건너뛴 대기 줄(P1), 들어온 곳 셋, 빈 상태, 이미 신청함, 권한 없는 사업장 | N2 copy 4-4, 2-12, 6절, 7절 | N2 M6, 부록 A | 페이지(탭: 신청 명단 / 출석 체크) |
| CMN-18 | 출석 체크 · 11/18(수) 10:00 가벼운 체조(제목은 회차마다) | 진행 직원(생활지원), 책임자 | 출석 저장(채운 버튼). [참여]·[신청 없이 온 분 더하기]는 테두리 | N2 8절 18행, `community US-09`, `US-20` | N2 내부 `GET /staff/sessions/{id}/roster`, `PUT /staff/sessions/{id}/attendance`(전체 교체) | Table, `chip-selected`([참여] 켜기) `[가설]`, Dialog(신청 없이 온 분), Button / `record-row` | 온 분만 저장, 장기 부재 표시(P1), 저장 뒤 숫자, 고치기는 그날 안만 `[가설]`, 체크 전 알림 P1, 빈 상태, 입주자별 횟수·비율 칸 없음 | N2 copy 4-5, 6절 | N2 M3, M11 | → CMN-17 "출석 체크" 탭 |
| CMN-19 | 시설 예약(직원 일정표. 회원 CMN-08과 제목이 같다) | 프런트, 생활지원 직원, 책임자 | 대신 예약(채운 버튼 하나, P0). 시간 막기는 테두리 | N2 8절 19행, `community US-10`, `US-11` | N2 내부 `GET /staff/sites/{id}/place-schedule?date=`, `POST /staff/sites/{id}/reservations`, `POST /staff/sites/{id}/blocks`(P1) | 일정표 격자 `[가설: DESIGN.md에 일정표 컴포넌트 없음]`, Dialog(대신 예약), Checkbox(이용 규칙을 말로 전함. 동의 아님·확인용), AlertDialog(막고 알리기), Select / `record-row` | 겹침 409와 빈 시간, 프로그램 칸·예약 칸·막은 칸 구분, 규칙 전달 확인 없이 누르면 거부(STAFF_TOLD), 막을 시간에 예약이 있으면 확인(P1) | N2 copy 4-6, 7절 | N2 M5 | → CMN-14 "시설 예약" 탭 |
| CMN-20 | 공지 쓰기 | 프런트, 생활지원 직원, 책임자 | 게시(확인 창의 [게시]가 채운 버튼. [입주자 화면으로 미리 보기]는 테두리) | N2 8절 20행, `community US-13` | N2 내부 `GET·POST /staff/sites/{id}/notices`, `PATCH /staff/notices/{id}`(P1), `POST /staff/notices/{id}/{publish\|schedule\|unschedule\|archive}`, `SiteQuery.listUnits`(대상) | Form(Sheet), Input, Textarea, Select(대상), Checkbox(중요 공지·보호자에게도 보이기·문자로도 보내기. 기본 꺼짐, 동의 아님), Calendar+Select, AlertDialog(게시 확인) / `field-error` | 대상이 비면 게시 안 됨, 입주자 없는 층 문구, 게시 확인 숫자, 문자 실패(공지는 게시됨), 예약 게시·고치기·층 대상·공지 날(P1), 내리기 확인 | N2 copy 4-7, 7절 | N2 M1 | 페이지(공지 탭 위 서랍으로 그린다) |
| CMN-21 | 확인 현황(제목은 공지마다 "확인 현황 · …". PRD 이름 "공지 확인 현황과 직접 전함") | 프런트, 생활지원 직원, 책임자, 본사(보기만) | [직접 전함]을 기록한다. 확인 전 줄의 [직접 전함]은 줄 전체를 누르는 체크 목록(결정 14), 창의 저장이 채운 버튼 하나 `[가설: 라벨이 copy에 없음]` | N2 8절 21행, `community US-14`, `US-20` | N2 내부 `GET /staff/notices/{id}/acks`, `POST /staff/notices/{id}/residents/{rid}/delivered`, `POST …/notes`, `AbsenceQuery.absenceOf`(P1) | Table, Badge(중립: 확인함·직접 전함·확인 전), Dialog, RadioGroup(방법 셋), Textarea(메모, 직원만) / `record-row`, `number` | 모두 확인함 문구, 장기 부재 표시(P1), 확인함 뒤 직접 전함은 409, 늦은 입주자를 모아 보이거나 세지 않음, 본사는 보기만(`deliver_in_person` 없음) | N2 copy 4-8, 6절 | N2 M9 | → CMN-14 "공지" 탭의 확인 현황 패널 |
| CMN-22 | 공용 시설 | 책임자, 본사 운영 매니저 | 저장한다(P1) | N2 8절 22행, `community US-12` | N2 내부 `GET·POST /staff/sites/{id}/places`, `PATCH /staff/places/{id}`. "이 사업장에서 쓰는 기능" 설정(ADR-M10 `SiteFeature`)의 경로는 8-1에 없음 `[가설]` | Table, Form, Input, Select, Textarea, `switch`(회원 예약 받기, 설정값) | 빈 상태 [시설 더하기], 바꾸면 다음 예약부터, 규칙을 바꾸면 회원이 [알겠어요]를 다시 봄, 예약 받기를 끄면 프로그램 장소로만 쓰임, 끈 기능은 다른 화면에 안 나옴 | N2 copy 5-1, 6절 | 없음(시드) | 페이지 |
| CMN-23 | 프로그램·시설·공지(운영 현황 카드의 한 칸, CORE-01 안. 칸 제목) | 책임자, 본사 | 칸을 눌러 확인 현황(CMN-21)으로 간다(P1) | N2 8절 23행, `community US-19` | `app/`이 `CommunityBoardQuery.todayOf(siteId, at, actor)`를 부름(CHECK, 숫자만, 이름·호실 없음) | Card / `list-cell`, `number`(카드 숫자) | N2 미배포·권한 없으면 칸이 나오지 않음, 한 칸 조회 실패(나머지 정상), 기준 시각, 참여율·순위 없음 | N2 copy 5-2, 코어 copy 2-10 카드 9 | N2 M10 | CORE-01 운영 현황 카드의 칸 |

---

## 4. 화면별 명세

모든 화면 공통: 위 1절의 밀도, 화면당 채운 버튼 하나, 판단 단어 없음, 상태 네 가지. 아래는 화면마다 다른 점만 적는다. "판단 단어"는 그 화면에서 특히 조심할 곳이다.

### 4-1. 공통
- **COM-01~03 데모 진행자 막대 `[가설]`.** 화면 위쪽 한 줄, 문구는 `[가설]` 초안(7절 결정 2). 영역: 계정 고르기(Select) · 기준 시각(Input, 초 단위) · 시드 초기화(DropdownMenu + AlertDialog). 운영 밀도(44px). 대안 경로 해당 없음. 존칭 해당 없음(진행자용, 명사형 라벨).
- **COM-07 Home 첫 화면 `[가설]`.** 영역: 인사(`title3`) → 꼭 보실 공지 띠 한 줄(CMN-01) → 볼 곳 6개 `menu-tile`(640px 아래 `list-cell` 72px 이상, 글자와 아이콘 함께, 1-1절, 결정 14) → 아래 "프런트로 전화하기"(`alt-path`). 글자 20px, 터치 56px. 해요체, "회원님". 목록은 1-1절 순서 `[가설]`. 전화번호 옆에 "가상 번호" 표시.
- **COM-08 운영 앱 틀.** `app-bar` 64px(로고, 사업장 선택, 사용자 메뉴) + 사이드바. 소유주는 사이드바 없이 CORE-09만.

### 4-2. 코어
- **CORE-01 오늘의 운영.** 영역: 확인할 일(규칙 8: `app/`이 `TodoQuery`와 각 모듈 `api/`를 붙여 조립) → 사업장별 요약. 확인할 일 예 "계약 변경 요청: A동 201호 이은숙 입주자 · 생활 지원 추가 (12/10 결정) · 요청: 최영미"(C copy 2-4, 5절 16단계). 판단 단어: 요약 숫자에 해석을 붙이지 않는다. 합쇼체, "입주자". 서비스 보완(P1, 사용자 재승인 2026-11-04): 책임자·본사에게는 맨 위에 운영 현황 카드(코어 copy 2-10)가 있다. 카드 8장(호실 현황 → 안심 알림 → 확인까지 걸린 시간 → 신호가 끊긴 기기 → 오늘 당번 → 확인할 일 → 장기 부재 중인 분 → 생활 요청)과 아래 2장(보호자 동의 현황, AI 생활 비서 사용량). 숫자와 기준 시각만 보이고 목표선, 좋음·나쁨 색, 순위가 없다. 확인할 일에 "예정 복귀일 지남" 줄(눌러 CORE-13)이 더해진다. **배치(2026-11-04, 결정 14): 3층.** ① 12단 전폭 확인할 일 목록(최대 5줄 + "모두 보기", 이 화면의 입구). 카드 "확인할 일"은 목록과 겹치므로 뺀다. ② `stat-strip` 4칸: 맡지 않은 신호(SAF-01) / 신호가 끊긴 기기(SAF-08) / 장기 부재 중인 분(CORE-13, 예정 복귀일 지남 포함) / 생활 요청 기한 지남(REQ-12). ③ 그 아래 지표 6칸(2줄 × 3칸): 호실 현황, 확인까지 걸린 시간, 오늘 당번, 보호자 동의 현황(FAM-19), AI 생활 비서 사용량(AST-13), 프로그램·시설·공지(CMN-23). 첫 화면 숫자는 10개 이하, 기준 시각은 화면 오른쪽 위 하나(칸 기준 시각이 다를 때만 칸에 표시, 코어 copy 확인 필요). 본사의 사업장별 요약은 카드가 아니라 표(사업장 한 줄에 숫자 4개와 [열기]).
- **CORE-02 사업장·호실 목록.** 영역: 사업장 표 → 동 → 호실. 다른 소유주 사업장 주소는 COM-04 문구.
- **CORE-03 요금 규칙.** 영역: 생활비, 식비, 결식 감면, 청구 일정(발행일, 납부 기한). 오류 문구 코어 copy 2-5.
- **CORE-04 입주 계약 목록·상세.** 상세 영역: 상태 `badge`(작성 중 / 입주 예정 / 거주 중 / 승계됨 / 퇴거 예정 / 정산 완료) → 당사자 → 요금 → 비상 연락처 → 변경 이력(`record-row`). 상태 색은 중립.
- **CORE-05 계약 작성 / 승계 확인 창.** 확인 창 "계약을 1인으로 바꿀까요?" [승계하기 · 취소]. 비상 연락처 영역(코어 copy 2-8, 등록 동의 문구는 `[법률 검토 전 초안]`). 사별 사실은 데모 1단계 앞에 회원 화면에 꺼내지 않는다(D `prd.md` 9절).
- **CORE-06 식사 기록 올리기.** 영역: CSV 올리기 → 미리보기(오류 행) → [오류 행만 빼고 반영 · 전체 취소] → 결식 0건 입주자 → 마감 확인 창.
- **CORE-07 청구.** 영역: [이번 달 청구서 만들기] → 청구서 표 → 근거 패널(Sheet: 청구 항목 → 식사 기록 → 감면 규칙) → 발행 확인 창. 근거 밑줄은 근거 패널의 결식 감면 줄 한 곳. 청구서 표(2026-11-05, 사용자 승인): 호실은 입주자 칸 아래에 둔다. 낸 금액, 수납 방법, 대신 낸 표시는 수납 상태 칸 안에 두고, 근거 패널에 낸 금액과 수납 방법을 한 번 더 적는다. 달이 바뀌어도 수납을 볼 수 있게 이번 달 표 아래에 지난달 표를 둔다.
- **CORE-16 청구서 결제.** 확인(몇 월 청구서, 낼 금액, 대리인이면 누구 대신, [내기]·[돌아가기], 프런트 전화) → 목업 결제(입력 칸 없이 연습용임을 밝히고 성공·실패·그만두기) → 결과(성공이면 낸 금액과 날짜와 프런트 안내, 실패면 copy 4절 문구). 그만두기와 [돌아가기]는 아무것도 바꾸지 않고 청구서로 돌아간다. 낸 뒤 앱에서 취소하는 길은 없다. 회원 화면에 "미납"을 쓰지 않는다.
- **CORE-08 이번 달 청구서(회원).** 영역(코어 copy 3절의 틀에 시드 날짜를 넣어 바꿔 씀): "12월 청구서가 나왔어요." → "이번 달 내실 돈 2,910,000원" → "1월 10일까지 내시면 돼요." → "드시지 않은 식사 3끼, 27,000원을 빼 드렸어요."(근거 밑줄) → 항목 목록 → 이 금액이 이상해요·인쇄해서 보기 → 보증금 안내 → 급할 때 연락할 분 → "프런트로 전화하기". 행동은 청구서 카드 바로 아래에 둔다. 연락처 안내 뒤에 두면 연락처를 바꾸는 버튼처럼 읽힌다(결정 13). 금액 `number-lg`, 글자 20px, 터치 56px. 해요체. 대리인 화면 상단은 "이은숙 회원님 대신 처리하실 수 있는 일: 청구서 확인, 결제". 코어 copy 3절 예시는 "3월"로 적혀 있고, 날짜는 시드(12월 청구서, 발행 2026-12-31, 기한 2027-01-10)를 따른다.
- **CORE-09 소유주 현황.** 영역: 자기 사업장 합계(이름 가림). 다른 소유주 사업장은 보이지 않는다.
- **CORE-13 장기 부재(P1, 서비스 보완).** 지금 부재 중인 입주자 목록(호실, 이름, 시작일, 예정 복귀일, "예정 복귀일 지남") → [부재 시작] 입력(입주자, 시작일, 예정 복귀일 또는 "모름", 접수 경로) → 행마다 [복귀 기록] · [예정 복귀일 바꾸기] · [등록 취소](테두리 버튼 `[가설]`). 이유·종류·메모 칸이 없다. 합쇼체, "입주자". 회원·보호자 화면에는 나오지 않는다(코어 copy 2-9).
- **CORE-10~12(P1).** 대리인 등록은 특정후견 범위 안내(코어 copy 2-4, `[법률 검토 전 초안]`). 퇴거 정산은 정산 결과를 미리 약속하지 않는다(코어 copy 교정 기록 6).

### 4-3. B 안심 알림
- **SAF-01 지금 처리할 신호.** 카드 순서: 등급 → 호실·이름 → 관찰된 사실 → 시각·출처 → 규칙 → 버튼(B copy 2-2). 판단 단어: 카드에 낙상, 쓰러짐, 응급, 위험, 배회를 쓰지 않고 관찰 문구만 쓴다(B `prd.md` 9절 1단계 확인 포인트). 등급은 중립 `badge`(`badge-neutral`: `bg-muted` + `fg-default`)에 Lucide 아이콘과 글자 굵기로 구분한다. 즉시 확인은 굵은 글자 + 원 안 느낌표(`circle-alert`), 확인 필요는 보통 굵기 + 삼각형(`triangle-alert`), 기록만은 아이콘 없이 `fg-secondary` 글자다. 빨강과 주황은 쓰지 않는다(7절 결정 10). B copy 2-3의 색 지정(진한 빨강, 주황, 회색)과 다르고, B 카피 문서는 허브가 senior-lab에서 고친다. 아이콘 모양과 등급 이름은 B copy 2-3을 따른다. 합쇼체, "입주자".
- **SAF-02 알림 상세.** 영역: 사실과 시각 → 넘김 남은 시간 → 중복 수신 수 → [확인하러 갑니다] → [비상 연락처 보기](맡은 직원만, 열람이 변경 이력에 남음). 다른 직원이 맡으면 "박서준 님이 확인 중입니다."
- **SAF-03 조치 기록.** 시각표(확인 → 만남 → 조치 완료)와 메모. [조치 기록 저장].
- **SAF-04 보호자 알림 미리보기.** "딸 김○○ 님", "08:00에 보냅니다"(`nextSendAt`), 둘째 문장 입력, [보내기 · 올리지 않기]. 올리지 않기는 정해진 경우에만(`safety US-10`). 판단 단어: 보호자 문장에 상태 판단을 쓰지 않는다.
- **SAF-05 알림 기록(Must, 7절 결정 4).** 신호 수신 → 알림 → 넘김 → 확인 → 만남 → 조치 완료 → 건강 소식 처리, 한 줄 타임라인(B `prd.md` F9).
- **SAF-06 기기 시뮬레이터 + 직원 휴대폰 패널.** 데모 전용. 패널 알림 문구 "[2차 호출] …"(B 9절 3단계). 화면에 데모 전용임을 밝힌다.
- **SAF-08~11(P1).** 신호 끊김을 "이상 없음"처럼 보이게 하지 않는다(B `strategy.md` 1절).
- **SAF-12~14(P1, 서비스 보완).** 안부 방문은 체크 목록 틀이다: 호실 줄 전체를 누르면 결과 셋을 시트에서 고르고, 아래 고정 [저장]만 채운 버튼이다(4-9절, 결정 14). 병원에 가신 분과 부재 중인 입주자는 SAF-01 맨 위 [보기]에서 연다.  병원 이름과 진료 내용은 적지 않는다(B copy 2-16). 부재 중이어도 호출벨과 프런트 전화 알림은 멈추지 않는다.
- **SAF-09 안심 알림(회원, P1).** 글자 20px, 호출 중 상태, "프런트로 전화하기". 해요체.

### 4-4. D 보호자 포털·동의
- **FAM-01 입구 / 보여 줄 것 정하기.** 영역: 함께 보실 분 목록 → 사람 한 명씩 다섯 항목(생활 소식, 일정, 청구서, 건강 소식, 생활 요청(P1, 서비스 보완))과 "보여요 / 안 보여요" 글자 상태 → [보여 주기] / [그만 보여 주기]. 스위치를 쓰지 않는다. 그만 보여 주기는 확인 창 "김태호 님(아들)께 생활 소식을 그만 보여 줄까요?" [그만 보여 주기 · 그대로 두기]. 확인 창은 고른 분의 것이므로, 확인 창을 연 화면에서는 목록에서 김태호 님을 고른 상태이고 상세도 김태호 님 것이다(데모 장면 25, 결정 13. 2026-11-04 5절 번호). 글자 20px, 터치 56px, "프런트로 전화하기".
- **FAM-02 건강 소식은 따로 여쭤봐요.** [동의하고 보여 주기 · 동의하지 않기 · 자세히 보기]. 미리 체크된 칸 없음. 동의 문구 버전(v1)을 기록.
- **FAM-03 직원이 적은 내용이 맞는지 봐 주세요.** [맞아요 · 고칠게요]. 확인 전에는 보호자 화면에 아무것도 없다(D 9절 2단계).
- **FAM-04 내 소식을 본 기록.** 회원에게는 허용된 열람만 보인다(D 9절 5단계).
- **FAM-05 AI 사용 안내.** 세 덩어리(생활 소식 / 비서 / 두 곳 모두) + [읽었어요 · 더 자세히 보기]. 법적 고지문은 `[법률 검토 전 초안]`(D copy 3-3). 1024px 이상에서는 [읽었어요] 행동 줄이 본문 열 바닥에 붙어(`position: sticky`) 첫 화면부터 보인다. 앱 밖 경로보다 주 행동이 먼저 보이게 하기 위해서다(결정 13). 보호자용(D copy 3-2)은 본문이 생활 소식뿐이고(v1) 버튼은 [읽었어요] 하나다.
- **FAM-06 보호자 화면.** 첫 화면은 허락된 항목만. 범위 밖 주소를 직접 열면 COM-04 문구, 철회인지 미허용인지 구분하지 않는다. 생활 소식 제목 아래 "이 글은 AI가 먼저 쓰고 생활지원 담당 김하진 직원이 확인했어요. (11월 23일)". 청구서 상단 "이은숙 회원님이 허락하신 청구서예요."(코어 copy 3절), 컴포넌트는 `consent-scope`. 건강 소식 목록 한 줄은 D copy 4-4 "11월 12일 새벽 · 직원이 다녀간 일 · 다친 곳은 없다고 하셨어요"(B 5단계). 119 신고가 있었던 다른 결말(B 부록)에서만 첫 줄이 전화가 먼저였음을 보인다(B copy 교정 기록 6). 해요체, "○○○ 회원님". 글자 17px, 터치 48px.
- **FAM-07, FAM-08 건강 소식에서 뺀 일.** 회원 화면에는 뺀 사실이 보이고, 보호자 화면은 뺀 것과 허락하지 않은 것을 구분하지 않는다(D copy 2-9).
- **FAM-09 보호자 연결.** [입주자 말씀대로 입력하기] → 입주자 확인 대기. 합쇼체, "입주자".
- **FAM-10 주간 생활 리포트.** 영역: 검토 대기 목록 → AI 초안 → 근거 패널 → 경고(병명 등 문장) → [확인하고 발송]. 직원 확인 없이 발송할 수 없다.
- **FAM-11 열람 기록.** 허용·거부·허락 변경 줄. [기간 기록 내려받기(내려받은 사람과 시각도 기록됩니다)].
- **FAM-16, FAM-17(P1, 서비스 보완).** 부재 소식 카드는 "이은숙 회원님이 11월 14일부터 자리를 비우셨어요." 꼴이고 가신 곳은 보이지 않는다(D copy 4-7). 카드는 FAM-06b 맨 위, 허락 표시 줄 바로 아래, 제목 위에 둔다(최대 한 장, "돌아오셨어요"가 나오면 같은 부재의 두 카드를 합친다 `[가설]`). 결정 14. FAM-17은 이미 생활 소식을 보여 주신 회원이 "소식 함께 보기"에 처음 들어올 때 한 번 끼어드는 안내다(D copy 2-10). [알겠어요]가 채운 버튼, [보여 줄 것 정하기]는 테두리.
- **FAM-12~15(P1).** 금전 부탁은 `[운영사 기준 초안]`, 운영사는 회원의 돈을 대신 다루지 않는다(D `strategy.md` 1절).

### 4-5. G AI 생활 비서
- **AST-02 비서 첫 화면.** 큰 버튼 4개(계약·청구서 날짜 / 이번 달 청구서 설명 / 직원에게 전하기 / 프런트로 전화하기) + 작은 버튼(말로 묻기 · 지난 대화 · AI 사용 안내). 큰 버튼 4개는 모두 테두리 버튼(`secondary`)이고 채운 버튼은 쓰지 않는다(7절 결정 3). 글자 20px, 터치 56px.
- **AST-03 말로 묻기.** 들은 말을 답 위에 보이고 [다시 말하기]. 두 번 못 들으면 큰 버튼과 프런트로 안내.
- **AST-04 답 화면.** 답마다 "AI 비서" 표시와 "확인한 곳"(G copy 머리말). 일정 답 예: "12월 청구서는 12월 31일에 나왔어요 / 1월 10일까지 내시면 돼요 / 다음 청구서는 1월 31일에 나올 예정이에요"(G 9절 2단계). 청구 설명 답: 2,910,000원, 생활비·식비·드시지 않은 식사 3끼(G 9절 3단계). 비서는 계산하지 않고 코어 근거를 읽는다. 판단 단어: 금전 질문에 판단하지 않는다("돈을 옮기는 일은 제가 도와드릴 수 없어요." G copy 2-5).
- **AST-05 직원에게 전하기.** 전할 말은 회원님 말 그대로, 가린 번호는 "[가린 번호]". [네, 전해 주세요 · 아니요] → "직원에게 전했어요."
- **AST-10 대화 기록(Must, 7절 결정 4).** 기간·입주자·넘김 여부·도구로 거르고, 한 줄을 펼치면 입주자 말, 비서(AI) 답과 확인한 곳, 도구 호출 줄이 시간 순으로 나온다(G copy 5-1). "직원은 대화 기록을 고치거나 지울 수 없습니다. 기록을 연 직원과 시각도 남습니다." 1년이 지난 대화는 원문 없이 질문 수, 도구, 결과, 넘김 여부만 남는다.
- **AST-09~11 직원 화면.** 넘겨받은 요청 상세(전할 말, 비서 답 원문, 확인 시각, 금전 안내) → [처리 시작]. 도구 호출 기록은 허용 줄과 거부 줄을 같은 표에. 합쇼체, "입주자".
- **AST-12 오류 안내.** "지금은 답을 만들지 못했어요. 아래 큰 버튼으로…"(G copy 6절). 큰 버튼은 그대로 동작한다.

### 4-6. C 생활 지원 단계
- **TRN-01 단계 정의.** 단계에 번호를 붙이지 않는다. 단계마다 추가 서비스 또는 "지금 서비스 그대로", 요금 묶음, 바뀌지 않는 것. 상단 "시스템은 단계를 정하지 않습니다."
- **TRN-02 입주자 단계 요약.** 지금 단계 → 열린 제안 → 외부 돌봄 → 확인할 일 → [평가 기록하기 · 단계 변경 제안하기 · 외부 돌봄 일정 · 단계 변경 이력]. 네 버튼은 모두 테두리 버튼(`secondary`)이고 채운 버튼은 쓰지 않는다(7절 결정 3).
- **TRN-03 평가 기록.** 관찰 사실만 적는다(예: "욕실 턱을 넘으실 때 손을 잡아 드렸습니다"). 병명이 들어가면 경고. 판단 단어와 점수 칸이 없다(C `tech-design.md` 2-2).
- **TRN-04 제안·설명.** 미리보기(추가 서비스, 바뀌지 않는 것, 계약 변경 필요). 설명 기록 없이 결정하면 거부. 문장의 주어는 사람이고, 주어 없는 "단계가 변경되었습니다"를 쓰지 않는다(C copy 머리말). 합쇼체, "입주자".
- **TRN-05 결정.** [제안대로 바꾸기 · 지금 단계 유지 · 다시 살펴본 뒤 결정] + 결정한 까닭 → 확인 창 "생활 지원 추가로 바꿀까요?" [바꾸기 · 취소]. 제안한 직원은 결정하지 못한다.
- **TRN-06 외부 돌봄 일정.** 겹침은 경고로 보이고 처리는 사람이 한다.
- **TRN-07 단계 변경 이력(Must, 7절 결정 4).** 평가·제안·설명·결정·계약 변경 요청·외부 돌봄·겹침 처리를 시간 순 한 줄로(C `prd.md` F11, C copy 2-6). 고치거나 지울 수 없다.
- **TRN-09 회원 화면.** 순서: 이번에 바뀌지 않아요(단계가 바뀐 적 없는 회원에게는 이 제목을 숨긴다. 캔버스 장면은 12월 10일에 단계가 바뀐 뒤라 제목이 보인다) → 12월 10일부터 새로 받으시는 도움 → 지금 단계 → 누가 정했나 → 내실 돈 "계약을 바꾸기 전까지 청구서는 그대로예요" → 지난 단계 기록(C 9절 5단계). "누가 정했나" 줄은 C copy 3-1 그대로 "간호 담당 박서준 직원이 12월 8일에 살펴보고 12월 9일에 회원님께 말씀드렸어요. 최영미 책임자가 12월 10일에 정했어요." 다시 봐 주세요 · [프런트로 전화하기]. 단계 번호, 점수, 추천 없음. 글자 20px, 해요체.

### 4-7. Home·Family 데스크톱 배치 (1024px 이상, 사용자 결정 A안 2026-11-03)

`DESIGN.md` Layout "Home·Family 데스크톱"의 네 유형으로 화면마다 배치를 정한다. 1024px 아래는 지금의 한 열 그대로다. 문구, 행동, 상태는 바꾸지 않고 자리만 나눈다. 보조 열(`side-rail`)은 Home에서 앱 밖 경로(프런트 전화) 하나, Family에서 화면 틀마다 다르다(`DESIGN.md` side-rail 세 가지).

| ID | 유형 | 본문 열 | 보조 열 |
|---|---|---|---|
| COM-07 | 타일 | 인사, 꼭 보실 공지 띠 한 줄(CMN-01), 볼 곳 6개를 `menu-tile` 3×2(1-1절). 대리인은 허락 범위 타일만 | 앱 밖 경로 |
| CORE-16 | 한 열 + 보조 열 | 낼 금액 카드, 바닥 붙는 행동 줄 | 앱 밖 경로 |
| CORE-08 | 본문 2단 | 청구서 카드 안을 둘로: 왼쪽 금액·기한·근거 밑줄, 오른쪽 항목 내역. 카드 바로 아래 행동, 그 아래 맡기신 보증금과 급할 때 연락할 분을 나란히 | 앱 밖 경로 |
| SAF-09 | 본문 2단 | 호출 중 상태(전폭), 아래 내 방 장치 안내와 기록을 나란히 | 앱 밖 경로 |
| FAM-01 | 목록-상세 | 왼쪽 가족 목록, 오른쪽 고른 분께 보여 줄 것. 그만 보여 주기 확인 창(고른 분 김태호 님) | 없음(상세 열 아래 앱 밖 경로) |
| FAM-02 | 한 열 + 보조 열 | 설명 카드, 동의 버튼 | 앱 밖 경로 |
| FAM-03 | 한 열 + 보조 열 | 직원이 적은 내용, 맞아요·고칠게요 | 앱 밖 경로 |
| FAM-04 | 한 열 + 보조 열 | 본 기록 목록 | 앱 밖 경로 |
| FAM-05 | 한 열 + 보조 열 | AI 안내 글(한 줄 36em), 읽었어요(본문 열 바닥에 붙음) | 앱 밖 경로 |
| FAM-07 | 한 열 + 보조 열 | 뺀 일 기록 | 앱 밖 경로 |
| FAM-13 | 타일 | 대신 처리하실 수 있는 일 2개를 `menu-tile` 2열, 범위 안내 | 앱 밖 경로 |
| FAM-14 | 본문 2단 | 왼쪽 초대 양식, 오른쪽 초대받은 분이 보는 화면(예시). 예시 이름 "초대받은 분이 보는 화면"은 예시 카드 안 첫 줄에 두어 두 카드 윗면을 맞춘다 | 앱 밖 경로 |
| AST-02 | 타일 | 비서 소개, 물을 것 4개를 `menu-tile` 2×2, 지난 대화·AI 사용 안내 | 앱 밖 경로 |
| AST-03 | 한 열 + 보조 열 | 말하는 중, 들은 말 | 앱 밖 경로 |
| AST-04 | 한 열 + 보조 열 | 답 카드 | 앱 밖 경로 |
| AST-05 | 한 열 + 보조 열 | 전할 말 확인, 전한 뒤 | 앱 밖 경로 |
| AST-06 | 한 열 + 보조 열 | 청구 문의 확인, 접수 뒤 | 앱 밖 경로 |
| AST-07 | 한 열 + 보조 열 | 지난 대화 목록, 보관 안내 | 앱 밖 경로 |
| AST-08 | 타일 | 대리인 범위 안내, 물을 것 `menu-tile` 2열(범위 밖 안내는 640px 이상에서 그 타일 오른쪽 칸, 640px 아래에서는 그 타일 바로 아래) | 앱 밖 경로 |
| AST-12 | 타일 | 오류 알림, 물을 것 `menu-tile` 2열 | 앱 밖 경로 |
| TRN-09 | 본문 2단 | "이번에 바뀌지 않아요"(단계가 바뀐 적 없는 회원에게는 숨김)와 "새로 받으시는 도움"을 나란히, 지금 단계(전폭), 더 보기 목록, 다시 봐 주세요 | 앱 밖 경로 |
| TRN-11 | 한 열 + 보조 열 | 확인 창 | 앱 밖 경로 |
| FAM-06a | 타일 | 허락 문장(h1) → 부재 카드(FAM-16, 0~1장) → 허락 항목 타일 2열(3개면 옆 칸에 볼 수 없는 것, 4개 2×2, 5개면 마지막 전폭) → 볼 수 없는 것 → 내가 볼 수 있는 것 한 줄 | 레지던스 공지 카드(CMN-13) → 신뢰 문장 → 프런트 문의 |
| FAM-06b | 한 열 + 보조 열 | 뒤로 → 허락 표시(D copy 4-2) → 부재 카드(FAM-16) → 제목 → AI 확인 표시 → 생활 소식 카드(식사·프로그램·요청은 한 열, 사이 구분선) → 내용이 이상해요 | 볼 수 있는 것 목록, 내가 볼 수 있는 것, 프런트 문의 |
| FAM-06c | 본문 2단 | 허락 표시, 청구서 카드 안을 둘로: 왼쪽 금액·기한·근거 밑줄, 오른쪽 항목 내역 | 볼 수 있는 것 목록, 내가 볼 수 있는 것, 프런트 문의 |
| FAM-06d (= SAF-07, TRN-10) | 목록-상세 | 허락 표시, 왼쪽 건강 소식 목록, 오른쪽 고른 소식 상세 | 없음(상세 열 아래 프런트 문의) |
| FAM-06e | 한 열 + 보조 열 | 뒤로 → 허락 표시와 둘째 줄(D copy 4-6) → 제목 → 신청하신 프로그램 카드(CMN-12, 가까운 날짜 먼저) → 날짜 카드 | 볼 수 있는 것 목록, 내가 볼 수 있는 것, 프런트 문의 |
| FAM-06f | 본문 2단 | 볼 수 있는 것과 볼 수 없는 것을 나란히(지금과 같음) | 프런트 문의 |
| COM-09 | 타일 | 묶음 이름, 볼 곳 2~3개를 `menu-tile` 2열(홀수면 마지막 전폭) | 앱 밖 경로 |
| FAM-16 | (FAM-06a 컷) | 첫 화면 새 소식 줄의 부재 카드 + 상세 서랍(결정 15). 부재 중이면 FAM-06b 맨 위에도 같은 카드가 보인다 | — |
| FAM-17, FAM-20 | 한 열 + 보조 열(안내 확인) | 안내 글, 바닥 붙는 행동 줄([알겠어요] 채움, [보여 줄 것 정하기] 테두리). 한 아트보드의 두 상태 | 앱 밖 경로 |
| REQ-01 | 타일 | 종류 타일 6개(제목 "어떤 일인가요?"), 내 요청 구역, 정기 청소 한 줄 | 앱 밖 경로(다른 길은 이것 하나) |
| REQ-02 | (REQ-01 안) | REQ-01 첫 화면의 종류 `menu-tile` 2열(6개, 병원 동행이 켜지면 7번째 전폭) | 앱 밖 경로 |
| REQ-03 | 한 열 + 보조 열(단계 입력) | "n/m 단계", 질문 하나, 입력 하나, 예 문구, [다음으로]. 날짜는 일주일 큰 줄 목록 | 앱 밖 경로 |
| REQ-04 | (REQ-05 컷) 한 열 + 보조 열(확인 카드) | `money` 줄, [맡길게요] · [그만둘게요] 같은 크기 | 앱 밖 경로 |
| REQ-05 | 한 열 + 보조 열(확인 카드) | 요약, 바닥 붙는 행동 줄([네, 전해 주세요] 채움 + [다시 쓸게요] 테두리), 올린 뒤 상태 | 앱 밖 경로 |
| REQ-06, REQ-07 | REQ-06은 REQ-01 구역, REQ-07은 한 열 + 보조 열(결정 15) | REQ-01 안 내 요청(구간 진행 중·끝난), REQ-07 페이지는 상세(상태 문장, 맡은 직원, 지나온 일, 행동 자리 고정). 확인할 요청이 있으면 REQ-08이 열린 상태 | 없음(목록 열 아래 앱 밖 경로) |
| REQ-08 | (REQ-07 컷) 한 열 + 보조 열(확인 카드) | 한 일 한 줄, [다 됐어요] 채움 + [아직이에요] 테두리 | 앱 밖 경로 |
| REQ-09 | 한 열 + 보조 열 | 정기 청소 카드(요일, 다음 회차, [이번 주 쉬기]) | 앱 밖 경로 |
| REQ-10 | 목록-상세 | 뒤로 → 허락 표시와 둘째 줄(보이는 종류) → 목록 열 맨 위 [이은숙 회원님 대신 요청하기](테두리, 전폭) → 요청 줄 / 상세(지금 상태, 맡은 직원, 지나온 일) | 없음(상세 열 아래 프런트 문의) |
| REQ-11 | 한 열 + 보조 열(쓰기) | 뒤로 → 허락 표시 → 안내 → 종류 RadioGroup(4) → 요청 칸 → 비용 안내 → [요청을 전해요] 하나 | 볼 수 있는 것 목록, 프런트 문의 |
| CMN-02, CMN-03 | 각각 한 열 + 보조 열(결정 15) | CMN-02는 위에 날짜 고르기(1024px 이상 7일 한 줄, 아래는 하루씩 큰 화살표)와 그날 프로그램, CMN-03은 상세와 상태에 맞는 행동 하나 | 없음(목록 열 아래 앱 밖 경로) |
| CMN-04, CMN-05, CMN-06 | 확인 창(CMN-03 위, 440px) | 요약 + 버튼 둘. 신청·기다리기는 채움 + 테두리, 취소는 둘 다 테두리 | CMN-03 그대로 |
| CMN-07, CMN-09 | 목록-상세 | "내 신청과 예약" 한 목록(구간 다가오는·지난), 오른쪽 CMN-03 또는 예약 상세. 줄 안에는 행동을 두지 않고 상세에서만 | 없음(목록 열 아래 앱 밖 경로) |
| CMN-08 | 한 열 + 보조 열(단계 입력) | 방 → 날짜 → 시간 → 인원 → 이용 규칙(첫 한 번) → 확인, 한 번에 한 칸 | 앱 밖 경로 |
| CMN-10, CMN-11 | 각각 한 열 + 보조 열(결정 15) | CMN-10은 공지(구간 지금·지난, 꼭 보실 공지가 맨 위), CMN-11은 상세. 띠에서 바로 오면 CMN-11로 간다, 꼭 보실 공지만 바닥 붙는 [읽었어요] | 없음(목록 열 아래 앱 밖 경로) |
| CMN-13 공지 상세 | 목록-상세 | 공지 목록 + 상세, 상세 아래 문의 문장 | 없음 |

- 목록-상세 화면은 데모 장면에서 상세가 이미 열린 상태로 그린다(FAM-01은 김지민 님, FAM-06d는 11월 12일 새벽 소식). 모든 폭에서 고른 항목의 상세 하나만 보이고, 목록의 고른 줄에 표시를 두며, 다른 줄을 누르면 그 상세로 바뀐다. 1024px 아래에서는 목록 아래에 그 상세가 온다(결정 13. 전에는 상세를 모두 늘어놓아 같은 제목이 두 번 보였다).
- 2026-11-04(결정 14): 확인 규칙과 안내 확인 틀은 `DESIGN.md` Components "화면 틀"·"확인 규칙"을 따른다. Home의 탭·구간 버튼·칩은 56px 변형이고 날짜는 한 달 격자 달력이 아니라 일주일 큰 줄 목록이다. 목록-상세 화면은 Home은 목록 열 아래, Family는 상세 열 아래에 앱 밖 경로·문의를 둔다.
- 보조 열의 "볼 수 있는 것" 목록과 프런트 문의 문장은 D copy 4-1의 항목 이름과 각 화면에 이미 있는 문의 문장을 그대로 쓴다. 새 문구는 없다.

### 4-8. N1 생활 요청 (서비스 보완, 사용자 재승인 2026-11-04)
공통: 회원 화면은 글자 20px, 터치 56px, 해요체, "회원님", 화면 아래 호출벨·프런트 고정 문구(copy 2-0)와 `alt-path`. 직원 화면은 운영 밀도(44px), 합쇼체, "입주자". 처리 시간을 약속하지 않고 "곧", "바로 처리"를 쓰지 않는다. 입주자의 상태를 신호등 색으로 칠하지 않고 딱지는 중립 `badge`다 `[가설: 결정 10 준용]`.
- **REQ-01 생활 요청 첫 화면.** 영역: 제목 "생활 요청" → 첫 문장 → 종류 타일 6개(제목 "어떤 일인가요?", 모두 테두리) → 아래 안내 → "내 요청" 구역(진행 중 · 끝난 요청) → 정기 청소 한 줄 "정기 청소: 매주 화요일, 금요일 [이번 주 쉬기]"(P1) → "다른 길"(프런트 전화, 직원에게 말하기, 비서) → 고정 문구. 판단 단어: 몸이 불편한 일은 이 화면이 받지 않는다고 고정 문구로 말한다.
- **REQ-02 종류 고르기.** 제목 "어떤 일인가요?". 종류 큰 버튼 6개(병원 동행은 F14가 켜진 배포에서만 7개) 모두 테두리 `menu-tile`, 글자+그림, 아래에 풀이 한 줄. 채운 버튼 없음(결정 3). "어느 것을 누를지 모르시겠으면 '그 밖의 일'"(copy 2-2). "점검"은 고르지 않는다.
- **REQ-03 종류별 입력.** 한 화면에 한 칸(copy 2-3): 고장·수리는 무엇이 고장 났나요? → 안 계실 때 들어가도 되는지 → (사진은 Next라 칸 없음). 세탁은 옷·이불·그 밖의 것 → 가지러 갈 때. 외출 차량은 언제 → 어디에 → 돌아올 때. 병원 동행은 날짜·시각 → 가실 곳 → 돌아올 때(진료 과목·증상 칸 없음). 칸 아래 예 문구. 지난 시각은 막고 다시 고르게 한다.
- **REQ-05 올리기 전 확인과 올린 뒤.** "이대로 전할까요?" 요약 한 줄 → 네, 전해 주세요 · [다시 쓸게요](같은 크기 테두리). 올린 뒤 "요청을 받았어요. 맡을 직원이 정해지면 이름을 알려 드려요." + "급하시면 기다리지 마시고 프런트로 전화해 주세요." 처리 기한이나 시각을 말하지 않는다.
- **REQ-06 내 요청.** 나누기 "진행 중 · 끝난 요청". 한 줄은 두 줄(종류 · 요청 글 / 상태 문장). 목록 위에 확인할 요청 안내. 가운뎃점으로 셋 이상을 잇지 않는다(copy 2-6). 빈 상태 두 가지(copy 6절).
- **REQ-07 요청 상세와 상태.** 순서: 지금 상태 문장 → 맡은 직원 → 지나온 일(`record-row`, 시각 + 한 줄). 직원 메모, 기한, 담당 바꾼 이유는 보이지 않는다. 다른 사람이 올린 요청은 상태 문장 위 한 줄(copy 2-10). [요청 취소하기]는 접수(담당 없음~담당 있음)와 회원 답 기다림 상태에서만, 처리가 시작되면 버튼 대신 안내 문장. 하지 않음 이유 문장은 1개만 카피에 있어 나머지 3개는 `[NEED: 카피]`.
- **REQ-08 확인하기.** 제목 "직원이 마쳤어요. 확인해 주세요." → 한 일 한 줄(직원이 쓴 그대로) → "다 되었나요?" → 다 됐어요 · [아직이에요](같은 크기 테두리). [아직이에요] 뒤에는 "무엇이 아직 안 됐나요? (안 적으셔도 돼요)" 선택 입력. 병원 동행은 의견 칸이 없다. 비용이 있으면 확인 뒤 문장 "…12월 청구서에 들어가요."(코어 조회 요청 중, 없으면 "다음 청구서" `[NEED]`). 다른 길: "직원에게 말로 '다 됐어요'라고 하셔도 돼요."
- **REQ-12 직원 요청 목록.** 영역: 제목 + 요약("배정 전 · 처리 중 · 확인 기다림 · 기한 지남", 같은 기준 시각) → [대신 등록] → 나누기 4개(`segmented`) + 칩(4-9절, 결정 14) → 팀·종류 필터 → 요청 카드(종류 → 호실·이름 → 요청 내용 → 원하는 시각 → 들어온 곳 → 상태·담당 → 딱지 → 버튼) → 아래 고정 문구. 딱지는 먼저 처리, 기한 지남, 다시 열림, 비용 있음, 정기 다섯 가지이고 모두 중립 `badge`(기한 지남에 경고색 없음 `[가설]`). 의견·불편은 프런트 팀·책임자만, 병원 동행 가실 곳은 생활 지원·운전 팀·책임자만 보인다. 시스템은 요청 글을 읽고 카드를 강조하거나 [안심 알림으로 옮기기]를 강조하지 않는다.
- **REQ-13 요청 상세(직원).** 영역: 요청 내용 → 상태·담당 → 지나온 일 → 버튼 줄. 상태에 맞는 다음 버튼만 채운다(시작 → 완료). [완료]는 "한 일 적기" 한 줄이 비면 저장되지 않는다. [기다림]은 이유 4개 중 하나 필수, 메모는 직원만 본다. [하지 않음]은 이유 4개 중에서만. 더보기에 [안심 알림으로 옮기기]와 확인 창(copy 4-9)과 입주자 확인 대신 기록. 다시 열림 카드는 "입주자가 11:00에 [아직이에요]를 눌렀습니다. 입주자 의견: …"(copy 4-8). 가실 곳은 열 때마다 SENSITIVE_READ.
- **REQ-14 대신 등록.** Sheet. 칸: 호실 · 입주자 · 종류 · 들은 말 · 원하는 시각 · 들은 방법(전화, 직접). 입주자 목록은 코어 `ResidentQuery`에서 매번 읽고 사업장 밖 입주자는 나오지 않는다. 병원 동행은 들은 말 대신 날짜·시각·가실 곳·돌아올 때 칸. [등록]이 채운 버튼. 등록 뒤 "등록했습니다. 청소·세탁 팀 목록에 올라갔습니다."
- **REQ-15 배정.** Dialog "담당자를 고르세요." 팀별 직원 + 맡은 요청 수(오늘 근무·휴무는 Next). 분류 전 요청은 먼저 종류를 정한다("외출 차량 → 운전 팀"). 담당 바꾸기에는 이유(선택). 먼저 맡은 사람이 있으면 409 문구.
- **REQ-19 운영 현황 카드 칸.** CORE-01 카드 영역 8번째 칸 `[코어 `prd.md:123`]`. 칸 제목 "생활 요청", 숫자와 기준 시각만 있고 목표선과 좋음·나쁨 색이 없다. 누르면 REQ-12 "기한 지남". N1이 없거나 권한이 없으면 칸이 나오지 않는다.

### 4-9. 운영 화면 틀과 직원 휴대폰 (2026-11-04, 결정 14)

운영 화면은 `DESIGN.md` Components "화면 틀"의 여섯 틀(처리 큐, 체크 목록, 표 + 옆 패널, 기록·로그, 설정 폼, 현황 카드)과 입력 창 두 가지로 만든다. 같은 틀은 같은 골격이고 내용과 상태만 다르다.

| 틀 | 화면 |
|---|---|
| 처리 큐 | SAF-01, SAF-02, REQ-12, REQ-13, AST-09, CORE-11, TRN-05, FAM-10, CMN-14(오늘) |
| 체크 목록 | SAF-12, SAF-13, SAF-17, CMN-18, CMN-21, CMN-17 줄 |
| 표 + 옆 패널 | CORE-02, CORE-04, CORE-06, CORE-07, CORE-12, CORE-13, CORE-15, SAF-08, SAF-15, TRN-02, CMN-16, CMN-17 |
| 기록·로그 | SAF-05, FAM-08, FAM-11, FAM-15, AST-10, AST-11, TRN-07(CORE-04 변경 이력 영역) |
| 설정 폼 | CORE-03, SAF-10, SAF-11, REQ-17, REQ-18, CMN-22, TRN-12 |
| 현황 카드 | CORE-01(4-2절 3층), CORE-09, CORE-14, TRN-01(SAF-14는 현황 목록) |
| 짧은 창(칸 4개 이하, 440px) | 확인 창 전부, REQ-15, REQ-16, REQ-21, CMN-17·18·19·21의 창, SAF-13 시각 입력, SAF-17 열기 확인 |
| 긴 입력(칸 5개 이상, 오른쪽 시트 480px) | REQ-14, CMN-15, CMN-20, SAF-16, TRN-03, TRN-04, TRN-06, FAM-09, FAM-12, CORE-05, CORE-10 |

- **한 가지로 맞춘 것.** 줄을 열어 상세 보기는 1024px 이상 `side-panel`, 아래는 시트 하나(모달 시트·아코디언·별도 화면을 섞지 않는다). 표 줄 행동은 `ghost`(CORE-13, CORE-15, SAF-12·17, CMN-17·21, REQ 카드의 줄 버튼). "대신 ○○" 입력은 칸 수로 창과 시트를 가르고, 들은 방법(전화·직접) 칸은 마지막 줄 앞. 개수 요약은 `stat-strip` 하나(SAF-01, REQ-12, AST-11, CORE-14, CMN-14). 거름은 탭 = 화면 이동, `segmented` = 한 목록 나누기(2~4, REQ-12 나누기 5개는 4개 + 칩), `chip` = 보조 거름. 되돌릴 수 없는 확정은 쪽의 채운 버튼 → 확인 창(CORE-07 발행, FAM-10 발송, CMN-20, SAF-16, SAF-17).
- **직원 휴대폰(640px 아래).** SAF-01~04, SAF-12~14, SAF-16, SAF-17, REQ-13, CMN-18, TRN-03은 `DESIGN.md` Layout "운영 휴대폰" 틀(4단 한 열, 아래 고정 행동 줄, 상세는 아래 시트, 야간·생활지원은 아래 탭 4칸)을 쓴다. SAF-01은 카드 안 버튼 대신 줄을 고르면 아래 줄에 [확인하러 갑니다]가 나온다. SAF-12·17은 줄 전체를 누르고 결과는 시트에서 고른다(3절의 "라디오 셋 + 저장"보다 이 절이 앞선다). SAF-16은 휴대폰에서 한 칸씩 단계로 쓴다.
- **위계.** REQ-12·CMN-14는 카드 앞 조작 줄을 요약 → 거름 한 줄로 줄이고 채운 버튼은 [대신 등록]·[공지 쓰기] 하나. SAF-05 첫 열은 날짜와 시각, 상세는 옆 패널. SAF-15 칸 값은 줄임말(다녀옴 · 방에 안 계심 · 원하지 않음 · 아직 · 대상 아님)이고 전체 문장은 패널. CMN-19는 하루 보기(열 = 시설, 행 = 시간), 칸 구분은 색 없이 채움 없음/실선/빗금 + 글자. TRN-02 테두리 버튼 넷의 순서는 평가 기록하기 → 단계 변경 제안하기 → 외부 돌봄 일정 → 단계 변경 이력.
- SAF-02 "이 알림을 맡을까요?" 확인 창은 그대로 둔다. 모든 알림이 아니라 "모두 호출" 상태에서만 뜨는 창이고(B copy 2-5), 당번 모두에게 간 알림을 한 사람이 맡아 다시 알림을 멈추는 일이라 겹쳐 맡는 것을 막는 확인이 필요하다. 평소 [확인하러 갑니다]는 한 번 누름이다.

---

## 5. 통합 데모 흐름 (이은숙, A동 201호)

서비스 보완(사용자 재승인 2026-11-04): 코어·B·D·G·C·N1·N2의 9절 통합 장면을 시간순으로 한 줄로 이었다. **시드 초기화(COM-03)를 쓰지 않고 COM-02 멈춘 시계만 옮긴다.** 앞 장면의 기록이 그대로 남아 뒤 장면의 재료가 된다(11/17 정옥자 세탁 → 11/30 청구서, 11/18·11/19 출석 → 11/23 생활 소식, 12/2~12/7 부재 → 12/7 복귀). 각 장면만 따로 할 때는 COM-03에서 시작 상태를 고른다. 이 표에 나오면 "흐름", 부록 장면에만 나오면 "부록", 어디에도 안 나오면 "없음"이다(6절 Must/Next 기준).

| 순서 | 기준 시각 | 계정 | 화면(페이지와 탭·상태, 결정 15) | 보여 줄 것 |
|---|---|---|---|---|
| 1 | — | 본사 정하늘 | CORE-01 | 소유주 2곳, 사업장 2곳(시니어 레지던스, 임대주택) |
| 2 | 2026-10-01 | 경리 박소연 | CORE-04 → CORE-05 | 김한결·이은숙 부부 계약 작성(비상 연락처 포함) → 체결 → 입주. 보증금 580,000,000원 |
| 3 | 2026-10-31 | 경리 → 회원 이은숙 | CORE-06 → CORE-07 → CORE-08 | 10월 결식 CSV → 마감 → 청구서 4,947,000원, 기한 2026-11-10 → 회원 청구서 |
| 4 | 2026-11-10 | 경리 | CORE-04 → CORE-05 | 사별 승계 → 이은숙 단독 계약, 변경 이력 한 줄 |
| 5 | — | 다온 담당자 → 온누리 담당자 | CORE-02 → COM-04 → CORE-09 | 소유주 격리 |
| 6 | 2026-11-11 오후 | 회원 이은숙 | COM-07 → FAM-01 | 두 보호자 모두 "안 보여요" |
| 7 | 2026-11-11 | 프런트 최민수 → 회원 | FAM-09 → FAM-03 → FAM-02 | 대신 입력 → [맞아요] → 건강 소식 따로 동의 |
| 8 | 2026-11-12 02:30~02:58 | 진행자, 김하진, 박서준 | SAF-06 → SAF-01 → SAF-02(1/3 알림 내용) → SAF-02(2/3 조치) → SAF-02(3/3 보호자 알림) | 신호 세 건 → 중복 수신 → 5분 무응답 넘김 → 조치 기록 → 보호자 알림 미리보기 |
| 9 | 2026-11-12 07:30 | 사업장 책임자 최영미 | CORE-01(운영 현황 카드: REQ-19, CMN-23 칸 포함) → SAF-01 → SAF-01(알림 기록 탭) | 운영 현황 카드: 호실 현황(새봄 12호실), 안심 알림(밤 신호 가운데 조치가 끝나지 않은 것, 맡지 않은 신호 0건), 지난 24시간 확인까지 걸린 시간, 확인할 일, 장기 부재 중인 분 1명(A동 301호 김정희), 생활 요청 칸(N1 시드 값), 프로그램·시설·공지 칸(N2 시드 값). AI 생활 비서 사용량(11/5 07:30~11/12 07:30, 시드 값)과 보호자 동의 현황 칸은 코어가 정한다(충돌 7). 숫자마다 기준 시각, 목표선 없음, [다시 불러오기]는 한 칸만. SAF-01 맨 위 한 줄 "맡지 않은 신호 0건 · 신호 끊김 1대 · 오늘 당번 김하진, 2차 박서준, 3차 최영미". SAF-05 침대 센서 알림 줄 "확인까지 6분 · 만남까지 9분" |
| 10 | 2026-11-12 08:00 | 보호자 김지민 → 대리인 김태호 | FAM-06a → FAM-06d | 문자 로그 → 건강 소식. 김태호는 볼 수 없음(COM-04) |
| 11 | 2026-11-12 오전 | 김지민 / 김태호 | FAM-06a, FAM-06c, FAM-06f | 두 보호자 첫 화면 비교 |
| 12 | 2026-11-12 10:00 → 18:10 | 생활지원 윤서연 → 책임자 최영미 | SAF-12 → (시계 18:00) SAF-01 → SAF-12 → SAF-12(책임자 읽기 모드) | 10:30 A동 202호 정옥자 "다녀왔습니다". A동 301호 김정희는 부재 중 줄(코어 부재 시드 11/8~, 들르지 않음). A동 401호 박영순은 기록 없음 → 18:00 출처 "안부 방문" 신호가 확인 필요 알림으로 낮 당번에게 → 18:05 윤서연 [확인하러 갑니다] → 18:08 박영순 "다녀왔습니다" → 18:10 최영미 호실 현황에서 세 분의 오늘 안부 방문과 마지막 신호 시각. 놓친 방문의 조치 완료와 보호자 알림은 [미정]이라 안부 방문 기록까지만(충돌 1 해소안) |
| 13 | 2026-11-17 08:40 | 진행자 → 프런트 최민수 | COM-01(시계 팝오버) → REQ-12 → REQ-12(대신 등록 서랍) | 시계를 11/12에서 11/17로. 정기 청소 첫 회차 4건(A동 301호 김정희는 장기 부재라 쉼), 시드 요청 R-02(김정희 싱크대) 확인 없이 닫힘. 최민수가 정옥자 전화로 세탁(이불, 오늘 오후 수거, 비용 있음)을 [대신 등록] → "등록했습니다. 청소·세탁 팀 목록에 올라갔습니다." |
| 14 | 2026-11-17 09:05 → 10:30 | 회원 이은숙 → 프런트 최민수 → 시설 한도윤 | REQ-01(종류 타일) → REQ-03 → REQ-05 → REQ-12 → REQ-12(배정 대화창) → REQ-12(상세 서랍) | 고장·수리 "화장실 전등이 안 켜져요" → [네, 들어가도 돼요] → [네, 전해 주세요] → "요청을 받았어요. 맡을 직원이 정해지면 이름을 알려 드려요." → 09:20 배정 → 10:10 [시작] → 10:30 [완료] "천장 전구를 바꿨어요." → 회원 화면 "직원이 마쳤어요. 확인해 주세요." |
| 15 | 2026-11-17 11:00 → 14:05 | 회원 이은숙 → 한도윤 → 이은숙 → 프런트 최민수 | REQ-07(확인 대기) → REQ-12(상세 서랍) → REQ-07(확인 대기) → REQ-07 → REQ-12 | 11:00 [아직이에요] "거울 위 등이 아직 안 켜져요" → 13:40 직원 카드 "다시 열림" → [완료] "거울 위 등을 바꿨어요" → 14:00 [다 됐어요] → 지나온 일. 14:05 나누기: 기한 지남 3건(김말순, 한경숙, 최순덕 시드 요청), 확인 없이 닫힘(김정희), 기다림 이유 |
| 16 | 2026-11-17 15:00 → 15:10 | 회원 이은숙 → 보호자 김지민 → 회원 / 김태호 | FAM-01 → REQ-11 → REQ-07 → REQ-10, COM-04 | 15:00 이은숙이 김지민에게 생활 요청 [보여 주기](본인이 넓히는 것이라 바로 적용). 15:10 김지민이 "방 난방이 약하다고 하세요" 대신 올리기 → 회원 화면 "딸 김지민 님이 요청했어요." 김지민은 생활 요청 목록을 봄, 김태호는 허락이 없어 막힘(COM-04). 맡겨지고 마쳐지면 김지민에게만 문자(내용 없음) |
| 17 | 2026-11-17 16:00 → 16:30 | 회원 이은숙 → 운전 정태영 → 이은숙 | REQ-01(종류 타일) → REQ-03 → REQ-05 → REQ-12 → REQ-07 → REQ-09 | 16:00 외출 차량 11/19(목) 10:00, 가실 곳 시장, 돌아오실 때 필요 → 정태영 [맡기] → "정태영 직원이 맡았어요." 16:30 정기 청소 [이번 주 쉬기] → "11월 20일 금요일 청소는 쉬어요. 다음 청소는 11월 24일 화요일이에요." |
| 18 | 2026-11-17 17:00 → 17:10 | 청소·세탁 오수진 → 프런트 최민수 → 경리 박소연 → 책임자 최영미 | REQ-12(상세 서랍) → REQ-12(확인 대신 기록 대화창) → CORE-07(사용 기록 탭) → CORE-01(REQ-19) → REQ-12 | 정옥자 세탁 [완료] → 전화로 다 됐다고 함 → [입주자 확인 대신 기록] → 17:05 경리 화면 "다음 청구서에 들어갈 사용 기록"에 정옥자 이불 세탁 10,000원(자리값, 출처 생활 요청) 1건. 청구 생성은 하지 않음. 17:10 운영 현황 "생활 요청" 칸(열린 요청, 배정 전, 기한 지남, 오늘 정기 작업 마침·쉼·못 함) → 기한 지남 목록(충돌 5) |
| 19 | 2026-11-18 08:50 → 09:30 | 진행자 → 책임자 최영미 → 회원 이은숙 | COM-01(시계 팝오버) → CMN-14 → CMN-20 → COM-07(CMN-01 띠) → CMN-11 | 시계를 11/18로. 공지 "12월 프로그램 일정이 나왔어요" 게시됨, "12월 면회 시간이 바뀌어요"는 11/16부터 게시 중. 09:00 [공지 쓰기] A동 대상 중요 공지 "11월 21일 토요일 오전, A동 물이 나오지 않아요"(문자 켬, 보호자에게 끔) → 문자 로그 4건. 09:30 이은숙 첫 화면 띠 → [읽었어요] → "읽으셨어요. 11월 18일 오전 9시 30분" |
| 20 | 2026-11-18 10:45 → 11:20 | 생활지원 윤서연 → 회원 이은숙 → 프런트 최민수 | CMN-14 → CMN-17(출석 체크 탭) → COM-07(CMN-01 묶음 타일) → COM-09 → CMN-02 → CMN-03 → CMN-03(대기 확인) → CMN-14(시설 예약 탭) → CMN-07(내 예약 구역) | 10:45 체조 출석 이은숙·정옥자·박영순 [참여], 김말순 [신청 없이 온 분 더하기] → "신청 5 · 참여 3 · 신청 없이 옴 1." 11:00 목요일 수채화 "자리가 다 찼어요" → [기다리기] → "첫 번째로 기다리고 계세요." 11:20 이은숙 전화로 최민수 [대신 예약]: 14:00은 프로그램 시간이라 16:00~17:00 1층 모임방 → 회원 화면 "최민수 직원이 회원님 전화를 받고 대신 예약했어요." |
| 21 | 2026-11-18 14:00 → 15:00 | 프런트 최민수 → 회원 이은숙 → 보호자 김지민 / 김태호 | CMN-17 → CMN-03 → CMN-07 → FAM-01 → FAM-06e(CMN-12) → FAM-06a(CMN-13) | 14:00 박영순 전화로 수채화 [대신 취소] → 이은숙이 대기에서 올라감, 문자 → "자리가 나서 신청됐어요." → 내 신청. 14:50 이은숙이 김지민에게 일정 [보여 주기]. 15:00 김지민 일정에 "11월 19일 목요일 오후 2시 / 수채화 · 1층 모임방", 아래 "자리를 기다리시는 프로그램과 시설 예약은 보이지 않아요." 첫 화면에 레지던스 공지 "12월 면회 시간이 바뀌어요", A동 단수 공지는 안 보임. 김태호는 일정 허락이 없어 막힘(COM-04) |
| 22 | 2026-11-18 16:00 → 16:10 | 책임자 최영미 → 프런트 최민수 → 최영미 | CMN-14(공지 탭, 확인 현황 패널) → CORE-01(CMN-23) | 16:00 확인 현황 "대상 4 · 확인함 1 · 직접 전함 0 · 확인 전 3" → 16:05 박영순 전화 [직접 전함] → 확인 전 2(정옥자, 김정희 장기 부재 표시). 16:10 운영 현황 칸 "오늘 회차 1 · 출석 체크 전 0 · 시설 예약 1", "확인 전 중요 공지 1건 · 2개 호실" |
| 23 | 2026-11-19 15:40 | 생활지원 윤서연 | CMN-17(출석 체크 탭) | 시계를 11/19로. 수채화 출석 이은숙·정옥자·김말순·한경숙 [참여] → "신청 4 · 참여 4". 11/23 생활 소식의 재료 |
| 24 | 2026-11-23 | 생활지원 김하진 → 김태호 | FAM-10 → FAM-06b | 리포트 초안(재료: 식사, 프로그램 출석 2회, 생활 요청) → 경고 → 발송 → 확인 표시 |
| 25 | 2026-11-23 | 회원 → 김태호 → 본사 정하늘 | FAM-01 → COM-04 → FAM-11, FAM-04 | 그만 보여 주기 → 막힘 → 열람 기록 |
| 26 | 2026-11-30 | 경리 박소연 | CORE-06 → CORE-07 | 11월 식사 마감 → 청구 생성·발행. 이은숙 11월 청구서 4,893,000원(옛 2인 계약, 기한 2026-12-10). 정옥자 11월 청구서에 서비스 항목 한 줄(이불 세탁 10,000원) |
| 27 | 2026-12-01 10:00 | 온누리 담당자 → 다온 담당자 | CORE-09 → CORE-14 | 11월 월 리포트: 입주 현황, 청구 건수·합계, 수납(기록 없음), 장기 부재 입주자 수, 안전 신호 처리 시간, 생활 요청 처리 수. 이름·호실·목표선 없음. 다온 계정에는 다온하우스만 |
| 28 | 2026-12-02 10:20 → 10:55 | 프런트 최민수 → 생활지원 윤서연 | SAF-01 → SAF-02(1/3 알림 내용) → SAF-02(2/3 조치) → SAF-02(3/3 보호자 알림) | 10:20 이은숙 회원님이 산책 중 휴대폰으로 프런트에 도움을 청함 → 최민수 [전화로 받은 호출 등록](출처 프런트 전화, 즉시 확인) → 10:22 윤서연 [확인하러 갑니다] → 10:35 만남 → 10:40 비상 연락처 1순위 김지민 통화함 → 한 일 "직원이 도와 드림", "비상 연락처에 전화함", "병원으로 가심"(동행 윤서연, 출발 10:50) → 10:55 [보내기](건강 소식, 종류 병원에 가신 일) |
| 29 | 2026-12-02 11:10 | 프런트 최민수 → 보호자 김지민 / 김태호 → 윤서연 | CORE-13 → FAM-06a → FAM-06a(부재 카드 서랍) → FAM-06d → SAF-01 → SAF-13(병원에 가신 분 탭) → SAF-13(부재 중인 입주자 탭) | 최민수가 이은숙 부재 시작(시작일 12/2, 예정 복귀일 모름, 접수 경로 프런트). 목록에 최순덕(12/1부터)도 있음. 김지민에게 문자와 새 소식 카드 "12월 2일부터 자리를 비우셨어요", 건강 소식(병원에 가신 일)도 보임. 김태호는 11/23에 생활 소식을 거둬 카드도 문자도 없음. 이유·종류·병원 이름은 어디에도 없음. 직원 첫 화면 "병원에 가신 분 1명", "부재 중인 입주자 1명", 침대 센서 규칙 멈춤 |
| 30 | 2026-12-07 16:20 → 16:40 | 생활지원 윤서연 → 프런트 최민수 → 보호자 김지민 | SAF-13(병원에 가신 분 탭) → CORE-13 → CORE-01 → FAM-06a(부재 카드 서랍) | 16:30 윤서연 [돌아오셨습니다](돌아오신 시각 16:20) → 16:40 최민수 복귀 기록(12/7). 최순덕은 예정 복귀일(12/6)이 지나 확인할 일에 남음. 김지민에게 문자와 카드 "12월 7일에 돌아오셨어요". 시계를 12/7 18:00으로 옮겨 다음 장면으로 이음 |
| 31 | 2026-12-08 | 책임자 최영미 | TRN-01 | 단계 정의 |
| 32 | 2026-12-08 15:30 | 간호 박서준 | TRN-03 | 평가 기록 |
| 33 | 2026-12-09 | 박서준 → 최영미 → 박서준 | TRN-04 → TRN-02 → TRN-05(거부) → TRN-04 | 제안 → 설명 전 결정 거부 → 설명 기록 |
| 34 | 2026-12-10 16:20 | 최영미 → 박소연 → 김지민 / 김태호 | TRN-05 → CORE-01(TRN-08) → FAM-06d | 결정 → 경리 확인할 일 → 건강 소식(김태호에게는 없음) |
| 35 | 2026-12-10 저녁 | 회원 이은숙 | TRN-09 | 바뀌지 않는 것 먼저 |
| 36 | 2026-12-31 | 프런트 최민수 → 경리 박소연 | CORE-06 → CORE-07 | 12/24 사전 신청 결식 3끼 입력 → 12월 마감 → 청구 생성·발행. 이은숙 12월 청구서 2,910,000원(생활비 2,100,000 + 식비 837,000 − 결식 27,000), 기한 2027-01-10. 입원·부재 기간 끼니는 결식으로 넣지 않음 |
| 37 | 2027-01-05 10:00 | 회원 이은숙 | FAM-05 → AST-02 → AST-04 | 고지 확인 → 날짜 답 → 12월 청구서 2,910,000원 설명(충돌 3) |
| 38 | 2027-01-05 | 회원 | AST-03 → AST-04 → AST-05 | 말로 묻기(식비 93끼 × 9,000원, 옆방 청구서 거부) → 금전 질문 → 직원에게 전하기 |
| 39 | 2027-01-05 | 프런트 최민수 → 책임자 최영미 | AST-09 → AST-11 | 넘겨받은 요청 → 도구 호출 기록(거부 줄) |
| 40 | 2027-01-05 | 진행자 | AST-03 → AST-04(연결 끊김 상태) | LLM 연결 끊김에도 큰 버튼은 답함 |
| 41 | 2027-01-08 | 생활지원 김하진 → 회원 | TRN-02(외부 돌봄 일정 탭) → TRN-09 | 외부 돌봄 겹침 처리 → 다른 기관 돌봄 |

부록 결제 장면(본선 41단계 뒤, 2027-01-08): 대리인 김태호 → 경리 박소연 → 온누리 담당자. CORE-08 → CORE-16 → CORE-07 → CORE-09. 이은숙 12월 청구서 2,910,000원을 낸다. 실패를 고르면 그대로이고 다시 성공을 고르면 완납이다. 시드에는 수납을 넣지 않는다.

순서는 코어 1~5 → D 1~2 → B 1~4 → 코어 운영 현황·B 아침 한 줄 → B 5(D 3) → B 안부 방문 → N1 L0~L10(D 생활 요청 허락 포함) → N2 M0~M11(D 일정 허락 포함) → D 4~5 → 코어 11월 청구 → 코어 월 리포트 → B 병원 동행·코어 부재 시작·D 부재 소식 → 12/7 복귀 → C 1~5 → 코어 12월 청구 → G 1~7 → C 6이다(각 `prd.md` 9절의 통합 장면, 시각은 그 모듈이 정한 값).

---

## 6. 데모 표시 (2026-11-04부터 "통합 데모 흐름에 나오는지")

사용자가 결과물을 "모든 화면 프로토타입"(먼저 Design 캔버스 아트보드, 뒤에 흐름대로 동작하는 클릭형)으로 정해(2026-11-04), 모든 화면을 만든다. 그래서 이 절의 표시는 만들지 여부가 아니라 **5절 통합 데모 흐름에 나오는지**다. **흐름** = 5절 표에 나오는 화면(같은 화면을 가리키는 행 AST-01 = FAM-05, SAF-07·TRN-10 = FAM-06d, 흐름에 나오는 CORE-14 안의 칸 REQ-20, 모든 장면이 기대는 틀·상태 COM-01~08 포함), **부록** = 각 모듈 9절 부록에만 나오는 화면, **없음** = 흐름에도 부록에도 나오지 않고 클릭형으로만 만드는 화면. 예전 Must는 흐름, Next는 부록과 없음에 해당한다(2026-11-03 판단 기준과 7절 결정 4의 기록 화면 예외는 이 표시로 대신한다). 3절 각 행의 데모 열이 근거다.

| 모듈 | 흐름 | 부록 | 없음 |
|---|---|---|---|
| 공통 | COM-01, COM-02, COM-03, COM-04, COM-05, COM-06, COM-07, COM-08, COM-09 | 없음 | 없음 |
| 코어 | CORE-01, CORE-02, CORE-04, CORE-05, CORE-06, CORE-07, CORE-08, CORE-09, CORE-13, CORE-14 | CORE-11, CORE-15, CORE-16 | CORE-03, CORE-10, CORE-12 |
| B 안심 알림 | SAF-01, SAF-02, SAF-03, SAF-04, SAF-05, SAF-06, SAF-07, SAF-12, SAF-13, SAF-14, SAF-15 | SAF-09, SAF-16, SAF-17 | SAF-08, SAF-10, SAF-11 |
| D 보호자 포털·동의 | FAM-01, FAM-02, FAM-03, FAM-04, FAM-05, FAM-06a, FAM-06b, FAM-06c, FAM-06d, FAM-06e, FAM-06f, FAM-09, FAM-10, FAM-11, FAM-16 | FAM-12, FAM-13, FAM-19, FAM-20 | FAM-07, FAM-08, FAM-14, FAM-15, FAM-17 |
| G AI 생활 비서 | AST-01, AST-02, AST-03, AST-04, AST-05, AST-09, AST-11, AST-12 | AST-06, AST-08 | AST-07, AST-10(흐름 페이지 AST-11의 탭), AST-13 |
| C 생활 지원 단계 | TRN-01, TRN-02, TRN-03, TRN-04, TRN-05, TRN-06, TRN-08, TRN-09, TRN-10 | 없음 | TRN-07(흐름 페이지 TRN-02의 탭), TRN-11, TRN-12 |
| N1 생활 요청 | REQ-01, REQ-02, REQ-03, REQ-05, REQ-07, REQ-08, REQ-09, REQ-10, REQ-11, REQ-12, REQ-13, REQ-14, REQ-15, REQ-16, REQ-19, REQ-20 | 없음 | REQ-04, REQ-06, REQ-17, REQ-18, REQ-21 |
| N2 프로그램·시설·공지 | CMN-01, CMN-02, CMN-03, CMN-05, CMN-07, CMN-09, CMN-11, CMN-12, CMN-13, CMN-14, CMN-17, CMN-18, CMN-19, CMN-20, CMN-21, CMN-23 | CMN-04, CMN-08 | CMN-06, CMN-10, CMN-15, CMN-16, CMN-22 |

### 6-1. 화면 수

2절 공통 표와 3절 표의 행으로 센다(공통 9 + 모듈 126 = 135행). 2·3절의 "들어갈 곳과 형태" 열이 "페이지"로 시작하는 행이 따로 만들 페이지다. 같은 화면을 가리키는 행(AST-01 = FAM-05, SAF-07·TRN-10 = FAM-06d), 다른 화면 안의 줄·칸·영역(TRN-08, REQ-19, REQ-20, FAM-19, AST-13, CMN-01, CMN-12, CMN-13, CMN-23), 화면이 아니라 상태인 COM-04~06은 "따로 만들 페이지"에서 뺐다. 결정 15로 44개 행이 다른 페이지의 탭·패널·상태·서랍·구역이 되었다("→"로 시작). 숫자가 줄어도 탭·서랍·대화창·상태 컷은 아트보드로 남는다(6-2절).

| 앱 | 행 | 흐름 | 부록 | 없음 | 합치기 전 | 따로 만들 페이지 |
|---|---|---|---|---|---|---|
| Evenstay 홈(회원, 대리인) | 46 | 29 | 8 | 9 | 44 | 28 |
| Evenstay 패밀리(보호자) | 13 | 13 | 0 | 0 | 9 | 8 |
| Evenstay(운영: 직원, 소유주, 데모 진행자) | 73 | 49 | 6 | 18 | 67 | 40 |
| 모든 앱의 상태(COM-04~06) | 3 | 3 | 0 | 0 | 0 | 0 |
| 합계 | 135 | 94 | 14 | 27 | 120 | 76 |

결정 15의 "74"는 COM-09가 생기기 전 118에서 44를 뺀 수다. COM-09(결정 14)를 더하면 75다. CORE-16(2026-11-05)을 더하면 76이다.

2026-11-04 보완 전: 100행(Must 66, Next 34), 따로 만들 화면 92(앱별 홈 32·패밀리 11·운영 54·상태 3행).

- Home: COM-07, COM-09, CORE-08, CORE-16, SAF-09, FAM-01, FAM-02, FAM-03, FAM-04, FAM-05, FAM-07, FAM-13, FAM-14, FAM-17, FAM-20, AST-01, AST-02, AST-03, AST-04, AST-05, AST-06, AST-07, AST-08, AST-12, TRN-09, TRN-11, REQ-01, REQ-02, REQ-03, REQ-04, REQ-05, REQ-06, REQ-07, REQ-08, REQ-09, CMN-01, CMN-02, CMN-03, CMN-04, CMN-05, CMN-06, CMN-07, CMN-08, CMN-09, CMN-10, CMN-11. FAM-05는 보호자도 처음 한 번 보지만 Home으로 셌다. FAM-14는 회원의 초대와 보호자의 수락을 한 행으로 셌다.
- Family: SAF-07, FAM-06a, FAM-06b, FAM-06c, FAM-06d, FAM-06e, FAM-06f, FAM-16, TRN-10, REQ-10, REQ-11, CMN-12, CMN-13.
- 운영: COM-01, COM-02, COM-03, COM-08, CORE-01, CORE-02, CORE-03, CORE-04, CORE-05, CORE-06, CORE-07, CORE-09, CORE-10, CORE-11, CORE-12, CORE-13, CORE-14, CORE-15, SAF-01, SAF-02, SAF-03, SAF-04, SAF-05, SAF-06, SAF-08, SAF-10, SAF-11, SAF-12, SAF-13, SAF-14, SAF-15, SAF-16, SAF-17, FAM-08, FAM-09, FAM-10, FAM-11, FAM-12, FAM-15, FAM-19, AST-09, AST-10, AST-11, AST-13, TRN-01, TRN-02, TRN-03, TRN-04, TRN-05, TRN-06, TRN-07, TRN-08, TRN-12, REQ-12, REQ-13, REQ-14, REQ-15, REQ-16, REQ-17, REQ-18, REQ-19, REQ-20, REQ-21, CMN-14, CMN-15, CMN-16, CMN-17, CMN-18, CMN-19, CMN-20, CMN-21, CMN-22, CMN-23.

- 센 방법이 바뀌면 숫자도 바뀐다. 표의 행 수가 기준이다.

### 6-2. 아트보드 묶음 (2026-11-04, 결정 14, 결정 15로 바꿈)

캔버스는 따로 만들 페이지 하나에 아트보드 하나(데스크톱, 모바일)다. 탭, 패널, 상태, 서랍, 대화창은 "컷"이라 부르고 그 페이지 오른쪽에 붙인 작은 아트보드로 그린다. 컷 이름에 화면 ID를 남겨 정의서와 이어지게 한다.

- 페이지 아트보드는 기본 상태 하나만 보여 준다. 상태 스위처는 쓰지 않는다.
- 보드에는 실제 화면만 둔다. 작성 메모는 `design/canvas-notes.md`에 보드별로 적는다(사용자 재승인 2026-11-04).
- 컷은 만드는 수를 줄이는 대상이 아니다. "→"로 시작하는 행은 컷이 하나 이상 있다.
- 모든 앱의 상태(COM-04~06)는 페이지가 아니라 공통 페이지의 컷으로 둔다.
- 이전 묶음(결정 14의 119 → 76)은 그리는 방법이었고, 결정 15로 페이지 자체를 줄이면서 이 절로 바뀌었다.

---

### 6-3. 클릭형 프로토타입과 아트보드의 차이 (2026-11-04, 사용자 "추천대로", 사용자 재승인 2026-11-04)

동작 기준은 `design/prototype/`이다. 아트보드는 고치지 않았다.

| 구분 | 내용 |
|---|---|
| 더한 것 | [계약 작성], CSV 올리기, FAM-01에서 FAM-14로 가는 버튼, FAM-09에서 FAM-12로 가는 버튼, SAF-09 데모용 [호출벨 누르기], SAF-01에서 SAF-16·17로 가는 길, FAM-12 제목 옆 `[운영사 기준 초안]` 딱지 |
| 뺀 것 | TRN-09 [다시 봐 주세요](TRN-11이 흐름 밖) |
| 범위 밖 | FAM-14 초대받은 분의 수락 행동 |

## 7. 결정 (2026-11-03, 사용자)

열린 질문 11개를 사용자가 정했다. 모두 같은 날짜다.

| # | 질문 | 결정 | 이유 |
|---|---|---|---|
| 1 | Home 첫 화면(COM-07) | 1-1절의 목록과 순서를 `[가설]`로 쓴다(2026-11-04 결정 14로 바뀜: 6타일 + 묶음 화면) | 제안값 그대로 |
| 2 | 데모 진행자 막대 | 화면 위쪽 한 줄, 문구는 `[가설]` 초안 | 제안값 그대로. `core US-17`의 `[NEED: 카피]`가 풀릴 때까지 |
| 3 | 같은 무게의 큰 버튼이 여럿인 화면 | 모두 테두리 버튼(`secondary`), 채운 버튼은 쓰지 않는다. AST-02 비서 첫 화면, TRN-02 입주자 단계 요약 | 채운 버튼 하나 규칙을 지키면서 버튼 사이에 무게 차이를 만들지 않는다 |
| 4 | P0인데 Next였던 화면 | SAF-05 알림 기록, AST-10 대화 기록, TRN-07 단계 변경 이력은 Must. CORE-03, FAM-06e, FAM-07, FAM-08은 Next(2026-11-04: 모든 화면을 만들기로 해서 Must·Next는 쓰지 않는다. 세 기록은 결정 15로 흐름 페이지 SAF-01, AST-11, TRN-02의 탭이 되어 6절과 어긋나지 않는다) | 누가 언제 무엇을 했는지 보여 주는 화면이라서 |
| 5 | 운영 사이드바 묶음 | 9묶음을 `[가설]` 그대로(2026-11-04 결정 14로 바뀜: 일 기준 6묶음) | 제안값 그대로 |
| 6 | SAF-10, SAF-11 카피 | Next 유지, 카피는 승격할 때 받는다 | 제안값 그대로 |
| 7 | `api/` 이름이 없는 코어 기능 | `core/api`에 추가한다. 이름(`RateRuleCommand`, `MealCommand.closeMonth`, `RepresentationCommand`)은 `[가설]`. 코어 tech-design 반영은 구현할 때 허브가 한다 | 모듈 경계(`CLAUDE.md` 규칙 2)를 지키는 같은 방식으로 |
| 8 | 프런트 전화번호 | 데모용 가상 번호 "02-000-0000" `[가설]`, 화면에 "가상 번호"라고 표시 | 실제 번호가 없고 데모 데이터는 가상이다 |
| 9 | 코어 copy 3절의 날짜 예시 | 화면은 시드를 따르고, 코어 카피 문서는 고치지 않는다 | 제안값 그대로 |
| 10 | 알림 등급 색 | 중립 `badge` + Lucide 아이콘 + 글자 굵기. 빨강·주황은 쓰지 않는다. B copy 2-3의 색 지정과 다르며, B 카피 문서는 허브가 senior-lab에서 고친다 | `DESIGN.md` 원칙(입주자 상태를 신호등 색으로 칠하지 않는다) 유지 |
| 11 | 보호자가 여러 회원을 볼 때 | MVP에서 보호자는 회원 한 명만 본다. 회원 바꾸기는 Next | 제안값 그대로 |
| 12 | Home·Family 데스크톱 화면 | 1024px 이상에서 본문 열 + 보조 열 2단(A안). 화면별 배치는 4-7절 | 1280px에서 모바일 한 열을 가운데 둔 화면이 절반 넘게 비었다. 보호자는 PC에서, 대리인도 PC에서 청구서를 볼 가능성이 높다 |
| 13 | 검수에서 정의서에 막혔던 화면 6건 | CORE-08 행동을 청구서 카드 바로 아래로. 목록-상세는 모바일에서도 고른 상세 하나만. FAM-01 확인 창을 연 화면은 김태호 님을 고른 상태. FAM-05 [읽었어요]는 1024px 이상에서 본문 열 바닥에 붙임. FAM-14 예시 이름을 예시 카드 안으로. AST-08 범위 밖 안내는 640px 이상에서 그 타일 옆 칸 | 새 컨텍스트 검수(critique 3종)에서 정의서를 따른 결과가 어색하다고 지적된 6건. 문구는 바꾸지 않는다 |
| 14 | 레이아웃 검토 핵심 제안 (2026-11-04, 사용자 "핵심제안들 적용해줘") | 회원 첫 화면 `menu-tile` 6개 + 묶음 화면 COM-09(결정 1을 바꿈). 운영 사이드바 일 기준 6묶음과 역할별 첫 화면(결정 5를 바꿈). CORE-01 3층. 운영 휴대폰 틀과 운영 화면 틀(4-9절). 보호자 첫 화면·읽기 골격, `consent-scope` 자리. 확인 규칙과 안내 확인 틀, Home 56px 변형. 4-7절 빈칸. 아트보드 묶음(6-2절). `DESIGN.md` v2.5 | 화면이 133행으로 늘어 앱별로 레이아웃과 정보 구조를 다시 봤다(새 컨텍스트 검토 3건, 공유 노트 `layout-review-2026-11-04.md`). SAF-02 확인 창은 "모두 호출" 상태에서만 뜨는 창이라 그대로 두고(4-9절), 운영 현황 칸 기준 시각은 화면 하나로 두는 배치만 적었고 칸 문구는 코어 copy 확인이 남았다 |
| 15 | 화면 합치기 (2026-11-04, 사용자 "74개 안(탭·목록상세)") | 검토 문서 2절의 A등급(상태·변형)과 B등급(탭·목록-상세)을 모두 넣는다. "판단 필요" 3건도 넣는다: SAF-12 + SAF-15는 "호실 현황" 한 화면(직원 쓰기, 책임자 읽기), CORE-15는 CORE-02 탭이고 소유주는 CORE-09 안 카드, REQ-02 종류 타일 6개는 REQ-01 첫 화면으로. C등급(설정 허브, TRN-12 편집 모드)은 넣지 않아 설정 5행과 TRN-12는 따로 남는다. 빼기 후보 5개(FAM-14, AST-07, CORE-12, FAM-17, FAM-20)는 빼지 않고 합치기로만 처리한다. 행은 지우지 않고 "들어갈 곳과 형태" 열로 적는다. 통합 데모 41단계는 그대로다. 사용자 재승인 2026-11-04 | 모든 화면을 만들되 같은 이용자·같은 자료의 중복 페이지를 줄여 흐름을 보이기 쉽게 한다. 기능 삭제 없음. 근거 `senior-lab/00-hub/reviews/screen-necessity-review-2026-11-04.md`, `shared/decisions.md` |

### 7-1. 남은 `[가설]`
- 2026-11-04 결정 15: 탭·단계·버튼 이름은 카피 확정 문구를 따른다(각 copy.md, `canvas-notes.md`).
- 2026-11-04 결정 14: 회원 첫 화면 6타일의 순서, "급할 때 연락할 분"을 CORE-08 영역으로 보내는 것, 운영 사이드바 6묶음의 항목 이름, 역할별 첫 화면
- 데모 진행자 막대(COM-01~03)의 배치와 문구
- 운영 앱 틀(COM-08)
- Family 머리 막대의 회원 이름 표시(1-2절)
- `core/api` 이름 `RateRuleCommand`, `MealCommand.closeMonth`, `RepresentationCommand`
- 프런트 가상 번호 "02-000-0000"
- 기획이 ID를 주지 않아 정의서가 붙인 ID: FAM-16, FAM-17(8절 행 번호), FAM-19, FAM-20, REQ-20, REQ-21. 각 기획이 "ID 제안"으로 둔 것: CORE-14, CORE-15, SAF-12~17, CMN-01~23. 4-7절에 새로 넣은 REQ·CMN 화면의 데스크톱 배치

## 8. 이 문서와 함께 고친 것

- `design/brand/concepts.html`, `design/system/preview.html`의 "지난달보다 12,000원 적어요"를 시드에 맞게 "12월 청구서가 나왔어요. 이번 달 내실 돈 2,910,000원"으로 바꿨다. 감면 문장은 코어 copy 3절 "드시지 않은 식사 3끼, 27,000원을 빼 드렸어요."로 맞췄다.
- 같은 두 파일에 시드에 없는 값이 더 있어 함께 고쳤다.
  - preview: 보호자 카드 "11월 청구 금액 1,843,000원"과 "지난달과 차이"를 12월 2,910,000원과 감면 27,000원으로 바꿨다.
  - preview: 운영 표의 가상 호실·이름(A동 305호 박정호, B동 112호 최영자)과 금액을 이은숙 님의 10·11·12월 청구서(4,947,000원, 4,893,000원, 2,910,000원)로 바꿨다.
  - preview: 변경 이력 줄을 "박소연 경리 2026. 11. 10."로, 숫자 글자 견본을 2,910,000원으로 바꿨다.
  - concepts: 운영 카드의 같은 가상 이름을 시드 배경 회원(A동 301호 김정희, B동 302호 김말순)으로 바꿨다.

### 8-1. 변경 기록

- **2026-11-05 청구서 결제 추가 (사용자 재승인 2026-11-05, 결제 화면).** 허브 요청. 근거는 `docs/core/prd.md` F16, CORE-16, 부록 장면, `user-stories.md` US-30. 새 행 CORE-16. CORE-07 수납 칸과 CORE-08 첫 행동 [내기], 5절 부록 장면, 6-1 화면 수를 고쳤다. 프로토타입이 정한 청구서 표 세 가지(지난달 표, 호실 위치, 수납 상태 칸)는 같은 날 사용자가 승인했다.
- **2026-11-03 서비스 보완 화면 추가 (사용자 재승인 2026-11-04).** 허브 요청. 근거는 다시 인계된 `docs/{core,safety,family,requests}/`(모두 초안·사용자 재승인 2026-11-04). 새 행 25개: CORE-13, SAF-12~14, FAM-16, FAM-17, REQ-01~19(새 3-6절). 바뀐 기존 행: COM-01(코어 copy 2-11), COM-03(인수 조건 7, 초기화 순서에 requests), CORE-01(운영 현황 카드), CORE-03, SAF-01, SAF-03, SAF-05, SAF-10, SAF-11(카피 들어옴), FAM-01(다섯 항목), FAM-06a, FAM-09. 1-1·1-2·1-3 내비게이션, 4-2·4-3·4-4절 명세, 새 4-8절, 5절 머리 메모, 6절 컷과 6-1 화면 수, 7-1 가설. 화면 수는 75행(Must 55, Next 20)에서 100행(Must 66, Next 34)이 됐다. G "직원에게 넘기기" → 생활 요청 연결은 G 갱신 대기로만 적었다. 같은 날 문서 용어 맞춤: TRN-12 "새 판 저장" → "새 버전 저장", FAM-02 "동의 문구 판" → "동의 문구 버전". 캔버스, `docs/`, `DESIGN.md`는 고치지 않았다.
- **2026-11-04 보완 화면 목록 추가 (사용자 재승인 2026-11-04).** 허브 요청. 근거는 2026-11-04 승인·보완된 `docs/{core,safety,family,assistant,requests,community}/`. 목록만 넣었고 흐름 정의는 다음 단계다. 새 행 33개: CORE-14 월 리포트, CORE-15 위탁 운영 계약 이력, SAF-15 호실 현황판, SAF-16 사고·학대 보고, SAF-17 비상 때 재실 명단, FAM-19 보호자 동의 현황 칸, FAM-20 일정 범위 안내, AST-13 비서 사용량 칸, REQ-20 월 리포트의 생활 요청 칸, REQ-21 정기 청소 쉼 대신 기록, CMN-01~23(새 3-7절 N2). 바뀐 행 45개(전체 교체): CORE-01, 04, 05, 07, 08, 09, 13, SAF-01, 02, 05, 09, 10, 12, 13, 14, FAM-01, 04, 06a, 06b, 06e, 10, 16, AST-05, 09, 10, 11, 12, REQ-01~16, REQ-18, REQ-19. "직원에게 넘기기 → 생활 요청"의 G 갱신 대기를 풀었다. 1-1·1-2·1-3 내비게이션(N2 버튼 셋, 공지 칸, 사이드바 11묶음), COM-03 초기화 순서(community), 5절 통합 흐름(22 → 41단계, 시드 초기화 없이 시계만 옮김, 옛 번호 12 → 25), 6절(Must/Next → 흐름/부록/없음), 6-1(100 → 133행, 따로 만들 화면 92 → 118), 7-1 가설을 고쳤다. 모듈별 추출과 어긋난 곳은 허브 공유 노트 `screens-add-2026-11-04/`. 캔버스, `docs/`, `DESIGN.md`는 고치지 않았다.
- **2026-11-04 레이아웃 검토 핵심 제안 적용 (사용자 재승인 2026-11-04, 결정 14).** 사용자 "핵심제안들 적용해줘". 근거는 새 컨텍스트 검토 3건(공유 노트 `layout-review-2026-11-04.md`). 1-1 회원 첫 화면 6타일과 새 COM-09 묶음 화면(2절), 1-2 보호자 첫 화면 구성과 보조 열·목록-상세 모순 정리, 1-3 사이드바 6묶음·역할별 첫 화면, 4-2 CORE-01 3층, 4-4 FAM-16 자리, 4-7 COM-07·FAM-06a·06b·06e 고침과 COM-09·FAM-16·17·20·REQ-01~11·CMN-02~13 행 추가, 새 4-9절(운영 화면 틀, 직원 휴대폰, 위계), 6절 COM-09, 6-1(133 → 134행, 따로 만들 화면 118 → 119), 새 6-2절(아트보드 119 → 76), 7절 결정 14, 7-1. `DESIGN.md` v2.5(본문만, 토큰 값 그대로, lint 0/0, build 실행). 그대로 둔 것: SAF-02 확인 창("모두 호출" 상태 전용, 4-9절), 운영 현황 칸 기준 시각 문구(코어 copy, 배치는 4-2절에 적용), 문구 규칙 위반 4건(`docs/` 몫), 캔버스.
- **2026-11-04 화면 합치기 74개 안 적용 (사용자 재승인 2026-11-04, 결정 15).** 허브 요청, 사용자 "74개 안(탭·목록상세)". 2·3절에 "들어갈 곳과 형태" 열 추가(134행, 그중 합쳐진 44행), 1-3 사이드바 표, 5절 화면 열, 6절 AST-10·TRN-07 표시, 6-1 따로 만들 페이지 75, 6-2 페이지와 컷, 결정 4 주석, 결정 15. COM-07 목록의 "급할 때 연락할 분"은 CORE-08 안 칸으로 CORE-08 행에 적었다.
- **2026-11-04 보드 작성 메모 분리 (사용자 재승인 2026-11-04).** 사용자 지적, 허브 전달. 캔버스 보드의 작성 메모를 `design/canvas-notes.md`로 옮겼다(6-2절). 같은 날 4-8절 REQ-01, CMN-01 행, 5절 20단계(COM-09)도 고쳤다.
- **2026-11-04 캔버스 가칭 문구 확정 반영 (사용자 재승인 2026-11-04).** 허브 요청. 코어 copy 2-15·2-16, B copy 2-22, D copy 2-8, N1 copy 10-10, N2 copy 확정 문구로 2·3절 "들어갈 곳과 형태", 5절 화면 열, 2절 계정 수(22계정)를 고쳤다.
- **2026-11-04 묶음 이름 확정 (사용자 재승인 2026-11-04).** 사용자 "모두 추천대로". "프로그램과 예약", "도움과 안심". `[가칭]` 표시를 닫았다.
- **2026-11-04 C 문구 풀어 쓰기 반영 (사용자 재승인 2026-11-04).** 사용자 지적. 회원·보호자 "이번에 바뀌지 않아요", "새로 받으시는 도움", 직원 "바뀌지 않는 것", "추가 서비스".
- **2026-11-04 쉬운 말 재검수 반영 (사용자 재승인 2026-11-04).** 사용자 "추천대로". 근거는 모듈별 `plain-read-review-2026-11-04.md`와 `shared/decisions.md` 앱 공용 문구 14건. 남은 곳으로 적힌 줄(57, 121, 251, 258, 281, 288, 342, 367, 394, 429, 434, 484, 489행 근처)과 TRN-09 행 두 곳을 새 문구로 맞췄다. TRN-09는 단계가 바뀐 적 없는 회원에게 "이번에 바뀌지 않아요" 제목을 숨긴다는 조건을 더했다. 비서 프런트 번호는 "프런트로 전화하기 02-000-0000 (가상 번호)"로 맞췄고, 화면에 보이는 버전 뜻의 "판"은 이 문서에 없었다. 캔버스 보드 소스에도 같은 문구를 맞췄다.
