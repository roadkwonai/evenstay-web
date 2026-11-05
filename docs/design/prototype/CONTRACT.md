# 프로토타입 모듈 계약

HTML, CSS, JS만 쓴다. 빌드 없음. 화면은 캔버스 보드 마크업을 옮겨 상태로 채운다. 문구는 copy 문서와 보드 그대로다.

화면 문구는 `strings/<모듈>.json`, 시드 값은 `data/<모듈>.json`에 있다. HTML·JS에는 한글을 두지 않고 `tx('화면ID.항목', { 값 })`만 쓴다(`js/lib/text.js`). 이름과 금액 같은 값은 문구 안 `{이름}` 자리로 넣는다. `node test/check-strings.mjs`가 코드 안 한글, 빠진 키, 안 쓰는 키, 금지어를 본다. 아래 예시의 한글 문자열은 설명용이고 실제로는 키로 쓴다.

## 파일
- `js/lib/kit.js` 공통 도구, `js/lib/frames.js` 앱 틀, `js/lib/people.js` 사람·사업장, `js/lib/app.js` 그리기·이벤트, `js/lib/stage.js` 데모 막대·장면 진행기.
- `js/modules/<모듈>.js` 모듈 하나. 다른 모듈 파일을 import하지 않고 `api.<모듈키>.함수()`만 쓴다(CLAUDE.md 규칙 2). 다른 모듈 상태 `db.<다른 모듈>`을 읽거나 쓰지 않는다.

## 모듈 모양
```js
import { api, db, view, emit, refuse, commit, go, href, me, now, nowISO, esc, ic, fmt, dialog, sheet, sheetWrap, denied, empty, toast, sms } from '../lib/kit.js';
export default {
  key: 'requests',
  seed: () => structuredClone(SEED),       // data/requests.json. db.requests가 된다
  api: { openCount() {} },                  // 다른 모듈이 부르는 함수
  on: { 'core.ResidentAbsenceStarted': (e) => {} },   // 이벤트 구독
  tick(prevISO, nextISO) {},                // 시계가 앞으로 옮겨질 때 그 사이에 일어날 일
  actions: { 'req.confirm': (args, form) => {} },     // data-act 이름. 끝나면 자동 저장·다시 그림
  screens: { 'REQ-07': { app: 'home', title: '요청 상세', render(params) { return '...'; } } },
  flow: [ /* 아래 "장면 단계" */ ],
};
```
- `app`: `home`(회원), `family`(보호자), `ops`(직원). render는 틀 안 내용만 돌려준다.
  - home: 문자열 또는 `{ main, rail, foot, overlay }`. `main`은 `.desk-main` 안, `foot`은 그 아래 고정 안내 문구, `overlay`는 대화창.
  - family: 문자열 또는 `{ main, railTop, noRail, overlay }`
  - ops: 문자열 또는 `{ main, overlay }`. `main`은 `.ops-main` 안(`.page-head`부터). 사이드바와 앱 바는 틀이 그린다.
  - 앱 바, 사이드바, 프런트 전화 칸, 가상 데이터 문장은 틀이 그리니 넣지 않는다.
- 이동: `<a href="${href('REQ-07',{id})}">`. 코드에서는 `go('REQ-07',{id})`.
- 행동: `<button data-act="req.confirm" data-id="R1">`. 인자는 `args.id`(dataset). `<form data-act="...">`는 제출 때 `form` 객체로 값이 온다. 버튼이 form 안이면 form 값도 함께 온다.
- 화면 임시 상태: `view.tab`, `view.dialog` 등. `data-set="tab=usage&dialog="`로 바꾸고 다시 그린다. 경로가 바뀌면 비워진다. action 안에서도 `view.x = 1`을 쓸 수 있다.
- 입력 칸: `data-bind="memo"`는 값을 `view.memo`에 담는다. `data-live`를 더하면 입력마다 다시 그린다(비었을 때 버튼을 막을 때). 다시 그려도 값과 커서는 남는다.
- 대화창: `overlay: view.dialog === 'x' ? dialog('제목', '<p>…</p>', '<button…>') : ''`. 긴 입력은 `sheet()`, 보드의 `.rsheet` 마크업을 그대로 쓰면 `sheetWrap()`.
- 불가능한 동작: 화면에서 버튼을 빼거나 `disabled`로 막고, 행동 안에서도 상태를 확인해 `refuse('copy 문구')`로 거부한다.
- 사용자 입력을 찍을 때는 `esc()`를 쓴다.
- 아이콘: `ic('이름')`. 참고 보드의 `<ic 이름>`을 `${ic('이름')}`로 바꾼다.
- 시각: `db.now`는 멈춘 시계 ISO 문자열(`2026-11-17T09:05:00`). 기록 시각은 `nowISO()`. 날짜 표시는 `fmt`.
- 시드는 "그 시각에 닿아야 보이는" 날짜 행으로 둔다. 시드 초기화 없이 시계만 옮겨 이어지는 흐름이다(mvp-screens 5절).
- 문자: `sms('김지민', '문구')`. 막대의 문자 로그에 쌓인다.

## 장면 단계(flow)
mvp-screens 5절의 41장면을 단계로 잇는다. 한 단계는 한 사람이 한 화면에서 하는 일이다.
```js
{ scene: 14, ord: 1, at: '2026-11-17T09:05:00', as: 'm.eunsook', go: ['REQ-01'], say: '회원이 고장·수리 요청을 올립니다.',
  steps: [ { click: '고장·수리' }, { fill: 'text', value: '화장실 전등이 안 켜져요' }, { click: '다음' }, { see: '이대로 전할까요?' } ] }
```
- `at`, `as`, `go`는 단계를 열 때 시계·계정·화면을 옮긴다. `as`는 `people.js`의 계정 id.
- `steps`: `{click:'글자', within?:'선택자'}`(보이는 글자로 a·button·label을 찾아 누른다), `{sel:'css'}`, `{fill:'name 또는 data-bind', value}`, `{see:'글자'}`, `{no:'글자'}`, `{at:'ISO'}`, `{as:'id'}`, `{go:'화면', params}`.
- 단계 하나는 화면을 끝까지 실제로 누른다. `see`로 결과 문구를, 다른 사람 화면에 반영됐는지도 확인한다.
- 이 정의가 안내 패널의 "자동으로 누르기", 시작 상태 복원, 시험에 함께 쓰인다.
- `ord`는 장면 안 순서다. 여러 모듈이 한 장면을 나누면 아래 표의 `ord` 범위를 지킨다.

| 장면 | 모듈(ord) |
|---|---|
| 1 | common(1) |
| 2~5 | core |
| 6, 7, 10, 11, 24, 25 | family |
| 8, 12, 28 | safety |
| 9 | common(1), safety(2~) |
| 13, 14, 15, 17 | requests |
| 16 | family(1), requests(2~) |
| 18 | requests(1~4), core(5), common(6), requests(7) |
| 19, 20, 22(1), 23 | community |
| 21 | community(1~3, 7), family(4~6) |
| 22 | community(1), common(2) |
| 26, 27, 36 | core |
| 29 | core(1), family(2~3), safety(4~) |
| 30 | safety(1), core(2), common(3), family(4) |
| 31, 32, 33, 35, 41 | transitions |
| 34 | transitions(1), common(2), family(3) |
| 37 | family(1), assistant(2~) |
| 38, 39, 40 | assistant |

## 41장면 밖 화면
부록과 없음 화면은 모듈의 `extra: [ ... ]`에 같은 모양으로 단계를 쓴다(`scene` 없이). `run-flow.mjs --extra`가 41장면을 지난 상태에서 이어 누른다. `at`은 2027-01-08 뒤 시각을 쓴다.

## 모듈 사이 공개 함수
이름을 지킨다. 다른 모듈 함수는 `api.x.y?.()`처럼 부른다(아직 없을 수 있다). 더 필요하면 자기 `api`에 만들고 보고에 적는다.

### core (코어 담당)
- `residentName(id)`, `residents(siteId='S1')` 지금 거주 중인 입주자 `[{id,name,room,siteId}]`(계약 상태 기준. 이은숙은 입주 뒤부터, 김한결은 승계 뒤 빠짐)
- `resident(id)`, `contractOf(residentId)`, `keyDates(residentId)` `{moveInDate, contractEnd, ...}`
- `invoiceOf(residentId, 'YYYY-MM')`, `latestInvoice(residentId)` `{month,total,issuedOn,dueOn,lines:[...],mealSkips,status}` 발행 전이면 null
- `emergencyContacts(residentId)`, `isAbsent(residentId, iso?)`, `openAbsences(iso?)`
- `mealCount(residentId, fromYmd, toYmd)` `{served, total}`(D 생활 소식 "21끼 중 18끼")
- `recordServiceUsage({residentId, item, amount, source, sourceId})`, `pendingUsages()`
- `occupancy(siteId)`, `todos(persona)` 코어 확인할 일 줄 `[{text, href}]`
- 이벤트: `core.ContractSucceeded {residentId}`, `core.ResidentAbsenceStarted {residentId, startedOn, expectedOn}`, `core.ResidentAbsenceEnded {residentId, returnedOn}`, `core.InvoiceIssued {residentId, month}`

### safety (B)
- `isNightDuty(personaId)` 시계가 야간이고 그 계정이 당번이면 true(운영 틀이 안전 탭만 보인다)
- `board()` `{unclaimed, unfinished, disconnected, duty:{first,second,third}, ackMinutes, asOf}`, `monthSummary('YYYY-MM')`, `navCounts()`
- 건강 소식은 직접 보내지 않고 `api.family.publishHealthNews(...)`만 부른다(CLAUDE.md 원칙). `isCalling(residentId)` 호출 중이면 true(COM-07 부제)

### family (D)
- `canSee(personaId, key)` key: LIFE, SCHEDULE, BILL, HEALTH, REQUEST. 대리인·보호자 허락 판단의 유일한 곳
- `publishHealthNews({residentId, kind, listLine, title, body, at, source})` kind: VISIT, HOSPITAL, STAGE. 동의가 없으면 저장만 하고 보이지 않는다
- `consentSummary()`(FAM-19 칸), `aiNoticeAcked(residentId)`(FAM-05 확인 여부), `navCounts()`
- 코어 부재 이벤트를 구독해 FAM-16 카드와 문자를 만든다

### requests (N1)
- `board()` `{open, unassigned, overdue, todayRoutine:{done,skipped,missed}, asOf}`(REQ-19), `monthSummary('YYYY-MM')`, `navCounts()`
- `homeSub(residentId)` COM-07 타일 부제(`진행 중인 요청 1건`), `doneList(residentId, fromYmd, toYmd)`(생활 소식 재료), `intakeFromAssistant({residentId,text})`(비서가 넘긴 분류 전 요청)

### community (N2)
- `board()` `{sessions, attendancePending, bookings, unreadNotices, unreadRooms, asOf}`(CMN-23), `navCounts()`
- `homeToday(residentId)` 1번 타일 부제, `importantNotice(residentId)` 꼭 보실 공지 띠 `{id, title, count}` 또는 null
- `familySchedule(residentId)`(CMN-12), `familyNotices(residentId)`(CMN-13), `attendance(residentId, fromYmd, toYmd)`(생활 소식 재료)

### assistant (G)
- `usageSummary()`(AST-13 칸), `navCounts()`

### transitions (C)
- `inbox(persona)` 확인할 일 줄 `[{text, href}]`(TRN-08), `currentStage(residentId)`, `navCounts()`
