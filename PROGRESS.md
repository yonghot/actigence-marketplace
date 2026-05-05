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
| 1 | GitHub 공개 + CI 통과 | Claude Code | ⏳ 진행 |
| 2 | 베타 자료 준비 | Claude Code (자료) + 인간 (실행) | ⏳ 대기 |
| 3 | 변호사 자문 의뢰서 + 시연 콘티 | Claude Code (자료) + 인간 (자문·녹화) | ⏳ 대기 |
| 4 | 등록 신청서 채워넣기 | Claude Code (작성) + 인간 (제출) | ⏳ 대기 |
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
- 완료: -
- 산출물: GitHub repo URL, CI 배지 URL
- 상태: ⏳ 진행
- 다음 인간 액션: 미정 (Claude Code가 자율 수행 중. `gh auth` 미인증 시 `gh auth login` 안내 예정)

### 검증 체크리스트

- [x] `node scripts/compliance-check.js` 4/4 PASS (C-01·C-03·C-04 / C-08·C-09·C-10·C-07 / C-02 / C-06)
- [x] `npm install` + tsc(postinstall) 성공, `dist/index-stdio.js` 등 13개 산출물 확인
- [x] MCP `tools/list` smoke test → `analyze_jeonse_fraud_distribution` + `get_jeonse_fraud_law_summary` 도구 응답, enum-only inputSchema 확인
- [x] PII 가드레일 smoke test → `010-1234-5678` 입력 시 `pii_detected` 응답 (severity: critical, pattern: mobile_phone)
- [ ] GitHub repo 공개 push (진행 중)
- [ ] GitHub Actions 3-job (compliance + build + smoke) 통과

---

## Stage 2: 베타 배포 자료 준비

- 시작: -
- 완료: -
- 산출물: `outreach/beta-recruitment.md`
- 상태: ⏳ 대기
- 다음 인간 액션:
  1. 동행 커뮤니티(250명)에 모집 메시지 게시
  2. 5~10명 베타 테스터 모집
  3. 1~2주 베타 진행
  4. 5문항 피드백 수집 후 Stage 3으로 이행

---

## Stage 3: 변호사 자문 의뢰서 + 시연 영상 콘티

- 시작: -
- 완료: -
- 산출물:
  - `outreach/legal-counsel-brief.md` (24개 자문 질문)
  - `outreach/demo-video-storyboards.md` (시나리오 A 90초 / B 60초 / C 120초)
- 상태: ⏳ 대기
- 다음 인간 액션:
  1. 자문 변호사 1인 섭외 + 의뢰서 송부
  2. 의견서 수령 (2주 이내)
  3. 시연 영상 3편 녹화·편집·YouTube 업로드

---

## Stage 4: Anthropic 디렉토리 등록 신청서 채워넣기

- 시작: -
- 완료: -
- 산출물: `outreach/submission-form-filled.md`
- 상태: ⏳ 대기
- 다음 인간 액션:
  1. 채워진 신청서 최종 검토
  2. `platform.claude.com/plugins/submit` 또는 `clau.de/plugin-directory-submission`에 제출
  3. 첨부 5종 송부 (자문 의견서·영상 URL·베타 결과·사업자등록증·CI 통과 스크린샷)

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
