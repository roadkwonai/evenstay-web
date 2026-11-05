# dd 도식 (diagram-design)

문서에 넣는 도식 6장. 내용 원본은 `../brief.md`와 설계안(`senior-lab/01-research/outputs/senior-housing-architecture-design.md`). 설계안이고 구현이 아니다.

## 다시 만들기
```
cd design/home/architecture/dd
python3 build.py            # 6장 모두
python3 build.py dd-timing  # 한 장만
```
`prototype/home/architecture/<id>.html`과 `<id>.png`(2688px 폭, 배율 2)가 만들어진다. PNG는 시스템 Chrome 헤드리스로 렌더한다(Playwright 필요 없음). 글꼴은 `prototype/assets/fonts/PretendardVariable.woff2`를 상대 경로로 읽고 바깥 서버는 쓰지 않는다.

## 문구를 고칠 파일
| id | 유형 | 파일 | 고칠 곳 |
|---|---|---|---|
| dd-roadmap | 단계별 구성(타임라인형) | `dd-roadmap/diagram.py` | `STAGES`, `NOTES` |
| dd-choose | flowchart | `dd-choose/diagram.py` | `STEPS` |
| dd-modules | layers | `dd-modules/diagram.py` | `MODULES`, `RULES` |
| dd-timing | 표형 | `dd-timing/diagram.py` | `STAGES`, `ROWS`(칩의 두 번째 값이 `D`면 점선) |
| dd-ai-route | swimlane형 | `dd-ai-route/diagram.py` | `QUESTIONS`, `ROUTES` |
| dd-delivery | 표형(마일스톤 M1~M5 x 여덟 영역) | `dd-delivery/diagram.py` | `MILESTONES`, `TRACKS`(빈 칸은 `None`) |

제목, 부제, 접근성 설명은 각 파일 위쪽 `TITLE`, `SUBTITLE`, `DESC`. 색, 글꼴, 글자 폭 검사, 페이지 틀은 `lib.py`. 글자가 칸을 넘치면 빌드가 AssertionError로 멈춘다.

## 검사
`build.py`는 PNG를 만들기 전에 `diagram-design` 자체 검사를 실행한다. 프로젝트 로컬 복사본에 `--local-font` 검사를 추가해 지정된 로컬 WOFF2 파일만 `@font-face`에서 허용한다. 지정이 없으면 원래처럼 모든 외부 CSS URL을 거부한다. 지정 파일의 경로·심볼릭 링크·확장자·WOFF2 서명도 검사한다. 이는 업스트림 스킬의 기능이 아니라 Evenstay의 로컬 수정이다.

```bash
python3 test_local_font.py  # 로컬 글꼴 허용과 잘못된 경로 거부 회귀 검사
```
