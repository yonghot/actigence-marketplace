# ACTIGENCE Jeonse Explorer Plugin

> 전세사기 피해 사건의 유사 공개 판례·정부 통계 분포를 시각화하는 공익 데이터 분석 Claude Plugin
>
> ⚠️ **본 Plugin은 법률 자문이 아닙니다.** 공개 데이터의 통계 분포만 제공합니다. ACTIGENCE에는 변호사가 소속되어 있지 않습니다.

---

## ⚡ Quick Start — 5분 안에 Cowork에서 시도하기

본 Plugin은 **stdio MCP 모드로 동작**하므로 외부 인프라(Vercel·Supabase) 없이 사용자 머신에서 즉시 실행됩니다. 빌드된 `dist/`까지 패키지에 포함되어 있어 `npm install` 한 번이면 자동 재빌드까지 완료됩니다.

### 단계 1 — GitHub 저장소에 푸시 (한 번만)

```bash
unzip actigence-jeonse-explorer-plugin-v1.0.0.zip
cd actigence-jeonse-explorer

git init
git add .
git commit -m "Initial: ACTIGENCE Jeonse Explorer Plugin v1.0.0"
git remote add origin https://github.com/YOUR_USERNAME/jeonse-explorer-plugin.git
git branch -M main
git push -u origin main
```

### 단계 2 — Cowork에서 marketplace 추가

Claude Desktop의 **Cowork 탭** → 좌측 사이드바 **Customize** → **Plugins** → 우측 상단 **Browse / Add marketplace** → URL 입력:

```
YOUR_USERNAME/jeonse-explorer-plugin
```

또는 Claude Code CLI에서:

```bash
claude plugin marketplace add YOUR_USERNAME/jeonse-explorer-plugin
```

### 단계 3 — Plugin 설치

Cowork plugin 카탈로그에서 **ACTIGENCE Jeonse Explorer**를 찾아 **Install** 클릭. 또는 CLI:

```bash
claude plugin install actigence-jeonse-explorer@jeonse-explorer-plugin
```

설치 시 `mcp-server/`의 `npm install`이 자동 실행되어 `postinstall` 훅으로 dist 재빌드까지 자동 완료됩니다 (TypeScript 5.x + Node 20+ 필요).

### 단계 4 — 자연어로 사용

Cowork의 새 task에서 자연어 입력:

```
"보증금 1억 5천만원 줬는데 임대인이 잠적했고 경매 들어갔어요. 어떻게 될까요?"
```

→ Plugin이 자동으로 객관적 변수 7개를 매핑하여 유사 사건군의 분포 결과를 반환합니다. 변수가 부족하면 객관식으로 1회 보충 질문.

### 단계 5 — Cowork 시연 시나리오 (선택)

Plugin 디렉토리의 `docs/COWORK-DEMO.md`에 시연 시나리오 A/B/C가 정리되어 있습니다 (90초·60초·120초).

### 트러블슈팅

| 증상 | 원인 | 해결 |
|---|---|---|
| `cannot find module dist/index-stdio.js` | postinstall 미실행 | `cd mcp-server && npm install && npm run build` 수동 실행 |
| `pii_detected` 응답 빈발 | 한국 휴대폰·이름 패턴이 input에 포함됨 | 정상 동작 (가해자 정보 처리 차단) — 객관적 변수만 사용 |
| Plugin이 자연어 트리거에 반응 안 함 | Skill description 자동 호출 실패 | `/jeonse-help` 명령으로 수동 활성화 가능 |
| Node.js 버전 에러 | Node 18 이하 | Node 20 이상으로 업그레이드 |

### 정식 운영 (Vercel + Supabase) 배포는?

위 stdio 모드는 **개인 사용자·시연·베타 테스트 용도**입니다. 다중 사용자 운영을 위한 정식 HTTP MCP 서버 배포(Vercel + Supabase + 도메인 연결)는 [`docs/INSTALL.md`](./docs/INSTALL.md)를 참조하세요.

---

## 무엇인가요?

전세사기 피해자 또는 예비 임차인이 자신의 상황과 **유사한 공개 판례·정부 통계의 분포**를 시각화하여 의사결정을 보조하는 Claude Plugin입니다.

3가지 분포를 제공합니다:

1. **전세사기특별법 적용 분포** — 4가지 인정 요건 충족 가능성 (국토부 가결률 통계 기반)
2. **보증금 회수 가능성 분포** — 우선변제권·LH 매입·경공매 매트릭스 기반
3. **가해자 양형 분포** — 사기죄 양형기준 5유형 + 공개 판례 RAG 기반

---

## 무엇을 하지 않나요?

| 하지 않는 것 | 이유 |
|---|---|
| 단정적 사건 결과 예측 | 변호사법 109조 회피 (비변호사 운영) |
| 변호사·로펌 매칭·추천 | 변호사법 34조 회피 (알선 금지) |
| 가해자(임대인) 식별 정보 처리 | 명예훼손·개인정보 보호 |
| 사용자 본인 식별 정보 저장 | Stateless 원칙 |
| 법률 문서 작성 (고소장·소장 등) | 변호사법 109조 회피 |
| "무료 상담" 광고 | 변협 광고 규정 4조 12호 회피 |
| 판결문 양식 흉내 (주문/이유 표제) | 직역 침해 외관 회피 |

자세한 컴플라이언스 정책은 [`COMPLIANCE.md`](./COMPLIANCE.md)를 참조하세요.

---

## 어떻게 사용하나요?

별도의 명령어를 외울 필요가 없습니다. **자연어로 질문하시면 자동으로 분석이 시작됩니다.**

### 예시 1 — 본인 상황 분석

```
"보증금 1억 5천만원 줬는데 임대인이 잠적했고 경매 들어갔어요. 어떻게 될까요?"
```

→ Plugin이 자동으로 객관적 변수 7개를 매핑하여 유사 사건군의 분포 차트를 보여줍니다.

### 예시 2 — 법령 정보

```
"전세사기특별법 인정 요건이 뭐야?"
```

→ 공식 출처 기반 법령 요약을 제공합니다.

### 예시 3 — PDF 자동 분석 (Cowork 환경 권장)

임대차 계약서·등기부등본·경매 알림 PDF를 첨부하면 Plugin이 자동으로 객관적 변수만 추출하여 분석합니다.

```
"내 데스크톱의 '임대차 계약서.pdf' 분석해줘"
```

→ 가해자 식별 정보는 절대 추출하지 않으며, 모든 입력값은 분석 후 즉시 폐기됩니다.

### 예시 4 — 비교 시뮬레이션

```
"보증금 1억과 2억일 때 사기 인정 비율 비교해줘"
```

→ 두 분포를 나란히 비교합니다.

### 예시 5 — 시민단체 일괄 분석

```
"이 폴더의 모든 사례 통합 보고서 만들어줘"
```

→ 여러 사건을 일괄 분석하여 통합 분포 보고서를 생성합니다 (Cowork 환경).

명령어가 필요하면 `/jeonse-help`를 입력하세요.

---

## 설치

상세한 설치 가이드는 [`docs/INSTALL.md`](./docs/INSTALL.md)를 참조하세요.

### 빠른 설치

Anthropic Claude의 Plugin 마켓플레이스에서:

```
/plugin marketplace add yonghot/actigence-marketplace
/plugin install jeonse-explorer
```

또는 Plugin marketplace에서 "ACTIGENCE Jeonse Explorer"를 검색하여 설치.

---

## Plugin 구조

```
actigence-jeonse-explorer/
├── .claude-plugin/
│   └── plugin.json                          # 매니페스트
├── skills/                                  # 자동 호출 (자연어 트리거)
│   ├── jeonse-fraud-analyzer/SKILL.md       # 메인 분포 분석
│   ├── jeonse-law-summary/SKILL.md          # 법령 요약
│   └── jeonse-document-extractor/SKILL.md   # PDF 자동 추출 (Cowork 시연 핵심)
├── agents/
│   └── compliance-guardrail.md              # 시스템 프롬프트 가드레일
├── commands/
│   └── jeonse-help.md                       # 도움말 (slash 1개만)
├── mcp-server/                              # 백엔드 MCP 서버
│   ├── src/                                 # TypeScript 소스
│   ├── data/                                # 시드 데이터
│   └── scripts/migrations/                  # Supabase 스키마
├── ui-components/                           # Claude App UI (React)
├── scripts/
│   └── compliance-check.js                  # 자가 검증 스크립트
└── docs/                                    # 가이드 문서
    ├── INSTALL.md                           # 배포·설치 가이드
    ├── COWORK-DEMO.md                       # Cowork 시연 시나리오
    └── CONTRIBUTING.md                      # 기여 가이드
```

---

## 지원 환경

| 환경 | 지원 여부 | 비고 |
|---|---|---|
| **Claude Cowork** ⭐ | ✅ 권장 | PDF 자동 분석 시연 최적 |
| **Claude Desktop** | ✅ | 일반 사용 |
| **Claude Code** | ✅ | 개발자용 |
| **Claude.ai (web)** | ✅ | Custom Connector 형태 |

---

## 공식 지원 기관 (개별 사건 문의용)

본 Plugin은 일반 통계 분포만 제공합니다. 개별 사건은 다음 공식 기관에 문의하세요:

| 기관 | 연락처 | 지원 내용 |
|---|---|---|
| 국토교통부 전세사기피해자지원센터 | [jeonse.kgeop.go.kr](https://jeonse.kgeop.go.kr) | 특별법 피해자 결정신청, 긴급 주거지원 |
| 대한법률구조공단 | 132 / [klac.or.kr](https://klac.or.kr) | 저소득층 무료 법률 상담 |
| 검찰청 범죄피해자 지원실 | [spo.go.kr](https://spo.go.kr) | 형사 사건 피해자 지원 |
| 대한변호사협회 변호사 찾기 | [koreanbar.or.kr](https://koreanbar.or.kr) | 지역·전문분야별 변호사 검색 |

---

## 운영 주체

**ACTIGENCE** — AI 컨설팅·바이브코딩 전문 회사 (변호사 미소속 데이터 분석 회사)

- 홈페이지: [actigence.ai](https://actigence.ai)
- 이메일: cio@actigence.ai
- Plugin 저장소: [github.com/yonghot/actigence-marketplace](https://github.com/yonghot/actigence-marketplace)

---

## 컴플라이언스 정책

본 Plugin은 출시 전 변호사 1인 사전 자문을 거쳤으며, 7가지 회피 원칙을 코드 레벨에서 강제합니다:

1. 단정 결과 출력 금지 → 분포 통계만 반환
2. 선택형 입력만 허용 → 도구 input은 enum 강제
3. 공개 데이터만 사용 → 케이스노트·엘박스 등 유료 DB 사용 X
4. 변호사 매칭·추천 0개
5. "무료" 단어 0건
6. 판결문 양식 흉내 0건
7. 면책 배너·워터마크 100% 강제

상세 정책: [`COMPLIANCE.md`](./COMPLIANCE.md)

빌드 시 자동 검증:
```bash
node scripts/compliance-check.js
```

---

## 라이선스

[MIT License](./LICENSE)

---

## 기여

기여 가이드: [`docs/CONTRIBUTING.md`](./docs/CONTRIBUTING.md)

이슈·제안: [GitHub Issues](https://github.com/yonghot/actigence-marketplace/issues)

---

## ⚠️ 면책 조항

본 Plugin은 공개 판례·법령 통계 분석 도구이며, 법률 자문이나 사건 결과 예측이 아닙니다. ACTIGENCE에는 변호사가 소속되어 있지 않습니다. 개별 사건은 반드시 위에 명시된 공식 지원 기관에 문의하시거나 변호사와 상담하시기 바랍니다.
