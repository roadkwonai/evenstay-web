# archify 도식 5장 (arch-system, arch-signal, arch-payment, arch-agent, arch-doc)

작성: 2026-11-05. 내용 원본은 `../brief.md`와 `senior-lab/01-research/outputs/senior-housing-architecture-design.md`.

## 다시 만드는 명령
```
bash design/home/architecture/archify/build.sh
```
- 프로젝트의 `.agents/skills/archify`를 임시 폴더로 복사하고 `patch-template.py`로 색 토큰, Pretendard, 밝은 화면 기본값을 입힌 뒤 다섯 도식을 `finalize`(검증, 전달, 구조 검사, 브라우저 검사)로 만든다. 원본 스킬 폴더는 고치지 않는다.
- 결과: `design/prototype/home/architecture/<id>.html`, `<id>.png`(폭 2100px). 검사 영수증은 `<id>/evidence/`.
- Chrome이 있어야 한다(`/Applications/Google Chrome.app`).

## 문구를 고치는 곳
| 고칠 것 | 파일 |
|---|---|
| 도식 안의 글, 위치, 연결 | `<id>/candidate.json` |
| 화면 단추, 범례, 안내의 한국어 | `ko-translations.json` (`build.sh`가 각 `candidate.json`의 `meta.translations`에 다시 채운다) |
| 색, 글꼴, 강조(#F3D766)를 칠할 단계 | `patch-template.py` |
