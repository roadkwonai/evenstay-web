# Evenstay 로고

상태: 승인(2026-11-03). 브랜드 컨셉 3안 "함께 보는 기록"의 시안(`../concepts.html`)을 정식 파일로 만들었다. 한눈에 보려면 `index.html`을 연다.

## 구성
- **심볼:** 둥근 사각형 두 개(한 변 38, 선 6, 모서리 8, 18만큼 어긋남). 먹 선은 한 사람, 코발트 선은 다른 사람의 기록이다. 두 안쪽이 겹치는 14×14 칸만 노랑으로 채운다. 겹친 칸의 두 모서리는 사각형 안쪽 모서리와 같은 반지름 5로 둥글렸다.
- **워드마크:** 소문자 "evenstay", Pretendard Bold 700, 자간 -2%. 글자를 윤곽선으로 바꿔서 글꼴이 없어도 똑같이 보인다.
- **가로형:** 심볼 높이는 x높이의 1.36배이고, 심볼 가운데를 x높이 가운데에 맞췄다. 심볼과 글자 사이는 심볼 높이의 0.39배다.
- **제품 이름:** "홈", "패밀리"는 Pretendard Bold 700, 자간 -1%, 보조 글자색이다. 크기는 워드마크의 88%로, 한글 높이가 x높이의 1.46배다. 기준선은 워드마크와 같다. 워드마크 글자 폭 끝에서 x높이의 0.66배 뒤에 두어, 보이는 간격이 약 39다. 글로 쓸 때는 "Evenstay 홈", "Evenstay 패밀리"다.

## 파일
| 파일 | 쓰는 곳 |
|---|---|
| `evenstay-logo-{light,dark,black,white}.svg` | 기본 가로형. 운영 화면 상단 바, 문서, 슬라이드 |
| `evenstay-home-logo-*.svg`, `evenstay-family-logo-*.svg` | 회원 앱, 보호자 화면 |
| `evenstay-logo-stacked-*.svg` | 첫 화면, 표지 |
| `evenstay-symbol-*.svg` | 공간이 좁을 때. 32px 이하는 `evenstay-symbol-small-light.svg`(선 8) |
| `favicon.svg` | 브라우저 탭. 라이트·다크 설정을 따라 색이 바뀐다 |
| `app-icon.svg`, `app-icon-rounded.svg` | 앱 아이콘 원본(1024), 모서리 둥근 미리보기 |
| `png/favicon-16.png`, `png/favicon-32.png` | 구형 브라우저용 파비콘 |
| `png/apple-touch-icon.png` (180) | iOS 홈 화면 |
| `png/icon-192.png`, `png/icon-512.png` | PWA 매니페스트. 심볼이 가운데 52% 안에 있어 maskable로도 쓸 수 있다 |

색: light는 먹 `#17191C`·코발트 `#2340A0`·노랑 `#F3D766`, dark는 `#F4F4F1`·`#8EA6F0`·`#F3D766`(DESIGN.md의 `fg-strong`, `primary`, `highlight`와 같은 값). 제품 이름 글자색은 light `#555A60`(`fg-secondary`), dark `#AEB2B8`(`dark-fg-secondary`)이고 black·white는 본색과 같다. 앱 아이콘은 코발트 바탕에 `#FAFAF7`과 노랑 선이다.

## 규칙
- 둘레 여백은 심볼 높이의 절반 이상.
- 가장 작은 크기: 가로형 높이 24px, 심볼 16px. 32px 이하에서는 작은 심볼을 쓴다.
- 색은 light, dark, black, white 네 가지만 쓴다. 노랑 겹침 칸은 컬러 로고에만 있다.
- 늘이기, 기울이기, 그림자, 테두리, 그라디언트, 글자 다시 치기를 하지 않는다.
- [지원 회사] 이름이나 표지와 함께 묶지 않는다.

## 바뀐 것
- 2026-11-03: 제품 이름을 "Home", "Family"(Pretendard SemiBold)에서 "홈", "패밀리"(Bold 88%)로 바꿨다(사용자 결정). 로고 높이는 예전과 같고(90.6 → 90.8), 파일 이름은 그대로다.

## 다시 만들기
SVG는 `node design/brand/logo/src/build.cjs`로 다시 만든다(윤곽선 데이터 `src/glyphs.json` 포함). 윤곽선을 다시 뽑을 때만 공식 Pretendard v1.3.9 zip의 `public/static/Pretendard-Bold.otf`·`Pretendard-SemiBold.otf`와 opentype.js 1.3.4로 `src/glyphs.cjs`를 돌린다. PNG는 Chrome 헤드리스로 SVG를 해당 크기로 렌더해 만들었다.
