# 설치한 것과 쓴 도구

[이력 개요](README.md)

## 스킬 저장소

| 저장소 | 방법 | 스킬 수 |
| --- | --- | --- |
| [wondelai/skills](https://github.com/wondelai/skills) | npx skills add (폴더마다 필요한 스킬만) | 2 |
| [phuryn/pm-skills](https://github.com/phuryn/pm-skills) | npx skills add (폴더마다 필요한 스킬만) | 23 |
| [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) | npx skills add (폴더마다 필요한 스킬만) | 4 |
| [Owl-Listener/designer-skills](https://github.com/Owl-Listener/designer-skills) | npx skills add (폴더마다 필요한 스킬만) | 29 |
| [Nutlope/hallmark](https://github.com/Nutlope/hallmark) | git clone --depth 1 후 필요한 스킬 폴더만 evenstay/.claude/skills로 복사(cp -R) | 1 |
| [ConardLi/garden-skills](https://github.com/ConardLi/garden-skills) | git clone --depth 1 후 필요한 스킬 폴더만 evenstay/.claude/skills로 복사(cp -R) | 1 |
| [elayadesign/ai-design-skills](https://github.com/elayadesign/ai-design-skills) | git clone --depth 1 후 필요한 스킬 폴더만 evenstay/.claude/skills로 복사(cp -R) | 1 |
| [MengTo/Skills](https://github.com/MengTo/Skills) | git clone --depth 1 후 필요한 스킬 폴더만 evenstay/.claude/skills로 복사(cp -R) | 1 |
| [jakubkrehel/skills](https://github.com/jakubkrehel/skills) | git clone --depth 1 후 필요한 스킬 폴더만 evenstay/.claude/skills로 복사(cp -R) | 8 |
| [codeswithroh/tastemaker](https://github.com/codeswithroh/tastemaker) | git clone --depth 1 후 필요한 스킬 폴더만 evenstay/.claude/skills로 복사(cp -R) | 1 |
| [emilkowalski/skills](https://github.com/emilkowalski/skills) | git clone --depth 1 후 필요한 스킬 폴더만 evenstay/.claude/skills로 복사(cp -R) | 14 |
| [DaleSeo/korean-skills](https://github.com/DaleSeo/korean-skills) | 전역 ~/.claude/skills에 이미 설치돼 있었다. 허브가 복제해 설치본과 같은지만 확인 | 3 |

## 플러그인

| 이름 | 버전 | 마켓 |
| --- | --- | --- |
| humanize-korean | 2.3.2 | im-not-ai |
| ponytail | 5.3.3 | ponytail |
| anthropic-skills |  |  |

## MCP와 연결

| 서버 | 하는 일 | 호출 |
| --- | --- | --- |
| ccd_turn | 작업 목록과 마무리 표시 | 1561 |
| Claude_Browser | 내장 브라우저 창(미리보기 서버 시작, 화면 확인) | 149 |
| ccd_session_mgmt | 세션 목록·조회·메시지 보내기 | 112 |
| ccd_session | 세션 시작과 장 표시(허브가 단계 세션을 여는 데 씀) | 33 |
| claude-in-chrome | Chrome 확장 | 4 |
| a343fe1a-0efe-4725-adf6-f16d0507dbb8 | 이름만 기록에 있음 | 4 |
| ccd_directory | 작업 폴더 변경 | 2 |

## 개발과 시험 도구

| 이름 | 하는 일 | 사용 |
| --- | --- | --- |
| puppeteer-core | 화면 방문 시험과 캡처(헤드리스 Chrome 제어) | 252 |
| @google/design.md | DESIGN.md 린트와 토큰 내보내기 | 50 |
| hallmark sloplint | hallmark 화면 점검 스크립트(sloplint) | 240 |
| @tailwindcss/cli | Tailwind v4 컴파일 확인(shadcn 변수 매핑) | 4 |
| headless Chrome | 헤드리스 Chrome 캡처 | 30 |
| ffmpeg / ffprobe | 영상 소리 트랙 제거, 첫 장면 추출, 정보 확인 | 68 |
| cwebp | WebP 변환 | 14 |
| sips | 이미지 변환·크기 확인(macOS) | 53 |
| acorn | JS 구문 분석(문구 추출 도구) | 4 |
| lucide-static | Lucide 아이콘 가져오기 | 11 |
| higgsfield CLI | Higgsfield 영상 생성·크레딧 확인 | 38 |
| node 시험 스크립트 | 프로토타입 시험 스크립트 | 159 |
| python3 http.server | 프로토타입 로컬 서버 | 28 |

## 화면 라이브러리와 글꼴

| 이름 | 하는 일 |
| --- | --- |
| marked 15.0.12 | 문서 페이지에서 마크다운을 HTML로 바꿈(홈 생성기) |
| Tailwind CSS v4 + shadcn/ui 변수  | DESIGN.md에서 `@google/design.md export`로 만든 토큰을 Tailwind v4 @theme과 shadcn 변수에 연결. 앱 화면은 빌드 없는 HTML·CSS·JS |
| Lucide 아이콘  | 앱 화면 아이콘(이모지 없음) |
| mermaid  | 문서 페이지 흐름도(MIT) |
| Pretendard (Variable, woff2) | github.com/orioncactus/pretendard 릴리스 v1.3.9 (명령에 적힌 주소) |
