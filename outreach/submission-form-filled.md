# Anthropic Plugin Directory 등록 신청서 (작성본)

본 문서는 `docs/SUBMISSION-FORM.md` 템플릿을 기반으로 ACTIGENCE Marketplace v1.0.0의 정식 등재 신청 본을 채워넣은 버전이다. **자동 채움** 항목은 코드·고정값·Stage 1 결과 기반으로 미리 입력했고, **[인간 입력 필요]** 항목은 베타·자문·녹화 단계 완료 후 인간이 직접 채워야 한다.

> **제출 채널** (택 1):
> - 권장: `platform.claude.com/plugins/submit`
> - 대안: `claude.ai/settings/plugins/submit`
> - 또는: `clau.de/plugin-directory-submission`
>
> **제출 시점**: Stage 2(베타) + Stage 3(자문 + 영상) 완료 후

---

## 진행 체크리스트 (제출 전 확인)

| # | 항목 | 상태 | 위치 |
|---|---|---|---|
| 1 | GitHub repo public 공개 | ✅ 완료 | https://github.com/yonghot/actigence-marketplace |
| 2 | CI 3-job 통과 (compliance + build + smoke) | ✅ 완료 | run 25388551112 |
| 3 | 베타 테스트 진행·결과 정리 | [인간 작업] | `outreach/beta-recruitment.md` 가이드 |
| 4 | 변호사 자문 의견서 수령 | [인간 작업] | `outreach/legal-counsel-brief.md` 가이드 |
| 5 | 시연 영상 3편 녹화·업로드 | [인간 작업] | `outreach/demo-video-storyboards.md` 가이드 |
| 6 | 사업자등록증 PDF 준비 | [인간 작업] | (해당 시) |
| 7 | 본 신청서 [인간 입력 필요] 항목 모두 채움 | [인간 작업] | 본 문서 |
| 8 | 신청서 + 첨부 5종 제출 | [인간 작업] | `platform.claude.com/plugins/submit` |

---

## 1. Plugin 기본 정보 [자동]

| 항목 | 값 |
|---|---|
| **Plugin name** | `jeonse-explorer` |
| **Marketplace name** | `actigence` (marketplace.json의 `name` 필드) |
| **Version** | 1.0.0 |
| **License** | MIT |
| **Primary language** | Korean (한국어) |
| **Supported environments** | Claude Cowork, Claude Desktop, Claude Code |

## 2. GitHub 저장소 [자동]

| 항목 | URL |
|---|---|
| **Marketplace repo** | https://github.com/yonghot/actigence-marketplace |
| **Plugin path** | `./plugins/jeonse-explorer` |
| **marketplace.json** | https://github.com/yonghot/actigence-marketplace/blob/main/.claude-plugin/marketplace.json |
| **plugin.json** | https://github.com/yonghot/actigence-marketplace/blob/main/plugins/jeonse-explorer/.claude-plugin/plugin.json |
| **README** | https://github.com/yonghot/actigence-marketplace/blob/main/plugins/jeonse-explorer/README.md |
| **COMPLIANCE.md** | https://github.com/yonghot/actigence-marketplace/blob/main/plugins/jeonse-explorer/COMPLIANCE.md |
| **License** | https://github.com/yonghot/actigence-marketplace/blob/main/LICENSE |
| **CI 배지** | ![Compliance Check](https://github.com/yonghot/actigence-marketplace/actions/workflows/compliance.yml/badge.svg) |

> ℹ️ Owner는 `yonghot` 개인 계정. 본래 후보였던 GitHub 조직 `actigence`는 캐나다 Actigence Solutions Inc.(2015년 생성)가 점유 중이라 사용 불가. 향후 신규 ACTIGENCE 관련 조직(예: `actigence-ai`) 생성 시 transfer 예정.

## 3. 운영 주체 (Author/Owner)

| 항목 | 값 | 출처 |
|---|---|---|
| **회사명** | ACTIGENCE | [자동] 고정값 |
| **법인 형태** | **[인간 입력 필요]** | 사업자등록증 참조 (주식회사 / 유한회사 / 개인사업자 등) |
| **사업자등록번호** | **[인간 입력 필요]** | XXX-XX-XXXXX 형식 |
| **소재지** | 대한민국 서울 | [자동] (필요 시 정확한 사업장 주소로 수정) |
| **대표자** | 김용호 (영문 학술명: Azik Kim) | [자동] |
| **연락처 이메일** | cio@actigence.ai | [자동] |
| **회사 홈페이지** | https://actigence.ai | [자동] |
| **ORCID** | 0009-0004-8995-9249 | [자동] |
| **CPN 파트너십** | **[인간 입력 필요]** | "심사 중" / "Tier 1 인증" / "Tier 2 인증" 등 정확한 단계 |
| **CCAF 인증** | **[인간 입력 필요]** | "준비 중" / "취득 완료 (날짜)" / "해당 없음" 중 |

## 4. Plugin 설명 (Short Description) [자동]

전세사기 피해 사건의 유사 공개 판례·정부 통계 분포를 시각화하는 공익 데이터 분석 plugin. 사용자의 객관적 변수(보증금·우선변제권·임대인 보유주택 수 등 7가지)를 입력받아 (1) 전세사기특별법 적용 분포, (2) 보증금 회수 가능성 분포, (3) 가해자 양형 분포를 차트로 반환. 법률 자문이 아닌 데이터 분석 도구.

## 5. Plugin 설명 (Long Description) [자동]

본 plugin은 한국의 전세사기 피해자 및 예비 임차인을 위한 **공익 데이터 분석 도구**입니다. 전세사기 사건의 결과는 매우 다양하지만, 피해자가 자신의 상황에 대한 일반적 통계를 얻을 채널이 부족하다는 문제 의식에서 출발했습니다.

**제공 기능**:
- 자연어 질의 자동 분석 (Skills 자동 호출 — 3개 skill: jeonse-document-extractor, jeonse-fraud-analyzer, jeonse-law-summary)
- 임대차 계약서·등기부등본·경매 알림 PDF 자동 변수 추출 (Cowork 환경)
- 3가지 분포 차트 (특별법 적용·회수 가능성·양형)
- 공식 지원 기관 4곳 안내

**핵심 차별점**: 변호사법 109조·34조 회피 설계가 **코드 레벨에서 강제**됩니다.

7가지 회피 원칙:
1. 단정 결과 출력 금지 → 분포 통계만
2. 선택형 입력만 (enum 강제, 자유 텍스트 0개)
3. 공개 데이터만 사용 (유료 판례 DB 0건)
4. 변호사 매칭·추천 0개
5. "무료" 단어 0건
6. 판결문 양식 흉내 0건
7. 면책 배너·워터마크 100% 강제

추가로 다음 가드레일이 코드 레벨에서 동작:
- MCP 도구 input은 Zod enum 강제 (자유 텍스트 차단)
- PII 정규식 8종으로 가해자·사용자 식별 정보 입력 시점에 차단 (주민번호·휴대폰·유선전화·사업자번호·이메일·이름+호칭·상세주소·계좌)
- Sub-agent (`compliance-guardrail`)이 Claude의 응답 출력 직전 정규식 검증
- UI 컴포넌트의 면책 배너·워터마크는 const 강제

## 6. 카테고리·태그 [자동]

| 항목 | 값 |
|---|---|
| **Primary category** | `legal-data` |
| **Secondary category** | `productivity` |
| **Tags** | `compliance-safe`, `korean`, `public-data`, `tenant-protection`, `jeonse-fraud`, `non-lawyer-operated`, `actigence` |

## 7. 컴플라이언스 자료

### 7.1 사전 변호사 자문

| 항목 | 내용 |
|---|---|
| **자문 변호사** | **[인간 입력 필요]** | Stage 3.1 의뢰 후 답변 받은 변호사 이름·소속 |
| **자문 분야** | IT 법률, 변호사법·변협 광고 규정, AI 컴플라이언스 | [자동] |
| **자문 시점** | **[인간 입력 필요]** | 의견서 송부 일자 (YYYY-MM-DD) |
| **자문 의견서** | 공개 요약본 첨부 (PDF). 전체 의견서는 비공개. | [자동] |
| **자문 24개 질문 의뢰서** | https://github.com/yonghot/actigence-marketplace/blob/main/outreach/legal-counsel-brief.md | [자동] |

### 7.2 코드 레벨 가드레일 검증 [자동]

GitHub Actions CI 자동 검증 통과 확인:
- 빌드 배지: ![Compliance Check](https://github.com/yonghot/actigence-marketplace/actions/workflows/compliance.yml/badge.svg)
- 검증 항목 10가지 (C-01 ~ C-10):
  - C-01: 단정 표현 0건 (`예상`, `예측`, `진단`, `추천` 등)
  - C-02: 변호사 매칭 컴포넌트 0개
  - C-03: "무료" 단어 0건
  - C-04: 판결문 양식 표제 0건
  - C-05: 자유 텍스트 input 0개 (Zod enum 강제)
  - C-06: 사용자 입력 영구 저장 코드 0건 (stateless)
  - C-07: 가해자 정보 방어 정규식 존재 (PII 8종)
  - C-08: 면책 const 강제 존재 (`DisclaimerBanner.tsx`)
  - C-09: 워터마크 const 강제 존재 (`Watermark.tsx`)
  - C-10: 공식 지원 기관 4개 const 존재 (변호사·로펌 0건)

자체 검증 스크립트: `scripts/compliance-check.js`. 매 push 시 GitHub Actions에서 자동 재검증.

CI 첫 통과 결과: run 25388551112 (Compliance ✅ + Build ✅ + Smoke ✅)

### 7.3 데이터 출처 [자동]

모든 데이터는 공공저작물 자유이용(KOGL Type 1) 또는 공개 데이터:

- 사기죄 양형기준: 대법원 양형위원회
- 전세사기특별법 조문: 국가법령정보센터
- 국토부 가결률 통계: 국토교통부 보도자료
- LH 매입 통계: 국토교통부 LH 보도자료
- 공개 판례: 대법원 종합법률정보 (식별 정보 마스킹 완료)

유료 판례 DB(케이스노트·엘박스 등) 사용 0건.

### 7.4 Stateless 원칙 [자동]

| 항목 | 정책 |
|---|---|
| 사용자 입력 | 메모리에서만 처리, 응답 반환 즉시 폐기 |
| 분석 결과 | 메모리에서만 처리, 응답 반환 즉시 폐기 |
| 세션 정보 | MCP 서버 세션 ID 비활성화 |
| 데이터베이스 | 정적 공개 데이터만 저장. 사용자 데이터 저장 테이블 0개 |
| Supabase RLS | anon 키는 SELECT만 가능 (사용자 데이터 INSERT 불가능) |

## 8. 시연 자료

### 8.1 시연 영상 3편 (YouTube)

| 시나리오 | 길이 | URL |
|---|---|---|
| **A — 단일 PDF 자동 분석** | 90초 | **[인간 입력 필요]** Stage 3.2 영상 업로드 후 |
| **B — 비교 시뮬레이션** | 60초 | **[인간 입력 필요]** Stage 3.2 영상 업로드 후 |
| **C — 폴더 일괄 분석 (시민단체)** | 120초 | **[인간 입력 필요]** Stage 3.2 영상 업로드 후 |
| **재생목록 (3편 묶음)** | — | **[인간 입력 필요]** YouTube Playlist URL |

콘티 상세: https://github.com/yonghot/actigence-marketplace/blob/main/outreach/demo-video-storyboards.md
영상 시연 시나리오 상세: https://github.com/yonghot/actigence-marketplace/blob/main/plugins/jeonse-explorer/docs/COWORK-DEMO.md

### 8.2 베타 테스트 결과

| 항목 | 결과 |
|---|---|
| 베타 테스터 수 | **[인간 입력 필요]** N명 |
| 베타 기간 | **[인간 입력 필요]** YYYY-MM-DD ~ YYYY-MM-DD (N일) |
| 활성 응답률 | **[인간 입력 필요]** N/M (X%) |
| 평균 만족도 (5점 척도) | **[인간 입력 필요]** X.X / 5.0 (5문항 평균) |
| - 1번 skill 트리거 정확도 | **[인간 입력 필요]** X.X |
| - 2번 차트 가독성 | **[인간 입력 필요]** X.X |
| - 3번 컴플라이언스 신뢰도 | **[인간 입력 필요]** X.X |
| - 4번 응답 속도 | **[인간 입력 필요]** X.X |
| - 5번 실용성 | **[인간 입력 필요]** X.X |
| 컴플라이언스 위반 신고 | **[인간 입력 필요]** N건 (위반 발견 시 hotfix 또는 v1.0.1 패치 일자 기재) |
| 주요 피드백 (좋았던 점·아쉬운 점·v1.0.1 요청 키워드) | **[인간 입력 필요]** 자유 의견 정리 |
| P0·P1 이슈 수정 | **[인간 입력 필요]** 완료 / 진행 중 / 해당 없음 |

베타 가이드 상세: https://github.com/yonghot/actigence-marketplace/blob/main/outreach/beta-recruitment.md

### 8.3 시민단체 파일럿 (선택)

**[인간 입력 필요]** — 시민단체 파일럿 진행 여부 및 결과. 진행하지 않은 경우 "v1.0 출시 시점에는 미진행, Phase 2에서 추진" 등으로 기재.

## 9. 검수 통과 후 계획 [자동]

### 9.1 운영 계획
- 매월 국토부 통계 갱신
- 분기별 양형기준 갱신 확인
- 컴플라이언스 위반 신고 48시간 내 답신·7일 내 패치
- Sentry·Vercel Analytics로 운영 모니터링

### 9.2 Phase 2 도메인 확장
- 보이스피싱 모듈 (출시 후 +3개월)
- 기획부동산 사기 모듈 (+6개월)
- 임금체불 분포 분석 모듈 (+9개월)
- 중고거래 사기 분포 분석 모듈 (+12개월)

### 9.3 Anthropic Verified 배지 신청
community 등재 후 3개월 운영 → CPN 채널로 Verified 배지 신청 예정.

## 10. 검수 협조 사항 [자동]

### 10.1 신속 답신 채널
- 검수 담당자 직접 연락: cio@actigence.ai
- 24시간 내 답신 보장
- Slack/Discord 채널 추가 협의 가능

### 10.2 코드 검수 접근 권한
- GitHub repo는 public으로 공개
- 비공개 자료(변호사 자문 의견서 전체본 등)는 검수 담당자에게 직접 송부 가능

### 10.3 시연 협조
- Anthropic 측 검수 담당자에게 90분 라이브 시연 가능
- 한국어/영어 모두 지원
- Cowork 환경 시연 + 컴플라이언스 가드레일 동작 시연

## 11. 동의 사항 [자동]

본 plugin 등록 신청자는 다음에 동의합니다:

- [x] 본 plugin은 Anthropic Plugin Directory의 콘텐츠 가이드라인을 준수합니다
- [x] 본 plugin은 사용자에게 직접·간접적 피해를 주지 않습니다
- [x] 본 plugin은 변호사법 109조·34조 및 변협 광고 규정의 회피 설계를 코드 레벨에서 강제합니다
- [x] 사용자 입력·결과는 어디에도 저장되지 않습니다 (Stateless)
- [x] 컴플라이언스 위반 신고에 48시간 내 답신, 7일 내 패치를 약속합니다
- [x] Anthropic의 디렉토리 정책 변경 시 즉시 따릅니다

---

## 12. 신청자 정보

**서명 양식**:

| 항목 | 값 |
|---|---|
| 성명 | 김용호 (Azik Kim) |
| 직책 | ACTIGENCE 대표 (CIO) |
| 이메일 | cio@actigence.ai |
| 신청일 | **[인간 입력 필요]** 신청 제출 일자 (YYYY-MM-DD) |
| 서명 | **[인간 입력 필요]** PDF 변환 시 도장 또는 전자서명 삽입 |

---

## 13. 첨부 파일 5종 (제출 시 함께 송부)

| # | 파일 | 출처 / 작성 주체 | 형식 |
|---|---|---|---|
| 1 | 변호사 자문 의견서 **공개 요약본** | Stage 3.1 자문 변호사 | PDF, 1~2페이지, 도장·서명 포함 |
| 2 | 시연 영상 3편 YouTube URL | Stage 3.2 영상 제작자 | URL 본문 인용 + 본 신청서 8.1에 기재 |
| 3 | 베타 테스트 결과 보고서 | Stage 2 인간 정리 | PDF 또는 본 신청서 8.2에 직접 기재 |
| 4 | ACTIGENCE 사업자등록증 사본 | 의뢰자 | PDF, 개인정보 마스킹 후 |
| 5 | Compliance Check CI 통과 스크린샷 | Stage 1 자동 캡처 | PNG 또는 본 신청서 7.2 배지 인용 |

> 📌 비공개 자료(자문 의견서 전체본·내부 운영 메모)는 Anthropic 검수 담당자에게 별도 비공개 채널로 송부 가능.

---

## 14. 인간 작업 가이드 (제출 직전 체크리스트)

### 14.1 [인간 입력 필요] 항목 일괄 체크

신청서 본문에서 `**[인간 입력 필요]**` 마커를 모두 검색해 채운다. 총 13개 위치:

| # | 위치 | 항목 |
|---|---|---|
| 1 | 3. 운영 주체 | 법인 형태 |
| 2 | 3. 운영 주체 | 사업자등록번호 |
| 3 | 3. 운영 주체 | CPN 파트너십 단계 |
| 4 | 3. 운영 주체 | CCAF 인증 상태 |
| 5 | 7.1 자문 | 자문 변호사 이름·소속 |
| 6 | 7.1 자문 | 자문 시점 |
| 7~10 | 8.1 시연 영상 | 4개 URL (시나리오 A/B/C + 재생목록) |
| 11 | 8.2 베타 | 베타 결과 7개 항목 (한 번에 일괄 채움) |
| 12 | 8.3 시민단체 파일럿 | 진행 여부 |
| 13 | 12. 서명 | 신청일 + 서명 |

### 14.2 첨부 파일 5종 준비

신청 제출 폼에서 다음 파일을 업로드 또는 링크로 송부:

1. ✅ 변호사 자문 의견서 공개 요약본 (PDF, Stage 3.1 결과)
2. ✅ 시연 영상 3편 YouTube URL (Stage 3.2 결과 — 본 신청서 8.1에 기재)
3. ✅ 베타 테스트 결과 보고서 (PDF — 본 신청서 8.2에 기재 또는 별도 PDF)
4. ✅ ACTIGENCE 사업자등록증 사본 (PDF, 개인정보 마스킹)
5. ✅ Compliance Check CI 통과 스크린샷 (PNG — 본 신청서 7.2 배지 인용으로 대체 가능)

### 14.3 제출 채널 (택 1)

- 권장: https://platform.claude.com/plugins/submit
- 대안: https://claude.ai/settings/plugins/submit
- 또는: https://clau.de/plugin-directory-submission

> 신청 직후 cio@actigence.ai로 검수 담당자 회신 채널 확인. 24시간 이내 회신 미수신 시 추가 연락 (CPN 담당자 또는 community 채널).

---

## 15. 제출 후 후속 단계 (Stage 5~8)

| Stage | 내용 | 수행 주체 | 예상 기간 |
|---|---|---|---|
| 5 | Anthropic 검수 → Community Plugin Directory 등재 | Anthropic | 1~4주 |
| 6 | Verified 배지 신청 | 인간 (CPN 채널) | community 등재 후 3개월 운영 후 |
| 7 | claude-plugins-official 등재 (만약 Anthropic 권유 시) | Anthropic 권유 | 별도 |
| 8 | Phase 2 plugin 추가 (보이스피싱·기획부동산 등) | ACTIGENCE | v1.0 등재 후 3개월~ |

---

**문서 작성 일자**: 2026-05-06
**문서 버전**: v1.0 (Stage 4 산출물 — 인간 입력 13개 위치 대기)
**문의**: cio@actigence.ai
**ACTIGENCE 홈페이지**: https://actigence.ai
**Plugin marketplace**: https://github.com/yonghot/actigence-marketplace
