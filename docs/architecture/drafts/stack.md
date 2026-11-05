# stack-diagram 인프라 도식 5장

만든 도식: stack-a1, stack-a2, stack-a5, stack-b, stack-c. 내용 원본은 설계안(`senior-lab/01-research/outputs/senior-housing-architecture-design.md`)이고, 공통 규칙은 `../brief.md`다.

## 다시 만드는 명령
```
cd design/home/architecture/stack
./build.sh              # 5장 모두
./build.sh stack-b      # 한 장만
```
`build.sh`는 `make.py`로 `<id>/draft.html`을 쓰고, 스킬의 `build.py`(아이콘 끼우기)로 `design/prototype/home/architecture/<id>.html`을 만든 뒤, 헤드리스 Chrome으로 `<id>.png`(배율 2)를 렌더한다. Playwright와 스킬의 공개 공유 기능(`share.py`)은 쓰지 않는다.

## 문구와 배치를 고치는 곳
- 라벨, 좌표, 선: `make.py`의 `a1()`, `a2()`(a5와 바탕을 `a2_base()`로 공유), `a5()`, `b()`, `c()`. 노드는 `d.node(가운데 x, 위 y, 아이콘, 이름, 역할)`, 선은 `d.path(...)`.
- 색, 글꼴(Pretendard, 상대 경로 `../../assets/fonts/PretendardVariable.woff2`), 그룹 모양: `make.py` 위쪽의 `CSS`.
- 제목, 머리 글귀, 범례, 푸터: 각 함수 끝의 `d.html(...)` 인자.
- `<id>/draft.html`은 생성물이다. 직접 고치지 않는다.

## 아이콘
`icons/`에 모아 두었고 목록과 출처는 `icons/manifest.json`이다. 다시 받을 때는 스킬의 `scripts/fetch_icons.py icons ...`를 쓴다.
- LangGraph는 LangChain 상표를 쓴다(svgl에 LangGraph 단독 로고가 없다).
- OpenTofu(공식 brand-artifacts 파비콘 PNG), LiteLLM(공식 사이트 파비콘 PNG), Dagster(공식 저장소 마크)는 `name=URL`로 받았다.
- Cloud Tasks, Secret Manager, Cloud Logging·Monitoring은 Google이 정한 분류 아이콘이다.
- 추상 노드(브라우저, 업체 웹훅, 현장 어댑터, 외부 캐너리, 작업자, 모델 API, 컨테이너 작업자, CMS·PG, ERP, 알림톡)는 Lucide 그림이다.
