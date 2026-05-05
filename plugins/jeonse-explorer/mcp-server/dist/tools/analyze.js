/**
 * analyze_jeonse_fraud_distribution 도구 핸들러
 *
 * 사용자 입력 7변수를 받아 3개 분포(특별법 적용·회수·양형)를 계산하여 반환.
 * Output에는 disclaimer와 official_resources가 const로 강제 포함됨.
 */
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { calculateEligibilityDistribution, calculateRecoveryDistribution, calculateSentencingDistribution, } from '../distributions.js';
// ═══════════════════════════════════════════════════════════════
// Input Schema (모두 enum 강제, 자유 텍스트 0개)
// ═══════════════════════════════════════════════════════════════
export const analyzeInputSchema = z.object({
    deposit_range: z.enum(['under_50m', '50m_to_100m', '100m_to_300m', '300m_to_500m', 'over_500m']).describe('보증금 액수 구간 (5천만원 이하/5천~1억/1억~3억/3억~5억/5억 초과)'),
    priority_right: z.enum(['full_protection', 'registration_only', 'lease_registration', 'jeonse_right', 'none']).describe('우선변제권 확보 여부 (전입+확정일자/전입만/임차권등기/전세권/없음)'),
    landlord_property_count: z.enum(['one', 'two_to_ten', 'ten_to_hundred', 'over_hundred', 'unknown']).describe('임대인의 임차주택 보유 수 (1채/2~10채/10~100채/100채+/모름)'),
    auction_status: z.enum(['in_progress', 'decided', 'applied', 'not_started']).describe('경매·공매 진행 단계'),
    investigation_status: z.enum(['indicted', 'investigating', 'complaint_filed', 'no_complaint', 'unknown']).describe('임대인 수사 단계'),
    victim_count: z.enum(['self_only', 'two_to_ten', 'ten_to_hundred', 'over_hundred', 'unknown']).describe('확인된 다른 피해자 수'),
    region: z.enum([
        'seoul', 'busan', 'daegu', 'incheon', 'gwangju', 'daejeon', 'ulsan',
        'sejong', 'gyeonggi', 'gangwon', 'chungbuk', 'chungnam',
        'jeonbuk', 'jeonnam', 'gyeongbuk', 'gyeongnam', 'jeju',
    ]).describe('거주 광역시도'),
});
// MCP listTools에서 사용할 JSON Schema (Zod → JSON Schema 변환)
export const analyzeInputJsonSchema = zodToJsonSchema(analyzeInputSchema, {
    $refStrategy: 'none',
    target: 'jsonSchema7',
});
// ═══════════════════════════════════════════════════════════════
// 강제 const 필드
// ═══════════════════════════════════════════════════════════════
const DISCLAIMER = `본 결과는 공개 판례·법령 통계 분석 결과이며, 법률 자문이나 사건 결과 예측이 아닙니다.
ACTIGENCE는 변호사가 소속되지 않은 데이터 분석 회사입니다.
개별 사건은 반드시 공식 지원 기관(국토부 전세사기피해자지원센터, 대한법률구조공단)에 문의하시거나
변호사와 상담하시기 바랍니다.`;
const OFFICIAL_RESOURCES = [
    {
        name: '국토교통부 전세사기피해자지원센터',
        url: 'https://www.jeonse.kgeop.go.kr',
        description: '특별법 피해자 결정신청, 긴급 주거지원',
    },
    {
        name: '대한법률구조공단',
        url: 'https://www.klac.or.kr',
        phone: '132',
        description: '저소득층 무료 법률 상담 (소득 기준 충족 시)',
    },
    {
        name: '검찰청 범죄피해자 지원실',
        url: 'https://www.spo.go.kr',
        description: '형사 사건 피해자 지원',
    },
    {
        name: '대한변호사협회 변호사 찾기',
        url: 'https://www.koreanbar.or.kr',
        description: '지역·전문분야별 변호사 검색 (특정 변호사 추천 X)',
    },
];
const WATERMARK_TEXT = '법률 자문 아님 · 데이터 분석 도구 · ACTIGENCE';
// ═══════════════════════════════════════════════════════════════
// Handler
// ═══════════════════════════════════════════════════════════════
export async function analyzeJeonseFraudDistribution(input) {
    // 3개 분포를 병렬 계산
    const [eligibility, recovery, sentencing] = await Promise.all([
        calculateEligibilityDistribution(input),
        calculateRecoveryDistribution(input),
        calculateSentencingDistribution(input),
    ]);
    // UI 리소스 URI (Claude App 컴포넌트 렌더링용)
    // 실제 환경에서는 https://jeonse-explorer.actigence.ai/ui/result?... 형태
    const uiResourceUri = buildUIResourceUri(input, { eligibility, recovery, sentencing });
    return {
        disclaimer: DISCLAIMER,
        eligibility_distribution: eligibility,
        recovery_distribution: recovery,
        sentencing_distribution: sentencing,
        official_resources: OFFICIAL_RESOURCES,
        ui_resource_uri: uiResourceUri,
        watermark_text: WATERMARK_TEXT,
        metadata: {
            analyzed_at: new Date().toISOString(),
            analysis_version: '1.0.0',
            operator: 'ACTIGENCE (non-lawyer data analysis company)',
            compliance_doc: 'https://github.com/yonghot/actigence-marketplace/blob/main/plugins/jeonse-explorer/COMPLIANCE.md',
            data_persisted: false,
            data_persistence_note: '본 도구는 사용자 입력·결과를 저장하지 않습니다. 응답 반환 즉시 메모리에서 폐기됩니다.',
        },
        presentation_guidelines: {
            forbidden_expressions: [
                '"예상", "예측", "진단", "추천" 단어 사용',
                '"당신은 ~입니다", "~할 것입니다" 단정 표현',
                '변호사·로펌 추천',
                '"무료" 단어',
                '판결문 양식 흉내 (주문/이유 표제)',
            ],
            required_actions: [
                '응답 첫 줄에 disclaimer 표시',
                'ui_resource_uri로 차트 컴포넌트 렌더링 (텍스트로 차트 다시 묘사 X)',
                '응답 끝에 official_resources 4개 표시',
                '응답 끝에 면책 문구 재표시',
            ],
        },
    };
}
function buildUIResourceUri(input, distributions) {
    // 결과 페이지로의 URI. UI 컴포넌트가 이를 받아 렌더링.
    const baseUrl = process.env.MCP_BASE_URL ?? 'https://jeonse-explorer.actigence.ai';
    const params = new URLSearchParams({
        deposit: input.deposit_range,
        priority: input.priority_right,
        landlord: input.landlord_property_count,
        auction: input.auction_status,
        investigation: input.investigation_status,
        victims: input.victim_count,
        region: input.region,
    });
    return `${baseUrl}/ui/result?${params.toString()}`;
}
//# sourceMappingURL=analyze.js.map