# 설치 및 배포 가이드

본 가이드는 ACTIGENCE Jeonse Explorer Plugin을 처음부터 끝까지 배포하기 위한 절차를 다룹니다.

## 전체 배포 흐름

```
1. GitHub 저장소 생성·푸시
        ↓
2. Supabase 프로젝트 생성·스키마 마이그레이션·시드 데이터 적재
        ↓
3. Vercel에 MCP 서버 배포 (또는 Cloud Run/Fly.io)
        ↓
4. 도메인 연결 (jeonse-explorer.actigence.ai)
        ↓
5. plugin.json의 mcp_servers URL 업데이트
        ↓
6. Plugin marketplace 등록 신청
        ↓
7. 베타 테스트 및 피드백 수집
        ↓
8. 1.0 출시
```

---

## 1단계 — GitHub 저장소 생성

```bash
# 본 패키지 압축을 풀고 디렉토리로 이동
unzip actigence-jeonse-explorer.zip
cd actigence-jeonse-explorer

# Git 초기화
git init
git add .
git commit -m "Initial commit: ACTIGENCE Jeonse Explorer Plugin v1.0.0"

# GitHub 저장소 생성 후 push
git remote add origin https://github.com/yonghot/actigence-marketplace.git
git branch -M main
git push -u origin main
```

**저장소 설정 권장**:
- Public 저장소 (Plugin marketplace 검수용 투명성)
- License: MIT (이미 포함됨)
- Topics: `claude-plugin`, `mcp-server`, `legal-data`, `korean`, `actigence`
- About 섹션에 [actigence.ai/jeonse-explorer](https://actigence.ai/jeonse-explorer) 링크

---

## 2단계 — Supabase 프로젝트 셋업

### 2.1 프로젝트 생성

[Supabase Dashboard](https://supabase.com/dashboard)에서:

1. New Project 클릭
2. 프로젝트명: `jeonse-explorer-prod`
3. Database password 안전하게 보관
4. Region: `Northeast Asia (Seoul)` 권장
5. Pricing Plan: Free Tier로 시작 (트래픽 증가 시 Pro로 전환)

### 2.2 스키마 마이그레이션

Supabase Dashboard > SQL Editor에서 `mcp-server/scripts/migrations/001_initial_schema.sql` 내용을 복사하여 실행.

또는 Supabase CLI:

```bash
npm install -g supabase
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

### 2.3 시드 데이터 적재

`mcp-server/data/` 의 4개 JSON을 Supabase에 적재합니다.

```bash
cd mcp-server
npm install

# .env 파일 생성
cp .env.example .env
# .env에 SUPABASE_URL, SUPABASE_SERVICE_KEY 입력

# 적재 스크립트 실행 (자체 작성 필요 — TODO)
node scripts/seed-data.js
```

또는 Supabase Dashboard의 Table Editor에서 직접 JSON import.

### 2.4 RLS 확인

스키마에 이미 RLS 정책이 포함되어 있으나 한 번 확인:

```sql
-- anon 키로 SELECT만 가능한지 확인
SELECT * FROM law_articles LIMIT 1;
SELECT * FROM sentencing_guidelines LIMIT 1;
SELECT * FROM public_cases LIMIT 1;

-- INSERT 시도 → 실패해야 함 (Stateless 강제)
INSERT INTO law_articles (...) VALUES (...);
-- ERROR: new row violates row-level security policy
```

---

## 3단계 — MCP 서버 배포 (Vercel)

### 3.1 Vercel 프로젝트 생성

```bash
cd mcp-server
npm install -g vercel
vercel login
vercel link
```

### 3.2 환경변수 설정

Vercel Dashboard > Project Settings > Environment Variables:

| 변수 | 값 |
|---|---|
| `SUPABASE_URL` | Supabase 프로젝트 URL |
| `SUPABASE_ANON_KEY` | Supabase anon 키 (Service key 아님) |
| `ANTHROPIC_API_KEY` | (선택) Claude API 키 — CPN 활용 시 |
| `MCP_PORT` | `3001` |
| `MCP_BASE_URL` | `https://jeonse-explorer.actigence.ai` |
| `NODE_ENV` | `production` |
| `ENABLE_PII_GUARDRAIL` | `true` |
| `MAX_REQUESTS_PER_IP_PER_MINUTE` | `10` |

### 3.3 배포

```bash
vercel --prod
```

### 3.4 도메인 연결

Vercel Dashboard > Domains에서 `jeonse-explorer.actigence.ai` 추가.

DNS A/CNAME 레코드를 Vercel 안내에 따라 설정.

### 3.5 헬스체크

```bash
curl https://jeonse-explorer.actigence.ai/health
# {"status":"ok","service":"actigence-jeonse-explorer",...}

curl https://jeonse-explorer.actigence.ai/.well-known/compliance.json
# {"operator":"ACTIGENCE","operator_type":"non-lawyer",...}
```

### 3.6 MCP 서버 테스트

```bash
# MCP Inspector로 도구 호출 테스트
npx @modelcontextprotocol/inspector https://jeonse-explorer.actigence.ai/mcp
```

---

## 4단계 — Plugin Marketplace 등록

### 4.1 Anthropic Plugin Marketplace 등록 신청

Anthropic 공식 Plugin marketplace에 등록 신청:

1. [Plugin marketplace](https://docs.claude.com/) 또는 marketplace 저장소에 PR
2. 또는 CPN (Claude Partner Network) 담당자에게 직접 문의: cpn@anthropic.com [확인필요]

제출 자료:
- `plugin.json` 매니페스트
- README.md
- COMPLIANCE.md (사전 자문 의견서 요약본 포함)
- 시연 영상 3편 링크 (시나리오 A·B·C)
- ACTIGENCE 사업자 정보·연락처

### 4.2 Connectors Directory 등록 (보조)

Custom Connector 형태로 Connectors Directory에도 등록 신청 (1차 페르소나 도달 보강).

### 4.3 ACTIGENCE 자체 marketplace (Phase 2)

```bash
# 자체 marketplace 저장소 생성
gh repo create actigence/claude-marketplace --public

# 매니페스트 추가
mkdir -p .claude-plugin
echo '{"name":"actigence","description":"ACTIGENCE 공식 Plugin marketplace","plugins":[...]}' \
  > .claude-plugin/marketplace.json

git add . && git commit -m "Initial ACTIGENCE marketplace" && git push
```

---

## 5단계 — 컴플라이언스 자가 검증 통과 확인

배포 전 반드시 자가 검증 통과 확인:

```bash
node scripts/compliance-check.js
```

```
═══════════════════════════════════════════════════════════════
ACTIGENCE Jeonse Explorer — Compliance Self-Check
═══════════════════════════════════════════════════════════════

▶ C-01·C-03·C-04 — 금지 표현 검사 ... ✅ PASS
▶ C-08·C-09·C-10·C-07 — 필수 const 검사 ... ✅ PASS
▶ C-02 — 변호사 매칭 컴포넌트 검사 ... ✅ PASS
▶ C-06 — 사용자 입력 저장 코드 검사 ... ✅ PASS

═══════════════════════════════════════════════════════════════
✅ 모든 컴플라이언스 검사 통과
═══════════════════════════════════════════════════════════════
```

CI 파이프라인 (GitHub Actions)에 통합하면 PR마다 자동 검증됩니다.

`.github/workflows/compliance.yml` 작성 권장:

```yaml
name: Compliance Check
on: [pull_request, push]
jobs:
  compliance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: node scripts/compliance-check.js
```

---

## 6단계 — 베타 테스트

### 6.1 동행 커뮤니티 베타 (5~10명)

ACTIGENCE 운영 동행 커뮤니티 멤버 5~10명에게 사전 배포:

- Cowork 환경에서 시연 시나리오 A 테스트
- 임대차 계약서 PDF 5종 정확도 테스트
- 가드레일 우회 시도 (프롬프트 인젝션 방어 검증)
- 분포 차트 가독성 평가

### 6.2 시민단체 파일럿 (2~3개 단체)

전세사기·깡통전세 피해자 전국대책위원회 등 시민단체에 시나리오 C 시연:

- 폴더 일괄 분석 정확도
- 통합 보고서 PDF 출력 품질
- B2B SaaS 모델 가능성 평가

### 6.3 피드백 반영 사이클

베타 → 피드백 → 패치 → 재배포 1~2회 권장.

---

## 7단계 — 1.0 출시

### 7.1 보도자료 배포

배포 채널:
- ACTIGENCE 블로그 (actigence.ai/blog)
- LinkedIn (CEO 계정)
- 동행 커뮤니티
- 한국 IT/AI 매체 (`디지털타임스`, `IT조선`, `바이라인네트워크` 등)

핵심 메시지:
- "한국 최초 변호사법 회피 설계 기반 공익 AI Plugin"
- "Claude Cowork 첫 경험 시연 도구로 적합"
- "ACTIGENCE × Anthropic CPN 파트너십 자산"

### 7.2 시연 영상 3편 게시

- 시나리오 A (개인 사용, 90초)
- 시나리오 B (비교 시뮬레이션, 60초)
- 시나리오 C (시민단체 일괄 분석, 120초)

YouTube + ACTIGENCE 채널 + Twitter/X.

자세한 시연 가이드: [`COWORK-DEMO.md`](./COWORK-DEMO.md)

---

## 운영 체크리스트

배포 후 매월 점검:

- [ ] 국토부 월간 통계 갱신 (Supabase `molit_statistics`)
- [ ] 양형기준 개정 여부 확인 (대법원 양형위원회)
- [ ] 새로운 빌라왕 사건 판례 추가 (Supabase `public_cases`)
- [ ] 컴플라이언스 위반 신고 처리 (이메일·GitHub Issues)
- [ ] Sentry 에러 로그 확인
- [ ] Rate limit 차단 이벤트 통계 확인
- [ ] 사용자 피드백 정리

---

## 트러블슈팅

| 증상 | 원인 | 해결 |
|---|---|---|
| `pii_detected` 응답 빈발 | 정규식 false positive | `guardrails.ts`의 `PII_PATTERNS` 정밀화 |
| 차트 렌더링 깨짐 | Recharts 버전 불일치 | `package.json`에서 `recharts ^2.x` 고정 |
| Supabase RLS 에러 | anon 키로 INSERT 시도 | service_role 키만 데이터 적재 시 사용 |
| Vercel 함수 타임아웃 | 분포 계산 6개 동시 호출 | 차트 1개씩 lazy load 또는 Edge Runtime 활용 |
| MCP Inspector 연결 실패 | CORS 또는 transport 불일치 | `index.ts`의 `cors` 설정 확인, transport는 `streamable-http` |

---

## 문의

- 기술 문의: cio@actigence.ai
- GitHub Issues: [github.com/yonghot/actigence-marketplace/issues](https://github.com/yonghot/actigence-marketplace/issues)
- ACTIGENCE: [actigence.ai](https://actigence.ai)
