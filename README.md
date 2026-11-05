<p align="center">
  <a href="https://roadkwonai.github.io/evenstay-web/"><img src="docs/assets/brand/banner.svg" alt="Evenstay, 시니어 레지던스 운영 플랫폼 프로토타입" width="900"></a>
</p>

<a id="evenstay"></a>
<h1 align="center">Evenstay</h1>

<p align="center"><strong>소유주가 다른 여러 시니어 레지던스의 계약과 청구를 한 기준으로 처리하는 운영 플랫폼을 설계했습니다.</strong></p>
<p align="center">기획서 · PRD · 화면 정의서 · 아키텍처 · 클릭형 프로토타입 · 소개 사이트 · 제작 이력</p>

<p align="center">
  <a href="https://roadkwonai.github.io/evenstay-web/"><img src="https://img.shields.io/badge/demo-GitHub%20Pages-2340A0?style=flat-square" alt="GitHub Pages 데모"></a>
  <a href="https://roadkwonai.github.io/evenstay-web/home/screens.html"><img src="https://img.shields.io/badge/screens-76-17191C?style=flat-square" alt="화면 페이지 76개"></a>
  <a href="https://roadkwonai.github.io/evenstay-web/home/roles.html"><img src="https://img.shields.io/badge/accounts-22-17191C?style=flat-square" alt="계정 22개"></a>
  <a href="#modules"><img src="https://img.shields.io/badge/modules-7-17191C?style=flat-square" alt="서비스 7개"></a>
  <a href="docs/README.md"><img src="https://img.shields.io/badge/docs-Korean-17191C?style=flat-square" alt="한국어 문서"></a>
  <a href="docs/history/README.md"><img src="https://img.shields.io/badge/prompts-814-17191C?style=flat-square" alt="프롬프트 기록 814건"></a>
</p>

<p align="center">
  <a href="https://roadkwonai.github.io/evenstay-web/">통합 웹</a> · <a href="https://roadkwonai.github.io/evenstay-web/app.html">프로토타입</a> · <a href="https://roadkwonai.github.io/evenstay-web/site/index.html">소개 사이트</a> · <a href="docs/README.md">문서 지도</a> · <a href="docs/history/README.md">제작 이력</a>
</p>

> [!IMPORTANT]
> 실제로 운영하는 서비스가 아닙니다. 이름, 사업장, 금액은 모두 가상이고 실제 고객, 매출, 효과 수치는 없습니다. MVP는 만들지 않았습니다. 결과물은 문서와 클릭형 프로토타입이며, 결제와 문자는 시연 기록만 남기고 실제로 일어나지 않습니다.

<details>
<summary><strong>목차 펼치기</strong></summary>

## 목차

- [바로 보기](#toc-1)
- [어떤 문제를 푸는가](#toc-2)
- [서비스 구성](#modules)
- [문서](#toc-4)
- [제작 이력](#toc-5)
- [아키텍처 제안](#toc-6)
- [저장소 구조](#toc-7)

</details>

---

<a id="toc-1"></a>

## 바로 보기

| 보고 싶은 것 | 열 곳 |
| --- | --- |
| 전체를 한곳에서 | [통합 웹](https://roadkwonai.github.io/evenstay-web/) |
| 입주자 화면 | [이은숙 입주자로 열기](https://roadkwonai.github.io/evenstay-web/app.html?as=m.eunsook&go=COM-07) |
| 권한마다 달라지는 화면 | [권한별 화면](https://roadkwonai.github.io/evenstay-web/home/roles.html) |
| 화면 76개 찾아보기 | [화면 찾아보기](https://roadkwonai.github.io/evenstay-web/home/screens.html) |
| 가상 시설 소개 | [소개 사이트](https://roadkwonai.github.io/evenstay-web/site/index.html) |
| 구조와 흐름 도식 | [아키텍처](https://roadkwonai.github.io/evenstay-web/home/architecture.html) |
| 프롬프트와 스킬 기록 | [제작 히스토리](https://roadkwonai.github.io/evenstay-web/home/history.html) |

<table>
  <tr>
    <td width="50%"><a href="https://roadkwonai.github.io/evenstay-web/"><img src="docs/assets/screens/home.png" alt="통합 웹 첫 화면"></a></td>
    <td width="50%"><a href="https://roadkwonai.github.io/evenstay-web/home/roles.html"><img src="docs/assets/screens/roles.png" alt="권한별 화면"></a></td>
  </tr>
  <tr>
    <td align="center">통합 웹</td>
    <td align="center">권한별 화면</td>
  </tr>
  <tr>
    <td width="50%"><a href="https://roadkwonai.github.io/evenstay-web/site/index.html"><img src="docs/assets/screens/site.png" alt="가상 시설 소개 사이트"></a></td>
    <td width="50%"><a href="https://roadkwonai.github.io/evenstay-web/home/docs.html"><img src="docs/assets/screens/docs.png" alt="웹에서 읽는 문서"></a></td>
  </tr>
  <tr>
    <td align="center">소개 사이트</td>
    <td align="center">문서</td>
  </tr>
</table>

> [!TIP]
> 처음이라면 [서비스 개관](docs/overview/project.md)을 읽고 이은숙 입주자의 이번 달 청구서를 눌러 보세요. 위쪽 막대에서 권한을 바꾸면 같은 청구가 직원이나 보호자에게 어떻게 보이는지 확인할 수 있습니다.

<a id="toc-2"></a>

## 어떤 문제를 푸는가

시니어 레지던스와 임대주택을 소유주 대신 운영하는 회사는 사업장마다 요금, 식사 감면, 계약 승계 규칙이 달라 같은 방식으로 일하기 어렵습니다. 입주자와 보호자는 이번 달 금액이 왜 이만큼인지 확인하기 어렵습니다.

| 설계 원칙 | 내용 |
| --- | --- |
| 근거 있는 숫자 | 청구 항목마다 금액이 나온 이유를 쉬운 말로 보여 줍니다 |
| 바뀐 것은 모두 남기기 | 지난 기록은 고치지 않고 덧붙입니다 |
| 보이는 범위는 입주자가 결정 | 보호자가 보는 소식은 항목마다 입주자가 허락해야 열립니다 |
| 사람이 판단 | 시스템은 사실과 근거만 보여 주고 의료, 금전, 계약의 판단은 사람이 합니다 |
| 여러 사업장을 같은 방식으로 | 요금과 감면 규칙을 코드가 아니라 사업장 설정으로 둡니다 |

<a id="modules"></a>

## 서비스 구성

```mermaid
flowchart TB
  subgraph U["쓰는 사람"]
    H["Evenstay 홈 (입주자, 대리인)"]
    F["Evenstay 패밀리 (보호자)"]
    S["Evenstay (본사, 직원, 소유주)"]
  end
  subgraph M["모듈"]
    A["안심"]
    B["보호자"]
    C["비서"]
    D["생활 지원 단계"]
    E["생활 요청"]
    G["커뮤니티"]
  end
  U --> M
  M --> K["코어 (계약, 청구)"]
```

| 모듈 | PRD | 기술 설계 | 사용자 스토리 |
| --- | --- | --- | --- |
| 코어(계약, 청구) | [PRD](docs/planning/core/prd.md) | [설계](docs/planning/core/tech-design.md) | [스토리](docs/planning/core/user-stories.md) |
| 안심 | [PRD](docs/planning/safety/prd.md) | [설계](docs/planning/safety/tech-design.md) | [스토리](docs/planning/safety/user-stories.md) |
| 보호자 | [PRD](docs/planning/family/prd.md) | [설계](docs/planning/family/tech-design.md) | [스토리](docs/planning/family/user-stories.md) |
| 비서 | [PRD](docs/planning/assistant/prd.md) | [설계](docs/planning/assistant/tech-design.md) | [스토리](docs/planning/assistant/user-stories.md) |
| 생활 지원 단계 | [PRD](docs/planning/transitions/prd.md) | [설계](docs/planning/transitions/tech-design.md) | [스토리](docs/planning/transitions/user-stories.md) |
| 생활 요청 | [PRD](docs/planning/requests/prd.md) | [설계](docs/planning/requests/tech-design.md) | [스토리](docs/planning/requests/user-stories.md) |
| 커뮤니티 | [PRD](docs/planning/community/prd.md) | [설계](docs/planning/community/tech-design.md) | [스토리](docs/planning/community/user-stories.md) |

<a id="toc-4"></a>

## 문서

[전체 문서 지도 →](docs/README.md)

| 목적 | 바로가기 |
| --- | --- |
| 전체 그림 | [서비스 개관](docs/overview/project.md) · [용어집](docs/overview/glossary.md) |
| 기획서 | [코어 전략](docs/planning/core/strategy.md) · [서비스 블루프린트](docs/planning/core/service-blueprint.md) · [로드맵](docs/planning/core/roadmap.md) · [개발 인계](docs/planning/core/handoff.md) |
| 화면 정의서 | [MVP 화면 정의서](docs/screens/mvp-screens.md) |
| 디자인 | [디자인 시스템](docs/design/DESIGN.md) |
| 아키텍처 | [구성안 비교](docs/architecture/architecture-options.md) · [기술 지형](docs/architecture/architecture-landscape.md) · [단계별 확장](docs/architecture/architecture-staged.md) · [사전 부검](docs/architecture/reviews/pre-mortem.md) |
| 조사 | [경쟁 지형](docs/research/competitive-landscape.md) · [PMS 지형](docs/research/pms-landscape.md) · [페르소나](docs/research/personas.md) · [JTBD](docs/research/jtbd.md) · [문제 은행](docs/research/problem-bank.md) |
| 아이디어 평가 | [숏리스트](docs/research/ideation/shortlist.md) · [평가표](docs/research/ideation/scorecard.md) |
| 결정 기록 | [결정 기록](docs/decisions/decisions.md) |

<a id="toc-5"></a>

## 제작 이력

기획부터 프로토타입까지 Claude Code로 진행했습니다. 프롬프트 원문, 스킬 호출, 설치한 도구, 이미지 생성 기록을 공개합니다. 2026-11-02 21:39부터 2026-11-04 21:59까지(KST)의 세션 기록이며 이후 작업은 들어 있지 않습니다.

| 기록 | 규모 | 문서 | 웹 |
| --- | --- | --- | --- |
| 프롬프트 | 814건(사용자 255, 허브 지시 372, 에이전트 지시 187) | [단계별 기록](docs/history/README.md) | [보기](https://roadkwonai.github.io/evenstay-web/home/history-prompts.html) |
| 스킬 | 호출 770회, 50종 | [사용 이력](docs/history/skills.md) | [보기](https://roadkwonai.github.io/evenstay-web/home/history-skills.html) |
| 설치와 도구 | 스킬 저장소 12곳 | [설치한 것](docs/history/tools.md) | [보기](https://roadkwonai.github.io/evenstay-web/home/history-installed.html) |
| 이미지와 영상 | 81개 | [생성 기록](docs/history/media.md) | [보기](https://roadkwonai.github.io/evenstay-web/home/history-media.html) |

<details>
<summary><strong>진행 단계 펼치기</strong></summary>

```mermaid
flowchart LR
  A[리서치] --> B[아이디어 평가]
  B --> C[카피]
  C --> D[기획]
  D --> E[디자인]
  E --> F[프로토타입]
  F --> G[검수]
```

</details>

<a id="toc-6"></a>

## 아키텍처 제안

구현하지 않은 제안입니다. 근거와 비교는 [단계별 확장](docs/architecture/architecture-staged.md)에 있습니다.

| 단계 | 구성 |
| --- | --- |
| 1단계 | Next.js, Spring Boot 모듈형 모놀리스, PostgreSQL 하나, AWS 서울, Bedrock 직접 호출 |
| 2단계 | FastAPI AI 서비스, Valkey, Taskiq |
| 3단계 | EKS, AI Gateway, 데이터 파이프라인 |

프로토타입은 빌드 없는 HTML, CSS, JavaScript(ES 모듈)이고 상태는 브라우저에만 저장합니다. 서버와 데이터베이스는 없습니다.

<a id="toc-7"></a>

## 저장소 구조

```text
evenstay-web/
├── docs/                 # 문서
│   ├── overview/         # 서비스 개관, 용어집
│   ├── planning/         # 모듈 7개의 전략, PRD, 스토리, 기술 설계, 로드맵, 인계, 문구
│   ├── screens/          # 화면 정의서
│   ├── design/           # 디자인 시스템
│   ├── architecture/     # 구성안, 확장 단계, 검토
│   ├── research/         # 조사, 아이디어 평가
│   ├── decisions/        # 결정 기록
│   └── history/          # 프롬프트, 스킬, 도구, 생성물 기록
├── web/                  # GitHub Pages로 배포하는 정적 사이트
│   ├── index.html        # 통합 웹
│   ├── app.html          # 프로토타입
│   ├── home/             # 문서, 아키텍처, 아트보드, 제작 히스토리
│   └── site/             # 소개 사이트
└── .github/workflows/    # Pages 배포
```

로컬에서 보려면 정적 서버로 `web`을 엽니다.

```bash
python3 -m http.server 4173 --directory web
```

> [!NOTE]
> 문서의 일부 내부 링크는 비공개 작업 폴더를 가리켜서 글자로만 남겼습니다. 공개본에서 지원 회사 이름은 `[지원 회사]`로 가렸습니다.
