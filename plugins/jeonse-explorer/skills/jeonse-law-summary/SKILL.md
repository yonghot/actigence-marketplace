---
name: jeonse-law-summary
description: |
  전세사기특별법, 사기죄 양형기준, 우선변제권 등 법령·제도 자체에 대한 정보 질문이 들어오면
  이 Skill을 사용하여 공식 출처 기반 요약을 제공한다. 일반 정보 제공만 담당하며, 사용자 본인
  사건에 대한 분석 요청이 포함된 경우 jeonse-fraud-analyzer Skill로 위임한다.

  자동 트리거 자연어 패턴:
  - "전세사기특별법 인정 요건"
  - "특별법 보증금 한도", "특별법 적용 기준"
  - "우선변제권이 뭐야", "우선변제권 효과"
  - "사기죄 양형기준", "사기죄 형량"
  - "임차권등기 효과", "임차권등기 절차"
  - "LH 우선매수권", "LH 매입제도"
  - "확정일자 받는 법", "전입신고 절차"
  - "전세권 설정", "전세권 vs 임차권"

triggers:
  intents:
    - "user asking about general legal concepts or procedures (not their own case)"
    - "user requesting an explanation of jeonse fraud law"
    - "user wanting to learn about tenant protection mechanisms"
  keywords_ko:
    - 전세사기특별법
    - 사기죄 양형기준
    - 우선변제권
    - 임차권등기
    - 전세권 설정
    - LH 우선매수권
    - 확정일자

allowed_tools:
  - "mcp__jeonse-explorer-backend__get_jeonse_fraud_law_summary"

forbidden_actions:
  - "변호사·로펌 매칭 또는 추천"
  - "특정 사건에 대한 단정적 답변"
  - "법률 자문"
---

# Jeonse Law Summary (전세사기 법령 요약)

본 Skill은 전세사기 관련 법령·제도에 대한 **일반 정보**를 공식 출처 기반으로 제공한다.

---

## 핵심 카테고리

| 카테고리 | 키워드 | 출처 |
|---|---|---|
| `law_overview` | 전세사기특별법 개요, 시행일, 목적 | 국가법령정보센터 |
| `eligibility_requirements` | 특별법 인정 요건 4가지 | 전세사기특별법 제3조 |
| `recovery_options` | 우선변제권·임차권등기·전세권·LH 매입 | 주택임대차보호법, 특별법 제정 |
| `sentencing_guidelines` | 사기죄 양형기준 5유형 | 대법원 양형위원회 (2022 개정) |
| `procedure_guide` | 피해자 결정신청 절차 | 국토부 전세사기피해자지원센터 |

---

## 호출 절차

### Step 1: 사용자 의도 분류

사용자 발화에서 어떤 카테고리를 묻는지 분류:

- "특별법이 뭐야?" → `law_overview`
- "특별법 적용 받으려면?" → `eligibility_requirements`
- "보증금 어떻게 회수해?" → `recovery_options`
- "사기죄 형량이 어떻게 돼?" → `sentencing_guidelines`
- "특별법 신청 어떻게 해?" → `procedure_guide`

### Step 2: 본인 사건 분석 의도 감지 시 위임

사용자 발화에 "내 사건은", "제가 처한 상황은" 같은 본인 사건 분석 의도가 포함되면 즉시 `jeonse-fraud-analyzer` Skill로 위임. 두 Skill을 동시에 호출하지 말 것.

### Step 3: MCP 도구 호출

도구: `mcp__jeonse-explorer-backend__get_jeonse_fraud_law_summary`

input:
```json
{ "category": "<카테고리>" }
```

### Step 4: 결과 전달 (출처 명시 + 면책)

응답 템플릿:
```
{법령 요약 내용}

📚 출처:
- {출처 1}
- {출처 2}

⚠️ 본 정보는 공개 법령·정부 자료 기반의 일반 정보이며, 법률 자문이 아닙니다.
   개별 사건의 적용 여부는 공식 지원 기관 또는 변호사와 상담하시기 바랍니다.

📌 공식 지원 기관:
- 국토교통부 전세사기피해자지원센터: jeonse.kgeop.go.kr
- 대한법률구조공단: 132 / klac.or.kr
```

---

## 사용자 발화 예시

**예시 1 (법령 정보 질문)**:
> "전세사기특별법 인정 요건 4가지가 뭐야?"

→ `category: "eligibility_requirements"` 호출 → 4가지 요건 + 출처 응답

**예시 2 (본인 사건 → 위임)**:
> "전세사기특별법 인정 요건이 뭐야? 그리고 나는 어떻게 적용될 수 있을까?"

→ 본인 사건 분석 의도 감지 → `jeonse-fraud-analyzer`로 위임

---

## 절대 금지

- ❌ 특정 사건의 적용 가능성 단정
- ❌ 변호사·로펌 추천
- ❌ "예상", "예측", "진단" 단어 사용
- ❌ 출처 없는 법령 해석
- ❌ 법령 본문을 100자 이상 그대로 복사 (저작권 회피, 요약·재작성)
