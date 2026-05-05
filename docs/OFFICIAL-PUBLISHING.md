# 정식 Anthropic 디렉토리 발행 가이드

> 본 문서는 ACTIGENCE Marketplace를 Anthropic 공식 plugin 디렉토리에 정식 등록하기 위한 단계별 절차입니다.
>
> **사용자**: 쿠바 (ACTIGENCE CEO, Anthropic CPN 파트너 온보딩 중)
> **목표**: Plugin marketplace를 Anthropic의 community 디렉토리 → "Anthropic Verified" 배지 → 공식 `claude-plugins-official` 디렉토리까지 단계적 등재
> **마지막 업데이트**: 2026년 5월

---

## 정식 절차 전체 단계 (8단계)

| 단계 | 내용 | 소요 시간 | 비용 |
|---|---|---|---|
| **Stage 1** | GitHub 공개 + CI 통과 | 1~2일 | $0 |
| **Stage 2** | 베타 배포 + 동행 커뮤니티 피드백 | 1~2주 | $0 |
| **Stage 3** | 변호사 사전 자문 + 시연 영상 3편 제작 | 1주 | 200~500만원 |
| **Stage 4** | Anthropic 공식 디렉토리 등록 신청 | 1일 작성 + 2~4주 검토 | $0 |
| **Stage 5** | Community 디렉토리 등재 (자동 검토 통과 후) | 즉시 | $0 |
| **Stage 6** | Anthropic Verified 배지 신청 (선택) | 4~8주 | $0 |
| **Stage 7** | `claude-plugins-official` 등재 (선별) | 미정 | $0 |
| **Stage 8** | Phase 2 plugin 추가 (Phase 2) | 후속 | — |

전체 정석 경로: 약 **2~3개월** (Stage 5까지) / **3~4개월** (Stage 6까지)

---

## Stage 1 — GitHub 공개 + CI 통과 (1~2일)

### 목적
정식 절차의 출발점. Plugin이 Anthropic의 표준 marketplace 형식을 준수하는지 자가 검증을 통과하고 GitHub에 공개합니다.

### 1.1 GitHub 저장소 생성

```bash
# 본 zip을 풀고 디렉토리로 이동
unzip actigence-marketplace-v1.0.0.zip
cd actigence-marketplace

# Git 초기화
git init
git add .
git commit -m "Initial: ACTIGENCE Marketplace v1.0.0 with jeonse-explorer plugin"

# GitHub repo 생성 및 push
# 권장 repo 이름: actigence-marketplace (마켓플레이스 차원)
# 또는: jeonse-explorer-plugin (단일 plugin 강조)
gh repo create yonghot/actigence-marketplace --public --source=. --remote=origin
git push -u origin main
```

**Repo 권장 설정**:
- Public visibility (검수 투명성)
- About: `ACTIGENCE 공익 데이터 분석 plugin marketplace`
- Topics: `claude-plugin`, `claude-marketplace`, `mcp`, `legal-data`, `korean`, `actigence`
- License: MIT (이미 포함됨)

### 1.2 CI/CD 자동 검증 통과

본 repo에는 `.github/workflows/compliance.yml`이 포함되어 있어 push마다 다음을 자동 검증합니다:

1. **Compliance Self-Check** — 회피 7원칙 자동 검증 (C-01~C-10)
2. **Build Check** — TypeScript 컴파일 + dist 산출물 검증
3. **Smoke Test** — MCP 서버 list_tools + PII 가드레일 동작 검증

GitHub Actions 탭에서 모든 잡이 ✅ 통과해야 다음 단계로 넘어갑니다.

CI 실패 시 디버깅:
```bash
# 로컬에서 동일한 검증 재현
node scripts/compliance-check.js
cd plugins/jeonse-explorer/mcp-server && npm install && npm run build
```

### 1.3 Stage 1 완료 체크리스트

- [ ] GitHub repo public 공개됨
- [ ] CI 모든 잡 통과 (Compliance + Build + Smoke)
- [ ] README의 Compliance Check 배지가 녹색
- [ ] LICENSE 파일 commit 완료
- [ ] `.claude-plugin/marketplace.json` schema 검증 통과

---

## Stage 2 — 베타 배포 + 동행 커뮤니티 피드백 (1~2주)

### 목적
공식 등록 신청 전에 실사용자 피드백을 수집하여 품질을 검증합니다. 자체 marketplace 형태로 직접 인스톨 가능합니다.

### 2.1 자체 marketplace로 인스톨 테스트

본인 머신에서 먼저 검증:

```bash
# Claude Code 또는 Cowork에서
/plugin marketplace add yonghot/actigence-marketplace
/plugin install jeonse-explorer@actigence
```

또는 CLI:

```bash
claude plugin marketplace add yonghot/actigence-marketplace
claude plugin install jeonse-explorer@actigence
```

설치 후 자연어 시도:
```
"보증금 1억 5천만원 줬는데 임대인이 잠적했고 경매 들어갔어요"
```

### 2.2 동행 커뮤니티 베타 모집

ACTIGENCE 운영 동행 커뮤니티(약 250명) 중 5~10명에게 베타 신청 받기:

**모집 메시지 예시**:
> ACTIGENCE에서 공익 데이터 분석 Claude Plugin을 출시 준비 중입니다.
> 전세사기 도메인의 분포 분석 도구로, Cowork 환경에서 PDF만 던지면 자동 분석되는 첫 경험 시연 도구입니다.
> 베타 테스터 5~10분 모집합니다. 1주 동안 사용 후 5문항 설문 답해주시면 감사하겠습니다.
> 참여 조건: Claude Pro/Max, Cowork 환경 사용 경험.
> 신청: cio@actigence.ai

### 2.3 피드백 5문항 (5점 척도)

1. 자연어 트리거가 명확하게 작동하나요?
2. 분포 차트의 가독성이 좋나요?
3. 컴플라이언스 가드레일(가해자 정보 차단 등)이 가시적이고 신뢰가 갔나요?
4. 90초 안에 결과가 나오는 속도가 적절했나요?
5. 본인 업무·개인 사용에 도움이 될 것 같나요?

### 2.4 시민단체 파일럿 (선택)

전세사기·깡통전세 피해자 전국대책위원회 등 2~3개 단체에 시연 시나리오 C 파일럿:
- 폴더 일괄 분석 정확도
- 통합 보고서 PDF 출력 품질
- B2B SaaS 모델 가능성

### 2.5 피드백 반영

수집된 피드백을 다음 카테고리로 분류:

| 카테고리 | 예시 | 우선순위 |
|---|---|---|
| 컴플라이언스 위반 | "가해자 정보가 노출됨" | P0 (즉시) |
| 핵심 동작 오류 | "PDF 추출 실패" | P0 |
| 사용성 개선 | "차트 라벨 모호함" | P1 |
| 콘텐츠 추가 | "양형 조회 카테고리 추가" | P2 |

P0·P1은 1.0.1 패치, P2는 1.1로 미루기.

### 2.6 Stage 2 완료 체크리스트

- [ ] 5명 이상 베타 테스터로부터 피드백 수령
- [ ] P0·P1 이슈 수정 완료
- [ ] 1.0.1 패치 배포
- [ ] 베타 사용자 만족도 평균 4.0/5.0 이상

---

## Stage 3 — 변호사 사전 자문 + 시연 영상 3편 제작 (1주)

### 목적
공식 등록 신청 시 제출할 핵심 자료를 준비합니다.

### 3.1 변호사 사전 자문

#### 자문 변호사 섭외 기준
- 변호사법·변협 광고 규정에 익숙한 IT 법률 변호사
- AI·플랫폼 컴플라이언스 경험
- 한국 거주 (한국 법률 적용)

#### 자문 비용 예상
- 1~2시간 단발 자문: 50~80만원
- 의견서 작성 포함: 200~300만원
- 전체 프로젝트 자문 (Phase 2까지): 500만원~

#### 자문 질문 17개 (B-compliance-design 단계 + C-2 추가 4개)

기존 17개 + 본 단계 추가 4개:

21. Plugin marketplace에 등록된 도구가 사용자의 데스크톱에서 자동으로 PDF·이미지를 추출하는 행위가 변호사법 109조 1호 "법률 관계 문서 작성"의 변형으로 해석될 위험은?

22. Cowork 환경에서 사용자 데스크톱의 임대차 관련 PDF를 자동 분석하는 과정에서, 가해자(임대인) 식별 정보를 처리하지 않더라도 "수사기관 취급 중 사건의 자료 분석"으로 109조 1호 다목 적용 여부?

23. Sub-agent의 시스템 프롬프트로 가드레일을 강제하더라도 사용자가 "프롬프트 인젝션"으로 가드레일을 우회한 경우, ACTIGENCE의 책임 범위는?

24. Plugin marketplace 등록 시 Anthropic의 검수가 통과되었다는 사실 + Sub-agent 가드레일이 코드 레벨에서 강제된다는 사실이 변호사법 적용 회피 근거로 작용 가능한지?

#### 자문 의견서 요구 사항
- 형식: PDF 또는 docx
- 내용: 17~24번 질문에 대한 답변 + 종합 의견
- 도장·서명 포함
- 비공개 의견서 (전체) + 공개 요약본 2종 작성

### 3.2 시연 영상 3편 제작

상세 시나리오는 [`plugins/jeonse-explorer/docs/COWORK-DEMO.md`](../plugins/jeonse-explorer/docs/COWORK-DEMO.md) 참조.

| 영상 | 시나리오 | 길이 | 타깃 페르소나 |
|---|---|---|---|
| Video A | 단일 PDF 자동 분석 | 90초 | 동행 커뮤니티 (개발자) |
| Video B | 보증금 비교 시뮬레이션 | 60초 | 예비 임차인 |
| Video C | 폴더 일괄 분석 | 120초 | 시민단체 실무자 |

#### 영상 사양

- 1920×1080 (Full HD)
- 30~60fps
- 한국어 내레이션 + 영어 자막 (CPN 활용)
- ACTIGENCE 로고 인트로 3초 + 아웃트로 5초

#### 게시 채널

- ACTIGENCE 공식 YouTube 채널 (필수)
- 동행 커뮤니티 (베타 사용자에게 공유)
- LinkedIn (CEO 계정)
- ACTIGENCE 블로그 (actigence.ai/blog)

### 3.3 Stage 3 완료 체크리스트

- [ ] 변호사 자문 의견서 수령 (전체 + 공개 요약본)
- [ ] 시연 영상 3편 제작·업로드 완료
- [ ] YouTube 영상 URL 3개 확보

---

## Stage 4 — Anthropic 공식 디렉토리 등록 신청 (1일 작성 + 2~4주 검토)

### 목적
Anthropic의 공식 community plugin directory에 등록 신청.

### 4.1 등록 신청 채널

다음 3가지 채널 중 선택 (가장 빠른 답신을 위해 1~2개 동시 신청):

| 채널 | URL | 비고 |
|---|---|---|
| **Console (권장)** | `platform.claude.com/plugins/submit` | API Console 통합 채널 |
| Settings | `claude.ai/settings/plugins/submit` | Claude.ai 사용자용 |
| Community | `clau.de/plugin-directory-submission` | 공개 community marketplace 등록 |

### 4.2 신청서 작성

[`docs/SUBMISSION-FORM.md`](./SUBMISSION-FORM.md)에 신청서 템플릿이 작성되어 있습니다. 다음 항목을 포함:

1. **Plugin 정보**
   - 이름: `jeonse-explorer`
   - Marketplace: `actigence`
   - GitHub URL: `https://github.com/yonghot/actigence-marketplace`
   - Plugin path: `./plugins/jeonse-explorer`

2. **운영 주체**
   - 회사명: ACTIGENCE
   - 사업자등록번호: [확인필요: 사용자 입력]
   - 대표: 김용호 (쿠바)
   - 이메일: cio@actigence.ai
   - CPN 파트너십: 온보딩 중 [확인필요: 정확한 단계]

3. **컴플라이언스 자료**
   - `COMPLIANCE.md` 링크
   - 변호사 자문 의견서 공개 요약본 (PDF)
   - 자가 검증 CI 통과 배지 링크

4. **사용 자료**
   - 시연 영상 3편 YouTube URL
   - 베타 테스트 결과 요약 (5~10명 피드백)
   - 시민단체 파일럿 결과 (있는 경우)

5. **카테고리·태그**
   - Category: `legal-data` (또는 `productivity`)
   - Tags: `compliance-safe`, `korean`, `public-data`, `tenant-protection`

6. **연락처**
   - 검수 담당자 이메일: cio@actigence.ai
   - 긴급 컴플라이언스 신고 채널: 동일 이메일

### 4.3 검토 과정

Anthropic 검토는 다음을 거칩니다:

1. **Automated review** (수일 이내)
   - manifest schema 검증
   - 보안 스캔 (악성 코드, 자격증명 노출)
   - 라이선스 검증

2. **Manual review** (1~3주)
   - 도구 동작 검증
   - 컴플라이언스 정책 검토
   - README·docs 품질 평가

3. **답신 가능 결과**
   - ✅ 승인 → community 디렉토리 등재
   - ⚠️ 조건부 승인 → 수정 사항 요청 후 재제출
   - ❌ 반려 → 사유 통보, 재신청 가능

### 4.4 Stage 4 완료 체크리스트

- [ ] 신청서 1차 제출 완료
- [ ] Anthropic 답신 수령
- [ ] (조건부 승인 시) 수정 사항 반영 후 재제출
- [ ] 최종 승인 통지 수령

---

## Stage 5 — Community 디렉토리 등재 (즉시)

### 결과
Anthropic 공식 community marketplace에 plugin이 등재됩니다.

### 사용자 입장에서의 변화

기존 (자체 marketplace):
```bash
/plugin marketplace add yonghot/actigence-marketplace
/plugin install jeonse-explorer@actigence
```

승인 후 (community 마켓플레이스):
```bash
# 별도 marketplace add 불필요 — claude-plugins-community는 자동 가용
/plugin install jeonse-explorer@claude-community
```

### 가시화 채널

- `claude.com/plugins` 디렉토리 페이지에 노출
- Claude Code/Cowork 인스톨 카탈로그에 검색 노출
- Anthropic 공식 community marketplace JSON에 추가

### Stage 5 완료 체크리스트

- [ ] `claude.com/plugins`에서 jeonse-explorer 검색 가능 확인
- [ ] `/plugin install jeonse-explorer@claude-community` 정상 동작
- [ ] ACTIGENCE 블로그 + LinkedIn에 등재 알림 게시

---

## Stage 6 — Anthropic Verified 배지 신청 (선택, 4~8주)

### 목적
"Anthropic Verified" 배지를 받아 검증된 도구임을 사용자에게 명시. 디렉토리 검색 우선순위 향상.

### 추가 검수 기준 (community 등재 기준 + 알파)

- 보안 스캔 강화 (소스 코드 정밀 분석)
- 컴플라이언스 정책 심층 검토
- 사용자 피드백 분석
- Anthropic 직접 사용자 시연 평가
- 운영 안정성 (3개월 이상 무사고)

### 신청 방법

community 등재 후 3개월 이상 운영 → Anthropic CPN 담당자에게 직접 신청 (cpn@anthropic.com 또는 CPN 파트너 채널)

### Stage 6 완료 체크리스트

- [ ] community 등재 후 3개월 이상 운영
- [ ] 컴플라이언스 위반 신고 0건 (또는 모두 해결됨)
- [ ] CPN 담당자에게 Verified 배지 신청
- [ ] 추가 검수 통과
- [ ] Verified 배지 부여

---

## Stage 7 — `claude-plugins-official` 등재 (선별, 미정)

### 목적
Anthropic이 직접 큐레이션하는 최상위 marketplace에 등재.

### 등재 기준 (선별적)

- Anthropic Verified 배지 보유
- 매우 높은 사용자 만족도
- 명확한 카테고리 차별화 (예: 한국 도메인 컴플라이언스 안전 도구의 대표)
- Anthropic의 전략적 가치 (한국 시장 침투, 공익 도구 사례 등)

### 신청 방법

Anthropic CPN 담당자가 직접 권유 또는 사용자가 신청.

### 결과

`claude-plugins-official` marketplace JSON에 추가:
```json
{
  "name": "jeonse-explorer",
  "category": "legal-data",
  "source": { "source": "url", "url": "https://github.com/yonghot/actigence-marketplace.git", "sha": "..." }
}
```

사용자는 별도 marketplace add 없이 즉시 인스톨 가능:
```bash
/plugin install jeonse-explorer
```

### Stage 7 완료 체크리스트

- [ ] Anthropic 측 등재 권유 수령 또는 신청 답신 수령
- [ ] 공식 PR 통과
- [ ] `claude-plugins-official`에 commit됨
- [ ] ACTIGENCE 보도자료 배포

---

## Stage 8 — Phase 2 plugin 추가 (후속)

### 도메인 확장 계획

| Plugin | 도메인 | 출시 목표 |
|---|---|---|
| `voice-phishing-explorer` | 보이스피싱 | jeonse-explorer 안정화 후 +3개월 |
| `kihoek-fraud-explorer` | 기획부동산 사기 | +6개월 |
| `investment-fraud-explorer` | 다단계·코인·리딩방 사기 | +9개월 |

### Phase 2 plugin 추가 절차 (간소화)

이미 marketplace가 등재된 상태이므로, 새 plugin은 다음으로 간소화:

1. `plugins/voice-phishing-explorer/` 디렉토리 추가
2. `marketplace.json`의 `plugins` 배열에 추가
3. `git push` → CI 자동 검증
4. Anthropic 측 자동 갱신 (community marketplace는 PR 머지 시 자동 sync)

각 신규 plugin도 동일한 회피 7원칙 + 변호사 자문 거쳐야 함.

---

## 리스크 관리

### 발생 가능한 문제 + 대응

| 리스크 | 발생 시점 | 대응 |
|---|---|---|
| **Anthropic 검수 반려** | Stage 4 | 사유 분석 → 30일 내 수정 후 재제출 |
| **변호사 자문 부정적** | Stage 3 | Plugin 동작 수정 또는 출시 보류 |
| **컴플라이언스 위반 신고** | Stage 5+ | 48시간 내 답신, 7일 내 패치 |
| **Plugin 인스톨 실패 다발** | Stage 5+ | postinstall 훅 디버깅, README 트러블슈팅 보강 |
| **Verified 배지 거절** | Stage 6 | community 디렉토리는 유지, 3개월 후 재신청 |

### 보험·법적 보호 (Phase 2 검토)

- 배상책임보험: 1억원 한도 약 50~150만원/년
- E&O 보험 (전문직 책임): 컴플라이언스 위반 사고 대비
- 변호사 자문 계약: 월간 자문 200만원 정도

---

## CCAF 인증 활용 (사용자 메모리 기반)

쿠바님이 CCAF (Claude Certified Architect Foundations) 인증 준비 중이시므로, 본 marketplace 출시 자체가 다음 가치를 만듭니다:

1. **CCAF 평가 자료** — 실제 production-ready plugin 출시 경험
2. **Anthropic CPN 파트너십 강화** — 공식 디렉토리 등재 = 검증된 파트너 자산
3. **포트폴리오** — ACTIGENCE B2B 영업 시 사회적 증명
4. **언론 노출** — "한국 최초 변호사법 회피 설계 기반 공익 AI Plugin"

---

## 체크리스트 - 정식 발행 전 최종 확인

### 기술
- [ ] CI 모든 잡 통과 (Compliance + Build + Smoke)
- [ ] 자가 검증 4/4 PASS
- [ ] MCP 서버 stdio 동작 검증
- [ ] PII 가드레일 동작 검증
- [ ] postinstall 훅으로 자동 빌드 동작 확인

### 컴플라이언스
- [ ] COMPLIANCE.md 업데이트 (자문 결과 반영)
- [ ] 변호사 자문 의견서 수령 (17~24번 답변)
- [ ] 자문 의견서 공개 요약본 작성
- [ ] 변협 광고 규정 4조 12호 회피 재검증

### 마케팅·시연
- [ ] 시연 영상 3편 (A/B/C) 제작·업로드
- [ ] ACTIGENCE 블로그 게시물 작성
- [ ] LinkedIn 게시물 작성
- [ ] 동행 커뮤니티 출시 알림

### Anthropic 신청
- [ ] 신청서 작성 (`docs/SUBMISSION-FORM.md` 기반)
- [ ] 신청 자료 첨부 (영상·자문·CI 배지)
- [ ] Console 또는 community 채널 제출
- [ ] 답신 대기 + 후속 대응 준비

---

## 문의

- 정식 발행 관련: cio@actigence.ai
- Anthropic CPN 담당: cpn@anthropic.com [확인필요]
- GitHub Issues: github.com/yonghot/actigence-marketplace/issues
