# Evenstay 클릭형 프로토타입

이름과 숫자는 모두 가상이다. HTML, CSS, JS만 쓰고 빌드가 없다. 상태는 브라우저 localStorage에 남는다.

## 여는 법
```bash
python3 -m http.server 4173 --directory design/prototype
```
저장소 루트에서 실행하고 http://localhost:4173/ 을 연다.

## 쓰는 법
- 위쪽 시연 막대: 사용자·권한 바꾸기, 날짜·시간 이동, 처음 상태로 되돌리기, 보낸 문자 보기, 모바일 보기, 시연 순서, 이 화면 설명, 설명 켜기, 도움말.
- 오른쪽 시연 순서: `design/mvp-screens.md` 5절 41장면을 단계로 잇는다. [이 순서 열기]는 날짜·사용자·화면을 옮기고, 사람이 직접 누른다. [자동으로 누르기]는 정의된 대로 누른다.

## 메인 홈
`/`(index.html)는 프로토타입과 서비스를 안내하는 홈이다. 권한별 화면(`home/roles.html`), 화면 찾아보기, 문서(`home/docs/`), 근거, 아트보드, 기술과 스킬, 제작 히스토리(`home/history*.html`) 페이지가 있다. 제작 히스토리의 문구는 `strings/history.json`, 자료는 `design/home/history/*.json`이다. 앱은 `app.html`이다.
`index.html`, `home/*.html`, `home/docs/*.html`, `home/history/data/`, `data/roles.json`은 생성물이라 손으로 고치지 않는다. 문장은 `strings/home.json`, 틀은 `design/home/build.mjs`, 스타일과 동작은 `home/assets/home.css`, `home/assets/home.js`다. 원본 문서와 `design/home/facts.json`, `design/home/artboards.json`, `design/home/test-results.json`이 바뀌면 저장소 루트에서 다시 만든다.
```bash
node design/home/build.mjs
```
시험을 돌려 `design/home/test-results.json`에 기록하는 명령(결과는 홈 화면에 보이지 않고 기록으로만 남는다):
```bash
PPTR=<puppeteer-core가 있는 폴더> node design/home/run-tests.mjs
```
흐름도는 `home/assets/mermaid.min.js`(MIT, 라이선스 `mermaid.LICENSE.txt`)로 브라우저에서 그리고, mermaid 블록이 있는 문서 페이지에서만 불러온다. 마크다운은 생성할 때 `design/home/vendor/marked.esm.js`(MIT)로 바꾼다. 인터넷이 필요 없다.

## 소개 사이트
http://localhost:4173/site/ 에 있다. 앱 위쪽 막대의 [소개 사이트]로 가고, 사이트의 [프로토타입 열기]로 앱에 온다.
`site/`는 생성물이라 손으로 고치지 않는다. 문장은 `design/site/src/strings/`, 동작은 `design/site/src/static-site.js`를 고친 뒤 아래를 돌린다.
```bash
python3 design/site/src/build_static.py
```

## 폴더
- `js/lib/` 틀, 저장, 시계, 진행기. `js/modules/` 모듈마다 상태, 공개 함수, 화면, 장면 단계.
- `strings/` 화면 문구. 문구를 고칠 때는 이 파일만 고친다. `strings/help.json`은 툴팁과 도움말 설명이다. `data/` 시드 값.
- `css/proto.css`는 캔버스 공유 CSS 사본이다. 값은 `DESIGN.md`가 원본이다.
- `CONTRACT.md` 모듈 규칙. `review-notes.md` 문구·흐름 검수 기록.

## 시험
```bash
PPTR=<puppeteer-core가 있는 폴더> node design/prototype/test/run-flow.mjs --width 1640 --extra
```
```bash
PPTR=<puppeteer-core가 있는 폴더> node design/prototype/test/visit-all.mjs
```
```bash
PPTR=<puppeteer-core가 있는 폴더> node design/prototype/test/start-states.mjs
```
```bash
PPTR=<puppeteer-core가 있는 폴더> node design/prototype/test/meal-count.mjs
```
```bash
PPTR=<puppeteer-core가 있는 폴더> node design/prototype/test/bar-layout.mjs
```
```bash
PPTR=<puppeteer-core가 있는 폴더> node design/prototype/test/help-all.mjs --width 1640
```
```bash
PPTR=<puppeteer-core가 있는 폴더> node design/prototype/test/visit-site.mjs --width 1440
```
```bash
PPTR=<puppeteer-core가 있는 폴더> node design/prototype/test/visit-home.mjs
```
```bash
node design/prototype/test/check-strings.mjs
```
