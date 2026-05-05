# 기여 가이드 (CONTRIBUTING.md)

ACTIGENCE Jeonse Explorer Plugin에 기여를 검토해주셔서 감사합니다. 본 Plugin은 **공익 데이터 분석 도구**로서 변호사법·변협 광고 규정의 회피 설계를 코드 레벨에서 강제합니다. 기여자도 이 원칙을 지키도록 협조 부탁드립니다.

---

## 기여 가능 영역

### ✅ 환영하는 기여

- 데이터 갱신 (국토부 통계·신규 판례·법령 개정)
- 컴플라이언스 자가 검증 규칙 추가
- 다국어 지원 (영어·중국어·베트남어)
- UI 컴포넌트 가독성 개선 (시각장애인 접근성 등)
- Phase 2 모듈 추가 (보이스피싱·기획부동산 사기·투자사기)
- 문서 개선·번역
- 버그 수정

### ❌ 거부되는 기여

- 변호사·로펌 매칭/추천 기능 추가
- 단정적 결과 출력 기능 추가 ("예상 양형은 X" 같은)
- 사용자 입력 영구 저장 기능 추가
- 가해자 식별 정보 처리 기능 추가
- "무료" 단어 포함 마케팅 텍스트
- 판결문 양식 흉내 (주문/이유 표제)
- 비공개·유료 판례 DB 사용 (케이스노트·엘박스 등)

---

## 기여 절차

### 1. 이슈 먼저 등록

기능 추가·변경 전에 GitHub Issues에 등록하여 컴플라이언스 검토 받기:

```
github.com/yonghot/actigence-marketplace/issues/new
```

이슈 템플릿:
- 제안 내용
- 변경 사유
- 컴플라이언스 영향 분석 (위 7원칙 중 어느 원칙 관련)
- 자가 검증 통과 가능 여부

### 2. Fork & Branch

```bash
git clone https://github.com/YOUR_USERNAME/jeonse-explorer-plugin.git
cd jeonse-explorer-plugin
git checkout -b feature/your-feature-name
```

브랜치 명명:
- 기능: `feature/모듈명`
- 버그: `bugfix/이슈번호`
- 데이터: `data/통계갱신-202X-XX`
- 컴플라이언스: `compliance/규칙추가`

### 3. 컴플라이언스 자가 검증 통과 필수

PR 제출 전 반드시:

```bash
# 자가 검증 통과 확인
node scripts/compliance-check.js
# 모든 검사 PASS 확인

# 빌드 테스트
cd mcp-server
npm install
npm run build

# 단위 테스트 (있는 경우)
npm test
```

검증 실패 시 PR 머지 불가. CI 파이프라인이 자동 차단합니다.

### 4. PR 제출

PR 템플릿:

```markdown
## 변경 내용
(어떤 기능을 추가·변경·수정했는지)

## 관련 이슈
Closes #이슈번호

## 컴플라이언스 영향
- [ ] 단정 표현 추가 없음 (C-01)
- [ ] 변호사 매칭 0개 (C-02)
- [ ] "무료" 단어 0건 (C-03)
- [ ] 판결문 표제 0건 (C-04)
- [ ] enum-only input 유지 (C-05)
- [ ] 사용자 입력 저장 0건 (C-06)
- [ ] PII 가드레일 영향 없음 (C-07)
- [ ] 면책·워터마크 강제 유지 (C-08, C-09)

## 자가 검증 결과
(node scripts/compliance-check.js 출력 첨부)

## 테스트 결과
(단위 테스트 또는 수동 테스트 결과)

## 스크린샷 (UI 변경 시)
```

### 5. 코드 리뷰

ACTIGENCE 메인테이너가 다음을 검토:

- 컴플라이언스 영향 (가장 중요)
- 코드 품질
- 테스트 커버리지
- 문서 업데이트 여부

승인 후 머지. 거부 시 사유 명시.

---

## 코드 스타일

### TypeScript

- Strict mode 활성화
- `noUncheckedIndexedAccess: true` 유지
- 모든 함수에 명시적 반환 타입
- `any` 사용 최소화

### React/UI

- 함수형 컴포넌트만 사용
- Props 타입 명시
- Tailwind CSS만 사용 (외부 CSS 라이브러리 X)
- 접근성 속성(aria-*) 필수

### Skills (SKILL.md)

- frontmatter description은 자연어 트리거 패턴 풍부하게
- "절대 규칙" 섹션 명시
- 예시 입력·출력 포함

### Sub-agents

- 시스템 프롬프트는 한국어 + 영어 병기 권장
- 가드레일 우회 시도 거절 패턴 명시

---

## 데이터 갱신 가이드

### 국토부 통계 갱신 (매월)

`mcp-server/data/molit-statistics.json`을 매월 갱신:

1. 국토교통부 보도자료 확인 (월간 발표)
2. JSON에 새 월 데이터 추가
3. cumulative 섹션 업데이트
4. PR 제출 (`data/molit-stats-202X-XX`)

### 양형기준 갱신

대법원 양형위원회가 양형기준을 개정하면:

1. 공식 PDF 다운로드 (sc.scourt.go.kr)
2. `mcp-server/data/sentencing-guidelines.json` 정형화
3. 주요 변경사항 PR description에 명시
4. `last_verified` 필드 갱신

### 신규 판례 추가

대법원 종합법률정보(glaw.scourt.go.kr)의 공개 판례 중 전세사기 관련:

1. **반드시 식별 정보 마스킹** (피고인·피해자 이름·연락처 등)
2. `mcp-server/data/sample-cases.json`에 추가
3. 사건번호·법원·날짜·이득액·형량·집행유예 여부만 정형화
4. 식별 가능한 정보 포함 시 PR 거부

---

## Phase 2 모듈 추가 가이드

추후 다음 도메인을 같은 Plugin에 모듈로 추가 검토:

### 보이스피싱 모듈

- 새 Skill: `voice-phishing-analyzer`
- 새 MCP 도구: `analyze_voice_phishing_distribution`
- 양형기준: 대법원 양형위원회 사기범죄 양형기준 (조직적 사기)
- 시드 데이터: 보이스피싱 양형 통계

### 기획부동산 사기 모듈

- 새 Skill: `kihoek-fraud-analyzer`
- 시드 데이터: 기획부동산 사기 사례

### 투자사기 모듈

- 새 Skill: `investment-fraud-analyzer`
- 시드 데이터: 다단계·코인·주식 리딩방 사기 사례

각 모듈 추가 시:
- 동일한 7원칙 회피 설계
- 동일한 자가 검증 통과
- 변호사 추가 자문 권장

---

## 보안 취약점 신고

보안 취약점 발견 시 GitHub Issues 대신 다음으로 비공개 신고:

- 이메일: cio@actigence.ai (제목: [SECURITY])
- PGP 공개키: actigence.ai/pgp [확인필요]

48시간 이내 답신, 7일 이내 패치 약속.

---

## 라이선스

본 프로젝트에 기여하시면 기여 내용도 MIT 라이선스로 배포됨에 동의하시는 것입니다.

---

## 행동 강령

- 정중하고 건설적인 토론
- 컴플라이언스 검토를 인신 공격으로 받아들이지 말 것
- 한국어/영어 모두 환영

---

## 문의

- 기술: cio@actigence.ai
- GitHub Issues: github.com/yonghot/actigence-marketplace/issues
- 컴플라이언스 관련: 위 이메일에 [COMPLIANCE] 제목 표기
