# Anthropic Plugin Directory 등록 신청서

> 본 신청서는 ACTIGENCE Marketplace의 `jeonse-explorer` plugin을 Anthropic 공식 community plugin directory에 등록하기 위한 자료입니다.
>
> **제출 채널 (택 1)**:
> - 권장: `platform.claude.com/plugins/submit`
> - 대안: `claude.ai/settings/plugins/submit`
> - 또는: `clau.de/plugin-directory-submission`
>
> **본 문서 사용법**: 각 항목을 신청 폼에 복사하여 입력하거나, 본 문서 자체를 PDF로 변환하여 첨부

---

## 1. Plugin 기본 정보

| 항목 | 값 |
|---|---|
| **Plugin name** | `jeonse-explorer` |
| **Marketplace name** | `actigence` |
| **Version** | 1.0.0 |
| **License** | MIT |
| **Primary language** | Korean (한국어) |
| **Supported environments** | Claude Cowork, Claude Desktop, Claude Code |

## 2. GitHub 저장소

| 항목 | URL |
|---|---|
| **Marketplace repo** | https://github.com/yonghot/actigence-marketplace |
| **Plugin path** | `./plugins/jeonse-explorer` |
| **marketplace.json** | https://github.com/yonghot/actigence-marketplace/blob/main/.claude-plugin/marketplace.json |
| **plugin.json** | https://github.com/yonghot/actigence-marketplace/blob/main/plugins/jeonse-explorer/.claude-plugin/plugin.json |
| **README** | https://github.com/yonghot/actigence-marketplace/blob/main/plugins/jeonse-explorer/README.md |
| **COMPLIANCE.md** | https://github.com/yonghot/actigence-marketplace/blob/main/plugins/jeonse-explorer/COMPLIANCE.md |
| **License** | https://github.com/yonghot/actigence-marketplace/blob/main/LICENSE |

## 3. 운영 주체 (Author/Owner)

| 항목 | 값 |
|---|---|
| **회사명** | ACTIGENCE |
| **법인 형태** | [확인필요: 사용자 입력 — 주식회사 / 유한회사 등] |
| **사업자등록번호** | [확인필요: 사용자 입력] |
| **소재지** | 대한민국 서울 |
| **대표자** | 김용호 (영문 학술명: Azik Kim) |
| **연락처 이메일** | cio@actigence.ai |
| **회사 홈페이지** | https://actigence.ai |
| **CPN 파트너십** | Anthropic Claude Partner Network 온보딩 중 [확인필요: 정확한 단계] |
| **CCAF 인증** | Claude Certified Architect Foundations 준비 중 |

## 4. Plugin 설명 (Short Description)

전세사기 피해 사건의 유사 공개 판례·정부 통계 분포를 시각화하는 공익 데이터 분석 plugin. 사용자의 객관적 변수(보증금·우선변제권·임대인 보유주택 수 등 7가지)를 입력받아 (1) 전세사기특별법 적용 분포, (2) 보증금 회수 가능성 분포, (3) 가해자 양형 분포를 차트로 반환. 법률 자문이 아닌 데이터 분석 도구.

## 5. Plugin 설명 (Long Description)

본 plugin은 한국의 전세사기 피해자 및 예비 임차인을 위한 **공익 데이터 분석 도구**입니다. 전세사기 사건의 결과는 매우 다양하지만, 피해자가 자신의 상황에 대한 일반적 통계를 얻을 채널이 부족하다는 문제 의식에서 출발했습니다.

**제공 기능**:
- 자연어 질의 자동 분석 (Skills 자동 호출)
- 임대차 계약서·등기부등본·경매 알림 PDF 자동 변수 추출 (Cowork 환경)
- 3가지 분포 차트 (특별법 적용·회수 가능성·양형)
- 공식 지원 기관 4곳 안내

**핵심 차별점**: 변호사법 109조·34조 회피 설계가 코드 레벨에서 강제됩니다.

7가지 회피 원칙:
1. 단정 결과 출력 금지 → 분포 통계만
2. 선택형 입력만 (enum 강제, 자유 텍스트 0개)
3. 공개 데이터만 사용 (유료 판례 DB 0건)
4. 변호사 매칭·추천 0개
5. "무료" 단어 0건
6. 판결문 양식 흉내 0건
7. 면책 배너·워터마크 100% 강제

추가로 다음 가드레일이 코드 레벨에서 동작:
- MCP 도구 input은 Zod enum 강제
- PII 정규식 8종으로 가해자·사용자 식별 정보 입력 시점에 차단
- Sub-agent (`compliance-guardrail`)이 Claude의 응답 출력 직전 정규식 검증
- UI 컴포넌트의 면책 배너·워터마크는 const 강제

## 6. 카테고리·태그

| 항목 | 값 |
|---|---|
| **Primary category** | `legal-data` |
| **Secondary category** | `productivity` |
| **Tags** | `compliance-safe`, `korean`, `public-data`, `tenant-protection`, `jeonse-fraud`, `non-lawyer-operated`, `actigence` |

## 7. 컴플라이언스 자료

### 7.1 사전 변호사 자문

| 항목 | 내용 |
|---|---|
| **자문 변호사** | [확인필요: 변호사 이름·소속] |
| **자문 분야** | IT 법률, 변호사법·변협 광고 규정, AI 컴플라이언스 |
| **자문 시점** | [확인필요: 출시 전 자문 일자] |
| **자문 의견서** | 공개 요약본 첨부 (PDF). 전체 의견서는 비공개. |

### 7.2 코드 레벨 가드레일 검증

GitHub Actions CI 자동 검증 통과 확인:
- 빌드 배지: ![Compliance Check](https://github.com/yonghot/actigence-marketplace/actions/workflows/compliance.yml/badge.svg)
- 검증 항목 10가지 (C-01 ~ C-10):
  - C-01: 단정 표현 0건
  - C-02: 변호사 매칭 컴포넌트 0개
  - C-03: "무료" 단어 0건
  - C-04: 판결문 양식 표제 0건
  - C-05: 자유 텍스트 input 0개
  - C-06: 사용자 입력 영구 저장 코드 0건
  - C-07: 가해자 정보 방어 정규식 존재
  - C-08: 면책 const 강제 존재
  - C-09: 워터마크 const 강제 존재
  - C-10: 공식 지원 기관 4개 const 존재

### 7.3 데이터 출처

모든 데이터는 공공저작물 자유이용(KOGL Type 1) 또는 공개 데이터:

- 사기죄 양형기준: 대법원 양형위원회
- 전세사기특별법 조문: 국가법령정보센터
- 국토부 가결률 통계: 국토교통부 보도자료
- LH 매입 통계: 국토교통부 LH 보도자료
- 공개 판례: 대법원 종합법률정보 (식별 정보 마스킹 완료)

유료 판례 DB(케이스노트·엘박스 등) 사용 0건.

### 7.4 Stateless 원칙

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
| **A — 단일 PDF 자동 분석** | 90초 | [확인필요: YouTube URL] |
| **B — 비교 시뮬레이션** | 60초 | [확인필요: YouTube URL] |
| **C — 폴더 일괄 분석 (시민단체)** | 120초 | [확인필요: YouTube URL] |

영상 시연 시나리오 상세: [docs/COWORK-DEMO.md](https://github.com/yonghot/actigence-marketplace/blob/main/plugins/jeonse-explorer/docs/COWORK-DEMO.md)

### 8.2 베타 테스트 결과

| 항목 | 결과 |
|---|---|
| 베타 테스터 수 | [확인필요: N명] |
| 베타 기간 | [확인필요: 기간] |
| 평균 만족도 | [확인필요: X.X / 5.0] |
| 컴플라이언스 위반 신고 | 0건 |
| 주요 피드백 | [확인필요: 요약] |
| P0·P1 이슈 수정 | 완료 (1.0.1 패치 배포) |

### 8.3 시민단체 파일럿 (선택)

[확인필요: 시민단체 파일럿 진행 여부 및 결과]

## 9. 검수 통과 후 계획

### 9.1 운영 계획
- 매월 국토부 통계 갱신
- 분기별 양형기준 갱신 확인
- 컴플라이언스 위반 신고 48시간 내 답신·7일 내 패치
- Sentry·Vercel Analytics로 운영 모니터링

### 9.2 Phase 2 도메인 확장
- 보이스피싱 모듈 (출시 후 +3개월)
- 기획부동산 사기 모듈 (+6개월)
- 투자사기 모듈 (+9개월)

### 9.3 Anthropic Verified 배지 신청
community 등재 후 3개월 운영 → CPN 채널로 Verified 배지 신청 예정.

## 10. 검수 협조 사항

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

## 11. 동의 사항

본 plugin 등록 신청자는 다음에 동의합니다:

- [x] 본 plugin은 Anthropic Plugin Directory의 콘텐츠 가이드라인을 준수합니다
- [x] 본 plugin은 사용자에게 직접·간접적 피해를 주지 않습니다
- [x] 본 plugin은 변호사법 109조·34조 및 변협 광고 규정의 회피 설계를 코드 레벨에서 강제합니다
- [x] 사용자 입력·결과는 어디에도 저장되지 않습니다 (Stateless)
- [x] 컴플라이언스 위반 신고에 48시간 내 답신, 7일 내 패치를 약속합니다
- [x] Anthropic의 디렉토리 정책 변경 시 즉시 따릅니다

---

## 12. 신청자 정보

**서명**:

성명: 김용호 (Azik Kim)
직책: ACTIGENCE 대표 (CIO)
이메일: cio@actigence.ai
신청일: [확인필요: 신청 날짜]
서명: ____________________

---

## 첨부 파일

1. 변호사 자문 의견서 공개 요약본 (PDF)
2. 시연 영상 3편 YouTube 링크
3. 베타 테스트 결과 보고서 (PDF)
4. ACTIGENCE 사업자등록증 사본 (해당 시)
5. Compliance Check CI 통과 스크린샷

---

**문의**: cio@actigence.ai
**ACTIGENCE 홈페이지**: https://actigence.ai
**Plugin marketplace**: https://github.com/yonghot/actigence-marketplace
