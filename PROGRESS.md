# ACTIGENCE Marketplace v1.0.0 — 정식 발행 진행 상태

본 문서는 ACTIGENCE Marketplace의 Anthropic 공식 디렉토리 정식 등재 8단계 로드맵 중 Stage 0~4의 진행 상태를 추적한다. Stage 5~8은 후속 세션 또는 인간 단독 수행.

| 항목 | 값 |
|---|---|
| 운영 주체 | ACTIGENCE (변호사 미소속 데이터 분석 회사) |
| 도메인 / 이메일 | actigence.ai / cio@actigence.ai |
| 대표 | 김용호 (영문 학술명 Azik Kim, ORCID 0009-0004-8995-9249) |
| GitHub repo | yonghot/actigence-marketplace |
| Plugin v1.0.0 | jeonse-explorer (전세사기 분포 분석) |
| 작업 시작일 | 2026-05-06 |

---

## 8단계 로드맵 진행 상태

| Stage | 내용 | 수행 주체 | 상태 |
|---|---|---|---|
| 0 | 사용자 입력 확인 (경로/owner/일정) | Claude Code | ✅ 완료 |
| 1 | GitHub 공개 + CI 통과 | Claude Code | ✅ 완료 |
| 2 | 베타 자료 준비 | Claude Code (자료) + 인간 (실행) | ✅ 자료 작성 완료 / ⏳ 인간 실행 대기 |
| 3 | 변호사 자문 의뢰서 + 시연 콘티 | Claude Code (자료) + 인간 (자문·녹화) | ✅ 자료 작성 완료 / ⏳ 인간 실행 대기 |
| 4 | 등록 신청서 채워넣기 | Claude Code (작성) + 인간 (제출) | ✅ 작성 완료 / ⏳ 인간 입력·제출 대기 |
| 5 | Community 디렉토리 등재 | Anthropic 검수 | ⏳ 후속 |
| 6 | Verified 배지 신청 | 인간 (CPN 채널) | ⏳ 후속 |
| 7 | claude-plugins-official 등재 | Anthropic 권유 | ⏳ 후속 |
| 8 | Phase 2 plugin 추가 | 후속 | ⏳ 후속 |

---

## Stage 0: 사용자 입력 확인

- 시작: 2026-05-06
- 완료: 2026-05-06
- 산출물: 본 PROGRESS.md
- 상태: ✅ 완료
- 입력 결과:
  - zip 파일: `D:\ClaudeCode\plug-in\actigence-marketplace-v1.0.0.zip` → `actigence-marketplace/` 디렉토리로 압축 해제 완료
  - GitHub owner: **`yonghot`** (개인 계정)
    - 본래 후보 `actigence` 조직은 **캐나다 Actigence Solutions Inc.** (2015년 생성, info@actigence.com)가 이미 점유 중. 사용자 `yonghot` 계정에 push 권한 없음
    - 사용자가 `yonghot/actigence-marketplace` 개인 repo 사용을 선택. 추후 신규 조직(예: `actigence-ai` 또는 `actigence-kr`) 생성 시 transfer 가능
    - 모든 코드/문서의 `actigence/actigence-marketplace`, `actigence/jeonse-explorer-plugin` 참조를 `yonghot/actigence-marketplace`로 일괄 치환 완료 (운영 주체 도메인 `actigence.ai`·이메일 `cio@actigence.ai`는 그대로 유지)
  - 베타 모집 일정: 미정 (Stage 2 자료의 일정 항목은 [확인필요] 처리)
- 다음 인간 액션: 없음

---

## Stage 1: GitHub 공개 + CI 통과

- 시작: 2026-05-06
- 완료: 2026-05-06
- 산출물:
  - GitHub repo: https://github.com/yonghot/actigence-marketplace
  - CI 배지 URL: `https://github.com/yonghot/actigence-marketplace/actions/workflows/compliance.yml/badge.svg`
  - 첫 commit: `8e86864` (Initial commit)
  - 두 번째 commit: `29493fc` (fix(ci): MCP smoke tests must initialize before tools/call)
- 상태: ✅ 완료
- 다음 인간 액션: 없음

### 검증 체크리스트

- [x] `node scripts/compliance-check.js` 4/4 PASS (C-01·C-03·C-04 / C-08·C-09·C-10·C-07 / C-02 / C-06)
- [x] `npm install` + tsc(postinstall) 성공, `dist/index-stdio.js` 등 13개 산출물 확인
- [x] MCP `tools/list` smoke test → `analyze_jeonse_fraud_distribution` + `get_jeonse_fraud_law_summary` 도구 응답, enum-only inputSchema 확인
- [x] PII 가드레일 smoke test → `010-1234-5678` 입력 시 `pii_detected` 응답 (severity: critical, pattern: mobile_phone)
- [x] GitHub repo 공개 push (gh auth refresh로 workflow scope 추가 후 성공)
- [x] GitHub Actions 3-job 통과 — run 25388551112 (`success`)
  - ✅ Compliance Self-Check (변호사법 회피 7원칙)
  - ✅ Build jeonse-explorer plugin (MCP server) — type check + tsc + dist 검증
  - ✅ Smoke test MCP server (stdio mode) — list_tools + PII guardrail (initialize lifecycle 준수)

### 발견된 이슈와 수정 (Stage 1 진행 중)

1. **GitHub 조직명 충돌**: `actigence` 조직은 캐나다 Actigence Solutions Inc.가 점유. → `yonghot/actigence-marketplace`로 owner 결정, 모든 repo URL 참조 일괄 치환
2. **gh CLI 토큰 scope 부족**: 첫 push 시 `workflow` scope 누락으로 거부. → `gh auth refresh -h github.com -s workflow` 백그라운드 실행 + device code 캡처(`B21C-5D78`)로 사용자가 브라우저에서 승인. 토큰 갱신 자동 감지 후 push 재시도 성공
3. **CI smoke test의 MCP 프로토콜 lifecycle 누락**: 첫 CI 실행에서 PII guardrail step이 `initialize` 핸드셰이크 없이 `tools/call`을 직접 보내 SDK가 protocol error로 거부, `pii_detected`가 트리거되지 않음. → `INIT → INITIALIZED → 실제 메서드` 순서로 워크플로 수정. 두 번째 CI 실행에서 모두 PASS

### Node.js 20 deprecation (참고)

GitHub Actions가 Node.js 20 → 24 전환 일정 안내. 2026-09-16 이후 Node.js 20 사용 불가. 본 워크플로는 `node-version: '20'` 사용 중이므로 향후 v1.0.1 또는 별도 PR에서 `'24'`로 업데이트 권장 (Phase 2 기능 추가 시 함께 처리).

---

## Stage 2: 베타 배포 자료 준비

- 시작: 2026-05-06
- 완료: 2026-05-06 (자료 작성 부분)
- 산출물: [outreach/beta-recruitment.md](outreach/beta-recruitment.md)
- 상태: ✅ 자료 작성 완료 / ⏳ 인간 실행 대기
- 산출물 구성:
  - 동행 커뮤니티 게시용 모집 메시지 (전세사기 plugin 안내, 변호사법 회피 7원칙 명시, "법률 자문 아님" 강조)
  - 베타 인스톨 가이드 (`/plugin marketplace add yonghot/actigence-marketplace` + `/plugin install jeonse-explorer@actigence`)
  - 3가지 테스트 시나리오 (90초 단일·60초 비교·15초 법령)
  - 정상 동작 5개 / 버그 동작 5개 체크리스트
  - 5문항 피드백 설문 (5점 척도 + 1줄 코멘트 + 자유 의견 4개 + 면접 동의)
  - 베타 결과 정리 양식 (Stage 4 신청서로 이관용)
  - 컴플라이언스 안내 (참여자 사전 공지)
- 다음 인간 액션:
  1. 동행 커뮤니티(250명)에 모집 메시지 게시 (베타 시작일 미정)
  2. 5~10명 베타 테스터 모집
  3. 1~2주 베타 진행
  4. 5문항 피드백 수집 후 Stage 4 신청서 8.2 항목에 결과 정리

---

## Stage 3: 변호사 자문 의뢰서 + 시연 영상 콘티

### Stage 3.1 — 변호사 자문 의뢰서

- 시작: 2026-05-06
- 완료: 2026-05-06 (자료 작성 부분)
- 산출물: [outreach/legal-counsel-brief.md](outreach/legal-counsel-brief.md)
- 상태: ✅ 자료 작성 완료 / ⏳ 인간 실행 대기
- 산출물 구성:
  - 자문 의뢰 배경 (ACTIGENCE 소개 + 회피 7원칙)
  - 변호사 섭외 기준 (IT 법률·플랫폼·AI 컴플라이언스 우선)
  - 자문료 견적 가이드 (단발 50~80만원 / 의견서 200~300만원 ⭐ 권장 / 프로젝트 500만원~)
  - 자문 질문 24개 (B 단계 17개 + C-1 단계 3개 + C-2 단계 4개 ⭐ 핵심)
    - 핵심 4개 (21~24): PDF 자동 추출, Cowork 자동화, 프롬프트 인젝션 우회 책임, Anthropic 검수의 회피 근거 가능성
  - 의견서 형식 (PDF/docx, 도장·서명, 비공개 전체본 + 공개 요약본)
  - 활용 계획 (외부 공개·내부 보관·언론 인용 구분)
  - 회신 양식
- 다음 인간 액션:
  1. 자문 변호사 1인 섭외 (IT 전문 로펌 또는 단독 변호사)
  2. 의뢰서 송부 (사업자등록번호 등 [확인필요] 항목 채워서)
  3. 의견서 수령 (2주 이내 희망)
  4. 공개 요약본을 Stage 4 신청서 7.1에 첨부

### Stage 3.2 — 시연 영상 콘티 3편

- 시작: 2026-05-06
- 완료: 2026-05-06 (자료 작성 부분)
- 산출물: [outreach/demo-video-storyboards.md](outreach/demo-video-storyboards.md)
- 상태: ✅ 자료 작성 완료 / ⏳ 인간 실행 대기
- 산출물 구성:
  - 영상 공통 사양 (1920×1080, 30~60fps, 한국어 내레이션 + 영어 자막, 인트로 3s + 아웃트로 5s, ACTIGENCE 워터마크)
  - 촬영 시 회피 7원칙 주의사항 5종
  - 시나리오 A 90초 콘티 — 12샷 (단일 PDF 자동 분석 → PII 거부 시연)
  - 시나리오 B 60초 콘티 — 8샷 (보증금 1억 vs 2억 비교 시뮬레이션)
  - 시나리오 C 120초 콘티 — 15샷 (시민단체 10건 일괄 분석 + B2B SaaS 가능성 + 프롬프트 인젝션 거부 시연)
  - 영상 제작 워크플로 (사전 준비·녹화·편집·업로드 시간표)
  - 영상 제목·설명 템플릿
- 다음 인간 액션:
  1. 시연용 가짜 PDF 10건 준비 (가해자 이름·주소·전화는 가짜이며 화면 마스킹)
  2. 영상 3편 녹화 (본인 또는 외주, OBS Studio 권장)
  3. DaVinci Resolve로 편집·자막 합성
  4. YouTube 업로드 → 4개 URL을 Stage 4 신청서 8.1에 기재

---

## Stage 4: Anthropic 디렉토리 등록 신청서 채워넣기

- 시작: 2026-05-06
- 완료: 2026-05-06 (자료 작성 부분)
- 산출물: [outreach/submission-form-filled.md](outreach/submission-form-filled.md)
- 상태: ✅ 작성 완료 / ⏳ 인간 입력·제출 대기
- 산출물 구성:
  - 진행 체크리스트 (제출 전 확인 8항목)
  - 1~6 자동 채움 (Plugin 정보, GitHub 저장소, 운영 주체 일부, 설명·카테고리·태그)
  - 7 컴플라이언스 자료 (CI 검증 결과 + 데이터 출처 + Stateless 정책 자동 채움 / 자문 변호사 정보는 [인간 입력 필요])
  - 8 시연 자료 ([인간 입력 필요] 영상 URL 4개 + 베타 결과 7항목)
  - 9~11 검수 후 계획·협조·동의 (자동)
  - 12 신청자 정보 (서명 + 신청일 [인간 입력 필요])
  - 13 첨부 5종 안내 (자문 의견서·영상 URL·베타 결과·사업자등록증·CI 스크린샷)
  - 14 인간 작업 가이드 ([인간 입력 필요] 13개 위치 일괄 체크리스트)
- **인간 입력 필요 항목 13개 위치** (제출 직전 일괄 채움):
  - 운영 주체 4개: 법인 형태 / 사업자등록번호 / CPN 단계 / CCAF 인증
  - 자문 2개: 변호사 이름·소속 / 자문 시점
  - 시연 영상 4개: 시나리오 A·B·C URL + 재생목록 URL
  - 베타 결과 7개: 테스터 수·기간·응답률·만족도(5문항 평균 + 종합) + 위반 신고·피드백·이슈 처리
  - 시민단체 파일럿 1개: 진행 여부
  - 신청자 2개: 신청일 + 서명
- 다음 인간 액션:
  1. 채워진 신청서 [인간 입력 필요] 13개 위치 채움
  2. 첨부 파일 5종 PDF 준비
  3. `platform.claude.com/plugins/submit` 또는 `clau.de/plugin-directory-submission`에 제출
  4. 신청 직후 cio@actigence.ai로 검수 담당자 회신 채널 확인 (24시간 이내 회신 미수신 시 추가 연락)

---

## 다음 인간 액션 종합 (Stage 1~4 자율 작업 완료 후)

### 즉시 가능 (병렬 진행 권장)
1. **베타 모집** ([outreach/beta-recruitment.md](outreach/beta-recruitment.md)) — 동행 커뮤니티 게시 → 5~10명 모집 → 1~2주 진행
2. **변호사 섭외** ([outreach/legal-counsel-brief.md](outreach/legal-counsel-brief.md)) — IT 전문 변호사 1인 섭외 → 의뢰서 송부 → 2주 이내 의견서 수령

### 베타·자문 결과 수렴 후
3. **시연 영상 녹화** ([outreach/demo-video-storyboards.md](outreach/demo-video-storyboards.md)) — 가짜 PDF 10건 준비 → 3편 녹화·편집 → YouTube 업로드
4. **신청서 채움** ([outreach/submission-form-filled.md](outreach/submission-form-filled.md)) — [인간 입력 필요] 13개 위치 채움
5. **신청 제출** — 첨부 5종과 함께 Anthropic Plugin Directory 신청 채널로 송부

### 후속 세션에서 다룰 단계 (Stage 5~8)
- Anthropic 검수 모니터링 (1~4주)
- Verified 배지 신청 (community 등재 후 3개월 운영 후)
- claude-plugins-official 등재 (Anthropic 권유 시)
- Phase 2 plugin 추가 (보이스피싱·기획부동산·임금체불·중고거래 사기)

---

## 회피 7원칙 자가 검증 결과

| # | 원칙 | 상태 | 검증 근거 |
|---|---|---|---|
| 1 | 단정 결과 출력 금지 (분포 통계만) | ✅ PASS | C-01·C-03·C-04 검사 통과. 도구 description에 "예상/예측/진단/추천 단어 사용 금지" 명시 |
| 2 | 선택형 입력만 (enum 강제) | ✅ PASS | tools/list 응답 확인 — analyze 도구 7개 필드 모두 `enum`, additionalProperties:false |
| 3 | 공개 데이터만 사용 | ✅ PASS | 시드 데이터 4종(양형기준·특별법·국토부 통계·표본 판례) 모두 공공 출처 |
| 4 | 변호사 매칭·추천 0개 | ✅ PASS | C-02 검사 통과. lawyer-match·attorney-recommendation 컴포넌트 0건 |
| 5 | "무료" 단어 0건 | ✅ PASS | C-01 검사 통과 |
| 6 | 판결문 양식 흉내 0건 | ✅ PASS | C-01 검사 통과 |
| 7 | 면책 배너·워터마크 100% 강제 | ✅ PASS | C-08·C-09·C-10·C-07 필수 const 검사 통과. UI: DisclaimerBanner.tsx + Watermark.tsx + JeonseResultCard.tsx |

`scripts/compliance-check.js`가 C-01~C-10 규칙으로 본 7원칙을 코드 레벨에서 강제하며, GitHub Actions `compliance` job에서 매 push 시 자동 재검증된다.

추가 PII 가드레일 (보호 대상: 가해자·사용자 본인 식별 정보):
- 입력 단계 다중 레이어 정규식 검증: 주민번호(critical), 휴대폰(critical), 사업자번호(high), 유선전화(high), 이메일(medium), 가해자 이름+호칭(high), 부동산 상세주소(medium), 계좌번호(high)
- smoke test 결과: 가해자 휴대폰 `010-1234-5678` 입력 → `pii_detected` 응답 + 한국어 거부 메시지 + critical severity 마킹
