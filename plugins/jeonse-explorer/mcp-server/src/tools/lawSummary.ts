/**
 * get_jeonse_fraud_law_summary 도구 핸들러
 *
 * 전세사기 관련 법령·제도에 대한 공식 출처 기반 요약 제공.
 * 법률 자문이 아닌 일반 정보 전달 전용.
 *
 * 카테고리:
 * - law_overview: 전세사기특별법 개요
 * - eligibility_requirements: 인정 요건 4가지
 * - recovery_options: 회수 메커니즘 (우선변제권·임차권등기·전세권·LH 매입)
 * - sentencing_guidelines: 사기죄 양형기준 5유형
 * - procedure_guide: 피해자 결정신청 절차
 */

import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { getSpecialActArticles } from '../supabase.js';

export const lawSummaryInputSchema = z.object({
  category: z.enum([
    'law_overview',
    'eligibility_requirements',
    'recovery_options',
    'sentencing_guidelines',
    'procedure_guide',
  ]).describe('요약 카테고리'),
});

export type LawSummaryInput = z.infer<typeof lawSummaryInputSchema>;

export const lawSummaryInputJsonSchema = zodToJsonSchema(lawSummaryInputSchema, {
  $refStrategy: 'none',
  target: 'jsonSchema7',
});

const DISCLAIMER = `본 정보는 공개 법령·정부 자료 기반의 일반 정보이며, 법률 자문이 아닙니다.
개별 사건의 적용 여부는 공식 지원 기관 또는 변호사와 상담하시기 바랍니다.`;

const OFFICIAL_RESOURCES = [
  { name: '국가법령정보센터', url: 'https://www.law.go.kr' },
  { name: '국토교통부 전세사기피해자지원센터', url: 'https://www.jeonse.kgeop.go.kr' },
  { name: '대한법률구조공단', url: 'https://www.klac.or.kr', phone: '132' },
  { name: '대법원 양형위원회', url: 'https://sc.scourt.go.kr' },
];

export async function getJeonseFraudLawSummary(input: LawSummaryInput) {
  const articles = await getSpecialActArticles(input.category);
  const summary = SUMMARIES[input.category];

  return {
    disclaimer: DISCLAIMER,
    category: input.category,
    title: summary.title,
    summary: summary.content,
    key_points: summary.key_points,
    articles_referenced: articles ?? [],
    official_resources: OFFICIAL_RESOURCES,
    sources: summary.sources,
    last_verified: summary.last_verified,
    presentation_guidelines: {
      forbidden_expressions: [
        '특정 사건의 적용 가능성 단정',
        '변호사·로펌 추천',
        '법령 본문 100자 이상 그대로 인용 (저작권 회피)',
      ],
    },
  };
}

const SUMMARIES: Record<LawSummaryInput['category'], {
  title: string;
  content: string;
  key_points: string[];
  sources: Array<{ name: string; url: string }>;
  last_verified: string;
}> = {
  law_overview: {
    title: '전세사기피해자 지원 및 주거안정에 관한 특별법 개요',
    content:
      '2023년 6월 1일 시행된 한시법으로, 전세사기 피해자에게 긴급 주거지원·금융지원·법적 보호를 제공하기 위해 제정. 피해자 결정신청을 통해 인정받으면 우선매수권·LH 매입·경공매 유예·금융 지원 등의 혜택을 받을 수 있다. 시행 후 누적 35,909건이 인정되었다(2025.12 기준, 가결률 약 62.9%).',
    key_points: [
      '시행일: 2023년 6월 1일',
      '한시법 (10년 시한)',
      '관할 부처: 국토교통부',
      '심의 기구: 전세사기피해자지원위원회',
      '핵심 혜택: 우선매수권, LH 매입, 경공매 유예, 금융 지원',
    ],
    sources: [
      { name: '국가법령정보센터 - 전세사기특별법', url: 'https://www.law.go.kr/법령/전세사기피해자지원및주거안정에관한특별법' },
      { name: '국토교통부 보도자료', url: 'https://www.molit.go.kr' },
    ],
    last_verified: '2025-12',
  },

  eligibility_requirements: {
    title: '전세사기특별법 제3조 — 피해자 인정 요건 4가지',
    content:
      '전세사기특별법 제3조에 따라 피해자로 인정되려면 다음 4가지 요건을 모두 충족해야 한다. 4가지가 모두 충족된다고 자동 인정되는 것은 아니며, 위원회 심의를 거쳐 결정된다.',
    key_points: [
      '요건 1: 주택의 인도 + 주민등록(전입신고)을 마치고 확정일자를 갖춘 경우. 임차권등기 또는 전세권 설정도 포함.',
      '요건 2: 임대차보증금이 5억원 이하 (시도별로 7억원까지 조정 가능)',
      '요건 3: 임대인의 파산·회생, 경공매 절차 개시, 또는 집행권원 확보 등 다수 임차인의 보증금 미반환이 발생·예상됨',
      '요건 4: 임대인이 보증금반환채무를 이행하지 않을 의도가 있다고 의심할 만한 상당한 이유 (수사 개시, 기망, 다수 주택 취득, 이행능력 없는 자에게 소유권 양도 등)',
      '결정 절차: 거주 시·도청 또는 국토교통부에 신청 → 위원회 심의 → 결정 통지 (보통 60일 이내)',
      '2025.12 기준 누적 인정: 35,909건, 가결률 약 62.9%',
    ],
    sources: [
      { name: '전세사기특별법 제3조', url: 'https://www.law.go.kr/법령/전세사기피해자지원및주거안정에관한특별법/제3조' },
      { name: '국토교통부 - 피해자 결정신청 안내', url: 'https://www.jeonse.kgeop.go.kr' },
    ],
    last_verified: '2025-12',
  },

  recovery_options: {
    title: '보증금 회수 메커니즘 (우선변제권·임차권등기·LH 매입)',
    content:
      '전세보증금 회수는 다층적 메커니즘으로 보호된다. 가장 강력한 보호는 우선변제권(전입신고 + 확정일자)이며, 그 외 임차권등기명령·전세권 설정·LH 우선매수권·매입 제도 등이 있다. 피해자 인정 시 LH 매입 가능성이 추가된다.',
    key_points: [
      '우선변제권: 전입신고 + 확정일자 = 경공매 시 후순위 채권자에 우선하여 배당 받을 권리',
      '소액임차인 최우선변제: 보증금이 일정 금액 이하면 다른 채권자보다 먼저 일정액 보장 (서울 5,500만원 / 광역시·세종 4,800만원 등, 2024 기준)',
      '임차권등기명령: 전출 후에도 우선변제권 유지 (계약 종료 후 신청)',
      '전세권 설정: 별도 등기로 우선변제권 보장 (계약 시 임대인 동의 필요)',
      'LH 우선매수권: 특별법 인정 피해자가 경매 시 LH보다 먼저 매수 가능',
      'LH 매입 제도: 피해 주택을 LH가 직접 매입하여 피해자에게 임대 (2025.12 기준 누적 4,898가구)',
      '회수율 분포: 우선변제권 + 경공매 진행 = 중앙값 약 60~80% / 우선변제권 없음 = 중앙값 0~20% / 빌라왕 사건 후순위 = 중앙값 15~30%',
    ],
    sources: [
      { name: '주택임대차보호법 (우선변제권)', url: 'https://www.law.go.kr/법령/주택임대차보호법' },
      { name: '국토교통부 LH 매입 통계', url: 'https://www.molit.go.kr' },
    ],
    last_verified: '2025-12',
  },

  sentencing_guidelines: {
    title: '사기죄 양형기준 5유형 (대법원 양형위원회)',
    content:
      '대법원 양형위원회의 사기범죄 양형기준은 이득액에 따라 5개 유형으로 구분된다. 일반사기와 조직적 사기로 분류되며, 조직적 사기는 가중된다. 5억원 이상은 특정경제범죄가중처벌법(특경법) 적용 대상이다. 빌라왕 사건은 다수의 피해자·주택을 동원한 조직적 사기로 분류되는 경우가 많다.',
    key_points: [
      '제1유형: 이득액 1억원 미만 — 기본 6개월~1년 6개월',
      '제2유형: 이득액 1억~5억원 — 기본 1년~4년',
      '제3유형: 이득액 5억~50억원 (특경법) — 3년 이상',
      '제4유형: 이득액 50억~300억원 (특경법) — 4년~7년',
      '제5유형: 이득액 300억원 이상 (특경법) — 6년 이상~무기',
      '조직적 사기 분류: 다수인이 역할을 분담하여 사전에 치밀하게 계획·전문적으로 범행 (보이스피싱·기획부동산 사기·다단계 사기 등)',
      '특별양형인자: 자백·합의·전과·피해 회복 정도가 형량을 크게 좌우',
      '집행유예 가능성: 1유형은 집행유예 가능, 4·5유형은 사실상 어려움',
    ],
    sources: [
      { name: '대법원 양형위원회 - 사기범죄 양형기준 (2022 개정)', url: 'https://sc.scourt.go.kr/sc/krsc/criterion/criterion_10/fraud_01.jsp' },
      { name: '특정경제범죄 가중처벌 등에 관한 법률', url: 'https://www.law.go.kr/법령/특정경제범죄가중처벌등에관한법률' },
    ],
    last_verified: '2025-12',
  },

  procedure_guide: {
    title: '전세사기 피해자 결정신청 절차',
    content:
      '특별법상 피해자로 인정받으려면 거주 시·도청 또는 국토교통부에 결정신청서를 제출한다. 심의 기간은 통상 60일 이내이며, 인정 시 다양한 지원 혜택을 받을 수 있다. 신청 비용은 없으며 변호사 대리 없이 본인 신청도 가능하다.',
    key_points: [
      '신청 장소: 거주 시·도청 또는 국토교통부 전세사기피해자지원센터',
      '신청 방법: 온라인(jeonse.kgeop.go.kr) 또는 방문 신청',
      '필요 서류: 임대차계약서, 주민등록등본, 임차주택 등기부등본, 보증금 미반환 입증자료 (경매 알림·내용증명 등), 임대인 다수 주택 보유 입증(가능 시)',
      '심의 기간: 신청 후 60일 이내 (사정상 연장 가능)',
      '인정 후 혜택: LH 우선매수권, LH 매입 신청 자격, 경공매 유예, 금융 지원, 긴급 주거지원',
      '기각 시: 이의 신청 가능 (30일 이내)',
      '지원 단체: 대한법률구조공단(132), 시민단체 (전세사기·깡통전세 피해자 전국대책위원회 등)',
    ],
    sources: [
      { name: '국토교통부 - 피해자 결정신청 안내', url: 'https://www.jeonse.kgeop.go.kr' },
      { name: '대한법률구조공단', url: 'https://www.klac.or.kr' },
    ],
    last_verified: '2025-12',
  },
};
