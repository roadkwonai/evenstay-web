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
`python3 .agents/skills/diagram-design/scripts/self_check.py <html>`은 로컬 글꼴 `url()`만 "non-fragment CSS url()"로 실패한다. 지시서가 로컬 Pretendard를 요구하므로 의도한 결과다. 나머지 항목은 통과한다.
