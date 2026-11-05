#!/usr/bin/env python3
"""Evenstay 인프라 도식 5장의 초안(draft.html) 생성기.

내용(문구, 좌표)은 이 파일의 d_* 함수에 있다. 실행하면 <id>/draft.html 을 쓴다.
아이콘과 글꼴 끼우기, 렌더는 build.sh 가 한다.
"""
import json, pathlib, sys

HERE = pathlib.Path(__file__).resolve().parent
MANIFEST = json.load(open(HERE / "icons" / "manifest.json"))
SRC_NAMES = {
    "aws": "AWS Architecture Icons", "gcp": "Google Cloud product icons",
    "svgl": "svgl", "devicon": "devicon", "gilbarbara": "gilbarbara/logos",
    "lucide": "Lucide", "explicit": "각 프로젝트 공식 저장소·사이트",
}

CSS = """
:root{
  color-scheme: light;
  --paper:#FAFAF7; --surface:#FEFEFC; --surface-2:#F4F4F0; --rule:#D2D4CE; --grid:#ECECE6;
  --ink:#24272A; --ink-2:#555A60; --accent:#2340A0; --accent-tint:#E8EDF8; --hl:#F3D766;
  --ok:#1E7A46; --warn:#9A5B00;
  --font:"Pretendard Variable","Pretendard","Apple SD Gothic Neo","Noto Sans KR",system-ui,sans-serif;
  --veil: rgba(250,250,247,.82);
}
@font-face{font-family:"Pretendard Variable";font-style:normal;font-weight:45 920;font-display:block;
  src:url("../../assets/fonts/PretendardVariable.woff2") format("woff2-variations");}
*{margin:0;padding:0;box-sizing:border-box}
html,body{overflow-x:clip}
body{background:var(--paper);color:var(--ink);font-family:var(--font);padding:40px 24px 48px;-webkit-font-smoothing:antialiased}
.page{width:fit-content;max-width:100%;margin:0 auto}
.head{display:grid;grid-template-columns:1fr auto;gap:24px;align-items:end;padding-bottom:16px;border-bottom:1px solid var(--rule);margin-bottom:24px}
.kicker{font-size:12px;font-weight:600;color:var(--accent);margin-bottom:8px;letter-spacing:.02em;display:flex;gap:10px;align-items:center}
.chip{background:var(--accent-tint);color:var(--accent);border-radius:999px;padding:2px 10px;font-size:11px;font-weight:700}
h1{font-weight:800;font-size:28px;letter-spacing:-.01em;line-height:1.25}
.lede{max-width:420px;font-size:13px;line-height:1.7;color:var(--ink-2)}
.scroller{overflow-x:auto;border:1px solid var(--rule);border-radius:10px}
.canvas{position:relative;background:var(--paper);
  background-image:linear-gradient(var(--grid) 1px,transparent 1px),linear-gradient(90deg,var(--grid) 1px,transparent 1px);
  background-size:24px 24px;background-position:-1px -1px}
.stamp{position:absolute;top:12px;right:16px;font-size:12px;font-weight:600;color:var(--ink-2);
  border:1px dashed var(--ink-2);border-radius:6px;padding:3px 10px;background:var(--surface);z-index:3}
.hl{background:var(--hl);color:var(--ink);border-radius:3px;padding:0 4px;font-weight:700}

.group{position:absolute;border-radius:10px}
.g-label{position:absolute;top:12px;left:12px;display:flex;align-items:center;gap:6px;
  font-size:12.5px;font-weight:700;color:var(--ink-2);white-space:nowrap}
.g-label img{width:16px;height:16px}
.group.aws{border:1.5px solid var(--ink);border-radius:0}
.group.aws>.g-label{top:-1.5px;left:-1.5px;gap:8px;color:var(--ink)}
.group.aws>.g-label img{width:30px;height:30px}
.group.aws.region{border:1.5px dashed var(--ink-2)}
.group.aws.region>.g-label{top:10px;left:14px;font-size:12.5px;color:var(--ink)}
.group.cluster{border:1.5px solid var(--rule);background:rgba(244,244,240,.75)}
.group.aws.cluster{border-radius:0}
.group.aws.plain>.g-label{top:12px;left:12px}
.group.gcp{border:1.5px solid var(--ink);border-radius:6px}
.group.gcp>.g-label{gap:8px;color:var(--ink)}
.group.gcp>.g-label img{width:22px;height:22px}
.group.ext{border:1.5px solid var(--rule);background:var(--surface)}
.group.signal{border:1.5px dashed var(--accent);background:rgba(232,237,248,.55)}
.group.signal>.g-label{color:var(--accent)}

.node{position:absolute;width:132px;text-align:center}
.tile{width:60px;height:60px;margin:0 auto;border-radius:12px;background:var(--surface);border:1px solid var(--rule);
  display:grid;place-items:center;box-shadow:0 1px 2px rgba(36,39,42,.06)}
.tile img{width:34px;height:34px;object-fit:contain}
.tile.dark{background:var(--ink);border-color:var(--ink)}
.tile.bare{background:none;border:none;box-shadow:none}
.tile.bare img{width:60px;height:60px}
.tile.ghost{border-style:dashed}
.node .name{font-weight:700;font-size:13px;margin-top:8px;line-height:1.3}
.node .role{font-size:10.5px;color:var(--ink-2);margin-top:2px;line-height:1.35}
.node .name span,.node .role span{background:var(--veil);padding:0 4px;border-radius:3px;
  -webkit-box-decoration-break:clone;box-decoration-break:clone}
.node .role span.hl{background:var(--hl)}

svg.edges{position:absolute;inset:0;pointer-events:none}
.e{stroke:var(--accent);stroke-width:1.8;fill:none}
.n{stroke:var(--ink-2);stroke-width:1.4;fill:none}
path.aws{stroke:var(--ink);stroke-width:1.5;fill:none}
.dash{stroke-dasharray:4 5}
.sig{stroke:var(--accent);stroke-width:1.5;fill:none;stroke-dasharray:4 5}
.el{font-family:var(--font);font-size:11px;font-weight:600;fill:var(--ink-2);paint-order:stroke;stroke:var(--paper);stroke-width:4px;stroke-linejoin:round}
.el.a{fill:var(--accent)}

.legend{display:flex;gap:24px;align-items:center;margin-top:16px;font-size:11.5px;color:var(--ink-2);flex-wrap:wrap}
.legend .sw{display:inline-block;width:30px;vertical-align:middle;margin-right:6px;border-top:1.8px solid var(--accent)}
.legend .sw.n{border-color:var(--ink-2);border-top-width:1.4px}
.legend .sw.k{border-color:var(--ink);border-top-width:1.5px}
.legend .sw.dash{border-top-style:dashed}
.legend .sw.sig{border-color:var(--accent);border-top-style:dashed;border-top-width:1.5px}
.foot{margin-top:32px;padding-top:16px;border-top:1px solid var(--rule);display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;font-size:11px;color:var(--ink-2)}
.foot a{color:inherit;text-decoration-color:var(--rule);text-underline-offset:2px}
"""

DEFS = """<defs>
<marker id="ar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="context-stroke"/></marker>
<marker id="open" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse"><path d="M1 1 L9 5 L1 9" fill="none" stroke="context-stroke" stroke-width="1.5"/></marker>
</defs>"""


class D:
    """도식 하나. 좌표는 캔버스 기준 px."""

    def __init__(s, w, h):
        s.w, s.h = w, h
        s.groups, s.edges, s.nodes, s.icons = [], [], [], set()

    def ico(s, name, cls=""):
        s.icons.add(name)
        c = f' class="{cls}"' if cls else ""
        return f'<img{c} src="%%ICON_{name}%%" alt="">'

    def group(s, l, t, w, h, cls, label, icon=None):
        im = s.ico(icon) if icon else ""
        s.groups.append(f'<div class="group {cls}" style="left:{l}px;top:{t}px;width:{w}px;height:{h}px">'
                        f'<div class="g-label">{im}{label}</div></div>')

    def node(s, cx, top, icon, name, role, tile="", w=132):
        left = cx - w // 2
        s.nodes.append(
            f'<div class="node" style="left:{left}px;top:{top}px;width:{w}px">'
            f'<div class="tile {tile}">{s.ico(icon)}</div>'
            f'<div class="name"><span>{name}</span></div><div class="role"><span>{role}</span></div></div>')

    # 선: kind = e(주 흐름, 파랑) n(회색) nd(회색 점선) aws(AWS 안, 열린 화살표) awsd sig(신호 점선)
    def path(s, d, kind="n", end=True, start=False):
        cls = {"e": "e", "n": "n", "nd": "n dash", "aws": "aws", "awsd": "aws dash", "sig": "sig"}[kind]
        mk = "open" if kind.startswith("aws") else "ar"
        m = f' marker-end="url(#{mk})"' if end else ""
        if start:
            m += f' marker-start="url(#{mk})"'
        s.edges.append(f'<path class="{cls}" d="{d}"{m}/>')

    def label(s, x, y, text, accent=False, anchor="middle"):
        s.edges.append(f'<text class="el{" a" if accent else ""}" x="{x}" y="{y}" text-anchor="{anchor}">{text}</text>')

    def html(s, title, kicker_chip, lede, legend, foot_left):
        used = sorted({MANIFEST[i]["source"] for i in s.icons if i in MANIFEST} - {"explicit"})
        srcs = [SRC_NAMES[u] for u in used] + (["각 프로젝트 공식 저장소·사이트"] if any(
            MANIFEST.get(i, {}).get("source") == "explicit" for i in s.icons) else [])
        leg = "".join(f'<span><span class="sw {c}"></span>{t}</span>' for c, t in legend)
        return f"""<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title}</title>
<style>{CSS}</style>
</head>
<body>
<div class="page">
  <header class="head">
    <div>
      <div class="kicker">Evenstay 인프라 도식 <span class="chip">{kicker_chip}</span></div>
      <h1>{title}</h1>
    </div>
    <p class="lede">{lede}</p>
  </header>
  <div class="scroller">
  <div class="canvas" style="width:{s.w}px;height:{s.h}px">
    <div class="stamp">설계안, 구현 아님</div>
    {chr(10).join(s.groups)}
    <svg class="edges" width="{s.w}" height="{s.h}" viewBox="0 0 {s.w} {s.h}" aria-hidden="true">
      {DEFS}
      {chr(10).join(s.edges)}
    </svg>
    {chr(10).join(s.nodes)}
  </div>
  </div>
  <div class="legend">{leg}</div>
  <div class="foot">
    <span>{foot_left}</span>
    <span>아이콘: {" / ".join(srcs)}. 로고는 각 소유자의 상표 · made with <a href="https://github.com/caru-ini/stack-diagram" target="_blank" rel="noopener">stack-diagram</a></span>
  </div>
</div>
</body>
</html>
"""


FOOT = "Evenstay 설계안, 구현 아님. 내용 원본은 시니어 하우징 아키텍처 설계안(2026-11-05)"
HL = lambda t: f'<span class="hl">{t}</span>'


# ---------------------------------------------------------------- stack-a1
def a1():
    d = D(1240, 870)
    d.group(190, 50, 1016, 786, "aws", "AWS Cloud", "aws")
    d.group(214, 98, 966, 712, "aws region", "서울 리전")
    d.group(400, 140, 520, 210, "aws cluster", "Amazon ECS", "ecs")
    d.group(400, 570, 520, 210, "aws cluster plain", "공통 서비스")
    # 밖
    d.node(100, 200, "browser", "브라우저", "직원, 보호자, 입주자")
    d.node(100, 330, "webhook", "업체 웹훅", "외부 업체")
    d.node(100, 470, "githubactions", "GitHub Actions", "배포")
    # AWS 안
    d.node(310, 200, "alb", "Elastic Load Balancing", "ALB, HTTP 진입", "bare", 152)
    d.node(490, 200, "nextjs", "Next.js 16.4.1+", "화면, 1개")
    d.node(660, 200, "worker", "작업자", "Spring Boot 이미지, 1개")
    d.node(830, 200, "spring", "Spring Boot 4.1", "업무 API, 1개")
    d.node(1060, 200, "bedrock", "Amazon Bedrock", "서울, 녹화 응답이 기본", "bare", 152)
    d.node(745, 430, "rds", "Amazon RDS", f"PostgreSQL 18, {HL('Single-AZ')}", "bare", 180)
    d.node(490, 630, "s3", "Amazon S3", "객체 저장소", "bare")
    d.node(660, 630, "secrets", "AWS Secrets Manager", "비밀값", "bare", 152)
    d.node(830, 630, "cloudwatch", "Amazon CloudWatch", "관측", "bare", 152)
    # 선
    d.path("M134 230 H276", "e"); d.label(162, 222, "HTTPS", True)
    d.path("M134 360 H310 V310", "n"); d.label(162, 352, "웹훅")
    d.path("M134 500 H410 V354", "nd"); d.label(272, 492, "배포")
    d.path("M344 230 H456", "aws")
    d.path("M310 196 V180 H830 V196", "aws")
    d.path("M864 230 H1026", "sig"); d.label(945, 222, "테스트할 때만")
    d.path("M660 306 V390 H745 V426", "aws")
    d.path("M830 306 V390 H745", "aws", end=False)
    d.path("M880 354 V566", "aws")
    return d.html("A안 1단계: 핵심 업무 구축 (AWS 서울)", "1단계",
                  "컨테이너 3개와 DB 하나로 계약, 청구, 권한, 원장을 먼저 만든다. 가상 데이터만 쓴다. DB와 작업자는 프라이빗 서브넷에 두고 NAT로 나간다. 월 고정비는 약 $261(계산값)이다.",
                  [("", "밖에서 들어오는 요청"), ("n", "업체 웹훅"), ("n dash", "배포"), ("k", "AWS 안 호출"), ("sig", "가상 데이터로 테스트할 때만")], FOOT), d


# ---------------------------------------------------------------- stack-a2 (a5가 같은 바탕을 쓴다)
def a2_base(d):
    d.group(230, 50, 1100, 786, "aws", "AWS Cloud", "aws")
    d.group(254, 98, 1052, 712, "aws region", "서울 리전")
    d.group(440, 140, 690, 210, "aws cluster", "Amazon ECS", "ecs")
    d.group(440, 570, 690, 210, "aws cluster plain", "공통 서비스")
    d.group(1375, 140, 180, 490, "ext", "외부 시스템")
    d.group(20, 425, 180, 175, "ext", "건물 안")
    # 밖
    d.node(110, 59, "canary", "외부 상태 점검", "URL, 하트비트 확인")
    d.node(110, 200, "browser", "브라우저", "직원, 보호자, 입주자")
    d.node(110, 320, "webhook", "결제 웹훅", "CMS·PG 결과")
    d.node(110, 470, "adapter", "현장 어댑터", "서명, 버퍼, 하트비트")
    d.node(110, 640, "opentofu", "OpenTofu", "IaC")
    d.node(1465, 200, "card", "CMS·PG", "어댑터, 자동이체와 결제")
    d.node(1465, 340, "erp", "ERP", "어댑터, 원장 내보내기")
    d.node(1465, 480, "bell", "알림톡 외", "전자서명, 본인확인, 출입")
    # AWS 안
    d.node(360, 200, "alb", "Elastic Load Balancing", "ALB", "bare", 152)
    d.node(530, 200, "nextjs", "Next.js 16.4.1+", "화면, 2개")
    d.node(700, 200, "worker", "작업자", "Spring Boot 이미지, 2개")
    d.node(870, 200, "spring", "Spring Boot 4.1", "업무 API, 2개")
    d.node(1040, 200, "fastapi", "FastAPI", "AI 서비스, 3단계")
    d.node(1210, 200, "bedrock", "Amazon Bedrock", "서울, 모델 호출", "bare", 152)
    d.node(615, 430, "sqs", "Amazon SQS", "큐, 외부 전달이 늘면", "bare")
    d.node(785, 430, "rds", "Amazon RDS", f"PostgreSQL 18, {HL('Multi-AZ')}", "bare", 180)
    d.node(955, 430, "postgresql", "pgvector", "문서 검색, 3단계")
    d.node(1125, 430, "elasticache", "Amazon ElastiCache", "Valkey 공유 캐시", "bare", 152)
    d.node(530, 630, "s3", "Amazon S3", "객체 저장소", "bare")
    d.node(700, 630, "kms", "AWS KMS", "봉투 암호화", "bare")
    d.node(870, 630, "opentelemetry", "OpenTelemetry", "추적", "")
    d.node(1040, 630, "cloudwatch", "Amazon CloudWatch", "관측", "bare", 152)
    # 선: 밖
    d.path("M144 230 H326", "e"); d.label(192, 222, "HTTPS", True)
    d.path("M144 500 H360 V310", "n"); d.label(305, 492, "서명한 신호"); d.path("M144 350 H340 V310", "n"); d.label(240, 342, "웹훅")
    d.path("M144 89 H340 V196", "nd"); d.label(187, 81, "외부 점검")
    d.path("M144 670 H226", "nd"); d.label(185, 662, "배포")
    d.path("M700 196 V150 H1371", "n"); d.label(1200, 142, "어댑터, NAT 고정 IP")
    # 선: AWS 안
    d.path("M394 230 H496", "aws")
    d.path("M380 196 V180 H870 V196", "aws")
    d.path("M904 230 H1006", "aws"); d.label(955, 222, "허용 필드만")
    d.path("M1074 230 H1176", "aws"); d.label(1125, 222, "모델 호출")
    d.path("M700 306 V360 H615 V426", "aws")
    d.path("M700 306 V390 H785 V426", "aws")
    d.path("M870 306 V390 H785", "aws", end=False)
    d.path("M819 460 H921", "aws"); d.label(870, 452, "확장")
    d.path("M1040 306 V390 H1125 V426", "aws")
    d.path("M470 350 V566", "aws")
    d.path("M904 660 H1006", "aws"); d.label(955, 652, "추적")


A2_LEG = [("", "밖에서 들어오는 요청"), ("n", "연동, 신호"), ("n dash", "배포, 외부 점검"), ("k", "AWS 안 호출")]


def a2():
    d = D(1600, 870)
    a2_base(d)
    return d.html("A안 2·3단계: 운영 전환과 문서 AI (AWS 서울)", "2·3단계",
                  "복구와 격리를 갖춘 운영 전환(2단계)에 문서 AI(3단계)를 더한다. 두 단계는 병행할 수 있고, 실제 입주자 데이터는 2단계 완료 기준을 채운 뒤에 쓴다.",
                  A2_LEG, FOOT), d


# ---------------------------------------------------------------- stack-a5
def a5():
    d = D(1690, 1180)
    d.group(230, 50, 1214, 1096, "aws", "AWS Cloud", "aws")
    d.group(254, 98, 1166, 1022, "aws region", "서울 리전")
    d.group(440, 140, 690, 210, "aws cluster", "Amazon ECS", "ecs")
    d.group(440, 570, 690, 210, "aws cluster plain", "공통 서비스")
    d.group(1470, 140, 180, 490, "ext", "외부 시스템")
    d.group(20, 425, 180, 175, "ext", "건물 안")
    d.group(290, 830, 760, 210, "signal", f"5단계 · {HL('도입 기준을 채울 때만')}")
    d.group(1080, 830, 310, 210, "signal", "4단계 · 도입 기준을 채울 때만")
    d.node(110, 59, "canary", "외부 상태 점검", "URL, 하트비트 확인")
    d.node(110, 200, "browser", "브라우저", "직원, 보호자, 입주자")
    d.node(110, 320, "webhook", "결제 웹훅", "CMS·PG 결과")
    d.node(110, 470, "adapter", "현장 어댑터", "서명, 버퍼, 하트비트")
    d.node(110, 640, "opentofu", "OpenTofu", "IaC")
    d.node(1560, 200, "card", "CMS·PG", "어댑터, 자동이체와 결제")
    d.node(1560, 340, "erp", "ERP", "어댑터, 원장 내보내기")
    d.node(1560, 480, "bell", "알림톡 외", "전자서명, 본인확인, 출입")
    d.node(360, 200, "alb", "Elastic Load Balancing", "ALB", "bare", 152)
    d.node(530, 200, "nextjs", "Next.js 16.4.1+", "화면, 2개")
    d.node(700, 200, "worker", "작업자", "Spring Boot 이미지, 2개")
    d.node(870, 200, "spring", "Spring Boot 4.1", "업무 API, 2개")
    d.node(1040, 200, "fastapi", "FastAPI", "AI 서비스")
    d.node(1310, 200, "bedrock", "Amazon Bedrock", "서울, 모델 호출", "bare", 152)
    d.node(615, 430, "sqs", "Amazon SQS", "큐, 외부 전달이 늘면", "bare")
    d.node(785, 430, "rds", "Amazon RDS", "PostgreSQL 18, Multi-AZ", "bare", 180)
    d.node(955, 430, "postgresql", "pgvector", "문서 검색")
    d.node(1125, 430, "elasticache", "Amazon ElastiCache", "Valkey 캐시", "bare", 152)
    d.node(530, 630, "s3", "Amazon S3", "객체 저장소", "bare")
    d.node(700, 630, "kms", "AWS KMS", "봉투 암호화", "bare")
    d.node(870, 630, "opentelemetry", "OpenTelemetry", "추적")
    d.node(1040, 630, "cloudwatch", "Amazon CloudWatch", "관측", "bare", 152)
    # 5단계
    d.node(370, 890, "eks", "Amazon EKS", "Auto Mode, 컨테이너 운영", "bare")
    d.node(520, 890, "dagster", "Dagster", "데이터 파이프라인")
    d.node(670, 890, "langfuse", "Langfuse", "AI 관측, 자체 호스팅")
    d.node(820, 890, "rds", "읽기 복제본", "RDS, 읽기 분산", "bare")
    d.node(970, 890, "opensearch", "Amazon OpenSearch", "검색 분리, Nori", "bare", 152)
    # 4단계
    d.node(1160, 890, "langgraph", "실행기", "LangGraph 또는 Spring AI")
    d.node(1310, 890, "litellm", "LiteLLM", "모델 접근, 버전 고정")
    # 선: 밖
    d.path("M144 230 H326", "e"); d.label(192, 222, "HTTPS", True)
    d.path("M144 500 H360 V310", "n"); d.label(305, 492, "서명한 신호"); d.path("M144 350 H340 V310", "n"); d.label(240, 342, "웹훅")
    d.path("M144 89 H340 V196", "nd"); d.label(187, 81, "외부 점검")
    d.path("M144 670 H226", "nd"); d.label(185, 662, "배포")
    d.path("M700 196 V150 H1466", "n"); d.label(1240, 142, "어댑터, NAT 고정 IP")
    # 선: AWS 안, 2·3단계
    d.path("M394 230 H496", "aws")
    d.path("M380 196 V180 H870 V196", "aws")
    d.path("M904 230 H1006", "aws"); d.label(955, 222, "허용 필드만")
    d.path("M1074 230 H1276", "aws"); d.label(1175, 222, "모델 호출")
    d.path("M700 306 V360 H615 V426", "aws")
    d.path("M700 306 V390 H785 V426", "aws")
    d.path("M870 306 V390 H785", "aws", end=False)
    d.path("M819 460 H921", "aws"); d.label(870, 452, "확장")
    d.path("M1040 306 V390 H1125 V426", "aws")
    d.path("M470 350 V566", "aws")
    d.path("M904 660 H1006", "aws"); d.label(955, 652, "추적")
    # 선: 도입 기준을 채울 때만
    d.path("M785 534 V826", "sig"); d.label(795, 608, "복제, 검색 분리", anchor="start")
    d.path("M1194 920 H1276", "sig"); d.label(1235, 912, "모델 호출")
    d.path("M1310 886 V306", "sig")
    return d.html("A안 4·5단계: 에이전트와 플랫폼 (도입 기준을 채울 때만)", "4·5단계",
                  "2·3단계 구성에 더하는 부분이다. 4단계의 기본은 DB 상태기계다. 점선 묶음은 설계안 8절의 도입 기준이 실제로 나타날 때만 더한다.",
                  [("", "밖에서 들어오는 요청"), ("n", "연동, 신호"), ("n dash", "배포, 외부 점검"), ("k", "AWS 안 호출"), ("sig", "도입 기준을 채울 때만")], FOOT), d


# ---------------------------------------------------------------- stack-b
def b():
    d = D(1240, 840)
    d.group(190, 50, 790, 756, "gcp", "Google Cloud", "gcp")
    d.group(250, 140, 690, 210, "cluster", "Cloud Run", "run")
    d.group(250, 540, 690, 210, "cluster", "공통 서비스")
    d.node(100, 200, "browser", "브라우저", "직원, 보호자, 입주자")
    d.node(1100, 200, "model", "승인된 모델 API", "어댑터를 거쳐 호출")
    d.node(340, 200, "nextjs", "Next.js 16.4.1+", "화면")
    d.node(510, 200, "nestjs", "API", f"NestJS 또는 Fastify, {HL('TypeScript 단일 언어')}")
    d.node(680, 200, "run", "Cloud Run 작업자", "Cloud Tasks가 호출")
    d.node(850, 200, "run", "Cloud Run Jobs", "배치")
    d.node(510, 430, "tasks", "Cloud Tasks", "큐")
    d.node(680, 430, "sql", "Cloud SQL", "PostgreSQL")
    d.node(340, 600, "storage", "Cloud Storage", "객체 저장소")
    d.node(510, 600, "secretmgr", "Secret Manager", "비밀값")
    d.node(680, 600, "logging", "Cloud Logging·Monitoring", "관측", "", 200)
    d.path("M134 230 H306", "e"); d.label(220, 222, "HTTPS", True)
    d.path("M374 230 H476", "e")
    d.path("M530 196 V160 H1100 V196", "n"); d.label(1030, 152, "모델 호출")
    d.path("M510 306 V426", "n")
    d.path("M545 460 H595 V230 H646", "n")
    d.path("M680 306 V426", "n")
    d.path("M510 306 V390 H680", "n", end=False)
    d.path("M850 306 V390 H680", "n", end=False)
    d.path("M340 354 V536", "n")
    return d.html("B안 TypeScript 단일 언어 (Google Cloud 구성)", "B안",
                  "화면과 API, 작업자를 모두 Cloud Run에 올린다. 모듈 경계, PostgreSQL 스키마, 아웃박스, 어댑터 포트는 A안과 같다.",
                  [("", "밖에서 들어오는 요청"), ("n", "내부 연결")], FOOT), d


# ---------------------------------------------------------------- stack-c
def c():
    d = D(1160, 830)
    d.group(240, 140, 180, 210, "cluster", "Vercel", "vercel")
    d.group(550, 140, 520, 210, "cluster", "Supabase 서울", "supabase")
    d.group(240, 570, 790, 210, "signal", HL("2단계 전에 A안이나 B안으로 옮긴다"))
    d.node(100, 200, "browser", "브라우저", "직원, 보호자, 입주자")
    d.node(330, 200, "nextjs", "Next.js 16.4.1+", "서울 icn1, 서버 코드")
    d.node(640, 200, "postgresql", "PostgreSQL", "데이터")
    d.node(810, 200, "supabase", "Supabase Auth", "인증")
    d.node(980, 200, "supabase", "Supabase Storage", "파일", "", 152)
    d.node(640, 430, "container", "컨테이너 작업자", "고정 송신 IP가 필요하면 여기", "", 152)
    d.node(980, 430, "model", "모델 API", "승인된 모델")
    d.node(480, 630, "aws", "A안", "AWS 서울, ECS와 RDS", "ghost")
    d.node(800, 630, "gcp", "B안", "TypeScript 단일 언어", "ghost")
    d.path("M134 230 H296", "e"); d.label(215, 222, "HTTPS", True)
    d.path("M364 230 H546", "n"); d.label(455, 222, "조회, 쓰기")
    d.path("M640 426 V306", "n")
    d.path("M674 460 H946", "n"); d.label(810, 452, "모델 호출")
    d.path("M330 354 V566", "sig")
    d.path("M560 354 V566", "sig")
    return d.html("C안 빠른 파일럿 (Vercel과 Supabase)", "C안",
                  "인증과 화면을 며칠 안에 사람에게 보여야 할 때 시작하는 안이다. 실제 입주자 데이터는 A안이나 B안으로 옮긴 뒤를 기본으로 둔다.",
                  [("", "밖에서 들어오는 요청"), ("n", "내부 연결"), ("sig", "이전 방법")], FOOT), d


if __name__ == "__main__":
    for name, fn in [("stack-a1", a1), ("stack-a2", a2), ("stack-a5", a5), ("stack-b", b), ("stack-c", c)]:
        html, d = fn()
        (HERE / name / "draft.html").write_text(html, encoding="utf-8")
        print("wrote", name, f"{d.w}x{d.h}", "icons:", len(d.icons))
