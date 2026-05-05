# 시연 영상 콘티 — ACTIGENCE jeonse-explorer 3편

본 문서는 Anthropic Plugin Directory 정식 등록 신청서에 첨부할 시연 영상 3편의 샷 단위 콘티다. 인간(영상 제작자 또는 외주)이 본 콘티대로 녹화·편집·자막을 작성한 후 YouTube에 업로드한다.

| 시나리오 | 길이 | 핵심 메시지 | 활용 처 |
|---|---|---|---|
| **A** — 단일 PDF 자동 분석 | 90초 | "PDF 한 번 던졌더니 90초 만에 결과 + 가해자 정보 자동 거부" | 등록 신청서 메인 |
| **B** — 비교 시뮬레이션 | 60초 | "한 번에 두 시나리오 비교 → 의사결정 도구" | 등록 신청서 보조 |
| **C** — 시민단체 일괄 분석 | 120초 | "수십 건 사례 일괄 처리 + B2B SaaS 가능성" | 등록 신청서 + 영업용 |

## 영상 공통 사양

| 항목 | 값 |
|---|---|
| 해상도 | 1920×1080 (FHD) |
| 프레임 | 30fps (대화·UI 위주) 또는 60fps (애니메이션 강조 시) |
| 음성 | 한국어 내레이션 (성우 또는 본인) |
| 자막 | 한국어 자막(상시) + 영어 자막(선택 노출) — burn-in 또는 .srt |
| 인트로 | ACTIGENCE 로고 + "법률 자문이 아닌 공익 데이터 분석 도구" 자막 (3초) |
| 아웃트로 | "actigence.ai · cio@actigence.ai · MIT License" + GitHub URL (5초) |
| 음악 | 라이선스가 안전한 BGM (저작권 우려 없음), 대화 위주 부분은 음량 낮춤 |
| 화면 캡처 | 실제 Cowork 또는 Claude Code 데스크톱 앱 (테스트 계정 사용) |
| 워터마크 | 우측 하단 "ACTIGENCE | Demo for Anthropic Plugin Directory" |

## 촬영 시 주의사항

- ⚠️ **실제 가해자 식별 정보 절대 사용 금지** — 시연용 PDF에는 가짜 임대인 이름·주소·전화번호를 미리 만들어 넣되, 화면에 비치는 부분은 모두 마스킹 또는 흐림 처리
- ⚠️ **단정 표현 절대 사용 금지** — 내레이션과 자막에서 "예상", "예측", "진단", "추천" 단어 0건 (회피 원칙 1)
- ⚠️ **변호사 매칭 표현 절대 사용 금지** — "변호사를 추천해드립니다" 류 0건 (회피 원칙 4)
- ⚠️ **"무료" 단어 절대 사용 금지** — "참여비 발생하지 않음" 또는 "추가 비용 없음"으로 우회 (회피 원칙 5)
- ⚠️ **판결문 양식 흉내 금지** — 법원 형식의 도장·서명·법원 로고 등장 금지 (회피 원칙 6)

---

# 시나리오 A — 단일 PDF 자동 분석 (90초, 메인)

## A. 샷 콘티 (12샷)

| # | 시간 (s) | 화면 | 사용자 입력 | 내레이션 (한국어) | 자막 (영문) |
|---|---|---|---|---|---|
| A-1 | 0~3 | ACTIGENCE 로고 + 부제 | — | "ACTIGENCE 마켓플레이스. 법률 자문이 아닌 공익 데이터 분석 도구입니다." | "ACTIGENCE Marketplace. A public-interest data analysis tool, not legal advice." |
| A-2 | 3~10 | Claude Code 데스크톱 앱, 빈 채팅창. 좌측 사이드바에 jeonse-explorer plugin 아이콘. | — | "전세사기 피해자가 자기 사건과 비슷한 공개 판례 분포를 90초 안에 보고 싶다고 가정해봅시다." | "Imagine a jeonse fraud victim wants to see the public case distribution similar to their own — within 90 seconds." |
| A-3 | 10~15 | 사용자가 채팅창에 PDF 파일을 드래그&드롭하는 모션. PDF 미리보기 우측에 임차계약서 아이콘. | (드래그&드롭) | "임차계약서 PDF를 채팅에 그대로 던집니다." | "Just drop the lease contract PDF into the chat." |
| A-4 | 15~22 | Claude이 자동으로 plugin을 호출하는 모습. "jeonse-document-extractor skill 활성화" 메시지가 회색 박스로 표시. | — | "jeonse-document-extractor skill이 자동으로 활성화되어 PDF에서 객관 변수만 뽑아냅니다. **자유 텍스트는 받지 않고 미리 정의된 7개 enum 값으로만 매핑합니다.**" | "The skill auto-triggers and extracts only objective variables from the PDF — mapped strictly to 7 predefined enum values. No free text accepted." |
| A-5 | 22~30 | 추출된 7개 변수가 카드 형태로 표시 (보증금 구간, 우선변제권, 임대인 보유 주택 수 등). 가해자 이름·전화 자리는 "🛡 처리 거부됨" 마킹. | — | "보세요, **가해자 식별 정보는 정규식 가드레일이 자동으로 차단**합니다. 이름·전화·주민번호·계좌·주소 모두 거부됩니다." | "Notice — attacker identification (name, phone, account number, address) is automatically blocked by a regex guardrail." |
| A-6 | 30~40 | analyze_jeonse_fraud_distribution 도구 호출 진행 표시 막대. 1초 만에 완료. 결과 차트 3개가 채팅창 안에 인라인으로 표시: 양형 분포, 회수율 분포, 특별법 적용 분포. | — | "MCP 서버가 로컬에서 즉시 분석합니다. 외부 네트워크 호출 없이, **사용자 입력은 영속 저장되지 않습니다.** 분석 후 즉시 폐기됩니다." | "The MCP server analyzes locally — no external network calls. User input is never persisted; it's discarded right after." |
| A-7 | 40~52 | 양형 분포 차트 클로즈업. x축: 양형 (월 단위), y축: 비율(%). 막대 위에 "유사 사건군 N건 중 X% 가 1~3년 형 선고" 레이블. 차트 위·아래에 워터마크 "ACTIGENCE / 분포 통계 / 법률 자문 아님". | — | "차트는 **분포 통계 형식**입니다. '예상 형량은 X개월'이 아니라 '유사 사건군 X% 가 1~3년 형'. 단정 표현은 코드 레벨에서 차단됩니다." | "Charts use distribution-only language — never 'predicted sentence is X months,' but 'X% of similar cases received 1-3 years.' No deterministic phrasing allowed in code." |
| A-8 | 52~62 | 회수율 분포 차트 + 우선변제권 단계별 분포. 차트 하단 면책 배너: "본 정보는 법률 자문이 아닙니다. 사건 결과를 단정·예측하지 않습니다." | — | "회수율과 우선변제권 단계별 분포도 함께 보여줍니다. **모든 차트 하단에 면책 배너가 항상 표시됩니다.**" | "Recovery rate and priority right distributions are also shown. Every chart carries a permanent disclaimer banner." |
| A-9 | 62~72 | 응답 마지막 부분 — 공공 지원 기관 안내 카드 4개 (주거안정 지원센터, 대한법률구조공단, 전세사기 피해자 지원센터, 한국토지주택공사). 변호사·로펌 추천 0건. | — | "마지막에는 **공공 지원 기관**만 안내합니다. 변호사 이름·로펌·연락처는 plugin이 절대 출력하지 않습니다." | "Only public support organizations are listed at the end. Plugin never outputs lawyer names, law firms, or their contact info." |
| A-10 | 72~80 | 사용자가 채팅창에 가해자 휴대폰 번호 "010-1234-5678"을 입력 시도. plugin이 즉시 빨간 거부 카드 + 한국어 메시지 표시: "입력에 식별 정보가 포함되었습니다. 본 도구는 이를 처리하지 않습니다." | "010-1234-5678..." | "사용자가 가해자 번호를 의도적으로 넣어보겠습니다. 보세요, **즉시 차단**됩니다. critical severity 마킹 + 한국어 안내. 이건 코드 레벨에서 정규식으로 강제됩니다." | "If a user intentionally tries an attacker's phone number — instant block, marked critical severity, friendly Korean rejection. This is enforced at the code level via regex." |
| A-11 | 80~85 | "회피 7원칙 코드 검증 통과" 배지 (GitHub Actions Compliance Check passing) + repo URL 표시. | — | "이 모든 동작은 GitHub Actions에서 매 push마다 자동 검증됩니다. 회피 7원칙 위반은 빌드를 통과하지 못합니다." | "All these behaviors are auto-verified by GitHub Actions on every push. Any violation of the 7 compliance principles fails the build." |
| A-12 | 85~90 | ACTIGENCE 아웃트로 카드. 이메일·도메인·GitHub URL·MIT License. | — | "ACTIGENCE. 한국 사회 문제 도메인을 위한 컴플라이언스 안전 공익 데이터 분석 plugin." | "ACTIGENCE — compliance-safe public-interest data analysis plugins for Korean societal domains." |

## A. 핵심 강조 멘트 정리

1. ✅ "PDF 한 번 던졌더니 90초 만에 결과" (A-3 → A-9)
2. ✅ "가해자 정보는 처리하지 않습니다라고 명시" (A-5, A-10)
3. ✅ "차트가 채팅에 인라인으로" (A-6, A-7)
4. ✅ "분석 후 즉시 폐기" (A-6)

---

# 시나리오 B — 비교 시뮬레이션 (60초)

## B. 샷 콘티 (8샷)

| # | 시간 (s) | 화면 | 사용자 입력 | 내레이션 (한국어) | 자막 (영문) |
|---|---|---|---|---|---|
| B-1 | 0~3 | ACTIGENCE 로고 + 부제 | — | "예비 임차인이 보증금 1억과 2억 두 가지를 비교하고 싶어합니다." | "An aspiring tenant wants to compare two deposit scenarios: 100M KRW vs 200M KRW." |
| B-2 | 3~10 | Claude Code 채팅창. 사용자가 자연어로 비교 요청. | "보증금 1억과 2억 두 가지로 비교해서 회수율 분포를 보여주세요. 나머지 조건은 동일하게요." | "한 번의 자연어 요청에 두 시나리오를 던지면, plugin이 알아서 두 번 분석합니다." | "One natural-language request, two scenarios — the plugin analyzes both automatically." |
| B-3 | 10~20 | 두 분석이 병렬로 실행되는 진행 막대. enum 값 차이만 강조 (deposit_range: 100m_to_300m vs over_500m). 나머지는 동일. | — | "변경된 변수 하나만 enum에서 재매핑됩니다. 보증금 1억은 100m_to_300m 구간, 2억은 over_500m 구간 — **그 외 5개 변수는 동일하게 유지**됩니다." | "Only one variable is re-mapped via enum — 100M maps to '100m_to_300m', 200M to 'over_500m'. The other 5 variables stay identical." |
| B-4 | 20~32 | 결과 차트 두 개를 좌우로 나란히 배치. 회수율 분포 차이가 시각적으로 강조. 차트 사이에 "차이점 요약" 카드: "1억 시나리오 — 회수율 70% 이상 표본군 X%, 2억 — Y%". | — | "결과 차트가 좌우로 나란히 표시됩니다. 회수율 분포의 차이가 한눈에 보입니다." | "The two distributions appear side by side. The difference in recovery rates is visible at a glance." |
| B-5 | 32~42 | "차이점 자동 요약" 카드 클로즈업. 막대 차이 + "표본군 N건 vs M건" + 면책 배너. | — | "**Claude이 두 시나리오의 차이점을 자동으로 요약**합니다. 단정이 아닌 분포 차이로요. 어떤 보증금이 더 좋다고 단언하지 않습니다." | "Claude automatically summarizes the differences — as distributions, not as deterministic claims. It never says one deposit is 'better.'" |
| B-6 | 42~50 | 응답 마지막 카드 — "이 정보는 의사결정 도구이며 법률 자문이 아닙니다" 면책 배너. 공공 지원 기관 4개 안내. | — | "사용자는 본인 상황에 맞는 의사결정에 이 분포를 참고할 수 있습니다. 단, **법률 자문이 아닙니다.**" | "Users can reference this distribution for their own decision-making. But it is not legal advice." |
| B-7 | 50~57 | 우측 하단 작은 "GitHub Actions Compliance Check passing" 배지 + repo URL. | — | "두 시나리오 모두 회피 7원칙 코드 검증을 통과한 응답입니다." | "Both scenarios pass the 7-principle code verification." |
| B-8 | 57~60 | ACTIGENCE 아웃트로 (간소화 버전) | — | "ACTIGENCE. 의사결정 보조 도구." | "ACTIGENCE. A decision-support tool." |

## B. 핵심 강조 멘트 정리

1. ✅ "한 번에 두 시나리오 비교" (B-2 → B-4)
2. ✅ "차이점 자동 요약" (B-5)
3. ✅ "의사결정 도구로 활용" (B-6)

---

# 시나리오 C — 시민단체 폴더 일괄 분석 (120초)

## C. 샷 콘티 (15샷)

| # | 시간 (s) | 화면 | 사용자 입력 | 내레이션 (한국어) | 자막 (영문) |
|---|---|---|---|---|---|
| C-1 | 0~5 | ACTIGENCE 로고 + 부제 (장면 전환) "B2B 시민단체 활용" | — | "전세사기 피해자 지원 시민단체가 10개의 사례 PDF를 한 번에 분석하고 싶어합니다." | "A jeonse-victim-support NGO wants to analyze 10 case PDFs at once." |
| C-2 | 5~12 | Cowork 데스크톱 앱. 좌측에 폴더 트리, 폴더 안에 case-001.pdf ~ case-010.pdf 10개. | — | "Cowork 환경에서 10개 PDF를 폴더에 정리하고 ..." | "In a Cowork environment, organize 10 PDFs into a folder ..." |
| C-3 | 12~20 | 사용자가 채팅창에 자연어로 일괄 요청. | "이 폴더 안의 10개 PDF를 모두 분석해서 양형·회수율·특별법 적용 통합 보고서를 PDF로 저장해주세요." | "... 자연어 한 줄로 일괄 분석을 요청합니다. **자유 서술이지만 plugin은 enum으로만 매핑**하니 식별 정보 유출 위험이 차단됩니다." | "... and request the batch analysis with one sentence. While the prompt is free-form, the plugin maps only to enums — so identification leaks are blocked." |
| C-4 | 20~32 | jeonse-document-extractor skill이 10번 차례로 실행되는 진행 표시. 각 PDF별 진행 막대. 가해자 식별 정보가 자동으로 빨간색 마킹 + 거부 카운트가 우측 상단에 누적됨. | — | "10개 PDF에서 객관 변수만 추출됩니다. **각 PDF의 가해자 정보는 자동으로 차단**되며, 차단 횟수가 화면에 누적 표시됩니다." | "Objective variables are extracted from all 10 PDFs. Attacker info in each is auto-blocked, and the block count accumulates on screen." |
| C-5 | 32~45 | 10개 분석 결과가 표 형태로 정리. 각 행: 케이스 ID(B-001 익명) + 7개 enum 값. 가해자 정보 칸은 모두 "🛡 처리 거부". | — | "케이스마다 익명 ID로 정리됩니다. 시민단체는 사례별 분포를 비교할 수 있지만, 가해자 식별은 plugin이 처리하지 않으니 시민단체도 받지 못합니다." | "Each case gets an anonymous ID. The NGO can compare per-case distributions but cannot receive attacker identification — the plugin does not process it." |
| C-6 | 45~55 | 10건 통합 분포 차트 — 양형 분포, 회수율 분포, 특별법 적용 비율. 차트 위 "표본 N=10건 — 일반화에 한계 있음" 경고 배너. | — | "10건 통합 분포 차트가 생성됩니다. 단, **표본이 작을 때는 '일반화에 한계가 있다'는 경고가 자동으로 함께 표시**됩니다. 분포 통계의 한계를 명시합니다." | "A combined distribution chart from 10 cases. Note — when the sample is small, a 'limited generalizability' warning is auto-displayed. Distribution-statistic limitations are made explicit." |
| C-7 | 55~67 | 통합 보고서 PDF 자동 생성 진행 표시. PDF 표지 — "ACTIGENCE 분포 분석 보고서 v1 · 2026-XX-XX · 표본 N=10건 · 본 보고서는 법률 자문이 아닙니다". | — | "통합 보고서 PDF가 자동으로 생성됩니다. 표지부터 마지막 페이지까지 워터마크와 면책 배너가 모든 페이지에 들어갑니다." | "An integrated PDF report is auto-generated. Watermarks and disclaimer banners appear on every page from cover to back." |
| C-8 | 67~77 | 보고서 내용 페이지 스크롤 — 차트, 표, 공공 지원 기관 안내. 각 페이지 하단에 "본 보고서는 법률 자문이 아닙니다 · ACTIGENCE" 푸터. 변호사·로펌 추천 0건 (강조). | — | "**변호사·로펌 추천은 보고서 어디에도 없습니다.** 공공 지원 기관 안내만 마지막 페이지에 들어갑니다." | "**Zero lawyer or law-firm recommendations anywhere in the report.** Only public support organizations appear on the last page." |
| C-9 | 77~85 | 보고서 PDF가 폴더에 저장되는 모션 — actigence-report-2026-XX-XX.pdf. 탐색기 또는 Finder 창. | — | "PDF는 사용자 폴더에 저장됩니다. 외부 클라우드 업로드 없이, ACTIGENCE 서버에도 보관되지 않습니다." | "The PDF saves to the user's local folder — no cloud upload, no ACTIGENCE-side storage." |
| C-10 | 85~95 | "이런 처리량으로 plugin은 시민단체 B2B SaaS, 법무법인 사실관계 정리 보조, 정부 부처 통계 보조에 활용 가능"이라는 텍스트 카드 3개. | — | "이런 일괄 처리 성능이 가능하기 때문에, ACTIGENCE는 시민단체·법무법인·정부 부처를 위한 B2B SaaS 모델을 검토하고 있습니다. **단, 어떤 모델에서도 회피 7원칙은 그대로 강제됩니다.**" | "Because of this batch capability, ACTIGENCE is exploring B2B SaaS models for NGOs, law firms, and government agencies. **The 7-principle compliance enforcement remains intact in every model.**" |
| C-11 | 95~105 | 사용자가 한 PDF에 가해자 본명을 의도적으로 넣고 다시 시도. plugin이 즉시 거부 + 처리 차단된 PDF 1건이 표시되는 모습. | (의도적 시도) | "한 PDF에 가해자 본명을 의도적으로 넣어보겠습니다. **plugin이 즉시 거부**하고 해당 PDF는 통합 보고서에서 제외됩니다. 거부 사유는 별도 로그에 익명으로 기록됩니다." | "If a user intentionally puts an attacker's real name in a PDF, the plugin instantly blocks it. That PDF is excluded from the report, and the rejection is logged anonymously." |
| C-12 | 105~112 | "프롬프트 인젝션 우회 시도" 화면 — 사용자가 시스템 프롬프트를 우회하려는 입력. plugin이 거부하는 모습. compliance-guardrail sub-agent 메시지: "회피 7원칙 위반 의심. 응답 차단됨." | (우회 시도) | "프롬프트 인젝션을 통해 회피 7원칙을 무력화하려는 시도도 차단됩니다. **compliance-guardrail sub-agent가 응답 직전 한 번 더 검증**합니다." | "Prompt-injection attempts to bypass the compliance principles are also blocked. A `compliance-guardrail` sub-agent re-validates the response right before delivery." |
| C-13 | 112~117 | GitHub repo + Compliance Check 배지 + actigence.ai 링크. | — | "이 모든 설계는 오픈소스로 공개되어 있고, 매 push마다 자동 검증됩니다." | "All this design is open source and auto-verified on every push." |
| C-14 | 117~120 | ACTIGENCE 아웃트로 카드 (확장 버전) — 이메일, 도메인, GitHub URL, MIT License, "Phase 2: 보이스피싱·기획부동산·임금체불·중고거래 사기 plugin 예정" 자막. | — | "ACTIGENCE. 다음 plugin은 보이스피싱, 기획부동산, 임금체불, 중고거래 사기로 이어집니다. 함께 만들어주실 분, cio@actigence.ai." | "ACTIGENCE. Next plugins coming: voice phishing, planned real-estate fraud, wage delinquency, secondhand-market fraud. Want to contribute? cio@actigence.ai." |
| C-15 | 120 | 페이드 아웃 (검은 화면 + ACTIGENCE 로고만) | — | — | — |

## C. 핵심 강조 멘트 정리

1. ✅ "수십 건 사례 한 번에" (C-3 → C-6)
2. ✅ "보고서 PDF 즉시 저장" (C-7 → C-9)
3. ✅ "가해자 정보 마스킹 자동 검증" (C-4, C-5, C-11)
4. ✅ "B2B SaaS 모델 가능성" (C-10)

---

## 8. 영상 제작 워크플로 (인간 작업)

### 8.1 사전 준비 (30분~1시간)

1. 시연용 가짜 PDF 10건 준비 (case-001.pdf ~ case-010.pdf). 각 PDF에는 가짜 임대인 이름·주소·전화번호를 넣되, 화면에 비치는 부분은 마스킹 또는 흐림.
2. ACTIGENCE 로고 PNG (투명 배경) 준비
3. 인트로/아웃트로 카드 디자인 (Figma 또는 Canva)
4. 테스트 Claude 계정으로 Cowork/Claude Code 환경 정리 (홈 화면 단정하게)
5. 영상 캡처 도구 준비 (OBS Studio 권장 — 오픈소스, 1920×1080, 30fps 또는 60fps)

### 8.2 녹화 (1~2시간)

- 시나리오별로 1회 리허설 후 본 녹화 1~2회
- 발화 길이를 콘티 시간 ±2초 이내로 맞춤
- 마우스 움직임은 천천히, 클릭은 한 박자 쉬고
- 실수 시 즉시 다시 녹화 (편집 후 잘라내기 어려움)

### 8.3 편집 (2~4시간 / 영상)

- 영상: DaVinci Resolve (비용 발생 없는 표준 버전) 또는 Final Cut Pro 사용
- 자막: 한국어 burn-in + 영어 .srt 별도 파일 (YouTube 자동 인식)
- BGM: 라이선스가 안전한 라이브러리 (YouTube Audio Library, Pixabay Music) 사용
- 워터마크: 우측 하단 고정
- 컬러 보정: 파란색 ACTIGENCE 톤으로 통일

### 8.4 업로드 (30분)

- YouTube 비공개(Unlisted) 또는 공개 업로드
- 영상 제목 / 설명 / 태그 / 썸네일 통일된 스타일
- 영상 3편을 단일 재생목록(Playlist) "ACTIGENCE jeonse-explorer Demo"로 묶음
- 등록 신청서에 3개 URL 모두 첨부

### 8.5 영상 제목·설명 템플릿

**시나리오 A**:
- 제목: "ACTIGENCE jeonse-explorer — 단일 PDF 자동 분석 90초 시연"
- 설명: 본 영상은 Anthropic Plugin Directory 등록 신청용 시연입니다. 본 plugin은 법률 자문이 아니며, 변호사를 매칭·추천하지 않습니다. 더 자세한 내용은 https://github.com/yonghot/actigence-marketplace 참고.

**시나리오 B**:
- 제목: "ACTIGENCE jeonse-explorer — 보증금 시나리오 비교 60초 시연"

**시나리오 C**:
- 제목: "ACTIGENCE jeonse-explorer — 시민단체 일괄 분석 120초 시연 (B2B 활용)"

---

## 9. 영상 제작 후 PROGRESS.md 업데이트 (인간 작업)

영상 3편 업로드 완료 후 다음 정보를 PROGRESS.md Stage 3.2 항목에 기재:

```
- 시나리오 A YouTube URL: https://youtube.com/watch?v=[ID]
- 시나리오 B YouTube URL: https://youtube.com/watch?v=[ID]
- 시나리오 C YouTube URL: https://youtube.com/watch?v=[ID]
- 재생목록 URL: https://youtube.com/playlist?list=[ID]
- 영상 제작자: [본인 또는 외주 회사명]
- 외주 비용: [있으면 기재]
```

이 정보들이 등록 신청서(`outreach/submission-form-filled.md`)에 자동 인용된다.

---

문서 작성 일자: 2026-05-06
문서 버전: v1.0 (Stage 3.2 산출물)
