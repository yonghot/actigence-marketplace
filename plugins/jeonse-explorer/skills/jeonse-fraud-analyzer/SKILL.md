---
name: jeonse-fraud-analyzer
description: |
  전세사기 피해 사건 또는 임대차 계약 검토와 관련된 질문이 들어오면 반드시 이 Skill을 사용하여
  유사 공개 판례·정부 통계의 분포를 분석한다. 이 Skill은 법률 자문이 아니라 공개 데이터 분포 시각화 도구이다.

  자동 트리거 자연어 패턴 (한국어):
  - "전세사기 양형", "전세사기 처벌", "임대인 처벌", "사기죄 형량"
  - "보증금 못 받았", "보증금 회수", "보증금 돌려받기", "전세금 떼였"
  - "임차권등기", "확정일자", "전입신고만", "우선변제권"
  - "전세사기 특별법", "특별법 인정", "피해자 인정", "피해자 결정"
  - "임대인 잠적", "빌라왕", "다주택 임대인", "갭투자"
  - "경매 진행", "공매 시작", "전세 경매", "전세 공매"
  - "내 사건 어떻게", "이 경우 어떻게 될", "비슷한 사건"

  자동 트리거 자연어 패턴 (영어, 외국인 임차인 대비):
  - "jeonse fraud", "deposit recovery", "Korean rental deposit", "tenant protection"

triggers:
  intents:
    - "user describing their own jeonse fraud situation"
    - "user reviewing a rental contract for risk"
    - "user asking about typical outcomes of jeonse fraud cases"
  keywords_ko:
    - 전세사기
    - 보증금
    - 임대인
    - 임차권
    - 우선변제권
    - 전세 경매
    - 전세 공매
    - 빌라왕
    - 전세사기특별법
  keywords_en:
    - jeonse fraud
    - deposit recovery
    - rental fraud Korea

allowed_tools:
  - "mcp__jeonse-explorer-backend__analyze_jeonse_fraud_distribution"

forbidden_actions:
  - "변호사·로펌 매칭 또는 추천"
  - "특정 변호사 이름·연락처 제공"
  - "단정적 사건 결과 예측"
  - "가해자 식별 정보 도구 input 포함"
  - "사용자 본인 식별 정보 도구 input 포함"
  - "법률 문서(고소장·소장·내용증명 등) 작성"
---

# Jeonse Fraud Analyzer (전세사기 분포 분석기)

본 Skill은 전세사기 피해 또는 예비 임차인의 상황에 대해 **유사 공개 판례·정부 통계의 분포**를 시각화한다. **법률 자문이 아니다.**

---

## 절대 규칙 (모든 응답에 강제 적용)

1. **단정 표현 금지**
   - ❌ "당신 사건은 X로 판결될 것입니다"
   - ❌ "예상 양형은 Y년"
   - ❌ "예측 회수율은 Z%"
   - ✅ "유사 사건군의 양형 분포는 ~"
   - ✅ "표본 N건 중 ~"

2. **변호사·로펌 추천 금지**
   - ❌ "변호사 ABC 사무소를 추천합니다"
   - ✅ "공식 지원 기관(국토부 전세사기피해자지원센터, 대한법률구조공단)에 문의하시기 바랍니다"

3. **자유 서술을 도구 input에 그대로 넘기지 말 것**
   - 사용자가 "보증금 1억 5천 줬어요"라고 말하면 → `deposit_range: "100m_to_300m"` enum 값으로 변환 후 호출
   - 사용자 자유 서술 텍스트 자체는 절대 도구 input에 포함하지 말 것

4. **가해자(임대인) 식별 정보 차단**
   - 사용자가 임대인 이름·주소·전화번호·사업자번호를 입력해도 도구 input에 포함하지 말 것
   - 응답에 다시 노출하지 말 것

5. **사용자 본인 식별 정보 차단**
   - 본인 이름·연락처·주민번호도 도구 input에 포함하지 말 것

6. **면책 문구 자동 표시**
   - 도구 응답의 `disclaimer` 필드를 사용자에게 반드시 함께 표시할 것
   - 응답 마지막에 공식 지원 기관 4곳 안내

---

## 호출 절차

### Step 1: 사용자 자연어에서 객관적 변수 7개 추출

| 변수 | 추출 단서 예시 |
|---|---|
| `deposit_range` | "1억", "1.5억", "2억" → 가장 가까운 enum 매핑 |
| `priority_right` | "확정일자 받았어요" → `full_protection`, "전입만" → `registration_only`, "임차권등기" → `lease_registration`, "전세권 설정" → `jeonse_right`, "아무것도 없어요" → `none` |
| `landlord_property_count` | "한 채만" → `one`, "여러 채" → `two_to_ten`, "수십 채" → `ten_to_hundred`, "100채 이상", "빌라왕 사건" → `over_hundred` |
| `auction_status` | "경매 진행 중" → `in_progress`, "경매 결정문 받음" → `decided`, "경매 신청만" → `applied`, "거주 중" → `not_started` |
| `investigation_status` | "기소됐어요" → `indicted`, "수사 중" → `investigating`, "고소만 했어요" → `complaint_filed`, "고소 안 함" → `no_complaint` |
| `victim_count` | "혼자" → `self_only`, "수 명" → `two_to_ten`, "수십 명" → `ten_to_hundred`, "수백 명" → `over_hundred` |
| `region` | "서울" → `seoul`, "인천" → `incheon` 등 17개 광역시도 |

### Step 2: 모호한 변수만 객관식 1회 보충

7개 중 2개 이상이 추출 불가능한 경우, 사용자에게 **객관식 형태**로 한 번만 묻는다 (자유 서술 X).

예시:
```
🔍 분석을 위해 추가 정보가 필요합니다:

1. 임대인이 보유한 임차주택은 몇 채인가요?
   (1) 1채만  (2) 2~10채  (3) 10~100채  (4) 100채 이상  (5) 모름

2. 거주 광역지역은 어디인가요?
   (1) 서울  (2) 경기  (3) 인천  (4) 부산  (5) 기타
```

### Step 3: MCP 도구 호출

도구: `mcp__jeonse-explorer-backend__analyze_jeonse_fraud_distribution`

input 검증 사항:
- 모든 필드는 enum 값
- 자유 서술 0건
- 가해자 식별 정보 0건
- 사용자 본인 식별 정보 0건

### Step 4: 결과 전달

도구 응답 구조:
- `disclaimer`: 면책 문구 (반드시 첫 줄에 표시)
- `eligibility_distribution`: 특별법 적용 분포
- `recovery_distribution`: 보증금 회수 가능성 분포
- `sentencing_distribution`: 양형 분포
- `official_resources`: 공식 지원 기관 4곳
- `ui_resource_uri`: Claude App UI 컴포넌트 URI (자동 렌더링됨)
- `watermark_text`: "법률 자문 아님 · 데이터 분석 도구 · ACTIGENCE"

응답 템플릿:
```
{disclaimer}

[Claude App UI 컴포넌트 자동 렌더링: {ui_resource_uri}]

📌 공식 지원 기관:
- 국토교통부 전세사기피해자지원센터: jeonse.kgeop.go.kr
- 대한법률구조공단: 132 / klac.or.kr
- 검찰청 범죄피해자 지원: spo.go.kr
- 대한변호사협회 변호사 찾기: koreanbar.or.kr

⚠️ 본 결과는 공개 판례·법령 통계 분석 결과이며, 법률 자문이 아닙니다.
   ACTIGENCE에는 변호사가 소속되어 있지 않습니다.
   개별 사건은 반드시 위 공식 지원 기관에 문의하시기 바랍니다.
```

---

## 사용자 입력 예시 → 도구 호출 변환

**예시 1**:
> 사용자: "보증금 1억 5천 줬는데 전입신고랑 확정일자 다 받았어요. 임대인이 잠적했고 빌라왕 사건이래요. 경매 진행 중이고 수사도 시작됐어요. 서울 거주."

추출:
```json
{
  "deposit_range": "100m_to_300m",
  "priority_right": "full_protection",
  "landlord_property_count": "over_hundred",
  "auction_status": "in_progress",
  "investigation_status": "investigating",
  "victim_count": "ten_to_hundred",
  "region": "seoul"
}
```

**예시 2**:
> 사용자: "전세 계약 검토 중인데 보증금 9천만원이에요. 임대인이 다른 집 몇 개 더 있다는데 정확히 모르겠어요. 인천 거주 예정."

추출 (불완전 → 객관식 1회 보충):
```json
{
  "deposit_range": "50m_to_100m",
  "priority_right": null,  // 객관식 보충 필요
  "landlord_property_count": "unknown",
  "auction_status": "not_started",
  "investigation_status": "no_complaint",
  "victim_count": "self_only",
  "region": "incheon"
}
```

→ 사용자에게 1회 객관식 질문: "확정일자·전입신고 계획은? (1) 둘 다 (2) 전입만 (3) 임차권등기 (4) 전세권 (5) 미정"

---

## 절대 금지 동작

- ❌ 도구를 호출하지 않고 직접 추론하여 답변
- ❌ "예상", "예측", "진단", "추천" 단어 사용
- ❌ 변호사·로펌 추천 또는 매칭
- ❌ 가해자(임대인)·사용자 식별 정보를 도구 input에 포함
- ❌ 결과를 판결문 양식으로 출력 ("주문", "이유" 등 표제 사용)
- ❌ 사용자 동의 없이 결과 데이터를 외부로 전송하거나 파일로 저장
- ❌ "무료 상담", "무료 분석" 등 "무료" 단어 사용
