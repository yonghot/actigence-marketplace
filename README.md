# ACTIGENCE Marketplace

> ACTIGENCE 공익 데이터 분석 plugin marketplace — 한국 사회 문제 도메인의 비변호사 운영 컴플라이언스 안전 도구

[![Compliance Check](https://github.com/yonghot/actigence-marketplace/actions/workflows/compliance.yml/badge.svg)](https://github.com/yonghot/actigence-marketplace/actions/workflows/compliance.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Korean](https://img.shields.io/badge/Language-한국어-blue.svg)](./)

---

## 본 marketplace에 포함된 plugin

| Plugin | 도메인 | 버전 | 상태 |
|---|---|---|---|
| [`jeonse-explorer`](./plugins/jeonse-explorer/) | 전세사기 | 1.0.0 | Beta |
| `voice-phishing-explorer` | 보이스피싱 | — | Phase 2 (계획) |
| `kihoek-fraud-explorer` | 기획부동산 사기 | — | Phase 2 (계획) |
| `investment-fraud-explorer` | 투자사기 (다단계·코인·리딩방) | — | Phase 2 (계획) |

---

## ACTIGENCE 마켓플레이스 사용 방법 (Claude Code / Cowork)

### 1단계 — 마켓플레이스 추가

Claude Code 또는 Cowork에서:

```bash
/plugin marketplace add yonghot/actigence-marketplace
```

또는 CLI:

```bash
claude plugin marketplace add yonghot/actigence-marketplace
```

### 2단계 — Plugin 설치

```bash
/plugin install jeonse-explorer@actigence
```

또는:

```bash
claude plugin install jeonse-explorer@actigence
```

### 3단계 — 자연어로 사용

별도 명령어 학습 없이 자연어로:

```
"보증금 1억 5천만원 줬는데 임대인이 잠적했고 경매 들어갔어요. 어떻게 될까요?"
```

→ Plugin이 자동으로 객관적 변수를 매핑하여 유사 사건군의 분포 차트를 보여줍니다.

---

## 마켓플레이스 컴플라이언스 원칙

본 마켓플레이스의 모든 plugin은 다음 7가지 회피 원칙을 코드 레벨에서 강제합니다:

1. **단정 결과 출력 금지** — 분포 통계만 반환
2. **선택형 입력만 허용** — 도구 input은 enum 강제, 자유 텍스트 0개
3. **공개 데이터만 사용** — 유료 판례 DB 사용 0건
4. **변호사 매칭·추천 0개**
5. **"무료" 단어 0건** (변협 광고 규정 4조 12호)
6. **판결문 양식 흉내 0건**
7. **면책 배너·워터마크 100% 강제**

위 원칙은 [GitHub Actions CI](./.github/workflows/compliance.yml)에서 PR마다 자동 검증되며, 위반 시 머지가 차단됩니다.

각 plugin의 상세 컴플라이언스 정책은 plugin 디렉토리의 `COMPLIANCE.md`를 참조하세요.

---

## 디렉토리 구조

```
actigence-marketplace/
├── .claude-plugin/
│   └── marketplace.json              # Anthropic 공식 schema 준수
├── plugins/
│   └── jeonse-explorer/              # 실제 plugin
│       ├── .claude-plugin/
│       │   └── plugin.json           # plugin 매니페스트
│       ├── skills/                   # 자동 호출 Skill 3개
│       ├── agents/                   # Sub-agent (compliance-guardrail)
│       ├── commands/                 # /jeonse-help (slash 1개)
│       ├── .mcp.json                 # MCP 서버 정의
│       ├── mcp-server/               # TypeScript MCP 서버
│       │   ├── src/                  # 소스
│       │   ├── data/                 # 시드 JSON 4개
│       │   ├── dist/                 # 빌드된 산출물 (commit됨)
│       │   └── scripts/migrations/   # Supabase 스키마
│       ├── ui-components/            # Claude App UI (React)
│       ├── README.md                 # plugin 자체 README
│       ├── COMPLIANCE.md             # plugin 컴플라이언스 정책
│       └── docs/                     # plugin 자체 docs
├── scripts/
│   └── compliance-check.js           # 마켓플레이스 차원 자가 검증
├── .github/
│   └── workflows/
│       └── compliance.yml            # CI 파이프라인
├── docs/
│   ├── OFFICIAL-PUBLISHING.md        # 정식 등록 가이드 (★)
│   └── SUBMISSION-FORM.md            # Anthropic 디렉토리 등록 신청서
├── README.md                         # 본 파일
├── LICENSE                           # MIT
└── .gitignore
```

---

## Anthropic 공식 디렉토리 등록 절차

본 marketplace는 다음 단계를 거쳐 Anthropic 공식 community 디렉토리에 등록되며, 추가 검수를 통해 "Anthropic Verified" 배지를 받을 수 있습니다.

상세 절차는 **[`docs/OFFICIAL-PUBLISHING.md`](./docs/OFFICIAL-PUBLISHING.md)** 를 참조하세요.

대략적 단계:

```
[현재] Stage 0 — Plugin 매니페스트·MCP 서버 빌드 검증 완료
   ↓
Stage 1 — GitHub repo 공개 + 자가 검증 CI 통과
   ↓
Stage 2 — 베타 배포 (자체 marketplace로 동행 커뮤니티 5~10명)
   ↓
Stage 3 — 변호사 사전 자문 통과 + 시연 영상 3편 제작
   ↓
Stage 4 — Anthropic 공식 디렉토리 등록 신청 (clau.de/plugin-directory-submission)
   ↓
Stage 5 — Community 디렉토리 등재 (자동 검토 통과 후)
   ↓
Stage 6 — Anthropic Verified 배지 신청 (선택)
   ↓
Stage 7 — 공식 marketplace `claude-plugins-official` 등재 (선별)
   ↓
Stage 8 — Phase 2 plugin 추가 (보이스피싱·기획부동산·투자사기)
```

---

## 운영 주체

**ACTIGENCE** — AI 컨설팅·바이브코딩 전문 회사 (변호사 미소속 데이터 분석 회사)

- 홈페이지: [actigence.ai](https://actigence.ai)
- 이메일: cio@actigence.ai
- Anthropic CPN (Claude Partner Network) 파트너

---

## 라이선스

[MIT License](./LICENSE) — 자세한 면책 조항은 라이선스 파일 참조

---

## ⚠️ 면책 조항

본 marketplace의 모든 plugin은 공개 판례·법령 통계 분석 도구이며, **법률 자문이나 사건 결과 예측이 아닙니다**. ACTIGENCE에는 변호사가 소속되어 있지 않습니다. 개별 사건은 반드시 공식 지원 기관에 문의하시거나 변호사와 상담하시기 바랍니다.
